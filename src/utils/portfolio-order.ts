/** Ordinamento del portfolio in base alla data di pubblicazione della scheda.
 * Nei contenuti legacy senza publishDate, usa updateDate come fallback.
 * Non privilegia i progetti per stato (cliente, pilota, storico).
 */
type PortfolioSortable = {
  data: {
    publishDate?: Date | string;
    updateDate?: Date | string;
    slug?: string;
  };
};

function toTimestamp(value?: Date | string): number {
  if (!value) return 0;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function comparePortfolioByPublication(a: PortfolioSortable, b: PortfolioSortable): number {
  const aDate = toTimestamp(a.data.publishDate) || toTimestamp(a.data.updateDate);
  const bDate = toTimestamp(b.data.publishDate) || toTimestamp(b.data.updateDate);
  return bDate - aDate || String(a.data.slug ?? '').localeCompare(String(b.data.slug ?? ''), 'it');
}
