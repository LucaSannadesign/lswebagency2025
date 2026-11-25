/**
 * Ambiente di deploy.
 *
 * Vercel espone VERCEL_ENV = "production" | "preview" | "development" sia in
 * build sia a runtime. Lettura a runtime (process.env) con fallback al valore
 * inlinato in build (import.meta.env), così il risultato è corretto anche per
 * eventuali pagine prerenderizzate.
 *
 * PREVIEW_SANDBOX=1 forza la modalità anteprima in locale, solo per verificare
 * il comportamento (`PREVIEW_SANDBOX=1 npm run dev`). In produzione non è mai
 * impostata.
 */
export function isPreviewDeployment(): boolean {
  const runtimeEnv = typeof process !== 'undefined' ? process.env ?? {} : {};
  const vercelEnv = runtimeEnv.VERCEL_ENV ?? import.meta.env.VERCEL_ENV;
  const sandbox = runtimeEnv.PREVIEW_SANDBOX ?? import.meta.env.PREVIEW_SANDBOX;
  return vercelEnv === 'preview' || sandbox === '1';
}
