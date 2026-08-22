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


export const metadata: Metadata = { title: "Revenue control centre", description: "Every commission rule, per service class — nothing here is a single global percentage." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Admin"} title={"Revenue control centre"} subtitle={"Every commission rule, per service class — nothing here is a single global percentage."} nav={ADMIN_NAV} active={"/admin/revenue"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        <Stat label="Base commission assumption (configurable)" value={`${DEFAULT_BASE_COMMISSION_PCT}%`} />
        <DataTable
          columns={['Service class', 'Commissionable', 'Model', 'Note']}
          rows={REVENUE_RULES.map((r) => [r.serviceClass, r.commissionable ? 'Yes' : 'No', r.model.kind, r.note])}
        />
        <InfoCard title="Financial control centre (demo figures)">
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(metrics.financeDemo as Record<string, number>).map(([k, v]) => (
              <Stat key={k} label={k.replace(/([A-Z])/g, ' $1')} value={`$${(v / 1_000_000).toFixed(2)}M`} />
            ))}
          </div>
        </InfoCard>
        <SourceBadge status="SIMULATED" />
      </div>
    </PortalShell>
  );
}
