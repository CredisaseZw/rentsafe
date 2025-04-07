var $=Object.defineProperty,q=Object.defineProperties;var K=Object.getOwnPropertyDescriptors;var E=Object.getOwnPropertySymbols;var P=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var z=(l,r,d)=>r in l?$(l,r,{enumerable:!0,configurable:!0,writable:!0,value:d}):l[r]=d,p=(l,r)=>{for(var d in r||(r={}))P.call(r,d)&&z(l,d,r[d]);if(E)for(var d of E(r))Q.call(r,d)&&z(l,d,r[d]);return l},h=(l,r)=>q(l,K(r));var U=(l,r,d)=>new Promise((N,f)=>{var y=m=>{try{u(d.next(m))}catch(x){f(x)}},b=m=>{try{u(d.throw(m))}catch(x){f(x)}},u=m=>m.done?N(m.value):Promise.resolve(m.value).then(y,b);u((d=d.apply(l,r)).next())});import{j as t,r as w,_ as B,b as V,d as X}from"./main-f3a2b3b5.js";import{a as M,L as tt}from"./Layout-31dd085d.js";import{M as R}from"./Modal-0288d289.js";import{A as et}from"./index-c2bab56a.js";import"./lodash-1e972248.js";import{f as v}from"./formatting-9de8c923.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-9988a4c5.js";import"./MultipleUpload-f4af7a74.js";import"./search-cc04e48e.js";import"./index-f34ada42.js";function at({show:l,invoice:r,confirmDismissal:d,handleClose:N}){return t.jsxs(R,{centered:!0,size:"md",backdrop:"static",show:l,onHide:N,children:[t.jsx(R.Header,{closeButton:!0,className:"h4 bg-info text-white text-center text-uppercase",children:"Confirm Invoice Dismissal"}),t.jsx(R.Body,{className:"p-4 d-flex justify-content-between align-items-center gap-4",children:t.jsxs("p",{className:"my-3",children:["Are you sure you want to dismiss invoice for ",r.tenant_name,"? No invoice amount or record will be posted for the customer for the month."]})}),t.jsxs(R.Footer,{className:"p-4 d-flex justify-content-end gap-4",children:[t.jsxs("button",{onClick:N,className:"btn btn-light gap-2",children:[t.jsx("i",{className:"material-icons",children:"cancel"}),"Cancel"]}),t.jsxs("button",{onClick:d,className:"btn btn-danger gap-2",children:[t.jsx("i",{className:"material-icons",children:"done"}),"Confirm"]})]})]})}function nt({tenant_list:l,errors:r,result:d,status:N,message:f}){const[y,b]=w.useState(!1),[u,m]=w.useState(null),x=new Date,g=(l==null?void 0:l.filter(a=>a.lease_currency_type.toUpperCase()==="USD"))||[],_=(l==null?void 0:l.filter(a=>a.lease_currency_type.toUpperCase()==="ZWG"))||[],[A,j]=w.useState((g==null?void 0:g.reduce((a,n)=>a+Number(n.owing_amount),0))||0),[S,s]=w.useState((_==null?void 0:_.reduce((a,n)=>a+Number(n.owing_amount),0))||0),[c,Y]=w.useReducer(L,g.map(a=>h(p({},a),{invoice_date:x.toISOString().split("T")[0],edited:!1,total:(a==null?void 0:a.owing_amount)||0,operationalCosts:"",tenant_acc_no:"",invoice_no:""}))),[F,k]=w.useReducer(Z,_.map(a=>h(p({},a),{invoice_date:x.toISOString().split("T")[0],edited:!1,total:(a==null?void 0:a.owing_amount)||"",operationalCosts:"",tenant_acc_no:"",invoice_no:""})));function L(a,n){switch(n.type){case"updateBaseRental":let o=a.map(e=>e.id===n.id?h(p({},e),{owing_amount:n.owing_amount,edited:!0,total:Number(e.operationalCosts)+Number(n.owing_amount)}):e);return j(o.reduce((e,i)=>e+Number(i.total),0)),o;case"updateInvDate":let C=a.map(e=>e.id===n.id?h(p({},e),{invoice_date:n.invoice_date,edited:!0}):e);return j(C.reduce((e,i)=>e+Number(i.total),0)),C;case"updateInvNumber":let D=a.map(e=>e.id===n.id?h(p({},e),{invoice_no:n.invoice_no,edited:!0}):e);return j(D.reduce((e,i)=>e+Number(i.total),0)),D;case"updateTenantAccNumber":let I=a.map(e=>e.id===n.id?h(p({},e),{tenant_acc_no:n.tenant_acc_no,edited:!0}):e);return j(I.reduce((e,i)=>e+Number(i.total),0)),I;case"updateOperatingCosts":let T=a.map(e=>e.id===n.id?h(p({},e),{edited:!0,operationalCosts:n.operationalCosts,total:Number(e.owing_amount)+Number(n.operationalCosts)}):e);return j(T.reduce((e,i)=>e+Number(i.total),0)),T;case"filterSubmittedInvoices":let O=a.filter(e=>!n.idsToFilter.includes(e.id));return j(O.reduce((e,i)=>e+Number(i.total),0)),O;default:return a}}function Z(a,n){switch(n.type){case"updateBaseRental":let o=a.map(e=>e.id===n.id?h(p({},e),{owing_amount:n.owing_amount,edited:!0,total:Number(e.operationalCosts)+Number(n.owing_amount)}):e);return s(o.reduce((e,i)=>e+Number(i.total),0)),o;case"updateInvDate":let C=a.map(e=>e.id===n.id?h(p({},e),{invoice_date:n.invoice_date,edited:!0}):e);return s(C.reduce((e,i)=>e+Number(i.total),0)),C;case"updateInvNumber":let D=a.map(e=>e.id===n.id?h(p({},e),{invoice_no:n.invoice_no,edited:!0}):e);return s(D.reduce((e,i)=>e+Number(i.total),0)),D;case"updateTenantAccNumber":let I=a.map(e=>e.id===n.id?h(p({},e),{tenant_acc_no:n.tenant_acc_no,edited:!0}):e);return s(I.reduce((e,i)=>e+Number(i.total),0)),I;case"updateOperatingCosts":let T=a.map(e=>e.id===n.id?h(p({},e),{edited:!0,operationalCosts:n.operationalCosts,total:Number(e.owing_amount)+Number(n.operationalCosts)}):e);return s(T.reduce((e,i)=>e+Number(i.total),0)),T;case"filterSubmittedInvoices":let O=a.filter(e=>!n.idsToFilter.includes(e.id));return s(O.reduce((e,i)=>e+Number(i.total),0)),O;default:return a}}function G(){return U(this,null,function*(){b(!0);const a=[],n=[];if(c.forEach(o=>{o.edited&&(a.push({leaseId:o.id,invoiceDate:o.invoice_date,baseRental:o.owing_amount,operationCosts:o.operationalCosts,invoiceNumber:o.invoice_no,tenantAccNumber:o.tenant_acc_no}),n.push(o.id))}),F.forEach(o=>{o.edited&&(a.push({leaseId:o.id,invoiceDate:o.invoice_date,baseRental:o.owing_amount,operationCosts:o.operationalCosts,invoiceNumber:o.invoice_no,tenantAccNumber:o.tenant_acc_no}),n.push(o.id))}),a.length===0){b(!1),B.error("No changes detected, please fill in at least one invoice",{icon:"❌",duration:5e3});return}try{console.log({data:a}),yield V.post(reverseUrl("client_invoice"),a),Y({type:"filterSubmittedInvoices",idsToFilter:n}),k({type:"filterSubmittedInvoices",idsToFilter:n})}catch(o){console.log(o),o instanceof et?B.error(`An error occurred! ${o.response.statusText}`):B.error(`An error occurred! ${JSON.stringify(o)}`,{icon:"❌"})}b(!1)})}w.useEffect(()=>{r?(console.log(r),B.error("Error: "+JSON.stringify(r),{duration:5e3,icon:"❌"})):d==="success"&&f&&B.success(f,{duration:5e3,icon:"✔"})},[r,d,f]);const H=M().date()>8&&M().date()<25?M().subtract(1,"months").format("MMMM YYYY"):M().format("MMMM YYYY"),J=l==null?void 0:l.some(a=>x.getDate()<a.payment_period_start&&x.getDate()>8);function W(){b(!0);const a=[u.id],n=[{leaseId:u.id,invoiceDate:u.invoice_date,baseRental:u.owing_amount,operationCosts:u.operationalCosts,invoiceNumber:u.invoice_no,tenantAccNumber:u.tenant_acc_no,terminated:!0}];console.log({invoiceToDismiss:u,data:n}),X.Inertia.post(reverseUrl("client_invoice"),n,{onSuccess:o=>{console.log(o),Y({type:"filterSubmittedInvoices",idsToFilter:a}),k({type:"filterSubmittedInvoices",idsToFilter:a}),m(null)},onError:o=>{console.log(o),m(null)}}),b(!1)}return{today:x,pastDue:J,usdBatchTotal:A,zwlBatchTotal:S,usdState:c,zwlState:F,isLoading:y,headerDate:H,invoiceToDismiss:u,usdDispatch:Y,zwlDispatch:k,submitData:G,confirmDismissal:W,setInvoiceToDismiss:m}}function st(l){const{today:r,pastDue:d,usdBatchTotal:N,zwlBatchTotal:f,usdState:y,zwlState:b,isLoading:u,headerDate:m,invoiceToDismiss:x,usdDispatch:g,zwlDispatch:_,submitData:A,confirmDismissal:j,setInvoiceToDismiss:S}=nt(l);return t.jsxs("div",{className:"card card-raised",children:[!!x&&t.jsx(at,{show:!0,invoice:x,confirmDismissal:j,handleClose:()=>S(null)}),t.jsxs("div",{className:"h5 m-0 p-3 bg-info text-center text-white",children:["Rental Invoicing - ",m]}),t.jsxs("div",{className:"card-body p-4",children:[t.jsxs("table",{className:"table table-sm table-responsive table-bordered custom-fs-normal",children:[t.jsx("thead",{className:"position-sticky c-table-top bg-white shadow-sm",children:t.jsxs("tr",{children:[d&&t.jsx("th",{}),t.jsx("th",{children:"Inv. Date"}),t.jsx("th",{children:"Tenant Name"}),t.jsx("th",{children:"Tenant Acc. No."}),t.jsx("th",{children:"Inv. No."}),t.jsx("th",{children:"Currency"}),t.jsx("th",{children:"Base Rental"}),t.jsx("th",{children:"Operating Costs"}),t.jsx("th",{children:"Total"}),t.jsx("th",{})]})}),t.jsxs("tbody",{children:[t.jsx("tr",{children:t.jsx("th",{className:"border-0 py-3",children:"USD"})}),y.map(s=>t.jsxs("tr",{children:[d&&t.jsx("td",{className:"text-center px-0",children:t.jsx("i",{title:"invoice is past payment period",className:"material-icons custom-cursor-pointer custom-icon-small text-danger d-block p-0 m-0",children:"timer"})}),t.jsx("td",{children:t.jsx("input",{type:"date",max:r.toISOString().split("T")[0],min:r.getDate()>=s.payment_period_start?r.toISOString().split("T")[0]:r.getMonth()===0?new Date(r.getFullYear()-1,11,26).toISOString().split("T")[0]:new Date(r.getFullYear(),r.getMonth()-1,26).toISOString().split("T")[0],className:"form-control form-control-sm",value:s.invoice_date,onChange:c=>g({type:"updateInvDate",id:s.id,invoice_date:c.target.value})})}),t.jsx("td",{children:s.tenant_name}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.tenant_acc_no,onChange:c=>g({type:"updateTenantAccNumber",id:s.id,tenant_acc_no:c.target.value})})}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.invoice_no,onChange:c=>g({type:"updateInvNumber",id:s.id,invoice_no:c.target.value})})}),t.jsx("td",{children:s.lease_currency_type}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.owing_amount,onChange:c=>g({type:"updateBaseRental",id:s.id,owing_amount:c.target.value})})}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.operationalCosts,onChange:c=>g({type:"updateOperatingCosts",id:s.id,operationalCosts:c.target.value})})}),t.jsx("td",{className:"text-end",children:v(s.total)}),t.jsx("td",{className:"text-center",children:t.jsx("button",{type:"button",className:"btn btn-danger btn-sm",onClick:()=>S(s),children:"-"})})]},s.id)),t.jsxs("tr",{className:"text-end fw-bold",children:[t.jsx("td",{colSpan:6}),t.jsx("td",{children:"Batch Total"}),t.jsx("td",{children:v(N)})]}),t.jsx("tr",{children:t.jsx("th",{className:"border-0 py-3",children:"ZWG"})}),b.map(s=>t.jsxs("tr",{children:[d&&t.jsx("td",{title:"invoice is past payment period",className:"text-center px-0",children:t.jsx("i",{className:"material-icons custom-icon-small text-danger d-block p-0 m-0",children:"timer"})}),t.jsx("td",{children:t.jsx("input",{type:"date",max:r.toISOString().split("T")[0],min:r.getDate()>=s.payment_period_start?r.toISOString().split("T")[0]:r.getMonth()===0?new Date(r.getFullYear()-1,11,26).toISOString().split("T")[0]:new Date(r.getFullYear(),r.getMonth()-1,26).toISOString().split("T")[0],className:"form-control form-control-sm",value:s.invoice_date,onChange:c=>_({type:"updateInvDate",id:s.id,invoice_date:c.target.value})})}),t.jsx("td",{children:s.tenant_name}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.tenant_acc_no,onChange:c=>_({type:"updateTenantAccNumber",id:s.id,tenant_acc_no:c.target.value})})}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.invoice_no,onChange:c=>_({type:"updateInvNumber",id:s.id,invoice_no:c.target.value})})}),t.jsx("td",{children:s.lease_currency_type}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.owing_amount,onChange:c=>_({type:"updateBaseRental",id:s.id,owing_amount:c.target.value})})}),t.jsx("td",{children:t.jsx("input",{className:"form-control form-control-sm",value:s.operationalCosts,onChange:c=>_({type:"updateOperatingCosts",id:s.id,operationalCosts:c.target.value})})}),t.jsx("td",{className:"text-end",children:v(s.total)}),t.jsx("td",{className:"text-center",children:t.jsx("button",{type:"button",className:"btn btn-danger btn-sm",onClick:()=>S(s),children:"-"})})]},s.id)),t.jsxs("tr",{className:"text-end fw-bold",children:[t.jsx("td",{colSpan:6}),t.jsx("td",{children:"Batch Total"}),t.jsx("td",{children:v(f)})]})]})]}),t.jsx("div",{className:"text-end",children:t.jsx("button",{onClick:A,className:"btn btn-info text-white",children:u?t.jsxs(t.Fragment,{children:[t.jsx("span",{className:"spinner-grow spinner-grow-sm d-inline-block me-2"}),"processing.."]}):"Submit"})})]})]})}st.layout=l=>t.jsx(tt,{children:l,title:"Tenant Invoicing"});export{st as default};
