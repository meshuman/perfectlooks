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
      'pixie-cut'
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
      'hair-gloss'
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
      'bond-repair'
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
      'chin-cheek-threading'
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
      'anti-acne-facial'
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
      'rica-wax'
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
      'french-tips'
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
      'aromatherapy-massage'
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
      'eye-makeup'
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
