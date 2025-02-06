import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const metadataDefinition = () =>
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
                url: z.string(),
                width: z.number().optional(),
                height: z.number().optional(),
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

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/post' }),
<<<<<<< HEAD
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});
// ✅ Collezione Portfolio (Modificata per adattarsi al progetto)
const portfolioCollection = defineCollection({
  type: 'content',
=======
>>>>>>> 8487b4a (Aggiornamento navigazione e struttura del portfolio)
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    draft: z.boolean().optional(),

    title: z.string(),
<<<<<<< HEAD
    permalink: z.string(), // 🔹 Assicuriamoci che ogni progetto abbia un permalink
    description: z.string().optional(),
    category: z.string().optional(), // 🔹 Campo per categorizzare i progetti
    technologies: z.array(z.string()).optional(), // 🔹 Tecnologie usate nel progetto
    image: z
      .object({
        src: z.string(),
        alt: z.string().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
      })
      .optional(),
    metadata: z
      .object({
        canonical: z.string().url().optional(),
      })
      .optional(),
  }),
});


export const collections = {
  post: postCollection,
  portfolio: portfolioCollection, // 🔹 Collezione Portfolio (Personalizzata)

=======
    excerpt: z.string().optional(),
    image: z.string().optional(),

    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),

    metadata: metadataDefinition(),
  }),
});

// ✅ Aggiunta della collezione portfolio
const portfolioCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/data/portfolio' }), // Percorso per i progetti portfolio
  schema: z.object({
    publishDate: z.date().optional(),
    updateDate: z.date().optional(),
    title: z.string(),
    slug: z.string(),
    description: z.string().optional(),
    category: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    image: z.string().optional(),
    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
  portfolio: portfolioCollection, // ✅ Aggiunto il portfolio
>>>>>>> 8487b4a (Aggiornamento navigazione e struttura del portfolio)
};
