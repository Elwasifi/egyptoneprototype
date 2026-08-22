import * as React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { SourceBadge, Badge, SmartImage, subjectFor, GoldRule } from '@egypt-one/ui';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';
import type { SourceStatus } from '@egypt-one/types';

/** Cinematic module header used at the top of every landing page. */
export function ModuleHero({
  eyebrow, title, lead, seed, subject, stats, actions, badges,
}: {
  eyebrow: string; title: string; lead: string; seed: string;
  subject?: Parameters<typeof SmartImage>[0]['subject'];
  stats?: { label: string; value: string }[];
  actions?: { href: string; label: string; primary?: boolean }[];
  badges?: React.ReactNode;
  locale?: Locale;
}) {
  return (
    <div className="surface relative mb-8 overflow-hidden p-0">
      <div className="absolute inset-0">
        <SmartImage seed={seed} subject={subject ?? subjectFor([], title)} alt="" ratio="21/9" className="h-full w-full rounded-none" />
      </div>
      <div className="relative px-6 py-10 sm:px-9 sm:py-12">
        <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-500">{eyebrow}</div>
        <h1 className="mt-2.5 max-w-3xl text-[30px] font-semibold leading-[1.12] sm:text-[40px]">{title}</h1>
        <p className="mt-3.5 max-w-2xl text-[14.5px] leading-relaxed text-ink-mid">{lead}</p>
        {badges && <div className="mt-4 flex flex-wrap gap-2">{badges}</div>}
        {stats && (
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">{s.label}</dt>
                <dd className="mt-1 text-[20px] font-semibold tabular-nums text-gold-300">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {actions && (
          <div className="mt-6 flex flex-wrap gap-2.5">
            {actions.map((a) => (
              <Link
                key={a.href + a.label} href={a.href}
                className={clsx('rounded-lg px-4.5 py-2.5 text-[13px] font-semibold',
                  a.primary ? 'bg-gradient-to-b from-gold-400 to-gold-600 px-5 text-[#0a1017]' : 'border border-white/12 px-5 text-ink-hi hover:bg-white/6')}
              >
                {a.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="max-w-3xl space-y-3.5 text-[14px] leading-relaxed text-ink-mid">{children}</div>;
}

export function InfoCard({
  title, children, tone = 'neutral', badge,
}: { title: string; children: React.ReactNode; tone?: 'neutral' | 'gold' | 'warn' | 'danger' | 'nile'; badge?: React.ReactNode }) {
  const tones = {
    neutral: 'surface',
    gold: 'surface-gold',
    warn: 'rounded-[16px] border border-warn/30 bg-warn/6',
    danger: 'rounded-[16px] border border-danger/32 bg-danger/7',
    nile: 'rounded-[16px] border border-nile/32 bg-nile/8',
  } as const;
  return (
    <section className={clsx(tones[tone], 'p-5')}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-ink-hi">{title}</h2>
        {badge}
      </div>
      <div className="text-[13px] leading-relaxed text-ink-low">{children}</div>
    </section>
  );
}

export function FactList({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid gap-2.5">
      {rows.map(([k, v], i) => (
        <div key={i} className="grid grid-cols-[minmax(110px,180px)_1fr] gap-3 border-b border-white/6 pb-2.5 last:border-0 last:pb-0">
          <dt className="text-[12px] text-ink-faint">{k}</dt>
          <dd className="text-[13px] text-ink-mid">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function StepList({ steps }: { steps: { title: string; body: string; note?: string }[] }) {
  return (
    <ol className="grid gap-3">
      {steps.map((s, i) => (
        <li key={i} className="surface flex gap-4 p-4">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold-600/40 text-[13px] font-semibold text-gold-300">{i + 1}</span>
          <div>
            <div className="text-[14px] font-semibold text-ink-hi">{s.title}</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-low">{s.body}</p>
            {s.note && <p className="mt-1.5 text-[11.5px] text-gold-500">{s.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ChipList({ items, tone = 'neutral' }: { items: string[]; tone?: 'neutral' | 'gold' }) {
  if (!items.length) return <p className="text-[12.5px] text-ink-faint">Not recorded in this dataset.</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <span key={i} className={clsx('rounded-full border px-2.5 py-1 text-[11.5px]',
          tone === 'gold' ? 'border-gold-600/30 bg-gold-600/10 text-gold-300' : 'border-white/10 bg-white/4 text-ink-mid')}>
          {i}
        </span>
      ))}
    </div>
  );
}

/** The standing honesty notice each module carries about its own limits. */
export function Boundary({ title = 'What this page can and cannot tell you', points }: { title?: string; points: string[] }) {
  return (
    <section className="rounded-[16px] border border-gold-600/25 bg-gold-600/8 p-5">
      <h2 className="text-[14px] font-semibold text-gold-200">{title}</h2>
      <ul className="mt-3 grid gap-2">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2.5 text-[12.5px] leading-relaxed text-ink-mid">
            <span aria-hidden="true" className="mt-[3px] text-gold-500">◆</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedLinks({ locale, title = 'Continue exploring', links }: { locale: Locale; title?: string; links: { href: string; label: string; body?: string }[] }) {
  return (
    <section>
      <GoldRule />
      <h2 className="mb-4 text-[15px] font-semibold text-ink-hi">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {links.map((l) => (
          <Link key={l.href + l.label} href={L(locale, l.href)} className="surface lift p-4">
            <div className="text-[13.5px] font-semibold text-ink-hi">{l.label}</div>
            {l.body && <p className="mt-1 text-[11.5px] leading-relaxed text-ink-low">{l.body}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SourceNote({ status, owner, extra }: { status: SourceStatus; owner?: string; extra?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-white/8 bg-white/3 px-3.5 py-2.5">
      <SourceBadge status={status} owner={owner} />
      <span className="text-[11.5px] text-ink-faint">
        {extra ?? 'Source provenance travels with this record from the database through the API into any AI answer that uses it.'}
      </span>
    </div>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return <Badge tone="gold">{children}</Badge>;
}
