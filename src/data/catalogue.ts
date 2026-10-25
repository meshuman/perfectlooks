// One shape for every catalogue item, whatever its category, so pages and
// components don't need to know which collection an item came from.
// Items are loaded once in English, then localised per page language with localize().
import { splitCare } from '@/lib/text';
import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import { photoAlt, photoFor } from './photos';
import type { IconName } from './icons';
import { i18n as makeI18n, type I18n, type Locale, type UiKey } from '@/i18n';
import type { AddData, BeardMode, LookPartInput, SlotCategory } from '@/lib/look';
import type { Match } from '@/lib/match';
import { swatches } from './swatches';

export type CategoryKey = 'hair' | 'beards' | 'moustaches' | 'colours' | 'looks';

export interface Category {
  key: CategoryKey;
  /** URL segment, from the SEO document: /styles, /beards, ... */
  segment: string;
  icon: IconName;
}

export const categories: Record<CategoryKey, Category> = {
  hair: { key: 'hair', segment: 'styles', icon: 'scissors' },
  beards: { key: 'beards', segment: 'beards', icon: 'beard' },
  moustaches: { key: 'moustaches', segment: 'moustaches', icon: 'moustache' },
  colours: { key: 'colours', segment: 'colours', icon: 'droplet' },
  looks: { key: 'looks', segment: 'looks', icon: 'sparkles' },
};

export const categoryList = Object.values(categories);

/** A category's words in the page language: label, unit ("styles"), intro and SEO text. */
export function categoryText(key: CategoryKey, { t }: I18n) {
  const k = (field: string) => `category.${key}.${field}` as UiKey;
  return {
    label: t(k('label')),
    unit: t(k('unit')),
    intro: t(k('intro')),
    seoTitle: t(k('seoTitle')),
    seoDescription: t(k('seoDescription')),
    tileCount: t(k('tileCount')),
  };
}

const keyByPrefix: Record<string, CategoryKey> = { H: 'hair', B: 'beards', M: 'moustaches', C: 'colours', L: 'looks' };
export const categoryOf = (id: string): CategoryKey => keyByPrefix[id[0]!]!;

type Entry =
  | CollectionEntry<'hair'>
  | CollectionEntry<'beards'>
  | CollectionEntry<'moustaches'>
  | CollectionEntry<'colours'>
  | CollectionEntry<'looks'>;

export interface SuitsRow {
  label: string;
  values: string[];
}

/** A Ready Look slot. Names and beard modes are filled in once every item is loaded. */
export type LookPart = LookPartInput;

export interface GlanceCell {
  label: string;
  value: string;
  /** Draws the upkeep dots next to the value. */
  level?: 'Low' | 'Medium' | 'High';
}

export interface Item {
  id: string;
  category: CategoryKey;
  slug: string;
  href: string;
  name: string;
  shortLine: string;
  description: string;
  updated: Date;
  pickIf: string;
  skipIf: string;
  daily: string;
  weekly: string;
  nextVisit: string;
  atShop?: string;
  alsoCalled: string[];
  mainPhoto: 'front' | 'side';
  callouts: { title: string; text: string; x?: number; y?: number }[];
  faq: { q: string; a: string }[];
  barberSteps: string[];
  barberNote?: string;
  upkeep?: 'Low' | 'Medium' | 'High';
  /** Left text on the card, e.g. "Short" or "Level 2". */
  cardMeta: string;
  /** Right text on the card where there is no upkeep, e.g. "45 min". */
  cardAside?: string;
  /** Short facts shown as chips on the detail page. */
  facts: string[];
  /** The four things to know first, shown as the detail page's "at a glance" strip. */
  glance: GlanceCell[];
  suits: SuitsRow[];
  swatch?: string;
  swatchLabel?: string;
  parts?: LookPart[];
  /** Beards only: how the beard treats the Moustache slot. */
  beardMoustache?: BeardMode;
  match: Match;
  /** English source values the localised text is built from. */
  raw: { length?: string; coversGrey?: string; bleach?: string; timeAtShop?: string; swatchLabel?: string };
}

function toItem(entry: Entry): Item {
  const d = entry.data;
  const category = entry.collection as CategoryKey;
  const base = {
    id: entry.id,
    category,
    slug: d.slug,
    href: `/${categories[category].segment}/${d.slug}`,
    name: d.name,
    shortLine: d.shortLine,
    description: d.description,
    updated: d.updated,
    pickIf: d.pickIf,
    skipIf: d.skipIf,
    daily: d.daily,
    weekly: d.weekly,
    nextVisit: d.nextVisit,
    atShop: d.atShop,
    alsoCalled: d.alsoCalled,
    mainPhoto: d.mainPhoto,
    callouts: d.callouts,
    faq: 'faq' in d ? d.faq : [],
    barberSteps: 'barberSteps' in d ? d.barberSteps : [],
    barberNote: 'barberNote' in d ? d.barberNote : undefined,
    // Filled in by localize().
    cardMeta: '',
    facts: [] as string[],
    glance: [] as GlanceCell[],
    suits: [] as SuitsRow[],
  };

  switch (entry.collection) {
    case 'hair': {
      const h = entry.data;
      return {
        ...base,
        upkeep: h.upkeep,
        match: { face: h.face, hairType: h.hairType, thinHairOk: h.thinHairOk },
        raw: { length: h.length },
      };
    }
    case 'beards':
    case 'moustaches': {
      const b = entry.data;
      return {
        ...base,
        upkeep: b.upkeep,
        match: { face: b.face, growth: b.growth },
        beardMoustache: entry.collection === 'beards' ? entry.data.moustacheMode : undefined,
        raw: { length: b.length },
      };
    }
    case 'colours': {
      const c = entry.data;
      return {
        ...base,
        match: { skin: c.skin, grey: c.grey },
        swatch: swatches[entry.id],
        swatchLabel: c.swatchLabel,
        raw: { coversGrey: c.coversGrey, bleach: c.bleach, timeAtShop: c.timeAtShop, swatchLabel: c.swatchLabel },
      };
    }
    case 'looks': {
      const l = entry.data;
      const action = l.moustacheMode === 'shave-off' || l.moustacheMode === 'part-of-beard' ? l.moustacheMode : undefined;
      const parts: LookPart[] = [
        { slot: 'hair', id: l.hair.id },
        ...(l.beard ? [{ slot: 'beard' as const, id: l.beard.id }] : []),
        ...(l.moustache ? [{ slot: 'moustache' as const, id: l.moustache.id }] : []),
        ...(action ? [{ slot: 'moustache' as const, action }] : []),
        ...(l.colour ? [{ slot: 'colour' as const, id: l.colour.id }] : []),
      ];
      return {
        ...base,
        upkeep: l.upkeep,
        match: { face: l.face, hairType: l.hairType, thinHairOk: l.thinHairOk, growth: l.growth },
        parts,
        raw: {},
      };
    }
  }
}

/** An item's text in one language. English uses the same path, so there is one way to build it. */
export function localize(item: Item, i: I18n): Item {
  const { t, c, l } = i;
  const f = (field: string, english: string) => c(`${item.id}.${field}`, english);
  const values = (prefix: string, list: string[]) => list.map((v) => t(`${prefix}.${v}` as UiKey));
  const m = item.match;
  const upkeep = item.upkeep ? t(`upkeep.${item.upkeep}` as UiKey) : '';

  let cardMeta = '';
  let cardAside: string | undefined;
  let facts: string[] = [];
  let glance: GlanceCell[] = [];
  let suits: SuitsRow[] = [];
  const faceRow = () => ({ label: t('suits.face'), values: m.face!.length === 5 ? [t('suits.allFaces')] : values('face', m.face!) });
  const typeRow = () => ({
    label: t('suits.hairType'),
    values: m.hairType!.length === 3 ? [t('suits.allHairTypes')] : values('hairType', m.hairType!),
  });
  const growthRow = () => ({ label: t('suits.growth'), values: m.growth!.length === 3 ? [t('suits.anyGrowth')] : values('growth', m.growth!) });

  const daily = { label: t('detail.daily'), value: splitCare(f('daily', item.daily)).head };
  const nextVisit = { label: t('detail.nextVisit'), value: splitCare(f('nextVisit', item.nextVisit)).head };
  const upkeepCell = { label: t('upkeep.label'), value: upkeep, level: item.upkeep };

  switch (item.category) {
    case 'hair': {
      const length = f('length', item.raw.length!);
      cardMeta = length;
      glance = [{ label: t('detail.length'), value: length }, upkeepCell, daily, nextVisit];
      facts = [length, t('facts.upkeep', { level: upkeep })];
      suits = [faceRow(), typeRow(), { label: t('suits.thinHair'), values: [m.thinHairOk ? t('suits.thinOk') : t('suits.thinNotIdeal')] }];
      break;
    }
    case 'beards':
    case 'moustaches': {
      const length = f('length', item.raw.length!);
      cardMeta = length;
      glance = [{ label: t('detail.length'), value: length }, upkeepCell, daily, nextVisit];
      facts = [length, t('facts.upkeep', { level: upkeep })];
      suits = [faceRow(), growthRow()];
      break;
    }
    case 'colours': {
      const level = item.raw.swatchLabel!.match(/^Level ([\d.–-]+)/)?.[1];
      cardMeta = level ? t('facts.level', { level }) : t('facts.plantColour');
      cardAside = f('timeAtShop', item.raw.timeAtShop!);
      glance = [
        { label: t('detail.coversGrey'), value: f('coversGrey', item.raw.coversGrey!) },
        { label: t('detail.bleach'), value: f('bleach', item.raw.bleach!) },
        { label: t('detail.atShop'), value: cardAside },
        nextVisit,
      ];
      facts = [
        cardMeta,
        t('facts.coversGrey', { value: f('coversGrey', item.raw.coversGrey!) }),
        t('facts.bleach', { value: f('bleach', item.raw.bleach!) }),
      ];
      suits = [
        { label: t('suits.skin'), values: m.skin!.length === 3 ? [t('suits.allSkin')] : values('skin', m.skin!) },
        { label: t('suits.grey'), values: m.grey!.length === 3 ? [t('suits.anyGrey')] : values('grey', m.grey!) },
      ];
      break;
    }
    case 'looks': {
      const named = item.parts!.filter((p) => p.id);
      cardMeta = named.map((p) => t(`slot.${p.slot}` as UiKey)).join(' + ');
      glance = [upkeepCell, { label: t('detail.includes'), value: cardMeta }, daily, nextVisit];
      facts = [t('facts.upkeep', { level: upkeep }), t('facts.parts', { count: named.length })];
      suits = [faceRow(), typeRow(), growthRow()];
      break;
    }
  }

  return {
    ...item,
    href: l(item.href),
    name: f('name', item.name),
    shortLine: f('shortLine', item.shortLine),
    description: f('description', item.description),
    pickIf: f('pickIf', item.pickIf),
    skipIf: f('skipIf', item.skipIf),
    daily: f('daily', item.daily),
    weekly: f('weekly', item.weekly),
    nextVisit: f('nextVisit', item.nextVisit),
    atShop: item.atShop && f('atShop', item.atShop),
    alsoCalled: item.alsoCalled.length ? f('alsoCalled', item.alsoCalled.join(', ')).split(/,\s*/) : [],
    callouts: item.callouts.map((co, n) => ({ ...co, title: f(`callout.${n + 1}.title`, co.title), text: f(`callout.${n + 1}.text`, co.text) })),
    faq: item.faq.map((q, n) => ({ q: f(`faq.${n + 1}.q`, q.q), a: f(`faq.${n + 1}.a`, q.a) })),
    barberSteps: item.barberSteps.map((s, n) => f(`step.${n + 1}`, s)),
    barberNote: item.barberNote && f('barberNote', item.barberNote),
    swatchLabel: item.swatchLabel && f('swatchLabel', item.swatchLabel),
    parts: item.parts?.map((p) => (p.id ? { ...p, name: c(`${p.id}.name`, p.name!) } : p)),
    cardMeta,
    cardAside,
    facts,
    glance,
    suits,
  };
}

let cache: Item[] | undefined;
const localized = new Map<Locale, Item[]>();

/** Every catalogue item in catalogue order (H, B, M, C, L, then by number), in the given language. */
export async function getAllItems(i: I18n = makeI18n('en')): Promise<Item[]> {
  if (!cache) {
    const entries = (
      await Promise.all([
        getCollection('hair'),
        getCollection('beards'),
        getCollection('moustaches'),
        getCollection('colours'),
        getCollection('looks'),
      ])
    ).flat() as Entry[];
    const order = 'HBMCL';
    const items = entries
      .map(toItem)
      .sort((a, b) => order.indexOf(a.id[0]!) - order.indexOf(b.id[0]!) || a.id.localeCompare(b.id));
    const byId = new Map(items.map((it) => [it.id, it]));
    for (const look of items) {
      for (const part of look.parts ?? []) {
        if (!part.id) continue;
        const item = byId.get(part.id)!;
        part.name = item.name;
        part.beardMode = item.beardMoustache;
      }
    }
    cache = items;
  }
  const hit = localized.get(i.locale);
  if (hit) return hit;
  const result = cache.map((item) => localize(item, i));
  localized.set(i.locale, result);
  return result;
}

export async function getItems(category: CategoryKey, i?: I18n): Promise<Item[]> {
  return (await getAllItems(i)).filter((it) => it.category === category);
}

export async function getItemMap(i?: I18n): Promise<Map<string, Item>> {
  return new Map((await getAllItems(i)).map((it) => [it.id, it]));
}

// ---------- SEO text ----------

/** "oval, square and round faces" */
function joinAnd(values: string[]): string {
  const v = values.map((x) => x.toLowerCase());
  return v.length > 1 ? `${v.slice(0, -1).join(', ')} and ${v.at(-1)}` : v[0]!;
}

/** The name plus what it is, when the English name alone doesn't say: "Handlebar moustache", "Van Dyke beard". */
function searchName(item: Item, english: string, { t }: I18n): string {
  const { name, category } = item;
  if (category === 'beards' && !/beard|shave|stubble|goatee|patch|chops|strap/i.test(english)) return t('detail.searchName.beards', { name });
  if (category === 'moustaches') return t('detail.searchName.moustaches', { name });
  if (category === 'colours' && !/highlights|blending/i.test(english)) return t('detail.searchName.colours', { name });
  if (category === 'looks') return t('detail.searchName.looks', { name });
  return name;
}

/** `english` is the item's English name, used to decide whether to add "beard", "moustache" and so on. */
export function seoTitle(item: Item, english: string, i: I18n): string {
  return i.t('detail.seoTitle', { name: searchName(item, english, i) });
}

/**
 * English follows the SEO document: [Short line] Suits [face shapes]. [Daily]. Next cut in [weeks].
 * Other languages use the translated short line and description. Max 155 characters.
 */
export function seoDescription(item: Item, i: I18n): string {
  const sentence = (s: string) => (/[.!?।]$/.test(s) ? s : `${s}.`);
  if (i.locale !== 'en') return `${sentence(item.shortLine)} ${item.description}`.slice(0, 155);

  const raw = item.match;
  const parts = [sentence(item.shortLine)];
  if (raw.face) parts.push(raw.face.length === 5 ? 'Suits every face shape.' : `Suits ${joinAnd(raw.face)} faces.`);
  if (raw.skin) parts.push(raw.skin.length === 3 ? 'Suits all skin tones.' : `Suits ${joinAnd(raw.skin)} skin.`);

  const daily = item.daily.match(/^([^:]+):/)?.[1];
  if (daily) parts.push(`Daily: ${daily}.`);
  else if (/^nothing/i.test(item.daily)) parts.push('No daily styling.');

  const next = item.nextVisit.split(',')[0]!;
  parts.push(`Next ${item.category === 'colours' ? 'visit' : 'cut'} ${next}.`);

  while (parts.length > 1 && parts.join(' ').length > 155) parts.splice(parts.length - 2, 1);
  return parts.join(' ').slice(0, 155);
}

// ---------- Browser data ----------

export function addDataFor(item: Item): AddData {
  return item.parts
    ? { look: true, id: item.id, name: item.name, parts: item.parts }
    : { id: item.id, name: item.name, category: item.category as SlotCategory, beardMode: item.beardMoustache };
}

/** The slice of an item that Favourites, My Look and the Barber Card need in the browser. */
export interface ClientItem {
  id: string;
  name: string;
  href: string;
  category: CategoryKey;
  categoryLabel: string;
  shortLine: string;
  cardMeta: string;
  swatch?: string;
  mainPhoto: 'front' | 'side';
  /** Resized photo URLs, once the item has a photo: small for lists, large for the Barber Card. */
  photo?: { thumb: string; large: string; alt: string };
  beardMode?: BeardMode;
  parts?: LookPartInput[];
  /** Barber steps, name and note in each language the Barber Card offers. */
  barber: Partial<Record<Locale, { name: string; steps: string[]; note?: string }>>;
}

async function clientPhoto(item: Item): Promise<ClientItem['photo']> {
  const src = photoFor(item.id);
  if (!src) return undefined;
  const [thumb, large] = await Promise.all([
    getImage({ src, width: 320, format: 'webp' }),
    getImage({ src, width: 720, format: 'webp' }),
  ]);
  return { thumb: thumb.src, large: large.src, alt: photoAlt(item) };
}

/** Items for the browser, in the page language, with barber text in every Barber Card language. */
export async function getClientItems(i: I18n, barberLanguages: Locale[] = ['en']): Promise<ClientItem[]> {
  const items = await getAllItems(i);
  const perLanguage = await Promise.all(barberLanguages.map(async (lang) => [lang, await getItemMap(makeI18n(lang))] as const));
  const photos = await Promise.all(items.map(clientPhoto));
  return items.map((it, n) => ({
    id: it.id,
    name: it.name,
    href: it.href,
    category: it.category,
    categoryLabel: categoryText(it.category, i).label,
    shortLine: it.shortLine,
    cardMeta: it.cardMeta,
    swatch: it.swatch,
    mainPhoto: it.mainPhoto,
    photo: photos[n],
    beardMode: it.beardMoustache,
    parts: it.parts,
    barber: Object.fromEntries(
      perLanguage.map(([lang, map]) => {
        const b = map.get(it.id)!;
        return [lang, { name: b.name, steps: b.barberSteps, note: b.barberNote }];
      }),
    ),
  }));
}
