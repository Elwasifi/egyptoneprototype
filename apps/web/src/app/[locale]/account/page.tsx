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


export const metadata: Metadata = { title: "Your Egypt One account", description: "A single identity across all seven experiences — trips, bookings, your pass, wallet and consent, all in one place." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Account"} title={"Your Egypt One account"} subtitle={"A single identity across all seven experiences — trips, bookings, your pass, wallet and consent, all in one place."} nav={ACCOUNT_NAV} active={"/account"} accent={"gold"} roleNote={"Signed in as a demo traveller."}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Upcoming trips" value="1" />
          <Stat label="Saved places" value="12" />
          <Stat label="Loyalty points" value="0" />
          <Stat label="Consents granted" value="0 of 4" />
        </div>
        <InfoCard title="Your ten-day demonstration itinerary">
          <p>The Smart Trip Builder has drafted an example journey so you can see the shape of a real plan — nothing here is booked or paid for.</p>
          <Link href={L(locale as Locale, '/account/trips')} className="mt-3 inline-block text-[12.5px] font-medium text-gold-300 hover:underline">Open my trips →</Link>
        </InfoCard>
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard title="Egypt One Pass"><p>A single credential across guides, sites and providers. Not yet linked to any physical access control.</p></InfoCard>
          <InfoCard title="Wallet & rewards"><p>Points are illustrative. No currency value is stored or transferable in this prototype.</p></InfoCard>
          <InfoCard title="Privacy & consent"><p>Location, health and identity data all require an explicit consent grant before any agent can use them.</p></InfoCard>
        </div>
      </div>
    </PortalShell>
  );
}
