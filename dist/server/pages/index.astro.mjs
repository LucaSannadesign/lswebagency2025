import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, u as unescapeHTML, F as Fragment } from '../chunks/astro/server_CROlnyxU.mjs';
import 'kleur/colors';
import { $ as $$Button, a as $$PageLayout } from '../chunks/PageLayout_Byy34s9y.mjs';
import { $ as $$Hero } from '../chunks/Hero_BuKVrzei.mjs';
import { $ as $$Grid } from '../chunks/Grid_ZOf9dfVN.mjs';
import { b as getBlogPermalink } from '../chunks/permalinks_Dwzzi1H-.mjs';
import { h as findLatestPosts } from '../chunks/blog_DzL8Y9T2.mjs';
import { $ as $$WidgetWrapper } from '../chunks/WidgetWrapper_B2DW10Hc.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_BZu4Zfll.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://lswebagency.com");
const $$BlogLatestPosts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogLatestPosts;
  const {
    title = await Astro2.slots.render("title"),
    linkText = "View all posts",
    linkUrl = getBlogPermalink(),
    information = await Astro2.slots.render("information"),
    count = 4,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  const posts = await findLatestPosts({ count }) ;
  console.log("POSTS TROVATI:", posts);
  return renderTemplate`${renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": classes?.container, "bg": bg }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="flex flex-col lg:justify-between lg:flex-row mb-8">${title && renderTemplate`<div class="md:max-w-sm"><h2 class="text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none group font-heading mb-2">${unescapeHTML(title)}</h2>${linkText && linkUrl && renderTemplate`${renderComponent($$result2, "Button", $$Button, { "variant": "link", "href": linkUrl }, { "default": async ($$result3) => renderTemplate`${" "}${linkText} »
` })}`}</div>`}${information && renderTemplate`<p class="text-muted dark:text-slate-400 lg:text-sm lg:max-w-md">${unescapeHTML(information)}</p>`}</div>${renderComponent($$result2, "Grid", $$Grid, { "posts": posts })}` })}` }`;
}, "/Users/lucasanna/lswebagency2025/src/components/widgets/BlogLatestPosts.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Realizzazione Siti Web Sassari | LS Web Agency & SEO",
    description: "LS Web Agency realizza siti web, e-commerce, SEO e marketing digitale su misura per aziende e professionisti a Sassari.",
    ignoreTitleTemplate: true
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "actions": [
    { variant: "primary", text: "Richiedi una consulenza", href: "/contatti" },
    { text: "I nostri servizi", href: "#servizi" }
  ], "image": {
    src: "~/assets/images/realizzazione-siti-web-sassari-sardegna.webp",
    alt: "Realizzazione siti web a Sassari"
  } }, { "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate` ${maybeRenderHead()}<span class="hidden sm:inline">
LS Web Agency progetta <strong>siti web</strong>, <strong>e-commerce</strong> e
        strategie di <strong>SEO</strong> e <strong>marketing digitale</strong> su misura per
        aziende e professionisti a Sassari.
</span> <span class="block mb-1 sm:hidden font-bold text-blue-600">
Affidati a noi per la tua presenza online!
</span> ` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
Realizzazione siti web a Sassari&nbsp;
<span class="text-accent text-gradient dark:text-white highlight">
ottimizzati per SEO
</span> ` })}` })}  <section id="servizi" class="container mx-auto px-4 py-12"> <h2 class="text-3xl font-bold text-center mb-8">I Nostri Servizi</h2> <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"> <!-- Servizio 1 --> <div class="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm"> <div class="text-blue-600 mb-4"> <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"> <path d="M4 4h16v12H4z"></path><path d="M2 18h20v2H2z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">Creazione Siti Web</h3> <p class="text-gray-600 mb-4">Siti responsive, veloci e SEO-friendly.</p> <a href="/servizi/creazione-siti-web-sassari" class="mt-auto btn btn-primary">Scopri</a> </div> <!-- Servizio 2 --> <div class="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm"> <div class="text-blue-600 mb-4"> <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"> <path d="M3 5h18l-2 11H5L3 5zm5 13a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">E-commerce</h3> <p class="text-gray-600 mb-4">Piattaforme di vendita online performanti.</p> <a href="/servizi/realizzazione-siti-ecommerce" class="mt-auto btn btn-primary">Scopri</a> </div> <!-- Servizio 3 --> <div class="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm"> <div class="text-blue-600 mb-4"> <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"> <path d="M3 17h18v2H3zM3 12h18v2H3zM3 7h18v2H3z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">SEO & Posizionamento</h3> <p class="text-gray-600 mb-4">Strategie per scalare Google.</p> <a href="/servizi/ottimizzazione-seo-siti-web" class="mt-auto btn btn-primary">Scopri</a> </div> <!-- Servizio 4 --> <div class="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm"> <div class="text-blue-600 mb-4"> <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2a10 10 0 00-9 6h18a10 10 0 00-9-6zm0 4a2 2 0 110 4 2 2 0 010-4zm0 14a8 8 0 01-8-8h16a8 8 0 01-8 8z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">Branding & Grafica</h3> <p class="text-gray-600 mb-4">Identità visiva e loghi professionali.</p> <a href="/servizi/branding-e-grafica-siti-web" class="mt-auto btn btn-primary">Scopri</a> </div> <!-- Servizio 5 --> <div class="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm"> <div class="text-blue-600 mb-4"> <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"> <path d="M4 4h16v12H4z"></path><path d="M2 18h20v2H2z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">WordPress Slim</h3> <p class="text-gray-600 mb-4">Trasforma WordPress in un sito statico o headless.</p> <a href="/servizi/wordpress-slim-siti-statici-headless" class="mt-auto btn btn-primary">Scopri</a> </div> <!-- Servizio 6 --> <div class="flex flex-col items-center text-center p-6 border rounded-lg shadow-sm"> <div class="text-blue-600 mb-4"> <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"> <path d="M4 4h16v12H4z"></path><path d="M2 18h20v2H2z"></path> </svg> </div> <h3 class="text-xl font-semibold mb-2">AI Blog Engine</h3> <p class="text-gray-600 mb-4">Articoli SEO creati con l’intelligenza artificiale e rifiniti da esperti.</p> <a href="/servizi/ai-blog-engine" class="mt-auto btn btn-primary">Scopri</a> </div> </div> <div class="text-center mt-10"> <a href="/servizi" class="btn-secondary">Scopri tutti i servizi</a> </div> </section>  ${renderComponent($$result2, "BlogLatestPosts", $$BlogLatestPosts, {}, { "information": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "information" }, { "default": ($$result4) => renderTemplate`
Approfondimenti su SEO, web design e marketing digitale.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`Dal nostro blog:` })}` })}  <section id="faq" class="mt-24 px-6 lg:px-8 max-w-4xl mx-auto"> <h2 class="text-3xl font-bold mb-8">Domande Frequenti</h2> <div class="space-y-8 border-t border-gray-200 pt-8"> <div class="border-b pb-6"> <h3 class="text-xl font-semibold dark:text-white">Quanto costa un sito web professionale?</h3> <p class="mt-2 dark:text-slate-300">
I prezzi variano in base al progetto. Soluzioni a partire da <strong>490€</strong>.
</p> </div> <div class="border-b pb-6"> <h3 class="text-xl font-semibold dark:text-white">In quanto tempo viene realizzato?</h3> <p class="mt-2 dark:text-slate-300">
Da 1–2 settimane per siti base, fino a 4 settimane per e-commerce e progetti complessi.
</p> </div> <div class="border-b pb-6"> <h3 class="text-xl font-semibold dark:text-white">Il sito sarà ottimizzato per Google?</h3> <p class="mt-2 dark:text-slate-300">
Sì: applichiamo best practice SEO fin dalla fase di sviluppo.
</p> </div> <div> <h3 class="text-xl font-semibold dark:text-white">Posso gestire il sito autonomamente?</h3> <p class="mt-2 dark:text-slate-300">
Certo: forniamo un pannello di controllo semplice e formazione iniziale.
</p> </div> </div> </section>  ${renderComponent($$result2, "CallToAction", $$CallToAction, { "actions": [{
    variant: "primary",
    text: "Prenota una consulenza gratuita",
    href: "/contatti",
    icon: "tabler:message"
  }] }, { "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate`
Contattaci oggi stesso e scopri come possiamo aiutarti con soluzioni web su misura.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`Pronto a far crescere il tuo business online?` })}` })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/index.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
