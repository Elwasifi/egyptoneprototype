import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Events and festivals",
  description: "A nationwide events registry: cultural seasons, music, film, sport, business, conferences, MICE, heritage occasions and local governorate festivals. Organisers register and are ver",
};

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.events.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="What is on"
        title="Events and festivals"
        lead="A nationwide events registry: cultural seasons, music, film, sport, business, conferences, MICE, heritage occasions and local governorate festivals. Organisers register and are verified before an event is published."
        seed="events"
        subject="city"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Events listed', value: String(rows.length) },
      { label: 'Categories', value: String(new Set(rows.map((r) => r.category)).size) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Verified organisers', value: '0' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/events"
        facets={[
      { key: 'category', label: 'Category', options: [...new Set(rows.map((r) => r.category))].sort() },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'ticketed', label: 'Ticketing', options: ['Ticketed', 'Free or unticketed'] },
    ]}
        rows={rows.map((e) => ({
      id: e.id, slug: e.slug, name: e.name, summary: e.summary,
      sourceStatus: e.sourceStatus, tags: [e.category], hrefSuffix: '',
      meta: [`${e.startDate} → ${e.endDate}`, e.venue],
      badge: { label: e.category, tone: 'nile' as const },
      facets: { category: e.category, governorate: e.governorateSlug, ticketed: e.ticketed ? 'Ticketed' : 'Free or unticketed' },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Dates, venues and ticketing are demonstration data. Confirm every event with its organiser.","Organiser verification is a platform check on submitted documents, not an official endorsement.","Ticket sales require a connected ticketing adapter and a licensed payment provider. Neither is live."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/offers","label":"Offers","body":"Event travel packages."},{"href":"/corporate-mice","label":"Corporate & MICE","body":"Conferences and incentives."},{"href":"/governorates","label":"Governorates","body":"Local seasons."},{"href":"/trip-builder","label":"Trip builder","body":"Plan around an event."}]}
        />
      </div>
    </Page>
  );
}
