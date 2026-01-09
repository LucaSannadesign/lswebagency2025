// src/pages/local/[...all].ts
// Route server-side per restituire 410 Gone per tutte le richieste a /local e /local/*
// Questo gestisce sia /local che /local/:path*

export async function GET() {
  return new Response('Gone', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
