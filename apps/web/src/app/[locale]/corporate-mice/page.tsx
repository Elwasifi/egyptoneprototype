import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Corporate and MICE",
  description: "Meetings, incentives, conferences and exhibitions — venue capacity, business travel coordination, delegate logistics and the incentive programmes that make Egypt competitive for th",
};

export default async function CorporateMicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Business travel"}
        title={"Corporate and MICE"}
        lead={"Meetings, incentives, conferences and exhibitions — venue capacity, business travel coordination, delegate logistics and the incentive programmes that make Egypt competitive for them."}
        seed={"corporate-mice"}
        subject={"modern"}
        stats={[
      { label: 'MICE events recorded', value: String(db.events.all().filter((e) => /MICE|Conference|Business/i.test(e.category)).length) },
      { label: 'Business governorates', value: String(db.governorates.all().filter((g) => g.investmentSectors.some((s) => /MICE|Business|Corporate/i.test(s))).length) },
      { label: 'Venue opportunities', value: String(db.investment.all().filter((o) => /MICE|Events|Commercial/i.test(o.sector)).length) },
      { label: 'Live delegate booking', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"What a MICE programme needs"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Venue capacity","body":"Convention centres, hotel conference floors and exhibition space.","href":"/investment-opportunities","cta":"Venue opportunities"},{"title":"Room block","body":"Accommodation at scale, close to the venue.","href":"/hotels","cta":"Accommodation"},{"title":"Delegate transport","body":"Airport transfers, shuttles and executive travel.","href":"/vip-transport","cta":"VIP transport"},{"title":"Incentive programme","body":"The Egypt part of the trip — the reason to hold it here at all.","href":"/activities","cta":"Experiences"},{"title":"Multilingual support","body":"Guides and interpreters across the delegate languages.","href":"/guides","cta":"Guides"},{"title":"Entry coordination","body":"Delegate entry requirements handled early, not at the airport.","href":"/visa","cta":"Visa & entry"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <InfoCard title={"The pitch and the constraint"}>
        <p>Egypt has an unusually strong incentive proposition: a conference delegate can stand inside a three-thousand-year-old temple in the same trip as a plenary session. The constraint is rarely the attraction — it is venue capacity, room blocks at scale in the right place, and predictable delegate logistics.</p>
        <p className="mt-3">That is why this module sits across both the travel side and the investment side: the same page that helps an organiser plan a programme also shows where the capacity gaps are for anyone thinking of building the venue.</p>
      </InfoCard>

        <Boundary points={["Venue capacities and event data are demonstration records.","Delegate entry requirements are decided by the competent authority; group applications are not expedited by this platform.","No booking, room block or venue hold is possible in this prototype."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/events","label":"Events","body":"The calendar."},{"href":"/entertainment-investment","label":"Entertainment investment","body":"Venue development."},{"href":"/vip-transport","label":"VIP transport","body":"Delegate logistics."},{"href":"/business-setup","label":"Business setup","body":"If you are establishing here."}]}
        />
      </div>
    </Page>
  );
}
