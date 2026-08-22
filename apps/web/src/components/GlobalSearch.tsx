'use client';
import * as React from 'react';
import Link from 'next/link';
import { SourceBadge } from '@egypt-one/ui';
import { POPULAR_SEARCHES } from '@egypt-one/database';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

type Hit = { id: string; name: string; kind: string; href: string; summary?: string; sourceStatus: string };

/**
 * Global unified search. Queries a single endpoint that fans out across
 * governorates, destinations, heritage, museums, rulers, providers, events,
 * investment, products and research — the same index the Search MCP tool uses.
 */
export function GlobalSearch({ locale, messages, onClose }: { locale: Locale; messages: Record<string, string>; onClose: () => void }) {
  const t = (k: string) => messages[k] ?? k;
  const [q, setQ] = React.useState('');
  const [hits, setHits] = React.useState<Hit[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [recent, setRecent] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => { inputRef.current?.focus(); }, []);
  React.useEffect(() => {
    try { setRecent(JSON.parse(sessionStorage.getItem('eo_recent') ?? '[]')); } catch { /* storage unavailable */ }
  }, []);

  React.useEffect(() => {
    if (q.trim().length < 2) { setHits([]); return; }
    const ctrl = new AbortController();
    setLoading(true);
    const id = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => setHits(d.hits ?? []))
        .catch(() => { /* aborted or offline */ })
        .finally(() => setLoading(false));
    }, 180);
    return () => { clearTimeout(id); ctrl.abort(); };
  }, [q]);

  const remember = (term: string) => {
    try {
      const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6);
      sessionStorage.setItem('eo_recent', JSON.stringify(next));
    } catch { /* storage unavailable */ }
  };

  const grouped = hits.reduce<Record<string, Hit[]>>((acc, h) => { (acc[h.kind] ??= []).push(h); return acc; }, {});

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[8vh]" role="dialog" aria-modal="true" aria-label={t('nav.search')}>
      <div className="absolute inset-0 bg-void/85 backdrop-blur-sm" onClick={onClose} />
      <div className="surface relative flex max-h-[76vh] w-full max-w-2xl flex-col overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
          <span aria-hidden="true" className="text-gold-500">⌕</span>
          <input
            ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder')} aria-label={t('nav.search')}
            className="h-10 flex-1 bg-transparent text-[15px] text-ink-hi outline-none placeholder:text-ink-faint"
          />
          <button onClick={onClose} aria-label={t('nav.close')} className="rounded px-2 py-1 text-[11px] text-ink-faint hover:text-ink-hi">ESC</button>
        </div>

        <div className="overflow-y-auto p-4">
          {q.trim().length < 2 ? (
            <>
              {recent.length > 0 && (
                <div className="mb-5">
                  <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">{t('search.recent')}</div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button key={r} onClick={() => setQ(r)} className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-ink-mid hover:border-gold-600/40">{r}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">{t('search.popular')}</div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((p) => (
                  <button key={p} onClick={() => setQ(p)} className="rounded-full border border-gold-600/25 bg-gold-600/8 px-3 py-1.5 text-[12px] text-gold-300 hover:bg-gold-600/16">{p}</button>
                ))}
              </div>
            </>
          ) : loading ? (
            <div className="grid gap-2" aria-busy="true">{[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-white/6" />)}</div>
          ) : hits.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-ink-low">{t('search.empty')}</p>
          ) : (
            <div className="grid gap-4">
              {Object.entries(grouped).map(([kind, rows]) => (
                <div key={kind}>
                  <div className="mb-1.5 text-[10.5px] uppercase tracking-[0.14em] text-gold-600">{kind}</div>
                  <ul className="grid gap-0.5">
                    {rows.slice(0, 6).map((h) => (
                      <li key={h.id}>
                        <Link href={L(locale, h.href)} onClick={() => { remember(q); onClose(); }} className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 hover:bg-white/6">
                          <span className="min-w-0">
                            <span className="block truncate text-[13.5px] text-ink-hi">{h.name}</span>
                            {h.summary && <span className="block truncate text-[11.5px] text-ink-faint">{h.summary}</span>}
                          </span>
                          <SourceBadge status={h.sourceStatus as any} size="sm" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
