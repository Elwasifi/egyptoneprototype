import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Medical tourism",
  description: "Hospitals, clinics, specialists, wellness, rehabilitation and preventive health, with travel coordinated around the appointment rather than the other way round. Health data carries",
};

export default async function MedicalTourismPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.providers.byType('MEDICAL');

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Health"
        title="Medical tourism"
        lead="Hospitals, clinics, specialists, wellness, rehabilitation and preventive health, with travel coordinated around the appointment rather than the other way round. Health data carries the platform’s highest protection."
        seed="medical-tourism"
        subject="city"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Providers listed', value: String(rows.length) },
      { label: 'Specialties', value: String(new Set(rows.flatMap((r) => r.specialties ?? [])).size) },
      { label: 'Accredited network adapter', value: 'Planned' },
      { label: 'Diagnoses given here', value: 'None' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/medical-tourism"
        facets={[
      { key: 'specialty', label: 'Specialty', options: [...new Set(rows.flatMap((r) => r.specialties ?? []))].sort() },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'language', label: 'Language', options: [...new Set(rows.flatMap((r) => r.languages ?? []))].sort() },
    ]}
        rows={rows.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, summary: (p.specialties ?? []).join(' · '),
      sourceStatus: p.sourceStatus, tags: ['city'], hrefSuffix: '',
      meta: [p.governorateSlug.replace(/-/g, ' '), (p.languages ?? []).slice(0, 3).join(', ')],
      badge: { label: 'Sensitive data class', tone: 'danger' as const },
      facets: { specialty: p.specialties, governorate: p.governorateSlug, language: p.languages },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Egypt One does not diagnose, recommend treatment or interpret results. That is for a qualified clinician.","Accreditation shown is a demonstration record. The accredited-network integration is not connected, so no accreditation here is confirmed.","Health data is classified SENSITIVE: explicit consent, a stated purpose and an audit entry are required before any access, and it is never used for marketing or affiliate purposes.","Referral fees are disabled by default and would need legal review before being enabled anywhere they are permitted at all."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/wellness","label":"Wellness","body":"Non-clinical journeys."},{"href":"/account/consent","label":"Consent centre","body":"Control your health data."},{"href":"/know-your-origin","label":"Know your origin","body":"Genetic research boundaries."},{"href":"/safety","label":"Safety centre","body":"If something goes wrong."}]}
        />
      </div>
    </Page>
  );
}
