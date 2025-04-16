function C(n,d){return[...n,...d].sort((a,o)=>new Date(a.date_updated)-new Date(o.date_updated)).map(a=>({...a,type:a.reference==="cash-receipt"?"payment":"invoice"}))}const b=n=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(n),l=(n,d)=>{const a={safe:"Current",low:"Past Due 1-30 days",medium:"Past Due 31-60 days",high:"Past Due 61-90 days","non-payer":"Past Due 90+ days"},o=(t,r)=>{const u=t.map(e=>({label:a[e.status]||"Current",amount:e.amount_owing||0,bg:r[e.status]||"green"}));return Object.values(a).forEach(e=>{if(!u.some(s=>s.label===e)){const s=e==="Current"?"green":e==="Past Due 1-30 days"?"orange":e==="Past Due 31-60 days"?"#f87171":e==="Past Due 61-90 days"?"#991b1b":"black";u.push({label:e,amount:0,bg:s})}}),u.sort((e,s)=>{const D=["Current","Past Due 1-30 days","Past Due 31-60 days","Past Due 61-90 days","Past Due 90+ days"];return D.indexOf(e.label)-D.indexOf(s.label)}),u},c={safe:"green",low:"orange",medium:"#f87171",high:"#991b1b","non-payer":"black"},i=o(n,c),m=o(d,c),f=i.reduce((t,r)=>t+r.amount,0)||0,y=m.reduce((t,r)=>t+r.amount,0)||0,g=i.map(t=>({...t,percentage:Math.round(t.amount/f*100,2)||0})),p=m.map(t=>({...t,percentage:Math.round(t.amount/y*100,2)||0}));return{creditGivenWithPercentages:g,creditTakenWithPercentages:p,totalCreditGiven:f,totalCreditTaken:y}};export{C as a,b as f,l as t};
