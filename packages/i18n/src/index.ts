import en from './messages/en.json';
import ar from './messages/ar.json';
import fr from './messages/fr.json';
import de from './messages/de.json';
import es from './messages/es.json';
import it from './messages/it.json';
import zh from './messages/zh.json';
import ja from './messages/ja.json';
import ru from './messages/ru.json';
import el from './messages/el.json';
import hi from './messages/hi.json';
import { DEFAULT_LOCALE, type Locale } from './config';

export * from './config';

type Dict = Record<string, string>;
const DICTS: Record<Locale, Dict> = { en, ar, fr, de, es, it, zh, ja, ru, el, hi } as unknown as Record<Locale, Dict>;

export function getMessages(locale: Locale): Dict {
  return { ...DICTS[DEFAULT_LOCALE], ...(DICTS[locale] ?? {}) };
}

/** Translator factory. Text is never hard-coded in components — always t('key'). */
export function createTranslator(locale: Locale) {
  const dict = getMessages(locale);
  return function t(key: string, vars?: Record<string, string | number>): string {
    let out = dict[key] ?? DICTS[DEFAULT_LOCALE][key] ?? key;
    if (vars) for (const [k, v] of Object.entries(vars)) out = out.replaceAll(`{${k}}`, String(v));
    return out;
  };
}
export type Translator = ReturnType<typeof createTranslator>;

/** Keys missing from a locale, for the admin translation console. */
export function missingKeys(locale: Locale): string[] {
  const base = Object.keys(DICTS[DEFAULT_LOCALE]);
  const target = DICTS[locale] ?? {};
  return base.filter((k) => !(k in target));
}
