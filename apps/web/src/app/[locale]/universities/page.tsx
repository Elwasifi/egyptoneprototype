import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Universities",
  description: "Egyptian universities participating in the research portal, with the programmes they offer and the governorates they sit in.",
};

export default async function UniversitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.research.universities().map((u, i) => { const progs = db.research.all().filter((p) => p.university === u); return { id: 'uni-' + i, slug: progs[0]?.slug ?? String(i), name: u, progs }; });

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Academia"
        title="Universities"
        lead="Egyptian universities participating in the research portal, with the programmes they offer and the governorates they sit in."
        seed="universities"
        subject="city"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Universities', value: String(rows.length) },
      { label: 'Programmes', value: String(db.research.all().length) },
      { label: 'Governorates', value: String(new Set(db.research.all().map((p) => p.governorateSlug)).size) },
      { label: 'Directory adapter', value: 'Planned' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/research"
        facets={[{ key: 'governorate', label: 'Governorate', options: [...new Set(db.research.all().map((p) => p.governorateSlug))].sort() }]}
        rows={rows.map((u) => ({
      id: u.id, slug: u.slug, name: u.name,
      summary: u.progs.map((p) => p.field).slice(0, 3).join(' · '),
      sourceStatus: 'DEMO', tags: ['city'], hrefSuffix: '',
      meta: [`${u.progs.length} programmes`, (u.progs[0]?.governorateSlug ?? '').replace(/-/g, ' ')],
      facets: { governorate: u.progs[0]?.governorateSlug },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Institutional records are demonstration entries pending a connected admissions directory.","No admission, equivalence or accreditation decision is made or represented here."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/research","label":"Programmes","body":"What they teach."},{"href":"/ancient-egypt-academy","label":"Academy","body":"Public courses."},{"href":"/know-your-origin","label":"Know your origin","body":"Research boundaries."},{"href":"/heritage","label":"Heritage","body":"Field sites."}]}
        />
      </div>
    </Page>
  );
}
