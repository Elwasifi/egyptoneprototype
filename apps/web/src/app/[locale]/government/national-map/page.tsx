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
import { EgyptMap } from '@/components/EgyptMap';

export const metadata: Metadata = { title: "National map", description: "Governorate, heritage, provider, event and investment layers on a real, interactive basemap." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Government"} title={"National map"} subtitle={"Governorate, heritage, provider, event and investment layers on a real, interactive basemap."} nav={GOVERNMENT_NAV} active={"/government/national-map"} accent={"emerald"} roleNote={""}>
      <div className="grid gap-6">
        <EgyptMap locale={locale as Locale} />
      </div>
    </PortalShell>
  );
}
