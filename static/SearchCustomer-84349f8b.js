import{r,b as D,j as t}from"./main-c668a994.js";import{_ as E}from"./lodash-a8e61fd9.js";function I({delay:c=500,url:u,value:l,setValue:m,placeholder:S,type:p,setLeaseId:_,setCustomerName:b,setOpeningBalance:f}){const[j,i]=r.useState(!1),[g,d]=r.useState(!1),[h,x]=r.useState(""),[y,n]=r.useState([]),[C,k]=r.useState([]);r.useEffect(()=>{if(!l){n([]);return}const e=E.debounce(o=>{d(!0),D.post(u,{searchParam:"guess",searchValue:o}).then(a=>{var w,v;((w=a.data)==null?void 0:w.status)!=="failed"?(p==="company"?(k([...a.data]),n(a.data.map(s=>({label:s.company_name,value:s.lease_id})))):n(a.data.map(s=>({label:s.full_name,value:s.lease_id}))),x(""),d(!1)):(n([]),d(!1),x((v=a.data)==null?void 0:v.result))})},c);return e(l),d(!1),()=>{e.cancel()}},[c,u,l]);const R=e=>{const o=C.find(a=>a.lease_id===e.value);_(e.value),m(e.label),b&&b(e.label),f&&f(p==="company"?o.company_opening_balance:o.opening_balance),i(!1)};return t.jsxs("div",{style:{width:"100%",border:"1px solid gray",borderRadius:"0.5rem",position:"relative"},children:[t.jsx("input",{type:"text",placeholder:S,value:l,onChange:e=>m(e.target.value),onFocus:()=>i(!0),onBlur:()=>{setTimeout(()=>i(!1),200)},style:{width:"100%",padding:"0.2rem",fontSize:"1rem",border:"none",borderRadius:"0.5rem",backgroundColor:"#eee",color:"black",opacity:"0.8"},className:"form-control"}),j&&t.jsx("div",{style:{border:"2px #ccc solid",borderRadius:"0.5rem",backgroundColor:"#d9d9d9",padding:"1rem 0.2rem",height:"250px",overflowY:"scroll",width:"100%",marginTop:"0.1rem",position:"absolute",top:"100%",left:"0",zIndex:"100"},children:!g&&h?t.jsx("div",{style:{color:"red",margin:"auto"},children:h}):g&&y.length===0?t.jsx("div",{style:{color:"black",margin:"auto"},children:"Loading..."}):y.map((e,o)=>t.jsx("div",{onClick:()=>R(e),style:{cursor:"pointer",padding:"0.2rem 0.5rem",color:"black",opacity:"0.8",backgroundColor:"#d3d3d3",borderRadius:"0.5rem",margin:"0.5rem 0"},children:e.label},o))})]})}export{I as default};
