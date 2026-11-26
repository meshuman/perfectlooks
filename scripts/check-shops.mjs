// Checks public/shops/shops.json: every shop has a name, a valid WhatsApp number, and photo and logo files that exist.
// Usage: npm run check:shops
import { existsSync, readFileSync } from 'node:fs';

const store = JSON.parse(readFileSync('public/shops/shops.json', 'utf8'));
const problems = [];
const slugs = Object.keys(store.shops ?? {});
for (const slug of slugs) {
  const s = store.shops[slug];
  const at = `${slug}:`;
  if (!/^[a-z0-9][a-z0-9-]{0,40}$/.test(slug)) problems.push(`${at} the name in the link must be lowercase letters, numbers and dashes`);
  if (!s.shop) problems.push(`${at} "shop" (the shop name) is missing`);
  if (s.whatsapp !== undefined) {
    const digits = String(s.whatsapp).replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) problems.push(`${at} "whatsapp" should be a number with country code, e.g. +977 9812345678`);
  }
  for (const field of ['photo', 'logo']) {
    if (!s[field]) continue;
    if (!/^[\w\-./]+\.(png|jpe?g|webp|svg|avif)$/i.test(s[field]) || s[field].includes('..') || s[field].startsWith('/')) problems.push(`${at} "${field}" must be a path like ${field === 'photo' ? 'photos/name.jpg' : 'logos/name.png'}`);
    else if (!existsSync(`public/shops/${s[field]}`)) problems.push(`${at} "${field}" points to public/shops/${s[field]}, which does not exist`);
  }
}
if (problems.length) {
  console.log(problems.map((p) => '  ' + p).join('\n'));
  process.exit(1);
}
console.log(`${slugs.length} shop${slugs.length === 1 ? '' : 's'} OK: ${slugs.join(', ')}`);
