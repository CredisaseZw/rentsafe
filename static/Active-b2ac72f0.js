var H=Object.defineProperty,R=Object.defineProperties;var I=Object.getOwnPropertyDescriptors;var T=Object.getOwnPropertySymbols;var M=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var O=(s,r,t)=>r in s?H(s,r,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[r]=t,f=(s,r)=>{for(var t in r||(r={}))M.call(r,t)&&O(s,t,r[t]);if(T)for(var t of T(r))L.call(r,t)&&O(s,t,r[t]);return s},g=(s,r)=>R(s,I(r));import{u as q,j as e,a as F,r as c,b as P,_ as v,H as G,I as k}from"./main-cca8b9b1.js";import{P as z}from"./PageHeader-4c547ec5.js";import{S as B}from"./search-2a1f244d.js";import{u as W}from"./index-28b47ae7.js";import{f as U}from"./formatting-9de8c923.js";import{M as D}from"./Modal-33be9e73.js";import"./lodash-50a00b21.js";import"./removeClass-0482583f.js";import"./index-e7483ee4.js";function K(){const{subscriptions:s,activeSubscriptions:r}=q().props;return e.jsxs("div",{className:"card card-raised mb-5",children:[e.jsx("div",{className:"card-header px-4 bg-info",style:{height:"50px"},children:e.jsx("div",{className:"d-flex justify-content-center align-items-center",children:e.jsx("div",{className:"",children:e.jsxs("h2",{className:"display-6 text-white",children:["Active Subscriptions ",r]})})})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderTop:"0px",fontSize:"12px"},children:[e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Trans No."}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Subscriber Name"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Product"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Sub Class"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Sub Period"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"No. of Subs"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Start Date"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"End Date"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Months Remaining"}),e.jsx("th",{scope:"col",className:"tf-borderRight"})]})}),e.jsx("tbody",{children:s==null?void 0:s.map(({id:t,subscriptionName:b,product:u,subClass:o,period:h,number_of_subscriptions:m,startDate:p,endDate:a,monthsRemains:j},l)=>e.jsxs("tr",{style:{fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:t}),e.jsx("td",{children:b}),e.jsx("td",{children:u}),e.jsx("td",{children:o}),e.jsx("td",{children:h}),e.jsx("td",{children:m}),e.jsx("td",{children:p}),e.jsx("td",{children:a}),e.jsx("td",{children:j}),e.jsx("td",{className:"bg-success text-white text-center tfRow",onClick:()=>window.location.href=`view-subscriptions/${t}/`,children:"View"})]},l+t))})]})})})]})}function V(){const{data:s,setData:r,reset:t}=F({subscriberName:"",subscriberRegNo:"",product:"",subPeriod:"",numberOfSubs:"",startDate:"",currency:"USD",monthlyPrice:"",monthlyPriceZWL:"",subsAmount:"",paymentMethod:""}),[b,u]=c.useState(""),[o,h]=c.useState(),[m,p]=c.useState(),[a,j]=c.useState("individual"),[l,C]=c.useState(""),[_,d]=c.useState(""),[x,S]=c.useState(""),[N,y]=c.useState(!1);function w(){if(y(!0),s.subscriberName=String(a==="individual"?x:_),s.subscriberRegNo=String(x),s.monthlyPrice=s.currency==="USD"?s.monthlyPrice.toString():s.monthlyPriceZWL.toString(),s.subscriberName===""){v.error("Subscriber Name is required",{id:"create-sub"}),y(!1);return}console.log([s]),P.post(reverseUrl("active_subcription"),[s]).then(i=>{if(console.log(i),i.data.status===400){u(i.data.errors[0]),v.error(W(i),{id:"create-sub"}),y(!1);return}t(),v.success("Subscription created successfully",{id:"create-sub"}),y(!1)}).catch(i=>{var n;console.log(i),v.error(W(((n=i==null?void 0:i.data)==null?void 0:n.errors)||i),{id:"create-sub"}),u(i),y(!1)})}function E(i){r(g(f({},s),{[i.target.id]:i.target.value}))}c.useEffect(()=>{Promise.all([P.post(reverseUrl("get_services")),P.post(reverseUrl("get_sub_period")),P.post(reverseUrl("subs_monthly_pricing"))]).then(i=>{console.log(i[2].data),h(i[0].data.services),p(i[1].data.sub_periods);let n=i[2].data;r(A=>g(f({},A),{monthlyPrice:(n==null?void 0:n.individual_monthly_price)||(n==null?void 0:n.company_monthly_price)||A.monthlyPrice,monthlyPriceZWL:(n==null?void 0:n.individual_zwl_monthly_price)||(n==null?void 0:n.company_zwl_monthly_price)||A.monthlyPrice}))})},[]),c.useEffect(()=>{if(s.numberOfSubs&&s.subPeriod){const i=m.find(n=>n.id===Number(s.subPeriod)).period_length;r(n=>g(f({},n),{subsAmount:s.currency==="USD"?(Math.round(Number(s.numberOfSubs)*Number(i)*Number(s.monthlyPrice)*100)/100).toString():(Math.round(Number(s.numberOfSubs)*Number(i)*Number(s.monthlyPriceZWL)*100)/100).toString()}))}},[s.subPeriod,s.numberOfSubs,s.monthlyPrice,s.monthlyPriceZWL,s.currency]);const Z=a==="company"?reverseUrl("get_searched_companies"):a==="individual"?reverseUrl("get_searched_individuals"):"";return N&&v.loading("Creating subscription ...",{id:"create-sub"}),{data:s,errors:b,services:o,isLoading:N,searchUrl:Z,sub_periods:m,subscriberType:a,subscriberName:l,setClientId:d,setRegNumber:S,changeHandler:E,handleSubmit:w,setSubscriberType:j,setSubscriberName:C}}function $(){const{data:s,errors:r,services:t,isLoading:b,searchUrl:u,sub_periods:o,subscriberType:h,subscriberName:m,setClientId:p,handleSubmit:a,setRegNumber:j,changeHandler:l,setSubscriberName:C,setSubscriberType:_}=V();return e.jsxs("div",{children:[e.jsx("h5",{className:"p-2 m-0 bg-info text-white text-center",children:"Subscription Origination"}),e.jsxs("table",{className:"table table-responsive table-sm table-bordered bg-white",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Client Type"}),e.jsx("th",{children:"Subscriber Name"}),e.jsx("th",{children:"Product"}),e.jsx("th",{children:"Sub Period"}),e.jsx("th",{children:"No. of Subs"}),e.jsx("th",{children:"Start Date"}),e.jsx("th",{children:"Currency"}),e.jsx("th",{children:"Monthly Price"}),e.jsx("th",{children:"Subs Amount"}),e.jsx("th",{children:"Payment Method"})]})}),e.jsx("tbody",{children:e.jsxs("tr",{children:[e.jsx("td",{children:e.jsxs("select",{onChange:d=>_(d.target.value),className:"form-select form-select-sm",name:"subscriberType",value:h,required:!0,children:[e.jsx("option",{value:"individual",children:"I"}),e.jsx("option",{value:"company",children:"C"})]})}),e.jsxs("td",{className:"position-relative",children:[e.jsx(B,{value:m,setValue:C,url:u,placeholder:"Start typing",delay:300,type:h,setClientId:p,setRegNumber:j}),r&&e.jsx("div",{className:"text-danger mt-1",children:r.subscriberName})]}),e.jsxs("td",{children:[e.jsxs("select",{onChange:l,required:!0,className:"form-select form-select-sm",name:"product",id:"product",value:s.product,children:[e.jsx("option",{disabled:!0,value:"",children:"Select"}),t==null?void 0:t.map(({id:d,service_name:x},S)=>e.jsx("option",{value:d,children:x},S))]}),r&&e.jsx("div",{className:"text-danger mt-1",children:r.product})]}),e.jsxs("td",{children:[e.jsxs("select",{onChange:l,className:"form-select form-select-sm",required:!0,name:"subPeriod",id:"subPeriod",value:s.subPeriod,children:[e.jsx("option",{disabled:!0,value:"",children:"Select"}),o==null?void 0:o.map(({id:d,name:x,code:S},N)=>e.jsxs("option",{value:d,children:[x,"(",S,")"]},N))]}),r&&e.jsx("div",{className:"text-danger mt-1",children:r.subPeriod})]}),e.jsxs("td",{children:[e.jsx("input",{value:s.numberOfSubs,required:!0,onChange:l,type:"number",name:"numberOfSubs",id:"numberOfSubs",className:"form-control form-control-sm"}),r&&e.jsx("div",{className:"text-danger mt-1",children:r.numberOfSubs})]}),e.jsxs("td",{children:[e.jsx("input",{value:s.startDate,onChange:l,required:!0,type:"date",name:"startDate",id:"startDate",className:"form-control form-control-sm"}),r&&e.jsx("div",{className:"text-danger mt-1",children:r.startDate})]}),e.jsxs("td",{children:[e.jsxs("select",{onChange:l,className:"form-select form-select-sm",name:"currency",required:!0,id:"currency",value:s.currency,children:[e.jsx("option",{disabled:!0,value:"",children:"Select"}),e.jsx("option",{value:"USD",children:"USD"}),e.jsx("option",{value:"ZWG",children:"ZWG"})]}),r&&e.jsx("div",{className:"text-danger mt-1",children:r.currency})]}),e.jsxs("td",{children:[s.currency==="USD"?U(s.monthlyPrice):U(s.monthlyPriceZWL),r&&e.jsx("div",{className:"text-danger mt-1",children:r.monthlyPrice})]}),e.jsxs("td",{children:[U(s.subsAmount),r&&e.jsx("div",{className:"text-danger mt-1",children:r.subsAmount})]}),e.jsxs("td",{children:[e.jsxs("select",{onChange:l,className:"form-select form-select-sm",required:!0,name:"paymentMethod",id:"paymentMethod",value:s.paymentMethod,children:[e.jsx("option",{disabled:!0,value:"",children:"Select"}),e.jsx("option",{value:"CASH USD",children:"CASH USD"}),e.jsx("option",{value:"SWIPE USD",children:"SWIPE USD"}),e.jsx("option",{value:"SWIPE ZWG",children:"SWIPE ZWG"}),e.jsx("option",{value:"BANK TRF USD",children:"BANK TRF USD"}),e.jsx("option",{value:"BANK TRF ZWG",children:"BANK TRF ZWG"}),e.jsx("option",{value:"ECOCASH USD",children:"ECOCASH USD"}),e.jsx("option",{value:"ECOCASH ZWG",children:"ECOCASH ZWG"})]}),r&&e.jsx("div",{className:"text-danger mt-1",children:r.paymentMethod})]})]})})]}),e.jsx("div",{className:"text-end",children:e.jsx("button",{type:"button",className:"btn btn-primary",onClick:a,children:b?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"processing.."})]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Submit"]})})})]})}function ce(){const[s,r]=c.useState(!1);return e.jsxs("main",{children:[e.jsx(G,{title:"Active Subscriptions"}),e.jsx(z,{title:"Active Subscriptions"}),e.jsx(k,{position:"top-right",toastOptions:{duration:5e3}}),s&&e.jsxs(D,{show:s,onHide:()=>r(!1),size:"xl",backdrop:"static",centered:!0,children:[e.jsx(D.Header,{className:"p-0",children:e.jsx("div",{className:"w-100 p-3 text-end",children:e.jsx("button",{type:"button",onClick:()=>r(!1),className:"btn btn-danger btn-sm",children:e.jsx("i",{className:"material-icons fs-3",children:"close"})})})}),e.jsx(D.Body,{children:e.jsx("div",{className:"py-5",children:e.jsx($,{})})})]}),e.jsxs("div",{className:"p-4",children:[e.jsx("div",{className:"text-end",children:e.jsxs("button",{className:"btn btn-primary",onClick:()=>r(t=>!t),children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Subscription"]})}),e.jsx(K,{})]})]})}export{ce as default};
