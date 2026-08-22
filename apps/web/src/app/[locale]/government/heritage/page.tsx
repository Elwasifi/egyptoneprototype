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
import { GOVERNMENT_NAV } from '@/lib/nav';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = { title: "Heritage registry", description: "Access classification and restoration state for every recorded site — a coordination view, not the authoritative registry." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const sites = db.heritage.all();
  const byAccess = sites.reduce((acc: Record<string, number>, s) => { acc[s.access] = (acc[s.access] ?? 0) + 1; return acc; }, {});
  return (
    <PortalShell portal={"Government"} title={"Heritage registry"} subtitle={"Access classification and restoration state for every recorded site — a coordination view, not the authoritative registry."} nav={GOVERNMENT_NAV} active={"/government/heritage"} accent={"emerald"} roleNote={""}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(byAccess).map(([k, v]) => <Stat key={k} label={k.replace(/_/g, ' ')} value={String(v)} />)}
        </div>
                <InfoCard title="What this console can and cannot do" tone="warn">
          <ul className="grid gap-1.5 text-[12.5px] text-ink-mid">
            <li>· Classification shown here mirrors what the relevant authority has communicated to the platform; it is not a live feed from any ministry system.</li>
          </ul>
        </InfoCard>
      </div>
    </PortalShell>
  );
}
