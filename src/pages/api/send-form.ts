import nodemailer from 'nodemailer';

export async function POST({ request }) {
  const { name, email, message } = await request.json();

  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com", // Server SMTP di Brevo
    port: 587, // Porta SMTP
    secure: false, // Usa STARTTLS (false per porta 587)
    auth: {
      user: "86a892001@smtp-brevo.com", // Il tuo login SMTP
      pass: "4mdGkS2jLQMW58nD", // Inserisci la tua password SMTP generata
    },
  });

  try {
    await transporter.sendMail({
      from: '"LS Web Agency" <info@lswebagency.com>', // Mittente
      to: "info@lswebagency.com", // Destinatario
      subject: "Nuovo messaggio dal form di contatto",
      html: `<p><strong>Nome:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Messaggio:</strong> ${message}</p>`,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}
