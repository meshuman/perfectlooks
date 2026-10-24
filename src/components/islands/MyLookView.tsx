import { useStore } from '@nanostores/preact';
import type { ClientItem } from '@/data/catalogue';
import type { IconName } from '@/data/icons';
import { isEmpty, messageText, moustacheLocked, removeSlot, shaveOffMoustache, SLOTS, type SlotKey } from '@/lib/look';
import { $look } from '@/lib/stores';
import { localPath, text, toast } from '@/lib/ui';
import Icon from './Icon';

const SLOT_ICON: Record<SlotKey, IconName> = { hair: 'scissors', beard: 'beard', moustache: 'moustache', colour: 'droplet' };
const SLOT_LIST: Record<SlotKey, string> = { hair: '/styles', beard: '/beards', moustache: '/moustaches', colour: '/colours' };

export default function MyLookView({ items }: { items: ClientItem[] }) {
  const look = useStore($look);
  const byId = new Map(items.map((i) => [i.id, i]));
  const locked = moustacheLocked(look);
  const empty = isEmpty(look);

  const shaveOff = () => {
    const result = shaveOffMoustache(look);
    if (result.changed) $look.set(result.look);
    toast(messageText(result.message, text));
  };

  return (
    <>
      <ul class="mt-8 space-y-2">
        {SLOTS.map((slot) => {
          const value = look[slot];
          const pick = value && value !== 'shave-off' ? value : null;
          const item = pick ? byId.get(pick.id) : undefined;
          const isLocked = slot === 'moustache' && locked;
          const filled = value !== null || isLocked;
          const slotName = text(`slot.${slot}`);
          // Saved looks keep the name they were added with; show it in this page's language.
          const label = isLocked
            ? text('myLook.partOfBeard')
            : value === 'shave-off'
              ? text('action.shaveOff')
              : (item?.name ?? pick?.name ?? text('myLook.noChange'));
          const hint = slot === 'moustache' && !value && !isLocked && look.beard?.mode === 'trimmed' ? text('myLook.trimHint') : undefined;

          return (
            <li key={slot} class="shell">
              <div class="core p-3.5">
                <div class="flex items-center gap-3">
                  <span class={`grid size-11 shrink-0 place-items-center rounded-full ${filled ? 'gold-fill' : 'bg-paper text-muted'}`}>
                    <Icon name={SLOT_ICON[slot]} size={20} />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="eyebrow">{slotName}</p>
                    {item ? (
                      <a href={item.href} class="block truncate text-[1.0625rem] leading-snug font-semibold underline-offset-4 hover:underline">
                        {label}
                      </a>
                    ) : (
                      <p class={`truncate text-[1.0625rem] leading-snug font-semibold ${filled ? '' : 'text-muted'}`}>{label}</p>
                    )}
                  </div>
                  {isLocked ? (
                    <span class="text-xs font-semibold text-muted">{text('myLook.locked')}</span>
                  ) : value ? (
                    <div class="flex gap-1.5">
                      <a href={localPath(SLOT_LIST[slot])} class="grid h-9 place-items-center bg-ink/[0.05] px-3 text-xs font-semibold">
                        {text('myLook.change')}
                      </a>
                      <button
                        type="button"
                        onClick={() => $look.set(removeSlot(look, slot))}
                        class="grid size-9 place-items-center rounded-full bg-ink/[0.05] text-muted hover:text-ink"
                        aria-label={text('myLook.remove', { slot: slotName })}
                      >
                        <Icon name="x" size={16} />
                      </button>
                    </div>
                  ) : (
                    <a href={localPath(SLOT_LIST[slot])} class="grid h-9 place-items-center bg-ink px-4 text-xs font-semibold text-white">
                      {text('myLook.choose')}
                    </a>
                  )}
                </div>

                {hint && <p class="mt-2 pl-14 text-xs text-muted">{hint}</p>}

                {slot === 'moustache' && !isLocked && value !== 'shave-off' && (
                  <div class="mt-3 pl-14">
                    <button type="button" onClick={shaveOff} class="h-9 bg-ink/[0.05] px-3.5 text-xs font-semibold">
                      {text('action.shaveOff')}
                    </button>
                  </div>
                )}

                {slot === 'colour' && look.colour && (
                  <label class="mt-3 flex cursor-pointer items-center justify-between gap-3 border-t border-line/70 pt-3 pl-14">
                    <span class="text-sm font-semibold">{text('myLook.colourBeard')}</span>
                    <input
                      type="checkbox"
                      checked={look.colourBeard}
                      onChange={(e) => $look.set({ ...look, colourBeard: e.currentTarget.checked })}
                      class="peer sr-only"
                    />
                    <span class="relative h-7 w-12 shrink-0 rounded-full bg-paper-2 transition-colors peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-gold after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-card after:shadow-soft after:transition-transform peer-checked:after:translate-x-5" />
                  </label>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div class="mt-6 space-y-3">
        {empty ? (
          <>
            <span
              aria-disabled="true"
              class="flex h-14 w-full cursor-not-allowed items-center justify-center bg-ink/[0.05] text-[0.9375rem] font-semibold text-muted"
            >
              {text('myLook.showToBarber')}
            </span>
            <p class="text-center text-sm text-muted">{text('myLook.chooseOne')}</p>
          </>
        ) : (
          <a
            href={localPath('/barber-card')}
            class="gold-fill group flex h-14 w-full items-center justify-center gap-3 text-base font-medium tracking-[0.04em] transition duration-300 ease-out-soft active:scale-[0.99]"
          >
            {text('myLook.showToBarber')}
            <Icon name="arrowRight" size={18} strokeWidth={1.25} class="transition-transform duration-300 ease-out-soft group-hover:translate-x-1" />
          </a>
        )}
        <a href={localPath('/looks')} class="block text-center text-sm font-semibold text-gold-ink underline-offset-4 hover:underline">
          {text('myLook.pickReadyLook')}
        </a>
      </div>
    </>
  );
}
