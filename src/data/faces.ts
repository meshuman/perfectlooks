// The five face shapes, with their outlines (SVG path data, 40x48), shared by the face-shape
// filter on the Hair, Beard and Moustache lists.
export const FACE_SHAPES = [
  { value: 'Oval', shape: 'M20 6c7.5 0 13 7.6 13 18s-5.5 18-13 18S7 34.4 7 24 12.5 6 20 6Z' },
  { value: 'Round', shape: 'M20 8a16 16 0 1 1 0 32 16 16 0 0 1 0-32Z' },
  { value: 'Square', shape: 'M12 7h16a6 6 0 0 1 6 6v20a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8V13a6 6 0 0 1 6-6Z' },
  { value: 'Long', shape: 'M20 3c6 0 10 5 10 12v18c0 7-4 12-10 12s-10-5-10-12V15c0-7 4-12 10-12Z' },
  { value: 'Heart', shape: 'M6 14c0-6 6-9 14-9s14 3 14 9c0 12-7 24-14 29C13 38 6 26 6 14Z' },
] as const;

/** Categories whose lists can be filtered by face shape. */
export const FACE_FILTER_CATEGORIES = ['hair', 'beards', 'moustaches'] as const;
