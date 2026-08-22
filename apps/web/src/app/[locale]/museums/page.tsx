import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Museums and exhibitions",
  description: "Museums across the 27 governorates, from the national collections in Cairo and Giza to regional museums that hold the finds of their own landscape.",
};

export default async function MuseumsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.museums.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Collections"
        title="Museums and exhibitions"
        lead="Museums across the 27 governorates, from the national collections in Cairo and Giza to regional museums that hold the finds of their own landscape."
        seed="museums"
        subject="museum"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Museums', value: String(rows.length) },
      { label: 'Governorates covered', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Opened since 2000', value: String(rows.filter((r) => Number(r.opened) >= 2000).length) },
      { label: 'Heritage records linked', value: String(db.heritage.all().length) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/museums"
        facets={[
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'era', label: 'Opened', options: ['Before 1950', '1950–1999', '2000 onwards'] },
    ]}
        rows={rows.map((m) => ({
      id: m.id, slug: m.slug, name: m.name, summary: m.highlights.slice(0, 2).join(' · '),
      sourceStatus: m.sourceStatus, tags: ['museum'],
      meta: [m.governorateSlug.replace(/-/g, ' '), m.opened ? `opened ${m.opened}` : ''].filter(Boolean),
      facets: { governorate: m.governorateSlug, era: Number(m.opened) >= 2000 ? '2000 onwards' : Number(m.opened) >= 1950 ? '1950–1999' : 'Before 1950' },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Opening hours, ticket prices and current gallery availability are set by each museum and are not published here until a verified source is connected.","Collection highlights are editorial summaries, not catalogue records."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/heritage","label":"Heritage registry","body":"Sites the collections came from."},{"href":"/egyptian-heritage-worldwide","label":"Heritage worldwide","body":"Objects held abroad."},{"href":"/ancient-egypt-academy","label":"Academy","body":"Learn before you visit."},{"href":"/research","label":"Research","body":"Study these collections."}]}
        />
      </div>
    </Page>
  );
}
