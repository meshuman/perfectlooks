import { describe, expect, it } from 'vitest';
import { parseCsv, readSheet, writeCsv } from './csv.mjs';

describe('translation sheets', () => {
  it('round-trips quotes, commas, line breaks and Devanagari', () => {
    const rows = [
      ['key', 'where', 'english', 'translation', 'status', 'note'],
      ['a', 'Screen text', 'Say "hi", please', 'नमस्ते, "हजुर"', '', ''],
      ['b', 'Learn', '## Heading\n\n- one\n- two', '## शीर्षक\n\n- एक', 'check', 'Markdown'],
    ];
    expect(parseCsv(writeCsv(rows))).toEqual(rows);
  });

  it('starts with a byte-order mark so Excel opens it as UTF-8', () => {
    expect(writeCsv([['a']]).charCodeAt(0)).toBe(0xfeff);
  });

  it('reads Windows line endings and trims translations', () => {
    const sheet = readSheet('key,english,translation,status\r\nsite.yes,Yes,  हो  ,\r\nsite.no,No,,check\r\n');
    expect(sheet['site.yes']).toEqual({ english: 'Yes', translation: 'हो', status: '' });
    expect(sheet['site.no']).toEqual({ english: 'No', translation: '', status: 'check' });
  });

  it('refuses a sheet without the required columns', () => {
    expect(() => readSheet('id,text\nx,y\n')).toThrow(/key, english and translation/);
  });
});
