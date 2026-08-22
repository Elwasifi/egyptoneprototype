import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Health and wellness",
  description: "The entry point to medical tourism, wellness journeys and the research boundary around ancestry — with the platform’s strictest data protections applied throughout.",
};

export default async function HealthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Health"}
        title={"Health and wellness"}
        lead={"The entry point to medical tourism, wellness journeys and the research boundary around ancestry — with the platform’s strictest data protections applied throughout."}
        seed={"health"}
        subject={"city"}
        stats={[
      { label: 'Providers listed', value: String(db.providers.byType('MEDICAL').length) },
      { label: 'Data class', value: 'SENSITIVE' },
      { label: 'Consent required', value: 'Explicit' },
      { label: 'Clinical advice given', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"Three different things"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Medical tourism","body":"Clinical treatment: hospitals, specialists, dental, vision, cosmetic, fertility and rehabilitation.","href":"/medical-tourism","cta":"Open medical tourism"},{"title":"Wellness","body":"Non-clinical: thermal and natural destinations, spa, preventive health and recovery travel.","href":"/wellness","cta":"Open wellness"},{"title":"Know your origin","body":"An educational and research concept about ancestry, with hard boundaries on what it will never do.","href":"/know-your-origin","cta":"Read the boundaries"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <InfoCard title={"How health data is treated"}>
        <FactList rows={[["Classification","SENSITIVE — the platform’s highest protection short of restricted government data"],["Access rule","Explicit consent plus a stated purpose, checked on every read"],["Audit","Every access is recorded, whether it is allowed or refused"],["Marketing use","Never. Health data is excluded from marketing, segmentation and affiliate use entirely."],["Government access","None. Government roles do not receive individual health data."],["AI access","The Medical Agent cannot store or transmit health data and cannot diagnose."]]} />
      </InfoCard>

        <Boundary points={["Egypt One does not diagnose, treat, recommend treatment or interpret results.","Provider accreditation shown is a demonstration record until the accredited-network integration is connected.","Referral fees are disabled by default and would require legal review anywhere they are permitted at all."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/medical-tourism","label":"Medical tourism","body":"Clinical providers."},{"href":"/wellness","label":"Wellness","body":"Non-clinical journeys."},{"href":"/know-your-origin","label":"Know your origin","body":"Research boundaries."},{"href":"/account/consent","label":"Consent centre","body":"Control your data."}]}
        />
      </div>
    </Page>
  );
}
