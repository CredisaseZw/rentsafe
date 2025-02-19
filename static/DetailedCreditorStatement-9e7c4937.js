import{r as d,j as e}from"./main-773842c3.js";import{L as c}from"./Layout-7e87a7d6.js";import{l as m}from"./lodash-52129a8b.js";import{h}from"./moment-686b5dfa.js";import{f as i}from"./formatting-345d2430.js";import{h as x}from"./html2pdf-9c92ccac.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-3d960475.js";import"./Modal-fc586ea6.js";import"./index-8bd7aac5.js";import"./index-dffc6c30.js";function f({statement:n}){var s,a;const r=d.useRef();console.log({statement:n});const l=()=>{const t=r.current;x().from(t).set({margin:1,filename:"modal-content.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()};return e.jsxs("div",{children:[e.jsxs("div",{ref:r,children:[e.jsxs("div",{style:{lineHeight:"5px",fontSize:"18px"},className:"bg-info d-flex justify-content-between align-items-center text-white p-3",children:[e.jsxs("h4",{className:"fw-bold text-white mb-4",children:[m.capitalize(n.creditor_name?n.creditor_name:"Creditor")," ","Statement - USD"]}),e.jsx("div",{children:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})})]}),e.jsxs("table",{style:{lineHeight:"5px",fontSize:"12px"},className:"table table-bordered table-responsive",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"c-thead-bg",children:[e.jsx("th",{children:"Date"}),e.jsx("td",{children:"Description"}),e.jsx("td",{children:"Ref"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Balance"})]})}),e.jsx("tbody",{children:!!((s=n.rows)!=null&&s.length)&&n.rows.map((t,o)=>e.jsxs("tr",{children:[e.jsx("th",{children:h(t.date).format("YYYY-MM-DD")}),e.jsxs("td",{children:[t.description," "]}),e.jsx("td",{children:t.ref}),e.jsx("td",{className:"text-end",children:t.amount<0?`(${i(t.amount*-1)})`:i(t.amount)}),e.jsx("td",{className:"text-end",children:t.balance<0?`(${i(t.balance*-1)})`:i(t.balance)})]},o))})]}),!((a=n.rows)!=null&&a.length)&&e.jsx("div",{className:"custom-h-4 d-flex justify-content-center align-items-center border border-2",children:"Nothing to show"})]}),e.jsxs("div",{className:"d-flex justify-content-end align-items-center gap-3 p-4",children:[e.jsx("button",{className:"btn btn-primary",disabled:!0,children:"Period request"}),e.jsx("button",{onClick:l,className:"btn btn-info text-white",children:"Print"})]})]})}f.layout=n=>e.jsx(c,{children:n,title:"Detailed Creditor Statement"});export{f as default};
