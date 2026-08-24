import Link from 'next/link';
import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';
import { marketplacePages } from '@/lib/marketplace';
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

      <div className="mt-10">
        <div className="mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-500">Editorial collections</div>
          <h2 className="mt-1.5 text-[22px] font-semibold sm:text-[26px]">Four ways into Made in Egypt</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {marketplacePages.map((p) => (
            <Link key={p.slug} href={L(locale as Locale, `/marketplace/${p.slug}`)} className="surface group relative overflow-hidden p-0">
              <img src={p.hero} alt={p.heroAlt} loading="lazy" className="h-32 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-3.5">
                <span className="block truncate text-[13.5px] font-semibold text-ink-hi">{p.title}</span>
                <span className="block truncate text-[11px] text-ink-mid">{p.tagline}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

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
