var Q=Object.defineProperty,X=Object.defineProperties;var W=Object.getOwnPropertyDescriptors;var Y=Object.getOwnPropertySymbols;var ee=Object.prototype.hasOwnProperty,te=Object.prototype.propertyIsEnumerable;var J=(t,n,a)=>n in t?Q(t,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[n]=a,A=(t,n)=>{for(var a in n||(n={}))ee.call(n,a)&&J(t,a,n[a]);if(Y)for(var a of Y(n))te.call(n,a)&&J(t,a,n[a]);return t},B=(t,n)=>X(t,W(n));import{r as m,u as G,b as E,d as Z,_ as L,j as e}from"./main-a6dda5c9.js";import{u as U,f as M}from"./index-cdca6ff0.js";import{S as H}from"./SearchBar-1e49d7e8.js";import{b as se,C as K,L as ne}from"./Layout-b4321159.js";import"./formatting-9de8c923.js";import"./lodash-d3c3e9f3.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-6ad84934.js";import"./Modal-c2655e25.js";import"./index-e760cfb2.js";import"./MultipleUpload-0f1cec23.js";import"./search-2b7e2b99.js";function le(){const[t,n]=m.useState([]),[a,l]=m.useState(!1),{url:o}=G();function x(){l(!0),E.get("/accounting/proforma-invoices/").then(d=>{console.log(d),n(d.data)}).catch(d=>{console.log(d)}).finally(()=>l(!1))}m.useEffect(()=>{x()},[o]);function N(d){d.preventDefault();const y=d.target.year.value,b=d.target.month.value,h=new URL(o);h.searchParams.set("year",y),h.searchParams.set("month",b),Z.Inertia.replace(h.href,{preserveState:!0})}return{loading:a,invoiceList:t,handleFilters:N}}function ae(t,n){const[a,l]=m.useState(null),[o,x]=m.useState(!1),[N,d]=m.useState(!1),[y,b]=m.useState("USD"),[h,T]=m.useState([]),[q,s]=m.useState([]),[P,C]=m.useState(0),[S,_]=m.useState(0),[f,w]=m.useState([{static:!1,sales_code:"",sales_item:"",price:"",qty:"",vat:"",total:""}]);m.useEffect(()=>{if(t){const i={document_number:t.document_number,bill_to:t.bill_to,address:t.address,phone:t.phone,email:t.email,vat_no:t.vat_no,tin:t.tin,currency:t.currency,monthly_rental:t.monthly_rental};l(i),b(i.currency),w([i.monthly_rental])}},[t]),m.useEffect(()=>{D(),R()},[]);function D(){E.get("/accounting/items/").then(i=>{T(i.data)}).catch(i=>{console.log(i)})}function R(){E.get("/accounting/vat-settings/").then(i=>{s(i.data)}).catch(i=>{console.error(i)})}function r(){w([...f,{static:!1,sales_code:"",sales_item:"",price:"",qty:"",vat:"",total:""}])}function c(i){const u=f.filter((k,j)=>j!==i);w(u)}function g(){d(!0)}function O(){d(!1)}function V(i){if(i.preventDefault(),!f.length){L.error("Please add at least one item");return}const u=Object.fromEntries(new FormData(i.target).entries());u.items=f.map(j=>{const v=A({},j);return v.vat=(parseFloat(v.vat)||0)/100*(parseFloat(v.price)||0)*(parseFloat(v.qty)||0),delete v.static,v}),Object.keys(p).forEach(j=>u[j]=p[j]),u.invoiceTotal+=Number(S),u.discount=Number(S),n?console.log("Proforma Invoice Data: ",u):console.log(u);const k=n?"/accounting/proforma-invoices/":"/accounting/invoices/";E.post(k,u).then(j=>{console.log(j),j.status===201?(L.success(U(j)),w([{static:!1,sales_code:"",sales_item:"",price:"",qty:"",vat:"",total:""}]),_(0),C(v=>v+1)):L.error(U(j))}).catch(j=>{console.error(j),L.error(U(j))})}function I(i){w([{sales_code:"",sales_item:"",price:"",qty:"",vat:"",total:""}]),b(i.target.value),C(u=>u+1)}const p=f==null?void 0:f.reduce((i,u)=>{if(!u)return i;const k=parseFloat(u.qty)||0,j=(parseFloat(u.vat)||0)/100,v=parseFloat(u.price)||0;return i.totalExcludingVat+=v*k,i.vatTotal+=v*j*k,i.invoiceTotal+=parseFloat(u.total)||0,i},{totalExcludingVat:0,vatTotal:0,invoiceTotal:0});function F(i){let u=parseFloat(i.target.value)||0;u>0?L.error("Discount should be input as a negative value"):_(u)}return{key:P,show:N,items:f,totals:p,discount:S,currency:y,isLoading:o,salesCodes:h,taxConfigs:q,invoiceData:a,addRow:r,setItems:w,onSubmit:V,removeRow:c,handleShow:g,handleClose:O,setDiscount:_,changeCurrency:I,handleDiscount:F}}function re(){const[t,n]=m.useState("INDIVIDUAL");return e.jsxs("div",{className:"d-flex",children:[e.jsxs("select",{className:"me-1 px-1 border fw-light rounded-2",value:t,name:"customer_type",id:"customer_type",onChange:a=>n(a.target.value),children:[e.jsx("option",{value:"INDIVIDUAL",children:"Individual"}),e.jsx("option",{value:"COMPANY",children:"Company"})]}),e.jsx("div",{className:"custom-w-3",children:e.jsx(se,{extraProps:{placeholder:"Customer Name...",required:!0,id:"customer_id",name:"customer_id",className:"w-100"},defaultValue:null,isDisabled:t==="",useAlternateFetchOptions:{type:t.toLowerCase()}},t)})]})}function ce({item:t,index:n,setItems:a,currency:l,isLoading:o,removeRow:x,salesCodes:N,itemsLength:d,taxConfigs:y}){const[b,h]=m.useState(null),[T,q]=m.useState(null),[s,P]=m.useState(null),[C,S]=m.useState(!1),[_,f]=m.useState(1);function w(r){const c=N.find(p=>p.item_id===r.target.value);if(c.unit_price_currency!==l){S(!0),q(c);return}const g=y.find(p=>p.id===c.tax_configuration),V=((g==null?void 0:g.rate)||0)/100*((c==null?void 0:c.price)||0)*(t.qty||0),I=((c==null?void 0:c.price)||0)*(t.qty||0)+V;a(p=>p.map((F,i)=>i===n?B(A({},F),{sales_code:(c==null?void 0:c.item_id)||"",sales_item:(c==null?void 0:c.name)||"",price:(c==null?void 0:c.price)||"",vat:(g==null?void 0:g.rate)||0,total:I}):F)),h(c),P(g)}function D(){const r=A({},T);r.price=parseFloat(_)*(parseFloat(r.price)||0),r.unit_price_currency=l;const c=y.find(I=>I.id===r.tax_configuration),O=((c==null?void 0:c.rate)||0)/100*((r==null?void 0:r.price)||0)*(t.qty||0),V=((r==null?void 0:r.price)||0)*(t.qty||0)+O;a(I=>I.map((p,F)=>F===n?B(A({},p),{sales_code:(r==null?void 0:r.item_id)||"",sales_item:(r==null?void 0:r.name)||"",price:(r==null?void 0:r.price)||"",vat:(c==null?void 0:c.rate)||0,total:V}):p)),h(r),P(c),q(null),S(!1),f(1)}const R=s!=null&&s.rate?`${((s==null?void 0:s.rate)||0)/100*((b==null?void 0:b.price)||0)*parseFloat(t.qty||0)} (${s.rate}%)`:"";return e.jsxs(e.Fragment,{children:[C&&e.jsx(K,{title:"Currency Mismatch",show:C,handleClose:()=>{S(!1),q(null),f(1)},size:"md",children:e.jsxs("div",{children:[e.jsxs("div",{className:"alert alert-danger",children:["The item you have selected is listed in ",T.unit_price_currency," but your invoice is to be in ",l,", please input below the rate to be used"]}),e.jsxs("div",{className:"d-flex gap-3 align-items-center",children:[e.jsx("label",{className:"form-label text-nowrap px-3",children:`${T.unit_price_currency} to ${l}`}),e.jsx("input",{type:"number",className:"form-control",value:_,onChange:r=>f(r.target.value)})]}),e.jsx("div",{className:"mt-3 text-end",children:e.jsx("button",{onClick:D,type:"button",className:"btn btn-info text-white",children:"Proceed"})})]})}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("button",{disabled:t.static||o||d===1,type:"button",onClick:()=>x(n),className:"btn btn-sm btn-danger p-0",children:e.jsx("i",{className:"material-icons",children:"close"})})}),e.jsx("td",{children:t.static?t.sales_code:e.jsxs("select",{required:!0,disabled:o,value:t.sales_code,onChange:w,className:"form-select form-select-sm custom-w-2",children:[e.jsx("option",{disabled:!0,value:"",children:"Select code.."}),N.map(r=>e.jsx("option",{value:r.item_id,children:`${r.item_id} - ${r.name}`},r.id))]})}),e.jsx("td",{children:e.jsx("div",{className:"text-center custom-mn-w-1 custom-mx-w-2",children:t.sales_item})}),e.jsx("td",{children:e.jsx("div",{className:"text-center text-nowrap custom-mn-w-1",children:` ${t.price||""}`})}),e.jsx("td",{children:t.static?t.qty:e.jsx("input",{type:"number",name:"quantity",id:"quantity",className:"form-control form-control-sm custom-w-1",disabled:o,value:t.qty,required:!0,onChange:r=>a(c=>c.map((g,O)=>{if(O===n){const V=parseFloat(r.target.value)||0,p=(parseFloat(t.price)||0)*V,F=p*t.vat/100;return B(A({},g),{qty:r.target.value,total:p+F})}else return g}))})}),e.jsx("td",{children:e.jsx("div",{className:"text-center text-nowrap custom-mn-w-1",children:R})}),e.jsx("td",{children:e.jsx("div",{className:"text-center text-nowrap custom-mn-w-1",children:t.total})})]})]})}function $({invoice:t,triggerClassname:n,triggerChildren:a,isProforma:l}){const{key:o,show:x,items:N,totals:d,discount:y,currency:b,isLoading:h,salesCodes:T,taxConfigs:q,invoiceData:s,addRow:P,setItems:C,onSubmit:S,removeRow:_,handleShow:f,handleClose:w,changeCurrency:D,handleDiscount:R}=ae(t,l);return e.jsxs(e.Fragment,{children:[e.jsx("button",{className:n||"btn btn-info text-white",onClick:f,children:a||e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"New"]})}),e.jsx(K,{size:"xl",show:x,handleClose:w,title:l?"PROFORMA":"FISCAL TAX INVOICE",children:e.jsxs("form",{className:"py-3",onSubmit:S,children:[e.jsxs("div",{className:"p-4",children:[e.jsxs("div",{className:"row row-cols-2 pb-3 text-nowrap",children:[e.jsxs("div",{className:"col",children:[e.jsxs("div",{className:"mb-3 d-flex gap-4 align-items-center",children:[e.jsx("label",{htmlFor:"document_number",className:"form-label",children:"Document Number:"}),e.jsx("input",{className:"form-control form-control-sm border-0 border-bottom flex-fill border-3 ",required:!0,name:"document_number",id:"document_number",placeholder:"e.g 112108",readOnly:!!(s!=null&&s.document_number),defaultValue:s==null?void 0:s.document_number})]}),e.jsxs("div",{className:"mb-3 d-flex gap-4 align-items-center justify-content-between",children:[e.jsx("label",{htmlFor:"bill_to",className:"form-label",children:"Bill To:"}),s!=null&&s.bill_to?e.jsx("input",{className:"form-control form-control-sm border-0 border-bottom flex-fill border-3 ",name:"customer_id",id:"customer_id",readOnly:!0,value:s==null?void 0:s.bill_to}):e.jsx(re,{})]}),e.jsxs("div",{className:"mb-3 d-flex gap-4 align-items-center",children:[e.jsx("label",{htmlFor:"address",className:"form-label",children:"Address:"}),e.jsx("input",{className:"form-control form-control-sm border-0 border-bottom flex-fill border-3 ",required:!0,name:"address",id:"address",placeholder:"Address...",defaultValue:s==null?void 0:s.address,readOnly:!!(s!=null&&s.address)})]}),e.jsxs("div",{className:"mb-3 d-flex gap-4 align-items-center",children:[e.jsx("label",{htmlFor:"phone",className:"form-label",children:"Phone:"}),e.jsx("input",{className:"form-control form-control-sm border-0 border-bottom flex-fill border-3 ",required:!0,name:"phone",id:"phone",placeholder:"Phone...",defaultValue:s==null?void 0:s.phone,readOnly:!!(s!=null&&s.phone)})]})]}),e.jsxs("div",{className:"col",children:[e.jsxs("div",{className:"mb-3 d-flex gap-4 align-items-center",children:[e.jsx("label",{htmlFor:"email",className:"form-label",children:"Email:"}),e.jsx("input",{className:"form-control form-control-sm border-0 border-bottom flex-fill border-3 ",required:!0,name:"email",id:"email",placeholder:"Email...",defaultValue:s==null?void 0:s.email,readOnly:!!(s!=null&&s.email)})]}),e.jsxs("div",{className:"mb-3 d-flex gap-4 align-items-center",children:[e.jsx("label",{htmlFor:"vat_no",className:"form-label",children:"VAT No.:"}),e.jsx("input",{className:"form-control form-control-sm border-0 border-bottom flex-fill border-3 ",required:!0,name:"vat_no",id:"vat_no",placeholder:"VAT No....",defaultValue:s==null?void 0:s.vat_no,readOnly:!!(s!=null&&s.vat_no)})]}),e.jsxs("div",{className:"mb-3 d-flex gap-4 align-items-center",children:[e.jsx("label",{htmlFor:"tin",className:"form-label",children:"TIN:"}),e.jsx("input",{className:"form-control form-control-sm border-0 border-bottom flex-fill border-3 ",required:!0,name:"tin",id:"tin",placeholder:"TIN...",defaultValue:s==null?void 0:s.tin,readOnly:!!(s!=null&&s.tin)})]}),e.jsxs("div",{className:"mb-3 d-flex gap-4 align-items-center",children:[e.jsx("label",{htmlFor:"date",className:"form-label",children:"Date:"}),e.jsx("input",{className:"form-control form-control-sm border-0 border-bottom flex-fill border-3 ",required:!0,name:"date",defaultValue:new Date().toISOString().split("T")[0],max:new Date().toISOString().split("T")[0],min:new Date(new Date().setDate(1)).toISOString().split("T")[0],id:"date",type:"date",readOnly:!!s})]})]})]}),e.jsxs("table",{className:"table table-sm table-bordered table-responsive",children:[e.jsxs("thead",{className:"text-center text-nowrap",children:[e.jsxs("tr",{children:[e.jsx("th",{}),e.jsx("th",{}),e.jsx("th",{}),e.jsx("th",{colSpan:2,className:"text-danger",children:"Currency"}),e.jsx("th",{colSpan:2,className:"bg-danger text-white",children:e.jsx("div",{children:e.jsx("select",{value:b,name:"invoice_currency",id:"invoice_currency",onChange:D,children:s!=null&&s.currency?e.jsx("option",{value:s.currency,children:s.currency}):e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"USD",children:"United States Dollar (USD)"}),e.jsx("option",{value:"ZIG",children:"Zimbabwean Dollar (ZIG)"})]})})})})]}),e.jsxs("tr",{children:[e.jsx("th",{}),e.jsx("th",{children:"Sales Code"}),e.jsx("th",{children:"Sales Item"}),e.jsx("th",{children:"Price(Inc)"}),e.jsx("th",{children:"QTY"}),e.jsx("th",{children:"VAT"}),e.jsx("th",{children:"Total (Inc)"})]})]}),e.jsx("tbody",{children:N.map((r,c)=>e.jsx(ce,{item:r,index:c,currency:b,setItems:C,removeRow:_,isLoading:h,salesCodes:T,taxConfigs:q,itemsLength:N.length},c+"-"+o))}),e.jsxs("tfoot",{className:"text-end",children:[e.jsxs("tr",{children:[e.jsx("td",{}),e.jsx("td",{colSpan:5,children:e.jsxs("div",{className:"w-100 gap-3 align-items-center d-flex justify-content-between",children:[e.jsxs("button",{disabled:h,type:"button",className:"btn btn-sm btn-outline-info",onClick:P,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Row"]}),"Total (Excluding VAT)"]})}),e.jsx("td",{children:e.jsx("span",{children:d.totalExcludingVat})})]}),e.jsxs("tr",{children:[e.jsx("td",{}),e.jsx("td",{colSpan:5,children:"Discount"}),e.jsx("td",{children:e.jsx("input",{style:{width:"150px"},className:"form-control form-control-sm d-inline-block text-end",type:"number",name:"discount",id:"discount",vlaue:y,max:0,step:.001,onChange:R,readOnly:h})})]}),e.jsxs("tr",{children:[e.jsx("td",{}),e.jsx("td",{colSpan:5,children:"VAT Total"}),e.jsx("td",{children:d.vatTotal})]}),e.jsxs("tr",{children:[e.jsx("td",{}),e.jsxs("td",{colSpan:5,children:["Invoice Total ",b]}),e.jsx("td",{children:d.invoiceTotal+y})]})]})]})]}),e.jsx("div",{className:"text-end",children:e.jsx("button",{disabled:h,className:"btn btn-info text-white",children:h?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"Submitting.."})]}):"Submit"})})]})})]})}function oe(){const{loading:t,invoiceList:n,handleFilters:a}=le();return e.jsxs("div",{children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center gap-4 mb-5",children:[e.jsxs("form",{onSubmit:a,className:"d-flex border  gap-2 align-items-center",children:[e.jsx("select",{className:"form-select",name:"year",id:"year",required:!0,defaultValue:new Date().getFullYear(),children:new Array(new Date().getFullYear()-2020).fill(0).map((l,o)=>e.jsx("option",{value:new Date().getFullYear()-o,children:new Date().getFullYear()-o},o))}),e.jsxs("select",{className:"form-select",name:"month",id:"month",required:!0,defaultValue:(new Date().getMonth()+1).toString(),children:[e.jsx("option",{value:"1",children:"January"}),e.jsx("option",{value:"2",children:"February"}),e.jsx("option",{value:"3",children:"March"}),e.jsx("option",{value:"4",children:"April"}),e.jsx("option",{value:"5",children:"May"}),e.jsx("option",{value:"6",children:"June"}),e.jsx("option",{value:"7",children:"July"}),e.jsx("option",{value:"8",children:"August"}),e.jsx("option",{value:"9",children:"September"}),e.jsx("option",{value:"10",children:"October"}),e.jsx("option",{value:"11",children:"November"}),e.jsx("option",{value:"12",children:"December"})]}),e.jsx("div",{children:e.jsx("button",{type:"submit",className:"btn btn-success ",children:"Submit"})})]}),e.jsx("div",{className:"custom-mx-w-4",children:e.jsx(H,{placeholder:"Search...",searchBy:"invoice"})})]}),e.jsxs("div",{children:[e.jsxs("h5",{className:"position-relative text-center mb-2 p-2 mb-0",children:["Proforma Invoice List",e.jsx("div",{className:"position-absolute top-0 end-0",children:e.jsx($,{isProforma:!0})})]}),e.jsxs("table",{className:"table table-sm table-bordered table-responsive bg-white",children:[e.jsx("thead",{className:"position-sticky c-table-top text-white bg-info shadow-sm c-z-5",children:e.jsxs("tr",{children:[e.jsx("th",{className:"ps-3",children:"Inv. #"}),e.jsx("th",{children:"Date Created"}),e.jsx("th",{children:"Customer"}),e.jsx("th",{children:"Currency"}),e.jsx("th",{className:"text-end",children:"Invoice Total"}),e.jsx("th",{})]})}),e.jsx("tbody",{children:t?e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-3 bg-white d-flex justify-content-center align-items-center",children:e.jsx("div",{className:"spinner-border text-info",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})})})}):n!=null&&n.length?n==null?void 0:n.map((l,o)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:l.id}),e.jsx("td",{className:"ps-3",children:l.date_created&&M(l.date_created)}),e.jsx("td",{className:"ps-3",children:l.customer}),e.jsx("td",{className:"ps-3",children:l.currency}),e.jsx("td",{className:"ps-3 text-end",children:l.total.toFixed(2)}),e.jsx("td",{className:"d-flex justify-content-center align-items-center p-1",children:e.jsx("button",{className:"btn btn-sm w-100 justify-content-center btn-info text-white",children:"View"})})]},o)):e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-2 bg-white d-flex justify-content-center align-items-center",children:"Nothing to show"})})})})]})]})]})}function ie(t){const[n,a]=m.useState(!1),[l,o]=m.useState(t==null?void 0:t.map(x=>({id:x.id,date_created:M(new Date),customer_acc:"",customer:x.tenant_name,document_number:"",bill_to:x.tenant_name,address:x.address,phone:"",email:"",vat_no:"",tin:"",currency:x.lease_currency_type,monthly_rental:{static:!0,sales_code:"",sales_item:`"Rent - ${x.payment_period_start} ${new Date().getMonth()+1}`,price:x.owing_amount,qty:1,vat_id:"",total:x.owing_amount}})));return{loading:n,invoiceList:l}}function de({recurringInvoices:t}){const{loading:n,invoiceList:a}=ie(t);return e.jsx("div",{children:e.jsx("div",{children:e.jsxs("table",{className:"table table-sm table-bordered table-responsive bg-white",children:[e.jsxs("thead",{className:"position-sticky c-table-top shadow-sm c-z-5",children:[e.jsx("tr",{children:e.jsx("th",{colSpan:6,className:"p-0",children:e.jsx("div",{className:" bg-danger text-white text-center p-2",children:"Recurring Invoices"})})}),e.jsxs("tr",{children:[e.jsx("th",{className:"ps-3",children:"Inv. #"}),e.jsx("th",{children:"Invoice Date"}),e.jsx("th",{children:"Customer Acc"}),e.jsx("th",{children:"Customer Name"}),e.jsx("th",{}),e.jsx("th",{})]})]}),e.jsx("tbody",{children:n?e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-2 bg-white d-flex justify-content-center align-items-center",children:e.jsx("div",{className:"spinner-border text-info",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})})})}):a!=null&&a.length?a==null?void 0:a.map((l,o)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:l.id}),e.jsx("td",{className:"ps-3",children:l.date_created&&M(l.date_created)}),e.jsx("td",{className:"ps-3",children:l.customer_acc||""}),e.jsx("td",{className:"ps-3",children:l.customer}),e.jsx("td",{className:"p-0 ",children:e.jsx("div",{className:"d-flex justify-content-center align-items-center p-1",children:e.jsx($,{invoice:l,triggerChildren:"Generate",triggerClassname:"btn btn-sm w-100  justify-content-center btn-danger"})})}),e.jsx("td",{className:"p-0",children:e.jsx("div",{className:"d-flex justify-content-center align-items-center p-1",children:e.jsx("button",{className:"btn btn-sm w-100 justify-content-center btn-dark text-white",children:e.jsx("span",{children:"-"})})})})]},o)):e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-2 bg-white d-flex justify-content-center align-items-center",children:"Nothing to show"})})})})]})})})}function me(){const[t,n]=m.useState([]),[a,l]=m.useState(!1),{url:o}=G();function x(){l(!0),E.get("/accounting/invoices/").then(d=>{console.log(d),n(d.data),l(!1)}).catch(d=>{console.log(d),l(!1)})}m.useEffect(()=>{x()},[o]);function N(d){d.preventDefault();const y=d.target.year.value,b=d.target.month.value,h=new URL(o);h.searchParams.set("year",y),h.searchParams.set("month",b),Z.Inertia.replace(h.href,{preserveState:!0})}return{loading:a,invoiceList:t,handleFilters:N}}function ue(){const{loading:t,invoiceList:n,handleFilters:a}=me();return e.jsxs("div",{children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center gap-4 mb-5",children:[e.jsxs("form",{onSubmit:a,className:"d-flex border  gap-2 align-items-center",children:[e.jsx("select",{className:"form-select",name:"year",id:"year",required:!0,defaultValue:new Date().getFullYear(),children:new Array(new Date().getFullYear()-2020).fill(0).map((l,o)=>e.jsx("option",{value:new Date().getFullYear()-o,children:new Date().getFullYear()-o},o))}),e.jsxs("select",{className:"form-select",name:"month",id:"month",required:!0,defaultValue:(new Date().getMonth()+1).toString(),children:[e.jsx("option",{value:"1",children:"January"}),e.jsx("option",{value:"2",children:"February"}),e.jsx("option",{value:"3",children:"March"}),e.jsx("option",{value:"4",children:"April"}),e.jsx("option",{value:"5",children:"May"}),e.jsx("option",{value:"6",children:"June"}),e.jsx("option",{value:"7",children:"July"}),e.jsx("option",{value:"8",children:"August"}),e.jsx("option",{value:"9",children:"September"}),e.jsx("option",{value:"10",children:"October"}),e.jsx("option",{value:"11",children:"November"}),e.jsx("option",{value:"12",children:"December"})]}),e.jsx("div",{children:e.jsx("button",{type:"submit",className:"btn btn-success ",children:"Submit"})})]}),e.jsx("div",{className:"custom-mx-w-4",children:e.jsx(H,{placeholder:"Search...",searchBy:"invoice"})})]}),e.jsxs("div",{children:[e.jsxs("h5",{className:"position-relative text-center mb-2 p-2 mb-0",children:["Invoice List",e.jsx("div",{className:"position-absolute top-0 end-0",children:e.jsx($,{})})]}),e.jsxs("table",{className:"table table-sm table-bordered table-responsive bg-white",children:[e.jsx("thead",{className:"position-sticky c-table-top text-white bg-info shadow-sm c-z-5",children:e.jsxs("tr",{children:[e.jsx("th",{className:"ps-3",children:"Inv. #"}),e.jsx("th",{children:"Date Created"}),e.jsx("th",{children:"Customer"}),e.jsx("th",{children:"Currency"}),e.jsx("th",{className:"text-end",children:"Invoice Total"}),e.jsx("th",{})]})}),e.jsx("tbody",{children:t?e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-3 bg-white d-flex justify-content-center align-items-center",children:e.jsx("div",{className:"spinner-border text-info",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})})})}):n!=null&&n.length?n==null?void 0:n.map((l,o)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:l.id}),e.jsx("td",{className:"ps-3",children:l.date_created&&M(l.date_created)}),e.jsx("td",{className:"ps-3",children:l.customer}),e.jsx("td",{className:"ps-3",children:l.currency}),e.jsx("td",{className:"ps-3 text-end",children:l.total.toFixed(2)}),e.jsx("td",{className:"d-flex justify-content-center align-items-center p-1",children:e.jsx("button",{className:"btn btn-sm w-100 justify-content-center btn-info text-white",children:"View"})})]},o)):e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-2 bg-white d-flex justify-content-center align-items-center",children:"Nothing to show"})})})})]})]})]})}const z=[{key:"Invoice",Content:ue},{key:"Recurring",Content:de},{key:"Proforma",Content:oe}];function he({invoice_list:t}){const[n,a]=m.useState(z[0]);return e.jsxs("div",{children:[e.jsx("div",{className:"d-flex gap-2 mb-3",children:z.map(l=>e.jsx("button",{onClick:()=>a(l),className:`btn ${n===l?"btn-info text-white":"border border-2"}`,children:l.key},l.key))}),e.jsx("div",{className:"p-3",children:e.jsx(n.Content,A({},n.key==="Recurring"?{recurringInvoices:t}:{}))})]})}he.layout=t=>e.jsx(ne,{children:t,title:"Sales Categories"});export{he as default};
