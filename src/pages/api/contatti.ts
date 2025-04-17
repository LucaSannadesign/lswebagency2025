import { Resend } from 'resend';
import type { APIRoute } from 'astro';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const honeypot = formData.get('honeypot');
  if (honeypot) {
    return new Response(JSON.stringify({ error: 'Spam rilevato.' }), {
      status: 400,
    });
  }

  const timestamp = parseInt(formData.get('timestamp')?.toString() || '0');
  if (Date.now() - timestamp < 3000) {
    return new Response(JSON.stringify({ error: 'Invio troppo veloce, sospetto bot.' }), {
      status: 400,
    });
  }

  const name = formData.get('user_name')?.toString() || '';
  const email = formData.get('user_email')?.toString() || '';
  const service = formData.get('user_service')?.toString() || '';
  const message = formData.get('user_message')?.toString() || '';

  if (!name || !email || !service || !message) {
    return new Response(JSON.stringify({ error: 'Compila tutti i campi obbligatori.' }), {
      status: 400,
    });
  }

  try {
    await resend.emails.send({
      from: 'LS Web Agency <info@lswebagency.com>',
      to: 'info@lswebagency.com',
      subject: `Nuovo contatto da ${name}`,
      reply_to: email,
      html: `
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Servizio:</strong> ${service}</p>
        <p><strong>Messaggio:</strong><br>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Errore nell’invio' }), {
      status: 500,
    });
  }
};