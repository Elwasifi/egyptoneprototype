/**
 * Shared trust-strip content, rendered in both the site footer and the homepage
 * trust bar. Keys resolve through each caller's own translator — `${key}.title`
 * and `${key}.body` in packages/i18n/src/messages/*.json — so the same six
 * items translate correctly instead of drifting into hardcoded English.
 * Every line is worded to describe a platform capability or design intent —
 * never a claim of a live partnership, licence, or integration that doesn't
 * exist yet.
 */
export const TRUST_ITEMS: { icon: string; key: string }[] = [
  { icon: '◆', key: 'trust.securePayments' },
  { icon: '◆', key: 'trust.verifiedProvider' },
  { icon: '◆', key: 'trust.sourceLabels' },
  { icon: '◆', key: 'trust.privacy' },
  { icon: '◆', key: 'trust.accessibility' },
  { icon: '◆', key: 'trust.government' },
];
