# Network Architecture

Target network segmentation — see [`CLOUD_ARCHITECTURE.md`](./CLOUD_ARCHITECTURE.md)
for the surrounding request path. Not deployed yet; this is the design any
Lot A cloud vendor is evaluated against.

## Zones

| Zone | Contains | Reachable from |
|---|---|---|
| Public | CDN, WAF, load balancer, API Gateway | Internet |
| Application | Egypt One app platform, service layer, AI orchestration, MCP gateway | Public zone only, via the API Gateway |
| Integration | Integration adapters | Application zone only |
| Database | PostgreSQL, Redis, OpenSearch, object storage | Application zone only — **never internet-accessible** |
| Security | SIEM/SOC ingestion, audit store | Application + database zones (read-only telemetry) |
| Management | CI/CD runners, bastion/JIT access broker | Named, MFA'd operator accounts only |

## Rules

- Production databases are never internet-accessible, under any
  circumstance.
- Private networking, firewall policies and security groups enforce zone
  boundaries; the WAF and API Gateway are the only public entry points.
- VPN or private-link connectivity for anything that must reach the
  management zone.
- Prefer bastionless, just-in-time privileged access over standing bastion
  hosts — see [`RBAC_ABAC.md`](./RBAC_ABAC.md) for the access model this
  implements.
- Government integrations reach Egypt One only through the Integration
  zone's adapters — never a direct path from a government system to the
  Database zone. See "Government data sovereignty" below.

## Government data sovereignty

```
Government system → government-controlled API → secure integration gateway → Egypt One
```

Never:

```
Egypt One → direct government database
```

Government data stays at its source system whenever technically possible;
Egypt One's Integration zone only ever calls an approved, government-owned
API — see the Government-category rows in
[`INTEGRATION_REGISTRY.md`](./INTEGRATION_REGISTRY.md), all currently
`PLANNED`, none connected.
