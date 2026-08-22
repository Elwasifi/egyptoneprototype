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
  return LOCALES.flatMap((locale) => db.providers.byType('GUIDE').map((g) => ({ locale, slug: g.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = db.providers.bySlug(slug);
  return g ? { title: g.name, description: g.summary } : { title: 'Guide not found' };
}

export default async function GuideDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const g = db.providers.bySlug(slug);
  if (!g || g.type !== 'GUIDE') notFound();
  const l = (p: string) => L(locale as Locale, p);
  const gov = db.governorates.bySlug(g.governorateSlug);
  const peers = db.providers.byGovernorate(g.governorateSlug).filter((p) => p.type === 'GUIDE' && p.slug !== g.slug).slice(0, 5);
  const sites = db.heritage.byGovernorate(g.governorateSlug).filter((h) => h.access === 'OPEN').slice(0, 6);
  const verified = g.verification === 'VERIFIED';

  return (
    <Page wide>
      <Breadcrumbs items={[{ label: 'Home', href: l('/') }, { label: 'Guides', href: l('/guides') }, { label: g.name }]} />
      <ModuleHero
        eyebrow={`${gov?.name ?? ''} · Guide`}
        title={g.name}
        lead={`${(g.specialties ?? []).join(', ')}${g.specialties?.length ? '. ' : ''}Working in ${(g.languages ?? []).join(', ')}.`}
        seed={g.slug}
        subject="city"
        badges={<>
          <Badge tone={verified ? 'ok' : 'warn'}>{verified ? 'Verified on platform' : 'Verification in review'}</Badge>
          {g.rating && <Badge tone="gold">★ {g.rating} · {g.reviewCount} reviews</Badge>}
          <SourceBadge status={g.sourceStatus} owner={g.sourceOwner} />
        </>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-6">
          <InfoCard title="What verification means here" tone={verified ? 'neutral' : 'warn'}>
            <p>
              {verified
                ? 'Egypt One has checked the documents this guide submitted during onboarding. That is a platform check on submitted evidence.'
                : 'This guide’s documents are still in review. Nothing about their credentials is being asserted.'}
            </p>
            <p className="mt-3">
              It is <strong className="text-ink-hi">not</strong> a government tourist-guide licence. Licensing is issued by the
              competent authority, and this platform never describes anyone as officially licensed without a verification record
              tied to that authority.
            </p>
          </InfoCard>

          <InfoCard title="Languages and specialties">
            <div className="grid gap-4">
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">Languages</div>
                <ChipList items={g.languages ?? []} tone="gold" />
              </div>
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">Specialties</div>
                <ChipList items={g.specialties ?? []} />
              </div>
              <div>
                <div className="mb-2 text-[11px] uppercase tracking-[0.14em] text-ink-faint">Accessibility support</div>
                <ChipList items={g.accessibility ?? []} />
              </div>
            </div>
          </InfoCard>

          {sites.length > 0 && (
            <section>
              <SectionHeader eyebrow={gov?.name ?? ''} title="Sites in this governorate" href={l('/heritage')} hrefLabel="Registry" />
              <ul className="grid gap-2 sm:grid-cols-2">
                {sites.map((s) => (
                  <li key={s.slug}>
                    <Link href={l(`/heritage/${s.slug}`)} className="block rounded-lg border border-white/7 bg-white/3 px-3 py-2.5 text-[12.5px] text-ink-mid hover:border-gold-600/35">{s.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <Boundary points={[
            'Availability shown is indicative. Confirmed booking requires a connected provider adapter, and none is live in this prototype.',
            'Personal contact details are never exposed by the platform or the AI Concierge.',
            'Ratings and review counts here are demonstration values.',
            'Payment for a booking would run through a licensed payment service provider, with a contractual platform share — never a hidden one.',
          ]} />
        </div>

        <aside className="grid content-start gap-4">
          <InfoCard title="Booking">
            <FactList rows={[
              ['Base governorate', gov ? <Link href={l(`/governorates/${gov.slug}`)} className="text-gold-300 hover:underline">{gov.name}</Link> : g.governorateSlug],
              ['Indicative rate', g.priceFrom ? `from ${g.currency} ${g.priceFrom} / day` : '—'],
              ['Availability', (g.availability ?? []).join(', ') || '—'],
              ['Verification', verified ? 'Verified on platform' : 'In review'],
            ]} />
            <div className="mt-4 rounded-lg border border-warn/30 bg-warn/6 px-3 py-2.5 text-[11.5px] text-ink-mid">
              No booking adapter is connected, so a request here would be recorded as a draft only.
            </div>
            <Link href={l('/trip-builder')} className="mt-3 inline-flex w-full justify-center rounded-lg bg-gradient-to-b from-gold-400 to-gold-600 px-4 py-2.5 text-[13px] font-semibold text-[#0a1017]">
              Add to a trip
            </Link>
          </InfoCard>

          {peers.length > 0 && (
            <InfoCard title="Other guides here">
              <ul className="grid gap-1.5">
                {peers.map((p) => (
                  <li key={p.slug}>
                    <Link href={l(`/guides/${p.slug}`)} className="text-[12.5px] text-ink-low hover:text-gold-300">
                      {p.name} <span className="text-ink-faint">· {(p.languages ?? []).slice(0, 2).join(', ')}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </InfoCard>
          )}
          <SourceNote status={g.sourceStatus} owner={g.sourceOwner} />
        </aside>
      </div>

      <div className="mt-10">
        <RelatedLinks locale={locale as Locale} links={[
          { href: '/guides', label: 'All guides', body: 'Filter by language.' },
          { href: '/activities', label: 'Activities', body: 'Guided experiences.' },
          { href: '/provider', label: 'Provider portal', body: 'Register as a guide.' },
          { href: '/reviews', label: 'Reviews', body: 'Traveller feedback.' },
        ]} />
      </div>
    </Page>
  );
}
