import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Know your origin",
  description: "An educational and research concept about Egyptian ancestry and the science behind it. This module deliberately does nothing else: it does not test, diagnose, estimate ethnicity or",
};

export default async function KnowYourOriginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Research concept"}
        title={"Know your origin"}
        lead={"An educational and research concept about Egyptian ancestry and the science behind it. This module deliberately does nothing else: it does not test, diagnose, estimate ethnicity or hold genetic data."}
        seed={"know-your-origin"}
        subject={"museum"}
        stats={[
      { label: 'Tests offered', value: 'None' },
      { label: 'Genetic data stored', value: 'None' },
      { label: 'Ancestry claims made', value: 'None' },
      { label: 'Status', value: 'Informational only' },
    ]}
      />

      <div className="grid gap-8">
        <InfoCard title={"What this is"}>
        <p>Egypt sits at a crossroads of human movement, and questions about ancestry, population history and the genetics of ancient populations are genuinely interesting scientific ground. There is active research on ancient DNA from Egyptian contexts, on modern Egyptian population genetics, and on what can and cannot be inferred from either.</p>
        <p className="mt-3">This module exists to explain that landscape honestly, to point towards the institutions doing the work, and to be explicit about the boundary between an interesting research question and a consumer product. It is not a service, and in this prototype it is a set of informational workflows only.</p>
      </InfoCard>
        <section>
        <SectionHeader title={"What the platform will never do here"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Never diagnose ethnicity","body":"Genetic ancestry inference is probabilistic, reference-panel dependent and routinely over-interpreted. This platform will not present it as identity."},{"title":"Never claim ancestry without evidence","body":"No result, and no assertion about anyone’s descent from any ancient population."},{"title":"Never make a medical conclusion","body":"Genetic data can carry health implications. Interpreting them is clinical work, not a platform feature."},{"title":"Never expose genetic data","body":"No genetic data is collected, stored, transmitted, shared or used for marketing. The consent scope exists precisely so that it stays switched off."}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">What a real service would require first</h2>
        <StepList steps={[{"title":"Explicit, specific, revocable consent","body":"Separate from every other consent on the platform, with a plain explanation of what is inferred and what is not."},{"title":"Authorised providers only","body":"Accredited laboratories and named research institutions operating under Egyptian law."},{"title":"Full legal review","body":"Genetic data is regulated differently across jurisdictions, and travellers cross them by definition."},{"title":"Strict data governance","body":"Separate storage, hard access controls, an audit trail on every read, defined retention and real deletion."},{"title":"Honest communication of uncertainty","body":"Any result presented with its confidence intervals and its limits, not as a headline percentage.","note":"Until every one of these is in place, this module stays informational."}]} />
      </section>
        <section>
        <SectionHeader title={"Where to look instead"} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Research programmes","body":"Bioarchaeology, archaeometry and population studies at Egyptian universities.","href":"/research","cta":"Research portal"},{"title":"Museums and collections","body":"Where the material record of these populations is held.","href":"/museums","cta":"Museums"},{"title":"Heritage registry","body":"The sites the evidence comes from.","href":"/heritage","cta":"Registry"},{"title":"Your consent settings","body":"The genetic-research consent scope, and why it is off.","href":"/account/consent","cta":"Consent centre"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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

        <Boundary points={["This module offers no test, no result and no ancestry estimate.","No genetic data is collected or stored by this platform.","Popular ancestry percentages are model outputs, not facts about a person’s identity or descent.","Any future service would require explicit consent, authorised providers, legal review and strict genetic-data governance."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/research","label":"Research","body":"The real science."},{"href":"/health","label":"Health","body":"The wider module."},{"href":"/account/consent","label":"Consent centre","body":"Scope controls."},{"href":"/about","label":"About","body":"Platform boundaries."}]}
        />
      </div>
    </Page>
  );
}
