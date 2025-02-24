import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }

  try {
    const body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', reject);
    });

    const { name, email, message } = body;

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
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Nuovo messaggio da ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nMessaggio: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email inviata con successo!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante l’invio dell’email.' });
  }
}
