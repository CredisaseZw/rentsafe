import{r as j,u as b,j as e}from"./main-bff74084.js";import{h as g,C as y,L as N}from"./Layout-42393a21.js";import{l}from"./lodash-2de872b6.js";import{f as m}from"./index-d9499e15.js";import{h as w}from"./html2pdf-2cc9f6ec.js";import{f as a}from"./formatting-345d2430.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-cb0d2c55.js";import"./Modal-948b5595.js";import"./index-8b11c945.js";import"./index-b70b1f56.js";import"./MultipleUpload-6c5a4465.js";import"./search-8305c8ec.js";function P(t){const r=j.useRef(),o=()=>{const p=r.current;w().from(p).set({margin:1,filename:"modal-content.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()};console.log({statement:t});const{url:i}=b(),s=new URL(i).searchParams,n=s.get("commission_type",void 0),c=s.get("period_selection",void 0),h=s.get("year",void 0),u=s.get("month",void 0),f=s.get("start_date",void 0),x=s.get("end_date",void 0);let d="";return c==="month"?d=`${l.capitalize(v(u))} ${h}`:d=`${m(f)} to ${m(x)}`,{type:l.capitalize(n),date:d,contentRef:r,handlePrintToPdf:o}}function v(t){switch(t=Number(t),t){case 1:return"January";case 2:return"February";case 3:return"March";case 4:return"April";case 5:return"May";case 6:return"June";case 7:return"July";case 8:return"August";case 9:return"September";case 10:return"October";case 11:return"November";case 12:return"December"}}function S({statement:t}){const{type:r,date:o,contentRef:i,handlePrintToPdf:s}=P(t);return e.jsxs("div",{children:[e.jsxs("div",{ref:i,children:[e.jsxs("div",{style:{lineHeight:"5px",fontSize:"18px"},className:"bg-info d-flex justify-content-between align-items-center text-white p-3",children:[e.jsxs("h4",{className:"fw-bold text-white mb-4",children:["Commissions Statement - ",r," - USD"]}),e.jsxs("div",{children:["Period: ",e.jsxs("span",{className:"text-decoration-underline",children:[" ",o]})]})]}),e.jsxs("table",{style:{lineHeight:"5px",fontSize:"12px"},className:"table table-bordered table-responsive",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"c-thead-bg",children:[e.jsx("th",{children:"Date"}),e.jsx("td",{children:"Description"}),e.jsx("td",{children:"Ref"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Balance"})]})}),!!t.rows.length&&e.jsx("tbody",{children:t.rows.map((n,c)=>e.jsxs("tr",{children:[e.jsx("th",{children:g(n.date).format("YYYY-MM-DD")}),e.jsxs("td",{children:[n.description," "]}),e.jsx("td",{children:n.ref}),e.jsx("td",{className:"text-end",children:n.amount<0?`(${a(n.amount*-1)})`:a(n.amount)}),e.jsx("td",{className:"text-end",children:n.balance<0?`(${a(n.balance*-1)})`:a(n.balance)})]},c))})]}),!t.rows.length&&e.jsx("div",{className:"custom-h-4 d-flex justify-content-center align-items-center border border-2",children:"Nothing to show"})]}),e.jsxs("div",{className:"d-flex justify-content-end align-items-center gap-3 p-4",children:[e.jsx(y,{btnClass:"btn btn-primary",btnText:"Period request"}),e.jsx("button",{onClick:s,className:"btn btn-info text-white",children:"Print"})]})]})}S.layout=t=>e.jsx(N,{children:t,title:"Detailed Commission Statement"});export{S as default};
