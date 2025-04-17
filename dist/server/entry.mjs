import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_Bsbu5QV4.mjs';
import { manifest } from './manifest_MvYEQ5y6.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/api/contatti.astro.mjs');
const _page3 = () => import('./pages/api/send-mail.astro.mjs');
const _page4 = () => import('./pages/chi-siamo.astro.mjs');
const _page5 = () => import('./pages/contatti.astro.mjs');
const _page6 = () => import('./pages/grazie.astro.mjs');
const _page7 = () => import('./pages/portfolio/_slug_.astro.mjs');
const _page8 = () => import('./pages/portfolio.astro.mjs');
const _page9 = () => import('./pages/privacy.astro.mjs');
const _page10 = () => import('./pages/rss.xml.astro.mjs');
const _page11 = () => import('./pages/servizi/branding-e-grafica-siti-web.astro.mjs');
const _page12 = () => import('./pages/servizi/creazione-siti-web-sassari.astro.mjs');
const _page13 = () => import('./pages/servizi/ottimizzazione-seo-siti-web.astro.mjs');
const _page14 = () => import('./pages/servizi/realizzazione-siti-ecommerce.astro.mjs');
const _page15 = () => import('./pages/servizi.astro.mjs');
const _page16 = () => import('./pages/sitemap.astro.mjs');
const _page17 = () => import('./pages/sitemap.xml.astro.mjs');
const _page18 = () => import('./pages/terms.astro.mjs');
const _page19 = () => import('./pages/voucher-digitali-sardegna.astro.mjs');
const _page20 = () => import('./pages/_---blog_/blog/_---slug_.astro.mjs');
const _page21 = () => import('./pages/_---blog_/_category_/_---page_.astro.mjs');
const _page22 = () => import('./pages/_---blog_/_tag_/_---page_.astro.mjs');
const _page23 = () => import('./pages/_---blog_/_---page_.astro.mjs');
const _page24 = () => import('./pages/index.astro.mjs');
const _page25 = () => import('./pages/_---blog_.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/api/contatti.ts", _page2],
    ["src/pages/api/send-mail.ts", _page3],
    ["src/pages/chi-siamo.astro", _page4],
    ["src/pages/contatti.astro", _page5],
    ["src/pages/grazie.astro", _page6],
    ["src/pages/portfolio/[slug].astro", _page7],
    ["src/pages/portfolio.astro", _page8],
    ["src/pages/privacy.astro", _page9],
    ["src/pages/rss.xml.ts", _page10],
    ["src/pages/servizi/branding-e-grafica-siti-web.astro", _page11],
    ["src/pages/servizi/creazione-siti-web-sassari.astro", _page12],
    ["src/pages/servizi/ottimizzazione-seo-siti-web.astro", _page13],
    ["src/pages/servizi/realizzazione-siti-ecommerce.astro", _page14],
    ["src/pages/servizi.astro", _page15],
    ["src/pages/sitemap.astro", _page16],
    ["src/pages/sitemap.xml.ts", _page17],
    ["src/pages/terms.astro", _page18],
    ["src/pages/voucher-digitali-sardegna.astro", _page19],
    ["src/pages/[...blog]/blog/[...slug].astro", _page20],
    ["src/pages/[...blog]/[category]/[...page].astro", _page21],
    ["src/pages/[...blog]/[tag]/[...page].astro", _page22],
    ["src/pages/[...blog]/[...page].astro", _page23],
    ["src/pages/index.astro", _page24],
    ["src/pages/[...blog]/index.astro", _page25]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "a854ad78-1814-4646-aa39-fd7414553684",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
