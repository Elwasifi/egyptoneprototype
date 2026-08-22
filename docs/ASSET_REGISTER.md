# Asset Register

What Egypt One actually owns today, and what's still unassigned. Update
this file whenever a new account, domain, or credential is created — it
should never be discovered by asking a vendor what exists.

## Owned by Egypt One

| Asset | Location | Notes |
|---|---|---|
| Source code (monorepo) | [github.com/Elwasifi/egyptoneprototype](https://github.com/Elwasifi/egyptoneprototype) | pnpm workspaces + Turborepo, 12 packages + `apps/web` |
| Logo / brand mark | `apps/web/public/brand/egypt-one-logo.jpg` | Referenced by `packages/ui`'s `Logo` component |
| Design system | `packages/ui`, `packages/config/src/theme.ts`, `apps/web/src/app/globals.css` | Tailwind v4 CSS-first tokens |
| AI agent registry | `packages/agents/src/registry.ts` | 16 agents; see [`AI_ARCHITECTURE.md`](./AI_ARCHITECTURE.md) |
| MCP server/tool registry | `packages/mcp/src/registry.ts` | 15 servers, 30 tools; see [`MCP_REGISTRY.md`](./MCP_REGISTRY.md) |
| Demo/seed data pack | `packages/database/src/demo/*.json` | 17 files, all `sourceStatus: DEMO` or `SIMULATED` |
| Database schema | `packages/database/prisma/schema.prisma` | Drafted; not applied to a live database |
| Documentation set | `docs/*.md` | This directory |

## Not yet provisioned — explicitly unassigned

| Asset | Status | Owner once created |
|---|---|---|
| Production cloud account/tenant | Not created | Egypt One (never a vendor account — see [`VENDOR_MANAGEMENT.md`](./VENDOR_MANAGEMENT.md)) |
| Production domain + DNS | Not registered | Egypt One |
| Production database (Postgres) | Not provisioned | Egypt One |
| Secrets manager | Not provisioned | Egypt One |
| Encryption keys | Not generated | Egypt One |
| SOC / SIEM | Not contracted | Egypt One (delegated telemetry access to Lot D vendor) |
| Payment service provider | Not contracted | Licensed PSP (Lot H); Egypt One never holds funds |
| Government integration credentials | Not issued | Competent authority (Lot G, per-adapter approval) |
| AI/MCP production gateway | Not deployed | Egypt One (Lot I vendor gets delegated, scoped access) |

## Review cadence

Reconcile this register against the vendor access matrix in
[`VENDOR_MANAGEMENT.md`](./VENDOR_MANAGEMENT.md) at every quarterly vendor
review, and immediately on any vendor onboarding or offboarding event (see
the 14-step procedure in [`EXIT_PLAN.md`](./EXIT_PLAN.md)).
