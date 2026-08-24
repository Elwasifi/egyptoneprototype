import * as React from 'react';
import clsx from 'clsx';

/**
 * Image abstraction.
 *
 * The prototype ships with no licensed photography, so rather than use
 * watermarked or inaccurate stock this renders a deterministic, brand-consistent
 * vector plate derived from the record's slug. Point `resolveImage` at a CDN or
 * DAM adapter later and every surface picks up real assets with no other change.
 *
 * Every subject gets a bespoke, hand-composed silhouette scene (not a generic
 * reuse of dunes) so the plate reads as a place, not a texture. Everything is a
 * pure function of `seed` — no randomness, no client-only state — so it renders
 * identically on server and client with zero hydration risk, and stays a handful
 * of lightweight vector nodes rather than an embedded raster asset.
 */
export type ImageSubject =
  | 'pyramids' | 'sphinx' | 'temple' | 'nile' | 'sea' | 'desert' | 'oasis'
  | 'city' | 'museum' | 'mosque' | 'church' | 'market' | 'modern' | 'rural' | 'generic';

const PALETTE: Record<ImageSubject, [string, string, string]> = {
  pyramids: ['#1b1408', '#7a5a24', '#d8a84e'],
  sphinx: ['#161206', '#8a6529', '#e6c077'],
  temple: ['#141005', '#96702d', '#d8a84e'],
  nile: ['#04141b', '#1c5a70', '#3fb6ad'],
  sea: ['#031318', '#166274', '#4fd3c8'],
  desert: ['#1a1409', '#8d6a35', '#e2c489'],
  oasis: ['#08170f', '#2f8f6b', '#8ed8b4'],
  city: ['#0a1420', '#2e5675', '#8fb6d8'],
  museum: ['#100e18', '#4a3f70', '#b6a8e0'],
  mosque: ['#0d1520', '#3a6a86', '#9dc9dc'],
  church: ['#101512', '#3f7a63', '#a9dcc4'],
  market: ['#1a0f0a', '#a2703f', '#e0a878'],
  modern: ['#081018', '#2e7d9a', '#7fd4e0'],
  rural: ['#0d1408', '#5f7f34', '#bcd88a'],
  generic: ['#08131d', '#7a5a24', '#c99b4a'],
};

/** Subjects that read as a night/lamplit scene — get a star layer instead of a sun disc. */
const NIGHT_LEANING = new Set<ImageSubject>(['mosque', 'desert', 'oasis', 'market']);

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
/** Small deterministic PRNG-ish picker in [0,1) seeded by hash + salt, for gentle per-plate variance. */
function pick(seed: string, salt: string, mod: number) {
  return hash(seed + '::' + salt) % mod;
}

export function subjectFor(tags: string[] = [], name = ''): ImageSubject {
  const hay = `${tags.join(' ')} ${name}`.toLowerCase();
  const map: [string[], ImageSubject][] = [
    [['pyramid', 'giza', 'saqqara', 'dahshur', 'meidum'], 'pyramids'],
    [['sphinx'], 'sphinx'],
    [['temple', 'karnak', 'luxor', 'abu simbel', 'philae', 'dendera', 'edfu', 'ancient'], 'temple'],
    [['nile', 'cruise', 'felucca', 'aswan'], 'nile'],
    [['sea', 'coast', 'beach', 'red sea', 'diving', 'yacht', 'marina', 'snorkel'], 'sea'],
    [['desert', 'sinai', 'sand', 'safari'], 'desert'],
    [['oasis', 'siwa', 'faiyum', 'kharga', 'dakhla', 'farafra'], 'oasis'],
    [['museum', 'collection', 'gallery'], 'museum'],
    [['mosque', 'islamic', 'ottoman', 'citadel', 'sabil'], 'mosque'],
    [['coptic', 'monastery', 'church', 'christian'], 'church'],
    [['market', 'craft', 'shop', 'bazaar', 'wear', 'product'], 'market'],
    [['new', 'modern', 'capital', 'alamein', 'contemporary', 'invest'], 'modern'],
    [['rural', 'village', 'agriculture', 'farm'], 'rural'],
    [['city', 'cairo', 'alexandria', 'downtown'], 'city'],
  ];
  for (const [keys, subject] of map) if (keys.some((k) => hay.includes(k))) return subject;
  return 'generic';
}

/* ------------------------------------------------------------------ scene composition */
/** Layered dune ground, reused as the base for open-landscape subjects. */
function dunes(seed: string, dark: string, mid: string, count: number, baseY = 128) {
  return Array.from({ length: count }).map((_, i) => {
    const y = baseY + i * 20 + (hash(seed + 'd' + i) % 12);
    return (
      <path key={`dune-${i}`} d={`M0 ${y} Q ${60 + (hash(seed + i) % 90)} ${y - 24 - i * 4} 160 ${y} T 320 ${y - 6} V200 H0 Z`}
        fill={i % 2 ? dark : mid} opacity={0.28 + i * 0.15} />
    );
  });
}

function scenePyramids(seed: string, light: string, mid: string, dark: string) {
  const shift = pick(seed, 'shift', 14) - 7;
  return (
    <>
      {dunes(seed, dark, mid, 2, 138)}
      <path d={`M${58 + shift} 132 L104 68 L150 132 Z`} fill={light} opacity="0.38" />
      <path d={`M${58 + shift} 132 L104 68`} stroke={light} strokeOpacity="0.5" strokeWidth="0.6" fill="none" />
      {[0.28, 0.5, 0.72].map((f, i) => (
        <line key={i} x1={58 + shift + (150 - 58 - shift) * (1 - f) * 0.5} y1={132 - (132 - 68) * f}
          x2={150 - (150 - 58 - shift) * (1 - f) * 0.5} y2={132 - (132 - 68) * f}
          stroke={dark} strokeOpacity="0.5" strokeWidth="0.7" />
      ))}
      <path d="M134 132 L166 84 L198 132 Z" fill={light} opacity="0.29" />
      <path d="M188 132 L210 100 L232 132 Z" fill={light} opacity="0.33" />
      <path d="M20 140 Q34 128 48 140 L48 146 Q34 138 20 146 Z" fill={dark} opacity="0.5" />
      <rect x="252" y="126" width="7" height="4" rx="1" fill={light} opacity="0.30" />
    </>
  );
}

function sceneSphinx(seed: string, light: string, mid: string, dark: string) {
  return (
    <>
      {dunes(seed, dark, mid, 2, 140)}
      <path d="M200 128 L230 90 L260 128 Z" fill={light} opacity="0.26" />
      <g opacity="0.85">
        <path d="M40 150 Q40 122 62 116 L66 96 Q70 84 82 84 Q94 84 98 96 L102 116 Q124 122 124 150 L118 150 Q120 134 108 128 L106 150 L58 150 L56 128 Q44 134 46 150 Z" fill={light} opacity="0.33" />
        <rect x="34" y="148" width="96" height="8" rx="1.5" fill={dark} opacity="0.4" />
      </g>
    </>
  );
}

function sceneTemple(seed: string, light: string, mid: string, dark: string) {
  const cols = 7;
  return (
    <>
      <rect x="0" y="140" width="320" height="60" fill={dark} opacity="0.5" />
      <path d="M18 68 L18 140 L34 140 L34 60 Z" fill={light} opacity="0.28" />
      <rect x="14" y="60" width="24" height="6" rx="1" fill={light} opacity="0.2" />
      {Array.from({ length: cols }).map((_, i) => (
        <g key={i}>
          <rect x={64 + i * 30} y={82} width="13" height="58" rx="1.5" fill={light} opacity="0.29" />
          <rect x={62 + i * 30} y={78} width="17" height="6" rx="1.5" fill={light} opacity="0.33" />
        </g>
      ))}
      <rect x="60" y="140" width={cols * 30 + 12} height="6" rx="1" fill={mid} opacity="0.4" />
    </>
  );
}

function sceneNile(seed: string, light: string, mid: string, dark: string) {
  const boatX = 150 + (pick(seed, 'boat', 60) - 30);
  return (
    <>
      <rect x="0" y="126" width="320" height="74" fill={dark} opacity="0.55" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M0 ${138 + i * 12} H320`} stroke={light} strokeOpacity={0.06 + i * 0.02} strokeWidth="2" />
      ))}
      <path d={`M${boatX} 118 Q ${boatX + 2} 96 ${boatX + 22} 88 Q ${boatX + 4} 92 ${boatX} 118 Z`} fill={light} opacity="0.32" />
      <line x1={boatX} y1="118" x2={boatX} y2="86" stroke={light} strokeOpacity="0.4" strokeWidth="1" />
      <path d={`M${boatX - 16} 122 L${boatX + 20} 122 L${boatX + 12} 130 L${boatX - 8} 130 Z`} fill={dark} opacity="0.6" />
      {[24, 274].map((x, i) => (
        <g key={i} opacity="0.5">
          <path d={`M${x} 128 Q ${x - 2} 108 ${x} 92`} stroke={mid} strokeWidth="2.2" fill="none" />
          <path d={`M${x} 96 q -14 -2 -20 6 M${x} 96 q 14 -2 20 6 M${x} 100 q -12 2 -18 10 M${x} 100 q 12 2 18 10`} stroke={light} strokeOpacity="0.4" strokeWidth="1.4" fill="none" />
        </g>
      ))}
    </>
  );
}

function sceneSea(seed: string, light: string, mid: string, dark: string) {
  const boatX = 190 + (pick(seed, 'yacht', 50) - 25);
  return (
    <>
      <rect x="0" y="132" width="320" height="68" fill={dark} opacity="0.55" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M0 ${140 + i * 11} Q 80 ${136 + i * 11} 160 ${140 + i * 11} T 320 ${140 + i * 11}`} stroke={light} strokeOpacity={0.05 + i * 0.02} strokeWidth="1.6" fill="none" />
      ))}
      <path d="M0 118 Q 60 108 130 116 Q 210 126 320 110 V132 H0 Z" fill={mid} opacity="0.30" />
      <g opacity="0.85">
        <path d={`M${boatX - 14} 126 L${boatX + 16} 126 L${boatX + 9} 133 L${boatX - 7} 133 Z`} fill={dark} opacity="0.7" />
        <line x1={boatX} y1="126" x2={boatX} y2="98" stroke={light} strokeOpacity="0.4" strokeWidth="1" />
        <path d={`M${boatX} 100 L${boatX + 16} 124 L${boatX} 124 Z`} fill={light} opacity="0.28" />
      </g>
    </>
  );
}

function sceneDesert(seed: string, light: string, mid: string, dark: string) {
  return (
    <>
      {dunes(seed, dark, mid, 4, 108)}
      <g opacity="0.4">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${70 + i * 26} 150)`}>
            <path d="M0 0 Q 4 -10 8 0 Q 12 -8 16 0" stroke={dark} strokeWidth="1.6" fill="none" />
            <line x1="2" y1="0" x2="0" y2="8" stroke={dark} strokeWidth="1.4" />
            <line x1="14" y1="0" x2="16" y2="8" stroke={dark} strokeWidth="1.4" />
          </g>
        ))}
      </g>
    </>
  );
}

function sceneOasis(seed: string, light: string, mid: string, dark: string) {
  return (
    <>
      {dunes(seed, dark, mid, 2, 146)}
      <ellipse cx="160" cy="164" rx="86" ry="14" fill={mid} opacity="0.3" />
      {[36, 236, 190].map((x, i) => (
        <g key={i} opacity="0.7">
          <path d={`M${x} 158 Q ${x - 2} 128 ${x} 108`} stroke={dark} strokeWidth="2.4" fill="none" />
          <path d={`M${x} 112 q -16 -4 -24 4 M${x} 112 q 16 -4 24 4 M${x} 118 q -14 1 -20 9 M${x} 118 q 14 1 20 9`} stroke={light} strokeOpacity="0.4" strokeWidth="1.6" fill="none" />
        </g>
      ))}
    </>
  );
}

function sceneCity(seed: string, light: string, mid: string, dark: string) {
  const n = 10;
  return (
    <>
      <rect x="0" y="150" width="320" height="50" fill={dark} opacity="0.5" />
      {Array.from({ length: n }).map((_, i) => {
        const h = 44 + (hash(seed + 'h' + i) % 62);
        const w = 20 + (hash(seed + 'w' + i) % 10);
        const x = 8 + i * 32;
        const y = 150 - h;
        const windows = Math.max(2, Math.floor(h / 16));
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx="1.5" fill={light} opacity="0.26" />
            {Array.from({ length: windows }).map((_, j) => (
              (hash(seed + i + 'w' + j) % 3 !== 0) && (
                <rect key={j} x={x + w / 2 - 5} y={y + 8 + j * 14} width="10" height="4" fill={mid} opacity="0.5" />
              )
            ))}
          </g>
        );
      })}
    </>
  );
}

function sceneMuseum(seed: string, light: string, mid: string, dark: string) {
  const cols = 6;
  return (
    <>
      <rect x="0" y="148" width="320" height="52" fill={dark} opacity="0.5" />
      <path d="M64 88 L160 52 L256 88 Z" fill={light} opacity="0.29" />
      <rect x="60" y="86" width="200" height="6" rx="1" fill={light} opacity="0.33" />
      {Array.from({ length: cols }).map((_, i) => (
        <rect key={i} x={76 + i * 28} y={94} width="12" height="52" rx="1.5" fill={light} opacity="0.28" />
      ))}
      <rect x="58" y="146" width="204" height="5" fill={mid} opacity="0.4" />
      {[0, 1, 2].map((i) => <rect key={i} x={50 - i * 8} y={151 + i * 5} width={220 + i * 16} height="4" fill={dark} opacity="0.5" />)}
    </>
  );
}

function sceneMosque(seed: string, light: string, mid: string, dark: string) {
  return (
    <>
      <rect x="0" y="150" width="320" height="50" fill={dark} opacity="0.5" />
      <path d="M136 148 A28 28 0 0 1 192 148 Z" fill={light} opacity="0.2" />
      <circle cx="164" cy="120" r="3" fill={light} opacity="0.3" />
      <path d="M188 128 a5 5 0 1 0 6 6 a4 4 0 1 1 -6 -6" fill={light} opacity="0.32" />
      {[96, 232].map((x, i) => (
        <g key={i}>
          <rect x={x} y={92} width="7" height="58" rx="2" fill={light} opacity="0.31" />
          <path d={`M${x - 1.5} 92 L${x + 3.5} 78 L${x + 8.5} 92 Z`} fill={light} opacity="0.33" />
        </g>
      ))}
    </>
  );
}

function sceneChurch(seed: string, light: string, mid: string, dark: string) {
  return (
    <>
      <rect x="0" y="150" width="320" height="50" fill={dark} opacity="0.5" />
      <rect x="118" y="118" width="84" height="32" rx="2" fill={light} opacity="0.26" />
      {Array.from({ length: 5 }).map((_, i) => <rect key={i} x={122 + i * 16} y={144} width="8" height="6" fill={dark} opacity="0.4" />)}
      <path d="M138 118 A22 22 0 0 1 182 118 Z" fill={light} opacity="0.31" />
      <line x1="160" y1="96" x2="160" y2="80" stroke={light} strokeOpacity="0.35" strokeWidth="2" />
      <line x1="153" y1="86" x2="167" y2="86" stroke={light} strokeOpacity="0.35" strokeWidth="2" />
    </>
  );
}

function sceneMarket(seed: string, light: string, mid: string, dark: string) {
  return (
    <>
      <rect x="0" y="150" width="320" height="50" fill={dark} opacity="0.45" />
      {Array.from({ length: 6 }).map((_, i) => {
        const x = 20 + i * 48;
        return (
          <g key={i}>
            <path d={`M${x} 118 L${x + 22} 118 L${x + 26} 130 L${x - 4} 130 Z`} fill={i % 2 ? mid : light} opacity="0.3" />
            <rect x={x + 6} y="130" width="10" height="20" fill={dark} opacity="0.4" />
          </g>
        );
      })}
      {[50, 130, 210, 270].map((x, i) => <circle key={i} cx={x} cy="110" r="2.4" fill={light} opacity="0.4" />)}
    </>
  );
}

function sceneModern(seed: string, light: string, mid: string, dark: string) {
  const n = 6;
  return (
    <>
      <rect x="0" y="150" width="320" height="50" fill={dark} opacity="0.5" />
      {Array.from({ length: n }).map((_, i) => {
        const h = 60 + (hash(seed + 'm' + i) % 74);
        const x = 24 + i * 46;
        const y = 150 - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width="26" height={h} rx="1" fill={light} opacity="0.27" />
            {Array.from({ length: Math.floor(h / 12) }).map((_, j) => (
              <line key={j} x1={x} y1={y + 6 + j * 12} x2={x + 26} y2={y + 6 + j * 12} stroke={dark} strokeOpacity="0.35" strokeWidth="0.6" />
            ))}
            <line x1={x + 13} y1={y} x2={x + 13} y2={y + h} stroke={dark} strokeOpacity="0.3" strokeWidth="0.6" />
          </g>
        );
      })}
      <line x1="260" y1="70" x2="260" y2="118" stroke={light} strokeOpacity="0.3" strokeWidth="1.4" />
      <line x1="260" y1="70" x2="288" y2="82" stroke={light} strokeOpacity="0.3" strokeWidth="1.4" />
    </>
  );
}

function sceneRural(seed: string, light: string, mid: string, dark: string) {
  return (
    <>
      <rect x="0" y="128" width="320" height="72" fill={dark} opacity="0.4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M0 ${138 + i * 11} Q 80 ${132 + i * 11} 160 ${138 + i * 11} T 320 ${138 + i * 11}`} stroke={mid} strokeOpacity="0.22" strokeWidth="1.4" fill="none" />
      ))}
      <path d="M226 120 L258 120 L258 134 L226 134 Z" fill={light} opacity="0.28" />
      <path d="M222 120 L242 106 L262 120 Z" fill={light} opacity="0.2" />
      <path d="M60 138 Q 58 112 60 96" stroke={dark} strokeWidth="2.2" fill="none" opacity="0.6" />
      <path d="M60 100 q -14 -4 -20 4 M60 100 q 14 -4 20 4" stroke={light} strokeOpacity="0.35" strokeWidth="1.6" fill="none" />
    </>
  );
}

function sceneGeneric(seed: string, light: string, mid: string, dark: string) {
  return <>{dunes(seed, dark, mid, 3, 118)}</>;
}

const SCENES: Record<ImageSubject, (seed: string, light: string, mid: string, dark: string) => React.ReactNode> = {
  pyramids: scenePyramids, sphinx: sceneSphinx, temple: sceneTemple, nile: sceneNile, sea: sceneSea,
  desert: sceneDesert, oasis: sceneOasis, city: sceneCity, museum: sceneMuseum, mosque: sceneMosque,
  church: sceneChurch, market: sceneMarket, modern: sceneModern, rural: sceneRural, generic: sceneGeneric,
};

export function SmartImage({
  seed, subject, alt, className, ratio = '16/10', label,
}: { seed: string; subject?: ImageSubject; alt: string; className?: string; ratio?: string; label?: string }) {
  const s = subject ?? 'generic';
  const [dark, mid, light] = PALETTE[s];
  const h = hash(seed);
  const angle = 120 + (h % 90);
  const id = React.useId();
  const night = NIGHT_LEANING.has(s);
  const sunX = 0.62 + (pick(seed, 'sun', 24) / 100);
  const sunY = 0.22 + (pick(seed, 'suny', 14) / 100);
  const rimAngle = 18 + (h % 34);

  return (
    <div className={clsx('relative overflow-hidden rounded-[14px]', className)} style={{ aspectRatio: ratio }}>
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={alt}>
        <defs>
          <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1" gradientTransform={`rotate(${angle % 20} .5 .5)`}>
            <stop offset="0%" stopColor={mid} stopOpacity="0.85" />
            <stop offset="55%" stopColor={dark} />
            <stop offset="100%" stopColor="#040a10" />
          </linearGradient>
          <radialGradient id={`sun-${id}`} cx={sunX} cy={sunY} r="0.55">
            <stop offset="0%" stopColor={light} stopOpacity={night ? 0.22 : 0.55} />
            <stop offset="100%" stopColor={light} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`rim-${id}`} gradientUnits="userSpaceOnUse" x1="0" y1="200" x2="320" y2="0" gradientTransform={`rotate(${rimAngle} 160 100)`}>
            <stop offset="0%" stopColor={light} stopOpacity="0" />
            <stop offset="46%" stopColor={light} stopOpacity="0" />
            <stop offset="52%" stopColor={light} stopOpacity="0.17" />
            <stop offset="58%" stopColor={light} stopOpacity="0" />
            <stop offset="100%" stopColor={light} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="320" height="200" fill={`url(#sky-${id})`} />
        <rect width="320" height="200" fill={`url(#sun-${id})`} />
        {night && (
          <g opacity="0.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <circle key={i} cx={16 + (hash(seed + 'star' + i) % 300)} cy={10 + (hash(seed + 'sy' + i) % 70)} r="0.7" fill={light} />
            ))}
          </g>
        )}
        <g>{SCENES[s](seed, light, mid, dark)}</g>
        <rect width="320" height="200" fill={`url(#rim-${id})`} />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/82 via-base/14 to-transparent" />
      {label && (
        <span className="absolute bottom-2 left-2 rounded bg-base/70 px-2 py-0.5 text-[10px] tracking-wide text-ink-low backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * The one bespoke, single-use cinematic composition on the site — the
 * homepage hero. Everywhere else reuses the compact `SmartImage` scenes for
 * DOM-weight reasons; the hero renders once per page load, so it can afford
 * a richer plate: distant hazy pyramid skyline, a sphinx silhouette, a dark
 * foreground ridge with a gold rim light where the sun grazes it, and a pair
 * of palm silhouettes for scale. Still a pure function of `seed` — no
 * randomness, so no hydration risk.
 */
export function CinematicHero({ seed = 'egypt-one-hero', alt, className }: { seed?: string; alt: string; className?: string }) {
  const [dark, mid, light] = PALETTE.pyramids;
  const haze = '#7d8aa3'; // cool blue-grey for distant silhouettes — atmospheric perspective against the warm sky, not another gold shape
  const id = React.useId();
  const shift = pick(seed, 'pshift', 40) - 20;

  return (
    <div className={clsx('relative overflow-hidden', className)}>
      {/* viewBox aspect matches the hero panel's typical rendered proportions
          (content-driven, not a fixed ratio) closely enough that xMidYMid
          slice only trims a little off the sides at other viewport sizes,
          rather than cropping away the sky or the foreground. */}
      <svg viewBox="0 0 1300 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={alt}>
        <defs>
          <linearGradient id={`hsky-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#050b12" />
            <stop offset="32%" stopColor="#0c1420" />
            <stop offset="58%" stopColor={dark} />
            <stop offset="100%" stopColor={mid} />
          </linearGradient>
          <radialGradient id={`hsun-${id}`} cx="0.5" cy="0.5" r="0.55">
            <stop offset="0%" stopColor={light} stopOpacity="0.55" />
            <stop offset="45%" stopColor={light} stopOpacity="0.18" />
            <stop offset="100%" stopColor={light} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1300" height="1000" fill={`url(#hsky-${id})`} />
        <rect width="1300" height="1000" fill={`url(#hsun-${id})`} />

        {/* atmospheric haze bands */}
        {[0.07, 0.11, 0.15].map((o, i) => (
          <rect key={i} x="0" y={380 + i * 40} width="1300" height="28" fill={light} opacity={o} />
        ))}

        {/* distant pyramid skyline — cool haze tone, not gold, so it separates from the warm sky */}
        <g opacity="0.62">
          <path d={`M${600 + shift} 480 L${730 + shift} 268 L${860 + shift} 480 Z`} fill={haze} />
          <path d={`M${820 + shift} 480 L${900 + shift} 340 L${980 + shift} 480 Z`} fill={haze} opacity="0.8" />
          <path d={`M${500 + shift} 480 L${560 + shift} 380 L${620 + shift} 480 Z`} fill={haze} opacity="0.7" />
          {[0.3, 0.5, 0.7].map((f, i) => (
            <line key={i}
              x1={600 + shift + (860 - 600) * (1 - f) * 0.5} y1={480 - (480 - 268) * f}
              x2={860 + shift - (860 - 600) * (1 - f) * 0.5} y2={480 - (480 - 268) * f}
              stroke="#3d4a5e" strokeOpacity="0.5" strokeWidth="2" />
          ))}
        </g>

        {/* sphinx silhouette, small, left of the pyramids, same cool haze tone */}
        <path
          d={`M${360 + shift} 482 Q${360 + shift} 442 ${380 + shift} 432 L${386 + shift} 402 Q${390 + shift} 380 ${406 + shift} 380
              Q${422 + shift} 380 ${426 + shift} 402 L${432 + shift} 432 Q${452 + shift} 442 ${452 + shift} 482 Z`}
          fill={haze} opacity="0.55"
        />

        {/* midground dune — warm dark, clearly a distinct silhouette band */}
        <path d="M0 560 Q 260 520 540 552 T 1020 538 T 1300 558 V620 H0 Z" fill={dark} opacity="0.68" />

        {/* gold rim-light band: a wavy gold shape peeking out just above the foreground silhouette's edge */}
        <path
          d="M0 700 Q 160 646 360 682 Q 600 726 840 670 Q 1080 612 1300 682 V1000 H0 Z"
          fill={light} opacity="0.65"
        />
        {/* foreground silhouette — solid, offset a touch lower so only a slim gold rim shows above it */}
        <path
          d="M0 716 Q 160 662 360 698 Q 600 742 840 686 Q 1080 628 1300 698 V1000 H0 Z"
          fill="#040a10"
        />

        {/* fine grain */}
        <g opacity="0.05">
          {Array.from({ length: 46 }).map((_, i) => (
            <circle key={i} cx={hash(seed + 'g' + i) % 1300} cy={hash(seed + 'gy' + i) % 1000} r="1.2" fill={light} />
          ))}
        </g>
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/28 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_100%,transparent_45%,rgba(4,10,16,0.25)_100%)]" />
    </div>
  );
}
