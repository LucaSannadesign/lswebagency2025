import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_CROlnyxU.mjs';
import 'kleur/colors';
import { a as $$PageLayout } from '../../chunks/PageLayout_Byy34s9y.mjs';
export { renderers } from '../../renderers.mjs';

const $$PersonalizzazioneUxIntelligenzaArtificiale = createComponent(($$result, $$props, $$slots) => {
  const metadata = {
    title: "UX Personalizzata con Intelligenza Artificiale",
    description: "Trasforma l\u2019esperienza utente del tuo sito adattandola in tempo reale grazie all\u2019AI. Coinvolgi e fidelizza di pi\xF9.",
    canonical: "/servizi/personalizzazione-ux-intelligenza-artificiale",
    openGraph: {
      title: "UX Personalizzata con AI",
      description: "Offri esperienze su misura ai tuoi visitatori con l\u2019Intelligenza Artificiale. Maggiore engagement e conversioni.",
      url: "https://www.lswebagency.com/servizi/personalizzazione-ux-intelligenza-artificiale",
      image: "/images/personalizzazione-ux-ai-hero.webp"
    },
    twitter: {
      card: "summary_large_image",
      title: "UX + AI = Esperienza su misura",
      description: "Esperienze utente adattive e coinvolgenti per aumentare le performance del tuo sito.",
      image: "/images/personalizzazione-ux-ai-hero.webp"
    }
  };
  return renderTemplate`${renderComponent($$result, "Layout", $$PageLayout, { "metadata": metadata }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="relative w-full h-[60vh] overflow-hidden"> <img src="/images/personalizzazione-ux-ai-hero.webp" alt="Personalizzazione dell'esperienza utente con AI" class="absolute inset-0 w-full h-full object-cover object-center brightness-75"> <div class="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6"> <h1 class="text-4xl md:text-5xl font-bold mb-4">Esperienza Utente Personalizzata con AI</h1> <p class="text-lg md:text-xl mb-6 max-w-3xl">Adatta il tuo sito in tempo reale ai comportamenti degli utenti e aumenta le conversioni.</p> <a href="/contatti" class="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition">Richiedi maggiori informazioni</a> </div> </section> <section class="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12"> <div> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
Cosa offriamo
</h2> <ul class="space-y-6"> <li> <strong class="text-blue-600">Analisi comportamentale AI-driven</strong><br> <span class="text-gray-700 dark:text-slate-300">
Monitoriamo e interpretiamo i pattern di navigazione per personalizzare l’esperienza.
</span> </li> <li> <strong class="text-blue-600">Contenuti dinamici</strong><br> <span class="text-gray-700 dark:text-slate-300">
Testi, immagini e CTA che si adattano al tipo di utente (nuovo, di ritorno, loggato…)
</span> </li> <li> <strong class="text-blue-600">Micro-interazioni su misura</strong><br> <span class="text-gray-700 dark:text-slate-300">
Animazioni e trigger mirati per aumentare l’engagement.
</span> </li> <li> <strong class="text-blue-600">Chatbot evoluti</strong><br> <span class="text-gray-700 dark:text-slate-300">
Assistenza personalizzata in tempo reale integrata con il tuo CRM.
</span> </li> </ul> </div> <div> <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
Perché è importante?
</h2> <ul class="space-y-4 list-disc list-inside"> <li class="text-gray-700 dark:text-slate-300">✅ Aumenti le conversioni e riduci i bounce</li> <li class="text-gray-700 dark:text-slate-300">✅ Offri un’esperienza più umana e rilevante</li> <li class="text-gray-700 dark:text-slate-300">✅ Differenzi il tuo sito da quello della concorrenza</li> <li class="text-gray-700 dark:text-slate-300">✅ Rafforzi la percezione del tuo brand come innovativo</li> </ul> </div> </section> <section class="bg-blue-600 text-white text-center py-12"> <h2 class="text-3xl font-bold mb-4">Vuoi capire se la UX del tuo sito può essere migliorata con l’AI?</h2> <p class="text-lg mb-6">Richiedi un’analisi gratuita e ricevi consigli pratici da parte del nostro team.</p> <a href="/contatti" class="bg-white text-blue-600 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition">Contattaci ora</a> </section> ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/servizi/personalizzazione-ux-intelligenza-artificiale.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/servizi/personalizzazione-ux-intelligenza-artificiale.astro";
const $$url = "/servizi/personalizzazione-ux-intelligenza-artificiale";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$PersonalizzazioneUxIntelligenzaArtificiale,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
