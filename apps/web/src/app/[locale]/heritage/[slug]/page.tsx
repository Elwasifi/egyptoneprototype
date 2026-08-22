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
  return LOCALES.flatMap((locale) => db.heritage.all().map((h) => ({ locale, slug: h.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const h = db.heritage.bySlug(slug);
  return h ? { title: h.name, description: h.summary } : { title: 'Heritage record not found' };
}

const ACCESS_GUIDANCE: Record<string, string> = {
  OPEN: 'The registry records this site as open to visitors. Opening times and ticketing are still set by the competent authority and are not published here.',
  LIMITED_ACCESS: 'Access is limited. Parts of the site may be closed, or entry may be restricted to particular groups or times.',
  PERMIT_REQUIRED: 'A permit from the competent authority is required. This page does not grant, arrange or facilitate that permit, and visiting without one is not something the platform supports.',
  CLOSED: 'The registry records this site as closed. Do not plan a visit around it.',
  UNDER_RESTORATION: 'Conservation work is recorded here. Access may be suspended entirely or restricted to part of the site.',
  PROPOSED_FOR_RESTORATION: 'This site is recorded as a restoration candidate. That is a documentation status, not a funded or approved project.',
  DEMO_UNVERIFIED: 'This record has not been verified against an authoritative source.',
};

export default async function HeritageDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const h = db.heritage.bySlug(slug);
  if (!h) notFound();
  const l = (p: string) => L(locale as Locale, p);
  const gov = db.governorates.bySlug(h.governorateSlug);
  const era = db.eras.all().find((e) => e.key === h.era);
  const rulers = db.rulers.byEra(h.era).slice(0, 6);
  const nearby = db.heritage.byGovernorate(h.governorateSlug).filter((x) => x.slug !== h.slug).slice(0, 6);
  const museums = db.museums.byGovernorate(h.governorateSlug);
  const guides = db.providers.byGovernorate(h.governorateSlug).filter((p) => p.type === 'GUIDE').slice(0, 3);

  return (
    <Page wide>
      <Breadcrumbs items={[
        { label: 'Home', href: l('/') },
        { label: 'Heritage', href: l('/heritage') },
        ...(gov ? [{ label: gov.name, href: l(`/governorates/${gov.slug}`) }] : []),
        { label: h.name },
      ]} />

      <ModuleHero
        eyebrow={`${h.classification} · ${era?.name ?? h.era}`}
        title={h.name}
        lead={h.description ?? h.summary ?? ''}
        seed={h.slug}
        subject={subjectFor([h.classification, h.era], h.name)}
        badges={<><AccessBadge access={h.access} /><SourceBadge status={h.sourceStatus} owner={h.sourceOwner} />{h.hidden && <Badge tone="gold">Hidden heritage</Badge>}</>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="Access and visiting" tone={h.access === 'OPEN' ? 'neutral' : 'warn'}>
            <p>{ACCESS_GUIDANCE[h.access]}</p>
            <p className="mt-3">
              Egypt One records access classifications; it does not set them and cannot change them. Where a site requires a permit,
              the request goes to the competent authority through its own process.
            </p>
          </InfoCard>

          {era && (
            <InfoCard title={`In context: ${era.name}`}>
              <p>{era.summary}</p>
              <p className="mt-3 text-[12px] text-ink-faint">{(era as unknown as { from_: string }).from_} – {era.to}</p>
              <Link href={l('/egypt-through-time#' + h.era.toLowerCase())} className="mt-3 inline-flex text-[12.5px] text-gold-300 hover:underline">
                See this era on the timeline →
              </Link>
            </InfoCard>
          )}

          {rulers.length > 0 && (
            <InfoCard title="Rulers of this period">
              <ul className="grid gap-2 sm:grid-cols-2">
                {rulers.map((r) => (
                  <li key={r.slug}>
                    <Link href={l(`/rulers-of-egypt/${r.slug}`)} className="flex items-center justify-between gap-3 rounded-lg border border-white/7 bg-white/3 px-3 py-2 text-[12.5px] hover:border-gold-600/35">
                      <span className="text-ink-mid">{r.name}</span>
                      <span className="text-[10.5px] text-ink-faint">{r.reign}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}

          {nearby.length > 0 && (
            <section>
              <SectionHeader eyebrow={gov?.name ?? ''} title="Nearby in the registry" href={l(`/governorates/${h.governorateSlug}`)} hrefLabel="Governorate page" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {nearby.map((n) => (
                  <Link key={n.slug} href={l(`/heritage/${n.slug}`)} className="surface lift overflow-hidden p-0">
                    <SmartImage seed={n.slug} subject={subjectFor([n.classification], n.name)} alt={n.name} ratio="16/10" />
                    <div className="p-3.5">
                      <div className="text-[13px] font-medium text-ink-hi">{n.name}</div>
                      <div className="mt-1 text-[11px] text-ink-faint">{n.access.replace(/_/g, ' ').toLowerCase()}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <Boundary points={[
            'Opening hours, ticket prices, photography rules and permits come from the competent authority. None is published on this page.',
            'Academic references in this prototype are placeholders and should not be cited.',
            'Coordinates for vulnerable sites are deliberately approximate.',
            h.hidden ? 'This site is recorded as hidden heritage. Documenting it is not an invitation to visit it.' : 'Conditions on the ground change; confirm before travelling.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Registry record">
            <FactList rows={[
              ['Classification', h.classification],
              ['Period', era?.name ?? h.era],
              ['Governorate', gov ? <Link href={l(`/governorates/${gov.slug}`)} className="text-gold-300 hover:underline">{gov.name}</Link> : h.governorateSlug],
              ['Access', h.access.replace(/_/g, ' ').toLowerCase()],
              ['Restoration', (h.restorationStatus ?? 'NONE').replace(/_/g, ' ').toLowerCase()],
              ['Hidden heritage', h.hidden ? 'Yes' : 'No'],
              ['Coordinates', h.coordinates ? `${h.coordinates.lat.toFixed(2)}, ${h.coordinates.lng.toFixed(2)}` : 'Not published'],
            ]} />
          </InfoCard>

          <InfoCard title="Accessibility"><ChipList items={h.accessibility ?? []} /></InfoCard>

          {museums.length > 0 && (
            <InfoCard title="Related collections">
              <ul className="grid gap-1.5">
                {museums.slice(0, 4).map((m) => (
                  <li key={m.slug}><Link href={l(`/museums/${m.slug}`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{m.name}</Link></li>
                ))}
              </ul>
            </InfoCard>
          )}

          {guides.length > 0 && (
            <InfoCard title="Guides in this governorate">
              <ul className="grid gap-1.5">
                {guides.map((g) => (
                  <li key={g.slug}><Link href={l(`/guides/${g.slug}`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{g.name}</Link></li>
                ))}
              </ul>
            </InfoCard>
          )}

          <SourceNote status={h.sourceStatus} owner={h.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/heritage', label: 'Heritage registry', body: 'All recorded sites.' },
          { href: '/hidden-heritage', label: 'Hidden heritage', body: 'Beyond the itineraries.' },
          { href: '/restoration', label: 'Restoration', body: 'Conservation pipeline.' },
          { href: '/trip-builder', label: 'Trip builder', body: 'Add this to a route.' },
        ]} />
      </div>
    </Page>
  );
}
