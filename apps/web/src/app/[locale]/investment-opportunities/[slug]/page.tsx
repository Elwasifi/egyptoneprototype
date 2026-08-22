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
  return LOCALES.flatMap((locale) => db.investment.all().map((o) => ({ locale, slug: o.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const o = db.investment.bySlug(slug);
  return o ? { title: o.name, description: o.summary } : { title: 'Opportunity not found' };
}

export default async function OpportunityDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const o = db.investment.bySlug(slug);
  if (!o) notFound();
  const l = (p: string) => L(locale as Locale, p);
  const gov = db.governorates.bySlug(o.governorateSlug);
  const peers = db.investment.bySector(o.sector).filter((x) => x.slug !== o.slug).slice(0, 5);
  const properties = db.properties.all().filter((p) => p.governorateSlug === o.governorateSlug).slice(0, 4);

  return (
    <Page wide>
      <Breadcrumbs items={[
        { label: 'Home', href: l('/') }, { label: 'Invest', href: l('/invest') },
        { label: 'Opportunities', href: l('/investment-opportunities') }, { label: o.name },
      ]} />
      <ModuleHero
        eyebrow={`${o.sector} · ${gov?.name ?? ''}`}
        title={o.name}
        lead={o.description ?? o.summary ?? ''}
        seed={o.slug}
        subject="modern"
        badges={<><Badge tone="nile">{o.stage.replace(/_/g, ' ')}</Badge><Badge tone="gold">USD {(o.investmentRangeUsd[0] / 1e6).toFixed(0)}–{(o.investmentRangeUsd[1] / 1e6).toFixed(0)}M</Badge><SourceBadge status={o.sourceStatus} owner={o.sourceOwner} /></>}
        actions={[{ href: l('/invest#contact'), label: 'Request a meeting', primary: true }, { href: l('/business-setup'), label: 'Business setup navigator' }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="Who decides" tone="warn">
            <p>
              The competent entity for this opportunity is <strong className="text-ink-hi">{o.competentEntity}</strong>.
              Land allocation, licensing, incentives and approvals are theirs to grant. Egypt One coordinates, documents and
              routes enquiries — it does not allocate, approve or guarantee anything.
            </p>
          </InfoCard>

          <InfoCard title="Restrictions and conditions">
            <ul className="grid gap-2">
              {o.restrictions.map((r, i) => (
                <li key={i} className="flex gap-2.5"><span className="mt-[3px] text-warn" aria-hidden="true">◆</span><span>{r}</span></li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Demand signals" badge={<SourceBadge status="SIMULATED" size="sm" />}>
            <ul className="grid gap-2">
              {o.demandSignals.map((s, i) => (
                <li key={i} className="flex gap-2.5"><span className="mt-[3px] text-turquoise" aria-hidden="true">◆</span><span>{s}</span></li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] text-ink-faint">
              These indicators come from the platform’s synthetic demonstration dataset. They are not official statistics and
              must not be used as the basis for a decision.
            </p>
          </InfoCard>

          <InfoCard title="Risks" tone="danger">
            <ul className="grid gap-2">
              {o.risks.map((r, i) => (
                <li key={i} className="flex gap-2.5"><span className="mt-[3px] text-danger" aria-hidden="true">◆</span><span>{r}</span></li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Supporting documents">
            <ul className="grid gap-2">
              {o.documents.map((d, i) => (
                <li key={i} className="flex items-center justify-between gap-3 border-b border-white/6 pb-2 last:border-0">
                  <span className="text-[13px] text-ink-mid">{d.title}</span>
                  <SourceBadge status={d.sourceStatus as never} size="sm" />
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] text-ink-faint">
              Documents marked as a planned integration are not available. The official pack is obtained from the competent entity.
            </p>
          </InfoCard>

          <Boundary points={[
            'This is not an offer, an allocation, an approval or a guaranteed return.',
            'Egypt One does not provide regulated financial or legal advice. Commission an independent study and take Egyptian legal advice.',
            'Investment lead handling is contractual; no fee is charged to an investor for making an enquiry in this prototype.',
            'Every figure on this page is demonstration or synthetic data.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Opportunity record">
            <FactList rows={[
              ['Sector', o.sector],
              ['Stage', o.stage.replace(/_/g, ' ').toLowerCase()],
              ['Governorate', gov ? <Link href={l(`/governorates/${gov.slug}`)} className="text-gold-300 hover:underline">{gov.name}</Link> : o.governorateSlug],
              ['Ticket size', `USD ${o.investmentRangeUsd[0].toLocaleString()} – ${o.investmentRangeUsd[1].toLocaleString()}`],
              ['Land requirement', o.landRequirementHa ? `${o.landRequirementHa} ha` : 'Not specified'],
              ['Competent entity', o.competentEntity],
            ]} />
          </InfoCard>

          {properties.length > 0 && (
            <InfoCard title="Property in this governorate">
              <ul className="grid gap-1.5">
                {properties.map((p) => (
                  <li key={p.slug} className="text-[12.5px] text-ink-low">{p.name}</li>
                ))}
              </ul>
              <Link href={l('/real-estate')} className="mt-3 inline-flex text-[12px] text-gold-300 hover:underline">Real estate module →</Link>
            </InfoCard>
          )}

          {peers.length > 0 && (
            <InfoCard title={`Other ${o.sector} opportunities`}>
              <ul className="grid gap-1.5">
                {peers.map((p) => (
                  <li key={p.slug}><Link href={l(`/investment-opportunities/${p.slug}`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{p.name}</Link></li>
                ))}
              </ul>
            </InfoCard>
          )}
          <SourceNote status={o.sourceStatus} owner={o.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/investment-opportunities', label: 'Opportunity registry', body: 'All sectors.' },
          { href: '/invest', label: 'Investor portal', body: 'Analysis and filters.' },
          { href: '/business-setup', label: 'Business setup', body: 'Establishing the entity.' },
          { href: '/government/investment', label: 'Government view', body: 'Lead pipeline.' },
        ]} />
      </div>
    </Page>
  );
}
