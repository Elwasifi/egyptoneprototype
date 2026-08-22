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


export const metadata: Metadata = { title: "Analytics", description: "Revenue and sector composition, aggregated and simulated." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const rev = metrics.revenueBySector as { sector: string; gmvUsd: number }[];
  const palette = ['#D8A84E', '#2E7D9A', '#7c9c6b', '#b6a8e0', '#c98a4f', '#7fb3c9'];
  return (
    <PortalShell portal={"Government"} title={"Analytics"} subtitle={"Revenue and sector composition, aggregated and simulated."} nav={GOVERNMENT_NAV} active={"/government/analytics"} accent={"emerald"} roleNote={""}>
      <div className="grid gap-6">
        <InfoCard title="GMV by sector (simulated)"><div className="mt-2"><Donut slices={rev.map((r, idx) => ({ label: r.sector, value: r.gmvUsd, colour: palette[idx % palette.length] }))} /></div></InfoCard>
      </div>
    </PortalShell>
  );
}
