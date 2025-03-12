import{j as e,r as h,H as x,L as o}from"./main-605f1a65.js";import{P as j}from"./PageHeader-fe8db873.js";import{l as m}from"./lodash-65d1f6eb.js";import{M as c}from"./Modal-fa119524.js";import{L as u,B as v,C as p,a as b,b as y,P as f,c as g,d as N,p as w,T as L,e as C,f as _}from"./index-16ff72be.js";import"./removeClass-2f25b0a4.js";import"./index-4b3e425d.js";function M(){return e.jsxs("div",{children:[e.jsxs("h5",{className:"p-2 m-0 text-white text-center bg-info",children:["Impact - ",new Date().getFullYear()]}),e.jsxs("table",{className:"table table-sm table-responsive table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Week on Week Ageing"}),e.jsx("th",{}),e.jsx("th",{}),e.jsx("th",{}),e.jsx("th",{}),e.jsx("th",{}),e.jsx("th",{})]})}),e.jsx("tbody",{children:A.map((s,l)=>e.jsxs("tr",{children:[e.jsx("td",{children:s.date}),e.jsx("td",{children:s.value1}),e.jsx("td",{children:s.value2}),e.jsx("td",{children:s.value3}),e.jsx("td",{children:s.value4}),e.jsx("td",{children:s.value5}),e.jsx("td",{children:"100%"})]},l))}),e.jsx("tfoot",{children:e.jsxs("tr",{children:[e.jsx("th",{children:" Movements"}),k.map((s,l)=>e.jsx("td",{children:s},l))]})})]})]})}const k=[-31.45,-2.98,-3.41,1.6,36.24],A=[{date:"17-Jun-24",value1:68.5,value2:2.5,value3:.12,value4:8.9,value5:19.98},{date:"24-Jun-24",value1:55,value2:2.4,value3:5.2,value4:6.2,value5:31.2},{date:"01-Jul-24",value1:23.55,value2:-.58,value3:1.79,value4:7.8,value5:67.44}];function F(){return e.jsxs("div",{children:[e.jsxs("h5",{className:"p-2 m-0 text-white text-center bg-info",children:["Impact - ",new Date().getFullYear()]}),e.jsxs("table",{className:"table table-sm table-responsive table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Month"}),e.jsx("th",{}),e.jsx("th",{}),e.jsx("th",{}),e.jsx("th",{}),e.jsx("th",{}),e.jsx("th",{})]})}),e.jsx("tbody",{children:I.map((s,l)=>e.jsxs("tr",{children:[e.jsx("td",{children:s.month}),e.jsxs("td",{children:[s.value1.toFixed(2),"%"]}),e.jsxs("td",{children:[s.value2.toFixed(2),"%"]}),e.jsxs("td",{children:[s.value3.toFixed(2),"%"]}),e.jsxs("td",{children:[s.value4.toFixed(2),"%"]}),e.jsxs("td",{children:[s.value5.toFixed(2),"%"]}),e.jsx("td",{children:"100%"})]},l))}),e.jsx("tfoot",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Movements"}),D.map((s,l)=>e.jsxs("td",{children:[s.toFixed(2),"%"]},l))]})})]})]})}const D=[-44.95,-3.08,1.67,-1.1,47.46],I=[{month:"Jan-24",value1:68.5,value2:2.5,value3:.12,value4:8.9,value5:19.98},{month:"Feb-24",value1:23.55,value2:-.58,value3:1.79,value4:7.8,value5:67.44},{month:"Mar-24",value1:68.5,value2:2.5,value3:.12,value4:8.9,value5:19.98},{month:"Apr-24",value1:23.55,value2:-.58,value3:1.79,value4:7.8,value5:67.44},{month:"May-24",value1:68.5,value2:2.5,value3:.12,value4:8.9,value5:19.98},{month:"Jun-24",value1:23.55,value2:-.58,value3:1.79,value4:7.8,value5:67.44}];function S({show:s,closeModal:l,customerType:t,customers:n=[]}){const r=t==="individual"?"bg-info":t==="company"?"bg-secondary":"bg-primary",d={individualLease:n.reduce((a,i)=>a+i.individualLease,0),companyLease:n.reduce((a,i)=>a+i.companyLease,0),total:n.reduce((a,i)=>a+i.total,0)};return e.jsx(e.Fragment,{children:e.jsxs(c,{show:s,onHide:l,size:"xl",backdrop:"static",centered:!0,children:[e.jsx(c.Header,{closeButton:!0,children:e.jsx(c.Title,{children:"Active Leases"})}),e.jsx(c.Body,{children:e.jsxs("div",{children:[e.jsxs("h5",{className:`p-2 m-0 text-white text-center ${r}`,children:[m.capitalize(t)," Customers"]}),e.jsxs("table",{className:"table table-sm table-responsive table-bordered",children:[e.jsxs("thead",{children:[e.jsxs("tr",{children:[e.jsx("th",{children:"Customer No."}),e.jsx("th",{children:"Company Name"}),t!=="company"&&e.jsx("th",{children:"Identity No."}),e.jsx("th",{children:"Address"}),e.jsx("th",{colSpan:"2",className:"text-center",children:"Lease Type"}),e.jsx("th",{children:"Total"})]}),e.jsxs("tr",{children:[e.jsx("th",{colSpan:t!=="company"?4:3}),e.jsx("th",{className:"text-center",children:"Individual"}),e.jsx("th",{className:"text-center",children:"Company"}),e.jsx("th",{})]})]}),e.jsxs("tbody",{children:[n.length===0&&e.jsx("tr",{children:e.jsx("td",{colSpan:t!=="company"?7:6,className:"text-center text-muted p-5",children:"Nothing to show"})}),n.map((a,i)=>e.jsxs("tr",{children:[e.jsx("td",{children:a.customerNo}),e.jsx("td",{children:a.companyName}),t!=="company"&&e.jsx("td",{children:a.identityNo}),e.jsx("td",{children:a.address}),e.jsx("td",{children:a.individualLease}),e.jsx("td",{children:a.companyLease}),e.jsx("td",{children:a.total})]},i))]}),e.jsx("tfoot",{children:e.jsxs("tr",{children:[e.jsx("th",{colSpan:t!=="company"?4:3,children:"Grand Total"}),e.jsx("th",{children:d.individualLease}),e.jsx("th",{children:d.companyLease}),e.jsx("th",{children:d.total})]})})]})]})})]})})}function R({individual_customers:s=[],company_customers:l=[]}){const[t,n]=h.useState(void 0),r=s.map((a,i)=>({customerNo:`I-${i+1}`,companyName:a.subscriber_name,identityNo:a.subscriber_id,address:a.subscriber_address,individualLease:a.individual_leases_count||0,companyLease:a.company_leases_count||0,total:(a.individual_leases_count||0)+(a.company_leases_count||0)})),d=l.map((a,i)=>({customerNo:`C-${i+1}`,companyName:a.subscriber_name,address:a.subscriber_address,individualLease:a.individual_leases_count||0,companyLease:a.company_leases_count||0,total:(a.individual_leases_count||0)+(a.company_leases_count||0)}));return console.log(r,d),e.jsxs(e.Fragment,{children:[e.jsxs(e.Fragment,{children:[e.jsx(x,{title:"Admin Dashboard"}),!!t&&e.jsx(S,{show:!!t,customerType:t,customers:t==="individual"?r:t==="company"?d:[...r,...d],closeModal:()=>n(void 0)})]}),e.jsxs("main",{children:[e.jsx(j,{title:"Dashboard"}),e.jsxs("div",{className:"container-xl p-4",children:[e.jsxs("div",{className:"row align-items-center mb-4",children:[e.jsx("div",{className:"col-6",children:e.jsxs("div",{className:"border shadow-sm bg-white",children:[e.jsx("h5",{className:"m-0 p-2 bg-info text-white text-center",children:"Credit Status Check"}),e.jsxs("div",{className:"d-flex justify-content-around p-2",children:[e.jsx(o,{href:reverseUrl("individuals"),className:"c-text-link text-decoration-none",children:"Individual"}),e.jsx("div",{children:"|"}),e.jsx("div",{children:e.jsx(o,{href:reverseUrl("companies"),className:"c-text-link text-decoration-none",children:"Company"})})]})]})}),e.jsx("div",{className:"col-6",children:e.jsxs("div",{className:"border shadow-sm bg-white",children:[e.jsx("h5",{className:"m-0 p-2 bg-info text-white text-center",children:"View Active Leases"}),e.jsxs("div",{className:"d-flex justify-content-around p-2 gap-3",children:[e.jsx("button",{className:"btn btn-sm py-2 btn-info text-white  flex-fill justify-content-center",onClick:()=>n("individual"),children:"Individual"}),e.jsx("button",{className:"btn btn-sm py-2 btn-secondary  flex-fill justify-content-center",onClick:()=>n("company"),children:"Company"}),e.jsx("button",{className:"btn btn-sm py-2 btn-primary  flex-fill justify-content-center",onClick:()=>n("combined"),children:"Combined"})]})]})})]}),e.jsxs("div",{className:"row align-items-center mb-4",children:[e.jsx("div",{className:"col-6",children:e.jsx("div",{className:"d-flex flex-column bg-white",children:e.jsx(u,{data:z,options:{animation:!1,maintainAspectRatio:!1,elements:{line:{tension:.4}},datalabels:{color:"white",font:{weight:"bold",size:14}},scales:{x:{grid:{display:!0},offset:!0,title:{display:!0,text:"Week End",align:"center",font:{size:20,weight:"medium"}}},y:{title:{display:!0,align:"center",text:"Active Leases",font:{size:20,weight:"medium"}},grid:{display:!0}}}}})})}),e.jsx("div",{className:"col-6",children:e.jsx("div",{className:"d-flex flex-column bg-white",children:e.jsx(v,{data:B,options:{animation:!1,maintainAspectRatio:!1,elements:{line:{tension:.4}},datalabels:{color:"white",font:{weight:"bold",size:14}},scales:{x:{grid:{display:!0},offset:!0,title:{display:!0,text:"Month End",align:"center",font:{size:20,weight:"medium"}}},y:{title:{display:!0,align:"center",text:"Active Leases",font:{size:20,weight:"medium"}},grid:{display:!0}}}}})})})]}),e.jsxs("div",{className:"row align-items-start justify-content-between mb-4",children:[e.jsx("div",{className:"col-6",children:e.jsx("div",{className:"bg-white",children:e.jsx(M,{})})}),e.jsx("div",{className:"col-6",children:e.jsx("div",{className:"bg-white",children:e.jsx(F,{})})})]})]})]})]})}p.register(b,y,f,g,N,w,L,C,_);const z={labels:["25-Feb","3-Mar","10-Mar","17-Mar","24-Mar","31-Mar","7-Apr","14-Apr","21-Apr","28-Apr","5-May","12-May"],datasets:[{label:"Leases - 2024",data:[10,14,19,25,31,40,52,60,75,80,93,100],fill:!0,backgroundColor:"#53D9D9",borderColor:"rgba(75,192,192,1)",pointBackgroundColor:"#0e0d0d"}]},B={labels:["Jan-24","Feb-24","Mar-24","Apr-24","May-24","Jun-24","Jul-24"],datasets:[{label:"Leases - 2024",data:[33,36,40,41,44,65,76],fill:!0,backgroundColor:"#53D9D9",borderColor:"rgba(75,192,192,1)",pointBackgroundColor:"#0e0d0d"}]};export{R as default};
