import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Real estate and living in Egypt",
  description: "Residential, commercial and hospitality property, hotel apartments, offices, land and the new cities — alongside an honest account of what ownership actually requires.",
};

export default async function RealEstatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.properties.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Property"
        title="Real estate and living in Egypt"
        lead="Residential, commercial and hospitality property, hotel apartments, offices, land and the new cities — alongside an honest account of what ownership actually requires."
        seed="real-estate"
        subject="modern"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Listings', value: String(rows.length) },
      { label: 'Property types', value: String(new Set(rows.map((r) => r.propertyType)).size) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Legal advice given', value: 'None' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/real-estate"
        facets={[
      { key: 'propertyType', label: 'Property type', options: [...new Set(rows.map((r) => r.propertyType))].sort() },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
    ]}
        rows={rows.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, summary: p.summary,
      sourceStatus: p.sourceStatus, tags: [p.propertyType, 'modern'], hrefSuffix: '',
      meta: [p.city ?? '', p.areaM2 ? `${p.areaM2.toLocaleString()} m²` : '', p.priceUsd ? `USD ${p.priceUsd.toLocaleString()}` : ''].filter(Boolean),
      badge: { label: p.propertyType.replace(/_/g, ' '), tone: 'gold' as const },
      facets: { propertyType: p.propertyType, governorate: p.governorateSlug },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Ownership rules for non-Egyptians depend on property type, location and current law. This platform does not give legal conclusions — take Egyptian legal advice.","Listings are demonstration records and are not offers.","Title, registration and transfer are matters for the competent authority and a qualified lawyer."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/new-cities","label":"New cities","body":"Where new supply is."},{"href":"/invest","label":"Investor portal","body":"Investment view."},{"href":"/business-setup","label":"Business setup","body":"If you are buying as a company."},{"href":"/accommodation","label":"Accommodation","body":"Renting rather than buying."}]}
        />
      </div>
    </Page>
  );
}
