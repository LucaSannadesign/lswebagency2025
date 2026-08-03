import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const rootDirectory = process.cwd();

const sources = [
  {
    directory: 'src/content/data/post',
    type: 'blog-post',
    publicationState: 'collection',
    extensions: ['.md', '.mdx'],
  },
  {
    directory: 'src/content/blog',
    type: 'legacy-blog-post',
    publicationState: 'outside-active-collection',
    extensions: ['.md', '.mdx'],
  },
  {
    directory: 'src/pages/servizi',
    type: 'service-page',
    publicationState: 'page',
    extensions: ['.astro'],
  },
];

function stripHtml(value = '') {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]+\}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeValue(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return value ?? null;
}

function parseMarkdown(content) {
  const frontmatterMatch = content.match(
    /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/
  );

  let frontmatter = {};
  let body = content;

  if (frontmatterMatch) {
    try {
      frontmatter = yaml.load(frontmatterMatch[1]) || {};
    } catch (error) {
      frontmatter = {
        _parseError: error instanceof Error ? error.message : String(error),
      };
    }

    body = content.slice(frontmatterMatch[0].length);
  }

  const headings = [...body.matchAll(/^(#{1,3})\s+(.+)$/gm)].map(
    ([, hashes, heading]) => ({
      level: hashes.length,
      text: stripHtml(heading),
    })
  );

  return {
    frontmatter,
    headings,
  };
}

function extractAstroValue(content, fieldName) {
  const patterns = [
    new RegExp(`${fieldName}\\s*:\\s*['"\`]([^'"\`]+)['"\`]`, 'i'),
    new RegExp(`${fieldName}\\s*=\\s*['"\`]([^'"\`]+)['"\`]`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function parseAstro(content) {
  const h1Match = content.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const titleTagMatch = content.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);

  const headings = [
    ...content.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi),
  ].map(([, level, heading]) => ({
    level: Number(level),
    text: stripHtml(heading),
  }));

  return {
    title:
      extractAstroValue(content, 'title') ||
      stripHtml(h1Match?.[1] || '') ||
      stripHtml(titleTagMatch?.[1] || '') ||
      null,

    description:
      extractAstroValue(content, 'description') ||
      extractAstroValue(content, 'excerpt'),

    canonical: extractAstroValue(content, 'canonical'),
    headings,
  };
}

async function listFiles(directory, allowedExtensions) {
  const absoluteDirectory = path.join(rootDirectory, directory);

  try {
    const entries = await fs.readdir(absoluteDirectory, {
      withFileTypes: true,
    });

    const files = [];

    for (const entry of entries) {
      const relativePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        files.push(...(await listFiles(relativePath, allowedExtensions)));
        continue;
      }

      if (allowedExtensions.includes(path.extname(entry.name))) {
        files.push(relativePath);
      }
    }

    return files;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      console.warn(`Cartella non trovata: ${directory}`);
      return [];
    }

    throw error;
  }
}

function buildPublicUrl({ slug, canonical, filePath, sourceType }) {
  if (canonical) {
    return canonical;
  }

  if (slug) {
    return slug.startsWith('/') ? slug : `/blog/${slug}`;
  }

  if (sourceType === 'service-page') {
    const relativePagePath = filePath
      .replace(/^src\/pages/, '')
      .replace(/\/index\.astro$/, '')
      .replace(/\.astro$/, '');

    return relativePagePath || '/';
  }

  return null;
}

async function inspectFile(filePath, source) {
  const absolutePath = path.join(rootDirectory, filePath);
  const content = await fs.readFile(absolutePath, 'utf8');
  const extension = path.extname(filePath);
  const fileName = path.basename(filePath, extension);

  if (extension === '.astro') {
    const parsed = parseAstro(content);

    return {
      sourceType: source.type,
      publicationState: source.publicationState,
      filePath,
      fileName,
      title: parsed.title || fileName,
      slug: null,
      publicUrl: buildPublicUrl({
        canonical: parsed.canonical,
        filePath,
        sourceType: source.type,
      }),
      canonical: parsed.canonical,
      description: parsed.description,
      focusKeyword: null,
      category: null,
      tags: [],
      author: null,
      draft: false,
      robots: null,
      publishDate: null,
      updateDate: null,
      image: null,
      imageAlt: null,
      h1: parsed.headings
        .filter((heading) => heading.level === 1)
        .map((heading) => heading.text),
      h2: parsed.headings
        .filter((heading) => heading.level === 2)
        .map((heading) => heading.text),
      searchIntent: null,
      parseError: null,
    };
  }

  const { frontmatter, headings } = parseMarkdown(content);

  const slug = frontmatter.slug || null;
  const canonical =
    frontmatter.canonical ||
    frontmatter.metadata?.canonical ||
    null;

  const robots =
    typeof frontmatter.robots === 'object'
      ? JSON.stringify(frontmatter.robots)
      : frontmatter.robots || null;

  const image =
    typeof frontmatter.image === 'object'
      ? frontmatter.image.src
      : frontmatter.image || null;

  return {
    sourceType: source.type,
    publicationState: source.publicationState,
    filePath,
    fileName,
    title: frontmatter.title || fileName,
    slug,
    publicUrl: buildPublicUrl({
      slug,
      canonical,
      filePath,
      sourceType: source.type,
    }),
    canonical,
    description:
      frontmatter.description ||
      frontmatter.excerpt ||
      frontmatter.metadata?.description ||
      null,
    focusKeyword: frontmatter.focusKeyword || null,
    category: frontmatter.category || null,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    author: frontmatter.author || null,
    draft: Boolean(frontmatter.draft),
    robots,
    publishDate: normalizeValue(
      frontmatter.publishDate || frontmatter.pubDate
    ),
    updateDate: normalizeValue(
      frontmatter.updateDate || frontmatter.updatedDate
    ),
    image,
    imageAlt:
      frontmatter.imageAlt ||
      (typeof frontmatter.image === 'object'
        ? frontmatter.image.alt
        : null),
    h1: headings
      .filter((heading) => heading.level === 1)
      .map((heading) => heading.text),
    h2: headings
      .filter((heading) => heading.level === 2)
      .map((heading) => heading.text),
    searchIntent: null,
    parseError: frontmatter._parseError || null,
  };
}

const records = [];

for (const source of sources) {
  const files = await listFiles(source.directory, source.extensions);

  for (const filePath of files) {
    records.push(await inspectFile(filePath, source));
  }
}

records.sort((first, second) =>
  first.filePath.localeCompare(second.filePath, 'it')
);

const output = {
  generatedAt: new Date().toISOString(),
  repository: 'LucaSannadesign/lswebagency2025',
  branch: 'feature/editorial-agent',
  totals: {
    all: records.length,
    blogPosts: records.filter(
      (record) => record.sourceType === 'blog-post'
    ).length,
    legacyBlogPosts: records.filter(
      (record) => record.sourceType === 'legacy-blog-post'
    ).length,
    servicePages: records.filter(
      (record) => record.sourceType === 'service-page'
    ).length,
    drafts: records.filter((record) => record.draft).length,
    parseErrors: records.filter((record) => record.parseError).length,
  },
  records,
};

await fs.writeFile(
  path.join(rootDirectory, 'editorial/content-index.json'),
  `${JSON.stringify(output, null, 2)}\n`,
  'utf8'
);

console.log('Inventario editoriale generato.');
console.table(output.totals);
console.log('File: editorial/content-index.json');
