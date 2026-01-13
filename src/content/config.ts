import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

export const metadataDefinition = () =>
  z.object({
    title: z.string().optional(),
    ignoreTitleTemplate: z.boolean().optional(),
    canonical: z.union([z.string().url(), z.string()]).optional(),
    robots: z.union([
      z.string(),
      z.object({ index: z.boolean().optional(), follow: z.boolean().optional() }),
    ]).optional(),
    description: z.string().optional(),
    openGraph: z.object({
      url: z.string().optional(),
      siteName: z.string().optional(),
      images: z.array(z.object({
        url: z.string().min(1),
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
      })).optional(),
      locale: z.string().optional(),
      type: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }).optional(),
    twitter: z.object({
      handle: z.string().optional(),
      site: z.string().optional(),
      cardType: z.string().optional(),
      card: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }).optional(),
  }).optional();

const postCollection = defineCollection({
  loader: glob({ pattern: ['*.md', '*.mdx'], base: 'src/content/data/post' }),
  schema: z.object({
    title: z.string(),
    publishDate: z.union([z.string(), z.coerce.date()]).optional(),
    updateDate: z.union([z.string(), z.coerce.date()]).optional(),
    draft: z.boolean().optional(),
    slug: z.string().optional(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    image: z.union([
      z.string(),
      z.object({ src: z.string(), alt: z.string().optional(), width: z.number().optional(), height: z.number().optional() }),
    ]).optional(),
    imageAlt: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
    focusKeyword: z.string().optional(),
    canonical: z.union([z.string().url(), z.string()]).optional(),
    robots: z.union([
      z.string(),
      z.object({ index: z.boolean().optional(), follow: z.boolean().optional() }),
    ]).optional(),
    og: z.union([
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        url: z.string().optional(),
        siteName: z.string().optional(),
        type: z.string().optional(),
      }),
      z.record(z.any()),
    ]).optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.union([z.string(), z.array(z.any())]).optional(),
    ogType: z.string().optional(),
    twitter: z.union([
      z.object({
        card: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        image: z.string().optional(),
        handle: z.string().optional(),
        site: z.string().optional(),
      }),
      z.record(z.any()),
    ]).optional(),
    twitterCard: z.string().optional(),
    twitterTitle: z.string().optional(),
    twitterDescription: z.string().optional(),
    twitterImage: z.string().optional(),
    twitterCreator: z.string().optional(),
    metadata: metadataDefinition(),
  }).passthrough(), // Consente campi extra non definiti nello schema
});

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
    image: z.object({ src: z.string(), alt: z.string().optional(), width: z.number().optional(), height: z.number().optional() }).optional(),
    metadata: metadataDefinition(),
  }),
});

const reviewsCollection = defineCollection({
  loader: glob({ pattern: ['*.json'], base: 'src/content/data/reviews' }),
  schema: z.object({
    author: z.string(),
    rating: z.number().min(1).max(5),
    text: z.string(),
    date: z.string(),
    source: z.literal('Google'),
    sourceUrl: z.string().url(),
    authorPhoto: z.string().optional(),
  }),
});

const citiesCollection = defineCollection({
  loader: glob({ pattern: ['*.json'], base: 'src/content/data/cities' }),
  schema: z.object({
    name: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    region: z.string().optional(),
    province: z.string().optional(),
    country: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
    published: z.boolean().default(false),
    description: z.string().optional(),
    services: z.array(z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      href: z.string().optional(),
    })).optional(),
    priority: z.number().int().optional(),
    metadata: metadataDefinition(),
  }),
});

export const collections = {
  post: postCollection,
  portfolio: portfolioCollection,
  reviews: reviewsCollection,
  cities: citiesCollection,
};