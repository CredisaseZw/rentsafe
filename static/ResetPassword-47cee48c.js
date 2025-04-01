var v=Object.defineProperty,P=Object.defineProperties;var b=Object.getOwnPropertyDescriptors;var p=Object.getOwnPropertySymbols;var y=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var x=(e,a,r)=>a in e?v(e,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[a]=r,h=(e,a)=>{for(var r in a||(a={}))y.call(a,r)&&x(e,r,a[r]);if(p)for(var r of p(a))C.call(a,r)&&x(e,r,a[r]);return e},w=(e,a)=>P(e,b(a));import{r as j,a as E,j as s,_ as u}from"./main-a6dda5c9.js";import{L as R}from"./Layout-b4321159.js";import"./lodash-d3c3e9f3.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-6ad84934.js";import"./Modal-c2655e25.js";import"./index-e760cfb2.js";import"./formatting-9de8c923.js";import"./MultipleUpload-0f1cec23.js";import"./index-cdca6ff0.js";import"./search-2b7e2b99.js";const S=()=>{const[e,a]=j.useState({}),[r,l]=j.useState(!1),{data:d,setData:f,post:N}=E({oldPassword:"",newPassword:"",confirmPassword:""}),i=t=>{f(w(h({},d),{[t.target.id]:t.target.value}))},g=t=>{if(t.preventDefault(),d.oldPassword===""){a({oldPassword:"Please enter old password"});return}if(d.newPassword===""){a({newPassword:"Please enter new password"});return}N(reverseUrl("cl-change-password"),{onStart:()=>{l(!0)},onSuccess:o=>{var n,c,m;if(l(!1),(n=o.props)!=null&&n.error){u.error((c=o.props)==null?void 0:c.error,{position:"top-right",duration:3e3,style:{minWidth:"200px",padding:"10px 20px",borderRadius:"10px"},icon:"❌"});return}u.success((m=o.props)==null?void 0:m.success,{position:"top-right",duration:3e3,style:{minWidth:"200px",padding:"10px 20px",borderRadius:"10px"},icon:"✔"})},onError:o=>{l(!1),a(o)}})};return s.jsxs("div",{className:"card card-raised",children:[s.jsx("div",{className:"card-header bg-info px-4",children:s.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[s.jsxs("div",{className:"me-4",children:[s.jsx("h2",{className:"display-6 mb-0 text-white",children:"Reset Password"}),s.jsx("div",{className:"card-text"})]}),s.jsx("div",{className:"d-flex gap-2"})]})}),s.jsx("div",{className:"card-body p-4",children:s.jsxs("div",{className:"card",children:[s.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:s.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:s.jsxs("div",{className:"me-4",children:[s.jsx("h6",{className:"display-6 mb-0 text-white",children:"Change Password"}),s.jsx("div",{className:"card-text"})]})})}),s.jsx("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:s.jsx("div",{className:"row mb-4",children:s.jsxs("div",{className:"col-md-12",children:[s.jsxs("div",{className:"row",children:[s.jsxs("div",{className:"col-md-4",children:[s.jsxs("label",{className:"form-label",children:["Old Password",s.jsx("span",{className:"text-danger",children:"*"})]}),s.jsx("input",{value:d.odlPassword,onChange:i,type:"password",name:"oldPassword",required:!0,id:"oldPassword",placeholder:"Enter old password",className:"form-control form-control-sm"}),e&&s.jsx("div",{className:"text-danger mt-1",children:e.oldPassword})]}),s.jsxs("div",{className:"col-md-4",children:[s.jsxs("label",{className:"form-label",children:["New Password",s.jsx("span",{className:"text-danger",children:"*"})]}),s.jsx("input",{value:d.newPassword,onChange:i,type:"password",name:"newPassword",required:!0,id:"newPassword",placeholder:"Enter new password",className:"form-control form-control-sm"}),e&&s.jsx("div",{className:"text-danger mt-1",children:e.newPassword})]}),s.jsxs("div",{className:"col-md-4",children:[s.jsxs("label",{className:"form-label",children:["Confirm Password",s.jsx("span",{className:"text-danger",children:"*"})]}),s.jsx("input",{type:"password",className:"form-control form-control-sm",name:"confirmPassword",id:"confirmPassword",placeholder:"Confirm your password",required:!0,onChange:i,value:d.confirmPassword}),e&&s.jsx("div",{className:"text-danger mt-1",children:e.confirmPassword})]})]}),s.jsx("hr",{className:"my-4 bg-info",style:{height:"2px"}}),s.jsxs("button",{onClick:g,className:"btn btn-raised-info d-flex align-items-center justify-content-center gap-2 text-white",style:{minWidth:"200px"},children:[s.jsx("i",{className:"material-icons",children:"done"}),"Update"]})]})})})]})})]})};S.layout=e=>s.jsx(R,{children:e,title:"Reset Password"});export{S as default};
