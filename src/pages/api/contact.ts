// src/pages/api/contact.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();

    // Honeypot anti-spam (campo "company" nascosto nel form)
    const honeypot = data.get('company');
    if (typeof honeypot === 'string' && honeypot.trim() !== '') {
      return new Response(JSON.stringify({ error: 'Spam rilevato.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const service = (data.get('service') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    if (!name || !email || !service || !message) {
      return new Response(
        JSON.stringify({ error: 'Compila tutti i campi obbligatori.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Config SMTP (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: import.meta.env.GMAIL_USER,     // es: info@lswebagency.com
        pass: import.meta.env.GMAIL_APP_PASS, // password app specifica
      },
    });

    await transporter.sendMail({
      from: `"LS Web Agency" <${import.meta.env.GMAIL_USER}>`,
      to: import.meta.env.GMAIL_USER,
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

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Errore invio email contatti:', err);
    return new Response(
      JSON.stringify({ error: "Errore durante l'invio. Riprova più tardi." }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};