# Payment Architecture

## Flow

```
Customer → Egypt One checkout → licensed PSP / bank → transaction ID
         → provider settlement → contractual Egypt One revenue
         → taxes / fees → reconciliation
```

Egypt One is a **payment orchestration layer**, never a fund holder, unless
separately and explicitly licensed to be one. This is enforced in code, not
only in policy: see `int-licensed-payment-service-provider` in
[`INTEGRATION_REGISTRY.md`](./INTEGRATION_REGISTRY.md) (`SANDBOX`, `dataClass:
SENSITIVE`, "Egypt One never holds funds directly") and the `payments` MCP
server in [`MCP_REGISTRY.md`](./MCP_REGISTRY.md) (`dataClass: FINANCIAL`,
`state: PLANNED`, `auditRequired: true`).

## Commission model

`packages/config/src/revenue.ts` is the single source of truth for every
commission rate — there is no hardcoded global rate anywhere else in the
codebase. The oft-quoted "5%" is
`DEFAULT_BASE_COMMISSION_PCT` (`EGYPT_ONE_BASE_COMMISSION_PCT` env var), a
**base negotiation assumption**, not a fixed platform-wide fee: guides run
at 4% "to protect guide earnings," the marketplace runs at 8%, flights use
a 1.5% affiliate model, and government/visa fees are hard-coded to `NONE` —
"Government fees never carry a platform commission" — because they are
statutory, not commercial.

| Service class | Commissionable | Model |
|---|---|---|
| Accommodation, Activity, Transport | Yes | Percentage (base rate) |
| Guide | Yes | Percentage, 4% (protected rate) |
| Flight | Yes | Affiliate, 1.5% |
| Marketplace | Yes | Percentage, 8% |
| Provider subscription | Yes | Flat monthly, $149 |
| Medical referral | No (by default) | Legal review required before enabling |
| Government fee, visa fee | No | Hard rule — never commissioned |
| Investment lead | Yes | Flat, contract-defined, $0 until a contract exists |

## PCI / financial data handling

Payments engineers (Lot H) receive PSP-scoped secrets access only — never
raw PAN data; see the Security & Access Matrix in
[`VENDOR_MANAGEMENT.md`](./VENDOR_MANAGEMENT.md). Any future PCI DSS scope
determination happens before a PSP is contracted, not after.
