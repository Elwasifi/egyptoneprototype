import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Support centre",
  description: "Help with trips, bookings, accounts, providers and reporting problems — routed by an operations agent to a human, never resolved by an automated response where a person is needed.",
};

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Help"}
        title={"Support centre"}
        lead={"Help with trips, bookings, accounts, providers and reporting problems — routed by an operations agent to a human, never resolved by an automated response where a person is needed."}
        seed={"support"}
        subject={"city"}
        stats={[
      { label: 'Escalation to human', value: 'Always available' },
      { label: 'Case data class', value: 'PERSONAL' },
      { label: 'Auto-closed cases', value: 'None' },
      { label: 'Response target', value: 'Contractual' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"What can we help with"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Trips and itineraries","body":"Planning, editing and understanding what is and is not booked.","href":"/account/trips","cta":"My trips"},{"title":"Bookings","body":"Status, changes and cancellations — subject to the provider’s own terms.","href":"/account/bookings","cta":"My bookings"},{"title":"Account and privacy","body":"Access, correction, consent and deletion of your data.","href":"/account/consent","cta":"Consent centre"},{"title":"Providers and listings","body":"Onboarding, verification and inventory questions.","href":"/provider","cta":"Provider portal"},{"title":"Report an issue","body":"Unsafe listings, suspected fraud, misrepresented verification or incorrect content.","href":"/support#report","cta":"Report"},{"title":"Safety and emergency","body":"Urgent situations route straight to the safety centre.","href":"/safety","cta":"Safety centre"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">How a case moves</h2>
        <StepList steps={[{"title":"You raise it","body":"Through the concierge, this page or a provider portal. A reference is created immediately."},{"title":"Operations triage","body":"The Operations Agent classifies and routes it. It cannot decide a verification, alter a financial record or touch health data."},{"title":"A human owns it","body":"Every case has a named owner. Automated responses never close a case on their own."},{"title":"Resolution and record","body":"The outcome is recorded against the case, and any sensitive access made in resolving it is in the audit log."}]} />
      </section>
        <InfoCard title={"Contact"}>
        <FactList rows={[["Prototype status","This is a demonstration build; no live support desk is staffed."],["Emergency","Contact local emergency services directly. This platform is not an emergency service."],["Data protection requests","Handled through the consent centre and the platform’s data protection process."],["Report an issue","Anything that looks misrepresented — especially a verification claim — should be reported."]]} />
        <Link href={L(locale as Locale, '/contact')} className="mt-3 inline-block text-[12.5px] font-medium text-gold-300 hover:underline">Contact the team →</Link>
      </InfoCard>

        <Boundary points={["No live support desk operates in this prototype.","Support agents can see customer records with a stated purpose, and those accesses are audited and minimised.","Support cannot override a provider’s cancellation terms, a payment provider’s decision or an authority’s ruling."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/safety","label":"Safety centre","body":"Urgent situations."},{"href":"/account/consent","label":"Consent centre","body":"Your data."},{"href":"/about","label":"About","body":"What this platform is."},{"href":"/reviews","label":"Reviews","body":"Structured feedback."}]}
        />
      </div>
    </Page>
  );
}
