import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Offers and programmes",
  description: "Stopover Egypt, One More Night, the Visit All 27 Challenge, the Egypt One Pass and seasonal programmes. Each becomes real only when a provider contract and a connected booking adap",
};

export default async function OffersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.offers.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Programmes"
        title="Offers and programmes"
        lead="Stopover Egypt, One More Night, the Visit All 27 Challenge, the Egypt One Pass and seasonal programmes. Each becomes real only when a provider contract and a connected booking adapter exist behind it."
        seed="offers"
        subject="temple"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Programmes', value: String(rows.length) },
      { label: 'Live discounts', value: '0' },
      { label: 'Governorates in the challenge', value: '27' },
      { label: 'Provider contracts', value: '0' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/offers"
        facets={[{ key: 'kind', label: 'Programme type', options: [...new Set(rows.map((r) => r.kind))].sort() }]}
        rows={rows.map((o) => ({
      id: o.id, slug: o.slug, name: o.name, summary: o.summary,
      sourceStatus: 'DEMO', tags: [o.kind], hrefSuffix: '',
      badge: { label: o.kind, tone: 'gold' as const },
      facets: { kind: o.kind },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["No discount here is redeemable. Programmes activate only with a signed provider contract and a live adapter.","Loyalty points and pass benefits are illustrative and carry no monetary value in this prototype."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/account/pass","label":"Egypt One Pass","body":"Membership."},{"href":"/account/wallet","label":"Wallet & rewards","body":"Where benefits land."},{"href":"/hotels","label":"Hotels","body":"Where One More Night applies."},{"href":"/governorates","label":"Visit all 27","body":"The challenge map."}]}
        />
      </div>
    </Page>
  );
}
