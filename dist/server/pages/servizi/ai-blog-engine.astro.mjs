import { a as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_CROlnyxU.mjs';
import 'kleur/colors';
import { a as $$PageLayout, $ as $$Button } from '../../chunks/PageLayout_Byy34s9y.mjs';
import { $ as $$Hero } from '../../chunks/Hero_BuKVrzei.mjs';
import blogSeoImage from '../../chunks/blog-seo-ai_g6jz8k0r.mjs';
export { renderers } from '../../renderers.mjs';

const $$AiBlogEngine = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "AI Blog Engine | Contenuti SEO per il tuo sito, senza sforzi",
    description: "Crea articoli ottimizzati con l\u2019aiuto dell\u2019intelligenza artificiale e la supervisione umana. Il tuo blog lavora per te, ogni settimana.",
    canonical: "https://www.lswebagency.com/servizi/ai-blog-engine",
    robots: "index, follow"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, { "tagline": "Contenuti SEO senza stress", "image": {
    src: blogSeoImage,
    alt: "Creazione articoli SEO con AI e revisione umana"
  } }, { "actions": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "actions" }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "Button", $$Button, { "variant": "primary", "href": "#form-ai-blog" }, { "default": ($$result5) => renderTemplate`
Richiedi il tuo piano articoli
` })} ` })}`, "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate`
Generiamo articoli ottimizzati SEO grazie all’intelligenza artificiale, rifiniti da un professionista.
      Tu approvi, il tuo sito cresce.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
AI Blog Engine:
${maybeRenderHead()}<span class="text-accent text-gradient dark:text-white highlight">il tuo blog si scrive da solo</span> ` })}` })} <section class="container mx-auto px-6 py-12 text-lg text-gray-700 dark:text-gray-300"> <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
Come funziona il nostro servizio AI Blog Engine
</h2> <ul class="max-w-3xl mx-auto space-y-6 list-disc list-inside"> <li><strong>Analisi SEO iniziale:</strong> identifichiamo le parole chiave strategiche del tuo settore.</li> <li><strong>Scrittura articoli con AI:</strong> usiamo prompt avanzati per creare bozze ottimizzate.</li> <li><strong>Revisione umana:</strong> stile, struttura, leggibilità e meta SEO rifinite da un esperto.</li> <li><strong>Immagini e link interni:</strong> inclusi nel pacchetto.</li> <li><strong>Pubblicazione (opzionale):</strong> possiamo occuparci anche del caricamento e programmazione degli articoli.</li> </ul> </section> <section class="container mx-auto px-6 py-12 text-lg text-gray-700 dark:text-gray-300"> <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
A chi è rivolto?
</h2> <p class="text-center max-w-3xl mx-auto">
Il nostro servizio è perfetto per aziende, studi professionali, e-commerce, freelance e chiunque voglia avere un blog attivo senza perdere tempo.
</p> </section> <section id="form-ai-blog" class="container mx-auto px-6 py-12 text-lg text-gray-700 dark:text-gray-300"> <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
Richiedi un piano articoli su misura per il tuo sito
</h2> <form method="POST" action="https://formspree.io/f/{your-form-id}" class="max-w-2xl mx-auto grid gap-6"> <input type="text" name="name" placeholder="Nome e Cognome" required class="form-input"> <input type="email" name="email" placeholder="Email" required class="form-input"> <input type="text" name="website" placeholder="Sito web" class="form-input"> <select name="settore" required class="form-select"> <option value="">In quale settore opera il tuo sito?</option> <option value="professionale">Studio professionale</option> <option value="aziendale">Servizi aziendali</option> <option value="ecommerce">E-commerce</option> <option value="personale">Blog personale</option> <option value="altro">Altro</option> </select> <select name="frequenza" required class="form-select"> <option value="">Quanti articoli vorresti al mese?</option> <option value="2">2 articoli/mese</option> <option value="4">4 articoli/mese</option> <option value="custom">Da valutare insieme</option> </select> <textarea name="note" placeholder="Obiettivi del blog o note aggiuntive" rows="4" class="form-textarea"></textarea> <button type="submit" class="btn btn-primary">Invia richiesta</button> </form> </section> ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/servizi/ai-blog-engine.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/servizi/ai-blog-engine.astro";
const $$url = "/servizi/ai-blog-engine";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$AiBlogEngine,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
