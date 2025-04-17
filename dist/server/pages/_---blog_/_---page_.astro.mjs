import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import { b as $$PageLayout } from '../../chunks/PageLayout_D6vir8IY.mjs';
import { $ as $$Headline, a as $$List, b as $$Pagination } from '../../chunks/Pagination_hlMXJ6-O.mjs';
import { d as getStaticPathsBlogList, e as blogListRobots } from '../../chunks/blog_psdQlZmj.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://lswebagency.com");
const prerender = true;
const getStaticPaths = async ({ paginate }) => {
  try {
    return await getStaticPathsBlogList({ paginate });
  } catch (error) {
    console.error("Errore nella generazione dei percorsi statici:", error);
    return [];
  }
};
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { page } = Astro2.props ?? {};
  const currentPage = page?.currentPage ?? 1;
  const metadata = {
    title: `Blog${currentPage > 1 ? ` \u2014 Pagina ${currentPage}` : ""}`,
    robots: {
      index: currentPage === 1,
      follow: blogListRobots?.follow
    },
    openGraph: {
      type: "blog"
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="px-6 sm:px-6 py-12 sm:py-16 lg:py-20 mx-auto max-w-4xl"> ${renderComponent($$result2, "Headline", $$Headline, { "subtitle": "Il Blog di LS Web Agency: Guide su Web Design, SEO e Sviluppo Web" }, { "default": async ($$result3) => renderTemplate`
Il Blog
` })} ${renderComponent($$result2, "BlogList", $$List, { "posts": page?.data ?? [] })} ${renderComponent($$result2, "Pagination", $$Pagination, { "prevUrl": page?.url?.prev, "nextUrl": page?.url?.next })} </section> ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/[...blog]/[...page].astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/[...blog]/[...page].astro";
const $$url = "/[...blog]/[...page]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  getStaticPaths,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
