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
  return LOCALES.flatMap((locale) => db.destinations.all().slice(0, 60).map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = db.destinations.bySlug(slug) ?? db.heritage.bySlug(slug);
  return d ? { title: d.name } : { title: 'Attraction not found' };
}

/** Attractions resolve against both the destination and heritage registries. */
export default async function AttractionDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const heritage = db.heritage.bySlug(slug);
  const dest = db.destinations.bySlug(slug);
  const rec = heritage ?? dest;
  if (!rec) notFound();
  const l = (p: string) => L(locale as Locale, p);
  const gov = db.governorates.bySlug(rec.governorateSlug);
  const activities = db.providers.byGovernorate(rec.governorateSlug).filter((p) => p.type === 'ACTIVITY');
  const guides = db.providers.byGovernorate(rec.governorateSlug).filter((p) => p.type === 'GUIDE').slice(0, 4);

  return (
    <Page wide>
      <Breadcrumbs items={[{ label: 'Home', href: l('/') }, { label: 'Attractions', href: l('/activities') }, { label: rec.name }]} />
      <ModuleHero
        eyebrow={`${gov?.name ?? ''} · Attraction`}
        title={rec.name}
        lead={rec.description ?? rec.summary ?? ''}
        seed={rec.slug}
        subject={subjectFor(rec.tags ?? [], rec.name)}
        badges={<>{heritage && <AccessBadge access={heritage.access} />}<SourceBadge status={rec.sourceStatus} owner={rec.sourceOwner} /></>}
        actions={[
          ...(heritage ? [{ href: l(`/heritage/${heritage.slug}`), label: 'Full heritage record', primary: true }] : []),
          ...(dest ? [{ href: l(`/destinations/${dest.slug}`), label: 'Destination page' }] : []),
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="Visiting">
            <p>
              Visit duration, ticketing and timed entry are set by the site authority. Egypt One shows what the registry records
              and links to the operators who work there; it does not sell entry or publish opening hours without a verified source.
            </p>
          </InfoCard>
          {activities.length > 0 && (
            <InfoCard title="Experiences here">
              <ul className="grid gap-1.5">
                {activities.slice(0, 6).map((a) => (
                  <li key={a.slug} className="text-[12.5px] text-ink-low">{a.name}{a.priceFrom ? ` · from ${a.currency} ${a.priceFrom}` : ''}</li>
                ))}
              </ul>
              <Link href={l('/activities')} className="mt-3 inline-flex text-[12px] text-gold-300 hover:underline">All activities →</Link>
            </InfoCard>
          )}
          <Boundary points={[
            'Opening hours, ticket prices and photography rules come from the site authority.',
            'Nothing here is bookable in this prototype.',
            'Where a site requires a permit, that permit is obtained from the competent authority.',
          ]} />
        </div>
        <aside className="grid content-start gap-4">
          <InfoCard title="Record">
            <FactList rows={[
              ['Governorate', gov ? <Link href={l(`/governorates/${gov.slug}`)} className="text-gold-300 hover:underline">{gov.name}</Link> : rec.governorateSlug],
              ['Type', heritage ? heritage.classification : dest?.category ?? '—'],
              ['Access', heritage ? heritage.access.replace(/_/g, ' ').toLowerCase() : 'Not classified'],
            ]} />
          </InfoCard>
          {guides.length > 0 && (
            <InfoCard title="Guides nearby">
              <ul className="grid gap-1.5">
                {guides.map((g) => (
                  <li key={g.slug}><Link href={l(`/guides/${g.slug}`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{g.name}</Link></li>
                ))}
              </ul>
            </InfoCard>
          )}
          <SourceNote status={rec.sourceStatus} owner={rec.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/activities', label: 'Activities', body: 'Guided experiences.' },
          { href: '/heritage', label: 'Heritage registry', body: 'The record behind it.' },
          { href: '/trip-builder', label: 'Trip builder', body: 'Plan around it.' },
          { href: '/governorates', label: 'Governorates', body: 'Explore the region.' },
        ]} />
      </div>
    </Page>
  );
}
