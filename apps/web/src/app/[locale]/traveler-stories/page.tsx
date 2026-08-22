import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Traveller stories",
  description: "Stories and video from travellers, published only after moderation and a marketing review. Nothing reaches this page — or any social channel — without a human approving it.",
};

export default async function TravelerStoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.stories.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Visitor voice"
        title="Traveller stories"
        lead="Stories and video from travellers, published only after moderation and a marketing review. Nothing reaches this page — or any social channel — without a human approving it."
        seed="traveler-stories"
        subject="city"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Stories', value: String(rows.length) },
      { label: 'Published', value: String(rows.filter((r) => r.moderationState === 'PUBLISHED').length) },
      { label: 'In review', value: String(rows.filter((r) => r.moderationState === 'IN_REVIEW').length) },
      { label: 'Auto-published', value: '0' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/traveler-stories"
        facets={[
      { key: 'country', label: 'Traveller country', options: [...new Set(rows.map((r) => r.country))].sort() },
      { key: 'groupType', label: 'Group type', options: [...new Set(rows.map((r) => r.groupType))].sort() },
      { key: 'moderationState', label: 'Moderation', options: ['PUBLISHED', 'IN_REVIEW'] },
    ]}
        rows={rows.map((s) => ({
      id: s.id, slug: s.slug, name: s.name, summary: s.summary,
      sourceStatus: 'DEMO', tags: ['city'], hrefSuffix: '',
      meta: [s.country, s.groupType, s.destinations.join(', ')],
      badge: { label: s.moderationState === 'PUBLISHED' ? 'Published' : 'In review', tone: s.moderationState === 'PUBLISHED' ? 'ok' as const : 'warn' as const },
      facets: { country: s.country, groupType: s.groupType, moderationState: s.moderationState },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Every story passes moderation and a marketing review before publication. The Marketing Agent can queue content but cannot publish it.","Traveller names and identifying details are not published without consent.","Stories in this prototype are demonstration content, not real submissions."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/reviews","label":"Reviews","body":"Structured feedback."},{"href":"/media","label":"Media centre","body":"Press and assets."},{"href":"/admin/support","label":"Moderation queue","body":"How review works."},{"href":"/discover","label":"Discover Egypt","body":"Where they went."}]}
        />
      </div>
    </Page>
  );
}
