import { c as createAstro, a as createComponent, m as maybeRenderHead, d as addAttribute, r as renderComponent, b as renderTemplate, u as unescapeHTML } from './astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
import { $ as $$WidgetWrapper } from './WidgetWrapper_DsxEt2Tf.mjs';
import { $ as $$Headline } from './Headline_CRhZWjhP.mjs';
import { a as $$Icon, $ as $$Button } from './PageLayout_D6vir8IY.mjs';
import { twMerge } from 'tailwind-merge';

const $$Astro$1 = createAstro("https://lswebagency.com");
const $$ItemGrid2 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ItemGrid2;
  const { items = [], columns, defaultIcon = "", classes = {} } = Astro2.props;
  const {
    container: containerClass = "",
    panel: panelClass = "",
    title: titleClass = "",
    description: descriptionClass = "",
    icon: defaultIconClass = "text-primary"
  } = classes;
  return renderTemplate`${items && renderTemplate`${maybeRenderHead()}<div${addAttribute(twMerge(
    `grid gap-8 gap-x-12 sm:gap-y-8 ${columns === 4 ? "lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2" : columns === 3 ? "lg:grid-cols-3 sm:grid-cols-2" : columns === 2 ? "sm:grid-cols-2" : ""}`,
    containerClass
  ), "class")}>${items.map(({ title, description, icon, callToAction, classes: itemClasses = {} }) => renderTemplate`<div${addAttribute(twMerge(
    "relative flex flex-col",
    panelClass,
    itemClasses?.panel
  ), "class")}>${(icon || defaultIcon) && renderTemplate`${renderComponent($$result, "Icon", $$Icon, { "name": icon || defaultIcon, "class": twMerge("mb-2 w-10 h-10", defaultIconClass, itemClasses?.icon) })}`}<div${addAttribute(twMerge("text-xl font-bold", titleClass, itemClasses?.title), "class")}>${title}</div>${description && renderTemplate`<p${addAttribute(twMerge("text-muted mt-2", descriptionClass, itemClasses?.description), "class")}>${unescapeHTML(description)}</p>`}${callToAction && renderTemplate`<div class="mt-2">${renderComponent($$result, "Button", $$Button, { ...callToAction })}</div>`}</div>`)}</div>`}`;
}, "/Users/lucasanna/lswebagency2025/src/components/ui/ItemGrid2.astro", void 0);

const $$Astro = createAstro("https://lswebagency.com");
const $$Features2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Features2;
  const {
    title = await Astro2.slots.render("title"),
    subtitle = await Astro2.slots.render("subtitle"),
    tagline = await Astro2.slots.render("tagline"),
    items = [],
    columns = 3,
    defaultIcon,
    id,
    isDark = false,
    classes = {},
    bg = await Astro2.slots.render("bg")
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "WidgetWrapper", $$WidgetWrapper, { "id": id, "isDark": isDark, "containerClass": `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${classes?.container ?? ""}`, "bg": bg }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Headline", $$Headline, { "title": title, "subtitle": subtitle, "tagline": tagline, "classes": {
    container: "mb-12 text-center max-w-3xl mx-auto",
    title: "text-3xl md:text-4xl font-bold tracking-tight font-heading text-heading",
    subtitle: "mt-4 text-muted text-xl",
    ...classes?.headline ?? {}
  } })} ${renderComponent($$result2, "ItemGrid2", $$ItemGrid2, { "items": items, "columns": columns, "defaultIcon": defaultIcon, "classes": {
    container: "gap-8 md:gap-10 lg:gap-12",
    panel: "bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-6 shadow-md",
    title: "text-lg font-semibold",
    description: "text-muted mt-2",
    icon: "w-12 h-12 mb-4 text-primary",
    ...classes?.items ?? {}
  } })} ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/components/widgets/Features2.astro", void 0);

export { $$Features2 as $ };
