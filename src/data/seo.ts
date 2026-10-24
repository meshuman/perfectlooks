// Structured data (JSON-LD) for search engines. Every value must match text that is
// visible on the page (SEO document: "Structured data that matches the visible text").
import { defaultShop, type Shop } from './shop';

const BRAND = defaultShop.name;
const LOGO = '/icon-512.png';
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_CODES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const abs = (path: string, site: URL) => new URL(path, site).href;
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const OG_IMAGE = '/og-default.png';

export function breadcrumbs(trail: { name: string; path: string }[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.path, site),
    })),
  };
}

export function article(
  page: { headline: string; description: string; path: string; updated: Date; image?: string },
  shop: Shop,
  site: URL,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.headline,
    description: page.description,
    mainEntityOfPage: abs(page.path, site),
    image: abs(page.image ?? OG_IMAGE, site),
    datePublished: isoDate(page.updated),
    dateModified: isoDate(page.updated),
    author: { '@type': 'Organization', name: shop.name, url: abs(`/shops/${shop.slug}`, site) },
    publisher: { '@type': 'Organization', name: BRAND, logo: { '@type': 'ImageObject', url: abs(LOGO, site) } },
  };
}

/** "Mo-Su 07:00-20:00" becomes one OpeningHoursSpecification per range. */
function openingHours(specs: string[]) {
  return specs.map((spec) => {
    const [days, hours] = spec.split(' ') as [string, string];
    const [from, to] = days.split('-') as [string, string?];
    const start = DAY_CODES.indexOf(from);
    const end = to ? DAY_CODES.indexOf(to) : start;
    const [opens, closes] = hours.split('-');
    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAYS.slice(start, end + 1),
      opens,
      closes,
    };
  });
}

export function hairSalon(shop: Shop, site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: shop.name,
    url: abs(`/shops/${shop.slug}`, site),
    image: abs(OG_IMAGE, site),
    logo: abs(LOGO, site),
    telephone: shop.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: shop.street,
      addressLocality: `${shop.area}, ${shop.city}`,
      addressCountry: shop.country,
    },
    openingHoursSpecification: openingHours(shop.openingHours),
    hasMap: shop.mapUrl,
    ...(shop.geo && { geo: { '@type': 'GeoCoordinates', latitude: shop.geo.lat, longitude: shop.geo.lng } }),
    ...(shop.googleBusinessUrl && { sameAs: [shop.googleBusinessUrl] }),
  };
}

export function website(site: URL) {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: site.href };
}
