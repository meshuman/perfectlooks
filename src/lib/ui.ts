// Toast, confirm dialog and screen text for the browser. All use elements that BaseLayout
// puts on every page; the screen text comes from its #pl-strings block, in the page language.

let strings: Record<string, string> | undefined;

/** Screen text by key, with {placeholders} filled. Falls back to the key if it isn't on the page. */
export function text(key: string, vars?: Record<string, string>): string {
  if (!strings) {
    try {
      strings = JSON.parse(document.getElementById('pl-strings')?.textContent ?? '{}') as Record<string, string>;
    } catch {
      strings = {};
    }
  }
  const value = strings[key] ?? key;
  return vars ? value.replace(/\{(\w+)\}/g, (m, name: string) => vars[name] ?? m) : value;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export function toast(text: string): void {
  const el = document.getElementById('pl-toast');
  const label = el?.querySelector('[data-text]');
  if (!el || !label) return;
  label.textContent = text;
  el.hidden = false;
  // Restart the entry animation for back-to-back toasts.
  el.classList.remove('toast-in');
  void el.offsetWidth;
  el.classList.add('toast-in');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 2600);
}

export function confirmDialog(message: string): Promise<boolean> {
  const dialog = document.getElementById('pl-confirm') as HTMLDialogElement | null;
  if (!dialog?.showModal) return Promise.resolve(window.confirm(message));
  dialog.querySelector('[data-message]')!.textContent = message;
  dialog.returnValue = '';
  dialog.showModal();
  return new Promise((resolve) => {
    dialog.addEventListener('close', () => resolve(dialog.returnValue === 'yes'), { once: true });
  });
}

/** A site path in the page's language: "/styles" becomes "/ne/styles" on Nepali pages. */
export function localPath(path: string): string {
  const lang = document.documentElement.lang;
  if (lang !== 'ne' && lang !== 'hi') return path;
  if (path === '/') return `/${lang}`;
  if (path.startsWith('/#')) return `/${lang}${path.slice(1)}`;
  return `/${lang}${path}`;
}
