import * as React from 'react';
import { notFound } from 'next/navigation';
import { getMessages, LOCALE_META, LOCALES, isLocale } from '@egypt-one/i18n';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { TopUtilityBar } from '@/components/TopUtilityBar';
import { BottomNav } from '@/components/BottomNav';
import { ConciergeLauncher } from '@/components/Concierge';
import { DemoBanner } from '@/components/DemoBanner';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children, params,
}: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  const meta = LOCALE_META[locale];

  return (
    <html lang={locale} dir={meta.dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap"
        />
        {LOCALES.map((l) => (
          <link key={l} rel="alternate" hrefLang={l} href={`/${l}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href="/en" />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <DemoBanner message={messages['demo.banner']} />
        <TopUtilityBar locale={locale} messages={messages} />
        <SiteHeader locale={locale} messages={messages} />
        <div className="pb-20 lg:pb-0">{children}</div>
        <SiteFooter locale={locale} messages={messages} />
        <BottomNav locale={locale} messages={messages} />
        <ConciergeLauncher locale={locale} messages={messages} />
      </body>
    </html>
  );
}
