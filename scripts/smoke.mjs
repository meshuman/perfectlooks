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

await check('Reset clears the preferences next to Edit', async () => {
  await page.evaluate(() => sessionStorage.clear());
  await go('/beards');
  const reset = page.locator('[data-answers-reset]').first();
  if (await reset.isVisible()) throw new Error('Reset shows before any preference is set');
  await page.evaluate(() => sessionStorage.setItem('pl:answers', JSON.stringify({ face: 'Round' })));
  await go('/beards');
  await reset.waitFor({ state: 'visible', timeout: 3000 });
  await reset.click();
  await reset.waitFor({ state: 'hidden', timeout: 3000 });
  await expectText(page.locator('[data-answers-label]'), 'Find what suits you');
  if ((await page.evaluate(() => sessionStorage.getItem('pl:answers'))) !== '{}') throw new Error('answers were not cleared');
  // The same button sits in the verdict on a detail page.
  await page.evaluate(() => sessionStorage.setItem('pl:answers', JSON.stringify({ face: 'Round' })));
  await go('/styles/quiff');
  await page.locator('[data-verdict] [data-state-for="yes"] [data-answers-reset]').click();
  await page.locator('[data-verdict] [data-state-for="ask"]:not([hidden])').waitFor({ timeout: 3000 });
});

// The face shape filter hides styles that don't suit the picked shape, and carries across the three lists.
await check('Face shape filter hides styles that do not suit it', async () => {
  await page.evaluate(() => sessionStorage.clear());
  await go('/styles');
  const rows = page.locator('[data-item-list] > li');
  const total = await rows.count();
  await page.click('[data-face-chip="Round"]');
  await page.locator('[data-face-note]:not([hidden])').waitFor({ timeout: 3000 });
  const shown = await page.locator('[data-item-list] > li:not([hidden])').count();
  if (!(shown > 0 && shown < total)) throw new Error(`Round shows ${shown} of ${total}`);
  const bad = await page.$$eval('[data-item-list] > li:not([hidden]) [data-match]', (cards) => cards.filter((c) => !JSON.parse(c.dataset.match).face.includes('Round')).length);
  if (bad) throw new Error(`${bad} visible style(s) do not suit a round face`);
  await expectText(page.locator('[data-count]'), `${shown} of ${total}`);
  if ((await page.getAttribute('[data-face-chip="Round"]', 'aria-pressed')) !== 'true') throw new Error('chip not pressed');
  // Carries to the other lists, then clears with All.
  await go('/beards');
  if ((await page.getAttribute('[data-face-chip="Round"]', 'aria-pressed')) !== 'true') throw new Error('filter lost on /beards');
  await page.click('[data-face-chip=""]');
  const after = await page.locator('[data-item-list] > li:not([hidden])').count();
  if (after !== (await page.locator('[data-item-list] > li').count())) throw new Error('All does not show every style');
});

// The detail page tells the visitor whether a style suits their answers, and outlines their own face shape.
await check('Detail page gives a personal verdict', async () => {
  await page.evaluate(() => sessionStorage.clear());
  await go('/styles/quiff');
  await page.locator('[data-verdict] [data-state-for="ask"]:not([hidden])').waitFor({ timeout: 3000 });
  await page.evaluate(() => sessionStorage.setItem('pl:answers', JSON.stringify({ face: 'Long' })));
  await go('/styles/quiff');
  await page.locator('[data-verdict] [data-state-for="no"]:not([hidden])').waitFor({ timeout: 3000 });
  await expectText(page.locator('[data-verdict-reasons]'), 'face');
  await page.locator('[data-fit-option="Long"][data-you]').waitFor({ timeout: 3000 });
  await page.evaluate(() => sessionStorage.setItem('pl:answers', JSON.stringify({ face: 'Round' })));
  await go('/styles/quiff');
  await page.locator('[data-verdict] [data-state-for="yes"]:not([hidden])').waitFor({ timeout: 3000 });
  if (await page.locator('figure [data-suits-badge]').isHidden()) throw new Error('no Suits you badge on the photo');
});

// The home page's face shape row opens the list already filtered.
await check('Face shape on the home page filters the list', async () => {
  await page.evaluate(() => sessionStorage.clear());
  await go('/');
  await page.click('a[href="/styles?face=Round"]');
  await page.locator('[data-face-chip="Round"][aria-pressed="true"]').waitFor({ timeout: 3000 });
  const total = await page.locator('[data-item-list] > li').count();
  const shown = await page.locator('[data-item-list] > li:not([hidden])').count();
  if (!(shown > 0 && shown < total)) throw new Error(`Round shows ${shown} of ${total}`);
});

// The feedback form needs a rating, then hands one readable message to WhatsApp, addressed to the shop.
await check('Feedback form sends the answers to the shop on WhatsApp', async () => {
  await go('/feedback');
  await page.click('[data-feedback-submit]');
  await page.locator('[data-feedback-status]:not([hidden])').waitFor({ timeout: 3000 });
  await page.locator('label:has(input[name="rating"][value="4"])').click();
  await page.locator('label:has(input[name="goal"][value="barber"])').click();
  await page.locator('label:has(input[name="helped"][value="some"])').click();
  await page.locator('label:has(input[name="better"][value="photos"])').click();
  await page.fill('[name="comment"]', 'Please add prices');
  await page.fill('[name="name"]', 'Test');
  // Catch the request the new tab makes to wa.me (no real WhatsApp needed) and read the message from it.
  let sent = '';
  await page.context().route('https://wa.me/**', (route) => {
    sent = route.request().url();
    return route.fulfill({ status: 200, contentType: 'text/html', body: 'ok' });
  });
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.click('[data-feedback-submit]')]);
  await popup.waitForLoadState('load').catch(() => {});
  const url = decodeURIComponent(sent);
  await popup.close().catch(() => {});
  await page.context().unroute('https://wa.me/**');
  for (const part of ['wa.me/9779818879895', 'Rating: 4/5', 'Hoping to: Show my barber', 'Helped me decide: A little', 'Could be better: More photos', 'Comment: Please add prices', 'Reply to: Test'])
    if (!url.includes(part)) throw new Error(`message is missing "${part}"`);
  await page.locator('[data-feedback-done]:not([hidden])').waitFor({ timeout: 3000 });
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
