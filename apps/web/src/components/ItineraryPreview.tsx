import * as React from 'react';
import Link from 'next/link';
import { planEgyptTrip } from '@egypt-one/skills';
import { Badge, SourceBadge } from '@egypt-one/ui';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

/**
 * The demo story from the specification, rendered from the real planner:
 * a French traveller, ten days, budget-conscious, history plus beach,
 * French-speaking guide.
 */
export function ItineraryPreview({ locale }: { locale: Locale }) {
  const result = planEgyptTrip({
    days: 10,
    interests: ['History', 'Ancient Egypt', 'Beach', 'Nile'],
    budgetUsd: 1800,
    partyType: 'Couple',
    languages: ['French'],
    accessibility: [],
    nationality: 'France',
    startGovernorate: 'cairo',
  });

  const stops = [...new Set(result.data.map((d) => d.governorate))];

  return (
    <div className="grid gap-4">
      <div className="surface flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-gold-600">Demonstration story</div>
          <h3 className="mt-1.5 text-[17px] font-semibold text-ink-hi">Ten days from France — history and the Red Sea</h3>
          <p className="mt-1.5 text-[12.5px] text-ink-low">{stops.join(' → ')} · couple · budget-conscious · French-speaking guide</p>
        </div>
        <Link href={L(locale, '/trip-builder')} className="rounded-lg border border-gold-600/40 px-4 py-2 text-[12.5px] font-medium text-gold-300 hover:bg-gold-600/12">
          Build your own →
        </Link>
      </div>

      <div className="rounded-[16px] border border-warn/30 bg-warn/6 px-4 py-3 text-[12.5px] text-ink-mid">
        {result.note}
      </div>

      <div className="grid gap-3">
        {result.data.map((d) => (
          <div key={d.day} className="surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-[15px] font-semibold text-gold-200">Day {d.day} · {d.title}</h4>
              <Link href={L(locale, `/governorates/${d.governorateSlug}`)} className="text-[11.5px] text-ink-faint hover:text-gold-300">{d.governorate} →</Link>
            </div>
            <ul className="mt-3 grid gap-2">
              {d.items.map((i, k) => (
                <li key={k} className="grid grid-cols-[64px_84px_1fr_auto] items-center gap-3 border-b border-white/6 pb-2 text-[12.5px] last:border-0 last:pb-0">
                  <span className="tabular-nums text-ink-faint">{i.time ?? '—'}</span>
                  <span className="text-[11px] uppercase tracking-wider text-gold-600">{i.kind}</span>
                  <span className="min-w-0 truncate text-ink-mid">
                    {i.slug && i.kind === 'attraction' ? (
                      <Link href={L(locale, `/heritage/${i.slug}`)} className="hover:text-gold-300">{i.title}</Link>
                    ) : i.slug && i.kind === 'guide' ? (
                      <Link href={L(locale, `/guides/${i.slug}`)} className="hover:text-gold-300">{i.title}</Link>
                    ) : i.title}
                    {i.note ? <span className="text-ink-faint"> · {i.note}</span> : null}
                  </span>
                  <span className="flex items-center gap-2">
                    <Badge tone="neutral">Draft</Badge>
                    <SourceBadge status={i.sourceStatus} size="sm" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
