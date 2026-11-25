/** Animated Ion Flow. One canvas engine, four geometries, static fallback. */
const TAU=Math.PI*2;
const desktop=matchMedia('(min-width:1024px)');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const KEY='ls-c4-field-paused';
let cleanups:(()=>void)[]=[];
function mount(el:HTMLElement):()=>void{
  const canvas=el.querySelector<HTMLCanvasElement>('[data-c4-canvas]');
  const btn=el.querySelector<HTMLButtonElement>('[data-c4-pause]');
  const host=el.closest<HTMLElement>('.c3-phero');
  const ctx=canvas?.getContext('2d');
  if(!canvas||!btn||!host||!ctx)return()=>{};
  const ac=new AbortController(),sig={signal:ac.signal};
  const kind=el.dataset.c4Field;
  let w=0,h=0,t=0,last=0,raf=0,visible=false,paused=false,dark=true;
  let mx=0,my=0,px=0,py=0;
  try{paused=localStorage.getItem(KEY)==='1'}catch{}
  const enabled=()=>desktop.matches&&visible&&!document.hidden&&!reduced.matches&&!paused;
  const p=new Float64Array(3);
  function project(u:number,v:number){
    const a=u*TAU+t*.15;
    const wave=kind==='geometry'?4:kind==='sculpture'?2:3;
    const tube=.31+.085*Math.sin(a*2+t*.4);
    const twist=a*(kind==='geometry'?3:2.05)+v+t*.35;
    const r=1+.23*Math.sin(a*wave-t*.65);
    let x=(r+tube*Math.cos(twist))*Math.cos(a);
    let y=(r+tube*Math.cos(twist))*Math.sin(a);
    let z=tube*Math.sin(twist)+.38*Math.sin(a*2+t*.3);
    if(kind==='flow'){x*=1.32;y*=.67;z+=.18*Math.cos(a*3)}
    if(kind==='sculpture'){y*=1.15;z*=1.25}
    const rot=-.55+t*.09,tilt=.95+.18*Math.sin(t*.25);
    const X=x*Math.cos(rot)-z*Math.sin(rot);
    let Z=x*Math.sin(rot)+z*Math.cos(rot);
    const Y=y*Math.cos(tilt)-Z*Math.sin(tilt);
    Z=y*Math.sin(tilt)+Z*Math.cos(tilt);
    const s=Math.min(w*.30,h*.44),q=4.5/(4.5-Z);
    p[0]=w*.64+px*40+X*s*q*1.35;p[1]=h*.44+py*24+Y*s*q;p[2]=q;
  }
  function draw(){
    if(!w||!h||!desktop.matches||!ctx)return;
    dark=document.documentElement.dataset.lsTheme!=='light';
    ctx.clearRect(0,0,w,h);
    const glow=ctx.createRadialGradient(w*.65,h*.42,0,w*.65,h*.42,Math.max(w,h)*.48);
    glow.addColorStop(0,dark?'rgba(51,172,151,.25)':'rgba(79,168,155,.20)');
    glow.addColorStop(1,'rgba(79,168,155,0)');
    ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    ctx.save();ctx.globalCompositeOperation=dark?'screen':'multiply';
    for(let i=0;i<60;i++){
      const v=i/60*TAU,k=i/60,bright=i%8===0;
      ctx.beginPath();
      for(let j=0;j<=112;j++){project(j/112,v);if(j===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1])}
      const a=bright?.72:.18+.13*Math.sin(v)**2;
      ctx.strokeStyle=dark?'rgba('+Math.round(55+100*k)+','+Math.round(145+83*k)+','+Math.round(128+72*k)+','+a+')':'rgba(31,90,84,'+a+')';
      ctx.lineWidth=bright?1.35:.72;ctx.stroke();
    }
    for(let i=0;i<82;i++){
      project((i*.6180339887+t*(.016+(i%5)*.003))%1,i*2.399963);
      const a=.25+.6*(.5+.5*Math.sin(i*8.1+t*.75));
      ctx.fillStyle=dark?'rgba(190,255,240,'+a+')':'rgba(19,97,85,'+a+')';
      ctx.beginPath();ctx.arc(p[0],p[1],(i%13===0?2.2:.9)*p[2],0,TAU);ctx.fill();
    }
    ctx.restore();el.classList.add('is-drawn');
  }
  function resize(){
    if(!canvas||!ctx)return;
    const r=el.getBoundingClientRect();w=r.width;h=r.height;
    if(!desktop.matches||!w||!h)return;
    const d=Math.min(devicePixelRatio||1,1.5);
    canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);ctx.setTransform(d,0,0,d,0,0);draw();
  }
  function frame(now:number){
    raf=0;if(!enabled())return;
    if(!last||now-last>=32){t+=last?Math.min((now-last)/1000,.08):0;last=now;px+=(mx-px)*.075;py+=(my-py)*.075;draw()}
    raf=requestAnimationFrame(frame);
  }
  function sync(){
    if(btn){btn.hidden=!desktop.matches||reduced.matches;btn.setAttribute('aria-pressed',String(paused));btn.setAttribute('aria-label',paused?'Riprendi animazione della testata':'Pausa animazione della testata');btn.title=paused?'Riprendi animazione':'Pausa animazione'}
    if(enabled()){if(!raf){last=0;raf=requestAnimationFrame(frame)}}else if(raf){cancelAnimationFrame(raf);raf=0}
  }
  btn.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem(KEY,paused?'1':'0')}catch{}sync()},sig);
  host.addEventListener('pointermove',e=>{if(!enabled())return;const r=host.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5},sig);
  host.addEventListener('pointerleave',()=>{mx=0;my=0},sig);
  document.addEventListener('visibilitychange',sync,sig);
  desktop.addEventListener('change',()=>{resize();sync()},sig);reduced.addEventListener('change',sync,sig);
  const ro=new ResizeObserver(resize);ro.observe(el);
  const io=new IntersectionObserver(es=>{visible=es[0]?.isIntersecting??false;sync()});io.observe(el);
  const mo=new MutationObserver(draw);mo.observe(document.documentElement,{attributes:true,attributeFilter:['data-ls-theme']});
  resize();sync();
  return()=>{ac.abort();ro.disconnect();io.disconnect();mo.disconnect();if(raf)cancelAnimationFrame(raf)};
}
function destroy(){cleanups.forEach(fn=>fn());cleanups=[]}
function boot(){destroy();cleanups=Array.from(document.querySelectorAll<HTMLElement>('[data-c4-field]')).map(mount)}
document.addEventListener('astro:page-load',boot);
document.addEventListener('astro:before-swap',destroy);
