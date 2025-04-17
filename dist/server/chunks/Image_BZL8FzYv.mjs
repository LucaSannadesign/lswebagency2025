import { c as createAstro, a as createComponent, r as renderComponent, F as Fragment, b as renderTemplate, m as maybeRenderHead, d as addAttribute, s as spreadAttributes } from './astro/server_QQ5SR1oO.mjs';
import { f as findImage, i as isUnpicCompatible, g as getImagesOptimized, u as unpicOptimizer, a as astroAsseetsOptimizer } from './Layout_BAT2Cbiv.mjs';

const $$Astro = createAstro("https://lswebagency.com");
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new Error();
  }
  if (!props.width) {
    props.width = 1792;
  }
  if (!props.height) {
    props.height = 1024;
  }
  if (!props.loading) {
    props.loading = "lazy";
  }
  if (!props.decoding) {
    props.decoding = "async";
  }
  const _image = await findImage(props.src);
  let image = void 0;
  if (typeof _image === "string" && (_image.startsWith("http://") || _image.startsWith("https://")) && isUnpicCompatible(_image)) {
    image = await getImagesOptimized(_image, props, unpicOptimizer);
  } else if (_image) {
    image = await getImagesOptimized(_image, props, astroAsseetsOptimizer);
  }
  return renderTemplate`${!image ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {})}` : renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")} crossorigin="anonymous" referrerpolicy="no-referrer"${spreadAttributes(image.attributes)}>`}`;
}, "/Users/lucasanna/lswebagency2025/src/components/common/Image.astro", void 0);

export { $$Image as $ };
