import{u,a as b,j as e}from"./main-605f1a65.js";import{L as g}from"./Layout-d8d0e5c9.js";import{S as m,P as f}from"./PaginationControls-695c10f8.js";import{f as l}from"./formatting-9de8c923.js";import"./lodash-65d1f6eb.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-2f25b0a4.js";import"./Modal-fa119524.js";import"./index-4b3e425d.js";import"./MultipleUpload-3f80ff47.js";import"./index-5b34db9a.js";import"./search-7ba8f0d2.js";import"./Button-5d19e586.js";function N(){const{props:{tenant_list:s,total_pages:d,total_items:n,current_page:h}}=u(),{data:c,get:i}=b();function o(r){const a=`/clients/accounting/detailed-statement/${r}/`;i(a)}const t=s.filter(r=>r.lease_currency_type.toUpperCase()==="USD"),x=s.filter(r=>r.lease_currency_type.toUpperCase()!=="USD"),j=t.reduce((r,a)=>r+parseFloat(a.owing_amount),0),p=x.reduce((r,a)=>r+parseFloat(a.owing_amount),0);return{data:c,tenants:s,usdTotal:j,zwlTotal:p,total_pages:d,total_items:n,current_page:h,usdStatements:t,zwlStatements:x,onOpenStatement:o,get:i}}function w(){const{usdTotal:s,zwlTotal:d,total_pages:n,current_page:h,usdStatements:c,zwlStatements:i,onOpenStatement:o}=N();return e.jsxs("div",{children:[e.jsx("h5",{className:"bg-info text-center text-white p-2 mb-4 rounded-2",children:"CUSTOMER SUMMARY"}),e.jsxs("div",{className:"p-2 fw-bold d-flex justify-content-between align-items-center",children:[e.jsx("div",{children:"USD"}),e.jsxs("div",{children:["Date: ",new Date().toLocaleDateString()]})]}),e.jsxs("table",{className:"table table-bordered table-responsive table-sm c-fs-small",children:[e.jsxs("thead",{className:"position-sticky c-table-top c-bg-whitesmoke",children:[e.jsx("tr",{children:e.jsx("td",{colSpan:7,children:e.jsx("div",{className:"col-4 p-0 pt-1",children:e.jsx(m,{searchBy:"search",placeholder:"Search..."})})})}),e.jsxs("tr",{className:"c-thead-bg rounded-2 c-force-borders",children:[e.jsx("th",{children:e.jsx("div",{children:" Customer # "})}),e.jsx("th",{children:e.jsx("div",{children:" Customer Name "})}),e.jsx("th",{children:e.jsx("div",{children:" Address "})}),e.jsx("th",{className:"text-end",children:e.jsx("div",{children:" Rent Owing"})}),e.jsx("th",{className:"bg-white",children:e.jsx("div",{})})]})]}),e.jsx("tbody",{children:(c==null?void 0:c.length)>0&&c.map(t=>e.jsxs("tr",{children:[e.jsx("th",{children:t.id}),e.jsxs("td",{children:[t.tenant_name," "]}),e.jsx("td",{children:t.address}),e.jsx("td",{className:`text-end bg-${t.color} text-white`,style:{backgroundColor:t.color=="light-red"?"#f87171":""},children:Number(t.owing_amount)>=0?l(Number(t.owing_amount)):`(${l(Number(t.owing_amount)*-1)})`}),e.jsx("td",{className:"bg-info text-center",style:{fontWeight:"500",fontSize:"16px",color:"white",cursor:"pointer"},onClick:()=>o(t.id),children:"View"})]},t.id))}),e.jsx("tfoot",{className:"fw-bold c-fs-18",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Total"}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{className:"text-end",children:s>=0?l(s):`(${l(s*-1)})`}),e.jsx("td",{})]})})]}),e.jsxs("div",{className:"mt-5 p-2 fw-bold d-flex justify-content-between align-items-center",children:[e.jsx("div",{children:"ZWG"}),e.jsxs("div",{children:["Date: ",new Date().toLocaleDateString()]})]}),e.jsxs("table",{className:"table table-bordered table-responsive table-sm c-fs-small",children:[e.jsxs("thead",{className:"position-sticky c-table-top c-bg-whitesmoke",children:[e.jsx("tr",{children:e.jsx("td",{colSpan:7,children:e.jsx("div",{className:"col-4 p-0 pt-1",children:e.jsx(m,{searchBy:"search",placeholder:"Search..."})})})}),e.jsxs("tr",{className:"c-thead-bg rounded-2",children:[e.jsx("th",{children:"Tenant #"}),e.jsx("td",{children:"Tenant Name"}),e.jsx("td",{children:"Address"}),e.jsx("td",{className:"text-end",children:"Rent Owing"}),e.jsx("td",{className:"bg-white"})]})]}),e.jsx("tbody",{children:(i==null?void 0:i.length)>0&&i.map(t=>e.jsxs("tr",{children:[e.jsx("th",{children:t.id}),e.jsxs("td",{children:[t.tenant_name," "]}),e.jsx("td",{children:t.address}),e.jsx("td",{className:`text-end bg-${t.color} text-white`,style:{backgroundColor:t.color=="light-red"?"#f87171":""},children:Number(t.owing_amount)>=0?l(Number(t.owing_amount)):`(${l(Number(t.owing_amount)*-1)})`}),e.jsx("td",{className:"bg-info text-center",style:{fontWeight:"500",fontSize:"16px",color:"white",cursor:"pointer"},onClick:()=>o(t.id),children:"View"})]},t.id))}),e.jsx("tfoot",{className:"fw-bold c-fs-18",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Total"}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{className:"text-end",children:d>=0?l(d):`(${l(d*-1)})`}),e.jsx("td",{})]})})]}),e.jsx("div",{className:"px-3",children:e.jsx(f,{currentPage:h,totalPages:n})})]})}w.layout=s=>e.jsx(g,{children:s,title:"Customer Statements"});export{w as default};
