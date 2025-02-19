var ce=Object.defineProperty,te=Object.defineProperties;var he=Object.getOwnPropertyDescriptors;var $=Object.getOwnPropertySymbols;var re=Object.prototype.hasOwnProperty,xe=Object.prototype.propertyIsEnumerable;var D=(d,l,c)=>l in d?ce(d,l,{enumerable:!0,configurable:!0,writable:!0,value:c}):d[l]=c,ee=(d,l)=>{for(var c in l||(l={}))re.call(l,c)&&D(d,c,l[c]);if($)for(var c of $(l))xe.call(l,c)&&D(d,c,l[c]);return d},se=(d,l)=>te(d,he(l));import{r as n,j as e,a as oe,b as ie,H as ae}from"./main-7e7be1ff.js";import{L as me}from"./Layout-8cdff5ea.js";import{I as je,_ as le}from"./index-1a0fe2fd.js";import{B as ue}from"./BulkIconButton-e4da53c6.js";import{N as fe}from"./NotFound-4fa8af45.js";import{P as ge}from"./PageHeader-f6dfafc4.js";import{I as be}from"./IndividualAdd-a020cfb3.js";import{h as ye}from"./html2pdf-d9df97e8.js";import{M as Z}from"./Modal-b797aa09.js";import{B as ne}from"./Button-b24d6a58.js";import{B as Se}from"./BulkUploadModal-32855cbb.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-9c6784ba.js";import"./lodash-eafad207.js";import"./index-327b4224.js";import"./index-fe327e9d.js";import"./MultipleUpload-bbbd391b.js";import"./index-103b5ba2.js";import"./Button-8b072625.js";function Ne({showReport:d,handleCloseReport:l,selectedRow:c,reportData:s}){var z,A,u,f,a,m,g,b,Y,x,J,R,T,j,F,y,P,S,M,N,w,v,V,B,L,p,_,k,X,E,O,o,q,U,H,W;const I=n.useRef();console.log("reportData",s.historic_claims_list);const K=()=>{const i=I.current;ye().from(i).set({margin:1,filename:"modal-content.pdf",html2canvas:{scale:2},jsPDF:{orientation:"portrait"}}).save()};return e.jsx(e.Fragment,{children:e.jsxs(Z,{show:d,onHide:l,fullscreen:!0,children:[e.jsx(Z.Body,{ref:I,children:e.jsxs("div",{style:{border:"3px solid #176987",width:"100%",padding:"20px"},id:"report",children:[e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("div",{children:"CrediSafe"}),e.jsx("div",{children:"Securing you rental investments"})]}),e.jsxs("div",{className:"d-flex justify-content-between",children:[e.jsxs("div",{children:[e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("br",{})]}),e.jsxs("div",{style:{lineHeight:"10px"},children:[e.jsx("p",{style:{textAlign:"right"},children:"+263 71 882 2460"}),e.jsx("p",{style:{textAlign:"right"},children:"credisafezw@gmail.com"}),e.jsx("p",{style:{textAlign:"right"},children:" www.credi-safe.com"})]})]})]}),e.jsx("div",{className:"mt-5 mb-2",children:e.jsxs("h6",{children:["Rent Payment Status Report on"," ",e.jsxs("span",{style:{fontWeight:"bold",color:"#176987"},children:[(z=s==null?void 0:s.individual_details)==null?void 0:z.firstname," ",(A=s==null?void 0:s.individual_details)==null?void 0:A.surname," "]}),"as at ",Date().toLocaleString()]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"5px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#190062"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"PAYMENT STATUS CLASSIFICATION/INDICATOR"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center",children:"Status"}),e.jsx("td",{style:{backgroundColor:((u=s==null?void 0:s.risk_data)==null?void 0:u.class)=="non-payer"?(f=s==null?void 0:s.risk_data)==null?void 0:f.color:((a=s==null?void 0:s.risk_data)==null?void 0:a.class)=="high-high"?(m=s==null?void 0:s.risk_data)==null?void 0:m.color:((g=s==null?void 0:s.risk_data)==null?void 0:g.class)=="high"?(b=s==null?void 0:s.risk_data)==null?void 0:b.color:((Y=s==null?void 0:s.risk_data)==null?void 0:Y.class)=="medium"?(x=s==null?void 0:s.risk_data)==null?void 0:x.color:((J=s==null?void 0:s.risk_data)==null?void 0:J.class)=="low"?(R=s==null?void 0:s.risk_data)==null?void 0:R.color:"",color:((T=s==null?void 0:s.risk_data)==null?void 0:T.class)=="non-payer"?"white":""},className:"text-center text-white",children:((j=s==null?void 0:s.risk_data)==null?void 0:j.class)=="non-payer"?"Non-Payer":((F=s==null?void 0:s.risk_data)==null?void 0:F.class)=="high-high"?"High-High":((y=s==null?void 0:s.risk_data)==null?void 0:y.class)=="high"?"High":((P=s==null?void 0:s.risk_data)==null?void 0:P.class)=="medium"?"Medium":((S=s==null?void 0:s.risk_data)==null?void 0:S.class)=="low"?"Low":""})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#808080"},children:e.jsx("th",{scope:"row",colSpan:5,className:"text-center text-white",children:"STATUS INDEX"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center bg-success text-white",children:"Low"}),e.jsx("td",{style:{fontWeight:"bold"},className:"text-center bg-warning text-white",children:"Medium Risk"}),e.jsx("td",{style:{backgroundColor:"#ff33cc",fontWeight:"bold"},className:"text-center text-white",children:"High Risk"}),e.jsx("td",{style:{fontWeight:"bold",backgroundColor:"red"},className:"text-center text-white",children:"High-High Risk"}),e.jsx("td",{style:{fontWeight:"bold"},className:"text-center bg-dark text-white",children:"None Payer"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center text-nowrap",children:"Current"}),e.jsx("td",{className:"text-center text-nowrap",children:"1st Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"2nd Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"3rd Month Outstanding"}),e.jsx("td",{className:"text-center text-nowrap",children:"+3 Months Outstanding"})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center text-white",children:"PERSONAL DETAILS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Identification Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Surname :"}),e.jsx("td",{children:(M=s==null?void 0:s.individual_details)==null?void 0:M.surname}),e.jsx("td",{children:"First Name :"}),e.jsx("td",{children:(N=s==null?void 0:s.individual_details)==null?void 0:N.firstname})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"National ID No:"}),e.jsx("td",{children:(w=s==null?void 0:s.individual_details)==null?void 0:w.national_id}),e.jsx("td",{children:"Date Of Birth:"}),e.jsx("td",{children:(v=s==null?void 0:s.individual_details)==null?void 0:v.dob})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Marital Status :"}),e.jsxs("td",{children:[" ",(V=s==null?void 0:s.individual_details)==null?void 0:V.marital_status]}),e.jsx("td",{children:"Gender:"}),e.jsx("td",{children:(B=s==null?void 0:s.individual_details)==null?void 0:B.gender})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center ",children:"Contact Details"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Mobile Number :"}),e.jsx("td",{children:(L=s==null?void 0:s.individual_details)==null?void 0:L.mobile}),e.jsx("td",{children:"Telephone No:"}),e.jsx("td",{children:(p=s==null?void 0:s.individual_details)==null?void 0:p.mobile})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Address :"}),e.jsx("td",{colSpan:3,children:(_=s==null?void 0:s.individual_details)==null?void 0:_.address})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Email :"}),e.jsx("td",{colSpan:3,children:(k=s==null?void 0:s.individual_details)==null?void 0:k.email})]})]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:6,className:"text-center ",children:"Employment History"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"text-center",scope:"row",children:"Employer"}),e.jsx("td",{className:"text-center",children:"Position"}),e.jsx("td",{className:"text-center",children:"Start Date"})]}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",className:"text-center",children:(X=s==null?void 0:s.individual_details)==null?void 0:X.employer_name}),e.jsx("td",{className:"text-center",children:(E=s==null?void 0:s.individual_details)==null?void 0:E.job_title}),e.jsx("td",{className:"text-center",children:(O=s==null?void 0:s.individual_details)==null?void 0:O.date_of_employment})]})]})})]})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsx("div",{style:{padding:"10px"},children:e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center text-white",children:"OUTSTANDING RENTALS"})}),e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:4,className:"text-center ",children:"Claims"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Claimant"}),e.jsx("td",{children:"Currency"}),e.jsx("td",{children:"Amount"}),e.jsx("td",{children:"Date of Claim "})]}),((o=s==null?void 0:s.claims_list)==null?void 0:o.length)>0&&((q=s==null?void 0:s.claims_list)==null?void 0:q.map((i,C)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:i.creditor}),e.jsx("td",{children:i.currency}),e.jsx("td",{children:i.owing_amount}),e.jsx("td",{children:i.claim_date})]},"claim"+C)))]})})})}),e.jsx("div",{className:"mb-5",style:{border:"1px solid #176987",width:"100%",padding:"2px"},children:e.jsxs("div",{style:{padding:"10px"},children:[e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#305496"},children:e.jsx("th",{scope:"row",colSpan:7,className:"text-center",children:"Active"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:"Type"}),e.jsx("td",{children:"Outstanding Since"}),e.jsx("td",{children:"Amount"})]}),(U=s==null?void 0:s.credit_details)==null?void 0:U.map(i=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{scope:"row",children:i.credit_type}),e.jsxs("td",{children:[" ",i.start_date]}),e.jsxs("td",{children:[i.currency," ",i.overdue_amount]})]},i.lease_id))]})}),e.jsx("table",{className:"table table-bordered",children:e.jsxs("tbody",{children:[e.jsx("tr",{style:{lineHeight:"5px",fontSize:"12px",backgroundColor:"#b4c6e7"},children:e.jsx("th",{scope:"row",colSpan:10,className:"text-center ",children:"Historic"})}),e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsx("th",{className:"",scope:"row",colSpan:2,children:"Type"}),e.jsx("td",{className:"",children:"Outstanding Since"}),e.jsx("td",{className:"",children:" Amount"})]}),((H=s.historic_claims_list)==null?void 0:H.length)>0&&((W=s.historic_claims_list)==null?void 0:W.map((i,C)=>e.jsxs("tr",{style:{lineHeight:"5px",fontSize:"12px"},children:[e.jsxs("th",{scope:"row",colSpan:2,children:[" ",i==null?void 0:i.creditor]}),e.jsx("td",{children:i==null?void 0:i.claim_date}),e.jsx("td",{children:i==null?void 0:i.balance_amount})]},"claim"+C)))]})})]})}),e.jsxs("div",{style:{width:"100%",padding:"2px"},children:[e.jsx("hr",{}),e.jsxs("div",{children:[e.jsx("p",{children:"Disclaimer: This report is confidential and intended solely for the individual or entity to whom it is addressed. Information on this report is valid at the time of enquiry only. If verification is required, please contact us on the details provided above."}),e.jsx("p",{children:"Terms and Conditions apply."}),e.jsx("p",{children:"Copyrights © CrediSafe Zimbabwe"}),e.jsx("p",{children:"All rights reserved"})]})]})]})}),e.jsxs(Z.Footer,{children:[e.jsx(ne,{className:"mr-4",variant:"secondary",onClick:l,children:"Close"}),e.jsx(ne,{variant:"primary",onClick:K,children:"Print"})]})]})})}function we({individuals:d,url:l}){const[c,s]=n.useState(!1),I=()=>s(!1),[K,z]=n.useState(!1),A=()=>s(!0),[u,f]=n.useState([]),[a,m]=n.useState(!1),[g,b]=n.useState(!1),[Y,x]=n.useState(!1),[J,R]=n.useState(!1),[T,j]=n.useState(!1),[F,y]=n.useState(!1),[P,S]=n.useState(!0),[M,N]=n.useState(!1),[w,v]=n.useState({}),[V,B]=n.useState(null),[L,p]=n.useState(null),[_,k]=n.useState(!1),[X,E]=n.useState(!1),O=(t,h)=>{t.preventDefault(),le.loading("Loading...",{duration:2500,position:"top-center"});try{b(!0),h&&(ie.post(reverseUrl("enquiry_count"),{isIndividual:!0,isCompany:!1,individualId:h}).then(r=>{}),ie.post(reverseUrl("individual-report"),{individualId:h}).then(r=>{var G,Q;B(h),(G=r.data)!=null&&G.is_eligible?(Q=r.data)!=null&&Q.require_otp?(E(!0),p(r.data)):(p(r.data),R(!0),k(!0)):le.error("You have exhausted your free enquiries. Please subscribe to get more enquiries.",{duration:4e3,id:"error_"})}).catch(r=>{console.error("There was an error!",r)}))}finally{b(!1)}},{data:o,setData:q,post:U}=oe({searchParam:"fullname",searchValue:""}),H=t=>q(se(ee({},o),{[t.target.id]:t.target.value})),W=t=>{if(t.preventDefault(),o.searchValue===""){x(!1),v({searchValue:"The search value field is required."});return}U(reverseUrl(l),{onStart:()=>{m(!0),x(!1),f([]),v({}),j(!1)},onSuccess:h=>{const r=G=>JSON.stringify(G)==="{}";h.props.result.length===0&&j(!0),r(h.props.result)===!0?x(!0):f(h.props.result),x(!1),m(!1)},onError:h=>{m(!1)}})},i=()=>{S(!0),y(!1)},C=()=>{y(!0),S(!1)},de=()=>{N(!0)};return e.jsxs("main",{children:[e.jsx(ge,{title:"Search Individual"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx(je,{position:"top-right",duration:"4000"}),e.jsx("div",{className:"row align-items-center mb-5",children:e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-5",onSubmit:W,children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Filter by Name / Surname / ID"}),e.jsx("input",{value:o.searchValue,onChange:H,type:"text",name:"searchValue",id:"searchValue",className:"form-control form-control"}),w.searchValue&&e.jsx("small",{className:"text-danger",children:w.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Select filter Parameter"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"searchParam",id:"searchParam",onChange:H,children:[e.jsx("option",{value:"fullname",children:"Full name"}),e.jsx("option",{value:"nationalid",children:"Identification Number"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:a,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),a?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})}),e.jsx("div",{className:"mt-4",children:e.jsx(ue,{handleClick:de})})]})})})}),e.jsx(Se,{type:"individual",actionType:"user",show:M,handleClose:()=>N(!1)}),_&&e.jsx(Ne,{showReport:_,handleCloseReport:()=>k(!1),selectedRow:V,reportData:L}),e.jsx(be,{show:c,isMultiple:F,isSingle:P,handleMultiple:C,handleSingle:i,handleClose:I,setAddSuccessful:z,action:"create",url:"cl-store-individual"}),e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{backgroundColor:"#e4e4e4"},children:[e.jsx("th",{scope:"col",children:"Forenames"}),e.jsx("th",{scope:"col",children:"surname"}),e.jsx("th",{scope:"col",children:"Identification Number"}),e.jsx("th",{scope:"col",children:"Select"})]}),a?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}):u.length>0&&u.map(t=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:t.firstname}),e.jsx("td",{children:t.surname}),e.jsx("td",{children:t.national_id}),e.jsx("td",{children:e.jsx("button",{className:"btn btn-info mdc-ripple-upgraded text-white ",type:"submit",disabled:g,onClick:h=>O(h,t.id),children:g?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"View"})})]},t.id))]})}),e.jsx("div",{className:"row justify-content-center",children:e.jsx("div",{className:"col-md-auto",children:T&&e.jsx(fe,{handleShow:A,handleCloseModal:()=>j(!1),userType:"individual",searchValue:o.searchValue})})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})]})}function ve({individuals:d}){return e.jsxs(e.Fragment,{children:[e.jsx(ae,{title:"Search individual"}),e.jsx(we,{individuals:d,url:"cl-search-individuals"})]})}ve.layout=d=>e.jsx(me,{children:d,title:"Search Individual"});export{ve as default};
