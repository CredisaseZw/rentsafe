var w=Object.defineProperty,y=Object.defineProperties;var v=Object.getOwnPropertyDescriptors;var u=Object.getOwnPropertySymbols;var P=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var x=(a,e,r)=>e in a?w(a,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):a[e]=r,b=(a,e)=>{for(var r in e||(e={}))P.call(e,r)&&x(a,r,e[r]);if(u)for(var r of u(e))C.call(e,r)&&x(a,r,e[r]);return a},g=(a,e)=>y(a,v(e));import{u as f,r as S,a as k,j as s,n as c}from"./main-cca8b9b1.js";import{L as E}from"./Layout-6fa41138.js";function L({errors:a}){const e=f().props.company_email,r=f().props.company_name,[m,i]=S.useState(!1),{data:o,setData:h,post:j}=k({username:e||"",password:"",confirmPassword:""}),l=n=>h(g(b({},o),{[n.target.id]:n.target.value})),N=n=>{if(n.preventDefault(),o.password.length<6){c.error("Password must be at least 6 characters");return}if(o.password!==o.confirmPassword){c.error("Passwords do not match");return}j(reverseUrl("client-company-verify-otp"),{onStart:()=>{i(!0)},onSuccess:t=>{i(!1)},onError:t=>{var d,p;c.error((p=(d=t==null?void 0:t.response)==null?void 0:d.data)==null?void 0:p.message)}})};return s.jsx(s.Fragment,{children:s.jsxs("div",{className:"row g-0",children:[s.jsx("div",{className:"col-lg-5 col-md-6",children:s.jsxs("div",{className:"card-body p-5",children:[s.jsxs("div",{className:"text-center",children:[s.jsx("img",{className:"mb-3",src:"",alt:"logo",style:{height:"48px"}}),s.jsx("h1",{className:"display-5 mb-0",children:"Welcome to CrediSafe"}),s.jsxs("div",{className:"subheading-1 mb-5",children:[s.jsx("strong",{children:r}),", confirm account by inserting password below"]})]}),s.jsxs("form",{className:"mb-5",onSubmit:N,children:[s.jsxs("div",{className:"mb-4",children:[s.jsx("label",{className:"form-label",children:"Username"}),s.jsx("input",{value:o.username,onChange:l,type:"text",name:"username",id:"username",disabled:!0,className:"form-control form-control-sm"})]}),s.jsxs("div",{className:"mb-4",children:[s.jsx("label",{className:"form-label",children:"Password"}),s.jsx("input",{value:o.password,onChange:l,type:"password",name:"password",id:"password",className:"form-control form-control-sm"})]}),s.jsxs("div",{className:"mb-4",children:[s.jsx("label",{className:"form-label",children:"Confirm Password"}),s.jsx("input",{value:o.confirmPassword,onChange:l,type:"password",name:"confirmPassword",id:"confirmPassword",className:"form-control form-control-sm"})]}),s.jsx("div",{className:"form-group d-flex align-items-center justify-content-between mt-4 mb-0",children:s.jsx("button",{className:"btn btn-primary mdc-ripple-upgraded",type:"submit",disabled:m,children:m?s.jsxs(s.Fragment,{children:[s.jsx("span",{className:"spinner-grow spinner-grow-sm"}),s.jsx("span",{className:"ml-2",children:"processing.."})]}):"Submit"})})]}),s.jsx("div",{className:"text-center"})]})}),s.jsx("div",{className:"col-lg-7 col-md-6 d-none d-md-block",style:{backgroundImage:"url('https://source.unsplash.com/-uHVRvDr7pg/1600x900')",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center"}})]})})}L.layout=a=>s.jsx(E,{children:a,title:"Account Confirmation"});export{L as default};
