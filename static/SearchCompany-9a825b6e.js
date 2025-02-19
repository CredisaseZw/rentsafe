var de=Object.defineProperty,re=Object.defineProperties;var ce=Object.getOwnPropertyDescriptors;var se=Object.getOwnPropertySymbols;var ae=Object.prototype.hasOwnProperty,oe=Object.prototype.propertyIsEnumerable;var le=(o,d,h)=>d in o?de(o,d,{enumerable:!0,configurable:!0,writable:!0,value:h}):o[d]=h,O=(o,d)=>{for(var h in d||(d={}))ae.call(d,h)&&le(o,h,d[h]);if(se)for(var h of se(d))oe.call(d,h)&&le(o,h,d[h]);return o},U=(o,d)=>re(o,ce(d));var ne=(o,d,h)=>new Promise((s,g)=>{var T=m=>{try{u(h.next(m))}catch(j){g(j)}},f=m=>{try{u(h.throw(m))}catch(j){g(j)}},u=m=>m.done?s(m.value):Promise.resolve(m.value).then(T,f);u((h=h.apply(o,d)).next())});import{r as c,a as D,j as e,b as K,u as he,H as me}from"./main-76766219.js";import{L as xe}from"./Layout-6c58fe9b.js";import{_ as N,I as je}from"./index-f332af68.js";import{N as ue}from"./NotFound-1037ec69.js";import{P as ge}from"./PageHeader-51012471.js";import{M as be}from"./MultipleUpload-43545023.js";import{i as Ne}from"./index-b3b37505.js";import{M as w}from"./Modal-fcea6098.js";import{B as Q}from"./Button-bb7ca1fe.js";import{h as fe}from"./html2pdf-b03ae79a.js";import{B as pe}from"./BulkUploadModal-92b5518f.js";import{B as ve}from"./BulkIconButton-683158a6.js";import"./index-7202a5e9.js";import"./formatting-345d2430.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-2ac7fbcb.js";import"./search-b580d3c8.js";import"./index-34f41ab4.js";import"./Button-28ce796a.js";const ye=({show:o,handleClose:d,handleShow:h,setAddSuccessful:s,isSingle:g,handleSingle:T,isMultiple:f,handleMultiple:u,url:m,action:j,companyData:n,setFetchedData:S})=>{const[p,v]=c.useState(!1),[i,_]=c.useState(""),{data:l,setData:C,post:k,reset:I}=D({registeredName:n?n.registration_name:"",tradingName:n?n.trading_name:"",branch:n?n.branch:"",companyRegistrationNumber:n?n.registration_number:"",registrationDate:n?n.registration_date:"",vatNumber:n?n.vat_number:"",currentAddress:n?n.address:"",landLine:n?n.landline:"",mobileNumber:n?n.mobile_phone:"",emailAddress:n?n.email:"",website:n?n.website:"",industry:n?n.industry:"",note:n?n.note:"",is_gvt:n?n.is_government:!1,company_id:n?n.id:"",is_contracted:n?n.is_contracted:!1}),a=r=>{r.target.id==="is_gvt"?C(U(O({},l),{[r.target.id]:r.target.checked})):C(U(O({},l),{[r.target.id]:r.target.value}))},P=r=>{var b;r.preventDefault(),l.registeredName=l.branch!==""&&!((b=l.registeredName.split(" - ").at(-1))!=null&&b.length)?l.registeredName+" - "+l.branch:l.registeredName,K.post(reverseUrl("edit_company_user"),l).then(z=>{var A;z.data.status==="success"?(N.success(z.data.message),S(L=>[...L.filter(E=>E.id!==l.company_id),{id:l.company_id,registration_name:l.registeredName,trading_name:l.tradingName,registration_number:l.companyRegistrationNumber,registration_date:l.registrationDate,vat_number:l.vatNumber,address:l.currentAddress,landline:l.landLine,mobile_phone:l.mobileNumber,email:l.emailAddress,website:l.website,industry:l.industry,note:l.note}]),d()):(N.error(((A=z.data)==null?void 0:A.message)||"Something went wrong! Please try again"),d())})},x=r=>{r.preventDefault(),l.registeredName=l.branch!==""?l.registeredName+" - "+l.branch:l.registeredName,k(reverseUrl(m),{onStart:()=>{v(!0),_("")},onSuccess:b=>{I(),b.props.success?(N.success(b.props.success),v(!1),d(),s(!0)):N.error(b.props.error)},onError:b=>{N.error("Something went wrong! Please try again"),_(b),v(!1)}})};return e.jsx(e.Fragment,{children:e.jsx(w,{size:"lg",show:o,onHide:d,children:e.jsxs("div",{className:"card",children:[e.jsx(w.Header,{closeButton:!0,className:"card-header bg-transparent",style:{paddingLeft:"0px"},children:e.jsxs("div",{className:"",children:[e.jsx("button",{className:`btn  btn-sm ${g?"btn-info text-white":"btn-light"}`,onClick:T,children:"Single"}),e.jsx("button",{className:`btn  btn-sm ${f?"btn-info text-white":"btn-light"}`,onClick:u,children:"Multiple"})]})}),e.jsxs("div",{className:"card-body",style:{padding:"0px",borderStyle:"solid",borderColor:"#26a69a"},children:[g?e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx("div",{className:"card-header bg-info",children:e.jsxs("div",{className:`d-flex justify-content-between
                            align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:j==="create"?"Add Company":"Edit Company"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Company details"}),e.jsx("div",{className:"card-text"})]})})}),e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(w.Body,{children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-md-12 my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Registered Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.registeredName,onChange:a,type:"text",required:!0,name:"registeredName",id:"registeredName",placeholder:"eg. Company Name",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.registeredName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Trading Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.tradingName,onChange:a,type:"text",required:!0,name:"tradingName",id:"tradingName",placeholder:"eg. Company Name",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.tradingName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Branch"}),e.jsx("input",{value:l.branch,onChange:a,type:"text",id:"branch",name:"branch",placeholder:"Company Branch",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.branch})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Registration Number"}),e.jsx("input",{value:l.companyRegistrationNumber,onChange:a,type:"text",name:"companyRegistrationNumber",id:"companyRegistrationNumber",placeholder:"eg. 000/984/2020",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.companyRegistrationNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Registration Date"}),e.jsx("input",{value:l.registrationDate,onChange:a,type:"date",name:"registrationDate",id:"registrationDate",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.registrationDate})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"VAT Number"}),e.jsx("input",{value:l.vatNumber,onChange:a,type:"text",name:"vatNumber",id:"vatNumber",placeholder:"eg. 1123456789",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.vatNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Current Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{value:l.currentAddress,onChange:a,type:"text",name:"currentAddress",required:!0,rows:"2",placeholder:"eg. 1234 Main St",id:"currentAddress",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.currentAddress})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Telephone Number"}),e.jsx("input",{value:l.landLine,onChange:a,type:"tel",placeholder:"123-456-7890",name:"landLine",id:"landLine",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.landLine})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Mobile Number"}),e.jsx("input",{value:l.mobileNumber,onChange:a,type:"tel",placeholder:'eg. "263712345612"',id:"mobileNumber",name:"mobileNumber",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.mobileNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Email Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:l.emailAddress,onChange:a,type:"email",required:!0,name:"emailAddress",placeholder:"your-name@company-name.com",id:"emailAddress",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.emailAddress})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Website"}),e.jsx("input",{value:l.website,onChange:a,type:"url",id:"website",name:"website",placeholder:"https://your-website.com",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.website})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Industry"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"industry",id:"industry",value:l.industry,onChange:a,children:[e.jsx("option",{children:"Select..."}),Ne.map(r=>e.jsx("option",{value:r,children:r},r))]}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.industry}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.industry})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4 d-flex gap-2",children:[e.jsx("label",{className:"form-label",children:"Government Org"}),e.jsx("input",{type:"checkbox",name:"is_gvt",id:"is_gvt",checked:l.is_gvt,onChange:a,className:"form-check-input border-1 border-black"})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Note"}),e.jsx("textarea",{value:l.note,onChange:a,type:"text",id:"note",name:"note",placeholder:"Write your additional note here...",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.note})]})]})})})]}),e.jsx(w.Footer,{children:e.jsx(Q,{className:"text-white",variant:"info",onClick:j==="create"?x:P,disabled:p,children:p?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Save and Proceed"})})]})]})})]})}):"",f?e.jsx(be,{type:"company",actionType:"user"}):""]})]})})})},we=({show:o,handleClose:d,url:h,setVerified:s,verification_type:g,setCreditInfo:T})=>{const[f,u]=c.useState(!1),[m,j]=c.useState({}),{data:n,setData:S,post:p,reset:v}=D({otp:"",verification_type:g}),[i,_]=c.useState(!1),[l,C]=c.useState(30);c.useEffect(()=>{const x=setInterval(()=>{C(r=>r<=1?(clearInterval(x),_(!0),0):r-1)},1e3);return()=>clearInterval(x)},[]);const k=()=>ne(void 0,null,function*(){_(!1);try{(yield K.get(reverseUrl("new_otp"))).data.status==="success"?N.success("OTP sent successfully"):N.error("Something went wrong! Please try again")}catch(x){N.error("Something went wrong! Please try again")}}),I=x=>S(U(O({},n),{[x.target.id]:x.target.value})),a=()=>n.otp.length!==4?(j({otp:"otp must be four digits"}),!1):parseInt(n.otp,10)?!0:(j({otp:"otp must be a number"}),!1),P=x=>{x.preventDefault(),N.loading("Loading...",{position:"top-center",id:"loading",duration:2500}),a()&&(p(reverseUrl(h),{onStart:()=>{u(!0)},onSuccess:r=>{d(),v(),N.success("User verified successfully"),u(!1),s(!0)},onError:r=>{N.error("Something went wrong! Please try again"),j(r),u(!1)}}),u(!1))};return e.jsx(e.Fragment,{children:e.jsx(w,{size:"lg",show:o,onHide:d,centered:!0,children:e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx(w.Header,{closeButton:!0,className:"card-header bg-info px-4",children:e.jsxs("div",{className:`d-flex justify-content-between
                                align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:"Verify OTP"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"card",children:e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsx(w.Body,{children:e.jsxs("div",{className:"row mb-4",children:[e.jsxs("div",{className:"col-md-12",children:[e.jsx("div",{children:e.jsx("p",{children:g==="individual"?"Enter the 4-digit code we sent to user's mobile number. This code will expire after 5 minutes":"Enter the 4-digit code we sent to user's email. This code will expire after 5 minutes"})}),e.jsx("div",{className:"row",children:e.jsxs("div",{className:"col-md-6",children:[e.jsx("label",{className:"form-label",children:"Verification Code"}),e.jsx("input",{value:n.otp,onChange:I,type:"text",name:"otp",id:"otp",placeholder:"Enter your 4 digit otp",className:"form-control form-control-sm"}),m&&e.jsx("div",{className:"text-danger mt-1",children:m.otp})]})})]}),e.jsxs("div",{className:"mt-5 d-flex gap-4 align-items-center ",children:[e.jsxs("p",{children:["Didn't receive code?",e.jsx("button",{onClick:k,className:"ms-2 text-decoration-underline border-0 bg-transparent text-info",disabled:i===!1,children:"Resend Code"})]}),l>0&&e.jsx("p",{className:"text-success",children:`Resend code in ${l} seconds`})]})]})}),e.jsx(w.Footer,{children:e.jsx(Q,{className:"text-white",variant:"info",onClick:x=>P(x),disabled:f,children:f?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Verify"})})]})})})]})})})})};function Se({showReport:o,handleCloseReport:d,selectedRow:h,reportData:s}){var f,u,m,j,n,S,p,v,i,_,l,C,k,I,a,P,x,r,b,z,A,L,B,E,q,V,W,Y,$,G,X,F,Z;const g=c.useRef();console.log(s);const T=()=>{const t=g.current;fe().from(t).set({margin:1,filename:"modal-content.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()};return e.jsx(e.Fragment,{children:e.jsxs(w,{show:o,onHide:d,fullscreen:!0,children:[e.jsx(w.Body,{ref:g,children:e.jsxs("div",{style:{border:"3px solid #176987",width:"100%",padding:"20px"},children:[e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("div",{children:"CrediSafe"}),e.jsx("div",{children:"Securing you rental investments"})]}),e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{})]}),e.jsxs("div",{style:{lineHeight:"10px"},children:[e.jsx("p",{style:{textAlign:"right"},children:"+263 71 882 2460"}),e.jsx("p",{style:{textAlign:"right"},children:"credisafezw@gmail.com"}),e.jsx("p",{style:{textAlign:"right"},children:" www.credi-safe.com"})]})]})]}),e.jsx("div",{className:"mt-5 mb-2",children:e.jsxs("h6",{children:["Rent Payment Status Report on"," ",e.jsxs("span",{style:{fontWeight:"bold",color:"#176987"},children:[(f=s==null?void 0:s.company_details)==null?void 0:f.registration_name," "]}),"as at ",Date().toLocaleString()]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"5px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#190062"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"PAYMENT STATUS CLASSIFICATION/INDICATOR"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center",children:"Status"}),e.jsx("td",{style:{backgroundColor:((u=s==null?void 0:s.risk_data)==null?void 0:u.class)=="non-payer"?(m=s==null?void 0:s.risk_data)==null?void 0:m.color:((j=s==null?void 0:s.risk_data)==null?void 0:j.class)=="high-high"?(n=s==null?void 0:s.risk_data)==null?void 0:n.color:((S=s==null?void 0:s.risk_data)==null?void 0:S.class)=="high"?(p=s==null?void 0:s.risk_data)==null?void 0:p.color:((v=s==null?void 0:s.risk_data)==null?void 0:v.class)=="medium"?(i=s==null?void 0:s.risk_data)==null?void 0:i.color:((_=s==null?void 0:s.risk_data)==null?void 0:_.class)=="low"?(l=s==null?void 0:s.risk_data)==null?void 0:l.color:"",color:((C=s==null?void 0:s.risk_data)==null?void 0:C.class)=="non-payer"?"white":""},className:"text-center text-white",children:((k=s==null?void 0:s.risk_data)==null?void 0:k.class)=="non-payer"?"Non-Payer":((I=s==null?void 0:s.risk_data)==null?void 0:I.class)=="high-high"?"High-High":((a=s==null?void 0:s.risk_data)==null?void 0:a.class)=="high"?"High":((P=s==null?void 0:s.risk_data)==null?void 0:P.class)=="medium"?"Medium":((x=s==null?void 0:s.risk_data)==null?void 0:x.class)=="low"?"Low":""})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#808080"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"STATUS INDEX"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center bg-success text-white",children:"Low"}),e.jsx("td",{style:{fontWeight:"bold"},className:"text-center bg-warning text-white",children:"Medium Risk"}),e.jsx("td",{style:{backgroundColor:"#ff33cc",fontWeight:"bold"},className:"text-center text-white",children:"High Risk - Lower"}),e.jsx("td",{style:{fontWeight:"bold",backgroundColor:"red"},className:"text-center text-white",children:"High Risk - Upper"}),e.jsx("td",{style:{fontWeight:"bold"},className:"text-center bg-dark text-white",children:"None Payer"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center text-nowrap",children:"Current"}),e.jsx("td",{className:"text-center text-nowrap",children:"1st Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"2nd Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"3rd Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"+3 Months Outstanding"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center text-white",children:"COMPANY DETAILS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Registration Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Registered Name :"}),e.jsxs("td",{children:[(r=s==null?void 0:s.company_details)==null?void 0:r.registration_name," "]}),e.jsx("td",{children:"Trading Name:"}),e.jsx("td",{children:(b=s==null?void 0:s.company_details)==null?void 0:b.trading_name})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Registration number:"}),e.jsx("td",{children:(z=s==null?void 0:s.company_details)==null?void 0:z.registration_number}),e.jsx("td",{children:"Year of registration:"}),e.jsx("td",{children:(A=s==null?void 0:s.company_details)==null?void 0:A.registration_date})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Trading Status:"}),e.jsx("td",{children:(L=s==null?void 0:s.company_details)==null?void 0:L.trading_status}),e.jsx("td",{children:"Industry Sector"}),e.jsx("td",{children:(B=s==null?void 0:s.company_details)==null?void 0:B.industry})]})]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center",children:"Contact Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Telephone No.:"}),e.jsx("td",{children:(E=s==null?void 0:s.company_details)==null?void 0:E.telephone}),e.jsx("td",{children:"Mobile No.:"}),e.jsx("td",{children:(q=s==null?void 0:s.company_details)==null?void 0:q.mobile_phone})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Physical Address:"}),e.jsx("td",{colSpan:3,children:(V=s==null?void 0:s.company_details)==null?void 0:V.current_address})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Email :"}),e.jsx("td",{children:(W=s==null?void 0:s.company_details)==null?void 0:W.email}),e.jsx("td",{children:"Website:"}),e.jsx("td",{children:(Y=s==null?void 0:s.company_details)==null?void 0:Y.website})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"OUTSTANDING RENTALS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center ",children:"Claims"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Claimant"}),e.jsx("td",{children:"Type"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Date of Claim "})]}),(($=s==null?void 0:s.claims_list)==null?void 0:$.length)>0&&((G=s==null?void 0:s.claims_list)==null?void 0:G.map((t,M)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:t.creditor}),e.jsx("td",{children:t.type}),e.jsx("td",{children:t.currency}),e.jsx("td",{children:t!=null&&t.owing_amount?Number(t.owing_amount).toFixed(2):""}),e.jsx("td",{children:t.claim_date})]},"claim"+M)))]})})})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center",children:"Active"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Creditor"}),e.jsx("td",{children:"Type"}),e.jsx("td",{children:"Outstanding since"}),e.jsx("td",{children:"Amount"})]}),(X=s==null?void 0:s.credit_details)==null?void 0:X.map(t=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:t.credit_type}),e.jsxs("td",{children:[" ",t.type||""]}),e.jsxs("td",{children:[" ",t.start_date]}),e.jsxs("td",{children:[" ",t!=null&&t.overdue_amount?Number(t.overdue_amount).toFixed(2):""]})]},t.lease_id))]})}),e.jsx("table",{class:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Historic"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"",scope:"row",colSpan:2,children:"Creditor"}),e.jsx("td",{className:"",children:"Type"}),e.jsx("td",{className:"",children:"Outstanding Since"}),e.jsx("td",{className:"",children:" Amount"})]}),((F=s==null?void 0:s.historic_claims_list)==null?void 0:F.length)>0&&((Z=s==null?void 0:s.historic_claims_list)==null?void 0:Z.map((t,M)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsxs("th",{scope:"row",colSpan:2,children:[" ",t==null?void 0:t.creditor]}),e.jsx("td",{children:(t==null?void 0:t.type)||""}),e.jsx("td",{children:t==null?void 0:t.claim_date}),e.jsx("td",{children:t!=null&&t.balance_amount?Number(t.balance_amount).toFixed(2):""})]},"claim"+M)))]})})]})}),e.jsxs("div",{style:{width:"100%",padding:"2px"},children:[e.jsx("hr",{}),e.jsxs("div",{children:[e.jsx("p",{children:"Disclaimer: This report is confidential and intended solely for the individual or entity to whom it is addressed. Information on this report is valid at the time of enquiry only. If verification is required, please contact us on the details provided above."}),e.jsx("p",{children:"Terms and Conditions apply."}),e.jsx("p",{children:"Copyrights © CrediSafe Zimbabwe"}),e.jsx("p",{children:"All rights reserved"})]})]})]})}),e.jsxs(w.Footer,{children:[e.jsx(Q,{variant:"secondary",onClick:d,children:"Close"}),e.jsx(Q,{variant:"primary",onClick:T,children:"Print"})]})]})})}function _e({url:o}){const[d,h]=c.useState(!1),[s,g]=c.useState(!1),T=()=>g(!1),f=()=>g(!0),[u,m]=c.useState(!1),[j,n]=c.useState([]),[S,p]=c.useState(!1),[v,i]=c.useState(!1),[_,l]=c.useState(!1),[C,k]=c.useState(!1),[I,a]=c.useState(!0),[P,x]=c.useState(!1),[r,b]=c.useState(),[z,A]=c.useState(!1),[L,B]=c.useState({}),E=()=>A(!1);c.useState(!1);const[q,V]=c.useState(!1);he().props.Auth;const[W,Y]=c.useState(null),$=(H,y)=>{H.preventDefault();try{i(!0),N.loading("Loading...",{duration:2500,position:"top-center"}),y&&(K.post(reverseUrl("enquiry_count"),{isIndividual:!1,isCompany:!0,companyId:y}).then(R=>{}),K.post(reverseUrl("company-report"),{companyId:y}).then(R=>{var J,ee;Y(y),(J=R.data)!=null&&J.is_eligible?(ee=R.data)!=null&&ee.require_otp?(V(!0),b(R.data)):(A(!0),b(R.data)):N.error("You have exhausted your free enquiries. Please subscribe to get more enquiries.",{duration:4e3,id:"error_"})}).catch(R=>{console.error("There was an error!",R)}))}finally{i(!1)}},G=()=>{a(!0),k(!1)},X=()=>{k(!0),a(!1)},{data:F,setData:Z,post:t}=D({searchParam:"registration_name",searchValue:""}),M=H=>Z(U(O({},F),{[H.target.id]:H.target.value})),ie=H=>{if(H.preventDefault(),F.searchValue===""){B({searchValue:"Please enter a search value"}),l(!1);return}t(reverseUrl(o),{onStart:()=>{p(!0),l(!1),n({}),B({}),m(!1)},onSuccess:y=>{y.props.result.length===0&&m(!0),y.props.result.length>0?n(y.props.result):l(!0),p(!1)},onError:y=>{N.error("Nothing to search..."),p(!1)}})},te=()=>{x(!0)};return e.jsxs("main",{children:[e.jsx(ge,{title:"Search Company"}),e.jsx(je,{position:"top-right",duration:"4000"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx("div",{className:"row align-items-center mb-5",children:e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-5",onSubmit:ie,children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Filter by Registration Name / Number"}),e.jsx("input",{value:F.searchValue,onChange:M,type:"text",name:"searchValue",id:"searchValue",className:"form-control form-control"}),L.searchValue&&e.jsx("small",{className:"text-danger",children:L.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Select filter Parameter"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"searchParam",id:"searchParam",onChange:M,children:[e.jsx("option",{value:"registration_name",children:"Registration Name"}),e.jsx("option",{value:"registration_number",children:"Registration Number"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:S,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),S?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})}),e.jsx("div",{className:"mt-4",children:e.jsx(ve,{handleClick:te})})]})})})}),e.jsx(pe,{type:"company",actionType:"user",show:P,handleClose:()=>x(!1)}),e.jsx(Se,{showReport:z,handleCloseReport:E,selectedRow:W,reportData:r}),e.jsx(we,{show:q,handleClose:()=>V(!1),setVerified:A,verification_type:"company",url:"verify_company_otp"}),e.jsx(ye,{show:s,handleClose:T,handleShow:f,isSingle:I,handleSingle:G,isMultiple:C,handleMultiple:X,setAddSuccessful:h,url:"client-create-company",action:"create"}),e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{backgroundColor:"#e4e4e4"},children:[e.jsx("th",{scope:"col",children:"Registration Name"}),e.jsx("th",{scope:"col",children:"Registration Number"}),e.jsx("th",{scope:"col",children:"Select"})]}),S?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}):j.length>0?j==null?void 0:j.map(({id:H,registration_number:y,registration_name:R})=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:R}),e.jsx("td",{children:y}),e.jsx("td",{children:e.jsx("button",{className:"btn btn-info mdc-ripple-upgraded text-white ",type:"submit",disabled:v,onClick:J=>$(J,H),children:v?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"View"})})]},H)):""]})}),e.jsx("div",{className:"row justify-content-center",children:e.jsx("div",{className:"col-md-auto",children:u&&e.jsx(ue,{handleShow:f,userType:"company",searchValue:F.searchValue,handleCloseModal:()=>m(!1)})})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})]})}function Ce(){return e.jsxs(e.Fragment,{children:[e.jsx(me,{title:"Search company"}),e.jsx(_e,{url:"cl-search-companies"})]})}Ce.layout=o=>e.jsx(xe,{children:o,title:"Search Company"});export{Ce as default};
