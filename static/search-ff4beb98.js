import{r as s,b as T,u as F,j as t}from"./main-5b40e739.js";import{_ as Y}from"./lodash-7ed354f0.js";import{_ as q}from"./index-6f7cd0f9.js";function J({delay:p=500,url:f,value:d,setValue:b,placeholder:L,type:R,setAddress:h,setClientId:z,setRegNumber:l,setClientName:g,setMobileNo:x,from:u="subs"}){var j,k,C;const[B,c]=s.useState(!1),[y,i]=s.useState(!1),[v,S]=s.useState(""),[w,n]=s.useState([]),[m,I]=s.useState([]);s.useEffect(()=>{if(!d){n([]);return}const a=Y.debounce(r=>{i(!0),T.post(f,{searchParam:"guess",searchValue:r}).then(e=>{var D,E;((D=e.data)==null?void 0:D.status)!=="failed"?(R==="company"?(I([...e.data]),n(e.data.map(o=>({label:o.registration_name+"("+o.registration_number+")",value:o.id})))):n(e.data.map(o=>({label:o.firstname+" "+o.surname+"("+o.national_id+")",value:o.id}))),S(""),i(!1)):(n([]),i(!1),S((E=e.data)==null?void 0:E.result))})},p);return a(d),i(!1),()=>{a.cancel()}},[p,f,d]);const _=(C=(k=(j=F().props)==null?void 0:j.Auth)==null?void 0:k.company)==null?void 0:C.company_id,P=a=>{const r=Number(a.value)===Number(_);if(console.log({selected_company_id:a.value,company_id:_,isSelfCompany:r}),r){q.error("Blocked, a company cannot create a lease on itself");return}z(a.value),b(a.label),g&&g(a.label.split("(")[0]),l&&u==="subs"&&l(a.label.split("(").at(-1).split(")")[0]),l&&u==="leases"&&l(m.find(e=>e.id===a.value).email),x&&u==="leases"&&x(m.find(e=>e.id===a.value).mobile),h&&h(m.find(e=>e.id===a.value).address),c(!1)};return t.jsxs("div",{style:{width:"100%",border:"1px solid gray",borderRadius:"0.5rem",position:"relative"},children:[t.jsx("input",{type:"text",placeholder:L,value:d,onChange:a=>b(a.target.value),onFocus:()=>c(!0),onBlur:()=>{setTimeout(()=>c(!1),200)},style:{width:"100%",padding:"0.2rem",fontSize:"1rem",border:"none",borderRadius:"0.5rem",backgroundColor:"#eee",color:"black",opacity:"0.8"},className:"form-control"}),B&&t.jsx("div",{style:{border:"2px #ccc solid",borderRadius:"0.5rem",backgroundColor:"#d9d9d9",padding:"1rem 0.2rem",height:"250px",overflowY:"scroll",width:"100%",marginTop:"0.1rem",position:"absolute",top:"100%",left:"0",zIndex:"100"},children:!y&&v?t.jsx("div",{style:{color:"red",margin:"auto"},children:v}):y&&w.length===0?t.jsx("div",{style:{color:"black",margin:"auto"},children:"Loading..."}):w.map((a,r)=>t.jsx("div",{onClick:()=>P(a),style:{cursor:"pointer",padding:"0.2rem 0.5rem",color:"black",opacity:"0.8",backgroundColor:"#d3d3d3",borderRadius:"0.5rem",margin:"0.5rem 0"},children:a.label},r))})]})}export{J as S};
