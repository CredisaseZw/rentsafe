var v=Object.defineProperty,C=Object.defineProperties;var K=Object.getOwnPropertyDescriptors;var c=Object.getOwnPropertySymbols;var m=Object.prototype.hasOwnProperty,y=Object.prototype.propertyIsEnumerable;var x=(t,n,o)=>n in t?v(t,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[n]=o,d=(t,n)=>{for(var o in n||(n={}))m.call(n,o)&&x(t,o,n[o]);if(c)for(var o of c(n))y.call(n,o)&&x(t,o,n[o]);return t},j=(t,n)=>C(t,K(n));var B=(t,n)=>{var o={};for(var e in t)m.call(t,e)&&n.indexOf(e)<0&&(o[e]=t[e]);if(t!=null&&c)for(var e of c(t))n.indexOf(e)<0&&y.call(t,e)&&(o[e]=t[e]);return o};import{b as R,d as E}from"./Modal-3e0273fe.js";import{r as P,j as $}from"./main-5ef5aaa0.js";const g=["as","disabled"];function H(t,n){if(t==null)return{};var o={},e=Object.keys(t),s,r;for(r=0;r<e.length;r++)s=e[r],!(n.indexOf(s)>=0)&&(o[s]=t[s]);return o}function I(t){return!t||t.trim()==="#"}function k({tagName:t,disabled:n,href:o,target:e,rel:s,role:r,onClick:i,tabIndex:a=0,type:p}){t||(o!=null||e!=null||s!=null?t="a":t="button");const b={tagName:t};if(t==="button")return[{type:p||"button",disabled:n},b];const f=u=>{if((n||t==="a"&&I(o))&&u.preventDefault(),n){u.stopPropagation();return}i==null||i(u)},l=u=>{u.key===" "&&(u.preventDefault(),f(u))};return t==="a"&&(o||(o="#"),n&&(o=void 0)),[{role:r!=null?r:"button",disabled:void 0,tabIndex:n?void 0:a,href:o,target:t==="a"?e:void 0,"aria-disabled":n||void 0,rel:t==="a"?s:void 0,onClick:f,onKeyDown:l},b]}const L=P.forwardRef((t,n)=>{let{as:o,disabled:e}=t,s=H(t,g);const[r,{tagName:i}]=k(Object.assign({tagName:o,disabled:e},s));return $.jsx(i,Object.assign({},s,r,{ref:n}))});L.displayName="Button";const w=P.forwardRef((b,p)=>{var f=b,{as:t,bsPrefix:n,variant:o="primary",size:e,active:s=!1,disabled:r=!1,className:i}=f,a=B(f,["as","bsPrefix","variant","size","active","disabled","className"]);const l=R(n,"btn"),[u,{tagName:D}]=k(d({tagName:t,disabled:r},a)),O=D;return $.jsx(O,j(d(d({},u),a),{ref:p,disabled:r,className:E(i,l,s&&"active",o&&`${l}-${o}`,e&&`${l}-${e}`,a.href&&r&&"disabled")}))});w.displayName="Button";const q=w;export{q as B};
