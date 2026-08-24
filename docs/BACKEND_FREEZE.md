# Backend Freeze

Declares a stable boundary between Egypt One's backend/core and any
external frontend implementation (Lovable or otherwise). Written from the
actual current repository state — see [`ARCHITECTURE.md`](./ARCHITECTURE.md)
and [`DEMO_MODE.md`](./DEMO_MODE.md) for the full picture this summarises.

## Domain-by-domain status

| Domain | Status | Evidence |
|---|---|---|
| Database schema (design) | IMPLEMENTED | `packages/database/prisma/schema.prisma` — 71 models, hand-reviewed |
| Database (running) | PLANNED | No `DATABASE_URL` in this environment; schema never run through `prisma generate`/`validate` (no registry access in this sandbox) — see `SECURITY.md`'s "Known gaps" |
| Demo data repository | IMPLEMENTED | `packages/database/src/index.ts`, `DEMO_MODE = !process.env.DATABASE_URL`, 17 seeded JSON files, identical `db.*` call signatures either way |
| Migrations | PLANNED | No `prisma/migrations/` directory exists; schema has never been migrated against a real database |
| Authentication | NOT_IMPLEMENTED | `packages/auth/src/` contains no files. `middleware.ts` does locale routing only — no session, no login, no cookie-based identity check anywhere in the request path |
| Authorization (RBAC/ABAC logic) | IMPLEMENTED | `packages/security/src/index.ts`: `decide()`, `CEILING` map, `RBAC_MATRIX`, consent/purpose/cohort-size checks — real, working logic |
| Authorization (wired to real users) | BLOCKED | The logic above has no real `Principal` to evaluate, because there's no auth. `POST /api/ai/concierge` explicitly "resolves a demo Principal" per its own doc comment |
| Row-Level Security (RLS) | NOT_IMPLEMENTED | No RLS policies found anywhere in the schema or codebase. Not merely unapplied — not yet written |
| Users | PLANNED | `User`, `Profile`, `Organisation`, `Role`, `Permission`, `RolePermission`, `UserRole` models exist in the Prisma schema; none are backed by a running database or an auth flow |
| Partners | PLANNED | `Partner`, `PartnerIntegration`, `ApiClient`, `Webhook` models exist in schema; `/partner/*` pages render from demo data, not from these models |
| CMS | PLANNED | `ContentBlock`, `Translation`, `FeatureFlag` models exist in schema; `/admin/content` is a demo-data page, not a working CMS |
| Admin | DEMO | `/admin/*` pages render real registry data (`RBAC_MATRIX`, `MCP_TOOLS`, `AGENTS`) read-only; no admin write-path is wired to a database |
| AI (Concierge) | IMPLEMENTED (logic) / DEMO (data) | `packages/agents` (16-agent registry + orchestrator routing + `composeGuard`) is real, working TypeScript logic. `POST /api/ai/concierge` runs it end-to-end. All underlying content it cites is `DEMO`/`SIMULATED` |
| Agents (registry) | IMPLEMENTED | `packages/agents/src/registry.ts` — 16 agents, each with `canDo`/`cannotDo`/`allowedTools`/`dataClasses`/`deniedDataClasses`/`rateLimitPerMin`/`requiredRoles`/`requiresHumanApproval` |
| MCP | IMPLEMENTED (registry + gateway) / none LIVE | `packages/mcp/src/registry.ts` (15 servers, 30 tools) + `gateway.ts` (`callTool` pipeline) are real. Every server is `SANDBOX` or `PLANNED` — see [`MCP_REGISTRY.md`](./MCP_REGISTRY.md); none is `LIVE` |
| Integrations | PLANNED | `packages/integrations/src/index.ts` declares adapter *contracts* (11 adapter types). Real adapters: 3 `SANDBOX` (payments sandbox, in-memory search, local object storage), 17 `PLANNED` — see [`INTEGRATION_REGISTRY.md`](./INTEGRATION_REGISTRY.md) |
| Analytics | NOT_IMPLEMENTED | `packages/analytics/src/` contains no files. `/government/tourism-intelligence` and the homepage's intelligence preview render `SIMULATED` synthetic figures from `packages/database`'s demo metrics generator, not a real analytics pipeline |
| Bookings | DEMO / PLANNED | `Booking`, `Trip`, `Itinerary`, `TripDay`, `TripItem` models exist in schema; `POST /api/trip/build` generates a **read-only itinerary suggestion** via `planEgyptTrip()` — nothing is persisted, booked, or confirmed (the endpoint's own response says so explicitly) |
| Payments | PLANNED | `Payment`, `Transaction`, `Commission`, `Settlement`, `Refund`, `RevenueRule` models exist in schema. `quotePayment()` in `packages/skills` computes a commission quote from `packages/config/src/revenue.ts`'s rules — real calculation logic, but no PSP is connected and no money moves. See [`PAYMENT_ARCHITECTURE.md`](./PAYMENT_ARCHITECTURE.md) |
| Investment | DEMO | `/invest`, `/investment-opportunities/*` render 81 demo opportunities; `discoverInvestment()` skill does real scoring/ranking math over that demo data, explicitly labelled `SIMULATED`/`DEMO` in every citation |
| Tourism | DEMO | Content pages (governorates, destinations, attractions) render from the 27-governorate demo pack |
| Heritage | DEMO | 74 heritage sites, 7 access classifications, honestly labelled including `hidden` and `restorationStatus` fields |
| History | DEMO | 11 eras, 24 rulers — `HistoricalEra`/`Ruler` models in schema, demo JSON in practice |
| Research | DEMO | 54 research programmes (demo), `ResearchProgram` model in schema |
| Film | NOT_IMPLEMENTED | No `FilmProject`/`FilmLocation` domain type or model exists anywhere in the repository. `EventRecord.category` includes `'Film'` as one of ten event categories — that is the entire extent of "film" support today |
| Governorates | IMPLEMENTED (demo) | Full 27-governorate dataset with a real, live interactive map (`EgyptMap`/`LeafletMap`, OpenStreetMap tiles via CARTO) plotting it |
| Media (asset management) | NOT_IMPLEMENTED | `MediaAsset` model exists in schema; no upload path, no storage adapter beyond the `PLANNED`/local-filesystem `StorageAdapter` stub exists |
| Reviews | PLANNED | `Review`, `TravellerStory` models exist in schema; `/reviews` and `/traveler-stories` pages render static demo content, not a live review-submission system |
| Complaints | PLANNED | No dedicated `Complaint` model. Closest match: `SupportCase` in the schema, and `support.escalate` in the MCP tool registry (state: `SANDBOX`) |
| Notifications | PLANNED | `Notification` model exists in schema; the header's notification bell renders a hardcoded badge count, not real notifications |
| Audit logs | IMPLEMENTED (logic) / in-memory | `packages/security`'s `audit()`/`recentAudit()`/`guarded()` are real and exercised by `/admin/audit`; the log is in-memory in this environment (Postgres-backed `AuditLog` model exists in schema for production) |
| Data governance | IMPLEMENTED | `DataClass` taxonomy (10 classes), `SourceStatus` taxonomy (6 states) — both enforced in code, not just documented. See [`DATA_MODEL.md`](./DATA_MODEL.md) |
| Security controls | PARTIAL | RBAC/ABAC logic real; security headers (`X-Frame-Options` etc.) real in `next.config.mjs`; no pentest, dependency scan, or secrets scan has ever been run — see [`SECURITY.md`](./SECURITY.md) |

## What is frozen (Lovable must not modify)

- `packages/database/prisma/schema.prisma` and any future `prisma/migrations/`
- `packages/database/src/*` (the `db.*` repository interface and its DEMO_MODE/Prisma duality)
- `packages/security/src/*` (RBAC/ABAC engine, `RBAC_MATRIX`, audit)
- `packages/agents/src/*` (agent registry, orchestrator, `composeGuard`)
- `packages/mcp/src/*` (MCP registry, gateway pipeline)
- `packages/integrations/src/*` (adapter contracts)
- `packages/types/src/*` (domain types, `DataClass`, `SourceStatus`, `Role` taxonomies)
- `packages/config/src/revenue.ts` (commission rules)
- The three existing API route handlers' response shapes (`/api/search`, `/api/trip/build`, `/api/ai/concierge`) — see [`FRONTEND_API_CONTRACT.md`](./FRONTEND_API_CONTRACT.md)

## What Lovable may consume

- The three existing API routes, as documented.
- The TypeScript contracts in `packages/types/src/domain.ts` (import as a package, don't re-declare).
- The `SourceStatus`/`DataClass` vocabularies, to render honest status badges.

## What may change only through an approved interface change

- Adding new Next.js Route Handlers under `apps/web/src/app/api/**` that wrap existing `db.*`/skill functions (additive, non-breaking) — see the MISSING API list in `FRONTEND_API_CONTRACT.md`.
- Extending a `McpTool`/`AgentSpec`/`DataClass`/`IntegrationRecord` entry — always through the registry files above, never by working around them.

## What remains provisional (not yet frozen, expected to change)

- Everything marked `PLANNED` or `NOT_IMPLEMENTED` in the table above — auth, real database connection, payments, media upload, notifications, complaints, film.
- The exact shape of any *new* API route added to close a MISSING API gap — proposed shapes in `FRONTEND_API_CONTRACT.md` are contracts to implement against, not yet-frozen fact.
