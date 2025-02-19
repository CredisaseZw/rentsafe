var C=Object.defineProperty,A=Object.defineProperties;var T=Object.getOwnPropertyDescriptors;var D=Object.getOwnPropertySymbols;var $=Object.prototype.hasOwnProperty,O=Object.prototype.propertyIsEnumerable;var P=(t,a,n)=>a in t?C(t,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[a]=n,k=(t,a)=>{for(var n in a||(a={}))$.call(a,n)&&P(t,n,a[n]);if(D)for(var n of D(a))O.call(a,n)&&P(t,n,a[n]);return t},E=(t,a)=>A(t,T(a));import{j as e,r as b,u as I,b as v}from"./main-bff74084.js";import{l as w}from"./lodash-2de872b6.js";import{u as _,d as S,f as F}from"./index-d9499e15.js";import{W as L}from"./Layout-42393a21.js";function y({title:t,children:a,noBoundary:n,noOuterStyles:o}){const s=o?"":n?"bg-white mb-3":"bg-white rounded-2 border overflow-hidden border-dark shadow-sm mb-3";return e.jsxs("div",{className:s,children:[e.jsx("div",{className:"rounded-top-2 custom-bg-grey text-white text-center p-1",children:w.capitalize(t)}),a]})}function Q({data:t,isCreditorView:a}){let n=0;return Object.keys(t).forEach(o=>n+=t[o]),e.jsx(y,{title:a?"ageing":"aged analysis",children:e.jsxs("table",{className:"table table-sm table-responsive table-bordered  mb-0",children:[e.jsx("thead",{className:"custom-bg-grey-2 text-white",children:e.jsxs("tr",{children:[e.jsx("th",{children:"90+ Days"}),e.jsx("th",{children:"90 Days"}),e.jsx("th",{children:"60 Days"}),e.jsx("th",{children:"30 Days"}),e.jsx("th",{children:"Current"}),e.jsx("th",{children:"total"})]})}),e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("td",{children:t.oneTwentyDays}),e.jsx("td",{children:t.ninetyDays}),e.jsx("td",{children:t.sixtyDays}),e.jsx("td",{children:t.thirtyDays}),e.jsx("td",{children:t.current}),e.jsxs("td",{children:["$",n]})]})})]})})}function M(t,a,n){const[o,s]=b.useState(!t),[h,c]=b.useState(t),[m,i]=b.useState(""),[l,d]=b.useState(!1),{Auth:p}=I().props,j=`${p.user_profile.first_name} ${p.user_profile.last_name}`;function r(u){u.preventDefault(),d(!0),i("");const x=Object.fromEntries(new FormData(u.target).entries());n?x.creditor_id=a.toString():x.client_id=a.toString(),v.put(reverseUrl("debtor_intelligence"),x).then(f=>{const N={text:f.data.note,user:f.data.user_name,timestamp:f.data.updated_at||f.data.created_at};c(N),i(""),d(!1),s(!1)}).catch(f=>{i(_(f)),d(!1),s(!h)})}return{data:h,isEditMode:o,handleSave:r,loggedInUser:j,setIsEditMode:s,error:m,setError:i,isLoading:l}}function X({data:t,clientId:a,isCreditorView:n}){const{data:o,isEditMode:s,handleSave:h,loggedInUser:c,setIsEditMode:m,error:i,setError:l,isLoading:d}=M(t,a,n);return e.jsx(y,{title:n?"creditor intelligence":"customer intelligence",children:e.jsxs("div",{className:"px-3 py-2",children:[i&&e.jsxs("p",{className:"d-flex align-items-start gap-1 small text-danger",children:[e.jsx("button",{type:"button",onClick:()=>l(""),className:"btn-close btn-sm"}),w.truncate(i,{length:150})]}),s?e.jsxs("form",{onSubmit:h,children:[e.jsxs("div",{className:"mb-2",children:[e.jsx("label",{htmlFor:"note",className:"form-label",children:o&&o.text?"Edit note":"No note found, create new note"}),e.jsx("textarea",{className:"form-control",name:"note",id:"note",rows:"2",defaultValue:o&&o.text?o.text:"",placeholder:"type here...",disabled:d})]}),e.jsx("b",{className:"d-block my-1",children:c}),e.jsx("div",{className:"small text-success",children:"today"}),e.jsx("button",{disabled:d,type:"submit",className:"d-block btn btn-info text-white w-100 mt-3",children:d?"Saving...":"Save"})]}):e.jsxs("div",{children:[e.jsx("small",{children:o.text}),e.jsx("b",{className:"d-block my-1",children:o.user}),e.jsx("div",{className:"small text-success",children:S(o.timestamp)}),e.jsx("button",{onClick:()=>m(!0),type:"button",className:"d-block btn btn-info w-100 mt-4 text-white",children:"Edit"})]})]})})}function U(t,a,n,o){const[s,h]=b.useState(!t),[c,m]=b.useState(t),[i,l]=b.useState(""),[d,p]=b.useState(!1);function j(r){r.preventDefault(),p(!0),l("");const u=Object.fromEntries(new FormData(r.target).entries());n?u.creditor_id=a.toString():(u.client_id=a.toString(),u.lease_id=o),u.other_numbers=u.other_numbers.split(",").filter(Boolean).map(x=>x.trim()),console.log(u),v.put(reverseUrl("update_client_contact_details"),u).then(x=>{const f={contactPerson:`${x.data.firstname} ${x.data.surname}`,smsNumber:x.data.sms_number,otherNumbers:x.data.other_numbers?x.data.other_numbers.join(", "):"",emailAddress:x.data.email_address,address:x.data.address};console.log({res:x,newData:f}),m(f),l(""),p(!1),h(!1)}).catch(x=>{l(_(x)),p(!1),h(!c)})}return{data:c,isEditMode:s,handleSave:j,setIsEditMode:h,error:i,setError:l,isLoading:d}}function Y({data:t,clientId:a,isCreditorView:n,leaseId:o}){const{data:s,isEditMode:h,handleSave:c,setIsEditMode:m,error:i,setError:l,isLoading:d}=U(t,a,n,o);return console.log(s),e.jsx(y,{title:"contact details",children:e.jsxs("div",{className:"py-2",children:[i&&e.jsxs("p",{className:"d-flex align-items-start px-2 gap-1 small text-danger",children:[e.jsx("button",{type:"button",onClick:()=>l(""),className:"btn-close btn-sm"}),w.truncate(i,{length:150})]}),h?e.jsxs("form",{onSubmit:c,children:[e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("label",{htmlFor:"firstname",className:"form-label small",children:"First Name"}),e.jsx("input",{type:"text",className:"form-control form-control-sm w-50 rounded-2",name:"firstname",id:"firstname",disabled:d,defaultValue:s&&s.contactPerson?s.contactPerson.trim().split(" ")[0]:""})]}),e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom",children:[e.jsx("label",{htmlFor:"surname",className:"form-label small",children:"Surname"}),e.jsx("input",{type:"text",className:"form-control form-control-sm w-50 rounded-2",name:"surname",id:"surname",disabled:d,defaultValue:s&&s.contactPerson?s.contactPerson.trim().split(" ")[1]:""})]}),e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("label",{htmlFor:"sms_number",className:"form-label small",children:"SMS Number"}),e.jsx("input",{type:"text",className:"form-control form-control-sm w-50 rounded-2",name:"sms_number",id:"sms_number",disabled:d,defaultValue:s&&s.smsNumber?s.smsNumber:""})]}),e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom",children:[e.jsx("label",{htmlFor:"other_numbers",className:"form-label small",children:"Other Numbers"}),e.jsx("input",{type:"text",className:"form-control form-control-sm w-50 rounded-2",name:"other_numbers",id:"other_numbers",disabled:d,defaultValue:s&&s.other_numbers?s.other_numbers:""})]}),e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("label",{htmlFor:"email_address",className:"form-label small",children:"Email Address"}),e.jsx("input",{type:"email",className:"form-control form-control-sm w-50 rounded-2",name:"email_address",id:"email_address",disabled:d,defaultValue:s&&s.emailAddress?s.emailAddress:""})]}),e.jsxs("div",{className:"d-flex gap-2 justify-content-between align-items-center py-1 px-2 border-bottom",children:[e.jsx("label",{htmlFor:"address",className:"form-label small",children:"Address"}),e.jsx("input",{type:"text",className:"form-control form-control-sm w-50 rounded-2",name:"address",id:"address",disabled:d,defaultValue:s&&s.address?s.address:""})]}),e.jsx("button",{disabled:d,type:"submit",className:"d-block btn btn-info text-white w-100 mt-3",children:d?"Saving...":"Save"})]}):e.jsxs("div",{children:[e.jsxs("div",{className:"d-flex gap-2 py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("div",{children:"Contact Person: "}),e.jsx("div",{className:"flex-grow-1 text-center",children:s.contactPerson})]}),e.jsxs("div",{className:"d-flex gap-2 py-1 px-2 border-bottom",children:[e.jsx("div",{children:"SMS Number: "}),e.jsx("div",{className:"flex-grow-1 text-center",children:s.smsNumber})]}),e.jsxs("div",{className:"d-flex gap-2 py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("div",{children:"Other Numbers: "}),e.jsx("div",{className:"flex-grow-1 text-center",children:s.otherNumbers})]}),e.jsxs("div",{className:"d-flex gap-2 py-1 px-2 border-bottom",children:[e.jsx("div",{children:"Email Address: "}),e.jsx("div",{className:"flex-grow-1 text-center",children:s.emailAddress})]}),e.jsxs("div",{className:"d-flex gap-2 py-1 px-2 border-bottom custom-bg-whitesmoke",children:[e.jsx("div",{children:"Address: "}),e.jsx("div",{className:"flex-grow-1 text-center",children:s.address})]}),e.jsx("div",{className:"mt-4 px-2",children:e.jsx("button",{onClick:()=>m(!0),type:"button",className:"d-block btn btn-info w-100 text-white",children:"Edit"})})]})]})})}function Z({data:t,isCreditorView:a}){return e.jsx(y,{title:a?"forecast outflows":"forecast inflows",children:e.jsxs("table",{className:"table table-sm table-responsive table-bordered  mb-0",children:[e.jsx("thead",{className:"custom-bg-grey-2 text-white",children:e.jsxs("tr",{children:[e.jsx("th",{children:"0-7 Days"}),e.jsx("th",{children:"8-14 Days"}),e.jsx("th",{children:"15-21 Days"}),e.jsx("th",{children:"21+ Days"}),e.jsx("th",{children:"total"})]})}),e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("td",{children:t.zeroToSevenDays}),e.jsx("td",{children:t.eightToFourteenDays}),e.jsx("td",{children:t.fourteenToTwentyOneDays}),e.jsx("td",{children:t.twentyOnePlusDays}),e.jsxs("td",{children:["$",t.total]})]})})]})})}function B(t,a,n){const[o,s]=b.useState(t),[h,c]=b.useState(""),[m,i]=b.useState(!1),[l,d]=b.useState("note");function p(j){j.preventDefault(),i(!0),c("");const r=Object.fromEntries(new FormData(j.target).entries());n?r.creditor_id=String(a):r.client_id=String(a),r.reminder_type=l.toUpperCase(),l==="note"&&(r.action_date=new Date().toISOString().split("T")[0]),v.post(reverseUrl("communication_history"),r).then(u=>{s(x=>[...x,{text:u.data.message,actionDone:u.data.action_done,user:u.data.user_name,communicationType:u.data.reminder_type.toLowerCase(),timestamp:u.data.created_at}]),c(""),i(!1)}).catch(u=>{c(_(u)),i(!1)}),j.target.reset()}return{messages:o,handleSubmit:p,error:h,setError:c,isLoading:m,remainderType:l,setRemainderType:d}}function ee({disabled:t,lease:a,messages:n,clientId:o,isCreditorView:s,creditorId:h}){const{error:c,messages:m,isLoading:i,remainderType:l,setRemainderType:d,handleSubmit:p,setError:j}=B(n,o,s);return e.jsxs(e.Fragment,{children:[e.jsx(L,{isOpen:l==="works",close:()=>d("note"),lease:a,creditorId:h}),e.jsx(y,{noBoundary:!0,title:"communication history",children:e.jsxs("div",{className:"custom-bg-whitesmoke px-5 py-3",children:[e.jsxs("div",{className:"custom-vh-50 custom-overflow-y-auto",children:[m.map((r,u)=>e.jsxs("div",{className:"custom-message py-2 px-3 border shadow-sm mb-3",children:[e.jsx("small",{children:r.text+(r.communicationType.toLowerCase().trim()!=="note"&&r.actionDone?` (action date: ${S(r.actionDone)})`:"")}),e.jsxs("div",{className:"mt-2 d-flex justify-content-end align-items-center text-end gap-2",children:[e.jsx("small",{className:"smallest",children:e.jsxs("b",{children:[r.user,r.communicationType&&" | "+r.communicationType.toLowerCase()]})}),e.jsx("small",{className:"text-success smallest",children:S(r.timestamp)})]})]},u)),m.length===0&&e.jsxs("small",{className:"h-100 text-grey d-flex justify-content-center align-items-center text-center",children:["No communication ",e.jsx("br",{})," history"]})]}),e.jsxs("form",{onSubmit:p,className:"border-top border-4 w-100 pt-3",children:[c&&e.jsxs("p",{className:"d-flex align-items-start gap-1 small text-danger",children:[e.jsx("button",{type:"button",onClick:()=>j(""),className:"btn-close btn-sm"}),w.truncate(c,{length:150})]}),e.jsx("textarea",{rows:2,name:"message",id:"message",placeholder:"Type message here...",className:"d-block w-100 p-2 custom-form-control border-0 border-bottom border-bottom-3 border-dark",required:!0,disabled:i}),e.jsxs("div",{className:"d-flex justify-content-center pt-2 gap-2 align-items-center",children:[e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"reminder_type",disabled:i,value:"note",id:"reminder_type-note",checked:l==="note",onChange:r=>d(r.target.value)}),e.jsx("label",{className:"form-check-label",htmlFor:"reminder_type-note",children:"Note"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"reminder_type",disabled:i,value:"sms",id:"reminder_type-sms",checked:l==="sms",onChange:r=>d(r.target.value)}),e.jsx("label",{className:"form-check-label",htmlFor:"reminder_type-sms",children:"SMS"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"reminder_type",disabled:i,value:"email",id:"reminder_type-email",checked:l==="email",onChange:r=>d(r.target.value)}),e.jsx("label",{className:"form-check-label",htmlFor:"reminder_type-email",children:"Email"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"reminder_type",disabled:i,value:"reminder",id:"reminder_type-reminder",checked:l==="reminder",onChange:r=>d(r.target.value)}),e.jsx("label",{className:"form-check-label",htmlFor:"reminder_type-reminder",children:"Reminder"})]}),e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"reminder_type",disabled:i,value:"works",id:"reminder_type-works",checked:l==="works",onChange:r=>d(r.target.value)}),e.jsx("label",{className:"form-check-label",htmlFor:"reminder_type-works",children:"Works"})]})]}),l!=="note"&&l!=="works"&&e.jsxs("div",{className:"d-flex my-2 gap-2 align-items-center justify-content-center",children:[e.jsx("label",{htmlFor:"action_date",className:"small d-block text-nowrap form-label",children:`${l==="reminder"?"Show":"Send"} ${l} on:`}),e.jsx("input",{min:new Date().toISOString().split("T")[0],type:"date",className:"form-control form-control-sm rounded-4",name:"action_date",id:"action_date",required:!0})]}),e.jsx("button",{disabled:i||t,type:"submit",className:"d-block btn btn-info w-100 mt-4 text-white",children:i?"Submiting...":"Submit"})]})]})})]})}function q(t,a,n,o,s,h){const[c,m]=b.useState(t),[i,l]=b.useState(""),[d,p]=b.useState(!1),[j,r]=b.useState([]);function u(){p(!0),l("");const N={plans:j.map(g=>E(k(k({},g),o?{creditor_id:a.toString()}:{client_id:a.toString()}),{spoke_with:o?s:g.spoke_with,lease_id:h}))};v.post(reverseUrl("payment_plans"),N).then(g=>{r([]),l(""),p(!1),n()}).catch(g=>{l(_(g)),r([]),p(!1)})}function x(N){r(g=>[...g,N])}function f(){r([])}return{paymentPlans:c,newPaymentPlans:j,addNewPaymentPlan:x,confirmNewPaymentPlans:u,clearNewPaymentPlans:f,error:i,setError:l,isLoading:d}}function R({addNewPaymentPlan:t,isCreditorView:a}){const[n,o]=b.useState("");function s(c){let m=c.target.value;if(m.includes(".")){const[i,l]=m.split(".");l.length>2&&(m=`${i}.${l.substring(0,2)}`)}o(m)}function h(c){c.preventDefault();const m=Object.fromEntries(new FormData(c.target).entries());t(m)}return e.jsx(y,{title:"payment plans",children:e.jsxs("form",{onSubmit:h,className:"p-3",children:[!a&&e.jsxs("div",{className:"d-flex justify-content-between align-items-center gap-5 mb-2",children:[e.jsx("label",{htmlFor:"spoke_with",className:"text-nowrap",children:"Person spoken with:"}),e.jsx("input",{type:"text",name:"spoke_with",id:"spoke_with",placeholder:"Person spoken with here",className:"custom-form-control border-0 border-bottom border-bottom-3 border-dark",required:!0})]}),e.jsxs("div",{className:"d-flex justify-content-between align-items-center gap-5 mb-2",children:[e.jsx("label",{htmlFor:"expected_pay_date",className:"text-nowrap",children:"Expected Pay Date:"}),e.jsx("input",{type:"date",name:"expected_pay_date",id:"expected_pay_date",className:"custom-form-control border-0 custom-pointer border-bottom border-bottom-3 border-dark",required:!0,defaultValue:new Date().toISOString().split("T")[0],min:new Date().toISOString().split("T")[0]})]}),e.jsxs("div",{className:"d-flex justify-content-between align-items-center gap-5 mb-2",children:[e.jsx("label",{htmlFor:"amount",className:"text-nowrap",children:"Amount ($):"}),e.jsx("input",{min:0,type:"number",step:"0.01",name:"amount",id:"amount",value:n,onChange:s,placeholder:"Amount in $",className:"custom-form-control border-0 border-bottom border-bottom-3 border-dark",required:!0})]}),e.jsx("button",{type:"submit",className:"d-block btn btn-info w-100 mt-4 text-white",children:"Add to payment plan"})]})})}function V({paymentPlans:t,isCreditorView:a}){return e.jsx(y,{title:a?"active payment plans":"payment plans",children:e.jsx("div",{className:"custom-mx-h-15 overflow-auto",children:e.jsxs("table",{className:"table table-sm table-responsive table-bordered mb-0",children:[e.jsx("thead",{className:"custom-bg-grey-2 text-white",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Plan ID"}),e.jsx("th",{children:"Amount"}),e.jsx("th",{children:"Date"})]})}),e.jsxs("tbody",{children:[t.map((n,o)=>e.jsxs("tr",{children:[e.jsx("td",{children:n.id||o}),e.jsx("td",{children:n.amount}),e.jsx("td",{children:F(n.date)})]},n.id)),t.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:"3",className:"text-center small text-grey py-3",children:"No payment plans"})})]})]})})})}function W({newPaymentPlans:t,confirmNewPaymentPlans:a,clearNewPaymentPlans:n,error:o,setError:s,isLoading:h,isCreditorView:c}){return e.jsx(y,{title:"plan details",children:e.jsxs("div",{className:"p-3 pb-2",children:[e.jsxs("div",{className:"custom-h-07 overflow-auto",children:[t.map((m,i)=>e.jsx("div",{className:"p-1 small border-bottom",children:`${m.spoke_with||""} promised to pay USD${m.amount} on ${F(m.expected_pay_date)}`},i)),t.length===0&&e.jsx("div",{className:"text-center small text-grey py-3",children:"No new payment plans"})]}),e.jsxs("div",{className:"pt-2 bg-white",children:[o&&e.jsxs("p",{className:"d-flex align-items-start gap-1 small text-danger",children:[e.jsx("button",{type:"button",onClick:()=>s(""),className:"btn-close btn-sm"}),w.truncate(o,{length:150})]}),e.jsxs("div",{className:"d-flex gap-3",children:[e.jsx("button",{type:"button",onClick:a,className:"d-block btn btn-info w-100 text-white",disabled:h||!t.length,children:h?"Saving...":"Save plan"}),e.jsx("button",{type:"button",onClick:n,className:"d-block btn btn-dark w-100 text-white",disabled:h||!t.length,children:"Clear All"})]})]})]})})}function te({isCreditorView:t,paymentPlans:a,clientId:n,refreshClientViewData:o,creditorName:s,leaseId:h}){const{paymentPlans:c,newPaymentPlans:m,addNewPaymentPlan:i,confirmNewPaymentPlans:l,clearNewPaymentPlans:d,error:p,setError:j,isLoading:r}=q(a,n,o,t,s,h);return e.jsxs(e.Fragment,{children:[e.jsx(R,{isCreditorView:t,addNewPaymentPlan:i,clientId:n}),e.jsx(W,{isCreditorView:t,newPaymentPlans:m,confirmNewPaymentPlans:l,clearNewPaymentPlans:d,error:p,setError:j,isLoading:r}),e.jsx(V,{isCreditorView:t,paymentPlans:c})]})}export{Q as A,Y as C,X as D,Z as F,te as P,ee as a};
