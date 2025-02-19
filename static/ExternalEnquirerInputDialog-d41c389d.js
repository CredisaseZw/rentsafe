import{j as e,r as a,b as S}from"./main-a82401bd.js";import{M as n}from"./Modal-102aa7c8.js";import{B as p}from"./Button-2c89b25f.js";import{_ as B}from"./index-7649e46a.js";const T=({show:m,handleClose:t,setShowEnquirerInputDialog:x,handleShowReport:o})=>e.jsx("div",{className:"container-xl p-5",children:e.jsx("div",{className:"card card-raised",children:e.jsx("div",{className:"card-body p-4",children:e.jsxs(n,{show:m,onHide:t,size:"md",backdrop:"static",centered:!0,children:[e.jsx(n.Header,{closeButton:!0,className:"h4 text-center",children:e.jsx(n.Title,{className:"h6",children:"Please choose the type of enquiry."})}),e.jsxs(n.Footer,{className:"p-4 d-flex justify-content-between gap-4",children:[e.jsx(p,{variant:"info",className:"text-white",onClick:()=>{t(),o("internal")},children:"Internal"}),e.jsx(p,{variant:"secondary",onClick:()=>{x(!0),t()},children:"External"})]})]})})})}),I=T,D=({show:m,handleClose:t,handleShowReport:x})=>{const[o,u]=a.useState(!1),[r,j]=a.useState(""),[d,f]=a.useState([]),[i,g]=a.useState({}),[N,v]=a.useState(""),[E,w]=a.useState(""),[C,y]=a.useState(!1),[l,h]=a.useState({}),[b,q]=a.useState(null);a.useEffect(()=>{const s=setTimeout(()=>{r.length>0&&(i==null?void 0:i.individual_name)!==r&&(u(!0),S.post(reverseUrl("client_company_users"),{userName:r}).then(c=>{c.data.status==="failed"?f([]):(y(!0),f(c.data)),u(!1)}).catch(c=>{B.error("Error fetching enquirer details"),u(!1)}))},300);return r.length>0&&r!==""&&(clearTimeout(b),q(s)),()=>clearTimeout(b)},[r]);const _=()=>{if(r===""){h({enquirer:"Please enter a name"});return}if(N===""){h({enquirerCompany:"Please enter a company name"});return}h({}),t(),x("external",i==null?void 0:i.individual_id)};return e.jsx(n,{size:"md",show:m,onHide:t,centered:!0,children:e.jsx("div",{children:e.jsxs("div",{className:"card card-raised",children:[e.jsx(n.Header,{className:"card-header bg-info px-4",closeButton:!0,children:e.jsxs("div",{className:`d-flex justify-content-between
                                align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:"External Enquirer Details"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("div",{className:"card",children:e.jsxs("div",{className:"card-body p-4",style:{borderStyle:"solid",borderColor:"#26a69a"},children:[e.jsx(n.Body,{children:e.jsxs("div",{className:"row mb-4",children:[e.jsx("div",{className:"row",children:e.jsxs("div",{className:"col-12 position-relative",children:[e.jsx("label",{className:"form-label",children:"Enquirer:"}),e.jsx("input",{value:r,onChange:s=>j(s.target.value),type:"text",name:"enquirer",id:"enquirer",placeholder:"Enquirer Name",className:"form-control form-control-sm"}),(d==null?void 0:d.length)>0&&C&&e.jsx("div",{className:"bg-info",style:{borderRadius:"5px",padding:"5px",color:"white",fontSize:"16px",width:"100%",position:"absolute",top:"100%",zIndex:"1000",height:"200px",overflowY:"scroll"},children:o?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"processing.."})]}):e.jsx("ul",{className:"list-style-none",children:d.map((s,c)=>e.jsxs("li",{onClick:()=>{g(s),j(s.individual_name),v(s.company_name),y(!1)},className:"cursor-pointer text-white px-2 py-1 hover:bg-secondary",children:[s.individual_name," -"," ",s.company_name]},c))})}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.enquirer})]})}),e.jsx("div",{className:"row",children:e.jsxs("div",{className:"col-12",children:[e.jsx("label",{className:"form-label",children:"Enquirer Company:"}),e.jsx("input",{value:N,onChange:s=>v(s.target.value),type:"text",name:"enquirer_company}",id:"enquirer_company}",placeholder:"Enquirer Company",className:"form-control form-control-sm"}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.enquirerCompany})]})}),e.jsx("div",{className:"row",children:e.jsxs("div",{className:"col-12",children:[e.jsx("label",{className:"form-label",children:"Company Branch:"}),e.jsx("input",{value:E,onChange:s=>w(s.target.value),type:"text",name:"company_branch",id:"company_branch",placeholder:"Company Branch",className:"form-control form-control-sm"}),l&&e.jsx("div",{className:"text-danger mt-1",children:l.companyBranch})]})})]})}),e.jsx(n.Footer,{children:e.jsx(p,{className:"text-white",variant:"info",onClick:_,disabled:o,children:"Submit"})})]})})})]})})})};export{I as C,D as E};
