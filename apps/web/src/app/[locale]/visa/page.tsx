import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Visa and entry",
  description: "Egypt One is a navigation layer for entry requirements. It does not issue, approve or confirm any entry permission, and it will not guess at a requirement it cannot verify.",
};

export default async function VisaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Before you travel"}
        title={"Visa and entry"}
        lead={"Egypt One is a navigation layer for entry requirements. It does not issue, approve or confirm any entry permission, and it will not guess at a requirement it cannot verify."}
        seed={"visa"}
        subject={"modern"}
        stats={[
      { label: 'Country gateways', value: String(db.countries.count()) },
      { label: 'Authority integrations connected', value: '0' },
      { label: 'Visas issued here', value: 'None' },
      { label: 'Decisions made here', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <InfoCard title={"How this works"}>
        <p>Entry requirements for Egypt depend on nationality, purpose of travel, route, duration and current policy — and they change. There is exactly one authoritative answer for any given traveller, and it comes from the competent Egyptian authority or an Egyptian diplomatic mission, not from a platform.</p>
        <p className="mt-3">What Egypt One can usefully do is route you to the right place, explain the shape of the process, hold your trip context so you know what you are applying for, and record what you have checked. When an official integration is connected, verified guidance will appear here with an official-source label. Until then, this page tells you where to go rather than what the answer is.</p>
      </InfoCard>
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">What to check before booking anything</h2>
        <StepList steps={[{"title":"Confirm the requirement for your nationality","body":"Check with the Egyptian mission accredited to your country or the competent authority. Do not rely on a third-party summary."},{"title":"Check passport validity and blank pages","body":"Validity requirements are set by the authority and are commonly stricter than travellers expect."},{"title":"Match the visa type to your purpose","body":"Tourism, business, study, research, medical treatment and work are different categories with different evidence requirements."},{"title":"Allow for processing time","body":"Build the lead time into your trip dates before committing to non-refundable bookings."},{"title":"Carry supporting documents","body":"Accommodation, return travel and funds evidence may be requested on arrival.","note":"Egypt One can assemble your itinerary as supporting material, but the decision is never ours."}]} />
      </section>
        <InfoCard title={"Integration status"}>
        <FactList rows={[["Visa and entry information service","PLANNED — not connected"],["Ministry of Foreign Affairs mission directory","PLANNED — not connected"],["Data class","RESTRICTED GOVERNMENT"],["Write access","None. Read-only by design, even once connected."],["What is shown meanwhile","Navigation and process shape only, labelled as demonstration content."]]} />
      </InfoCard>

        <Boundary points={["Nothing on this page is an official answer about entry to Egypt.","Egypt One cannot issue, expedite, guarantee or appeal any entry decision.","Requirements change. Verify close to travel, not months ahead.","Be cautious of any site that offers to \"guarantee\" a visa — this platform never will."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/egypt-195","label":"Egypt 195","body":"Guidance by country."},{"href":"/safety","label":"Safety centre","body":"Once you are here."},{"href":"/trip-builder","label":"Trip builder","body":"Plan around the lead time."},{"href":"/support","label":"Support","body":"Ask a question."}]}
        />
      </div>
    </Page>
  );
}
