var $=Object.defineProperty,q=Object.defineProperties;var K=Object.getOwnPropertyDescriptors;var z=Object.getOwnPropertySymbols;var P=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var U=(l,r,d)=>r in l?$(l,r,{enumerable:!0,configurable:!0,writable:!0,value:d}):l[r]=d,p=(l,r)=>{for(var d in r||(r={}))P.call(r,d)&&U(l,d,r[d]);if(z)for(var d of z(r))Q.call(r,d)&&U(l,d,r[d]);return l},h=(l,r)=>q(l,K(r));var L=(l,r,d)=>new Promise((j,b)=>{var S=m=>{try{u(d.next(m))}catch(x){b(x)}},f=m=>{try{u(d.throw(m))}catch(x){b(x)}},u=m=>m.done?j(m.value):Promise.resolve(m.value).then(S,f);u((d=d.apply(l,r)).next())});import{j as t,r as w,_ as B,b as V,d as X}from"./main-d177c8be.js";import{h as R,L as tt}from"./Layout-1f1c28e3.js";import{M as A}from"./Modal-8132fe13.js";import{A as et}from"./index-76a92306.js";import"./lodash-5de1c1ef.js";import{f as v}from"./formatting-9de8c923.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-31d97cbe.js";import"./MultipleUpload-6cdfe0b0.js";import"./search-d4efe166.js";import"./index-c3ef11bf.js";function at({show:l,invoice:r,confirmDismissal:d,handleClose:j}){return t.jsxs(A,{centered:!0,size:"md",backdrop:"static",show:l,onHide:j,children:[t.jsx(A.Header,{closeButton:!0,className:"h4 bg-info text-white text-center text-uppercase",children:"Confirm Invoice Dismissal"}),t.jsx(A.Body,{className:"p-4 d-flex justify-content-between align-items-center gap-4",children:t.jsxs("p",{className:"my-3",children:["Are you sure you want to dismiss invoice for ",r.tenant_name,"? No invoice amount or record will be posted for the customer for the month."]})}),t.jsxs(A.Footer,{className:"p-4 d-flex justify-content-end gap-4",children:[t.jsxs("button",{onClick:j,className:"btn btn-light gap-2",children:[t.jsx("i",{className:"material-icons",children:"cancel"}),"Cancel"]}),t.jsxs("button",{onClick:d,className:"btn btn-danger gap-2",children:[t.jsx("i",{className:"material-icons",children:"done"}),"Confirm"]})]})]})}function nt({tenant_list:l,errors:r,result:d,status:j,message:b}){const[S,f]=w.useState(!1),[u,m]=w.useState(null),x=new Date,g=(l==null?void 0:l.filter(a=>a.lease_currency_type.toUpperCase()==="USD"))||[],_=(l==null?void 0:l.filter(a=>a.lease_currency_type.toUpperCase()==="ZWG"))||[],[M,N]=w.useState((g==null?void 0:g.reduce((a,n)=>a+Number(n.owing_amount),0))||0),[y,s]=w.useState((_==null?void 0:_.reduce((a,n)=>a+Number(n.owing_amount),0))||0),[i,Y]=w.useReducer(Z,g.map(a=>h(p({},a),{invoice_date:x.toISOString().split("T")[0],edited:!1,total:(a==null?void 0:a.owing_amount)||0,operationalCosts:"",tenant_acc_no:"",invoice_no:""}))),[k,F]=w.useReducer(G,_.map(a=>h(p({},a),{invoice_date:x.toISOString().split("T")[0],edited:!1,total:(a==null?void 0:a.owing_amount)||"",operationalCosts:"",tenant_acc_no:"",invoice_no:""})));function Z(a,n){switch(n.type){case"updateBaseRental":let o=a.map(e=>e.id===n.id?h(p({},e),{owing_amount:n.owing_amount,edited:!0,total:Number(e.operationalCosts)+Number(n.owing_amount)}):e);return N(o.reduce((e,c)=>e+Number(c.total),0)),o;case"updateInvDate":let C=a.map(e=>e.id===n.id?h(p({},e),{invoice_date:n.invoice_date,edited:!0}):e);return N(C.reduce((e,c)=>e+Number(c.total),0)),C;case"updateInvNumber":let D=a.map(e=>e.id===n.id?h(p({},e),{invoice_no:n.invoice_no,edited:!0}):e);return N(D.reduce((e,c)=>e+Number(c.total),0)),D;case"updateTenantAccNumber":let I=a.map(e=>e.id===n.id?h(p({},e),{tenant_acc_no:n.tenant_acc_no,edited:!0}):e);return N(I.reduce((e,c)=>e+Number(c.total),0)),I;case"updateOperatingCosts":let T=a.map(e=>e.id===n.id?h(p({},e),{edited:!0,operationalCosts:n.operationalCosts,total:Number(e.owing_amount)+Number(n.operationalCosts)}):e);return N(T.reduce((e,c)=>e+Number(c.total),0)),T;case"filterSubmittedInvoices":let O=a.filter(e=>!n.idsToFilter.includes(e.id));return N(O.reduce((e,c)=>e+Number(c.total),0)),O;default:return a}}function G(a,n){switch(n.type){case"updateBaseRental":let o=a.map(e=>e.id===n.id?h(p({},e),{owing_amount:n.owing_amount,edited:!0,total:Number(e.operationalCosts)+Number(n.owing_amount)}):e);return s(o.reduce((e,c)=>e+Number(c.total),0)),o;case"updateInvDate":let C=a.map(e=>e.id===n.id?h(p({},e),{invoice_date:n.invoice_date,edited:!0}):e);return s(C.reduce((e,c)=>e+Number(c.total),0)),C;case"updateInvNumber":let D=a.map(e=>e.id===n.id?h(p({},e),{invoice_no:n.invoice_no,edited:!0}):e);return s(D.reduce((e,c)=>e+Number(c.total),0)),D;case"updateTenantAccNumber":let I=a.map(e=>e.id===n.id?h(p({},e),{tenant_acc_no:n.tenant_acc_no,edited:!0}):e);return s(I.reduce((e,c)=>e+Number(c.total),0)),I;case"updateOperatingCosts":let T=a.map(e=>e.id===n.id?h(p({},e),{edited:!0,operationalCosts:n.operationalCosts,total:Number(e.owing_amount)+Number(n.operationalCosts)}):e);return s(T.reduce((e,c)=>e+Number(c.total),0)),T;case"filterSubmittedInvoices":let O=a.filter(e=>!n.idsToFilter.includes(e.id));return s(O.reduce((e,c)=>e+Number(c.total),0)),O;default:return a}}function H(){return L(this,null,function*(){f(!0);const a=[],n=[];if(i.forEach(o=>{o.edited&&(a.push({leaseId:o.id,invoiceDate:o.invoice_date,baseRental:o.owing_amount,operationCosts:o.operationalCosts,invoiceNumber:o.invoice_no,tenantAccNumber:o.tenant_acc_no}),n.push(o.id))}),k.forEach(o=>{o.edited&&(a.push({leaseId:o.id,invoiceDate:o.invoice_date,baseRental:o.owing_amount,operationCosts:o.operationalCosts,invoiceNumber:o.invoice_no,tenantAccNumber:o.tenant_acc_no}),n.push(o.id))}),a.length===0){f(!1),B.error("No changes detected, please fill in at least one invoice",{icon:"❌",duration:5e3});return}try{console.log({data:a}),yield V.post(reverseUrl("client_invoice"),a),Y({type:"filterSubmittedInvoices",idsToFilter:n}),F({type:"filterSubmittedInvoices",idsToFilter:n})}catch(o){console.log(o),o instanceof et?B.error(`An error occurred! ${o.response.statusText}`):B.error(`An error occurred! ${JSON.stringify(o)}`,{icon:"❌"})}f(!1)})}w.useEffect(()=>{r?(console.log(r),B.error("Error: "+JSON.stringify(r),{duration:5e3,icon:"❌"})):d==="success"&&b&&B.success(b,{duration:5e3,icon:"✔"})},[r,d,b]);const E=R().date()>8&&R().date()<25?R().subtract(1,"months").format("MMMM YYYY"):R().format("MMMM YYYY");console.log({allState:{invoices:l,errors:r,result:d,status:j,message:b,usdBatchTotal:M,zwlBatchTotal:y,usdState:i,zwlState:k,isLoading:S,headerDate:E}});const J=l==null?void 0:l.some(a=>x.getDate()<a.payment_period_start&&x.getDate()>8);function W(){f(!0);const a=[u.id],n=[{leaseId:u.id,invoiceDate:u.invoice_date,baseRental:u.owing_amount,operationCosts:u.operationalCosts,invoiceNumber:u.invoice_no,tenantAccNumber:u.tenant_acc_no,terminated:!0}];console.log({invoiceToDismiss:u,data:n}),X.Inertia.post(reverseUrl("client_invoice"),n,{onSuccess:o=>{console.log(o),Y({type:"filterSubmittedInvoices",idsToFilter:a}),F({type:"filterSubmittedInvoices",idsToFilter:a}),m(null)},onError:o=>{console.log(o),m(null)}}),f(!1)}return{today:x,pastDue:J,usdBatchTotal:M,zwlBatchTotal:y,usdState:i,zwlState:k,isLoading:S,headerDate:E,invoiceToDismiss:u,usdDispatch:Y,zwlDispatch:F,submitData:H,confirmDismissal:W,setInvoiceToDismiss:m}}function st(l){const{today:r,pastDue:d,usdBatchTotal:j,zwlBatchTotal:b,usdState:S,zwlState:f,isLoading:u,headerDate:m,invoiceToDismiss:x,usdDispatch:g,zwlDispatch:_,submitData:M,confirmDismissal:N,setInvoiceToDismiss:y}=nt(l);return t.jsxs("div",{className:"card card-raised",children:[!!x&&t.jsx(at,{show:!0,invoice:x,confirmDismissal:N,handleClose:()=>y(null)}),t.jsxs("div",{className:"h5 m-0 p-3 bg-info text-center text-white",children:["Rental Invoicing - ",m]}),t.jsxs("div",{className:"card-body p-4",children:[t.jsxs("table",{className:"table table-sm table-responsive table-bordered custom-fs-normal",children:[t.jsx("thead",{className:"position-sticky c-table-top bg-white shadow-sm",children:t.jsxs("tr",{children:[d&&t.jsx("th",{}),t.jsx("th",{children:"Inv. Date"}),t.jsx("th",{children:"Tenant Name"}),t.jsx("th",{children:"Tenant Acc. No."}),t.jsx("th",{children:"Inv. No."}),t.jsx("th",{children:"Currency"}),t.jsx("th",{children:"Base Rental"}),t.jsx("th",{children:"Operating Costs"}),t.jsx("th",{children:"Total"}),t.jsx("th",{})]})}),t.jsxs("tbody",{children:[t.jsx("tr",{children:t.jsx("th",{className:"border-0 py-3",children:"USD"})}),S.map(s=>t.jsxs("tr",{children:[d&&t.jsx("td",{className:"text-center px-0",children:t.jsx("i",{title:"invoice is past payment period",className:"material-icons custom-cursor-pointer custom-icon-small text-danger d-block p-0 m-0",children:"timer"})}),t.jsx("td",{children:t.jsx("input",{type:"date",max:r.toISOString().split("T")[0],min:r.getDate()>=s.payment_period_start?r.toISOString().split("T")[0]:r.getMonth()===0?new Date(r.getFullYear()-1,11,26).toISOString().split("T")[0]:new Date(r.getFullYear(),r.getMonth()-1,26).toISOString().split("T")[0],className:"form-control form-control-sm",value:s.invoice_date,onChange:i=>g({type:"updateInvDate",id:s.id,invoice_date:i.target.value})})}),t.jsx("td",{children:s.tenant_name}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.tenant_acc_no,onChange:i=>g({type:"updateTenantAccNumber",id:s.id,tenant_acc_no:i.target.value})})}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.invoice_no,onChange:i=>g({type:"updateInvNumber",id:s.id,invoice_no:i.target.value})})}),t.jsx("td",{children:s.lease_currency_type}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.owing_amount,onChange:i=>g({type:"updateBaseRental",id:s.id,owing_amount:i.target.value})})}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.operationalCosts,onChange:i=>g({type:"updateOperatingCosts",id:s.id,operationalCosts:i.target.value})})}),t.jsx("td",{className:"text-end",children:v(s.total)}),t.jsx("td",{className:"text-center",children:t.jsx("button",{type:"button",className:"btn btn-danger btn-sm",onClick:()=>y(s),children:"-"})})]},s.id)),t.jsxs("tr",{className:"text-end fw-bold",children:[t.jsx("td",{colSpan:6}),t.jsx("td",{children:"Batch Total"}),t.jsx("td",{children:v(j)})]}),t.jsx("tr",{children:t.jsx("th",{className:"border-0 py-3",children:"ZWG"})}),f.map(s=>t.jsxs("tr",{children:[d&&t.jsx("td",{title:"invoice is past payment period",className:"text-center px-0",children:t.jsx("i",{className:"material-icons custom-icon-small text-danger d-block p-0 m-0",children:"timer"})}),t.jsx("td",{children:t.jsx("input",{type:"date",max:r.toISOString().split("T")[0],min:r.getDate()>=s.payment_period_start?r.toISOString().split("T")[0]:r.getMonth()===0?new Date(r.getFullYear()-1,11,26).toISOString().split("T")[0]:new Date(r.getFullYear(),r.getMonth()-1,26).toISOString().split("T")[0],className:"form-control form-control-sm",value:s.invoice_date,onChange:i=>_({type:"updateInvDate",id:s.id,invoice_date:i.target.value})})}),t.jsx("td",{children:s.tenant_name}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.tenant_acc_no,onChange:i=>_({type:"updateTenantAccNumber",id:s.id,tenant_acc_no:i.target.value})})}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.invoice_no,onChange:i=>_({type:"updateInvNumber",id:s.id,invoice_no:i.target.value})})}),t.jsx("td",{children:s.lease_currency_type}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.owing_amount,onChange:i=>_({type:"updateBaseRental",id:s.id,owing_amount:i.target.value})})}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.operationalCosts,onChange:i=>_({type:"updateOperatingCosts",id:s.id,operationalCosts:i.target.value})})}),t.jsx("td",{className:"text-end",children:v(s.total)}),t.jsx("td",{className:"text-center",children:t.jsx("button",{type:"button",className:"btn btn-danger btn-sm",onClick:()=>y(s),children:"-"})})]},s.id)),t.jsxs("tr",{className:"text-end fw-bold",children:[t.jsx("td",{colSpan:6}),t.jsx("td",{children:"Batch Total"}),t.jsx("td",{children:v(b)})]})]})]}),t.jsx("div",{className:"text-end",children:t.jsx("button",{onClick:M,className:"btn btn-info text-white",children:u?t.jsxs(t.Fragment,{children:[t.jsx("span",{className:"spinner-grow spinner-grow-sm d-inline-block me-2"}),"processing.."]}):"Submit"})})]})]})}st.layout=l=>t.jsx(tt,{children:l,title:"Tenant Invoicing"});export{st as default};
