import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "The Nile",
  description: "The river that made the country: cruising between Luxor and Aswan, feluccas at sunset, river transport, island villages and the towns whose entire shape follows the water.",
};

export default async function NilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Water"}
        title={"The Nile"}
        lead={"The river that made the country: cruising between Luxor and Aswan, feluccas at sunset, river transport, island villages and the towns whose entire shape follows the water."}
        seed={"nile"}
        subject={"nile"}
        stats={[
      { label: 'Nile governorates', value: String(db.governorates.all().filter((g) => g.hasNile).length) },
      { label: 'Riverside heritage', value: String(db.heritage.all().filter((h) => (db.governorates.bySlug(h.governorateSlug)?.hasNile) ?? false).length) },
      { label: 'Cruise routes', value: '3' },
      { label: 'Live booking adapters', value: '0' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"On the water"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Nile cruises","body":"Luxor–Aswan, Aswan–Abu Simbel by Lake Nasser, and longer Cairo routes.","href":"/cruises","cta":"See cruising"},{"title":"Feluccas","body":"Traditional sail on short river crossings and sunset runs.","href":"/activities","cta":"Find experiences"},{"title":"River transport","body":"Crossings, island access and short-hop river services.","href":"/transport","cta":"Transport module"},{"title":"Riverside stays","body":"Hotels and residences on the corniche.","href":"/hotels","cta":"Find a stay"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Governorates on the Nile</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {db.governorates.all().filter((g) => g.hasNile).map((g) => (
          <Link key={g.slug} href={L(locale as Locale, '/governorates/' + g.slug)} className="surface lift p-4">
            <div className="text-[13.5px] font-semibold text-ink-hi">{g.name}</div>
            <div className="mt-1 text-[11.5px] text-ink-faint">{g.region}</div>
            <div className="mt-2 text-[11.5px] text-ink-low">{g.highlights[0]}</div>
          </Link>
        ))}
      </div>
      </section>
        <InfoCard title={"Why the river still organises everything"}>
        <p>Almost the entire population of Egypt lives within a few kilometres of the Nile or its delta. That single fact explains the distribution of heritage sites, the location of every ancient capital, the pattern of modern agriculture and the reason a river cruise still functions as a practical way to move between the great southern temple sites.</p>
        <p className="mt-3">On this platform the river is a filter as much as a destination: governorates, heritage entries, providers and investment opportunities can all be viewed through whether they sit on the water.</p>
      </InfoCard>

        <Boundary points={["Cruise itineraries, vessel standards and departure dates come from operators. None is connected in this prototype.","Water safety, licensing and vessel inspection are matters for the competent authority."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/cruises","label":"Nile cruises","body":"The vessels and routes."},{"href":"/sea","label":"Red Sea & Mediterranean","body":"The coasts."},{"href":"/governorates/luxor","label":"Luxor","body":"The southern temple city."},{"href":"/governorates/aswan","label":"Aswan","body":"The first cataract."}]}
        />
      </div>
    </Page>
  );
}
