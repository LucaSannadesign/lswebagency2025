import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { url, businessName, city, category, localKeyword } = body ?? {};

    if (!url || !businessName || !city || !category || !localKeyword) {
      return new Response(
        JSON.stringify({
          error: 'Dati incompleti. Compila tutti i campi richiesti.'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const mockReport = {
      overallScore: 72,
      status: 'Da migliorare',
      topProblems: [
        'La headline iniziale è troppo generica per il target locale.',
        'La call to action principale non guida bene l’utente verso il contatto.',
        'I segnali di fiducia non sono abbastanza visibili nella parte iniziale della homepage.'
      ],
      priorityActions: [
        'Rendere la hero più chiara, specifica e orientata al servizio principale.',
        'Rafforzare la CTA above the fold con un’azione più esplicita.',
        'Inserire recensioni, prove di fiducia o elementi autorevoli nelle prime sezioni.'
      ],
      sections: {
        chiarezzaMessaggio: {
          score: 68,
          summary: 'Il messaggio è presente ma non ancora abbastanza specifico.'
        },
        uxEConversione: {
          score: 70,
          summary: 'La struttura è ordinata, ma la spinta alla conversione può migliorare.'
        },
        seoLocale: {
          score: 74,
          summary: 'La base locale è discreta, ma può essere resa più esplicita.'
        },
        fiduciaEAutorevolezza: {
          score: 66,
          summary: 'La percezione professionale è buona, ma mancano elementi di prova forti.'
        }
      },
      finalSummary: `La homepage di ${businessName} ha una buona base, ma oggi può migliorare in chiarezza, fiducia e orientamento alla conversione locale. Un intervento mirato sulla hero, sulla CTA e sui segnali di autorevolezza aumenterebbe il valore percepito e la capacità di generare contatti.`
    };

    return new Response(JSON.stringify(mockReport), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: 'Errore nella generazione del report.'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};