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


export const metadata: Metadata = { title: "Availability & pricing", description: "Calendar and rate management for your published services." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Provider"} title={"Availability & pricing"} subtitle={"Calendar and rate management for your published services."} nav={PROVIDER_NAV} active={"/provider/availability"} accent={"nile"} roleNote={""}>
      <div className="grid gap-6">
        <InfoCard title="No calendar connected" tone="warn"><p>Availability sync requires a live booking-adapter connection. All adapters are currently PLANNED or SANDBOX — see the Partner integrations page.</p></InfoCard>
      </div>
    </PortalShell>
  );
}
