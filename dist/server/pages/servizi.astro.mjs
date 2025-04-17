import { a as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../chunks/astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import { $ as $$Hero, a as $$CallToAction } from '../chunks/CallToAction_B_LAivtf.mjs';
import { $ as $$Features2 } from '../chunks/Features2_D3mV0ES5.mjs';
import { b as $$PageLayout } from '../chunks/PageLayout_D6vir8IY.mjs';
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
Offriamo servizi di <strong>creazione siti web</strong>, <strong>ottimizzazione SEO</strong>, <strong>digital marketing</strong>
ed <strong>e-commerce</strong>. Lavoriamo per migliorare il posizionamento sui motori di ricerca e aumentare le conversioni.
</p> </section>  ${renderComponent($$result2, "Features2", $$Features2, { "title": "I Nostri Servizi", "subtitle": "Strategie digitali avanzate per migliorare la tua presenza sul web e aumentare i tuoi clienti.", "columns": 4, "items": [
    {
      title: "Creazione Siti Web",
      description: "Sviluppiamo siti web moderni, responsive e veloci, ottimizzati per Google e studiati per convertire visitatori in clienti.",
      icon: "tabler:device-desktop"
    },
    {
      title: "E-commerce",
      description: "Realizziamo negozi online sicuri e performanti, con strategie di vendita ottimizzate per massimizzare le conversioni.",
      icon: "tabler:shopping-cart"
    },
    {
      title: "SEO & Posizionamento",
      description: "Miglioriamo il ranking del tuo sito sui motori di ricerca con strategie avanzate di ottimizzazione SEO on-page e off-page.",
      icon: "tabler:chart-line"
    },
    {
      title: "Branding e Grafica",
      description: "Creiamo loghi e identit\xE0 visive professionali per aumentare la riconoscibilit\xE0 del tuo brand online.",
      icon: "tabler:palette"
    },
    {
      title: "Ottimizzazione Velocit\xE0",
      description: "Riduciamo i tempi di caricamento per migliorare l'esperienza utente e il ranking SEO del tuo sito web.",
      icon: "tabler:rocket"
    },
    {
      title: "Gestione Social Media",
      description: "Creiamo strategie social per aumentare la visibilit\xE0 e l'engagement del tuo business online.",
      icon: "tabler:brand-facebook"
    },
    {
      title: "Web Marketing",
      description: "Campagne pubblicitarie mirate su Google Ads e Facebook Ads per attrarre pi\xF9 clienti.",
      icon: "tabler:speakerphone"
      // ✅ ICONA ESISTENTE
    },
    {
      title: "Sicurezza e Manutenzione",
      description: "Monitoriamo e proteggiamo il tuo sito web con aggiornamenti e backup regolari.",
      icon: "tabler:shield-lock"
    }
  ] })}  <section class="container mx-auto px-4 py-12"> <h2 class="text-3xl font-bold text-center mb-6">
Perché scegliere LS Web Agency?
</h2> <p class="text-lg text-center max-w-3xl mx-auto">
Lavoriamo con un approccio strategico per garantire che ogni sito web sia ottimizzato per i <strong>motori di ricerca</strong> e abbia 
      una struttura perfetta per migliorare la <strong>visibilità su Google</strong>. Affidati a noi per una strategia digitale efficace.
</p> </section>  ${renderComponent($$result2, "CallToAction", $$CallToAction, { "actions": [
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
