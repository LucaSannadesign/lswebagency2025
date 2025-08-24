import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

/* ---------- Metadata comune ---------- */
export const metadataDefinition = () =>
  z
    .object({
      title: z.string().optional(),
      ignoreTitleTemplate: z.boolean().optional(),
      canonical: z.string().url().optional(),
      robots: z
        .object({
          index: z.boolean().optional(),
          follow: z.boolean().optional(),
        })
        .optional(),
      description: z.string().optional(),
      openGraph: z
        .object({
          url: z.string().optional(),
          siteName: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string().min(1, "Il percorso dell'immagine non può essere vuoto."),
                width: z.number().positive().optional(),
                height: z.number().positive().optional(),
              })
            )
            .optional(),
          locale: z.string().optional(),
          type: z.string().optional(),
        })
        .optional(),
      twitter: z
        .object({
          handle: z.string().optional(),
          site: z.string().optional(),
          cardType: z.string().optional(),
        })
        .optional(),
    })
    .optional();

/* ---------- Post (Content Layer) ---------- */
const postCollection = defineCollection({
  // Content Layer API: serve SOLO loader, niente "type"
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/content/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),
    title: z.string(),
    excerpt: z.string().optional(),
    image: z
      .union([
        z.string(),
        z.object({
          src: z.string(),
          alt: z.string().optional(),
          width: z.number().optional(),
          height: z.number().optional(),
        }),
      ])
      .optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    metadata: metadataDefinition(),
  }),
});

/* ---------- Portfolio (Content Layer) ---------- */
const portfolioCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/content/data/portfolio' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    title: z.string(),
    slug: z.string(),
    permalink: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    image: z
      .object({
        src: z.string(),
        alt: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
      .optional(),
    metadata: metadataDefinition(),
  }),
});

/* ---------- Reviews (Data Layer) ---------- */
const reviewsCollection = defineCollection({
  type: 'data', // esplicito (facoltativo ma chiaro)
  loader: glob({ pattern: ['*.json'], base: 'src/content/data/reviews' }),
  schema: z.object({
    author: z.string(),
    rating: z.number().min(1).max(5),
    text: z.string(),
    date: z.string(), // ISO es. "2025-08-24"
    source: z.literal('Google'),
    sourceUrl: z.string().url(),
    authorPhoto: z.string().optional(),
  }),
});

export const collections = {
  post: postCollection,
  portfolio: portfolioCollection,
  reviews: reviewsCollection,
};