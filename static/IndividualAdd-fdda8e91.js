var q=Object.defineProperty,F=Object.defineProperties;var P=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,B=Object.prototype.propertyIsEnumerable;var b=(i,n,r)=>n in i?q(i,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):i[n]=r,v=(i,n)=>{for(var r in n||(n={}))k.call(n,r)&&b(i,r,n[r]);if(f)for(var r of f(n))B.call(n,r)&&b(i,r,n[r]);return i},g=(i,n)=>F(i,P(n));import{r as u,a as U,j as e,_ as t,b as R}from"./main-8b5daa16.js";import{a as H,u as $}from"./index-fedd7536.js";import{M as z}from"./MultipleUpload-b8fc9f1f.js";import{M as h}from"./Modal-e9148396.js";import{B as G}from"./Button-480bf2fa.js";function X({show:i,handleClose:n,url:r,handleSingle:y,isSingle:N,isMultiple:w,handleMultiple:S,action:j,userDetails:a,setFetchedData:C}){const[p,o]=u.useState(!1),[d,_]=u.useState(""),{data:l,setData:T,post:E,reset:I}=U({firstName:(a==null?void 0:a.firstname)||"",lastName:(a==null?void 0:a.surname)||"",identificationNumber:(a==null?void 0:a.identification_number)||"",identificationType:(a==null?void 0:a.identification_type)||"",gender:(a==null?void 0:a.gender)||"",dob:(a==null?void 0:a.dob)||"",maritalStatus:(a==null?void 0:a.marital_status)||"",address:(a==null?void 0:a.address)||"",mobileNumber:(a==null?void 0:a.mobile)||"",landLine:(a==null?void 0:a.landline)||"",emailAddress:(a==null?void 0:a.email)||"",currentEmployer:(a==null?void 0:a.employer_name)||"",jobTitle:(a==null?void 0:a.job_title)||"",dateOfemployment:(a==null?void 0:a.date_of_employment)||"",individualId:(a==null?void 0:a.id)||-1}),s=m=>T(g(v({},l),{[m.target.id]:m.target.value})),A=m=>{if(m.preventDefault(),l.identificationType==="nationalid"&&!H(l.identificationNumber)){o(!1),t.error("Invalid national id number");return}if(l.identificationType==="servicesid"){t.error("Service ID not supported yet. Please use passport or national ID");return}if(l.mobileNumber.length<10||l.mobileNumber.length>13||/\D/.test(l.mobileNumber)){t.error("Mobile number must be between 10 and 13 digits");return}if(l.emailAddress!==""&&!/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(l.emailAddress)){t.error("Please enter a valid email address");return}E(reverseUrl(r),{onStart:()=>{o(!0)},onSuccess:c=>{I(),t.success("individual created!"),o(!1),n()},onError:c=>{t.error("Something went wrong! Please try again"),_(c),o(!1)}})},M=m=>{m.preventDefault();let c=reverseUrl("edit_individual_user");j==="edit-agent"&&(c=reverseUrl("edit-agent")),R.post(c,l).then(x=>{if(x.data.status==="success")t.success(x.data.message),C(O=>[...O.filter(L=>L.id!==l.individualId),{id:l.individualId,firstname:l.firstName,surname:l.lastName,identification_number:l.identificationNumber,identification_type:l.identificationType,gender:l.gender,dob:l.dob,marital_status:l.maritalStatus,address:l.address,mobile:l.mobileNumber,land_line:l.landLine,email_address:l.emailAddress,employer_name:l.currentEmployer,job_title:l.jobTitle,date_of_employment:l.dateOfemployment}]),n();else if(x.data.errors){t.error($(x));return}else t.error("Something went wrong! Please try again"),n()})};return e.jsx(e.Fragment,{children:e.jsx(h,{size:"lg",show:i,onHide:n,children:e.jsxs("div",{children:[e.jsx(h.Header,{closeButton:!0,className:"card-header bg-transparent",style:{paddingLeft:"0px"},children:e.jsxs("div",{className:"",children:[e.jsx("button",{className:`btn  btn-sm ${N?"btn-info text-white":"btn-light"}`,onClick:y,children:"Single"}),e.jsx("button",{className:`btn  btn-sm ${w?"btn-info text-white":"btn-light"}`,onClick:S,children:"Multiple"})]})}),N?e.jsxs("div",{className:"card card-raised",children:[e.jsx("div",{className:"card-header bg-info",children:e.jsxs("div",{className:`d-flex justify-content-between
                      align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:j==="create"?"Add Individual":"Edit Individual"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Personal details"}),e.jsx("div",{className:"card-text"})]})})}),e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(h.Body,{children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-md-12 my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Surname",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.lastName,onChange:s,type:"text",name:"lastName",required:!0,id:"lastName",placeholder:"Enter last name",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.lastName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["First Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.firstName,onChange:s,type:"text",name:"firstName",required:!0,id:"firstName",placeholder:"Enter first name",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.firstName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Type",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"identificationType",id:"identificationType",required:!0,onChange:s,value:l.identificationType,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"nationalid",children:"National ID"}),e.jsx("option",{value:"passport",children:"Passport"}),e.jsx("option",{value:"servicesid",children:"Service ID"})]}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.identificationType})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.identificationNumber,onChange:s,type:"text",required:!0,name:"identificationNumber",id:"identificationNumber",placeholder:"eg. 12345678K29",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.identificationNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Gender"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",onChange:s,id:"gender",name:"gender",value:l.gender,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"male",children:"Male"}),e.jsx("option",{value:"female",children:"Female"}),e.jsx("option",{value:"other",children:"Other"})]}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.gender})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date Of birth"}),e.jsx("input",{value:l.dob,onChange:s,type:"date",name:"dob",id:"dob",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.dob})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Marital Status"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"maritalStatus",onChange:s,id:"maritalStatus",value:l.maritalStatus,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"single",children:"Single"}),e.jsx("option",{value:"Married",children:"Married"}),e.jsx("option",{value:"Other",children:"Other"})]}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.maritalStatus})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{value:l.address,onChange:s,type:"text",id:"address",required:!0,name:"address",placeholder:"eg. 12 Main Road",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.address})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Mobile Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.mobileNumber,onChange:s,type:"tel",name:"mobileNumber",id:"mobileNumber",required:!0,placeholder:"eg. 263777123456",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.mobileNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Landline"}),e.jsx("input",{value:l.landLine,onChange:s,type:"tel",id:"landLine",name:"landLine",placeholder:"eg. 263 123 4567",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.landLine})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Email Address"}),e.jsx("input",{value:l.emailAddress,onChange:s,type:"email",id:"emailAddress",name:"emailAddress",placeholder:"eg. your-name@your-company.com",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.emailAddress})]})]})})}),e.jsx("div",{className:"card",children:e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Employment Details"}),e.jsx("div",{className:"card-text"})]})})})}),e.jsx("div",{className:"row mb-4 mt-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Employer"}),e.jsx("input",{value:l.currentEmployer,onChange:s,type:"text",id:"currentEmployer",name:"currentEmployer",placeholder:"eg. Your Current Company",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.currentEmployer})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Job Title"}),e.jsx("input",{value:l.jobTitle,onChange:s,type:"text",name:"jobTitle",id:"jobTitle",placeholder:"eg. Accounts Clerk",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.jobTitle})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date of Employment"}),e.jsx("input",{value:l.dateOfemployment,onChange:s,type:"date",id:"dateOfemployment",name:"dateOfemployment",className:"form-control form-control-sm"}),d&&e.jsx("div",{className:"text-danger mt-1",children:d.dateOfemployment})]})]})})})]}),e.jsx(h.Footer,{children:e.jsx(G,{className:"text-white",variant:"info",onClick:j==="create"?A:M,disabled:p,children:p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Save and Proceed"})})]})]})})]}):e.jsx(z,{type:"individual",actionType:"user"})]})})})}export{X as I};
