import nodemailer from 'nodemailer';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({
  request
}) => {
  const data = await request.formData();
  const honeypot = data.get("honeypot");
  if (honeypot) {
    return new Response(JSON.stringify({
      error: "Spam rilevato."
    }), {
      status: 400
    });
  }
  const name = data.get("user_name")?.toString() || "";
  const email = data.get("user_email")?.toString() || "";
  const phone = data.get("user_phone")?.toString() || "";
  const service = data.get("user_service")?.toString() || "";
  const message = data.get("user_message")?.toString() || "";
  if (!name || !email || !service || !message) {
    return new Response(JSON.stringify({
      error: "Compila tutti i campi obbligatori."
    }), {
      status: 400
    });
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: undefined                          ,
      // es: info@lswebagency.com
      pass: undefined                              
      // password per l'app da Google
    }
  });
  try {
    await transporter.sendMail({
      from: `"LS Web Agency" <${undefined                          }>`,
      to: undefined                          ,
      replyTo: email,
      subject: `Nuovo contatto da ${name}`,
      html: `
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone}</p>
        <p><strong>Servizio:</strong> ${service}</p>
        <p><strong>Messaggio:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      `
    });
    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200
    });
  } catch (err) {
    console.error("Errore invio email:", err);
    return new Response(JSON.stringify({
      error: "Errore durante l'invio."
    }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
