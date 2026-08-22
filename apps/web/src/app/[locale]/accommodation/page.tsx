import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Accommodation",
  description: "Beyond hotels: resorts, boutique properties, serviced and hotel apartments, residential rentals, luxury villas and business residences. Providers manage their own units, availabili",
};

export default async function AccommodationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.all().filter((p) => p.type === 'HOTEL');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Where to stay"
        title="Accommodation"
        lead="Beyond hotels: resorts, boutique properties, serviced and hotel apartments, residential rentals, luxury villas and business residences. Providers manage their own units, availability, pricing, offers, amenities and policies through the provider portal."
        seed="accommodation"
        subject="modern"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Properties', value: String(rows.length) },
      { label: 'Unit types supported', value: '7' },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Connected adapters', value: '0' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/hotels"
        facets={[
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'accessibility', label: 'Accessibility', options: ['Step-free entrance'] },
    ]}
        rows={rows.map((h) => ({
      id: h.id, slug: h.slug, name: h.name, summary: (h.amenities ?? []).slice(0, 4).join(' · '),
      sourceStatus: h.sourceStatus, tags: ['stay'], hrefSuffix: '',
      meta: [h.governorateSlug.replace(/-/g, ' ')],
      facets: { governorate: h.governorateSlug, accessibility: h.accessibility },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Unit inventory, pricing and policies are supplied by each provider and are demonstration data here.","Residential rental listings do not constitute an offer, and tenancy law is outside this platform\\u2019s scope."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/hotels","label":"Hotels","body":"The hotel view."},{"href":"/real-estate","label":"Real estate","body":"Buying rather than staying."},{"href":"/provider/services","label":"Provider inventory","body":"How supply is managed."},{"href":"/offers","label":"Offers","body":"One More Night and more."}]}
        />
      </div>
    </Page>
  );
}
