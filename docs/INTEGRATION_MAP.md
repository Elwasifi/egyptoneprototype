# Egypt One Integration Map

Every integration point in the current repository, traced end to end. See
[`MCP_REGISTRY.md`](./MCP_REGISTRY.md) and
[`INTEGRATION_REGISTRY.md`](./INTEGRATION_REGISTRY.md) for the literal
per-item tables this map summarises and cross-references — this document
adds the request-flow picture and fields those two don't carry
(authentication, current availability).

## Request flow (as it actually runs today)

```
FRONTEND (Next.js pages/components)
  ↓
API  (3 real Route Handlers: /api/search, /api/trip/build, /api/ai/concierge —
       everything else is read server-side via direct db.* import, not HTTP)
  ↓
BACKEND SERVICE  (packages/skills → packages/agents orchestrator →
                   packages/mcp gateway pipeline → packages/security decide()/audit())
  ↓
DATABASE / EXTERNAL PROVIDER  (packages/database: 17 demo JSON files today;
                                 Prisma/Postgres if DATABASE_URL is ever set —
                                 no external provider is actually connected to anything)
  ↓
STATUS: DEMO / SIMULATED everywhere in this environment. Nothing is LIVE.
```

## AI

| Field | Value |
|---|---|
| Owner | Egypt One platform team |
| Provider | **None connected.** `packages/config/src/env.ts`'s `aiServiceUrl` reads `AI_SERVICE_URL`, which is unset; nothing in the codebase calls an external LLM API |
| Environment | DEV |
| Status | DEMO |
| Data classification | Varies by agent, `PUBLIC`–`RESTRICTED_GOVERNMENT` |
| Authentication | None (no external call is made) |
| Rate limit | Not enforced at the `/api/ai/concierge` route (see `FRONTEND_API_CONTRACT.md`) |
| Audit requirement | Yes — every routing decision is audited via `packages/security`'s `audit()` |
| Security review | Not started |
| Current availability | **The "AI Concierge" is deterministic, not a connected LLM.** `packages/agents/src/orchestrator.ts`'s `route()` matches the message against a fixed table of regex patterns (`SIGNALS`) to pick a specialist agent, then a `switch` statement in the API route builds the reply from templated strings and demo-data lookups. This is real, working orchestration logic — but it is pattern-matching and templating, not generative AI. Any future LLM integration is a new, separate piece of work, not a configuration flip. |

## AI agents (registry)

See `MCP_REGISTRY.md`'s sibling table in `packages/agents/src/registry.ts` — 16 agents, each with `canDo`/`cannotDo`/`allowedTools`/`dataClasses`/`deniedDataClasses`/`rateLimitPerMin`/`requiredRoles`. Owner: Egypt One platform team. Status: IMPLEMENTED as logic, DEMO as data. No security review has been run against the agent registry's permission boundaries.

## MCP

15 servers, 30 tools — full table in [`MCP_REGISTRY.md`](./MCP_REGISTRY.md). Summary: every server is `owner: Egypt One` or a named future partner marked `(planned)`; every `vendor` is `Egypt One (in-house)` or explicitly `(planned)`; every `securityReview: NOT_STARTED`; no server is `LIVE`. Authentication: not applicable — the gateway is an in-process function call (`callTool()`), not a network boundary, in this deployment.

## Maps

| Field | Value |
|---|---|
| Owner | Egypt One safety desk |
| Provider | **CARTO** (free-tier dark basemap tiles) sourced from **OpenStreetMap** contributor data — genuinely connected, no API key required |
| Environment | Production-grade CDN (CARTO's), consumed from DEV |
| Status | **LIVE** for the basemap tiles themselves; **DEMO** for the markers plotted on it (governorates/heritage/providers/events/investment come from the demo pack) |
| Data classification | `PUBLIC` |
| Authentication | None — CARTO's free tile endpoint requires no key |
| Rate limit | Governed by CARTO's free-tier fair-use policy, not enforced by this codebase |
| Audit requirement | No |
| Security review | Not applicable (no credentials to review) |
| Current availability | Working today at `/map`, `/government/national-map` (`apps/web/src/components/LeafletMap.tsx`). `packages/config/src/env.ts`'s `mapProvider` env var (`NEXT_PUBLIC_MAP_PROVIDER`) is **not** wired to this — the CARTO URL is hardcoded in the component, not environment-driven. Worth reconciling in a follow-up. |

## Hotels / Flights / Transport (booking adapters)

| Field | Value |
|---|---|
| Owner | Egypt One product team |
| Provider | None contracted — `AccommodationProviderAdapter`, `FlightProviderAdapter`, `MobilityProviderAdapter` contracts exist in `packages/integrations`, no vendor behind any of them |
| Environment | DEV |
| Status | PLANNED (all) |
| Data classification | `PARTNER` |
| Authentication | N/A — not connected |
| Rate limit | 30/min declared for `booking.searchAccommodation` (not enforceable without a real adapter) |
| Audit requirement | Yes, once connected |
| Security review | Not started |
| Current availability | None — `findAccommodation()` in `packages/skills` calls the adapter, which returns a structured "not connected" result, and falls back to showing the demo provider directory |

## Payments

| Field | Value |
|---|---|
| Owner | Egypt One finance team |
| Provider | Licensed PSP — not yet named. `int-licensed-payment-service-provider` in `INTEGRATION_REGISTRY.md` is `SANDBOX` |
| Environment | DEV/sandbox |
| Status | SANDBOX (adapter wiring only — no real settlement) |
| Data classification | `FINANCIAL` |
| Authentication | Sandbox credentials only, no production keys anywhere in this repo (verified — no secrets committed) |
| Rate limit | 30/min on the `payments` MCP server |
| Audit requirement | Yes — always audited (`FINANCIAL` is in `ALWAYS_AUDITED`) |
| Security review | Not started |
| Current availability | `quotePayment()` computes a commission quote from `packages/config/src/revenue.ts`'s real rules — genuinely working math — but no money ever moves; Egypt One is architected to never hold funds (`PAYMENT_ARCHITECTURE.md`) |

## Email

| Field | Value |
|---|---|
| Owner | Unassigned |
| Provider | **None.** No email/transactional-messaging adapter, package, or env var exists anywhere in the repository |
| Environment | — |
| Status | **NOT_IMPLEMENTED** — not even declared as `PLANNED` in any registry |
| Data classification | Would be `PERSONAL` once it exists |
| Authentication | — |
| Rate limit | — |
| Audit requirement | Would be required (contains PII) |
| Security review | — |
| Current availability | None. Support/notification flows in the UI (e.g. `support.escalate` MCP tool) do not send email today |

## Storage

| Field | Value |
|---|---|
| Owner | Egypt One |
| Provider | Local filesystem in DEMO_MODE; `int-object-storage-s3-compatible` declared `SANDBOX` in `INTEGRATION_REGISTRY.md` for a future S3-compatible target |
| Environment | DEV |
| Status | SANDBOX |
| Data classification | `PUBLIC` (media assets) |
| Authentication | N/A locally |
| Rate limit | None |
| Audit requirement | No |
| Security review | Not started |
| Current availability | Works as a local dev stand-in only; no real object storage is provisioned |

## Analytics

| Field | Value |
|---|---|
| Owner | Unassigned |
| Provider | **None.** `packages/analytics/src/` contains no files |
| Environment | — |
| Status | **NOT_IMPLEMENTED** |
| Data classification | Would be `RESTRICTED_GOVERNMENT`/aggregate |
| Authentication | — |
| Rate limit | — |
| Audit requirement | Would be required |
| Security review | — |
| Current availability | The tourism-intelligence figures shown at `/government/tourism-intelligence` and the homepage come from `packages/database`'s synthetic metrics generator (`sourceStatus: SIMULATED`), not from any analytics pipeline reading real events |

## Government services (visa, GAFI, CAPMAS, MOFA, Ministry of Tourism)

All five government integrations in `INTEGRATION_REGISTRY.md` are `PLANNED`, `dataClass: RESTRICTED_GOVERNMENT`, owner "Egypt One government liaison", provider "Competent authority (planned)". None has credentials, none is contracted, none is connected. Any UI copy implying otherwise is a bug — see `docs/VENDOR_MANAGEMENT.md`'s Lot G framing and the honesty-model requirement that government integration copy always read "integration-ready," never "integrated."

## Investment services

Same pattern as government services: `investment` MCP server is `SANDBOX` (serves demo opportunity data, real ranking math), but the actual "competent entity" workflows (land allocation, licensing, feasibility approval) are entirely `PLANNED` and external to this platform by design — see `PAYMENT_ARCHITECTURE.md` and the investment disclaimer rendered on every relevant page.

## Visa services

`int-visa-and-entry-information-service` — `PLANNED`, `RESTRICTED_GOVERNMENT`. `/visa` renders static guidance copy, not a live entry-requirements feed.

## Healthcare

`health` MCP server — `PLANNED`, `dataClass: HEALTH`, `auditRequired: true`. `int-accredited-hospital-network` — `PLANNED`, `SENSITIVE`. No real accredited-provider feed exists; `/medical-tourism` and the Medical agent both explicitly disclose this to the user in their own response copy.

## Partner systems / future private-sector providers

Tracked in the Prisma schema (`Partner`, `PartnerIntegration`, `ApiClient`, `Webhook` models — all unapplied, no running database) and in `packages/integrations`'s adapter contracts. No partner has a live credential or contract in this repository. Onboarding a real partner is a Lot B/C/G decision per `VENDOR_MANAGEMENT.md`, not a code change.

## Summary table

| Category | Status | Count LIVE | Count SANDBOX/DEMO | Count PLANNED | Count NOT_IMPLEMENTED |
|---|---|---|---|---|---|
| MCP servers | see `MCP_REGISTRY.md` | 0 | 8 | 7 | — |
| Integration adapters | see `INTEGRATION_REGISTRY.md` | 0 | 3 | 17 | — |
| Maps | Basemap tiles only | 1 (tiles) | 1 (markers=demo) | 0 | 0 |
| Email | — | 0 | 0 | 0 | 1 |
| Analytics | — | 0 | 0 | 0 | 1 |
| AI (LLM) | — | 0 | 0 | 0 | 1 (no LLM connected at all) |

No government or private-sector integration in this repository is live. Any claim otherwise made in UI copy is a defect against this document.
