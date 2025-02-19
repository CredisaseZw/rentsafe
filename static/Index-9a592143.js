var C=Object.defineProperty,S=Object.defineProperties;var I=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var T=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var b=(t,r,a)=>r in t?C(t,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[r]=a,g=(t,r)=>{for(var a in r||(r={}))T.call(r,a)&&b(t,a,r[a]);if(f)for(var a of f(r))L.call(r,a)&&b(t,a,r[a]);return t},v=(t,r)=>S(t,I(r));import{r as p,a as w,j as e}from"./main-bff74084.js";import{I as U,_ as u}from"./index-b70b1f56.js";import{a as E,L as O}from"./Layout-42393a21.js";import{M as d}from"./Modal-948b5595.js";import{B as y}from"./Button-ce0adbf4.js";import{l as j}from"./lodash-2de872b6.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-cb0d2c55.js";import"./formatting-345d2430.js";import"./MultipleUpload-6c5a4465.js";import"./index-d9499e15.js";import"./search-8305c8ec.js";import"./index-8b11c945.js";import"./Button-392cb962.js";const k=({show:t,handleClose:r,userData:a})=>{const[i,l]=p.useState(!1),{data:n,post:s}=w({userId:a.userId}),m=()=>{s(reverseUrl("destroy-user"),{onStart:()=>{l(!0)},onSuccess:o=>{u.success("User deleted successfully"),l(!1),r()},onError:o=>{u.error("Something went wrong! Please try again"),l(!1)}}),r()};return e.jsxs(d,{show:t,onHide:r,size:"md",backdrop:"static",centered:!0,children:[e.jsx(d.Header,{closeButton:!0,className:"h4 bg-info text-white text-center text-uppercase",children:"Confirm Delete User"}),e.jsxs(d.Body,{className:"p-4 d-flex justify-content-between align-items-center gap-4",children:[e.jsx(U,{}),e.jsxs("p",{className:"my-3 text-center",children:["Are you sure you want to delete ",a.firstName," ",a.lastName," from the system? This action cannot be undone."]})]}),e.jsxs(d.Footer,{className:"p-4 d-flex justify-content-end gap-4",children:[e.jsxs(y,{onClick:r,variant:"secondary",children:[e.jsx("i",{className:"material-icons",children:"cancel"}),"Cancel"]}),e.jsxs(y,{onClick:m,variant:"danger",children:[e.jsx("i",{className:"material-icons",children:"done"}),"Delete"]})]})]})},D=k;function F(t,r,a,i){const{errors:l,data:n,processing:s,setData:m,post:o,put:c}=w({firstName:t.firstName||"",lastName:t.lastName||"",identificationNumber:t.identificationNumber||"",identificationType:t.identificationType||"",mobileNumber:t.mobile||"",userEmail:t.email||"",accessLevel:t.access_level||"",address:t.address||"",userId:t.userId||-1});function h(){o(reverseUrl(r),{onSuccess:()=>{u.success(`${j.capitalize(n.firstName)} ${j.capitalize(n.lastName)}'s details were added successfully`),i()},onError:()=>{u.error("Error adding details")}})}function x(){c(reverseUrl(r),{onSuccess:()=>{u.success(`${j.capitalize(n.firstName)} ${j.capitalize(n.lastName)}'s details were updated successfully`),i()},onError:()=>{u.error("Error updating details")}})}function A(N){N.preventDefault(),a==="add"?h():x()}return{data:n,errors:l,isLoading:s,handleSubmit:A,changeHandler:N=>m(v(g({},n),{[N.target.id]:N.target.value}))}}function z({show:t,handleClose:r,action:a,user:i,url:l}){const{data:n,errors:s,isLoading:m,handleSubmit:o,changeHandler:c}=F(i,l,a,r);return e.jsxs(d,{size:"lg",backdrop:"static",centered:!0,show:t,onHide:r,children:[e.jsx(d.Header,{closeButton:!0,className:"bg-info",children:e.jsx("h3",{className:"mb-0 text-white",children:a==="add"?i!=null&&i.userId?"Add Internal User":"Add New User":"Update User"})}),e.jsx(d.Body,{children:e.jsxs("form",{onSubmit:o,className:"border border-3 border-info p-4 mt-4",children:[e.jsxs("div",{className:"row row-cols-3 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Surname"}),e.jsx("input",{value:n.lastName,onChange:c,type:"text",placeholder:"Surname",required:!0,name:"lastName",id:"lastName",className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.lastName})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"First Name"}),e.jsx("input",{value:n.firstName,onChange:c,type:"text",placeholder:"First Name",required:!0,name:"firstName",id:"firstName",className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.firstName})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Identification Type"}),e.jsxs("select",{className:"form-select","aria-label":"Default select example",name:"identificationType",required:!0,id:"identificationType",onChange:c,value:n.identificationType,children:[e.jsx("option",{children:"Select Type..."}),e.jsx("option",{value:"nationalid",children:"National ID"}),e.jsx("option",{value:"passport",children:"Passport"}),e.jsx("option",{value:"servicesid",children:"Service ID"})]}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.identificationType})]})]}),e.jsxs("div",{className:"row row-cols-3 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Identification Number"}),e.jsx("input",{value:n.identificationNumber,onChange:c,type:"text",required:!0,placeholder:"Identification Number",name:"identificationNumber",id:"identificationNumber",className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.identificationNumber})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Address"}),e.jsx("textarea",{value:n.address,onChange:c,type:"text",placeholder:"Address",id:"address",required:!0,name:"address",className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.address})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Mobile Number"}),e.jsx("input",{value:n.mobileNumber,onChange:c,required:!0,placeholder:"Mobile Number",type:"text",name:"mobileNumber",id:"mobileNumber",className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.mobileNumber})]})]}),e.jsxs("div",{className:"row row-cols-3 mb-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"Access Level"}),e.jsxs("select",{value:n.accessLevel,onChange:c,id:"accessLevel",required:!0,name:"accessLevel",className:"form-select",children:[e.jsx("option",{value:"",disabled:!0,children:"Select Level..."}),e.jsx("option",{value:"admin",children:"Admin"}),e.jsx("option",{value:"user",children:"User"})]}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.accessLevel})]}),e.jsxs("div",{children:[e.jsx("label",{className:"form-label",children:"User Email"}),e.jsx("input",{value:n.userEmail,onChange:c,type:"email",name:"userEmail",placeholder:"eg. joe@rentsafe.com",id:"userEmail",required:!0,className:"form-control"}),s&&e.jsx("div",{className:"text-danger small mt-1",children:s.userEmail})]})]}),e.jsx("div",{className:"text-end mt-4",children:e.jsx("button",{type:"submit",disabled:m,className:"btn btn-info text-white",children:m?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm me-2"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):a==="add"?"Add User":"Update User"})})]})})]})}function q({show:t,handleClose:r,handleProceed:a}){const[i,l]=p.useState();function n(s){l({userId:s.id,firstName:s.firstname,lastName:s.surname,identificationNumber:s.national_id,identificationType:"nationalid"})}return e.jsxs(d,{size:"md",backdrop:"static",centered:!0,show:t,onHide:r,children:[e.jsx(d.Header,{closeButton:!0,className:"bg-info",children:e.jsx("h3",{className:"mb-0 text-white",children:"Add Internal User"})}),e.jsx(d.Body,{children:e.jsx("div",{className:"custom-mn-h-3 py-5 px-4 mt-4",children:e.jsxs("div",{className:"d-flex gap-2 py-4",children:[e.jsx(E,{onChange:s=>n(s),extraProps:{className:"flex-grow-1",placeholder:"ID number or full name..."},useAlternateFetchOptions:{type:"individual"},noOptionsMessage:()=>e.jsxs("p",{className:"m-0 text-center",children:["No search results found. Please add this individual's details by clicking",e.jsx("br",{}),e.jsx("button",{type:"button",className:"btn btn-info btn-sm text-white mt-2",onClick:()=>{a({})},children:"Ok"})]})}),i!=null&&i.userId?e.jsx("button",{className:"btn btn-info text-white c-w-fit",onClick:()=>a(i),children:"Proceed"}):e.jsx("div",{className:"text-white bg-info d-flex align-items-center px-2",children:e.jsx("i",{className:"material-icons",children:"search"})})]})})})]})}function B(t){const[r,a]=p.useState(t),[i,l]=p.useState(""),[n,s]=p.useState({type:"",action:"",userToActOn:{}});function m(o){o.preventDefault(),l(o.target.value);const c=t.filter(h=>{const x=o.target.value.toLowerCase();return h.email.toLowerCase().includes(x)||h.firstName.toLowerCase().includes(x)||h.lastName.toLowerCase().includes(x)});a(c)}return{searchValue:i,filteredUsers:r,userModalOptions:n,setUserModalOptions:s,handleSearch:m}}function H({users:t}){const{searchValue:r,filteredUsers:a,userModalOptions:i,setUserModalOptions:l,handleSearch:n}=B(t);return e.jsxs("main",{children:[e.jsx(U,{position:"top-right"}),(i==null?void 0:i.type)!==""&&e.jsxs(e.Fragment,{children:[e.jsx(z,{show:i.type==="user",action:i.action,user:i.userToActOn,url:i.action==="add"?"create-user":"edit-user",handleClose:()=>l({type:"",action:"",userToActOn:{}})},JSON.stringify(i.userToActOn)),e.jsx(q,{show:i.type==="add-internal-user",handleClose:()=>l({type:"",action:"",userToActOn:{}}),handleProceed:s=>l({type:"user",action:"add",userToActOn:s})}),e.jsx(D,{userData:i.userToActOn,show:i.type==="delete",handleClose:()=>l({type:"",action:"",userToActOn:{}})})]}),e.jsx("h5",{className:"text-center p-2 mb-0 text-white bg-info",children:"Internal Users"}),e.jsxs("div",{className:"my-3 d-flex",children:[e.jsx("input",{type:"search",value:r,onChange:n,placeholder:"Full name or email...",className:"form-control custom-mx-w-4 rounded-0 rounded-start"}),e.jsx("div",{className:"text-white custom-bg-grey rounded-end d-flex align-items-center px-2",children:e.jsx("i",{className:"material-icons",children:"search"})})]}),e.jsx("div",{className:"text-end",children:e.jsxs("button",{className:"btn btn-info text-white rounded-0 rounded-top rounded-top-5",onClick:()=>l({type:"add-internal-user",action:"",userToActOn:{}}),children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add User"]})}),e.jsxs("table",{className:"table table-sm table-striped border bg-white",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"ps-3",children:"Surname"}),e.jsx("th",{children:"First Name"}),e.jsx("th",{children:"Level"}),e.jsx("th",{children:"Email"}),e.jsx("th",{children:"Mobile Number"}),e.jsx("th",{className:"text-end pe-3",children:"Actions"})]})}),e.jsx("tbody",{children:a==null?void 0:a.map(s=>e.jsxs("tr",{children:[e.jsx("td",{className:"text-capitalize ps-3",children:s.lastName}),e.jsx("td",{className:"text-capitalize",children:s.firstName}),e.jsx("td",{className:"text-capitalize",children:s.access_level}),e.jsx("td",{className:"text-lowercase",children:s.email}),e.jsx("td",{children:s.mobile}),e.jsxs("td",{className:"d-flex gap-2 justify-content-end pe-3",children:[e.jsx("button",{className:"btn btn-sm btn-info text-white",onClick:()=>{l({type:"user",action:"edit",userToActOn:s})},children:"Edit"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:()=>{l({type:"delete",action:"",userToActOn:s})},children:"Delete"})]})]},s.userId))})]}),(a==null?void 0:a.length)===0&&r?e.jsx("p",{className:"custom-mx-w-4 mx-auto p-4 border border-2 text-center border-info",children:"This individual is not part of the user list. Click 'Add User' to start the process of adding a new Internal User"}):""]})}H.layout=t=>e.jsx(O,{children:t,title:"Users"});export{H as default};
