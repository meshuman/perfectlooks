// Every translatable string in the site, with its current English: the screen text in en.json,
// then the catalogue and Learn content imported into src/content. Read from disk, so build
// scripts and the site see the same list.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { itemStrings, postStrings } from './content-keys.mjs';

const ROOT = process.cwd();
const read = (...parts) => readFileSync(join(ROOT, ...parts), 'utf8');

/** A Learn post file: JSON-valued frontmatter lines, then the Markdown body. */
function readPost(file) {
  const text = read('src/content/learn', file).replace(/\r\n/g, '\n');
  const [, front, body] = text.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  const data = Object.fromEntries(
    front.split('\n').map((line) => {
      const i = line.indexOf(': ');
      return [line.slice(0, i), JSON.parse(line.slice(i + 2))];
    }),
  );
  return { ...data, body: body.trimEnd() };
}

let cache;

/** [{ key, where, english, note }], in sheet order: screen text, then catalogue, then Learn. */
export function allStrings() {
  if (cache) return cache;
  const ui = Object.entries(JSON.parse(read('src/i18n/en.json'))).map(([key, english]) => ({
    key,
    where: `Screen text: ${key.split('.')[0]}`,
    english,
    note: /\{\w+\}/.test(english) ? 'Keep the {words in braces}: the app fills them in.' : undefined,
  }));
  const items = ['hair', 'beards', 'moustaches', 'colours', 'looks'].flatMap((name) =>
    JSON.parse(read('src/content', `${name}.json`)).flatMap(itemStrings),
  );
  const posts = readdirSync(join(ROOT, 'src/content/learn'))
    .filter((f) => f.endsWith('.md'))
    .map(readPost)
    .sort((a, b) => a.code.localeCompare(b.code))
    .flatMap(postStrings);
  cache = [...ui, ...items, ...posts];
  return cache;
}
