import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_CxdTwKPW.mjs';
import 'kleur/colors';
import { g as getCollection } from '../chunks/_astro_content_IwqPpj0g.mjs';
import { b as $$PageLayout } from '../chunks/PageLayout_CAIoFVlp.mjs';
export { renderers } from '../renderers.mjs';

const $$Sitemap = createComponent(async ($$result, $$props, $$slots) => {
  const posts = await getCollection("post");
  const portfolioItems = await getCollection("portfolio");
  const staticPages = [
    { title: "Home", url: "/" },
    { title: "Chi Siamo", url: "/chi-siamo" },
    { title: "Servizi", url: "/servizi" },
    { title: "Portfolio", url: "/portfolio" },
    { title: "Contatti", url: "/contatti" },
    { title: "Blog", url: "/blog" }
  ];
  const metadata = {
    title: "Sitemap - LS Web Agency",
    description: "Scopri tutte le pagine disponibili su LS Web Agency, inclusi blog, portfolio e servizi."
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container mx-auto px-6 py-12"> <h1 class="text-4xl font-bold text-center mb-8">Mappa del Sito</h1> <p class="text-center text-lg text-muted mb-10">
Qui trovi l'elenco di tutte le pagine del nostro sito, inclusi articoli e progetti.
</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> <!-- Pagine Statiche --> <div> <h2 class="text-2xl font-semibold mb-4">Pagine Principali</h2> <ul class="space-y-2"> ${staticPages.map((page) => renderTemplate`<li> <a${addAttribute(page.url, "href")} class="text-blue-600 hover:underline">${page.title}</a> </li>`)} </ul> </div> <!-- Blog --> <div> <h2 class="text-2xl font-semibold mb-4">Articoli del Blog</h2> <ul class="space-y-2"> ${posts.map((post) => renderTemplate`<li> <a${addAttribute(`/blog/${post.id}`, "href")} class="text-blue-600 hover:underline">${post.data.title}</a> </li>`)} </ul> </div> <!-- Portfolio --> <div> <h2 class="text-2xl font-semibold mb-4">Portfolio</h2> <ul class="space-y-2"> ${portfolioItems.map((item) => renderTemplate`<li> <a${addAttribute(`/portfolio/${item.id}`, "href")} class="text-blue-600 hover:underline">${item.data.title}</a> </li>`)} </ul> </div> </div> </section> ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/sitemap.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/sitemap.astro";
const $$url = "/sitemap";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Sitemap,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
