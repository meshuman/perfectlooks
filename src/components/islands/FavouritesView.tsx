import { useStore } from '@nanostores/preact';
import type { ClientItem } from '@/data/catalogue';
import { inLook, type SlotCategory } from '@/lib/look';
import { $favourites, $look, addItem, toggleFavourite, useReadyLook } from '@/lib/stores';
import { localPath, text } from '@/lib/ui';
import Icon from './Icon';
import Thumb from './Thumb';

type FavouriteItem = Omit<ClientItem, 'barber'>;

export default function FavouritesView({ items }: { items: FavouriteItem[] }) {
  const ids = useStore($favourites);
  const look = useStore($look);
  const byId = new Map(items.map((i) => [i.id, i]));
  const saved = ids.map((id) => byId.get(id)).filter((i): i is FavouriteItem => Boolean(i));

  if (saved.length === 0) {
    return (
      <div class="shell mt-8">
        <div class="core px-6 py-12 text-center">
        <span class="gold-fill mx-auto grid size-12 place-items-center rounded-full">
          <Icon name="heart" size={22} />
        </span>
        <p class="mt-4 font-display text-[1.5rem] leading-tight">{text('favourites.empty')}</p>
        <a href={localPath('/#browse')} class="mt-5 inline-flex h-11 items-center gap-2 bg-ink px-5 text-sm font-semibold text-white">
          {text('favourites.browse')}
          <Icon name="arrowRight" size={18} />
        </a>
        </div>
      </div>
    );
  }

  const add = (item: FavouriteItem) =>
    item.parts
      ? void useReadyLook(item.parts)
      : addItem({ id: item.id, name: item.name, category: item.category as SlotCategory, beardMode: item.beardMode });

  return (
    <ul class="mt-8 space-y-2">
      {saved.map((item) => {
        const added = !item.parts && inLook(look, item.id);
        return (
          <li key={item.id} class="shell">
            <div class="core flex gap-3 p-3">
            <a href={item.href} class="block shrink-0" tabIndex={-1} aria-hidden="true">
              <Thumb swatch={item.swatch} src={item.photo?.thumb} alt={item.photo?.alt} class="size-16" />
            </a>
            <div class="min-w-0 flex-1">
              <p class="eyebrow">{item.categoryLabel}</p>
              <a href={item.href} class="mt-0.5 block truncate text-[1.0625rem] leading-snug font-semibold">
                {item.name}
              </a>
              <p class="line-clamp-1 text-[0.8125rem] text-muted">{item.shortLine}</p>
              <div class="mt-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => add(item)}
                  aria-pressed={added}
                  class={`inline-flex h-9 items-center gap-1.5 px-3 text-xs font-semibold whitespace-nowrap transition active:scale-[0.97] ${
                    added ? 'bg-ink text-white' : 'gold-fill'
                  }`}
                >
                  <Icon name={added ? 'check' : 'plus'} size={15} strokeWidth={2.25} />
                  {added ? text('card.inLook') : text('card.addToLook')}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFavourite(item.id)}
                  class="h-9 bg-ink/[0.05] px-3 text-xs font-semibold whitespace-nowrap text-muted transition hover:text-ink"
                >
                  {text('favourites.remove')}
                </button>
              </div>
            </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
