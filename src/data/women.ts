// Women's services: categories and their services. The words live in en.json (wcat.* and wsvc.*) so they
// are translated like the rest of the screen text.
import type { IconName } from './icons';

export interface WomenCategory {
  key: string;
  icon: IconName;
  /** Colour block class for the category tile. */
  block: string;
  /** Service slugs, in order. */
  items: string[];
}

export const womenCategories: WomenCategory[] = [
  {
    key: 'hair',
    icon: 'scissors',
    block: 'bg-block-orange',
    items: [
      'layered-cut',
      'bob-cut',
      'step-cut',
      'fringe-bangs',
      'blow-dry',
      'feather-cut',
      'pixie-cut',
      'shag-cut',
      'blunt-cut',
      'tong-curls',
      'braid-styling',
      'bun-styling',
      'wash-and-style'
    ]
  },
  {
    key: 'hair-colour',
    icon: 'droplet',
    block: 'bg-block-blush',
    items: [
      'global-colour',
      'highlights',
      'balayage',
      'root-touch-up',
      'fashion-colour',
      'ombre',
      'hair-gloss',
      'colour-melt',
      'grey-blending',
      'henna-hair-colour',
      'semi-permanent-colour',
      'toner-refresh'
    ]
  },
  {
    key: 'hair-care',
    icon: 'cloud',
    block: 'bg-block-sky',
    items: [
      'hair-spa',
      'keratin',
      'smoothening',
      'rebonding',
      'scalp-treatment',
      'protein-treatment',
      'bond-repair',
      'hair-botox',
      'hot-oil-treatment',
      'brazilian-blowout'
    ]
  },
  {
    key: 'brows',
    icon: 'eye',
    block: 'bg-block-sage',
    items: [
      'eyebrow-threading',
      'upper-lip',
      'forehead',
      'full-face-threading',
      'brow-tint',
      'brow-lamination',
      'chin-cheek-threading',
      'eyelash-lift',
      'brow-henna',
      'brow-shaping',
      'brow-makeover'
    ]
  },
  {
    key: 'facials',
    icon: 'star',
    block: 'bg-block-sand',
    items: [
      'fruit-facial',
      'detan-facial',
      'insta-glow',
      'gold-facial',
      'korean-glow',
      'hydra-facial',
      'anti-acne-facial',
      'vitamin-c-facial',
      'oxygen-facial',
      'express-cleanup',
      'deep-cleanup',
      'oil-control-facial',
      'pigmentation-facial',
      'sensitive-skin-facial',
      'under-eye-treatment'
    ]
  },
  {
    key: 'waxing',
    icon: 'leaf',
    block: 'bg-block-plum',
    items: [
      'underarms',
      'full-arms',
      'half-legs',
      'full-legs',
      'face-wax',
      'bikini-line',
      'rica-wax',
      'half-arms',
      'chocolate-wax',
      'arms-legs-combo',
      'full-back-wax',
      'brazilian-wax',
      'hands-underarms-combo'
    ]
  },
  {
    key: 'nails',
    icon: 'hand',
    block: 'bg-block-orange',
    items: [
      'manicure',
      'deluxe-manicure',
      'pedicure',
      'deluxe-pedicure',
      'gel-nail-art',
      'acrylic-extensions',
      'french-tips',
      'gel-polish',
      'paraffin-treatment',
      'glitter-nails',
      'chrome-nails',
      'ombre-nails',
      'bridal-nail-art'
    ]
  },
  {
    key: 'massage',
    icon: 'heart',
    block: 'bg-block-blush',
    items: [
      'head-massage',
      'foot-massage',
      'back-massage',
      'full-body-massage',
      'body-polishing',
      'shoulder-neck-massage',
      'aromatherapy-massage',
      'hand-massage',
      'deep-tissue-massage',
      'hot-stone-massage'
    ]
  },
  {
    key: 'makeup',
    icon: 'sparkle',
    block: 'bg-block-sky',
    items: [
      'party-makeup',
      'bridal-makeup',
      'engagement-makeup',
      'saree-draping',
      'party-hairstyle',
      'hd-makeup',
      'eye-makeup',
      'reception-makeup',
      'natural-makeup',
      'office-makeup',
      'college-makeup',
      'makeup-touch-up',
      'lip-colour-styling'
    ]
  }
];

export const womenCategory = (key: string) => womenCategories.find((c) => c.key === key);

/** Photo ID of a service: W01, W02 ... in catalogue order. Photos go in src/assets/catalogue/W01.jpg. */
export const womenServiceId = (slug: string) => {
  const all = womenCategories.flatMap((c) => c.items);
  return `W${String(all.indexOf(slug) + 1).padStart(2, '0')}`;
};

export type WomenGoal = 'everyday' | 'event' | 'repair' | 'relax' | 'change';
export const WOMEN_GOALS: WomenGoal[] = ['everyday', 'event', 'repair', 'relax', 'change'];
const goalByCategory: Record<string, WomenGoal> = {
  hair: 'change',
  'hair-colour': 'change',
  'hair-care': 'repair',
  brows: 'everyday',
  facials: 'everyday',
  waxing: 'everyday',
  nails: 'everyday',
  massage: 'relax',
  makeup: 'event',
};
const goalOverrides: Record<string, WomenGoal> = {
  'blow-dry': 'event',
  'insta-glow': 'event',
  'gold-facial': 'event',
  'korean-glow': 'event',
  'detan-facial': 'repair',
  'scalp-treatment': 'repair',
  'body-polishing': 'relax',
  'gel-nail-art': 'event',
  'party-hairstyle': 'event',
  'saree-draping': 'event',
  'vitamin-c-facial': 'event',
  'oxygen-facial': 'event',
  'paraffin-treatment': 'relax',
  'hot-oil-treatment': 'repair',
  'natural-makeup': 'everyday',
  'eye-makeup': 'everyday',
  'office-makeup': 'everyday',
  'college-makeup': 'everyday',
  'lip-colour-styling': 'everyday',
  'tong-curls': 'event',
  'braid-styling': 'event',
  'bun-styling': 'event',
  'wash-and-style': 'event',
  'anti-acne-facial': 'repair',
  'pigmentation-facial': 'repair',
  'sensitive-skin-facial': 'repair',
  'under-eye-treatment': 'repair',
  'glitter-nails': 'event',
  'chrome-nails': 'event',
  'ombre-nails': 'event',
  'bridal-nail-art': 'event',
};
/** What the visitor is usually after: used by the "Best for" filter. */
export const serviceGoal = (categoryKey: string, slug: string): WomenGoal => goalOverrides[slug] ?? goalByCategory[categoryKey] ?? 'everyday';

export type TimeBand = 'quick' | 'standard' | 'long';
/** Bands from the shortest time in the English "40–50 min" / "2–3 hours" text. */
export const timeBand = (text: string): TimeBand => {
  const match = text.match(/(\d+)(?:\s*[–-]\s*\d+)?\s*(hour|min)/i);
  const minutes = match ? Number(match[1]) * (match[2]!.toLowerCase() === 'hour' ? 60 : 1) : 45;
  return minutes < 30 ? 'quick' : minutes < 90 ? 'standard' : 'long';
};

export type FaceShape = 'Oval' | 'Round' | 'Square' | 'Long' | 'Heart';
const ALL: FaceShape[] = ['Oval', 'Round', 'Square', 'Long', 'Heart'];
/** Face shapes a service flatters. Services that do not depend on face shape are left out. */
const facesBySlug: Record<string, FaceShape[]> = {
  'layered-cut': ALL,
  'bob-cut': ['Oval', 'Heart', 'Long'],
  'step-cut': ['Round', 'Oval', 'Square'],
  'fringe-bangs': ['Round', 'Long', 'Square'],
  'blow-dry': ALL,
  'feather-cut': ['Round', 'Oval', 'Square'],
  'pixie-cut': ['Oval', 'Heart', 'Long'],
  'shag-cut': ['Oval', 'Round', 'Square'],
  'blunt-cut': ['Oval', 'Heart', 'Long'],
  'colour-melt': ALL,
  'grey-blending': ALL,
  'brow-henna': ALL,
  'reception-makeup': ALL,
  'natural-makeup': ALL,
  'office-makeup': ALL,
  'college-makeup': ALL,
  'brow-shaping': ALL,
  'brow-makeover': ALL,
  'tong-curls': ALL,
  'braid-styling': ALL,
  'bun-styling': ALL,
  'wash-and-style': ALL,
  highlights: ALL,
  balayage: ALL,
  ombre: ['Round', 'Oval', 'Square', 'Heart'],
  'fashion-colour': ALL,
  'eyebrow-threading': ALL,
  'brow-tint': ALL,
  'brow-lamination': ['Round', 'Square', 'Heart'],
  'party-makeup': ALL,
  'bridal-makeup': ALL,
  'engagement-makeup': ALL,
  'hd-makeup': ALL,
  'eye-makeup': ALL,
  'party-hairstyle': ALL,
};
export const serviceFaces = (slug: string): FaceShape[] | undefined => facesBySlug[slug];

/** Filter values (time band and goal) with at least this many services in a category get a chip. */
export const MIN_FOR_FILTER = 5;
export const filterCounts = (categoryKey: string, items: string[], bandOf: (slug: string) => TimeBand) => {
  const time: Record<string, number> = {};
  const goal: Record<string, number> = {};
  for (const slug of items) {
    const b = bandOf(slug);
    const g = serviceGoal(categoryKey, slug);
    time[b] = (time[b] ?? 0) + 1;
    goal[g] = (goal[g] ?? 0) + 1;
  }
  return { time, goal };
};
