import{r,j as e,L as a,u as t,H as o}from"./main-5ef5aaa0.js";const m=()=>{r.useState(!1),r.useState(!1);const[l,i]=r.useState(!1),s=()=>{i(!l)};return e.jsx("div",{id:"layoutDrawer_nav",children:e.jsxs("nav",{className:"drawer accordion drawer-light bg-white",id:"drawerAccordion",children:[e.jsx("div",{className:"drawer-menu",style:{backgroundColor:"#26a69a"},children:e.jsxs("div",{className:"nav",children:[e.jsx("div",{className:"drawer-menu-heading"}),e.jsxs(a,{className:"nav-link mdc-ripple-upgraded text-white",href:reverseUrl("home"),style:{cursor:"pointer",fontWeight:"500",fontSize:"16px"},children:[e.jsx("div",{className:"nav-link-icon",children:e.jsx("i",{className:"material-icons",children:"dashboard"})}),"Dashboard"]}),e.jsxs("a",{className:`nav-link text-white collapsed mdc-ripple-upgraded ${l?"collapse":""}`,onClick:s,"data-bs-toggle":"collapse","data-bs-target":"#collapsePages","aria-expanded":"true","aria-controls":"collapsePages",style:{cursor:"pointer",fontWeight:"500",fontSize:"16px"},children:[e.jsx("div",{className:"nav-link-icon",children:e.jsx("i",{className:"material-icons",children:"layers"})}),"Services",e.jsx("div",{className:"drawer-collapse-arrow",children:e.jsx("i",{className:"material-icons",children:"expand_more"})})]}),e.jsx("div",{className:"collapse text-white",id:"collapsePages","aria-labelledby":"headingTwo","data-bs-parent":"#drawerAccordion",children:e.jsx("nav",{className:"drawer-menu-nested nav accordion",id:"drawerAccordionPages",children:e.jsx(a,{className:"nav-link  text-white mdc-ripple-upgraded",href:reverseUrl("client-leases"),children:"RentSafe"})})}),e.jsxs("a",{className:`nav-link text-white collapsed mdc-ripple-upgraded ${l?"collapse":""}`,onClick:s,"data-bs-toggle":"collapse","data-bs-target":"#collapseAccounting","aria-expanded":"true","aria-controls":"collapseAccounting",style:{cursor:"pointer",fontWeight:"500",fontSize:"16px"},children:[e.jsx("div",{className:"nav-link-icon",children:e.jsx("i",{className:"material-icons",children:"layers"})}),"Accounting",e.jsx("div",{className:"drawer-collapse-arrow",children:e.jsx("i",{className:"material-icons",children:"expand_more"})})]}),e.jsx("div",{className:"collapse text-white",id:"collapseAccounting","aria-labelledby":"headingTwo","data-bs-parent":"#drawerAccordion",children:e.jsxs("nav",{className:"drawer-menu-nested nav accordion",id:"drawerAccordionPages",children:[e.jsx("a",{className:"nav-link text-white mdc-ripple-upgraded",href:"#",style:{fontWeight:"500"},children:"Account Adjustment"}),e.jsx("div",{className:"collapse text-white",id:"collapseAccounting","aria-labelledby":"headingTwo","data-bs-parent":"#drawerAccordion",children:e.jsxs("nav",{className:"drawer-menu-nested nav accordion",id:"drawerAccordionPages",children:[e.jsx(a,{className:"nav-link  text-white mdc-ripple-upgraded",href:reverseUrl("debit_journal"),children:"Debit Journals"}),e.jsx(a,{className:"nav-link  text-white mdc-ripple-upgraded",href:reverseUrl("credit_journal"),children:"Credit Journals"})]})}),e.jsx(a,{className:"nav-link  text-white mdc-ripple-upgraded",href:reverseUrl("tenant_statements"),children:"Customer Statements"}),e.jsx(a,{className:"nav-link text-white mdc-ripple-upgraded",href:reverseUrl("client_invoice"),children:"Invoicing"})]})}),e.jsxs("a",{className:`nav-link text-white collapsed mdc-ripple-upgraded ${l?"collapse":""}`,onClick:s,"data-bs-toggle":"collapse","data-bs-target":"#collapseAdmin","aria-expanded":"true","aria-controls":"collapseAdmin",style:{cursor:"pointer",fontWeight:"500",fontSize:"16px"},children:[e.jsx("div",{className:"nav-link-icon",children:e.jsx("i",{className:"material-icons",children:"layers"})}),"Admin",e.jsx("div",{className:"drawer-collapse-arrow",children:e.jsx("i",{className:"material-icons",children:"expand_more"})})]}),e.jsx("div",{className:"collapse text-white",id:"collapseAdmin","aria-labelledby":"headingTwo","data-bs-parent":"#drawerAccordion",children:e.jsx("nav",{className:"drawer-menu-nested nav accordion",id:"drawerAccordionAdmin",children:e.jsx(a,{className:"nav-link  text-white mdc-ripple-upgraded",href:reverseUrl("client-users"),children:"Internal Users"})})})]})}),e.jsx("div",{className:"drawer-footer border-top",children:e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("i",{className:"material-icons text-muted",children:"account_circle"}),e.jsx("div",{className:"ms-3",children:e.jsx("a",{className:"text-muted",href:reverseUrl("cl-change-password"),children:"Profile"})})]})})]})})},p=({children:l,title:i})=>{const{Auth:s}=t().props;r.useState();const[n,d]=r.useState(!1),c=()=>{d(!n)};return n?document.body.classList.add("drawer-toggled"):document.body.classList.remove("drawer-toggled"),e.jsx(e.Fragment,{children:e.jsxs("div",{className:"nav-fixed bg-light bar",children:[e.jsx(o,{title:i}),e.jsx("nav",{className:"top-app-bar navbar navbar-expand bg-info navbar-dark",children:e.jsxs("div",{className:"container-fluid px-4",children:[e.jsx("button",{onClick:c,className:`btn btn-lg btn-icon order-1 order-lg-0
                  mdc-ripple-upgraded`,id:"drawerToggle",children:e.jsx("i",{className:"material-icons",children:"menu"})}),e.jsx(a,{className:"navbar-brand me-auto",to:"/",children:e.jsx("div",{className:"font-monospace",style:{fontWeight:"bold",fontSize:"20px"},children:"CrediSafe"})}),e.jsxs("div",{className:"d-flex align-items-center mx-3 me-lg-0",children:[e.jsx("ul",{className:"navbar-nav d-none d-lg-flex",children:e.jsx("li",{className:"nav-item",children:e.jsx(a,{className:"nav-link",href:"#",children:s!=null&&s.company.company_name?s.company.company_name:""})})}),e.jsx("div",{className:"d-flex",children:e.jsxs("div",{className:"dropdown",children:[e.jsx("button",{className:`btn btn-lg btn-icon dropdown-toggle
                              mdc-ripple-upgraded`,id:"dropdownMenuProfile",type:"button","data-bs-toggle":"dropdown","aria-expanded":"false",children:e.jsx("i",{className:"material-icons",children:"person"})}),e.jsxs("ul",{className:"dropdown-menu dropdown-menu-end mt-3","aria-labelledby":"dropdownMenuProfile",children:[e.jsx("li",{children:e.jsxs("a",{className:"dropdown-item mdc-ripple-upgraded",href:"/client-profile",children:[e.jsx("i",{className:"material-icons leading-icon",children:"person"}),e.jsx("div",{className:"me-3",children:"Profile"})]})}),e.jsx("li",{children:e.jsxs("a",{className:"dropdown-item mdc-ripple-upgraded",href:"/update-password",children:[e.jsx("i",{className:"material-icons leading-icon",children:"settings"}),e.jsx("div",{className:"me-3",children:"Settings"})]})}),e.jsx("li",{children:e.jsxs("a",{className:"dropdown-item mdc-ripple-upgraded",href:"#!",children:[e.jsx("i",{className:"material-icons leading-icon",children:"help"}),e.jsx("div",{className:"me-3",children:"Help"})]})}),e.jsx("li",{children:e.jsx("hr",{className:"dropdown-divider"})}),e.jsx("li",{children:e.jsxs("a",{className:"dropdown-item mdc-ripple-upgraded",href:reverseUrl("logout"),children:[e.jsx("i",{className:"material-icons leading-icon",children:"logout"}),e.jsx("div",{className:"me-3",children:"Logout"})]})})]})]})})]})]})}),e.jsxs("div",{id:"layoutDrawer",children:[e.jsx(m,{}),e.jsxs("div",{id:"layoutDrawer_content",children:[l,e.jsx("footer",{id:"footer",className:"py-4 border-top",style:{minHeight:"74px"},children:e.jsx("div",{className:"container-xl px-5",children:e.jsxs("div",{className:`d-flex flex-column flex-sm-row
                          align-items-center justify-content-sm-between
                          small`,children:[e.jsx("div",{className:"me-sm-2",children:"Copyright © Credit Safe 2023"}),e.jsxs("div",{className:"d-flex ms-sm-2",children:[e.jsx("a",{className:"text-decoration-none",href:"#!",children:"Privacy Policy"}),e.jsx("div",{className:"mx-1",children:"·"}),e.jsx("a",{className:"text-decoration-none",href:"#!"})]})]})})})]})]})]})})};export{p as L};
