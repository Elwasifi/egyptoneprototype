'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { href as L } from '@/lib/locale';
import { SourceBadge } from '@egypt-one/ui';
import type { Locale } from '@egypt-one/i18n';

const TABS = [
  { key: 'explore', label: 'Explore' },
  { key: 'stays', label: 'Stays' },
  { key: 'flights', label: 'Flights' },
  { key: 'activities', label: 'Activities' },
  { key: 'transport', label: 'Transport' },
];
const ROUTE: Record<string, string> = { explore: '/search', stays: '/hotels', flights: '/flights', activities: '/activities', transport: '/transport' };

type Hit = { id: string; name: string; kind: string; href: string; summary?: string; sourceStatus: string };

export function HeroSearch({ locale, messages, popular }: { locale: Locale; messages: Record<string, string>; popular: { label: string; href: string }[] }) {
  const t = (k: string) => messages[k] ?? k;
  const router = useRouter();
  const [tab, setTab] = React.useState('explore');
  const [where, setWhere] = React.useState('');
  const [hits, setHits] = React.useState<Hit[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [openHits, setOpenHits] = React.useState(false);

  // Live typeahead against the platform's real unified search endpoint.
  React.useEffect(() => {
    const q = where.trim();
    if (q.length < 2) { setHits([]); setLoading(false); return; }
    const ctrl = new AbortController();
    setLoading(true);
    const id = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => setHits((d.hits ?? []).slice(0, 6)))
        .catch(() => { /* aborted or offline — the form still submits */ })
        .finally(() => setLoading(false));
    }, 220);
    return () => { clearTimeout(id); ctrl.abort(); };
  }, [where]);

  return (
    <div className="surface p-3 sm:p-4">
      <div role="tablist" aria-label="Search type" className="mb-3 flex gap-1 overflow-x-auto no-scrollbar">
        {TABS.map((x) => (
          <button
            key={x.key} role="tab" aria-selected={tab === x.key} onClick={() => setTab(x.key)}
            className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-[12.5px] font-medium transition-colors ${tab === x.key ? 'bg-gold-500 text-[#0a1017]' : 'text-ink-low hover:bg-white/6 hover:text-ink-hi'}`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); router.push(L(locale, `${ROUTE[tab]}${where ? `?q=${encodeURIComponent(where)}` : ''}`)); }}
        className="grid gap-2 md:grid-cols-[1.6fr_1.1fr_1fr_auto]"
      >
        <div className="relative">
          <div className="flex h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-3">
            <span aria-hidden="true" className="text-gold-500">⌕</span>
            <input
              value={where} onChange={(e) => { setWhere(e.target.value); setOpenHits(true); }}
              onFocus={() => setOpenHits(true)}
              onBlur={() => setTimeout(() => setOpenHits(false), 150)}
              role="combobox" aria-expanded={openHits && hits.length > 0} aria-controls="hero-search-hits" aria-autocomplete="list"
              placeholder={t('search.placeholder')} aria-label={t('search.placeholder')}
              className="h-full w-full bg-transparent text-[13.5px] text-ink-hi outline-none placeholder:text-ink-faint"
            />
            {loading && <span aria-hidden="true" className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-gold-500/70" />}
          </div>
          {openHits && hits.length > 0 && (
            <ul id="hero-search-hits" role="listbox" className="absolute inset-x-0 top-[calc(100%+6px)] z-30 max-h-[300px] overflow-y-auto rounded-lg border border-white/10 bg-panel/95 p-1.5 shadow-xl backdrop-blur">
              {hits.map((h) => (
                <li key={h.id} role="option" aria-selected="false">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setOpenHits(false); router.push(L(locale, h.href)); }}
                    className="flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-start hover:bg-white/6"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] text-ink-hi">{h.name}</span>
                      <span className="block truncate text-[11px] text-ink-faint">{h.kind}</span>
                    </span>
                    <SourceBadge status={h.sourceStatus as never} size="sm" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-3">
          <span aria-hidden="true" className="text-gold-500">▤</span>
          <input type="text" onFocus={(e) => (e.currentTarget.type = 'date')} placeholder={t('search.dates')} aria-label={t('search.dates')} className="h-full w-full bg-transparent text-[13.5px] text-ink-hi outline-none placeholder:text-ink-faint" />
        </div>
        <div className="flex h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-3">
          <span aria-hidden="true" className="text-gold-500">☺</span>
          <select aria-label={t('search.travellers')} className="h-full w-full bg-transparent text-[13.5px] text-ink-hi outline-none">
            <option className="bg-panel">2 adults · 0 children</option>
            <option className="bg-panel">1 adult</option>
            <option className="bg-panel">2 adults · 2 children</option>
            <option className="bg-panel">Group (6+)</option>
          </select>
        </div>
        <button type="submit" className="h-12 rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 px-7 text-[14px] font-semibold text-[#0a1017] hover:from-gold-300">
          {t('search.submit')}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11.5px]">
        <span className="text-ink-faint">{t('search.popular')}:</span>
        {popular.map((p) => (
          <a key={p.href} href={L(locale, p.href)} className="rounded-full border border-white/9 px-2.5 py-1 text-ink-low transition-colors hover:border-gold-600/40 hover:text-gold-300">{p.label}</a>
        ))}
      </div>
    </div>
  );
}
