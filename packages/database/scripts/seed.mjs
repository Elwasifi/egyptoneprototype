#!/usr/bin/env node
/**
 * Seeds PostgreSQL from the demo content pack.
 *
 * Every seeded row keeps sourceStatus = 'DEMO'. Nothing here claims to be an
 * official record. Run only against local, dev or staging databases.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const demoDir = join(here, '..', 'src', 'demo');
const read = (f) => JSON.parse(readFileSync(join(demoDir, f), 'utf8'));

if (!process.env.DATABASE_URL) {
  console.log('DATABASE_URL is not set — the platform runs from the demo content pack in memory.');
  console.log('Files in the pack:');
  for (const f of readdirSync(demoDir).filter((f) => f.endsWith('.json'))) {
    const data = read(f);
    console.log(`  ${f.padEnd(34)} ${Array.isArray(data) ? data.length + ' records' : 'object'}`);
  }
  process.exit(0);
}

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

const govs = read('governorates.json');
console.log(`Seeding ${govs.length} governorates…`);
const govId = {};
for (const g of govs) {
  const row = await prisma.governorate.upsert({
    where: { slug: g.slug },
    update: {},
    create: {
      slug: g.slug, code: g.code, name: g.name, nameAr: g.nameAr, capital: g.capital,
      region: g.region, areaKm2: g.areaKm2, populationM: g.populationM,
      lat: g.coordinates.lat, lng: g.coordinates.lng, hasCoast: g.hasCoast, hasNile: g.hasNile,
      summary: g.summary, highlights: g.highlights, cuisine: g.cuisine, crafts: g.crafts,
      nature: g.nature, investmentSectors: g.investmentSectors, heritageEras: g.heritageEras,
      sourceStatus: 'DEMO', sourceOwner: g.sourceOwner, dataClass: 'PUBLIC',
    },
  });
  govId[g.slug] = row.id;
  for (const c of g.cities) {
    const slug = `${g.slug}-${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    await prisma.city.upsert({ where: { slug }, update: {}, create: { slug, name: c, governorateId: row.id, sourceStatus: 'DEMO' } });
  }
}

const simple = [
  ['countries.json', 'country', (r) => ({ slug: r.slug, iso2: r.iso2, name: r.name, region: r.region, currency: r.currency, language: r.language, hasEgyptianMission: r.hasEgyptianMission, missionNote: r.missionNote, visaRoute: r.visaRoute, directFlights: r.directFlights, suggestedRoutes: r.suggestedRoutes, sourceStatus: 'DEMO' })],
  ['rulers.json', 'ruler', (r) => ({ slug: r.slug, name: r.name, era: r.era, dynasty: r.dynasty, reign: r.reign, achievements: r.achievements, monuments: r.monuments, summary: r.summary, sourceStatus: 'DEMO' })],
  ['heritage-worldwide.json', 'heritageWorldwideObject', (r) => ({ slug: r.slug, name: r.name, era: r.era, institution: r.institution, country: r.country, provenanceNote: r.provenanceNote, summary: r.summary, images: [], sourceStatus: 'DEMO' })],
];
for (const [file, model, map] of simple) {
  const rows = read(file);
  console.log(`Seeding ${rows.length} ${model} records…`);
  for (const r of rows) await prisma[model].upsert({ where: { slug: r.slug }, update: {}, create: map(r) });
}

const withGov = [
  ['destinations.json', 'destination', (r, gid) => ({ slug: r.slug, name: r.name, category: r.category, bestSeason: r.bestSeason, lat: r.coordinates?.lat, lng: r.coordinates?.lng, summary: r.summary, description: r.description, images: [], tags: r.tags ?? [], governorateId: gid, sourceStatus: 'DEMO' })],
  ['heritage-sites.json', 'heritageSite', (r, gid) => ({ slug: r.slug, name: r.name, era: r.era, classification: r.classification, access: r.access, restorationStatus: r.restorationStatus ?? 'NONE', hidden: !!r.hidden, lat: r.coordinates?.lat, lng: r.coordinates?.lng, summary: r.summary, description: r.description, images: [], academicReferences: r.academicReferences ?? [], relatedFigures: [], accessibility: r.accessibility ?? [], governorateId: gid, sourceStatus: 'DEMO' })],
  ['museums.json', 'museum', (r, gid) => ({ slug: r.slug, name: r.name, opened: r.opened, highlights: r.highlights, access: r.access, summary: r.summary, description: r.description, images: [], governorateId: gid, sourceStatus: 'DEMO' })],
  ['providers.json', 'provider', (r, gid) => ({ slug: r.slug, name: r.name, type: r.type, verification: r.verification, rating: r.rating, reviewCount: r.reviewCount, priceFrom: r.priceFrom, currency: r.currency ?? 'USD', languages: r.languages ?? [], specialties: r.specialties ?? [], amenities: r.amenities ?? [], accessibility: r.accessibility ?? [], availability: r.availability ?? [], summary: r.summary, images: [], governorateId: gid, sourceStatus: 'DEMO', dataClass: r.dataClass ?? 'PUBLIC' })],
  ['events.json', 'event', (r, gid) => ({ slug: r.slug, name: r.name, category: r.category, startDate: new Date(r.startDate), endDate: new Date(r.endDate), venue: r.venue, organiser: r.organiser, ticketed: r.ticketed, languages: r.languages, summary: r.summary, description: r.description, images: [], governorateId: gid, sourceStatus: 'DEMO' })],
  ['investment-opportunities.json', 'investmentOpportunity', (r, gid) => ({ slug: r.slug, name: r.name, sector: r.sector, stage: r.stage, minInvestmentUsd: r.investmentRangeUsd[0], maxInvestmentUsd: r.investmentRangeUsd[1], landRequirementHa: r.landRequirementHa, competentEntity: r.competentEntity, restrictions: r.restrictions, demandSignals: r.demandSignals, risks: r.risks, summary: r.summary, description: r.description, images: [], governorateId: gid, sourceStatus: 'DEMO' })],
  ['properties.json', 'property', (r, gid) => ({ slug: r.slug, name: r.name, propertyType: r.propertyType, priceUsd: r.priceUsd, areaM2: r.areaM2, city: r.city, summary: r.summary, description: r.description, images: [], governorateId: gid, sourceStatus: 'DEMO' })],
  ['products.json', 'product', (r, gid) => ({ slug: r.slug, name: r.name, category: r.category, priceEgp: r.priceEgp, maker: r.maker, summary: r.summary, description: r.description, images: [], governorateId: gid, sourceStatus: 'DEMO' })],
];
for (const [file, model, map] of withGov) {
  const rows = read(file);
  console.log(`Seeding ${rows.length} ${model} records…`);
  for (const r of rows) {
    const gid = govId[r.governorateSlug];
    if (!gid) continue;
    await prisma[model].upsert({ where: { slug: r.slug }, update: {}, create: map(r, gid) });
  }
}

console.log('Seeding integration registry…');
for (const i of read('integrations.json')) {
  await prisma.integrationRegistry.upsert({
    where: { key: i.id }, update: { state: i.state },
    create: { key: i.id, name: i.name, category: i.category, adapter: i.adapter, state: i.state, dataClass: i.dataClass, sourceOwner: i.sourceOwner, commissionable: i.commissionable, notes: i.notes },
  });
}

console.log('Done. Every seeded record carries sourceStatus DEMO.');
await prisma.$disconnect();
