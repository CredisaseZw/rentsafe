import{u as i,a as f,r as d,j as t}from"./main-27bc9caa.js";function h(e){const{url:a}=i(),{get:s}=f(),c=d.useRef(null),o=new URL(a).searchParams.get(e);function n(r){r.preventDefault();const l=new URL(a),u=r.target[e].value;u.trim()?l.searchParams.set(e,u):l.searchParams.delete(e),l.searchParams.delete("page"),s(l.href,{preserveState:!0})}function m(){const r=new URL(a);r.searchParams.delete(e),r.searchParams.delete("page"),s(r.href,{preserveState:!1})}return{defaultValue:o,handleSearch:n,clear:m,formRef:c}}function b({searchBy:e,placeholder:a}){const{defaultValue:s,handleSearch:c,clear:o,formRef:n}=h(e);return t.jsx("form",{onSubmit:c,ref:n,children:t.jsxs("div",{className:"input-group",children:[t.jsx("button",{type:"button",className:"btn border bg-white border-2 custom-z-0",onClick:o,children:t.jsx("i",{className:"material-icons small",children:"close"})}),t.jsx("input",{name:e,defaultValue:s,placeholder:a||`Search by ${e}`,onBlur:()=>n.current.requestSubmit(),className:"form-control"}),t.jsx("button",{type:"submit",className:"btn btn-primary custom-z-0",children:"Search"})]})})}export{b as S};
