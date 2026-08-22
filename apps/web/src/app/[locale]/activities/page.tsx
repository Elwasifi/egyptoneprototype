import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Activities and tours",
  description: "Guided experiences, excursions, workshops and day tours across every governorate, from temple mornings to desert nights and reef dives.",
};

export default async function ActivitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.byType('ACTIVITY');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Experiences"
        title="Activities and tours"
        lead="Guided experiences, excursions, workshops and day tours across every governorate, from temple mornings to desert nights and reef dives."
        seed="activities"
        subject="temple"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Experiences', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Specialties', value: String(new Set(rows.flatMap((r) => r.specialties ?? [])).size) },
      { label: 'Live adapters', value: '0' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/activities"
        facets={[
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'specialty', label: 'Specialty', options: [...new Set(rows.flatMap((r) => r.specialties ?? []))].sort() },
    ]}
        rows={rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: (r.specialties ?? []).join(' · '),
      sourceStatus: r.sourceStatus, tags: ['activity'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' '), r.priceFrom ? `from ${r.currency} ${r.priceFrom}` : ''].filter(Boolean),
      facets: { governorate: r.governorateSlug, specialty: r.specialties },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Prices and departure times are indicative demonstration values.","Any activity at a heritage site is subject to that site\\u2019s access rules and the authority\\u2019s permissions."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/guides","label":"Guides","body":"Who will lead it."},{"href":"/heritage","label":"Heritage","body":"What you will see."},{"href":"/nile","label":"Nile experiences","body":"On the water."},{"href":"/sea","label":"Sea & diving","body":"Under the water."}]}
        />
      </div>
    </Page>
  );
}
