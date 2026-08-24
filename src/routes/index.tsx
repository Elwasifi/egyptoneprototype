import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Car,
  Clapperboard,
  Compass,
  HeartPulse,
  Hotel,
  MoreHorizontal,
  Plane,
  ShoppingBag,
  Ship,
  TrendingUp,
  Utensils,
  Heart,
  Landmark,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import heroImage from "@/assets/hero-egypt.jpg";
import mapImage from "@/assets/map-egypt.jpg";
import filmImage from "@/assets/card-through-time.jpg";
import { AppRail } from "@/components/dashboard/AppRail";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { IntelligenceRail } from "@/components/dashboard/IntelligenceRail";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GhostButton, GoldButton, SourceBadge } from "@/components/site/Primitives";
import {
  discoverCards,
  eras,
  investSectors,
  popularDestinations,
  programmes,
  promoBanners,
  quickCategories,
  searchTabs,
  sectorCards,
  trustItems,
} from "@/data/site";
import { SITE, mailto } from "@/config/site";
import { cn } from "@/lib/utils";

const title = "Egypt One — One Egypt. One Journey. One Platform.";
const description =
  "Egypt One is a unified digital gateway to Egypt: destinations, 27 governorates, heritage, culture, events and investment — presented through one intelligent platform.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: SITE.url },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/` }],
  }),
  component: Home,
});

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AppRail open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="min-w-0 flex-1">
        <DashboardTopBar onMenu={() => setMenuOpen(true)} />

        <main className="grid gap-6 px-4 py-5 lg:px-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="grid min-w-0 grid-cols-1 gap-8">
            <Hero />
            <Categories />
            <Discover />
            <Destinations />
            <Promos />
            <Governorates />
            <ThroughTime />
            <Film />
            <Concierge />
            <Invest />
            <Programmes />
            <Trust />
          </div>
          <div className="min-w-0">
            <div className="2xl:sticky 2xl:top-32">
              <IntelligenceRail />
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}

function Block({
  id,
  eyebrow,
  title: heading,
  action,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32">
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/80">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 font-display text-xl tracking-tight text-foreground sm:text-2xl">
            {heading}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ViewAll({ href = "#explore" }: { href?: string }) {
  return (
    <a
      href={href}
      className="shrink-0 text-xs font-semibold text-gold transition-opacity hover:opacity-80"
    >
      View all
    </a>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/70">
      <img
        src={heroImage}
        alt="Sunset over the pyramids and the Nile"
        width={1600}
        height={900}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="relative flex min-h-[420px] flex-col justify-end p-5 sm:min-h-[460px] sm:p-8">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-gold-line bg-background/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold backdrop-blur">
          <Sparkles className="size-3" /> {SITE.tagline}
        </p>
        <h1 className="max-w-2xl font-display text-3xl leading-tight text-foreground sm:text-5xl">
          One journey. <span className="text-gold">Countless wonders.</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Discover Egypt like never before — heritage, experiences, stays and investment in one place.
        </p>

        <div className="mt-5 rounded-2xl border border-border/70 bg-background/85 p-3 backdrop-blur-xl">
          <div className="flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none]">
            {searchTabs.map((tab, i) => (
              <button
                key={tab}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                  i === 0
                    ? "bg-gold-soft text-gold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="grid gap-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
            <Field icon={<MapPin className="size-4" />} label="Where to?" value="Cairo, Luxor, Aswan" />
            <Field icon={<CalendarDays className="size-4" />} label="Dates" value="Select dates" />
            <Field icon={<Users className="size-4" />} label="Travellers" value="2 adults, 0 children" />
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
              <Search className="size-4" /> Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2.5">
      <span className="shrink-0 text-gold">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span className="block truncate text-xs text-foreground">{value}</span>
      </span>
    </div>
  );
}

const categoryIcons = [
  Hotel,
  Plane,
  Landmark,
  Ship,
  Compass,
  Car,
  Utensils,
  CalendarDays,
  ShoppingBag,
  HeartPulse,
  TrendingUp,
  MoreHorizontal,
];

function Categories() {
  return (
    <Block eyebrow="Explore by category" title="Everything Egypt, one click away">
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12">
        {quickCategories.map((c, i) => {
          const Icon = categoryIcons[i % categoryIcons.length]!;
          return (
          <a
            key={c}
            href="#explore"
            className="grid place-items-center gap-2 rounded-xl border border-border/70 bg-card px-2 py-3.5 text-center transition-colors hover:border-gold-line"
          >
            <Icon className="size-5 text-gold" />
            <span className="w-full truncate text-[11px] text-muted-foreground">{c}</span>
          </a>
          );
        })}
      </div>
    </Block>
  );
}

function Discover() {
  return (
    <Block id="explore" eyebrow="Discover Egypt" title="Explore Egypt" action={<ViewAll />}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {discoverCards.map((card) => (
          <a
            key={card.title}
            href="#governorates"
            className="group relative overflow-hidden rounded-2xl border border-border/70"
          >
            <img
              src={card.image}
              alt={card.title}
              loading="lazy"
              width={800}
              height={600}
              className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0" style={{ background: "var(--gradient-fade)" }} />
            {card.badge && <SourceBadge status="DEMO" className="absolute right-3 top-3" />}
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-base text-foreground">{card.title}</p>
              <p className="text-xs text-muted-foreground">{card.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    </Block>
  );
}

function Destinations() {
  return (
    <Block eyebrow="Popular destinations" title="Where travellers go first" action={<ViewAll />}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {popularDestinations.map((d) => (
          <article
            key={d.name}
            className="group overflow-hidden rounded-2xl border border-border/70 bg-card"
          >
            <div className="relative">
              <img
                src={d.image}
                alt={d.name}
                loading="lazy"
                width={800}
                height={600}
                className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full border border-border/70 bg-background/70 text-muted-foreground backdrop-blur">
                <Heart className="size-3.5" />
              </span>
            </div>
            <div className="p-3">
              <p className="truncate font-display text-sm text-foreground">{d.name}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">{d.note}</p>
              <p className="mt-2 text-[11px] text-gold">
                ★ {d.rating}{" "}
                <span className="text-muted-foreground">({d.reviews})</span>
              </p>
            </div>
          </article>
        ))}
      </div>
    </Block>
  );
}

function Promos() {
  return (
    <Block eyebrow="Offers & programmes" title="Curated deals across Egypt">
      <div className="grid gap-4 md:grid-cols-3">
        {promoBanners.map((p) => (
          <article
            key={p.kicker}
            className="relative overflow-hidden rounded-2xl border border-border/70"
          >
            <img
              src={p.image}
              alt={p.kicker}
              loading="lazy"
              width={900}
              height={512}
              className="h-40 w-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "var(--gradient-fade)" }} />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                {p.kicker}
              </p>
              <p className="mt-1 text-sm text-foreground">{p.title}</p>
              <a
                href={mailto(`Egypt One — ${p.kicker}`)}
                className="mt-3 inline-flex rounded-lg bg-gold px-3 py-1.5 text-[11px] font-semibold text-primary-foreground"
              >
                {p.cta}
              </a>
            </div>
          </article>
        ))}
      </div>
    </Block>
  );
}

function Governorates() {
  return (
    <Block
      id="governorates"
      eyebrow="27 Governorates"
      title="One country, twenty-seven stories"
      action={<ViewAll href="#governorates" />}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="relative overflow-hidden rounded-2xl border border-border/70">
          <img
            src={mapImage}
            alt="Illustrative night map of Egypt"
            loading="lazy"
            width={900}
            height={700}
            className="h-[320px] w-full object-cover"
          />
          <SourceBadge status="DEMO" className="absolute left-3 top-3" />
        </div>
        <div className="grid content-start gap-3 rounded-2xl border border-border/70 bg-card p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every governorate gets its own profile: geography, heritage sites, museums, experiences
            and local partners — mapped into one national index.
          </p>
          <dl className="grid grid-cols-2 gap-3">
            {[
              { k: "Governorates", v: "27" },
              { k: "Total area", v: "1M km²" },
              { k: "Heritage sites", v: "2,400+" },
              { k: "Museums", v: "80+" },
            ].map((s) => (
              <div key={s.k} className="rounded-xl border border-border/60 bg-surface-2 p-3">
                <dt className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {s.k}
                </dt>
                <dd className="mt-1 font-display text-lg text-gold">{s.v}</dd>
              </div>
            ))}
          </dl>
          <GhostButton href="#explore" className="mt-1 w-full">
            Browse governorates <ArrowRight className="size-4" />
          </GhostButton>
        </div>
      </div>
    </Block>
  );
}

function ThroughTime() {
  return (
    <Block id="through-time" eyebrow="Egypt through time" title="Fifteen eras, one continuous story">
      <div className="flex gap-3 overflow-x-auto pb-2">
        {eras.map((era) => (
          <div
            key={era.name}
            className="w-44 shrink-0 rounded-xl border border-border/70 bg-card p-4"
          >
            <p className="font-display text-sm text-foreground">{era.name}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{era.years}</p>
          </div>
        ))}
      </div>
    </Block>
  );
}

function Film() {
  return (
    <Block id="film" eyebrow="Film & screen tourism" title="Egypt on screen">
      <div className="grid gap-4 overflow-hidden rounded-2xl border border-border/70 bg-card lg:grid-cols-2">
        <img
          src={filmImage}
          alt="Cinematic Egyptian heritage location"
          loading="lazy"
          width={800}
          height={600}
          className="h-56 w-full object-cover lg:h-full"
        />
        <div className="grid content-center gap-3 p-6">
          <Clapperboard className="size-6 text-gold" />
          <p className="font-display text-lg text-foreground">Films, series and location scouting</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            A dedicated track for productions: shooting locations, permits guidance and cultural
            advisers — turning screen exposure into visits.
          </p>
          <GhostButton href={mailto("Egypt One — Film & screen tourism")} className="w-fit">
            Contact the film desk
          </GhostButton>
        </div>
      </div>
    </Block>
  );
}

function Concierge() {
  return (
    <section id="ai-concierge" className="scroll-mt-32">
      <div className="grid gap-4 rounded-2xl border border-gold-line bg-gold-soft p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
            <Sparkles className="size-3.5" /> AI Concierge
          </p>
          <h2 className="mt-2 font-display text-xl text-foreground sm:text-2xl">
            Your personal assistant for everything Egypt
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Ask for a 7-day itinerary, a Nile cruise window or a quiet heritage route — the concierge
            drafts it, you refine it.
          </p>
        </div>
        <GoldButton href={mailto("Egypt One — AI Concierge access")}>Open AI Concierge</GoldButton>
      </div>
    </section>
  );
}

function Invest() {
  return (
    <Block id="invest" eyebrow="Invest & business" title="Build with Egypt">
      <div className="grid gap-4 md:grid-cols-3">
        {sectorCards.map((s) => (
          <article
            key={s.title}
            className="overflow-hidden rounded-2xl border border-border/70 bg-card"
          >
            <img
              src={s.image}
              alt={s.title}
              loading="lazy"
              width={800}
              height={600}
              className="h-36 w-full object-cover"
            />
            <div className="p-4">
              <p className="font-display text-base text-foreground">{s.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
              <a
                href={mailto(`Egypt One — ${s.title}`)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gold"
              >
                {s.cta} <ArrowRight className="size-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {investSectors.map((s) => (
          <span
            key={s}
            className="rounded-full border border-border/70 bg-card px-3 py-1.5 text-[11px] text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>
    </Block>
  );
}

function Programmes() {
  return (
    <Block id="programmes" eyebrow="National programmes" title="Egypt One initiatives">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {programmes.map((p) => (
          <article key={p.title} className="rounded-2xl border border-border/70 bg-card p-5">
            <p className="font-display text-sm text-gold">{p.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.body}</p>
          </article>
        ))}
      </div>
    </Block>
  );
}

function Trust() {
  return (
    <section className="grid gap-3 rounded-2xl border border-border/70 bg-card p-5 sm:grid-cols-2 lg:grid-cols-5">
      {trustItems.map((t) => (
        <div key={t.title} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
          <ShieldCheck className="size-5 shrink-0 text-gold" />
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-foreground">{t.title}</span>
            <span className="block truncate text-[11px] text-muted-foreground">{t.body}</span>
          </span>
        </div>
      ))}
    </section>
  );
}
