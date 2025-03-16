export async function onRequestPost({ request }) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ message: "Email non valida" }), { status: 400 });
    }

    const API_KEY = process.env.BREVO_API_KEY; // Assicurati che l'API Key sia in .env
    const LIST_ID = 2; // ID della tua lista su Brevo

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY,
      },
      body: JSON.stringify({
        email: email,
        listIds: [LIST_ID],
        updateEnabled: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ message: "Errore nell'iscrizione", error: data }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: "Iscrizione avvenuta con successo!" }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: "Errore interno del server", error }), { status: 500 });
  }
}
