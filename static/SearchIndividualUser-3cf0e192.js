var q=Object.defineProperty,z=Object.defineProperties;var G=Object.getOwnPropertyDescriptors;var V=Object.getOwnPropertySymbols;var J=Object.prototype.hasOwnProperty,K=Object.prototype.propertyIsEnumerable;var P=(a,s,t)=>s in a?q(a,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[s]=t,B=(a,s)=>{for(var t in s||(s={}))J.call(s,t)&&P(a,t,s[t]);if(V)for(var t of V(s))K.call(s,t)&&P(a,t,s[t]);return a},A=(a,s)=>z(a,G(s));import{r as n,u as Q,a as W,j as e}from"./main-76766219.js";import{I as X}from"./index-f332af68.js";import{D as Y}from"./DeleteUserConfirmition-b954116e.js";import{B as Z}from"./BulkIconButton-683158a6.js";import{I as E}from"./IndividualAdd-c62966bd.js";import{N as $}from"./NotFound-1037ec69.js";import{P as ee}from"./PageHeader-51012471.js";import"./Modal-fcea6098.js";import"./removeClass-2ac7fbcb.js";import"./index-34f41ab4.js";import"./Button-bb7ca1fe.js";import"./Button-28ce796a.js";import"./index-7202a5e9.js";import"./formatting-345d2430.js";import"./MultipleUpload-43545023.js";function be(){const[a,s]=n.useState(!1),t=()=>s(!1),[se,_]=n.useState(!1),k=()=>s(!0),[r,c]=n.useState([]),[u,h]=n.useState(!1),[p,x]=n.useState(!1),[f,b]=n.useState(!1),[j,o]=n.useState({}),[M,d]=n.useState(!1),[N,g]=n.useState(!1),[v,S]=n.useState(!0),[w,F]=n.useState({}),{is_internal:U}=Q().props.Auth,{data:m,setData:H,post:T}=W({searchParam:"fullname",searchValue:""}),I=l=>H(A(B({},m),{[l.target.id]:l.target.value})),L=l=>{if(l.preventDefault(),m.searchValue==="")return F({searchValue:"Please enter a search value"});T(reverseUrl("search_individual_users"),{onStart:()=>{h(!0),x(!1),c([]),F({})},onSuccess:i=>{i.props.result.length<1?d(!0):(c(i.props.result),d(!1)),h(!1)},onError:i=>{h(!1)}})},y=()=>{S(!0),g(!1)},C=()=>{g(!0),S(!1)};return e.jsxs("main",{children:[e.jsx(ee,{title:"Individual Users"}),e.jsxs("div",{className:"container-xl p-5",children:[e.jsx(X,{position:"top-right",duration:"4000"}),e.jsx("div",{className:"row align-items-center mb-5",children:e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-5",onSubmit:L,children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Filter by Full Name/ID"}),e.jsx("input",{value:m.searchValue,onChange:l=>{I(l),d(!1)},type:"text",name:"searchValue",id:"searchValue",className:"form-control form-control"}),w.searchValue&&e.jsx("small",{className:"text-danger",children:w.searchValue})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",htmlFor:"",children:"Select filter Parameter"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"searchParam",id:"searchParam",onChange:I,children:[e.jsx("option",{value:"fullname",children:"Full name"}),e.jsx("option",{value:"nationalid",children:"National ID"})]})]}),e.jsx("div",{className:"mt-4",children:e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:u,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),u?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})}),e.jsx("div",{className:"mt-4",children:e.jsx(Z,{})})]})})})}),a&&e.jsx(E,{show:a,isMultiple:N,isSingle:v,handleMultiple:C,handleSingle:y,handleClose:t,setAddSuccessful:_,action:"create",url:U!==1?"client-create-individual":"create-individual-user"}),p&&e.jsx(E,{show:p,handleClose:()=>{x(!1),o({})},isMultiple:N,isSingle:v,handleMultiple:C,handleSingle:y,setAddSuccessful:()=>{},setFetchedData:()=>{},action:"edit",userDetails:j}),f&&e.jsx(Y,{url:"delete_individual_user",handleClose:()=>{b(!1),o({})},show:f,type:"individual",setFetchedData:c,userId:j.id,name:j.name}),e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{style:{backgroundColor:"#e4e4e4"},children:[e.jsx("th",{scope:"col",children:"Forenames"}),e.jsx("th",{scope:"col",children:"surname"}),e.jsx("th",{scope:"col",children:"National ID"}),e.jsx("th",{scope:"col",children:"Edit"}),e.jsx("th",{scope:"col",children:"Delete"})]}),u?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}):r&&(r==null?void 0:r.map(({id:l,firstname:i,surname:D,identification_number:O})=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:i}),e.jsx("td",{children:D}),e.jsx("td",{children:O}),l?e.jsxs(e.Fragment,{children:[e.jsx("td",{children:e.jsx("button",{type:"button",className:"btn btn-raised text-info d-flex align-items-center justify-content-center",onClick:()=>{x(!0),o(r==null?void 0:r.find(R=>R.id===l)),c([])},children:e.jsx("i",{className:"leading-icon material-icons",children:"edit"})})}),e.jsx("td",{children:e.jsx("button",{type:"button",className:"btn btn-raised text-danger d-flex align-items-center justify-content-center",onClick:()=>{b(!0),o({id:l,name:i+" "+D})},children:e.jsx("i",{className:"leading-icon material-icons",children:"delete"})})})]}):null]},l)))]})}),e.jsx("div",{className:"row justify-content-center",children:e.jsx("div",{className:"col-md-auto",children:M&&e.jsx($,{handleShow:k,searchValue:m.searchValue,handleCloseModal:()=>d(!1),userType:"Individual"})})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})]})}export{be as default};
