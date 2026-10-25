// Writes image-prompts/ready-to-paste.md: the two character references and the clean prompt
// for every item, exactly as the prompt sheet's Copy clean button gives them.
// Usage: npm run build && npm run prompts
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const html = readFileSync('dist/dev/prompts.html', 'utf8');
const unescape = (s) =>
  s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x2F;/g, '/')
    .replace(/&amp;/g, '&');

// The sheet stores each prompt in a data-copy attribute; the clean one is on the first button.
const copies = [...html.matchAll(/data-copy="([^"]*)"/g)].map((m) => unescape(m[1]));
const [character, older] = copies;
const clean = copies.filter((text) => /^Photorealistic studio image/.test(text) && /No callouts, lines, dots or text\.$/.test(text));

const items = clean.map((text) => {
  const [, id, name] = text.match(/^ITEM: ([HBMCL]\d{2}) (.+)$/m);
  return { id, name, text, older: /OLDER VERSION/.test(text) };
});
if (items.length !== 136) throw new Error(`expected 136 clean prompts, found ${items.length}`);

const groups = { H: 'Hair styles', B: 'Beards', M: 'Moustaches', C: 'Hair colours', L: 'Ready Looks' };
const out = [
  '# Image prompts: ready to paste',
  '',
  'Generated from the Image prompts document by `npm run prompts`. Do not edit by hand.',
  '',
  'Make the character reference first and attach it to every prompt (the older one where marked).',
  'Save each image as `src/assets/catalogue/ID.jpg`, for example `H01.jpg`.',
  '',
  '## Character reference',
  '',
  '```text',
  character,
  '```',
  '',
  '## Character reference: older version (items marked Older)',
  '',
  '```text',
  older,
  '```',
];
for (const [prefix, title] of Object.entries(groups)) {
  out.push('', `## ${title}`);
  for (const item of items.filter((i) => i.id[0] === prefix)) {
    out.push('', `### ${item.id} ${item.name}${item.older ? ' (attach the older reference)' : ''}`, '', `Save as \`${item.id}.jpg\``, '', '```text', item.text, '```');
  }
}

mkdirSync('image-prompts', { recursive: true });
writeFileSync('image-prompts/ready-to-paste.md', out.join('\n') + '\n');
console.log(`Wrote image-prompts/ready-to-paste.md: 2 character references, ${items.length} item prompts`);
