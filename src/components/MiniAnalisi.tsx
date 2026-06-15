import { useState } from 'react';
import questionsData from '@/utils/mini-analisi/questions.json';
import computeProfile, { type Answers, type Profile } from '@/utils/mini-analisi/computeProfile';
import buildSummary, { type Summary } from '@/utils/mini-analisi/buildSummary';

type Question = { key: keyof Answers; text: string; options: string[] };

const questions = questionsData as Question[];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

/**
 * Mini‑Analisi Guidata — isola React.
 * Presenta una domanda alla volta, calcola un riepilogo deterministico e,
 * nella schermata finale, raccoglie i contatti inviandoli a /api/mini-analisi,
 * che salva il lead nel CRM. Il calcolo è client‑side; il salvataggio è server‑side.
 */
export default function MiniAnalisi() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [result, setResult] = useState<Summary | null>(null);

  // Form finale
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const total = questions.length;
  const progress = Math.round((step / total) * 100);

  function handleSelect(option: string) {
    const key = questions[step].key;
    const next: Answers = { ...answers, [key]: option };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      const p = computeProfile(next);
      setProfile(p);
      setResult(buildSummary(next, p));
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  function restart() {
    setAnswers({});
    setProfile(null);
    setResult(null);
    setStep(0);
    setContactName('');
    setEmail('');
    setPhone('');
    setBusinessName('');
    setMessage('');
    setPrivacyConsent(false);
    setHoneypot('');
    setSubmitState('idle');
    setFormError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!contactName.trim()) {
      setFormError('Inserisci il tuo nome.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setFormError('Inserisci un’email valida.');
      return;
    }
    if (!privacyConsent) {
      setFormError('Per inviare devi accettare la privacy policy.');
      return;
    }

    setSubmitState('sending');
    try {
      const res = await fetch('/api/mini-analisi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: contactName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          businessName: businessName.trim(),
          message: message.trim(),
          privacyConsent,
          honeypot,
          answers,
          profile,
          summary: result,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        setSubmitState('success');
      } else {
        setSubmitState('error');
        setFormError('Invio non riuscito. Riprova tra poco.');
      }
    } catch {
      setSubmitState('error');
      setFormError('Si è verificato un errore di rete. Riprova tra poco.');
    }
  }

  // === Risultato + form ===
  if (result) {
    return (
      <div className="rounded-2xl p-6 md:p-8 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/70 dark:bg-neutral-900/50 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200 ring-1 ring-violet-200/60 dark:ring-violet-700/50">
          Valutazione completata
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

        {submitState === 'success' ? (
          <div className="mt-6 rounded-xl p-5 ring-1 ring-emerald-200 dark:ring-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-900/20">
            <p className="font-semibold text-emerald-800 dark:text-emerald-200">
              Valutazione inviata correttamente. Ti ricontatterò entro 24–48 ore.
            </p>
            <button
              type="button"
              onClick={restart}
              className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm font-semibold"
            >
              {'Rifai la valutazione'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">{result.cta}</p>

            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ma-name" className="text-sm font-medium">Nome*</label>
                <input
                  id="ma-name"
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="ma-email" className="text-sm font-medium">Email*</label>
                <input
                  id="ma-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="ma-phone" className="text-sm font-medium">Telefono</label>
                <input
                  id="ma-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
                />
              </div>
              <div>
                <label htmlFor="ma-business" className="text-sm font-medium">Nome attività</label>
                <input
                  id="ma-business"
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="ma-message" className="text-sm font-medium">Messaggio</label>
              <textarea
                id="ma-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2"
              />
            </div>

            {/* Honeypot anti-bot: nascosto agli utenti reali */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
              <label htmlFor="ma-website">Lascia vuoto questo campo</label>
              <input
                id="ma-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            <label className="mt-4 flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
              <input
                type="checkbox"
                required
                checked={privacyConsent}
                onChange={(e) => setPrivacyConsent(e.target.checked)}
                className="mt-1"
              />
              <span>
                Accetto la <a href="/privacy" className="underline">Privacy & Cookie Policy</a>.*
              </span>
            </label>

            {formError && (
              <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{formError}</p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitState === 'sending'}
                className="inline-flex items-center justify-center rounded-full px-5 py-3 bg-violet-600 text-white hover:bg-violet-700 transition text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitState === 'sending' ? 'Invio in corso…' : 'Invia la mia valutazione'}
              </button>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center justify-center rounded-full px-5 py-3 ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm font-semibold"
              >
                {'Rifai la valutazione'}
              </button>
            </div>
          </form>
        )}
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
