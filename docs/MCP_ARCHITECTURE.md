# MCP Architecture

Egypt One is **MCP-first**: every capability an AI agent (or, eventually, a
partner integration) can use is declared as an MCP tool before it can be
called — there is no back door that lets an agent read data the registry
doesn't know about.

## Servers

`packages/mcp/src/registry.ts` declares 15 `McpServerSpec` families:
tourism-knowledge, heritage, governorates, booking, provider, transport,
investment, research, health, payments, analytics, content, government,
search, map. Each has a `state` (`PLANNED` / `SANDBOX` / `LIVE` /
`DISABLED`) — today every server is `SANDBOX` or `PLANNED`; none is `LIVE`.

## Tools

30 `McpTool` declarations, each with a Zod input schema, a `permissions`
list, a `dataClass`, a `sourceOwner`, `auditRequired`, a
`rateLimitPerMin`, and its own `state`. Examples: `governorates.list`,
`heritage.search`, `booking.createDraft` (PLANNED), `investment.search`,
`gov.getProcedure` (PLANNED), `location.readWithConsent` (PLANNED),
`trip.buildItinerary`.

## The gateway pipeline

`callTool(toolKey, input, ctx, opts)` in `packages/mcp/src/gateway.ts` runs,
in order:

```
unknown tool?           → UNKNOWN_TOOL
agent not allow-listed? → AGENT_NOT_ALLOWED
over rate limit?        → RATE_LIMIT
input fails Zod schema? → BAD_INPUT
tool PLANNED/DISABLED?  → NOT_CONNECTED   (audited if auditRequired)
no handler registered?  → NOT_CONNECTED
                        → execute, catch, return typed GatewayResult
```

Every branch returns a structured, typed refusal reason — an agent (or the
Concierge API) can always explain *why* it couldn't do something, rather
than failing silently or fabricating a result.

## Skills sit above MCP, not beside it

`packages/skills` functions only ever reach data through this pipeline (in
practice today, through the `packages/database` demo repository standing in
for the tools' eventual handlers) — never by importing a data source
directly — so the enforcement point cannot be bypassed by adding a new
skill.

## Plugin / connector architecture

`packages/integrations` defines the adapter contracts (Accommodation,
Flight, Mobility, Activity, Payment, Insurance, GovernmentService,
University, MedicalProvider, Affiliate, Map) that a real MCP tool handler
would call into. See [`INTEGRATIONS.md`](./INTEGRATIONS.md).
