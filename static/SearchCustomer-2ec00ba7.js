import{r as s,b as L,j as o}from"./main-92093c4c.js";import{_ as R}from"./lodash-a15548bd.js";import{u as F}from"./index-ea250f19.js";import"./formatting-9de8c923.js";function T({delay:m=500,url:u,value:r,setValue:p,placeholder:w,type:d,setLeaseId:y,setCustomerName:f,setOpeningBalance:b,setEndDate:h}){const[C,i]=s.useState(!1),[g,n]=s.useState(!1),[N,_]=s.useState(!1),[x,S]=s.useState(""),[j,c]=s.useState([]),[E,k]=s.useState([]);s.useEffect(()=>{if(!r){c([]);return}const e=R.debounce(a=>{a.length<3||N||(n(!0),L.post(u,{searchParam:"guess",searchValue:a}).then(t=>{var v;((v=t.data)==null?void 0:v.status)!=="failed"?(k([...t.data]),c(d==="company"?t.data.map(l=>({label:l.company_name,value:l.lease_id})):t.data.map(l=>({label:l.full_name,value:l.lease_id}))),S(""),n(!1)):(c([]),n(!1),S(F(t)))}))},m);return e(r),n(!1),()=>{e.cancel()}},[m,u,r]);const D=e=>{_(!0);const a=E.find(t=>t.lease_id===e.value);y(e.value),p(e.label),f&&f(e.label),b&&b(d==="company"?a.company_opening_balance:a.opening_balance),h&&h(d==="company"?a.company_opening_balance_date:a.opening_balance_date),i(!1),_(!1)};return o.jsxs("div",{className:"position-relative",children:[o.jsx("input",{type:"text",placeholder:w,required:!0,value:r,onChange:e=>p(e.target.value),onFocus:()=>i(!0),onBlur:()=>{setTimeout(()=>i(!1),200)},className:"form-control c-bg-light"}),C&&r&&o.jsx("div",{style:{overflowY:"auto"},className:"border border-dark rounded-1 c-bg-light custom-h-2 w-100 position-absolute mt-1 top-100 start-0 z-1",children:!g&&x?o.jsx("div",{className:"text-danger p-2",children:x}):g&&j.length===0?o.jsx("div",{className:"p-2",children:"Loading..."}):j.map((e,a)=>o.jsx("div",{onClick:()=>D(e),className:"c-pointer p-1 small border-bottom border-dark",children:e.label},a))})]})}export{T as default};
