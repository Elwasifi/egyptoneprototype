# Localization

## Locales

8 initial locales, declared once in `packages/i18n/src/config.ts`:
Arabic (`ar`, RTL), English (`en`, default), French (`fr`), Chinese (`zh`),
Japanese (`ja`), Russian (`ru`), Greek (`el`), Hindi (`hi`). `LOCALE_META`
carries each locale's label, native name, direction, preferred font stack
and flag glyph.

## Routing

Every page lives under a `[locale]` dynamic segment
(`apps/web/src/app/[locale]/...`); `generateStaticParams()` produces static
params for all 8 locales so the whole route tree is statically generated
per locale at build time. `middleware.ts` redirects an un-prefixed request
to the right locale using, in order: an `eo_locale` cookie, the
`Accept-Language` header, then `DEFAULT_LOCALE`.

## Translation

Flat key/value JSON dictionaries per locale under
`packages/i18n/src/messages/`. `createTranslator(locale)` returns a
`t(key, vars?)` function that falls back to the English string (never to a
raw key) if a translation is missing, and `missingKeys(locale)` gives a
coverage report for translation QA. **No user-facing string is hardcoded in
a component** — every string routes through `t()` or a locale-aware helper.

## RTL

`dirFor(locale)` returns `'rtl'` only for Arabic. `[locale]/layout.tsx` sets
`<html dir={...}>`; `globals.css` swaps the body font stack under
`html[dir="rtl"]` to IBM Plex Sans Arabic.

## Typography

Latin scripts: Plus Jakarta Sans (UI) with Manrope-style weights;
display/editorial accents use Cormorant Garamond. Arabic: IBM Plex Sans
Arabic. Loaded via Google Fonts `<link>`s in `[locale]/layout.tsx`, scoped
per script so no locale pays for fonts it doesn't use.

## SEO across locales

`hreflang` alternate links (including `x-default`) are emitted for every
locale on every page from the same route, and `href()` (aliased `L`) in
`apps/web/src/lib/locale.ts` prefixes every internal link with the current
locale so cross-locale navigation is never a broken link.

## Currency

`CURRENCIES` and `DEMO_FX` in `packages/i18n/src/config.ts` provide
illustrative exchange rates for demo pricing display only — these are not
live FX rates and must not be used for real settlement.
