import { useEffect, useRef, useState } from 'preact/hooks';
import type { IconName } from '@/data/icons';
import { LIVES, level, NEEDS, serve, start, tick, type Rush } from '@/lib/rush';
import { text } from '@/lib/ui';
import Icon from './Icon';

// The five services, in the order the buttons appear. Names are rush.need1 ... rush.need5.
const SERVICES: { icon: IconName; bg: string }[] = [
  { icon: 'scissors', bg: '#EC9465' },
  { icon: 'beard', bg: '#CADBD8' },
  { icon: 'droplet', bg: '#A9C9E8' },
  { icon: 'sparkles', bg: '#F7D9CE' },
  { icon: 'hand', bg: '#D8CDBF' },
];

const KEY = 'pl:rush-best';

export default function BarberRush() {
  const [game, setGame] = useState<Rush | undefined>();
  const [now, setNow] = useState(0);
  const [best, setBest] = useState(0);
  const gameRef = useRef<Rush | undefined>(undefined);

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(KEY)) || 0);
    } catch {
      // Storage blocked: the best score just isn't remembered.
    }
  }, []);

  const set = (next: Rush) => {
    gameRef.current = next;
    setGame(next);
  };

  // The shop clock: customers wait, walk out and walk in on this tick.
  useEffect(() => {
    if (!game || game.over) return;
    const timer = setInterval(() => {
      const t = performance.now();
      setNow(t);
      if (gameRef.current) set(tick(gameRef.current, t));
    }, 100);
    return () => clearInterval(timer);
  }, [game?.over, game === undefined]);

  useEffect(() => {
    if (!game?.over) return;
    if (game.score > best) {
      setBest(game.score);
      try {
        localStorage.setItem(KEY, String(game.score));
      } catch {
        // Ignore.
      }
    }
  }, [game?.over]);

  const open = () => {
    const t = performance.now();
    setNow(t);
    set(start(t));
  };

  const tap = (need: number) => {
    if (gameRef.current) set(serve(gameRef.current, need, performance.now()));
  };

  const name = (need: number) => text(`rush.need${need + 1}`);

  return (
    <div class="mx-auto mt-6 max-w-md">
      <div class="flex items-stretch gap-2">
        <div class="flex-1 bg-paper-2 px-4 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('play.score')}</p>
          <p class="text-[1.5rem] leading-tight font-bold tabular-nums">{game?.score ?? 0}</p>
        </div>
        <div class="flex-1 bg-paper-2 px-4 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('play.best')}</p>
          <p class="text-[1.5rem] leading-tight font-bold tabular-nums">{best}</p>
        </div>
        <div class="flex-1 bg-paper-2 px-4 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('rush.hearts')}</p>
          <p class="text-[1.5rem] leading-tight font-bold text-brand" aria-label={`${game?.lives ?? LIVES} / ${LIVES}`}>
            {'♥'.repeat(game?.lives ?? LIVES)}
            <span class="text-line">{'♥'.repeat(LIVES - (game?.lives ?? LIVES))}</span>
          </p>
        </div>
      </div>

      <div class="relative mt-3 bg-ink/90 p-3">
        <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted-dark uppercase">
          {text('rush.queue')}
          {game && game.combo > 1 ? <span class="ml-2 text-gold">{text('rush.combo', { n: String(game.combo) })}</span> : null}
        </p>
        <ul class="mt-2 grid min-h-[8.5rem] grid-cols-4 gap-2" aria-live="off">
          {Array.from({ length: 4 }, (_, i) => {
            const c = game?.customers[i];
            if (!c) return <li key={`empty-${i}`} class="bg-white/5" />;
            const s = SERVICES[c.need]!;
            const left = Math.max(0, 1 - (now - c.born) / c.patience);
            return (
              <li key={c.id} class="flex flex-col items-center justify-between gap-1 p-1.5 text-ink" style={{ background: s.bg }} aria-label={name(c.need)}>
                <Icon name={s.icon} size={28} strokeWidth={1.5} />
                <span class="text-center text-[0.5625rem] leading-tight font-semibold uppercase" aria-hidden="true">{name(c.need)}</span>
                <span class="block h-1.5 w-full bg-ink/15" aria-hidden="true">
                  <span class="block h-full" style={{ width: `${left * 100}%`, background: left > 0.5 ? '#2e7d4f' : left > 0.25 ? '#c98a00' : '#b0163a' }} />
                </span>
              </li>
            );
          })}
        </ul>

        {!game && (
          <div class="absolute inset-0 grid place-items-center bg-ink/85 p-4 text-center text-white">
            <button type="button" onClick={open} class="min-h-12 bg-brand px-6 text-sm font-semibold tracking-[0.12em] text-white uppercase">
              {text('rush.start')}
            </button>
          </div>
        )}
        {game?.over && (
          <div class="absolute inset-0 grid place-items-center bg-ink/85 p-4 text-center text-white">
            <div>
              <p class="text-[1.5rem] leading-tight font-bold">{text('rush.over')}</p>
              <p class="mt-1 text-sm text-muted-dark">{text('rush.overText', { n: String(game.served), score: String(game.score) })}</p>
              <button type="button" onClick={open} class="mt-4 min-h-11 bg-brand px-5 text-sm font-semibold text-white">
                {text('play.again')}
              </button>
            </div>
          </div>
        )}
      </div>

      <p class="mt-3 text-center text-[0.8125rem] text-muted">
        {game && !game.over ? text('rush.level', { n: String(level(game) + 1) }) : text('rush.hint')}
      </p>

      <div class="mt-2 grid grid-cols-5 gap-1.5">
        {Array.from({ length: NEEDS }, (_, need) => {
          const s = SERVICES[need]!;
          return (
            <button
              key={need}
              type="button"
              disabled={!game || game.over}
              onClick={() => tap(need)}
              class="flex min-h-[4.5rem] flex-col items-center justify-center gap-1 px-0.5 text-ink transition duration-150 active:scale-95 disabled:opacity-50"
              style={{ background: s.bg }}
            >
              <Icon name={s.icon} size={26} strokeWidth={1.5} />
              <span class="text-center text-[0.5625rem] leading-tight font-bold uppercase">{name(need)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
