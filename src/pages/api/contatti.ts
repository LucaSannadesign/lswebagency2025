// src/pages/api/contatti.ts
import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
export const prerender = false;

export const config = {
  runtime: "nodejs",
};
export const prerender = false;

interface ContactRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;

  // privacy flags possibili
  privacy?: boolean | string;
  privacyAccepted?: boolean | string;
  accettoPrivacy?: boolean | string;
  privacy_policy?: boolean | string;

  // honeypot
  company?: string;
}

// --- Rate limit semplice in-memory (ok per iniziare; in prod serio -> Redis) ---
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 ora
const RATE_LIMIT_MAX = 5; // max 5 invii/ora per IP

const isDev = import.meta.env.DEV;

// --- Helpers ---
function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

function sanitizeString(str: string, max = 1000): string {
  return String(str ?? "")
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, max);
}

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function asBoolean(v: unknown): boolean {
  if (v === true) return true;
  if (typeof v === "string") return v.toLowerCase() === "true" || v === "1" || v.toLowerCase() === "on";
  return false;
}

// Permetti solo richieste dal tuo sito (e localhost in dev)
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // curl senza Origin -> ok
  const allowed = new Set([
    "https://www.lswebagency.com",
    "https://lswebagency.com",
  ]);
  if (isDev) {
    allowed.add("http://localhost:4321");
    allowed.add("http://127.0.0.1:4321");
  }
  return allowed.has(origin);
}

async function parseJsonBody(request: Request): Promise<ContactRequestBody> {
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error("Content-Type deve essere application/json");
  }
  try {
    return (await request.json()) as ContactRequestBody;
  } catch {
    throw new Error("Body JSON non valido");
  }
}

// --- Routes ---

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      route: "/api/contatti",
      message: "Contact API endpoint. Use POST with application/json.",
    }),
    { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
  );
};

// opzionale ma utile se qualche client fa preflight
export const OPTIONS: APIRoute = async ({ request }) => {
  const origin = request.headers.get("origin");
  if (!isAllowedOrigin(origin)) return new Response(null, { status: 403 });

  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin ?? "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Origin check (blocca spam da altri domini)
    const origin = request.headers.get("origin");
    if (!isAllowedOrigin(origin)) {
      return new Response(
        JSON.stringify({ ok: false, message: "Origine non autorizzata." }),
        { status: 403, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Rate limit
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ ok: false, message: "Troppi tentativi. Riprova più tardi." }),
        { status: 429, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Parse JSON
    const body = await parseJsonBody(request);

    // Honeypot
    if (typeof body.company === "string" && body.company.trim() !== "") {
      return new Response(
        JSON.stringify({ ok: false, message: "Spam rilevato." }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Dati
    const name = sanitizeString(body.name, 120);
    const email = sanitizeString(body.email, 180);
    const phone = sanitizeString(body.phone, 80);
    const service = sanitizeString(body.service, 120);
    const message = sanitizeString(body.message, 5000);

    const privacyOk =
      asBoolean(body.privacyAccepted) ||
      asBoolean(body.privacy) ||
      asBoolean(body.accettoPrivacy) ||
      asBoolean(body.privacy_policy);

    // Validazioni
    if (name.length < 2) {
      return new Response(JSON.stringify({ ok: false, message: "Il nome deve contenere almeno 2 caratteri." }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }
    if (!validateEmail(email)) {
      return new Response(JSON.stringify({ ok: false, message: "Inserisci un indirizzo email valido." }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }
    if (message.length < 10) {
      return new Response(JSON.stringify({ ok: false, message: "Il messaggio deve contenere almeno 10 caratteri." }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }
    if (!privacyOk) {
      return new Response(JSON.stringify({ ok: false, message: "Devi accettare la privacy policy." }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    console.log("[contatti] Nuovo contatto:", {
      name,
      email,
      phone: phone || "—",
      service: service || "—",
      messageLength: message.length,
      ts: new Date().toISOString(),
    });

    // Provider env
    const gmailUser = import.meta.env.GMAIL_USER;
    const gmailPass = import.meta.env.GMAIL_APP_PASS;

    // Invio mail (Gmail via nodemailer) — semplice e stabile
    if (gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: gmailUser, pass: gmailPass },
        });

        await transporter.sendMail({
          from: `"LS Web Agency" <${gmailUser}>`,
          to: gmailUser,
          replyTo: email,
          subject: `Nuovo contatto dal sito — ${name}`,
          html: `
            <h2>Nuova richiesta di contatto</h2>
            <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Telefono:</strong> ${phone ? escapeHtml(phone) : "—"}</p>
            <p><strong>Servizio:</strong> ${service ? escapeHtml(service) : "—"}</p>
            <p><strong>Messaggio:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
          `,
          text: `Nuova richiesta di contatto

Nome: ${name}
Email: ${email}
Telefono: ${phone || "—"}
Servizio: ${service || "—"}

Messaggio:
${message}`,
        });

        console.log("[contatti] Email inviata via Gmail");
      } catch (err) {
        console.error("[contatti] Errore invio email Gmail:", err);
        // Non blocchiamo la risposta: il messaggio è comunque ricevuto
      }
    } else {
      console.log("[contatti] Gmail non configurato (manca GMAIL_USER o GMAIL_APP_PASS).");
    }

    return new Response(JSON.stringify({ ok: true, message: "Messaggio ricevuto." }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (err: any) {
    console.error("[contatti] Errore:", err);
    return new Response(JSON.stringify({ ok: false, message: "Errore durante l'invio. Riprova più tardi." }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
};