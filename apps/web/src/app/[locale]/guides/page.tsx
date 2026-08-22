import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Guides and assistants",
  description: "A marketplace matching travellers to guides on language, governorate, specialty, availability, rating and accessibility expertise. Verification here means Egypt One checked submitt",
};

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.byType('GUIDE');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="People"
        title="Guides and assistants"
        lead="A marketplace matching travellers to guides on language, governorate, specialty, availability, rating and accessibility expertise. Verification here means Egypt One checked submitted documents — it is never presented as a government licence."
        seed="guides"
        subject="city"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Guides listed', value: String(rows.length) },
      { label: 'Verified on platform', value: String(rows.filter((r) => r.verification === 'VERIFIED').length) },
      { label: 'Languages covered', value: String(new Set(rows.flatMap((r) => r.languages ?? [])).size) },
      { label: 'Governorates covered', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/guides"
        facets={[
      { key: 'language', label: 'Language', options: [...new Set(rows.flatMap((r) => r.languages ?? []))].sort() },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'specialty', label: 'Specialty', options: [...new Set(rows.flatMap((r) => r.specialties ?? []))].sort() },
      { key: 'verification', label: 'Verification', options: ['VERIFIED', 'IN_REVIEW'] },
    ]}
        rows={rows.map((g) => ({
      id: g.id, slug: g.slug, name: g.name, summary: (g.specialties ?? []).join(' · '),
      sourceStatus: g.sourceStatus, tags: ['guide'],
      meta: [(g.languages ?? []).slice(0, 4).join(', '), g.priceFrom ? `from ${g.currency} ${g.priceFrom}` : ''].filter(Boolean),
      badge: { label: g.verification === 'VERIFIED' ? 'Verified' : 'In review', tone: g.verification === 'VERIFIED' ? 'ok' as const : 'warn' as const },
      facets: { language: g.languages, governorate: g.governorateSlug, specialty: g.specialties, verification: g.verification },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["No guide is described as officially licensed unless a verification record exists for them.","Availability shown is indicative. Confirmed booking requires a connected provider adapter, and none is live in this prototype.","Guides\\u2019 personal contact details are never exposed through the platform or the AI Concierge."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/trip-builder","label":"Trip builder","body":"Add a guide to an itinerary."},{"href":"/activities","label":"Activities","body":"Guided experiences."},{"href":"/heritage","label":"Heritage","body":"What your guide will show you."},{"href":"/provider","label":"Provider portal","body":"Register as a guide."}]}
        />
      </div>
    </Page>
  );
}
