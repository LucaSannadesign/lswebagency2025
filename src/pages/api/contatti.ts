import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import 'dotenv/config';
const resend = new Resend(process.env.RESEND_API_KEY);
// Sistema antispam IP temporaneo in memoria
const rateLimitMap = new Map<string, number[]>();
export const prerender = false;
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress || 'unknown';
  const formData = await request.formData();

  // Protezione honeypot + tempo minimo
  const honeypot = formData.get('honeypot');
  const timestamp = Number(formData.get('timestamp') || '0');
  const now = Date.now();

  if (honeypot) {
    console.warn("❌ Bot rilevato tramite honeypot.");
    return new Response(JSON.stringify({ error: 'Bot rilevato' }), { status: 400 });
  }

  if (now - timestamp < 5000) {
    console.warn("⚠️ Invio troppo veloce, probabile bot.");
    return new Response(JSON.stringify({ error: 'Invio troppo veloce' }), { status: 400 });
  }

  // 🧠 Protezione rate limit IP (max 3 richieste ogni 60 sec)
  const timestamps = rateLimitMap.get(ip) || [];
  const filtered = timestamps.filter(t => now - t < 60000);
  filtered.push(now);
  rateLimitMap.set(ip, filtered);
  if (filtered.length > 3) {
    console.warn(`⚠️ Troppe richieste dallo stesso IP: ${ip}`);
    return new Response(JSON.stringify({ error: 'Troppi invii. Riprova più tardi.' }), { status: 429 });
  }

  // Estrazione campi form
  const name = formData.get('user_name')?.toString() || '';
  const email = formData.get('user_email')?.toString() || '';
  const phone = formData.get('user_phone')?.toString() || '';
  const service = formData.get('user_service')?.toString() || '';
  const message = formData.get('user_message')?.toString() || '';
  const privacy = formData.get('privacy');

  if (!privacy) {
    return new Response(JSON.stringify({ error: 'Devi accettare la privacy policy.' }), { status: 400 });
  }

  // 🛡️ Blacklist parole sospette
  const blacklist = ['viagra', 'bitcoin', 'casino', 'escort', 'sex', 'crypto', 'loan'];
  const lowerMessage = message.toLowerCase();
  if (blacklist.some(word => lowerMessage.includes(word))) {
    console.warn("⚠️ Messaggio bloccato per contenuto sospetto.");
    return new Response(JSON.stringify({ error: 'Contenuto non valido' }), { status: 400 });
  }

  // Invio email via Resend
  try {
    const { error } = await resend.emails.send({
      from: 'LS Web Agency <onboarding@resend.dev>',
      to: ['info@lswebagency.com'],
      subject: 'Nuova richiesta dal sito',
      reply_to: email,
      html: `
        <h2>Nuova richiesta da LS Web Agency</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone}</p>
        <p><strong>Servizio richiesto:</strong> ${service}</p>
        <p><strong>Messaggio:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `
    });

    if (error) {
      console.error("❌ Errore da Resend:", error);
      return new Response(JSON.stringify({ error: 'Errore invio email' }), { status: 500 });
    }

    console.log("✅ Email inviata con successo!");
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error("❌ Errore generico:", err);
    return new Response(JSON.stringify({ error: 'Errore generico', detail: err }), { status: 500 });
  }
};