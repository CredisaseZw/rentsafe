var O=Object.defineProperty;var k=Object.getOwnPropertySymbols;var R=Object.prototype.hasOwnProperty,Z=Object.prototype.propertyIsEnumerable;var M=(e,t,r)=>t in e?O(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,u=(e,t)=>{for(var r in t||(t={}))R.call(t,r)&&M(e,r,t[r]);if(k)for(var r of k(t))Z.call(t,r)&&M(e,r,t[r]);return e};import{b as v}from"./main-1c3a2f1f.js";import{f as S}from"./formatting-9de8c923.js";import{l as o}from"./lodash-50347b1e.js";const{Axios:Q,AxiosError:U,CanceledError:W,isCancel:X,CancelToken:Y,VERSION:L,all:b,Cancel:j,isAxiosError:H,spread:ee,toFormData:te,AxiosHeaders:J,HttpStatusCode:re,formToJSON:ae,getAdapter:se,mergeConfig:ne}=v;function ie(e){return!0}function oe(e){return/^\d{8,9}[A-Za-z]{1}\d{2}$/.test(e)}function de(e,t){switch(e=new Date(e),t){case"second":return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"numeric"}).format(e);case"third":return Intl.DateTimeFormat("en-GB",{month:"numeric",day:"2-digit",year:"2-digit"}).format(e);default:return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"2-digit"}).format(e)}}function ue(e,t){switch(e=new Date(e),t){case"second":return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit",hour12:!1}).format(e);case"third":return Intl.DateTimeFormat("en-GB",{month:"numeric",day:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}).format(e);default:return Intl.DateTimeFormat("en-GB",{month:"short",day:"2-digit",year:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1}).format(e)}}function me(e){return e>=0?S(e):`(${S(e*-1)})`}function ce(e){var t,r,a,s,i,m,c,p,f,l,g,h,y,_,T,x,w,D,$,A,E,C,F,I,z,B,G,N;if(console.log(e),(e.headers||(t=e.response)!=null&&t.headers)&&new J(e.headers||((r=e.response)==null?void 0:r.headers)).getContentType().includes("text/html"))return`got invalid response type 'html'. Response text: ${e.statusText||((a=e.response)==null?void 0:a.statusText)||""}`;if(H(e)){if(e.response.status===500)return e.response.statusText;const n=((i=(s=e.response)==null?void 0:s.data)==null?void 0:i.errors)||((c=(m=e.response)==null?void 0:m.data)==null?void 0:c.error)||((f=(p=e.response)==null?void 0:p.data)==null?void 0:f.err)||((g=(l=e.response)==null?void 0:l.data)==null?void 0:g.messages)||((y=(h=e.response)==null?void 0:h.data)==null?void 0:y.message)||((T=(_=e.response)==null?void 0:_.data)==null?void 0:T.results)||((w=(x=e.response)==null?void 0:x.data)==null?void 0:w.result)||(($=(D=e.response)==null?void 0:D.data)==null?void 0:$.status)||((A=e.response)==null?void 0:A.data);if(n)return typeof n=="object"?d(n):o.capitalize(n)}else if(e!=null&&e.data){const n=((E=e.data)==null?void 0:E.errors)||((C=e.data)==null?void 0:C.error)||((F=e.data)==null?void 0:F.err)||((I=e.data)==null?void 0:I.messages)||((z=e.data)==null?void 0:z.message)||((B=e.data)==null?void 0:B.results)||((G=e.data)==null?void 0:G.result)||((N=e.data)==null?void 0:N.status)||e.data;if(n)return typeof n=="object"?d(n):o.capitalize(n)}else return typeof e=="object"?d(e):JSON.stringify(e)}function d(e){const t=e.__proto__==={}.__proto__,r=e.__proto__===[].__proto__;if(!(t||r))throw new TypeError(`argument received is neither an object nor a list: ${e.__proto__}"`);let a="";return t?Object.keys(e).forEach(s=>{const i=e[s];typeof i=="string"||typeof i=="number"||typeof i=="boolean"?a+=`${o.capitalize(s)} - ${i}. `:a+=`${o.capitalize(s)} - ${d(i)}`}):e.forEach(s=>{typeof s=="string"||typeof s=="number"||typeof s=="boolean"?a+=`${o.capitalize(s)}. `:a+=d(s)}),a}function pe(e){return/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(e)}function fe(e){const t=e.maintenance.map(a=>({timestamp:a.updated_at,user:a.user_name,communicationType:"maintenance",data:u({},a)}));return[...e.works.map(a=>({timestamp:a.updated_at,user:a.user_name,communicationType:"works",data:u({},a)})),...t]}export{U as A,oe as a,me as b,ue as c,de as f,pe as i,fe as m,ce as u,ie as v};
