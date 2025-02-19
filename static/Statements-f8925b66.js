import{u as m,a as p,j as e}from"./main-c9f48cfc.js";import{L as j}from"./Layout-62c313cd.js";import{f as s}from"./formatting-9de8c923.js";import{S as g,P as u}from"./PaginationControls-e04ee0a8.js";import"./lodash-138d3cec.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-0c5cccfc.js";import"./Modal-e5a18170.js";import"./index-bc162131.js";import"./index-761e8895.js";import"./MultipleUpload-a065c8eb.js";import"./index-2a142f3a.js";import"./search-dd46c5df.js";import"./Button-5f607c9d.js";const b=()=>{const{props:{tenant_list:l,total_pages:a,total_items:f,current_page:x}}=m(),{data:w,get:h}=p(),d=t=>{const i=`/clients/accounting/detailed-statement/${t}/`;h(i)},r=l.filter(t=>t.lease_currency_type.toUpperCase()==="USD"),o=l.filter(t=>t.lease_currency_type.toUpperCase()!=="USD"),n=r.reduce((t,i)=>t+parseFloat(i.owing_amount),0),c=o.reduce((t,i)=>t+parseFloat(i.owing_amount),0);return e.jsxs("div",{children:[e.jsx("div",{className:"col-4 pb-3",children:e.jsx(g,{searchBy:"search",placeholder:"Search..."})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"18px"},className:"bg-info",children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white text-uppercase",children:"Customer Summary"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"16px"},children:e.jsxs("th",{scope:"row",colSpan:5,className:"text-start font-weight-bold d-flex justify-content-start align-items-center gap-8",children:["Date:",e.jsx("span",{className:"text-end font-weight-normal",children:new Date().toLocaleDateString()})]})})]})}),e.jsx("div",{className:"text-start font-weight-bold text-uppercase mb-2 ml-4",children:"usd"}),e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#a0a0af"},children:[e.jsx("th",{scope:"",children:"Customer #"}),e.jsx("td",{children:" Customer Name"}),e.jsx("td",{children:" Adress"}),e.jsx("td",{children:" Rent Owing"}),e.jsx("td",{className:"bg-white"})]})}),e.jsx("tbody",{children:(r==null?void 0:r.length)>0&&r.map(t=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:t.id}),e.jsxs("td",{children:[t.tenant_name," "]}),e.jsx("td",{children:t.address}),e.jsx("td",{className:`text-end bg-${t.color} text-white`,style:{backgroundColor:t.color=="light-red"?"#f87171":""},children:Number(t.owing_amount)>=0?s(Number(t.owing_amount)):`(${s(Number(t.owing_amount)*-1)})`}),e.jsx("td",{className:"bg-info text-center",style:{fontWeight:"500",fontSize:"16px",color:"white",cursor:"pointer"},onClick:()=>d(t.id),children:"View"})]},t.id))}),e.jsx("tfoot",{children:e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"18px",fontWeight:"bold"},children:[e.jsx("th",{scope:"row",children:"Total"}),e.jsx("td",{children:" "}),e.jsx("td",{}),e.jsx("td",{className:"text-end",children:n>=0?s(n):`(${s(n*-1)})`}),e.jsx("td",{})]})})]}),e.jsx("div",{className:"text-start font-weight-bold mb-2 ml-4",children:"ZWG"}),e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#a0a0af"},children:[e.jsx("th",{scope:"",children:"Tenant #"}),e.jsx("td",{children:" Tenant Name"}),e.jsx("td",{children:" Adress"}),e.jsx("td",{children:" Rent Owing"}),e.jsx("td",{className:"bg-white"})]})}),e.jsx("tbody",{children:(o==null?void 0:o.length)>0&&o.map(t=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:t.id}),e.jsxs("td",{children:[t.tenant_name," "]}),e.jsx("td",{children:t.address}),e.jsx("td",{className:`text-end bg-${t.color} text-white`,style:{backgroundColor:t.color=="light-red"?"#f87171":""},children:Number(t.owing_amount)>=0?s(Number(t.owing_amount)):`(${s(Number(t.owing_amount)*-1)})`}),e.jsx("td",{className:"bg-info text-center",style:{fontWeight:"500",fontSize:"16px",color:"white",cursor:"pointer"},onClick:()=>d(t.id),children:"View"})]},t.id))}),e.jsx("tfoot",{children:e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"18px",fontWeight:"bold"},children:[e.jsx("th",{scope:"row",children:"Total"}),e.jsx("td",{children:" "}),e.jsx("td",{}),e.jsx("td",{className:"text-end",children:c>=0?s(c):`(${s(c*-1)})`}),e.jsx("td",{})]})})]}),e.jsx("div",{className:"px-3",children:e.jsx(u,{currentPage:x,totalPages:a})})]})};b.layout=l=>e.jsx(j,{children:l,title:"Customer Statements"});export{b as default};
