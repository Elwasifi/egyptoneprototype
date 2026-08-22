import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Red Sea and Mediterranean",
  description: "Two very different coasts: the Red Sea with some of the most intact coral reef systems in the world, and a Mediterranean shoreline that carries Alexandria, El Alamein and the weste",
};

export default async function SeaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Water"}
        title={"Red Sea and Mediterranean"}
        lead={"Two very different coasts: the Red Sea with some of the most intact coral reef systems in the world, and a Mediterranean shoreline that carries Alexandria, El Alamein and the western beaches."}
        seed={"sea"}
        subject={"sea"}
        stats={[
      { label: 'Coastal governorates', value: String(db.governorates.all().filter((g) => g.hasCoast).length) },
      { label: 'Marine providers', value: String(db.providers.byType('YACHT').length) },
      { label: 'Coastal stays', value: String(db.providers.byType('HOTEL').filter((h) => db.governorates.bySlug(h.governorateSlug)?.hasCoast).length) },
      { label: 'Live dive bookings', value: '0' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"What the coasts offer"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Diving and snorkelling","body":"Reef systems off Hurghada, Marsa Alam, Sharm El Sheikh and Dahab.","href":"/activities","cta":"Find operators"},{"title":"Yachts and marinas","body":"Charter, berthing and sea excursions.","href":"/yachts","cta":"Open marinas"},{"title":"Coastal stays","body":"Resorts, boutique properties and residences.","href":"/hotels","cta":"Find a stay"},{"title":"Protected areas","body":"Ras Mohammed, Wadi El Gemal and the Giftun islands.","href":"/heritage","cta":"Registry"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Coastal governorates</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {db.governorates.all().filter((g) => g.hasCoast).map((g) => (
          <Link key={g.slug} href={L(locale as Locale, '/governorates/' + g.slug)} className="surface lift p-4">
            <div className="text-[13.5px] font-semibold text-ink-hi">{g.name}</div>
            <div className="mt-1 text-[11.5px] text-ink-faint">{g.region}</div>
            <div className="mt-2 text-[11.5px] text-ink-low">{g.highlights.slice(0, 2).join(' · ')}</div>
          </Link>
        ))}
      </div>
      </section>
        <InfoCard title={"Reefs are the asset"}>
        <p>Red Sea tourism rests almost entirely on reef health. That makes carrying capacity, mooring practice, wastewater treatment and dive-operator standards commercial questions as much as environmental ones — which is why the investment module treats marine development and conservation as the same conversation rather than opposing ones.</p>
      </InfoCard>

        <Boundary points={["Dive operator certification and vessel licensing are matters for the competent authority, not this platform.","Protected-area access rules are set by the managing authority and can change at short notice.","Reef and weather conditions are not published here."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/yachts","label":"Yachts & marinas","body":"On the water."},{"href":"/nile","label":"The Nile","body":"The other water."},{"href":"/governorates/red-sea","label":"Red Sea","body":"The governorate."},{"href":"/governorates/south-sinai","label":"South Sinai","body":"Sharm and Dahab."}]}
        />
      </div>
    </Page>
  );
}
