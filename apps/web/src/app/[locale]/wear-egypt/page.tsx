import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Wear Egypt",
  description: "Clothing, traditional dress, jewellery, crafts, art and food products, organised into a collection for each of the 27 governorates so that a purchase carries its place of origin.",
};

export default async function WearEgyptPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.products.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Marketplace"
        title="Wear Egypt"
        lead="Clothing, traditional dress, jewellery, crafts, art and food products, organised into a collection for each of the 27 governorates so that a purchase carries its place of origin."
        seed="wear-egypt"
        subject="market"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Catalogue entries', value: String(rows.length) },
      { label: 'Governorate collections', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Categories', value: String(new Set(rows.map((r) => r.category)).size) },
      { label: 'Fulfilment adapters live', value: '0' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/wear-egypt"
        facets={[
      { key: 'governorate', label: 'Governorate collection', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'category', label: 'Category', options: [...new Set(rows.map((r) => r.category))].sort() },
    ]}
        rows={rows.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, summary: p.summary,
      sourceStatus: p.sourceStatus, tags: ['market', p.category], hrefSuffix: '',
      meta: [p.governorateSlug.replace(/-/g, ' '), `EGP ${p.priceEgp.toLocaleString()}`],
      badge: { label: p.category, tone: 'gold' as const },
      facets: { governorate: p.governorateSlug, category: p.category },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Prices are demonstration values. Checkout requires a marketplace adapter and a licensed payment provider; neither is connected.","Artisan attribution in this dataset is illustrative. Real listings would carry a verified maker record."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/marketplace/wear-egypt","label":"Wear Egypt collection","body":"The editorial designer story behind this catalogue."},{"href":"/marketplace","label":"Made in Egypt","body":"The wider marketplace."},{"href":"/governorates","label":"Governorates","body":"Where each craft comes from."},{"href":"/provider","label":"Provider portal","body":"Sell your craft."}]}
        />
      </div>
    </Page>
  );
}
