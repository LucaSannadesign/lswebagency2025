import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

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
                url: z.string().min(1, "Il percorso dell'immagine non può essere vuoto."), // Assicura che il percorso non sia vuoto
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

// ✅ Collezione per i post del blog
const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/content/data/post' }),
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),
    title: z.string(),
    excerpt: z.string().optional(),
    image: z.union([
      z.string(), // Permette di usare stringhe ("/assets/images/...")
      z.object({
        src: z.string(),
        alt: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      }),
    ]).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    metadata: metadataDefinition(),
  }),
});

// ✅ Collezione per il portfolio
const portfolioCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/content/data/portfolio' }), // Percorso per i progetti portfolio
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

export const collections = {
  post: postCollection,
  portfolio: portfolioCollection,
};
