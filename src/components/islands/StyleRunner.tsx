import { useEffect, useRef, useState } from 'preact/hooks';
import { menuMark } from '@/data/brand-marks.mjs';
import {
  COINS, ENEMY_H, ENEMY_W, FLOOR_Y, GOAL, LEVEL_W, PLAYER_H, PLAYER_W, solids, start, step, VIEW_H, VIEW_W,
  type Input, type Runner,
} from '@/lib/runner';
import { text } from '@/lib/ui';

const KEY = 'pl:runner-best';
const KEYS: Record<string, keyof Input> = {
  ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'jump', w: 'jump', W: 'jump', ' ': 'jump',
};

// Brand colours, drawn straight onto the canvas.
const INK = '#0F2032';
const CRIMSON = '#FC5F5A';
const SKIN = '#EBCBB5';
const SKY = '#A9C9E8';
const SAND = '#D8CDBF';
const PLUM = '#B06A8F';

/** Draws the whole scene for one frame, with the camera following the stylist. */
function draw(ctx: CanvasRenderingContext2D, s: Runner, tick: number, mirror: HTMLImageElement | undefined) {
  const cam = Math.max(0, Math.min(LEVEL_W - VIEW_W, s.x - VIEW_W / 2));
  ctx.clearRect(0, 0, VIEW_W, VIEW_H);
  const sky = ctx.createLinearGradient(0, 0, 0, VIEW_H);
  sky.addColorStop(0, SKY);
  sky.addColorStop(1, '#F7D9CE');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  // Back wall: slow-moving framed mirrors, like the shop wall.
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (let i = -1; i < 8; i++) {
    const x = i * 140 - ((cam * 0.4) % 140) + 20;
    ctx.fillRect(x, 60, 70, 110);
    ctx.strokeStyle = 'rgba(17,17,17,0.18)';
    ctx.strokeRect(x, 60, 70, 110);
  }

  ctx.save();
  ctx.translate(-cam, 0);

  // Floor and shelves.
  solids.forEach((r, i) => {
    const isFloor = r.y === FLOOR_Y;
    ctx.fillStyle = isFloor ? INK : PLUM;
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.fillStyle = isFloor ? SAND : CRIMSON;
    ctx.fillRect(r.x, r.y, r.w, isFloor ? 6 : 5);
    if (isFloor && i < 5) {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      for (let x = r.x; x < r.x + r.w; x += 32) ctx.fillRect(x, r.y + 14, 16, 8);
    }
  });

  // Scissors to collect.
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  COINS.forEach(([x, y], i) => {
    if (!s.coins[i]) return;
    ctx.fillText('✂️', x, y + Math.sin((tick + i * 7) / 12) * 3);
  });

  // Tangled hair.
  s.enemies.forEach((e) => {
    if (!e.alive) return;
    const cx = e.x + ENEMY_W / 2;
    const cy = FLOOR_Y - ENEMY_H / 2;
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, ENEMY_W / 2, ENEMY_H / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    for (let k = 0; k < 5; k++) {
      ctx.beginPath();
      ctx.arc(cx - 12 + k * 6, cy - 8, 4, Math.PI, 0);
      ctx.stroke();
    }
    ctx.fillStyle = '#fff';
    ctx.fillRect(cx - 7, cy - 2, 5, 5);
    ctx.fillRect(cx + 2, cy - 2, 5, 5);
    ctx.fillStyle = INK;
    ctx.fillRect(cx - 5, cy, 2, 2);
    ctx.fillRect(cx + 4, cy, 2, 2);
  });

  // The mirror at the end of the level.
  ctx.fillStyle = PLUM;
  ctx.fillRect(GOAL.x - 4, GOAL.y - 4, GOAL.w + 8, GOAL.h + 8);
  ctx.fillStyle = '#EAF4FB';
  ctx.fillRect(GOAL.x, GOAL.y, GOAL.w, GOAL.h);
  if (mirror) ctx.drawImage(mirror, GOAL.x + 6, GOAL.y + 14, 28, 28);

  // The stylist: crimson apron, dark hair, a pair of scissors in the pocket.
  if (s.invincible % 8 < 4) {
    const px = s.x;
    const py = s.y;
    const step = s.onGround && Math.abs(s.vx) > 0.3 ? Math.sin(tick / 3) * 4 : 0;
    ctx.fillStyle = INK;
    ctx.fillRect(px + 3 + step, py + PLAYER_H - 10, 7, 10);
    ctx.fillRect(px + PLAYER_W - 10 - step, py + PLAYER_H - 10, 7, 10);
    ctx.fillStyle = CRIMSON;
    ctx.fillRect(px + 1, py + 16, PLAYER_W - 2, 16);
    ctx.fillStyle = SKIN;
    ctx.beginPath();
    ctx.arc(px + PLAYER_W / 2, py + 9, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.beginPath();
    ctx.arc(px + PLAYER_W / 2, py + 6, 9.5, Math.PI, 0);
    ctx.fill();
    ctx.fillRect(px + (s.facing > 0 ? PLAYER_W / 2 + 2 : PLAYER_W / 2 - 6), py + 8, 4, 3);
  }
  ctx.restore();
}

export default function StyleRunner() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const game = useRef<Runner>(start());
  const input = useRef<Input>({ left: false, right: false, jump: false });
  const mirror = useRef<HTMLImageElement | undefined>(undefined);
  const [view, setView] = useState({ score: 0, lives: 3, won: false, over: false });
  const [running, setRunning] = useState(false);
  const [best, setBest] = useState(0);

  useEffect(() => {
    try {
      setBest(Number(localStorage.getItem(KEY)) || 0);
    } catch {
      // Storage blocked: the best score just isn't remembered.
    }
    // The looksmenu mark, drawn on the mirror at the end.
    const img = new Image();
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="14" fill="#0F2032"/>${menuMark()}</svg>`)}`;
    img.onload = () => (mirror.current = img);
  }, []);

  // The game loop: fixed 60 Hz steps, however fast the screen refreshes.
  useEffect(() => {
    if (!running) return;
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let tick = 0;
    const frame = (now: number) => {
      acc += Math.min(100, now - last);
      last = now;
      while (acc >= 1000 / 60) {
        game.current = step(game.current, input.current);
        // A jump is one press, not held.
        input.current.jump = input.current.jump && !game.current.onGround ? false : input.current.jump;
        acc -= 1000 / 60;
        tick++;
      }
      draw(ctx, game.current, tick, mirror.current);
      const g = game.current;
      setView((v) => (v.score === g.score && v.lives === g.lives && v.won === g.won && v.over === g.over ? v : { score: g.score, lives: g.lives, won: g.won, over: g.over }));
      if (g.won || g.over) {
        setRunning(false);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  useEffect(() => {
    if ((view.won || view.over) && view.score > best) {
      setBest(view.score);
      try {
        localStorage.setItem(KEY, String(view.score));
      } catch {
        // Ignore.
      }
    }
  }, [view.won, view.over]);

  useEffect(() => {
    const set = (down: boolean) => (e: KeyboardEvent) => {
      const k = KEYS[e.key];
      if (!k) return;
      e.preventDefault();
      input.current[k] = down;
    };
    const downHandler = set(true);
    const upHandler = set(false);
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  // Draw the first frame so the board isn't blank before Start.
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (ctx) draw(ctx, game.current, 0, mirror.current);
  }, [running]);

  const begin = () => {
    game.current = start();
    input.current = { left: false, right: false, jump: false };
    setView({ score: 0, lives: 3, won: false, over: false });
    setRunning(true);
  };

  const hold = (k: keyof Input) => ({
    onPointerDown: (e: PointerEvent) => {
      e.preventDefault();
      input.current[k] = true;
    },
    onPointerUp: () => (input.current[k] = false),
    onPointerLeave: () => (input.current[k] = false),
    onPointerCancel: () => (input.current[k] = false),
  });
  const padBase = 'grid min-h-14 touch-none select-none place-items-center text-[1.375rem] font-bold';
  const padClass = `${padBase} bg-paper-2 active:bg-line`;

  return (
    <div class="mx-auto mt-6 max-w-xl">
      <div class="flex items-stretch gap-2">
        <div class="flex-1 bg-paper-2 px-4 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('play.score')}</p>
          <p class="text-[1.5rem] leading-tight font-bold tabular-nums">{view.score}</p>
        </div>
        <div class="flex-1 bg-paper-2 px-4 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('play.best')}</p>
          <p class="text-[1.5rem] leading-tight font-bold tabular-nums">{best}</p>
        </div>
        <div class="flex-1 bg-paper-2 px-4 py-2.5">
          <p class="text-[0.625rem] font-semibold tracking-[0.2em] text-muted uppercase">{text('rush.hearts')}</p>
          <p class="text-[1.5rem] leading-tight font-bold text-brand" aria-label={`${view.lives} / 3`}>
            {'♥'.repeat(view.lives)}
            <span class="text-line">{'♥'.repeat(3 - view.lives)}</span>
          </p>
        </div>
      </div>

      <div class="relative mt-3">
        <canvas ref={canvas} width={VIEW_W} height={VIEW_H} role="img" aria-label={text('runner.canvas')} class="block aspect-video w-full bg-block-sky" />
        {!running && (
          <div class="absolute inset-0 grid place-items-center bg-ink/80 p-4 text-center text-white">
            <div>
              {view.won && <p class="text-[1.5rem] leading-tight font-bold">{text('runner.won')}</p>}
              {view.over && <p class="text-[1.5rem] leading-tight font-bold">{text('runner.over')}</p>}
              {(view.won || view.over) && <p class="mt-1 text-sm text-muted-dark">{text('play.scoreNow', { score: String(view.score) })}</p>}
              <button type="button" onClick={begin} class="mt-4 min-h-12 bg-brand px-6 text-sm font-semibold tracking-[0.12em] text-white uppercase">
                {view.won || view.over ? text('play.again') : text('runner.start')}
              </button>
            </div>
          </div>
        )}
      </div>

      <p class="mt-3 text-center text-[0.8125rem] text-muted">{text('runner.hint')}</p>

      <div class="mt-2 grid grid-cols-[1fr_1fr_1.4fr] gap-1.5">
        <button type="button" aria-label={text('runner.left')} class={padClass} {...hold('left')}>←</button>
        <button type="button" aria-label={text('runner.right')} class={padClass} {...hold('right')}>→</button>
        <button type="button" aria-label={text('runner.jump')} class={`${padBase} bg-ink text-white active:bg-ink-3`} {...hold('jump')}>
          {text('runner.jump')}
        </button>
      </div>
    </div>
  );
}
