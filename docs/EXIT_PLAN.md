# Vendor Exit & Replacement Plan

Written into every vendor contract before signature, not negotiated after
the fact. Companion to [`VENDOR_MANAGEMENT.md`](./VENDOR_MANAGEMENT.md).

## Mandatory exit-clause deliverables

A terminating vendor must hand over:

- Full source code — already true throughout the engagement, since it lives
  in Egypt One-owned repositories from day one, not just at exit
- Architecture notes, runbooks, deployment guide, open-issues log
- Infrastructure-as-Code, database schema, API documentation
- Recorded knowledge-transfer sessions
- Data export in a documented, non-proprietary format
- Backup confirmation — verified restorable, not just present
- Credential handover, followed by full credential rotation and access
  revocation

Transition support: **30 days minimum** for a support-only engagement (Lot
B/C); **90 days** for any vendor holding infrastructure, data, or SOC
responsibility.

## The 14-step vendor change procedure

1. Termination notice issued
2. Freeze on undocumented changes
3. Asset inventory reconciliation
4. Credentials inventory
5. Data export
6. Documentation review against the exit-clause list above
7. Backup verification (test restore, not just a file listing)
8. New vendor onboarding begins
9. Knowledge transfer sessions
10. Parallel operations period
11. Cutover
12. Old vendor access revocation — all accounts, all keys
13. Security audit of the new state
14. Final acceptance

## Replacement paths (categories, not vendor endorsements)

| Lot | Primary category | Replacement category | Why it's portable |
|---|---|---|---|
| A — Cloud | Hyperscaler-class provider | A second hyperscaler-class or sovereign/local cloud | IaC + containers avoid provider-specific services |
| D — SOC | Managed SOC provider | Alternate managed SOC | SIEM ingestion is standard-format, not proprietary |
| H — Payments | Licensed PSP #1 | Licensed PSP #2 | Egypt One only orchestrates, never stores card data |
| I — AI/MCP | Model/gateway vendor #1 | Model/gateway vendor #2 | Prompts, skills and agent logic live in Egypt One-owned `packages/agents` and `packages/mcp`, not the vendor's platform |

## Why this stays enforceable in code, not just on paper

The portability claims above are backed by concrete repo structure, not
just contract language:

- `packages/agents/src/registry.ts` and `packages/mcp/src/registry.ts` are
  the actual source of truth for what every AI agent and MCP server can and
  cannot do — a new AI/MCP vendor plugs into these registries, it doesn't
  replace them.
- `packages/integrations/src/index.ts` defines adapter *contracts*
  (`AccommodationProviderAdapter`, `PaymentProviderAdapter`, etc.) — see
  [`INTEGRATION_REGISTRY.md`](./INTEGRATION_REGISTRY.md) — so swapping the
  company behind an adapter never means rewriting the calling code.
- `packages/database`'s repository interface (`db.*`) is identical whether
  `DATABASE_URL` is set or not (see [`DEMO_MODE.md`](./DEMO_MODE.md)), so a
  future database vendor change is a connection-string change, not an
  application rewrite.
