import { useEffect, useRef, useState } from 'react';
import questionsData from '@/utils/mini-analisi/questions.json';
import computeProfile, { type Answers, type Profile } from '@/utils/mini-analisi/computeProfile';
import buildSummary, { type Summary } from '@/utils/mini-analisi/buildSummary';
import { type Option, optionValue, optionLabel } from '@/utils/mini-analisi/options';
import {
  assistantIntents,
  INITIAL_QUESTION,
  intentLabelById,
  EXTRA_FIELD_LABELS,
  type AssistantIntent,
} from '@/utils/mini-analisi/assistantFlow';

type Question = { key: keyof Answers; text: string; options: Option[] };

const questions = questionsData as Question[];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitState = 'idle' | 'sending' | 'success' | 'error';

// Etichette leggibili per il riepilogo (chiavi note + estensioni assistente).
const FIELD_LABELS: Partial<Record<keyof Answers, string>> = {
  siteStatus: 'Sito',
  businessType: 'Attività',
  mainGoal: 'Obiettivo',
  assets: 'Materiali',
  contactMethod: 'Gestione richieste',
  urgency: 'Tempi',
  ...EXTRA_FIELD_LABELS,
};

type Props = {
  /** 'mini' = flusso lineare storico (/mini-analisi); 'assistant' = percorsi guidati. */
  variant?: 'mini' | 'assistant';
  /** Origine logica del lead, inviata all'endpoint (es. 'assistente_ai'). */
  source?: string;
  /** Contesto pagina, annotato nelle note CRM (es. 'servizio-assistente-ai'). */
  context?: string;
  /** Link WhatsApp per il passaggio umano: mostrato solo se valorizzato. */
  whatsappUrl?: string;
};

/**
 * Mini‑Analisi Guidata / Assistente commerciale — isola React.
 * In variant="mini" mantiene il questionario lineare storico.
 * In variant="assistant" propone percorsi condizionali, un riepilogo e il passaggio
 * a una persona. Il calcolo resta deterministico (computeProfile/buildSummary) e il
 * salvataggio avviene server‑side via /api/mini-analisi.
 */
export default function MiniAnalisi({ variant = 'mini', source, context, whatsappUrl }: Props) {
  const isAssistant = variant === 'assistant';

  // Stato condiviso
  const [answers, setAnswers] = useState<Answers>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [result, setResult] = useState<Summary | null>(null);

  // Flusso mini (lineare)
  const [step, setStep] = useState(0);

  // Flusso assistant (branch)
  const [intent, setIntent] = useState<AssistantIntent | null>(null);
  const [aStep, setAStep] = useState(0);
  const [textValue, setTextValue] = useState('');

  // Form finale
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  // Consenso all'analisi tecnica del sito (Site Rescue): solo variant="mini".
  const [auditConsent, setAuditConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  // Percorso di contatto progressivo dopo il risultato.
  const [contactStep, setContactStep] = useState<'invite' | 'essential' | 'details'>('invite');
  const [showSite, setShowSite] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const stepTitleRef = useRef<HTMLHeadingElement>(null);
  const isFirstStepRender = useRef(true);

  // Sposta il focus sul titolo del nuovo passaggio (salta il primo render: niente focus all'avvio).
  useEffect(() => {
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false;
      return;
    }
    stepTitleRef.current?.focus();
  }, [contactStep]);

  const total = questions.length;
  const progress = Math.round((step / total) * 100);

  function finish(finalAnswers: Answers) {
    const p = computeProfile(finalAnswers);
    setProfile(p);
    setResult(buildSummary(finalAnswers, p));
  }

  // === Handlers flusso mini (invariati) ===
  function handleSelect(option: string) {
    const key = questions[step].key;
    const next: Answers = { ...answers, [key]: option };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      finish(next);
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  // === Handlers flusso assistant ===
  function chooseIntent(i: AssistantIntent) {
    setAnswers({ ...i.preset, initialIntent: i.id });
    setIntent(i);
    setAStep(0);
    setTextValue('');
  }

  function advance(next: Answers) {
    if (!intent) return;
    if (aStep < intent.questions.length - 1) {
      const nextStep = aStep + 1;
      setAStep(nextStep);
      setTextValue((next[intent.questions[nextStep].key] as string) ?? '');
    } else {
      if (next.websiteUrl) setWebsiteUrl(next.websiteUrl);
      finish(next);
    }
  }

  function assistantSelect(option: string) {
    if (!intent) return;
    const key = intent.questions[aStep].key;
    const next: Answers = { ...answers, [key]: option };
    setAnswers(next);
    advance(next);
  }

  function assistantSubmitText(e: React.FormEvent) {
    e.preventDefault();
    if (!intent) return;
    const q = intent.questions[aStep];
    const v = textValue.trim();
    if (!q.optional && !v) return; // campo obbligatorio: resta sulla domanda
    const next: Answers = { ...answers, [q.key]: v || undefined };
    setAnswers(next);
    advance(next);
  }

  function assistantBack() {
    if (!intent) return;
    if (aStep > 0) {
      const prev = aStep - 1;
      setAStep(prev);
      setTextValue((answers[intent.questions[prev].key] as string) ?? '');
    } else {
      setIntent(null);
      setTextValue('');
    }
  }

  function restart() {
    setAnswers({});
    setProfile(null);
    setResult(null);
    setStep(0);
    setIntent(null);
    setAStep(0);
    setTextValue('');
    setContactName('');
    setEmail('');
    setPhone('');
    setWebsiteUrl('');
    setMessage('');
    setContactStep('invite');
    setShowSite(false);
    setShowPhone(false);
    setShowNote(false);
    setPrivacyConsent(false);
    setAuditConsent(false);
    setHoneypot('');
    setSubmitState('idle');
    setFormError(null);
  }

  // Validazione condivisa tra "Continua" (passaggio essenziale) e l'invio finale.
  function validateContact(): boolean {
    setFormError(null);
    if (!contactName.trim()) {
      setFormError('Inserisci il tuo nome.');
      return false;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setFormError('Inserisci un’email valida.');
      return false;
    }
    if (!privacyConsent) {
      setFormError('Per inviare devi accettare la privacy policy.');
      return false;
    }
    return true;
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (validateContact()) setContactStep('details');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateContact()) return;

    // Variant "mini": URL del sito e consenso all'analisi sono obbligatori.
    // La validazione stretta dell'URL avviene comunque lato server.
    if (!isAssistant) {
      const site = websiteUrl.trim();
      if (!site || !/\.[a-z]{2,}/i.test(site)) {
        setFormError('Inserisci l’indirizzo del sito da analizzare (es. esempio.it).');
        return;
      }
      if (!auditConsent) {
        setFormError('Per procedere devi confermare di essere titolare o autorizzato ad analizzare il sito indicato.');
        return;
      }
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
          // Campo "Nome attività" rimosso dall'interfaccia: l'API accetta stringa vuota
          // (business_name ricade sul valore di default lato server). Nessuna modifica all'API.
          businessName: '',
          message: message.trim(),
          privacyConsent,
          honeypot,
          answers,
          profile,
          summary: result,
          // Sito web: obbligatorio in variant "mini", facoltativo in "assistant".
          websiteUrl: websiteUrl.trim() || undefined,
          // Consenso all'analisi tecnica: inviato SOLO dal flusso mini (mai dall'assistant),
          // così l'accodamento audit non parte silenziosamente dagli altri flussi.
          auditConsent: isAssistant ? undefined : auditConsent,
          source: isAssistant ? source ?? 'assistente_ai' : undefined,
          initialIntent: isAssistant ? answers.initialIntent : undefined,
          assistantContext: isAssistant ? context : undefined,
          flowPath: isAssistant && answers.initialIntent ? intentLabelById[answers.initialIntent] : undefined,
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

  // Riepilogo leggibile delle risposte raccolte nel percorso (solo assistant).
  const recap =
    isAssistant && intent
      ? intent.questions
          .map((q) => ({ label: FIELD_LABELS[q.key] ?? q.key, value: answers[q.key] as string | undefined }))
          .filter((r) => r.value)
      : [];

  // === Risultato + form (condiviso) ===
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
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Livello del progetto</div>
            <div className="mt-1 text-lg font-bold text-neutral-900 dark:text-white">{result.level}</div>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{result.levelNote}</p>
          </div>
        </div>

        {/* Fascia orientativa + tempi: solo assistente guidato */}
        {isAssistant && (
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl p-4 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/60 dark:bg-neutral-900/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Fascia orientativa</div>
              <div className="mt-1 text-base font-semibold text-neutral-900 dark:text-white">{result.priceBand}</div>
              {result.priceDisclaimer && (
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{result.priceDisclaimer}</p>
              )}
            </div>
            <div className="rounded-xl p-4 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/60 dark:bg-neutral-900/40">
              <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Tempi indicativi</div>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">{result.timeline}</p>
            </div>
          </div>
        )}

        {/* Riepilogo delle risposte (assistente) */}
        {isAssistant && recap.length > 0 && (
          <div className="mt-4 rounded-xl p-4 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/60 dark:bg-neutral-900/40">
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Cosa ci hai detto</div>
            <dl className="mt-2 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
              {recap.map((r) => (
                <div key={r.label} className="flex justify-between gap-3">
                  <dt className="text-neutral-500 dark:text-neutral-400">{r.label}</dt>
                  <dd className="font-medium text-neutral-800 dark:text-neutral-100 text-right">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {submitState === 'success' ? (
          <div role="status" aria-live="polite" className="mt-6 rounded-xl p-5 ring-1 ring-emerald-200 dark:ring-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-900/20">
            <p className="font-semibold text-emerald-800 dark:text-emerald-200">
              Richiesta inviata correttamente. Ti ricontatterò entro 24–48 ore.
            </p>
            {isAssistant && (
              <p className="mt-2 text-sm text-emerald-800/80 dark:text-emerald-200/80">
                Se preferisci, puoi anche{' '}
                <a href="/contatti?servizio=assistente-ai" className="underline font-semibold">parlare con una persona</a>.
              </p>
            )}
            <button
              type="button"
              onClick={restart}
              className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Ricomincia
            </button>
          </div>
        ) : (
          <div className="mt-6 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            {/* STATO 1 — INVITO */}
            {contactStep === 'invite' && (
              <div>
                <h4
                  ref={stepTitleRef}
                  tabIndex={-1}
                  className="text-xl md:text-2xl font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
                >
                  Vuoi approfondire questa valutazione?
                </h4>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                  Posso esaminare il tuo caso e indicarti i prossimi passi più utili.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => { setFormError(null); setContactStep('essential'); }}
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 bg-violet-600 text-white hover:bg-violet-700 transition text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    Sì, vorrei un approfondimento
                  </button>
                  <a
                    href={isAssistant ? '/contatti?servizio=assistente-ai' : '/contatti'}
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    Parla con una persona
                  </a>
                </div>
                {isAssistant && whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex text-sm font-semibold text-emerald-700 dark:text-emerald-300 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
                  >
                    oppure scrivici su WhatsApp
                  </a>
                )}
                <div>
                  <button
                    type="button"
                    onClick={restart}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-violet-700 dark:hover:text-violet-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
                  >
                    Ricomincia la valutazione
                  </button>
                </div>
              </div>
            )}

            {/* STATO 2 — CONTATTO ESSENZIALE */}
            {contactStep === 'essential' && (
              <form onSubmit={handleContinue}>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300" aria-current="step">Passaggio 1 di 2</p>
                <h4
                  ref={stepTitleRef}
                  tabIndex={-1}
                  className="mt-1 text-xl md:text-2xl font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
                >
                  Come posso ricontattarti?
                </h4>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                  Ho già le informazioni principali. Servono soltanto nome ed email.
                </p>

                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ma-name" className="text-sm font-medium">Nome*</label>
                    <input
                      id="ma-name"
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
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
                      className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>

                <label className="mt-4 flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 p-0 rounded accent-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <span>
                    Accetto la <a href="/privacy" className="underline">Privacy & Cookie Policy</a>.*
                  </span>
                </label>

                {formError && (
                  <p role="alert" aria-live="assertive" className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{formError}</p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => { setFormError(null); setContactStep('invite'); }}
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    ← Indietro
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 bg-violet-600 text-white hover:bg-violet-700 transition text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    Continua
                  </button>
                </div>
              </form>
            )}

            {/* STATO 3 — DETTAGLI FACOLTATIVI */}
            {contactStep === 'details' && (
              <form onSubmit={handleSubmit}>
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300" aria-current="step">Passaggio 2 di 2</p>
                <h4
                  ref={stepTitleRef}
                  tabIndex={-1}
                  className="mt-1 text-xl md:text-2xl font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
                >
                  Vuoi aggiungere qualche dettaglio?
                </h4>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                  {isAssistant
                    ? 'Puoi aggiungere il sito, il telefono o una nota, oppure inviare subito.'
                    : 'Indica il sito da analizzare e conferma l’autorizzazione. Telefono e nota sono facoltativi.'}
                </p>

                {/* Variant "mini": sito da analizzare e consenso all'analisi (obbligatori) */}
                {!isAssistant && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="ma-website" className="text-sm font-medium">
                        Sito web da analizzare*
                      </label>
                      <input
                        id="ma-website"
                        type="text"
                        inputMode="url"
                        required
                        placeholder="esempio.it"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                      />
                    </div>
                    <label className="flex items-start gap-3 text-sm text-neutral-600 dark:text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={auditConsent}
                        onChange={(e) => setAuditConsent(e.target.checked)}
                        className="mt-0.5 h-5 w-5 shrink-0 p-0 rounded accent-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <span>
                        Confermo di essere titolare del sito indicato o autorizzato a richiederne l’analisi tecnica automatizzata.*
                      </span>
                    </label>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      L’analisi non modifica il sito e non comporta l’invio automatico di un report.
                    </p>
                  </div>
                )}

                {/* Chip: rivelano il relativo campo solo dopo la scelta */}
                {((isAssistant && !showSite) || !showPhone || !showNote) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {isAssistant && !showSite && (
                      <button type="button" onClick={() => setShowSite(true)} className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                        <span aria-hidden="true">+</span> Aggiungi sito
                      </button>
                    )}
                    {!showPhone && (
                      <button type="button" onClick={() => setShowPhone(true)} className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                        <span aria-hidden="true">+</span> Aggiungi telefono
                      </button>
                    )}
                    {!showNote && (
                      <button type="button" onClick={() => setShowNote(true)} className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
                        <span aria-hidden="true">+</span> Aggiungi una nota
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-4 space-y-4">
                  {isAssistant && showSite && (
                    <div>
                      <label htmlFor="ma-website-assistant" className="text-sm font-medium">Sito web</label>
                      <input
                        id="ma-website-assistant"
                        type="text"
                        inputMode="url"
                        placeholder="esempio.it"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                      />
                    </div>
                  )}
                  {showPhone && (
                    <div>
                      <label htmlFor="ma-phone" className="text-sm font-medium">Telefono</label>
                      <input
                        id="ma-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                      />
                    </div>
                  )}
                  {showNote && (
                    <div>
                      <label htmlFor="ma-message" className="text-sm font-medium">Messaggio</label>
                      <textarea
                        id="ma-message"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                      />
                    </div>
                  )}
                </div>

                {/* Honeypot anti-bot: nascosto agli utenti reali */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="ma-website-hp">Lascia vuoto questo campo</label>
                  <input
                    id="ma-website-hp"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {formError && (
                  <p role="alert" aria-live="assertive" className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{formError}</p>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => { setFormError(null); setContactStep('essential'); }}
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    ← Indietro
                  </button>
                  <button
                    type="submit"
                    disabled={submitState === 'sending'}
                    className="inline-flex items-center justify-center rounded-full px-5 py-3 bg-violet-600 text-white hover:bg-violet-700 transition text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                  >
                    {submitState === 'sending' ? 'Invio in corso…' : 'Invia la richiesta'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }

  // === Schermata iniziale assistant: scelta intento ===
  if (isAssistant && !intent) {
    return (
      <div className="rounded-2xl p-6 md:p-8 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/70 dark:bg-neutral-900/50 shadow-sm">
        <h3 className="text-xl md:text-2xl font-bold">{INITIAL_QUESTION}</h3>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
          Scegli il punto di partenza: ti faccio qualche domanda e ti propongo la soluzione più adatta.
        </p>
        <div className="mt-5 grid gap-3" role="list">
          {assistantIntents.map((i) => (
            <button
              key={i.id}
              type="button"
              role="listitem"
              onClick={() => chooseIntent(i)}
              className="w-full text-left rounded-xl px-4 py-3 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/60 dark:bg-neutral-900/40 font-medium transition hover:ring-violet-400 hover:bg-violet-50/60 dark:hover:bg-violet-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              {i.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // === Schermata domanda assistant ===
  if (isAssistant && intent) {
    const current = intent.questions[aStep];
    const aTotal = intent.questions.length;
    const aProgress = Math.round((aStep / aTotal) * 100);
    const selected = answers[current.key] as string | undefined;

    return (
      <div className="rounded-2xl p-6 md:p-8 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/70 dark:bg-neutral-900/50 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <span>{intent.label}</span>
          <span>Domanda {aStep + 1} di {aTotal}</span>
        </div>
        <div className="mt-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-300"
            style={{ width: `${aProgress}%` }}
          />
        </div>

        <h3 className="mt-5 text-xl md:text-2xl font-bold">{current.text}</h3>

        {current.type === 'text' ? (
          <form onSubmit={assistantSubmitText} className="mt-4">
            <label htmlFor="ma-assistant-text" className="sr-only">{current.text}</label>
            <input
              id="ma-assistant-text"
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={current.placeholder}
              className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 bg-violet-600 text-white hover:bg-violet-700 transition text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                Continua
              </button>
              {current.optional && (
                <button
                  type="button"
                  onClick={() => advance({ ...answers, [current.key]: undefined })}
                  className="inline-flex items-center justify-center rounded-full px-5 py-2.5 ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  Salta
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="mt-4 grid gap-3">
            {(current.options ?? []).map((option) => {
              const isSelected = selected === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => assistantSelect(option)}
                  className={
                    'w-full text-left rounded-xl px-4 py-3 ring-1 transition font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ' +
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
        )}

        <button
          type="button"
          onClick={assistantBack}
          className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-neutral-500 dark:text-neutral-400 hover:text-violet-700 dark:hover:text-violet-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
        >
          ← Indietro
        </button>
      </div>
    );
  }

  // === Questionario mini (lineare, invariato) ===
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
          const value = optionValue(option);
          const label = optionLabel(option);
          const isSelected = selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleSelect(value)}
              className={
                'w-full text-left rounded-xl px-4 py-3 ring-1 transition font-medium ' +
                (isSelected
                  ? 'ring-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-800 dark:text-violet-100'
                  : 'ring-neutral-200 dark:ring-neutral-800 bg-white/60 dark:bg-neutral-900/40 hover:ring-violet-400 hover:bg-violet-50/60 dark:hover:bg-violet-900/20')
              }
            >
              {label}
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
