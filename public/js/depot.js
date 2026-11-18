/* ===== Post Office delivery depot =====
   Parcel jobs used to start when you drove into a blue ring on the High Street.  Now:
     1. Go inside the POST OFFICE and read the DELIVERY JOBS board on the wall; accept a job.
     2. Drive round the back (up the side road, past the end of the shop row) to the LOADING BAY.
     3. Reverse in so the boot faces the dock; a postie loads your parcels, then the usual delivery round begins.
   Food orders from Frankie's still start from the ring outside the chippy.
   The rest of the delivery code (stops, timer, pay, rush / fragile) is unchanged: loading just calls startJob(). */
(function(){
const DEP=DEPOTS.find(d=>d.type==='parcel');if(!DEP)return;
const BAY={x:51.2,z:19.2,zLo:17.7,zHi:20.9,hx:1.7},PLAT={x0:49.2,x1:52.2,z0:14.9,z1:16.4,h:.9},DOOR={x:51.2};
const PJ={acc:null,offers:null,hr:-1,load:0,t:0,warn:0};
window.PJ=PJ;
const Y=G0;
const GREY=[.62,.62,.64],DKG=[.28,.28,.3],YEL=[.95,.78,.1],WHT=[.92,.92,.88],ASP=[.3,.3,.32],BRN=[.8,.62,.36],ORG=[.92,.5,.1],RED=[.78,.1,.1];

/* ---------- surface: the tarmac yard behind the shop counts as road ---------- */
{const d0=dAt;dAt=function(x,z){const d=d0(x,z);if(d<4.7)return d;if(x>44.2&&x<58.5&&z>14.9&&z<29.5)return Math.min(d,4.0);return d}}

/* ---------- scenery ---------- */
const B=new Builder(2),B2=new Builder(3);
quadXZ(B,[44.3,15.0],[58.4,15.0],[58.4,29],[44.3,29],ASP,Y+.055);
for(const x of[50.0,52.5]){quadXZ(B,[x,16.9],[x+.14,16.9],[x+.14,21.4],[x,21.4],WHT,Y+.075)}
quadXZ(B,[49.9,21.3],[52.64,21.3],[52.64,21.45],[49.9,21.45],WHT,Y+.075);
for(let i=0;i<6;i++)quadXZ(B,[50.1+i*.4,16.95],[50.1+i*.4+.2,16.95],[50.5+i*.4+.2,17.5],[50.5+i*.4,17.5],i%2?DKG:YEL,Y+.08);
scene.add(B.mesh(mRoad));
/* dock platform with yellow edge, steps, roller door, canopy */
pbox(B2,(PLAT.x0+PLAT.x1)/2,Y,(PLAT.z0+PLAT.z1)/2,PLAT.x1-PLAT.x0,PLAT.h,PLAT.z1-PLAT.z0,GREY,0);
pbox(B2,(PLAT.x0+PLAT.x1)/2,Y+PLAT.h,PLAT.z1-.08,PLAT.x1-PLAT.x0,.03,.16,YEL,0);
pbox(B2,PLAT.x0-.35,Y,15.9,.7,.3,1.0,GREY,0);pbox(B2,PLAT.x0-.8,Y,15.9,.5,.15,1.0,GREY,0);
pbox(B2,DOOR.x,Y+PLAT.h,14.93,1.5,1.95,.05,[.1,.1,.13],0);
for(const dx of[-.78,.78])pbox(B2,DOOR.x+dx,Y+PLAT.h,14.94,.08,2.0,.06,ORG,0);pbox(B2,DOOR.x,Y+PLAT.h+1.97,14.94,1.66,.08,.06,ORG,0);
pbox(B2,DOOR.x,Y+PLAT.h+2.35,14.95,1.9,.9,.04,[.14,.14,.16],0);
{const m=new THREE.Mesh(new THREE.PlaneGeometry(1.8,.8),new THREE.MeshBasicMaterial({map:txtTex(256,114,'#14141a','#ffd23a','LOADING BAY',40),side:THREE.DoubleSide}));m.position.set(DOOR.x,Y+PLAT.h+2.8,14.99);scene.add(m)}
/* canopy over dock */
pbox(B2,(PLAT.x0+PLAT.x1)/2+.2,Y+3.65,15.9,PLAT.x1-PLAT.x0+.9,.1,1.7,[.2,.2,.24],0);
for(const x of[PLAT.x0+.1,PLAT.x1-.1])pbox(B2,x,Y,16.28,.1,3.65,.1,DKG,0);
/* bollards, wheel stop, lamp, bins, trolley, free-standing sign */
for(const z of[17.4,19.2,21.0]){pcyl(B2,53.0,Y,z,.14,.9,8,YEL);pcyl(B2,53.0,Y+.55,z,.145,.12,8,DKG);COL.push([53.0,z,.3])}
pbox(B2,51.2,Y,17.1,2.0,.2,.28,YEL,0);
pbox(B2,50.2,Y,16.55,.4,.12,.1,[.4,.4,.42],0);
COL.push([49.7,16.5,.5],[51.2,16.55,.5],[52.4,16.55,.5]);
{const cv=document.createElement('canvas');cv.width=256;cv.height=160;const g=cv.getContext('2d');g.fillStyle='#b81818';g.fillRect(0,0,256,160);g.strokeStyle='#fff';g.lineWidth=5;g.strokeRect(6,6,244,148);g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.font='bold 34px Georgia';g.fillText('POST OFFICE',128,34);g.fillStyle='#ffd23a';g.font='bold 40px Georgia';g.fillText('LOADING BAY',128,80);g.fillStyle='#fff';g.font='bold 24px monospace';g.fillText('REVERSE IN',128,124);const tx=new THREE.CanvasTexture(cv);const t=new THREE.Mesh(new THREE.PlaneGeometry(1.6,1.0),new THREE.MeshBasicMaterial({map:tx,side:THREE.DoubleSide}));t.position.set(56.26,Y+3.45,23);t.scale.set(1.25,1.25,1);t.rotation.y=Math.PI/2;scene.add(t);const t2=t.clone();t2.position.x=55.74;t2.rotation.y=-Math.PI/2;scene.add(t2)}
/* ---------- walled yard (the house that used to sit here is gone) ---------- */
{const BRK=[.6,.29,.22],CAP=[.55,.55,.58],yh=2.3;
 const wall=(x0,z0,x1,z1)=>{const L=Math.hypot(x1-x0,z1-z0),cx=(x0+x1)/2,cz=(z0+z1)/2,ax=Math.abs(x1-x0)>Math.abs(z1-z0);
  pbox(B2,cx,Y,cz,ax?L:.35,yh,ax?.35:L,BRK,0);pbox(B2,cx,Y+yh,cz,ax?L+.05:.5,.14,ax?.5:L+.05,CAP,0);
  for(let i=0;i<=L;i+=1.0)COL.push([x0+(x1-x0)*i/L,z0+(z1-z0)*i/L,.5]);
  for(let i=0;i<=L+.1;i+=3){const px=x0+(x1-x0)*Math.min(1,i/L),pz=z0+(z1-z0)*Math.min(1,i/L);pbox(B2,px,Y,pz,.55,yh+.05,.55,[.55,.26,.2],0);pbox(B2,px,Y+yh+.05,pz,.7,.1,.7,CAP,0)}};
 wall(44.0,15.0,44.0,29.0);wall(44.0,29.0,56.0,29.0);wall(56.0,29.0,56.0,27.0);wall(56.0,19.0,56.0,15.0);wall(52.0,15.0,56.0,15.0);
 /* gate piers, beam, open gates */
 for(const z of[19.0,27.0]){pbox(B2,56.0,Y,z,.8,3.1,.8,[.5,.24,.18],0);pbox(B2,56.0,Y+3.1,z,.95,.14,.95,CAP,0);COL.push([56.0,z,.5])}
 pbox(B2,56.0,Y+3.2,23.0,.5,.32,8.8,[.2,.2,.24],0);
 for(const[gz,gr]of[[19.8,1.0],[26.2,2.14]]){const g=new THREE.Mesh(new THREE.BoxGeometry(.08,1.8,3.0),wmat([.18,.2,.24],{vertexColors:false}));g.position.set(57.26,Y+.95,gz);g.rotation.y=gr;scene.add(g)}
 /* yard furniture: bins, pallets, a parked red van */
 pcyl(B2,45.2,Y,28.0,.4,1.0,8,[.15,.35,.2]);COL.push([45.2,28.0,.45]);pcyl(B2,46.1,Y,28.1,.4,1.0,8,[.15,.35,.2]);COL.push([46.1,28.1,.45]);
 for(const[px,pz]of[[45.0,17.0],[45.0,18.3]]){pbox(B2,px,Y,pz,1.1,.14,1.1,[.6,.45,.25],0);pbox(B2,px,Y+.14,pz,.9,.5,.9,BRN,0);pbox(B2,px,Y+.64,pz,.7,.4,.7,[.76,.6,.34],0);COL.push([px,pz,.7])}
 {const vx=46.0,vz=23.0,rot=Math.PI/2,c=Math.cos(rot),s=Math.sin(rot),W=(lx,ly,lz)=>[vx+lx*c+lz*s,Y+ly,vz-lx*s+lz*c];
  carParts((k,lx,ly,lz,sx,sy,sz,cc)=>pbox(B2,...W(lx,ly,lz),sx,sy,sz,k==='g'?[.25,.3,.4]:cc,rot),3,[.82,.1,.1]);for(const z of[-1.6,0,1.6])COL.push([vx+z*s,vz+z*c,1.05])}
 for(const z of[18.5])pbox(B2,44.4,Y+1.0,z,.04,.01,.01,CAP,0)}
/* trolley of parcels beside the door */
const mkParcel=()=>{const g=new THREE.Group(),m=new THREE.Mesh(new THREE.BoxGeometry(.42,.3,.34),wmat([.8,.62,.36],{vertexColors:false}));g.add(m);const t=new THREE.Mesh(new THREE.BoxGeometry(.1,.31,.35),wmat([.95,.9,.7],{vertexColors:false}));g.add(t);return g};
scene.add(B2.mesh(mObj));
const pile=[];{const pos=[[49.75,0,15.3],[50.2,0,15.3],[49.75,0,15.75],[49.85,.3,15.45],[50.25,.3,15.4],[50.0,.6,15.4]];pos.forEach(p=>{const m=mkParcel();m.position.set(p[0],Y+PLAT.h+.15+p[1],p[2]);m.rotation.y=(p[0]*7)%1;scene.add(m);pile.push(m)})}
{const c=new THREE.Mesh(new THREE.BoxGeometry(.9,.9,1.1),wmat([.5,.55,.62],{vertexColors:false}));c.position.set(52.35,Y+PLAT.h+.5,15.7);scene.add(c)}

/* ---------- the postie ---------- */
const sp0=pSpec(8123,{f:false,hs:3,ts:1,beard:false,gl:false,scarf:null,bag:0,bp:false,tc:[.78,.1,.1],bc:[.16,.18,.28],old:false,w:1,h:1.0});
const LD=new THREE.Group();scene.add(LD);const lm=mkPerson(sp0,mObj,LD);lm.scale.setScalar(.96);LD.add(lm);LD.position.set(50.8,Y+PLAT.h,15.6);
const hold=mkParcel();hold.position.set(0,1.05,.38);hold.visible=false;LD.add(hold);
const LA={ph:0,pos:[50.8,15.6],face:0};
function setLd(x,z,fx,fz,moving,carry,wave,dt){LD.position.set(x,Y+PLAT.h,z);if(fx!==undefined){const a=Math.atan2(fx-x,fz-z);let d=a-LD.rotation.y;while(d>Math.PI)d-=6.283;while(d<-Math.PI)d+=6.283;LD.rotation.y+=d*Math.min(1,dt*9)}
 LA.ph+=dt*(moving?9:0);const s=Math.sin(LA.ph)*(moving?.8:0);lm.l1.rotation.x=s;lm.l2.rotation.x=-s;
 if(carry){lm.a1.rotation.x=lm.a2.rotation.x=-1.25}else if(wave){lm.a1.rotation.x=-2.6+Math.sin(performance.now()*.01)*.4;lm.a2.rotation.x=0}else{lm.a1.rotation.x=-s*.7;lm.a2.rotation.x=s*.7}hold.visible=!!carry}

/* ---------- job board inside the post office ---------- */
const POOL=[{n:2,kind:'',t:'STANDARD'},{n:3,kind:'',t:'STANDARD'},{n:4,kind:'',t:'BIG ROUND'},{n:2,kind:'rush',t:'RUSH'},{n:3,kind:'fragile',t:'FRAGILE'},{n:3,kind:'rush',t:'RUSH'}];
function estimate(o){const nm=todI===2?1.5:todI===1?1.25:1;let b=4*o.n+8;if(o.kind==='rush')b*=1.7;if(o.kind==='fragile')b*=1.4;return Math.round(b*nm)}
function offers(){const h=Math.floor(GT);if(!PJ.offers||PJ.hr!==h){PJ.hr=h;const a=POOL.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}PJ.offers=a.slice(0,3).sort((x,y)=>x.n-y.n)}return PJ.offers}
const desc=o=>o.n+' PARCELS · '+o.t+(o.kind==='rush'?' · TIGHT TIME':o.kind==='fragile'?' · DRIVE GENTLY':'');
CUSTOM_SHOP.pojobs=function(msg){document.getElementById('shT').textContent='DELIVERY JOBS';
 const sm=document.getElementById('shMsg');
 if(JOB.on){sm.textContent=msg||'FINISH YOUR CURRENT DELIVERY FIRST';dRow('',[['BACK',()=>closeShop()]]);return}
 if(PJ.acc){sm.textContent=msg||'ACCEPTED. DRIVE ROUND THE BACK AND REVERSE INTO THE LOADING BAY';dRow('YOUR JOB: '+desc(PJ.acc),[['CANCEL',()=>{PJ.acc=null;PJ.load=0;renderShop('JOB CANCELLED')}]]);dRow('',[['BACK',()=>closeShop()]]);return}
 sm.textContent=msg||'PICK A ROUND. THEN BRING THE CAR ROUND THE BACK.';
 offers().forEach(o=>dRow(desc(o)+' · ABOUT £'+estimate(o),[['ACCEPT',()=>{PJ.acc=o;PJ.load=0;PJ.offers=null;beep(660,.1,'square',.06);closeShop();setTimeout(()=>toast('JOB ACCEPTED! REVERSE INTO THE LOADING BAY AT THE BACK'),300)}]]));
 dRow('',[['BACK',()=>closeShop()]])};
{const bs0=buildShop;buildShop=function(o){bs0(o);if(o&&o.t==='POST OFFICE'){
  const c=document.createElement('canvas');c.width=256;c.height=200;const g=c.getContext('2d');g.fillStyle='#6a4a2a';g.fillRect(0,0,256,200);g.fillStyle='#c8a870';g.fillRect(8,8,240,184);g.fillStyle='#b81818';g.fillRect(8,8,240,30);g.fillStyle='#fff';g.font='bold 20px Georgia';g.textAlign='center';g.textBaseline='middle';g.fillText('DELIVERY JOBS',128,24);
  [[22,50,'#fff8d0',-.05],[100,48,'#d8f0ff',.04],[176,52,'#ffe0e0',-.03],[30,112,'#e8ffd8',.03],[112,116,'#fff8d0',-.04],[184,110,'#d8f0ff',.05]].forEach(([x,y,col,r],i)=>{g.save();g.translate(x+34,y+28);g.rotate(r);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-34,-26,70,56);g.fillStyle=col;g.fillRect(-36,-28,70,56);g.fillStyle='#c02020';g.beginPath();g.arc(0,-24,4,0,6.3);g.fill();g.fillStyle='#555';g.font='bold 9px monospace';g.fillText(['2 PARCELS','RUSH!','FRAGILE','3 PARCELS','BIG ROUND','£££'][i],0,-6);g.fillRect(-26,4,52,2);g.fillRect(-26,12,40,2);g.fillRect(-26,20,46,2);g.restore()});
  g.fillStyle='#14141a';g.fillRect(40,166,176,22);g.fillStyle='#ffd23a';g.font='bold 12px monospace';g.fillText('ASK HERE',128,177);
  const tx=new THREE.CanvasTexture(c);splane(1.5,1.2,-RX+.06,1.5,.4,Math.PI/2,imat(tx));
  IA.splice(IA.length-1,0,{r:[-RX,-RX+.8,-.4,1.2],label:()=>JOB.on?'DELIVERY JOBS (BUSY)':PJ.acc?'YOUR JOB TICKET':'DELIVERY JOB BOARD',fn:()=>openShop('pojobs')})}}}

/* ---------- loading ---------- */
const bar=document.createElement('div');bar.style.cssText='position:absolute;left:50%;top:18%;transform:translateX(-50%);min-width:220px;padding:6px 10px;background:rgba(0,0,20,.82);border:2px solid #f5e6a0;border-radius:8px;color:#fff;font:bold 13px monospace;text-align:center;display:none;z-index:25;pointer-events:none';bar.innerHTML='<div id="pjT"></div><div style="height:10px;background:#333;margin-top:5px;border-radius:5px;overflow:hidden"><div id="pjB" style="height:100%;width:0;background:#4aa8ff"></div></div>';document.getElementById('hud').appendChild(bar);
const BBEAM=mkBeam(0x4aa8ff);BBEAM.position.set(BAY.x,Y,BAY.z);BBEAM.scale.set(.55,1,.55);
function inBay(){return !GS.onFoot&&!GS.inside&&Math.abs(GS.x-BAY.x)<BAY.hx&&GS.z>BAY.zLo&&GS.z<BAY.zHi}
function bootP(){return[GS.x-Math.sin(GS.psi)*2.3,GS.z-Math.cos(GS.psi)*2.3]}
const CYC=1.5;let lastIdle=0;
function updDepot(dt){
 const want=!!PJ.acc&&!JOB.on;
 BBEAM.visible=want&&!PJ.load;DBEAM.forEach((g,i)=>{if(DEPOTS[i]===DEP)g.visible=!JOB.on&&!want});
 let moving=0,carry=0,wx=50.8,wz=15.6,fx=BAY.x,fz=BAY.z;
 if(want){
  if(inBay()){
   const face=Math.cos(GS.psi),sp=Math.abs(GS.speed);
   if(PJ.hold>0)PJ.hold-=dt;else if(face>.72&&sp<1.4){PJ.load=1;PJ.t+=dt}
   else{if(PJ.load&&sp>=1.4&&face>.72)toast('STAY STILL WHILE THEY LOAD');PJ.load=PJ.load&&face>.72?1:0;if(face<=.72&&PJ.warn<=0&&sp<3){PJ.warn=6;toast('REVERSE IN: BOOT TOWARDS THE DOCK')}}
  }else{PJ.load=0;PJ.t=Math.max(0,PJ.t-dt*.5)}
  PJ.warn-=dt;
  const tot=PJ.acc.n*CYC;
  if(PJ.load&&PJ.t>=tot){const a=PJ.acc;PJ.acc=null;PJ.load=0;PJ.t=0;startJob(DEP,{n:a.n,kind:a.kind});if(!JOB.on){PJ.acc=a;PJ.t=0;PJ.load=0;PJ.hold=3}}
  else if(PJ.load){
   const k=Math.min(PJ.acc.n-1,Math.floor(PJ.t/CYC)),u=(PJ.t-k*CYC)/CYC,bp=bootP(),px=49.9,ex=Math.max(50.6,Math.min(51.9,bp[0])),ez=15.95;
   pile.forEach((m,i)=>m.visible=i<pile.length-(k+(u>.3?1:0))||false);
   if(u<.3){wx=px+.45;wz=15.6;moving=0;carry=0;fx=px;fz=15.4}
   else if(u<.6){const f=(u-.3)/.3;wx=px+.45+(ex-px-.45)*f;wz=15.6+(ez-15.6)*f;moving=1;carry=1;fx=ex;fz=bp[1]}
   else if(u<.8){wx=ex;wz=ez;carry=u<.74;moving=0;fx=ex;fz=bp[1]}
   else{const f=(u-.8)/.2;wx=ex+(px+.45-ex)*f;wz=ez+(15.6-ez)*f;moving=1;fx=px;fz=15.4}
   if(carry){hold.position.set(0,1.05,.38)}
   if(u>.6&&u<.62&&!PJ._th){PJ._th=1;beep(180,.06,'square',.05)}if(u>.7)PJ._th=0;
   bar.style.display='block';document.getElementById('pjT').textContent='LOADING PARCELS '+(k+(u>.75?1:0))+'/'+PJ.acc.n;document.getElementById('pjB').style.width=Math.min(100,PJ.t/tot*100)+'%'}
  if(!PJ.load){bar.style.display='none';pile.forEach(m=>m.visible=true);wx=50.8;wz=15.6;fx=BAY.x;fz=BAY.z}
 }else{bar.style.display='none';pile.forEach(m=>m.visible=true);PJ.load=0;PJ.t=0;fx=BAY.x;fz=BAY.z}
 const hX=GS.onFoot?P.x:GS.x,hZ=GS.onFoot?P.z:GS.z;LD.visible=Math.hypot(hX-BAY.x,hZ-BAY.z)<160;
 if(LD.visible)setLd(wx,wz,fx,fz,moving,carry,want&&!PJ.load&&!moving,dt)}
{const u0=updJob;updJob=function(dt){u0(dt);updDepot(dt)}}

/* ---------- arrow + HUD text ---------- */
{const jt0=jobTarget;jobTarget=function(){if(PJ.acc&&!JOB.on){const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z;return{x:BAY.x,z:BAY.z,d:Math.hypot(BAY.x-px,BAY.z-pz),o:{name:'LOADING BAY',addr:'LOADING BAY',bay:1}}}return jt0()}}
{const h0=updJobHUD;updJobHUD=function(){h0();if(GS.inside||menuOpen||JOB.on)return;const t=jobTarget();if(PJ.acc){$('jl1').textContent='JOB: '+PJ.acc.n+' PARCELS'+(PJ.acc.kind?' ('+PJ.acc.kind.toUpperCase()+')':'');$('jl2').textContent='REVERSE INTO THE LOADING BAY BEHIND THE POST OFFICE · '+Math.round(t?t.d:0)+' m'}
 else if(t&&t.o===DEP){$('jl1').textContent='FIND A JOB: POST OFFICE';$('jl2').textContent=Math.round(t.d)+' m · GO INSIDE AND CHECK THE JOB BOARD'}}}
})();
