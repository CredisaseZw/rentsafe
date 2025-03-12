var S=Object.defineProperty,C=Object.defineProperties;var D=Object.getOwnPropertyDescriptors;var N=Object.getOwnPropertySymbols;var R=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable;var b=(n,s,a)=>s in n?S(n,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):n[s]=a,g=(n,s)=>{for(var a in s||(s={}))R.call(s,a)&&b(n,a,s[a]);if(N)for(var a of N(s))P.call(s,a)&&b(n,a,s[a]);return n},v=(n,s)=>C(n,D(s));var w=(n,s,a)=>new Promise((l,c)=>{var d=t=>{try{o(a.next(t))}catch(r){c(r)}},m=t=>{try{o(a.throw(t))}catch(r){c(r)}},o=t=>t.done?l(t.value):Promise.resolve(t.value).then(d,m);o((a=a.apply(n,s)).next())});import{r as p,a as k,j as e,u as y}from"./main-605f1a65.js";import{h as q,R as H,L as T}from"./Layout-d8d0e5c9.js";import{M as u}from"./Modal-fa119524.js";import{B as F}from"./Button-0acd9d5a.js";import{h as z}from"./html2pdf-2236ebfb.js";import{a as B,f as j}from"./formatting-9de8c923.js";import"./lodash-65d1f6eb.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-2f25b0a4.js";import"./MultipleUpload-3f80ff47.js";import"./index-5b34db9a.js";import"./search-7ba8f0d2.js";import"./index-4b3e425d.js";import"./Button-5d19e586.js";const E=({show:n,handleClose:s,tenantData:a})=>{const[l,c]=p.useState(!1),{data:d,post:m,setData:o,errors:t}=k({tenantNumber:(a==null?void 0:a.tenantNumber)||"",name:(a==null?void 0:a.name)||"",adress:(a==null?void 0:a.adress)||"",startDate:"",endDate:""}),r=x=>{o(v(g({},d),{[x.target.id]:x.target.value}))},h=x=>{x.preventDefault(),c(!0),m("/client/period-request",{onSuccess:()=>{c(!1),s()}})};return e.jsx(e.Fragment,{children:e.jsx(u,{size:"lg",show:n,onHide:s,children:e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx(u.Header,{closeButton:!0,className:"card-header bg-info px-4",children:e.jsxs("div",{className:`d-flex justify-content-between
                            align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:"Tenant Statement Period Request"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"card",children:e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(u.Body,{children:[e.jsxs("div",{className:"row",children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"col-md-12 my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Tenant Number"," ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:d.tenantNumber,onChange:r,type:"text",name:"tenantNumber",required:!0,id:"tenantNumber",placeholder:"Enter tenant number",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.tenantNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:d.name,onChange:r,type:"text",name:"name",required:!0,id:"name",placeholder:"Enter tenant's full name",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.name})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:d.adress,onChange:r,type:"text",required:!0,name:"adress",id:"adress",placeholder:"Enter tenant's address",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.adress})]})]})})]}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["From",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:d.startDate,onChange:r,type:"date",name:"startDate",id:"startDate",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.startDate})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["To",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:d.endDate,onChange:r,type:"date",name:"endDate",id:"endDate",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.endDate})]})]})})})]}),e.jsx(u.Footer,{children:e.jsx(F,{className:"text-white",variant:"info",onClick:h,disabled:l,children:l?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Submit"})})]})})})]})})})})},L=E;function A(){const{detailed_statement:n,tenant_details:s,monthly_payments:a,missed_payments:l}=y().props,c=p.useRef(),[d,m]=p.useState(!1),[o,t]=p.useState(!1),[r,h]=p.useState({lease_id:s.lease_id}),x=B(a,l),i=()=>m(!1);function f(){const _=c.current;z().from(_).set({margin:1,filename:"modal-content.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()}return console.log({details:r,payments:a,invoices:l}),{show:d,tenant:s,details:r,statement:n,showReceipt:o,cleanedData:x,modalContentRef:c,setShow:m,setDetails:h,handleClose:i,setShowReceipt:t,handlePrintToPdf:f}}function M(){const{show:n,tenant:s,details:a,statement:l,showReceipt:c,cleanedData:d,modalContentRef:m,setShow:o,setDetails:t,handleClose:r,setShowReceipt:h,handlePrintToPdf:x}=A();return l?e.jsxs("div",{children:[e.jsx(L,{show:n,handleClose:r,tenantData:{tenantNumber:s.lease_receiver_id,name:s.lease_receiver_name,adress:s.lease_receiver_address}}),e.jsxs("div",{ref:m,children:[e.jsx("div",{style:{lineHeight:"5px",fontSize:"18px"},className:"bg-info",children:e.jsxs("div",{scope:"row",colSpan:5,className:"d-flex justify-content-between align-items-center text-white p-3",style:{width:"100%"},children:[e.jsxs("div",{className:"d-flex flex-column gap-2",children:[e.jsxs("h4",{className:"fw-bold text-white",children:[s.lease_receiver_name," - ",s==null?void 0:s.currency]}),e.jsxs("p",{children:[s.lease_receiver_address," "]})]}),e.jsx("p",{children:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]})}),e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{className:"position-sticky c-table-top",children:e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#a0a0af"},children:[e.jsx("th",{scope:"",children:"Date"}),e.jsx("td",{children:"Description"}),e.jsx("td",{children:" Ref"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Balance"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:l.date}),e.jsx("td",{children:l.description}),e.jsx("td",{}),e.jsx("td",{className:"text-end"}),e.jsx("td",{className:"text-end",children:j(l.balance_amount)})]}),d.map((i,f)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:q(i.date).format("YYYY-MM-DD")}),e.jsxs("td",{children:[i.description," "]}),e.jsx("td",{children:i.reference}),e.jsx("td",{className:"text-end",children:i.owing_amount<0?`(${j(i.owing_amount*-1)})`:j(i.owing_amount)}),e.jsx("td",{className:"text-end",children:i.balance_amount<0?`(${j(i.balance_amount*-1)})`:j(i.balance_amount)})]},f))]})]})]}),e.jsxs("div",{className:"d-flex justify-content-end align-items-center gap-4 p-4",children:[e.jsx("button",{className:"btn btn-secondary",onClick:()=>{h(!0),t({lease_id:s.lease_id})},children:"Receipt"}),e.jsx("button",{className:"btn btn-primary",onClick:()=>o(!0),children:"Period request"}),e.jsx("button",{className:"btn btn-info text-white",onClick:x,children:"Print"})]}),e.jsx(H,{show:c,handleClose:i=>w(this,null,function*(){h(!1),t({})}),leaseDetails:a,myKey:"statements"})]}):e.jsx("div",{children:e.jsx("h1",{children:y().props.message})})}M.layout=n=>e.jsx(T,{children:n,title:"Tenant Detailed Statement"});export{M as default};
