import{r as u,a as re,j as e,_ as $,b as B,u as M,d as ie}from"./main-8b5daa16.js";import{I as ce,c as le,R as de,L as me}from"./Layout-1500afa4.js";import{M as L}from"./Modal-e9148396.js";import{B as z}from"./Button-480bf2fa.js";import{B as ue,D as he}from"./DrawerContent-018182e6.js";import{P as pe}from"./PaginationControls-3f8309c7.js";import{S as xe}from"./SearchBar-cc840f4a.js";import{A as fe,D as ge,C as ye,a as je,F as be,P as we}from"./Payments-45fada1b.js";import{l as K}from"./lodash-a1556254.js";import{m as J,u as U}from"./index-fedd7536.js";import{f as W}from"./formatting-9de8c923.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-e2b727fe.js";import"./MultipleUpload-b8fc9f1f.js";import"./search-1d0357fd.js";import"./index-66c3a614.js";import"./index-aaac8bfd.js";import"./Button-ac2c9b38.js";import"./html2pdf-433b7917.js";const _e=({show:o,handleClose:y,leaseData:p})=>{const[c,l]=u.useState(!1),{data:i,post:b}=re({leaseId:p.lease_id}),m=()=>{b(reverseUrl("delete_lease"),{onStart:()=>{l(!0)},onSuccess:x=>{$.success(JSON.stringify("Lease terminated successfully")),l(!1)},onError:x=>{$.error("Something went wrong! Please try again"),l(!1)},onFinish:()=>{y()}})};return e.jsxs(L,{show:o,onHide:y,size:"md",backdrop:"static",centered:!0,children:[e.jsx(L.Header,{closeButton:!0,className:"h4 bg-info text-white text-center text-uppercase",children:"Confirm Lease Termination"}),e.jsx(L.Body,{className:"p-4 d-flex justify-content-between align-items-center gap-4",children:e.jsxs("p",{className:"my-3 text-center",children:["Are you sure you want to terninate lease for ",p.name,"? This action cannot be undone."]})}),e.jsxs(L.Footer,{className:"p-4 d-flex justify-content-end gap-4",children:[e.jsxs(z,{onClick:y,variant:"secondary",children:[e.jsx("i",{className:"material-icons",children:"cancel"}),"Cancel"]}),e.jsxs(z,{onClick:m,variant:"danger",children:[e.jsx("i",{className:"material-icons",children:"done"}),"Delete"]})]})]})},Ne=_e;function ve({clientViewProps:{showModal:o,hideClientView:y,data:p,error:c,isLoading:l,clientId:i,refreshClientViewData:b,lease:m}}){const x=!p;return e.jsx(e.Fragment,{children:e.jsxs(L,{show:o,onHide:y,fullscreen:!0,contentClassName:"custom-bg-whitesmoke",children:[e.jsx(L.Header,{className:"p-0",children:e.jsxs("div",{className:"w-100 p-2 text-center bg-info position-relative",children:[e.jsx("h4",{className:"text-white",children:l||c||x?"Client View":p.tenantName}),e.jsx("button",{type:"button",onClick:y,className:"btn position-absolute top-0 end-0 h-100 d-flex align-items-center text-white",children:e.jsx("i",{className:"material-icons fs-3 px-4",children:"close"})})]})}),e.jsx(L.Body,{children:e.jsxs("div",{className:"position-relative custom-mn-h-5",children:[l&&e.jsxs("div",{className:"text-center position-absolute top-50 start-50 translate-middle",children:[e.jsx("div",{className:"spinner-border text-info spinner-border-md",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})}),e.jsx("p",{children:"Loading...please wait"})]}),c&&e.jsxs("div",{className:"text-center text-danger position-absolute top-50 start-50 translate-middle",children:[e.jsx("p",{children:e.jsx("i",{className:"material-icons fs-1",children:"warning"})}),e.jsxs("p",{children:["Error: ",K.truncate(c,{length:500})]})]}),!(l||c||x)&&e.jsx(e.Fragment,{children:e.jsxs("div",{className:"row row-cols-3 align-items-stretch",children:[e.jsxs("div",{className:"col p-1",children:[e.jsx(fe,{data:p.agedAnalysis}),e.jsx(ge,{data:p.debtorIntelligence,clientId:i}),e.jsx(ye,{data:p.contactDetails,clientId:i,leaseId:m.lease_id})]}),e.jsx("div",{className:"col p-1",children:e.jsx(je,{messages:p.communicationHistory,clientId:i,lease:m,refresh:b})}),e.jsxs("div",{className:"col p-1",children:[e.jsx(be,{data:p.forecastInflows}),e.jsx(we,{clientId:i,paymentPlans:p.paymentPlans,refreshClientViewData:b,leaseId:m.lease_id,currency:m.currency})]})]})})]})})]})})}function Ce(){const[o,y]=u.useState(!1),[p,c]=u.useState(null),[l,i]=u.useState(""),[b,m]=u.useState(!1),[x,_]=u.useState(null);function k(s,j){if(_(s),y(!0),m(!0),i(""),j){i(j),c(null),m(!1);return}B(reverseUrl("client_details"),{params:{lease_id:s.lease_id}}).then(a=>{const N={tenantName:s.name,agedAnalysis:{oneTwentyDays:a.data.aged_analysis["120_days_plus"],ninetyDays:a.data.aged_analysis["90_days"],sixtyDays:a.data.aged_analysis["60_days"],thirtyDays:a.data.aged_analysis["30_days"],current:a.data.aged_analysis.current},contactDetails:{contactPerson:`${a.data.client.firstname} ${a.data.client.surname}`,smsNumber:a.data.client.sms_number,otherNumbers:a.data.client.other_numbers?a.data.client.other_numbers.join(", "):"",emailAddress:a.data.client.email,address:a.data.client.address},paymentPlans:a.data.payment_plans.map(f=>({id:f.id,person:f.spoke_with,date:f.expected_pay_date,amount:f.amount})),communicationHistory:a.data.communication_history.map(f=>({text:f.message,timestamp:f.created_at,user:f.user_name,actionDone:f.action_done?f.action_done:null,communicationType:f.type,data:null})),debtorIntelligence:Object.values(a.data.debtor_intelligence).length&&Object.values(a.data.debtor_intelligence).every(Boolean)?{text:a.data.debtor_intelligence.note,timestamp:a.data.debtor_intelligence.updated_at,user:a.data.debtor_intelligence.user_name}:null,forecastInflows:{zeroToSevenDays:a.data.forecast_inflows["0-7"],eightToFourteenDays:a.data.forecast_inflows["8-14"],fourteenToTwentyOneDays:a.data.forecast_inflows["14-21"],twentyOnePlusDays:a.data.forecast_inflows["21+"],total:a.data.forecast_inflows.total}};N.communicationHistory=N.communicationHistory.concat(J({works:a.data.works_data||[],maintenance:a.data.maintenance_data||[]})),console.log({res:a,resData:N,lease:s}),c(N),i(""),m(!1)}).catch(a=>{i(U(a)),c(null),m(!1)})}function v(){console.log("refreshing.."),m(!0),i(""),B(reverseUrl("client_details"),{params:{lease_id:x.lease_id}}).then(s=>{const j={tenantName:x.name,agedAnalysis:{oneTwentyDays:s.data.aged_analysis["120_days_plus"],ninetyDays:s.data.aged_analysis["90_days"],sixtyDays:s.data.aged_analysis["60_days"],thirtyDays:s.data.aged_analysis["30_days"],current:s.data.aged_analysis.current},contactDetails:{contactPerson:`${s.data.client.firstname} ${s.data.client.surname}`,smsNumber:s.data.client.sms_number,otherNumbers:s.data.client.other_numbers?s.data.client.other_numbers.join(", "):"",emailAddress:s.data.client.email,address:s.data.client.address},paymentPlans:s.data.payment_plans.map(a=>({id:a.id,person:a.spoke_with,date:a.expected_pay_date,amount:a.amount})),communicationHistory:s.data.communication_history.map(a=>({text:a.message,timestamp:a.created_at,user:a.user_name,actionDone:a.action_done?a.action_done:null,communicationType:a.type,data:null})),debtorIntelligence:Object.values(s.data.debtor_intelligence).length&&Object.values(s.data.debtor_intelligence).every(Boolean)?{text:s.data.debtor_intelligence.note,timestamp:s.data.debtor_intelligence.updated_at,user:s.data.debtor_intelligence.user_name}:null,forecastInflows:{zeroToSevenDays:s.data.forecast_inflows["0-7"],eightToFourteenDays:s.data.forecast_inflows["8-14"],fourteenToTwentyOneDays:s.data.forecast_inflows["14-21"],twentyOnePlusDays:s.data.forecast_inflows["21+"],total:s.data.forecast_inflows.total}};j.communicationHistory=j.communicationHistory.concat(J({works:s.data.works_data||[],maintenance:s.data.maintenance_data||[]})),console.log({res:s,resData:j,lease:x}),c(j),i(""),m(!1)}).catch(s=>{i(U(s)),c(null),m(!1)})}function D(){y(!1)}return{showModal:o,openClientView:k,hideClientView:D,data:p,error:l,isLoading:b,clientId:x?x.id:null,refreshClientViewData:v,lease:x}}function Le(o){const{props:{error:y},url:p}=M();let c=new URL(p).searchParams.get("color");const[l,i]=u.useState({}),[b,m]=u.useState([]),[x,_]=u.useState(!1),[k,v]=u.useState(!1),[D,s]=u.useState(0),[j,a]=u.useState(!1),[N,f]=u.useState(c?"rent-owing-des":"default"),I=Ce(),[A,T]=u.useState(!1),[O,E]=u.useState(!1),F=new URL(M().url).searchParams.get("open_view_for");u.useEffect(()=>{if(!F)return;const t=o.find(n=>n.lease_id==F);t?I.openClientView(t):I.openClientView(t,`Lease with ID '${F}' is not included in your current leases.`)},[F]),u.useEffect(()=>{B.post(reverseUrl("open_subscription")).then(t=>{m(t.data)}).catch(t=>{})},[m,j]);const P=document.getElementById("hide-footer");switch(u.useEffect(()=>(P!==null&&document.getElementById("footer").classList.add("d-none"),()=>{P!==null&&document.getElementById("footer").classList.remove("d-none")}),[P]),c){case"orange":c="warning";break;case"black":c="black";break;case"red":c="red";break;case"green":c="success";break;case"#991b1b":c="danger";break}y&&$.error(U(y));function R(t){f(t.target.value)}let w=t=>t;function V(t){console.log(t),B.post(reverseUrl("write-off"),{lease_id:t.lease_id}).then(n=>{console.log(n),ie.Inertia.reload()}).catch(n=>{var d,S;console.log(n);const h=(S=(d=n==null?void 0:n.response)==null?void 0:d.data)!=null&&S.errors?JSON.stringify(n.response.data.errors):JSON.stringify(n);$.error(`An error occured:
`+K.truncate(h,{length:200}))})}switch(N){case"rent-owing-asc":w=t=>{const n=[...t];return n.sort((h,d)=>h.owing_amount-d.owing_amount),n};break;case"rent-owing-des":w=t=>{const n=[...t];return n.sort((h,d)=>d.owing_amount-h.owing_amount),n};break;case"color-asc":w=t=>{const n={};t.forEach(d=>{d.color in n?n[d.color].push(d):n[d.color]=[d]});let h=[];return Object.keys(n).forEach(d=>{h=h.concat(n[d].sort((S,H)=>S.owing_amount-H.owing_amount))}),h};break;case"color-des":w=t=>{const n={};t.forEach(d=>{d.color in n?n[d.color].push(d):n[d.color]=[d]});let h=[];return Object.keys(n).forEach(d=>{h=h.concat(n[d].sort((S,H)=>H.owing_amount-S.owing_amount))}),h};break;default:w=t=>t;break}const[g,r]=u.useState({});u.useEffect(()=>{B.get(reverseUrl("rate_setup")).then(t=>{var h;const n=(h=t==null?void 0:t.data)==null?void 0:h.currency_settings;if(!n)throw new Error("failed to fetch currency settings");r(n)}).catch(t=>{console.log(t)})},[]);const C=Object.keys(g).length===0,q=C?"":`${g==null?void 0:g.base_currency.toUpperCase()} ${W(o?o.reduce((t,n)=>{let h=n.owing_amount;return n.currency.trim().toLowerCase()!==(g==null?void 0:g.base_currency.trim().toLowerCase())&&(h=n.owing_amount/(g==null?void 0:g.current_rate)),t+h},0):0).replace("$","")}`,G=!C&&o&&o.find(t=>t.currency.trim().toLowerCase()!=="usd")?`${g.base_currency.toUpperCase()} 1 = ${g.currency.toUpperCase()} ${g.current_rate}`:"",Q=o!=null&&o.length?o.reduce((t,n)=>n.terminated?t:t+=1,0):0;function X(t){i(t),v(!0)}function Y(){v(!1),i({})}function Z(t){i(t),_(!0)}function ee(){_(!1),i({})}function te(t){i(t),T(!0)}function ae(){i({}),T(!1)}function ne(t){i(t),E(!0)}function se(){i({}),E(!1)}function oe(t,n={isCompany:!1}){t.is_company||n.isCompany?ne(t):te(t)}return{sort:N,details:l,rateText:G,isVisible:j,subLength:D,terminate:x,totalColor:c,showReceipt:k,subscriptions:b,clientViewProps:I,activeLeaseCount:Q,showCompanyLeaseForm:O,showIndividualLeaseForm:A,smartNavigationTotalFormated:q,writeOff:V,sortFunc:w,changeSort:R,setSubLength:s,setIsVisible:a,closeReceipt:Y,openReciptFor:X,terminateLease:Z,closeTerminate:ee,showLeaseFormFor:oe,closeCompanyLeaseForm:se,closeIndividualLeaseForm:ae}}function ke({leases:o,total_pages:y,current_page:p}){const{sort:c,details:l,rateText:i,isVisible:b,subLength:m,terminate:x,totalColor:_,showReceipt:k,subscriptions:v,clientViewProps:D,activeLeaseCount:s,showCompanyLeaseForm:j,showIndividualLeaseForm:a,smartNavigationTotalFormated:N,writeOff:f,sortFunc:I,changeSort:A,setSubLength:T,setIsVisible:O,closeReceipt:E,openReciptFor:F,terminateLease:P,closeTerminate:R,showLeaseFormFor:w,closeCompanyLeaseForm:V,closeIndividualLeaseForm:g}=Le(o);return e.jsxs(e.Fragment,{children:[e.jsxs(e.Fragment,{children:[e.jsx(ve,{clientViewProps:D}),a&&e.jsx(ce,{action:Object.keys(l).length?"edit":"add",show:a,handleClose:g,lesseeDetails:l,subscriptionPeriod:Object.keys(l).length?l.lease_period:m}),j&&e.jsx(le,{action:Object.keys(l).length?"edit":"add",show:j,handleClose:V,lesseeDetails:l,subscriptionPeriod:Object.keys(l).length?l.lease_period:m}),x&&e.jsx(Ne,{show:x,handleClose:R,leaseData:l}),k&&e.jsx(de,{show:k,handleClose:E,leaseDetails:l,myKey:"leases"})]}),e.jsxs("main",{id:"hide-footer",children:[e.jsxs("div",{className:"container-xl p-0 mb-5",children:[e.jsx("h5",{className:"bg-info text-center text-white p-2 rounded-2",children:"Lease Management"}),e.jsxs("div",{className:"position-relative bg-white rounded-2 border",children:[e.jsxs("table",{className:"table table-sm table-responsive table-bordered ",children:[e.jsxs("thead",{className:"position-sticky bg-white shadow-sm c-table-top",children:[e.jsx("tr",{children:e.jsxs("td",{colSpan:7,children:[e.jsxs("div",{className:"row justify-content-between align-items-center my-1",children:[e.jsx("div",{className:"col-5",children:e.jsx(xe,{searchBy:"name"})}),e.jsx("div",{className:"col-auto",children:e.jsxs("div",{className:"d-flex border c-bg-light align-items-center",children:[e.jsx("label",{htmlFor:"sort",className:"form-label bg-white c-bg-light d-block my-0 text-nowrap p-1",children:"Sort By:"}),e.jsxs("select",{className:"form-select c-select rounded-0 border",name:"sort",id:"sort",value:c,onChange:A,children:[e.jsx("option",{value:"default",children:"default"}),e.jsx("option",{value:"rent-owing-asc",children:"Rent Owing asc"}),e.jsx("option",{value:"rent-owing-des",children:"Rent Owing des"}),e.jsx("option",{value:"color-asc",children:"color (rent asc)"}),e.jsx("option",{value:"color-des",children:"color (rent des)"})]})]})})]}),e.jsxs("h5",{className:"text-center py-2 mb-0 text-white border bg-info",children:["Active Leases - ",s]})]})}),e.jsxs("tr",{className:"c-force-borders",children:[e.jsx("th",{className:"ps-3",children:e.jsx("div",{children:"Lease ID"})}),e.jsx("th",{children:e.jsx("div",{children:"Tenant"})}),e.jsx("th",{children:e.jsx("div",{children:"Customer Number"})}),e.jsx("th",{className:"text-end",children:e.jsx("div",{children:"Rent Owing"})}),e.jsx("th",{className:"text-center",colSpan:3,children:e.jsx("div",{children:"Actions"})})]})]}),e.jsx("tbody",{children:o?I(o).map((r,C)=>e.jsxs("tr",{className:r.terminated?"c-terminated":"",children:[e.jsx("th",{className:"ps-3",children:r.lease_id||""}),e.jsx("td",{children:e.jsx("button",{title:"double click to view client",type:"button",onDoubleClick:()=>D.openClientView(r),className:`custom-btn text-decoration-underline ${r.terminated?"c-terminated":""}`,children:r.name})}),e.jsx("td",{children:r.customer_number}),e.jsx("td",{className:`bg-${r.color} text-white text-end`,style:{backgroundColor:r.color=="light-red"?"#f87171":""},children:`${r.currency} ${W(r.owing_amount).replace("$","")}`}),e.jsx("td",{className:"bg-info text-white text-center c-pointer",onClick:()=>F(r),children:"Receipt"}),r.terminated?e.jsxs(e.Fragment,{children:[e.jsx("td",{className:"c-terminated text-center",children:"Terminated"}),e.jsx("td",{className:"bg-danger text-white text-center c-pointer",onClick:()=>f(r),children:"Write off"})]}):e.jsxs(e.Fragment,{children:[e.jsx("td",{className:"bg-primary text-white text-center c-pointer",onClick:()=>w(r),children:"Adjust"}),e.jsx("td",{className:"bg-danger text-white text-center c-pointer",onClick:()=>P(r),children:"Terminate"})]})]},r.lease_id+"-"+C)):""}),_&&(o!=null&&o.length)?e.jsx("tfoot",{children:e.jsxs("tr",{children:[e.jsx("td",{className:"border-0 pt-5"}),e.jsxs("td",{className:"border-0 pt-5",children:["Total Debtors: ",o==null?void 0:o.length]}),e.jsx("td",{className:"border-0 pt-5",children:"Total mount"}),e.jsxs("td",{className:"border-0 pt-5 px-0",children:[e.jsx("span",{className:`bg-${_} text-end text-white p-2 w-100 d-inline-block`,style:{backgroundColor:_=="light-red"?"#f87171":_},children:N}),i?e.jsx("small",{className:"d-block text-end p-1 text-muted c-fs-smallest",children:i}):""]}),e.jsx("td",{className:"border-0 pt-5"})]})}):""]}),e.jsx(pe,{currentPage:p,totalPages:y})]})]}),e.jsx("div",{className:"position-fixed w-100 bottom-0 start-0",children:e.jsx(ue,{isVisible:b,setIsVisible:O,trigger:e.jsxs("button",{type:"button",className:"btn btn-lg c-bg-warning-light w-100 justify-content-center align-items-center text-capitalize gap-2 ",children:["Available Subscriptions",e.jsx("i",{className:"material-icons fs-3",children:"keyboard_arrow_up"})]}),children:e.jsx(he,{title:"Available Subscriptions",children:e.jsxs("table",{className:"table table-responsive table-bordered",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"No"}),e.jsx("th",{children:"Open Slots"}),e.jsx("th",{children:"Period (months)"}),e.jsx("th",{children:"Start Date"}),e.jsx("th",{children:"End Date"}),e.jsx("th",{})]})}),e.jsx("tbody",{children:v==null?void 0:v.filter(r=>r.open_slots>0).map((r,C)=>e.jsxs("tr",{children:[e.jsx("th",{children:C+1}),e.jsx("td",{children:r.open_slots}),e.jsx("td",{children:r.period_length}),e.jsx("td",{children:r.start_date}),e.jsx("td",{children:r.end_date}),e.jsx("td",{className:"bg-success text-white text-center c-pointer",onClick:()=>{w({},{isCompany:!1}),O(!1),T(r.period_left)},children:"Activate Individual"}),e.jsx("td",{className:"bg-info text-white text-center c-pointer",onClick:()=>{w({},{isCompany:!0}),O(!1),T(r.period_left)},children:"Activate Company"})]},C))})]})})})})]})]})}ke.layout=o=>e.jsx(me,{children:o,title:"Leases"});export{ke as default};
