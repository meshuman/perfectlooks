// The rules of Barber Shop Rush, free of the screen so they can be tested. Customers arrive wanting one of
// five services; the player serves the one who asked. A customer who waits too long leaves, and a wrong
// tap costs a heart, the same as a walk-out. Three hearts and the shop closes.

export const NEEDS = 5;
export const LIVES = 3;
const MAX_WAITING = 4;

export interface Customer {
  id: number;
  /** 0 to NEEDS - 1: which service they want. */
  need: number;
  born: number;
  /** How long they will wait, in ms. */
  patience: number;
}

export interface Rush {
  customers: Customer[];
  lives: number;
  score: number;
  combo: number;
  served: number;
  nextId: number;
  nextSpawn: number;
  over: boolean;
}

/** Every five customers served, the shop gets busier. */
export const level = (s: Rush) => Math.floor(s.served / 5);
const patienceFor = (s: Rush) => Math.max(3200, 7500 - level(s) * 450);
const gapFor = (s: Rush) => Math.max(1000, 2800 - level(s) * 180);

export const start = (now: number): Rush => ({ customers: [], lives: LIVES, score: 0, combo: 0, served: 0, nextId: 1, nextSpawn: now + 400, over: false });

/** Moves the shop forward to `now`: customers who waited too long leave, and a new one may walk in. */
export function tick(s: Rush, now: number, rand: () => number = Math.random): Rush {
  if (s.over) return s;
  const kept = s.customers.filter((c) => now - c.born < c.patience);
  const lost = s.customers.length - kept.length;
  const lives = s.lives - lost;
  let customers = kept;
  let { nextId, nextSpawn } = s;
  if (now >= nextSpawn && customers.length < MAX_WAITING) {
    customers = [...customers, { id: nextId, need: Math.floor(rand() * NEEDS), born: now, patience: patienceFor(s) }];
    nextId++;
    nextSpawn = now + gapFor(s);
  }
  return { ...s, customers, lives: Math.max(0, lives), combo: lost ? 0 : s.combo, nextId, nextSpawn, over: lives <= 0 };
}

/** The player taps a service: it serves the longest-waiting customer who asked for it, or costs a heart. */
export function serve(s: Rush, need: number, now: number): Rush {
  if (s.over) return s;
  const i = s.customers.findIndex((c) => c.need === need);
  if (i < 0) {
    const lives = s.lives - 1;
    return { ...s, lives, combo: 0, over: lives <= 0 };
  }
  const customer = s.customers[i]!;
  const combo = s.combo + 1;
  const freshness = Math.max(0, 1 - (now - customer.born) / customer.patience);
  const points = 10 + Math.round(10 * freshness) + Math.min(combo - 1, 5) * 2;
  return { ...s, customers: s.customers.filter((_, j) => j !== i), score: s.score + points, combo, served: s.served + 1 };
}
