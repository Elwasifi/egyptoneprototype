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


export const metadata: Metadata = { title: "Security", description: "RBAC/ABAC ceilings, rate limits and hardening posture." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Admin"} title={"Security"} subtitle={"RBAC/ABAC ceilings, rate limits and hardening posture."} nav={ADMIN_NAV} active={"/admin/security"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        <DataTable columns={['Resource', 'Data class']} rows={RBAC_MATRIX.map((r) => [r.resource, r.dataClass])} />
                <InfoCard title="What this console can and cannot do" tone="warn">
          <ul className="grid gap-1.5 text-[12.5px] text-ink-mid">
            <li>· Access decisions combine role (RBAC) with context such as consent, purpose and cohort size (ABAC) — see packages/security.</li>
            <li>· Rate limiting and audit are enforced in the MCP gateway, not left to individual tool handlers.</li>
          </ul>
        </InfoCard>
      </div>
    </PortalShell>
  );
}
