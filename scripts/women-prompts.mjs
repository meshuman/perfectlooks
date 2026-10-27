// Image prompts for the women's services (W01...) and the add-ons (A01...), built from the same data the site
// uses. Used by export-prompts.mjs. Same house style as the men's prompts: one square image, flat colour-block backdrop.
import { readFileSync } from 'node:fs';

const en = JSON.parse(readFileSync('src/i18n/en.json', 'utf8'));

// Service order and categories come from src/data/women.ts; read them as text so this script needs no TypeScript.
const source = readFileSync('src/data/women.ts', 'utf8');
const categories = [...source.matchAll(/key: '([a-z-]+)',\s*icon: '[a-z]+',\s*block: 'bg-block-([a-z]+)',\s*items: \[([^\]]*)\]/g)].map((m) => ({
  key: m[1],
  block: m[2],
  items: [...m[3].matchAll(/'([a-z-]+)'/g)].map((x) => x[1]),
}));
// Frozen photo IDs live in women.ts so a saved photo never moves to another service.
const frozen = Object.fromEntries([...source.slice(source.indexOf('FROZEN_IDS')).matchAll(/'([a-z-]+)': '(W\d+)'/g)].map((m) => [m[1], m[2]]));
const addonSlugs = [...readFileSync('src/data/addons.ts', 'utf8').matchAll(/slug: '([a-z-]+)'/g)].map((m) => m[1]);

const HEX = { orange: ['Orange', '#EC9465'], blush: ['Blush', '#F7D9CE'], sky: ['Sky blue', '#A9C9E8'], sage: ['Sage', '#CADBD8'], sand: ['Sand', '#D8CDBF'], plum: ['Plum', '#B06A8F'] };

export const womanReference = `Photorealistic character reference sheet of one woman, Anisha, shown four times in a row: front view, three-quarter view facing left, left side profile, and back of the head. Anisha is a 26-year-old Nepali woman with fair, light wheatish skin with warm undertones, smooth, even and flawless-looking, an oval face with soft cheekbones, dark brown almond-shaped eyes, softly arched natural black eyebrows, a straight nose, medium-full lips, small ears, and a slim build. Calm, friendly expression, mouth closed. Natural black hair, shoulder-length, straight, worn loose with a centre parting. Clean, fresh, bare skin with no makeup, smooth and even with only a fine natural texture. Plain white crew-neck T-shirt. Professional beauty studio lighting: large softbox key light, soft fill, even and flattering. Plain, flat warm sand background (#D8CDBF). No text.`;

// What the picture shows, by category. The service's own name and description are added to each prompt.
const SCENE = {
  hair: 'the finished haircut on Anisha, hair clean and styled so the cut and its layers or length are easy to see.',
  'hair-colour': 'the finished hair colour on Anisha, hair clean and styled so the colour work (roots, lengths and ends) is easy to see.',
  'hair-care': 'Anisha with the healthy result of this hair treatment: smooth, glossy, well-conditioned hair that moves freely.',
  brows: "a close-up of Anisha's face from the nose up, showing the finished brows or threaded area, neat and natural.",
  facials: "a close-up of Anisha's face after this facial: fresh, clean, evenly toned skin with a healthy natural glow, hair tied back.",
  waxing: 'a clean, tasteful view of smooth, hair-free skin on the area named, on Anisha, soft light, no nudity.',
  nails: "Anisha's hands (or feet for pedicure) with the finished nails, neatly shaped and clean, resting on a plain surface.",
  massage: 'Anisha relaxed and calm after this massage, hair tied back, soft healthy skin.',
  makeup: 'the finished look on Anisha, face and hair styled, true to the service.',
};

// Views for the sheet. Three views (front, side, back) where the back matters, otherwise two.
const THREE = 'THREE VIEWS on one image: FRONT, LEFT SIDE and BACK';
const VIEWS = {
  hair: THREE + ' of the head and shoulders, same pose and light, so the cut can be judged from every angle.',
  'hair-colour': THREE + ' of the head and shoulders, same pose and light, so the colour can be judged from every angle.',
  'hair-care': THREE + ' of the head and shoulders, same pose and light, showing the shine from every angle.',
  brows: 'TWO VIEWS: FRONT close-up of the brows, and LEFT SIDE close-up of the same brow.',
  facials: 'TWO VIEWS: FRONT and LEFT SIDE (profile) of the face, same light, showing the skin finish.',
  waxing: 'TWO VIEWS: FRONT and LEFT SIDE of the treated area, same light.',
  nails: 'TWO VIEWS: the TOP view of the finished nails, and a SIDE view of the same hand showing the shape and length.',
  massage: 'TWO VIEWS: FRONT and LEFT SIDE of Anisha, head and shoulders, relaxed.',
  makeup: 'TWO VIEWS: FRONT and LEFT SIDE (three-quarter to profile) of the face and hair.',
};
const VIEW_OVERRIDES = {
  'party-hairstyle': THREE + ' of the head and shoulders, same pose and light, so the whole hairdo can be seen from every angle.',
  'saree-draping': THREE + ' of Anisha full length or knee-up in the draped saree, so the pleats, the pallu and the back of the drape can be seen.',
  'full-legs': THREE + ' of the legs, same light, tasteful and clean.',
  'half-legs': THREE + ' of the lower legs, same light, tasteful and clean.',
  'back-massage': 'TWO VIEWS: BACK view of Anisha, shoulders and upper back, relaxed; and LEFT SIDE view of the same.',
  'shoulder-neck-massage': 'TWO VIEWS: BACK view of Anisha, neck and shoulders, relaxed; and LEFT SIDE view of the same.',
  'bridal-makeup': THREE + ' of the face, hair and jewellery-free neckline, so the makeup and hairdo can be judged from every angle.',
  'pedicure': 'TWO VIEWS: the TOP view of the finished toenails and feet, and a SIDE view of the same foot.',
  'deluxe-pedicure': 'TWO VIEWS: the TOP view of the finished toenails and feet, and a SIDE view of the same foot.',
};

const layoutFor = (views) =>
  views.startsWith('THREE')
    ? 'LAYOUT: one square image. The FRONT view large on the left filling about 55% of the width; the LEFT SIDE view and the BACK view stacked on the right, each about 40% of the width, with a soft fade at their edges. Label nothing.'
    : 'LAYOUT: one square image. The first view large on the left filling about 60% of the width; the second, smaller view in the lower right, slightly overlapping, with a soft fade at its edge. Label nothing.';
const light = `LIGHT: professional beauty studio lighting: a large softbox key light from the front left, a beauty dish above, soft fill from the right and a gentle rim light, so the skin is evenly lit with no harsh shadows. Fair, smooth, even-toned skin with a soft healthy glow and only fine natural texture, as in a retouched beauty campaign. Sharp focus on the detail being shown, 85 mm portrait lens look.`;

const woman = `CHARACTER (the same woman in every image): Anisha, a 26-year-old Nepali woman with fair, light wheatish skin with warm undertones, smooth, even and flawless-looking, an oval face, dark brown almond-shaped eyes, softly arched natural black eyebrows, a straight nose, medium-full lips, small ears, slim build. Calm, friendly expression, mouth closed. Plain white crew-neck T-shirt. No glasses, jewellery, tattoos, piercings or hats. Natural black hair and bare skin unless the item says otherwise. Match the attached character reference for her eyes, nose, lips, skin and build.`;

const pad = (n) => String(n).padStart(2, '0');

export const womenItems = [];
let n = 0;
for (const cat of categories) {
  for (const slug of cat.items) {
    n += 1;
    if (!frozen[slug]) frozen[slug] = `W${pad(Object.keys(frozen).length + 1)}`;
    const id = frozen[slug];
    const name = en[`wsvc.${slug}.name`];
    const line = en[`wsvc.${slug}.line`];
    const what = en[`wsvc.${slug}.what`];
    const [bgName, hex] = HEX[cat.block];
    const views = VIEW_OVERRIDES[slug] ?? VIEWS[cat.key];
    womenItems.push({
      id,
      name,
      text: `Photorealistic studio image for a beauty salon service guide. Square 1:1, at least 1536 x 1536 px.
ITEM: ${id} ${name}
SERVICE: ${line} ${what}
${woman}
SHOW: ${SCENE[cat.key]}
VIEWS: ${views}
BACKDROP: ${bgName} (${hex}).
${light}
BACKGROUND: one flat, seamless studio backdrop in the solid colour named in BACKDROP, evenly lit like a painted colour-block wall. No gradient, texture, props or background shadows.
${layoutFor(views)}
No callouts, lines, dots or text.`,
    });
  }
}

export const addonItems = addonSlugs.map((slug, i) => {
  const id = `A${pad(i + 1)}`;
  const name = en[`addon.${slug}.name`];
  return {
    id,
    name,
    text: `Photorealistic studio image for a salon add-on service guide. Square 1:1, at least 1536 x 1536 px.
ITEM: ${id} ${name}
SERVICE: ${en[`addon.${slug}.line`]} ${en[`addon.${slug}.what`]}
SHOW: a calm, close-up detail of this treatment being done, framed on the skin, scalp or hair only, with the product, tools or towels typical of it; no identifiable face, gender-neutral, hands in clean professional gloves or bare clean hands. Second view: a smaller close-up of the product or tool used.
BACKDROP: Sand (#D8CDBF).
${light}
BACKGROUND: one flat, seamless studio backdrop in the solid colour named in BACKDROP. No gradient, texture or background shadows.
LAYOUT: one square image. The main view large on the left filling about 60% of the width; the second, smaller view in the lower right, slightly overlapping, with a soft fade at its edge.
No callouts, lines, dots or text.`,
  };
});
