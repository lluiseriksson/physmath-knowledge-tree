import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const digits=n=>[Math.floor(n/9),Math.floor(n/3)%3,n%3];
const enc=d=>9*d[0]+3*d[1]+d[2];
const shift=n=>enc(digits(n).map(x=>(x+1)%3));
const charge=n=>digits(n).reduce((a,b)=>a+b,0)%3;
const pairShift=n=>27*shift(Math.floor(n/27))+shift(n%27);
const pop=n=>((n&1)?1:0)+((n&2)?1:0)+((n&4)?1:0);
const add=(m,k,v)=>m.set(k,(m.get(k)||0)+v);
const clean=m=>new Map([...m].filter(([,v])=>v!==0));
const insist=(x,msg)=>{if(!x)throw Error(msg)};
const M=[];const ms=[];
for(let q=0;q<3;q++){
 let m=new Map();
 for(let r=0;r<27;r++)for(let t=0;t<27;t++)for(let mask=0;mask<8;mask++){
  const rd=digits(r),td=digits(t);
  const a=rd.map((x,i)=>(mask&(1<<i))?td[i]:x);
  if(a[1]!==((a[0]+q)%3)||a[2]!==((a[0]+2*q)%3))continue;
  const b=enc(td.map((x,i)=>(mask&(1<<i))?rd[i]:x));
  add(m,(b*27+r)*27+t,((-1)**pop(mask))*(2**(3-pop(mask))));
 }
 m=clean(m);M.push(m);
 let shifted=new Map();let zgood=true;
 for(const [key,value]of m){const t=key%27,row=Math.floor(key/27),r=row%27,b=Math.floor(row/27);
   add(shifted,(shift(b)*27+shift(r))*27+shift(t),value);
   zgood=zgood&&((charge(b)-charge(r)-charge(t)+6)%3===0);
 }
 insist(zgood,'Z intertwiner failed');
 insist(m.size===shifted.size&&[...m].every(([k,v])=>shifted.get(k)===v),'X intertwiner failed');
 const support=[0,1,2].map(t=>enc([t,(t+q)%3,(t+2*q)%3]));
 insist(support.every(x=>charge(x)===0)&&support.every(x=>support.includes(shift(x))),'code stabilizer failed');
 ms.push({logical_basis:q,scaled_by:8,rows:729,columns:27,nonzero:m.size,X_intertwiner:true,Z_intertwiner:true,code_stabilizers:true});
}
let A=new Map();
for(let b=0;b<27;b++)for(let r=0;r<27;r++)for(let mask=0;mask<8;mask++){
 const bd=digits(b),rd=digits(r);
 const bb=enc(bd.map((x,i)=>(mask&(1<<i))?rd[i]:x));
 const rr=enc(rd.map((x,i)=>(mask&(1<<i))?bd[i]:x));
 add(A,(bb*27+rr)*729+(b*27+r),((-1)**pop(mask))*(2**(3-pop(mask))));
}
A=clean(A);let ashift=new Map();let az=true;
for(const[k,v]of A){const row=Math.floor(k/729),col=k%729;add(ashift,pairShift(row)*729+pairShift(col),v);
 const cr=(charge(Math.floor(row/27))+charge(row%27))%3;
 const cc=(charge(Math.floor(col/27))+charge(col%27))%3;az=az&&cr===cc;
}
insist(az&&A.size===ashift.size&&[...A].every(([k,v])=>ashift.get(k)===v),'A covariance failed');
const orbits=[[],[],[]],seen=new Set();
for(let row=0;row<729;row++)if(!seen.has(row)){
 const orbit=[row,pairShift(row),pairShift(pairShift(row))];
 insist(new Set(orbit).size===3&&pairShift(orbit[2])===row,'orbit size');
 for(const v of orbit){insist(!seen.has(v),'orbit overlap');seen.add(v)}
 const c=(charge(Math.floor(row/27))+charge(row%27))%3;
 insist(orbit.every(v=>(charge(Math.floor(v/27))+charge(v%27))%3===c),'charge orbit');orbits[c].push(orbit);
}
insist(seen.size===729&&orbits.every(x=>x.length===81),'sector coverage');
const omega=e=>{e=(e%3+3)%3;return e===0?[1,0]:e===1?[0,1]:[-1,-1]};
for(let p=0;p<3;p++)for(let pp=0;pp<3;pp++){
 const sum=[0,0];for(let t=0;t<3;t++){const z=omega((p-pp)*t);sum[0]+=z[0];sum[1]+=z[1]}
 insist(sum[0]===(p===pp?3:0)&&sum[1]===0,'Fourier Gram');
}
const sparseM=M.map(m=>[...m].sort(([a],[b])=>a-b));
const mtext=JSON.stringify({meaning:'Each entry is 8*M_j for unnormalized code column w_j; triple key=(b*27+r)*27+t',matrices:sparseM})+'\n';
writeFileSync('M-COEFFICIENTS1317.json',mtext);
const frames={meaning:'For each charge c and character p=0,1,2, column is sum_t omega^(-p*t)|orbit[t]>/sqrt3;81columns/sector',charge_orbits:orbits};
const ftext=JSON.stringify(frames)+'\n';writeFileSync('FRAMES1317.json',ftext);
const sha=s=>createHash('sha256').update(s).digest('hex');
const result={scope:'Exact integer/roots-of-unity universal coefficient and frame checks; no B positivity or manuscript review',logical_variables:'all complex psi_j retained by complex linearity; no sampled anchors',M:ms,A:{scaled_by:8,nonzero:A.size,X_covariance:true,Z_covariance:true},sectors:orbits.map((x,c)=>({charge:c,orbits:x.length,characters:3,dimension_each:81})),dimension_total:729,Fourier_Gram_exact:true,M_sha256:sha(mtext),frames_sha256:sha(ftext),positivity_checked:false,uniform_gap_proved:false,formal_kernel_checked:false};
writeFileSync('RESULT1317.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
