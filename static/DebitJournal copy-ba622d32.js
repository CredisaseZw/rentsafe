var q=Object.defineProperty,z=Object.defineProperties;var Y=Object.getOwnPropertyDescriptors;var W=Object.getOwnPropertySymbols;var G=Object.prototype.hasOwnProperty,K=Object.prototype.propertyIsEnumerable;var O=(n,i,t)=>i in n?q(n,i,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[i]=t,l=(n,i)=>{for(var t in i||(i={}))G.call(i,t)&&O(n,t,i[t]);if(W)for(var t of W(i))K.call(i,t)&&O(n,t,i[t]);return n},c=(n,i)=>z(n,Y(i));var J=(n,i,t)=>new Promise((N,m)=>{var j=d=>{try{u(t.next(d))}catch(h){m(h)}},v=d=>{try{u(t.throw(d))}catch(h){m(h)}},u=d=>d.done?N(d.value):Promise.resolve(d.value).then(j,v);u((t=t.apply(n,i)).next())});import{r as o,a as F,j as e,b as M}from"./main-31171515.js";import{L as Q}from"./Layout-ba608618.js";import H from"./SearchCustomer-920529ad.js";import{f as B}from"./formatting-345d2430.js";import{I as X,_ as b}from"./index-67f02c63.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-95edf536.js";import"./lodash-2db69952.js";import"./index-4b8db17e.js";import"./Modal-74779aca.js";import"./index-9223fb9e.js";function Z(){const[n,i]=o.useState(""),[t,N]=o.useState(""),[m,j]=o.useState(""),[v,u]=o.useState(""),[d,h]=o.useState(""),[x,C]=o.useState(""),[S,A]=o.useState(""),[L,D]=o.useState(""),[I,E]=o.useState(""),[T,U]=o.useState(""),[P,y]=o.useState(!1),V=r=>J(this,null,function*(){r.preventDefault(),y(!0),b.loading("Processing..",{id:"create-sub"});let R=[];if(a.customerName!==""&&s.customerName!=="")R=[l({},a),l({},s)];else if(a.customerName!==""&&s.customerName==="")R=[l({},a)];else if(a.customerName===""&&s.customerName!=="")R=[l({},s)];else{b.error("All fields are required",{id:"create-sub"}),y(!1);return}try{const p=yield M.post(reverseUrl("debit_journal"),R);if(p.data.status==="failed"){i([p.data.error]),b.error(p.data.error,{id:"create-sub"}),y(!1);return}k(),b.success("Journal entry(s) created successfully",{id:"create-sub"}),y(!1),D(""),E(""),j(""),C(""),A(""),U(""),N(""),h("")}catch(p){console.log(p),b.error("An error occurred. Please try again",{id:"create-sub"}),b.error(p.message,{id:"create-sub"}),i(p),y(!1)}}),{data:a,setData:g,post:$,reset:k}=F({customerName:"",leaseId:"",customerClass:"",date:new Date().toISOString().split("T")[0],accountBalance:"",debitAmount:"",details:"",endBalance:""}),{data:s,setData:f}=F({customerName:"",leaseId:"",customerClass:"",date:new Date().toISOString().split("T")[0],accountBalance:"",debitAmount:"",details:"",endBalance:""}),w=r=>{r.target.id==="debitAmount"?g(c(l({},a),{[r.target.id]:r.target.value,endBalance:Number(a.accountBalance)+Number(r.target.value)})):g(c(l({},a),{[r.target.id]:r.target.value}))},_=r=>{r.target.id==="debitAmount"?f(c(l({},s),{[r.target.id]:r.target.value,endBalance:Number(s.accountBalance)+Number(r.target.value)})):f(c(l({},s),{[r.target.id]:r.target.value}))};return o.useEffect(()=>{t==="company"&&(g(c(l({},a),{customerClass:"company"})),u(reverseUrl("get_client_company_journals"))),t==="individual"&&(g(c(l({},a),{customerClass:"individual"})),u(reverseUrl("get_client_individual_journals")))},[t]),o.useEffect(()=>{d==="company"&&(f(c(l({},s),{customerClass:"company"})),u(reverseUrl("get_client_company_journals"))),d==="individual"&&(f(c(l({},s),{customerClass:"individual"})),u(reverseUrl("get_client_individual_journals")))},[d]),o.useEffect(()=>{t==="company"&&m!==""&&g(c(l({},a),{customerName:m,leaseId:L,accountBalance:S})),t==="individual"&&m!==""&&g(c(l({},a),{customerName:m,leaseId:L,accountBalance:S}))},[L,m,t,S]),o.useEffect(()=>{d==="company"&&x!==""&&f(c(l({},s),{customerName:x,leaseId:I,accountBalance:T})),d==="individual"&&x!==""&&f(c(l({},s),{customerName:x,leaseId:I,accountBalance:T}))},[I,T,x,d]),e.jsxs("div",{className:"card card-raised mb-5",style:{height:"60vh",width:"100%",marginInline:"-25px",paddingRight:"30px",paddingLeft:"15px"},children:[e.jsx(X,{}),e.jsx("div",{className:"p-1 bg-info mt-2",children:e.jsx("h5",{className:"text-white text-center",children:"Debit Journal"})}),e.jsx("div",{className:"card-body p-4 ",style:{height:"60vh"},children:e.jsxs("div",{className:"table-responsive",style:{overflowY:"visible",height:"100%"},children:[e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderTop:"0px",fontSize:"12px"},children:[e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Date"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Customer Type"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Customer"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Details"}),e.jsx("th",{scope:"col",className:"text-end",style:{borderTop:"1px solid #e0e0e0"},children:"Account Balance"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Debit Amount"}),e.jsx("th",{scope:"col",className:"text-end",style:{borderTop:"1px solid #e0e0e0"},children:"End Balance"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("th",{scope:"row",className:"tf-borderRight tf-borderLeft",children:e.jsx("input",{type:"date",className:"form-control form-control-sm tf-borderRight tf-input",name:"date",id:"date",value:a.date,onChange:w})}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:e.jsxs("select",{onChange:r=>N(r.target.value),className:"form-select form-select-sm tf-borderRight tf-input",name:"customerType",value:t,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"individual",children:"I"}),e.jsx("option",{value:"company",children:"C"})]})}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",position:"relative",maxWidth:"100px"},children:[e.jsx(H,{value:m,setValue:j,url:v,placeholder:"Start typing",delay:500,type:t,setCustomerName:j,setLeaseId:D,setOpeningBalance:A}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.customerName})]}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",minWidth:"200px"},children:e.jsx("textarea",{name:"details",className:"form-control form-control-sm tf-input",rows:2,id:"details",value:a.details,onChange:w})}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:a.accountBalance?B(a.accountBalance):""}),e.jsx("td",{className:"tf-borderRight",style:{maxWidth:"40px",paddingRight:"1px",paddingLeft:"1px"},children:e.jsx("input",{onChange:w,className:"form-control form-control-sm tf-borderRight tf-input",type:"text",id:"debitAmount",value:a.debitAmount})}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:a.endBalance?B(a.endBalance):""})]}),e.jsxs("tr",{children:[e.jsx("th",{scope:"row",className:"tf-borderRight tf-borderLeft",children:e.jsx("input",{type:"date",className:"form-control form-control-sm tf-borderRight tf-input",name:"date",id:"date",value:s.date,onChange:_})}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:e.jsxs("select",{onChange:r=>h(r.target.value),className:"form-select form-select-sm tf-borderRight tf-input",name:"customerType2",value:d,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"individual",children:"I"}),e.jsx("option",{value:"company",children:"C"})]})}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",position:"relative",maxWidth:"100px"},children:[e.jsx(H,{value:x,setValue:C,url:v,placeholder:"Start typing",delay:500,type:d,setCustomerName:C,setLeaseId:E,setOpeningBalance:U}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.customerName2})]}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",minWidth:"200px"},children:e.jsx("textarea",{name:"details",className:"form-control form-control-sm tf-input",rows:2,id:"details",value:s.details,onChange:_})}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:s.accountBalance?B(Number(s.accountBalance)):""}),e.jsx("td",{className:"tf-borderRight",style:{maxWidth:"40px",paddingRight:"1px",paddingLeft:"1px"},children:e.jsx("input",{onChange:_,className:"form-control form-control-sm tf-borderRight tf-input",type:"text",id:"debitAmount",value:s.debitAmount})}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:s.endBalance?B(Number(s.endBalance)):""})]})]})]}),e.jsx("div",{className:"d-flex justify-content-end",children:e.jsxs("button",{className:"btn btn-success btn-raised text-white",children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Row"]})}),e.jsx("div",{className:"d-flex justify-content-center",children:e.jsx("button",{className:"btn btn-info btn-raised text-white",onClick:V,children:P?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):e.jsx(e.Fragment,{children:"Submit"})})})]})})]})}Z.layout=n=>e.jsx(Q,{children:n,title:"Customer Credit Adjustment - Debit Journal"});export{Z as default};
