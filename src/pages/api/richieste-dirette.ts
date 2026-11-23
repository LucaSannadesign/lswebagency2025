import type { APIRoute } from "astro";
import { Resend } from "resend";
import { parseTourismInquiry, type TourismInquiry } from "../../lib/tourismInquiry";

export const prerender = false;

const ROUTE = "/api/richieste-dirette";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_MS = 10 * 60_000;
const rateLimit = new Map<string, { attempts: number; until: number }>();

function env(name: string): string | undefined {
  const value = import.meta.env[name] || process.env[name];
  return typeof value === "string" ? value : undefined;
}

function respond(request: Request, status: number, code: string, message: string): Response {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if ((request.headers.get("accept") || "").includes("application/json")) {
    return new Response(JSON.stringify({ ok: false, code, message }), {
      status,
      headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
    });
  }
  // I messaggi provengono solo dal codice server; nessun input utente è inserito nell'HTML.
  return new Response(
    `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Richiesta non inviata | LS Web Agency</title></head><body style="font:16px/1.6 system-ui,sans-serif;max-width:44rem;margin:3rem auto;padding:0 1rem"><h1>Richiesta non inviata</h1><p>${message}</p><p><a href="/transizione-digitale-turismo#form">Torna al modulo</a></p></body></html>`,
    { status, headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } },
  );
}

function accepted(request: Request, duplicate = false): Response {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" };
  if ((request.headers.get("accept") || "").includes("application/json")) {
    return new Response(JSON.stringify({ ok: true, received: true, duplicate }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
    });
  }
  return new Response(null, { status: 303, headers: { ...headers, Location: "/grazie" } });
}

function allowRate(request: Request): boolean {
  // Limite best effort per istanza serverless; non sostituisce un rate limit distribuito.
  const ip = request.headers.get("x-real-ip")
    || request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  const now = Date.now();
  if (rateLimit.size > 1000) {
    for (const [key, entry] of rateLimit) if (entry.until < now) rateLimit.delete(key);
  }
  const existing = rateLimit.get(ip);
  if (!existing || existing.until < now) {
    rateLimit.set(ip, { attempts: 1, until: now + RATE_LIMIT_MS });
    return true;
  }
  if (existing.attempts >= RATE_LIMIT_MAX) return false;
  existing.attempts += 1;
  return true;
}

type SaveOutcome = "inserted" | "duplicate" | "failed";

async function saveToCrm(inquiry: TourismInquiry): Promise<SaveOutcome> {
  try {
    // Import dinamico: in anteprima senza credenziali CRM i test di validazione continuano a funzionare.
    const { supabaseAdmin } = await import("../../lib/supabase.server");
    const since = new Date(Date.now() - 5 * 60_000).toISOString();
    // Protezione anti-doppio click / retry, best effort senza vincolo unico DB.
    const { data: matches, error: readError } = await supabaseAdmin
      .from("leads")
      .select("id")
      .eq("email", inquiry.email)
      .eq("website", inquiry.sito)
      .gte("created_at", since)
      .limit(1);
    if (readError) {
      console.warn("[richieste-dirette] CRM lookup failed", readError.message);
    } else if (matches && matches.length > 0) {
      return "duplicate";
    }

    const notes = [
      "Richiesta spontanea dalla pagina Transizione Digitale Turismo.",
      "Fonte: modulo /transizione-digitale-turismo (non è consenso a newsletter/marketing).",
      `Obiettivo selezionato: ${inquiry.obiettivo}`,
      inquiry.messaggio ? `Messaggio: ${inquiry.messaggio}` : "Messaggio: —",
    ].join("\n");

    const { error } = await supabaseAdmin.from("leads").insert({
      business_name: inquiry.struttura,
      contact_name: inquiry.nome,
      website: inquiry.sito,
      city: inquiry.citta,
      email: inquiry.email,
      phone: inquiry.telefono || null,
      sector: "turismo",
      service_interest: "Valutazione iniziale del sito turistico",
      status: "nuovo",
      priority: "media",
      source: "altro",
      problem_detected: [],
      estimated_value: 0,
      archived: false,
      notes,
    });
    if (error) {
      console.error("[richieste-dirette] CRM insert failed", error.message);
      return "failed";
    }
    return "inserted";
  } catch (error) {
    console.error("[richieste-dirette] CRM unavailable", error instanceof Error ? error.message : "unknown");
    return "failed";
  }
}

async function notifyInternally(inquiry: TourismInquiry): Promise<boolean> {
  // Mai spedire mail reali nei deploy di anteprima o nello sviluppo locale.
  if (env("VERCEL_ENV") !== "production") return false;
  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("[richieste-dirette] Resend missing; CRM remains source of truth");
    return false;
  }

  const text = [
    "Nuova richiesta spontanea dal sito LS Web Agency — Transizione Digitale Turismo",
    "",
    `Struttura: ${inquiry.struttura}`,
    `Referente: ${inquiry.nome}`,
    `Sito: ${inquiry.sito}`,
    `Città: ${inquiry.citta}`,
    `Email: ${inquiry.email}`,
    `Telefono: ${inquiry.telefono || "—"}`,
    `Obiettivo: ${inquiry.obiettivo}`,
    `Messaggio: ${inquiry.messaggio || "—"}`,
    "",
    "Messaggio generato da una richiesta in ingresso: non è una comunicazione promozionale al referente.",
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "LS Web Agency <info@lswebagency.com>",
      to: ["info@lswebagency.com"],
      replyTo: inquiry.email,
      subject: "Nuova richiesta turismo — LS Web Agency",
      text,
    });
    if (error) {
      console.error("[richieste-dirette] Internal notification failed", error.name);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[richieste-dirette] Internal notification unavailable", error instanceof Error ? error.name : "unknown");
    return false;
  }
}

export const GET: APIRoute = async () =>
  new Response(JSON.stringify({ ok: true, route: ROUTE }), {
    status: 200,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.includes("application/x-www-form-urlencoded") && !contentType.includes("multipart/form-data")) {
    return respond(request, 415, "UNSUPPORTED_MEDIA_TYPE", "Formato non supportato: usa il modulo del sito.");
  }
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > 32_768) {
    return respond(request, 413, "PAYLOAD_TOO_LARGE", "La richiesta è troppo lunga.");
  }
  if (!allowRate(request)) {
    return respond(request, 429, "RATE_LIMIT", "Troppi tentativi. Riprova fra qualche minuto.");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return respond(request, 400, "INVALID_FORM", "I dati del modulo non sono leggibili.");
  }

  const { inquiry, errors, honeypot } = parseTourismInquiry(form);
  if (honeypot) return accepted(request);
  if (!inquiry) {
    return respond(request, 400, "VALIDATION_ERROR", errors.join(" ") || "Verifica i dati inseriti.");
  }

  const saved = await saveToCrm(inquiry);
  if (saved === "duplicate") return accepted(request, true);
  const notified = await notifyInternally(inquiry);
  if (saved === "failed" && !notified) {
    return respond(request, 503, "DELIVERY_FAILED", "La richiesta non è stata registrata. Riprova più tardi oppure scrivi a info@lswebagency.com.");
  }
  // Notifica fallita + CRM riuscito: richiesta comunque recuperabile dal CRM.
  return accepted(request);
};
