#!/usr/bin/env node
/** Emits the dynamic detail route templates ([slug] pages). */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'web', 'src', 'app', '[locale]');
const w = (route, body) => { const dir = join(root, route); mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, 'page.tsx'), body); };

const HEAD = `import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import { LOCALES, type Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, AccessBadge, Breadcrumbs, SectionHeader, SmartImage, subjectFor } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, Boundary, RelatedLinks, SourceNote, StepList } from '@/components/Module';
import { href as L } from '@/lib/locale';
`;

/* ---------------------------------------------------------------- heritage */
w('heritage/[slug]', `${HEAD}
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
        ...(gov ? [{ label: gov.name, href: l(\`/governorates/\${gov.slug}\`) }] : []),
        { label: h.name },
      ]} />

      <ModuleHero
        eyebrow={\`\${h.classification} · \${era?.name ?? h.era}\`}
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
            <InfoCard title={\`In context: \${era.name}\`}>
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
                    <Link href={l(\`/rulers-of-egypt/\${r.slug}\`)} className="flex items-center justify-between gap-3 rounded-lg border border-white/7 bg-white/3 px-3 py-2 text-[12.5px] hover:border-gold-600/35">
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
              <SectionHeader eyebrow={gov?.name ?? ''} title="Nearby in the registry" href={l(\`/governorates/\${h.governorateSlug}\`)} hrefLabel="Governorate page" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {nearby.map((n) => (
                  <Link key={n.slug} href={l(\`/heritage/\${n.slug}\`)} className="surface lift overflow-hidden p-0">
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
              ['Governorate', gov ? <Link href={l(\`/governorates/\${gov.slug}\`)} className="text-gold-300 hover:underline">{gov.name}</Link> : h.governorateSlug],
              ['Access', h.access.replace(/_/g, ' ').toLowerCase()],
              ['Restoration', (h.restorationStatus ?? 'NONE').replace(/_/g, ' ').toLowerCase()],
              ['Hidden heritage', h.hidden ? 'Yes' : 'No'],
              ['Coordinates', h.coordinates ? \`\${h.coordinates.lat.toFixed(2)}, \${h.coordinates.lng.toFixed(2)}\` : 'Not published'],
            ]} />
          </InfoCard>

          <InfoCard title="Accessibility"><ChipList items={h.accessibility ?? []} /></InfoCard>

          {museums.length > 0 && (
            <InfoCard title="Related collections">
              <ul className="grid gap-1.5">
                {museums.slice(0, 4).map((m) => (
                  <li key={m.slug}><Link href={l(\`/museums/\${m.slug}\`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{m.name}</Link></li>
                ))}
              </ul>
            </InfoCard>
          )}

          {guides.length > 0 && (
            <InfoCard title="Guides in this governorate">
              <ul className="grid gap-1.5">
                {guides.map((g) => (
                  <li key={g.slug}><Link href={l(\`/guides/\${g.slug}\`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{g.name}</Link></li>
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
`);

/* ----------------------------------------------------------------- museums */
w('museums/[slug]', `${HEAD}
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
        eyebrow={gov ? \`\${gov.name} · Museum\` : 'Museum'}
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
              <SectionHeader eyebrow="Context" title="Heritage sites in the same governorate" href={l(\`/governorates/\${m.governorateSlug}\`)} hrefLabel="Governorate page" />
              <ul className="grid gap-2 sm:grid-cols-2">
                {sites.map((s) => (
                  <li key={s.slug}>
                    <Link href={l(\`/heritage/\${s.slug}\`)} className="flex items-center justify-between gap-3 rounded-lg border border-white/7 bg-white/3 px-3 py-2.5 text-[12.5px] hover:border-gold-600/35">
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
              ['Governorate', gov ? <Link href={l(\`/governorates/\${gov.slug}\`)} className="text-gold-300 hover:underline">{gov.name}</Link> : m.governorateSlug],
              ['Opened', m.opened ?? '—'],
              ['Access', m.access.replace(/_/g, ' ').toLowerCase()],
              ['Highlights recorded', String(m.highlights.length)],
            ]} />
          </InfoCard>
          <InfoCard title="Other museums">
            <ul className="grid gap-1.5">
              {others.map((o) => (
                <li key={o.slug}><Link href={l(\`/museums/\${o.slug}\`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{o.name}</Link></li>
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
`);

/* ------------------------------------------------------------------ rulers */
w('rulers-of-egypt/[slug]', `${HEAD}
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
        eyebrow={\`\${era?.name ?? r.era} · \${r.dynasty ?? ''}\`}
        title={r.name}
        lead={\`\${r.reign}. \${r.achievements.join('. ')}.\`}
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
                    <Link href={l(\`/heritage/\${s.slug}\`)} className="flex items-center justify-between gap-3 rounded-lg border border-white/7 bg-white/3 px-3 py-2.5 text-[12.5px] hover:border-gold-600/35">
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
                  <li key={c.slug}><Link href={l(\`/rulers-of-egypt/\${c.slug}\`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{c.name}</Link></li>
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
`);

/* --------------------------------------------------------------- egypt 195 */
w('egypt-195/[country]', `${HEAD}
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => db.countries.all().map((c) => ({ locale, country: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const c = db.countries.bySlug(country);
  return c ? { title: \`Egypt from \${c.name}\`, description: c.summary } : { title: 'Country not found' };
}

export default async function CountryGateway({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale, country } = await params;
  const c = db.countries.bySlug(country);
  if (!c) notFound();
  const l = (p: string) => L(locale as Locale, p);
  const sameRegion = db.countries.byRegion(c.region).filter((x) => x.slug !== c.slug).slice(0, 12);

  return (
    <Page wide>
      <Breadcrumbs items={[{ label: 'Home', href: l('/') }, { label: 'Egypt 195', href: l('/egypt-195') }, { label: c.name }]} />
      <ModuleHero
        eyebrow={\`\${c.region} · Country gateway\`}
        title={\`Egypt from \${c.name}\`}
        lead={\`Routes, connectivity, entry guidance and where to verify official information for travellers, investors and researchers coming from \${c.name}.\`}
        seed={c.slug}
        subject="modern"
        badges={<><Badge tone="nile">{c.iso2}</Badge><SourceBadge status={c.sourceStatus} owner={c.sourceOwner} /></>}
        actions={[{ href: l('/trip-builder'), label: 'Plan a trip', primary: true }, { href: l('/visa'), label: 'Visa & entry guidance' }, { href: l('/invest'), label: 'Investor portal' }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="Entry requirements" tone="warn">
            <p>{c.visaRoute}</p>
            <p className="mt-3">
              Egypt One does not issue, approve or confirm any entry permission. Requirements depend on nationality, purpose,
              route and current policy, and they change. The visa and entry integration with the competent authority is not
              connected in this prototype, so nothing on this page is an official answer.
            </p>
            <Link href={l('/visa')} className="mt-3 inline-flex text-[12.5px] text-gold-300 hover:underline">Open the visa and entry module →</Link>
          </InfoCard>

          <InfoCard title="Diplomatic missions" tone="warn">
            <p>{c.missionNote}</p>
            <p className="mt-3 text-[12px] text-ink-faint">
              Mission addresses, contact details and consular hours must come from the official Ministry of Foreign Affairs
              directory. That exchange is a planned integration and is not connected.
            </p>
          </InfoCard>

          <InfoCard title="Suggested routes">
            <p className="mb-3">A starting shape for a first visit from {c.name}. Refine it in the trip builder with your dates, budget and interests.</p>
            <StepList steps={c.suggestedRoutes.map((r, i) => ({
              title: \`Stop \${i + 1}: \${r}\`,
              body: 'Editorial suggestion based on typical routing, not a booked or priced product.',
            }))} />
          </InfoCard>

          <InfoCard title="Air connectivity">
            {c.directFlights.length ? (
              <>
                <ChipList items={c.directFlights} tone="gold" />
                <p className="mt-3 text-[12px] text-ink-faint">
                  Illustrative gateway airports, not a schedule. No airline distribution adapter is connected, so no route,
                  fare or frequency here is live.
                </p>
              </>
            ) : (
              <p>No direct connectivity is recorded for {c.name} in this demonstration dataset. Most journeys route through a regional hub.</p>
            )}
          </InfoCard>

          <Boundary points={[
            'Embassy, visa and entry information on this page is demonstration content pending an official integration.',
            'Flight connectivity is illustrative and is not a timetable.',
            'Currency and language are reference fields, not travel advice.',
            'Campaigns, packages and cooperation programmes activate only under signed agreements.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Country reference">
            <FactList rows={[
              ['Region', c.region],
              ['ISO code', c.iso2],
              ['Currency', c.currency],
              ['Primary language', c.language],
              ['Mission listed in demo set', c.hasEgyptianMission ? 'Yes' : 'No'],
            ]} />
          </InfoCard>
          <InfoCard title={\`Other gateways in \${c.region}\`}>
            <div className="flex flex-wrap gap-1.5">
              {sameRegion.map((o) => (
                <Link key={o.slug} href={l(\`/egypt-195/\${o.slug}\`)} className="rounded-full border border-white/10 px-2.5 py-1 text-[11.5px] text-ink-mid hover:border-gold-600/40 hover:text-gold-300">
                  {o.name}
                </Link>
              ))}
            </div>
          </InfoCard>
          <SourceNote status={c.sourceStatus} owner={c.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/egypt-195', label: 'All 195 gateways', body: 'Every country.' },
          { href: '/governorates', label: 'Governorates', body: 'Where to go.' },
          { href: '/safety', label: 'Safety centre', body: 'Support while here.' },
          { href: '/medical-tourism', label: 'Medical tourism', body: 'Health journeys.' },
        ]} />
      </div>
    </Page>
  );
}
`);

/* ------------------------------------------------------------ destinations */
w('destinations/[slug]', `${HEAD}
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
        ...(gov ? [{ label: gov.name, href: l(\`/governorates/\${gov.slug}\`) }] : []),
        { label: d.name },
      ]} />
      <ModuleHero
        eyebrow={\`\${gov?.name ?? ''} · \${d.category}\`}
        title={d.name}
        lead={d.description ?? d.summary ?? ''}
        seed={d.slug}
        subject={subjectFor([d.category], d.name)}
        badges={<><Badge tone="gold">{d.category}</Badge><SourceBadge status={d.sourceStatus} owner={d.sourceOwner} /></>}
        actions={[{ href: l('/trip-builder'), label: 'Add to a trip', primary: true }, ...(gov ? [{ href: l(\`/governorates/\${gov.slug}\`), label: \`All of \${gov.name}\` }] : [])]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          {heritage.length > 0 && (
            <section>
              <SectionHeader eyebrow="Nearby" title="Heritage in this governorate" href={l('/heritage')} hrefLabel="Registry" />
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {heritage.map((h) => (
                  <Link key={h.slug} href={l(\`/heritage/\${h.slug}\`)} className="surface lift overflow-hidden p-0">
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
            'Access to any heritage site listed here follows that site\\u2019s own classification and the authority\\u2019s rules.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Record">
            <FactList rows={[
              ['Category', d.category],
              ['Governorate', gov ? <Link href={l(\`/governorates/\${gov.slug}\`)} className="text-gold-300 hover:underline">{gov.name}</Link> : d.governorateSlug],
              ['Best season', d.bestSeason ?? '—'],
              ['Coordinates', d.coordinates ? \`\${d.coordinates.lat.toFixed(2)}, \${d.coordinates.lng.toFixed(2)}\` : 'Not published'],
            ]} />
          </InfoCard>
          {nearby.length > 0 && (
            <InfoCard title="Other places nearby">
              <ul className="grid gap-1.5">
                {nearby.map((n) => (
                  <li key={n.slug}><Link href={l(\`/destinations/\${n.slug}\`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{n.name}</Link></li>
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
`);

/* ----------------------------------------------------------------- guides */
w('guides/[slug]', `${HEAD}
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => db.providers.byType('GUIDE').map((g) => ({ locale, slug: g.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = db.providers.bySlug(slug);
  return g ? { title: g.name, description: g.summary } : { title: 'Guide not found' };
}

export default async function GuideDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const g = db.providers.bySlug(slug);
  if (!g || g.type !== 'GUIDE') notFound();
  const l = (p: string) => L(locale as Locale, p);
  const gov = db.governorates.bySlug(g.governorateSlug);
  const peers = db.providers.byGovernorate(g.governorateSlug).filter((p) => p.type === 'GUIDE' && p.slug !== g.slug).slice(0, 5);
  const sites = db.heritage.byGovernorate(g.governorateSlug).filter((h) => h.access === 'OPEN').slice(0, 6);
  const verified = g.verification === 'VERIFIED';

  return (
    <Page wide>
      <Breadcrumbs items={[{ label: 'Home', href: l('/') }, { label: 'Guides', href: l('/guides') }, { label: g.name }]} />
      <ModuleHero
        eyebrow={\`\${gov?.name ?? ''} · Guide\`}
        title={g.name}
        lead={\`\${(g.specialties ?? []).join(', ')}\${g.specialties?.length ? '. ' : ''}Working in \${(g.languages ?? []).join(', ')}.\`}
        seed={g.slug}
        subject="city"
        badges={<>
          <Badge tone={verified ? 'ok' : 'warn'}>{verified ? 'Verified on platform' : 'Verification in review'}</Badge>
          {g.rating && <Badge tone="gold">★ {g.rating} · {g.reviewCount} reviews</Badge>}
          <SourceBadge status={g.sourceStatus} owner={g.sourceOwner} />
        </>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="What verification means here" tone={verified ? 'neutral' : 'warn'}>
            <p>
              {verified
                ? 'Egypt One has checked the documents this guide submitted during onboarding. That is a platform check on submitted evidence.'
                : 'This guide’s documents are still in review. Nothing about their credentials is being asserted.'}
            </p>
            <p className="mt-3">
              It is <strong className="text-ink-hi">not</strong> a government tourist-guide licence. Licensing is issued by the
              competent authority, and this platform never describes anyone as officially licensed without a verification record
              tied to that authority.
            </p>
          </InfoCard>

          <InfoCard title="Languages and specialties">
            <div className="grid gap-4">
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">Languages</div>
                <ChipList items={g.languages ?? []} tone="gold" />
              </div>
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">Specialties</div>
                <ChipList items={g.specialties ?? []} />
              </div>
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">Accessibility support</div>
                <ChipList items={g.accessibility ?? []} />
              </div>
            </div>
          </InfoCard>

          {sites.length > 0 && (
            <section>
              <SectionHeader eyebrow={gov?.name ?? ''} title="Sites in this governorate" href={l('/heritage')} hrefLabel="Registry" />
              <ul className="grid gap-2 sm:grid-cols-2">
                {sites.map((s) => (
                  <li key={s.slug}>
                    <Link href={l(\`/heritage/\${s.slug}\`)} className="block rounded-lg border border-white/7 bg-white/3 px-3 py-2.5 text-[12.5px] text-ink-mid hover:border-gold-600/35">{s.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Boundary points={[
            'Availability shown is indicative. Confirmed booking requires a connected provider adapter, and none is live in this prototype.',
            'Personal contact details are never exposed by the platform or the AI Concierge.',
            'Ratings and review counts here are demonstration values.',
            'Payment for a booking would run through a licensed payment service provider, with a contractual platform share — never a hidden one.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Booking">
            <FactList rows={[
              ['Base governorate', gov ? <Link href={l(\`/governorates/\${gov.slug}\`)} className="text-gold-300 hover:underline">{gov.name}</Link> : g.governorateSlug],
              ['Indicative rate', g.priceFrom ? \`from \${g.currency} \${g.priceFrom} / day\` : '—'],
              ['Availability', (g.availability ?? []).join(', ') || '—'],
              ['Verification', verified ? 'Verified on platform' : 'In review'],
            ]} />
            <div className="mt-4 rounded-lg border border-warn/30 bg-warn/6 px-3 py-2.5 text-[11.5px] text-ink-mid">
              No booking adapter is connected, so a request here would be recorded as a draft only.
            </div>
            <Link href={l('/trip-builder')} className="mt-3 inline-flex w-full justify-center rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 px-4 py-2.5 text-[13px] font-semibold text-[#0a1017]">
              Add to a trip
            </Link>
          </InfoCard>

          {peers.length > 0 && (
            <InfoCard title="Other guides here">
              <ul className="grid gap-1.5">
                {peers.map((p) => (
                  <li key={p.slug}>
                    <Link href={l(\`/guides/\${p.slug}\`)} className="text-[12.5px] text-ink-low hover:text-gold-300">
                      {p.name} <span className="text-ink-faint">· {(p.languages ?? []).slice(0, 2).join(', ')}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}
          <SourceNote status={g.sourceStatus} owner={g.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/guides', label: 'All guides', body: 'Filter by language.' },
          { href: '/activities', label: 'Activities', body: 'Guided experiences.' },
          { href: '/provider', label: 'Provider portal', body: 'Register as a guide.' },
          { href: '/reviews', label: 'Reviews', body: 'Traveller feedback.' },
        ]} />
      </div>
    </Page>
  );
}
`);

/* --------------------------------------------------------- opportunity detail */
w('investment-opportunities/[slug]', `${HEAD}
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => db.investment.all().map((o) => ({ locale, slug: o.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const o = db.investment.bySlug(slug);
  return o ? { title: o.name, description: o.summary } : { title: 'Opportunity not found' };
}

export default async function OpportunityDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const o = db.investment.bySlug(slug);
  if (!o) notFound();
  const l = (p: string) => L(locale as Locale, p);
  const gov = db.governorates.bySlug(o.governorateSlug);
  const peers = db.investment.bySector(o.sector).filter((x) => x.slug !== o.slug).slice(0, 5);
  const properties = db.properties.all().filter((p) => p.governorateSlug === o.governorateSlug).slice(0, 4);

  return (
    <Page wide>
      <Breadcrumbs items={[
        { label: 'Home', href: l('/') }, { label: 'Invest', href: l('/invest') },
        { label: 'Opportunities', href: l('/investment-opportunities') }, { label: o.name },
      ]} />
      <ModuleHero
        eyebrow={\`\${o.sector} · \${gov?.name ?? ''}\`}
        title={o.name}
        lead={o.description ?? o.summary ?? ''}
        seed={o.slug}
        subject="modern"
        badges={<><Badge tone="nile">{o.stage.replace(/_/g, ' ')}</Badge><Badge tone="gold">USD {(o.investmentRangeUsd[0] / 1e6).toFixed(0)}–{(o.investmentRangeUsd[1] / 1e6).toFixed(0)}M</Badge><SourceBadge status={o.sourceStatus} owner={o.sourceOwner} /></>}
        actions={[{ href: l('/invest#contact'), label: 'Request a meeting', primary: true }, { href: l('/business-setup'), label: 'Business setup navigator' }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="Who decides" tone="warn">
            <p>
              The competent entity for this opportunity is <strong className="text-ink-hi">{o.competentEntity}</strong>.
              Land allocation, licensing, incentives and approvals are theirs to grant. Egypt One coordinates, documents and
              routes enquiries — it does not allocate, approve or guarantee anything.
            </p>
          </InfoCard>

          <InfoCard title="Restrictions and conditions">
            <ul className="grid gap-2">
              {o.restrictions.map((r, i) => (
                <li key={i} className="flex gap-2.5"><span className="mt-[3px] text-warn" aria-hidden="true">◆</span><span>{r}</span></li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Demand signals" badge={<SourceBadge status="SIMULATED" size="sm" />}>
            <ul className="grid gap-2">
              {o.demandSignals.map((s, i) => (
                <li key={i} className="flex gap-2.5"><span className="mt-[3px] text-turquoise" aria-hidden="true">◆</span><span>{s}</span></li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] text-ink-faint">
              These indicators come from the platform’s synthetic demonstration dataset. They are not official statistics and
              must not be used as the basis for a decision.
            </p>
          </InfoCard>

          <InfoCard title="Risks" tone="danger">
            <ul className="grid gap-2">
              {o.risks.map((r, i) => (
                <li key={i} className="flex gap-2.5"><span className="mt-[3px] text-danger" aria-hidden="true">◆</span><span>{r}</span></li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Supporting documents">
            <ul className="grid gap-2">
              {o.documents.map((d, i) => (
                <li key={i} className="flex items-center justify-between gap-3 border-b border-white/6 pb-2 last:border-0">
                  <span className="text-[13px] text-ink-mid">{d.title}</span>
                  <SourceBadge status={d.sourceStatus as never} size="sm" />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] text-ink-faint">
              Documents marked as a planned integration are not available. The official pack is obtained from the competent entity.
            </p>
          </InfoCard>

          <Boundary points={[
            'This is not an offer, an allocation, an approval or a guaranteed return.',
            'Egypt One does not provide regulated financial or legal advice. Commission an independent study and take Egyptian legal advice.',
            'Investment lead handling is contractual; no fee is charged to an investor for making an enquiry in this prototype.',
            'Every figure on this page is demonstration or synthetic data.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Opportunity record">
            <FactList rows={[
              ['Sector', o.sector],
              ['Stage', o.stage.replace(/_/g, ' ').toLowerCase()],
              ['Governorate', gov ? <Link href={l(\`/governorates/\${gov.slug}\`)} className="text-gold-300 hover:underline">{gov.name}</Link> : o.governorateSlug],
              ['Ticket size', \`USD \${o.investmentRangeUsd[0].toLocaleString()} – \${o.investmentRangeUsd[1].toLocaleString()}\`],
              ['Land requirement', o.landRequirementHa ? \`\${o.landRequirementHa} ha\` : 'Not specified'],
              ['Competent entity', o.competentEntity],
            ]} />
          </InfoCard>

          {properties.length > 0 && (
            <InfoCard title="Property in this governorate">
              <ul className="grid gap-1.5">
                {properties.map((p) => (
                  <li key={p.slug} className="text-[12.5px] text-ink-low">{p.name}</li>
                ))}
              </ul>
              <Link href={l('/real-estate')} className="mt-3 inline-flex text-[12px] text-gold-300 hover:underline">Real estate module →</Link>
            </InfoCard>
          )}

          {peers.length > 0 && (
            <InfoCard title={\`Other \${o.sector} opportunities\`}>
              <ul className="grid gap-1.5">
                {peers.map((p) => (
                  <li key={p.slug}><Link href={l(\`/investment-opportunities/\${p.slug}\`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{p.name}</Link></li>
                ))}
              </ul>
            </InfoCard>
          )}
          <SourceNote status={o.sourceStatus} owner={o.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/investment-opportunities', label: 'Opportunity registry', body: 'All sectors.' },
          { href: '/invest', label: 'Investor portal', body: 'Analysis and filters.' },
          { href: '/business-setup', label: 'Business setup', body: 'Establishing the entity.' },
          { href: '/government/investment', label: 'Government view', body: 'Lead pipeline.' },
        ]} />
      </div>
    </Page>
  );
}
`);

/* ---------------------------------------------------- attractions / cities / villages */
w('attractions/[slug]', `${HEAD}
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
        eyebrow={\`\${gov?.name ?? ''} · Attraction\`}
        title={rec.name}
        lead={rec.description ?? rec.summary ?? ''}
        seed={rec.slug}
        subject={subjectFor(rec.tags ?? [], rec.name)}
        badges={<>{heritage && <AccessBadge access={heritage.access} />}<SourceBadge status={rec.sourceStatus} owner={rec.sourceOwner} /></>}
        actions={[
          ...(heritage ? [{ href: l(\`/heritage/\${heritage.slug}\`), label: 'Full heritage record', primary: true }] : []),
          ...(dest ? [{ href: l(\`/destinations/\${dest.slug}\`), label: 'Destination page' }] : []),
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
                  <li key={a.slug} className="text-[12.5px] text-ink-low">{a.name}{a.priceFrom ? \` · from \${a.currency} \${a.priceFrom}\` : ''}</li>
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
              ['Governorate', gov ? <Link href={l(\`/governorates/\${gov.slug}\`)} className="text-gold-300 hover:underline">{gov.name}</Link> : rec.governorateSlug],
              ['Type', heritage ? heritage.classification : dest?.category ?? '—'],
              ['Access', heritage ? heritage.access.replace(/_/g, ' ').toLowerCase() : 'Not classified'],
            ]} />
          </InfoCard>
          {guides.length > 0 && (
            <InfoCard title="Guides nearby">
              <ul className="grid gap-1.5">
                {guides.map((g) => (
                  <li key={g.slug}><Link href={l(\`/guides/\${g.slug}\`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{g.name}</Link></li>
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
`);

const placeTpl = (kind, plural) => `${HEAD}
export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const g of db.governorates.all()) for (const c of g.${kind === 'city' ? 'cities' : 'cities'}) slugs.add(\`\${g.slug}-\${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}\`);
  return LOCALES.flatMap((locale) => [...slugs].map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.split('-').slice(1).join(' ').replace(/\\b\\w/g, (c) => c.toUpperCase()) };
}

/** ${plural} template. One route serves every ${kind} recorded against a governorate. */
export default async function ${kind === 'city' ? 'City' : 'Village'}Detail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = (p: string) => L(locale as Locale, p);
  const gov = db.governorates.all().find((g) => slug.startsWith(g.slug + '-'));
  if (!gov) notFound();
  const raw = slug.slice(gov.slug.length + 1);
  const name = gov.cities.find((c) => c.toLowerCase().replace(/[^a-z0-9]+/g, '-') === raw);
  if (!name) notFound();

  const heritage = db.heritage.byGovernorate(gov.slug).slice(0, 6);
  const providers = db.providers.byGovernorate(gov.slug);
  const events = db.events.byGovernorate(gov.slug);

  return (
    <Page wide>
      <Breadcrumbs items={[
        { label: 'Home', href: l('/') }, { label: 'Governorates', href: l('/governorates') },
        { label: gov.name, href: l(\`/governorates/\${gov.slug}\`) }, { label: name },
      ]} />
      <ModuleHero
        eyebrow={\`\${gov.name} · ${plural.slice(0, -1)}\`}
        title={name}
        lead={\`\${name} is recorded in the Egypt One geography model under \${gov.name} governorate, in the \${gov.region} region. Heritage, providers, events and investment for this area are indexed against the governorate.\`}
        seed={slug}
        subject={gov.hasCoast ? 'sea' : gov.hasNile ? 'nile' : 'desert'}
        badges={<><Badge tone="gold">{gov.region}</Badge><SourceBadge status={gov.sourceStatus} owner={gov.sourceOwner} /></>}
        actions={[{ href: l(\`/governorates/\${gov.slug}\`), label: \`All of \${gov.name}\`, primary: true }, { href: l('/trip-builder'), label: 'Plan a trip' }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="What is recorded here">
            <p>
              The prototype models geography as governorate → city → village → district. Detailed local records for {name} are
              added through the CMS as they are verified; until then this page inherits from {gov.name} rather than inventing
              local content.
            </p>
          </InfoCard>
          {heritage.length > 0 && (
            <InfoCard title={\`Heritage across \${gov.name}\`}>
              <ul className="grid gap-1.5">
                {heritage.map((h) => (
                  <li key={h.slug}><Link href={l(\`/heritage/\${h.slug}\`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{h.name}</Link></li>
                ))}
              </ul>
            </InfoCard>
          )}
          {events.length > 0 && (
            <InfoCard title="Events in this governorate">
              <ul className="grid gap-1.5">
                {events.map((e) => <li key={e.slug} className="text-[12.5px] text-ink-low">{e.name} · {e.startDate}</li>)}
              </ul>
            </InfoCard>
          )}
          <Boundary points={[
            'Local-level content is inherited from the governorate record rather than fabricated.',
            'Administrative boundaries follow the official governorate structure.',
          ]} />
        </div>
        <aside className="grid content-start gap-4">
          <InfoCard title="Governorate context">
            <FactList rows={[
              ['Governorate', <Link href={l(\`/governorates/\${gov.slug}\`)} className="text-gold-300 hover:underline">{gov.name}</Link>],
              ['Region', gov.region],
              ['Capital', gov.capital],
              ['Providers recorded', String(providers.length)],
            ]} />
          </InfoCard>
          <InfoCard title="Other places here">
            <div className="flex flex-wrap gap-1.5">
              {gov.cities.filter((c) => c !== name).map((c) => (
                <Link key={c} href={l(\`/${kind === 'city' ? 'cities' : 'villages'}/\${gov.slug}-\${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}\`)} className="rounded-full border border-white/10 px-2.5 py-1 text-[11.5px] text-ink-mid hover:border-gold-600/40 hover:text-gold-300">{c}</Link>
              ))}
            </div>
          </InfoCard>
          <SourceNote status={gov.sourceStatus} owner={gov.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: \`/governorates/\${gov.slug}\`, label: gov.name, body: 'The governorate page.' },
          { href: '/governorates', label: 'All governorates', body: 'Browse Egypt.' },
          { href: '/rural-egypt', label: 'Rural Egypt', body: 'Village life and farms.' },
          { href: '/map', label: 'Map', body: 'See it in place.' },
        ]} />
      </div>
    </Page>
  );
}
`;

w('cities/[slug]', placeTpl('city', 'Cities'));
w('villages/[slug]', placeTpl('village', 'Villages'));

console.log('wrote 10 detail routes');
