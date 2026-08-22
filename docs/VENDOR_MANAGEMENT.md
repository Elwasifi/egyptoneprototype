# Vendor Management

Egypt One is built multi-vendor, vendor-neutral, and with zero tolerance for
a single supplier controlling more than one of: source code, cloud,
security audit, SOC, database administration, or backups. This document is
the durable, repo-tracked reference; the full procurement pitch (RACI
tables, questionnaire, contract negotiation points, commercial models) was
produced separately as the *Egypt One Vendor Governance Dossier* for
procurement use — this file is its lasting summary, kept where engineers
will actually see it.

## The nine lots

No lot controls more than one of development, production infrastructure,
security audit, or SOC — unless a documented, approved exception exists.

| Lot | Responsible for | Never allowed | Status in this repo |
|---|---|---|---|
| A — Enterprise & Cloud Architecture | Landing zone, network, compute, containers, storage, LB/CDN, backup infra, monitoring infra | Owning data, the cloud tenant, or master keys | Not yet engaged |
| B — Application Development | Frontend, backend, APIs, all seven portals, AI interface | Prod root access, direct government DB access, certifying its own security | In progress — this codebase; no formal vendor contract yet |
| C — DevSecOps | CI/CD, security scanning, release automation, container scanning | Operating outside Egypt One-owned repos/accounts | Not yet engaged |
| D — Cybersecurity & SOC | SIEM, monitoring, detection, incident response | Modifying application code without separate authorization | Not yet engaged |
| E — Independent Penetration Testing | Web/API/cloud/identity/AI/MCP testing, red team, VA | Any affiliation with Lot B | Not yet engaged |
| F — GRC / Privacy / PDPL | Data classification, mapping, consent, retention, DPAs | — | Not yet engaged |
| G — Government Integration | Approved API adapters, integration gateway, data minimization | Direct government DB access without formal approval | Not yet engaged — see [`INTEGRATION_REGISTRY.md`](./INTEGRATION_REGISTRY.md) |
| H — Payments | Orchestration layer over a licensed PSP/bank | Holding customer funds without a license | Not yet engaged |
| I — AI / MCP Infrastructure | AI gateway, model routing, agent infra, MCP gateway, tool registry | Owning Egypt One prompts, skills, or business logic | In progress — `packages/agents`, `packages/mcp` exist in-repo; no production gateway or external vendor yet |

## Ownership that never transfers to a vendor

Source code, Git repositories, cloud accounts, domains/DNS, databases,
encryption keys, API credentials, government API credentials, AI accounts,
MCP configurations, CI/CD pipelines, IaC, architecture documentation, data
models, backups, logs, monitoring accounts, provider contracts, the design
system, AI prompts/skills/agent configuration. Vendors receive delegated,
scoped, time-boxed access — never ownership. See
[`RBAC_ABAC.md`](./RBAC_ABAC.md) for how that access model is enforced in
code (`packages/security`).

## Access model

Zero trust, least privilege, RBAC + ABAC, just-in-time. No shared admin
accounts for any vendor, ever — every grant maps to a named individual
account with an expiry.

## Contract term strategy

| Area | Term | Rationale |
|---|---|---|
| Architecture (Lot A input) | 2–4 month fixed project | Bounded deliverable, evaluable before recurring spend |
| Development (Lot B) | Milestone-based | Payment tracks accepted, working increments |
| Managed infrastructure (Lot A/C) | Monthly, usage-based initially | No long commitment before real traffic patterns are known |
| DevSecOps (Lot C) | 6-month renewable managed service | Long enough for institutional pipeline knowledge, short enough to re-tender |
| SOC (Lot D) | 12-month SLA with termination rights | Continuity matters, but must stay exitable |
| Pentest (Lot E) | Per-assessment engagement | Independence requires it never become a standing delivery relationship |
| GRC (Lot F) | Project + monthly advisory retainer | Mapping is a project; regulatory change needs a light retainer |
| Support (any lot) | 6–12 months renewable | Natural checkpoint to apply the vendor scorecard below |

## Vendor scorecard

Review quarterly on: availability, SLA adherence, response time, incident
handling, security posture, quality, documentation completeness, knowledge
transfer, cost, compliance, user satisfaction.

## Red flags — reasons to pause an engagement

- Insists on hosting code or infrastructure under a vendor-owned account
- Cannot name a specific RPO/RTO it will contractually commit to
- Proposes to perform its own penetration testing as the only validation
- Uses or proposes shared/admin credentials instead of named, scoped accounts
- Has no concrete IaC toolchain
- Resists an exit clause, or only quotes an offboarding fee at termination
- Cannot disclose where data is physically stored, or uses an undisclosed offshore team
- Uses undisclosed subcontractors
- Cannot produce a single verifiable reference for comparable work
- Pushes for an annual/multi-year commitment before any milestone ships
- Treats documentation as an end-of-project afterthought

See [`EXIT_PLAN.md`](./EXIT_PLAN.md) for what happens when a vendor
relationship ends, planned or not.
