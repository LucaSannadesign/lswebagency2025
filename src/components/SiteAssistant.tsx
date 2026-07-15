import { useEffect, useRef, useState } from 'react';
import {
  ASSISTANT_INTENTS,
  START_NODE_ID,
  FALLBACK_NODE_ID,
  LEAD_NODE_ID,
  HUMAN_NODE_ID,
  getAssistantNode,
  findFaqAnswer,
  buildAssistantSummary,
  type AssistantIntentId,
  type AssistantOption,
} from '@/utils/site-assistant/assistantFlow';

/**
 * SiteAssistant — widget chat flottante, deterministico, dell'assistente di sito.
 *
 * Riusa interamente la configurazione di src/utils/site-assistant/assistantFlow.ts
 * (nodi, FAQ, funzioni pure): nessuna config duplicata qui, nessuna AI.
 * Chiama il server (/api/site-assistant) SOLO quando l'utente invia il contatto.
 *
 * Mappature (assistantFlow.ts non espone boolean dedicati):
 *  - "collectContact" ≡ nodo con isContactCta === true (nodo `lead`);
 *  - "handoff"        ≡ nodo con id === HUMAN_NODE_ID (nodo `human`).
 *
 * NB: questo componente non è ancora montato in nessuna pagina/layout.
 */

type SiteAssistantProps = {
  /** Numero WhatsApp (facoltativo). Se assente, il passaggio umano usa solo /contatti. */
  whatsappNumber?: string;
  initiallyOpen?: boolean;
};

type ChatMessage = { id: number; role: 'assistant' | 'user' | 'system'; text: string };
type SubmitState = 'idle' | 'sending' | 'success' | 'error';
type PendingActions = 'faq' | 'fallback' | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_VISIBLE_OPTIONS = 4;

// Lookup derivati dalla config importata (non è duplicazione: solo indici).
const NODE_TO_INTENT: Record<string, AssistantIntentId> = Object.fromEntries(
  ASSISTANT_INTENTS.map((i) => [i.entryNodeId, i.id]),
);
const INTENT_LABEL: Partial<Record<AssistantIntentId, string>> = Object.fromEntries(
  ASSISTANT_INTENTS.map((i) => [i.id, i.label]),
);

const startMessage = getAssistantNode(START_NODE_ID)?.message ?? '';

export default function SiteAssistant({ whatsappNumber, initiallyOpen = false }: SiteAssistantProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  // Conversazione (solo stato React: niente localStorage/sessionStorage/cookie).
  const msgIdRef = useRef(1);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, role: 'assistant', text: startMessage },
  ]);
  const [currentNodeId, setCurrentNodeId] = useState<string>(START_NODE_ID);

  // Contesto accumulato per buildAssistantSummary + payload.
  const [intentId, setIntentId] = useState<AssistantIntentId | undefined>(undefined);
  const [selections, setSelections] = useState<string[]>([]);
  const [faqAsked, setFaqAsked] = useState<string[]>([]);
  const [serviceInterest, setServiceInterest] = useState<string | undefined>(undefined);

  // Interazione
  const [pendingActions, setPendingActions] = useState<PendingActions>(null);
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [freeInput, setFreeInput] = useState('');

  // Modulo contatto
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [showOptionalContact, setShowOptionalContact] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const fabRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const firstOpenRender = useRef(true);

  const currentNode = getAssistantNode(currentNodeId);
  const isContactNode = currentNode?.isContactCta === true;
  const isHumanNode = currentNodeId === HUMAN_NODE_ID;

  // Focus: sul titolo all'apertura, ritorno al FAB alla chiusura (salta il primo render).
  useEffect(() => {
    if (firstOpenRender.current) {
      firstOpenRender.current = false;
      if (isOpen) titleRef.current?.focus();
      return;
    }
    if (isOpen) titleRef.current?.focus();
    else fabRef.current?.focus();
  }, [isOpen]);

  // Auto-scroll dei messaggi (istantaneo, nessuna animazione invasiva).
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, pendingActions, submitState]);

  function pushMessage(role: ChatMessage['role'], text: string) {
    const id = msgIdRef.current++;
    setMessages((prev) => [...prev, { id, role, text }]);
  }

  function navigateTo(nodeId: string) {
    const node = getAssistantNode(nodeId);
    if (!node) return;
    setCurrentNodeId(nodeId);
    pushMessage('assistant', node.message);
    if (NODE_TO_INTENT[nodeId]) setIntentId(NODE_TO_INTENT[nodeId]);
    if (node.serviceInterest) setServiceInterest(node.serviceInterest);
    setPendingActions(null);
    setShowAllOptions(false);
    setFormError(null);
  }

  function chooseOption(opt: AssistantOption) {
    pushMessage('user', opt.label);
    setSelections((prev) => [...prev, opt.label]);
    navigateTo(opt.nextNodeId);
  }

  function handleFreeSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = freeInput.trim();
    if (!q) return;
    pushMessage('user', q);
    setFreeInput('');

    const faq = findFaqAnswer(q);
    if (faq) {
      pushMessage('assistant', faq.answer);
      setFaqAsked((prev) => (prev.includes(faq.question) ? prev : [...prev, faq.question]));
      setPendingActions('faq');
    } else {
      const fb = getAssistantNode(FALLBACK_NODE_ID);
      if (fb) pushMessage('assistant', fb.message);
      // Conserva la domanda libera nel contesto (finirà nel riepilogo / note CRM).
      setSelections((prev) => [...prev, `Domanda libera: "${q}"`]);
      setPendingActions('fallback');
    }
  }

  function restart() {
    msgIdRef.current = 1;
    setMessages([{ id: 0, role: 'assistant', text: startMessage }]);
    setCurrentNodeId(START_NODE_ID);
    setIntentId(undefined);
    setSelections([]);
    setFaqAsked([]);
    setServiceInterest(undefined);
    setPendingActions(null);
    setShowAllOptions(false);
    setFreeInput('');
    setContactName('');
    setEmail('');
    setPhone('');
    setWebsiteUrl('');
    setMessage('');
    setPrivacyConsent(false);
    setHoneypot('');
    setShowOptionalContact(false);
    setSubmitState('idle');
    setFormError(null);
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitState === 'sending') return; // impedisce doppio invio
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
      // pageUrl letto dal browser solo al momento dell'invio.
      const pageUrl = typeof window !== 'undefined' ? window.location.pathname : '';
      const conversationSummary = buildAssistantSummary({ intentId, selections, faqAsked });

      const res = await fetch('/api/site-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactName: contactName.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          websiteUrl: websiteUrl.trim() || undefined,
          message: message.trim() || undefined,
          intent: intentId ? INTENT_LABEL[intentId] ?? intentId : undefined,
          serviceInterest,
          conversationSummary,
          pageUrl,
          privacyConsent,
          company: honeypot, // honeypot: normalmente vuoto
        }),
      });
      const data: { success?: boolean } = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
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

  function onPanelKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') setIsOpen(false);
  }

  const panelMotion =
    'transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none';
  const panelOpenClass = 'opacity-100 translate-y-0 scale-100 pointer-events-auto';
  const panelClosedClass = 'opacity-0 translate-y-3 scale-[0.97] pointer-events-none';

  const visibleOptions =
    currentNode && !showAllOptions ? currentNode.options.slice(0, MAX_VISIBLE_OPTIONS) : currentNode?.options ?? [];
  const hasMoreOptions = Boolean(currentNode && currentNode.options.length > MAX_VISIBLE_OPTIONS && !showAllOptions);
  const waHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Ciao, vorrei parlare con Luca di LS Web Agency.')}`
    : null;

  const showPinnedInput = submitState !== 'success' && !isContactNode;

  const optButtonClass =
    'w-full text-left rounded-xl px-4 py-2.5 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/70 dark:bg-neutral-900/50 text-sm font-medium transition hover:ring-violet-400 hover:bg-violet-50/60 dark:hover:bg-violet-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 motion-reduce:transition-none';
  const inputClass =
    'mt-1 w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500';
  const primaryBtn =
    'inline-flex items-center justify-center rounded-full px-4 py-2.5 bg-violet-600 text-white text-sm font-semibold transition hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 motion-reduce:transition-none';
  const ghostBtn =
    'inline-flex items-center justify-center rounded-full px-4 py-2.5 ring-1 ring-neutral-300 dark:ring-neutral-700 text-sm font-semibold transition hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 motion-reduce:transition-none';

  return (
    <div className="fixed bottom-4 right-4 z-[70] max-sm:left-4 md:bottom-6 md:right-6">
      <button
        ref={fabRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Apri assistente virtuale"
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-3 text-white shadow-lg ring-1 ring-violet-700/30 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none ${
          isOpen ? 'pointer-events-none scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="text-sm font-semibold">Posso aiutarti?</span>
      </button>

      <div
        role="dialog"
        aria-label="Assistente LS Web Agency"
        aria-hidden={!isOpen}
        // Il pannello resta montato per conservare la conversazione: `inert` toglie i
        // discendenti dall'ordine di tabulazione e dall'albero di accessibilità finché è chiuso.
        inert={!isOpen}
        onKeyDown={onPanelKeyDown}
        className={`absolute bottom-0 right-0 flex flex-col w-[min(420px,calc(100vw-2rem))] h-[min(72vh,640px)] max-sm:left-0 max-sm:right-0 max-sm:w-auto max-sm:h-[min(calc(100dvh-5.5rem),640px)] rounded-2xl ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden origin-bottom-right max-sm:origin-bottom ${panelMotion} ${
          isOpen ? panelOpenClass : panelClosedClass
        }`}
      >
        {/* Header */}
        <div className="shrink-0 flex items-start gap-2.5 px-3 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <span aria-hidden="true" className="mt-0.5 shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h2 ref={titleRef} tabIndex={-1} className="text-sm font-bold leading-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded">
              Assistente LS Web Agency
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug">Risposte rapide su siti, SEO e automazioni</p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-snug">Assistente virtuale, non una persona reale</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button type="button" onClick={restart} className="rounded-lg px-2 py-1 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
              Ricomincia
            </button>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Chiudi assistente" className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Corpo scrollabile: messaggi + opzioni/form */}
        <div
          ref={messagesRef}
          className="flex flex-1 min-h-0 flex-col overflow-y-auto overscroll-contain"
        >
          <div role="log" aria-live="polite" aria-label="Conversazione con l’assistente" className="px-3 py-3 space-y-3">
            {messages.map((m) =>
              m.role === 'user' ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-violet-600 px-3.5 py-2 text-sm text-white">{m.text}</div>
                </div>
              ) : m.role === 'assistant' ? (
                <div key={m.id} className="flex">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-neutral-100 px-3.5 py-2 text-sm text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">{m.text}</div>
                </div>
              ) : (
                <p key={m.id} className="text-center text-xs text-neutral-500 dark:text-neutral-400">{m.text}</p>
              ),
            )}
          </div>

          {/* Zona interazione (scrollabile con i messaggi) */}
          <div className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 px-3 py-3">
          {submitState === 'success' ? (
            <div role="status" aria-live="polite">
              <p className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-200 dark:ring-emerald-800/60">
                Richiesta inviata. Luca ha ricevuto il riepilogo della conversazione e potrà ricontattarti.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className={primaryBtn}>Chiudi</button>
                <a href="/contatti" className={ghostBtn}>Vai ai contatti</a>
              </div>
            </div>
          ) : isContactNode ? (
            // ===== Raccolta contatto (nodo `lead`) =====
            <form onSubmit={handleContactSubmit} noValidate>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
                Ho già raccolto le informazioni principali. Lascia nome ed email per permettere a Luca di approfondire la richiesta.
              </p>

              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="sa-name" className="text-xs font-medium">Nome*</label>
                  <input id="sa-name" type="text" required value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="sa-email" className="text-xs font-medium">Email*</label>
                  <input id="sa-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
                </div>
              </div>

              {/* Campi facoltativi: chiusi di default, resi via render condizionale */}
              <button
                type="button"
                onClick={() => setShowOptionalContact((v) => !v)}
                aria-expanded={showOptionalContact}
                aria-controls="sa-optional"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-700 dark:text-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded"
              >
                <span aria-hidden="true">{showOptionalContact ? '−' : '+'}</span> Aggiungi sito, telefono o dettagli
              </button>

              {showOptionalContact && (
                <div id="sa-optional" className="mt-3 space-y-3">
                  <div>
                    <label htmlFor="sa-website" className="text-xs font-medium">Sito web</label>
                    <input id="sa-website" type="text" inputMode="url" placeholder="esempio.it" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="sa-phone" className="text-xs font-medium">Telefono</label>
                    <input id="sa-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="sa-message" className="text-xs font-medium">Messaggio</label>
                    <textarea id="sa-message" rows={2} value={message} onChange={(e) => setMessage(e.target.value)} className={inputClass} />
                  </div>
                </div>
              )}

              {/* Honeypot anti-bot: fuori schermo, non visibile agli utenti */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                <label htmlFor="sa-company">Lascia vuoto questo campo</label>
                <input id="sa-company" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              <label className="mt-3 flex items-start gap-2 text-xs text-neutral-600 dark:text-neutral-300">
                <input type="checkbox" required checked={privacyConsent} onChange={(e) => setPrivacyConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded accent-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500" />
                <span>Accetto la <a href="/privacy" className="underline">Privacy &amp; Cookie Policy</a>.*</span>
              </label>

              {formError && (
                <p role="alert" className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{formError}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="submit" disabled={submitState === 'sending'} className={primaryBtn}>
                  {submitState === 'sending' ? 'Invio in corso…' : 'Invia la richiesta'}
                </button>
                <button type="button" onClick={() => navigateTo(START_NODE_ID)} className={ghostBtn}>Torna alle opzioni</button>
              </div>
            </form>
          ) : (
            // ===== Navigazione (opzioni / FAQ / fallback / handoff) =====
            <div>
              {isHumanNode && (
                <div className="mb-3 flex flex-wrap gap-2">
                  <a href="/contatti" className={ghostBtn}>Vai ai contatti</a>
                  {waHref && (
                    <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold ring-1 ring-emerald-500 text-emerald-700 dark:text-emerald-300 transition hover:bg-emerald-50 dark:hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 motion-reduce:transition-none">
                      Scrivi su WhatsApp
                    </a>
                  )}
                </div>
              )}

              {pendingActions === 'faq' ? (
                <div className="grid gap-2" role="group" aria-label="Cosa vuoi fare">
                  <button type="button" onClick={() => navigateTo(START_NODE_ID)} className={optButtonClass}>Approfondisci</button>
                  <button type="button" onClick={() => navigateTo(LEAD_NODE_ID)} className={optButtonClass}>Lascia una richiesta</button>
                  <button type="button" onClick={() => setPendingActions(null)} className={optButtonClass}>Torna alle opzioni</button>
                </div>
              ) : pendingActions === 'fallback' ? (
                <div className="grid gap-2" role="group" aria-label="Cosa vuoi fare">
                  <button type="button" onClick={() => navigateTo(LEAD_NODE_ID)} className={optButtonClass}>Lascia la richiesta</button>
                  <button type="button" onClick={() => navigateTo(HUMAN_NODE_ID)} className={optButtonClass}>Parla con Luca</button>
                  <button type="button" onClick={() => setPendingActions(null)} className={optButtonClass}>Torna alle opzioni</button>
                </div>
              ) : (
                <div className="grid gap-2" role="group" aria-label="Scelte rapide">
                  {visibleOptions.map((opt, i) => (
                    <button key={`${currentNodeId}-${i}`} type="button" onClick={() => chooseOption(opt)} className={optButtonClass}>
                      {opt.label}
                    </button>
                  ))}
                  {hasMoreOptions && (
                    <button type="button" onClick={() => setShowAllOptions(true)} className={optButtonClass}>Altre opzioni…</button>
                  )}
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Input testuale ancorato in basso */}
        {showPinnedInput && (
          <div
            className="shrink-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-3"
            style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
          >
            <form onSubmit={handleFreeSubmit} className="flex gap-2">
              <label htmlFor="sa-free" className="sr-only">Scrivi la tua domanda</label>
              <input
                id="sa-free"
                type="text"
                value={freeInput}
                onChange={(e) => setFreeInput(e.target.value)}
                placeholder="Scrivi la tua domanda…"
                className="min-w-0 flex-1 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              />
              <button type="submit" className="shrink-0 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 motion-reduce:transition-none">
                Invia
              </button>
            </form>

            <div className="mt-2 text-center">
              <button type="button" onClick={() => navigateTo(HUMAN_NODE_ID)} className="text-xs font-semibold text-neutral-500 underline hover:text-violet-700 dark:text-neutral-400 dark:hover:text-violet-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded">
                Parla con Luca
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
