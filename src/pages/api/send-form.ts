import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  try {
    const { name, email, phone, service, message } = req.body;

    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("Missing SMTP credentials");
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == "465", // Usa SSL se la porta è 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${email}>`, // Mittente
      to: process.env.EMAIL_DESTINATION, // Destinatario
      subject: `Nuovo messaggio da ${name}`,
      text: `
        Nome: ${name}
        Email: ${email}
        Telefono: ${phone || "Non specificato"}
        Servizio richiesto: ${service || "Non specificato"}
        Messaggio: ${message}
      `,
    });

    return res.status(200).json({ message: "Email inviata con successo!" });
  } catch (error) {
    console.error("Errore durante l'invio dell'email:", error);
    return res.status(500).json({ error: "Errore durante l'invio dell'email." });
  }
}
