// KGF Unisex Saloon brand marks, redrawn as clean vectors from the shop sign.
// Plain JavaScript so the site, the social-preview script and the icon script share one source.

/** The crimson of the KGF block on the sign. White on it is 5.8:1. */
export const BRAND_RED = '#E0284F';

/**
 * The scissors mark: inverted scissors whose finger rings are eyes, with a moustache and a
 * smile at the pivot. Inner markup for a 100 x 100 viewBox.
 */
export function scissorsMark(color = '#ffffff') {
  return `<g fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M17 6 69 66"/>
  <path d="M83 6 31 66"/>
  <circle cx="24" cy="78" r="10"/>
  <circle cx="76" cy="78" r="10"/>
  <ellipse cx="38" cy="47" rx="6.5" ry="5"/>
  <ellipse cx="62" cy="47" rx="6.5" ry="5"/>
  <path d="M43 72q7 5.5 14 0"/>
</g>
<g fill="${color}">
  <circle cx="39" cy="47.5" r="2.2"/>
  <circle cx="61" cy="47.5" r="2.2"/>
  <path d="M50 60.5c-3.2-4.6-10.4-5.6-15-1.4-2.6 2.4-5.4 3.2-8.6 2.4 3.6 5 11.2 6.4 17 3.6 2.7-1.3 5-3 6.6-4.6 1.6 1.6 3.9 3.3 6.6 4.6 5.8 2.8 13.4 1.4 17-3.6-3.2.8-6-.0-8.6-2.4-4.6-4.2-11.8-3.2-15 1.4Z"/>
</g>`;
}

/**
 * The KGF block: bold white letters on crimson inside a white frame. A full SVG, 120 x 60.
 * `font` must be a family the renderer has loaded (the site loads Jost).
 * `white`: the one-colour version for dark backgrounds: a white block with the frame and
 * letters cut out in `cutout` (the background colour behind it).
 */
export function kgfBlock({
  font = '"Jost Variable", Jost, ui-sans-serif, sans-serif',
  title = 'KGF',
  white = false,
  cutout = '#111111',
} = {}) {
  const block = white ? '#ffffff' : BRAND_RED;
  const ink = white ? cutout : '#ffffff';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" role="img" aria-label="${title}">
  <rect width="120" height="60" fill="${block}"/>
  <rect x="3.5" y="3.5" width="113" height="53" fill="none" stroke="${ink}" stroke-width="2.2"/>
  <text x="60" y="47.5" text-anchor="middle" font-family='${font}' font-weight="800" font-size="47" letter-spacing="-1.5" fill="${ink}">KGF</text>
</svg>`;
}
