import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import { LOCALES, type Locale } from '@egypt-one/i18n';
import { Badge, SourceBadge, AccessBadge, Breadcrumbs, SectionHeader, SmartImage, subjectFor } from '@egypt-one/ui';
import { Page } from '@/components/Container';
import { ModuleHero, InfoCard, FactList, ChipList, Boundary, RelatedLinks, SourceNote, StepList } from '@/components/Module';
import { href as L } from '@/lib/locale';

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => db.countries.all().map((c) => ({ locale, country: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const c = db.countries.bySlug(country);
  return c ? { title: `Egypt from ${c.name}`, description: c.summary } : { title: 'Country not found' };
}

export default async function CountryGateway({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale, country } = await params;
  const c = db.countries.bySlug(country);
  if (!c) notFound();
  const l = (p: string) => L(locale as Locale, p);
  const sameRegion = db.countries.byRegion(c.region).filter((x) => x.slug !== c.slug).slice(0, 12);

  return (
    <Page wide>
      <Breadcrumbs items={[{ label: 'Home', href: l('/') }, { label: 'Egypt 195', href: l('/egypt-195') }, { label: c.name }]} />
      <ModuleHero
        eyebrow={`${c.region} · Country gateway`}
        title={`Egypt from ${c.name}`}
        lead={`Routes, connectivity, entry guidance and where to verify official information for travellers, investors and researchers coming from ${c.name}.`}
        seed={c.slug}
        subject="modern"
        badges={<><Badge tone="nile">{c.iso2}</Badge><SourceBadge status={c.sourceStatus} owner={c.sourceOwner} /></>}
        actions={[{ href: l('/trip-builder'), label: 'Plan a trip', primary: true }, { href: l('/visa'), label: 'Visa & entry guidance' }, { href: l('/invest'), label: 'Investor portal' }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="Entry requirements" tone="warn">
            <p>{c.visaRoute}</p>
            <p className="mt-3">
              Egypt One does not issue, approve or confirm any entry permission. Requirements depend on nationality, purpose,
              route and current policy, and they change. The visa and entry integration with the competent authority is not
              connected in this prototype, so nothing on this page is an official answer.
            </p>
            <Link href={l('/visa')} className="mt-3 inline-flex text-[12.5px] text-gold-300 hover:underline">Open the visa and entry module →</Link>
          </InfoCard>

          <InfoCard title="Diplomatic missions" tone="warn">
            <p>{c.missionNote}</p>
            <p className="mt-3 text-[12px] text-ink-faint">
              Mission addresses, contact details and consular hours must come from the official Ministry of Foreign Affairs
              directory. That exchange is a planned integration and is not connected.
            </p>
          </InfoCard>

          <InfoCard title="Suggested routes">
            <p className="mb-3">A starting shape for a first visit from {c.name}. Refine it in the trip builder with your dates, budget and interests.</p>
            <StepList steps={c.suggestedRoutes.map((r, i) => ({
              title: `Stop ${i + 1}: ${r}`,
              body: 'Editorial suggestion based on typical routing, not a booked or priced product.',
            }))} />
          </InfoCard>

          <InfoCard title="Air connectivity">
            {c.directFlights.length ? (
              <>
                <ChipList items={c.directFlights} tone="gold" />
                <p className="mt-3 text-[12px] text-ink-faint">
                  Illustrative gateway airports, not a schedule. No airline distribution adapter is connected, so no route,
                  fare or frequency here is live.
                </p>
              </>
            ) : (
              <p>No direct connectivity is recorded for {c.name} in this demonstration dataset. Most journeys route through a regional hub.</p>
            )}
          </InfoCard>

          <Boundary points={[
            'Embassy, visa and entry information on this page is demonstration content pending an official integration.',
            'Flight connectivity is illustrative and is not a timetable.',
            'Currency and language are reference fields, not travel advice.',
            'Campaigns, packages and cooperation programmes activate only under signed agreements.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Country reference">
            <FactList rows={[
              ['Region', c.region],
              ['ISO code', c.iso2],
              ['Currency', c.currency],
              ['Primary language', c.language],
              ['Mission listed in demo set', c.hasEgyptianMission ? 'Yes' : 'No'],
            ]} />
          </InfoCard>
          <InfoCard title={`Other gateways in ${c.region}`}>
            <div className="flex flex-wrap gap-1.5">
              {sameRegion.map((o) => (
                <Link key={o.slug} href={l(`/egypt-195/${o.slug}`)} className="rounded-full border border-white/10 px-2.5 py-1 text-[11.5px] text-ink-mid hover:border-gold-600/40 hover:text-gold-300">
                  {o.name}
                </Link>
              ))}
            </div>
          </InfoCard>
          <SourceNote status={c.sourceStatus} owner={c.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/egypt-195', label: 'All 195 gateways', body: 'Every country.' },
          { href: '/governorates', label: 'Governorates', body: 'Where to go.' },
          { href: '/safety', label: 'Safety centre', body: 'Support while here.' },
          { href: '/medical-tourism', label: 'Medical tourism', body: 'Health journeys.' },
        ]} />
      </div>
    </Page>
  );
}
