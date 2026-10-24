// Imports the catalogue documents in content-source/ into src/content/.
// Usage: npm run import   (re-run whenever the documents change)
//
// Catalogue items become one JSON array per category. Learn posts become one
// Markdown file each, so Astro renders their tables and lists.
// Errors stop the import. Warnings are printed for a person to review.
import { readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'content-source';
const OUT = 'src/content';

const FACES = ['Oval', 'Round', 'Square', 'Long', 'Heart'];
const HAIR_TYPES = ['Straight', 'Wavy', 'Curly'];
const GROWTH = ['Patchy', 'Medium', 'Full'];
const SKINS = ['Light', 'Medium', 'Deep'];
const GREYS = ['None', 'Some', 'Lots'];
const UPKEEP = ['Low', 'Medium', 'High'];
const TOPICS = ['Face shape', 'Haircuts', 'Beard', 'Colour', 'Care', 'Talk to your barber'];
const EXPECTED = { hair: 42, beards: 16, moustaches: 12, colours: 12, looks: 25, learn: 13 };

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

// ---------- Markdown helpers ----------

const read = (name) => readFileSync(join(SRC, name), 'utf8').replace(/\r\n/g, '\n');

const unescape = (s) => s.replace(/\\([[\]*_#|])/g, '$1');

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Inline Markdown (links and bold) to HTML, for FAQ answers and source lines. */
const inlineHtml = (md) =>
  escapeHtml(unescape(md.trim()))
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

/** Text for fields that should hold no Markdown. Warns if some slipped in. */
function plain(md, where) {
  const s = unescape(md).trim();
  if (/\[[^\]]+\]\(|\*\*/.test(s)) warn(`${where}: Markdown in a plain-text field: "${s}"`);
  return s.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '');
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Splits a document into "## " sections. */
function sections(text) {
  const out = [];
  let current = null;
  for (const line of text.split('\n')) {
    if (line.startsWith('## ')) {
      current = { heading: line.slice(3).trim(), lines: [] };
      out.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }
  return out;
}

/** Parses the first Markdown table in a section into row objects keyed by header. */
function table(lines) {
  const rows = lines.filter((l) => l.trim().startsWith('|'));
  const cells = (l) =>
    l
      .trim()
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => unescape(c.trim()));
  const head = cells(rows[0]);
  return rows.slice(2).map((r) => Object.fromEntries(cells(r).map((c, i) => [head[i], c])));
}

/** The "At a glance" table, keyed by item ID. */
function glance(secs, file) {
  const sec = secs.find((s) => s.heading === 'At a glance');
  if (!sec) {
    err(`${file}: no "At a glance" table`);
    return {};
  }
  const byId = {};
  for (const row of table(sec.lines)) {
    const id = Object.values(row)[0].match(/^([HBMCL]\d{2})\b/)?.[1];
    if (id) byId[id] = row;
  }
  return byId;
}

/** "All" / "Any" expand to every option. Otherwise a comma list, checked against the options. */
function list(value, options, where, anyWord = 'All') {
  if (!value) {
    err(`${where}: empty`);
    return [];
  }
  if (value === anyWord || value === 'All' || value === 'Any') return [...options];
  const items = value.split(/,\s*/);
  for (const v of items) if (!options.includes(v)) err(`${where}: unknown value "${v}"`);
  return items;
}

function oneOf(value, options, where) {
  if (!options.includes(value)) err(`${where}: "${value}" is not one of ${options.join(', ')}`);
  return value;
}

// ---------- Catalogue items ----------

/** Parses one "## H01 Buzz Cut" section into its raw parts. */
function parseItem(sec, file) {
  const m = sec.heading.match(/^([HBMCL]\d{2})\s+(.+)$/);
  if (!m) return null;
  const [, id, name] = m;
  const item = { id, name: unescape(name), fields: {}, faq: [], steps: [], notes: [] };
  let mode = 'head';
  for (const raw of sec.lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line === '**FAQ**') {
      mode = 'faq';
      continue;
    }
    if (line === '**Barber steps**') {
      mode = 'steps';
      continue;
    }
    const desc = line.match(/^\*\*Description:\*\*\s*(.+)$/);
    if (desc) {
      item.description = plain(desc[1], `${id} Description`);
      continue;
    }
    if (mode === 'head') {
      const field = line.match(/^- \*\*(.+?):\*\*\s*(.+)$/);
      if (field) item.fields[field[1]] = field[2];
      else if (!item.shortLine) item.shortLine = plain(line, `${id} short line`);
      else warn(`${file} ${id}: unexpected line "${line}"`);
    } else if (mode === 'faq') {
      const qa = line.match(/^- \*\*(.+?)\*\*\s+(.+)$/);
      if (qa) item.faq.push({ q: plain(qa[1], `${id} FAQ`), a: inlineHtml(qa[2]) });
      else warn(`${file} ${id}: unexpected FAQ line "${line}"`);
    } else {
      const step = line.match(/^\d+\.\s+(.+)$/);
      if (step) item.steps.push(plain(step[1], `${id} step`));
      else item.notes.push(plain(line, `${id} barber note`));
    }
  }
  return item;
}

/** Fields every catalogue item shares. */
function common(item, row, file, prompts, { hasSteps = true } = {}) {
  const f = item.fields;
  const where = `${file} ${item.id}`;
  const need = (key) => {
    if (!f[key]) {
      err(`${where}: missing "${key}"`);
      return '';
    }
    return plain(f[key], `${where} ${key}`);
  };
  if (!row) err(`${where}: not in the "At a glance" table`);
  if (!item.shortLine) err(`${where}: missing short line`);
  if (!item.description) err(`${where}: missing Description`);
  if (hasSteps) {
    if (item.faq.length < 3 || item.faq.length > 5) warn(`${where}: ${item.faq.length} FAQs (expected 3–5)`);
    if (item.steps.length === 0) err(`${where}: no barber steps`);
  }
  const prompt = prompts[item.id];
  if (!prompt) warn(`${where}: no image prompt`);
  else if (prompt.name !== item.name) warn(`${where}: image prompt names it "${prompt.name}"`);

  return {
    id: item.id,
    // When the source document last changed, for "dateModified" in structured data.
    updated: statSync(join(SRC, file)).mtime.toISOString().slice(0, 10),
    slug: slugify(item.name),
    name: item.name,
    shortLine: item.shortLine ?? '',
    description: item.description ?? '',
    pickIf: need('Pick this if'),
    skipIf: need('Skip if'),
    daily: need('Daily'),
    weekly: need('Weekly'),
    nextVisit: need('Next barber visit'),
    atShop: f['At the shop'] ? plain(f['At the shop'], where) : undefined,
    suitsText: need('Suits'),
    alsoCalled: f['Also called'] ? plain(f['Also called'], where).split(/,\s*/) : [],
    mainPhoto: (f['Main photo'] ?? row?.['Main photo'] ?? 'Front').toLowerCase(),
    callouts: prompt?.callouts ?? [],
    ...(hasSteps && {
      faq: item.faq,
      barberSteps: item.steps,
      barberNote: item.notes.join(' ') || undefined,
    }),
  };
}

function parseCatalogue(file, prefix, build, prompts, opts) {
  const secs = sections(read(file));
  const rows = glance(secs, file);
  const items = [];
  for (const sec of secs) {
    const raw = parseItem(sec, file);
    if (!raw || raw.id[0] !== prefix) continue;
    const row = rows[raw.id];
    items.push({ ...common(raw, row, file, prompts, opts), ...build(raw, row ?? {}, `${file} ${raw.id}`) });
  }
  for (const id of Object.keys(rows)) {
    if (!items.some((i) => i.id === id)) err(`${file}: ${id} is in the table but has no section`);
  }
  return items;
}

// ---------- Image prompts (callouts, main view, swatch) ----------

function parsePrompts() {
  const text = read('Image prompts.md');
  const prompts = {};
  for (const [, block] of text.matchAll(/```text\n([\s\S]*?)```/g)) {
    const item = block.match(/^ITEM:\s*([HBMCL]\d{2})\s+(.+)$/m);
    if (!item) continue;
    const callouts = [];
    const start = block.indexOf('CALLOUTS:');
    if (start >= 0) {
      for (const line of block.slice(start).split('\n').slice(1)) {
        const c = line.match(/^\d+\.\s+(.+?):\s+(.+)$/);
        if (c) callouts.push({ title: c[1].trim(), text: c[2].trim() });
        else if (/^[A-Z][A-Z ]+:/.test(line)) break;
      }
    }
    prompts[item[1]] = {
      name: item[2].trim(),
      block: block.trim(),
      older: /OLDER VERSION/.test(block),
      mainView: block.match(/^MAIN VIEW:\s*(.+)$/m)?.[1].trim(),
      swatch: block.match(/^SWATCH:\s*(.+)$/m)?.[1].trim(),
      callouts,
    };
  }
  return prompts;
}

/** The shared blocks every image prompt is built from (Image prompts document, "How to use"). */
function parsePromptParts() {
  const secs = sections(read('Image prompts.md'));
  const blocks = (heading) => {
    const sec = secs.find((s) => s.heading.startsWith(heading));
    if (!sec) {
      err(`Image prompts.md: no "${heading}" section`);
      return [];
    }
    return [...sec.lines.join('\n').matchAll(/```text\n([\s\S]*?)```/g)].map((m) => m[1].trim());
  };
  const [character, older] = blocks('Character reference');
  const categoryText = secs.find((s) => s.heading.startsWith('Category blocks'))?.lines.join('\n') ?? '';
  const LABELS = { 'Hair styles': 'H', Beards: 'B', Moustaches: 'M', 'Hair colours': 'C', 'Ready Looks': 'L' };
  const categories = {};
  for (const [, label, block] of categoryText.matchAll(/\*\*([^*]+)\*\*\s*```text\n([\s\S]*?)```/g)) {
    if (LABELS[label]) categories[LABELS[label]] = block.trim();
  }
  for (const [label, prefix] of Object.entries(LABELS)) {
    if (!categories[prefix]) err(`Image prompts.md: no category block for ${label}`);
  }
  return {
    character,
    older,
    fixed: blocks('Fixed block')[0],
    categories,
    avoid: blocks('Avoid list')[0],
    // Image prompts document, step 3: the clean version the app draws its own labels on.
    cleanSuffix: 'No callouts, lines, dots or text.',
  };
}

/** Optional dot positions for the callouts, placed with /dev/callouts. { "H07": [[x, y], ...] } in % of the photo. */
function readCalloutPositions() {
  const path = join(SRC, 'callout-positions.json');
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (e) {
    if (e.code !== 'ENOENT') err(`callout-positions.json: ${e.message}`);
    return {};
  }
}

// ---------- Learn posts ----------

function parseLearn() {
  const file = 'Learn.md';
  const updated = statSync(join(SRC, file)).mtime.toISOString().slice(0, 10);
  const posts = [];
  for (const sec of sections(read(file))) {
    const m = sec.heading.match(/^(P\d{2})\s+(.+)$/);
    if (!m) continue;
    const [, code, title] = m;
    const where = `${file} ${code}`;
    const post = { code, title: unescape(title), updated, body: [], faq: [], related: [], sources: [] };
    let mode = 'head';
    for (const raw of sec.lines) {
      const line = raw.trim();
      if (mode === 'body') {
        const chair = line.match(/^\*\*From the chair:\*\*\s*(.+)$/);
        if (chair) {
          post.fromTheChair = plain(chair[1], where);
          mode = 'tail';
        } else {
          // Post titles are the page's h1, so section headings move up one level.
          post.body.push(raw.replace(/^### /, '## '));
        }
        continue;
      }
      if (!line) continue;
      let x;
      if ((x = line.match(/^- \*\*URL:\*\*\s*(\S+)\s*·\s*\*\*Read:\*\*\s*(\d+) min\s*·\s*\*\*Topic:\*\*\s*(.+)$/))) {
        post.slug = x[1].replace(/^\/learn\//, '');
        post.readMinutes = Number(x[2]);
        post.topic = oneOf(x[3].trim(), TOPICS, `${where} topic`);
      } else if ((x = line.match(/^- \*\*Meta description:\*\*\s*(.+)$/))) {
        post.description = plain(x[1], where);
      } else if ((x = line.match(/^\*\*Short answer:\*\*\s*(.+)$/))) {
        post.shortAnswer = plain(x[1], where);
        mode = 'body';
      } else if (line === '**FAQ**') {
        mode = 'faq';
      } else if ((x = line.match(/^\*\*Related:\*\*\s*(.+)$/))) {
        post.related = x[1].split(/\s*·\s*/).map((r) => {
          const ref = r.match(/^([HBMCL]\d{2})\s+(.+)$/);
          if (!ref) err(`${where}: bad Related entry "${r}"`);
          return { id: ref?.[1] ?? r, name: ref?.[2] ?? r };
        });
        mode = 'tail';
      } else if ((x = line.match(/^\*\*Image alt:\*\*\s*(.+)$/))) {
        post.imageAlt = plain(x[1], where);
      } else if ((x = line.match(/^\*\*Sources?:\*\*\s*(.+)$/))) {
        post.sources.push(inlineHtml(x[1]));
      } else if (mode === 'faq' && (x = line.match(/^- \*\*(.+?)\*\*\s+(.+)$/))) {
        post.faq.push({ q: plain(x[1], where), a: inlineHtml(x[2]) });
      } else {
        warn(`${where}: unexpected line "${line}"`);
      }
    }
    while (post.body.length && !post.body[0].trim()) post.body.shift();
    while (post.body.length && !post.body.at(-1).trim()) post.body.pop();

    for (const key of ['slug', 'description', 'shortAnswer', 'fromTheChair', 'imageAlt']) {
      if (!post[key]) err(`${where}: missing ${key}`);
    }
    if (post.description?.length > 155) warn(`${where}: meta description is ${post.description.length} characters (max 155)`);
    if (post.title.length > 70) warn(`${where}: title is ${post.title.length} characters (aim for about 60)`);
    const words = post.shortAnswer?.split(/\s+/).length ?? 0;
    if (words < 40 || words > 60) warn(`${where}: short answer is ${words} words (aim for 40–60)`);
    posts.push(post);
  }
  return posts;
}

// ---------- Build ----------

const prompts = parsePrompts();

const hair = parseCatalogue(
  'Hair styles.md',
  'H',
  (_raw, row, where) => ({
    length: row['Length'],
    upkeep: oneOf(row['Upkeep'], UPKEEP, `${where} upkeep`),
    face: list(row['Suits face'], FACES, `${where} face`),
    hairType: list(row['Hair type'], HAIR_TYPES, `${where} hair type`),
    thinHairOk: oneOf(row['Thin hair'], ['Yes', 'No'], `${where} thin hair`) === 'Yes',
  }),
  prompts,
);

const MOUSTACHE_MODE = { Separate: 'separate', 'Trimmed with beard': 'trimmed', 'Part of style': 'included' };
const beards = parseCatalogue(
  'Beard styles.md',
  'B',
  (_raw, row, where) => ({
    length: row['Length'],
    upkeep: oneOf(row['Upkeep'], UPKEEP, `${where} upkeep`),
    face: list(row['Suits face'], FACES, `${where} face`),
    growth: list(row['Growth needed'], GROWTH, `${where} growth`, 'Any'),
    moustacheMode: MOUSTACHE_MODE[row['Moustache']] ?? err(`${where}: unknown moustache mode "${row['Moustache']}"`),
  }),
  prompts,
);

const moustaches = parseCatalogue(
  'Moustache styles.md',
  'M',
  (_raw, row, where) => ({
    length: row['Size'],
    upkeep: oneOf(row['Upkeep'], UPKEEP, `${where} upkeep`),
    face: list(row['Suits face'], FACES, `${where} face`),
    growth: list(row['Growth needed'], GROWTH, `${where} growth`, 'Any'),
  }),
  prompts,
);

const colours = parseCatalogue(
  'Hair colours.md',
  'C',
  (raw, row, where) => ({
    levelTone: row['Level and tone'],
    coversGrey: row['Covers grey'],
    bleach: row['Bleach needed'],
    skin: list(row['Skin tone'], SKINS, `${where} skin`),
    grey: list(row['Grey hair'], GREYS, `${where} grey`, 'Any'),
    timeAtShop: row['Time at shop'],
    swatchLabel: prompts[raw.id]?.swatch,
  }),
  prompts,
);

const partId = (cell, prefix, where) => {
  if (!cell || cell === '—') return null;
  const id = cell.match(/^([A-Z]\d{2})\b/)?.[1];
  if (!id || id[0] !== prefix) err(`${where}: expected a ${prefix} item, got "${cell}"`);
  return id ?? null;
};

const looks = parseCatalogue(
  'Ready Looks.md',
  'L',
  (raw, row, where) => {
    const m = row['Moustache'];
    const moustacheMode =
      !m || m === '—' ? 'no-change' : m === 'Shave off' ? 'shave-off' : m === 'Part of beard' ? 'part-of-beard' : 'style';
    return {
      upkeep: oneOf(row['Upkeep'], UPKEEP, `${where} upkeep`),
      face: list(row['Suits face'], FACES, `${where} face`),
      growth: list(row['Growth needed'], GROWTH, `${where} growth`, 'Any'),
      hair: partId(row['Hair'], 'H', `${where} hair`),
      beard: partId(row['Beard'], 'B', `${where} beard`),
      moustache: moustacheMode === 'style' ? partId(m, 'M', `${where} moustache`) : null,
      moustacheMode,
      colour: partId(row['Colour'], 'C', `${where} colour`),
      includesText: raw.fields['Includes'] ? plain(raw.fields['Includes'], where) : '',
    };
  },
  prompts,
  { hasSteps: false },
);

const learn = parseLearn();

// ---------- Cross-checks ----------

const all = { hair, beards, moustaches, colours, looks };
const byId = new Map(Object.values(all).flat().map((i) => [i.id, i]));

for (const [name, expected] of Object.entries(EXPECTED)) {
  const actual = name === 'learn' ? learn.length : all[name].length;
  if (actual !== expected) err(`${name}: ${actual} entries, expected ${expected}`);
}

for (const items of [...Object.values(all), learn]) {
  const seen = new Set();
  for (const i of items) {
    if (seen.has(i.slug)) err(`duplicate slug "${i.slug}"`);
    seen.add(i.slug);
  }
}

// Main photo angle should match the image prompt's main view.
for (const i of [...hair, ...beards]) {
  const view = prompts[i.id]?.mainView;
  const promptAngle = view && /side profile/.test(view) && !/^three-quarter/.test(view) ? 'side' : 'front';
  if (i.mainPhoto !== promptAngle) {
    warn(`${i.id} ${i.name}: main photo is "${i.mainPhoto}" but the image prompt's main view is ${view ? `"${view}"` : 'the category default (three-quarter front)'}`);
  }
}

const sides = hair.filter((h) => h.mainPhoto === 'side').length;
if (sides !== 17) warn(`hair: ${sides} side photos (the document says 17)`);

const intersect = (lists) => lists.reduce((acc, l) => acc.filter((x) => l.includes(x)));
for (const look of looks) {
  const where = `Ready Looks ${look.id}`;
  const parts = [look.hair, look.beard, look.moustache, look.colour].filter(Boolean).map((id) => byId.get(id));
  if (parts.some((p) => !p)) {
    err(`${where}: a part does not exist`);
    continue;
  }
  const hairPart = byId.get(look.hair);
  look.hairType = hairPart.hairType;
  look.thinHairOk = hairPart.thinHairOk;

  const face = intersect(parts.filter((p) => p.face).map((p) => p.face));
  const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
  if (!sameSet(face, look.face)) warn(`${where}: Suits face is ${look.face.join(', ')}, but its parts overlap on ${face.join(', ')}`);

  const beard = look.beard && byId.get(look.beard);
  if ((beard?.moustacheMode === 'included') !== (look.moustacheMode === 'part-of-beard')) {
    err(`${where}: moustache "${look.moustacheMode}" does not fit beard ${look.beard}`);
  }
  for (const p of parts) if (!look.includesText.includes(p.name)) warn(`${where}: Includes line does not mention ${p.name}`);
}

for (const post of learn) {
  for (const r of post.related) {
    const item = byId.get(r.id);
    if (!item) err(`Learn ${post.code}: related ${r.id} does not exist`);
    else if (item.name !== r.name) warn(`Learn ${post.code}: related ${r.id} is called "${item.name}", not "${r.name}"`);
  }
  post.related = post.related.map((r) => r.id);
}

// "Quiff (H14)" in a post body becomes a link to the Quiff page (SEO rule 9: link related pages).
// Only exact catalogue names are linked; other codes are left as written and listed for review.
const SEGMENT = { H: 'styles', B: 'beards', M: 'moustaches', C: 'colours', L: 'looks' };
for (const post of learn) {
  let text = post.body.join('\n');
  for (const item of byId.values()) {
    text = text.replaceAll(`${item.name} (${item.id})`, `[${item.name}](/${SEGMENT[item.id[0]]}/${item.slug})`);
  }
  const left = [...new Set(text.match(/\S+ \([HBMCL]\d{2}[^)]*\)/g) ?? [])];
  for (const ref of left) warn(`Learn ${post.code}: not linked, name doesn't match the catalogue: "${ref}"`);
  post.body = text.split('\n');
}

// Callout dot positions: each item needs one [x, y] per callout, both 0–100.
const positions = readCalloutPositions();
for (const [id, list] of Object.entries(positions)) {
  const item = byId.get(id);
  if (!item) {
    err(`callout-positions.json: unknown item ${id}`);
    continue;
  }
  if (!Array.isArray(list) || list.length !== item.callouts.length) {
    err(`callout-positions.json: ${id} has ${list?.length ?? 0} positions for ${item.callouts.length} callouts`);
    continue;
  }
  list.forEach(([x, y], i) => {
    if (![x, y].every((n) => typeof n === 'number' && n >= 0 && n <= 100)) err(`callout-positions.json: ${id} position ${i + 1} is outside 0–100`);
    Object.assign(item.callouts[i], { x, y });
  });
}

const promptParts = parsePromptParts();

// ---------- Write ----------

const issues = () => {
  for (const w of warnings) console.warn(`  warn  ${w}`);
  for (const e of errors) console.error(`  error ${e}`);
};

if (errors.length) {
  issues();
  console.error(`\nImport stopped: ${errors.length} error(s), ${warnings.length} warning(s). Nothing was written.`);
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(
  join(OUT, 'image-prompts.json'),
  JSON.stringify(
    {
      ...promptParts,
      items: Object.fromEntries(
        [...byId.values()].map((i) => [i.id, { name: i.name, block: prompts[i.id]?.block ?? '', older: prompts[i.id]?.older ?? false }]),
      ),
    },
    null,
    2,
  ) + '\n',
);
for (const [name, items] of Object.entries(all)) {
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(items, null, 2) + '\n');
}

const learnDir = join(OUT, 'learn');
rmSync(learnDir, { recursive: true, force: true });
mkdirSync(learnDir);
for (const { body, slug, ...data } of learn) {
  // JSON values are valid YAML, which keeps quoting safe.
  const front = Object.entries(data)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n');
  writeFileSync(join(learnDir, `${slug}.md`), `---\n${front}\n---\n\n${body.join('\n')}\n`);
}

issues();
const counts = Object.entries(all).map(([k, v]) => `${v.length} ${k}`);
console.log(`\nImported ${counts.join(', ')}, ${learn.length} learn posts. ${warnings.length} warning(s).`);
