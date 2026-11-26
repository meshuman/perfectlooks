// Makes public/shops/shops.json, the file the website reads, from data/shops.json, the full record of each shop.
// Only what the site shows goes into the public file; owners' mobile numbers, emails, location, year, lead notes and
// the rest stay in data/shops.json, which is never uploaded. Runs before every build and dev start.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const full = JSON.parse(readFileSync('data/shops.json', 'utf8'));
const shops = {};
for (const [slug, s] of Object.entries(full.shops ?? {})) {
  const owner = s.owners?.[0] ?? {};
  const entry = {
    shop: s.shop,
    short: s.short || undefined,
    barber: owner.name || undefined,
    logo: s.logo || undefined,
    photo: owner.photo || undefined,
    welcome: s.welcome || undefined,
    // Only when the shop chose to show a contact number on its own address.
    contact: s.publicContact?.number || undefined,
    contactWhatsapp: s.publicContact?.number ? s.publicContact.whatsapp !== false : undefined,
  };
  shops[slug] = Object.fromEntries(Object.entries(entry).filter(([, v]) => v !== undefined));
}
mkdirSync('public/shops', { recursive: true });
writeFileSync('public/shops/shops.json', JSON.stringify({ shops }, null, 2) + '\n');
console.log(`Wrote public/shops/shops.json with ${Object.keys(shops).length} shop${Object.keys(shops).length === 1 ? '' : 's'}`);
