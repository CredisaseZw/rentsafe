import{r as t,b as L,j as o}from"./main-cecc6bb7.js";import{_ as R}from"./lodash-a6dd6483.js";function F({delay:i=500,url:u,value:r,setValue:m,placeholder:w,setLeaseId:N,setCreditorName:f,setOpeningBalance:p,setEndDate:h}){const[y,n]=t.useState(!1),[b,l]=t.useState(!1),[C,g]=t.useState(!1),[x,_]=t.useState(""),[S,c]=t.useState([]),[k,D]=t.useState([]);t.useEffect(()=>{if(!r){c([]);return}const e=R.debounce(a=>{a.length<3||C||(l(!0),L.post(u,{searchParam:"guess",searchValue:a}).then(s=>{var j,v;((j=s.data)==null?void 0:j.status)!=="failed"?(D([...s.data]),c(s.data.map(d=>({label:d.company_name||d.full_name,value:d.lease_id}))),_(""),l(!1)):(c([]),l(!1),_((v=s.data)==null?void 0:v.result))}))},i);return e(r),l(!1),()=>{e.cancel()}},[i,u,r]);const E=e=>{g(!0);const a=k.find(s=>s.lease_id===e.value);N(e.value),m(e.label),f&&f(e.label),p&&p(a.company_opening_balance||a.opening_balance),h&&h(a.company_opening_balance_date||a.opening_balance_date),n(!1),g(!1)};return o.jsxs("div",{className:"position-relative",children:[o.jsx("input",{type:"text",placeholder:w,required:!0,value:r,onChange:e=>m(e.target.value),onFocus:()=>n(!0),onBlur:()=>{setTimeout(()=>n(!1),200)},className:"form-control c-bg-light"}),y&&r&&o.jsx("div",{style:{overflowY:"auto"},className:"border border-dark rounded-1 c-bg-light custom-h-2 w-100 position-absolute mt-1 top-100 start-0 z-1",children:!b&&x?o.jsx("div",{className:"text-danger p-2",children:x}):b&&S.length===0?o.jsx("div",{className:"p-2",children:"Loading..."}):S.map((e,a)=>o.jsx("div",{onClick:()=>E(e),className:"c-pointer p-1 small border-bottom border-dark",children:e.label},a))})]})}export{F as default};
