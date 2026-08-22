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


export const metadata: Metadata = { title: "Verification queue", description: "Providers and guides awaiting document review." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const pending = db.providers.all().filter((p) => p.verification !== 'VERIFIED');
  return (
    <PortalShell portal={"Admin"} title={"Verification queue"} subtitle={"Providers and guides awaiting document review."} nav={ADMIN_NAV} active={"/admin/verification"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        <Stat label="Pending review" value={String(pending.length)} />
        {pending.length ? (
          <DataTable columns={['Name', 'Type', 'Status']} rows={pending.slice(0, 20).map((p) => [p.name, p.type, p.verification])} />
        ) : (
          <EmptyState title="Nothing pending" />
        )}
      </div>
    </PortalShell>
  );
}
