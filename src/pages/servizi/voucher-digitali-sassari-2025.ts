import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ redirect }) => {
  // Se vuoi mandare l'utente alla pagina Servizi:
  // return redirect('/servizi', 301);

  // Consigliato: manda al post reale che esiste già:
  return redirect('/blog/voucher-digitali-sassari-2025', 301);
};