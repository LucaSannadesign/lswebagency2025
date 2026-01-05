// src/pages/api/contatti.ts
import nodemailer from "nodemailer";

export const prerender = false;

// Helper robusto: funziona sia in locale (astro dev) sia su Vercel (process.env)
function env(key: string, fallback?: string): string | undefined {
  return (import.meta as any)?.env?.[key] ?? process.env[key] ?? fallback;
}

function isEmail(value: string): boolean {
  // Regex semplice ma affidabile per form contatti
  const re =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(value);
}

function hasHeaderInjection(value: string): boolean {
  return value.includes("\n") || value.includes("\r");
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  extraHeaders?: Record<string, string>
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(extraHeaders ?? {}),
    },
  });
}

export async function GET() {
  // Healthcheck (utile per test curl e per verificare in prod)
  return jsonResponse(200, { ok: true, route: "/api/contatti" });
}

export async function POST({ request }: { request: Request }) {
  // 1) Accetta SOLO JSON
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse(415, {
      ok: false,
      error: "Unsupported Media Type. Usa Content-Type: application/json",
    });
  }

  // 2) Parse JSON (fallback pulito)
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, error: "JSON non valido." });
  }

  // 3) Normalizza input
  const name = String(payload?.name ?? "").trim();
  const email = String(payload?.email ?? "").trim().toLowerCase();
  const message = String(payload?.message ?? "").trim();
  const privacy = payload?.privacy === true;

  // 4) Validazione richiesta
  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "name deve avere almeno 2 caratteri.";
  if (name.length > 120) errors.name = "name troppo lungo (max 120).";

  if (!isEmail(email)) errors.email = "email non valida.";
  if (email.length > 254) errors.email = "email troppo lunga (max 254).";

  if (message.length < 10) errors.message = "message deve avere almeno 10 caratteri.";
  if (message.length > 5000) errors.message = "message troppo lungo (max 5000).";

  if (privacy !== true) errors.privacy = "Devi accettare la privacy.";

  // Protezione base header injection (Reply-To, Subject, ecc.)
  if (hasHeaderInjection(name)) errors.name = "Valore non valido.";
  if (hasHeaderInjection(email)) errors.email = "Valore non valido.";

  if (Object.keys(errors).length > 0) {
    return jsonResponse(400, { ok: false, errors });
  }

  // 5) ENV SMTP (Hostinger) + mail routing
  const SMTP_HOST = env("SMTP_HOST");
  const SMTP_PORT = Number(env("SMTP_PORT", "465"));
  const SMTP_USER = env("SMTP_USER");
  const SMTP_PASS = env("SMTP_PASS");

  const MAIL_FROM = env("MAIL_FROM"); // es: "LS Web Agency <info@lswebagency.com>"
  const MAIL_TO = env("MAIL_TO");     // es: "info@lswebagency.com"
  const MAIL_SUBJECT_PREFIX = env("MAIL_SUBJECT_PREFIX", "Contatto sito");

  const missing = [
    !SMTP_HOST ? "SMTP_HOST" : null,
    !SMTP_USER ? "SMTP_USER" : null,
    !SMTP_PASS ? "SMTP_PASS" : null,
    !MAIL_FROM ? "MAIL_FROM" : null,
    !MAIL_TO ? "MAIL_TO" : null,
  ].filter(Boolean);

  if (missing.length) {
    // In prod meglio fallire chiaramente: la tua “soluzione definitiva” deve essere verificabile.
    console.error("[contatti] ENV mancanti:", missing);
    return jsonResponse(500, {
      ok: false,
      error: "Configurazione server incompleta (ENV mancanti).",
      missing,
    });
  }

  const secure = SMTP_PORT === 465; // 465 = SSL, 587 = STARTTLS

  // 6) Invio email (Nodemailer)
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST!,
    port: SMTP_PORT,
    secure,
    auth: { user: SMTP_USER!, pass: SMTP_PASS! },
    // Timeouts utili su serverless
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br/>");

  const subject = `${MAIL_SUBJECT_PREFIX}: ${name} <${email}>`;

  const mail = {
    from: MAIL_FROM!,
    to: MAIL_TO!,
    replyTo: `${name} <${email}>`,
    subject,
    text: `Nuovo messaggio dal sito\n\nNome: ${name}\nEmail: ${email}\n\nMessaggio:\n${message}\n`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
        <h2>Nuovo messaggio dal sito</h2>
        <p><strong>Nome:</strong> ${safeName}<br/>
           <strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Messaggio:</strong><br/>${safeMessage}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mail);

    return jsonResponse(200, {
      ok: true,
      emailSent: true,
      id: info.messageId ?? null,
    });
  } catch (err: any) {
    // 7) Fallback pulito: log completo server-side, risposta “graceful”
    console.error("[contatti] Invio email fallito:", {
      message: err?.message,
      code: err?.code,
      response: err?.response,
    });

    // Graceful: la richiesta è valida e ricevuta, ma invio non confermato
    return jsonResponse(200, {
      ok: true,
      emailSent: false,
      message: "Richiesta ricevuta. Se non ricevi risposta, riprova o contattaci via email.",
    });
  }
}// src/pages/api/contatti.ts
import nodemailer from "nodemailer";

export const prerender = false;

// Helper robusto: funziona sia in locale (astro dev) sia su Vercel (process.env)
function env(key: string, fallback?: string): string | undefined {
  return (import.meta as any)?.env?.[key] ?? process.env[key] ?? fallback;
}

function isEmail(value: string): boolean {
  // Regex semplice ma affidabile per form contatti
  const re =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(value);
}

function hasHeaderInjection(value: string): boolean {
  return value.includes("\n") || value.includes("\r");
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  extraHeaders?: Record<string, string>
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(extraHeaders ?? {}),
    },
  });
}

export async function GET() {
  // Healthcheck (utile per test curl e per verificare in prod)
  return jsonResponse(200, { ok: true, route: "/api/contatti" });
}

export async function POST({ request }: { request: Request }) {
  // 1) Accetta SOLO JSON
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonResponse(415, {
      ok: false,
      error: "Unsupported Media Type. Usa Content-Type: application/json",
    });
  }

  // 2) Parse JSON (fallback pulito)
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, error: "JSON non valido." });
  }

  // 3) Normalizza input
  const name = String(payload?.name ?? "").trim();
  const email = String(payload?.email ?? "").trim().toLowerCase();
  const message = String(payload?.message ?? "").trim();
  const privacy = payload?.privacy === true;

  // 4) Validazione richiesta
  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "name deve avere almeno 2 caratteri.";
  if (name.length > 120) errors.name = "name troppo lungo (max 120).";

  if (!isEmail(email)) errors.email = "email non valida.";
  if (email.length > 254) errors.email = "email troppo lunga (max 254).";

  if (message.length < 10) errors.message = "message deve avere almeno 10 caratteri.";
  if (message.length > 5000) errors.message = "message troppo lungo (max 5000).";

  if (privacy !== true) errors.privacy = "Devi accettare la privacy.";

  // Protezione base header injection (Reply-To, Subject, ecc.)
  if (hasHeaderInjection(name)) errors.name = "Valore non valido.";
  if (hasHeaderInjection(email)) errors.email = "Valore non valido.";

  if (Object.keys(errors).length > 0) {
    return jsonResponse(400, { ok: false, errors });
  }

  // 5) ENV SMTP (Hostinger) + mail routing
  const SMTP_HOST = env("SMTP_HOST");
  const SMTP_PORT = Number(env("SMTP_PORT", "465"));
  const SMTP_USER = env("SMTP_USER");
  const SMTP_PASS = env("SMTP_PASS");

  const MAIL_FROM = env("MAIL_FROM"); // es: "LS Web Agency <info@lswebagency.com>"
  const MAIL_TO = env("MAIL_TO");     // es: "info@lswebagency.com"
  const MAIL_SUBJECT_PREFIX = env("MAIL_SUBJECT_PREFIX", "Contatto sito");

  const missing = [
    !SMTP_HOST ? "SMTP_HOST" : null,
    !SMTP_USER ? "SMTP_USER" : null,
    !SMTP_PASS ? "SMTP_PASS" : null,
    !MAIL_FROM ? "MAIL_FROM" : null,
    !MAIL_TO ? "MAIL_TO" : null,
  ].filter(Boolean);

  if (missing.length) {
    // In prod meglio fallire chiaramente: la tua “soluzione definitiva” deve essere verificabile.
    console.error("[contatti] ENV mancanti:", missing);
    return jsonResponse(500, {
      ok: false,
      error: "Configurazione server incompleta (ENV mancanti).",
      missing,
    });
  }

  const secure = SMTP_PORT === 465; // 465 = SSL, 587 = STARTTLS

  // 6) Invio email (Nodemailer)
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST!,
    port: SMTP_PORT,
    secure,
    auth: { user: SMTP_USER!, pass: SMTP_PASS! },
    // Timeouts utili su serverless
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br/>");

  const subject = `${MAIL_SUBJECT_PREFIX}: ${name} <${email}>`;

  const mail = {
    from: MAIL_FROM!,
    to: MAIL_TO!,
    replyTo: `${name} <${email}>`,
    subject,
    text: `Nuovo messaggio dal sito\n\nNome: ${name}\nEmail: ${email}\n\nMessaggio:\n${message}\n`,
    html: `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5">
        <h2>Nuovo messaggio dal sito</h2>
        <p><strong>Nome:</strong> ${safeName}<br/>
           <strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Messaggio:</strong><br/>${safeMessage}</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mail);

    return jsonResponse(200, {
      ok: true,
      emailSent: true,
      id: info.messageId ?? null,
    });
  } catch (err: any) {
    // 7) Fallback pulito: log completo server-side, risposta “graceful”
    console.error("[contatti] Invio email fallito:", {
      message: err?.message,
      code: err?.code,
      response: err?.response,
    });

    // Graceful: la richiesta è valida e ricevuta, ma invio non confermato
    return jsonResponse(200, {
      ok: true,
      emailSent: false,
      message: "Richiesta ricevuta. Se non ricevi risposta, riprova o contattaci via email.",
    });
  }
}
