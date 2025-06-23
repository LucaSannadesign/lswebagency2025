import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_CROlnyxU.mjs';
import 'kleur/colors';
import { a as $$PageLayout, $ as $$Button } from '../../chunks/PageLayout_Byy34s9y.mjs';
import { $ as $$Hero } from '../../chunks/Hero_BuKVrzei.mjs';
import { $ as $$Features2 } from '../../chunks/Features2_UvSrJcpP.mjs';
import { $ as $$CallToAction } from '../../chunks/CallToAction_BZu4Zfll.mjs';
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://lswebagency.com");
const $$WordpressSlimSitiStaticiHeadless = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$WordpressSlimSitiStaticiHeadless;
  const metadata = {
    title: "WordPress Slim: Siti Statici o Headless | LS Web Agency",
    description: "Trasforma il tuo sito WordPress in un sistema pi\xF9 veloce, sicuro e ottimizzato con la tecnologia statica o headless. Scopri WordPress Slim.",
    canonical: "/servizi/wordpress-slim-siti-statici-headless"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, { "tagline": "Siti WordPress pi\xF9 veloci e sicuri", "image": {
    src: "~/assets/images/wordpress-slim-lswebagency.webp",
    alt: "Siti statici e headless WordPress"
  } }, { "actions": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "actions" }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "Button", $$Button, { "variant": "primary", "href": "/contatti" }, { "default": ($$result5) => renderTemplate`
Richiedi una valutazione gratuita
` })} ` })}`, "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate`
Migrazione verso soluzioni statiche o headless per migliorare prestazioni, sicurezza e SEO.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate` ${maybeRenderHead()}<span class="text-accent text-gradient dark:text-white highlight">WordPress Slim</span>: alleggerisci il tuo sito
` })}` })} <section class="container mx-auto px-6 py-12 text-lg text-gray-700 dark:text-gray-300 max-w-3xl"> <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
Cos’è WordPress Slim?
</h2> <p class="mb-6">
È un servizio di conversione che trasforma il tuo sito WordPress classico in una versione
<strong>statica o headless</strong>, per ottenere maggiore velocità, sicurezza e semplicità di gestione.
</p> <p>
Utilizziamo strumenti moderni come Astro.js, Hugo o Next.js per rendere il sito più leggero e performante,
      mantenendo l’editing facile tramite WordPress come backend.
</p> </section> ${renderComponent($$result2, "Features2", $$Features2, { "title": "Perch\xE9 scegliere WordPress Slim", "subtitle": "I benefici di passare a una soluzione pi\xF9 moderna e leggera", "columns": 4, "items": [
    {
      title: "\u{1F680} Prestazioni migliorate",
      description: "Un sito statico carica in una frazione di secondo e riduce drasticamente il bounce rate."
    },
    {
      title: "\u{1F512} Pi\xF9 sicurezza",
      description: "Nessun backend esposto: il sito non pu\xF2 essere attaccato da bot o malware."
    },
    {
      title: "\u{1F4C9} Costi ridotti",
      description: "Hosting pi\xF9 economico e niente pi\xF9 aggiornamenti stressanti o plugin pesanti."
    },
    {
      title: "\u{1F9E0} SEO pi\xF9 semplice",
      description: "Codice pulito, struttura chiara, velocit\xE0 top: Google ti premier\xE0."
    }
  ] })} ${renderComponent($$result2, "CallToAction", $$CallToAction, { "title": "Vuoi alleggerire e velocizzare il tuo sito WordPress?", "subtitle": "Contattaci per scoprire se WordPress Slim \xE8 la scelta giusta per il tuo progetto." }, { "actions": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "actions" }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "Button", $$Button, { "variant": "primary", "href": "/contatti" }, { "default": ($$result5) => renderTemplate`Richiedi una consulenza gratuita` })} ` })}` })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/servizi/wordpress-slim-siti-statici-headless.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/servizi/wordpress-slim-siti-statici-headless.astro";
const $$url = "/servizi/wordpress-slim-siti-statici-headless";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$WordpressSlimSitiStaticiHeadless,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
