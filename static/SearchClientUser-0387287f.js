import{r as s,u as k,a as H,j as e}from"./main-9ac28b85.js";import{I as T,_ as L}from"./index-78cdb3e8.js";import{C as A}from"./CompanyAdd-983cbcad.js";import{D as O}from"./DeleteUserConfirmition-698868c4.js";import{N as q}from"./NotFound-a57a1730.js";import{P as z}from"./PageHeader-3dd88034.js";import"./MultipleUpload-96158893.js";import"./Modal-b907f846.js";import"./removeClass-c3f7257e.js";import"./index-16f2de47.js";import"./index-b3b37505.js";import"./index-79bbb401.js";import"./formatting-9de8c923.js";import"./lodash-76f935d5.js";import"./Button-f1de798e.js";import"./Button-b564510a.js";function ie(){const[G,h]=s.useState(!1),[E,u]=s.useState(!1),I=()=>u(!1),p=()=>u(!0),[t,r]=s.useState([]),[o,d]=s.useState(!1),[R,n]=s.useState(!1),[x,j]=s.useState(!1),[f,g]=s.useState(!0),[b,N]=s.useState(!1),[m,c]=s.useState({}),[S,v]=s.useState(!1),[y,w]=s.useState({}),{is_internal:C}=k().props.Auth,V=()=>{g(!0),j(!1)},_=()=>{j(!0),g(!1)},{data:i,setData:B,post:D}=H({searchParam:"registration_name",searchValue:""}),F=a=>B(a.target.name,a.target.value),M=a=>{if(a.preventDefault(),i.searchValue===""){w({searchValue:"Please enter a search value"}),n(!1);return}D(reverseUrl("search_contracted_companies"),{onStart:()=>{d(!0),n(!1),w({}),r({})},onSuccess:l=>{console.log(l.props.result.length),l.props.result.length>0?(console.log(l.props.result),r(l.props.result)):n(!0),d(!1)},onError:l=>{L.error("Nothing to search..."),d(!1)}})};return e.jsxs("main",{children:[e.jsx(z,{title:"Client Users"}),e.jsx(T,{position:"top-right",duration:"4000"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx("div",{className:"row align-items-center mb-5",children:e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-5",onSubmit:M,children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Filter by Reg. Number / Name"}),e.jsx("input",{value:i.searchValue,onChange:F,type:"text",name:"searchValue",id:"searchValue",className:"form-control form-control"}),y.searchValue&&e.jsx("small",{className:"text-danger",children:y.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Select filter Parameter"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"searchParam",id:"searchParam",onChange:F,children:[e.jsx("option",{value:"registration_name",children:"Registration Name"}),e.jsx("option",{value:"registration_number",children:"Registration Number"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:o,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),o?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})})]})})})}),e.jsx(A,{setFetchedData:r,show:E,handleClose:I,handleShow:p,isSingle:f,handleSingle:V,isMultiple:x,handleMultiple:_,setAddSuccessful:h,action:"create",url:C!==1?"client-create-company":"create-company"}),e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{backgroundColor:"#e4e4e4"},children:[e.jsx("th",{scope:"col",children:"Registration Name"}),e.jsx("th",{scope:"col",children:"Registration Number"}),e.jsx("th",{scope:"col",children:"Edit"}),e.jsx("th",{scope:"col",children:"Delete"})]}),o?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}):(t==null?void 0:t.length)>0?t==null?void 0:t.map(({id:a,registration_number:l,registration_name:P})=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:P}),e.jsx("td",{children:l}),e.jsx("td",{children:a?e.jsx("button",{type:"button",className:"btn btn-raised text-info d-flex align-items-center justify-content-center",onClick:()=>{v(!0),c(t==null?void 0:t.find(U=>U.id===a)),r([])},children:e.jsx("i",{className:"leading-icon material-icons",children:"edit"})}):""}),e.jsx("td",{children:a?e.jsx("button",{type:"button",className:"btn btn-raised text-danger d-flex align-items-center justify-content-center",onClick:()=>{N(!0),c({id:a,name:P})},children:e.jsx("i",{className:"leading-icon material-icons",children:"delete"})}):""})]},a)):""]})}),e.jsx("div",{className:"row justify-content-center",children:e.jsxs("div",{className:"col-md-auto",children:[R&&e.jsx(q,{handleShow:p,handleCloseModal:()=>{n(!1),i.searchValue=""},userType:"company",searchValue:i.searchValue}),b&&e.jsx(O,{url:"delete_company_user",handleClose:()=>{N(!1),c({})},show:b,type:"company",setFetchedData:r,userId:m.id,name:m.name}),S&&e.jsx(A,{show:S,handleClose:()=>{v(!1),c({})},handleShow:()=>{},isSingle:f,handleSingle:V,isMultiple:x,handleMultiple:_,setAddSuccessful:h,action:"edit",url:C!==1?"edit_company_user":"client-edit-company",companyData:m})]})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})]})}export{ie as default};
