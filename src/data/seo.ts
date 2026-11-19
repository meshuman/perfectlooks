// Structured data (JSON-LD) for search engines. Every value must match text that is
// visible on the page (SEO document: "Structured data that matches the visible text").
import { defaultShop, type Shop } from './shop';

const BRAND = defaultShop.name;
const LOGO = '/icon-512.png';

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
    author: { '@type': 'Organization', name: shop.name, url: site.href },
    publisher: { '@type': 'Organization', name: BRAND, logo: { '@type': 'ImageObject', url: abs(LOGO, site) } },
  };
}

export function organization(shop: Shop, site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: shop.name,
    url: site.href,
    logo: abs(LOGO, site),
    telephone: shop.phone,
  };
}

export function website(site: URL) {
  return { '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: site.href };
}
