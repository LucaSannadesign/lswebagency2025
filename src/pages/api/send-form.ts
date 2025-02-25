import sendgrid from "@sendgrid/mail";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const body = await new Response(req.body).json();
    const { name, email, phone, service, message } = body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Dati mancanti" });
    }

    // Configura SendGrid
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

    const emailContent = {
      to: process.env.EMAIL_TO,
      from: process.env.EMAIL_FROM,
      subject: `Nuova richiesta di contatto da ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nTelefono: ${phone || "Non fornito"}\nServizio: ${service}\nMessaggio:\n${message}`,
      html: `
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone || "Non fornito"}</p>
        <p><strong>Servizio:</strong> ${service}</p>
        <p><strong>Messaggio:</strong></p>
        <p>${message}</p>
      `,
    };

    await sendgrid.send(emailContent);

    return res.status(200).json({ message: "Email inviata con successo!" });

  } catch (error) {
    console.error("Errore nel server:", error);
    return res.status(500).json({ error: `Errore durante l’invio dell’email: ${error.message}` });
  }
}
