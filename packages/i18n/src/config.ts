export const LOCALES = ['en', 'ar', 'fr', 'de', 'es', 'it', 'ru', 'zh', 'hi'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const RTL_LOCALES: Locale[] = ['ar'];

export const LOCALE_META: Record<Locale, { label: string; native: string; dir: 'ltr' | 'rtl'; font: 'sans' | 'arabic'; flag: string }> = {
  en: { label: 'English', native: 'English', dir: 'ltr', font: 'sans', flag: '🇬🇧' },
  ar: { label: 'Arabic', native: 'العربية', dir: 'rtl', font: 'arabic', flag: '🇪🇬' },
  fr: { label: 'French', native: 'Français', dir: 'ltr', font: 'sans', flag: '🇫🇷' },
  de: { label: 'German', native: 'Deutsch', dir: 'ltr', font: 'sans', flag: '🇩🇪' },
  es: { label: 'Spanish', native: 'Español', dir: 'ltr', font: 'sans', flag: '🇪🇸' },
  it: { label: 'Italian', native: 'Italiano', dir: 'ltr', font: 'sans', flag: '🇮🇹' },
  ru: { label: 'Russian', native: 'Русский', dir: 'ltr', font: 'sans', flag: '🇷🇺' },
  zh: { label: 'Chinese', native: '中文', dir: 'ltr', font: 'sans', flag: '🇨🇳' },
  hi: { label: 'Hindi', native: 'हिन्दी', dir: 'ltr', font: 'sans', flag: '🇮🇳' },
};

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);
export const dirFor = (l: Locale) => LOCALE_META[l].dir;

export const CURRENCIES = ['USD', 'EGP', 'EUR', 'GBP', 'SAR', 'AED', 'CNY', 'JPY'] as const;
export type Currency = (typeof CURRENCIES)[number];
/** Illustrative demo rates — replace with a licensed FX feed adapter. */
export const DEMO_FX: Record<Currency, number> = { USD: 1, EGP: 48.6, EUR: 0.92, GBP: 0.79, SAR: 3.75, AED: 3.67, CNY: 7.24, JPY: 156.2 };
