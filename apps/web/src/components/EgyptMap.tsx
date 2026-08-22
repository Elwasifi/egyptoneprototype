'use client';
import * as React from 'react';
import Link from 'next/link';
import { db } from '@egypt-one/database';
import { Badge, SourceBadge } from '@egypt-one/ui';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';

type Layer = 'governorates' | 'heritage' | 'providers' | 'events' | 'investment';

const LAYERS: { key: Layer; label: string; colour: string }[] = [
  { key: 'governorates', label: 'Governorates', colour: '#D8A84E' },
  { key: 'heritage', label: 'Heritage', colour: '#3FB6AD' },
  { key: 'providers', label: 'Providers', colour: '#2E7D9A' },
  { key: 'events', label: 'Events', colour: '#5B4B8A' },
  { key: 'investment', label: 'Investment', colour: '#D97A3C' },
];

/** Egypt's approximate bounding box, used to project lat/lng into the canvas. */
const BOUNDS = { minLat: 21.5, maxLat: 31.9, minLng: 24.5, maxLng: 36.5 };
const project = (lat: number, lng: number) => ({
  x: ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * 100,
  y: ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * 100,
});

/**
 * Vendor-neutral map surface.
 *
 * No map vendor is connected, so rather than render an empty frame or bake in
 * an SDK, this draws from local coordinates through the same projection a real
 * adapter would use. Swapping in Mapbox, Google or a self-hosted OSM stack
 * replaces this canvas without touching any calling page.
 */
export function EgyptMap({ locale }: { locale: Locale }) {
  const [layer, setLayer] = React.useState<Layer>('governorates');
  const [hover, setHover] = React.useState<string | null>(null);

  const govs = db.governorates.all();
  const heritage = db.heritage.all().filter((h) => h.coordinates);

  const points = React.useMemo(() => {
    if (layer === 'heritage') {
      return heritage.map((h) => ({
        id: h.slug, name: h.name, href: `/heritage/${h.slug}`,
        ...project(h.coordinates!.lat, h.coordinates!.lng),
        size: 3, note: h.access.replace(/_/g, ' ').toLowerCase(),
      }));
    }
    return govs.map((g) => {
      const count =
        layer === 'providers' ? db.providers.byGovernorate(g.slug).length
        : layer === 'events' ? db.events.byGovernorate(g.slug).length
        : layer === 'investment' ? db.investment.byGovernorate(g.slug).length
        : g.metrics.heritageSites;
      return {
        id: g.slug, name: g.name, href: `/governorates/${g.slug}`,
        ...project(g.coordinates.lat, g.coordinates.lng),
        size: layer === 'governorates' ? 5 : Math.max(3, Math.min(11, 3 + count / 6)),
        note: layer === 'providers' ? `${count} providers`
          : layer === 'events' ? `${count} events`
          : layer === 'investment' ? `${count} opportunities`
          : `${count} heritage sites`,
      };
    });
  }, [layer, govs, heritage]);

  const colour = LAYERS.find((l) => l.key === layer)!.colour;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
      <div className="surface p-4">
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {LAYERS.map((l) => (
            <button
              key={l.key} onClick={() => setLayer(l.key)} aria-pressed={layer === l.key}
              className={`rounded-full border px-3 py-1.5 text-[12px] transition-colors ${
                layer === l.key ? 'border-gold-500 bg-gold-600/16 text-gold-200' : 'border-white/10 text-ink-mid hover:border-gold-600/40'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/8 bg-void sm:aspect-[5/4]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" role="img" aria-label="Schematic map of Egypt">
            {/* Nile, schematic */}
            <path d="M63 96 C 61 80, 58 66, 56 52 C 54 40, 52 28, 50 18 L 44 8 M50 18 L 56 8" fill="none" stroke="#2E7D9A" strokeWidth="0.7" opacity="0.55" />
            {/* Delta fan */}
            <path d="M50 18 L 40 6 L 62 6 Z" fill="#2E7D9A" opacity="0.10" />
            {/* Land mass, schematic */}
            <path d="M8 8 H 92 V 92 H 8 Z" fill="none" stroke="rgba(200,155,74,0.16)" strokeWidth="0.4" />
            {/* Red Sea */}
            <path d="M78 30 C 82 46, 88 62, 92 78" fill="none" stroke="#3FB6AD" strokeWidth="1.6" opacity="0.22" />
            {/* Mediterranean */}
            <path d="M8 7 H 92" stroke="#3FB6AD" strokeWidth="1.6" opacity="0.22" />

            {points.map((p) => (
              <g key={p.id} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}>
                <circle cx={p.x} cy={p.y} r={p.size / 2} fill={colour} opacity={hover === p.id ? 0.95 : 0.55} />
                <circle cx={p.x} cy={p.y} r={p.size / 2 + 1.5} fill="none" stroke={colour} strokeWidth="0.3" opacity={hover === p.id ? 0.8 : 0.25} />
              </g>
            ))}
          </svg>

          {hover && (
            <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-white/10 bg-panel/95 px-3 py-2 text-[12px] backdrop-blur">
              <div className="font-semibold text-ink-hi">{points.find((p) => p.id === hover)?.name}</div>
              <div className="text-ink-faint">{points.find((p) => p.id === hover)?.note}</div>
            </div>
          )}
        </div>

        <p className="mt-3 text-[11.5px] text-ink-faint">
          Schematic canvas drawn from local coordinates. Not a survey — boundaries and coastlines are indicative, and coordinates
          for vulnerable heritage sites are deliberately approximate.
        </p>
      </div>

      <aside className="grid content-start gap-4">
        <div className="surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-ink-hi">{LAYERS.find((l) => l.key === layer)!.label}</h3>
            <Badge tone="neutral">{points.length}</Badge>
          </div>
          <ul className="grid max-h-[420px] gap-1 overflow-y-auto pe-1">
            {points.slice(0, 60).map((p) => (
              <li key={p.id}>
                <Link
                  href={L(locale, p.href)}
                  onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[12px] hover:bg-white/6"
                >
                  <span className="min-w-0 truncate text-ink-mid">{p.name}</span>
                  <span className="shrink-0 text-[10.5px] text-ink-faint">{p.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="surface p-4">
          <h3 className="mb-2 text-[13px] font-semibold text-ink-hi">Map adapter</h3>
          <p className="text-[12px] leading-relaxed text-ink-low">
            No map vendor is selected. Every map surface talks to a <code className="text-gold-300">MapProviderAdapter</code>
            {' '}contract, so Mapbox, Google or a self-hosted OpenStreetMap stack can be dropped in without touching a page.
          </p>
          <div className="mt-3"><SourceBadge status="PLANNED_INTEGRATION" owner="Map vendor" /></div>
        </div>
      </aside>
    </div>
  );
}
