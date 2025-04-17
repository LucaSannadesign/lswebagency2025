import { Resend } from 'resend';
export { renderers } from '../../renderers.mjs';

const resend = new Resend(undefined                              );
const POST = async ({
  request
}) => {
  const formData = await request.formData();
  const honeypot = formData.get("honeypot");
  const timestamp = Number(formData.get("timestamp") || "0");
  const now = Date.now();
  if (honeypot) {
    return new Response(JSON.stringify({
      error: "Bot rilevato (honeypot)"
    }), {
      status: 400
    });
  }
  if (now - timestamp < 5e3) {
    return new Response(JSON.stringify({
      error: "Invio troppo veloce, probabile bot"
    }), {
      status: 400
    });
  }
  const name = formData.get("user_name")?.toString() || "";
  const email = formData.get("user_email")?.toString() || "";
  const phone = formData.get("user_phone")?.toString() || "";
  const service = formData.get("user_service")?.toString() || "";
  const message = formData.get("user_message")?.toString() || "";
  const privacy = formData.get("privacy");
  if (!privacy) {
    return new Response(JSON.stringify({
      error: "Devi accettare la privacy policy."
    }), {
      status: 400
    });
  }
  try {
    const {
      error
    } = await resend.emails.send({
      from: "LS Web Agency <onboarding@resend.dev>",
      to: ["info@lswebagency.com"],
      subject: "Nuova richiesta dal sito",
      reply_to: email,
      html: `
        <h2>Nuova richiesta da LS Web Agency</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone}</p>
        <p><strong>Servizio richiesto:</strong> ${service}</p>
        <p><strong>Messaggio:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `
    });
    if (error) {
      return new Response(JSON.stringify({
        error: "Errore invio email"
      }), {
        status: 500
      });
    }
    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: "Errore generico",
      detail: err
    }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
