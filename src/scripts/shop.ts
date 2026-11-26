// Each barber shop has its own address: kgf.looksmenu.com shows the KGF UniSex Salon welcome card and logo on every
// page. Contact details, WhatsApp and feedback stay exactly as on the landing page (looksmenu's number). The first part of the address is the shop's key in public/shops/shops.json. An address with
// no matching key (looksmenu.com itself, www, or a name that is not in the file) shows the standard menu with no
// welcome card. Nothing is stored on the phone: the address alone decides the shop.

const SLUG = /^[a-z0-9][a-z0-9-]{0,40}$/;
const RESERVED = new Set(['www', 'app', 'api', 'admin', 'staging', 'preview']);
const IMAGE_PATH = /^[\w\-./]+\.(png|jpe?g|webp|svg|avif)$/i;

interface Entry {
  barber?: string;
  shop: string;
  logo?: string;
  photo?: string;
  welcome?: string;
  contact?: string;
  contactWhatsapp?: boolean;
}

declare global {
  interface Window {
    /** The shop whose address this is, for scripts that send messages (the feedback form). */
    __plShop?: { slug: string; shop: string };
  }
}

const safePath = (p: string | undefined) => (p && IMAGE_PATH.test(p) && !p.includes('..') && !p.startsWith('/') ? `/shops/${p}` : undefined);
const fill = (template: string, vars: Record<string, string>) => template.replace(/\{(\w+)\}/g, (m, k: string) => vars[k] ?? m);

/** "kgf" from kgf.looksmenu.com (or kgf.localhost while testing). */
function shopKey(): string | undefined {
  const parts = location.hostname.toLowerCase().split('.');
  const sub = parts.length >= 3 || (parts.length === 2 && parts[1] === 'localhost') ? parts[0] : undefined;
  return sub && SLUG.test(sub) && !RESERVED.has(sub) ? sub : undefined;
}

function apply(slug: string, entry: Entry) {
  window.__plShop = { slug, shop: entry.shop };

  // The welcome card, hidden on the standard menu.
  const card = document.querySelector<HTMLElement>('[data-shop-welcome]');
  if (card) {
    const section = card.closest<HTMLElement>('[data-shop-section]');
    if (section) section.hidden = false;
    const title = card.querySelector<HTMLElement>('[data-shop-title]');
    const sub = card.querySelector<HTMLElement>('[data-shop-sub]');
    const photo = card.querySelector<HTMLImageElement>('[data-shop-photo]');
    const initials = card.querySelector<HTMLElement>('[data-shop-initials]');
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
  }

  // The header and footer brand: the shop's logo first, or its name when it has no logo yet. looksmenu moves to "powered by".
  const logoPath = safePath(entry.logo);
  for (const holder of document.querySelectorAll<HTMLElement>('[data-brand-shop]')) {
    const logo = holder.querySelector<HTMLImageElement>('[data-brand-shop-logo]');
    const name = holder.querySelector<HTMLElement>('[data-brand-shop-name]');
    const sr = holder.querySelector<HTMLElement>('[data-brand-shop-sr]');
    if (logo && logoPath) {
      logo.src = logoPath;
      logo.hidden = false;
      if (name) name.hidden = true;
    } else if (name) {
      name.textContent = entry.shop;
      name.hidden = false;
      if (logo) logo.hidden = true;
    }
    if (sr) sr.textContent = entry.shop;
    holder.hidden = false;
    holder.classList.add('inline-flex');
    const own = holder.previousElementSibling as HTMLElement | null;
    if (own?.hasAttribute('data-brand-default')) own.hidden = true;
  }
  for (const el of document.querySelectorAll<HTMLElement>('[data-powered]')) el.hidden = false;

  // The shop's own contact number, only if it chose to show one.
  const digits = (entry.contact ?? '').replace(/\D/g, '');
  if (digits.length >= 8 && digits.length <= 15) {
    for (const block of document.querySelectorAll<HTMLElement>('[data-shop-contact]')) {
      for (const el of block.querySelectorAll<HTMLElement>('[data-shop-contact-name]')) el.textContent = entry.shop;
      for (const a of block.querySelectorAll<HTMLAnchorElement>('[data-shop-contact-call]')) {
        a.href = `tel:+${digits}`;
        (a.querySelector('span') ?? a).textContent = entry.contact ?? `+${digits}`;
      }
      for (const a of block.querySelectorAll<HTMLAnchorElement>('[data-shop-contact-wa]')) {
        if (entry.contactWhatsapp === false) a.hidden = true;
        else a.href = `https://wa.me/${digits}?text=${encodeURIComponent(fill(a.dataset.msgTpl ?? '', { shop: entry.shop }))}`;
      }
      block.hidden = false;
    }
  }
}

const slug = shopKey();
if (slug) {
  fetch('/shops/shops.json')
    .then((r) => (r.ok ? (r.json() as Promise<{ shops?: Record<string, Entry> }>) : undefined))
    .then((json) => {
      const entry = json?.shops?.[slug];
      // A name that is not in the file (an unknown subdomain) leaves the standard menu as it is.
      if (entry?.shop) apply(slug, entry);
    })
    .catch(() => {
      // Offline or file missing: the standard menu stays.
    });
}

export {};
