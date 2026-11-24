// Back and forward keep your place. The position of each page (and of any sideways row marked data-keep-scroll)
// is saved as you leave, and put back when you return with the Back button or reload. The browser's own
// restoring is turned off because it runs before lists, images and islands have set their heights, so it ends
// up short; this waits for the page to be tall enough, and gives up the moment you scroll yourself.

const KEY = 'pl:scroll';
type Saved = { y: number; rows: number[] };

const here = () => location.pathname + location.search;
const rows = () => Array.from(document.querySelectorAll<HTMLElement>('[data-keep-scroll]'));

const read = (): Record<string, Saved> => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as Record<string, Saved>;
  } catch {
    return {};
  }
};

function save() {
  try {
    const all = read();
    all[here()] = { y: Math.round(window.scrollY), rows: rows().map((el) => Math.round(el.scrollLeft)) };
    // Keep the store small: only the latest pages.
    const keys = Object.keys(all);
    for (const old of keys.slice(0, Math.max(0, keys.length - 40))) delete all[old];
    sessionStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    // Storage blocked: pages just open at the top, as they would anyway.
  }
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

let timer: ReturnType<typeof setTimeout> | undefined;
window.addEventListener(
  'scroll',
  () => {
    clearTimeout(timer);
    timer = setTimeout(save, 120);
  },
  { passive: true },
);
window.addEventListener('pagehide', save);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') save();
});

const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
const returning = nav?.type === 'back_forward' || nav?.type === 'reload';
const saved = returning ? read()[here()] : undefined;

if (saved && !location.hash) {
  let cancelled = false;
  const stop = () => (cancelled = true);
  for (const event of ['wheel', 'touchstart', 'keydown', 'mousedown']) window.addEventListener(event, stop, { once: true, passive: true });

  const started = performance.now();
  const restore = () => {
    if (cancelled) return;
    rows().forEach((el, i) => {
      if (saved.rows[i]) el.scrollLeft = saved.rows[i]!;
    });
    const room = document.documentElement.scrollHeight - window.innerHeight;
    if (room >= saved.y - 2 || performance.now() - started > 2500) {
      window.scrollTo(0, saved.y);
      return;
    }
    // Not tall enough yet: go as far as we can and try again on the next frame.
    window.scrollTo(0, Math.max(0, room));
    requestAnimationFrame(restore);
  };
  restore();
}
