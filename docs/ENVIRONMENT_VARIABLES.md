# Environment Variables

See [`.env.example`](../.env.example) for the copy-pasteable template. This
document explains what each group controls and what happens when it is
left unset.

| Variable | Required? | Default behaviour if unset |
|---|---|---|
| `NODE_ENV` | No | `development` |
| `EGYPT_ONE_APP_NAME` | No | `"Egypt One"` |
| `EGYPT_ONE_DEFAULT_LOCALE` | No | `en` |
| `DATABASE_URL` | No | **DEMO_MODE**: the seeded JSON pack is used instead of Postgres |
| `REDIS_URL` | No | Job queues (BullMQ) are not exercised; no in-repo code currently requires Redis to boot |
| `OPENSEARCH_URL` | No | `search()` falls back to the in-memory cross-entity search over the demo pack |
| `STORAGE_ENDPOINT` / `STORAGE_BUCKET` / `STORAGE_ACCESS_KEY` / `STORAGE_SECRET_KEY` | No | No file uploads are wired to real object storage yet; `SmartImage` needs none of these |
| `EGYPT_ONE_BASE_COMMISSION_PCT` | No | Defaults to `5` inside `packages/config/src/revenue.ts` — a base assumption only, applied per service class, never globally |
| `PAYMENTS_PROVIDER` / `PAYMENTS_API_KEY` | No | The `SandboxPayments` adapter is used; no real payment provider is ever contacted |
| `AI_SERVICE_URL` | No | Not currently read by any code path — reserved for a future standalone AI service |
| `EGYPT_ONE_MAP_PROVIDER` | No | Defaults to `schematic` — the vendor-neutral `EgyptMap` SVG component |
| `MAPBOX_TOKEN` | No | Unused while `EGYPT_ONE_MAP_PROVIDER=schematic` |
| `AUTH_SECRET` / `AUTH_URL` | No | No authentication provider is wired yet; all portal pages use a fixed demo principal |
| `SENTRY_DSN` / `LOG_LEVEL` | No | No error tracking is wired yet |

## Rule

**No real secret is ever committed to this repository.** `.env.example`
contains placeholder values or commented-out keys only; real values belong
in an untracked `.env`/`.env.local` file or your deployment platform's
secret manager.
