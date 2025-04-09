import{r as u,b as f,_ as j,j as e}from"./media/main-03506851.js";import{L as O}from"./Layout-5dfbe7be.js";import{u as v}from"./index-81a8d5ca.js";import"./lodash-53c4daa3.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-5c418ba9.js";import"./Modal-af3c3068.js";import"./index-c9bff481.js";import"./formatting-fad57ba1.js";import"./MultipleUpload-2f4dc496.js";import"./search-a4b5c39c.js";function S(){const[r,c]=u.useState([]),[x,b]=u.useState([]),[p,d]=u.useState(!1);function o(){f.get("/accounting/vat-settings/").then(s=>{b(s.data)}).catch(s=>{console.error(s)})}u.useEffect(()=>{o()},[]);function g(){c(s=>[...s,{id:"item-"+Math.random().toString(36).substr(2,9),description:"",rate:""}])}function t(s){c(n=>n.filter(l=>l.id!==s))}function i(s,n,l){l&&c(a=>a.map(h=>h.id===l?{...h,[s]:n}:h))}function m(s){f.delete(`/accounting/vat-settings/${s.id}/`).then(n=>{j.success("VAT setting deleted successfully"),o()}).catch(n=>{console.error(n),j.error(v(n))})}function w(s){s.preventDefault(),d(!0);const n=new FormData(s.target),l=Array.from(n.entries()).reduce((a,[h,y])=>{const[T,N]=h.split("-");return a[N]||(a[N]={}),a[N][T]=y,a},[]);f.post("/accounting/vat-settings/",l).then(a=>{d(!1),j.success("VAT settings updated successfully"),o(),c([])}).catch(a=>{d(!1),console.error(a),j.error(v(a))})}return{loading:p,taxOptions:x,newTaxOptions:r,handleSubmit:w,changeHandler:i,addNewTaxOption:g,removeTaxOption:m,removeNewTaxOption:t}}function k({}){const{loading:r,taxOptions:c,newTaxOptions:x,handleSubmit:b,changeHandler:p,removeTaxOption:d,addNewTaxOption:o,removeNewTaxOption:g}=S();return e.jsx("main",{children:e.jsxs("form",{className:"row",onSubmit:b,children:[e.jsx("div",{className:"col col-3 py-0",children:e.jsxs("div",{className:"bg-white border custom-rounded-2 shadow-sm p-4",children:[e.jsx("div",{className:"mb-5 fw-bold",children:"Registration"}),e.jsxs("div",{className:"form-check mb-4",children:[e.jsx("input",{className:"form-check-input",disabled:!0,type:"checkbox",value:"registered",id:"vat_registered"}),e.jsx("label",{className:"form-check-label",htmlFor:"vat_registered",children:"V.A.T Registered"})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{htmlFor:"vat_registration_number",className:"form-label",children:"V.A.T Registration Number"}),e.jsx("input",{disabled:!0,type:"text",className:"form-control border",id:"vat_registration_number"})]})]})}),e.jsx("div",{className:"col col-9",children:e.jsxs("div",{children:[e.jsx("div",{className:"p-2 fw-bold text-center",children:"Tax Options"}),e.jsx("div",{className:"custom-mn-h-2 mb-3",children:e.jsxs("table",{className:"table table-sm table-respnsive shadow-sm bg-white",children:[e.jsx("thead",{className:"position-sticky c-table-top c-bg-light shadow-sm c-z-5",children:e.jsxs("tr",{className:"c-force-borders text-center",children:[e.jsx("th",{className:"ps-3 text-start",style:{width:"60%"},children:e.jsx("div",{children:" Description"})}),e.jsx("th",{className:"text-start",children:e.jsx("div",{children:"Rate (%) "})}),e.jsx("th",{children:e.jsx("div",{children:" "})})]})}),e.jsxs("tbody",{children:[!(c?.length||x?.length)&&e.jsx("tr",{children:e.jsx("td",{colSpan:3,children:e.jsx("div",{className:"p-5 bg-white d-flex justify-content-center align-items-center",children:"Nothing to show"})})}),c?.map((t,i)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:t.description}),e.jsxs("td",{className:"ps-3",children:[t.rate," %"]}),e.jsx("td",{className:"pe-3 custom-mx-w-05 text-end",children:e.jsx("button",{type:"button",className:"btn p-1 btn-sm btn-danger",onClick:()=>d(t),children:e.jsx("i",{className:"material-icons",children:"close"})})})]},i)),x?.map((t,i)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:e.jsx("div",{children:e.jsx("input",{type:"text",className:"form-control",placeholder:"description",name:"description-"+i,id:"description-"+i,value:t.description,required:!0,onChange:m=>p("description",m.target.value,t.id)})})}),e.jsx("td",{className:"ps-3",children:e.jsx("div",{children:e.jsx("input",{type:"number",step:.001,className:"form-control",placeholder:"rate in %",name:"rate-"+i,required:!0,id:"rate-"+i,value:t.rate,onChange:m=>p("rate",m.target.value,t.id)})})}),e.jsx("td",{className:"pe-3 custom-mx-w-05 text-end",children:e.jsx("button",{type:"button",className:"btn btn-sm btn-danger",onClick:()=>g(t.id),children:e.jsx("i",{className:"material-icons",children:"close"})})})]},i))]})]})}),e.jsx("div",{className:"text-end",children:e.jsxs("button",{type:"button",disabled:r,className:"btn btn-outline-info ",onClick:o,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"Add Tax Item"]})}),e.jsx("div",{className:"text-center",children:e.jsxs("button",{disabled:r,type:"submit",className:"btn btn-info text-white",children:[r?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"d-inline-block ms-2",children:"Updating.."})]}):"Update",e.jsx("i",{className:"trailing-icon material-icons",children:"save"})]})})]})})]})})}k.layout=r=>e.jsx(O,{children:r,title:"Sales Categories"});export{k as default};
