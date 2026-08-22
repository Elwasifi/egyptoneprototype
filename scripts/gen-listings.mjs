#!/usr/bin/env node
/**
 * Emits the data-backed listing routes.
 *
 * Each listing is a thin server component that shapes records into the shared
 * Listing surface, so filtering, empty states and source labels behave the same
 * way on every directory page in the platform.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'apps', 'web', 'src', 'app', '[locale]');

/** @type {{route:string, title:string, eyebrow:string, lead:string, subject:string, source:string, base:string, facets:string, rows:string, stats?:string, boundary:string[], related:[string,string,string][]}[]} */
const LISTINGS = [
  {
    route: 'governorates',
    title: 'The 27 governorates',
    eyebrow: 'Discover Egypt',
    lead: 'Egypt is administered as 27 governorates. Every module on this platform — heritage, providers, events, investment, property and crafts — is indexed against them, so a region is both a place to visit and a place to build.',
    subject: 'desert',
    source: 'const rows = db.governorates.all();',
    base: '/governorates',
    stats: `[
      { label: 'Governorates', value: '27' },
      { label: 'Heritage records', value: String(db.heritage.all().length) },
      { label: 'Providers', value: String(db.providers.all().length) },
      { label: 'Opportunities', value: String(db.investment.all().length) },
    ]`,
    facets: `[
      { key: 'region', label: 'Region', options: [...new Set(rows.map((r) => r.region))].sort() },
      { key: 'water', label: 'Water', options: ['Nile', 'Coast', 'Neither'] },
    ]`,
    rows: `rows.map((g) => ({
      id: g.id, slug: g.slug, name: g.name, summary: \`Capital \${g.capital}. \${g.highlights.slice(0, 2).join(', ')}.\`,
      sourceStatus: g.sourceStatus, tags: [g.region, ...(g.hasCoast ? ['coast'] : []), ...(g.hasNile ? ['nile'] : [])],
      meta: [\`\${g.areaKm2.toLocaleString()} km²\`, \`\${g.metrics.heritageSites} heritage sites\`],
      badge: { label: g.region, tone: 'gold' as const },
      facets: { region: g.region, water: g.hasNile ? 'Nile' : g.hasCoast ? 'Coast' : 'Neither' },
    }))`,
    boundary: [
      'Area, population and visitor indicators are demonstration values pending a connected statistics feed.',
      'Governorate boundaries and administrative structure follow the official 27-governorate model.',
    ],
    related: [['/map', 'Interactive map', 'See all 27 on one canvas.'], ['/egypt-through-time', 'Egypt through time', 'The eras behind these places.'], ['/heritage', 'Heritage registry', 'Every recorded site.'], ['/invest', 'Invest in Egypt', 'Opportunities by region.']],
  },
  {
    route: 'heritage',
    title: 'Heritage registry',
    eyebrow: 'Digital registry',
    lead: 'A structured record of Egyptian heritage sites: period, cultural classification, governorate, access state, restoration status and the references behind each entry. Access classifications are recorded honestly, including where a permit is required or a site is closed.',
    subject: 'temple',
    source: 'const rows = db.heritage.all();',
    base: '/heritage',
    stats: `[
      { label: 'Records', value: String(rows.length) },
      { label: 'Open to visitors', value: String(rows.filter((r) => r.access === 'OPEN').length) },
      { label: 'Permit required', value: String(rows.filter((r) => r.access === 'PERMIT_REQUIRED').length) },
      { label: 'In restoration', value: String(rows.filter((r) => r.restorationStatus === 'IN_PROGRESS').length) },
    ]`,
    facets: `[
      { key: 'era', label: 'Era', options: [...new Set(rows.map((r) => r.era))] },
      { key: 'classification', label: 'Classification', options: [...new Set(rows.map((r) => r.classification))].sort() },
      { key: 'access', label: 'Access', options: [...new Set(rows.map((r) => r.access))] },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
    ]`,
    rows: `rows.map((h) => ({
      id: h.id, slug: h.slug, name: h.name, summary: h.summary,
      sourceStatus: h.sourceStatus, tags: [h.classification, h.era],
      meta: [h.governorateSlug.replace(/-/g, ' '), h.access.replace(/_/g, ' ').toLowerCase()],
      badge: { label: h.classification.split(' ')[0], tone: 'nile' as const },
      facets: { era: h.era, classification: h.classification, access: h.access, governorate: h.governorateSlug },
    }))`,
    boundary: [
      'Opening hours, ticket prices and permits are set by the competent authority and are not published here until a verified source is connected.',
      'A "limited access" or "permit required" classification is not an invitation to visit. Nothing on this page grants access to a restricted site.',
      'Academic references in this prototype are placeholders pending verified citations.',
    ],
    related: [['/hidden-heritage', 'Hidden heritage', 'Sites outside ordinary itineraries.'], ['/restoration', 'Restoration pipeline', 'What is being conserved.'], ['/museums', 'Museums', 'Where the collections are.'], ['/egyptian-heritage-worldwide', 'Heritage worldwide', 'Egyptian objects held abroad.']],
  },
  {
    route: 'hidden-heritage',
    title: 'Hidden heritage',
    eyebrow: 'Beyond the crowds',
    lead: 'Sites that sit outside ordinary tourist itineraries: excavation areas, restricted necropolises, village-scale architecture and places awaiting conservation. Several require a permit from the competent authority, and this page says so rather than implying they are open.',
    subject: 'desert',
    source: 'const rows = db.heritage.hidden();',
    base: '/heritage',
    stats: `[
      { label: 'Hidden records', value: String(rows.length) },
      { label: 'Permit required', value: String(rows.filter((r) => r.access === 'PERMIT_REQUIRED').length) },
      { label: 'Proposed for restoration', value: String(rows.filter((r) => r.restorationStatus === 'PROPOSED').length) },
      { label: 'Governorates covered', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
    ]`,
    facets: `[
      { key: 'era', label: 'Era', options: [...new Set(rows.map((r) => r.era))] },
      { key: 'access', label: 'Access', options: [...new Set(rows.map((r) => r.access))] },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
    ]`,
    rows: `rows.map((h) => ({
      id: h.id, slug: h.slug, name: h.name, summary: h.summary,
      sourceStatus: h.sourceStatus, tags: [h.classification, h.era],
      meta: [h.governorateSlug.replace(/-/g, ' '), h.access.replace(/_/g, ' ').toLowerCase()],
      badge: { label: h.access === 'PERMIT_REQUIRED' ? 'Permit' : h.access === 'LIMITED_ACCESS' ? 'Limited' : 'Restricted', tone: 'warn' as const },
      facets: { era: h.era, access: h.access, governorate: h.governorateSlug },
    }))`,
    boundary: [
      'Publishing a site here is documentation, not an invitation. Access is decided by the competent authority.',
      'Where a record says "permit required", visiting without that permit is not something this platform supports or facilitates.',
      'Precise coordinates for vulnerable sites are deliberately coarse in this prototype.',
    ],
    related: [['/heritage', 'Full registry', 'Every recorded site.'], ['/restoration', 'Restoration pipeline', 'Conservation status.'], ['/research', 'Research portal', 'Academic access pathways.'], ['/governorates', 'Governorates', 'Browse by region.']],
  },
  {
    route: 'restoration',
    title: 'Restoration pipeline',
    eyebrow: 'Conservation',
    lead: 'Sites tracked from proposal through active conservation to completion. Egypt One records and coordinates; the work, the funding decisions and the approvals belong to the competent authorities and their partners.',
    subject: 'temple',
    source: 'const rows = db.heritage.restoration();',
    base: '/heritage',
    stats: `[
      { label: 'Tracked sites', value: String(rows.length) },
      { label: 'In progress', value: String(rows.filter((r) => r.restorationStatus === 'IN_PROGRESS').length) },
      { label: 'Proposed', value: String(rows.filter((r) => r.restorationStatus === 'PROPOSED').length) },
      { label: 'Completed', value: String(rows.filter((r) => r.restorationStatus === 'COMPLETED').length) },
    ]`,
    facets: `[
      { key: 'status', label: 'Restoration status', options: ['PLANNED', 'IN_PROGRESS', 'PROPOSED', 'COMPLETED'] },
      { key: 'era', label: 'Era', options: [...new Set(rows.map((r) => r.era))] },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
    ]`,
    rows: `rows.map((h) => ({
      id: h.id, slug: h.slug, name: h.name, summary: h.summary,
      sourceStatus: h.sourceStatus, tags: [h.classification, h.era],
      meta: [h.governorateSlug.replace(/-/g, ' ')],
      badge: { label: (h.restorationStatus ?? 'NONE').replace(/_/g, ' ').toLowerCase(), tone: h.restorationStatus === 'COMPLETED' ? 'ok' as const : h.restorationStatus === 'IN_PROGRESS' ? 'nile' as const : 'gold' as const },
      facets: { status: h.restorationStatus, era: h.era, governorate: h.governorateSlug },
    }))`,
    boundary: [
      'Restoration status here is a platform record, not an official project register.',
      '"Proposed for restoration" reflects a candidate identified in the registry, not a funded or approved project.',
      'Timelines, budgets and contractors are not published by this platform.',
    ],
    related: [['/heritage', 'Heritage registry', 'Every recorded site.'], ['/government/restoration', 'Government view', 'Pipeline dashboard.'], ['/research', 'Research', 'Conservation science programmes.'], ['/museums', 'Museums', 'Where objects are held.']],
  },
  {
    route: 'museums',
    title: 'Museums and exhibitions',
    eyebrow: 'Collections',
    lead: 'Museums across the 27 governorates, from the national collections in Cairo and Giza to regional museums that hold the finds of their own landscape.',
    subject: 'museum',
    source: 'const rows = db.museums.all();',
    base: '/museums',
    stats: `[
      { label: 'Museums', value: String(rows.length) },
      { label: 'Governorates covered', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Opened since 2000', value: String(rows.filter((r) => Number(r.opened) >= 2000).length) },
      { label: 'Heritage records linked', value: String(db.heritage.all().length) },
    ]`,
    facets: `[
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'era', label: 'Opened', options: ['Before 1950', '1950–1999', '2000 onwards'] },
    ]`,
    rows: `rows.map((m) => ({
      id: m.id, slug: m.slug, name: m.name, summary: m.highlights.slice(0, 2).join(' · '),
      sourceStatus: m.sourceStatus, tags: ['museum'],
      meta: [m.governorateSlug.replace(/-/g, ' '), m.opened ? \`opened \${m.opened}\` : ''].filter(Boolean),
      facets: { governorate: m.governorateSlug, era: Number(m.opened) >= 2000 ? '2000 onwards' : Number(m.opened) >= 1950 ? '1950–1999' : 'Before 1950' },
    }))`,
    boundary: [
      'Opening hours, ticket prices and current gallery availability are set by each museum and are not published here until a verified source is connected.',
      'Collection highlights are editorial summaries, not catalogue records.',
    ],
    related: [['/heritage', 'Heritage registry', 'Sites the collections came from.'], ['/egyptian-heritage-worldwide', 'Heritage worldwide', 'Objects held abroad.'], ['/ancient-egypt-academy', 'Academy', 'Learn before you visit.'], ['/research', 'Research', 'Study these collections.']],
  },
  {
    route: 'guides',
    title: 'Guides and assistants',
    eyebrow: 'People',
    lead: 'A marketplace matching travellers to guides on language, governorate, specialty, availability, rating and accessibility expertise. Verification here means Egypt One checked submitted documents — it is never presented as a government licence.',
    subject: 'city',
    source: `const rows = db.providers.byType('GUIDE');`,
    base: '/guides',
    stats: `[
      { label: 'Guides listed', value: String(rows.length) },
      { label: 'Verified on platform', value: String(rows.filter((r) => r.verification === 'VERIFIED').length) },
      { label: 'Languages covered', value: String(new Set(rows.flatMap((r) => r.languages ?? [])).size) },
      { label: 'Governorates covered', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
    ]`,
    facets: `[
      { key: 'language', label: 'Language', options: [...new Set(rows.flatMap((r) => r.languages ?? []))].sort() },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'specialty', label: 'Specialty', options: [...new Set(rows.flatMap((r) => r.specialties ?? []))].sort() },
      { key: 'verification', label: 'Verification', options: ['VERIFIED', 'IN_REVIEW'] },
    ]`,
    rows: `rows.map((g) => ({
      id: g.id, slug: g.slug, name: g.name, summary: (g.specialties ?? []).join(' · '),
      sourceStatus: g.sourceStatus, tags: ['guide'],
      meta: [(g.languages ?? []).slice(0, 4).join(', '), g.priceFrom ? \`from \${g.currency} \${g.priceFrom}\` : ''].filter(Boolean),
      badge: { label: g.verification === 'VERIFIED' ? 'Verified' : 'In review', tone: g.verification === 'VERIFIED' ? 'ok' as const : 'warn' as const },
      facets: { language: g.languages, governorate: g.governorateSlug, specialty: g.specialties, verification: g.verification },
    }))`,
    boundary: [
      'No guide is described as officially licensed unless a verification record exists for them.',
      'Availability shown is indicative. Confirmed booking requires a connected provider adapter, and none is live in this prototype.',
      'Guides\\u2019 personal contact details are never exposed through the platform or the AI Concierge.',
    ],
    related: [['/trip-builder', 'Trip builder', 'Add a guide to an itinerary.'], ['/activities', 'Activities', 'Guided experiences.'], ['/heritage', 'Heritage', 'What your guide will show you.'], ['/provider', 'Provider portal', 'Register as a guide.']],
  },
  {
    route: 'hotels',
    title: 'Hotels and stays',
    eyebrow: 'Accommodation',
    lead: 'Hotels, resorts, boutique properties, serviced apartments and residences across the 27 governorates. No booking adapter is connected in this prototype, so nothing here is a live rate or confirmed availability.',
    subject: 'modern',
    source: `const rows = db.providers.byType('HOTEL');`,
    base: '/hotels',
    stats: `[
      { label: 'Properties listed', value: String(rows.length) },
      { label: 'Verified on platform', value: String(rows.filter((r) => r.verification === 'VERIFIED').length) },
      { label: 'Governorates covered', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Live rate adapters', value: '0' },
    ]`,
    facets: `[
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'amenity', label: 'Amenity', options: [...new Set(rows.flatMap((r) => r.amenities ?? []))].sort() },
      { key: 'verification', label: 'Verification', options: ['VERIFIED', 'IN_REVIEW'] },
    ]`,
    rows: `rows.map((h) => ({
      id: h.id, slug: h.slug, name: h.name, summary: (h.amenities ?? []).slice(0, 4).join(' · '),
      sourceStatus: h.sourceStatus, tags: ['stay'], hrefSuffix: '',
      meta: [h.governorateSlug.replace(/-/g, ' '), h.priceFrom ? \`indicative from \${h.currency} \${h.priceFrom}\` : ''].filter(Boolean),
      badge: { label: h.rating ? \`★ \${h.rating}\` : 'Unrated', tone: 'gold' as const },
      facets: { governorate: h.governorateSlug, amenity: h.amenities, verification: h.verification },
    }))`,
    boundary: [
      'Prices are indicative demonstration values, not live rates.',
      'Availability, cancellation terms and confirmation require a connected accommodation adapter. None is live.',
      'A booking would settle through a licensed payment service provider — Egypt One never holds funds.',
    ],
    related: [['/accommodation', 'All accommodation types', 'Apartments, villas and residences.'], ['/trip-builder', 'Trip builder', 'Plan the stay into a route.'], ['/offers', 'Offers', 'Programmes and packages.'], ['/provider', 'Provider portal', 'List your property.']],
  },
  {
    route: 'accommodation',
    title: 'Accommodation',
    eyebrow: 'Where to stay',
    lead: 'Beyond hotels: resorts, boutique properties, serviced and hotel apartments, residential rentals, luxury villas and business residences. Providers manage their own units, availability, pricing, offers, amenities and policies through the provider portal.',
    subject: 'modern',
    source: `const rows = db.providers.all().filter((p) => p.type === 'HOTEL');`,
    base: '/hotels',
    stats: `[
      { label: 'Properties', value: String(rows.length) },
      { label: 'Unit types supported', value: '7' },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Connected adapters', value: '0' },
    ]`,
    facets: `[
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'accessibility', label: 'Accessibility', options: ['Step-free entrance'] },
    ]`,
    rows: `rows.map((h) => ({
      id: h.id, slug: h.slug, name: h.name, summary: (h.amenities ?? []).slice(0, 4).join(' · '),
      sourceStatus: h.sourceStatus, tags: ['stay'], hrefSuffix: '',
      meta: [h.governorateSlug.replace(/-/g, ' ')],
      facets: { governorate: h.governorateSlug, accessibility: h.accessibility },
    }))`,
    boundary: [
      'Unit inventory, pricing and policies are supplied by each provider and are demonstration data here.',
      'Residential rental listings do not constitute an offer, and tenancy law is outside this platform\\u2019s scope.',
    ],
    related: [['/hotels', 'Hotels', 'The hotel view.'], ['/real-estate', 'Real estate', 'Buying rather than staying.'], ['/provider/services', 'Provider inventory', 'How supply is managed.'], ['/offers', 'Offers', 'One More Night and more.']],
  },
  {
    route: 'restaurants',
    title: 'Restaurants',
    eyebrow: 'Food',
    lead: 'Restaurants across the governorates, indexed against the local cuisine of each region so that food is part of the itinerary rather than an afterthought.',
    subject: 'market',
    source: `const rows = db.providers.byType('RESTAURANT');`,
    base: '/restaurants',
    stats: `[
      { label: 'Restaurants', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Regional dishes indexed', value: String(new Set(db.governorates.all().flatMap((g) => g.cuisine)).size) },
      { label: 'Live menus', value: '0' },
    ]`,
    facets: `[{ key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() }]`,
    rows: `rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: (r.specialties ?? []).join(' · '),
      sourceStatus: r.sourceStatus, tags: ['food'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' '), r.priceFrom ? \`from \${r.currency} \${r.priceFrom}\` : ''].filter(Boolean),
      facets: { governorate: r.governorateSlug },
    }))`,
    boundary: ['Menus, prices and opening times are not published here without a connected provider.', 'Dietary and allergen information must be confirmed directly with the restaurant.'],
    related: [['/cafes', 'Cafés', 'Coffee and street culture.'], ['/governorates', 'Governorates', 'Cuisine by region.'], ['/wear-egypt', 'Made in Egypt', 'Food products and crafts.'], ['/events', 'Food festivals', 'Seasonal events.']],
  },
  {
    route: 'cafes',
    title: 'Cafés',
    eyebrow: 'Food',
    lead: 'Historic coffee houses, corniche cafés and neighbourhood spots — the everyday social architecture of Egyptian cities.',
    subject: 'market',
    source: `const rows = db.providers.byType('CAFE');`,
    base: '/cafes',
    stats: `[
      { label: 'Cafés', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Live menus', value: '0' },
      { label: 'Verified', value: String(rows.filter((r) => r.verification === 'VERIFIED').length) },
    ]`,
    facets: `[{ key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() }]`,
    rows: `rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.summary, sourceStatus: r.sourceStatus, tags: ['cafe'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' ')], facets: { governorate: r.governorateSlug },
    }))`,
    boundary: ['Demonstration records. Opening times and menus are not asserted.'],
    related: [['/restaurants', 'Restaurants', 'Full meals.'], ['/shopping', 'Shopping', 'Markets and malls.'], ['/governorates', 'Governorates', 'Local culture by region.'], ['/traveler-stories', 'Traveller stories', 'What visitors found.']],
  },
  {
    route: 'transport',
    title: 'Transport',
    eyebrow: 'Getting around',
    lead: 'Ground transport, intercity transfers and airport connections. Egypt One coordinates between providers rather than operating vehicles itself.',
    subject: 'city',
    source: `const rows = db.providers.byType('TRANSPORT');`,
    base: '/transport',
    stats: `[
      { label: 'Operators', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Mobility adapters live', value: '0' },
      { label: 'Verified', value: String(rows.filter((r) => r.verification === 'VERIFIED').length) },
    ]`,
    facets: `[
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'verification', label: 'Verification', options: ['VERIFIED', 'IN_REVIEW'] },
    ]`,
    rows: `rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.summary, sourceStatus: r.sourceStatus, tags: ['transport'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' '), r.priceFrom ? \`from \${r.currency} \${r.priceFrom}\` : ''].filter(Boolean),
      badge: { label: r.verification === 'VERIFIED' ? 'Verified' : 'In review', tone: r.verification === 'VERIFIED' ? 'ok' as const : 'warn' as const },
      facets: { governorate: r.governorateSlug, verification: r.verification },
    }))`,
    boundary: ['Fares are indicative. A live quote needs a connected mobility adapter, and none is live.', 'Vehicle licensing and driver credentials are matters for the competent authority.'],
    related: [['/car-rental', 'Car rental', 'Self-drive options.'], ['/vip-transport', 'VIP transport', 'Private and chauffeured.'], ['/flights', 'Flights', 'Getting to Egypt.'], ['/trip-builder', 'Trip builder', 'Transfers inside a route.']],
  },
  {
    route: 'car-rental',
    title: 'Car rental',
    eyebrow: 'Getting around',
    lead: 'Self-drive rental across the governorates, aggregated through a vendor-neutral adapter contract so no single supplier is hard-wired into the platform.',
    subject: 'desert',
    source: `const rows = db.providers.byType('CAR_RENTAL');`,
    base: '/car-rental',
    stats: `[
      { label: 'Suppliers', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Aggregator adapters live', value: '0' },
      { label: 'Verified', value: String(rows.filter((r) => r.verification === 'VERIFIED').length) },
    ]`,
    facets: `[{ key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() }]`,
    rows: `rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.summary, sourceStatus: r.sourceStatus, tags: ['car'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' '), r.priceFrom ? \`from \${r.currency} \${r.priceFrom}/day\` : ''].filter(Boolean),
      facets: { governorate: r.governorateSlug },
    }))`,
    boundary: ['Driving licence requirements for visitors are set by the competent authority, not by this platform.', 'Insurance terms come from the supplier and the insurer.'],
    related: [['/transport', 'Transport', 'Driven options.'], ['/vip-transport', 'VIP transport', 'Chauffeured travel.'], ['/safety', 'Safety centre', 'Road safety guidance.'], ['/visa', 'Visa & entry', 'Before you arrive.']],
  },
  {
    route: 'vip-transport',
    title: 'VIP transport',
    eyebrow: 'Premium services',
    lead: 'Private transfers, chauffeured travel, meet-and-assist and executive itineraries, drawn from the same verified operator pool as standard transport.',
    subject: 'modern',
    source: `const rows = db.providers.byType('TRANSPORT').filter((p) => p.verification === 'VERIFIED');`,
    base: '/vip-transport',
    stats: `[
      { label: 'Verified operators', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Concierge tier', value: 'Pass required' },
      { label: 'Live adapters', value: '0' },
    ]`,
    facets: `[{ key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() }]`,
    rows: `rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: 'Private and executive transfer services.', sourceStatus: r.sourceStatus, tags: ['vip', 'modern'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' ')], facets: { governorate: r.governorateSlug },
    }))`,
    boundary: ['Only operators with a platform verification record appear here.', 'Premium concierge services are a paid tier, and that is stated before any charge.'],
    related: [['/account/pass', 'Egypt One Pass', 'Membership benefits.'], ['/transport', 'Transport', 'Standard options.'], ['/corporate-mice', 'Corporate & MICE', 'Business travel.'], ['/trip-builder', 'Trip builder', 'Build the route.']],
  },
  {
    route: 'activities',
    title: 'Activities and tours',
    eyebrow: 'Experiences',
    lead: 'Guided experiences, excursions, workshops and day tours across every governorate, from temple mornings to desert nights and reef dives.',
    subject: 'temple',
    source: `const rows = db.providers.byType('ACTIVITY');`,
    base: '/activities',
    stats: `[
      { label: 'Experiences', value: String(rows.length) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Specialties', value: String(new Set(rows.flatMap((r) => r.specialties ?? [])).size) },
      { label: 'Live adapters', value: '0' },
    ]`,
    facets: `[
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'specialty', label: 'Specialty', options: [...new Set(rows.flatMap((r) => r.specialties ?? []))].sort() },
    ]`,
    rows: `rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: (r.specialties ?? []).join(' · '),
      sourceStatus: r.sourceStatus, tags: ['activity'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' '), r.priceFrom ? \`from \${r.currency} \${r.priceFrom}\` : ''].filter(Boolean),
      facets: { governorate: r.governorateSlug, specialty: r.specialties },
    }))`,
    boundary: ['Prices and departure times are indicative demonstration values.', 'Any activity at a heritage site is subject to that site\\u2019s access rules and the authority\\u2019s permissions.'],
    related: [['/guides', 'Guides', 'Who will lead it.'], ['/heritage', 'Heritage', 'What you will see.'], ['/nile', 'Nile experiences', 'On the water.'], ['/sea', 'Sea & diving', 'Under the water.']],
  },
  {
    route: 'events',
    title: 'Events and festivals',
    eyebrow: 'What is on',
    lead: 'A nationwide events registry: cultural seasons, music, film, sport, business, conferences, MICE, heritage occasions and local governorate festivals. Organisers register and are verified before an event is published.',
    subject: 'city',
    source: 'const rows = db.events.all();',
    base: '/events',
    stats: `[
      { label: 'Events listed', value: String(rows.length) },
      { label: 'Categories', value: String(new Set(rows.map((r) => r.category)).size) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Verified organisers', value: '0' },
    ]`,
    facets: `[
      { key: 'category', label: 'Category', options: [...new Set(rows.map((r) => r.category))].sort() },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'ticketed', label: 'Ticketing', options: ['Ticketed', 'Free or unticketed'] },
    ]`,
    rows: `rows.map((e) => ({
      id: e.id, slug: e.slug, name: e.name, summary: e.summary,
      sourceStatus: e.sourceStatus, tags: [e.category], hrefSuffix: '',
      meta: [\`\${e.startDate} → \${e.endDate}\`, e.venue],
      badge: { label: e.category, tone: 'nile' as const },
      facets: { category: e.category, governorate: e.governorateSlug, ticketed: e.ticketed ? 'Ticketed' : 'Free or unticketed' },
    }))`,
    boundary: [
      'Dates, venues and ticketing are demonstration data. Confirm every event with its organiser.',
      'Organiser verification is a platform check on submitted documents, not an official endorsement.',
      'Ticket sales require a connected ticketing adapter and a licensed payment provider. Neither is live.',
    ],
    related: [['/offers', 'Offers', 'Event travel packages.'], ['/corporate-mice', 'Corporate & MICE', 'Conferences and incentives.'], ['/governorates', 'Governorates', 'Local seasons.'], ['/trip-builder', 'Trip builder', 'Plan around an event.']],
  },
  {
    route: 'investment-opportunities',
    title: 'Investment opportunity registry',
    eyebrow: 'Invest',
    lead: 'Indicative opportunities across tourism, hospitality, entertainment, real estate, healthcare, agriculture, logistics, technology and the new cities. Each entry names the competent entity — because Egypt One does not allocate land, grant licences or guarantee returns.',
    subject: 'modern',
    source: 'const rows = db.investment.all();',
    base: '/investment-opportunities',
    stats: `[
      { label: 'Opportunities', value: String(rows.length) },
      { label: 'Sectors', value: String(new Set(rows.map((r) => r.sector)).size) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Guaranteed returns', value: 'None' },
    ]`,
    facets: `[
      { key: 'sector', label: 'Sector', options: [...new Set(rows.map((r) => r.sector))].sort() },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'stage', label: 'Stage', options: ['CONCEPT', 'FEASIBILITY', 'READY', 'IN_EXECUTION'] },
      { key: 'size', label: 'Ticket size', options: ['Under USD 10M', 'USD 10–50M', 'Over USD 50M'] },
    ]`,
    rows: `rows.map((o) => ({
      id: o.id, slug: o.slug, name: o.name, summary: o.summary,
      sourceStatus: o.sourceStatus, tags: [o.sector, 'modern'],
      meta: [\`USD \${(o.investmentRangeUsd[0] / 1e6).toFixed(0)}–\${(o.investmentRangeUsd[1] / 1e6).toFixed(0)}M\`, o.governorateSlug.replace(/-/g, ' ')],
      badge: { label: o.stage.replace(/_/g, ' '), tone: 'nile' as const },
      facets: {
        sector: o.sector, governorate: o.governorateSlug, stage: o.stage,
        size: o.investmentRangeUsd[1] <= 10e6 ? 'Under USD 10M' : o.investmentRangeUsd[1] <= 50e6 ? 'USD 10–50M' : 'Over USD 50M',
      },
    }))`,
    boundary: [
      'Nothing here is an offer, an allocation, an approval or a guaranteed return.',
      'Feasibility packs, land terms and licences come from the competent entity named on each opportunity.',
      'Demand indicators shown with an opportunity are synthetic demonstration values, not official statistics.',
      'This platform does not provide regulated financial or legal advice.',
    ],
    related: [['/invest', 'Investor portal', 'Start here.'], ['/business-setup', 'Business setup', 'Establishing the entity.'], ['/real-estate', 'Real estate', 'Property assets.'], ['/government/investment', 'Government view', 'Lead pipeline.']],
  },
  {
    route: 'real-estate',
    title: 'Real estate and living in Egypt',
    eyebrow: 'Property',
    lead: 'Residential, commercial and hospitality property, hotel apartments, offices, land and the new cities — alongside an honest account of what ownership actually requires.',
    subject: 'modern',
    source: 'const rows = db.properties.all();',
    base: '/real-estate',
    stats: `[
      { label: 'Listings', value: String(rows.length) },
      { label: 'Property types', value: String(new Set(rows.map((r) => r.propertyType)).size) },
      { label: 'Governorates', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Legal advice given', value: 'None' },
    ]`,
    facets: `[
      { key: 'propertyType', label: 'Property type', options: [...new Set(rows.map((r) => r.propertyType))].sort() },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
    ]`,
    rows: `rows.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, summary: p.summary,
      sourceStatus: p.sourceStatus, tags: [p.propertyType, 'modern'], hrefSuffix: '',
      meta: [p.city ?? '', p.areaM2 ? \`\${p.areaM2.toLocaleString()} m²\` : '', p.priceUsd ? \`USD \${p.priceUsd.toLocaleString()}\` : ''].filter(Boolean),
      badge: { label: p.propertyType.replace(/_/g, ' '), tone: 'gold' as const },
      facets: { propertyType: p.propertyType, governorate: p.governorateSlug },
    }))`,
    boundary: [
      'Ownership rules for non-Egyptians depend on property type, location and current law. This platform does not give legal conclusions — take Egyptian legal advice.',
      'Listings are demonstration records and are not offers.',
      'Title, registration and transfer are matters for the competent authority and a qualified lawyer.',
    ],
    related: [['/new-cities', 'New cities', 'Where new supply is.'], ['/invest', 'Investor portal', 'Investment view.'], ['/business-setup', 'Business setup', 'If you are buying as a company.'], ['/accommodation', 'Accommodation', 'Renting rather than buying.']],
  },
  {
    route: 'wear-egypt',
    title: 'Wear Egypt',
    eyebrow: 'Marketplace',
    lead: 'Clothing, traditional dress, jewellery, crafts, art and food products, organised into a collection for each of the 27 governorates so that a purchase carries its place of origin.',
    subject: 'market',
    source: 'const rows = db.products.all();',
    base: '/wear-egypt',
    stats: `[
      { label: 'Catalogue entries', value: String(rows.length) },
      { label: 'Governorate collections', value: String(new Set(rows.map((r) => r.governorateSlug)).size) },
      { label: 'Categories', value: String(new Set(rows.map((r) => r.category)).size) },
      { label: 'Fulfilment adapters live', value: '0' },
    ]`,
    facets: `[
      { key: 'governorate', label: 'Governorate collection', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'category', label: 'Category', options: [...new Set(rows.map((r) => r.category))].sort() },
    ]`,
    rows: `rows.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, summary: p.summary,
      sourceStatus: p.sourceStatus, tags: ['market', p.category], hrefSuffix: '',
      meta: [p.governorateSlug.replace(/-/g, ' '), \`EGP \${p.priceEgp.toLocaleString()}\`],
      badge: { label: p.category, tone: 'gold' as const },
      facets: { governorate: p.governorateSlug, category: p.category },
    }))`,
    boundary: [
      'Prices are demonstration values. Checkout requires a marketplace adapter and a licensed payment provider; neither is connected.',
      'Artisan attribution in this dataset is illustrative. Real listings would carry a verified maker record.',
    ],
    related: [['/marketplace', 'Made in Egypt', 'The wider marketplace.'], ['/governorates', 'Governorates', 'Where each craft comes from.'], ['/provider', 'Provider portal', 'Sell your craft.'], ['/offers', 'Offers', 'Bundles and programmes.']],
  },
  {
    route: 'marketplace',
    title: 'Made in Egypt marketplace',
    eyebrow: 'Marketplace',
    lead: 'The wider commerce layer: craft collectives, retailers, producers and the affiliate adapter contracts that would connect external platforms — none of which is live or represents a commercial partnership.',
    subject: 'market',
    source: `const rows = db.providers.byType('RETAILER');`,
    base: '/marketplace',
    stats: `[
      { label: 'Retail partners listed', value: String(rows.length) },
      { label: 'Product entries', value: String(db.products.all().length) },
      { label: 'Adapter contracts', value: String(db.integrations.all().length) },
      { label: 'Live adapters', value: String(db.integrations.byState('LIVE').length) },
    ]`,
    facets: `[{ key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() }]`,
    rows: `rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.summary, sourceStatus: r.sourceStatus, tags: ['market'], hrefSuffix: '',
      meta: [r.governorateSlug.replace(/-/g, ' ')], facets: { governorate: r.governorateSlug },
    }))`,
    boundary: [
      'Affiliate and marketplace adapters exist as contracts only. Egypt One does not represent a commercial partnership with any company unless an agreement exists.',
      'Marketplace commission is contractual per seller and is never applied to a government fee.',
    ],
    related: [['/wear-egypt', 'Wear Egypt', 'The clothing and craft collections.'], ['/partner/integrations', 'Integrations', 'Adapter state.'], ['/admin/revenue', 'Revenue rules', 'How commission is configured.'], ['/provider', 'Provider portal', 'Join as a seller.']],
  },
  {
    route: 'research',
    title: 'Research and education',
    eyebrow: 'Academia',
    lead: 'Programmes for international researchers, doctoral candidates and universities across Egyptology, archaeology, conservation science, ancient languages, archives and heritage management.',
    subject: 'museum',
    source: 'const rows = db.research.all();',
    base: '/research',
    stats: `[
      { label: 'Programmes', value: String(rows.length) },
      { label: 'Universities', value: String(db.research.universities().length) },
      { label: 'Fields', value: String(new Set(rows.map((r) => r.field)).size) },
      { label: 'Permits issued here', value: 'None' },
    ]`,
    facets: `[
      { key: 'field', label: 'Field', options: [...new Set(rows.map((r) => r.field))].sort() },
      { key: 'degree', label: 'Degree', options: [...new Set(rows.map((r) => r.degree))].sort() },
      { key: 'university', label: 'University', options: [...new Set(rows.map((r) => r.university))].sort() },
      { key: 'language', label: 'Language', options: [...new Set(rows.flatMap((r) => r.languages))].sort() },
    ]`,
    rows: `rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.summary,
      sourceStatus: r.sourceStatus, tags: ['museum', r.field], hrefSuffix: '',
      meta: [r.university, r.languages.join(', ')],
      badge: { label: r.degree, tone: 'nile' as const },
      facets: { field: r.field, degree: r.degree, university: r.university, language: r.languages },
    }))`,
    boundary: [
      'Admission, fees and funding are decided by each university, not by this platform.',
      'Excavation, survey and archive permits are issued by the competent authority. Egypt One can explain a pathway but cannot grant one.',
      'Programme records are demonstration data until the university directory integration is connected.',
    ],
    related: [['/universities', 'Universities', 'Institutional directory.'], ['/ancient-egypt-academy', 'Academy', 'Public learning.'], ['/heritage', 'Heritage registry', 'Field context.'], ['/museums', 'Museums', 'Collections to study.']],
  },
  {
    route: 'universities',
    title: 'Universities',
    eyebrow: 'Academia',
    lead: 'Egyptian universities participating in the research portal, with the programmes they offer and the governorates they sit in.',
    subject: 'city',
    source: `const rows = db.research.universities().map((u, i) => { const progs = db.research.all().filter((p) => p.university === u); return { id: 'uni-' + i, slug: progs[0]?.slug ?? String(i), name: u, progs }; });`,
    base: '/research',
    stats: `[
      { label: 'Universities', value: String(rows.length) },
      { label: 'Programmes', value: String(db.research.all().length) },
      { label: 'Governorates', value: String(new Set(db.research.all().map((p) => p.governorateSlug)).size) },
      { label: 'Directory adapter', value: 'Planned' },
    ]`,
    facets: `[{ key: 'governorate', label: 'Governorate', options: [...new Set(db.research.all().map((p) => p.governorateSlug))].sort() }]`,
    rows: `rows.map((u) => ({
      id: u.id, slug: u.slug, name: u.name,
      summary: u.progs.map((p) => p.field).slice(0, 3).join(' · '),
      sourceStatus: 'DEMO', tags: ['city'], hrefSuffix: '',
      meta: [\`\${u.progs.length} programmes\`, (u.progs[0]?.governorateSlug ?? '').replace(/-/g, ' ')],
      facets: { governorate: u.progs[0]?.governorateSlug },
    }))`,
    boundary: ['Institutional records are demonstration entries pending a connected admissions directory.', 'No admission, equivalence or accreditation decision is made or represented here.'],
    related: [['/research', 'Programmes', 'What they teach.'], ['/ancient-egypt-academy', 'Academy', 'Public courses.'], ['/know-your-origin', 'Know your origin', 'Research boundaries.'], ['/heritage', 'Heritage', 'Field sites.']],
  },
  {
    route: 'egypt-195',
    title: 'Egypt 195',
    eyebrow: 'Global gateway',
    lead: 'A gateway page for every country in the world: how to reach Egypt from there, which suggested routes suit that market, and where to verify entry requirements and mission information with the competent authority.',
    subject: 'modern',
    source: 'const rows = db.countries.all();',
    base: '/egypt-195',
    stats: `[
      { label: 'Country gateways', value: String(rows.length + 1) },
      { label: 'Regions', value: String(new Set(rows.map((r) => r.region)).size) },
      { label: 'Mission directory', value: 'Planned integration' },
      { label: 'Visa decisions made here', value: 'None' },
    ]`,
    facets: `[
      { key: 'region', label: 'Region', options: [...new Set(rows.map((r) => r.region))].sort() },
      { key: 'mission', label: 'Egyptian mission', options: ['Listed in demo set', 'Not listed'] },
    ]`,
    rows: `rows.map((c) => ({
      id: c.id, slug: c.slug, name: c.name, summary: \`Routes, connectivity and entry guidance for travellers from \${c.name}.\`,
      sourceStatus: c.sourceStatus, tags: ['modern'],
      meta: [c.region, c.currency, c.language],
      badge: { label: c.region, tone: 'nile' as const },
      facets: { region: c.region, mission: c.hasEgyptianMission ? 'Listed in demo set' : 'Not listed' },
    }))`,
    boundary: [
      'Embassy and mission information must come from the official Ministry of Foreign Affairs directory. That integration is not connected, so nothing here is authoritative.',
      'Entry requirements vary by nationality, purpose and route, and change. Verify with the competent Egyptian authority before travelling.',
      'Flight connectivity shown is illustrative, not a schedule.',
    ],
    related: [['/visa', 'Visa & entry', 'What to check before you fly.'], ['/trip-builder', 'Trip builder', 'Plan the route.'], ['/safety', 'Safety centre', 'Support while you are here.'], ['/governorates', 'Governorates', 'Where to go.']],
  },
  {
    route: 'rulers-of-egypt',
    title: 'Rulers of Egypt',
    eyebrow: 'Through time',
    lead: 'An index of rulers across eleven eras, from the unification of Upper and Lower Egypt to the modern republic, each linked to the monuments and collections associated with their reign.',
    subject: 'temple',
    source: 'const rows = db.rulers.all();',
    base: '/rulers-of-egypt',
    stats: `[
      { label: 'Ruler profiles', value: String(rows.length) },
      { label: 'Eras covered', value: String(new Set(rows.map((r) => r.era)).size) },
      { label: 'Monuments linked', value: String(new Set(rows.flatMap((r) => r.monuments)).size) },
      { label: 'Heritage records', value: String(db.heritage.all().length) },
    ]`,
    facets: `[
      { key: 'era', label: 'Era', options: [...new Set(rows.map((r) => r.era))] },
      { key: 'dynasty', label: 'Dynasty', options: [...new Set(rows.map((r) => r.dynasty ?? ''))].filter(Boolean).sort() },
    ]`,
    rows: `rows.map((r) => ({
      id: r.id, slug: r.slug, name: r.name, summary: r.achievements[0],
      sourceStatus: r.sourceStatus, tags: ['temple', r.era],
      meta: [r.reign, r.dynasty ?? ''].filter(Boolean),
      badge: { label: r.era.replace(/_/g, ' ').toLowerCase(), tone: 'gold' as const },
      facets: { era: r.era, dynasty: r.dynasty },
    }))`,
    boundary: [
      'Regnal dates for early periods are debated among Egyptologists. Dates here follow a conventional chronology and are approximate.',
      'Attribution of monuments to a ruler reflects mainstream scholarship, not a settled fact in every case.',
    ],
    related: [['/egypt-through-time', 'Egypt through time', 'The full timeline.'], ['/heritage', 'Heritage registry', 'What they built.'], ['/museums', 'Museums', 'Where the objects are.'], ['/ancient-egypt-academy', 'Academy', 'Learn the periods.']],
  },
  {
    route: 'egyptian-heritage-worldwide',
    title: 'Egyptian heritage worldwide',
    eyebrow: 'Abroad',
    lead: 'A catalogue of Egyptian antiquities and heritage objects held outside Egypt: the object, its period, the holding institution and country. Provenance is recorded as an open question, never asserted.',
    subject: 'museum',
    source: 'const rows = db.worldwide.all();',
    base: '/egyptian-heritage-worldwide',
    stats: `[
      { label: 'Catalogue entries', value: String(rows.length) },
      { label: 'Countries', value: String(new Set(rows.map((r) => r.country)).size) },
      { label: 'Institutions', value: String(new Set(rows.map((r) => r.institution)).size) },
      { label: 'Provenance claims made', value: 'None' },
    ]`,
    facets: `[
      { key: 'country', label: 'Country', options: [...new Set(rows.map((r) => r.country))].sort() },
      { key: 'era', label: 'Era', options: [...new Set(rows.map((r) => r.era))] },
    ]`,
    rows: `rows.map((o) => ({
      id: o.id, slug: o.slug, name: o.name, summary: \`\${o.institution}, \${o.country}\`,
      sourceStatus: o.sourceStatus, tags: ['museum', o.era], hrefSuffix: '',
      meta: [o.era.replace(/_/g, ' ').toLowerCase()],
      badge: { label: o.country, tone: 'neutral' as const },
      facets: { country: o.country, era: o.era },
    }))`,
    boundary: [
      'Egypt One makes no claim here about legal title, acquisition circumstances or restitution status for any object.',
      'Counts and provenance are not invented. Entries stay as demonstration records until authoritative data is supplied by the holding institution and the Egyptian authorities.',
      'This catalogue is documentation, not advocacy or a legal position.',
    ],
    related: [['/museums', 'Museums in Egypt', 'Collections at home.'], ['/heritage', 'Heritage registry', 'Sites of origin.'], ['/research', 'Research', 'Provenance scholarship.'], ['/media', 'Media centre', 'How this is reported.']],
  },
  {
    route: 'medical-tourism',
    title: 'Medical tourism',
    eyebrow: 'Health',
    lead: 'Hospitals, clinics, specialists, wellness, rehabilitation and preventive health, with travel coordinated around the appointment rather than the other way round. Health data carries the platform’s highest protection.',
    subject: 'city',
    source: `const rows = db.providers.byType('MEDICAL');`,
    base: '/medical-tourism',
    stats: `[
      { label: 'Providers listed', value: String(rows.length) },
      { label: 'Specialties', value: String(new Set(rows.flatMap((r) => r.specialties ?? [])).size) },
      { label: 'Accredited network adapter', value: 'Planned' },
      { label: 'Diagnoses given here', value: 'None' },
    ]`,
    facets: `[
      { key: 'specialty', label: 'Specialty', options: [...new Set(rows.flatMap((r) => r.specialties ?? []))].sort() },
      { key: 'governorate', label: 'Governorate', options: [...new Set(rows.map((r) => r.governorateSlug))].sort() },
      { key: 'language', label: 'Language', options: [...new Set(rows.flatMap((r) => r.languages ?? []))].sort() },
    ]`,
    rows: `rows.map((p) => ({
      id: p.id, slug: p.slug, name: p.name, summary: (p.specialties ?? []).join(' · '),
      sourceStatus: p.sourceStatus, tags: ['city'], hrefSuffix: '',
      meta: [p.governorateSlug.replace(/-/g, ' '), (p.languages ?? []).slice(0, 3).join(', ')],
      badge: { label: 'Sensitive data class', tone: 'danger' as const },
      facets: { specialty: p.specialties, governorate: p.governorateSlug, language: p.languages },
    }))`,
    boundary: [
      'Egypt One does not diagnose, recommend treatment or interpret results. That is for a qualified clinician.',
      'Accreditation shown is a demonstration record. The accredited-network integration is not connected, so no accreditation here is confirmed.',
      'Health data is classified SENSITIVE: explicit consent, a stated purpose and an audit entry are required before any access, and it is never used for marketing or affiliate purposes.',
      'Referral fees are disabled by default and would need legal review before being enabled anywhere they are permitted at all.',
    ],
    related: [['/wellness', 'Wellness', 'Non-clinical journeys.'], ['/account/consent', 'Consent centre', 'Control your health data.'], ['/know-your-origin', 'Know your origin', 'Genetic research boundaries.'], ['/safety', 'Safety centre', 'If something goes wrong.']],
  },
  {
    route: 'offers',
    title: 'Offers and programmes',
    eyebrow: 'Programmes',
    lead: 'Stopover Egypt, One More Night, the Visit All 27 Challenge, the Egypt One Pass and seasonal programmes. Each becomes real only when a provider contract and a connected booking adapter exist behind it.',
    subject: 'temple',
    source: 'const rows = db.offers.all();',
    base: '/offers',
    stats: `[
      { label: 'Programmes', value: String(rows.length) },
      { label: 'Live discounts', value: '0' },
      { label: 'Governorates in the challenge', value: '27' },
      { label: 'Provider contracts', value: '0' },
    ]`,
    facets: `[{ key: 'kind', label: 'Programme type', options: [...new Set(rows.map((r) => r.kind))].sort() }]`,
    rows: `rows.map((o) => ({
      id: o.id, slug: o.slug, name: o.name, summary: o.summary,
      sourceStatus: 'DEMO', tags: [o.kind], hrefSuffix: '',
      badge: { label: o.kind, tone: 'gold' as const },
      facets: { kind: o.kind },
    }))`,
    boundary: [
      'No discount here is redeemable. Programmes activate only with a signed provider contract and a live adapter.',
      'Loyalty points and pass benefits are illustrative and carry no monetary value in this prototype.',
    ],
    related: [['/account/pass', 'Egypt One Pass', 'Membership.'], ['/account/wallet', 'Wallet & rewards', 'Where benefits land.'], ['/hotels', 'Hotels', 'Where One More Night applies.'], ['/governorates', 'Visit all 27', 'The challenge map.']],
  },
  {
    route: 'traveler-stories',
    title: 'Traveller stories',
    eyebrow: 'Visitor voice',
    lead: 'Stories and video from travellers, published only after moderation and a marketing review. Nothing reaches this page — or any social channel — without a human approving it.',
    subject: 'city',
    source: 'const rows = db.stories.all();',
    base: '/traveler-stories',
    stats: `[
      { label: 'Stories', value: String(rows.length) },
      { label: 'Published', value: String(rows.filter((r) => r.moderationState === 'PUBLISHED').length) },
      { label: 'In review', value: String(rows.filter((r) => r.moderationState === 'IN_REVIEW').length) },
      { label: 'Auto-published', value: '0' },
    ]`,
    facets: `[
      { key: 'country', label: 'Traveller country', options: [...new Set(rows.map((r) => r.country))].sort() },
      { key: 'groupType', label: 'Group type', options: [...new Set(rows.map((r) => r.groupType))].sort() },
      { key: 'moderationState', label: 'Moderation', options: ['PUBLISHED', 'IN_REVIEW'] },
    ]`,
    rows: `rows.map((s) => ({
      id: s.id, slug: s.slug, name: s.name, summary: s.summary,
      sourceStatus: 'DEMO', tags: ['city'], hrefSuffix: '',
      meta: [s.country, s.groupType, s.destinations.join(', ')],
      badge: { label: s.moderationState === 'PUBLISHED' ? 'Published' : 'In review', tone: s.moderationState === 'PUBLISHED' ? 'ok' as const : 'warn' as const },
      facets: { country: s.country, groupType: s.groupType, moderationState: s.moderationState },
    }))`,
    boundary: [
      'Every story passes moderation and a marketing review before publication. The Marketing Agent can queue content but cannot publish it.',
      'Traveller names and identifying details are not published without consent.',
      'Stories in this prototype are demonstration content, not real submissions.',
    ],
    related: [['/reviews', 'Reviews', 'Structured feedback.'], ['/media', 'Media centre', 'Press and assets.'], ['/admin/support', 'Moderation queue', 'How review works.'], ['/discover', 'Discover Egypt', 'Where they went.']],
  },
];

const tpl = (l) => `import { db } from '@egypt-one/database';
import { Badge } from '@egypt-one/ui';
import type { Metadata } from 'next';
import { Page } from '@/components/Container';
import { Listing } from '@/components/Listing';
import { ModuleHero, Boundary, RelatedLinks } from '@/components/Module';
import type { Locale } from '@egypt-one/i18n';

export const metadata: Metadata = {
  title: ${JSON.stringify(l.title)},
  description: ${JSON.stringify(l.lead.slice(0, 180))},
};

export default async function ${l.route.split('-').map((s) => s[0].toUpperCase() + s.slice(1)).join('')}Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  ${l.source}

  return (
    <Page wide>
      <ModuleHero
        eyebrow=${JSON.stringify(l.eyebrow)}
        title=${JSON.stringify(l.title)}
        lead=${JSON.stringify(l.lead)}
        seed=${JSON.stringify(l.route)}
        subject=${JSON.stringify(l.subject)}
        badges={<Badge tone="gold">{rows.length.toLocaleString()} records</Badge>}
        stats={${l.stats ?? '[]'}}
      />

      <Listing
        locale={locale as Locale}
        basePath=${JSON.stringify(l.base)}
        facets={${l.facets}}
        rows={${l.rows}}
      />

      <div className="mt-10 grid gap-6">
        <Boundary points={${JSON.stringify(l.boundary)}} />
        <RelatedLinks
          locale={locale as Locale}
          links={${JSON.stringify(l.related.map(([href, label, body]) => ({ href, label, body })))}}
        />
      </div>
    </Page>
  );
}
`;

let n = 0;
for (const l of LISTINGS) {
  const dir = join(root, l.route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'page.tsx'), tpl(l));
  n++;
}
console.log(`wrote ${n} listing routes`);
