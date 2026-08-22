import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "The 27 governorates",
  description: "Egypt is administered as 27 governorates. Every module on this platform — heritage, providers, events, investment, property and crafts — is indexed against them, so a region is bot",
};

export default async function GovernoratesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.governorates.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Discover Egypt"
        title="The 27 governorates"
        lead="Egypt is administered as 27 governorates. Every module on this platform — heritage, providers, events, investment, property and crafts — is indexed against them, so a region is both a place to visit and a place to build."
        seed="governorates"
        subject="desert"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Governorates', value: '27' },
      { label: 'Heritage records', value: String(db.heritage.all().length) },
      { label: 'Providers', value: String(db.providers.all().length) },
      { label: 'Opportunities', value: String(db.investment.all().length) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/governorates"
        facets={[
      { key: 'region', label: 'Region', options: [...new Set(rows.map((r) => r.region))].sort() },
      { key: 'water', label: 'Water', options: ['Nile', 'Coast', 'Neither'] },
    ]}
        rows={rows.map((g) => ({
      id: g.id, slug: g.slug, name: g.name, summary: `Capital ${g.capital}. ${g.highlights.slice(0, 2).join(', ')}.`,
      sourceStatus: g.sourceStatus, tags: [g.region, ...(g.hasCoast ? ['coast'] : []), ...(g.hasNile ? ['nile'] : [])],
      meta: [`${g.areaKm2.toLocaleString()} km²`, `${g.metrics.heritageSites} heritage sites`],
      badge: { label: g.region, tone: 'gold' as const },
      facets: { region: g.region, water: g.hasNile ? 'Nile' : g.hasCoast ? 'Coast' : 'Neither' },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Area, population and visitor indicators are demonstration values pending a connected statistics feed.","Governorate boundaries and administrative structure follow the official 27-governorate model."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/map","label":"Interactive map","body":"See all 27 on one canvas."},{"href":"/egypt-through-time","label":"Egypt through time","body":"The eras behind these places."},{"href":"/heritage","label":"Heritage registry","body":"Every recorded site."},{"href":"/invest","label":"Invest in Egypt","body":"Opportunities by region."}]}
        />
      </div>
    </Page>
  );
}
