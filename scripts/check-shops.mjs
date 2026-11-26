// Checks data/shops.json: every shop has a name, valid numbers, a location that makes sense, and photo and logo files
// that exist. Also says how much of the lead and marketing information is filled in for each shop.
// Usage: npm run check:shops
import { existsSync, readFileSync } from 'node:fs';

const store = JSON.parse(readFileSync('data/shops.json', 'utf8'));
const problems = [];
const slugs = Object.keys(store.shops ?? {});
const phone = /^\+\d[\d\s-]{7,16}$/;
const STATUS = ['lead', 'contacted', 'demo', 'active', 'paused', 'lost', 'test'];
const TYPES = ['men', 'women', 'unisex'];

const file = (at, field, path) => {
  if (!path) return;
  if (!/^[\w\-./]+\.(png|jpe?g|webp|svg|avif)$/i.test(path) || path.includes('..') || path.startsWith('/')) problems.push(`${at} "${field}" must be a path like photos/name.jpg or logos/name.png`);
  else if (!existsSync(`public/shops/${path}`)) problems.push(`${at} "${field}" points to public/shops/${path}, which does not exist`);
};

for (const slug of slugs) {
  const s = store.shops[slug];
  const at = `${slug}:`;
  if (!/^[a-z0-9][a-z0-9-]{0,40}$/.test(slug)) problems.push(`${at} the key (the address, ${slug}.looksmenu.com) must be lowercase letters, numbers and dashes`);
  if (!s.shop) problems.push(`${at} "shop" (the full shop name) is missing`);
  if (s.type && !TYPES.includes(s.type)) problems.push(`${at} "type" must be one of ${TYPES.join(', ')}`);
  for (const f of ['whatsapp', 'mobile', 'phone']) if (s[f] && !phone.test(s[f])) problems.push(`${at} "${f}" should look like +977 9812345678`);
  for (const [i, o] of (s.owners ?? []).entries()) {
    if (!o.name) problems.push(`${at} owners[${i}] has no name`);
    for (const f of ['whatsapp', 'mobile']) if (o[f] && !phone.test(o[f])) problems.push(`${at} owners[${i}].${f} should look like +977 9812345678`);
    file(at, `owners[${i}].photo`, o.photo);
  }
  file(at, 'logo', s.logo);
  const loc = s.location ?? {};
  if ((loc.lat === null) !== (loc.lng === null)) problems.push(`${at} location needs both lat and lng, or neither`);
  if (loc.lat !== null && loc.lat !== undefined && !(typeof loc.lat === 'number' && loc.lat >= -90 && loc.lat <= 90)) problems.push(`${at} location.lat must be a number from -90 to 90`);
  if (loc.lng !== null && loc.lng !== undefined && !(typeof loc.lng === 'number' && loc.lng >= -180 && loc.lng <= 180)) problems.push(`${at} location.lng must be a number from -180 to 180`);
  if (s.established !== null && s.established !== undefined && !(Number.isInteger(s.established) && s.established >= 1900 && s.established <= new Date().getFullYear())) problems.push(`${at} "established" must be a year, such as 2016`);
  if (s.lead?.status && !STATUS.includes(s.lead.status)) problems.push(`${at} lead.status must be one of ${STATUS.join(', ')}`);
}

if (problems.length) {
  console.log(problems.map((p) => '  ' + p).join('\n'));
  process.exit(1);
}

// How complete is each shop's record for follow-up and marketing?
const wanted = [
  ['owner name', (s) => s.owners?.[0]?.name],
  ['owner photo', (s) => s.owners?.[0]?.photo],
  ['whatsapp', (s) => s.whatsapp],
  ['mobile', (s) => s.mobile],
  ['email', (s) => s.email || s.owners?.[0]?.email],
  ['logo', (s) => s.logo],
  ['address', (s) => s.location?.address],
  ['city', (s) => s.location?.city],
  ['lat/lng', (s) => s.location?.lat !== null && s.location?.lat !== undefined && s.location?.lng !== null && s.location?.lng !== undefined],
  ['established', (s) => s.established],
  ['services', (s) => s.services?.length],
  ['social', (s) => Object.values(s.social ?? {}).some(Boolean)],
  ['consent', (s) => s.lead?.consentToMarketing !== null && s.lead?.consentToMarketing !== undefined],
];
console.log(`${slugs.length} shop${slugs.length === 1 ? '' : 's'} OK: ${slugs.join(', ')}`);
for (const slug of slugs) {
  const s = store.shops[slug];
  const missing = wanted.filter(([, has]) => !has(s)).map(([name]) => name);
  console.log(`  ${slug}: ${wanted.length - missing.length}/${wanted.length} filled${missing.length ? `; still missing: ${missing.join(', ')}` : ''}`);
}
