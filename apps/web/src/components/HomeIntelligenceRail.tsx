import { SectionHeader, Stat, SourceBadge, BarStrip, Donut, Trend } from '@egypt-one/ui';

/**
 * Sticky right-hand "at a glance" panel — repositions the homepage's Tourism
 * intelligence section (previously an inline scroll-past block) into a
 * persistent sidebar, matching repo2's IntelligenceRail placement. Reuses
 * the same db.metrics() data already fetched by the homepage; no new
 * queries, no new data source.
 */
export function HomeIntelligenceRail({
  metrics, t, tn, href,
}: {
  metrics: {
    headline: { visitorsThisMonth: number; visitorsYoYPct: number; countriesReached: number; avgStayNights: number; tourismRevenueUsd: number; revenueYoYPct: number };
    topCountries: { country: string; visitors: number }[];
    interests: { name: string; sharePct: number }[];
    monthlyVisitors: { month: string; visitors: number }[];
  };
  t: (k: string) => string;
  tn: (k: string, vars: Record<string, string | number>) => string;
  href: string;
}) {
  return (
    <div className="grid gap-4">
      <SectionHeader eyebrow={t('eyebrow.operationsPreview')} title={t('section.intel')} sub={t('intel.sub')} href={href} hrefLabel={t('nav.fullDashboard')} />

      <div className="grid grid-cols-2 gap-3">
        <Stat label={t('intel.visitorsThisMonth')} value={(metrics.headline.visitorsThisMonth / 1e6).toFixed(2) + 'M'} sub={tn('intel.yoy', { pct: metrics.headline.visitorsYoYPct })} />
        <Stat label={t('intel.countriesReached')} value={metrics.headline.countriesReached} sub={t('intel.egypt195Gateways')} tone="nile" />
        <Stat label={t('intel.avgStay')} value={metrics.headline.avgStayNights + ' ' + t('intel.nights')} tone="neutral" />
        <Stat label={t('intel.tourismRevenue')} value={'$' + (metrics.headline.tourismRevenueUsd / 1e9).toFixed(2) + 'B'} sub={tn('intel.yoy', { pct: metrics.headline.revenueYoYPct })} tone="ok" />
      </div>

      <div className="surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[12.5px] font-semibold text-ink-hi">{t('intel.topMarkets')}</h3>
          <SourceBadge status="SIMULATED" size="sm" />
        </div>
        <BarStrip rows={metrics.topCountries.slice(0, 6).map((c) => ({ label: c.country, value: c.visitors }))} />
      </div>

      <div className="surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[12.5px] font-semibold text-ink-hi">{t('intel.travellerInterests')}</h3>
          <SourceBadge status="SIMULATED" size="sm" />
        </div>
        <Donut
          slices={metrics.interests.slice(0, 5).map((x, i) => ({
            label: x.name, value: x.sharePct,
            colour: ['#D8A84E', '#2E7D9A', '#3FB6AD', '#5B4B8A', '#A2703F'][i],
          }))}
        />
      </div>

      <div className="surface p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[12.5px] font-semibold text-ink-hi">{t('intel.monthlyTrend')}</h3>
          <SourceBadge status="SIMULATED" size="sm" />
        </div>
        <Trend points={metrics.monthlyVisitors.map((x) => x.visitors)} height={56} />
        <div className="mt-1 flex justify-between text-[9.5px] text-ink-faint">
          {metrics.monthlyVisitors.map((x) => <span key={x.month}>{x.month}</span>)}
        </div>
      </div>
    </div>
  );
}
