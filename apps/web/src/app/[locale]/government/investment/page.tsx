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


export const metadata: Metadata = { title: "Investment leads", description: "Anonymised interest signals from the Investor Portal, by sector and governorate." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const sectors = db.investment.sectors();
  const opps = db.investment.all();
  return (
    <PortalShell portal={"Government"} title={"Investment leads"} subtitle={"Anonymised interest signals from the Investor Portal, by sector and governorate."} nav={GOVERNMENT_NAV} active={"/government/investment"} accent={"emerald"} roleNote={""}>
      <div className="grid gap-6">
        <InfoCard title="Opportunities by sector (demo registry)">
          <div className="mt-2"><BarStrip rows={sectors.map((s) => ({ label: s, value: opps.filter((o) => o.sector === s).length }))} /></div>
        </InfoCard>
        <Stat label="Investment leads (demo)" value={String((metrics.headline as Record<string, number>).investmentLeads)} />
      </div>
    </PortalShell>
  );
}
