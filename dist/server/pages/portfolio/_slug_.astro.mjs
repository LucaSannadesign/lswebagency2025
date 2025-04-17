import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../../chunks/astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import { g as getCollection } from '../../chunks/_astro_content_B6Fks6Up.mjs';
import { b as $$PageLayout } from '../../chunks/PageLayout_D6vir8IY.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://lswebagency.com");
const prerender = true;
async function getStaticPaths() {
  const portfolio = await getCollection("portfolio");
  if (!portfolio || portfolio.length === 0) {
    console.error("Errore: La collezione 'portfolio' \xE8 vuota o non esiste.");
    return [];
  }
  return portfolio.map((project) => ({
    params: { slug: project.data.slug },
    props: { project, portfolio }
  }));
}
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$slug;
  const { project, portfolio } = Astro2.props || {};
  if (!project || !portfolio || !Array.isArray(portfolio)) {
    console.error("Errore: I dati del portfolio non sono stati caricati correttamente.");
  }
  const currentIndex = Array.isArray(portfolio) ? portfolio.findIndex((p) => p.data.slug === project?.data?.slug) : -1;
  if (currentIndex === -1) {
    console.error("Errore: Nessun progetto trovato con slug:", project?.data?.slug);
  }
  const prevProject = currentIndex > 0 ? portfolio[currentIndex - 1] : null;
  const nextProject = currentIndex < portfolio.length - 1 ? portfolio[currentIndex + 1] : null;
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": { title: project?.data?.title } }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="container mx-auto px-6 py-12"> <div class="grid grid-cols-1 md:grid-cols-2 gap-8"> <!-- Colonna Immagine --> <div> <img${addAttribute(project?.data?.image?.src, "src")}${addAttribute(project?.data?.image?.alt || project?.data?.title, "alt")}${addAttribute(project?.data?.image?.width || 1024, "width")}${addAttribute(project?.data?.image?.height || 768, "height")} class="w-full rounded-lg shadow-md object-cover"> </div> <!-- Colonna Dettagli --> <div> <h1 class="text-3xl font-bold">${project?.data?.title}</h1> <p class="text-gray-600 mt-2">${project?.data?.description}</p> ${project?.data?.category && renderTemplate`<p class="mt-4"> <strong>Categoria:</strong> ${project?.data?.category} </p>`} ${project?.data?.technologies && renderTemplate`<p class="mt-4"> <strong>Tecnologie:</strong> ${project?.data?.technologies.join(", ")} </p>`} </div> </div> <!-- 🔥 Navigazione tra i progetti con titoli limitati --> <div class="mt-12 flex justify-between text-center"> ${prevProject ? renderTemplate`<a${addAttribute(`/portfolio/${prevProject.data.slug}`, "href")} class="text-primary font-semibold hover:underline">
← ${prevProject.data.title.length > 30 ? prevProject.data.title.substring(0, 30) + "..." : prevProject.data.title} </a>` : renderTemplate`<span></span>`} ${nextProject ? renderTemplate`<a${addAttribute(`/portfolio/${nextProject.data.slug}`, "href")} class="text-primary font-semibold hover:underline"> ${nextProject.data.title.length > 30 ? nextProject.data.title.substring(0, 30) + "..." : nextProject.data.title} →
</a>` : renderTemplate`<span></span>`} </div> </section> ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/portfolio/[slug].astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/portfolio/[slug].astro";
const $$url = "/portfolio/[slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
