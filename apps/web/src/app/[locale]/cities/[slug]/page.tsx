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
  const slugs = new Set<string>();
  for (const g of db.governorates.all()) for (const c of g.cities) slugs.add(`${g.slug}-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
  return LOCALES.flatMap((locale) => [...slugs].map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug.split('-').slice(1).join(' ').replace(/\b\w/g, (c) => c.toUpperCase()) };
}

/** Cities template. One route serves every city recorded against a governorate. */
export default async function CityDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const l = (p: string) => L(locale as Locale, p);
  const gov = db.governorates.all().find((g) => slug.startsWith(g.slug + '-'));
  if (!gov) notFound();
  const raw = slug.slice(gov.slug.length + 1);
  const name = gov.cities.find((c) => c.toLowerCase().replace(/[^a-z0-9]+/g, '-') === raw);
  if (!name) notFound();

  const heritage = db.heritage.byGovernorate(gov.slug).slice(0, 6);
  const providers = db.providers.byGovernorate(gov.slug);
  const events = db.events.byGovernorate(gov.slug);

  return (
    <Page wide>
      <Breadcrumbs items={[
        { label: 'Home', href: l('/') }, { label: 'Governorates', href: l('/governorates') },
        { label: gov.name, href: l(`/governorates/${gov.slug}`) }, { label: name },
      ]} />
      <ModuleHero
        eyebrow={`${gov.name} · Citie`}
        title={name}
        lead={`${name} is recorded in the Egypt One geography model under ${gov.name} governorate, in the ${gov.region} region. Heritage, providers, events and investment for this area are indexed against the governorate.`}
        seed={slug}
        subject={gov.hasCoast ? 'sea' : gov.hasNile ? 'nile' : 'desert'}
        badges={<><Badge tone="gold">{gov.region}</Badge><SourceBadge status={gov.sourceStatus} owner={gov.sourceOwner} /></>}
        actions={[{ href: l(`/governorates/${gov.slug}`), label: `All of ${gov.name}`, primary: true }, { href: l('/trip-builder'), label: 'Plan a trip' }]}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="What is recorded here">
            <p>
              The prototype models geography as governorate → city → village → district. Detailed local records for {name} are
              added through the CMS as they are verified; until then this page inherits from {gov.name} rather than inventing
              local content.
            </p>
          </InfoCard>
          {heritage.length > 0 && (
            <InfoCard title={`Heritage across ${gov.name}`}>
              <ul className="grid gap-1.5">
                {heritage.map((h) => (
                  <li key={h.slug}><Link href={l(`/heritage/${h.slug}`)} className="text-[12.5px] text-ink-low hover:text-gold-300">{h.name}</Link></li>
                ))}
              </ul>
            </InfoCard>
          )}
          {events.length > 0 && (
            <InfoCard title="Events in this governorate">
              <ul className="grid gap-1.5">
                {events.map((e) => <li key={e.slug} className="text-[12.5px] text-ink-low">{e.name} · {e.startDate}</li>)}
              </ul>
            </InfoCard>
          )}
          <Boundary points={[
            'Local-level content is inherited from the governorate record rather than fabricated.',
            'Administrative boundaries follow the official governorate structure.',
          ]} />
        </div>
        <aside className="grid content-start gap-4">
          <InfoCard title="Governorate context">
            <FactList rows={[
              ['Governorate', <Link href={l(`/governorates/${gov.slug}`)} className="text-gold-300 hover:underline">{gov.name}</Link>],
              ['Region', gov.region],
              ['Capital', gov.capital],
              ['Providers recorded', String(providers.length)],
            ]} />
          </InfoCard>
          <InfoCard title="Other places here">
            <div className="flex flex-wrap gap-1.5">
              {gov.cities.filter((c) => c !== name).map((c) => (
                <Link key={c} href={l(`/cities/${gov.slug}-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)} className="rounded-full border border-white/10 px-2.5 py-1 text-[11.5px] text-ink-mid hover:border-gold-600/40 hover:text-gold-300">{c}</Link>
              ))}
            </div>
          </InfoCard>
          <SourceNote status={gov.sourceStatus} owner={gov.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: `/governorates/${gov.slug}`, label: gov.name, body: 'The governorate page.' },
          { href: '/governorates', label: 'All governorates', body: 'Browse Egypt.' },
          { href: '/rural-egypt', label: 'Rural Egypt', body: 'Village life and farms.' },
          { href: '/map', label: 'Map', body: 'See it in place.' },
        ]} />
      </div>
    </Page>
  );
}
