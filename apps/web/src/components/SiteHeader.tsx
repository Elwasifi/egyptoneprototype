'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo, LogoImage } from '@egypt-one/ui';
import { LOCALE_META, LOCALES, type Locale } from '@egypt-one/i18n';
import { CURRENCIES } from '@egypt-one/i18n';
import { SIDEBAR_GROUPS } from '@/lib/nav';
import { href as L } from '@/lib/locale';
import { GlobalSearch } from './GlobalSearch';

/**
 * Top bar — search-centric, mirrors the Lovable reference's DashboardTopBar.
 * Primary site discovery now lives in AppRailNav (the persistent left icon
 * rail, lg: and up); this bar keeps the logo, the prominent search trigger,
 * locale/currency, and account/notification/concierge shortcuts. The mobile
 * drawer below (which still owns navigation under lg:, where the rail is
 * hidden) is sourced from the same SIDEBAR_GROUPS data as the rail, so there
 * is one navigation graph, not two.
 */
export function SiteHeader({ locale, messages }: { locale: Locale; messages: Record<string, string> }) {
  const t = (k: string) => messages[k] ?? k;
  const pathname = usePathname();
  const router = useRouter();
  const [drawer, setDrawer] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => { setDrawer(false); }, [pathname]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setDrawer(false); setSearchOpen(false); }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const changeLocale = (next: string) => {
    document.cookie = `eo_locale=${next}; path=/; max-age=31536000; samesite=lax`;
    const rest = pathname.replace(/^\/[a-z]{2}/, '');
    router.push(`/${next}${rest || ''}`);
  };

  return (
    <>
      <header className="sticky top-0 z-30 glass border-b border-white/8">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-2 px-3 sm:gap-3 sm:px-4 lg:px-6">
          <Link href={L(locale, '/')} aria-label="Egypt One home" className="flex min-w-0 shrink-0 items-center gap-2.5 lg:hidden">
            <LogoImage size={28} className="sm:hidden" />
            <LogoImage size={34} className="hidden sm:block" />
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className="hidden h-11 min-w-[110px] max-w-2xl flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 text-[13.5px] text-ink-faint transition-colors hover:border-gold-600/35 md:flex"
          >
            <span aria-hidden="true">⌕</span>
            <span className="flex-1 truncate text-start">{t('search.placeholder')}</span>
            <kbd className="rounded border border-white/12 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>
          <button
            onClick={() => setSearchOpen(true)}
            aria-label={t('search.placeholder')}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-mid hover:bg-white/6 md:hidden"
          >
            ⌕
          </button>

          <div className="ms-auto flex items-center gap-1.5">
            <label className="sr-only" htmlFor="locale-select">{t('nav.language')}</label>
            <select
              id="locale-select" value={locale} onChange={(e) => changeLocale(e.target.value)}
              className="hidden h-9 rounded-lg border border-white/10 bg-panel px-2 text-[12px] text-ink-mid sm:block"
            >
              {LOCALES.map((l) => <option key={l} value={l}>{LOCALE_META[l].native}</option>)}
            </select>

            <label className="sr-only" htmlFor="currency-select">{t('nav.currency')}</label>
            <select id="currency-select" defaultValue="USD" className="hidden h-9 rounded-lg border border-white/10 bg-panel px-2 text-[12px] text-ink-mid 2xl:block">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <Link href={L(locale, '/account')} aria-label={t('nav.favorites')} className="hidden h-9 w-9 items-center justify-center rounded-lg text-ink-low hover:bg-white/6 hover:text-gold-300 sm:flex">♡</Link>
            <Link href={L(locale, '/account')} aria-label={t('nav.notifications')} className="relative hidden h-9 w-9 items-center justify-center rounded-lg text-ink-low hover:bg-white/6 hover:text-gold-300 sm:flex">
              ◔<span className="absolute -end-0.5 -top-0.5 rounded-full bg-gold-500 px-1 text-[9px] font-bold text-[#0a1017]">3</span>
            </Link>

            <Link href={L(locale, '/ai')} className="hidden h-9 items-center gap-1.5 rounded-lg border border-gold-600/40 px-3 text-[12.5px] font-medium text-gold-300 hover:bg-gold-600/12 md:flex">
              ✦ {t('nav.concierge')}
            </Link>

            <Link href={L(locale, '/account')} className="flex h-9 items-center gap-2 rounded-lg bg-white/6 px-2.5 text-[12.5px] text-ink-hi hover:bg-white/10">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-gold-400 to-gold-700 text-[10px] font-bold text-[#0a1017]">EO</span>
              <span className="hidden 2xl:inline">{t('nav.account')}</span>
            </Link>

            <button onClick={() => setDrawer(true)} aria-label={t('nav.menu')} className="grid h-9 w-9 place-items-center rounded-lg text-ink-mid hover:bg-white/6 lg:hidden">☰</button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — sourced from the same SIDEBAR_GROUPS the desktop rail uses */}
      {drawer && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
          <div className="absolute inset-0 bg-void/80" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 end-0 flex w-[88%] max-w-sm flex-col overflow-y-auto border-s border-white/10 bg-panel">
            <div className="flex items-center justify-between border-b border-white/8 p-4">
              <Logo variant="compact" size={28} />
              <button onClick={() => setDrawer(false)} aria-label={t('nav.close')} className="grid h-9 w-9 place-items-center rounded-lg text-ink-mid hover:bg-white/6">✕</button>
            </div>
            <div className="p-4">
              <button onClick={() => { setDrawer(false); setSearchOpen(true); }} className="mb-4 flex h-11 w-full items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-3 text-[13px] text-ink-faint">
                ⌕ {t('search.placeholder')}
              </button>
              <select value={locale} onChange={(e) => changeLocale(e.target.value)} aria-label={t('nav.language')} className="mb-4 h-11 w-full rounded-lg border border-white/10 bg-raised px-3 text-[13px] text-ink-hi">
                {LOCALES.map((l) => <option key={l} value={l}>{LOCALE_META[l].flag} {LOCALE_META[l].native}</option>)}
              </select>
              {SIDEBAR_GROUPS.map((group) => (
                <details key={group.title} className="border-b border-white/7 py-1">
                  <summary className="cursor-pointer list-none py-2.5 text-[14px] font-medium text-ink-hi">{group.title}</summary>
                  <div className="pb-2 ps-2">
                    <ul>
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link href={L(locale, item.href)} className="block py-1.5 text-[13px] text-ink-mid">{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
              <div className="mt-4 grid gap-2">
                <Link href={L(locale, '/ai')} className="rounded-lg border border-gold-600/40 px-3 py-3 text-center text-[13px] font-medium text-gold-300">✦ {t('nav.concierge')}</Link>
                <Link href={L(locale, '/account')} className="rounded-lg bg-white/6 px-3 py-3 text-center text-[13px] text-ink-hi">{t('nav.account')}</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {searchOpen && <GlobalSearch locale={locale} messages={messages} onClose={() => setSearchOpen(false)} />}
    </>
  );
}
