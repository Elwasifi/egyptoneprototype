# Egypt One — Frontend Architecture & Design Plan (Planning Only)

Audit performed against the live repository `Elwasifi/egyptoneprototype` (branch `main`, 429 files, updated 2026-08-24) via read-only GitHub access. No files were changed, nothing was installed, no branch was touched.

---

## 0. Blocking environment finding (REQUIRES USER DECISION)

You chose "connect this project to the GitHub repo first". You must know exactly what that gives you before we implement:

- The repo is a **pnpm + Turborepo monorepo** (`apps/web` Next.js App Router, 13 packages). Lovable's build environment runs **one Vite/TanStack app** at the repository root.
- If this project is Git-synced to that repo, I can **read and write files** in `apps/web` and `packages/ui`, but the Lovable preview **cannot render or build it**, and the automatic build/type checks will not validate the monorepo. Implementation would be "blind": correctness comes from careful typing plus your local `pnpm build`.
- No Lovable-only dependency will be introduced; everything stays portable to Hostinger.

Everything below is written for the **monorepo target** (`apps/web` + `packages/ui`), not for this sandbox app.

Legend used throughout: **IMPLEMENTED / VERIFIED / EXISTING / DEMO / PLANNED / MISSING / BLOCKED / DECISION**.

---

## 1. Repository audit (EXISTING)

```text
apps/web/src/app/[locale]/…   ~70 route folders, all rendering demo data
apps/web/src/app/api/         search | trip/build | ai/concierge   ← only 3 routes
packages/ui                   primitives, data, discovery, media, brand, layout
packages/database             db.* repository, DEMO_MODE = !DATABASE_URL, 17 JSON packs
packages/types                domain types + DataClass + SourceStatus taxonomies
packages/security             decide(), RBAC_MATRIX, CEILING, audit()  (IMPLEMENTED)
packages/agents               16-agent registry + orchestrator + composeGuard
packages/mcp                  15 servers / 30 tools, all SANDBOX or PLANNED
packages/integrations         11 adapter contracts — 3 SANDBOX, 17 PLANNED
packages/auth                 EMPTY  → no authentication exists (BLOCKED)
packages/analytics            EMPTY  → all metrics are SIMULATED
packages/i18n, skills, config, config/revenue.ts
```

Key facts confirmed from `BACKEND_FREEZE.md`: no running database, no migrations, no auth, no RLS, no live MCP server, no live integration, no film domain model at all (only `EventRecord.category = 'Film'`).

## 2. Existing frontend architecture (EXISTING)

Next.js App Router, `[locale]` segment with middleware doing locale routing only. Pages are Server Components importing `@egypt-one/database` directly — that is why a decoupled frontend has no data path. Live Leaflet/CARTO map (`EgyptMap`) over the 27-governorate pack is real and should be preserved.

## 3. Design-system audit (EXISTING — reuse, do not replace)

`packages/ui` already exports: `Button` (gold variant), `Card`, `Badge`, `Input`, `Select`, `Textarea`, `Switch`, `Skeleton`, `Progress`, `Tabs`, `Stat`; `SourceBadge`, `DataClassBadge`, `AccessBadge`, `EmptyState`, `ErrorState`, `OfflineState`, `PermissionDenied`, `IntegrationUnavailable`, `LoadingState`, `BarStrip`, `Donut`, `Trend`, `DataTable`; `SectionHeader`, `PageHeader`, `Breadcrumbs`, `CarouselRow`, `DiscoveryCard`, `GovernorateCard`, `HeritageCard`, `ProviderCard`, `BentoGrid`, `FilterRail`; `SmartImage`, `CinematicHero`, `subjectFor`; `Logo`, `PortalShell`.

Tokens already exist in `apps/web/src/app/globals.css` (`@theme`): surfaces `void/base/raised/panel/elevated`, a 7-step gold ramp, accents `nile/turquoise/bronze/sandstone/royal/emerald/sunset`, ink scale, status colours, `--radius-card: 16px`, fonts Plus Jakarta Sans / IBM Plex Sans Arabic / Cormorant Garamond, reduced-motion handling.

**Verdict: no second design system, no UI framework, no new palette.** Gaps to add *inside* `packages/ui`: `Container`, `Section`, `TopUtilityBar`, `MegaMenu`, `MobileNav`, `AICommandBar`, `TimelineRail`, `EvidenceBadge`, `ProgrammeCard`, `InvestmentCard`, `EventCard`, `FilmCard`, `MediaFrame`, `TrustBar`, `Newsletter`.

## 4. Visual reference analysis (from your logo + 3 screenshots)

Extracted language, not copied layout: circular gold ankh/sphinx seal on near-black; wordmark in white + gold with the "One Egypt. One Journey. One Platform." rule line. Deep navy-black surfaces, thin 1px gold-alpha borders, 16px radii, cinematic warm-hour photography with a bottom black gradient carrying the label. Dense dashboard rhythm on the right rail; icon tiles in muted gold circles; small pill badges (New/Hot/AI).

Direction: keep the cinematic gold-on-navy, **reduce gold to accents and hairlines** (the screenshots over-gild), increase whitespace and section rhythm, drop the crowded above-the-fold. Editorial serif (Cormorant) only for hero and section titles; Plus Jakarta Sans for everything else; IBM Plex Sans Arabic at equal weight for RTL. No pharaonic clip-art, no fake seals, no fake government/partner logos.

## 5–6. Proposed homepage structure (progressive disclosure)

```text
TopUtilityBar   language (EN/AR) · currency · country gateway · support
Header          Logo · primary nav + MegaMenu · universal search · AI Concierge entry
Hero            cinematic image · one headline · one search · one AI CTA        [fold]
—— below fold ——
ThreePillars    Explore Egypt | Plan Your Trip | Invest in Egypt
FeaturedExperiences   carousel, DEMO badged
Sectors         12 tiles: destinations, 27 governorates, heritage, Egypt Through Time,
                nile, beaches, adventure, food, events, medical, real estate, education
Governorates    live Leaflet map + top-governorate rail
EgyptThroughTime  horizontal era timeline preview → /egypt-through-time
Programmes      Egypt One Pass · Visit All 27 · Stopover Egypt · One More Night
AIConciergeBand real /api/ai/concierge demo box (deterministic, labelled)
Investment      sector strip + intelligence teaser (SIMULATED badge) + inquiry CTA
FilmScreen      film-location storytelling  (MISSING domain → editorial only)
Research        programmes + sources
TrustBar        honest claims only: data-classification, source labelling, support
Newsletter
Footer          5 columns · apps · gateway links
```

No fake user chrome anywhere ("Welcome, Ahmed", "Gold Member", bookings) until auth exists.

## 7. Sitemap / route map

Existing top-level segments (~70) stay. Work items:

- **MISSING index routes to add**: `/attractions`, `/cities`, `/destinations`, `/villages`.
- **Detail routes** to verify/complete: `governorates/[slug]`, `heritage/[slug]`, `museums/[slug]`, `investment-opportunities/[slug]`, `rulers-of-egypt/[slug]`, `egypt-195/[slug]`.
- **Portals**: `/account`, `/provider`, `/partner`, `/government`, `/admin`, `/ai` — keep `PortalShell`, mark every write path PLANNED.
- Every section gets the same skeleton: landing → listing (+filters) → detail → related → CTA → AI assist → source badge.

## 8. API-to-screen mapping (never invent endpoints)


| Screen                                                                                                                                                  | Data                 | API                          | Status                                                                                         | Fallback                               | Badge                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------- |
| Universal search                                                                                                                                        | cross-entity hits    | `GET /api/search`            | REAL (A)                                                                                       | empty-state, no fabrication            | per-hit `sourceStatus`       |
| Trip Planner                                                                                                                                            | day plan             | `POST /api/trip/build`       | REAL (A)                                                                                       | error state                            | DEMO + `bookingState: DRAFT` |
| AI Concierge                                                                                                                                            | turn+cards+citations | `POST /api/ai/concierge`     | REAL (A), deterministic router                                                                 | render `denied:true` as normal message | per-citation                 |
| Governorates / heritage / museums / providers / events / offers / products / investment / rulers / eras / research / countries / integrations / metrics | content              | none                         | **MISSING (E)** — server-render via `db.*` in `apps/web`; a decoupled client cannot reach them | server component, no client fetch      | DEMO / SIMULATED             |
| Any booking, payment, availability, review submit                                                                                                       | —                    | none                         | **BLOCKED (F)**                                                                                | disabled CTA + "planned" note          | PLANNED_INTEGRATION          |
| Account / bookings / member tier                                                                                                                        | —                    | none (`packages/auth` empty) | **BLOCKED (F)**                                                                                | sign-in screens rendered as PLANNED    | —                            |


## 9. Missing API list (proposal only, additive, not built now)

`/api/governorates[/slug]`, `/api/heritage[/slug]`, `/api/museums`, `/api/providers`, `/api/investment-opportunities[/slug]`, `/api/events`, `/api/products`, `/api/offers`, `/api/rulers`, `/api/eras`, `/api/research-programs`, `/api/countries`, `/api/integrations`, `/api/metrics`. Also: export the concierge `Card`/turn types from `packages/agents` (today the frontend must re-declare them — documented contract gap, not silently patched).

## 10. Component architecture

```text
AppShell
├── TopUtilityBar ├── Header ├── MegaMenu ├── UniversalSearch ├── MobileNav
├── Hero / CinematicHero
├── Section + Container + SectionHeader
├── DiscoveryGrid · BentoGrid · CarouselRow · FilterRail
├── DestinationCard · GovernorateCard · HeritageCard · ProviderCard
│   · ProgrammeCard* · InvestmentCard* · EventCard* · FilmCard* · ResearchCard*
├── TimelineRail* · EvidenceBadge* · MediaFrame*
├── AIConcierge (Launcher · ChatPanel · SuggestedPrompts · AgentRouteIndicator
│                · CardRenderer · CitationList · States)
├── SourceBadge · DataClassBadge · AccessBadge · TrustBar · Newsletter
└── Footer                                            (* = new in packages/ui)
```

## 11. Design tokens

Reuse `@theme` as-is. Add only: spacing rhythm (`--space-section: 96px` desktop / 56px mobile), `--radius-pill`, elevation `--shadow-1/2/3` (soft black, never gold glow), motion (`--ease-cinema: cubic-bezier(.2,.7,.2,1)`, 180/240/420ms), breakpoints 390 / 768 / 1024 / 1280 / 1536, icon sizes 16/20/24, image ratios 21:9 hero, 16:9 card, 4:5 portrait, 1:1 tile, card variants `flat | raised | gold | media`, badge variants from the existing `SourceStatus` set.

## 12. Image/visual strategy (capability checked, not assumed)

Available in this environment **now**: AI image generation (multiple quality tiers, up to 1920px), AI image editing, transparent-PNG output, SVG authoring by hand, and use of your uploaded assets — no credentials, no extra tooling required. `SmartImage`/`subjectFor` already exist and stay the single presentation layer.

Plan: generate a coherent cinematic set (hero 21:9, 27 governorates, heritage, museums, nile, beaches, food, events, investment, film, research, programmes) into `apps/web/public/media/…` with a fixed warm-hour, dark-navy grade; keep your logo as the only brand asset. Historical imagery must be tagged `Historical source | Licensed | Illustration | AI reconstruction`, and any reconstruction renders the literal line: "Visual reconstruction based on historical sources — not an original historical document." Optional external stock/image APIs are marked **OPTIONAL / REQUIRES CREDENTIALS**; no secrets hardcoded.

## 13. AI Concierge UX

One surface, three entries (header button, hero CTA, mobile FAB). Chat panel with: suggested prompts per context, agent-routing indicator (`agentLabel` from the response), tool/activity strip, citation list with `SourceBadge`, `denied:true` rendered as a normal refusal message, loading/empty/error states, full-height mobile sheet, RTL mirrored. A visible, permanent note that the Concierge is **deterministic routing over demo data, not an LLM**. Transport is abstracted behind one `conciergeClient` so a future LLM/streaming backend needs no UI change. History is client-side only (no conversation API exists).

## 14. Responsive & RTL

Designed per breakpoint, not scaled: desktop mega-menu → tablet grouped drawer → mobile bottom nav (Explore · Search · AI · Trips · More) + AI FAB. Filters become a bottom sheet; tables become stacked cards; maps get a fixed-height mobile mode with a list toggle; carousels are scroll-snap with real overflow. RTL is a first-class layout (logical properties, mirrored icons, Arabic numerals policy, `IBM Plex Sans Arabic`), tested per screen, not an afterthought.

## 15. Admin / portals

Public = cinematic. Portals = dense, operational, same tokens: `PortalShell` + left rail + data tables + `DataClassBadge` + audit views. Every write action visibly disabled and labelled PLANNED until auth exists. Admin reads real registries (RBAC matrix, MCP tools, agents) — that stays honest and unchanged.

## 16. Performance / 17. Accessibility / 18. SEO

Server Components by default, client islands only for map, chat, filters, carousels; `next/image` via `SmartImage` with AVIF/WebP + blur; route-level code splitting; `font-display: swap` and self-hosted subsets (Latin + Arabic); LCP target <2.5s, CLS <0.1, INP <200ms.
WCAG 2.2 AA: semantic landmarks, visible focus rings, ≥4.5:1 contrast (gold-on-navy audited — several current gold-on-dark pairs fail and will be shifted to `gold-300`), keyboard-operable mega-menu/sheet/chat, alt text from the media layer, `prefers-reduced-motion` respected (already in globals.css).
SEO: per-route metadata, canonical, OpenGraph/Twitter, JSON-LD (`TouristDestination`, `LandmarksOrHistoricalBuildings`, `Event`, `Museum`, `BreadcrumbList`), sitemap + robots, `hreflang` en/ar, Arabic-first copy for AR routes.

## 19. Implementation phases & complexity


| Phase | Scope                                                                | Complexity |
| ----- | -------------------------------------------------------------------- | ---------- |
| 1     | Design-system audit + token/component additions in `packages/ui`     | M          |
| 2     | AppShell, header, mega-menu, mobile nav, search entry                | L          |
| 3     | Homepage                                                             | L          |
| 4     | Discovery: destinations/cities/attractions/villages indexes + detail | XL         |
| 5     | Trip Planner (real API)                                              | M          |
| 6     | AI Concierge (real API)                                              | L          |
| 7     | Investment                                                           | L          |
| 8     | Egypt Through Time + heritage + visual encyclopedia                  | XL         |
| 9     | Events / Film / Research                                             | L          |
| 10–11 | Portals, Admin                                                       | L          |
| 12–15 | RTL, a11y, performance, QA                                           | L          |


## 20. Files that would change during implementation

`packages/ui/src/**` (extend, additive), `apps/web/src/app/globals.css` (token additions only), `apps/web/src/app/[locale]/**` page/layout/component files, `apps/web/src/components/**`, `apps/web/public/media/**` (new imagery), `apps/web/next.config.mjs` (images config only, if needed). **Never touched:** `packages/database`, `packages/security`, `packages/agents`, `packages/mcp`, `packages/integrations`, `packages/types`, `packages/config/src/revenue.ts`, the three API route handlers, `main`.

## 21. Risks

Blind implementation (no preview/build in Lovable) · monorepo drift if you edit locally in parallel · 13 missing content APIs cap any decoupled frontend · no auth blocks all personalised UX · gold-on-navy contrast failures · large image set weight · Arabic content coverage unknown · Film domain does not exist in the data model.

## 22. Dependencies

Git sync connected to the repo · your local `pnpm build` as the real verification loop · decision on the missing-API PR · Arabic copy source · confirmation that generated imagery is acceptable brand-wise.

## 23. Questions requiring your decision

1. Should Phase 0 be the additive **missing-API PR** (14 read-only routes) so the frontend is not permanently server-coupled?
2. Do you accept AI-generated imagery for the cinematic set, or will you supply licensed photography?
3. Arabic: full parity from Phase 3, or English-first with AR following in Phase 12?
4. Should I remove the fake "Welcome, Ahmed / Gold Member" chrome from the existing homepage as part of Phase 2/3?
5. Confirm you will run builds locally, given Lovable cannot build the monorepo.

## 24. Status summary

- **IMPLEMENTED/VERIFIED**: 3 API routes, RBAC/ABAC engine, agent + MCP registries, governorate map, design tokens, `packages/ui` component set, data-honesty taxonomies.
- **EXISTING**: ~70 route folders rendering demo content.
- **DEMO/SIMULATED**: all content domains, all metrics, investment listings, heritage/history/research packs.
- **PLANNED**: database, migrations, CMS, partners, payments, notifications, media management, reviews.
- **MISSING**: 14 content APIs, 4 index routes, film domain model, concierge type exports.
- **BLOCKED**: authentication, personalised UX, bookings, live integrations, real analytics.
- **DECISION**: the five questions above.  
  
EGYPT ONE — MASTER FRONTEND BUILD & PRESENTATION PROMPT
  ## ROLE
  You are the Lead Frontend Architect, Product Designer, UI Engineer, and Presentation Experience Engineer for **Egypt One**.
  Your mission is to transform the existing Egypt One repository into a **premium, cinematic, national-scale frontend experience** suitable for an executive presentation/demo.
  This is a FRONTEND-FIRST mission.
  The backend is already frozen.
  You must respect the existing backend architecture and must NOT redesign, replace, duplicate, or modify backend systems.
  ---
  # 1. NON-NEGOTIABLE ARCHITECTURAL BOUNDARY
  The repository contains an existing backend architecture that has already been audited and frozen.
  Treat the following as READ-ONLY / FROZEN:
  - `packages/database`
  - `packages/security`
  - `packages/agents`
  - `packages/mcp`
  - `packages/integrations`
  - `packages/types`
  - `packages/config`
  - existing API route handlers
  - database schema
  - backend contracts
  - security/RBAC logic
  - agent orchestration
  - MCP registry
  - integration registry
  DO NOT:
  - redesign the backend
  - create a second backend
  - create a second authentication system
  - create a second RBAC system
  - create a second AI orchestration system
  - create fake government APIs
  - create fake payment APIs
  - create fake booking APIs
  - create fake authentication
  - create duplicate business logic
  - modify frozen API response contracts
  - modify database architecture
  - silently create new API routes
  - move the project into a Lovable-only architecture
  - replace the existing Next.js architecture with Vite/TanStack
  - introduce a second design system
  The frontend must consume the existing architecture.
  ---
  # 2. PRIMARY OBJECTIVE
  The immediate objective is NOT to finish every backend capability.
  The immediate objective is to make Egypt One look and feel like a:
  **National Digital Gateway for Egypt**
  combining:
  TOURISM  
  INVESTMENT  
  CULTURE  
  HERITAGE  
  HISTORY  
  CREATIVE ECONOMY  
  RESEARCH  
  AI  
  TRAVEL SERVICES
  The result must be visually impressive enough for an executive-level presentation.
  The presentation must immediately communicate:
  > Egypt One is not another tourism website.
  It is a scalable digital ecosystem designed to present Egypt through one intelligent platform.
  ---
  # 3. IMPORTANT: DO NOT IMPLEMENT BLINDLY
  Before changing code:
  1. Inspect the entire repository.
  2. Inspect the existing frontend.
  3. Inspect `packages/ui`.
  4. Inspect the existing homepage.
  5. Inspect all current routes.
  6. Inspect the frozen API contracts.
  7. Inspect the attached Egypt One logo.
  8. Inspect every attached UI/reference screenshot.
  9. Inspect the existing media system.
  10. Inspect the existing Arabic and English translations.
  11. Inspect the existing `SmartImage`, `CinematicHero`, `SourceBadge`, `DataClassBadge`, `PortalShell`, and related components.
  Do NOT throw away existing work.
  Reuse strong existing components.
  Improve them where appropriate.
  ---
  # 4. FIRST RESPONSE — PLANNING ONLY
  Before implementation, produce a concise implementation plan containing:
  ### A. Visual diagnosis
  What currently looks weak or unfinished.
  ### B. Frontend architecture
  Exactly which frontend files/components will change.
  ### C. Homepage transformation
  Show the proposed final visual hierarchy.
  ### D. Image strategy
  Explain exactly how you will create/use the required imagery.
  ### E. Arabic/RTL strategy
  Explain how EN and AR will remain visually equivalent.
  ### F. API usage
  Show exactly where the three frozen APIs will be used.
  ### G. Scope
  Separate:
  IMPLEMENT NOW  
  EXISTING  
  DEMO  
  PLANNED  
  BLOCKED
  ### H. Safety boundary
  Explicitly confirm that frozen backend packages and API contracts will not be modified.
  **STOP AFTER THIS PLAN AND WAIT FOR USER APPROVAL.**
  Do not begin implementation until approval is given.
  ---
  # 5. IMPLEMENTATION SCOPE AFTER APPROVAL
  Once approved, implementation priority is:
  ## PRIORITY 1 — HOMEPAGE
  The homepage is the primary presentation surface.
  It must be exceptional.
  ---
  # 6. HOMEPAGE VISUAL STRUCTURE
  Build the homepage as a cinematic national gateway.
  Recommended hierarchy:
  ## TOP UTILITY BAR
  Include:
  - Arabic / English
  - Currency
  - Support
  - Country/context selector where appropriate
  Keep it subtle.
  Do not overcrowd.
  ---
  ## MAIN HEADER
  Include:
  - Egypt One logo
  - Main navigation
  - Search
  - AI Concierge entry
  - language
  - relevant utility actions
  Desktop:
  Premium horizontal navigation with a sophisticated mega-menu.
  Mobile:
  Clean responsive navigation.
  Never allow wrapping or horizontal overflow.
  ---
  # 7. HERO — MOST IMPORTANT ELEMENT
  Create a truly cinematic hero.
  The hero must visually communicate:
  **Egypt + Civilization + Modern Technology**
  NOT:
  cheap tourism template  
  generic travel stock site  
  pharaonic theme park  
  AI-generated fantasy Egypt
  Preferred visual direction:
  - real-looking Egyptian landscape
  - pyramids / Nile / Cairo / ancient architecture where appropriate
  - atmospheric depth
  - warm cinematic lighting
  - deep navy/black contrast
  - subtle Egyptian gold
  - sophisticated typography
  - premium photography aesthetic
  - dark gradient for readable text
  - restrained motion
  Hero composition:
  ### Primary headline
  English:
  **One Egypt. One Journey. One Platform.**
  Arabic should be an equally strong native formulation, not a literal awkward translation.
  ### Supporting message
  Present Egypt as:
  A destination  
  A civilization  
  An investment ecosystem  
  A cultural experience  
  A living history
  ### Primary actions
  - Explore Egypt
  - Plan Your Trip
  - Ask Egypt One AI
  ---
  # 8. IMAGE GENERATION / MEDIA REQUIREMENT
  This is IMPORTANT.
  Do not claim that you cannot create images merely because this is a local/remote coding environment.
  If the current environment provides image-generation or image-editing capability, USE IT.
  If an image-generation tool is available:
  USE IT.
  If image-generation is not directly available:
  Use the best available image workflow supported by the environment and clearly identify what is required.
  Do NOT replace the entire visual strategy with generic gradients or flat SVG illustrations simply because generating imagery is inconvenient.
  The goal is premium visual storytelling.
  Create a coherent image language across the platform.
  Required imagery categories include:
  - Egypt hero
  - Cairo
  - Giza
  - Nile
  - Red Sea
  - Sinai
  - beaches
  - desert
  - Upper Egypt
  - Alexandria
  - governorates
  - heritage
  - museums
  - food
  - events
  - investment
  - film
  - research
  - programmes
  Images must look like they belong to the same brand.
  Use consistent:
  - cinematic grading
  - lighting
  - composition
  - aspect ratios
  - overlay treatment
  Do NOT make every image look identical.
  ---
  # 9. HISTORICAL IMAGE RULE
  For historical content:
  Never present AI-generated reconstruction as an authentic historical photograph.
  When applicable, visibly label:
  **Visual reconstruction based on historical sources — not an original historical document.**
  Support metadata such as:
  - period
  - location
  - source
  - verification level
  - evidence type
  Use:
  Verified  
  Probable  
  Reconstruction
  where appropriate.
  ---
  # 10. THREE CORE ENTRY POINTS
  Immediately after the hero create three premium pillars:
  ### EXPLORE EGYPT
  Destinations  
  Governorates  
  Heritage  
  Culture  
  Experiences
  ### PLAN YOUR JOURNEY
  AI Trip Planner  
  Itineraries  
  Hotels  
  Transport  
  Experiences
  ### INVEST IN EGYPT
  Investment sectors  
  Opportunities  
  Governorates  
  Business ecosystem
  Use strong imagery and concise messaging.
  ---
  # 11. SECTOR DISCOVERY
  Create a premium visual discovery area.
  Sectors may include:
  - Destinations
  - 27 Governorates
  - Heritage
  - Egypt Through Time
  - Nile
  - Beaches
  - Safari
  - Food
  - Events
  - Medical Tourism
  - Investment
  - Real Estate
  - Film
  - Research
  - Education
  - Transport
  Do NOT make this look like an app dashboard full of tiny boxes.
  Use hierarchy.
  Use different visual weights.
  Use editorial storytelling.
  ---
  # 12. GOVERNORATES
  Make the 27 Governorates a major Egypt One capability.
  Show:
  - interactive map
  - selected governorates
  - visual cards
  - local identity
  - attractions
  - heritage
  - investment potential
  Preserve the existing Leaflet/CARTO map.
  Do not replace working map functionality with a fake visual.
  ---
  # 13. EGYPT THROUGH TIME
  Create a visually impressive historical timeline preview.
  Use:
  Predynastic  
  Old Kingdom  
  Middle Kingdom  
  New Kingdom  
  Ptolemaic  
  Roman  
  Coptic/Byzantine  
  Islamic  
  Fatimid  
  Ayyubid  
  Mamluk  
  Ottoman  
  Muhammad Ali  
  Kingdom  
  Republic  
  Modern Egypt
  The section should feel like an interactive museum experience.
  ---
  # 14. AI CONCIERGE
  The AI Concierge is a major brand element.
  Integrate the existing:
  `POST /api/ai/concierge`
  Do NOT create another AI engine.
  The UI should include:
  - AI entry in header
  - Hero AI CTA
  - AI section on homepage
  - mobile AI entry
  - suggested prompts
  - response cards
  - citations
  - loading state
  - error state
  - denied state
  IMPORTANT:
  The current Concierge is deterministic/demo routing.
  Do not present it as a fully autonomous LLM if the backend does not actually contain one.
  Use honest wording such as:
  **Egypt One AI Concierge**
  and where appropriate:
  **Powered by the current Egypt One intelligence layer**
  Do not claim capabilities that do not exist.
  ---
  # 15. SEARCH
  Integrate:
  `GET /api/search`
  Create a premium universal search experience.
  Search should feel central to the product.
  Support:
  - destinations
  - governorates
  - heritage
  - events
  - investment
  - experiences
  Use the real API.
  Do not fabricate search results.
  ---
  # 16. TRIP PLANNER
  Integrate:
  `POST /api/trip/build`
  Build a premium trip-planning experience.
  Include:
  - destination
  - duration
  - interests
  - travel style
  - generated itinerary
  - day structure
  - visual cards
  Clearly distinguish:
  Generated itinerary  
  Demo content  
  Real booking
  Never imply a booking occurred.
  ---
  # 17. INVEST IN EGYPT
  Create a premium investment gateway.
  Visual categories:
  - Real Estate
  - Tourism
  - Hospitality
  - Technology
  - Healthcare
  - Creative Economy
  - Education
  - Industry
  Use DEMO/PLANNED labels wherever appropriate.
  Never fabricate:
  government approval  
  licenses  
  investment statistics  
  official opportunities  
  government partnerships
  ---
  # 18. FILM & SCREEN TOURISM
  Create a visually strong editorial section.
  Possible themes:
  - Egyptian cinema
  - historical productions
  - film locations
  - production
  - studios
  - screen tourism
  - creative economy
  Important:
  The backend does NOT currently contain a full film domain model.
  Therefore:
  Build this as a premium editorial/presentation surface.
  Do NOT invent database-backed film APIs.
  ---
  # 19. RESEARCH / HISTORY / CULTURE
  Create strong editorial presentation for:
  Egypt Through Time  
  Visual Encyclopedia  
  Historical Research  
  Cultural Identity  
  Research & Education
  Historical and scientific claims must use appropriate source/verification indicators.
  ---
  # 20. TRUST BAR
  Use only defensible wording.
  Approved examples:
  **Secure by Design**
  **Verified Provider Framework**
  **Government Integration Ready**
  Do NOT use:
  Government Approved  
  Government Certified  
  Government Integrated  
  Official Government Platform
  unless such status actually exists in the backend/data.
  ---
  # 21. DEMO / PLANNED / SIMULATED HONESTY
  This is mandatory.
  Use the existing:
  `SourceBadge`
  and:
  `DataClassBadge`
  where applicable.
  Use:
  DEMO  
  SIMULATED  
  PLANNED  
  VERIFIED
  appropriately.
  Never hide limitations.
  The platform should look premium while remaining factually honest.
  ---
  # 22. DESIGN LANGUAGE
  Use the existing Egypt One design system.
  Do NOT create a second design system.
  Use:
  Deep navy / black  
  Egyptian gold  
  Warm sand  
  Ivory  
  Nile/turquoise accents  
  Subtle gradients
  Gold must be an accent.
  Do NOT flood the interface with gold.
  Avoid:
  - excessive glassmorphism
  - neon cyberpunk
  - cheap pharaonic decorations
  - cartoon pyramids
  - generic SaaS dashboards
  - excessive rounded cards
  - visual clutter
  The design should feel:
  **National + Premium + Cinematic + Modern + Intelligent**
  ---
  # 23. TYPOGRAPHY
  Reuse the existing typography system.
  English:
  Plus Jakarta Sans  
  Cormorant Garamond where editorial serif is appropriate
  Arabic:
  IBM Plex Sans Arabic
  Do not substitute Arabic with an unsuitable Latin font.
  ---
  # 24. ARABIC / RTL IS FIRST-CLASS
  Arabic is NOT a translation afterthought.
  Every important homepage section must have Arabic parity.
  Ensure:
  - true RTL
  - logical CSS properties
  - mirrored layout where appropriate
  - correct navigation
  - correct cards
  - correct alignment
  - correct spacing
  - correct icons
  - no overflow
  - Arabic typography
  - Arabic copy quality
  The Arabic version must look intentionally designed.
  NOT:
  English UI with translated labels.
  ---
  # 25. RESPONSIVE DESIGN
  Test:
  375×812  
  390×844  
  768×1024  
  1024×768  
  1440×900  
  1920×1080
  No:
  horizontal overflow  
  broken menus  
  wrapped headers  
  cut-off text  
  broken carousels  
  oversized hero  
  unusable mobile AI panel
  Mobile must be redesigned behaviorally, not merely scaled down.
  ---
  # 26. MOBILE EXPERIENCE
  Mobile priorities:
  - clean header
  - search
  - AI Concierge
  - Explore
  - Trip planning
  - Investment
  - bottom navigation where appropriate
  AI Concierge should become a full-height mobile sheet.
  Carousels should use real horizontal scrolling.
  No accidental page-wide horizontal scrolling.
  ---
  # 27. COMPONENT STRATEGY
  Reuse existing components wherever possible.
  Examples:
  - `SmartImage`
  - `CinematicHero`
  - `SourceBadge`
  - `DataClassBadge`
  - `AccessBadge`
  - `DiscoveryCard`
  - `GovernorateCard`
  - `HeritageCard`
  - `ProviderCard`
  - `CarouselRow`
  - `BentoGrid`
  - `FilterRail`
  - `SectionHeader`
  - `PageHeader`
  - `PortalShell`
  - `Logo`
  Add new components only when genuinely necessary.
  Potential additions:
  - MegaMenu
  - MobileNav
  - AICommandBar
  - ProgrammeCard
  - InvestmentCard
  - EventCard
  - FilmCard
  - TimelineRail
  - EvidenceBadge
  - TrustBar
  - Newsletter
  - MediaFrame
  Keep components reusable.
  ---
  # 28. DO NOT TOUCH THE FROZEN BACKEND
  Before every backend-adjacent change ask:
  > Is this required for frontend presentation?
  If not, do not change it.
  Do not modify:
  - API handlers
  - database
  - agents
  - MCP
  - security
  - integrations
  - RBAC
  - data contracts
  If a frontend requirement cannot be satisfied because an API does not exist:
  DO NOT invent the API.
  Use the approved fallback:
  DEMO / PLANNED / SERVER-RENDERED EXISTING DATA
  and document the limitation.
  ---
  # 29. NO FAKE FUNCTIONALITY
  Never create buttons that appear functional but do nothing.
  If functionality is not implemented:
  Use:
  - disabled state
  - planned state
  - informational state
  with honest messaging.
  Examples:
  "Available in a future integration"
  "Booking integration planned"
  "Government service connection requires official authorization"
  ---
  # 30. NAVIGATION
  Every visible navigation item must lead somewhere meaningful.
  Fix the known missing index routes if they are required by the visual navigation:
  - `/attractions`
  - `/cities`
  - `/destinations`
  - `/villages`
  Do this as FRONTEND ROUTES only.
  Do not create backend APIs for them.
  ---
  # 31. AUTHENTICATION
  Authentication is currently not implemented.
  Therefore:
  Do not fabricate logged-in users.
  Do not show:
  "Welcome Ahmed"
  "Gold Member"
  "Your bookings"
  unless backed by actual authentication.
  Account/member functionality should be clearly marked:
  **Coming Soon / Planned**
  ---
  # 32. ADMIN / PORTALS
  Do not redesign backend administration logic.
  Improve frontend presentation only.
  Reuse:
  `PortalShell`
  Keep operational interfaces dense and professional.
  Do not enable unauthorized write operations.
  ---
  # 33. ACCESSIBILITY
  Target WCAG 2.2 AA.
  Implement:
  - keyboard navigation
  - semantic HTML
  - visible focus
  - correct contrast
  - alt text
  - accessible buttons
  - accessible dialogs
  - reduced motion
  - accessible navigation
  Do not sacrifice accessibility for visual effects.
  ---
  # 34. SEO
  Improve frontend SEO where appropriate:
  - metadata
  - titles
  - descriptions
  - canonical
  - OpenGraph
  - JSON-LD
  - breadcrumbs
  - hreflang EN/AR
  - sitemap compatibility
  Do not invent factual claims in metadata.
  ---
  # 35. PERFORMANCE
  Do not create a beautiful but heavy website.
  Optimize:
  - images
  - lazy loading
  - responsive image sizes
  - fonts
  - client JavaScript
  - animations
  - code splitting
  Avoid unnecessary dependencies.
  ---
  # 36. IMAGE PERFORMANCE
  Use proper image dimensions.
  Do not load a 4K image into a tiny card.
  Use:
  21:9 hero  
  16:9 landscape cards  
  4:5 portraits  
  1:1 tiles
  Use responsive image delivery where supported.
  ---
  # 37. CODE QUALITY
  Keep:
  - TypeScript strict
  - reusable components
  - clear naming
  - minimal duplication
  - no dead code
  - no unnecessary dependencies
  - no console errors
  Do not rewrite working architecture simply for stylistic reasons.
  ---
  # 38. GIT SAFETY
  Never push directly to `main`.
  Work only on the designated frontend feature branch.
  Before changes:
  Confirm current branch.
  After changes:
  Provide:
  - files changed
  - summary
  - tests
  - visual QA
  - known limitations
  Do not force push.
  Do not commit secrets.
  ---
  # 39. VERIFICATION
  After implementation, verify:
  ### TypeScript
  No TypeScript errors.
  ### Build
  Production build succeeds.
  ### Browser
  Check actual browser rendering.
  ### Console
  No unexpected console errors.
  ### Responsive
  375  
  390  
  768  
  1024  
  1440  
  1920
  ### Languages
  English  
  Arabic
  ### RTL
  No overflow.
  ### API
  Verify:
  `/api/search`
  `/api/trip/build`
  `/api/ai/concierge`
  ### Navigation
  No dead links.
  ### Images
  No broken images.
  ### Honesty
  No fake:
  government integration  
  booking  
  authentication  
  payments  
  live statistics  
  official approvals
  ---
  # 40. PRESENTATION MODE
  The final result must be optimized for an executive presentation.
  The first impression matters.
  A visitor opening the homepage should immediately understand:
  ### WHAT IS IT?
  Egypt One is a unified digital ecosystem for Egypt.
  ### WHY IS IT DIFFERENT?
  It connects:
  Tourism  
  Culture  
  Heritage  
  Investment  
  Research  
  Creative Economy  
  AI
  ### WHAT CAN IT BECOME?
  A nationally scalable digital gateway capable of integrating authorized government and private-sector services in the future.
  Do not explain this with huge blocks of text.
  Show it visually.
  ---
  # 41. PRESENTATION PRIORITY
  If time or implementation constraints force prioritization, use this order:
  1. Homepage
  2. Hero
  3. Header/navigation
  4. Arabic/RTL
  5. Images
  6. Explore Egypt
  7. Governorates
  8. Egypt Through Time
  9. AI Concierge
  10. Trip Planner
  11. Invest in Egypt
  12. Film/Culture
  13. Trust section
  14. Mobile experience
  15. Secondary routes
  Do NOT spend most of the available effort polishing obscure admin screens while the homepage remains weak.
  ---
  # 42. IMPORTANT IMAGE TOOL REQUIREMENT
  If you encounter a limitation related to image creation:
  DO NOT simply state:
  "I cannot generate images."
  Instead:
  1. Check which image-generation/editing capabilities are available in the current environment.
  2. Use them if available.
  3. If a required external credential is genuinely necessary, identify the exact credential and why.
  4. Do not hardcode secrets.
  5. Do not replace the requested visual system with generic placeholders without first attempting the available image workflow.
  The final presentation must contain meaningful visual assets.
  ---
  # 43. FINAL DELIVERABLE
  After implementation provide:
  ## IMPLEMENTED
  Everything actually completed.
  ## VERIFIED
  Everything tested.
  ## DEMO
  Anything intentionally demo data.
  ## PLANNED
  Anything awaiting backend/integration work.
  ## BLOCKED
  Anything genuinely blocked.
  ## FILES CHANGED
  Exact files.
  ## TEST RESULTS
  Typecheck  
  Build  
  Browser QA  
  Responsive QA  
  EN  
  AR  
  RTL
  ## BACKEND SAFETY
  Explicitly confirm:
  No frozen backend package was modified.
  No API contract was changed.
  No fake integration was introduced.
  ---
  # FINAL COMMAND
  Build Egypt One as if it will be presented tomorrow to senior decision-makers who have never seen the project before.
  The interface must communicate ambition, credibility, national scale, intelligence, and technical maturity within the first 30 seconds.
  Do not make it look like a template.
  Do not make it look like a generic tourism website.
  Do not make it look like a startup dashboard.
  Make it feel like the beginning of a **national digital ecosystem**.
  But remain completely honest about what is currently implemented versus planned.
  **FIRST: deliver the implementation plan and wait for approval.**
  **AFTER APPROVAL: execute the frontend implementation.**