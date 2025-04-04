import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { name, email, message } = req.body;

  let transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, // Usa SSL
    auth: {
      user: 'info@lswebagency.com',
      pass: 'Sacanlun73@',
    },
  });

  try {
    await transporter.sendMail({
      from: '"LS Web Agency" <info@lswebagency.com>',
      to: 'info@lswebagency.com',
      subject: `Nuovo messaggio da ${name}`,
      text: message,
      html: `<p><strong>Nome:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Messaggio:</strong><br>${message}</p>`,
    });

    res.status(200).json({ success: true, message: 'Email inviata con successo' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Errore nell’invio della mail' });
  }
}
