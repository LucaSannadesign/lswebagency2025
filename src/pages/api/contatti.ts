import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  // Protezioni anti-spam
  const honeypot = formData.get('honeypot');
  const timestamp = Number(formData.get('timestamp') || '0');
  const now = Date.now();

  if (honeypot) {
    return new Response(JSON.stringify({ error: 'Bot rilevato (honeypot)' }), { status: 400 });
  }

  if (now - timestamp < 5000) {
    return new Response(JSON.stringify({ error: 'Invio troppo veloce, probabile bot' }), { status: 400 });
  }

  // Recupero dati dal form
  const name = formData.get('user_name')?.toString() || '';
  const email = formData.get('user_email')?.toString() || '';
  const phone = formData.get('user_phone')?.toString() || '';
  const service = formData.get('user_service')?.toString() || '';
  const message = formData.get('user_message')?.toString() || '';
  const privacy = formData.get('privacy');

  if (!privacy) {
    return new Response(JSON.stringify({ error: 'Devi accettare la privacy policy.' }), { status: 400 });
  }

  // QUI andrà l'invio dell'email → lo facciamo nello STEP 3
  console.log('✅ Richiesta ricevuta:', { name, email, phone, service, message });

  return new Response(
    JSON.stringify({ success: true, message: 'Richiesta inviata con successo.' }),
    { status: 200 }
  );
};