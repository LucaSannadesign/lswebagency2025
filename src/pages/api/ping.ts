// src/pages/api/ping.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ ok: true, route: '/api/ping', ts: Date.now() }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }
  );
};

export const POST: APIRoute = async () => {
  return new Response(
    JSON.stringify({ ok: true, route: '/api/ping', ts: Date.now() }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    }
  );
};