var N=Object.defineProperty;var f=Object.getOwnPropertySymbols;var p=Object.prototype.hasOwnProperty,D=Object.prototype.propertyIsEnumerable;var u=(i,e,t)=>e in i?N(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t,h=(i,e)=>{for(var t in e||(e={}))p.call(e,t)&&u(i,t,e[t]);if(f)for(var t of f(e))D.call(e,t)&&u(i,t,e[t]);return i};import{j as s,b,_ as d}from"./main-a6dda5c9.js";import{M as n}from"./Modal-c2655e25.js";import{B as j}from"./Button-de29c17c.js";const U=({url:i,handleClose:e,show:t,type:r,userId:c,name:m,setFetchedData:g,setAllAgents:y})=>{let o={};r==="company"?o={company_id:c}:(r==="individual"||r==="agent")&&(o={individual_id:c});const w=()=>{b.post(reverseUrl(i),h({},o)).then(x=>{x.data.status==="success"?(d.success(`User ${m} deleted successfully`),g(a=>a==null?void 0:a.filter(l=>l.id!==c)),y(a=>a==null?void 0:a.filter(l=>l.id!==c)),e()):(d.error("Something went wrong! Please try again"),e())}).catch(x=>{d.error("Something went wrong! Please try again"),e()})};return s.jsx("div",{className:"container-xl p-5",children:s.jsx("div",{className:"card card-raised",children:s.jsx("div",{className:"card-body p-4",children:s.jsxs(n,{show:t,onHide:e,size:"sm",backdrop:"static",centered:!0,children:[s.jsx(n.Header,{closeButton:!0,className:"h4 bg-info text-white text-center text-uppercase",children:s.jsx(n.Title,{className:"text-white",children:"Delete User"})}),s.jsxs(n.Body,{className:"p-4 d-flex justify-content-between align-items-center gap-4",children:["Are you sure you want to delete ",r," ",m,"?"]}),s.jsxs(n.Footer,{className:"p-4 d-flex justify-content-end gap-4",children:[s.jsx(j,{variant:"secondary",onClick:e,children:"Cancel"}),s.jsx(j,{variant:"danger",onClick:w,children:"Delete"})]})]})})})})},M=U;export{M as D};
