/* Per-car mods. Paint (incl. custom colour) and performance parts (engine, tyres, turbo, brakes,
   nitrous, tank) used to be shared by every car. Each car now keeps its own record in TN.car
   (saved with the tuning data). Finish, wheels, kits, vinyls and underglow were already per car.
   Old saves: the mods you had go to the C1 (and the car you were in); other cars start stock.
   In the gallery / tuning screen colours are only previews: a car's colour changes only when
   the tuning menu actually sells you paint (it writes TN.pnt while open). */
(function(){
const T=window.TN;if(!T||typeof setCar!=='function')return;
const canon=a=>{const c=PCOL.find(c=>c[1].every((v,i)=>Math.abs(v-a[i])<1e-6));return c?c[1]:a.slice()};
const STOCK=()=>({p:PCOL[0][1].slice(),eng:0,tyr:0,trb:0,brk:0,nos:0,tank:0,cu:0});
const tuning=()=>!!(window.TNon&&TNon()),galOn=()=>typeof GAL!=='undefined'&&GAL.on;
const perf=()=>({eng:ENG|0,tyr:TYR|0,trb:T.trb|0,brk:T.brk|0,nos:T.nos|0,tank:T.tank|0});
const rec=i=>T.car[i]||(T.car[i]=STOCK());
const persist=()=>{try{localStorage.setItem('tune1',JSON.stringify(T))}catch(e){czErr(e,"percar.js")}};
let ready=0,quiet=0,was=0;
/* a gallery session lasts from openGallery until our check after it closes (closeGallery restores the car after it switches GAL.on off) */
{const og=openGallery;openGallery=function(){was=1;return og.apply(this,arguments)}}
function put(r){r=r||STOCK();paintC=canon(r.p);ENG=r.eng|0;TYR=r.tyr|0;T.trb=r.trb|0;T.brk=r.brk|0;T.nos=r.nos|0;T.tank=r.tank|0;T.custOn=r.cu?1:0;if(r.cu)T.cust=paintC;quiet=1;T.pnt=paintC.slice();quiet=0;applyUpg();applyPaint()}
/* the tuning menu writes TN.pnt when you pay for paint: that's the moment the colour belongs to this car */
{let v=T.pnt;Object.defineProperty(T,'pnt',{configurable:true,enumerable:true,get:()=>v,set:x=>{v=x;if(ready&&!quiet&&tuning()&&x){const r=rec(CARI);r.p=x.slice();r.cu=T.custOn?1:0;persist()}}})}
/* switching car: file the old car's parts (and, outside the gallery, its colour), bring out the new car's */
{const s0=setCar;setCar=function(i){const prev=CARI;if(ready&&i!==prev){const r=rec(prev);Object.assign(r,perf());if(!galOn()&&!was){r.p=paintC.slice();r.cu=T.custOn?1:0}}s0(i);if(ready&&i!==prev)put(rec(i))}}
/* after the gallery / tuning screen: parts as they are now, colour from the record */
setInterval(()=>{if(!ready)return;
 if(galOn()){was=1;return}
 if(was){was=0;const r=rec(CARI);Object.assign(r,perf());put(r);persist();return}
 /* outside the gallery anything that changes paint or parts (e.g. the respray shop) applies to this car */
 const r=rec(CARI),p=perf();let ch=0;for(const k in p)if(r[k]!==p[k]){r[k]=p[k];ch=1}
 if(!r.p.every((v,i)=>Math.abs(v-paintC[i])<1e-6)){r.p=paintC.slice();r.cu=T.custOn?1:0;ch=1}if(ch)persist()},300);
{const sv=saveGame;saveGame=function(){if(ready&&!galOn()){const r=rec(CARI);Object.assign(r,perf());r.p=paintC.slice();r.cu=T.custOn?1:0}persist();return sv.apply(this,arguments)}}
/* start once the game (and tune.js's own paint restore) has settled */
{let t=0;const w=setInterval(()=>{if(window.READY===true||++t>300){clearInterval(w);setTimeout(()=>{
 if(!T.car){T.car={};const s=Object.assign(perf(),{p:paintC.slice(),cu:T.custOn?1:0});T.car[0]=s;T.car[CARI]=Object.assign({},s);persist()}
 else if(T.car[CARI])put(T.car[CARI]);
 else{T.car[CARI]=Object.assign(perf(),{p:paintC.slice(),cu:T.custOn?1:0});persist()}
 ready=1},400)}},100)}
window.PERCAR={get:i=>T.car&&T.car[i],put};
})();
