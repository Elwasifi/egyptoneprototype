# Integration Registry

The literal table behind [`INTEGRATIONS.md`](./INTEGRATIONS.md)'s adapter
contracts. Generated from `packages/database/src/demo/integrations.json` —
regenerate this table by hand whenever that file changes.

| Integration | Category | Adapter | State | Data class | Commissionable | Notes |
|---|---|---|---|---|---|---|
| Accommodation aggregator (class A) | Accommodation | AccommodationProviderAdapter | PLANNED | PARTNER | Yes | No commercial agreement exists. |
| Short-let rental platform (class B) | Accommodation | AccommodationProviderAdapter | PLANNED | PARTNER | Yes | No commercial agreement exists. |
| Airline distribution (class A) | Flights | FlightProviderAdapter | PLANNED | PARTNER | Yes | No commercial agreement exists. |
| Ride-hailing mobility (class A) | Mobility | MobilityProviderAdapter | PLANNED | PARTNER | Yes | No commercial agreement exists. |
| Activities marketplace (class A) | Activities | ActivityProviderAdapter | PLANNED | PARTNER | Yes | No commercial agreement exists. |
| Car rental aggregator | Mobility | MobilityProviderAdapter | PLANNED | PARTNER | Yes | No commercial agreement exists. |
| Licensed payment service provider | Payments | PaymentProviderAdapter | SANDBOX | SENSITIVE | No | Egypt One never holds funds directly; sandbox only. |
| Travel insurance provider | Insurance | InsuranceProviderAdapter | PLANNED | PARTNER | Yes | No commercial agreement exists. |
| Ministry of Tourism and Antiquities — site registry | Government | GovernmentServiceAdapter | PLANNED | RESTRICTED_GOVERNMENT | No | Read-only, subject to an approved data-sharing agreement. |
| Ministry of Foreign Affairs — mission directory | Government | GovernmentServiceAdapter | PLANNED | RESTRICTED_GOVERNMENT | No | Embassy/mission data must come from the official directory. |
| Visa and entry information service | Government | GovernmentServiceAdapter | PLANNED | RESTRICTED_GOVERNMENT | No | Guidance only; Egypt One never issues or approves entry. |
| GAFI investment services | Government | GovernmentServiceAdapter | PLANNED | RESTRICTED_GOVERNMENT | No | Navigation only; Egypt One does not issue licences. |
| CAPMAS statistics feed | Government | GovernmentServiceAdapter | PLANNED | RESTRICTED_GOVERNMENT | No | Until connected, all figures shown are demo/synthetic values. |
| University admissions directory | Research | UniversityAdapter | PLANNED | PARTNER | No | Programme data supplied by each university. |
| Accredited hospital network | Health | MedicalProviderAdapter | PLANNED | SENSITIVE | No | Consent and purpose checks required before any exchange. |
| Map and geocoding provider | Maps | MapProviderAdapter | PLANNED | PUBLIC | No | Vendor-neutral; renders a local vector fallback until connected. |
| Search index (OpenSearch-compatible) | Search | SearchAdapter | SANDBOX | PUBLIC | No | In-memory index in demo mode; OpenSearch in staging/production. |
| Object storage (S3-compatible) | Media | StorageAdapter | SANDBOX | PUBLIC | No | Local filesystem in demo mode. |
| Affiliate network (generic) | Affiliate | AffiliateAdapter | PLANNED | PARTNER | Yes | Generic contract; programme terms govern each payout. |
| FX rate feed | Payments | FxAdapter | PLANNED | PUBLIC | No | Demo rates shown until a licensed feed is connected. |

## Reading this table

`SANDBOX` (3 entries) means an adapter is wired to a non-production
credential or an in-memory stand-in. `PLANNED` (17 entries) means the
adapter *contract* exists in `packages/integrations/src/index.ts` but no
commercial or technical connection does. **Nothing in this registry is
`LIVE`.** That is a statement about this build, not a target — see the
Phase roadmap in [`CLOUD_ARCHITECTURE.md`](./CLOUD_ARCHITECTURE.md).

Every government-category row maps to Lot G and every payments-category row
maps to Lot H in [`VENDOR_MANAGEMENT.md`](./VENDOR_MANAGEMENT.md) — no
single development vendor should ever hold both.
