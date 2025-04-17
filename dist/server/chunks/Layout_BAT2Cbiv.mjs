import { a as createComponent, d as addAttribute, b as renderTemplate, t as defineScriptVars, c as createAstro, r as renderComponent, F as Fragment, u as unescapeHTML, s as spreadAttributes, g as renderScript, e as renderSlot, v as renderHead } from './astro/server_QQ5SR1oO.mjs';
import 'kleur/colors';
/* empty css                          */
import { f as getAsset, U as UI, e as getCanonical, I as I18N, S as SITE, M as METADATA } from './permalinks_jxnaf6UT.mjs';
import 'clsx';
import merge from 'lodash.merge';
import { escape } from 'html-escaper';
import { c as getImage } from './_astro_assets_tMRmlKBj.mjs';
import { parseUrl, transformUrl } from 'unpic';

const $$CommonMeta = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="sitemap"${addAttribute(getAsset("/sitemap-index.xml"), "href")}>`;
}, "/Users/lucasanna/lswebagency2025/src/components/common/CommonMeta.astro", void 0);

const favIcon = "data:image/x-icon;base64,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MTYrMDA6MDAV95PdAAAAJnRFWHRpY2M6Y29weXJpZ2h0AE5vIGNvcHlyaWdodCwgdXNlIGZyZWVseaea8IIAAAAhdEVYdGljYzpkZXNjcmlwdGlvbgBzUkdCIElFQzYxOTY2LTIuMVet2kcAAAAgdEVYdHNvZnR3YXJlAGh0dHBzOi8vaW1hZ2VtYWdpY2sub3JnvM8dnQAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMTkyQF1xVQAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAxOTLTrCEIAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE3MzkxMTI4NTbIURtGAAAAD3RFWHRUaHVtYjo6U2l6ZQAwQkKUoj7sAAAAVnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vbW50bG9nL2Zhdmljb25zLzIwMjUtMDItMDkvNTNlODJiZjhkMmQxMjI3MGRjYmY3MThlZmY3MzNlOTIuaWNvLnBuZ2QJoa8AAAAASUVORK5CYII=";

const favIconSvg = new Proxy({"src":"/_astro/favicon.DNY8vOML.svg","width":48,"height":48,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/favicons/favicon.svg";
							}
							
							return target[name];
						}
					});

const appleTouchIcon = new Proxy({"src":"/_astro/favicon.DNY8vOML.svg","width":48,"height":48,"format":"svg"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/lucasanna/lswebagency2025/src/assets/favicons/apple-touch-icon.png";
							}
							
							return target[name];
						}
					});

const $$Favicons = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<link rel="shortcut icon"${addAttribute(favIcon, "href")}><link rel="icon" type="image/svg+xml"${addAttribute(favIconSvg.src, "href")}><link rel="mask-icon"${addAttribute(favIconSvg.src, "href")} color="#8D46E7"><link rel="apple-touch-icon" sizes="180x180"${addAttribute(appleTouchIcon.src, "href")}>`;
}, "/Users/lucasanna/lswebagency2025/src/components/Favicons.astro", void 0);

const $$CustomStyles = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<style>
  :root {
    --aw-font-sans: 'Inter Variable';
    --aw-font-serif: 'Inter Variable';
    --aw-font-heading: 'Inter Variable';

    --aw-color-primary: rgb(1 97 239);
    --aw-color-secondary: rgb(1 84 207);
    --aw-color-accent: rgb(109 40 217);

    --aw-color-text-heading: rgb(0 0 0);
    --aw-color-text-default: rgb(16 16 16);
    --aw-color-text-muted: rgb(16 16 16 / 66%);
    --aw-color-bg-page: rgb(255 255 255);

    --aw-color-bg-page-dark: rgb(3 6 32);

    ::selection {
      background-color: lavender;
    }
  }

  .dark {
    --aw-font-sans: 'Inter Variable';
    --aw-font-serif: 'Inter Variable';
    --aw-font-heading: 'Inter Variable';

    --aw-color-primary: rgb(1 97 239);
    --aw-color-secondary: rgb(1 84 207);
    --aw-color-accent: rgb(109 40 217);

    --aw-color-text-heading: rgb(247, 248, 248);
    --aw-color-text-default: rgb(229 236 246);
    --aw-color-text-muted: rgb(229 236 246 / 66%);
    --aw-color-bg-page: rgb(3 6 32);

    ::selection {
      background-color: black;
      color: snow;
    }
  }
</style>`;
}, "/Users/lucasanna/lswebagency2025/src/components/CustomStyles.astro", void 0);

var __freeze$3 = Object.freeze;
var __defProp$3 = Object.defineProperty;
var __template$3 = (cooked, raw) => __freeze$3(__defProp$3(cooked, "raw", { value: __freeze$3(cooked.slice()) }));
var _a$3;
const $$ApplyColorMode = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$3 || (_a$3 = __template$3(["<script>(function(){", "\n  function applyTheme(theme) {\n    if (theme === 'dark') {\n      document.documentElement.classList.add('dark');\n    } else {\n      document.documentElement.classList.remove('dark');\n    }\n\n    const matches = document.querySelectorAll('[data-aw-toggle-color-scheme] > input');\n    if (matches && matches.length) {\n      matches.forEach((elem) => {\n        elem.checked = theme !== 'dark';\n      });\n    }\n  }\n\n  function getPreferredTheme() {\n    if (localStorage.theme) {\n      return localStorage.theme; // Se l'utente ha scelto un tema, usalo\n    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {\n      return 'dark'; // Se il sistema \xE8 in dark mode, usa dark\n    } else {\n      return 'light'; // Altrimenti usa light\n    }\n  }\n\n  applyTheme(getPreferredTheme()); // \u2705 Imposta il tema corretto al caricamento\n\n  // Ascolta i cambiamenti di preferenza del sistema\n  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {\n    if (!localStorage.theme) { // Cambia solo se l'utente non ha scelto manualmente\n      applyTheme(e.matches ? 'dark' : 'light');\n    }\n  });\n})();<\/script>"])), defineScriptVars({ defaultTheme: UI.theme }));
}, "/Users/lucasanna/lswebagency2025/src/components/common/ApplyColorMode.astro", void 0);

const createMetaTag = (attributes) => {
  const attrs = Object.entries(attributes).map(([key, value]) => `${key}="${escape(value)}"`).join(" ");
  return `<meta ${attrs}>`;
};
const createLinkTag = (attributes) => {
  const attrs = Object.entries(attributes).map(([key, value]) => `${key}="${escape(value)}"`).join(" ");
  return `<link ${attrs}>`;
};
const createOpenGraphTag = (property, content) => {
  return createMetaTag({ property: `og:${property}`, content });
};
const buildOpenGraphMediaTags = (mediaType, media) => {
  let tags = "";
  const addTag = (tag) => {
    tags += tag + "\n";
  };
  media.forEach((medium) => {
    addTag(createOpenGraphTag(mediaType, medium.url));
    if (medium.alt) {
      addTag(createOpenGraphTag(`${mediaType}:alt`, medium.alt));
    }
    if (medium.secureUrl) {
      addTag(createOpenGraphTag(`${mediaType}:secure_url`, medium.secureUrl));
    }
    if (medium.type) {
      addTag(createOpenGraphTag(`${mediaType}:type`, medium.type));
    }
    if (medium.width) {
      addTag(createOpenGraphTag(`${mediaType}:width`, medium.width.toString()));
    }
    if (medium.height) {
      addTag(
        createOpenGraphTag(`${mediaType}:height`, medium.height.toString())
      );
    }
  });
  return tags;
};
const buildTags = (config) => {
  let tagsToRender = "";
  const addTag = (tag) => {
    tagsToRender += tag + "\n";
  };
  if (config.title) {
    const formattedTitle = config.titleTemplate ? config.titleTemplate.replace("%s", config.title) : config.title;
    addTag(`<title>${escape(formattedTitle)}</title>`);
  }
  if (config.description) {
    addTag(createMetaTag({ name: "description", content: config.description }));
  }
  let robotsContent = [];
  if (typeof config.noindex !== "undefined") {
    robotsContent.push(config.noindex ? "noindex" : "index");
  }
  if (typeof config.nofollow !== "undefined") {
    robotsContent.push(config.nofollow ? "nofollow" : "follow");
  }
  if (config.robotsProps) {
    const {
      nosnippet,
      maxSnippet,
      maxImagePreview,
      noarchive,
      unavailableAfter,
      noimageindex,
      notranslate
    } = config.robotsProps;
    if (nosnippet) robotsContent.push("nosnippet");
    if (typeof maxSnippet === "number") robotsContent.push(`max-snippet:${maxSnippet}`);
    if (maxImagePreview)
      robotsContent.push(`max-image-preview:${maxImagePreview}`);
    if (noarchive) robotsContent.push("noarchive");
    if (unavailableAfter)
      robotsContent.push(`unavailable_after:${unavailableAfter}`);
    if (noimageindex) robotsContent.push("noimageindex");
    if (notranslate) robotsContent.push("notranslate");
  }
  if (robotsContent.length > 0) {
    addTag(createMetaTag({ name: "robots", content: robotsContent.join(",") }));
  }
  if (config.canonical) {
    addTag(createLinkTag({ rel: "canonical", href: config.canonical }));
  }
  if (config.mobileAlternate) {
    addTag(
      createLinkTag({
        rel: "alternate",
        media: config.mobileAlternate.media,
        href: config.mobileAlternate.href
      })
    );
  }
  if (config.languageAlternates && config.languageAlternates.length > 0) {
    config.languageAlternates.forEach((languageAlternate) => {
      addTag(
        createLinkTag({
          rel: "alternate",
          hreflang: languageAlternate.hreflang,
          href: languageAlternate.href
        })
      );
    });
  }
  if (config.openGraph) {
    const title = config.openGraph?.title || config.title;
    if (title) {
      addTag(createOpenGraphTag("title", title));
    }
    const description = config.openGraph?.description || config.description;
    if (description) {
      addTag(createOpenGraphTag("description", description));
    }
    if (config.openGraph.url) {
      addTag(createOpenGraphTag("url", config.openGraph.url));
    }
    if (config.openGraph.type) {
      addTag(createOpenGraphTag("type", config.openGraph.type));
    }
    if (config.openGraph.images && config.openGraph.images.length) {
      addTag(buildOpenGraphMediaTags("image", config.openGraph.images));
    }
    if (config.openGraph.videos && config.openGraph.videos.length) {
      addTag(buildOpenGraphMediaTags("video", config.openGraph.videos));
    }
    if (config.openGraph.locale) {
      addTag(createOpenGraphTag("locale", config.openGraph.locale));
    }
    if (config.openGraph.site_name) {
      addTag(createOpenGraphTag("site_name", config.openGraph.site_name));
    }
    if (config.openGraph.profile) {
      if (config.openGraph.profile.firstName) {
        addTag(
          createOpenGraphTag(
            "profile:first_name",
            config.openGraph.profile.firstName
          )
        );
      }
      if (config.openGraph.profile.lastName) {
        addTag(
          createOpenGraphTag(
            "profile:last_name",
            config.openGraph.profile.lastName
          )
        );
      }
      if (config.openGraph.profile.username) {
        addTag(
          createOpenGraphTag(
            "profile:username",
            config.openGraph.profile.username
          )
        );
      }
      if (config.openGraph.profile.gender) {
        addTag(
          createOpenGraphTag("profile:gender", config.openGraph.profile.gender)
        );
      }
    }
    if (config.openGraph.book) {
      if (config.openGraph.book.authors && config.openGraph.book.authors.length) {
        config.openGraph.book.authors.forEach((author) => {
          addTag(createOpenGraphTag("book:author", author));
        });
      }
      if (config.openGraph.book.isbn) {
        addTag(createOpenGraphTag("book:isbn", config.openGraph.book.isbn));
      }
      if (config.openGraph.book.releaseDate) {
        addTag(
          createOpenGraphTag(
            "book:release_date",
            config.openGraph.book.releaseDate
          )
        );
      }
      if (config.openGraph.book.tags && config.openGraph.book.tags.length) {
        config.openGraph.book.tags.forEach((tag) => {
          addTag(createOpenGraphTag("book:tag", tag));
        });
      }
    }
    if (config.openGraph.article) {
      if (config.openGraph.article.publishedTime) {
        addTag(
          createOpenGraphTag(
            "article:published_time",
            config.openGraph.article.publishedTime
          )
        );
      }
      if (config.openGraph.article.modifiedTime) {
        addTag(
          createOpenGraphTag(
            "article:modified_time",
            config.openGraph.article.modifiedTime
          )
        );
      }
      if (config.openGraph.article.expirationTime) {
        addTag(
          createOpenGraphTag(
            "article:expiration_time",
            config.openGraph.article.expirationTime
          )
        );
      }
      if (config.openGraph.article.authors && config.openGraph.article.authors.length) {
        config.openGraph.article.authors.forEach((author) => {
          addTag(createOpenGraphTag("article:author", author));
        });
      }
      if (config.openGraph.article.section) {
        addTag(
          createOpenGraphTag(
            "article:section",
            config.openGraph.article.section
          )
        );
      }
      if (config.openGraph.article.tags && config.openGraph.article.tags.length) {
        config.openGraph.article.tags.forEach((tag) => {
          addTag(createOpenGraphTag("article:tag", tag));
        });
      }
    }
    if (config.openGraph.video) {
      if (config.openGraph.video.actors && config.openGraph.video.actors.length) {
        config.openGraph.video.actors.forEach((actor) => {
          addTag(createOpenGraphTag("video:actor", actor.profile));
          if (actor.role) {
            addTag(createOpenGraphTag("video:actor:role", actor.role));
          }
        });
      }
      if (config.openGraph.video.directors && config.openGraph.video.directors.length) {
        config.openGraph.video.directors.forEach((director) => {
          addTag(createOpenGraphTag("video:director", director));
        });
      }
      if (config.openGraph.video.writers && config.openGraph.video.writers.length) {
        config.openGraph.video.writers.forEach((writer) => {
          addTag(createOpenGraphTag("video:writer", writer));
        });
      }
      if (config.openGraph.video.duration) {
        addTag(
          createOpenGraphTag(
            "video:duration",
            config.openGraph.video.duration.toString()
          )
        );
      }
      if (config.openGraph.video.releaseDate) {
        addTag(
          createOpenGraphTag(
            "video:release_date",
            config.openGraph.video.releaseDate
          )
        );
      }
      if (config.openGraph.video.tags && config.openGraph.video.tags.length) {
        config.openGraph.video.tags.forEach((tag) => {
          addTag(createOpenGraphTag("video:tag", tag));
        });
      }
      if (config.openGraph.video.series) {
        addTag(
          createOpenGraphTag("video:series", config.openGraph.video.series)
        );
      }
    }
  }
  if (config.facebook && config.facebook.appId) {
    addTag(
      createMetaTag({ property: "fb:app_id", content: config.facebook.appId })
    );
  }
  if (config.twitter) {
    if (config.twitter.cardType) {
      addTag(
        createMetaTag({
          name: "twitter:card",
          content: config.twitter.cardType
        })
      );
    }
    if (config.twitter.site) {
      addTag(
        createMetaTag({ name: "twitter:site", content: config.twitter.site })
      );
    }
    if (config.twitter.handle) {
      addTag(
        createMetaTag({
          name: "twitter:creator",
          content: config.twitter.handle
        })
      );
    }
  }
  if (config.additionalMetaTags && config.additionalMetaTags.length > 0) {
    config.additionalMetaTags.forEach((metaTag) => {
      const attributes = {
        content: metaTag.content
      };
      if ("name" in metaTag && metaTag.name) {
        attributes.name = metaTag.name;
      } else if ("property" in metaTag && metaTag.property) {
        attributes.property = metaTag.property;
      } else if ("httpEquiv" in metaTag && metaTag.httpEquiv) {
        attributes["http-equiv"] = metaTag.httpEquiv;
      }
      addTag(createMetaTag(attributes));
    });
  }
  if (config.additionalLinkTags && config.additionalLinkTags.length > 0) {
    config.additionalLinkTags.forEach((linkTag) => {
      const attributes = {
        rel: linkTag.rel,
        href: linkTag.href
      };
      if (linkTag.sizes) {
        attributes.sizes = linkTag.sizes;
      }
      if (linkTag.media) {
        attributes.media = linkTag.media;
      }
      if (linkTag.type) {
        attributes.type = linkTag.type;
      }
      if (linkTag.color) {
        attributes.color = linkTag.color;
      }
      if (linkTag.as) {
        attributes.as = linkTag.as;
      }
      if (linkTag.crossOrigin) {
        attributes.crossorigin = linkTag.crossOrigin;
      }
      addTag(createLinkTag(attributes));
    });
  }
  return tagsToRender.trim();
};

const $$Astro$4 = createAstro("https://lswebagency.com");
const $$AstroSeo = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$AstroSeo;
  const {
    title,
    titleTemplate,
    noindex,
    nofollow,
    robotsProps,
    description,
    canonical,
    mobileAlternate,
    languageAlternates,
    openGraph,
    facebook,
    twitter,
    additionalMetaTags,
    additionalLinkTags
  } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(buildTags({
    title,
    titleTemplate,
    noindex,
    nofollow,
    robotsProps,
    description,
    canonical,
    mobileAlternate,
    languageAlternates,
    openGraph,
    facebook,
    twitter,
    additionalMetaTags,
    additionalLinkTags
  }))}` })}`;
}, "/Users/lucasanna/lswebagency2025/node_modules/@astrolib/seo/src/AstroSeo.astro", void 0);

const config = {
  deviceSizes: [
    640,
    // older and lower-end phones
    750,
    // iPhone 6-8
    828,
    // iPhone XR/11
    960,
    // older horizontal phones
    1080,
    // iPhone 6-8 Plus
    1280,
    // 720p
    1668,
    // Various iPads
    1920,
    // 1080p
    2048,
    // QXGA
    2560,
    // WQXGA
    3200,
    // QHD+
    3840,
    // 4K
    4480,
    // 4.5K
    5120,
    // 5K
    6016
    // 6K
  ]};
const computeHeight = (width, aspectRatio) => {
  return Math.floor(width / aspectRatio);
};
const parseAspectRatio = (aspectRatio) => {
  if (typeof aspectRatio === "number") return aspectRatio;
  if (typeof aspectRatio === "string") {
    const match = aspectRatio.match(/(\d+)\s*[/:]\s*(\d+)/);
    if (match) {
      const [, num, den] = match.map(Number);
      if (den && !isNaN(num)) return num / den;
    } else {
      const numericValue = parseFloat(aspectRatio);
      if (!isNaN(numericValue)) return numericValue;
    }
  }
  return void 0;
};
const getSizes = (width, layout) => {
  if (!width || !layout) {
    return void 0;
  }
  switch (layout) {
    // If screen is wider than the max size, image width is the max size,
    // otherwise it's the width of the screen
    case `constrained`:
      return `(min-width: ${width}px) ${width}px, 100vw`;
    // Image is always the same width, whatever the size of the screen
    case `fixed`:
      return `${width}px`;
    // Image is always the width of the screen
    case `fullWidth`:
      return `100vw`;
    default:
      return void 0;
  }
};
const pixelate = (value) => value || value === 0 ? `${value}px` : void 0;
const getStyle = ({
  width,
  height,
  aspectRatio,
  layout,
  objectFit = "cover",
  objectPosition = "center",
  background
}) => {
  const styleEntries = [["object-fit", objectFit], ["object-position", objectPosition]];
  if (background?.startsWith("https:") || background?.startsWith("http:") || background?.startsWith("data:")) {
    styleEntries.push(["background-image", `url(${background})`]);
    styleEntries.push(["background-size", "cover"]);
    styleEntries.push(["background-repeat", "no-repeat"]);
  } else {
    styleEntries.push(["background", background]);
  }
  if (layout === "fixed") {
    styleEntries.push(["width", pixelate(width)]);
    styleEntries.push(["height", pixelate(height)]);
    styleEntries.push(["object-position", "top left"]);
  }
  if (layout === "constrained") {
    styleEntries.push(["max-width", pixelate(width)]);
    styleEntries.push(["max-height", pixelate(height)]);
    styleEntries.push(["aspect-ratio", aspectRatio ? `${aspectRatio}` : void 0]);
    styleEntries.push(["width", "100%"]);
  }
  if (layout === "fullWidth") {
    styleEntries.push(["width", "100%"]);
    styleEntries.push(["aspect-ratio", aspectRatio ? `${aspectRatio}` : void 0]);
    styleEntries.push(["height", pixelate(height)]);
  }
  if (layout === "responsive") {
    styleEntries.push(["width", "100%"]);
    styleEntries.push(["height", "auto"]);
    styleEntries.push(["aspect-ratio", aspectRatio ? `${aspectRatio}` : void 0]);
  }
  if (layout === "contained") {
    styleEntries.push(["max-width", "100%"]);
    styleEntries.push(["max-height", "100%"]);
    styleEntries.push(["object-fit", "contain"]);
    styleEntries.push(["aspect-ratio", aspectRatio ? `${aspectRatio}` : void 0]);
  }
  if (layout === "cover") {
    styleEntries.push(["max-width", "100%"]);
    styleEntries.push(["max-height", "100%"]);
  }
  const styles = Object.fromEntries(styleEntries.filter(([, value]) => value));
  return Object.entries(styles).map(([key, value]) => `${key}: ${value};`).join(" ");
};
const getBreakpoints = ({
  width,
  breakpoints,
  layout
}) => {
  if (layout === "fullWidth" || layout === "cover" || layout === "responsive" || layout === "contained") {
    return breakpoints || config.deviceSizes;
  }
  if (!width) {
    return [];
  }
  const doubleWidth = width * 2;
  if (layout === "fixed") {
    return [width, doubleWidth];
  }
  if (layout === "constrained") {
    return [
      // Always include the image at 1x and 2x the specified width
      width,
      doubleWidth,
      // Filter out any resolutions that are larger than the double-res image
      ...(breakpoints || config.deviceSizes).filter((w) => w < doubleWidth)
    ];
  }
  return [];
};
const astroAsseetsOptimizer = async (image, breakpoints, _width, _height, format = void 0) => {
  if (!image) {
    return [];
  }
  return Promise.all(breakpoints.map(async (w) => {
    const result = await getImage({
      src: image,
      width: w,
      inferSize: true,
      ...format ? {
        format
      } : {}
    });
    return {
      src: result?.src,
      width: result?.attributes?.width ?? w,
      height: result?.attributes?.height
    };
  }));
};
const isUnpicCompatible = (image) => {
  return typeof parseUrl(image) !== "undefined";
};
const unpicOptimizer = async (image, breakpoints, width, height, format = void 0) => {
  if (!image || typeof image !== "string") {
    return [];
  }
  const urlParsed = parseUrl(image);
  if (!urlParsed) {
    return [];
  }
  return Promise.all(breakpoints.map(async (w) => {
    const _height = width && height ? computeHeight(w, width / height) : height;
    const url = transformUrl({
      url: image,
      width: w,
      height: _height,
      cdn: urlParsed.cdn,
      ...format ? {
        format
      } : {}
    }) || image;
    return {
      src: String(url),
      width: w,
      height: _height
    };
  }));
};
async function getImagesOptimized(image, {
  src: _,
  width,
  height,
  sizes,
  aspectRatio,
  objectPosition,
  widths,
  layout = "constrained",
  style = "",
  format,
  ...rest
}, transform = () => Promise.resolve([])) {
  if (typeof image !== "string") {
    width ||= Number(image.width) || void 0;
    height ||= typeof width === "number" ? computeHeight(width, image.width / image.height) : void 0;
  }
  width = width && Number(width) || void 0;
  height = height && Number(height) || void 0;
  widths ||= config.deviceSizes;
  sizes ||= getSizes(Number(width) || void 0, layout);
  aspectRatio = parseAspectRatio(aspectRatio);
  if (aspectRatio) {
    if (width) {
      if (height) ; else {
        height = width / aspectRatio;
      }
    } else if (height) {
      width = Number(height * aspectRatio);
    } else if (layout !== "fullWidth") {
      console.error("When aspectRatio is set, either width or height must also be set");
      console.error("Image", image);
    }
  } else if (width && height) {
    aspectRatio = width / height;
  } else if (layout !== "fullWidth") {
    console.error("Either aspectRatio or both width and height must be set");
    console.error("Image", image);
  }
  let breakpoints = getBreakpoints({
    width,
    breakpoints: widths,
    layout
  });
  breakpoints = [...new Set(breakpoints)].sort((a, b) => a - b);
  const srcset = (await transform(image, breakpoints, Number(width) || void 0, Number(height) || void 0, format)).map(({
    src,
    width: width2
  }) => `${src} ${width2}w`).join(", ");
  return {
    src: typeof image === "string" ? image : image.src,
    attributes: {
      width,
      height,
      srcset: srcset || void 0,
      sizes,
      style: `${getStyle({
        width,
        height,
        aspectRatio,
        objectPosition,
        layout
      })}${style ?? ""}`,
      ...rest
    }
  };
}

const load = async function() {
  let images = void 0;
  try {
    images = /* #__PURE__ */ Object.assign({"/src/assets/images/Ottimizzazione-Sito-Web-SEO.webp": () => import('./Ottimizzazione-Sito-Web-SEO_CycDGRsT.mjs'),"/src/assets/images/Porta-il-tuo-business-online-con-un-E-commerce-su-misura.jpeg": () => import('./Porta-il-tuo-business-online-con-un-E-commerce-su-misura_DYMNWWg_.mjs'),"/src/assets/images/app-store.png": () => import('./app-store_DFCP04YC.mjs'),"/src/assets/images/branding-grafica-ls-webagencywebp.webp": () => import('./branding-grafica-ls-webagencywebp_DS6uiuBr.mjs'),"/src/assets/images/canapalandia-blog.webp": () => import('./canapalandia-blog_B6CeOP9E.mjs'),"/src/assets/images/cd-cover-the-temponauts.webp": () => import('./cd-cover-the-temponauts_CCF-UNao.mjs'),"/src/assets/images/checklist-web-agency-og.webp": () => import('./checklist-web-agency-og_4nmviWdM.mjs'),"/src/assets/images/come-scegliere-una-web-agency.webp": () => import('./come-scegliere-una-web-agency_B6IkzltL.mjs'),"/src/assets/images/copywriting-seo-og.webp": () => import('./copywriting-seo-og_BvIsKgid.mjs'),"/src/assets/images/creazione-siti-web-sassari-sardegna.webp": () => import('./creazione-siti-web-sassari-sardegna_DBB7H3B9.mjs'),"/src/assets/images/creazione-sito-web-professionale.webp": () => import('./creazione-sito-web-professionale_B5Rst2hP.mjs'),"/src/assets/images/default-placeholder.png": () => import('./default-placeholder_D0zMnt3L.mjs'),"/src/assets/images/dentista-digitale.webp": () => import('./dentista-digitale_C7d8zlXD.mjs'),"/src/assets/images/e-commerce-business-web-site-digital-solutions.webp": () => import('./e-commerce-business-web-site-digital-solutions_BrbcKw7H.mjs'),"/src/assets/images/ecommerce-business-online.webp": () => import('./ecommerce-business-online_BgqLY8hw.mjs'),"/src/assets/images/focused-man-laptop.jpeg": () => import('./focused-man-laptop_CYdguOP0.mjs'),"/src/assets/images/google-play.png": () => import('./google-play_STJ4x0BZ.mjs'),"/src/assets/images/hero-image.jpg": () => import('./hero-image_BbWQvUsc.mjs'),"/src/assets/images/hero-image.png": () => import('./hero-image_-WpzIJGU.mjs'),"/src/assets/images/intelligenza-artificiale-siti-web.webp": () => import('./intelligenza-artificiale-siti-web_WRDcX288.mjs'),"/src/assets/images/logo-arte-senza-confini.webp": () => import('./logo-arte-senza-confini_D0TnLgxk.mjs'),"/src/assets/images/logo-canapalandia-2024-definitivo-1080px.webp": () => import('./logo-canapalandia-2024-definitivo-1080px_BJgqktfz.mjs'),"/src/assets/images/logo-ls-webdesignagency-2025-dark.png": () => import('./logo-ls-webdesignagency-2025-dark_B7_iypN4.mjs'),"/src/assets/images/logo-ls-webdesignagency-2025.png": () => import('./logo-ls-webdesignagency-2025_e4P1pAm9.mjs'),"/src/assets/images/logo-lswebagency-bn.png": () => import('./logo-lswebagency-bn_B_-6gFSc.mjs'),"/src/assets/images/logo-lswebagency-bn.webp": () => import('./logo-lswebagency-bn_-xnYSjLs.mjs'),"/src/assets/images/logo-lswebagency.png": () => import('./logo-lswebagency_Ci1h7f6u.mjs'),"/src/assets/images/logo-lswebagency.webp": () => import('./logo-lswebagency_CgM3HPRz.mjs'),"/src/assets/images/logo-premioarte.webp": () => import('./logo-premioarte_47J43ZxL.mjs'),"/src/assets/images/ls-web-agency-sassari.jpg": () => import('./ls-web-agency-sassari_p5Mf6Sc_.mjs'),"/src/assets/images/luca-sanna-artista.webp": () => import('./luca-sanna-artista_CmxZzCge.mjs'),"/src/assets/images/misurare-migliorare-velocita-sito.webp": () => import('./misurare-migliorare-velocita-sito_Dbz5RdDV.mjs'),"/src/assets/images/mobile-first-ottimizzazione-sito.webp": () => import('./mobile-first-ottimizzazione-sito_Bo6l9JIi.mjs'),"/src/assets/images/modern-wall-clock.jpeg": () => import('./modern-wall-clock_Bi1Uazmr.mjs'),"/src/assets/images/noi_e_biasi_copertina.webp": () => import('./noi_e_biasi_copertina_D_4bUP1u.mjs'),"/src/assets/images/perche-sito-web-vetrina-non-basta-piu.webp": () => import('./perche-sito-web-vetrina-non-basta-piu_BzY4ndUC.mjs'),"/src/assets/images/portfolio/canapalandia-blog.webp": () => import('./canapalandia-blog_BtRCGeeO.mjs'),"/src/assets/images/portfolio/cd-cover-the-temponauts.jpg": () => import('./cd-cover-the-temponauts_P-C04kT4.mjs'),"/src/assets/images/portfolio/dentista-digitale.jpg": () => import('./dentista-digitale_k1qYWZ4B.mjs'),"/src/assets/images/portfolio/logo-canapalandia-2024-definitivo-1080px.webp": () => import('./logo-canapalandia-2024-definitivo-1080px_2HfawICf.mjs'),"/src/assets/images/portfolio/logo-premioarte.webp": () => import('./logo-premioarte_CVrx5Cum.mjs'),"/src/assets/images/portfolio/luca-sanna-artista.jpg": () => import('./luca-sanna-artista_W9DUZGaG.mjs'),"/src/assets/images/portfolio/sito-web-agenzia-immobilliare-annunci-case.jpg": () => import('./sito-web-agenzia-immobilliare-annunci-case_DwUBENwe.mjs'),"/src/assets/images/portfolio/sito-web-professionale.jpg": () => import('./sito-web-professionale_ReHLYbt8.mjs'),"/src/assets/images/progettazione-landing-page.jpg": () => import('./progettazione-landing-page_BjdCKbUc.mjs'),"/src/assets/images/progettazione-landing-page.png": () => import('./progettazione-landing-page_9u5u7OCm.mjs'),"/src/assets/images/progettazione-landing-page.webp": () => import('./progettazione-landing-page_BsShq0cu.mjs'),"/src/assets/images/programming-code-screen.jpeg": () => import('./programming-code-screen_CSLhWHsA.mjs'),"/src/assets/images/programming-code-screen2.jpeg": () => import('./programming-code-screen2_CmfX3uNc.mjs'),"/src/assets/images/realizzazione-siti-web-sassari-sardegna.webp": () => import('./realizzazione-siti-web-sassari-sardegna_DmgCj8NZ.mjs'),"/src/assets/images/scegliere-tipo-sito-og.webp": () => import('./scegliere-tipo-sito-og_B0enJfGv.mjs'),"/src/assets/images/scegliere-tipo-sito-twitter.webp": () => import('./scegliere-tipo-sito-twitter_CuQpZxQX.mjs'),"/src/assets/images/scegliere-tipo-sito.webp": () => import('./scegliere-tipo-sito_BhOX08uv.mjs'),"/src/assets/images/seo-optimizzation-ls-webagency.webp": () => import('./seo-optimizzation-ls-webagency_H2VUA_wL.mjs'),"/src/assets/images/seo-ottimizzazione-ls-webagency.webp": () => import('./seo-ottimizzazione-ls-webagency_CFSrzhdw.mjs'),"/src/assets/images/servizi-seo-grafica-branding-siti-web.webp": () => import('./servizi-seo-grafica-branding-siti-web_YKTFUquq.mjs'),"/src/assets/images/sito-web-agenzia-immobilliare-annunci-case.webp": () => import('./sito-web-agenzia-immobilliare-annunci-case_H1U71bF2.mjs'),"/src/assets/images/sito-web-professionale.jpg": () => import('./sito-web-professionale_BMkoGmZW.mjs'),"/src/assets/images/sito-web-professionale.webp": () => import('./sito-web-professionale_DsI-vOGR.mjs'),"/src/assets/images/team-sviluppo-siti-web.webp": () => import('./team-sviluppo-siti-web_CPUH62OP.mjs'),"/src/assets/images/teamwork-tech-laptops.jpeg": () => import('./teamwork-tech-laptops_BmK4AyhT.mjs'),"/src/assets/images/voucher-digitali-sardegna.webp": () => import('./voucher-digitali-sardegna_CZhiwsNC.mjs'),"/src/assets/images/web-agency-1738168_1280.jpg": () => import('./web-agency-1738168_1280_CUOAEcA4.mjs')});
  } catch (error) {
  }
  return images;
};
let _images = void 0;
const fetchLocalImages = async () => {
  _images = _images || await load();
  return _images;
};
const findImage = async (imagePath) => {
  if (typeof imagePath !== "string") {
    return imagePath;
  }
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("/")) {
    return imagePath;
  }
  if (!imagePath.startsWith("~/assets/images")) {
    return imagePath;
  }
  const images = await fetchLocalImages();
  const key = imagePath.replace("~/", "/src/");
  return images && typeof images[key] === "function" ? (await images[key]())["default"] : null;
};
const adaptOpenGraphImages = async (openGraph = {}, astroSite = new URL("")) => {
  if (!openGraph?.images?.length) {
    return openGraph;
  }
  const images = openGraph.images;
  const defaultWidth = 1200;
  const defaultHeight = 626;
  const adaptedImages = await Promise.all(images.map(async (image) => {
    if (image?.url) {
      const resolvedImage = await findImage(image.url);
      if (!resolvedImage) {
        return {
          url: ""
        };
      }
      let _image;
      if (typeof resolvedImage === "string" && (resolvedImage.startsWith("http://") || resolvedImage.startsWith("https://")) && isUnpicCompatible(resolvedImage)) {
        _image = (await unpicOptimizer(resolvedImage, [defaultWidth], defaultWidth, defaultHeight, "jpg"))[0];
      } else if (resolvedImage) {
        const dimensions = typeof resolvedImage !== "string" && resolvedImage?.width <= defaultWidth ? [resolvedImage?.width, resolvedImage?.height] : [defaultWidth, defaultHeight];
        _image = (await astroAsseetsOptimizer(resolvedImage, [dimensions[0]], dimensions[0], dimensions[1], "jpg"))[0];
      }
      if (typeof _image === "object") {
        return {
          url: "src" in _image && typeof _image.src === "string" ? String(new URL(_image.src, astroSite)) : "",
          width: "width" in _image && typeof _image.width === "number" ? _image.width : void 0,
          height: "height" in _image && typeof _image.height === "number" ? _image.height : void 0
        };
      }
      return {
        url: ""
      };
    }
    return {
      url: ""
    };
  }));
  return {
    ...openGraph,
    ...adaptedImages ? {
      images: adaptedImages
    } : {}
  };
};

const $$Astro$3 = createAstro("https://lswebagency.com");
const $$Metadata = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Metadata;
  const {
    title,
    ignoreTitleTemplate = false,
    canonical = String(getCanonical(String(Astro2.url.pathname))),
    robots = {},
    description,
    openGraph = {},
    twitter = {}
  } = Astro2.props;
  const seoProps = merge(
    {
      title: "",
      titleTemplate: "%s",
      canonical,
      noindex: true,
      nofollow: true,
      description: void 0,
      openGraph: {
        url: canonical,
        site_name: SITE?.name,
        images: [],
        locale: I18N?.language,
        type: "website"
      },
      twitter: {
        cardType: openGraph?.images?.length ? "summary_large_image" : "summary"
      }
    },
    {
      title: METADATA?.title?.default,
      titleTemplate: METADATA?.title?.template,
      noindex: false ,
      nofollow: false ,
      description: METADATA?.description,
      openGraph: METADATA?.openGraph,
      twitter: METADATA?.twitter
    },
    {
      title,
      titleTemplate: ignoreTitleTemplate ? "%s" : void 0,
      canonical,
      noindex: typeof robots?.index !== "undefined" ? !robots.index : void 0,
      nofollow: typeof robots?.follow !== "undefined" ? !robots.follow : void 0,
      description,
      openGraph: { url: canonical, ...openGraph },
      twitter
    }
  );
  return renderTemplate`${renderComponent($$result, "AstroSeo", $$AstroSeo, { ...{ ...seoProps, openGraph: await adaptOpenGraphImages(seoProps?.openGraph, Astro2.site) } })}`;
}, "/Users/lucasanna/lswebagency2025/src/components/common/Metadata.astro", void 0);

const $$SiteVerification = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderTemplate`<meta name="google-site-verification"${addAttribute(SITE.googleSiteVerificationId, "content")}>`}`;
}, "/Users/lucasanna/lswebagency2025/src/components/common/SiteVerification.astro", void 0);

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$Astro$2 = createAstro("https://lswebagency.com");
const $$GoogleAnalytics = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$GoogleAnalytics;
  const { id = "GA_MEASUREMENT_ID", partytown = false } = Astro2.props;
  const attrs = partytown ? { type: "text/partytown" } : {};
  return renderTemplate(_a$2 || (_a$2 = __template$2(["<script async", "", "><\/script><script", ">(function(){", '\n  window.dataLayer = window.dataLayer || [];\n  function gtag() {\n    window.dataLayer.push(arguments);\n  }\n  gtag("js", new Date());\n  gtag("config", id);\n})();<\/script>'])), addAttribute(`https://www.googletagmanager.com/gtag/js?id=${id}`, "src"), spreadAttributes(attrs), spreadAttributes(attrs), defineScriptVars({ id }));
}, "/Users/lucasanna/lswebagency2025/node_modules/@astrolib/analytics/src/GoogleAnalytics.astro", void 0);

const $$Analytics = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${null}`;
}, "/Users/lucasanna/lswebagency2025/src/components/common/Analytics.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$BasicScripts = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$1 || (_a$1 = __template$1(["<script>(function(){", "\n  if (window.basic_script) {\n    return;\n  }\n\n  window.basic_script = true;\n\n  function applyTheme(theme) {\n    if (theme === 'dark') {\n      document.documentElement.classList.add('dark');\n    } else {\n      document.documentElement.classList.remove('dark');\n    }\n  }\n\n  const initTheme = function () {\n    if ((defaultTheme && defaultTheme.endsWith(':only')) || (!localStorage.theme && defaultTheme !== 'system')) {\n      applyTheme(defaultTheme.replace(':only', ''));\n    } else if (\n      localStorage.theme === 'dark' ||\n      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)\n    ) {\n      applyTheme('dark');\n    } else {\n      applyTheme('light');\n    }\n  };\n  initTheme();\n\n  function attachEvent(selector, event, fn) {\n    const matches = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;\n    if (matches && matches.length) {\n      matches.forEach((elem) => {\n        elem.addEventListener(event, (e) => fn(e, elem), false);\n      });\n    }\n  }\n\n  const onLoad = function () {\n    let lastKnownScrollPosition = window.scrollY;\n    let ticking = true;\n\n    attachEvent('#header nav', 'click', function () {\n      document.querySelector('[data-aw-toggle-menu]')?.classList.remove('expanded');\n      document.body.classList.remove('overflow-hidden');\n      document.getElementById('header')?.classList.remove('h-screen');\n      document.getElementById('header')?.classList.remove('expanded');\n      document.getElementById('header')?.classList.remove('bg-page');\n      document.querySelector('#header nav')?.classList.add('hidden');\n      document.querySelector('#header > div > div:last-child')?.classList.add('hidden');\n    });\n\n    attachEvent('[data-aw-toggle-menu]', 'click', function (_, elem) {\n      elem.classList.toggle('expanded');\n      document.body.classList.toggle('overflow-hidden');\n      document.getElementById('header')?.classList.toggle('h-screen');\n      document.getElementById('header')?.classList.toggle('expanded');\n      document.getElementById('header')?.classList.toggle('bg-page');\n      document.querySelector('#header nav')?.classList.toggle('hidden');\n      document.querySelector('#header > div > div:last-child')?.classList.toggle('hidden');\n    });\n\n    attachEvent('[data-aw-toggle-color-scheme]', 'click', function () {\n      if (defaultTheme.endsWith(':only')) {\n        return;\n      }\n      document.documentElement.classList.toggle('dark');\n      localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';\n    });\n\n    attachEvent('[data-aw-social-share]', 'click', function (_, elem) {\n      const network = elem.getAttribute('data-aw-social-share');\n      const url = encodeURIComponent(elem.getAttribute('data-aw-url'));\n      const text = encodeURIComponent(elem.getAttribute('data-aw-text'));\n\n      let href;\n      switch (network) {\n        case 'facebook':\n          href = `https://www.facebook.com/sharer.php?u=${url}`;\n          break;\n        case 'twitter':\n          href = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;\n          break;\n        case 'linkedin':\n          href = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;\n          break;\n        case 'whatsapp':\n          href = `https://wa.me/?text=${text}%20${url}`;\n          break;\n        case 'mail':\n          href = `mailto:?subject=%22${text}%22&body=${text}%20${url}`;\n          break;\n\n        default:\n          return;\n      }\n\n      const newlink = document.createElement('a');\n      newlink.target = '_blank';\n      newlink.href = href;\n      newlink.click();\n    });\n\n    const screenSize = window.matchMedia('(max-width: 767px)');\n    screenSize.addEventListener('change', function () {\n      document.querySelector('[data-aw-toggle-menu]')?.classList.remove('expanded');\n      document.body.classList.remove('overflow-hidden');\n      document.getElementById('header')?.classList.remove('h-screen');\n      document.getElementById('header')?.classList.remove('expanded');\n      document.getElementById('header')?.classList.remove('bg-page');\n      document.querySelector('#header nav')?.classList.add('hidden');\n      document.querySelector('#header > div > div:last-child')?.classList.add('hidden');\n    });\n\n    function applyHeaderStylesOnScroll() {\n      const header = document.querySelector('#header[data-aw-sticky-header]');\n      if (!header) return;\n      if (lastKnownScrollPosition > 60 && !header.classList.contains('scroll')) {\n        header.classList.add('scroll');\n      } else if (lastKnownScrollPosition <= 60 && header.classList.contains('scroll')) {\n        header.classList.remove('scroll');\n      }\n      ticking = false;\n    }\n    applyHeaderStylesOnScroll();\n\n    attachEvent([document], 'scroll', function () {\n      lastKnownScrollPosition = window.scrollY;\n\n      if (!ticking) {\n        window.requestAnimationFrame(() => {\n          applyHeaderStylesOnScroll();\n        });\n        ticking = true;\n      }\n    });\n  };\n  const onPageShow = function () {\n    document.documentElement.classList.add('motion-safe:scroll-smooth');\n    const elem = document.querySelector('[data-aw-toggle-menu]');\n    if (elem) {\n      elem.classList.remove('expanded');\n    }\n    document.body.classList.remove('overflow-hidden');\n    document.getElementById('header')?.classList.remove('h-screen');\n    document.getElementById('header')?.classList.remove('expanded');\n    document.querySelector('#header nav')?.classList.add('hidden');\n  };\n\n  window.onload = onLoad;\n  window.onpageshow = onPageShow;\n\n  document.addEventListener('astro:after-swap', () => {\n    initTheme();\n    onLoad();\n    onPageShow();\n  });\n})();<\/script> <script>\n  /* Inspired by: https://github.com/heidkaemper/tailwindcss-intersect */\n  const Observer = {\n    observer: null,\n    delayBetweenAnimations: 100,\n    animationCounter: 0,\n\n    start() {\n      const selectors = [\n        '[class*=\" intersect:\"]',\n        '[class*=\":intersect:\"]',\n        '[class^=\"intersect:\"]',\n        '[class=\"intersect\"]',\n        '[class*=\" intersect \"]',\n        '[class^=\"intersect \"]',\n        '[class$=\" intersect\"]',\n      ];\n\n      const elements = Array.from(document.querySelectorAll(selectors.join(',')));\n\n      const getThreshold = (element) => {\n        if (element.classList.contains('intersect-full')) return 0.99;\n        if (element.classList.contains('intersect-half')) return 0.5;\n        if (element.classList.contains('intersect-quarter')) return 0.25;\n        return 0;\n      };\n\n      elements.forEach((el) => {\n        el.setAttribute('no-intersect', '');\n        el._intersectionThreshold = getThreshold(el);\n      });\n\n      const callback = (entries) => {\n        entries.forEach((entry) => {\n          requestAnimationFrame(() => {\n            const target = entry.target;\n            const intersectionRatio = entry.intersectionRatio;\n            const threshold = target._intersectionThreshold;\n\n            if (target.classList.contains('intersect-no-queue')) {\n              if (entry.isIntersecting) {\n                target.removeAttribute('no-intersect');\n                if (target.classList.contains('intersect-once')) {\n                  this.observer.unobserve(target);\n                }\n              } else {\n                target.setAttribute('no-intersect', '');\n              }\n              return;\n            }\n\n            if (intersectionRatio >= threshold) {\n              if (!target.hasAttribute('data-animated')) {\n                target.removeAttribute('no-intersect');\n                target.setAttribute('data-animated', 'true');\n\n                const delay = this.animationCounter * this.delayBetweenAnimations;\n                this.animationCounter++;\n\n                target.style.transitionDelay = `${delay}ms`;\n                target.style.animationDelay = `${delay}ms`;\n\n                if (target.classList.contains('intersect-once')) {\n                  this.observer.unobserve(target);\n                }\n              }\n            } else {\n              target.setAttribute('no-intersect', '');\n              target.removeAttribute('data-animated');\n              target.style.transitionDelay = '';\n              target.style.animationDelay = '';\n\n              this.animationCounter = 0;\n            }\n          });\n        });\n      };\n\n      this.observer = new IntersectionObserver(callback.bind(this), { threshold: [0, 0.25, 0.5, 0.99] });\n\n      elements.forEach((el) => {\n        this.observer.observe(el);\n      });\n    },\n  };\n\n  Observer.start();\n\n  document.addEventListener('astro:after-swap', () => {\n    Observer.start();\n  });\n<\/script>"], ["<script>(function(){", "\n  if (window.basic_script) {\n    return;\n  }\n\n  window.basic_script = true;\n\n  function applyTheme(theme) {\n    if (theme === 'dark') {\n      document.documentElement.classList.add('dark');\n    } else {\n      document.documentElement.classList.remove('dark');\n    }\n  }\n\n  const initTheme = function () {\n    if ((defaultTheme && defaultTheme.endsWith(':only')) || (!localStorage.theme && defaultTheme !== 'system')) {\n      applyTheme(defaultTheme.replace(':only', ''));\n    } else if (\n      localStorage.theme === 'dark' ||\n      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)\n    ) {\n      applyTheme('dark');\n    } else {\n      applyTheme('light');\n    }\n  };\n  initTheme();\n\n  function attachEvent(selector, event, fn) {\n    const matches = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;\n    if (matches && matches.length) {\n      matches.forEach((elem) => {\n        elem.addEventListener(event, (e) => fn(e, elem), false);\n      });\n    }\n  }\n\n  const onLoad = function () {\n    let lastKnownScrollPosition = window.scrollY;\n    let ticking = true;\n\n    attachEvent('#header nav', 'click', function () {\n      document.querySelector('[data-aw-toggle-menu]')?.classList.remove('expanded');\n      document.body.classList.remove('overflow-hidden');\n      document.getElementById('header')?.classList.remove('h-screen');\n      document.getElementById('header')?.classList.remove('expanded');\n      document.getElementById('header')?.classList.remove('bg-page');\n      document.querySelector('#header nav')?.classList.add('hidden');\n      document.querySelector('#header > div > div:last-child')?.classList.add('hidden');\n    });\n\n    attachEvent('[data-aw-toggle-menu]', 'click', function (_, elem) {\n      elem.classList.toggle('expanded');\n      document.body.classList.toggle('overflow-hidden');\n      document.getElementById('header')?.classList.toggle('h-screen');\n      document.getElementById('header')?.classList.toggle('expanded');\n      document.getElementById('header')?.classList.toggle('bg-page');\n      document.querySelector('#header nav')?.classList.toggle('hidden');\n      document.querySelector('#header > div > div:last-child')?.classList.toggle('hidden');\n    });\n\n    attachEvent('[data-aw-toggle-color-scheme]', 'click', function () {\n      if (defaultTheme.endsWith(':only')) {\n        return;\n      }\n      document.documentElement.classList.toggle('dark');\n      localStorage.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';\n    });\n\n    attachEvent('[data-aw-social-share]', 'click', function (_, elem) {\n      const network = elem.getAttribute('data-aw-social-share');\n      const url = encodeURIComponent(elem.getAttribute('data-aw-url'));\n      const text = encodeURIComponent(elem.getAttribute('data-aw-text'));\n\n      let href;\n      switch (network) {\n        case 'facebook':\n          href = \\`https://www.facebook.com/sharer.php?u=\\${url}\\`;\n          break;\n        case 'twitter':\n          href = \\`https://twitter.com/intent/tweet?url=\\${url}&text=\\${text}\\`;\n          break;\n        case 'linkedin':\n          href = \\`https://www.linkedin.com/shareArticle?mini=true&url=\\${url}&title=\\${text}\\`;\n          break;\n        case 'whatsapp':\n          href = \\`https://wa.me/?text=\\${text}%20\\${url}\\`;\n          break;\n        case 'mail':\n          href = \\`mailto:?subject=%22\\${text}%22&body=\\${text}%20\\${url}\\`;\n          break;\n\n        default:\n          return;\n      }\n\n      const newlink = document.createElement('a');\n      newlink.target = '_blank';\n      newlink.href = href;\n      newlink.click();\n    });\n\n    const screenSize = window.matchMedia('(max-width: 767px)');\n    screenSize.addEventListener('change', function () {\n      document.querySelector('[data-aw-toggle-menu]')?.classList.remove('expanded');\n      document.body.classList.remove('overflow-hidden');\n      document.getElementById('header')?.classList.remove('h-screen');\n      document.getElementById('header')?.classList.remove('expanded');\n      document.getElementById('header')?.classList.remove('bg-page');\n      document.querySelector('#header nav')?.classList.add('hidden');\n      document.querySelector('#header > div > div:last-child')?.classList.add('hidden');\n    });\n\n    function applyHeaderStylesOnScroll() {\n      const header = document.querySelector('#header[data-aw-sticky-header]');\n      if (!header) return;\n      if (lastKnownScrollPosition > 60 && !header.classList.contains('scroll')) {\n        header.classList.add('scroll');\n      } else if (lastKnownScrollPosition <= 60 && header.classList.contains('scroll')) {\n        header.classList.remove('scroll');\n      }\n      ticking = false;\n    }\n    applyHeaderStylesOnScroll();\n\n    attachEvent([document], 'scroll', function () {\n      lastKnownScrollPosition = window.scrollY;\n\n      if (!ticking) {\n        window.requestAnimationFrame(() => {\n          applyHeaderStylesOnScroll();\n        });\n        ticking = true;\n      }\n    });\n  };\n  const onPageShow = function () {\n    document.documentElement.classList.add('motion-safe:scroll-smooth');\n    const elem = document.querySelector('[data-aw-toggle-menu]');\n    if (elem) {\n      elem.classList.remove('expanded');\n    }\n    document.body.classList.remove('overflow-hidden');\n    document.getElementById('header')?.classList.remove('h-screen');\n    document.getElementById('header')?.classList.remove('expanded');\n    document.querySelector('#header nav')?.classList.add('hidden');\n  };\n\n  window.onload = onLoad;\n  window.onpageshow = onPageShow;\n\n  document.addEventListener('astro:after-swap', () => {\n    initTheme();\n    onLoad();\n    onPageShow();\n  });\n})();<\/script> <script>\n  /* Inspired by: https://github.com/heidkaemper/tailwindcss-intersect */\n  const Observer = {\n    observer: null,\n    delayBetweenAnimations: 100,\n    animationCounter: 0,\n\n    start() {\n      const selectors = [\n        '[class*=\" intersect:\"]',\n        '[class*=\":intersect:\"]',\n        '[class^=\"intersect:\"]',\n        '[class=\"intersect\"]',\n        '[class*=\" intersect \"]',\n        '[class^=\"intersect \"]',\n        '[class$=\" intersect\"]',\n      ];\n\n      const elements = Array.from(document.querySelectorAll(selectors.join(',')));\n\n      const getThreshold = (element) => {\n        if (element.classList.contains('intersect-full')) return 0.99;\n        if (element.classList.contains('intersect-half')) return 0.5;\n        if (element.classList.contains('intersect-quarter')) return 0.25;\n        return 0;\n      };\n\n      elements.forEach((el) => {\n        el.setAttribute('no-intersect', '');\n        el._intersectionThreshold = getThreshold(el);\n      });\n\n      const callback = (entries) => {\n        entries.forEach((entry) => {\n          requestAnimationFrame(() => {\n            const target = entry.target;\n            const intersectionRatio = entry.intersectionRatio;\n            const threshold = target._intersectionThreshold;\n\n            if (target.classList.contains('intersect-no-queue')) {\n              if (entry.isIntersecting) {\n                target.removeAttribute('no-intersect');\n                if (target.classList.contains('intersect-once')) {\n                  this.observer.unobserve(target);\n                }\n              } else {\n                target.setAttribute('no-intersect', '');\n              }\n              return;\n            }\n\n            if (intersectionRatio >= threshold) {\n              if (!target.hasAttribute('data-animated')) {\n                target.removeAttribute('no-intersect');\n                target.setAttribute('data-animated', 'true');\n\n                const delay = this.animationCounter * this.delayBetweenAnimations;\n                this.animationCounter++;\n\n                target.style.transitionDelay = \\`\\${delay}ms\\`;\n                target.style.animationDelay = \\`\\${delay}ms\\`;\n\n                if (target.classList.contains('intersect-once')) {\n                  this.observer.unobserve(target);\n                }\n              }\n            } else {\n              target.setAttribute('no-intersect', '');\n              target.removeAttribute('data-animated');\n              target.style.transitionDelay = '';\n              target.style.animationDelay = '';\n\n              this.animationCounter = 0;\n            }\n          });\n        });\n      };\n\n      this.observer = new IntersectionObserver(callback.bind(this), { threshold: [0, 0.25, 0.5, 0.99] });\n\n      elements.forEach((el) => {\n        this.observer.observe(el);\n      });\n    },\n  };\n\n  Observer.start();\n\n  document.addEventListener('astro:after-swap', () => {\n    Observer.start();\n  });\n<\/script>"])), defineScriptVars({ defaultTheme: UI.theme }));
}, "/Users/lucasanna/lswebagency2025/src/components/common/BasicScripts.astro", void 0);

const $$Astro$1 = createAstro("https://lswebagency.com");
const $$ClientRouter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$ClientRouter;
  const { fallback = "animate" } = Astro2.props;
  return renderTemplate`<meta name="astro-view-transitions-enabled" content="true"><meta name="astro-view-transitions-fallback"${addAttribute(fallback, "content")}>${renderScript($$result, "/Users/lucasanna/lswebagency2025/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/lucasanna/lswebagency2025/node_modules/astro/components/ClientRouter.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://lswebagency.com");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { metadata = {} } = Astro2.props;
  const siteTitle = "LS Web Agency";
  const cleanTitle = metadata.title?.trim();
  const pageTitle = cleanTitle && !cleanTitle.includes(siteTitle) ? `${cleanTitle} | ${siteTitle}` : cleanTitle || siteTitle;
  const pageDescription = metadata.description || "Soluzioni digitali su misura per la tua attivit\xE0.";
  const pageImage = metadata.image?.src || "/images/default-og-image.jpg";
  const canonicalUrl = metadata.canonical || "https://lswebagency.com";
  return renderTemplate(_a || (_a = __template(["<html", "", ' class="2xl:text-[20px]"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>', '</title><meta name="description"', '><meta name="robots" content="index, follow"><!-- Favicon standard --><link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" type="image/x-icon" href="/favicon.ico"><!-- Apple Touch Icon per iOS --><link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- Web App Manifest per Android e PWA --><link rel="manifest" href="/site.webmanifest"><!-- Icone per Web App --><meta name="theme-color" content="#ffffff"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="LS Web Agency"><meta name="application-name" content="LS Web Agency"><meta name="msapplication-TileColor" content="#ffffff"><meta name="msapplication-TileImage" content="/web-app-manifest-192x192.png"><!-- Open Graph (Facebook, LinkedIn, WhatsApp) --><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><meta property="og:type" content="website"><meta property="og:url"', '><!-- Twitter Card --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"', '><meta name="twitter:description"', '><meta name="twitter:image"', '><!-- Canonical --><link rel="canonical"', ">", "", "", "", "", "", "", "<!-- Transizioni di visualizzazione -->", "", "<title>", '</title><meta name="description"', '><!-- FAQ Schema --><script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [\n    {\n      "@type": "Question",\n      "name": "Quanto costa un sito web professionale a Sassari?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "I prezzi variano in base al progetto, ma offriamo soluzioni su misura a partire da 490\u20AC. Ogni preventivo \xE8 personalizzato."\n      }\n    },\n    {\n      "@type": "Question",\n      "name": "In quanto tempo viene realizzato il sito?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Un sito web base pu\xF2 essere online in 1-2 settimane. Per progetti pi\xF9 complessi come e-commerce o landing page avanzate, si pu\xF2 arrivare a 4 settimane."\n      }\n    },\n    {\n      "@type": "Question",\n      "name": "Il sito sar\xE0 visibile su Google?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "S\xEC, ogni nostro sito \xE8 ottimizzato SEO fin dalla fase di progettazione per migliorare il posizionamento su Google."\n      }\n    },\n    {\n      "@type": "Question",\n      "name": "Posso aggiornare il sito in autonomia?",\n      "acceptedAnswer": {\n        "@type": "Answer",\n        "text": "Certo! Ti forniamo un pannello semplice e intuitivo, con possibilit\xE0 di aggiornamenti assistiti se richiesti."\n      }\n    }\n  ]\n}\n<\/script>', '</head> <body class="antialiased text-default bg-page tracking-tight"> ', " ", " </body></html>"])), addAttribute(I18N.language, "lang"), addAttribute(I18N.textDirection, "dir"), pageTitle, addAttribute(pageDescription, "content"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(canonicalUrl, "content"), addAttribute(pageTitle, "content"), addAttribute(pageDescription, "content"), addAttribute(pageImage, "content"), addAttribute(metadata.canonical ? metadata.canonical : Astro2.url.pathname, "href"), renderComponent($$result, "CommonMeta", $$CommonMeta, {}), renderComponent($$result, "Favicons", $$Favicons, {}), renderComponent($$result, "CustomStyles", $$CustomStyles, {}), renderComponent($$result, "ApplyColorMode", $$ApplyColorMode, {}), renderComponent($$result, "Metadata", $$Metadata, { ...metadata }), renderComponent($$result, "SiteVerification", $$SiteVerification, {}), renderComponent($$result, "Analytics", $$Analytics, {}), renderComponent($$result, "ClientRouter", $$ClientRouter, { "fallback": "swap" }), renderScript($$result, "/Users/lucasanna/lswebagency2025/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts"), metadata.title, addAttribute(metadata.description, "content"), renderHead(), renderSlot($$result, $$slots["default"]), renderComponent($$result, "BasicScripts", $$BasicScripts, {}));
}, "/Users/lucasanna/lswebagency2025/src/layouts/Layout.astro", void 0);

export { $$Layout as $, astroAsseetsOptimizer as a, findImage as f, getImagesOptimized as g, isUnpicCompatible as i, unpicOptimizer as u };
