import{j as e,L as i}from"./main-7e7be1ff.js";import{S as l,P as d}from"./PaginationControls-0b3bb382.js";import{L as o}from"./Layout-8cdff5ea.js";import"./Modal-b797aa09.js";import"./removeClass-9c6784ba.js";import"./index-103b5ba2.js";import"./Button-8b072625.js";import"./assertThisInitialized-3be3daa4.js";import"./lodash-eafad207.js";import"./index-1a0fe2fd.js";import"./index-327b4224.js";function c({creditors:t,current_page:r,total_pages:n,total_items:a}){return console.log(t,r,n,a),e.jsxs("div",{children:[e.jsx("div",{className:"col-4 pb-3",children:e.jsx(l,{searchBy:"search",placeholder:"Search..."})}),e.jsx("h5",{className:"bg-info text-center text-white p-2 mb-4 rounded-2",children:"Creditor Statements"}),e.jsxs("table",{className:"table table-bordered table-responsive table-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"custom-bg-grey rounded-2",children:[e.jsx("th",{children:"Creditor ID"}),e.jsx("td",{children:"Creditor Name "}),e.jsx("td",{children:"Balance Owed"}),e.jsx("td",{})]})}),!!t.length&&e.jsx("tbody",{children:t.map((s,h)=>e.jsxs("tr",{children:[e.jsx("td",{children:s.id}),e.jsx("td",{children:s.name}),e.jsx("td",{children:s.balance_owed}),e.jsx("td",{children:e.jsx(i,{href:resolvUrl("creditor-statement",s.id),className:"btn btn-info text-white",children:"View"})})]},s.id))})]}),!t.length&&e.jsx("div",{className:"custom-h-4 d-flex justify-content-center align-items-center border border-2",children:"Nothing to show"}),e.jsx("div",{className:"px-3",children:e.jsx(d,{currentPage:1,totalPages:1})})]})}c.layout=t=>e.jsx(o,{children:t,title:"Creditor Statements"});export{c as default};
