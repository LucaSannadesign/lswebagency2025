// src/pages/sitemap.xml.ts
import { getCollection } from 'astro:content';
import { fetchPosts } from '@/utils/blog';
import { getPermalink } from '@/utils/permalinks';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const prerender = true;
const PER_PAGE_PORTFOLIO = 12;

export async function GET({ site }: { site: URL }) {
  const origin = site?.origin ?? 'https://www.lswebagency.com';
  const posts = await fetchPosts();
  const portfolio = await getCollection('portfolio', (e) => !(e.data as any)?.draft);
  const cities = await getCollection('cities').catch(() => []);

  const staticPages = [
    '/',
    '/chi-siamo',
    '/servizi',
    '/portfolio',
    '/contatti',
    '/blog',
    '/local',
    '/mini-analisi',
    '/process-fit-check',
    '/progetto-digitale-per-imprese',
    '/transizione-digitale-turismo',
  ];

  const servicePages = [
    '/servizi/creazione-siti-web-sassari',
    '/servizi/realizzazione-siti-ecommerce',
    '/servizi/ottimizzazione-seo-siti-web',
    '/servizi/branding-e-grafica-siti-web',
    '/servizi/accessibilita-digitale-avanzata',
    '/servizi/personalizzazione-ux-intelligenza-artificiale',
    '/servizi/web-design-etico-sostenibile',
    '/servizi/wordpress-slim-siti-statici-headless',
    '/servizi/assistente-ai-sito-whatsapp',
    '/servizi/ai-operations-pmi',
    '/servizi/ai-blog-engine',
    '/servizi/assistenza-manutenzione',
    '/servizi/audit-rapido',
    '/servizi/fix-performance-seo',
    '/servizi/landing-page-professionale',
    '/servizi/local-seo-booster',
    '/servizi/pre-accoglienza-digitale',
    '/servizi/seo-locale',
    '/servizi/siti-web',
    '/servizi/sprint-ottimizzazione',
    '/servizi/sviluppo-web-white-label',
  ];

  type Entry = { loc: string; lastmod?: string };
  const urls: Entry[] = [];
  const push = (path: string, last?: Date | string) => {
    const url = path.startsWith('http') ? path : origin + (path.startsWith('/') ? path : '/' + path);
    const lastmod = last ? new Date(last).toISOString() : undefined;
    urls.push({ loc: url, lastmod });
  };

  staticPages.forEach((p) => push(p));
  servicePages.forEach((p) => push(p));

  if (cities.length) {
    cities.filter((c: any) => c?.data?.published).forEach((c) => push(`/local/${c.data.slug}`));
  }

  posts.forEach((p) => {
    const last = p.updateDate ?? p.publishDate;
    push(String(getPermalink(p.permalink, 'post')), last as any);
  });

  portfolio.forEach((i) => {
    const last = i.data?.updateDate ?? i.data?.publishDate ?? (i as any).data?.pubDate;
    push(`/portfolio/${i.data.slug}`, last as any);
  });

  const totalPages = Math.max(1, Math.ceil(portfolio.length / PER_PAGE_PORTFOLIO));
  for (let p = 2; p <= totalPages; p++) push(`/portfolio/page/${p}`);

  const dedup = Array.from(new Map(urls.map((u) => [u.loc, u])).values());
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${dedup
    .map((u) => `<url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n')}\n</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
