/**
 * Catalogue order by what Gen Z and millennial clients ask for most (2025–2026 barber and style-forum trends),
 * most wanted first. Anything not listed follows in catalogue order. IDs never change, so saved photos stay put.
 */
export const TREND_ORDER: Record<string, string[]> = {
  H: ['H23', 'H28', 'H09', 'H52', 'H31', 'H62', 'H73', 'H19', 'H34', 'H89', 'H08', 'H05', 'H77', 'H38', 'H14', 'H90', 'H91', 'H93', 'H94', 'H92', 'H13', 'H32', 'H72', 'H11', 'H24', 'H37', 'H18', 'H36', 'H76', 'H42', 'H79', 'H78', 'H75', 'H69', 'H26', 'H39', 'H07', 'H12', 'H10', 'H15', 'H53', 'H54', 'H47', 'H48', 'H49', 'H82', 'H85', 'H61', 'H03', 'H02'],
  B: ['B03', 'B02', 'B10', 'B04', 'B05', 'B12', 'B07', 'B06', 'B13', 'B11', 'B01', 'B14', 'B09', 'B08', 'B15', 'B16'],
  M: ['M09', 'M01', 'M02', 'M03', 'M04', 'M10', 'M05', 'M06', 'M08', 'M07', 'M11', 'M12'],
  C: ['C06', 'C31', 'C07', 'C10', 'C20', 'C32', 'C03', 'C15', 'C14', 'C08', 'C09', 'C28', 'C21', 'C19', 'C16', 'C24', 'C05', 'C33', 'C17', 'C27', 'C11', 'C18'],
  L: ['L11', 'L38', 'L09', 'L73', 'L68', 'L71', 'L72', 'L79', 'L61', 'L63', 'L67', 'L62', 'L24', 'L03', 'L32', 'L18', 'L30', 'L42', 'L16', 'L69', 'L70', 'L74', 'L75', 'L76', 'L77', 'L78', 'L43', 'L44', 'L29', 'L27', 'L26', 'L39', 'L47', 'L64', 'L65', 'L10', 'L19', 'L35', 'L34', 'L33', 'L08', 'L02', 'L01', 'L14', 'L66', 'L55', 'L13'],
};

/** How many of each list carry the Popular tag (on top of any item already marked Popular in the content). */
const POPULAR_TOP: Record<string, number> = { H: 12, B: 5, M: 3, C: 6, L: 6 };

export const trendRank = (id: string): number => {
  const at = TREND_ORDER[id[0]!]?.indexOf(id) ?? -1;
  return at === -1 ? 1000 + Number(id.slice(1)) : at;
};

export const isTrending = (id: string): boolean => trendRank(id) < (POPULAR_TOP[id[0]!] ?? 0);
