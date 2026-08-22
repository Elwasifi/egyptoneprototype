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


export const metadata: Metadata = { title: "National overview", description: "Aggregated, de-identified tourism signals for the competent authorities — never a substitute for official statistics." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const h = metrics.headline as Record<string, number>;
  return (
    <PortalShell portal={"Government"} title={"National overview"} subtitle={"Aggregated, de-identified tourism signals for the competent authorities — never a substitute for official statistics."} nav={GOVERNMENT_NAV} active={"/government"} accent={"emerald"} roleNote={"Signed in as a demo government analyst."}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Visitors this month (simulated)" value={h.visitorsThisMonth.toLocaleString()} />
          <Stat label="Active providers" value={String(h.activeProviders)} />
          <Stat label="Verified guides" value={String(h.verifiedGuides)} />
          <Stat label="Open complaints" value={String(h.openComplaints)} />
        </div>
        <InfoCard title="This is a coordination layer, not an official statistics office" tone="warn">
          <p>Every figure here is SIMULATED demonstration data. Egypt One never publishes or implies official government statistics.</p>
        </InfoCard>
        <SourceBadge status="SIMULATED" />
      </div>
    </PortalShell>
  );
}
