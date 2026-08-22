'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo, Badge } from '@egypt-one/ui';
import { LOCALE_META, LOCALES, type Locale } from '@egypt-one/i18n';
import { CURRENCIES } from '@egypt-one/i18n';
import { MEGA } from '@/lib/nav';
import { href as L } from '@/lib/locale';
import { GlobalSearch } from './GlobalSearch';

export function SiteHeader({ locale, messages }: { locale: Locale; messages: Record<string, string> }) {
  const t = (k: string) => messages[k] ?? k;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState<string | null>(null);
  const [drawer, setDrawer] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Cancels any pending close — call on entering the trigger or the panel. */
  const openMenu = (key: string) => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpen(key);
  };
  /** Closes after a short grace period, so a diagonal mouse path from the
      trigger to the panel below doesn't register as "left" and snap the
      menu shut before the user can reach it. */
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 300);
  };

  React.useEffect(() => { setOpen(null); setDrawer(false); }, [pathname]);
  React.useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(null); setDrawer(false); setSearchOpen(false); }
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
      <header className="sticky top-0 z-50 glass border-b border-white/8">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 lg:px-6">
          <Link href={L(locale, '/')} aria-label="Egypt One home" className="shrink-0">
            <span className="hidden sm:inline-flex"><Logo variant="full" size={34} /></span>
            <span className="sm:hidden"><Logo variant="compact" size={28} /></span>
          </Link>

          <button
            onClick={() => setSearchOpen(true)}
            className="ms-2 hidden h-10 min-w-[110px] max-w-[420px] flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/4 px-3 text-[13px] text-ink-faint transition-colors hover:border-gold-600/35 md:flex"
          >
            <span aria-hidden="true">⌕</span>
            <span className="flex-1 truncate text-start">{t('search.placeholder')}</span>
            <kbd className="rounded border border-white/12 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>

          <nav aria-label="Primary" className="ms-auto hidden items-center gap-0.5 lg:flex">
            <Link href={L(locale, '/')} className="truncate rounded-lg px-2.5 py-2 text-[13.5px] text-ink-mid hover:bg-white/6 hover:text-ink-hi">{t('nav.home')}</Link>
            {MEGA.map((s) => (
              <div key={s.key} className="relative" onMouseEnter={() => openMenu(s.key)} onMouseLeave={scheduleClose}>
                <button
                  aria-expanded={open === s.key} aria-haspopup="true"
                  onClick={() => (open === s.key ? setOpen(null) : openMenu(s.key))}
                  className={`truncate rounded-lg px-2.5 py-2 text-[13.5px] transition-colors ${open === s.key ? 'bg-gold-600/14 text-gold-200' : 'text-ink-mid hover:bg-white/6 hover:text-ink-hi'}`}
                >
                  {t(s.label)}
                </button>
              </div>
            ))}
            <Link href={L(locale, '/map')} className="truncate rounded-lg px-2.5 py-2 text-[13.5px] text-ink-mid hover:bg-white/6 hover:text-ink-hi">{t('nav.map')}</Link>
            <Link href={L(locale, '/support')} className="truncate rounded-lg px-2.5 py-2 text-[13.5px] text-ink-mid hover:bg-white/6 hover:text-ink-hi">{t('nav.support')}</Link>
          </nav>

          <div className="ms-auto flex items-center gap-1.5 lg:ms-0">
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

        {/* Mega menu panel */}
        {open && (
          <div
            className="absolute inset-x-0 top-16 hidden border-b border-white/8 glass shadow-2xl lg:block"
            onMouseEnter={() => openMenu(open)} onMouseLeave={scheduleClose}
          >
            {MEGA.filter((s) => s.key === open).map((s) => (
              <div key={s.key} className="mx-auto grid w-full max-w-[1600px] gap-8 px-6 py-7 lg:grid-cols-[1fr_280px]">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {s.columns.map((c) => (
                    <div key={c.title}>
                      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">{t(c.title)}</div>
                      <ul className="grid gap-0.5">
                        {c.items.map((i) => (
                          <li key={i.href}>
                            <Link href={L(locale, i.href)} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-ink-mid transition-colors hover:bg-white/6 hover:text-ink-hi">
                              {t(i.label)}
                              {i.badge && <Badge tone={i.badge === 'Hot' ? 'danger' : 'gold'}>{i.badge}</Badge>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {s.feature && (
                  <div className="surface-gold p-5">
                    <div className="text-[15px] font-semibold text-gold-200">{t(s.feature.title)}</div>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-ink-low">{t(s.feature.body)}</p>
                    <Link href={L(locale, s.feature.href)} className="mt-4 inline-flex rounded-lg bg-gold-500/90 px-3 py-2 text-[12.5px] font-semibold text-[#0a1017] hover:bg-gold-400">
                      {t(s.feature.cta)} →
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </header>

      {/* Mobile drawer */}
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
              {MEGA.map((s) => (
                <details key={s.key} className="border-b border-white/7 py-1">
                  <summary className="cursor-pointer list-none py-2.5 text-[14px] font-medium text-ink-hi">{t(s.label)}</summary>
                  <div className="pb-2 ps-2">
                    {s.columns.map((c) => (
                      <div key={c.title} className="mb-3">
                        <div className="mb-1 text-[10.5px] uppercase tracking-wider text-gold-600">{t(c.title)}</div>
                        <ul>
                          {c.items.map((i) => (
                            <li key={i.href}>
                              <Link href={L(locale, i.href)} className="block py-1.5 text-[13px] text-ink-mid">{t(i.label)}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
