#!/usr/bin/env node
/**
 * Generates the five authenticated portal experiences (40 routes total):
 * account (6), provider (8), partner (5), government (9), admin (12).
 *
 * Each route is a server component wrapped in <PortalShell>, using a
 * `body` field of raw JSX (with `db`, `metrics`, `L`, `locale` in scope) so
 * every dashboard renders real data from the shared packages rather than
 * hand-typed numbers.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'apps/web/src/app/[locale]');

function write(route, content) {
  const dir = path.join(ROOT, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
}

function page({ portal, navImport, active, accent, title, subtitle, roleNote, extraImports = '', extraSetup = '', body }) {
  return `import Link from 'next/link';
import type { Metadata } from 'next';
import { db } from '@egypt-one/database';
import { RBAC_MATRIX, recentAudit } from '@egypt-one/security';
import { ADAPTER_LIST } from '@egypt-one/integrations';
import { REVENUE_RULES, DEFAULT_BASE_COMMISSION_PCT } from '@egypt-one/config';
import { AGENTS } from '@egypt-one/agents';
import { MCP_SERVERS, MCP_TOOLS } from '@egypt-one/mcp';
import type { Locale } from '@egypt-one/i18n';
import { PortalShell, Badge, SourceBadge, Stat, BarStrip, Donut, Trend, DataTable, EmptyState } from '@egypt-one/ui';
import { InfoCard } from '@/components/Module';
import { ${navImport} } from '@/lib/nav';
import { href as L } from '@/lib/locale';
${extraImports}

export const metadata: Metadata = { title: ${JSON.stringify(title)}, description: ${JSON.stringify(subtitle)} };

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const metrics = db.metrics() as any;
${extraSetup}
  return (
    <PortalShell portal={${JSON.stringify(portal)}} title={${JSON.stringify(title)}} subtitle={${JSON.stringify(subtitle)}} nav={${navImport}} active={${JSON.stringify(active)}} accent={${JSON.stringify(accent)}} roleNote={${JSON.stringify(roleNote ?? '')}}>
      <div className="grid gap-6">
${body}
      </div>
    </PortalShell>
  );
}
`;
}

const boundary = (points) => `        <InfoCard title="What this console can and cannot do" tone="warn">
          <ul className="grid gap-1.5 text-[12.5px] text-ink-mid">
            ${points.map((p) => `<li>· ${p}</li>`).join('\n            ')}
          </ul>
        </InfoCard>`;

/* --------------------------------------------------------------------- */
/* ACCOUNT (6)                                                            */
/* --------------------------------------------------------------------- */

write('account', page({
  portal: 'Account', navImport: 'ACCOUNT_NAV', active: '/account', accent: 'gold',
  title: 'Your Egypt One account',
  subtitle: 'A single identity across all seven experiences — trips, bookings, your pass, wallet and consent, all in one place.',
  roleNote: 'Signed in as a demo traveller.',
  body: `        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Upcoming trips" value="1" />
          <Stat label="Saved places" value="12" />
          <Stat label="Loyalty points" value="0" />
          <Stat label="Consents granted" value="0 of 4" />
        </div>
        <InfoCard title="Your ten-day demonstration itinerary">
          <p>The Smart Trip Builder has drafted an example journey so you can see the shape of a real plan — nothing here is booked or paid for.</p>
          <Link href={L(locale as Locale, '/account/trips')} className="mt-3 inline-block text-[12.5px] font-medium text-gold-300 hover:underline">Open my trips →</Link>
        </InfoCard>
        <div className="grid gap-4 md:grid-cols-3">
          <InfoCard title="Egypt One Pass"><p>A single credential across guides, sites and providers. Not yet linked to any physical access control.</p></InfoCard>
          <InfoCard title="Wallet & rewards"><p>Points are illustrative. No currency value is stored or transferable in this prototype.</p></InfoCard>
          <InfoCard title="Privacy & consent"><p>Location, health and identity data all require an explicit consent grant before any agent can use them.</p></InfoCard>
        </div>`,
}));

write('account/trips', page({
  portal: 'Account', navImport: 'ACCOUNT_NAV', active: '/account/trips', accent: 'gold',
  title: 'My trips', subtitle: 'Draft itineraries built with the Smart Trip Builder or the AI Concierge.',
  extraImports: `import { ItineraryPreview } from '@/components/ItineraryPreview';`,
  body: `        <ItineraryPreview locale={locale as Locale} />
        <InfoCard title="Nothing else drafted yet" tone="neutral">
          <p>Start a new plan with the <Link href={L(locale as Locale, '/trip-builder')} className="text-gold-300 hover:underline">Smart Trip Builder</Link> or ask the AI Concierge.</p>
        </InfoCard>`,
}));

write('account/bookings', page({
  portal: 'Account', navImport: 'ACCOUNT_NAV', active: '/account/bookings', accent: 'gold',
  title: 'Bookings', subtitle: 'Every confirmed booking across accommodation, guides, transport and activities.',
  body: `        <EmptyState title="No bookings yet" body="Booking connects to accommodation, guide and transport providers once an integration is live — none is connected in this prototype." />`,
}));

write('account/pass', page({
  portal: 'Account', navImport: 'ACCOUNT_NAV', active: '/account/pass', accent: 'gold',
  title: 'Egypt One Pass', subtitle: 'A unified identity credential for verified access across the platform.',
  body: `        <InfoCard title="Not yet a physical or ticketing credential" tone="warn">
          <p>The Pass authenticates you to Egypt One. It does not currently grant entry to any heritage site, museum or transport gate — those remain controlled by their own operators.</p>
        </InfoCard>
        <div className="surface-gold p-6">
          <div className="text-[11px] uppercase tracking-[0.16em] text-gold-600">Demo credential</div>
          <div className="mt-2 text-[20px] font-semibold text-gold-100">Egypt One Pass — Prototype</div>
          <div className="mt-1 text-[12.5px] text-ink-low">Holder: Demo Traveller · Tier: Explorer</div>
        </div>`,
}));

write('account/wallet', page({
  portal: 'Account', navImport: 'ACCOUNT_NAV', active: '/account/wallet', accent: 'gold',
  title: 'Wallet & rewards', subtitle: 'Illustrative loyalty points. No stored monetary value.',
  body: `        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Points balance" value="0" />
          <Stat label="Tier" value="Explorer" />
          <Stat label="Lifetime spend tracked" value="$0" />
        </div>
        <InfoCard title="No real payment instrument is stored here" tone="warn">
          <p>Payments are handled by a PSP-abstracted adapter (currently sandboxed). Egypt One does not hold funds or act as a payment processor.</p>
        </InfoCard>`,
}));

write('account/consent', page({
  portal: 'Account', navImport: 'ACCOUNT_NAV', active: '/account/consent', accent: 'gold',
  title: 'Privacy & consent centre', subtitle: 'Control exactly what each AI agent and provider is allowed to see.',
  body: `        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { key: 'LOCATION', label: 'Location', note: 'Off by default. Trip Mode and Emergency Mode are separate, explicit grants.' },
            { key: 'HEALTH_DATA', label: 'Health data', note: 'Required before the Medical Tourism agent can see any medical context.' },
            { key: 'GENETIC_DATA', label: 'Origin / ancestry signals', note: 'Never used for diagnosis. Off by default.' },
            { key: 'MARKETING', label: 'Marketing communications', note: 'Opt-in only.' },
          ].map((c) => (
            <div key={c.key} className="surface flex items-center justify-between gap-3 p-4">
              <div>
                <div className="text-[13.5px] font-medium text-ink-hi">{c.label}</div>
                <div className="mt-1 text-[11.5px] text-ink-faint">{c.note}</div>
              </div>
              <Badge tone="neutral">Off</Badge>
            </div>
          ))}
        </div>
        ${boundary([
          'Location Mode defaults to OFF; Trip Mode and Emergency Mode are separate, revocable grants.',
          'Health and genetic-adjacent signals are RESTRICTED data classes — agents cannot read them without an explicit, logged consent.',
          'Every consent change is written to the audit log.',
        ])}`,
}));

/* --------------------------------------------------------------------- */
/* PROVIDER (8)                                                           */
/* --------------------------------------------------------------------- */

write('provider', page({
  portal: 'Provider', navImport: 'PROVIDER_NAV', active: '/provider', accent: 'nile',
  title: 'Provider dashboard', subtitle: 'Business/service provider overview — bookings, compliance and payouts in one place.',
  roleNote: 'Signed in as a demo provider (Nile Horizon Tours).',
  extraSetup: `  const providers = db.providers.all();
  const verified = providers.filter((p) => p.verification === 'VERIFIED').length;`,
  body: `        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Active listings" value="1" />
          <Stat label="Bookings this month" value="0" />
          <Stat label="Verified providers platform-wide" value={String(verified)} />
          <Stat label="Total providers in registry" value={String(providers.length)} />
        </div>
        <InfoCard title="Verification status" tone="warn">
          <p>“Verified” means Egypt One has checked the documents you submitted. It is not a government licence and must not be represented as one to travellers.</p>
        </InfoCard>`,
}));

write('provider/profile', page({
  portal: 'Provider', navImport: 'PROVIDER_NAV', active: '/provider/profile', accent: 'nile',
  title: 'Business profile', subtitle: 'What travellers and the AI Concierge see about your business.',
  body: `        <InfoCard title="Profile completeness">
          <div className="mt-2"><Trend points={[40, 55, 62, 70, 78, 82]} /></div>
          <p className="mt-2 text-[12px] text-ink-faint">Illustrative demo curve — not derived from a real profile yet.</p>
        </InfoCard>
        <InfoCard title="Governorates served"><p>Set once you connect a real listing. Demo profile: Cairo, Giza.</p></InfoCard>`,
}));

write('provider/services', page({
  portal: 'Provider', navImport: 'PROVIDER_NAV', active: '/provider/services', accent: 'nile',
  title: 'Services & inventory', subtitle: 'What you offer and where it appears across the platform.',
  body: `        <EmptyState title="No services published yet" body="Add a service to appear in the relevant listing (hotels, guides, activities, transport)." />`,
}));

write('provider/availability', page({
  portal: 'Provider', navImport: 'PROVIDER_NAV', active: '/provider/availability', accent: 'nile',
  title: 'Availability & pricing', subtitle: 'Calendar and rate management for your published services.',
  body: `        <InfoCard title="No calendar connected" tone="warn"><p>Availability sync requires a live booking-adapter connection. All adapters are currently PLANNED or SANDBOX — see the Partner integrations page.</p></InfoCard>`,
}));

write('provider/bookings', page({
  portal: 'Provider', navImport: 'PROVIDER_NAV', active: '/provider/bookings', accent: 'nile',
  title: 'Bookings', subtitle: 'Incoming reservations across your listed services.',
  body: `        <EmptyState title="No bookings yet" body="Bookings will appear here once a service is published and an adapter is connected." />`,
}));

write('provider/analytics', page({
  portal: 'Provider', navImport: 'PROVIDER_NAV', active: '/provider/analytics', accent: 'nile',
  title: 'Analytics', subtitle: 'Demand signals relevant to your governorate and category — demonstration data only.',
  extraSetup: `  const share = (metrics.governorateShare as { governorate: string; visitors: number }[]).slice(0, 6);`,
  body: `        <InfoCard title="Visitor share by governorate (simulated)">
          <div className="mt-3"><BarStrip rows={share.map((s) => ({ label: s.governorate, value: s.visitors }))} /></div>
        </InfoCard>
        <SourceBadge status="SIMULATED" />`,
}));

write('provider/payouts', page({
  portal: 'Provider', navImport: 'PROVIDER_NAV', active: '/provider/payouts', accent: 'nile',
  title: 'Payouts & settlement', subtitle: 'How commission and settlement work, and what is configurable.',
  extraSetup: `  const rule = REVENUE_RULES.find((r) => r.serviceClass === 'GUIDE')!;`,
  body: `        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Base commission assumption" value={\`\${DEFAULT_BASE_COMMISSION_PCT}%\`} />
          <Stat label="Your service-class rate" value={rule.model.kind === 'PERCENTAGE' ? \`\${rule.model.pct}%\` : rule.model.kind} />
          <Stat label="Outstanding settlement (demo)" value={\`$\${(metrics.financeDemo.outstandingSettlementUsd / 1_000_000).toFixed(2)}M\`} />
        </div>
        <InfoCard title="Rate depends on your service class, not a single global number" tone="warn">
          <p>{rule.note} The 5% figure quoted in the business plan is a base negotiation assumption, never a hardcoded platform-wide rate.</p>
        </InfoCard>`,
}));

write('provider/compliance', page({
  portal: 'Provider', navImport: 'PROVIDER_NAV', active: '/provider/compliance', accent: 'nile',
  title: 'Compliance & documents', subtitle: 'Licences, insurance and identity documents backing your verification status.',
  body: `        <DataTable columns={['Document', 'Status']} rows={[['Business registration', 'Not submitted'], ['Tourism licence', 'Not submitted']]} />
        ${boundary(['Egypt One checks submitted documents; it does not issue or verify licences with any government system directly.'])}`,
}));

/* --------------------------------------------------------------------- */
/* PARTNER (5)                                                            */
/* --------------------------------------------------------------------- */

write('partner', page({
  portal: 'Strategic Partner', navImport: 'PARTNER_NAV', active: '/partner', accent: 'royal',
  title: 'Partner overview', subtitle: 'Strategic and technology partners integrating with Egypt One through declared adapters.',
  extraSetup: `  const live = ADAPTER_LIST.filter((a) => a.state === 'LIVE').length;`,
  body: `        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Declared adapter categories" value={String(ADAPTER_LIST.length)} />
          <Stat label="Live integrations" value={String(live)} />
          <Stat label="Sandbox / planned" value={String(ADAPTER_LIST.length - live)} />
        </div>
        <InfoCard title="No integration is presented as live unless it is" tone="warn"><p>Every adapter below shows its true state. A PLANNED or SANDBOX adapter never appears to travellers as a working booking path.</p></InfoCard>`,
}));

write('partner/integrations', page({
  portal: 'Strategic Partner', navImport: 'PARTNER_NAV', active: '/partner/integrations', accent: 'royal',
  title: 'Integrations', subtitle: 'Every declared adapter category and its current connection state.',
  body: `        <DataTable
          columns={['Category', 'Adapter', 'State']}
          rows={ADAPTER_LIST.map((a) => [a.category, a.displayName, <Badge key={a.key} tone={a.state === 'LIVE' ? 'ok' : a.state === 'SANDBOX' ? 'info' : 'neutral'}>{a.state}</Badge>])}
        />`,
}));

write('partner/api', page({
  portal: 'Strategic Partner', navImport: 'PARTNER_NAV', active: '/partner/api', accent: 'royal',
  title: 'API & credentials', subtitle: 'MCP tool families exposed to approved partner integrations.',
  body: `        <div className="grid gap-3 md:grid-cols-2">
          {MCP_SERVERS.map((s) => (
            <InfoCard key={s.key} title={s.name} tone="neutral">
              <p>{s.description}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {MCP_TOOLS.filter((t) => t.server === s.key).slice(0, 4).map((t) => (
                  <span key={t.key} className="rounded border border-white/10 bg-white/4 px-1.5 py-0.5 font-mono text-[10px] text-ink-low">{t.name}</span>
                ))}
              </div>
            </InfoCard>
          ))}
        </div>
        ${boundary(['No credential shown here is a live production key — this prototype has no production API gateway deployed.'])}`,
}));

write('partner/transactions', page({
  portal: 'Strategic Partner', navImport: 'PARTNER_NAV', active: '/partner/transactions', accent: 'royal',
  title: 'Transactions', subtitle: 'Settlement records flowing through your integration.',
  body: `        <EmptyState title="No transactions yet" body="No payment adapter is live." />`,
}));

write('partner/analytics', page({
  portal: 'Strategic Partner', navImport: 'PARTNER_NAV', active: '/partner/analytics', accent: 'royal',
  title: 'Analytics', subtitle: 'Demonstration traffic and conversion signals for your integration surface.',
  body: `        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Referral clicks (demo)" value="0" />
          <Stat label="Conversions (demo)" value="0" />
          <Stat label="Attributed GMV (demo)" value="$0" />
        </div>`,
}));

/* --------------------------------------------------------------------- */
/* GOVERNMENT (9)                                                         */
/* --------------------------------------------------------------------- */

write('government', page({
  portal: 'Government', navImport: 'GOVERNMENT_NAV', active: '/government', accent: 'emerald',
  title: 'National overview', subtitle: 'Aggregated, de-identified tourism signals for the competent authorities — never a substitute for official statistics.',
  roleNote: 'Signed in as a demo government analyst.',
  extraSetup: `  const h = metrics.headline as Record<string, number>;`,
  body: `        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Visitors this month (simulated)" value={h.visitorsThisMonth.toLocaleString()} />
          <Stat label="Active providers" value={String(h.activeProviders)} />
          <Stat label="Verified guides" value={String(h.verifiedGuides)} />
          <Stat label="Open complaints" value={String(h.openComplaints)} />
        </div>
        <InfoCard title="This is a coordination layer, not an official statistics office" tone="warn">
          <p>Every figure here is SIMULATED demonstration data. Egypt One never publishes or implies official government statistics.</p>
        </InfoCard>
        <SourceBadge status="SIMULATED" />`,
}));

write('government/tourism-intelligence', page({
  portal: 'Government', navImport: 'GOVERNMENT_NAV', active: '/government/tourism-intelligence', accent: 'emerald',
  title: 'Tourism intelligence', subtitle: 'Demand, origin mix and sector signals — synthetic data standing in for a future analytics pipeline.',
  extraSetup: `  const top = metrics.topCountries as { country: string; sharePct: number }[];
  const interests = metrics.interests as { name: string; sharePct: number }[];
  const palette = ['#D8A84E', '#2E7D9A', '#7c9c6b', '#b6a8e0', '#c98a4f', '#7fb3c9'];`,
  body: `        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard title="Top countries of origin (simulated)"><div className="mt-2"><BarStrip rows={top.map((t) => ({ label: t.country, value: t.sharePct }))} unit="%" /></div></InfoCard>
          <InfoCard title="Traveller interests (simulated)"><div className="mt-2"><Donut slices={interests.map((i, idx) => ({ label: i.name, value: i.sharePct, colour: palette[idx % palette.length] }))} /></div></InfoCard>
        </div>
        <InfoCard title="Monthly visitor trend (simulated)"><div className="mt-2"><Trend points={(metrics.monthlyVisitors as { visitors: number }[]).map((m) => m.visitors)} /></div></InfoCard>`,
}));

write('government/national-map', page({
  portal: 'Government', navImport: 'GOVERNMENT_NAV', active: '/government/national-map', accent: 'emerald',
  title: 'National map', subtitle: 'Governorate, heritage, provider, event and investment layers on one schematic map.',
  extraImports: `import { EgyptMap } from '@/components/EgyptMap';`,
  body: `        <EgyptMap locale={locale as Locale} />`,
}));

write('government/providers', page({
  portal: 'Government', navImport: 'GOVERNMENT_NAV', active: '/government/providers', accent: 'emerald',
  title: 'Provider coverage', subtitle: 'Verified-provider density by governorate and category, and where gaps are indicated.',
  extraSetup: `  const gaps = metrics.providerGaps as { governorate: string; gap: string }[];`,
  body: `        <InfoCard title="Coverage gaps flagged by the demo model">
          <ul className="grid gap-1.5 text-[12.5px] text-ink-mid">{gaps.map((g, i) => <li key={i}>· <span className="font-medium text-ink-hi">{g.governorate}</span> — {g.gap}</li>)}</ul>
        </InfoCard>
        <SourceBadge status="SIMULATED" />`,
}));

write('government/heritage', page({
  portal: 'Government', navImport: 'GOVERNMENT_NAV', active: '/government/heritage', accent: 'emerald',
  title: 'Heritage registry', subtitle: 'Access classification and restoration state for every recorded site — a coordination view, not the authoritative registry.',
  extraSetup: `  const sites = db.heritage.all();
  const byAccess = sites.reduce((acc: Record<string, number>, s) => { acc[s.access] = (acc[s.access] ?? 0) + 1; return acc; }, {});`,
  body: `        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(byAccess).map(([k, v]) => <Stat key={k} label={k.replace(/_/g, ' ')} value={String(v)} />)}
        </div>
        ${boundary(['Classification shown here mirrors what the relevant authority has communicated to the platform; it is not a live feed from any ministry system.'])}`,
}));

write('government/restoration', page({
  portal: 'Government', navImport: 'GOVERNMENT_NAV', active: '/government/restoration', accent: 'emerald',
  title: 'Restoration pipeline', subtitle: 'Sites marked under restoration or proposed for restoration.',
  extraSetup: `  const items = db.heritage.restoration();`,
  body: `        {items.length ? (
          <DataTable columns={['Site', 'Governorate', 'Status']} rows={items.map((i) => [i.name, i.governorateSlug, i.restorationStatus ?? '—'])} />
        ) : (
          <EmptyState title="No sites currently flagged" />
        )}`,
}));

write('government/emergencies', page({
  portal: 'Government', navImport: 'GOVERNMENT_NAV', active: '/government/emergencies', accent: 'emerald',
  title: 'Emergency aggregates', subtitle: 'De-identified, aggregate safety signals only — never individual traveller location or identity.',
  body: `        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Open emergency cases (demo)" value={String((metrics.headline as Record<string, number>).emergencyCases)} />
          <Stat label="Location Mode is opt-in" value="Trip / Emergency" />
          <Stat label="Individual tracking" value="Never by default" />
        </div>
        ${boundary(['Individual location data is a RESTRICTED data class requiring explicit consent and is never shown here in identifiable form.', 'This view is aggregate-only and re-identification-checked before display.'])}`,
}));

write('government/investment', page({
  portal: 'Government', navImport: 'GOVERNMENT_NAV', active: '/government/investment', accent: 'emerald',
  title: 'Investment leads', subtitle: 'Anonymised interest signals from the Investor Portal, by sector and governorate.',
  extraSetup: `  const sectors = db.investment.sectors();
  const opps = db.investment.all();`,
  body: `        <InfoCard title="Opportunities by sector (demo registry)">
          <div className="mt-2"><BarStrip rows={sectors.map((s) => ({ label: s, value: opps.filter((o) => o.sector === s).length }))} /></div>
        </InfoCard>
        <Stat label="Investment leads (demo)" value={String((metrics.headline as Record<string, number>).investmentLeads)} />`,
}));

write('government/analytics', page({
  portal: 'Government', navImport: 'GOVERNMENT_NAV', active: '/government/analytics', accent: 'emerald',
  title: 'Analytics', subtitle: 'Revenue and sector composition, aggregated and simulated.',
  extraSetup: `  const rev = metrics.revenueBySector as { sector: string; gmvUsd: number }[];
  const palette = ['#D8A84E', '#2E7D9A', '#7c9c6b', '#b6a8e0', '#c98a4f', '#7fb3c9'];`,
  body: `        <InfoCard title="GMV by sector (simulated)"><div className="mt-2"><Donut slices={rev.map((r, idx) => ({ label: r.sector, value: r.gmvUsd, colour: palette[idx % palette.length] }))} /></div></InfoCard>`,
}));

/* --------------------------------------------------------------------- */
/* ADMIN (12)                                                             */
/* --------------------------------------------------------------------- */

write('admin', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin', accent: 'royal',
  title: 'Platform operations console', subtitle: 'Cross-portal operations: content, users, verification, integrations, revenue, AI and security.',
  roleNote: 'Signed in as a demo platform operator.',
  extraSetup: `  const auditRows = recentAudit(5);`,
  body: `        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Portals live" value="7" />
          <Stat label="Route templates" value="70+" />
          <Stat label="Agents registered" value={String(AGENTS.length)} />
          <Stat label="Live integrations" value={String(ADAPTER_LIST.filter((a) => a.state === 'LIVE').length)} />
        </div>
        <InfoCard title="Recent audit activity">
          {auditRows.length ? (
            <ul className="grid gap-1.5 text-[12px] text-ink-mid">{auditRows.map((a, i) => <li key={i}>· {a.action} on {a.resource} — {a.decision}</li>)}</ul>
          ) : <p className="text-ink-faint">No audited actions yet this session.</p>}
        </InfoCard>`,
}));

write('admin/content', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/content', accent: 'royal',
  title: 'Content & CMS', subtitle: 'Draft, review and published states across every content-driven page.',
  body: `        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Published" value="All demo content" />
          <Stat label="In review" value="0" />
          <Stat label="Draft" value="0" />
        </div>
        ${boundary(['This prototype ships all content as published demo data; a real CMS workflow (draft → review → published) is designed but not wired to a persistence layer here.'])}`,
}));

write('admin/users', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/users', accent: 'royal',
  title: 'Users & roles', subtitle: 'The 22-role RBAC model governing every portal.',
  body: `        <DataTable columns={['Resource', 'Data class']} rows={RBAC_MATRIX.map((r) => [r.resource, r.dataClass])} />`,
}));

write('admin/providers', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/providers', accent: 'royal',
  title: 'Providers', subtitle: 'Every registered provider across all categories and governorates.',
  extraSetup: `  const providers = db.providers.all();`,
  body: `        <Stat label="Total providers" value={String(providers.length)} />
        <DataTable columns={['Name', 'Type', 'Governorate', 'Verification']} rows={providers.slice(0, 30).map((p) => [p.name, p.type, p.governorateSlug, p.verification])} />`,
}));

write('admin/verification', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/verification', accent: 'royal',
  title: 'Verification queue', subtitle: 'Providers and guides awaiting document review.',
  extraSetup: `  const pending = db.providers.all().filter((p) => p.verification !== 'VERIFIED');`,
  body: `        <Stat label="Pending review" value={String(pending.length)} />
        {pending.length ? (
          <DataTable columns={['Name', 'Type', 'Status']} rows={pending.slice(0, 20).map((p) => [p.name, p.type, p.verification])} />
        ) : (
          <EmptyState title="Nothing pending" />
        )}`,
}));

write('admin/integrations', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/integrations', accent: 'royal',
  title: 'Integration registry', subtitle: 'The source of truth for every adapter and its connection state, surfaced to partners and travellers alike.',
  body: `        <DataTable columns={['Category', 'Adapter', 'State']} rows={ADAPTER_LIST.map((a) => [a.category, a.displayName, a.state])} />
        <DataTable columns={['Registry record', 'State']} rows={db.integrations.all().map((i) => [i.name, i.state])} />`,
}));

write('admin/revenue', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/revenue', accent: 'royal',
  title: 'Revenue control centre', subtitle: 'Every commission rule, per service class — nothing here is a single global percentage.',
  body: `        <Stat label="Base commission assumption (configurable)" value={\`\${DEFAULT_BASE_COMMISSION_PCT}%\`} />
        <DataTable
          columns={['Service class', 'Commissionable', 'Model', 'Note']}
          rows={REVENUE_RULES.map((r) => [r.serviceClass, r.commissionable ? 'Yes' : 'No', r.model.kind, r.note])}
        />
        <InfoCard title="Financial control centre (demo figures)">
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(metrics.financeDemo as Record<string, number>).map(([k, v]) => (
              <Stat key={k} label={k.replace(/([A-Z])/g, ' $1')} value={\`$\${(v / 1_000_000).toFixed(2)}M\`} />
            ))}
          </div>
        </InfoCard>
        <SourceBadge status="SIMULATED" />`,
}));

write('admin/support', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/support', accent: 'royal',
  title: 'Support & moderation', subtitle: 'Review queue and escalations across reviews, listings and traveller reports.',
  body: `        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Open tickets (demo)" value={String((metrics.headline as Record<string, number>).openComplaints)} />
          <Stat label="Content flagged for review" value="0" />
          <Stat label="Moderation SLA" value="Not yet instrumented" />
        </div>`,
}));

write('admin/ai', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/ai', accent: 'royal',
  title: 'AI agents & MCP registry', subtitle: 'The live agent graph and every declared MCP tool, exactly as the platform enforces them.',
  extraImports: `import { AgentGraph } from '@/components/AgentGraph';`,
  body: `        <AgentGraph />
        <InfoCard title="MCP servers">
          <DataTable columns={['Server', 'Purpose']} rows={MCP_SERVERS.map((s) => [s.name, s.description])} />
        </InfoCard>
        <InfoCard title="MCP tools">
          <DataTable columns={['Tool', 'Server', 'State', 'Audited']} rows={MCP_TOOLS.map((t) => [t.name, t.server, t.state, t.auditRequired ? 'Yes' : 'No'])} />
        </InfoCard>`,
}));

write('admin/audit', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/audit', accent: 'royal',
  title: 'Audit log', subtitle: 'Every access decision recorded for sensitive, restricted or exported data.',
  extraSetup: `  const auditRows = recentAudit(50);`,
  body: `        {auditRows.length ? (
          <DataTable columns={['Time', 'Action', 'Resource', 'Decision']} rows={auditRows.map((a) => [a.at, a.action, a.resource, a.decision])} />
        ) : (
          <EmptyState title="No audited actions yet this session" body="The log fills as sensitive data is accessed or exported." />
        )}`,
}));

write('admin/security', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/security', accent: 'royal',
  title: 'Security', subtitle: 'RBAC/ABAC ceilings, rate limits and hardening posture.',
  body: `        <DataTable columns={['Resource', 'Data class']} rows={RBAC_MATRIX.map((r) => [r.resource, r.dataClass])} />
        ${boundary(['Access decisions combine role (RBAC) with context such as consent, purpose and cohort size (ABAC) — see packages/security.', 'Rate limiting and audit are enforced in the MCP gateway, not left to individual tool handlers.'])}`,
}));

write('admin/golden-license', page({
  portal: 'Admin', navImport: 'ADMIN_NAV', active: '/admin/golden-license', accent: 'royal',
  title: 'Golden Licence readiness', subtitle: 'Internal readiness tracking only — this is not a public claim of holding a Golden Licence.',
  body: `        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Criteria tracked" value="6" />
          <Stat label="Met" value="0" />
          <Stat label="In progress" value="6" />
          <Stat label="Status" value="Not applied for" />
        </div>
        ${boundary(['This tracker is internal-only and must never be surfaced as a public claim that Egypt One holds a Golden Licence.', 'Readiness criteria here are illustrative and do not represent a submitted application.'])}`,
}));

console.log('wrote 40 portal routes');
