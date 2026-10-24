// Shared browser state. Saved to sessionStorage, so it lasts for this visit only
// and clears when the customer closes the page (Overview: Favourites and My Look).
import { atom, type WritableAtom } from 'nanostores';
import { addToLook, emptyLook, isEmpty, lookFromParts, messageText, type AddInput, type Look, type LookPartInput } from './look';
import type { Answers } from './match';
import { confirmDialog, text, toast } from './ui';

function sessionAtom<T>(key: string, initial: T): WritableAtom<T> {
  let start = initial;
  if (typeof window !== 'undefined') {
    try {
      const saved = sessionStorage.getItem(key);
      if (saved) start = JSON.parse(saved) as T;
    } catch {
      // Private mode or blocked storage: start empty.
    }
  }
  const store = atom<T>(start);
  if (typeof window !== 'undefined') {
    store.listen((value) => {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Storage unavailable: state still works until the page closes.
      }
    });
  }
  return store;
}

export const $favourites = sessionAtom<string[]>('pl:favourites', []);
export const $look = sessionAtom<Look>('pl:look', emptyLook());
export const $answers = sessionAtom<Answers>('pl:answers', {});
/** The face shape picked in the Hair, Beard and Moustache lists. Empty means all. Separate from the About you answers. */
export const $faceFilter = sessionAtom<string>('pl:face-filter', '');
export const $cardTextSize = sessionAtom<'normal' | 'large'>('pl:card-text', 'normal');
/** The Barber Card's language, chosen by the barber. Empty means the page language. */
export const $barberLang = sessionAtom<'' | 'en' | 'ne' | 'hi'>('pl:barber-lang', '');

export function toggleFavourite(id: string): void {
  const current = $favourites.get();
  if (current.includes(id)) {
    $favourites.set(current.filter((x) => x !== id));
    toast(text('fav.removed'));
  } else {
    $favourites.set([...current, id]);
    toast(text('fav.saved'));
  }
}

export function addItem(input: AddInput): void {
  const result = addToLook($look.get(), input);
  if (result.changed) $look.set(result.look);
  toast(messageText(result.message, text));
}

/** Picking a Ready Look replaces every slot, after the customer confirms. */
export async function useReadyLook(parts: LookPartInput[]): Promise<void> {
  if (!isEmpty($look.get()) && !(await confirmDialog(text('look.replaceConfirm')))) return;
  $look.set(lookFromParts(parts));
  toast(text('look.added'));
}
