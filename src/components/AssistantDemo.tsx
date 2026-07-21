import { useEffect, useRef, useState } from 'react';

/**
 * AssistantDemo — demo guidata e DETERMINISTICA dell'assistente virtuale.
 *
 * Mostra al cliente finale come potrebbe comportarsi l'assistente in quattro scenari.
 * È una pura simulazione lato client: nessuna API, nessun AI, nessun salvataggio CRM,
 * nessuna raccolta di dati personali, nessun input libero. I percorsi sono scriptati.
 * Da non confondere con MiniAnalisi (l'assistente commerciale che salva i lead).
 */

type Option = { label: string; next: string };
type Node = { bot: string; options?: Option[]; end?: boolean };
type Message = { role: 'bot' | 'user'; text: string };

const START = 'start';

// Nota finale obbligatoria, mostrata al termine di ogni scenario.
const SIM_NOTE =
  'Questa è una simulazione guidata. Il tuo assistente sarà configurato con i servizi, le risposte e le regole della tua attività.';

const NODES: Record<string, Node> = {
  // Scelta dello scenario
  start: {
    bot: 'Ciao! 👋 Questa è una demo dell’assistente LS Web Agency. Scegli cosa vuoi provare:',
    options: [
      { label: 'Informazioni sui servizi', next: 'info' },
      { label: 'Richiedere un preventivo', next: 'preventivo' },
      { label: 'Richiesta fuori orario', next: 'fuori_orario' },
      { label: 'Parlare con una persona', next: 'persona' },
    ],
  },

  // 1) Informazioni sui servizi
  info: {
    bot: 'Volentieri! Su cosa vuoi sapere di più?',
    options: [
      { label: 'Creare un nuovo sito', next: 'info_sito' },
      { label: 'Essere trovato su Google', next: 'info_seo' },
      { label: 'Automatizzare le risposte', next: 'info_auto' },
    ],
  },
  info_sito: {
    bot: 'Realizziamo siti professionali orientati ai contatti: struttura chiara, velocità e SEO di base. Posso mostrarti esempi o farti ricontattare per i dettagli.',
    end: true,
  },
  info_seo: {
    bot: 'Lavoriamo sulla visibilità locale: scheda Google, pagine ottimizzate e contenuti mirati alla tua zona.',
    end: true,
  },
  info_auto: {
    bot: 'L’assistente risponde alle domande frequenti su sito e WhatsApp e raccoglie le richieste, con passaggio a una persona quando serve.',
    end: true,
  },

  // 2) Richiedere un preventivo
  preventivo: {
    bot: 'Posso raccogliere le informazioni per una proposta. Di che progetto si tratta?',
    options: [
      { label: 'Sito web', next: 'prev_sito' },
      { label: 'Assistente AI', next: 'prev_ai' },
      { label: 'SEO locale', next: 'prev_seo' },
    ],
  },
  prev_sito: {
    bot: 'Per un sito chiederei numero di pagine, contenuti disponibili e obiettivo. Luca ti preparerebbe una proposta su misura, con una stima solo dopo la verifica.',
    end: true,
  },
  prev_ai: {
    bot: 'Per l’assistente chiederei i canali (sito/WhatsApp), le domande più frequenti e il volume. Riceveresti una fascia orientativa e i passi successivi, da confermare dopo una verifica.',
    end: true,
  },
  prev_seo: {
    bot: 'Per la SEO locale chiederei zona, servizi da promuovere e presenza su Google. Poi una proposta con priorità e tempi.',
    end: true,
  },

  // 3) Richiesta fuori orario
  fuori_orario: {
    bot: 'In questo momento siamo fuori orario, ma posso prendere la tua richiesta e farti ricontattare.',
    options: [
      { label: 'Lascia un messaggio', next: 'fuori_msg' },
      { label: 'Richiedi una richiamata', next: 'fuori_call' },
    ],
  },
  fuori_msg: {
    bot: 'Perfetto: registrerei il messaggio e i recapiti, e Luca ti risponderebbe negli orari concordati.',
    end: true,
  },
  fuori_call: {
    bot: 'Va bene: segnerei la richiesta di richiamata con la fascia oraria che preferisci, così Luca ti ricontatta negli orari concordati.',
    end: true,
  },

  // 4) Parlare con una persona
  persona: {
    bot: 'Posso passarti a una persona.',
    options: [
      { label: 'Sì, parla con una persona', next: 'persona_si' },
      { label: 'Prima qualche informazione', next: 'info' },
    ],
  },
  persona_si: {
    bot: 'La risposta umana avviene negli orari concordati; fuori orario prendiamo la richiesta e ti ricontattiamo. Nel sito reale, qui partirebbe il passaggio ai contatti o a WhatsApp.',
    end: true,
  },
};

export default function AssistantDemo() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: NODES[START].bot }]);
  const [currentId, setCurrentId] = useState<string>(START);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll della sola lista messaggi (non della pagina) ad ogni nuovo messaggio.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const current = NODES[currentId];

  function choose(option: Option) {
    const next = NODES[option.next];
    if (!next) return;
    setMessages((prev) => [...prev, { role: 'user', text: option.label }, { role: 'bot', text: next.bot }]);
    setCurrentId(option.next);
  }

  function restart() {
    setMessages([{ role: 'bot', text: NODES[START].bot }]);
    setCurrentId(START);
  }

  return (
    <div className="rounded-2xl ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/80 dark:bg-neutral-900/60 shadow-sm overflow-hidden">
      {/* Header con badge "simulazione" sempre visibile */}
      <div className="flex items-center gap-3 p-4 border-b border-neutral-200 dark:border-neutral-800">
        <span className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500" aria-hidden="true" />
        <div className="min-w-0">
          <div className="font-semibold leading-tight">Assistente LS — demo</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">Esempio di conversazione</div>
        </div>
        <span className="ml-auto shrink-0 rounded-full px-3 py-1 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 ring-1 ring-amber-200/70 dark:ring-amber-700/50">
          Simulazione · nessun dato salvato
        </span>
      </div>

      {/* Conversazione */}
      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-label="Conversazione di esempio con l’assistente"
        className="p-4 space-y-3 max-h-[60vh] sm:max-h-[24rem] overflow-y-auto"
      >
        {messages.map((m, i) =>
          m.role === 'bot' ? (
            <div key={i} className="flex">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 bg-violet-600 text-white">{m.text}</div>
            </div>
          ),
        )}
      </div>

      {/* Risposte rapide oppure chiusura scenario */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
        {current.options && !current.end ? (
          <div className="grid gap-2" role="group" aria-label="Risposte rapide">
            {current.options.map((opt) => (
              <button
                key={opt.next + opt.label}
                type="button"
                onClick={() => choose(opt)}
                className="w-full text-left rounded-xl px-4 py-2.5 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/70 dark:bg-neutral-900/50 font-medium transition hover:ring-violet-400 hover:bg-violet-50/60 dark:hover:bg-violet-900/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <p className="rounded-xl p-3 text-sm bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100 ring-1 ring-amber-200/70 dark:ring-amber-800/50">
              {SIM_NOTE}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/contatti?servizio=assistente-ai"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 bg-violet-600 text-white hover:bg-violet-700 transition text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                Richiedi una valutazione
              </a>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 ring-1 ring-neutral-300 dark:ring-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                Ricomincia la demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
