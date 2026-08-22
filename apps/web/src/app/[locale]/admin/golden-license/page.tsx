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


export const metadata: Metadata = { title: "Golden Licence readiness", description: "Internal readiness tracking only — this is not a public claim of holding a Golden Licence." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Admin"} title={"Golden Licence readiness"} subtitle={"Internal readiness tracking only — this is not a public claim of holding a Golden Licence."} nav={ADMIN_NAV} active={"/admin/golden-license"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Criteria tracked" value="6" />
          <Stat label="Met" value="0" />
          <Stat label="In progress" value="6" />
          <Stat label="Status" value="Not applied for" />
        </div>
                <InfoCard title="What this console can and cannot do" tone="warn">
          <ul className="grid gap-1.5 text-[12.5px] text-ink-mid">
            <li>· This tracker is internal-only and must never be surfaced as a public claim that Egypt One holds a Golden Licence.</li>
            <li>· Readiness criteria here are illustrative and do not represent a submitted application.</li>
          </ul>
        </InfoCard>
      </div>
    </PortalShell>
  );
}
