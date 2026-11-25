/** Ordinamento del portfolio per data di caricamento o ultima modifica della scheda.
 * Usa updateDate se disponibile (es. schede aggiornate), altrimenti publishDate.
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

export function comparePortfolioByRecency(a: PortfolioSortable, b: PortfolioSortable): number {
  const aDate = toTimestamp(a.data.updateDate) || toTimestamp(a.data.publishDate);
  const bDate = toTimestamp(b.data.updateDate) || toTimestamp(b.data.publishDate);
  return bDate - aDate || String(a.data.slug ?? '').localeCompare(String(b.data.slug ?? ''), 'it');
}
