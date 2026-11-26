// Runs on every page. Connects the static HTML to the shared state:
// tab counters, hearts, Add to My Look buttons, and "Suits you" sorting on lists.
import { filledCount, inLook, type AddData } from '@/lib/look';
import { answeredCount, mismatches, suits, type Match, type MatchCategory, type Question } from '@/lib/match';
import { $answers, $faceFilter, $favourites, $look, addItem, toggleFavourite, useReadyLook } from '@/lib/stores';
import { text } from '@/lib/ui';
import './scroll';
import './shop';
import './install';

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

  // "Find what suits you" is switched off for now: the link only shows as Edit once a preference exists.
  for (const link of all<HTMLElement>('[data-answers-link]')) link.hidden = !answered;
  for (const link of all<HTMLElement>('[data-answers-label]')) {
    link.textContent = answered ? text('list.edit') : text('list.findWhatSuits');
  }
  // Reset sits next to Edit once there is a preference to clear. The ones inside a verdict show with its states.
  for (const button of all<HTMLElement>('[data-answers-reset]')) {
    if (!button.closest('[data-verdict]')) button.hidden = !answered;
  }
});

for (const button of all<HTMLElement>('[data-answers-reset]')) {
  button.addEventListener('click', () => $answers.set({}));
}

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

// ---------- Search and filters (list pages) ----------

// One place decides which cards show: the face shape pick, the filter chips and the search text.
const norm = (value: string) => value.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const filters = { query: '', upkeep: '', popular: false, bleach: '', colourType: '', time: '', goal: '' };
const listRows = () => all<HTMLElement>('[data-item-list] > li');

const faceParam = new URLSearchParams(location.search).get('face');
if (faceParam && all<HTMLElement>('[data-face-chip]').some((chip) => chip.dataset.faceChip === faceParam)) $faceFilter.set(faceParam);
for (const chip of all<HTMLElement>('[data-face-chip]')) {
  chip.addEventListener('click', () => $faceFilter.set(chip.dataset.faceChip && $faceFilter.get() !== chip.dataset.faceChip ? chip.dataset.faceChip : ''));
}

function applyList() {
  const face = $faceFilter.get();
  let label = '';
  for (const chip of all<HTMLElement>('[data-face-chip]')) {
    const on = (chip.dataset.faceChip ?? '') === face;
    chip.setAttribute('aria-pressed', String(on));
    if (on && face) label = chip.textContent?.trim() ?? face;
  }
  for (const chip of all<HTMLElement>('[data-filter-upkeep]')) chip.setAttribute('aria-pressed', String((chip.dataset.filterUpkeep ?? '') === filters.upkeep));
  for (const chip of all<HTMLElement>('[data-filter-bleach]')) chip.setAttribute('aria-pressed', String((chip.dataset.filterBleach ?? '') === filters.bleach));
  for (const chip of all<HTMLElement>('[data-filter-popular]')) chip.setAttribute('aria-pressed', String(filters.popular));
  for (const chip of all<HTMLElement>('[data-filter-colourtype]')) chip.setAttribute('aria-pressed', String((chip.dataset.filterColourtype ?? '') === filters.colourType));

  for (const chip of all<HTMLElement>('[data-filter-time]')) chip.setAttribute('aria-pressed', String((chip.dataset.filterTime ?? '') === filters.time));
  for (const chip of all<HTMLElement>('[data-filter-goal]')) chip.setAttribute('aria-pressed', String((chip.dataset.filterGoal ?? '') === filters.goal));

  const query = norm(filters.query);
  for (const list of all<HTMLElement>('[data-item-list]')) {
    const faceable = list.hasAttribute('data-face-filterable');
    const rows = Array.from(list.children) as HTMLElement[];
    let shown = 0;
    for (const row of rows) {
      const match = row.querySelector<HTMLElement>('[data-match]')?.dataset.match;
      const faces = (match ? (JSON.parse(match) as Match).face : undefined) ?? [];
      const ok =
        (!face || !faceable || faces.length === 0 || faces.includes(face)) &&
        (!query || norm(row.dataset.search ?? '').includes(query)) &&
        (!filters.upkeep || row.dataset.upkeep === filters.upkeep) &&
        (!filters.popular || row.dataset.popular === 'true') &&
        (!filters.bleach || row.dataset.bleach === filters.bleach) &&
        (!filters.colourType || row.dataset.colourType === filters.colourType) &&
        (!filters.time || row.dataset.time === filters.time) &&
        (!filters.goal || row.dataset.goal === filters.goal);
      row.hidden = !ok;
      if (ok) shown += 1;
    }
    const count = document.querySelector<HTMLElement>('[data-count]');
    if (count) {
      const { total = String(rows.length), unit = '' } = count.dataset;
      count.textContent = `· ${shown < rows.length ? text('list.countOf', { shown: String(shown), total, unit }) : `${total} ${unit}`}`;
    }
    const none = document.querySelector<HTMLElement>('[data-no-matches]');
    if (none) none.hidden = shown > 0;
  }

  const active = [face, filters.upkeep, filters.popular, filters.bleach, filters.colourType, filters.time, filters.goal].filter(Boolean).length;
  for (const reset of all<HTMLElement>('[data-toolbar-reset]')) reset.hidden = active === 0 && !query;
  for (const badge of all<HTMLElement>('[data-filter-badge]')) {
    badge.textContent = String(active);
    badge.hidden = active === 0;
  }
  const note = document.querySelector<HTMLElement>('[data-face-note]');
  if (note) {
    note.hidden = !face;
    note.textContent = face ? text('list.faceNote', { face: label }) : '';
  }
}

$faceFilter.subscribe(applyList);

for (const chip of all<HTMLElement>('[data-filter-upkeep]')) {
  chip.addEventListener('click', () => {
    filters.upkeep = chip.dataset.filterUpkeep && filters.upkeep !== chip.dataset.filterUpkeep ? chip.dataset.filterUpkeep : '';
    applyList();
  });
}
for (const chip of all<HTMLElement>('[data-filter-bleach]')) {
  chip.addEventListener('click', () => {
    filters.bleach = chip.dataset.filterBleach && filters.bleach !== chip.dataset.filterBleach ? chip.dataset.filterBleach : '';
    applyList();
  });
}
for (const chip of all<HTMLElement>('[data-filter-colourtype]')) {
  chip.addEventListener('click', () => {
    filters.colourType = chip.dataset.filterColourtype && filters.colourType !== chip.dataset.filterColourtype ? chip.dataset.filterColourtype : '';
    applyList();
  });
}
for (const chip of all<HTMLElement>('[data-filter-time]')) {
  chip.addEventListener('click', () => {
    filters.time = chip.dataset.filterTime && filters.time !== chip.dataset.filterTime ? chip.dataset.filterTime : '';
    applyList();
  });
}
for (const chip of all<HTMLElement>('[data-filter-goal]')) {
  chip.addEventListener('click', () => {
    filters.goal = chip.dataset.filterGoal && filters.goal !== chip.dataset.filterGoal ? chip.dataset.filterGoal : '';
    applyList();
  });
}
for (const chip of all<HTMLElement>('[data-filter-popular]')) {
  chip.addEventListener('click', () => {
    filters.popular = !filters.popular;
    applyList();
  });
}

// The two icon buttons open their panels; the search box takes focus when it opens.
const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
const suggestBox = document.querySelector<HTMLElement>('[data-suggest]');
const searchClear = document.querySelector<HTMLElement>('[data-search-clear]');
let activeOption = -1;

function closeSuggestions() {
  if (!suggestBox || !searchInput) return;
  suggestBox.hidden = true;
  suggestBox.replaceChildren();
  activeOption = -1;
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.removeAttribute('aria-activedescendant');
}

for (const button of all<HTMLButtonElement>('[data-tool]')) {
  button.addEventListener('click', () => {
    const panel = document.getElementById(button.getAttribute('aria-controls')!);
    if (!panel) return;
    const open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    if (button.dataset.tool === 'search') {
      if (open) searchInput?.focus();
      else closeSuggestions();
    }
  });
}

// Arriving with a face shape already picked (from the home page) shows the filters, so the pick is visible.
if ($faceFilter.get()) {
  const toggle = document.querySelector<HTMLElement>('[data-tool="filters"]');
  const panel = document.getElementById('list-filters');
  if (toggle && panel) {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
  }
}

// Suggestions: the best few names for what has been typed. Picking one opens that page.
function renderSuggestions() {
  if (!searchInput || !suggestBox) return;
  const query = norm(searchInput.value);
  closeSuggestions();
  if (!query) return;
  const ranked = listRows()
    .map((row) => {
      const name = norm(row.dataset.name ?? '');
      const score = name.startsWith(query) ? 0 : name.split(/[\s-]+/).some((word) => word.startsWith(query)) ? 1 : name.includes(query) ? 2 : norm(row.dataset.search ?? '').includes(query) ? 3 : 9;
      return { row, score };
    })
    .filter((entry) => entry.score < 9)
    .sort((x, y) => x.score - y.score)
    .slice(0, 6);
  if (!ranked.length) return;
  ranked.forEach(({ row }, n) => {
    const item = document.createElement('li');
    item.id = `suggest-${n}`;
    item.setAttribute('role', 'option');
    item.className = 'aria-selected:bg-paper-2';
    const link = document.createElement('a');
    link.href = row.dataset.href ?? '#';
    link.className = 'flex min-h-11 items-center justify-between gap-3 px-4 py-2 text-[0.9375rem]';
    const name = document.createElement('span');
    name.className = 'font-semibold';
    name.textContent = row.dataset.name ?? '';
    const meta = document.createElement('span');
    meta.className = 'text-[0.75rem] text-muted';
    meta.textContent = row.dataset.meta ?? '';
    link.append(name, meta);
    item.append(link);
    suggestBox.append(item);
  });
  suggestBox.hidden = false;
  searchInput.setAttribute('aria-expanded', 'true');
}

function moveOption(step: number) {
  if (!suggestBox || suggestBox.hidden || !searchInput) return;
  const options = Array.from(suggestBox.children) as HTMLElement[];
  activeOption = (activeOption + step + options.length) % options.length;
  options.forEach((option, n) => option.setAttribute('aria-selected', String(n === activeOption)));
  searchInput.setAttribute('aria-activedescendant', options[activeOption]!.id);
}

searchInput?.addEventListener('input', () => {
  filters.query = searchInput.value;
  if (searchClear) searchClear.hidden = !searchInput.value;
  applyList();
  renderSuggestions();
});
searchInput?.addEventListener('focus', renderSuggestions);
searchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveOption(1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveOption(-1);
  } else if (event.key === 'Enter') {
    const chosen = suggestBox?.children[activeOption]?.querySelector('a');
    event.preventDefault();
    if (chosen) location.href = chosen.href;
    else closeSuggestions();
  } else if (event.key === 'Escape') {
    closeSuggestions();
  }
});
searchClear?.addEventListener('click', () => {
  if (!searchInput) return;
  searchInput.value = '';
  filters.query = '';
  searchClear.hidden = true;
  closeSuggestions();
  applyList();
  searchInput.focus();
});
document.addEventListener('click', (event) => {
  if (!(event.target as Element).closest('#list-search')) closeSuggestions();
});

for (const button of all<HTMLElement>('[data-filters-clear]')) {
  button.addEventListener('click', () => {
    Object.assign(filters, { query: '', upkeep: '', popular: false, bleach: '', colourType: '', time: '', goal: '' });
    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.hidden = true;
    closeSuggestions();
    if ($faceFilter.get()) $faceFilter.set('');
    else applyList();
  });
}

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
