// Small text helpers shared by the catalogue and the detail page.

export const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Splits a care line into a short headline and its detail:
 *   "5 min: blow dry the front up, then wax." -> "5 min" / "Blow dry the front up, then wax."
 *   "in 2-3 weeks, to keep the fade clean"    -> "In 2-3 weeks" / "To keep the fade clean"
 */
export function splitCare(text: string): { head: string; detail?: string } {
  const match = text.match(/^([^:]{1,14}):\s*(.+)$/) ?? text.match(/^(in [^,]+),\s*(.+)$/i);
  if (!match) return { head: capitalise(text) };
  return { head: capitalise(match[1]!), detail: capitalise(match[2]!) };
}
