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


export const metadata: Metadata = { title: "Business profile", description: "What travellers and the AI Concierge see about your business." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Provider"} title={"Business profile"} subtitle={"What travellers and the AI Concierge see about your business."} nav={PROVIDER_NAV} active={"/provider/profile"} accent={"nile"} roleNote={""}>
      <div className="grid gap-6">
        <InfoCard title="Profile completeness">
          <div className="mt-2"><Trend points={[40, 55, 62, 70, 78, 82]} /></div>
          <p className="mt-2 text-[12px] text-ink-faint">Illustrative demo curve — not derived from a real profile yet.</p>
        </InfoCard>
        <InfoCard title="Governorates served"><p>Set once you connect a real listing. Demo profile: Cairo, Giza.</p></InfoCard>
      </div>
    </PortalShell>
  );
}
