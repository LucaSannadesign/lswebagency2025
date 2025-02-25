import sgMail from '@sendgrid/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metodo non consentito' });
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const { name, email, phone, service, message } = req.body;

  const msg = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_FROM,
    subject: `Nuovo messaggio da ${name}`,
    text: `
      Nome: ${name}
      Email: ${email}
      Telefono: ${phone || 'Non specificato'}
      Servizio richiesto: ${service || 'Non specificato'}
      Messaggio: ${message}
    `,
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: 'Email inviata con successo!' });
  } catch (error) {
    console.error('Errore durante l’invio dell’email:', error);
    res.status(500).json({ error: 'Errore durante l’invio dell’email.' });
  }
}
