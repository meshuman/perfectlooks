// The rules of Style Match, a swap-and-match puzzle with salon items, free of the screen so they can be tested.
// Swap two neighbouring tiles; three or more of a kind in a row or column clear, the rest fall, and new ones drop in.
// Chains that start by themselves score more.

export const SIZE = 8;
export const TYPES = 6;
export const EMPTY = -1;
export type Grid = number[];

const at = (g: Grid, r: number, c: number) => g[r * SIZE + c]!;

/** Every cell that is part of a run of three or more. */
export function findMatches(g: Grid): Set<number> {
  const out = new Set<number>();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE - 2; c++) {
      const t = at(g, r, c);
      if (t !== EMPTY && t === at(g, r, c + 1) && t === at(g, r, c + 2)) [0, 1, 2].forEach((k) => out.add(r * SIZE + c + k));
    }
  }
  for (let c = 0; c < SIZE; c++) {
    for (let r = 0; r < SIZE - 2; r++) {
      const t = at(g, r, c);
      if (t !== EMPTY && t === at(g, r + 1, c) && t === at(g, r + 2, c)) [0, 1, 2].forEach((k) => out.add((r + k) * SIZE + c));
    }
  }
  return out;
}

/** A full board with no matches to start with. */
export function newBoard(rand: () => number = Math.random): Grid {
  const g: Grid = Array<number>(SIZE * SIZE).fill(EMPTY);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      let t: number;
      do {
        t = Math.floor(rand() * TYPES);
      } while ((c >= 2 && at(g, r, c - 1) === t && at(g, r, c - 2) === t) || (r >= 2 && at(g, r - 1, c) === t && at(g, r - 2, c) === t));
      g[r * SIZE + c] = t;
    }
  }
  return g;
}

export const adjacent = (a: number, b: number) => {
  const dr = Math.abs(Math.floor(a / SIZE) - Math.floor(b / SIZE));
  const dc = Math.abs((a % SIZE) - (b % SIZE));
  return dr + dc === 1;
};

export function swap(g: Grid, a: number, b: number): Grid {
  const next = [...g];
  [next[a], next[b]] = [next[b]!, next[a]!];
  return next;
}

/** A swap is allowed only if it makes a match. */
export const isValidSwap = (g: Grid, a: number, b: number) => adjacent(a, b) && findMatches(swap(g, a, b)).size > 0;

export function hasMove(g: Grid): boolean {
  for (let i = 0; i < g.length; i++) {
    if (i % SIZE < SIZE - 1 && isValidSwap(g, i, i + 1)) return true;
    if (i + SIZE < g.length && isValidSwap(g, i, i + SIZE)) return true;
  }
  return false;
}

export interface Step {
  /** The cells that clear in this round. */
  cleared: number[];
  /** The board after they clear, the rest fall and new tiles drop in. */
  grid: Grid;
  /** Points for this round. */
  points: number;
}

/** Plays out the chain reaction after a move, one round at a time. */
export function resolve(start: Grid, rand: () => number = Math.random): Step[] {
  const steps: Step[] = [];
  let g = start;
  let chain = 0;
  for (;;) {
    const matched = findMatches(g);
    if (matched.size === 0) break;
    chain++;
    const next = [...g];
    matched.forEach((i) => (next[i] = EMPTY));
    // Gravity: tiles fall to the bottom of their column; new ones fill the top.
    for (let c = 0; c < SIZE; c++) {
      const kept: number[] = [];
      for (let r = SIZE - 1; r >= 0; r--) if (next[r * SIZE + c] !== EMPTY) kept.push(next[r * SIZE + c]!);
      for (let r = SIZE - 1; r >= 0; r--) next[r * SIZE + c] = kept[SIZE - 1 - r] ?? Math.floor(rand() * TYPES);
    }
    steps.push({ cleared: [...matched], grid: next, points: matched.size * 10 * chain + Math.max(0, matched.size - 3) * 10 });
    g = next;
  }
  return steps;
}

/** The target to reach in each level. */
export const goalFor = (level: number) => 500 + (level - 1) * 300;
export const MOVES = 20;
