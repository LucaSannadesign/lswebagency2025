// src/pages/api/mini-analisi.ts
// Riceve i dati della Mini‑Analisi / Assistente guidato e salva un lead nel CRM (tabella public.leads).
// La service role NON è mai esposta al client: l'insert avviene solo qui, lato server.
// SICUREZZA: profilo, summary, fascia e pacchetto NON sono mai presi dal client; vengono
// ri‑derivati lato server dalle sole risposte sanitizzate, da valori ammessi e controllati.
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../lib/supabase.server';
import { validateSiteRescueUrl } from '../../lib/siteRescueUrl';
import { serializeStructuredNotes } from '../../lib/structuredNotes';
import { linkLeadToAudit, type AuditLinkOutcome } from '../../lib/leadAuditLink';
import computeProfile, { type Answers } from '../../utils/mini-analisi/computeProfile';
import buildSummary, { type Summary } from '../../utils/mini-analisi/buildSummary';
import { intentLabelById, deriveAssistantTier, ASSISTANT_PACKAGES, type AssistantTier } from '../../utils/mini-analisi/assistantFlow';

export const prerender = false;

const MAX_BODY_BYTES = 20_000; // payload ragionevole per una mini‑analisi
const MAX_FIELD_LEN = 300; // limite per i singoli valori di testo libero
const MAX_ANSWER_KEYS = 40; // limite difensivo sul numero di chiavi in answers
const ALLOWED_SOURCES = new Set(['mini_analisi', 'assistente_ai']);

// Esito dell'accodamento in coda LS Site Rescue (best-effort, mai bloccante).
type AuditOutcome = 'accodato' | 'duplicato' | 'non_accodato' | 'non_richiesto';
const AUDIT_OUTCOME_LABEL: Record<AuditOutcome, string> = {
  accodato: 'Audit Site Rescue: accodato',
  duplicato: 'Audit Site Rescue: già presente in coda',
  non_accodato: 'Audit Site Rescue: non accodato',
  non_richiesto: 'Audit Site Rescue: non richiesto',
};

// Esito interno del collegamento lead↔audit in lead_site_audits (best-effort,
// mai bloccante). Mostrato in email solo come etichetta, mai con ID tecnici.
const AUDIT_LINK_OUTCOME_LABEL: Record<AuditLinkOutcome, string> = {
  collegato: 'Collegamento CRM: collegato',
  gia_collegato: 'Collegamento CRM: già collegato',
  non_collegato: 'Collegamento CRM: non collegato',
  non_applicabile: 'Collegamento CRM: non applicabile',
};

// Maschera indirizzi email e tronca un errore prima di loggarlo (mai segreti, mai PII completa).
function sanitizeLogMessage(err: unknown): string {
  return (err instanceof Error ? err.message : String(err))
    .replace(/[^\s@]+@[^\s@]+/g, '[email]')
    .slice(0, 200);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

const isEmail = (v: unknown): v is string => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// Tronca una stringa client a un limite ragionevole; restituisce undefined se vuota.
function clampStr(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}

// Normalizza un URL facoltativo: accetta domini senza protocollo (→ https://), accetta
// http/https espliciti, RIFIUTA altri schemi (ftp, javascript, mailto…) e input non validi
// (ritorna null). Limite di lunghezza. Va nelle note CRM (nessuna nuova colonna).
function normalizeWebsiteUrl(raw: unknown): string | null {
  const v = (typeof raw === 'string' ? raw : '').trim().slice(0, 200);
  if (!v) return null;
  // Se è presente uno schema esplicito, deve essere http/https.
  if (/^[a-z][a-z0-9+.-]*:/i.test(v) && !/^https?:\/\//i.test(v)) return null;
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProto);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    if (!u.hostname.includes('.')) return null;
    return u.toString().slice(0, 300);
  } catch {
    return null;
  }
}

// Sanitizza answers ricevute dal client: solo valori stringa, troncati, numero di chiavi limitato.
function sanitizeAnswers(raw: unknown): Answers {
  const out: Record<string, string> = {};
  if (raw && typeof raw === 'object') {
    let count = 0;
    for (const [k, val] of Object.entries(raw as Record<string, unknown>)) {
      if (count >= MAX_ANSWER_KEYS) break;
      if (typeof val === 'string') {
        const t = val.trim().slice(0, MAX_FIELD_LEN);
        if (t) {
          out[k] = t;
          count++;
        }
      }
    }
  }
  return out as Answers;
}

// Priority CRM derivata SOLO dall'urgenza dichiarata (non dal profilo client).
function derivePriorityFromAnswers(answers: Answers): 'alta' | 'media' | 'bassa' {
  switch (answers.urgency) {
    case 'Entro 1 mese':
      return 'alta';
    case '3–6 mesi':
    case 'Non c’è scadenza':
      return 'bassa';
    default:
      return 'media';
  }
}

// problem_detected SOLO con valori enum esistenti nel CRM (nessun valore inventato).
function deriveProblems(answers: Answers): string[] {
  const set = new Set<string>();
  switch (answers.siteStatus) {
    case 'Parto da zero':
    case 'Solo presenza social':
      set.add('sito_assente');
      break;
  }
  switch (answers.primaryNeed) {
    case 'Audit rapido / SEO locale':
      set.add('google_debole');
      break;
    case 'Landing page':
      set.add('serve_landing');
      break;
    case 'Restyling del sito':
      set.add('sito_vecchio');
      break;
  }
  switch (answers.mainGoal) {
    case 'Essere trovato su Google':
      set.add('google_debole');
      break;
    case 'Ricevere più richieste':
      set.add('pochi_contatti');
      break;
    case 'Migliorare immagine e fiducia':
      set.add('immagine_non_professionale');
      break;
    case 'Vendere online':
      set.add('serve_ecommerce');
      break;
  }
  return [...set];
}

type AssistantPackage = { tier: AssistantTier; setup: number; monthly: number };

function buildNotes(opts: {
  answers: Answers;
  summary: Summary;
  message?: string;
  origin: string;
  flowPath?: string | null;
  websiteUrl?: string | null;
  context?: string | null;
  assistantPackage?: AssistantPackage | null;
  auditConsent?: boolean;
}): string {
  const { answers, summary, message, origin, flowPath, websiteUrl, context, assistantPackage, auditConsent } = opts;
  const priorita = (summary.topPriorities ?? []).map((p) => `- ${p.label} (${p.score})`).join('\n') || '- (nessuna priorità dominante)';
  const reason = summary.reason ? `\nMotivazione: ${summary.reason}` : '';
  const msg = message?.trim() ? `Messaggio utente:\n${message.trim()}` : 'Messaggio utente: (nessuno)';
  const structuredData = serializeStructuredNotes(answers, summary);

  // Intestazione dipendente dall'origine reale del lead (entrambe mappate su source="altro").
  const isAssistant = origin === 'assistente_ai';
  const header = isAssistant
    ? [
        'Lead generato dall’Assistente commerciale guidato (sito LS Web Agency).',
        'Origine: assistente_ai (mappata su source="altro").',
        `Percorso scelto: ${flowPath || '—'}`,
        ...(context ? [`Contesto: ${context}`] : []),
      ]
    : [
        'Lead generato dalla Mini‑Analisi Guidata (sito LS Web Agency).',
        'Origine: mini_analisi (mappata su source="altro").',
      ];

  const packageLine = assistantPackage
    ? `Pacchetto consigliato: ${assistantPackage.tier} — ${assistantPackage.setup} € una-tantum + ${assistantPackage.monthly} €/mese`
    : null;

  return [
    ...header,
    `Sito segnalato: ${websiteUrl || '—'}`,
    ...(auditConsent ? ['Consenso all’analisi tecnica: sì'] : []),
    '',
    `Servizio consigliato: ${summary.service ?? '—'}${reason}`,
    `Fascia/Livello: ${summary.level ?? '—'}`,
    ...(packageLine ? [packageLine] : []),
    '',
    'Priorità emerse:',
    priorita,
    '',
    'Risposte:',
    `- Stato sito: ${answers.siteStatus ?? '—'}`,
    `- Tipo attività: ${answers.businessType ?? '—'}`,
    `- Obiettivo: ${answers.mainGoal ?? '—'}`,
    `- Bisogno percepito: ${answers.primaryNeed ?? '—'}`,
    `- Contenuti: ${answers.assets ?? '—'}`,
    `- Gestione richieste: ${answers.contactMethod ?? '—'}`,
    `- Urgenza: ${answers.urgency ?? '—'}`,
    '',
    msg,
    // JSON sempre valido: degrada da {answers, summary} a {answers}; se anche
    // la versione ridotta supera il limite, il blocco viene omesso del tutto
    // (il blocco testuale "Risposte:" sopra resta comunque).
    ...(structuredData ? ['', 'Dati strutturati:', structuredData] : []),
  ].join('\n');
}

// Notifica amministrativa via Resend. Best‑effort: non lancia mai e non blocca il flusso.
// Riusa le stesse variabili ambiente del form contatti. Nessuna email automatica al cliente.
async function sendMiniAnalisiNotification(input: {
  contactName: string;
  email: string;
  phone: string;
  businessName: string;
  summary: Summary;
  answers: Answers;
  priority: string;
  message: string;
  websiteUrl?: string | null;
  origin: string;
  flowPath?: string | null;
  assistantPackage?: AssistantPackage | null;
  auditOutcome: AuditOutcome;
  auditLinkOutcome: AuditLinkOutcome;
}): Promise<boolean> {
  try {
    // Preview Vercel: nessun invio reale senza consenso esplicito (production invariata).
    if (
      import.meta.env.VERCEL_ENV === 'preview' &&
      import.meta.env.CONTACT_ALLOW_EMAIL_IN_PREVIEW !== 'true'
    ) {
      console.warn('[mini-analisi] preview: invio email disabilitato (CONTACT_ALLOW_EMAIL_IN_PREVIEW non attivo)');
      return false;
    }

    const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
    const TO = import.meta.env.CONTACT_TO_EMAIL || import.meta.env.MAIL_TO;
    const FROM = import.meta.env.CONTACT_FROM_EMAIL || import.meta.env.MAIL_FROM || 'onboarding@resend.dev';

    // Log di sola presenza: mai chiavi, valori env completi o indirizzi email.
    if (!RESEND_API_KEY || !TO) {
      console.error('[mini-analisi] email non inviata: configurazione mancante', {
        hasResendKey: Boolean(RESEND_API_KEY),
        hasToEmail: Boolean(TO),
      });
      return false;
    }

    const service = input.summary.service ?? '—';
    const level = input.summary.level ?? '—';
    const urgency = input.answers.urgency ?? '—';
    const priorities =
      (input.summary.topPriorities ?? []).map((p) => `- ${p.label} (${p.score})`).join('\n') ||
      '- (nessuna priorità dominante)';
    const userMessage = input.message.trim() ? input.message.trim() : '(nessuno)';

    const isAssistant = input.origin === 'assistente_ai';
    const packageLine = input.assistantPackage
      ? `Pacchetto consigliato: ${input.assistantPackage.tier} — ${input.assistantPackage.setup} € una-tantum + ${input.assistantPackage.monthly} €/mese`
      : null;

    const subject = isAssistant
      ? `Nuova richiesta assistente AI — ${input.contactName}`
      : `Nuova mini-analisi LS Web Agency — ${input.contactName}`;
    const text = [
      isAssistant
        ? 'Nuova richiesta dall’Assistente commerciale guidato (sito LS Web Agency).'
        : 'Nuova mini‑analisi guidata dal sito LS Web Agency.',
      ...(isAssistant ? [`Percorso scelto: ${input.flowPath || '—'}`] : []),
      '',
      `Nome contatto: ${input.contactName}`,
      `Email: ${input.email}`,
      `Telefono: ${input.phone || '—'}`,
      `Attività: ${input.businessName || '—'}`,
      `Sito segnalato: ${input.websiteUrl || '—'}`,
      '',
      `Servizio consigliato: ${service}`,
      `Livello/Fascia: ${level}`,
      ...(packageLine ? [packageLine] : []),
      `Priorità: ${input.priority}`,
      `Urgenza: ${urgency}`,
      AUDIT_OUTCOME_LABEL[input.auditOutcome],
      AUDIT_LINK_OUTCOME_LABEL[input.auditLinkOutcome],
      '',
      'Principali priorità emerse:',
      priorities,
      '',
      'Messaggio utente:',
      userMessage,
    ].join('\n');

    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: input.email,
      subject,
      text,
    });

    if (error) {
      // Maschera eventuali indirizzi email nel messaggio prima di loggarlo.
      console.error('[mini-analisi] Resend error', {
        name: (error as any)?.name,
        message: String((error as any)?.message || '').replace(/[^\s@]+@[^\s@]+/g, '[email]').slice(0, 200),
      });
      return false;
    }

    console.log('[mini-analisi] notifica email inviata', {
      toDomain: TO.includes('@') ? TO.split('@').pop() : '(n/a)',
    });
    return true;
  } catch (err) {
    const detail = (err instanceof Error ? err.message : String(err))
      .replace(/[^\s@]+@[^\s@]+/g, '[email]')
      .slice(0, 200);
    console.error('[mini-analisi] eccezione invio email', detail);
    return false;
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Controllo dimensione payload prima di parse.
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return json({ ok: false, error: 'PAYLOAD_TOO_LARGE' }, 413);
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw || '{}');
    } catch {
      return json({ ok: false, error: 'INVALID_JSON' }, 400);
    }

    const contactName = clampStr(body.contactName, 120) ?? '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = clampStr(body.phone, 40) ?? '';
    const businessName = clampStr(body.businessName, 160) ?? '';
    const message = clampStr(body.message, 2000) ?? '';
    const privacyConsent = body.privacyConsent === true;
    const honeypot = typeof body.honeypot === 'string' ? body.honeypot.trim() : '';

    // Honeypot: se compilato, è un bot → fingi successo senza salvare nulla.
    if (honeypot) {
      return json({ ok: true });
    }

    // Validazioni obbligatorie.
    if (!contactName) return json({ ok: false, error: 'MISSING_CONTACT_NAME' }, 400);
    if (!isEmail(email)) return json({ ok: false, error: 'INVALID_EMAIL' }, 400);
    if (!privacyConsent) return json({ ok: false, error: 'PRIVACY_REQUIRED' }, 400);

    // === Dati derivati SOLO lato server da valori sanitizzati/whitelisted ===
    const answers = sanitizeAnswers(body.answers);
    const profile = computeProfile(answers);
    const summary = buildSummary(answers, profile);

    // Origine: whitelist (mai una source arbitraria dal client).
    const rawSource = typeof body.source === 'string' ? body.source.trim() : '';
    const origin = ALLOWED_SOURCES.has(rawSource) ? rawSource : 'mini_analisi';

    // Intento: whitelist sugli id noti; flowPath derivato server‑side (non dal client).
    const rawIntent = typeof body.initialIntent === 'string' ? body.initialIntent.trim().slice(0, 40) : '';
    const initialIntent = intentLabelById[rawIntent] ? rawIntent : '';
    const flowPath = initialIntent ? intentLabelById[initialIntent] : '';

    const websiteUrl = normalizeWebsiteUrl(body.websiteUrl);
    const assistantContext = clampStr(body.assistantContext, 80) ?? '';

    // Consenso ESPLICITO all'analisi tecnica: accettato solo come booleano true.
    // Separato e indipendente da privacyConsent (che resta obbligatorio come sopra).
    const auditConsent = body.auditConsent === true;
    // URL destinato a Site Rescue: validazione STRETTA (anti-SSRF a monte).
    const siteRescueUrl = auditConsent ? validateSiteRescueUrl(body.websiteUrl) : null;
    // Se l'utente autorizza l'analisi, l'URL deve essere presente e valido.
    if (auditConsent && !siteRescueUrl) return json({ ok: false, error: 'INVALID_URL' }, 400);

    // Pacchetto reale: SOLO per assistente_ai + percorso automazioni, derivato server‑side.
    const assistantPackage: AssistantPackage | null =
      origin === 'assistente_ai' && initialIntent === 'automazioni'
        ? ASSISTANT_PACKAGES[deriveAssistantTier(answers)]
        : null;

    const priority = derivePriorityFromAnswers(answers);

    const payload = {
      business_name: businessName || 'Lead da Mini-Analisi',
      contact_name: contactName,
      email,
      phone: phone || null,
      sector: 'altro',
      service_interest: summary.service ?? null,
      status: 'nuovo',
      priority,
      source: 'altro',
      problem_detected: deriveProblems(answers),
      notes: buildNotes({ answers, summary, message, origin, flowPath, websiteUrl: siteRescueUrl ?? websiteUrl, context: assistantContext, assistantPackage, auditConsent }),
      estimated_value: 0,
      archived: false,
    };

    // Stessa singola operazione PostgREST di prima, ma con ritorno dell'id
    // (serve SOLO server-side per il collegamento in lead_site_audits:
    // mai nella risposta al browser, mai nell'email).
    const { data: leadRow, error } = await supabaseAdmin.from('leads').insert(payload).select('id').single();
    if (error || !leadRow?.id) {
      console.error('[mini-analisi] supabase insert error', error ? error.message : 'lead id mancante');
      return json({ ok: false, error: 'SAVE_ERROR' }, 500);
    }
    const leadId: string = leadRow.id;

    // === Accodamento LS Site Rescue (best‑effort, MAI bloccante) ===
    // Il lead è già salvato: da qui in poi nessun errore può trasformare la
    // richiesta in un errore utente. Accodiamo un audit solo con consenso esplicito
    // e URL valido, evitando duplicati recenti (queued/running negli ultimi 15 min).
    let auditQueued = false;
    let auditDuplicate = false;
    let auditOutcome: AuditOutcome = 'non_richiesto';
    // Collegamento lead↔audit in lead_site_audits: anch'esso best-effort e
    // interno (l'id del lead e dell'audit non lasciano mai il server).
    let auditLinkOutcome: AuditLinkOutcome = 'non_applicabile';
    let auditId: string | null = null;

    if (auditConsent && siteRescueUrl) {
      try {
        const dedupeSince = new Date(Date.now() - 15 * 60 * 1000).toISOString();
        const { data: existing, error: dedupeError } = await supabaseAdmin
          .from('site_audits')
          .select('id')
          .eq('url', siteRescueUrl)
          .in('status', ['queued', 'running'])
          .gte('created_at', dedupeSince)
          .limit(1);

        // Se il controllo duplicati fallisce: NON accodare alla cieca, NON bloccare il lead.
        if (dedupeError) throw dedupeError;

        if (existing && existing.length > 0) {
          auditDuplicate = true;
          auditOutcome = 'duplicato';
          // Audit già in coda per lo stesso URL: il nuovo lead va comunque
          // collegato all'audit esistente (nessun nuovo audit creato).
          auditId = existing[0]?.id ?? null;
        } else {
          // Payload minimo: solo url/name/email. Tutti gli altri campi ai default del DB
          // (status, max_pages, attempt_count, max_attempts, storage_bucket, timestamp…).
          // L'id torna dalla stessa operazione di insert (nessuna query aggiuntiva).
          const { data: createdAudit, error: insertError } = await supabaseAdmin
            .from('site_audits')
            .insert({ url: siteRescueUrl, name: contactName, email })
            .select('id')
            .single();
          if (insertError) throw insertError;
          auditQueued = true;
          auditOutcome = 'accodato';
          auditId = createdAudit?.id ?? null;
        }
      } catch (auditError) {
        auditOutcome = 'non_accodato';
        console.error('[mini-analisi] site audit enqueue error', sanitizeLogMessage(auditError));
      }

      // Relazione nella tabella ponte: fallire qui non tocca lead né audit
      // e non trasforma mai la risposta in errore. Il conflitto sulla PK
      // composta è gestito come "gia_collegato" dentro linkLeadToAudit.
      if (auditId) {
        const linkResult = await linkLeadToAudit(supabaseAdmin, leadId, auditId);
        auditLinkOutcome = linkResult.outcome;
        if (linkResult.errorMessage) {
          console.error('[mini-analisi] lead-audit link error', sanitizeLogMessage(linkResult.errorMessage));
        }
      } else if (auditOutcome === 'accodato' || auditOutcome === 'duplicato') {
        // Audit disponibile ma senza id recuperato: collegamento non riuscito.
        auditLinkOutcome = 'non_collegato';
      }
    }

    // Lead salvato nel CRM: invio della notifica amministrativa via Resend.
    // Best‑effort: se l'email fallisce, il lead resta salvato e la risposta è comunque ok.
    const emailSent = await sendMiniAnalisiNotification({
      contactName,
      email,
      phone,
      businessName,
      summary,
      answers,
      priority,
      message,
      websiteUrl: siteRescueUrl ?? websiteUrl,
      origin,
      flowPath,
      assistantPackage,
      auditOutcome,
      auditLinkOutcome,
    });

    // Solo booleani non sensibili: mai leadId o auditId al browser.
    return json({
      ok: true,
      leadSaved: true,
      emailSent,
      auditQueued,
      auditDuplicate,
      auditLinked: auditLinkOutcome === 'collegato',
      auditLinkDuplicate: auditLinkOutcome === 'gia_collegato',
    });
  } catch (err) {
    console.error('[mini-analisi] unexpected', err);
    return json({ ok: false, error: 'SERVER_ERROR' }, 500);
  }
};
