import{r as s,u as k,a as H,j as e}from"./main-27425964.js";import{I as T,_ as L}from"./index-397aef97.js";import{C as A}from"./CompanyAdd-fe1acdd6.js";import{D as O}from"./DeleteUserConfirmition-9e35e938.js";import{N as q}from"./NotFound-0dfad537.js";import{P as z}from"./PageHeader-52f1fbb7.js";import"./MultipleUpload-26d01425.js";import"./Modal-351ea3f4.js";import"./removeClass-a5ee1dcf.js";import"./index-c0ab6a80.js";import"./index-b3b37505.js";import"./Button-f1140dd5.js";import"./Button-f620e21a.js";function re(){const[G,h]=s.useState(!1),[E,u]=s.useState(!1),[t,r]=s.useState([]),I=()=>{u(!1),r([])},p=()=>{u(!0)},[o,d]=s.useState(!1),[R,n]=s.useState(!1),[x,j]=s.useState(!1),[f,g]=s.useState(!0),[b,N]=s.useState(!1),[m,c]=s.useState({}),[S,y]=s.useState(!1),[v,w]=s.useState({}),{is_internal:C}=k().props.Auth,V=()=>{g(!0),j(!1)},_=()=>{j(!0),g(!1)},{data:i,setData:B,post:D}=H({searchParam:"registration_name",searchValue:""}),F=a=>B(a.target.name,a.target.value),M=a=>{if(a.preventDefault(),i.searchValue===""){w({searchValue:"Please enter a search value"}),n(!1);return}D(reverseUrl("search_company_users"),{onStart:()=>{d(!0),n(!1),w({}),r([])},onSuccess:l=>{console.log(l.props.result.length),l.props.result.length>0?r(l.props.result):n(!0),d(!1)},onError:l=>{L.error("Nothing to search..."),d(!1)}})};return e.jsxs("main",{children:[e.jsx(z,{title:"Company Users"}),e.jsx(T,{position:"top-right",duration:"4000"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx("div",{className:"row align-items-center mb-5",children:e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-5",onSubmit:M,children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Filter by Reg. Number / Name"}),e.jsx("input",{value:i.searchValue,onChange:F,type:"text",name:"searchValue",id:"searchValue",className:"form-control form-control"}),v.searchValue&&e.jsx("small",{className:"text-danger",children:v.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Select filter Parameter"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"searchParam",id:"searchParam",onChange:F,children:[e.jsx("option",{value:"registration_name",children:"Registration Name"}),e.jsx("option",{value:"registration_number",children:"Registration Number"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:o,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),o?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})})]})})})}),e.jsx(A,{show:E,handleClose:I,handleShow:p,isSingle:f,handleSingle:V,isMultiple:x,handleMultiple:_,setAddSuccessful:h,action:"create",url:C!==1?"client-create-company":"create-company"}),e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{backgroundColor:"#e4e4e4"},children:[e.jsx("th",{scope:"col",children:"Registration Name"}),e.jsx("th",{scope:"col",children:"Registration Number"}),e.jsx("th",{scope:"col",children:"Edit"}),e.jsx("th",{scope:"col",children:"Delete"})]}),o?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}):(t==null?void 0:t.length)>0?t==null?void 0:t.map(({id:a,registration_number:l,registration_name:P})=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:P}),e.jsx("td",{children:l}),e.jsx("td",{children:a?e.jsx("button",{type:"button",className:"btn btn-raised text-info d-flex align-items-center justify-content-center",onClick:()=>{y(!0),c(t==null?void 0:t.find(U=>U.id===a)),r([])},children:e.jsx("i",{className:"leading-icon material-icons",children:"edit"})}):""}),e.jsx("td",{children:a?e.jsx("button",{type:"button",className:"btn btn-raised text-danger d-flex align-items-center justify-content-center",onClick:()=>{N(!0),c({id:a,name:P})},children:e.jsx("i",{className:"leading-icon material-icons",children:"delete"})}):""})]},a)):""]})}),e.jsx("div",{className:"row justify-content-center",children:e.jsxs("div",{className:"col-md-auto",children:[R&&e.jsx(q,{handleShow:p,handleCloseModal:()=>{n(!1),i.searchValue=""},userType:"company",searchValue:i.searchValue}),b&&e.jsx(O,{url:"delete_company_user",handleClose:()=>{N(!1),c({})},show:b,type:"company",setFetchedData:r,userId:m.id,name:m.name}),S&&e.jsx(A,{show:S,handleClose:()=>{y(!1),c({})},handleShow:()=>{},isSingle:f,handleSingle:V,isMultiple:x,handleMultiple:_,setAddSuccessful:h,action:"edit",url:C!==1?"edit_company_user":"client-edit-company",companyData:m})]})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})]})}export{re as default};
