export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('user_name')?.toString() || 'anonimo';

  return new Response(
    JSON.stringify({ success: true, message: `Contatto ricevuto da ${name}` }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};