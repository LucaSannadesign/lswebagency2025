import { a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_CxdTwKPW.mjs';
import 'kleur/colors';
import { $ as $$Layout } from '../chunks/Layout_CCGq1li-.mjs';
import crypto from 'crypto';
export { renderers } from '../renderers.mjs';

const $$Grazie = createComponent(($$result, $$props, $$slots) => {
  const nonce = crypto.randomBytes(16).toString("base64");
  const title = `Grazie per il tuo messaggio!`;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "metadata": { title }, "nonce": nonce }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="flex items-center h-full p-16"> <div class="container flex flex-col items-center justify-center px-5 mx-auto my-8"> <div class="max-w-md text-center"> <h2 class="mb-8 font-bold text-9xl"> <span class="text-primary">Grazie!</span> </h2> <p class="text-3xl font-semibold md:text-3xl">Abbiamo ricevuto il tuo messaggio.</p> <p class="mt-4 mb-8 text-lg text-muted dark:text-slate-400">
Ti risponderemo il prima possibile.
</p> <a rel="noopener noreferrer" href="/" class="btn ml-4">Torna alla Homepage</a> </div> </div> </section> ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/pages/grazie.astro", void 0);

const $$file = "/Users/lucasanna/lswebagency2025/src/pages/grazie.astro";
const $$url = "/grazie";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Grazie,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
