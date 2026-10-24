// Built from the site setting in astro.config.mjs, so the domain lives in one place.
// Private pages (About you, Favourites, My Look, Barber Card) use a noindex meta tag
// instead of Disallow, so crawlers can read that tag.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const agents = ['Googlebot', 'GPTBot', 'PerplexityBot', '*'];
  const body = [
    ...agents.flatMap((agent) => [`User-agent: ${agent}`, 'Allow: /', '']),
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
