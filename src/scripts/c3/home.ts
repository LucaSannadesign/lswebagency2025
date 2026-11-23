/**
 * Controller della homepage C.3.
 *
 * Inizializzazione su `astro:page-load` (ClientRouter) e teardown completo su
 * `astro:before-swap`: nessun requestAnimationFrame, observer o listener resta
 * attivo navigando verso altre pagine. Senza JavaScript la pagina è completa:
 * qui si aggiungono solo movimento e interazioni.
 */
import { mountHero, type HeroHandle } from './hero-controller';
import { mountLab, type LabHandle } from './lab-field';
import { mountHeroType, type TypeHandle } from './hero-type';

const MOTION_KEY = 'ls-motion';
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function readStoredMotion(): string | null {
  try {
    return localStorage.getItem(MOTION_KEY);
  } catch {
    return null;
  }
}

function init(root: HTMLElement): () => void {
  const ac = new AbortController();
  const sig = { signal: ac.signal };
  const passive = { signal: ac.signal, passive: true };
  const observers: IntersectionObserver[] = [];
  const cleanups: Array<() => void> = [];
  const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector<T>(s);
  const $$ = <T extends Element = HTMLElement>(s: string) => [...root.querySelectorAll<T>(s)];
  const io = (cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) => {
    const o = new IntersectionObserver(cb, opts);
    observers.push(o);
    return o;
  };

  root.classList.add('c3-js');
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));

  // ── Movimento: preferenza di sistema + interruttore in pagina ─────────────
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const stored = readStoredMotion();
  let reduced = stored ? stored === 'reduced' : mq.matches;
  const isReduced = () => reduced;
  const motionBtn = $<HTMLButtonElement>('[data-c3-motion]');
  const motionLabel = $('[data-c3-motion-label]');

  const desktop = matchMedia('(min-width: 1024px)');


  // ── Capitoli tonali ──────────────────────────────────────────────────────
  const toneIO = io(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) root.dataset.tone = (e.target as HTMLElement).dataset.c3Chapter || 'dark';
      }),
    { rootMargin: '-50% 0px -50% 0px' }
  );
  $$('[data-c3-chapter]').forEach((s) => toneIO.observe(s));

  // ── Reveal generico ──────────────────────────────────────────────────────
  const revealIO = io(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          revealIO.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -10% 0px' }
  );
  $$('.c3-reveal').forEach((el) => revealIO.observe(el));
  // Titoli di sezione: rivelazione a maschera (la hero ha la sua animazione)
  $$('.c3-h2, .c3-stmt').forEach((el) => {
    el.classList.add('c3-rv');
    revealIO.observe(el);
  });

  // ── Orologio di Sassari nella riga meta della hero ─────────────────────
  const clock = $('[data-c3-clock]');
  if (clock) {
    const fmtTime = new Intl.DateTimeFormat('it-IT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' });
    const tickClock = () => (clock.textContent = fmtTime.format(new Date()));
    tickClock();
    const timer = window.setInterval(tickClock, 30000);
    cleanups.push(() => clearInterval(timer));
  }

  // ── Nastro cinetico: accelera con la velocità dello scroll ─────────────
  const marquee = $('[data-c3-marquee] .c3-marquee-track');
  let marqAnim: Animation | undefined;
  let boost = 0;
  let marqRaf = 0;
  let lastScroll = scrollY;
  const marqStep = () => {
    marqRaf = 0;
    if (!marqAnim) marqAnim = marquee?.getAnimations()[0];
    if (!marqAnim) return;
    boost *= 0.92;
    marqAnim.playbackRate = 1 + boost;
    if (boost > 0.02) marqRaf = requestAnimationFrame(marqStep);
    else marqAnim.playbackRate = 1;
  };
  const marqScroll = () => {
    const dy = Math.abs(scrollY - lastScroll);
    lastScroll = scrollY;
    if (!marquee || reduced) return;
    boost = Math.min(5, boost + dy / 40);
    if (!marqRaf) marqRaf = requestAnimationFrame(marqStep);
  };
  cleanups.push(() => {
    if (marqRaf) cancelAnimationFrame(marqRaf);
  });

  // ── Portfolio ─────────────────────────────────────────────────────────────
  const pf = $('[data-c3-pf]');
  const items = $$('.c3-pf-item');
  const navBtns = $$<HTMLButtonElement>('.c3-pf-nav [data-go]');
  const tall = matchMedia('(min-height: 680px)');
  let pinned = false;
  let active = -1;
  const setActive = (i: number) => {
    if (i === active || !items[i]) return;
    active = i;
    items.forEach((it, k) => it.classList.toggle('is-active', k === i));
    navBtns.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    root.style.setProperty('--c3-tint', items[i].dataset.tint || '');
    root.style.setProperty('--pacc', items[i].dataset.accent || '');
  };
  const setupPin = () => {
    pinned = desktop.matches && tall.matches && !reduced && items.length > 1;
    root.classList.toggle('is-pinned', pinned);
    pf?.style.setProperty('--pinH', `${items.length * 90 + 100}vh`);
    if (!pinned)
      items.forEach((it) => {
        it.style.removeProperty('--r0');
        it.style.visibility = '';
        it.style.zIndex = '';
      });
    if (active < 0) setActive(0);
  };
  const pfRevealIO = io(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.remove('is-pre');
          pfRevealIO.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -15% 0px' }
  );
  const pfActiveIO = io(
    (es) =>
      es.forEach((e) => {
        if (!pinned && e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      }),
    { rootMargin: '-45% 0px -45% 0px' }
  );
  items.forEach((it) => {
    pfRevealIO.observe(it);
    pfActiveIO.observe(it);
  });
  navBtns.forEach((b) =>
    b.addEventListener(
      'click',
      () => {
        if (!pf) return;
        const i = Number(b.dataset.go);
        const top = pf.offsetTop + (pf.offsetHeight - innerHeight) * (i / Math.max(1, items.length - 1)) + 2;
        scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
      },
      sig
    )
  );
  const pinTick = () => {
    if (!pinned || !pf) return;
    const r = pf.getBoundingClientRect();
    const prog = clamp(-r.top / (r.height - innerHeight));
    const f = prog * (items.length - 1);
    items.forEach((it, i) => {
      const open = i === 0 ? 1 : clamp(f - (i - 1));
      it.style.setProperty('--r0', (1 - open).toFixed(3));
      it.style.zIndex = String(i);
      it.style.visibility = open <= 0.02 ? 'hidden' : '';
    });
    setActive(Math.min(items.length - 1, Math.round(f)));
  };
  const onLayoutChange = () => {
    setupPin();
    kick();
  };
  desktop.addEventListener('change', onLayoutChange);
  tall.addEventListener('change', onLayoutChange);
  cleanups.push(() => {
    desktop.removeEventListener('change', onLayoutChange);
    tall.removeEventListener('change', onLayoutChange);
    root.classList.remove('is-pinned');
  });

  // Scheda progetto (<dialog> nativo, view transition se disponibile)
  const dlg = $<HTMLDialogElement>('[data-c3-case]');
  const dlgBody = $('[data-c3-case-body]');
  let opener: HTMLElement | null = null;
  const openCase = (i: number, trigger: HTMLElement) => {
    const tpl = items[i]?.querySelector<HTMLElement>('[data-case]');
    if (!dlg || !dlgBody || !tpl) return;
    opener = trigger;
    const fill = () => {
      dlgBody.replaceChildren(...[...tpl.children].map((n) => n.cloneNode(true)));
      dlgBody.querySelector('.c3-case-title')?.setAttribute('id', 'c3-case-title');
      dlgBody.querySelectorAll('img').forEach((img) => img.setAttribute('loading', 'eager'));
      dlg.showModal();
      dlg.scrollTop = 0;
    };
    const src = items[i].querySelector<HTMLElement>('.c3-pf-frame img');
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } };
    if (doc.startViewTransition && !reduced && src) {
      src.style.viewTransitionName = 'c3-case';
      const vt = doc.startViewTransition(() => {
        src.style.viewTransitionName = '';
        fill();
        const img = dlgBody.querySelector<HTMLElement>('.c3-case-img');
        if (img) img.style.viewTransitionName = 'c3-case';
      });
      vt.finished.finally(() => {
        const img = dlgBody.querySelector<HTMLElement>('.c3-case-img');
        if (img) img.style.viewTransitionName = '';
      });
    } else fill();
  };
  $$<HTMLElement>('[data-open]').forEach((b) =>
    b.addEventListener('click', () => openCase(Number(b.dataset.open), b), sig)
  );
  $('[data-c3-case-x]')?.addEventListener('click', () => dlg?.close(), sig);
  dlg?.addEventListener('click', (e) => e.target === dlg && dlg.close(), sig);
  dlg?.addEventListener('close', () => opener?.focus(), sig);
  cleanups.push(() => dlg?.open && dlg.close());

  // ── Competenze: demo UX ──────────────────────────────────────────────────
  const mini = $('[data-ux-mini]');
  const uxBtns = $$<HTMLButtonElement>('[data-ux]');
  const AFTER = '<i class="t"></i><i style="width:92%"></i><i style="width:70%"></i><i class="c"></i>';
  const BEFORE =
    '<i></i><i class="c"></i><i></i><i class="t"></i><i></i><i></i><i></i><i class="c"></i><i></i><i></i><i></i><i></i>';
  uxBtns.forEach((b) =>
    b.addEventListener(
      'click',
      () => {
        const after = b.dataset.ux === 'after';
        uxBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        if (!mini) return;
        mini.classList.toggle('is-before', !after);
        mini.innerHTML = after ? AFTER : BEFORE;
        mini.setAttribute(
          'aria-label',
          after
            ? 'Schema di una homepage con gerarchia chiara: titolo, testo, un solo pulsante'
            : 'Schema di una homepage confusa: dodici blocchi uguali e due pulsanti in competizione'
        );
      },
      sig
    )
  );

  // ── Competenze: metriche misurate nel browser ───────────────────────────
  const metric = (k: string, v: string) => {
    const el = $(`[data-m="${k}"]`);
    if (el) el.textContent = v;
  };
  metric('dom', String(document.getElementsByTagName('*').length));
  try {
    const po = new PerformanceObserver((list) => {
      const en = list.getEntries();
      const v = en[en.length - 1]?.startTime ?? 0;
      metric('lcp', `${(v / 1000).toFixed(2).replace('.', ',')} s`);
    });
    po.observe({ type: 'largest-contentful-paint', buffered: true });
    cleanups.push(() => po.disconnect());
  } catch {
    metric('lcp', 'non misurabile qui');
  }
  const GL_LABEL: Record<string, string> = {
    still: 'immagine statica',
    live: 'attivo',
    paused: 'in pausa',
    reduced: 'fermo',
    fallback: 'immagine statica',
  };
  const heroEl = $('[data-c3-hero]');
  const glWatch = new MutationObserver(() => metric('gl', GL_LABEL[heroEl?.dataset.glState || 'still'] || '—'));
  if (heroEl) glWatch.observe(heroEl, { attributes: true, attributeFilter: ['data-gl-state'] });
  cleanups.push(() => glWatch.disconnect());

  // ── Recensioni: carosello ────────────────────────────────────────────────
  $$('[data-c3-carousel]').forEach((car) => {
    const track = car.querySelector<HTMLElement>('[data-track]');
    const cards = [...car.querySelectorAll<HTMLElement>('[data-card]')];
    const count = car.querySelector('[data-count]');
    const prev = car.querySelector<HTMLButtonElement>('[data-prev]');
    const next = car.querySelector<HTMLButtonElement>('[data-next]');
    if (!track || !cards.length) return;
    const index = () => {
      const left = track.scrollLeft;
      let best = 0;
      cards.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - track.offsetLeft - left) < Math.abs(cards[best].offsetLeft - track.offsetLeft - left)) best = i;
      });
      return best;
    };
    const update = () => {
      const i = index();
      if (count) count.textContent = `${i + 1} / ${cards.length}`;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    const go = (d: number) => {
      const i = clamp(index() + d, 0, cards.length - 1);
      track.scrollTo({ left: cards[i].offsetLeft - track.offsetLeft, behavior: reduced ? 'auto' : 'smooth' });
    };
    prev?.addEventListener('click', () => go(-1), sig);
    next?.addEventListener('click', () => go(1), sig);
    track.addEventListener('scroll', () => requestAnimationFrame(update), passive);
    addEventListener('resize', update, passive);
    update();
  });

  // ── Motore di scroll ────────────────────────────────────────────────────
  let ticking = false;
  const heroTick = () => {
    if (!heroEl) return;
    if (reduced) {
      heroEl.style.removeProperty('--hx');
      return;
    }
    const h = heroEl.offsetHeight || innerHeight;
    const p = clamp(scrollY / (h * 0.85));
    heroEl.style.setProperty('--hx', p.toFixed(3));
  };
  function frame() {
    ticking = false;
    pinTick();
    heroTick();
    marqScroll();
  }
  function kick() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(frame);
    }
  }
  addEventListener('scroll', kick, passive);
  addEventListener('resize', kick, passive);

  // ── WebGL: hero e scheda lab ────────────────────────────────────────────
  const hero: HeroHandle | null = heroEl ? mountHero(heroEl, isReduced) : null;
  const h1 = $('[data-c3-kinetic]');
  const heroType: TypeHandle | null = h1 && heroEl ? mountHeroType(h1, heroEl, isReduced) : null;
  const labCanvas = $<HTMLCanvasElement>('[data-lab-canvas]');
  let lab: LabHandle | null = null;
  if (labCanvas) {
    // Il lab parte solo quando la scheda si avvicina alla viewport.
    const labIO = io((es) => {
      if (es[0]?.isIntersecting && !lab) {
        lab = mountLab(labCanvas, isReduced);
        labIO.disconnect();
      }
    }, { rootMargin: '200px 0px' });
    labIO.observe(labCanvas);
  }

  // ── Applicazione della preferenza di movimento ──────────────────────────
  function applyMotion() {
    root.classList.toggle('is-reduced', reduced);
    motionBtn?.setAttribute('aria-pressed', String(reduced));
    if (motionLabel) motionLabel.textContent = reduced ? ': ridotto' : ': attivo';
    metric('motion', reduced ? 'ridotto' : 'attivo');
    setupPin();
    kick();
    hero?.sync();
    lab?.sync();
  }
  motionBtn?.addEventListener(
    'click',
    () => {
      reduced = !reduced;
      try {
        localStorage.setItem(MOTION_KEY, reduced ? 'reduced' : 'full');
      } catch {
        /* preferenza solo per questa visita */
      }
      applyMotion();
    },
    sig
  );
  const onMq = (e: MediaQueryListEvent) => {
    if (!readStoredMotion()) {
      reduced = e.matches;
      applyMotion();
    }
  };
  mq.addEventListener('change', onMq);
  cleanups.push(() => mq.removeEventListener('change', onMq));

  applyMotion();

  return () => {
    ac.abort();
    observers.forEach((o) => o.disconnect());
    cleanups.forEach((fn) => fn());
    hero?.destroy();
    heroType?.destroy();
    lab?.destroy();
    root.classList.remove('is-ready', 'c3-js');
  };
}

let teardown: (() => void) | null = null;

function boot() {
  teardown?.();
  teardown = null;
  const root = document.getElementById('c3-root');
  if (root) teardown = init(root);
}

document.addEventListener('astro:page-load', boot);
document.addEventListener('astro:before-swap', () => {
  teardown?.();
  teardown = null;
});
