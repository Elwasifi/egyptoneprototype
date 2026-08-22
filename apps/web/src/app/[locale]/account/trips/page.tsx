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
import { ItineraryPreview } from '@/components/ItineraryPreview';

export const metadata: Metadata = { title: "My trips", description: "Draft itineraries built with the Smart Trip Builder or the AI Concierge." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Account"} title={"My trips"} subtitle={"Draft itineraries built with the Smart Trip Builder or the AI Concierge."} nav={ACCOUNT_NAV} active={"/account/trips"} accent={"gold"} roleNote={""}>
      <div className="grid gap-6">
        <ItineraryPreview locale={locale as Locale} />
        <InfoCard title="Nothing else drafted yet" tone="neutral">
          <p>Start a new plan with the <Link href={L(locale as Locale, '/trip-builder')} className="text-gold-300 hover:underline">Smart Trip Builder</Link> or ask the AI Concierge.</p>
        </InfoCard>
      </div>
    </PortalShell>
  );
}
