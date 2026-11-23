/**
 * Controller della hero C.3: collega il motore Vortex Field alla pagina.
 *
 * Strategia (progressive enhancement):
 * 1. L'immagine statica (still) è sempre nel markup: è l'LCP e il fallback.
 * 2. Il campo WebGL parte solo dopo il load, in idle, se: WebGL2 + float target
 *    disponibili, movimento non ridotto, nessun Data Saver, dispositivo non
 *    troppo debole. Altrimenti resta lo still.
 * 3. Gira solo con la hero visibile e la scheda in primo piano.
 * 4. Qualità adattiva: se il frame rate è basso riduce la risoluzione; se resta
 *    insufficiente si ferma e torna allo still.
 * 5. Perdita del contesto WebGL → still.
 *
 * Lo stato è esposto in hero.dataset.glState:
 *   still · live · paused · reduced · fallback
 *
 * Regolazione in anteprima (nessuna UI): ?fx-int=0.2–1.4 · ?fx-speed=0.2–2.5 · ?nogl
 */
import { createVortexField, type VortexField, type VortexParams } from './vortex-field';

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

const PALETTE: VortexParams['pal'] = {
  bg: [13 / 255, 15 / 255, 17 / 255],
  c: [
    [143 / 255, 211 / 255, 200 / 255],
    [62 / 255, 124 / 255, 140 / 255],
    [237 / 255, 236 / 255, 232 / 255],
  ],
};

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export interface HeroHandle {
  /** Da chiamare quando cambia la preferenza di movimento */
  sync(): void;
  destroy(): void;
}

export function mountHero(hero: HTMLElement, isReduced: () => boolean): HeroHandle {
  const canvas = hero.querySelector<HTMLCanvasElement>('[data-c3-gl]');
  const ac = new AbortController();
  const on = { signal: ac.signal, passive: true } as AddEventListenerOptions;
  const query = new URLSearchParams(location.search);
  const nav = navigator as Nav;

  const setState = (s: string) => {
    hero.dataset.glState = s;
  };
  setState('still');

  // ---- Criteri di idoneità -------------------------------------------------
  const lowPower =
    nav.connection?.saveData === true ||
    (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) ||
    (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2);
  const small = matchMedia('(max-width: 700px)');
  const coarse = !matchMedia('(pointer: fine)').matches;
  const quality = small.matches || coarse ? 0.75 : 1;

  const P: VortexParams = {
    intensity: clamp(Number(query.get('fx-int')) || 0.7, 0.2, 1.4),
    speed: clamp(Number(query.get('fx-speed')) || 1, 0.2, 2.5),
    scale: 1,
    turb: 0.5,
    pal: PALETTE,
    ptr: [0.5, 0.5],
    pv: [0, 0],
    ptrOn: 0,
    Z: new Float32Array(24),
    Zk: new Float32Array(6).fill(1),
    Zf: 40,
  };

  let gl: WebGL2RenderingContext | null = null;
  let field: VortexField | null = null;
  let ok = false;
  let failed = false;
  let started = false;
  let visible = true;
  let raf = 0;
  let last = 0;
  let t = 0;
  let w = 0;
  let h = 0;
  let resScale = small.matches ? 0.7 : 0.75;
  let ptrTarget = 0;
  let lastMove = 0;
  let px = 0.5;
  let py = 0.5;
  let pt = 0;
  // Monitor del frame rate
  let frames = 0;
  let windowStart = 0;
  let slowWindows = 0;
  let downgrades = 0;

  const eligible = () => !!canvas && !query.has('nogl') && !lowPower && !failed;
  const running = () => ok && started && !isReduced() && !document.hidden && visible;

  function fail(reason: string) {
    failed = true;
    ok = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    canvas?.classList.remove('is-live');
    setState('fallback');
    if (import.meta.env.DEV) console.info('[c3-hero] fallback statico:', reason);
  }

  function init(): boolean {
    if (ok) return true;
    if (!canvas || !eligible()) return false;
    try {
      gl = canvas.getContext('webgl2', {
        antialias: false,
        alpha: false,
        depth: false,
        powerPreference: 'high-performance',
      });
      if (!gl || !gl.getExtension('EXT_color_buffer_float')) {
        fail('WebGL2 o float render target non disponibili');
        return false;
      }
      field = createVortexField(gl, quality);
      ok = true;
      fit(true);
      return true;
    } catch (e) {
      fail(e instanceof Error ? e.message : 'init');
      return false;
    }
  }

  /** Dimensiona il canvas; true se le dimensioni sono cambiate */
  function fit(force = false): boolean {
    if (!ok || !canvas || !field) return false;
    const q = Math.min(devicePixelRatio || 1, 1.5) * resScale;
    const nw = Math.max(2, Math.round(canvas.clientWidth * q));
    const nh = Math.max(2, Math.round(canvas.clientHeight * q));
    if (!force && nw === w && nh === h) return false;
    w = nw;
    h = nh;
    canvas.width = w;
    canvas.height = h;
    field.resize(w, h);
    zones();
    warm(60);
    return true;
  }

  /** Velo di lettura: riquadri dei testi reali in pixel del canvas */
  function zones() {
    if (!canvas || !w) return;
    const cr = canvas.getBoundingClientRect();
    if (!cr.width) return;
    const sx = w / cr.width;
    const sy = h / cr.height;
    const pad = 10;
    const els = [...document.querySelectorAll<HTMLElement>('[data-veil]')].slice(0, 6);
    P.Z.fill(-1e5);
    P.Zk.fill(1);
    els.forEach((el, i) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const b = el.dataset.veilBox === 'element' ? el.getBoundingClientRect() : range.getBoundingClientRect();
      P.Z[i * 4] = (b.left - pad - cr.left) * sx;
      P.Z[i * 4 + 1] = (cr.bottom - b.bottom - pad) * sy;
      P.Z[i * 4 + 2] = (b.right + pad - cr.left) * sx;
      P.Z[i * 4 + 3] = (cr.bottom - b.top + pad) * sy;
      P.Zk[i] = clamp(Number(el.dataset.veil) || 0.5, 0, 1);
    });
    P.Zf = 56 * sy;
  }

  function warm(n: number) {
    if (!field) return;
    const on0 = P.ptrOn;
    P.ptrOn = 0;
    for (let i = 0; i < n; i++) {
      t += 0.033;
      field.step(t, 0.033, P);
    }
    P.ptrOn = on0;
  }

  function monitor(now: number) {
    frames++;
    if (!windowStart) windowStart = now;
    const span = now - windowStart;
    if (span < 1500) return;
    const fps = (frames * 1000) / span;
    frames = 0;
    windowStart = now;
    if (fps >= 40) {
      slowWindows = 0;
      return;
    }
    if (downgrades < 2 && resScale > 0.45) {
      resScale *= 0.75;
      downgrades++;
      fit(true);
      return;
    }
    if (fps < 24 && ++slowWindows >= 3) fail(`frame rate insufficiente (${Math.round(fps)} fps)`);
  }

  function frame(now: number) {
    raf = 0;
    if (!running() || !field) return;
    fit();
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    last = now;
    if (lastMove && now - lastMove > 120) P.pv = [P.pv[0] * 0.85, P.pv[1] * 0.85];
    if (lastMove && now - lastMove > 1200) ptrTarget = 0;
    P.ptrOn += (ptrTarget - P.ptrOn) * 0.1;
    t += dt;
    field.step(t, dt, P);
    field.render(P);
    if (!canvas!.classList.contains('is-live')) canvas!.classList.add('is-live');
    monitor(now);
    if (ok) raf = requestAnimationFrame(frame);
  }

  function sync() {
    if (failed) return setState('fallback');
    if (isReduced()) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      canvas?.classList.remove('is-live');
      return setState('reduced');
    }
    if (!started) return setState('still');
    if (!init()) return;
    if (running()) {
      if (!raf) {
        last = 0;
        frames = 0;
        windowStart = 0;
        raf = requestAnimationFrame(frame);
      }
      setState('live');
    } else {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      setState('paused');
    }
  }

  // ---- Avvio progressivo: dopo il load, in idle ----------------------------
  function start() {
    if (started || ac.signal.aborted) return;
    started = true;
    if (!eligible()) {
      if (lowPower) setState('still');
      return;
    }
    if (init()) warm(90);
    sync();
  }
  const idle = (cb: () => void) => {
    const ric = (window as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    if (typeof ric === 'function') ric(cb, { timeout: 1500 });
    else setTimeout(cb, 300);
  };
  if (document.readyState === 'complete') idle(start);
  else addEventListener('load', () => idle(start), { once: true, signal: ac.signal });

  // ---- Eventi --------------------------------------------------------------
  const io = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? true;
    sync();
  });
  io.observe(hero);
  document.addEventListener('visibilitychange', sync, { signal: ac.signal });
  addEventListener(
    'resize',
    () =>
      requestAnimationFrame(() => {
        if (ok) {
          fit();
          zones();
        }
      }),
    on
  );
  document.fonts?.ready.then(() => ok && zones());

  hero.addEventListener(
    'pointermove',
    (e) => {
      if (!ok || isReduced() || !canvas) return;
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = 1 - (e.clientY - r.top) / r.height;
      const now = performance.now();
      const dtm = Math.max(8, now - pt);
      P.pv = [((x - px) * 16) / dtm, ((y - py) * 16) / dtm];
      px = x;
      py = y;
      pt = now;
      P.ptr = [x, y];
      ptrTarget = 1;
      lastMove = now;
    },
    on
  );
  hero.addEventListener('pointerleave', () => (ptrTarget = 0), on);
  canvas?.addEventListener(
    'webglcontextlost',
    (e) => {
      e.preventDefault();
      fail('contesto WebGL perso');
    },
    { signal: ac.signal }
  );

  return {
    sync,
    destroy() {
      ac.abort();
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      field?.dispose();
      field = null;
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
      gl = null;
      ok = false;
    },
  };
}
