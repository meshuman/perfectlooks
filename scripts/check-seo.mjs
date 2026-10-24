// Checks every built page against the SEO document's rules.
// Usage: npm run build && npm run check:seo
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = process.env.PL_DIST ?? 'dist';
const errors = [];
const warnings = [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

// Pages are built one file each (build.format 'file'): styles/low-fade.html is /styles/low-fade.
const urlPath = (file) => {
  const rel = relative(DIST, file).split(sep).join('/').replace(/\.html$/, '');
  return rel === 'index' ? '/' : `/${rel}`;
};

const files = walk(DIST);
const pages = new Map(files.map((f) => [urlPath(f), readFileSync(f, 'utf8')]));

const attr = (html, re) => html.match(re)?.[1];
const decode = (s) => s?.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"');

// Required fields per structured data type (Google's documented basics).
const REQUIRED = {
  Article: ['headline', 'author', 'datePublished', 'dateModified', 'image'],
  BreadcrumbList: ['itemListElement'],
  HairSalon: ['name', 'address', 'telephone', 'openingHoursSpecification', 'url'],
  WebSite: ['name', 'url'],
};

const sitemapFiles = readdirSync(DIST).filter((f) => /^sitemap-\d+\.xml$/.test(f));
const inSitemap = new Set(
  sitemapFiles.flatMap((f) => [...readFileSync(join(DIST, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/')),
);

let structuredCount = 0;
for (const [path, html] of pages) {
  const where = path;
  const noindex = /<meta name="robots" content="noindex"/.test(html);
  const title = decode(attr(html, /<title>([^<]*)<\/title>/));
  const description = decode(attr(html, /<meta name="description" content="([^"]*)"/));
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;

  if (!title) errors.push(`${where}: no <title>`);
  if (!description) errors.push(`${where}: no meta description`);
  else if (description.length > 160) warnings.push(`${where}: description is ${description.length} characters`);
  // Private pages render their heading in the browser, so only indexable pages are checked.
  if (h1s !== 1 && !noindex) warnings.push(`${where}: ${h1s} h1 elements`);
  if (!/property="og:image"/.test(html)) errors.push(`${where}: no og:image`);

  // The canonical URL must be this page's own clean address (no ".html").
  const canonical = attr(html, /<link rel="canonical" href="([^"]+)"/);
  if (canonical && new URL(canonical).pathname !== path) errors.push(`${where}: canonical points to ${new URL(canonical).pathname}`);
  const ogUrl = attr(html, /property="og:url" content="([^"]+)"/);
  if (ogUrl && new URL(ogUrl).pathname !== path) errors.push(`${where}: og:url points to ${new URL(ogUrl).pathname}`);

  if (noindex) {
    if (inSitemap.has(path)) errors.push(`${where}: noindex page is in the sitemap`);
  } else {
    if (!/<link rel="canonical"/.test(html)) errors.push(`${where}: no canonical link`);
    if (!inSitemap.has(path)) errors.push(`${where}: indexable page missing from the sitemap`);
  }

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(json);
    } catch {
      errors.push(`${where}: structured data is not valid JSON`);
      continue;
    }
    for (const block of [data].flat()) {
      structuredCount++;
      const type = block['@type'];
      for (const key of REQUIRED[type] ?? []) {
        if (block[key] === undefined || block[key] === '') errors.push(`${where}: ${type} is missing "${key}"`);
      }
      // Headlines must match the page's visible h1.
      if (type === 'Article') {
        const h1 = decode(attr(html, /<h1[^>]*>([\s\S]*?)<\/h1>/)?.replace(/<[^>]+>/g, '').trim());
        if (h1 !== block.headline) errors.push(`${where}: Article headline "${block.headline}" doesn't match the h1 "${h1}"`);
      }
    }
  }

  // hreflang links must point to built pages.
  for (const [, href] of html.matchAll(/<link rel="alternate" hreflang="[^"]+" href="([^"]+)"/g)) {
    const target = new URL(href).pathname.replace(/\/$/, '') || '/';
    if (!pages.has(target)) errors.push(`${where}: hreflang points to missing page ${target}`);
  }

  // On a Nepali or Hindi page, internal links stay in that language.
  const lang = path.match(/^\/(ne|hi)(\/|$)/)?.[1];

  // Internal links must point to a built page. Language-switch links (marked hreflang) may change language.
  for (const [tag, href] of html.matchAll(/<a[^>]*?href="(\/[^"#?]*)[^>]*>/g)) {
    const switchesLanguage = /\shreflang="/.test(tag);
    const target = href.replace(/\/$/, '') || '/';
    if (/\.(svg|png|xml|txt|css|js|webp|ico)$/.test(target) || target.startsWith('/_astro')) continue;
    if (!pages.has(target)) errors.push(`${where}: broken link to ${target}`);
    if (lang && !switchesLanguage && !target.startsWith(`/${lang}`) && !/^\/(dev|offline)(\/|$)/.test(target)) {
      errors.push(`${where}: link leaves ${lang} for ${target}`);
    }
  }
}

if (!existsSync(join(DIST, 'robots.txt'))) errors.push('robots.txt is missing');
else {
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
  for (const bot of ['Googlebot', 'GPTBot', 'PerplexityBot']) {
    if (!robots.includes(`User-agent: ${bot}\nAllow: /`)) errors.push(`robots.txt does not allow ${bot}`);
  }
  if (!/Sitemap: https?:\/\//.test(robots)) errors.push('robots.txt has no sitemap line');
}

const unique = (list) => [...new Set(list)];
for (const w of unique(warnings)) console.warn(`  warn  ${w}`);
for (const e of unique(errors)) console.error(`  error ${e}`);
console.log(
  `\n${pages.size} pages, ${inSitemap.size} in the sitemap, ${structuredCount} structured data blocks. ` +
    `${unique(errors).length} error(s), ${unique(warnings).length} warning(s).`,
);
process.exit(errors.length ? 1 : 0);
