import { useRef, useState } from 'preact/hooks';
import { COLS, fullGrid, matchPercent, PATTERNS, ROWS, starsFor, targetGrid, type Grid } from '@/lib/sculptor';
import { text } from '@/lib/ui';

// Skin and hair: level 0 is bare skin, each step up is longer hair.
const SKIN = '#EBCBB5';
const HAIR = ['transparent', 'rgba(17,17,17,0.28)', 'rgba(17,17,17,0.6)', 'rgba(17,17,17,0.92)'];

function Face({ grid, small = false }: { grid: Grid; small?: boolean }) {
  return (
    <div class={`grid gap-px ${small ? '' : 'gap-0.5'}`} style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, background: SKIN }}>
      {grid.map((level, i) => (
        <span key={i} class={small ? 'aspect-square' : 'block aspect-square'} style={{ background: `linear-gradient(${HAIR[level]},${HAIR[level]}), ${SKIN}` }} />
      ))}
    </div>
  );
}

const TOOLS = [0, 1, 2, 3] as const;

export default function BeardSculptor() {
  const [order, setOrder] = useState(() => PATTERNS.map((_, i) => i).sort(() => Math.random() - 0.5));
  const [step, setStep] = useState(0);
  const [grid, setGrid] = useState<Grid>(fullGrid);
  const [tool, setTool] = useState<number>(0);
  const [result, setResult] = useState<number | undefined>();
  const painting = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);

  const pattern = PATTERNS[order[step % order.length]!]!;
  const target = targetGrid(pattern.rows);

  const paint = (i: number) => {
    if (result !== undefined) return;
    setGrid((g) => (g[i] === tool ? g : g.map((v, j) => (j === i ? tool : v))));
  };

  const cellAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    const i = el?.dataset.cell;
    return i === undefined ? undefined : Number(i);
  };

  const next = () => {
    if ((step + 1) % order.length === 0) setOrder([...order].sort(() => Math.random() - 0.5));
    setStep(step + 1);
    setGrid(fullGrid());
    setResult(undefined);
  };

  const stars = result === undefined ? 0 : starsFor(result);

  return (
    <div class="mx-auto mt-6 max-w-md">
      <div class="flex items-center justify-between gap-3">
        <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('sculptor.target', { name: text(`sculptor.p.${pattern.key}`) })}</p>
        <div class="w-20 shrink-0 shadow-[0_0_0_1px_var(--color-line)]" aria-hidden="true">
          <Face grid={target} small />
        </div>
      </div>

      <p class="mt-3 text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('sculptor.yours')}</p>
      <div
        ref={boardRef}
        role="group"
        aria-label={text('sculptor.board')}
        class="mt-1.5 touch-none select-none shadow-[0_0_0_1px_var(--color-line)]"
        onPointerDown={(e) => {
          painting.current = true;
          const i = cellAt(e.clientX, e.clientY);
          if (i !== undefined) paint(i);
        }}
        onPointerMove={(e) => {
          if (!painting.current) return;
          const i = cellAt(e.clientX, e.clientY);
          if (i !== undefined) paint(i);
        }}
        onPointerUp={() => (painting.current = false)}
        onPointerLeave={() => (painting.current = false)}
        onPointerCancel={() => (painting.current = false)}
      >
        <div class="grid gap-0.5 p-0.5" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, background: SKIN }}>
          {grid.map((level, i) => (
            <button
              key={i}
              type="button"
              data-cell={i}
              tabIndex={i === 0 ? 0 : -1}
              aria-label={text('sculptor.cell', { row: String(Math.floor(i / COLS) + 1), col: String((i % COLS) + 1), level: text(`sculptor.tool${level}`) })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  paint(i);
                }
                const move = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: COLS, ArrowUp: -COLS }[e.key as 'ArrowRight'];
                if (move !== undefined) {
                  e.preventDefault();
                  const nextCell = boardRef.current?.querySelector<HTMLElement>(`[data-cell="${i + move}"]`);
                  if (nextCell) {
                    (e.currentTarget as HTMLElement).tabIndex = -1;
                    nextCell.tabIndex = 0;
                    nextCell.focus();
                  }
                }
              }}
              class="block aspect-square focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand"
              style={{ background: `linear-gradient(${HAIR[level]},${HAIR[level]}), ${SKIN}` }}
            />
          ))}
        </div>
      </div>

      <fieldset class="mt-3">
        <legend class="sr-only">{text('sculptor.clipper')}</legend>
        <div class="grid grid-cols-4 gap-1.5">
          {TOOLS.map((level) => (
            <label key={level} class="relative">
              <input type="radio" name="clipper" checked={tool === level} onChange={() => setTool(level)} class="peer sr-only" />
              <span class="flex min-h-14 flex-col items-center justify-center gap-1 bg-card text-[0.6875rem] font-semibold shadow-[inset_0_0_0_1px_var(--color-line)] peer-checked:bg-ink peer-checked:text-white peer-checked:shadow-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                <span class="size-4 shadow-[0_0_0_1px_var(--color-line)]" style={{ background: `linear-gradient(${HAIR[level]},${HAIR[level]}), ${SKIN}` }} aria-hidden="true" />
                {text(`sculptor.tool${level}`)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {result === undefined ? (
        <div class="mt-3 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setGrid(fullGrid())} class="min-h-12 bg-paper-2 text-sm font-semibold">
            {text('sculptor.reset')}
          </button>
          <button type="button" onClick={() => setResult(matchPercent(grid, target))} class="min-h-12 bg-ink text-sm font-semibold text-white">
            {text('sculptor.check')}
          </button>
        </div>
      ) : (
        <div class="mt-3 bg-paper-2 p-4 text-center" aria-live="polite">
          <p class="text-[1.5rem] leading-tight font-bold" aria-label={text('sculptor.stars', { n: String(stars) })}>
            <span class="text-brand" aria-hidden="true">{'★'.repeat(stars)}</span>
            <span class="text-line" aria-hidden="true">{'★'.repeat(3 - stars)}</span>
          </p>
          <p class="mt-1 text-[1.0625rem] font-semibold">{text('sculptor.result', { pct: String(result) })}</p>
          <div class="mt-3 flex justify-center gap-2">
            <button type="button" onClick={() => (setGrid(fullGrid()), setResult(undefined))} class="min-h-11 bg-card px-5 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--color-line)]">
              {text('play.again')}
            </button>
            <button type="button" onClick={next} class="min-h-11 bg-ink px-5 text-sm font-semibold text-white">
              {text('sculptor.next')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
