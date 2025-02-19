var M=Object.defineProperty,F=Object.defineProperties;var T=Object.getOwnPropertyDescriptors;var y=Object.getOwnPropertySymbols;var P=Object.prototype.hasOwnProperty,U=Object.prototype.propertyIsEnumerable;var C=(i,l,n)=>l in i?M(i,l,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[l]=n,N=(i,l)=>{for(var n in l||(l={}))P.call(l,n)&&C(i,n,l[n]);if(y)for(var n of y(l))U.call(l,n)&&C(i,n,l[n]);return i},g=(i,l)=>F(i,T(l));import{r as _,a as H,j as e,b as I}from"./main-f6268bb9.js";import{_ as m}from"./index-36b3b83d.js";import{M as W}from"./MultipleUpload-79414745.js";import{i as $}from"./index-b3b37505.js";import{M as o}from"./Modal-dfcee4b7.js";import{B as z}from"./Button-c67856cd.js";const D=({show:i,handleClose:l,handleShow:n,setAddSuccessful:G,isSingle:j,handleSingle:A,isMultiple:b,handleMultiple:k,url:S,action:u,companyData:s,pageType:L,setFetchedData:O})=>{const[v,x]=_.useState(!1),[a,p]=_.useState(""),{data:r,setData:f,post:R,reset:B}=H({registeredName:s?s.registration_name:"",tradingName:s?s.trading_name:"",branch:s?s.branch:"",companyRegistrationNumber:s?s.registration_number:"",registrationDate:s?s.registration_date:"",vatNumber:s?s.vat_number:"",currentAddress:s?s.address:"",landLine:s?s.landline:"",mobileNumber:s?s.mobile_phone:"",emailAddress:s?s.email:"",website:s?s.website:"",industry:s?s.industry:"",note:s?s.note:"",company_id:s?s.id:"",is_contracted:s?s.is_client:!1,is_gvt:s?s.is_government:!1,pageType:L||""}),d=t=>{t.target.id==="is_contracted"||t.target.id==="is_gvt"?f(g(N({},r),{[t.target.id]:t.target.checked})):f(g(N({},r),{[t.target.id]:t.target.value}))},E=t=>{var c;t.preventDefault(),r.registeredName=r.branch!==""&&!((c=r.registeredName.split(" - ").at(-1))!=null&&c.length)?r.registeredName+" - "+r.branch:r.registeredName,I.post(reverseUrl("edit_company_user"),r).then(h=>{var w;h.data.status==="success"?(m.success(h.data.message),l()):(m.error(((w=h.data)==null?void 0:w.message)||"Something went wrong! Please try again"),l())})},q=t=>{t.preventDefault(),r.registeredName=r.branch!==""?r.registeredName+" - "+r.branch:r.registeredName,R(reverseUrl(S),{onStart:()=>{x(!0),p("")},onSuccess:c=>{B(),m.success("Company creacted successfully"),x(!1),l(),window.location.replace(reverseUrl("search_company_users"))},onError:c=>{m.error("Something went wrong! Please try again"),p(c),x(!1)}})};return e.jsx(e.Fragment,{children:e.jsx(o,{size:"lg",show:i,onHide:l,children:e.jsxs("div",{className:"card",children:[e.jsx(o.Header,{closeButton:!0,className:"card-header bg-transparent",style:{paddingLeft:"0px"},children:e.jsxs("div",{className:"",children:[e.jsx("button",{className:`btn  btn-sm ${j?"btn-info text-white":"btn-light"}`,onClick:A,children:"Single"}),e.jsx("button",{className:`btn  btn-sm ${b?"btn-info text-white":"btn-light"}`,onClick:k,children:"Multiple"})]})}),e.jsxs("div",{className:"card-body",style:{padding:"0px",borderStyle:"solid",borderColor:"#26a69a"},children:[j?e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx("div",{className:"card-header bg-info",children:e.jsxs("div",{className:`d-flex justify-content-between
                            align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:u==="create"?"Add Company":"Edit Company"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"card",children:[e.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:e.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:e.jsxs("div",{className:"me-4",children:[e.jsx("h6",{className:"display-6 mb-0 text-white",children:"Company details"}),e.jsx("div",{className:"card-text"})]})})}),e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(o.Body,{children:[e.jsxs("h5",{style:{backgroundColor:"#dda196",padding:"5px 10px",textAlign:"center",borderRadius:"5px"},children:[e.jsx("span",{className:"fw-bold",children:"Note"}),": All fields marked with a star (",e.jsx("span",{className:"text-danger",children:"*"}),") are required."]}),e.jsx("div",{className:"row",children:e.jsx("div",{className:"col-md-12  my-4",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Registered Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:r.registeredName,onChange:d,type:"text",required:!0,name:"registeredName",id:"registeredName",placeholder:"eg. Company Name",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.registeredName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Trading Name",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:r.tradingName,onChange:d,type:"text",required:!0,name:"tradingName",id:"tradingName",placeholder:"eg. Company Name",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.tradingName})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Branch",e.jsx("span",{className:"text-danger"})]}),e.jsx("input",{value:r.branch,onChange:d,type:"text",required:!0,name:"branch",id:"branch",placeholder:"eg. Branch Name",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.branch})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Registration Number"}),e.jsx("input",{value:r.companyRegistrationNumber,onChange:d,type:"text",name:"companyRegistrationNumber",id:"companyRegistrationNumber",placeholder:"eg. 000/984/2020",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.companyRegistrationNumber})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Registration Date"}),e.jsx("input",{value:r.registrationDate,onChange:d,type:"date",name:"registrationDate",id:"registrationDate",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.registrationDate})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"VAT Number"}),e.jsx("input",{value:r.vatNumber,onChange:d,type:"text",name:"vatNumber",id:"vatNumber",placeholder:"eg. 1123456789",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.vatNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Current Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("textarea",{value:r.currentAddress,onChange:d,type:"text",name:"currentAddress",required:!0,rows:"2",placeholder:"eg. 1234 Main St",id:"currentAddress",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.currentAddress})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"LandLine Phone"}),e.jsx("input",{value:r.landLine,onChange:d,type:"tel",placeholder:"123-456-7890",name:"landLine",id:"landLine",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.landLine})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Mobile Number"}),e.jsx("input",{value:r.mobileNumber,onChange:d,type:"tel",id:"mobileNumber",name:"mobileNumber",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.mobileNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4",children:[e.jsxs("label",{className:"form-label",children:["Email Address",e.jsx("span",{className:"text-danger",children:"*"})]}),e.jsx("input",{value:r.emailAddress,onChange:d,type:"email",required:!0,name:"emailAddress",placeholder:"your-name@company-name.com",id:"emailAddress",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.emailAddress})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Website"}),e.jsx("input",{value:r.website,onChange:d,type:"url",id:"website",name:"website",placeholder:"https://your-website.com",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.website})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Industry"}),e.jsxs("select",{className:"form-select form-select-sm","aria-label":"Default select example",name:"industry",id:"industry",value:r.industry,onChange:d,children:[e.jsx("option",{children:"Select..."}),$.map(t=>e.jsx("option",{value:t,children:t},t))]}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.industry}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.industry})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-md-4 d-flex gap-2",children:[e.jsx("label",{className:"form-label",children:"Government Org"}),e.jsx("input",{type:"checkbox",name:"is_gvt",id:"is_gvt",checked:r.is_gvt,onChange:d,className:"form-check-input border-1 border-black"})]}),e.jsxs("div",{className:"col-md-4 d-flex gap-2",children:[e.jsx("label",{className:"form-label",children:"Client"}),e.jsx("input",{type:"checkbox",name:"is_contracted",id:"is_contracted",checked:r.is_contracted,onChange:d,className:"form-check-input border-1 border-black"})]}),e.jsxs("div",{className:"col-md-4",children:[e.jsx("label",{className:"form-label",children:"Note"}),e.jsx("textarea",{value:r.note,onChange:d,type:"text",id:"note",name:"note",placeholder:"Write your additional note here...",className:"form-control form-control-sm"}),a&&e.jsx("div",{className:"text-danger mt-1",children:a.note})]})]})})})]}),e.jsx(o.Footer,{children:e.jsx(z,{className:"text-white",variant:"info",onClick:u==="create"?q:E,disabled:v,children:v?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):"Save and Proceed"})})]})]})})]})}):"",b?e.jsx(W,{type:"company",actionType:"user"}):""]})]})})})};export{D as C};
