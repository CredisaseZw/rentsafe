import{j as e}from"./main-8b5daa16.js";import{L as _}from"./Layout-1500afa4.js";import{b as s}from"./index-fedd7536.js";import"./lodash-a1556254.js";import"./assertThisInitialized-3be3daa4.js";import"./removeClass-e2b727fe.js";import"./Modal-e9148396.js";import"./index-aaac8bfd.js";import"./formatting-9de8c923.js";import"./MultipleUpload-b8fc9f1f.js";import"./search-1d0357fd.js";import"./index-66c3a614.js";function h(r,a){const l=r==null?void 0:r.reduce((d,t)=>({zero_to_seven_days:d.zero_to_seven_days+t["0-7"],eight_to_fourteen_days:d.eight_to_fourteen_days+t["8-14"],fifteen_to_twenty_one_days:d.fifteen_to_twenty_one_days+t["14-21"],twenty_one_plus_days:d.twenty_one_plus_days+t["21+"],total:d.total+t.total}),{zero_to_seven_days:0,eight_to_fourteen_days:0,fifteen_to_twenty_one_days:0,twenty_one_plus_days:0,total:0}),n=a==null?void 0:a.reduce((d,t)=>({zero_to_seven_days:d.zero_to_seven_days+t["0-7"],eight_to_fourteen_days:d.eight_to_fourteen_days+t["8-14"],fifteen_to_twenty_one_days:d.fifteen_to_twenty_one_days+t["14-21"],twenty_one_plus_days:d.twenty_one_plus_days+t["21+"],total:d.total+t.total}),{zero_to_seven_days:0,eight_to_fourteen_days:0,fifteen_to_twenty_one_days:0,twenty_one_plus_days:0,total:0});return{netFlows:{zero_to_seven_days:l.zero_to_seven_days-n.zero_to_seven_days,eight_to_fourteen_days:l.eight_to_fourteen_days-n.eight_to_fourteen_days,fifteen_to_twenty_one_days:l.fifteen_to_twenty_one_days-n.fifteen_to_twenty_one_days,twenty_one_plus_days:l.twenty_one_plus_days-n.twenty_one_plus_days,total:l.total-n.total},inflows_totals:l,outflows_totals:n}}function i({forecast_inflows:r=[],forecast_outflows:a=[],Auth:{company:{company_name:l}}}){const{netFlows:n,inflows_totals:o,outflows_totals:d}=h(r,a);return console.log(r),e.jsxs("div",{className:"bg-white border rounded-3",children:[e.jsx("h5",{className:"text-center p-2 mb-0 text-white bg-info",children:l}),e.jsx("div",{className:"custom-bg-grey-2 text-white text-center p-1",children:"Cashflow Forecast (USD)"}),e.jsxs("table",{style:{lineHeight:"5px",fontSize:"12px"},className:"table table-bordered table-responsive mb-0",children:[e.jsx("thead",{className:"position-sticky c-table-top bg-white shadow-sm",children:e.jsxs("tr",{children:[e.jsx("th",{children:"Customer"}),e.jsx("th",{children:"0-7 Days"}),e.jsx("th",{children:"8-14 Days"}),e.jsx("th",{children:"15-21 Days"}),e.jsx("th",{children:"21+ Days"}),e.jsx("th",{children:"total"})]})}),e.jsxs("tbody",{children:[e.jsxs(e.Fragment,{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"fs-larger bg-success text-white fw-bolder",children:"inflows"}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{})]}),r==null?void 0:r.map((t,c)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.tenant}),e.jsx("td",{className:"text-end",children:s(t["0-7"])}),e.jsx("td",{className:"text-end",children:s(t["8-14"])}),e.jsx("td",{className:"text-end",children:s(t["14-21"])}),e.jsx("td",{className:"text-end",children:s(t["21+"])}),e.jsxs("td",{className:"text-end",children:["$",s(t.total)]})]},c)),!(r!=null&&r.length)&&e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-1 d-flex justify-content-center align-items-center ",children:"Nothing to show"})})}),o&&e.jsxs("tr",{children:[e.jsx("th",{className:"fs-larger",children:"Total"}),e.jsx("th",{className:"c-border-y-dark text-end",children:s(o.zero_to_seven_days)}),e.jsx("th",{className:"c-border-y-dark text-end",children:s(o.eight_to_fourteen_days)}),e.jsx("th",{className:"c-border-y-dark text-end",children:s(o.fifteen_to_twenty_one_days)}),e.jsx("th",{className:"c-border-y-dark text-end",children:s(o.twenty_one_plus_days)}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["$",s(o.total)]})]})]}),e.jsx("tr",{className:"py-3 d-block"}),e.jsxs(e.Fragment,{children:[e.jsxs("tr",{children:[e.jsx("td",{className:"fs-larger bg-danger text-white fw-bolder",children:"outflows"}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{}),e.jsx("td",{})]}),a==null?void 0:a.map((t,c)=>e.jsxs("tr",{children:[e.jsx("td",{children:t.tenant}),e.jsxs("td",{className:"text-end",children:["(",s(t["0-7"]),")"]}),e.jsxs("td",{className:"text-end",children:["(",s(t["8-14"]),")"]}),e.jsxs("td",{className:"text-end",children:["(",s(t["14-21"]),")"]}),e.jsxs("td",{className:"text-end",children:["(",s(t["21+"]),")"]}),e.jsxs("td",{className:"text-end",children:["($",s(t.total),")"]})]},c)),!(a!=null&&a.length)&&e.jsx("tr",{children:e.jsx("td",{colSpan:6,children:e.jsx("div",{className:"custom-h-1 d-flex justify-content-center align-items-center ",children:"Nothing to show"})})}),d&&e.jsxs("tr",{children:[e.jsx("th",{className:"fs-larger",children:"Total"}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["( ",s(d.zero_to_seven_days),")"]}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["( ",s(d.eight_to_fourteen_days),")"]}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["( ",s(d.fifteen_to_twenty_one_days),")"]}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["( ",s(d.twenty_one_plus_days),")"]}),e.jsxs("th",{className:"c-border-y-dark text-end",children:["( $",s(d.total),")"]})]})]}),e.jsx("tr",{className:"py-3 d-block"}),n&&e.jsxs("tr",{children:[e.jsx("th",{className:"fs-larger",children:"Net Flows"}),e.jsx("th",{className:"text-end c-border-y-dark",children:s(n.zero_to_seven_days)}),e.jsx("th",{className:"text-end c-border-y-dark",children:s(n.eight_to_fourteen_days)}),e.jsx("th",{className:"text-end c-border-y-dark",children:s(n.fifteen_to_twenty_one_days)}),e.jsx("th",{className:"text-end c-border-y-dark",children:s(n.twenty_one_plus_days)}),e.jsxs("th",{className:"text-end c-border-y-dark",children:["$",s(n.total)]})]})]})]})]})}i.layout=r=>e.jsx(_,{children:r,title:"forecasts"});export{i as default};
