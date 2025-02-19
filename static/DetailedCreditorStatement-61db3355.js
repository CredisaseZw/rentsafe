import{r as d,j as e}from"./main-4e07829c.js";import{h as c,L as m}from"./Layout-59b609b5.js";import{l as h}from"./lodash-dd8908eb.js";import{f as i}from"./formatting-9de8c923.js";import{h as x}from"./html2pdf-71961a7f.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-7c1fe3a0.js";import"./Modal-0dc1f6c6.js";import"./index-98b21995.js";import"./index-0ed9e0b7.js";import"./MultipleUpload-1b39b73d.js";import"./index-d97d6cb8.js";import"./search-d23c8ab9.js";function p({statement:n}){var s,a;const r=d.useRef();console.log({statement:n});const l=()=>{const t=r.current;x().from(t).set({margin:1,filename:"modal-content.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()};return e.jsxs("div",{children:[e.jsxs("div",{ref:r,children:[e.jsxs("div",{style:{lineHeight:"5px",fontSize:"18px"},className:"bg-danger d-flex justify-content-between align-items-center text-white p-3",children:[e.jsxs("h4",{className:"fw-bold text-white mb-4",children:[h.capitalize(n.creditor_name?n.creditor_name:"Creditor")," ","Statement - USD"]}),e.jsx("div",{children:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]}),e.jsxs("table",{style:{lineHeight:"5px",fontSize:"12px"},className:"table table-bordered table-responsive",children:[e.jsx("thead",{className:"position-sticky c-table-top",children:e.jsxs("tr",{className:"c-thead-bg",children:[e.jsx("th",{children:"Date"}),e.jsx("td",{children:"Description"}),e.jsx("td",{children:"Ref"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Balance"})]})}),e.jsx("tbody",{children:!!((s=n.rows)!=null&&s.length)&&n.rows.map((t,o)=>e.jsxs("tr",{children:[e.jsx("th",{children:c(t.date).format("YYYY-MM-DD")}),e.jsxs("td",{children:[t.description," "]}),e.jsx("td",{children:t.ref}),e.jsx("td",{className:"text-end",children:t.amount<0?`(${i(t.amount*-1)})`:i(t.amount)}),e.jsx("td",{className:"text-end",children:t.balance<0?`(${i(t.balance*-1)})`:i(t.balance)})]},o))})]}),!((a=n.rows)!=null&&a.length)&&e.jsx("div",{className:"custom-h-4 d-flex justify-content-center align-items-center border border-2",children:"Nothing to show"})]}),e.jsxs("div",{className:"d-flex justify-content-end align-items-center gap-3 p-4",children:[e.jsx("button",{className:"btn btn-primary",disabled:!0,children:"Period request"}),e.jsx("button",{onClick:l,className:"btn btn-info text-white",children:"Print"})]})]})}p.layout=n=>e.jsx(m,{children:n,title:"Detailed Creditor Statement"});export{p as default};
