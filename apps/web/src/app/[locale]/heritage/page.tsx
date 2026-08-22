import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Heritage registry",
  description: "A structured record of Egyptian heritage sites: period, cultural classification, governorate, access state, restoration status and the references behind each entry. Access classifi",
};

export default async function HeritagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.heritage.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Digital registry"
        title="Heritage registry"
        lead="A structured record of Egyptian heritage sites: period, cultural classification, governorate, access state, restoration status and the references behind each entry. Access classifications are recorded honestly, including where a permit is required or a site is closed."
        seed="heritage"
        subject="temple"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Records', value: String(rows.length) },
      { label: 'Open to visitors', value: String(rows.filter((r) => r.access === 'OPEN').length) },
      { label: 'Permit required', value: String(rows.filter((r) => r.access === 'PERMIT_REQUIRED').length) },
      { label: 'In restoration', value: String(rows.filter((r) => r.restorationStatus === 'IN_PROGRESS').length) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/heritage"
        facets={[
      { key: 'era', label: 'Era', options: [...new Set(rows.map((r) => r.era))] },
      { key: 'classification', label: 'Classification', options: [...new Set(rows.map((r) => r.classification))].sort() },
      { key: 'access', label: 'Access', options: [...new Set(rows.map((r) => r.access))] },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
    ]}
        rows={rows.map((h) => ({
      id: h.id, slug: h.slug, name: h.name, summary: h.summary,
      sourceStatus: h.sourceStatus, tags: [h.classification, h.era],
      meta: [h.governorateSlug.replace(/-/g, ' '), h.access.replace(/_/g, ' ').toLowerCase()],
      badge: { label: h.classification.split(' ')[0], tone: 'nile' as const },
      facets: { era: h.era, classification: h.classification, access: h.access, governorate: h.governorateSlug },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Opening hours, ticket prices and permits are set by the competent authority and are not published here until a verified source is connected.","A \"limited access\" or \"permit required\" classification is not an invitation to visit. Nothing on this page grants access to a restricted site.","Academic references in this prototype are placeholders pending verified citations."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/hidden-heritage","label":"Hidden heritage","body":"Sites outside ordinary itineraries."},{"href":"/restoration","label":"Restoration pipeline","body":"What is being conserved."},{"href":"/museums","label":"Museums","body":"Where the collections are."},{"href":"/egyptian-heritage-worldwide","label":"Heritage worldwide","body":"Egyptian objects held abroad."}]}
        />
      </div>
    </Page>
  );
}
