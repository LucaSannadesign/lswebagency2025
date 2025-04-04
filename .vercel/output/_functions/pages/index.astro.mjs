import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, u as unescapeHTML, F as Fragment } from '../chunks/astro/server_CxdTwKPW.mjs';
import 'kleur/colors';
import { $ as $$Button, b as $$PageLayout } from '../chunks/PageLayout_CAIoFVlp.mjs';
import { $ as $$Hero, a as $$CallToAction } from '../chunks/CallToAction_3LqHQJgP.mjs';
import { $ as $$WidgetWrapper } from '../chunks/WidgetWrapper_CM6mRBi_.mjs';
import { $ as $$ItemGrid } from '../chunks/ItemGrid_BFzAxLmA.mjs';
import { $ as $$Headline } from '../chunks/Headline_CN14_Q72.mjs';
import { $ as $$Features2 } from '../chunks/Features2_DlVf7SiC.mjs';
import { $ as $$Grid } from '../chunks/Grid_C7xehkP9.mjs';
import { d as getBlogPermalink } from '../chunks/permalinks_jxnaf6UT.mjs';
import { h as findLatestPosts } from '../chunks/blog_DgNag8y3.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro("https://lswebagency.com");
const $$Features = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Features;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline = await Astro2.slots.render("tagline"),
    items = [],
    columns = 2,
    defaultIcon,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-5xl ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": {
    ...classes?.headline,
    container: "mb-8 md:mx-auto md:mb-12 text-center max-w-3xl",
    title: "text-3xl md:text-4xl font-bold tracking-tighter font-heading text-heading",
    subtitle: "mt-4 text-muted text-xl"
  } })} ${renderComponent($$result2, "ItemGrid", $$ItemGrid, { "items": items, "columns": columns, "defaultIcon": defaultIcon, "classes": {
    container: "grid mx-auto gap-8 md:gap-y-12 sm:grid-cols-2",
    panel: "flex flex-row max-w-md",
    // 🔧 senza animazioni/intersect
    title: "text-xl font-bold md:text-[1.3rem]",
    description: "text-muted mt-2",
    // 👈 volendo puoi aggiungerla
    icon: "text-white bg-primary rounded-full w-10 h-10 p-2 md:w-12 md:h-12 md:p-3 mr-4 rtl:ml-4 rtl:mr-0",
    ...classes?.items ?? {}
  } })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/components/widgets/Features.astro", void 0);

const $$Astro = createAstro("https://lswebagency.com");
const $$BlogLatestPosts = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogLatestPosts;
  const {
    title = await Astro2.slots.render("title"),
    linkText = "View all posts",
    linkUrl = getBlogPermalink(),
    information = await Astro2.slots.render("information"),
    count = 4,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  const posts = await findLatestPosts({ count }) ;
  console.log("POSTS TROVATI:", posts);
  return renderTemplate`${renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": classes?.container, "bg": bg }, { "default": async ($$result2) => renderTemplate`${maybeRenderHead()}<div class="flex flex-col lg:justify-between lg:flex-row mb-8">${title && renderTemplate`<div class="md:max-w-sm"><h2 class="text-3xl font-bold tracking-tight sm:text-4xl sm:leading-none group font-heading mb-2">${unescapeHTML(title)}</h2>${linkText && linkUrl && renderTemplate`${renderComponent($$result2, "Button", $$Button, { "variant": "link", "href": linkUrl }, { "default": async ($$result3) => renderTemplate`${" "}${linkText} »
` })}`}</div>`}${information && renderTemplate`<p class="text-muted dark:text-slate-400 lg:text-sm lg:max-w-md">${unescapeHTML(information)}</p>`}</div>${renderComponent($$result2, "Grid", $$Grid, { "posts": posts })}` })}` }`;
}, "/Users/lucasanna/lswebagency2025/src/components/widgets/BlogLatestPosts.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "Realizzazione Siti Web Sassari | LS Web Agency & SEO",
    description: "LS Web Agency \xE8 specializzata nella realizzazione di siti web a Sassari, ottimizzazione SEO e web design professionale. Porta il tuo business online con un sito veloce e performante!",
    ignoreTitleTemplate: true
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Hero", $$Hero, { "actions": [
    {
      variant: "primary",
      text: "Scopri i nostri servizi",
      href: "/servizi"
    },
    { text: "Portfolio", href: "/portfolio" }
  ], "image": { src: "~/assets/images/hero-image.png", alt: "Realizzazione siti web a Sassari" } }, { "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate` ${maybeRenderHead()}<span class="hidden sm:inline"> <span class="font-semibold">LS Web Agency</span> realizza siti web su misura per aziende e professionisti a Sassari. Creiamo siti veloci, performanti e ottimizzati per il posizionamento su Google.
</span> <span class="block mb-1 sm:hidden font-bold text-blue-600">
Affidati a LS Web Agency per la tua presenza online!
</span>
Ottieni un sito web professionale con design moderno e strategie SEO avanzate.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
Realizzazione siti web a Sassari <span class="text-accent text-gradient dark:text-white highlight">ottimizzati per SEO</span> ` })}` })} ${renderComponent($$result2, "Features", $$Features, { "id": "features", "tagline": "Servizi Web", "title": "Realizzazione siti web e SEO a Sassari", "subtitle": "Diamo vita a siti web professionali, performanti e ottimizzati per i migliori posizionamenti su Google.", "items": [
    {
      title: "Creazione Siti Web",
      description: "Sviluppiamo siti web personalizzati con un design accattivante e ottimizzazione SEO per una maggiore visibilit\xE0.",
      icon: "tabler:device-desktop"
    },
    {
      title: "SEO e Ottimizzazione",
      description: "Miglioriamo il posizionamento del tuo sito su Google con strategie SEO avanzate per attirare nuovi clienti.",
      icon: "tabler:search"
    },
    {
      title: "E-commerce e Vendite Online",
      description: "Sviluppiamo piattaforme e-commerce scalabili e ottimizzate per il massimo rendimento nelle vendite online.",
      icon: "tabler:shopping-cart"
    },
    {
      title: "Web Design e Branding",
      description: "Creiamo siti con un\u2019identit\xE0 visiva forte e coerente, per trasmettere al meglio il valore del tuo brand.",
      icon: "tabler:palette"
    },
    {
      title: "Manutenzione e Supporto",
      description: "Garantiamo aggiornamenti, sicurezza e assistenza continua per il tuo sito web.",
      icon: "tabler:lifebuoy"
    },
    {
      title: "Strategie di Conversione",
      description: "Ottimizziamo il funnel di conversione con call-to-action efficaci per trasformare i visitatori in clienti.",
      icon: "tabler:chart-line"
    }
  ] })}  ${renderComponent($$result2, "Features2", $$Features2, { "title": "Caratteristiche di un sito web vincente", "subtitle": "Ogni sito web che realizziamo \xE8 progettato per massimizzare conversioni e visibilit\xE0", "tagline": "Cosa include il nostro servizio?", "items": [
    {
      title: "Navigazione Intuitiva",
      description: "Struttura chiara per facilitare l'esperienza utente e migliorare la permanenza sul sito.",
      icon: "tabler:layout-navbar"
    },
    {
      title: "Design Responsive",
      description: "Il tuo sito sar\xE0 perfetto su ogni dispositivo, dal desktop allo smartphone.",
      icon: "tabler:device-mobile"
    },
    {
      title: "SEO On-Page",
      description: "Ogni sito \xE8 ottimizzato per le ricerche su Google, migliorando il traffico organico.",
      icon: "tabler:search"
    },
    {
      title: "Velocit\xE0 e Performance",
      description: "Tempi di caricamento ridotti per migliorare il ranking e l\u2019esperienza utente.",
      icon: "tabler:rocket"
    },
    {
      title: "Sicurezza Avanzata",
      description: "Proteggiamo il tuo sito con certificati SSL, backup e sistemi anti-hacking.",
      icon: "tabler:shield-lock"
    },
    {
      title: "User Experience Ottimizzata",
      description: "Layout studiato per guidare il visitatore e massimizzare le conversioni con Call-To-Action efficaci.",
      icon: "tabler:user-check"
    }
  ] })}  ${renderComponent($$result2, "BlogLatestPosts", $$BlogLatestPosts, {}, { "information": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "information" }, { "default": ($$result4) => renderTemplate`
Leggi gli approfondimenti di LS Web Agency sulla realizzazione di siti web e il posizionamento SEO.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
Scopri gli ultimi articoli su SEO e Web Design
` })}` })}  ${renderComponent($$result2, "CallToAction", $$CallToAction, { "actions": [
    {
      variant: "primary",
      text: "Prenota una consulenza gratuita",
      href: "/contatti",
      icon: "tabler:message"
    }
  ] }, { "subtitle": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "subtitle" }, { "default": ($$result4) => renderTemplate`
Vuoi un sito web ottimizzato per Google e pronto per il successo? 🚀 <br>
Contattaci oggi e scopri come possiamo realizzare il tuo progetto con la massima cura e competenza.
` })}`, "title": ($$result3) => renderTemplate`${renderComponent($$result3, "Fragment", Fragment, { "slot": "title" }, { "default": ($$result4) => renderTemplate`
Il tuo sito web professionale <br class="block sm:hidden"> <span class="sm:whitespace-nowrap">ti aspetta</span> ` })}` })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/index.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
