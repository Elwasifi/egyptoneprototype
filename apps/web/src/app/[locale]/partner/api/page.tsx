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
import { PARTNER_NAV } from '@/lib/nav';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = { title: "API & credentials", description: "MCP tool families exposed to approved partner integrations." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Strategic Partner"} title={"API & credentials"} subtitle={"MCP tool families exposed to approved partner integrations."} nav={PARTNER_NAV} active={"/partner/api"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        <div className="grid gap-3 md:grid-cols-2">
          {MCP_SERVERS.map((s) => (
            <InfoCard key={s.key} title={s.name} tone="neutral">
              <p>{s.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {MCP_TOOLS.filter((t) => t.server === s.key).slice(0, 4).map((t) => (
                  <span key={t.key} className="rounded border border-white/10 bg-white/4 px-1.5 py-0.5 font-mono text-[10px] text-ink-low">{t.name}</span>
                ))}
              </div>
            </InfoCard>
          ))}
        </div>
                <InfoCard title="What this console can and cannot do" tone="warn">
          <ul className="grid gap-1.5 text-[12.5px] text-ink-mid">
            <li>· No credential shown here is a live production key — this prototype has no production API gateway deployed.</li>
          </ul>
        </InfoCard>
      </div>
    </PortalShell>
  );
}
