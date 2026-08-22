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
import { ADMIN_NAV } from '@/lib/nav';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = { title: "Content & CMS", description: "Draft, review and published states across every content-driven page." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Admin"} title={"Content & CMS"} subtitle={"Draft, review and published states across every content-driven page."} nav={ADMIN_NAV} active={"/admin/content"} accent={"royal"} roleNote={""}>
      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Published" value="All demo content" />
          <Stat label="In review" value="0" />
          <Stat label="Draft" value="0" />
        </div>
                <InfoCard title="What this console can and cannot do" tone="warn">
          <ul className="grid gap-1.5 text-[12.5px] text-ink-mid">
            <li>· This prototype ships all content as published demo data; a real CMS workflow (draft → review → published) is designed but not wired to a persistence layer here.</li>
          </ul>
        </InfoCard>
      </div>
    </PortalShell>
  );
}
