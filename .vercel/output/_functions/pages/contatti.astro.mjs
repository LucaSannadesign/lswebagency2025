import { c as createAstro, a as createComponent, m as maybeRenderHead, u as unescapeHTML, b as renderTemplate, r as renderComponent, F as Fragment } from '../chunks/astro/server_CxdTwKPW.mjs';
import 'kleur/colors';
import { $ as $$Button, b as $$PageLayout } from '../chunks/PageLayout_CAIoFVlp.mjs';
import { $ as $$Features2 } from '../chunks/Features2_DlVf7SiC.mjs';
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
const $$Contatti = createComponent(($$result, $$props, $$slots) => {
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
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([' <script type="application/ld+json">\n    {JSON.stringify({\n      "@context": "https://schema.org",\n      "@type": "ContactPage",\n      "name": metadata.title,\n      "description": metadata.description,\n      "url": metadata.openGraph.url,\n      "image": metadata.openGraph.images[0].url,\n      "publisher": {\n        "@type": "Organization",\n        "name": "LS Web Agency",\n        "logo": "https://lswebagency.com/images/logo.png",\n        "contactPoint": {\n          "@type": "ContactPoint",\n          "telephone": "+39 340 3223 494",\n          "contactType": "customer support",\n          "email": "info@lswebagency.com",\n          "areaServed": "IT",\n          "availableLanguage": ["Italian", "English"]\n        }\n      }\n    })}\n  <\/script>  ', "  ", '<section class="text-center max-w-3xl mx-auto mb-8"> <p class="text-xl font-medium">\nHai un progetto in mente? Siamo pronti ad ascoltarti e offrirti la soluzione su misura per te.\n<span class="text-blue-500">Contattaci oggi stesso</span> e trasforma le tue idee in realt\xE0!\n</p> </section>  <div class="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl"> <form id="contactForm" class="space-y-4" action="https://formsubmit.co/info@lswebagency.com" method="POST"> <input type="hidden" name="_next" value="https://lswebagency.com/grazie"> <input type="hidden" name="_autoresponse" value="Grazie per averci contattato! Ti risponderemo al pi\xF9 presto."> <input type="hidden" name="_subject" value="Nuova richiesta da LS Web Agency"> <!-- Nome e Cognome --> <div> <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">\nNome e Cognome <span class="text-red-500">*</span> </label> <input type="text" id="name" name="name" placeholder="Inserisci il tuo nome" required autocomplete="name" class="input-field"> </div> <!-- Email e Numero di Telefono --> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">\nEmail <span class="text-red-500">*</span> </label> <input type="email" id="email" name="email" placeholder="esempio@email.com" required autocomplete="email" class="input-field"> </div> <div> <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">\nNumero di Telefono\n</label> <input type="tel" id="phone" name="phone" placeholder="+39 340 1234567" autocomplete="tel" class="input-field"> </div> </div> <!-- Selezione del Servizio --> <div> <label for="service" class="block text-sm font-medium text-gray-700 dark:text-gray-300">\nSeleziona il servizio di tuo interesse\n</label> <select id="service" name="service" required class="input-field"> <option value="" disabled selected hidden>Seleziona un\u2019opzione</option> <option value="siti-web">Creazione Sito Web</option> <option value="ecommerce">E-commerce</option> <option value="seo">Ottimizzazione SEO</option> <option value="grafica">Branding e Grafica</option> <option value="altro">Altro</option> </select> </div> <!-- Messaggio --> <div> <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">\nMessaggio\n</label> <textarea id="message" name="message" rows="5" placeholder="Descrivi il tuo progetto..." required autocomplete="off" class="input-field"></textarea> </div> <!-- Checkbox Privacy --> <div class="flex items-start"> <input type="checkbox" id="privacy" name="privacy" required class="checkbox"> <label for="privacy" class="ml-2 text-sm text-gray-600 dark:text-gray-400"> <span class="text-red-500">*</span> Confermi di accettare la raccolta e l\u2019elaborazione dei tuoi dati personali.\n</label> </div> <!-- Google reCAPTCHA --> <div class="g-recaptcha" data-sitekey="6LfAvvMqAAAAAPZQTFe6CX_8HZ61-tX_v0HlbBaD"></div> <!-- Pulsante di Invio --> <button type="submit" class="btn-submit">Invia Richiesta</button> </form> <!-- Script reCAPTCHA --> <script src="https://www.google.com/recaptcha/api.js" async defer><\/script> </div>  ', " "])), renderComponent($$result2, "HeroText", $$HeroText, { "tagline": "Contatti", "title": "Hai bisogno di informazioni?" }), maybeRenderHead(), renderComponent($$result2, "Features2", $$Features2, { "title": "Siamo qui per aiutarti!", "columns": 4, "items": [
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
