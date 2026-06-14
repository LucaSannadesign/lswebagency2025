import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const BUILD_FINGERPRINT = "contatti-v4-test-deploy";

/** Rate limit in-memory per IP (vedi limiti su deploy serverless) */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const cf = request.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  return "unknown";
}

function checkRateLimit(ipKey: string): boolean {
  const now = Date.now();
  const key = ipKey || "unknown";
  const record = rateLimitMap.get(key);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

/**
 * Legge variabili d'ambiente sia in locale (Astro) sia su Vercel (process.env)
 */
function env(key: string): string | undefined {
  const values: Record<string, string | undefined> = {
    RESEND_API_KEY: import.meta.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: import.meta.env.CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL: import.meta.env.CONTACT_FROM_EMAIL,
    MAIL_TO: import.meta.env.MAIL_TO,
    MAIL_FROM: import.meta.env.MAIL_FROM,
    MAIL_SUBJECT_PREFIX: import.meta.env.MAIL_SUBJECT_PREFIX,
    VERCEL_ENV: import.meta.env.VERCEL_ENV,
    CONTACT_ALLOW_EMAIL_IN_PREVIEW: import.meta.env.CONTACT_ALLOW_EMAIL_IN_PREVIEW,
  };

  return values[key];
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

const GENERIC_BACKEND_MESSAGE =
  "Servizio temporaneamente non disponibile. Riprova più tardi.";

function maskEmailForLog(value: string): string {
  const trimmed = value.trim();
  const at = trimmed.indexOf("@");
  if (at <= 0 || at >= trimmed.length - 1) return "[redacted]";
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const show = local.slice(0, 2);
  return `${show}***@${domain}`;
}

function payloadSummaryForLog(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return { shape: Array.isArray(data) ? "array" : typeof data };
  }
  const o = data as Record<string, unknown>;
  const nameRaw = o.name ?? o.nome;
  const name = typeof nameRaw === "string" ? nameRaw : "";
  const email = typeof o.email === "string" ? o.email : "";
  const msgRaw = o.message ?? o.messaggio ?? o.body;
  const msg = typeof msgRaw === "string" ? msgRaw : "";
  return {
    keys: Object.keys(o),
    nameLen: name.length,
    emailMasked: email ? maskEmailForLog(email) : "absent",
    messageLen: msg.length,
    privacy: o.privacy === true,
    companyFilled:
      typeof o.company === "string" && o.company.trim().length > 0,
  };
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
  try {
    console.log("[contatti] POST ingresso", {
      contentType: getContentType(request),
      ip: getClientIp(request),
    });

    // 1) Accetta SOLO JSON
    const ct = getContentType(request);
    if (!ct.includes("application/json")) {
      console.warn("[contatti] rifiutato: content-type non JSON");
      return json(415, {
        ok: false,
        error: "UNSUPPORTED_MEDIA_TYPE",
        build: BUILD_FINGERPRINT,
      });
    }

    // 2) Parse JSON robusto
    let data: any;
    try {
      data = await request.json();
    } catch {
      console.warn("[contatti] parse JSON fallito");
      return json(400, { ok: false, error: "INVALID_JSON", build: BUILD_FINGERPRINT });
    }

    console.log("[contatti] payload (riepilogo non sensibile)", payloadSummaryForLog(data));

    // 3) Honeypot anti-spam (campo "company")
    // Se valorizzato -> non inviare, ma rispondere 200 ok (graceful)
    const company = typeof data?.company === "string" ? data.company.trim() : "";
    if (company.length > 0) {
      console.warn("[contatti] honeypot attivato, nessun invio");
      return json(200, { ok: true, emailSent: false, build: BUILD_FINGERPRINT });
    }

    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp)) {
      console.warn("[contatti] rate limit superato", { ip: clientIp });
      return json(429, {
        ok: false,
        error: "RATE_LIMIT_EXCEEDED",
        message: "Troppi invii da questo indirizzo. Riprova tra qualche minuto.",
        build: BUILD_FINGERPRINT,
      });
    }

    // 4) Normalizzazione input (supporta sinonimi: name/nome, message/messaggio/body)
    const nameRaw = data?.name ?? data?.nome ?? "";
    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
    const email = typeof data?.email === "string" ? data.email.trim() : "";
    const messageRaw = data?.message ?? data?.messaggio ?? data?.body ?? "";
    const message = typeof messageRaw === "string" ? messageRaw.trim() : "";
    const privacy = data?.privacy === true;
    const phone = typeof data?.phone === "string" ? data.phone.trim().slice(0, 80) : "";
    const service = typeof data?.service === "string" ? data.service.trim().slice(0, 400) : "";
    const requestedServizioSlug =
      typeof data?.requestedServizioSlug === "string" ? data.requestedServizioSlug.trim().slice(0, 120) : "";
    const requestedPacchettoSlug =
      typeof data?.requestedPacchettoSlug === "string" ? data.requestedPacchettoSlug.trim().slice(0, 120) : "";
    const requestedServizioLabel =
      typeof data?.requestedServizioLabel === "string" ? data.requestedServizioLabel.trim().slice(0, 200) : "";
    const requestedPacchettoLabel =
      typeof data?.requestedPacchettoLabel === "string" ? data.requestedPacchettoLabel.trim().slice(0, 200) : "";

    // 5) Validazione
    const fields: Record<string, string> = {};
    if (name.length < 2) fields.name = "Nome non valido (min 2 caratteri).";
    if (!isEmail(email)) fields.email = "Email non valida.";
    if (message.length < 10) fields.message = "Messaggio troppo corto (min 10 caratteri).";
    if (!privacy) fields.privacy = "È necessario accettare la Privacy Policy.";

    if (Object.keys(fields).length > 0) {
      console.warn("[contatti] validazione fallita", { fieldKeys: Object.keys(fields) });
      return json(400, { ok: false, error: "VALIDATION_ERROR", fields, build: BUILD_FINGERPRINT });
    }

    // Preview Vercel: niente invio reale senza consenso esplicito (production invariata)
    if (env("VERCEL_ENV") === "preview" && env("CONTACT_ALLOW_EMAIL_IN_PREVIEW") !== "true") {
      console.warn("[contatti] preview: invio email disabilitato senza CONTACT_ALLOW_EMAIL_IN_PREVIEW");
      return json(403, {
        ok: false,
        error: "PREVIEW_EMAIL_DISABLED",
        message:
          "Invio email disabilitato in preview. Imposta CONTACT_ALLOW_EMAIL_IN_PREVIEW=true se necessario.",
        build: BUILD_FINGERPRINT,
      });
    }

    // 6) Normalizzazione ENV (supporta CONTACT_* e fallback MAIL_* per retrocompatibilità)
    const RESEND_API_KEY = env("RESEND_API_KEY");
    const TO = env("CONTACT_TO_EMAIL") || env("MAIL_TO");
    const FROM = env("CONTACT_FROM_EMAIL") || env("MAIL_FROM") || "onboarding@resend.dev";
    const MAIL_SUBJECT_PREFIX = env("MAIL_SUBJECT_PREFIX") || "Nuovo contatto dal sito";

    console.log("[contatti] env richieste (presenza, mai valori segreti)", {
      hasResendKey: Boolean(RESEND_API_KEY),
      hasToEmail: Boolean(TO),
      hasFromExplicit: Boolean(env("CONTACT_FROM_EMAIL") || env("MAIL_FROM")),
      fromUsesDefault: FROM === "onboarding@resend.dev",
      vercelEnv: env("VERCEL_ENV") ?? "(unset)",
    });

    if (!RESEND_API_KEY || !TO) {
      console.error("[contatti] SERVER_MISCONFIGURED missing env:", {
        hasResendKey: Boolean(RESEND_API_KEY),
        hasToEmail: Boolean(TO),
      });
      return json(500, {
        ok: false,
        error: "SERVER_MISCONFIGURED",
        message: GENERIC_BACKEND_MESSAGE,
        build: BUILD_FINGERPRINT,
      });
    }

    // 7) Invio email via Resend
    const resend = new Resend(RESEND_API_KEY);

    const subject = `${MAIL_SUBJECT_PREFIX} — ${name}`;
    const textLines = [
      "Nuovo messaggio dal sito",
      "",
      `Nome: ${name}`,
      `Email: ${email}`,
      `Telefono: ${phone || "—"}`,
      `Servizio (form): ${service || "—"}`,
    ];
    if (requestedServizioSlug || requestedServizioLabel) {
      textLines.push(`Servizio richiesto (CTA): ${requestedServizioLabel || requestedServizioSlug}`);
    } else {
      textLines.push("Servizio richiesto (CTA): —");
    }
    if (requestedPacchettoSlug || requestedPacchettoLabel) {
      textLines.push(`Pacchetto richiesto (CTA): ${requestedPacchettoLabel || requestedPacchettoSlug}`);
    } else {
      textLines.push("Pacchetto richiesto (CTA): —");
    }
    textLines.push("", "Messaggio:", message);
    const text = textLines.join("\n");

    console.log("[contatti] pre-resend: chiamata provider", {
      subjectLen: subject.length,
      textLen: text.length,
      toDomain: TO.includes("@") ? TO.split("@").pop() : "(n/a)",
    });

    try {
      // TEMP test: usare mittente Resend di default per isolare problemi di dominio mittente
      const { data: sent, error } = await resend.emails.send({
        from: FROM,
        to: [TO],
        replyTo: email,
        subject,
        text,
      });

      // 8) Resend può restituire error senza lanciare eccezione
      if (error) {
        console.error(
          "[contatti] Resend error (full serialized)",
          JSON.stringify(error),
        );
        const errorCode = diagnoseResendError(error);
        const errorMessage = String(error?.message || "").slice(0, 200);
        console.error("[contatti] Resend risposta errore (oggetto error)", {
          code: errorCode,
          name: error?.name,
          message: errorMessage,
        });
        return json(500, {
          ok: false,
          error: errorCode,
          message: GENERIC_BACKEND_MESSAGE,
          build: BUILD_FINGERPRINT,
        });
      }

      console.log("[contatti] Resend ok", { id: sent?.id ?? null });
      return json(200, {
        ok: true,
        emailSent: true,
        provider: "resend",
        id: sent?.id ?? null,
        build: BUILD_FINGERPRINT,
      });
    } catch (err: any) {
      const errorCode = diagnoseResendError(err);
      const errorMessage = String(err?.message || "").slice(0, 200);
      console.error("[contatti] Resend eccezione", {
        code: errorCode,
        name: err?.name,
        message: errorMessage,
      });
      return json(500, {
        ok: false,
        error: errorCode,
        message: GENERIC_BACKEND_MESSAGE,
        build: BUILD_FINGERPRINT,
      });
    }
  } catch (unexpected: unknown) {
    const msg =
      unexpected instanceof Error ? unexpected.message : String(unexpected);
    console.error("[contatti] POST errore non gestito", {
      message: msg.slice(0, 300),
    });
    return json(500, {
      ok: false,
      error: "INTERNAL_ERROR",
      message: GENERIC_BACKEND_MESSAGE,
      build: BUILD_FINGERPRINT,
    });
  }
};
