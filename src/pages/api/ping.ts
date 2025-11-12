// src/pages/api/ping.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ ok: true, message: 'API Astro attive' }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};