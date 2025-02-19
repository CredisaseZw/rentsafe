var v=Object.defineProperty,w=Object.defineProperties;var y=Object.getOwnPropertyDescriptors;var p=Object.getOwnPropertySymbols;var _=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable;var u=(r,a,s)=>a in r?v(r,a,{enumerable:!0,configurable:!0,writable:!0,value:s}):r[a]=s,N=(r,a)=>{for(var s in a||(a={}))_.call(a,s)&&u(r,s,a[s]);if(p)for(var s of p(a))S.call(a,s)&&u(r,s,a[s]);return r},f=(r,a)=>w(r,y(a));import{r as b,a as C,j as e,u as i}from"./main-c668a994.js";import{M as x}from"./Modal-a228e7bb.js";import{B as D}from"./Button-4d18c3cc.js";import{L as q}from"./Layout-36d91107.js";import{a as H,f as c}from"./formatting-345d2430.js";import{h as k}from"./moment-686b5dfa.js";import"./removeClass-b08b3ba1.js";import"./index-e6638ef2.js";const P=({show:r,handleClose:a,tenantData:s})=>{const[l,o]=b.useState(!1),{data:n,post:h,setData:j,errors:t}=C({tenantNumber:(s==null?void 0:s.tenantNumber)||"",name:(s==null?void 0:s.name)||"",adress:(s==null?void 0:s.adress)||"",startDate:"",endDate:""}),d=m=>{j(f(N({},n),{[m.target.id]:m.target.value}))},g=m=>{m.preventDefault(),o(!0),h("/client/period-request",{onSuccess:()=>{o(!1),a()}})};return e.jsx(e.Fragment,{children:e.jsx(x,{size:"lg",show:r,onHide:a,children:e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx(x.Header,{closeButton:!0,className:"card-header bg-info px-4",children:e.jsxs("div",{className:`d-flex justify-content-between
                            align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:"Tenant Statement Period Request"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"card",children:e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(x.Body,{children:[e.jsxs("div",{className:"row",children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"col-md-12 my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Tenant Number"," ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.tenantNumber,onChange:d,type:"text",name:"tenantNumber",required:!0,id:"tenantNumber",placeholder:"Enter tenant number",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.tenantNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.name,onChange:d,type:"text",name:"name",required:!0,id:"name",placeholder:"Enter tenant's full name",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.name})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.adress,onChange:d,type:"text",required:!0,name:"adress",id:"adress",placeholder:"Enter tenant's address",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.adress})]})]})})]}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["From",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.startDate,onChange:d,type:"date",name:"startDate",id:"startDate",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.startDate})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["To",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.endDate,onChange:d,type:"date",name:"endDate",id:"endDate",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.endDate})]})]})})})]}),e.jsx(x.Footer,{children:e.jsx(D,{className:"text-white",variant:"info",onClick:g,disabled:l,children:l?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Submit"})})]})})})]})})})})},z=()=>{const r=i().props.detailed_statement,a=i().props.tenant_details,s=i().props.monthly_payments,l=i().props.missed_payments,[o,n]=b.useState(!1),h=()=>n(!1);if(!r)return e.jsx("div",{children:e.jsx("h1",{children:i().props.message})});const j=H(s,l);return console.log("Payments",s,"invoices",l),e.jsxs("div",{style:{padding:"10px"},children:[e.jsx(P,{show:o,handleClose:h,tenantData:{tenantNumber:a.lease_receiver_id,name:a.lease_receiver_name,adress:a.lease_receiver_address}}),e.jsx("div",{style:{lineHeight:"5px",fontSize:"18px"},className:"bg-info",children:e.jsxs("div",{scope:"row",colSpan:5,className:"d-flex justify-content-between align-items-center text-white p-3",style:{width:"100%"},children:[e.jsxs("div",{className:"d-flex flex-column gap-2",children:[e.jsxs("h4",{className:"fw-bold text-white",children:[a.lease_receiver_name," - USD"]}),e.jsx("p",{children:a.lease_receiver_address})]}),e.jsx("p",{children:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#a0a0af"},children:[e.jsx("th",{scope:"",children:"Date"}),e.jsx("td",{children:"Description"}),e.jsx("td",{children:" Ref"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Balance"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:r.date}),e.jsx("td",{children:r.description}),e.jsx("td",{}),e.jsx("td",{className:"text-end"}),e.jsx("td",{className:"text-end",children:c(r.balance_amount)})]}),j.map(t=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:k(t.date).format("YYYY-MM-DD")}),e.jsxs("td",{children:[t.description," "]}),e.jsx("td",{children:t.reference}),e.jsx("td",{className:"text-end",children:t.owing_amount<0?`(${c(t.owing_amount*-1)})`:c(t.owing_amount)}),e.jsx("td",{className:"text-end",children:t.balance_amount<0?`(${c(t.balance_amount*-1)})`:c(t.balance_amount)})]},t.lease_id+Math.random()))]})}),e.jsxs("div",{className:"d-flex justify-content-end align-items-center gap-4 p-4",children:[e.jsx("button",{className:"btn btn-primary",onClick:()=>n(!0),children:"Period request"}),e.jsx("button",{className:"btn btn-info text-white",children:"Print"})]})]})};z.layout=r=>e.jsx(q,{children:r,title:"Tenant Detailed Statement"});export{z as default};
