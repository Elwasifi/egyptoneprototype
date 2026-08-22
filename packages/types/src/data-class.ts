export const DATA_CLASSES = [
  'PUBLIC',
  'PARTNER',
  'PERSONAL',
  'SENSITIVE',
  'RESTRICTED_GOVERNMENT',
] as const;
export type DataClass = (typeof DATA_CLASSES)[number];

export const DATA_CLASS_RANK: Record<DataClass, number> = {
  PUBLIC: 0,
  PARTNER: 1,
  PERSONAL: 2,
  SENSITIVE: 3,
  RESTRICTED_GOVERNMENT: 4,
};

/** Data classes that always write an audit row on access, allow or deny. */
export const ALWAYS_AUDITED: DataClass[] = ['SENSITIVE', 'RESTRICTED_GOVERNMENT'];
