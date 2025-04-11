import{r as p,a as g,j as e,u as N}from"./media/main-bfba9c40.js";import{h as v,a as w,R as y,L as D}from"./Layout-07e2828c.js";import{M as u}from"./Modal-07685045.js";import{B as _}from"./Button-bf257970.js";import{a as S,f as j}from"./formatting-fad57ba1.js";import"./lodash-734d596d.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-348ece4c.js";import"./MultipleUpload-2d782191.js";import"./index-c591c0af.js";import"./search-bcc199af.js";import"./index-d481af93.js";import"./Button-b2ecca88.js";const C=({show:c,handleClose:a,tenantData:d})=>{const[n,o]=p.useState(!1),{data:r,post:m,setData:h,errors:s}=g({tenantNumber:d?.tenantNumber||"",name:d?.name||"",adress:d?.adress||"",startDate:"",endDate:""}),l=i=>{h({...r,[i.target.id]:i.target.value})},x=i=>{i.preventDefault(),o(!0),m("/client/period-request",{onSuccess:()=>{o(!1),a()}})};return e.jsx(e.Fragment,{children:e.jsx(u,{size:"lg",show:c,onHide:a,children:e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx(u.Header,{closeButton:!0,className:"card-header bg-info px-4",children:e.jsxs("div",{className:`d-flex justify-content-between
                            align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:"Tenant Statement Period Request"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"card",children:e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(u.Body,{children:[e.jsxs("div",{className:"row",children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"col-md-12 my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Tenant Number ",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:r.tenantNumber,onChange:l,type:"text",name:"tenantNumber",required:!0,id:"tenantNumber",placeholder:"Enter tenant number",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.tenantNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:r.name,onChange:l,type:"text",name:"name",required:!0,id:"name",placeholder:"Enter tenant's full name",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.name})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:r.adress,onChange:l,type:"text",required:!0,name:"adress",id:"adress",placeholder:"Enter tenant's address",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.adress})]})]})})]}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["From",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:r.startDate,onChange:l,type:"date",name:"startDate",id:"startDate",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.startDate})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["To",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:r.endDate,onChange:l,type:"date",name:"endDate",id:"endDate",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.endDate})]})]})})})]}),e.jsx(u.Footer,{children:e.jsx(_,{className:"text-white",variant:"info",onClick:x,disabled:n,children:n?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Submit"})})]})})})]})})})})},R=C;function P(){const{detailed_statement:c,tenant_details:a,monthly_payments:d,missed_payments:n}=N().props,o=p.useRef(),[r,m]=p.useState(!1),[h,s]=p.useState(!1),[l,x]=p.useState({lease_id:a.lease_id}),i=S(d,n),t=()=>m(!1);function f(){const b=o.current;v().from(b).set({margin:1,filename:"modal-content.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()}return console.log({details:l,payments:d,invoices:n}),{show:r,tenant:a,details:l,statement:c,showReceipt:h,cleanedData:i,modalContentRef:o,setShow:m,setDetails:x,handleClose:t,setShowReceipt:s,handlePrintToPdf:f}}function k(){const{show:c,tenant:a,details:d,statement:n,showReceipt:o,cleanedData:r,modalContentRef:m,setShow:h,setDetails:s,handleClose:l,setShowReceipt:x,handlePrintToPdf:i}=P();return n?e.jsxs("div",{children:[e.jsx(R,{show:c,handleClose:l,tenantData:{tenantNumber:a.lease_receiver_id,name:a.lease_receiver_name,adress:a.lease_receiver_address}}),e.jsxs("div",{ref:m,children:[e.jsx("div",{style:{lineHeight:"5px",fontSize:"18px"},className:"bg-info",children:e.jsxs("div",{scope:"row",colSpan:5,className:"d-flex justify-content-between align-items-center text-white p-3",style:{width:"100%"},children:[e.jsxs("div",{className:"d-flex flex-column gap-2",children:[e.jsxs("h4",{className:"fw-bold text-white",children:[a.lease_receiver_name," - ",a?.currency]}),e.jsxs("p",{children:[a.lease_receiver_address," "]})]}),e.jsx("p",{children:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]})}),e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{className:"position-sticky c-table-top",children:e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#a0a0af"},children:[e.jsx("th",{scope:"",children:"Date"}),e.jsx("td",{children:"Description"}),e.jsx("td",{children:" Ref"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Balance"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:n.date}),e.jsx("td",{children:n.description}),e.jsx("td",{}),e.jsx("td",{className:"text-end"}),e.jsx("td",{className:"text-end",children:j(n.balance_amount)})]}),r.map((t,f)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:w(t.date).format("YYYY-MM-DD")}),e.jsxs("td",{children:[t.description," "]}),e.jsx("td",{children:t.reference}),e.jsx("td",{className:"text-end",children:t.owing_amount<0?`(${j(t.owing_amount*-1)})`:j(t.owing_amount)}),e.jsx("td",{className:"text-end",children:t.balance_amount<0?`(${j(t.balance_amount*-1)})`:j(t.balance_amount)})]},f))]})]})]}),e.jsxs("div",{className:"d-flex justify-content-end align-items-center gap-4 p-4",children:[e.jsx("button",{className:"btn btn-secondary",onClick:()=>{x(!0),s({lease_id:a.lease_id})},children:"Receipt"}),e.jsx("button",{className:"btn btn-primary",onClick:()=>h(!0),children:"Period request"}),e.jsx("button",{className:"btn btn-info text-white",onClick:i,children:"Print"})]}),e.jsx(y,{show:o,handleClose:async t=>{x(!1),s({})},leaseDetails:d,myKey:"statements"})]}):e.jsx("div",{children:e.jsx("h1",{children:N().props.message})})}k.layout=c=>e.jsx(D,{children:c,title:"Tenant Detailed Statement"});export{k as default};
