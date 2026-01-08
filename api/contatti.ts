import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCors(res: VercelResponse, allowedOrigin?: string) {
  const origin = allowedOrigin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ENV: leggi variabili d'ambiente
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
  const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';
  const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

  // CORS setup
  setCors(res, ALLOWED_ORIGIN);

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // GET = health/info
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, route: '/api/contatti' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  // --- ENV check (required)
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('[contatti] SERVER_MISCONFIGURED missing env:', {
      hasResendKey: Boolean(RESEND_API_KEY),
      hasContactToEmail: Boolean(CONTACT_TO_EMAIL),
    });
    return res.status(500).json({
      ok: false,
      error: 'SERVER_MISCONFIGURED',
    });
  }

  // --- Body parse
  let body: any = req.body;
  try {
    if (typeof body === 'string') {
      body = JSON.parse(body);
    }
  } catch {
    return res.status(400).json({ ok: false, error: 'INVALID_JSON' });
  }

  // --- Estrazione campi (italiano)
  const nome = String(body?.nome ?? '').trim();
  const email = String(body?.email ?? '').trim();
  const messaggio = String(body?.messaggio ?? '').trim();
  const privacy = body?.privacy === true;
  const company = String(body?.company ?? '').trim(); // honeypot

  // --- Honeypot check (se company non vuoto => spam)
  if (company.length > 0) {
    return res.status(200).json({
      ok: true,
      emailSent: false,
      spam: true,
    });
  }

  // --- Validazione campi
  if (nome.length < 2) {
    return res.status(400).json({ ok: false, error: 'NAME_REQUIRED' });
  }

  if (!email || email.length === 0) {
    return res.status(400).json({ ok: false, error: 'EMAIL_REQUIRED' });
  }

  if (!isEmail(email)) {
    return res.status(400).json({ ok: false, error: 'INVALID_EMAIL' });
  }

  if (messaggio.length < 10) {
    return res.status(400).json({ ok: false, error: 'MESSAGE_REQUIRED' });
  }

  if (!privacy) {
    return res.status(400).json({ ok: false, error: 'PRIVACY_REQUIRED' });
  }

  // --- Email content
  const subject = `Nuovo contatto dal sito: ${nome}`;
  const text = [
    `Nuovo contatto dal sito`,
    ``,
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
    <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;line-height:1.5;max-width:600px;margin:0 auto;padding:20px">
      <h2 style="color:#1a1a1a;margin-bottom:20px">Nuovo contatto dal sito</h2>
      <p><strong>Nome:</strong> ${escapeHtml(nome)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:20px 0"/>
      <p><strong>Messaggio:</strong></p>
      <pre style="white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px;border:1px solid #e5e5e5">${escapeHtml(messaggio)}</pre>
      <p style="color:#666;font-size:12px;margin-top:20px">Inviato da /api/contatti – ${new Date().toISOString()}</p>
    </div>
  `;

  // --- Invio email via Resend
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      console.error('[contatti] Resend API error:', {
        status: resp.status,
        error: data,
      });
      return res.status(502).json({
        ok: false,
        error: 'EMAIL_PROVIDER_ERROR',
      });
    }

    return res.status(200).json({
      ok: true,
      emailSent: true,
      provider: 'resend',
      id: data?.id ?? null,
    });
  } catch (err: any) {
    console.error('[contatti] Unexpected error:', {
      name: err?.name,
      message: err?.message,
    });
    return res.status(502).json({
      ok: false,
      error: 'EMAIL_PROVIDER_ERROR',
    });
  }
}
