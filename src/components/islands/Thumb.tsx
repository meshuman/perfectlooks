import Icon from './Icon';

interface Props {
  swatch?: string;
  /** A resized photo URL; when set it replaces the swatch or placeholder. */
  src?: string;
  alt?: string;
  class?: string;
}

/** Photo, colour swatch or placeholder, matching ItemPhoto.astro. */
export default function Thumb({ swatch, src, alt = '', class: className = '' }: Props) {
  if (src) return <img src={src} alt={alt} loading="lazy" decoding="async" class={`object-cover ${className}`} />;
  return (
    <div class={`photo-bg grid place-items-center text-[#a8a296] ${className}`}>
      {swatch ? (
        <span class="size-[60%] rounded-full shadow-soft ring-2 ring-white/70" style={{ background: swatch }} />
      ) : (
        <Icon name="user" size={28} strokeWidth={1.25} />
      )}
    </div>
  );
}
