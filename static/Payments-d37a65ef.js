var C=Object.defineProperty,A=Object.defineProperties;var T=Object.getOwnPropertyDescriptors;var D=Object.getOwnPropertySymbols;var $=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable;var P=(t,a,n)=>a in t?C(t,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[a]=n,k=(t,a)=>{for(var n in a||(a={}))$.call(a,n)&&P(t,n,a[n]);if(D)for(var n of D(a))O.call(a,n)&&P(t,n,a[n]);return t},E=(t,a)=>A(t,T(a));import{j as e,r as x,u as I,b as v}from"./main-76766219.js";import{l as w,u as _,c as S,f as F}from"./index-7202a5e9.js";import{W as L}from"./Layout-6c58fe9b.js";function y({title:t,children:a,noBoundary:n,noOuterStyles:s}){const c=s?"":n?"bg-white mb-3":"bg-white rounded-2 border overflow-hidden border-dark shadow-sm mb-3";return e.jsxs("div",{className:c,children:[e.jsx("div",{className:"rounded-top-2 custom-bg-grey text-white text-center p-1",children:w.capitalize(t)}),a]})}function K({data:t,isCreditorView:a}){let n=0;return Object.keys(t).forEach(s=>n+=t[s]),e.jsx(y,{title:a?"ageing":"aged analysis",children:e.jsxs("table",{className:"table table-sm table-responsive table-bordered  mb-0",children:[e.jsx("thead",{className:"custom-bg-grey-2 text-white",children:e.jsxs("tr",{children:[e.jsx("th",{children:"90+ Days"}),e.jsx("th",{children:"90 Days"}),e.jsx("th",{children:"60 Days"}),e.jsx("th",{children:"30 Days"}),e.jsx("th",{children:"Current"}),e.jsx("th",{children:"total"})]})}),e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("td",{children:t.oneTwentyDays}),e.jsx("td",{children:t.ninetyDays}),e.jsx("td",{children:t.sixtyDays}),e.jsx("td",{children:t.thirtyDays}),e.jsx("td",{children:t.current}),e.jsxs("td",{children:["$",n]})]})})]})})}function M(t,a,n){const[s,c]=x.useState(!t),[u,m]=x.useState(t),[i,o]=x.useState(""),[r,h]=x.useState(!1),{Auth:p}=I().props,b=`${p.user_profile.first_name} ${p.user_profile.last_name}`;function l(d){d.preventDefault(),h(!0),o("");const j=Object.fromEntries(new FormData(d.target).entries());n?j.creditor_id=a.toString():j.client_id=a.toString(),v.put(reverseUrl("debtor_intelligence"),j).then(f=>{const N={text:f.data.note,user:f.data.user_name,timestamp:f.data.updated_at||f.data.created_at};m(N),o(""),h(!1),c(!1)}).catch(f=>{o(_(f)),h(!1),c(!u)})}return{data:u,isEditMode:s,handleSave:l,loggedInUser:b,setIsEditMode:c,error:i,setError:o,isLoading:r}}function Q({data:t,clientId:a,isCreditorView:n}){const{data:s,isEditMode:c,handleSave:u,loggedInUser:m,setIsEditMode:i,error:o,setError:r,isLoading:h}=M(t,a,n);return e.jsx(y,{title:n?"creditor intelligence":"customer intelligence",children:e.jsxs("div",{className:"px-3 py-2",children:[o&&e.jsxs("p",{className:"d-flex align-items-start gap-1 small text-danger",children:[e.jsx("button",{type:"button",onClick:()=>r(""),className:"btn-close btn-sm"}),w.truncate(o,{length:150})]}),c?e.jsxs("form",{onSubmit:u,children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"note",className:"form-label",children:s&&s.text?"Edit note":"No note found, create new note"}),e.jsx("textarea",{className:"form-control",name:"note",id:"note",rows:"2",defaultValue:s&&s.text?s.text:"",placeholder:"type here...",disabled:h})]}),e.jsx("b",{className:"d-block my-1",children:m}),e.jsx("div",{className:"small text-success",children:"today"}),e.jsx("button",{disabled:h,type:"submit",className:"d-block btn btn-info text-white w-100 mt-3",children:h?"Saving...":"Save"})]}):e.jsxs("div",{children:[e.jsx("small",{children:s.text}),e.jsx("b",{className:"d-block my-1",children:s.user}),e.jsx("div",{className:"small text-success",children:S(s.timestamp)}),e.jsx("button",{onClick:()=>i(!0),type:"button",className:"d-block btn btn-info w-100 mt-4 text-white",children:"Edit"})]})]})})}function U(t,a,n){const[s,c]=x.useState(!t),[u,m]=x.useState(t),[i,o]=x.useState(""),[r,h]=x.useState(!1);function p(b){b.preventDefault(),h(!0),o("");const l=Object.fromEntries(new FormData(b.target).entries());n?l.creditor_id=a.toString():l.client_id=a.toString(),l.other_numbers=l.other_numbers.split(",").filter(Boolean).map(d=>d.trim()),v.put(reverseUrl("update_client_contact_details"),l).then(d=>{const j={contactPerson:`${d.data.firstname} ${d.data.surname}`,smsNumber:d.data.sms_number,otherNumbers:d.data.other_numbers?d.data.other_numbers.join(", "):"",emailAddress:d.data.email_address,address:d.data.address};m(j),o(""),h(!1),c(!1)}).catch(d=>{o(_(d)),h(!1),c(!u)})}return{data:u,isEditMode:s,handleSave:p,setIsEditMode:c,error:i,setError:o,isLoading:r}}function X({data:t,clientId:a,isCreditorView:n}){const{data:s,isEditMode:c,handleSave:u,setIsEditMode:m,error:i,setError:o,isLoading:r}=U(t,a,n);return e.jsx(y,{title:"contact details",children:e.jsxs("div",{className:"py-2",children:[i&&e.jsxs("p",{className:"d-flex align-items-start px-2 gap-1 small text-danger",children:[e.jsx("button",{type:"button",onClick:()=>o(""),className:"btn-close btn-sm"}),w.truncate(i,{length:150})]}),c?e.jsxs("form",{onSubmit:u,children:[e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("label",{htmlFor:"firstname",className:"form-label small",children:"First Name"}),e.jsx("input",{type:"text",className:"form-control form-control-sm w-50 rounded-2",name:"firstname",id:"firstname",disabled:r,defaultValue:s&&s.contactPerson?s.contactPerson.trim().split(" ")[0]:""})]}),e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom",children:[e.jsx("label",{htmlFor:"surname",className:"form-label small",children:"Surname"}),e.jsx("input",{type:"text",className:"form-control form-control-sm w-50 rounded-2",name:"surname",id:"surname",disabled:r,defaultValue:s&&s.contactPerson?s.contactPerson.trim().split(" ")[1]:""})]}),e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("label",{htmlFor:"sms_number",className:"form-label small",children:"SMS Number"}),e.jsx("input",{type:"text",className:"form-control form-control-sm w-50 rounded-2",name:"sms_number",id:"sms_number",disabled:r,defaultValue:s&&s.smsNumber?s.smsNumber:""})]}),e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom",children:[e.jsx("label",{htmlFor:"other_numbers",className:"form-label small",children:"Other Numbers (comma separated)"}),e.jsx("input",{type:"text",className:"form-control form-control-sm w-50 rounded-2",name:"other_numbers",id:"other_numbers",disabled:r,defaultValue:s&&s.other_numbers?s.other_numbers:"",placeholder:"(comma separated)"})]}),e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("label",{htmlFor:"email_address",className:"form-label small",children:"Email Address"}),e.jsx("input",{type:"email",className:"form-control form-control-sm w-50 rounded-2",name:"email_address",id:"email_address",disabled:r,defaultValue:s&&s.emailAddress?s.emailAddress:""})]}),e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom",children:[e.jsx("label",{htmlFor:"address",className:"form-label small",children:"Address"}),e.jsx("input",{type:"text",className:"form-control form-control-sm w-50 rounded-2",name:"address",id:"address",disabled:r,defaultValue:s&&s.address?s.address:""})]}),e.jsx("button",{disabled:r,type:"submit",className:"d-block btn btn-info text-white w-100 mt-3",children:r?"Saving...":"Save"})]}):e.jsxs("div",{children:[e.jsxs("div",{className:"d-flex gap-2 py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("div",{children:"Contact Person: "}),e.jsx("div",{className:"flex-grow-1 text-center",children:s.contactPerson})]}),e.jsxs("div",{className:"d-flex gap-2 py-1 px-2 border-bottom",children:[e.jsx("div",{children:"SMS Number: "}),e.jsx("div",{className:"flex-grow-1 text-center",children:s.smsNumber})]}),e.jsxs("div",{className:"d-flex gap-2 py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("div",{children:"Other Numbers: "}),e.jsx("div",{className:"flex-grow-1 text-center",children:s.otherNumbers})]}),e.jsxs("div",{className:"d-flex gap-2 py-1 px-2 border-bottom",children:[e.jsx("div",{children:"Email Address: "}),e.jsx("div",{className:"flex-grow-1 text-center",children:s.emailAddress})]}),e.jsxs("div",{className:"d-flex gap-2 py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("div",{children:"Address: "}),e.jsx("div",{className:"flex-grow-1 text-center",children:s.address})]}),e.jsx("div",{className:"mt-4 px-2",children:e.jsx("button",{onClick:()=>m(!0),type:"button",className:"d-block btn btn-info w-100 text-white",children:"Edit"})})]})]})})}function Y({data:t,isCreditorView:a}){return e.jsx(y,{title:a?"forecast outflows":"forecast inflows",children:e.jsxs("table",{className:"table table-sm table-responsive table-bordered  mb-0",children:[e.jsx("thead",{className:"custom-bg-grey-2 text-white",children:e.jsxs("tr",{children:[e.jsx("th",{children:"0-7 Days"}),e.jsx("th",{children:"8-14 Days"}),e.jsx("th",{children:"15-21 Days"}),e.jsx("th",{children:"21+ Days"}),e.jsx("th",{children:"total"})]})}),e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("td",{children:t.zeroToSevenDays}),e.jsx("td",{children:t.eightToFourteenDays}),e.jsx("td",{children:t.fourteenToTwentyOneDays}),e.jsx("td",{children:t.twentyOnePlusDays}),e.jsxs("td",{children:["$",t.total]})]})})]})})}function B(t,a,n){const[s,c]=x.useState(t),[u,m]=x.useState(""),[i,o]=x.useState(!1),[r,h]=x.useState("note");function p(b){b.preventDefault(),o(!0),m("");const l=Object.fromEntries(new FormData(b.target).entries());n?l.creditor_id=String(a):l.client_id=String(a),l.reminder_type=r.toUpperCase(),r==="note"&&(l.action_date=new Date().toISOString().split("T")[0]),v.post(reverseUrl("communication_history"),l).then(d=>{c(j=>[...j,{text:d.data.message,actionDone:d.data.action_done,user:d.data.user_name,communicationType:d.data.reminder_type.toLowerCase(),timestamp:d.data.created_at}]),m(""),o(!1)}).catch(d=>{m(_(d)),o(!1)}),b.target.reset()}return{messages:s,handleSubmit:p,error:u,setError:m,isLoading:i,remainderType:r,setRemainderType:h}}function Z({disabled:t,lease:a,messages:n,clientId:s,isCreditorView:c,creditorId:u}){const{error:m,messages:i,isLoading:o,remainderType:r,setRemainderType:h,handleSubmit:p,setError:b}=B(n,s,c);return e.jsxs(e.Fragment,{children:[e.jsx(L,{isOpen:r==="works",close:()=>h("note"),lease:a,creditorId:u}),e.jsx(y,{noBoundary:!0,title:"communication history",children:e.jsxs("div",{className:"custom-bg-whitesmoke px-5 py-3",children:[e.jsxs("div",{className:"custom-vh-50 custom-overflow-y-auto",children:[i.map((l,d)=>e.jsxs("div",{className:"custom-message py-2 px-3 border shadow-sm mb-3",children:[e.jsx("small",{children:l.text+(l.communicationType.toLowerCase().trim()!=="note"&&l.actionDone?` (action date: ${S(l.actionDone)})`:"")}),e.jsxs("div",{className:"mt-2 d-flex justify-content-end align-items-center text-end gap-2",children:[e.jsx("small",{className:"smallest",children:e.jsxs("b",{children:[l.user,l.communicationType&&" | "+l.communicationType.toLowerCase()]})}),e.jsx("small",{className:"text-success smallest",children:S(l.timestamp)})]})]},d)),i.length===0&&e.jsxs("small",{className:"h-100 text-grey d-flex justify-content-center align-items-center text-center",children:["No communication ",e.jsx("br",{})," history"]})]}),e.jsxs("form",{onSubmit:p,className:"border-top border-4 w-100 pt-3",children:[m&&e.jsxs("p",{className:"d-flex align-items-start gap-1 small text-danger",children:[e.jsx("button",{type:"button",onClick:()=>b(""),className:"btn-close btn-sm"}),w.truncate(m,{length:150})]}),e.jsx("textarea",{rows:2,name:"message",id:"message",placeholder:"Type message here...",className:"d-block w-100 p-2 custom-form-control border-0 border-bottom border-bottom-3 border-dark",required:!0,disabled:o}),e.jsxs("div",{className:"d-flex justify-content-center pt-2 gap-2 align-items-center",children:[e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"reminder_type",disabled:o,value:"note",id:"reminder_type-note",checked:r==="note",onChange:l=>h(l.target.value)}),e.jsx("label",{className:"form-check-label",htmlFor:"reminder_type-note",children:"Note"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"reminder_type",disabled:o,value:"sms",id:"reminder_type-sms",checked:r==="sms",onChange:l=>h(l.target.value)}),e.jsx("label",{className:"form-check-label",htmlFor:"reminder_type-sms",children:"SMS"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"reminder_type",disabled:o,value:"email",id:"reminder_type-email",checked:r==="email",onChange:l=>h(l.target.value)}),e.jsx("label",{className:"form-check-label",htmlFor:"reminder_type-email",children:"Email"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"reminder_type",disabled:o,value:"reminder",id:"reminder_type-reminder",checked:r==="reminder",onChange:l=>h(l.target.value)}),e.jsx("label",{className:"form-check-label",htmlFor:"reminder_type-reminder",children:"Reminder"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"reminder_type",disabled:o,value:"works",id:"reminder_type-works",checked:r==="works",onChange:l=>h(l.target.value)}),e.jsx("label",{className:"form-check-label",htmlFor:"reminder_type-works",children:"Works"})]})]}),r!=="note"&&r!=="works"&&e.jsxs("div",{className:"d-flex my-2 gap-2 align-items-center justify-content-center",children:[e.jsx("label",{htmlFor:"action_date",className:"small d-block text-nowrap form-label",children:`${r==="reminder"?"Show":"Send"} ${r} on:`}),e.jsx("input",{min:new Date().toISOString().split("T")[0],type:"date",className:"form-control form-control-sm rounded-4",name:"action_date",id:"action_date",required:!0})]}),e.jsx("button",{disabled:o||t,type:"submit",className:"d-block btn btn-info w-100 mt-4 text-white",children:o?"Submiting...":"Submit"})]})]})})]})}function q(t,a,n,s,c,u){const[m,i]=x.useState(t),[o,r]=x.useState(""),[h,p]=x.useState(!1),[b,l]=x.useState([]);function d(){p(!0),r("");const N={plans:b.map(g=>E(k(k({},g),s?{creditor_id:a.toString()}:{client_id:a.toString()}),{spoke_with:s?c:g.spoke_with,lease_id:u}))};v.post(reverseUrl("payment_plans"),N).then(g=>{l([]),r(""),p(!1),n()}).catch(g=>{r(_(g)),l([]),p(!1)})}function j(N){l(g=>[...g,N])}function f(){l([])}return{paymentPlans:m,newPaymentPlans:b,addNewPaymentPlan:j,confirmNewPaymentPlans:d,clearNewPaymentPlans:f,error:o,setError:r,isLoading:h}}function R({addNewPaymentPlan:t,isCreditorView:a}){const[n,s]=x.useState("");function c(m){let i=m.target.value;if(i.includes(".")){const[o,r]=i.split(".");r.length>2&&(i=`${o}.${r.substring(0,2)}`)}s(i)}function u(m){m.preventDefault();const i=Object.fromEntries(new FormData(m.target).entries());t(i)}return e.jsx(y,{title:"payment plans",children:e.jsxs("form",{onSubmit:u,className:"p-3",children:[!a&&e.jsxs("div",{className:"d-flex justify-content-between align-items-center gap-5 mb-2",children:[e.jsx("label",{htmlFor:"spoke_with",className:"text-nowrap",children:"Person spoken with:"}),e.jsx("input",{type:"text",name:"spoke_with",id:"spoke_with",placeholder:"Person spoken with here",className:"custom-form-control border-0 border-bottom border-bottom-3 border-dark",required:!0})]}),e.jsxs("div",{className:"d-flex justify-content-between align-items-center gap-5 mb-2",children:[e.jsx("label",{htmlFor:"expected_pay_date",className:"text-nowrap",children:"Expected Pay Date:"}),e.jsx("input",{type:"date",name:"expected_pay_date",id:"expected_pay_date",className:"custom-form-control border-0 custom-pointer border-bottom border-bottom-3 border-dark",required:!0,defaultValue:new Date().toISOString().split("T")[0],min:new Date().toISOString().split("T")[0]})]}),e.jsxs("div",{className:"d-flex justify-content-between align-items-center gap-5 mb-2",children:[e.jsx("label",{htmlFor:"amount",className:"text-nowrap",children:"Amount ($):"}),e.jsx("input",{min:0,type:"number",step:"0.01",name:"amount",id:"amount",value:n,onChange:c,placeholder:"Amount in $",className:"custom-form-control border-0 border-bottom border-bottom-3 border-dark",required:!0})]}),e.jsx("button",{type:"submit",className:"d-block btn btn-info w-100 mt-4 text-white",children:"Add to payment plan"})]})})}function V({paymentPlans:t,isCreditorView:a}){return e.jsx(y,{title:a?"active payment plans":"payment plans",children:e.jsx("div",{className:"custom-mx-h-15 overflow-auto",children:e.jsxs("table",{className:"table table-sm table-responsive table-bordered mb-0",children:[e.jsx("thead",{className:"custom-bg-grey-2 text-white",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Plan ID"}),e.jsx("th",{children:"Amount"}),e.jsx("th",{children:"Date"})]})}),e.jsxs("tbody",{children:[t.map((n,s)=>e.jsxs("tr",{children:[e.jsx("td",{children:n.id||s}),e.jsx("td",{children:n.amount}),e.jsx("td",{children:F(n.date)})]},n.id)),t.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"3",className:"text-center small text-grey py-3",children:"No payment plans"})})]})]})})})}function W({newPaymentPlans:t,confirmNewPaymentPlans:a,clearNewPaymentPlans:n,error:s,setError:c,isLoading:u,isCreditorView:m}){return e.jsx(y,{title:"plan details",children:e.jsxs("div",{className:"p-3 pb-2",children:[e.jsxs("div",{className:"custom-h-07 overflow-auto",children:[t.map((i,o)=>e.jsx("div",{className:"p-1 small border-bottom",children:`${i.spoke_with||""} promised to pay USD${i.amount} on ${F(i.expected_pay_date)}`},o)),t.length===0&&e.jsx("div",{className:"text-center small text-grey py-3",children:"No new payment plans"})]}),e.jsxs("div",{className:"pt-2 bg-white",children:[s&&e.jsxs("p",{className:"d-flex align-items-start gap-1 small text-danger",children:[e.jsx("button",{type:"button",onClick:()=>c(""),className:"btn-close btn-sm"}),w.truncate(s,{length:150})]}),e.jsxs("div",{className:"d-flex gap-3",children:[e.jsx("button",{type:"button",onClick:a,className:"d-block btn btn-info w-100 text-white",disabled:u||!t.length,children:u?"Saving...":"Save plan"}),e.jsx("button",{type:"button",onClick:n,className:"d-block btn btn-dark w-100 text-white",disabled:u||!t.length,children:"Clear All"})]})]})]})})}function ee({isCreditorView:t,paymentPlans:a,clientId:n,refreshClientViewData:s,creditorName:c,leaseId:u}){const{paymentPlans:m,newPaymentPlans:i,addNewPaymentPlan:o,confirmNewPaymentPlans:r,clearNewPaymentPlans:h,error:p,setError:b,isLoading:l}=q(a,n,s,t,c,u);return e.jsxs(e.Fragment,{children:[e.jsx(R,{isCreditorView:t,addNewPaymentPlan:o,clientId:n}),e.jsx(W,{isCreditorView:t,newPaymentPlans:i,confirmNewPaymentPlans:r,clearNewPaymentPlans:h,error:p,setError:b,isLoading:l}),e.jsx(V,{isCreditorView:t,paymentPlans:m})]})}export{K as A,X as C,Q as D,Y as F,ee as P,Z as a};
