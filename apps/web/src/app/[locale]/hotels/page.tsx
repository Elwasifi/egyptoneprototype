import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Hotels and stays",
  description: "Hotels, resorts, boutique properties, serviced apartments and residences across the 27 governorates. No booking adapter is connected in this prototype, so nothing here is a live ra",
};

export default async function HotelsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.byType('HOTEL');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Accommodation"
        title="Hotels and stays"
        lead="Hotels, resorts, boutique properties, serviced apartments and residences across the 27 governorates. No booking adapter is connected in this prototype, so nothing here is a live rate or confirmed availability."
        seed="hotels"
        subject="modern"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Properties listed', value: String(rows.length) },
      { label: 'Verified on platform', value: String(rows.filter((r) => r.verification === 'VERIFIED').length) },
      { label: 'Governorates covered', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Live rate adapters', value: '0' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/hotels"
        facets={[
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'amenity', label: 'Amenity', options: [...new Set(rows.flatMap((r) => r.amenities ?? []))].sort() },
      { key: 'verification', label: 'Verification', options: ['VERIFIED', 'IN_REVIEW'] },
    ]}
        rows={rows.map((h) => ({
      id: h.id, slug: h.slug, name: h.name, summary: (h.amenities ?? []).slice(0, 4).join(' · '),
      sourceStatus: h.sourceStatus, tags: ['stay'], hrefSuffix: '',
      meta: [h.governorateSlug.replace(/-/g, ' '), h.priceFrom ? `indicative from ${h.currency} ${h.priceFrom}` : ''].filter(Boolean),
      badge: { label: h.rating ? `★ ${h.rating}` : 'Unrated', tone: 'gold' as const },
      facets: { governorate: h.governorateSlug, amenity: h.amenities, verification: h.verification },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Prices are indicative demonstration values, not live rates.","Availability, cancellation terms and confirmation require a connected accommodation adapter. None is live.","A booking would settle through a licensed payment service provider — Egypt One never holds funds."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/accommodation","label":"All accommodation types","body":"Apartments, villas and residences."},{"href":"/trip-builder","label":"Trip builder","body":"Plan the stay into a route."},{"href":"/offers","label":"Offers","body":"Programmes and packages."},{"href":"/provider","label":"Provider portal","body":"List your property."}]}
        />
      </div>
    </Page>
  );
}
