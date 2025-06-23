import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, F as Fragment } from '../chunks/astro/server_CROlnyxU.mjs';
import 'kleur/colors';
import { $ as $$Features3 } from '../chunks/Features3_BFKMk91D.mjs';
import { $ as $$Hero } from '../chunks/Hero_BuKVrzei.mjs';
import { a as $$PageLayout } from '../chunks/PageLayout_Byy34s9y.mjs';
import { $ as $$CallToAction } from '../chunks/CallToAction_BZu4Zfll.mjs';
export { renderers } from '../renderers.mjs';

const $$ChiSiamo = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Chi Siamo - LS Web Agency",
    description: "LS Web Agency \xE8 un progetto di Luca Sanna, web designer e developer con oltre 15 anni di esperienza nello sviluppo di siti web e applicazioni. Collaboriamo con esperti per offrire soluzioni digitali di alta qualit\xE0."
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "tagline": "Chi Siamo", "title": `<span class="text-gradient">Strategie Digitali</span> e 
     <span class="text-gradient">Creazione Siti Web</span> su Misura`, "subtitle": "Aiutiamo aziende e professionisti a trasformare la loro presenza online con siti web innovativi, ottimizzati per SEO e performance elevate.", "image": {
    src: "~/assets/images/team-sviluppo-siti-web.webp",
    alt: "Team al lavoro"
  } })}  ${maybeRenderHead()}<section class="py-16 text-center"> <div class="container mx-auto px-4"> <h2 class="text-3xl font-bold">Chi è LS Web Agency?</h2> <p class="text-lg mt-4 max-w-2xl mx-auto"> <strong>LS Web Agency</strong> è un progetto fondato da <strong>Luca Sanna</strong>, web designer e developer con oltre 15 anni di esperienza 
        nello sviluppo di siti web e applicazioni.  
        Il nostro obiettivo è unire competenze e professionalità per offrire soluzioni digitali
<strong>di alta qualità</strong>, con un approccio su misura per ogni cliente.
</p> </div> </section>  ${renderComponent($$result2, "Features3", $$Features3, { "title": "I Nostri Servizi", "subtitle": "Ogni progetto \xE8 studiato per ottenere il massimo dei risultati.", "columns": 3, "isBeforeContent": true, "items": [
    {
      title: "Creazione Siti Web",
      description: "Realizziamo siti web personalizzati, responsive e ottimizzati per ogni dispositivo.",
      icon: "tabler:template"
    },
    {
      title: "SEO e Posizionamento",
      description: "Miglioriamo il ranking sui motori di ricerca con strategie SEO avanzate.",
      icon: "tabler:search"
    },
    {
      title: "Branding e Identit\xE0 Visiva",
      description: "Costruiamo la tua immagine online con grafiche accattivanti e un\u2019identit\xE0 forte.",
      icon: "tabler:palette"
    }
  ] })}  <section class="py-16"> <div class="container mx-auto px-4"> <h2 class="text-3xl font-bold text-center mb-6">I Nostri Valori</h2> <p class="text-center text-muted max-w-3xl mx-auto mb-10">
La nostra filosofia si basa su qualità, trasparenza e innovazione. Ogni sito web che realizziamo è il risultato
        di una visione strategica e di un impegno costante per offrire il massimo valore ai nostri clienti.
</p> <div class="grid grid-cols-1 md:grid-cols-2 gap-10"> <!-- Colonna Sinistra --> <div class="space-y-6"> <div class="flex items-start space-x-4"> <span class="text-accent text-3xl">📈</span> <div> <h3 class="text-lg font-semibold">Innovazione Continua</h3> <p class="text-muted">
Esploriamo nuove tecnologie e seguiamo le ultime tendenze per creare soluzioni digitali avanzate e
                performanti.
</p> </div> </div> <div class="flex items-start space-x-4"> <span class="text-accent text-3xl">⭐</span> <div> <h3 class="text-lg font-semibold">Eccellenza e Qualità</h3> <p class="text-muted">
Lavoriamo con precisione per garantire siti web veloci, sicuri e dall’estetica impeccabile.
</p> </div> </div> <div class="flex items-start space-x-4"> <span class="text-accent text-3xl">🛡️</span> <div> <h3 class="text-lg font-semibold">Trasparenza e Affidabilità</h3> <p class="text-muted">
Costruiamo relazioni di fiducia con i nostri clienti attraverso comunicazione chiara e supporto continuo.
</p> </div> </div> </div> <!-- Colonna Destra --> <div class="space-y-6"> <div class="flex items-start space-x-4"> <span class="text-accent text-3xl">👥</span> <div> <h3 class="text-lg font-semibold">Focus sul Cliente</h3> <p class="text-muted">
Ogni progetto è creato su misura per soddisfare le esigenze e gli obiettivi specifici di ogni cliente.
</p> </div> </div> <div class="flex items-start space-x-4"> <span class="text-accent text-3xl">🎨</span> <div> <h3 class="text-lg font-semibold">Creatività e Passione</h3> <p class="text-muted">
La nostra esperienza e passione per il design ci permettono di realizzare siti web unici e coinvolgenti.
</p> </div> </div> <div class="flex items-start space-x-4"> <span class="text-accent text-3xl">📊</span> <div> <h3 class="text-lg font-semibold">Risultati Misurabili</h3> <p class="text-muted">
Monitoriamo costantemente il rendimento dei siti per garantire una crescita continua e successi concreti.
</p> </div> </div> </div> </div> </div> </section> ${renderComponent($$result2, "CallToAction", $$CallToAction, { "title": "Vuoi un sito web professionale?", "subtitle": "Parliamone e troviamo la soluzione perfetta per la tua attivit\xE0." }, { "actions": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "actions" }, { "default": ($$result4) => renderTemplate` <a href="/contatti" class="btn-primary">Richiedi una consulenza</a> ` })}` })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/chi-siamo.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/chi-siamo.astro";
const $$url = "/chi-siamo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ChiSiamo,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
