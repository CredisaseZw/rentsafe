var ae=Object.defineProperty,re=Object.defineProperties;var oe=Object.getOwnPropertyDescriptors;var de=Object.getOwnPropertySymbols;var xe=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable;var ce=(o,c,x)=>c in o?ae(o,c,{enumerable:!0,configurable:!0,writable:!0,value:x}):o[c]=x,le=(o,c)=>{for(var x in c||(c={}))xe.call(c,x)&&ce(o,x,c[x]);if(de)for(var x of de(c))he.call(c,x)&&ce(o,x,c[x]);return o},ne=(o,c)=>re(o,oe(c));import{r,a as te,j as e,_ as f,b as K,u as me,H as je}from"./main-92093c4c.js";import{N as be}from"./NotFound-e601eee3.js";import{B as ue}from"./BulkIconButton-87c7029b.js";import{P as Ne}from"./PageHeader-62ebed4a.js";import{v as fe,a as ge}from"./index-ea250f19.js";import{M as pe}from"./MultipleUpload-09b1dc47.js";import{M as H}from"./Modal-9de466f6.js";import{B as ie}from"./Button-6308210e.js";import{C as ye,E as ve}from"./ExternalEnquirerInputDialog-c906fa95.js";import"./formatting-9de8c923.js";import"./lodash-a15548bd.js";import"./removeClass-dd64b22a.js";import"./index-0c7d6a02.js";import"./Button-314e1f54.js";function Se({show:o,handleClose:c,setAddSuccessful:x,handleSingle:s,isSingle:y,isMultiple:P,handleMultiple:E,url:A,action:g,userDetails:l,setFetchedData:p}){const[u,N]=r.useState(!1),[i,z]=r.useState(""),{data:n,setData:v,post:S,reset:T}=te({firstName:(l==null?void 0:l.firstname)||"",lastName:(l==null?void 0:l.surname)||"",identificationNumber:(l==null?void 0:l.identification_number)||"",identificationType:(l==null?void 0:l.identification_type)||"",gender:(l==null?void 0:l.gender)||"",dob:(l==null?void 0:l.dob)||"",maritalStatus:(l==null?void 0:l.marital_status)||"",address:(l==null?void 0:l.address)||"",mobileNumber:(l==null?void 0:l.mobile)||"",landLine:(l==null?void 0:l.landline)||"",emailAddress:(l==null?void 0:l.email)||"",currentEmployer:(l==null?void 0:l.employer_name)||"",jobTitle:(l==null?void 0:l.job_title)||"",dateOfemployment:(l==null?void 0:l.date_of_employment)||"",individualId:(l==null?void 0:l.id)||-1}),t=h=>v(ne(le({},n),{[h.target.id]:h.target.value})),w=h=>{if(h.preventDefault(),n.mobileNumber.length<10||n.mobileNumber.length>13||/\D/.test(n.mobileNumber)){f.error("Mobile number must be between 10 and 13 digits");return}if(n.emailAddress!==""&&!/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(n.emailAddress)){f.error("Please enter a valid email address");return}if(n.identificationType==="passport"&&!fe(n.identificationNumber)){N(!1),f.error("Invalid passport number");return}else if(n.identificationType==="nationalid"&&!ge(n.identificationNumber)){N(!1),f.error("Invalid national id number");return}if(n.identificationType==="servicesid"){f.error("Service ID not supported yet. Please use passport or national ID");return}S(reverseUrl(A),{onStart:()=>{N(!0)},onSuccess:b=>{T(),f.success("User created successfully"),N(!1),c(),x(!0)},onError:b=>{f.error("Something went wrong! Please try again"),z(b),N(!1)}})},R=h=>{h.preventDefault(),K.post(reverseUrl("edit_individual_user"),n).then(b=>{b.data.status==="success"?(f.success(b.data.message),p(C=>[...C.filter(_=>_.id!==n.individualId),{id:n.individualId,firstname:n.firstName,surname:n.lastName,identification_number:n.identificationNumber,identification_type:n.identificationType,gender:n.gender,dob:n.dob,marital_status:n.maritalStatus,address:n.address,mobile:n.mobileNumber,land_line:n.landLine,email_address:n.emailAddress,employer_name:n.currentEmployer,job_title:n.jobTitle,date_of_employment:n.dateOfemployment}]),c()):(f.error("Something went wrong! Please try again"),c())})};return e.jsx(e.Fragment,{children:e.jsx(H,{size:"lg",show:o,onHide:c,children:e.jsxs("div",{children:[e.jsx(H.Header,{closeButton:!0,className:"card-header bg-transparent",style:{paddingLeft:"0px"},children:e.jsxs("div",{className:"",children:[e.jsx("button",{className:`btn  btn-sm ${y?"btn-info text-white":"btn-light"}`,onClick:s,children:"Single"}),e.jsx("button",{className:`btn  btn-sm ${P?"btn-info text-white":"btn-light"}`,onClick:E,children:"Multiple"})]})}),y?e.jsxs("div",{className:"card card-raised",children:[e.jsx("div",{className:"card-header bg-info",children:e.jsxs("div",{className:`d-flex justify-content-between
                      align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:g==="create"?"Add Individual":"Edit Individual"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Personal details"}),e.jsx("div",{className:"card-text"})]})})}),e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(H.Body,{children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-md-12 my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Surname",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.lastName,onChange:t,type:"text",name:"lastName",required:!0,id:"lastName",placeholder:"Enter last name",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.lastName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["First Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.firstName,onChange:t,type:"text",name:"firstName",required:!0,id:"firstName",placeholder:"Enter first name",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.firstName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Type",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"identificationType",id:"identificationType",required:!0,onChange:t,value:n.identificationType,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"nationalid",children:"National ID"}),e.jsx("option",{value:"passport",children:"Passport"}),e.jsx("option",{value:"servicesid",children:"Service ID"})]}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.identificationType})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Identification Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.identificationNumber,onChange:t,type:"text",required:!0,name:"identificationNumber",id:"identificationNumber",placeholder:"eg. 12345678K29",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.identificationNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Gender"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",onChange:t,id:"gender",name:"gender",value:n.gender,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"male",children:"Male"}),e.jsx("option",{value:"female",children:"Female"}),e.jsx("option",{value:"other",children:"Other"})]}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.gender})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date Of birth"}),e.jsx("input",{value:n.dob,onChange:t,type:"date",name:"dob",id:"dob",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.dob})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Marital Status"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"maritalStatus",onChange:t,id:"maritalStatus",value:n.maritalStatus,children:[e.jsx("option",{children:"Select..."}),e.jsx("option",{value:"single",children:"Single"}),e.jsx("option",{value:"Married",children:"Married"}),e.jsx("option",{value:"Other",children:"Other"})]}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.maritalStatus})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{value:n.address,onChange:t,type:"text",id:"address",required:!0,name:"address",placeholder:"eg. 12 Main Road",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.address})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Mobile Number",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:n.mobileNumber,onChange:t,type:"tel",name:"mobileNumber",id:"mobileNumber",required:!0,maxLength:13,placeholder:"eg. 263777123456",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.mobileNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Landline"}),e.jsx("input",{value:n.landLine,onChange:t,type:"tel",id:"landLine",name:"landLine",placeholder:"eg. 263 123 4567",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.landLine})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Email Address"}),e.jsx("input",{value:n.emailAddress,onChange:t,type:"email",id:"emailAddress",name:"emailAddress",placeholder:"eg. your-name@your-company.com",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.emailAddress})]})]})})}),e.jsx("div",{className:"card",children:e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Employment Details"}),e.jsx("div",{className:"card-text"})]})})})}),e.jsx("div",{className:"row mb-4 mt-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Employer"}),e.jsx("input",{value:n.currentEmployer,onChange:t,type:"text",id:"currentEmployer",name:"currentEmployer",placeholder:"eg. Your Current Company",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.currentEmployer})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Current Job Title"}),e.jsx("input",{value:n.jobTitle,onChange:t,type:"text",name:"jobTitle",id:"jobTitle",placeholder:"eg. Accounts Clerk",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.jobTitle})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Date of Employment"}),e.jsx("input",{value:n.dateOfemployment,onChange:t,type:"date",id:"dateOfemployment",name:"dateOfemployment",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.dateOfemployment})]})]})})})]}),e.jsx(H.Footer,{children:e.jsx(ie,{className:"text-white",variant:"info",onClick:g==="create"?w:R,disabled:u,children:u?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Save and Proceed"})})]})]})})]}):e.jsx(pe,{type:"individual",actionType:"user"})]})})})}function we({showReport:o,handleCloseReport:c,selectedRow:x,reportData:s}){var y,P,E,A,g,l,p,u,N,i,z,n,v,S,T,t,w,R,h,b,C,q,_,Z,O,F,M,L,B,U,V,j,$,G,Q,W,X,J,I,D,ee,Y,se,a,m;return e.jsx(e.Fragment,{children:e.jsxs(H,{show:o,onHide:c,fullscreen:!0,children:[e.jsx(H.Body,{children:e.jsxs("div",{style:{border:"3px solid #176987",width:"100%",padding:"20px"},children:[e.jsxs("div",{class:"d-flex justify-content-between",children:[e.jsx("div",{children:"CrediSafe"}),e.jsxs("div",{class:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{})]}),e.jsxs("div",{style:{lineHeight:"10px"},children:[e.jsx("p",{style:{textAlign:"right"},children:"+263 71 882 2460"}),e.jsx("p",{style:{textAlign:"right"},children:"credisafezw@gmail.com"}),e.jsx("p",{style:{textAlign:"right"},children:" www.credi-safe.com"})]})]})]}),e.jsx("div",{className:"mt-5 mb-2",children:e.jsxs("h6",{children:["Payment Risk Report on"," ",e.jsxs("span",{style:{fontWeight:"bold",color:"#176987"},children:[(y=s==null?void 0:s.individual_details)==null?void 0:y.firstname," ",(P=s==null?void 0:s.individual_details)==null?void 0:P.surname," "]}),"as at ",Date().toLocaleString()]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"5px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"RISK CLASSIFICATION / INDICATOR"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsxs("th",{style:{backgroundColor:((E=s==null?void 0:s.risk_data)==null?void 0:E.class)=="low"?(A=s==null?void 0:s.risk_data)==null?void 0:A.color:"",color:((g=s==null?void 0:s.risk_data)==null?void 0:g.class)=="low"?"white":""},scope:"row",className:"text-center",children:["Low Risk[",((l=s==null?void 0:s.risk_data)==null?void 0:l.class)=="low"?(p=s==null?void 0:s.risk_data)==null?void 0:p.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((u=s==null?void 0:s.risk_data)==null?void 0:u.class)=="medium"?(N=s==null?void 0:s.risk_data)==null?void 0:N.color:"",color:((i=s==null?void 0:s.risk_data)==null?void 0:i.class)=="medium"?"white":""},className:"text-center",children:["Medium Risk[",((z=s==null?void 0:s.risk_data)==null?void 0:z.class)=="medium"?(n=s==null?void 0:s.risk_data)==null?void 0:n.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((v=s==null?void 0:s.risk_data)==null?void 0:v.class)=="high"?"#f87171":"",color:((S=s==null?void 0:s.risk_data)==null?void 0:S.class)=="high"?"white":""},className:"text-center",children:["High Risk[",((T=s==null?void 0:s.risk_data)==null?void 0:T.class)=="high"?(t=s==null?void 0:s.risk_data)==null?void 0:t.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((w=s==null?void 0:s.risk_data)==null?void 0:w.class)=="high-high"?(R=s==null?void 0:s.risk_data)==null?void 0:R.color:"",color:((h=s==null?void 0:s.risk_data)==null?void 0:h.class)=="high-high"?"white":""},className:"text-center",children:["High-High Risk[",((b=s==null?void 0:s.risk_data)==null?void 0:b.class)=="high-high"?(C=s==null?void 0:s.risk_data)==null?void 0:C.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((q=s==null?void 0:s.risk_data)==null?void 0:q.class)=="non-payer"?(_=s==null?void 0:s.risk_data)==null?void 0:_.color:"",color:((Z=s==null?void 0:s.risk_data)==null?void 0:Z.class)=="non-payer"?"white":""},className:"text-center",children:["None Payer[",((O=s==null?void 0:s.risk_data)==null?void 0:O.class)=="non-payer"?(F=s==null?void 0:s.risk_data)==null?void 0:F.score:"","]"]})]})]})})})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center text-white",children:"PERSONAL DETAILS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Identification Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Surname :"}),e.jsx("td",{children:(M=s==null?void 0:s.individual_details)==null?void 0:M.surname}),e.jsx("td",{children:"First Name :"}),e.jsx("td",{children:(L=s==null?void 0:s.individual_details)==null?void 0:L.firstname})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"National ID No:"}),e.jsx("td",{children:(B=s==null?void 0:s.individual_details)==null?void 0:B.national_id}),e.jsx("td",{children:"Date Of Birth:"}),e.jsx("td",{children:(U=s==null?void 0:s.individual_details)==null?void 0:U.dob})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Marital Status :"}),e.jsx("td",{}),e.jsx("td",{children:"Gender:"}),e.jsx("td",{children:(V=s==null?void 0:s.individual_details)==null?void 0:V.gender})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center ",children:"Contact Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Mobile Number :"}),e.jsx("td",{children:(j=s==null?void 0:s.individual_details)==null?void 0:j.mobile}),e.jsx("td",{children:"Telephone No:"}),e.jsx("td",{children:($=s==null?void 0:s.individual_details)==null?void 0:$.landline})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Address :"}),e.jsx("td",{colSpan:3,children:(G=s==null?void 0:s.individual_details)==null?void 0:G.address})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Email :"}),e.jsx("td",{colSpan:3,children:(Q=s==null?void 0:s.individual_details)==null?void 0:Q.email})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center ",children:"Employment History"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Employer"}),e.jsx("td",{className:"text-center",children:"Position"}),e.jsx("td",{className:"text-center",children:"Start Date"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center",children:(W=s==null?void 0:s.individual_details)==null?void 0:W.employer_name}),e.jsx("td",{className:"text-center",children:(X=s==null?void 0:s.individual_details)==null?void 0:X.job_title}),e.jsx("td",{className:"text-center",children:(J=s==null?void 0:s.individual_details)==null?void 0:J.date_of_employment})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"CREDIT ACCOUNTS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center",children:"Active Credit Accounts"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Credit Type"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Start Date"}),e.jsx("td",{children:"End Date"}),e.jsx("td",{children:"Principal Amount"}),e.jsx("td",{children:"Instalment Amount"}),e.jsx("td",{children:"Overdue Amount"})]}),(I=s==null?void 0:s.credit_details)==null?void 0:I.map(d=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:d.credit_type}),e.jsx("td",{children:d.currency}),e.jsxs("td",{children:[" ",d.start_date]}),e.jsxs("td",{children:[" ",d.end_date]}),e.jsxs("td",{children:[" ",d.principal_amount]}),e.jsxs("td",{children:[" ",d.instalment_amount]}),e.jsxs("td",{children:[" ",d.overdue_amount]})]},d.lease_id))]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Hire Purchase Information"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Credit Type"}),e.jsx("td",{className:"text-center",children:"Make"}),e.jsx("td",{className:"text-center",children:"Model"}),e.jsx("td",{className:"text-center",children:"Reg No. /Serial No."}),e.jsx("td",{className:"text-center",children:"Chassis No."}),e.jsx("td",{className:"text-center",children:"Engin No."}),e.jsx("td",{className:"text-center",children:"Start Date"}),e.jsx("td",{className:"text-center",children:"End Date"}),e.jsx("td",{className:"text-center",children:"Balance"}),e.jsx("td",{className:"text-center",children:"Overdue Amount"})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Historic Credit Accounts"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",colSpan:2,children:"Credit Type"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Start Date"}),e.jsx("td",{className:"text-center",children:"End Date"}),e.jsx("td",{className:"text-center",children:"Principal Amount"}),e.jsx("td",{className:"text-center",children:"Instalment Amount"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"ADVERSE RECORDS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Claims"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Claimant"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Date of Claim "})]}),((D=s==null?void 0:s.claims_list)==null?void 0:D.length)>0&&((ee=s==null?void 0:s.claims_list)==null?void 0:ee.map((d,k)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:d.creditor}),e.jsx("td",{children:d.currency}),e.jsx("td",{children:d.owing_amount}),e.jsx("td",{children:d.claim_date})]},"claim"+k)))]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Absconder"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Creditor"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Amount"})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Court Judgements"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",colSpan:2,children:"Court"}),e.jsx("td",{className:"text-center",children:"Plaintiff"}),e.jsx("td",{className:"text-center",children:"Case No"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Amount"}),e.jsx("td",{className:"text-center",children:"Judgement Date"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"ENQUIRIES"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Company"}),e.jsx("td",{children:"Enquirer"}),e.jsx("td",{children:"Date Of Enquiry"})]}),((Y=s==null?void 0:s.external_enquiry_details_list)==null?void 0:Y.length)>0&&e.jsx(e.Fragment,{children:(se=s==null?void 0:s.external_enquiry_details_list)==null?void 0:se.map((d,k)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:d.company_name}),e.jsx("td",{className:"text-center",children:d.enquirer}),e.jsx("td",{className:"text-center",children:d.enquiry_date})]},k))})]})}),(s==null?void 0:s.is_internal)&&e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Internal"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Enquirer"}),e.jsx("td",{className:"text-center",children:"Enquiry Date"})]}),((a=s==null?void 0:s.internal_enquiry_details_list)==null?void 0:a.length)>0&&e.jsx(e.Fragment,{children:(m=s==null?void 0:s.internal_enquiry_details_list)==null?void 0:m.map((d,k)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:d.enquirer}),e.jsx("td",{className:"text-center",children:d.enquiry_date})]},k))})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"PUBLIC INFORMATION"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Record Date"}),e.jsx("td",{children:"Source"}),e.jsx("td",{children:"Summary"}),e.jsx("td",{children:"Link "})]})]})})})}),e.jsx("div",{style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsx("tbody",{children:e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"AS KEY PERSON IN COMPANIES"})})})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Directorships"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Company"}),e.jsx("td",{className:"text-center",children:"Year Of Appointment"})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Executive"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Position"}),e.jsx("td",{className:"text-center",children:"Company"}),e.jsx("td",{className:"text-center",children:"Year Of Appointment"})]})]})})]})}),e.jsxs("div",{style:{width:"100%",padding:"2px"},children:[e.jsx("hr",{}),e.jsxs("div",{children:[e.jsx("p",{children:"Disclaimer: This report is confidential and intended solely for the individual or entity to whom it is addressed. Information on this report is valid at the time of enquiry only. If verification is required, please contact us on the details provided above."}),e.jsx("p",{children:"Terms and Conditions apply."}),e.jsx("p",{children:"Copyrights © CrediSafe Zimbabwe"}),e.jsx("p",{children:"All rights reserved"})]})]})]})}),e.jsxs(H.Footer,{children:[e.jsx(ie,{variant:"secondary",onClick:c,children:"Close"}),e.jsx(ie,{variant:"primary",onClick:c,children:"Print"})]})]})})}function Ce({individuals:o,url:c}){const[x,s]=r.useState(!1),y=()=>s(!1),[P,E]=r.useState(!1),A=()=>s(!0),[g,l]=r.useState([]),[p,u]=r.useState(!1),[N,i]=r.useState(!1),[z,n]=r.useState(!1),[v,S]=r.useState(!1),T=()=>n(!1),[t,w]=r.useState(null),[R,h]=r.useState(!1),[b,C]=r.useState(!1),[q,_]=r.useState(!0),[Z,O]=r.useState(),[F,M]=r.useState({}),[L,B]=r.useState(!1),[U,V]=r.useState(!1),[j,$]=r.useState(),{is_internal:G}=me().props.Auth,Q=()=>{_(!0),C(!1)},W=()=>{C(!0),_(!1)},X=(a,m)=>{a.preventDefault(),B(!0),$(m)},J=(a,m)=>{try{S(!0),j&&a==="internal"?(K.post(reverseUrl("enquiry_count"),{isIndividual:!0,isCompany:!1,isInternal:!0,individualId:j}).then(d=>{}),K.post(reverseUrl("individual-report"),{individualId:j}).then(d=>{w(j),n(!0),O(d.data)}).catch(d=>{console.error("There was an error!",d)})):j&&a==="external"&&(K.post(reverseUrl("enquiry_count"),{isIndividual:!0,isCompany:!1,isInternal:!1,individualId:j}).then(d=>{}),K.post(reverseUrl("individual-report"),{individualId:j,enquirerId:m}).then(d=>{w(j),n(!0),O(d.data)}).catch(d=>{console.error("There was an error!",d)}))}finally{S(!1)}},{data:I,setData:D,post:ee}=te({searchParam:"fullname",searchValue:""}),Y=a=>D(ne(le({},I),{[a.target.id]:a.target.value})),se=a=>{if(a.preventDefault(),I.searchValue===""){M({searchValue:"Please enter a search value"}),i(!1),h(!1);return}ee(reverseUrl(c),{onStart:()=>{u(!0),i(!1),h(!1),l([]),M({})},onSuccess:m=>{const d=k=>JSON.stringify(k)==="{}";m.props.result.length===0&&h(!0),d(m.props.result)===!0?i(!0):l(m.props.result),u(!1)},onError:m=>{u(!1)}})};return e.jsxs("main",{children:[e.jsx(Ne,{title:"Search Individual"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx("div",{className:"row align-items-center mb-5",children:e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-5",onSubmit:se,children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Filter by Name / Surname / ID"}),e.jsx("input",{value:I.searchValue,onChange:Y,type:"text",name:"searchValue",id:"searchValue",className:"form-control form-control"}),F.searchValue&&e.jsx("small",{className:"text-danger",children:F.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Select filter Parameter"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"searchParam",id:"searchParam",onChange:Y,children:[e.jsx("option",{value:"fullname",children:"Full name"}),e.jsx("option",{value:"nationalid",children:"National ID"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:p,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})}),e.jsx("div",{className:"mt-4",children:e.jsx(ue,{})})]})})})}),e.jsx(we,{showReport:z,handleCloseReport:T,selectedRow:t,reportData:Z}),e.jsx(Se,{show:x,isMultiple:b,isSingle:q,handleMultiple:W,handleSingle:Q,handleClose:y,setAddSuccessful:E,action:"create",url:G!==1?"client-create-individual":"create-individual"}),L&&e.jsx(ye,{show:L,handleClose:()=>B(!1),setShowEnquirerInputDialog:V,handleShowReport:J}),U&&e.jsx(ve,{show:U,handleClose:()=>V(!1),handleShowReport:J}),e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{backgroundColor:"#e4e4e4"},children:[e.jsx("th",{scope:"col",children:"Forenames"}),e.jsx("th",{scope:"col",children:"surname"}),e.jsx("th",{scope:"col",children:"National ID"}),e.jsx("th",{scope:"col",children:"Select"})]}),p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}):g.length>0&&g.map(a=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:a.firstname}),e.jsx("td",{children:a.surname}),e.jsx("td",{children:a.national_id}),e.jsx("td",{children:e.jsx("button",{className:"btn text-white  btn-info mdc-ripple-upgraded",type:"submit",disabled:v,onClick:m=>X(m,a.id),children:v?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"View"})})]},a.id))]})}),e.jsx("div",{className:"row justify-content-center",children:e.jsx("div",{className:"col-md-auto",children:R&&e.jsx(be,{handleShow:A,handleCloseModal:()=>h(!1),userType:"Individual",searchValue:I.searchValue})})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})]})}function Be({individuals:o}){return e.jsxs(e.Fragment,{children:[e.jsx(je,{title:"Search individual"}),e.jsx(Ce,{individuals:o,url:"individuals"})]})}export{Be as default};
