import * as React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { SourceBadge, AccessBadge } from '../data';
import { SmartImage, subjectFor } from '../media';
import { Badge } from '../primitives';
import type { SourceStatus, HeritageAccess } from '@egypt-one/types';

export function SectionHeader({
  eyebrow, title, sub, href, hrefLabel = 'View all',
}: { eyebrow?: string; title: string; sub?: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-600">{eyebrow}</div>}
        <h2 className="text-[22px] font-semibold sm:text-[26px]">{title}</h2>
        {sub && <p className="mt-1.5 max-w-2xl text-[13.5px] text-ink-low">{sub}</p>}
      </div>
      {href && (
        <Link href={href} className="shrink-0 rounded-lg border border-gold-600/35 px-3.5 py-2 text-[12.5px] font-medium text-gold-300 transition-colors hover:bg-gold-600/12">
          {hrefLabel} →
        </Link>
      )}
    </div>
  );
}

export function PageHeader({
  eyebrow, title, lead, badges, actions,
}: { eyebrow?: string; title: string; lead?: string; badges?: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <header className="mb-8">
      {eyebrow && <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">{eyebrow}</div>}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="max-w-3xl text-[30px] font-semibold leading-[1.15] sm:text-[38px]">{title}</h1>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {lead && <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-low">{lead}</p>}
      {badges && <div className="mt-4 flex flex-wrap items-center gap-2">{badges}</div>}
      <div className="gold-rule mt-6" />
    </header>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-1.5 text-[12px] text-ink-faint">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {it.href ? <Link href={it.href} className="hover:text-gold-300">{it.label}</Link> : <span className="text-ink-low">{it.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

/** Horizontal snap row used for previews on the homepage and module landings. */
export function CarouselRow({ children, ariaLabel }: { children: React.ReactNode; ariaLabel: string }) {
  return (
    <div className="row-scroll no-scrollbar -mx-1 px-1" role="region" aria-label={ariaLabel} tabIndex={0}>
      {children}
    </div>
  );
}

type CardBase = { href: string; name: string; summary?: string; sourceStatus: SourceStatus; tags?: string[]; className?: string };

export function DiscoveryCard({
  href, name, summary, sourceStatus, tags, meta, badge, wide = false, className,
}: CardBase & { meta?: React.ReactNode; badge?: React.ReactNode; wide?: boolean }) {
  return (
    <Link href={href} className={clsx('surface lift group block overflow-hidden p-0', wide ? 'w-full' : 'w-[264px]', className)}>
      <SmartImage seed={name} subject={subjectFor(tags, name)} alt={name} ratio="16/10" />
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold leading-snug text-ink-hi transition-colors group-hover:text-gold-200">{name}</h3>
          {badge}
        </div>
        {summary && <p className="line-clamp-2 text-[12.5px] leading-relaxed text-ink-low">{summary}</p>}
        {meta && <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px] text-ink-faint">{meta}</div>}
        <div className="mt-3"><SourceBadge status={sourceStatus} size="sm" /></div>
      </div>
    </Link>
  );
}

export function GovernorateCard({ g }: { g: any }) {
  return (
    <Link href={`/governorates/${g.slug}`} className="surface lift group block overflow-hidden p-0">
      <SmartImage seed={g.slug} subject={subjectFor([g.region, ...(g.highlights ?? [])], g.name)} alt={`${g.name} governorate`} ratio="16/9" />
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-ink-hi group-hover:text-gold-200">{g.name}</h3>
          <span className="text-[11px] text-ink-faint">{g.region}</span>
        </div>
        <p className="mt-1 text-[12px] text-ink-low">Capital {g.capital} · {g.metrics.heritageSites} heritage sites</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(g.highlights ?? []).slice(0, 2).map((h: string) => <Badge key={h} tone="gold">{h}</Badge>)}
        </div>
      </div>
    </Link>
  );
}

export function HeritageCard({ h }: { h: any }) {
  return (
    <Link href={`/heritage/${h.slug}`} className="surface lift group block overflow-hidden p-0">
      <SmartImage seed={h.slug} subject={subjectFor([h.classification, h.era], h.name)} alt={h.name} ratio="4/3" />
      <div className="p-4">
        <h3 className="text-[14.5px] font-semibold leading-snug text-ink-hi group-hover:text-gold-200">{h.name}</h3>
        <p className="mt-1 text-[12px] text-ink-faint">{h.classification}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <AccessBadge access={h.access as HeritageAccess} />
          <SourceBadge status={h.sourceStatus} size="sm" />
        </div>
      </div>
    </Link>
  );
}

export function ProviderCard({ p, href }: { p: any; href: string }) {
  return (
    <Link href={href} className="surface lift group block overflow-hidden p-0">
      <SmartImage seed={p.slug} subject={subjectFor([p.type], p.name)} alt={p.name} ratio="16/10" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14.5px] font-semibold leading-snug text-ink-hi group-hover:text-gold-200">{p.name}</h3>
          {p.rating && <span className="shrink-0 text-[12px] tabular-nums text-gold-300">★ {p.rating}</span>}
        </div>
        {p.languages?.length ? <p className="mt-1.5 text-[11.5px] text-ink-low">{p.languages.slice(0, 4).join(' · ')}</p> : null}
        {p.specialties?.length ? <p className="mt-1 text-[11.5px] text-ink-faint">{p.specialties.slice(0, 3).join(' · ')}</p> : null}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge tone={p.verification === 'VERIFIED' ? 'ok' : 'warn'}>
            {p.verification === 'VERIFIED' ? 'Verified on platform' : 'Verification in review'}
          </Badge>
          {p.priceFrom ? <span className="text-[12px] text-ink-mid">from {p.currency ?? 'USD'} {p.priceFrom}</span> : null}
        </div>
        <div className="mt-2"><SourceBadge status={p.sourceStatus} size="sm" /></div>
      </div>
    </Link>
  );
}

export function BentoGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>{children}</div>;
}

export function FilterRail({ children, title = 'Filters' }: { children: React.ReactNode; title?: string }) {
  return (
    <aside className="surface h-fit p-4 lg:sticky lg:top-24" aria-label={title}>
      <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">{title}</h2>
      <div className="grid gap-4">{children}</div>
    </aside>
  );
}
