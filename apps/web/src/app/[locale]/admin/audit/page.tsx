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


export const metadata: Metadata = { title: "Audit log", description: "Every access decision recorded for sensitive, restricted or exported data." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const auditRows = recentAudit(50);
  return (
    <PortalShell portal={"Admin"} title={"Audit log"} subtitle={"Every access decision recorded for sensitive, restricted or exported data."} nav={ADMIN_NAV} active={"/admin/audit"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        {auditRows.length ? (
          <DataTable columns={['Time', 'Action', 'Resource', 'Decision']} rows={auditRows.map((a) => [a.at, a.action, a.resource, a.decision])} />
        ) : (
          <EmptyState title="No audited actions yet this session" body="The log fills as sensitive data is accessed or exported." />
        )}
      </div>
    </PortalShell>
  );
}
