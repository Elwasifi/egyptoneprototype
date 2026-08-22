import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "VIP transport",
  description: "Private transfers, chauffeured travel, meet-and-assist and executive itineraries, drawn from the same verified operator pool as standard transport.",
};

export default async function VipTransportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.byType('TRANSPORT').filter((p) => p.verification === 'VERIFIED');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Premium services"
        title="VIP transport"
        lead="Private transfers, chauffeured travel, meet-and-assist and executive itineraries, drawn from the same verified operator pool as standard transport."
        seed="vip-transport"
        subject="modern"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Verified operators', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Concierge tier', value: 'Pass required' },
      { label: 'Live adapters', value: '0' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/vip-transport"
        facets={[{ key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() }]}
        rows={rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: 'Private and executive transfer services.', sourceStatus: r.sourceStatus, tags: ['vip', 'modern'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' ')], facets: { governorate: r.governorateSlug },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Only operators with a platform verification record appear here.","Premium concierge services are a paid tier, and that is stated before any charge."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/account/pass","label":"Egypt One Pass","body":"Membership benefits."},{"href":"/transport","label":"Transport","body":"Standard options."},{"href":"/corporate-mice","label":"Corporate & MICE","body":"Business travel."},{"href":"/trip-builder","label":"Trip builder","body":"Build the route."}]}
        />
      </div>
    </Page>
  );
}
