import type { IntegrationRecord } from '@egypt-one/types';

/**
 * The 5% figure from the business model is a BASE NEGOTIATION ASSUMPTION only.
 * It lives here once, is configurable per environment, and is applied only to
 * service classes explicitly marked commissionable. Government fees never
 * receive a platform commission.
 */
export const DEFAULT_BASE_COMMISSION_PCT = Number(process.env.EGYPT_ONE_BASE_COMMISSION_PCT ?? 5);

export type CommissionModel =
  | { kind: 'PERCENTAGE'; pct: number }
  | { kind: 'FLAT'; amount: number; currency: string }
  | { kind: 'AFFILIATE'; pct: number; programme: string }
  | { kind: 'SUBSCRIPTION'; monthly: number; currency: string }
  | { kind: 'HYBRID'; pct: number; flat: number; currency: string }
  | { kind: 'NONE'; reason: string };

export interface RevenueRule {
  serviceClass: string;
  commissionable: boolean;
  model: CommissionModel;
  note: string;
}

export const REVENUE_RULES: RevenueRule[] = [
  { serviceClass: 'ACCOMMODATION', commissionable: true, model: { kind: 'PERCENTAGE', pct: DEFAULT_BASE_COMMISSION_PCT }, note: 'Contract-defined; base assumption only.' },
  { serviceClass: 'ACTIVITY', commissionable: true, model: { kind: 'PERCENTAGE', pct: DEFAULT_BASE_COMMISSION_PCT }, note: 'Contract-defined.' },
  { serviceClass: 'GUIDE', commissionable: true, model: { kind: 'PERCENTAGE', pct: 4 }, note: 'Lower rate to protect guide earnings.' },
  { serviceClass: 'TRANSPORT', commissionable: true, model: { kind: 'PERCENTAGE', pct: DEFAULT_BASE_COMMISSION_PCT }, note: 'Contract-defined.' },
  { serviceClass: 'FLIGHT', commissionable: true, model: { kind: 'AFFILIATE', pct: 1.5, programme: 'airline-affiliate' }, note: 'Affiliate programme terms govern.' },
  { serviceClass: 'MARKETPLACE', commissionable: true, model: { kind: 'PERCENTAGE', pct: 8 }, note: 'Marketplace commission.' },
  { serviceClass: 'PROVIDER_SUBSCRIPTION', commissionable: true, model: { kind: 'SUBSCRIPTION', monthly: 149, currency: 'USD' }, note: 'Tiered B2B.' },
  { serviceClass: 'MEDICAL_REFERRAL', commissionable: false, model: { kind: 'NONE', reason: 'Referral fees restricted; only where legally permitted under a reviewed contract.' }, note: 'Legal review required before enabling.' },
  { serviceClass: 'GOVERNMENT_FEE', commissionable: false, model: { kind: 'NONE', reason: 'Government fees never carry a platform commission.' }, note: 'Hard rule.' },
  { serviceClass: 'VISA_FEE', commissionable: false, model: { kind: 'NONE', reason: 'Statutory fee.' }, note: 'Hard rule.' },
  { serviceClass: 'INVESTMENT_LEAD', commissionable: true, model: { kind: 'FLAT', amount: 0, currency: 'USD' }, note: 'Per-contract lead fee; zero until a contract exists.' },
];

export function ruleFor(serviceClass: string): RevenueRule {
  return REVENUE_RULES.find((r) => r.serviceClass === serviceClass)
    ?? { serviceClass, commissionable: false, model: { kind: 'NONE', reason: 'No revenue rule configured.' }, note: 'Defaults to no commission.' };
}

export function computeCommission(serviceClass: string, grossAmount: number): { amount: number; rule: RevenueRule } {
  const rule = ruleFor(serviceClass);
  if (!rule.commissionable) return { amount: 0, rule };
  const m = rule.model;
  switch (m.kind) {
    case 'PERCENTAGE': case 'AFFILIATE': return { amount: +(grossAmount * m.pct / 100).toFixed(2), rule };
    case 'FLAT': return { amount: m.amount, rule };
    case 'HYBRID': return { amount: +((grossAmount * m.pct / 100) + m.flat).toFixed(2), rule };
    default: return { amount: 0, rule };
  }
}

export const REVENUE_STREAMS = [
  'Booking commission', 'Affiliate commission', 'Provider subscription', 'Premium B2B',
  'Enterprise integration', 'API access', 'Sponsored destinations', 'Verified provider services',
  'Investment lead generation', 'Corporate travel', 'MICE', 'Premium concierge',
  'Marketplace commission', 'Advertising', 'Strategic sponsorship', 'Events',
  'Medical tourism referral (where legally allowed)',
] as const;

export type { IntegrationRecord };
