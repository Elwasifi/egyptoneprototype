'use client';
import * as React from 'react';
import Link from 'next/link';
import { SourceBadge, Badge, EmptyState, Input, Select } from '@egypt-one/ui';
import { SmartImage, subjectFor } from '@egypt-one/ui';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

export interface ListingRow {
  id: string;
  slug: string;
  name: string;
  summary?: string;
  sourceStatus: string;
  tags?: string[];
  meta?: string[];
  badge?: { label: string; tone: 'gold' | 'ok' | 'warn' | 'nile' | 'danger' | 'neutral' | 'info' };
  facets: Record<string, string | string[] | undefined>;
  hrefSuffix?: string;
}

export interface FacetDef { key: string; label: string; options: string[] }

/**
 * The shared directory surface: filter rail, live text filter, result grid.
 * Every listing page in the platform uses it, so filtering, empty states and
 * source labelling behave identically everywhere.
 */
export function Listing({
  locale, rows, facets, basePath, emptyBody, cardRatio = '16/10',
}: {
  locale: Locale;
  rows: ListingRow[];
  facets: FacetDef[];
  basePath: string;
  emptyBody?: string;
  cardRatio?: string;
}) {
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState<Record<string, string>>({});
  const [limit, setLimit] = React.useState(24);

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (needle && !`${r.name} ${r.summary ?? ''} ${(r.tags ?? []).join(' ')}`.toLowerCase().includes(needle)) return false;
      for (const [key, val] of Object.entries(active)) {
        if (!val) continue;
        const f = r.facets[key];
        if (Array.isArray(f) ? !f.includes(val) : f !== val) return false;
      }
      return true;
    });
  }, [rows, q, active]);

  const clear = () => { setQ(''); setActive({}); };
  const activeCount = Object.values(active).filter(Boolean).length + (q ? 1 : 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[248px_1fr]">
      <aside className="h-fit lg:sticky lg:top-24" aria-label="Filters">
        <div className="surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">Filters</h2>
            {activeCount > 0 && (
              <button onClick={clear} className="text-[11px] text-gold-300 hover:underline">Clear all</button>
            )}
          </div>
          <div className="grid gap-3.5">
            <div>
              <label htmlFor="listing-q" className="mb-1.5 block text-[11.5px] text-ink-low">Search</label>
              <Input id="listing-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by name…" />
            </div>
            {facets.map((f) => (
              <div key={f.key}>
                <label htmlFor={`f-${f.key}`} className="mb-1.5 block text-[11.5px] text-ink-low">{f.label}</label>
                <Select
                  id={`f-${f.key}`} value={active[f.key] ?? ''}
                  onChange={(e) => setActive((s) => ({ ...s, [f.key]: e.target.value }))}
                >
                  <option value="">All</option>
                  {f.options.map((o) => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
                </Select>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12.5px] text-ink-low" aria-live="polite">
            {filtered.length.toLocaleString()} of {rows.length.toLocaleString()} records
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(active).filter(([, v]) => v).map(([k, v]) => (
              <button key={k} onClick={() => setActive((s) => ({ ...s, [k]: '' }))} className="rounded-full border border-gold-600/35 bg-gold-600/10 px-2.5 py-1 text-[11px] text-gold-300">
                {v.replace(/_/g, ' ')} ✕
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState body={emptyBody ?? 'No records match these filters. Try clearing one of them.'} />
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.slice(0, limit).map((r) => (
                <Link key={r.id} href={L(locale, `${basePath}${r.hrefSuffix ?? `/${r.slug}`}`)} className="surface lift group block overflow-hidden p-0">
                  <SmartImage seed={r.slug} subject={subjectFor(r.tags, r.name)} alt={r.name} ratio={cardRatio} />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-[14.5px] font-semibold leading-snug text-ink-hi transition-colors group-hover:text-gold-200">{r.name}</h3>
                      {r.badge && <Badge tone={r.badge.tone}>{r.badge.label}</Badge>}
                    </div>
                    {r.summary && <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-low">{r.summary}</p>}
                    {r.meta?.length ? (
                      <p className="mt-2 text-[11.5px] text-ink-faint">{r.meta.join(' · ')}</p>
                    ) : null}
                    <div className="mt-3"><SourceBadge status={r.sourceStatus as never} size="sm" /></div>
                  </div>
                </Link>
              ))}
            </div>
            {filtered.length > limit && (
              <div className="mt-6 flex justify-center">
                <button onClick={() => setLimit((n) => n + 24)} className="rounded-lg border border-gold-600/40 px-5 py-2.5 text-[13px] font-medium text-gold-300 hover:bg-gold-600/12">
                  Show more ({filtered.length - limit} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
