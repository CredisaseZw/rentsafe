import{u as l,j as e}from"./main-7e7be1ff.js";import{_ as c}from"./index-1a0fe2fd.js";import{P as a}from"./PageHeader-f6dfafc4.js";import{f as i}from"./formatting-345d2430.js";import{B as n,D as h}from"./DrawerContent-e8ace8f4.js";import"./index-103b5ba2.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-9c6784ba.js";const N=()=>{const t=l().props.leases,o=l().props.subscriptions,d=l().props.error;return d&&c.error(d),e.jsxs("main",{className:"mb-5 position-relative ",style:{minHeight:"100vh"},children:[e.jsx(a,{title:"Leases"}),e.jsx("div",{className:"container-xl p-5",children:e.jsxs("div",{className:"card card-raised mb-5",children:[e.jsx("div",{className:"card-header px-4",style:{height:"50px",backgroundColor:"#32a4a8"},children:e.jsx("div",{className:"d-flex justify-content-center align-items-center",children:e.jsx("div",{className:"",children:e.jsx("h2",{className:"display-6 tf-color",children:"Lease Management"})})})}),e.jsxs("div",{className:"card-body p-4  position-relative",style:{overflowX:"hidden"},children:[e.jsx("div",{className:"",style:{backgroundColor:"#428f38"},children:e.jsx("h5",{className:"text-center tf-color",children:"Active Lease"})}),e.jsxs("div",{style:{maxHeight:"550px",width:"100%",overflowY:"auto",marginTop:"45px"},className:"table-responsive",children:[e.jsx("table",{className:"table table-responsive position-absolute ",style:{top:"47px"},children:e.jsx("thead",{children:e.jsxs("tr",{style:{borderTop:"0px"},children:[e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"No."}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Tenant"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Address"}),e.jsx("th",{scope:"col",className:"text-center",children:"Rent Owing"})]})})}),e.jsx("table",{className:"table table-bordered table-responsive ",children:e.jsx("tbody",{style:{maxHeight:"500px",overflowY:"auto"},children:t==null?void 0:t.map((s,r)=>e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:r+1}),e.jsx("td",{children:s.name}),e.jsx("td",{children:s.address}),e.jsxs("td",{className:`bg-${s.color} text-white text-end`,children:[s.currency,i(s.monthly_rentals)]})]},"lease"+r))})})]})]})]})}),e.jsx("div",{className:"w-100",style:{backgroundColor:"#e3d329",position:"absolute",bottom:"80px",right:"0",width:"100%"},children:e.jsx(n,{trigger:e.jsx("div",{style:{backgroundColor:"#e3d329"},children:e.jsx("h5",{className:"text-center tf-color py-2",children:"Open Subscriptions"})}),children:e.jsx(h,{title:"Open Subscriptions",children:e.jsx("div",{className:"table-responsive",children:e.jsxs("table",{className:"table table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{style:{borderTop:"0px"},children:[e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"No."}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Type"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Open Slots"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Period (months)"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"Start Date"}),e.jsx("th",{scope:"col",style:{borderTop:"1px solid #e0e0e0"},children:"End Date"}),e.jsx("th",{scope:"col",colSpan:"2",className:"tf-borderRight"})]})}),e.jsx("tbody",{children:o==null?void 0:o.map((s,r)=>e.jsx(e.Fragment,{children:s.open_slots>0&&e.jsxs("tr",{children:[e.jsx("th",{scope:"row",children:r+1}),e.jsx("td",{children:s.subscription_class}),e.jsx("td",{children:s.open_slots}),e.jsx("td",{children:s.period_length}),e.jsx("td",{children:s.start_date}),e.jsx("td",{children:s.end_date}),e.jsx("td",{colSpan:"2",className:`${s.open_slots===0?"bg-gray":"bg-success"} text-white text-center tfRow`,children:"Activate"})]},"subscription"+r)}))})]})})})})})]})};export{N as default};
