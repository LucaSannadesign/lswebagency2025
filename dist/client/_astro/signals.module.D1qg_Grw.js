import{l as w,x as oi,u as ni}from"./client.IsJxKKbc.js";var U,v,k,O,C=0,V=[],_=w,T=_.__b,j=_.__r,P=_.diffed,M=_.__c,z=_.unmount,B=_.__;function fi(t,i){_.__h&&_.__h(v,t,C||i),C=0;var r=v.__H||(v.__H={__:[],__h:[]});return t>=r.__.length&&r.__.push({}),r.__[t]}function D(t,i){var r=fi(U++,7);return _i(r.__H,i)&&(r.__=t(),r.__H=i,r.__h=t),r.__}function ei(){for(var t;t=V.shift();)if(t.__P&&t.__H)try{t.__H.__h.forEach(g),t.__H.__h.forEach(A),t.__H.__h=[]}catch(i){t.__H.__h=[],_.__e(i,t.__v)}}_.__b=function(t){v=null,T&&T(t)},_.__=function(t,i){t&&i.__k&&i.__k.__m&&(t.__m=i.__k.__m),B&&B(t,i)},_.__r=function(t){j&&j(t),U=0;var i=(v=t.__c).__H;i&&(k===v?(i.__h=[],v.__h=[],i.__.forEach(function(r){r.__N&&(r.__=r.__N),r.u=r.__N=void 0})):(i.__h.forEach(g),i.__h.forEach(A),i.__h=[],U=0)),k=v},_.diffed=function(t){P&&P(t);var i=t.__c;i&&i.__H&&(i.__H.__h.length&&(V.push(i)!==1&&O===_.requestAnimationFrame||((O=_.requestAnimationFrame)||ui)(ei)),i.__H.__.forEach(function(r){r.u&&(r.__H=r.u),r.u=void 0})),k=v=null},_.__c=function(t,i){i.some(function(r){try{r.__h.forEach(g),r.__h=r.__h.filter(function(o){return!o.__||A(o)})}catch(o){i.some(function(e){e.__h&&(e.__h=[])}),i=[],_.__e(o,r.__v)}}),M&&M(t,i)},_.unmount=function(t){z&&z(t);var i,r=t.__c;r&&r.__H&&(r.__H.__.forEach(function(o){try{g(o)}catch(e){i=e}}),r.__H=void 0,i&&_.__e(i,r.__v))};var G=typeof requestAnimationFrame=="function";function ui(t){var i,r=function(){clearTimeout(o),G&&cancelAnimationFrame(i),setTimeout(t)},o=setTimeout(r,100);G&&(i=requestAnimationFrame(r))}function g(t){var i=v,r=t.__c;typeof r=="function"&&(t.__c=void 0,r()),v=i}function A(t){var i=v;t.__c=t.__(),v=i}function _i(t,i){return!t||t.length!==i.length||i.some(function(r,o){return r!==t[o]})}var si=Symbol.for("preact-signals");function E(){if(d>1)d--;else{for(var t,i=!1;m!==void 0;){var r=m;for(m=void 0,q++;r!==void 0;){var o=r.o;if(r.o=void 0,r.f&=-3,!(8&r.f)&&L(r))try{r.c()}catch(e){i||(t=e,i=!0)}r=o}}if(q=0,d--,i)throw t}}function hi(t){if(d>0)return t();d++;try{return t()}finally{E()}}var n=void 0,m=void 0,d=0,q=0,x=0;function I(t){if(n!==void 0){var i=t.n;if(i===void 0||i.t!==n)return i={i:0,S:t,p:n.s,n:void 0,t:n,e:void 0,x:void 0,r:i},n.s!==void 0&&(n.s.n=i),n.s=i,t.n=i,32&n.f&&t.S(i),i;if(i.i===-1)return i.i=0,i.n!==void 0&&(i.n.p=i.p,i.p!==void 0&&(i.p.n=i.n),i.p=n.s,i.n=void 0,n.s.n=i,n.s=i),i}}function s(t){this.v=t,this.i=0,this.n=void 0,this.t=void 0}s.prototype.brand=si;s.prototype.h=function(){return!0};s.prototype.S=function(t){this.t!==t&&t.e===void 0&&(t.x=this.t,this.t!==void 0&&(this.t.e=t),this.t=t)};s.prototype.U=function(t){if(this.t!==void 0){var i=t.e,r=t.x;i!==void 0&&(i.x=r,t.e=void 0),r!==void 0&&(r.e=i,t.x=void 0),t===this.t&&(this.t=r)}};s.prototype.subscribe=function(t){var i=this;return S(function(){var r=i.value,o=n;n=void 0;try{t(r)}finally{n=o}})};s.prototype.valueOf=function(){return this.value};s.prototype.toString=function(){return this.value+""};s.prototype.toJSON=function(){return this.value};s.prototype.peek=function(){var t=n;n=void 0;try{return this.value}finally{n=t}};Object.defineProperty(s.prototype,"value",{get:function(){var t=I(this);return t!==void 0&&(t.i=this.i),this.v},set:function(t){if(t!==this.v){if(q>100)throw new Error("Cycle detected");this.v=t,this.i++,x++,d++;try{for(var i=this.t;i!==void 0;i=i.x)i.t.N()}finally{E()}}}});function K(t){return new s(t)}function L(t){for(var i=t.s;i!==void 0;i=i.n)if(i.S.i!==i.i||!i.S.h()||i.S.i!==i.i)return!0;return!1}function Q(t){for(var i=t.s;i!==void 0;i=i.n){var r=i.S.n;if(r!==void 0&&(i.r=r),i.S.n=i,i.i=-1,i.n===void 0){t.s=i;break}}}function R(t){for(var i=t.s,r=void 0;i!==void 0;){var o=i.p;i.i===-1?(i.S.U(i),o!==void 0&&(o.n=i.n),i.n!==void 0&&(i.n.p=o)):r=i,i.S.n=i.r,i.r!==void 0&&(i.r=void 0),i=o}t.s=r}function p(t){s.call(this,void 0),this.x=t,this.s=void 0,this.g=x-1,this.f=4}(p.prototype=new s).h=function(){if(this.f&=-3,1&this.f)return!1;if((36&this.f)==32||(this.f&=-5,this.g===x))return!0;if(this.g=x,this.f|=1,this.i>0&&!L(this))return this.f&=-2,!0;var t=n;try{Q(this),n=this;var i=this.x();(16&this.f||this.v!==i||this.i===0)&&(this.v=i,this.f&=-17,this.i++)}catch(r){this.v=r,this.f|=16,this.i++}return n=t,R(this),this.f&=-2,!0};p.prototype.S=function(t){if(this.t===void 0){this.f|=36;for(var i=this.s;i!==void 0;i=i.n)i.S.S(i)}s.prototype.S.call(this,t)};p.prototype.U=function(t){if(this.t!==void 0&&(s.prototype.U.call(this,t),this.t===void 0)){this.f&=-33;for(var i=this.s;i!==void 0;i=i.n)i.S.U(i)}};p.prototype.N=function(){if(!(2&this.f)){this.f|=6;for(var t=this.t;t!==void 0;t=t.x)t.t.N()}};Object.defineProperty(p.prototype,"value",{get:function(){if(1&this.f)throw new Error("Cycle detected");var t=I(this);if(this.h(),t!==void 0&&(t.i=this.i),16&this.f)throw this.v;return this.v}});function J(t){return new p(t)}function W(t){var i=t.u;if(t.u=void 0,typeof i=="function"){d++;var r=n;n=void 0;try{i()}catch(o){throw t.f&=-2,t.f|=8,F(t),o}finally{n=r,E()}}}function F(t){for(var i=t.s;i!==void 0;i=i.n)i.S.U(i);t.x=void 0,t.s=void 0,W(t)}function vi(t){if(n!==this)throw new Error("Out-of-order effect");R(this),n=t,this.f&=-2,8&this.f&&F(this),E()}function b(t){this.x=t,this.u=void 0,this.s=void 0,this.o=void 0,this.f=32}b.prototype.c=function(){var t=this.S();try{if(8&this.f||this.x===void 0)return;var i=this.x();typeof i=="function"&&(this.u=i)}finally{t()}};b.prototype.S=function(){if(1&this.f)throw new Error("Cycle detected");this.f|=1,this.f&=-9,W(this),Q(this),d++;var t=n;return n=this,vi.bind(this,t)};b.prototype.N=function(){2&this.f||(this.f|=2,this.o=m,m=this)};b.prototype.d=function(){this.f|=8,1&this.f||F(this)};function S(t){var i=new b(t);try{i.c()}catch(r){throw i.d(),r}return i.d.bind(i)}var X,N,Y=[];S(function(){X=this.N})();function l(t,i){w[t]=i.bind(null,w[t]||function(){})}function H(t){N&&N(),N=t&&t.S()}function Z(t){var i=this,r=t.data,o=ci(r);o.value=r;var e=D(function(){for(var h=i,a=i.__v;a=a.__;)if(a.__c){a.__c.__$f|=4;break}var c=J(function(){var $=o.value.value;return $===0?0:$===!0?"":$||""}),y=J(function(){return!ni(c.value)}),ti=S(function(){if(this.N=ii,y.value){var $=c.value;h.base&&h.base.nodeType===3&&(h.base.data=$)}}),ri=i.__$u.d;return i.__$u.d=function(){ti(),ri.call(this)},[y,c]},[]),f=e[0],u=e[1];return f.value?u.peek():u.value}Z.displayName="_st";Object.defineProperties(s.prototype,{constructor:{configurable:!0,value:void 0},type:{configurable:!0,value:Z},props:{configurable:!0,get:function(){return{data:this}}},__b:{configurable:!0,value:1}});l("__b",function(t,i){if(typeof i.type=="string"){var r,o=i.props;for(var e in o)if(e!=="children"){var f=o[e];f instanceof s&&(r||(i.__np=r={}),r[e]=f,o[e]=f.peek())}}t(i)});l("__r",function(t,i){H();var r,o=i.__c;o&&(o.__$f&=-2,(r=o.__$u)===void 0&&(o.__$u=r=function(e){var f;return S(function(){f=this}),f.c=function(){o.__$f|=1,o.setState({})},f}())),H(r),t(i)});l("__e",function(t,i,r,o){H(),t(i,r,o)});l("diffed",function(t,i){H();var r;if(typeof i.type=="string"&&(r=i.__e)){var o=i.__np,e=i.props;if(o){var f=r.U;if(f)for(var u in f){var h=f[u];h!==void 0&&!(u in o)&&(h.d(),f[u]=void 0)}else f={},r.U=f;for(var a in o){var c=f[a],y=o[a];c===void 0?(c=ai(r,a,y,e),f[a]=c):c.o(y,e)}}}t(i)});function ai(t,i,r,o){var e=i in t&&t.ownerSVGElement===void 0,f=K(r);return{o:function(u,h){f.value=u,o=h},d:S(function(){this.N=ii;var u=f.value.value;o[i]!==u&&(o[i]=u,e?t[i]=u:u?t.setAttribute(i,u):t.removeAttribute(i))})}}l("unmount",function(t,i){if(typeof i.type=="string"){var r=i.__e;if(r){var o=r.U;if(o){r.U=void 0;for(var e in o){var f=o[e];f&&f.d()}}}}else{var u=i.__c;if(u){var h=u.__$u;h&&(u.__$u=void 0,h.d())}}t(i)});l("__h",function(t,i,r,o){(o<3||o===9)&&(i.__$f|=2),t(i,r,o)});oi.prototype.shouldComponentUpdate=function(t,i){var r=this.__$u,o=r&&r.s!==void 0;for(var e in i)return!0;if(this.__f||typeof this.u=="boolean"&&this.u===!0){var f=2&this.__$f;if(!(o||f||4&this.__$f)||1&this.__$f)return!0}else if(!(o||4&this.__$f)||3&this.__$f)return!0;for(var u in t)if(u!=="__source"&&t[u]!==this.props[u])return!0;for(var h in this.props)if(!(h in t))return!0;return!1};function ci(t){return D(function(){return K(t)},[])}var di=function(t){queueMicrotask(function(){queueMicrotask(t)})};function pi(){hi(function(){for(var t;t=Y.shift();)X.call(t)})}function ii(){Y.push(this)===1&&(w.requestAnimationFrame||di)(pi)}export{s as Signal,hi as batch,J as computed,S as effect,K as signal,ci as useSignal};
