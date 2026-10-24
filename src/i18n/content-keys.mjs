// Translation keys for catalogue and Learn content, shared by the sheet export and the site.
// A key names one field of one item, for example "H07.shortLine", "H07.step.2" or "P03.body".

/** Every translatable field of a catalogue item (as imported into src/content/*.json). */
export function itemStrings(item) {
  const where = `${item.id} ${item.name}`;
  const out = [];
  const add = (field, english, note) => {
    if (english) out.push({ key: `${item.id}.${field}`, where, english, note });
  };
  add('name', item.name, 'Catalogue name. Keep it, or write the name customers use.');
  add('shortLine', item.shortLine);
  add('description', item.description);
  add('pickIf', item.pickIf, 'Follows "Pick this if".');
  add('skipIf', item.skipIf, 'Follows "Skip if".');
  add('daily', item.daily);
  add('weekly', item.weekly);
  add('nextVisit', item.nextVisit);
  add('atShop', item.atShop);
  add('alsoCalled', item.alsoCalled?.join(', '), 'Comma-separated names.');
  add('length', item.length);
  add('coversGrey', item.coversGrey);
  add('bleach', item.bleach);
  add('timeAtShop', item.timeAtShop);
  add('swatchLabel', item.swatchLabel);
  (item.faq ?? []).forEach((f, i) => {
    add(`faq.${i + 1}.q`, f.q);
    add(`faq.${i + 1}.a`, f.a, 'Keep any <a href="..."> link tags as they are.');
  });
  (item.barberSteps ?? []).forEach((s, i) => add(`step.${i + 1}`, s, 'Barber step: short command. Keep machine numbers, mm, fingers and words like trimmer, razor, fade.'));
  add('barberNote', item.barberNote, 'Barber note.');
  (item.callouts ?? []).forEach((c, i) => {
    add(`callout.${i + 1}.title`, c.title, 'Photo label title.');
    add(`callout.${i + 1}.text`, c.text, 'Photo label line.');
  });
  return out;
}

/** Every translatable field of a Learn post (frontmatter plus the Markdown body). */
export function postStrings(post) {
  const where = `${post.code} ${post.title}`;
  const out = [];
  const add = (field, english, note) => {
    if (english) out.push({ key: `${post.code}.${field}`, where, english, note });
  };
  add('title', post.title, 'Page title: the question people search, about 60 characters.');
  add('description', post.description, 'Search snippet: up to 155 characters.');
  add('shortAnswer', post.shortAnswer, '40–60 words that make sense on their own.');
  add('body', post.body, 'Markdown: keep ## headings, lists, tables and [links](/...) as they are.');
  add('fromTheChair', post.fromTheChair);
  (post.faq ?? []).forEach((f, i) => {
    add(`faq.${i + 1}.q`, f.q);
    add(`faq.${i + 1}.a`, f.a, 'Keep any <a href="..."> link tags as they are.');
  });
  add('imageAlt', post.imageAlt);
  (post.sources ?? []).forEach((s, i) => add(`source.${i + 1}`, s, 'Keep the <a href="..."> link tag as it is.'));
  return out;
}

/** Keys of the barber steps and notes, which the Barber Card needs in the barber's language. */
export const isBarberKey = (key) => /^[HBMC]\d{2}\.(step\.\d+|barberNote)$/.test(key);
