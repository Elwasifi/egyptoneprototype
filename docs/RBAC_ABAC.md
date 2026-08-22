# RBAC / ABAC

See [`SECURITY.md`](./SECURITY.md) for the enforcement mechanics. This
document is the reference matrix, mirrored live at `/admin/security` and
`/admin/users` from `packages/security/src/index.ts`'s `RBAC_MATRIX`.

| Resource | Data class | Tourist | Provider | Partner | Gov analyst | Gov officer | Admin |
|---|---|---|---|---|---|---|---|
| Public content | PUBLIC | R | R | R | R | R | RW |
| Own trip & booking | PERSONAL | RW | — | — | — | — | R (audited) |
| Provider inventory | PARTNER | — | RW (own) | — | — | R | RW |
| Verification decision | PARTNER | — | — | — | — | RW | RW |
| Aggregated tourism intelligence | RESTRICTED_GOVERNMENT | — | own slice | own slice | R | R | R |
| Personal data | PERSONAL | own | own customers (minimised) | — | ✗ | ✗ | R (audited) |
| Health data | SENSITIVE | own | own patients | ✗ | ✗ | ✗ | ✗ (break-glass, audited) |
| Precise location | SENSITIVE | own + consent | ✗ | ✗ | ✗ | emergency only | ✗ |
| Restricted government data | RESTRICTED_GOVERNMENT | ✗ | ✗ | ✗ | scoped | scoped | ✗ |
| Integration state | PARTNER | ✗ | R (own) | R (own) | R | R | RW |
| Revenue rules | PARTNER | ✗ | own | own | ✗ | ✗ | RW |
| Audit log | SENSITIVE | ✗ | ✗ | ✗ | ✗ | ✗ | R |

## Reading the table

- **R/RW** are baseline capabilities; every capability is still filtered
  through `decide()`'s ABAC checks (consent, purpose, cohort size) even when
  the table says "R".
- **✗** means the role's `CEILING` cannot reach that data class at all —
  no context or consent can raise it.
- **scoped** means access exists but is narrowed to the specific
  jurisdiction/procedure the officer is assigned to, not the whole registry.
- **break-glass** access is always audited and intended for emergencies
  only; it is not a routine access path.

## The 22 roles

Grouped as `PROVIDER_ROLES`, `GOVERNMENT_ROLES`, `ADMIN_ROLES` plus
traveller-facing roles in `packages/types/src/roles.ts` — see that file for
the authoritative, current list (this document summarises rather than
duplicates it, so it cannot silently go stale).
