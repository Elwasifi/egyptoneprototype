import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import { LOCALES, type Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, AccessBadge, Breadcrumbs, SectionHeader, SmartImage, subjectFor } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, Boundary, RelatedLinks, SourceNote, StepList } from '@/components/Module';
import { href as L } from '@/lib/locale';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => db.rulers.all().map((r) => ({ locale, slug: r.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = db.rulers.bySlug(slug);
  return r ? { title: r.name, description: r.summary } : { title: 'Ruler not found' };
}

export default async function RulerDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const r = db.rulers.bySlug(slug);
  if (!r) notFound();
  const l = (p: string) => L(locale as Locale, p);
  const era = db.eras.all().find((e) => e.key === r.era);
  const contemporaries = db.rulers.byEra(r.era).filter((x) => x.slug !== r.slug);
  const sites = db.heritage.byEra(r.era).slice(0, 8);

  return (
    <Page wide>
      <Breadcrumbs items={[{ label: 'Home', href: l('/') }, { label: 'Rulers of Egypt', href: l('/rulers-of-egypt') }, { label: r.name }]} />
      <ModuleHero
        eyebrow={`${era?.name ?? r.era} · ${r.dynasty ?? ''}`}
        title={r.name}
        lead={`${r.reign}. ${r.achievements.join('. ')}.`}
        seed={r.slug}
        subject="temple"
        badges={<><Badge tone="gold">{r.reign}</Badge><SourceBadge status={r.sourceStatus} owner={r.sourceOwner} /></>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="What this reign is known for">
            <ul className="grid gap-2">
              {r.achievements.map((a, i) => (
                <li key={i} className="flex gap-2.5"><span className="mt-[3px] text-gold-500" aria-hidden="true">◆</span><span>{a}</span></li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Associated monuments">
            <ChipList items={r.monuments} tone="gold" />
          </InfoCard>

          {sites.length > 0 && (
            <section>
              <SectionHeader eyebrow={era?.name ?? ''} title="Registry sites from this period" href={l('/heritage')} hrefLabel="Full registry" />
              <ul className="grid gap-2 sm:grid-cols-2">
                {sites.map((s) => (
                  <li key={s.slug}>
                    <Link href={l(`/heritage/${s.slug}`)} className="flex items-center justify-between gap-3 rounded-lg border border-white/7 bg-white/3 px-3 py-2.5 text-[12.5px] hover:border-gold-600/35">
                      <span className="truncate text-ink-mid">{s.name}</span>
                      <span className="shrink-0 text-[10.5px] text-ink-faint">{s.governorateSlug.replace(/-/g, ' ')}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Boundary points={[
            'Regnal dates for early periods follow a conventional chronology and are debated among Egyptologists.',
            'Attribution of a monument to a ruler reflects mainstream scholarship, not settled fact in every case.',
            'This profile is an editorial summary, not an academic source. Do not cite it.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Record">
            <FactList rows={[
              ['Era', era?.name ?? r.era],
              ['Dynasty', r.dynasty ?? '—'],
              ['Reign', r.reign],
              ['Monuments linked', String(r.monuments.length)],
            ]} />
          </InfoCard>
          {contemporaries.length > 0 && (
            <InfoCard title="Others of this era">
              <ul className="grid gap-1.5">
                {contemporaries.map((c) => (
                  <li key={c.slug}><Link href={l(`/rulers-of-egypt/${c.slug}`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{c.name}</Link></li>
                ))}
              </ul>
            </InfoCard>
          )}
          <SourceNote status={r.sourceStatus} owner={r.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/rulers-of-egypt', label: 'Ruler index', body: 'All profiles.' },
          { href: '/egypt-through-time', label: 'Timeline', body: 'Eleven eras.' },
          { href: '/heritage', label: 'Heritage registry', body: 'What survives.' },
          { href: '/ancient-egypt-academy', label: 'Academy', body: 'Guided learning.' },
        ]} />
      </div>
    </Page>
  );
}
