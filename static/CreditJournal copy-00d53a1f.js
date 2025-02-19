var z=Object.defineProperty,Y=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var O=Object.getOwnPropertySymbols;var K=Object.prototype.hasOwnProperty,M=Object.prototype.propertyIsEnumerable;var J=(n,i,t)=>i in n?z(n,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[i]=t,d=(n,i)=>{for(var t in i||(i={}))K.call(i,t)&&J(n,t,i[t]);if(O)for(var t of O(i))M.call(i,t)&&J(n,t,i[t]);return n},o=(n,i)=>Y(n,G(i));var W=(n,i,t)=>new Promise((y,m)=>{var j=l=>{try{u(t.next(l))}catch(p){m(p)}},v=l=>{try{u(t.throw(l))}catch(p){m(p)}},u=l=>l.done?y(l.value):Promise.resolve(l.value).then(j,v);u((t=t.apply(n,i)).next())});import{r as c,a as F,j as e,b as P}from"./main-40f04849.js";import{L as Q}from"./Layout-af21419b.js";import H from"./SearchCustomer-eedba776.js";import{f as C}from"./formatting-345d2430.js";import{I as X,_ as N}from"./index-21c89b93.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-40eb03ce.js";import"./lodash-5d2bc1a5.js";import"./Modal-ed071cf6.js";import"./index-84a5df58.js";function Z(){const[n,i]=c.useState(""),[t,y]=c.useState(""),[m,j]=c.useState(""),[v,u]=c.useState(""),[l,p]=c.useState(""),[h,B]=c.useState(""),[S,A]=c.useState(""),[L,D]=c.useState(""),[I,E]=c.useState(""),[T,U]=c.useState(""),[V,b]=c.useState(!1),k=r=>W(this,null,function*(){r.preventDefault(),b(!0),N.loading("Creating journal entry(s)",{id:"create-sub"});let R=[];if(a.customerName!==""&&s.customerName!=="")R=[d({},a),d({},s)];else if(a.customerName!==""&&s.customerName==="")R=[d({},a)];else if(a.customerName===""&&s.customerName!=="")R=[d({},s)];else{N.error("All fields are required",{id:"create-sub"}),b(!1);return}try{const f=yield P.post(reverseUrl("credit_journal"),R);if(f.data.status==="failed"){i(f.data.error),N.error(f.data.error,{id:"create-sub"}),b(!1);return}q(),N.success("Journal entry(s) created successfully",{id:"create-sub"}),b(!1),D(""),E(""),j(""),B(""),A(""),U(""),y(""),p("")}catch(f){N.error(f.message,{id:"create-sub"}),i(f),b(!1)}}),w=r=>{r.target.id==="creditAmount"?x(o(d({},a),{[r.target.id]:r.target.value,endBalance:Number(a.accountBalance)-Number(r.target.value)})):x(o(d({},a),{[r.target.id]:r.target.value}))},_=r=>{r.target.id==="creditAmount"?g(o(d({},s),{[r.target.id]:r.target.value,endBalance:Number(s.accountBalance)-Number(r.target.value)})):g(o(d({},s),{[r.target.id]:r.target.value}))},{data:a,setData:x,post:$,reset:q}=F({customerName:"",leaseId:"",customerClass:"",date:new Date().toISOString().split("T")[0],accountBalance:"",creditAmount:"",details:"",endBalance:""}),{data:s,setData:g}=F({customerName:"",leaseId:"",customerClass:"",date:new Date().toISOString().split("T")[0],accountBalance:"",creditAmount:"",details:"",endBalance:""});return c.useEffect(()=>{t==="company"&&(x(o(d({},a),{customerClass:"company"})),u(reverseUrl("get_client_company_journals"))),t==="individual"&&(x(o(d({},a),{customerClass:"individual"})),u(reverseUrl("get_client_individual_journals")))},[t]),c.useEffect(()=>{l==="company"&&(g(o(d({},s),{customerClass:"company"})),u(reverseUrl("get_client_company_journals"))),l==="individual"&&(g(o(d({},s),{customerClass:"individual"})),u(reverseUrl("get_client_individual_journals")))},[l]),c.useEffect(()=>{t==="company"&&m!==""&&x(o(d({},a),{customerName:m,leaseId:L,accountBalance:S})),t==="individual"&&m!==""&&x(o(d({},a),{customerName:m,leaseId:L,accountBalance:S}))},[L,m,t,S]),c.useEffect(()=>{l==="company"&&h!==""&&g(o(d({},s),{customerName:h,leaseId:I,accountBalance:T})),l==="individual"&&h!==""&&g(o(d({},s),{customerName:h,leaseId:I,accountBalance:T}))},[I,T,h,l]),e.jsxs("div",{className:"card card-raised mb-5",style:{height:"60vh",width:"100%",marginInline:"-25px",paddingRight:"30px",paddingLeft:"15px"},children:[e.jsx(X,{}),e.jsx("div",{className:"mt-2 p-1 bg-danger",children:e.jsx("h5",{className:"text-white text-center",children:"Credit Journal"})}),e.jsx("div",{className:"card-body p-4 ",style:{height:"60vh"},children:e.jsxs("div",{className:"table-responsive",style:{overflowY:"visible",height:"100%"},children:[e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderTop:"0px",fontSize:"12px"},children:[e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Date"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Customer Type"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Customer"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Details"}),e.jsx("th",{scope:"col",className:"text-end",style:{borderTop:"1px solid #e0e0e0"},children:"Account Balance"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Credit Amount"}),e.jsx("th",{scope:"col",className:"text-end",style:{borderTop:"1px solid #e0e0e0"},children:"End Balance"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("th",{scope:"row",className:"tf-borderRight tf-borderLeft",children:e.jsx("input",{type:"date",className:"form-control form-control-sm tf-borderRight tf-input",name:"date",id:"date",value:a.date,onChange:w})}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:e.jsxs("select",{onChange:r=>y(r.target.value),className:"form-select form-select-sm tf-borderRight tf-input",name:"customerType",value:t,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"individual",children:"I"}),e.jsx("option",{value:"company",children:"C"})]})}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",position:"relative"},children:[e.jsx(H,{value:m,setValue:j,url:v,placeholder:"Start typing",delay:500,type:t,setCustomerName:j,setLeaseId:D,setOpeningBalance:A}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.customerName})]}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",minWidth:"200px"},children:e.jsx("textarea",{name:"details",className:"form-control form-control-sm tf-input",rows:2,id:"details",value:a.details,onChange:w})}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:a.accountBalance?C(Number(a.accountBalance)):""}),e.jsx("td",{className:"tf-borderRight",style:{maxWidth:"40px",paddingRight:"1px",paddingLeft:"1px"},children:e.jsx("input",{onChange:w,className:"form-control form-control-sm tf-borderRight tf-input",type:"text",id:"creditAmount",value:a.creditAmount})}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:a.endBalance?C(Number(a.endBalance)):""})]}),e.jsxs("tr",{children:[e.jsx("th",{scope:"row",className:"tf-borderRight tf-borderLeft",children:e.jsx("input",{type:"date",className:"form-control form-control-sm tf-borderRight tf-input",name:"date",id:"date",value:s.date,onChange:_})}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:e.jsxs("select",{onChange:r=>p(r.target.value),className:"form-select form-select-sm tf-borderRight tf-input",name:"customerType2",value:l,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"individual",children:"I"}),e.jsx("option",{value:"company",children:"C"})]})}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",position:"relative"},children:[e.jsx(H,{value:h,setValue:B,url:v,placeholder:"Start typing",delay:500,type:l,setCustomerName:B,setLeaseId:E,setOpeningBalance:U}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.customerName2})]}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",minWidth:"200px"},children:e.jsx("textarea",{name:"details",className:"form-control form-control-sm tf-input",rows:2,id:"details",value:s.details,onChange:_})}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:s.accountBalance?C(Number(s.accountBalance)):""}),e.jsx("td",{className:"tf-borderRight",style:{maxWidth:"40px",paddingRight:"1px",paddingLeft:"1px"},children:e.jsx("input",{onChange:_,className:"form-control form-control-sm tf-borderRight tf-input",type:"text",id:"creditAmount",value:s.creditAmount})}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:s.endBalance?C(Number(s.endBalance)):""})]})]})]}),e.jsx("div",{className:"d-flex justify-content-end",children:e.jsxs("button",{className:"btn btn-success btn-raised text-white",children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Row"]})}),e.jsx("div",{className:"d-flex justify-content-center",children:e.jsx("button",{className:"btn btn-info btn-raised text-white",onClick:k,children:V?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):e.jsx(e.Fragment,{children:"Submit"})})})]})})]})}Z.layout=n=>e.jsx(Q,{children:n,title:"Customer Credit Adjustment - Credit Journal"});export{Z as default};
