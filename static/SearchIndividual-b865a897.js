var te=Object.defineProperty,xe=Object.defineProperties;var he=Object.getOwnPropertyDescriptors;var ee=Object.getOwnPropertySymbols;var re=Object.prototype.hasOwnProperty,ae=Object.prototype.propertyIsEnumerable;var se=(n,i,x)=>i in n?te(n,i,{enumerable:!0,configurable:!0,writable:!0,value:x}):n[i]=x,le=(n,i)=>{for(var x in i||(i={}))re.call(i,x)&&se(n,x,i[x]);if(ee)for(var x of ee(i))ae.call(i,x)&&se(n,x,i[x]);return n},ie=(n,i)=>xe(n,he(i));import{j as e,r as d,a as oe,b as ne,H as je}from"./main-ce42b90d.js";import{L as me}from"./Layout-3cecd370.js";import{I as ue,_ as de}from"./index-eb61e7d2.js";import{B as be}from"./BulkIconButton-97409a47.js";import{N as ge}from"./NotFound-22fff3c5.js";import{P as Ne}from"./PageHeader-4ddd2d76.js";import{I as ye}from"./IndividualAdd-4062c3b4.js";import{M as D}from"./Modal-813c415f.js";import{B as ce}from"./Button-0a398406.js";import{B as fe}from"./BulkUploadModal-8ae2f5d8.js";import"./index-c1729276.js";import"./MultipleUpload-21a10de4.js";import"./removeClass-9e3d44ee.js";import"./index-43726784.js";function Se({showReport:n,handleCloseReport:i,selectedRow:x,reportData:s}){var z,W,A,R,b,g,j,m,N,y,Z,r,X,E,F,u,P,f,O,S,q,w,p,v,B,T,V,_,C,k,$,L,M,a,U,Y,H,J,K,G,Q,c,t,h,o;return e.jsx(e.Fragment,{children:e.jsxs(D,{show:n,onHide:i,fullscreen:!0,children:[e.jsx(D.Body,{children:e.jsxs("div",{style:{border:"3px solid #176987",width:"100%",padding:"20px"},id:"report",children:[e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsx("div",{children:"CrediSafe"}),e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{})]}),e.jsxs("div",{style:{lineHeight:"10px"},children:[e.jsx("p",{style:{textAlign:"right"},children:"+263 71 882 2460"}),e.jsx("p",{style:{textAlign:"right"},children:"credisafezw@gmail.com"}),e.jsx("p",{style:{textAlign:"right"},children:" www.credi-safe.com"})]})]})]}),e.jsx("div",{className:"mt-5 mb-2",children:e.jsxs("h6",{children:["Payment Risk Report on"," ",e.jsxs("span",{style:{fontWeight:"bold",color:"#176987"},children:[(z=s==null?void 0:s.individual_details)==null?void 0:z.firstname," ",(W=s==null?void 0:s.individual_details)==null?void 0:W.surname," "]}),"as at ",Date().toLocaleString()]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"5px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"RISK CLASSIFICATION / INDICATOR"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsxs("th",{style:{backgroundColor:((A=s==null?void 0:s.risk_data)==null?void 0:A.class)=="low"?(R=s==null?void 0:s.risk_data)==null?void 0:R.color:"",color:((b=s==null?void 0:s.risk_data)==null?void 0:b.class)=="low"?"white":""},scope:"row",className:"text-center",children:["Low Risk[",((g=s==null?void 0:s.risk_data)==null?void 0:g.class)=="low"?(j=s==null?void 0:s.risk_data)==null?void 0:j.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((m=s==null?void 0:s.risk_data)==null?void 0:m.class)=="medium"?(N=s==null?void 0:s.risk_data)==null?void 0:N.color:"",color:((y=s==null?void 0:s.risk_data)==null?void 0:y.class)=="medium"?"white":""},className:"text-center",children:["Medium Risk[",((Z=s==null?void 0:s.risk_data)==null?void 0:Z.class)=="medium"?(r=s==null?void 0:s.risk_data)==null?void 0:r.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((X=s==null?void 0:s.risk_data)==null?void 0:X.class)=="high"?"#f87171":"",color:((E=s==null?void 0:s.risk_data)==null?void 0:E.class)=="high"?"white":""},className:"text-center",children:["High Risk[",((F=s==null?void 0:s.risk_data)==null?void 0:F.class)=="high"?(u=s==null?void 0:s.risk_data)==null?void 0:u.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((P=s==null?void 0:s.risk_data)==null?void 0:P.class)=="high-high"?(f=s==null?void 0:s.risk_data)==null?void 0:f.color:"",color:((O=s==null?void 0:s.risk_data)==null?void 0:O.class)=="high-high"?"white":""},className:"text-center",children:["High-High Risk[",((S=s==null?void 0:s.risk_data)==null?void 0:S.class)=="high-high"?(q=s==null?void 0:s.risk_data)==null?void 0:q.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((w=s==null?void 0:s.risk_data)==null?void 0:w.class)=="non-payer"?(p=s==null?void 0:s.risk_data)==null?void 0:p.color:"",color:((v=s==null?void 0:s.risk_data)==null?void 0:v.class)=="non-payer"?"white":""},className:"text-center",children:["None Payer[",((B=s==null?void 0:s.risk_data)==null?void 0:B.class)=="non-payer"?(T=s==null?void 0:s.risk_data)==null?void 0:T.score:"","]"]})]})]})})})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center text-white",children:"PERSONAL DETAILS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Identification Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Surname :"}),e.jsx("td",{children:(V=s==null?void 0:s.individual_details)==null?void 0:V.surname}),e.jsx("td",{children:"First Name :"}),e.jsx("td",{children:(_=s==null?void 0:s.individual_details)==null?void 0:_.firstname})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"National ID No:"}),e.jsx("td",{children:(C=s==null?void 0:s.individual_details)==null?void 0:C.national_id}),e.jsx("td",{children:"Date Of Birth:"}),e.jsx("td",{children:(k=s==null?void 0:s.individual_details)==null?void 0:k.dob})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Marital Status :"}),e.jsx("td",{}),e.jsx("td",{children:"Gender:"}),e.jsx("td",{children:($=s==null?void 0:s.individual_details)==null?void 0:$.gender})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center ",children:"Contact Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Mobile Number :"}),e.jsx("td",{children:(L=s==null?void 0:s.individual_details)==null?void 0:L.mobile}),e.jsx("td",{children:"Telephone No:"}),e.jsx("td",{children:(M=s==null?void 0:s.individual_details)==null?void 0:M.mobile})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Address :"}),e.jsx("td",{colSpan:3,children:(a=s==null?void 0:s.individual_details)==null?void 0:a.address})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Email :"}),e.jsx("td",{colSpan:3,children:(U=s==null?void 0:s.individual_details)==null?void 0:U.email})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center ",children:"Employment History"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Employer"}),e.jsx("td",{className:"text-center",children:"Position"}),e.jsx("td",{className:"text-center",children:"Start Date"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center",children:(Y=s==null?void 0:s.individual_details)==null?void 0:Y.employer_name}),e.jsx("td",{className:"text-center",children:(H=s==null?void 0:s.individual_details)==null?void 0:H.job_title}),e.jsx("td",{className:"text-center",children:(J=s==null?void 0:s.individual_details)==null?void 0:J.date_of_employment})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"CREDIT ACCOUNTS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center",children:"Active Credit Accounts"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Credit Type"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Start Date"}),e.jsx("td",{children:"End Date"}),e.jsx("td",{children:"Principal Amount"}),e.jsx("td",{children:"Instalment Amount"}),e.jsx("td",{children:"Overdue Amount"})]}),(K=s==null?void 0:s.credit_details)==null?void 0:K.map(l=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:l.credit_type}),e.jsx("td",{children:l.currency}),e.jsxs("td",{children:[" ",l.start_date]}),e.jsxs("td",{children:[" ",l.end_date]}),e.jsxs("td",{children:[" ",l.principal_amount]}),e.jsxs("td",{children:[" ",l.instalment_amount]}),e.jsxs("td",{children:[" ",l.overdue_amount]})]},l.lease_id))]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Hire Purchase Information"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Credit Type"}),e.jsx("td",{className:"text-center",children:"Make"}),e.jsx("td",{className:"text-center",children:"Model"}),e.jsx("td",{className:"text-center",children:"Reg No. /Serial No."}),e.jsx("td",{className:"text-center",children:"Chassis No."}),e.jsx("td",{className:"text-center",children:"Engin No."}),e.jsx("td",{className:"text-center",children:"Start Date"}),e.jsx("td",{className:"text-center",children:"End Date"}),e.jsx("td",{className:"text-center",children:"Balance"}),e.jsx("td",{className:"text-center",children:"Overdue Amount"})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Historic Credit Accounts"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",colSpan:2,children:"Credit Type"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Start Date"}),e.jsx("td",{className:"text-center",children:"End Date"}),e.jsx("td",{className:"text-center",children:"Principal Amount"}),e.jsx("td",{className:"text-center",children:"Instalment Amount"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"ADVERSE RECORDS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Claims"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Claimant"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Date of Claim "})]}),((G=s==null?void 0:s.claims_list)==null?void 0:G.length)>0&&((Q=s==null?void 0:s.claims_list)==null?void 0:Q.map((l,I)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:l.creditor}),e.jsx("td",{children:l.currency}),e.jsx("td",{children:l.owing_amount}),e.jsx("td",{children:l.claim_date})]},"claim"+I)))]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Absconder"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Creditor"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Amount"})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Court Judgements"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",colSpan:2,children:"Court"}),e.jsx("td",{className:"text-center",children:"Plaintiff"}),e.jsx("td",{className:"text-center",children:"Case No"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Amount"}),e.jsx("td",{className:"text-center",children:"Judgement Date"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"ENQUIRIES"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Company"}),e.jsx("td",{children:"Enquirer"}),e.jsx("td",{children:"Date Of Enquiry"})]}),((c=s==null?void 0:s.external_enquiry_details_list)==null?void 0:c.length)>0&&e.jsx(e.Fragment,{children:(t=s==null?void 0:s.external_enquiry_details_list)==null?void 0:t.map((l,I)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:l.company_name}),e.jsx("td",{className:"text-center",children:l.enquirer}),e.jsx("td",{className:"text-center",children:l.enquiry_date})]},I))})]})}),(s==null?void 0:s.is_internal)&&e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Internal"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Enquirer"}),e.jsx("td",{className:"text-center",children:"Enquiry Date"})]}),((h=s==null?void 0:s.internal_enquiry_details_list)==null?void 0:h.length)>0&&e.jsx(e.Fragment,{children:(o=s==null?void 0:s.internal_enquiry_details_list)==null?void 0:o.map((l,I)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:l.enquirer}),e.jsx("td",{className:"text-center",children:l.enquiry_date})]},I))})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"PUBLIC INFORMATION"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Record Date"}),e.jsx("td",{children:"Source"}),e.jsx("td",{children:"Summary"}),e.jsx("td",{children:"Link "})]})]})})})}),e.jsx("div",{style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsx("tbody",{children:e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"AS KEY PERSON IN COMPANIES"})})})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Directorships"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Company"}),e.jsx("td",{className:"text-center",children:"Year Of Appointment"})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Executive"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Position"}),e.jsx("td",{className:"text-center",children:"Company"}),e.jsx("td",{className:"text-center",children:"Year Of Appointment"})]})]})})]})}),e.jsxs("div",{style:{width:"100%",padding:"2px"},children:[e.jsx("hr",{}),e.jsxs("div",{children:[e.jsx("p",{children:"Disclaimer: This report is confidential and intended solely for the individual or entity to whom it is addressed. Information on this report is valid at the time of enquiry only. If verification is required, please contact us on the details provided above."}),e.jsx("p",{children:"Terms and Conditions apply."}),e.jsx("p",{children:"Copyrights © CrediSafe Zimbabwe"}),e.jsx("p",{children:"All rights reserved"})]})]})]})}),e.jsxs(D.Footer,{children:[e.jsx(ce,{className:"mr-4",variant:"secondary",onClick:i,children:"Close"}),e.jsx(ce,{variant:"primary",children:"Print"})]})]})})}function we({individuals:n,url:i}){const[x,s]=d.useState(!1),z=()=>s(!1),[W,A]=d.useState(!1),R=()=>s(!0),[b,g]=d.useState([]),[j,m]=d.useState(!1),[N,y]=d.useState(!1),[Z,r]=d.useState(!1),[X,E]=d.useState(!1),[F,u]=d.useState(!1),[P,f]=d.useState(!1),[O,S]=d.useState(!0),[q,w]=d.useState(!1),[p,v]=d.useState({}),[B,T]=d.useState(null),[V,_]=d.useState(null),[C,k]=d.useState(!1),[$,L]=d.useState(!1),M=(c,t)=>{c.preventDefault(),de.loading("Loading...",{duration:2500,position:"top-center"});try{y(!0),t&&(ne.post(reverseUrl("enquiry_count"),{isIndividual:!0,isCompany:!1,individualId:t}).then(h=>{}),ne.post(reverseUrl("individual-report"),{individualId:t}).then(h=>{var o,l;T(t),(o=h.data)!=null&&o.is_eligible?(l=h.data)!=null&&l.require_otp?(L(!0),_(h.data)):(_(h.data),E(!0),k(!0)):de.error("You have exhausted your free enquiries. Please subscribe to get more enquiries.",{duration:4e3,id:"error_"})}).catch(h=>{console.error("There was an error!",h)}))}finally{y(!1)}},{data:a,setData:U,post:Y}=oe({searchParam:"fullname",searchValue:""}),H=c=>U(ie(le({},a),{[c.target.id]:c.target.value})),J=c=>{if(c.preventDefault(),a.searchValue===""){r(!1),v({searchValue:"The search value field is required."});return}Y(reverseUrl(i),{onStart:()=>{m(!0),r(!1),g([]),v({}),u(!1)},onSuccess:t=>{const h=o=>JSON.stringify(o)==="{}";t.props.result.length===0&&u(!0),h(t.props.result)===!0?r(!0):g(t.props.result),r(!1),m(!1)},onError:t=>{m(!1)}})},K=()=>{S(!0),f(!1)},G=()=>{f(!0),S(!1)},Q=()=>{w(!0)};return e.jsxs("main",{children:[e.jsx(Ne,{title:"Search Individual"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx(ue,{position:"top-right",duration:"4000"}),e.jsx("div",{className:"row align-items-center mb-5",children:e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-5",onSubmit:J,children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Filter by Name / Surname / ID"}),e.jsx("input",{value:a.searchValue,onChange:H,type:"text",name:"searchValue",id:"searchValue",className:"form-control form-control"}),p.searchValue&&e.jsx("small",{className:"text-danger",children:p.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Select filter Parameter"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"searchParam",id:"searchParam",onChange:H,children:[e.jsx("option",{value:"fullname",children:"Full name"}),e.jsx("option",{value:"nationalid",children:"Identification Number"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:j,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),j?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})}),e.jsx("div",{className:"mt-4",children:e.jsx(be,{handleClick:Q})})]})})})}),e.jsx(fe,{type:"individual",actionType:"user",show:q,handleClose:()=>w(!1)}),C&&e.jsx(Se,{showReport:C,handleCloseReport:()=>k(!1),selectedRow:B,reportData:V}),e.jsx(ye,{show:x,isMultiple:P,isSingle:O,handleMultiple:G,handleSingle:K,handleClose:z,setAddSuccessful:A,action:"create",url:"cl-store-individual"}),e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{backgroundColor:"#e4e4e4"},children:[e.jsx("th",{scope:"col",children:"Forenames"}),e.jsx("th",{scope:"col",children:"surname"}),e.jsx("th",{scope:"col",children:"Identification Number"}),e.jsx("th",{scope:"col",children:"Select"})]}),j?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}):b.length>0&&b.map(c=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:c.firstname}),e.jsx("td",{children:c.surname}),e.jsx("td",{children:c.national_id}),e.jsx("td",{children:e.jsx("button",{className:"btn btn-info mdc-ripple-upgraded text-white ",type:"submit",disabled:N,onClick:t=>M(t,c.id),children:N?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"View"})})]},c.id))]})}),e.jsx("div",{className:"row justify-content-center",children:e.jsx("div",{className:"col-md-auto",children:F&&e.jsx(ge,{handleShow:R,handleCloseModal:()=>u(!1),userType:"individual",searchValue:a.searchValue})})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})]})}function pe({individuals:n}){return e.jsxs(e.Fragment,{children:[e.jsx(je,{title:"Search individual"}),e.jsx(we,{individuals:n,url:"cl-search-individuals"})]})}pe.layout=n=>e.jsx(me,{children:n,title:"Search Individual"});export{pe as default};
