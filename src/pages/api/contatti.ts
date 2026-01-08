import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const BUILD_FINGERPRINT = "contatti-v3-2026-01-08-1047";

/**
 * Legge variabili d'ambiente sia in locale (Astro) sia su Vercel (process.env)
 */
function env(key: string): string | undefined {
  return (import.meta as any)?.env?.[key] ?? process.env[key];
}

function isEmail(value: string): boolean {
  // Regex base, affidabile per form contatti (non “perfetta” RFC, ma pratica)
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function getContentType(req: Request): string {
  return (req.headers.get("content-type") || "").toLowerCase();
}

/**
 * Analizza l'errore Resend e restituisce un codice diagnostico specifico
 */
function diagnoseResendError(error: any): string {
  const message = String(error?.message || "");
  const name = String(error?.name || "");
  const combined = `${message} ${name}`;

  // Unauthorized/Forbidden/API Key issues
  if (/unauthorized|forbidden|api key/i.test(combined)) {
    return "RESEND_UNAUTHORIZED";
  }

  // From domain/sender verification issues
  if (/from.*verif|domain.*verif|sender.*verif/i.test(combined)) {
    return "FROM_NOT_VERIFIED";
  }

  // To/recipient validation issues
  if (/to.*invalid|recipient|address/i.test(combined)) {
    return "TO_INVALID";
  }

  // Rate limiting
  if (/rate limit|429/i.test(combined)) {
    return "RESEND_RATE_LIMIT";
  }

  // Fallback
  return "EMAIL_PROVIDER_ERROR";
}

export const GET: APIRoute = async () => {
  return json(200, { ok: true, route: "/api/contatti", build: BUILD_FINGERPRINT });
};

export const POST: APIRoute = async ({ request }) => {
  // 1) Accetta SOLO JSON
  const ct = getContentType(request);
  if (!ct.includes("application/json")) {
    return json(415, { ok: false, error: "UNSUPPORTED_MEDIA_TYPE", build: BUILD_FINGERPRINT });
  }

  // 2) Parse JSON robusto
  let data: any;
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: "INVALID_JSON", build: BUILD_FINGERPRINT });
  }

  // 3) Honeypot anti-spam (campo "company")
  // Se valorizzato -> non inviare, ma rispondere 200 ok (graceful)
  const company = typeof data?.company === "string" ? data.company.trim() : "";
  if (company.length > 0) {
    return json(200, { ok: true, emailSent: false, build: BUILD_FINGERPRINT });
  }

  // 4) Normalizzazione input (supporta sinonimi: name/nome, message/messaggio/body)
  const nameRaw = data?.name ?? data?.nome ?? "";
  const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
  const email = typeof data?.email === "string" ? data.email.trim() : "";
  const messageRaw = data?.message ?? data?.messaggio ?? data?.body ?? "";
  const message = typeof messageRaw === "string" ? messageRaw.trim() : "";
  const privacy = data?.privacy === true;

  // 5) Validazione
  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Nome non valido (min 2 caratteri).";
  if (!isEmail(email)) fields.email = "Email non valida.";
  if (message.length < 10) fields.message = "Messaggio troppo corto (min 10 caratteri).";
  if (!privacy) fields.privacy = "È necessario accettare la Privacy Policy.";

  if (Object.keys(fields).length > 0) {
    return json(400, { ok: false, error: "VALIDATION_ERROR", fields, build: BUILD_FINGERPRINT });
  }

  // 6) Normalizzazione ENV (supporta CONTACT_* e fallback MAIL_* per retrocompatibilità)
  const RESEND_API_KEY = env("RESEND_API_KEY");
  const TO = env("CONTACT_TO_EMAIL") || env("MAIL_TO");
  const FROM = env("CONTACT_FROM_EMAIL") || env("MAIL_FROM") || "onboarding@resend.dev";
  const MAIL_SUBJECT_PREFIX = env("MAIL_SUBJECT_PREFIX") || "Nuovo contatto dal sito";

  if (!RESEND_API_KEY || !TO) {
    // NON loggare mai la key: solo booleani
    console.error("[contatti] SERVER_MISCONFIGURED missing env:", {
      hasResendKey: Boolean(RESEND_API_KEY),
      hasToEmail: Boolean(TO),
    });
    return json(500, { ok: false, error: "SERVER_MISCONFIGURED", build: BUILD_FINGERPRINT });
  }

  // 7) Invio email via Resend
  const resend = new Resend(RESEND_API_KEY);

  const subject = `${MAIL_SUBJECT_PREFIX} — ${name}`;
  const text =
    `Nuovo messaggio dal sito\n\n` +
    `Nome: ${name}\n` +
    `Email: ${email}\n\n` +
    `Messaggio:\n${message}\n`;

  try {
    const { data: sent, error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject,
      text,
    });

    // 8) Resend può restituire error senza lanciare eccezione
    if (error) {
      const errorCode = diagnoseResendError(error);
      const errorMessage = String(error?.message || "").slice(0, 200);
      console.error("[contatti] Resend error:", {
        code: errorCode,
        name: error?.name,
        message: errorMessage,
      });
      return json(502, { ok: false, error: errorCode, build: BUILD_FINGERPRINT });
    }

    return json(200, { ok: true, emailSent: true, provider: "resend", id: sent?.id ?? null, build: BUILD_FINGERPRINT });
  } catch (err: any) {
    // 9) Error handling: diagnostica dettagliata e return 502
    const errorCode = diagnoseResendError(err);
    const errorMessage = String(err?.message || "").slice(0, 200);
    console.error("[contatti] Resend exception:", {
      code: errorCode,
      name: err?.name,
      message: errorMessage,
    });
    return json(502, { ok: false, error: errorCode, build: BUILD_FINGERPRINT });
  }
};