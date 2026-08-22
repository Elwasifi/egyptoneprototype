import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Flights",
  description: "Egypt One does not sell flights. It holds an airline-distribution adapter contract so that, once an agreement exists, search and fares can appear inside a trip rather than in a sep",
};

export default async function FlightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Getting here"}
        title={"Flights"}
        lead={"Egypt One does not sell flights. It holds an airline-distribution adapter contract so that, once an agreement exists, search and fares can appear inside a trip rather than in a separate tab."}
        seed={"flights"}
        subject={"modern"}
        stats={[
      { label: 'Airline adapters', value: '1 contract' },
      { label: 'Live adapters', value: '0' },
      { label: 'Country gateways', value: String(db.countries.count()) },
      { label: 'Fares shown', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <InfoCard title={"Why this page is honest rather than useful yet"}>
        <p>A flight search that returns invented fares is worse than no flight search. Until an airline or distribution partner is connected, this module shows the adapter state and points you to the gateway page for your country, where the realistic routing options are described without pretending to be a schedule.</p>
      </InfoCard>
        <section>
        <SectionHeader title={"What you can do instead"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Your country gateway","body":"Realistic routing and connectivity from where you are.","href":"/egypt-195","cta":"Choose your country"},{"title":"Entry requirements","body":"What to verify before booking anything.","href":"/visa","cta":"Visa & entry"},{"title":"Build the ground itinerary","body":"Plan what happens after you land.","href":"/trip-builder","cta":"Trip builder"},{"title":"Airport transfers","body":"Ground transport on arrival.","href":"/transport","cta":"Transport"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
            c.href ? (
              <Link key={c.title} href={L(locale as Locale, c.href)} className="surface lift p-5">
                <h3 className="text-[14.5px] font-semibold text-ink-hi">{c.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-low">{c.body}</p>
                <span className="mt-3 inline-flex text-[12px] font-medium text-gold-300">{c.cta} &rarr;</span>
              </Link>
            ) : (
              <div key={c.title} className="surface p-5">
                <h3 className="text-[14.5px] font-semibold text-ink-hi">{c.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-low">{c.body}</p>
              </div>
            )
          ))}
        </div>
      </section>
        <InfoCard title={"Adapter state"}>
        <FactList rows={[["Contract","FlightProviderAdapter"],["State","PLANNED — no credentials, no agreement"],["Data class","PARTNER"],["Commission model","Affiliate, contractual — not applied to any government fee"],["Fares shown while planned","None. The module refuses rather than estimating."]]} />
      </InfoCard>

        <Boundary points={["No airline is a partner of Egypt One. Adapter classes exist; agreements do not.","Nothing here is a schedule, a fare or an availability.","Ticketing and refunds would run through the airline and a licensed payment provider, never through this platform directly."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/egypt-195","label":"Egypt 195","body":"Routes from your country."},{"href":"/visa","label":"Visa & entry","body":"Before you fly."},{"href":"/transport","label":"Transport","body":"After you land."},{"href":"/partner/integrations","label":"Integrations","body":"Adapter registry."}]}
        />
      </div>
    </Page>
  );
}
