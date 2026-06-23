import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { fetchPosts } from '@/utils/blog';
import { getPermalink } from '@/utils/permalinks';

export async function GET(context) {
  const posts = await getCollection('post', (e) => !e.data?.draft);
  posts.sort((a, b) => (new Date(b.data?.publishDate ?? b.data?.pubDate).valueOf()) - (new Date(a.data?.publishDate ?? a.data?.pubDate).valueOf()));

  // Mappa id → URL reale della route pubblicata (stessa logica di sitemap.xml.ts)
  const normalized = await fetchPosts();
  const linkById = new Map(normalized.map((post) => [post.id, String(getPermalink(post.permalink, 'post'))]));

  return rss({
    title: 'LS Web Agency — Blog',
    description: 'SEO, web design, accessibilità e digital marketing.',
    site: context.site ?? 'https://www.lswebagency.com',
    trailingSlash: false, // il sito usa trailingSlash: 'never' (astro.config.ts)
    items: posts.map((p) => {
      const link = linkById.get(p.id) ?? `/blog/${p.id}`;
      return {
        link,
        guid: link,
        title: p.data?.title ?? p.id,
        pubDate: p.data?.publishDate ?? p.data?.pubDate,
        description: p.data?.description ?? p.data?.excerpt ?? '',
      };
    }),
    customData: `<language>it-it</language>`,
  });
}