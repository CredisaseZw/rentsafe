var v=Object.defineProperty,w=Object.defineProperties;var y=Object.getOwnPropertyDescriptors;var p=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,L=Object.prototype.propertyIsEnumerable;var g=(a,e,r)=>e in a?v(a,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):a[e]=r,x=(a,e)=>{for(var r in e||(e={}))k.call(e,r)&&g(a,r,e[r]);if(p)for(var r of p(e))L.call(e,r)&&g(a,r,e[r]);return a},h=(a,e)=>w(a,y(e));import{r as b,u as S,a as E,j as s}from"./main-c733e0a6.js";import{n as c}from"./index-9075d868.js";import{L as F}from"./Layout-43907388.js";function P({errors:a}){const[e,r]=b.useState(!1),i=S().props.flash;i.type==="success"&&!e&&(c.success(i.message),r(!0));const[m,t]=b.useState(!1),{data:n,setData:f,post:d}=E({email:"",password:""}),u=l=>f(h(x({},n),{[l.target.id]:l.target.value})),j=l=>{l.preventDefault(),n.email!==""?d(reverseUrl("forgot_password"),{onStart:()=>{t(!0)},onSuccess:o=>{o.props.success&&c.success(o.props.success.message),t(!1)},onError:o=>{t(!1)}}):c.error("Enter your email")},N=l=>{console.log("clicked"),l.preventDefault(),d(reverseUrl("login"),{onStart:()=>{console.log("starting..."),t(!0)},onSuccess:o=>{console.log(o.message),t(!1)},onError:o=>{console.log(o.errors)}})};return s.jsx(s.Fragment,{children:s.jsxs("div",{className:"row g-0",children:[s.jsx("div",{className:"col-lg-5 col-md-6 col-12",children:s.jsxs("div",{className:"card-body p-5 w-100",children:[s.jsxs("div",{className:"text-center",children:[s.jsx("img",{className:"mb-3",src:"",alt:"logo",style:{height:"48px"}}),s.jsx("h1",{className:"display-5 mb-0",children:"Login"}),s.jsx("div",{className:"subheading-1 mb-5",children:"to continue to app"})]}),s.jsxs("form",{className:"mb-5 w-100 ",onSubmit:N,children:[s.jsxs("div",{className:"mb-4",children:[s.jsx("label",{className:"form-label",children:"Email"}),s.jsx("input",{value:n.email,onChange:u,type:"text",name:"email",id:"email",className:"form-control form-control-sm"})]}),s.jsxs("div",{className:"mb-4",children:[s.jsx("label",{className:"form-label",children:"Password"}),s.jsx("input",{value:n.password,onChange:u,type:"password",name:"password",id:"password",className:"form-control form-control-sm"})]}),s.jsxs("div",{className:"form-group d-flex align-items-center justify-content-between mt-4 mb-0",children:[s.jsx("button",{onClick:j,className:"btn btn-link",type:"button",children:"Forgot Password?"}),s.jsx("button",{className:"btn btn-primary mdc-ripple-upgraded",type:"submit",disabled:m,children:m?s.jsxs(s.Fragment,{children:[s.jsx("span",{className:"spinner-grow spinner-grow-sm"}),s.jsx("span",{className:"ml-2",children:"processing.."})]}):"Login"})]})]}),s.jsx("div",{className:"text-center"})]})}),s.jsx("div",{className:"col-lg-7 col-md-6 d-none d-md-block",style:{backgroundImage:"url('https://source.unsplash.com/-uHVRvDr7pg/1600x900')",backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center"}})]})})}P.layout=a=>s.jsx(F,{children:a,title:"Login"});export{P as default};
