// "Suits you" matching for the About you questions.
// Pure functions: used at build time and in the browser.

export type MatchCategory = 'hair' | 'beards' | 'moustaches' | 'colours' | 'looks';

/** Suitability data stored on each item. */
export interface Match {
  face?: string[];
  hairType?: string[];
  thinHairOk?: boolean;
  growth?: string[];
  skin?: string[];
  grey?: string[];
}

/** The customer's answers. A missing answer means "Not sure". */
export interface Answers {
  face?: string;
  hairType?: string;
  hairAmount?: string;
  growth?: string;
  skin?: string;
  grey?: string;
}

export type Question = keyof Answers;

/** Which questions apply to which category (Overview: Suitability options). */
export const QUESTIONS_FOR: Record<MatchCategory, Question[]> = {
  hair: ['face', 'hairType', 'hairAmount'],
  beards: ['face', 'growth'],
  moustaches: ['face', 'growth'],
  colours: ['skin', 'grey'],
  looks: ['face', 'hairType', 'hairAmount', 'growth'],
};

export const answeredCount = (answers: Answers) => Object.values(answers).filter(Boolean).length;

/**
 * true: matches every answered question that applies to this category.
 * false: fails at least one.
 * null: no answered question applies, so no badge either way.
 */
export function suits(match: Match, category: MatchCategory, answers: Answers): boolean | null {
  const asked = QUESTIONS_FOR[category].filter((q) => answers[q]);
  if (asked.length === 0) return null;
  return asked.every((q) => {
    const answer = answers[q]!;
    if (q === 'hairAmount') return answer !== 'Thin' || match.thinHairOk === true;
    const allowed = match[q];
    return !allowed || allowed.includes(answer);
  });
}
