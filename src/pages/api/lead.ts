// src/pages/api/lead.ts
import type { APIRoute } from 'astro';
import { supabaseAdmin } from '../../lib/supabase.server';

// --- opzionale: invio email via SMTP (Hostinger) o Resend ---
const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER || import.meta.env.EMAIL_PROVIDER; // 'smtp' | 'resend'
const LEADS_TO_EMAIL = process.env.LEADS_TO_EMAIL || import.meta.env.LEADS_TO_EMAIL || 'info@lswebagency.com';
const LEADS_FROM_EMAIL = process.env.LEADS_FROM_EMAIL || import.meta.env.LEADS_FROM_EMAIL || 'bot@lswebagency.com';

// SMTP (Hostinger)
const SMTP_HOST = process.env.SMTP_HOST || import.meta.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || import.meta.env.SMTP_PORT || 465);
const SMTP_SECURE = String(process.env.SMTP_SECURE || import.meta.env.SMTP_SECURE || 'true') === 'true';
const SMTP_USER = process.env.SMTP_USER || import.meta.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS || import.meta.env.SMTP_PASS;

// Resend
const RESEND_API_KEY = process.env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;

async function notifyEmail(subject: string, html: string) {
  try {
    if (EMAIL_PROVIDER === 'smtp' && SMTP_HOST && SMTP_USER && SMTP_PASS) {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await transporter.sendMail({
        from: LEADS_FROM_EMAIL,
        to: LEADS_TO_EMAIL,
        subject,
        html,
      });
      return { ok: true, via: 'smtp' };
    }

    if (EMAIL_PROVIDER === 'resend' && RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: LEADS_FROM_EMAIL,
          to: [LEADS_TO_EMAIL],
          subject,
          html,
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Resend error: ${res.status} ${t}`);
      }
      return { ok: true, via: 'resend' };
    }

    // se non configurato nessun provider, non falliamo l’API
    console.warn('[lead] email provider non configurato: skip notify');
    return { ok: false, via: 'none' };
  } catch (err) {
    console.error('[lead] notifyEmail error', err);
    return { ok: false, via: 'error' };
  }
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      name = '',
      email = '',
      message = '',
      channel = 'web',
      intent = 'generico',
      meta = {},
    } = body || {};

    // salva su Supabase
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          name,
          email,
          message,
          channel,
          intent,
          path: meta?.path || meta?.pathname || null,
          meta,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('[lead] supabase insert error', error);
      return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
    }

    // invia notifica email (se configurata)
    const subject = `🆕 Nuovo lead (${channel}) – ${name || 'Senza nome'}`;
    const html = `
      <h2>Nuovo lead dalla chat</h2>
      <ul>
        <li><b>Nome:</b> ${name || '-'}</li>
        <li><b>Email:</b> ${email || '-'}</li>
        <li><b>Canale:</b> ${channel}</li>
        <li><b>Intent:</b> ${intent}</li>
        <li><b>Pagina:</b> ${meta?.path || '-'}</li>
      </ul>
      <p><b>Messaggio:</b></p>
      <pre style="white-space:pre-wrap">${message || '-'}</pre>
    `;
    const mail = await notifyEmail(subject, html);

    return new Response(JSON.stringify({ ok: true, data, mail }), { status: 200 });
  } catch (err: any) {
    console.error('[lead] fatal', err);
    return new Response(JSON.stringify({ ok: false, error: String(err?.message || err) }), { status: 500 });
  }
};