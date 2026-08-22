/**
 * Data classification taxonomy.
 *
 * PARTNER, PERSONAL and SENSITIVE map to the governance vocabulary's "Partner
 * Confidential", "Personal Data" and "Sensitive Personal Data" respectively —
 * kept as their original short names since every existing record, MCP tool
 * and RBAC entry already keys off them. FINANCIAL, HEALTH, PRECISE_LOCATION
 * and INCIDENT_EVIDENCE are additive: distinct enough from SENSITIVE to need
 * their own access/audit posture (see ALWAYS_AUDITED), without renaming or
 * removing anything already in use.
 */
export const DATA_CLASSES = [
  'PUBLIC',
  'INTERNAL',
  'PARTNER',
  'PERSONAL',
  'SENSITIVE',
  'FINANCIAL',
  'HEALTH',
  'PRECISE_LOCATION',
  'INCIDENT_EVIDENCE',
  'RESTRICTED_GOVERNMENT',
] as const;
export type DataClass = (typeof DATA_CLASSES)[number];

export const DATA_CLASS_RANK: Record<DataClass, number> = {
  PUBLIC: 0,
  INTERNAL: 1,
  PARTNER: 2,
  PERSONAL: 3,
  FINANCIAL: 4,
  HEALTH: 4,
  PRECISE_LOCATION: 4,
  SENSITIVE: 4,
  INCIDENT_EVIDENCE: 5,
  RESTRICTED_GOVERNMENT: 6,
};

/** Data classes that always write an audit row on access, allow or deny. */
export const ALWAYS_AUDITED: DataClass[] = [
  'SENSITIVE', 'FINANCIAL', 'HEALTH', 'PRECISE_LOCATION', 'INCIDENT_EVIDENCE', 'RESTRICTED_GOVERNMENT',
];
