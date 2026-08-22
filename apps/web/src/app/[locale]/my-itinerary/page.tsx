import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';
import { ItineraryPreview } from '@/components/ItineraryPreview';

export const metadata: Metadata = {
  title: "My itinerary",
  description: "The working copy of your trip: day by day, with the attractions, stays, transport, guides and meals in place, and an honest booking state next to each one.",
};

export default async function MyItineraryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Your trip"}
        title={"My itinerary"}
        lead={"The working copy of your trip: day by day, with the attractions, stays, transport, guides and meals in place, and an honest booking state next to each one."}
        seed={"my-itinerary"}
        subject={"nile"}
        stats={[
      { label: 'Trips in this demo', value: '1' },
      { label: 'Booking adapters live', value: '0' },
      { label: 'Confirmed bookings', value: '0' },
      { label: 'Editable', value: 'Every item' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Example itinerary</h2>
        <ItineraryPreview locale={locale as Locale} />
      </section>
        <InfoCard title={"Booking states you will see"}>
        <FactList rows={[["Draft","Planned on the platform. Nothing has been requested from a provider."],["Pending","Requested through a connected adapter and awaiting the provider."],["Confirmed","The provider has confirmed. Requires a live adapter — none in this prototype."],["Cancelled","Cancelled by you or the provider, under the provider’s terms."],["Refunded","Settled back through the licensed payment provider."]]} />
      </InfoCard>

        <Boundary points={["Every item in this prototype is a draft. Nothing is booked, held, priced or confirmed.","Opening hours and timing suggestions are editorial, not authoritative.","Your itinerary is personal data and is never shared with a government role."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/trip-builder","label":"Trip builder","body":"Change the brief."},{"href":"/account/trips","label":"My trips","body":"All your trips."},{"href":"/account/bookings","label":"Bookings","body":"Booking records."},{"href":"/guides","label":"Guides","body":"Add a guide."}]}
        />
      </div>
    </Page>
  );
}
