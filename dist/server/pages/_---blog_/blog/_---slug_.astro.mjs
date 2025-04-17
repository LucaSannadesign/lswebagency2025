import { c as createAstro, a as createComponent, b as renderTemplate } from '../../../chunks/astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import 'clsx';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro("https://lswebagency.com");
const prerender = false;
const $$ = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { slug } = Astro2.params;
  if (!slug || !Array.isArray(slug)) {
    throw new Error("Slug non valido");
  }
  const correctedPath = `/blog/${slug.join("/")}`;
  Astro2.redirect(correctedPath, 301);
  return renderTemplate``;
}, "/Users/lucasanna/lswebagency2025/src/pages/[...blog]/blog/[...slug].astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/[...blog]/blog/[...slug].astro";
const $$url = "/[...blog]/blog/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
