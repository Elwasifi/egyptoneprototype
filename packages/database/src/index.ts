import governorates from './demo/governorates.json';
import destinations from './demo/destinations.json';
import heritageSites from './demo/heritage-sites.json';
import museums from './demo/museums.json';
import eras from './demo/eras.json';
import rulers from './demo/rulers.json';
import countries from './demo/countries.json';
import providers from './demo/providers.json';
import events from './demo/events.json';
import opportunities from './demo/investment-opportunities.json';
import properties from './demo/properties.json';
import products from './demo/products.json';
import researchPrograms from './demo/research-programs.json';
import worldwide from './demo/heritage-worldwide.json';
import integrations from './demo/integrations.json';
import stories from './demo/traveller-stories.json';
import offers from './demo/offers.json';
import metrics from './demo/tourism-metrics.json';

import type {
  Governorate, Destination, HeritageSite, Museum, HistoricalEra, Ruler, Country,
  Provider, EventRecord, InvestmentOpportunity, Property, Product, ResearchProgram,
  WorldwideObject, IntegrationRecord,
} from '@egypt-one/types';

/**
 * Repository layer.
 *
 * In DEMO_MODE the content pack below is the source of truth and every record
 * carries sourceStatus: 'DEMO'. When DATABASE_URL is present the same function
 * signatures are backed by Prisma (see prisma/schema.prisma and ./prisma.ts).
 * Nothing above this layer knows which backing store is in use.
 */
export const DEMO_MODE = !process.env.DATABASE_URL;

const asc = <T extends { name: string }>(a: T, b: T) => a.name.localeCompare(b.name);

export const db = {
  governorates: {
    all: (): Governorate[] => governorates as unknown as Governorate[],
    bySlug: (slug: string) => (governorates as unknown as Governorate[]).find((g) => g.slug === slug),
    byRegion: (region: string) => (governorates as unknown as Governorate[]).filter((g) => g.region === region),
    count: () => governorates.length,
  },
  destinations: {
    all: (): Destination[] => destinations as unknown as Destination[],
    bySlug: (slug: string) => (destinations as unknown as Destination[]).find((d) => d.slug === slug),
    byGovernorate: (slug: string) => (destinations as unknown as Destination[]).filter((d) => d.governorateSlug === slug),
    byCategory: (c: string) => (destinations as unknown as Destination[]).filter((d) => d.category === c),
  },
  heritage: {
    all: (): HeritageSite[] => heritageSites as unknown as HeritageSite[],
    bySlug: (slug: string) => (heritageSites as unknown as HeritageSite[]).find((h) => h.slug === slug),
    byGovernorate: (slug: string) => (heritageSites as unknown as HeritageSite[]).filter((h) => h.governorateSlug === slug),
    hidden: () => (heritageSites as unknown as HeritageSite[]).filter((h) => h.hidden),
    restoration: () => (heritageSites as unknown as HeritageSite[]).filter((h) => h.restorationStatus && h.restorationStatus !== 'NONE'),
    byEra: (era: string) => (heritageSites as unknown as HeritageSite[]).filter((h) => h.era === era),
  },
  museums: {
    all: (): Museum[] => (museums as unknown as Museum[]).slice().sort(asc),
    bySlug: (slug: string) => (museums as unknown as Museum[]).find((m) => m.slug === slug),
    byGovernorate: (slug: string) => (museums as unknown as Museum[]).filter((m) => m.governorateSlug === slug),
  },
  eras: {
    all: (): HistoricalEra[] => eras as unknown as HistoricalEra[],
    byKey: (key: string) => (eras as unknown as HistoricalEra[]).find((e) => e.key === key),
  },
  rulers: {
    all: (): Ruler[] => rulers as unknown as Ruler[],
    bySlug: (slug: string) => (rulers as unknown as Ruler[]).find((r) => r.slug === slug),
    byEra: (era: string) => (rulers as unknown as Ruler[]).filter((r) => r.era === era),
  },
  countries: {
    all: (): Country[] => (countries as unknown as Country[]).slice().sort(asc),
    bySlug: (slug: string) => (countries as unknown as Country[]).find((c) => c.slug === slug),
    byRegion: (r: string) => (countries as unknown as Country[]).filter((c) => c.region === r),
    count: () => countries.length + 1,
  },
  providers: {
    all: (): Provider[] => providers as unknown as Provider[],
    bySlug: (slug: string) => (providers as unknown as Provider[]).find((p) => p.slug === slug),
    byType: (t: string) => (providers as unknown as Provider[]).filter((p) => p.type === t),
    byGovernorate: (slug: string) => (providers as unknown as Provider[]).filter((p) => p.governorateSlug === slug),
    verified: () => (providers as unknown as Provider[]).filter((p) => p.verification === 'VERIFIED'),
  },
  events: {
    all: (): EventRecord[] => (events as unknown as EventRecord[]).slice().sort((a, b) => a.startDate.localeCompare(b.startDate)),
    bySlug: (slug: string) => (events as unknown as EventRecord[]).find((e) => e.slug === slug),
    byGovernorate: (slug: string) => (events as unknown as EventRecord[]).filter((e) => e.governorateSlug === slug),
  },
  investment: {
    all: (): InvestmentOpportunity[] => opportunities as unknown as InvestmentOpportunity[],
    bySlug: (slug: string) => (opportunities as unknown as InvestmentOpportunity[]).find((o) => o.slug === slug),
    bySector: (s: string) => (opportunities as unknown as InvestmentOpportunity[]).filter((o) => o.sector === s),
    byGovernorate: (slug: string) => (opportunities as unknown as InvestmentOpportunity[]).filter((o) => o.governorateSlug === slug),
    sectors: () => Array.from(new Set((opportunities as unknown as InvestmentOpportunity[]).map((o) => o.sector))).sort(),
  },
  properties: {
    all: (): Property[] => properties as unknown as Property[],
    bySlug: (slug: string) => (properties as unknown as Property[]).find((p) => p.slug === slug),
    byType: (t: string) => (properties as unknown as Property[]).filter((p) => p.propertyType === t),
  },
  products: {
    all: (): Product[] => products as unknown as Product[],
    bySlug: (slug: string) => (products as unknown as Product[]).find((p) => p.slug === slug),
    byGovernorate: (slug: string) => (products as unknown as Product[]).filter((p) => p.governorateSlug === slug),
  },
  research: {
    all: (): ResearchProgram[] => researchPrograms as unknown as ResearchProgram[],
    bySlug: (slug: string) => (researchPrograms as unknown as ResearchProgram[]).find((p) => p.slug === slug),
    universities: () => Array.from(new Set((researchPrograms as unknown as ResearchProgram[]).map((p) => p.university))).sort(),
  },
  worldwide: {
    all: (): WorldwideObject[] => worldwide as unknown as WorldwideObject[],
    bySlug: (slug: string) => (worldwide as unknown as WorldwideObject[]).find((o) => o.slug === slug),
  },
  integrations: {
    all: (): IntegrationRecord[] => integrations as unknown as IntegrationRecord[],
    byState: (s: string) => (integrations as unknown as IntegrationRecord[]).filter((i) => i.state === s),
  },
  stories: { all: () => stories as unknown as any[] },
  offers: { all: () => offers as unknown as any[] },
  metrics: () => metrics as unknown as typeof metrics,
};

/** Cross-entity search used by the global search bar and the Search MCP tool. */
export type SearchHit = { id: string; slug: string; name: string; kind: string; href: string; summary?: string; sourceStatus: string };

export function search(q: string, limit = 40): SearchHit[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const buckets: [any[], string, (s: string) => string][] = [
    [db.governorates.all(), 'Governorate', (s) => `/governorates/${s}`],
    [db.destinations.all(), 'Destination', (s) => `/destinations/${s}`],
    [db.heritage.all(), 'Heritage site', (s) => `/heritage/${s}`],
    [db.museums.all(), 'Museum', (s) => `/museums/${s}`],
    [db.rulers.all(), 'Ruler', (s) => `/rulers-of-egypt/${s}`],
    [db.countries.all(), 'Country gateway', (s) => `/egypt-195/${s}`],
    [db.providers.byType('GUIDE'), 'Guide', (s) => `/guides/${s}`],
    [db.providers.byType('HOTEL'), 'Hotel', () => `/hotels`],
    [db.events.all(), 'Event', () => `/events`],
    [db.investment.all(), 'Investment opportunity', (s) => `/investment-opportunities/${s}`],
    [db.products.all(), 'Product', () => `/wear-egypt`],
    [db.research.all(), 'Research programme', () => `/research`],
    [db.worldwide.all(), 'Heritage worldwide', () => `/egyptian-heritage-worldwide`],
  ];
  const hits: SearchHit[] = [];
  for (const [rows, kind, href] of buckets) {
    for (const r of rows) {
      const hay = `${r.name} ${r.summary ?? ''} ${(r.tags ?? []).join(' ')}`.toLowerCase();
      if (hay.includes(needle)) {
        hits.push({ id: r.id, slug: r.slug, name: r.name, kind, href: href(r.slug), summary: r.summary, sourceStatus: r.sourceStatus ?? 'DEMO' });
        if (hits.length >= limit * 2) break;
      }
    }
  }
  return hits
    .sort((a, b) => Number(b.name.toLowerCase().startsWith(needle)) - Number(a.name.toLowerCase().startsWith(needle)))
    .slice(0, limit);
}

export const POPULAR_SEARCHES = ['Pyramids', 'Nile cruise', 'Red Sea', 'Luxor', 'Aswan', 'Siwa Oasis', 'Cairo', 'Alexandria'];
