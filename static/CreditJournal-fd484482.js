var C=Object.defineProperty,B=Object.defineProperties;var S=Object.getOwnPropertyDescriptors;var j=Object.getOwnPropertySymbols;var D=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var N=(a,n,l)=>n in a?C(a,n,{enumerable:!0,configurable:!0,writable:!0,value:l}):a[n]=l,b=(a,n)=>{for(var l in n||(n={}))D.call(n,l)&&N(a,l,n[l]);if(j)for(var l of j(n))I.call(n,l)&&N(a,l,n[l]);return a},g=(a,n)=>B(a,S(n));import{r as w,b as R,_ as f,j as e}from"./main-92093c4c.js";import{L as A}from"./Layout-767d347c.js";import _ from"./SearchCustomer-2ec00ba7.js";import{f as p}from"./formatting-9de8c923.js";import"./lodash-a15548bd.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-dd64b22a.js";import"./Modal-9de466f6.js";import"./index-0c7d6a02.js";import"./MultipleUpload-09b1dc47.js";import"./index-ea250f19.js";import"./search-691d1d66.js";function T(){const[a,n]=w.useState(L),[l,o]=w.useState(!1);function d(s,t){const{name:r,value:h}=s.target;n(v=>v.map((x,y)=>t===y?g(b({},x),{[r]:h}):x))}function m(s){return s==="individual"?reverseUrl("get_client_individual_journals"):s==="company"?reverseUrl("get_client_company_journals"):reverseUrl("get_client_individual_journals")}function u(s){s.preventDefault(),o(!0),R.post(reverseUrl("credit_journal"),{rows:a}).then(t=>{if(console.log(t),t.data.error)throw new Error(t.data.error);f.success("Journal entry(s) created successfully"),n([{id:1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",creditAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}])}).catch(t=>{console.log(t),f.error(`Failed to submit data 
`+t)}),o(!1)}function i(s){n(t=>t.filter((r,h)=>h!==s))}function c(){n(s=>[...s,{id:s.length+1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",endBalance:"",creditAmount:"",leaseId:"",accountBalance:"",endDate:""}])}return{rows:a,isLoading:l,addRow:c,setRows:n,removeRow:i,handleSubmit:u,getCustomerUrl:m,handleInputChange:d}}const L=[{id:1,date:new Date().toISOString().split("T")[0],customerType:"individual",customerName:"",details:"",accountBalance:"",creditAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}];function O(){const{rows:a,isLoading:n,addRow:l,setRows:o,removeRow:d,handleSubmit:m,getCustomerUrl:u,handleInputChange:i}=T();return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"bg-white border rounded-3",children:[e.jsx("h5",{className:"text-center p-2 mb-0 text-white bg-danger",children:"Credit Journal"}),e.jsxs("form",{className:"p-2",onSubmit:m,children:[e.jsxs("table",{className:"table table-responsive table-bordered table-sm",children:[e.jsx("thead",{className:"position-sticky c-table-top bg-white shadow-sm c-z-5",children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-nowrap",children:"Date"}),e.jsx("th",{className:"text-nowrap",children:"Customer Type"}),e.jsx("th",{className:"text-nowrap",children:"Customer"}),e.jsx("th",{className:"text-nowrap",children:"Details"}),e.jsx("th",{className:"text-nowrap",children:"Account Balance"}),e.jsx("th",{className:"text-nowrap",children:"Credit Amount"}),e.jsx("th",{className:"text-nowrap",children:"End Balance"}),e.jsx("th",{className:"text-nowrap",children:"Action"})]})}),e.jsx("tbody",{children:a.map((c,s)=>e.jsxs("tr",{children:[e.jsx("td",{className:"custom-w-170",children:e.jsx("input",{className:"form-control custom-w-fit",type:"date",name:"date",required:!0,max:new Date().toISOString().split("T")[0],min:c.endDate?new Date(c.endDate).toISOString().split("T")[0]:void 0,value:c.date,onChange:t=>i(t,s)})}),e.jsx("td",{className:"custom-w-170",children:e.jsxs("select",{className:"form-select",name:"customerType",value:c.customerType,onChange:t=>i(t,s),children:[e.jsx("option",{value:"individual",children:"Individual"}),e.jsx("option",{value:"company",children:"Company"})]})}),e.jsx("td",{className:"custom-w-170 position-relative",style:{zIndex:a.length-s},children:e.jsx(_,{value:c.customerName,setValue:t=>{const r=[...a];r[s].customerName=t,o(r)},url:u(c.customerType),placeholder:"Start typing",delay:500,type:c.customerType,setCustomerName:t=>{const r=[...a];r[s].customerName=t,o(r)},setLeaseId:t=>{const r=[...a];r[s].leaseId=t,o(r)},setOpeningBalance:t=>{const r=[...a];r[s].accountBalance=t,o(r)},setEndDate:t=>{const r=[...a];r[s].endDate=t,o(r)}})}),e.jsx("td",{className:"custom-w-3",children:e.jsx("textarea",{name:"details",className:"form-control",rows:2,id:"details",value:c.details,onChange:t=>i(t,s)})}),e.jsx("td",{className:"text-end",children:c.accountBalance?p(c.accountBalance):""}),e.jsx("td",{className:"custom-w-150",children:e.jsx("input",{onChange:t=>i(t,s),className:"form-control",type:"number",id:"creditAmount",name:"creditAmount",value:c.creditAmount,required:!0})}),e.jsx("td",{className:"text-end",children:c.creditAmount?p(Number(c.accountBalance)-Number(c.creditAmount)):c.accountBalance?p(Number(c.accountBalance)):""}),e.jsx("td",{className:"text-center",children:e.jsx("button",{type:"button",className:"btn btn-danger btn-sm",onClick:()=>d(s),disabled:a.length===1,children:"-"})})]},c.id))})]}),e.jsx("div",{className:"text-end p-2",children:e.jsxs("button",{type:"button",className:"btn btn-success",onClick:l,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Row"]})}),e.jsx("div",{className:"text-center mb-3",children:e.jsx("button",{type:"submit",className:"btn btn-info text-white",children:n?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"processing.."})]}):"Submit"})})]})]})})}O.layout=a=>e.jsx(A,{children:a,title:"Customer Credit Adjustment - Credit Journal"});export{O as default};
