# Data Model

## Canonical schema

`packages/database/prisma/schema.prisma` is the canonical domain model:
~58 Postgres models across identity, geography, content, supply, journey,
money, investment, voice, ecosystem, ops, AI and analytics/CMS groups, plus
enums for every controlled vocabulary used elsewhere in the platform
(`SourceStatus`, `DataClass`, `VerificationState`, `IntegrationState`,
`HeritageAccess`, `RestorationStatus`, `EraKey`, `BookingState`,
`PaymentState`, `ConsentScope`, `LocationMode`, `ModerationState`,
`PublishState`).

## TypeScript mirror

`packages/types/src/domain.ts` defines the corresponding interfaces
(`Governorate`, `Destination`, `Attraction`, `HeritageSite`, `Museum`,
`HistoricalEra`, `Ruler`, `WorldwideObject`, `Country`, `Provider`,
`InvestmentOpportunity`, `Property`, `EventRecord`, `Product`,
`ResearchProgram`, `IntegrationRecord`), all extending `BaseRecord`, which
extends `SourceMeta` (`sourceStatus`, `sourceOwner`, `lastVerifiedAt`).
**Every content record carries a source status by construction** — there is
no code path that produces a record without one.

## DEMO_MODE repository

`packages/database/src/index.ts` exposes `DEMO_MODE = !process.env.DATABASE_URL`
and a single `db` object with namespaced accessors
(`db.governorates.all()`, `db.heritage.bySlug()`, …) plus a cross-entity
`search()`. In DEMO_MODE these read from 17 seeded JSON files under
`src/demo/`; with `DATABASE_URL` set, the same call signatures are backed by
Prisma (`scripts/seed.mjs` upserts the same demo pack into Postgres,
tagging every row `sourceStatus: 'DEMO'`). **No calling code above this
layer knows or needs to know which backing store is active.**

## Demo pack contents

27 governorates · 194 country gateways (+ Egypt = "Egypt 195") · 74 heritage
sites (7 access classifications) · 27 museums · 11 historical eras · 24
rulers · 125 destinations · 389 providers across 13 types · 36 events · 81
investment opportunities · 81 properties · 73 products · 54 research
programmes · 22 heritage-worldwide objects (no invented provenance) · 20
integration records (all PLANNED/SANDBOX) · 18 traveller stories · 8 offers
· one `tourism-metrics.json` object explicitly marked `sourceStatus:
'SIMULATED'`.

## Heritage access classification

`OPEN`, `LIMITED_ACCESS`, `PERMIT_REQUIRED`, `CLOSED`, `UNDER_RESTORATION`,
`PROPOSED_FOR_RESTORATION`, `DEMO_UNVERIFIED` — see
`packages/types/src/verification.ts`.
