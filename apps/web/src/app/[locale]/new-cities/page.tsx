import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "New cities",
  description: "The New Administrative Capital, New Alamein, Sadat City, 10th of Ramadan and the wider new-communities programme — where new residential, commercial and hospitality supply is actua",
};

export default async function NewCitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Invest"}
        title={"New cities"}
        lead={"The New Administrative Capital, New Alamein, Sadat City, 10th of Ramadan and the wider new-communities programme — where new residential, commercial and hospitality supply is actually being built."}
        seed={"new-cities"}
        subject={"modern"}
        stats={[
      { label: 'New-city destinations', value: String(db.destinations.all().filter((d) => d.category === 'modern').length) },
      { label: 'Property records', value: String(db.properties.all().length) },
      { label: 'Opportunities', value: String(db.investment.all().filter((o) => /new cities|real estate|commercial|residential/i.test(o.sector)).length) },
      { label: 'Allocation decisions here', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"The programme"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"New Administrative Capital","body":"Government district, business district and large-scale residential east of Cairo.","href":"/governorates/cairo","cta":"Cairo"},{"title":"New Alamein City","body":"Mediterranean coastal city in Matrouh governorate.","href":"/governorates/matrouh","cta":"Matrouh"},{"title":"Sadat City","body":"Industrial and residential development in Monufia.","href":"/governorates/monufia","cta":"Monufia"},{"title":"10th of Ramadan","body":"Established industrial city in Sharqia.","href":"/governorates/sharqia","cta":"Sharqia"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <InfoCard title={"What a new city changes for an investor"}>
        <p>New-community development shifts where land is available, who allocates it, what infrastructure exists on day one, and which authority you are dealing with. That is a materially different process from acquiring in an established urban area, and the answers come from the New Urban Communities Authority rather than from a governorate.</p>
        <p className="mt-3">This module records which opportunities sit in new-community areas so the right authority is named from the start.</p>
      </InfoCard>

        <Boundary points={["Land allocation in new communities is decided by the competent authority. Egypt One has no role in it.","Delivery timelines, infrastructure readiness and phasing are not published by this platform.","Property records here are demonstration listings, not offers."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/real-estate","label":"Real estate","body":"Property listings."},{"href":"/invest","label":"Investor portal","body":"The whole module."},{"href":"/business-setup","label":"Business setup","body":"The entity."},{"href":"/investment-opportunities","label":"Registry","body":"Opportunities."}]}
        />
      </div>
    </Page>
  );
}
