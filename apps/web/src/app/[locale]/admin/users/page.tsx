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
import { ADMIN_NAV } from '@/lib/nav';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = { title: "Users & roles", description: "The 22-role RBAC model governing every portal." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Admin"} title={"Users & roles"} subtitle={"The 22-role RBAC model governing every portal."} nav={ADMIN_NAV} active={"/admin/users"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        <DataTable columns={['Resource', 'Data class']} rows={RBAC_MATRIX.map((r) => [r.resource, r.dataClass])} />
      </div>
    </PortalShell>
  );
}
