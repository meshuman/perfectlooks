import { scissorsMark } from '@/data/brand-marks.mjs';
import { backdropFor } from '@/lib/backdrop';

interface Props {
  /** The item's ID, so the placeholder sits on the same colour block as its photo. */
  id?: string;
  swatch?: string;
  /** A resized photo URL; when set it replaces the swatch or placeholder. */
  src?: string;
  alt?: string;
  class?: string;
}

/** Photo, colour swatch or placeholder, matching ItemPhoto.astro and PhotoPlaceholder.astro. */
export default function Thumb({ id = '', swatch, src, alt = '', class: className = '' }: Props) {
  if (src) return <img src={src} alt={alt} loading="lazy" decoding="async" class={`object-cover ${className}`} />;
  if (swatch) {
    return (
      <div class={`photo-bg grid place-items-center ${className}`}>
        <span class="size-[60%] rounded-full shadow-soft ring-2 ring-white/70" style={{ background: swatch }} />
      </div>
    );
  }
  return (
    <div class={`grid place-items-center text-ink ${backdropFor(id).className} ${className}`}>
      <svg viewBox="0 0 100 100" class="w-[40%] max-w-16 text-ink/25" aria-hidden="true" dangerouslySetInnerHTML={{ __html: scissorsMark('currentColor') }} />
    </div>
  );
}
