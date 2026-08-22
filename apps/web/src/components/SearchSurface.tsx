'use client';
import * as React from 'react';
import Link from 'next/link';
import { SourceBadge, Input, Badge, EmptyState } from '@egypt-one/ui';
import { POPULAR_SEARCHES } from '@egypt-one/database';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

type Hit = { id: string; slug: string; name: string; kind: string; href: string; summary?: string; sourceStatus: string };

/** Full-page search: same index as the header command palette and the Search MCP tool. */
export function SearchSurface({ locale }: { locale: Locale }) {
  const [q, setQ] = React.useState('');
  const [hits, setHits] = React.useState<Hit[]>([]);
  const [kind, setKind] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (q.trim().length < 2) { setHits([]); return; }
    const ctrl = new AbortController();
    setLoading(true); setTouched(true);
    const id = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => setHits(d.hits ?? []))
        .catch(() => { /* aborted or offline */ })
        .finally(() => setLoading(false));
    }, 180);
    return () => { clearTimeout(id); ctrl.abort(); };
  }, [q]);

  const kinds = [...new Set(hits.map((h) => h.kind))];
  const shown = kind ? hits.filter((h) => h.kind === kind) : hits;

  return (
    <div className="grid gap-5">
      <div className="surface p-5">
        <label htmlFor="search-main" className="mb-2 block text-[12.5px] text-ink-low">Search everything</label>
        <Input
          id="search-main" value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Governorates, heritage, museums, rulers, guides, hotels, events, investment…"
          className="h-13 text-[15px]"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
          <span className="text-ink-faint">Try:</span>
          {POPULAR_SEARCHES.map((p) => (
            <button key={p} onClick={() => setQ(p)} className="rounded-full border border-gold-600/25 bg-gold-600/8 px-3 py-1.5 text-gold-300 hover:bg-gold-600/16">
              {p}
            </button>
          ))}
        </div>
      </div>

      {kinds.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setKind('')} aria-pressed={!kind} className={`rounded-full border px-3 py-1.5 text-[12px] ${!kind ? 'border-gold-500 bg-gold-600/16 text-gold-200' : 'border-white/10 text-ink-mid'}`}>
            All ({hits.length})
          </button>
          {kinds.map((k) => (
            <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k} className={`rounded-full border px-3 py-1.5 text-[12px] ${kind === k ? 'border-gold-500 bg-gold-600/16 text-gold-200' : 'border-white/10 text-ink-mid'}`}>
              {k} ({hits.filter((h) => h.kind === k).length})
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-2" aria-busy="true">{[0, 1, 2, 3].map((i) => <div key={i} className="surface h-16 animate-pulse" />)}</div>
      ) : shown.length ? (
        <ul className="grid gap-2">
          {shown.map((h) => (
            <li key={h.id}>
              <Link href={L(locale, h.href)} className="surface lift flex items-center justify-between gap-4 p-4">
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[14px] font-semibold text-ink-hi">{h.name}</span>
                    <Badge tone="neutral">{h.kind}</Badge>
                  </span>
                  {h.summary && <span className="mt-1 block truncate text-[12px] text-ink-low">{h.summary}</span>}
                </span>
                <SourceBadge status={h.sourceStatus as never} size="sm" />
              </Link>
            </li>
          ))}
        </ul>
      ) : touched && q.trim().length >= 2 ? (
        <EmptyState title="Nothing matched" body="No record in the index matches that. Try a place name, a period, a museum or a sector." />
      ) : (
        <div className="surface p-6 text-[13px] leading-relaxed text-ink-low">
          <p>
            One index covers governorates, cities, destinations, heritage sites, museums, rulers, country gateways, guides,
            hotels, events, investment opportunities, research programmes, products and objects held abroad.
          </p>
          <p className="mt-3">
            Every result carries the source status of the record behind it, so a demonstration entry never looks like a verified one.
          </p>
        </div>
      )}
    </div>
  );
}
