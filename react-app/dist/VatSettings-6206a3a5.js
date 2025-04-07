var A=Object.defineProperty,C=Object.defineProperties;var R=Object.getOwnPropertyDescriptors;var v=Object.getOwnPropertySymbols;var V=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable;var w=(a,s,t)=>s in a?A(a,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[s]=t,y=(a,s)=>{for(var t in s||(s={}))V.call(s,t)&&w(a,t,s[t]);if(v)for(var t of v(s))F.call(s,t)&&w(a,t,s[t]);return a},T=(a,s)=>C(a,R(s));import{r as p,b as f,_ as j,j as e}from"./main-13c4959c.js";import{L as E}from"./Layout-43e13fa9.js";import{u as S}from"./index-be7773a3.js";import"./lodash-b4f5a0b3.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-2ac5390d.js";import"./Modal-187d8da3.js";import"./index-5f18d908.js";import"./formatting-9de8c923.js";import"./MultipleUpload-d96a866d.js";import"./search-06c27bea.js";function D(){const[a,s]=p.useState([]),[t,b]=p.useState([]),[u,o]=p.useState(!1);function m(){f.get("/accounting/vat-settings/").then(i=>{b(i.data)}).catch(i=>{console.error(i)})}p.useEffect(()=>{m()},[]);function g(){s(i=>[...i,{id:"item-"+Math.random().toString(36).substr(2,9),description:"",rate:""}])}function n(i){s(l=>l.filter(d=>d.id!==i))}function c(i,l,d){d&&s(r=>r.map(x=>x.id===d?T(y({},x),{[i]:l}):x))}function h(i){f.delete(`/accounting/vat-settings/${i.id}/`).then(l=>{j.success("VAT setting deleted successfully"),m()}).catch(l=>{console.error(l),j.error(S(l))})}function k(i){i.preventDefault(),o(!0);const l=new FormData(i.target),d=Array.from(l.entries()).reduce((r,[x,_])=>{const[O,N]=x.split("-");return r[N]||(r[N]={}),r[N][O]=_,r},[]);f.post("/accounting/vat-settings/",d).then(r=>{o(!1),j.success("VAT settings updated successfully"),m(),s([])}).catch(r=>{o(!1),console.error(r),j.error(S(r))})}return{loading:u,taxOptions:t,newTaxOptions:a,handleSubmit:k,changeHandler:c,addNewTaxOption:g,removeTaxOption:h,removeNewTaxOption:n}}function L({}){const{loading:a,taxOptions:s,newTaxOptions:t,handleSubmit:b,changeHandler:u,removeTaxOption:o,addNewTaxOption:m,removeNewTaxOption:g}=D();return e.jsx("main",{children:e.jsxs("form",{className:"row",onSubmit:b,children:[e.jsx("div",{className:"col col-3 py-0",children:e.jsxs("div",{className:"bg-white border custom-rounded-2 shadow-sm p-4",children:[e.jsx("div",{className:"mb-5 fw-bold",children:"Registration"}),e.jsxs("div",{className:"form-check mb-4",children:[e.jsx("input",{className:"form-check-input",disabled:!0,type:"checkbox",value:"registered",id:"vat_registered"}),e.jsx("label",{className:"form-check-label",htmlFor:"vat_registered",children:"V.A.T Registered"})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"vat_registration_number",className:"form-label",children:"V.A.T Registration Number"}),e.jsx("input",{disabled:!0,type:"text",className:"form-control border",id:"vat_registration_number"})]})]})}),e.jsx("div",{className:"col col-9",children:e.jsxs("div",{children:[e.jsx("div",{className:"p-2 fw-bold text-center",children:"Tax Options"}),e.jsx("div",{className:"custom-mn-h-2 mb-3",children:e.jsxs("table",{className:"table table-sm table-respnsive shadow-sm bg-white",children:[e.jsx("thead",{className:"position-sticky c-table-top c-bg-light shadow-sm c-z-5",children:e.jsxs("tr",{className:"c-force-borders text-center",children:[e.jsx("th",{className:"ps-3 text-start",style:{width:"60%"},children:e.jsx("div",{children:" Description"})}),e.jsx("th",{className:"text-start",children:e.jsx("div",{children:"Rate (%) "})}),e.jsx("th",{children:e.jsx("div",{children:" "})})]})}),e.jsxs("tbody",{children:[!(s!=null&&s.length||t!=null&&t.length)&&e.jsx("tr",{children:e.jsx("td",{colSpan:3,children:e.jsx("div",{className:"p-5 bg-white d-flex justify-content-center align-items-center",children:"Nothing to show"})})}),s==null?void 0:s.map((n,c)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:n.description}),e.jsxs("td",{className:"ps-3",children:[n.rate," %"]}),e.jsx("td",{className:"pe-3 custom-mx-w-05 text-end",children:e.jsx("button",{type:"button",className:"btn p-1 btn-sm btn-danger",onClick:()=>o(n),children:e.jsx("i",{className:"material-icons",children:"close"})})})]},c)),t==null?void 0:t.map((n,c)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:e.jsx("div",{children:e.jsx("input",{type:"text",className:"form-control",placeholder:"description",name:"description-"+c,id:"description-"+c,value:n.description,onChange:h=>u("description",h.target.value,n.id)})})}),e.jsx("td",{className:"ps-3",children:e.jsx("div",{children:e.jsx("input",{type:"number",step:.001,className:"form-control",placeholder:"rate in %",name:"rate-"+c,id:"rate-"+c,value:n.rate,onChange:h=>u("rate",h.target.value,n.id)})})}),e.jsx("td",{className:"pe-3 custom-mx-w-05 text-end",children:e.jsx("button",{type:"button",className:"btn btn-sm btn-danger",onClick:()=>g(n.id),children:e.jsx("i",{className:"material-icons",children:"close"})})})]},c))]})]})}),e.jsx("div",{className:"text-end",children:e.jsxs("button",{type:"button",disabled:a,className:"btn btn-outline-info ",onClick:m,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Tax Item"]})}),e.jsx("div",{className:"text-center",children:e.jsxs("button",{disabled:a,type:"submit",className:"btn btn-info text-white",children:[a?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"d-inline-block ms-2",children:"Updating.."})]}):"Update",e.jsx("i",{className:"trailing-icon material-icons",children:"save"})]})})]})})]})})}L.layout=a=>e.jsx(E,{children:a,title:"Sales Categories"});export{L as default};
