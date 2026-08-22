import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Discover Egypt",
  description: "One index into everything the platform holds: 27 governorates, eleven eras, the heritage registry, museums, the Nile and the sea, rural Egypt, the new cities and the country gatewa",
};

export default async function DiscoverPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Start here"}
        title={"Discover Egypt"}
        lead={"One index into everything the platform holds: 27 governorates, eleven eras, the heritage registry, museums, the Nile and the sea, rural Egypt, the new cities and the country gateways that connect the world to all of it."}
        seed={"discover"}
        subject={"pyramids"}
        stats={[
      { label: 'Destinations', value: String(db.destinations.all().length) },
      { label: 'Heritage records', value: String(db.heritage.all().length) },
      { label: 'Museums', value: String(db.museums.all().length) },
      { label: 'Events', value: String(db.events.all().length) },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"By place"} sub={"Geography is the spine — every other module indexes against it."} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"27 governorates","body":"Every region, from the Delta to the deep desert.","href":"/governorates","cta":"Browse regions"},{"title":"Interactive map","body":"All 27 on one canvas, filterable by layer.","href":"/map","cta":"Open map"},{"title":"Rural Egypt","body":"Villages, farms, crafts and the parts most itineraries miss.","href":"/rural-egypt","cta":"Discover"},{"title":"New cities","body":"The New Administrative Capital, New Alamein and the wider programme.","href":"/new-cities","cta":"Explore"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <section>
        <SectionHeader title={"By time"} sub={"Eleven eras of one continuous civilisation."} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Egypt through time","body":"The timeline, era by era, with the monuments and museums attached to each.","href":"/egypt-through-time","cta":"Open timeline"},{"title":"Rulers of Egypt","body":"From unification to the modern republic.","href":"/rulers-of-egypt","cta":"Ruler index"},{"title":"Heritage registry","body":"Sites with honest access classifications.","href":"/heritage","cta":"Open registry"},{"title":"Ancient Egypt Academy","body":"Guided learning, hieroglyphs and mythology.","href":"/ancient-egypt-academy","cta":"Start learning"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <section>
        <SectionHeader title={"By water"} sub={"The river and two seas shape most of Egypt’s tourism."} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"The Nile","body":"Cruises, feluccas and river towns.","href":"/nile","cta":"Explore the Nile"},{"title":"Red Sea & Mediterranean","body":"Reefs, beaches and coastal towns.","href":"/sea","cta":"Explore the coast"},{"title":"Nile cruises","body":"Luxor to Aswan and Lake Nasser.","href":"/cruises","cta":"See cruising"},{"title":"Yachts & marinas","body":"Charter, berths and sea excursions.","href":"/yachts","cta":"Open marinas"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">A place from every region</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[...new Map(db.governorates.all().map((g) => [g.region, g])).values()].map((g) => (
          <Link key={g.slug} href={L(locale as Locale, '/governorates/' + g.slug)} className="surface lift overflow-hidden p-0">
            <SmartImage seed={g.slug} subject={g.hasCoast ? 'sea' : g.hasNile ? 'nile' : 'desert'} alt={g.name} ratio="16/10" />
            <div className="p-3.5">
              <div className="text-[13.5px] font-semibold text-ink-hi">{g.name}</div>
              <div className="mt-1 text-[11px] text-ink-faint">{g.region}</div>
            </div>
          </Link>
        ))}
      </div>
      </section>

        <Boundary points={["Destination content is editorial. Access to any heritage site follows that site’s own classification.","Nothing in this index is bookable in the prototype."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/trip-builder","label":"Trip builder","body":"Turn this into a route."},{"href":"/egypt-195","label":"Egypt 195","body":"Arriving from your country."},{"href":"/events","label":"Events","body":"What is on."},{"href":"/search","label":"Search","body":"Find anything."}]}
        />
      </div>
    </Page>
  );
}
