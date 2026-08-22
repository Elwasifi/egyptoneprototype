import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Yachts and marinas",
  description: "Charter, berthing, sea excursions and fishing across the Red Sea, the Mediterranean and the Gulf of Suez — plus the marina development pipeline that sits behind them on the investm",
};

export default async function YachtsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Water"}
        title={"Yachts and marinas"}
        lead={"Charter, berthing, sea excursions and fishing across the Red Sea, the Mediterranean and the Gulf of Suez — plus the marina development pipeline that sits behind them on the investment side."}
        seed={"yachts"}
        subject={"sea"}
        stats={[
      { label: 'Charter providers', value: String(db.providers.byType('YACHT').length) },
      { label: 'Coastal governorates', value: String(db.governorates.all().filter((g) => g.hasCoast).length) },
      { label: 'Marina opportunities', value: String(db.investment.all().filter((o) => /marina/i.test(o.sector)).length) },
      { label: 'Live charter adapters', value: '0' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Charter providers</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {db.providers.byType('YACHT').map((p) => (
          <div key={p.slug} className="surface p-4">
            <div className="text-[13.5px] font-semibold text-ink-hi">{p.name}</div>
            <div className="mt-1 text-[11.5px] text-ink-faint">{p.governorateSlug.replace(/-/g, ' ')}</div>
            <div className="mt-2 text-[12px] text-ink-low">{p.priceFrom ? 'Indicative from ' + p.currency + ' ' + p.priceFrom : 'Rate on request'}</div>
            <div className="mt-3"><SourceBadge status={p.sourceStatus} size="sm" /></div>
          </div>
        ))}
      </div>
      </section>
        <InfoCard title={"Marinas as infrastructure"}>
        <p>Berth capacity is one of the practical constraints on Egyptian marine tourism: a coastline can attract charter demand it cannot physically service. That is why marina development appears in the investment module as its own category rather than as a footnote under hospitality — the berth, the fuel, the customs point and the service yard are all separate pieces of a working marine economy.</p>
      </InfoCard>

        <Boundary points={["Vessel registration, crew certification and port clearance are matters for the competent authority.","Charter rates and availability need a connected provider. None is live.","Cruising permissions in protected waters are granted by the managing authority."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/sea","label":"Red Sea & Mediterranean","body":"The coasts."},{"href":"/investment-opportunities","label":"Marina opportunities","body":"The development side."},{"href":"/vip-transport","label":"VIP transport","body":"Getting to the berth."},{"href":"/activities","label":"Sea excursions","body":"Day experiences."}]}
        />
      </div>
    </Page>
  );
}
