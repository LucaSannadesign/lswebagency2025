// src/pages/api/contact.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async () => {
  return new Response(JSON.stringify({ status: 'post-ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};