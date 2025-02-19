import{j as e}from"./main-d5417f1a.js";import{L as d}from"./Layout-86248052.js";import{f as l}from"./index-fe327e9d.js";import{l as o}from"./lodash-11a87761.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-ef34bfd3.js";import"./Modal-77de5ef3.js";import"./index-47ea131b.js";import"./index-1895929e.js";function a({statement:t}){var i,n;return console.log({statement:t}),e.jsxs("div",{children:[e.jsxs("div",{className:"bg-info d-flex justify-content-between align-items-center text-white p-3",children:[e.jsxs("h4",{className:"fw-bold text-white",children:[o.capitalize(t.creditor_name?t.creditor_name:"Creditor")," ","Statement - USD"]}),e.jsx("div",{children:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]}),e.jsxs("table",{className:"table table-bordered table-responsive table-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"custom-bg-grey rounded-2",children:[e.jsx("th",{children:"Date"}),e.jsx("td",{children:"Description"}),e.jsx("td",{children:" Ref"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Balance"})]})}),!!((i=t.rows)!=null&&i.length)&&e.jsx("tbody",{children:t.rows.map((r,s)=>e.jsxs("tr",{children:[e.jsx("td",{children:l(r.date,"second")}),e.jsx("td",{children:r.description}),e.jsx("td",{children:r.ref}),e.jsx("td",{children:r.amount}),e.jsx("td",{children:r.balance})]},s))})]}),!((n=t.rows)!=null&&n.length)&&e.jsx("div",{className:"custom-h-4 d-flex justify-content-center align-items-center border border-2",children:"Nothing to show"}),e.jsxs("div",{className:"d-flex justify-content-end align-items-center gap-3 p-4",children:[e.jsx("button",{className:"btn btn-primary",children:"Period request"}),e.jsx("button",{className:"btn btn-info text-white",children:"Print"})]})]})}a.layout=t=>e.jsx(d,{children:t,title:"Detailed Creditor Statement"});export{a as default};
