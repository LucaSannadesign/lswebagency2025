import { getCollection } from 'astro:content';

export async function GET() {
  const baseUrl = 'https://lswebagency.com';

  // Recupera contenuti da collezioni
  const posts = await getCollection('post');
  const portfolioItems = await getCollection('portfolio');

  // Pagine statiche principali
  const staticPages = [
    '/',
    '/chi-siamo',
    '/servizi',
    '/portfolio',
    '/contatti',
    '/blog',
  ];

  // Costruzione sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map((page) => `<url><loc>${baseUrl}${page}</loc></url>`).join('')}
  ${posts.map((post) => {
    const slug = post.data.slug || post.id;
    return `<url><loc>${baseUrl}/blog/${slug}</loc></url>`;
  }).join('')}
  ${portfolioItems.map((item) => {
    const slug = item.data.slug || item.id;
    return `<url><loc>${baseUrl}/portfolio/${slug}</loc></url>`;
  }).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}