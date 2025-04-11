import{j as e,r as _,_ as v,b as Z,d as G}from"./media/main-bfba9c40.js";import{a as D,L as H}from"./Layout-07e2828c.js";import{M as T}from"./Modal-07685045.js";import{A as J}from"./index-c591c0af.js";import"./lodash-734d596d.js";import{f as O}from"./formatting-fad57ba1.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-348ece4c.js";import"./MultipleUpload-2d782191.js";import"./search-bcc199af.js";import"./index-d481af93.js";function W({show:c,invoice:i,confirmDismissal:u,handleClose:b}){return e.jsxs(T,{centered:!0,size:"md",backdrop:"static",show:c,onHide:b,children:[e.jsx(T.Header,{closeButton:!0,className:"h4 bg-info text-white text-center text-uppercase",children:"Confirm Invoice Dismissal"}),e.jsx(T.Body,{className:"p-4 d-flex justify-content-between align-items-center gap-4",children:e.jsxs("p",{className:"my-3",children:["Are you sure you want to dismiss invoice for ",i.tenant_name,"? No invoice amount or record will be posted for the customer for the month."]})}),e.jsxs(T.Footer,{className:"p-4 d-flex justify-content-end gap-4",children:[e.jsxs("button",{onClick:b,className:"btn btn-light gap-2",children:[e.jsx("i",{className:"material-icons",children:"cancel"}),"Cancel"]}),e.jsxs("button",{onClick:u,className:"btn btn-danger gap-2",children:[e.jsx("i",{className:"material-icons",children:"done"}),"Confirm"]})]})]})}function $({tenant_list:c,errors:i,result:u,status:b,message:f}){const[B,g]=_.useState(!1),[d,j]=_.useState(null),m=new Date,p=c?.filter(s=>s.lease_currency_type.toUpperCase()==="USD")||[],h=c?.filter(s=>s.lease_currency_type.toUpperCase()==="ZWG")||[],[M,x]=_.useState(p?.reduce((s,a)=>s+Number(a.owing_amount),0)||0),[N,n]=_.useState(h?.reduce((s,a)=>s+Number(a.owing_amount),0)||0),[l,R]=_.useReducer(k,p.map(s=>({...s,invoice_date:m.toISOString().split("T")[0],edited:!1,total:s?.owing_amount||0,operationalCosts:"",tenant_acc_no:"",invoice_no:""}))),[Y,A]=_.useReducer(F,h.map(s=>({...s,invoice_date:m.toISOString().split("T")[0],edited:!1,total:s?.owing_amount||"",operationalCosts:"",tenant_acc_no:"",invoice_no:""})));function k(s,a){switch(a.type){case"updateBaseRental":let r=s.map(t=>t.id===a.id?{...t,owing_amount:a.owing_amount,edited:!0,total:Number(t.operationalCosts)+Number(a.owing_amount)}:t);return x(r.reduce((t,o)=>t+Number(o.total),0)),r;case"updateInvDate":let w=s.map(t=>t.id===a.id?{...t,invoice_date:a.invoice_date,edited:!0}:t);return x(w.reduce((t,o)=>t+Number(o.total),0)),w;case"updateInvNumber":let y=s.map(t=>t.id===a.id?{...t,invoice_no:a.invoice_no,edited:!0}:t);return x(y.reduce((t,o)=>t+Number(o.total),0)),y;case"updateTenantAccNumber":let S=s.map(t=>t.id===a.id?{...t,tenant_acc_no:a.tenant_acc_no,edited:!0}:t);return x(S.reduce((t,o)=>t+Number(o.total),0)),S;case"updateOperatingCosts":let C=s.map(t=>t.id===a.id?{...t,edited:!0,operationalCosts:a.operationalCosts,total:Number(t.owing_amount)+Number(a.operationalCosts)}:t);return x(C.reduce((t,o)=>t+Number(o.total),0)),C;case"filterSubmittedInvoices":let I=s.filter(t=>!a.idsToFilter.includes(t.id));return x(I.reduce((t,o)=>t+Number(o.total),0)),I;default:return s}}function F(s,a){switch(a.type){case"updateBaseRental":let r=s.map(t=>t.id===a.id?{...t,owing_amount:a.owing_amount,edited:!0,total:Number(t.operationalCosts)+Number(a.owing_amount)}:t);return n(r.reduce((t,o)=>t+Number(o.total),0)),r;case"updateInvDate":let w=s.map(t=>t.id===a.id?{...t,invoice_date:a.invoice_date,edited:!0}:t);return n(w.reduce((t,o)=>t+Number(o.total),0)),w;case"updateInvNumber":let y=s.map(t=>t.id===a.id?{...t,invoice_no:a.invoice_no,edited:!0}:t);return n(y.reduce((t,o)=>t+Number(o.total),0)),y;case"updateTenantAccNumber":let S=s.map(t=>t.id===a.id?{...t,tenant_acc_no:a.tenant_acc_no,edited:!0}:t);return n(S.reduce((t,o)=>t+Number(o.total),0)),S;case"updateOperatingCosts":let C=s.map(t=>t.id===a.id?{...t,edited:!0,operationalCosts:a.operationalCosts,total:Number(t.owing_amount)+Number(a.operationalCosts)}:t);return n(C.reduce((t,o)=>t+Number(o.total),0)),C;case"filterSubmittedInvoices":let I=s.filter(t=>!a.idsToFilter.includes(t.id));return n(I.reduce((t,o)=>t+Number(o.total),0)),I;default:return s}}async function z(){g(!0);const s=[],a=[];if(l.forEach(r=>{r.edited&&(s.push({leaseId:r.id,invoiceDate:r.invoice_date,baseRental:r.owing_amount,operationCosts:r.operationalCosts,invoiceNumber:r.invoice_no,tenantAccNumber:r.tenant_acc_no}),a.push(r.id))}),Y.forEach(r=>{r.edited&&(s.push({leaseId:r.id,invoiceDate:r.invoice_date,baseRental:r.owing_amount,operationCosts:r.operationalCosts,invoiceNumber:r.invoice_no,tenantAccNumber:r.tenant_acc_no}),a.push(r.id))}),s.length===0){g(!1),v.error("No changes detected, please fill in at least one invoice",{icon:"❌",duration:5e3});return}try{console.log({data:s}),await Z.post(reverseUrl("client_invoice"),s),R({type:"filterSubmittedInvoices",idsToFilter:a}),A({type:"filterSubmittedInvoices",idsToFilter:a})}catch(r){console.log(r),r instanceof J?v.error(`An error occurred! ${r.response.statusText}`):v.error(`An error occurred! ${JSON.stringify(r)}`,{icon:"❌"})}g(!1)}_.useEffect(()=>{i?(console.log(i),v.error("Error: "+JSON.stringify(i),{duration:5e3,icon:"❌"})):u==="success"&&f&&v.success(f,{duration:5e3,icon:"✔"})},[i,u,f]);const E=D().date()>8&&D().date()<25?D().subtract(1,"months").format("MMMM YYYY"):D().format("MMMM YYYY"),U=c?.some(s=>m.getDate()<s.payment_period_start&&m.getDate()>8);function L(){g(!0);const s=[d.id],a=[{leaseId:d.id,invoiceDate:d.invoice_date,baseRental:d.owing_amount,operationCosts:d.operationalCosts,invoiceNumber:d.invoice_no,tenantAccNumber:d.tenant_acc_no,terminated:!0}];console.log({invoiceToDismiss:d,data:a}),G.Inertia.post(reverseUrl("client_invoice"),a,{onSuccess:r=>{console.log(r),R({type:"filterSubmittedInvoices",idsToFilter:s}),A({type:"filterSubmittedInvoices",idsToFilter:s}),j(null)},onError:r=>{console.log(r),j(null)}}),g(!1)}return{today:m,pastDue:U,usdBatchTotal:M,zwlBatchTotal:N,usdState:l,zwlState:Y,isLoading:B,headerDate:E,invoiceToDismiss:d,usdDispatch:R,zwlDispatch:A,submitData:z,confirmDismissal:L,setInvoiceToDismiss:j}}function q(c){const{today:i,pastDue:u,usdBatchTotal:b,zwlBatchTotal:f,usdState:B,zwlState:g,isLoading:d,headerDate:j,invoiceToDismiss:m,usdDispatch:p,zwlDispatch:h,submitData:M,confirmDismissal:x,setInvoiceToDismiss:N}=$(c);return e.jsxs("div",{className:"card card-raised",children:[!!m&&e.jsx(W,{show:!0,invoice:m,confirmDismissal:x,handleClose:()=>N(null)}),e.jsxs("div",{className:"h5 m-0 p-3 bg-info text-center text-white",children:["Rental Invoicing - ",j]}),e.jsxs("div",{className:"card-body p-4",children:[e.jsxs("table",{className:"table table-sm table-responsive table-bordered custom-fs-normal",children:[e.jsx("thead",{className:"position-sticky c-table-top bg-white shadow-sm",children:e.jsxs("tr",{children:[u&&e.jsx("th",{}),e.jsx("th",{children:"Inv. Date"}),e.jsx("th",{children:"Tenant Name"}),e.jsx("th",{children:"Tenant Acc. No."}),e.jsx("th",{children:"Inv. No."}),e.jsx("th",{children:"Currency"}),e.jsx("th",{children:"Base Rental"}),e.jsx("th",{children:"Operating Costs"}),e.jsx("th",{children:"Total"}),e.jsx("th",{})]})}),e.jsxs("tbody",{children:[e.jsx("tr",{children:e.jsx("th",{className:"border-0 py-3",children:"USD"})}),B.map(n=>e.jsxs("tr",{children:[u&&e.jsx("td",{className:"text-center px-0",children:e.jsx("i",{title:"invoice is past payment period",className:"material-icons custom-cursor-pointer custom-icon-small text-danger d-block p-0 m-0",children:"timer"})}),e.jsx("td",{children:e.jsx("input",{type:"date",max:i.toISOString().split("T")[0],min:i.getDate()>=n.payment_period_start?i.toISOString().split("T")[0]:i.getMonth()===0?new Date(i.getFullYear()-1,11,26).toISOString().split("T")[0]:new Date(i.getFullYear(),i.getMonth()-1,26).toISOString().split("T")[0],className:"form-control form-control-sm",value:n.invoice_date,onChange:l=>p({type:"updateInvDate",id:n.id,invoice_date:l.target.value})})}),e.jsx("td",{children:n.tenant_name}),e.jsx("td",{children:e.jsx("input",{className:"form-control form-control-sm",value:n.tenant_acc_no,onChange:l=>p({type:"updateTenantAccNumber",id:n.id,tenant_acc_no:l.target.value})})}),e.jsx("td",{children:e.jsx("input",{className:"form-control form-control-sm",value:n.invoice_no,onChange:l=>p({type:"updateInvNumber",id:n.id,invoice_no:l.target.value})})}),e.jsx("td",{children:n.lease_currency_type}),e.jsx("td",{children:e.jsx("input",{className:"form-control form-control-sm",value:n.owing_amount,onChange:l=>p({type:"updateBaseRental",id:n.id,owing_amount:l.target.value})})}),e.jsx("td",{children:e.jsx("input",{className:"form-control form-control-sm",value:n.operationalCosts,onChange:l=>p({type:"updateOperatingCosts",id:n.id,operationalCosts:l.target.value})})}),e.jsx("td",{className:"text-end",children:O(n.total)}),e.jsx("td",{className:"text-center",children:e.jsx("button",{type:"button",className:"btn btn-danger btn-sm",onClick:()=>N(n),children:"-"})})]},n.id)),e.jsxs("tr",{className:"text-end fw-bold",children:[e.jsx("td",{colSpan:6}),e.jsx("td",{children:"Batch Total"}),e.jsx("td",{children:O(b)})]}),e.jsx("tr",{children:e.jsx("th",{className:"border-0 py-3",children:"ZWG"})}),g.map(n=>e.jsxs("tr",{children:[u&&e.jsx("td",{title:"invoice is past payment period",className:"text-center px-0",children:e.jsx("i",{className:"material-icons custom-icon-small text-danger d-block p-0 m-0",children:"timer"})}),e.jsx("td",{children:e.jsx("input",{type:"date",max:i.toISOString().split("T")[0],min:i.getDate()>=n.payment_period_start?i.toISOString().split("T")[0]:i.getMonth()===0?new Date(i.getFullYear()-1,11,26).toISOString().split("T")[0]:new Date(i.getFullYear(),i.getMonth()-1,26).toISOString().split("T")[0],className:"form-control form-control-sm",value:n.invoice_date,onChange:l=>h({type:"updateInvDate",id:n.id,invoice_date:l.target.value})})}),e.jsx("td",{children:n.tenant_name}),e.jsx("td",{children:e.jsx("input",{className:"form-control form-control-sm",value:n.tenant_acc_no,onChange:l=>h({type:"updateTenantAccNumber",id:n.id,tenant_acc_no:l.target.value})})}),e.jsx("td",{children:e.jsx("input",{className:"form-control form-control-sm",value:n.invoice_no,onChange:l=>h({type:"updateInvNumber",id:n.id,invoice_no:l.target.value})})}),e.jsx("td",{children:n.lease_currency_type}),e.jsx("td",{children:e.jsx("input",{className:"form-control form-control-sm",value:n.owing_amount,onChange:l=>h({type:"updateBaseRental",id:n.id,owing_amount:l.target.value})})}),e.jsx("td",{children:e.jsx("input",{className:"form-control form-control-sm",value:n.operationalCosts,onChange:l=>h({type:"updateOperatingCosts",id:n.id,operationalCosts:l.target.value})})}),e.jsx("td",{className:"text-end",children:O(n.total)}),e.jsx("td",{className:"text-center",children:e.jsx("button",{type:"button",className:"btn btn-danger btn-sm",onClick:()=>N(n),children:"-"})})]},n.id)),e.jsxs("tr",{className:"text-end fw-bold",children:[e.jsx("td",{colSpan:6}),e.jsx("td",{children:"Batch Total"}),e.jsx("td",{children:O(f)})]})]})]}),e.jsx("div",{className:"text-end",children:e.jsx("button",{onClick:M,className:"btn btn-info text-white",children:d?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm d-inline-block me-2"}),"processing.."]}):"Submit"})})]})]})}q.layout=c=>e.jsx(H,{children:c,title:"Tenant Invoicing"});export{q as default};
