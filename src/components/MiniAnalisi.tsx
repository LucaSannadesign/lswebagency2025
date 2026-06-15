import { useState } from 'react';
import questionsData from '@/utils/mini-analisi/questions.json';
import computeProfile, { type Answers } from '@/utils/mini-analisi/computeProfile';
import buildSummary, { type Summary } from '@/utils/mini-analisi/buildSummary';

type Question = { key: keyof Answers; text: string; options: string[] };

const questions = questionsData as Question[];

/**
 * Mini‑Analisi Guidata — isola React.
 * Presenta una domanda alla volta, raccoglie le risposte e, al termine,
 * calcola e mostra un riepilogo deterministico (priorità, servizio, fascia).
 * Tutto il calcolo avviene lato client: nessuna chiamata di rete, nessun costo.
 */
export default function MiniAnalisi() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<Summary | null>(null);

  const total = questions.length;
  const progress = Math.round((step / total) * 100);

  function handleSelect(option: string) {
    const key = questions[step].key;
    const next: Answers = { ...answers, [key]: option };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      const profile = computeProfile(next);
      setResult(buildSummary(next, profile));
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  function restart() {
    setAnswers({});
    setResult(null);
    setStep(0);
  }

  // === Risultato ===
  if (result) {
    return (
      <div className="rounded-2xl p-6 md:p-8 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/70 dark:bg-neutral-900/50 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200 ring-1 ring-violet-200/60 dark:ring-violet-700/50">
          Analisi completata
        </span>
        <h3 className="mt-4 text-2xl md:text-3xl font-bold">{result.headline}</h3>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">{result.intro}</p>

        {result.topPriorities.length > 0 && (
          <ul className="mt-5 space-y-3">
            {result.topPriorities.map((p) => (
              <li key={p.key} className="rounded-xl p-4 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/60 dark:bg-neutral-900/40">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-100">{p.label}</span>
                  <span className="shrink-0 text-xs font-semibold text-violet-700 dark:text-violet-300">Priorità {p.score}</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500"
                    style={{ width: `${Math.min(100, p.score * 20)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl p-4 ring-1 ring-violet-200 dark:ring-violet-800/60 bg-violet-50/70 dark:bg-violet-900/20">
            <div className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">Servizio consigliato</div>
            <div className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">{result.service}</div>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">Perché {result.reason}.</p>
          </div>
          <div className="rounded-xl p-4 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/60 dark:bg-neutral-900/40">
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Fascia orientativa</div>
            <div className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">{result.level}</div>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{result.levelNote}</p>
          </div>
        </div>

        <p className="mt-5 text-sm text-neutral-600 dark:text-neutral-300">{result.cta}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="/contatti"
            className="inline-flex items-center justify-center rounded-full px-5 py-3 bg-violet-600 text-white hover:bg-violet-700 transition text-sm font-semibold"
          >
            Richiedi la proposta personalizzata
          </a>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center justify-center rounded-full px-5 py-3 ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm font-semibold"
          >
            {'Rifai l’analisi'}
          </button>
        </div>
      </div>
    );
  }

  // === Questionario ===
  const current = questions[step];
  const selected = answers[current.key];

  return (
    <div className="rounded-2xl p-6 md:p-8 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/70 dark:bg-neutral-900/50 shadow-sm">
      <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400">
        <span>Domanda {step + 1} di {total}</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h3 className="mt-5 text-xl md:text-2xl font-bold">{current.text}</h3>

      <div className="mt-4 grid gap-3">
        {current.options.map((option) => {
          const isSelected = selected === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={
                'w-full text-left rounded-xl px-4 py-3 ring-1 transition font-medium ' +
                (isSelected
                  ? 'ring-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-800 dark:text-violet-100'
                  : 'ring-neutral-200 dark:ring-neutral-800 bg-white/60 dark:bg-neutral-900/40 hover:ring-violet-400 hover:bg-violet-50/60 dark:hover:bg-violet-900/20')
              }
            >
              {option}
            </button>
          );
        })}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={goBack}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-violet-700 dark:hover:text-violet-300 transition"
        >
          ← Indietro
        </button>
      )}
    </div>
  );
}
