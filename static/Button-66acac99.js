var g=Object.defineProperty,y=Object.defineProperties;var E=Object.getOwnPropertyDescriptors;var r=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;var c=(t,s,o)=>s in t?g(t,s,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[s]=o,e=(t,s)=>{for(var o in s||(s={}))p.call(s,o)&&c(t,o,s[o]);if(r)for(var o of r(s))i.call(s,o)&&c(t,o,s[o]);return t},x=(t,s)=>y(t,E(s));var B=(t,s)=>{var o={};for(var a in t)p.call(t,a)&&s.indexOf(a)<0&&(o[a]=t[a]);if(t!=null&&r)for(var a of r(t))s.indexOf(a)<0&&i.call(t,a)&&(o[a]=t[a]);return o};import{u as R,c as h}from"./Modal-10c8c26e.js";import{r as w,j as C}from"./main-4a381f5d.js";import{u as k}from"./Button-d87a5d70.js";const l=w.forwardRef((q,j)=>{var u=q,{as:t,bsPrefix:s,variant:o="primary",size:a,active:N=!1,disabled:m=!1,className:$}=u,n=B(u,["as","bsPrefix","variant","size","active","disabled","className"]);const f=R(s,"btn"),[P,{tagName:b}]=k(e({tagName:t,disabled:m},n)),d=b;return C.jsx(d,x(e(e({},P),n),{ref:j,disabled:m,className:h($,f,N&&"active",o&&`${f}-${o}`,a&&`${f}-${a}`,n.href&&m&&"disabled")}))});l.displayName="Button";const G=l;export{G as B};
