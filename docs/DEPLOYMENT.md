# Deployment

## Environments

| Environment | Purpose | Data | Notes |
|---|---|---|---|
| Local | Development | DEMO_MODE (in-memory JSON) by default | `pnpm --filter @egypt-one/web dev` |
| Dev | Integration testing | DEMO_MODE or a shared dev Postgres | Deploy on every merge to `main` |
| Staging | Pre-release verification | Seeded Postgres via `pnpm seed` | Mirrors production infra at smaller scale |
| Production | Live | Real Postgres, Redis, OpenSearch, S3-compatible storage | No `LIVE` integration/MCP tool state is flipped without a signed-off contract |

## Local, without Docker

```bash
pnpm install
pnpm --filter @egypt-one/web dev
```

## Local, with Docker (full infra)

```bash
cp .env.example .env
docker compose up --build
```

Brings up `web`, `postgres`, `redis`, `opensearch`, `minio`. The web
container still runs happily against none of them (DEMO_MODE) if
`DATABASE_URL` is left unset in `.env`.

## Production build

```bash
pnpm --filter @egypt-one/web build
```

Produces a fully static-generated site across all 8 locales for every
content route, plus a small number of dynamic API route handlers
(`/api/search`, `/api/trip/build`, `/api/ai/concierge`). Deploy the
`.next/standalone` output (see `infrastructure/docker/Dockerfile.web`) to
any Node-compatible host, or to a platform that understands the Next.js
build output directly.

## Database migration path

1. Point `DATABASE_URL` at a real Postgres instance.
2. Once network access to the Prisma binary host is available in the
   deploy environment, run `npx prisma generate` and `npx prisma migrate
   deploy` against `packages/database/prisma/schema.prisma` (unverified by
   the Prisma CLI in this sandbox — see `SECURITY.md`'s known gaps).
3. Run `pnpm seed` to load the demo pack (tagged `sourceStatus: 'DEMO'`) or
   skip seeding and connect real data sources behind the same repository
   API.

## Rolling back a bad deploy

Because every content route is statically generated, the safest rollback is
redeploying the previous build artifact — no database migration is implied
by a frontend rollback as long as the Prisma schema version deployed
alongside it is compatible.
