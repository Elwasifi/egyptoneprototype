import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Rural Egypt",
  description: "Village life, farms, handicrafts, agri-tourism and the rural development opportunities behind them — the parts of the country that most itineraries and most investment decks skip e",
};

export default async function RuralEgyptPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Discover & invest"}
        title={"Rural Egypt"}
        lead={"Village life, farms, handicrafts, agri-tourism and the rural development opportunities behind them — the parts of the country that most itineraries and most investment decks skip entirely."}
        seed={"rural-egypt"}
        subject={"rural"}
        stats={[
      { label: 'Governorates with rural focus', value: String(db.governorates.all().filter((g) => g.investmentSectors.some((s) => /agri|rural/i.test(s))).length) },
      { label: 'Craft traditions recorded', value: String(new Set(db.governorates.all().flatMap((g) => g.crafts)).size) },
      { label: 'Rural opportunities', value: String(db.investment.all().filter((o) => /rural|agri/i.test(o.sector)).length) },
      { label: 'Product entries', value: String(db.products.all().length) },
    ]}
      />

      <div className="grid gap-8">
        <InfoCard title={"Two things at once"}>
        <p>Rural Egypt is a travel proposition and a development question in the same breath. A village that can host visitors well is a village with better roads, better water, a market for its crafts and a reason for young people to stay. Treating rural tourism purely as a product misses the point; treating it purely as development misses the demand.</p>
        <p className="mt-3">This module keeps both views on one page: where to go and what it is like, alongside what the investment and development picture actually looks like there.</p>
      </InfoCard>
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Craft traditions by governorate</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {db.governorates.all().filter((g) => g.crafts.length).slice(0, 12).map((g) => (
          <Link key={g.slug} href={L(locale as Locale, '/governorates/' + g.slug)} className="surface lift p-4">
            <div className="text-[13px] font-semibold text-ink-hi">{g.name}</div>
            <div className="mt-1 text-[11px] text-ink-faint">{g.region}</div>
            <div className="mt-2.5"><ChipList items={g.crafts} /></div>
          </Link>
        ))}
      </div>
      </section>
        <section>
        <SectionHeader title={"What rural travel looks like here"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Village stays","body":"Small-scale accommodation run by the community rather than around it.","href":"/accommodation","cta":"Accommodation"},{"title":"Craft workshops","body":"Weaving, pottery, embroidery and metalwork with the people who make it.","href":"/wear-egypt","cta":"Collections"},{"title":"Farm and food","body":"Agriculture, harvest seasons and regional cuisine.","href":"/restaurants","cta":"Food"},{"title":"Nature and wetlands","body":"Delta lakes, birdwatching and desert edges.","href":"/heritage","cta":"Registry"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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

        <Boundary points={["Community tourism only works with community consent. Nothing here should be read as an open invitation into private village life.","Rural infrastructure and accessibility vary enormously and are frequently not surveyed.","Development opportunity records are demonstration data; the competent entity decides everything real."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/governorates","label":"Governorates","body":"Where the villages are."},{"href":"/wear-egypt","label":"Wear Egypt","body":"What they make."},{"href":"/invest","label":"Investor portal","body":"The development side."},{"href":"/traveler-stories","label":"Stories","body":"What visitors found."}]}
        />
      </div>
    </Page>
  );
}
