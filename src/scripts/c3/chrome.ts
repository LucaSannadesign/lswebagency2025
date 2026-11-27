/**
 * Navbar C.3.2 su tutte le pagine.
 *
 * - Stati: trasparente in cima → capsula (.is-solid) dopo lo scroll; si
 *   nasconde scendendo (.is-hidden) e riappare salendo. Mai nascosta con il
 *   focus da tastiera dentro, con il pannello Servizi o il menu aperti.
 * - Pannello Servizi: disclosure accessibile; con puntatore preciso si apre
 *   al passaggio del mouse con un breve ritardo (hover intent).
 * - Menu mobile: overlay a tutto schermo, Servizi a fisarmonica, Escape,
 *   focus intrappolato finché è aperto, blocco dello scroll della pagina.
 * Init su `astro:page-load`, teardown su `astro:before-swap` (ClientRouter).
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function init(header: HTMLElement): () => void {
  const ac = new AbortController();
  const sig = { signal: ac.signal };
  const passive = { signal: ac.signal, passive: true };
  const cleanups: Array<() => void> = [];
  const isHome = header.classList.contains("c3-top--home");

  const ddBtn = header.querySelector<HTMLButtonElement>("[data-c3-dd-btn]");
  const mega = header.querySelector<HTMLElement>("[data-c3-mega]");
  const ddItem = ddBtn?.closest<HTMLElement>("[data-c3-dd]") ?? null;
  const menuBtn = header.querySelector<HTMLButtonElement>("[data-c3-menu]");
  const menuLabel = header.querySelector<HTMLElement>("[data-c3-menu-label]");
  const overlay = document.querySelector<HTMLElement>("[data-c3-overlay]");

  const megaOpen = () => !!mega?.classList.contains("is-open");
  const menuOpen = () => !!overlay?.classList.contains("is-open");

  // ── Stati della navbar ───────────────────────────────────────────────────
  // --np: geometria 0→1 sui primi 140px di scroll (larghezza, altezza, logo).
  // --nps: superficie grafite. Sopra fondi scuri cresce con lo scroll; sopra
  // fondi chiari passa 0→1 alla soglia, con una transizione CSS breve, così
  // il testo non attraversa mai un grigio medio con contrasto insufficiente.
  const RANGE = 140;
  const SOLID_AT = 0.45;
  const homeRoot = isHome ? document.getElementById("c3-root") : null;
  const darkIslands = homeRoot
    ? [...homeRoot.querySelectorAll<HTMLElement>(".c3-hero, .c3-marquee")]
    : [];
  const portfolio = homeRoot?.querySelector<HTMLElement>(".c3-pf");
  const skills = homeRoot?.querySelector<HTMLElement>(".c3-skills");
  const covers = (el: HTMLElement, y: number) => {
    const r = el.getBoundingClientRect();
    return r.top <= y && r.bottom > y;
  };
  const lightContext = () => {
    const html = document.documentElement;
    if (!homeRoot) {
      return html.dataset.lsTheme === "light" ||
        (!html.classList.contains("dark") && !!header.closest('.c3[data-tone="light"]'));
    }
    const y = 44;
    const mode = html.dataset.lsHomeTheme || "editorial";
    if (mode === "dark" || darkIslands.some(el => covers(el, y))) return false;
    if (mode === "light") return true;
    if (portfolio && covers(portfolio, y)) return false;
    if (skills && covers(skills, y)) {
      // Keep white over the dark half of the YoArtly-to-ivory bridge.
      const r = skills.getBoundingClientRect();
      const bridge = parseFloat(getComputedStyle(skills, "::before").height) || 0;
      return y - r.top >= bridge * 0.7;
    }
    return homeRoot.dataset.tone === "light";
  };
  let lastY = scrollY;
  const tick = () => {
    const y = scrollY;
    const np = menuOpen() ? 1 : Math.min(1, Math.max(0, y / RANGE));
    const solid = np >= SOLID_AT;
    header.style.setProperty("--np", np.toFixed(3));
    header.style.setProperty(
      "--nps",
      (lightContext() || !isHome ? (solid ? 1 : 0) : np).toFixed(3),
    );
    header.classList.toggle("is-solid", solid);
    header.classList.toggle("is-light-surface", lightContext() && !menuOpen());
    const delta = y - lastY;
    if (Math.abs(delta) < 8) return;
    const locked =
      header.contains(document.activeElement) || megaOpen() || menuOpen();
    header.classList.toggle("is-hidden", delta > 0 && y > 260 && !locked);
    lastY = y;
  };
  let ticking = false;
  addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        tick();
      });
    },
    passive,
  );
  header.addEventListener(
    "focusin",
    () => header.classList.remove("is-hidden"),
    sig,
  );
  tick();
  // Theme toggles and chapter changes can occur without a scroll.
  const toneObserver = new MutationObserver(tick);
  toneObserver.observe(document.documentElement, {
    attributes: true, attributeFilter: ["data-ls-theme", "data-ls-home-theme"],
  });
  if (homeRoot) toneObserver.observe(homeRoot, {
    attributes: true, attributeFilter: ["data-tone"],
  });
  addEventListener("resize", tick, passive);
  cleanups.push(() => toneObserver.disconnect());

  // ── Pannello Servizi ─────────────────────────────────────────────────────
  let openTimer = 0;
  let closeTimer = 0;
  const setMega = (open: boolean) => {
    if (!mega || !ddBtn) return;
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    mega.classList.toggle("is-open", open);
    ddBtn.setAttribute("aria-expanded", String(open));
    if (open) header.classList.remove("is-hidden");
  };
  if (ddBtn && mega) {
    ddBtn.addEventListener("click", () => setMega(!megaOpen()), sig);
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const enter = () => {
      if (!fine.matches) return;
      clearTimeout(closeTimer);
      if (!megaOpen()) openTimer = window.setTimeout(() => setMega(true), 90);
    };
    const leave = () => {
      if (!fine.matches) return;
      clearTimeout(openTimer);
      closeTimer = window.setTimeout(() => setMega(false), 240);
    };
    [ddItem, mega].forEach((el) => {
      el?.addEventListener("pointerenter", enter, sig);
      el?.addEventListener("pointerleave", leave, sig);
    });
    // Il focus che esce da trigger e pannello chiude il pannello
    const onFocusOut = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (!next || !(ddItem?.contains(next) || mega.contains(next)))
        setMega(false);
    };
    ddItem?.addEventListener("focusout", onFocusOut, sig);
    mega.addEventListener("focusout", onFocusOut, sig);
    document.addEventListener(
      "click",
      (e) => {
        const t = e.target as Node;
        if (megaOpen() && !ddItem?.contains(t) && !mega.contains(t))
          setMega(false);
      },
      sig,
    );
    // Da tastiera: freccia giù sul trigger apre e porta il focus nel pannello
    ddBtn.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "ArrowDown") return;
        e.preventDefault();
        setMega(true);
        mega.querySelector<HTMLElement>("a")?.focus();
      },
      sig,
    );
  }

  // ── Menu mobile ──────────────────────────────────────────────────────────
  const setMenu = (open: boolean, restoreFocus = false) => {
    if (!overlay || !menuBtn) return;
    overlay.classList.toggle("is-open", open);
    header.classList.toggle("is-menu", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    if (menuLabel) menuLabel.textContent = open ? "Chiudi" : "Menu";
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) {
      header.classList.remove("is-hidden");
      header.classList.add("is-solid");
      header.classList.remove("is-light-surface");
      requestAnimationFrame(() =>
        overlay.querySelector<HTMLElement>(FOCUSABLE)?.focus(),
      );
    } else {
      tick();
      if (restoreFocus) menuBtn.focus();
    }
  };
  menuBtn?.addEventListener("click", () => setMenu(!menuOpen()), sig);
  overlay?.addEventListener(
    "click",
    (e) => {
      if ((e.target as Element).closest("a")) setMenu(false);
    },
    sig,
  );
  overlay
    ?.querySelectorAll<HTMLButtonElement>("[data-c3-acc]")
    .forEach((btn) => {
      btn.addEventListener(
        "click",
        () => {
          const open = btn.getAttribute("aria-expanded") !== "true";
          btn.setAttribute("aria-expanded", String(open));
          document
            .getElementById(btn.getAttribute("aria-controls") || "")
            ?.toggleAttribute("hidden", !open);
        },
        sig,
      );
    });

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") {
        if (menuOpen()) setMenu(false, true);
        if (megaOpen()) {
          setMega(false);
          ddBtn?.focus();
        }
        return;
      }
      // Focus intrappolato tra pulsante Menu e overlay
      if (e.key === "Tab" && menuOpen() && overlay && menuBtn) {
        const items = [
          menuBtn,
          ...overlay.querySelectorAll<HTMLElement>(FOCUSABLE),
        ].filter((el) => el.offsetParent !== null || el === menuBtn);
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    sig,
  );

  const desktop = matchMedia("(min-width: 1024px)");
  const onDesktop = () => {
    if (desktop.matches) setMenu(false);
    else setMega(false);
  };
  desktop.addEventListener("change", onDesktop);
  cleanups.push(() => {
    desktop.removeEventListener("change", onDesktop);
    document.documentElement.style.overflow = "";
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
  });

  return () => {
    ac.abort();
    cleanups.forEach((fn) => fn());
  };
}

let teardown: (() => void) | null = null;
document.addEventListener("astro:page-load", () => {
  teardown?.();
  const header = document.querySelector<HTMLElement>("[data-c3-header]");
  teardown = header ? init(header) : null;
});
document.addEventListener("astro:before-swap", () => {
  teardown?.();
  teardown = null;
});
