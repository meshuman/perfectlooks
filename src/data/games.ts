import type { IconName } from './icons';

// The games on /play. Each one has a page at /play/<slug>; its words live in en.json (game.<slug>.*).
export interface Game {
  slug: 'merge' | 'memory' | 'quiz';
  /** Shown on the hub card, from the site's own icon set. */
  icon: IconName;
  /** Colour block class for the hub card. */
  block: string;
  /** How many numbered rules game.<slug>.r1... the page lists. */
  rules: number;
}

export const games: Game[] = [
  { slug: 'merge', icon: 'puzzle', block: 'bg-block-sky', rules: 5 },
  { slug: 'memory', icon: 'sparkles', block: 'bg-block-blush', rules: 3 },
  { slug: 'quiz', icon: 'scissors', block: 'bg-block-sage', rules: 4 },
];

export const gameBySlug = (slug: string) => games.find((g) => g.slug === slug);
