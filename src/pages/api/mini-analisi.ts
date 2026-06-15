// src/pages/api/mini-analisi.ts
// Riceve i dati finali della Mini‑Analisi Guidata e salva un lead nel CRM (tabella public.leads).
// La service role NON è mai esposta al client: l'insert avviene solo qui, lato server.
import type { APIRoute } from 'astro';
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

    return json({ ok: true });
  } catch (err) {
    console.error('[mini-analisi] unexpected', err);
    return json({ ok: false, error: 'SERVER_ERROR' }, 500);
  }
};
