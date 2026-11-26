// The barber shops that use this menu. The details live in public/shops/shops.json (read here at build time for the
// shop shown by default, and by the browser for any shop opened with ?shop=name). Photos are in public/shops/photos
// and logos in public/shops/logos; the paths in the file are relative to public/shops/. See SHOPS.md.
import store from '../../public/shops/shops.json';

export interface ShopEntry {
  /** The barber's name, shown in the welcome card. */
  barber?: string;
  /** The shop's name. */
  shop: string;
  /** WhatsApp number with country code. Calls, WhatsApp links and feedback go here. */
  whatsapp?: string;
  /** Path of the logo inside public/shops/, e.g. logos/kgf.svg. */
  logo?: string;
  /** Path of the round-cropped photo inside public/shops/, e.g. photos/kgf.jpg. */
  photo?: string;
  /** Optional welcome line that replaces the standard one (English only). */
  welcome?: string;
}

const shops = store.shops as Record<string, ShopEntry>;

/** The shop whose details the page shows when no ?shop= link was used. */
export const defaultShopKey: string = store.default;
export const defaultShopEntry: ShopEntry = shops[store.default]!;
