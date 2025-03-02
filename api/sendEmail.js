import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metodo non consentito' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
  }

  try {
    const data = await resend.emails.send({
      from: 'noreply@lswebagency.com', // Usa un dominio verificato con Resend
      to: 'info@lswebagency.com',
      subject: `Nuovo messaggio da ${name}`,
      html: `<p><strong>Nome:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Messaggio:</strong></p>
             <p>${message}</p>`,
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Errore nell’invio dell’email:', error);
    res.status(500).json({ error: 'Errore nel server' });
  }
}
