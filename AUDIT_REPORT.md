# Audit Chirurgico - LS Web Agency (Astro)
**Data:** 2025-01-13  
**Branch:** feat/hero-brand-refresh  
**Analista:** Senior Engineer + SEO/IA

---

## FASE A — SLUG / URL CHANGE DETECTION

### Stato Git
- **Ultimo commit:** `c16c8b66` - fix(home): prevent thumbnail distortion
- **File modificati nel commit:** solo `src/components/blog/GridItem.astro` (nessun cambio route)
- **File modificati non committati:** 10 file (nessun rename/move)

### Route Attuali (src/pages/servizi/*.astro)

| Route | File | Nuova/Oggi? | Rischio 404? | Note |
|-------|------|-------------|--------------|------|
| `/servizi/accessibilita-digitale-avanzata` | ✅ | No | ❌ | Linkata in griglia |
| `/servizi/ai-blog-engine` | ✅ | No | ❌ | Linkata in griglia |
| `/servizi/assistente-ai-sito-whatsapp` | ✅ | No | ❌ | Linkata in griglia |
| `/servizi/assistenza-manutenzione` | ✅ | No | ❌ | Linkata in griglia + home |
| `/servizi/audit-rapido` | ✅ | No | ❌ | Linkata in griglia + area SEO |
| `/servizi/branding-e-grafica-siti-web` | ✅ | No | ❌ | Linkata in griglia |
| `/servizi/creazione-siti-web-sassari` | ✅ | No | ❌ | Linkata in griglia + area Siti Web |
| `/servizi/fix-performance-seo` | ✅ | No | ❌ | Linkata in griglia + area SEO |
| `/servizi/landing-page-professionale` | ✅ | No | ❌ | Linkata in griglia + area Siti Web |
| `/servizi/local-seo-booster` | ✅ | No | ❌ | Linkata in griglia + area SEO |
| `/servizi/ottimizzazione-seo-siti-web` | ✅ | No | ❌ | Linkata in griglia + area SEO |
| `/servizi/personalizzazione-ux-intelligenza-artificiale` | ✅ | No | ❌ | Linkata in griglia + area AI |
| `/servizi/realizzazione-siti-ecommerce` | ✅ | No | ❌ | Linkata in griglia + area Siti Web |
| `/servizi/seo-locale` | ✅ | No | ❌ | Linkata in griglia + area SEO |
| `/servizi/siti-web` | ✅ | No | ❌ | Linkata in griglia + area Siti Web |
| `/servizi/sprint-ottimizzazione` | ✅ | **SÌ (untracked)** | ⚠️ | **ORFANA** - Non linkata (solo badge "in arrivo") |
| `/servizi/voucher-digitali-sardegna-2025` | ✅ | No | ❌ | Redirect 301 → `/servizi` |
| `/servizi/voucher-digitali-sassari` | ✅ | No | ❌ | Redirect 301 → `/servizi` |
| `/servizi/web-design-etico-sostenibile` | ✅ | No | ❌ | Linkata in griglia |
| `/servizi/wordpress-slim-siti-statici-headless` | ✅ | No | ❌ | Linkata in griglia + area Siti Web |

### Verifica Link Interni
- ✅ Tutti i link `/servizi/*` verificati puntano a file esistenti
- ✅ Nessun link a slug rimossi
- ⚠️ **1 pagina orfana:** `sprint-ottimizzazione.astro` (esiste ma non linkata)

---

## FASE B — LINK INTEGRITY (pagine scollegate/orfane)

### Punti di Accesso Verificati
1. ✅ **Header/Nav:** Dropdown "Servizi" con 3 aree + "Tutti i servizi"
2. ✅ **Pagina /servizi:** Sezioni area (#siti-web, #seo, #ai) + griglia completa (#tutti-servizi)
3. ✅ **Home:** Link a siti-web, seo-locale, assistenza-manutenzione
4. ✅ **Footer:** Link generico a /servizi

### Pagine Orfane Identificate

| Pagina | Route | Stato | Suggerimento |
|--------|-------|-------|--------------|
| `sprint-ottimizzazione.astro` | `/servizi/sprint-ottimizzazione` | ⚠️ **ORFANA** | Aggiungere link in griglia "Tutti i servizi" (area SEO o nuova sezione "Pacchetti") |

### Anchor Verificati su /servizi

| Anchor | Esiste? | Linkato da Nav? | Status |
|--------|---------|-----------------|--------|
| `#siti-web` | ✅ | ✅ | OK |
| `#seo` | ✅ | ✅ | OK |
| `#ai` | ✅ | ✅ | OK |
| `#tutti-servizi` | ✅ | ✅ | OK |
| `#siti-conversione` | ❌ | ❌ | **RIMOSSO** (era legacy, ora sostituito da #siti-web) |

**Nota:** Il vecchio anchor `#siti-conversione` non esiste più (corretto, sostituito da `#siti-web`).

---

## FASE C — COERENZA UX (fruibilità nav)

### 1. Link "Tutti i servizi" - Logica Route-Aware
- ✅ **Implementato correttamente** in `Header.astro`
- ✅ Se su `/servizi`: usa `#tutti-servizi` (scroll)
- ✅ Da altre pagine: usa `/servizi#tutti-servizi` (navigazione + scroll)

### 2. Build Locale
```bash
npm run build
```
- ✅ **Build completata con successo**
- ⚠️ **1 warning:** `getStaticPaths()` ignorato in `/portfolio/page/[page].astro` (non critico, pagina dinamica)

### 3. Scansione Link Interni
- ✅ Tutti i link `/servizi/*` verificati esistono
- ✅ Tutti gli anchor `#*` verificati esistono nella pagina target
- ❌ **1 link mancante:** `sprint-ottimizzazione` non linkata (ma pagina esiste)

---

## FASE D — COERENZA TONE/BRANDING (copy audit)

### Pattern Trovati

#### 1. Uso "noi" vs "io"
- ✅ **Pagine chiave aggiornate:** audit-rapido, fix-performance-seo, seo-locale → usano "io" o "Luca"
- ⚠️ **Pagine da aggiornare:**
  - `realizzazione-siti-ecommerce.astro`: "Parla con noi" (2x)
  - `web-design-etico-sostenibile.astro`: "Parla con noi"
  - `ai-blog-engine.astro`: "Parla con noi"
  - `chi-siamo.astro`: "Parla con noi"
  - `contatti.astro`: "Parla con noi"

#### 2. Promesse Garantite / Hype
- ✅ **Buone pratiche trovate:**
  - `sprint-ottimizzazione.astro`: "Promesse garantite: miglioramenti basati su best practice, ma non posso garantire risultati specifici"
  - `seo-locale.astro`: "Promesse garantite su posizionamenti" (in "Cosa non include")
- ⚠️ **Da rivedere:**
  - `realizzazione-siti-ecommerce.astro`: "Garantiamo standard tecnici, UX e performance" (linea 345) → troppo forte
  - `siti-web.astro`: "garantisce performance" (linea 173) → ok, ma preferire "assicura"

#### 3. CTA Incoerenti
- ✅ **Coerenti:** "Parla con Luca" in pagine modificate recentemente
- ⚠️ **Incoerenti:**
  - `realizzazione-siti-ecommerce.astro`: "Parla con noi" (2x)
  - `web-design-etico-sostenibile.astro`: "Parla con noi"
  - `ai-blog-engine.astro`: "Parla con noi"
  - `chi-siamo.astro`: "Parla con noi"

#### 4. Naming Duplicato/Confuso
- ✅ **Chiaro:** "SEO Locale" (hub) vs "Local SEO Booster" (pacchetto) - differenziati correttamente
- ✅ Badge contestuale in `local-seo-booster.astro` spiega la relazione

### Micro-Fix Suggeriti (Top 10)

1. **realizzazione-siti-ecommerce.astro:185**  
   `"Parla con noi"` → `"Parla con Luca"`

2. **realizzazione-siti-ecommerce.astro:231**  
   `"Parla con noi"` → `"Parla con Luca"`

3. **realizzazione-siti-ecommerce.astro:345**  
   `"Garantiamo standard tecnici"` → `"Assicuriamo standard tecnici"`

4. **web-design-etico-sostenibile.astro:137**  
   `"Parla con noi"` → `"Parla con Luca"`

5. **ai-blog-engine.astro:146**  
   `"Parla con noi"` → `"Parla con Luca"`

6. **chi-siamo.astro:49**  
   `"Parla con noi"` → `"Parla con Luca"`

7. **contatti.astro:62**  
   `"Parla con noi"` → `"Scrivimi"` o `"Parla con Luca"`

8. **siti-web.astro:173**  
   `"garantisce performance"` → `"assicura performance"`

9. **sprint-ottimizzazione.astro**  
   Aggiungere link in griglia "Tutti i servizi" (area SEO o nuova card)

10. **realizzazione-siti-ecommerce.astro:192,238**  
    `"Pagamento sicuro con PayPal"` → `"Pagamento con PayPal"` (rimuovere "sicuro" = hype)

---

## REPORT FINALE

### Riassunto (10 righe)

1. **Slug cambiati oggi?** ❌ NO - Nessun file rinominato/spostato. Solo nuova pagina `sprint-ottimizzazione.astro` (untracked).

2. **404 a rischio?** ⚠️ PARZIALE - La pagina `sprint-ottimizzazione` esiste ma non è linkata (orfana). Non genera 404 diretti, ma non è raggiungibile dalla navigazione.

3. **Pagine orfane?** ✅ 1: `sprint-ottimizzazione.astro` - Esiste ma non linkata in /servizi (solo badge "in arrivo" senza link).

4. **Anchor/menu ok?** ✅ SÌ - Tutti gli anchor (#siti-web, #seo, #ai, #tutti-servizi) esistono. Link "Tutti i servizi" implementato correttamente con logica route-aware.

5. **Coerenza tono ok?** ⚠️ PARZIALE - 3 problemi principali:
   - 5 pagine usano ancora "Parla con noi" invece di "Parla con Luca"
   - 1 promessa troppo forte: "Garantiamo" in ecommerce
   - 1 hype word: "sicuro" in pagamento PayPal

### Piano Fix (3 commit max)

#### Commit 1: Fix link/anchor/nav
**File:** `src/pages/servizi.astro`  
**Azione:** Aggiungere `sprint-ottimizzazione` nella griglia "Tutti i servizi"  
**Diff suggerito:**
```diff
+ { title: 'Sprint di Ottimizzazione', description: 'Audit + fix + misurazione in un percorso breve.', icon: 'tabler:rocket', href: '/servizi/sprint-ottimizzazione' },
```
**Commit message:** `fix(servizi): add sprint-ottimizzazione to catalog grid`

#### Commit 2: Fix pagine orfane (/servizi)
**File:** `src/pages/servizi.astro` (stesso file del commit 1)  
**Azione:** Rimuovere badge "in arrivo" da card Sprint e renderla linkabile  
**Diff suggerito:**
```diff
- <article class="rounded-2xl p-6 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/80 dark:bg-neutral-900/50 shadow-sm opacity-75">
-   <div class="flex items-center gap-2 mb-2">
-     <h3 class="font-semibold text-lg">Sprint di Ottimizzazione</h3>
-     <span class="text-xs font-semibold px-2 py-1 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">in arrivo</span>
-   </div>
+ <article class="rounded-2xl p-6 ring-1 ring-neutral-200 dark:ring-neutral-800 bg-white/80 dark:bg-neutral-900/50 shadow-sm hover:shadow-md transition">
+   <h3 class="font-semibold text-lg mb-2">Sprint di Ottimizzazione</h3>
+   <p class="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
+     Audit + fix + misurazione in un percorso breve. È il metodo 'ombrello' che mette ordine.
+   </p>
+   <a href="/servizi/sprint-ottimizzazione" class="inline-flex items-center text-sm font-semibold text-indigo-700 hover:text-indigo-800 dark:text-indigo-300">
+     Scopri di più →
+   </a>
+ </article>
```
**Commit message:** `fix(servizi): enable sprint-ottimizzazione link in packages section`

#### Commit 3: Micro-fix copy (io/noi + CTA)
**File:** 
- `src/pages/servizi/realizzazione-siti-ecommerce.astro` (3 fix)
- `src/pages/servizi/web-design-etico-sostenibile.astro` (1 fix)
- `src/pages/servizi/ai-blog-engine.astro` (1 fix)
- `src/pages/chi-siamo.astro` (1 fix)
- `src/pages/contatti.astro` (1 fix)

**Azione:** Sostituire "Parla con noi" → "Parla con Luca" e "Garantiamo" → "Assicuriamo"  
**Commit message:** `refactor(copy): unify CTA to "Parla con Luca" and soften guarantees`

---

## CHECKLIST FINALE

- [x] Nessuno slug esistente cambiato
- [x] Nessun 404 diretto introdotto
- [x] 1 pagina orfana identificata (sprint-ottimizzazione)
- [x] Anchor verificati e funzionanti
- [x] Menu route-aware implementato correttamente
- [x] Build senza errori critici
- [x] 7 micro-fix copy identificati
- [x] Piano fix in 3 commit proposto

**Status complessivo:** ✅ **BUONO** - Solo fix minori necessari (link orfano + uniformità CTA)
