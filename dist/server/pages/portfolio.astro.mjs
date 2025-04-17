import { a as createComponent, r as renderComponent, b as renderTemplate, d as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import { g as getCollection } from '../chunks/_astro_content_B6Fks6Up.mjs';
import { b as $$PageLayout } from '../chunks/PageLayout_D6vir8IY.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Portfolio = createComponent(async ($$result, $$props, $$slots) => {
  const portfolio = await getCollection("portfolio");
  if (!portfolio || portfolio.length === 0) {
    console.error("Errore: Nessun progetto trovato nel portfolio.");
  }
  const metadata = {
    title: "Progetti Web Realizzati a Sassari | Portfolio - LS Web Agency",
    description: "Esplora i nostri progetti di web design e sviluppo digitale.",
    canonical: "https://lswebagency.com/portfolio",
    image: "/images/portfolio-og.jpg",
    openGraph: {
      type: "website",
      url: "https://lswebagency.com/portfolio",
      title: "Portfolio - LS Web Agency",
      description: "Scopri i progetti realizzati da LS Web Agency: soluzioni digitali su misura per il tuo business.",
      image: "https://lswebagency.com/images/portfolio-og.jpg"
    },
    twitter: {
      card: "summary_large_image",
      site: "@lswebagency",
      title: "Portfolio - LS Web Agency",
      description: "Dai un\u2019occhiata ai nostri progetti di web design, sviluppo e SEO.",
      image: "https://lswebagency.com/images/portfolio-og.jpg"
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">\n     {JSON.stringify({\n    "@context": "https://schema.org",\n    "@type": "CollectionPage",\n    "name": metadata.title,\n    "description": metadata.description,\n    "url": metadata.openGraph.url,\n    "image": [metadata.openGraph.image || "https://lswebagency.com/images/portfolio-og.jpg"],\n    "publisher": {\n      "@type": "Organization",\n      "name": "LS Web Agency",\n      "logo": "https://lswebagency.com/images/logo.png"\n    }\n  })}\n  <\/script> ', '<section class="container mx-auto px-6 py-12"> <h1 class="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">\nPortfolio - LS Web Agency\n</h1> <h2 class="text-lg text-center text-gray-700 dark:text-gray-300 mt-4 mb-10">\nScopri i nostri progetti realizzati con passione e creativit\xE0.\n</h2> <!-- \u2705 Griglia progetti (lasciata invariata) --> <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"> ', " </div> </section> "])), maybeRenderHead(), portfolio.map((project) => renderTemplate`<a${addAttribute(`/portfolio/${project.id}`, "href")} class="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"${addAttribute(`Scopri il progetto ${project.data.title}`, "aria-label")}> <!-- 🔹 Immagine del progetto (lasciata invariata) --> ${project.data.image && typeof project.data.image === "object" ? renderTemplate`<img${addAttribute(project.data.image.src, "src")}${addAttribute(project.data.image.alt || project.data.title, "alt")}${addAttribute(project.data.image.width || "auto", "width")}${addAttribute(project.data.image.height || "auto", "height")} class="w-full h-64 object-cover" loading="lazy">` : renderTemplate`<img${addAttribute(project.data.image, "src")}${addAttribute(project.data.title, "alt")} class="w-full h-64 object-cover">`} <!-- 🔹 Titolo e descrizione --> <div class="p-4 text-center"> <h3 class="text-base font-semibold leading-tight text-gray-900 dark:text-white"> ${project.data.title} </h3> <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm"> ${project.data.description.length > 120 ? project.data.description.substring(0, 120) + "..." : project.data.description} </p> </div> <!-- 🔥 Descrizione su hover --> <div class="absolute inset-0 bg-black bg-opacity-90 dark:bg-opacity-80 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 text-center pointer-events-none"> <div class="pointer-events-auto"> <p class="text-sm"> ${project.data.description.length > 120 ? project.data.description.substring(0, 120) + "..." : project.data.description} </p> <a${addAttribute(`/portfolio/${project.id}`, "href")} class="text-primary font-semibold hover:underline mt-2 text-sm">
Leggi di più →
</a> </div> </div> </a>`)) })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/portfolio.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/portfolio.astro";
const $$url = "/portfolio";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Portfolio,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
