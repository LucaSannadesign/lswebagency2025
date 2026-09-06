import { useMemo, useState } from 'react';
import { computeFitResult, fitQuestions, type FitAnswers } from '@/utils/process-fit/scoring';

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProcessFitCheck() {
  const [answers, setAnswers] = useState<FitAnswers>({});
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const result = useMemo(() => (completed ? computeFitResult(answers) : null), [answers, completed]);
  const question = fitQuestions[step];
  const progress = completed ? 100 : Math.round((step / fitQuestions.length) * 100);

  function choose(value: string) {
    const next = { ...answers, [question.key]: value };
    setAnswers(next);
    if (step >= fitQuestions.length - 1) {
      setCompleted(true);
    } else {
      setStep((current) => current + 1);
    }
  }

  function back() {
    if (completed) {
      setCompleted(false);
      setStep(fitQuestions.length - 1);
      return;
    }
    if (step > 0) setStep((current) => current - 1);
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setCompleted(false);
    setSubmitState('idle');
    setFormError(null);
  }

  async function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!result) return;
    if (!contactName.trim()) {
      setFormError('Inserisci il tuo nome.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setFormError('Inserisci un’email valida.');
      return;
    }
    if (!privacyConsent) {
      setFormError('Per inviare la richiesta devi accettare la privacy policy.');
      return;
    }

    setSubmitState('sending');
    try {
      const response = await fetch('/api/process-fit-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          contactName: contactName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          businessName: businessName.trim(),
          privacyConsent,
          honeypot,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.ok) {
        setSubmitState('success');
      } else {
        setSubmitState('error');
        setFormError('Invio non riuscito. Riprova tra poco.');
      }
    } catch {
      setSubmitState('error');
      setFormError('Errore di rete. Riprova tra poco.');
    }
  }

  if (!completed || !result) {
    return (
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8 dark:border-neutral-800 dark:bg-neutral-900/60">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-semibold text-violet-700 dark:text-violet-300">Domanda {step + 1} di {fitQuestions.length}</span>
          <span className="text-neutral-500 dark:text-neutral-400">{progress}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div className="h-full rounded-full bg-violet-600 transition-all" style={{ width: `${progress}%` }} />
        </div>

        <h2 className="mt-8 text-2xl font-bold md:text-3xl">{question.label}</h2>
        {question.help && <p className="mt-3 text-neutral-600 dark:text-neutral-300">{question.help}</p>}

        <div className="mt-6 grid gap-3">
          {question.options.map((option) => {
            const selected = answers[question.key] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => choose(option.value)}
                className={`rounded-2xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                  selected
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/25'
                    : 'border-neutral-200 bg-white hover:border-violet-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/30 dark:hover:border-violet-800'
                }`}
              >
                <span className="font-semibold text-neutral-900 dark:text-white">{option.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700"
          >
            Indietro
          </button>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Nessun dato personale richiesto per il punteggio.</span>
        </div>
      </div>
    );
  }

  const outcomeStyle =
    result.outcome === 'GO'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-emerald-100'
      : result.outcome === 'PREPARARE'
        ? 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-100'
        : 'border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-900 dark:bg-rose-950/25 dark:text-rose-100';

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8 dark:border-neutral-800 dark:bg-neutral-900/60">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300">Automation Fit Score</p>
            <div className="mt-2 text-6xl font-extrabold tracking-tight">{result.score}<span className="text-2xl font-semibold text-neutral-400">/100</span></div>
          </div>
          <div className={`rounded-2xl border px-5 py-4 ${outcomeStyle}`}>
            <div className="text-xs font-semibold uppercase tracking-wide">Esito</div>
            <div className="mt-1 text-2xl font-extrabold">{result.outcome}</div>
            <div className="mt-1 text-sm">Rischio: {result.risk}</div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {result.dimensions.map((item) => (
            <div key={item.key} className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold">{item.label}</span>
                <span className="text-neutral-500">{item.points}/{item.max}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div className="h-full rounded-full bg-violet-600" style={{ width: `${Math.round((item.points / item.max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
            <h3 className="font-bold">Punti favorevoli</h3>
            {result.strengths.length ? (
              <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                {result.strengths.map((item) => <li key={item}>✓ {item}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">Non emerge ancora un vantaggio abbastanza forte da giustificare un pilot.</p>
            )}
          </div>
          <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800">
            <h3 className="font-bold">Blocchi / prerequisiti</h3>
            {result.blockers.length ? (
              <ul className="mt-3 space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
                {result.blockers.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">Nessun blocco strutturale evidente dalle risposte.</p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-neutral-950 p-5 text-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-violet-300">Prossimo passo consigliato</div>
          <p className="mt-2 leading-relaxed text-neutral-200">{result.nextStep}</p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" onClick={back} className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold dark:border-neutral-700">Modifica ultima risposta</button>
          <button type="button" onClick={restart} className="rounded-full px-5 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/25">Ricomincia</button>
        </div>
      </section>

      <section className="rounded-3xl border border-violet-200 bg-violet-50/50 p-6 shadow-sm md:p-8 dark:border-violet-900 dark:bg-violet-950/20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300">Valutazione professionale</p>
          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            {result.outcome === 'GO' ? 'Il processo merita un Fit Check professionale.' : result.outcome === 'PREPARARE' ? 'Possiamo capire cosa sistemare prima del pilot.' : 'Possiamo verificare se esiste un caso d’uso migliore.'}
          </h2>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300">Il punteggio online è orientativo. La verifica a pagamento da 290 € include mappatura del processo, baseline, integrazioni, rischi e conclusione documentata.</p>
        </div>

        {submitState === 'success' ? (
          <div className="mt-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
            Richiesta inviata. Il risultato e le risposte sono stati registrati insieme al contatto.
          </div>
        ) : (
          <form onSubmit={submitLead} className="mt-7 grid gap-4 md:grid-cols-2" noValidate>
            <label className="grid gap-1 text-sm font-medium">
              Nome *
              <input value={contactName} onChange={(e) => setContactName(e.target.value)} className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" autoComplete="name" />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Email *
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" type="email" autoComplete="email" />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Attività / azienda
              <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" autoComplete="organization" />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Telefono
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" autoComplete="tel" />
            </label>
            <label className="sr-only" aria-hidden="true">
              Non compilare
              <input value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" />
            </label>
            <label className="md:col-span-2 flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              <input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} className="mt-1" />
              <span>Ho letto la <a href="/privacy" className="font-semibold underline underline-offset-2">Privacy & Cookie Policy</a> e acconsento all’invio dei dati per essere ricontattato.</span>
            </label>
            {formError && <p className="md:col-span-2 text-sm font-medium text-rose-700 dark:text-rose-300">{formError}</p>}
            <div className="md:col-span-2">
              <button type="submit" disabled={submitState === 'sending'} className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-60">
                {submitState === 'sending' ? 'Invio…' : 'Richiedi il Fit Check professionale'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
