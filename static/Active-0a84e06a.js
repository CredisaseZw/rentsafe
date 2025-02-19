var J=Object.defineProperty,Q=Object.defineProperties;var X=Object.getOwnPropertyDescriptors;var _=Object.getOwnPropertySymbols;var ee=Object.prototype.hasOwnProperty,se=Object.prototype.propertyIsEnumerable;var Z=(l,s,d)=>s in l?J(l,s,{enumerable:!0,configurable:!0,writable:!0,value:d}):l[s]=d,c=(l,s)=>{for(var d in s||(s={}))ee.call(s,d)&&Z(l,d,s[d]);if(_)for(var d of _(s))se.call(s,d)&&Z(l,d,s[d]);return l},p=(l,s)=>Q(l,X(s));import{u as te,j as e,r as n,a as O,b as C,H as re}from"./main-3086900a.js";import{_ as y,I as ie}from"./index-b20093bf.js";import{P as ne}from"./PageHeader-60291f18.js";import{S as w}from"./search-9f30240a.js";import{f}from"./formatting-345d2430.js";import"./lodash-f6a6d579.js";function le(){const{subscriptions:l,activeSubscriptions:s}=te().props;return e.jsxs("div",{className:"card card-raised mb-5",children:[e.jsx("div",{className:"card-header px-4 bg-info",style:{height:"50px"},children:e.jsx("div",{className:"d-flex justify-content-center align-items-center",children:e.jsx("div",{className:"",children:e.jsxs("h2",{className:"display-6 text-white",children:["Active Subscriptions ",s]})})})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderTop:"0px",fontSize:"12px"},children:[e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Trans No."}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Subscriber Name"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Product"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Sub Class"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Sub Period"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"No. of Subs"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Start Date"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"End Date"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Months Remaining"}),e.jsx("th",{scope:"col",className:"tf-borderRight"})]})}),e.jsx("tbody",{children:l==null?void 0:l.map(({id:d,subscriptionName:m,product:P,subClass:u,period:D,number_of_subscriptions:o,startDate:L,endDate:x,monthsRemains:T},U)=>e.jsxs("tr",{style:{fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:d}),e.jsx("td",{children:m}),e.jsx("td",{children:P}),e.jsx("td",{children:u}),e.jsx("td",{children:D}),e.jsx("td",{children:o}),e.jsx("td",{children:L}),e.jsx("td",{children:x}),e.jsx("td",{children:T}),e.jsx("td",{className:"bg-success text-white text-center tfRow",onClick:()=>window.location.href=`view-subscriptions/${d}/`,children:"View"})]},U+d))})]})})})]})}function ae({setIsAdding:l}){const[s,d]=n.useState(""),[m,P]=n.useState(),[u,D]=n.useState(),[o,L]=n.useState(),[x,T]=n.useState(""),[U,E]=n.useState(""),[W,S]=n.useState(""),[j,I]=n.useState(""),[H,M]=n.useState(""),[G,F]=n.useState(""),[B,K]=n.useState(""),[z,k]=n.useState(""),[V,q]=n.useState(""),[A,v]=n.useState(!1),Y=t=>{t.preventDefault(),v(!0),r.subscriberName=String(G),r.subscriberRegNo=String(B),r.monthlyPrice=r.currency==="USD"?r.monthlyPrice.toString():r.monthlyPriceZWL.toString(),i.subscriberName=String(z),i.subscriberRegNo=String(V),i.monthlyPrice=i.currency==="USD"?i.monthlyPrice.toString():i.monthlyPriceZWL.toString();let a;if(r.subscriberName!==""&&i.subscriberName!=="")a=[c({},r),c({},i)];else if(r.subscriberName!==""&&i.subscriberName==="")a=[c({},r)];else if(r.subscriberName===""&&i.subscriberName!=="")a=[c({},i)];else{y.error("All fields are required",{id:"create-sub"}),l(!0),v(!1);return}C.post(reverseUrl("active_subcription"),a).then(h=>{if(h.data.status===400){d(h.data.errors[0]),y.error("Can't create subscriptions. Please try again",{id:"create-sub"}),l(!0);return}$(),y.success("Subscription created successfully",{id:"create-sub"}),l(!1),v(!1)}).catch(h=>{y.error(h.message,{id:"create-sub"}),d(h),v(!1),l(!0)})},b=t=>N(p(c({},r),{[t.target.id]:t.target.value})),g=t=>R(p(c({},i),{[t.target.id]:t.target.value})),{data:r,setData:N,post:de,reset:$}=O({subscriberName:"",subscriberRegNo:"",product:"",subClass:"",subPeriod:"",numberOfSubs:"",startDate:"",currency:"USD",monthlyPrice:"",monthlyPriceZWL:"",subsAmount:"",paymentMethod:""}),{data:i,setData:R}=O({subscriberName:"",subscriberRegNo:"",product:"",subClass:"",subPeriod:"",numberOfSubs:"",startDate:"",currency:"USD",monthlyPrice:"",monthlyPriceZWL:"",subsAmount:"",paymentMethod:""});return n.useEffect(()=>{Promise.all([C.post(reverseUrl("get_services")),C.post(reverseUrl("get_sub_period")),C.post(reverseUrl("subs_monthly_pricing"))]).then(t=>{P(t[0].data.services),D(t[1].data.sub_periods),L(t[2].data)})},[]),n.useEffect(()=>{if(r.subClass&&(r.subClass==="individual"&&N(t=>p(c({},t),{monthlyPrice:o.individual_monthly_price,monthlyPriceZWL:o.individual_zwl_monthly_price})),r.subClass==="company"&&N(t=>p(c({},t),{monthlyPrice:o.company_monthly_price,monthlyPriceZWL:o.company_zwl_monthly_price}))),i.subClass&&(i.subClass==="individual"&&R(t=>p(c({},t),{monthlyPrice:o.individual_monthly_price,monthlyPriceZWL:o.individual_zwl_monthly_price})),i.subClass==="company"&&R(t=>p(c({},t),{monthlyPrice:o.company_monthly_price,monthlyPriceZWL:o.company_zwl_monthly_price}))),r.numberOfSubs&&r.subPeriod){const t=u.find(a=>a.id===Number(r.subPeriod)).period_length;N(a=>p(c({},a),{subsAmount:r.currency==="USD"?(Math.round(Number(r.numberOfSubs)*Number(t)*Number(r.monthlyPrice)*100)/100).toString():(Math.round(Number(r.numberOfSubs)*Number(t)*Number(r.monthlyPriceZWL)*100)/100).toString()}))}if(i.numberOfSubs&&i.subPeriod){const t=u.find(a=>a.id===Number(i.subPeriod)).period_length;R(a=>p(c({},a),{subsAmount:i.currency==="USD"?(Math.round(Number(i.numberOfSubs)*Number(t)*Number(i.monthlyPrice)*100)/100).toString():(Math.round(Number(i.numberOfSubs)*Number(t)*Number(i.monthlyPriceZWL)*100)/100).toString()}))}},[r.subClass,r.subPeriod,r.numberOfSubs,r.monthlyPrice,r.monthlyPriceZWL,r.currency,o,i.subClass,i.subPeriod,i.numberOfSubs,i.monthlyPrice,i.monthlyPriceZWL,i.currency,o]),n.useEffect(()=>{x==="company"&&S(reverseUrl("get_searched_companies")),x==="individual"&&S(reverseUrl("get_searched_individuals"))},[x]),n.useEffect(()=>{j==="company"&&S(reverseUrl("get_searched_companies")),j==="individual"&&S(reverseUrl("get_searched_individuals"))},[j]),A&&y.loading("Creating subscription ...",{id:"create-sub"}),e.jsxs("div",{className:"card card-raised mb-5",style:{height:"60vh",width:"105%",marginInline:"-25px"},children:[e.jsx("div",{className:"p-1 bg-info",children:e.jsx("h5",{className:"text-white text-center",children:"Subscription Origination"})}),e.jsx("div",{className:"card-body p-4 ",style:{height:"60vh"},children:e.jsxs("div",{className:"table-responsive ",style:{overflowY:"visible",height:"100%"},children:[e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderTop:"0px",fontSize:"12px"},children:[e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Sub No."}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Client Type"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Subscriber Name"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Product"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Sub Class"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Sub Period"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"No. of Subs"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Start Date"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Currency"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Monthly Price"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Subs Amount"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Payment Method"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("th",{scope:"row",className:"tf-borderRight tf-borderLeft",children:"1"}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:e.jsxs("select",{onChange:t=>T(t.target.value),className:"form-select form-select-sm tf-borderRight tf-input",name:"subscriberType",value:x,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"individual",children:"I"}),e.jsx("option",{value:"company",children:"C"})]})}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",position:"relative"},children:[e.jsx(w,{value:U,setValue:E,url:W,placeholder:"Start typing",delay:300,type:x,setClientId:F,setRegNumber:K}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.subscriberName})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{onChange:b,className:"form-select form-select-sm tf-borderRight tf-input",name:"product",id:"product",value:r.product,children:[e.jsx("option",{value:"",children:"Select"}),m==null?void 0:m.map(({id:t,service_name:a})=>e.jsx("option",{value:t,children:a},t))]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.product})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{onChange:b,className:"form-select form-select-sm tf-borderRight tf-input",name:"subClass",id:"subClass",value:r.subClass,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"individual",children:"I"},1),e.jsx("option",{value:"company",children:"C"},2)]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.subClass})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{onChange:b,className:"form-select form-select-sm tf-borderRight tf-input",name:"subPeriod",id:"subPeriod",value:r.subPeriod,children:[e.jsx("option",{value:"",children:"Select"}),u==null?void 0:u.map(({id:t,name:a,code:h})=>e.jsxs("option",{value:t,children:[a,"(",h,")"]},h+a+t))]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.subPeriod})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsx("input",{value:r.numberOfSubs,onChange:b,type:"number",name:"numberOfSubs",id:"numberOfSubs",className:"form-control form-control-sm tf-borderRight tf-input"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.numberOfSubs})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsx("input",{value:r.startDate,onChange:b,type:"date",name:"startDate",id:"startDate",className:"form-control form-control-sm tf-borderRight tf-input"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.startDate})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{onChange:b,className:"form-select form-select-sm tf-borderRight tf-input",name:"currency",id:"currency",value:r.currency,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"USD",children:"USD"},1),e.jsx("option",{value:"ZWG",children:"ZWG"},2)]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.currency})]}),e.jsxs("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:[r.currency==="USD"?f(r.monthlyPrice):f(r.monthlyPriceZWL),s&&e.jsx("div",{className:"text-danger mt-1",children:s.monthlyPrice})]}),e.jsxs("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:[f(r.subsAmount),s&&e.jsx("div",{className:"text-danger mt-1",children:s.subsAmount})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{onChange:b,className:"form-select form-select-sm tf-borderRight tf-input",name:"paymentMethod",id:"paymentMethod",value:r.paymentMethod,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"CASH USD",children:"CASH USD"},1),e.jsx("option",{value:"SWIPE USD",children:"SWIPE USD"},2),e.jsx("option",{value:"SWIPE ZWG",children:"SWIPE ZWG"},3),e.jsx("option",{value:"BANK TRF USD",children:"BANK TRF USD"},4),e.jsx("option",{value:"BANK TRF ZWG",children:"BANK TRF ZWG"},4),e.jsx("option",{value:"ECOCASH USD",children:"ECOCASH USD"},4),e.jsx("option",{value:"ECOCASH ZWG",children:"ECOCASH ZWG"},4)]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.paymentMethod})]})]}),e.jsxs("tr",{children:[e.jsx("th",{scope:"row",className:"tf-borderRight tf-borderLeft",children:"2"}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:e.jsxs("select",{onChange:t=>I(t.target.value),className:"form-select form-select-sm tf-borderRight tf-input",name:"subscriberType",value:j,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"individual",children:"I"}),e.jsx("option",{value:"company",children:"C"})]})}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",position:"relative"},children:[e.jsx(w,{value:H,setValue:M,url:W,placeholder:"Start typing",delay:300,type:j,setClientId:k,setRegNumber:q}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.subscriberName2})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{onChange:g,className:"form-select form-select-sm tf-borderRight tf-input",name:"product",id:"product",value:i.product,children:[e.jsx("option",{value:"",children:"Select"}),m==null?void 0:m.map(({id:t,service_name:a})=>e.jsx("option",{value:t,children:a},t))]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.product})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{onChange:g,className:"form-select form-select-sm tf-borderRight tf-input",name:"subClass",id:"subClass",value:i.subClass,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"individual",children:"I"},1),e.jsx("option",{value:"company",children:"C"},2)]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.subClass})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{onChange:g,className:"form-select form-select-sm tf-borderRight tf-input",name:"subPeriod",id:"subPeriod",value:i.subPeriod,children:[e.jsx("option",{value:"",children:"Select"}),u==null?void 0:u.map(({id:t,name:a,code:h})=>e.jsxs("option",{value:t,children:[a,"(",h,")"]},h+a+t))]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.subPeriod})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsx("input",{value:i.numberOfSubs,onChange:g,type:"number",name:"numberOfSubs",id:"numberOfSubs",className:"form-control form-control-sm tf-borderRight tf-input"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.numberOfSubs})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsx("input",{value:i.startDate,onChange:g,type:"date",name:"startDate",id:"startDate",className:"form-control form-control-sm tf-borderRight tf-input"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.startDate})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{onChange:g,className:"form-select form-select-sm tf-borderRight tf-input",name:"currency",id:"currency",value:i.currency,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"USD",children:"USD"},1),e.jsx("option",{value:"ZWG",children:"ZWG"},2)]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.currency})]}),e.jsxs("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:[i.currency==="USD"?f(i.monthlyPrice):f(i.monthlyPriceZWL),s&&e.jsx("div",{className:"text-danger mt-1",children:s.monthlyPrice})]}),e.jsxs("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:[f(i.subsAmount),s&&e.jsx("div",{className:"text-danger mt-1",children:s.subsAmount})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{onChange:g,className:"form-select form-select-sm tf-borderRight tf-input",name:"paymentMethod",id:"paymentMethod",value:i.paymentMethod,children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"CASH USD",children:"CASH USD"},1),e.jsx("option",{value:"SWIPE USD",children:"SWIPE USD"},2),e.jsx("option",{value:"SWIPE ZWG",children:"SWIPE ZWG"},3),e.jsx("option",{value:"BANK TRF USD",children:"BANK TRF USD"},4),e.jsx("option",{value:"BANK TRF ZWG",children:"BANK TRF ZWG"},4),e.jsx("option",{value:"ECOCASH USD",children:"ECOCASH USD"},4),e.jsx("option",{value:"ECOCASH ZWG",children:"ECOCASH ZWG"},4)]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.paymentMethod})]})]})]})]}),e.jsx("div",{className:"d-flex flex-row-reverse",children:e.jsx("button",{className:"btn btn-raised text-white",style:{backgroundColor:"#0d475c"},onClick:Y,children:A?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Submit"]})})})]})})]})}function be(){n.useState(""),n.useState(!1),n.useState(!1),n.useState(!1),n.useState({});const[l,s]=n.useState(!1),d=()=>{s(!l)};return e.jsxs("main",{children:[e.jsx(re,{title:"Active Subscriptions"}),e.jsx(ne,{title:"Active Subscriptions"}),e.jsx(ie,{position:"top-center",duration:"4000"}),e.jsxs("div",{className:"p-5",children:[e.jsx("div",{className:"d-flex flex-row-reverse",children:l?"":e.jsxs("button",{className:"btn btn-raised text-white",style:{backgroundColor:"#0d475c"},onClick:d,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Subscription"]})}),l?e.jsx(ae,{setIsAdding:s}):e.jsx(le,{})]})]})}export{be as default};
