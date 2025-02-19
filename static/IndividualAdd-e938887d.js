var q=Object.defineProperty,k=Object.defineProperties;var B=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var F=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable;var b=(i,d,r)=>d in i?q(i,d,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[d]=r,v=(i,d)=>{for(var r in d||(d={}))F.call(d,r)&&b(i,r,d[r]);if(f)for(var r of f(d))U.call(d,r)&&b(i,r,d[r]);return i},g=(i,d)=>k(i,B(d));import{r as u,a as H,j as e,b as R}from"./main-7714b93d.js";import{_ as t}from"./index-23bf4693.js";import{a as $}from"./index-fe327e9d.js";import{M as z}from"./MultipleUpload-110034b0.js";import{M as h}from"./Modal-e2ca8e53.js";import{B as G}from"./Button-f396eb0a.js";function D({show:i,handleClose:d,setAddSuccessful:r,url:y,handleSingle:w,isSingle:N,isMultiple:S,handleMultiple:C,action:j,userDetails:a,setFetchedData:T}){const[p,o]=u.useState(!1),[n,_]=u.useState(""),{data:l,setData:I,post:E,reset:A}=H({firstName:(a==null?void 0:a.firstname)||"",lastName:(a==null?void 0:a.surname)||"",identificationNumber:(a==null?void 0:a.identification_number)||"",identificationType:(a==null?void 0:a.identification_type)||"",gender:(a==null?void 0:a.gender)||"",dob:(a==null?void 0:a.dob)||"",maritalStatus:(a==null?void 0:a.marital_status)||"",address:(a==null?void 0:a.address)||"",mobileNumber:(a==null?void 0:a.mobile)||"",landLine:(a==null?void 0:a.landline)||"",emailAddress:(a==null?void 0:a.email)||"",currentEmployer:(a==null?void 0:a.employer_name)||"",jobTitle:(a==null?void 0:a.job_title)||"",dateOfemployment:(a==null?void 0:a.date_of_employment)||"",individualId:(a==null?void 0:a.id)||-1}),s=m=>I(g(v({},l),{[m.target.id]:m.target.value})),M=m=>{if(m.preventDefault(),l.identificationType==="nationalid"&&!$(l.identificationNumber)){o(!1),t.error("Invalid national id number");return}if(l.identificationType==="servicesid"){t.error("Service ID not supported yet. Please use passport or national ID");return}if(l.mobileNumber.length<10||l.mobileNumber.length>13||/\D/.test(l.mobileNumber)){t.error("Mobile number must be between 10 and 13 digits");return}if(l.emailAddress!==""&&!/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(l.emailAddress)){t.error("Please enter a valid email address");return}E(reverseUrl(y),{onStart:()=>{o(!0)},onSuccess:c=>{A(),t.success("OTP has been sent to user"),o(!1),d(),r(!0)},onError:c=>{t.error("Something went wrong! Please try again"),_(c),o(!1)}})},O=m=>{m.preventDefault();let c=reverseUrl("edit_individual_user");j==="edit-agent"&&(c=reverseUrl("edit-agent")),R.post(c,l).then(x=>{if(x.data.status==="success")t.success(x.data.message),T(L=>[...L.filter(P=>P.id!==l.individualId),{id:l.individualId,firstname:l.firstName,surname:l.lastName,identification_number:l.identificationNumber,identification_type:l.identificationType,gender:l.gender,dob:l.dob,marital_status:l.maritalStatus,address:l.address,mobile:l.mobileNumber,land_line:l.landLine,email_address:l.emailAddress,employer_name:l.currentEmployer,job_title:l.jobTitle,date_of_employment:l.dateOfemployment}]),d();else if(x.data.errors){t.error(x.data.errors);return}else t.error("Something went wrong! Please try again"),d()})};return e.jsx(e.Fragment,{children:e.jsx(h,{size:"lg",show:i,onHide:d,children:e.jsxs("div",{children:[e.jsx(h.Header,{closeButton:!0,className:"card-header bg-transparent",style:{paddingLeft:"0px"},children:e.jsxs("div",{className:"",children:[e.jsx("button",{className:`btn  btn-sm ${N?"btn-info text-white":"btn-light"}`,onClick:w,children:"Single"}),e.jsx("button",{className:`btn  btn-sm ${S?"btn-info text-white":"btn-light"}`,onClick:C,children:"Multiple"})]})}),N?e.jsxs("div",{className:"card card-raised",children:[e.jsx("div",{className:"card-header bg-info",children:e.jsxs("div",{className:`d-flex justify-content-between
                      align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:j==="create"?"Add Individual":"Edit Individual"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Personal details"}),e.jsx("div",{className:"card-text"})]})})}),e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(h.Body,{children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-md-12 my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Surname",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.lastName,onChange:s,type:"text",name:"lastName",required:!0,id:"lastName",placeholder:"Enter last name",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.lastName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["First Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.firstName,onChange:s,type:"text",name:"firstName",required:!0,id:"firstName",placeholder:"Enter first name",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.firstName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Type",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"identificationType",id:"identificationType",required:!0,onChange:s,value:l.identificationType,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"nationalid",children:"National ID"}),e.jsx("option",{value:"passport",children:"Passport"}),e.jsx("option",{value:"servicesid",children:"Service ID"})]}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.identificationType})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.identificationNumber,onChange:s,type:"text",required:!0,name:"identificationNumber",id:"identificationNumber",placeholder:"eg. 12345678K29",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.identificationNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Gender"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",onChange:s,id:"gender",name:"gender",value:l.gender,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"male",children:"Male"}),e.jsx("option",{value:"female",children:"Female"}),e.jsx("option",{value:"other",children:"Other"})]}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.gender})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date Of birth"}),e.jsx("input",{value:l.dob,onChange:s,type:"date",name:"dob",id:"dob",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.dob})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Marital Status"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"maritalStatus",onChange:s,id:"maritalStatus",value:l.maritalStatus,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"single",children:"Single"}),e.jsx("option",{value:"Married",children:"Married"}),e.jsx("option",{value:"Other",children:"Other"})]}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.maritalStatus})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{value:l.address,onChange:s,type:"text",id:"address",required:!0,name:"address",placeholder:"eg. 12 Main Road",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.address})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Mobile Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.mobileNumber,onChange:s,type:"tel",name:"mobileNumber",id:"mobileNumber",required:!0,placeholder:"eg. 263777123456",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.mobileNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Landline"}),e.jsx("input",{value:l.landLine,onChange:s,type:"tel",id:"landLine",name:"landLine",placeholder:"eg. 263 123 4567",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.landLine})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Email Address"}),e.jsx("input",{value:l.emailAddress,onChange:s,type:"email",id:"emailAddress",name:"emailAddress",placeholder:"eg. your-name@your-company.com",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.emailAddress})]})]})})}),e.jsx("div",{className:"card",children:e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Employment Details"}),e.jsx("div",{className:"card-text"})]})})})}),e.jsx("div",{className:"row mb-4 mt-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Employer"}),e.jsx("input",{value:l.currentEmployer,onChange:s,type:"text",id:"currentEmployer",name:"currentEmployer",placeholder:"eg. Your Current Company",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.currentEmployer})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Job Title"}),e.jsx("input",{value:l.jobTitle,onChange:s,type:"text",name:"jobTitle",id:"jobTitle",placeholder:"eg. Accounts Clerk",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.jobTitle})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date of Employment"}),e.jsx("input",{value:l.dateOfemployment,onChange:s,type:"date",id:"dateOfemployment",name:"dateOfemployment",className:"form-control form-control-sm"}),n&&e.jsx("div",{className:"text-danger mt-1",children:n.dateOfemployment})]})]})})})]}),e.jsx(h.Footer,{children:e.jsx(G,{className:"text-white",variant:"info",onClick:j==="create"?M:O,disabled:p,children:p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Save and Proceed"})})]})]})})]}):e.jsx(z,{type:"individual",actionType:"user"})]})})})}export{D as I};
