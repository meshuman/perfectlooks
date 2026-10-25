// Runs on every page. Connects the static HTML to the shared state:
// tab counters, hearts, Add to My Look buttons, and "Suits you" sorting on lists.
import { filledCount, inLook, type AddData } from '@/lib/look';
import { answeredCount, mismatches, suits, type Match, type MatchCategory, type Question } from '@/lib/match';
import { $answers, $faceFilter, $favourites, $look, addItem, toggleFavourite, useReadyLook } from '@/lib/stores';
import { text } from '@/lib/ui';

const all = <T extends Element>(selector: string) => Array.from(document.querySelectorAll<T>(selector));

function setCounter(name: string, count: number) {
  for (const el of all<HTMLElement>(`[data-counter="${name}"]`)) {
    el.textContent = String(count);
    el.hidden = count === 0;
  }
}

// ---------- Counters, hearts and add buttons ----------

$favourites.subscribe((ids) => {
  setCounter('favourites', ids.length);
  for (const btn of all<HTMLButtonElement>('[data-save]')) {
    btn.setAttribute('aria-pressed', String(ids.includes(btn.dataset.save!)));
  }
});

$look.subscribe((look) => {
  setCounter('my-look', filledCount(look));
  for (const btn of all<HTMLButtonElement>('[data-add]')) {
    const data = JSON.parse(btn.dataset.add!) as AddData;
    if ('look' in data) continue;
    const added = inLook(look, data.id);
    btn.setAttribute('aria-pressed', String(added));
    const label = btn.querySelector('[data-add-label]');
    if (label) label.textContent = added ? text('card.inLook') : text('card.addToLook');
  }
});

document.addEventListener('click', (event) => {
  const target = event.target as Element;
  const save = target.closest<HTMLElement>('[data-save]');
  if (save) {
    toggleFavourite(save.dataset.save!);
    return;
  }
  const add = target.closest<HTMLElement>('[data-add]');
  if (add) {
    const data = JSON.parse(add.dataset.add!) as AddData;
    if ('look' in data) void useReadyLook(data.parts);
    else addItem(data);
    return;
  }
  if (target.closest('[data-clear-answers]')) $answers.set({});
});

// ---------- Scroll reveal ----------

// Elements marked data-reveal fade up once as they enter the screen.
const reveal = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      reveal.unobserve(entry.target);
    }
  },
  { rootMargin: '0px 0px -8% 0px' },
);
for (const el of all('[data-reveal]')) reveal.observe(el);

// ---------- "Suits you" badges and list order ----------

$answers.subscribe((answers) => {
  const answered = answeredCount(answers) > 0;

  for (const card of all<HTMLElement>('[data-item][data-match]')) {
    const result = suits(JSON.parse(card.dataset.match!) as Match, card.dataset.category as MatchCategory, answers);
    card.dataset.suits = String(result);
    const badge = card.querySelector<HTMLElement>('[data-suits-badge]');
    if (badge) badge.hidden = result !== true;
  }

  for (const list of all<HTMLElement>('[data-item-list]')) {
    const rows = Array.from(list.children) as HTMLElement[];
    rows.forEach((row, i) => (row.dataset.order ??= String(i)));
    const rank = (row: HTMLElement) => (row.querySelector<HTMLElement>('[data-item]')?.dataset.suits === 'true' ? 0 : 1);
    rows
      .sort((a, b) => rank(a) - rank(b) || Number(a.dataset.order) - Number(b.dataset.order))
      .forEach((row) => list.append(row));

    // Only meaningful when an answered question applies to this category.
    const verdicts = rows.map((r) => r.querySelector<HTMLElement>('[data-item]')?.dataset.suits);
    const applies = verdicts.some((v) => v !== 'null');
    const matches = verdicts.filter((v) => v === 'true').length;
    const note = document.querySelector<HTMLElement>('[data-sorted-note]');
    const empty = document.querySelector<HTMLElement>('[data-no-results]');
    if (note) note.hidden = !(applies && matches > 0);
    if (empty) empty.hidden = !(applies && matches === 0);
  }

  for (const link of all<HTMLElement>('[data-answers-label]')) {
    link.textContent = answered ? text('list.edit') : text('list.findWhatSuits');
  }
});

// ---------- Personal verdict on a detail page ----------

// Which "suits.*" label names each question when a style doesn't fit an answer.
const REASON_LABEL: Record<Question, string> = {
  face: 'suits.face',
  hairType: 'suits.hairType',
  hairAmount: 'suits.thinHair',
  growth: 'suits.growth',
  skin: 'suits.skin',
  grey: 'suits.grey',
};

$answers.subscribe((answers) => {
  for (const verdict of all<HTMLElement>('[data-verdict]')) {
    const match = JSON.parse(verdict.dataset.match!) as Match;
    const category = verdict.dataset.category as MatchCategory;
    const result = suits(match, category, answers);
    const state = result === null ? 'ask' : result ? 'yes' : 'no';
    for (const part of Array.from(verdict.querySelectorAll<HTMLElement>('[data-state-for]'))) part.hidden = part.dataset.stateFor !== state;
    const reasons = verdict.querySelector<HTMLElement>('[data-verdict-reasons]');
    if (reasons && state === 'no') {
      const names = mismatches(match, category, answers).map((q) => text(REASON_LABEL[q]).toLowerCase());
      reasons.textContent = text('detail.verdictNoText', { reasons: names.join(', ') });
    }
  }
  // Outline the visitor's own face shape or skin tone in the "Who it suits" panel.
  for (const option of all<HTMLElement>('[data-fit-option]')) {
    option.toggleAttribute('data-you', answers[option.dataset.fitQ as Question] === option.dataset.fitOption);
  }
});

// ---------- Face shape filter (Hair, Beard and Moustache lists) ----------

// Hides the styles that don't suit the picked face shape. The pick is shared by the three lists.
const faceParam = new URLSearchParams(location.search).get('face');
if (faceParam && all<HTMLElement>('[data-face-chip]').some((chip) => chip.dataset.faceChip === faceParam)) $faceFilter.set(faceParam);
for (const chip of all<HTMLElement>('[data-face-chip]')) {
  chip.addEventListener('click', () => $faceFilter.set(chip.dataset.faceChip && $faceFilter.get() !== chip.dataset.faceChip ? chip.dataset.faceChip : ''));
}

$faceFilter.subscribe((face) => {
  let label = '';
  for (const chip of all<HTMLElement>('[data-face-chip]')) {
    const on = (chip.dataset.faceChip ?? '') === face;
    chip.setAttribute('aria-pressed', String(on));
    if (on && face) label = chip.textContent?.trim() ?? face;
  }

  for (const list of all<HTMLElement>('[data-item-list][data-face-filterable]')) {
    let shown = 0;
    const rows = Array.from(list.children) as HTMLElement[];
    for (const row of rows) {
      const match = row.querySelector<HTMLElement>('[data-match]')?.dataset.match;
      const faces = (match ? (JSON.parse(match) as Match).face : undefined) ?? [];
      const ok = !face || faces.length === 0 || faces.includes(face);
      row.hidden = !ok;
      if (ok) shown += 1;
    }
    const count = document.querySelector<HTMLElement>('[data-count]');
    if (count) {
      const { total = String(rows.length), unit = '' } = count.dataset;
      count.textContent = `· ${face ? text('list.countOf', { shown: String(shown), total, unit }) : `${total} ${unit}`}`;
    }
  }

  const note = document.querySelector<HTMLElement>('[data-face-note]');
  if (note) {
    note.hidden = !face;
    note.textContent = face ? text('list.faceNote', { face: label }) : '';
  }
});

// ---------- Offline ----------

// Stores the app on the phone so it keeps working when the shop's Wi-Fi drops.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => void navigator.serviceWorker.register('/sw.js'));
}

const offlineBanner = document.getElementById('pl-offline');
const showConnection = () => {
  if (offlineBanner) offlineBanner.hidden = navigator.onLine;
};
window.addEventListener('online', showConnection);
window.addEventListener('offline', showConnection);
showConnection();
