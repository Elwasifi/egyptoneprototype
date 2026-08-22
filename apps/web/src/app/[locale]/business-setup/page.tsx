import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import type { Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, SectionHeader, SmartImage, BarStrip } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, StepList, Boundary, RelatedLinks } from '@/components/Module';
import { href as L } from '@/lib/locale';


export const metadata: Metadata = {
  title: "Business setup navigator",
  description: "A navigator, not an application portal: choose an activity and a location, see the legal structures available, which authorities are involved, what licences and documents are requi",
};

export default async function BusinessSetupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  

  return (
    <Page wide>
      <ModuleHero
        eyebrow={"Do business"}
        title={"Business setup navigator"}
        lead={"A navigator, not an application portal: choose an activity and a location, see the legal structures available, which authorities are involved, what licences and documents are required, and where the official application actually happens."}
        seed={"business-setup"}
        subject={"city"}
        stats={[
      { label: 'Authorities mapped', value: '8' },
      { label: 'Government integrations connected', value: '0' },
      { label: 'Licences issued here', value: 'None' },
      { label: 'Applications submitted here', value: 'None' },
    ]}
      />

      <div className="grid gap-8">
        <section>
        <h2 className="mb-4 text-[17px] font-semibold text-ink-hi">The navigation path</h2>
        <StepList steps={[{"title":"Choose the activity","body":"What the business will actually do determines almost everything downstream — the authority, the licence class and the evidence required."},{"title":"Choose the location","body":"A governorate, an industrial zone, a free zone or a new community. Each has a different responsible body."},{"title":"Choose the legal structure","body":"The structure affects capital requirements, foreign ownership rules, tax treatment and which registrations apply."},{"title":"See the required authorities","body":"The navigator names each body involved and what it is responsible for."},{"title":"See the required licences","body":"Activity licences, premises approvals and sector-specific permissions."},{"title":"Assemble the documents","body":"A checklist derived from the activity, structure and location."},{"title":"Apply through the official channel","body":"The navigator links out. It does not submit, endorse or expedite anything.","note":"Where an integration exists, application status can be shown read-only. None is connected today."}]} />
      </section>
        <InfoCard title={"Bodies commonly involved"}>
        <FactList rows={[["Investment and free zones","Company establishment, incentives and free-zone regimes"],["Commercial registry","Registration of the entity"],["Tax authority","Registration and ongoing obligations"],["Governorate or local authority","Premises, signage and local permissions"],["Sector regulator","Tourism, health, education, transport and others each have their own"],["New Urban Communities Authority","Where the location is a new community"],["Suez Canal Economic Zone","Where the location falls inside the zone"],["Social insurance and labour","Employment obligations"]]} />
      </InfoCard>
        <InfoCard title={"What \"navigator\" means precisely"}>
        <p>Egypt One is an integration and experience layer. It can sequence a process, explain what each step is for, hold your documents in your own account and link you to the right official channel. It cannot issue a licence, approve a registration, influence a decision or shorten a queue — and any platform that claims otherwise should be treated with suspicion.</p>
      </InfoCard>

        <Boundary points={["Egypt One does not issue licences, approve registrations or submit applications.","This is not legal advice. Take Egyptian legal and tax advice before establishing an entity.","Requirements change and vary by activity, structure and location. Verify with the competent authority.","No government integration is connected in this prototype, so no procedure shown here is authoritative."]} />

        <RelatedLinks
          locale={locale as Locale}
          links={[{"href":"/invest","label":"Investor portal","body":"Find the opportunity first."},{"href":"/corporate-mice","label":"Corporate & MICE","body":"Business travel."},{"href":"/real-estate","label":"Real estate","body":"Premises."},{"href":"/partner","label":"Partner portal","body":"Integrating with us."}]}
        />
      </div>
    </Page>
  );
}
