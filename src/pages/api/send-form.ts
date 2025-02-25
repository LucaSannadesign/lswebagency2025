import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // ✅ Controllo metodo della richiesta
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito. Usa POST.' });
  }

  try {
    // ✅ Parsing del body (Vercel lo gestisce automaticamente)
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Compila tutti i campi obbligatori.' });
    }

    // ✅ Configurazione del trasportatore Nodemailer
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Cambia se usi un altro provider
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Configurazione email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_DESTINATION,
      subject: `Nuovo messaggio da ${name}`,
      text: `
        Nome: ${name}
        Email: ${email}
        Telefono: ${phone || 'Non specificato'}
        Servizio richiesto: ${service || 'Non specificato'}
        Messaggio: ${message}
      `,
    };

    // ✅ Invio dell'email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email inviata con successo!' });

  } catch (error) {
    console.error('Errore nell’invio:', error);
    res.status(500).json({ error: 'Errore nel server, riprova più tardi.' });
  }
}
