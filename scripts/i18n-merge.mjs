// Merges a batch of draft translations into a sheet. Rows a reviewer has approved (translation
// with an empty status) are never overwritten.
// Usage: node scripts/i18n-merge.mjs ne path/to/batch.json   (batch: { "key": "translation", ... })
import { readFileSync, writeFileSync } from 'node:fs';
import { parseCsv, writeCsv } from '../src/i18n/csv.mjs';

const [locale, batchPath] = process.argv.slice(2);
if (!locale || !batchPath) throw new Error('usage: node scripts/i18n-merge.mjs <locale> <batch.json>');

const sheetPath = `translations/${locale}.csv`;
const [header, ...rows] = parseCsv(readFileSync(sheetPath, 'utf8'));
const col = (name) => header.indexOf(name);
const [k, e, t, s] = [col('key'), col('english'), col('translation'), col('status')];
const batch = JSON.parse(readFileSync(batchPath, 'utf8'));

const placeholders = (text) => [...text.matchAll(/\{\w+\}/g)].map((m) => m[0]).sort().join(' ');
const links = (text) => (text.match(/<a\s/g) ?? []).length + (text.match(/\]\(/g) ?? []).length;

let added = 0;
const skipped = [];
const problems = [];
const byKey = new Map(rows.map((r) => [r[k], r]));
for (const [key, translation] of Object.entries(batch)) {
  const row = byKey.get(key);
  if (!row) {
    problems.push(`${key}: not in the sheet`);
    continue;
  }
  if (row[t] && !row[s]) {
    skipped.push(key);
    continue;
  }
  // The site fills {placeholders} and needs links kept, so a draft must keep the same ones.
  if (placeholders(row[e]) !== placeholders(translation)) problems.push(`${key}: placeholders differ`);
  if (links(row[e]) !== links(translation)) problems.push(`${key}: links differ`);
  row[t] = translation.trim();
  row[s] = 'draft';
  added++;
}

writeFileSync(sheetPath, writeCsv([header, ...rows]));
console.log(`${locale}: ${added} drafts merged${skipped.length ? `, ${skipped.length} reviewed rows left as they were` : ''}.`);
for (const p of problems) console.log(`  check: ${p}`);
if (problems.length) process.exitCode = 1;
