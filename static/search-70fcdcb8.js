import{r as o,b as z,j as s}from"./main-b0023e79.js";import{_ as I}from"./lodash-8b71f7dc.js";function F({delay:p=500,url:b,value:d,setValue:f,placeholder:C,type:D,setAddress:h,setClientId:E,setRegNumber:i,setClientName:g,setMobileNo:x,from:u="subs"}){const[_,c]=o.useState(!1),[v,l]=o.useState(!1),[w,y]=o.useState(""),[S,n]=o.useState([]),[m,L]=o.useState([]);o.useEffect(()=>{if(!d){n([]);return}const a=I.debounce(e=>{l(!0),z.post(b,{searchParam:"guess",searchValue:e}).then(t=>{var j,k;((j=t.data)==null?void 0:j.status)!=="failed"?(D==="company"?(L([...t.data]),n(t.data.map(r=>({label:r.registration_name+"("+r.registration_number+")",value:r.id})))):n(t.data.map(r=>({label:r.firstname+" "+r.surname+"("+r.national_id+")",value:r.id}))),y(""),l(!1)):(n([]),l(!1),y((k=t.data)==null?void 0:k.result))})},p);return a(d),l(!1),()=>{a.cancel()}},[p,b,d]);const R=a=>{E(a.value),f(a.label),g&&g(a.label.split("(")[0]),i&&u==="subs"&&i(a.label.split("(").at(-1).split(")")[0]),i&&u==="leases"&&i(m.find(e=>e.id===a.value).email),x&&u==="leases"&&x(m.find(e=>e.id===a.value).mobile),h&&h(m.find(e=>e.id===a.value).address),c(!1)};return s.jsxs("div",{style:{width:"100%",border:"1px solid gray",borderRadius:"0.5rem",position:"relative"},children:[s.jsx("input",{type:"text",placeholder:C,value:d,onChange:a=>f(a.target.value),onFocus:()=>c(!0),onBlur:()=>{setTimeout(()=>c(!1),200)},style:{width:"100%",padding:"0.2rem",fontSize:"1rem",border:"none",borderRadius:"0.5rem",backgroundColor:"#eee",color:"black",opacity:"0.8"},className:"form-control"}),_&&s.jsx("div",{style:{border:"2px #ccc solid",borderRadius:"0.5rem",backgroundColor:"#d9d9d9",padding:"1rem 0.2rem",height:"250px",overflowY:"scroll",width:"100%",marginTop:"0.1rem",position:"absolute",top:"100%",left:"0",zIndex:"100"},children:!v&&w?s.jsx("div",{style:{color:"red",margin:"auto"},children:w}):v&&S.length===0?s.jsx("div",{style:{color:"black",margin:"auto"},children:"Loading..."}):S.map((a,e)=>s.jsx("div",{onClick:()=>R(a),style:{cursor:"pointer",padding:"0.2rem 0.5rem",color:"black",opacity:"0.8",backgroundColor:"#d3d3d3",borderRadius:"0.5rem",margin:"0.5rem 0"},children:a.label},e))})]})}export{F as S};
