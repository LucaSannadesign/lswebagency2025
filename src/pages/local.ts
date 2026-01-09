// src/pages/local.ts
// Route server-side per restituire 410 Gone per /local

export async function GET() {
  return new Response('Gone', {
    status: 410,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
