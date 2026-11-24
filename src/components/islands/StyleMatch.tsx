import { useEffect, useRef, useState } from 'preact/hooks';
import { adjacent, goalFor, hasMove, isValidSwap, MOVES, newBoard, resolve, SIZE, swap, type Grid } from '@/lib/match3';
import { text } from '@/lib/ui';

// Six salon items. Names are play.tier1 ... play.tier6 (shampoo, razor, scissors, barber pole, lipstick, nail polish).
const TILES = [
  { emoji: '🧴', bg: '#EC9465' },
  { emoji: '🪒', bg: '#F7D9CE' },
  { emoji: '✂️', bg: '#A9C9E8' },
  { emoji: '💈', bg: '#CADBD8' },
  { emoji: '💄', bg: '#D8CDBF' },
  { emoji: '💅', bg: '#B06A8F' },
];

const KEY = 'pl:match-best';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function StyleMatch() {
  const [grid, setGrid] = useState<Grid>(() => newBoard());
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(MOVES);
  const [selected, setSelected] = useState<number | undefined>();
  const [clearing, setClearing] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [best, setBest] = useState(1);
  const [note, setNote] = useState('');
  const down = useRef<{ i: number; x: number; y: number } | undefined>(undefined);

  const goal = goalFor(level);
  const won = score >= goal;
  const lost = !won && moves === 0 && !busy;

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(KEY)) || 1);
    } catch {
      // Storage blocked: the best level just isn't remembered.
    }
  }, []);

  useEffect(() => {
    if (won && level > best) {
      setBest(level);
      try {
        localStorage.setItem(KEY, String(level));
      } catch {
        // Ignore.
      }
    }
  }, [won]);

  const attempt = async (a: number, b: number) => {
    if (busy || won || moves === 0) return;
    setSelected(undefined);
    setBusy(true);
    const swapped = swap(grid, a, b);
    setGrid(swapped);
    if (!isValidSwap(grid, a, b)) {
      // No match: the tiles slide back.
      setNote(text('match.noMatch'));
      await wait(260);
      setGrid(grid);
      setBusy(false);
      return;
    }
    setNote('');
    setMoves((m) => m - 1);
    let current = swapped;
    let gained = 0;
    for (const step of resolve(swapped)) {
      setClearing(step.cleared);
      await wait(260);
      setClearing([]);
      current = step.grid;
      gained += step.points;
      setGrid(step.grid);
      setScore((s) => s + step.points);
      await wait(200);
    }
    if (gained > 0 && !hasMove(current)) {
      // Nothing left to swap: deal a fresh board.
      setNote(text('match.shuffled'));
      setGrid(newBoard());
    }
    setBusy(false);
  };

  const tap = (i: number) => {
    if (busy) return;
    if (selected === undefined) return setSelected(i);
    if (selected === i) return setSelected(undefined);
    if (adjacent(selected, i)) return void attempt(selected, i);
    setSelected(i);
  };

  const onUp = (e: PointerEvent, i: number) => {
    const start = down.current;
    down.current = undefined;
    if (!start || start.i !== i) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return tap(i);
    // A swipe swaps with the neighbour in that direction.
    const row = Math.floor(i / SIZE);
    const col = i % SIZE;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const to = horizontal ? (dx > 0 ? col + 1 < SIZE && i + 1 : col > 0 && i - 1) : dy > 0 ? row + 1 < SIZE && i + SIZE : row > 0 && i - SIZE;
    if (to !== false && to !== undefined) void attempt(i, to);
  };

  const restart = (nextLevel: number) => {
    setLevel(nextLevel);
    setGrid(newBoard());
    setScore(0);
    setMoves(MOVES);
    setSelected(undefined);
    setClearing([]);
    setNote('');
  };

  const name = (type: number) => text(`play.tier${type + 1}`);

  return (
    <div class="mx-auto mt-6 max-w-md">
      <div class="flex items-stretch gap-2">
        <div class="flex-1 bg-paper-2 px-3 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('match.level', { n: String(level) })}</p>
          <p class="text-[1.25rem] leading-tight font-bold tabular-nums">
            {score} <span class="text-[0.8125rem] font-medium text-muted">/ {goal}</span>
          </p>
        </div>
        <div class="flex-1 bg-paper-2 px-3 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('match.moves')}</p>
          <p class="text-[1.25rem] leading-tight font-bold tabular-nums">{moves}</p>
        </div>
        <div class="flex-1 bg-paper-2 px-3 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('play.best')}</p>
          <p class="text-[1.25rem] leading-tight font-bold tabular-nums">{text('match.level', { n: String(best) })}</p>
        </div>
      </div>

      <div class="mt-3 h-2 bg-paper-2" aria-hidden="true">
        <div class="h-full bg-brand transition-[width] duration-300" style={{ width: `${Math.min(100, (score / goal) * 100)}%` }} />
      </div>

      <div class="relative mt-3">
        <div role="group" aria-label={text('match.board')} class="grid touch-none select-none grid-cols-8 gap-1 bg-ink/90 p-1.5">
          {grid.map((type, i) => {
            const t = TILES[type]!;
            const isSel = selected === i;
            const isClearing = clearing.includes(i);
            return (
              <button
                key={i}
                type="button"
                aria-label={`${name(type)}, ${text('match.cell', { row: String(Math.floor(i / SIZE) + 1), col: String((i % SIZE) + 1) })}`}
                aria-pressed={isSel}
                onPointerDown={(e) => (down.current = { i, x: e.clientX, y: e.clientY })}
                onPointerUp={(e) => onUp(e, i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    tap(i);
                  }
                }}
                class={`grid aspect-square place-items-center text-[1.25rem] transition duration-200 sm:text-[1.625rem] ${isSel ? 'scale-90 ring-2 ring-white' : ''} ${isClearing ? 'scale-50 opacity-30' : ''}`}
                style={{ background: t.bg }}
              >
                <span aria-hidden="true">{t.emoji}</span>
              </button>
            );
          })}
        </div>

        {(won || lost) && (
          <div class="absolute inset-0 grid place-items-center bg-ink/85 p-6 text-center text-white">
            <div>
              <p class="text-[1.5rem] leading-tight font-bold">{won ? text('match.won', { n: String(level) }) : text('match.lost')}</p>
              <p class="mt-1 text-sm text-muted-dark">{text('play.scoreNow', { score: String(score) })}</p>
              <button type="button" onClick={() => restart(won ? level + 1 : 1)} class="mt-4 min-h-11 bg-brand px-5 text-sm font-semibold text-white">
                {won ? text('match.next') : text('play.again')}
              </button>
            </div>
          </div>
        )}
      </div>

      <p class="mt-3 min-h-5 text-center text-[0.8125rem] text-muted" aria-live="polite">{note || text('match.hint')}</p>
    </div>
  );
}
