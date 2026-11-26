// A barber opens the menu with a link like https://looksmenu.example/?shop=kgf and sees their own shop: their name and
// photo in the welcome card, their logo, and their WhatsApp number on every call, WhatsApp and feedback button.
// The shop is remembered on the phone for 24 hours, so every page the client opens (and the landing page when they
// come back to it) stays in that shop's version. Another shop link replaces it and restarts the 24 hours;
// ?shop=reset (or ?shop=) clears it at once. The details come from public/shops/shops.json.

const STORE = 'pl:shop';
const SLUG = /^[a-z0-9][a-z0-9-]{0,40}$/;
const IMAGE_PATH = /^[\w\-./]+\.(png|jpe?g|webp|svg|avif)$/i;

interface Entry {
  barber?: string;
  shop: string;
  whatsapp?: string;
  logo?: string;
  photo?: string;
  welcome?: string;
}

declare global {
  interface Window {
    /** The shop chosen with ?shop=, for scripts that send messages (the feedback form). */
    __plShop?: { slug: string; shop: string; whatsapp: string };
  }
}

const safePath = (p: string | undefined) => (p && IMAGE_PATH.test(p) && !p.includes('..') && !p.startsWith('/') ? `/shops/${p}` : undefined);
const fill = (template: string, vars: Record<string, string>) => template.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);

/** How long a phone keeps a shop after its link was opened. */
const KEEP_MS = 24 * 60 * 60 * 1000;

function chosen(): string | undefined {
  const param = new URLSearchParams(location.search).get('shop');
  const fromLink = param === null ? undefined : param.trim().toLowerCase();
  try {
    if (fromLink !== undefined) {
      if (fromLink === '' || fromLink === 'reset') localStorage.removeItem(STORE);
      else if (SLUG.test(fromLink)) localStorage.setItem(STORE, JSON.stringify({ slug: fromLink, at: Date.now() }));
    }
    const saved = JSON.parse(localStorage.getItem(STORE) ?? 'null') as { slug?: string; at?: number } | null;
    if (!saved?.slug || typeof saved.at !== 'number' || Date.now() - saved.at > KEEP_MS || !SLUG.test(saved.slug)) {
      localStorage.removeItem(STORE);
      return undefined;
    }
    return saved.slug;
  } catch {
    // Storage blocked or unreadable: the link still works for this page.
    return fromLink && SLUG.test(fromLink) ? fromLink : undefined;
  }
}

function apply(slug: string, entry: Entry) {
  const digits = (entry.whatsapp ?? '').replace(/\D/g, '');
  const hasNumber = digits.length >= 8 && digits.length <= 15;
  window.__plShop = { slug, shop: entry.shop, whatsapp: hasNumber ? digits : '' };

  // Names of the shop (the contact block, the footer).
  for (const el of document.querySelectorAll<HTMLElement>('[data-shop-name]')) el.textContent = entry.shop;

  // The welcome card.
  const card = document.querySelector<HTMLElement>('[data-shop-welcome]');
  if (card) {
    // The card shows for as long as the phone remembers the shop (24 hours).
    const section = card.closest<HTMLElement>('[data-shop-section]');
    if (section) section.hidden = false;
    const title = card.querySelector<HTMLElement>('[data-shop-title]');
    const sub = card.querySelector<HTMLElement>('[data-shop-sub]');
    const photo = card.querySelector<HTMLImageElement>('[data-shop-photo]');
    const initials = card.querySelector<HTMLElement>('[data-shop-initials]');
    const logo = card.querySelector<HTMLImageElement>('[data-shop-logo]');
    const withBarber = card.dataset.tplBarber ?? '{name} welcomes you to {shop}';
    const shopOnly = card.dataset.tplShop ?? 'Welcome to {shop}';
    if (title) title.textContent = fill(entry.barber ? withBarber : shopOnly, { name: entry.barber ?? '', shop: entry.shop });
    if (sub) sub.textContent = entry.welcome ?? card.dataset.defaultSub ?? '';
    const photoPath = safePath(entry.photo);
    if (photo) {
      if (photoPath) {
        photo.src = photoPath;
        photo.alt = entry.barber ? `${entry.barber}, ${entry.shop}` : entry.shop;
        photo.hidden = false;
        if (initials) initials.hidden = true;
      } else {
        photo.hidden = true;
        if (initials) {
          initials.textContent = entry.shop
            .split(/\s+/)
            .map((w) => w[0])
            .join('')
            .slice(0, 3)
            .toUpperCase();
          initials.hidden = false;
        }
      }
    }
    const logoPath = safePath(entry.logo);
    if (logo) {
      logo.hidden = !logoPath;
      if (logoPath) {
        logo.src = logoPath;
        logo.alt = entry.shop;
      }
    }
  }

  if (!hasNumber) return;
  // Every WhatsApp and call link, and the number shown beside them, goes to this shop.
  for (const a of document.querySelectorAll<HTMLAnchorElement>('a[href^="https://wa.me/"]')) a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${digits}`);
  for (const a of document.querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]')) {
    a.href = `tel:+${digits}`;
    (a.querySelector('span') ?? a).textContent = entry.whatsapp ?? `+${digits}`;
  }
  for (const form of document.querySelectorAll<HTMLElement>('[data-feedback-form]')) form.dataset.whatsapp = digits;
}

const slug = chosen();
if (slug) {
  fetch('/shops/shops.json')
    .then((r) => (r.ok ? (r.json() as Promise<{ shops?: Record<string, Entry> }>) : undefined))
    .then((json) => {
      const entry = json?.shops?.[slug];
      if (entry?.shop) apply(slug, entry);
    })
    .catch(() => {
      // Offline or file missing: the standard version stays.
    });
}

export {};
