import { c as createAstro, a as createComponent, m as maybeRenderHead, u as unescapeHTML, b as renderTemplate, r as renderComponent, F as Fragment } from '../chunks/astro/server_CROlnyxU.mjs';
import 'kleur/colors';
import { $ as $$Button, a as $$PageLayout } from '../chunks/PageLayout_Byy34s9y.mjs';
import { $ as $$Features2 } from '../chunks/Features2_UvSrJcpP.mjs';
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
    description: "Hai bisogno di informazioni? Contattaci per una consulenza gratuita.",
    canonical: "/contatti",
    openGraph: {
      type: "website",
      url: "https://lswebagency.com/contatti",
      title: "Contatti - LS Web Agency",
      description: "Contattaci per discutere il tuo progetto."
    },
    twitter: {
      card: "summary_large_image",
      site: "@lswebagency",
      title: "Contatti - LS Web Agency",
      description: "Richiedi una consulenza gratuita."
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate(_a || (_a = __template(["  ", " ", '<section class="text-center max-w-3xl mx-auto mb-12"> <p class="text-xl font-medium">\nHai un progetto in mente?\n<a href="#contact" class="text-blue-500 underline"> Contattaci oggi stesso</a>\ne trasformiamo le tue idee in realt\xE0!\n</p> </section>  ', `  <section id="contact" class="max-w-lg mx-auto text-center mt-16 mb-6"> <h2 class="text-2xl font-semibold">Compila il form</h2> <p class="text-gray-600 dark:text-gray-400">
Raccontaci il tuo progetto: compila tutti i campi e ti risponderemo il prima possibile.
</p> </section>  <section class="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl mb-16"> <form action="https://formspree.io/f/mldgyarp" method="POST" class="space-y-4"> <!-- Redirect alla pagina di ringraziamento --> <input type="hidden" name="_redirect" value="https://lswebagency.com/grazie"> <!-- Subject personalizzato --> <input type="hidden" name="_subject" value="Nuova richiesta da LS Web Agency \u2013 Form Contatti"> <!-- Honeypot anti-spam --> <div style="display: none;"> <label for="honeypot">Lascia questo campo vuoto</label> <input type="text" name="honeypot" id="honeypot"> </div> <!-- Nome --> <input type="text" name="name" placeholder="Nome e Cognome *" required class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"> <!-- Email (Reply-To per Formspree) --> <input type="email" name="_replyto" placeholder="Email *" required class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"> <!-- Telefono --> <input type="tel" name="phone" placeholder="Telefono" class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"> <!-- Servizio di interesse --> <select name="service" required class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"> <option value="" disabled selected hidden>Servizio di interesse *</option> <option value="siti-web">Creazione Sito Web</option> <option value="ecommerce">E-commerce</option> <option value="seo">SEO</option> <option value="grafica">Branding e Grafica</option> <option value="altro">Altro</option> </select> <!-- Messaggio --> <textarea name="message" rows="5" placeholder="Messaggio *" required class="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white"></textarea> <!-- Privacy --> <div class="flex items-start"> <input type="checkbox" name="privacy" required class="h-4 w-4 text-blue-600 rounded"> <label class="ml-2 text-sm">* Accetto la raccolta e l\u2019elaborazione dei dati.</label> </div> <!-- Submit --> <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded px-4 py-2 focus:outline-none focus:ring">
Invia Richiesta
</button> </form> <!-- Semplice timeout anti-double-submit --> <script type="module">
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('form');
      const t0 = Date.now();
      form.addEventListener('submit', (e) => {
        if (Date.now() - t0 < 3000) {
          e.preventDefault();
          alert('Attendi almeno 3 secondi prima di inviare.');
        }
      });
    });
  <\/script> </section> `])), renderComponent($$result2, "HeroText", $$HeroText, { "tagline": "Contatti", "title": "Hai bisogno di informazioni?" }), maybeRenderHead(), renderComponent($$result2, "Features2", $$Features2, { "title": "Siamo qui per aiutarti!", "columns": 3, "items": [
    {
      title: "Contatti Rapidi",
      description: `
          <div class="flex gap-4 mt-2">
            <a href="https://wa.me/393403223494" class="btn-whatsapp">WhatsApp</a>
            <a href="https://t.me/lswebagency" class="btn-telegram">Telegram</a>
          </div>`,
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
