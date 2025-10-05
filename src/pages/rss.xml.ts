import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('post', (e) => !e.data?.draft);
  posts.sort((a, b) => (new Date(b.data?.publishDate ?? b.data?.pubDate).valueOf()) - (new Date(a.data?.publishDate ?? a.data?.pubDate).valueOf()));

  return rss({
    title: 'LS Web Agency — Blog',
    description: 'SEO, web design, accessibilità e digital marketing.',
    site: context.site ?? 'https://www.lswebagency.com',
    items: posts.map((p) => {
      const slug = p.slug || '';
      const link = slug.startsWith('blog/') ? `/${slug}` : `/blog/${slug}`;
      return {
        link,
        title: p.data?.title ?? slug,
        pubDate: p.data?.publishDate ?? p.data?.pubDate,
        description: p.data?.description ?? p.data?.excerpt ?? '',
      };
    }),
    customData: `<language>it-it</language>`,
  });
}