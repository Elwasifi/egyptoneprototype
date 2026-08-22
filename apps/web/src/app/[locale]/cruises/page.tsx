import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Nile cruises",
  description: "The classic way to move between the southern temple sites: a floating base that repositions overnight so the mornings are spent at Karnak, Edfu, Kom Ombo and Philae rather than in ",
};

export default async function CruisesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Water"}
        title={"Nile cruises"}
        lead={"The classic way to move between the southern temple sites: a floating base that repositions overnight so the mornings are spent at Karnak, Edfu, Kom Ombo and Philae rather than in transit."}
        seed={"cruises"}
        subject={"nile"}
        stats={[
      { label: 'Principal routes', value: '3' },
      { label: 'Temple stops on the classic route', value: '6' },
      { label: 'Operators listed', value: String(db.providers.byType('TOUR_OPERATOR').length) },
      { label: 'Live availability', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">The routes</h2>
        <StepList steps={[{"title":"Luxor → Aswan (3–4 nights)","body":"The classic southbound run: Karnak and the West Bank, Esna, Edfu, Kom Ombo, then Aswan and Philae."},{"title":"Aswan → Luxor (4–5 nights)","body":"The same corridor northbound, usually with more time at Aswan before departure."},{"title":"Lake Nasser (3–4 nights)","body":"Aswan to Abu Simbel across the reservoir, taking in the relocated Nubian temples.","note":"A different vessel class and a different booking pattern from the main river."}]} />
      </section>
        <section>
        <SectionHeader title={"What a cruise connects"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Karnak and Luxor Temple","body":"The largest religious complex of the ancient world.","href":"/heritage/karnak-temple-complex","cta":"Registry entry"},{"title":"Valley of the Kings","body":"The New Kingdom royal necropolis on the West Bank.","href":"/heritage/valley-of-the-kings","cta":"Registry entry"},{"title":"Temple of Horus at Edfu","body":"The most completely preserved Ptolemaic temple.","href":"/heritage/temple-of-horus-at-edfu","cta":"Registry entry"},{"title":"Philae Temple of Isis","body":"Relocated stone by stone during the Nubian rescue campaign.","href":"/heritage/philae-temple-of-isis","cta":"Registry entry"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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

        <Boundary points={["Vessel standards, safety certification and river licensing are matters for the competent authority.","Departure dates, cabin availability and pricing require a connected operator adapter. None is live.","Temple access on any itinerary follows that site’s own classification."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/nile","label":"The Nile","body":"The wider river."},{"href":"/governorates/luxor","label":"Luxor","body":"Where most cruises start."},{"href":"/governorates/aswan","label":"Aswan","body":"Where they end."},{"href":"/trip-builder","label":"Trip builder","body":"Fit a cruise into a route."}]}
        />
      </div>
    </Page>
  );
}
