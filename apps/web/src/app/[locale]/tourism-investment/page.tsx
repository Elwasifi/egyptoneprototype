import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Tourism investment",
  description: "Hotels, resorts, boutique properties, destination development and the supply gaps that show up when demand is mapped against existing capacity across the 27 governorates.",
};

export default async function TourismInvestmentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Invest"}
        title={"Tourism investment"}
        lead={"Hotels, resorts, boutique properties, destination development and the supply gaps that show up when demand is mapped against existing capacity across the 27 governorates."}
        seed={"tourism-investment"}
        subject={"modern"}
        stats={[
      { label: 'Tourism opportunities', value: String(db.investment.all().filter((o) => /tourism|hotel|resort/i.test(o.sector)).length) },
      { label: 'Governorates', value: '27' },
      { label: 'Hotels recorded', value: String(db.providers.byType('HOTEL').length) },
      { label: 'Official statistics used', value: 'None yet' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Where supply is tightest (demo indicators)</h2>
        <div className="surface p-5">
        <BarStrip rows={db.governorates.all().slice().sort((a, b) => b.metrics.occupancyPct - a.metrics.occupancyPct).slice(0, 10).map((g) => ({ label: g.name + ' (' + g.metrics.hotels + ' hotels)', value: g.metrics.occupancyPct }))} unit="%" max={100} />
        <p className="mt-3 text-[11.5px] text-ink-faint">High occupancy against low room count is the crude signal for a supply gap. These are synthetic values; a real decision needs official statistics and a commissioned study.</p>
      </div>
      </section>
        <section>
        <SectionHeader title={"Sub-sectors"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Boutique and heritage hospitality","body":"Small-format properties in Upper Egypt, the oases and historic quarters."},{"title":"Resort development","body":"Coastal capacity on the Red Sea, South Sinai and the Mediterranean."},{"title":"Serviced and hotel apartments","body":"Longer-stay formats for business, medical and academic travel."},{"title":"Eco-lodges and desert camps","body":"Low-density formats in protected and desert landscapes."},{"title":"Nile vessels","body":"Cruise and dahabiya capacity between Luxor and Aswan."},{"title":"Destination management","body":"Operators, transport and experience supply, not just beds."}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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

        <Boundary points={["Occupancy and visitor figures are synthetic demonstration values.","Tourism development on or near a heritage site is subject to the competent authority’s rules, and this platform has no influence over them.","Nothing here is an offer, an allocation or an approval."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/invest","label":"Investor portal","body":"The whole module."},{"href":"/investment-opportunities","label":"Registry","body":"Browse opportunities."},{"href":"/hotels","label":"Hotels","body":"Existing supply."},{"href":"/governorates","label":"Governorates","body":"Where demand is."}]}
        />
      </div>
    </Page>
  );
}
