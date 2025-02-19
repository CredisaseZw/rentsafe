var Rt=Object.defineProperty,xt=Object.defineProperties;var Tt=Object.getOwnPropertyDescriptors;var ce=Object.getOwnPropertySymbols;var Le=Object.prototype.hasOwnProperty,$e=Object.prototype.propertyIsEnumerable;var Ae=(e,t,n)=>t in e?Rt(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,g=(e,t)=>{for(var n in t||(t={}))Le.call(t,n)&&Ae(e,n,t[n]);if(ce)for(var n of ce(t))$e.call(t,n)&&Ae(e,n,t[n]);return e},R=(e,t)=>xt(e,Tt(t));var b=(e,t)=>{var n={};for(var o in e)Le.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(e!=null&&ce)for(var o of ce(e))t.indexOf(o)<0&&$e.call(e,o)&&(n[o]=e[o]);return n};import{g as bt,r as i,e as Ge,R as Fe,j as u}from"./main-840f9fea.js";import{T as wt,E as Ct,e as Mt,c as kt,r as Ot}from"./removeClass-dd52d046.js";import{P as Re}from"./index-8247a4c4.js";var Ve={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/(function(e){(function(){var t={}.hasOwnProperty;function n(){for(var r="",a=0;a<arguments.length;a++){var l=arguments[a];l&&(r=s(r,o(l)))}return r}function o(r){if(typeof r=="string"||typeof r=="number")return r;if(typeof r!="object")return"";if(Array.isArray(r))return n.apply(null,r);if(r.toString!==Object.prototype.toString&&!r.toString.toString().includes("[native code]"))return r.toString();var a="";for(var l in r)t.call(r,l)&&r[l]&&(a=s(a,l));return a}function s(r,a){return a?r?r+" "+a:r+a:r}e.exports?(n.default=n,e.exports=n):window.classNames=n})()})(Ve);var jt=Ve.exports;const w=bt(jt),Nt=["xxl","xl","lg","md","sm","xs"],St="xs",ze=i.createContext({prefixes:{},breakpoints:Nt,minBreakpoint:St});function _(e,t){const{prefixes:n}=i.useContext(ze);return e||n[t]||t}function Bt(){const{dir:e}=i.useContext(ze);return e==="rtl"}function me(e){return e&&e.ownerDocument||document}function Dt(e){var t=me(e);return t&&t.defaultView||window}function At(e,t){return Dt(e).getComputedStyle(e,t)}var Lt=/([A-Z])/g;function $t(e){return e.replace(Lt,"-$1").toLowerCase()}var Ft=/^ms-/;function ue(e){return $t(e).replace(Ft,"-ms-")}var It=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;function Wt(e){return!!(e&&It.test(e))}function W(e,t){var n="",o="";if(typeof t=="string")return e.style.getPropertyValue(ue(t))||At(e).getPropertyValue(ue(t));Object.keys(t).forEach(function(s){var r=t[s];!r&&r!==0?e.style.removeProperty(ue(s)):Wt(s)?o+=s+"("+r+") ":n+=ue(s)+": "+r+";"}),o&&(n+="transform: "+o+";"),e.style.cssText+=";"+n}const Y=!!(typeof window!="undefined"&&window.document&&window.document.createElement);var Me=!1,ke=!1;try{var xe={get passive(){return Me=!0},get once(){return ke=Me=!0}};Y&&(window.addEventListener("test",xe,xe),window.removeEventListener("test",xe,!0))}catch(e){}function Xe(e,t,n,o){if(o&&typeof o!="boolean"&&!ke){var s=o.once,r=o.capture,a=n;!ke&&s&&(a=n.__once||function l(m){this.removeEventListener(t,l,r),n.call(this,m)},n.__once=a),e.addEventListener(t,a,Me?o:r)}e.addEventListener(t,n,o)}function Oe(e,t,n,o){var s=o&&typeof o!="boolean"?o.capture:o;e.removeEventListener(t,n,s),n.__once&&e.removeEventListener(t,n.__once,s)}function fe(e,t,n,o){return Xe(e,t,n,o),function(){Oe(e,t,n,o)}}function _t(e,t,n,o){if(n===void 0&&(n=!1),o===void 0&&(o=!0),e){var s=document.createEvent("HTMLEvents");s.initEvent(t,n,o),e.dispatchEvent(s)}}function Kt(e){var t=W(e,"transitionDuration")||"",n=t.indexOf("ms")===-1?1e3:1;return parseFloat(t)*n}function Ht(e,t,n){n===void 0&&(n=5);var o=!1,s=setTimeout(function(){o||_t(e,"transitionend",!0)},t+n),r=fe(e,"transitionend",function(){o=!0},{once:!0});return function(){clearTimeout(s),r()}}function Ye(e,t,n,o){n==null&&(n=Kt(e)||0);var s=Ht(e,n,o),r=fe(e,"transitionend",t);return function(){s(),r()}}function Ie(e,t){const n=W(e,t)||"",o=n.indexOf("ms")===-1?1e3:1;return parseFloat(n)*o}function Ut(e,t){const n=Ie(e,"transitionDuration"),o=Ie(e,"transitionDelay"),s=Ye(e,r=>{r.target===e&&(s(),t(r))},n+o)}function Pt(e){e.offsetHeight}const We=e=>!e||typeof e=="function"?e:t=>{e.current=t};function Gt(e,t){const n=We(e),o=We(t);return s=>{n&&n(s),o&&o(s)}}function oe(e,t){return i.useMemo(()=>Gt(e,t),[e,t])}function Vt(e){return e&&"setState"in e?Ge.findDOMNode(e):e!=null?e:null}const zt=Fe.forwardRef((E,h)=>{var c=E,{onEnter:e,onEntering:t,onEntered:n,onExit:o,onExiting:s,onExited:r,addEndListener:a,children:l,childRef:m}=c,d=b(c,["onEnter","onEntering","onEntered","onExit","onExiting","onExited","addEndListener","children","childRef"]);const y=i.useRef(null),O=oe(y,m),j=T=>{O(Vt(T))},x=T=>F=>{T&&y.current&&T(y.current,F)},C=i.useCallback(x(e),[e]),$=i.useCallback(x(t),[t]),B=i.useCallback(x(n),[n]),M=i.useCallback(x(o),[o]),N=i.useCallback(x(s),[s]),q=i.useCallback(x(r),[r]),K=i.useCallback(x(a),[a]);return u.jsx(wt,R(g({ref:h},d),{onEnter:C,onEntered:B,onEntering:$,onExit:M,onExited:q,onExiting:N,addEndListener:K,nodeRef:y,children:typeof l=="function"?(T,F)=>l(T,R(g({},F),{ref:j})):Fe.cloneElement(l,{ref:j})}))}),Xt=zt;function Yt(e){const t=i.useRef(e);return i.useEffect(()=>{t.current=e},[e]),t}function k(e){const t=Yt(e);return i.useCallback(function(...n){return t.current&&t.current(...n)},[t])}const qt=e=>i.forwardRef((t,n)=>u.jsx("div",R(g({},t),{ref:n,className:w(t.className,e)})));function Zt(){return i.useState(null)}function Jt(){const e=i.useRef(!0),t=i.useRef(()=>e.current);return i.useEffect(()=>(e.current=!0,()=>{e.current=!1}),[]),t.current}function Qt(e){const t=i.useRef(null);return i.useEffect(()=>{t.current=e}),t.current}const en=typeof global!="undefined"&&global.navigator&&global.navigator.product==="ReactNative",tn=typeof document!="undefined",_e=tn||en?i.useLayoutEffect:i.useEffect,nn=["as","disabled"];function on(e,t){if(e==null)return{};var n={},o=Object.keys(e),s,r;for(r=0;r<o.length;r++)s=o[r],!(t.indexOf(s)>=0)&&(n[s]=e[s]);return n}function rn(e){return!e||e.trim()==="#"}function qe({tagName:e,disabled:t,href:n,target:o,rel:s,role:r,onClick:a,tabIndex:l=0,type:m}){e||(n!=null||o!=null||s!=null?e="a":e="button");const d={tagName:e};if(e==="button")return[{type:m||"button",disabled:t},d];const h=c=>{if((t||e==="a"&&rn(n))&&c.preventDefault(),t){c.stopPropagation();return}a==null||a(c)},E=c=>{c.key===" "&&(c.preventDefault(),h(c))};return e==="a"&&(n||(n="#"),t&&(n=void 0)),[{role:r!=null?r:"button",disabled:void 0,tabIndex:t?void 0:l,href:n,target:e==="a"?o:void 0,"aria-disabled":t||void 0,rel:e==="a"?s:void 0,onClick:h,onKeyDown:E},d]}const sn=i.forwardRef((e,t)=>{let{as:n,disabled:o}=e,s=on(e,nn);const[r,{tagName:a}]=qe(Object.assign({tagName:n,disabled:o},s));return u.jsx(a,Object.assign({},s,r,{ref:t}))});sn.displayName="Button";const an={[Ct]:"show",[Mt]:"show"},Ze=i.forwardRef((a,r)=>{var l=a,{className:e,children:t,transitionClasses:n={},onEnter:o}=l,s=b(l,["className","children","transitionClasses","onEnter"]);const m=g({in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1},s),d=i.useCallback((h,E)=>{Pt(h),o==null||o(h,E)},[o]);return u.jsx(Xt,R(g({ref:r,addEndListener:Ut},m),{onEnter:d,childRef:t.ref,children:(h,E)=>i.cloneElement(t,R(g({},E),{className:w("fade",e,t.props.className,an[h],n[h])}))}))});Ze.displayName="Fade";const Je=Ze,ln={"aria-label":Re.string,onClick:Re.func,variant:Re.oneOf(["white"])},je=i.forwardRef((r,s)=>{var a=r,{className:e,variant:t,"aria-label":n="Close"}=a,o=b(a,["className","variant","aria-label"]);return u.jsx("button",g({ref:s,type:"button",className:w("btn-close",t&&`btn-close-${t}`,e),"aria-label":n},o))});je.displayName="CloseButton";je.propTypes=ln;const cn=je,Qe=i.forwardRef((d,m)=>{var h=d,{as:e,bsPrefix:t,variant:n="primary",size:o,active:s=!1,disabled:r=!1,className:a}=h,l=b(h,["as","bsPrefix","variant","size","active","disabled","className"]);const E=_(t,"btn"),[c,{tagName:y}]=qe(g({tagName:e,disabled:r},l)),O=y;return u.jsx(O,R(g(g({},c),l),{ref:m,disabled:r,className:w(a,E,s&&"active",n&&`${E}-${n}`,o&&`${E}-${o}`,l.href&&r&&"disabled")}))});Qe.displayName="Button";const Yn=Qe;function un(e){const t=i.useRef(e);return t.current=e,t}function et(e){const t=un(e);i.useEffect(()=>()=>t.current(),[])}var dn=Function.prototype.bind.call(Function.prototype.call,[].slice);function z(e,t){return dn(e.querySelectorAll(t))}function Ke(e,t){if(e.contains)return e.contains(t);if(e.compareDocumentPosition)return e===t||!!(e.compareDocumentPosition(t)&16)}const fn="data-rr-ui-";function mn(e){return`${fn}${e}`}const tt=i.createContext(Y?window:void 0);tt.Provider;function Ne(){return i.useContext(tt)}var de;function He(e){if((!de&&de!==0||e)&&Y){var t=document.createElement("div");t.style.position="absolute",t.style.top="-9999px",t.style.width="50px",t.style.height="50px",t.style.overflow="scroll",document.body.appendChild(t),de=t.offsetWidth-t.clientWidth,document.body.removeChild(t)}return de}function Te(e){e===void 0&&(e=me());try{var t=e.activeElement;return!t||!t.nodeName?null:t}catch(n){return e.body}}function hn(e=document){const t=e.defaultView;return Math.abs(t.innerWidth-e.documentElement.clientWidth)}const Ue=mn("modal-open");class gn{constructor({ownerDocument:t,handleContainerOverflow:n=!0,isRTL:o=!1}={}){this.handleContainerOverflow=n,this.isRTL=o,this.modals=[],this.ownerDocument=t}getScrollbarWidth(){return hn(this.ownerDocument)}getElement(){return(this.ownerDocument||document).body}setModalAttributes(t){}removeModalAttributes(t){}setContainerStyle(t){const n={overflow:"hidden"},o=this.isRTL?"paddingLeft":"paddingRight",s=this.getElement();t.style={overflow:s.style.overflow,[o]:s.style[o]},t.scrollBarWidth&&(n[o]=`${parseInt(W(s,o)||"0",10)+t.scrollBarWidth}px`),s.setAttribute(Ue,""),W(s,n)}reset(){[...this.modals].forEach(t=>this.remove(t))}removeContainerStyle(t){const n=this.getElement();n.removeAttribute(Ue),Object.assign(n.style,t.style)}add(t){let n=this.modals.indexOf(t);return n!==-1||(n=this.modals.length,this.modals.push(t),this.setModalAttributes(t),n!==0)||(this.state={scrollBarWidth:this.getScrollbarWidth(),style:{}},this.handleContainerOverflow&&this.setContainerStyle(this.state)),n}remove(t){const n=this.modals.indexOf(t);n!==-1&&(this.modals.splice(n,1),!this.modals.length&&this.handleContainerOverflow&&this.removeContainerStyle(this.state),this.removeModalAttributes(t))}isTopModal(t){return!!this.modals.length&&this.modals[this.modals.length-1]===t}}const Se=gn,be=(e,t)=>Y?e==null?(t||me()).body:(typeof e=="function"&&(e=e()),e&&"current"in e&&(e=e.current),e&&("nodeType"in e||e.getBoundingClientRect)?e:null):null;function pn(e,t){const n=Ne(),[o,s]=i.useState(()=>be(e,n==null?void 0:n.document));if(!o){const r=be(e);r&&s(r)}return i.useEffect(()=>{t&&o&&t(o)},[t,o]),i.useEffect(()=>{const r=be(e);r!==o&&s(r)},[e,o]),o}function En({children:e,in:t,onExited:n,mountOnEnter:o,unmountOnExit:s}){const r=i.useRef(null),a=i.useRef(t),l=k(n);i.useEffect(()=>{t?a.current=!0:l(r.current)},[t,l]);const m=oe(r,e.ref),d=i.cloneElement(e,{ref:m});return t?d:s||!a.current&&o?null:d}const vn=["onEnter","onEntering","onEntered","onExit","onExiting","onExited","addEndListener","children"];function yn(e,t){if(e==null)return{};var n={},o=Object.keys(e),s,r;for(r=0;r<o.length;r++)s=o[r],!(t.indexOf(s)>=0)&&(n[s]=e[s]);return n}function Rn(e){let{onEnter:t,onEntering:n,onEntered:o,onExit:s,onExiting:r,onExited:a,addEndListener:l,children:m}=e,d=yn(e,vn);const h=i.useRef(null),E=oe(h,typeof m=="function"?null:m.ref),c=M=>N=>{M&&h.current&&M(h.current,N)},y=i.useCallback(c(t),[t]),O=i.useCallback(c(n),[n]),j=i.useCallback(c(o),[o]),x=i.useCallback(c(s),[s]),C=i.useCallback(c(r),[r]),$=i.useCallback(c(a),[a]),B=i.useCallback(c(l),[l]);return Object.assign({},d,{nodeRef:h},t&&{onEnter:y},n&&{onEntering:O},o&&{onEntered:j},s&&{onExit:x},r&&{onExiting:C},a&&{onExited:$},l&&{addEndListener:B},{children:typeof m=="function"?(M,N)=>m(M,Object.assign({},N,{ref:E})):i.cloneElement(m,{ref:E})})}const xn=["component"];function Tn(e,t){if(e==null)return{};var n={},o=Object.keys(e),s,r;for(r=0;r<o.length;r++)s=o[r],!(t.indexOf(s)>=0)&&(n[s]=e[s]);return n}const bn=i.forwardRef((e,t)=>{let{component:n}=e,o=Tn(e,xn);const s=Rn(o);return u.jsx(n,Object.assign({ref:t},s))}),wn=bn;function Cn({in:e,onTransition:t}){const n=i.useRef(null),o=i.useRef(!0),s=k(t);return _e(()=>{if(!n.current)return;let r=!1;return s({in:e,element:n.current,initial:o.current,isStale:()=>r}),()=>{r=!0}},[e,s]),_e(()=>(o.current=!1,()=>{o.current=!0}),[]),n}function Mn({children:e,in:t,onExited:n,onEntered:o,transition:s}){const[r,a]=i.useState(!t);t&&r&&a(!1);const l=Cn({in:!!t,onTransition:d=>{const h=()=>{d.isStale()||(d.in?o==null||o(d.element,d.initial):(a(!0),n==null||n(d.element)))};Promise.resolve(s(d)).then(h,E=>{throw d.in||a(!0),E})}}),m=oe(l,e.ref);return r&&!t?null:i.cloneElement(e,{ref:m})}function Pe(e,t,n){return e?u.jsx(wn,Object.assign({},n,{component:e})):t?u.jsx(Mn,Object.assign({},n,{transition:t})):u.jsx(En,Object.assign({},n))}function kn(e){return e.code==="Escape"||e.keyCode===27}const On=["show","role","className","style","children","backdrop","keyboard","onBackdropClick","onEscapeKeyDown","transition","runTransition","backdropTransition","runBackdropTransition","autoFocus","enforceFocus","restoreFocus","restoreFocusOptions","renderDialog","renderBackdrop","manager","container","onShow","onHide","onExit","onExited","onExiting","onEnter","onEntering","onEntered"];function jn(e,t){if(e==null)return{};var n={},o=Object.keys(e),s,r;for(r=0;r<o.length;r++)s=o[r],!(t.indexOf(s)>=0)&&(n[s]=e[s]);return n}let we;function Nn(e){return we||(we=new Se({ownerDocument:e==null?void 0:e.document})),we}function Sn(e){const t=Ne(),n=e||Nn(t),o=i.useRef({dialog:null,backdrop:null});return Object.assign(o.current,{add:()=>n.add(o.current),remove:()=>n.remove(o.current),isTopModal:()=>n.isTopModal(o.current),setDialogRef:i.useCallback(s=>{o.current.dialog=s},[]),setBackdropRef:i.useCallback(s=>{o.current.backdrop=s},[])})}const nt=i.forwardRef((e,t)=>{let{show:n=!1,role:o="dialog",className:s,style:r,children:a,backdrop:l=!0,keyboard:m=!0,onBackdropClick:d,onEscapeKeyDown:h,transition:E,runTransition:c,backdropTransition:y,runBackdropTransition:O,autoFocus:j=!0,enforceFocus:x=!0,restoreFocus:C=!0,restoreFocusOptions:$,renderDialog:B,renderBackdrop:M=p=>u.jsx("div",Object.assign({},p)),manager:N,container:q,onShow:K,onHide:T=()=>{},onExit:F,onExited:Z,onExiting:re,onEnter:se,onEntering:ie,onEntered:ae}=e,he=jn(e,On);const D=Ne(),J=pn(q),v=Sn(N),ge=Jt(),pe=Qt(n),[Q,ee]=i.useState(!n),A=i.useRef(null);i.useImperativeHandle(t,()=>v,[v]),Y&&!pe&&n&&(A.current=Te(D==null?void 0:D.document)),n&&Q&&ee(!1);const H=k(()=>{if(v.add(),te.current=fe(document,"keydown",ve),U.current=fe(document,"focus",()=>setTimeout(I),!0),K&&K(),j){var p,le;const G=Te((p=(le=v.dialog)==null?void 0:le.ownerDocument)!=null?p:D==null?void 0:D.document);v.dialog&&G&&!Ke(v.dialog,G)&&(A.current=G,v.dialog.focus())}}),S=k(()=>{if(v.remove(),te.current==null||te.current(),U.current==null||U.current(),C){var p;(p=A.current)==null||p.focus==null||p.focus($),A.current=null}});i.useEffect(()=>{!n||!J||H()},[n,J,H]),i.useEffect(()=>{Q&&S()},[Q,S]),et(()=>{S()});const I=k(()=>{if(!x||!ge()||!v.isTopModal())return;const p=Te(D==null?void 0:D.document);v.dialog&&p&&!Ke(v.dialog,p)&&v.dialog.focus()}),Ee=k(p=>{p.target===p.currentTarget&&(d==null||d(p),l===!0&&T())}),ve=k(p=>{m&&kn(p)&&v.isTopModal()&&(h==null||h(p),p.defaultPrevented||T())}),U=i.useRef(),te=i.useRef(),ye=(...p)=>{ee(!0),Z==null||Z(...p)};if(!J)return null;const ne=Object.assign({role:o,ref:v.setDialogRef,"aria-modal":o==="dialog"?!0:void 0},he,{style:r,className:s,tabIndex:-1});let P=B?B(ne):u.jsx("div",Object.assign({},ne,{children:i.cloneElement(a,{role:"document"})}));P=Pe(E,c,{unmountOnExit:!0,mountOnEnter:!0,appear:!0,in:!!n,onExit:F,onExiting:re,onExited:ye,onEnter:se,onEntering:ie,onEntered:ae,children:P});let L=null;return l&&(L=M({ref:v.setBackdropRef,onClick:Ee}),L=Pe(y,O,{in:!!n,appear:!0,mountOnEnter:!0,unmountOnExit:!0,children:L})),u.jsx(u.Fragment,{children:Ge.createPortal(u.jsxs(u.Fragment,{children:[L,P]}),J)})});nt.displayName="Modal";const Bn=Object.assign(nt,{Manager:Se}),X={FIXED_CONTENT:".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",STICKY_CONTENT:".sticky-top",NAVBAR_TOGGLER:".navbar-toggler"};class Dn extends Se{adjustAndStore(t,n,o){const s=n.style[t];n.dataset[t]=s,W(n,{[t]:`${parseFloat(W(n,t))+o}px`})}restore(t,n){const o=n.dataset[t];o!==void 0&&(delete n.dataset[t],W(n,{[t]:o}))}setContainerStyle(t){super.setContainerStyle(t);const n=this.getElement();if(kt(n,"modal-open"),!t.scrollBarWidth)return;const o=this.isRTL?"paddingLeft":"paddingRight",s=this.isRTL?"marginLeft":"marginRight";z(n,X.FIXED_CONTENT).forEach(r=>this.adjustAndStore(o,r,t.scrollBarWidth)),z(n,X.STICKY_CONTENT).forEach(r=>this.adjustAndStore(s,r,-t.scrollBarWidth)),z(n,X.NAVBAR_TOGGLER).forEach(r=>this.adjustAndStore(s,r,t.scrollBarWidth))}removeContainerStyle(t){super.removeContainerStyle(t);const n=this.getElement();Ot(n,"modal-open");const o=this.isRTL?"paddingLeft":"paddingRight",s=this.isRTL?"marginLeft":"marginRight";z(n,X.FIXED_CONTENT).forEach(r=>this.restore(o,r)),z(n,X.STICKY_CONTENT).forEach(r=>this.restore(s,r)),z(n,X.NAVBAR_TOGGLER).forEach(r=>this.restore(s,r))}}let Ce;function An(e){return Ce||(Ce=new Dn(e)),Ce}const ot=i.forwardRef((r,s)=>{var a=r,{className:e,bsPrefix:t,as:n="div"}=a,o=b(a,["className","bsPrefix","as"]);return t=_(t,"modal-body"),u.jsx(n,g({ref:s,className:w(e,t)},o))});ot.displayName="ModalBody";const Ln=ot,$n=i.createContext({onHide(){}}),rt=$n,st=i.forwardRef((h,d)=>{var E=h,{bsPrefix:e,className:t,contentClassName:n,centered:o,size:s,fullscreen:r,children:a,scrollable:l}=E,m=b(E,["bsPrefix","className","contentClassName","centered","size","fullscreen","children","scrollable"]);e=_(e,"modal");const c=`${e}-dialog`,y=typeof r=="string"?`${e}-fullscreen-${r}`:`${e}-fullscreen`;return u.jsx("div",R(g({},m),{ref:d,className:w(c,t,s&&`${e}-${s}`,o&&`${c}-centered`,l&&`${c}-scrollable`,r&&y),children:u.jsx("div",{className:w(`${e}-content`,n),children:a})}))});st.displayName="ModalDialog";const it=st,at=i.forwardRef((r,s)=>{var a=r,{className:e,bsPrefix:t,as:n="div"}=a,o=b(a,["className","bsPrefix","as"]);return t=_(t,"modal-footer"),u.jsx(n,g({ref:s,className:w(e,t)},o))});at.displayName="ModalFooter";const Fn=at,In=i.forwardRef((l,a)=>{var m=l,{closeLabel:e="Close",closeVariant:t,closeButton:n=!1,onHide:o,children:s}=m,r=b(m,["closeLabel","closeVariant","closeButton","onHide","children"]);const d=i.useContext(rt),h=k(()=>{d==null||d.onHide(),o==null||o()});return u.jsxs("div",R(g({ref:a},r),{children:[s,n&&u.jsx(cn,{"aria-label":e,variant:t,onClick:h})]}))}),Wn=In,lt=i.forwardRef((a,r)=>{var l=a,{bsPrefix:e,className:t,closeLabel:n="Close",closeButton:o=!1}=l,s=b(l,["bsPrefix","className","closeLabel","closeButton"]);return e=_(e,"modal-header"),u.jsx(Wn,R(g({ref:r},s),{className:w(t,e),closeLabel:n,closeButton:o}))});lt.displayName="ModalHeader";const _n=lt,Kn=qt("h4"),ct=i.forwardRef((r,s)=>{var a=r,{className:e,bsPrefix:t,as:n=Kn}=a,o=b(a,["className","bsPrefix","as"]);return t=_(t,"modal-title"),u.jsx(n,g({ref:s,className:w(e,t)},o))});ct.displayName="ModalTitle";const Hn=ct;function Un(e){return u.jsx(Je,R(g({},e),{timeout:null}))}function Pn(e){return u.jsx(Je,R(g({},e),{timeout:null}))}const ut=i.forwardRef((J,D)=>{var v=J,{bsPrefix:e,className:t,style:n,dialogClassName:o,contentClassName:s,children:r,dialogAs:a=it,"data-bs-theme":l,"aria-labelledby":m,"aria-describedby":d,"aria-label":h,show:E=!1,animation:c=!0,backdrop:y=!0,keyboard:O=!0,onEscapeKeyDown:j,onShow:x,onHide:C,container:$,autoFocus:B=!0,enforceFocus:M=!0,restoreFocus:N=!0,restoreFocusOptions:q,onEntered:K,onExit:T,onExiting:F,onEnter:Z,onEntering:re,onExited:se,backdropClassName:ie,manager:ae}=v,he=b(v,["bsPrefix","className","style","dialogClassName","contentClassName","children","dialogAs","data-bs-theme","aria-labelledby","aria-describedby","aria-label","show","animation","backdrop","keyboard","onEscapeKeyDown","onShow","onHide","container","autoFocus","enforceFocus","restoreFocus","restoreFocusOptions","onEntered","onExit","onExiting","onEnter","onEntering","onExited","backdropClassName","manager"]);const[ge,pe]=i.useState({}),[Q,ee]=i.useState(!1),A=i.useRef(!1),H=i.useRef(!1),S=i.useRef(null),[I,Ee]=Zt(),ve=oe(D,Ee),U=k(C),te=Bt();e=_(e,"modal");const ye=i.useMemo(()=>({onHide:U}),[U]);function ne(){return ae||An({isRTL:te})}function P(f){if(!Y)return;const V=ne().getScrollbarWidth()>0,De=f.scrollHeight>me(f).documentElement.clientHeight;pe({paddingRight:V&&!De?He():void 0,paddingLeft:!V&&De?He():void 0})}const L=k(()=>{I&&P(I.dialog)});et(()=>{Oe(window,"resize",L),S.current==null||S.current()});const p=()=>{A.current=!0},le=f=>{A.current&&I&&f.target===I.dialog&&(H.current=!0),A.current=!1},G=()=>{ee(!0),S.current=Ye(I.dialog,()=>{ee(!1)})},dt=f=>{f.target===f.currentTarget&&G()},ft=f=>{if(y==="static"){dt(f);return}if(H.current||f.target!==f.currentTarget){H.current=!1;return}C==null||C()},mt=f=>{O?j==null||j(f):(f.preventDefault(),y==="static"&&G())},ht=(f,V)=>{f&&P(f),Z==null||Z(f,V)},gt=f=>{S.current==null||S.current(),T==null||T(f)},pt=(f,V)=>{re==null||re(f,V),Xe(window,"resize",L)},Et=f=>{f&&(f.style.display=""),se==null||se(f),Oe(window,"resize",L)},vt=i.useCallback(f=>u.jsx("div",R(g({},f),{className:w(`${e}-backdrop`,ie,!c&&"show")})),[c,ie,e]),Be=g(g({},n),ge);Be.display="block";const yt=f=>u.jsx("div",R(g({role:"dialog"},f),{style:Be,className:w(t,e,Q&&`${e}-static`,!c&&"show"),onClick:y?ft:void 0,onMouseUp:le,"data-bs-theme":l,"aria-label":h,"aria-labelledby":m,"aria-describedby":d,children:u.jsx(a,R(g({},he),{onMouseDown:p,className:o,contentClassName:s,children:r}))}));return u.jsx(rt.Provider,{value:ye,children:u.jsx(Bn,{show:E,ref:ve,backdrop:y,container:$,keyboard:!0,autoFocus:B,enforceFocus:M,restoreFocus:N,restoreFocusOptions:q,onEscapeKeyDown:mt,onShow:x,onHide:C,onEnter:ht,onEntering:pt,onEntered:K,onExit:gt,onExiting:F,onExited:Et,manager:ne(),transition:c?Un:void 0,backdropTransition:c?Pn:void 0,renderBackdrop:vt,renderDialog:yt})})});ut.displayName="Modal";const qn=Object.assign(ut,{Body:Ln,Header:_n,Title:Hn,Footer:Fn,Dialog:it,TRANSITION_DURATION:300,BACKDROP_TRANSITION_DURATION:150});export{Yn as B,cn as C,Je as F,qn as M,et as a,_ as b,k as c,w as d,Jt as u};
