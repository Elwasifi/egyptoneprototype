import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Media centre",
  description: "Material for journalists, partners and campaign teams — plus the moderation and approval workflow that every piece of published traveller content passes through.",
};

export default async function MediaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Press"}
        title={"Media centre"}
        lead={"Material for journalists, partners and campaign teams — plus the moderation and approval workflow that every piece of published traveller content passes through."}
        seed={"media"}
        subject={"city"}
        stats={[
      { label: 'Stories in the queue', value: String(db.stories.all().length) },
      { label: 'Published', value: String(db.stories.all().filter((s: { moderationState: string }) => s.moderationState === 'PUBLISHED').length) },
      { label: 'Auto-published', value: '0' },
      { label: 'Human approvals required', value: 'Every one' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">How content reaches publication</h2>
        <StepList steps={[{"title":"Submission","body":"A traveller, guide or coordinator uploads text or video through their account."},{"title":"Moderation","body":"Content is checked for safety, accuracy of claims and consent from anyone identifiable in it."},{"title":"Marketing review","body":"The Marketing Agent can classify, segment and queue content — it cannot publish. A human approves."},{"title":"Editing and approval","body":"Editorial changes are made with the contributor’s agreement."},{"title":"Publication","body":"Content appears on the platform. Distribution to any external channel is a separate, explicit decision.","note":"No AI agent on this platform can publish to a social channel."}]} />
      </section>
        <InfoCard title={"Brand and identity"}>
        <FactList rows={[["Name","Egypt One"],["Tagline","One Egypt. One Journey. One Platform."],["Mark","Circular gold ring with ankh, pyramids and Sphinx profile"],["Palette","Deep midnight navy with Egyptian gold; Nile blue, turquoise, bronze and sandstone as secondary accents"],["Typography","Plus Jakarta Sans (Latin), IBM Plex Sans Arabic (Arabic), Cormorant Garamond (display)"],["Prototype notice","Any screenshot of this build should be captioned as a demonstration prototype."]]} />
      </InfoCard>
        <InfoCard title={"A note for journalists"}>
        <p>This is a working prototype. Every figure, listing, provider, opportunity and statistic in it is demonstration or synthetic data unless a source badge says otherwise. No government integration is connected, no commercial partnership exists with any named company, and the platform holds no licence, mandate or official endorsement.</p>
      </InfoCard>

        <Boundary points={["Egypt One does not claim government endorsement, and no material from this platform should imply one.","Traveller content is published only with consent and after human review.","Demonstration data must not be reported as an Egyptian tourism statistic."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/traveler-stories","label":"Traveller stories","body":"The published queue."},{"href":"/about","label":"About","body":"What the platform is."},{"href":"/admin/support","label":"Moderation","body":"How review works."},{"href":"/reviews","label":"Reviews","body":"Structured feedback."}]}
        />
      </div>
    </Page>
  );
}
