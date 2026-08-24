import Link from 'next/link';
import { SmartImage } from '@egypt-one/ui';

const CARDS = [
  { href: '/governorates', titleKey: 'section.governorates', subKey: 'section.governorates.sub', subject: 'desert' },
  { href: '/heritage', titleKey: 'section.heritage', subKey: 'section.heritage.sub', subject: 'temple' },
  { href: '/nile', titleKey: 'water.nile', subKey: 'water.sub', subject: 'nile' },
  { href: '/invest', titleKey: 'section.invest', subKey: 'invest.sub', subject: 'city' },
  { href: '/marketplace', titleKey: 'section.marketplace', subKey: 'marketplace.affiliate.sub', subject: 'market' },
  { href: '/egypt-through-time', titleKey: 'section.time', subKey: 'section.time.sub', subject: 'pyramids' },
] as const;

/**
 * Repo2's "Discover Egypt in depth" photo-card teaser. Every card links to a
 * real, already-built section of this site — no separate data source of its
 * own, so no DEMO badge is needed (it's navigation, not a data claim).
 */
export function HomeDiscoverTeaser({ t, l }: { t: (k: string) => string; l: (p: string) => string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((c) => (
        <Link key={c.href} href={l(c.href)} className="surface lift group relative overflow-hidden p-0">
          <SmartImage seed={c.href} subject={c.subject as never} alt={t(c.titleKey)} ratio="4/3" className="rounded-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-[15px] font-semibold text-ink-hi group-hover:text-gold-200">{t(c.titleKey)}</p>
            <p className="mt-1 line-clamp-1 text-[11.5px] text-ink-mid">{t(c.subKey)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
