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


export const metadata: Metadata = { title: "Provider coverage", description: "Verified-provider density by governorate and category, and where gaps are indicated." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const gaps = metrics.providerGaps as { governorate: string; gap: string }[];
  return (
    <PortalShell portal={"Government"} title={"Provider coverage"} subtitle={"Verified-provider density by governorate and category, and where gaps are indicated."} nav={GOVERNMENT_NAV} active={"/government/providers"} accent={"emerald"} roleNote={""}>
      <div className="grid gap-6">
        <InfoCard title="Coverage gaps flagged by the demo model">
          <ul className="grid gap-1.5 text-[12.5px] text-ink-mid">{gaps.map((g, i) => <li key={i}>· <span className="font-medium text-ink-hi">{g.governorate}</span> — {g.gap}</li>)}</ul>
        </InfoCard>
        <SourceBadge status="SIMULATED" />
      </div>
    </PortalShell>
  );
}
