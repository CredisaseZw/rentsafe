var D=Object.defineProperty,R=Object.defineProperties;var P=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable;var b=(r,s,a)=>s in r?D(r,s,{enumerable:!0,configurable:!0,writable:!0,value:a}):r[s]=a,g=(r,s)=>{for(var a in s||(s={}))k.call(s,a)&&b(r,a,s[a]);if(f)for(var a of f(s))q.call(s,a)&&b(r,a,s[a]);return r},v=(r,s)=>R(r,P(s));var w=(r,s,a)=>new Promise((c,o)=>{var d=t=>{try{m(a.next(t))}catch(l){o(l)}},h=t=>{try{m(a.throw(t))}catch(l){o(l)}},m=t=>t.done?c(t.value):Promise.resolve(t.value).then(d,h);m((a=a.apply(r,s)).next())});import{r as i,a as H,j as e,u as j}from"./main-cecc6bb7.js";import{M as N}from"./Modal-f4f0c70d.js";import{B as A}from"./Button-8d3d904d.js";import{R as F,L as M}from"./Layout-5242a342.js";import{h as T}from"./html2pdf-3ba3e0fd.js";import{a as z,f as p}from"./formatting-345d2430.js";import{h as B}from"./moment-686b5dfa.js";import"./removeClass-60541855.js";import"./index-388cb073.js";import"./Button-bd86c829.js";import"./lodash-a6dd6483.js";import"./assertThisInitialized-3be3daa4.js";import"./index-43a92dce.js";const E=({show:r,handleClose:s,tenantData:a})=>{const[c,o]=i.useState(!1),{data:d,post:h,setData:m,errors:t}=H({tenantNumber:(a==null?void 0:a.tenantNumber)||"",name:(a==null?void 0:a.name)||"",adress:(a==null?void 0:a.adress)||"",startDate:"",endDate:""}),l=x=>{m(v(g({},d),{[x.target.id]:x.target.value}))},u=x=>{x.preventDefault(),o(!0),h("/client/period-request",{onSuccess:()=>{o(!1),s()}})};return e.jsx(e.Fragment,{children:e.jsx(N,{size:"lg",show:r,onHide:s,children:e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx(N.Header,{closeButton:!0,className:"card-header bg-info px-4",children:e.jsxs("div",{className:`d-flex justify-content-between
                            align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:"Tenant Statement Period Request"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"card",children:e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(N.Body,{children:[e.jsxs("div",{className:"row",children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"col-md-12 my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Tenant Number"," ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:d.tenantNumber,onChange:l,type:"text",name:"tenantNumber",required:!0,id:"tenantNumber",placeholder:"Enter tenant number",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.tenantNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:d.name,onChange:l,type:"text",name:"name",required:!0,id:"name",placeholder:"Enter tenant's full name",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.name})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:d.adress,onChange:l,type:"text",required:!0,name:"adress",id:"adress",placeholder:"Enter tenant's address",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.adress})]})]})})]}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["From",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:d.startDate,onChange:l,type:"date",name:"startDate",id:"startDate",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.startDate})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["To",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:d.endDate,onChange:l,type:"date",name:"endDate",id:"endDate",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.endDate})]})]})})})]}),e.jsx(N.Footer,{children:e.jsx(A,{className:"text-white",variant:"info",onClick:u,disabled:c,children:c?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Submit"})})]})})})]})})})})},L=()=>{const r=j().props.detailed_statement,s=j().props.tenant_details,a=j().props.monthly_payments,c=j().props.missed_payments,[o,d]=i.useState(!1),h=()=>d(!1),[m,t]=i.useState(!1),[l,u]=i.useState({lease_id:s.lease_id}),x=i.useRef(),y=()=>{const n=x.current;T().from(n).set({margin:1,filename:"modal-content.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()};console.log("details",l);const[Y,_]=i.useState(!1),[$,S]=i.useState("");if(i.useState(""),!r)return e.jsx("div",{children:e.jsx("h1",{children:j().props.message})});const C=z(a,c);return console.log("Payments",a,"invoices",c),e.jsxs("div",{ref:x,children:[e.jsx(E,{show:o,handleClose:h,tenantData:{tenantNumber:s.lease_receiver_id,name:s.lease_receiver_name,adress:s.lease_receiver_address}}),e.jsx("div",{style:{lineHeight:"5px",fontSize:"18px"},className:"bg-info",children:e.jsxs("div",{scope:"row",colSpan:5,className:"d-flex justify-content-between align-items-center text-white p-3",style:{width:"100%"},children:[e.jsxs("div",{className:"d-flex flex-column gap-2",children:[e.jsxs("h4",{className:"fw-bold text-white",children:[s.lease_receiver_name," - ",s==null?void 0:s.currency]}),e.jsxs("p",{children:[s.lease_receiver_address," "]})]}),e.jsx("p",{children:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]})}),e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#a0a0af"},children:[e.jsx("th",{scope:"",children:"Date"}),e.jsx("td",{children:"Description"}),e.jsx("td",{children:" Ref"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Balance"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:r.date}),e.jsx("td",{children:r.description}),e.jsx("td",{}),e.jsx("td",{className:"text-end"}),e.jsx("td",{className:"text-end",children:p(r.balance_amount)})]}),C.map(n=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:B(n.date).format("YYYY-MM-DD")}),e.jsxs("td",{children:[n.description," "]}),e.jsx("td",{children:n.reference}),e.jsx("td",{className:"text-end",children:n.owing_amount<0?`(${p(n.owing_amount*-1)})`:p(n.owing_amount)}),e.jsx("td",{className:"text-end",children:n.balance_amount<0?`(${p(n.balance_amount*-1)})`:p(n.balance_amount)})]},n.lease_id+Math.random()))]})]}),e.jsxs("div",{className:"d-flex justify-content-end align-items-center gap-4 p-4",children:[e.jsx("button",{className:"btn btn-secondary",onClick:()=>{t(!0),u({lease_id:s.lease_id})},children:"Receipt"}),e.jsx("button",{className:"btn btn-primary",onClick:()=>d(!0),children:"Period request"}),e.jsx("button",{className:"btn btn-info text-white",onClick:y,children:"Print"})]}),e.jsx(F,{show:m,handleClose:n=>w(void 0,null,function*(){S(n),t(!1),_(!0),u({})}),leaseDetails:l,myKey:"statements"})]})};L.layout=r=>e.jsx(M,{children:r,title:"Tenant Detailed Statement"});export{L as default};
