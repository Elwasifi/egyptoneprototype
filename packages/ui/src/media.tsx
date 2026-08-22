import * as React from 'react';
import clsx from 'clsx';

/**
 * Image abstraction.
 *
 * The prototype ships with no licensed photography, so rather than use
 * watermarked or inaccurate stock this renders a deterministic, brand-consistent
 * vector plate derived from the record's slug. Point `resolveImage` at a CDN or
 * DAM adapter later and every surface picks up real assets with no other change.
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

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
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

export function SmartImage({
  seed, subject, alt, className, ratio = '16/10', label,
}: { seed: string; subject?: ImageSubject; alt: string; className?: string; ratio?: string; label?: string }) {
  const s = subject ?? 'generic';
  const [dark, mid, light] = PALETTE[s];
  const h = hash(seed);
  const angle = 120 + (h % 90);
  const dunes = 3 + (h % 3);
  const id = React.useId();

  return (
    <div className={clsx('relative overflow-hidden rounded-[14px]', className)} style={{ aspectRatio: ratio }}>
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={alt}>
        <defs>
          <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1" gradientTransform={`rotate(${angle % 20} .5 .5)`}>
            <stop offset="0%" stopColor={mid} stopOpacity="0.85" />
            <stop offset="55%" stopColor={dark} />
            <stop offset="100%" stopColor="#040a10" />
          </linearGradient>
          <radialGradient id={`sun-${id}`} cx="0.7" cy="0.28" r="0.5">
            <stop offset="0%" stopColor={light} stopOpacity="0.55" />
            <stop offset="100%" stopColor={light} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="320" height="200" fill={`url(#sky-${id})`} />
        <rect width="320" height="200" fill={`url(#sun-${id})`} />
        {Array.from({ length: dunes }).map((_, i) => {
          const y = 118 + i * 22 + (hash(seed + i) % 12);
          return (
            <path key={i} d={`M0 ${y} Q ${60 + (hash(seed + i) % 90)} ${y - 26 - i * 4} 160 ${y} T 320 ${y - 6} V200 H0 Z`}
              fill={i % 2 ? dark : mid} opacity={0.30 + i * 0.16} />
          );
        })}
        {(s === 'pyramids' || s === 'sphinx') && (
          <>
            <path d="M52 132 L96 74 L140 132 Z" fill={light} opacity="0.18" />
            <path d="M126 132 L156 92 L186 132 Z" fill={light} opacity="0.12" />
          </>
        )}
        {s === 'temple' && Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={60 + i * 32} y={86} width="14" height="48" rx="2" fill={light} opacity="0.16" />
        ))}
        {(s === 'nile' || s === 'sea') && (
          <>
            <path d="M196 118 L196 66 L236 118 Z" fill={light} opacity="0.20" />
            <rect x="180" y="118" width="76" height="5" rx="2.5" fill={light} opacity="0.16" />
          </>
        )}
        {(s === 'city' || s === 'modern') && Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={30 + i * 30} y={70 + (hash(seed + 'b' + i) % 46)} width="20" height="70" rx="2" fill={light} opacity="0.13" />
        ))}
        {s === 'mosque' && (
          <>
            <circle cx="160" cy="104" r="24" fill={light} opacity="0.16" />
            <rect x="196" y="62" width="8" height="72" rx="4" fill={light} opacity="0.18" />
            <rect x="116" y="62" width="8" height="72" rx="4" fill={light} opacity="0.18" />
          </>
        )}
        <rect width="320" height="200" fill="url(#noise)" opacity="0.03" />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/92 via-base/25 to-transparent" />
      {label && (
        <span className="absolute bottom-2 left-2 rounded bg-base/70 px-2 py-0.5 text-[10px] tracking-wide text-ink-low backdrop-blur">
          {label}
        </span>
      )}
    </div>
  );
}
