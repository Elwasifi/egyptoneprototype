import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "About Egypt One",
  description: "Egypt One is a national digital platform that connects tourism, heritage, investment, services, health, research, commerce and events into one journey. It is a coordinator and a te",
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"The platform"}
        title={"About Egypt One"}
        lead={"Egypt One is a national digital platform that connects tourism, heritage, investment, services, health, research, commerce and events into one journey. It is a coordinator and a technology layer — not a replacement for government systems."}
        seed={"about"}
        subject={"modern"}
        stats={[
      { label: 'Governorates', value: '27' },
      { label: 'Country gateways', value: String(db.countries.count()) },
      { label: 'Route templates', value: '74' },
      { label: 'Specialised AI agents', value: '16' },
    ]}
      />

      <div className="grid gap-8">
        <InfoCard title={"What the platform does"}>
        <p>Travellers, investors, researchers and businesses each arrive with a different question, and each of them currently has to assemble the answer from a dozen disconnected places. Egypt One puts one identity, one experience and one assistant across all of it: discover a place, understand its history, find a verified guide, book the transport, plan the medical or academic side of the trip, and — if the visit turns into an interest in building something — carry that through to the right authority.</p>
        <p className="mt-3">The platform sits between people and the systems that already exist. Providers keep their own inventory. Authorities keep their own registries, decisions and data. Egypt One coordinates the experience across them and keeps a record of where every piece of information came from.</p>
      </InfoCard>
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">The integration principle</h2>
        <StepList steps={[{"title":"Authoritative system","body":"A ministry, authority, university, hospital or company remains the system of record for its own data. Egypt One never takes direct database access."},{"title":"Secure, approved exchange","body":"Data moves through an agreed API using OAuth2/OIDC or mTLS, scoped to what the service actually needs, and rate-limited."},{"title":"Integration layer","body":"Adapters normalise what comes back and attach provenance: who owns it, when it was verified, and what class of data it is."},{"title":"AI and service orchestration","body":"Skills and agents compose across those adapters. No skill talks to a vendor directly."},{"title":"User experience","body":"The answer reaches the person with its source label intact — so an official answer and a demonstration one never look the same.","note":"If the chain breaks at any point, the platform says so instead of filling the gap."}]} />
      </section>
        <section>
        <SectionHeader title={"What Egypt One is not"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Not a government system","body":"It does not issue visas, licences, permits or approvals, and does not make sovereign decisions."},{"title":"Not a payment processor","body":"Money moves through a licensed payment service provider. The platform never holds funds."},{"title":"Not a licensing authority","body":"Platform verification is a check on submitted documents. Licensing belongs to the competent authority."},{"title":"Not an investment adviser","body":"It surfaces labelled indicators and names the competent entity. It does not advise, and it never guarantees a return."},{"title":"Not a medical service","body":"It does not diagnose, treat or interpret results, and health data carries the highest protection class."},{"title":"Not a data broker","body":"Sensitive data is never used for marketing or affiliate purposes, and every sensitive access is audited."}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <InfoCard title={"Current status"}>
        <FactList rows={[["Build stage","Working prototype — web only, fully responsive"],["Data","Demonstration content across every module unless a badge says otherwise"],["Government integrations","None connected. All are declared as planned."],["Commercial partnerships","None. Adapter classes exist; no agreement with any named company."],["Payments","Sandbox PSP adapter only. No live settlement."],["Golden Licence","Not held. An internal readiness tracker exists in the admin console."]]} />
      </InfoCard>

        <Boundary points={["Everything visible in this prototype is demonstration or synthetic data unless a source badge says otherwise.","Egypt One does not claim any official status, endorsement or mandate.","Figures in the business material behind this platform are illustrative management assumptions, not forecasts."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/discover","label":"Discover Egypt","body":"Start exploring."},{"href":"/admin/integrations","label":"Integration registry","body":"What is connected."},{"href":"/support","label":"Support","body":"Get help."},{"href":"/media","label":"Media centre","body":"Press material."}]}
        />
      </div>
    </Page>
  );
}
