import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';
import { SearchSurface } from '@/components/SearchSurface';

export const metadata: Metadata = {
  title: "Search",
  description: "One index across governorates, cities, destinations, heritage, museums, rulers, hotels, guides, restaurants, activities, events, investment, research, medical and products — the sa",
};

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Find anything"}
        title={"Search"}
        lead={"One index across governorates, cities, destinations, heritage, museums, rulers, hotels, guides, restaurants, activities, events, investment, research, medical and products — the same index the AI Concierge queries."}
        seed={"search"}
        subject={"city"}
        stats={[
      { label: 'Indexed entities', value: '13 types' },
      { label: 'Records', value: String(db.governorates.all().length + db.destinations.all().length + db.heritage.all().length + db.museums.all().length + db.providers.all().length + db.investment.all().length + db.products.all().length + db.countries.all().length) },
      { label: 'Semantic search', value: 'Architecture ready' },
      { label: 'Index backend', value: 'In-memory (demo)' },
    ]}
      />

      <div className="grid gap-8">
        <section><SearchSurface locale={locale as Locale} /></section>

        <Boundary points={["Search runs against demonstration content. Results carry the source status of the record behind them.","In production this abstraction is backed by an OpenSearch-compatible index; in the prototype it is in memory."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/discover","label":"Discover","body":"Browse instead."},{"href":"/map","label":"Map","body":"Search by place."},{"href":"/ai","label":"AI Concierge","body":"Ask a question."},{"href":"/governorates","label":"Governorates","body":"Start with a region."}]}
        />
      </div>
    </Page>
  );
}
