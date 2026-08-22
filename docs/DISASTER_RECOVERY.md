# Disaster Recovery

No production environment exists yet — see [`CLOUD_ARCHITECTURE.md`](./CLOUD_ARCHITECTURE.md).
This document defines the targets any Lot A/C vendor's DR proposal is
measured against, and the plan to actually test them once production
exists.

## Targets (Phase 1 minimum, per service tier)

| Tier | Example services | RPO | RTO |
|---|---|---|---|
| Tier 1 — critical | Application platform, auth, database | ≤ 15 min | ≤ 4 hours |
| Tier 2 — important | Search index, object storage, analytics | ≤ 1 hour | ≤ 8 hours |
| Tier 3 — best-effort | Non-production environments | ≤ 24 hours | ≤ 2 business days |

A vendor that cannot name a specific RPO/RTO it will contractually commit
to is a red flag — see [`VENDOR_MANAGEMENT.md`](./VENDOR_MANAGEMENT.md).

## Backup ownership

Egypt One owns backups. The primary infrastructure or development vendor
is never the sole holder of a backup copy — an independent, Egypt
One-controlled backup vault is mandatory (see the data layer in
[`CLOUD_ARCHITECTURE.md`](./CLOUD_ARCHITECTURE.md)).

- Daily full backups, incremental backups between them
- Point-in-time recovery for the primary database
- At least one immutable backup copy
- At least one offsite copy, in a different region/provider than primary
- Scheduled recovery testing — a backup that has never been restored is
  unverified, not a backup

## Primary + recovery environment

A distinct recovery environment (not just "another availability zone" for
Tier 1 services) is required before Phase 3 production cutover. DR drills
run on a fixed schedule, not only after an incident, and each drill's
result (met / missed target, and why) is logged.

## Acceptance test

"Backup restore demonstrated" and "DR test completed" are both explicit
line items in the acceptance criteria any infrastructure vendor is paid
against — see the Payment Milestones and Acceptance Criteria sections of
the Vendor Governance Dossier.

See [`BUSINESS_CONTINUITY.md`](./BUSINESS_CONTINUITY.md) for what happens
operationally during an outage, as distinct from the technical recovery
covered here.
