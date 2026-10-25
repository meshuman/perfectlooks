import { describe, expect, it } from 'vitest';
import { mismatches, suits, type Match } from './match';

const quiff: Match = { face: ['Oval', 'Square', 'Round'], hairType: ['Straight', 'Wavy'], thinHairOk: false };
const copper: Match = { skin: ['Medium', 'Deep'], grey: ['None', 'Some'] };

describe('suits and mismatches', () => {
  it('lists no reasons when nothing answered applies', () => {
    expect(suits(quiff, 'hair', {})).toBeNull();
    expect(mismatches(quiff, 'hair', {})).toEqual([]);
    // A skin answer says nothing about a haircut.
    expect(suits(quiff, 'hair', { skin: 'Deep' })).toBeNull();
    expect(mismatches(quiff, 'hair', { skin: 'Deep' })).toEqual([]);
  });

  it('names every answer the style fails, in question order', () => {
    expect(mismatches(quiff, 'hair', { face: 'Long' })).toEqual(['face']);
    expect(mismatches(quiff, 'hair', { face: 'Heart', hairType: 'Curly', hairAmount: 'Thin' })).toEqual(['face', 'hairType', 'hairAmount']);
  });

  it('agrees with suits(): a style with no reasons suits, one with reasons does not', () => {
    for (const answers of [{ face: 'Round' }, { face: 'Long' }, { hairAmount: 'Thin' }, { hairAmount: 'Thick', face: 'Oval' }]) {
      const reasons = mismatches(quiff, 'hair', answers);
      expect(suits(quiff, 'hair', answers)).toBe(reasons.length === 0);
    }
  });

  it('judges colours by skin tone and grey', () => {
    expect(mismatches(copper, 'colours', { skin: 'Light' })).toEqual(['skin']);
    expect(mismatches(copper, 'colours', { skin: 'Deep', grey: 'Lots' })).toEqual(['grey']);
    expect(suits(copper, 'colours', { skin: 'Medium', grey: 'Some' })).toBe(true);
  });
});
