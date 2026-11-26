// The parts of each shop's record that the website itself may use. The full record (owners' contact details,
// location, lead notes) is in data/shops.json and must never reach a page, so everything is picked out by name here.
import store from '../../data/shops.json';

export interface PublicShop {
  shop: string;
  short: string;
}

export const publicShops: Record<string, PublicShop> = Object.fromEntries(
  Object.entries(store.shops as Record<string, { shop: string; short?: string }>).map(([key, s]) => [key, { shop: s.shop, short: s.short || s.shop.split(/\s+/)[0]! }]),
);
