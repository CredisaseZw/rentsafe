import{r as a,j as e}from"./media/main-9b13349a.js";import{c as o}from"./Layout-4dbbc259.js";function c(){const[s,t]=a.useState("INDIVIDUAL");return e.jsxs("div",{className:"d-flex",children:[e.jsxs("select",{className:"me-1 px-1 border fw-light rounded-2",value:s,name:"customer_type",id:"customer_type",onChange:r=>t(r.target.value),children:[e.jsx("option",{value:"INDIVIDUAL",children:"Individual"}),e.jsx("option",{value:"COMPANY",children:"Company"})]}),e.jsx("div",{className:"custom-w-3",children:e.jsx(o,{extraProps:{placeholder:"Customer Name...",required:!0,id:"customer_id",name:"customer_id",className:"w-100"},defaultValue:null,isDisabled:s==="",useAlternateFetchOptions:{type:s.toLowerCase()}},s)})]})}export{c as U};
