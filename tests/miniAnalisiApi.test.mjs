// Test di regressione per l'endpoint src/pages/api/mini-analisi.ts.
//
// Percorso completamente simulato: Supabase (CRM), Resend e fetch sono sostituiti
// da stub locali iniettati in fase di bundle con esbuild. Nessuna credenziale
// reale, nessun invio email, nessuna scrittura su database remoto: qualsiasi
// chiamata di rete non prevista fa fallire il test.
//
// Esecuzione (Node 22.x):
//   node --experimental-strip-types --test tests/miniAnalisiApi.test.mjs
//   (oppure: npm run test:unit)
import test from "node:test";
import assert from "node:assert/strict";
import * as esbuild from "esbuild";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = fileURLToPath(new URL("../", import.meta.url));

// --- Bundle dell'endpoint con moduli esterni sostituiti da stub ---------------

const MOCK_SUPABASE =
  "export const supabaseAdmin = { from: (table) => globalThis.__miniAnalisiMock.supabase.from(table) };";
const MOCK_RESEND = `export class Resend {
  constructor(key) {
    this.emails = { send: (payload) => globalThis.__miniAnalisiMock.resendSend(payload, key) };
  }
}`;

const bundle = await esbuild.build({
  entryPoints: ["src/pages/api/mini-analisi.ts"],
  absWorkingDir: ROOT,
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
  logLevel: "silent",
  define: { "import.meta.env": "globalThis.__miniAnalisiEnv" },
  plugins: [
    {
      name: "mini-analisi-stubs",
      setup(b) {
        b.onResolve({ filter: /^resend$/ }, () => ({
          path: "resend",
          namespace: "stub",
        }));
        b.onResolve({ filter: /lib\/supabase\.server$/ }, () => ({
          path: "supabase",
          namespace: "stub",
        }));
        b.onLoad({ filter: /.*/, namespace: "stub" }, (args) => ({
          contents: args.path === "resend" ? MOCK_RESEND : MOCK_SUPABASE,
          loader: "js",
        }));
      },
    },
  ],
});
const endpointModule = { exports: {} };
new Function("module", "exports", "require", bundle.outputFiles[0].text)(
  endpointModule,
  endpointModule.exports,
  require,
);
const { POST } = endpointModule.exports;

// --- Stub Supabase: query builder concatenabile che registra ogni operazione ---

function createSupabase(handlers = {}) {
  const calls = [];
  const client = {
    from(table) {
      const q = { table, op: "select", values: undefined, filters: [] };
      calls.push(q);
      const builder = {
        insert(values) {
          q.op = "insert";
          q.values = values;
          return builder;
        },
        select() {
          return builder;
        },
        single() {
          return builder;
        },
        eq(col, val) {
          q.filters.push(["eq", col, val]);
          return builder;
        },
        in(col, val) {
          q.filters.push(["in", col, val]);
          return builder;
        },
        gte(col, val) {
          q.filters.push(["gte", col, val]);
          return builder;
        },
        limit() {
          return builder;
        },
        then(resolve, reject) {
          const handler = handlers[table];
          if (!handler)
            return Promise.reject(
              new Error(`tabella non prevista: ${table}`),
            ).then(resolve, reject);
          return Promise.resolve()
            .then(() => handler(q))
            .then(resolve, reject);
        },
      };
      return builder;
    },
  };
  return { client, calls };
}

const LEAD_ID = "00000000-0000-4000-8000-00000000lead";
const AUDIT_ID = "00000000-0000-4000-8000-0000000audit";

const leadOk = () => ({ data: { id: LEAD_ID }, error: null });
const auditNone = (q) =>
  q.op === "select"
    ? { data: [], error: null }
    : { data: { id: AUDIT_ID }, error: null };
const linkOk = () => ({ error: null });

const BASE_ENV = {
  RESEND_API_KEY: "re_test_fake",
  CONTACT_TO_EMAIL: "admin@example.test",
  CONTACT_FROM_EMAIL: "noreply@example.test",
};

const ANSWERS = {
  siteStatus: "Ho un sito ma non porta risultati",
  businessType: "Professionista",
  mainGoal: "Ricevere più richieste",
  primaryNeed: "Restyling del sito",
  assets: "Solo logo",
  contactMethod: "Email",
  urgency: "Entro 1 mese",
};

function validBody(extra = {}) {
  return {
    contactName: "Mario Rossi",
    email: "mario.rossi@example.test",
    phone: "",
    businessName: "",
    message: "Vorrei capire da dove partire.",
    privacyConsent: true,
    honeypot: "",
    answers: ANSWERS,
    ...extra,
  };
}

/**
 * Esegue una richiesta all'endpoint in ambiente simulato e restituisce
 * risposta, chiamate registrate e log catturati (mai stampati a console).
 */
async function call(
  body,
  { env = BASE_ENV, supabase = {}, resend, fetchImpl } = {},
) {
  const db = createSupabase({ leads: leadOk, ...supabase });
  const emails = [];
  const fetches = [];
  const logs = [];

  globalThis.__miniAnalisiEnv = { ...env };
  globalThis.__miniAnalisiMock = {
    supabase: db.client,
    resendSend: async (payload, key) => {
      emails.push({ payload, key });
      return resend
        ? resend(payload)
        : { data: { id: "email-1" }, error: null };
    },
  };

  const originalFetch = globalThis.fetch;
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
  };
  globalThis.fetch = async (url, init) => {
    fetches.push({ url: String(url), init });
    if (!fetchImpl) throw new Error(`rete non consentita nei test: ${url}`);
    return fetchImpl(url, init);
  };
  for (const level of ["log", "warn", "error"]) {
    console[level] = (...args) =>
      logs.push(
        args
          .map((a) =>
            typeof a === "string"
              ? a
              : a instanceof Error
                ? a.stack
                : JSON.stringify(a),
          )
          .join(" "),
      );
  }

  try {
    const request = new Request("http://localhost/api/mini-analisi", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
    const res = await POST({ request });
    const text = await res.text();
    return {
      status: res.status,
      headers: res.headers,
      text,
      data: JSON.parse(text),
      calls: db.calls,
      emails,
      fetches,
      logs: logs.join("\n"),
    };
  } finally {
    globalThis.fetch = originalFetch;
    Object.assign(console, originalConsole);
  }
}

const writes = (r) => r.calls.filter((c) => c.op === "insert");

// --- 1. Successo ----------------------------------------------------------------

test("successo: lead salvato nel CRM simulato e notifica admin simulata", async () => {
  const r = await call(validBody());
  assert.equal(r.status, 200);
  assert.equal(r.headers.get("cache-control"), "no-store");
  assert.equal(r.data.ok, true);
  assert.equal(r.data.leadSaved, true);
  assert.equal(r.data.emailSent, true);
  assert.equal(r.data.auditQueued, false);
  assert.equal(r.data.clientReceiptSent, false);
  assert.equal(r.data.clientReportExpected, false);

  const inserts = writes(r);
  assert.equal(inserts.length, 1, "una sola scrittura: il lead");
  const lead = inserts[0];
  assert.equal(lead.table, "leads");
  assert.equal(lead.values.contact_name, "Mario Rossi");
  assert.equal(lead.values.email, "mario.rossi@example.test");
  assert.equal(lead.values.phone, null);
  assert.equal(lead.values.business_name, "Lead da Mini-Analisi");
  assert.equal(lead.values.status, "nuovo");
  assert.equal(lead.values.source, "altro");
  assert.equal(
    lead.values.priority,
    "alta",
    'urgenza "Entro 1 mese" → priorità alta',
  );
  assert.deepEqual(lead.values.problem_detected.sort(), [
    "pochi_contatti",
    "sito_vecchio",
  ]);
  assert.match(lead.values.notes, /Origine: mini_analisi/);
  assert.doesNotMatch(lead.values.notes, /Consenso all’analisi tecnica/);

  assert.equal(r.emails.length, 1);
  const { payload } = r.emails[0];
  assert.deepEqual(payload.to, ["admin@example.test"]);
  assert.equal(payload.replyTo, "mario.rossi@example.test");
  assert.equal(
    payload.subject,
    "Nuova mini-analisi LS Web Agency — Mario Rossi",
  );
  assert.match(payload.text, /Audit del sito: non richiesto/);
  assert.doesNotMatch(payload.text, /ATTENZIONE/);
  assert.equal(
    r.fetches.length,
    0,
    "ricevuta cliente disattivata per default: nessuna chiamata di rete",
  );
});

test("successo: la risposta al browser non espone id interni né dati personali", async () => {
  const r = await call(
    validBody({ auditConsent: true, websiteUrl: "esempio.it" }),
    {
      supabase: { site_audits: auditNone, lead_site_audits: linkOk },
    },
  );
  assert.equal(r.status, 200);
  assert.ok(!r.text.includes(LEAD_ID), "leadId mai al browser");
  assert.ok(!r.text.includes(AUDIT_ID), "auditId mai al browser");
  assert.ok(
    !r.text.includes("mario.rossi@example.test"),
    "email mai nella risposta",
  );
  for (const value of Object.values(r.data))
    assert.equal(typeof value, "boolean");
});

test("successo: profilo, summary e source arbitrari dal client vengono ignorati", async () => {
  const r = await call(
    validBody({
      source: "admin_import",
      summary: { service: "Servizio inventato", level: "Premium" },
      profile: { tier: "vip" },
    }),
  );
  assert.equal(r.status, 200);
  const notes = writes(r)[0].values.notes;
  assert.match(notes, /Origine: mini_analisi/);
  assert.doesNotMatch(notes, /Servizio inventato|Premium|admin_import/);
  assert.notEqual(writes(r)[0].values.service_interest, "Servizio inventato");
});

test("successo: origine assistente_ai ammessa solo da whitelist", async () => {
  const r = await call(
    validBody({
      source: "assistente_ai",
      initialIntent: "intento-inesistente",
    }),
  );
  assert.equal(r.status, 200);
  assert.match(writes(r)[0].values.notes, /Origine: assistente_ai/);
  assert.match(writes(r)[0].values.notes, /Percorso scelto: —/);
  assert.match(
    r.emails[0].payload.subject,
    /^Nuova richiesta assistente AI — /,
  );
});

// --- 2. Validazione e input malformati -----------------------------------------

const REJECTIONS = [
  ["JSON non valido", "{non json", 400, "INVALID_JSON"],
  [
    "payload oltre il limite",
    JSON.stringify(validBody({ message: "x".repeat(25_000) })),
    413,
    "PAYLOAD_TOO_LARGE",
  ],
  [
    "nome mancante",
    validBody({ contactName: "   " }),
    400,
    "MISSING_CONTACT_NAME",
  ],
  [
    "nome non stringa",
    validBody({ contactName: { a: 1 } }),
    400,
    "MISSING_CONTACT_NAME",
  ],
  ["email non valida", validBody({ email: "mario@" }), 400, "INVALID_EMAIL"],
  [
    "email con spazi interni",
    validBody({ email: "mario rossi@example.test" }),
    400,
    "INVALID_EMAIL",
  ],
  ["email non stringa", validBody({ email: ["a@b.it"] }), 400, "INVALID_EMAIL"],
  [
    "email oltre 254 caratteri",
    validBody({ email: `${"a".repeat(250)}@example.test` }),
    400,
    "INVALID_EMAIL",
  ],
  [
    "privacy assente",
    validBody({ privacyConsent: undefined }),
    400,
    "PRIVACY_REQUIRED",
  ],
  [
    'privacy come stringa "true"',
    validBody({ privacyConsent: "true" }),
    400,
    "PRIVACY_REQUIRED",
  ],
  ["privacy come 1", validBody({ privacyConsent: 1 }), 400, "PRIVACY_REQUIRED"],
  [
    "audit con URL mancante",
    validBody({ auditConsent: true }),
    400,
    "INVALID_URL",
  ],
  [
    "audit su localhost",
    validBody({ auditConsent: true, websiteUrl: "http://localhost:3000" }),
    400,
    "INVALID_URL",
  ],
  [
    "audit su IP privato",
    validBody({ auditConsent: true, websiteUrl: "http://192.168.1.10" }),
    400,
    "INVALID_URL",
  ],
  [
    "audit con schema non http",
    validBody({ auditConsent: true, websiteUrl: "javascript:alert(1)" }),
    400,
    "INVALID_URL",
  ],
  [
    "audit con dominio con spazio",
    validBody({ auditConsent: true, websiteUrl: "esempio .it" }),
    400,
    "INVALID_URL",
  ],
];

for (const [name, body, status, code] of REJECTIONS) {
  test(`validazione: ${name} → ${status} ${code}, nessuna scrittura né email`, async () => {
    const r = await call(body);
    assert.equal(r.status, status);
    assert.deepEqual(r.data, { ok: false, error: code });
    assert.equal(r.calls.length, 0, "nessuna query al CRM");
    assert.equal(r.emails.length, 0, "nessuna email");
    assert.equal(r.fetches.length, 0, "nessuna chiamata di rete");
  });
}

test('validazione: auditConsent come stringa "true" non attiva l’accodamento', async () => {
  const r = await call(
    validBody({ auditConsent: "true", websiteUrl: "esempio.it" }),
  );
  assert.equal(r.status, 200);
  assert.equal(r.data.auditQueued, false);
  assert.ok(
    !r.calls.some((c) => c.table === "site_audits"),
    "nessun accesso alla coda audit",
  );
});

test("validazione: campi lunghi troncati e answers non stringa scartate", async () => {
  const r = await call(
    validBody({
      contactName: "N".repeat(500),
      phone: "3".repeat(100),
      answers: { ...ANSWERS, urgency: { $gt: "" }, extra: 42 },
    }),
  );
  assert.equal(r.status, 200);
  const lead = writes(r)[0].values;
  assert.equal(lead.contact_name.length, 120);
  assert.equal(lead.phone.length, 40);
  assert.equal(
    lead.priority,
    "media",
    "urgency non stringa ignorata → priorità di default",
  );
});

test("honeypot compilato: finto successo senza scritture né email", async () => {
  const r = await call(validBody({ honeypot: "http://spam.example" }));
  assert.equal(r.status, 200);
  assert.deepEqual(r.data, { ok: true });
  assert.equal(r.calls.length, 0);
  assert.equal(r.emails.length, 0);
});

// --- 3. Errori del CRM e della notifica ----------------------------------------

test("CRM KO + email OK: richiesta presa in carico solo via email con oggetto [CRM KO]", async () => {
  const r = await call(validBody(), {
    supabase: {
      leads: () => ({ data: null, error: { message: "connection refused" } }),
    },
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.ok, true);
  assert.equal(r.data.leadSaved, false);
  assert.equal(r.data.emailSent, true);
  assert.equal(
    r.data.clientReportExpected,
    undefined,
    "nessuna promessa di report",
  );
  assert.equal(r.emails.length, 1);
  assert.match(r.emails[0].payload.subject, /^\[CRM KO\] /);
  assert.match(r.emails[0].payload.text, /unica copia della richiesta/);
  assert.equal(
    r.fetches.length,
    0,
    "nessuna ricevuta cliente senza lead salvato",
  );
});

test('CRM KO con consenso audit: l’email di soccorso non dichiara l’audit "non richiesto"', async () => {
  const r = await call(
    validBody({ auditConsent: true, websiteUrl: "esempio.it" }),
    {
      supabase: {
        leads: () => ({ data: null, error: { message: "timeout" } }),
      },
    },
  );
  assert.equal(r.status, 200);
  assert.equal(r.data.auditQueued, false);
  assert.ok(
    !r.calls.some((c) => c.table === "site_audits"),
    "nessun audit senza lead salvato",
  );
  const text = r.emails[0].payload.text;
  assert.match(text, /Sito segnalato: https:\/\/esempio\.it\//);
  assert.match(text, /Audit del sito: non accodato/);
  assert.doesNotMatch(text, /Audit del sito: non richiesto/);
});

test("CRM KO senza id restituito: trattato come salvataggio fallito", async () => {
  const r = await call(validBody(), {
    supabase: { leads: () => ({ data: null, error: null }) },
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.leadSaved, false);
  assert.match(r.emails[0].payload.subject, /^\[CRM KO\] /);
});

test("CRM KO + email KO: errore 500 esplicito, mai un falso successo", async () => {
  const r = await call(validBody(), {
    supabase: {
      leads: () => ({ data: null, error: { message: "connection refused" } }),
    },
    resend: () => ({
      data: null,
      error: { name: "validation_error", message: "invalid from" },
    }),
  });
  assert.equal(r.status, 500);
  assert.deepEqual(r.data, { ok: false, error: "SAVE_ERROR" });
});

test("CRM KO + configurazione email mancante: errore 500 esplicito", async () => {
  const r = await call(validBody(), {
    env: {},
    supabase: { leads: () => ({ data: null, error: { message: "down" } }) },
  });
  assert.equal(r.status, 500);
  assert.equal(r.data.error, "SAVE_ERROR");
  assert.equal(r.emails.length, 0);
});

test("CRM OK + Resend in errore: lead salvato, emailSent false, risposta ok", async () => {
  const r = await call(validBody(), {
    resend: () => ({
      data: null,
      error: {
        name: "rate_limit",
        message: "limit for mario.rossi@example.test",
      },
    }),
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.leadSaved, true);
  assert.equal(r.data.emailSent, false);
  assert.ok(
    !r.logs.includes("mario.rossi@example.test"),
    "email mascherata nei log",
  );
});

test("CRM OK + Resend che lancia eccezione: lead salvato, risposta ok", async () => {
  const r = await call(validBody(), {
    resend: () => {
      throw new Error("socket hang up");
    },
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.leadSaved, true);
  assert.equal(r.data.emailSent, false);
});

test("CRM OK + configurazione email mancante: nessun invio, log senza valori", async () => {
  const r = await call(validBody(), { env: {} });
  assert.equal(r.status, 200);
  assert.equal(r.data.emailSent, false);
  assert.equal(r.emails.length, 0);
  assert.match(r.logs, /configurazione mancante/);
});

test("preview Vercel senza consenso esplicito: nessun invio email", async () => {
  const r = await call(validBody(), {
    env: { ...BASE_ENV, VERCEL_ENV: "preview" },
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.leadSaved, true);
  assert.equal(r.data.emailSent, false);
  assert.equal(r.emails.length, 0);
});

// --- 4. Log senza PII -----------------------------------------------------------

test("log: errore di insert del CRM con email nel messaggio viene mascherato", async () => {
  const r = await call(validBody(), {
    supabase: {
      leads: () => ({
        data: null,
        error: { message: "invalid input for mario.rossi@example.test" },
      }),
    },
  });
  assert.equal(r.status, 200);
  assert.match(r.logs, /supabase insert error/);
  assert.ok(
    !r.logs.includes("mario.rossi@example.test"),
    "nessuna email in chiaro nei log",
  );
});

test("log: eccezione inattesa → 500 SERVER_ERROR senza PII nei log", async () => {
  const r = await call(validBody(), {
    supabase: {
      leads: () => {
        throw new Error("fetch failed for mario.rossi@example.test");
      },
    },
  });
  assert.equal(r.status, 500);
  assert.deepEqual(r.data, { ok: false, error: "SERVER_ERROR" });
  assert.ok(
    !r.logs.includes("mario.rossi@example.test"),
    "nessuna email in chiaro nei log",
  );
});

// --- 5. Coda audit: accodato, duplicato, errori ---------------------------------

test("audit: consenso + URL valido → accodato e collegato al lead", async () => {
  const r = await call(
    validBody({ auditConsent: true, websiteUrl: "Esempio.it" }),
    {
      supabase: { site_audits: auditNone, lead_site_audits: linkOk },
    },
  );
  assert.equal(r.status, 200);
  assert.equal(r.data.auditQueued, true);
  assert.equal(r.data.auditDuplicate, false);
  assert.equal(r.data.auditLinked, true);

  const auditInsert = writes(r).find((c) => c.table === "site_audits");
  assert.deepEqual(auditInsert.values, {
    url: "https://esempio.it/",
    name: "Mario Rossi",
    email: "mario.rossi@example.test",
  });
  const link = writes(r).find((c) => c.table === "lead_site_audits");
  assert.deepEqual(link.values, { lead_id: LEAD_ID, audit_id: AUDIT_ID });
  assert.match(writes(r)[0].values.notes, /Consenso all’analisi tecnica: sì/);
  assert.match(r.emails[0].payload.text, /Audit del sito: accodato/);
  assert.match(r.emails[0].payload.text, /Collegamento CRM: collegato/);
});

test("audit duplicato (stesso URL in coda): nessun nuovo audit, lead collegato a quello esistente", async () => {
  const r = await call(
    validBody({ auditConsent: true, websiteUrl: "esempio.it" }),
    {
      supabase: {
        site_audits: (q) =>
          q.op === "select"
            ? { data: [{ id: AUDIT_ID }], error: null }
            : assert.fail("insert inatteso"),
        lead_site_audits: linkOk,
      },
    },
  );
  assert.equal(r.status, 200);
  assert.equal(r.data.auditQueued, false);
  assert.equal(r.data.auditDuplicate, true);
  assert.equal(r.data.auditLinked, true);
  const dedupe = r.calls.find((c) => c.table === "site_audits");
  assert.deepEqual(dedupe.filters.slice(0, 2), [
    ["eq", "url", "https://esempio.it/"],
    ["in", "status", ["queued", "running"]],
  ]);
  assert.match(r.emails[0].payload.text, /già presente in coda/);
});

test("audit: collegamento già esistente (23505) → auditLinkDuplicate", async () => {
  const r = await call(
    validBody({ auditConsent: true, websiteUrl: "esempio.it" }),
    {
      supabase: {
        site_audits: auditNone,
        lead_site_audits: () => ({
          error: { code: "23505", message: "duplicate key" },
        }),
      },
    },
  );
  assert.equal(r.status, 200);
  assert.equal(r.data.auditLinked, false);
  assert.equal(r.data.auditLinkDuplicate, true);
});

test("audit: errore nel controllo duplicati → non accodato, lead comunque salvato", async () => {
  const r = await call(
    validBody({ auditConsent: true, websiteUrl: "esempio.it" }),
    {
      supabase: {
        site_audits: (q) =>
          q.op === "select"
            ? { data: null, error: { message: "boom" } }
            : assert.fail("accodamento alla cieca"),
      },
    },
  );
  assert.equal(r.status, 200);
  assert.equal(r.data.leadSaved, true);
  assert.equal(r.data.auditQueued, false);
  assert.equal(r.data.auditLinked, false);
  assert.match(r.emails[0].payload.text, /Audit del sito: non accodato/);
  assert.match(r.emails[0].payload.text, /Collegamento CRM: non applicabile/);
});

test("audit: errore di collegamento → lead e audit salvati, risposta ok", async () => {
  const r = await call(
    validBody({ auditConsent: true, websiteUrl: "esempio.it" }),
    {
      supabase: {
        site_audits: auditNone,
        lead_site_audits: () => ({
          error: { code: "42501", message: "permission denied" },
        }),
      },
    },
  );
  assert.equal(r.status, 200);
  assert.equal(r.data.auditQueued, true);
  assert.equal(r.data.auditLinked, false);
  assert.equal(r.data.clientReportExpected, false);
  assert.match(r.emails[0].payload.text, /Collegamento CRM: non collegato/);
});

// --- 6. Ricevuta cliente (disattivata per default) ------------------------------

const RECEIPT_ENV = {
  ...BASE_ENV,
  MINI_ANALISI_CLIENT_RECEIPT_ENABLED: "true",
  MINI_ANALISI_CLIENT_RECEIPT_ALLOWED_TO:
    "altro@example.test, MARIO.ROSSI@example.test",
  MINI_ANALISI_CLIENT_RECEIPT_RESEND_KEY: "re_receipt_fake",
  MINI_ANALISI_CLIENT_RECEIPT_FROM: "noreply@example.test",
};

test("ricevuta: destinatario non in allowlist → nessuna chiamata di rete", async () => {
  const r = await call(validBody({ email: "sconosciuto@example.test" }), {
    env: RECEIPT_ENV,
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.clientReceiptSent, false);
  assert.equal(r.fetches.length, 0);
});

test("ricevuta: in allowlist → una chiamata idempotente, senza promessa di report", async () => {
  const r = await call(validBody(), {
    env: RECEIPT_ENV,
    fetchImpl: async () => ({ ok: true, status: 200 }),
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.clientReceiptSent, true);
  assert.equal(r.data.clientReportExpected, false);
  assert.equal(r.fetches.length, 1);
  const { url, init } = r.fetches[0];
  assert.equal(url, "https://api.resend.com/emails");
  assert.equal(
    init.headers["Idempotency-Key"],
    `ls-mini-analisi-ack-${LEAD_ID}`,
  );
  const sent = JSON.parse(init.body);
  assert.deepEqual(sent.to, ["mario.rossi@example.test"]);
  assert.match(sent.text, /ti ricontatteremo/);
  assert.doesNotMatch(sent.text, /riceverai il documento/);
});

test("ricevuta: errore HTTP del provider → clientReceiptSent false, risposta ok", async () => {
  const r = await call(validBody(), {
    env: RECEIPT_ENV,
    fetchImpl: async () => ({ ok: false, status: 503 }),
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.leadSaved, true);
  assert.equal(r.data.clientReceiptSent, false);
});

test("report promesso solo con pipeline attiva e audit collegato", async () => {
  const env = { ...RECEIPT_ENV, MINI_ANALISI_CLIENT_REPORTS_ACTIVE: "true" };
  const supabase = { site_audits: auditNone, lead_site_audits: linkOk };
  const r = await call(
    validBody({ auditConsent: true, websiteUrl: "esempio.it" }),
    {
      env,
      supabase,
      fetchImpl: async () => ({ ok: true, status: 200 }),
    },
  );
  assert.equal(r.data.clientReportExpected, true);
  assert.match(
    JSON.parse(r.fetches[0].init.body).text,
    /riceverai il documento/,
  );

  const noLink = await call(
    validBody({ auditConsent: true, websiteUrl: "esempio.it" }),
    {
      env,
      supabase: {
        ...supabase,
        lead_site_audits: () => ({
          error: { code: "42501", message: "denied" },
        }),
      },
      fetchImpl: async () => ({ ok: true, status: 200 }),
    },
  );
  assert.equal(noLink.data.clientReportExpected, false);
  assert.doesNotMatch(
    JSON.parse(noLink.fetches[0].init.body).text,
    /riceverai il documento/,
  );
});
