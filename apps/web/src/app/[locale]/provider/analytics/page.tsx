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
import { PROVIDER_NAV } from '@/lib/nav';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = { title: "Analytics", description: "Demand signals relevant to your governorate and category — demonstration data only." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const share = (metrics.governorateShare as { governorate: string; visitors: number }[]).slice(0, 6);
  return (
    <PortalShell portal={"Provider"} title={"Analytics"} subtitle={"Demand signals relevant to your governorate and category — demonstration data only."} nav={PROVIDER_NAV} active={"/provider/analytics"} accent={"nile"} roleNote={""}>
      <div className="grid gap-6">
        <InfoCard title="Visitor share by governorate (simulated)">
          <div className="mt-3"><BarStrip rows={share.map((s) => ({ label: s.governorate, value: s.visitors }))} /></div>
        </InfoCard>
        <SourceBadge status="SIMULATED" />
      </div>
    </PortalShell>
  );
}
