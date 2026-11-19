// The rules of the Merge puzzle, kept free of the screen so they can be tested: a 4 x 4 board of tiers
// (0 is empty, 1 is the smallest item). Sliding moves every tile as far as it goes; two equal tiles
// that meet merge into the next tier, once per move.

export const SIZE = 4;
export const TOP_TIER = 11;
export type Board = number[];
export type Direction = 'up' | 'down' | 'left' | 'right';

export const emptyBoard = (): Board => Array<number>(SIZE * SIZE).fill(0);

/** Slides and merges one line toward its start. */
function slideLine(line: number[]): { line: number[]; gained: number } {
  const tiles = line.filter(Boolean);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === tiles[i + 1] && tiles[i]! < TOP_TIER) {
      const merged = tiles[i]! + 1;
      out.push(merged);
      gained += 2 ** merged;
      i++;
    } else out.push(tiles[i]!);
  }
  while (out.length < SIZE) out.push(0);
  return { line: out, gained };
}

/** The lines of the board in the order a move reads them, each starting at the edge tiles slide toward. */
function lines(direction: Direction): number[][] {
  const rows = Array.from({ length: SIZE }, (_, r) => Array.from({ length: SIZE }, (_, c) => r * SIZE + c));
  const cols = Array.from({ length: SIZE }, (_, c) => Array.from({ length: SIZE }, (_, r) => r * SIZE + c));
  if (direction === 'left') return rows;
  if (direction === 'right') return rows.map((r) => [...r].reverse());
  if (direction === 'up') return cols;
  return cols.map((c) => [...c].reverse());
}

export function move(board: Board, direction: Direction): { board: Board; gained: number; moved: boolean } {
  const next = [...board];
  let gained = 0;
  for (const indexes of lines(direction)) {
    const result = slideLine(indexes.map((i) => board[i]!));
    gained += result.gained;
    indexes.forEach((boardIndex, n) => (next[boardIndex] = result.line[n]!));
  }
  return { board: next, gained, moved: next.some((tier, i) => tier !== board[i]) };
}

/** Puts a new tile (usually the smallest item, sometimes the next) in a random empty cell. */
export function spawn(board: Board, random: () => number = Math.random): Board {
  const free = board.flatMap((tier, i) => (tier === 0 ? [i] : []));
  if (free.length === 0) return board;
  const next = [...board];
  next[free[Math.floor(random() * free.length)]!] = random() < 0.9 ? 1 : 2;
  return next;
}

export const newGame = (random: () => number = Math.random): Board => spawn(spawn(emptyBoard(), random), random);

export const canMove = (board: Board): boolean => (['up', 'down', 'left', 'right'] as const).some((d) => move(board, d).moved);

export const highestTier = (board: Board): number => Math.max(0, ...board);
