// src/utils/mini-analisi/options.ts
//
// Opzione di una domanda della mini-analisi.
//
// Formato retrocompatibile:
//  - una STRINGA semplice funge sia da valore tecnico (salvato/confrontato) sia da
//    testo mostrato all'utente (comportamento storico: la maggior parte delle opzioni);
//  - un OGGETTO { value, label } separa il valore tecnico interno (`value`, usato da
//    computeProfile e dall'API) dal testo pubblico (`label`, mostrato nell'interfaccia).
//
// Regola d'oro: si salva/confronta sempre `optionValue(...)`, si mostra sempre
// `optionLabel(...)`. Non inviare mai il label al posto del value.

export type Option = string | { value: string; label: string };

/** Valore tecnico interno dell'opzione (salvato nelle risposte, confrontato dalla logica). */
export function optionValue(option: Option): string {
  return typeof option === 'string' ? option : option.value;
}

/** Testo pubblico dell'opzione (mostrato all'utente). */
export function optionLabel(option: Option): string {
  return typeof option === 'string' ? option : option.label;
}
