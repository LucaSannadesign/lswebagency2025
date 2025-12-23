// src/pages/sitemap.xml.ts
import { getCollection } from 'astro:content';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// 🔗 tienilo allineato a /src/pages/portfolio e /src/pages/portfolio/page/[page].astro
const PER_PAGE_PORTFOLIO = 12;

export async function GET({ site }: { site: URL }) {
  // Origin assoluto (richiede `site:` in astro.config.*). Fallback al dominio reale.
  const origin = site?.origin ?? 'https://www.lswebagency.com';

  // Collezioni
  const posts = await getCollection('post', (e) => !e.data?.draft);
  const portfolio = await getCollection('portfolio', (e) => !(e.data as any)?.draft);
  const cities = await getCollection('cities').catch(() => []); // opzionale

  // Pagine statiche principali
  const staticPages = [
    '/',
    '/chi-siamo',
    '/servizi',
    '/portfolio',
    '/contatti',
    '/blog',
    '/local',
  ];

  // Pagine Servizi (rotte effettive)
  const servicePages = [
    '/servizi/creazione-siti-web-sassari',
    '/servizi/realizzazione-siti-ecommerce',
    '/servizi/ottimizzazione-seo-siti-web',
    '/servizi/branding-e-grafica-siti-web',
    '/servizi/accessibilita-digitale-avanzata',
    '/servizi/personalizzazione-ux-intelligenza-artificiale',
    '/servizi/web-design-etico-sostenibile',
    '/servizi/wordpress-slim-siti-statici-headless',
    // '/servizi/assistente-ai-sito-whatsapp',
  ];

  type Entry = { loc: string; lastmod?: string };

  const push = (path: string, last?: Date | string) => {
    const url = path.startsWith('http') ? path : origin + (path.startsWith('/') ? path : '/' + path);
    const lastmod = last ? new Date(last).toISOString() : undefined;
    urls.push({ loc: url, lastmod });
  };

  const urls: Entry[] = [];

  // Statiche + Servizi
  staticPages.forEach((p) => push(p));
  servicePages.forEach((p) => push(p));

  // Local dinamiche (solo published:true)
  if (cities.length) {
    cities
      .filter((c: any) => c?.data?.published)
      .forEach((c) => push(`/local/${c.slug}`));
  }

  // Blog: /blog/<slug> (lo slug in Content Collections è già "pulito")
  posts.forEach((p) => {
    const last = p.data?.updateDate ?? p.data?.publishDate ?? (p as any).data?.pubDate;
    push(`/blog/${p.slug}`, last as any);
  });

  // Portfolio items
  portfolio.forEach((i) => {
    const last = i.data?.updateDate ?? i.data?.publishDate ?? (i as any).data?.pubDate;
    push(`/portfolio/${i.slug}`, last as any);
  });

  // Paginazione Portfolio
  const total = portfolio.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE_PORTFOLIO));
  for (let p = 2; p <= totalPages; p++) {
    push(`/portfolio/page/${p}`);
  }

  // De-duplica e serializza
  const dedup = Array.from(new Map(urls.map((u) => [u.loc, u])).values());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${dedup
  .map(
    (u) =>
      `<url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}