import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, DEFAULT_LOCALE } from '@egypt-one/i18n';

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Locale routing. Every page lives under /[locale]; unprefixed requests are
 * redirected using the Accept-Language header, then the visitor's own choice
 * (stored in a cookie) wins on subsequent visits.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/_next') || pathname.startsWith('/api') ||
    pathname === '/favicon.ico' || pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' || PUBLIC_FILE.test(pathname)
  ) return NextResponse.next();

  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const cookie = req.cookies.get('eo_locale')?.value;
  const header = req.headers.get('accept-language') ?? '';
  const fromHeader = LOCALES.find((l) => header.toLowerCase().startsWith(l));
  const locale = (LOCALES as readonly string[]).includes(cookie ?? '') ? cookie! : (fromHeader ?? DEFAULT_LOCALE);

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/((?!_next|api|.*\\..*).*)'] };
