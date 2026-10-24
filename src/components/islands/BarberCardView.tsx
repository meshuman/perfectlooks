import { useStore } from '@nanostores/preact';
import type { ClientItem } from '@/data/catalogue';
import { barberSections, isEmpty } from '@/lib/look';
import { $barberLang, $cardTextSize, $look } from '@/lib/stores';
import { localPath, text } from '@/lib/ui';
import Icon from './Icon';
import Thumb from './Thumb';

type Lang = 'en' | 'ne' | 'hi';

interface Props {
  items: ClientItem[];
  /** Every language, each marked ready once its barber steps are complete. */
  languages: { code: Lang; label: string; ready: boolean }[];
  /** The Barber Card's own words (instructions, slot names, footer) in each ready language. */
  barberText: Partial<Record<Lang, Record<string, string>>>;
}

export default function BarberCardView({ items, languages, barberText }: Props) {
  const look = useStore($look);
  const size = useStore($cardTextSize);
  const chosen = useStore($barberLang);
  const pageLang = document.documentElement.lang as Lang;
  const ready = languages.filter((l) => l.ready).map((l) => l.code);
  // The barber's choice, else the page language if the card supports it, else English.
  const lang: Lang = chosen && ready.includes(chosen) ? chosen : ready.includes(pageLang) ? pageLang : 'en';
  const words = barberText[lang] ?? barberText.en ?? {};
  const say = (key: string) => words[key] ?? key;

  const byId = new Map(items.map((i) => [i.id, i]));
  const textFor = (id: string) => {
    const item = byId.get(id);
    return item?.barber[lang] ?? item?.barber.en;
  };
  const sections = barberSections(look, (id) => {
    const b = textFor(id);
    return b && { steps: b.steps, note: b.note };
  });
  const stepText = size === 'large' ? 'text-[1.625rem]' : 'text-xl';

  return (
    <div class="wrap max-w-2xl pt-4 pb-10">
      <header class="flex items-center justify-between gap-3">
        <a href={localPath('/my-look')} class="-ml-2 inline-flex h-11 items-center gap-1.5 px-2 text-sm font-semibold text-muted-dark hover:text-white">
          <Icon name="arrowLeft" size={20} />
          {text('barber.back')}
        </a>
        <div class="flex gap-1.5" role="group" aria-label={text('barber.textSize')}>
          {(['normal', 'large'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => $cardTextSize.set(s)}
              aria-pressed={size === s}
              class={`h-10 px-3.5 font-bold transition-colors ${
                size === s ? 'gold-fill' : 'text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.16)]'
              } ${s === 'large' ? 'text-base' : 'text-sm'}`}
            >
              {s === 'large' ? 'A+' : 'A'}
            </button>
          ))}
        </div>
      </header>

      <h1 class="mt-5 text-[2.25rem] leading-tight">{text('barber.heading')}</h1>

      <div class="mt-3 flex items-center gap-3 text-xs text-muted-dark">
        <span id="barber-language">{text('barber.language')}</span>
        <div class="flex p-0.5 font-semibold" role="group" aria-labelledby="barber-language">
          {languages.map((l) => (
            <button
              key={l.code}
              type="button"
              lang={l.code}
              disabled={!l.ready}
              aria-pressed={l.code === lang}
              title={l.ready ? undefined : text('site.comingSoon')}
              onClick={() => $barberLang.set(l.code)}
              class={`px-2.5 py-1.5 leading-none ${l.code === lang ? 'gold-fill' : 'text-muted-dark'} ${l.ready ? 'hover:text-white' : 'cursor-not-allowed'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {isEmpty(look) ? (
        <div class="mt-10 border border-line-dark p-6 text-center">
          <p class="text-lg font-semibold">{text('myLook.chooseOne')}</p>
          <a href={localPath('/my-look')} class="gold-fill mt-4 inline-flex h-11 items-center px-5 text-sm font-semibold">
            {text('barber.goToLook')}
          </a>
        </div>
      ) : (
        <div class="mt-6 divide-y divide-line-dark" lang={lang}>
          {sections.map((section) => (
            <section key={section.slot} class="py-6">
              <h2 class="text-xs font-bold tracking-[0.2em] text-gold uppercase">
                {say(`slot.${section.slot}`)}
                {section.item && <span class="text-white"> · {textFor(section.item.id)?.name ?? section.item.name}</span>}
              </h2>

              {section.item && (
                <Thumb
                  swatch={byId.get(section.item.id)?.swatch}
                  src={byId.get(section.item.id)?.photo?.large}
                  alt={byId.get(section.item.id)?.photo?.alt}
                  class="mt-4 aspect-square w-full max-w-72"
                />
              )}

              {section.steps.length > 0 && (
                <ol class="mt-4 space-y-3">
                  {section.steps.map((step, i) => (
                    <li key={i} class={`flex gap-3 leading-snug font-semibold ${stepText}`}>
                      <span class="w-7 shrink-0 text-gold">{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}

              {section.note && <p class="mt-4 bg-white/6 p-3 text-base text-muted-dark">{section.note}</p>}

              {section.lines.map((line) =>
                section.steps.length > 0 ? (
                  // An extra instruction after the steps, such as colouring the beard too.
                  <p key={line} class={`mt-4 flex items-start gap-3 border border-gold/40 p-3 leading-snug font-semibold text-gold ${stepText}`}>
                    <Icon name="plus" size={22} strokeWidth={2.25} class="mt-1" />
                    {say(line)}
                  </p>
                ) : (
                  <p key={line} class={`mt-3 leading-snug font-semibold ${stepText} ${section.noChange ? 'text-muted-dark' : ''}`}>
                    {say(line)}
                  </p>
                ),
              )}
            </section>
          ))}
        </div>
      )}

      <p class="mt-2 border-t border-line-dark pt-5 text-sm text-muted-dark" lang={lang}>
        {say('barber.checkFirst')}
      </p>
    </div>
  );
}
