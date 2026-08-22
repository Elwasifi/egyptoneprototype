import {
  ALWAYS_AUDITED, DATA_CLASS_RANK, ADMIN_ROLES, GOVERNMENT_ROLES, PROVIDER_ROLES,
  type DataClass, type Role,
} from '@egypt-one/types';

/* ------------------------------------------------------------------- RBAC */

export type Action = 'read' | 'write' | 'decide' | 'export';

export interface Principal {
  userId?: string;
  roles: Role[];
  organisationId?: string;
  consents: string[];
  /** Stated reason for the access. ABAC rules can require one. */
  purpose?: string;
  breakGlass?: boolean;
}

export interface AccessRequest {
  resource: string;
  action: Action;
  dataClass: DataClass;
  /** Owner of the record, for "own data" rules. */
  ownerUserId?: string;
  ownerOrganisationId?: string;
  /** Number of individuals behind an aggregate, for re-identification checks. */
  cohortSize?: number;
}

export interface AccessDecision {
  allow: boolean;
  reason: string;
  audited: boolean;
  /** Fields the caller must not receive even when the request is allowed. */
  redact: string[];
}

/** Maximum data class each role may reach at all, before any per-resource rule. */
const CEILING: Partial<Record<Role, DataClass>> = {
  TOURIST: 'PERSONAL', DOMESTIC_TRAVELER: 'PERSONAL', INVESTOR: 'PERSONAL',
  RESEARCHER: 'PERSONAL', PARTNER: 'PARTNER',
  GOVERNMENT_ANALYST: 'RESTRICTED_GOVERNMENT', GOVERNMENT_OFFICER: 'RESTRICTED_GOVERNMENT',
  MODERATOR: 'PERSONAL', SUPPORT_AGENT: 'PERSONAL', FINANCE: 'SENSITIVE',
  SECURITY: 'SENSITIVE', ADMIN: 'SENSITIVE', SUPER_ADMIN: 'SENSITIVE', SYSTEM: 'SENSITIVE',
};

const has = (p: Principal, roles: Role[]) => p.roles.some((r) => roles.includes(r));

/**
 * Combined RBAC + ABAC decision.
 *
 * Attributes considered: role, organisation, purpose, data class, consent,
 * ownership, cohort size and break-glass. Every SENSITIVE or
 * RESTRICTED_GOVERNMENT decision is audited whether it allows or denies.
 */
export function decide(p: Principal, req: AccessRequest): AccessDecision {
  const audited = ALWAYS_AUDITED.includes(req.dataClass) || req.action === 'export' || !!p.breakGlass;
  const deny = (reason: string): AccessDecision => ({ allow: false, reason, audited, redact: [] });
  const allow = (reason: string, redact: string[] = []): AccessDecision => ({ allow: true, reason, audited, redact });

  // Public content is readable by anyone; writing it is an editorial action.
  if (req.dataClass === 'PUBLIC') {
    if (req.action === 'read') return allow('Public content.');
    if (has(p, [...ADMIN_ROLES, 'MODERATOR'])) return allow('Editorial role may publish public content.');
    if (has(p, PROVIDER_ROLES) && req.ownerOrganisationId && req.ownerOrganisationId === p.organisationId) {
      return allow('Provider editing its own listing.');
    }
    return deny('Publishing public content requires an editorial or owning-provider role.');
  }

  // Ceiling check.
  const ceiling = p.roles.map((r) => CEILING[r]).filter(Boolean) as DataClass[];
  const best = ceiling.length ? Math.max(...ceiling.map((c) => DATA_CLASS_RANK[c])) : -1;
  if (best < DATA_CLASS_RANK[req.dataClass] && !p.breakGlass) {
    return deny(`No held role reaches the ${req.dataClass.replace(/_/g, ' ').toLowerCase()} data class.`);
  }

  // Own personal data.
  if (req.dataClass === 'PERSONAL') {
    if (p.userId && req.ownerUserId === p.userId) return allow('Subject accessing their own record.');
    if (has(p, ['SUPPORT_AGENT', ...ADMIN_ROLES])) {
      return allow('Support access to a customer record.', ['passwordHash', 'mfaSecret', 'preciseLocation']);
    }
    if (has(p, PROVIDER_ROLES) && req.ownerOrganisationId === p.organisationId) {
      return allow('Provider accessing its own customer record.', ['email', 'phone', 'nationality']);
    }
    if (has(p, GOVERNMENT_ROLES)) return deny('Government roles do not receive individual personal data.');
    return deny('Not the subject and no delegated access.');
  }

  // Health, financial, identity and precise location.
  if (req.dataClass === 'SENSITIVE') {
    if (p.userId && req.ownerUserId === p.userId) return allow('Subject accessing their own sensitive record.');
    if (req.resource.startsWith('health') && !p.consents.includes('HEALTH_DATA')) {
      return deny('Health data requires an explicit health-data consent record.');
    }
    if (req.resource.startsWith('location') && !p.consents.includes('LOCATION')) {
      return deny('Location access requires TRIP_MODE or EMERGENCY_MODE consent.');
    }
    if (req.resource.startsWith('finance') && has(p, ['FINANCE', ...ADMIN_ROLES])) return allow('Finance role.');
    if (p.breakGlass && has(p, ['SECURITY', 'SUPER_ADMIN'])) {
      return { allow: true, reason: 'Break-glass access. Recorded and reviewable.', audited: true, redact: [] };
    }
    if (!p.purpose) return deny('Sensitive access requires a stated purpose.');
    if (has(p, ADMIN_ROLES)) return allow('Administrative access with a stated purpose.', ['rawHealthRecord', 'geneticData']);
    return deny('No rule grants this sensitive access.');
  }

  // Restricted government.
  if (req.dataClass === 'RESTRICTED_GOVERNMENT') {
    if (!has(p, [...GOVERNMENT_ROLES])) return deny('Restricted government data is limited to authorised government roles.');
    if (!p.purpose) return deny('Restricted government access requires a stated purpose and legal basis.');
    if (req.action !== 'read' && !has(p, ['GOVERNMENT_OFFICER'])) return deny('Only an officer role may act on restricted data.');
    if (typeof req.cohortSize === 'number' && req.cohortSize < 25) {
      return deny(`Aggregate cohort of ${req.cohortSize} is below the re-identification threshold of 25.`);
    }
    return allow('Authorised government access with a stated purpose.', ['userId', 'email', 'phone', 'preciseLocation']);
  }

  // Partner data.
  if (req.dataClass === 'PARTNER') {
    if (has(p, ['PARTNER', ...PROVIDER_ROLES]) && req.ownerOrganisationId === p.organisationId) return allow('Partner accessing its own data.');
    if (has(p, [...ADMIN_ROLES, ...GOVERNMENT_ROLES, 'FINANCE'])) return allow('Oversight role.');
    return deny('Partner data is limited to the owning organisation and oversight roles.');
  }

  return deny('No matching rule. Default deny.');
}

/* ------------------------------------------------------------------ audit */

export interface AuditEntry {
  actorId?: string;
  actorRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  dataClass: DataClass;
  purpose?: string;
  decision: 'ALLOW' | 'DENY';
  outcome?: string;
  at: string;
}

const memoryLog: AuditEntry[] = [];

/** In DEMO_MODE the audit trail lives in memory; in production it writes to the audit_logs table. */
export function audit(entry: Omit<AuditEntry, 'at'>) {
  const row: AuditEntry = { ...entry, at: new Date().toISOString() };
  memoryLog.push(row);
  if (memoryLog.length > 500) memoryLog.shift();
  return row;
}
export const recentAudit = (limit = 50) => memoryLog.slice(-limit).reverse();

/* --------------------------------------------------------------- guarding */

/** Convenience wrapper: decide, record, and either run or refuse. */
export async function guarded<T>(
  p: Principal, req: AccessRequest, run: () => Promise<T>,
): Promise<{ ok: true; data: T } | { ok: false; decision: AccessDecision }> {
  const decision = decide(p, req);
  if (decision.audited) {
    audit({
      actorId: p.userId, actorRole: p.roles.join(','), action: req.action,
      resource: req.resource, dataClass: req.dataClass, purpose: p.purpose,
      decision: decision.allow ? 'ALLOW' : 'DENY', outcome: decision.reason,
    });
  }
  if (!decision.allow) return { ok: false, decision };
  return { ok: true, data: await run() };
}

/* ------------------------------------------------- rate limiting (in-memory) */

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, perMinute: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return { allowed: true, remaining: perMinute - 1 };
  }
  b.count += 1;
  return { allowed: b.count <= perMinute, remaining: Math.max(0, perMinute - b.count) };
}

/* ------------------------------------------------------------ RBAC matrix */

export const RBAC_MATRIX: { resource: string; dataClass: DataClass; roles: Partial<Record<string, string>> }[] = [
  { resource: 'Public content', dataClass: 'PUBLIC', roles: { Tourist: 'R', Provider: 'R', Partner: 'R', 'Gov analyst': 'R', 'Gov officer': 'R', Admin: 'RW' } },
  { resource: 'Own trip & booking', dataClass: 'PERSONAL', roles: { Tourist: 'RW', Provider: '—', Partner: '—', 'Gov analyst': '—', 'Gov officer': '—', Admin: 'R (audited)' } },
  { resource: 'Provider inventory', dataClass: 'PARTNER', roles: { Tourist: '—', Provider: 'RW (own)', Partner: '—', 'Gov analyst': '—', 'Gov officer': 'R', Admin: 'RW' } },
  { resource: 'Verification decision', dataClass: 'PARTNER', roles: { Tourist: '—', Provider: '—', Partner: '—', 'Gov analyst': '—', 'Gov officer': 'RW', Admin: 'RW' } },
  { resource: 'Aggregated tourism intelligence', dataClass: 'RESTRICTED_GOVERNMENT', roles: { Tourist: '—', Provider: 'own slice', Partner: 'own slice', 'Gov analyst': 'R', 'Gov officer': 'R', Admin: 'R' } },
  { resource: 'Personal data', dataClass: 'PERSONAL', roles: { Tourist: 'own', Provider: 'own customers (minimised)', Partner: '—', 'Gov analyst': '✗', 'Gov officer': '✗', Admin: 'R (audited)' } },
  { resource: 'Health data', dataClass: 'SENSITIVE', roles: { Tourist: 'own', Provider: 'own patients', Partner: '✗', 'Gov analyst': '✗', 'Gov officer': '✗', Admin: '✗ (break-glass, audited)' } },
  { resource: 'Precise location', dataClass: 'SENSITIVE', roles: { Tourist: 'own + consent', Provider: '✗', Partner: '✗', 'Gov analyst': '✗', 'Gov officer': 'emergency only', Admin: '✗' } },
  { resource: 'Restricted government data', dataClass: 'RESTRICTED_GOVERNMENT', roles: { Tourist: '✗', Provider: '✗', Partner: '✗', 'Gov analyst': 'scoped', 'Gov officer': 'scoped', Admin: '✗' } },
  { resource: 'Integration state', dataClass: 'PARTNER', roles: { Tourist: '✗', Provider: 'R (own)', Partner: 'R (own)', 'Gov analyst': 'R', 'Gov officer': 'R', Admin: 'RW' } },
  { resource: 'Revenue rules', dataClass: 'PARTNER', roles: { Tourist: '✗', Provider: 'own', Partner: 'own', 'Gov analyst': '✗', 'Gov officer': '✗', Admin: 'RW' } },
  { resource: 'Audit log', dataClass: 'SENSITIVE', roles: { Tourist: '✗', Provider: '✗', Partner: '✗', 'Gov analyst': '✗', 'Gov officer': '✗', Admin: 'R' } },
];
