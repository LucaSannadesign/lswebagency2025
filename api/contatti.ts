import type { VercelRequest, VercelResponse } from '@vercel/node';

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

function json(res: VercelResponse, status: number, body: any) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(status).send(JSON.stringify(body));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // (Opzionale) CORS soft per sicurezza (non dà fastidio in same-origin)
  const origin = req.headers.origin as string | undefined;
  const allowed = new Set(['https://www.lswebagency.com', 'https://lswebagency.com']);
  if (origin && allowed.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    return json(res, 200, { ok: true, route: '/api/contatti' });
  }

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  const ct = (req.headers['content-type'] || '').toString().toLowerCase();
  if (!ct.includes('application/json')) {
    return json(res, 415, { ok: false, error: 'UNSUPPORTED_MEDIA_TYPE' });
  }

  // Vercel di solito parse-a già il body JSON, ma gestiamo entrambi i casi
  let data: any = req.body;
  if (!data || typeof data === 'string') {
    try {
      data = data ? JSON.parse(data) : {};
    } catch {
      return json(res, 400, { ok: false, error: 'INVALID_JSON' });
    }
  }

  // Honeypot anti-spam (accetta "company" o "azienda")
  const company =
    (typeof data?.company === 'string' ? data.company.trim() : '') ||
    (typeof data?.azienda === 'string' ? data.azienda.trim() : '');
  if (company.length > 0) {
    return json(res, 200, { ok: true, emailSent: false });
  }

  // Accetta sia name/message che nome/messaggio (così i test curl non impazziscono)
  const name =
    (typeof data?.name === 'string' ? data.name.trim() : '') ||
    (typeof data?.nome === 'string' ? data.nome.trim() : '');
  const email = typeof data?.email === 'string' ? data.email.trim() : '';
  const message =
    (typeof data?.message === 'string' ? data.message.trim() : '') ||
    (typeof data?.messaggio === 'string' ? data.messaggio.trim() : '');

  // privacy opzionale: se presente deve essere true
  const privacy =
    data?.privacy === undefined || data?.privacy === null ? true : data?.privacy === true;

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = 'Nome non valido (min 2 caratteri).';
  if (!isEmail(email)) fields.email = 'Email non valida.';
  if (message.length < 10) fields.message = 'Messaggio troppo corto (min 10 caratteri).';
  if (!privacy) fields.privacy = 'È necessario accettare la Privacy Policy.';

  if (Object.keys(fields).length > 0) {
    return json(res, 400, { ok: false, error: 'VALIDATION_ERROR', fields });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const MAIL_FROM = process.env.MAIL_FROM;
  const MAIL_TO = process.env.MAIL_TO;
  const MAIL_SUBJECT_PREFIX = process.env.MAIL_SUBJECT_PREFIX || 'Nuovo contatto dal sito';

  if (!RESEND_API_KEY || !MAIL_FROM || !MAIL_TO) {
    console.error('[contatti] Missing env:', {
      hasResendKey: Boolean(RESEND_API_KEY),
      hasMailFrom: Boolean(MAIL_FROM),
      hasMailTo: Boolean(MAIL_TO),
    });
    return json(res, 500, { ok: false, error: 'SERVER_MISCONFIGURED' });
  }

  const subject = `${MAIL_SUBJECT_PREFIX} — ${name}`;
  const text =
    `Nuovo messaggio dal sito\n\n` +
    `Nome: ${name}\n` +
    `Email: ${email}\n\n` +
    `Messaggio:\n${message}\n`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [MAIL_TO],
        reply_to: email,
        subject,
        text,
      }),
    });

    const out = await r.json().catch(() => ({}));

    if (!r.ok) {
      console.error('[contatti] Resend error:', out);
      return json(res, 200, {
        ok: true,
        emailSent: false,
        message: 'Richiesta ricevuta. Se non ricevi risposta, riprova o contattaci via email.',
      });
    }

    return json(res, 200, { ok: true, emailSent: true, id: out?.id ?? null });
  } catch (err: any) {
    console.error('[contatti] Resend exception:', { name: err?.name, message: err?.message });
    return json(res, 200, {
      ok: true,
      emailSent: false,
      message: 'Richiesta ricevuta. Se non ricevi risposta, riprova o contattaci via email.',
    });
  }
}
