import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';
import { EgyptMap } from '@/components/EgyptMap';

export const metadata: Metadata = {
  title: "National map",
  description: "All 27 governorates on one canvas, with layers for heritage, providers, events and investment. The map renders from local vector data because no map vendor is connected — a deliber",
};

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Geography"}
        title={"National map"}
        lead={"All 27 governorates on one canvas, with layers for heritage, providers, events and investment. The map renders from local vector data because no map vendor is connected — a deliberate choice over an empty frame or a vendor lock-in."}
        seed={"map"}
        subject={"desert"}
        stats={[
      { label: 'Governorates plotted', value: '27' },
      { label: 'Heritage points', value: String(db.heritage.all().filter((h) => h.coordinates).length) },
      { label: 'Map vendor', value: 'None selected' },
      { label: 'Adapter', value: 'MapProviderAdapter' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">Egypt at a glance</h2>
        <EgyptMap locale={locale as Locale} />
      </section>
        <InfoCard title={"Why there is no vendor here"}>
        <p>Mapping is one of the easiest places to create a dependency that is painful to unwind later. The platform declares a MapProviderAdapter contract with geocoding and tile methods, and every map surface in the product talks to that contract rather than to a vendor SDK. Mapbox, Google or a self-hosted OpenStreetMap stack can all satisfy it.</p>
        <p className="mt-3">Until one is chosen, the map draws from local coordinates. It is deliberately schematic rather than pretending to be a survey-grade basemap.</p>
      </InfoCard>

        <Boundary points={["This canvas is schematic. It is not a survey, and boundaries shown are indicative only.","Coordinates for vulnerable heritage sites are deliberately approximate.","No location data about you is read or stored by this page."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/governorates","label":"Governorates","body":"The list view."},{"href":"/heritage","label":"Heritage","body":"Registry."},{"href":"/government/national-map","label":"Government map","body":"The operations view."},{"href":"/discover","label":"Discover","body":"Everything else."}]}
        />
      </div>
    </Page>
  );
}
