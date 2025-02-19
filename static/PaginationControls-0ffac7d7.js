var I=Object.defineProperty,K=Object.defineProperties;var L=Object.getOwnPropertyDescriptors;var p=Object.getOwnPropertySymbols;var v=Object.prototype.hasOwnProperty,y=Object.prototype.propertyIsEnumerable;var P=(e,s,n)=>s in e?I(e,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[s]=n,h=(e,s)=>{for(var n in s||(s={}))v.call(s,n)&&P(e,n,s[n]);if(p)for(var n of p(s))y.call(s,n)&&P(e,n,s[n]);return e},g=(e,s)=>K(e,L(s));var x=(e,s)=>{var n={};for(var t in e)v.call(e,t)&&s.indexOf(t)<0&&(n[t]=e[t]);if(e!=null&&p)for(var t of p(e))s.indexOf(t)<0&&y.call(e,t)&&(n[t]=e[t]);return n};import{r as m,j as r,u as w,a as R}from"./main-c733e0a6.js";import{a as O,c as j,u as $}from"./Modal-66bffea1.js";import{u as E}from"./Button-8e76e8f9.js";const F=["onKeyDown"];function U(e,s){if(e==null)return{};var n={},t=Object.keys(e),a,o;for(o=0;o<t.length;o++)a=t[o],!(s.indexOf(a)>=0)&&(n[a]=e[a]);return n}function z(e){return!e||e.trim()==="#"}const S=m.forwardRef((e,s)=>{let{onKeyDown:n}=e,t=U(e,F);const[a]=E(Object.assign({tagName:"a"},t)),o=O(i=>{a.onKeyDown(i),n==null||n(i)});return z(t.href)||t.role==="button"?r.jsx("a",Object.assign({ref:s},t,a,{onKeyDown:o})):r.jsx("a",Object.assign({ref:s},t,{onKeyDown:n}))});S.displayName="Anchor";const A=S,N=m.forwardRef((J,C)=>{var b=J,{active:e=!1,disabled:s=!1,className:n,style:t,activeLabel:a="(current)",children:o,linkStyle:i,linkClassName:c,as:l=A}=b,f=x(b,["active","disabled","className","style","activeLabel","children","linkStyle","linkClassName","as"]);const D=e||s?"span":l;return r.jsx("li",{ref:C,style:t,className:j(n,"page-item",{active:e,disabled:s}),children:r.jsxs(D,g(h({className:j("page-link",c),style:i},f),{children:[o,e&&a&&r.jsx("span",{className:"visually-hidden",children:a})]}))})});N.displayName="PageItem";const B=N;function d(e,s,n=e){const t=m.forwardRef((c,i)=>{var l=c,{children:a}=l,o=x(l,["children"]);return r.jsxs(N,g(h({},o),{ref:i,children:[r.jsx("span",{"aria-hidden":"true",children:a||s}),r.jsx("span",{className:"visually-hidden",children:n})]}))});return t.displayName=e,t}const M=d("First","«"),V=d("Prev","‹","Previous"),q=d("Ellipsis","…","More"),H=d("Next","›"),T=d("Last","»"),k=m.forwardRef((o,a)=>{var i=o,{bsPrefix:e,className:s,size:n}=i,t=x(i,["bsPrefix","className","size"]);const c=$(e,"pagination");return r.jsx("ul",g(h({ref:a},t),{className:j(s,c,n&&`${c}-${n}`)}))});k.displayName="Pagination";const u=Object.assign(k,{First:M,Prev:V,Ellipsis:q,Item:B,Next:H,Last:T});function W(e){const{url:s}=w(),{get:n}=R(),t=m.useRef(null),a=new URL(s).searchParams.get(e);function o(c){c.preventDefault();const l=new URL(s),f=c.target[e].value;f.trim()?l.searchParams.set(e,f):l.searchParams.delete(e),l.searchParams.delete("page"),n(l.href,{preserveState:!0})}function i(){const c=new URL(s);c.searchParams.delete(e),c.searchParams.delete("page"),n(c.href,{preserveState:!1})}return{defaultValue:a,handleSearch:o,clear:i,formRef:t}}function ee({searchBy:e,placeholder:s}){const{defaultValue:n,handleSearch:t,clear:a,formRef:o}=W(e);return r.jsx("form",{onSubmit:t,ref:o,children:r.jsxs("div",{className:"input-group",children:[r.jsx("button",{type:"button",className:"btn border border-2 custom-z-0",onClick:a,children:r.jsx("i",{className:"material-icons small",children:"close"})}),r.jsx("input",{name:e,defaultValue:n,placeholder:s||`Search by ${e}`,onBlur:()=>o.current.requestSubmit(),className:"form-control"}),r.jsx("button",{type:"submit",className:"btn btn-primary custom-z-0",children:"Search"})]})})}function _(e){const{get:s}=R(),n=new URL(w().url);function t(o){n.searchParams.set("page",o),s(n.href,{preserveState:!0})}const a=Number(n.searchParams.get("page")||1);return{pageNums:G(a,e),changePage:t}}function G(e,s){const t=[];for(let a=1;a<=s;a++)t.push(a);if(s<=10)return t;{const a=Math.floor(t.indexOf(e)/10)*10,o=a+10;return t.slice(a,o)}}function se({currentPage:e,totalPages:s}){const{pageNums:n,changePage:t}=_(s);return r.jsxs(u,{className:"justify-content-center align-items-center gap-2 mt-3 custom-z-0",children:[r.jsx(u.First,{disabled:e===1,onClick:()=>t(1),className:"custom-fs-28 custom-disable"}),r.jsx(u.Prev,{disabled:e===1,onClick:()=>t(e-1),className:"custom-fs-28 custom-disable"}),n.map(a=>r.jsx(u.Item,{active:a===e,className:"custom-z-0 "+(a===e?"active":""),onClick:()=>t(a),children:a},a)),r.jsx(u.Next,{disabled:e===s,onClick:()=>t(e+1),className:"custom-fs-28 custom-disable"}),r.jsx(u.Last,{disabled:e===s,onClick:()=>t(s),className:"custom-fs-28 custom-disable"})]})}export{se as P,ee as S};
