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
  return LOCALES.flatMap((locale) => db.destinations.all().map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = db.destinations.bySlug(slug);
  return d ? { title: d.name, description: d.summary } : { title: 'Destination not found' };
}

export default async function DestinationDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const d = db.destinations.bySlug(slug);
  if (!d) notFound();
  const l = (p: string) => L(locale as Locale, p);
  const gov = db.governorates.bySlug(d.governorateSlug);
  const heritage = db.heritage.byGovernorate(d.governorateSlug).slice(0, 6);
  const providers = db.providers.byGovernorate(d.governorateSlug);
  const nearby = db.destinations.byGovernorate(d.governorateSlug).filter((x) => x.slug !== d.slug).slice(0, 6);

  return (
    <Page wide>
      <Breadcrumbs items={[
        { label: 'Home', href: l('/') }, { label: 'Discover', href: l('/discover') },
        ...(gov ? [{ label: gov.name, href: l(`/governorates/${gov.slug}`) }] : []),
        { label: d.name },
      ]} />
      <ModuleHero
        eyebrow={`${gov?.name ?? ''} · ${d.category}`}
        title={d.name}
        lead={d.description ?? d.summary ?? ''}
        seed={d.slug}
        subject={subjectFor([d.category], d.name)}
        badges={<><Badge tone="gold">{d.category}</Badge><SourceBadge status={d.sourceStatus} owner={d.sourceOwner} /></>}
        actions={[{ href: l('/trip-builder'), label: 'Add to a trip', primary: true }, ...(gov ? [{ href: l(`/governorates/${gov.slug}`), label: `All of ${gov.name}` }] : [])]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          {heritage.length > 0 && (
            <section>
              <SectionHeader eyebrow="Nearby" title="Heritage in this governorate" href={l('/heritage')} hrefLabel="Registry" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {heritage.map((h) => (
                  <Link key={h.slug} href={l(`/heritage/${h.slug}`)} className="surface lift overflow-hidden p-0">
                    <SmartImage seed={h.slug} subject={subjectFor([h.classification], h.name)} alt={h.name} ratio="16/10" />
                    <div className="p-3.5">
                      <div className="text-[13px] font-medium text-ink-hi">{h.name}</div>
                      <div className="mt-1 text-[11px] text-ink-faint">{h.access.replace(/_/g, ' ').toLowerCase()}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <InfoCard title="Services around this destination">
            <div className="grid gap-3 sm:grid-cols-2">
              {[['Stays', 'HOTEL', '/hotels'], ['Guides', 'GUIDE', '/guides'], ['Activities', 'ACTIVITY', '/activities'], ['Food', 'RESTAURANT', '/restaurants']].map(([label, type, hrefP]) => {
                const rows = providers.filter((p) => p.type === type);
                return (
                  <div key={label} className="rounded-lg border border-white/8 bg-white/3 p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-medium text-ink-hi">{label}</span>
                      <Badge tone={rows.length ? 'ok' : 'neutral'}>{rows.length}</Badge>
                    </div>
                    <Link href={l(hrefP)} className="mt-2 inline-flex text-[11.5px] text-gold-300 hover:underline">Open →</Link>
                  </div>
                );
              })}
            </div>
          </InfoCard>

          <Boundary points={[
            'Best-season guidance is editorial, not a forecast.',
            'Nothing on this page is a booked, priced or confirmed product.',
            'Access to any heritage site listed here follows that site\u2019s own classification and the authority\u2019s rules.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Record">
            <FactList rows={[
              ['Category', d.category],
              ['Governorate', gov ? <Link href={l(`/governorates/${gov.slug}`)} className="text-gold-300 hover:underline">{gov.name}</Link> : d.governorateSlug],
              ['Best season', d.bestSeason ?? '—'],
              ['Coordinates', d.coordinates ? `${d.coordinates.lat.toFixed(2)}, ${d.coordinates.lng.toFixed(2)}` : 'Not published'],
            ]} />
          </InfoCard>
          {nearby.length > 0 && (
            <InfoCard title="Other places nearby">
              <ul className="grid gap-1.5">
                {nearby.map((n) => (
                  <li key={n.slug}><Link href={l(`/destinations/${n.slug}`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{n.name}</Link></li>
                ))}
              </ul>
            </InfoCard>
          )}
          <SourceNote status={d.sourceStatus} owner={d.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/discover', label: 'Discover Egypt', body: 'The full index.' },
          { href: '/governorates', label: 'Governorates', body: 'Browse by region.' },
          { href: '/trip-builder', label: 'Trip builder', body: 'Build the route.' },
          { href: '/map', label: 'Map', body: 'See it in place.' },
        ]} />
      </div>
    </Page>
  );
}
