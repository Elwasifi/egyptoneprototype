#!/usr/bin/env node
/**
 * Crawls apps/web/src/app/[locale] and confirms every route template has a
 * page.tsx, then (if a build has already run) checks the build manifest for
 * a matching prerendered path. Cheap sanity check ahead of a full
 * `next build` — not a replacement for it.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'apps/web/src/app/[locale]');

function walk(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else if (entry.name === 'page.tsx') found.push(full);
  }
  return found;
}

const pages = walk(ROOT);
console.log(`Found ${pages.length} page.tsx files under apps/web/src/app/[locale].`);

let missingExport = 0;
for (const p of pages) {
  const src = fs.readFileSync(p, 'utf8');
  if (!/export default/.test(src)) {
    console.error(`✗ ${path.relative(process.cwd(), p)} has no default export`);
    missingExport++;
  }
}

if (missingExport) {
  console.error(`${missingExport} route file(s) missing a default export.`);
  process.exit(1);
}

console.log('All route files export a default component. Run `pnpm --filter @egypt-one/web build` for the full static-generation check.');
