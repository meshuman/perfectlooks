// One shop for now. Kept as a list so more shops can be added later.
export interface Shop {
  slug: string;
  name: string;
  street: string;
  area: string;
  city: string;
  country: string;
  /** E.164 format, used for tel: links and JSON-LD. */
  phone: string;
  /** How the number is shown on screen. */
  phoneDisplay: string;
  /** schema.org openingHours format, for HairSalon JSON-LD. */
  openingHours: string[];
  /** How the hours are shown on screen. */
  hoursDisplay: string;
  /** Google Maps link, used for "Get directions" and HairSalon JSON-LD hasMap. */
  mapUrl: string;
  /** TODO: exact pin coordinates for HairSalon JSON-LD geo. */
  geo?: { lat: number; lng: number };
  googleBusinessUrl?: string;
}

export const shops: Shop[] = [
  {
    slug: 'kgf-unisex-saloon',
    name: 'KGF Unisex Saloon',
    street: 'Jadibuti-32',
    area: 'Narephat',
    city: 'Kathmandu',
    country: 'NP',
    phone: '+9779818879895',
    phoneDisplay: '981-8879895',
    openingHours: ['Mo-Su 07:00-20:00'],
    hoursDisplay: 'Open daily, 7 am – 8 pm',
    mapUrl: 'https://share.google/9SL0tbgf0oUuEPHt0',
  },
];

export const defaultShop = shops[0]!;
