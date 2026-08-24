# Frontend API Contract

The concrete, current contract between any frontend and this backend.
Written directly from the three route handlers that actually exist under
`apps/web/src/app/api/` — nothing here is aspirational. See
[`BACKEND_FREEZE.md`](./BACKEND_FREEZE.md) for what's frozen behind these.

> **Known drift**: the older [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md)
> describes the concierge response as a flat object
> (`{agent, content, cards, citations}`). The actual current response nests
> that under a `turn` key (`{turn: {...}, locale}`) — see below. This
> document is the accurate one; reconcile `API_DOCUMENTATION.md` in a
> follow-up, not as part of this freeze.

## EXISTING API

### `GET /api/search`

| | |
|---|---|
| Method / Path | `GET /api/search?q=<string>` |
| Purpose | Cross-entity search over governorates, destinations, heritage sites, museums, rulers, country gateways, providers, events, investment opportunities, research programmes, products, worldwide objects |
| Auth | None required (public) |
| Required role | None |
| Query params | `q` (string, required — empty/short queries return `{hits: [], query}`) |
| Request body | — |
| Response | `{ hits: SearchHit[], query: string }` where `SearchHit = { id, slug, name, kind, href, summary?, sourceStatus }` |
| Error shape | None distinct — malformed/short query returns an empty `hits` array with `200`, not an error |
| Pagination | None — capped at 30 results server-side, no offset/cursor |
| Filtering / sorting | None — relevance order only, not configurable |
| Data classification | `PUBLIC` only — this index never returns `PARTNER`/`PERSONAL`/`SENSITIVE`/`RESTRICTED_GOVERNMENT` records |
| Rate limit | None enforced at this route (the MCP-level `search.query` tool has one — see `MCP_REGISTRY.md` — but this route calls `packages/database`'s `search()` directly, not through the gateway) |
| Demo/live status | `DEMO` — every hit's `sourceStatus` reflects the underlying demo record |
| Source of truth | `packages/database/src/index.ts`'s `search()` |

### `POST /api/trip/build`

| | |
|---|---|
| Method / Path | `POST /api/trip/build` |
| Purpose | Generate a draft, unpersisted day-by-day itinerary |
| Auth | None required |
| Required role | None |
| Request body | `{ days?: number (1–30, default 7), interests?: string[] (max 20), accessibility?: string[], languages?: string[], budgetUsd?: number, partyType?: string }` |
| Response | `{ plan: TripDayPlan[], citations: Citation[], note: string, bookingState: 'DRAFT' }` — see `TripDayPlan` under [Frontend data contract](#frontend-data-contract) below |
| Error shape | `{ error: string }` with `400` on malformed JSON body |
| Pagination / filtering / sorting | Not applicable (single computed plan) |
| Data classification | `PUBLIC`/`DEMO` — every item in the plan carries its own `sourceStatus` |
| Rate limit | None enforced at this route |
| Demo/live status | `DEMO` — `bookingState` is hardcoded `'DRAFT'`; nothing is persisted, priced, or booked. `runtime = 'nodejs'` is set explicitly |
| Source of truth | `packages/skills`'s `planEgyptTrip()` |

### `POST /api/ai/concierge`

| | |
|---|---|
| Method / Path | `POST /api/ai/concierge` |
| Purpose | The AI Concierge's server-side brain — routes a free-text message to one of 16 specialist agents and returns a composed, source-labelled turn |
| Auth | **None.** The route resolves a hardcoded demo principal (`{userId: 'demo-traveller', roles: ['TOURIST'], consents: []}`) — see the `principal()` function in the route file itself. There is no session lookup |
| Required role | Effectively none, since every caller is treated as `TOURIST`. Agents that require a different role (e.g. `TOURISM_INTEL` requires `GOVERNMENT_ANALYST`+) will always refuse for every caller today, because the demo principal can never satisfy them |
| Request body | `{ message: string (max 2000 chars, required), locale?: string (default 'en'), history?: {role, content}[] (accepted but not currently read by the handler) }` |
| Response (current, accurate) | `{ turn: { role: 'assistant', agent: string, agentLabel: string, content: string, denied?: boolean, cards?: Card[], citations: Citation[] }, locale: string }` where `Card = { kind, title, body?, href?, cta?, rows?: {label, value}[] }` and `Citation = { label, sourceStatus, owner? }` |
| Error shape | `{ error: string }` with `400` on malformed/empty body. A routing refusal or missing-consent case returns **`200`** with `turn.denied: true` and an explanatory `content` — by design, not a bug, so the UI renders it as a normal assistant message |
| Pagination / filtering / sorting | Not applicable |
| Data classification | Varies per agent/tool invoked — `PUBLIC` through `RESTRICTED_GOVERNMENT`; every response citation carries its own `sourceStatus` |
| Rate limit | None enforced at this route directly. Individual MCP tools invoked underneath do have `rateLimitPerMin`, but this route calls `packages/skills` functions directly, not through `callTool()` — the rate limiter is not actually in this call path today |
| Demo/live status | `DEMO`/`SIMULATED` — every underlying skill call is against demo data |
| Source of truth | `packages/agents`'s `route()`/`composeGuard()`, `packages/skills`'s functions, `packages/security`'s `audit()` |

## PLANNED API

None. No route handler exists in a "coming soon" or stubbed state — the codebase only contains the three routes above.

## MISSING API

The frontend needs HTTP endpoints for every content domain below. **None exist today** — this content is currently only reachable by importing `@egypt-one/database`'s `db` object directly inside Next.js Server Components, which a separate frontend (Lovable) cannot do. This is the single largest gap for a decoupled frontend. Each row is a proposed contract to implement, not yet built:

| Proposed endpoint | Wraps | Notes |
|---|---|---|
| `GET /api/governorates` / `GET /api/governorates/[slug]` | `db.governorates.all()` / `.bySlug()` | List + detail, `PUBLIC` |
| `GET /api/heritage` / `GET /api/heritage/[slug]` | `db.heritage.all()` / `.bySlug()` | Needs query params for era/classification/governorate/hidden filters (the pages already filter client-side from a full list) |
| `GET /api/museums` | `db.museums.all()` | |
| `GET /api/providers` | `db.providers.byType()`/`.byGovernorate()` | Guides, hotels, restaurants, transport, etc. — needs `type`/`governorate`/`language` query params |
| `GET /api/investment-opportunities` / `[slug]` | `db.investment.all()` / `.bySlug()` | |
| `GET /api/events` | `db.events.all()` | |
| `GET /api/products` | `db.products.all()` | Wear Egypt marketplace |
| `GET /api/offers` | `db.offers.all()` | Programmes |
| `GET /api/rulers` / `GET /api/eras` | `db.rulers.all()` / `db.eras.all()` | |
| `GET /api/research-programs` | `db.research.all()` | |
| `GET /api/countries` (Egypt 195) | `db.countries.all()` / `.bySlug()` | |
| `GET /api/integrations` | `db.integrations.all()` | Should reuse the honesty labelling already in `INTEGRATION_REGISTRY.md` |
| `GET /api/metrics` | `db.metrics()` | Must keep the `SIMULATED` label on every field — this is synthetic data, not real analytics |

All of the above are additive (new files under `apps/web/src/app/api/`), read the same frozen `db.*` interface the pages already use, and do not touch any frozen file. They are the recommended first PR for whoever wires Lovable's frontend to real data, but are **not implemented as part of this freeze** per the mission's instruction not to build API surface beyond a tiny compatibility fix.

## The honesty model, as an API contract

Every domain object in every response above carries `sourceStatus` from the shared vocabulary:

```
LIVE | VERIFIED_DATA | PARTNER_DATA | DEMO | SIMULATED | PLANNED_INTEGRATION
```

The frontend contract is: **never infer liveness from the presence of data** — always read and render `sourceStatus` per record. A `DEMO` record and a hypothetical future `LIVE` record have the identical shape; only the label differs. See [`DATA_MODEL.md`](./DATA_MODEL.md) and [`packages/types/src/source-status.ts`](../packages/types/src/source-status.ts).

## Frontend data contract

TypeScript interfaces the frontend should import from `@egypt-one/types` rather than re-declare. Reuse first — every type below already exists in `packages/types/src/domain.ts` and extends `BaseRecord`/`SourceMeta`, so it already carries `sourceStatus` by construction.

**Already defined — import, don't duplicate:**
`Governorate`, `Destination`, `Attraction` (closest match to a generic "tour/activity"), `HeritageSite`, `Museum`, `HistoricalEra`, `Ruler`, `WorldwideObject`, `Country`, `Provider` (covers Hotel, Restaurant, Guide, Transport, etc. via its `type` field — see `packages/types/src/domain.ts`), `InvestmentOpportunity`, `Property`, `EventRecord`, `Product`, `ResearchProgram`, `IntegrationRecord`.

**Defined in `packages/skills`, not `packages/types` — import from `@egypt-one/skills` if consuming trip-planning output directly:**
- `TripDayPlan { day, governorate, governorateSlug, title, items: {kind, title, slug?, time?, durationMinutes?, note?, sourceStatus}[] }`
- `TripBrief { days, interests, budgetUsd?, partyType?, adults?, children?, accessibility?, languages?, nationality?, startGovernorate? }`
- `Citation { label, sourceStatus, owner? }`

**Defined only inline in the concierge route — not exported as a package type today; the frontend must currently re-declare these to consume `/api/ai/concierge`, which is a compatibility gap worth closing (export them from `packages/agents` in a follow-up, not part of this freeze):**
- `AIMessage`/turn shape: `{ role: 'assistant', agent: string, agentLabel: string, content: string, denied?: boolean, cards?: Card[], citations: Citation[] }`
- `Card { kind, title, body?, href?, cta?, rows?: {label, value}[] }`
- There is no `AIConversation` type anywhere — the route is stateless per-call; multi-turn history is accepted in the request (`history: {role, content}[]`) but not read or persisted by the handler today.

**Not implemented anywhere — MISSING, proposed shape only:**
- `HistoricalRecord` — no dedicated type; the domain is already covered by `HistoricalEra` + `Ruler` + `HeritageSite`. Recommend the frontend compose from those three rather than expect a unifying type.
- `FilmProject` / `FilmLocation` — **genuinely absent**, not in `packages/types` or the Prisma schema. `EventRecord.category` includes `'Film'` as one value among ten — that's the entire current film support. A real film domain needs new types and a new Prisma model; propose before building.
- `Partner` (frontend-facing profile, distinct from the `Partner` Prisma model which is unapplied) — no `packages/types` interface exists; `/partner/*` pages use ad-hoc inline shapes today.
- `Trip` / `Itinerary` (persisted, as opposed to `TripDayPlan`'s stateless draft) — `Trip`/`Itinerary`/`TripDay`/`TripItem` exist in the Prisma schema only; no running database, so no real persisted trip exists to type against yet.
- `AIConversation` — see above; would need a new type once/if conversation history is actually persisted.
- `User` / `Profile` — `User`/`Profile` exist in the Prisma schema only; with no auth implementation (`packages/auth/src` is empty), there is no real authenticated user to type. Do not fabricate a `User` type that implies a working auth system exists.
- `Review` / `Complaint` — `Review`/`TravellerStory` exist in the Prisma schema only (unapplied); no dedicated `Complaint` type exists anywhere — closest is the Prisma `SupportCase` model, also unapplied.
- `MediaAsset` — exists in the Prisma schema only; no upload path or storage adapter is connected (`StorageAdapter` is `PLANNED`, see `INTEGRATION_REGISTRY.md`).
- `Programme` / `Offer` — rendered on the homepage from an inline, ungeneralized shape (`{slug, name, summary, kind}`) read from `packages/database/src/demo/offers.json`. No exported `Offer` type exists in `packages/types` today; worth adding as a small, low-risk addition when the MISSING `/api/offers` route above is built.

Do not invent implementations for any of the MISSING items above. Mark them `PLANNED` in frontend UI (a disabled/upcoming state), not as working features with placeholder data.
