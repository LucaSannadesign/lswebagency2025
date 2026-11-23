/**
 * Vortex Field — motore WebGL2 della hero C.3 (nessuna libreria).
 *
 * Particelle GPU trasportate da sei vortici puntiformi di verso opposto (più uno
 * guidato dal puntatore). Le scie si accumulano in un buffer a risoluzione
 * ridotta; il passaggio finale applica il tone mapping e il «velo»: una leggera
 * attenuazione dietro ai testi HTML reali, così l'effetto non compete mai con
 * H1, introduzione e CTA.
 *
 * Questo modulo è solo il motore: avvio, pausa, fallback e qualità sono gestiti
 * da hero-controller.ts.
 */

export type RGB = [number, number, number];

export interface VortexParams {
  intensity: number;
  speed: number;
  scale: number;
  turb: number;
  pal: { bg: RGB; c: [RGB, RGB, RGB] };
  ptr: [number, number];
  pv: [number, number];
  ptrOn: number;
  /** Zone del velo in pixel del canvas: [x0, y0, x1, y1] × 6 */
  Z: Float32Array;
  /** Attenuazione per zona (1 = nessuna) */
  Zk: Float32Array;
  /** Morbidezza del bordo del velo, in pixel */
  Zf: number;
  /** Centro delle orbite dei vortici (0–1), per comporre il campo intorno ai testi */
  focus?: [number, number];
  /** Raggio medio delle orbite */
  spread?: number;
}

export interface VortexField {
  resize(w: number, h: number): void;
  step(t: number, dt: number, p: VortexParams): void;
  render(p: VortexParams): void;
  dispose(): void;
}

type Prog = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };

const VQ = `#version 300 es
out vec2 uv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);uv=p;gl_Position=vec4(p*2.-1.,0.,1.);}`;

const NZ = `
float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec2 h22(vec2 p){float n=h21(p);return vec2(n,h21(p+n+17.17));}
float gn(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
 float a=dot(h22(i)*2.-1.,f),b=dot(h22(i+vec2(1,0))*2.-1.,f-vec2(1,0)),c=dot(h22(i+vec2(0,1))*2.-1.,f-vec2(0,1)),d=dot(h22(i+1.)*2.-1.,f-1.);
 return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){return gn(p)*.6+gn(p*2.03+7.1)*.28+gn(p*4.11-3.3)*.12;}
vec2 curl(vec2 p){float e=.02;return vec2(fbm(p+vec2(0,e))-fbm(p-vec2(0,e)),-(fbm(p+vec2(e,0))-fbm(p-vec2(e,0))))/(2.*e);}`;

const VEIL = `
uniform vec4 Z[6];uniform float Zk[6];uniform float Zf;
vec3 veil(vec3 c,vec3 bg){vec2 p=gl_FragCoord.xy;float m=1.;
 for(int i=0;i<6;i++){vec4 z=Z[i];vec2 d=max(max(z.xy-p,p-z.zw),0.);m=min(m,mix(1.,Zk[i],1.-smoothstep(0.,Zf,length(d))));}
 return bg+(c-bg)*m;}`;

const TONE = `vec3 tone(vec3 x,vec3 bg,float gain){vec3 t=1.-exp(-x*gain);return bg+t*(1.-bg*.6);}`;

const V_FIELD = `
uniform vec4 V[7];uniform float asp,turb,T,scl,seed;
vec2 field(vec2 p){vec2 v=vec2(0.);
 for(int i=0;i<7;i++){vec2 d=(p-V[i].xy)*vec2(asp,1.);float r2=dot(d,d)+V[i].w;v+=V[i].z*vec2(-d.y,d.x)/r2;}
 v+=curl(p*vec2(asp,1.)*1.8/scl+vec2(seed,T*.05))*turb*.25;return v;}`;

const V_STEP = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;uniform sampler2D S;uniform float dt,spd;
${NZ}${V_FIELD}
void main(){vec4 s=texture(S,uv);vec2 p=s.xy;float age=s.z,sd=s.w;
 vec2 v=field(p);float sp=length(v);v=v/max(1.,sp/1.5);
 p+=v*dt*spd*.3*vec2(1./asp,1.);age+=dt*spd;float life=4.+8.*fract(sd*7.13);
 if(age>life||p.x<-.02||p.x>1.02||p.y<-.02||p.y>1.02){p=vec2(h21(vec2(sd*91.7,T)),h21(vec2(T*1.3,sd*37.1)));age=0.;}
 o=vec4(p,age,sd);}`;

const V_DRAW_V = `#version 300 es
precision highp float;uniform sampler2D S;uniform int W;uniform float ps;uniform vec3 c1,c2,c3;out vec3 vc;
${NZ}${V_FIELD}
void main(){ivec2 ij=ivec2(gl_VertexID%W,gl_VertexID/W);vec4 s=texelFetch(S,ij,0);
 float sp=length(field(s.xy));float life=4.+8.*fract(s.w*7.13);float a=smoothstep(0.,.4,s.z)*smoothstep(life,life-.8,s.z)*(.02+.98*smoothstep(.12,.55,sp));
 vec3 c=mix(c2,c1,smoothstep(.06,.35,sp));c=mix(c,c3,smoothstep(.4,1.2,sp));
 vc=c*a;gl_Position=vec4(s.xy*2.-1.,0.,1.);gl_PointSize=ps;}`;

const V_DRAW_F = `#version 300 es
precision highp float;in vec3 vc;uniform float k;out vec4 o;void main(){vec2 c=gl_PointCoord-.5;o=vec4(vc*k*smoothstep(.5,.1,length(c)),0.);}`;

const V_FADE = `#version 300 es
precision highp float;in vec2 uv;uniform float d;out vec4 o;void main(){o=vec4(0.,0.,0.,d);}`;

const V_SHOW = `#version 300 es
precision highp float;in vec2 uv;out vec4 o;uniform sampler2D TR;uniform vec3 bg,c1,c2,c3;uniform float inten;
${TONE}${VEIL}
void main(){vec3 x=pow(texture(TR,uv).rgb,vec3(1.35));o=vec4(veil(tone(x,bg,1.1+inten*.6),bg),1.);}`;

function shader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const s = gl.createShader(type);
  if (!s) throw new Error("createShader");
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s) || "shader");
  return s;
}

function program(gl: WebGL2RenderingContext, vs: string, fs: string): Prog {
  const p = gl.createProgram();
  if (!p) throw new Error("createProgram");
  gl.attachShader(p, shader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, shader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(p) || "link");
  const u: Prog["u"] = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
  for (let i = 0; i < n; i++) {
    const a = gl.getActiveUniform(p, i);
    if (a) u[a.name.replace("[0]", "")] = gl.getUniformLocation(p, a.name);
  }
  return { p, u };
}

function texture(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  ifmt: number,
  type: number,
  data: ArrayBufferView | null,
  linear: boolean,
): WebGLTexture {
  const t = gl.createTexture();
  if (!t) throw new Error("createTexture");
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, ifmt, w, h, 0, gl.RGBA, type, data);
  const f = linear ? gl.LINEAR : gl.NEAREST;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

function framebuffer(
  gl: WebGL2RenderingContext,
  t: WebGLTexture,
): WebGLFramebuffer {
  const f = gl.createFramebuffer();
  if (!f) throw new Error("createFramebuffer");
  gl.bindFramebuffer(gl.FRAMEBUFFER, f);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    t,
    0,
  );
  return f;
}

/** Coppia ping-pong di texture/framebuffer */
function pingPong(
  gl: WebGL2RenderingContext,
  w: number,
  h: number,
  ifmt: number,
  type: number,
  linear: boolean,
  data: ArrayBufferView | null = null,
) {
  const t = [
    texture(gl, w, h, ifmt, type, data, linear),
    texture(gl, w, h, ifmt, type, data, linear),
  ];
  const f = [framebuffer(gl, t[0]), framebuffer(gl, t[1])];
  return {
    t,
    f,
    i: 0,
    get src() {
      return this.t[this.i];
    },
    get dst() {
      return this.f[1 - this.i];
    },
    swap() {
      this.i = 1 - this.i;
    },
    del() {
      t.forEach((x) => gl.deleteTexture(x));
      f.forEach((x) => gl.deleteFramebuffer(x));
    },
  };
}

function setPalette(gl: WebGL2RenderingContext, u: Prog["u"], p: VortexParams) {
  gl.uniform3fv(u.bg, p.pal.bg);
  gl.uniform3fv(u.c1, p.pal.c[0]);
  gl.uniform3fv(u.c2, p.pal.c[1]);
  gl.uniform3fv(u.c3, p.pal.c[2]);
}

function setVeil(gl: WebGL2RenderingContext, u: Prog["u"], p: VortexParams) {
  gl.uniform4fv(u.Z, p.Z);
  gl.uniform1fv(u.Zk, p.Zk);
  gl.uniform1f(u.Zf, p.Zf);
}

/** Lato della texture delle particelle in base alla qualità (256² · 200² · 140²) */
export function particleSide(quality: number): number {
  return quality >= 1 ? 256 : quality >= 0.75 ? 200 : 140;
}

/**
 * Crea il campo. Richiede WebGL2 con EXT_color_buffer_float (verificato dal
 * controller prima della chiamata). Lancia un errore se la compilazione fallisce:
 * il controller lo intercetta e mantiene l'immagine statica.
 */
export function createVortexField(
  gl: WebGL2RenderingContext,
  quality: number,
): VortexField {
  const W = particleSide(quality);
  const N = W * W;
  const pStep = program(gl, VQ, V_STEP);
  const pPts = program(gl, V_DRAW_V, V_DRAW_F);
  const pFade = program(gl, VQ, V_FADE);
  const pShow = program(gl, VQ, V_SHOW);
  const vao = gl.createVertexArray();

  const seedData = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    seedData[i * 4] = Math.random();
    seedData[i * 4 + 1] = Math.random();
    seedData[i * 4 + 2] = Math.random() * 5;
    seedData[i * 4 + 3] = Math.random();
  }
  const S = pingPong(gl, W, W, gl.RGBA32F, gl.FLOAT, false, seedData);
  let TR: ReturnType<typeof pingPong> | null = null;
  let w = 0;
  let h = 0;
  let tw = 0;
  let th = 0;
  let gain = 1;
  const seed = Math.random() * 50;
  const Vb = new Float32Array(28);

  function vortices(t: number, p: VortexParams) {
    const k = 0.55 * p.intensity;
    const [fx, fy] = p.focus ?? [0.5, 0.5];
    const spread = p.spread ?? 0.28;
    for (let i = 0; i < 6; i++) {
      const a = t * (0.07 + 0.025 * i) + i * 1.7 + seed;
      const r = spread + 0.08 * Math.sin(t * 0.13 + i);
      Vb[i * 4] = fx + r * Math.cos(a) * (i % 2 ? 1 : 0.8);
      Vb[i * 4 + 1] = fy + r * Math.sin(a * 1.13) * (i % 2 ? 0.8 : 1);
      Vb[i * 4 + 2] =
        (i % 2 ? 1 : -1) * k * (0.1 + 0.04 * Math.sin(t * 0.3 + i)) * p.scale;
      Vb[i * 4 + 3] = 0.0025 * p.scale * p.scale;
    }
    Vb[24] = p.ptr[0];
    Vb[25] = p.ptr[1];
    Vb[26] = p.ptrOn * 0.14 * (p.pv[0] >= 0 ? 1 : -1);
    Vb[27] = 0.003;
  }

  function common(u: Prog["u"], t: number, p: VortexParams) {
    gl.uniform4fv(u.V, Vb);
    gl.uniform1f(u.asp, w / h);
    gl.uniform1f(u.turb, p.turb);
    gl.uniform1f(u.T, t);
    gl.uniform1f(u.scl, p.scale);
    gl.uniform1f(u.seed, seed);
  }

  return {
    resize(Wd, Hd) {
      w = Wd;
      h = Hd;
      // Scie a risoluzione ridotta sui canvas grandi; deposito scalato per mantenere la densità.
      const r = Math.min(1, Math.sqrt(420000 / (w * h)));
      tw = Math.max(2, Math.round(w * r));
      th = Math.max(2, Math.round(h * r));
      gain = Math.min(6, Math.max(1, (0.5 * tw * th) / N));
      if (TR) TR.del();
      TR = pingPong(gl, tw, th, gl.RGBA16F, gl.HALF_FLOAT, true);
      TR.f.forEach((f) => {
        gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      });
    },

    step(t, dt, p) {
      if (!TR) return;
      vortices(t * p.speed, p);
      gl.bindVertexArray(vao);
      gl.disable(gl.BLEND);

      // 1. Avanzamento delle particelle
      gl.useProgram(pStep.p);
      gl.bindFramebuffer(gl.FRAMEBUFFER, S.dst);
      gl.viewport(0, 0, W, W);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, S.src);
      gl.uniform1i(pStep.u.S, 0);
      gl.uniform1f(pStep.u.dt, dt);
      gl.uniform1f(pStep.u.spd, p.speed);
      common(pStep.u, t, p);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      S.swap();

      // 2. Dissolvenza delle scie
      gl.bindFramebuffer(gl.FRAMEBUFFER, TR.f[TR.i]);
      gl.viewport(0, 0, tw, th);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ZERO, gl.SRC_ALPHA);
      gl.useProgram(pFade.p);
      gl.uniform1f(pFade.u.d, Math.pow(0.976, Math.max(0.2, p.speed)));
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // 3. Deposito additivo delle particelle
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.useProgram(pPts.p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, S.src);
      gl.uniform1i(pPts.u.S, 0);
      gl.uniform1i(pPts.u.W, W);
      gl.uniform1f(pPts.u.ps, Math.max(1, tw / 1600));
      gl.uniform1f(pPts.u.k, (0.09 * p.intensity + 0.03) * gain);
      common(pPts.u, t, p);
      setPalette(gl, pPts.u, p);
      gl.drawArrays(gl.POINTS, 0, N);
      gl.disable(gl.BLEND);
    },

    render(p) {
      if (!TR) return;
      gl.bindVertexArray(vao);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, w, h);
      gl.useProgram(pShow.p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, TR.t[TR.i]);
      gl.uniform1i(pShow.u.TR, 0);
      setPalette(gl, pShow.u, p);
      setVeil(gl, pShow.u, p);
      gl.uniform1f(pShow.u.inten, p.intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },

    dispose() {
      S.del();
      if (TR) TR.del();
      [pStep, pPts, pFade, pShow].forEach((x) => gl.deleteProgram(x.p));
      if (vao) gl.deleteVertexArray(vao);
    },
  };
}
