import { isUnpicCompatible, unpicOptimizer, astroAsseetsOptimizer } from './images-optimization';
import type { ImageMetadata } from 'astro';
import type { OpenGraph } from '@astrolib/seo';

/* -------------------------------------------------------
   Loader delle immagini locali (~/assets/images/**)
------------------------------------------------------- */

const load = async function () {
  let images: Record<string, () => Promise<unknown>> | undefined = undefined;
  try {
    images = import.meta.glob(
      '~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}'
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    // ignora errori: il progetto può non avere ~/assets/images
  }
  return images;
};

let _images: Record<string, () => Promise<unknown>> | undefined = undefined;

/** Carica (una sola volta) la mappa di immagini locali */
export const fetchLocalImages = async () => {
  _images = _images || (await load());
  return _images;
};

/** Risolve un path immagine.
 *  - http/https → restituito com’è (string)
 *  - /assoluto (public) → restituito com’è (string)
 *  - ~/assets/images/** → prova a risolvere in ImageMetadata via import.meta.glob
 *  - altro → restituito com’è (string)
 */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  // Non-string → lascio passare (già ImageMetadata o null/undefined)
  if (typeof imagePath !== 'string') return imagePath;

  // Path assoluti o HTTP → non risolvo
  if (
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://') ||
    imagePath.startsWith('/')
  ) {
    return imagePath;
  }

  // Se NON è in ~/assets/images → restituisco com’è
  if (!imagePath.startsWith('~/assets/images')) {
    return imagePath;
  }

  // Provo a risolvere un asset locale via import.meta.glob
  const images = await fetchLocalImages();
  const key = imagePath.replace('~/', '/src/');

  return images && typeof images[key] === 'function'
    ? ((await images[key]()) as { default: ImageMetadata }).default
    : null;
};

/* -------------------------------------------------------
   Adattatore OpenGraph Images (versione SAFE)
   - http/https: non ottimizzare (usa width/height o default)
   - /public:    non ottimizzare (usa width/height o default)
   - ~/assets:   prova ottimizzazione (unpic/astro:assets)
------------------------------------------------------- */

// helpers locali
const isHttp = (u?: string) => !!u && /^https?:\/\//i.test(u);
const isAbsolutePublic = (u?: string) => !!u && u.startsWith('/');

/** Adatta openGraph.images evitando probe/errore su URL remoti o /public */
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

      // 1) URL remoti → NON ottimizzare (niente fetch dimensioni)
      if (isHttp(url)) {
        return {
          url,
          width: o.width ?? DEFAULT_W,
          height: o.height ?? DEFAULT_H,
        };
      }

      // 2) URL assoluti (file in /public) → NON passare per astro:assets
      if (isAbsolutePublic(url)) {
        return {
          url,
          width: o.width ?? DEFAULT_W,
          height: o.height ?? DEFAULT_H,
        };
      }

      // 3) ~/assets/images/** → prova a risolvere/ottimizzare
      const resolved = (await findImage(url)) as ImageMetadata | string | undefined | null;
      if (!resolved) return { url: '' };

      // 3.a) Remoto compatibile con unpic → usa unpic
      if (typeof resolved === 'string' && isHttp(resolved) && isUnpicCompatible(resolved)) {
        const out = (await unpicOptimizer(resolved, [DEFAULT_W], DEFAULT_W, DEFAULT_H, 'jpg'))[0];
        return {
          url: out?.src ?? '',
          width: (out as any)?.width ?? DEFAULT_W,
          height: (out as any)?.height ?? DEFAULT_H,
        };
      }

      // 3.b) ImageMetadata locale (da ~/assets) → astro:assets
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