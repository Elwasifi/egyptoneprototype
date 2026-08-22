import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Restaurants",
  description: "Restaurants across the governorates, indexed against the local cuisine of each region so that food is part of the itinerary rather than an afterthought.",
};

export default async function RestaurantsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.byType('RESTAURANT');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Food"
        title="Restaurants"
        lead="Restaurants across the governorates, indexed against the local cuisine of each region so that food is part of the itinerary rather than an afterthought."
        seed="restaurants"
        subject="market"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Restaurants', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Regional dishes indexed', value: String(new Set(db.governorates.all().flatMap((g) => g.cuisine)).size) },
      { label: 'Live menus', value: '0' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/restaurants"
        facets={[{ key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() }]}
        rows={rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: (r.specialties ?? []).join(' · '),
      sourceStatus: r.sourceStatus, tags: ['food'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' '), r.priceFrom ? `from ${r.currency} ${r.priceFrom}` : ''].filter(Boolean),
      facets: { governorate: r.governorateSlug },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Menus, prices and opening times are not published here without a connected provider.","Dietary and allergen information must be confirmed directly with the restaurant."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/cafes","label":"Cafés","body":"Coffee and street culture."},{"href":"/governorates","label":"Governorates","body":"Cuisine by region."},{"href":"/wear-egypt","label":"Made in Egypt","body":"Food products and crafts."},{"href":"/events","label":"Food festivals","body":"Seasonal events."}]}
        />
      </div>
    </Page>
  );
}
