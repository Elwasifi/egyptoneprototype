'use client';
import * as React from 'react';
import Link from 'next/link';
import { LogoImage, Badge } from '@egypt-one/ui';
import { SIDEBAR_GROUPS } from '@/lib/nav';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

const GROUP_ICON: Record<string, string> = {
  'Plan your trip': '✎',
  'Discover Egypt': '◎',
  'Invest & business': '◆',
  'Services': '✦',
};

/**
 * Site-wide navigation rail — the desktop replacement for the old horizontal
 * mega-menu. Always visible at lg: and up (a fixed-width icon strip); a
 * group's full link list opens as a flyout on hover/click, the same pattern
 * the old mega-menu used, just anchored to a vertical rail instead of a
 * horizontal row. Hidden below lg: — the existing mobile drawer + BottomNav
 * (sourced from the same SIDEBAR_GROUPS data) cover navigation there instead,
 * so there is exactly one nav system active at any given viewport width.
 */
export function AppRailNav({ locale, messages }: { locale: Locale; messages: Record<string, string> }) {
  const t = (k: string) => messages[k] ?? k;
  const [open, setOpen] = React.useState<string | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const openGroup = (title: string) => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    setOpen(title);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 300);
  };
  React.useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  return (
    <aside className="fixed inset-y-0 start-0 z-40 hidden w-[68px] flex-col items-center border-e border-white/8 bg-raised/80 py-4 backdrop-blur lg:flex">
      <Link href={L(locale, '/')} aria-label="Egypt One home" className="mb-4 shrink-0">
        <LogoImage size={30} />
      </Link>

      <nav aria-label="Primary" className="flex flex-1 flex-col items-center gap-1.5">
        {SIDEBAR_GROUPS.map((group) => (
          <div
            key={group.title}
            className="relative"
            onMouseEnter={() => openGroup(group.title)}
            onMouseLeave={scheduleClose}
          >
            <button
              aria-expanded={open === group.title}
              aria-haspopup="true"
              aria-label={group.title}
              onClick={() => (open === group.title ? setOpen(null) : openGroup(group.title))}
              className={`grid h-11 w-11 place-items-center rounded-lg text-[19px] transition-colors ${
                open === group.title ? 'bg-gold-600/16 text-gold-200' : 'text-ink-mid hover:bg-white/6 hover:text-ink-hi'
              }`}
            >
              <span aria-hidden="true">{GROUP_ICON[group.title] ?? '◆'}</span>
            </button>

            {open === group.title && (
              <div
                className="absolute top-0 start-full ms-2 w-64 rounded-xl border border-white/10 glass p-2 shadow-2xl"
                onMouseEnter={() => openGroup(group.title)}
                onMouseLeave={scheduleClose}
              >
                <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">{group.title}</div>
                <ul className="grid gap-0.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={L(locale, item.href)}
                        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-ink-mid transition-colors hover:bg-white/6 hover:text-ink-hi"
                      >
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.badge && <Badge tone={item.badge === 'Hot' ? 'danger' : 'gold'}>{item.badge}</Badge>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </nav>

      <Link
        href={L(locale, '/support')}
        aria-label={t('nav.support')}
        className="mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-lg text-[17px] text-ink-mid hover:bg-white/6 hover:text-ink-hi"
      >
        <span aria-hidden="true">?</span>
      </Link>
    </aside>
  );
}
