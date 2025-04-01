import{R as o,r as k,b as d,_ as u,j as e}from"./main-6ad02b95.js";import{C as O,L as U}from"./Layout-d5c49e97.js";import{M as $}from"./MessageModal-9244f2a8.js";import{u as C,f as q}from"./index-1bc0311a.js";import"./lodash-d85fe2b1.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-dacdd766.js";import"./Modal-470a3ffe.js";import"./index-76930fa3.js";import"./formatting-9de8c923.js";import"./MultipleUpload-84bfc35d.js";import"./search-2adab996.js";function P(){const[c,l]=o.useState(!1),[h,x]=o.useState(null),[j,p]=o.useState(null),[a,m]=o.useState([]),[g,r]=o.useState(!1),[N,v]=o.useState([]),[y,_]=o.useState([]),[S,w]=o.useState([]);function t(){d.get("/accounting/vat-settings/").then(s=>{_(s.data)}).catch(s=>{console.error(s)})}function n(){d.get("/accounting/sales-accounts/").then(s=>{w(s.data)}).catch(s=>{console.log(s)})}function f(){d.get("/accounting/items/").then(s=>{m(s.data)}).catch(s=>{console.log(s)})}function A(){d.get("/accounting/sales-categories/").then(s=>{v(s.data)}).catch(s=>{console.log(s)})}k.useEffect(()=>{f(),n(),A(),t()},[]);function I(){p(null),l(!1)}function D(){l(!0)}function F(s){s.preventDefault(),r(!0);const b=Object.fromEntries(new FormData(s.target));d.post("/accounting/items/",b).then(i=>{r(!1),console.log(i),u.success("Item added successfully"),f(),I()}).catch(i=>{r(!1),console.log(i),u.error(C(i))})}function E(s){s.preventDefault();const b=Object.fromEntries(new FormData(s.target));console.log(b),d.patch(`/accounting/items/${j.id}/`,b).then(i=>{u.success("Item updated successfully"),I(),f()}).catch(i=>{console.log(i),u.error(C(i))})}function V(){d.delete(`/accounting/items/${h.id}/`).then(()=>{u.success("Item deleted successfully"),f(),x(null)}).catch(s=>{console.log(s),u.error(C(s))})}return{items:a,loading:g,showAdd:c,categories:N,taxOptions:y,itemToEdit:j,itemToDelete:h,salesAccounts:S,setItemToDelete:x,setItemToEdit:p,handleItemAddition:F,openShowAdd:D,handleClose:I,handleDelete:V,handleEdit:E}}function T({currencies:c=[]}){const{items:l,loading:h,showAdd:x,categories:j,taxOptions:p,itemToEdit:a,itemToDelete:m,salesAccounts:g,setItemToDelete:r,setItemToEdit:N,handleItemAddition:v,handleDelete:y,openShowAdd:_,handleClose:S,handleEdit:w}=P();return e.jsxs("main",{children:[e.jsx($,{show:!!m,handleClose:()=>r(null),title:"Delete Item",message:`Are you sure you want to delete ${m==null?void 0:m.name}?`,actionButtons:e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn btn-sm btn-info text-white",onClick:()=>r(null),children:"Cancel"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:y,children:"Delete"})]})}),e.jsx(O,{show:x||!!a,handleClose:S,title:a?"Edit Item":"Add Item",size:"md",children:e.jsxs("form",{className:"px-4 pb-5",onSubmit:a?w:v,children:[e.jsx("div",{className:"c-bg-light p-1 mb-3 text-center",children:"Item"}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"category",className:"form-label",children:"Item Category"}),e.jsxs("select",{className:"form-select ",id:"category",name:"category",defaultValue:a?a.category:"",children:[e.jsx("option",{value:"",disabled:!0,children:"Select one"}),j.map((t,n)=>e.jsx("option",{value:t.id,children:t.name},n))]})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"id",className:"form-label",children:"Item Id"}),e.jsx("input",{type:"text",className:"form-control",id:"item_id",name:"item_id",required:!0,defaultValue:a==null?void 0:a.id})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"name",className:"form-label",children:"Item Name"}),e.jsx("input",{type:"text",className:"form-control",id:"name",name:"name",required:!0,defaultValue:a==null?void 0:a.name})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Unit Price"}),e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsxs("div",{className:"w-50 d-flex",children:[e.jsx("label",{htmlFor:"unit_price_currency",className:"px-2 text-nowrap c-bg-light d-flex align-items-center",children:"Currency"}),e.jsxs("select",{className:"form-select rounded-0 px-1",id:"unit_price_currency",name:"unit_price_currency",required:!0,defaultValue:a?a.unit_price_currency:"",children:[e.jsx("option",{value:"",disabled:!0,children:"Select one"}),c!=null&&c.length?c.map((t,n)=>e.jsx("option",{value:t,children:t},n)):e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"USD",children:"USD"}),e.jsx("option",{value:"ZIG",children:"ZIG"})]})]})]}),e.jsxs("div",{className:"w-50 d-flex",children:[e.jsx("label",{htmlFor:"price",className:"px-2 text-nowrap c-bg-light d-flex align-items-center",children:"Unit Price"}),e.jsx("input",{type:"number",className:"form-control rounded-0",id:"price",name:"price",required:!0,defaultValue:a?a.price:""})]})]})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"unit_name",className:"form-label",children:"Unit Name (optional)"}),e.jsx("input",{type:"text",className:"form-control",id:"unit_name",name:"unit_name",defaultValue:a?a.unit_name:""})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"tax_configuration",className:"form-label",children:"Tax Configuration"}),e.jsxs("select",{className:"form-select ",id:"tax_configuration",name:"tax_configuration",defaultValue:a?a.tax_configuration:"",children:[e.jsx("option",{value:"",disabled:!0,children:"Select one"}),p.map((t,n)=>e.jsxs("option",{value:t.id,children:[t.description," - ",t.rate,"%"]},n))]})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"sales_account",className:"form-label",children:"Sales Account"}),e.jsxs("select",{className:"form-select",id:"sales_account",name:"sales_account",required:!0,defaultValue:a?a.sales_account:"",children:[e.jsx("option",{value:"",disabled:!0,children:"Select one"}),g.map((t,n)=>e.jsx("option",{value:t.id,children:t.account_name},n))]})]}),e.jsx("div",{className:"mt-5 text-center",children:e.jsx("button",{disabled:h,type:"submit",className:"btn btn-primary",children:h?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"d-inline-block ms-2",children:"saving.."})]}):"Save"})})]})}),e.jsxs("h5",{className:"position-relative text-center mb-2 p-2 mb-0",children:["Sales Items",e.jsx("div",{className:"position-absolute top-0 end-0",children:e.jsxs("button",{className:"btn btn-info text-white",onClick:_,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add"]})})]}),e.jsxs("table",{className:"table table-sm table-striped border bg-white",children:[e.jsx("thead",{className:"position-sticky c-table-top text-white bg-info shadow-sm c-z-5",children:e.jsxs("tr",{className:"c-force-borders c-force-borders-white",children:[e.jsx("th",{className:"ps-3",children:e.jsx("div",{children:"Category"})}),e.jsx("th",{children:e.jsx("div",{children:"Id "})}),e.jsx("th",{children:e.jsx("div",{children:"Name "})}),e.jsx("th",{children:e.jsx("div",{children:"Unit Price "})}),e.jsx("th",{children:e.jsx("div",{children:"Date Created "})}),e.jsx("th",{children:e.jsx("div",{children:" "})})]})}),e.jsxs("tbody",{children:[!(l!=null&&l.length)&&e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-3 bg-white d-flex justify-content-center align-items-center",children:"Nothing to show"})})}),l==null?void 0:l.map((t,n)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:t.category_name}),e.jsx("td",{className:"ps-3",children:t.id}),e.jsx("td",{className:"ps-3",children:t.name}),e.jsxs("td",{className:"ps-3",children:[" ",`${t.unit_price_currency} ${t.price} / ${t.unit_name}`]}),e.jsx("td",{className:"ps-3",children:t.date_created&&q(t.date_created)}),e.jsxs("td",{className:"d-flex gap-2 justify-content-end pe-3",children:[e.jsx("button",{className:"btn btn-sm btn-info text-white",onClick:()=>N(t),children:"Edit"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:()=>r(t),children:"Delete"})]})]},n))]})]})]})}T.layout=c=>e.jsx(U,{children:c,title:"Sales Categories"});export{T as default};
