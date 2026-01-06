interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: any;
  query?: Record<string, string | string[]>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  end: () => void;
  setHeader: (name: string, value: string) => void;
}

// Rate limiting in-memory (semplice, senza dipendenze)
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto

function getClientIP(req: VercelRequest): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (req.headers['x-real-ip'] as string) ||
    'unknown'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

function getBody(req: VercelRequest): any {
  const b: any = (req as any).body;
  if (!b) return {};
  if (typeof b === 'string') {
    try {
      return JSON.parse(b);
    } catch {
      return {};
    }
  }
  return b;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.lswebagency.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'METHOD_NOT_ALLOWED' });
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ ok: false, error: 'RATE_LIMIT_EXCEEDED' });
  }

  // Parse body
  const data = getBody(req);

  // Honeypot anti-spam (campo "company")
  const company = typeof data?.company === 'string' ? data.company.trim() : '';
  if (company.length > 0) {
    return res.status(200).json({ ok: true, emailSent: false });
  }

  // Estrazione campi (il form invia: name, email, message, privacy, phone, service)
  const name = typeof data?.name === 'string' ? data.name.trim() : '';
  const email = typeof data?.email === 'string' ? data.email.trim() : '';
  const message = typeof data?.message === 'string' ? data.message.trim() : '';
  const privacy = data?.privacy === true;

  // Validazione
  const errors: Record<string, string> = {};
  if (name.length < 2) {
    errors.name = 'Nome non valido (min 2 caratteri).';
  }
  if (!isEmail(email)) {
    errors.email = 'Email non valida.';
  }
  if (message.length < 10) {
    errors.message = 'Messaggio troppo corto (min 10 caratteri).';
  }
  if (!privacy) {
    errors.privacy = 'È necessario accettare la Privacy Policy.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ok: false, error: 'VALIDATION_ERROR', fields: errors });
  }

  // ENV per Resend
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const MAIL_FROM = process.env.MAIL_FROM;
  const MAIL_TO = process.env.MAIL_TO;

  // Se Resend non è configurato, rispondi ok ma logga
  if (!RESEND_API_KEY || !MAIL_FROM || !MAIL_TO) {
    console.error('[contatti] SERVER_MISCONFIGURED missing env:', {
      hasResendKey: Boolean(RESEND_API_KEY),
      hasMailFrom: Boolean(MAIL_FROM),
      hasMailTo: Boolean(MAIL_TO),
    });
    return res.status(200).json({
      ok: true,
      emailSent: false,
      message: 'Richiesta ricevuta. Se non ricevi risposta, riprova o contattaci via email.',
    });
  }

  // Invio email via Resend HTTP API
  const subject = `Nuovo contatto dal sito — ${name}`;
  const text =
    `Nuovo messaggio dal sito\n\n` +
    `Nome: ${name}\n` +
    `Email: ${email}\n\n` +
    `Messaggio:\n${message}\n`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
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

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('[contatti] Resend HTTP error:', {
        status: response.status,
        error: errorText.slice(0, 300),
      });
      return res.status(200).json({
        ok: true,
        emailSent: false,
        message: 'Richiesta ricevuta. Se non ricevi risposta, riprova o contattaci via email.',
      });
    }

    const result = await response.json().catch(() => ({}));
    return res.status(200).json({ ok: true, emailSent: true, id: result?.id ?? null });
  } catch (err: any) {
    console.error('[contatti] Resend exception:', {
      name: err?.name,
      message: err?.message,
    });
    return res.status(200).json({
      ok: true,
      emailSent: false,
      message: 'Richiesta ricevuta. Se non ricevi risposta, riprova o contattaci via email.',
    });
  }
}
