// Customer-flow smoke test in a real browser at phone width.
// Usage: npm run build && npm run preview, then: node scripts/smoke.mjs [base-url]
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 360, height: 780 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

let failed = 0;
async function check(name, fn) {
  try {
    await fn();
    console.log(`  ok    ${name}`);
  } catch (e) {
    failed++;
    console.log(`  FAIL  ${name}\n        ${e.message.split('\n')[0]}`);
  }
}
const expectText = async (locator, text) => {
  await locator.filter({ hasText: text }).first().waitFor({ timeout: 3000 });
};
const toast = (text) => expectText(page.locator('#pl-toast:not([hidden])'), text);
const counter = (name) => page.locator(`[data-counter="${name}"]`).textContent();
const go = (path) => page.goto(base + path, { waitUntil: 'load' });

await go('/styles/low-fade');

await check('Add to My Look fills the hair slot', async () => {
  await page.click('[data-add]');
  await toast('Added to My Look');
  if ((await counter('my-look')) !== '1') throw new Error('My Look counter is not 1');
  await expectText(page.locator('[data-add-label]'), 'In My Look');
});

await check('Heart saves to Favourites', async () => {
  await page.click('[data-save="H07"] >> nth=0');
  await toast('Saved to Favourites');
  if ((await counter('favourites')) !== '1') throw new Error('Favourites counter is not 1');
});

await check('Replacing a slot says what changed', async () => {
  await go('/styles/taper-cut');
  await page.click('[data-add]');
  await toast('Hair changed to Taper Cut');
});

await check('A beard with its own moustache blocks a moustache style', async () => {
  await go('/beards/van-dyke');
  await page.click('[data-add]');
  await go('/moustaches/chevron');
  await page.click('[data-add]');
  await toast('This beard already has a moustache.');
});

await check('My Look shows the locked moustache', async () => {
  await go('/my-look');
  await expectText(page.locator('li'), 'Part of your beard style');
});

await check('A Ready Look asks before replacing, then fills its slots', async () => {
  await go('/looks/easy-everyday');
  await page.click('[data-add]');
  await page.locator('#pl-confirm[open]').waitFor({ timeout: 3000 });
  await page.click('#pl-confirm button[value="yes"]');
  await toast('Added to My Look');
  if ((await counter('my-look')) !== '2') throw new Error('expected 2 filled slots');
});

await check('Barber Card follows the trim-to-match rule', async () => {
  await go('/barber-card');
  await expectText(page.locator('main'), 'Crew Cut');
  await expectText(page.locator('main'), 'Moustache: trim to match the beard.');
  await expectText(page.locator('main'), 'No change. Leave as it is.');
});

await check('Favourites lists the saved style', async () => {
  await go('/favourites');
  await expectText(page.locator('main li'), 'Low Fade');
});

await check('About you goes one question at a time', async () => {
  await go('/about-you?from=/beards');
  const step = (text) => page.locator('fieldset.is-current h2', { hasText: text }).waitFor({ timeout: 3000 });
  await step('face shape');
  if (await page.locator('[data-show]').isVisible()) throw new Error('Show styles visible on step 1');
  await page.click('[data-next]');
  await step('hair type');
  await page.click('label:has(input[name="hairType"][value="Straight"])'); // a tap moves on by itself
  await step('How much hair');
  await page.click('[data-prev]');
  await step('hair type');
  await page.click('[data-next]');
  await page.click('[data-next]');
  await step('beard grow');
  await page.click('label:has(input[name="growth"][value="Patchy"])');
  await step('skin tone');
  await page.click('[data-next]');
  await step('grey hair');
  if (!(await page.locator('[data-show]').isVisible())) throw new Error('Show styles missing on the last step');
});

await check('About you answers sort the list and show badges', async () => {
  if ((await page.getAttribute('[data-show]', 'href')) !== '/beards') throw new Error('Show styles does not return to /beards');
  await go('/beards');
  const first = page.locator('[data-item-list] > li').first();
  if (await first.locator('[data-suits-badge]').isHidden()) throw new Error('first card has no Suits you badge');
  await page.locator('[data-sorted-note]:not([hidden])').waitFor({ timeout: 3000 });
  await expectText(page.locator('[data-answers-label]'), 'Edit');
});

// Every real answer combination matches at least one style, so force an impossible one.
await check('No results offers to clear answers', async () => {
  await page.evaluate(() => sessionStorage.setItem('pl:answers', JSON.stringify({ face: 'Triangle' })));
  await go('/beards');
  await page.locator('[data-no-results]:not([hidden])').waitFor({ timeout: 3000 });
  await page.click('[data-clear-answers]');
  await page.locator('[data-no-results][hidden]').waitFor({ state: 'attached', timeout: 3000 });
});

await check('Keeps working offline after the first visit', async () => {
  await go('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await go('/styles/low-fade'); // stored as it's opened
  await page.context().setOffline(true);
  try {
    await go('/barber-card');
    await expectText(page.locator('main'), 'For the');
    await expectText(page.locator('#pl-offline:not([hidden])'), 'No internet. Showing saved styles.');
    await go('/styles/low-fade');
    await expectText(page.locator('h1'), 'Low Fade');
    await go('/beards/goatee'); // never opened, so the offline page answers
    await expectText(page.locator('h1'), 'No internet.');
  } finally {
    await page.context().setOffline(false);
  }
});

await check('No script errors', async () => {
  if (errors.length) throw new Error(errors.join(' | '));
});

// Chromium can hang on close on Windows; don't let that block the result.
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 3000))]);
console.log(failed ? `\n${failed} check(s) failed.` : '\nAll checks passed.');
process.exit(failed ? 1 : 0);
