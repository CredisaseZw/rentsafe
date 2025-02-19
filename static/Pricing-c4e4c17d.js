var f=(N,u,c)=>new Promise((m,d)=>{var l=i=>{try{n(c.next(i))}catch(o){d(o)}},h=i=>{try{n(c.throw(i))}catch(o){d(o)}},n=i=>i.done?m(i.value):Promise.resolve(i.value).then(l,h);n((c=c.apply(N,u)).next())});import{u as K,r as s,j as e,b as R}from"./main-f6e7cc39.js";import{I as Q,_ as r}from"./index-945854dc.js";import{S as X}from"./search-6d54f6a0.js";import{f as v}from"./formatting-345d2430.js";import"./lodash-488c3413.js";const ne=()=>{const{last_day_changed:N,current_usd_rate:u,client_data:c,company_charge:m,individual_charge:d}=K().props,[l,h]=s.useState(!1),[n,i]=s.useState(u||0),[o,A]=s.useState(!1),[E,_]=s.useState(!1),[p,Z]=s.useState("company"),[B,S]=s.useState(""),[b,C]=s.useState("USD"),[$,L]=s.useState(""),[z,G]=s.useState(""),[F,H]=s.useState(reverseUrl("get_searched_companies")),[x,w]=s.useState(0),[g,P]=s.useState(0),[y,D]=s.useState([]),[U,O]=s.useState(d||1),[I,V]=s.useState(m||2),[a,T]=s.useState([]);s.useEffect(()=>{D(c)},[]),s.useEffect(()=>{p==="company"&&H(reverseUrl("get_searched_companies")),p==="individual"&&H(reverseUrl("get_searched_individuals"))},[p]);const Y=()=>f(void 0,null,function*(){A(!0),r.loading("Updating...",{id:"update_rate",duration:3e3});try{const t=yield R.post(reverseUrl("update_usd_rate"),{rate:Number(n),individualPrice:Number(U),companyPrice:Number(I)});t.data.status==="success"?r.success("Rate Updated Successfully",{id:"update_rate"}):r.error(t.data.message||"Something went wrong! Please try again",{id:"update_rate"})}catch(t){r.error("Something went wrong! Please try again",{id:"update_rate"})}finally{A(!1)}}),q=()=>f(void 0,null,function*(){if(l)try{_(!0),r.loading("Updating...",{id:"update_special_pricing"});const t=yield R.post(reverseUrl("create_special_pricing"),{clientCustomer:z,currencyType:b,individualCharge:x,companyCharge:g});if(t.data.status==="success")r.success("Special Pricing Updated Successfully",{id:"update_special_pricing"}),D([...y,{id:t.data.special_pricing,client_company:z,currency_type:b,individual_charge:x,company_charge:g}]),P(0),w(0),C("USD"),S(""),h(!1),T([]);else{r.error("Something went wrong! Please try again",{id:"update_special_pricing"}),T(t.data.errors);return}}catch(t){r.error("Something went wrong! Please try again",{id:"update_special_pricing"})}finally{_(!1)}else h(!0)}),J=(t,j)=>f(void 0,null,function*(){const M=j.id;try{if(r.loading("Updating...",{id:"update_special_pricing"}),M||r.error("Data is not loaded correctly, please reload page.",{id:"update_special_pricing"}),(yield R.post(reverseUrl("delete_special_pricing"),{specialPricingId:M})).data.status==="success")r.success("Special Pricing Updated Successfully",{id:"update_special_pricing"});else{r.error("Something went wrong! Please try again",{id:"update_special_pricing"});return}const W=[...y];W.splice(t,1),D(W),r.success("Updated successifully",{id:"update_special_pricing"})}catch(k){console.log(k),r.error("Something went wrong! Please try again",{id:"update_special_pricing"})}});return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"card mt-2",style:{width:"100%",marginLeft:"-3px"},children:[e.jsx(Q,{}),e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"SUBSCRIPTION PRICING"}),e.jsx("div",{className:"card-text"})]})})}),e.jsxs("div",{className:"",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsx("div",{className:"data-table py-4",children:e.jsx("div",{className:"table-responsive rounded",children:e.jsxs("table",{className:"table table-bordered",children:[e.jsxs("tr",{className:"bg-info text-white p-4",children:[e.jsx("th",{className:"px-4 py-1",children:"Today Date"}),e.jsx("th",{className:"px-4 py-1",children:"Last Change"}),e.jsx("th",{className:"text-center w-25",children:"USD Rate"})]}),e.jsx("tbody",{children:e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsxs("td",{children:[parseInt(new Date().getDate())<10?"0"+new Date().getDate():new Date().getDate()," ","- ",new Date().toDateString().split(" ")[1]," -"," ",new Date().getFullYear()]}),e.jsx("td",{children:N}),e.jsx("td",{children:e.jsx("input",{type:"number",value:n,onChange:t=>{i(t.target.value)},className:"form-control form-control-sm"})})]})})]})})}),e.jsx("div",{className:"d-flex justify-content-center align-items-center",children:e.jsx("h6",{className:"display-6 text-center bg-info text-white px-4",style:{width:"100%"},children:"RentSafe"})}),e.jsx("div",{className:"data-table p-4",children:e.jsxs("div",{className:"table-responsive",children:[e.jsxs("table",{className:"table table-bordered",children:[e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:"Customers"}),e.jsx("th",{children:"Currency"}),e.jsx("th",{className:"text-end",children:"Individual Per Month"}),e.jsx("th",{className:"text-end",children:"Company Per Month"}),e.jsx("th",{})]}),e.jsxs("tbody",{children:[e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("td",{scope:"row",children:"All"}),e.jsx("td",{children:"USD"}),e.jsx("td",{className:"text-end w-25",children:e.jsx("input",{type:"number",value:U,onChange:t=>{O(t.target.value)},className:"form-control form-control-sm"})}),e.jsx("td",{className:"text-end w-25 ",children:e.jsx("input",{type:"number",value:I,onChange:t=>{V(t.target.value)},className:"form-control form-control-sm"})}),e.jsx("td",{})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("td",{scope:"row",children:"All"}),e.jsx("td",{children:"ZWG"}),e.jsx("td",{className:"text-end",children:v(Number(n)*U)}),e.jsx("td",{className:"text-end",children:v(Number(n)*I)})]})]})]}),e.jsx("div",{className:"d-flex justify-content-end align-items-center p-4",onClick:Y,children:e.jsx("button",{className:"btn btn-success text-white",children:o?"Updating...":"Update"})})]})}),e.jsx("div",{className:"d-flex justify-content-center align-items-center px-4 w-100  bg-info rounded-4 ",children:e.jsx("h6",{className:"display-6 text-start px-4 w-100 text-white",children:"RentSafe Special Pricing"})}),e.jsxs("div",{className:"table-responsive",children:[e.jsx("table",{className:"table table-bordered",children:e.jsx("tbody",{children:y.length>0&&y.map((t,j)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:t.client_company}),e.jsx("td",{children:t.currency_type}),e.jsx("td",{className:"text-end",children:v(t.individual_charge)}),e.jsx("td",{className:"text-end",children:v(t.company_charge)}),e.jsx("td",{className:"text-center bg-info text-white",style:{cursor:"pointer"},onClick:()=>J(j,t),children:e.jsx("i",{className:"material-icons p-0",children:"remove"})})]},j))})}),l&&e.jsxs("div",{className:"p-4",style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:"10px"},children:[e.jsxs("div",{children:[e.jsxs("select",{className:"form-select form-select-sm  flex-1","aria-label":"Default select example",value:p,onChange:t=>{Z(t.target.value),S(""),L(""),G(""),C("USD"),T([]),_(!1),w(0),P(0)},children:[e.jsx("option",{selected:!0,children:"Client Type (Default is C)"}),e.jsx("option",{value:"Individual",children:"I"}),e.jsx("option",{value:"company",children:"C"})]}),a&&a.clientType&&e.jsx("p",{className:"text-danger",children:a.clientType})]}),e.jsxs("div",{children:[e.jsx(X,{placeholder:"Type client name or ID/Reg. No.",url:F,value:B,type:p,setValue:S,setClientName:G,setClientId:L}),a&&a.clientCustomer&&e.jsx("p",{className:"text-danger",children:a.clientCustomer})]}),e.jsxs("div",{children:[e.jsxs("select",{className:"form-select form-select-sm  flex-1","aria-label":"Default select example",value:b,onChange:t=>C(t.target.value),children:[e.jsx("option",{selected:!0,children:"Currency"}),e.jsx("option",{value:"USD",children:"USD"}),e.jsx("option",{value:"ZWG",children:"ZWG"})]}),a&&a.currencyType&&e.jsx("p",{className:"text-danger",children:a.currencyType})]}),e.jsxs("div",{children:[e.jsx("input",{type:"number",className:"form-control form-control-sm flex-1",value:x>0?x:"",placeholder:"Individual Price Per Month",onChange:t=>w(t.target.value)}),a&&a.individualCharge&&e.jsx("p",{className:"text-danger",children:a.individualCharge})]}),e.jsxs("div",{children:[e.jsx("input",{type:"number",className:"form-control form-control-sm flex-1",value:g>0?g:"",placeholder:"Company Price Per Month",onChange:t=>P(t.target.value)}),a&&a.companyCharge&&e.jsx("p",{className:"text-danger",children:a.companyCharge})]})]}),e.jsx("div",{className:"d-flex justify-content-end align-items-center p-4",children:e.jsxs("button",{className:"btn btn-primary text-white",onClick:q,disabled:E,children:[!l&&e.jsx("i",{className:"material-icons",children:"add"}),E?"Adding...":l?"Submit":"Add New"]})})]})]})]})]})})};export{ne as default};
