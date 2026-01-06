import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  // Se vuoi limitare l'origine, sostituisci "*" con "https://www.lswebagency.com"
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  // Preflight CORS
  if (req.method === 'OPTIONS') return res.status(204).end();

  // GET = health/info (utile per curl)
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, route: '/api/contatti' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  // --- ENV check
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const MAIL_TO = process.env.MAIL_TO;
  const MAIL_FROM = process.env.MAIL_FROM;

  if (!RESEND_API_KEY || !MAIL_TO || !MAIL_FROM) {
    return res.status(500).json({
      ok: false,
      error: 'SERVER_MISCONFIGURED',
      missing: {
        RESEND_API_KEY: !RESEND_API_KEY,
        MAIL_TO: !MAIL_TO,
        MAIL_FROM: !MAIL_FROM,
      },
    });
  }

  // --- Body parse (Vercel di solito lo fa già; qui gestiamo anche stringa raw)
  let body: any = req.body;
  try {
    if (typeof body === 'string') body = JSON.parse(body);
  } catch {
    return res.status(400).json({ ok: false, error: 'INVALID_JSON' });
  }

  const nome = String(body?.nome ?? '').trim();
  const email = String(body?.email ?? '').trim();
  const messaggio = String(body?.messaggio ?? '').trim();
  const privacy = Boolean(body?.privacy);
  // Honeypot: se valorizzato -> bot
  const company = String(body?.company ?? '').trim();

  if (company) {
    return res.status(200).json({ ok: true, spam: true }); // “soft-success”
  }

  if (!privacy) {
    return res.status(400).json({ ok: false, error: 'PRIVACY_REQUIRED' });
  }

  if (nome.length < 2) {
    return res.status(400).json({ ok: false, error: 'NAME_REQUIRED' });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ ok: false, error: 'EMAIL_INVALID' });
  }

  if (messaggio.length < 10) {
    return res.status(400).json({ ok: false, error: 'MESSAGE_TOO_SHORT' });
  }

  // --- Email content
  const subject = `Nuovo contatto dal sito: ${nome}`;
  const text = [
    `Nome: ${nome}`,
    `Email: ${email}`,
    ``,
    `Messaggio:`,
    `${messaggio}`,
    ``,
    `--`,
    `Inviato da /api/contatti (${new Date().toISOString()})`,
  ].join('\n');

  const html = `
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5">
      <h2>Nuovo contatto dal sito</h2>
      <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <hr/>
      <p><strong>Messaggio:</strong></p>
      <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px">${escapeHtml(
        messaggio
      )}</pre>
      <p style="color:#666;font-size:12px">Inviato da /api/contatti – ${new Date().toISOString()}</p>
    </div>
  `;

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [MAIL_TO],
        reply_to: email, // così rispondi direttamente all’utente
        subject,
        text,
        html,
      }),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      // utile per capire subito se è un problema di FROM domain / key / policy
      return res.status(502).json({
        ok: false,
        error: 'EMAIL_PROVIDER_ERROR',
        status: resp.status,
        details: data,
      });
    }

    return res.status(200).json({
      ok: true,
      emailSent: true,
      provider: 'resend',
      id: data?.id ?? null,
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: 'UNEXPECTED_ERROR',
      message: err?.message ?? String(err),
    });
  }
}

function escapeHtml(input: string) {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}