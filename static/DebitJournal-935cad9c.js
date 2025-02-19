var D=Object.defineProperty,C=Object.defineProperties;var B=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var j=(a,n,o)=>n in a?D(a,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):a[n]=o,N=(a,n)=>{for(var o in n||(n={}))S.call(n,o)&&j(a,o,n[o]);if(b)for(var o of b(n))I.call(n,o)&&j(a,o,n[o]);return a},g=(a,n)=>C(a,B(n));import{r as w,b as R,_ as f,j as e,I as A}from"./main-cca8b9b1.js";import{L as _}from"./Layout-9ba4bac3.js";import T from"./SearchCustomer-002c4261.js";import{f as h}from"./formatting-9de8c923.js";import"./lodash-50a00b21.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-0482583f.js";import"./Modal-33be9e73.js";import"./index-e7483ee4.js";import"./MultipleUpload-6b9cb08f.js";import"./index-28b47ae7.js";import"./search-2a1f244d.js";function O(){const[a,n]=w.useState(L),[o,i]=w.useState(!1);function d(s,t){const{name:l,value:p}=s.target;n(v=>v.map((x,y)=>t===y?g(N({},x),{[l]:p}):x))}function m(s){return s==="individual"?reverseUrl("get_client_individual_journals"):s==="company"?reverseUrl("get_client_company_journals"):reverseUrl("get_client_individual_journals")}function u(s){s.preventDefault(),i(!0),R.post(reverseUrl("debit_journal"),{rows:a}).then(t=>{if(console.log(t),t.data.error)throw new Error(t.data.error);f.success("Journal entry(s) created successfully"),n([{id:1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}])}).catch(t=>{console.log(t),f.error(`Failed to submit data 
`+t)}),i(!1)}function r(s){n(t=>t.filter((l,p)=>p!==s))}function c(){n(s=>[...s,{id:s.length+1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}])}return{rows:a,isLoading:o,addRow:c,setRows:n,removeRow:r,handleSubmit:u,getCustomerUrl:m,handleInputChange:d}}const L=[{id:1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}];function U(){const{rows:a,isLoading:n,addRow:o,setRows:i,removeRow:d,handleSubmit:m,getCustomerUrl:u,handleInputChange:r}=O();return e.jsxs(e.Fragment,{children:[e.jsx(A,{position:"top-right",toastOptions:{duration:5e3}}),e.jsxs("div",{className:"bg-white border rounded-3",children:[e.jsx("h5",{className:"text-center p-2 mb-0 text-white bg-info",children:"Debit Journal"}),e.jsxs("form",{className:"p-2",onSubmit:m,children:[e.jsxs("table",{className:"table table-responsive table-bordered table-sm",children:[e.jsx("thead",{className:"position-sticky c-table-top bg-white shadow-sm c-z-5",children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-nowrap",children:"Date"}),e.jsx("th",{className:"text-nowrap",children:"Customer Type"}),e.jsx("th",{className:"text-nowrap",children:"Customer"}),e.jsx("th",{className:"text-nowrap",children:"Details"}),e.jsx("th",{className:"text-nowrap",children:"Account Balance"}),e.jsx("th",{className:"text-nowrap",children:"Debit Amount"}),e.jsx("th",{className:"text-nowrap",children:"End Balance"}),e.jsx("th",{className:"text-nowrap",children:"Action"})]})}),e.jsx("tbody",{children:a.map((c,s)=>e.jsxs("tr",{children:[e.jsx("td",{className:"custom-w-170",children:e.jsx("input",{className:"form-control custom-w-fit",type:"date",name:"date",required:!0,max:new Date().toISOString().split("T")[0],min:c.endDate?new Date(c.endDate).toISOString().split("T")[0]:void 0,value:c.date,onChange:t=>r(t,s)})}),e.jsx("td",{className:"custom-w-170",children:e.jsxs("select",{className:"form-select",name:"customerType",value:c.customerType,onChange:t=>r(t,s),children:[e.jsx("option",{value:"individual",children:"Individual"}),e.jsx("option",{value:"company",children:"Company"})]})}),e.jsx("td",{className:"custom-w-170 position-relative",style:{zIndex:a.length-s},children:e.jsx(T,{value:c.customerName,setValue:t=>{const l=[...a];l[s].customerName=t,i(l)},url:u(c.customerType),placeholder:"Start typing",delay:500,type:c.customerType,setCustomerName:t=>{const l=[...a];l[s].customerName=t,i(l)},setLeaseId:t=>{const l=[...a];l[s].leaseId=t,i(l)},setOpeningBalance:t=>{const l=[...a];l[s].accountBalance=t,i(l)},setEndDate:t=>{const l=[...a];l[s].endDate=t,i(l)}})}),e.jsx("td",{className:"custom-w-3",children:e.jsx("textarea",{name:"details",className:"form-control",rows:2,id:"details",value:c.details,onChange:t=>r(t,s)})}),e.jsx("td",{className:"text-end",children:c.accountBalance?h(c.accountBalance):""}),e.jsx("td",{className:"custom-w-150",children:e.jsx("input",{onChange:t=>r(t,s),className:"form-control",type:"number",id:"debitAmount",name:"debitAmount",value:c.debitAmount,required:!0})}),e.jsx("td",{className:"text-end",children:c.debitAmount?h(Number(c.accountBalance)+Number(c.debitAmount)):c.accountBalance?h(Number(c.accountBalance)):""}),e.jsx("td",{className:"text-center",children:e.jsx("button",{type:"button",onClick:()=>d(s),className:"btn btn-danger btn-sm",disabled:a.length===1,children:"-"})})]},c.id))})]}),e.jsx("div",{className:"text-end p-2",children:e.jsxs("button",{type:"button",className:"btn btn-success",onClick:o,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Row"]})}),e.jsx("div",{className:"text-center mb-3",children:e.jsx("button",{type:"submit",className:"btn btn-info text-white",children:n?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"processing.."})]}):"Submit"})})]})]})]})}U.layout=a=>e.jsx(_,{children:a,title:"Customer Credit Adjustment - Debit Journal"});export{U as default};
