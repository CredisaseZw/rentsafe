var A=Object.defineProperty,S=Object.defineProperties;var C=Object.getOwnPropertyDescriptors;var b=Object.getOwnPropertySymbols;var T=Object.prototype.hasOwnProperty,I=Object.prototype.propertyIsEnumerable;var f=(t,i,a)=>i in t?A(t,i,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[i]=a,v=(t,i)=>{for(var a in i||(i={}))T.call(i,a)&&f(t,a,i[a]);if(b)for(var a of b(i))I.call(i,a)&&f(t,a,i[a]);return t},g=(t,i)=>S(t,C(i));import{r as p,a as w,j as e,_ as h}from"./main-8aa072fa.js";import{b as L,L as E}from"./Layout-731ae6f9.js";import{M as d}from"./Modal-22d2e09e.js";import{B as y}from"./Button-b740bafa.js";import{l as N}from"./lodash-146eb32c.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-0a02feba.js";import"./formatting-9de8c923.js";import"./MultipleUpload-69d0e461.js";import"./index-5db6dba1.js";import"./search-62783590.js";import"./index-66c3a614.js";import"./index-eb46efb6.js";import"./Button-6b6d9ec7.js";const O=({show:t,handleClose:i,userData:a})=>{const[r,l]=p.useState(!1),{data:n,post:s}=w({userId:a.userId}),m=()=>{s(reverseUrl("destroy-user"),{onStart:()=>{l(!0)},onSuccess:o=>{h.success("User deleted successfully"),l(!1),i()},onError:o=>{h.error("Something went wrong! Please try again"),l(!1)}}),i()};return e.jsxs(d,{show:t,onHide:i,size:"md",backdrop:"static",centered:!0,children:[e.jsx(d.Header,{closeButton:!0,className:"h4 bg-info text-white text-center text-uppercase",children:"Confirm Delete User"}),e.jsx(d.Body,{className:"p-4 d-flex justify-content-between align-items-center gap-4",children:e.jsxs("p",{className:"my-3 text-center",children:["Are you sure you want to delete ",a.firstName," ",a.lastName," from the system? This action cannot be undone."]})}),e.jsxs(d.Footer,{className:"p-4 d-flex justify-content-end gap-4",children:[e.jsxs(y,{onClick:i,variant:"secondary",children:[e.jsx("i",{className:"material-icons",children:"cancel"}),"Cancel"]}),e.jsxs(y,{onClick:m,variant:"danger",children:[e.jsx("i",{className:"material-icons",children:"done"}),"Delete"]})]})]})},k=O;function D(t,i,a,r){const{errors:l,data:n,processing:s,setData:m,post:o,put:c}=w({firstName:t.firstName||"",lastName:t.lastName||"",identificationNumber:t.identificationNumber||"",identificationType:t.identificationType||"",mobileNumber:t.mobile||"",userEmail:t.email||"",accessLevel:t.access_level||"",address:t.address||"",userId:t.userId||-1});function u(){o(reverseUrl(i),{onSuccess:()=>{h.success(`${N.capitalize(n.firstName)} ${N.capitalize(n.lastName)}'s details were added successfully`),r()},onError:()=>{h.error("Error adding details")}})}function x(){c(reverseUrl(i),{onSuccess:()=>{h.success(`${N.capitalize(n.firstName)} ${N.capitalize(n.lastName)}'s details were updated successfully`),r()},onError:()=>{h.error("Error updating details")}})}function U(j){j.preventDefault(),a==="add"?u():x()}return{data:n,errors:l,isLoading:s,handleSubmit:U,changeHandler:j=>m(g(v({},n),{[j.target.id]:j.target.value}))}}function F({show:t,handleClose:i,action:a,user:r,url:l}){const{data:n,errors:s,isLoading:m,handleSubmit:o,changeHandler:c}=D(r,l,a,i);return e.jsxs(d,{size:"lg",backdrop:"static",centered:!0,show:t,onHide:i,children:[e.jsx(d.Header,{closeButton:!0,className:"bg-info",children:e.jsx("h3",{className:"mb-0 text-white",children:a==="add"?r!=null&&r.userId?"Add Internal User":"Add New User":"Update User"})}),e.jsx(d.Body,{children:e.jsxs("form",{onSubmit:o,className:"border border-3 border-info p-4 mt-4",children:[e.jsxs("div",{className:"row row-cols-3 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Surname"}),e.jsx("input",{value:n.lastName,onChange:c,type:"text",placeholder:"Surname",required:!0,name:"lastName",id:"lastName",className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.lastName})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"First Name"}),e.jsx("input",{value:n.firstName,onChange:c,type:"text",placeholder:"First Name",required:!0,name:"firstName",id:"firstName",className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.firstName})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Identification Type"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"identificationType",required:!0,id:"identificationType",onChange:c,value:n.identificationType,children:[e.jsx("option",{children:"Select Type..."}),e.jsx("option",{value:"nationalid",children:"National ID"}),e.jsx("option",{value:"passport",children:"Passport"}),e.jsx("option",{value:"servicesid",children:"Service ID"})]}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.identificationType})]})]}),e.jsxs("div",{className:"row row-cols-3 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Identification Number"}),e.jsx("input",{value:n.identificationNumber,onChange:c,type:"text",required:!0,placeholder:"Identification Number",name:"identificationNumber",id:"identificationNumber",className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.identificationNumber})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Address"}),e.jsx("textarea",{value:n.address,onChange:c,type:"text",placeholder:"Address",id:"address",required:!0,name:"address",className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.address})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Mobile Number"}),e.jsx("input",{value:n.mobileNumber,onChange:c,required:!0,placeholder:"Mobile Number",type:"text",name:"mobileNumber",id:"mobileNumber",className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.mobileNumber})]})]}),e.jsxs("div",{className:"row row-cols-3 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Access Level"}),e.jsxs("select",{value:n.accessLevel,onChange:c,id:"accessLevel",required:!0,name:"accessLevel",className:"form-select",children:[e.jsx("option",{value:"",disabled:!0,children:"Select Level..."}),e.jsx("option",{value:"admin",children:"Admin"}),e.jsx("option",{value:"user",children:"User"})]}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.accessLevel})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"User Email"}),e.jsx("input",{value:n.userEmail,onChange:c,type:"email",name:"userEmail",placeholder:"eg. joe@rentsafe.com",id:"userEmail",required:!0,className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.userEmail})]})]}),e.jsx("div",{className:"text-end mt-4",children:e.jsx("button",{type:"submit",disabled:m,className:"btn btn-info text-white",children:m?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm me-2"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):a==="add"?"Add User":"Update User"})})]})})]})}function z({show:t,handleClose:i,handleProceed:a}){const[r,l]=p.useState();function n(s){l({userId:s.id,firstName:s.firstname,lastName:s.surname,identificationNumber:s.national_id,identificationType:"nationalid"})}return e.jsxs(d,{size:"md",backdrop:"static",centered:!0,show:t,onHide:i,children:[e.jsx(d.Header,{closeButton:!0,className:"bg-info",children:e.jsx("h3",{className:"mb-0 text-white",children:"Add Internal User"})}),e.jsx(d.Body,{children:e.jsx("div",{className:"custom-mn-h-3 py-5 px-4 mt-4",children:e.jsxs("div",{className:"d-flex gap-2 py-4",children:[e.jsx(L,{onChange:s=>n(s),extraProps:{className:"flex-grow-1",placeholder:"ID number or full name..."},useAlternateFetchOptions:{type:"individual"},noOptionsMessage:()=>e.jsxs("p",{className:"m-0 text-center",children:["No search results found. Please add this individual's details by clicking",e.jsx("br",{}),e.jsx("button",{type:"button",className:"btn btn-info btn-sm text-white mt-2",onClick:()=>{a({})},children:"Ok"})]})}),r!=null&&r.userId?e.jsx("button",{className:"btn btn-info text-white c-w-fit",onClick:()=>a(r),children:"Proceed"}):e.jsx("div",{className:"text-white bg-info d-flex align-items-center px-2",children:e.jsx("i",{className:"material-icons",children:"search"})})]})})})]})}function q(t){const[i,a]=p.useState(t),[r,l]=p.useState(""),[n,s]=p.useState({type:"",action:"",userToActOn:{}});function m(o){o.preventDefault(),l(o.target.value);const c=t.filter(u=>{const x=o.target.value.toLowerCase();return u.email.toLowerCase().includes(x)||u.firstName.toLowerCase().includes(x)||u.lastName.toLowerCase().includes(x)});a(c)}return{searchValue:r,filteredUsers:i,userModalOptions:n,setUserModalOptions:s,handleSearch:m}}function B({users:t}){const{searchValue:i,filteredUsers:a,userModalOptions:r,setUserModalOptions:l,handleSearch:n}=q(t);return e.jsxs("main",{children:[(r==null?void 0:r.type)!==""&&e.jsxs(e.Fragment,{children:[e.jsx(F,{show:r.type==="user",action:r.action,user:r.userToActOn,url:r.action==="add"?"create-user":"edit-user",handleClose:()=>l({type:"",action:"",userToActOn:{}})},JSON.stringify(r.userToActOn)),e.jsx(z,{show:r.type==="add-internal-user",handleClose:()=>l({type:"",action:"",userToActOn:{}}),handleProceed:s=>l({type:"user",action:"add",userToActOn:s})}),e.jsx(k,{userData:r.userToActOn,show:r.type==="delete",handleClose:()=>l({type:"",action:"",userToActOn:{}})})]}),e.jsx("h5",{className:"text-center p-2 mb-0 text-white bg-info",children:"Internal Users"}),e.jsxs("table",{className:"table table-sm table-striped border bg-white ",children:[e.jsxs("thead",{className:"position-sticky c-table-top bg-white shadow-sm c-z-5",children:[e.jsx("tr",{className:"c-bg-whitesmoke",children:e.jsx("td",{colSpan:7,children:e.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[e.jsxs("div",{className:"col-5 d-flex",children:[e.jsx("input",{type:"search",value:i,onChange:n,placeholder:"Full name or email...",className:"form-control custom-mx-w-4 rounded-0 rounded-start"}),e.jsx("div",{className:"text-white custom-bg-grey rounded-end d-flex align-items-center px-2",children:e.jsx("i",{className:"material-icons",children:"search"})})]}),e.jsxs("button",{className:"btn btn-info text-white rounded-0 rounded-top rounded-top-5",onClick:()=>l({type:"add-internal-user",action:"",userToActOn:{}}),children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add User"]})]})})}),e.jsxs("tr",{className:"c-force-borders",children:[e.jsx("th",{className:"ps-3",children:e.jsx("div",{children:" Surname"})}),e.jsx("th",{children:e.jsx("div",{children:"First Name "})}),e.jsx("th",{children:e.jsx("div",{children:"Level "})}),e.jsx("th",{children:e.jsx("div",{children:"Email "})}),e.jsx("th",{children:e.jsx("div",{children:"Mobile Number "})}),e.jsx("th",{className:"text-end pe-3",children:e.jsx("div",{children:"Actions "})})]})]}),e.jsx("tbody",{children:a==null?void 0:a.map(s=>e.jsxs("tr",{children:[e.jsx("td",{className:"text-capitalize ps-3",children:s.lastName}),e.jsx("td",{className:"text-capitalize",children:s.firstName}),e.jsx("td",{className:"text-capitalize",children:s.access_level}),e.jsx("td",{className:"text-lowercase",children:s.email}),e.jsx("td",{children:s.mobile}),e.jsxs("td",{className:"d-flex gap-2 justify-content-end pe-3",children:[e.jsx("button",{className:"btn btn-sm btn-info text-white",onClick:()=>{l({type:"user",action:"edit",userToActOn:s})},children:"Edit"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:()=>{l({type:"delete",action:"",userToActOn:s})},children:"Delete"})]})]},s.userId))})]}),(a==null?void 0:a.length)===0&&i?e.jsx("p",{className:"custom-mx-w-4 mx-auto p-4 border border-2 text-center border-info",children:"This individual is not part of the user list. Click 'Add User' to start the process of adding a new Internal User"}):""]})}B.layout=t=>e.jsx(E,{children:t,title:"Users"});export{B as default};
