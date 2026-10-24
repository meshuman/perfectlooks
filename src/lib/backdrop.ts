// The colour-block backdrop for each catalogue item. One source for both the site's
// placeholders and the image prompts, so a real photo arrives on the same colour.

export interface Backdrop {
  name: string;
  hex: string;
  /** Tailwind class for the placeholder (tokens in global.css). */
  className: string;
}

export const BACKDROPS: Backdrop[] = [
  { name: 'Orange', hex: '#EC9465', className: 'bg-block-orange' },
  { name: 'Blush', hex: '#F7D9CE', className: 'bg-block-blush' },
  { name: 'Sky blue', hex: '#A9C9E8', className: 'bg-block-sky' },
  { name: 'Sage', hex: '#CADBD8', className: 'bg-block-sage' },
  { name: 'Sand', hex: '#D8CDBF', className: 'bg-block-sand' },
  { name: 'Plum', hex: '#B06A8F', className: 'bg-block-plum' },
];

const SAND = BACKDROPS[4]!;

/**
 * Hair colours always sit on sand, so the backdrop doesn't tint the shade being judged.
 * Everything else rotates through the six colours by ID: same ID, same colour.
 */
export function backdropFor(id: string): Backdrop {
  if (/^C\d/.test(id)) return SAND;
  const hash = [...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  return BACKDROPS[hash % BACKDROPS.length]!;
}
