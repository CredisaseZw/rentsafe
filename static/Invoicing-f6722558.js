var O=Object.defineProperty,L=Object.defineProperties;var $=Object.getOwnPropertyDescriptors;var M=Object.getOwnPropertySymbols;var v=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable;var B=(o,d,l)=>d in o?O(o,d,{enumerable:!0,configurable:!0,writable:!0,value:l}):o[d]=l,u=(o,d)=>{for(var l in d||(d={}))v.call(d,l)&&B(o,l,d[l]);if(M)for(var l of M(d))Z.call(d,l)&&B(o,l,d[l]);return o},p=(o,d)=>L(o,$(d));var z=(o,d,l)=>new Promise((h,S)=>{var x=c=>{try{i(l.next(c))}catch(m){S(m)}},I=c=>{try{i(l.throw(c))}catch(m){S(m)}},i=c=>c.done?h(c.value):Promise.resolve(c.value).then(x,I);i((l=l.apply(o,d)).next())});import{u as A,r as g,j as a,b as k}from"./main-2a44df20.js";import{h as C}from"./moment-686b5dfa.js";import{f as T}from"./formatting-345d2430.js";import{L as G}from"./Layout-01b13cde.js";import{I as P,_ as R}from"./index-e3b3df7b.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-afc37929.js";import"./lodash-0b09325a.js";import"./Modal-2f925deb.js";import"./index-fe8aec3e.js";const W=()=>{const{tenant_list:o}=A().props,{errors:d}=A().props,l=o!=null&&o.length?o.filter(e=>e.lease_currency_type.toUpperCase()==="USD"):[];console.log("usdInvoices",l);const h=o!=null&&o.length?o.filter(e=>e.lease_currency_type.toUpperCase()==="ZWG"):[],[S,x]=g.useState(l!=null&&l.length?l.reduce((e,r)=>e+Number(r.owing_amount),0):0),[I,i]=g.useState(h!=null&&h.length?h.reduce((e,r)=>e+Number(r.owing_amount),0):0),[c,m]=g.useReducer(E,l.map(e=>p(u({},e),{invoice_date:`${e==null?void 0:e.payment_period_start}-${C().format("MM-YYYY")}`||"",edited:!1,total:(e==null?void 0:e.owing_amount)||"",operationalCosts:"",tenant_acc_no:"",invoice_no:""}))),[f,_]=g.useReducer(U,h.map(e=>p(u({},e),{invoice_date:`${e==null?void 0:e.payment_period_start}-${C().format("MM-YYYY")}`||"",edited:!1,total:(e==null?void 0:e.owing_amount)||"",operationalCosts:"",tenant_acc_no:"",invoice_no:""}))),[q,D]=g.useState(d),[H,Y]=g.useState(!1);function E(e,r){switch(r.type){case"updateBaseRental":let s=e.map(t=>t.id===r.id?p(u({},t),{owing_amount:r.owing_amount,edited:!0,total:Number(t.operationalCosts)+Number(r.owing_amount)}):t);return x(s.reduce((t,n)=>t+Number(n.total),0)),s;case"updateInvDate":let j=e.map(t=>t.id===r.id?p(u({},t),{invoice_date:r.invoice_date,edited:!0}):t);return x(j.reduce((t,n)=>t+Number(n.total),0)),j;case"updateInvNumber":let N=e.map(t=>t.id===r.id?p(u({},t),{invoice_no:r.invoice_no,edited:!0}):t);return x(N.reduce((t,n)=>t+Number(n.total),0)),N;case"updateTenantAccNumber":let b=e.map(t=>t.id===r.id?p(u({},t),{tenant_acc_no:r.tenant_acc_no,edited:!0}):t);return x(b.reduce((t,n)=>t+Number(n.total),0)),b;case"updateOperatingCosts":let y=e.map(t=>t.id===r.id?p(u({},t),{edited:!0,operationalCosts:r.operationalCosts,total:Number(t.owing_amount)+Number(r.operationalCosts)}):t);return x(y.reduce((t,n)=>t+Number(n.total),0)),y;case"filterSubmittedInvoices":let w=e.filter(t=>!r.idsToFilter.includes(t.id));return x(w.reduce((t,n)=>t+Number(n.total),0)),w;default:return e}}function U(e,r){switch(r.type){case"updateBaseRental":let s=e.map(t=>t.id===r.id?p(u({},t),{owing_amount:r.owing_amount,edited:!0,total:Number(t.operationalCosts)+Number(r.owing_amount)}):t);return i(s.reduce((t,n)=>t+Number(n.total),0)),s;case"updateInvDate":let j=e.map(t=>t.id===r.id?p(u({},t),{invoice_date:r.invoice_date,edited:!0}):t);return i(j.reduce((t,n)=>t+Number(n.total),0)),j;case"updateInvNumber":let N=e.map(t=>t.id===r.id?p(u({},t),{invoice_no:r.invoice_no,edited:!0}):t);return i(N.reduce((t,n)=>t+Number(n.total),0)),N;case"updateTenantAccNumber":let b=e.map(t=>t.id===r.id?p(u({},t),{tenant_acc_no:r.tenant_acc_no,edited:!0}):t);return i(b.reduce((t,n)=>t+Number(n.total),0)),b;case"updateOperatingCosts":let y=e.map(t=>t.id===r.id?p(u({},t),{edited:!0,operationalCosts:r.operationalCosts,total:Number(t.owing_amount)+Number(r.operationalCosts)}):t);return i(y.reduce((t,n)=>t+Number(n.total),0)),y;case"filterSubmittedInvoices":let w=e.filter(t=>!r.idsToFilter.includes(t.id));return i(w.reduce((t,n)=>t+Number(n.total),0)),w;default:return e}}const F=()=>z(void 0,null,function*(){D({});const e=[],r=[];if(Y(!0),c.forEach(s=>{s.edited&&(e.push({leaseId:s.id,invoiceDate:s.invoice_date,baseRental:s.owing_amount,operationCosts:s.operationalCosts,invoiceNumber:s.invoice_no,tenantAccNumber:s.tenant_acc_no}),r.push(s.id))}),f.forEach(s=>{s.edited&&(e.push({leaseId:s.id,invoiceDate:s.invoice_date,baseRental:s.owing_amount,operationCosts:s.operationalCosts,invoiceNumber:s.invoice_no,tenantAccNumber:s.tenant_acc_no}),r.push(s.id))}),e.length===0){Y(!1),R.error("No changes were made, please edit at least one invoice",{icon:"❌",duration:5e3});return}try{console.log("data",e);const s=yield k.post(reverseUrl("client_invoice"),e);m({type:"filterSubmittedInvoices",idsToFilter:r}),_({type:"filterSubmittedInvoices",idsToFilter:r}),R.success("Invoice created successfully",{icon:"✔"})}catch(s){R.error("Something went wrong! Please try again",{icon:"❌"}),D(s.response.data.errors)}finally{Y(!1)}});return a.jsxs("div",{className:"card card-raised mt-3 mb-5 mx-4",children:[a.jsxs("div",{className:"card-header px-4 bg-info",style:{height:"50px"},children:[a.jsx(P,{position:"top-right"}),a.jsx("div",{className:"d-flex justify-content-center align-items-center",children:a.jsx("div",{className:"",children:a.jsxs("h2",{className:"display-6 text-white",children:["Rental Invoicing -"," ",C().date()>25?C().add(1,"months").format("MMMM YYYY"):C().format("MMMM YYYY")]})})})]}),a.jsxs("div",{className:"card-body p-4",children:[a.jsx("div",{className:"table-responsive",children:a.jsxs("table",{className:"table table-bordered",children:[a.jsx("thead",{children:a.jsxs("tr",{style:{borderTop:"0px",lineHeight:"15px",fontSize:"12px"},children:[a.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Inv. Date"}),a.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Tenant Name"}),a.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Tenant Acc. No."}),a.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Inv. No."}),a.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Currency"}),a.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Base Rental"}),a.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Operating Costs"}),a.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Total"})]})}),a.jsxs("tbody",{children:[a.jsx("tr",{style:{lineHeight:"15px",fontSize:"12px"},children:a.jsx("th",{scope:"row",children:"USD"})}),c!=null&&c.length?c.map(e=>a.jsxs("tr",{style:{lineHeight:"15px",fontSize:"12px"},children:[a.jsx("th",{scope:"row",children:a.jsx("input",{type:"text",className:"form-control form-control-sm",value:e.invoice_date,onChange:r=>m({type:"updateInvDate",id:e.id,invoice_date:r.target.value})})}),a.jsx("td",{children:e.tenant_name}),a.jsx("td",{children:a.jsx("input",{type:"text",className:"form-control form-control-sm",value:e.tenant_acc_no,onChange:r=>m({type:"updateTenantAccNumber",id:e.id,tenant_acc_no:r.target.value})})}),a.jsx("td",{children:a.jsx("input",{type:"text",className:"form-control form-control-sm",value:e.invoice_no,onChange:r=>m({type:"updateInvNumber",id:e.id,invoice_no:r.target.value})})}),a.jsx("td",{children:e.lease_currency_type}),a.jsx("td",{className:"text-end",children:a.jsx("input",{type:"text",className:"form-control form-control-sm",value:e.owing_amount,onChange:r=>m({type:"updateBaseRental",id:e.id,owing_amount:r.target.value})})}),a.jsx("td",{className:"text-end",children:a.jsx("input",{type:"text",className:"form-control form-control-sm",value:e.operationalCosts,onChange:r=>m({type:"updateOperatingCosts",id:e.id,operationalCosts:r.target.value})})}),a.jsx("td",{className:"text-end",children:T(e.total)})]},e.id)):"",a.jsxs("tr",{style:{lineHeight:"15px",fontSize:"12px"},children:[a.jsx("td",{colSpan:6}),a.jsx("td",{className:"text-end fw-bold",children:"Batch Total"}),a.jsx("td",{className:"text-end fw-bold",children:T(S)})]}),a.jsx("tr",{style:{lineHeight:"15px",fontSize:"12px"},children:a.jsx("th",{scope:"row",children:"ZWG"})}),f!=null&&f.length?f.map(e=>a.jsxs("tr",{style:{lineHeight:"15px",fontSize:"12px"},children:[a.jsx("th",{scope:"row",children:a.jsx("input",{type:"text",className:"form-control form-control-sm",value:e.invoice_date,onChange:r=>_({type:"updateInvDate",id:e.id,invoice_date:r.target.value})})}),a.jsx("td",{children:e.tenant_name}),a.jsx("td",{children:a.jsx("input",{type:"text",className:"form-control form-control-sm",value:e.tenant_acc_no,onChange:r=>_({type:"updateTenantAccNumber",id:e.id,tenant_acc_no:r.target.value})})}),a.jsx("td",{children:a.jsx("input",{type:"text",className:"form-control form-control-sm",value:e.invoice_no,onChange:r=>_({type:"updateInvNumber",id:e.id,invoice_no:r.target.value})})}),a.jsx("td",{children:e.lease_currency_type}),a.jsx("td",{className:"text-end",children:a.jsx("input",{type:"text",className:"form-control form-control-sm",value:e.owing_amount,onChange:r=>_({type:"updateBaseRental",id:e.id,owing_amount:r.target.value})})}),a.jsx("td",{className:"text-end",children:a.jsx("input",{type:"text",className:"form-control form-control-sm",value:e.operationalCosts,onChange:r=>_({type:"updateOperatingCosts",id:e.id,operationalCosts:r.target.value})})}),a.jsx("td",{className:"text-end",children:T(e.total)})]},e.id)):"",a.jsxs("tr",{style:{lineHeight:"15px",fontSize:"12px"},children:[a.jsx("td",{colSpan:6}),a.jsx("td",{className:"text-end fw-bold",children:"Batch Total"}),a.jsx("td",{className:"text-end fw-bold",children:T(I)})]})]})]})}),a.jsx("div",{className:"d-flex justify-content-end",children:a.jsx("button",{onClick:F,className:"btn btn-info",children:H?a.jsxs(a.Fragment,{children:[a.jsx("span",{className:"spinner-grow spinner-grow-sm"}),a.jsx("span",{className:"ml-2",children:"processing.."})]}):a.jsx(a.Fragment,{children:"Submit"})})})]})]})};W.layout=o=>a.jsx(G,{children:o,title:"Tenant Invoicing"});export{W as default};
