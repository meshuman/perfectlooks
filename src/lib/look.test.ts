import { describe, expect, it } from 'vitest';
import {
  addToLook,
  barberSections,
  CARD_LINES,
  emptyLook,
  filledCount,
  lookFromParts,
  removeSlot,
  shaveOffMoustache,
  type Look,
} from './look';
import { suits } from './match';
import en from '../i18n/en.json';
import { messageText, type Message } from './look';

// Messages as English users see them.
const say = (m: Message) =>
  messageText(m, (key, vars) => (en as Record<string, string>)[key]!.replace(/\{(\w+)\}/g, (_, k: string) => vars?.[k] ?? ''));

const lowFade = { id: 'H07', name: 'Low Fade', category: 'hair' as const };
const taper = { id: 'H06', name: 'Taper Cut', category: 'hair' as const };
const vanDyke = { id: 'B07', name: 'Van Dyke', category: 'beards' as const, beardMode: 'included' as const };
const stubble = { id: 'B02', name: 'Light Stubble', category: 'beards' as const, beardMode: 'trimmed' as const };
const cleanShave = { id: 'B01', name: 'Clean Shave', category: 'beards' as const, beardMode: 'separate' as const };
const chevron = { id: 'M02', name: 'Chevron', category: 'moustaches' as const };
const black = { id: 'C02', name: 'Natural Black', category: 'colours' as const };

const steps = (id: string) => ({ steps: [`${id} step`] });
const add = (look: Look, ...inputs: Parameters<typeof addToLook>[1][]) =>
  inputs.reduce((l, i) => addToLook(l, i).look, look);

describe('addToLook', () => {
  it('fills an empty slot', () => {
    const r = addToLook(emptyLook(), lowFade);
    expect(r.look.hair).toEqual({ id: 'H07', name: 'Low Fade' });
    expect(say(r.message)).toBe('Added to My Look');
  });

  it('replaces a filled slot and says so', () => {
    const r = addToLook(add(emptyLook(), lowFade), taper);
    expect(r.look.hair?.id).toBe('H06');
    expect(say(r.message)).toBe('Hair changed to Taper Cut');
  });

  it('does nothing when the item is already there', () => {
    const r = addToLook(add(emptyLook(), lowFade), lowFade);
    expect(r.changed).toBe(false);
    expect(say(r.message)).toBe('Already in My Look');
  });

  it('clears and locks the moustache for a beard that includes one', () => {
    const look = add(emptyLook(), chevron, vanDyke);
    expect(look.moustache).toBeNull();
    const r = addToLook(look, chevron);
    expect(r.changed).toBe(false);
    expect(say(r.message)).toBe('This beard already has a moustache.');
    expect(shaveOffMoustache(look).changed).toBe(false);
  });
});

describe('shave off and remove', () => {
  it('sets Shave off, and a moustache style replaces it', () => {
    const shaved = shaveOffMoustache(emptyLook()).look;
    expect(shaved.moustache).toBe('shave-off');
    const r = addToLook(shaved, chevron);
    expect(say(r.message)).toBe('Moustache changed to Chevron');
  });

  it('turns the beard colour switch off with the colour', () => {
    const look = { ...add(emptyLook(), black), colourBeard: true };
    expect(removeSlot(look, 'colour')).toMatchObject({ colour: null, colourBeard: false });
  });
});

describe('lookFromParts', () => {
  it('replaces every slot, including ones the look leaves empty', () => {
    const current = add(emptyLook(), lowFade, chevron, black);
    const look = lookFromParts([
      { slot: 'hair', id: 'H18', name: 'Two-Block' },
      { slot: 'beard', id: 'B01', name: 'Clean Shave', beardMode: 'separate' },
      { slot: 'moustache', action: 'shave-off' },
    ]);
    expect(current.colour).not.toBeNull();
    expect(look).toEqual({
      hair: { id: 'H18', name: 'Two-Block' },
      beard: { id: 'B01', name: 'Clean Shave', mode: 'separate' },
      moustache: 'shave-off',
      colour: null,
      colourBeard: false,
    });
    expect(filledCount(look)).toBe(3);
  });
});

describe('barberSections', () => {
  const lines = (look: Look) => barberSections(look, steps).map((s) => [s.slot, s.item?.name ?? s.lines[0]]);

  it('says No change for every empty slot', () => {
    expect(lines(emptyLook())).toEqual([
      ['hair', CARD_LINES.noChange],
      ['beard', CARD_LINES.noChange],
      ['moustache', CARD_LINES.noChange],
      ['colour', CARD_LINES.noChange],
    ]);
  });

  it('trims the moustache to match a "trimmed with beard" beard', () => {
    expect(lines(add(emptyLook(), stubble))[2]).toEqual(['moustache', CARD_LINES.trimToMatch]);
  });

  it('keeps an empty moustache as No change with a separate beard', () => {
    expect(lines(add(emptyLook(), cleanShave))[2]).toEqual(['moustache', CARD_LINES.noChange]);
  });

  it('marks the moustache as part of the beard style', () => {
    expect(lines(add(emptyLook(), vanDyke))[2]).toEqual(['moustache', CARD_LINES.partOfBeard]);
  });

  it('uses a chosen moustache style over the trim rule', () => {
    expect(lines(add(emptyLook(), stubble, chevron))[2]).toEqual(['moustache', 'Chevron']);
  });

  it('adds the beard colour line when the switch is on', () => {
    const section = barberSections({ ...add(emptyLook(), black), colourBeard: true }, steps)[3]!;
    expect(section.steps).toEqual(['C02 step']);
    expect(section.lines).toEqual([CARD_LINES.colourBeard]);
  });
});

describe('suits', () => {
  const lowFadeMatch = { face: ['Oval', 'Square', 'Round', 'Heart'], hairType: ['Straight', 'Wavy', 'Curly'], thinHairOk: true };

  it('gives no verdict when no answered question applies', () => {
    expect(suits(lowFadeMatch, 'hair', {})).toBeNull();
    expect(suits(lowFadeMatch, 'hair', { skin: 'Light' })).toBeNull();
  });

  it('needs every applicable answer to match', () => {
    expect(suits(lowFadeMatch, 'hair', { face: 'Round' })).toBe(true);
    expect(suits(lowFadeMatch, 'hair', { face: 'Long' })).toBe(false);
  });

  it('treats thin hair as a requirement and normal or thick as fine', () => {
    expect(suits({ thinHairOk: false }, 'hair', { hairAmount: 'Thin' })).toBe(false);
    expect(suits({ thinHairOk: false }, 'hair', { hairAmount: 'Thick' })).toBe(true);
  });

  it('matches beard growth against what the style needs', () => {
    const needsFull = { growth: ['Full'] };
    expect(suits(needsFull, 'beards', { growth: 'Patchy' })).toBe(false);
    expect(suits(needsFull, 'beards', { growth: 'Full' })).toBe(true);
  });
});
