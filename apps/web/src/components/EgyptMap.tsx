'use client';
import * as React from 'react';
import Link from 'next/link';
import { db } from '@egypt-one/database';
import { Badge, SourceBadge } from '@egypt-one/ui';
import { href as L } from '@/lib/locale';
import type { Locale } from '@egypt-one/i18n';
import dynamic from 'next/dynamic';
import type { MapPoint } from './LeafletMap';

/** Leaflet touches `window` at import time, so the actual canvas is client-only. */
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-[12px] text-ink-faint">Loading map…</div>,
});

type Layer = 'governorates' | 'heritage' | 'providers' | 'events' | 'investment';

const LAYERS: { key: Layer; label: string; colour: string }[] = [
  { key: 'governorates', label: 'Governorates', colour: '#D8A84E' },
  { key: 'heritage', label: 'Heritage', colour: '#3FB6AD' },
  { key: 'providers', label: 'Providers', colour: '#2E7D9A' },
  { key: 'events', label: 'Events', colour: '#5B4B8A' },
  { key: 'investment', label: 'Investment', colour: '#D97A3C' },
];

/**
 * Real, interactive basemap (OpenStreetMap data via CARTO's free dark tiles —
 * no API key, no vendor contract) with Egypt One's own demo data plotted on
 * top through the same MapProviderAdapter shape a paid vendor (Mapbox/Google)
 * would slot into later without touching any calling page.
 */
export function EgyptMap({ locale }: { locale: Locale }) {
  const [layer, setLayer] = React.useState<Layer>('governorates');
  const [hover, setHover] = React.useState<string | null>(null);

  const govs = db.governorates.all();
  const heritage = db.heritage.all().filter((h) => h.coordinates);

  const points: (MapPoint & { href: string })[] = React.useMemo(() => {
    if (layer === 'heritage') {
      return heritage.map((h) => ({
        id: h.slug, name: h.name, href: `/heritage/${h.slug}`,
        lat: h.coordinates!.lat, lng: h.coordinates!.lng,
        size: 5, note: h.access.replace(/_/g, ' ').toLowerCase(),
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
        lat: g.coordinates.lat, lng: g.coordinates.lng,
        size: layer === 'governorates' ? 7 : Math.max(5, Math.min(15, 5 + count / 6)),
        note: layer === 'providers' ? `${count} providers`
          : layer === 'events' ? `${count} events`
          : layer === 'investment' ? `${count} opportunities`
          : `${count} heritage sites`,
      };
    });
  }, [layer, govs, heritage]);

  const selected = React.useMemo(() => points.find((p) => p.id === hover) ?? null, [points, hover]);

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
          <LeafletMap points={points} colour={colour} hoverId={hover} onHover={setHover} selected={selected} />
        </div>

        <p className="mt-3 text-[11.5px] text-ink-faint">
          Basemap tiles are real and live (OpenStreetMap contributors, via CARTO's free tier). The markers plotted on it —
          governorates, heritage access, providers, events, investment — are Egypt One's own demo data, and coordinates for
          vulnerable heritage sites are deliberately approximate.
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
            Basemap tiles are served live by <a href="https://carto.com/attributions" target="_blank" rel="noreferrer" className="text-gold-300 hover:underline">CARTO</a>'s
            free tier from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="text-gold-300 hover:underline">OpenStreetMap</a> data
            — no paid contract, no API key. Every map surface talks to the same <code className="text-gold-300">MapProviderAdapter</code>
            {' '}contract, so a licensed vendor (Mapbox, Google) can be dropped in later without touching a page.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <SourceBadge status="LIVE" owner="OpenStreetMap contributors, via CARTO" />
            <SourceBadge status="DEMO" owner="Egypt One (plotted markers)" />
          </div>
        </div>
      </aside>
    </div>
  );
}
