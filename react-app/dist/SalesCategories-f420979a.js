import{R as x,r as N,b as j,_ as d,j as e}from"./main-d177c8be.js";import{C as y}from"./ContentModal-81eda560.js";import{L as w}from"./Layout-1f1c28e3.js";import{M as S}from"./MessageModal-2031013c.js";import{u as p,f as v}from"./index-76a92306.js";import"./Modal-8132fe13.js";import"./removeClass-31d97cbe.js";import"./index-c3ef11bf.js";import"./lodash-5de1c1ef.js";import"./assertThisInitialized-3be3daa4.js";import"./formatting-9de8c923.js";import"./MultipleUpload-6cdfe0b0.js";import"./search-d4efe166.js";function A(){const[o,l]=x.useState(!1),[s,n]=x.useState(null),[r,u]=x.useState([]),[g,c]=x.useState(!1);function m(){l(!1)}function a(){l(!0)}function i(){j.get("/accounting/sales-categories/").then(t=>{console.log(t),u(t.data)}).catch(t=>{console.log(t),d.error(p(t))})}N.useEffect(()=>{i()},[]);function f(t){t.preventDefault(),c(!0);const b=Object.fromEntries(new FormData(t.target));console.log(b),j.post("/accounting/sales-categories/",b).then(h=>{c(!1),console.log(h),d.success("Category added successfully"),m(),i()}).catch(h=>{c(!1),console.log(h),d.error(p(h))})}function C(){j.delete(`/accounting/sales-categories/${s.id}/`).then(t=>{console.log(t),d.success("Category deleted successfully"),n(null),i()}).catch(t=>{console.log(t),d.error(p(t))})}return{showAdd:o,loading:g,categories:r,categoryToDelete:s,setCategoryToDelete:n,deleteCategory:C,handleAddCategory:f,openShowAdd:a,handleClose:m}}function D(){const{showAdd:o,loading:l,categories:s,categoryToDelete:n,setCategoryToDelete:r,handleAddCategory:u,deleteCategory:g,openShowAdd:c,handleClose:m}=A();return e.jsxs("main",{children:[e.jsx(S,{show:!!n,handleClose:()=>r(null),title:"Delete Category",message:`Are you sure you want to delete ${n==null?void 0:n.category}?`,actionButtons:e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn btn-sm btn-info text-white",onClick:()=>r(null),children:"Cancel"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:g,children:"Delete"})]})}),e.jsx(y,{show:o,handleClose:m,title:"Add Category",size:"md",children:e.jsxs("form",{className:"px-4 pb-5",onSubmit:u,children:[e.jsx("div",{className:"c-bg-light p-1 mb-3 text-center",children:"Sales Category"}),e.jsxs("div",{className:"d-flex gap-4 justify-content-between align-items-center",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"code",className:"text-center w-100 form-label",children:"Code"}),e.jsx("input",{type:"text",className:"form-control",id:"code",name:"code",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"category",className:"text-center w-100 form-label",children:"Category"}),e.jsx("input",{type:"text",className:"form-control",id:"category",name:"name",required:!0})]})]}),e.jsx("div",{className:"mt-5 text-center",children:e.jsx("button",{disabled:l,type:"submit",className:"btn btn-primary",children:l?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"d-inline-block ms-2",children:"Saving.."})]}):"Save"})})]})}),e.jsxs("h5",{className:"position-relative text-center mb-2 p-2 mb-0",children:["Sales Categories",e.jsx("div",{className:"position-absolute top-0 end-0",children:e.jsxs("button",{className:"btn btn-info text-white",onClick:c,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"New"]})})]}),e.jsxs("table",{className:"table table-sm table-striped border bg-white",children:[e.jsx("thead",{className:"position-sticky c-table-top text-white bg-info shadow-sm c-z-5",children:e.jsxs("tr",{className:"c-force-borders c-force-borders-white",children:[e.jsx("th",{className:"ps-3",children:e.jsx("div",{children:" Code"})}),e.jsx("th",{children:e.jsx("div",{children:"Category "})}),e.jsx("th",{children:e.jsx("div",{children:"Date Created "})}),e.jsx("th",{children:e.jsx("div",{children:" "})})]})}),e.jsxs("tbody",{children:[!(s!=null&&s.length)&&e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx("div",{className:"custom-h-3 bg-white d-flex justify-content-center align-items-center",children:"Nothing to show"})})}),s==null?void 0:s.map((a,i)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:a.code}),e.jsx("td",{className:"custom-mn-w-2 ps-3",children:a.name}),e.jsx("td",{className:"ps-3",children:a.date_created&&v(a.date_created)}),e.jsx("td",{className:"pe-3 custom-mx-w-05 text-center",children:e.jsx("button",{onClick:()=>r(a),className:"btn btn-sm btn-danger",children:"Delete"})})]},i))]})]})]})}D.layout=o=>e.jsx(w,{children:o,title:"Sales Categories"});export{D as default};
