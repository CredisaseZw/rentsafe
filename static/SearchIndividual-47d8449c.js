import{r as n,a as Z,j as e,_ as m,b as S,u as ie,H as ae}from"./media/main-bfba9c40.js";import{N as ne}from"./NotFound-cb33e727.js";import{B as re}from"./BulkIconButton-e4340fc5.js";import{P as de}from"./PageHeader-680c202d.js";import{v as ce,a as oe}from"./index-c591c0af.js";import{M as xe}from"./MultipleUpload-2d782191.js";import{M as b}from"./Modal-07685045.js";import{B as q}from"./Button-bf257970.js";import{C as he,E as me}from"./ExternalEnquirerInputDialog-63733d91.js";import"./formatting-fad57ba1.js";import"./lodash-734d596d.js";import"./removeClass-348ece4c.js";import"./index-d481af93.js";import"./Button-b2ecca88.js";function je({show:N,handleClose:x,setAddSuccessful:w,handleSingle:s,isSingle:i,isMultiple:j,handleMultiple:A,url:z,action:y,userDetails:a,setFetchedData:v}){const[f,g]=n.useState(!1),[t,T]=n.useState(""),{data:l,setData:C,post:_,reset:R}=Z({firstName:a?.firstname||"",lastName:a?.surname||"",identificationNumber:a?.identification_number||"",identificationType:a?.identification_type||"",gender:a?.gender||"",dob:a?.dob||"",maritalStatus:a?.marital_status||"",address:a?.address||"",mobileNumber:a?.mobile||"",landLine:a?.landline||"",emailAddress:a?.email||"",currentEmployer:a?.employer_name||"",jobTitle:a?.job_title||"",dateOfemployment:a?.date_of_employment||"",individualId:a?.id||-1}),r=c=>C({...l,[c.target.id]:c.target.value}),I=c=>{if(c.preventDefault(),l.mobileNumber.length<10||l.mobileNumber.length>13||/\D/.test(l.mobileNumber)){m.error("Mobile number must be between 10 and 13 digits");return}if(l.emailAddress!==""&&!/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(l.emailAddress)){m.error("Please enter a valid email address");return}if(l.identificationType==="passport"&&!ce(l.identificationNumber)){g(!1),m.error("Invalid passport number");return}else if(l.identificationType==="nationalid"&&!oe(l.identificationNumber)){g(!1),m.error("Invalid national id number");return}if(l.identificationType==="servicesid"){m.error("Service ID not supported yet. Please use passport or national ID");return}_(reverseUrl(z),{onStart:()=>{g(!0)},onSuccess:u=>{R(),m.success("User created successfully"),g(!1),x(),w(!0)},onError:u=>{m.error("Something went wrong! Please try again"),T(u),g(!1)}})},P=c=>{c.preventDefault(),S.post(reverseUrl("edit_individual_user"),l).then(u=>{u.data.status==="success"?(m.success(u.data.message),v(k=>[...k.filter(H=>H.id!==l.individualId),{id:l.individualId,firstname:l.firstName,surname:l.lastName,identification_number:l.identificationNumber,identification_type:l.identificationType,gender:l.gender,dob:l.dob,marital_status:l.maritalStatus,address:l.address,mobile:l.mobileNumber,land_line:l.landLine,email_address:l.emailAddress,employer_name:l.currentEmployer,job_title:l.jobTitle,date_of_employment:l.dateOfemployment}]),x()):(m.error("Something went wrong! Please try again"),x())})};return e.jsx(e.Fragment,{children:e.jsx(b,{size:"lg",show:N,onHide:x,children:e.jsxs("div",{children:[e.jsx(b.Header,{closeButton:!0,className:"card-header bg-transparent",style:{paddingLeft:"0px"},children:e.jsxs("div",{className:"",children:[e.jsx("button",{className:`btn  btn-sm ${i?"btn-info text-white":"btn-light"}`,onClick:s,children:"Single"}),e.jsx("button",{className:`btn  btn-sm ${j?"btn-info text-white":"btn-light"}`,onClick:A,children:"Multiple"})]})}),i?e.jsxs("div",{className:"card card-raised",children:[e.jsx("div",{className:"card-header bg-info",children:e.jsxs("div",{className:`d-flex justify-content-between
                      align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:y==="create"?"Add Individual":"Edit Individual"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Personal details"}),e.jsx("div",{className:"card-text"})]})})}),e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(b.Body,{children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-md-12 my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Surname",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.lastName,onChange:r,type:"text",name:"lastName",required:!0,id:"lastName",placeholder:"Enter last name",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.lastName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["First Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.firstName,onChange:r,type:"text",name:"firstName",required:!0,id:"firstName",placeholder:"Enter first name",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.firstName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Type",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"identificationType",id:"identificationType",required:!0,onChange:r,value:l.identificationType,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"nationalid",children:"National ID"}),e.jsx("option",{value:"passport",children:"Passport"}),e.jsx("option",{value:"servicesid",children:"Service ID"})]}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.identificationType})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.identificationNumber,onChange:r,type:"text",required:!0,name:"identificationNumber",id:"identificationNumber",placeholder:"eg. 12345678K29",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.identificationNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Gender"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",onChange:r,id:"gender",name:"gender",value:l.gender,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"male",children:"Male"}),e.jsx("option",{value:"female",children:"Female"}),e.jsx("option",{value:"other",children:"Other"})]}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.gender})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date Of birth"}),e.jsx("input",{value:l.dob,onChange:r,type:"date",name:"dob",id:"dob",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.dob})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Marital Status"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"maritalStatus",onChange:r,id:"maritalStatus",value:l.maritalStatus,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"single",children:"Single"}),e.jsx("option",{value:"Married",children:"Married"}),e.jsx("option",{value:"Other",children:"Other"})]}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.maritalStatus})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{value:l.address,onChange:r,type:"text",id:"address",required:!0,name:"address",placeholder:"eg. 12 Main Road",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.address})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Mobile Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.mobileNumber,onChange:r,type:"tel",name:"mobileNumber",id:"mobileNumber",required:!0,maxLength:13,placeholder:"eg. 263777123456",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.mobileNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Landline"}),e.jsx("input",{value:l.landLine,onChange:r,type:"tel",id:"landLine",name:"landLine",placeholder:"eg. 263 123 4567",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.landLine})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Email Address"}),e.jsx("input",{value:l.emailAddress,onChange:r,type:"email",id:"emailAddress",name:"emailAddress",placeholder:"eg. your-name@your-company.com",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.emailAddress})]})]})})}),e.jsx("div",{className:"card",children:e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Employment Details"}),e.jsx("div",{className:"card-text"})]})})})}),e.jsx("div",{className:"row mb-4 mt-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Employer"}),e.jsx("input",{value:l.currentEmployer,onChange:r,type:"text",id:"currentEmployer",name:"currentEmployer",placeholder:"eg. Your Current Company",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.currentEmployer})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Job Title"}),e.jsx("input",{value:l.jobTitle,onChange:r,type:"text",name:"jobTitle",id:"jobTitle",placeholder:"eg. Accounts Clerk",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.jobTitle})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date of Employment"}),e.jsx("input",{value:l.dateOfemployment,onChange:r,type:"date",id:"dateOfemployment",name:"dateOfemployment",className:"form-control form-control-sm"}),t&&e.jsx("div",{className:"text-danger mt-1",children:t.dateOfemployment})]})]})})})]}),e.jsx(b.Footer,{children:e.jsx(q,{className:"text-white",variant:"info",onClick:y==="create"?I:P,disabled:f,children:f?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Save and Proceed"})})]})]})})]}):e.jsx(xe,{type:"individual",actionType:"user"})]})})})}function pe({showReport:N,handleCloseReport:x,selectedRow:w,reportData:s}){return e.jsx(e.Fragment,{children:e.jsxs(b,{show:N,onHide:x,fullscreen:!0,children:[e.jsx(b.Body,{children:e.jsxs("div",{style:{border:"3px solid #176987",width:"100%",padding:"20px"},children:[e.jsxs("div",{class:"d-flex justify-content-between",children:[e.jsx("div",{children:"CrediSafe"}),e.jsxs("div",{class:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{})]}),e.jsxs("div",{style:{lineHeight:"10px"},children:[e.jsx("p",{style:{textAlign:"right"},children:"+263 71 882 2460"}),e.jsx("p",{style:{textAlign:"right"},children:"credisafezw@gmail.com"}),e.jsx("p",{style:{textAlign:"right"},children:" www.credi-safe.com"})]})]})]}),e.jsx("div",{className:"mt-5 mb-2",children:e.jsxs("h6",{children:["Payment Risk Report on"," ",e.jsxs("span",{style:{fontWeight:"bold",color:"#176987"},children:[s?.individual_details?.firstname," ",s?.individual_details?.surname," "]}),"as at ",Date().toLocaleString()]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"5px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"RISK CLASSIFICATION / INDICATOR"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsxs("th",{style:{backgroundColor:s?.risk_data?.class=="low"?s?.risk_data?.color:"",color:s?.risk_data?.class=="low"?"white":""},scope:"row",className:"text-center",children:["Low Risk[",s?.risk_data?.class=="low"?s?.risk_data?.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:s?.risk_data?.class=="medium"?s?.risk_data?.color:"",color:s?.risk_data?.class=="medium"?"white":""},className:"text-center",children:["Medium Risk[",s?.risk_data?.class=="medium"?s?.risk_data?.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:s?.risk_data?.class=="high"?"#f87171":"",color:s?.risk_data?.class=="high"?"white":""},className:"text-center",children:["High Risk[",s?.risk_data?.class=="high"?s?.risk_data?.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:s?.risk_data?.class=="high-high"?s?.risk_data?.color:"",color:s?.risk_data?.class=="high-high"?"white":""},className:"text-center",children:["High-High Risk[",s?.risk_data?.class=="high-high"?s?.risk_data?.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:s?.risk_data?.class=="non-payer"?s?.risk_data?.color:"",color:s?.risk_data?.class=="non-payer"?"white":""},className:"text-center",children:["None Payer[",s?.risk_data?.class=="non-payer"?s?.risk_data?.score:"","]"]})]})]})})})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center text-white",children:"PERSONAL DETAILS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Identification Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Surname :"}),e.jsx("td",{children:s?.individual_details?.surname}),e.jsx("td",{children:"First Name :"}),e.jsx("td",{children:s?.individual_details?.firstname})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"National ID No:"}),e.jsx("td",{children:s?.individual_details?.national_id}),e.jsx("td",{children:"Date Of Birth:"}),e.jsx("td",{children:s?.individual_details?.dob})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Marital Status :"}),e.jsx("td",{}),e.jsx("td",{children:"Gender:"}),e.jsx("td",{children:s?.individual_details?.gender})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center ",children:"Contact Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Mobile Number :"}),e.jsx("td",{children:s?.individual_details?.mobile}),e.jsx("td",{children:"Telephone No:"}),e.jsx("td",{children:s?.individual_details?.landline})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Address :"}),e.jsx("td",{colSpan:3,children:s?.individual_details?.address})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Email :"}),e.jsx("td",{colSpan:3,children:s?.individual_details?.email})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center ",children:"Employment History"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Employer"}),e.jsx("td",{className:"text-center",children:"Position"}),e.jsx("td",{className:"text-center",children:"Start Date"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center",children:s?.individual_details?.employer_name}),e.jsx("td",{className:"text-center",children:s?.individual_details?.job_title}),e.jsx("td",{className:"text-center",children:s?.individual_details?.date_of_employment})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"CREDIT ACCOUNTS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center",children:"Active Credit Accounts"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Credit Type"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Start Date"}),e.jsx("td",{children:"End Date"}),e.jsx("td",{children:"Principal Amount"}),e.jsx("td",{children:"Instalment Amount"}),e.jsx("td",{children:"Overdue Amount"})]}),s?.credit_details?.map(i=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:i.credit_type}),e.jsx("td",{children:i.currency}),e.jsxs("td",{children:[" ",i.start_date]}),e.jsxs("td",{children:[" ",i.end_date]}),e.jsxs("td",{children:[" ",i.principal_amount]}),e.jsxs("td",{children:[" ",i.instalment_amount]}),e.jsxs("td",{children:[" ",i.overdue_amount]})]},i.lease_id))]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Hire Purchase Information"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Credit Type"}),e.jsx("td",{className:"text-center",children:"Make"}),e.jsx("td",{className:"text-center",children:"Model"}),e.jsx("td",{className:"text-center",children:"Reg No. /Serial No."}),e.jsx("td",{className:"text-center",children:"Chassis No."}),e.jsx("td",{className:"text-center",children:"Engin No."}),e.jsx("td",{className:"text-center",children:"Start Date"}),e.jsx("td",{className:"text-center",children:"End Date"}),e.jsx("td",{className:"text-center",children:"Balance"}),e.jsx("td",{className:"text-center",children:"Overdue Amount"})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Historic Credit Accounts"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",colSpan:2,children:"Credit Type"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Start Date"}),e.jsx("td",{className:"text-center",children:"End Date"}),e.jsx("td",{className:"text-center",children:"Principal Amount"}),e.jsx("td",{className:"text-center",children:"Instalment Amount"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"ADVERSE RECORDS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Claims"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Claimant"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Date of Claim "})]}),s?.claims_list?.length>0&&s?.claims_list?.map((i,j)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:i.creditor}),e.jsx("td",{children:i.currency}),e.jsx("td",{children:i.owing_amount}),e.jsx("td",{children:i.claim_date})]},"claim"+j))]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Absconder"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Creditor"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Amount"})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Court Judgements"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",colSpan:2,children:"Court"}),e.jsx("td",{className:"text-center",children:"Plaintiff"}),e.jsx("td",{className:"text-center",children:"Case No"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Amount"}),e.jsx("td",{className:"text-center",children:"Judgement Date"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"ENQUIRIES"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Company"}),e.jsx("td",{children:"Enquirer"}),e.jsx("td",{children:"Date Of Enquiry"})]}),s?.external_enquiry_details_list?.length>0&&e.jsx(e.Fragment,{children:s?.external_enquiry_details_list?.map((i,j)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:i.company_name}),e.jsx("td",{className:"text-center",children:i.enquirer}),e.jsx("td",{className:"text-center",children:i.enquiry_date})]},j))})]})}),s?.is_internal&&e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Internal"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Enquirer"}),e.jsx("td",{className:"text-center",children:"Enquiry Date"})]}),s?.internal_enquiry_details_list?.length>0&&e.jsx(e.Fragment,{children:s?.internal_enquiry_details_list?.map((i,j)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:i.enquirer}),e.jsx("td",{className:"text-center",children:i.enquiry_date})]},j))})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"PUBLIC INFORMATION"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Record Date"}),e.jsx("td",{children:"Source"}),e.jsx("td",{children:"Summary"}),e.jsx("td",{children:"Link "})]})]})})})}),e.jsx("div",{style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsx("tbody",{children:e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"AS KEY PERSON IN COMPANIES"})})})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Directorships"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Company"}),e.jsx("td",{className:"text-center",children:"Year Of Appointment"})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Executive"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Position"}),e.jsx("td",{className:"text-center",children:"Company"}),e.jsx("td",{className:"text-center",children:"Year Of Appointment"})]})]})})]})}),e.jsxs("div",{style:{width:"100%",padding:"2px"},children:[e.jsx("hr",{}),e.jsxs("div",{children:[e.jsx("p",{children:"Disclaimer: This report is confidential and intended solely for the individual or entity to whom it is addressed. Information on this report is valid at the time of enquiry only. If verification is required, please contact us on the details provided above."}),e.jsx("p",{children:"Terms and Conditions apply."}),e.jsx("p",{children:"Copyrights © CrediSafe Zimbabwe"}),e.jsx("p",{children:"All rights reserved"})]})]})]})}),e.jsxs(b.Footer,{children:[e.jsx(q,{variant:"secondary",onClick:x,children:"Close"}),e.jsx(q,{variant:"primary",onClick:x,children:"Print"})]})]})})}function ue({individuals:N,url:x}){const[w,s]=n.useState(!1),i=()=>s(!1),[j,A]=n.useState(!1),z=()=>s(!0),[y,a]=n.useState([]),[v,f]=n.useState(!1),[g,t]=n.useState(!1),[T,l]=n.useState(!1),[C,_]=n.useState(!1),R=()=>l(!1),[r,I]=n.useState(null),[P,c]=n.useState(!1),[u,k]=n.useState(!1),[O,H]=n.useState(!0),[$,F]=n.useState(),[M,L]=n.useState({}),[B,U]=n.useState(!1),[V,J]=n.useState(!1),[p,G]=n.useState(),{is_internal:Q}=ie().props.Auth,W=()=>{H(!0),k(!1)},X=()=>{k(!0),H(!1)},D=(d,h)=>{d.preventDefault(),U(!0),G(h)},Y=(d,h)=>{try{_(!0),p&&d==="internal"?(S.post(reverseUrl("enquiry_count"),{isIndividual:!0,isCompany:!1,isInternal:!0,individualId:p}).then(o=>{}),S.post(reverseUrl("individual-report"),{individualId:p}).then(o=>{I(p),l(!0),F(o.data)}).catch(o=>{console.error("There was an error!",o)})):p&&d==="external"&&(S.post(reverseUrl("enquiry_count"),{isIndividual:!0,isCompany:!1,isInternal:!1,individualId:p}).then(o=>{}),S.post(reverseUrl("individual-report"),{individualId:p,enquirerId:h}).then(o=>{I(p),l(!0),F(o.data)}).catch(o=>{console.error("There was an error!",o)}))}finally{_(!1)}},{data:E,setData:ee,post:se}=Z({searchParam:"fullname",searchValue:""}),K=d=>ee({...E,[d.target.id]:d.target.value}),le=d=>{if(d.preventDefault(),E.searchValue===""){L({searchValue:"Please enter a search value"}),t(!1),c(!1);return}se(reverseUrl(x),{onStart:()=>{f(!0),t(!1),c(!1),a([]),L({})},onSuccess:h=>{const o=te=>JSON.stringify(te)==="{}";h.props.result.length===0&&c(!0),o(h.props.result)===!0?t(!0):a(h.props.result),f(!1)},onError:h=>{f(!1)}})};return e.jsxs("main",{children:[e.jsx(de,{title:"Search Individual"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx("div",{className:"row align-items-center mb-5",children:e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-5",onSubmit:le,children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Filter by Name / Surname / ID"}),e.jsx("input",{value:E.searchValue,onChange:K,type:"text",name:"searchValue",id:"searchValue",className:"form-control form-control"}),M.searchValue&&e.jsx("small",{className:"text-danger",children:M.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Select filter Parameter"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"searchParam",id:"searchParam",onChange:K,children:[e.jsx("option",{value:"fullname",children:"Full name"}),e.jsx("option",{value:"nationalid",children:"National ID"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:v,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),v?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})}),e.jsx("div",{className:"mt-4",children:e.jsx(re,{})})]})})})}),e.jsx(pe,{showReport:T,handleCloseReport:R,selectedRow:r,reportData:$}),e.jsx(je,{show:w,isMultiple:u,isSingle:O,handleMultiple:X,handleSingle:W,handleClose:i,setAddSuccessful:A,action:"create",url:Q!==1?"client-create-individual":"create-individual"}),B&&e.jsx(he,{show:B,handleClose:()=>U(!1),setShowEnquirerInputDialog:J,handleShowReport:Y}),V&&e.jsx(me,{show:V,handleClose:()=>J(!1),handleShowReport:Y}),e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{backgroundColor:"#e4e4e4"},children:[e.jsx("th",{scope:"col",children:"Forenames"}),e.jsx("th",{scope:"col",children:"surname"}),e.jsx("th",{scope:"col",children:"National ID"}),e.jsx("th",{scope:"col",children:"Select"})]}),v?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}):y.length>0&&y.map(d=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:d.firstname}),e.jsx("td",{children:d.surname}),e.jsx("td",{children:d.national_id}),e.jsx("td",{children:e.jsx("button",{className:"btn text-white  btn-info mdc-ripple-upgraded",type:"submit",disabled:C,onClick:h=>D(h,d.id),children:C?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"View"})})]},d.id))]})}),e.jsx("div",{className:"row justify-content-center",children:e.jsx("div",{className:"col-md-auto",children:P&&e.jsx(ne,{handleShow:z,handleCloseModal:()=>c(!1),userType:"Individual",searchValue:E.searchValue})})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})]})}function Ae({individuals:N}){return e.jsxs(e.Fragment,{children:[e.jsx(ae,{title:"Search individual"}),e.jsx(ue,{individuals:N,url:"individuals"})]})}export{Ae as default};
