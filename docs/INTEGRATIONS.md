# Integrations

## Adapter pattern

`packages/integrations` defines one abstract base class per external system
category — never a concrete vendor SDK import at the contract level:

`AccommodationProviderAdapter`, `FlightProviderAdapter`,
`MobilityProviderAdapter`, `ActivityProviderAdapter`,
`PaymentProviderAdapter`, `InsuranceProviderAdapter`,
`GovernmentServiceAdapter`, `UniversityAdapter`, `MedicalProviderAdapter`,
`AffiliateAdapter`, `MapProviderAdapter`.

Each concrete adapter carries an `AdapterMeta` (`key`, `displayName`,
`category`, `state`, `dataClass`, `sourceOwner`, `commissionable`, `notes`).
`ADAPTER_LIST` (surfaced on `/partner/integrations` and
`/admin/integrations`) always reflects the true state — no adapter is
described as `LIVE` unless it actually is.

## Current state

| Category | Implementation | State |
|---|---|---|
| Accommodation | `NullAccommodation` | PLANNED |
| Flights | `NullFlights` | PLANNED |
| Mobility | `NullMobility` | PLANNED |
| Activities | `NullActivities` | PLANNED |
| Payments | `SandboxPayments` | SANDBOX |
| Government services | `NullGovernment` | PLANNED |
| University | `NullUniversity` | PLANNED |
| Medical | `NullMedical` | PLANNED |
| Affiliate | `NullAffiliate` | PLANNED |
| Map | `LocalMap` | SANDBOX (schematic, not a licensed vendor) |

Every `Null*` adapter's methods resolve through `BaseAdapter.unavailable()`,
returning a typed "not connected" result rather than throwing or silently
fabricating data.

## Rules that are enforced, not just written down

- `GovernmentServiceAdapter.writePermitted` defaults to `false` — no
  integration can submit anything to a government system by default.
- `MedicalProviderAdapter.transmitsHealthData` defaults to `false`.
- The Payments adapter comment is explicit: *Egypt One must never become an
  unlicensed payment processor* — payments are always PSP-abstracted.
- Government and visa fees are hardcoded `commissionable: false` in
  `packages/config/src/revenue.ts`, independent of any adapter's state.

## Adding a real integration later

1. Implement the relevant abstract base class against the real vendor SDK.
2. Set its `state` to `SANDBOX` while testing, then `LIVE` once contracted
   and verified — this flips automatically everywhere the adapter's state is
   displayed (`/partner/integrations`, `/admin/integrations`, the relevant
   MCP tool's `state`).
3. Never mark an adapter `LIVE` before the underlying contract and
   compliance review exist — the platform has no other gate against this
   besides engineering discipline, so it is called out explicitly here.
