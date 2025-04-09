var R=Object.defineProperty;var M=Object.getOwnPropertySymbols;var S=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable;var k=(e,t,r)=>t in e?R(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,u=(e,t)=>{for(var r in t||(t={}))S.call(t,r)&&k(e,r,t[r]);if(M)for(var r of M(t))Z.call(t,r)&&k(e,r,t[r]);return e};import{b as H}from"./main-ca859b70.js";import{f as N}from"./formatting-9de8c923.js";import{l as o}from"./lodash-0908a5bb.js";const{Axios:Q,AxiosError:U,CanceledError:W,isCancel:X,CancelToken:Y,VERSION:L,all:b,Cancel:j,isAxiosError:P,spread:ee,toFormData:te,AxiosHeaders:J,HttpStatusCode:re,formToJSON:ae,getAdapter:se,mergeConfig:ne}=H;function ie(e){return!0}function oe(e){return/^\d{8,9}[A-Za-z]{1}\d{2}$/.test(e)}function de(e,t){switch(e=new Date(e),t){case"second":return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"numeric"}).format(e);case"third":return Intl.DateTimeFormat("en-GB",{month:"numeric",day:"2-digit",year:"2-digit"}).format(e);default:return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"2-digit"}).format(e)}}function ue(e,t){switch(e=new Date(e),t){case"second":return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1}).format(e);case"third":return Intl.DateTimeFormat("en-GB",{month:"numeric",day:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}).format(e);default:return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}).format(e)}}function ce(e){return e>=0?N(e):`(${N(e*-1)})`}function me(e){var t,r,a,s,i,c,m,f,p,l,g,h,y,_,x,w,T,D,I,A,$,B,E,C,z,v,F,G;if(console.log(e),(e.headers||(t=e.response)!=null&&t.headers)&&new J(e.headers||((r=e.response)==null?void 0:r.headers)).getContentType().includes("text/html"))return`got invalid response type 'html'. Response text: ${e.statusText||((a=e.response)==null?void 0:a.statusText)||""}`;if(P(e)){if(e.response.status===500)return e.response.statusText;const n=((i=(s=e.response)==null?void 0:s.data)==null?void 0:i.errors)||((m=(c=e.response)==null?void 0:c.data)==null?void 0:m.error)||((p=(f=e.response)==null?void 0:f.data)==null?void 0:p.err)||((g=(l=e.response)==null?void 0:l.data)==null?void 0:g.messages)||((y=(h=e.response)==null?void 0:h.data)==null?void 0:y.message)||((x=(_=e.response)==null?void 0:_.data)==null?void 0:x.results)||((T=(w=e.response)==null?void 0:w.data)==null?void 0:T.result)||((I=(D=e.response)==null?void 0:D.data)==null?void 0:I.status)||((A=e.response)==null?void 0:A.data);if(n)return typeof n=="object"?d(n):o.capitalize(n)}else if(e!=null&&e.data){const n=(($=e.data)==null?void 0:$.errors)||((B=e.data)==null?void 0:B.error)||((E=e.data)==null?void 0:E.err)||((C=e.data)==null?void 0:C.messages)||((z=e.data)==null?void 0:z.message)||((v=e.data)==null?void 0:v.results)||((F=e.data)==null?void 0:F.result)||((G=e.data)==null?void 0:G.status)||e.data;if(n)return typeof n=="object"?d(n):o.capitalize(n)}else return typeof e=="object"?d(e):typeof e=="string"?o.capitalize(e):"something went wrong! Please try again."}function d(e){const t=e.__proto__==={}.__proto__,r=e.__proto__===[].__proto__;if(!(t||r))throw new TypeError(`argument received is neither an object nor a list: ${e.__proto__}"`);let a="";return t?Object.keys(e).forEach(s=>{const i=e[s];typeof i=="string"||typeof i=="number"||typeof i=="boolean"?a+=`${o.capitalize(s)} - ${i}. `:a+=`${o.capitalize(s)} - ${d(i)}`}):e.forEach(s=>{typeof s=="string"||typeof s=="number"||typeof s=="boolean"?a+=`${o.capitalize(s)}. `:a+=d(s)}),a}function fe(e){return/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(e)}function pe(e){const t=e.maintenance.map(a=>({timestamp:a.updated_at,user:a.user_name,communicationType:"maintenance",data:u({},a)}));return[...e.works.map(a=>({timestamp:a.updated_at,user:a.user_name,communicationType:"works",data:u({},a)})),...t]}function le(e=[]){const r=[...e].reverse().findIndex(Boolean);if(r!==-1){const a=e.length-1-r;return e.slice(0,a).every(Boolean)}return!0}export{U as A,oe as a,ce as b,le as c,ue as d,de as f,fe as i,pe as m,me as u,ie as v};
