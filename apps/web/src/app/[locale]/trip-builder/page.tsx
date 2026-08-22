import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';
import { TripBuilder } from '@/components/TripBuilder';

export const metadata: Metadata = {
  title: "Smart trip builder",
  description: "A multi-step brief — nationality, dates, party, budget, style, languages, accessibility and interests — that the Trip Planner Agent turns into a routed, editable, day-by-day itiner",
};

export default async function TripBuilderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Plan"}
        title={"Smart trip builder"}
        lead={"A multi-step brief — nationality, dates, party, budget, style, languages, accessibility and interests — that the Trip Planner Agent turns into a routed, editable, day-by-day itinerary."}
        seed={"trip-builder"}
        subject={"temple"}
        stats={[
      { label: 'Steps', value: '5' },
      { label: 'Interest categories', value: '19' },
      { label: 'Governorates routable', value: '27' },
      { label: 'Bookings created', value: 'Draft only' },
    ]}
      />

      <div className="grid gap-8">
        <section><TripBuilder locale={locale as Locale} /></section>

        <Boundary points={["The itinerary is a plan, not a booking. Nothing is held, priced or confirmed.","Timings are editorial estimates. Opening hours come from the site authority.","Accessibility needs are used to weight the plan, but accessibility at many sites has not been surveyed and the plan says so rather than assuming.","Your brief is personal data. It is never shared with a government role and never used for marketing without consent."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/my-itinerary","label":"My itinerary","body":"The working copy."},{"href":"/guides","label":"Guides","body":"Add a guide."},{"href":"/hotels","label":"Hotels","body":"Add a stay."},{"href":"/ai","label":"AI Concierge","body":"Ask instead of filling a form."}]}
        />
      </div>
    </Page>
  );
}
