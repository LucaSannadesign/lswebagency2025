/** C.4.4 — continuous spatial Ion Flow. */
const TAU = Math.PI * 2;
const desktop = matchMedia('(min-width: 1024px)');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const KEY = 'ls-c4-field-paused';
const mounted = new Map<HTMLElement, () => void>();
function mount(el: HTMLElement): () => void {
  const canvas = el.querySelector<HTMLCanvasElement>('[data-c4-canvas]');
  const btn = el.querySelector<HTMLButtonElement>('[data-c4-pause]');
  const host = el.closest<HTMLElement>('.c3-phero');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !btn || !host || !ctx) { el.dataset.c4State = 'fallback'; return () => {}; }
  const ac = new AbortController(), sig = { signal: ac.signal };
  const kind = el.dataset.c4Field;
  let w = 0, h = 0, t = 0, last = 0, raf = 0, painted = 0;
  let visible = false, paused = false, mx = 0, my = 0, px = 0, py = 0;
  try { paused = localStorage.getItem(KEY) === '1'; } catch {}
  const p = new Float64Array(4);
  const eligible = () => desktop.matches && w > 0 && h > 0;
  const enabled = () => eligible() && visible && !document.hidden && !reduced.matches && !paused;
  function project(u: number, v: number) {
    const a = u * TAU;
    const k = kind === 'geometry' ? 4 : kind === 'sculpture' ? 2 : 3;
    const phase = a * (kind === 'geometry' ? 3 : 2) + v + t * .9;
    const swell = .28 * Math.sin(a * k - t * .85) + .13 * Math.cos(a * 2 + t * .53);
    const tube = .34 + .12 * Math.sin(a * 2 + t * .65 + v);
    const radius = 1 + swell + tube * Math.cos(phase);
    let x = radius * Math.cos(a), y = radius * Math.sin(a);
    let z = tube * Math.sin(phase) + .48 * Math.sin(a * 2 - t * .62);
    if (kind === 'flow') { x *= 1.28; y *= .69; z += .22 * Math.cos(a * 3 + t); }
    if (kind === 'sculpture') { y *= 1.12; z *= 1.22; }
    const yaw = -.48 + t * .25 + px * .48;
    const pitch = .80 + .32 * Math.sin(t * .45) + py * .40;
    const roll = -.18 + .22 * Math.sin(t * .38);
    const X = x * Math.cos(yaw) - z * Math.sin(yaw);
    let Z = x * Math.sin(yaw) + z * Math.cos(yaw);
    const Y = y * Math.cos(pitch) - Z * Math.sin(pitch);
    Z = y * Math.sin(pitch) + Z * Math.cos(pitch);
    const perspective = 5 / Math.max(2.2, 5 - Z);
    const size = Math.min(w * .34, h * .36);
    p[0] = w * .64 + w * .035 * Math.sin(t * .5) + px * 64 + (X * Math.cos(roll) - Y * Math.sin(roll)) * size * perspective * 1.22;
    p[1] = h * .43 + h * .035 * Math.cos(t * .46) + py * 42 + (X * Math.sin(roll) + Y * Math.cos(roll)) * size * perspective;
    p[2] = perspective;
    p[3] = Math.max(0, Math.min(1, (Z + 1.8) / 3.6));
  }
  function draw() {
    if (!eligible() || !ctx) return;
    const dark = document.documentElement.dataset.lsTheme !== 'light';
    ctx.clearRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w * .64, h * .42, 0, w * .64, h * .42, Math.min(w * .44, h * .62));
    glow.addColorStop(0, dark ? 'rgba(51,172,151,.20)' : 'rgba(79,168,155,.14)');
    glow.addColorStop(1, 'rgba(79,168,155,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = dark ? 'screen' : 'multiply';
    const count = w < 850 ? 36 : 52, steps = 104;
    for (let i = 0; i < count; i++) {
      const v = i / count * TAU, bright = i % 7 === 0;
      for (let segment = 0; segment < 8; segment++) {
        ctx.beginPath();
        let depth = 0;
        for (let j = 0; j <= 13; j++) {
          project((segment * 13 + j) / steps, v);
          if (j === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]);
          depth += p[3];
        }
        depth /= 14;
        const alpha = (bright ? .32 : .10) + depth * (bright ? .52 : .27);
        ctx.strokeStyle = dark ? 'rgba('+Math.round(65+depth*125)+','+Math.round(157+depth*91)+','+Math.round(139+depth*94)+','+alpha+')' : 'rgba(31,90,84,'+alpha+')';
        ctx.lineWidth = (bright ? .85 : .42) + depth * (bright ? 1.05 : .78);
        ctx.stroke();
      }
    }
    for (let i = 0; i < 96; i++) {
      project((i * .6180339887 + t * (.045 + (i % 5) * .009)) % 1, i * 2.399963);
      const alpha = .18 + .72 * p[3];
      ctx.fillStyle = dark ? 'rgba(190,255,240,'+alpha+')' : 'rgba(19,97,85,'+alpha+')';
      ctx.beginPath(); ctx.arc(p[0], p[1], (i % 11 === 0 ? 2.4 : .85) * p[2], 0, TAU); ctx.fill();
    }
    ctx.restore();
    el.classList.add('is-drawn');
    el.dataset.c4Frames = String(++painted);
  }
  function measure() {
    if (!canvas || !ctx) return;
    const r = el.getBoundingClientRect();
    w = r.width; h = r.height;
    if (!eligible()) return;
    const d = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w * d); canvas.height = Math.round(h * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    draw();
  }
  function frame(now: number) {
    raf = 0;
    if (!enabled()) return;
    if (!last || now - last >= 30) {
      t += last ? Math.min((now - last) / 1000, .12) : .034;
      last = now;
      px += (mx - px) * .09; py += (my - py) * .09;
      draw();
    }
    raf = requestAnimationFrame(frame);
  }
  function sync() {
    if (!btn) return;
    btn.hidden = !eligible() || reduced.matches;
    btn.setAttribute('aria-pressed', String(paused));
    btn.setAttribute('aria-label', paused ? 'Riprendi animazione della testata' : 'Pausa animazione della testata');
    btn.title = paused ? 'Riprendi animazione' : 'Pausa animazione';
    el.dataset.c4State = !eligible() ? 'static' : reduced.matches ? 'reduced' : paused ? 'paused' : enabled() ? 'live' : 'offscreen';
    if (enabled()) { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }
    else if (raf) { cancelAnimationFrame(raf); raf = 0; }
  }
  function checkVisible() {
    if (!host) return;
    const rect = host.getBoundingClientRect();
    visible = rect.bottom > 0 && rect.top < innerHeight;
    sync();
  }
  btn.addEventListener('click', () => {
    paused = !paused;
    try { localStorage.setItem(KEY, paused ? '1' : '0'); } catch {}
    sync();
  }, sig);
  host.addEventListener('pointermove', e => {
    if (!enabled()) return;
    const r = host.getBoundingClientRect();
    mx = (e.clientX - r.left) / Math.max(1, r.width) - .5;
    my = (e.clientY - r.top) / Math.max(1, r.height) - .5;
  }, sig);
  host.addEventListener('pointerleave', () => { mx = 0; my = 0; }, sig);
  document.addEventListener('visibilitychange', () => { checkVisible(); }, sig);
  desktop.addEventListener('change', () => { measure(); checkVisible(); }, sig);
  reduced.addEventListener('change', sync, sig);
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { measure(); checkVisible(); }) : null;
  ro?.observe(el);
  const io = typeof IntersectionObserver === 'function' ? new IntersectionObserver(() => checkVisible()) : null;
  io?.observe(host);
  if (!io) addEventListener('scroll', checkVisible, { ...sig, passive: true });
  if (!ro) addEventListener('resize', () => { measure(); checkVisible(); }, sig);
  const mo = new MutationObserver(() => { if (eligible()) draw(); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ls-theme'] });
  measure(); checkVisible();
  return () => {
    ac.abort(); ro?.disconnect(); io?.disconnect(); mo.disconnect();
    if (raf) cancelAnimationFrame(raf);
    el.dataset.c4State = 'stopped';
  };
}
function destroy() { mounted.forEach(fn => fn()); mounted.clear(); }
function boot() {
  mounted.forEach((fn, el) => { if (!el.isConnected) { fn(); mounted.delete(el); } });
  document.querySelectorAll<HTMLElement>('[data-c4-field]').forEach(el => {
    if (!mounted.has(el)) mounted.set(el, mount(el));
  });
}
document.addEventListener('astro:page-load', boot);
document.addEventListener('astro:before-swap', destroy);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
