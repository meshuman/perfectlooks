import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 900 } });
await p.goto('http://localhost:4321/beards');
await p.waitForTimeout(1000);
await p.screenshot({ path: process.argv[2], fullPage: false });
await b.close();
