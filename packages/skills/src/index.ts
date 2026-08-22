import { db, search as unifiedSearch } from '@egypt-one/database';
import { computeCommission, ruleFor } from '@egypt-one/config';
import { ADAPTERS } from '@egypt-one/integrations';
import type { SourceStatus } from '@egypt-one/types';

/**
 * Skills orchestrate MCP tools. They contain no vendor code and no HTTP calls
 * to third parties — anything external goes through packages/integrations.
 *
 * Every skill returns `{ data, citations }` so the composer can label the answer.
 */

export interface Citation { label: string; sourceStatus: SourceStatus; owner?: string }
export interface SkillResult<T> { data: T; citations: Citation[]; note?: string }

const cite = (label: string, sourceStatus: SourceStatus = 'DEMO', owner = 'Egypt One content team'): Citation =>
  ({ label, sourceStatus, owner });

export interface SkillSpec {
  key: string;
  name: string;
  description: string;
  agentKey: string;
  tools: string[];
}

export const SKILLS: SkillSpec[] = [
  { key: 'PlanEgyptTripSkill', name: 'Plan an Egypt trip', description: 'Turn a brief into a routed, day-by-day itinerary.', agentKey: 'TRIP_PLANNER', tools: ['governorates.list', 'destinations.search', 'heritage.search', 'trip.buildItinerary'] },
  { key: 'FindGovernorateSkill', name: 'Find a governorate', description: 'Match a traveller or investor intent to governorates.', agentKey: 'TRIP_PLANNER', tools: ['governorates.list', 'governorates.get'] },
  { key: 'ExplainHeritageSiteSkill', name: 'Explain a heritage site', description: 'Explain a site with its era, classification, access state and references.', agentKey: 'HERITAGE', tools: ['heritage.get', 'eras.list', 'rulers.list'] },
  { key: 'BuildItinerarySkill', name: 'Build an itinerary', description: 'Compose trip days from a set of chosen places.', agentKey: 'TRIP_PLANNER', tools: ['trip.buildItinerary'] },
  { key: 'FindGuideSkill', name: 'Find a guide', description: 'Rank guides by language, governorate, specialty and availability.', agentKey: 'GUIDE_MATCH', tools: ['provider.search', 'verification.check'] },
  { key: 'FindAccommodationSkill', name: 'Find accommodation', description: 'Search stays through connected adapters, or explain why none is connected.', agentKey: 'BOOKING', tools: ['booking.searchAccommodation', 'provider.search'] },
  { key: 'FindTransportSkill', name: 'Find transport', description: 'Ground transport, transfers and car rental options.', agentKey: 'BOOKING', tools: ['provider.search'] },
  { key: 'DiscoverInvestmentSkill', name: 'Discover investment', description: 'Shortlist opportunities from a budget and sector intent.', agentKey: 'INVESTMENT', tools: ['investment.search', 'analytics.governorateDemand'] },
  { key: 'CompareInvestmentLocationsSkill', name: 'Compare investment locations', description: 'Score governorates against a sector using labelled indicators.', agentKey: 'INVESTMENT', tools: ['governorates.list', 'analytics.governorateDemand', 'investment.search'] },
  { key: 'FindMedicalProviderSkill', name: 'Find a medical provider', description: 'Discover accredited providers under consent and purpose checks.', agentKey: 'MEDICAL', tools: ['health.searchProviders', 'verification.check'] },
  { key: 'FindResearchProgramSkill', name: 'Find a research programme', description: 'Find university programmes by field, degree and language.', agentKey: 'RESEARCH', tools: ['research.search', 'universities.list'] },
  { key: 'ExplainGovernmentProcedureSkill', name: 'Explain a government procedure', description: 'Sequence steps, authorities and documents for a procedure.', agentKey: 'BUSINESS_SETUP', tools: ['gov.getProcedure', 'gov.integrationStatus'] },
  { key: 'VerifyProviderSkill', name: 'Verify a provider', description: 'Report a provider’s verification state without asserting a licence.', agentKey: 'TRUST', tools: ['verification.check', 'content.provenance'] },
  { key: 'GenerateTourismInsightSkill', name: 'Generate a tourism insight', description: 'Aggregate demand, coverage and gaps for authorised users.', agentKey: 'TOURISM_INTEL', tools: ['analytics.aggregate', 'analytics.providerGaps'] },
];

/* ------------------------------------------------------------- itinerary */

export interface TripBrief {
  days: number;
  interests: string[];
  budgetUsd?: number;
  partyType?: string;
  adults?: number;
  children?: number;
  accessibility?: string[];
  languages?: string[];
  nationality?: string;
  startGovernorate?: string;
}

export interface TripDayPlan {
  day: number;
  governorate: string;
  governorateSlug: string;
  title: string;
  items: { kind: string; title: string; slug?: string; time?: string; durationMinutes?: number; note?: string; sourceStatus: SourceStatus }[];
}

/** Interest → the governorates that actually serve it, ordered by fit. */
const INTEREST_ROUTE: Record<string, string[]> = {
  History: ['cairo', 'giza', 'luxor', 'aswan', 'sohag', 'minya'],
  'Ancient Egypt': ['giza', 'luxor', 'aswan', 'sohag', 'minya'],
  'Religious Heritage': ['cairo', 'south-sinai', 'sohag', 'asyut', 'beheira'],
  Beach: ['red-sea', 'south-sinai', 'matrouh', 'alexandria'],
  Nile: ['luxor', 'aswan', 'cairo', 'qena'],
  Food: ['cairo', 'alexandria', 'luxor'],
  Luxury: ['giza', 'south-sinai', 'red-sea', 'cairo'],
  Adventure: ['south-sinai', 'new-valley', 'matrouh', 'red-sea'],
  Shopping: ['cairo', 'alexandria', 'giza'],
  Medical: ['cairo', 'giza', 'alexandria'],
  Wellness: ['south-sinai', 'new-valley', 'matrouh'],
  Business: ['cairo', 'giza', 'alexandria', 'suez'],
  MICE: ['south-sinai', 'cairo', 'red-sea'],
  Research: ['cairo', 'giza', 'luxor', 'alexandria'],
  'Rural Egypt': ['faiyum', 'kafr-el-sheikh', 'monufia', 'beheira'],
  Family: ['giza', 'red-sea', 'cairo', 'alexandria'],
  Photography: ['aswan', 'luxor', 'new-valley', 'matrouh'],
  Diving: ['red-sea', 'south-sinai'],
  Yachts: ['red-sea', 'south-sinai', 'alexandria'],
};

export function planEgyptTrip(brief: TripBrief): SkillResult<TripDayPlan[]> {
  const days = Math.max(1, Math.min(30, brief.days));
  const start = brief.startGovernorate ?? 'cairo';

  // Build a candidate route: start, then interest-weighted governorates, deduped.
  const scored = new Map<string, number>();
  for (const interest of brief.interests.length ? brief.interests : ['History', 'Nile']) {
    (INTEREST_ROUTE[interest] ?? []).forEach((slug, i) => {
      scored.set(slug, (scored.get(slug) ?? 0) + (10 - i));
    });
  }
  scored.set(start, (scored.get(start) ?? 0) + 12);

  const route = [...scored.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([slug]) => slug)
    .filter((slug) => db.governorates.bySlug(slug));

  if (!route.length) route.push('cairo', 'giza');

  // Allocate days: more days to higher-scoring stops, and always return to the gateway.
  const stops: string[] = [];
  let i = 0;
  while (stops.length < days) {
    const slug = route[i % route.length];
    const weight = i < 2 ? 2 : 1;
    for (let k = 0; k < weight && stops.length < days; k++) stops.push(slug);
    i++;
  }
  if (days >= 4 && stops[stops.length - 1] !== start) stops[stops.length - 1] = start;

  const wantsAccessible = (brief.accessibility ?? []).length > 0;

  const plan: TripDayPlan[] = stops.map((slug, idx) => {
    const g = db.governorates.bySlug(slug)!;
    const sites = db.heritage.byGovernorate(slug).filter((h) => h.access === 'OPEN');
    const dests = db.destinations.byGovernorate(slug);
    const hotels = db.providers.byGovernorate(slug).filter((p) => p.type === 'HOTEL');
    const guides = db.providers.byGovernorate(slug).filter((p) => p.type === 'GUIDE');
    const food = db.providers.byGovernorate(slug).filter((p) => p.type === 'RESTAURANT');
    const pick = <T>(arr: T[], n: number, offset: number): T[] =>
      arr.length ? Array.from({ length: Math.min(n, arr.length) }, (_, k) => arr[(offset + k) % arr.length]) : [];

    const items: TripDayPlan['items'] = [];
    const primaryPool: { name: string; slug: string; sourceStatus: SourceStatus }[] = sites.length ? sites : dests;
    const morning = pick(primaryPool, 1, idx)[0];
    if (morning) items.push({ kind: 'attraction', title: morning.name, slug: morning.slug, time: '09:00', durationMinutes: 150, sourceStatus: morning.sourceStatus });
    const afternoon = pick(dests, 1, idx + 3)[0];
    if (afternoon && afternoon.name !== morning?.name) {
      items.push({ kind: 'attraction', title: afternoon.name, slug: afternoon.slug, time: '13:30', durationMinutes: 120, sourceStatus: afternoon.sourceStatus });
    }
    const guide = pick(guides.filter((x) => !wantsAccessible || (x.accessibility ?? []).length > 0), 1, idx)[0] ?? guides[0];
    if (guide) items.push({ kind: 'guide', title: guide.name, slug: guide.slug, note: (guide.languages ?? []).join(', '), sourceStatus: guide.sourceStatus });
    const meal = pick(food, 1, idx)[0];
    if (meal) items.push({ kind: 'meal', title: meal.name, time: '19:30', sourceStatus: meal.sourceStatus });
    const hotel = pick(hotels, 1, idx)[0];
    if (hotel) items.push({ kind: 'stay', title: hotel.name, note: hotel.priceFrom ? `from ${hotel.currency} ${hotel.priceFrom}` : undefined, sourceStatus: hotel.sourceStatus });
    if (idx > 0 && stops[idx - 1] !== slug) {
      items.unshift({ kind: 'transport', title: `Transfer from ${db.governorates.bySlug(stops[idx - 1])!.name}`, time: '07:00', sourceStatus: 'DEMO' });
    }

    return { day: idx + 1, governorate: g.name, governorateSlug: g.slug, title: `${g.name} — ${g.highlights[idx % g.highlights.length]}`, items };
  });

  return {
    data: plan,
    citations: [cite('Governorate and heritage records', 'DEMO'), cite('Provider directory', 'DEMO', 'Registered providers')],
    note: 'Nothing in this itinerary is booked, priced or confirmed. Availability requires a connected provider adapter.',
  };
}

/* ------------------------------------------------------------ guide match */

export function findGuide(q: { governorate?: string; language?: string; specialty?: string; limit?: number }): SkillResult<ReturnType<typeof db.providers.byType>> {
  let rows = db.providers.byType('GUIDE');
  if (q.governorate) rows = rows.filter((g) => g.governorateSlug === q.governorate);
  if (q.language) rows = rows.filter((g) => (g.languages ?? []).some((l) => l.toLowerCase() === q.language!.toLowerCase()));
  if (q.specialty) rows = rows.filter((g) => (g.specialties ?? []).some((s) => s.toLowerCase().includes(q.specialty!.toLowerCase())));
  rows = rows.slice().sort((a, b) => {
    const v = Number(b.verification === 'VERIFIED') - Number(a.verification === 'VERIFIED');
    return v !== 0 ? v : (b.rating ?? 0) - (a.rating ?? 0);
  });
  return {
    data: rows.slice(0, q.limit ?? 8),
    citations: [cite('Provider directory', 'DEMO', 'Registered providers')],
    note: 'Verification here means the platform checked submitted documents. It is not a government licence, and no guide is described as licensed without a verification record.',
  };
}

/* -------------------------------------------------------------- heritage */

export function explainHeritageSite(slug: string): SkillResult<ReturnType<typeof db.heritage.bySlug>> {
  const site = db.heritage.bySlug(slug);
  return {
    data: site,
    citations: site ? [cite(site.name, site.sourceStatus, site.sourceOwner)] : [],
    note: site
      ? 'Opening hours, ticket prices and permits are set by the competent authority and are not published here until a verified source is connected.'
      : 'No record matched that identifier.',
  };
}

/* ------------------------------------------------------------ investment */

export interface InvestmentBrief { budgetUsd: number; sector?: string; governorate?: string }

export function discoverInvestment(brief: InvestmentBrief) {
  const all = db.investment.all();
  const inBudget = all.filter((o) => o.investmentRangeUsd[0] <= brief.budgetUsd * 1.35 && o.investmentRangeUsd[1] >= brief.budgetUsd * 0.5);
  const bySector = brief.sector
    ? inBudget.filter((o) => o.sector.toLowerCase().includes(brief.sector!.toLowerCase()))
    : inBudget;
  const pool = (bySector.length ? bySector : inBudget).slice();

  // Rank governorates on labelled indicators, never on invented data.
  const govScores = db.governorates.all().map((g) => {
    const opps = pool.filter((o) => o.governorateSlug === g.slug).length;
    const demand = g.metrics.annualVisitors / 1_000_000;
    const supplyPressure = g.metrics.occupancyPct / 100;
    const score = demand * 1.6 + supplyPressure * 2.4 + opps * 0.8;
    return { slug: g.slug, name: g.name, score: +score.toFixed(2), visitors: g.metrics.annualVisitors, occupancyPct: g.metrics.occupancyPct, hotels: g.metrics.hotels, opportunities: opps };
  }).sort((a, b) => b.score - a.score);

  return {
    data: {
      recommendedAreas: govScores.slice(0, 5),
      opportunities: pool.slice(0, 6),
      demandSignals: [
        `Highest demo occupancy indicator: ${govScores[0]?.name} at ${govScores[0]?.occupancyPct}%`,
        `Recorded demo visitor volume in the top area: ${govScores[0]?.visitors.toLocaleString()} per year`,
        `${pool.length} indicative opportunities fall within the stated ticket size`,
      ],
      risks: [
        'Every figure above is demonstration data, not an official statistic.',
        'Land allocation, licensing and approvals are decided by the competent entity, not by this platform.',
        'Seasonality varies sharply between Upper Egypt, the Red Sea and the Mediterranean coast.',
        'Infrastructure readiness differs by site and must be verified on the ground.',
      ],
      nextSteps: [
        'Shortlist two governorates and request the official feasibility pack from the competent entity.',
        'Commission an independent market study — this analysis is not one.',
        'Take Egyptian legal advice on ownership, land and licensing before committing capital.',
      ],
    },
    citations: [cite('Governorate demand indicators', 'SIMULATED', 'Egypt One demo generator'), cite('Opportunity registry', 'DEMO', 'Competent entities (planned)')],
    note: 'This is AI analysis over demonstration data. It is not investment advice, an official recommendation, or a guarantee of any return.',
  };
}

/* ------------------------------------------------------------ commercial */

export function quotePayment(serviceClass: string, grossAmount: number, currency = 'USD') {
  const { amount, rule } = computeCommission(serviceClass, grossAmount);
  const taxes = +(amount * 0.14).toFixed(2);
  const paymentFees = +(grossAmount * 0.019).toFixed(2);
  return {
    data: {
      grossAmount, currency, serviceClass,
      commissionable: rule.commissionable,
      commissionModel: rule.model,
      platformShare: amount,
      providerShare: +(grossAmount - amount).toFixed(2),
      taxes, paymentFees,
      netToProvider: +(grossAmount - amount - paymentFees).toFixed(2),
      ruleNote: rule.note,
    },
    citations: [cite('Revenue rule configuration', 'DEMO', 'Egypt One')],
    note: rule.commissionable
      ? 'Rates are contractual. The base figure is a negotiation assumption, not a fixed right.'
      : 'This service class carries no platform commission.',
  };
}

/* -------------------------------------------------------------- adapters */

export async function findAccommodation(q: { governorate: string; checkIn: string; checkOut: string; adults: number; children: number }) {
  const result = await ADAPTERS.accommodation.search(q);
  const fallback = db.providers.byGovernorate(q.governorate).filter((p) => p.type === 'HOTEL');
  return {
    data: { live: result, directory: fallback.slice(0, 8) },
    citations: [cite('Accommodation adapter', result.sourceStatus, ADAPTERS.accommodation.meta.sourceOwner), cite('Provider directory', 'DEMO')],
    note: result.ok ? undefined : result.reason,
  };
}

/* ------------------------------------------------------------ intelligence */

export function generateTourismInsight() {
  const m = db.metrics();
  return {
    data: {
      headline: m.headline,
      topCountries: m.topCountries,
      governorateShare: m.governorateShare,
      emerging: m.emergingDestinations,
      gaps: m.providerGaps,
    },
    citations: [cite('Tourism metrics', 'SIMULATED', 'Egypt One demo generator')],
    note: 'Prototype analytics are synthetic. No official statistic is represented, and no cohort small enough to identify an individual is returned.',
  };
}

export function searchEverything(q: string, limit = 20) {
  return { data: unifiedSearch(q, limit), citations: [cite('Unified index', 'DEMO')] };
}

export { ruleFor };
