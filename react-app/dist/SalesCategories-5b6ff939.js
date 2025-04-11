import{R as x,r as y,b as j,_ as d,j as e}from"./media/main-bfba9c40.js";import{C as N,L as w}from"./Layout-07e2828c.js";import{M as S}from"./MessageModal-9f842584.js";import{u as p,f as v}from"./index-c591c0af.js";import"./lodash-734d596d.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-348ece4c.js";import"./Modal-07685045.js";import"./index-d481af93.js";import"./formatting-fad57ba1.js";import"./MultipleUpload-2d782191.js";import"./search-bcc199af.js";function D(){const[a,n]=x.useState(!1),[o,l]=x.useState(null),[r,g]=x.useState([]),[u,c]=x.useState(!1);function m(){n(!1)}function s(){n(!0)}function i(){j.get("/accounting/sales-categories/").then(t=>{g(t.data)}).catch(t=>{console.log(t),d.error(p(t))})}y.useEffect(()=>{i()},[]);function f(t){t.preventDefault(),c(!0);const b=Object.fromEntries(new FormData(t.target));console.log(b),j.post("/accounting/sales-categories/",b).then(h=>{c(!1),console.log(h),d.success("Category added successfully"),m(),i()}).catch(h=>{c(!1),console.log(h),d.error(p(h))})}function C(){j.delete(`/accounting/sales-categories/${o.id}/`).then(t=>{console.log(t),d.success("Category deleted successfully"),l(null),i()}).catch(t=>{console.log(t),d.error(p(t))})}return{showAdd:a,loading:u,categories:r,categoryToDelete:o,setCategoryToDelete:l,deleteCategory:C,handleAddCategory:f,openShowAdd:s,handleClose:m}}function A(){const{showAdd:a,loading:n,categories:o,categoryToDelete:l,setCategoryToDelete:r,handleAddCategory:g,deleteCategory:u,openShowAdd:c,handleClose:m}=D();return e.jsxs("main",{children:[e.jsx(S,{show:!!l,handleClose:()=>r(null),title:"Delete Category",message:`Are you sure you want to delete ${l?.category}?`,actionButtons:e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn btn-sm btn-info text-white",onClick:()=>r(null),children:"Cancel"}),e.jsx("button",{className:"btn btn-sm btn-danger",onClick:u,children:"Delete"})]})}),e.jsx(N,{show:a,handleClose:m,title:"Add Category",size:"md",children:e.jsxs("form",{className:"px-4 pb-5",onSubmit:g,children:[e.jsx("div",{className:"c-bg-light p-1 mb-3 text-center",children:"Sales Category"}),e.jsxs("div",{className:"d-flex gap-4 justify-content-between align-items-center",children:[e.jsxs("div",{children:[e.jsx("label",{htmlFor:"code",className:"text-center w-100 form-label",children:"Code"}),e.jsx("input",{type:"text",className:"form-control",id:"code",name:"code",required:!0})]}),e.jsxs("div",{children:[e.jsx("label",{htmlFor:"category",className:"text-center w-100 form-label",children:"Category"}),e.jsx("input",{type:"text",className:"form-control",id:"category",name:"name",required:!0})]})]}),e.jsx("div",{className:"mt-5 text-center",children:e.jsx("button",{disabled:n,type:"submit",className:"btn btn-primary",children:n?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"d-inline-block ms-2",children:"Saving.."})]}):"Save"})})]})}),e.jsxs("h5",{className:"position-relative text-center mb-2 p-2 mb-0",children:["Sales Categories",e.jsx("div",{className:"position-absolute top-0 end-0",children:e.jsxs("button",{className:"btn btn-info text-white",onClick:c,children:[e.jsx("i",{className:"leading-icon material-icons",children:"add"}),"New"]})})]}),e.jsxs("table",{className:"table table-sm table-striped border bg-white",children:[e.jsx("thead",{className:"position-sticky c-table-top text-white bg-info shadow-sm c-z-5",children:e.jsxs("tr",{className:"c-force-borders c-force-borders-white",children:[e.jsx("th",{className:"ps-3",children:e.jsx("div",{children:" Code"})}),e.jsx("th",{children:e.jsx("div",{children:"Category "})}),e.jsx("th",{children:e.jsx("div",{children:"Date Created "})}),e.jsx("th",{children:e.jsx("div",{children:" "})})]})}),e.jsxs("tbody",{children:[!o?.length&&e.jsx("tr",{children:e.jsx("td",{colSpan:4,children:e.jsx("div",{className:"custom-h-3 bg-white d-flex justify-content-center align-items-center",children:"Nothing to show"})})}),o?.map((s,i)=>e.jsxs("tr",{children:[e.jsx("td",{className:"ps-3",children:s.code}),e.jsx("td",{className:"custom-mn-w-2 ps-3",children:s.name}),e.jsx("td",{className:"ps-3",children:s.date_created&&v(s.date_created)}),e.jsx("td",{className:"pe-3 custom-mx-w-05 text-end",children:e.jsx("button",{onClick:()=>r(s),className:"btn btn-sm btn-danger",children:"Delete"})})]},i))]})]})]})}A.layout=a=>e.jsx(w,{children:a,title:"Sales Categories"});export{A as default};
