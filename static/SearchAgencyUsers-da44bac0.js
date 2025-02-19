var Y=Object.defineProperty,Q=Object.defineProperties;var W=Object.getOwnPropertyDescriptors;var $=Object.getOwnPropertySymbols;var X=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable;var q=(i,t,d)=>t in i?Y(i,t,{enumerable:!0,configurable:!0,writable:!0,value:d}):i[t]=d,O=(i,t)=>{for(var d in t||(t={}))X.call(t,d)&&q(i,d,t[d]);if($)for(var d of $(t))Z.call(t,d)&&q(i,d,t[d]);return i},P=(i,t)=>Q(i,W(t));import{r as o,a as J,j as e,b as D,u as U}from"./main-c64924cf.js";import{_ as w,I as ee}from"./index-52a06211.js";import{D as ae}from"./DeleteUserConfirmition-d40c7160.js";import{B as se}from"./BulkIconButton-f9477283.js";import{N as ne}from"./NotFound-ff73c67e.js";import{P as le}from"./PageHeader-7fed690e.js";import{M as C}from"./Modal-d322e5c7.js";import{B as L}from"./Button-d0016f60.js";import"./removeClass-a2628836.js";import"./index-e0daf244.js";function H({show:i,handleClose:t,setAddSuccessful:d,url:V,userDetails:a,notFound:A}){const[m,h]=o.useState(!1),[s,v]=o.useState(""),{data:n,setData:g,post:F,reset:b}=J({firstName:(a==null?void 0:a.firstname)||"",lastName:(a==null?void 0:a.surname)||"",identificationNumber:(a==null?void 0:a.identification_number)||"",identificationType:(a==null?void 0:a.identification_type)||"",gender:(a==null?void 0:a.gender)||"",dob:(a==null?void 0:a.dob)||"",maritalStatus:(a==null?void 0:a.marital_status)||"",address:(a==null?void 0:a.address)||"",mobileNumber:(a==null?void 0:a.mobile)||"",landLine:(a==null?void 0:a.landline)||"",emailAddress:(a==null?void 0:a.email)||"",currentEmployer:(a==null?void 0:a.employer_name)||"",jobTitle:(a==null?void 0:a.job_title)||"",dateOfemployment:(a==null?void 0:a.date_of_employment)||"",individualId:(a==null?void 0:a.id)||-1,isAgent:(a==null?void 0:a.is_agent)||!1}),r=p=>g(P(O({},n),{[p.target.id]:p.target.value})),f=p=>{console.log("create agent.."),p.preventDefault(),F(reverseUrl(V),{onStart:()=>{h(!0)},onSuccess:N=>{b(),w.success("OTP has been sent to user"),h(!1),t(),d(!0)},onError:N=>{w.error("Something went wrong! Please try again"),v(N),h(!1)}})},y=p=>{console.log("activate agent.."),p.preventDefault(),h(!0),D.post(reverseUrl("activate-agent"),{userId:n.individualId}).then(N=>{if(h(!1),t(),d(!0),console.log("success"),console.log(N.data.status),N.data.status==="success")w.success("Agent Activated successfully");else throw new Error}).catch(N=>{console.log("error"),h(!1),w.error("Something went wrong! Please try again")})};return e.jsx(e.Fragment,{children:e.jsx(C,{size:"lg",show:i,onHide:t,children:e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx(C.Header,{closeButton:!0,className:"card-header bg-info px-4",children:e.jsxs("div",{className:`d-flex justify-content-between
                            align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:"Create Agent"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Personal details"}),e.jsx("div",{className:"card-text"})]})})}),e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(C.Body,{children:[e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Surname",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.lastName,onChange:r,type:"text",name:"lastName",required:!0,id:"lastName",placeholder:"Enter last name",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.lastName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["First Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.firstName,onChange:r,type:"text",name:"firstName",required:!0,id:"firstName",placeholder:"Enter first name",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.firstName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Type",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"identificationType",id:"identificationType",required:!0,onChange:r,value:n.identificationType,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"nationalid",children:"National ID"}),e.jsx("option",{value:"passport",children:"Passport"}),e.jsx("option",{value:"servicesid",children:"Service ID"})]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.identificationType})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.identificationNumber,onChange:r,type:"text",required:!0,name:"identificationNumber",id:"identificationNumber",placeholder:"eg. 12345678K29",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.identificationNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Gender"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",onChange:r,id:"gender",name:"gender",value:n.gender,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"male",children:"Male"}),e.jsx("option",{value:"female",children:"Female"}),e.jsx("option",{value:"other",children:"Other"})]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.gender})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date Of birth"}),e.jsx("input",{value:n.dob,onChange:r,type:"date",name:"dob",id:"dob",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.dob})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Marital Status"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"maritalStatus",onChange:r,id:"maritalStatus",value:n.maritalStatus,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"single",children:"Single"}),e.jsx("option",{value:"Married",children:"Married"}),e.jsx("option",{value:"Other",children:"Other"})]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.maritalStatus})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{value:n.address,onChange:r,type:"text",id:"address",required:!0,name:"address",placeholder:"eg. 12 Main Road",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.address})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Mobile Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.mobileNumber,onChange:r,type:"tel",name:"mobileNumber",id:"mobileNumber",required:!0,placeholder:"eg. 0777123456",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.mobileNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Landline"}),e.jsx("input",{value:n.landLine,onChange:r,type:"tel",id:"landLine",name:"landLine",placeholder:"eg. 263 123 4567",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.landLine})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Email Address"}),e.jsx("input",{value:n.emailAddress,onChange:r,type:"email",id:"emailAddress",name:"emailAddress",placeholder:"eg. your-name@your-company.com",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.emailAddress})]})]})})}),e.jsx("div",{className:"card",children:e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Employment Details"}),e.jsx("div",{className:"card-text"})]})})})}),e.jsx("div",{className:"row mb-4 mt-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Employer"}),e.jsx("input",{value:n.currentEmployer,onChange:r,type:"text",id:"currentEmployer",name:"currentEmployer",placeholder:"eg. Your Current Company",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.currentEmployer})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Job Title"}),e.jsx("input",{value:n.jobTitle,onChange:r,type:"text",name:"jobTitle",id:"jobTitle",placeholder:"eg. Accounts Clerk",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.jobTitle})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date of Employement"}),e.jsx("input",{value:n.dateOfemployment,onChange:r,type:"date",id:"dateOfemployment",name:"dateOfemployment",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.dateOfemployment})]})]})})})]}),e.jsx(C.Footer,{children:A?e.jsx(L,{className:"text-white",variant:"info",onClick:f,disabled:m,children:m?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Save and Proceed"}):e.jsx(e.Fragment,{children:n.isAgent?e.jsx(L,{className:"text-white",variant:"info",disabled:!0,children:m?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"De-activate"}):e.jsx(L,{className:"text-white",variant:"info",onClick:y,disabled:m,children:m?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Activate Agent"})})})]})]})})]})})})})}function Ne(){const[i,t]=o.useState(!1),d=()=>{t(!1),b(!1)},[V,a]=o.useState(!1),A=()=>t(!0),[m,h]=o.useState([]),[s,v]=o.useState([]),[n,g]=o.useState(!1),[F,b]=o.useState(!1),[r,f]=o.useState(!1),[y,p]=o.useState(!1),[N,u]=o.useState({}),[R,E]=o.useState(!1),[_,k]=o.useState({});U().props.Auth;const I=U().props.result,T=U().props.agents;o.useEffect(()=>{h(I==null?void 0:I.sort((l,c)=>{const x=`${l.firstname} ${l.surname}`.toUpperCase(),j=`${c.firstname} ${c.surname}`.toUpperCase();return x<j?-1:x>j?1:0})),v(T==null?void 0:T.sort((l,c)=>{const x=`${l.firstname} ${l.surname}`.toUpperCase(),j=`${c.firstname} ${c.surname}`.toUpperCase();return x<j?-1:x>j?1:0}))},[]);const{data:S,setData:z,post:G}=J({searchParam:"fullname",searchValue:""}),M=l=>{b(!0),z(P(O({},S),{[l.target.id]:l.target.value}))},K=l=>{if(l.preventDefault(),S.searchValue==="")return k({searchValue:"Please enter a search value"});G(reverseUrl("search-agents"),{onStart:()=>{g(!0),f(!1),h({}),k({}),E(!1)},onSuccess:c=>{const x=j=>JSON.stringify(j)==="{}";c.props.result.length<1&&E(!0),x(c.props.result)===!0?f(!0):h(c.props.result),g(!1)},onError:c=>{g(!1)}})};return e.jsxs("main",{children:[e.jsx(le,{title:"Agency Users"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx(ee,{position:"top-right",duration:"4000"}),e.jsx("div",{className:"row align-items-center mb-5",children:e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-5",onSubmit:K,children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Filter by Full Name/ID"}),e.jsx("input",{value:S.searchValue,onChange:M,type:"text",name:"searchValue",id:"searchValue",placeholder:"Search individual to activate",className:"form-control form-control"}),_.searchValue&&e.jsx("small",{className:"text-danger",children:_.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Select filter Parameter"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"searchParam",id:"searchParam",onChange:M,children:[e.jsx("option",{value:"fullname",children:"Full name"}),e.jsx("option",{value:"nationalid",children:"National ID"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:n,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),n?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})}),e.jsx("div",{className:"mt-4",children:e.jsx(se,{})})]})})})}),i&&e.jsx(H,{show:i,handleClose:d,setAddSuccessful:a,action:"create",url:"create-agent",notFound:!0}),r&&e.jsx(H,{show:r,handleClose:()=>{f(!1),u({})},setAddSuccessful:()=>{},setFetchedData:h,userDetails:N}),y&&e.jsx(ae,{url:"delete-agent",handleClose:()=>{p(!1),u({}),b(!1)},show:y,type:"agent",setFetchedData:h,setAllAgents:v,userId:N.id,name:N.name}),e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{backgroundColor:"#e4e4e4"},children:[e.jsx("th",{scope:"col",children:"Forenames"}),e.jsx("th",{scope:"col",children:"surname"}),e.jsx("th",{scope:"col",children:"National ID"}),e.jsx("th",{scope:"col",children:"Edit"}),e.jsx("th",{scope:"col",children:"Delete"})]}),n?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}):m&&(m==null?void 0:m.map(({id:l,firstname:c,surname:x,identification_number:j})=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:c}),e.jsx("td",{children:x}),e.jsx("td",{children:j}),l?e.jsxs(e.Fragment,{children:[e.jsx("td",{children:e.jsx("button",{type:"button",className:"btn btn-raised text-info d-flex align-items-center justify-content-center",onClick:()=>{f(!0),u(m==null?void 0:m.find(B=>B.id===l))},children:e.jsx("i",{className:"leading-icon material-icons",children:"edit"})})}),e.jsx("td",{children:e.jsx("button",{type:"button",className:"btn btn-raised text-danger d-flex align-items-center justify-content-center",onClick:()=>{p(!0),u({id:l,name:c+" "+x})},children:e.jsx("i",{className:"leading-icon material-icons",children:"delete"})})})]}):null]},l))),s&&!F&&(s==null?void 0:s.map(({id:l,firstname:c,surname:x,identification_number:j})=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:c}),e.jsx("td",{children:x}),e.jsx("td",{children:j}),l?e.jsxs(e.Fragment,{children:[e.jsx("td",{children:e.jsx("button",{type:"button",className:"btn btn-raised text-info d-flex align-items-center justify-content-center",onClick:()=>{f(!0),u(s==null?void 0:s.find(B=>B.id===l))},children:e.jsx("i",{className:"leading-icon material-icons",children:"edit"})})}),e.jsx("td",{children:e.jsx("button",{type:"button",className:"btn btn-raised text-danger d-flex align-items-center justify-content-center",onClick:()=>{p(!0),u({id:l,name:c+" "+x})},children:e.jsx("i",{className:"leading-icon material-icons",children:"delete"})})})]}):null]},l)))]})}),e.jsx("div",{className:"row justify-content-center",children:e.jsx("div",{className:"col-md-auto",children:R&&e.jsx(ne,{handleShow:A,searchValue:S.searchValue,handleCloseModal:()=>E(!1),userType:"Individual"})})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})]})}export{Ne as default};
