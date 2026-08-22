import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import { RBAC_MATRIX, recentAudit } from '@egypt-one/security';
import { ADAPTER_LIST } from '@egypt-one/integrations';
import { REVENUE_RULES, DEFAULT_BASE_COMMISSION_PCT } from '@egypt-one/config';
import { AGENTS } from '@egypt-one/agents';
import { MCP_SERVERS, MCP_TOOLS } from '@egypt-one/mcp';
import type { Locale } from '@egypt-one/i18n';
import { PortalShell, Badge, SourceBadge, Stat, BarStrip, Donut, Trend, DataTable, EmptyState } from '@egypt-one/ui';
import { InfoCard } from '@/components/Module';
import { GOVERNMENT_NAV } from '@/lib/nav';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = { title: "Tourism intelligence", description: "Demand, origin mix and sector signals — synthetic data standing in for a future analytics pipeline." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const top = metrics.topCountries as { country: string; sharePct: number }[];
  const interests = metrics.interests as { name: string; sharePct: number }[];
  const palette = ['#D8A84E', '#2E7D9A', '#7c9c6b', '#b6a8e0', '#c98a4f', '#7fb3c9'];
  return (
    <PortalShell portal={"Government"} title={"Tourism intelligence"} subtitle={"Demand, origin mix and sector signals — synthetic data standing in for a future analytics pipeline."} nav={GOVERNMENT_NAV} active={"/government/tourism-intelligence"} accent={"emerald"} roleNote={""}>
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard title="Top countries of origin (simulated)"><div className="mt-2"><BarStrip rows={top.map((t) => ({ label: t.country, value: t.sharePct }))} unit="%" /></div></InfoCard>
          <InfoCard title="Traveller interests (simulated)"><div className="mt-2"><Donut slices={interests.map((i, idx) => ({ label: i.name, value: i.sharePct, colour: palette[idx % palette.length] }))} /></div></InfoCard>
        </div>
        <InfoCard title="Monthly visitor trend (simulated)"><div className="mt-2"><Trend points={(metrics.monthlyVisitors as { visitors: number }[]).map((m) => m.visitors)} /></div></InfoCard>
      </div>
    </PortalShell>
  );
}
