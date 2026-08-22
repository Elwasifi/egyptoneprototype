export const HERITAGE_ACCESS = [
  'OPEN', 'LIMITED_ACCESS', 'PERMIT_REQUIRED', 'CLOSED',
  'UNDER_RESTORATION', 'PROPOSED_FOR_RESTORATION', 'DEMO_UNVERIFIED',
] as const;
export type HeritageAccess = (typeof HERITAGE_ACCESS)[number];

export const HERITAGE_ACCESS_LABEL: Record<HeritageAccess, string> = {
  OPEN: 'Open to visitors',
  LIMITED_ACCESS: 'Limited access',
  PERMIT_REQUIRED: 'Permit required',
  CLOSED: 'Closed',
  UNDER_RESTORATION: 'Under restoration',
  PROPOSED_FOR_RESTORATION: 'Proposed for restoration',
  DEMO_UNVERIFIED: 'Unverified (demo record)',
};

export const VERIFICATION_STATES = ['UNVERIFIED', 'SUBMITTED', 'IN_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED'] as const;
export type VerificationState = (typeof VERIFICATION_STATES)[number];

export const INTEGRATION_STATES = ['PLANNED', 'SANDBOX', 'LIVE', 'DISABLED'] as const;
export type IntegrationState = (typeof INTEGRATION_STATES)[number];

export const ERAS = [
  'PREDYNASTIC', 'ANCIENT', 'PTOLEMAIC', 'GRECO_ROMAN', 'COPTIC', 'ISLAMIC',
  'OTTOMAN', 'MUHAMMAD_ALI', 'KINGDOM', 'REPUBLIC', 'CONTEMPORARY',
] as const;
export type EraKey = (typeof ERAS)[number];
