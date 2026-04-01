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
      route: '/api/contact',
      message: 'Contact API endpoint. Use POST method to send a message.',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
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

    // Config SMTP (Hostinger / env)
    const smtpHost = import.meta.env.SMTP_HOST as string | undefined;
    const smtpPortRaw = import.meta.env.SMTP_PORT as string | undefined;
    const smtpSecureRaw = import.meta.env.SMTP_SECURE as string | undefined;
    const smtpUser = import.meta.env.SMTP_USER as string | undefined;
    const smtpPass = import.meta.env.SMTP_PASS as string | undefined;
    const contactToEnv = import.meta.env.CONTACT_TO as string | undefined;
    const contactFromName = import.meta.env.CONTACT_FROM_NAME as string | undefined;

    const smtpPort = smtpPortRaw ? Number.parseInt(String(smtpPortRaw), 10) : NaN;
    const secureStr = String(smtpSecureRaw ?? '').trim().toLowerCase();
    const smtpSecureConfigured =
      secureStr === 'true' || secureStr === '1' || secureStr === 'false' || secureStr === '0';
    const smtpSecure = secureStr === 'true' || secureStr === '1';

    const smtpConfigOk =
      Boolean(smtpHost?.trim()) &&
      !Number.isNaN(smtpPort) &&
      smtpSecureConfigured &&
      Boolean(smtpUser?.trim()) &&
      Boolean(smtpPass) &&
      Boolean(contactFromName?.trim());

    if (!smtpConfigOk) {
      console.error(
        '[contact] Variabili SMTP mancanti o non valide: SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, CONTACT_FROM_NAME',
      );
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

    const mailTo = contactToEnv?.trim() || smtpUser!;

    const transporter = nodemailer.createTransport({
      host: smtpHost!.trim(),
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser!.trim(),
        pass: smtpPass,
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
      from: `"${contactFromName!.trim()}" <${smtpUser!.trim()}>`,
      to: mailTo,
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
