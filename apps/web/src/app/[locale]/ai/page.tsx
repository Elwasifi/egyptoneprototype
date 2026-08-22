import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';
import { ConciergePanel } from '@/components/Concierge';
import { AgentGraph } from '@/components/AgentGraph';
import { getMessages } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Egypt One AI Concierge",
  description: "One conversational interface for everything on the platform. Behind it, fifteen specialised agents each with a defined purpose and a hard permission boundary — and you never have t",
};

export default async function AiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = getMessages(locale as Locale);

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"One assistant"}
        title={"Egypt One AI Concierge"}
        lead={"One conversational interface for everything on the platform. Behind it, fifteen specialised agents each with a defined purpose and a hard permission boundary — and you never have to know which one answered."}
        seed={"ai"}
        subject={"modern"}
        stats={[
      { label: 'Agents', value: '16' },
      { label: 'MCP tools declared', value: '30' },
      { label: 'Skills', value: '14' },
      { label: 'Unlabelled answers', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <section><div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <ConciergePanel locale={locale as Locale} messages={messages} variant="page" />
        <div className="grid content-start gap-4">
          <InfoCard title="How routing works">
            <p>The Concierge detects intent, decomposes the request, checks whether your role and consents permit the specialist it wants, then composes one answer with source labels attached.</p>
            <p className="mt-3">Routing is deterministic and inspectable rather than buried in a prompt, so what the platform decided and what the model decided stay separable — and both end up in the audit log.</p>
          </InfoCard>
          <InfoCard title="The source rule">
            <p>Any answer touching laws, visas, permits, licences, ticket availability, live pricing, opening hours, medical claims, investment guarantees or government decisions must carry a source label. If no tool returned a labelled record, the answer is downgraded and says so.</p>
          </InfoCard>
          <InfoCard title="What it will not do">
            <ul className="grid gap-1.5">
              <li>· Present demo data as an official answer</li>
              <li>· Invent a price, an opening time or an availability</li>
              <li>· Describe anyone as licensed without a verification record</li>
              <li>· Diagnose, or interpret a medical result</li>
              <li>· Guarantee an investment return</li>
              <li>· Publish anything without human approval</li>
              <li>· Read your location without consent</li>
            </ul>
          </InfoCard>
        </div>
      </div></section>
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">The agent graph</h2>
        <AgentGraph />
      </section>

        <Boundary points={["The Concierge answers from demonstration data in this prototype and labels every answer accordingly.","It cannot override a government decision, modify restricted data or act outside the caller’s permissions.","Conversations are stored against your account; sensitive tool calls are audited."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/admin/ai","label":"Agent registry","body":"Every agent and boundary."},{"href":"/trip-builder","label":"Trip builder","body":"The form version."},{"href":"/about","label":"About","body":"Platform boundaries."},{"href":"/search","label":"Search","body":"Look it up directly."}]}
        />
      </div>
    </Page>
  );
}
