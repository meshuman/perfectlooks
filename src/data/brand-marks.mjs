// looksmenu brand marks, drawn as clean vectors.
// Plain JavaScript so the site, the social-preview script and the icon script share one source.

/** The brand crimson. White on it is 5.8:1. */
export const BRAND_RED = '#E0284F';

/**
 * The looksmenu mark: a menu card (three lines, the last one short) with a sparkle at its corner,
 * "looks" served as a menu. Inner markup for a 100 x 100 viewBox, drawn in one colour.
 */
export function menuMark(color = '#ffffff') {
  return `<g fill="none" stroke="${color}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M24 38h30"/>
  <path d="M24 54h52"/>
  <path d="M24 70h34"/>
</g>
<path fill="${color}" d="M72 20c.9 6.2 3.8 9.1 10 10-6.2.9-9.1 3.8-10 10-.9-6.2-3.8-9.1-10-10 6.2-.9 9.1-3.8 10-10Z"/>`;
}
