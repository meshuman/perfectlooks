// Writes the looksmenu icons and social preview into public/ from the logo:
//   favicon.svg, apple-touch-icon.png (180), icon-512.png (structured-data logo), og-default.png (1200x630).
// The icons use the traced mark in src/data/brand-marks.mjs; the social preview is the supplied logo artwork
// in brand/logo-source.jpg, cropped. Re-run after changing either. Usage: npm run brand
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { BRAND_CORAL, BRAND_NAVY, menuMark } from '../src/data/brand-marks.mjs';

// Favicon: pure paths, so it needs no font. The mark sits on the logo's navy.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="${BRAND_NAVY}"/><g transform="translate(14 14) scale(.72)">${menuMark(BRAND_CORAL)}</g></svg>\n`;
writeFileSync('public/favicon.svg', favicon);

const icon = (size) => `<!doctype html><html><head><style>*{margin:0}body{width:${size}px;height:${size}px}</style></head>
<body>${favicon.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`;

const browser = await chromium.launch();
const shots = [
  { html: icon(180), size: [180, 180], path: 'public/apple-touch-icon.png' },
  { html: icon(512), size: [512, 512], path: 'public/icon-512.png' },
];
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.size[0], height: shot.size[1] } });
  await page.setContent(shot.html, { waitUntil: 'load' });
  await page.screenshot({ path: shot.path });
  await page.close();
}

// Social preview: the logo artwork on its navy, cropped to 1200 x 630.
await sharp('brand/logo-source.jpg').resize(1200, 630, { fit: 'cover', position: 'centre' }).png().toFile('public/og-default.png');

console.log('Wrote public/favicon.svg, apple-touch-icon.png, icon-512.png, og-default.png');
// Chromium can hang on close on Windows; don't let that block the result.
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 3000))]);
process.exit(0);
