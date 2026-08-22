import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Entertainment investment",
  description: "Theme parks, water parks, family entertainment centres, sports complexes, marinas, arenas, live entertainment, cultural venues, festivals, immersive experiences and leisure distric",
};

export default async function EntertainmentInvestmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Invest"}
        title={"Entertainment investment"}
        lead={"Theme parks, water parks, family entertainment centres, sports complexes, marinas, arenas, live entertainment, cultural venues, festivals, immersive experiences and leisure districts — treated as a major category rather than a footnote under tourism."}
        seed={"entertainment-investment"}
        subject={"modern"}
        stats={[
      { label: 'Entertainment opportunities', value: String(db.investment.all().filter((o) => /entertainment|theme|water|marina|sport|event/i.test(o.sector)).length) },
      { label: 'Governorates', value: '27' },
      { label: 'Event records', value: String(db.events.all().length) },
      { label: 'Guaranteed footfall', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"Categories"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Theme and water parks","body":"Large-format attractions serving both domestic and international demand."},{"title":"Family entertainment centres","body":"Urban, mall-adjacent and year-round formats."},{"title":"Sports complexes","body":"Training, competition and community facilities."},{"title":"Marinas","body":"Berthing, service yards and waterfront leisure."},{"title":"Arenas and live entertainment","body":"Concert, conference and mixed-use venues."},{"title":"Cultural venues and festivals","body":"Programming infrastructure as well as buildings."},{"title":"Immersive experiences","body":"Projection, XR and interpretive attractions at heritage-adjacent sites."},{"title":"Leisure districts","body":"Mixed-use waterfront and urban regeneration schemes."}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <InfoCard title={"Why this is its own category"}>
        <p>Entertainment infrastructure has a different demand curve from heritage tourism. It draws heavily on the domestic market, it is far less seasonal, it monetises differently and it operates year-round. A country with very strong heritage tourism can still be thin on entertainment capacity, and the two require quite different investment cases.</p>
        <p className="mt-3">Treating it as a first-class category means the opportunity registry, the demand indicators and the governorate comparisons all work for an operator whose question is footfall and dwell time rather than temple proximity.</p>
      </InfoCard>
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Entertainment opportunities in the registry</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {db.investment.all().filter((o) => /entertainment|theme|water|marina|sport|event/i.test(o.sector)).slice(0, 9).map((o) => (
          <Link key={o.slug} href={L(locale as Locale, '/investment-opportunities/' + o.slug)} className="surface lift p-4">
            <Badge tone="nile">{o.stage}</Badge>
            <div className="mt-2.5 text-[13.5px] font-semibold text-ink-hi">{o.name}</div>
            <div className="mt-1.5 text-[11.5px] text-ink-faint">USD {(o.investmentRangeUsd[0] / 1e6).toFixed(0)}–{(o.investmentRangeUsd[1] / 1e6).toFixed(0)}M</div>
            <div className="mt-3"><SourceBadge status={o.sourceStatus} size="sm" /></div>
          </Link>
        ))}
      </div>
      </section>

        <Boundary points={["Footfall, spend and dwell-time indicators here are synthetic demonstration values.","Venue licensing, safety certification and public-event permissions are matters for the competent authority.","Nothing here is an offer, an allocation or a guaranteed return."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/invest","label":"Investor portal","body":"The whole module."},{"href":"/events","label":"Events","body":"Existing programming."},{"href":"/new-cities","label":"New cities","body":"Where new capacity is going."},{"href":"/corporate-mice","label":"Corporate & MICE","body":"Business venues."}]}
        />
      </div>
    </Page>
  );
}
