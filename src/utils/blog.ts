import type { PaginateFunction } from 'astro';
import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Post } from '@/types';
import type { ImageMetadata } from 'astro';
import { APP_BLOG } from 'astrowind:config';
import {
  cleanSlug,
  trimSlash,
  BLOG_BASE,
  POST_PERMALINK_PATTERN,
  CATEGORY_BASE,
  TAG_BASE,
} from './permalinks';

/* -------------------------------------------------------------------------- */
/* Permalink generator                                                        */
/* -------------------------------------------------------------------------- */
const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
};

/* -------------------------------------------------------------------------- */
/* Normalizzazione immagini post                                              */
/* -------------------------------------------------------------------------- */
/**
 * Normalizza l'immagine di un post gestendo diversi formati:
 * - string (path assoluto come "/images/blog/...")
 * - ImageMetadata (dalla build di astro:assets)
 * - undefined/null (nessuna immagine)
 *
 * Ritorna:
 * - string (path valido per fallback img tag)
 * - ImageMetadata (per ottimizzazione astro:assets)
 * - undefined (nessuna immagine disponibile)
 */
export const getPostImageForComponent = (
  image?: ImageMetadata | string | null,
): ImageMetadata | string | undefined => {
  // Se è undefined o null, ritorna undefined
  if (!image) {
    return undefined;
  }

  // Se è ImageMetadata, ritorna così com'è (ha le proprietà esatte per astro:assets)
  if (typeof image !== 'string' && 'src' in image) {
    return image;
  }

  // Se è una stringa, verificiamo che sia un path valido
  if (typeof image === 'string') {
    // Path assoluto pubblico: /images/... → ritorna così (fallback img tag)
    if (image.startsWith('/')) {
      return image;
    }

    // Path relativo che inizia con @/ o ~/: potrebbe essere ESM asset
    // Ritorna così, findImage lo risolverà
    if (image.startsWith('@/') || image.startsWith('~/')) {
      return image;
    }

    // URL remoto http(s): ritorna così
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    // Altrimenti: potrebbe essere un path relativo non valido
    // Ritorna undefined per evitare broken image
    return undefined;
  }

  // Fallback per qualsiasi altro tipo
  return undefined;
};

/* -------------------------------------------------------------------------- */
/* Normalizzazione di un singolo post (CollectionEntry<'post'> -> Post)       */
/* -------------------------------------------------------------------------- */
const getNormalizedPost = async (post: CollectionEntry<'post'>): Promise<Post> => {
  const { id, data } = post;
  const { Content, remarkPluginFrontmatter } = await render(post);

  const {
    publishDate: rawPublishDate = new Date(),
    updateDate: rawUpdateDate,
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    author,
    draft = false,
    metadata = {},
  } = data as any;

  // NB: con content v5 lo slug non è garantito sugli entry: usiamo l'id normalizzato
  const slug = cleanSlug(id);
  const publishDate = new Date(rawPublishDate);
  const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

  const category = rawCategory
    ? {
        slug: cleanSlug(rawCategory),
        title: rawCategory,
      }
    : undefined;

  const tags = (rawTags as string[]).map((tag) => ({
    slug: cleanSlug(tag),
    title: tag,
  }));

  return {
    id,
    slug,
    permalink: await generatePermalink({
      id,
      slug,
      publishDate,
      category: category?.slug,
    }),

    publishDate,
    updateDate,

    title,
    excerpt,
    image, // può essere undefined: i consumer devono gestire il fallback quando serve

    category,
    tags,
    author,

    draft,

    metadata,

    Content,
    readingTime: remarkPluginFrontmatter?.readingTime,
  };
};

/* -------------------------------------------------------------------------- */
/* Caricamento e caching                                                      */
/* -------------------------------------------------------------------------- */
const load = async function (): Promise<Array<Post>> {
  const posts = await getCollection('post');
  const normalizedPosts = posts.map(async (post) => await getNormalizedPost(post));

  const results = (await Promise.all(normalizedPosts))
    .sort((a, b) => b.publishDate.valueOf() - a.publishDate.valueOf())
    .filter((post) => !post.draft);

  return results;
};

let _posts: Array<Post>;

/* -------------------------------------------------------------------------- */
/* Flag di feature dal config                                                 */
/* -------------------------------------------------------------------------- */
export const isBlogEnabled = APP_BLOG.isEnabled;
export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;
export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;

export const blogListRobots = APP_BLOG.list.robots;
export const blogPostRobots = APP_BLOG.post.robots;
export const blogCategoryRobots = APP_BLOG.category.robots;
export const blogTagRobots = APP_BLOG.tag.robots;

export const blogPostsPerPage = APP_BLOG?.postsPerPage;

/* -------------------------------------------------------------------------- */
/* API                                                                        */
/* -------------------------------------------------------------------------- */
export const fetchPosts = async (): Promise<Array<Post>> => {
  if (!_posts) {
    _posts = await load();
  }
  return _posts;
};

export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(slugs)) return [];
  const posts = await fetchPosts();

  return slugs.reduce(function (r: Array<Post>, slug: string) {
    posts.some(function (post: Post) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(ids)) return [];
  const posts = await fetchPosts();

  return ids.reduce(function (r: Array<Post>, id: string) {
    posts.some(function (post: Post) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

export const findLatestPosts = async ({ count }: { count?: number }): Promise<Array<Post>> => {
  const _count = count || 4;
  const posts = await fetchPosts();
  return posts ? posts.slice(0, _count) : [];
};

export const findPopularPosts = async ({ count }: { count?: number }): Promise<Array<Post>> => {
  const _count = count || 5;
  const posts = await fetchPosts();
  
  // Prova a usare lista manuale di slug popolari
  try {
    const { popularPostSlugs } = await import('@/config/popularPosts');
    if (popularPostSlugs && popularPostSlugs.length > 0) {
      const popularPosts = await findPostsBySlugs(popularPostSlugs);
      // Mantieni l'ordine della lista e limita al count richiesto
      return popularPosts.slice(0, _count);
    }
  } catch (e) {
    // Se il file non esiste, usa fallback
  }
  
  // Fallback: usa i primi N post più recenti (già ordinati per data)
  return posts ? posts.slice(0, _count) : [];
};

export const getStaticPathsBlogList = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];
  return paginate(await fetchPosts(), {
    params: { blog: BLOG_BASE || undefined },
    pageSize: blogPostsPerPage,
  });
};

export const getStaticPathsBlogPost = async () => {
  if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
  return (await fetchPosts()).flatMap((post) => ({
    params: {
      blog: post.permalink,
    },
    props: { post },
  }));
};

export const getStaticPathsBlogCategory = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = await fetchPosts();
  const categories: Record<string, { slug: string; title: string }> = {};
  posts.map((post) => {
    if (post.category?.slug) {
      categories[post.category.slug] = post.category;
    }
  });

  return Array.from(Object.keys(categories)).flatMap((categorySlug) =>
    paginate(
      posts.filter((post) => post.category?.slug && categorySlug === post.category.slug),
      {
        params: { category: categorySlug, blog: CATEGORY_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { category: categories[categorySlug] },
      },
    ),
  );
};

export const getStaticPathsBlogTag = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];

  const posts = await fetchPosts();
  const tags: Record<string, { slug: string; title: string }> = {};
  posts.map((post) => {
    if (Array.isArray(post.tags)) {
      post.tags.map((tag) => {
        tags[tag.slug] = tag;
      });
    }
  });

  return Array.from(Object.keys(tags)).flatMap((tagSlug) =>
    paginate(
      posts.filter((post) => Array.isArray(post.tags) && post.tags.find((elem) => elem.slug === tagSlug)),
      {
        params: { tag: tagSlug, blog: TAG_BASE || undefined },
        pageSize: blogPostsPerPage,
        props: { tag: tags[tagSlug] },
      },
    ),
  );
};

/* -------------------------------------------------------------------------- */
/* getStaticPaths locale a questa utility (se usata per una route dedicata)   */
/* -------------------------------------------------------------------------- */
export async function getStaticPaths() {
  const posts = await getCollection('post');

  return posts.map((post) => ({
    // content v5: lo slug non è tipizzato sugli entry; fallback a id
    params: { slug: (post as any).slug || post.id },
    props: {
      post: {
        ...post,
        // immagine passata come prop con fallback a placeholder
        image:
          (post as any).data?.image
            ? (post as any).data.image
            : { src: '/assets/images/placeholder.webp', alt: 'Placeholder Image' },
      },
    },
  }));
}

/* -------------------------------------------------------------------------- */
/* Related posts                                                              */
/* -------------------------------------------------------------------------- */
export async function getRelatedPosts(originalPost: Post, maxResults: number = 4): Promise<Post[]> {
  const allPosts = await fetchPosts();
  const originalTagsSet = new Set(originalPost.tags ? originalPost.tags.map((tag) => tag.slug) : []);

  const postsWithScores = allPosts.reduce(
    (acc: { post: Post; score: number }[], iteratedPost: Post) => {
      if (iteratedPost.slug === originalPost.slug) return acc;

      let score = 0;
      if (
        iteratedPost.category &&
        originalPost.category &&
        iteratedPost.category.slug === originalPost.category.slug
      ) {
        score += 5;
      }

      if (iteratedPost.tags) {
        iteratedPost.tags.forEach((tag) => {
          if (originalTagsSet.has(tag.slug)) {
            score += 1;
          }
        });
      }

      acc.push({ post: iteratedPost, score });
      return acc;
    },
    [],
  );

  postsWithScores.sort((a, b) => b.score - a.score);

  const selectedPosts: Post[] = [];
  let i = 0;
  while (selectedPosts.length < maxResults && i < postsWithScores.length) {
    selectedPosts.push(postsWithScores[i].post);
    i++;
  }

  return selectedPosts;
}
