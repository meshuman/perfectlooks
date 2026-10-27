// Women's Learn guides. The words live in en.json (wguide.<slug>.*) so they are translated like the rest of the screen text.
import type { IconName } from './icons';

export type GuideTopic = 'skin' | 'hair' | 'body' | 'brows' | 'makeup';

export interface Guide {
  slug: string;
  topic: GuideTopic;
  minutes: number;
}

export const guideIcon: Record<GuideTopic, IconName> = { skin: 'star', hair: 'scissors', body: 'leaf', brows: 'eye', makeup: 'sparkle' };

export const womenGuides: Guide[] = [
  {
    slug: 'facial-how-often',
    topic: 'skin',
    minutes: 2
  },
  {
    slug: 'colour-salon-or-home',
    topic: 'hair',
    minutes: 2
  },
  {
    slug: 'waxing-aftercare',
    topic: 'body',
    minutes: 1
  },
  {
    slug: 'keratin-aftercare',
    topic: 'hair',
    minutes: 2
  },
  {
    slug: 'brow-shape',
    topic: 'brows',
    minutes: 2
  },
  {
    slug: 'wedding-prep',
    topic: 'makeup',
    minutes: 3
  }
];
