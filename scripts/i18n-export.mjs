// Writes the translation sheets translations/ne.csv and translations/hi.csv from the site's
// current English, keeping every translation already in them, then reports progress.
// Usage: npm run import && npm run i18n
//
// Columns: key, where, english, translation, status, note.
// - translation: the translator's text. Empty rows show English on the site.
// - status: "draft" for translations not yet reviewed by a native speaker, "check" when the English
//   changed after the row was translated. Reviewers clear the status; until then the row isn't used
//   (drafts are used in PL_DRAFTS=1 review builds).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { readSheet, writeCsv } from '../src/i18n/csv.mjs';
import { isBarberKey } from '../src/i18n/content-keys.mjs';
import { allStrings } from '../src/i18n/strings.mjs';

const config = JSON.parse(readFileSync('translations/config.json', 'utf8'));
const strings = allStrings();

for (const locale of Object.keys(config)) {
  const path = `translations/${locale}.csv`;
  const old = existsSync(path) ? readSheet(readFileSync(path, 'utf8')) : {};
  let done = 0;
  let check = 0;
  let drafts = 0;
  let barberDone = 0;
  const barberTotal = strings.filter((s) => isBarberKey(s.key)).length;

  const rows = strings.map((s) => {
    const prev = old[s.key];
    const translation = prev?.translation ?? '';
    let status = prev?.status ?? '';
    if (translation && prev.english !== s.english) status = 'check';
    const counts = translation && status === '';
    if (counts) done++;
    if (counts && isBarberKey(s.key)) barberDone++;
    if (status.toLowerCase() === 'check') check++;
    if (translation && status.toLowerCase() === 'draft') drafts++;
    return [s.key, s.where, s.english, translation, status, s.note ?? ''];
  });

  const dropped = Object.keys(old).filter((k) => !strings.some((s) => s.key === k));
  writeFileSync(path, writeCsv([['key', 'where', 'english', 'translation', 'status', 'note'], ...rows]));

  const pct = (a, b) => `${a}/${b} (${Math.floor((a / b) * 100)}%)`;
  console.log(`${config[locale].name} (${locale}): ${pct(done, strings.length)} reviewed, ${drafts} drafts to review, ${check} to check`);
  console.log(`  Barber Card steps: ${pct(barberDone, barberTotal)}${barberDone === barberTotal ? ', switch available' : ''}`);
  const live = done + (config[locale].useDrafts ? drafts : 0);
  const note = config[locale].useDrafts && drafts ? ', using unreviewed drafts' : '';
  console.log(`  Published: ${config[locale].publish && live === strings.length ? `yes${note}` : `no (${live === strings.length ? 'set "publish": true in translations/config.json' : 'sheet not complete'})`}`);
  if (dropped.length) console.log(`  Removed ${dropped.length} rows no longer used by the site.`);
}
