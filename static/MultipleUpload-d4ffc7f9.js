var x=(a,s,r)=>new Promise((c,i)=>{var n=l=>{try{t(r.next(l))}catch(o){i(o)}},d=l=>{try{t(r.throw(l))}catch(o){i(o)}},t=l=>l.done?c(l.value):Promise.resolve(l.value).then(n,d);t((r=r.apply(a,s)).next())});import{r as h,a as b,j as e,b as w}from"./main-cecc6bb7.js";import{I as g,_ as m}from"./index-43a92dce.js";import{M as v}from"./Modal-f4f0c70d.js";const M=({type:a,actionType:s})=>{const[r,c]=h.useState(!1),[i,n]=h.useState(""),{data:d,setData:t,post:l,reset:o,progress:N}=b({csv_file:null}),f=()=>x(void 0,null,function*(){i!==""?(window.open(`/download_template/${i}`,"_blank"),n("")):a==="individual"?s==="user"?window.open("/download_template/individual_template.csv","_blank"):s==="lease"&&window.open("/download_template/individual_lease_template.csv","_blank"):a==="company"&&(s==="user"?window.open("/download_template/company_template.csv","_blank"):s==="lease"&&window.open("/download_template/company_lease_template.csv","_blank"))}),_=u=>x(void 0,null,function*(){if(u.preventDefault(),d.csv_file===null){m.error("Please select a file to upload");return}const j=a==="individual"&&s==="user"?"create_bulk_individuals":a==="company"&&s==="user"?"create_bulk_companies":a==="company"&&s==="lease"?"create_company_bulk_leases":"create_individual_bulk_leases";try{c(!0),n("");const p=yield w.post(reverseUrl(j),d,{headers:{"Content-Type":"multipart/form-data"}});p.data.status==="failed"?(o(),n(p.data.file_path),m.error("Some records failed to be created. Download the returned file and try again")):m.success("All records created successfully"),c(!1)}catch(p){m.error("An error occurred. Please try again")}});return e.jsxs("div",{children:[e.jsx(g,{position:"top-right"}),e.jsxs("div",{className:"card card-raised",children:[e.jsx("div",{className:"card-header bg-info",children:e.jsxs("div",{className:`d-flex justify-content-between
                align-items-center`,children:[e.jsxs("div",{className:"me-4",children:[e.jsx("h2",{className:"display-6 mb-0 text-white",children:a==="individual"&&s==="user"?"Multiple Individuals Uploader":a==="company"&&s==="user"?"Multiple Companies Uploader":a==="company"&&s==="lease"?"Multiple Company Lease Uploader":"Multiple Individual Lease Uploader"}),e.jsx("div",{className:"card-text"})]}),e.jsx("div",{className:"d-flex gap-2"})]})}),e.jsx("div",{className:"card-body p-4",children:e.jsx("form",{onSubmit:_,children:e.jsxs("div",{className:"card",children:[e.jsxs("div",{className:"card-body p-4",style:{border:"1px dashed #999",borderColor:"#26a69a",backgroundColor:"rgb(239, 239, 239)"},onClick:()=>document.getElementById("csv_file").click(),children:[e.jsx(v.Body,{children:e.jsx("div",{className:"row mb-4",children:e.jsx("div",{className:"col-md-12",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"material-icons",style:{color:"#26a69a",fontSize:"48px"},children:"cloud_upload"}),e.jsx("div",{children:d.csv_file?d.csv_file.name:"Drag and drop files here, or browse your computer."}),e.jsx("input",{className:"form-control d-none",id:"csv_file",type:"file",accept:"text/csv",onChange:u=>t("csv_file",u.target.files[0])})]})})})}),e.jsx(v.Footer,{})]}),e.jsxs("div",{className:"card-footer d-flex flex-row align-items-center justify-content-between",children:[i===""?e.jsxs("p",{children:["Use the template provided"," ",e.jsx("a",{onClick:f,style:{cursor:"pointer"},className:"text-info text-decoration-underline ",children:"here"})]}):e.jsxs("p",{className:"text-danger",children:["Download the error file"," ",e.jsx("a",{onClick:f,style:{cursor:"pointer"},className:"text-info text-decoration-underline ",children:"here"})]}),e.jsx("button",{className:"btn btn-raised-info text-white btn-sm",type:"submit",disabled:r,children:r?e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"spinner-grow spinner-grow-sm"}),e.jsx("span",{className:"ml-2",children:"Uploading..."})]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"leading-icon material-icons",children:"upload"}),"Submit"]})})]})]})})})]})]})};export{M};
