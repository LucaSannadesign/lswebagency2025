import { c as createAstro, a as createComponent, m as maybeRenderHead, u as unescapeHTML, b as renderTemplate, r as renderComponent, F as Fragment } from '../chunks/astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import { $ as $$Button, b as $$PageLayout } from '../chunks/PageLayout_D6vir8IY.mjs';
import { $ as $$Features2 } from '../chunks/Features2_D3mV0ES5.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro("https://lswebagency.com");
const $$HeroText = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HeroText;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline,
    content = await Astro2.slots.render("content"),
    callToAction = await Astro2.slots.render("callToAction"),
    callToAction2 = await Astro2.slots.render("callToAction2")
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<section class="relative md:-mt-[76px] not-prose"> <div class="absolute inset-0 pointer-events-none" aria-hidden="true"></div> <div class="relative max-w-7xl mx-auto px-4 sm:px-6"> <div class="pt-0 md:pt-[76px] pointer-events-none"></div> <div class="py-12 md:py-20 pb-8 md:pb-8"> <div class="text-center max-w-5xl mx-auto"> ${tagline && renderTemplate`<p class="text-base text-secondary dark:text-blue-200 font-bold tracking-wide uppercase">${unescapeHTML(tagline)}</p>`} ${title && renderTemplate`<h1 class="text-5xl md:text-6xl font-bold leading-tighter tracking-tighter mb-4 font-heading dark:text-gray-200">${unescapeHTML(title)}</h1>`} <div class="max-w-3xl mx-auto"> ${subtitle && renderTemplate`<p class="text-xl text-muted mb-6 dark:text-slate-300">${unescapeHTML(subtitle)}</p>`} <div class="max-w-xs sm:max-w-md m-auto flex flex-nowrap flex-col sm:flex-row sm:justify-center gap-4"> ${callToAction && renderTemplate`<div class="flex w-full sm:w-auto"> ${typeof callToAction === "string" ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(callToAction)}` })}` : renderTemplate`${renderComponent($$result, "Button", $$Button, { "variant": "primary", ...callToAction })}`} </div>`} ${callToAction2 && renderTemplate`<div class="flex w-full sm:w-auto"> ${typeof callToAction2 === "string" ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(callToAction2)}` })}` : renderTemplate`${renderComponent($$result, "Button", $$Button, { ...callToAction2 })}`} </div>`} </div> </div> ${content && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${unescapeHTML(content)}` })}`} </div> </div> </div> </section>`;
}, "/Users/lucasanna/lswebagency2025/src/components/widgets/HeroText.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Contatti = createComponent(async ($$result, $$props, $$slots) => {
  const metadata = {
    title: "Contatti - LS Web Agency",
    description: "Hai bisogno di informazioni? Contattaci per una consulenza gratuita e scopri come possiamo aiutarti a realizzare il tuo progetto digitale.",
    canonical: "/contatti",
    openGraph: {
      type: "website",
      url: "https://lswebagency.com/contatti",
      title: "Contatti - LS Web Agency",
      description: "Mettiti in contatto con noi per discutere il tuo progetto e scoprire le migliori soluzioni digitali su misura."
    },
    twitter: {
      card: "summary_large_image",
      site: "@lswebagency",
      title: "Contatti - LS Web Agency",
      description: "Richiedi una consulenza gratuita e scopri le soluzioni digitali su misura per il tuo business."
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">\n    {JSON.stringify({\n      "@context": "https://schema.org",\n      "@type": "ContactPage",\n      "name": metadata.title,\n      "description": metadata.description,\n      "url": metadata.openGraph.url,\n      "image": metadata.openGraph.images[0].url,\n      "publisher": {\n        "@type": "Organization",\n        "name": "LS Web Agency",\n        "logo": "https://lswebagency.com/images/logo.png",\n        "contactPoint": {\n          "@type": "ContactPoint",\n          "telephone": "+39 340 3223 494",\n          "contactType": "customer support",\n          "email": "info@lswebagency.com",\n          "areaServed": "IT",\n          "availableLanguage": ["Italian", "English"]\n        }\n      }\n    })}\n  <\/script>  ', "  ", `<section class="text-center max-w-3xl mx-auto mb-8"> <p class="text-xl font-medium">
Hai un progetto in mente? Siamo pronti ad ascoltarti e offrirti la soluzione su misura per te.
<span class="text-blue-500">Contattaci oggi stesso</span> e trasforma le tue idee in realt\xE0!
</p> </section>  <div class="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl"> <form id="contactForm" class="space-y-4" action="/api/contatti" method="POST"> <!-- Timestamp anti-bot --> <input type="hidden" name="timestamp" id="formTimestamp"> <!-- Honeypot (anti-bot) --> <div style="display: none;"> <label for="honeypot">Lascia questo campo vuoto</label> <input type="text" name="honeypot" id="honeypot"> </div> <!-- Nome e Cognome --> <div> <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
Nome e Cognome <span class="text-red-500">*</span> </label> <input type="text" id="name" name="user_name" placeholder="Inserisci il tuo nome" required autocomplete="name" class="input-field"> </div> <!-- Email e Numero di Telefono --> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
Email <span class="text-red-500">*</span> </label> <input type="email" id="email" name="user_email" placeholder="esempio@email.com" required autocomplete="email" class="input-field"> </div> <div> <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
Numero di Telefono
</label> <input type="tel" id="phone" name="user_phone" placeholder="+39 340 1234567" autocomplete="tel" class="input-field"> </div> </div> <!-- Selezione del Servizio --> <div> <label for="service" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
Seleziona il servizio di tuo interesse
</label> <select id="service" name="user_service" required class="input-field"> <option value="" disabled selected hidden>Seleziona un\u2019opzione</option> <option value="siti-web">Creazione Sito Web</option> <option value="ecommerce">E-commerce</option> <option value="seo">Ottimizzazione SEO</option> <option value="grafica">Branding e Grafica</option> <option value="altro">Altro</option> </select> </div> <!-- Messaggio --> <div> <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
Messaggio
</label> <textarea id="message" name="user_message" rows="5" placeholder="Descrivi il tuo progetto..." required autocomplete="off" class="input-field"></textarea> </div> <!-- Checkbox Privacy --> <div class="flex items-start"> <input type="checkbox" id="privacy" name="privacy" required class="checkbox"> <label for="privacy" class="ml-2 text-sm text-gray-600 dark:text-gray-400"> <span class="text-red-500">*</span> Confermi di accettare la raccolta e l\u2019elaborazione dei tuoi dati personali.
</label> </div> <!-- Pulsante di Invio --> <button type="submit" class="btn-submit">Invia Richiesta</button> </form> <script type="module">
    document.getElementById("formTimestamp").value = Date.now();
  
    document.getElementById("contactForm").addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const form = e.target;
      const honeypot = document.getElementById("honeypot").value;
      if (honeypot) return console.log("Spam bloccato!");
  
      const formData = new FormData(form);
  
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        window.location.href = "/grazie";
      } else {
        alert("Errore durante l'invio. Riprova.");
      }
    });
  <\/script> </div>  `, " "])), renderComponent($$result2, "HeroText", $$HeroText, { "tagline": "Contatti", "title": "Hai bisogno di informazioni?" }), maybeRenderHead(), renderComponent($$result2, "Features2", $$Features2, { "title": "Siamo qui per aiutarti!", "columns": 4, "items": [
    {
      title: "Contatti Rapidi",
      description: `
        <div class="flex gap-4 mt-2">
          <a href="https://wa.me/393403223494" target="_blank" class="btn-whatsapp flex items-center gap-2">
            <img src="/icons/whatsapp.svg" alt="WhatsApp" class="w-6 h-6" /> WhatsApp
          </a>
          <a href="https://t.me/lswebagency" target="_blank" class="btn-telegram flex items-center gap-2">
            <img src="/icons/telegram.svg" alt="Telegram" class="w-6 h-6" /> Telegram
          </a>
        </div>
        `,
      icon: "tabler:message"
    },
    {
      title: "Telefono",
      description: '<a href="tel:+393403223494" class="contact-link">+39 340 3223 494</a>',
      icon: "tabler:headset"
    },
    {
      title: "Email",
      description: '<a href="mailto:info@lswebagency.com" class="contact-link">info@lswebagency.com</a>',
      icon: "tabler:mail"
    },
    {
      title: "Indirizzo",
      description: "Via Alcide De Gasperi, 3, 07100 Sassari, Italia",
      icon: "tabler:map-pin"
    }
  ] })) })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/contatti.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/contatti.astro";
const $$url = "/contatti";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Contatti,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
