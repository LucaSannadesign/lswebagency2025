import { a as createComponent, r as renderComponent, b as renderTemplate, F as Fragment, m as maybeRenderHead } from '../../chunks/astro/server_CROlnyxU.mjs';
import 'kleur/colors';
import { $ as $$Features3 } from '../../chunks/Features3_BFKMk91D.mjs';
import { $ as $$Hero } from '../../chunks/Hero_BuKVrzei.mjs';
import { a as $$PageLayout } from '../../chunks/PageLayout_Byy34s9y.mjs';
import { $ as $$Testimonials } from '../../chunks/Testimonials_BFCWlP0D.mjs';
import { $ as $$CallToAction } from '../../chunks/CallToAction_BZu4Zfll.mjs';
import voucherImage from '../../chunks/voucher-digitali-sassari-sardegna-2025_5kzi5AJi.mjs';
export { renderers } from '../../renderers.mjs';

const $$VoucherDigitaliSassari = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Voucher Digitali Sassari 2025 | Fino al 70% di Rimborso - LS Web Agency",
    description: "Scopri come ottenere un rimborso fino al 70% per la digitalizzazione della tua impresa grazie al bando 2025 della Camera di Commercio di Sassari.",
    canonical: "/servizi/voucher-digitali-sassari-2025"
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, { "actions": [
    {
      variant: "primary",
      text: "Scopri se puoi ottenere il voucher",
      href: "/contatti",
      class: "whitespace-nowrap px-6 md:px-8"
    },
    {
      text: "Dettagli Bando",
      href: "/blog/voucher-digitali-sassari-2025",
      class: "whitespace-nowrap px-6 md:px-8"
    }
  ], "image": {
    src: voucherImage,
    alt: "Imprenditori sardi felici per il rimborso digitalizzazione 2025",
    width: 1024,
    height: 576,
    style: "object-fit: cover; object-position: center 30%;"
  } }, { "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate`
Ottieni ${maybeRenderHead()}<strong>fino al 70% di rimborso</strong> a fondo perduto per investimenti in
<strong>digitalizzazione</strong>.  
      Approfitta del bando della <strong>Camera di Commercio di Sassari</strong> per portare la tua azienda online.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
Voucher <span class="text-accent text-gradient dark:text-white highlight">Digitali Sassari 2025</span> ` })}` })} ${renderComponent($$result2, "Features3", $$Features3, { "title": "Spese Ammissibili con il Voucher", "subtitle": "Il bando 2025 copre numerosi servizi digitali.", "columns": 3, "isBeforeContent": true, "items": [
    {
      title: "Siti Web e SEO",
      description: "Creazione o restyling di siti professionali ottimizzati per i motori di ricerca.",
      icon: "tabler:world-www"
    },
    {
      title: "E-commerce e CRM",
      description: "Piattaforme per vendere online e gestire relazioni con i clienti.",
      icon: "tabler:shopping-cart"
    },
    {
      title: "Sicurezza e Cloud",
      description: "Backup, cloud hosting e protezione dei dati aziendali.",
      icon: "tabler:shield-lock"
    },
    {
      title: "Digital Marketing",
      description: "Campagne pubblicitarie, social media e analisi delle performance.",
      icon: "tabler:share-3"
    },
    {
      title: "Formazione del personale",
      description: "Percorsi formativi legati alle competenze digitali.",
      icon: "tabler:school"
    },
    {
      title: "Software gestionali",
      description: "Strumenti ERP, fatturazione elettronica e gestione dei flussi.",
      icon: "tabler:device-desktop-analytics"
    }
  ] })} ${renderComponent($$result2, "Testimonials", $$Testimonials, {})} ${renderComponent($$result2, "CallToAction", $$CallToAction, { "title": "Richiedi subito una consulenza gratuita", "subtitle": "Scopri se la tua azienda pu\xF2 beneficiare del voucher digitale 2025." }, { "actions": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "actions" }, { "default": ($$result4) => renderTemplate` <a href="/contatti" class="btn-primary whitespace-nowrap px-6 md:px-8">Contattaci</a> <a href="/blog/voucher-digitali-sassari-2025" class="btn-secondary whitespace-nowrap px-6 md:px-8">
Dettagli Bando
</a> ` })}` })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/servizi/voucher-digitali-sassari.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/servizi/voucher-digitali-sassari.astro";
const $$url = "/servizi/voucher-digitali-sassari";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$VoucherDigitaliSassari,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
