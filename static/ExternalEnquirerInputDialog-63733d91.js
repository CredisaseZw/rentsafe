import{j as e,r as a,b as S,_ as B}from"./media/main-bfba9c40.js";import{M as n}from"./Modal-07685045.js";import{B as x}from"./Button-bf257970.js";const D=({show:o,handleClose:t,setShowEnquirerInputDialog:d,handleShowReport:c})=>e.jsx("div",{className:"container-xl p-5",children:e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs(n,{show:o,onHide:t,size:"md",backdrop:"static",centered:!0,children:[e.jsx(n.Header,{closeButton:!0,className:"h4 text-center",children:e.jsx(n.Title,{className:"h6",children:"Please choose the type of enquiry."})}),e.jsxs(n.Footer,{className:"p-4 d-flex justify-content-between gap-4",children:[e.jsx(x,{variant:"info",className:"text-white",onClick:()=>{t(),c("internal")},children:"Internal"}),e.jsx(x,{variant:"secondary",onClick:()=>{d(!0),t()},children:"External"})]})]})})})}),z=D,F=({show:o,handleClose:t,handleShowReport:d})=>{const[c,m]=a.useState(!1),[r,h]=a.useState(""),[p,j]=a.useState([]),[N,g]=a.useState({}),[f,v]=a.useState(""),[q,E]=a.useState(""),[w,y]=a.useState(!1),[i,u]=a.useState({}),[b,C]=a.useState(null);a.useEffect(()=>{const s=setTimeout(()=>{r.length>0&&N?.individual_name!==r&&(m(!0),S.post(reverseUrl("client_company_users"),{userName:r}).then(l=>{l.data.status==="failed"?j([]):(y(!0),j(l.data)),m(!1)}).catch(l=>{B.error("Error fetching enquirer details"),m(!1)}))},300);return r.length>0&&r!==""&&(clearTimeout(b),C(s)),()=>clearTimeout(b)},[r]);const _=()=>{if(r===""){u({enquirer:"Please enter a name"});return}if(f===""){u({enquirerCompany:"Please enter a company name"});return}u({}),t(),d("external",N?.individual_id)};return e.jsx(n,{size:"md",show:o,onHide:t,centered:!0,children:e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx(n.Header,{className:"card-header bg-info px-4",closeButton:!0,children:e.jsxs("div",{className:`d-flex justify-content-between
                                align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:"External Enquirer Details"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"card",children:e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsx(n.Body,{children:e.jsxs("div",{className:"row mb-4",children:[e.jsx("div",{className:"row",children:e.jsxs("div",{className:"col-12 position-relative",children:[e.jsx("label",{className:"form-label",children:"Enquirer:"}),e.jsx("input",{value:r,onChange:s=>h(s.target.value),type:"text",name:"enquirer",id:"enquirer",placeholder:"Enquirer Name",className:"form-control form-control-sm"}),p?.length>0&&w&&e.jsx("div",{className:"bg-info",style:{borderRadius:"5px",padding:"5px",color:"white",fontSize:"16px",width:"100%",position:"absolute",top:"100%",zIndex:"1000",height:"200px",overflowY:"scroll"},children:c?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):e.jsx("ul",{className:"list-style-none",children:p.map((s,l)=>e.jsxs("li",{onClick:()=>{g(s),h(s.individual_name),v(s.company_name),y(!1)},className:"cursor-pointer text-white px-2 py-1 hover:bg-secondary",children:[s.individual_name," - ",s.company_name]},l))})}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.enquirer})]})}),e.jsx("div",{className:"row",children:e.jsxs("div",{className:"col-12",children:[e.jsx("label",{className:"form-label",children:"Enquirer Company:"}),e.jsx("input",{value:f,onChange:s=>v(s.target.value),type:"text",name:"enquirer_company}",id:"enquirer_company}",placeholder:"Enquirer Company",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.enquirerCompany})]})}),e.jsx("div",{className:"row",children:e.jsxs("div",{className:"col-12",children:[e.jsx("label",{className:"form-label",children:"Company Branch:"}),e.jsx("input",{value:q,onChange:s=>E(s.target.value),type:"text",name:"company_branch",id:"company_branch",placeholder:"Company Branch",className:"form-control form-control-sm"}),i&&e.jsx("div",{className:"text-danger mt-1",children:i.companyBranch})]})})]})}),e.jsx(n.Footer,{children:e.jsx(x,{className:"text-white",variant:"info",onClick:_,disabled:c,children:"Submit"})})]})})})]})})})};export{z as C,F as E};
