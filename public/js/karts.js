/* ===== COZY KARTS: go-kart track north of High Street (2 min walk from the green) =====
   Self-contained: relies on globals from app.js (scene, GS, P, car, man, step, ctx, updateCar, fade, toast, beep,
   cash, JOB, carry, applyUpg, setLabels, wmat, mRoad, mObj, Builder, pbox, pcyl, quadXZ, txtTex, COL, G0, HW...). */
(function(){
const CX=-95,CZ=-58,SX=.94,LAPS=4,HW=5.0,BAR=6.8,FEE=5,PRIZE=[40,20,10,0];
const KF=-1,KIOSK={x:-60,z:-24},PARK={x0:-87,x1:-64,z0:-29,z1:-19},STRIP={x:-86,z0:-5.3,z1:-18.5,hw:3.8}; // the strip squeezes through the gap between two High Street houses (x -91.2..-80.8)
const KT={on:0,state:'idle',cd:0,t:0,tot:0,idx:0,lapsDone:0,lapT:0,laps:[],best:0,bestRace:0,ai:[],back:0,rank:1,hudT:0,saved:null,bigT:0};
try{const d=JSON.parse(localStorage.getItem('c1kart')||'null');if(d){KT.best=d.lap||0;KT.bestRace=d.race||0}}catch(e){czErr(e,"karts.js")}
function saveBest(){try{localStorage.setItem('c1kart',JSON.stringify({lap:KT.best,race:KT.bestRace}))}catch(e){czErr(e,"karts.js")}}

/* ---------- track centre-line (closed Catmull-Rom, resampled every ~1.5 m) ---------- */
const CP=[[-30,20],[-8,20],[14,20],[34,20],[45,12],[47,-2],[42,-14],[32,-22],[22,-20],[17,-8],[11,2],[3,3],[-3,-6],[-5,-18],[-14,-24],[-26,-24],[-36,-22],[-43,-14],[-45,-2],[-40,10],[-36,18]].map(p=>[CX+p[0]*SX,CZ+p[1]]);
const cr=(a,b,c,d,t)=>{const t2=t*t,t3=t2*t;return[0,1].map(k=>.5*(2*b[k]+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3))};
let dense=[];{const n=CP.length;for(let i=0;i<n;i++)for(let k=0;k<40;k++)dense.push(cr(CP[(i+n-1)%n],CP[i],CP[(i+1)%n],CP[(i+2)%n],k/40))}
{let bi=0,bd=1e9;dense.forEach((p,i)=>{const d=Math.hypot(p[0]-CX,p[1]-(CZ+20));if(d<bd){bd=d;bi=i}});dense=dense.slice(bi).concat(dense.slice(0,bi))}
const cum=[0];for(let i=1;i<=dense.length;i++){const a=dense[i-1],b=dense[i%dense.length];cum.push(cum[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1]))}
const LEN=cum[dense.length],N=Math.round(LEN/1.5),SP=LEN/N,S=[];
{let j=0;for(let i=0;i<N;i++){const t=i*SP;while(cum[j+1]<t)j++;const a=dense[j],b=dense[(j+1)%dense.length],f=(t-cum[j])/(cum[j+1]-cum[j]||1);S.push({x:a[0]+(b[0]-a[0])*f,z:a[1]+(b[1]-a[1])*f})}}
for(let i=0;i<N;i++){const a=S[(i+N-1)%N],b=S[(i+1)%N],l=Math.hypot(b.x-a.x,b.z-a.z)||1;S[i].tx=(b.x-a.x)/l;S[i].tz=(b.z-a.z)/l;S[i].nx=-S[i].tz;S[i].nz=S[i].tx;S[i].a=Math.atan2(S[i].tx,S[i].tz)}
{const raw=S.map((s,i)=>{let d=S[(i+1)%N].a-s.a;d=Math.atan2(Math.sin(d),Math.cos(d));return Math.abs(d)/SP});for(let i=0;i<N;i++){let m=0;for(let k=-4;k<=4;k++)m=Math.max(m,raw[(i+k+N)%N]);S[i].k=m}}
const VTOP=23,ALAT=30;
for(const s of S)s.vm=Math.min(VTOP,Math.sqrt(ALAT/Math.max(s.k,1e-4)));
function posAt(s,lat){s=((s%LEN)+LEN)%LEN;const f0=s/SP,i=Math.floor(f0)%N,f=f0-Math.floor(f0),a=S[i],b=S[(i+1)%N];
 const x=a.x+(b.x-a.x)*f,z=a.z+(b.z-a.z)*f;let nx=a.nx+(b.nx-a.nx)*f,nz=a.nz+(b.nz-a.nz)*f;const l=Math.hypot(nx,nz)||1;nx/=l;nz/=l;
 return{x:x+nx*lat,z:z+nz*lat,psi:Math.atan2(nz,-nx)}}

/* ---------- surface: tarmac counts as road, so the kart gets full grip there ---------- */
function kartDist(x,z){
 if(x<-165||x>-28||z<-104||z>-3)return 1e9;
 if(x>PARK.x0&&x<PARK.x1&&z>PARK.z0&&z<PARK.z1)return 0;
 if(Math.abs(x-STRIP.x)<STRIP.hw&&z<STRIP.z0&&z>STRIP.z1-1)return 0;
 let b=1e9;for(let i=0;i<N;i+=2){const s=S[i],d=(x-s.x)*(x-s.x)+(z-s.z)*(z-s.z);if(d<b)b=d}return Math.sqrt(b)}
{const d0=dAt;dAt=function(x,z){const d=d0(x,z);if(d<4.7)return d;return kartDist(x,z)<HW+.3?Math.min(d,4.0):d}}

/* ---------- scenery ---------- */
const B=new Builder(2),B2=new Builder(3),Y=G0;
const ASP=[.27,.27,.3],RED=[.85,.12,.1],WHT=[.92,.92,.88],BLK=[.1,.1,.12];
for(let i=0;i<N;i++){const a=S[i],b=S[(i+1)%N];
 const L=(o,s)=>[s.x+s.nx*o,s.z+s.nz*o];
 quadXZ(B,L(-HW,a),L(HW,a),L(HW,b),L(-HW,b),ASP,Y+.06);
 const kc=(i>>1)%2?RED:WHT;
 for(const sd of[-1,1]){quadXZ(B,L(sd*HW,a),L(sd*(HW+.55),a),L(sd*(HW+.55),b),L(sd*HW,b),kc,Y+.065);
  quadXZ(B,L(sd*(HW-.4),a),L(sd*(HW-.22),a),L(sd*(HW-.22),b),L(sd*(HW-.4),b),WHT,Y+.07)}}
{const s0=S[0],P=(u,v)=>[s0.x+s0.tx*u+s0.nx*v,s0.z+s0.tz*u+s0.nz*v];
 for(let r=0;r<2;r++)for(let c=0;c<10;c++)quadXZ(B,P(r*.8,-HW+c),P(r*.8,-HW+c+1),P(r*.8+.8,-HW+c+1),P(r*.8+.8,-HW+c),(r+c)%2?BLK:WHT,Y+.08);
 for(const row of[-2.6,-6.6])for(const lat of[-1.9,1.9])quadXZ(B,P(row,lat-.9),P(row,lat+.9),P(row-.14,lat+.9),P(row-.14,lat-.9),WHT,Y+.075)}
// car park + access strip + bay lines
quadXZ(B,[PARK.x0,PARK.z0],[PARK.x1,PARK.z0],[PARK.x1,PARK.z1],[PARK.x0,PARK.z1],[.3,.3,.32],Y+.055);
quadXZ(B,[STRIP.x-STRIP.hw,STRIP.z0],[STRIP.x+STRIP.hw,STRIP.z0],[STRIP.x+STRIP.hw,STRIP.z1],[STRIP.x-STRIP.hw,STRIP.z1],[.3,.3,.32],Y+.055);
for(let x=PARK.x0+3;x<PARK.x1;x+=4)quadXZ(B,[x,PARK.z0],[x+.14,PARK.z0],[x+.14,PARK.z0+4.5],[x,PARK.z0+4.5],WHT,Y+.08);
// tyre walls (visual + colliders)
for(let i=0;i<N;i+=2){const s=S[i];for(const sd of[-1,1]){const x=s.x+s.nx*sd*BAR,z=s.z+s.nz*sd*BAR;
 pcyl(B2,x,Y,z,.6,.5,6,BLK);pcyl(B2,x,Y+.5,z,.6,.5,6,(i>>1)%2?RED:WHT);COL.push([x,z,.62])}}
// start gantry
{const s0=S[0],e=HW+1.4,rot=Math.atan2(s0.nx,s0.nz);
 for(const sd of[-1,1])pbox(B2,s0.x+s0.nx*e*sd,Y,s0.z+s0.nz*e*sd,.4,5.4,.4,[.78,.78,.82],0);
 pbox(B2,s0.x,Y+5.2,s0.z,.7,.7,2*e+.6,[.2,.2,.24],rot);
 const bn=new THREE.Mesh(new THREE.PlaneGeometry(9,1.5),new THREE.MeshBasicMaterial({map:txtTex(512,86,'#14141a','#ffd23a','COZY KARTS',46),side:THREE.DoubleSide}));
 bn.position.set(s0.x,Y+6.15,s0.z);bn.rotation.y=Math.atan2(s0.tx,s0.tz);scene.add(bn)}
// kiosk
{const x=KIOSK.x,z=KIOSK.z;
 pbox(B2,x,Y,z,4.5,2.8,5.6,[.82,.22,.16],0);pbox(B2,x,Y+2.8,z,5.2,.3,6.4,[.2,.2,.24],0);
 pbox(B2,x+2.3*KF,Y+1.0,z,.15,1.0,3.2,[.14,.2,.32],0);pbox(B2,x+2.4*KF,Y+.9,z,.5,.12,3.6,[.45,.3,.15],0);
 const sg=new THREE.Mesh(new THREE.PlaneGeometry(5,1.2),new THREE.MeshBasicMaterial({map:txtTex(400,96,'#14141a','#ffd23a','COZY KARTS',44),side:THREE.DoubleSide}));
 sg.position.set(x+2.35*KF,Y+3.9,z);sg.rotation.y=Math.PI/2*KF;scene.add(sg);
 const po=new THREE.Mesh(new THREE.PlaneGeometry(3.2,.9),new THREE.MeshBasicMaterial({map:txtTex(300,84,'#14141a','#ffffff','£5 · 4 LAPS',32),side:THREE.DoubleSide}));
 po.position.set(x+2.4*KF,Y+2.35,z);po.rotation.y=Math.PI/2*KF;scene.add(po);
 // road sign
 const rs=new THREE.Mesh(new THREE.PlaneGeometry(9,1.3),new THREE.MeshBasicMaterial({map:txtTex(512,74,'#2a6a34','#ffffff','COZY KARTS  ▲',40),side:THREE.DoubleSide}));
 rs.position.set(STRIP.x,Y+4.6,-6.2);scene.add(rs)}
scene.add(B.mesh(mRoad));scene.add(B2.mesh(mObj));

/* ---------- kart model ---------- */
const kmc={};function km(hex){if(kmc[hex])return kmc[hex];const c=new THREE.Color(hex),m=wmat([c.r,c.g,c.b],{vertexColors:false});m.color.copy(c);return kmc[hex]=m}
const KPM=hmat(null,1);
/* seated driver (a game person built from spec sp) */
function mkDriver(g,sp,helm,mat){
 const pv=new THREE.Group(),sc=sp.h*.82;pv.position.set(0,.5,-.16);pv.rotation.x=-.12;g.add(pv);
 const pm=mkPerson(sp,mat,pv);pm.position.y=-.92*sc;pm.scale.setScalar(sc);
 pm.l1.rotation.x=pm.l2.rotation.x=-1.38;pm.a1.rotation.x=pm.a2.rotation.x=-1.25;
 const hm=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),km(helm||0xd02020));hm.position.set(0,1.72,0);hm.scale.set(1,1.04,1.08);pm.add(hm);
 const vz=new THREE.Mesh(new THREE.BoxGeometry(.18,.055,.08),km(0x0c0c0e));vz.position.set(0,1.72,.125);pm.add(vz);
 const hs=new THREE.Mesh(new THREE.BoxGeometry(.03,.02,.27),km(0xf2f2f2));hs.position.set(0,1.865,0);pm.add(hs);
 return pv}
function mkKart(col,hcol,num,seed,helm){const g=new THREE.Group();
 const bx=(w,h,d,x,y,z,m,rx)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);q.position.set(x,y,z);if(rx)q.rotation.x=rx;g.add(q);return q};
 const body=km(col),dark=km(0x1c1c20),grey=km(0x80808a),white=km(0xf2f2f2),chrome=km(0xc8ccd4),suit=km(hcol),black=km(0x0c0c0e),glove=km(0x2a2a30);
 const tn=txtTex(64,64,'#f4f4f4','#111',String(num||1),44),nm=new THREE.MeshBasicMaterial({map:tn,side:THREE.DoubleSide});
 const plate=(w,h,x,y,z,ry,rx)=>{const q=new THREE.Mesh(new THREE.PlaneGeometry(w,h),nm);q.position.set(x,y,z);q.rotation.set(rx||0,ry||0,0);g.add(q)};
 // chassis, floor pan, bumpers
 bx(1.0,.08,1.8,0,.25,0,dark);bx(.9,.04,1.5,0,.3,-.05,grey);
 bx(1.34,.09,.1,0,.3,1.28,chrome);bx(.08,.14,.14,.65,.3,1.26,black);bx(.08,.14,.14,-.65,.3,1.26,black);bx(.1,.1,.4,.5,.3,1.1,chrome);bx(.1,.1,.4,-.5,.3,1.1,chrome);
 bx(1.2,.09,.09,0,.34,-1.2,chrome);bx(.08,.1,.3,.5,.34,-1.06,chrome);bx(.08,.1,.3,-.5,.34,-1.06,chrome);
 // nose cone + stripe + number plate
 bx(.86,.18,.5,0,.4,.98,body);bx(.74,.14,.35,0,.5,.85,body,-.25);bx(.14,.03,.9,0,.6,.8,white,-.12);plate(.3,.3,0,.46,1.245,0,0);
 // side pods with stripes and number plates
 for(const sx of[-1,1]){bx(.22,.3,1.3,sx*.58,.42,-.05,body);bx(.22,.14,.5,sx*.58,.36,.7,body);bx(.05,.04,1.1,sx*.58,.59,-.05,white);plate(.28,.28,sx*.7,.45,.0,sx*Math.PI/2)}
 // seat, back rest, rear plate
 bx(.62,.08,.5,0,.34,-.1,dark);bx(.74,.36,.14,0,.52,-.44,dark,-.18);bx(.4,.12,.1,0,.74,-.5,dark);plate(.26,.26,0,.6,-.52,Math.PI,0);
 // engine, air filter, exhaust, brake light
 bx(.56,.34,.44,0,.52,-.9,grey);bx(.4,.18,.3,0,.74,-.9,dark);
 {const f=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.1,8),chrome);f.position.set(-.1,.88,-.88);g.add(f)}
 {const e=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,.5,6).rotateX(Math.PI/2),chrome);e.position.set(.28,.4,-1.15);g.add(e)}
 bx(.22,.06,.04,0,.5,-1.14,new THREE.MeshBasicMaterial({color:0xff2020}));
 // steering column, rim, dash
 bx(.08,.42,.08,0,.58,.36,dark,.5);{const t=new THREE.Mesh(new THREE.TorusGeometry(.13,.022,6,14),black);t.position.set(0,.8,.28);t.rotation.x=-1.0;g.add(t)}
 bx(.5,.1,.14,0,.55,.52,body);
 // wheels (front pivots steer; all spin)
 g.userData.fw=[];g.userData.wh=[];
 for(const[sx,sz,r,w]of[[-1,1,.22,.2],[1,1,.22,.2],[-1,-1,.26,.3],[1,-1,.26,.3]]){const p=new THREE.Group();p.position.set(sx*(sz>0?.58:.64),r,(sz>0?.78:-.72));
  const t=new THREE.Mesh(new THREE.CylinderGeometry(r,r,w,12).rotateZ(Math.PI/2),dark);p.add(t);
  const h=new THREE.Mesh(new THREE.CylinderGeometry(r*.55,r*.55,w+.03,8).rotateZ(Math.PI/2),chrome);t.add(h);
  const n=new THREE.Mesh(new THREE.BoxGeometry(w+.05,.05,r*.8),white);n.position.y=r*.28;t.add(n);
  g.add(p);g.userData.wh.push(t);if(sz>0)g.userData.fw.push(p)}
 // driver: the same person model the villagers use, seated in a racing suit with a helmet
 {const rgb=h=>[(h>>16&255)/255,(h>>8&255)/255,(h&255)/255],suitC=rgb(hcol);g.userData.drv=mkDriver(g,pSpec(seed||1,{ts:1,tc:suitC,bc:suitC.map(v=>v*.8),scarf:null,gl:false,bag:0,bp:false,old:false,hs:0}),helm,KPM)}
 const sh=new THREE.Mesh(new THREE.CircleGeometry(1,16).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.28}));sh.scale.set(.95,1,1.3);sh.position.y=.03;g.add(sh);
 return g}
const kartM=mkKart(0xd02828,0xffd820,7,41,0xd02020);kartM.visible=false;scene.add(kartM);
const AICOL=[[0x2860d8,0xf4f4f4,'BLUEBELL',23,7,0x2860d8],[0x28a848,0xff9020,'MOSS',5,19,0x1a1a1e],[0x9030c8,0x20d0e0,'PLUM',88,33,0xf4f4f4]];
for(const[i,y]of[[0,-20.5],[1,-26.5]]){const k=mkKart(i?0xffd820:0x2860d8,i?0xd02828:0xf4f4f4,i?42:11,i?12:3,i?0x1a1a1e:0xf4f4f4);k.position.set(-107.5,G0+.08,y);k.rotation.y=Math.PI/2;bakeGroup(k);scene.add(k)}

/* ---------- minimap ---------- */
{const x=mb.getContext('2d');x.strokeStyle='#6a6a72';x.lineWidth=1.8;x.lineJoin='round';x.beginPath();S.forEach((s,i)=>i?x.lineTo(mx(s.x),mz(s.z)):x.moveTo(mx(s.x),mz(s.z)));x.closePath();x.stroke();
 x.fillStyle='#ffd23a';x.fillRect(mx(KIOSK.x)-2,mz(KIOSK.z)-2,4,4)}

/* ---------- HUD ---------- */
const css='position:fixed;left:50%;transform:translateX(-50%);z-index:26;font:bold 13px monospace;color:#fff;text-align:center;pointer-events:none;display:none;';
const hud=document.createElement('div');hud.style.cssText=css+'top:84px;padding:5px 10px;background:rgba(0,0,20,.78);border:2px solid #f5e6a0;white-space:nowrap';
const big=document.createElement('div');big.style.cssText=css+'top:26%;font-size:64px;color:#ffe040;text-shadow:3px 3px 0 #000,-2px -2px 0 #000;letter-spacing:2px';
const res=document.createElement('div');res.style.cssText=css+'top:18%;padding:14px 20px;background:rgba(0,0,20,.92);border:3px solid #f5e6a0;pointer-events:auto;min-width:240px;line-height:1.6';
document.body.appendChild(hud);document.body.appendChild(big);document.body.appendChild(res);
const fmt=t=>{if(!(t>0))return '--:--.-';const m=Math.floor(t/60),s=t-m*60;return m+':'+(s<10?'0':'')+s.toFixed(1)};
const ord=n=>['1ST','2ND','3RD','4TH'][n-1]||n+'TH';
function showBig(t,ms){big.textContent=t;big.style.display='block';KT.bigT=ms||0}
function updHud(){const lap=Math.min(LAPS,Math.max(1,Math.floor(KT.tot/N)+1)),cur=KT.t-KT.lapT;
 hud.innerHTML='LAP '+lap+'/'+LAPS+' &nbsp; POS '+KT.rank+'/4 &nbsp; TIME '+fmt(KT.t)+' &nbsp; LAP '+fmt(cur)+' &nbsp; BEST '+fmt(KT.best);hud.style.display='block'}

/* ---------- race flow ---------- */
const SLOTS=[[-3,1.7],[-3,-1.7],[-7,1.7],[-7,-1.7]],PSLOT=2;
function kartStart(){
 if(KT.on||busy||menuOpen||GS.inside)return;
 if(JOB.on||carry){toast('FINISH YOUR JOB FIRST');return}
 if(cash<FEE){toast('NEED £'+FEE+' FOR KARTING');return}
 cash-=FEE;
 KT.saved={x:GS.x,z:GS.z,psi:GS.psi,foot:GS.onFoot,px:P.x,pz:P.z,ppsi:P.psi};
 fade(()=>{
  // dress the driver as the player's own character
  try{if(typeof CHR!=='undefined'&&CHR){const o=kartM.userData.drv;if(o){kartM.remove(o);o.traverse(q=>{if(q.geometry)q.geometry.dispose()})}kartM.userData.drv=mkDriver(kartM,chSpecOf(CHR),0xd02020,mObj)}}catch(e){console.error('kart driver',e)}
  KT.on=1;KT.state='cd';KT.cd=3;KT.t=0;KT.lapT=0;KT.laps=[];KT.lapsDone=0;KT.back=0;KT.rank=4;
  GS.onFoot=0;man.visible=false;car.visible=false;kartM.visible=true;inp.gas=inp.brk=inp.hand=inp.pad=0;
  const ps=SLOTS[PSLOT],p=posAt(ps[0],ps[1]);GS.x=p.x;GS.z=p.z;GS.psi=p.psi;GS.vx=GS.vz=GS.vy=0;GS.vf=0;GS.speed=0;GS.steer=0;GS.y=G0+.1;GS.prevGY=GS.y;GS.pitch=GS.roll=GS.dp=GS.dr=0;
  KT.idx=((Math.round(ps[0]/SP)%N)+N)%N;KT.tot=Math.round(ps[0]/SP);
  camAng=GS.psi;
  MAXV=22;ACCM=2.2;GRIPM=1.7;
  let a=0;KT.ai=[];SLOTS.forEach((sl,i)=>{if(i===PSLOT)return;const c=AICOL[a],m=mkKart(c[0],c[1],c[3],c[4],c[5]);m.visible=true;scene.add(m);KT.ai.push({m,s:sl[0],lat:sl[1],v:0,skill:[1.02,.98,.94][a],name:c[2]});a++});
  setLabels();toast('GET READY!');showBig('3',900);beep(440,.15,'square',.08);KT.lastN=3});
}
function kartEnd(){
 if(!KT.on)return;KT.on=0;KT.state='idle';
 for(const a of KT.ai)scene.remove(a.m);KT.ai=[];
 kartM.visible=false;car.visible=true;applyUpg();
 const s=KT.saved;if(s){GS.x=s.x;GS.z=s.z;GS.psi=s.psi;GS.vx=GS.vz=GS.vy=0;GS.vf=0;GS.speed=0;GS.steer=0;GS.y=gH(GS.x,GS.z)+.1;GS.prevGY=GS.y;GS.pitch=GS.roll=GS.dp=GS.dr=0;
  if(s.foot){GS.onFoot=1;man.visible=true;P.x=s.px;P.z=s.pz;P.psi=s.ppsi;P.speed=0}else{GS.onFoot=0}camAng=GS.onFoot?P.psi:GS.psi}
 hud.style.display=big.style.display=res.style.display='none';setLabels()}
function kartQuit(){if(busy)return;fade(kartEnd)}
function finish(){
 KT.state='fin';const t=KT.t;let rank=1;const pd=KT.tot*SP;for(const a of KT.ai)if(a.s>pd)rank++;KT.rank=rank;
 const prize=PRIZE[rank-1]||0;cash+=prize;
 const nb=!KT.bestRace||t<KT.bestRace;if(nb)KT.bestRace=t;saveBest();
 showBig(rank===1?'WINNER!':ord(rank)+' PLACE',2600);beep(rank===1?880:520,.4,'square',.09);if(rank===1)setTimeout(()=>beep(1320,.3,'square',.08),200);
 res.innerHTML='<div style="font-size:18px;color:#f5e6a0">'+ord(rank)+' PLACE</div>TIME '+fmt(t)+(nb?' ★ NEW BEST':'')+'<br>'+KT.laps.map((l,i)=>'LAP '+(i+1)+' '+fmt(l)).join(' · ')+'<br>BEST LAP '+fmt(KT.best)+'<br>PRIZE '+(prize?'£'+prize:'—')+'<br><button style="margin-top:8px;font:bold 13px monospace;padding:6px 16px;background:#c0262c;color:#fff;border:2px solid #fff;cursor:pointer">BACK TO PIT</button>';
 res.style.display='block';res.querySelector('button').onclick=kartQuit}
function tickPlayer(dt){
 let bi=KT.idx,bd=1e9;for(let k=-12;k<=12;k++){const i=(KT.idx+k+N)%N,s=S[i],d=(GS.x-s.x)*(GS.x-s.x)+(GS.z-s.z)*(GS.z-s.z);if(d<bd){bd=d;bi=i}}
 let d=bi-KT.idx;if(d>N/2)d-=N;else if(d<-N/2)d+=N;KT.idx=bi;KT.tot+=d;
 KT.back=clamp(KT.back+(d<0&&GS.vf>2?dt:-dt),0,3);
 const done=Math.floor(KT.tot/N);
 if(done>KT.lapsDone&&done<=LAPS){const lt=KT.t-KT.lapT;KT.lapT=KT.t;KT.lapsDone=done;KT.laps.push(lt);
  if(!KT.best||lt<KT.best){KT.best=lt;saveBest();toast('LAP '+done+'  '+fmt(lt)+'  BEST!')}else toast('LAP '+done+'  '+fmt(lt));beep(660,.12,'square',.07)}
 if(done>=LAPS&&KT.state==='race')finish()}
function tickAI(dt){const pd=KT.tot*SP;
 for(const a of KT.ai){if(KT.state==='cd'){a.v=0}else{
  const i0=Math.floor(((a.s%LEN)+LEN)%LEN/SP);let tv=1e9;for(let k=0;k<12;k++)tv=Math.min(tv,S[(i0+k)%N].vm);
  tv*=a.skill;const gap=a.s-pd;if(gap>60)tv*=.95;else if(gap<-25)tv*=1.1;else if(gap<0)tv*=1.04;
  if(tv>a.v)a.v=Math.min(tv,a.v+9*dt);else a.v=Math.max(tv,a.v-24*dt);a.s+=a.v*dt}
  const p=posAt(a.s,a.lat);a.m.position.set(p.x,G0+.08,p.z);a.m.rotation.y=p.psi;
  {a.spin=(a.spin||0)+a.v*dt/.24;let da=posAt(a.s+4,a.lat).psi-p.psi;da=Math.atan2(Math.sin(da),Math.cos(da));const st=clamp(da*1.4,-.5,.5);for(const w of a.m.userData.fw)w.rotation.y=st;for(const w of a.m.userData.wh)w.rotation.x=a.spin}
  // bump the player
  const dx=GS.x-p.x,dz=GS.z-p.z,dd=Math.hypot(dx,dz);if(dd<1.75&&dd>1e-3){const ux=dx/dd,uz=dz/dd,o=1.75-dd;GS.x+=ux*o*.6;GS.z+=uz*o*.6;const vn=GS.vx*ux+GS.vz*uz;if(vn<0){GS.vx-=vn*ux*1.1;GS.vz-=vn*uz*1.1}a.v*=.97}}
 let rank=1;for(const a of KT.ai)if(a.s>pd)rank++;if(KT.state!=='fin')KT.rank=rank}
function kartTick(dt){
 if(KT.bigT>0){KT.bigT-=dt*1000;if(KT.bigT<=0&&KT.state!=='cd')big.style.display='none'}
 if(KT.state==='cd'){KT.cd-=dt;const n=Math.ceil(KT.cd);if(n!==KT.lastN&&n>0){KT.lastN=n;showBig(String(n),900);beep(440,.15,'square',.08)}
  if(KT.cd<=0){KT.state='race';KT.t=0;showBig('GO!',900);beep(880,.45,'square',.1)}}
 else if(KT.state==='race'||KT.state==='fin'){if(KT.state==='race')KT.t+=dt;
  GS.vf=GS.vf||0;
  // sharper turn-in than the road car
  const sf=clamp(GS.vf/4,-1,1);GS.psi+=GS.steer*sf*.55*dt;
  tickPlayer(dt);
  if(KT.back>.9&&KT.state==='race'){big.textContent='WRONG WAY';big.style.display='block';KT.bigT=0}else if(big.textContent==='WRONG WAY')big.style.display='none'}
 tickAI(dt);
 KT.hudT-=dt;if(KT.hudT<=0){KT.hudT=.1;if(KT.state==='cd'){hud.innerHTML='COZY KARTS · '+LAPS+' LAPS · BEST LAP '+fmt(KT.best);hud.style.display='block'}else if(KT.state==='race')updHud()}}

/* ---------- hooks into the main game ---------- */
{const step0=step;step=function(dt){
 if(!KT.on)return step0(dt);
 if(KT.state==='cd'){GS.vx=GS.vz=GS.vf=GS.speed=0}else step0(dt);
 try{kartTick(dt)}catch(e){if(!KT.err){KT.err=1;console.error('kart',e)}}}}
{const uc0=updateCar;updateCar=function(){uc0();if(KT.on){kartM.position.copy(car.position);kartM.rotation.copy(car.rotation);for(const w of kartM.userData.fw)w.rotation.y=GS.steer*.5;for(const w of kartM.userData.wh)w.rotation.x=GS_SPIN}}}
{const ctx0=ctx;ctx=function(){
 if(KT.on)return{label:KT.state==='fin'?'LEAVE TRACK':'QUIT RACE',fn:kartQuit};
 if(!GS.inside){const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z;if(GS.onFoot?Math.hypot(px-(KIOSK.x+3*KF),pz-KIOSK.z)<5:(px>PARK.x0-3&&px<PARK.x1+3&&pz>PARK.z0-3&&pz<PARK.z1+3))return{label:'GO KARTING £'+FEE,fn:kartStart}}
 return ctx0()}}
window.KARTS={KT,S,N,SP,LEN,kartStart,kartQuit,kartEnd,posAt,KIOSK};
})();
