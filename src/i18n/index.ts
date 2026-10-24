// Languages for the site. English is the source; Nepali and Hindi come from the translators'
// sheets in translations/. A language is published (its /ne/ or /hi/ pages are built) when its
// sheet is complete and it is switched on in translations/config.json.
//
// Build-time only: this reads files from disk. Islands get the strings they need as props.
import { existsSync, readFileSync } from 'node:fs';
import en from './en.json';
import config from '../../translations/config.json';
import { readSheet } from './csv.mjs';
import { isBarberKey } from './content-keys.mjs';
import { allStrings } from './strings.mjs';

export type Locale = 'en' | 'ne' | 'hi';
export type UiKey = keyof typeof en;
export const OTHER_LOCALES = ['ne', 'hi'] as const;
export const LOCALE_NAMES: Record<Locale, string> = { en: 'EN', ne: config.ne.name, hi: config.hi.name };

/** PL_PSEUDO=1 fills every gap with marked English and publishes both languages, to test the setup. */
const PSEUDO = process.env.PL_PSEUDO === '1';
/** PL_DRAFTS=1 uses rows marked "draft" (not yet reviewed) and publishes languages, for review builds. */
const DRAFTS = process.env.PL_DRAFTS === '1';

function pseudo(english: string, locale: string): string {
  // Markdown bodies keep their structure; everything else is visibly wrapped.
  return english.includes('\n') ? `${english}\n\n⟦${locale}⟧` : `⟦${locale}⟧ ${english}`;
}

const sheets = new Map<string, Record<string, string>>();

/**
 * key -> translation. A translation counts only while its English matches the site's current English
 * and the row's status is empty: "check" (the English changed after translating) and "draft"
 * (not yet reviewed) don't count, except in a PL_DRAFTS=1 review build or for a language with
 * "useDrafts": true in translations/config.json (live with unreviewed drafts).
 */
function translations(locale: Exclude<Locale, 'en'>): Record<string, string> {
  const cached = sheets.get(locale);
  if (cached) return cached;
  const path = `translations/${locale}.csv`;
  const sheet = existsSync(path) ? readSheet(readFileSync(path, 'utf8')) : {};
  const map: Record<string, string> = {};
  for (const s of allStrings()) {
    const row = sheet[s.key];
    const status = row?.status.toLowerCase() ?? '';
    const usable = status === '' || (status === 'draft' && (DRAFTS || config[locale].useDrafts));
    if (row?.translation && row.english === s.english && usable) map[s.key] = row.translation;
    else if (PSEUDO) map[s.key] = pseudo(s.english, locale);
  }
  sheets.set(locale, map);
  return map;
}

export function completeness(locale: Exclude<Locale, 'en'>, keys = allStrings().map((s) => s.key)) {
  const map = translations(locale);
  const done = keys.filter((k) => map[k]).length;
  return { done, total: keys.length };
}

const complete = (locale: Exclude<Locale, 'en'>, keys?: string[]) => {
  const { done, total } = completeness(locale, keys);
  return done === total;
};

/** Languages whose pages are built. */
export function publishedLocales(): Exclude<Locale, 'en'>[] {
  return OTHER_LOCALES.filter((l) => PSEUDO || ((config[l].publish || DRAFTS) && complete(l)));
}

/** Languages the Barber Card can show steps in: English plus any language whose barber steps are complete. */
export function barberLocales(): Locale[] {
  const barberKeys = allStrings()
    .map((s) => s.key)
    .filter(isBarberKey);
  return ['en', ...OTHER_LOCALES.filter((l) => PSEUDO || complete(l, barberKeys))];
}

/**
 * A page's public path. Pages are built as files (styles.html), so during the build Astro.url
 * ends in ".html"; the site serves them without it.
 */
export function pagePath(url: URL): string {
  return url.pathname.replace(/\.html$/, '').replace(/\/index$/, '') || '/';
}

/** The language of a page, from its URL: /ne/... and /hi/... are Nepali and Hindi. */
export function localeOf(url: URL): Locale {
  const first = pagePath(url).split('/')[1];
  return first === 'ne' || first === 'hi' ? first : 'en';
}

/** Static paths for a page in every built language: English at the root, others under /ne/ and /hi/. */
export function langParams(): { lang: string | undefined }[] {
  return [{ lang: undefined }, ...publishedLocales().map((lang) => ({ lang }))];
}

const fill = (text: string, vars?: Record<string, string | number>) =>
  vars ? text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m)) : text;

export interface I18n {
  locale: Locale;
  /** Screen text by key, with {placeholders} filled. */
  t: (key: UiKey, vars?: Record<string, string | number>) => string;
  /** Content by key ("H07.shortLine"), falling back to the English given. */
  c: (key: string, english: string) => string;
  /** A site path in this language: "/styles" becomes "/ne/styles". */
  l: (path: string) => string;
}

export function i18n(locale: Locale): I18n {
  const map = locale === 'en' ? undefined : translations(locale);
  return {
    locale,
    t: (key, vars) => {
      if (!(key in en)) throw new Error(`Missing screen text: ${key}`);
      return fill(map?.[key] ?? en[key], vars);
    },
    c: (key, english) => (map?.[key] ? map[key]! : english),
    l: (path) => {
      if (locale === 'en' || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/dev')) return path;
      return `/${locale}${path === '/' ? '' : path}`;
    },
  };
}

/** i18n for the page being rendered. */
export const useI18n = (url: URL) => i18n(localeOf(url));

/** The same path in another language, for hreflang links and the language switch. */
export function pathIn(locale: Locale, url: URL): string {
  const bare = pagePath(url).replace(/^\/(ne|hi)(?=\/|$)/, '') || '/';
  return i18n(locale).l(bare);
}
