// Phone-width screenshots for visual QA.
// Usage: node scripts/screenshots.mjs <base-url> <out-dir> [path ...]   (run `npm run preview` first)
import { chromium } from '@playwright/test';

const [base = 'http://localhost:4321', outDir = '.', ...paths] = process.argv.slice(2);
const pages = paths.length
  ? paths.map((p) => [p.replace(/^\//, '').replace(/\//g, '-') || 'home', p])
  : [
      ['home', '/'],
      ['components', '/dev/components'],
    ];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1 });
for (const [name, path] of pages) {
  await page.goto(base + path, { waitUntil: 'load' });
  // Let the entrance animations finish, and show scroll-reveal content that a
  // full-page capture never scrolls to.
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/${name}-fold.png` });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/${name}-full.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, 'horizontal overflow px:', overflow);

  // One image per section, so long pages can be checked at full size.
  // The fixed bars would cover parts of each section, so hide them here.
  await page.addStyleTag({ content: 'header, nav[aria-label="Main"] { display: none !important; }' });
  const sections = await page.locator('main > section').all();
  for (const [i, section] of sections.entries()) {
    await section.screenshot({ path: `${outDir}/${name}-section-${i + 1}.png` });
  }
}
// Chromium can hang on close on Windows; don't let that block the result.
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 3000))]);
process.exit(0);
