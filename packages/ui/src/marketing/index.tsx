import * as React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { SourceBadge } from '../data';
import { SmartImage } from '../media';
import type { SourceStatus } from '@egypt-one/types';

const TONE: Record<string, string> = {
  gold: 'border-gold-600/28 from-gold-600/12',
  nile: 'border-nile/32 from-nile/14',
  royal: 'border-royal/38 from-royal/16',
  emerald: 'border-emerald/32 from-emerald/14',
};

export type ProgrammeTone = keyof typeof TONE;

/**
 * A national programme tile (Egypt One Pass, Visit All 27, Stopover Egypt…).
 * Image, icon, tone and source label are part of the component so every
 * surface renders programmes identically and always carries a source badge.
 */
export function ProgrammeCard({
  href, seed, subject, icon, tone = 'gold', title, summary, cta, sourceStatus = 'DEMO', className,
}: {
  href: string;
  seed: string;
  subject: React.ComponentProps<typeof SmartImage>['subject'];
  icon?: React.ReactNode;
  tone?: ProgrammeTone;
  title: string;
  summary?: string;
  cta?: string;
  sourceStatus?: SourceStatus;
  className?: string;
}) {
  return (
    <Link href={href} className={clsx('lift group block overflow-hidden rounded-[16px] border bg-gradient-to-b to-transparent', TONE[tone] ?? TONE.gold, className)}>
      <div className="relative">
        <SmartImage seed={seed} subject={subject} alt={title} ratio="16/10" className="rounded-none" />
        {icon && (
          <span aria-hidden="true" className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-base/70 text-[15px] text-gold-300 backdrop-blur">
            {icon}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-[14.5px] font-semibold text-ink-hi group-hover:text-gold-200">{title}</h3>
        {summary && <p className="mt-1.5 line-clamp-2 text-[12px] text-ink-low">{summary}</p>}
        <div className="mt-3 flex items-center justify-between gap-2">
          {cta && <span className="text-[12px] font-medium text-gold-300">{cta} →</span>}
          <SourceBadge status={sourceStatus} size="sm" />
        </div>
      </div>
    </Link>
  );
}

/**
 * Platform trust strip. Every line describes a capability or design intent —
 * callers must not pass claims of live partnerships or licences.
 */
export function TrustBar({
  items, className,
}: { items: { icon?: React.ReactNode; title: string; body?: string }[]; className?: string }) {
  return (
    <div className={clsx('surface grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {items.map((item) => (
        <div key={item.title} className="flex gap-3">
          <span className="mt-0.5 text-gold-500" aria-hidden="true">{item.icon ?? '◆'}</span>
          <div>
            <div className="text-[12.5px] font-semibold text-ink-hi">{item.title}</div>
            {item.body && <div className="mt-0.5 text-[11.5px] leading-relaxed text-ink-faint">{item.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
