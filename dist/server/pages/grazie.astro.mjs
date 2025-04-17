import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import { b as $$PageLayout } from '../chunks/PageLayout_D6vir8IY.mjs';
export { renderers } from '../renderers.mjs';

const $$Grazie = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Grazie per averci contattato!",
    description: "Abbiamo ricevuto la tua richiesta. Ti risponderemo il prima possibile.",
    canonical: "/grazie"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="max-w-2xl mx-auto text-center py-24"> <h1 class="text-4xl font-bold mb-4">Grazie per averci contattato!</h1> <p class="text-xl text-gray-600 dark:text-gray-300">
Abbiamo ricevuto la tua richiesta. Ti ricontatteremo al più presto!
</p> </section> ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/grazie.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/grazie.astro";
const $$url = "/grazie";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Grazie,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
