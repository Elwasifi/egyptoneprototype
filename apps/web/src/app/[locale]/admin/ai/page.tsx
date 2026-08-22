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
import { AgentGraph } from '@/components/AgentGraph';

export const metadata: Metadata = { title: "AI agents & MCP registry", description: "The live agent graph and every declared MCP tool, exactly as the platform enforces them." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Admin"} title={"AI agents & MCP registry"} subtitle={"The live agent graph and every declared MCP tool, exactly as the platform enforces them."} nav={ADMIN_NAV} active={"/admin/ai"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        <AgentGraph />
        <InfoCard title="MCP servers">
          <DataTable columns={['Server', 'Purpose']} rows={MCP_SERVERS.map((s) => [s.name, s.description])} />
        </InfoCard>
        <InfoCard title="MCP tools">
          <DataTable columns={['Tool', 'Server', 'State', 'Audited']} rows={MCP_TOOLS.map((t) => [t.name, t.server, t.state, t.auditRequired ? 'Yes' : 'No'])} />
        </InfoCard>
      </div>
    </PortalShell>
  );
}
