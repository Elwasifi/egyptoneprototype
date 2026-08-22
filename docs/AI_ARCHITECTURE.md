# AI Architecture

## One face, sixteen agents

Travellers, providers and staff only ever talk to **the Egypt One AI
Concierge**. Behind it, `packages/agents/src/registry.ts` declares 16
`AgentSpec` records: the Concierge orchestrator plus 15 specialists —
Trip Planner, Destination & Heritage, Booking, Translation & Language,
Guide Matching, Safety, Medical Tourism, Investment, Business Setup,
Government Services, Tourism Intelligence, Trust & Verification, Research &
Education, Marketing, Operations. Each spec declares, in code (not just
documentation): `canDo`, `cannotDo`, `allowedTools`, `dataClasses`,
`requiredRoles`, `requiresHumanApproval`, `requiresConsent` and
`sourceLabelPolicy`. `/admin/ai` and the public `/ai` page render this
registry directly, so the page can never drift from what is actually
enforced.

## Routing

`packages/agents/src/orchestrator.ts` matches the user's message against a
weighted regex `SIGNALS` table per agent, then checks the caller's roles and
consents against the chosen agent's requirements. If nothing matches, or the
caller lacks the required role/consent, the Concierge either answers
directly or returns an explicit refusal — never a silent fallback that
pretends to be the specialist.

## The AI source rule (enforced, not just written down)

Every specialist's answer passes through `composeGuard()`, which:

1. Scans the question for a sensitive topic (law, visa, permit, tickets,
   pricing, hours, medical, returns).
2. If found and no authoritative (`LIVE` / `VERIFIED_DATA`) citation backs
   the answer, force-downgrades the response's `SourceLabel` to
   `AI_ANALYSIS` or `DEMO_DATA` and attaches an explicit caveat.
3. Otherwise labels the answer `OFFICIAL_SOURCE`, `VERIFIED_PROVIDER`,
   `PARTNER_DATA`, `AI_ANALYSIS` or `DEMO_DATA` as appropriate.

The same `SourceStatus` enum flows from the raw JSON seed data, through
`db.*` accessors, through every skill's `citations[]`, into the Concierge
API response, and into the UI via `SourceBadge`. A demo record can never
silently present as a verified or live one.

## Explicit prohibitions (enforced at the agent-spec level)

- **Medical Tourism agent**: cannot diagnose, cannot recommend treatment,
  cannot interpret test results.
- **Investment agent**: cannot guarantee a return.
- **Government Services agent**: `requiresHumanApproval: true` — never
  auto-submits anything to a government system.
- **Know Your Origin** flows: informational only; never presented as an
  ethnicity determination or a medical/genetic diagnosis.

## MCP as the only door to data and services

No agent or skill talks to a data source directly. Every access goes
through `packages/mcp`'s `callTool()` gateway — see
[`MCP_ARCHITECTURE.md`](./MCP_ARCHITECTURE.md).

## Skills layer

`packages/skills` holds the 14 named orchestration functions
(`planEgyptTrip`, `findGuide`, `discoverInvestment`, `quotePayment`,
`findAccommodation`, `explainHeritageSite`, `generateTourismInsight`,
`searchEverything`, …). Skills never import a vendor SDK; they return
`{ data, citations, note }` uniformly so the caller always has something to
attach a source label to.
