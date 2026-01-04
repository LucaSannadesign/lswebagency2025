// src/pages/api/contact.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

// Questa route deve restare solo server-side
export const prerender = false;

// Rate limiting semplice in-memory (in produzione usare Redis/database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 ora
const RATE_LIMIT_MAX = 5; // max 5 invii per ora per IP

function getRateLimitKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// Sanitizzazione base
function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, '') // Rimuove < e >
    .slice(0, 1000); // Limita lunghezza
}

function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// User agent sospetti
const SUSPICIOUS_UA = [
  'curl',
  'wget',
  'python',
  'java',
  'go-http',
  'scrapy',
  'bot',
  'crawler',
  'spider',
];

function isSuspiciousUA(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return SUSPICIOUS_UA.some(suspicious => ua.includes(suspicious));
}

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      message: 'Contact API endpoint. Use POST method to send a message.',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (!checkRateLimit(rateLimitKey)) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Troppi tentativi. Riprova più tardi.',
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // User agent check
    const userAgent = request.headers.get('user-agent') || '';
    if (isSuspiciousUA(userAgent)) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Request non valida.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const data = await request.formData();

    // Honeypot anti-spam (campo "company" nascosto nel form)
    const honeypot = data.get('company');
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
      console.warn('[contact] Honeypot triggered:', rateLimitKey);
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Spam rilevato.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Estrazione e sanitizzazione dati
    const name = sanitizeString((data.get('name') || '').toString());
    const email = sanitizeString((data.get('email') || '').toString());
    const phone = sanitizeString((data.get('phone') || '').toString());
    const service = sanitizeString((data.get('service') || '').toString());
    const message = sanitizeString((data.get('message') || '').toString());
    const privacy = data.get('privacy');

    // Validazione
    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Il nome deve contenere almeno 2 caratteri.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (!email || !validateEmail(email)) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Inserisci un indirizzo email valido.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (!message || message.length < 10) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Il messaggio deve contenere almeno 10 caratteri.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (!privacy) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Devi accettare la privacy policy.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Config email (Gmail o fallback)
    const gmailUser = import.meta.env.GMAIL_USER;
    const gmailPass = import.meta.env.GMAIL_APP_PASS;

    if (!gmailUser || !gmailPass) {
      console.error('[contact] GMAIL_USER / GMAIL_APP_PASS mancanti');
      // In sviluppo, logga invece di fallire
      if (import.meta.env.DEV) {
        console.log('[contact] Dev mode - Email would be sent:', {
          name,
          email,
          phone,
          service,
          message,
        });
        return new Response(
          JSON.stringify({
            ok: true,
            message: 'Messaggio inviato con successo.',
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }

      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Configurazione email non valida. Contatta l\'amministratore.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Config SMTP (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    // Escape HTML per sicurezza
    const escapeHtml = (text: string) => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      };
      return text.replace(/[&<>"']/g, m => map[m]);
    };

    await transporter.sendMail({
      from: `"LS Web Agency" <${gmailUser}>`,
      to: gmailUser,
      replyTo: email,
      subject: `Nuovo contatto dal sito — ${escapeHtml(name)}`,
      html: `
        <h2>Nuova richiesta di contatto</h2>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Telefono:</strong> ${phone ? escapeHtml(phone) : '—'}</p>
        <p><strong>Servizio:</strong> ${service ? escapeHtml(service) : '—'}</p>
        <p><strong>Messaggio:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
      text: `
Nuova richiesta di contatto

Nome: ${name}
Email: ${email}
Telefono: ${phone || '—'}
Servizio: ${service || '—'}

Messaggio:
${message}
      `,
    });

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Messaggio inviato con successo.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (err) {
    console.error('[contact] Errore invio email:', err);
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Errore durante l'invio. Riprova più tardi.",
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
