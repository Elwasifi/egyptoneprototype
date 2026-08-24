import Link from 'next/link';
import { Logo } from '@egypt-one/ui';
import { FOOTER } from '@/lib/nav';
import { TRUST_ITEMS } from '@/lib/trust';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';
import { SocialBar } from './SocialBar';
import { AppleIcon, GooglePlayIcon } from './SocialIcons';

const APP_STORES = [
  { label: 'App Store', Icon: AppleIcon },
  { label: 'Google Play', Icon: GooglePlayIcon },
];

export function SiteFooter({ locale, messages }: { locale: Locale; messages: Record<string, string> }) {
  const t = (k: string) => messages[k] ?? k;
  return (
    <footer className="mt-20 border-t border-white/8 bg-raised/60">
      <SocialBar messages={messages} />
      <div className="mx-auto grid w-full max-w-[1600px] gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3 lg:px-6">
        {TRUST_ITEMS.map((item) => (
          <div key={item.key} className="flex gap-3">
            <span className="mt-0.5 text-gold-500" aria-hidden="true">{item.icon}</span>
            <div>
              <div className="text-[12.5px] font-semibold text-ink-hi">{t(`${item.key}.title`)}</div>
              <div className="mt-0.5 text-[11.5px] leading-relaxed text-ink-faint">{t(`${item.key}.body`)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-10 lg:grid-cols-[300px_1fr] lg:px-6">
          <div>
            <Logo variant="full" size={40} />
            <p className="mt-4 max-w-xs text-[12px] leading-relaxed text-ink-faint">{t('footer.note')}</p>
            <div className="mt-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">{t('footer.downloadApp')}</div>
              <ul className="mt-3 flex items-center gap-3">
                {APP_STORES.map(({ label, Icon }) => (
                  <li key={label}>
                    <span
                      title={label}
                      aria-label={label}
                      className="grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-white/4 text-gold-300 transition-colors hover:border-gold-500/45 hover:bg-gold-600/14"
                    >
                      <Icon className="h-7 w-7" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {FOOTER.map((col) => (
              <div key={col.title}>
                <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">{t(col.title)}</div>
                <ul className="grid gap-1.5">
                  {col.items.map((i) => (
                    <li key={i.href + i.label}>
                      <Link href={L(locale, i.href)} className="text-[12.5px] text-ink-low transition-colors hover:text-gold-300">{t(i.label)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-3 px-4 py-5 text-[11.5px] text-ink-faint sm:flex-row lg:px-6">
          <span>© {new Date().getFullYear()} Egypt One (prototype). {t('footer.rights')}</span>
          <span className="text-center sm:text-end">
            {t('footer.disclaimer')}
          </span>
        </div>
      </div>
    </footer>
  );
}
