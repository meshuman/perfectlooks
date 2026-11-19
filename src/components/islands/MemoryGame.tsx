import { useEffect, useState } from 'preact/hooks';
import { text } from '@/lib/ui';

// Eight salon items, each twice. The names are the same ones the Merge game uses (play.tier1 ... play.tier8).
const FACES = ['🧴', '🪒', '✂️', '💈', '💄', '💅', '🪞', '💇'];
const KEY = 'pl:memory-best';

interface Card {
  face: number;
}

const deal = (): Card[] => {
  const cards = FACES.flatMap((_, face) => [{ face }, { face }]);
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j]!, cards[i]!];
  }
  return cards;
};

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(() => deal());
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(KEY)) || 0);
    } catch {
      // Storage blocked: the best score just isn't remembered.
    }
  }, []);

  const won = matched.length === cards.length;

  // Two cards face up: keep them if they match, otherwise turn them back after a moment.
  useEffect(() => {
    if (open.length !== 2) return;
    const [a, b] = open as [number, number];
    if (cards[a]!.face === cards[b]!.face) {
      setMatched((m) => [...m, a, b]);
      setOpen([]);
      return;
    }
    const timer = setTimeout(() => setOpen([]), 800);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!won || moves === 0) return;
    if (best === 0 || moves < best) {
      setBest(moves);
      try {
        localStorage.setItem(KEY, String(moves));
      } catch {
        // Ignore.
      }
    }
  }, [won]);

  const flip = (i: number) => {
    if (open.length >= 2 || open.includes(i) || matched.includes(i)) return;
    if (open.length === 1) setMoves(moves + 1);
    setOpen([...open, i]);
  };

  const restart = () => {
    setCards(deal());
    setOpen([]);
    setMatched([]);
    setMoves(0);
  };

  const name = (face: number) => text(`play.tier${face + 1}`);

  return (
    <div class="mx-auto mt-6 max-w-md">
      <div class="flex items-stretch gap-2">
        <div class="flex-1 bg-paper-2 px-4 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('memory.moves')}</p>
          <p class="text-[1.5rem] leading-tight font-bold tabular-nums">{moves}</p>
        </div>
        <div class="flex-1 bg-paper-2 px-4 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('memory.best')}</p>
          <p class="text-[1.5rem] leading-tight font-bold tabular-nums">{best || '-'}</p>
        </div>
        <button type="button" onClick={restart} class="min-h-11 bg-ink px-4 text-sm font-semibold text-white">
          {text('play.new')}
        </button>
      </div>

      <p class="mt-3 text-center text-[0.8125rem] text-muted" aria-live="polite">
        {text('memory.pairs', { found: String(matched.length / 2), total: String(FACES.length) })}
      </p>

      <div class="relative mt-2">
        <div class="grid aspect-square grid-cols-4 gap-2 bg-ink/90 p-2">
          {cards.map((card, i) => {
            const faceUp = open.includes(i) || matched.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() => flip(i)}
                aria-label={faceUp ? name(card.face) : text('memory.faceDown', { n: String(i + 1) })}
                aria-pressed={faceUp}
                class={`grid place-items-center overflow-hidden text-[1.875rem] transition-colors duration-300 sm:text-[2.25rem] ${
                  matched.includes(i) ? 'bg-block-sage' : faceUp ? 'bg-block-blush' : 'bg-brand'
                }`}
              >
                {faceUp ? (
                  <span class="flex flex-col items-center gap-0.5 leading-none text-ink">
                    <span aria-hidden="true">{FACES[card.face]}</span>
                    <span class="px-1 text-center text-[0.5625rem] font-semibold tracking-wide uppercase" aria-hidden="true">{name(card.face)}</span>
                  </span>
                ) : (
                  <span class="text-[1.5rem] font-bold text-white" aria-hidden="true">?</span>
                )}
              </button>
            );
          })}
        </div>

        {won && (
          <div class="absolute inset-0 grid place-items-center bg-ink/80 p-6 text-center text-white">
            <div>
              <p class="text-[1.5rem] leading-tight font-bold">{text('memory.won', { moves: String(moves) })}</p>
              <button type="button" onClick={restart} class="mt-4 min-h-11 bg-brand px-5 text-sm font-semibold text-white">
                {text('play.again')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
