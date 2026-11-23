/**
 * Campo «linee di livello» della scheda Creative development (WebGL1).
 * Dimostrazione interattiva leggera: due slider cambiano densità e flusso.
 * Senza WebGL resta il fondo grafite con una nota testuale.
 */
import { token } from "./tokens";

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = `precision mediump float;uniform vec2 R,M;uniform float T,F,V;uniform vec3 A;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.02+vec2(1.7,9.2);a*=.5;}return v;}
float H(vec2 u){vec2 a=vec2(R.x/R.y,1.);vec2 p=u*a*1.25;float t=T*V;vec2 q=vec2(fb(p+t*.05),fb(p+vec2(5.2,1.3)-t*.04));float b=fb(p+1.8*q);float d=distance(u*a,M*a);return b*.55+.2*exp(-d*d*22.);}
void main(){vec2 u=gl_FragCoord.xy/R;float e=1.5/R.y;float f=H(u),fx=H(u+vec2(e,0.)),fy=H(u+vec2(0.,e));
vec3 N=normalize(vec3(-(fx-f)/e*.07,-(fy-f)/e*.07,1.));vec3 L=normalize(vec3(M.x-.3,M.y-.25,.85));float d=max(dot(N,L),0.);vec3 r=reflect(-L,N);float s=pow(max(r.z,0.),16.);
vec3 c=mix(vec3(.06,.068,.077),vec3(.2,.21,.235),f)*(.45+.55*d)+s*vec3(.42,.44,.46);
float b=fract(f*F-T*V*.03);float ln=exp(-pow((b-.5)/.07,2.));
c+=A*ln*.3*clamp(f*2.-.2,0.,1.);
gl_FragColor=vec4(c,1.);}`;

export interface LabHandle {
  sync(): void;
  destroy(): void;
}

export function mountLab(
  canvas: HTMLCanvasElement,
  isReduced: () => boolean,
): LabHandle | null {
  let gl: WebGLRenderingContext | null = null;
  try {
    gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
  } catch {
    gl = null;
  }
  if (!gl) {
    canvas.closest("[data-c3-lab]")?.setAttribute("data-lab-state", "fallback");
    return null;
  }
  const g = gl;
  const sh = (type: number, src: string) => {
    const o = g.createShader(type)!;
    g.shaderSource(o, src);
    g.compileShader(o);
    return g.getShaderParameter(o, g.COMPILE_STATUS) ? o : null;
  };
  const a = sh(g.VERTEX_SHADER, VS);
  const b = sh(g.FRAGMENT_SHADER, FS);
  if (!a || !b) return null;
  const pr = g.createProgram()!;
  g.attachShader(pr, a);
  g.attachShader(pr, b);
  g.linkProgram(pr);
  if (!g.getProgramParameter(pr, g.LINK_STATUS)) return null;
  g.useProgram(pr);
  const buf = g.createBuffer();
  g.bindBuffer(g.ARRAY_BUFFER, buf);
  g.bufferData(
    g.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    g.STATIC_DRAW,
  );
  const loc = g.getAttribLocation(pr, "p");
  g.enableVertexAttribArray(loc);
  g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
  const U = Object.fromEntries(
    ["R", "M", "T", "F", "V", "A"].map((k) => [k, g.getUniformLocation(pr, k)]),
  );

  const root = canvas.closest<HTMLElement>("[data-c3-lab]");
  const rF = root?.querySelector<HTMLInputElement>("[data-lab-f]");
  const rV = root?.querySelector<HTMLInputElement>("[data-lab-v]");
  const ac = new AbortController();
  const state = { F: 9, V: 1, m: [0.62, 0.5], tm: [0.62, 0.5] };
  let raf = 0;
  let visible = false;
  const t0 = performance.now();
  const accent = token("--c3-ion", [0.6, 0.6, 0.6]);

  const size = () => {
    const q = Math.min(devicePixelRatio || 1, 1.5) * 0.8;
    canvas.width = Math.max(2, (canvas.clientWidth * q) | 0);
    canvas.height = Math.max(2, (canvas.clientHeight * q) | 0);
    g.viewport(0, 0, canvas.width, canvas.height);
  };
  const draw = () => {
    state.m[0] += (state.tm[0] - state.m[0]) * 0.06;
    state.m[1] += (state.tm[1] - state.m[1]) * 0.06;
    g.uniform2f(U.R, canvas.width, canvas.height);
    g.uniform2f(U.M, state.m[0], state.m[1]);
    g.uniform1f(U.T, 9 + (isReduced() ? 0 : (performance.now() - t0) / 1000));
    g.uniform1f(U.F, state.F);
    g.uniform1f(U.V, state.V);
    g.uniform3fv(U.A, accent);
    g.drawArrays(g.TRIANGLES, 0, 3);
  };
  const loop = () => {
    raf = 0;
    draw();
    if (visible && !isReduced() && !document.hidden)
      raf = requestAnimationFrame(loop);
  };
  const sync = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };

  size();
  sync();
  const io = new IntersectionObserver((es) => {
    visible = es[0]?.isIntersecting ?? false;
    sync();
  });
  io.observe(canvas);
  addEventListener("resize", () => (size(), sync()), {
    signal: ac.signal,
    passive: true,
  });
  document.addEventListener("visibilitychange", sync, { signal: ac.signal });
  rF?.addEventListener("input", () => ((state.F = Number(rF.value)), sync()), {
    signal: ac.signal,
  });
  rV?.addEventListener("input", () => ((state.V = Number(rV.value)), sync()), {
    signal: ac.signal,
  });
  canvas.parentElement?.addEventListener(
    "pointermove",
    (e) => {
      const r = canvas.getBoundingClientRect();
      state.tm = [
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height,
      ];
      sync();
    },
    { signal: ac.signal, passive: true },
  );

  return {
    sync,
    destroy() {
      ac.abort();
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      g.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
