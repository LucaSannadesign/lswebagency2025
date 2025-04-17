import { f as createVNode, F as Fragment, _ as __astro_tag_component__ } from './astro/server_QQ5SR1oO.mjs';
import 'clsx';

const frontmatter = {
  "title": "Canapalandia - Blog",
  "slug": "canapalandia-blog",
  "date": "2025-02-05",
  "permalink": "/portfolio/canapalandia-blog",
  "description": "Realizzazione del blog informativo Canapalandia, dedicato alla cannabis legale e alla sua cultura.",
  "category": "Web Design",
  "technologies": ["WordPress", "CSS", "PHP", "HTML", "SEO"],
  "image": {
    "src": "/images/portfolio/background-canapalandia-8.webp",
    "alt": "Canapalandia Blog",
    "width": 1200,
    "height": 630
  },
  "metadata": {
    "canonical": "https://lswebagency2025.com/portfolio/canapalandia-blog",
    "openGraph": {
      "url": "https://lswebagency2025.com/portfolio/canapalandia-blog",
      "siteName": "LS Web Agency",
      "locale": "it_IT",
      "type": "article"
    },
    "twitter": {
      "handle": "@LSWebAgency",
      "site": "@LSWebAgency",
      "cardType": "summary_large_image"
    }
  },
  "readingTime": 0
};
function getHeadings() {
  return [];
}
function _createMdxContent(props) {
  const {PortfolioLayout} = props.components || ({});
  if (!PortfolioLayout) _missingMdxReference("PortfolioLayout");
  return createVNode(PortfolioLayout, {
    title: title,
    description: description,
    image: image,
    category: category,
    technologies: technologies,
    metadata: metadata
  });
}
function MDXContent(props = {}) {
  const {wrapper: MDXLayout} = props.components || ({});
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + ("component" ) + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
const url = "src/content/data/portfolio/canapalandia-blog.mdx";
const file = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/canapalandia-blog.mdx";
const Content = (props = {}) => MDXContent({
  ...props,
  components: { Fragment: Fragment, ...props.components, },
});
Content[Symbol.for('mdx-component')] = true;
Content[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter.layout);
Content.moduleId = "/Users/lucasanna/lswebagency2025/src/content/data/portfolio/canapalandia-blog.mdx";
__astro_tag_component__(Content, 'astro:jsx');

export { Content, Content as default, file, frontmatter, getHeadings, url };
