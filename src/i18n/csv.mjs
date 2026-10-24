// Minimal CSV reading and writing for the translation sheets (RFC 4180: quoted fields,
// doubled quotes, line breaks inside quotes). Plain JavaScript so build scripts can use it too.

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const input = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && input[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell !== ''));
}

const quote = (value) => (/[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

/** CSV with a byte-order mark, so Excel opens it as UTF-8 and shows Devanagari correctly. */
export function writeCsv(rows) {
  return '\uFEFF' + rows.map((r) => r.map((cell) => quote(String(cell ?? ''))).join(',')).join('\r\n') + '\r\n';
}

/** Reads a translation sheet into { key: { english, translation, status } }. Header: key, where, english, translation, status, note. */
export function readSheet(text) {
  const [header, ...rows] = parseCsv(text);
  const col = (name) => header.indexOf(name);
  const [k, e, t, s] = [col('key'), col('english'), col('translation'), col('status')];
  if (k < 0 || e < 0 || t < 0) throw new Error('translation sheet needs key, english and translation columns');
  return Object.fromEntries(
    rows.map((r) => [r[k], { english: r[e] ?? '', translation: (r[t] ?? '').trim(), status: s < 0 ? '' : (r[s] ?? '').trim() }]),
  );
}
