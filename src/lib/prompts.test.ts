import { describe, expect, it } from 'vitest';
import parts from '../content/image-prompts.json';
import hair from '../content/hair.json';
import beards from '../content/beards.json';
import moustaches from '../content/moustaches.json';
import colours from '../content/colours.json';
import looks from '../content/looks.json';
import { backdropFor } from './backdrop';
import type { Match } from './match';
import { buildPrompt, faceFor, traitsFor, type StyleTraits } from './prompts';

const all = Object.entries(parts.items);

const catalogue: Record<string, StyleTraits> = Object.fromEntries(
  (
    [
      ['hair', hair],
      ['beards', beards],
      ['moustaches', moustaches],
      ['colours', colours],
      ['looks', looks],
    ] as const
  ).flatMap(([category, items]) =>
    (items as unknown as (Match & { id: string })[]).map((i) => [
      i.id,
      { category, match: i, older: parts.items[i.id as keyof typeof parts.items].older },
    ]),
  ),
);

const prompt = (id: string, clean: boolean) =>
  buildPrompt(parts, id, parts.items[id as keyof typeof parts.items].block, clean, catalogue[id]);

describe('buildPrompt', () => {
  it('keeps every line of the document in the labelled version', () => {
    for (const [id, item] of all) {
      const text = prompt(id, false);
      const lines = [parts.fixed, parts.categories[id[0] as keyof typeof parts.categories], item.block, parts.avoid].flatMap((b) => b.split('\n'));
      // The character line's face is set per style (tested below); every other line is kept as written.
      const reshaped = faceFor(catalogue[id]!.match) !== 'Oval';
      for (const line of lines) {
        if (reshaped && line.startsWith('CHARACTER (')) continue;
        expect(text, `${id}: ${line}`).toContain(line.trim());
      }
    }
  });

  it('puts what the image shows first and the avoid list last', () => {
    const text = prompt('H01', true).split('\n');
    expect(text[0]).toMatch(/^Photorealistic studio image/);
    expect(text[1]).toBe('ITEM: H01 Buzz Cut');
    expect(text[2]).toMatch(/^STYLE: one even length/);
    expect(text.indexOf(text.find((l) => l.startsWith('CHARACTER'))!)).toBeLessThan(text.findIndex((l) => l.startsWith('LIGHT')));
    expect(text.at(-2)).toMatch(/^AVOID: any text,/);
  });

  it('uses the same backdrop in the document as the app placeholder, once per prompt', () => {
    for (const [id, item] of all) {
      const { name, hex } = backdropFor(id);
      expect(item.block, id).toContain(`BACKDROP: ${name} (${hex}).`);
      expect(prompt(id, true).match(/BACKDROP:/g), id).toHaveLength(1);
      if (id.startsWith('C')) expect(prompt(id, true), id).toContain('BACKDROP: Sand (#D8CDBF).');
    }
  });

  it('still adds a backdrop to an item block that lacks one', () => {
    const bare = 'ITEM: H01 Buzz Cut\nMAIN VIEW: three-quarter front, facing left';
    expect(buildPrompt(parts, 'H01', bare, true)).toContain('BACKDROP: Sky blue (#A9C9E8).');
  });

  it('leaves no callout instructions in any clean prompt', () => {
    for (const [id] of all) {
      const clean = prompt(id, true);
      expect(clean, id).not.toMatch(/CALLOUTS:|Four or five callouts|Callouts point|One callout|shade name and level|callout labels/);
      expect(clean, id).toMatch(/No callouts, lines, dots or text\.$/);
      expect(clean, id).toContain(`ITEM: ${id}`);
    }
  });
});

describe('traitsFor', () => {
  it('keeps his own skin, because it suits every item', () => {
    for (const [id, traits] of Object.entries(catalogue)) {
      if (traits.match.skin) expect(traits.match.skin, id).toContain('Medium');
    }
  });

  it('shows each style on a face shape it suits, and the one it does most for', () => {
    for (const [id, traits] of Object.entries(catalogue)) {
      const face = faceFor(traits.match);
      if (traits.match.face) expect(traits.match.face, id).toContain(face);
    }
    expect(faceFor(catalogue.H14!.match)).toBe('Round'); // Quiff: height lengthens a round face
    expect(faceFor(catalogue.H35!.match)).toBe('Long'); // Mushroom Cut: adds width
    expect(faceFor(catalogue.H01!.match)).toBe('Square'); // Buzz Cut: oval or square only
    expect(faceFor(catalogue.L23!.match)).toBe('Heart');
    expect(faceFor(catalogue.H06!.match)).toBe('Oval'); // Taper Cut suits every face
    expect(faceFor(catalogue.C01!.match)).toBe('Oval'); // colours keep his own face
  });

  it('describes the chosen face in the character text, with no oval left over', () => {
    const quiff = prompt('H14', true);
    expect(quiff).toContain('a round face, about as wide as it is long');
    expect(quiff).toContain('Face: round face, about as wide as it is long');
    expect(quiff).not.toMatch(/oval/i);
    expect(quiff).toContain('only the face shape differs');
    expect(prompt('H06', true)).toContain('an oval face with a clean, defined jawline');
    expect(prompt('H06', true)).toContain('Match the attached character reference exactly.');
  });

  it('gives curly styles curls and straight-only styles straight hair', () => {
    expect(prompt('H26', true)).toContain('Hair texture: natural, defined curls');
    expect(prompt('L19', true)).toContain('Hair texture: natural, defined curls');
    expect(prompt('H37', true)).toContain('Hair texture: straight and smooth');
    expect(prompt('H01', true)).toContain('Hair texture: straight, as in the reference.');
  });

  it('gives full hair where thin hair is not suitable', () => {
    expect(prompt('H13', true)).toContain('Hair density: thick and full');
    expect(prompt('H01', true)).not.toContain('Hair density');
  });

  it('matches beard and moustache growth to what the style needs', () => {
    expect(prompt('B05', true)).toContain('thick, dense beard growth with no gaps');
    expect(prompt('M04', true)).toContain('thick, dense moustache growth with no gaps');
    expect(prompt('B04', true)).toContain('even beard growth with no patches');
    expect(prompt('B06', true)).not.toContain('Beard growth');
  });

  it('marks the older items', () => {
    expect(traitsFor(catalogue.C08!)).toContain('Age: about 50, as in the older reference.');
    expect(traitsFor(catalogue.H01!)).not.toContain('Age: about 50, as in the older reference.');
  });
});
