/**
 * Stati dei progetti del portfolio (campo `projectStatus` della collection).
 * Le schede senza stato ricevono «Archivio»: un'etichetta neutra, al posto
 * della precedente «Sito non più online», che non era verificata.
 */
export type StatusKey =
  | 'live_client'
  | 'independent_active'
  | 'independent_pilot'
  | 'editorial_project'
  | 'historical'
  | 'unclassified';

export const STATUS_LABEL: Record<StatusKey, string> = {
  live_client: 'Sito cliente attivo',
  independent_active: 'Progetto indipendente · Online',
  independent_pilot: 'Progetto indipendente · In sviluppo',
  editorial_project: 'Grafica editoriale',
  historical: 'Case study storico',
  unclassified: 'Archivio',
};

export const STATUS_ORDER: StatusKey[] = [
  'live_client',
  'independent_active',
  'independent_pilot',
  'editorial_project',
  'historical',
  'unclassified',
];

export function statusOf(data: { projectStatus?: string } | undefined): StatusKey {
  const s = data?.projectStatus as StatusKey | undefined;
  return s && s in STATUS_LABEL ? s : 'unclassified';
}

/** Etichetta mostrata: lo stageLabel della scheda, se presente, ha la precedenza */
export function statusLabel(data: { projectStatus?: string; stageLabel?: string } | undefined): string {
  return data?.stageLabel ?? STATUS_LABEL[statusOf(data)];
}

/** I quattro progetti in evidenza (ordine stabilito) */
export const FEATURED_IDS = ['preventivodentale', 'canapalandia-blog', 'lughe', 'yoartly'];
