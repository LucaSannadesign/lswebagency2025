import { g as getCollection } from '../chunks/_astro_content_IwqPpj0g.mjs';
export { renderers } from '../renderers.mjs';

async function GET() {
  const baseUrl = "https://lswebagency.com";
  const posts = await getCollection("post");
  const portfolioItems = await getCollection("portfolio");
  const staticPages = ["/", "/chi-siamo", "/servizi", "/portfolio", "/contatti", "/blog"];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map((page) => `<url><loc>${baseUrl}${page}</loc></url>`).join("")}
  ${posts.map((post) => `<url><loc>${baseUrl}/blog/${post.id}</loc></url>`).join("")}
  ${portfolioItems.map((item) => `<url><loc>${baseUrl}/portfolio/${item.id}</loc></url>`).join("")}
</urlset>`;
  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml"
    }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
