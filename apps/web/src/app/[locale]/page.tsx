import Link from 'next/link';
import { db } from '@egypt-one/database';
import { getMessages, type Locale } from '@egypt-one/i18n';
import {
  Logo, Badge, Card, Stat, SourceBadge, GoldRule,
  SectionHeader, CarouselRow, DiscoveryCard, GovernorateCard, HeritageCard, ProviderCard,
  SmartImage, CinematicHero, subjectFor, BarStrip, Donut, Trend,
  ProgrammeCard, TrustBar,
} from '@egypt-one/ui';
import { Container, Section } from '@/components/Container';
import { HeroSearch } from '@/components/HeroSearch';
import { HomeTripTeaser } from '@/components/HomeTripTeaser';
import { HomeConciergeStrip } from '@/components/HomeConciergeStrip';
import { href as L } from '@/lib/locale';
import { TRUST_ITEMS } from '@/lib/trust';

const QUICK = [
  { href: '/hotels', key: 'quick.hotels', icon: '⌂' }, { href: '/flights', key: 'quick.flights', icon: '✈' },
  { href: '/activities', key: 'quick.attractions', icon: '◈' }, { href: '/cruises', key: 'quick.cruises', icon: '⛵' },
  { href: '/guides', key: 'quick.guides', icon: '☺' }, { href: '/transport', key: 'quick.transport', icon: '⇄' },
  { href: '/restaurants', key: 'quick.food', icon: '❉' }, { href: '/events', key: 'quick.events', icon: '♪' },
  { href: '/wear-egypt', key: 'quick.shopping', icon: '◍' }, { href: '/medical-tourism', key: 'quick.health', icon: '✚' },
  { href: '/invest', key: 'quick.invest', icon: '◆' }, { href: '/discover', key: 'quick.more', icon: '⋯' },
];

const MODULES = [
  { href: '/entertainment-investment', key: 'modules.entertainment', tone: 'royal' },
  { href: '/real-estate', key: 'modules.realestate', tone: 'nile' },
  { href: '/medical-tourism', key: 'modules.health', tone: 'emerald' },
  { href: '/research', key: 'modules.research', tone: 'gold' },
  { href: '/rural-egypt', key: 'modules.rural', tone: 'emerald' },
  { href: '/know-your-origin', key: 'modules.origin', tone: 'royal' },
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

const INVESTMENT_CATEGORIES: { key: string; icon: string; href: string; status: 'DEMO' | 'PLANNED' }[] = [
  { key: 'invest.cat.realestate', icon: '◫', href: '/real-estate', status: 'DEMO' },
  { key: 'invest.cat.land', icon: '◧', href: '/investment-opportunities', status: 'DEMO' },
  { key: 'invest.cat.tourism', icon: '◆', href: '/tourism-investment', status: 'DEMO' },
  { key: 'invest.cat.business', icon: '⬡', href: '/business-setup', status: 'DEMO' },
  { key: 'invest.cat.industrial', icon: '◩', href: '/investment-opportunities', status: 'PLANNED' },
  { key: 'invest.cat.residency', icon: '◈', href: '/visa', status: 'PLANNED' },
  { key: 'invest.cat.government', icon: '⛨', href: '/government', status: 'PLANNED' },
];

const PROGRAMME_TILES = [
  { slug: 'egypt-one-pass', icon: '♛', tone: 'gold', ctaKey: 'programme.cta.pass' },
  { slug: 'visit-all-27-challenge', icon: '◈', tone: 'royal', ctaKey: 'programme.cta.challenge' },
  { slug: 'stopover-egypt', icon: '✈', tone: 'nile', ctaKey: 'programme.cta.stopover' },
  { slug: 'one-more-night', icon: '☾', tone: 'emerald', ctaKey: 'programme.cta.night' },
] as const;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const m = getMessages(locale as Locale);
  const t = (k: string) => m[k] ?? k;
  const tn = (k: string, vars: Record<string, string | number>) =>
    Object.entries(vars).reduce((s, [key, v]) => s.replaceAll(`{${key}}`, String(v)), t(k));
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
                <Link href={l('/egypt-195')} className="mt-4 inline-flex rounded-lg bg-gold-500/90 px-3.5 py-2 text-[12.5px] font-semibold text-[#0a1017] hover:bg-gold-400">{t('aside.chooseCountry')}</Link>
              </Card>

              <div className="surface lift overflow-hidden p-0">
                <SmartImage seed="trip-builder-sample" subject="nile" alt="Sample Egypt itinerary" ratio="16/9" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-ink-hi">{t('aside.startTrip.title')}</h2>
                    <SourceBadge status="DEMO" size="sm" />
                  </div>
                  <p className="mt-1.5 text-[12px] text-ink-low">{t('aside.startTrip.body')}</p>
                  <Link href={l('/trip-builder')} className="mt-3 inline-flex rounded-lg border border-gold-600/40 px-3.5 py-2 text-[12.5px] font-medium text-gold-300 hover:bg-gold-600/12">{t('aside.startTrip.cta')}</Link>
                </div>
              </div>

              <div className="surface lift overflow-hidden p-0">
                <SmartImage seed={events[0]?.slug ?? 'next-event'} subject={subjectFor([events[0]?.category ?? '', events[0]?.venue ?? ''], events[0]?.name ?? '')} alt={events[0]?.name ?? 'Upcoming event'} ratio="16/9" />
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[14px] font-semibold text-ink-hi">{t('aside.nextEvent.title')}</h2>
                    <SourceBadge status="DEMO" size="sm" />
                  </div>
                  <div className="mt-2 text-[13px] text-gold-200">{events[0]?.name}</div>
                  <div className="mt-1 text-[11.5px] text-ink-faint">{events[0]?.startDate} → {events[0]?.endDate} · {events[0]?.venue}</div>
                  <Link href={l('/events')} className="mt-3 inline-flex text-[12px] text-gold-300 hover:underline">{t('aside.nextEvent.cta')}</Link>
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
            <Link key={q.href + q.key} href={l(q.href)} className="flex min-h-[68px] flex-col items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-center transition-colors hover:bg-white/6">
              <span aria-hidden="true" className="text-[17px] text-gold-400">{q.icon}</span>
              <span className="text-[11px] leading-tight text-ink-mid">{t(q.key)}</span>
            </Link>
          ))}
        </nav>
      </Container>

      {/* ------------------------------------------------------------ governorates */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow={t('eyebrow.discoverEgypt')} title={t('section.governorates')} sub={t('section.governorates.sub')} href={l('/governorates')} hrefLabel={t('nav.viewAll')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredGovs.map((g) => (
              <Link key={g.slug} href={l(`/governorates/${g.slug}`)} className="surface lift group block overflow-hidden p-0">
                <SmartImage seed={g.slug} subject={g.hasCoast ? 'sea' : g.hasNile ? 'nile' : 'desert'} alt={`${g.name} governorate`} ratio="16/9" />
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[16px] font-semibold text-ink-hi group-hover:text-gold-200">{g.name}</h3>
                    <span className="text-[11px] text-ink-faint">{g.region}</span>
                  </div>
                  <p className="mt-1 text-[12px] text-ink-low">{t('gov.capital')} {g.capital} · {g.metrics.heritageSites} {t('gov.heritageSites')}</p>
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
          <SectionHeader eyebrow={t('eyebrow.heritage')} title={t('section.time')} sub={t('section.time.sub')} href={l('/egypt-through-time')} hrefLabel={t('nav.exploreTimeline')} />
          <div className="surface p-5">
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
              {eras.map((e) => (
                <li key={e.key}>
                  <Link href={l(`/egypt-through-time#${e.key.toLowerCase()}`)} className="block rounded-xl border border-white/8 bg-white/3 p-3.5 transition-colors hover:border-gold-600/35">
                    <span className="block h-1 w-10 rounded-full" style={{ background: e.colour }} aria-hidden="true" />
                    <span className="mt-2.5 block text-[13px] font-semibold text-ink-hi">{e.key === 'CONTEMPORARY' ? 'Modern Egypt (The New Republic)' : e.name}</span>
                    <span className="mt-0.5 block text-[11px] text-ink-faint">{(e as unknown as { from_: string }).from_} – {e.to}</span>
                  </Link>
                </li>
              ))}
            </ol>
            <GoldRule />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="max-w-2xl text-[12.5px] text-ink-low">
                {tn('time.linkedSummary', { rulers: db.rulers.all().length, heritage: heritage.length, museums: museums.length })}
              </p>
              <div className="flex gap-2">
                <Link href={l('/rulers-of-egypt')} className="rounded-lg border border-white/12 px-3.5 py-2 text-[12.5px] text-ink-hi hover:bg-white/6">{t('nav.rulersOfEgypt')}</Link>
                <Link href={l('/ancient-egypt-academy')} className="rounded-lg border border-white/12 px-3.5 py-2 text-[12.5px] text-ink-hi hover:bg-white/6">{t('nav.academy')}</Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------------ heritage row */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow={t('eyebrow.registry')} title={t('section.heritage')} sub={t('section.heritage.sub')} href={l('/heritage')} hrefLabel={t('nav.viewAll')} />
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
              <Badge tone="gold">{t('badge.new')}</Badge>
              <h3 className="mt-2.5 text-[15px] font-semibold text-ink-hi">{t('heritage.hidden.title')}</h3>
              <p className="mt-1.5 text-[12.5px] text-ink-low">{tn('heritage.hidden.body', { count: db.heritage.hidden().length })}</p>
            </Link>
            <Link href={l('/restoration')} className="surface lift p-5">
              <h3 className="text-[15px] font-semibold text-ink-hi">{t('heritage.restoration.title')}</h3>
              <p className="mt-1.5 text-[12.5px] text-ink-low">{tn('heritage.restoration.body', { count: db.heritage.restoration().length })}</p>
            </Link>
            <Link href={l('/egyptian-heritage-worldwide')} className="surface lift p-5">
              <h3 className="text-[15px] font-semibold text-ink-hi">{t('heritage.worldwide.title')}</h3>
              <p className="mt-1.5 text-[12.5px] text-ink-low">{t('heritage.worldwide.body')}</p>
            </Link>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------- nile & sea + guides */}
      <Section>
        <Container wide>
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <SectionHeader eyebrow={t('eyebrow.water')} title={t('section.nileSea')} sub={t('water.sub')} href={l('/nile')} hrefLabel={t('nav.explore')} />
              <div className="grid grid-cols-2 gap-3">
                {([['/nile', 'water.nile', 'nile'], ['/sea', 'water.seaMed', 'sea'], ['/cruises', 'water.cruises', 'nile'], ['/yachts', 'water.yachts', 'sea']] as const).map(([hrefP, titleKey, subject]) => (
                  <Link key={hrefP} href={l(hrefP)} className="surface lift overflow-hidden p-0">
                    <SmartImage seed={titleKey} subject={subject} alt={t(titleKey)} ratio="16/10" />
                    <div className="p-3.5 text-[13px] font-medium text-ink-hi">{t(titleKey)}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <SectionHeader eyebrow={t('eyebrow.people')} title={t('guides.title')} sub={t('guides.sub')} href={l('/guides')} hrefLabel={t('nav.findGuide')} />
              <div className="grid gap-3 sm:grid-cols-2">
                {guides.slice(0, 4).map((g) => <ProviderCard key={g.slug} p={g} href={l(`/guides/${g.slug}`)} />)}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------- live planner + concierge */}
      <Section>
        <Container wide>
          <SectionHeader
            eyebrow={t('eyebrow.oneEcosystem')}
            title="Plan it now — or just ask"
            sub="Both panels below call the platform's own planner and concierge in real time. Every result is a labelled draft, never a booking."
          />
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <HomeTripTeaser locale={locale as Locale} />
            <HomeConciergeStrip locale={locale as Locale} />
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------------- modules */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow={t('eyebrow.oneEcosystem')} title={t('modules.sectionTitle')} sub={t('modules.sectionSub')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((mod) => (
              <Link key={mod.href} href={l(mod.href)} className={`lift rounded-[16px] border bg-gradient-to-b to-transparent p-5 ${TONE[mod.tone]}`}>
                <h3 className="text-[16px] font-semibold text-ink-hi">{t(`${mod.key}.title`)}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-ink-low">{t(`${mod.key}.body`)}</p>
                <span className="mt-4 inline-flex text-[12.5px] font-medium text-gold-300">{t(`${mod.key}.cta`)} →</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------------------- investment */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow={t('eyebrow.invest')} title={t('section.invest')} sub={t('invest.sub')} href={l('/invest')} hrefLabel={t('nav.investorPortal')} />
          <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
            {INVESTMENT_CATEGORIES.map((c) => (
              <Link key={c.key} href={l(c.href)} className="surface lift flex flex-col items-center gap-2 px-2 py-4 text-center">
                <span aria-hidden="true" className="text-[19px] text-gold-400">{c.icon}</span>
                <span className="text-[11.5px] font-medium leading-tight text-ink-hi">{t(c.key)}</span>
                <Badge tone={c.status === 'PLANNED' ? 'neutral' : 'gold'} className="text-[9px]">{c.status}</Badge>
              </Link>
            ))}
          </div>
          <SectionHeader title={tn('invest.oppCount.title', { count: opps.length })} sub={tn('invest.oppCount.sub', { sectors: db.investment.sectors().length })} />
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
            {t('invest.disclaimer')}
          </p>
        </Container>
      </Section>

      {/* ------------------------------------------------------------- marketplace */}
      <Section>
        <Container wide>
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <div className="min-w-0">
              <SectionHeader eyebrow={t('eyebrow.marketplace')} title={t('section.marketplace')} sub={tn('marketplace.sub', { count: products.length })} href={l('/wear-egypt')} hrefLabel={t('nav.shopCollections')} />
              <CarouselRow ariaLabel="Wear Egypt products">
                {products.slice(0, 10).map((p) => (
                  <DiscoveryCard key={p.slug} href={l('/wear-egypt')} name={p.name} summary={p.summary} sourceStatus={p.sourceStatus} tags={p.tags} meta={<span>EGP {p.priceEgp.toLocaleString()}</span>} />
                ))}
              </CarouselRow>
            </div>
            <div>
              <SectionHeader eyebrow={t('eyebrow.connectors')} title={t('marketplace.affiliate.title')} sub={t('marketplace.affiliate.sub')} />
              <div className="surface p-5">
                <ul className="grid gap-2.5">
                  {integrations.slice(0, 7).map((i) => (
                    <li key={i.id} className="flex items-center justify-between gap-3 text-[12px]">
                      <span className="min-w-0 truncate text-ink-mid">{i.name}</span>
                      <SourceBadge status={i.state === 'LIVE' ? 'LIVE' : i.state === 'SANDBOX' ? 'SIMULATED' : 'PLANNED_INTEGRATION'} size="sm" />
                    </li>
                  ))}
                </ul>
                <Link href={l('/partner/integrations')} className="mt-4 inline-flex text-[12px] text-gold-300 hover:underline">{t('nav.fullRegistry')}</Link>
                <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
                  {t('marketplace.affiliate.disclaimer')}
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
                <ProgrammeCard
                  key={tile.slug}
                  href={l('/offers')}
                  seed={o.slug}
                  subject={subjectForOffer(o.kind)}
                  icon={tile.icon}
                  tone={tile.tone}
                  title={o.name}
                  summary={o.summary}
                  cta={t(tile.ctaKey)}
                  sourceStatus="DEMO"
                />
              );
            })}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- tourism intelligence */}
      <Section>
        <Container wide>
          <SectionHeader eyebrow={t('eyebrow.operationsPreview')} title={t('section.intel')} sub={t('intel.sub')} href={l('/government/tourism-intelligence')} hrefLabel={t('nav.fullDashboard')} />
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat label={t('intel.visitorsThisMonth')} value={(metrics.headline.visitorsThisMonth / 1e6).toFixed(2) + 'M'} sub={tn('intel.yoy', { pct: metrics.headline.visitorsYoYPct })} />
              <Stat label={t('intel.countriesReached')} value={metrics.headline.countriesReached} sub={t('intel.egypt195Gateways')} tone="nile" />
              <Stat label={t('intel.avgStay')} value={metrics.headline.avgStayNights + ' ' + t('intel.nights')} tone="neutral" />
              <Stat label={t('intel.tourismRevenue')} value={'$' + (metrics.headline.tourismRevenueUsd / 1e9).toFixed(2) + 'B'} sub={tn('intel.yoy', { pct: metrics.headline.revenueYoYPct })} tone="ok" />
            </div>
            <div className="surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-ink-hi">{t('intel.topMarkets')}</h3>
                <SourceBadge status="SIMULATED" size="sm" />
              </div>
              <BarStrip rows={metrics.topCountries.slice(0, 6).map((c) => ({ label: c.country, value: c.visitors }))} />
            </div>
            <div className="surface p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-ink-hi">{t('intel.travellerInterests')}</h3>
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
              <h3 className="text-[13px] font-semibold text-ink-hi">{t('intel.monthlyTrend')}</h3>
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
          <SectionHeader eyebrow={t('eyebrow.sevenExperiences')} title={t('portals.title')} sub={t('portals.sub')} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              ['/account', 'portals.account'],
              ['/provider', 'portals.provider'],
              ['/partner', 'portals.partner'],
              ['/government', 'portals.government'],
              ['/admin', 'portals.admin'],
            ].map(([hrefP, key]) => (
              <Link key={hrefP} href={l(hrefP)} className="surface lift p-5">
                <h3 className="text-[14.5px] font-semibold text-ink-hi">{t(`${key}.title`)}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-low">{t(`${key}.body`)}</p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ----------------------------------------------------------------- trust */}
      <Section className="py-6 sm:py-8">
        <Container wide>
          <TrustBar items={TRUST_ITEMS.map((item) => ({ icon: item.icon, title: t(`${item.key}.title`), body: t(`${item.key}.body`) }))} />
        </Container>
      </Section>

      {/* --------------------------------------------------------------- honesty */}
      <Section>
        <Container wide>
          <div className="surface-gold p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <Logo variant="compact" size={30} />
                <h2 className="mt-4 text-[20px] font-semibold text-ink-hi">{t('honesty.title')}</h2>
                <p className="mt-2.5 text-[13px] leading-relaxed text-ink-mid">
                  {t('honesty.body')}
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
