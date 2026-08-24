# Lovable Frontend Boundary

The contract for a frontend implementation built separately (by Lovable or
any other team) against this repository. Read alongside
[`BACKEND_FREEZE.md`](./BACKEND_FREEZE.md) and
[`FRONTEND_API_CONTRACT.md`](./FRONTEND_API_CONTRACT.md) — this document is
the plain-language boundary; those two are the technical detail behind it.

## YOU MAY

- Build and redesign frontend components freely.
- Improve UX, add responsive behaviour, add visual storytelling.
- Consume the three existing API routes exactly as documented in
  `FRONTEND_API_CONTRACT.md` (`GET /api/search`, `POST /api/trip/build`,
  `POST /api/ai/concierge`).
- Import and use the TypeScript contracts in `packages/types/src/domain.ts`
  and `packages/skills`'s exported types — do not redeclare them.
- Create frontend-only state (UI state, form state, client-side caching of
  API responses).
- Create frontend routing, presentation components, and an image/media
  presentation layer.
- Propose new API routes for the MISSING list in `FRONTEND_API_CONTRACT.md`
  — as a proposal/PR against `apps/web/src/app/api/**`, additive only, never
  by reaching around the contract into `packages/database` directly from a
  separate frontend process.

## YOU MUST NOT

- Replace the backend, the database, or `packages/database`'s `db.*`
  interface.
- Create a second authentication system. (There currently is **no**
  authentication system — see `BACKEND_FREEZE.md`. Building a real one is a
  legitimate, needed piece of work, but it must be proposed and built once,
  as the one auth system, not invented ad hoc inside a frontend project.)
- Create a second RBAC/ABAC system. `packages/security/src/index.ts` is the
  one authorization engine; extend its `RBAC_MATRIX`/`CEILING` map through a
  documented change, never duplicate its logic client-side as the source of
  truth.
- Create a second/parallel AI architecture. `packages/agents` +
  `packages/mcp` are the one agent/tool registry. A frontend may call
  `/api/ai/concierge` and render its response; it must not implement its own
  routing, its own agent list, or call an LLM directly and bypass the
  registry.
- Modify `packages/database/prisma/schema.prisma` or any future
  `prisma/migrations/` directory.
- Bypass any security control (RBAC ceiling, consent gate, audit
  requirement) — including bypassing it "temporarily" for a demo.
- Expose secrets. No API key, credential, or `.env` value may appear in
  frontend code, a committed file, or a public repository.
- **Fabricate live integrations.** If `INTEGRATION_MAP.md` says a
  government, payment, or provider integration is `PLANNED`, the frontend
  must present it as not-yet-live (a "coming soon"/`PLANNED_INTEGRATION`
  state) — never as a working feature with placeholder data standing in for
  a real connection.
- **Silently replace an API with a mock.** If an endpoint the frontend needs
  doesn't exist, that is a MISSING API — document it and either request it
  be built additively, or clearly mark the feature as unavailable in the UI.
  Do not quietly hardcode a fake response shaped like a real one; a future
  reader must not be able to mistake a frontend mock for backend truth.
- Change any backend response contract (field names, status codes, the
  `SourceStatus`/`DataClass` vocabularies) without documenting the change in
  `FRONTEND_API_CONTRACT.md` first and getting it reviewed — these are the
  frozen boundary, not implementation detail.

## If a required API does not exist

Mark it **MISSING / PLANNED** in your own tracking and in any UI you build
against it (a disabled state, a "planned" badge — matching the existing
`SourceBadge status="PLANNED_INTEGRATION"` pattern already used throughout
this codebase). Do not build a competing backend to fill the gap.

## Recommended frontend architecture for the next phase

Not implemented here — a target for whoever builds the next frontend to
design against.

- **Layout system**: keep the existing `Container`/`Section` primitive
  pattern (`apps/web/src/components/Container.tsx`) if the new frontend
  stays in this Next.js app; if it's a genuinely separate codebase, mirror
  the same two-primitive simplicity rather than inventing a heavier layout
  framework.
- **Design system**: `packages/ui` (Tailwind v4, CSS-first `@theme`/
  `@utility` tokens in `apps/web/src/app/globals.css`) is the source of
  truth for color/type/spacing. A separate frontend should either consume
  `packages/ui` as a package or port the token values — never invent a
  second, incompatible token set alongside it.
- **Component hierarchy**: primitives (`Button`, `Card`, `Badge`, `Input`)
  → discovery patterns (`DiscoveryCard`, `SectionHeader`, `CarouselRow`) →
  page templates. This three-tier shape already exists in `packages/ui` and
  is worth preserving regardless of frontend framework.
- **Page hierarchy**: see `FRONTEND_ROUTE_MAP.md` for the full existing
  route inventory and which routes are safe to redesign freely.
- **Responsive strategy**: mobile-first Tailwind breakpoints, already in use
  throughout; verified this session at 375/390/1440/1920px in both LTR and
  RTL.
- **RTL strategy**: `dir="rtl"` on `<html>` for Arabic, logical Tailwind
  utilities (`ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-` rather than
  `ml-`/`mr-`/`left-`/`right-`) throughout. Any new frontend must use
  logical properties from the start — retrofitting RTL later is expensive
  (see this session's header-overflow bug, caused by exactly this kind of
  oversight).
- **Localization strategy**: `packages/i18n`'s `getMessages(locale)` /
  `t(key)` pattern, English as the fallback dictionary for any locale
  missing a key (`getMessages` merges `{...en, ...target}` — see
  `packages/i18n/src/index.ts`). EN and AR are the two locales with full
  coverage as of this session; fr/zh/ja/ru/el/hi fall back to English for
  newer keys. A separate frontend needs its own equivalent mechanism if it
  doesn't import `packages/i18n` directly.
- **Image architecture**: `packages/ui`'s `SmartImage`/`CinematicHero`
  (deterministic inline-SVG illustration, no rasters) is the current
  placeholder-image system, explicitly designed to be swapped for a real
  image source without changing call sites. No image-generation or
  stock-photo integration exists yet — see the conversation history for the
  options discussed (Unsplash/Pexels API recommended over AI generation for
  a government-adjacent platform).
- **Media asset architecture**: not implemented — see `MediaAsset` in
  `BACKEND_FREEZE.md`'s provisional list.
- **API client architecture**: thin `fetch()` wrappers per the three
  existing routes today; once the MISSING API list is built out, a small
  typed client generated from `packages/types` would keep the frontend and
  backend from drifting.
- **Frontend state strategy**: server-rendered content (current approach)
  needs no client state manager. A fully separate frontend consuming JSON
  APIs will need one (React Query/SWR-style server-state caching is a
  natural fit given the read-heavy, mostly-public data shape) — chosen by
  whoever builds it, not prescribed here.
- **Error/loading/empty states**: `packages/ui/src/data/index.tsx` already
  defines `EmptyState`, `ErrorState`, `OfflineState`, `PermissionDenied`,
  `IntegrationUnavailable`, `LoadingState` — reuse these rather than
  inventing new ones.
- **Source/status badges**: `SourceBadge`/`DataClassBadge` in
  `packages/ui/src/data/index.tsx` are the one honesty-model UI, driven by
  the `SourceStatus`/`DataClass` API fields. Every new surface must use
  them, not a bespoke "verified" checkmark or similar.
- **AI Concierge UI boundary**: the frontend renders `turn.content` and
  `turn.cards` from `/api/ai/concierge`'s response; it must not fabricate
  additional agent capability, must render `turn.denied` refusals as plain
  assistant messages (not errors), and must not claim the concierge is
  backed by a connected LLM (it currently is not — see `INTEGRATION_MAP.md`).
