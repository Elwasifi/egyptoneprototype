# Business Continuity

Operational continuity during an incident, as distinct from the technical
recovery mechanics in [`DISASTER_RECOVERY.md`](./DISASTER_RECOVERY.md).

## Escalation matrix

On-call engineer → team lead → vendor account manager (if the affected
component is vendor-operated) → Egypt One technical owner. Each tier is
triggered automatically if the prior tier misses its response window — see
the severity table below, shared with every vendor's support SLA.

| Severity | Definition | Response | Resolution target |
|---|---|---|---|
| P1 | Production down / data at risk | 15 min | 4 hours |
| P2 | Major feature broken, no workaround | 1 hour | 1 business day |
| P3 | Degraded, workaround exists | 4 hours | 3 business days |
| P4 | Cosmetic / low impact | 1 business day | Next release cycle |

Production application uptime target: 99.9% monthly, excluding pre-agreed
maintenance windows.

## During an incident

- No vendor makes a unilateral production change during an active incident
  without Egypt One sign-off — see the Security & Access Matrix in
  [`VENDOR_MANAGEMENT.md`](./VENDOR_MANAGEMENT.md).
- SOC (Lot D) may access security telemetry for incident response; access
  to business/customer data beyond telemetry requires a specific, approved,
  time-boxed grant — not a standing permission.
- Every privileged access grant made during an incident is logged the same
  as any other access — "break-glass" access is still audited, per
  `packages/security`'s `breakGlass` flag.

## After an incident

A postmortem is required for every P1 and P2. The postmortem, and any
resulting runbook update, land in [`RUNBOOKS.md`](./RUNBOOKS.md) — an
incident that doesn't produce a runbook update is treated as unresolved
process work, even if the technical issue is fixed.
