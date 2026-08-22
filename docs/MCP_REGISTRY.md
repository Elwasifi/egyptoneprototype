# MCP Registry

The literal registration table behind [`MCP_ARCHITECTURE.md`](./MCP_ARCHITECTURE.md)'s
"every MCP server must be registered before it can be attached" rule. Generated
from `packages/mcp/src/registry.ts` — regenerate this table by hand whenever
`MCP_SERVERS` changes; nothing here is computed at runtime.

| Server | Family | Owner | Vendor | Environment | Data class | Rate limit/min | Audit required | Security review | State |
|---|---|---|---|---|---|---|---|---|---|
| tourism-knowledge | Content | Egypt One content team | Egypt One (in-house) | DEV | PUBLIC | 120 | No | NOT_STARTED | SANDBOX |
| heritage | Content | Egypt One content team | Egypt One (in-house) | DEV | PUBLIC | 120 | No | NOT_STARTED | SANDBOX |
| governorates | Geography | Egypt One content team | Egypt One (in-house) | DEV | PUBLIC | 120 | No | NOT_STARTED | SANDBOX |
| booking | Commerce | Egypt One product team | Accommodation / transport partners (planned) | DEV | PARTNER | 30 | Yes | NOT_STARTED | PLANNED |
| provider | Supply | Egypt One verification team | Egypt One (in-house) | DEV | PARTNER | 120 | No | NOT_STARTED | SANDBOX |
| transport | Commerce | Egypt One product team | Transport partners (planned) | DEV | PARTNER | 60 | No | NOT_STARTED | PLANNED |
| investment | Investment | Egypt One investment desk | Competent entities (planned) | DEV | PUBLIC | 60 | No | NOT_STARTED | SANDBOX |
| research | Education | Egypt One content team | Universities (planned) | DEV | PUBLIC | 60 | No | NOT_STARTED | SANDBOX |
| health | Health | Egypt One health desk | Accredited providers (planned) | DEV | HEALTH | 20 | Yes | NOT_STARTED | PLANNED |
| payments | Finance | Egypt One finance team | Licensed PSP (planned) | DEV | FINANCIAL | 30 | Yes | NOT_STARTED | PLANNED |
| analytics | Intelligence | Egypt One data team | Egypt One (in-house) | DEV | RESTRICTED_GOVERNMENT | 60 | Yes | NOT_STARTED | SANDBOX |
| content | Content | Egypt One content team | Egypt One (in-house) | DEV | PUBLIC | 120 | No | NOT_STARTED | SANDBOX |
| government | Government | Egypt One government liaison | Competent authority (planned) | DEV | RESTRICTED_GOVERNMENT | 30 | Yes | NOT_STARTED | PLANNED |
| search | Platform | Egypt One platform team | Egypt One (in-house) | DEV | PUBLIC | 240 | No | NOT_STARTED | SANDBOX |
| map | Platform | Egypt One safety desk | Map provider (planned; schematic default) | DEV | PRECISE_LOCATION | 20 | Yes | NOT_STARTED | PLANNED |

## Status meanings

`PLANNED` declared, not built · `DEMO` returns seeded data, no external
connection · `SANDBOX` connected to a non-production adapter or test
credentials · `APPROVED` governance/security review passed, cleared to go
live, but not yet switched on — the gateway still refuses to call it ·
`LIVE` serving real data through a real connection · `DISABLED` was
connected, now turned off.

## What "no server is LIVE" means today

Every server above is `SANDBOX` or `PLANNED`, every `vendor` is either
"Egypt One (in-house)" or a named future partner explicitly marked
`(planned)`, and every `securityReview` is `NOT_STARTED`. No external
company has been onboarded to any MCP server yet — see
[`VENDOR_MANAGEMENT.md`](./VENDOR_MANAGEMENT.md) for the lot structure any
future MCP/AI infrastructure vendor would be evaluated against (Lot I).

## Changing a server's state

`state` only moves to `APPROVED` after the checks in `securityReview` pass,
and only moves to `LIVE` after a deliberate, reviewed change to
`packages/mcp/src/registry.ts` — never automatically, and never by a runtime
flag. See `packages/mcp/src/gateway.ts`'s `callTool` pipeline for the exact
enforcement order.
