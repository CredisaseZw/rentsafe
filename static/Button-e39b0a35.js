var v=Object.defineProperty,C=Object.defineProperties;var K=Object.getOwnPropertyDescriptors;var c=Object.getOwnPropertySymbols;var m=Object.prototype.hasOwnProperty,y=Object.prototype.propertyIsEnumerable;var b=(t,n,o)=>n in t?v(t,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[n]=o,p=(t,n)=>{for(var o in n||(n={}))m.call(n,o)&&b(t,o,n[o]);if(c)for(var o of c(n))y.call(n,o)&&b(t,o,n[o]);return t},j=(t,n)=>C(t,K(n));var B=(t,n)=>{var o={};for(var e in t)m.call(t,e)&&n.indexOf(e)<0&&(o[e]=t[e]);if(t!=null&&c)for(var e of c(t))n.indexOf(e)<0&&y.call(t,e)&&(o[e]=t[e]);return o};import{u as R,c as E}from"./Modal-b2283bef.js";import{r as P,j as $}from"./main-6ed88b46.js";const g=["as","disabled"];function H(t,n){if(t==null)return{};var o={},e=Object.keys(t),r,s;for(s=0;s<e.length;s++)r=e[s],!(n.indexOf(r)>=0)&&(o[r]=t[r]);return o}function I(t){return!t||t.trim()==="#"}function k({tagName:t,disabled:n,href:o,target:e,rel:r,role:s,onClick:i,tabIndex:a=0,type:d}){t||(o!=null||e!=null||r!=null?t="a":t="button");const x={tagName:t};if(t==="button")return[{type:d||"button",disabled:n},x];const f=u=>{if((n||t==="a"&&I(o))&&u.preventDefault(),n){u.stopPropagation();return}i==null||i(u)},l=u=>{u.key===" "&&(u.preventDefault(),f(u))};return t==="a"&&(o||(o="#"),n&&(o=void 0)),[{role:s!=null?s:"button",disabled:void 0,tabIndex:n?void 0:a,href:o,target:t==="a"?e:void 0,"aria-disabled":n||void 0,rel:t==="a"?r:void 0,onClick:f,onKeyDown:l},x]}const L=P.forwardRef((t,n)=>{let{as:o,disabled:e}=t,r=H(t,g);const[s,{tagName:i}]=k(Object.assign({tagName:o,disabled:e},r));return $.jsx(i,Object.assign({},r,s,{ref:n}))});L.displayName="Button";const w=P.forwardRef((x,d)=>{var f=x,{as:t,bsPrefix:n,variant:o="primary",size:e,active:r=!1,disabled:s=!1,className:i}=f,a=B(f,["as","bsPrefix","variant","size","active","disabled","className"]);const l=R(n,"btn"),[u,{tagName:D}]=k(p({tagName:t,disabled:s},a)),O=D;return $.jsx(O,j(p(p({},u),a),{ref:d,disabled:s,className:E(i,l,r&&"active",o&&`${l}-${o}`,e&&`${l}-${e}`,a.href&&s&&"disabled")}))});w.displayName="Button";const q=w;export{q as B,k as u};
