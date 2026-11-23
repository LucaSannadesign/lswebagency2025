/**
 * Titolo cinetico della hero C.3.
 *
 * Divide le righe marcate in parole e lettere (indice --i per l'onda CSS) e,
 * con un puntatore preciso, solleva leggermente le lettere vicine al cursore.
 * Accessibilità: l'H1 riceve un aria-label con il testo originale, così i
 * lettori di schermo non leggono lettera per lettera; il testo nel DOM resta
 * identico (SEO). Solo transform: nessun layout shift.
 */
export interface TypeHandle {
  destroy(): void;
}

export function mountHeroType(
  h1: HTMLElement,
  hero: HTMLElement,
  isReduced: () => boolean,
): TypeHandle {
  const original = h1.textContent?.replace(/\s+/g, " ").trim() ?? "";
  if (original) h1.setAttribute("aria-label", original);

  const letters: HTMLElement[] = [];
  let index = 0;
  // Solo le due righe grandi: la terza resta testo normale (con la sottolineatura animata).
  h1.querySelectorAll<HTMLElement>(".c3-l1 > span, .c3-l2 > span").forEach(
    (line) => {
      const text = line.textContent ?? "";
      // Seconda riga: gradiente avorio → ione lettera per lettera (token CSS),
      // compatibile con le trasformazioni dell'onda (niente background-clip).
      const graded = line.parentElement?.classList.contains("c3-l2") ?? false;
      const total = text.replace(/\s/g, "").length;
      let k = 0;
      line.textContent = "";
      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          line.append(document.createTextNode(part));
          return;
        }
        const word = document.createElement("span");
        word.className = "c3-w";
        for (const ch of part) {
          const s = document.createElement("span");
          s.className = "c3-ch";
          s.textContent = ch;
          s.style.setProperty("--i", String(index++));
          if (graded) {
            // avorio → ione (prima metà) → ione medio (seconda metà)
            const t = k++ / Math.max(1, total - 1);
            const mix =
              t < 0.5
                ? `color-mix(in oklab, var(--c3-ion) ${Math.round(t * 200)}%, var(--c3-ivory))`
                : `color-mix(in oklab, var(--c3-ion-mid) ${Math.round((t - 0.5) * 160)}%, var(--c3-ion))`;
            s.style.setProperty("--chc", mix);
          }
          word.append(s);
          letters.push(s);
        }
        line.append(word);
      });
    },
  );

  const ac = new AbortController();
  const fine = matchMedia("(pointer: fine)").matches;
  let centers: Array<[number, number]> = [];
  let raf = 0;
  let px = -1e4;
  let py = -1e4;

  const measure = () => {
    centers = letters.map((l) => {
      const r = l.getBoundingClientRect();
      return [r.left + r.width / 2 + scrollX, r.top + r.height / 2 + scrollY];
    });
  };
  const apply = () => {
    raf = 0;
    const radius = Math.max(120, innerWidth * 0.12);
    letters.forEach((l, i) => {
      const c = centers[i];
      if (!c) return;
      const d = Math.hypot(c[0] - px, c[1] - py);
      const lift = d < radius ? Math.pow(1 - d / radius, 2) : 0;
      l.style.setProperty("--lift", lift.toFixed(3));
    });
  };
  const reset = () => {
    px = py = -1e4;
    if (!raf) raf = requestAnimationFrame(apply);
  };

  if (fine && letters.length) {
    measure();
    addEventListener("resize", measure, { signal: ac.signal, passive: true });
    document.fonts?.ready.then(measure);
    hero.addEventListener(
      "pointermove",
      (e) => {
        if (isReduced()) return;
        px = e.clientX + scrollX;
        py = e.clientY + scrollY;
        if (!raf) raf = requestAnimationFrame(apply);
      },
      { signal: ac.signal, passive: true },
    );
    hero.addEventListener("pointerenter", measure, {
      signal: ac.signal,
      passive: true,
    });
    hero.addEventListener("pointerleave", reset, { signal: ac.signal });
  }

  return {
    destroy() {
      ac.abort();
      if (raf) cancelAnimationFrame(raf);
    },
  };
}
