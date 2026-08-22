# Demo Mode

## What DEMO_MODE is

`DEMO_MODE = !process.env.DATABASE_URL` (`packages/database/src/index.ts`).
With no database configured, the platform runs entirely against a seeded,
clearly labelled demonstration data pack (17 JSON files under
`packages/database/src/demo/`) so the full experience — all 27
governorates, all 7 portals, the AI Concierge, tourism intelligence
dashboards — is explorable with zero external dependencies.

## What is never allowed to happen

Every demo record carries `sourceStatus: 'DEMO'` (or `'SIMULATED'` for
generated statistics); every UI surface that displays a record's status
uses the shared `SourceBadge`/`SourceNote` components rather than
re-implementing the label. There is no code path in this repository that
strips or overrides a `DEMO`/`SIMULATED` status to make a record look
`LIVE` or `VERIFIED_DATA`.

## The "First Demo Story"

The specification's example journey — a French traveller, 10 days, budget
budget-conscious, history + Red Sea, a French-speaking guide — is not
hand-scripted copy. `ItineraryPreview` calls the real `planEgyptTrip()`
skill with that exact brief and renders whatever the planner actually
returns, so the demo story and the underlying trip-planning logic can never
drift apart.

## Tourism Intelligence data

`packages/database/src/demo/tourism-metrics.json` begins with an explicit
`note: "SYNTHETIC. Every figure in this file is generated for
demonstration. No official statistic is represented."` and
`sourceStatus: 'SIMULATED'`. It backs the homepage's intelligence preview,
`/tourism-investment`, and every `/government/*` analytics page.

## Switching out of demo mode

Set `DATABASE_URL`. The `db` object's method signatures are identical
either way — see [`DATA_MODEL.md`](./DATA_MODEL.md) — so no calling code
changes. `scripts/seed.mjs` will then upsert the same demo pack into
Postgres (still tagged `DEMO`) rather than printing counts, as a starting
point for replacing individual entities with real, verified data over time.

## Verifying a record

Every record's `sourceStatus`, `sourceOwner` and (where set) `lastVerifiedAt`
are visible via the `SourceBadge`'s tooltip and on every detail page's
"Source" section — there is always a way for a user to check why the
platform is showing them a given piece of information.
