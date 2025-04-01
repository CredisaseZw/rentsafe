import{j as e}from"./main-a6dda5c9.js";import{L as c}from"./Layout-b4321159.js";import{b as s}from"./index-cdca6ff0.js";import"./lodash-d3c3e9f3.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-6ad84934.js";import"./Modal-c2655e25.js";import"./index-e760cfb2.js";import"./formatting-9de8c923.js";import"./MultipleUpload-0f1cec23.js";import"./search-2b7e2b99.js";function h(n,a){const l=n==null?void 0:n.reduce((d,t)=>({zero_to_seven_days:d.zero_to_seven_days+t["0-7"],eight_to_fourteen_days:d.eight_to_fourteen_days+t["8-14"],fifteen_to_twenty_one_days:d.fifteen_to_twenty_one_days+t["14-21"],twenty_one_plus_days:d.twenty_one_plus_days+t["21+"],total:d.total+t.total}),{zero_to_seven_days:0,eight_to_fourteen_days:0,fifteen_to_twenty_one_days:0,twenty_one_plus_days:0,total:0}),r=a==null?void 0:a.reduce((d,t)=>({zero_to_seven_days:d.zero_to_seven_days+t["0-7"],eight_to_fourteen_days:d.eight_to_fourteen_days+t["8-14"],fifteen_to_twenty_one_days:d.fifteen_to_twenty_one_days+t["14-21"],twenty_one_plus_days:d.twenty_one_plus_days+t["21+"],total:d.total+t.total}),{zero_to_seven_days:0,eight_to_fourteen_days:0,fifteen_to_twenty_one_days:0,twenty_one_plus_days:0,total:0});return{netFlows:{zero_to_seven_days:l.zero_to_seven_days-r.zero_to_seven_days,eight_to_fourteen_days:l.eight_to_fourteen_days-r.eight_to_fourteen_days,fifteen_to_twenty_one_days:l.fifteen_to_twenty_one_days-r.fifteen_to_twenty_one_days,twenty_one_plus_days:l.twenty_one_plus_days-r.twenty_one_plus_days,total:l.total-r.total},inflows_totals:l,outflows_totals:r}}function i({forecast_inflows:n=[],forecast_outflows:a=[],Auth:{company:{company_name:l}}}){const{netFlows:r,inflows_totals:o,outflows_totals:d}=h(n,a);return e.jsxs("div",{className:"bg-white border rounded-3",children:[e.jsx("h5",{className:"text-center p-2 mb-0 text-white bg-info",children:l}),e.jsx("div",{className:"custom-bg-grey-2 text-white text-center p-1",children:"Cashflow Forecast (USD)"}),e.jsxs("table",{style:{lineHeight:"5px",fontSize:"12px"},className:"table table-bordered table-responsive mb-0",children:[e.jsx("thead",{className:"position-sticky c-table-top bg-white shadow-sm",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Customer"}),e.jsx("th",{children:"0-7 Days"}),e.jsx("th",{children:"8-14 Days"}),e.jsx("th",{children:"15-21 Days"}),e.jsx("th",{children:"21+ Days"}),e.jsx("th",{children:"total"})]})}),e.jsxs("tbody",{children:[e.jsxs(e.Fragment,{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"fs-larger bg-success text-white fw-bolder",children:"inflows"}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{})]}),n==null?void 0:n.map((t,_)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.tenant}),e.jsx("td",{className:"text-end",children:s(t["0-7"])}),e.jsx("td",{className:"text-end",children:s(t["8-14"])}),e.jsx("td",{className:"text-end",children:s(t["14-21"])}),e.jsx("td",{className:"text-end",children:s(t["21+"])}),e.jsxs("td",{className:"text-end",children:["$",s(t.total)]})]},_)),!(n!=null&&n.length)&&e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-1 d-flex justify-content-center align-items-center ",children:"Nothing to show"})})}),o&&e.jsxs("tr",{children:[e.jsx("th",{className:"fs-larger",children:"Total"}),e.jsx("th",{className:"c-border-y-dark text-end",children:s(o.zero_to_seven_days)}),e.jsx("th",{className:"c-border-y-dark text-end",children:s(o.eight_to_fourteen_days)}),e.jsx("th",{className:"c-border-y-dark text-end",children:s(o.fifteen_to_twenty_one_days)}),e.jsx("th",{className:"c-border-y-dark text-end",children:s(o.twenty_one_plus_days)}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["$",s(o.total)]})]})]}),e.jsx("tr",{className:"py-3 d-block"}),e.jsxs(e.Fragment,{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"fs-larger bg-danger text-white fw-bolder",children:"outflows"}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{})]}),a==null?void 0:a.map((t,_)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.tenant}),e.jsxs("td",{className:"text-end",children:["(",s(t["0-7"]),")"]}),e.jsxs("td",{className:"text-end",children:["(",s(t["8-14"]),")"]}),e.jsxs("td",{className:"text-end",children:["(",s(t["14-21"]),")"]}),e.jsxs("td",{className:"text-end",children:["(",s(t["21+"]),")"]}),e.jsxs("td",{className:"text-end",children:["($",s(t.total),")"]})]},_)),!(a!=null&&a.length)&&e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-1 d-flex justify-content-center align-items-center ",children:"Nothing to show"})})}),d&&e.jsxs("tr",{children:[e.jsx("th",{className:"fs-larger",children:"Total"}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["( ",s(d.zero_to_seven_days),")"]}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["( ",s(d.eight_to_fourteen_days),")"]}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["( ",s(d.fifteen_to_twenty_one_days),")"]}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["( ",s(d.twenty_one_plus_days),")"]}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["( $",s(d.total),")"]})]})]}),e.jsx("tr",{className:"py-3 d-block"}),r&&e.jsxs("tr",{children:[e.jsx("th",{className:"fs-larger",children:"Net Flows"}),e.jsx("th",{className:"text-end c-border-y-dark",children:s(r.zero_to_seven_days)}),e.jsx("th",{className:"text-end c-border-y-dark",children:s(r.eight_to_fourteen_days)}),e.jsx("th",{className:"text-end c-border-y-dark",children:s(r.fifteen_to_twenty_one_days)}),e.jsx("th",{className:"text-end c-border-y-dark",children:s(r.twenty_one_plus_days)}),e.jsxs("th",{className:"text-end c-border-y-dark",children:["$",s(r.total)]})]})]})]})]})}i.layout=n=>e.jsx(c,{children:n,title:"forecasts"});export{i as default};
