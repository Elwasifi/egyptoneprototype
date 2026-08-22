import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Egypt 195",
  description: "A gateway page for every country in the world: how to reach Egypt from there, which suggested routes suit that market, and where to verify entry requirements and mission informatio",
};

export default async function Egypt195Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.countries.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Global gateway"
        title="Egypt 195"
        lead="A gateway page for every country in the world: how to reach Egypt from there, which suggested routes suit that market, and where to verify entry requirements and mission information with the competent authority."
        seed="egypt-195"
        subject="modern"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Country gateways', value: String(rows.length + 1) },
      { label: 'Regions', value: String(new Set(rows.map((r) => r.region)).size) },
      { label: 'Mission directory', value: 'Planned integration' },
      { label: 'Visa decisions made here', value: 'None' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/egypt-195"
        facets={[
      { key: 'region', label: 'Region', options: [...new Set(rows.map((r) => r.region))].sort() },
      { key: 'mission', label: 'Egyptian mission', options: ['Listed in demo set', 'Not listed'] },
    ]}
        rows={rows.map((c) => ({
      id: c.id, slug: c.slug, name: c.name, summary: `Routes, connectivity and entry guidance for travellers from ${c.name}.`,
      sourceStatus: c.sourceStatus, tags: ['modern'],
      meta: [c.region, c.currency, c.language],
      badge: { label: c.region, tone: 'nile' as const },
      facets: { region: c.region, mission: c.hasEgyptianMission ? 'Listed in demo set' : 'Not listed' },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Embassy and mission information must come from the official Ministry of Foreign Affairs directory. That integration is not connected, so nothing here is authoritative.","Entry requirements vary by nationality, purpose and route, and change. Verify with the competent Egyptian authority before travelling.","Flight connectivity shown is illustrative, not a schedule."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/visa","label":"Visa & entry","body":"What to check before you fly."},{"href":"/trip-builder","label":"Trip builder","body":"Plan the route."},{"href":"/safety","label":"Safety centre","body":"Support while you are here."},{"href":"/governorates","label":"Governorates","body":"Where to go."}]}
        />
      </div>
    </Page>
  );
}
