import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_BAT2Cbiv.mjs';
import { a as getHomePermalink } from '../chunks/permalinks_jxnaf6UT.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  const title = `Errore 404 - Pagina Non Trovata`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "metadata": { title } }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="flex items-center h-full p-16"> <div class="container flex flex-col items-center justify-center px-5 mx-auto my-8"> <div class="max-w-md text-center"> <h2 class="mb-8 font-bold text-9xl"> <span class="sr-only">Errore</span> <span class="text-primary">404</span> </h2> <p class="text-3xl font-semibold md:text-3xl">Oops! La pagina che stai cercando non esiste.</p> <p class="mt-4 mb-8 text-lg text-muted dark:text-slate-400">
Forse il link è errato o la pagina è stata rimossa. Torna alla nostra homepage e scopri i nostri servizi.
</p> <a rel="noopener noreferrer"${addAttribute(getHomePermalink(), "href")} class="btn ml-4">Torna alla Homepage</a> </div> </div> </section> ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/404.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
