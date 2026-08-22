/**
 * The single vocabulary used to describe where any piece of data came from.
 * Rendered as a badge in the UI, returned by every API record, and attached to
 * every AI answer. Never omit it on a content, supply or integration record.
 */
export const SOURCE_STATUSES = [
  'LIVE',
  'VERIFIED_DATA',
  'PARTNER_DATA',
  'DEMO',
  'SIMULATED',
  'PLANNED_INTEGRATION',
] as const;
export type SourceStatus = (typeof SOURCE_STATUSES)[number];

export interface SourceMeta {
  sourceStatus: SourceStatus;
  /** The authority or company that owns the record. */
  sourceOwner?: string;
  sourceUrl?: string;
  verifiedAt?: string | null;
}

export const SOURCE_STATUS_LABEL: Record<SourceStatus, string> = {
  LIVE: 'Live integration',
  VERIFIED_DATA: 'Verified data',
  PARTNER_DATA: 'Partner data',
  DEMO: 'Demo data',
  SIMULATED: 'Simulated',
  PLANNED_INTEGRATION: 'Planned integration',
};

/** Statuses that must never be presented as an authoritative government answer. */
export const NON_AUTHORITATIVE: SourceStatus[] = ['DEMO', 'SIMULATED', 'PLANNED_INTEGRATION'];
export const isAuthoritative = (s: SourceStatus) => !NON_AUTHORITATIVE.includes(s);
