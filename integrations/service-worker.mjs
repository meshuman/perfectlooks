// Writes dist/sw.js after each build, with the files to keep on the phone for offline use.
// The version changes whenever a stored file or page changes, so phones pick up updates.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Pages stored on install: the ones a customer needs mid-visit if the Wi-Fi drops. */
const PAGES = [
  '/',
  '/styles',
  '/beards',
  '/moustaches',
  '/colours',
  '/looks',
  '/learn',
  '/my-look',
  '/favourites',
  '/barber-card',
  '/about-you',
  '/offline',
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const pageFile = (root, path) => join(root, path === '/' ? 'index.html' : `${path.slice(1)}.html`);

export default function serviceWorker() {
  return {
    name: 'perfect-looks:service-worker',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const toUrl = (file) => '/' + relative(root, file).split(sep).join('/');

        // Scripts, styles and the Latin font files. Other font subsets (Vietnamese, Cyrillic,
        // Devanagari) are cached the first time a page needs them.
        const assets = walk(join(root, '_astro'))
          .map(toUrl)
          .filter((url) => /\.(js|css)$/.test(url) || /-latin-(wght|400)-(normal|italic)\.[\w-]+\.woff2$/.test(url));

        const missing = PAGES.filter((path) => !existsSync(pageFile(root, path)));
        if (missing.length) throw new Error(`service worker: pages not built: ${missing.join(', ')}`);

        const precache = [...PAGES, ...assets, '/favicon.svg'];
        const hash = createHash('sha256');
        for (const path of PAGES) hash.update(readFileSync(pageFile(root, path)));
        for (const url of precache) hash.update(url);
        const version = hash.digest('hex').slice(0, 12);

        const template = readFileSync(new URL('./sw-template.js', import.meta.url), 'utf8');
        writeFileSync(
          join(root, 'sw.js'),
          template.replace('__VERSION__', version).replace('/* __PRECACHE__ */ []', JSON.stringify(precache, null, 2)),
        );
        logger.info(`sw.js written: ${precache.length} files stored for offline use (version ${version})`);
      },
    },
  };
}
