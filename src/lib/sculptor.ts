// The rules of Fade & Beard Sculptor. The face is a grid of hair patches; each patch has a length from
// 0 (shaved) to 3 (long). A target style says what every patch should be; the player trims to match.

export const COLS = 9;
export const ROWS = 7;
export type Grid = number[];

/** Target styles, cheeks at the top to chin at the bottom. One digit per patch. */
export const PATTERNS: { key: string; rows: string[] }[] = [
  { key: 'goatee', rows: ['000000000', '000000000', '000333000', '000333000', '000333000', '000333000', '000000000'] },
  { key: 'chinstrap', rows: ['200000002', '200000002', '200000002', '030000030', '003333300', '000000000', '000000000'] },
  { key: 'fade', rows: ['000000000', '100000001', '211111112', '222222222', '233333332', '233333332', '123333321'] },
  { key: 'stubble', rows: ['000000000', '011111110', '111111111', '111111111', '111111111', '011111110', '000111000'] },
  { key: 'vandyke', rows: ['000000000', '000000000', '000000000', '003333300', '000000000', '000333000', '000333000'] },
];

export const targetGrid = (rows: string[]): Grid => rows.join('').split('').map(Number);

/** A full, untrimmed beard. */
export const fullGrid = (): Grid => Array<number>(COLS * ROWS).fill(3);

/** How close the trim is: a patch counts fully when it matches and half when it is one length off. */
export function matchPercent(grid: Grid, target: Grid): number {
  const points = grid.reduce((sum, level, i) => sum + (level === target[i] ? 1 : Math.abs(level - target[i]!) === 1 ? 0.5 : 0), 0);
  return Math.round((points / target.length) * 100);
}

export const starsFor = (percent: number): number => (percent >= 90 ? 3 : percent >= 70 ? 2 : percent >= 50 ? 1 : 0);
