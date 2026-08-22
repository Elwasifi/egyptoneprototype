import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: "Investment opportunity registry",
  description: "Indicative opportunities across tourism, hospitality, entertainment, real estate, healthcare, agriculture, logistics, technology and the new cities. Each entry names the competent ",
};

export default async function InvestmentOpportunitiesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const rows = db.investment.all();

  return (
    <Page wide>
      <ModuleHero
        eyebrow="Invest"
        title="Investment opportunity registry"
        lead="Indicative opportunities across tourism, hospitality, entertainment, real estate, healthcare, agriculture, logistics, technology and the new cities. Each entry names the competent entity — because Egypt One does not allocate land, grant licences or guarantee returns."
        seed="investment-opportunities"
        subject="modern"
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={[
      { label: 'Opportunities', value: String(rows.length) },
      { label: 'Sectors', value: String(new Set(rows.map((r) => r.sector)).size) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Guaranteed returns', value: 'None' },
    ]}
      />

      <Listing
        locale={locale as Locale}
        basePath="/investment-opportunities"
        facets={[
      { key: 'sector', label: 'Sector', options: [...new Set(rows.map((r) => r.sector))].sort() },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'stage', label: 'Stage', options: ['CONCEPT', 'FEASIBILITY', 'READY', 'IN_EXECUTION'] },
      { key: 'size', label: 'Ticket size', options: ['Under USD 10M', 'USD 10–50M', 'Over USD 50M'] },
    ]}
        rows={rows.map((o) => ({
      id: o.id, slug: o.slug, name: o.name, summary: o.summary,
      sourceStatus: o.sourceStatus, tags: [o.sector, 'modern'],
      meta: [`USD ${(o.investmentRangeUsd[0] / 1e6).toFixed(0)}–${(o.investmentRangeUsd[1] / 1e6).toFixed(0)}M`, o.governorateSlug.replace(/-/g, ' ')],
      badge: { label: o.stage.replace(/_/g, ' '), tone: 'nile' as const },
      facets: {
        sector: o.sector, governorate: o.governorateSlug, stage: o.stage,
        size: o.investmentRangeUsd[1] <= 10e6 ? 'Under USD 10M' : o.investmentRangeUsd[1] <= 50e6 ? 'USD 10–50M' : 'Over USD 50M',
      },
    }))}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={["Nothing here is an offer, an allocation, an approval or a guaranteed return.","Feasibility packs, land terms and licences come from the competent entity named on each opportunity.","Demand indicators shown with an opportunity are synthetic demonstration values, not official statistics.","This platform does not provide regulated financial or legal advice."]} />
        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/invest","label":"Investor portal","body":"Start here."},{"href":"/business-setup","label":"Business setup","body":"Establishing the entity."},{"href":"/real-estate","label":"Real estate","body":"Property assets."},{"href":"/government/investment","label":"Government view","body":"Lead pipeline."}]}
        />
      </div>
    </Page>
  );
}
