import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Rulers of Egypt",
  description: "An index of rulers across eleven eras, from the unification of Upper and Lower Egypt to the modern republic, each linked to the monuments and collections associated with their reig",
};

export default async function RulersOfEgyptPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.rulers.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Through time"
        title="Rulers of Egypt"
        lead="An index of rulers across eleven eras, from the unification of Upper and Lower Egypt to the modern republic, each linked to the monuments and collections associated with their reign."
        seed="rulers-of-egypt"
        subject="temple"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Ruler profiles', value: String(rows.length) },
      { label: 'Eras covered', value: String(new Set(rows.map((r) => r.era)).size) },
      { label: 'Monuments linked', value: String(new Set(rows.flatMap((r) => r.monuments)).size) },
      { label: 'Heritage records', value: String(db.heritage.all().length) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/rulers-of-egypt"
        facets={[
      { key: 'era', label: 'Era', options: [...new Set(rows.map((r) => r.era))] },
      { key: 'dynasty', label: 'Dynasty', options: [...new Set(rows.map((r) => r.dynasty ?? ''))].filter(Boolean).sort() },
    ]}
        rows={rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.achievements[0],
      sourceStatus: r.sourceStatus, tags: ['temple', r.era],
      meta: [r.reign, r.dynasty ?? ''].filter(Boolean),
      badge: { label: r.era.replace(/_/g, ' ').toLowerCase(), tone: 'gold' as const },
      facets: { era: r.era, dynasty: r.dynasty },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Regnal dates for early periods are debated among Egyptologists. Dates here follow a conventional chronology and are approximate.","Attribution of monuments to a ruler reflects mainstream scholarship, not a settled fact in every case."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/egypt-through-time","label":"Egypt through time","body":"The full timeline."},{"href":"/heritage","label":"Heritage registry","body":"What they built."},{"href":"/museums","label":"Museums","body":"Where the objects are."},{"href":"/ancient-egypt-academy","label":"Academy","body":"Learn the periods."}]}
        />
      </div>
    </Page>
  );
}
