# EGYPT ONE — Phase 0 Blueprint
**One Egypt. One Journey. One Platform.**

Status of this document: implementation contract for the prototype. All data in the
prototype is `DEMO` unless a record explicitly carries another source status.

---

## 0. Governing assumptions

| # | Assumption | Consequence in code |
|---|---|---|
| A1 | Egypt One is a coordinator / integration layer, **not** a government system | No direct DB access to any authority. All external reads pass `packages/integrations` adapters. |
| A2 | No commercial agreements exist yet with any named brand | Every affiliate/partner record ships with status `PLANNED`; brand names appear only as adapter *classes*, never as "our partner". |
| A3 | No Golden License, no GAFI approval, no licence issuing capability | `/admin/golden-license` is an internal readiness tracker only; business setup is a navigator, not an application processor. |
| A4 | Prototype runs without Postgres | `DEMO_MODE=true` serves the seeded content pack from `packages/database/demo`; the same repository interface swaps to Prisma when `DATABASE_URL` is set. |
| A5 | Commission is contractual, never global | `5%` exists once, as `DEFAULT_BASE_COMMISSION_PCT` in the revenue config, applied only to `commissionable: true` service classes. Government fees are `commissionable: false`. |
| A6 | Health, genetics, precise location and identity are elevated-risk | Data class `SENSITIVE`; ABAC purpose check + consent record required for every read. |
| A7 | Logo | The supplied circular Egypt One mark (gold ankh + pyramids + Sphinx) is adapted into an SVG mark used at all placements; the reference screenshot is never used as a logo or as a layout. |

### Source-status vocabulary (used everywhere: DB, API, AI answers, UI badges)
`LIVE` · `VERIFIED_DATA` · `PARTNER_DATA` · `DEMO` · `SIMULATED` · `PLANNED_INTEGRATION`

---

## A. Sitemap — 74 route templates

Locale-prefixed: `/[locale]/...` for `ar en fr zh ja ru el hi`.

**A. Public / Core (8)**
`/` · `/about` · `/discover` · `/search` · `/media` · `/reviews` · `/traveler-stories` · `/support`

**B. Discover Egypt (12)**
`/governorates` · `/governorates/[slug]` · `/cities/[slug]` · `/villages/[slug]` · `/destinations/[slug]` · `/attractions/[slug]` · `/egypt-through-time` · `/rulers-of-egypt` · `/rulers-of-egypt/[slug]` · `/egypt-195` · `/egypt-195/[country]` · `/map`

**C. Travel & Booking (12)**
`/trip-builder` · `/my-itinerary` · `/hotels` · `/accommodation` · `/flights` · `/transport` · `/car-rental` · `/vip-transport` · `/guides` · `/guides/[slug]` · `/activities` · `/restaurants`

**C2. Travel support (6, folded into C count budget)**
`/cafes` · `/shopping` · `/events` · `/offers` · `/visa` · `/safety`

**D. Heritage & Culture (8)**
`/heritage` · `/heritage/[slug]` · `/hidden-heritage` · `/restoration` · `/museums` · `/museums/[slug]` · `/egyptian-heritage-worldwide` · `/ancient-egypt-academy`

**E. Investment & Business (10)**
`/invest` · `/investment-opportunities` · `/investment-opportunities/[slug]` · `/entertainment-investment` · `/tourism-investment` · `/real-estate` · `/new-cities` · `/rural-egypt` · `/business-setup` · `/corporate-mice`

**F. Health / Research / Education (6)**
`/health` · `/medical-tourism` · `/wellness` · `/research` · `/universities` · `/know-your-origin`

**G. Nile & Sea + Marketplace (6)**
`/nile` · `/sea` · `/cruises` · `/yachts` · `/marketplace` · `/wear-egypt`

**H. Account (6)**
`/account` · `/account/trips` · `/account/bookings` · `/account/pass` · `/account/wallet` · `/account/consent`

**I. Provider (8)**
`/provider` · `/provider/profile` · `/provider/services` · `/provider/bookings` · `/provider/availability` · `/provider/analytics` · `/provider/payouts` · `/provider/compliance`

**J. Partner (5)**
`/partner` · `/partner/integrations` · `/partner/api` · `/partner/transactions` · `/partner/analytics`

**K. Government (9)**
`/government` · `/government/tourism-intelligence` · `/government/national-map` · `/government/providers` · `/government/heritage` · `/government/restoration` · `/government/emergencies` · `/government/investment` · `/government/analytics`

**L. Admin (12)**
`/admin` · `/admin/content` · `/admin/users` · `/admin/providers` · `/admin/verification` · `/admin/integrations` · `/admin/revenue` · `/admin/support` · `/admin/audit` · `/admin/ai` · `/admin/security` · `/admin/golden-license`

**Total: 74 templates** (dynamic `[slug]` templates render N records each; e.g. one governorate template serves all 27).

Homepage rule: previews and entry points only — never the full functionality of a module.

---

## B. Component map

```
packages/ui
├── primitives/      Button Badge Card Input Select Tabs Dialog Drawer Sheet Tooltip
│                    Skeleton Progress Switch Avatar Separator ScrollArea Table
├── brand/           Logo(full|compact|mark) GoldRule AnkhGlyph Watermark
├── data/            SourceBadge StatCard Counter TrendChart DonutChart BarStrip
│                    DataTable EmptyState ErrorState PermissionDenied IntegrationUnavailable
├── layout/          SiteHeader MegaMenu SideNav MobileDrawer BottomNav Footer
│                    PortalShell Breadcrumbs PageHeader SectionHeader
├── discovery/       DestinationCard GovernorateCard HeritageCard MuseumCard
│                    GuideCard HotelCard EventCard OpportunityCard ProductCard
│                    CarouselRow BentoGrid FilterRail SearchCommand
├── media/           SmartImage (adapter-backed) Gallery VideoFrame CinematicHero
├── map/             MapCanvas (adapter) EgyptChoropleth MarkerLayer MapLegend
├── time/            EraTimeline RulerCard TimelineScrubber
├── ai/              ConciergeLauncher ConciergePanel MessageStream ActionCard
│                    ItineraryCard SourceCitation AgentTrace
└── forms/           StepperForm FieldGroup ConsentToggle FileDrop
```

Design tokens (`packages/config/theme`): background `#06111A → #0D1B27`, gold ramp
`#B88A3B / #C99B4A / #D8A84E`, Nile blue, turquoise, bronze, sandstone, emerald, sunset.
Surfaces: dark glass, 1px gold hairline borders, layered shadow, restrained blur.

---

## C. AI agent map

```
                 ┌──────────────────────────────────────┐
   user ───────► │ AGENT 0 — EGYPT ONE AI CONCIERGE     │ ◄── the only agent the user sees
                 │ intent · decomposition · routing     │
                 │ context · permission gate · compose  │
                 └───┬──────────────────────────────────┘
                     │ routes to (never exposed by name in UI)
 ┌──────────┬────────┼─────────┬──────────┬──────────┬──────────┐
 │ 1 Trip   │ 2 Heritage│ 3 Booking│ 4 Language│5 Guide  │6 Safety │
 │ Planner  │ &Destination│        │          │ Matching│         │
 ├──────────┼──────────┼──────────┼──────────┼──────────┼─────────┤
 │7 Medical │8 Investment│9 Business│10 Gov't │11 Tourism│12 Trust │
 │ Tourism  │           │ Setup    │ Services │ Intel    │ &Verify │
 ├──────────┼──────────┼──────────┴──────────┴──────────┴─────────┤
 │13 Research│14 Marketing│15 Operations                          │
 └──────────┴──────────┴────────────────────────────────────────┘
                     │
                     ▼  every agent calls tools only through
              MCP Gateway / Tool Registry  ──► adapters ──► authoritative systems
```

Each agent declares: `id, purpose, canDo[], cannotDo[], allowedTools[], dataClasses[],
requiredRoles[], requiresHumanApproval, sourceLabelPolicy`. The Concierge refuses to
route when the caller's role/consent does not satisfy the target agent's contract, and
returns a `PermissionDenied` action card instead.

**AI source rule (enforced in code, not prompt-only):** any answer touching laws, visas,
permits, licences, ticket availability, live pricing, opening hours, medical claims,
investment guarantees or government decisions must carry a source label; if no tool
returned a labelled record, the composer downgrades to `AI_ANALYSIS` and states the
limitation.

---

## D. MCP / Skills / Plugin architecture

**MCP Gateway** (`packages/mcp`) — registry of tool families, each tool declaring
`name, description, inputSchema (Zod), permissions, dataClass, sourceOwner,
auditRequired, rateLimit, status`.

Tool families: Tourism Knowledge · Heritage · Governorates · Booking · Provider ·
Transport · Investment · Research · Health Provider · Payments · Analytics · Content ·
Government Integration · Search · Map/Location.

**Skills** (`packages/skills`) — composable procedures that orchestrate MCP tools and
never hold vendor code: `PlanEgyptTrip`, `FindGovernorate`, `ExplainHeritageSite`,
`BuildItinerary`, `FindGuide`, `FindAccommodation`, `FindTransport`,
`DiscoverInvestment`, `CompareInvestmentLocations`, `FindMedicalProvider`,
`FindResearchProgram`, `ExplainGovernmentProcedure`, `VerifyProvider`,
`GenerateTourismInsight`.

**Plugins / connectors** (`packages/integrations`) — one contract per class:
`AccommodationProviderAdapter`, `FlightProviderAdapter`, `MobilityProviderAdapter`,
`ActivityProviderAdapter`, `PaymentProviderAdapter`, `InsuranceProviderAdapter`,
`GovernmentServiceAdapter`, `UniversityAdapter`, `MedicalProviderAdapter`,
`AffiliateAdapter`. Statuses: `PLANNED | SANDBOX | LIVE | DISABLED`.

Layering rule: **Skill → MCP tool → Adapter → external system.** No skill imports a vendor SDK.

---

## E. Domain model (58 core entities)

Identity: `users, profiles, organizations, roles, permissions, tourist_profiles,
investor_profiles, researcher_profiles`
Geography: `governorates, cities, villages, districts`
Content: `destinations, attractions, heritage_sites, museums, rulers, historical_eras,
heritage_worldwide_objects, countries`
Supply: `providers, provider_documents, licenses, verification_records, hotels,
accommodations, restaurants, cafes, guides, tour_operators, transport_providers,
car_rental, yacht_providers, medical_providers, universities, events, activities`
Journey: `trips, itineraries, trip_days, trip_items, bookings`
Money: `payments, transactions, commissions, settlements, refunds, revenue_rules`
Investment: `investment_opportunities, properties, business_opportunities`
Voice: `reviews, ratings, traveler_stories, media_assets`
Ecosystem: `partners, partner_integrations, api_clients, webhooks,
government_integrations, integration_registry`
Ops: `notifications, support_cases, consent_records, location_consents,
location_events, audit_logs`
AI: `ai_sessions, ai_messages, ai_actions, ai_agents, skills, mcp_servers, mcp_tools,
knowledge_sources`
Analytics: `analytics_events, tourism_metrics, investment_metrics`

Cross-cutting columns on every content/supply table: `sourceStatus`, `sourceOwner`,
`sourceUrl`, `verifiedAt`, `dataClass`.

---

## F. RBAC + ABAC matrix (summary)

22 roles: Tourist, DomesticTraveler, Investor, Researcher, Guide, Hotel, Restaurant,
TourOperator, TransportProvider, MedicalProvider, University, BusinessProvider, Partner,
GovernmentOfficer, GovernmentAnalyst, Moderator, SupportAgent, Finance, Security, Admin,
SuperAdmin, System.

| Resource | Tourist | Provider | Partner | Gov Analyst | Gov Officer | Admin |
|---|---|---|---|---|---|---|
| public content | R | R | R | R | R | RW |
| own trip/booking | RW | – | – | – | – | R (audited) |
| provider inventory | – | RW (own) | – | – | R | RW |
| verification decision | – | – | – | – | RW | RW |
| aggregated tourism intel | – | own slice | own slice | R | R | R |
| personal data | own | own customers (min.) | – | ✗ | ✗ | R (audited) |
| health data | own | own patients | ✗ | ✗ | ✗ | ✗ (break-glass, audited) |
| restricted government | ✗ | ✗ | ✗ | scoped | scoped | ✗ |
| integration status | ✗ | R (own) | R (own) | R | R | RW |
| revenue rules | ✗ | own | own | ✗ | ✗ | RW |

ABAC decision inputs: `role, organizationId, purpose, dataClass, subjectLocation,
legalAuthority, integrationPermission, consentState, breakGlass`. Every `SENSITIVE` or
`RESTRICTED_GOVERNMENT` decision writes an `audit_log` row regardless of outcome.

---

## G. Implementation phases

| Phase | Content |
|---|---|
| 1 | Monorepo, design system, tokens, i18n, layout shell, auth, CMS core |
| 2 | Data layer: schema, repositories, demo content pack, source labels |
| 3 | Public Egypt: home, 27 governorates, destinations, heritage, timeline, museums, Egypt 195 |
| 4 | Travel: trip builder, services, guides, Nile/Sea, events, booking UX |
| 5 | Investment, health/research, marketplace |
| 6 | Portals: account, provider, partner, government, admin |
| 7 | AI: Concierge, 16 agents, MCP registry, skills, source labelling |
| 8 | Security, analytics, finance, demo hardening, tests, docs |
