/**
 * Pagine interne C.3.4: rivelazione all'ingresso degli elementi `.c3-up`.
 * Senza JavaScript (o con movimento ridotto) tutto è visibile da subito.
 * Init su `astro:page-load`, teardown su `astro:before-swap`.
 */
let io: IntersectionObserver | null = null;

function boot() {
  io?.disconnect();
  io = null;
  const root = document.querySelector<HTMLElement>('.c3p');
  if (!root) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('c3-js');
  const vh = innerHeight;
  const els = [...root.querySelectorAll<HTMLElement>('.c3-up')];
  // Ciò che è già nel primo schermo non viene nascosto: nessun ritardo dell'LCP.
  els.forEach((el) => {
    if (el.getBoundingClientRect().top < vh * 0.9) el.classList.add('is-in');
  });
  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io?.unobserve(e.target);
        }
      }),
    { rootMargin: '0px 0px -8% 0px' }
  );
  els.filter((el) => !el.classList.contains('is-in')).forEach((el) => io?.observe(el));
}

document.addEventListener('astro:page-load', boot);
document.addEventListener('astro:before-swap', () => {
  io?.disconnect();
  io = null;
});
