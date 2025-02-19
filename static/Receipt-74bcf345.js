var B=Object.defineProperty,I=Object.defineProperties;var O=Object.getOwnPropertyDescriptors;var C=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,P=Object.prototype.propertyIsEnumerable;var R=(l,c,t)=>c in l?B(l,c,{enumerable:!0,configurable:!0,writable:!0,value:t}):l[c]=t,m=(l,c)=>{for(var t in c||(c={}))k.call(c,t)&&R(l,t,c[t]);if(C)for(var t of C(c))P.call(c,t)&&R(l,t,c[t]);return l},p=(l,c)=>I(l,O(c));import{a as V,j as e}from"./main-f6268bb9.js";import{_ as N,I as F}from"./index-36b3b83d.js";import{a as q}from"./Layout-5cbe84c1.js";import{l as E}from"./lodash-46cae31d.js";import{M as A}from"./Modal-dfcee4b7.js";function H(l,c,t){const{data:h,setData:b,post:y,reset:f,processing:_}=V({myKey:l,rows:t&&t.owing_amount?[m({id:1,lease_id:t.lease_id,paymentDate:new Date().toISOString().split("T")[0],tenant:t.name,receiptNumber:"",details:"",currency:t.currency,rent_owing:Number(t.owing_amount)||0,color:t.color,paymentAmount:0,accountBalance:t.owing_amount,opening_balance_date:t.opening_balance_date,isVariable:t.rent_variable},t.rent_variable?{baseAmount:0,commission:0,operatingCost:0}:{})]:S});function v(n){n.preventDefault(),y(reverseUrl("create_receipt_and_payment"),{onBefore:()=>console.log(h),onSuccess:o=>{var i,a;console.log(o),((i=o.props)==null?void 0:i.result)==="error"?N.error((a=o.props)==null?void 0:a.result):c("Receipts created successfully").then(f)},onError:o=>{console.log(o),N.error("Something went wrong! Please try again: "+JSON.stringify(E.truncate(o,15)))}})}function x(){const n=p(m({},S[0]),{id:h.rows.length+1});b(o=>p(m({},o),{rows:[...o.rows,n]}))}function w(n){b(o=>p(m({},o),{rows:o.rows.filter((i,a)=>a!==n)}))}return{data:h,processing:_,addRow:x,removeRow:w,handleSubmit:v,handleInputChange:(n,o)=>{const{name:i,value:a}=n.target;if(i==="paymentDate"){const d=new Date(a),r=new Date(h.opening_balance_date),g=new Date(new Date().toISOString().split("T")[0]);if(d<r){N.error("You are attempting to post a payment/adjustment made before your opening balance date. Received amounts are already factored into the opening balance. If you need to make an adjustment, use the Accounting Adjustment menu option.");return}if(d>g){N.error("You are attempting to post a payment/adjustment made before your opening balance date. Received amounts are already factored into the opening balance. If you need to make an adjustment, use the Accounting Adjustment menu option.");return}}b(d=>p(m({},d),{rows:d.rows.map((r,g)=>g===o?p(m({},r),{[i]:a,accountBalance:i==="paymentAmount"?Number(r.rent_owing)-Number(a):r.accountBalance}):r)}))},handleTenantSelect:(n,o)=>{n&&b(i=>p(m({},i),{rows:i.rows.map((a,d)=>d===o?m(p(m({},a),{tenant:n.tenant,lease_id:n.lease_id,currency:n.Currency,opening_balance_date:n.opening_balance_date,rent_owing:n.rent_owing,accountBalance:n.rent_owing-(a.paymentAmount||0),color:n.color,isVariable:n.is_variable}),n.is_variable?{baseAmount:0,commission:0,operatingCost:0}:{}):a)}))},handlePaymentAmount:(n,o)=>{let{name:i,value:a}=n.target;a=Number(a),b(d=>p(m({},d),{rows:d.rows.map((r,g)=>g===o?p(m({},r),{[i]:a,paymentAmount:i==="baseAmount"?r.operatingCost+r.commission+a:i==="operatingCost"?r.baseAmount+r.commission+a:i==="commission"?r.baseAmount+r.operatingCost+a:a,accountBalance:Number(r.rent_owing)-(Number(r.paymentAmount)+a)}):r)}))}}}const S=[{id:1,paymentDate:new Date().toISOString().split("T")[0],tenant:"",receiptNumber:"",details:"",currency:"",rent_owing:0,color:"",paymentAmount:0,accountBalance:0,opening_balance_date:"",isVariable:!1}];function D({myKey:l,show:c,handleClose:t,leaseDetails:h}){const{data:b,processing:y,addRow:f,removeRow:_,handleSubmit:v,handleInputChange:x,handleTenantSelect:w,handlePaymentAmount:j}=H(l,t,h);return e.jsxs(e.Fragment,{children:[e.jsx(F,{position:"top-right",duration:"4000"}),e.jsxs(A,{show:c,onHide:t,size:"xl",backdrop:"static",centered:!0,children:[e.jsx(A.Header,{children:e.jsxs("div",{className:"w-100 p-4 position-relative",children:[e.jsx("h4",{className:"text-center",children:"Rent Receipt"}),e.jsx("button",{type:"button",onClick:()=>t(),className:"btn btn-danger btn-sm position-absolute end-0 top-0 m-3",children:e.jsx("i",{className:"material-icons",children:"close"})})]})}),e.jsx(A.Body,{children:e.jsxs("form",{onSubmit:v,children:[e.jsxs("table",{className:"table table-responsive table-bordered table-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-nowrap"}),e.jsx("th",{className:"text-nowrap",children:"Date"}),e.jsx("th",{className:"text-nowrap",children:"Customer"}),e.jsx("th",{className:"text-nowrap",children:"Receipt No."}),e.jsx("th",{className:"text-nowrap",children:"Details"}),e.jsx("th",{className:"text-nowrap",children:"Currency"}),e.jsx("th",{className:"text-nowrap",children:"Amount Owing"}),e.jsx("th",{className:"text-nowrap",children:"Received Amount"}),e.jsx("th",{className:"text-nowrap",children:"Amount Balance"})]})}),e.jsx("tbody",{children:b.rows.map((s,u)=>e.jsxs("tr",{children:[e.jsx("td",{className:"px-1 py-0 border-end-0",children:b.rows.length>1&&e.jsx("button",{className:"btn btn-close btn-sm mt-3",onClick:()=>_(u)})}),e.jsx("td",{children:e.jsx("input",{className:"form-control custom-w-fit",type:"date",name:"paymentDate",value:s.paymentDate,onChange:n=>x(n,u),required:!0})}),e.jsx("td",{className:"custom-w-2",children:e.jsx(q,{extraProps:{className:"w-100",required:!0},url:reverseUrl("get_all_active_leases"),onChange:n=>w(n,u),value:s.tenant?{label:s.tenant,value:s.lease_id}:null,defaultValue:null,isDisabled:!1})}),e.jsx("td",{children:e.jsx("input",{onChange:n=>x(n,u),value:s.receiptNumber,className:"form-control",name:"receiptNumber",placeholder:"...",id:"receiptNumber"})}),e.jsx("td",{className:"custom-w-170",children:e.jsx("input",{placeholder:"...",className:"form-control",id:"details",name:"details",value:s.details,onChange:n=>x(n,u)})}),e.jsx("td",{className:"text-center",children:e.jsx("div",{className:"mt-2",children:s.currency||""})}),e.jsx("td",{className:`bg-${s.color||""} text-white text-center d-block rounded border border-white border-3`,children:e.jsx("div",{className:"mt-2",children:s.rent_owing})}),e.jsxs("td",{children:[e.jsx("input",{placeholder:"0.00",required:!0,type:"number",name:"paymentAmount",min:0,value:s.paymentAmount,onChange:n=>x(n,u),className:s.isVariable?"form-control border-2 custom-no-pointer-events":"form-control",readOnly:s.isVariable}),s.isVariable&&e.jsxs("div",{className:"mt-1",children:[e.jsxs("div",{className:"mb-1",children:[e.jsx("label",{className:"small form-label",children:"Base rent"}),e.jsx("input",{name:"baseAmount",type:"number",className:"form-control form-control-sm",min:0,value:s.baseAmount,onChange:n=>j(n,u)})]}),e.jsxs("div",{className:"mb-1",children:[e.jsx("label",{className:"small form-label",children:"Commission"}),e.jsx("input",{name:"commission",type:"number",className:"form-control form-control-sm",min:0,value:s.commission,onChange:n=>j(n,u)})]}),e.jsxs("div",{className:"mb-1",children:[e.jsx("label",{className:"small form-label",children:"OPC"}),e.jsx("input",{name:"operatingCost",type:"number",className:"form-control form-control-sm",min:0,value:s.operatingCost,onChange:n=>j(n,u)})]})]})]}),e.jsx("td",{children:e.jsx("input",{name:"accountBalance",value:Number((Number(s.rent_owing)-Number(s.paymentAmount)).toFixed(2)),readOnly:!0,className:"form-control custom-no-pointer-events"})})]},s.id))})]}),e.jsx("div",{className:"text-end",children:e.jsxs("button",{type:"button",className:"btn btn-success",onClick:f,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Receipts"]})}),e.jsx("div",{className:"p-4 text-center",children:e.jsx("button",{type:"submit",className:"btn btn-info text-white gap-2",children:y?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{children:"Processing.."})]}):"Submit"})})]})})]})]})}export{D as R};
