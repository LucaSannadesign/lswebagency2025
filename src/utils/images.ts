import { isUnpicCompatible, unpicOptimizer, astroAsseetsOptimizer } from './images-optimization';
import type { ImageMetadata } from 'astro';
import type { OpenGraph } from '@astrolib/seo';

/* -------------------------------------------------------
   Loader delle immagini locali (/src/assets/images/**)
   (accetta path passati come "@/..." o "~/" e li normalizza)
------------------------------------------------------- */

// normalizza alias "~/" e "@/" in "/src/"
const resolveSrcAlias = (p: string) => p.replace(/^~\//, '/src/').replace(/^@\//, '/src/');

// verifica se il path fa riferimento alla nostra cartella assets
const isLocalAsset = (p?: string) =>
  !!p && (p.startsWith('~/assets/') || p.startsWith('@/assets/'));

const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    // NB: usiamo direttamente /src/... per evitare problemi di alias nei glob
    images = import.meta.glob(
      '/src/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}'
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    // Ignora: il progetto può non avere /src/assets/images
  }
  return images;
};

let _images: Record<string, () => Promise<unknown>> | undefined;

/** Carica (una sola volta) la mappa di immagini locali */
export const fetchLocalImages = async () => {
  _images = _images || (await load());
  return _images;
};

/** Risolve un path immagine.
 *  - http/https → restituito com’è (string)
 *  - /assoluto (public) → restituito com’è (string)
 *  - @/assets/** o ~/assets/** → prova a risolvere in ImageMetadata via import.meta.glob
 *  - altro → restituito com’è (string)
 */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  // Non-string → è già ImageMetadata o null/undefined
  if (typeof imagePath !== 'string') return imagePath;

  // Path remoti o assoluti (public) → non risolviamo
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/')) {
    return imagePath;
  }

  // Se non punta ai nostri assets locali, restituisci com’è
  if (!isLocalAsset(imagePath)) {
    return imagePath;
  }

  // Prova a risolvere un asset locale via import.meta.glob
  const images = await fetchLocalImages();
  const key = resolveSrcAlias(imagePath); // "@/..."/"~/" → "/src/..."

  return images && typeof images[key] === 'function'
    ? ((await images[key]()) as { default: ImageMetadata }).default
    : null;
};

/* -------------------------------------------------------
   Adattatore OpenGraph Images (versione SAFE)
   - http/https: non ottimizzare (usa width/height o default)
   - /public:    non ottimizzare (usa width/height o default)
   - @/assets o ~/: prova ottimizzazione (unpic / astro:assets)
------------------------------------------------------- */

const isHttp = (u?: string) => !!u && /^https?:\/\//i.test(u);
const isAbsolutePublic = (u?: string) => !!u && u.startsWith('/');

export async function adaptOpenGraphImages<T extends { openGraph?: OpenGraph }>(meta: T): Promise<T> {
  const images = (meta?.openGraph as OpenGraph | undefined)?.images;
  if (!images || images.length === 0) return meta;

  const DEFAULT_W = 1200;
  const DEFAULT_H = 626;

  const mapped = await Promise.all(
    images.map(async (img: any) => {
      const o = typeof img === 'string' ? { url: img } : img;
      const url: string | undefined = o?.url;
      if (!url) return { url: '' };

      // 1) URL remoti → NON ottimizzare
      if (isHttp(url)) {
        return {
          url,
          width: o.width ?? DEFAULT_W,
          height: o.height ?? DEFAULT_H,
        };
      }

      // 2) /public → NON passare per astro:assets
      if (isAbsolutePublic(url)) {
        return {
          url,
          width: o.width ?? DEFAULT_W,
          height: o.height ?? DEFAULT_H,
        };
      }

      // 3) "@/assets/**" o "~/**" → prova a risolvere/ottimizzare
      const resolved = (await findImage(url)) as ImageMetadata | string | undefined | null;
      if (!resolved) return { url: '' };

      // 3.a) Se resolvesse in URL remoto compatibile con unpic → usa unpic
      if (typeof resolved === 'string' && isHttp(resolved) && isUnpicCompatible(resolved)) {
        const out = (await unpicOptimizer(resolved, [DEFAULT_W], DEFAULT_W, DEFAULT_H, 'jpg'))[0];
        return {
          url: out?.src ?? '',
          width: (out as any)?.width ?? DEFAULT_W,
          height: (out as any)?.height ?? DEFAULT_H,
        };
      }

      // 3.b) ImageMetadata locale (/src/assets/...) → usa astro:assets
      const dims =
        typeof resolved !== 'string' && resolved?.width && resolved.width <= DEFAULT_W
          ? [resolved.width, resolved.height]
          : [DEFAULT_W, DEFAULT_H];

      const out = (await astroAsseetsOptimizer(resolved as any, [dims[0]], dims[0], dims[1], 'jpg'))[0];

      return {
        url: out?.src ?? '',
        width: (out as any)?.width ?? dims[0],
        height: (out as any)?.height ?? dims[1],
      };
    })
  );

  return {
    ...meta,
    openGraph: {
      ...(meta.openGraph || ({} as OpenGraph)),
      images: mapped,
    },
  };
}