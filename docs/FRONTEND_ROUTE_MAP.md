# Frontend Route Map

Every route under `apps/web/src/app/[locale]/`, verified against the actual
directory tree — not the nav menus, which can drift from real routes (see
the "safe for redesign" note at the bottom). All routes are locale-prefixed
(`/en/...`, `/ar/...`, +6 more) via `middleware.ts`; localization itself is
handled centrally, not per-route.

## Status legend

`EXISTS` — has its own `page.tsx`, renders real content (demo data).
`PARTIAL` — has a `page.tsx` but is thin/stub-like.
`MISSING` — directory exists (referenced from nav) but has no `page.tsx` of
its own — only nested dynamic children. **Visiting the bare route 404s.**
`DEMO` — exists and works, content is explicitly demo/simulated (true of
nearly every route in this repository; called out individually only where
it's the single most important fact about the route).

## Top-level content routes (69 directories)

| Route | Status | Notes |
|---|---|---|
| `/about` | EXISTS | |
| `/accommodation` | EXISTS | |
| `/activities` | EXISTS | |
| `/ancient-egypt-academy` | EXISTS | |
| `/attractions` | **MISSING** | Only `attractions/[slug]/page.tsx` exists — no index page |
| `/business-setup` | EXISTS | |
| `/cafes` | EXISTS | |
| `/car-rental` | EXISTS | |
| `/cities` | **MISSING** | Only `cities/[slug]/page.tsx` exists |
| `/corporate-mice` | EXISTS | |
| `/cruises` | EXISTS | |
| `/destinations` | **MISSING** | Only `destinations/[slug]/page.tsx` exists |
| `/discover` | EXISTS | |
| `/egypt-195` | EXISTS | + `egypt-195/[country]/page.tsx` |
| `/egypt-through-time` | EXISTS | |
| `/egyptian-heritage-worldwide` | EXISTS | |
| `/entertainment-investment` | EXISTS | |
| `/events` | EXISTS | |
| `/flights` | EXISTS | |
| `/governorates` | EXISTS | + `governorates/[slug]/page.tsx` (all 27 real) |
| `/guides` | EXISTS | + `guides/[slug]/page.tsx` |
| `/health` | EXISTS | |
| `/heritage` | EXISTS | + `heritage/[slug]/page.tsx` (74 real) |
| `/hidden-heritage` | EXISTS | |
| `/hotels` | EXISTS | |
| `/invest` | EXISTS | Homepage-linked investor portal landing |
| `/investment-opportunities` | EXISTS | + `investment-opportunities/[slug]/page.tsx` |
| `/know-your-origin` | EXISTS | |
| `/map` | EXISTS | Real interactive Leaflet map as of this session |
| `/marketplace` | EXISTS | |
| `/media` | EXISTS | |
| `/medical-tourism` | EXISTS | |
| `/museums` | EXISTS | + `museums/[slug]/page.tsx` |
| `/my-itinerary` | EXISTS | Renders a hardcoded demo itinerary, not a persisted user trip |
| `/new-cities` | EXISTS | |
| `/nile` | EXISTS | |
| `/offers` | EXISTS | |
| `/real-estate` | EXISTS | |
| `/research` | EXISTS | |
| `/restaurants` | EXISTS | |
| `/restoration` | EXISTS | |
| `/reviews` | EXISTS | Static demo content, not a live review-submission system (no `Review` model is applied) |
| `/rulers-of-egypt` | EXISTS | + `rulers-of-egypt/[slug]/page.tsx` |
| `/rural-egypt` | EXISTS | |
| `/safety` | EXISTS | |
| `/search` | EXISTS | Backed by the real `GET /api/search` |
| `/shopping` | EXISTS | |
| `/support` | EXISTS | |
| `/tourism-investment` | EXISTS | |
| `/transport` | EXISTS | |
| `/traveler-stories` | EXISTS | Static demo content |
| `/trip-builder` | EXISTS | Backed by the real `POST /api/trip/build` |
| `/universities` | EXISTS | |
| `/villages` | **MISSING** | Only `villages/[slug]/page.tsx` exists |
| `/vip-transport` | EXISTS | |
| `/visa` | EXISTS | |
| `/wear-egypt` | EXISTS | |
| `/wellness` | EXISTS | |
| `/yachts` | EXISTS | |
| `/ai` | EXISTS | Renders `AgentGraph` from the real agent registry; chat itself calls `/api/ai/concierge` |

## Authentication routes

**None exist.** There is no `/login`, `/signup`, `/logout`, or session
route anywhere in `apps/web/src/app/`. `/account`'s pages render as if a
user is signed in, with no actual gate — see `BACKEND_FREEZE.md`.

## Portal routes (sub-navigation confirmed against `apps/web/src/lib/nav.ts`)

| Portal | Routes | Status |
|---|---|---|
| Account | `/account`, `/account/trips`, `/account/bookings`, `/account/pass`, `/account/wallet`, `/account/consent` | EXISTS (DEMO) — no auth gate on any of them |
| Provider | `/provider`, `/provider/profile`, `/provider/services`, `/provider/availability`, `/provider/bookings`, `/provider/analytics`, `/provider/payouts`, `/provider/compliance` | EXISTS (DEMO) |
| Partner | `/partner`, `/partner/integrations`, `/partner/api`, `/partner/transactions`, `/partner/analytics` | EXISTS (DEMO) |
| Government | `/government`, `/government/tourism-intelligence`, `/government/national-map`, `/government/providers`, `/government/heritage`, `/government/restoration`, `/government/emergencies`, `/government/investment`, `/government/analytics` | EXISTS (DEMO/SIMULATED) |
| Admin | `/admin`, `/admin/content`, `/admin/users`, `/admin/providers`, `/admin/verification`, `/admin/integrations`, `/admin/revenue`, `/admin/support`, `/admin/ai`, `/admin/audit`, `/admin/security`, `/admin/golden-license` | EXISTS (DEMO) — `/admin/ai` renders the real, live agent/MCP registry data (not demo content) |

All portal routes are reachable by anyone today — there is no role check at
the route level, because there is no authentication. This is a known,
documented gap (`BACKEND_FREEZE.md`), not a hidden one.

## AI routes

- `/ai` (page) — EXISTS, real registry data + live chat via `/api/ai/concierge`
- `/api/ai/concierge` (API) — EXISTS, real (see `FRONTEND_API_CONTRACT.md`)
- `/api/trip/build` (API) — EXISTS, real
- `/api/search` (API) — EXISTS, real

## Safe for frontend redesign

Every route marked `EXISTS` above is safe to visually redesign — none of
them contain business logic in the page component itself beyond reading
`db.*`/calling the three API routes and rendering. Redesigning a page's
markup/styling never touches a frozen file.

**Not safe to change without going through `FRONTEND_API_CONTRACT.md`**:
anything that changes what data a page requests, or how `POST
/api/ai/concierge` / `POST /api/trip/build` responses are interpreted.

**The four `MISSING` routes** (`/attractions`, `/cities`, `/destinations`,
`/villages`) are a real, if minor, pre-existing gap — worth either adding a
thin index `page.tsx` (listing the same content their `[slug]` children
serve) or removing them from navigation if they're not meant to have an
index view. Flagged here, not fixed, per this mission's scope.
