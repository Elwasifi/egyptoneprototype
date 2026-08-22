import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Car rental",
  description: "Self-drive rental across the governorates, aggregated through a vendor-neutral adapter contract so no single supplier is hard-wired into the platform.",
};

export default async function CarRentalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.byType('CAR_RENTAL');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Getting around"
        title="Car rental"
        lead="Self-drive rental across the governorates, aggregated through a vendor-neutral adapter contract so no single supplier is hard-wired into the platform."
        seed="car-rental"
        subject="desert"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Suppliers', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Aggregator adapters live', value: '0' },
      { label: 'Verified', value: String(rows.filter((r) => r.verification === 'VERIFIED').length) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/car-rental"
        facets={[{ key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() }]}
        rows={rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.summary, sourceStatus: r.sourceStatus, tags: ['car'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' '), r.priceFrom ? `from ${r.currency} ${r.priceFrom}/day` : ''].filter(Boolean),
      facets: { governorate: r.governorateSlug },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Driving licence requirements for visitors are set by the competent authority, not by this platform.","Insurance terms come from the supplier and the insurer."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/transport","label":"Transport","body":"Driven options."},{"href":"/vip-transport","label":"VIP transport","body":"Chauffeured travel."},{"href":"/safety","label":"Safety centre","body":"Road safety guidance."},{"href":"/visa","label":"Visa & entry","body":"Before you arrive."}]}
        />
      </div>
    </Page>
  );
}
