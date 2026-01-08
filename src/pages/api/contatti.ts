import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

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

export const GET: APIRoute = async () => {
  return json(200, { ok: true, route: "/api/contatti" });
};

export const POST: APIRoute = async ({ request }) => {
  // 1) Accetta SOLO JSON
  const ct = getContentType(request);
  if (!ct.includes("application/json")) {
    return json(415, { ok: false, error: "UNSUPPORTED_MEDIA_TYPE" });
  }

  // 2) Parse JSON robusto
  let data: any;
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: "INVALID_JSON" });
  }

  // 3) Honeypot anti-spam (campo "company")
  // Se valorizzato -> non inviare, ma rispondere 200 ok (graceful)
  const company = typeof data?.company === "string" ? data.company.trim() : "";
  if (company.length > 0) {
    return json(200, { ok: true, emailSent: false });
  }

  // 4) Campi richiesti
  const name = typeof data?.name === "string" ? data.name.trim() : "";
  const email = typeof data?.email === "string" ? data.email.trim() : "";
  const message = typeof data?.message === "string" ? data.message.trim() : "";
  const privacy = data?.privacy === true;

  // 5) Validazione
  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Nome non valido (min 2 caratteri).";
  if (!isEmail(email)) fields.email = "Email non valida.";
  if (message.length < 10) fields.message = "Messaggio troppo corto (min 10 caratteri).";
  if (!privacy) fields.privacy = "È necessario accettare la Privacy Policy.";

  if (Object.keys(fields).length > 0) {
    return json(400, { ok: false, error: "VALIDATION_ERROR", fields });
  }

  // 6) ENV (Resend + destinatari)
  const RESEND_API_KEY = env("RESEND_API_KEY");
  const CONTACT_TO_EMAIL = env("CONTACT_TO_EMAIL");
  const CONTACT_FROM_EMAIL = env("CONTACT_FROM_EMAIL") || "onboarding@resend.dev";
  const MAIL_SUBJECT_PREFIX = env("MAIL_SUBJECT_PREFIX") || "Nuovo contatto dal sito";

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    // NON loggare mai la key: solo booleani
    console.error("[contatti] SERVER_MISCONFIGURED missing env:", {
      hasResendKey: Boolean(RESEND_API_KEY),
      hasContactToEmail: Boolean(CONTACT_TO_EMAIL),
    });
    return json(500, { ok: false, error: "SERVER_MISCONFIGURED" });
  }

  // 7) Invio email via Resend HTTP API
  const resend = new Resend(RESEND_API_KEY);

  const subject = `${MAIL_SUBJECT_PREFIX} — ${name}`;
  const text =
    `Nuovo messaggio dal sito\n\n` +
    `Nome: ${name}\n` +
    `Email: ${email}\n\n` +
    `Messaggio:\n${message}\n`;

  try {
    const { data: sent, error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      replyTo: email, // Reply al cliente
      subject,
      text,
    });

    // 8) Resend può restituire error senza lanciare eccezione
    if (error) {
      console.error("[contatti] Resend error:", {
        name: error.name,
        message: error.message,
      });
      return json(200, {
        ok: true,
        emailSent: false,
        message:
          "Richiesta ricevuta. Se non ricevi risposta, riprova o contattaci via email.",
      });
    }

    return json(200, { ok: true, emailSent: true, id: sent?.id ?? null });
  } catch (err: any) {
    // 9) Fallback pulito: log server-side + risposta 200 “graceful”
    console.error("[contatti] Resend exception:", {
      name: err?.name,
      message: err?.message,
    });
    return json(200, {
      ok: true,
      emailSent: false,
      message:
        "Richiesta ricevuta. Se non ricevi risposta, riprova o contattaci via email.",
    });
  }
};