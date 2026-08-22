# Security

## Identity & authorization

Combined RBAC + ABAC, implemented in `packages/security/src/index.ts`:

- **RBAC**: 22 roles (`packages/types/src/roles.ts`), grouped into
  `PROVIDER_ROLES`, `GOVERNMENT_ROLES`, `ADMIN_ROLES`. A `CEILING` map caps
  the maximum `DataClass` each role can ever reach, regardless of context.
- **ABAC**: `decide(principal, request)` additionally checks consent scope
  (location, health data), purpose declaration, break-glass access, and a
  cohort-size re-identification threshold (25) before releasing any
  aggregate that could otherwise be re-identified.

`RBAC_MATRIX` is the literal, reviewable matrix (12 resources × 6 role
columns) rendered on `/admin/users` and `/admin/security` — not a document
that can drift from the code, because the page renders the same constant
the enforcement code imports.

## Data classification

Five classes, ranked (`packages/types/src/data-class.ts`):
`PUBLIC < PARTNER < PERSONAL < SENSITIVE < RESTRICTED_GOVERNMENT`.
`ALWAYS_AUDITED` names the classes that are logged on every read, not just
on write/export.

## Audit

`audit()` appends a structured `AuditEntry` (actor, action, resource,
resourceId, dataClass, purpose, decision, outcome, timestamp) to an
in-memory log (Postgres-backed `audit_logs` table in production);
`recentAudit()` powers `/admin/audit`. `guarded()` wraps a decide → audit →
execute sequence so a call site cannot accidentally skip the audit step.

## Rate limiting

`rateLimit(key, perMinute)` is an in-memory limiter used both directly and
inside the MCP gateway (`RATE_LIMIT` refusal code) — see
[`MCP_ARCHITECTURE.md`](./MCP_ARCHITECTURE.md).

## Consent & privacy

Location, health data and genetic/origin-adjacent signals are gated by
explicit, revocable consent scopes surfaced at `/account/consent`. Location
defaults OFF; **Trip Mode** and **Emergency Mode** are separate grants, not
a single "share my location" toggle. Consent state is checked both by
`decide()` and by the agent orchestrator's `requiresConsent` check before an
agent is even allowed to run.

## Hardening (application layer)

`next.config.mjs` sets `X-Frame-Options`, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy` and a Content-Security-Policy on
every response.

## Known gaps (tracked honestly)

- The Prisma schema (`packages/database/prisma/schema.prisma`) has been
  hand-formatted and reviewed but has **not** been run through
  `prisma generate`/`validate` in this sandbox (no network access to
  `binaries.prisma.sh`). Treat it as unverified until that step runs in an
  environment with access.
- No penetration testing, dependency-vulnerability scanning, or secrets
  scanning has been run against this repository yet.
