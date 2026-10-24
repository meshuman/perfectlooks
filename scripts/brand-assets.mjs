// Writes the KGF icons and social preview into public/ from the shared brand marks:
//   favicon.svg, apple-touch-icon.png (180), icon-512.png (structured-data logo), og-default.png (1200x630).
// Re-run after changing the marks or the shop name. Usage: npm run brand
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BRAND_RED, kgfBlock, scissorsMark } from '../src/data/brand-marks.mjs';

// Embedded as a data URL: a page set from memory may not load local files.
const jost = `data:font/woff2;base64,${readFileSync(resolve('node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2')).toString('base64')}`;
const fontFace = `@font-face { font-family: Brand; src: url(${jost}); font-weight: 100 900; }`;

// Favicon: pure paths, so it needs no font.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${BRAND_RED}"/><g transform="translate(6 6) scale(.88)">${scissorsMark()}</g></svg>\n`;
writeFileSync('public/favicon.svg', favicon);

const icon = (size) => `<!doctype html><html><head><style>${fontFace}*{margin:0}body{width:${size}px;height:${size}px}</style></head>
<body>${favicon.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`;

const og = `<!doctype html><html><head><style>
${fontFace}
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #f7f4f0; color: #111; font-family: Brand; display: grid; grid-template-columns: 470px 1fr; }
.panel { background: ${BRAND_RED}; display: grid; place-items: center; }
.copy { padding: 64px 72px; display: flex; flex-direction: column; }
.lockup { display: flex; align-items: center; gap: 22px; }
.lockup svg { width: 200px; display: block; }
.name { display: flex; flex-direction: column; font-weight: 600; font-size: 24px; line-height: 1.1; letter-spacing: .14em; text-transform: uppercase; }
h1 { margin-top: auto; font-weight: 600; font-size: 60px; line-height: 1.08; letter-spacing: -.01em; }
.foot { margin-top: 22px; font-size: 22px; color: #67625d; letter-spacing: .02em; }
.cta { margin-top: 26px; display: inline-flex; align-self: flex-start; background: #111; color: #fff; font-size: 22px; font-weight: 500; letter-spacing: .04em; padding: 18px 30px; }
</style></head><body>
<div class="panel"><svg width="300" height="300" viewBox="0 0 100 100">${scissorsMark()}</svg></div>
<div class="copy">
  <div class="lockup">${kgfBlock({ font: 'Brand' })}<div class="name"><span>Unisex</span><span>Saloon</span></div></div>
  <h1>Pick your style.<br>Show it to the barber.</h1>
  <p class="foot">Narephat, Kathmandu · Open daily, 7 am – 8 pm</p>
  <span class="cta">Find styles that suit you</span>
</div>
</body></html>`;

const browser = await chromium.launch();
const shots = [
  { html: icon(180), size: [180, 180], path: 'public/apple-touch-icon.png' },
  { html: icon(512), size: [512, 512], path: 'public/icon-512.png' },
  { html: og, size: [1200, 630], path: 'public/og-default.png' },
];
for (const shot of shots) {
  const page = await browser.newPage({ viewport: { width: shot.size[0], height: shot.size[1] } });
  await page.setContent(shot.html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: shot.path });
  await page.close();
}
console.log('Wrote public/favicon.svg, apple-touch-icon.png, icon-512.png, og-default.png');
// Chromium can hang on close on Windows; don't let that block the result.
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 3000))]);
process.exit(0);
