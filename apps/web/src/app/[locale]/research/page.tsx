import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Research and education",
  description: "Programmes for international researchers, doctoral candidates and universities across Egyptology, archaeology, conservation science, ancient languages, archives and heritage manage",
};

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.research.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Academia"
        title="Research and education"
        lead="Programmes for international researchers, doctoral candidates and universities across Egyptology, archaeology, conservation science, ancient languages, archives and heritage management."
        seed="research"
        subject="museum"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Programmes', value: String(rows.length) },
      { label: 'Universities', value: String(db.research.universities().length) },
      { label: 'Fields', value: String(new Set(rows.map((r) => r.field)).size) },
      { label: 'Permits issued here', value: 'None' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/research"
        facets={[
      { key: 'field', label: 'Field', options: [...new Set(rows.map((r) => r.field))].sort() },
      { key: 'degree', label: 'Degree', options: [...new Set(rows.map((r) => r.degree))].sort() },
      { key: 'university', label: 'University', options: [...new Set(rows.map((r) => r.university))].sort() },
      { key: 'language', label: 'Language', options: [...new Set(rows.flatMap((r) => r.languages))].sort() },
    ]}
        rows={rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.summary,
      sourceStatus: r.sourceStatus, tags: ['museum', r.field], hrefSuffix: '',
      meta: [r.university, r.languages.join(', ')],
      badge: { label: r.degree, tone: 'nile' as const },
      facets: { field: r.field, degree: r.degree, university: r.university, language: r.languages },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Admission, fees and funding are decided by each university, not by this platform.","Excavation, survey and archive permits are issued by the competent authority. Egypt One can explain a pathway but cannot grant one.","Programme records are demonstration data until the university directory integration is connected."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/universities","label":"Universities","body":"Institutional directory."},{"href":"/ancient-egypt-academy","label":"Academy","body":"Public learning."},{"href":"/heritage","label":"Heritage registry","body":"Field context."},{"href":"/museums","label":"Museums","body":"Collections to study."}]}
        />
      </div>
    </Page>
  );
}
