import slugify from 'limax';

const SITE = {"name":"LS Web Agency","site":"https://lswebagency.com","base":"/","trailingSlash":false,"googleSiteVerificationId":"orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M"};
                    const I18N = {"language":"en","textDirection":"ltr"};
                    const METADATA = {"title":{"default":"LS Web Agency","template":"%s — LS Web Agency"},"description":"🚀 Creazione di siti web professionali, SEO, web design e sviluppo e-commerce. Realizziamo soluzioni digitali su misura per aziende, startup e professionisti.","openGraph":{"type":"website","site_name":"LS Web Agency","images":[{"url":"~/assets/images/default.png","width":1200,"height":628}]},"twitter":{"handle":"@onwidget","site":"@onwidget","cardType":"summary_large_image"}};
                    const APP_BLOG = {"postsPerPage":6,"post":{"permalink":"/%slug%","robots":{"index":true,"follow":true}},"list":{"pathname":"blog","robots":{"follow":true}},"category":{"pathname":"category","robots":{"index":true,"follow":true}},"tag":{"pathname":"tag","robots":{"index":false,"follow":true}}};
                    const UI = {"theme":"system"};

const formatter = new Intl.DateTimeFormat(I18N?.language, {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC"
});
const getFormattedDate = (date) => date ? formatter.format(date) : "";
const trim = (str = "", ch) => {
  let start = 0, end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

const trimSlash = (s) => trim(trim(s, "/"));
const createPath = (...params) => {
  const paths = params.map((el) => trimSlash(el)).filter((el) => !!el).join("/");
  return "/" + paths + ("");
};
const BASE_PATHNAME = SITE.base;
const cleanSlug = (text = "") => trimSlash(text).split("/").map((slug) => slugify(slug)).join("/");
const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || "tag";
const POST_PERMALINK_PATTERN = trimSlash((APP_BLOG.post.permalink.replace(/^\/blog\/?/, "") ) || `${BLOG_BASE}/%slug%`);
const getCanonical = (path = "") => {
  const url = String(new URL(path, SITE.site));
  if (path && url.endsWith("/")) {
    return url.slice(0, -1);
  }
  return url;
};
const getPermalink = (slug = "", type = "page") => {
  let permalink;
  if (slug.startsWith("https://") || slug.startsWith("http://") || slug.startsWith("://") || slug.startsWith("#") || slug.startsWith("javascript:")) {
    return slug;
  }
  switch (type) {
    case "home":
      permalink = getHomePermalink();
      break;
    case "blog":
      permalink = getBlogPermalink();
      break;
    case "asset":
      permalink = getAsset(slug);
      break;
    case "category":
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;
    case "tag":
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;
    case "post":
      permalink = createPath(trimSlash(slug));
      break;
    case "page":
    default:
      permalink = createPath(slug);
      break;
  }
  return definitivePermalink(permalink);
};
const getHomePermalink = () => getPermalink("/");
const getBlogPermalink = () => getPermalink(BLOG_BASE);
const getAsset = (path) => "/" + [BASE_PATHNAME, path].map((el) => trimSlash(el)).filter((el) => !!el).join("/");
const definitivePermalink = (permalink) => createPath(BASE_PATHNAME, permalink);

export { APP_BLOG as A, BLOG_BASE as B, CATEGORY_BASE as C, I18N as I, METADATA as M, POST_PERMALINK_PATTERN as P, SITE as S, TAG_BASE as T, UI as U, getHomePermalink as a, getFormattedDate as b, cleanSlug as c, getBlogPermalink as d, getCanonical as e, getAsset as f, getPermalink as g, trimSlash as t };
