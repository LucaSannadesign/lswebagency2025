import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import { b as $$PageLayout } from '../chunks/PageLayout_D6vir8IY.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Terms = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": {
    title: "Termini e Condizioni - LS Web Agency",
    description: "Leggi i termini e condizioni per l'uso dei servizi di LS Web Agency. Informazioni su privacy, responsabilit\xE0 e regolamenti aziendali.",
    canonical: "/termini-condizioni",
    openGraph: {
      type: "article",
      url: "https://lswebagency.com/termini-condizioni",
      title: "Termini e Condizioni - LS Web Agency",
      description: "Consulta i nostri Termini e Condizioni per conoscere i diritti e le responsabilit\xE0 nell'utilizzo dei nostri servizi."
    },
    twitter: {
      card: "summary_large_image",
      site: "@lswebagency",
      title: "Termini e Condizioni - LS Web Agency",
      description: "Consulta i nostri Termini e Condizioni per conoscere i diritti e le responsabilit\xE0 nell'utilizzo dei nostri servizi.",
      image: "https://lswebagency.com/images/terms-og.jpg"
    }
  } }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([` <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Termini e Condizioni - LS Web Agency",
      "description": "Consulta i nostri Termini e Condizioni per conoscere i diritti e le responsabilit\xE0 nell'utilizzo dei nostri servizi.",
      "url": "https://lswebagency.com/termini-condizioni",
      "publisher": {
        "@type": "Organization",
        "name": "LS Web Agency",
        "logo": "https://lswebagency.com/images/logo.png"
      }
    })}
  <\/script> `, `<section class="container mx-auto px-6 py-12 text-lg text-gray-700 dark:text-gray-300"> <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
Termini e Condizioni
</h2> <p class="text-center max-w-3xl mx-auto mb-8">
Ultimo aggiornamento: <strong>14 Marzo 2025</strong> </p> <h3 class="text-2xl font-semibold mt-8">1. Interpretazione e Definizioni</h3> <h4 class="text-xl font-semibold mt-6">1.1 Interpretazione</h4> <p>Le parole con l'iniziale maiuscola hanno un significato specifico, come definito nelle sezioni seguenti.</p> <h4 class="text-xl font-semibold mt-6">1.2 Definizioni</h4> <ul class="list-disc list-inside"> <li><strong>Azienda:</strong> LS Web Agency, con sede a Sassari, Italia.</li> <li><strong>Servizio:</strong> Il sito web <a href="https://lswebagency.com" class="text-blue-500 underline">LS Web Agency</a> e i relativi servizi.</li> <li><strong>Utente:</strong> Qualsiasi individuo o azienda che accede al Servizio.</li> <li><strong>Termini:</strong> Le presenti condizioni che regolano l'uso del Servizio.</li> </ul> <h3 class="text-2xl font-semibold mt-8">2. Accettazione dei Termini</h3> <p>
L'uso del nostro sito e dei nostri servizi implica l'accettazione delle presenti condizioni. 
      Se non accetti i Termini, ti invitiamo a non utilizzare il Servizio.
</p> <h3 class="text-2xl font-semibold mt-8">3. Limitazioni di Responsabilit\xE0</h3> <p>
LS Web Agency non \xE8 responsabile per danni derivanti dall'uso del Servizio, salvo diversa disposizione di legge.
</p> <h3 class="text-2xl font-semibold mt-8">4. Modifiche ai Termini</h3> <p>
Ci riserviamo il diritto di modificare i Termini in qualsiasi momento. 
      Le modifiche saranno effettive dalla loro pubblicazione sul sito.
</p> <h3 class="text-2xl font-semibold mt-8">5. Contatti</h3> <p>
Per qualsiasi domanda sui presenti Termini e Condizioni, puoi contattarci via email:
<a href="mailto:info@lswebagency.com" class="text-blue-500 underline">info@lswebagency.com</a>.
</p> </section> `])), maybeRenderHead()) })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/terms.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/terms.astro";
const $$url = "/terms";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Terms,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
