import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Cafés",
  description: "Historic coffee houses, corniche cafés and neighbourhood spots — the everyday social architecture of Egyptian cities.",
};

export default async function CafesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.byType('CAFE');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Food"
        title="Cafés"
        lead="Historic coffee houses, corniche cafés and neighbourhood spots — the everyday social architecture of Egyptian cities."
        seed="cafes"
        subject="market"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Cafés', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Live menus', value: '0' },
      { label: 'Verified', value: String(rows.filter((r) => r.verification === 'VERIFIED').length) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/cafes"
        facets={[{ key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() }]}
        rows={rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.summary, sourceStatus: r.sourceStatus, tags: ['cafe'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' ')], facets: { governorate: r.governorateSlug },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Demonstration records. Opening times and menus are not asserted."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/restaurants","label":"Restaurants","body":"Full meals."},{"href":"/shopping","label":"Shopping","body":"Markets and malls."},{"href":"/governorates","label":"Governorates","body":"Local culture by region."},{"href":"/traveler-stories","label":"Traveller stories","body":"What visitors found."}]}
        />
      </div>
    </Page>
  );
}
