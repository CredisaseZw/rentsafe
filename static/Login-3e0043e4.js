var w=Object.defineProperty,y=Object.defineProperties;var v=Object.getOwnPropertyDescriptors;var p=Object.getOwnPropertySymbols;var L=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable;var g=(a,s,n)=>s in a?w(a,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):a[s]=n,x=(a,s)=>{for(var n in s||(s={}))L.call(s,n)&&g(a,n,s[n]);if(p)for(var n of p(s))S.call(s,n)&&g(a,n,s[n]);return a},f=(a,s)=>y(a,v(s));import{r as m,a as E,n as l,j as e}from"./main-6ad02b95.js";import{L as H}from"./Layout-45e87188.js";function C(a,s){const[n,o]=m.useState(!1),[d,c]=m.useState(!1),{data:r,setData:b,post:u}=E({email:"",password:""});m.useEffect(()=>{s!=null&&s.type&&l[s.type](s.message),(a==null?void 0:a.type)==="success"&&!d&&(l.success(a.message),c(!0))},[s,a]);function j(t){b(f(x({},r),{[t.target.id]:t.target.value}))}function h(){if(!r.email){l.error("Enter your email");return}u(reverseUrl("forgot_password"),{onStart(){o(!0)},onError(t){console.log(t),l.error("something went wrong"),o(!1)},onSuccess(t){var i;(i=t==null?void 0:t.props)!=null&&i.success&&l.success(t.props.success.message),o(!1)}})}function N(t){t.preventDefault(),u(reverseUrl("login"),{onStart(){o(!0)},onSuccess(i){console.log(i),o(!1)},onError(i){console.log(i),o(!1)}})}return{data:r,isLoading:n,submitHandler:N,changeHandler:j,forgotPasswordHandler:h}}function F({flash:a,error:s}){const{data:n,isLoading:o,submitHandler:d,changeHandler:c,forgotPasswordHandler:r}=C(a,s);return e.jsxs("form",{className:"p-5 my-5",onSubmit:d,children:[e.jsxs("div",{className:"text-center",children:[e.jsx("i",{className:"material-icons fs-1",children:"person"}),e.jsx("h1",{className:"display-5 mb-0 mt-2",children:"Credi-Safe"}),e.jsx("div",{className:"subheading-1 mb-4",children:"Login to continue"})]}),e.jsxs("div",{className:"px-5",children:[e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"form-label",children:"Email"}),e.jsx("input",{value:n.email,onChange:c,type:"text",name:"email",id:"email",className:"form-control",required:!0})]}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"form-label",children:"Password"}),e.jsx("input",{value:n.password,onChange:c,type:"password",name:"password",id:"password",className:"form-control",required:!0})]}),e.jsxs("div",{className:"d-flex align-items-center justify-content-between",children:[e.jsx("button",{type:"button",className:"btn shadow-none btn-link px-0 text-capitalize",onClick:r,children:"Forgot Password?"}),e.jsx("button",{type:"submit",disabled:o,className:"btn btn-primary",children:o?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ms-2",children:"processing.."})]}):"Login"})]})]})]})}F.layout=a=>e.jsx(H,{children:a,title:"Login"});export{F as default};
