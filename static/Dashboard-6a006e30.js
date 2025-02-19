import{j as e,u as t,L as c}from"./main-f6e7cc39.js";import{L as p}from"./Layout-421d56b0.js";import{P as b}from"./PageHeader-b33965c3.js";import{C as g,A as v,f as N,e as u,g as y}from"./index-82319fd6.js";import{t as f,f as d}from"./formatting-345d2430.js";import"./index-4b8db17e.js";import"./lodash-488c3413.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-8486d68b.js";import"./Modal-299f7286.js";import"./index-abb5bc45.js";import"./index-945854dc.js";g.register(v,N,u);const w=({data:r})=>e.jsx("div",{className:"d-flex justify-content-center w-100 h-100",children:e.jsx(y,{data:r})}),n=w;function C(){const r=t().props.client_credits_given,o=t().props.client_credits_taken,a=t().props.worst_credit_status,{totalCreditGiven:h,totalCreditTaken:x,creditGivenWithPercentages:l,creditTakenWithPercentages:i}=f(r,o),m={labels:["Current","Past Due 1-30 days","Past Due 31-60 days","Past Due 61-90 days","Past Due 90+ days"],datasets:[{label:"% of Total Credit Taken",data:l.map(s=>s.percentage),backgroundColor:["green","orange","#f87171","#991b1b","black"],borderWidth:0}]},j={labels:["Current","Past Due 1-30 days","Past Due 31-60 days","Past Due 61-90 days","Past Due 90+ days"],datasets:[{label:"% of Total Credit Given",data:i.map(s=>s.percentage),backgroundColor:["green","orange","#f87171","#991b1b","black"],borderWidth:0}]};return e.jsxs("main",{children:[e.jsx(b,{title:"Dashboard"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsxs("div",{className:"row align-items-start justify-content-center gap-4 gap-md-0  mb-5",children:[e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"card card-raised  overflow-hidden",children:[e.jsx("div",{className:"card-header bg-info text-white px-4",children:e.jsx("div",{className:"fw-500 text-center",children:"Payment Status Check"})}),e.jsx("div",{className:"card-body p-0",children:e.jsxs("div",{className:"d-flex justify-content-around mt-2 mb-2",children:[e.jsx("div",{children:e.jsx(c,{href:reverseUrl("cl-search-individuals"),style:{color:"#176987",textDecoration:"none"},children:"Individual"})}),e.jsx("div",{children:"|"}),e.jsx("div",{children:e.jsx(c,{href:reverseUrl("cl-search-companies"),style:{color:"#176987",textDecoration:"none"},children:"Company"})})]})})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"card card-raised  overflow-hidden",children:[e.jsx("div",{className:"card-header px-4 bg-gray",children:e.jsx("div",{className:"fw-500 text-center",children:"Your Payment Status"})}),e.jsx("div",{className:"card-body p-0",children:e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:e.jsx("th",{scope:"",className:`text-white px-4 ${a.color==="black"?"bg-black":a.color==="orange"?"bg-warning":a.color==="red"?"bg-danger":"bg-success"}`,children:a.score_level==="HHR"?"High High Risk":a.score_level==="LHR"?"Low High Risk":a.score_level==="HLR"?"High Low Risk":a.score_level==="NP"?"Non Payer":"Low Low Risk"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"",children:"Oldest Creditor"}),e.jsx("td",{children:a.lease_giver_name}),e.jsx("td",{children:a.payment_date}),e.jsxs("td",{className:"text-end",children:[a.currency," ",a.balance?d(Number(a.balance)):""]})]})]})})})]})})]}),e.jsxs("div",{className:"row align-items-start gap-4 gap-md-0 mb-5",children:[e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"card card-raised  overflow-hidden",children:[e.jsx("div",{className:"card-header bg-info text-white px-4 py-1",children:e.jsx("div",{className:"fw-500 text-center",children:"Credit Given"})}),e.jsx("div",{className:"card-body py-1",children:e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"",children:"Status"}),e.jsx("td",{children:"USD"}),e.jsx("td",{children:" %"})]}),l.map(s=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"",style:{backgroundColor:s.bg,color:"white"},children:s.label}),e.jsx("td",{style:{backgroundColor:s.bg,color:"white"},className:"text-end",children:d(Number(s.amount))}),e.jsx("td",{children:s.percentage||0})]},s.label)),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"14px",fontWeight:"bold"},children:[e.jsx("th",{scope:"row",className:"",children:"Total"}),e.jsx("td",{className:"text-end",children:d(Number(h))}),e.jsx("td",{children:"100"})]})]})})})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"card card-raised  overflow-hidden",children:[e.jsx("div",{className:"card-header bg-danger text-white px-4 py-1",children:e.jsx("div",{className:"fw-500 text-center",children:"Credit Taken"})}),e.jsx("div",{className:"card-body py-1",children:e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"",children:"Status"}),e.jsx("td",{children:"USD"}),e.jsx("td",{children:" %"})]}),i.map(s=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"",style:{backgroundColor:s.bg,color:"white"},children:s.label}),e.jsx("td",{style:{backgroundColor:s.bg,color:"white"},className:"text-end",children:d(Number(s.amount))}),e.jsx("td",{children:Number(s.percentage)})]},s.label)),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"14px",fontWeight:"bold"},children:[e.jsx("th",{scope:"row",className:"",children:"Total"}),e.jsx("td",{className:"text-end",children:d(Number(x))}),e.jsx("td",{children:"100"})]})]})})})]})})]}),e.jsxs("div",{className:"row align-items-start gap-4 gap-md-0 mb-5",children:[e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"card card-raised overflow-hidden",children:[e.jsx("div",{className:"card-header py-1",children:e.jsx("div",{className:"fw-500 text-center",children:"Credit Given"})}),e.jsx("div",{className:"card-body p-4",children:e.jsx(n,{data:m})})]})}),e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"card card-raised overflow-hidden",children:[e.jsx("div",{className:"card-header py-1",children:e.jsx("div",{className:"fw-500 text-center",children:"Credit Taken"})}),e.jsx("div",{className:"card-body p-4",children:e.jsx(n,{data:j})})]})})]})]})]})}C.layout=r=>e.jsx(p,{children:r,title:"Dashboard"});export{C as default};
