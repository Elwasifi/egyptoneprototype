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


export const metadata: Metadata = { title: "Provider dashboard", description: "Business/service provider overview — bookings, compliance and payouts in one place." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
  const providers = db.providers.all();
  const verified = providers.filter((p) => p.verification === 'VERIFIED').length;
  return (
    <PortalShell portal={"Provider"} title={"Provider dashboard"} subtitle={"Business/service provider overview — bookings, compliance and payouts in one place."} nav={PROVIDER_NAV} active={"/provider"} accent={"nile"} roleNote={"Signed in as a demo provider (Nile Horizon Tours)."}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Active listings" value="1" />
          <Stat label="Bookings this month" value="0" />
          <Stat label="Verified providers platform-wide" value={String(verified)} />
          <Stat label="Total providers in registry" value={String(providers.length)} />
        </div>
        <InfoCard title="Verification status" tone="warn">
          <p>“Verified” means Egypt One has checked the documents you submitted. It is not a government licence and must not be represented as one to travellers.</p>
        </InfoCard>
      </div>
    </PortalShell>
  );
}
