// Makes the install files for the app: an icon set and a web app manifest for looksmenu itself, and for every shop in
// public/shops/shops.json (so a shop's QR code installs an app with that shop's logo and name).
//   public/manifest.webmanifest, public/icons/looksmenu-*.png
//   public/shops/manifests/<shop>.webmanifest, public/shops/icons/<shop>-*.png
// Runs before every build and dev start (npm scripts "prebuild" and "predev"). The output is not committed.
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const NAVY = '#0f2032';
const PAPER = '#f7f4f0';
const WHITE = '#ffffff';

mkdirSync('public/icons', { recursive: true });
mkdirSync('public/shops/icons', { recursive: true });
mkdirSync('public/shops/manifests', { recursive: true });

/** A square icon: the artwork centred on a solid colour, taking `scale` of the width. */
async function tile(art, size, scale, background) {
  const inner = Math.round(size * scale);
  const picture = await sharp(art).resize({ width: inner, height: inner, fit: 'inside' }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: picture, gravity: 'centre' }])
    .flatten({ background })
    .png()
    .toBuffer();
}

async function iconSet(art, prefix, dir, background) {
  const files = {
    [`${prefix}-192.png`]: await tile(art, 192, 0.8, background),
    [`${prefix}-512.png`]: await tile(art, 512, 0.8, background),
    // Maskable: the picture stays inside the middle 60%, so a phone's round or squircle mask never cuts it.
    [`${prefix}-maskable-512.png`]: await tile(art, 512, 0.58, background),
    [`${prefix}-apple.png`]: await tile(art, 180, 0.82, background),
  };
  for (const [name, buffer] of Object.entries(files)) writeFileSync(`${dir}/${name}`, buffer);
}

const manifest = ({ name, short, description, base }) => ({
  id: '/',
  name,
  short_name: short,
  description,
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  lang: 'en',
  background_color: PAPER,
  theme_color: PAPER,
  categories: ['lifestyle', 'beauty'],
  icons: [
    { src: `${base}-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: `${base}-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: `${base}-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
});

// looksmenu itself: the favicon mark on its navy tile.
const mark = readFileSync('public/favicon.svg');
await iconSet(mark, 'looksmenu', 'public/icons', NAVY);
writeFileSync(
  'public/manifest.webmanifest',
  JSON.stringify(manifest({ name: 'looksmenu', short: 'looksmenu', description: 'A style and service catalogue for barber shops and beauty parlours.', base: '/icons/looksmenu' }), null, 2),
);

// Every shop: its logo on white (or the looksmenu mark if it has no logo yet).
const store = JSON.parse(readFileSync('public/shops/shops.json', 'utf8'));
let count = 0;
for (const [slug, shop] of Object.entries(store.shops ?? {})) {
  const logoFile = shop.logo ? `public/shops/${shop.logo}` : undefined;
  const hasLogo = logoFile && existsSync(logoFile);
  await iconSet(hasLogo ? readFileSync(logoFile) : mark, slug, 'public/shops/icons', hasLogo ? WHITE : NAVY);
  const short = shop.short ?? shop.shop.split(/\s+/)[0].slice(0, 12);
  writeFileSync(
    `public/shops/manifests/${slug}.webmanifest`,
    JSON.stringify(manifest({ name: shop.shop, short, description: `${shop.shop}: pick your style, show it to your barber.`, base: `/shops/icons/${slug}` }), null, 2),
  );
  count++;
}
console.log(`Wrote the looksmenu install files and ${count} shop${count === 1 ? '' : 's'}`);
