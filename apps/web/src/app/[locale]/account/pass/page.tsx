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


export const metadata: Metadata = { title: "Egypt One Pass", description: "A unified identity credential for verified access across the platform." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Account"} title={"Egypt One Pass"} subtitle={"A unified identity credential for verified access across the platform."} nav={ACCOUNT_NAV} active={"/account/pass"} accent={"gold"} roleNote={""}>
      <div className="grid gap-6">
        <InfoCard title="Not yet a physical or ticketing credential" tone="warn">
          <p>The Pass authenticates you to Egypt One. It does not currently grant entry to any heritage site, museum or transport gate — those remain controlled by their own operators.</p>
        </InfoCard>
        <div className="surface-gold p-6">
          <div className="text-[11px] uppercase tracking-[0.16em] text-gold-600">Demo credential</div>
          <div className="mt-2 text-[20px] font-semibold text-gold-100">Egypt One Pass — Prototype</div>
          <div className="mt-1 text-[12.5px] text-ink-low">Holder: Demo Traveller · Tier: Explorer</div>
        </div>
      </div>
    </PortalShell>
  );
}
