import { a as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_CxdTwKPW.mjs';
import 'kleur/colors';
import { $ as $$Features3 } from '../../chunks/Features3_DAH-Tj5z.mjs';
import { $ as $$Hero, a as $$CallToAction } from '../../chunks/CallToAction_3LqHQJgP.mjs';
import { b as $$PageLayout } from '../../chunks/PageLayout_CAIoFVlp.mjs';
import { $ as $$Testimonials } from '../../chunks/Testimonials_BfjZBoEo.mjs';
import { Icon } from '@iconify/react';
export { renderers } from '../../renderers.mjs';

const $$RealizzazioneSitiEcommerce = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Creazione E-commerce a Sassari | Siti Vendita Online Professionali - LS Web Agency",
    description: "Scopri il nostro servizio di creazione e-commerce a Sassari: soluzioni scalabili, ottimizzate per SEO e progettate per vendere online con successo."
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "actions": [
    {
      variant: "primary",
      text: "Scopri le soluzioni E-commerce",
      href: "/contatti"
    },
    { text: "Portfolio", href: "/portfolio" }
  ], "image": {
    src: "~/assets/images/ecommerce-business-online.webp",
    alt: "Negozio online con prodotti in vendita e dashboard di gestione e-commerce",
    width: 800,
    height: 600
  } }, { "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate` ${maybeRenderHead()}<span class="hidden sm:inline"> <span class="font-semibold">LS Web Agency</span> sviluppa <strong>soluzioni E-commerce</strong> su misura, <strong>scalabili</strong> e ottimizzate per il <strong>SEO</strong>, garantendo vendite online di successo.
</span> <span class="block mb-1 sm:hidden font-bold text-blue-600">
Il tuo business online, senza limiti.
</span>
Dai piccoli shop online ai <strong>marketplace avanzati</strong>, realizziamo piattaforme performanti per far crescere il tuo brand.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
Creazione <span class="text-accent text-gradient dark:text-white highlight">E-commerce a Sassari</span> ` })}` })}  ${renderComponent($$result2, "Features3", $$Features3, { "title": "I nostri servizi per il tuo E-commerce", "subtitle": "Soluzioni personalizzate per ogni esigenza di vendita online.", "columns": 3, "isBeforeContent": true, "items": [
    {
      title: "Design Intuitivo e Coinvolgente",
      description: "Esperienza utente ottimizzata per aumentare le conversioni.",
      icon: "tabler:template"
    },
    {
      title: "SEO e Visibilit\xE0 Online",
      description: "Ottimizzazione avanzata per scalare i risultati su Google.",
      icon: "tabler:search"
    },
    {
      title: "Sicurezza e Affidabilit\xE0",
      description: "Protezione avanzata per dati sensibili e pagamenti sicuri.",
      icon: "tabler:shield-check"
    }
  ] })}  <section class="py-16"> <div class="container mx-auto px-4"> <h2 class="text-3xl font-bold text-center mb-6">Perché scegliere noi?</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-10"> <div class="space-y-6"> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:trophy", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Esperienza nel settore</h3> <p class="text-muted">Sviluppiamo <strong>e-commerce professionali</strong> per aziende di ogni settore.</p> </div> </div> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:credit-card", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Pagamenti Sicuri</h3> <p class="text-muted">Integrazione con i <strong>migliori gateway</strong> di pagamento online.</p> </div> </div> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:chart-line", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Strategia di Crescita</h3> <p class="text-muted">Analisi delle performance per <strong>migliorare conversioni e vendite</strong>.</p> </div> </div> </div> <div class="space-y-6"> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:shopping-cart", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Gestione Semplice</h3> <p class="text-muted">Pannello intuitivo per <strong>gestire prodotti, ordini e clienti</strong>.</p> </div> </div> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:device-mobile", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Mobile-First</h3> <p class="text-muted">Esperienza d’acquisto ottimizzata per <strong>smartphone e tablet</strong>.</p> </div> </div> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:users", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Supporto Continuo</h3> <p class="text-muted">Ti assistiamo in <strong>ogni fase della crescita</strong> del tuo shop online.</p> </div> </div> </div> </div> </div> </section>  ${renderComponent($$result2, "Testimonials", $$Testimonials, {})}  ${renderComponent($$result2, "CallToAction", $$CallToAction, { "title": "Vuoi creare il tuo E-commerce?", "subtitle": "Contattaci oggi stesso per vendere online con una piattaforma su misura." }, { "actions": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "actions" }, { "default": ($$result4) => renderTemplate` <a href="/contatti" class="btn-primary">Richiedi una consulenza</a> ` })}` })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/servizi/realizzazione-siti-ecommerce.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/servizi/realizzazione-siti-ecommerce.astro";
const $$url = "/servizi/realizzazione-siti-ecommerce";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$RealizzazioneSitiEcommerce,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
