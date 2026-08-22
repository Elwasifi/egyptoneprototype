# Runbooks

An index, not a library — no production environment exists yet, so there
are no incident runbooks to write for real services. What exists today is
the *shape* every runbook must follow once Phase 1 infrastructure
(`CLOUD_ARCHITECTURE.md`) is live, so the first real incident doesn't start
from a blank page.

## Required runbook shape

Every runbook, once written, must state:

1. **Trigger** — the alert, symptom, or report that starts this runbook
2. **Severity** — mapped to the P1–P4 table in [`BUSINESS_CONTINUITY.md`](./BUSINESS_CONTINUITY.md)
3. **Owner** — which role (not which person) runs this
4. **Steps** — numbered, each with an expected outcome
5. **Rollback** — what to do if the fix doesn't work
6. **Escalation** — who and when
7. **Post-incident** — the postmortem template to fill in

## Anticipated Phase 1 runbooks (not yet written)

- Database failover
- Rotate a leaked or expiring secret
- Roll back a bad deploy
- SOC-flagged suspicious access — response steps
- Government/partner integration adapter outage
- Payment provider (PSP) sandbox/production incident
- AI/MCP gateway rate-limit or abuse event

## Where these will live

Each runbook is added to this file (or a linked file under `docs/runbooks/`
if the set grows large) as the corresponding piece of Phase 1
infrastructure goes live — not written speculatively in advance of the
system it describes existing. A vendor delivering any Phase 1/2 component
is contractually required to deliver the runbook for that component as
part of "Documentation requirements" — see the IT Technology Scope of Work
in the Vendor Governance Dossier.
