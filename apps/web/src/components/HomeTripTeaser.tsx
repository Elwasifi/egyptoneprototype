'use client';
import * as React from 'react';
import Link from 'next/link';
import { Badge, SourceBadge, LoadingState, ErrorState } from '@egypt-one/ui';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

type Item = { time?: string; kind: string; title: string; note?: string; sourceStatus: string; slug?: string };
type Day = { day: number; title: string; governorate: string; governorateSlug: string; items: Item[] };

const LENGTHS = [5, 7, 10];
const INTERESTS = ['Ancient Egypt', 'Nile', 'Beach', 'Food'];

/**
 * Homepage planner teaser. This calls the real, frozen `POST /api/trip/build`
 * route — no mock itinerary stands in for it. The result is always a draft:
 * nothing here is a booking, and every line keeps its source label.
 */
export function HomeTripTeaser({ locale }: { locale: Locale }) {
  const [days, setDays] = React.useState(7);
  const [plan, setPlan] = React.useState<Day[] | null>(null);
  const [note, setNote] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const ctrl = new AbortController();
    setBusy(true); setError(false);
    fetch('/api/trip/build', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ days, interests: INTERESTS, partyType: 'Couple' }),
      signal: ctrl.signal,
    })
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setPlan(d.plan as Day[]); setNote(d.note ?? null); })
      .catch((e) => { if ((e as Error).name !== 'AbortError') setError(true); })
      .finally(() => setBusy(false));
    return () => ctrl.abort();
  }, [days]);

  const stops = plan ? [...new Set(plan.map((d) => d.governorate))] : [];

  return (
    <div className="surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.16em] text-gold-600">Live planner</div>
          <h3 className="mt-1 text-[16px] font-semibold text-ink-hi">A draft route, generated now</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {LENGTHS.map((n) => (
            <button
              key={n} onClick={() => setDays(n)} aria-pressed={days === n}
              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${days === n ? 'bg-gold-500 text-[#0a1017]' : 'border border-white/10 text-ink-mid hover:bg-white/6'}`}
            >
              {n} days
            </button>
          ))}
        </div>
      </div>

      {busy && <div className="mt-4"><LoadingState rows={3} /></div>}
      {error && !busy && <div className="mt-4"><ErrorState title="The planner could not be reached" body="Please try again in a moment." /></div>}

      {plan && !busy && !error && (
        <>
          <p className="mt-3 text-[12.5px] text-ink-low">{stops.join(' → ')} · couple · history, Nile and Red Sea</p>
          <ul className="mt-4 grid gap-2.5">
            {plan.slice(0, 4).map((d) => (
              <li key={d.day} className="rounded-[14px] border border-white/8 bg-white/3 p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[13.5px] font-semibold text-gold-200">Day {d.day} · {d.title}</span>
                  <span className="flex items-center gap-2">
                    <Badge tone="neutral">Draft</Badge>
                    <SourceBadge status="DEMO" size="sm" />
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-1 text-[12px] text-ink-faint">
                  {d.items.map((i) => i.title).join(' · ')}
                </p>
              </li>
            ))}
          </ul>
          {note && <p className="mt-3 text-[11.5px] leading-relaxed text-ink-faint">{note}</p>}
          <Link href={L(locale, '/trip-builder')} className="mt-4 inline-flex rounded-lg border border-gold-600/40 px-4 py-2 text-[12.5px] font-medium text-gold-300 hover:bg-gold-600/12">
            Refine in the trip builder →
          </Link>
        </>
      )}
    </div>
  );
}
