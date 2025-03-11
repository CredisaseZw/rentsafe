var D=Object.defineProperty,C=Object.defineProperties;var B=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var j=(a,n,o)=>n in a?D(a,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):a[n]=o,N=(a,n)=>{for(var o in n||(n={}))S.call(n,o)&&j(a,o,n[o]);if(b)for(var o of b(n))I.call(n,o)&&j(a,o,n[o]);return a},g=(a,n)=>C(a,B(n));import{r as w,b as R,_ as f,j as e}from"./main-068d869f.js";import{L as A}from"./Layout-e59825ea.js";import _ from"./SearchCustomer-49f13605.js";import{f as p}from"./formatting-9de8c923.js";import"./lodash-f4f66215.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-62bd5a50.js";import"./Modal-e58d2605.js";import"./index-35f89fe7.js";import"./MultipleUpload-3edc427d.js";import"./index-1e0e23be.js";import"./search-05d60610.js";function T(){const[a,n]=w.useState(L),[o,r]=w.useState(!1);function d(s,t){const{name:l,value:h}=s.target;n(v=>v.map((x,y)=>t===y?g(N({},x),{[l]:h}):x))}function m(s){return s==="individual"?reverseUrl("get_client_individual_journals"):s==="company"?reverseUrl("get_client_company_journals"):reverseUrl("get_client_individual_journals")}function u(s){s.preventDefault(),r(!0),R.post(reverseUrl("debit_journal"),{rows:a}).then(t=>{if(console.log(t),t.data.error)throw new Error(t.data.error);f.success("Journal entry(s) created successfully"),n([{id:1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}])}).catch(t=>{console.log(t),f.error(`Failed to submit data 
`+t)}),r(!1)}function i(s){n(t=>t.filter((l,h)=>h!==s))}function c(){n(s=>[...s,{id:s.length+1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}])}return{rows:a,isLoading:o,addRow:c,setRows:n,removeRow:i,handleSubmit:u,getCustomerUrl:m,handleInputChange:d}}const L=[{id:1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}];function O(){const{rows:a,isLoading:n,addRow:o,setRows:r,removeRow:d,handleSubmit:m,getCustomerUrl:u,handleInputChange:i}=T();return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"bg-white border rounded-3",children:[e.jsx("h5",{className:"text-center p-2 mb-0 text-white bg-info",children:"Debit Journal"}),e.jsxs("form",{className:"p-2",onSubmit:m,children:[e.jsxs("table",{className:"table table-responsive table-bordered table-sm",children:[e.jsx("thead",{className:"position-sticky c-table-top bg-white shadow-sm c-z-5",children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-nowrap",children:"Date"}),e.jsx("th",{className:"text-nowrap",children:"Customer Type"}),e.jsx("th",{className:"text-nowrap",children:"Customer"}),e.jsx("th",{className:"text-nowrap",children:"Details"}),e.jsx("th",{className:"text-nowrap",children:"Account Balance"}),e.jsx("th",{className:"text-nowrap",children:"Debit Amount"}),e.jsx("th",{className:"text-nowrap",children:"End Balance"}),e.jsx("th",{className:"text-nowrap",children:"Action"})]})}),e.jsx("tbody",{children:a.map((c,s)=>e.jsxs("tr",{children:[e.jsx("td",{className:"custom-w-170",children:e.jsx("input",{className:"form-control custom-w-fit",type:"date",name:"date",required:!0,max:new Date().toISOString().split("T")[0],min:c.endDate?new Date(c.endDate).toISOString().split("T")[0]:void 0,value:c.date,onChange:t=>i(t,s)})}),e.jsx("td",{className:"custom-w-170",children:e.jsxs("select",{className:"form-select",name:"customerType",value:c.customerType,onChange:t=>i(t,s),children:[e.jsx("option",{value:"individual",children:"Individual"}),e.jsx("option",{value:"company",children:"Company"})]})}),e.jsx("td",{className:"custom-w-170 position-relative",style:{zIndex:a.length-s},children:e.jsx(_,{value:c.customerName,setValue:t=>{const l=[...a];l[s].customerName=t,r(l)},url:u(c.customerType),placeholder:"Start typing",delay:500,type:c.customerType,setCustomerName:t=>{const l=[...a];l[s].customerName=t,r(l)},setLeaseId:t=>{const l=[...a];l[s].leaseId=t,r(l)},setOpeningBalance:t=>{const l=[...a];l[s].accountBalance=t,r(l)},setEndDate:t=>{const l=[...a];l[s].endDate=t,r(l)}})}),e.jsx("td",{className:"custom-w-3",children:e.jsx("textarea",{name:"details",className:"form-control",rows:2,id:"details",value:c.details,onChange:t=>i(t,s)})}),e.jsx("td",{className:"text-end",children:c.accountBalance?p(c.accountBalance):""}),e.jsx("td",{className:"custom-w-150",children:e.jsx("input",{onChange:t=>i(t,s),className:"form-control",type:"number",id:"debitAmount",name:"debitAmount",value:c.debitAmount,required:!0})}),e.jsx("td",{className:"text-end",children:c.debitAmount?p(Number(c.accountBalance)+Number(c.debitAmount)):c.accountBalance?p(Number(c.accountBalance)):""}),e.jsx("td",{className:"text-center",children:e.jsx("button",{type:"button",onClick:()=>d(s),className:"btn btn-danger btn-sm",disabled:a.length===1,children:"-"})})]},c.id))})]}),e.jsx("div",{className:"text-end p-2",children:e.jsxs("button",{type:"button",className:"btn btn-success",onClick:o,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Row"]})}),e.jsx("div",{className:"text-center mb-3",children:e.jsx("button",{type:"submit",className:"btn btn-info text-white",children:n?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"processing.."})]}):"Submit"})})]})]})})}O.layout=a=>e.jsx(A,{children:a,title:"Customer Credit Adjustment - Debit Journal"});export{O as default};
