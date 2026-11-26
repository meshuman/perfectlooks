// Writes exports/shops.csv with one row per shop (and the main owner), for lead follow-up and marketing in a
// spreadsheet. The file holds personal contact details: it is kept out of git and never uploaded with the website.
// Usage: npm run shops:export
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const store = JSON.parse(readFileSync('data/shops.json', 'utf8'));
const cell = (v) => {
  const text = Array.isArray(v) ? v.join('; ') : String(v ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const columns = [
  ['key', (k) => k],
  ['address (subdomain)', (k) => `${k}.looksmenu.com`],
  ['shop', (_, s) => s.shop],
  ['type', (_, s) => s.type],
  ['owner', (_, s) => s.owners?.[0]?.name],
  ['owner role', (_, s) => s.owners?.[0]?.role],
  ['owner whatsapp', (_, s) => s.owners?.[0]?.whatsapp],
  ['owner mobile', (_, s) => s.owners?.[0]?.mobile],
  ['owner email', (_, s) => s.owners?.[0]?.email],
  ['other owners', (_, s) => (s.owners ?? []).slice(1).map((o) => `${o.name} ${o.mobile || o.whatsapp || ''}`.trim())],
  ['shop whatsapp', (_, s) => s.whatsapp],
  ['shop mobile', (_, s) => s.mobile],
  ['shop phone', (_, s) => s.phone],
  ['email', (_, s) => s.email],
  ['website', (_, s) => s.website],
  ['address', (_, s) => s.location?.address],
  ['area', (_, s) => s.location?.area],
  ['city', (_, s) => s.location?.city],
  ['district', (_, s) => s.location?.district],
  ['country', (_, s) => s.location?.country],
  ['lat', (_, s) => s.location?.lat],
  ['lng', (_, s) => s.location?.lng],
  ['maps link', (_, s) => s.location?.mapsUrl],
  ['established', (_, s) => s.established],
  ['opening hours', (_, s) => s.openingHours],
  ['services', (_, s) => s.services],
  ['staff', (_, s) => s.staff],
  ['chairs', (_, s) => s.chairs],
  ['languages', (_, s) => s.languages],
  ['facebook', (_, s) => s.social?.facebook],
  ['instagram', (_, s) => s.social?.instagram],
  ['tiktok', (_, s) => s.social?.tiktok],
  ['youtube', (_, s) => s.social?.youtube],
  ['lead status', (_, s) => s.lead?.status],
  ['source', (_, s) => s.lead?.source],
  ['handled by', (_, s) => s.lead?.handledBy],
  ['first contact', (_, s) => s.lead?.firstContact],
  ['last contact', (_, s) => s.lead?.lastContact],
  ['consent to marketing', (_, s) => (s.lead?.consentToMarketing === null || s.lead?.consentToMarketing === undefined ? '' : s.lead.consentToMarketing ? 'yes' : 'no')],
  ['notes', (_, s) => s.lead?.notes],
];

const rows = [columns.map(([name]) => cell(name)).join(',')];
for (const [key, s] of Object.entries(store.shops ?? {})) rows.push(columns.map(([, get]) => cell(get(key, s))).join(','));
mkdirSync('exports', { recursive: true });
writeFileSync('exports/shops.csv', '﻿' + rows.join('\n') + '\n');
console.log(`Wrote exports/shops.csv with ${rows.length - 1} shop${rows.length === 2 ? '' : 's'}`);
