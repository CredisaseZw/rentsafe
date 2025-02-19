import{b as Z}from"./main-c9f48cfc.js";import{f as N}from"./formatting-9de8c923.js";import{l as i}from"./lodash-138d3cec.js";const{Axios:J,AxiosError:P,CanceledError:V,isCancel:k,CancelToken:q,VERSION:K,all:M,Cancel:Q,isAxiosError:S,spread:U,toFormData:W,AxiosHeaders:v,HttpStatusCode:X,formToJSON:Y,getAdapter:L,mergeConfig:b}=Z;function j(e){return/^[A-Z]{2}\d{7}$/.test(e)}function ee(e){return!0}function te(e){return/^\d{8,9}[A-Za-z]{1}\d{2}$/.test(e)}function re(e,r){switch(e=new Date(e),r){case"second":return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"numeric"}).format(e);case"third":return Intl.DateTimeFormat("en-GB",{month:"numeric",day:"2-digit",year:"2-digit"}).format(e);default:return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"2-digit"}).format(e)}}function ae(e,r){switch(e=new Date(e),r){case"second":return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1}).format(e);case"third":return Intl.DateTimeFormat("en-GB",{month:"numeric",day:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}).format(e);default:return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}).format(e)}}function se(e){return e>=0?N(e):`(${N(e*-1)})`}function ne(e){var r,d,s,t,n,u,f,c,m,p,l,g,h,y,_,x,T,D,$,w,A,E,C,F,I,z,B,G;if(console.log(e),(e.headers||(r=e.response)!=null&&r.headers)&&new v(e.headers||((d=e.response)==null?void 0:d.headers)).getContentType().includes("text/html"))return`got invalid response type 'html'. Response text: ${e.statusText||((s=e.response)==null?void 0:s.statusText)||""}`;if(S(e)){if(e.response.status===500)return e.response.statusText;const a=((n=(t=e.response)==null?void 0:t.data)==null?void 0:n.errors)||((f=(u=e.response)==null?void 0:u.data)==null?void 0:f.error)||((m=(c=e.response)==null?void 0:c.data)==null?void 0:m.err)||((l=(p=e.response)==null?void 0:p.data)==null?void 0:l.messages)||((h=(g=e.response)==null?void 0:g.data)==null?void 0:h.message)||((_=(y=e.response)==null?void 0:y.data)==null?void 0:_.results)||((T=(x=e.response)==null?void 0:x.data)==null?void 0:T.result)||(($=(D=e.response)==null?void 0:D.data)==null?void 0:$.status)||((w=e.response)==null?void 0:w.data);if(a)return typeof a=="object"?o(a):i.capitalize(a)}else if(e!=null&&e.data){const a=((A=e.data)==null?void 0:A.errors)||((E=e.data)==null?void 0:E.error)||((C=e.data)==null?void 0:C.err)||((F=e.data)==null?void 0:F.messages)||((I=e.data)==null?void 0:I.message)||((z=e.data)==null?void 0:z.results)||((B=e.data)==null?void 0:B.result)||((G=e.data)==null?void 0:G.status)||e.data;if(a)return typeof a=="object"?o(a):i.capitalize(a)}else return typeof e=="object"?o(e):JSON.stringify(e)}function o(e){const r=e.__proto__==={}.__proto__,d=e.__proto__===[].__proto__;if(!(r||d))throw new TypeError(`argument received is neither an object nor a list: ${e.__proto__}"`);let s="";return r?Object.keys(e).forEach(t=>{const n=e[t];typeof n=="string"||typeof n=="number"||typeof n=="boolean"?s+=`${i.capitalize(t)} - ${n}. `:s+=`${i.capitalize(t)} - ${o(n)}`}):e.forEach(t=>{typeof t=="string"||typeof t=="number"||typeof t=="boolean"?s+=`${i.capitalize(t)}. `:s+=o(t)}),s}function ie(e){return/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(e)}export{P as A,te as a,se as b,j as c,ae as d,re as f,ie as i,ne as u,ee as v};
