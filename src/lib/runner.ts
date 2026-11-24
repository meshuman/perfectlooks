// The rules of Style Runner, a side-scrolling platformer set in a salon, free of the screen so they can be
// tested. A stylist runs and jumps along the shop floor, collects scissors, hops on tangled hair, and
// reaches the mirror. All sizes are in logical pixels; one step is one 60th of a second.

export const VIEW_W = 640;
export const VIEW_H = 360;
export const LEVEL_W = 4000;
export const FLOOR_Y = 296;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const PLAYER_W = 22;
export const PLAYER_H = 40;
const GRAVITY = 0.55;
const MAX_FALL = 13;
const RUN = 0.55;
const MAX_RUN = 3.6;
const FRICTION = 0.8;
const JUMP = 11;
const BOUNCE = 7.5;
const LIVES = 3;

/** Floor between the pits, then floating shelves. */
const FLOORS: [number, number][] = [
  [0, 700],
  [800, 1500],
  [1620, 2300],
  [2420, 3200],
  [3300, 4000],
];
const SHELVES: [number, number, number][] = [
  [300, 232, 96],
  [560, 188, 96],
  [1000, 220, 128],
  [1300, 180, 96],
  [1700, 220, 128],
  [2000, 180, 96],
  [2500, 220, 128],
  [2800, 190, 96],
  [3000, 230, 96],
  [3480, 220, 96],
];

export const solids: Rect[] = [
  ...FLOORS.map(([a, b]) => ({ x: a, y: FLOOR_Y, w: b - a, h: VIEW_H - FLOOR_Y })),
  ...SHELVES.map(([x, y, w]) => ({ x, y, w, h: 16 })),
];

/** Scissors to collect: along the floor and above the shelves. */
export const COINS: [number, number][] = [
  [180, 260], [220, 260], [340, 200], [380, 200], [600, 156], [640, 156], [900, 260], [1040, 188], [1080, 188],
  [1330, 148], [1200, 260], [1450, 260], [1740, 188], [1780, 188], [2040, 148], [2200, 260], [2540, 188],
  [2580, 188], [2840, 158], [3040, 198], [3100, 260], [3380, 260], [3510, 188], [3600, 260], [3700, 260],
];

/** Tangled hair patrolling the floor: [start x, left limit, right limit]. */
export const ENEMY_START: [number, number, number][] = [
  [450, 380, 620],
  [1100, 900, 1400],
  [1850, 1700, 2200],
  [2600, 2450, 3100],
  [3500, 3350, 3900],
];
export const ENEMY_W = 28;
export const ENEMY_H = 24;

/** The mirror at the end. */
export const GOAL: Rect = { x: 3900, y: FLOOR_Y - 64, w: 40, h: 64 };
/** Where you restart after a fall or a hit: the start of each stretch of floor you have reached. */
const CHECKPOINTS = FLOORS.map(([a]) => a + 40);

export interface Enemy {
  x: number;
  dir: 1 | -1;
  alive: boolean;
}

export interface Runner {
  x: number;
  y: number;
  vx: number;
  vy: number;
  onGround: boolean;
  facing: 1 | -1;
  coins: boolean[];
  enemies: Enemy[];
  lives: number;
  score: number;
  checkpoint: number;
  won: boolean;
  over: boolean;
  /** Ticks left of the short flash after being hit, when you can't be hit again. */
  invincible: number;
}

export interface Input {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export const start = (): Runner => ({
  x: CHECKPOINTS[0]!,
  y: FLOOR_Y - PLAYER_H,
  vx: 0,
  vy: 0,
  onGround: true,
  facing: 1,
  coins: COINS.map(() => true),
  enemies: ENEMY_START.map(([x]) => ({ x, dir: 1 as const, alive: true })),
  lives: LIVES,
  score: 0,
  checkpoint: 0,
  won: false,
  over: false,
  invincible: 0,
});

const hit = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function respawn(s: Runner): Runner {
  const lives = s.lives - 1;
  return { ...s, lives, over: lives <= 0, x: CHECKPOINTS[s.checkpoint]!, y: FLOOR_Y - PLAYER_H, vx: 0, vy: 0, invincible: 90 };
}

/** One tick of the game. */
export function step(prev: Runner, input: Input): Runner {
  if (prev.over || prev.won) return prev;
  let s: Runner = { ...prev, coins: [...prev.coins], enemies: prev.enemies.map((e) => ({ ...e })) };

  // Run left and right.
  if (input.left) {
    s.vx -= RUN;
    s.facing = -1;
  }
  if (input.right) {
    s.vx += RUN;
    s.facing = 1;
  }
  if (!input.left && !input.right) s.vx *= FRICTION;
  s.vx = Math.max(-MAX_RUN, Math.min(MAX_RUN, s.vx));
  if (Math.abs(s.vx) < 0.05) s.vx = 0;
  if (input.jump && s.onGround) {
    s.vy = -JUMP;
    s.onGround = false;
  }
  s.vy = Math.min(MAX_FALL, s.vy + GRAVITY);

  // Move sideways, then up or down, stopping at anything solid.
  s.x = Math.max(0, Math.min(LEVEL_W - PLAYER_W, s.x + s.vx));
  for (const r of solids) {
    if (hit({ x: s.x, y: s.y, w: PLAYER_W, h: PLAYER_H }, r)) {
      s.x = s.vx > 0 ? r.x - PLAYER_W : r.x + r.w;
      s.vx = 0;
    }
  }
  s.y += s.vy;
  s.onGround = false;
  for (const r of solids) {
    if (hit({ x: s.x, y: s.y, w: PLAYER_W, h: PLAYER_H }, r)) {
      if (s.vy > 0) {
        s.y = r.y - PLAYER_H;
        s.onGround = true;
      } else {
        s.y = r.y + r.h;
      }
      s.vy = 0;
    }
  }

  // Which stretch of floor you have reached.
  CHECKPOINTS.forEach((c, i) => {
    if (s.x > c && i > s.checkpoint && s.onGround) s.checkpoint = i;
  });

  // Fell into a pit.
  if (s.y > VIEW_H + 60) return respawn(s);

  // Collect scissors.
  COINS.forEach(([cx, cy], i) => {
    if (s.coins[i] && hit({ x: s.x, y: s.y, w: PLAYER_W, h: PLAYER_H }, { x: cx - 10, y: cy - 10, w: 20, h: 20 })) {
      s.coins[i] = false;
      s.score += 10;
    }
  });

  // Tangled hair: walk back and forth; land on top to clear it, touch the side and you lose a life.
  s.enemies.forEach((e, i) => {
    if (!e.alive) return;
    const [, lo, hi] = ENEMY_START[i]!;
    e.x += e.dir * 1;
    if (e.x < lo) e.dir = 1;
    if (e.x > hi) e.dir = -1;
    const box = { x: e.x, y: FLOOR_Y - ENEMY_H, w: ENEMY_W, h: ENEMY_H };
    if (hit({ x: s.x, y: s.y, w: PLAYER_W, h: PLAYER_H }, box)) {
      const stomp = s.vy > 0 && s.y + PLAYER_H - s.vy <= box.y + 10;
      if (stomp) {
        e.alive = false;
        s.vy = -BOUNCE;
        s.score += 100;
      } else if (s.invincible <= 0) {
        s = { ...respawn(s), coins: s.coins, enemies: s.enemies, score: s.score };
      }
    }
  });
  if (s.invincible > 0) s.invincible--;

  // The mirror: made it.
  if (hit({ x: s.x, y: s.y, w: PLAYER_W, h: PLAYER_H }, GOAL)) {
    s.won = true;
    s.score += 500 + s.lives * 100;
  }
  return s;
}
