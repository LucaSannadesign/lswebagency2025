import { useEffect, useMemo, useRef, useState } from 'react';
import { computeFitResult, fitQuestions, type FitAnswers } from '@/utils/process-fit/scoring';

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OPTION_KEYS = ['A', 'B', 'C', 'D', 'E'];

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
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const resultTitleRef = useRef<HTMLHeadingElement>(null);
  const firstRenderRef = useRef(true);

  const result = useMemo(() => (completed ? computeFitResult(answers) : null), [answers, completed]);
  const question = fitQuestions[step];
  const progress = completed ? 100 : Math.round((step / fitQuestions.length) * 100);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (completed) resultTitleRef.current?.focus();
    else questionTitleRef.current?.focus();
  }, [step, completed]);

  function choose(value: string) {
    const next = { ...answers, [question.key]: value };
    setAnswers(next);
    if (step >= fitQuestions.length - 1) setCompleted(true);
    else setStep((current) => current + 1);
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
    setContactName('');
    setEmail('');
    setPhone('');
    setBusinessName('');
    setPrivacyConsent(false);
    setHoneypot('');
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
      if (response.ok && data?.ok) setSubmitState('success');
      else {
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
      <div className="overflow-hidden rounded-[2rem] border border-violet-100 bg-white shadow-[0_24px_70px_-30px_rgba(76,29,149,0.35)] dark:border-violet-900/50 dark:bg-neutral-900/80">
        <div className="border-b border-neutral-100 bg-neutral-50/70 px-5 py-4 md:px-8 dark:border-neutral-800 dark:bg-neutral-950/30">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-violet-600 px-2 font-bold text-white">{step + 1}</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-100">Domanda {step + 1} di {fitQuestions.length}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span>2–3 min totali</span>
              <span aria-hidden="true">•</span>
              <span>{progress}% completato</span>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800" role="progressbar" aria-label="Avanzamento valutazione" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="px-5 py-7 md:px-8 md:py-9">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">Automation Fit Score</p>
            <h2 ref={questionTitleRef} tabIndex={-1} className="mt-3 text-2xl font-extrabold tracking-tight outline-none md:text-4xl">{question.label}</h2>
            {question.help && <p className="mt-3 max-w-2xl leading-relaxed text-neutral-600 dark:text-neutral-300">{question.help}</p>}

            <div className="mt-7 grid gap-3">
              {question.options.map((option, index) => {
                const selected = answers[question.key] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => choose(option.value)}
                    aria-pressed={selected}
                    className={`group flex min-h-[62px] items-center gap-4 rounded-2xl border px-4 py-3.5 text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 md:px-5 ${
                      selected
                        ? 'border-violet-500 bg-violet-50 shadow-sm dark:bg-violet-950/25'
                        : 'border-neutral-200 bg-white hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50/40 hover:shadow-sm dark:border-neutral-800 dark:bg-neutral-950/30 dark:hover:border-violet-800 dark:hover:bg-violet-950/15'
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition ${selected ? 'border-violet-600 bg-violet-600 text-white' : 'border-neutral-200 bg-neutral-50 text-neutral-500 group-hover:border-violet-300 group-hover:text-violet-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400'}`}>
                      {OPTION_KEYS[index] ?? index + 1}
                    </span>
                    <span className="font-semibold text-neutral-900 dark:text-white">{option.label}</span>
                    <span aria-hidden="true" className="ml-auto text-xl text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-violet-500 dark:text-neutral-700">→</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 flex flex-col gap-4 border-t border-neutral-100 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
              <button type="button" onClick={back} disabled={step === 0} className="self-start rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-35 dark:border-neutral-700 dark:hover:bg-neutral-800">
                ← Indietro
              </button>
              <span className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">Il punteggio è anonimo. I dati di contatto vengono richiesti solo dopo il risultato.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const outcomeStyle =
    result.outcome === 'GO'
      ? 'border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-emerald-100'
      : result.outcome === 'PREPARARE'
        ? 'border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/25 dark:text-amber-100'
        : 'border-rose-300 bg-rose-50 text-rose-950 dark:border-rose-900 dark:bg-rose-950/25 dark:text-rose-100';

  const outcomeLabel =
    result.outcome === 'GO'
      ? 'Buona base per procedere'
      : result.outcome === 'PREPARARE'
        ? 'Potenziale presente, ma prima serve preparazione'
        : 'Non è il processo giusto da automatizzare ora';

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-[2rem] border border-neutral-200 bg-white shadow-[0_24px_70px_-30px_rgba(76,29,149,0.35)] dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="grid gap-7 border-b border-neutral-100 p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8 dark:border-neutral-800">
          <div className="relative mx-auto flex h-36 w-36 shrink-0 items-center justify-center rounded-full p-3 md:mx-0" style={{ background: `conic-gradient(rgb(124 58 237) ${result.score * 3.6}deg, rgb(229 231 235) 0deg)` }} aria-label={`Automation Fit Score ${result.score} su 100`}>
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-center shadow-inner dark:bg-neutral-900">
              <div>
                <div className="text-5xl font-extrabold tracking-tight">{result.score}</div>
                <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">su 100</div>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 ref={resultTitleRef} tabIndex={-1} className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 outline-none dark:text-violet-300">Automation Fit Score</h2>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight md:text-4xl">{outcomeLabel}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">Il punteggio misura l’idoneità strutturale; rischio, volume e prerequisiti possono rendere l’esito più prudente.</p>
            <div className={`mt-5 inline-flex items-center gap-3 rounded-full border px-4 py-2.5 ${outcomeStyle}`}>
              <span className="text-xs font-semibold uppercase tracking-wide">Esito</span>
              <span className="font-extrabold">{result.outcome}</span>
              <span aria-hidden="true">•</span>
              <span className="text-sm">Rischio {result.risk}</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
            {result.dimensions.map((item) => (
              <div key={item.key}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold">{item.label}</span>
                  <span className="font-medium text-neutral-500 dark:text-neutral-400">{item.points}/{item.max}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" style={{ width: `${Math.round((item.points / item.max) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/20">
              <h3 className="font-bold text-emerald-950 dark:text-emerald-100">✓ Punti favorevoli</h3>
              {result.strengths.length ? <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{result.strengths.map((item) => <li key={item}>• {item}</li>)}</ul> : <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">Non emerge ancora un vantaggio abbastanza forte da giustificare un pilot.</p>}
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 dark:border-amber-900 dark:bg-amber-950/20">
              <h3 className="font-bold text-amber-950 dark:text-amber-100">! Blocchi / prerequisiti</h3>
              {result.blockers.length ? <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{result.blockers.map((item) => <li key={item}>• {item}</li>)}</ul> : <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">Nessun blocco strutturale evidente dalle risposte.</p>}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-neutral-950 p-5 text-white md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">Prossimo passo consigliato</div>
              <p className="mt-2 max-w-3xl leading-relaxed text-neutral-200">{result.nextStep}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={back} className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">← Modifica ultima risposta</button>
            <button type="button" onClick={restart} className="rounded-full px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950/25">Ricomincia</button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/70 shadow-sm dark:border-violet-900 dark:from-violet-950/30 dark:via-neutral-900 dark:to-fuchsia-950/20">
        <div className="grid gap-6 border-b border-violet-100 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8 dark:border-violet-900/60">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-violet-300">Passaggio professionale</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">{result.outcome === 'GO' ? 'Trasformiamo il punteggio in una decisione operativa.' : result.outcome === 'PREPARARE' ? 'Definiamo cosa sistemare prima di investire in un pilot.' : 'Verifichiamo se esiste un processo migliore da cui partire.'}</h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">Il test online resta gratuito. Il Process Fit Check professionale include mappatura, baseline, integrazioni, rischi e una conclusione documentata.</p>
          </div>
          <div className="rounded-2xl border border-violet-200 bg-white px-6 py-5 text-center shadow-sm dark:border-violet-800 dark:bg-neutral-950/50">
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Process Fit Check</div>
            <div className="mt-1 text-4xl font-extrabold">290 €</div>
            <div className="mt-1 text-xs text-neutral-500">un processo · esito chiaro</div>
          </div>
        </div>

        {submitState === 'success' ? (
          <div role="status" className="m-6 rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-emerald-950 md:m-8 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">Richiesta inviata. Il risultato e le risposte sono stati registrati insieme al contatto.</div>
        ) : (
          <form onSubmit={submitLead} className="grid gap-4 p-6 md:grid-cols-2 md:p-8" noValidate>
            <label className="grid gap-1.5 text-sm font-medium">Nome *<input value={contactName} onChange={(e) => setContactName(e.target.value)} className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:ring-violet-900" autoComplete="name" /></label>
            <label className="grid gap-1.5 text-sm font-medium">Email *<input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:ring-violet-900" type="email" autoComplete="email" /></label>
            <label className="grid gap-1.5 text-sm font-medium">Attività / azienda<input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:ring-violet-900" autoComplete="organization" /></label>
            <label className="grid gap-1.5 text-sm font-medium">Telefono<input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:focus:ring-violet-900" autoComplete="tel" /></label>
            <label className="sr-only" aria-hidden="true">Non compilare<input value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" /></label>
            <label className="md:col-span-2 flex items-start gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"><input type="checkbox" checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-violet-600" /><span>Ho letto la <a href="/privacy" className="font-semibold underline underline-offset-2">Privacy & Cookie Policy</a> e acconsento all’invio dei dati per essere ricontattato.</span></label>
            {formError && <p role="alert" className="md:col-span-2 text-sm font-medium text-rose-700 dark:text-rose-300">{formError}</p>}
            <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="submit" disabled={submitState === 'sending'} className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-violet-600 px-7 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60">{submitState === 'sending' ? 'Invio…' : 'Richiedi il Fit Check professionale'}</button>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Nessun acquisto automatico: ricevi prima il ricontatto.</span>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
