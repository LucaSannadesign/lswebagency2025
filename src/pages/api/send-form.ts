import sgMail from "@sendgrid/mail";

// Recupera la API Key di SendGrid dalle variabili d'ambiente
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  try {
    // **Leggi il body correttamente**
    const body = await new Response(req.body).json();
    
    // Estrarre i dati dal body
    const { name, email, phone, service, message } = body;

    // Controllo se mancano dati obbligatori
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Dati mancanti nel form" });
    }

    // **Configura l'email da inviare**
    const msg = {
      to: process.env.EMAIL_DESTINATION, // Email destinatario (configurata su Vercel)
      from: process.env.EMAIL_SENDER, // Email mittente (configurata su Vercel)
      subject: `Nuova richiesta di contatto da ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nTelefono: ${phone || "Non fornito"}\nServizio: ${service || "Non specificato"}\n\nMessaggio:\n${message}`,
      html: `
        <h2>Nuova richiesta di contatto</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefono:</strong> ${phone || "Non fornito"}</p>
        <p><strong>Servizio:</strong> ${service || "Non specificato"}</p>
        <p><strong>Messaggio:</strong></p>
        <p>${message}</p>
      `,
    };

    // **Invia l'email**
    await sgMail.send(msg);

    res.status(200).json({ success: "Email inviata con successo!" });
  } catch (error) {
    console.error("Errore durante l’invio dell’email:", error);
    res.status(500).json({ error: `Errore durante l’invio dell’email: ${error.message}` });
  }
}
