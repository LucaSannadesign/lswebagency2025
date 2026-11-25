/**
 * Archivio del portfolio condiviso tra /portfolio e /portfolio/page/N:
 * tutte le schede non in bozza, ordinate per recenza, esclusi i 4 progetti in
 * evidenza (mostrati sopra l'archivio solo in /portfolio). Stessa paginazione
 * (12 per pagina) e stessi URL di prima.
 */
import { getCollection } from 'astro:content';
import { comparePortfolioByRecency } from '@/utils/portfolio-order';
import { FEATURED_IDS, statusOf, STATUS_ORDER, type StatusKey } from './portfolio-status';

export const PER_PAGE = 12;

export async function getPortfolio() {
  const all = (await getCollection('portfolio', (e) => !(e.data as { draft?: boolean })?.draft))
    .slice()
    .sort(comparePortfolioByRecency);
  const featured = FEATURED_IDS.map((id) => all.find((e) => e.id === id)).filter(Boolean) as typeof all;
  const archive = all.filter((e) => !FEATURED_IDS.includes(e.id));
  const totalPages = Math.max(1, Math.ceil(archive.length / PER_PAGE));
  const counts = STATUS_ORDER.map((s) => [s, all.filter((e) => statusOf(e.data) === s).length] as [StatusKey, number]).filter(
    ([, n]) => n > 0
  );
  return { all, featured, archive, totalPages, counts };
}
