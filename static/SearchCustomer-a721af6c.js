import{r as s,b as R,j as o}from"./main-5b40e739.js";import{_ as q}from"./lodash-7ed354f0.js";function I({delay:u=500,url:m,value:r,setValue:f,placeholder:y,type:d,setLeaseId:C,setCustomerName:p,setOpeningBalance:b,setEndDate:h}){const[N,i]=s.useState(!1),[g,n]=s.useState(!1),[k,_]=s.useState(!1),[x,S]=s.useState(""),[j,c]=s.useState([]),[D,E]=s.useState([]);s.useEffect(()=>{if(!r){c([]);return}const e=q.debounce(a=>{a.length<3||k||(n(!0),R.post(m,{searchParam:"guess",searchValue:a}).then(t=>{var v,w;((v=t.data)==null?void 0:v.status)!=="failed"?(E([...t.data]),c(d==="company"?t.data.map(l=>({label:l.company_name,value:l.lease_id})):t.data.map(l=>({label:l.full_name,value:l.lease_id}))),S(""),n(!1)):(c([]),n(!1),S((w=t.data)==null?void 0:w.result))}))},u);return e(r),n(!1),()=>{e.cancel()}},[u,m,r]);const L=e=>{_(!0);const a=D.find(t=>t.lease_id===e.value);C(e.value),f(e.label),p&&p(e.label),b&&b(d==="company"?a.company_opening_balance:a.opening_balance),h&&h(d==="company"?a.company_opening_balance_date:a.opening_balance_date),i(!1),_(!1)};return o.jsxs("div",{className:"position-relative",children:[o.jsx("input",{type:"text",placeholder:y,required:!0,value:r,onChange:e=>f(e.target.value),onFocus:()=>i(!0),onBlur:()=>{setTimeout(()=>i(!1),200)},className:"form-control c-bg-light"}),N&&r&&o.jsx("div",{style:{overflowY:"auto"},className:"border border-dark rounded-1 c-bg-light custom-h-2 w-100 position-absolute mt-1 top-100 start-0 z-1",children:!g&&x?o.jsx("div",{className:"text-danger p-2",children:x}):g&&j.length===0?o.jsx("div",{className:"p-2",children:"Loading..."}):j.map((e,a)=>o.jsx("div",{onClick:()=>L(e),className:"c-pointer p-1 small border-bottom border-dark",children:e.label},a))})]})}export{I as default};
