import{r as N,a as A,j as e,_ as i,b as M}from"./media/main-bfba9c40.js";import{a as O,u as L}from"./index-c591c0af.js";import{M as q}from"./MultipleUpload-2d782191.js";import{M as o}from"./Modal-07685045.js";import{B as F}from"./Button-bf257970.js";function H({show:p,handleClose:n,url:u,handleSingle:f,isSingle:h,isMultiple:b,handleMultiple:v,action:x,userDetails:l,setFetchedData:g}){const[j,m]=N.useState(!1),[s,y]=N.useState(""),{data:a,setData:w,post:S,reset:C}=A({firstName:l?.firstname||"",lastName:l?.surname||"",identificationNumber:l?.identification_number||"",identificationType:l?.identification_type||"",gender:l?.gender||"",dob:l?.dob||"",maritalStatus:l?.marital_status||"",address:l?.address||"",mobileNumber:l?.mobile||"",landLine:l?.landline||"",emailAddress:l?.email||"",currentEmployer:l?.employer_name||"",jobTitle:l?.job_title||"",dateOfemployment:l?.date_of_employment||"",individualId:l?.id||-1}),r=d=>w({...a,[d.target.id]:d.target.value}),_=d=>{if(d.preventDefault(),a.identificationType==="nationalid"&&!O(a.identificationNumber)){m(!1),i.error("Invalid national id number");return}if(a.identificationType==="servicesid"){i.error("Service ID not supported yet. Please use passport or national ID");return}if(a.mobileNumber.length<10||a.mobileNumber.length>13||/\D/.test(a.mobileNumber)){i.error("Mobile number must be between 10 and 13 digits");return}if(a.emailAddress!==""&&!/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(a.emailAddress)){i.error("Please enter a valid email address");return}S(reverseUrl(u),{onStart:()=>{m(!0)},onSuccess:t=>{C(),i.success("individual created!"),m(!1),n()},onError:t=>{i.error("Something went wrong! Please try again"),y(t),m(!1)}})},T=d=>{d.preventDefault();let t=reverseUrl("edit_individual_user");x==="edit-agent"&&(t=reverseUrl("edit-agent")),M.post(t,a).then(c=>{if(c.data.status==="success")i.success(c.data.message),g(E=>[...E.filter(I=>I.id!==a.individualId),{id:a.individualId,firstname:a.firstName,surname:a.lastName,identification_number:a.identificationNumber,identification_type:a.identificationType,gender:a.gender,dob:a.dob,marital_status:a.maritalStatus,address:a.address,mobile:a.mobileNumber,land_line:a.landLine,email_address:a.emailAddress,employer_name:a.currentEmployer,job_title:a.jobTitle,date_of_employment:a.dateOfemployment}]),n();else if(c.data.errors){i.error(L(c));return}else i.error("Something went wrong! Please try again"),n()})};return e.jsx(e.Fragment,{children:e.jsx(o,{size:"lg",show:p,onHide:n,children:e.jsxs("div",{children:[e.jsx(o.Header,{closeButton:!0,className:"card-header bg-transparent",style:{paddingLeft:"0px"},children:e.jsxs("div",{className:"",children:[e.jsx("button",{className:`btn  btn-sm ${h?"btn-info text-white":"btn-light"}`,onClick:f,children:"Single"}),e.jsx("button",{className:`btn  btn-sm ${b?"btn-info text-white":"btn-light"}`,onClick:v,children:"Multiple"})]})}),h?e.jsxs("div",{className:"card card-raised",children:[e.jsx("div",{className:"card-header bg-info",children:e.jsxs("div",{className:`d-flex justify-content-between
                      align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:x==="create"?"Add Individual":"Edit Individual"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Personal details"}),e.jsx("div",{className:"card-text"})]})})}),e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(o.Body,{children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-md-12 my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Surname",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:a.lastName,onChange:r,type:"text",name:"lastName",required:!0,id:"lastName",placeholder:"Enter last name",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.lastName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["First Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:a.firstName,onChange:r,type:"text",name:"firstName",required:!0,id:"firstName",placeholder:"Enter first name",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.firstName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Type",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"identificationType",id:"identificationType",required:!0,onChange:r,value:a.identificationType,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"nationalid",children:"National ID"}),e.jsx("option",{value:"passport",children:"Passport"}),e.jsx("option",{value:"servicesid",children:"Service ID"})]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.identificationType})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:a.identificationNumber,onChange:r,type:"text",required:!0,name:"identificationNumber",id:"identificationNumber",placeholder:"eg. 12345678K29",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.identificationNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Gender"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",onChange:r,id:"gender",name:"gender",value:a.gender,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"male",children:"Male"}),e.jsx("option",{value:"female",children:"Female"}),e.jsx("option",{value:"other",children:"Other"})]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.gender})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date Of birth"}),e.jsx("input",{value:a.dob,onChange:r,type:"date",name:"dob",id:"dob",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.dob})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Marital Status"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"maritalStatus",onChange:r,id:"maritalStatus",value:a.maritalStatus,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"single",children:"Single"}),e.jsx("option",{value:"Married",children:"Married"}),e.jsx("option",{value:"Other",children:"Other"})]}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.maritalStatus})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{value:a.address,onChange:r,type:"text",id:"address",required:!0,name:"address",placeholder:"eg. 12 Main Road",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.address})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Mobile Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:a.mobileNumber,onChange:r,type:"tel",name:"mobileNumber",id:"mobileNumber",required:!0,placeholder:"eg. 263777123456",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.mobileNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Landline"}),e.jsx("input",{value:a.landLine,onChange:r,type:"tel",id:"landLine",name:"landLine",placeholder:"eg. 263 123 4567",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.landLine})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Email Address"}),e.jsx("input",{value:a.emailAddress,onChange:r,type:"email",id:"emailAddress",name:"emailAddress",placeholder:"eg. your-name@your-company.com",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.emailAddress})]})]})})}),e.jsx("div",{className:"card",children:e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Employment Details"}),e.jsx("div",{className:"card-text"})]})})})}),e.jsx("div",{className:"row mb-4 mt-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Employer"}),e.jsx("input",{value:a.currentEmployer,onChange:r,type:"text",id:"currentEmployer",name:"currentEmployer",placeholder:"eg. Your Current Company",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.currentEmployer})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Job Title"}),e.jsx("input",{value:a.jobTitle,onChange:r,type:"text",name:"jobTitle",id:"jobTitle",placeholder:"eg. Accounts Clerk",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.jobTitle})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date of Employment"}),e.jsx("input",{value:a.dateOfemployment,onChange:r,type:"date",id:"dateOfemployment",name:"dateOfemployment",className:"form-control form-control-sm"}),s&&e.jsx("div",{className:"text-danger mt-1",children:s.dateOfemployment})]})]})})})]}),e.jsx(o.Footer,{children:e.jsx(F,{className:"text-white",variant:"info",onClick:x==="create"?_:T,disabled:j,children:j?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Save and Proceed"})})]})]})})]}):e.jsx(q,{type:"individual",actionType:"user"})]})})})}export{H as I};
