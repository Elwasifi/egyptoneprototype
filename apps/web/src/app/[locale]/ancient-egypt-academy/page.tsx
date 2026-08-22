import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Ancient Egypt Academy",
  description: "Guided learning about Ancient Egyptian civilisation: the rulers, the writing system, the monuments, the mythology and the archaeology — built for curious travellers first and acade",
};

export default async function AncientEgyptAcademyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Learn"}
        title={"Ancient Egypt Academy"}
        lead={"Guided learning about Ancient Egyptian civilisation: the rulers, the writing system, the monuments, the mythology and the archaeology — built for curious travellers first and academic pathways second."}
        seed={"ancient-egypt-academy"}
        subject={"temple"}
        stats={[
      { label: 'Learning tracks', value: '6' },
      { label: 'Eras covered', value: String(db.eras.all().length) },
      { label: 'Linked sites', value: String(db.heritage.all().length) },
      { label: 'Certification offered', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <SectionHeader title={"Learning tracks"} sub={"Each track links out to the registry, the museums and the timeline rather than duplicating them."} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {([{"title":"Civilisation foundations","body":"The Nile, the calendar, state formation and why Egypt cohered for three thousand years.","href":"/egypt-through-time","cta":"Start with the timeline"},{"title":"Rulers and dynasties","body":"From Narmer to Cleopatra VII, and what each reign is actually known for.","href":"/rulers-of-egypt","cta":"Ruler index"},{"title":"Hieroglyphs and language","body":"The writing system, its decipherment, and the shape of the Egyptian language across its stages.","href":"/research","cta":"Language programmes"},{"title":"Monuments and building","body":"Pyramid, mastaba, rock-cut tomb and temple — how and why the forms changed.","href":"/heritage","cta":"Heritage registry"},{"title":"Mythology and religion","body":"The major cults, funerary belief and how religion shaped the built landscape.","href":"/museums","cta":"See the objects"},{"title":"Archaeology today","body":"How sites are excavated, conserved and published — and who decides.","href":"/restoration","cta":"Restoration pipeline"}] as { title: string; body: string; href?: string; cta?: string }[]).map((c) => (
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
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">How a guided journey works</h2>
        <StepList steps={[{"title":"Pick a track","body":"Each track is a sequence of short lessons anchored to real records in the platform."},{"title":"Learn against the registry","body":"Every lesson links to the heritage entries, museums and rulers it discusses, so you can always check the underlying record."},{"title":"Test yourself","body":"Short quizzes reinforce the sequence. Results stay on your account and are never shared."},{"title":"Take it to the ground","body":"Turn a completed track into an itinerary that visits what you have just studied.","note":"The trip builder picks up the sites a track referenced."}]} />
      </section>
        <InfoCard title={"Concepts covered"}>
        <ChipList items={["Predynastic Naqada","State formation","Old Kingdom pyramid complexes","Middle Kingdom administration","New Kingdom empire","Amarna period","Third Intermediate Period","Ptolemaic syncretism","Roman Egypt","Coptic monasticism","Islamic architecture of Cairo","Hieroglyphic, hieratic, demotic, Coptic","Mummification","Funerary literature","Temple economy","Nilometry and the calendar"]} tone={"gold"} />
      </InfoCard>

        <Boundary points={["The Academy is an educational overview. It is not accredited and issues no certificate or qualification.","Where scholarship is divided, the material says so rather than picking a side and presenting it as settled.","For formal study, the research portal lists university programmes."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/research","label":"Research portal","body":"Formal programmes."},{"href":"/universities","label":"Universities","body":"Where to study."},{"href":"/heritage","label":"Heritage registry","body":"The sites themselves."},{"href":"/museums","label":"Museums","body":"The collections."}]}
        />
      </div>
    </Page>
  );
}
