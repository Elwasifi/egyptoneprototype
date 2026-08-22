import { LOCALES, DEFAULT_LOCALE, isLocale, createTranslator, LOCALE_META, type Locale } from '@egypt-one/i18n';

export { LOCALES, DEFAULT_LOCALE, isLocale, LOCALE_META };
export type { Locale };

/** Resolve a route param into a Locale, falling back to the default. */
export function resolveLocale(raw: string | undefined): Locale {
  return raw && isLocale(raw) ? raw : DEFAULT_LOCALE;
}

export function t(locale: Locale) {
  return createTranslator(locale);
}

/** Prefix an internal href with the active locale. */
export function href(locale: Locale, path: string) {
  if (path.startsWith('http') || path.startsWith('#')) return path;
  const [p, hash] = path.split('#');
  const clean = p === '/' ? '' : p;
  return `/${locale}${clean}${hash ? `#${hash}` : ''}`;
}
