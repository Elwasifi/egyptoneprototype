import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import { Badge, SourceBadge, Stat, Breadcrumbs, SectionHeader, CarouselRow, SmartImage, subjectFor, EmptyState } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, Boundary, RelatedLinks, SourceNote } from '@/components/Module';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';
import { LOCALES } from '@egypt-one/i18n';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => db.governorates.all().map((g) => ({ locale, slug: g.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = db.governorates.bySlug(slug);
  if (!g) return { title: 'Governorate not found' };
  return {
    title: `${g.name} governorate`,
    description: `${g.name} — ${g.region}. Capital ${g.capital}. Heritage, cities, cuisine, crafts, nature and investment sectors across the governorate.`,
  };
}

const ERA_LABEL: Record<string, string> = {
  PREDYNASTIC: 'Predynastic', ANCIENT: 'Ancient Egypt', PTOLEMAIC: 'Ptolemaic', GRECO_ROMAN: 'Greek & Roman',
  COPTIC: 'Coptic / Christian', ISLAMIC: 'Islamic', OTTOMAN: 'Ottoman', MUHAMMAD_ALI: 'Muhammad Ali dynasty',
  KINGDOM: 'Kingdom', REPUBLIC: 'Republic', CONTEMPORARY: 'Contemporary',
};

/**
 * The governorate template. One file serves all 27 records, with every section
 * driven by CMS-managed content so an editor can extend a governorate without
 * a developer.
 */
export default async function GovernoratePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const g = db.governorates.bySlug(slug);
  if (!g) notFound();
  const l = (p: string) => L(locale as Locale, p);

  const heritage = db.heritage.byGovernorate(slug);
  const hidden = heritage.filter((h) => h.hidden);
  const museums = db.museums.byGovernorate(slug);
  const destinations = db.destinations.byGovernorate(slug);
  const providers = db.providers.byGovernorate(slug);
  const events = db.events.byGovernorate(slug);
  const opportunities = db.investment.byGovernorate(slug);
  const properties = db.properties.all().filter((p) => p.governorateSlug === slug);
  const products = db.products.byGovernorate(slug);
  const byType = (t: string) => providers.filter((p) => p.type === t);

  const eraSections = g.heritageEras.map((era) => ({
    era, label: ERA_LABEL[era] ?? era, sites: heritage.filter((h) => h.era === era),
  }));

  return (
    <Page wide>
      <Breadcrumbs items={[{ label: 'Home', href: l('/') }, { label: 'Governorates', href: l('/governorates') }, { label: g.name }]} />

      <ModuleHero
        eyebrow={`${g.region} · Governorate`}
        title={g.name}
        lead={`Capital ${g.capital}. ${g.areaKm2.toLocaleString()} km², approximately ${g.populationM}M residents. ${g.hasNile ? 'On the Nile. ' : ''}${g.hasCoast ? 'With a coastline. ' : ''}${heritage.length} heritage records, ${museums.length} museums and ${opportunities.length} indicative investment opportunities are catalogued here.`}
        seed={g.slug}
        subject={g.hasCoast ? 'sea' : g.hasNile ? 'nile' : 'desert'}
        badges={<><Badge tone="gold">{g.code}</Badge><SourceBadge status={g.sourceStatus} owner={g.sourceOwner} /></>}
        stats={[
          { label: 'Heritage records', value: String(heritage.length) },
          { label: 'Museums', value: String(museums.length) },
          { label: 'Providers', value: String(providers.length) },
          { label: 'Opportunities', value: String(opportunities.length) },
        ]}
        actions={[
          { href: l('/trip-builder'), label: 'Plan a trip here', primary: true },
          { href: l(`/invest?governorate=${g.slug}`), label: 'Investment in this governorate' },
          { href: l('/map'), label: 'View on the map' },
        ]}
      />

      {/* overview */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="Overview">
            <p>
              {g.name} sits in the {g.region} region with {g.capital} as its capital. It covers {g.areaKm2.toLocaleString()} square
              kilometres. The governorate structure used across Egypt One follows the 27 administrative governorates, and every
              module — heritage, providers, events, investment, property and crafts — is indexed against it, so a single place
              answers both "what can I see here" and "what can I build here".
            </p>
            <p className="mt-3">
              {g.hasNile && 'The Nile shapes settlement, agriculture and river tourism in this governorate. '}
              {g.hasCoast && 'Its coastline supports marine tourism, ports and coastal development. '}
              {!g.hasNile && !g.hasCoast && 'Away from the river and the coast, desert routes and oasis settlement define its geography. '}
              Historical layers recorded here span {g.heritageEras.length} eras.
            </p>
          </InfoCard>

          <InfoCard title="Signature places">
            <div className="grid gap-3 sm:grid-cols-2">
              {g.highlights.map((h) => {
                const d = destinations.find((x) => x.name === h);
                const inner = (
                  <>
                    <SmartImage seed={h} subject={subjectFor([g.region], h)} alt={h} ratio="16/10" />
                    <div className="p-3.5">
                      <div className="text-[13.5px] font-medium text-ink-hi">{h}</div>
                      {d && <p className="mt-1 line-clamp-1 text-[11.5px] text-ink-faint">{d.category}</p>}
                    </div>
                  </>
                );
                return d ? (
                  <Link key={h} href={l(`/destinations/${d.slug}`)} className="surface lift overflow-hidden p-0">{inner}</Link>
                ) : (
                  <div key={h} className="surface overflow-hidden p-0">{inner}</div>
                );
              })}
            </div>
          </InfoCard>

          {/* heritage by era */}
          <section>
            <SectionHeader eyebrow="Layered history" title="Heritage by era" sub="Every recorded site in this governorate, grouped by the period it belongs to." href={l('/heritage')} hrefLabel="Full registry" />
            {eraSections.every((s) => !s.sites.length) ? (
              <EmptyState title="No heritage records yet" body={`The registry has no entries for ${g.name} in this demo dataset. Sites are added through the CMS as records are verified.`} />
            ) : (
              <div className="grid gap-4">
                {eraSections.filter((s) => s.sites.length).map((s) => (
                  <div key={s.era} className="surface p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-[14px] font-semibold text-gold-200">{s.label}</h3>
                      <Badge tone="neutral">{s.sites.length} sites</Badge>
                    </div>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {s.sites.map((site) => (
                        <li key={site.slug}>
                          <Link href={l(`/heritage/${site.slug}`)} className="flex items-center justify-between gap-3 rounded-lg border border-white/7 bg-white/3 px-3 py-2.5 text-[12.5px] transition-colors hover:border-gold-600/35">
                            <span className="min-w-0 truncate text-ink-mid">{site.name}</span>
                            <span className="shrink-0 text-[10.5px] text-ink-faint">{site.access.replace(/_/g, ' ').toLowerCase()}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {eraSections.filter((s) => !s.sites.length).length > 0 && (
              <p className="mt-3 text-[11.5px] text-ink-faint">
                Eras listed for this governorate with no registry entry yet: {eraSections.filter((s) => !s.sites.length).map((s) => s.label).join(', ')}.
              </p>
            )}
          </section>

          {/* hidden heritage */}
          {hidden.length > 0 && (
            <InfoCard title="Hidden heritage" tone="gold" badge={<Badge tone="gold">{hidden.length}</Badge>}>
              <p className="mb-3">
                Sites here that sit outside ordinary itineraries. Access classifications are shown honestly — several require a
                permit from the competent authority and are not open to general visitors.
              </p>
              <ul className="grid gap-2">
                {hidden.map((h) => (
                  <li key={h.slug}>
                    <Link href={l(`/heritage/${h.slug}`)} className="flex items-center justify-between gap-3 text-[12.5px] text-ink-mid hover:text-gold-300">
                      <span>{h.name}</span>
                      <span className="text-[10.5px] text-ink-faint">{h.access.replace(/_/g, ' ').toLowerCase()}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}

          {/* services */}
          <section>
            <SectionHeader eyebrow="On the ground" title="Services in this governorate" sub="Providers registered against this governorate, with their platform verification state." />
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Stays', 'HOTEL', '/hotels'], ['Guides', 'GUIDE', '/guides'], ['Restaurants', 'RESTAURANT', '/restaurants'],
                ['Cafés', 'CAFE', '/cafes'], ['Transport', 'TRANSPORT', '/transport'], ['Car rental', 'CAR_RENTAL', '/car-rental'],
                ['Activities', 'ACTIVITY', '/activities'], ['Medical', 'MEDICAL', '/medical-tourism'],
                ['Tour operators', 'TOUR_OPERATOR', '/activities'], ['Craft retailers', 'RETAILER', '/wear-egypt'],
                ...(g.hasCoast ? [['Yachts & marinas', 'YACHT', '/yachts'] as const] : []),
              ].map(([label, type, hrefP]) => {
                const rows = byType(type as string);
                return (
                  <div key={label as string} className="surface p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[13.5px] font-semibold text-ink-hi">{label as string}</h3>
                      <Badge tone={rows.length ? 'ok' : 'neutral'}>{rows.length}</Badge>
                    </div>
                    {rows.length ? (
                      <>
                        <ul className="mt-2.5 grid gap-1.5">
                          {rows.slice(0, 3).map((p) => (
                            <li key={p.slug} className="truncate text-[12px] text-ink-low">
                              {p.name}
                              {p.priceFrom ? <span className="text-ink-faint"> · from {p.currency} {p.priceFrom}</span> : null}
                            </li>
                          ))}
                        </ul>
                        <Link href={l(hrefP as string)} className="mt-2.5 inline-flex text-[11.5px] text-gold-300 hover:underline">Open module →</Link>
                      </>
                    ) : (
                      <p className="mt-2 text-[11.5px] text-ink-faint">No provider registered in this governorate yet.</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* investment */}
          <section>
            <SectionHeader eyebrow="Invest" title="Investment in this governorate" sub={`${opportunities.length} indicative opportunities and ${properties.length} property records.`} href={l('/investment-opportunities')} hrefLabel="Opportunity registry" />
            {opportunities.length === 0 ? (
              <EmptyState body="No opportunity is catalogued here yet." />
            ) : (
              <CarouselRow ariaLabel={`Investment opportunities in ${g.name}`}>
                {opportunities.map((o) => (
                  <Link key={o.slug} href={l(`/investment-opportunities/${o.slug}`)} className="surface lift w-[268px] p-4">
                    <Badge tone="nile">{o.stage}</Badge>
                    <h3 className="mt-2.5 text-[13.5px] font-semibold text-ink-hi">{o.name}</h3>
                    <p className="mt-1.5 text-[11.5px] text-ink-faint">
                      USD {(o.investmentRangeUsd[0] / 1e6).toFixed(0)}–{(o.investmentRangeUsd[1] / 1e6).toFixed(0)}M
                    </p>
                    <p className="mt-1.5 line-clamp-2 text-[11.5px] text-ink-low">{o.competentEntity}</p>
                    <div className="mt-3"><SourceBadge status={o.sourceStatus} size="sm" /></div>
                  </Link>
                ))}
              </CarouselRow>
            )}
          </section>

          {/* events */}
          {events.length > 0 && (
            <InfoCard title="Events and festivals">
              <ul className="grid gap-2.5">
                {events.map((e) => (
                  <li key={e.slug} className="flex flex-wrap items-center justify-between gap-2 border-b border-white/6 pb-2.5 last:border-0">
                    <span className="text-[13px] text-ink-mid">{e.name}</span>
                    <span className="text-[11.5px] text-ink-faint">{e.startDate} → {e.endDate} · {e.venue}</span>
                  </li>
                ))}
              </ul>
              <Link href={l('/events')} className="mt-3 inline-flex text-[12px] text-gold-300 hover:underline">All events →</Link>
            </InfoCard>
          )}

          <Boundary points={[
            'Population, area and visitor figures on this page are demonstration values. Official statistics come from the competent statistics authority once that integration is connected.',
            'Access classifications describe what the registry records, not a guarantee of entry. Opening hours, ticketing and permits are set by the competent authority.',
            '"Verified" next to a provider means Egypt One checked submitted documents. It is not a government licence.',
            'Investment entries are indicative. Land allocation, licences and approvals are decided by the competent entity named on each opportunity.',
          ]} />
        </div>

        {/* rail */}
        <aside className="grid content-start gap-4">
          <InfoCard title="At a glance">
            <FactList rows={[
              ['Region', g.region],
              ['Capital', g.capital],
              ['Code', g.code],
              ['Area', `${g.areaKm2.toLocaleString()} km²`],
              ['Population', `≈ ${g.populationM}M (demo)`],
              ['On the Nile', g.hasNile ? 'Yes' : 'No'],
              ['Coastline', g.hasCoast ? 'Yes' : 'No'],
              ['Arabic name', g.nameAr ?? '—'],
            ]} />
          </InfoCard>

          <InfoCard title="Cities and towns"><ChipList items={g.cities} /></InfoCard>
          <InfoCard title="Local cuisine"><ChipList items={g.cuisine} tone="gold" /></InfoCard>
          <InfoCard title="Crafts and traditional dress"><ChipList items={g.crafts} /></InfoCard>
          <InfoCard title="Nature and landscape"><ChipList items={g.nature} /></InfoCard>
          <InfoCard title="Investment sectors"><ChipList items={g.investmentSectors} tone="gold" /></InfoCard>

          <InfoCard title="Tourism indicators" badge={<SourceBadge status="SIMULATED" size="sm" />}>
            <div className="grid gap-2.5">
              <Stat label="Annual visitors (demo)" value={g.metrics.annualVisitors.toLocaleString()} />
              <Stat label="Occupancy (demo)" value={`${g.metrics.occupancyPct}%`} tone="nile" />
              <Stat label="Hotels recorded" value={g.metrics.hotels} tone="neutral" />
              <Stat label="Guides recorded" value={g.metrics.guides} tone="neutral" />
            </div>
          </InfoCard>

          {products.length > 0 && (
            <InfoCard title={`Made in ${g.name}`}>
              <ul className="grid gap-1.5">
                {products.slice(0, 5).map((p) => (
                  <li key={p.slug} className="text-[12.5px] text-ink-low">{p.name} <span className="text-ink-faint">· EGP {p.priceEgp.toLocaleString()}</span></li>
                ))}
              </ul>
              <Link href={l('/wear-egypt')} className="mt-3 inline-flex text-[12px] text-gold-300 hover:underline">Wear Egypt collections →</Link>
            </InfoCard>
          )}

          <SourceNote status={g.sourceStatus} owner={g.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks
          locale={locale as Locale}
          links={[
            { href: '/governorates', label: 'All 27 governorates', body: 'Compare regions side by side.' },
            { href: '/egypt-through-time', label: 'Egypt through time', body: 'Place this governorate in the wider timeline.' },
            { href: '/heritage', label: 'Heritage registry', body: 'Every recorded site nationwide.' },
            { href: '/trip-builder', label: 'Build an itinerary', body: 'Route this governorate into a full trip.' },
          ]}
        />
      </div>
    </Page>
  );
}
