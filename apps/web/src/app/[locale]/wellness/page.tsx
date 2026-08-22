import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Wellness",
  description: "Thermal springs, desert retreats, coastal recovery, spa and preventive health — the non-clinical side of health travel, kept deliberately separate from medical treatment.",
};

export default async function WellnessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Health"}
        title={"Wellness"}
        lead={"Thermal springs, desert retreats, coastal recovery, spa and preventive health — the non-clinical side of health travel, kept deliberately separate from medical treatment."}
        seed={"wellness"}
        subject={"oasis"}
        stats={[
      { label: 'Wellness governorates', value: '6' },
      { label: 'Coastal recovery destinations', value: String(db.governorates.all().filter((g) => g.hasCoast).length) },
      { label: 'Clinical claims made', value: 'None' },
      { label: 'Data class', value: 'PERSONAL' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"Where wellness travel happens"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Siwa Oasis","body":"Salt lakes, springs and desert quiet in Matrouh governorate.","href":"/governorates/matrouh","cta":"Matrouh"},{"title":"The Western Desert oases","body":"Kharga, Dakhla and Farafra — hot springs and long horizons.","href":"/governorates/new-valley","cta":"New Valley"},{"title":"South Sinai","body":"Coastal recovery, mountain walking and desert retreat.","href":"/governorates/south-sinai","cta":"South Sinai"},{"title":"Red Sea coast","body":"Sea-based recovery and low-season retreat.","href":"/governorates/red-sea","cta":"Red Sea"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <InfoCard title={"Where the line sits"}>
        <p>Wellness travel and medical travel are different products with different risk profiles, and the platform keeps them apart deliberately. A spa, a thermal spring or a retreat is a hospitality product. A procedure is a clinical one, with a different consent model, a different data class and a different set of things the platform is not allowed to say.</p>
        <p className="mt-3">Nothing in this module makes a therapeutic claim. Where a destination has a traditional reputation for a particular benefit, that is described as a tradition rather than as an outcome.</p>
      </InfoCard>

        <Boundary points={["No therapeutic or curative claim is made for any destination, spring, treatment or retreat.","Wellness is not a substitute for medical care. If you have a condition, speak to a clinician.","Accessibility at desert and thermal sites varies widely and is often not surveyed."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/medical-tourism","label":"Medical tourism","body":"Clinical treatment."},{"href":"/rural-egypt","label":"Rural Egypt","body":"Slow travel."},{"href":"/governorates/matrouh","label":"Siwa","body":"The oasis."},{"href":"/health","label":"Health overview","body":"The whole module."}]}
        />
      </div>
    </Page>
  );
}
