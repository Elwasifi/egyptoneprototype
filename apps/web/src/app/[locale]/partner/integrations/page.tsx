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


export const metadata: Metadata = { title: "Integrations", description: "Every declared adapter category and its current connection state." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Strategic Partner"} title={"Integrations"} subtitle={"Every declared adapter category and its current connection state."} nav={PARTNER_NAV} active={"/partner/integrations"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        <DataTable
          columns={['Category', 'Adapter', 'State']}
          rows={ADAPTER_LIST.map((a) => [a.category, a.displayName, <Badge key={a.key} tone={a.state === 'LIVE' ? 'ok' : a.state === 'SANDBOX' ? 'info' : 'neutral'}>{a.state}</Badge>])}
        />
      </div>
    </PortalShell>
  );
}
