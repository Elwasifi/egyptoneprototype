'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

/** Thumb-reachable primary navigation. Mobile only — the desktop uses the header. */
export function BottomNav({ locale, messages }: { locale: Locale; messages: Record<string, string> }) {
  const t = (k: string) => messages[k] ?? k;
  const pathname = usePathname();
  const items = [
    { href: '/', label: t('nav.home'), icon: '⌂' },
    { href: '/discover', label: t('nav.discover'), icon: '◎' },
    { href: '/trip-builder', label: t('nav.plan'), icon: '✎' },
    { href: '/map', label: t('nav.map'), icon: '⊕' },
    { href: '/account', label: t('nav.account'), icon: '☺' },
  ];
  return (
    <nav aria-label="Primary mobile" className="fixed inset-x-0 bottom-0 z-40 glass border-t border-white/10 lg:hidden">
      <ul className="grid grid-cols-5">
        {items.map((i) => {
          const target = L(locale, i.href);
          const active = pathname === target;
          return (
            <li key={i.href}>
              <Link
                href={target} aria-current={active ? 'page' : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[10px] ${active ? 'text-gold-300' : 'text-ink-low'}`}
              >
                <span aria-hidden="true" className="text-[16px]">{i.icon}</span>
                <span className="truncate px-1">{i.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
