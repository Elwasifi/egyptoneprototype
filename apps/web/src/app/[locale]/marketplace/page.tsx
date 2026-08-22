import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Made in Egypt marketplace",
  description: "The wider commerce layer: craft collectives, retailers, producers and the affiliate adapter contracts that would connect external platforms — none of which is live or represents a ",
};

export default async function MarketplacePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.byType('RETAILER');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Marketplace"
        title="Made in Egypt marketplace"
        lead="The wider commerce layer: craft collectives, retailers, producers and the affiliate adapter contracts that would connect external platforms — none of which is live or represents a commercial partnership."
        seed="marketplace"
        subject="market"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Retail partners listed', value: String(rows.length) },
      { label: 'Product entries', value: String(db.products.all().length) },
      { label: 'Adapter contracts', value: String(db.integrations.all().length) },
      { label: 'Live adapters', value: String(db.integrations.byState('LIVE').length) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/marketplace"
        facets={[{ key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() }]}
        rows={rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.summary, sourceStatus: r.sourceStatus, tags: ['market'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' ')], facets: { governorate: r.governorateSlug },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Affiliate and marketplace adapters exist as contracts only. Egypt One does not represent a commercial partnership with any company unless an agreement exists.","Marketplace commission is contractual per seller and is never applied to a government fee."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/wear-egypt","label":"Wear Egypt","body":"The clothing and craft collections."},{"href":"/partner/integrations","label":"Integrations","body":"Adapter state."},{"href":"/admin/revenue","label":"Revenue rules","body":"How commission is configured."},{"href":"/provider","label":"Provider portal","body":"Join as a seller."}]}
        />
      </div>
    </Page>
  );
}
