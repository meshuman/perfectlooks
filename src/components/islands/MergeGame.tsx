import { useEffect, useRef, useState } from 'preact/hooks';
import { menuMark } from '@/data/brand-marks.mjs';
import { canMove, highestTier, move, newGame, spawn, TOP_TIER, type Board, type Direction } from '@/lib/merge';
import { text } from '@/lib/ui';

// The tiers, smallest to largest: a salon's tools and treatments, ending in the looksmenu mark.
const TIERS: { emoji: string; bg: string; fg: string }[] = [
  { emoji: '🧴', bg: '#EC9465', fg: '#111111' },
  { emoji: '🪒', bg: '#F7D9CE', fg: '#111111' },
  { emoji: '✂️', bg: '#A9C9E8', fg: '#111111' },
  { emoji: '💈', bg: '#CADBD8', fg: '#111111' },
  { emoji: '💄', bg: '#D8CDBF', fg: '#111111' },
  { emoji: '💅', bg: '#B06A8F', fg: '#ffffff' },
  { emoji: '🪞', bg: '#F2667F', fg: '#111111' },
  { emoji: '💇', bg: '#E0284F', fg: '#ffffff' },
  { emoji: '💆', bg: '#B0163A', fg: '#ffffff' },
  { emoji: '👑', bg: '#111111', fg: '#ffffff' },
  { emoji: '', bg: '#E0284F', fg: '#ffffff' },
];

const KEY = 'pl:merge';
interface Saved {
  board: Board;
  score: number;
  best: number;
  won: boolean;
}

const load = (): Saved | undefined => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Saved | null;
    if (saved && Array.isArray(saved.board) && saved.board.length === 16) return saved;
  } catch {
    // Storage blocked or empty: start fresh.
  }
  return undefined;
};

const ARROWS: Record<string, Direction> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
const arrow = { up: '↑', down: '↓', left: '←', right: '→' } as const;

export default function MergeGame() {
  const [board, setBoard] = useState<Board>(() => newGame());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [won, setWon] = useState(false);
  const [dismissedWin, setDismissedWin] = useState(false);
  const [previous, setPrevious] = useState<{ board: Board; score: number } | undefined>();
  const [popped, setPopped] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const touch = useRef<{ x: number; y: number } | undefined>(undefined);

  // The saved game is read after the first render, so a stale save can't break the first paint.
  useEffect(() => {
    const saved = load();
    if (saved) {
      setBoard(saved.board);
      setScore(saved.score);
      setBest(saved.best);
      setWon(saved.won);
      setDismissedWin(saved.won);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ board, score, best, won } satisfies Saved));
    } catch {
      // Storage blocked: the game still works, it just won't be remembered.
    }
  }, [board, score, best, won, ready]);

  const over = !canMove(board);
  const showWin = won && !dismissedWin;

  const play = (direction: Direction) => {
    if (over || showWin) return;
    const result = move(board, direction);
    if (!result.moved) return;
    const spawned = spawn(result.board);
    const added = spawned.findIndex((tier, i) => tier !== 0 && result.board[i] === 0);
    const merged = result.board.flatMap((tier, i) => (tier !== 0 && tier !== board[i] && board[i] !== 0 ? [i] : []));
    setPrevious({ board, score });
    setBoard(spawned);
    setScore(score + result.gained);
    setBest(Math.max(best, score + result.gained));
    setPopped([...merged, added].filter((i) => i >= 0));
    if (highestTier(spawned) >= TOP_TIER) setWon(true);
  };

  const restart = () => {
    setBoard(newGame());
    setScore(0);
    setWon(false);
    setDismissedWin(false);
    setPrevious(undefined);
    setPopped([]);
  };

  const undo = () => {
    if (!previous) return;
    setBoard(previous.board);
    setScore(previous.score);
    setPrevious(undefined);
    setPopped([]);
  };

  const onKey = (e: KeyboardEvent) => {
    const direction = ARROWS[e.key];
    if (!direction) return;
    e.preventDefault();
    play(direction);
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touch.current;
    touch.current = undefined;
    const end = e.changedTouches[0];
    if (!start || !end) return;
    const dx = end.clientX - start.x;
    const dy = end.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    play(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
  };

  const name = (tier: number) => text(`play.tier${tier}`);
  const biggest = highestTier(board);

  return (
    <div class="mx-auto mt-6 max-w-md">
      <div class="flex items-stretch gap-2">
        <div class="flex-1 bg-paper-2 px-4 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('play.score')}</p>
          <p class="text-[1.5rem] leading-tight font-bold tabular-nums">{score}</p>
        </div>
        <div class="flex-1 bg-paper-2 px-4 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('play.best')}</p>
          <p class="text-[1.5rem] leading-tight font-bold tabular-nums">{best}</p>
        </div>
        <button type="button" onClick={undo} disabled={!previous} class="min-h-11 bg-paper-2 px-4 text-sm font-semibold disabled:text-muted disabled:opacity-60">
          {text('play.undo')}
        </button>
        <button type="button" onClick={restart} class="min-h-11 bg-ink px-4 text-sm font-semibold text-white">
          {text('play.new')}
        </button>
      </div>

      <div class="relative mt-3">
        <div
          role="group"
          tabIndex={0}
          aria-label={text('play.board')}
          onKeyDown={onKey}
          onTouchStart={(e) => (touch.current = { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY })}
          onTouchEnd={onTouchEnd}
          class="grid aspect-square touch-none grid-cols-4 gap-2 bg-ink/90 p-2 outline-offset-4 focus-visible:outline-2 focus-visible:outline-brand"
        >
          {board.map((tier, i) => {
            const t = tier ? TIERS[tier - 1]! : undefined;
            return (
              <div
                key={i}
                role="img"
                aria-label={tier ? name(tier) : text('play.empty')}
                class={`relative grid place-items-center overflow-hidden ${popped.includes(i) ? 'merge-pop' : ''}`}
                style={{ background: t?.bg ?? 'rgba(255,255,255,0.08)', color: t?.fg }}
              >
                {tier === TOP_TIER ? (
                  <svg viewBox="0 0 100 100" class="size-[70%]" aria-hidden="true" dangerouslySetInnerHTML={{ __html: menuMark('#ffffff') }} />
                ) : tier ? (
                  <span class="flex flex-col items-center gap-0.5 leading-none">
                    <span class="text-[1.875rem] sm:text-[2.25rem]" aria-hidden="true">{t!.emoji}</span>
                    <span class="px-1 text-center text-[0.5625rem] font-semibold tracking-wide uppercase sm:text-[0.625rem]" aria-hidden="true">{name(tier)}</span>
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        {(showWin || over) && (
          <div class="absolute inset-0 grid place-items-center bg-ink/80 p-6 text-center text-white">
            <div>
              <p class="text-[1.5rem] leading-tight font-bold">{showWin ? text('play.won') : text('play.over')}</p>
              <p class="mt-1 text-sm text-muted-dark">{text('play.scoreNow', { score: String(score) })}</p>
              <div class="mt-4 flex justify-center gap-2">
                {showWin && (
                  <button type="button" onClick={() => setDismissedWin(true)} class="min-h-11 bg-white px-5 text-sm font-semibold text-ink">
                    {text('play.keepGoing')}
                  </button>
                )}
                <button type="button" onClick={restart} class="min-h-11 bg-brand px-5 text-sm font-semibold text-white">
                  {text('play.again')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <p class="mt-3 text-center text-[0.8125rem] text-muted">{text('play.how')}</p>

      <div class="mx-auto mt-2 grid w-40 grid-cols-3 gap-1.5">
        {(['up', 'left', 'down', 'right'] as const).map((d) => (
          <button
            key={d}
            type="button"
            aria-label={text(`play.${d}`)}
            onClick={() => play(d)}
            class={`grid h-11 place-items-center bg-paper-2 text-[1.125rem] font-semibold active:bg-line ${d === 'up' ? 'col-start-2' : ''} ${d === 'left' ? 'col-start-1 row-start-2' : ''} ${d === 'down' ? 'col-start-2 row-start-2' : ''} ${d === 'right' ? 'col-start-3 row-start-2' : ''}`}
          >
            {arrow[d]}
          </button>
        ))}
      </div>

      <section class="mt-8" aria-labelledby="chain-title">
        <h2 id="chain-title" class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('play.chain')}</h2>
        <ol class="mt-3 flex flex-wrap gap-1.5">
          {TIERS.map((t, i) => (
            <li
              key={i}
              class={`grid size-11 place-items-center ${i + 1 > biggest ? 'opacity-40' : ''}`}
              style={{ background: t.bg, color: t.fg }}
              title={name(i + 1)}
            >
              {i + 1 === TOP_TIER ? (
                <svg viewBox="0 0 100 100" class="size-8" aria-hidden="true" dangerouslySetInnerHTML={{ __html: menuMark('#ffffff') }} />
              ) : (
                <span class="text-[1.375rem]" aria-hidden="true">{t.emoji}</span>
              )}
              <span class="sr-only">{name(i + 1)}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
