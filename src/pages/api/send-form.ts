import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metodo non consentito" });
  }

  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Dati mancanti" });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net", // Cambia se usi un altro provider
      port: 587,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER, // Deve essere settato su Vercel
        pass: process.env.EMAIL_PASS, // Deve essere settato su Vercel
      },
    });

    const mailOptions = {
      from: `"LS Web Agency" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_DESTINATION,
      subject: `Nuova richiesta di contatto da ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nTelefono: ${phone || "Non fornito"}\nServizio: ${service}\nMessaggio:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Email inviata con successo!" });

  } catch (error) {
    console.error("Errore nel server:", error);
    return res.status(500).json({ error: `Errore durante l’invio dell’email: ${error.message}` });
  }
}
