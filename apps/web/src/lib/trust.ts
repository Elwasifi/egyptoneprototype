/**
 * Shared trust-strip content, rendered in both the site footer and the homepage
 * trust bar. Every line is worded to describe a platform capability or design
 * intent — never a claim of a live partnership, licence, or integration that
 * doesn't exist yet.
 */
export const TRUST_ITEMS: { icon: string; title: string; body: string }[] = [
  { icon: '◆', title: 'Secure payments', body: 'Handled by a licensed PSP — Egypt One never holds funds.' },
  {
    icon: '◆', title: 'Verification, not licensing',
    body: 'Provider verification capabilities are designed into the platform; licensing remains subject to the competent authority.',
  },
  { icon: '◆', title: 'Source labels everywhere', body: 'Each record shows whether it is live, verified, partner or demo data.' },
  { icon: '◆', title: 'Privacy by design', body: 'Consent centre, data classes and an audit trail on sensitive access.' },
  { icon: '◆', title: 'Accessibility', body: 'Built against WCAG 2.2 AA targets.' },
  {
    icon: '◆', title: 'Government integration-ready',
    body: 'Built for future integration with competent government systems through secure, auditable connections, subject to the required approvals and agreements.',
  },
];
