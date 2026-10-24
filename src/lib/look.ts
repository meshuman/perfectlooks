// My Look rules and the Barber Card text (Overview: Favourites and My Look).
// Pure functions: used at build time for Ready Look pages and in the browser.
// Messages and Barber Card lines are screen-text keys (src/i18n/en.json), so each page shows them
// in its own language.

export type SlotKey = 'hair' | 'beard' | 'moustache' | 'colour';
export type SlotCategory = 'hair' | 'beards' | 'moustaches' | 'colours';
/** separate: follows the Moustache slot. trimmed: empty slot means "trim to match". included: slot is locked. */
export type BeardMode = 'separate' | 'trimmed' | 'included';

export interface Pick {
  id: string;
  name: string;
}

export interface BeardPick extends Pick {
  mode: BeardMode;
}

export interface Look {
  hair: Pick | null;
  beard: BeardPick | null;
  moustache: Pick | 'shave-off' | null;
  colour: Pick | null;
  colourBeard: boolean;
}

export const SLOTS: SlotKey[] = ['hair', 'beard', 'moustache', 'colour'];
const SLOT_OF: Record<SlotCategory, SlotKey> = { hair: 'hair', beards: 'beard', moustaches: 'moustache', colours: 'colour' };
export const slotOf = (category: SlotCategory): SlotKey => SLOT_OF[category];

export const emptyLook = (): Look => ({ hair: null, beard: null, moustache: null, colour: null, colourBeard: false });

export const moustacheLocked = (look: Look) => look.beard?.mode === 'included';
export const filledCount = (look: Look) => SLOTS.filter((s) => look[s] !== null).length;
export const isEmpty = (look: Look) => filledCount(look) === 0;

export const inLook = (look: Look, id: string) =>
  SLOTS.some((s) => {
    const v = look[s];
    return v !== null && v !== 'shave-off' && v.id === id;
  });

export interface AddInput {
  id: string;
  name: string;
  category: SlotCategory;
  beardMode?: BeardMode;
}

/** A toast message: a screen-text key, plus the slot and new name for "changed". */
export interface Message {
  key: 'look.added' | 'look.already' | 'look.beardHasMoustache' | 'look.changed';
  slot?: SlotKey;
  /** The new item's name, or a screen-text key for an action such as "Shave off". */
  name?: string;
  nameKey?: 'action.shaveOff';
}

export interface Change {
  look: Look;
  message: Message;
  changed: boolean;
}

const ADDED: Message = { key: 'look.added' };
const ALREADY: Message = { key: 'look.already' };
const HAS_MOUSTACHE: Message = { key: 'look.beardHasMoustache' };

/** A message in the page language. `text` looks up screen text and fills {placeholders}. */
export function messageText(m: Message, text: (key: string, vars?: Record<string, string>) => string): string {
  if (m.key !== 'look.changed') return text(m.key);
  return text('look.changed', { slot: text(`slot.${m.slot}`), name: m.name ?? text(m.nameKey!) });
}

export function addToLook(look: Look, input: AddInput): Change {
  const slot = slotOf(input.category);
  if (slot === 'moustache' && moustacheLocked(look)) {
    return { look, message: HAS_MOUSTACHE, changed: false };
  }
  if (inLook(look, input.id)) return { look, message: ALREADY, changed: false };

  const pick = { id: input.id, name: input.name };
  const next: Look = { ...look };
  if (slot === 'beard') {
    next.beard = { ...pick, mode: input.beardMode ?? 'separate' };
    // Van Dyke, Circle Beard, Balbo and Anchor Beard bring their own moustache.
    if (next.beard.mode === 'included') next.moustache = null;
  } else {
    next[slot] = pick;
  }
  const message: Message = look[slot] !== null ? { key: 'look.changed', slot, name: input.name } : ADDED;
  return { look: next, message, changed: true };
}

export function shaveOffMoustache(look: Look): Change {
  if (moustacheLocked(look)) return { look, message: HAS_MOUSTACHE, changed: false };
  if (look.moustache === 'shave-off') return { look, message: ALREADY, changed: false };
  const message: Message =
    look.moustache !== null ? { key: 'look.changed', slot: 'moustache', nameKey: 'action.shaveOff' } : ADDED;
  return { look: { ...look, moustache: 'shave-off' }, message, changed: true };
}

export function removeSlot(look: Look, slot: SlotKey): Look {
  return { ...look, [slot]: null, ...(slot === 'colour' && { colourBeard: false }) };
}

/** One slot of a Ready Look, as stored on its page. */
export interface LookPartInput {
  slot: SlotKey;
  id?: string;
  name?: string;
  beardMode?: BeardMode;
  action?: 'shave-off' | 'part-of-beard';
}

/** What an Add to My Look button carries: one catalogue item, or a whole Ready Look. */
export type AddData = AddInput | { look: true; id: string; name: string; parts: LookPartInput[] };

/** A Ready Look replaces every slot. Slots it doesn't list are left empty ("No change"). */
export function lookFromParts(parts: LookPartInput[]): Look {
  const look = emptyLook();
  for (const part of parts) {
    if (part.action === 'shave-off') look.moustache = 'shave-off';
    if (!part.id || !part.name) continue;
    const pick = { id: part.id, name: part.name };
    if (part.slot === 'beard') look.beard = { ...pick, mode: part.beardMode ?? 'separate' };
    else look[part.slot] = pick;
  }
  return look;
}

// ---------- Barber Card ----------

/** Barber Card instructions, as screen-text keys. */
export const CARD_LINES = {
  noChange: 'barberLine.noChange',
  shaveOff: 'barberLine.shaveOff',
  partOfBeard: 'barberLine.partOfBeard',
  colourBeard: 'barberLine.colourBeard',
  trimToMatch: 'barberLine.trimToMatch',
} as const;

export interface StepDetails {
  steps: string[];
  note?: string;
}

export interface BarberSection {
  slot: SlotKey;
  item?: Pick;
  steps: string[];
  note?: string;
  /** Plain instructions as screen-text keys, such as CARD_LINES.shaveOff. */
  lines: string[];
  /** True when the slot was left empty with nothing to do. */
  noChange: boolean;
}

/** The Barber Card, in the order Hair, Beard, Moustache, Colour. */
export function barberSections(look: Look, details: (id: string) => StepDetails | undefined): BarberSection[] {
  const fromPick = (slot: SlotKey, pick: Pick, extra: string[] = []): BarberSection => {
    const d = details(pick.id);
    return { slot, item: pick, steps: d?.steps ?? [], note: d?.note, lines: extra, noChange: false };
  };
  const line = (slot: SlotKey, text: string, noChange = false): BarberSection => ({ slot, steps: [], lines: [text], noChange });

  const moustache = (): BarberSection => {
    if (moustacheLocked(look)) return line('moustache', CARD_LINES.partOfBeard);
    if (look.moustache === 'shave-off') return line('moustache', CARD_LINES.shaveOff);
    if (look.moustache) return fromPick('moustache', look.moustache);
    if (look.beard?.mode === 'trimmed') return line('moustache', CARD_LINES.trimToMatch);
    return line('moustache', CARD_LINES.noChange, true);
  };

  return [
    look.hair ? fromPick('hair', look.hair) : line('hair', CARD_LINES.noChange, true),
    look.beard ? fromPick('beard', look.beard) : line('beard', CARD_LINES.noChange, true),
    moustache(),
    look.colour
      ? fromPick('colour', look.colour, look.colourBeard ? [CARD_LINES.colourBeard] : [])
      : line('colour', CARD_LINES.noChange, true),
  ];
}
