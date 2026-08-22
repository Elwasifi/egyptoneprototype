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


export const metadata: Metadata = { title: "Emergency aggregates", description: "De-identified, aggregate safety signals only — never individual traveller location or identity." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Government"} title={"Emergency aggregates"} subtitle={"De-identified, aggregate safety signals only — never individual traveller location or identity."} nav={GOVERNMENT_NAV} active={"/government/emergencies"} accent={"emerald"} roleNote={""}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Open emergency cases (demo)" value={String((metrics.headline as Record<string, number>).emergencyCases)} />
          <Stat label="Location Mode is opt-in" value="Trip / Emergency" />
          <Stat label="Individual tracking" value="Never by default" />
        </div>
                <InfoCard title="What this console can and cannot do" tone="warn">
          <ul className="grid gap-1.5 text-[12.5px] text-ink-mid">
            <li>· Individual location data is a RESTRICTED data class requiring explicit consent and is never shown here in identifiable form.</li>
            <li>· This view is aggregate-only and re-identification-checked before display.</li>
          </ul>
        </InfoCard>
      </div>
    </PortalShell>
  );
}
