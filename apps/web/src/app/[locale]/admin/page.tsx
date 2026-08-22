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


export const metadata: Metadata = { title: "Platform operations console", description: "Cross-portal operations: content, users, verification, integrations, revenue, AI and security." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const auditRows = recentAudit(5);
  return (
    <PortalShell portal={"Admin"} title={"Platform operations console"} subtitle={"Cross-portal operations: content, users, verification, integrations, revenue, AI and security."} nav={ADMIN_NAV} active={"/admin"} accent={"royal"} roleNote={"Signed in as a demo platform operator."}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Portals live" value="7" />
          <Stat label="Route templates" value="70+" />
          <Stat label="Agents registered" value={String(AGENTS.length)} />
          <Stat label="Live integrations" value={String(ADAPTER_LIST.filter((a) => a.state === 'LIVE').length)} />
        </div>
        <InfoCard title="Recent audit activity">
          {auditRows.length ? (
            <ul className="grid gap-1.5 text-[12px] text-ink-mid">{auditRows.map((a, i) => <li key={i}>· {a.action} on {a.resource} — {a.decision}</li>)}</ul>
          ) : <p className="text-ink-faint">No audited actions yet this session.</p>}
        </InfoCard>
      </div>
    </PortalShell>
  );
}
