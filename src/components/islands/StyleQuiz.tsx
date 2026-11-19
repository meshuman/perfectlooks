import { useState } from 'preact/hooks';
import { text } from '@/lib/ui';

interface Entry {
  name: string;
  photo: string;
  /** hair or looks: wrong answers come from the same kind, so they look like real options. */
  kind: string;
}

const ROUNDS = 10;

interface Question {
  entry: Entry;
  options: string[];
}

const shuffle = <T,>(list: T[]): T[] => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
};

const build = (pool: Entry[]): Question[] =>
  shuffle(pool)
    .slice(0, ROUNDS)
    .map((entry) => {
      const others = shuffle(pool.filter((p) => p.kind === entry.kind && p.name !== entry.name)).slice(0, 3);
      return { entry, options: shuffle([entry.name, ...others.map((o) => o.name)]) };
    });

export default function StyleQuiz({ pool, browseHref }: { pool: Entry[]; browseHref: string }) {
  const [questions, setQuestions] = useState<Question[]>(() => build(pool));
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | undefined>();
  const [score, setScore] = useState(0);

  const total = questions.length;
  const done = round >= total;
  const q = questions[round];

  const pick = (option: string) => {
    if (picked || !q) return;
    setPicked(option);
    if (option === q.entry.name) setScore(score + 1);
  };

  const restart = () => {
    setQuestions(build(pool));
    setRound(0);
    setPicked(undefined);
    setScore(0);
  };

  if (total === 0) return null;

  if (done) {
    return (
      <div class="mx-auto mt-6 max-w-md bg-paper-2 p-6 text-center">
        <p class="text-[1.5rem] leading-tight font-bold">{text('quiz.result', { score: String(score), total: String(total) })}</p>
        <div class="mt-5 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={restart} class="min-h-11 bg-ink px-5 text-sm font-semibold text-white">
            {text('play.again')}
          </button>
          <a href={browseHref} class="inline-flex min-h-11 items-center bg-card px-5 text-sm font-semibold shadow-[inset_0_0_0_1px_var(--color-line)]">
            {text('quiz.browse')}
          </a>
        </div>
      </div>
    );
  }

  const correct = picked === q!.entry.name;

  return (
    <div class="mx-auto mt-6 max-w-md">
      <div class="flex items-center justify-between text-[0.8125rem] text-muted">
        <span>{text('quiz.round', { n: String(round + 1), total: String(total) })}</span>
        <span class="font-semibold text-ink tabular-nums">
          {text('quiz.score')}: {score}
        </span>
      </div>

      <img src={q!.entry.photo} alt="" width={720} height={720} class="mt-2 aspect-square w-full object-cover" />
      <h2 class="mt-4 text-[1.25rem] font-semibold">{text('quiz.question')}</h2>

      <ul class="mt-3 grid gap-2">
        {q!.options.map((option) => {
          const isAnswer = option === q!.entry.name;
          const state = !picked ? '' : isAnswer ? 'bg-block-sage' : option === picked ? 'bg-block-blush' : 'opacity-60';
          return (
            <li key={option}>
              <button
                type="button"
                onClick={() => pick(option)}
                disabled={Boolean(picked)}
                class={`flex min-h-12 w-full items-center justify-between gap-3 bg-card px-4 text-left text-[1rem] font-medium shadow-[inset_0_0_0_1px_var(--color-line)] ${state}`}
              >
                {option}
                {picked && isAnswer && <span aria-hidden="true">✓</span>}
              </button>
            </li>
          );
        })}
      </ul>

      <p class="mt-3 min-h-6 text-[0.9375rem] font-semibold" aria-live="polite">
        {picked ? (correct ? text('quiz.correct') : text('quiz.wrong', { name: q!.entry.name })) : ''}
      </p>

      {picked && (
        <button type="button" onClick={() => (setRound(round + 1), setPicked(undefined))} class="mt-2 min-h-12 w-full bg-ink text-[0.9375rem] font-semibold text-white">
          {round + 1 === total ? text('quiz.finish') : text('quiz.next')}
        </button>
      )}
    </div>
  );
}
