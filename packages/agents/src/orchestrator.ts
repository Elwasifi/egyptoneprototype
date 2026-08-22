import { AGENTS, agentByKey, type AgentSpec } from './registry';
import type { Role } from '@egypt-one/types';

/**
 * Concierge orchestration.
 *
 * The user talks to one assistant. This module decides which specialist should
 * answer, checks that the caller is allowed to reach it, and hands the composer
 * the source-labelling policy that specialist must satisfy.
 *
 * Routing is deterministic and inspectable rather than hidden inside a prompt,
 * so the boundary between "the model decided" and "the platform decided" stays
 * visible in the audit log and in the admin console.
 */

export interface RouteMatch {
  agent: AgentSpec;
  confidence: number;
  matched: string[];
}

export interface RouteDecision {
  primary: RouteMatch;
  secondary: RouteMatch[];
  allowed: boolean;
  refusal?: string;
  /** Consent scopes the caller must hold before the primary agent can run. */
  missingConsents: string[];
}

type Signal = { agent: string; weight: number; patterns: RegExp[] };

const SIGNALS: Signal[] = [
  { agent: 'TRIP_PLANNER', weight: 3, patterns: [/\b(itinerar|plan|days? in egypt|trip|route|schedule|visit.*(days|week)|holiday|honeymoon)\b/i, /\b\d+\s*(day|night|week)s?\b/i] },
  { agent: 'HERITAGE', weight: 3, patterns: [/\b(temple|tomb|pyramid|sphinx|museum|pharaoh|dynasty|hieroglyph|era|ruler|history|heritage|monument|archaeolog|coptic|islamic cairo|ottoman|ptolemaic|mummy|obelisk)\b/i] },
  { agent: 'BOOKING', weight: 3, patterns: [/\b(book|reserve|availabilit|price|cheapest|room|flight|ticket|hotel rate|check[- ]?in)\b/i] },
  { agent: 'GUIDE_MATCH', weight: 4, patterns: [/\b(guide|tour guide|interpreter|escort|speaking guide)\b/i, /\b(french|german|russian|chinese|japanese|spanish|italian|greek|hindi|korean)[- ]speaking\b/i] },
  { agent: 'LANGUAGE', weight: 2, patterns: [/\b(translate|in arabic|say .* in|language|how do you say)\b/i] },
  { agent: 'SAFETY', weight: 5, patterns: [/\b(safe|safety|emergency|police|lost passport|stolen|embassy|consulate|missing|ambulance|help me|danger)\b/i] },
  { agent: 'MEDICAL', weight: 5, patterns: [/\b(hospital|clinic|doctor|surgery|dental|treatment|medical|wellness|rehabilitation|fertility|cosmetic|health)\b/i] },
  { agent: 'INVESTMENT', weight: 4, patterns: [/\b(invest|investor|return|roi|capital|opportunit|boutique hotel|resort development|land|feasibility|\$\s?\d|million|usd)\b/i] },
  { agent: 'BUSINESS_SETUP', weight: 4, patterns: [/\b(company|register a business|licence|license|setup|establish|legal structure|llc|branch office|gafi|free zone)\b/i] },
  { agent: 'GOV_SERVICES', weight: 4, patterns: [/\b(visa|entry requirement|permit|residency|official|government|ministry|authority|customs|work permit)\b/i] },
  { agent: 'TOURISM_INTEL', weight: 4, patterns: [/\b(statistic|analytics|how many visitors|market share|occupancy|dashboard|trend|arrivals|demand data)\b/i] },
  { agent: 'TRUST', weight: 3, patterns: [/\b(verified|is this real|trustworth|scam|licensed\??|authentic|source of this)\b/i] },
  { agent: 'RESEARCH', weight: 4, patterns: [/\b(phd|masters|research|university|academic|archive|excavation|scholar|fieldwork|egyptolog)\b/i] },
  { agent: 'MARKETING', weight: 3, patterns: [/\b(campaign|promote|marketing|audience segment|traveller stor(y|ies) publish)\b/i] },
  { agent: 'OPERATIONS', weight: 3, patterns: [/\b(support ticket|onboard(ing)? a provider|escalate|operational alert)\b/i] },
];

export function route(message: string, ctx: { roles: Role[]; consents: string[] }): RouteDecision {
  const scores = new Map<string, { score: number; matched: string[] }>();

  for (const sig of SIGNALS) {
    for (const p of sig.patterns) {
      const m = message.match(p);
      if (m) {
        const cur = scores.get(sig.agent) ?? { score: 0, matched: [] };
        cur.score += sig.weight;
        cur.matched.push(m[0]);
        scores.set(sig.agent, cur);
      }
    }
  }

  const ranked: RouteMatch[] = [...scores.entries()]
    .map(([key, v]) => ({ agent: agentByKey(key)!, confidence: Math.min(1, v.score / 8), matched: v.matched }))
    .filter((r) => r.agent)
    .sort((a, b) => b.confidence - a.confidence);

  // No specialist matched: the Concierge answers from public content itself.
  const primary: RouteMatch = ranked[0] ?? { agent: agentByKey('CONCIERGE')!, confidence: 0.4, matched: [] };

  const spec = primary.agent;
  const roleOk = spec.requiredRoles === 'ANY' || ctx.roles.some((r) => (spec.requiredRoles as Role[]).includes(r));
  const missingConsents = (spec.requiresConsent ?? []).filter((c) => !ctx.consents.includes(c));

  if (!roleOk) {
    return {
      primary, secondary: ranked.slice(1, 3), allowed: false, missingConsents,
      refusal: `That request is handled by a restricted capability. It requires one of: ${(spec.requiredRoles as Role[]).map((r) => r.replace(/_/g, ' ').toLowerCase()).join(', ')}. The attempt has been recorded.`,
    };
  }

  return { primary, secondary: ranked.slice(1, 3), allowed: true, missingConsents };
}

/* ------------------------------------------------------------- composer */

export type SourceLabel = 'OFFICIAL_SOURCE' | 'VERIFIED_PROVIDER' | 'PARTNER_DATA' | 'AI_ANALYSIS' | 'DEMO_DATA';

/** Topics where an unlabelled answer is never acceptable. */
const SENSITIVE_TOPICS: { key: string; test: RegExp; requirement: string }[] = [
  { key: 'law', test: /\b(law|legal|statute|regulation|article \d)\b/i, requirement: 'Legal content requires an official source.' },
  { key: 'visa', test: /\b(visa|entry|residency|work permit)\b/i, requirement: 'Entry requirements must come from the competent authority.' },
  { key: 'permit', test: /\b(permit|licence|license|approval)\b/i, requirement: 'Permits and licences must come from the issuing authority.' },
  { key: 'tickets', test: /\b(ticket|availability|book now|in stock)\b/i, requirement: 'Ticket availability requires a connected provider.' },
  { key: 'pricing', test: /\b(price|cost|rate|fee|how much)\b/i, requirement: 'Live pricing requires a connected provider.' },
  { key: 'hours', test: /\b(opening hours|open at|closing time|what time.*open)\b/i, requirement: 'Opening hours must come from the site authority.' },
  { key: 'medical', test: /\b(diagnos|treat|cure|symptom|prescri)\b/i, requirement: 'Medical claims are out of scope; only verified provider information is given.' },
  { key: 'returns', test: /\b(guaranteed return|profit|yield|roi)\b/i, requirement: 'No return is ever guaranteed.' },
];

export interface ComposeInput {
  agent: AgentSpec;
  question: string;
  citations: { label: string; sourceStatus: string; owner?: string }[];
}

export interface ComposeGuard {
  label: SourceLabel;
  caveats: string[];
  /** True when the answer must state that it cannot answer authoritatively. */
  mustDowngrade: boolean;
}

/**
 * Decides what label an answer carries and whether it must be downgraded.
 * This runs on every assistant turn, not only when the model remembers to.
 */
export function composeGuard({ agent, question, citations }: ComposeInput): ComposeGuard {
  const caveats: string[] = [];
  const authoritative = citations.some((c) => c.sourceStatus === 'LIVE' || c.sourceStatus === 'VERIFIED_DATA');
  const partner = citations.some((c) => c.sourceStatus === 'PARTNER_DATA');
  const anyDemo = citations.some((c) => c.sourceStatus === 'DEMO' || c.sourceStatus === 'SIMULATED');

  const hits = SENSITIVE_TOPICS.filter((t) => t.test.test(question));
  for (const h of hits) caveats.push(h.requirement);

  let label: SourceLabel =
    authoritative ? 'OFFICIAL_SOURCE'
    : partner ? 'PARTNER_DATA'
    : agent.sourceLabelPolicy === 'ANALYSIS_ONLY' ? 'AI_ANALYSIS'
    : anyDemo ? 'DEMO_DATA'
    : 'AI_ANALYSIS';

  const mustDowngrade = hits.length > 0 && !authoritative;
  if (mustDowngrade) {
    label = anyDemo ? 'DEMO_DATA' : 'AI_ANALYSIS';
    caveats.push('This prototype has no connected authoritative source for that, so the answer is not an official one.');
  }

  if (agent.requiresHumanApproval) caveats.push('Anything this capability produces requires human approval before it takes effect.');

  return { label, caveats, mustDowngrade };
}

export const SOURCE_LABEL_TEXT: Record<SourceLabel, string> = {
  OFFICIAL_SOURCE: 'Official source',
  VERIFIED_PROVIDER: 'Verified provider',
  PARTNER_DATA: 'Partner data',
  AI_ANALYSIS: 'AI analysis',
  DEMO_DATA: 'Demo data',
};

export const AGENT_GRAPH = AGENTS.map((a) => ({
  key: a.key, index: a.index, name: a.name, purpose: a.purpose,
  tools: a.allowedTools, roles: a.requiredRoles, approval: a.requiresHumanApproval,
}));
