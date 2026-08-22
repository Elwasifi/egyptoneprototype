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
import { PROVIDER_NAV } from '@/lib/nav';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = { title: "Payouts & settlement", description: "How commission and settlement work, and what is configurable." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const rule = REVENUE_RULES.find((r) => r.serviceClass === 'GUIDE')!;
  return (
    <PortalShell portal={"Provider"} title={"Payouts & settlement"} subtitle={"How commission and settlement work, and what is configurable."} nav={PROVIDER_NAV} active={"/provider/payouts"} accent={"nile"} roleNote={""}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Base commission assumption" value={`${DEFAULT_BASE_COMMISSION_PCT}%`} />
          <Stat label="Your service-class rate" value={rule.model.kind === 'PERCENTAGE' ? `${rule.model.pct}%` : rule.model.kind} />
          <Stat label="Outstanding settlement (demo)" value={`$${(metrics.financeDemo.outstandingSettlementUsd / 1_000_000).toFixed(2)}M`} />
        </div>
        <InfoCard title="Rate depends on your service class, not a single global number" tone="warn">
          <p>{rule.note} The 5% figure quoted in the business plan is a base negotiation assumption, never a hardcoded platform-wide rate.</p>
        </InfoCard>
      </div>
    </PortalShell>
  );
}
