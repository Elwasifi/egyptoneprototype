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
  return LOCALES.flatMap((locale) => db.museums.all().map((m) => ({ locale, slug: m.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = db.museums.bySlug(slug);
  return m ? { title: m.name, description: m.summary } : { title: 'Museum not found' };
}

export default async function MuseumDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const m = db.museums.bySlug(slug);
  if (!m) notFound();
  const l = (p: string) => L(locale as Locale, p);
  const gov = db.governorates.bySlug(m.governorateSlug);
  const sites = db.heritage.byGovernorate(m.governorateSlug).slice(0, 6);
  const others = db.museums.all().filter((x) => x.slug !== m.slug).slice(0, 6);

  return (
    <Page wide>
      <Breadcrumbs items={[{ label: 'Home', href: l('/') }, { label: 'Museums', href: l('/museums') }, { label: m.name }]} />
      <ModuleHero
        eyebrow={gov ? `${gov.name} · Museum` : 'Museum'}
        title={m.name}
        lead={m.description ?? ''}
        seed={m.slug}
        subject="museum"
        badges={<><SourceBadge status={m.sourceStatus} owner={m.sourceOwner} />{m.opened && <Badge tone="gold">Opened {m.opened}</Badge>}</>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="Collection highlights">
            <ChipList items={m.highlights} tone="gold" />
            <p className="mt-4 text-[12.5px] text-ink-faint">
              Highlights are editorial summaries of what the museum is known for. They are not catalogue records and do not
              indicate what is currently on display.
            </p>
          </InfoCard>

          {sites.length > 0 && (
            <section>
              <SectionHeader eyebrow="Context" title="Heritage sites in the same governorate" href={l(`/governorates/${m.governorateSlug}`)} hrefLabel="Governorate page" />
              <ul className="grid gap-2 sm:grid-cols-2">
                {sites.map((s) => (
                  <li key={s.slug}>
                    <Link href={l(`/heritage/${s.slug}`)} className="flex items-center justify-between gap-3 rounded-lg border border-white/7 bg-white/3 px-3 py-2.5 text-[12.5px] hover:border-gold-600/35">
                      <span className="truncate text-ink-mid">{s.name}</span>
                      <span className="shrink-0 text-[10.5px] text-ink-faint">{s.classification}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Boundary points={[
            'Opening hours, ticket prices and gallery availability are set by the museum and are not published here until a verified source is connected.',
            'Objects listed as highlights may be in storage, on loan or under conservation.',
            'For objects held outside Egypt, see the heritage-worldwide catalogue — which records the question of provenance rather than answering it.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Record">
            <FactList rows={[
              ['Governorate', gov ? <Link href={l(`/governorates/${gov.slug}`)} className="text-gold-300 hover:underline">{gov.name}</Link> : m.governorateSlug],
              ['Opened', m.opened ?? '—'],
              ['Access', m.access.replace(/_/g, ' ').toLowerCase()],
              ['Highlights recorded', String(m.highlights.length)],
            ]} />
          </InfoCard>
          <InfoCard title="Other museums">
            <ul className="grid gap-1.5">
              {others.map((o) => (
                <li key={o.slug}><Link href={l(`/museums/${o.slug}`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{o.name}</Link></li>
              ))}
            </ul>
          </InfoCard>
          <SourceNote status={m.sourceStatus} owner={m.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/museums', label: 'All museums', body: 'The full directory.' },
          { href: '/egyptian-heritage-worldwide', label: 'Heritage worldwide', body: 'Objects held abroad.' },
          { href: '/ancient-egypt-academy', label: 'Academy', body: 'Learn before you go.' },
          { href: '/research', label: 'Research', body: 'Study these collections.' },
        ]} />
      </div>
    </Page>
  );
}
