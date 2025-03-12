import { getCollection } from 'astro:content';

export async function GET() {
  const baseUrl = 'https://lswebagency.com'; // ✅ Dominio corretto

  // Recupera articoli del blog e progetti dal portfolio
  const posts = await getCollection('post');
  const portfolioItems = await getCollection('portfolio');

  // Pagine statiche
  const staticPages = [
    '/',
    '/chi-siamo',
    '/servizi',
    '/portfolio',
    '/contatti',
    '/blog',
  ];

  // Creazione della sitemap XML con URL corretti
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map((page) => `<url><loc>${baseUrl}${page}</loc></url>`).join('')}
  ${posts.map((post) => `<url><loc>${baseUrl}/blog/${post.id}</loc></url>`).join('')}
  ${portfolioItems.map((item) => `<url><loc>${baseUrl}/portfolio/${item.id}</loc></url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
