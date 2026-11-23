/**
 * Header C.3 su tutte le pagine: pieno allo scroll, si nasconde scendendo e
 * riappare salendo (mai con il focus da tastiera dentro), sottomenu Servizi
 * come disclosure accessibile, menu mobile a tutto schermo con Escape.
 * Init su `astro:page-load`, teardown su `astro:before-swap` (ClientRouter).
 */
function init(): () => void {
  const ac = new AbortController();
  const sig = { signal: ac.signal };
  const cleanups: Array<() => void> = [];
  const q = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
  const qa = <T extends Element = HTMLElement>(s: string) => [...document.querySelectorAll<T>(s)];

  // ── Header ────────────────────────────────────────────────────────────────
  const header = q('[data-c3-header]');
  let lastY = scrollY;
  const headerTick = () => {
    if (!header) return;
    const y = scrollY;
    header.classList.toggle('is-solid', y > 30);
    const delta = y - lastY;
    if (Math.abs(delta) < 10) return;
    const locked =
      header.contains(document.activeElement) ||
      overlay?.classList.contains('is-open') ||
      !!header.querySelector('[data-c3-dd-btn][aria-expanded="true"]');
    header.classList.toggle('is-hidden', delta > 0 && y > 240 && !locked);
    lastY = y;
  };
  header?.addEventListener('focusin', () => header.classList.remove('is-hidden'), sig);

  // Sottomenu Servizi (disclosure)
  const closeDropdowns = (except?: Element) =>
    qa<HTMLButtonElement>('[data-c3-dd-btn]').forEach((b) => {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      document.getElementById(b.getAttribute('aria-controls') || '')?.setAttribute('hidden', '');
    });
  qa<HTMLButtonElement>('[data-c3-dd-btn]').forEach((btn) => {
    const menu = document.getElementById(btn.getAttribute('aria-controls') || '');
    btn.addEventListener(
      'click',
      () => {
        const open = btn.getAttribute('aria-expanded') !== 'true';
        closeDropdowns(btn);
        btn.setAttribute('aria-expanded', String(open));
        menu?.toggleAttribute('hidden', !open);
      },
      sig
    );
    btn.closest('[data-c3-dd]')?.addEventListener(
      'focusout',
      (e) => {
        const next = (e as FocusEvent).relatedTarget as Node | null;
        if (!next || !btn.closest('[data-c3-dd]')!.contains(next)) closeDropdowns();
      },
      sig
    );
  });
  document.addEventListener(
    'click',
    (e) => {
      if (!(e.target as Element).closest?.('[data-c3-dd]')) closeDropdowns();
    },
    sig
  );

  // Menu mobile
  const menuBtn = q<HTMLButtonElement>('[data-c3-menu]');
  const overlay = q('[data-c3-overlay]');
  const setMenu = (open: boolean) => {
    if (!overlay || !menuBtn) return;
    overlay.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      header?.classList.remove('is-hidden');
      header?.classList.add('is-solid');
      overlay.querySelector<HTMLElement>('a')?.focus();
    }
  };
  menuBtn?.addEventListener('click', () => setMenu(!overlay?.classList.contains('is-open')), sig);
  overlay?.addEventListener('click', (e) => (e.target as Element).closest('a') && setMenu(false), sig);
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape') return;
      if (overlay?.classList.contains('is-open')) {
        setMenu(false);
        menuBtn?.focus();
      }
      const openDd = q<HTMLButtonElement>('[data-c3-dd-btn][aria-expanded="true"]');
      if (openDd) {
        closeDropdowns();
        openDd.focus();
      }
    },
    sig
  );
  const desktop = matchMedia('(min-width: 1024px)');
  const onDesktopChange = () => desktop.matches && setMenu(false);
  desktop.addEventListener('change', onDesktopChange);
  cleanups.push(() => {
    desktop.removeEventListener('change', onDesktopChange);
    document.documentElement.style.overflow = '';
  });

  let ticking = false;
  addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        headerTick();
      });
    },
    { signal: ac.signal, passive: true }
  );
  headerTick();

  return () => {
    ac.abort();
    cleanups.forEach((fn) => fn());
  };
}

let teardown: (() => void) | null = null;
document.addEventListener('astro:page-load', () => {
  teardown?.();
  teardown = document.querySelector('[data-c3-header]') ? init() : null;
});
document.addEventListener('astro:before-swap', () => {
  teardown?.();
  teardown = null;
});
