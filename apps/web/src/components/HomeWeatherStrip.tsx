import { SourceBadge } from '@egypt-one/ui';
import { DEMO_FX } from '@egypt-one/i18n';

const CITIES = [
  { city: 'Cairo', region: 'Greater Cairo', temp: '28°C' },
  { city: 'Luxor', region: 'Upper Egypt', temp: '34°C' },
  { city: 'Hurghada', region: 'Red Sea', temp: '31°C' },
  { city: 'Alexandria', region: 'Mediterranean', temp: '25°C' },
  { city: 'Aswan', region: 'Upper Egypt', temp: '36°C' },
];

/**
 * Repo2's WeatherStrip has no equivalent data source anywhere in this
 * project — there is no weather API. Rendered as clearly-labelled DEMO
 * content rather than skipped or faked as live. The currency line reuses
 * the site's real DEMO_FX constant (already used by the currency switcher),
 * not a fabricated rate.
 */
export function HomeWeatherStrip({ t }: { t: (k: string) => string }) {
  return (
    <div className="surface flex flex-wrap items-center gap-2 p-3">
      {CITIES.map((c) => (
        <div key={c.city} className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-white/8 bg-white/3 px-3 py-2">
          <span aria-hidden="true" className="text-[15px] text-gold-400">☀</span>
          <span className="min-w-0">
            <span className="block truncate text-[12px] text-ink-hi">{c.city}</span>
            <span className="block truncate text-[10px] text-ink-faint">{c.region}</span>
          </span>
          <span className="ms-auto shrink-0 text-[13px] text-gold-300">{c.temp}</span>
        </div>
      ))}
      <div className="flex items-center gap-2 rounded-xl border border-gold-600/35 bg-gold-600/8 px-3 py-2">
        <span aria-hidden="true" className="text-[13px] text-gold-400">↗</span>
        <span className="text-[12px] text-gold-200" dir="ltr">1 USD ≈ {DEMO_FX.EGP.toFixed(2)} EGP</span>
      </div>
      <SourceBadge status="DEMO" size="sm" />
    </div>
  );
}
