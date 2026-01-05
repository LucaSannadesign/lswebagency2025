// src/pages/api/contatti.ts
import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const prerender = false;

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;

  // privacy (supporto più nomi)
  privacy?: boolean;
  privacyAccepted?: boolean;
  accettoPrivacy?: boolean;
  privacy_policy?: boolean;

  // honeypot (campo nascosto)
  company?: string;
};

const isDev = import.meta.env.DEV;

// Rate limiting semplice (in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 ora
const RATE_LIMIT_MAX = 5; // max 5 invii/ora per IP

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const rec = rateLimitMap.get(key);
  if (!rec || now > rec.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (rec.count >= RATE_LIMIT_MAX) return false;
  rec.count += 1;
  return true;
}

function sanitize(str: string, max = 2000): string {
  return String(str ?? "")
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, max);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function privacyAccepted(body: ContactBody): boolean {
  return Boolean(
    body.privacyAccepted === true ||
      body.privacy === true ||
      body.accettoPrivacy === true ||
      body.privacy_policy === true
  );
}

async function parseJsonBody(request: Request): Promise<ContactBody> {
  const ct = request.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    throw new Error("Content-Type deve essere application/json");
  }
  try {
    return (await request.json()) as ContactBody;
  } catch {
    throw new Error("Body JSON non valido");
  }
}

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      route: "/api/contatti",
      message: "Contact API endpoint. Use POST (application/json).",
    }),
    { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Rate limit
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ ok: false, message: "Troppi tentativi. Riprova più tardi." }),
        { status: 429, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Parse body
    let body: ContactBody;
    try {
      body = await parseJsonBody(request);
    } catch (e: any) {
      return new Response(
        JSON.stringify({ ok: false, message: e?.message || "Errore lettura dati." }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    // Honeypot
    if (typeof body.company === "string" && body.company.trim() !== "") {
      if (isDev) console.warn("[contatti] Honeypot triggered:", ip);
      return new Response(JSON.stringify({ ok: false, message: "Spam rilevato." }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    // Extract + sanitize
    const name = sanitize(body.name ?? "", 200);
    const email = sanitize(body.email ?? "", 200);
    const phone = sanitize(body.phone ?? "", 100);
    const service = sanitize(body.service ?? "", 200);
    const message = sanitize(body.message ?? "", 5000);
    const privacyOk = privacyAccepted(body);

    if (isDev) {
      console.log("[contatti] Ricevuto:", {
        name,
        email,
        phone: phone || "—",
        service: service || "—",
        messageLength: message.length,
        privacyOk,
      });
    }

    // Validate
    if (name.length < 2) {
      return new Response(JSON.stringify({ ok: false, message: "Il nome deve contenere almeno 2 caratteri." }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }
    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ ok: false, message: "Inserisci un indirizzo email valido." }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }
    if (message.length < 10) {
      return new Response(
        JSON.stringify({ ok: false, message: "Il messaggio deve contenere almeno 10 caratteri." }),
        { status: 400, headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }
    if (!privacyOk) {
      return new Response(JSON.stringify({ ok: false, message: "Devi accettare la privacy policy." }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      });
    }

    // Log (sempre)
    console.log("[contatti] Nuovo contatto:", {
      name,
      email,
      phone: phone || "—",
      service: service || "—",
      messageLength: message.length,
      ts: new Date().toISOString(),
    });

    // --- Email sending (priority: SMTP Hostinger -> Resend -> Brevo -> Gmail) ---
    const smtpHost = import.meta.env.SMTP_HOST;
    const smtpPortRaw = import.meta.env.SMTP_PORT;
    const smtpUser = import.meta.env.SMTP_USER;
    const smtpPass = import.meta.env.SMTP_PASS;

    const resendApiKey = import.meta.env.RESEND_API_KEY;
    const brevoApiKey = import.meta.env.BREVO_API_KEY;

    const gmailUser = import.meta.env.GMAIL_USER;
    const gmailPass = import.meta.env.GMAIL_APP_PASS;

    let emailSent = false;

    const subject = `Nuovo contatto dal sito — ${name}`;
    const textBody = `
Nuova richiesta di contatto

Nome: ${name}
Email: ${email}
Telefono: ${phone || "—"}
Servizio: ${service || "—"}

Messaggio:
${message}
    `.trim();

    const htmlBody = `
      <h2>Nuova richiesta di contatto</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefono:</strong> ${phone || "—"}</p>
      <p><strong>Servizio:</strong> ${service || "—"}</p>
      <p><strong>Messaggio:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    `;

    // 1) SMTP (Hostinger)
    if (smtpHost && smtpPortRaw && smtpUser && smtpPass) {
      try {
        const smtpPort = Number(smtpPortRaw);
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465, // 465 SSL, 587 STARTTLS
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"LS Web Agency" <${smtpUser}>`,
          to: smtpUser, // ricevi su te stesso
          replyTo: email,
          subject,
          text: textBody,
          html: htmlBody,
        });

        emailSent = true;
        console.log("[contatti] Email inviata via SMTP (Hostinger)");
      } catch (err) {
        console.error("[contatti] Errore invio email SMTP:", err);
      }
    } else {
      if (isDev) console.log("[contatti] SMTP non configurato (mancano env SMTP_*)");
    }

    // 2) Resend (fallback)
    if (!emailSent && resendApiKey) {
      try {
        const resend = await import("resend");
        const resendClient = new resend.Resend(resendApiKey);

        await resendClient.emails.send({
          from: "LS Web Agency <onboarding@resend.dev>",
          to: [smtpUser || gmailUser || "info@lswebagency.com"],
          replyTo: email,
          subject,
          html: htmlBody,
        });

        emailSent = true;
        console.log("[contatti] Email inviata via Resend");
      } catch (err) {
        console.error("[contatti] Errore invio email Resend:", err);
      }
    }

    // 3) Brevo (fallback)
    if (!emailSent && brevoApiKey) {
      try {
        const brevo = await import("@getbrevo/brevo");
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(brevo.ApiKeyEnum.apiKey, brevoApiKey);

        await apiInstance.sendTransacEmail({
          sender: { name: "LS Web Agency", email: smtpUser || "info@lswebagency.com" },
          to: [{ email: smtpUser || gmailUser || "info@lswebagency.com" }],
          replyTo: { email },
          subject,
          htmlContent: htmlBody,
        });

        emailSent = true;
        console.log("[contatti] Email inviata via Brevo");
      } catch (err) {
        console.error("[contatti] Errore invio email Brevo:", err);
      }
    }

    // 4) Gmail (fallback)
    if (!emailSent && gmailUser && gmailPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: gmailUser, pass: gmailPass },
        });

        await transporter.sendMail({
          from: `"LS Web Agency" <${gmailUser}>`,
          to: gmailUser,
          replyTo: email,
          subject,
          text: textBody,
        });

        emailSent = true;
        console.log("[contatti] Email inviata via Gmail");
      } catch (err) {
        console.error("[contatti] Errore invio email Gmail:", err);
      }
    }

    if (!emailSent) {
      console.log("[contatti] Nessun provider email ha inviato. Verifica env e credenziali.");
    }

    // Risposta OK (anche se invio email fallisce: lato utente non deve “rompersi”)
    return new Response(JSON.stringify({ ok: true, message: "Messaggio ricevuto." }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (err) {
    console.error("[contatti] Errore:", err);
    return new Response(JSON.stringify({ ok: false, message: "Errore durante l'invio. Riprova più tardi." }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
};