import * as React from 'react';

/**
 * Egypt One mark — raster.
 *
 * The approved circular brand artwork (gold ring, ankh, pyramids, Sphinx
 * profile, on a black field), served from /brand/egypt-one-logo.jpg. This is
 * the mark used everywhere the logo appears in the product.
 */
export function LogoImage({ size = 40, className = '', title = 'Egypt One' }: { size?: number; className?: string; title?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/egypt-one-logo.jpg"
      alt={title}
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

/**
 * Vector fallback mark — kept only for contexts a raster asset can't serve
 * (e.g. the favicon pipeline, which wants a scalable SVG). Not used for the
 * on-page logo any more; see LogoImage above.
 */
export function AnkhMark({ size = 40, ring = true, title = 'Egypt One' }: { size?: number; ring?: boolean; title?: string }) {
  const id = React.useId();
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={title} className="shrink-0">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E6C077" />
          <stop offset="45%" stopColor="#D8A84E" />
          <stop offset="100%" stopColor="#96702D" />
        </linearGradient>
      </defs>
      {ring && (
        <>
          <circle cx="60" cy="60" r="57" fill="#08131d" />
          <circle cx="60" cy="60" r="56" fill="none" stroke={`url(#g-${id})`} strokeWidth="2.5" />
        </>
      )}
      {/* left pyramids */}
      <path d="M18 84 L34 52 L50 84 Z" fill="none" stroke={`url(#g-${id})`} strokeWidth="1.6" strokeLinejoin="round" opacity="0.9" />
      <path d="M44 84 L54 64 L64 84 Z" fill="none" stroke={`url(#g-${id})`} strokeWidth="1.3" strokeLinejoin="round" opacity="0.55" />
      {/* sphinx profile, right */}
      <path
        d="M74 84 v-11 c0-4 2-7 5-9 c1-4 3-7 7-8 c3-1 5 0 6 2 c2 0 3 2 3 4 c0 2-1 3-2 4 c3 2 5 5 5 9 v9 Z"
        fill="none" stroke={`url(#g-${id})`} strokeWidth="1.5" strokeLinejoin="round" opacity="0.9"
      />
      <path d="M14 84 H106" stroke={`url(#g-${id})`} strokeWidth="1.1" opacity="0.75" />
      {/* ankh */}
      <g fill={`url(#g-${id})`}>
        <path d="M55.5 46 h9 v38 h-9 z" />
        <path d="M40 44 h40 v8.5 h-40 z" />
        <path d="M60 16 c9.5 0 16 7 16 15.5 c0 8-6 13-11.5 15.5 h-9 C50 44.5 44 39.5 44 31.5 C44 23 50.5 16 60 16 z m0 8.5 c-4.6 0-7.7 3.3-7.7 7.4 c0 4 3.1 7.1 7.7 7.1 c4.6 0 7.7-3.1 7.7-7.1 c0-4.1-3.1-7.4-7.7-7.4 z" />
      </g>
    </svg>
  );
}

export function Logo({
  variant = 'full',
  size = 38,
  className = '',
}: { variant?: 'full' | 'compact' | 'mark' | 'stacked'; size?: number; className?: string }) {
  if (variant === 'mark') return <LogoImage size={size} />;
  const stacked = variant === 'stacked';
  return (
    <span className={`inline-flex items-center gap-2.5 ${stacked ? 'flex-col gap-1.5 text-center' : ''} ${className}`}>
      <LogoImage size={size} />
      <span className={stacked ? '' : 'leading-tight'}>
        <span className="block text-[15px] font-bold tracking-[0.16em] text-ink-hi">
          EGYPT <span className="gold-text">ONE</span>
        </span>
        {variant !== 'compact' && (
          <span className="block text-[9.5px] tracking-[0.12em] text-gold-600/85">
            One Egypt. One Journey. One Platform.
          </span>
        )}
      </span>
    </span>
  );
}

/** Thin decorative rule used between editorial blocks. */
export const GoldRule = ({ className = '' }: { className?: string }) => <div className={`gold-rule my-6 ${className}`} />;
