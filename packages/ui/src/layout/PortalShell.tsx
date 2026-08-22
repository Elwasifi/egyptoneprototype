import * as React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { Logo } from '../brand/Logo';
import { Badge } from '../primitives';

export type PortalNavItem = { href: string; label: string; hint?: string };

/**
 * Shell for the five authenticated portal experiences (account, provider,
 * partner, government, admin). Each portal keeps its own navigation and colour
 * accent while sharing the design system, header and audit affordances.
 */
export function PortalShell({
  portal, title, subtitle, nav, active, children, roleNote, accent = 'gold',
}: {
  portal: string;
  title: string;
  subtitle?: string;
  nav: PortalNavItem[];
  active: string;
  children: React.ReactNode;
  roleNote?: string;
  accent?: 'gold' | 'nile' | 'royal' | 'emerald';
}) {
  const accents: Record<string, string> = {
    gold: 'from-gold-600/20 to-transparent border-gold-600/30',
    nile: 'from-nile/22 to-transparent border-nile/35',
    royal: 'from-royal/25 to-transparent border-royal/40',
    emerald: 'from-emerald/22 to-transparent border-emerald/35',
  };
  return (
    <div className="mx-auto grid w-full max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[248px_1fr] lg:px-6">
      <nav aria-label={`${portal} navigation`} className="h-fit lg:sticky lg:top-20">
        <div className={clsx('mb-4 rounded-[14px] border bg-gradient-to-b p-4', accents[accent])}>
          <Logo variant="compact" size={26} />
          <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-ink-faint">{portal}</div>
          {roleNote && <div className="mt-1.5 text-[11.5px] text-ink-low">{roleNote}</div>}
        </div>
        <ul className="surface grid gap-0.5 p-2">
          {nav.map((n) => {
            const isActive = active === n.href;
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={clsx('block rounded-lg px-3 py-2.5 text-[13px] transition-colors',
                    isActive ? 'bg-gold-600/16 font-medium text-gold-200' : 'text-ink-mid hover:bg-white/5 hover:text-ink-hi')}
                >
                  {n.label}
                  {n.hint && <span className="mt-0.5 block text-[10.5px] text-ink-faint">{n.hint}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <main id="main" className="min-w-0">
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[26px] font-semibold">{title}</h1>
            <Badge tone="gold">Prototype</Badge>
          </div>
          {subtitle && <p className="mt-2 max-w-3xl text-[13.5px] text-ink-low">{subtitle}</p>}
          <div className="gold-rule mt-5" />
        </header>
        {children}
      </main>
    </div>
  );
}
