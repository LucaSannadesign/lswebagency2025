import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, F as Fragment, u as unescapeHTML } from './astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import { $ as $$Headline } from './Headline_CRhZWjhP.mjs';
import { $ as $$ItemGrid } from './ItemGrid_B6sRdou8.mjs';
import { $ as $$WidgetWrapper } from './WidgetWrapper_DsxEt2Tf.mjs';
import { $ as $$Image } from './Image_BZL8FzYv.mjs';

const $$Astro = createAstro("https://lswebagency.com");
const $$Features3 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Features3;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline = await Astro2.slots.render("tagline"),
    image,
    items = [],
    columns,
    defaultIcon,
    isBeforeContent,
    isAfterContent,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `${isBeforeContent ? "md:pb-8 lg:pb-12" : ""} ${isAfterContent ? "pt-0 md:pt-0 lg:pt-0" : ""} ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": {
    ...classes?.headline,
    container: "mb-8 md:mx-auto md:mb-12 text-center max-w-3xl",
    title: "text-3xl md:text-4xl font-bold tracking-tighter font-heading text-heading",
    subtitle: "mt-4 text-muted text-xl"
  } })} ${image && renderTemplate`${maybeRenderHead()}<div aria-hidden="true" class="aspect-w-16 aspect-h-7 mt-8"> <div class="w-full h-80 object-cover rounded-xl mx-auto bg-gray-500 shadow-lg"> ${typeof image === "string" ? renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${unescapeHTML(image)}` })}` : renderTemplate`${renderComponent($$result2, "Image", $$Image, { "class": "w-full h-80 object-cover rounded-xl mx-auto bg-gray-500 shadow-lg", "width": "auto", "height": 320, "widths": [400, 768], "layout": "fullWidth", ...image })}`} </div> </div>`}${renderComponent($$result2, "ItemGrid", $$ItemGrid, { "items": items, "columns": columns, "defaultIcon": defaultIcon, "classes": {
    container: "mt-12",
    panel: "bg-white dark:bg-slate-900 shadow-lg border border-gray-200 dark:border-gray-700 p-6 rounded-lg",
    title: "text-lg font-semibold",
    description: "mt-0.5 text-muted",
    icon: "flex-shrink-0 mt-1 text-primary w-6 h-6",
    ...classes?.items ?? {}
  } })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/components/widgets/Features3.astro", void 0);

export { $$Features3 as $ };
