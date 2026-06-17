// src/pages/api/mini-analisi.ts
// Riceve i dati finali della Mini‑Analisi Guidata e salva un lead nel CRM (tabella public.leads).
// La service role NON è mai esposta al client: l'insert avviene solo qui, lato server.
import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { supabaseAdmin } from '../../lib/supabase.server';
import type { Answers, Profile } from '../../utils/mini-analisi/computeProfile';
import type { Summary } from '../../utils/mini-analisi/buildSummary';

export const prerender = false;

const MAX_BODY_BYTES = 20_000; // payload ragionevole per una mini‑analisi

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

// Deriva priority dai dati del profilo, usando solo i valori validi del CRM.
function derivePriority(profile?: Profile | null): 'alta' | 'media' | 'bassa' {
  const us = Number(profile?.urgencyScore);
  if (!Number.isFinite(us)) return 'media';
  if (us >= 3) return 'alta';
  if (us === 2) return 'media';
  return 'bassa';
}

// Deriva problem_detected SOLO con valori enum esistenti nel CRM (nessun valore inventato).
function deriveProblems(answers?: Answers | null): string[] {
  const set = new Set<string>();
  switch (answers?.siteStatus) {
    case 'Parto da zero':
    case 'Solo presenza social':
      set.add('sito_assente');
      break;
  }
  switch (answers?.primaryNeed) {
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
  switch (answers?.mainGoal) {
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

function buildNotes(opts: {
  answers?: Answers | null;
  profile?: Profile | null;
  summary?: Summary | null;
  message?: string;
}): string {
  const { answers, profile, summary, message } = opts;
  const priorita = (summary?.topPriorities ?? []).map((p) => `- ${p.label} (${p.score})`).join('\n') || '- (nessuna priorità dominante)';
  const reason = profile?.reason ? `\nMotivazione: ${profile.reason}` : '';
  const msg = message?.trim() ? `Messaggio utente:\n${message.trim()}` : 'Messaggio utente: (nessuno)';

  return [
    'Lead generato dalla Mini‑Analisi Guidata (sito LS Web Agency).',
    'Origine: mini_analisi (mappata su source="altro").',
    '',
    `Servizio consigliato: ${summary?.service ?? profile?.service ?? '—'}${reason}`,
    `Fascia/Livello: ${profile?.level ?? '—'}`,
    '',
    'Priorità emerse:',
    priorita,
    '',
    'Risposte:',
    `- Stato sito: ${answers?.siteStatus ?? '—'}`,
    `- Tipo attività: ${answers?.businessType ?? '—'}`,
    `- Obiettivo: ${answers?.mainGoal ?? '—'}`,
    `- Bisogno percepito: ${answers?.primaryNeed ?? '—'}`,
    `- Contenuti: ${answers?.assets ?? '—'}`,
    `- Gestione richieste: ${answers?.contactMethod ?? '—'}`,
    `- Urgenza: ${answers?.urgency ?? '—'}`,
    '',
    msg,
    '',
    'Dati strutturati:',
    JSON.stringify({ answers: answers ?? null, profile: profile ?? null, summary: summary ?? null }),
  ].join('\n');
}

// Notifica amministrativa della nuova mini‑analisi via Resend.
// Comportamento best‑effort: non lancia mai e non blocca il flusso (ritorna solo true/false).
// Riusa le stesse variabili ambiente del form contatti. Nessuna email automatica al potenziale cliente.
async function sendMiniAnalisiNotification(input: {
  contactName: string;
  email: string;
  phone: string;
  businessName: string;
  answers?: Answers | null;
  profile?: Profile | null;
  summary?: Summary | null;
  priority: string;
  message: string;
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

    const service = input.summary?.service ?? input.profile?.service ?? '—';
    const level = input.profile?.level ?? '—';
    const urgency = input.answers?.urgency ?? '—';
    const priorities =
      (input.summary?.topPriorities ?? []).map((p) => `- ${p.label} (${p.score})`).join('\n') ||
      '- (nessuna priorità dominante)';
    const userMessage = input.message.trim() ? input.message.trim() : '(nessuno)';

    const subject = `Nuova mini-analisi LS Web Agency — ${input.contactName}`;
    const text = [
      'Nuova mini‑analisi guidata dal sito LS Web Agency.',
      '',
      `Nome contatto: ${input.contactName}`,
      `Email: ${input.email}`,
      `Telefono: ${input.phone || '—'}`,
      `Attività: ${input.businessName || '—'}`,
      '',
      `Servizio consigliato: ${service}`,
      `Livello/Fascia: ${level}`,
      `Priorità: ${input.priority}`,
      `Urgenza: ${urgency}`,
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

    const contactName = typeof body.contactName === 'string' ? body.contactName.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const businessName = typeof body.businessName === 'string' ? body.businessName.trim() : '';
    const message = typeof body.message === 'string' ? body.message : '';
    const privacyConsent = body.privacyConsent === true;
    const honeypot = typeof body.honeypot === 'string' ? body.honeypot.trim() : '';

    const answers = (body.answers ?? null) as Answers | null;
    const profile = (body.profile ?? null) as Profile | null;
    const summary = (body.summary ?? null) as Summary | null;

    // Honeypot: se compilato, è un bot → fingi successo senza salvare nulla.
    if (honeypot) {
      return json({ ok: true });
    }

    // Validazioni obbligatorie.
    if (!contactName) return json({ ok: false, error: 'MISSING_CONTACT_NAME' }, 400);
    if (!isEmail(email)) return json({ ok: false, error: 'INVALID_EMAIL' }, 400);
    if (!privacyConsent) return json({ ok: false, error: 'PRIVACY_REQUIRED' }, 400);

    const payload = {
      business_name: businessName || 'Lead da Mini-Analisi',
      contact_name: contactName,
      email,
      phone: phone || null,
      sector: 'altro',
      service_interest: summary?.service ?? profile?.service ?? null,
      status: 'nuovo',
      priority: derivePriority(profile),
      source: 'altro',
      problem_detected: deriveProblems(answers),
      notes: buildNotes({ answers, profile, summary, message }),
      estimated_value: 0,
      archived: false,
    };

    const { error } = await supabaseAdmin.from('leads').insert(payload);
    if (error) {
      console.error('[mini-analisi] supabase insert error', error.message);
      return json({ ok: false, error: 'SAVE_ERROR' }, 500);
    }

    // Lead salvato nel CRM: invio della notifica amministrativa via Resend.
    // Best‑effort: se l'email fallisce, il lead resta salvato e la risposta è comunque ok.
    const emailSent = await sendMiniAnalisiNotification({
      contactName,
      email,
      phone,
      businessName,
      answers,
      profile,
      summary,
      priority: payload.priority,
      message,
    });

    return json({ ok: true, leadSaved: true, emailSent });
  } catch (err) {
    console.error('[mini-analisi] unexpected', err);
    return json({ ok: false, error: 'SERVER_ERROR' }, 500);
  }
};
