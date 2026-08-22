import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Egyptian heritage worldwide",
  description: "A catalogue of Egyptian antiquities and heritage objects held outside Egypt: the object, its period, the holding institution and country. Provenance is recorded as an open question",
};

export default async function EgyptianHeritageWorldwidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.worldwide.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Abroad"
        title="Egyptian heritage worldwide"
        lead="A catalogue of Egyptian antiquities and heritage objects held outside Egypt: the object, its period, the holding institution and country. Provenance is recorded as an open question, never asserted."
        seed="egyptian-heritage-worldwide"
        subject="museum"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Catalogue entries', value: String(rows.length) },
      { label: 'Countries', value: String(new Set(rows.map((r) => r.country)).size) },
      { label: 'Institutions', value: String(new Set(rows.map((r) => r.institution)).size) },
      { label: 'Provenance claims made', value: 'None' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/egyptian-heritage-worldwide"
        facets={[
      { key: 'country', label: 'Country', options: [...new Set(rows.map((r) => r.country))].sort() },
      { key: 'era', label: 'Era', options: [...new Set(rows.map((r) => r.era))] },
    ]}
        rows={rows.map((o) => ({
      id: o.id, slug: o.slug, name: o.name, summary: `${o.institution}, ${o.country}`,
      sourceStatus: o.sourceStatus, tags: ['museum', o.era], hrefSuffix: '',
      meta: [o.era.replace(/_/g, ' ').toLowerCase()],
      badge: { label: o.country, tone: 'neutral' as const },
      facets: { country: o.country, era: o.era },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Egypt One makes no claim here about legal title, acquisition circumstances or restitution status for any object.","Counts and provenance are not invented. Entries stay as demonstration records until authoritative data is supplied by the holding institution and the Egyptian authorities.","This catalogue is documentation, not advocacy or a legal position."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/museums","label":"Museums in Egypt","body":"Collections at home."},{"href":"/heritage","label":"Heritage registry","body":"Sites of origin."},{"href":"/research","label":"Research","body":"Provenance scholarship."},{"href":"/media","label":"Media centre","body":"How this is reported."}]}
        />
      </div>
    </Page>
  );
}
