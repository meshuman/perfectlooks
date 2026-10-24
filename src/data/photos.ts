// Catalogue photos from src/assets/catalogue, named by item ID (H07.jpg, B04.png, ...).
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/catalogue/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

const photos = new Map(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.\w+$/, '').toUpperCase(), mod.default]),
);

export const photoFor = (id: string): ImageMetadata | undefined => photos.get(id);
export const photoCount = () => photos.size;

/** Alt text from the SEO document: "[Style], [main photo angle] view". */
export const photoAlt = (item: { name: string; mainPhoto: 'front' | 'side' }) => `${item.name}, ${item.mainPhoto} view`;
