import { a as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server_CROlnyxU.mjs';
import 'kleur/colors';
import { $ as $$CallToAction } from '../chunks/CallToAction_BZu4Zfll.mjs';
import { $ as $$Features2 } from '../chunks/Features2_UvSrJcpP.mjs';
import { $ as $$Hero } from '../chunks/Hero_BuKVrzei.mjs';
import { a as $$PageLayout } from '../chunks/PageLayout_Byy34s9y.mjs';
export { renderers } from '../renderers.mjs';

const $$Servizi = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Web Design, SEO e Marketing Digitale a Sassari | LS Web Agency",
    description: "Ottieni il massimo dal tuo business con i nostri servizi di creazione siti web, ottimizzazione SEO, digital marketing ed e-commerce. Soluzioni su misura per aziende e professionisti a Sassari.",
    ignoreTitleTemplate: true
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "actions": [
    {
      variant: "primary",
      text: "Richiedi una consulenza",
      href: "/contatti"
    },
    { text: "Scopri di pi\xF9", href: "#features" }
  ], "image": {
    src: "~/assets/images/servizi-seo-grafica-branding-siti-web.webp",
    alt: "Blocchi di lettere che formano la scritta SEO Audit, concetto di ottimizzazione per i motori di ricerca"
  } }, { "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate` ${maybeRenderHead()}<span class="hidden sm:inline"> <span class="font-semibold">LS Web Agency</span> offre soluzioni professionali di
<strong>creazione siti web</strong>,
<strong>ottimizzazione SEO</strong> e
<strong>marketing digitale</strong>.
        Aiutiamo aziende e professionisti a ottenere più visibilità online e aumentare le conversioni con strategie personalizzate.
</span> <span class="block mb-1 sm:hidden font-bold text-blue-600">
Affidati a LS Web Agency per la tua crescita digitale!
</span>
Scopri come migliorare la tua presenza online con
<strong>SEO avanzata</strong>,
<strong>strategie di digital marketing</strong>
e <strong>siti web performanti</strong>.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate` <span>Strategie Digitali: </span> <span class="text-accent text-gradient dark:text-white highlight">Creazione Siti Web</span>,
<span class="text-accent text-gradient dark:text-white highlight">SEO</span> e
<span class="text-accent text-gradient dark:text-white highlight">Marketing</span> a Sassari
` })}` })}  <section class="container mx-auto px-4 py-12"> <h2 class="text-3xl font-bold text-center mb-6">
Soluzioni Digitali per il Tuo Business
</h2> <p class="text-lg text-center max-w-3xl mx-auto">
Offriamo servizi di <strong>creazione siti web</strong>, <strong>ottimizzazione SEO</strong>, <strong>digital marketing</strong>,
<strong>e-commerce</strong> e soluzioni innovative come <strong>accessibilità digitale avanzata</strong>, <strong>personalizzazione UX con AI</strong> e <strong>web design etico e sostenibile</strong>. Lavoriamo per migliorare il posizionamento sui motori di ricerca e aumentare le conversioni.
</p> </section>  ${renderComponent($$result2, "Features2", $$Features2, { "title": "I Nostri Servizi", "subtitle": "Strategie digitali avanzate per migliorare la tua presenza sul web e aumentare i tuoi clienti.", "columns": 4, "items": [
    {
      title: "Creazione Siti Web",
      description: "Sviluppiamo siti web moderni, responsive e veloci, ottimizzati per Google e studiati per convertire visitatori in clienti.",
      icon: "tabler:device-desktop",
      href: "/servizi/creazione-siti-web-sassari"
    },
    {
      title: "E-commerce",
      description: "Realizziamo negozi online sicuri e performanti, con strategie di vendita ottimizzate per massimizzare le conversioni.",
      icon: "tabler:shopping-cart",
      href: "/servizi/realizzazione-siti-ecommerce"
    },
    {
      title: "SEO & Posizionamento",
      description: "Miglioriamo il ranking del tuo sito sui motori di ricerca con strategie avanzate di ottimizzazione SEO on-page e off-page.",
      icon: "tabler:chart-line",
      href: "/servizi/ottimizzazione-seo-siti-web"
    },
    {
      title: "Branding e Grafica",
      description: "Creiamo loghi e identit\xE0 visive professionali per aumentare la riconoscibilit\xE0 del tuo brand online.",
      icon: "tabler:palette",
      href: "/servizi/branding-e-grafica-siti-web"
    },
    {
      title: "Accessibilit\xE0 Digitale Avanzata",
      description: "Rendi il tuo sito inclusivo e conforme alle normative sull'accessibilit\xE0 digitale.",
      icon: "tabler:disabled",
      href: "/servizi/accessibilita-digitale-avanzata"
    },
    {
      title: "UX con AI",
      description: "Offri un\u2019esperienza personalizzata con soluzioni avanzate basate sull\u2019Intelligenza Artificiale.",
      icon: "tabler:brain",
      href: "/servizi/personalizzazione-ux-intelligenza-artificiale"
    },
    {
      title: "Web Design Etico e Sostenibile",
      description: "Crea siti web sostenibili, rispettosi della privacy e dell\u2019ambiente.",
      icon: "tabler:leaf",
      href: "/servizi/web-design-etico-sostenibile"
    },
    {
      title: "Voucher Digitali Sassari 2025",
      description: "Ottieni fino al 70% di rimborso per la digitalizzazione della tua impresa con il bando Camera di Commercio di Sassari.",
      icon: "tabler:ticket",
      href: "/servizi/voucher-digitali-sassari"
    }
  ] })} ${renderComponent($$result2, "CallToAction", $$CallToAction, { "actions": [
    {
      variant: "primary",
      text: "Richiedi un preventivo gratuito",
      href: "/contatti"
    }
  ], "title": "Vuoi migliorare la tua presenza online?", "subtitle": "Contattaci oggi stesso per una consulenza gratuita e scopri come possiamo aiutarti a crescere con soluzioni digitali su misura." })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/servizi.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/servizi.astro";
const $$url = "/servizi";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Servizi,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
