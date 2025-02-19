var U=Object.defineProperty,R=Object.defineProperties;var Y=Object.getOwnPropertyDescriptors;var T=Object.getOwnPropertySymbols;var Z=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable;var M=(t,e,a)=>e in t?U(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a,l=(t,e)=>{for(var a in e||(e={}))Z.call(e,a)&&M(t,a,e[a]);if(T)for(var a of T(e))q.call(e,a)&&M(t,a,e[a]);return t},m=(t,e)=>R(t,Y(e));import{r as p}from"./main-c668a994.js";let B={data:""},G=t=>typeof window=="object"?((t?t.querySelector("#_goober"):window._goober)||Object.assign((t||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:t||B,J=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Q=/\/\*[^]*?\*\/|  +/g,F=/\n+/g,x=(t,e)=>{let a="",s="",o="";for(let r in t){let n=t[r];r[0]=="@"?r[1]=="i"?a=r+" "+n+";":s+=r[1]=="f"?x(n,r):r+"{"+x(n,r[1]=="k"?"":e)+"}":typeof n=="object"?s+=x(n,e?e.replace(/([^,])+/g,i=>r.replace(/(^:.*)|([^,])+/g,d=>/&/.test(d)?d.replace(/&/g,i):i?i+" "+d:d)):r):n!=null&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=x.p?x.p(r,n):r+":"+n+";")}return a+(e&&o?e+"{"+o+"}":o)+s},b={},_=t=>{if(typeof t=="object"){let e="";for(let a in t)e+=a+_(t[a]);return e}return t},V=(t,e,a,s,o)=>{let r=_(t),n=b[r]||(b[r]=(d=>{let c=0,u=11;for(;c<d.length;)u=101*u+d.charCodeAt(c++)>>>0;return"go"+u})(r));if(!b[n]){let d=r!==t?t:(c=>{let u,y,g=[{}];for(;u=J.exec(c.replace(Q,""));)u[4]?g.shift():u[3]?(y=u[3].replace(F," ").trim(),g.unshift(g[0][y]=g[0][y]||{})):g[0][u[1]]=u[2].replace(F," ").trim();return g[0]})(t);b[n]=x(o?{["@keyframes "+n]:d}:d,a?"":"."+n)}let i=a&&b.g?b.g:null;return a&&(b.g=b[n]),((d,c,u,y)=>{y?c.data=c.data.replace(y,d):c.data.indexOf(d)===-1&&(c.data=u?d+c.data:c.data+d)})(b[n],e,s,i),n},W=(t,e,a)=>t.reduce((s,o,r)=>{let n=e[r];if(n&&n.call){let i=n(a),d=i&&i.props&&i.props.className||/^go/.test(i)&&i;n=d?"."+d:i&&typeof i=="object"?i.props?"":x(i,""):i===!1?"":i}return s+o+(n==null?"":n)},"");function I(t){let e=this||{},a=t.call?t(e.p):t;return V(a.unshift?a.raw?W(a,[].slice.call(arguments,1),e.p):a.reduce((s,o)=>Object.assign(s,o&&o.call?o(e.p):o),{}):a,G(e.target),e.g,e.o,e.k)}let H,z,D;I.bind({g:1});let v=I.bind({k:1});function X(t,e,a,s){x.p=e,H=t,z=a,D=s}function w(t,e){let a=this||{};return function(){let s=arguments;function o(r,n){let i=Object.assign({},r),d=i.className||o.className;a.p=Object.assign({theme:z&&z()},i),a.o=/ *go\d+/.test(d),i.className=I.apply(a,s)+(d?" "+d:""),e&&(i.ref=n);let c=t;return t[0]&&(c=i.as||t,delete i.as),D&&c[0]&&D(i),H(c,i)}return e?e(o):o}}var K=t=>typeof t=="function",C=(t,e)=>K(t)?t(e):t,tt=(()=>{let t=0;return()=>(++t).toString()})(),L=(()=>{let t;return()=>{if(t===void 0&&typeof window<"u"){let e=matchMedia("(prefers-reduced-motion: reduce)");t=!e||e.matches}return t}})(),et=20,O=new Map,at=1e3,S=t=>{if(O.has(t))return;let e=setTimeout(()=>{O.delete(t),E({type:4,toastId:t})},at);O.set(t,e)},rt=t=>{let e=O.get(t);e&&clearTimeout(e)},P=(t,e)=>{switch(e.type){case 0:return m(l({},t),{toasts:[e.toast,...t.toasts].slice(0,et)});case 1:return e.toast.id&&rt(e.toast.id),m(l({},t),{toasts:t.toasts.map(r=>r.id===e.toast.id?l(l({},r),e.toast):r)});case 2:let{toast:a}=e;return t.toasts.find(r=>r.id===a.id)?P(t,{type:1,toast:a}):P(t,{type:0,toast:a});case 3:let{toastId:s}=e;return s?S(s):t.toasts.forEach(r=>{S(r.id)}),m(l({},t),{toasts:t.toasts.map(r=>r.id===s||s===void 0?m(l({},r),{visible:!1}):r)});case 4:return e.toastId===void 0?m(l({},t),{toasts:[]}):m(l({},t),{toasts:t.toasts.filter(r=>r.id!==e.toastId)});case 5:return m(l({},t),{pausedAt:e.time});case 6:let o=e.time-(t.pausedAt||0);return m(l({},t),{pausedAt:void 0,toasts:t.toasts.map(r=>m(l({},r),{pauseDuration:r.pauseDuration+o}))})}},j=[],A={toasts:[],pausedAt:void 0},E=t=>{A=P(A,t),j.forEach(e=>{e(A)})},ot={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},st=(t={})=>{let[e,a]=p.useState(A);p.useEffect(()=>(j.push(a),()=>{let o=j.indexOf(a);o>-1&&j.splice(o,1)}),[e]);let s=e.toasts.map(o=>{var r,n;return m(l(l(l({},t),t[o.type]),o),{duration:o.duration||((r=t[o.type])==null?void 0:r.duration)||(t==null?void 0:t.duration)||ot[o.type],style:l(l(l({},t.style),(n=t[o.type])==null?void 0:n.style),o.style)})});return m(l({},e),{toasts:s})},it=(t,e="blank",a)=>m(l({createdAt:Date.now(),visible:!0,type:e,ariaProps:{role:"status","aria-live":"polite"},message:t,pauseDuration:0},a),{id:(a==null?void 0:a.id)||tt()}),$=t=>(e,a)=>{let s=it(e,t,a);return E({type:2,toast:s}),s.id},f=(t,e)=>$("blank")(t,e);f.error=$("error");f.success=$("success");f.loading=$("loading");f.custom=$("custom");f.dismiss=t=>{E({type:3,toastId:t})};f.remove=t=>E({type:4,toastId:t});f.promise=(t,e,a)=>{let s=f.loading(e.loading,l(l({},a),a==null?void 0:a.loading));return t.then(o=>(f.success(C(e.success,o),l(l({id:s},a),a==null?void 0:a.success)),o)).catch(o=>{f.error(C(e.error,o),l(l({id:s},a),a==null?void 0:a.error))}),t};var nt=(t,e)=>{E({type:1,toast:{id:t,height:e}})},lt=()=>{E({type:5,time:Date.now()})},dt=t=>{let{toasts:e,pausedAt:a}=st(t);p.useEffect(()=>{if(a)return;let r=Date.now(),n=e.map(i=>{if(i.duration===1/0)return;let d=(i.duration||0)+i.pauseDuration-(r-i.createdAt);if(d<0){i.visible&&f.dismiss(i.id);return}return setTimeout(()=>f.dismiss(i.id),d)});return()=>{n.forEach(i=>i&&clearTimeout(i))}},[e,a]);let s=p.useCallback(()=>{a&&E({type:6,time:Date.now()})},[a]),o=p.useCallback((r,n)=>{let{reverseOrder:i=!1,gutter:d=8,defaultPosition:c}=n||{},u=e.filter(h=>(h.position||c)===(r.position||c)&&h.height),y=u.findIndex(h=>h.id===r.id),g=u.filter((h,N)=>N<y&&h.visible).length;return u.filter(h=>h.visible).slice(...i?[g+1]:[0,g]).reduce((h,N)=>h+(N.height||0)+d,0)},[e]);return{toasts:e,handlers:{updateHeight:nt,startPause:lt,endPause:s,calculateOffset:o}}},ct=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,pt=v`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ut=v`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,mt=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ct} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${pt} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${t=>t.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ut} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,ft=v`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,gt=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${t=>t.secondary||"#e0e0e0"};
  border-right-color: ${t=>t.primary||"#616161"};
  animation: ${ft} 1s linear infinite;
`,yt=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ht=v`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,bt=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${t=>t.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${yt} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ht} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${t=>t.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,vt=w("div")`
  position: absolute;
`,xt=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,wt=v`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Et=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${wt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,$t=({toast:t})=>{let{icon:e,type:a,iconTheme:s}=t;return e!==void 0?typeof e=="string"?p.createElement(Et,null,e):e:a==="blank"?null:p.createElement(xt,null,p.createElement(gt,l({},s)),a!=="loading"&&p.createElement(vt,null,a==="error"?p.createElement(mt,l({},s)):p.createElement(bt,l({},s))))},kt=t=>`
0% {transform: translate3d(0,${t*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Ot=t=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${t*-150}%,-1px) scale(.6); opacity:0;}
`,jt="0%{opacity:0;} 100%{opacity:1;}",At="0%{opacity:1;} 100%{opacity:0;}",Ct=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,It=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Nt=(t,e)=>{let a=t.includes("top")?1:-1,[s,o]=L()?[jt,At]:[kt(a),Ot(a)];return{animation:e?`${v(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${v(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},zt=p.memo(({toast:t,position:e,style:a,children:s})=>{let o=t.height?Nt(t.position||e||"top-center",t.visible):{opacity:0},r=p.createElement($t,{toast:t}),n=p.createElement(It,l({},t.ariaProps),C(t.message,t));return p.createElement(Ct,{className:t.className,style:l(l(l({},o),a),t.style)},typeof s=="function"?s({icon:r,message:n}):p.createElement(p.Fragment,null,r,n))});X(p.createElement);var Dt=({id:t,className:e,style:a,onHeightUpdate:s,children:o})=>{let r=p.useCallback(n=>{if(n){let i=()=>{let d=n.getBoundingClientRect().height;s(t,d)};i(),new MutationObserver(i).observe(n,{subtree:!0,childList:!0,characterData:!0})}},[t,s]);return p.createElement("div",{ref:r,className:e,style:a},o)},Pt=(t,e)=>{let a=t.includes("top"),s=a?{top:0}:{bottom:0},o=t.includes("center")?{justifyContent:"center"}:t.includes("right")?{justifyContent:"flex-end"}:{};return l(l({left:0,right:0,display:"flex",position:"absolute",transition:L()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${e*(a?1:-1)}px)`},s),o)},Tt=I`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,k=16,St=({reverseOrder:t,position:e="top-center",toastOptions:a,gutter:s,children:o,containerStyle:r,containerClassName:n})=>{let{toasts:i,handlers:d}=dt(a);return p.createElement("div",{style:l({position:"fixed",zIndex:9999,top:k,left:k,right:k,bottom:k,pointerEvents:"none"},r),className:n,onMouseEnter:d.startPause,onMouseLeave:d.endPause},i.map(c=>{let u=c.position||e,y=d.calculateOffset(c,{reverseOrder:t,gutter:s,defaultPosition:e}),g=Pt(u,y);return p.createElement(Dt,{id:c.id,key:c.id,onHeightUpdate:d.updateHeight,className:c.visible?Tt:"",style:g},c.type==="custom"?C(c.message,c):o?o(c):p.createElement(zt,{toast:c,position:u}))}))},_t=f;export{St as I,_t as _,f as n};
