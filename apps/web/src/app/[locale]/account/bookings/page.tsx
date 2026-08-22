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
import { ACCOUNT_NAV } from '@/lib/nav';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = { title: "Bookings", description: "Every confirmed booking across accommodation, guides, transport and activities." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Account"} title={"Bookings"} subtitle={"Every confirmed booking across accommodation, guides, transport and activities."} nav={ACCOUNT_NAV} active={"/account/bookings"} accent={"gold"} roleNote={""}>
      <div className="grid gap-6">
        <EmptyState title="No bookings yet" body="Booking connects to accommodation, guide and transport providers once an integration is live — none is connected in this prototype." />
      </div>
    </PortalShell>
  );
}
