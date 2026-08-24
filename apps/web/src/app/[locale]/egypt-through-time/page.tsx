import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Egypt through time",
  description: "Eleven eras, from the Neolithic Nile cultures that became the first unified state to the Egypt being built now. Each era carries its rulers, its monuments, the museums that hold it",
};

export default async function EgyptThroughTimePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Timeline"}
        title={"Egypt through time"}
        lead={"Eleven eras, from the Neolithic Nile cultures that became the first unified state to the Egypt being built now. Each era carries its rulers, its monuments, the museums that hold its objects and the registry entries that survive from it."}
        seed={"egypt-through-time"}
        subject={"temple"}
        stats={[
      { label: 'Eras', value: String(db.eras.all().length) },
      { label: 'Ruler profiles', value: String(db.rulers.all().length) },
      { label: 'Registry entries', value: String(db.heritage.all().length) },
      { label: 'Museums', value: String(db.museums.all().length) },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">The eras</h2>
        <div className="grid gap-4">
        {db.eras.all().map((e) => {
          const sites = db.heritage.byEra(e.key);
          const rulers = db.rulers.byEra(e.key);
          const isContemporary = e.key === 'CONTEMPORARY';
          return (
            <section key={e.key} id={e.key.toLowerCase()} className="surface overflow-hidden p-5 scroll-mt-24">
              {isContemporary && (
                <img
                  src="/media/era-modern-gem.jpg"
                  alt="The Grand Egyptian Museum at night, with the pyramids, a Ramses II statue and the Egyptian flag"
                  className="-mx-5 -mt-5 mb-5 h-48 w-[calc(100%+2.5rem)] object-cover sm:h-64"
                />
              )}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="block h-1 w-14 rounded-full" style={{ background: e.colour }} aria-hidden="true" />
                  <h3 className="mt-3 text-[18px] font-semibold text-ink-hi">{isContemporary ? 'Modern Egypt (The New Republic)' : e.name}</h3>
                  <p className="mt-1 text-[12px] text-gold-500">{(e as unknown as { from_: string }).from_} – {e.to}</p>
                </div>
                <div className="flex gap-2">
                  <Badge tone="neutral">{sites.length} sites</Badge>
                  <Badge tone="neutral">{rulers.length} rulers</Badge>
                </div>
              </div>
              <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-ink-mid">{e.summary}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Monuments</div>
                  <ChipList items={e.monuments} tone="gold" />
                </div>
                <div>
                  <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Museums</div>
                  <ChipList items={e.museums} />
                </div>
                <div>
                  <div className="mb-2 text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">Rulers</div>
                  {rulers.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {rulers.map((r) => (
                        <Link key={r.slug} href={L(locale as Locale, '/rulers-of-egypt/' + r.slug)} className="rounded-full border border-white/10 px-2.5 py-1 text-[11.5px] text-ink-mid hover:border-gold-600/40 hover:text-gold-300">{r.name}</Link>
                      ))}
                    </div>
                  ) : <p className="text-[12px] text-ink-faint">No profile recorded yet.</p>}
                </div>
              </div>
              {sites.length > 0 && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-[12.5px] text-gold-300">Registry entries from this era ({sites.length})</summary>
                  <ul className="mt-2.5 grid gap-1.5 sm:grid-cols-2">
                    {sites.map((s) => (
                      <li key={s.slug}>
                        <Link href={L(locale as Locale, '/heritage/' + s.slug)} className="text-[12px] text-ink-low hover:text-gold-300">{s.name}</Link>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          );
        })}
      </div>
      </section>

        <Boundary points={["Dates for early periods follow a conventional chronology. Egyptologists disagree about many of them.","Era boundaries are a scholarly convention, not sharp historical events.","This timeline is an editorial overview and should not be cited as an academic source."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/rulers-of-egypt","label":"Rulers of Egypt","body":"Who ruled when."},{"href":"/heritage","label":"Heritage registry","body":"What survives."},{"href":"/museums","label":"Museums","body":"Where objects are."},{"href":"/ancient-egypt-academy","label":"Academy","body":"Learn the periods."}]}
        />
      </div>
    </Page>
  );
}
