import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Transport",
  description: "Ground transport, intercity transfers and airport connections. Egypt One coordinates between providers rather than operating vehicles itself.",
};

export default async function TransportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.byType('TRANSPORT');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Getting around"
        title="Transport"
        lead="Ground transport, intercity transfers and airport connections. Egypt One coordinates between providers rather than operating vehicles itself."
        seed="transport"
        subject="city"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Operators', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Mobility adapters live', value: '0' },
      { label: 'Verified', value: String(rows.filter((r) => r.verification === 'VERIFIED').length) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/transport"
        facets={[
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'verification', label: 'Verification', options: ['VERIFIED', 'IN_REVIEW'] },
    ]}
        rows={rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.summary, sourceStatus: r.sourceStatus, tags: ['transport'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' '), r.priceFrom ? `from ${r.currency} ${r.priceFrom}` : ''].filter(Boolean),
      badge: { label: r.verification === 'VERIFIED' ? 'Verified' : 'In review', tone: r.verification === 'VERIFIED' ? 'ok' as const : 'warn' as const },
      facets: { governorate: r.governorateSlug, verification: r.verification },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Fares are indicative. A live quote needs a connected mobility adapter, and none is live.","Vehicle licensing and driver credentials are matters for the competent authority."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/car-rental","label":"Car rental","body":"Self-drive options."},{"href":"/vip-transport","label":"VIP transport","body":"Private and chauffeured."},{"href":"/flights","label":"Flights","body":"Getting to Egypt."},{"href":"/trip-builder","label":"Trip builder","body":"Transfers inside a route."}]}
        />
      </div>
    </Page>
  );
}
