import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }

  try {
    const { name, email, phone, service, message } = req.body;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

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

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email inviata con successo!' });
  } catch (error) {
    console.error('Errore durante l’invio dell’email:', error);
    res.status(500).json({ error: 'Errore durante l’invio dell’email.' });
  }
}
