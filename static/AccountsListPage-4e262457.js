import{r as a,b as w,_ as b,j as t}from"./media/main-9b13349a.js";import{C as S,L as k}from"./Layout-4dbbc259.js";import{u as x}from"./index-128beda7.js";import"./lodash-c68d99f1.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-076133b3.js";import"./Modal-dae17af9.js";import"./index-548a2c78.js";import"./formatting-fad57ba1.js";import"./MultipleUpload-62b8fca2.js";import"./search-a9081f74.js";function P(){const[r,l]=a.useState(!1),[p,m]=a.useState(!1),[i,u]=a.useState(null),[d,j]=a.useState([]),[f,N]=a.useState([]),[n,s]=a.useState(!1);function A(){s(!0),w.get("/accounting/sales-accounts/").then(e=>{const o=e.data.map(c=>({accountName:c.account_name,accountNumber:c.account_number,accountsSector:c.account_sector,sectorName:c.account_sector}));j(o),s(!1)}).catch(e=>{console.error(e),s(!1)})}const _=()=>{N([])};a.useEffect(()=>{A(),_()},[]);const y=[...f,...d].sort((e,o)=>e.accountNumber-o.accountNumber);function L(e){e.preventDefault();const o=e.target,c=Object.fromEntries(new FormData(o)),h={};Object.entries(c).forEach(([F,q])=>{const[O,g]=F.split("-");h[g]||(h[g]={}),h[g][O]=q});const E=Object.values(h);u(E),l(!0)}function v(){console.log("Update accounts",i),w.put("/accounting/sales-accounts/",i).then(e=>{console.log(e),b.success(x(e)),A()}).catch(e=>{console.error(e),b.error(x(e))}).finally(()=>{l(!1),u(null)})}function C(e){e.preventDefault();const o=Object.fromEntries(new FormData(e.target));console.log("Adding new account",o),w.post("/accounting/sales-accounts/",o).then(c=>{console.log(c),b.success(x(c)),A()}).catch(c=>{console.error(c),b.error(x(c))}).finally(()=>{m(!1)})}return{mappableAccountsList:y,showConfirmPrompt:r,showNewAccForm:p,submittedAccs:i,loading:n,setShowConfirmPrompt:l,setShowNewAccForm:m,handleAddition:C,submitUpdates:v,handleSubmit:L}}function D(){const{mappableAccountsList:r,showConfirmPrompt:l,showNewAccForm:p,submittedAccs:m,loading:i,setShowConfirmPrompt:u,setShowNewAccForm:d,handleAddition:j,submitUpdates:f,handleSubmit:N}=P();return t.jsxs("div",{children:[t.jsxs(S,{show:l,handleClose:()=>u(!1),size:"md",title:"Edit Account",children:[t.jsxs("p",{className:"text-center mb-4",children:["You are about to edit ",m?.length," General Ledger accounts. Click OK to accept or Exit to return to list"]}),t.jsxs("div",{className:"d-flex justify-content-center",children:[t.jsx("button",{onClick:f,className:"btn btn-info text-white me-2",children:"OK"}),t.jsx("button",{onClick:()=>u(!1),className:"btn btn-secondary",children:"Exit"})]})]}),t.jsx(S,{show:p,handleClose:()=>d(!1),size:"lg",title:"Add General Ledger Account",children:t.jsxs("form",{onSubmit:j,children:[t.jsxs("div",{className:"d-flex gap-3 align-items-center justify-content-around mb-4",children:[t.jsxs("div",{children:[t.jsx("label",{htmlFor:"account_name",className:"form-label",children:"Account Name"}),t.jsx("input",{type:"text",className:"form-control",id:"account_name",name:"account_name",required:!0})]}),t.jsxs("div",{children:[t.jsx("label",{htmlFor:"account_number",className:"form-label",children:"Account Number"}),t.jsx("input",{className:"form-control",id:"account_number",name:"account_number",required:!0})]}),t.jsxs("div",{children:[t.jsx("label",{htmlFor:"accounts_sector",className:"form-label",children:"Accounts Sector"}),t.jsx("input",{type:"text",className:"form-control",id:"accounts_sector",name:"accounts_sector",required:!0})]})]}),t.jsxs("div",{className:"text-end",children:[t.jsx("button",{type:"submit",className:"btn btn-info text-white",children:"Save"}),t.jsx("button",{type:"button",onClick:()=>d(!1),className:"btn btn-secondary ms-2",children:"Cancel"})]})]})}),t.jsxs("form",{onSubmit:N,children:[t.jsx("h5",{className:"rounded-2 bg-success text-white text-center p-1",children:"Accounts List"}),t.jsx("div",{className:"text-end mb-2",children:t.jsxs("button",{type:"button",onClick:()=>d(!0),className:"btn btn-info text-white",children:[t.jsx("i",{className:"material-icons leading-icon",children:"add"}),"Add Account"]})}),t.jsxs("table",{className:"table table-responsive table-sm table-bordered",children:[t.jsx("thead",{className:"position-sticky c-table-top bg-white shadow-sm",children:t.jsxs("tr",{children:[t.jsx("th",{children:"Account Name"}),t.jsx("th",{children:"Account Number"}),t.jsx("th",{children:"Accounts Sector"}),t.jsx("th",{children:"Sector Name"})]})}),t.jsx("tbody",{children:i?t.jsx("tr",{children:t.jsx("td",{colSpan:"4",className:"text-center bg-white p-5",children:t.jsx("div",{className:"spinner-border text-success",role:"status",children:t.jsx("span",{className:"visually-hidden",children:"Loading..."})})})}):r.length===0?t.jsx("tr",{children:t.jsx("td",{colSpan:"4",className:"text-center bg-white p-5",children:"Nothing to show"})}):r.map((n,s)=>n.isEditable?t.jsxs("tr",{className:"bg-white c-pointer",children:[t.jsx("td",{children:t.jsx("input",{name:"account_name-"+s,id:"account_name-"+s,className:"form-control",defaultValue:n.accountName,placeholder:"Account Name",required:!0})}),t.jsx("td",{children:t.jsx("input",{name:"account_number-"+s,id:"account_number-"+s,className:"form-control",defaultValue:n.accountNumber,placeholder:"Account Number",required:!0})}),t.jsx("td",{children:t.jsx("input",{name:"accounts_sector-"+s,id:"accounts_sector-"+s,className:"form-control",defaultValue:n.accountsSector,placeholder:"Accounts Sector",required:!0})}),t.jsx("td",{children:t.jsx("input",{type:"text",name:"sector_name-"+s,id:"sector_name-"+s,className:"form-control",defaultValue:n.sectorName,placeholder:"Sector Name",required:!0})})]},s):t.jsxs("tr",{children:[t.jsx("td",{children:n.accountName}),t.jsx("td",{children:n.accountNumber}),t.jsx("td",{children:n.accountsSector}),t.jsx("td",{children:n.sectorName})]},s))})]}),t.jsx("div",{className:"text-end",children:t.jsx("button",{type:"submit",className:"btn btn-info text-white",children:"Update"})})]})]})}D.layout=r=>t.jsx(k,{children:r,title:"Accounts List"});export{D as default};
