import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Safety centre",
  description: "Emergency navigation, embassy routing, lost document and lost person workflows — and a clear account of what the platform can and cannot do in an emergency.",
};

export default async function SafetyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Support"}
        title={"Safety centre"}
        lead={"Emergency navigation, embassy routing, lost document and lost person workflows — and a clear account of what the platform can and cannot do in an emergency."}
        seed={"safety"}
        subject={"city"}
        stats={[
      { label: 'Location modes', value: '3' },
      { label: 'Consent required', value: 'Always' },
      { label: 'Automatic authority contact', value: 'Never' },
      { label: 'Audited accesses', value: 'All' },
    ]}
      />

      <div className="grid gap-8">
        <InfoCard title={"In an emergency"}>
        <p>If you are in immediate danger, contact local emergency services directly. Do not wait for an assistant, an app or a support ticket. Egypt One is not an emergency service and cannot dispatch help.</p>
        <p className="mt-3">What the platform can do is hold the context — where your trip says you are, which mission serves your nationality, which hospital is nearest, what your booking references are — so that when you reach a human, the conversation starts further along.</p>
      </InfoCard>
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Lost passport</h2>
        <StepList steps={[{"title":"Report it to the police","body":"A police report is normally the first document your mission will ask for."},{"title":"Contact your embassy or consulate","body":"They issue emergency travel documents. Egypt One can help you identify the accredited mission but does not contact them for you."},{"title":"Gather what you have","body":"Photocopies, digital scans, booking references and your trip record all help."},{"title":"Adjust your travel","body":"Onward travel usually needs rescheduling. Your itinerary is here to work from.","note":"Egypt One never holds or transmits your passport data without explicit consent."}]} />
      </section>
        <InfoCard title={"Location consent modes"}>
        <FactList rows={[["OFF","The default. No location is read, stored or inferred."],["TRIP MODE","Coarse location while a trip is active, used only for itinerary context. Revocable at any time."],["EMERGENCY MODE","Precise location, opened by you, for a stated emergency purpose. Every read is audited and it expires."],["Marketing use","Never. Location is classified SENSITIVE and is excluded from marketing and affiliate use entirely."]]} />
      </InfoCard>
        <section>
        <SectionHeader title={"Other situations"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Lost family member","body":"A structured workflow that escalates to a human operator rather than an automated response.","href":"/support","cta":"Contact support"},{"title":"Medical emergency","body":"Provider navigation. Egypt One does not diagnose or advise clinically.","href":"/medical-tourism","cta":"Medical module"},{"title":"Embassy and consulate","body":"Mission routing by nationality.","href":"/egypt-195","cta":"Find your gateway"},{"title":"Report a problem","body":"Provider issues, unsafe listings or suspected fraud.","href":"/support","cta":"Report an issue"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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

        <Boundary points={["Egypt One is not an emergency service and cannot dispatch police, ambulance or rescue.","The platform never contacts authorities on your behalf without your explicit instruction.","Emergency numbers and official procedures must come from the competent authority. That integration is not connected.","No claim is made about the confidentiality of any third-party helpline."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/account/consent","label":"Consent centre","body":"Control location sharing."},{"href":"/visa","label":"Visa & entry","body":"Documents."},{"href":"/medical-tourism","label":"Medical","body":"Health providers."},{"href":"/support","label":"Support","body":"Reach a human."}]}
        />
      </div>
    </Page>
  );
}
