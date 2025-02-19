var D=Object.defineProperty,C=Object.defineProperties;var B=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var j=(a,s,o)=>s in a?D(a,s,{enumerable:!0,configurable:!0,writable:!0,value:o}):a[s]=o,N=(a,s)=>{for(var o in s||(s={}))S.call(s,o)&&j(a,o,s[o]);if(b)for(var o of b(s))I.call(s,o)&&j(a,o,s[o]);return a},g=(a,s)=>C(a,B(s));import{r as f,b as R,j as e}from"./main-cecc6bb7.js";import{L as A}from"./Layout-5242a342.js";import _ from"./SearchCustomer-7b4a03b5.js";import{_ as w,I as T}from"./index-43a92dce.js";import{f as p}from"./formatting-345d2430.js";import"./lodash-a6dd6483.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-60541855.js";import"./Modal-f4f0c70d.js";import"./index-388cb073.js";function L(){const[a,s]=f.useState(O),[o,r]=f.useState(!1);function d(n,t){const{name:c,value:h}=n.target;s(v=>v.map((x,y)=>t===y?g(N({},x),{[c]:h}):x))}function m(n){return n==="individual"?reverseUrl("get_client_individual_journals"):n==="company"?reverseUrl("get_client_company_journals"):reverseUrl("get_client_individual_journals")}function u(n){n.preventDefault(),r(!0),R.post(reverseUrl("debit_journal"),{rows:a}).then(t=>{if(console.log(t),t.data.error)throw new Error(t.data.error);w.success("Journal entry(s) created successfully"),s([{id:1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}])}).catch(t=>{console.log(t),w.error(`Failed to submit data 
`+t)}),r(!1)}function i(n){s(t=>t.filter((c,h)=>h!==n))}function l(){s(n=>[...n,{id:n.length+1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}])}return{rows:a,isLoading:o,addRow:l,setRows:s,removeRow:i,handleSubmit:u,getCustomerUrl:m,handleInputChange:d}}const O=[{id:1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}];function U(){const{rows:a,isLoading:s,addRow:o,setRows:r,removeRow:d,handleSubmit:m,getCustomerUrl:u,handleInputChange:i}=L();return e.jsxs(e.Fragment,{children:[e.jsx(T,{}),e.jsxs("div",{className:"bg-white border rounded-3",children:[e.jsx("h5",{className:"text-center p-2 mb-0 text-white bg-info",children:"Debit Journal"}),e.jsxs("form",{className:"p-2",onSubmit:m,children:[e.jsxs("table",{className:"table table-responsive table-bordered table-sm",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-nowrap",children:"Date"}),e.jsx("th",{className:"text-nowrap",children:"Customer Type"}),e.jsx("th",{className:"text-nowrap",children:"Customer"}),e.jsx("th",{className:"text-nowrap",children:"Details"}),e.jsx("th",{className:"text-nowrap",children:"Account Balance"}),e.jsx("th",{className:"text-nowrap",children:"Debit Amount"}),e.jsx("th",{className:"text-nowrap",children:"End Balance"}),e.jsx("th",{className:"text-nowrap",children:"Action"})]})}),e.jsx("tbody",{children:a.map((l,n)=>e.jsxs("tr",{children:[e.jsx("td",{className:"custom-w-170",children:e.jsx("input",{className:"form-control custom-w-fit",type:"date",name:"date",required:!0,max:new Date().toISOString().split("T")[0],min:l.endDate?new Date(l.endDate).toISOString().split("T")[0]:void 0,value:l.date,onChange:t=>i(t,n)})}),e.jsx("td",{className:"custom-w-170",children:e.jsxs("select",{className:"form-select",name:"customerType",value:l.customerType,onChange:t=>i(t,n),children:[e.jsx("option",{value:"individual",children:"Individual"}),e.jsx("option",{value:"company",children:"Company"})]})}),e.jsx("td",{className:"custom-w-170 position-relative",style:{zIndex:a.length-n},children:e.jsx(_,{value:l.customerName,setValue:t=>{const c=[...a];c[n].customerName=t,r(c)},url:u(l.customerType),placeholder:"Start typing",delay:500,type:l.customerType,setCustomerName:t=>{const c=[...a];c[n].customerName=t,r(c)},setLeaseId:t=>{const c=[...a];c[n].leaseId=t,r(c)},setOpeningBalance:t=>{const c=[...a];c[n].accountBalance=t,r(c)},setEndDate:t=>{const c=[...a];c[n].endDate=t,r(c)}})}),e.jsx("td",{className:"custom-w-3",children:e.jsx("textarea",{name:"details",className:"form-control",rows:2,id:"details",value:l.details,onChange:t=>i(t,n)})}),e.jsx("td",{className:"text-end",children:l.accountBalance?p(l.accountBalance):""}),e.jsx("td",{className:"custom-w-150",children:e.jsx("input",{onChange:t=>i(t,n),className:"form-control",type:"number",id:"debitAmount",name:"debitAmount",value:l.debitAmount,required:!0})}),e.jsx("td",{className:"text-end",children:l.debitAmount?p(Number(l.accountBalance)+Number(l.debitAmount)):l.accountBalance?p(Number(l.accountBalance)):""}),e.jsx("td",{children:e.jsx("button",{type:"button",className:"btn btn-danger btn-sm",onClick:()=>d(n),disabled:a.length===1,children:"Remove"})})]},l.id))})]}),e.jsx("div",{className:"text-end p-2",children:e.jsxs("button",{type:"button",className:"btn btn-success",onClick:o,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Row"]})}),e.jsx("div",{className:"text-center mb-3",children:e.jsx("button",{type:"submit",className:"btn btn-info text-white",children:s?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"processing.."})]}):"Submit"})})]})]})]})}U.layout=a=>e.jsx(A,{children:a,title:"Customer Credit Adjustment - Debit Journal"});export{U as default};
