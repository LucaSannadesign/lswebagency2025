// src/pages/api/contatti.ts
import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const prerender = false;

// Interfaccia per il body della richiesta
interface ContactRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  privacy?: boolean;
  privacyAccepted?: boolean;
  company?: string; // honeypot
}

// Rate limiting semplice in-memory (in produzione usare Redis/database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 ora
const RATE_LIMIT_MAX = 5; // max 5 invii per ora per IP

const isDev = import.meta.env.DEV;

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

// Parsing del body JSON (solo application/json supportato)
async function parseRequestBody(request: Request): Promise<ContactRequestBody> {
  const contentType = request.headers.get('content-type') || '';
  
  if (isDev) {
    console.log('[contatti] Content-Type ricevuto:', contentType);
  }

  // Verifica Content-Type: solo application/json
  if (!contentType.includes('application/json')) {
    if (isDev) {
      console.warn('[contatti] Content-Type non supportato:', contentType);
    }
    throw new Error('Content-Type deve essere application/json');
  }

  // Parse JSON body
  try {
    const body = await request.json();
    if (isDev) {
      console.log('[contatti] Body JSON parsato:', Object.keys(body));
    }
    return body;
  } catch (parseError) {
    if (isDev) {
      console.error('[contatti] Errore parsing JSON:', parseError);
    }
    throw new Error('Body JSON non valido');
  }
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
      if (isDev) {
        console.warn('[contatti] Rate limit exceeded per:', rateLimitKey);
      }
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

    // Parsing del body JSON
    let body: ContactRequestBody;
    try {
      body = await parseRequestBody(request);
    } catch (parseError: any) {
      if (isDev) {
        console.error('[contatti] Errore parsing body:', parseError.message);
      }
      return new Response(
        JSON.stringify({
          ok: false,
          message: parseError.message || 'Errore durante la lettura dei dati inviati.',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
        },
      );
    }

    if (isDev) {
      console.log('[contatti] Body ricevuto (keys):', Object.keys(body));
    }

    // Honeypot anti-spam (campo "company" nascosto nel form)
    if (body.company && typeof body.company === 'string' && body.company.trim() !== '') {
      if (isDev) {
        console.warn('[contatti] Honeypot triggered:', rateLimitKey);
      }
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
    const name = sanitizeString(String(body.name || '').trim());
    const email = sanitizeString(String(body.email || '').trim());
    const phone = sanitizeString(String(body.phone || '').trim());
    const service = sanitizeString(String(body.service || '').trim());
    const message = sanitizeString(String(body.message || '').trim());
    // Accetta sia privacy che privacyAccepted come boolean
    const privacyOk = body.privacy === true || body.privacyAccepted === true;

    if (isDev) {
      console.log('[contatti] Dati estratti:', {
        name: name.substring(0, 20) + '...',
        email: email.substring(0, 20) + '...',
        phone: phone || '—',
        service: service || '—',
        messageLength: message.length,
        privacyOk,
      });
    }

    // Validazione campi minimi
    if (!name || name.length < 2) {
      if (isDev) {
        console.warn('[contatti] Validazione fallita: nome troppo corto');
      }
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
      if (isDev) {
        console.warn('[contatti] Validazione fallita: email non valida', email);
      }
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
      if (isDev) {
        console.warn('[contatti] Validazione fallita: messaggio troppo corto', message.length);
      }
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

    if (!privacyOk) {
      if (isDev) {
        console.warn('[contatti] Validazione fallita: privacy non accettata');
      }
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
  } catch (err: any) {
    console.error('[contatti] Errore:', err);
    if (isDev) {
      console.error('[contatti] Stack trace:', err.stack);
    }
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

// Gestione metodi non supportati
export const ALL: APIRoute = async ({ request }) => {
  const method = request.method;
  if (method !== 'GET' && method !== 'POST') {
    return new Response(
      JSON.stringify({
        ok: false,
        message: `Metodo ${method} non supportato. Usa GET o POST.`,
      }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Allow': 'GET, POST',
        },
      },
    );
  }
  // Se è GET o POST, non dovremmo arrivare qui (gestiti da export specifici)
  return new Response(
    JSON.stringify({
      ok: false,
      message: 'Errore interno.',
    }),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    },
  );
};
