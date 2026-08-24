# Egypt One

**One Egypt. One Journey. One Platform.**

Egypt One is a national digital tourism, heritage, investment and services
coordination platform for Egypt — web-only, fully responsive, built as a
cloud-native monorepo. It is a **technology and integration layer**, not a
government system: see [`ARCHITECTURE.md`](./ARCHITECTURE.md) and
[`DEMO_MODE.md`](./DEMO_MODE.md) for what that means in practice.

## What's in this repository

- `apps/web` — the Next.js 15 / React 19 / TypeScript web application. Every
  one of the platform's ~74 route templates lives here, rendered across 8
  locales (`en`, `ar`, `fr`, `zh`, `ja`, `ru`, `el`, `hi`).
- `packages/` — 12 shared packages: `types`, `config`, `i18n`, `database`,
  `ui`, `security`, `integrations`, `mcp`, `agents`, `skills` — see
  [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full map.
- `scripts/` — codegen scripts that generate the repetitive route families
  (`gen-listings.mjs`, `gen-details.mjs`, `gen-editorial.mjs`,
  `gen-portals.mjs`) from structured data, plus `verify-routes.mjs`.
- `infrastructure/docker` — Dockerfiles and `docker-compose.yml` for local
  and containerised deployment.
- `docs/` — this documentation set.

## Quick start

```bash
pnpm install
pnpm --filter @egypt-one/web dev
```

No `.env` file is required to explore the platform: with no `DATABASE_URL`
set, every package runs in **DEMO_MODE**, serving the seeded demonstration
data pack described in [`DEMO_MODE.md`](./DEMO_MODE.md). Copy
[`.env.example`](../.env.example) if you want to point at a real Postgres
instance.

```bash
pnpm --filter @egypt-one/web build   # production build, all locales, SSG
pnpm seed                             # print (or, with DATABASE_URL, load) the demo pack
```

## Seven portals, one platform

Tourist, Domestic Traveler, Investor, Business/Service Provider, Government,
Strategic Partner and Admin/Platform Operations all share one identity
system, design system, API surface, AI Concierge and audit trail — while
each keeps its own navigation and purpose. See section H–L of
[`PHASE0_BLUEPRINT.md`](./PHASE0_BLUEPRINT.md) for the full route list.

## Core principles (see ARCHITECTURE.md for the full list)

1. Egypt One never implies direct access to a government database.
2. Every record and every AI answer carries a source-status label — LIVE,
   VERIFIED DATA, PARTNER DATA, DEMO, SIMULATED or PLANNED INTEGRATION.
3. No integration is shown as live unless it actually is.
4. The 5% commission figure is a configurable base assumption, never a
   hardcoded global rate — see [`packages/config/src/revenue.ts`](../packages/config/src/revenue.ts).

## Further reading

[`ARCHITECTURE.md`](./ARCHITECTURE.md) ·
[`AI_ARCHITECTURE.md`](./AI_ARCHITECTURE.md) ·
[`MCP_ARCHITECTURE.md`](./MCP_ARCHITECTURE.md) ·
[`MCP_REGISTRY.md`](./MCP_REGISTRY.md) ·
[`INTEGRATIONS.md`](./INTEGRATIONS.md) ·
[`INTEGRATION_REGISTRY.md`](./INTEGRATION_REGISTRY.md) ·
[`SECURITY.md`](./SECURITY.md) ·
[`DATA_MODEL.md`](./DATA_MODEL.md) ·
[`RBAC_ABAC.md`](./RBAC_ABAC.md) ·
[`LOCALIZATION.md`](./LOCALIZATION.md) ·
[`DEPLOYMENT.md`](./DEPLOYMENT.md) ·
[`DEMO_MODE.md`](./DEMO_MODE.md) ·
[`ENVIRONMENT_VARIABLES.md`](./ENVIRONMENT_VARIABLES.md) ·
[`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) ·
[`PHASE0_BLUEPRINT.md`](./PHASE0_BLUEPRINT.md) ·
[`CLOUD_ARCHITECTURE.md`](./CLOUD_ARCHITECTURE.md) ·
[`NETWORK_ARCHITECTURE.md`](./NETWORK_ARCHITECTURE.md) ·
[`PAYMENT_ARCHITECTURE.md`](./PAYMENT_ARCHITECTURE.md) ·
[`DISASTER_RECOVERY.md`](./DISASTER_RECOVERY.md) ·
[`BUSINESS_CONTINUITY.md`](./BUSINESS_CONTINUITY.md) ·
[`VENDOR_MANAGEMENT.md`](./VENDOR_MANAGEMENT.md) ·
[`EXIT_PLAN.md`](./EXIT_PLAN.md) ·
[`RUNBOOKS.md`](./RUNBOOKS.md) ·
[`ASSET_REGISTER.md`](./ASSET_REGISTER.md) ·
[`BACKEND_FREEZE.md`](./BACKEND_FREEZE.md) ·
[`FRONTEND_API_CONTRACT.md`](./FRONTEND_API_CONTRACT.md) ·
[`INTEGRATION_MAP.md`](./INTEGRATION_MAP.md) ·
[`LOVABLE_FRONTEND_BOUNDARY.md`](./LOVABLE_FRONTEND_BOUNDARY.md) ·
[`FRONTEND_ROUTE_MAP.md`](./FRONTEND_ROUTE_MAP.md)
