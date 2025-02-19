var D=(g,y,m)=>new Promise((R,l)=>{var b=c=>{try{p(m.next(c))}catch(h){l(h)}},N=c=>{try{p(m.throw(c))}catch(h){l(h)}},p=c=>c.done?R(c.value):Promise.resolve(c.value).then(b,N);p((m=m.apply(g,y)).next())});import{r as u,j as e,b as I}from"./main-c64924cf.js";import{L}from"./Layout-50a8d934.js";import _ from"./SearchCustomer-f639b383.js";import{f as S}from"./formatting-345d2430.js";import{I as E,_ as j}from"./index-52a06211.js";import"./lodash-93eac82b.js";function O(){const[g,y]=u.useState(""),[m,R]=u.useState(""),[l,b]=u.useState([]),N=()=>{const t=new Date().toISOString().split("T")[0],s=i.map(a=>{const r={};return a.date>t&&(r.date=`Row ${a.id}: Date must be earlier than today.`),a.date<new Date(a.endDate).toISOString().split("T")[0]&&(r.date=`Row ${a.id}: Date must be later than opening balance date.`),a.customerType||(r.customerType="Customer Type is required."),a.customerName||(r.customerName="Customer Name is required."),a.accountBalance||(r.accountBalance="Account Balance is required."),a.debitAmount||(r.debitAmount="Debit Amount is required."),r});return b(s),s.every(a=>Object.keys(a).length===0)};u.useState("");const[p,c]=u.useState(!1),h=m?new Date(m).toISOString().split("T")[0]:"";console.log("endDate",h),console.log("currentDate",new Date().toISOString().split("T")[0]);const v=[{id:1,date:new Date().toISOString().split("T")[0],customerType:"",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""},{id:2,date:new Date().toISOString().split("T")[0],customerType:"",customerName:"",details:"",accountBalance:"",debitAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}],[i,d]=u.useState(v),w=()=>{const t={id:i.length+1,date:new Date().toISOString().split("T")[0],customerType:"",customerName:"",details:"",accountBalance:"",endBalance:""};d([...i,t])},f=(t,s)=>{const{name:a,value:r}=t.target,x=[...i];x[s][a]=r,d(x)},C=t=>t==="individual"?reverseUrl("get_client_individual_journals"):t==="company"?reverseUrl("get_client_company_journals"):reverseUrl("get_client_individual_journals"),A=()=>D(this,null,function*(){if(!N()){j.error("Please fix the errors before submitting.");return}try{const t=yield I.post(reverseUrl("debit_journal"),{rows:i});if(t.data.status==="failed"){y([t.data.error]),j.error(t.data.error),c(!1);return}d(v),b([]),j.success("Journal entry(s) created successfully")}catch(t){console.error("Error submitting data:",t),j.error("Failed to submit data")}}),B=t=>{const s=i.filter((a,r)=>r!==t);d(s)};return e.jsxs("div",{className:"card card-raised mb-5",style:{height:"60vh",width:"100%",marginInline:"-25px",paddingRight:"30px",paddingLeft:"15px"},children:[e.jsx(E,{}),e.jsx("div",{className:"p-1 bg-info mt-2",children:e.jsx("h5",{className:"text-white text-center",children:"Debit Journal"})}),e.jsx("div",{className:"card-body p-4 ",style:{height:"60vh"},children:e.jsxs("div",{className:"table-responsive",style:{overflowY:"visible",height:"100%"},children:[e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderTop:"0px",fontSize:"12px"},children:[e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Date"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Customer Type"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Customer"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Details"}),e.jsx("th",{scope:"col",className:"text-end",style:{borderTop:"1px solid #e0e0e0"},children:"Account Balance"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Debit Amount"}),e.jsx("th",{scope:"col",className:"text-end",style:{borderTop:"1px solid #e0e0e0"},children:"End Balance"}),e.jsx("th",{scope:"col",className:"text-end",style:{borderTop:"1px solid #e0e0e0"},children:"Action"})]})}),e.jsx("tbody",{children:i.map((t,s)=>{var a,r,x,T;return e.jsxs("tr",{children:[e.jsxs("td",{className:"tf-borderRight tf-borderLeft",children:[e.jsx("input",{className:"form-control form-control-sm tf-borderRight tf-input",type:"date",name:"date",value:t.date,onChange:n=>f(n,s)}),((a=l[s])==null?void 0:a.date)&&e.jsx("div",{className:"text-danger mt-1",children:l[s].date})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{className:"form-select form-select-sm tf-borderRight tf-input",name:"customerType",value:t.customerType,onChange:n=>f(n,s),children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"individual",children:"I"}),e.jsx("option",{value:"company",children:"C"})]}),((r=l[s])==null?void 0:r.customerType)&&e.jsx("div",{className:"text-danger mt-1",children:l[s].customerType})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",position:"relative",maxWidth:"100px"},children:[e.jsx(_,{value:t.customerName,setValue:n=>{const o=[...i];o[s].customerName=n,d(o)},url:C(t.customerType),placeholder:"Start typing",delay:500,type:t.customerType,setCustomerName:n=>{const o=[...i];o[s].customerName=n,d(o)},setLeaseId:n=>{const o=[...i];o[s].leaseId=n,d(o)},setOpeningBalance:n=>{const o=[...i];o[s].accountBalance=n,d(o)},setEndDate:n=>{const o=[...i];o[s].endDate=n,d(o)}}),((x=l[s])==null?void 0:x.customerName)&&e.jsx("div",{className:"text-danger mt-1",children:l[s].customerName})]}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",minWidth:"200px"},children:e.jsx("textarea",{name:"details",className:"form-control form-control-sm tf-input",rows:2,id:"details",value:t.details,onChange:n=>f(n,s)})}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:t.accountBalance?S(t.accountBalance):""}),e.jsxs("td",{className:"tf-borderRight",style:{maxWidth:"40px",paddingRight:"1px",paddingLeft:"1px"},children:[e.jsx("input",{onChange:n=>f(n,s),className:"form-control form-control-sm tf-borderRight tf-input",type:"text",id:"debitAmount",name:"debitAmount",value:t.debitAmount}),((T=l[s])==null?void 0:T.debitAmount)&&e.jsx("div",{className:"text-danger mt-1",children:l[s].debitAmount})]}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:t.debitAmount?S(Number(t.accountBalance)+Number(t.debitAmount)):""}),e.jsx("td",{className:"tf-borderRight text-end",children:e.jsx("button",{type:"button",className:"btn btn-danger btn-sm",onClick:()=>B(s),disabled:i.length===1,children:"Remove"})})]},t.id)})})]}),e.jsx("div",{className:"d-flex justify-content-end",children:e.jsxs("button",{className:"btn btn-success btn-raised text-white",onClick:w,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Row"]})}),e.jsx("div",{className:"d-flex justify-content-center",children:e.jsx("button",{className:"btn btn-info btn-raised text-white",onClick:A,children:p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):e.jsx(e.Fragment,{children:"Submit"})})})]})})]})}O.layout=g=>e.jsx(L,{children:g,title:"Customer Credit Adjustment - Debit Journal"});export{O as default};
