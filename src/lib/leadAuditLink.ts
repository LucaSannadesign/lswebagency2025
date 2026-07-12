// src/lib/leadAuditLink.ts
// Collegamento best-effort tra un lead e un audit Site Rescue nella tabella
// ponte public.lead_site_audits (primary key composta lead_id + audit_id).
// La logica accetta un client minimale per essere testabile senza database.

// Esito interno del collegamento (mai esposto al browser né in email con ID).
export type AuditLinkOutcome = 'collegato' | 'gia_collegato' | 'non_collegato' | 'non_applicabile';

export type AuditLinkResult = {
  outcome: Exclude<AuditLinkOutcome, 'non_applicabile'>;
  errorMessage?: string;
};

// Interfaccia strutturale minima del client Supabase usata dal collegamento:
// consente un fake nei test senza dipendere da supabase-js.
export type LeadAuditLinkClient = {
  from: (table: string) => {
    insert: (values: {
      lead_id: string;
      audit_id: string;
    }) => PromiseLike<{ error: { code?: string; message?: string } | null }>;
  };
};

// Violazione di vincolo unique/primary key in PostgreSQL.
const PG_UNIQUE_VIOLATION = '23505';

// Inserisce la relazione lead↔audit. Il conflitto sulla PK composta (23505)
// è un esito atteso ("gia_collegato"), non un errore; ogni altro errore o
// eccezione produce "non_collegato" con il messaggio da loggare sanitizzato
// a carico del chiamante. Non lancia mai.
export async function linkLeadToAudit(
  client: LeadAuditLinkClient,
  leadId: string,
  auditId: string,
): Promise<AuditLinkResult> {
  try {
    const { error } = await client.from('lead_site_audits').insert({ lead_id: leadId, audit_id: auditId });
    if (!error) return { outcome: 'collegato' };
    if (error.code === PG_UNIQUE_VIOLATION) return { outcome: 'gia_collegato' };
    return { outcome: 'non_collegato', errorMessage: error.message || 'errore sconosciuto' };
  } catch (err) {
    return { outcome: 'non_collegato', errorMessage: err instanceof Error ? err.message : String(err) };
  }
}
