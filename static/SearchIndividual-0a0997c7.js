var ee=Object.defineProperty,se=Object.defineProperties;var ie=Object.getOwnPropertyDescriptors;var J=Object.getOwnPropertySymbols;var ne=Object.prototype.hasOwnProperty,le=Object.prototype.propertyIsEnumerable;var X=(n,l,d)=>l in n?ee(n,l,{enumerable:!0,configurable:!0,writable:!0,value:d}):n[l]=d,Z=(n,l)=>{for(var d in l||(l={}))ne.call(l,d)&&X(n,d,l[d]);if(J)for(var d of J(l))le.call(l,d)&&X(n,d,l[d]);return n},K=(n,l)=>se(n,ie(l));import{r as t,j as e,a as de,_ as Q,b as $,H as te,I as ce}from"./main-cca8b9b1.js";import{L as he}from"./Layout-9ba4bac3.js";import{N as xe}from"./NotFound-f66c696f.js";import{I as re}from"./IndividualAdd-5447d50e.js";import{B as oe}from"./BulkIconButton-acbdde23.js";import{B as ae}from"./BulkUploadModal-4a517ccf.js";import{h as je}from"./html2pdf-6fb30fa0.js";import{M as G}from"./Modal-33be9e73.js";import{B as D}from"./Button-8e0bcdfd.js";import"./lodash-50a00b21.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-0482583f.js";import"./formatting-9de8c923.js";import"./MultipleUpload-6b9cb08f.js";import"./index-28b47ae7.js";import"./search-2a1f244d.js";import"./index-e7483ee4.js";import"./Button-0337a563.js";function ue({showReport:n,handleCloseReport:l,selectedRow:d,reportData:s}){var o,v,j,_,u,k,x,g,f,C,b,H,y,I,m,z,A,F,N,r,S,R,B,L,P,V,O,E,U,q,a,c,h,w,M,Y;const p=t.useRef();console.log(s),console.log("reportData",s.historic_claims_list);const T=()=>{const i=p.current;je().from(i).set({margin:1,filename:"modal-content.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()};return e.jsx(e.Fragment,{children:e.jsxs(G,{show:n,onHide:l,fullscreen:!0,children:[e.jsx(G.Body,{ref:p,children:e.jsxs("div",{style:{border:"3px solid #176987",width:"100%",padding:"20px"},id:"report",children:[e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("div",{children:"CrediSafe"}),e.jsx("div",{children:"Securing you rental investments"})]}),e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{})]}),e.jsxs("div",{style:{lineHeight:"10px"},children:[e.jsx("p",{style:{textAlign:"right"},children:"+263 71 882 2460"}),e.jsx("p",{style:{textAlign:"right"},children:"credisafezw@gmail.com"}),e.jsx("p",{style:{textAlign:"right"},children:" www.credi-safe.com"})]})]})]}),e.jsx("div",{className:"mt-5 mb-2",children:e.jsxs("h6",{children:["Rent Payment Status Report on"," ",e.jsxs("span",{style:{fontWeight:"bold",color:"#176987"},children:[(o=s==null?void 0:s.individual_details)==null?void 0:o.firstname," ",(v=s==null?void 0:s.individual_details)==null?void 0:v.surname," "]}),"as at ",Date().toLocaleString()]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"5px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#190062"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"PAYMENT STATUS CLASSIFICATION/INDICATOR"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center",children:"Status"}),e.jsx("td",{style:{backgroundColor:((j=s==null?void 0:s.risk_data)==null?void 0:j.class)=="non-payer"?(_=s==null?void 0:s.risk_data)==null?void 0:_.color:((u=s==null?void 0:s.risk_data)==null?void 0:u.class)=="high-high"?(k=s==null?void 0:s.risk_data)==null?void 0:k.color:((x=s==null?void 0:s.risk_data)==null?void 0:x.class)=="high"?(g=s==null?void 0:s.risk_data)==null?void 0:g.color:((f=s==null?void 0:s.risk_data)==null?void 0:f.class)=="medium"?(C=s==null?void 0:s.risk_data)==null?void 0:C.color:((b=s==null?void 0:s.risk_data)==null?void 0:b.class)=="low"?(H=s==null?void 0:s.risk_data)==null?void 0:H.color:"",color:((y=s==null?void 0:s.risk_data)==null?void 0:y.class)=="non-payer"?"white":""},className:"text-center text-white",children:((I=s==null?void 0:s.risk_data)==null?void 0:I.class)=="non-payer"?"Non-Payer":((m=s==null?void 0:s.risk_data)==null?void 0:m.class)=="high-high"?"High-High":((z=s==null?void 0:s.risk_data)==null?void 0:z.class)=="high"?"High":((A=s==null?void 0:s.risk_data)==null?void 0:A.class)=="medium"?"Medium":((F=s==null?void 0:s.risk_data)==null?void 0:F.class)=="low"?"Low":""})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#808080"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"STATUS INDEX"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center bg-success text-white",children:"Low"}),e.jsx("td",{style:{fontWeight:"bold"},className:"text-center bg-warning text-white",children:"Medium Risk"}),e.jsx("td",{style:{backgroundColor:"#ff33cc",fontWeight:"bold"},className:"text-center text-white",children:"High Risk - Lower"}),e.jsx("td",{style:{fontWeight:"bold",backgroundColor:"red"},className:"text-center text-white",children:"High Risk - Upper"}),e.jsx("td",{style:{fontWeight:"bold"},className:"text-center bg-dark text-white",children:"None Payer"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center text-nowrap",children:"Current"}),e.jsx("td",{className:"text-center text-nowrap",children:"1st Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"2nd Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"3rd Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"+3 Months Outstanding"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center text-white",children:"PERSONAL DETAILS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Identification Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Surname :"}),e.jsx("td",{children:(N=s==null?void 0:s.individual_details)==null?void 0:N.surname}),e.jsx("td",{children:"First Name :"}),e.jsx("td",{children:(r=s==null?void 0:s.individual_details)==null?void 0:r.firstname})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"National ID No:"}),e.jsx("td",{children:(S=s==null?void 0:s.individual_details)==null?void 0:S.national_id}),e.jsx("td",{children:"Date Of Birth:"}),e.jsx("td",{children:(R=s==null?void 0:s.individual_details)==null?void 0:R.dob})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Marital Status :"}),e.jsxs("td",{children:[" ",(B=s==null?void 0:s.individual_details)==null?void 0:B.marital_status]}),e.jsx("td",{children:"Gender:"}),e.jsx("td",{children:(L=s==null?void 0:s.individual_details)==null?void 0:L.gender})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center ",children:"Contact Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Mobile Number :"}),e.jsx("td",{children:(P=s==null?void 0:s.individual_details)==null?void 0:P.mobile}),e.jsx("td",{children:"Telephone No:"}),e.jsx("td",{children:(V=s==null?void 0:s.individual_details)==null?void 0:V.landline})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Address :"}),e.jsx("td",{colSpan:3,children:(O=s==null?void 0:s.individual_details)==null?void 0:O.address})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Email :"}),e.jsx("td",{colSpan:3,children:(E=s==null?void 0:s.individual_details)==null?void 0:E.email})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center ",children:"Employment History"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Employer"}),e.jsx("td",{className:"text-center",children:"Position"}),e.jsx("td",{className:"text-center",children:"Start Date"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center",children:(U=s==null?void 0:s.individual_details)==null?void 0:U.employer_name}),e.jsx("td",{className:"text-center",children:(q=s==null?void 0:s.individual_details)==null?void 0:q.job_title}),e.jsx("td",{className:"text-center",children:(a=s==null?void 0:s.individual_details)==null?void 0:a.date_of_employment})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"OUTSTANDING RENTALS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center ",children:"Claims"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Claimant"}),e.jsx("td",{children:"Type"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Date of Claim "})]}),((c=s==null?void 0:s.claims_list)==null?void 0:c.length)>0&&((h=s==null?void 0:s.claims_list)==null?void 0:h.map((i,W)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:i.creditor}),e.jsx("td",{children:i.type||""}),e.jsx("td",{children:i.currency}),e.jsx("td",{children:i!=null&&i.owing_amount?Number(i.owing_amount).toFixed(2):""}),e.jsx("td",{children:i.claim_date})]},"claim"+W)))]})})})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center",children:"Active"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Creditor"}),e.jsx("td",{children:"Type"}),e.jsx("td",{children:"Outstanding Since"}),e.jsx("td",{children:"Amount"})]}),(w=s==null?void 0:s.credit_details)==null?void 0:w.map(i=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:i.credit_type}),e.jsxs("td",{children:[" ",i.type||""]}),e.jsxs("td",{children:[" ",i.start_date]}),e.jsxs("td",{children:[i.currency," ",i!=null&&i.overdue_amount?Number(i.overdue_amount).toFixed(2):""]})]},i.lease_id))]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Historic"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"",scope:"row",colSpan:2,children:"Creditor"}),e.jsx("td",{children:"Type"}),e.jsx("td",{className:"",children:"Outstanding Since"}),e.jsx("td",{className:"",children:" Amount"})]}),((M=s.historic_claims_list)==null?void 0:M.length)>0&&((Y=s.historic_claims_list)==null?void 0:Y.map((i,W)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsxs("th",{scope:"row",colSpan:2,children:[" ",i==null?void 0:i.creditor]}),e.jsx("td",{children:(i==null?void 0:i.type)||""}),e.jsx("td",{children:i==null?void 0:i.claim_date}),e.jsx("td",{children:i!=null&&i.balance_amount?Number(i.balance_amount).toFixed(2):""})]},"claim"+W)))]})})]})}),e.jsxs("div",{style:{width:"100%",padding:"2px"},children:[e.jsx("hr",{}),e.jsxs("div",{children:[e.jsx("p",{children:"Disclaimer: This report is confidential and intended solely for the individual or entity to whom it is addressed. Information on this report is valid at the time of enquiry only. If verification is required, please contact us on the details provided above."}),e.jsx("p",{children:"Terms and Conditions apply."}),e.jsx("p",{children:"Copyrights © CrediSafe Zimbabwe"}),e.jsx("p",{children:"All rights reserved"})]})]})]})}),e.jsxs(G.Footer,{children:[e.jsx(D,{className:"mr-4",variant:"secondary",onClick:l,children:"Close"}),e.jsx(D,{variant:"primary",onClick:T,children:"Print"})]})]})})}function me(n){const[l,d]=t.useState(!1),s=()=>d(!1),p=()=>d(!0),[T,o]=t.useState([]),[v,j]=t.useState(!1),[_,u]=t.useState(!1),[k,x]=t.useState(!1),[g,f]=t.useState(!1),[C,b]=t.useState(!0),[H,y]=t.useState(!1),[I,m]=t.useState({}),[z,A]=t.useState(null),[F,N]=t.useState(null),[r,S]=t.useState(!1),{data:R,setData:B,post:L}=de({searchParam:"fullname",searchValue:""});function P(a,c){a.preventDefault(),Q.loading("Loading...",{duration:2500,position:"top-center"});try{u(!0),c&&($.post(reverseUrl("enquiry_count"),{isIndividual:!0,isCompany:!1,individualId:c}).then(h=>{}),$.post(reverseUrl("individual-report"),{individualId:c}).then(h=>{var w,M;A(c),(w=h.data)!=null&&w.is_eligible?(M=h.data)!=null&&M.require_otp?N(h.data):(N(h.data),S(!0)):Q.error("You have exhausted your free enquiries. Please subscribe to get more enquiries.",{duration:4e3,id:"error_"})}).catch(h=>{console.error("There was an error!",h)}))}finally{u(!1)}}function V(a){B(K(Z({},R),{[a.target.id]:a.target.value}))}function O(a){if(a.preventDefault(),R.searchValue===""){m({searchValue:"The search value field is required."});return}L(reverseUrl(n),{onStart:()=>{j(!0),o([]),m({}),x(!1)},onSuccess:c=>{const h=w=>JSON.stringify(w)==="{}";c.props.result.length===0&&x(!0),h(c.props.result)===!0||o(c.props.result),j(!1)},onError:c=>{j(!1)}})}function E(){b(!0),f(!1)}function U(){f(!0),b(!1)}function q(){y(!0)}return{show:l,data:R,errors:I,notFound:k,isSingle:C,isLoading:v,isBulkAdd:H,isMultiple:g,reportData:F,isVerified:r,selectedRow:z,fetchedData:T,isReportLoading:_,handleShow:p,setNotFound:x,handleClose:s,handleSingle:E,setIsBulkAdd:y,setIsVerified:S,changeHandler:V,submitHandler:O,handleMultiple:U,handleShowReport:P,handleBulkButtonClick:q}}function ge({url:n}){const{show:l,data:d,errors:s,notFound:p,isSingle:T,isLoading:o,isBulkAdd:v,isMultiple:j,reportData:_,isVerified:u,selectedRow:k,fetchedData:x,isReportLoading:g,handleShow:f,setNotFound:C,handleClose:b,handleSingle:H,setIsBulkAdd:y,setIsVerified:I,changeHandler:m,submitHandler:z,handleMultiple:A,handleShowReport:F,handleBulkButtonClick:N}=me(n);return e.jsxs("div",{children:[e.jsxs(e.Fragment,{children:[e.jsx(te,{title:"Search Individual"}),e.jsx(ce,{position:"top-right",toastOptions:{duration:5e3}}),e.jsx(ae,{type:"individual",actionType:"user",show:v,handleClose:()=>y(!1)}),u&&e.jsx(ue,{showReport:u,handleCloseReport:()=>I(!1),selectedRow:k,reportData:_}),e.jsx(re,{show:l,isMultiple:j,isSingle:T,handleMultiple:A,handleSingle:H,handleClose:b,action:"create",url:"cl-store-individual"})]}),e.jsxs("div",{className:"container-xl",children:[e.jsx("h4",{className:"bg-info text-white p-2 rounded rounded-5 text-center mb-4",children:"Search Individual"}),e.jsxs("table",{className:"table table-sm table-bordered border-2 bg-white",children:[e.jsxs("thead",{className:"position-sticky c-table-top bg-white c-z-5",children:[e.jsx("tr",{children:e.jsx("th",{colSpan:4,children:e.jsxs("form",{className:"d-flex gap-3 align-items-end p-2",onSubmit:z,children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"searchValue",children:"Filter by Name / Surname / ID"}),e.jsx("input",{name:"searchValue",id:"searchValue",value:d.searchValue,onChange:m,className:"form-control",placeholder:"search..."}),s.searchValue&&e.jsx("small",{className:"text-danger p-1",children:s.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"searchParam",children:"Select filter Parameter"}),e.jsxs("select",{name:"searchParam",id:"searchParam",className:"form-select",onChange:m,children:[e.jsx("option",{value:"fullname",children:"Full name"}),e.jsx("option",{value:"nationalid",children:"Identification Number"})]})]}),e.jsxs("button",{type:"submit",disabled:o,className:"btn btn-info text-white",children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),o?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"Searching.."})]}):"Search"]}),e.jsx(oe,{handleClick:N})]})})}),e.jsxs("tr",{className:"c-bg-light",children:[e.jsx("th",{className:"px-3",children:"Forenames"}),e.jsx("th",{className:"px-3",children:"surname"}),e.jsx("th",{className:"px-3",children:"Identification Number"}),e.jsx("th",{className:"px-3 text-center",children:"Select"})]})]}),e.jsx("tbody",{children:o?e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsxs("div",{className:"custom-h-2 d-flex align-items-center justify-content-center p-5",children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm me-2 text-info"}),e.jsx("span",{children:"Searching.."})]})})}):(x==null?void 0:x.length)>0&&x.map(r=>e.jsxs("tr",{children:[e.jsx("td",{className:"px-3",children:r.firstname}),e.jsx("td",{className:"px-3",children:r.surname}),e.jsx("td",{className:"px-3",children:r.national_id}),e.jsx("td",{className:"text-center",children:e.jsx("button",{disabled:g,className:"btn btn-info text-white text-center justify-content-center w-100 btn-sm",onClick:S=>F(S,r.id),children:g?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"processing.."})]}):"View"})})]},r.id))})]}),p&&e.jsx("div",{className:"d-flex justify-content-center bg-white p-4",children:e.jsx(xe,{handleShow:f,handleCloseModal:()=>C(!1),userType:"individual",searchValue:d.searchValue})})]})]})}function fe({individuals:n}){return e.jsx(ge,{individuals:n,url:"cl-search-individuals"})}fe.layout=n=>e.jsx(he,{children:n});export{fe as default};
