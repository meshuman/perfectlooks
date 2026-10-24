// Low-end Android QA: cold page loads on a budget-phone profile, plus an accessibility scan.
// Usage: npm run build && npm run preview, then: npm run qa [base-url]
import { chromium, devices } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.argv[2] ?? 'http://localhost:4321';
const PAGES = [
  '/',
  '/styles',
  '/styles/low-fade',
  '/colours/natural-black',
  '/looks/bold-balbo',
  '/learn',
  '/learn/cover-grey-hair',
  '/about-you',
  '/favourites',
  '/my-look',
  '/barber-card',
  '/shops/kgf-unisex-saloon',
  '/offline',
  // Nepali and Hindi: longer words and Devanagari can break layouts that English doesn't.
  '/ne',
  '/ne/styles/low-fade',
  '/ne/about-you',
  '/ne/learn/clipper-numbers',
  '/hi',
  '/hi/colours/natural-black',
  '/hi/my-look',
  '/hi/shops/kgf-unisex-saloon',
];

// Budgets from the plan: LCP under 2.5 s on 4G, under 40 KB of JavaScript per page.
const BUDGET = { lcp: 2500, cls: 0.1, jsKB: 40 };

// A budget Android phone on a slow 4G connection.
const PHONE = { ...devices['Moto G4'], viewport: { width: 360, height: 640 } };
const NETWORK = { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 };
const CPU_SLOWDOWN = 4;

const browser = await chromium.launch();
const rows = [];
const a11y = [];
let failed = 0;

for (const path of PAGES) {
  // A fresh context per page: nothing cached, like a first visit from the QR code.
  const context = await browser.newContext(PHONE);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', NETWORK);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });

  await page.addInitScript(() => {
    window.__lcp = 0;
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.__lcp = e.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(base + path, { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const m = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const res = performance.getEntriesByType('resource');
    const kb = (list) => Math.round(list.reduce((sum, r) => sum + (r.encodedBodySize || 0), 0) / 1024);
    const fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0;
    return {
      fcp: Math.round(fcp),
      lcp: Math.round(window.__lcp),
      cls: Math.round(window.__cls * 1000) / 1000,
      totalKB: Math.round((nav.encodedBodySize || 0) / 1024) + kb(res),
      jsKB: kb(res.filter((r) => r.name.endsWith('.js'))),
    };
  });
  const over = [m.lcp > BUDGET.lcp && 'LCP', m.cls > BUDGET.cls && 'CLS', m.jsKB > BUDGET.jsKB && 'JS'].filter(Boolean);
  if (over.length) failed++;
  rows.push({ page: path, ...m, budget: over.length ? `over: ${over.join(', ')}` : 'ok' });

  // Accessibility: show any scroll-reveal content first, so it's scanned as people see it.
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await page.evaluate(() => document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in')));
  await page.waitForTimeout(1000);
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  for (const v of result.violations) {
    a11y.push({ page: path, rule: v.id, impact: v.impact, count: v.nodes.length, example: v.nodes[0]?.target.join(' ') });
  }
  await context.close();
}

console.log(`\nBudget phone, slow 4G (${NETWORK.latency} ms, 1.6 Mbps), CPU ${CPU_SLOWDOWN}x slower. Times in ms, sizes in KB transferred.`);
console.table(rows);
if (a11y.length) {
  failed++;
  console.log('\nAccessibility issues (WCAG 2.2 AA):');
  console.table(a11y);
} else {
  console.log('\nAccessibility: no WCAG 2.2 AA issues found by axe.');
}

// Chromium can hang on close on Windows; don't let that block the result.
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 3000))]);
process.exit(failed ? 1 : 0);
