export const prerender = false;

import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();

  const honeypot = data.get("honeypot");
  if (honeypot) {
    return new Response(JSON.stringify({ error: "Spam rilevato." }), { status: 400 });
  }

  const name = data.get("user_name")?.toString() || "";
  const email = data.get("user_email")?.toString() || "";
  const phone = data.get("user_phone")?.toString() || "";
  const service = data.get("user_service")?.toString() || "";
  const message = data.get("user_message")?.toString() || "";

  if (!name || !email || !service || !message) {
    return new Response(JSON.stringify({ error: "Compila tutti i campi obbligatori." }), { status: 400 });
  }

  // SMTP Config
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: import.meta.env.GMAIL_USER,       // es: info@lswebagency.com
      pass: import.meta.env.GMAIL_APP_PASS,   // password per l'app da Google
    },
  });

  try {
    await transporter.sendMail({
      from: `"LS Web Agency" <${import.meta.env.GMAIL_USER}>`,
      to: import.meta.env.GMAIL_USER,
      replyTo: email,
      subject: `Nuovo contatto da ${name}`,
      html: `
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone}</p>
        <p><strong>Servizio:</strong> ${service}</p>
        <p><strong>Messaggio:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error("Errore invio email:", err);
    return new Response(JSON.stringify({ error: "Errore durante l'invio." }), { status: 500 });
  }
};