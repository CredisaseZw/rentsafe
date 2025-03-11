import{j as e,r as x,b as w,u as C,d as D}from"./main-605f1a65.js";import{S as V,P}from"./PaginationControls-695c10f8.js";import{L as S}from"./Layout-d8d0e5c9.js";import{f as y}from"./formatting-9de8c923.js";import{A as T,D as k,C as I,a as O,F as H,P as A}from"./Payments-b01c7836.js";import{l as B}from"./lodash-65d1f6eb.js";import{M as f}from"./Modal-fa119524.js";import{m as j,u as b}from"./index-5b34db9a.js";import"./Button-5d19e586.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-2f25b0a4.js";import"./MultipleUpload-3f80ff47.js";import"./search-7ba8f0d2.js";import"./index-c8db368f.js";import"./html2pdf-2236ebfb.js";import"./index-4b3e425d.js";function E({creditorViewProps:{showModal:d,hideCreditorView:u,data:l,error:c,isLoading:o,clientId:s,refreshCreditorViewData:i,lease:n,creditorName:r}}){const _=!l;return e.jsx(e.Fragment,{children:e.jsxs(f,{show:d,onHide:u,fullscreen:!0,contentClassName:"custom-bg-whitesmoke",children:[e.jsx(f.Header,{className:"p-0",children:e.jsxs("div",{className:"w-100 p-2 text-center bg-secondary position-relative",children:[e.jsx("h4",{className:"text-white",children:o||c||_?"Creditor View":l.tenantName||"Creditor View"}),e.jsx("button",{type:"button",onClick:u,className:"btn position-absolute top-0 end-0 h-100 d-flex align-items-center text-white",children:e.jsx("i",{className:"material-icons fs-3 px-4",children:"close"})})]})}),e.jsx(f.Body,{children:e.jsxs("div",{className:"position-relative custom-mn-h-5",children:[o&&e.jsxs("div",{className:"text-center position-absolute top-50 start-50 translate-middle",children:[e.jsx("div",{className:"spinner-border text-info spinner-border-md",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})}),e.jsx("p",{children:"Loading...please wait"})]}),c&&e.jsxs("div",{className:"text-center text-danger position-absolute top-50 start-50 translate-middle",children:[e.jsx("p",{children:e.jsx("i",{className:"material-icons fs-1",children:"warning"})}),e.jsxs("p",{children:["Error: ",B.truncate(c,{length:500})]})]}),!(o||c||_)&&e.jsx(e.Fragment,{children:e.jsxs("div",{className:"row row-cols-3 align-items-stretch",children:[e.jsxs("div",{className:"col p-1",children:[e.jsx(T,{isCreditorView:!0,data:l.agedAnalysis}),e.jsx(k,{isCreditorView:!0,data:l.debtorIntelligence,clientId:s}),e.jsx(I,{isCreditorView:!0,data:l.contactDetails,clientId:s})]}),e.jsx("div",{className:"col p-1",children:e.jsx(O,{isCreditorView:!0,messages:l.communicationHistory,clientId:s,lease:n,creditorId:s,refresh:i})}),e.jsxs("div",{className:"col p-1",children:[e.jsx(H,{isCreditorView:!0,data:l.forecastInflows}),e.jsx(A,{isCreditorView:!0,clientId:s,paymentPlans:l.paymentPlans,refreshClientViewData:i,creditorName:r,currency:n.currency})]})]})})]})})]})})}function F(){const[d,u]=x.useState(!1),[l,c]=x.useState(null),[o,s]=x.useState(""),[i,n]=x.useState(!1),[r,_]=x.useState(null);function g(a,h){if(_(a),u(!0),n(!0),s(""),h){s(h),c(null),n(!1);return}w(reverseUrl("creditor_details"),{params:{creditor_id:a.creditor_id}}).then(t=>{const p={isCreditorView:!0,tenantName:a.creditor_name,agedAnalysis:{oneTwentyDays:t.data.aged_analysis["120_days_plus"],ninetyDays:t.data.aged_analysis["90_days"],sixtyDays:t.data.aged_analysis["60_days"],thirtyDays:t.data.aged_analysis["30_days"],current:t.data.aged_analysis.current},contactDetails:{contactPerson:`${t.data.creditor.firstname} ${t.data.creditor.surname}`,smsNumber:t.data.creditor.sms_number,otherNumbers:t.data.creditor.other_number,emailAddress:t.data.creditor.email,address:t.data.creditor.address},paymentPlans:t.data.payment_plans.map(m=>({id:m.id,person:m.spoke_with,date:m.expected_pay_date,amount:m.amount})),communicationHistory:t.data.communication_history.map(m=>({text:m.message,timestamp:m.created_at,user:m.user_name,actionDone:m.action_done?m.action_done:null,communicationType:m.type,data:null})),debtorIntelligence:Object.values(t.data.debtor_intelligence).length&&Object.values(t.data.debtor_intelligence).every(Boolean)?{text:t.data.debtor_intelligence.note,timestamp:t.data.debtor_intelligence.updated_at,user:t.data.debtor_intelligence.user_name}:null,forecastInflows:{zeroToSevenDays:t.data.forecast_inflows["0-7"],eightToFourteenDays:t.data.forecast_inflows["8-14"],fourteenToTwentyOneDays:t.data.forecast_inflows["14-21"],twentyOnePlusDays:t.data.forecast_inflows["21+"],total:t.data.forecast_inflows.total}};p.communicationHistory=p.communicationHistory.concat(j({works:t.data.works_data||[],maintenance:t.data.maintenance_data||[]})),console.log({res:t,resData:p,creditor:a}),c(p),s(""),n(!1)}).catch(t=>{s(b(t)),c(null),n(!1)})}function N(){console.log("refreshing.."),n(!0),s(""),w(reverseUrl("creditor_details"),{params:{creditor_id:r.creditor_id}}).then(a=>{const h={isCreditorView:!0,tenantName:r.creditor_name,agedAnalysis:{oneTwentyDays:a.data.aged_analysis["120_days_plus"],ninetyDays:a.data.aged_analysis["90_days"],sixtyDays:a.data.aged_analysis["60_days"],thirtyDays:a.data.aged_analysis["30_days"],current:a.data.aged_analysis.current},contactDetails:{contactPerson:`${a.data.creditor.firstname} ${a.data.creditor.surname}`,smsNumber:a.data.creditor.sms_number,otherNumbers:a.data.creditor.other_number,emailAddress:a.data.creditor.email,address:a.data.creditor.address},paymentPlans:a.data.payment_plans.map(t=>({id:t.id,person:t.spoke_with,date:t.expected_pay_date,amount:t.amount})),communicationHistory:a.data.communication_history.map(t=>({text:t.message,timestamp:t.created_at,user:t.user_name,actionDone:t.action_done?t.action_done:null,communicationType:t.type,data:null})),debtorIntelligence:Object.values(a.data.debtor_intelligence).length&&Object.values(a.data.debtor_intelligence).every(Boolean)?{text:a.data.debtor_intelligence.note,timestamp:a.data.debtor_intelligence.updated_at,user:a.data.debtor_intelligence.user_name}:null,forecastInflows:{zeroToSevenDays:a.data.forecast_inflows["0-7"],eightToFourteenDays:a.data.forecast_inflows["8-14"],fourteenToTwentyOneDays:a.data.forecast_inflows["14-21"],twentyOnePlusDays:a.data.forecast_inflows["21+"],total:a.data.forecast_inflows.total}};h.communicationHistory=h.communicationHistory.concat(j({works:a.data.works_data||[],maintenance:a.data.maintenance_data||[]})),console.log({res:a,resData:h,creditor:r}),c(h),s(""),n(!1)}).catch(a=>{s(b(a)),c(null),n(!1)})}function v(){u(!1)}return{data:l,error:o,isLoading:i,showModal:d,lease:r,clientId:r?r.creditor_id:null,refreshCreditorViewData:N,openCreditorView:g,hideCreditorView:v,creditorName:r?r.creditor_name:""}}function $(d,u,l,c){const o=new URL(C().url).searchParams.get("open_view_for");x.useEffect(()=>{if(!o)return;const n=d.find(r=>r.lease_id==o);n?s.openCreditorView(n):s.openCreditorView(n,`Creditor with ID '${o}' is not included in your current creditors list.`)},[o]);const s=F();return{balanceTotal:d.reduce((n,r)=>n+r.balance_owed,0),creditorViewProps:s}}function L({creditors:d,current_page:u,total_pages:l,total_items:c}){const{balanceTotal:o,creditorViewProps:s}=$(d);return e.jsxs("div",{children:[e.jsx(E,{creditorViewProps:s}),e.jsx("h5",{className:"bg-danger text-center text-white p-2 mb-4 rounded-2",children:"CREDITOR SUMMARY"}),e.jsxs("table",{className:"table table-bordered table-responsive table-sm c-fs-small",children:[e.jsxs("thead",{className:"position-sticky c-table-top c-bg-whitesmoke",children:[e.jsx("tr",{children:e.jsx("td",{colSpan:7,children:e.jsx("div",{className:"col-4 p-0 pt-1",children:e.jsx(V,{searchBy:"search",placeholder:"Search..."})})})}),e.jsxs("tr",{className:"c-thead-bg rounded-2 c-force-borders",children:[e.jsx("th",{children:e.jsx("div",{children:" Creditor ID"})}),e.jsx("th",{children:e.jsx("div",{children:" Creditor Name"})}),e.jsx("th",{className:"text-end",children:e.jsx("div",{children:" Balance Owed"})}),e.jsx("th",{className:"text-end bg-white",children:e.jsx("div",{})})]})]}),!!d.length&&e.jsxs(e.Fragment,{children:[e.jsx("tbody",{children:d.map((i,n)=>e.jsxs("tr",{children:[e.jsx("td",{children:i.creditor_id}),e.jsx("td",{children:e.jsx("button",{type:"button",title:"double click for communication history",className:"custom-btn text-decoration-underline",onDoubleClick:()=>s.openCreditorView(i),children:i.creditor_name})}),e.jsx("td",{className:"text-end px-3",children:Number(i.balance_owed)>=0?y(Number(i.balance_owed)):`(${y(Number(i.balance_owed)*-1)})`}),e.jsx("td",{className:"bg-info text-center",style:{fontWeight:"500",fontSize:"16px",color:"white",cursor:"pointer"},onClick:()=>D.Inertia.visit(reverseUrl("detailed_creditor_statement",i.creditor_id),{data:{lease_id:i.lease_id}}),children:"View"})]},i.creditor_id+" - "+n))}),e.jsx("tfoot",{className:"fw-bold c-fs-18",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Total"}),e.jsx("td",{}),e.jsx("td",{className:"text-end",children:o>=0?y(o):`(${y(o*-1)})`}),e.jsx("td",{})]})})]})]}),!d.length&&e.jsx("div",{className:"custom-h-4 d-flex justify-content-center align-items-center border border-2",children:"Nothing to show"}),e.jsx("div",{className:"px-3",children:e.jsx(P,{currentPage:u||1,totalPages:l||1})})]})}L.layout=d=>e.jsx(S,{children:d,title:"Creditor Statements"});export{L as default};
