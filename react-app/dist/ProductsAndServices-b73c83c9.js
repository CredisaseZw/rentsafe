import{R as r,r as A,b as d,_ as m,j as e}from"./main-13c4959c.js";import{C as E}from"./ContentModal-21794ab7.js";import{L as V}from"./Layout-43e13fa9.js";import{M as k}from"./MessageModal-b0a7faf0.js";import{u as I,f as O}from"./index-be7773a3.js";import"./Modal-187d8da3.js";import"./removeClass-2ac5390d.js";import"./index-5f18d908.js";import"./lodash-b4f5a0b3.js";import"./assertThisInitialized-3be3daa4.js";import"./formatting-9de8c923.js";import"./MultipleUpload-d96a866d.js";import"./search-06c27bea.js";function U(){const[c,n]=r.useState(!1),[h,p]=r.useState(null),[j,f]=r.useState(null),[s,o]=r.useState([]),[u,x]=r.useState(!1),[g,N]=r.useState([]),[v,y]=r.useState([]);function _(){d.get("/accounting/vat-settings/").then(a=>{y(a.data)}).catch(a=>{console.error(a)})}function t(){d.get("/accounting/items/").then(a=>{o(a.data)}).catch(a=>{console.log(a)})}function l(){d.get("/accounting/sales-categories/").then(a=>{N(a.data)}).catch(a=>{console.log(a)})}A.useEffect(()=>{t(),l(),_()},[]);function w(){f(null),n(!1)}function S(){n(!0)}function C(a){a.preventDefault(),x(!0);const b=Object.fromEntries(new FormData(a.target));d.post("/accounting/items/",b).then(i=>{x(!1),console.log(i),m.success("Item added successfully"),t(),w()}).catch(i=>{x(!1),console.log(i),m.error(I(i))})}function D(a){a.preventDefault();const b=Object.fromEntries(new FormData(a.target));console.log(b),d.patch(`/accounting/items/${j.id}/`,b).then(i=>{m.success("Item updated successfully"),w(),t()}).catch(i=>{console.log(i),m.error(I(i))})}function F(){d.delete(`/accounting/items/${h.id}/`).then(()=>{m.success("Item deleted successfully"),t(),p(null)}).catch(a=>{console.log(a),m.error(I(a))})}return{items:s,loading:u,showAdd:c,categories:g,taxOptions:v,itemToEdit:j,itemToDelete:h,setItemToDelete:p,setItemToEdit:f,handleItemAddition:C,openShowAdd:S,handleClose:w,handleDelete:F,handleEdit:D}}function $({currencies:c=[]}){const{items:n,loading:h,showAdd:p,categories:j,taxOptions:f,itemToEdit:s,itemToDelete:o,setItemToDelete:u,setItemToEdit:x,handleItemAddition:g,handleDelete:N,openShowAdd:v,handleClose:y,handleEdit:_}=U();return e.jsxs("main",{children:[e.jsx(k,{show:!!o,handleClose:()=>u(null),title:"Delete Item",message:`Are you sure you want to delete ${o==null?void 0:o.name}?`,actionButtons:e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn btn-sm btn-info text-white",onClick:()=>u(null),children:"Cancel"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:N,children:"Delete"})]})}),e.jsx(E,{show:p||!!s,handleClose:y,title:s?"Edit Item":"Add Item",size:"md",children:e.jsxs("form",{className:"px-4 pb-5",onSubmit:s?_:g,children:[e.jsx("div",{className:"c-bg-light p-1 mb-3 text-center",children:"Item"}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"category",className:"form-label",children:"Item Category"}),e.jsxs("select",{className:"form-select ",id:"category",name:"category",defaultValue:s?s.category:"",children:[e.jsx("option",{value:"",disabled:!0,children:"Select one"}),j.map((t,l)=>e.jsx("option",{value:t.id,children:t.name},l))]})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"id",className:"form-label",children:"Item Id"}),e.jsx("input",{type:"text",className:"form-control",id:"item_id",name:"item_id",required:!0,defaultValue:s==null?void 0:s.id})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"name",className:"form-label",children:"Item Name"}),e.jsx("input",{type:"text",className:"form-control",id:"name",name:"name",required:!0,defaultValue:s==null?void 0:s.name})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Unit Price"}),e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsxs("div",{className:"w-50 d-flex",children:[e.jsx("label",{htmlFor:"unit_price_currency",className:"px-2 text-nowrap c-bg-light d-flex align-items-center",children:"Currency"}),e.jsxs("select",{className:"form-select rounded-0 px-1",id:"unit_price_currency",name:"unit_price_currency",required:!0,defaultValue:s?s.unit_price_currency:"",children:[e.jsx("option",{value:"",disabled:!0,children:"Select one"}),c!=null&&c.length?c.map((t,l)=>e.jsx("option",{value:t,children:t},l)):e.jsxs(e.Fragment,{children:[e.jsx("option",{value:"USD",children:"USD"}),e.jsx("option",{value:"ZIG",children:"ZIG"})]})]})]}),e.jsxs("div",{className:"w-50 d-flex",children:[e.jsx("label",{htmlFor:"price",className:"px-2 text-nowrap c-bg-light d-flex align-items-center",children:"Unit Price"}),e.jsx("input",{type:"number",className:"form-control rounded-0",id:"price",name:"price",required:!0,defaultValue:s?s.price:""})]})]})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"unit_name",className:"form-label",children:"Unit Name (optional)"}),e.jsx("input",{type:"text",className:"form-control",id:"unit_name",name:"unit_name",defaultValue:s?s.unit_name:""})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"tax_configuration",className:"form-label",children:"Tax Configuration"}),e.jsxs("select",{className:"form-select ",id:"tax_configuration",name:"tax_configuration",defaultValue:s?s.tax_configuration:"",children:[e.jsx("option",{value:"",disabled:!0,children:"Select one"}),f.map((t,l)=>e.jsxs("option",{value:t.id,children:[t.description," - ",t.rate,"%"]},l))]})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"sales_account",className:"form-label",children:"Sales Account"}),e.jsx("input",{type:"text",className:"form-control",id:"sales_account",name:"sales_account",required:!0,defaultValue:s?s.sales_account:""})]}),e.jsx("div",{className:"mt-5 text-center",children:e.jsx("button",{disabled:h,type:"submit",className:"btn btn-primary",children:h?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"d-inline-block ms-2",children:"saving.."})]}):"Save"})})]})}),e.jsxs("h5",{className:"position-relative text-center mb-2 p-2 mb-0",children:["Items",e.jsx("div",{className:"position-absolute top-0 end-0",children:e.jsxs("button",{className:"btn btn-info text-white",onClick:v,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add"]})})]}),e.jsxs("table",{className:"table table-sm table-striped border bg-white",children:[e.jsx("thead",{className:"position-sticky c-table-top text-white bg-info shadow-sm c-z-5",children:e.jsxs("tr",{className:"c-force-borders c-force-borders-white",children:[e.jsx("th",{className:"ps-3",children:e.jsx("div",{children:"Category"})}),e.jsx("th",{children:e.jsx("div",{children:"Id "})}),e.jsx("th",{children:e.jsx("div",{children:"Name "})}),e.jsx("th",{children:e.jsx("div",{children:"Unit Price "})}),e.jsx("th",{children:e.jsx("div",{children:"Date Created "})}),e.jsx("th",{children:e.jsx("div",{children:" "})})]})}),e.jsxs("tbody",{children:[!(n!=null&&n.length)&&e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-3 bg-white d-flex justify-content-center align-items-center",children:"Nothing to show"})})}),n==null?void 0:n.map((t,l)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:t.category_name}),e.jsx("td",{className:"ps-3",children:t.id}),e.jsx("td",{className:"ps-3",children:t.name}),e.jsxs("td",{className:"ps-3",children:[" ",`${t.unit_price_currency} ${t.price} / ${t.unit_name}`]}),e.jsx("td",{className:"ps-3",children:t.date_created&&O(t.date_created)}),e.jsxs("td",{className:"d-flex gap-2 justify-content-end pe-3",children:[e.jsx("button",{className:"btn btn-sm btn-info text-white",onClick:()=>x(t),children:"Edit"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:()=>u(t),children:"Delete"})]})]},l))]})]})]})}$.layout=c=>e.jsx(V,{children:c,title:"Sales Categories"});export{$ as default};
