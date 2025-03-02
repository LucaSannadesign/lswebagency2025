import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metodo non consentito" });
  }

  const { name, email, message } = req.body;

  let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465, // Usa 587 per TLS
    secure: true, // Usa false per TLS
    auth: {
      user: "info@lswebagency.com",
      pass: "Sacanlun73@", // Usa una password generata, non la principale!
    },
  });

  let mailOptions = {
    from: email,
    to: "tuo@email.com",
    subject: `Nuovo Messaggio da ${name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email inviata con successo!" });
  } catch (error) {
    res.status(500).json({ message: "Errore nell'invio dell'email", error });
  }
}
