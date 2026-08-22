import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Hidden heritage",
  description: "Sites that sit outside ordinary tourist itineraries: excavation areas, restricted necropolises, village-scale architecture and places awaiting conservation. Several require a permi",
};

export default async function HiddenHeritagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.heritage.hidden();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Beyond the crowds"
        title="Hidden heritage"
        lead="Sites that sit outside ordinary tourist itineraries: excavation areas, restricted necropolises, village-scale architecture and places awaiting conservation. Several require a permit from the competent authority, and this page says so rather than implying they are open."
        seed="hidden-heritage"
        subject="desert"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Hidden records', value: String(rows.length) },
      { label: 'Permit required', value: String(rows.filter((r) => r.access === 'PERMIT_REQUIRED').length) },
      { label: 'Proposed for restoration', value: String(rows.filter((r) => r.restorationStatus === 'PROPOSED').length) },
      { label: 'Governorates covered', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/heritage"
        facets={[
      { key: 'era', label: 'Era', options: [...new Set(rows.map((r) => r.era))] },
      { key: 'access', label: 'Access', options: [...new Set(rows.map((r) => r.access))] },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
    ]}
        rows={rows.map((h) => ({
      id: h.id, slug: h.slug, name: h.name, summary: h.summary,
      sourceStatus: h.sourceStatus, tags: [h.classification, h.era],
      meta: [h.governorateSlug.replace(/-/g, ' '), h.access.replace(/_/g, ' ').toLowerCase()],
      badge: { label: h.access === 'PERMIT_REQUIRED' ? 'Permit' : h.access === 'LIMITED_ACCESS' ? 'Limited' : 'Restricted', tone: 'warn' as const },
      facets: { era: h.era, access: h.access, governorate: h.governorateSlug },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Publishing a site here is documentation, not an invitation. Access is decided by the competent authority.","Where a record says \"permit required\", visiting without that permit is not something this platform supports or facilitates.","Precise coordinates for vulnerable sites are deliberately coarse in this prototype."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/heritage","label":"Full registry","body":"Every recorded site."},{"href":"/restoration","label":"Restoration pipeline","body":"Conservation status."},{"href":"/research","label":"Research portal","body":"Academic access pathways."},{"href":"/governorates","label":"Governorates","body":"Browse by region."}]}
        />
      </div>
    </Page>
  );
}
