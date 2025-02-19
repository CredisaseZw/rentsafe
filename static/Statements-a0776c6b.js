import{u as x,a as h,j as e}from"./main-5ef5aaa0.js";import{L as m}from"./Layout-be807b80.js";import{f as s}from"./formatting-345d2430.js";const j=()=>{const i=x().props.tenant_list,{data:p,get:a}=h(),c=t=>{const o=`/clients/accounting/detailed-statement/${t}/`;a(o)},r=i.filter(t=>t.lease_currency_type.toUpperCase()==="USD"),l=i.filter(t=>t.lease_currency_type.toUpperCase()!=="USD"),n=r.reduce((t,o)=>t+parseFloat(o.owing_amount),0),d=l.reduce((t,o)=>t+parseFloat(o.owing_amount),0);return e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"18px"},className:"bg-info",children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white text-uppercase",children:"Customer Summary"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"16px"},children:e.jsxs("th",{scope:"row",colSpan:5,className:"text-start font-weight-bold d-flex justify-content-start align-items-center gap-8",children:["Date:",e.jsx("span",{className:"text-end font-weight-normal",children:new Date().toLocaleDateString()})]})})]})}),e.jsxs("table",{className:"table table-bordered",children:[e.jsx("div",{className:"text-start font-weight-bold text-uppercase mb-2 ml-4",children:"usd"}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#a0a0af"},children:[e.jsx("th",{scope:"",children:"Customer #"}),e.jsx("td",{children:" Customer Name"}),e.jsx("td",{children:" Adress"}),e.jsx("td",{children:" Rent Owing"}),e.jsx("td",{className:"bg-white"})]}),(r==null?void 0:r.length)>0&&r.map(t=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:t.id}),e.jsxs("td",{children:[t.tenant_name," "]}),e.jsx("td",{children:t.address}),e.jsx("td",{className:`text-end bg-${t.color} text-white`,style:{backgroundColor:t.color=="light-red"?"#f87171":""},children:Number(t.owing_amount)>=0?s(Number(t.owing_amount)):`(${s(Number(t.owing_amount)*-1)})`}),e.jsx("td",{className:"bg-info text-center",style:{fontWeight:"500",fontSize:"16px",color:"white",cursor:"pointer"},onClick:()=>c(t.id),children:"View"})]},t.id))]}),e.jsx("tfoot",{children:e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"18px",fontWeight:"bold"},children:[e.jsx("th",{scope:"row",children:"Total"}),e.jsx("td",{children:" "}),e.jsx("td",{}),e.jsx("td",{className:"text-end",children:n>=0?s(n):`(${s(n*-1)})`}),e.jsx("td",{})]})})]}),e.jsxs("table",{className:"table table-bordered",children:[e.jsx("div",{className:"text-start font-weight-bold mb-2 ml-4",children:"ZWG"}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#a0a0af"},children:[e.jsx("th",{scope:"",children:"Tenant #"}),e.jsx("td",{children:" Tenant Name"}),e.jsx("td",{children:" Adress"}),e.jsx("td",{children:" Rent Owing"}),e.jsx("td",{className:"bg-white"})]}),(l==null?void 0:l.length)>0&&l.map(t=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:t.id}),e.jsxs("td",{children:[t.tenant_name," "]}),e.jsx("td",{children:t.address}),e.jsx("td",{className:`text-end bg-${t.color} text-white`,style:{backgroundColor:t.color=="light-red"?"#f87171":""},children:Number(t.owing_amount)>=0?s(Number(t.owing_amount)):`(${s(Number(t.owing_amount)*-1)})`}),e.jsx("td",{className:"bg-info text-center",style:{fontWeight:"500",fontSize:"16px",color:"white",cursor:"pointer"},onClick:()=>c(t.id),children:"View"})]},t.id))]}),e.jsx("tfoot",{children:e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"18px",fontWeight:"bold"},children:[e.jsx("th",{scope:"row",children:"Total"}),e.jsx("td",{children:" "}),e.jsx("td",{}),e.jsx("td",{className:"text-end",children:d>=0?s(d):`(${s(d*-1)})`}),e.jsx("td",{})]})})]})]})};j.layout=i=>e.jsx(m,{children:i,title:"Customer Statements"});export{j as default};
