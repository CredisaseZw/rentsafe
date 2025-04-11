import{r as d,b as f,j as e}from"./media/main-bfba9c40.js";import{h as _,L as N}from"./Layout-07e2828c.js";import"./lodash-734d596d.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-348ece4c.js";import"./Modal-07685045.js";import"./index-d481af93.js";import"./formatting-fad57ba1.js";import"./MultipleUpload-2d782191.js";import"./index-c591c0af.js";import"./search-bcc199af.js";function v(){const[l,a]=d.useState("period_selection_type_month"),[h,j]=d.useState([]),[x,r]=d.useState([]),[n,i]=d.useState(!1);function u(){i(!0),f.get("/accounting/sales-accounts/").then(s=>{const c=s.data.map(p=>({accountName:p.account_name,accountNumber:p.account_number,accountsSector:p.account_sector,sectorName:p.account_sector,isEditable:!1}));r(c),i(!1)}).catch(s=>{console.error(s),i(!1)})}d.useEffect(()=>{u()},[]);const o=d.useRef(),t=h.reduce((s,c)=>(s.debit+=c.debit||0,s.credit+=c.credit||0,s.balance+=c.balance||0,s),{debit:0,credit:0,balance:0});function m(){console.log(o.current),_().from(o.current).set({margin:1,filename:"detailed_general_ledger.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()}function b(s){s.preventDefault();const c=Object.fromEntries(new FormData(s.target));console.log(c)}return{rows:h,loading:n,tableTitle:"Account Number : Name",contentRef:o,accountsList:x,transactionTotals:t,periodSelectionType:l,setPeriodSelectionType:a,printContent:m,handleSubmit:b}}function g(){const{rows:l,loading:a,tableTitle:h,contentRef:j,accountsList:x,transactionTotals:r,periodSelectionType:n,setPeriodSelectionType:i,printContent:u,handleSubmit:o}=v();return e.jsxs("div",{children:[e.jsx("h5",{className:"bg-dark text-white p-2 text-center rounded-1 mb-3 ",children:"Detailed General Ledger"}),e.jsxs("form",{onSubmit:o,className:"mb-3",children:[e.jsxs("div",{className:"d-flex gap-5 justify-content-between align-items-end",children:[e.jsxs("div",{className:"d-flex gap-3 border border-3",children:[e.jsx("div",{className:"c-bg-light d-flex align-items-center p-1",children:"Account:"}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label d-block",children:"From"}),e.jsxs("select",{disabled:a,className:"c-form-select",name:"account_from",id:"account_from",defaultValue:"",children:[e.jsx("option",{disabled:!0,value:"",children:"Select one"}),x.map((t,m)=>e.jsx("option",{value:t.accountNumber,children:t.accountNumber},m))]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label d-block",children:"To"}),e.jsxs("select",{disabled:a,className:"c-form-select",name:"account_to",id:"account_to",defaultValue:"",children:[e.jsx("option",{disabled:!0,value:"",children:"Select one"}),x.map((t,m)=>e.jsx("option",{value:t.accountNumber,children:t.accountNumber},m))]})]})]}),e.jsxs("div",{className:"d-flex gap-3 border border-3 text-nowrap",children:[e.jsx("div",{className:"c-bg-light d-flex align-items-center p-1",children:"Period Selection:"}),e.jsxs("div",{className:"d-flex align-items-end gap-3",children:[e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"period_selection_type",id:"period_selection_type_month",value:"period_selection_type_month",checked:n==="period_selection_type_month",onChange:t=>{i(t.target.value)}}),e.jsx("label",{className:"form-check-label",children:"Month"})]}),e.jsxs("select",{disabled:n!=="period_selection_type_month",className:"c-form-select",name:"month",id:"month",defaultValue:"1",children:[e.jsx("option",{value:"1",children:"January"}),e.jsx("option",{value:"2",children:"February"}),e.jsx("option",{value:"3",children:"March"}),e.jsx("option",{value:"4",children:"April"}),e.jsx("option",{value:"5",children:"May"}),e.jsx("option",{value:"6",children:"June"}),e.jsx("option",{value:"7",children:"July"}),e.jsx("option",{value:"8",children:"August"}),e.jsx("option",{value:"9",children:"September"}),e.jsx("option",{value:"10",children:"October"}),e.jsx("option",{value:"11",children:"November"}),e.jsx("option",{value:"12",children:"December"})]})]}),e.jsxs("div",{className:"d-flex align-items-end gap-3",children:[e.jsxs("div",{className:"form-check",children:[e.jsx("input",{className:"form-check-input",type:"radio",name:"period_selection_type",id:"period_selection_type_date",value:"period_selection_type_date",checked:n==="period_selection_type_date",onChange:t=>{i(t.target.value)}}),e.jsx("label",{className:"form-check-label",children:"Date"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"From"}),e.jsx("input",{disabled:n!=="period_selection_type_date",className:"form-control form-control-sm",name:"period_selection_date_from",id:"period_selection_date_from",type:"date"})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"To"}),e.jsx("input",{disabled:n!=="period_selection_type_date",className:"form-control form-control-sm",name:"period_selection_date_to",id:"period_selection_date_to",type:"date"})]})]})]})]}),e.jsx("div",{className:"text-end p-3",children:e.jsx("button",{disabled:a,type:"submit",className:"btn btn-primary text-white",children:"fetch"})})]}),e.jsxs("div",{ref:j,children:[e.jsx("p",{className:"bg-info text-white p-1 text-center rounded-1 m-0",children:h}),e.jsxs("table",{className:"table table-bordered table-responsive table-sm bg-white",children:[e.jsx("thead",{className:"shadow-sm sticky-top c-table-top bg-white c-force-borders",children:e.jsxs("tr",{children:[e.jsx("th",{children:e.jsx("div",{children:" Date"})}),e.jsx("th",{children:e.jsx("div",{children:" Details"})}),e.jsx("th",{children:e.jsx("div",{children:" Ref."})}),e.jsx("th",{className:"text-end",children:e.jsx("div",{children:"DR"})}),e.jsx("th",{className:"text-end",children:e.jsx("div",{children:"CR"})}),e.jsx("th",{className:"text-end",children:e.jsx("div",{children:"Balance"})})]})}),e.jsx("tbody",{children:a?e.jsx("tr",{children:e.jsx("td",{colSpan:"6",className:"text-center p-5",children:"Loading..."})}):l.length===0?e.jsx("tr",{children:e.jsx("td",{colSpan:"6",className:"text-center p-5",children:"Nothing to show"})}):l.map(t=>e.jsxs("tr",{children:[e.jsx("td",{children:t.date}),e.jsx("td",{children:t.description}),e.jsx("td",{children:t.ref}),e.jsx("td",{className:"text-end",children:t.debit}),e.jsx("td",{className:"text-end",children:t.credit}),e.jsx("td",{className:"text-end",children:t.balance})]},t.id))}),e.jsx("tfoot",{children:e.jsxs("tr",{children:[e.jsx("th",{colSpan:3,className:"text-end",children:"Transaction Totals"}),e.jsx("th",{className:"text-end",children:r.credit}),e.jsx("th",{className:"text-end",children:r.debit}),e.jsx("th",{className:"text-end",children:r.balance})]})})]})]}),e.jsx("div",{className:"text-end p-3",children:e.jsx("button",{onClick:u,type:"button",className:"btn btn-info text-white",children:"Print"})})]})}g.layout=l=>e.jsx(N,{children:l,title:"Detailed general ledger"});export{g as default};
