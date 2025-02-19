import{r as h,b as _,j as e}from"./main-bff74084.js";import{_ as n,I as g}from"./index-b70b1f56.js";import{L as f}from"./Layout-42393a21.js";import{u as x,b}from"./index-d9499e15.js";import"./lodash-2de872b6.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-cb0d2c55.js";import"./Modal-948b5595.js";import"./index-8b11c945.js";import"./formatting-345d2430.js";import"./MultipleUpload-6c5a4465.js";import"./search-8305c8ec.js";function p(){const[s,r]=h.useState(!1),[m,a]=h.useState([]);h.useEffect(()=>{_.get(reverseUrl("client-leases"),{params:{is_debt_call:!0}}).then(c=>{var l,t;a(((t=(l=c.data[0])==null?void 0:l.leases)==null?void 0:t.map(i=>({lease_id:i.lease_id,account_number:i.customer_number||"",customer_name:i.name||"",currency:i.currency||"",is_company:i.is_company||"",balance_owing:i.owing_amount||""})))||[])}).catch(c=>{console.log(c),n.error(x(c))})},[]);function d(c){c.preventDefault(),r(!0);const l=new FormData(c.target),t=Object.fromEntries(l);if(t.contact_methods=l.getAll("contact_methods"),t.aging_filters=l.getAll("aging_filters"),t.leases_to_sms=l.getAll("leases_to_sms"),t.leases_to_email=l.getAll("leases_to_email"),console.log({payload:t}),!u(t)){r(!1);return}_.post(reverseUrl("debt_call"),t).then(o=>{n.success(x(o))}).catch(o=>{console.log(o),n.error(x(o))}),r(!1)}return{data:m,processing:s,handleSubmit:d}}function u(s){return s.leases_to_email.length||s.leases_to_sms.length?!!s.leases_to_email.length&&!s.email_message?(n.error("please enter an email message or untick all customer email boxes"),!1):!!s.leases_to_sms.length&&!s.sms_message?(n.error("please enter an sms message or untick all customer sms boxes"),!1):!0:(n.error("please select email/sms for at least one customer"),!1)}function j(){const{data:s,processing:r,handleSubmit:m}=p();return e.jsxs("form",{onSubmit:m,children:[e.jsx(g,{position:"top-right",duration:"4000"}),e.jsx("h5",{className:"text-center p-2 mb-4 text-white custom-bg-grey-2 rounded",children:"DEBT CALL"}),e.jsxs("div",{className:"row align-items-start g-4",children:[e.jsx("div",{className:"col-6",children:e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3 bg-white border",children:[e.jsx("p",{className:"text-center p-1 mb-0 text-white bg-info",children:"Contact Method"}),e.jsxs("div",{className:"p-2 d-flex gap-2",children:[e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"email",name:"contact_methods",id:"email_contact_methods"}),e.jsx("label",{className:"form-check-label",htmlFor:"email_contact_methods",children:"Email"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"sms",name:"contact_methods",id:"sms_contact_methods"}),e.jsx("label",{className:"form-check-label",htmlFor:"sms_contact_methods",children:"SMS"})]})]})]}),e.jsxs("div",{className:"mb-3 bg-white border",children:[e.jsx("p",{className:"text-center p-1 mb-0 text-white bg-info",children:"Filter By Ageing"}),e.jsxs("div",{className:"p-2 d-flex gap-2 justify-content-around",children:[e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"current",name:"aging_filters",id:"current_aging_filters"}),e.jsx("label",{className:"form-check-label",htmlFor:"current_aging_filters",children:"Current"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"1-30days",name:"aging_filters",id:"1-30days_aging_filters"}),e.jsx("label",{className:"form-check-label",htmlFor:"1-30days_aging_filters",children:"1-30 Days"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"31-60days",name:"aging_filters",id:"31-60days_aging_filters"}),e.jsx("label",{className:"form-check-label",htmlFor:"31-60days_aging_filters",children:"31-60 Days"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"61-90days",name:"aging_filters",id:"61-90days_aging_filters"}),e.jsx("label",{className:"form-check-label",htmlFor:"61-90days_aging_filters",children:"61-90 Days"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"+90days",name:"aging_filters",id:"+90days_aging_filters"}),e.jsx("label",{className:"form-check-label",htmlFor:"+90days_aging_filters",children:"+90 Days"})]})]})]}),e.jsxs("div",{className:"mb-3 bg-white border",children:[e.jsx("p",{className:"text-center p-1 mb-0 text-white bg-info",children:"Filter By Balance"}),e.jsxs("div",{className:"p-2 d-flex gap-3 align-items-center justify-content-around",children:[e.jsx("label",{className:"form-label text-nowrap",htmlFor:"balance_filter",children:"Contact all debtors with balances above"}),e.jsx("input",{className:"form-control form-control-sm c-w-fit",type:"number",name:"balance_filter",id:"balance_filter"})]})]}),e.jsxs("div",{className:"mb-3 bg-white border",children:[e.jsx("p",{className:"text-center p-1 mb-0 text-white bg-info",children:"SMS Message"}),e.jsx("div",{className:"p-2 d-flex gap-3 align-items-center",children:e.jsx("textarea",{className:"form-control",name:"sms_message",id:"sms_message",rows:"3",placeholder:"Enter message here..."})})]}),e.jsxs("div",{className:"mb-3 bg-white border",children:[e.jsx("p",{className:"text-center p-1 mb-0 text-white bg-info",children:"Email Message"}),e.jsx("div",{className:"p-2 d-flex gap-3 align-items-center",children:e.jsx("textarea",{className:"form-control",name:"email_message",id:"email_message",rows:"3",placeholder:"Enter message here..."})})]})]})}),e.jsx("div",{className:"col-6",children:e.jsxs("div",{children:[e.jsxs("div",{className:"bg-white",children:[e.jsx("div",{id:"debt-call-table",children:e.jsxs("table",{className:"table table-sm table-bordered table-responsive mb-0 position-relative",children:[e.jsx("thead",{className:"sticky-top bg-white shadow-sm",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Lease ID "}),e.jsx("th",{children:"Customer Name "}),e.jsx("th",{className:"text-end",children:"Balance Owing "}),e.jsx("th",{children:"Sms "}),e.jsx("th",{children:"Email"})]})}),e.jsx("tbody",{children:s==null?void 0:s.map((a,d)=>e.jsxs("tr",{children:[e.jsx("td",{children:a.lease_id}),e.jsx("td",{children:a.customer_name}),e.jsx("td",{className:"text-end",children:`${a.currency.trim().toUpperCase()} ${b(a.balance_owing).replace("$","")}`}),e.jsx("td",{children:e.jsx("div",{className:"form-check d-flex justify-content-center",children:e.jsx("input",{className:"form-check-input",type:"checkbox",name:"leases_to_sms",value:a.lease_id,defaultChecked:!a.is_company})})}),e.jsx("td",{children:e.jsx("div",{className:"form-check d-flex justify-content-center",children:e.jsx("input",{className:"form-check-input",type:"checkbox",name:"leases_to_email",value:a.lease_id,defaultChecked:a.is_company})})})]},d))})]})}),(s==null?void 0:s.length)===0&&e.jsx("div",{className:"custom-h-4 d-flex justify-content-center align-items-center border border-2",children:"Nothing to show"})]}),e.jsx("div",{className:"text-end p-4",children:e.jsx("button",{disabled:(s==null?void 0:s.length)===0,type:"submit",className:"btn btn-info text-white gap-2",children:r?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{children:"Processing.."})]}):"Send"})})]})})]})]})}j.layout=s=>e.jsx(f,{children:s,title:"Debt Call"});export{j as default};
