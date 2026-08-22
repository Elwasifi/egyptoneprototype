import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Restoration pipeline",
  description: "Sites tracked from proposal through active conservation to completion. Egypt One records and coordinates; the work, the funding decisions and the approvals belong to the competent ",
};

export default async function RestorationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.heritage.restoration();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Conservation"
        title="Restoration pipeline"
        lead="Sites tracked from proposal through active conservation to completion. Egypt One records and coordinates; the work, the funding decisions and the approvals belong to the competent authorities and their partners."
        seed="restoration"
        subject="temple"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Tracked sites', value: String(rows.length) },
      { label: 'In progress', value: String(rows.filter((r) => r.restorationStatus === 'IN_PROGRESS').length) },
      { label: 'Proposed', value: String(rows.filter((r) => r.restorationStatus === 'PROPOSED').length) },
      { label: 'Completed', value: String(rows.filter((r) => r.restorationStatus === 'COMPLETED').length) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/heritage"
        facets={[
      { key: 'status', label: 'Restoration status', options: ['PLANNED', 'IN_PROGRESS', 'PROPOSED', 'COMPLETED'] },
      { key: 'era', label: 'Era', options: [...new Set(rows.map((r) => r.era))] },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
    ]}
        rows={rows.map((h) => ({
      id: h.id, slug: h.slug, name: h.name, summary: h.summary,
      sourceStatus: h.sourceStatus, tags: [h.classification, h.era],
      meta: [h.governorateSlug.replace(/-/g, ' ')],
      badge: { label: (h.restorationStatus ?? 'NONE').replace(/_/g, ' ').toLowerCase(), tone: h.restorationStatus === 'COMPLETED' ? 'ok' as const : h.restorationStatus === 'IN_PROGRESS' ? 'nile' as const : 'gold' as const },
      facets: { status: h.restorationStatus, era: h.era, governorate: h.governorateSlug },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Restoration status here is a platform record, not an official project register.","\"Proposed for restoration\" reflects a candidate identified in the registry, not a funded or approved project.","Timelines, budgets and contractors are not published by this platform."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/heritage","label":"Heritage registry","body":"Every recorded site."},{"href":"/government/restoration","label":"Government view","body":"Pipeline dashboard."},{"href":"/research","label":"Research","body":"Conservation science programmes."},{"href":"/museums","label":"Museums","body":"Where objects are held."}]}
        />
      </div>
    </Page>
  );
}
