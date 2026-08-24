import { SITE } from '@/lib/site';
import { FacebookIcon, InstagramIcon, TikTokIcon, XIcon, YoutubeIcon } from './SocialIcons';

const SOCIALS = [
  { label: 'Facebook', href: SITE.social.facebook, Icon: FacebookIcon },
  { label: 'TikTok', href: SITE.social.tiktok, Icon: TikTokIcon },
  { label: 'Instagram', href: SITE.social.instagram, Icon: InstagramIcon },
  { label: 'X', href: SITE.social.x, Icon: XIcon },
  { label: 'YouTube', href: SITE.social.youtube, Icon: YoutubeIcon },
];

export function SocialBar({ messages }: { messages: Record<string, string> }) {
  const t = (k: string) => messages[k] ?? k;
  return (
    <div className="border-t border-white/8 bg-void/40">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-5 px-4 py-7 lg:flex-row lg:justify-between lg:px-6">
        <div className="text-center lg:text-start">
          <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-500/80">{t('footer.social.eyebrow')}</div>
          <div className="mt-1.5 text-[13.5px] text-ink-low">{t('footer.social.body')}</div>
        </div>
        <ul className="flex flex-nowrap items-center justify-center gap-2">
          {SOCIALS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                title={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/4 text-gold-300 transition-colors hover:border-gold-500/45 hover:bg-gold-600/14"
              >
                <Icon className="h-[15px] w-[15px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
