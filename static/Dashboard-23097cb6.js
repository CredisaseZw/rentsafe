import{j as e,R as c,H as j,L as o}from"./main-a0565b6d.js";import{P as u}from"./PageHeader-bd2dcfcf.js";import{L as p,B as v,C as b,a as y,b as f,P as g,c as N,d as S,p as w,T as L,e as C,f as z}from"./index-19143fed.js";import{M as d}from"./Modal-12d22f70.js";import"./removeClass-ac3be70f.js";import"./index-99e8006d.js";const H=()=>{const i=[{date:"17-Jun-24",value1:68.5,value2:2.5,value3:.12,value4:8.9,value5:19.98},{date:"24-Jun-24",value1:55,value2:2.4,value3:5.2,value4:6.2,value5:31.2},{date:"01-Jul-24",value1:23.55,value2:-.58,value3:1.79,value4:7.8,value5:67.44}],n=[-31.45,-2.98,-3.41,1.6,36.24];return e.jsx("div",{className:"taable-responsive",children:e.jsxs("table",{className:"table table-bordered",children:[e.jsxs("thead",{children:[e.jsx("tr",{style:{fontSize:"14px",lineHeight:"5px"},className:"bg-info text-white",children:e.jsx("th",{colSpan:7,className:"text-center",children:"IMPACT"})}),e.jsx("tr",{style:{fontSize:"14px",lineHeight:"5px"},children:e.jsx("th",{colSpan:7,children:"Week on Week Ageing"})})]}),e.jsx("tbody",{children:i.map((s,a)=>e.jsxs("tr",{style:{fontSize:"14px",lineHeight:"5px"},children:[e.jsx("td",{children:s.date}),e.jsx("td",{children:s.value1}),e.jsx("td",{children:s.value2}),e.jsx("td",{children:s.value3}),e.jsx("td",{children:s.value4}),e.jsx("td",{children:s.value5}),e.jsx("td",{children:"100%"})]},a))}),e.jsx("tfoot",{children:e.jsxs("tr",{style:{fontSize:"14px",lineHeight:"5px"},children:[e.jsx("td",{children:" Movements"}),n.map((s,a)=>e.jsx("td",{children:s},a))]})})]})})},M=H,k=()=>{const i=[{month:"Jan-24",value1:68.5,value2:2.5,value3:.12,value4:8.9,value5:19.98},{month:"Feb-24",value1:23.55,value2:-.58,value3:1.79,value4:7.8,value5:67.44},{month:"Mar-24",value1:68.5,value2:2.5,value3:.12,value4:8.9,value5:19.98},{month:"Apr-24",value1:23.55,value2:-.58,value3:1.79,value4:7.8,value5:67.44},{month:"May-24",value1:68.5,value2:2.5,value3:.12,value4:8.9,value5:19.98},{month:"Jun-24",value1:23.55,value2:-.58,value3:1.79,value4:7.8,value5:67.44}],n=[-44.95,-3.08,1.67,-1.1,47.46];return e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-bordered",children:[e.jsxs("thead",{children:[e.jsx("tr",{style:{fontSize:"14px",lineHeight:"5px"},className:"bg-info",children:e.jsx("th",{colSpan:7,className:"text-center",children:"IMPACT"})}),e.jsx("tr",{style:{fontSize:"14px",lineHeight:"5px"},className:"",children:e.jsx("th",{colSpan:7,className:"text-center",children:"YEAR 2024"})}),e.jsx("tr",{style:{fontSize:"14px",lineHeight:"5px"},children:e.jsx("th",{colSpan:7,children:"Month"})})]}),e.jsx("tbody",{children:i.map((s,a)=>e.jsxs("tr",{style:{fontSize:"14px",lineHeight:"5px"},children:[e.jsx("td",{children:s.month}),e.jsxs("td",{children:[s.value1.toFixed(2),"%"]}),e.jsxs("td",{children:[s.value2.toFixed(2),"%"]}),e.jsxs("td",{children:[s.value3.toFixed(2),"%"]}),e.jsxs("td",{children:[s.value4.toFixed(2),"%"]}),e.jsxs("td",{children:[s.value5.toFixed(2),"%"]}),e.jsx("td",{children:"100%"})]},a))}),e.jsx("tfoot",{children:e.jsxs("tr",{style:{fontSize:"14px",lineHeight:"5px"},children:[e.jsx("th",{children:"Movements"}),n.map((s,a)=>e.jsxs("td",{children:[s.toFixed(2),"%"]},a))]})})]})})},A=k;b.register(y,f,g,N,S,w,L,C,z);function P({allUsers:i,newSubsCount:n,newUsersCount:s,earnedIncome:a}){const[t,l]=c.useState(!1),[x,r]=c.useState(!1),h={labels:["25-Feb","3-Mar","10-Mar","17-Mar","24-Mar","31-Mar","7-Apr","14-Apr","21-Apr","28-Apr","5-May","12-May"],datasets:[{label:"Leases - 2024",data:[10,14,19,25,31,40,52,60,75,80,93,100],fill:!0,backgroundColor:"#53D9D9",borderColor:"rgba(75,192,192,1)",pointBackgroundColor:"#0e0d0d"}]},m={labels:["Jan-24","Feb-24","Mar-24","Apr-24","May-24","Jun-24","Jul-24"],datasets:[{label:"Leases - 2024",data:[33,36,40,41,44,65,76],fill:!0,backgroundColor:"#53D9D9",borderColor:"rgba(75,192,192,1)",pointBackgroundColor:"#0e0d0d"}]};return e.jsxs(e.Fragment,{children:[e.jsxs(j,{children:[e.jsx("title",{children:"Home"}),e.jsx("meta",{name:"description",content:"Your page description"})]}),e.jsxs("main",{children:[e.jsx(u,{title:"Dashboard"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx(T,{show:t,setShow:l}),e.jsx(I,{show:x,setShow:r}),e.jsxs("div",{className:"row align-items-center mb-5",children:[e.jsx("div",{className:"col-md-6",children:e.jsxs("div",{className:"card card-raised  overflow-hidden",children:[e.jsx("div",{className:"card-header bg-info text-white px-4",children:e.jsx("div",{className:"fw-500 text-center",children:"Credit Status Check"})}),e.jsx("div",{className:"card-body p-0",children:e.jsxs("div",{className:"d-flex justify-content-around mt-2 mb-2",children:[e.jsx("div",{children:e.jsx(o,{href:reverseUrl("individuals"),style:{color:"#176987",textDecoration:"none"},children:"Individual"})}),e.jsx("div",{children:"|"}),e.jsx("div",{children:e.jsx(o,{href:reverseUrl("companies"),style:{color:"#176987",textDecoration:"none"},children:"Company"})})]})})]})}),e.jsx("div",{className:"col-md-6 mt-2 mt-md-0",children:e.jsxs("div",{className:"d-flex gap-0 rounded  border border-dark  mx-auto  align-items-center flex-column",children:[e.jsx("h2",{className:"border-bottom border-black mb-0 py-2 h4 w-100 text-center",children:"View Active Leases"}),e.jsxs("div",{className:"d-flex m-0 w-100",children:[e.jsx("div",{className:"w-100 text-center text-white p-2  bg-info ",onClick:()=>l(!0),children:"Individual"}),e.jsx("div",{className:"w-100 text-center text-white p-2 bg-secondary",onClick:()=>r(!0),children:"Company"})]})]})})]}),e.jsxs("div",{className:"row align-items-center my-2",children:[e.jsx("div",{className:"col-md-6 d-flex flex-column",children:e.jsx(p,{data:h,options:{animation:!1,maintainAspectRatio:!1,elements:{line:{tension:.4}},datalabels:{color:"white",font:{weight:"bold",size:14}},scales:{x:{grid:{display:!0},offset:!0,title:{display:!0,text:"Week End",align:"center",font:{size:20,weight:"medium"}}},y:{title:{display:!0,align:"center",text:"Active Leases",font:{size:20,weight:"medium"}},grid:{display:!0}}}}})}),e.jsx("div",{className:"col-md-6 mt-2 mt-md-0 d-flex flex-column",children:e.jsx(v,{data:m,options:{animation:!1,maintainAspectRatio:!1,elements:{line:{tension:.4}},datalabels:{color:"white",font:{weight:"bold",size:14}},scales:{x:{grid:{display:!0},offset:!0,title:{display:!0,text:"Month End",align:"center",font:{size:20,weight:"medium"}}},y:{title:{display:!0,align:"center",text:"Active Leases",font:{size:20,weight:"medium"}},grid:{display:!0}}}}})})]}),e.jsxs("div",{className:"row align-items-start justify-content-between mb-5",children:[e.jsx("div",{className:"col-md-6",children:e.jsx(M,{})}),e.jsx("div",{className:"col-md-6",children:e.jsx(A,{})})]})]})]})]})}function T({show:i,setShow:n}){const s=[{customerNo:"C1",companyName:"Casterns Munoba",identityNo:"48545123T45",address:"2 Selous Road",individualLease:4,companyLease:0,total:4},{customerNo:"C2",companyName:"John Chibadura ",identityNo:"61646644U98 ",address:"32 2nd Str Ext",individualLease:32,companyLease:4,total:36}],a={individualLease:s.reduce((t,l)=>t+l.individualLease,0),companyLease:s.reduce((t,l)=>t+l.companyLease,0),total:s.reduce((t,l)=>t+l.total,0)};return e.jsx(e.Fragment,{children:e.jsxs(d,{show:i,onHide:()=>n(!1),size:"lg",backdrop:"static",centered:!0,children:[e.jsx(d.Header,{closeButton:!0,children:e.jsx(d.Title,{children:"Active Leases"})}),e.jsx(d.Body,{children:e.jsxs("table",{className:"table table-bordered",children:[e.jsxs("thead",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px"},className:"bg-info text-white",children:e.jsx("th",{colSpan:"7",className:"text-center ",children:"INDIVIDUAL CUSTOMERS"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{children:"Customer No."}),e.jsx("th",{children:"Company Name"}),e.jsx("th",{children:"Identity No."}),e.jsx("th",{children:"Address"}),e.jsx("th",{colSpan:"2",children:"Lease Type"}),e.jsx("th",{children:"Total"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{colSpan:"4"}),e.jsx("th",{children:"Individual"}),e.jsx("th",{children:"Company"}),e.jsx("th",{})]})]}),e.jsx("tbody",{children:s.map((t,l)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("td",{children:t.customerNo}),e.jsx("td",{children:t.companyName}),e.jsx("td",{children:t.identityNo}),e.jsx("td",{children:t.address}),e.jsx("td",{children:t.individualLease}),e.jsx("td",{children:t.companyLease}),e.jsx("td",{children:t.total})]},l))}),e.jsx("tfoot",{children:e.jsxs("tr",{children:[e.jsx("td",{colSpan:"4",children:e.jsx("strong",{children:"Grand Total"})}),e.jsx("td",{className:"fw-bolder border-b-2 border-b-black",children:a.individualLease}),e.jsx("td",{className:"fw-bolder border-b-2 border-b-black",children:a.companyLease}),e.jsx("td",{className:"fw-bolder border-b-2 border-b-black",children:a.total})]})})]})})]})})}function I({show:i,setShow:n}){const s=[{customerNo:"C1",companyName:"Tao Properties",address:"2 Selous Road",individualLease:36,companyLease:11,total:47},{customerNo:"C2",companyName:"Solid Real Est.",address:"32 2nd Str Ext",individualLease:4,companyLease:1,total:5}],a={individualLease:s.reduce((t,l)=>t+l.individualLease,0),companyLease:s.reduce((t,l)=>t+l.companyLease,0),total:s.reduce((t,l)=>t+l.total,0)};return e.jsx(e.Fragment,{children:e.jsxs(d,{show:i,onHide:()=>n(!1),size:"lg",backdrop:"static",centered:!0,children:[e.jsx(d.Header,{closeButton:!0,children:e.jsx(d.Title,{children:"Active Leases"})}),e.jsx(d.Body,{children:e.jsxs("table",{className:"table table-bordered",children:[e.jsxs("thead",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px"},className:"bg-secondary text-white",children:e.jsx("th",{colSpan:"6",className:"text-center",children:"COMPANY CUSTOMERS"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{children:"Customer No."}),e.jsx("th",{children:"Company Name"}),e.jsx("th",{children:"Address"}),e.jsx("th",{colSpan:"2",children:"Lease Type"}),e.jsx("th",{children:"Total"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{colSpan:"3"}),e.jsx("th",{children:"Individual"}),e.jsx("th",{children:"Company"}),e.jsx("th",{})]})]}),e.jsx("tbody",{children:s.map((t,l)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("td",{children:t.customerNo}),e.jsx("td",{children:t.companyName}),e.jsx("td",{children:t.address}),e.jsx("td",{children:t.individualLease}),e.jsx("td",{children:t.companyLease}),e.jsx("td",{children:t.total})]},l))}),e.jsx("tfoot",{children:e.jsxs("tr",{children:[e.jsx("td",{colSpan:"3",children:e.jsx("strong",{children:"Grand Total"})}),e.jsx("td",{className:"fw-bolder border-b-2 border-b-black",children:a.individualLease}),e.jsx("td",{className:"fw-bolder border-b-2 border-b-black",children:a.companyLease}),e.jsx("td",{className:"fw-bolder border-b-2 border-b-black",children:a.total})]})})]})})]})})}export{P as default};
