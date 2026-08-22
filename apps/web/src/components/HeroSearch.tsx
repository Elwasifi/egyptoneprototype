'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

const TABS = [
  { key: 'explore', label: 'Explore' },
  { key: 'stays', label: 'Stays' },
  { key: 'flights', label: 'Flights' },
  { key: 'activities', label: 'Activities' },
  { key: 'transport', label: 'Transport' },
];
const ROUTE: Record<string, string> = { explore: '/search', stays: '/hotels', flights: '/flights', activities: '/activities', transport: '/transport' };

export function HeroSearch({ locale, messages, popular }: { locale: Locale; messages: Record<string, string>; popular: { label: string; href: string }[] }) {
  const t = (k: string) => messages[k] ?? k;
  const router = useRouter();
  const [tab, setTab] = React.useState('explore');
  const [where, setWhere] = React.useState('');

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
        <div className="flex h-12 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-3">
          <span aria-hidden="true" className="text-gold-500">⌕</span>
          <input
            value={where} onChange={(e) => setWhere(e.target.value)}
            placeholder={t('search.placeholder')} aria-label={t('search.placeholder')}
            className="h-full w-full bg-transparent text-[13.5px] text-ink-hi outline-none placeholder:text-ink-faint"
          />
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
