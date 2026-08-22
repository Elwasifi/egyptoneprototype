/** Egypt One design tokens. Single source of truth for colour, type and depth. */
export const colours = {
  bg: { void: '#040C13', base: '#06111A', raised: '#071421', panel: '#0A1824', elevated: '#0D1B27' },
  gold: { 900: '#7A5A24', 700: '#96702D', 600: '#B88A3B', 500: '#C99B4A', 400: '#D8A84E', 300: '#E6C077', 100: '#F5E3BD' },
  nile: '#2E7D9A', turquoise: '#3FB6AD', bronze: '#A2703F', sandstone: '#D8C4A0',
  royal: '#5B4B8A', emerald: '#2F8F6B', sunset: '#D97A3C',
  ink: { hi: '#F4EFE6', mid: '#C6CFD8', low: '#8B97A3', faint: '#5A6672' },
  line: { hair: 'rgba(200,155,74,0.22)', soft: 'rgba(255,255,255,0.08)' },
  state: { ok: '#3FB68A', warn: '#D8A84E', danger: '#D9614C', info: '#4E9BD1' },
} as const;

export const sourceStatusColour = {
  LIVE: colours.state.ok,
  VERIFIED_DATA: colours.turquoise,
  PARTNER_DATA: colours.nile,
  DEMO: colours.gold[500],
  SIMULATED: colours.royal,
  PLANNED_INTEGRATION: colours.ink.low,
} as const;

export const fonts = {
  sans: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  arabic: "'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Segoe UI', sans-serif",
  display: "'Cormorant Garamond', 'Plus Jakarta Sans', Georgia, serif",
  mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
} as const;

export const radii = { sm: '6px', md: '10px', lg: '16px', xl: '22px', pill: '999px' } as const;

export const shadows = {
  panel: '0 1px 0 rgba(255,255,255,0.04) inset, 0 18px 44px -22px rgba(0,0,0,0.9)',
  lift: '0 24px 60px -26px rgba(0,0,0,0.95), 0 0 0 1px rgba(200,155,74,0.16)',
  glow: '0 0 0 1px rgba(216,168,78,0.35), 0 12px 40px -14px rgba(216,168,78,0.28)',
} as const;

export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 } as const;
