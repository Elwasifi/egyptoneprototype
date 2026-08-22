import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Invest in Egypt",
  description: "A working investor experience: filter opportunities by sector, governorate, stage and ticket size; compare regions on labelled indicators; and understand exactly who decides what —",
};

export default async function InvestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Investor portal"}
        title={"Invest in Egypt"}
        lead={"A working investor experience: filter opportunities by sector, governorate, stage and ticket size; compare regions on labelled indicators; and understand exactly who decides what — because it is never this platform."}
        seed={"invest"}
        subject={"modern"}
        stats={[
      { label: 'Opportunities', value: String(db.investment.all().length) },
      { label: 'Sectors', value: String(db.investment.sectors().length) },
      { label: 'Governorates covered', value: '27' },
      { label: 'Returns guaranteed', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"Investment categories"} sub={"Each category is a full experience with its own opportunity pool."} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Tourism and hospitality","body":"Hotels, resorts, boutique properties and destination development.","href":"/tourism-investment","cta":"Open"},{"title":"Entertainment","body":"Theme parks, water parks, marinas, arenas, sports and leisure districts.","href":"/entertainment-investment","cta":"Open"},{"title":"Real estate","body":"Residential, commercial, hospitality assets and land.","href":"/real-estate","cta":"Open"},{"title":"New cities","body":"The New Administrative Capital, New Alamein and the wider programme.","href":"/new-cities","cta":"Open"},{"title":"Rural and agriculture","body":"Rural development, agri-processing and land reclamation.","href":"/rural-egypt","cta":"Open"},{"title":"Corporate and MICE","body":"Conference infrastructure, business travel and incentive capacity.","href":"/corporate-mice","cta":"Open"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">How the investment analysis works</h2>
        <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-5">
          <h3 className="text-[14px] font-semibold text-ink-hi">Example: "USD 5 million, boutique hotel"</h3>
          <p className="mt-2 text-[12.5px] leading-relaxed text-ink-low">
            The Investment Agent reads tourism demand indicators, existing hotel supply, governorate profiles, the opportunity
            registry, land requirements and seasonality, then returns recommended areas, candidate opportunities, demand
            signals, risks and next steps — each labelled with where it came from.
          </p>
          <ul className="mt-3 grid gap-1.5 text-[12px] text-ink-mid">
            <li>· Official data — from a connected authority. None connected yet.</li>
            <li>· Partner data — from a provider or partner system.</li>
            <li>· AI analysis — the agent's own reasoning, labelled as such.</li>
          </ul>
          <Link href={L(locale as Locale, '/ai')} className="mt-4 inline-flex rounded-lg border border-gold-600/40 px-3.5 py-2 text-[12.5px] font-medium text-gold-300 hover:bg-gold-600/12">Ask the Concierge →</Link>
        </div>
        <div className="surface p-5">
          <h3 className="text-[14px] font-semibold text-ink-hi">Top governorates by demo indicator</h3>
          <div className="mt-3">
            <BarStrip rows={db.governorates.all().slice().sort((a, b) => b.metrics.occupancyPct - a.metrics.occupancyPct).slice(0, 7).map((g) => ({ label: g.name, value: g.metrics.occupancyPct }))} unit="%" max={100} />
          </div>
          <p className="mt-3 text-[11.5px] text-ink-faint">Synthetic demonstration values. Not an official statistic and not a basis for a decision.</p>
        </div>
      </div>
      </section>
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">From interest to application</h2>
        <StepList steps={[{"title":"Explore the registry","body":"Filter by sector, governorate, stage and ticket size. Every entry names its competent entity."},{"title":"Compare locations","body":"Use the labelled indicators, then commission your own study. This analysis is not one."},{"title":"Request the official pack","body":"Feasibility studies, land terms and incentive schedules come from the competent entity, not from here."},{"title":"Establish the entity","body":"The business setup navigator sequences the authorities, licences and documents."},{"title":"Apply through the official channel","body":"Egypt One routes you there. It does not submit, endorse or expedite an application.","note":"The platform has no influence on any approval decision."}]} />
      </section>

        <Boundary points={["Egypt One does not allocate land, grant licences, approve projects or guarantee any return.","It does not provide regulated financial or legal advice.","Demand indicators are synthetic demonstration values, not official statistics.","Investment lead handling is contractual, and government fees never carry a platform commission."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/investment-opportunities","label":"Opportunity registry","body":"Browse everything."},{"href":"/business-setup","label":"Business setup","body":"Establish the entity."},{"href":"/real-estate","label":"Real estate","body":"Property assets."},{"href":"/government/investment","label":"Government view","body":"The lead pipeline."}]}
        />
      </div>
    </Page>
  );
}
