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
import { PARTNER_NAV } from '@/lib/nav';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = { title: "Partner overview", description: "Strategic and technology partners integrating with Egypt One through declared adapters." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const live = ADAPTER_LIST.filter((a) => a.state === 'LIVE').length;
  return (
    <PortalShell portal={"Strategic Partner"} title={"Partner overview"} subtitle={"Strategic and technology partners integrating with Egypt One through declared adapters."} nav={PARTNER_NAV} active={"/partner"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Declared adapter categories" value={String(ADAPTER_LIST.length)} />
          <Stat label="Live integrations" value={String(live)} />
          <Stat label="Sandbox / planned" value={String(ADAPTER_LIST.length - live)} />
        </div>
        <InfoCard title="No integration is presented as live unless it is" tone="warn"><p>Every adapter below shows its true state. A PLANNED or SANDBOX adapter never appears to travellers as a working booking path.</p></InfoCard>
      </div>
    </PortalShell>
  );
}
