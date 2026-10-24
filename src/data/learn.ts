import { getCollection, type CollectionEntry } from 'astro:content';
import { marked } from 'marked';
import type { IconName } from './icons';
import type { I18n, UiKey } from '@/i18n';

export type Post = CollectionEntry<'learn'>;

export const TOPICS = ['Face shape', 'Haircuts', 'Beard', 'Colour', 'Care', 'Talk to your barber'] as const;

export const topicIcon: Record<Post['data']['topic'], IconName> = {
  'Face shape': 'user',
  Haircuts: 'scissors',
  Beard: 'beard',
  Colour: 'droplet',
  Care: 'sparkles',
  'Talk to your barber': 'sliders',
};

// These three help most right before a cut, so they lead the feed (Learn document).
const FIRST = ['P01', 'P06', 'P07'];

/** Posts in feed order: the first three, then the rest by number. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('learn');
  const rank = (p: Post) => {
    const i = FIRST.indexOf(p.data.code);
    return i === -1 ? FIRST.length : i;
  };
  return posts.sort((a, b) => rank(a) - rank(b) || a.data.code.localeCompare(b.data.code));
}

export const postHref = (post: Post) => `/learn/${post.id}`;

const DATE_LOCALE = { en: 'en-GB', ne: 'ne-NP', hi: 'hi-IN' } as const;

export const formatDate = (date: Date, locale: keyof typeof DATE_LOCALE = 'en') =>
  date.toLocaleDateString(DATE_LOCALE[locale], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const topicLabel = (topic: Post['data']['topic'], { t }: I18n) => t(`learn.topic.${topic}` as UiKey);

/**
 * A post's text in the page language. `bodyHtml` is set for translated posts only;
 * English posts render their Markdown through Astro as before.
 */
export function localPost(post: Post, i: I18n) {
  const d = post.data;
  const f = (field: string, english: string) => i.c(`${d.code}.${field}`, english);
  const translatedBody = i.locale === 'en' ? undefined : f('body', (post.body ?? '').trimEnd());
  return {
    title: f('title', d.title),
    description: f('description', d.description),
    shortAnswer: f('shortAnswer', d.shortAnswer),
    fromTheChair: f('fromTheChair', d.fromTheChair),
    imageAlt: f('imageAlt', d.imageAlt),
    faq: d.faq.map((q, n) => ({ q: f(`faq.${n + 1}.q`, q.q), a: f(`faq.${n + 1}.a`, q.a) })),
    sources: d.sources.map((s, n) => f(`source.${n + 1}`, s)),
    // Links inside the body point at English pages; keep readers in their language.
    bodyHtml: translatedBody && (marked.parse(translatedBody, { async: false }) as string).replace(/href="\/(?!\/)/g, `href="/${i.locale}/`),
  };
}
