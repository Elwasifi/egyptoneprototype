# Cloud Architecture

The production destination this repository builds toward. **Nothing below
is deployed today** — there is no live cloud account, database, or auth
provider connected to this codebase; see [`DEMO_MODE.md`](./DEMO_MODE.md)
for what actually runs right now.

## Design constraint: portability first

Prefer containers, Terraform/OpenTofu, standard PostgreSQL, S3-compatible
storage, standard Redis, an OpenSearch-compatible search index, OIDC/OAuth2,
and plain REST/event interfaces over any single cloud vendor's proprietary
managed services. Kubernetes only where a documented justification exists —
not by default. Every service that could create vendor lock-in gets an
abstraction layer in this codebase before it gets a vendor behind it; see
how `packages/database`'s `db.*` interface and `packages/integrations`'s
adapter contracts already do this for data and third-party services.

## Request path

```
Users → CDN → DDoS protection → WAF → Load balancer → API Gateway
      → Identity & access layer (OIDC / OAuth2 / MFA)
      → Egypt One application platform (this Next.js app)
      → Service layer → AI orchestration layer → Skills → MCP Gateway
      → Integration adapters → approved government / partner / provider APIs
```

## Data layer

PostgreSQL (primary store — replaces the `packages/database` demo JSON pack
once `DATABASE_URL` is set), Redis (cache/session), OpenSearch-compatible
search, S3-compatible object storage, an analytics/warehouse store, an
append-only audit store, and a separate backup vault.

## Environments

LOCAL, DEV, TEST, QA, STAGING, UAT, PRODUCTION. Government integrations
additionally carry their own state independent of the app environment:
SIMULATED, SANDBOX, APPROVED TEST, PRODUCTION — see
[`MCP_REGISTRY.md`](./MCP_REGISTRY.md)'s `state` column for how that's
represented in code today.

## Phase roadmap

| Phase | Scope | Exit condition |
|---|---|---|
| 1 — Foundation | Cloud landing zone, IaC baseline, CI/CD on Egypt One-owned accounts, staging environment, real Postgres replacing DEMO_MODE, IAM, secrets manager, monitoring skeleton | Staging deploys from Egypt One repos with no manual console changes; security scan baseline passes |
| 2 — Hardening & Integration | WAF/DDoS/CDN in front of production, SOC onboarding, independent pentest #1, first sandbox government/partner adapters, backup + DR drill #1 | Pentest critical/high findings closed and retested; DR drill meets target RPO/RTO |
| 3 — Scale & Live Integrations | Production cutover, first LIVE integration adapters (individually approved), payment orchestration via a licensed PSP, AI/MCP production gateway, full observability + vendor scorecards | Quarterly vendor review running; exit-plan documentation on file for every active vendor |

## Illustrative monthly cost (Phase 1)

Ranges only, not a quotation — depends on region, chosen vendors, and
traffic. Treat every figure as unverified until a named vendor provides a
signed quote against this architecture.

| Category | Range (USD/mo) |
|---|---|
| Compute + container hosting (staging + small prod) | 800 – 2,500 |
| Managed PostgreSQL + Redis + OpenSearch | 500 – 1,800 |
| Object storage + CDN + backups | 150 – 600 |
| WAF + DDoS protection | 200 – 900 |
| Secrets manager + IAM/SSO | 100 – 400 |
| SOC / SIEM / monitoring (Phase 2+) | 1,500 – 6,000 |
| AI gateway / model routing usage | 300 – 3,000+ (usage-based) |

See [`NETWORK_ARCHITECTURE.md`](./NETWORK_ARCHITECTURE.md) for zoning,
[`DISASTER_RECOVERY.md`](./DISASTER_RECOVERY.md) for RPO/RTO, and
[`VENDOR_MANAGEMENT.md`](./VENDOR_MANAGEMENT.md) for who is allowed to touch
which part of this diagram.
