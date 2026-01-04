// src/pages/api/contatti.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

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

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      route: '/api/contatti',
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
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
      );
    }

    // Verifica Content-Type
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Content-Type deve essere application/json',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
      );
    }

    // Parse JSON body
    let body: any;
    try {
      body = await request.json();
    } catch (parseError) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Body JSON non valido',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
      );
    }

    // Honeypot anti-spam (campo "company" nascosto nel form)
    if (body.company && typeof body.company === 'string' && body.company.trim() !== '') {
      console.warn('[contatti] Honeypot triggered:', rateLimitKey);
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Spam rilevato.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
      );
    }

    // Estrazione e sanitizzazione dati
    const name = sanitizeString((body.name || '').toString());
    const email = sanitizeString((body.email || '').toString());
    const phone = sanitizeString((body.phone || '').toString());
    const service = sanitizeString((body.service || '').toString());
    const message = sanitizeString((body.message || '').toString());
    const privacy = body.privacy;

    // Validazione
    if (!name || name.length < 2) {
      return new Response(
        JSON.stringify({
          ok: false,
          message: 'Il nome deve contenere almeno 2 caratteri.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
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
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
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
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
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
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
      );
    }

    // Log dati ricevuti (sempre)
    console.log('[contatti] Nuovo contatto ricevuto:', {
      name,
      email,
      phone: phone || '—',
      service: service || '—',
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    // Try email providers (priorità: Gmail → Resend → Brevo → fallback log)
    const gmailUser = import.meta.env.GMAIL_USER;
    const gmailPass = import.meta.env.GMAIL_APP_PASS;
    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const brevoApiKey = import.meta.env.BREVO_API_KEY;

    let emailSent = false;

    // Try Gmail (Nodemailer)
    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPass,
          },
        });

        await transporter.sendMail({
          from: `"LS Web Agency" <${gmailUser}>`,
          to: gmailUser,
          replyTo: email,
          subject: `Nuovo contatto dal sito — ${name}`,
          html: `
            <h2>Nuova richiesta di contatto</h2>
            <p><strong>Nome:</strong> ${name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            <p><strong>Email:</strong> ${email.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            <p><strong>Telefono:</strong> ${phone ? phone.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '—'}</p>
            <p><strong>Servizio:</strong> ${service ? service.replace(/</g, '&lt;').replace(/>/g, '&gt;') : '—'}</p>
            <p><strong>Messaggio:</strong></p>
            <p>${message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</p>
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

        emailSent = true;
        console.log('[contatti] Email inviata via Gmail');
      } catch (emailError) {
        console.error('[contatti] Errore invio email Gmail:', emailError);
      }
    }

    // Try Resend
    if (!emailSent && resendApiKey) {
      try {
        const resend = await import('resend');
        const resendClient = new resend.Resend(resendApiKey);

        await resendClient.emails.send({
          from: 'LS Web Agency <onboarding@resend.dev>', // Sostituisci con dominio verificato
          to: gmailUser || 'info@lswebagency.com',
          replyTo: email,
          subject: `Nuovo contatto dal sito — ${name}`,
          html: `
            <h2>Nuova richiesta di contatto</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefono:</strong> ${phone || '—'}</p>
            <p><strong>Servizio:</strong> ${service || '—'}</p>
            <p><strong>Messaggio:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });

        emailSent = true;
        console.log('[contatti] Email inviata via Resend');
      } catch (emailError) {
        console.error('[contatti] Errore invio email Resend:', emailError);
      }
    }

    // Try Brevo
    if (!emailSent && brevoApiKey) {
      try {
        const brevo = await import('@getbrevo/brevo');
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(brevo.ApiKeyEnum.apiKey, brevoApiKey);

        await apiInstance.sendTransacEmail({
          sender: { name: 'LS Web Agency', email: 'info@lswebagency.com' },
          to: [{ email: gmailUser || 'info@lswebagency.com' }],
          replyTo: { email },
          subject: `Nuovo contatto dal sito — ${name}`,
          htmlContent: `
            <h2>Nuova richiesta di contatto</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefono:</strong> ${phone || '—'}</p>
            <p><strong>Servizio:</strong> ${service || '—'}</p>
            <p><strong>Messaggio:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        });

        emailSent = true;
        console.log('[contatti] Email inviata via Brevo');
      } catch (emailError) {
        console.error('[contatti] Errore invio email Brevo:', emailError);
      }
    }

    // Fallback: solo log (se nessun provider disponibile)
    if (!emailSent) {
      console.log('[contatti] Nessun provider email configurato, dati loggati su console');
    }

    // Risposta di successo (sempre 200, anche se email non inviata)
    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Messaggio inviato con successo.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    );
  } catch (err) {
    console.error('[contatti] Errore:', err);
    return new Response(
      JSON.stringify({
        ok: false,
        message: "Errore durante l'invio. Riprova più tardi.",
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    );
  }
};

