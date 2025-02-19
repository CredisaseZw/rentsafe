var C=(g,y,m)=>new Promise((R,c)=>{var f=l=>{try{p(m.next(l))}catch(u){c(u)}},N=l=>{try{p(m.throw(l))}catch(u){c(u)}},p=l=>l.done?R(l.value):Promise.resolve(l.value).then(f,N);p((m=m.apply(g,y)).next())});import{r as x,j as e,b as I}from"./main-40f04849.js";import{L}from"./Layout-af21419b.js";import _ from"./SearchCustomer-eedba776.js";import{f as w}from"./formatting-345d2430.js";import{I as E,_ as b}from"./index-21c89b93.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-40eb03ce.js";import"./lodash-5d2bc1a5.js";import"./Modal-ed071cf6.js";import"./index-84a5df58.js";function O(){const[g,y]=x.useState(""),[m,R]=x.useState(""),[c,f]=x.useState([]),N=()=>{const t=new Date().toISOString().split("T")[0],s=i.map(a=>{const n={};return a.date>t&&(n.date=`Row ${a.id}: Date must be earlier than today.`),a.date<new Date(a.endDate).toISOString().split("T")[0]&&(n.date=`Row ${a.id}: Date must be later than opening balance date.`),a.customerType||(n.customerType="Customer Type is required."),a.customerName||(n.customerName="Customer Name is required."),a.accountBalance||(n.accountBalance="Account Balance is required."),a.creditAmount||(n.creditAmount="Credit Amount is required."),n});return f(s),s.every(a=>Object.keys(a).length===0)},[p,l]=x.useState(!1),u=m?new Date(m).toISOString().split("T")[0]:"";console.log("endDate",u),console.log("currentDate",new Date().toISOString().split("T")[0]);const v=[{id:1,date:new Date().toISOString().split("T")[0],customerType:"",customerName:"",details:"",accountBalance:"",creditAmount:"",endBalance:"",leaseId:"",accountBalance:"",endDate:""}],[i,d]=x.useState(v),S=()=>{const t={id:i.length+1,date:new Date().toISOString().split("T")[0],customerType:"",customerName:"",details:"",accountBalance:"",endBalance:""};d([...i,t])},j=(t,s)=>{const{name:a,value:n}=t.target,h=[...i];h[s][a]=n,d(h)},D=t=>t==="individual"?reverseUrl("get_client_individual_journals"):t==="company"?reverseUrl("get_client_company_journals"):reverseUrl("get_client_individual_journals"),A=()=>C(this,null,function*(){if(!N()){b.error("Please fix the errors before submitting.");return}try{const t=yield I.post(reverseUrl("credit_journal"),{rows:i});if(t.data.status==="failed"){y([t.data.error]),b.error(t.data.error),l(!1);return}d(v),f([]),b.success("Journal entry(s) created successfully")}catch(t){console.error("Error submitting data:",t),b.error("Failed to submit data")}}),B=t=>{const s=i.filter((a,n)=>n!==t);d(s)};return e.jsxs("div",{className:"card card-raised mb-5",style:{height:"60vh",width:"100%",marginInline:"-25px",paddingRight:"30px",paddingLeft:"15px"},children:[e.jsx(E,{}),e.jsx("div",{className:"mt-2 p-1 bg-danger",children:e.jsx("h5",{className:"text-white text-center",children:"Credit Journal"})}),e.jsx("div",{className:"card-body p-4 ",style:{height:"60vh"},children:e.jsxs("div",{className:"table-responsive",style:{overflowY:"visible",height:"100%"},children:[e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderTop:"0px",fontSize:"12px"},children:[e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Date"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Customer Type"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Customer"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Details"}),e.jsx("th",{scope:"col",className:"text-end",style:{borderTop:"1px solid #e0e0e0"},children:"Account Balance"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Credit Amount"}),e.jsx("th",{scope:"col",className:"text-end",style:{borderTop:"1px solid #e0e0e0"},children:"End Balance"}),e.jsx("th",{scope:"col",className:"text-end",style:{borderTop:"1px solid #e0e0e0"},children:"Action"})]})}),e.jsx("tbody",{children:i.map((t,s)=>{var a,n,h,T;return e.jsxs("tr",{children:[e.jsxs("td",{className:"tf-borderRight tf-borderLeft",children:[e.jsx("input",{className:"form-control form-control-sm tf-borderRight tf-input",type:"date",name:"date",value:t.date,onChange:r=>j(r,s)}),((a=c[s])==null?void 0:a.date)&&e.jsx("div",{className:"text-danger mt-1",children:c[s].date})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px"},children:[e.jsxs("select",{className:"form-select form-select-sm tf-borderRight tf-input",name:"customerType",value:t.customerType,onChange:r=>j(r,s),children:[e.jsx("option",{value:"",children:"Select"}),e.jsx("option",{value:"individual",children:"I"}),e.jsx("option",{value:"company",children:"C"})]}),((n=c[s])==null?void 0:n.customerType)&&e.jsx("div",{className:"text-danger mt-1",children:c[s].customerType})]}),e.jsxs("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",position:"relative",maxWidth:"100px"},children:[e.jsx(_,{value:t.customerName,setValue:r=>{const o=[...i];o[s].customerName=r,d(o)},url:D(t.customerType),placeholder:"Start typing",delay:500,type:t.customerType,setCustomerName:r=>{const o=[...i];o[s].customerName=r,d(o)},setLeaseId:r=>{const o=[...i];o[s].leaseId=r,d(o)},setOpeningBalance:r=>{const o=[...i];o[s].accountBalance=r,d(o)},setEndDate:r=>{const o=[...i];o[s].endDate=r,d(o)}}),((h=c[s])==null?void 0:h.customerName)&&e.jsx("div",{className:"text-danger mt-1",children:c[s].customerName})]}),e.jsx("td",{className:"tf-borderRight",style:{paddingRight:"1px",paddingLeft:"1px",minWidth:"200px"},children:e.jsx("textarea",{name:"details",className:"form-control form-control-sm tf-input",rows:2,id:"details",value:t.details,onChange:r=>j(r,s)})}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:t.accountBalance?w(t.accountBalance):""}),e.jsxs("td",{className:"tf-borderRight",style:{maxWidth:"40px",paddingRight:"1px",paddingLeft:"1px"},children:[e.jsx("input",{onChange:r=>j(r,s),className:"form-control form-control-sm tf-borderRight tf-input",type:"text",id:"creditAmount",name:"creditAmount",value:t.creditAmount}),((T=c[s])==null?void 0:T.creditAmount)&&e.jsx("div",{className:"text-danger mt-1",children:c[s].creditAmount})]}),e.jsx("td",{className:"tf-borderRight text-end",style:{paddingRight:"1px",paddingLeft:"1px"},children:t.creditAmount?w(Number(t.accountBalance)-Number(t.creditAmount)):""}),e.jsx("td",{className:"tf-borderRight text-end",children:e.jsx("button",{type:"button",className:"btn btn-danger btn-sm",onClick:()=>B(s),disabled:i.length===1,children:"Remove"})})]},t.id)})})]}),e.jsx("div",{className:"d-flex justify-content-end",children:e.jsxs("button",{className:"btn btn-success btn-raised text-white",onClick:S,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Row"]})}),e.jsx("div",{className:"d-flex justify-content-center",children:e.jsx("button",{className:"btn btn-info btn-raised text-white",onClick:A,children:p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):e.jsx(e.Fragment,{children:"Submit"})})})]})})]})}O.layout=g=>e.jsx(L,{children:g,title:"Customer Credit Adjustment - Credit Journal"});export{O as default};
