var F=Object.defineProperty,A=Object.defineProperties;var M=Object.getOwnPropertyDescriptors;var S=Object.getOwnPropertySymbols;var O=Object.prototype.hasOwnProperty,T=Object.prototype.propertyIsEnumerable;var C=(r,s,t)=>s in r?F(r,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[s]=t,U=(r,s)=>{for(var t in s||(s={}))O.call(s,t)&&C(r,t,s[t]);if(S)for(var t of S(s))T.call(s,t)&&C(r,t,s[t]);return r},L=(r,s)=>A(r,M(s));import{r as o,a as k,j as e,u as q}from"./main-b0023e79.js";import{P}from"./PageHeader-5ed008b1.js";import{L as B}from"./Layout-4b440c51.js";import{I,_ as p}from"./index-75883b0c.js";import{M as j}from"./Modal-ab2a8506.js";import{B as w}from"./Button-c6813304.js";import"./removeClass-a49abf79.js";import"./index-400f49cd.js";const E=({show:r,handleClose:s,action:t,receivedData:a,url:m})=>{const[u,i]=o.useState(!1),[l,N]=o.useState(""),{data:n,setData:b,post:g,put:v,reset:f}=k({firstName:Object.keys(a).length>0?a.firstName:"",lastName:Object.keys(a).length>0?a.lastName:"",identificationNumber:Object.keys(a).length>0?a.identificationNumber:"",identificationType:Object.keys(a).length>0?a.identificationType:"",mobileNumber:Object.keys(a).length>0?a.mobile:"",userEmail:Object.keys(a).length>0?a.email:"",accessLevel:Object.keys(a).length>0?a.access_level:"",address:Object.keys(a).length>0?a.address:"",userId:Object.keys(a).length>0?a.userId:-1}),d=h=>b(L(U({},n),{[h.target.id]:h.target.value})),y=h=>{h.preventDefault(),g(reverseUrl(m),{onStart:()=>{i(!0)},onSuccess:x=>{f(),p.success(`User ${n.firstName} created successfully`),i(!1)},onError:x=>{console.log(x),p.error("Something went wrong! Please try again"),N(x),i(!1)}})},c=h=>{console.log(n),h.preventDefault(),v(reverseUrl(m),{onStart:()=>{i(!0)},onSuccess:x=>{f(),p.success(`User ${n.firstName} updated successfully`),i(!1)},onError:x=>{console.log(x),p.error("Something went wrong! Please try again"),N(x),i(!1)}})};return e.jsx(e.Fragment,{children:e.jsx(j,{size:"lg",show:r,onHide:s,children:e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx(j.Header,{closeButton:!0,className:"card-header bg-info px-4",children:e.jsxs("div",{className:`d-flex justify-content-between
                align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:"System User"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"card",children:e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsxs(j.Body,{children:[e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsx(I,{}),e.jsxs("div",{className:"col-lg-4",children:[e.jsx("label",{className:"form-label",children:"Surname"}),e.jsx("input",{value:n.lastName,onChange:d,type:"text",placeholder:"Surname",required:!0,name:"lastName",id:"lastName",className:"form-control form-control-sm"}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.lastName})]}),e.jsxs("div",{className:"col-lg-4",children:[e.jsx("label",{className:"form-label",children:"First Name"}),e.jsx("input",{value:n.firstName,onChange:d,type:"text",placeholder:"First Name",required:!0,name:"firstName",id:"firstName",className:"form-control form-control-sm"}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.firstName})]}),e.jsxs("div",{class:"col-lg-4",children:[e.jsx("label",{className:"form-label",children:"Identification Type"}),e.jsxs("select",{class:"form-select form-select-sm","aria-label":"Default select example",name:"identificationType",required:!0,id:"identificationType",onChange:d,value:n.identificationType,children:[e.jsx("option",{children:"Select Type..."}),e.jsx("option",{value:"nationalid",children:"National ID"}),e.jsx("option",{value:"passport",children:"Passport"}),e.jsx("option",{value:"servicesid",children:"Service ID"})]}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.identificationType})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-lg-4",children:[e.jsx("label",{className:"form-label",children:"Identification Number"}),e.jsx("input",{value:n.identificationNumber,onChange:d,type:"text",required:!0,placeholder:"Identification Number",name:"identificationNumber",id:"identificationNumber",className:"form-control form-control-sm"}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.identificationNumber})]}),e.jsxs("div",{className:"col-lg-4",children:[e.jsx("label",{className:"form-label",children:"Address"}),e.jsx("textarea",{value:n.address,onChange:d,type:"text",placeholder:"Address",id:"address",required:!0,name:"address",className:"form-control form-control-sm"}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.address})]}),e.jsxs("div",{className:"col-lg-4",children:[e.jsx("label",{className:"form-label",children:"Mobile Number"}),e.jsx("input",{value:n.mobileNumber,onChange:d,required:!0,placeholder:"Mobile Number",type:"text",name:"mobileNumber",id:"mobileNumber",className:"form-control form-control-sm"}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.mobileNumber})]})]})})}),e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"row",children:[e.jsxs("div",{className:"col-lg-4",children:[e.jsx("label",{className:"form-label",children:"Access Level"}),e.jsxs("select",{value:n.accessLevel,onChange:d,id:"accessLevel",required:!0,name:"accessLevel",className:"form-select form-select-sm",children:[e.jsx("option",{children:"Select Level..."}),e.jsx("option",{value:"admin",children:"Admin"}),e.jsx("option",{value:"user",children:"User"})]}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.accessLevel})]}),e.jsxs("div",{className:"col-lg-4",children:[e.jsx("label",{className:"form-label",children:"User Email"}),e.jsx("input",{value:n.userEmail,onChange:d,type:"email",name:"userEmail",placeholder:"eg. joe@rentsafe.com",id:"userEmail",required:!0,className:"form-control form-control-sm"}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.userEmail})]})]})})})]}),e.jsx(j.Footer,{children:e.jsx(w,{className:"text-white",variant:"info",onClick:t==="add"?y:c,disabled:u,children:u?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):t==="add"?"Add User":"Update User"})})]})})})]})})})})},H=({show:r,handleClose:s,userData:t})=>{const[a,m]=o.useState(!1),{data:u,post:i}=k({userId:t.userId}),l=()=>{i(reverseUrl("destroy-user"),{onStart:()=>{m(!0)},onSuccess:N=>{p.success("User deleted successfully"),m(!1),s()},onError:N=>{p.error("Something went wrong! Please try again"),m(!1)}}),s()};return e.jsx("div",{className:"container-xl p-5",children:e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs(j,{show:r,onHide:s,size:"md",backdrop:"static",centered:!0,children:[e.jsx(j.Header,{closeButton:!0,className:"h4 bg-info text-white text-center text-uppercase",children:"Confirm Delete User"}),e.jsxs(j.Body,{className:"p-4 d-flex justify-content-between align-items-center gap-4",children:[e.jsx(I,{}),e.jsxs("p",{className:"my-3 text-center",children:["Are you sure you want to delete ",t.firstName," ",t.lastName," from the system? This action cannot be undone."]})]}),e.jsxs(j.Footer,{className:"p-4 d-flex justify-content-end gap-4",children:[e.jsxs(w,{onClick:s,variant:"secondary",children:[e.jsx("i",{className:"material-icons",children:"cancel"}),"Cancel"]}),e.jsxs(w,{onClick:l,variant:"danger",children:[e.jsx("i",{className:"material-icons",children:"done"}),"Delete"]})]})]})})})})},V=H;function _(){const r=q().props.users,[s,t]=o.useState(!1),[a,m]=o.useState(!1),[u,i]=o.useState(!1),[l,N]=o.useState(""),[n,b]=o.useState(!1),[g,v]=o.useState({}),[f,d]=o.useState(r);function y(c){c.preventDefault(),N(c.target.value);const h=r.filter(x=>x.email.toLowerCase().includes(c.target.value.toLowerCase()));d(h)}return e.jsxs("main",{children:[e.jsx(P,{title:"Users"}),e.jsx("div",{className:"container-xl p-5",children:e.jsx("div",{className:"row align-items-center mb-5",children:e.jsxs("div",{className:"col-md-12",children:[e.jsx("div",{className:"col-12 col-md-auto",children:e.jsx("form",{className:"mb-2",children:e.jsxs("div",{className:"d-flex flex-column flex-sm-row gap-3",children:[e.jsx("div",{className:"col-sm-6",children:e.jsx("input",{value:l,placeholder:"Email",onChange:y,type:"text",name:"searchValue",id:"searchValue",required:!0,className:"form-control form-control"})}),e.jsxs("button",{className:"btn btn-raised-info text-white",type:"submit",disabled:s,children:[e.jsx("i",{className:"leading-icon material-icons",children:"search"}),s?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Searching.."})]}):"Search"]})]})})}),e.jsx("div",{className:"d-flex flex-row-reverse",children:e.jsxs("button",{className:"btn btn-raised-info text-white",onClick:()=>m(!0),children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"New User"]})}),e.jsx("div",{className:"card card-raised mb-5",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs("div",{className:"datatable-wrapper datatable-loading no-footer sortable searchable fixed-columns",children:[e.jsxs("div",{className:"datatable-container",children:[e.jsx("table",{className:"table table-striped",children:e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("th",{scope:"col",children:"Surname"}),e.jsx("th",{scope:"col",children:"First Name"}),e.jsx("th",{scope:"col",children:"Level"}),e.jsx("th",{scope:"col",children:"Email"}),e.jsx("th",{scope:"col",children:"Mobile Number"}),e.jsx("th",{scope:"col",children:"Actions"})]}),s&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"searching.."})]}),f==null?void 0:f.map(c=>e.jsxs("tr",{children:[e.jsx("td",{children:c.lastName}),e.jsx("td",{children:c.firstName}),e.jsx("td",{className:"text-capitalize",children:c.access_level}),e.jsx("td",{children:c.email}),e.jsx("td",{children:c.mobile}),e.jsxs("td",{className:"d-flex gap-2",children:[e.jsx("button",{className:"btn btn-info text-white",onClick:()=>{i(!0),v(c)},children:"Edit"}),e.jsx("button",{className:"btn btn-danger text-white",onClick:()=>{b(!0),v(c)},children:"Delete"})]})]},c.userId))]})}),(a||u||n)&&e.jsx("div",{className:"row justify-content-center",children:e.jsxs("div",{className:"col-md-auto",children:[e.jsx(E,{show:a,handleClose:()=>m(!1),action:"add",receivedData:{},url:"create-user"}),e.jsx(E,{show:u,handleClose:()=>i(!1),action:"edit",receivedData:g,url:"edit-user"}),e.jsx(V,{show:n,handleClose:()=>b(!1),userData:g})]})})]}),e.jsxs("div",{className:"datatable-bottom",children:[e.jsx("div",{className:"datatable-info"}),e.jsx("nav",{className:"datatable-pagination"})]})]})})})]})})})]})}_.layout=r=>e.jsx(B,{children:r,title:"Users"});export{_ as default};
