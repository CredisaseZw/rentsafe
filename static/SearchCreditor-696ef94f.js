import{r as t,b as D,j as r}from"./main-76766219.js";import{_ as L,u as R}from"./index-7202a5e9.js";import"./formatting-345d2430.js";function I({delay:i=500,url:u,value:o,setValue:m,placeholder:v,setLeaseId:w,setCreditorName:p,setOpeningBalance:f,setEndDate:h}){const[y,l]=t.useState(!1),[b,n]=t.useState(!1),[N,g]=t.useState(!1),[x,_]=t.useState(""),[S,c]=t.useState([]),[C,E]=t.useState([]);t.useEffect(()=>{if(!o){c([]);return}const e=L.debounce(a=>{a.length<3||N||(n(!0),D.post(u,{searchParam:"guess",searchValue:a}).then(s=>{var j;((j=s.data)==null?void 0:j.status)!=="failed"?(E([...s.data]),c(s.data.map(d=>({label:d.company_name||d.full_name,value:d.lease_id}))),_(""),n(!1)):(c([]),n(!1),_(R(s)))}))},i);return e(o),n(!1),()=>{e.cancel()}},[i,u,o]);const k=e=>{g(!0);const a=C.find(s=>s.lease_id===e.value);w(e.value),m(e.label),p&&p(e.label),f&&f(a.company_opening_balance||a.opening_balance),h&&h(a.company_opening_balance_date||a.opening_balance_date),l(!1),g(!1)};return r.jsxs("div",{className:"position-relative",children:[r.jsx("input",{type:"text",placeholder:v,required:!0,value:o,onChange:e=>m(e.target.value),onFocus:()=>l(!0),onBlur:()=>{setTimeout(()=>l(!1),200)},className:"form-control c-bg-light"}),y&&o&&r.jsx("div",{style:{overflowY:"auto"},className:"border border-dark rounded-1 c-bg-light custom-h-2 w-100 position-absolute mt-1 top-100 start-0 z-1",children:!b&&x?r.jsx("div",{className:"text-danger p-2",children:x}):b&&S.length===0?r.jsx("div",{className:"p-2",children:"Loading..."}):S.map((e,a)=>r.jsx("div",{onClick:()=>k(e),className:"c-pointer p-1 small border-bottom border-dark",children:e.label},a))})]})}export{I as default};
