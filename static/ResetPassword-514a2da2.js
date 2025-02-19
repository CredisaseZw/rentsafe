var v=Object.defineProperty,P=Object.defineProperties;var b=Object.getOwnPropertyDescriptors;var x=Object.getOwnPropertySymbols;var y=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var p=(e,a,r)=>a in e?v(e,a,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[a]=r,h=(e,a)=>{for(var r in a||(a={}))y.call(a,r)&&p(e,r,a[r]);if(x)for(var r of x(a))C.call(a,r)&&p(e,r,a[r]);return e},w=(e,a)=>P(e,b(a));import{r as j,a as E,j as s}from"./main-66671e9f.js";import{_ as u}from"./index-b99d0477.js";import{L as R}from"./Layout-8e05a598.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-95c06036.js";import"./lodash-ccce9e4b.js";import"./Modal-952b408f.js";import"./index-cb773e7f.js";const S=()=>{const[e,a]=j.useState({}),[r,l]=j.useState(!1),{data:d,setData:f,post:N}=E({oldPassword:"",newPassword:"",confirmPassword:""}),n=t=>{f(w(h({},d),{[t.target.id]:t.target.value}))},g=t=>{if(t.preventDefault(),d.oldPassword===""){a({oldPassword:"Please enter old password"});return}if(d.newPassword===""){a({newPassword:"Please enter new password"});return}N(reverseUrl("cl-change-password"),{onStart:()=>{l(!0)},onSuccess:o=>{var i,c,m;if(l(!1),(i=o.props)!=null&&i.error){u.error((c=o.props)==null?void 0:c.error,{position:"top-right",duration:3e3,style:{minWidth:"200px",padding:"10px 20px",borderRadius:"10px"},icon:"❌"});return}u.success((m=o.props)==null?void 0:m.success,{position:"top-right",duration:3e3,style:{minWidth:"200px",padding:"10px 20px",borderRadius:"10px"},icon:"✔"})},onError:o=>{l(!1),a(o)}})};return s.jsxs("div",{className:"card card-raised",children:[s.jsx("div",{className:"card-header bg-info px-4",children:s.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[s.jsxs("div",{className:"me-4",children:[s.jsx("h2",{className:"display-6 mb-0 text-white",children:"Reset Password"}),s.jsx("div",{className:"card-text"})]}),s.jsx("div",{className:"d-flex gap-2"})]})}),s.jsx("div",{className:"card-body p-4",children:s.jsxs("div",{className:"card",children:[s.jsx("div",{className:"card-header bg-info px-4",style:{paddingTop:"2px",paddingBottom:"2px"},children:s.jsx("div",{className:`d-flex justify-content-center
                            align-items-center`,children:s.jsxs("div",{className:"me-4",children:[s.jsx("h6",{className:"display-6 mb-0 text-white",children:"Change Password"}),s.jsx("div",{className:"card-text"})]})})}),s.jsx("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:s.jsx("div",{className:"row mb-4",children:s.jsxs("div",{className:"col-md-12",children:[s.jsxs("div",{className:"row",children:[s.jsxs("div",{className:"col-md-4",children:[s.jsxs("label",{className:"form-label",children:["Old Password",s.jsx("span",{className:"text-danger",children:"*"})]}),s.jsx("input",{value:d.odlPassword,onChange:n,type:"password",name:"oldPassword",required:!0,id:"oldPassword",placeholder:"Enter old password",className:"form-control form-control-sm"}),e&&s.jsx("div",{className:"text-danger mt-1",children:e.oldPassword})]}),s.jsxs("div",{className:"col-md-4",children:[s.jsxs("label",{className:"form-label",children:["New Password",s.jsx("span",{className:"text-danger",children:"*"})]}),s.jsx("input",{value:d.newPassword,onChange:n,type:"password",name:"newPassword",required:!0,id:"newPassword",placeholder:"Enter new password",className:"form-control form-control-sm"}),e&&s.jsx("div",{className:"text-danger mt-1",children:e.newPassword})]}),s.jsxs("div",{className:"col-md-4",children:[s.jsxs("label",{className:"form-label",children:["Confirm Password",s.jsx("span",{className:"text-danger",children:"*"})]}),s.jsx("input",{type:"password",className:"form-control form-control-sm",name:"confirmPassword",id:"confirmPassword",placeholder:"Confirm your password",required:!0,onChange:n,value:d.confirmPassword}),e&&s.jsx("div",{className:"text-danger mt-1",children:e.confirmPassword})]})]}),s.jsx("hr",{className:"my-4 bg-info",style:{height:"2px"}}),s.jsxs("button",{onClick:g,className:"btn btn-raised-info d-flex align-items-center justify-content-center gap-2 text-white",style:{minWidth:"200px"},children:[s.jsx("i",{className:"material-icons",children:"done"}),"Update"]})]})})})]})})]})};S.layout=e=>s.jsx(R,{children:e,title:"Reset Password"});export{S as default};
