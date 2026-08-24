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


export const metadata: Metadata = { title: "Privacy & consent centre", description: "Control exactly what each AI agent and provider is allowed to see." };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;

  return (
    <PortalShell portal={"Account"} title={"Privacy & consent centre"} subtitle={"Control exactly what each AI agent and provider is allowed to see."} nav={ACCOUNT_NAV} active={"/account/consent"} accent={"gold"} roleNote={""}>
      <div className="grid gap-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { key: 'LOCATION', label: 'Location', note: 'Off by default. Trip Mode and Emergency Mode are separate, explicit grants.' },
            { key: 'HEALTH_DATA', label: 'Health data', note: 'Required before the Medical Tourism agent can see any medical context.' },
            { key: 'GENETIC_DATA', label: 'Origin / ancestry signals', note: 'Never used for diagnosis. Off by default.' },
            { key: 'MARKETING', label: 'Marketing communications', note: 'Opt-in only.' },
          ].map((c) => (
            <div key={c.key} className="surface flex items-center justify-between gap-3 p-4">
              <div>
                <div className="text-[13.5px] font-medium text-ink-hi">{c.label}</div>
                <div className="mt-1 text-[11.5px] text-ink-faint">{c.note}</div>
              </div>
              <Badge tone="neutral">Off</Badge>
            </div>
          ))}
        </div>
                <InfoCard title="What this console can and cannot do" tone="warn">
          <ul className="grid gap-1.5 text-[12.5px] text-ink-mid">
            <li>· Location Mode defaults to OFF; Trip Mode and Emergency Mode are separate, revocable grants.</li>
            <li>· Health and genetic-adjacent signals are RESTRICTED data classes — agents cannot read them without an explicit, logged consent.</li>
            <li>· Every consent change is written to the audit log.</li>
          </ul>
        </InfoCard>
        <p className="text-[12.5px] text-ink-faint">
          This panel controls what AI agents and providers may read. For platform-wide consents — cookies, marketing,
          media use — see the <Link href={L(locale as Locale, '/legal/consent')} className="text-gold-300 hover:underline">Consent Centre</Link>.
        </p>
      </div>
    </PortalShell>
  );
}
