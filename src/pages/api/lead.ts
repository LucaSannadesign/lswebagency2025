// src/pages/api/lead.ts
import type { APIRoute } from 'astro';

// === Email via SMTP (nodemailer) o Resend ===
import nodemailer from 'nodemailer';

const {
  EMAIL_PROVIDER,
  // SMTP
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  // RESEND
  RESEND_API_KEY,
  LEADS_FROM_EMAIL = 'bot@lswebagency.com',
  LEADS_TO_EMAIL   = 'info@lswebagency.com',

  // Supabase
  SUPABASE_URL,
  SUPABASE_ANON_KEY,

  // Telegram (opzionale)
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_CHAT_ID,
} = import.meta.env as Record<string, string | undefined>;

// ---- helpers ----
async function sendEmail(subject: string, html: string) {
  if (EMAIL_PROVIDER === 'smtp') {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT ?? 465),
      secure: String(SMTP_SECURE ?? 'true') === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    await transporter.sendMail({
      from: LEADS_FROM_EMAIL,
      to: LEADS_TO_EMAIL,
      subject,
      html,
    });
    return;
  }
  if (EMAIL_PROVIDER === 'resend' && RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: LEADS_FROM_EMAIL,
        to: [LEADS_TO_EMAIL],
        subject,
        html,
      }),
    });
    return;
  }
}

async function insertSupabase(row: any) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  await fetch(`${SUPABASE_URL}/rest/v1/chat_leads`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(row),
  });
}

async function notifyTelegram(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json().catch(() => ({}));
    const {
      channel = 'web',
      name = 'Chat user',
      email,
      message = '',
      meta = {},
    } = data || {};

    const when = new Date().toISOString();

    // 1) salva su Supabase
    await insertSupabase({
      channel, name, email, message,
      intent: meta?.intent ?? null,
      path: meta?.path ?? null,
      created_at: when,
      user_agent: request.headers.get('user-agent') ?? null,
    });

    // 2) invia email
    const subject = `💬 Nuovo messaggio chat (${channel}) — ${name}`;
    const html = `
      <h2>Nuovo messaggio dalla chat</h2>
      <p><b>Nome:</b> ${name}</p>
      ${email ? `<p><b>Email:</b> ${email}</p>` : ''}
      <p><b>Messaggio:</b><br>${(message || '').replace(/\n/g, '<br>')}</p>
      <hr>
      <p><b>Intent:</b> ${meta?.intent ?? '-'}<br>
      <b>Pagina:</b> ${meta?.path ?? '-'}<br>
      <b>Quando:</b> ${when}</p>
    `;
    await sendEmail(subject, html);

    // 3) Telegram ping (facoltativo)
    await notifyTelegram(
      `💬 <b>Lead chat</b>\n👤 ${name}${email ? ` — ${email}` : ''}\n📝 ${message}\n🏷️ intent: ${meta?.intent ?? '-'}\n📄 ${meta?.path ?? ''}`
    );

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('lead error', err);
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
};