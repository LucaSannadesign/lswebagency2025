import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_0zWSkzCn.mjs';
import { manifest } from './manifest_B2qvyuA2.mjs';

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
const _page11 = () => import('./pages/servizi/accessibilita-digitale-avanzata.astro.mjs');
const _page12 = () => import('./pages/servizi/ai-blog-engine.astro.mjs');
const _page13 = () => import('./pages/servizi/branding-e-grafica-siti-web.astro.mjs');
const _page14 = () => import('./pages/servizi/creazione-siti-web-sassari.astro.mjs');
const _page15 = () => import('./pages/servizi/ottimizzazione-seo-siti-web.astro.mjs');
const _page16 = () => import('./pages/servizi/personalizzazione-ux-intelligenza-artificiale.astro.mjs');
const _page17 = () => import('./pages/servizi/realizzazione-siti-ecommerce.astro.mjs');
const _page18 = () => import('./pages/servizi/voucher-digitali-sassari.astro.mjs');
const _page19 = () => import('./pages/servizi/web-design-etico-sostenibile.astro.mjs');
const _page20 = () => import('./pages/servizi/wordpress-slim-siti-statici-headless.astro.mjs');
const _page21 = () => import('./pages/servizi.astro.mjs');
const _page22 = () => import('./pages/sitemap.astro.mjs');
const _page23 = () => import('./pages/sitemap.xml.astro.mjs');
const _page24 = () => import('./pages/terms.astro.mjs');
const _page25 = () => import('./pages/_---blog_/_category_/_---page_.astro.mjs');
const _page26 = () => import('./pages/_---blog_/_tag_/_---page_.astro.mjs');
const _page27 = () => import('./pages/_---blog_/_---page_.astro.mjs');
const _page28 = () => import('./pages/index.astro.mjs');
const _page29 = () => import('./pages/_---blog_.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.10.1_@types+node@24.0.3_jiti@1.21.7_lightningcss@1.29.3_rollup@4.44.0_terser@5.39.0_typescript@5.8.3_yaml@2.8.0/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
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
    ["src/pages/servizi/accessibilita-digitale-avanzata.astro", _page11],
    ["src/pages/servizi/ai-blog-engine.astro", _page12],
    ["src/pages/servizi/branding-e-grafica-siti-web.astro", _page13],
    ["src/pages/servizi/creazione-siti-web-sassari.astro", _page14],
    ["src/pages/servizi/ottimizzazione-seo-siti-web.astro", _page15],
    ["src/pages/servizi/personalizzazione-ux-intelligenza-artificiale.astro", _page16],
    ["src/pages/servizi/realizzazione-siti-ecommerce.astro", _page17],
    ["src/pages/servizi/voucher-digitali-sassari.astro", _page18],
    ["src/pages/servizi/web-design-etico-sostenibile.astro", _page19],
    ["src/pages/servizi/wordpress-slim-siti-statici-headless.astro", _page20],
    ["src/pages/servizi.astro", _page21],
    ["src/pages/sitemap.astro", _page22],
    ["src/pages/sitemap.xml.ts", _page23],
    ["src/pages/terms.astro", _page24],
    ["src/pages/[...blog]/[category]/[...page].astro", _page25],
    ["src/pages/[...blog]/[tag]/[...page].astro", _page26],
    ["src/pages/[...blog]/[...page].astro", _page27],
    ["src/pages/index.astro", _page28],
    ["src/pages/[...blog]/index.astro", _page29]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "fd43c474-e824-4cda-9f1c-5870d3ff8c3c",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
