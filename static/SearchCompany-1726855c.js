var ie=Object.defineProperty,le=Object.defineProperties;var te=Object.getOwnPropertyDescriptors;var ee=Object.getOwnPropertySymbols;var de=Object.prototype.hasOwnProperty,re=Object.prototype.propertyIsEnumerable;var se=(a,n,c)=>n in a?ie(a,n,{enumerable:!0,configurable:!0,writable:!0,value:c}):a[n]=c,M=(a,n)=>{for(var c in n||(n={}))de.call(n,c)&&se(a,c,n[c]);if(ee)for(var c of ee(n))re.call(n,c)&&se(a,c,n[c]);return a},V=(a,n)=>le(a,te(n));var ne=(a,n,c)=>new Promise((s,l)=>{var w=o=>{try{x(c.next(o))}catch(m){l(m)}},g=o=>{try{x(c.throw(o))}catch(m){l(m)}},x=o=>o.done?s(o.value):Promise.resolve(o.value).then(w,g);x((c=c.apply(a,n)).next())});import{r as j,j as e,a as K,_ as v,b as Z,H as ce}from"./main-13c4959c.js";import{L as ae}from"./Layout-43e13fa9.js";import{B as oe}from"./BulkIconButton-d9b5ea98.js";import{h as he}from"./html2pdf-da1d79a6.js";import{M as z}from"./Modal-187d8da3.js";import{B as J}from"./Button-b6d67e99.js";import{B as xe}from"./BulkUploadModal-2b6b60a8.js";import{M as me}from"./MultipleUpload-d96a866d.js";import{i as ue}from"./index-c8db368f.js";import{u as X}from"./index-be7773a3.js";import{C as je}from"./ContentModal-21794ab7.js";import{N as ge}from"./NotFound-7313ec07.js";import"./lodash-b4f5a0b3.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-2ac5390d.js";import"./formatting-9de8c923.js";import"./search-06c27bea.js";import"./index-5f18d908.js";import"./Button-b3071be7.js";function be({showReport:a,handleCloseReport:n,selectedRow:c,reportData:s}){var g,x,o,m,r,i,b,h,d,f,N,p,C,H,_,k,u,S,I,L,F,T,R,P,E,B,O,U,q,W,$,Y,G,A;const l=j.useRef(),w=()=>{const t=l.current;he().from(t).set({margin:1,filename:"modal-content.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()};return console.log(s),e.jsx(e.Fragment,{children:e.jsxs(z,{show:a,onHide:n,fullscreen:!0,children:[e.jsx(z.Body,{ref:l,children:e.jsxs("div",{style:{border:"3px solid #176987",width:"100%",padding:"20px"},children:[e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("div",{children:"CrediSafe"}),e.jsx("div",{children:"Securing you rental investments"})]}),e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{})]}),e.jsxs("div",{style:{lineHeight:"10px"},children:[e.jsx("p",{style:{textAlign:"right"},children:"+263 71 882 2460"}),e.jsx("p",{style:{textAlign:"right"},children:"credisafezw@gmail.com"}),e.jsx("p",{style:{textAlign:"right"},children:" www.credi-safe.com"})]})]})]}),e.jsx("div",{className:"mt-5 mb-2",children:e.jsxs("h6",{children:["Rent Payment Status Report on"," ",e.jsxs("span",{style:{fontWeight:"bold",color:"#176987"},children:[((g=s==null?void 0:s.company_details)==null?void 0:g.trading_name)||((x=s==null?void 0:s.company_details)==null?void 0:x.registration_name)," "]}),"as at ",Date().toLocaleString()]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"5px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#190062"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"PAYMENT STATUS CLASSIFICATION/INDICATOR"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center",children:"Status"}),e.jsx("td",{style:{backgroundColor:((o=s==null?void 0:s.risk_data)==null?void 0:o.class)=="non-payer"?(m=s==null?void 0:s.risk_data)==null?void 0:m.color:((r=s==null?void 0:s.risk_data)==null?void 0:r.class)=="high-high"?(i=s==null?void 0:s.risk_data)==null?void 0:i.color:((b=s==null?void 0:s.risk_data)==null?void 0:b.class)=="high"?(h=s==null?void 0:s.risk_data)==null?void 0:h.color:((d=s==null?void 0:s.risk_data)==null?void 0:d.class)=="medium"?(f=s==null?void 0:s.risk_data)==null?void 0:f.color:((N=s==null?void 0:s.risk_data)==null?void 0:N.class)=="low"?(p=s==null?void 0:s.risk_data)==null?void 0:p.color:"",color:((C=s==null?void 0:s.risk_data)==null?void 0:C.class)=="non-payer"?"white":""},className:"text-center text-white",children:((H=s==null?void 0:s.risk_data)==null?void 0:H.class)=="non-payer"?"Non-Payer":((_=s==null?void 0:s.risk_data)==null?void 0:_.class)=="high-high"?"High-High":((k=s==null?void 0:s.risk_data)==null?void 0:k.class)=="high"?"High":((u=s==null?void 0:s.risk_data)==null?void 0:u.class)=="medium"?"Medium":((S=s==null?void 0:s.risk_data)==null?void 0:S.class)=="low"?"Low":""})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#808080"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"STATUS INDEX"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center bg-success text-white",children:"Low"}),e.jsx("td",{style:{fontWeight:"bold"},className:"text-center bg-warning text-white",children:"Medium Risk"}),e.jsx("td",{style:{backgroundColor:"#ff33cc",fontWeight:"bold"},className:"text-center text-white",children:"High Risk - Lower"}),e.jsx("td",{style:{fontWeight:"bold",backgroundColor:"red"},className:"text-center text-white",children:"High Risk - Upper"}),e.jsx("td",{style:{fontWeight:"bold"},className:"text-center bg-dark text-white",children:"None Payer"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center text-nowrap",children:"Current"}),e.jsx("td",{className:"text-center text-nowrap",children:"1st Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"2nd Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"3rd Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"+3 Months Outstanding"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center text-white",children:"COMPANY DETAILS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Registration Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Registered Name :"}),e.jsxs("td",{children:[(I=s==null?void 0:s.company_details)==null?void 0:I.registration_name," "]}),e.jsx("td",{children:"Trading Name:"}),e.jsx("td",{children:(L=s==null?void 0:s.company_details)==null?void 0:L.trading_name})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Registration number:"}),e.jsx("td",{children:(F=s==null?void 0:s.company_details)==null?void 0:F.registration_number}),e.jsx("td",{children:"Year of registration:"}),e.jsx("td",{children:(T=s==null?void 0:s.company_details)==null?void 0:T.registration_date})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Trading Status:"}),e.jsx("td",{children:(R=s==null?void 0:s.company_details)==null?void 0:R.trading_status}),e.jsx("td",{children:"Industry Sector"}),e.jsx("td",{children:(P=s==null?void 0:s.company_details)==null?void 0:P.industry})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center",children:"Contact Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Telephone No.:"}),e.jsx("td",{children:(E=s==null?void 0:s.company_details)==null?void 0:E.telephone}),e.jsx("td",{children:"Mobile No.:"}),e.jsx("td",{children:(B=s==null?void 0:s.company_details)==null?void 0:B.mobile_phone})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Physical Address:"}),e.jsx("td",{colSpan:3,children:(O=s==null?void 0:s.company_details)==null?void 0:O.current_address})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Email :"}),e.jsx("td",{children:(U=s==null?void 0:s.company_details)==null?void 0:U.email}),e.jsx("td",{children:"Website:"}),e.jsx("td",{children:(q=s==null?void 0:s.company_details)==null?void 0:q.website})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"OUTSTANDING RENTALS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center ",children:"Claims"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Claimant"}),e.jsx("td",{children:"Type"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Date of Claim "})]}),((W=s==null?void 0:s.claims_list)==null?void 0:W.length)>0&&(($=s==null?void 0:s.claims_list)==null?void 0:$.map((t,y)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:t.creditor}),e.jsx("td",{children:t.type}),e.jsx("td",{children:t.currency}),e.jsx("td",{children:t!=null&&t.owing_amount?Number(t.owing_amount).toFixed(2):""}),e.jsx("td",{children:t.claim_date})]},"claim"+y)))]})})})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center",children:"Active"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Creditor"}),e.jsx("td",{children:"Type"}),e.jsx("td",{children:"Outstanding since"}),e.jsx("td",{children:"Amount"})]}),(Y=s==null?void 0:s.credit_details)==null?void 0:Y.map(t=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:t.credit_type}),e.jsxs("td",{children:[" ",t.type||""]}),e.jsxs("td",{children:[" ",t.start_date]}),e.jsxs("td",{children:[" ",t!=null&&t.overdue_amount?Number(t.overdue_amount).toFixed(2):""]})]},t.lease_id))]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Historic"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"",scope:"row",colSpan:2,children:"Creditor"}),e.jsx("td",{className:"",children:"Type"}),e.jsx("td",{className:"",children:"Outstanding Since"}),e.jsx("td",{className:"",children:" Amount"})]}),((G=s==null?void 0:s.historic_claims_list)==null?void 0:G.length)>0&&((A=s==null?void 0:s.historic_claims_list)==null?void 0:A.map((t,y)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsxs("th",{scope:"row",colSpan:2,children:[" ",t==null?void 0:t.creditor]}),e.jsx("td",{children:(t==null?void 0:t.type)||""}),e.jsx("td",{children:t==null?void 0:t.claim_date}),e.jsx("td",{children:t!=null&&t.balance_amount?Number(t.balance_amount).toFixed(2):""})]},"claim"+y)))]})})]})}),e.jsxs("div",{style:{width:"100%",padding:"2px"},children:[e.jsx("hr",{}),e.jsxs("div",{children:[e.jsx("p",{children:"Disclaimer: This report is confidential and intended solely for the individual or entity to whom it is addressed. Information on this report is valid at the time of enquiry only. If verification is required, please contact us on the details provided above."}),e.jsx("p",{children:"Terms and Conditions apply."}),e.jsx("p",{children:"Copyrights © CrediSafe Zimbabwe"}),e.jsx("p",{children:"All rights reserved"})]})]})]})}),e.jsxs(z.Footer,{children:[e.jsx(J,{variant:"secondary",onClick:n,children:"Close"}),e.jsx(J,{variant:"primary",onClick:w,children:"Print"})]})]})})}function Ne(a){const[n,c]=j.useState(!1),[s,l]=j.useState(!1),[w,g]=j.useState([]),[x,o]=j.useState(!1),[m,r]=j.useState(!1),[i,b]=j.useState(!1),[h,d]=j.useState(!0),[f,N]=j.useState(!1),[p,C]=j.useState(),[H,_]=j.useState(!1),[k,u]=j.useState({}),[S,I]=j.useState(!1),[L,F]=j.useState(null),{data:T,setData:R,post:P}=K({searchParam:"registration_name",searchValue:""}),E=()=>c(!1),B=()=>c(!0),O=()=>_(!1),U=()=>N(!0);function q(A,t){A.preventDefault();try{r(!0),v.loading("Loading...",{duration:2500,position:"top-center"}),t&&(Z.post(reverseUrl("enquiry_count"),{isIndividual:!1,isCompany:!0,companyId:t}).then(y=>{}),Z.post(reverseUrl("company-report"),{companyId:t}).then(y=>{var Q,D;F(t),(Q=y.data)!=null&&Q.is_eligible?(D=y.data)!=null&&D.require_otp?(I(!0),C(y.data)):(_(!0),C(y.data)):v.error("You have exhausted your free enquiries. Please subscribe to get more enquiries.",{duration:4e3,id:"error_"})}).catch(y=>{console.error("There was an error!",y)}))}finally{r(!1)}}function W(){d(!0),b(!1)}function $(){b(!0),d(!1)}function Y(A){R(V(M({},T),{[A.target.id]:A.target.value}))}function G(A){if(A.preventDefault(),T.searchValue===""){u({searchValue:"Please enter a search value"});return}P(reverseUrl(a),{onStart:()=>{o(!0),g({}),u({}),l(!1)},onSuccess:t=>{t.props.result.length===0&&l(!0),t.props.result.length>0&&g(t.props.result),o(!1)},onError:()=>{v.error("Nothing to search..."),o(!1)}})}return{data:T,show:n,notFound:s,errors:k,isSingle:h,isBulkAdd:f,reportData:p,showReport:H,showVerify:S,isMultiple:i,selectedRow:L,isLoading:x,fetchedData:w,isReportLoading:m,handleShow:B,handleClose:E,setNotFound:l,setIsBulkAdd:N,handleSingle:W,setShowReport:_,changeHandler:Y,submitHandler:G,setShowVerify:I,handleMultiple:$,handleShowReport:q,handleCloseReport:O,handleBulkButtonClick:U}}const fe=({show:a,handleClose:n,url:c,setVerified:s,verification_type:l,setCreditInfo:w})=>{const[g,x]=j.useState(!1),[o,m]=j.useState({}),{data:r,setData:i,post:b,reset:h}=K({otp:"",verification_type:l}),[d,f]=j.useState(!1),[N,p]=j.useState(30);j.useEffect(()=>{const u=setInterval(()=>{p(S=>S<=1?(clearInterval(u),f(!0),0):S-1)},1e3);return()=>clearInterval(u)},[]);const C=()=>ne(void 0,null,function*(){f(!1);try{(yield Z.get(reverseUrl("new_otp"))).data.status==="success"?v.success("OTP sent successfully"):v.error("Something went wrong! Please try again")}catch(u){v.error("Something went wrong! Please try again")}}),H=u=>i(V(M({},r),{[u.target.id]:u.target.value})),_=()=>r.otp.length!==4?(m({otp:"otp must be four digits"}),!1):parseInt(r.otp,10)?!0:(m({otp:"otp must be a number"}),!1),k=u=>{u.preventDefault(),v.loading("Loading...",{position:"top-center",id:"loading",duration:2500}),_()&&(b(reverseUrl(c),{onStart:()=>{x(!0)},onSuccess:S=>{n(),h(),v.success("User verified successfully"),x(!1),s(!0)},onError:S=>{v.error("Something went wrong! Please try again"),m(S),x(!1)}}),x(!1))};return e.jsx(e.Fragment,{children:e.jsx(z,{size:"lg",show:a,onHide:n,centered:!0,children:e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx(z.Header,{closeButton:!0,className:"card-header bg-info px-4",children:e.jsxs("div",{className:`d-flex justify-content-between
                                align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:"Verify OTP"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"card",children:e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsx(z.Body,{children:e.jsxs("div",{className:"row mb-4",children:[e.jsxs("div",{className:"col-md-12",children:[e.jsx("div",{children:e.jsx("p",{children:l==="individual"?"Enter the 4-digit code we sent to user's mobile number. This code will expire after 5 minutes":"Enter the 4-digit code we sent to user's email. This code will expire after 5 minutes"})}),e.jsx("div",{className:"row",children:e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Verification Code"}),e.jsx("input",{value:r.otp,onChange:H,type:"text",name:"otp",id:"otp",placeholder:"Enter your 4 digit otp",className:"form-control form-control-sm"}),o&&e.jsx("div",{className:"text-danger mt-1",children:o.otp})]})})]}),e.jsxs("div",{className:"mt-5 d-flex gap-4 align-items-center ",children:[e.jsxs("p",{children:["Didn't receive code?",e.jsx("button",{onClick:C,className:"ms-2 text-decoration-underline border-0 bg-transparent text-info",disabled:d===!1,children:"Resend Code"})]}),N>0&&e.jsx("p",{className:"text-success",children:`Resend code in ${N} seconds`})]})]})}),e.jsx(z.Footer,{children:e.jsx(J,{className:"text-white",variant:"info",onClick:u=>k(u),disabled:g,children:g?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Verify"})})]})})})]})})})})};function pe(a,n,c,s){const{data:l,errors:w,processing:g,setData:x,reset:o,post:m}=K({note:(n==null?void 0:n.note)||"",company_id:(n==null?void 0:n.id)||"",branch:(n==null?void 0:n.branch)||"",website:(n==null?void 0:n.website)||"",landLine:(n==null?void 0:n.landline)||"",industry:(n==null?void 0:n.industry)||"",emailAddress:(n==null?void 0:n.email)||"",is_gvt:(n==null?void 0:n.is_government)||!1,vatNumber:(n==null?void 0:n.vat_number)||"",tinNumber:(n==null?void 0:n.tin_number)||"",currentAddress:(n==null?void 0:n.address)||"",tradingName:(n==null?void 0:n.trading_name)||"",mobileNumber:(n==null?void 0:n.mobile_phone)||"",is_contracted:(n==null?void 0:n.is_contracted)||!1,registeredName:(n==null?void 0:n.registration_name)||"",registrationDate:(n==null?void 0:n.registration_date)||"",companyRegistrationNumber:(n==null?void 0:n.registration_number)||""});function r(h){h.target.id==="is_gvt"?x(V(M({},l),{[h.target.id]:h.target.checked})):x(V(M({},l),{[h.target.id]:h.target.value}))}function i(h){h.preventDefault(),l.registeredName=l.branch?`${l.registeredName.split(" - ")[0]} - ${l.branch}`:l.registeredName,m(reverseUrl("edit_company_user"),{onSuccess(d){(d==null?void 0:d.status)==="success"?(v.success(d.data.message),s(f=>[...f.filter(p=>p.id!==l.company_id),{id:l.company_id,registration_name:l.registeredName,trading_name:l.tradingName,registration_number:l.companyRegistrationNumber,registration_date:l.registrationDate,vat_number:l.vatNumber,tin_number:l.tinNumber,address:l.currentAddress,landline:l.landLine,mobile_phone:l.mobileNumber,email:l.emailAddress,website:l.website,industry:l.industry,note:l.note}]),o(),c()):v.error(X(d))}})}function b(h){h.preventDefault(),l.registeredName+=l.branch?" - "+l.branch:"",m(reverseUrl(a),{onSuccess(d){d.props.success?(o(),c(),v.success(d.props.success)):v.error(X(d))},onError(d){v.error(X(d))}})}return{data:l,errors:w,isLoading:g,handleEdit:i,submitSingle:b,changeHandler:r}}const ve=({show:a,handleClose:n,isSingle:c,handleSingle:s,isMultiple:l,handleMultiple:w,url:g,action:x,companyData:o,setFetchedData:m})=>{const{data:r,errors:i,isLoading:b,handleEdit:h,changeHandler:d,submitSingle:f}=pe(g,o,n,m),N=c?"single":l?"multiple":"";return e.jsx(je,{size:"lg",show:a,handleClose:n,titleOverideContent:e.jsxs("div",{className:"d-flex gap-2",children:[e.jsx("button",{className:`btn btn-sm ${N==="single"?"btn-info text-white":"btn-light border border-2"}`,onClick:s,children:"Single"}),e.jsx("button",{className:`btn btn-sm ${N==="multiple"?"btn-info text-white":"btn-light border border-2"}`,onClick:w,children:"Multiple"})]}),children:e.jsx("div",{style:{minHeight:"600px"},className:"p-3",children:N==="single"?e.jsxs("form",{onSubmit:x==="create"?f:h,children:[e.jsxs("fieldset",{className:"p-4 mb-4",children:[e.jsx("legend",{children:x==="create"?"Add Company":"Edit Company"}),e.jsxs("p",{className:"text-center fw-bold",children:["All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsxs("div",{className:"row row-cols-3 mb-4",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"form-label",children:["Registered Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{required:!0,value:r.registeredName,onChange:d,name:"registeredName",id:"registeredName",className:"form-control"}),!(i!=null&&i.registeredName)&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.registeredName})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"form-label",children:["Trading Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{required:!0,value:r.tradingName,onChange:d,name:"tradingName",id:"tradingName",className:"form-control"}),(i==null?void 0:i.tradingName)&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.tradingName})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Branch"}),e.jsx("input",{value:r.branch,onChange:d,id:"branch",name:"branch",className:"form-control"}),(i==null?void 0:i.branch)&&e.jsx("div",{className:"px-2 small text-danger mt-1",children:i.branch})]})]}),e.jsxs("div",{className:"row row-cols-3 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Registration Number"}),e.jsx("input",{value:r.companyRegistrationNumber,onChange:d,name:"companyRegistrationNumber",id:"companyRegistrationNumber",placeholder:"eg. 000/984/2020",className:"form-control"}),(i==null?void 0:i.companyRegistrationNumber)&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.companyRegistrationNumber})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Registration Date"}),e.jsx("input",{value:r.registrationDate,onChange:d,type:"date",name:"registrationDate",id:"registrationDate",className:"form-control"}),i.registrationDate&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.registrationDate})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"VAT Number"}),e.jsx("input",{value:r.vatNumber,onChange:d,name:"vatNumber",id:"vatNumber",placeholder:"eg. 1123456789",className:"form-control"}),(i==null?void 0:i.vatNumber)&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.vatNumber})]})]}),e.jsxs("div",{className:"row row-cols-3 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"TIN Number"}),e.jsx("input",{value:r.tinNumber,onChange:d,type:"text",name:"tinNumber",id:"tinNumber",className:"form-control"}),(i==null?void 0:i.tinNumber)&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.tinNumber})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"form-label",children:["Current Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{required:!0,value:r.currentAddress,onChange:d,name:"currentAddress",placeholder:"eg. 1234 Main St",id:"currentAddress",className:"form-control"}),(i==null?void 0:i.currentAddress)&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.currentAddress})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Telephone Number"}),e.jsx("input",{type:"tel",value:r.landLine,onChange:d,placeholder:"123-456-7890",name:"landLine",id:"landLine",className:"form-control"}),(i==null?void 0:i.landLine)&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.landLine})]})]}),e.jsxs("div",{className:"row row-cols-3 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Mobile Number"}),e.jsx("input",{type:"tel",value:r.mobileNumber,onChange:d,placeholder:'eg. "263712345612"',id:"mobileNumber",name:"mobileNumber",className:"form-control"}),(i==null?void 0:i.mobileNumber)&&e.jsx("div",{className:"px-2 small text-danger mt-1",children:i.mobileNumber})]}),e.jsxs("div",{children:[e.jsxs("label",{className:"form-label",children:["Email Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{required:!0,type:"email",value:r.emailAddress,onChange:d,name:"emailAddress",id:"emailAddress",placeholder:"example@company.com",className:"form-control"}),(i==null?void 0:i.emailAddress)&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.emailAddress})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Website"}),e.jsx("input",{type:"url",value:r.website,onChange:d,id:"website",name:"website",placeholder:"https://your-website.com",className:"form-control"}),(i==null?void 0:i.website)&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.website})]})]}),e.jsxs("div",{className:"row row-cols-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Industry"}),e.jsxs("select",{className:"form-select",name:"industry",id:"industry",value:r.industry,onChange:d,children:[e.jsx("option",{children:"Select..."}),ue.map(p=>e.jsx("option",{value:p,children:p},p))]}),(i==null?void 0:i.industry)&&e.jsx("div",{className:"small px-2 text-danger mt-1",children:i.industry})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label"}),e.jsxs("div",{className:"form-check d-flex justify-content-center gap-2",children:[e.jsx("input",{className:"form-check-input",type:"checkbox",name:"is_gvt",id:"is_gvt",checked:r.is_gvt,onChange:d}),e.jsx("label",{className:"form-check-label",children:"Government Org "})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Note"}),e.jsx("input",{value:r.note,onChange:d,id:"note",name:"note",placeholder:"additional notes...",className:"form-control"}),(i==null?void 0:i.note)&&e.jsx("div",{className:"px-2 small text-danger mt-1",children:i.note})]})]})]}),e.jsx("div",{className:"text-end",children:e.jsx("button",{type:"submit",disabled:b,className:"btn btn-info text-white",children:b?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"processing.."})]}):"Save and Proceed"})})]}):e.jsx(me,{type:"company",actionType:"user"})})})};function we({url:a}){const{data:n,show:c,notFound:s,errors:l,isSingle:w,isBulkAdd:g,reportData:x,showReport:o,showVerify:m,isMultiple:r,selectedRow:i,isLoading:b,fetchedData:h,isReportLoading:d,handleShow:f,handleClose:N,setNotFound:p,setIsBulkAdd:C,handleSingle:H,setShowReport:_,changeHandler:k,submitHandler:u,setShowVerify:S,handleMultiple:I,handleShowReport:L,handleCloseReport:F,handleBulkButtonClick:T}=Ne(a);return e.jsxs("div",{children:[e.jsxs(e.Fragment,{children:[e.jsx(ce,{title:"Search Company"}),e.jsx(xe,{type:"company",actionType:"user",show:g,handleClose:()=>C(!1)}),e.jsx(be,{showReport:o,handleCloseReport:F,selectedRow:i,reportData:x}),e.jsx(fe,{show:m,handleClose:()=>S(!1),setVerified:_,verification_type:"company",url:"verify_company_otp"}),e.jsx(ve,{show:c,handleClose:N,handleShow:f,isSingle:w,handleSingle:H,isMultiple:r,handleMultiple:I,url:"client-create-company",action:"create"})]}),e.jsxs("div",{className:"container-xl",children:[e.jsx("h4",{className:"bg-info text-white p-2 rounded rounded-5 text-center mb-4",children:"Search Company"}),e.jsxs("table",{className:"table table-sm table-bordered border-2 bg-white",children:[e.jsxs("thead",{className:"position-sticky c-table-top bg-white c-z-5",children:[e.jsx("tr",{children:e.jsx("th",{colSpan:4,children:e.jsxs("form",{className:"d-flex gap-3 align-items-end p-2",onSubmit:u,children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"searchValue",children:"Filter by Registered Name / Number"}),e.jsx("input",{className:"form-control form-control",value:n.searchValue,onChange:k,placeholder:"search...",name:"searchValue",id:"searchValue"}),l.searchValue&&e.jsx("small",{className:"text-danger p-1",children:l.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"searchParam",children:"Select filter Parameter"}),e.jsxs("select",{name:"searchParam",id:"searchParam",className:"form-select",onChange:k,children:[e.jsx("option",{value:"registration_name",children:"Registered Name"}),e.jsx("option",{value:"registration_number",children:"Registration Number"})]})]}),e.jsxs("button",{type:"submit",disabled:b,className:"btn btn-info text-white",children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),b?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"Searching.."})]}):"Search"]}),e.jsx(oe,{handleClick:T})]})})}),e.jsxs("tr",{className:"c-bg-light",children:[e.jsx("th",{className:"px-3",children:"Registered Name"}),e.jsx("th",{className:"px-3",children:"Registration Number"}),e.jsx("th",{className:"px-3 text-center",children:"Select"})]})]}),e.jsx("tbody",{children:b?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsxs("div",{className:"custom-h-2 d-flex align-items-center justify-content-center p-5",children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm me-2 text-info"}),e.jsx("span",{children:"Searching.."})]})})}):(h==null?void 0:h.length)>0&&h.map(R=>e.jsxs("tr",{children:[e.jsx("td",{className:"px-3",children:R.registration_name}),e.jsx("td",{className:"px-3",children:R.registration_number}),e.jsx("td",{className:"text-center",children:e.jsx("button",{disabled:d,className:"btn btn-info text-white text-center justify-content-center w-100 btn-sm",onClick:P=>L(P,R.id),children:d?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"processing.."})]}):"View"})})]},R.id))})]}),s&&e.jsx("div",{className:"d-flex justify-content-center bg-white p-4",children:e.jsx(ge,{handleShow:f,userType:"company",searchValue:n.searchValue,handleCloseModal:()=>p(!1)})})]})]})}function Se(){return e.jsx(we,{url:"cl-search-companies"})}Se.layout=a=>e.jsx(ae,{children:a});export{Se as default};
