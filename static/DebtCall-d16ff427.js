import{r as d,b as x,_ as r,j as e}from"./media/main-9b13349a.js";import{L as _}from"./Layout-4dbbc259.js";import{u as h,b as g}from"./index-128beda7.js";import"./lodash-c68d99f1.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-076133b3.js";import"./Modal-dae17af9.js";import"./index-548a2c78.js";import"./formatting-fad57ba1.js";import"./MultipleUpload-62b8fca2.js";import"./search-a9081f74.js";function f(){const[s,i]=d.useState(!1),[n,t]=d.useState([]);d.useEffect(()=>{x.get(reverseUrl("client-leases"),{params:{is_debt_call:!0}}).then(l=>{t(l.data[0]?.leases?.map(a=>({lease_id:a.lease_id,account_number:a.customer_number||"",customer_name:a.name||"",currency:a.currency||"",is_company:a.is_company||"",balance_owing:a.owing_amount||""}))||[])}).catch(l=>{console.log(l),r.error(h(l))})},[]);function o(l){l.preventDefault(),i(!0);const a=new FormData(l.target),c=Object.fromEntries(a);if(c.contact_methods=a.getAll("contact_methods"),c.aging_filters=a.getAll("aging_filters"),c.leases_to_sms=a.getAll("leases_to_sms"),c.leases_to_email=a.getAll("leases_to_email"),console.log({payload:c}),!b(c)){i(!1);return}x.post(reverseUrl("debt_call"),c).then(m=>{r.success(h(m))}).catch(m=>{console.log(m),r.error(h(m))}),i(!1)}return{data:n,processing:s,handleSubmit:o}}function b(s){return s.leases_to_email.length||s.leases_to_sms.length?!!s.leases_to_email.length&&!s.email_message?(r.error("please enter an email message or untick all customer email boxes"),!1):!!s.leases_to_sms.length&&!s.sms_message?(r.error("please enter an sms message or untick all customer sms boxes"),!1):!0:(r.error("please select email/sms for at least one customer"),!1)}function p(){const{data:s,processing:i,handleSubmit:n}=f();return e.jsxs("form",{onSubmit:n,children:[e.jsx("h5",{className:"text-center p-2 mb-4 text-white custom-bg-grey-2 rounded",children:"DEBT CALL"}),e.jsxs("div",{className:"row align-items-start g-4",children:[e.jsx("div",{className:"col-6",children:e.jsxs("div",{children:[e.jsxs("div",{className:"mb-3 bg-white border",children:[e.jsx("p",{className:"text-center p-1 mb-0 text-white bg-info",children:"Contact Method"}),e.jsxs("div",{className:"p-2 d-flex gap-2",children:[e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"email",name:"contact_methods",id:"email_contact_methods"}),e.jsx("label",{className:"form-check-label",htmlFor:"email_contact_methods",children:"Email"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"sms",name:"contact_methods",id:"sms_contact_methods"}),e.jsx("label",{className:"form-check-label",htmlFor:"sms_contact_methods",children:"SMS"})]})]})]}),e.jsxs("div",{className:"mb-3 bg-white border",children:[e.jsx("p",{className:"text-center p-1 mb-0 text-white bg-info",children:"Filter By Ageing"}),e.jsxs("div",{className:"p-2 d-flex gap-2 justify-content-around",children:[e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"current",name:"aging_filters",id:"current_aging_filters"}),e.jsx("label",{className:"form-check-label",htmlFor:"current_aging_filters",children:"Current"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"1-30days",name:"aging_filters",id:"1-30days_aging_filters"}),e.jsx("label",{className:"form-check-label",htmlFor:"1-30days_aging_filters",children:"1-30 Days"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"31-60days",name:"aging_filters",id:"31-60days_aging_filters"}),e.jsx("label",{className:"form-check-label",htmlFor:"31-60days_aging_filters",children:"31-60 Days"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"61-90days",name:"aging_filters",id:"61-90days_aging_filters"}),e.jsx("label",{className:"form-check-label",htmlFor:"61-90days_aging_filters",children:"61-90 Days"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",value:"+90days",name:"aging_filters",id:"+90days_aging_filters"}),e.jsx("label",{className:"form-check-label",htmlFor:"+90days_aging_filters",children:"+90 Days"})]})]})]}),e.jsxs("div",{className:"mb-3 bg-white border",children:[e.jsx("p",{className:"text-center p-1 mb-0 text-white bg-info",children:"Filter By Balance"}),e.jsxs("div",{className:"p-2 d-flex gap-3 align-items-center justify-content-around",children:[e.jsx("label",{className:"form-label text-nowrap",htmlFor:"balance_filter",children:"Contact all debtors with balances above"}),e.jsx("input",{className:"form-control form-control-sm c-w-fit",type:"number",name:"balance_filter",id:"balance_filter"})]})]}),e.jsxs("div",{className:"mb-3 bg-white border",children:[e.jsx("p",{className:"text-center p-1 mb-0 text-white bg-info",children:"SMS Message"}),e.jsx("div",{className:"p-2 d-flex gap-3 align-items-center",children:e.jsx("textarea",{className:"form-control",name:"sms_message",id:"sms_message",rows:"3",placeholder:"Enter message here..."})})]}),e.jsxs("div",{className:"mb-3 bg-white border",children:[e.jsx("p",{className:"text-center p-1 mb-0 text-white bg-info",children:"Email Message"}),e.jsx("div",{className:"p-2 d-flex gap-3 align-items-center",children:e.jsx("textarea",{className:"form-control",name:"email_message",id:"email_message",rows:"3",placeholder:"Enter message here..."})})]})]})}),e.jsx("div",{className:"col-6",children:e.jsxs("div",{children:[e.jsxs("div",{className:"bg-white",children:[e.jsx("div",{id:"debt-call-table",children:e.jsxs("table",{className:"table table-sm table-bordered table-responsive mb-0 position-relative",children:[e.jsx("thead",{className:"sticky-top bg-white shadow-sm",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Lease ID "}),e.jsx("th",{children:"Customer Name "}),e.jsx("th",{className:"text-end",children:"Balance Owing "}),e.jsx("th",{children:"Sms "}),e.jsx("th",{children:"Email"})]})}),e.jsx("tbody",{children:s?.map((t,o)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.lease_id}),e.jsx("td",{children:t.customer_name}),e.jsx("td",{className:"text-end",children:`${t.currency.trim().toUpperCase()} ${g(t.balance_owing).replace("$","")}`}),e.jsx("td",{children:e.jsx("div",{className:"form-check d-flex justify-content-center",children:e.jsx("input",{className:"form-check-input",type:"checkbox",name:"leases_to_sms",value:t.lease_id,defaultChecked:!t.is_company})})}),e.jsx("td",{children:e.jsx("div",{className:"form-check d-flex justify-content-center",children:e.jsx("input",{className:"form-check-input",type:"checkbox",name:"leases_to_email",value:t.lease_id,defaultChecked:t.is_company})})})]},o))})]})}),s?.length===0&&e.jsx("div",{className:"custom-h-4 d-flex justify-content-center align-items-center border border-2",children:"Nothing to show"})]}),e.jsx("div",{className:"text-end p-4",children:e.jsx("button",{disabled:s?.length===0,type:"submit",className:"btn btn-info text-white gap-2",children:i?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{children:"Processing.."})]}):"Send"})})]})})]})]})}p.layout=s=>e.jsx(_,{children:s,title:"Debt Call"});export{p as default};
