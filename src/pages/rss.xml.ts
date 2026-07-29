import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { fetchPosts } from '@/utils/blog';
import { getPermalink } from '@/utils/permalinks';

// Lo schema ammette date come stringa o Date: qui si normalizza a Date,
// forma richiesta sia da `new Date().valueOf()` sia da `RSSFeedItem.pubDate`.
const toDate = (v: string | Date | undefined): Date | undefined =>
  v instanceof Date ? v : v ? new Date(v) : undefined;

export async function GET(context) {
  const posts = await getCollection('post', (e) => !e.data?.draft);
  posts.sort(
    (a, b) =>
      (toDate(b.data?.publishDate ?? b.data?.pubDate)?.valueOf() ?? 0) -
      (toDate(a.data?.publishDate ?? a.data?.pubDate)?.valueOf() ?? 0)
  );

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
        pubDate: toDate(p.data?.publishDate ?? p.data?.pubDate),
        description: p.data?.description ?? p.data?.excerpt ?? '',
      };
    }),
    customData: `<language>it-it</language>`,
  });
}