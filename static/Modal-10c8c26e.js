var vt=Object.defineProperty,yt=Object.defineProperties;var Rt=Object.getOwnPropertyDescriptors;var le=Object.getOwnPropertySymbols;var De=Object.prototype.hasOwnProperty,Fe=Object.prototype.propertyIsEnumerable;var Be=(e,t,n)=>t in e?vt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,E=(e,t)=>{for(var n in t||(t={}))De.call(t,n)&&Be(e,n,t[n]);if(le)for(var n of le(t))Fe.call(t,n)&&Be(e,n,t[n]);return e},R=(e,t)=>yt(e,Rt(t));var w=(e,t)=>{var n={};for(var r in e)De.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&le)for(var r of le(e))t.indexOf(r)<0&&Fe.call(e,r)&&(n[r]=e[r]);return n};import{g as Tt,r as a,c as Ve,R as $e,j as u}from"./main-4a381f5d.js";import{T as xt,E as wt,a as Ct,b as bt,r as Mt}from"./removeClass-a5cfacea.js";import{P as Re}from"./index-a4b15175.js";var ze={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/(function(e){(function(){var t={}.hasOwnProperty;function n(){for(var o="",i=0;i<arguments.length;i++){var c=arguments[i];c&&(o=s(o,r(c)))}return o}function r(o){if(typeof o=="string"||typeof o=="number")return o;if(typeof o!="object")return"";if(Array.isArray(o))return n.apply(null,o);if(o.toString!==Object.prototype.toString&&!o.toString.toString().includes("[native code]"))return o.toString();var i="";for(var c in o)t.call(o,c)&&o[c]&&(i=s(i,c));return i}function s(o,i){return i?o?o+" "+i:o+i:o}e.exports?(n.default=n,e.exports=n):window.classNames=n})()})(ze);var kt=ze.exports;const C=Tt(kt),Ot=["xxl","xl","lg","md","sm","xs"],Nt="xs",Xe=a.createContext({prefixes:{},breakpoints:Ot,minBreakpoint:Nt});function P(e,t){const{prefixes:n}=a.useContext(Xe);return e||n[t]||t}function jt(){const{dir:e}=a.useContext(Xe);return e==="rtl"}function me(e){return e&&e.ownerDocument||document}function St(e){var t=me(e);return t&&t.defaultView||window}function At(e,t){return St(e).getComputedStyle(e,t)}var Lt=/([A-Z])/g;function Bt(e){return e.replace(Lt,"-$1").toLowerCase()}var Dt=/^ms-/;function ue(e){return Bt(e).replace(Dt,"-ms-")}var Ft=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;function $t(e){return!!(e&&Ft.test(e))}function W(e,t){var n="",r="";if(typeof t=="string")return e.style.getPropertyValue(ue(t))||At(e).getPropertyValue(ue(t));Object.keys(t).forEach(function(s){var o=t[s];!o&&o!==0?e.style.removeProperty(ue(s)):$t(s)?r+=s+"("+o+") ":n+=ue(s)+": "+o+";"}),r&&(n+="transform: "+r+";"),e.style.cssText+=";"+n}const Y=!!(typeof window!="undefined"&&window.document&&window.document.createElement);var Me=!1,ke=!1;try{var Te={get passive(){return Me=!0},get once(){return ke=Me=!0}};Y&&(window.addEventListener("test",Te,Te),window.removeEventListener("test",Te,!0))}catch(e){}function Pe(e,t,n,r){if(r&&typeof r!="boolean"&&!ke){var s=r.once,o=r.capture,i=n;!ke&&s&&(i=n.__once||function c(f){this.removeEventListener(t,c,o),n.call(this,f)},n.__once=i),e.addEventListener(t,i,Me?r:o)}e.addEventListener(t,n,r)}function Oe(e,t,n,r){var s=r&&typeof r!="boolean"?r.capture:r;e.removeEventListener(t,n,s),n.__once&&e.removeEventListener(t,n.__once,s)}function fe(e,t,n,r){return Pe(e,t,n,r),function(){Oe(e,t,n,r)}}function It(e,t,n,r){if(n===void 0&&(n=!1),r===void 0&&(r=!0),e){var s=document.createEvent("HTMLEvents");s.initEvent(t,n,r),e.dispatchEvent(s)}}function Wt(e){var t=W(e,"transitionDuration")||"",n=t.indexOf("ms")===-1?1e3:1;return parseFloat(t)*n}function _t(e,t,n){n===void 0&&(n=5);var r=!1,s=setTimeout(function(){r||It(e,"transitionend",!0)},t+n),o=fe(e,"transitionend",function(){r=!0},{once:!0});return function(){clearTimeout(s),o()}}function Ye(e,t,n,r){n==null&&(n=Wt(e)||0);var s=_t(e,n,r),o=fe(e,"transitionend",t);return function(){s(),o()}}function Ie(e,t){const n=W(e,t)||"",r=n.indexOf("ms")===-1?1e3:1;return parseFloat(n)*r}function Ht(e,t){const n=Ie(e,"transitionDuration"),r=Ie(e,"transitionDelay"),s=Ye(e,o=>{o.target===e&&(s(),t(o))},n+r)}function Kt(e){e.offsetHeight}const We=e=>!e||typeof e=="function"?e:t=>{e.current=t};function Ut(e,t){const n=We(e),r=We(t);return s=>{n&&n(s),r&&r(s)}}function re(e,t){return a.useMemo(()=>Ut(e,t),[e,t])}function Gt(e){return e&&"setState"in e?Ve.findDOMNode(e):e!=null?e:null}const Vt=$e.forwardRef((v,h)=>{var g=v,{onEnter:e,onEntering:t,onEntered:n,onExit:r,onExiting:s,onExited:o,addEndListener:i,children:c,childRef:f}=g,d=w(g,["onEnter","onEntering","onEntered","onExit","onExiting","onExited","addEndListener","children","childRef"]);const y=a.useRef(null),D=re(y,f),O=x=>{D(Gt(x))},T=x=>$=>{x&&y.current&&x(y.current,$)},b=a.useCallback(T(e),[e]),F=a.useCallback(T(t),[t]),S=a.useCallback(T(n),[n]),M=a.useCallback(T(r),[r]),N=a.useCallback(T(s),[s]),q=a.useCallback(T(o),[o]),_=a.useCallback(T(i),[i]);return u.jsx(xt,R(E({ref:h},d),{onEnter:b,onEntered:S,onEntering:F,onExit:M,onExited:q,onExiting:N,addEndListener:_,nodeRef:y,children:typeof c=="function"?(x,$)=>c(x,R(E({},$),{ref:O})):$e.cloneElement(c,{ref:O})}))}),zt=Vt;function Xt(e){const t=a.useRef(e);return a.useEffect(()=>{t.current=e},[e]),t}function k(e){const t=Xt(e);return a.useCallback(function(...n){return t.current&&t.current(...n)},[t])}const Pt=e=>a.forwardRef((t,n)=>u.jsx("div",R(E({},t),{ref:n,className:C(t.className,e)})));function Yt(){return a.useState(null)}function qt(){const e=a.useRef(!0),t=a.useRef(()=>e.current);return a.useEffect(()=>(e.current=!0,()=>{e.current=!1}),[]),t.current}function Zt(e){const t=a.useRef(null);return a.useEffect(()=>{t.current=e}),t.current}const Jt=typeof global!="undefined"&&global.navigator&&global.navigator.product==="ReactNative",Qt=typeof document!="undefined",_e=Qt||Jt?a.useLayoutEffect:a.useEffect,en={[wt]:"show",[Ct]:"show"},qe=a.forwardRef((i,o)=>{var c=i,{className:e,children:t,transitionClasses:n={},onEnter:r}=c,s=w(c,["className","children","transitionClasses","onEnter"]);const f=E({in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1},s),d=a.useCallback((h,v)=>{Kt(h),r==null||r(h,v)},[r]);return u.jsx(zt,R(E({ref:o,addEndListener:Ht},f),{onEnter:d,childRef:t.ref,children:(h,v)=>a.cloneElement(t,R(E({},v),{className:C("fade",e,t.props.className,en[h],n[h])}))}))});qe.displayName="Fade";const Ze=qe,tn={"aria-label":Re.string,onClick:Re.func,variant:Re.oneOf(["white"])},Ne=a.forwardRef((o,s)=>{var i=o,{className:e,variant:t,"aria-label":n="Close"}=i,r=w(i,["className","variant","aria-label"]);return u.jsx("button",E({ref:s,type:"button",className:C("btn-close",t&&`btn-close-${t}`,e),"aria-label":n},r))});Ne.displayName="CloseButton";Ne.propTypes=tn;const nn=Ne;function rn(e){const t=a.useRef(e);return t.current=e,t}function Je(e){const t=rn(e);a.useEffect(()=>()=>t.current(),[])}var on=Function.prototype.bind.call(Function.prototype.call,[].slice);function z(e,t){return on(e.querySelectorAll(t))}function He(e,t){if(e.contains)return e.contains(t);if(e.compareDocumentPosition)return e===t||!!(e.compareDocumentPosition(t)&16)}const sn="data-rr-ui-";function an(e){return`${sn}${e}`}const Qe=a.createContext(Y?window:void 0);Qe.Provider;function je(){return a.useContext(Qe)}var de;function Ke(e){if((!de&&de!==0||e)&&Y){var t=document.createElement("div");t.style.position="absolute",t.style.top="-9999px",t.style.width="50px",t.style.height="50px",t.style.overflow="scroll",document.body.appendChild(t),de=t.offsetWidth-t.clientWidth,document.body.removeChild(t)}return de}function xe(e){e===void 0&&(e=me());try{var t=e.activeElement;return!t||!t.nodeName?null:t}catch(n){return e.body}}function cn(e=document){const t=e.defaultView;return Math.abs(t.innerWidth-e.documentElement.clientWidth)}const Ue=an("modal-open");class ln{constructor({ownerDocument:t,handleContainerOverflow:n=!0,isRTL:r=!1}={}){this.handleContainerOverflow=n,this.isRTL=r,this.modals=[],this.ownerDocument=t}getScrollbarWidth(){return cn(this.ownerDocument)}getElement(){return(this.ownerDocument||document).body}setModalAttributes(t){}removeModalAttributes(t){}setContainerStyle(t){const n={overflow:"hidden"},r=this.isRTL?"paddingLeft":"paddingRight",s=this.getElement();t.style={overflow:s.style.overflow,[r]:s.style[r]},t.scrollBarWidth&&(n[r]=`${parseInt(W(s,r)||"0",10)+t.scrollBarWidth}px`),s.setAttribute(Ue,""),W(s,n)}reset(){[...this.modals].forEach(t=>this.remove(t))}removeContainerStyle(t){const n=this.getElement();n.removeAttribute(Ue),Object.assign(n.style,t.style)}add(t){let n=this.modals.indexOf(t);return n!==-1||(n=this.modals.length,this.modals.push(t),this.setModalAttributes(t),n!==0)||(this.state={scrollBarWidth:this.getScrollbarWidth(),style:{}},this.handleContainerOverflow&&this.setContainerStyle(this.state)),n}remove(t){const n=this.modals.indexOf(t);n!==-1&&(this.modals.splice(n,1),!this.modals.length&&this.handleContainerOverflow&&this.removeContainerStyle(this.state),this.removeModalAttributes(t))}isTopModal(t){return!!this.modals.length&&this.modals[this.modals.length-1]===t}}const Se=ln,we=(e,t)=>Y?e==null?(t||me()).body:(typeof e=="function"&&(e=e()),e&&"current"in e&&(e=e.current),e&&("nodeType"in e||e.getBoundingClientRect)?e:null):null;function un(e,t){const n=je(),[r,s]=a.useState(()=>we(e,n==null?void 0:n.document));if(!r){const o=we(e);o&&s(o)}return a.useEffect(()=>{t&&r&&t(r)},[t,r]),a.useEffect(()=>{const o=we(e);o!==r&&s(o)},[e,r]),r}function dn({children:e,in:t,onExited:n,mountOnEnter:r,unmountOnExit:s}){const o=a.useRef(null),i=a.useRef(t),c=k(n);a.useEffect(()=>{t?i.current=!0:c(o.current)},[t,c]);const f=re(o,e.ref),d=a.cloneElement(e,{ref:f});return t?d:s||!i.current&&r?null:d}const fn=["onEnter","onEntering","onEntered","onExit","onExiting","onExited","addEndListener","children"];function mn(e,t){if(e==null)return{};var n={},r=Object.keys(e),s,o;for(o=0;o<r.length;o++)s=r[o],!(t.indexOf(s)>=0)&&(n[s]=e[s]);return n}function hn(e){let{onEnter:t,onEntering:n,onEntered:r,onExit:s,onExiting:o,onExited:i,addEndListener:c,children:f}=e,d=mn(e,fn);const h=a.useRef(null),v=re(h,typeof f=="function"?null:f.ref),g=M=>N=>{M&&h.current&&M(h.current,N)},y=a.useCallback(g(t),[t]),D=a.useCallback(g(n),[n]),O=a.useCallback(g(r),[r]),T=a.useCallback(g(s),[s]),b=a.useCallback(g(o),[o]),F=a.useCallback(g(i),[i]),S=a.useCallback(g(c),[c]);return Object.assign({},d,{nodeRef:h},t&&{onEnter:y},n&&{onEntering:D},r&&{onEntered:O},s&&{onExit:T},o&&{onExiting:b},i&&{onExited:F},c&&{addEndListener:S},{children:typeof f=="function"?(M,N)=>f(M,Object.assign({},N,{ref:v})):a.cloneElement(f,{ref:v})})}const gn=["component"];function En(e,t){if(e==null)return{};var n={},r=Object.keys(e),s,o;for(o=0;o<r.length;o++)s=r[o],!(t.indexOf(s)>=0)&&(n[s]=e[s]);return n}const pn=a.forwardRef((e,t)=>{let{component:n}=e,r=En(e,gn);const s=hn(r);return u.jsx(n,Object.assign({ref:t},s))}),vn=pn;function yn({in:e,onTransition:t}){const n=a.useRef(null),r=a.useRef(!0),s=k(t);return _e(()=>{if(!n.current)return;let o=!1;return s({in:e,element:n.current,initial:r.current,isStale:()=>o}),()=>{o=!0}},[e,s]),_e(()=>(r.current=!1,()=>{r.current=!0}),[]),n}function Rn({children:e,in:t,onExited:n,onEntered:r,transition:s}){const[o,i]=a.useState(!t);t&&o&&i(!1);const c=yn({in:!!t,onTransition:d=>{const h=()=>{d.isStale()||(d.in?r==null||r(d.element,d.initial):(i(!0),n==null||n(d.element)))};Promise.resolve(s(d)).then(h,v=>{throw d.in||i(!0),v})}}),f=re(c,e.ref);return o&&!t?null:a.cloneElement(e,{ref:f})}function Ge(e,t,n){return e?u.jsx(vn,Object.assign({},n,{component:e})):t?u.jsx(Rn,Object.assign({},n,{transition:t})):u.jsx(dn,Object.assign({},n))}function Tn(e){return e.code==="Escape"||e.keyCode===27}const xn=["show","role","className","style","children","backdrop","keyboard","onBackdropClick","onEscapeKeyDown","transition","runTransition","backdropTransition","runBackdropTransition","autoFocus","enforceFocus","restoreFocus","restoreFocusOptions","renderDialog","renderBackdrop","manager","container","onShow","onHide","onExit","onExited","onExiting","onEnter","onEntering","onEntered"];function wn(e,t){if(e==null)return{};var n={},r=Object.keys(e),s,o;for(o=0;o<r.length;o++)s=r[o],!(t.indexOf(s)>=0)&&(n[s]=e[s]);return n}let Ce;function Cn(e){return Ce||(Ce=new Se({ownerDocument:e==null?void 0:e.document})),Ce}function bn(e){const t=je(),n=e||Cn(t),r=a.useRef({dialog:null,backdrop:null});return Object.assign(r.current,{add:()=>n.add(r.current),remove:()=>n.remove(r.current),isTopModal:()=>n.isTopModal(r.current),setDialogRef:a.useCallback(s=>{r.current.dialog=s},[]),setBackdropRef:a.useCallback(s=>{r.current.backdrop=s},[])})}const et=a.forwardRef((e,t)=>{let{show:n=!1,role:r="dialog",className:s,style:o,children:i,backdrop:c=!0,keyboard:f=!0,onBackdropClick:d,onEscapeKeyDown:h,transition:v,runTransition:g,backdropTransition:y,runBackdropTransition:D,autoFocus:O=!0,enforceFocus:T=!0,restoreFocus:b=!0,restoreFocusOptions:F,renderDialog:S,renderBackdrop:M=m=>u.jsx("div",Object.assign({},m)),manager:N,container:q,onShow:_,onHide:x=()=>{},onExit:$,onExited:Z,onExiting:oe,onEnter:se,onEntering:ae,onEntered:ie}=e,he=wn(e,xn);const A=je(),J=un(q),p=bn(N),ge=qt(),Ee=Zt(n),[Q,ee]=a.useState(!n),L=a.useRef(null);a.useImperativeHandle(t,()=>p,[p]),Y&&!Ee&&n&&(L.current=xe(A==null?void 0:A.document)),n&&Q&&ee(!1);const H=k(()=>{if(p.add(),te.current=fe(document,"keydown",ve),K.current=fe(document,"focus",()=>setTimeout(I),!0),_&&_(),O){var m,ce;const G=xe((m=(ce=p.dialog)==null?void 0:ce.ownerDocument)!=null?m:A==null?void 0:A.document);p.dialog&&G&&!He(p.dialog,G)&&(L.current=G,p.dialog.focus())}}),j=k(()=>{if(p.remove(),te.current==null||te.current(),K.current==null||K.current(),b){var m;(m=L.current)==null||m.focus==null||m.focus(F),L.current=null}});a.useEffect(()=>{!n||!J||H()},[n,J,H]),a.useEffect(()=>{Q&&j()},[Q,j]),Je(()=>{j()});const I=k(()=>{if(!T||!ge()||!p.isTopModal())return;const m=xe(A==null?void 0:A.document);p.dialog&&m&&!He(p.dialog,m)&&p.dialog.focus()}),pe=k(m=>{m.target===m.currentTarget&&(d==null||d(m),c===!0&&x())}),ve=k(m=>{f&&Tn(m)&&p.isTopModal()&&(h==null||h(m),m.defaultPrevented||x())}),K=a.useRef(),te=a.useRef(),ye=(...m)=>{ee(!0),Z==null||Z(...m)};if(!J)return null;const ne=Object.assign({role:r,ref:p.setDialogRef,"aria-modal":r==="dialog"?!0:void 0},he,{style:o,className:s,tabIndex:-1});let U=S?S(ne):u.jsx("div",Object.assign({},ne,{children:a.cloneElement(i,{role:"document"})}));U=Ge(v,g,{unmountOnExit:!0,mountOnEnter:!0,appear:!0,in:!!n,onExit:$,onExiting:oe,onExited:ye,onEnter:se,onEntering:ae,onEntered:ie,children:U});let B=null;return c&&(B=M({ref:p.setBackdropRef,onClick:pe}),B=Ge(y,D,{in:!!n,appear:!0,mountOnEnter:!0,unmountOnExit:!0,children:B})),u.jsx(u.Fragment,{children:Ve.createPortal(u.jsxs(u.Fragment,{children:[B,U]}),J)})});et.displayName="Modal";const Mn=Object.assign(et,{Manager:Se}),X={FIXED_CONTENT:".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",STICKY_CONTENT:".sticky-top",NAVBAR_TOGGLER:".navbar-toggler"};class kn extends Se{adjustAndStore(t,n,r){const s=n.style[t];n.dataset[t]=s,W(n,{[t]:`${parseFloat(W(n,t))+r}px`})}restore(t,n){const r=n.dataset[t];r!==void 0&&(delete n.dataset[t],W(n,{[t]:r}))}setContainerStyle(t){super.setContainerStyle(t);const n=this.getElement();if(bt(n,"modal-open"),!t.scrollBarWidth)return;const r=this.isRTL?"paddingLeft":"paddingRight",s=this.isRTL?"marginLeft":"marginRight";z(n,X.FIXED_CONTENT).forEach(o=>this.adjustAndStore(r,o,t.scrollBarWidth)),z(n,X.STICKY_CONTENT).forEach(o=>this.adjustAndStore(s,o,-t.scrollBarWidth)),z(n,X.NAVBAR_TOGGLER).forEach(o=>this.adjustAndStore(s,o,t.scrollBarWidth))}removeContainerStyle(t){super.removeContainerStyle(t);const n=this.getElement();Mt(n,"modal-open");const r=this.isRTL?"paddingLeft":"paddingRight",s=this.isRTL?"marginLeft":"marginRight";z(n,X.FIXED_CONTENT).forEach(o=>this.restore(r,o)),z(n,X.STICKY_CONTENT).forEach(o=>this.restore(s,o)),z(n,X.NAVBAR_TOGGLER).forEach(o=>this.restore(s,o))}}let be;function On(e){return be||(be=new kn(e)),be}const tt=a.forwardRef((o,s)=>{var i=o,{className:e,bsPrefix:t,as:n="div"}=i,r=w(i,["className","bsPrefix","as"]);return t=P(t,"modal-body"),u.jsx(n,E({ref:s,className:C(e,t)},r))});tt.displayName="ModalBody";const Nn=tt,jn=a.createContext({onHide(){}}),nt=jn,rt=a.forwardRef((h,d)=>{var v=h,{bsPrefix:e,className:t,contentClassName:n,centered:r,size:s,fullscreen:o,children:i,scrollable:c}=v,f=w(v,["bsPrefix","className","contentClassName","centered","size","fullscreen","children","scrollable"]);e=P(e,"modal");const g=`${e}-dialog`,y=typeof o=="string"?`${e}-fullscreen-${o}`:`${e}-fullscreen`;return u.jsx("div",R(E({},f),{ref:d,className:C(g,t,s&&`${e}-${s}`,r&&`${g}-centered`,c&&`${g}-scrollable`,o&&y),children:u.jsx("div",{className:C(`${e}-content`,n),children:i})}))});rt.displayName="ModalDialog";const ot=rt,st=a.forwardRef((o,s)=>{var i=o,{className:e,bsPrefix:t,as:n="div"}=i,r=w(i,["className","bsPrefix","as"]);return t=P(t,"modal-footer"),u.jsx(n,E({ref:s,className:C(e,t)},r))});st.displayName="ModalFooter";const Sn=st,An=a.forwardRef((c,i)=>{var f=c,{closeLabel:e="Close",closeVariant:t,closeButton:n=!1,onHide:r,children:s}=f,o=w(f,["closeLabel","closeVariant","closeButton","onHide","children"]);const d=a.useContext(nt),h=k(()=>{d==null||d.onHide(),r==null||r()});return u.jsxs("div",R(E({ref:i},o),{children:[s,n&&u.jsx(nn,{"aria-label":e,variant:t,onClick:h})]}))}),Ln=An,at=a.forwardRef((i,o)=>{var c=i,{bsPrefix:e,className:t,closeLabel:n="Close",closeButton:r=!1}=c,s=w(c,["bsPrefix","className","closeLabel","closeButton"]);return e=P(e,"modal-header"),u.jsx(Ln,R(E({ref:o},s),{className:C(t,e),closeLabel:n,closeButton:r}))});at.displayName="ModalHeader";const Bn=at,Dn=Pt("h4"),it=a.forwardRef((o,s)=>{var i=o,{className:e,bsPrefix:t,as:n=Dn}=i,r=w(i,["className","bsPrefix","as"]);return t=P(t,"modal-title"),u.jsx(n,E({ref:s,className:C(e,t)},r))});it.displayName="ModalTitle";const Fn=it;function $n(e){return u.jsx(Ze,R(E({},e),{timeout:null}))}function In(e){return u.jsx(Ze,R(E({},e),{timeout:null}))}const ct=a.forwardRef((J,A)=>{var p=J,{bsPrefix:e,className:t,style:n,dialogClassName:r,contentClassName:s,children:o,dialogAs:i=ot,"data-bs-theme":c,"aria-labelledby":f,"aria-describedby":d,"aria-label":h,show:v=!1,animation:g=!0,backdrop:y=!0,keyboard:D=!0,onEscapeKeyDown:O,onShow:T,onHide:b,container:F,autoFocus:S=!0,enforceFocus:M=!0,restoreFocus:N=!0,restoreFocusOptions:q,onEntered:_,onExit:x,onExiting:$,onEnter:Z,onEntering:oe,onExited:se,backdropClassName:ae,manager:ie}=p,he=w(p,["bsPrefix","className","style","dialogClassName","contentClassName","children","dialogAs","data-bs-theme","aria-labelledby","aria-describedby","aria-label","show","animation","backdrop","keyboard","onEscapeKeyDown","onShow","onHide","container","autoFocus","enforceFocus","restoreFocus","restoreFocusOptions","onEntered","onExit","onExiting","onEnter","onEntering","onExited","backdropClassName","manager"]);const[ge,Ee]=a.useState({}),[Q,ee]=a.useState(!1),L=a.useRef(!1),H=a.useRef(!1),j=a.useRef(null),[I,pe]=Yt(),ve=re(A,pe),K=k(b),te=jt();e=P(e,"modal");const ye=a.useMemo(()=>({onHide:K}),[K]);function ne(){return ie||On({isRTL:te})}function U(l){if(!Y)return;const V=ne().getScrollbarWidth()>0,Le=l.scrollHeight>me(l).documentElement.clientHeight;Ee({paddingRight:V&&!Le?Ke():void 0,paddingLeft:!V&&Le?Ke():void 0})}const B=k(()=>{I&&U(I.dialog)});Je(()=>{Oe(window,"resize",B),j.current==null||j.current()});const m=()=>{L.current=!0},ce=l=>{L.current&&I&&l.target===I.dialog&&(H.current=!0),L.current=!1},G=()=>{ee(!0),j.current=Ye(I.dialog,()=>{ee(!1)})},lt=l=>{l.target===l.currentTarget&&G()},ut=l=>{if(y==="static"){lt(l);return}if(H.current||l.target!==l.currentTarget){H.current=!1;return}b==null||b()},dt=l=>{D?O==null||O(l):(l.preventDefault(),y==="static"&&G())},ft=(l,V)=>{l&&U(l),Z==null||Z(l,V)},mt=l=>{j.current==null||j.current(),x==null||x(l)},ht=(l,V)=>{oe==null||oe(l,V),Pe(window,"resize",B)},gt=l=>{l&&(l.style.display=""),se==null||se(l),Oe(window,"resize",B)},Et=a.useCallback(l=>u.jsx("div",R(E({},l),{className:C(`${e}-backdrop`,ae,!g&&"show")})),[g,ae,e]),Ae=E(E({},n),ge);Ae.display="block";const pt=l=>u.jsx("div",R(E({role:"dialog"},l),{style:Ae,className:C(t,e,Q&&`${e}-static`,!g&&"show"),onClick:y?ut:void 0,onMouseUp:ce,"data-bs-theme":c,"aria-label":h,"aria-labelledby":f,"aria-describedby":d,children:u.jsx(i,R(E({},he),{onMouseDown:m,className:r,contentClassName:s,children:o}))}));return u.jsx(nt.Provider,{value:ye,children:u.jsx(Mn,{show:v,ref:ve,backdrop:y,container:F,keyboard:!0,autoFocus:S,enforceFocus:M,restoreFocus:N,restoreFocusOptions:q,onEscapeKeyDown:dt,onShow:T,onHide:b,onEnter:ft,onEntering:ht,onEntered:_,onExit:mt,onExiting:$,onExited:gt,manager:ne(),transition:g?$n:void 0,backdropTransition:g?In:void 0,renderBackdrop:Et,renderDialog:pt})})});ct.displayName="Modal";const Un=Object.assign(ct,{Body:Nn,Header:Bn,Title:Fn,Footer:Sn,Dialog:ot,TRANSITION_DURATION:300,BACKDROP_TRANSITION_DURATION:150});export{nn as C,Ze as F,Un as M,k as a,qt as b,C as c,Je as d,P as u};
