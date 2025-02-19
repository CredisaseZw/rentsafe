var de=Object.defineProperty,te=Object.defineProperties;var re=Object.getOwnPropertyDescriptors;var se=Object.getOwnPropertySymbols;var xe=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable;var le=(d,n,t)=>n in d?de(d,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):d[n]=t,ne=(d,n)=>{for(var t in n||(n={}))xe.call(n,t)&&le(d,t,n[t]);if(se)for(var t of se(n))he.call(n,t)&&le(d,t,n[t]);return d},ie=(d,n)=>te(d,re(n));import{j as e,r as c,u as oe,a as ae,b as $,H as je}from"./main-d5417f1a.js";import{I as me,_ as ue}from"./index-1895929e.js";import{N as be}from"./NotFound-c585c465.js";import{P as ge}from"./PageHeader-d4825af3.js";import{C as ye}from"./CompanyAdd-a3c5a66f.js";import{M as ee}from"./Modal-77de5ef3.js";import{B as ce}from"./Button-fede7785.js";import{C as Ne,E as fe}from"./ExternalEnquirerInputDialog-c75f7146.js";import"./MultipleUpload-c2e0f49b.js";import"./index-b3b37505.js";import"./removeClass-ef34bfd3.js";import"./index-47ea131b.js";import"./Button-a72d4825.js";function Se({showReport:d,handleCloseReport:n,selectedRow:t,reportData:s}){var y,T,N,o,f,m,u,S,p,D,b,O,w,M,_,C,v,k,H,V,a,L,g,z,I,E,A,U,x,B,Y,J,R,K,q,W,Q,j,Z,G,P,X,F,i,r;return e.jsx(e.Fragment,{children:e.jsxs(ee,{show:d,onHide:n,fullscreen:!0,children:[e.jsx(ee.Body,{children:e.jsxs("div",{style:{border:"3px solid #176987",width:"100%",padding:"20px"},children:[e.jsxs("div",{class:"d-flex justify-content-between",children:[e.jsx("div",{children:"CrediSafe"}),e.jsxs("div",{class:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{})]}),e.jsxs("div",{style:{lineHeight:"10px"},children:[e.jsx("p",{style:{textAlign:"right"},children:"+263 71 882 2460"}),e.jsx("p",{style:{textAlign:"right"},children:"credisafezw@gmail.com"}),e.jsx("p",{style:{textAlign:"right"},children:" www.credi-safe.com"})]})]})]}),e.jsx("div",{className:"mt-5 mb-2",children:e.jsxs("h6",{children:["Payment Risk Report on"," ",e.jsxs("span",{style:{fontWeight:"bold",color:"#176987"},children:[(y=s==null?void 0:s.company_details)==null?void 0:y.registration_name," "]}),"as at ",Date().toLocaleString()]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"5px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"RISK CLASSIFICATION / INDICATOR"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsxs("th",{style:{backgroundColor:((T=s==null?void 0:s.risk_data)==null?void 0:T.class)=="low"?(N=s==null?void 0:s.risk_data)==null?void 0:N.color:"",color:((o=s==null?void 0:s.risk_data)==null?void 0:o.class)=="low"?"white":""},scope:"row",className:"text-center",children:["Low Risk[",((f=s==null?void 0:s.risk_data)==null?void 0:f.class)=="low"?(m=s==null?void 0:s.risk_data)==null?void 0:m.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((u=s==null?void 0:s.risk_data)==null?void 0:u.class)=="medium"?(S=s==null?void 0:s.risk_data)==null?void 0:S.color:"",color:((p=s==null?void 0:s.risk_data)==null?void 0:p.class)=="medium"?"white":""},className:"text-center",children:["Medium Risk[",((D=s==null?void 0:s.risk_data)==null?void 0:D.class)=="medium"?(b=s==null?void 0:s.risk_data)==null?void 0:b.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((O=s==null?void 0:s.risk_data)==null?void 0:O.class)=="high"?"#f87171":"",color:((w=s==null?void 0:s.risk_data)==null?void 0:w.class)=="high"?"white":""},className:"text-center",children:["High Risk[",((M=s==null?void 0:s.risk_data)==null?void 0:M.class)=="high"?(_=s==null?void 0:s.risk_data)==null?void 0:_.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((C=s==null?void 0:s.risk_data)==null?void 0:C.class)=="high-high"?(v=s==null?void 0:s.risk_data)==null?void 0:v.color:"",color:((k=s==null?void 0:s.risk_data)==null?void 0:k.class)=="high-high"?"white":""},className:"text-center",children:["High-High Risk[",((H=s==null?void 0:s.risk_data)==null?void 0:H.class)=="high-high"?(V=s==null?void 0:s.risk_data)==null?void 0:V.score:"","]"]}),e.jsxs("td",{style:{backgroundColor:((a=s==null?void 0:s.risk_data)==null?void 0:a.class)=="non-payer"?(L=s==null?void 0:s.risk_data)==null?void 0:L.color:"",color:((g=s==null?void 0:s.risk_data)==null?void 0:g.class)=="non-payer"?"white":""},className:"text-center",children:["None Payer[",((z=s==null?void 0:s.risk_data)==null?void 0:z.class)=="non-payer"?(I=s==null?void 0:s.risk_data)==null?void 0:I.score:"","]"]})]})]})})})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center text-white",children:"COMPANY DETAILS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Registration Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Registered Name :"}),e.jsx("td",{children:(E=s==null?void 0:s.company_details)==null?void 0:E.registration_name}),e.jsx("td",{children:"Trading Name:"}),e.jsx("td",{children:(A=s==null?void 0:s.company_details)==null?void 0:A.trading_name})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Registration number:"}),e.jsx("td",{children:(U=s==null?void 0:s.company_details)==null?void 0:U.registration_number}),e.jsx("td",{children:"Year of registration:"}),e.jsx("td",{children:(x=s==null?void 0:s.company_details)==null?void 0:x.registration_date})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Trading Status:"}),e.jsx("td",{children:(B=s==null?void 0:s.company_details)==null?void 0:B.trading_status}),e.jsx("td",{children:"Industry Sector"}),e.jsx("td",{children:(Y=s==null?void 0:s.company_details)==null?void 0:Y.industry})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center",children:"Contact Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Telephone No.:"}),e.jsx("td",{children:(J=s==null?void 0:s.company_details)==null?void 0:J.telephone}),e.jsx("td",{children:"Mobile No.:"}),e.jsx("td",{children:(R=s==null?void 0:s.company_details)==null?void 0:R.mobile_phone})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Physical Address:"}),e.jsx("td",{colSpan:3,children:(K=s==null?void 0:s.company_details)==null?void 0:K.current_address})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Email :"}),e.jsx("td",{children:(q=s==null?void 0:s.company_details)==null?void 0:q.email}),e.jsx("td",{children:"Website:"}),e.jsx("td",{children:(W=s==null?void 0:s.company_details)==null?void 0:W.website})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"CREDIT ACCOUNTS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center",children:"Active Credit Accounts"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Credit Type"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Start Date"}),e.jsx("td",{children:"End Date"}),e.jsx("td",{children:"Principal Amount"}),e.jsx("td",{children:"Instalment Amount"}),e.jsx("td",{children:"Overdue Amount"})]}),(Q=s==null?void 0:s.credit_details)==null?void 0:Q.map(l=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:l.credit_type}),e.jsx("td",{children:l.currency}),e.jsxs("td",{children:[" ",l.start_date]}),e.jsxs("td",{children:[" ",l.end_date]}),e.jsxs("td",{children:[" ",l.principal_amount]}),e.jsxs("td",{children:[" ",l.instalment_amount]}),e.jsxs("td",{children:[" ",l.overdue_amount]})]},l.lease_id))]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Hire Purchase Information"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Credit Type"}),e.jsx("td",{className:"text-center",children:"Make"}),e.jsx("td",{className:"text-center",children:"Model"}),e.jsx("td",{className:"text-center",children:"Reg No. /Serial No."}),e.jsx("td",{className:"text-center",children:"Chassis No."}),e.jsx("td",{className:"text-center",children:"Engin No."}),e.jsx("td",{className:"text-center",children:"Start Date"}),e.jsx("td",{className:"text-center",children:"End Date"}),e.jsx("td",{className:"text-center",children:"Balance"}),e.jsx("td",{className:"text-center",children:"Overdue Amount"})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Historic Credit Accounts"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",colSpan:2,children:"Credit Type"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Start Date"}),e.jsx("td",{className:"text-center",children:"End Date"}),e.jsx("td",{className:"text-center",children:"Principal Amount"}),e.jsx("td",{className:"text-center",children:"Instalment Amount"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",colSpan:2,children:"Bank Loan"}),e.jsx("td",{className:"text-center"}),e.jsx("td",{className:"text-center"}),e.jsx("td",{className:"text-center"}),e.jsx("td",{className:"text-center"}),e.jsx("td",{className:"text-center"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"ADVERSE RECORDS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Claims"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Claimant"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Date of Claim "})]}),((j=s==null?void 0:s.claims_list)==null?void 0:j.length)>0&&((Z=s==null?void 0:s.claims_list)==null?void 0:Z.map((l,h)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:l.creditor}),e.jsx("td",{children:l.currency}),e.jsx("td",{children:l.owing_amount}),e.jsx("td",{children:l.claim_date})]},"claim"+h)))]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Absconder"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Creditor"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Amount"})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Court Judgements"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",colSpan:2,children:"Court"}),e.jsx("td",{className:"text-center",children:"Plaintiff"}),e.jsx("td",{className:"text-center",children:"Case No"}),e.jsx("td",{className:"text-center",children:"Currency"}),e.jsx("td",{className:"text-center",children:"Amount"}),e.jsx("td",{className:"text-center",children:"Judgement Date"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"ENQUIRIES"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Company"}),e.jsx("td",{children:"Enquirer"}),e.jsx("td",{children:"Date Of Enquiry"})]}),((G=s==null?void 0:s.external_enquiry_details_list)==null?void 0:G.length)>0&&e.jsx(e.Fragment,{children:(X=(P=s==null?void 0:s.external_enquiry_details_list)==null?void 0:P.sort((l,h)=>new Date(h.enquiry_date)-new Date(l.enquiry_date)))==null?void 0:X.map((l,h)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:l.company_name}),e.jsx("td",{className:"text-center",children:l.enquirer}),e.jsx("td",{className:"text-center",children:l.enquiry_date})]},h))})]})}),(s==null?void 0:s.is_internal)&&e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Internal"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Enquirer"}),e.jsx("td",{className:"text-center",children:"Enquiry Date"})]}),((F=s==null?void 0:s.internal_enquiry_details_list)==null?void 0:F.length)>0&&e.jsx(e.Fragment,{children:(r=(i=s==null?void 0:s.internal_enquiry_details_list)==null?void 0:i.sort((l,h)=>new Date(h.enquiry_date)-new Date(l.enquiry_date)))==null?void 0:r.map((l,h)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:l.enquirer}),e.jsx("td",{className:"text-center",children:l.enquiry_date})]},h))})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"PUBLIC INFORMATION"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Record Date"}),e.jsx("td",{children:"Source"}),e.jsx("td",{children:"Summary"}),e.jsx("td",{children:"Link "})]})]})})})}),e.jsx("div",{style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsx("tbody",{children:e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"AS KEY PERSON IN COMPANIES"})})})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Directorships"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Company"}),e.jsx("td",{className:"text-center",children:"Year Of Appointment"})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:3,className:"text-center ",children:"Executive"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Position"}),e.jsx("td",{className:"text-center",children:"Company"}),e.jsx("td",{className:"text-center",children:"Year Of Appointment"})]})]})})]})}),e.jsxs("div",{style:{width:"100%",padding:"2px"},children:[e.jsx("hr",{}),e.jsxs("div",{children:[e.jsx("p",{children:"Disclaimer: This report is confidential and intended solely for the individual or entity to whom it is addressed. Information on this report is valid at the time of enquiry only. If verification is required, please contact us on the details provided above."}),e.jsx("p",{children:"Terms and Conditions apply."}),e.jsx("p",{children:"Copyrights © CrediSafe Zimbabwe"}),e.jsx("p",{children:"All rights reserved"})]})]})]})}),e.jsxs(ee.Footer,{children:[e.jsx(ce,{variant:"secondary",onClick:n,children:"Close"}),e.jsx(ce,{variant:"primary",onClick:n,children:"Print"})]})]})})}function pe({url:d}){var F;const[n,t]=c.useState(!1),[s,y]=c.useState(!1),T=()=>y(!1),N=()=>y(!0),[o,f]=c.useState([]),[m,u]=c.useState(!1),[S,p]=c.useState(!1),[D,b]=c.useState(!1),[O,w]=c.useState(!1),[M,_]=c.useState(!0),[C,v]=c.useState(),[k,H]=c.useState({}),[V,a]=c.useState(!1),[L,g]=c.useState(!1),[z,I]=c.useState(!1),[E,A]=c.useState(!1),U=()=>g(!1),[x,B]=c.useState(),{is_internal:Y}=(F=oe().props)==null?void 0:F.Auth,[J,R]=c.useState(null),K=(i,r)=>{i.preventDefault(),I(!0),B(r)},q=(i,r)=>{p(!0);try{x&&i==="internal"?($.post(reverseUrl("enquiry_count"),{isIndividual:!1,isCompany:!0,companyId:x,isInternal:!0}).then(l=>{}),$.post(reverseUrl("company-report"),{companyId:x}).then(l=>{R(x),g(!0),v(l.data)}).catch(l=>{console.error("There was an error!",l)})):x&&i==="external"&&($.post(reverseUrl("enquiry_count"),{isIndividual:!1,isCompany:!0,isInternal:!1,companyId:x}).then(l=>{}),$.post(reverseUrl("company-report"),{companyId:x,enquirerId:r}).then(l=>{R(x),g(!0),v(l.data)}).catch(l=>{console.error("There was an error!",l)}))}finally{p(!1)}},W=()=>{_(!0),w(!1)},Q=()=>{w(!0),_(!1)},{data:j,setData:Z,post:G}=ae({searchParam:"registration_name",searchValue:""}),P=i=>Z(ie(ne({},j),{[i.target.id]:i.target.value})),X=i=>{if(i.preventDefault(),j.searchValue===""){H({searchValue:"Please enter a search value"}),b(!1),a(!1);return}G(reverseUrl(d),{onStart:()=>{u(!0),a(!1),b(!1),H({}),f({})},onSuccess:r=>{r.props.result.length>0?f(r.props.result):(b(!0),a(!0)),u(!1)},onError:r=>{ue.error("Nothing to search..."),u(!1)}})};return e.jsxs("main",{children:[e.jsx(ge,{title:"Search Company"}),e.jsx(me,{position:"top-right",duration:"4000"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx("div",{className:"row align-items-center mb-5",children:e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-5",onSubmit:X,children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Filter by Registration Name / Number"}),e.jsx("input",{value:j.searchValue,onChange:P,type:"text",name:"searchValue",id:"searchValue",className:"form-control form-control"}),k.searchValue&&e.jsx("small",{className:"text-danger",children:k.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Select filter Parameter"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"searchParam",id:"searchParam",onChange:P,children:[e.jsx("option",{value:"registration_name",children:"Registration Name"}),e.jsx("option",{value:"registration_number",children:"Registration Number"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:m,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),m?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})})]})})})}),C&&e.jsx(Se,{showReport:L,handleCloseReport:U,selectedRow:J,reportData:C}),z&&e.jsx(Ne,{show:z,handleClose:()=>I(!1),setShowEnquirerInputDialog:A,handleShowReport:q}),E&&e.jsx(fe,{show:E,handleClose:()=>A(!1),handleShowReport:q}),e.jsx(ye,{show:s,handleClose:T,handleShow:N,isSingle:M,pageType:"dashboard",handleSingle:W,isMultiple:O,handleMultiple:Q,setAddSuccessful:t,action:"create",url:Y!==1?"client-create-company":"create-company"}),e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{backgroundColor:"#e4e4e4"},children:[e.jsx("th",{scope:"col",children:"Registration Name"}),e.jsx("th",{scope:"col",children:"Registration Number"}),e.jsx("th",{scope:"col",children:"Select"})]}),m?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}):o.length>0?o==null?void 0:o.map(({id:i,registration_number:r,registration_name:l})=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:l}),e.jsx("td",{children:r}),e.jsx("td",{children:i?e.jsx("button",{className:"btn text-white  btn-info mdc-ripple-upgraded",type:"submit",disabled:S,onClick:h=>K(h,i),children:S?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"View"}):""})]},i)):""]})}),e.jsx("div",{className:"row justify-content-center",children:e.jsx("div",{className:"col-md-auto",children:V&&e.jsx(be,{handleShow:N,searchValue:j.searchValue,userType:"Company",handleCloseModal:()=>a(!1)})})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})]})}function Te(){return e.jsxs(e.Fragment,{children:[e.jsx(je,{title:"Search company"}),e.jsx(pe,{url:"companies"})]})}export{Te as default};
