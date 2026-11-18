/* ---- TUNING GARAGE: car selector, paint (incl. custom colour), performance parts, nitrous, underglow ---- */
(function(){
const TN={brk:0,trb:0,nos:0,tank:0,neon:{},nown:{},cust:null,custOn:0,fin:{},fown:{},rim:{},rown:{}};window.TN=TN;
try{const s=JSON.parse(localStorage.getItem('tune1')||'null');if(s)Object.assign(TN,s)}catch(e){}
for(const k of['fin','fown','rim','rown','neon','nown'])if(!TN[k])TN[k]={};
const save=()=>{try{localStorage.setItem('tune1',JSON.stringify(TN))}catch(e){}};
const $q=(s,r)=>(r||document).querySelector(s);

/* ======== game hooks ======== */
{const au=applyUpg;applyUpg=function(){au();ACCM*=[1,1.1,1.2,1.32][TN.trb|0];MAXV+=[0,1,2,4][TN.trb|0]}}
const NOS={ch:100,on:0};const nosCap=()=>100*(1+.5*(TN.tank|0));
{const st0=step;step=function(dt){
  const boost=NOS.on&&!GS.onFoot&&NOS.ch>0&&TN.nos&&!GAL.on,m=MAXV,a=ACCM;
  if(boost){MAXV*=1.28;ACCM*=2.2}
  st0(dt);MAXV=m;ACCM=a;
  if(!GS.onFoot&&TN.brk&&(inp.brk||keys.down)){const f=Math.exp(-(TN.brk|0)*.9*dt);GS.vx*=f;GS.vz*=f}
  if(boost){NOS.ch-=35*dt;if(NOS.ch<=0){NOS.ch=0;NOS.on=0}}else if(NOS.ch<nosCap())NOS.ch=Math.min(nosCap(),NOS.ch+7*dt);
 }}
// underglow + exhaust flames hang off the car group
const NEON=[['OFF',null],['ICE BLUE',0x2a8cff],['CYAN',0x19e3ff],['LIME',0x39ff3a],['PINK',0xff2d95],['PURPLE',0xa23bff],['RED',0xff2a2a],['AMBER',0xffa21a],['WHITE',0xffffff]];
const gtex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),g=x.createRadialGradient(64,64,6,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.45,'rgba(255,255,255,.7)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)})();
const neonM=new THREE.Mesh(new THREE.PlaneGeometry(1,1).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:gtex,color:0x19e3ff,transparent:true,opacity:.95,depthWrite:false,blending:THREE.AdditiveBlending}));
neonM.position.y=.05;neonM.visible=false;neonM.renderOrder=3;car.add(neonM);
const CW=[1.9,1.9,2,2,1.9,2],CL=[3.7,4,4.5,4.1,4.1,4.8];
let neonPrev=null;
function neonSet(i){const n=NEON[i|0]||NEON[0];neonM.visible=!!n[1];if(n[1]){neonM.material.color.setHex(n[1]);neonM.scale.set(CW[CARI]+1.7,1,CL[CARI]+1.9)}}
const neonNow=()=>neonSet(neonPrev!=null?neonPrev:TN.neon[CARI]);
{const s0=setCar;setCar=function(i){s0(i);neonNow()}}
const flames=[];{const REAR=[-1.8,-2,-2.3,-2.1,-2.05,-2.4];for(const sx of[-.42,.42]){const f=new THREE.Mesh(new THREE.ConeGeometry(.17,1.5,8).rotateX(-Math.PI/2).translate(0,0,-.75),new THREE.MeshBasicMaterial({color:0xff9a2a,transparent:true,opacity:.9,depthWrite:false,blending:THREE.AdditiveBlending}));f.userData.sx=sx;f.visible=false;car.add(f);flames.push(f)}
 flames.upd=()=>{const on=NOS.on&&NOS.ch>0&&TN.nos&&!GS.onFoot&&!GAL.on;for(const f of flames){f.visible=on;if(on){f.position.set(f.userData.sx,.4,REAR[CARI]);const k=.7+Math.random()*.7;f.scale.set(k,k,.8+Math.random()*.8);f.material.color.setHex(Math.random()<.5?0xff9a2a:0x66aaff)}}}}
// NOS button (sits above HAND BRAKE) + blue screen edge while boosting
const nb=document.createElement('button');nb.id='nosBtn';nb.textContent='NOS';nb.style.cssText='position:fixed;display:none;z-index:8;border-radius:50%;border:3px solid #7cf;color:#fff;font:700 15px monospace;background:#123;box-shadow:0 0 14px #39f;touch-action:none;padding:0';document.body.appendChild(nb);
const fx=document.createElement('div');fx.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:4;opacity:0;transition:opacity .15s;background:radial-gradient(ellipse at center,transparent 55%,rgba(60,140,255,.45) 100%)';document.body.appendChild(fx);
const nosDown=e=>{if(e&&e.preventDefault)e.preventDefault();if(TN.nos&&NOS.ch>8)NOS.on=1},nosUp=()=>{NOS.on=0};
nb.addEventListener('pointerdown',nosDown);for(const t of['pointerup','pointercancel','pointerleave'])nb.addEventListener(t,nosUp);
addEventListener('keydown',e=>{if(e.key==='n'||e.key==='N')nosDown()});addEventListener('keyup',e=>{if(e.key==='n'||e.key==='N')nosUp()});
{const uc=updCozy;updCozy=function(dt){uc(dt);flames.upd();
  const show=TN.nos&&!GS.onFoot&&!GAL.on&&!menuOpen&&!busy;nb.style.display=show?'block':'none';
  if(show){const h=document.getElementById('hand').getBoundingClientRect(),d=h.width;nb.style.width=nb.style.height=d+'px';nb.style.left=h.left+'px';nb.style.top=(h.top-d-8)+'px';
   const p=Math.round(100*NOS.ch/nosCap());nb.style.background='linear-gradient(to top,#2a7cff '+p+'%,#0b1a30 '+p+'%)';nb.style.opacity=NOS.ch>8?1:.55}
  fx.style.opacity=(NOS.on&&NOS.ch>0&&TN.nos&&!GS.onFoot)?1:0}}
// saved custom colour comes back after a reload
{let t=0;const w=setInterval(()=>{if(window.READY===true||++t>200){clearInterval(w);if(TN.custOn&&TN.cust){paintC=TN.cust;applyPaint()}neonNow()}},100)}


/* ======== paint finishes (colour grading on top of the car's tint) ======== */
const FINS=['GLOSS','MATTE','CANDY','PEARL'];let finPrev=null;
const FIN=()=>finPrev!=null?finPrev:(TN.fin[CARI]|0);
function finRGB(c,f){const l=.3*c[0]+.59*c[1]+.11*c[2],cl=v=>Math.max(0,Math.min(1,v));
 if(f===1)return c.map(v=>cl((v+(l-v)*.4)*.82));
 if(f===2)return c.map(v=>cl((l+(v-l)*1.5)*.86));
 if(f===3)return[cl(c[0]*.7+.32),cl(c[1]*.7+.3),cl(c[2]*.7+.36)];
 return c}
{const ap=applyPaint;applyPaint=function(){const r=paintC;paintC=finRGB(r,FIN());try{ap()}finally{paintC=r}}}

/* ======== wheels: rim overlays, rim size, ride height ======== */
const RDES=['STOCK','5 SPOKE','6 SPOKE','MESH','TURBINE','SPLIT STAR','DEEP DISH'];
const RCOL=[['SILVER','#c9ccd2'],['GUNMETAL','#454a55'],['BLACK','#17171b'],['GOLD','#d9ab2b'],['WHITE','#f2f2f2'],['RED','#d01a2e'],['BLUE','#2060d8'],['CHROME','#eaf6ff']];
const RSZ=[.66,.78,.9],RSZN=['SMALL','MEDIUM','LARGE'],RHT=[-.07,-.035,0,.04],RHTN=['SLAMMED','LOW','STOCK','LIFTED'];
const RDEF={d:0,c:0,s:1,h:2};let rp=null;
const RIM=()=>rp||TN.rim[CARI]||RDEF;
function drawRim(d,col,N){const c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d'),m=N/2,R=m-1;
 x.fillStyle='#101014';x.beginPath();x.arc(m,m,R,0,7);x.fill();
 x.fillStyle=col;x.strokeStyle=col;x.lineCap='round';
 const ring=(r,w)=>{x.lineWidth=w;x.beginPath();x.arc(m,m,r,0,7);x.stroke()};
 const spokes=(n,w0,w1,twist)=>{for(let i=0;i<n;i++){x.save();x.translate(m,m);x.rotate(i*6.2832/n);x.beginPath();x.moveTo(-w0*N,0);x.lineTo(-w1*N,R*.86);x.lineTo(w1*N,R*.86+(twist||0));x.lineTo(w0*N,0);x.fill();x.restore()}};
 if(d===1){spokes(5,.05,.085);ring(R*.93,N*.06)}
 else if(d===2){spokes(6,.025,.04);ring(R*.93,N*.05)}
 else if(d===3){x.lineWidth=Math.max(1,N*.025);for(let r=.3;r<.9;r+=.2)ring(R*r,x.lineWidth);for(let i=0;i<14;i++){x.save();x.translate(m,m);x.rotate(i*6.2832/14);x.beginPath();x.moveTo(0,R*.12);x.lineTo(0,R*.9);x.stroke();x.restore()}ring(R*.93,N*.07)}
 else if(d===4){for(let i=0;i<12;i++){x.save();x.translate(m,m);x.rotate(i*6.2832/12);x.beginPath();x.moveTo(-N*.02,R*.1);x.quadraticCurveTo(R*.5,R*.45,R*.18,R*.9);x.lineTo(R*.3,R*.9);x.quadraticCurveTo(R*.75,R*.45,N*.03,R*.1);x.fill();x.restore()}ring(R*.93,N*.06)}
 else if(d===5){for(let i=0;i<10;i++){const a=i*6.2832/10;for(const o of[-.13,.13]){x.save();x.translate(m,m);x.rotate(a+o);x.beginPath();x.moveTo(-N*.02,0);x.lineTo(-N*.035,R*.88);x.lineTo(N*.035,R*.88);x.lineTo(N*.02,0);x.fill();x.restore()}}ring(R*.93,N*.05)}
 else if(d===6){x.beginPath();x.arc(m,m,R*.9,0,7);x.fill();x.fillStyle='rgba(0,0,0,.35)';for(const r of[.7,.45]){x.beginPath();x.arc(m,m,R*r,0,7);x.lineWidth=N*.035;x.strokeStyle='rgba(0,0,0,.35)';x.stroke()}x.fillStyle='#101014';for(let i=0;i<5;i++){const a=i*6.2832/5;x.beginPath();x.arc(m+Math.cos(a)*R*.3,m+Math.sin(a)*R*.3,N*.04,0,7);x.fill()}}
 x.fillStyle=col;x.beginPath();x.arc(m,m,R*.17,0,7);x.fill();x.fillStyle='#101014';x.beginPath();x.arc(m,m,R*.07,0,7);x.fill();
 if(col==='#eaf6ff'){const g=x.createLinearGradient(0,0,N,N);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(.5,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(80,110,160,.4)');x.globalCompositeOperation='source-atop';x.fillStyle=g;x.fillRect(0,0,N,N)}
 return c}
const rmats={};
function rimMat(d,c){const k=d+':'+c;if(!rmats[k]){const t=new THREE.CanvasTexture(drawRim(d,RCOL[c][1],64));t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;const m=new THREE.MeshBasicMaterial({map:t,alphaTest:.5,transparent:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});rmats[k]=m}return rmats[k]}
const RT={}; // per car: {kids:[{g,y0}], wheels:[{piv,y0,hold,ov,sx,xo,R,c1}], grp}
function rimTargets(i){
 if(RT[i]&&RT[i].w.length)return RT[i];
 const o={w:[],kids:[],grp:null};
 if(i===0){for(const w of wheels)o.w.push({piv:w,y0:w.position.y,hold:w,sx:w.position.x>0?1:-1,xo:.086,R:.28,c1:1});
  for(const k of c1Kids)if(!wheels.includes(k))o.kids.push({g:k,y0:k.position.y})}
 else{const g=i===1?fies:i===2?van:i===3?lrv:(window.NC&&NC.cars[i]&&NC.cars[i].grp);if(!g)return o;o.grp={g,y0:g.position.y};
  g.traverse(m=>{if(m.isMesh&&m.geometry.type==='CylinderGeometry'){const sp=m.parent;let dx=0;for(const s of sp.children)if(s.geometry&&s.geometry.type==='CircleGeometry'){s.geometry.computeBoundingBox();dx=s.geometry.boundingBox.max.x||s.geometry.boundingBox.min.x}
   if(!dx)return;const piv=sp.parent;o.w.push({piv,y0:piv.position.y,hold:sp,sx:dx>0?1:-1,xo:Math.abs(dx)+.004,R:m.geometry.parameters.radiusTop,c1:0})}})}
 RT[i]=o;return o}
let rimRetry=0;
function rimsApply(){const o=rimTargets(CARI),r=RIM(),dy=RHT[r.h]||0;
 if(!o.w.length){if(CARI>=4&&rimRetry++<8)setTimeout(rimsApply,1200);return}
 rimRetry=0;
 if(o.grp)o.grp.g.position.y=o.grp.y0+dy;for(const k of o.kids)k.g.position.y=k.y0+dy;
 for(const w of o.w){w.piv.position.y=w.c1?w.y0:w.y0-dy;
  if(!w.ov){const g=new THREE.CircleGeometry(w.R,20);g.rotateY(w.sx>0?Math.PI/2:-Math.PI/2);g.translate(w.sx*w.xo,0,0);w.ov=new THREE.Mesh(g,rimMat(1,0));w.ov.frustumCulled=false;w.hold.add(w.ov)}
  w.ov.visible=r.d>0;if(r.d>0){w.ov.material=rimMat(r.d,r.c);const f=RSZ[r.s];w.ov.scale.set(1,f,f)}}}


{const uc=updCozy;updCozy=function(dt){uc(dt);
  const l=U.uLight.value;for(const k in rmats)rmats[k].color.setRGB(l.x,l.y,l.z);
  if(CARI===0&&RT[0])for(const w of RT[0].w)if(w.ov)w.ov.rotation.x=-GS_SPIN}}
{const s0=setCar;setCar=function(i){s0(i);rimsApply()}}
setTimeout(rimsApply,800);setTimeout(rimsApply,7000);

/* ======== tuning screen ======== */
const css=document.createElement('style');css.textContent=`
#tn{display:none;position:fixed;inset:0;z-index:61;pointer-events:none;font-family:monospace;color:#dff;text-transform:uppercase;letter-spacing:.06em;-webkit-user-select:none;user-select:none}
#tn *{box-sizing:border-box}#tn .pe{pointer-events:auto}
#galUI.tuning #galP,#galUI.tuning #galT{display:none!important}
.tnPill{background:rgba(6,10,24,.78);border:1.5px solid #19e3ff;color:#bff;font:800 12px monospace;padding:8px 12px;border-radius:4px;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);letter-spacing:.08em}
.tnPill.on{background:#19e3ff;color:#031018;box-shadow:0 0 12px #19e3ff}
#tnBack{position:absolute;left:10px;top:8px;font-size:14px;padding:9px 16px;border-color:#ff2d95;color:#ffd0e6}
#tnCash{position:absolute;left:112px;top:8px;font:900 18px monospace;color:#ffe56a;text-shadow:0 0 8px #a80,0 2px 0 #000;padding:8px 6px}
#tnName{position:absolute;left:12px;top:56px;font:900 clamp(18px,4vw,30px) monospace;color:#fff;text-shadow:0 0 14px #19e3ff,0 3px 0 #000;letter-spacing:.12em;white-space:nowrap}
#tnName small{display:block;font:700 11px monospace;color:#9be;letter-spacing:.1em;text-shadow:0 1px 0 #000;margin-top:2px}
#tnStats{position:absolute;left:10px;bottom:52px;width:170px;background:rgba(6,10,24,.7);border-left:3px solid #ff2d95;padding:7px 9px;font:700 10px monospace}
#tnStats div.b{display:flex;align-items:center;gap:6px;margin:3px 0}#tnStats span.l{width:50px;color:#9cd}#tnStats span.v{flex:1;height:8px;background:#10182c;position:relative;border:1px solid #223}
#tnStats i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#19e3ff,#7af);}#tnStats u{position:absolute;top:0;bottom:0;background:#39ff3a;opacity:.9}
#tnViews{position:absolute;left:10px;bottom:8px;display:flex;gap:5px}#tnViews .tnPill{padding:7px 9px;font-size:11px}
#tnPanel{position:absolute;right:8px;top:8px;bottom:8px;width:min(44vw,470px);display:flex;flex-direction:column;background:linear-gradient(160deg,rgba(8,12,30,.92),rgba(14,6,26,.92));border:2px solid #19e3ff;box-shadow:0 0 22px rgba(25,227,255,.35),inset 0 0 40px rgba(255,45,149,.07);clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))}
#tnTabs{display:flex;overflow-x:auto;gap:4px;padding:8px 8px 6px;border-bottom:1px solid #19e3ff55;scrollbar-width:none}#tnTabs::-webkit-scrollbar{display:none}
#tnTabs .t{flex:0 0 auto;font:800 12px monospace;padding:9px 13px;color:#9bd;background:#0d1530;border:1px solid #2a3b6a;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%);letter-spacing:.08em}
#tnTabs .t.on{text-shadow:none;background:linear-gradient(#19e3ff,#0aa6c4);color:#021018;border-color:#bff;box-shadow:0 0 10px #19e3ff}#tnTabs .t.soon{opacity:.38}
#tnBody{flex:1;overflow-y:auto;padding:9px;-webkit-overflow-scrolling:touch;scrollbar-width:thin;scrollbar-color:#19e3ff #0a1020}
.tnGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}
.tnSw{position:relative;aspect-ratio:1;border:2px solid #2a3b6a;border-radius:4px;display:flex;align-items:flex-end;justify-content:center;font:800 9px monospace;color:#fff;text-shadow:0 1px 2px #000,0 0 3px #000;padding-bottom:3px;background-clip:padding-box}
.tnSw.sel{border-color:#fff;box-shadow:0 0 0 2px #19e3ff,0 0 14px #19e3ff}.tnSw.cur::after{content:'✔';position:absolute;top:2px;right:4px;color:#7fff7f;font-size:13px;text-shadow:0 0 4px #000}
.tnSw .p{position:absolute;top:2px;left:3px;font-size:9px;color:#ffe56a}
.tnRow{display:flex;align-items:center;gap:8px;padding:9px 10px;margin-bottom:6px;background:#0c1430;border:1.5px solid #243667;border-left:4px solid #3a5aa8;border-radius:3px}
.tnRow.sel{border-color:#19e3ff;background:#10214a;box-shadow:0 0 12px rgba(25,227,255,.45)}.tnRow.cur{border-left-color:#7fff7f}
.tnRow .n{flex:1;font:800 13px monospace;color:#fff;letter-spacing:.06em}.tnRow .n small{display:block;font:600 10px monospace;color:#8ab;margin-top:2px;letter-spacing:.04em}
.tnRow .pr{font:900 13px monospace;color:#ffe56a;white-space:nowrap}.tnRow .pr.no{color:#ff6a6a}.tnRow .pr.ok{color:#7fff7f}
.tnPips{display:flex;gap:3px;margin-top:4px}.tnPips b{width:16px;height:6px;background:#1a2547;border:1px solid #345}.tnPips b.f{background:#19e3ff;box-shadow:0 0 6px #19e3ff}
#tnFoot{border-top:1px solid #19e3ff55;padding:8px;display:flex;align-items:center;gap:8px}
#tnMsg{flex:1;font:700 11px monospace;color:#cfe;min-height:30px;display:flex;align-items:center;line-height:1.25}
#tnBuy{flex:0 0 auto;min-width:118px;font:900 15px monospace;padding:12px 14px;color:#021018;background:linear-gradient(#ffe56a,#ffb82a);border:2px solid #fff;clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%);letter-spacing:.08em;box-shadow:0 0 14px rgba(255,200,50,.6)}
#tnBuy.dis{background:#26304f;color:#7a89b5;border-color:#3a4a7a;box-shadow:none}
.tnSl{display:flex;align-items:center;gap:8px;margin:7px 0;font:800 11px monospace;color:#9cd}.tnSl span{width:42px}.tnSl input{flex:1;height:26px;accent-color:#19e3ff}
.tnH{font:900 11px monospace;color:#ff7ab8;margin:10px 0 6px;letter-spacing:.14em}
@media (max-aspect-ratio:1/1){
 #tnPanel{left:6px;right:6px;top:auto;bottom:6px;width:auto;height:50vh}.tnGrid{grid-template-columns:repeat(5,1fr)}
 #tnStats{display:none}#tnViews{bottom:calc(50vh + 12px)}#tnName{top:54px;font-size:20px}}
@media (max-height:420px) and (min-aspect-ratio:1/1){.tnGrid{grid-template-columns:repeat(5,1fr)}#tnPanel{width:min(48vw,500px)}.tnRow{padding:6px 8px;margin-bottom:4px}#tnBuy{padding:9px 12px}#tnName{top:46px}}
`;document.head.appendChild(css);
const root=document.createElement('div');root.id='tn';document.body.appendChild(root);
const TABS=[['cars','CARS'],['paint','PAINT'],['perf','PERFORMANCE'],['neon','UNDERGLOW'],['wheels','WHEELS'],['body','BODY KITS',1],['vinyl','VINYLS',1]];
const PERF=[
 {k:'eng',n:'ENGINE',d:['STOCK','STAGE 1','STAGE 2','STAGE 3'],p:()=>ENGP,max:3,get:()=>ENG,set:v=>{ENG=v}},
 {k:'trb',n:'TURBO',d:['NONE','STAGE 1','STAGE 2','STAGE 3'],p:()=>[90,160,260],max:3,get:()=>TN.trb|0,set:v=>{TN.trb=v}},
 {k:'tyr',n:'GRIP TYRES',d:['STOCK','STAGE 1','STAGE 2'],p:()=>TYRP,max:2,get:()=>TYR,set:v=>{TYR=v}},
 {k:'brk',n:'BRAKES',d:['STOCK','SPORT','RACE','CARBON'],p:()=>[35,70,120],max:3,get:()=>TN.brk|0,set:v=>{TN.brk=v}},
 {k:'nos',n:'NITROUS KIT',d:['NOT FITTED','FITTED'],p:()=>[150],max:1,get:()=>TN.nos|0,set:v=>{TN.nos=v},desc:'HOLD THE NOS BUTTON FOR A BIG BOOST'},
 {k:'tank',n:'NITROUS TANK',d:['STANDARD','LARGE','XL'],p:()=>[100,160],max:2,get:()=>TN.tank|0,set:v=>{TN.tank=v},req:()=>TN.nos,desc:'MORE BOOST BEFORE IT RUNS DRY'}];
const CPRs=i=>(typeof CPR==='function'?CPR(i):[0,220,380,420,480,400][i]);
const S={tab:'cars',sel:null,commit:null,msg:'',sl:[.6,.8,.5],view:'34'};let on=0;
const cashTxt=()=>'£'+Math.round(cash);

function stats(){return{spd:MAXV*2.237,acc:ACCM,grp:GRIPM,brk:1+(TN.brk|0)*.35,nos:TN.nos?(100+50*(TN.tank|0)):0}}
function statsIf(k,v){const o={ENG,TYR,trb:TN.trb,brk:TN.brk};if(k==='eng')ENG=v;else if(k==='tyr')TYR=v;else if(k==='trb')TN.trb=v;else if(k==='brk')TN.brk=v;applyUpg();const s=stats();ENG=o.ENG;TYR=o.TYR;TN.trb=o.trb;TN.brk=o.brk;applyUpg();return s}
function bars(prev){const s=stats(),n=[['SPEED',s.spd/130,prev&&prev.spd/130],['ACCEL',s.acc/2.6,prev&&prev.acc/2.6],['GRIP',s.grp/2,prev&&prev.grp/2],['BRAKE',s.brk/2.2,prev&&prev.brk/2.2],['NOS',s.nos/200,null]];
 return n.map(([l,v,p])=>`<div class="b"><span class="l">${l}</span><span class="v"><i style="width:${Math.min(100,v*100)}%"></i>${p&&p>v+.003?`<u style="left:${Math.min(100,v*100)}%;width:${Math.min(100-v*100,(p-v)*100)}%"></u>`:''}</span></div>`).join('')}

function carName(){return CARN[CARI]}
function head(prev){
 $q('#tnName').innerHTML=carName()+'<small>'+CARSD[CARI]+'</small>';
 $q('#tnCash').textContent=cashTxt();
 $q('#tnStats').innerHTML=bars(prev);
}
function setMsg(t){S.msg=t;const m=$q('#tnMsg');if(m)m.textContent=t}
function buyBtn(label,fn,dis){const b=$q('#tnBuy');b.textContent=label||'—';b.classList.toggle('dis',!!dis||!fn);b.onclick=fn&&!dis?fn:null;b.style.visibility=label?'visible':'hidden'}
function flash(ok){beep(ok?660:200,.1,ok?'square':'sawtooth',.06);if(ok)setTimeout(()=>beep(990,.14,'square',.06),110)}
function pay(n){if(cash<n){setMsg('NOT ENOUGH CASH');flash(0);return false}cash-=n;return true}

/* ---- tab: cars ---- */
function tabCars(){const B=$q('#tnBody');B.innerHTML='';
 for(let i=0;i<6;i++){const own=OWN.car[i],cur=i===S.commit.car,r=document.createElement('div');r.className='tnRow'+(CARI===i?' sel':'')+(cur?' cur':'');
  r.innerHTML=`<div class="n">${CARN[i]}<small>${CARSD[i]}</small></div><div class="pr ${cur?'ok':own?'ok':cash>=CPRs(i)?'':'no'}">${cur?'DRIVING':own?'OWNED':'£'+CPRs(i)}</div>`;
  r.onclick=()=>{setCar(i);neonPrev=null;neonNow();tabCars();head();carBtn()};B.appendChild(r)}
 carBtn()}
function carBtn(){const i=CARI,own=OWN.car[i],cur=i===S.commit.car;
 if(cur)buyBtn('DRIVING',null,1);else if(own)buyBtn('DRIVE THIS',()=>{S.commit.car=i;S.commit.paint=paintC;setMsg('NOW DRIVING '+CARN[i]);flash(1);tabCars();head()});
 else buyBtn('BUY £'+CPRs(i),()=>{if(!pay(CPRs(i)))return;OWN.car[i]=1;S.commit.car=i;S.commit.paint=paintC;setMsg('NEW CAR! '+CARN[i]);flash(1);tabCars();head()},cash<CPRs(i));
 if(!S.msg)setMsg('TAP A CAR TO PREVIEW IT')}

/* ---- tab: paint ---- */
const pName=i=>(CARI===3&&!i?'STOCK GREEN':CARI>=4&&!i?'STOCK SILVER':PN[i]);
function hsl(h,s,l){const a=s*Math.min(l,1-l),f=n=>{const k=(n+h*12)%12;return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return[f(0),f(8),f(4)]}
function tabPaint(){const B=$q('#tnBody');B.innerHTML='<div class="tnH">COLOURS · £'+PAINTP+' EACH, FREE ONCE OWNED</div><div class="tnGrid"></div><div class="tnH">CUSTOM MIX · £15</div><div id="tnCu"></div><div class="tnH">FINISH · £30 EACH, FREE ONCE OWNED</div><div class="tnGrid" id="tnFin"></div>';
 const g=B.querySelector('.tnGrid');
 PCOL.forEach((c,i)=>{const d=document.createElement('div'),cur=S.commit.paint===c[1],sel=paintC===c[1];d.className='tnSw'+(sel?' sel':'')+(cur?' cur':'');d.style.background=c[0];d.innerHTML=(OWN.paint[i]?'':'<span class="p">£'+PAINTP+'</span>')+pName(i).replace('STOCK ','');
  d.onclick=()=>{paintC=c[1];applyPaint();S.sel=i;tabPaint();paintBtn();gv(.9,1.3,6.4,30)};g.appendChild(d)});
 const cu=B.querySelector('#tnCu');cu.innerHTML=['HUE','SAT','LIGHT'].map((l,k)=>`<div class="tnSl"><span>${l}</span><input type="range" min="0" max="100" value="${Math.round(S.sl[k]*100)}" data-k="${k}"></div>`).join('');
 cu.querySelectorAll('input').forEach(inp=>{inp.oninput=()=>{S.sl[+inp.dataset.k]=inp.value/100;const c=hsl(S.sl[0],S.sl[1],.12+S.sl[2]*.76);paintC=c;applyPaint();S.sel='c';paintBtn()}});
 const fg=B.querySelector('#tnFin');
 FINS.forEach((n,i)=>{const d=document.createElement('div'),cur=(TN.fin[CARI]|0)===i,sel=FIN()===i,rgb=finRGB(paintC,i).map(v=>Math.round(v*255));d.className='tnSw'+(sel?' sel':'')+(cur?' cur':'');d.style.background='rgb('+rgb+')';d.style.gridColumn='span 1';
  d.innerHTML=(i===0||TN.fown[CARI+':'+i]?'':'<span class="p">£30</span>')+n;d.onclick=()=>{finPrev=i;applyPaint();tabPaint();gv(.9,1.3,6.4,30)};fg.appendChild(d)});
 paintBtn()}
function paintBtn(){
 const ix=PCOL.findIndex(c=>c[1]===paintC),fin=FIN(),cf=TN.fin[CARI]|0,cc=paintC!==S.commit.paint,fc=fin!==cf;
 let cost=0;if(cc)cost+=ix>=0?(OWN.paint[ix]?0:PAINTP):15;if(fc&&fin&&!TN.fown[CARI+':'+fin])cost+=30;
 const nm=(ix>=0?pName(ix):'CUSTOM MIX')+' · '+FINS[fin];
 head();
 if(!cc&&!fc){setMsg(nm+' · ON YOUR CAR');buyBtn('WEARING',null,1);return}
 setMsg(nm+(cost?' · £'+cost:' · OWNED'));
 buyBtn(cost?'BUY £'+cost:'PAINT IT',()=>{if(cost&&!pay(cost))return;
  if(cc){if(ix>=0){OWN.paint[ix]=1;TN.custOn=0}else{TN.cust=paintC;TN.custOn=1}S.commit.paint=paintC}
  if(fc){TN.fin[CARI]=fin;if(fin)TN.fown[CARI+':'+fin]=1;finPrev=null}
  save();setMsg('SPRAYED!');flash(1);tabPaint();head()},cash<cost)}

/* ---- tab: performance ---- */
function tabPerf(){const B=$q('#tnBody');B.innerHTML='';
 PERF.forEach((it,idx)=>{const lv=it.get(),nx=lv<it.max?it.p()[lv]:null,locked=it.req&&!it.req(),r=document.createElement('div');r.className='tnRow'+(S.sel===idx?' sel':'')+(lv>=it.max?' cur':'');
  let pips='';for(let k=0;k<it.max;k++)pips+=`<b class="${k<lv?'f':''}"></b>`;
  r.innerHTML=`<div class="n">${it.n}<small>${locked?'NEEDS NITROUS KIT':it.d[lv]+(lv<it.max?' → '+it.d[lv+1]:' · MAXED')}${it.desc&&!locked?'<br>'+it.desc:''}</small><div class="tnPips">${pips}</div></div><div class="pr ${lv>=it.max?'ok':locked?'no':cash>=nx?'':'no'}">${lv>=it.max?'MAXED':locked?'LOCKED':'£'+nx}</div>`;
  r.onclick=()=>{S.sel=idx;tabPerf();perfSel()};B.appendChild(r)});
 if(S.sel==null)S.sel=0;perfSel(true)}
function perfSel(init){const it=PERF[S.sel],lv=it.get(),nx=lv<it.max?it.p()[lv]:null,locked=it.req&&!it.req();
 head(!locked&&lv<it.max&&(it.k==='eng'||it.k==='tyr'||it.k==='trb'||it.k==='brk')?statsIf(it.k,lv+1):null);
 if(locked){setMsg('FIT THE NITROUS KIT FIRST');buyBtn('LOCKED',null,1);return}
 if(lv>=it.max){setMsg(it.n+' · MAXED OUT');buyBtn('MAXED',null,1);return}
 setMsg(it.n+' · '+it.d[lv+1]+' · £'+nx+(it.k==='nos'?' · BUTTON APPEARS WHILE DRIVING':''));
 buyBtn('BUY £'+nx,()=>{if(!pay(nx))return;it.set(lv+1);applyUpg();NOS.ch=nosCap();save();setMsg(it.n+' UPGRADED!');flash(1);tabPerf();perfSel()},cash<nx)}

/* ---- tab: wheels ---- */
const rimThumb={};const thumb=(d,c)=>{const k=d+':'+c;return rimThumb[k]||(rimThumb[k]=drawRim(d,RCOL[c][1],48).toDataURL())};
function rimCost(){const r=RIM(),c=TN.rim[CARI]||RDEF;let t=0;if(r.d>0){if(r.d!==c.d&&!TN.rown['d'+r.d])t+=70;if(r.c!==c.c&&!TN.rown['c'+r.c]&&r.c)t+=10}if(r.s!==c.s||r.h!==c.h)t+=20;return t}
function rimChanged(){const r=RIM(),c=TN.rim[CARI]||RDEF;return r.d!==c.d||r.c!==c.c||r.s!==c.s||r.h!==c.h}
function rimSet(k,v){const r=Object.assign({},RIM());r[k]=v;rp=r;rimsApply();tabWheels(1)}
function tabWheels(keep){const B=$q('#tnBody'),top=B.scrollTop,r=RIM(),c=TN.rim[CARI]||RDEF;
 B.innerHTML='<div class="tnH">RIM DESIGN · £70, FREE ONCE OWNED</div><div class="tnGrid" id="rd"></div><div class="tnH">RIM COLOUR · £10, SILVER FREE</div><div class="tnGrid" id="rc"></div><div class="tnH">STANCE · £20 TO CHANGE</div><div id="rs"></div>';
 const gd=B.querySelector('#rd'),gc=B.querySelector('#rc');
 RDES.forEach((n,i)=>{const d=document.createElement('div');d.className='tnSw'+(r.d===i?' sel':'')+(c.d===i?' cur':'');d.style.background=i?'#0c1020 url('+thumb(i,r.c)+') center/78% no-repeat':'#101830';d.style.imageRendering='pixelated';d.innerHTML=(i&&!TN.rown['d'+i]?'<span class="p">£70</span>':'')+n.replace('SPLIT ','');d.onclick=()=>rimSet('d',i);gd.appendChild(d)});
 RCOL.forEach((n,i)=>{const d=document.createElement('div');d.className='tnSw'+(r.c===i?' sel':'')+(c.c===i?' cur':'');d.style.background=n[1];d.style.color=['#f2f2f2','#eaf6ff','#c9ccd2','#d9ab2b'].includes(n[1])?'#000':'#fff';d.style.textShadow='none';d.innerHTML=(i&&!TN.rown['c'+i]?'<span class="p" style="color:#a50">£10</span>':'')+n[0];d.onclick=()=>rimSet('c',i);gc.appendChild(d)});
 B.querySelector('#rs').innerHTML=`<div class="tnSl"><span style="width:62px">SIZE</span><input type="range" min="0" max="2" step="1" value="${r.s}" id="rsS"><b style="width:62px;color:#fff">${RSZN[r.s]}</b></div><div class="tnSl"><span style="width:62px">HEIGHT</span><input type="range" min="0" max="3" step="1" value="${r.h}" id="rsH"><b style="width:62px;color:#fff">${RHTN[r.h]}</b></div>`;
 B.querySelector('#rsS').onchange=e=>rimSet('s',+e.target.value);B.querySelector('#rsH').onchange=e=>rimSet('h',+e.target.value);
 B.querySelector('#rsS').oninput=e=>{rp=Object.assign({},RIM(),{s:+e.target.value});rimsApply()};B.querySelector('#rsH').oninput=e=>{rp=Object.assign({},RIM(),{h:+e.target.value});rimsApply()};
 if(keep)B.scrollTop=top;wheelsBtn()}
function wheelsBtn(){const r=RIM(),cost=rimCost();head();
 if(!rimChanged()){setMsg((r.d?RDES[r.d]+' · '+RCOL[r.c][0]+' · ':'STOCK WHEELS · ')+RSZN[r.s]+' · '+RHTN[r.h]);buyBtn('FITTED',null,1);return}
 setMsg((r.d?RDES[r.d]+' · '+RCOL[r.c][0]:'STOCK WHEELS')+' · '+RSZN[r.s]+' · '+RHTN[r.h]+(cost?' · £'+cost:''));
 buyBtn(cost?'BUY £'+cost:'FIT IT',()=>{if(cost&&!pay(cost))return;if(r.d)TN.rown['d'+r.d]=1;if(r.d&&r.c)TN.rown['c'+r.c]=1;TN.rim[CARI]=Object.assign({},r);rp=null;save();setMsg('WHEELS FITTED!');flash(1);tabWheels(1);head()},cash<cost)}

/* ---- tab: underglow ---- */
function tabNeon(){const B=$q('#tnBody');B.innerHTML='<div class="tnH">UNDERGLOW · £45 PER COLOUR, FREE ONCE OWNED</div><div class="tnGrid"></div>';
 const g=B.querySelector('.tnGrid'),cur=TN.neon[CARI]|0,sel=neonPrev!=null?neonPrev:cur;
 NEON.forEach((n,i)=>{const d=document.createElement('div'),own=i===0||TN.nown[CARI+':'+i];d.className='tnSw'+(i===sel?' sel':'')+(i===cur?' cur':'');
  d.style.background=n[1]?`radial-gradient(circle,#fff 0,#${n[1].toString(16).padStart(6,'0')} 45%,#0a1020 100%)`:'#101830';d.innerHTML=(own?'':'<span class="p">£45</span>')+n[0].replace('ICE ','');
  d.onclick=()=>{neonPrev=i;neonNow();tabNeon()};g.appendChild(d)});
 neonBtn()}
function neonBtn(){const cur=TN.neon[CARI]|0,sel=neonPrev!=null?neonPrev:cur,own=sel===0||TN.nown[CARI+':'+sel];head();
 setMsg(NEON[sel][0]+(sel===cur?' · ON YOUR CAR':own?' · OWNED':' · £45')+' · BEST AT NIGHT');
 if(sel===cur)buyBtn('FITTED',null,1);else buyBtn(own?'FIT IT':'BUY £45',()=>{if(!own&&!pay(45))return;TN.nown[CARI+':'+sel]=1;TN.neon[CARI]=sel;neonPrev=null;save();setMsg('UNDERGLOW FITTED');flash(1);tabNeon()},!own&&cash<45)}

function tabSoon(l){const B=$q('#tnBody');B.innerHTML=`<div class="tnRow"><div class="n">${l}<small>COMING SOON</small></div></div>`;buyBtn('',null,1);setMsg(l+' ARE COMING IN A LATER UPDATE')}

/* ---- screen plumbing ---- */
const ZK=()=>innerWidth>innerHeight?1.18:1.35,gv=(a,h,d,f)=>galView(a,h,h>8?d:d*ZK(),f);
const VIEWS={'34':[.62,1.5,6.6,30],front:[0,.9,7.5,28],side:[1.5708,.9,8,28],rear:[3.1416,.9,7.5,28]};
function tabs(){const T=$q('#tnTabs');T.innerHTML='';for(const[k,l,soon]of TABS){const b=document.createElement('div');b.className='t pe'+(S.tab===k?' on':'')+(soon?' soon':'');b.textContent=l;b.onclick=()=>go(k);T.appendChild(b)}}
function go(k){
 // leaving a tab: drop any un-bought preview
 if(S.tab==='paint'&&k!=='paint'){paintC=S.commit.paint;finPrev=null;applyPaint()}
 if(S.tab==='wheels'&&k!=='wheels'){rp=null;rimsApply()}
 if(S.tab==='neon'&&k!=='neon'){neonPrev=null;neonNow()}
 S.tab=k;S.msg='';tabs();$q('#tnBody').scrollTop=0;
 GAL.lt=k==='neon'?'NIGHT':'STUDIO';GAL.spin=k==='cars'?1:0;
 if(k==='cars')gv(...VIEWS['34']);else if(k==='paint')gv(.9,1.3,6.4,30);else if(k==='perf')gv(.2,.9,6.8,28);else if(k==='neon')gv(.5,.25,5.5,40);else if(k==='wheels')gv(1.25,.35,5.2,34);
 ({cars:tabCars,paint:tabPaint,perf:()=>{S.sel=0;tabPerf()},neon:tabNeon,wheels:tabWheels}[k]||(()=>tabSoon((TABS.find(t=>t[0]===k)||[])[1])))();
 if(k==='cars'||k==='paint'||k==='neon')head()}
function build(){
 root.innerHTML=`<div id="tnBack" class="tnPill pe">◀ BACK</div><div id="tnCash"></div><div id="tnName"></div><div id="tnStats"></div>
 <div id="tnViews" class="pe"><div class="tnPill" data-v="34">3/4</div><div class="tnPill" data-v="front">FRONT</div><div class="tnPill" data-v="side">SIDE</div><div class="tnPill" data-v="rear">REAR</div><div class="tnPill" data-v="night">NIGHT</div><div class="tnPill" data-v="spin">SPIN</div></div>
 <div id="tnPanel" class="pe"><div id="tnTabs"></div><div id="tnBody"></div><div id="tnFoot"><div id="tnMsg"></div><button id="tnBuy" class="pe"></button></div></div>`;
 $q('#tnBack').onclick=closeTune;
 root.querySelectorAll('#tnViews .tnPill').forEach(b=>b.onclick=()=>{const v=b.dataset.v;
  if(VIEWS[v]){gv(...VIEWS[v]);GAL.spin=0}else if(v==='night'){GAL.lt=GAL.lt==='NIGHT'?'STUDIO':'NIGHT';b.classList.toggle('on',GAL.lt==='NIGHT')}else if(v==='spin'){GAL.spin=GAL.spin?0:1;b.classList.toggle('on',!!GAL.spin)}});}
function openTune(tab){
 if(on||GAL.on)return;
 if(GS.inside&&SHOPCUR){try{closeShop()}catch(e){}try{leaveShop(true)}catch(e){}}
 on=1;S.commit={car:CARI,paint:paintC};S.msg='';S.sel=null;neonPrev=null;
 openGallery();GAL.mode=null;galUI.classList.add('tuning');
 const gx=document.getElementById('galX');if(gx)gx.style.display='none';
 build();root.style.display='block';GAL.lt='STUDIO';
 go(tab||'cars')}
function closeTune(){
 if(!on)return;on=0;
 // undo anything previewed but not bought
 paintC=S.commit.paint;finPrev=null;rp=null;applyPaint();
 neonPrev=null;GAL.sv.car=S.commit.car;GAL.sv.paint=S.commit.paint;
 root.style.display='none';galUI.classList.remove('tuning');save();
 closeGallery();neonNow();
 if(TN.custOn&&TN.cust&&paintC===TN.cust)applyPaint()}
window.openTune=openTune;window.closeTune=closeTune;
// car sits in the free part of the screen, the menu on the other
{const uc=updateCam;updateCam=function(dt){uc(dt);
  if(on&&GAL.on){const W=innerWidth,H=innerHeight,pn=$q('#tnPanel').getBoundingClientRect();
   if(W>H*1.0)cam.setViewOffset(W,H,pn.width/2+4,0,W,H);else cam.setViewOffset(W,H,0,pn.height/2+4,W,H)}
  else if(cam.view&&cam.view.enabled)cam.clearViewOffset()}}
// keep the first-person overlay etc. out of the way and make sure leaving by any route cleans up
{const c0=closeGallery;closeGallery=function(){if(on){on=0;root.style.display='none';galUI.classList.remove('tuning')}c0()}}
// Joe's garage + the old spray booth now open the tuning screen
{const o0=openShop;openShop=function(m){if(m==='garage2'){openTune('perf');return}o0.apply(this,arguments)}}
garagePaint=function(){openTune('paint')};
})();
