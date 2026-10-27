// Add-on services: the order, group, icon and related catalogue items. The words live in en.json (addon.<slug>.*)
// so they are translated like the rest of the screen text.
import type { IconName } from './icons';

export const ADDON_GROUPS = ['skin', 'hair', 'grooming'] as const;
export type AddonGroup = (typeof ADDON_GROUPS)[number];

export interface Addon {
  slug: string;
  group: AddonGroup;
  icon: IconName;
}

export const addons: Addon[] = [
  {
    slug: 'face-wash-cleansing',
    group: 'skin',
    icon: 'droplet'
  },
  {
    slug: 'scrub',
    group: 'skin',
    icon: 'sparkle'
  },
  {
    slug: 'steam-blackhead',
    group: 'skin',
    icon: 'cloud'
  },
  {
    slug: 'facial',
    group: 'skin',
    icon: 'sparkle'
  },
  {
    slug: 'glow-facial',
    group: 'skin',
    icon: 'star'
  },
  {
    slug: 'de-tan',
    group: 'skin',
    icon: 'sun'
  },
  {
    slug: 'clay-mask',
    group: 'skin',
    icon: 'leaf'
  },
  {
    slug: 'face-massage',
    group: 'skin',
    icon: 'hand'
  },
  {
    slug: 'head-massage',
    group: 'hair',
    icon: 'hand'
  },
  {
    slug: 'hair-spa',
    group: 'hair',
    icon: 'droplet'
  },
  {
    slug: 'beard-spa',
    group: 'grooming',
    icon: 'beard'
  },
  {
    slug: 'brow-grooming',
    group: 'grooming',
    icon: 'scissors'
  }
];

export type Who = 'men' | 'women';
/** Add-ons that only make sense for one side of the shop. */
const menOnly = ['beard-spa', 'brow-grooming'];
export const addonsFor = (who: Who) => addons.filter((a) => who === 'men' || !menOnly.includes(a.slug));
/** Photo ID of an add-on: A01, A02 ... Photos go in src/assets/catalogue/A01.jpg. */
export const addonId = (slug: string) => `A${String(addons.findIndex((a) => a.slug === slug) + 1).padStart(2, '0')}`;
