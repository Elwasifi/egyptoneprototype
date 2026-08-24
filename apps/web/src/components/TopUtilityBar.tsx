import { mailto, SITE } from '@/lib/site';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';
import Link from 'next/link';

export function TopUtilityBar({ locale, messages }: { locale: Locale; messages: Record<string, string> }) {
  const t = (k: string) => messages[k] ?? k;
  return (
    <div className="hidden border-b border-white/8 bg-void/60 text-[11px] text-ink-faint md:block">
      <div className="mx-auto flex h-9 w-full max-w-[1600px] items-center justify-end gap-5 px-4 lg:px-6">
        <a href={mailto('Egypt One — support request')} dir="ltr" className="transition-colors hover:text-gold-300">
          {SITE.email}
        </a>
        <Link href={L(locale, '/support')} className="transition-colors hover:text-gold-300">
          {t('nav.support')}
        </Link>
      </div>
    </div>
  );
}
