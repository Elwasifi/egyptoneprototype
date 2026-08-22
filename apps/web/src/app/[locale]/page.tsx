import Link from 'next/link';
import { db } from '@egypt-one/database';
import { getMessages, type Locale } from '@egypt-one/i18n';
import {
  Logo, Badge, Card, Stat, SourceBadge, GoldRule,
  SectionHeader, CarouselRow, DiscoveryCard, GovernorateCard, HeritageCard, ProviderCard,
  SmartImage, CinematicHero, subjectFor, BarStrip, Donut, Trend,
} from '@egypt-one/ui';
import { Container, Section } from '@/components/Container';
import { HeroSearch } from '@/components/HeroSearch';
import { href as L } from '@/lib/locale';
import { TRUST_ITEMS } from '@/lib/trust';

const QUICK = [
  { href: '/hotels', label: 'Hotels', icon: '⌂' }, { href: '/flights', label: 'Flights', icon: '✈' },
  { href: '/activities', label: 'Attractions', icon: '◈' }, { href: '/cruises', label: 'Nile cruises', icon: '⛵' },
  { href: '/guides', label: 'Guides', icon: '☺' }, { href: '/transport', label: 'Transport', icon: '⇄' },
  { href: '/restaurants', label: 'Food', icon: '❉' }, { href: '/events', label: 'Events', icon: '♪' },
  { href: '/wear-egypt', label: 'Shopping', icon: '◍' }, { href: '/medical-tourism', label: 'Health', icon: '✚' },
  { href: '/invest', label: 'Invest', icon: '◆' }, { href: '/discover', label: 'More', icon: '⋯' },
];

const MODULES = [
  { href: '/entertainment-investment', title: 'Entertainment investment', body: 'Theme parks, water parks, marinas, arenas, live entertainment and leisure districts.', cta: 'Explore opportunities', tone: 'royal' },
  { href: '/real-estate', title: 'Real estate & living', body: 'Residential, commercial and hospitality property, plus what ownership actually requires.', cta: 'Explore property', tone: 'nile' },
  { href: '/medical-tourism', title: 'Health & wellness', body: 'Hospitals, clinics, specialists and wellness journeys with elevated privacy protection.', cta: 'Find providers', tone: 'emerald' },
  { href: '/research', title: 'Research & education', body: 'Universities, Egyptology programmes, archives and academic partnerships.', cta: 'Explore programmes', tone: 'gold' },
  { href: '/rural-egypt', title: 'Rural Egypt', body: 'Village stays, farms, crafts and the parts of the country most itineraries miss.', cta: 'Discover rural Egypt', tone: 'emerald' },
  { href: '/know-your-origin', title: 'Know your origin', body: 'An educational and research concept about ancestry, built with strict consent boundaries.', cta: 'Read the boundaries', tone: 'royal' },
];

const TONE: Record<string, string> = {
  gold: 'border-gold-600/28 from-gold-600/12',
  nile: 'border-nile/32 from-nile/14',
  royal: 'border-royal/38 from-royal/16',
  emerald: 'border-emerald/32 from-emerald/14',
};

function subjectForOffer(kind: string) {
  const map: Record<string, string> = { stopover: 'city', extend: 'temple', challenge: 'desert', pass: 'modern', seasonal: 'temple', rural: 'rural', dive: 'sea', family: 'museum' };
  return (map[kind] ?? 'generic') as never;
}

const INVESTMENT_CATEGORIES: { label: string; icon: string; href: string; status: 'DEMO' | 'PLANNED' }[] = [
  { label: 'Real Estate', icon: '◫', href: '/real-estate', status: 'DEMO' },
  { label: 'Land & Development', icon: '◧', href: '/investment-opportunities', status: 'DEMO' },
  { label: 'Tourism Investment', icon: '◆', href: '/tourism-investment', status: 'DEMO' },
  { label: 'Business Setup', icon: '⬡', href: '/business-setup', status: 'DEMO' },
  { label: 'Industrial Opportunities', icon: '◩', href: '/investment-opportunities', status: 'PLANNED' },
  { label: 'Long-Term Residency', icon: '◈', href: '/visa', status: 'PLANNED' },
  { label: 'Government Services', icon: '⛨', href: '/government', status: 'PLANNED' },
];

const PROGRAMME_TILES = [
  { slug: 'egypt-one-pass', icon: '♛', tone: 'gold', cta: 'Join the Pass' },
  { slug: 'visit-all-27-challenge', icon: '◈', tone: 'royal', cta: 'Start the challenge' },
  { slug: 'stopover-egypt', icon: '✈', tone: 'nile', cta: 'Plan a stopover' },
  { slug: 'one-more-night', icon: '☾', tone: 'emerald', cta: 'Extend your stay' },
] as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = getMessages(locale as Locale);
  const t = (k: string) => m[k] ?? k;
  const l = (p: string) => L(locale as Locale, p);

  const govs = db.governorates.all();
  const eras = db.eras.all();
  const heritage = db.heritage.all();
  const museums = db.museums.all();
  const guides = db.providers.byType('GUIDE');
  const events = db.events.all();
  const opps = db.investment.all();
  const products = db.products.all();
  const offers = db.offers.all();
  const metrics = db.metrics();
  const integrations = db.integrations.all();

  const featuredGovs = ['cairo', 'giza', 'luxor', 'aswan', 'red-sea', 'south-sinai', 'alexandria', 'matrouh']
    .map((s) => db.governorates.bySlug(s)!)
    .filter(Boolean);

  return (
    <main id="main">
      {/* ---------------------------------------------------------------- hero */}
      <Section className="pt-6 sm:pt-8">
        <Container wide>
          <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="surface relative overflow-hidden p-0">
              <div className="absolute inset-0">
                <CinematicHero alt="Cinematic view of the Giza pyramids and sphinx at dusk" className="h-full w-full" />
              </div>
              <div className="relative px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
                <Badge tone="gold">{t('brand.tagline')}</Badge>
                <h1 className="mt-4 max-w-2xl text-[36px] font-semibold leading-[1.06] sm:text-[52px] lg:text-[60px]">
                  {t('hero.title.a')}
                  <span className="mt-1 block italic gold-text" style={{ fontFamily: 'var(--font-display)' }}>{t('hero.title.b')}</span>
                </h1>
                <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-ink-mid">{t('hero.subtitle')}</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <Link href={l('/discover')} className="rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 px-5 py-3 text-[13.5px] font-semibold text-[#0a1017]">{t('hero.cta.explore')}</Link>
                  <Link href={l('/trip-builder')} className="rounded-lg border border-gold-600/45 px-5 py-3 text-[13.5px] font-semibold text-gold-300 hover:bg-gold-600/12">{t('hero.cta.plan')}</Link>
                  <Link href={l('/ai')} className="rounded-lg border border-white/12 px-5 py-3 text-[13.5px] font-semibold text-ink-hi hover:bg-white/6">✦ {t('hero.cta.ask')}</Link>
                  <Link href={l('/invest')} className="rounded-lg border border-white/12 px-5 py-3 text-[13.5px] font-semibold text-ink-hi hover:bg-white/6">{t('hero.cta.invest')}</Link>
                </div>
                <div className="mt-8 max-w-4xl">
                  <HeroSearch
                    locale={locale as Locale}
                    messages={m}
                    popular={[
                      { label: 'Pyramids', href: '/destinations/pyramids-of-giza' },
                      { label: 'Nile cruise', href: '/cruises' },
                      { label: 'Red Sea', href: '/sea' },
                      { label: 'Luxor', href: '/governorates/luxor' },
                      { label: 'Aswan', href: '/governorates/aswan' },
                      { label: 'Siwa Oasis', href: '/destinations/siwa-oasis' },
                      { label: 'Cairo', href: '/governorates/cairo' },
                      { label: 'Alexandria', href: '/governorates/alexandria' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <aside className="grid content-start gap-4" aria-label="Your context">
              <Card gold>
                <div className="flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold text-gold-200">{t('section.egypt195')}</h2>
                  <Badge tone="gold">{db.countries.count()}</Badge>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-low">{t('section.egypt195.sub')}</p>
                <Link href={l('/egypt-195')} className="mt-4 inline-flex rounded-lg bg-gold-500/90 px-3.5 py-2 text-[12.5px] font-semibold text-[#0a1017] hover:bg-gold-400">Choose your country →</Link>
              </Card>

              <div className="surface lift overflow-hidden p-0">
                <SmartImage seed="trip-builder-sample" subject="nile" alt="Sample Egypt itinerary" ratio="16/9" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-ink-hi">Start a trip</h2>
                    <SourceBadge status="DEMO" size="sm" />
                  </div>
                  <p className="mt-1.5 text-[12px] text-ink-low">Answer a few questions and preview a sample day-by-day itinerary you can edit.</p>
                  <Link href={l('/trip-builder')} className="mt-3 inline-flex rounded-lg border border-gold-600/40 px-3.5 py-2 text-[12.5px] font-medium text-gold-300 hover:bg-gold-600/12">Open the trip builder →</Link>
                </div>
              </div>

              <div className="surface lift overflow-hidden p-0">
                <SmartImage seed={events[0]?.slug ?? 'next-event'} subject={subjectFor([events[0]?.category ?? '', events[0]?.venue ?? ''], events[0]?.name ?? '')} alt={events[0]?.name ?? 'Upcoming event'} ratio="16/9" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-ink-hi">Next event</h2>
                    <SourceBadge status="DEMO" size="sm" />
                  </div>
                  <div className="mt-2 text-[13px] text-gold-200">{events[0]?.name}</div>
                  <div className="mt-1 text-[11.5px] text-ink-faint">{events[0]?.startDate} → {events[0]?.endDate} · {events[0]?.venue}</div>
                  <Link href={l('/events')} className="mt-3 inline-flex text-[12px] text-gold-300 hover:underline">All events →</Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ quick actions */}
      <Container wide>
        <nav aria-label="Quick actions" className="surface grid grid-cols-4 gap-1 p-2 sm:grid-cols-6 lg:grid-cols-12">
          {QUICK.map((q) => (
            <Link key={q.href + q.label} href={l(q.href)} className="flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-center transition-colors hover:bg-white/6">
              <span aria-hidden="true" className="text-[17px] text-gold-400">{q.icon}</span>
              <span className="text-[11px] leading-tight text-ink-mid">{q.label}</span>
            </Link>
          ))}
        </nav>
      </Container>

      {/* ------------------------------------------------------------ governorates */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow="Discover Egypt" title={t('section.governorates')} sub={t('section.governorates.sub')} href={l('/governorates')} hrefLabel={t('nav.viewAll')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredGovs.map((g) => (
              <Link key={g.slug} href={l(`/governorates/${g.slug}`)} className="surface lift group block overflow-hidden p-0">
                <SmartImage seed={g.slug} subject={g.hasCoast ? 'sea' : g.hasNile ? 'nile' : 'desert'} alt={`${g.name} governorate`} ratio="16/9" />
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[16px] font-semibold text-ink-hi group-hover:text-gold-200">{g.name}</h3>
                    <span className="text-[11px] text-ink-faint">{g.region}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-low">Capital {g.capital} · {g.metrics.heritageSites} heritage sites</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {g.highlights.slice(0, 2).map((h) => <Badge key={h} tone="gold">{h}</Badge>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {govs.map((g) => (
              <Link key={g.slug} href={l(`/governorates/${g.slug}`)} className="rounded-full border border-white/9 px-3 py-1.5 text-[11.5px] text-ink-low transition-colors hover:border-gold-600/40 hover:text-gold-300">
                {g.name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- through time */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow="Heritage" title={t('section.time')} sub={t('section.time.sub')} href={l('/egypt-through-time')} hrefLabel="Explore the timeline" />
          <div className="surface p-5">
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
              {eras.map((e) => (
                <li key={e.key}>
                  <Link href={l(`/egypt-through-time#${e.key.toLowerCase()}`)} className="block rounded-xl border border-white/8 bg-white/3 p-3.5 transition-colors hover:border-gold-600/35">
                    <span className="block h-1 w-10 rounded-full" style={{ background: e.colour }} aria-hidden="true" />
                    <span className="mt-2.5 block text-[13px] font-semibold text-ink-hi">{e.name}</span>
                    <span className="mt-0.5 block text-[11px] text-ink-faint">{(e as unknown as { from_: string }).from_} – {e.to}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <GoldRule />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-2xl text-[12.5px] text-ink-low">
                {db.rulers.all().length} ruler profiles, {heritage.length} registry entries and {museums.length} museums are linked to these eras.
              </p>
              <div className="flex gap-2">
                <Link href={l('/rulers-of-egypt')} className="rounded-lg border border-white/12 px-3.5 py-2 text-[12.5px] text-ink-hi hover:bg-white/6">Rulers of Egypt</Link>
                <Link href={l('/ancient-egypt-academy')} className="rounded-lg border border-white/12 px-3.5 py-2 text-[12.5px] text-ink-hi hover:bg-white/6">Academy</Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ heritage row */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow="Registry" title={t('section.heritage')} sub={t('section.heritage.sub')} href={l('/heritage')} hrefLabel={t('nav.viewAll')} />
          <CarouselRow ariaLabel="Heritage highlights">
            {heritage.filter((h) => !h.hidden).slice(0, 12).map((h) => (
              <div key={h.slug} className="w-[240px]">
                <Link href={l(`/heritage/${h.slug}`)} className="surface lift group block overflow-hidden p-0">
                  <SmartImage seed={h.slug} subject={h.classification.includes('Islamic') ? 'mosque' : h.classification.includes('Coptic') ? 'church' : 'temple'} alt={h.name} ratio="4/3" />
                  <div className="p-4">
                    <h3 className="text-[14px] font-semibold leading-snug text-ink-hi group-hover:text-gold-200">{h.name}</h3>
                    <p className="mt-1 text-[11.5px] text-ink-faint">{h.classification}</p>
                    <div className="mt-3"><SourceBadge status={h.sourceStatus} size="sm" /></div>
                  </div>
                </Link>
              </div>
            ))}
          </CarouselRow>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Link href={l('/hidden-heritage')} className="surface lift p-5">
              <Badge tone="gold">New</Badge>
              <h3 className="mt-2.5 text-[15px] font-semibold text-ink-hi">Hidden heritage</h3>
              <p className="mt-1.5 text-[12.5px] text-ink-low">{db.heritage.hidden().length} sites outside ordinary itineraries, with honest access classifications.</p>
            </Link>
            <Link href={l('/restoration')} className="surface lift p-5">
              <h3 className="text-[15px] font-semibold text-ink-hi">Restoration pipeline</h3>
              <p className="mt-1.5 text-[12.5px] text-ink-low">{db.heritage.restoration().length} sites tracked from proposal through completion.</p>
            </Link>
            <Link href={l('/egyptian-heritage-worldwide')} className="surface lift p-5">
              <h3 className="text-[15px] font-semibold text-ink-hi">Egyptian heritage worldwide</h3>
              <p className="mt-1.5 text-[12.5px] text-ink-low">A catalogue of Egyptian objects held abroad — recorded without asserting provenance.</p>
            </Link>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------- nile & sea + guides */}
      <Section>
        <Container wide>
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <SectionHeader eyebrow="Water" title={t('section.nileSea')} sub="Cruises, feluccas, reefs, marinas and yacht charter." href={l('/nile')} hrefLabel="Explore" />
              <div className="grid grid-cols-2 gap-3">
                {([['/nile', 'The Nile', 'nile'], ['/sea', 'Red Sea & Mediterranean', 'sea'], ['/cruises', 'Nile cruises', 'nile'], ['/yachts', 'Yachts & marinas', 'sea']] as const).map(([hrefP, title, subject]) => (
                  <Link key={hrefP} href={l(hrefP)} className="surface lift overflow-hidden p-0">
                    <SmartImage seed={title} subject={subject} alt={title} ratio="16/10" />
                    <div className="p-3.5 text-[13px] font-medium text-ink-hi">{title}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <SectionHeader eyebrow="People" title="Guides & assistants" sub="Matched on language, governorate, specialty, availability and accessibility expertise." href={l('/guides')} hrefLabel="Find a guide" />
              <div className="grid gap-3 sm:grid-cols-2">
                {guides.slice(0, 4).map((g) => <ProviderCard key={g.slug} p={g} href={l(`/guides/${g.slug}`)} />)}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- modules */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow="One ecosystem" title="Beyond the visit" sub="Every module below is a full experience of its own, connected by one identity and one assistant." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((mod) => (
              <Link key={mod.href} href={l(mod.href)} className={`lift rounded-[16px] border bg-gradient-to-b to-transparent p-5 ${TONE[mod.tone]}`}>
                <h3 className="text-[16px] font-semibold text-ink-hi">{mod.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-low">{mod.body}</p>
                <span className="mt-4 inline-flex text-[12.5px] font-medium text-gold-300">{mod.cta} →</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- investment */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow="Invest" title={t('section.invest')} sub="Egypt One connects tourism with economic opportunity — real estate, industry, business setup and long-term residency, alongside the trip you're planning." href={l('/invest')} hrefLabel="Investor portal" />
          <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
            {INVESTMENT_CATEGORIES.map((c) => (
              <Link key={c.label} href={l(c.href)} className="surface lift flex flex-col items-center gap-2 px-2 py-4 text-center">
                <span aria-hidden="true" className="text-[19px] text-gold-400">{c.icon}</span>
                <span className="text-[11.5px] font-medium leading-tight text-ink-hi">{c.label}</span>
                <Badge tone={c.status === 'PLANNED' ? 'neutral' : 'gold'} className="text-[9px]">{c.status}</Badge>
              </Link>
            ))}
          </div>
          <SectionHeader title={`${opps.length} indicative opportunities`} sub={`Across ${db.investment.sectors().length} sectors and all 27 governorates.`} />
          <CarouselRow ariaLabel="Investment opportunities">
            {opps.slice(0, 10).map((o) => (
              <DiscoveryCard
                key={o.slug} href={l(`/investment-opportunities/${o.slug}`)} name={o.name}
                summary={o.summary} sourceStatus={o.sourceStatus} tags={o.tags}
                badge={<Badge tone="nile">{o.stage}</Badge>}
                meta={<><span>USD {(o.investmentRangeUsd[0] / 1e6).toFixed(0)}–{(o.investmentRangeUsd[1] / 1e6).toFixed(0)}M</span><span>·</span><span>{o.competentEntity}</span></>}
              />
            ))}
          </CarouselRow>
          <p className="mt-3 text-[11.5px] text-ink-faint">
            No opportunity on this platform is a guaranteed return, an allocation of land, or an approval. Terms are set by the competent entity.
          </p>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- marketplace */}
      <Section>
        <Container wide>
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="min-w-0">
              <SectionHeader eyebrow="Marketplace" title={t('section.marketplace')} sub={`Crafts and clothing from all 27 governorates — ${products.length} demo collection entries.`} href={l('/wear-egypt')} hrefLabel="Shop the collections" />
              <CarouselRow ariaLabel="Wear Egypt products">
                {products.slice(0, 10).map((p) => (
                  <DiscoveryCard key={p.slug} href={l('/wear-egypt')} name={p.name} summary={p.summary} sourceStatus={p.sourceStatus} tags={p.tags} meta={<span>EGP {p.priceEgp.toLocaleString()}</span>} />
                ))}
              </CarouselRow>
            </div>
            <div>
              <SectionHeader eyebrow="Connectors" title="Affiliate marketplace" sub="Adapter contracts are built; none is live." />
              <div className="surface p-5">
                <ul className="grid gap-2.5">
                  {integrations.slice(0, 7).map((i) => (
                    <li key={i.id} className="flex items-center justify-between gap-3 text-[12px]">
                      <span className="min-w-0 truncate text-ink-mid">{i.name}</span>
                      <SourceBadge status={i.state === 'LIVE' ? 'LIVE' : i.state === 'SANDBOX' ? 'SIMULATED' : 'PLANNED_INTEGRATION'} size="sm" />
                    </li>
                  ))}
                </ul>
                <Link href={l('/partner/integrations')} className="mt-4 inline-flex text-[12px] text-gold-300 hover:underline">View the full registry →</Link>
                <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
                  Brand names appear only as adapter classes. Egypt One does not represent a commercial partnership with any company unless an agreement exists.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- offers */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow="Programmes" title={t('section.offers')} href={l('/offers')} hrefLabel={t('nav.viewAll')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMME_TILES.map((tile) => {
              const o = offers.find((x: { slug: string; name: string; summary: string; kind: string }) => x.slug === tile.slug) as
                { slug: string; name: string; summary: string; kind: string } | undefined;
              if (!o) return null;
              return (
                <Link key={tile.slug} href={l('/offers')} className={`lift group block overflow-hidden rounded-[16px] border bg-gradient-to-b to-transparent ${TONE[tile.tone]}`}>
                  <div className="relative">
                    <SmartImage seed={o.slug} subject={subjectForOffer(o.kind)} alt={o.name} ratio="16/10" className="rounded-none" />
                    <span aria-hidden="true" className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-base/70 text-[15px] text-gold-300 backdrop-blur">{tile.icon}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[14.5px] font-semibold text-ink-hi group-hover:text-gold-200">{o.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[12px] text-ink-low">{o.summary}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-[12px] font-medium text-gold-300">{tile.cta} →</span>
                      <SourceBadge status="DEMO" size="sm" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- tourism intelligence */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow="Operations preview" title={t('section.intel')} sub="A public preview of the government and operations dashboards. Every figure below is synthetic." href={l('/government/tourism-intelligence')} hrefLabel="Full dashboard" />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label="Visitors this month" value={(metrics.headline.visitorsThisMonth / 1e6).toFixed(2) + 'M'} sub={`+${metrics.headline.visitorsYoYPct}% year on year`} />
              <Stat label="Countries reached" value={metrics.headline.countriesReached} sub="Egypt 195 gateways" tone="nile" />
              <Stat label="Average stay" value={metrics.headline.avgStayNights + ' nights'} tone="neutral" />
              <Stat label="Tourism revenue" value={'$' + (metrics.headline.tourismRevenueUsd / 1e9).toFixed(2) + 'B'} sub={`+${metrics.headline.revenueYoYPct}%`} tone="ok" />
            </div>
            <div className="surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-ink-hi">Top origin markets</h3>
                <SourceBadge status="SIMULATED" size="sm" />
              </div>
              <BarStrip rows={metrics.topCountries.slice(0, 6).map((c) => ({ label: c.country, value: c.visitors }))} />
            </div>
            <div className="surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-ink-hi">Traveller interests</h3>
                <SourceBadge status="SIMULATED" size="sm" />
              </div>
              <Donut
                slices={metrics.interests.slice(0, 5).map((x, i) => ({
                  label: x.name, value: x.sharePct,
                  colour: ['#D8A84E', '#2E7D9A', '#3FB6AD', '#5B4B8A', '#A2703F'][i],
                }))}
              />
            </div>
          </div>
          <div className="surface mt-4 p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-ink-hi">Monthly visitor trend</h3>
              <SourceBadge status="SIMULATED" size="sm" />
            </div>
            <Trend points={metrics.monthlyVisitors.map((x) => x.visitors)} height={72} />
            <div className="mt-1 flex justify-between text-[10.5px] text-ink-faint">
              {metrics.monthlyVisitors.map((x) => <span key={x.month}>{x.month}</span>)}
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- portals */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow="One ecosystem, seven experiences" title="Portals" sub="Shared identity, design system, API platform, permissions and audit — separate navigation and UX." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              ['/account', 'Traveller account', 'Trips, bookings, pass, wallet and consent.'],
              ['/provider', 'Provider portal', 'Profile, inventory, availability, bookings, settlement.'],
              ['/partner', 'Partner portal', 'Integrations, credentials, transactions, commission.'],
              ['/government', 'Government portal', 'Tourism intelligence on synthetic data only.'],
              ['/admin', 'Platform operations', 'CMS, verification, revenue, AI registry, audit.'],
            ].map(([hrefP, title, body]) => (
              <Link key={hrefP} href={l(hrefP)} className="surface lift p-5">
                <h3 className="text-[14.5px] font-semibold text-ink-hi">{title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-low">{body}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- trust */}
      <Section className="py-6 sm:py-8">
        <Container wide>
          <div className="surface grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST_ITEMS.map((item) => (
              <div key={item.title} className="flex gap-3">
                <span className="mt-0.5 text-gold-500" aria-hidden="true">{item.icon}</span>
                <div>
                  <div className="text-[12.5px] font-semibold text-ink-hi">{item.title}</div>
                  <div className="mt-0.5 text-[11.5px] leading-relaxed text-ink-faint">{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------------------- honesty */}
      <Section>
        <Container wide>
          <div className="surface-gold p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <Logo variant="compact" size={30} />
                <h2 className="mt-4 text-[20px] font-semibold text-ink-hi">What this platform is, and is not</h2>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-mid">
                  Egypt One is a coordination and technology layer. It does not replace government systems, issue licences or
                  approvals, hold funds, or assert official status for any record. Authority, approvals and sovereign data stay
                  with the competent authorities; the platform connects to them through approved, auditable integrations.
                </p>
              </div>
              <div className="grid gap-2 text-[12px]">
                {(['LIVE', 'VERIFIED_DATA', 'PARTNER_DATA', 'DEMO', 'SIMULATED', 'PLANNED_INTEGRATION'] as const).map((s) => (
                  <SourceBadge key={s} status={s} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
