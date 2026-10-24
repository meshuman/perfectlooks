// Builds full image prompts from the Image prompts document's parts (fixed block, category block,
// item block, avoid list), in an order that suits image models: what the image shows first, then
// who, the views, backdrop and light, layout, and the avoid list last. Every line of the document
// is kept. Each item also gets its BACKDROP colour and the traits the man needs for that style.
import { backdropFor } from './backdrop';
import type { Match } from './match';

export interface PromptParts {
  fixed: string;
  categories: Record<string, string>;
  avoid: string;
  cleanSuffix: string;
}

/** What the catalogue says the style suits, used to give the man matching traits. */
export interface StyleTraits {
  category: 'hair' | 'beards' | 'moustaches' | 'colours' | 'looks';
  match: Match;
  /** Uses the older version of the character (Image prompts document: OLDER VERSION). */
  older?: boolean;
}

type Face = 'Oval' | 'Round' | 'Square' | 'Long' | 'Heart';

/** How each face shape is described, so image models draw it clearly. */
const FACE: Record<Face, string> = {
  Oval: 'an oval face, a little longer than wide, with a clean, defined jawline',
  Round: 'a round face, about as wide as it is long, with full cheeks and a soft, rounded jaw',
  Square: 'a square face with a strong, wide, angular jaw; forehead, cheekbones and jaw about the same width',
  Long: 'a long face, clearly longer than wide, with a long chin and straight, narrow cheeks',
  Heart: 'a heart-shaped face: a wide forehead and cheekbones tapering to a narrow, pointed chin',
};

/** The sentence in the character text that fixes his face, replaced when the style shows another shape. */
const CHARACTER_FACE = 'an oval face with a clean, defined jawline';

/**
 * The face shape the photo shows: the one the style does most for. Every style suits an oval face,
 * so oval says nothing about who the style is for. A style that suits round faces but not long ones
 * shows a round face; one that suits long faces but not round ones shows a long face; then square,
 * then heart. Styles that suit every face (and colours, which don't depend on it) keep his oval face.
 */
export function faceFor(match: Match): Face {
  const faces = (match.face ?? []) as Face[];
  if (!faces.length || faces.length === 5) return 'Oval';
  const has = (f: Face) => faces.includes(f);
  if (has('Round') && !has('Long')) return 'Round';
  if (has('Long') && !has('Round')) return 'Long';
  if (has('Square')) return 'Square';
  if (has('Heart')) return 'Heart';
  return has('Round') ? 'Round' : 'Oval';
}

/** The character text with his face set to the shape this style shows; everything else stays identical. */
function withFace(text: string, face: Face): string {
  if (face === 'Oval') return text;
  return text
    .replace('(identical in every image)', '(the same man in every image)')
    .replace(CHARACTER_FACE, FACE[face])
    .replace(
      'Match the attached character reference exactly.',
      'Match the attached character reference for his eyes, eyebrows, nose, lips, ears, skin and build; only the face shape differs, as described here.',
    );
}

/**
 * The man's traits for one style. His eyes, skin and build never change: medium-brown skin suits
 * every item (checked in prompts.test.ts). His face shape, hair texture, hair density and beard
 * growth follow what the style suits, so every photo shows it on someone it is meant for.
 */
export function traitsFor({ category, match, older }: StyleTraits): string[] {
  const face = faceFor(match);
  const lines = [
    face === 'Oval'
      ? `Face: ${FACE.Oval.replace('an oval face, ', 'oval, ')} (his own; ${match.face?.length === 5 ? 'this style suits every face shape' : 'shown on his natural face'}).`
      : `Face: ${FACE[face].replace(/^an? /, '')} (this style suits a ${face.toLowerCase()} face, so show it on one; keep every other feature of his identical).`,
  ];
  lines.push(
    category === 'colours'
      ? 'Skin: medium-brown with warm undertones (his own; this shade suits medium skin).'
      : 'Skin: medium-brown with warm undertones (his own).',
  );

  const types = match.hairType ?? [];
  if (types.length && !types.includes('Straight')) {
    lines.push('Hair texture: natural, defined curls (this style is for curly or wavy hair).');
  } else if (types.length === 1) {
    lines.push('Hair texture: straight and smooth (this style needs straight hair).');
  } else {
    lines.push('Hair texture: straight, as in the reference.');
  }

  if (match.thinHairOk === false) {
    lines.push('Hair density: thick and full, with no thinning or visible scalp on top (this style needs full hair).');
  }

  const growth = match.growth ?? [];
  const area = category === 'moustaches' ? 'moustache' : 'beard';
  if (growth.length === 1 && growth[0] === 'Full') {
    lines.push(`Beard growth: thick, dense ${area} growth with no gaps (this style needs full growth).`);
  } else if (growth.length && !growth.includes('Patchy')) {
    lines.push(`Beard growth: even ${area} growth with no patches.`);
  }

  if (older) lines.push('Age: about 50, as in the older reference.');
  return lines;
}

/** Splits a block into its labelled fields ("STYLE: ...", with continuation lines kept with them). */
function fields(block: string): { key: string; text: string }[] {
  const out: { key: string; text: string }[] = [];
  for (const line of block.split('\n')) {
    // "CHARACTER (identical in every image): ..." counts as the CHARACTER field.
    const field = line.match(/^([A-Z][A-Z ]+?)(?: \([^)]*\))?:\s?(.*)$/);
    if (field) out.push({ key: field[1]!, text: line });
    else if (out.length) out[out.length - 1]!.text += `\n${line}`;
    else out.push({ key: '', text: line });
  }
  return out;
}

/**
 * The clean version drops every callout instruction instead of contradicting it at the end.
 * Image models told both "draw labels" and "no text" often draw stray labels anyway.
 */
function withoutCallouts(text: string): string {
  return (
    text
      // Fixed block: the callout styling sentences in LAYOUT.
      .replace(/\s*Four or five callouts on the right:[\s\S]*?Labels never cover the face\./, '')
      // Category blocks: sentences that say where callouts point. Line breaks are kept.
      .split('\n')
      .map((line) =>
        line
          .split(/(?<=\.)\s+/)
          .filter((sentence) => !/callout/i.test(sentence))
          .join(' '),
      )
      .join('\n')
      // Colour swatch: keep the swatch, drop its printed shade name.
      .replace(/ with the shade name and level below it/, '')
  );
}

export function buildPrompt(parts: PromptParts, id: string, itemBlock: string, clean: boolean, traits?: StyleTraits): string {
  const fixed = fields(clean ? withoutCallouts(parts.fixed) : parts.fixed);
  const item = fields(itemBlock);
  const category = clean ? withoutCallouts(parts.categories[id[0]!] ?? '') : (parts.categories[id[0]!] ?? '');
  const pick = (list: { key: string; text: string }[], ...keys: string[]) =>
    list.filter((f) => keys.includes(f.key)).map((f) => f.text);

  const backdrop = pick(item, 'BACKDROP');
  if (!backdrop.length) {
    const { name, hex } = backdropFor(id);
    backdrop.push(`BACKDROP: ${name} (${hex}).`);
  }

  const sections = [
    // 1. What the image is, and the style it shows.
    pick(fixed, ''),
    pick(item, 'ITEM', 'STYLE', 'PARTS', 'HAIR FOR THIS ITEM', 'SWATCH'),
    // 2. Who: the same man, with the traits this style needs.
    pick(fixed, 'CHARACTER').map((t) => (traits ? withFace(t, faceFor(traits.match)) : t)),
    pick(item, 'CHARACTER', 'CHARACTER NOTE'),
    traits ? ['TRAITS FOR THIS STYLE (identity unchanged):', ...traitsFor(traits).map((t) => `- ${t}`)] : [],
    // 3. Views: the category rules, then the item's own main view, which overrides them.
    [category],
    pick(item, 'MAIN VIEW'),
    // 4. Backdrop and light.
    backdrop,
    pick(fixed, 'BACKGROUND', 'LIGHT'),
    // 5. Layout, and the labels (labelled version only).
    pick(fixed, 'LAYOUT'),
    clean ? [] : pick(item, 'CALLOUTS'),
    // Anything the document adds later that isn't placed above.
    item.filter((f) => !['ITEM', 'STYLE', 'PARTS', 'HAIR FOR THIS ITEM', 'SWATCH', 'CHARACTER', 'CHARACTER NOTE', 'MAIN VIEW', 'BACKDROP', 'CALLOUTS'].includes(f.key)).map((f) => f.text),
    // 6. What to avoid, last.
    [clean ? parts.avoid.replace('any text other than the callout labels', 'any text') : parts.avoid],
    clean ? [`Keep the right side as clean background: the app adds its own labels. ${parts.cleanSuffix}`] : [],
  ];
  return sections
    .flat()
    .map((s) => s.trim())
    .filter(Boolean)
    .join('\n');
}
