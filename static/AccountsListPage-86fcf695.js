import{r as m,_,j as e}from"./main-8aa072fa.js";import{C as f,L as g}from"./Layout-731ae6f9.js";import{a as v}from"./index-66c3a614.js";import"./lodash-146eb32c.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-0a02feba.js";import"./Modal-22d2e09e.js";import"./index-eb46efb6.js";import"./formatting-9de8c923.js";import"./MultipleUpload-69d0e461.js";import"./index-5db6dba1.js";import"./search-62783590.js";function y(){const[a,r]=m.useState(!1),[u,n]=m.useState(!1),[l,o]=m.useState(null),[h,b]=m.useState([]);m.useEffect(()=>{b([])},[]);const x=[...h,...v].sort((c,i)=>c.accountNumber-i.accountNumber);function s(c){c.preventDefault();const i=c.target,N=Object.fromEntries(new FormData(i)),d={};if(Object.entries(N).forEach(([A,w])=>{const[S,j]=A.split("-");d[j]||(d[j]={}),d[j][S]=w}),Object.values(d).length===0){_.error("No accounts are available to edit/were edited");return}o(),r(!0)}function t(){console.log("Update accounts",l),r(!1),o(null)}function p(c){c.preventDefault();const i=Object.fromEntries(new FormData(c.target));console.log("Add new account",i),n(!1)}return{mappableAccountsList:x,showConfirmPrompt:a,showNewAccForm:u,submittedAccs:l,setShowConfirmPrompt:r,setShowNewAccForm:n,handleAddition:p,submitUpdates:t,handleSubmit:s}}function C(){const{mappableAccountsList:a,showConfirmPrompt:r,showNewAccForm:u,submittedAccs:n,setShowConfirmPrompt:l,setShowNewAccForm:o,handleAddition:h,submitUpdates:b,handleSubmit:x}=y();return e.jsxs("div",{children:[e.jsxs(f,{show:r,handleClose:()=>l(!1),size:"md",title:"Edit Account",children:[e.jsxs("p",{className:"text-center mb-4",children:["You are about to edit ",n==null?void 0:n.length," General Ledger accounts. Click OK to accept or Exit to return to list"]}),e.jsxs("div",{className:"d-flex justify-content-center",children:[e.jsx("button",{onClick:b,className:"btn btn-info text-white me-2",children:"OK"}),e.jsx("button",{onClick:()=>l(!1),className:"btn btn-secondary",children:"Exit"})]})]}),e.jsx(f,{show:u,handleClose:()=>o(!1),size:"lg",title:"Add General Ledger Account",children:e.jsxs("form",{onSubmit:h,children:[e.jsxs("div",{className:"d-flex gap-3 align-items-center justify-content-around mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"account_name",className:"form-label",children:"Account Name"}),e.jsx("input",{type:"text",className:"form-control",id:"account_name",name:"account_name",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"account_number",className:"form-label",children:"Account Number"}),e.jsx("input",{className:"form-control",id:"account_number",name:"account_number",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"accounts_sector",className:"form-label",children:"Accounts Sector"}),e.jsx("input",{type:"text",className:"form-control",id:"accounts_sector",name:"accounts_sector",required:!0})]})]}),e.jsxs("div",{className:"text-end",children:[e.jsx("button",{type:"submit",className:"btn btn-info text-white",children:"Save"}),e.jsx("button",{type:"button",onClick:()=>o(!1),className:"btn btn-secondary ms-2",children:"Cancel"})]})]})}),e.jsxs("form",{onSubmit:x,children:[e.jsx("h5",{className:"rounded-2 bg-success text-white text-center p-1",children:"Recurring Invoices"}),e.jsx("div",{className:"text-end mb-2",children:e.jsxs("button",{type:"button",onClick:()=>o(!0),className:"btn btn-info text-white",children:[e.jsx("i",{className:"material-icons leading-icon",children:"add"}),"Add Account"]})}),e.jsxs("table",{className:"table table-responsive table-sm table-bordered",children:[e.jsx("thead",{className:"position-sticky c-table-top bg-white shadow-sm",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Account Name"}),e.jsx("th",{children:"Account Number"}),e.jsx("th",{children:"Accounts Sector"}),e.jsx("th",{children:"Sector Name"})]})}),e.jsx("tbody",{children:a.map((s,t)=>s.isEditable?e.jsxs("tr",{className:"bg-white c-pointer",children:[e.jsx("td",{children:e.jsx("input",{name:"account_name-"+t,id:"account_name-"+t,className:"form-control",defaultValue:s.accountName,placeholder:"Account Name",required:!0})}),e.jsx("td",{children:e.jsx("input",{name:"account_number-"+t,id:"account_number-"+t,className:"form-control",defaultValue:s.accountNumber,placeholder:"Account Number",required:!0})}),e.jsx("td",{children:e.jsx("input",{name:"accounts_sector-"+t,id:"accounts_sector-"+t,className:"form-control",defaultValue:s.accountsSector,placeholder:"Accounts Sector",required:!0})}),e.jsx("td",{children:e.jsx("input",{type:"text",name:"sector_name-"+t,id:"sector_name-"+t,className:"form-control",defaultValue:s.sectorName,placeholder:"Sector Name",required:!0})})]},t):e.jsxs("tr",{children:[e.jsx("td",{children:s.accountName}),e.jsx("td",{children:s.accountNumber}),e.jsx("td",{children:s.accountsSector}),e.jsx("td",{children:s.sectorName})]},t))})]}),e.jsx("div",{className:"text-end",children:e.jsx("button",{type:"submit",className:"btn btn-info text-white",children:"Update"})})]})]})}C.layout=a=>e.jsx(g,{children:a,title:"Accounts List"});export{C as default};
