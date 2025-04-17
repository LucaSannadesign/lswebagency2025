export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name = data.get('user_name');

  return new Response(
    JSON.stringify({ success: true, message: `Ricevuto da ${name}` }),
    { status: 200 }
  );
};