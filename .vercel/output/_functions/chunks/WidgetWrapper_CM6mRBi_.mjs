import { c as createAstro, a as createComponent, r as renderComponent, b as renderTemplate, m as maybeRenderHead, d as addAttribute, e as renderSlot } from './astro/server_CxdTwKPW.mjs';
import 'kleur/colors';
import { twMerge } from 'tailwind-merge';

const $$Astro = createAstro("https://lswebagency.com");
const $$WidgetWrapper = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$WidgetWrapper;
  const { id, isDark = false, containerClass = "", bg, as = "section" } = Astro2.props;
  const WrapperTag = as;
  return renderTemplate`${renderComponent($$result, "WrapperTag", WrapperTag, { "class": "relative not-prose", ...id ? { id } : {} }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div${addAttribute([
    twMerge(
      "relative mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12 lg:py-14 text-default intercept-no-queue",
      containerClass
    ),
    { dark: isDark }
  ], "class:list")}> ${renderSlot($$result2, $$slots["default"])} </div> ` })}`;
}, "/Users/lucasanna/lswebagency2025/src/components/ui/WidgetWrapper.astro", void 0);

export { $$WidgetWrapper as $ };
