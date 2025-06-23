import { a as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_CROlnyxU.mjs';
import 'kleur/colors';
import { $ as $$Features3 } from '../../chunks/Features3_BFKMk91D.mjs';
import { $ as $$Hero } from '../../chunks/Hero_BuKVrzei.mjs';
import { a as $$PageLayout } from '../../chunks/PageLayout_Byy34s9y.mjs';
import { $ as $$Testimonials } from '../../chunks/Testimonials_BFCWlP0D.mjs';
import { $ as $$CallToAction } from '../../chunks/CallToAction_BZu4Zfll.mjs';
import { Icon } from '@iconify/react';
export { renderers } from '../../renderers.mjs';

const $$BrandingEGraficaSitiWeb = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Branding e Grafica per Siti Web a Sassari | LS Web Agency",
    description: "Distinguiti con un design unico! Offriamo servizi di branding, grafica e UX design per siti web a Sassari e in tutta Italia. Richiedi una consulenza."
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "actions": [
    {
      variant: "primary",
      text: "Scopri i nostri servizi",
      href: "/servizi"
    },
    { text: "Portfolio", href: "/portfolio" }
  ], "image": {
    src: "~/assets/images/branding-grafica-ls-webagencywebp.webp",
    alt: "Studio di branding e grafica per siti web professionali a Sassari"
  } }, { "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate` ${maybeRenderHead()}<span class="hidden sm:inline"> <span class="font-semibold">Distinguiti dalla concorrenza</span> con un’identità visiva forte e un <strong>design professionale</strong> studiato per il web.
</span> <span class="block mb-1 sm:hidden font-bold text-blue-600">
Dai valore al tuo brand con un design strategico.
</span>
Realizziamo <strong>progetti di grafica per il web</strong>, sviluppando <strong>interfacce accattivanti</strong>, <strong>grafiche per landing page</strong> e materiali visivi che valorizzano il tuo brand. Creiamo <strong>loghi e marchi distintivi</strong> per rafforzare <strong>l’identità aziendale online</strong> e migliorare <strong>la comunicazione visiva</strong>.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate` <span class="text-gradient">Branding e Grafica</span> per Siti Web a Sassari
` })}` })}  ${renderComponent($$result2, "Features3", $$Features3, { "title": "I nostri servizi di Branding e Grafica", "subtitle": "Un'identit\xE0 visiva forte \xE8 il primo passo per il successo online.", "columns": 4, "isBeforeContent": true, "items": [
    {
      title: "Design Unico e Personalizzato",
      description: "Creiamo interfacce accattivanti che rispecchiano la tua identit\xE0 aziendale.",
      icon: "tabler:brush"
    },
    {
      title: "Brand Identity",
      description: "Dallo studio del logo alla scelta della palette colori e tipografia, tutto su misura per te.",
      icon: "tabler:palette"
    },
    {
      title: "User Experience (UX)",
      description: "Miglioriamo la navigazione e l\u2019usabilit\xE0 del sito per un\u2019esperienza ottimale.",
      icon: "tabler:cursor-text"
    },
    {
      title: "Materiale Grafico",
      description: "Forniamo immagini, icone e elementi visivi professionali per il tuo sito.",
      icon: "tabler:photo"
    }
  ] })}  <section class="py-16"> <div class="container mx-auto px-4"> <h2 class="text-3xl font-bold text-center mb-6">Perché scegliere noi?</h2> <div class="grid grid-cols-1 md:grid-cols-2 gap-10"> <div class="space-y-6"> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:trophy", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Esperienza e Creatività</h3> <p class="text-muted">Anni di esperienza nel <strong>graphic design e branding</strong> per garantire soluzioni su misura.</p> </div> </div> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:palette", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Design Moderno e Memorabile</h3> <p class="text-muted">Ogni progetto è studiato per creare un’identità unica e riconoscibile.</p> </div> </div> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:shield-check", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Qualità Garantita</h3> <p class="text-muted">Precisione e cura in ogni dettaglio per un risultato professionale.</p> </div> </div> </div> <div class="space-y-6"> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:users", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Approccio Personalizzato</h3> <p class="text-muted">Ogni progetto è sviluppato su misura per il cliente.</p> </div> </div> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:graph", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Strategia e Risultati</h3> <p class="text-muted">Analizziamo il mercato per creare soluzioni che migliorano la conversione.</p> </div> </div> <div class="flex items-start space-x-4"> ${renderComponent($$result2, "Icon", Icon, { "icon": "tabler:check", "class": "text-accent text-3xl" })} <div> <h3 class="text-lg font-semibold">Supporto Continuo</h3> <p class="text-muted">Ti seguiamo in tutto il percorso di creazione e ottimizzazione.</p> </div> </div> </div> </div> </div> </section>  ${renderComponent($$result2, "Testimonials", $$Testimonials, {})}  ${renderComponent($$result2, "CallToAction", $$CallToAction, { "title": "Vuoi un\u2019identit\xE0 visiva forte per il tuo brand?", "subtitle": "Contattaci oggi stesso e rendiamo il tuo marchio unico." }, { "actions": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "actions" }, { "default": ($$result4) => renderTemplate` <a href="/contatti" class="btn-primary">Richiedi una consulenza</a> ` })}` })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/servizi/branding-e-grafica-siti-web.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/servizi/branding-e-grafica-siti-web.astro";
const $$url = "/servizi/branding-e-grafica-siti-web";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BrandingEGraficaSitiWeb,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
