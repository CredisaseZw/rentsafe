import{r,b as z,j as t}from"./main-66671e9f.js";import{_ as I}from"./lodash-ccce9e4b.js";function P({delay:u=500,url:m,value:l,setValue:p,placeholder:j,type:i,setLeaseId:C,setCustomerName:f,setOpeningBalance:b,setEndDate:g}){const[k,c]=r.useState(!1),[h,n]=r.useState(!1),[R,x]=r.useState(!1),[_,y]=r.useState(""),[S,d]=r.useState([]),[D,E]=r.useState([]);r.useEffect(()=>{if(!l){d([]);return}const e=I.debounce(a=>{a.length<3||R||(n(!0),z.post(m,{searchParam:"guess",searchValue:a}).then(o=>{var v,w;((v=o.data)==null?void 0:v.status)!=="failed"?(E([...o.data]),d(i==="company"?o.data.map(s=>({label:s.company_name,value:s.lease_id})):o.data.map(s=>({label:s.full_name,value:s.lease_id}))),y(""),n(!1)):(d([]),n(!1),y((w=o.data)==null?void 0:w.result))}))},u);return e(l),n(!1),()=>{e.cancel()}},[u,m,l]);const L=e=>{x(!0);const a=D.find(o=>o.lease_id===e.value);C(e.value),p(e.label),f&&f(e.label),b&&b(i==="company"?a.company_opening_balance:a.opening_balance),g&&g(i==="company"?a.company_opening_balance_date:a.opening_balance_date),c(!1),x(!1)};return t.jsxs("div",{style:{width:"100%",border:"1px solid gray",borderRadius:"0.5rem",position:"relative"},children:[t.jsx("input",{type:"text",placeholder:j,value:l,onChange:e=>p(e.target.value),onFocus:()=>c(!0),onBlur:()=>{setTimeout(()=>c(!1),200)},style:{width:"100%",padding:"0.2rem",fontSize:"1rem",border:"none",borderRadius:"0.5rem",backgroundColor:"#eee",color:"black",opacity:"0.8"},className:"form-control"}),k&&t.jsx("div",{style:{border:"2px #ccc solid",borderRadius:"0.5rem",backgroundColor:"#d9d9d9",padding:"1rem 0.2rem",height:"250px",overflowY:"scroll",width:"100%",marginTop:"0.1rem",position:"absolute",top:"100%",left:"0",zIndex:"100"},children:!h&&_?t.jsx("div",{style:{color:"red",margin:"auto"},children:_}):h&&S.length===0?t.jsx("div",{style:{color:"black",margin:"auto"},children:"Loading..."}):S.map((e,a)=>t.jsx("div",{onClick:()=>L(e),style:{cursor:"pointer",padding:"0.2rem 0.5rem",color:"black",opacity:"0.8",backgroundColor:"#d3d3d3",borderRadius:"0.5rem",margin:"0.5rem 0"},children:e.label},a))})]})}export{P as default};
