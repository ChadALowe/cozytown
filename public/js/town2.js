/* COZYTOWN life: the train and level crossings, train rides between the three stations, narrowboats on the canal,
   the windmill, the town-hall clock (shows game time), ducks and swans, grazing sheep, and extra townsfolk + traffic
   that are always recycled to the streets near you. */
(function(){
const T=window.TOWN;if(!T)return;const TAU=Math.PI*2;
const pos=()=>GS.onFoot?P:GS,nearC=(x,z,r)=>{const dx=x-cam.position.x,dz=z-cam.position.z;return dx*dx+dz*dz<r*r};
const inTown=()=>{const p=pos();return !GS.inside&&p.x>TB.x0-20&&p.x<TB.x1+20&&p.z>TB.z0-20&&p.z<300&&!(window.MOON&&MOON.MN&&MOON.MN.on)};
T.pois=[...T.stations.map(s=>({x:s.door[0],z:s.door[1],n:s.n,c:'trav',ic:'🚆'})),{x:T.hall[0],z:T.hall[1],n:'TOWN HALL',c:'serv',ic:'🕰'},{x:-20,z:-312,n:'MARKET PLACE',c:'shop',ic:'🍎'},{x:-725,z:106,n:'COZY PARK',c:'fun',ic:'🌳'},
 {x:ZONE.windmill[0],z:ZONE.windmill[1]+36,n:'WINDMILL HILL',c:'fun',ic:'🌾'},{x:-185,z:-558,n:'CRICKET CLUB',c:'fun',ic:'🏏'},{x:600,z:228,n:'THE BEACH',c:'fun',ic:'🏖'},{x:150,z:-466,n:'CANAL LOCKS',c:'fun',ic:'⛵'},{x:-980,z:100,n:'ALLOTMENTS',c:'farm',ic:'🥕'}];

/* ---------------------------------------------------------------- the train */
const mk=(fn)=>{const B=new Builder(3),L=new Builder(3);fn(B,L);const g=new THREE.Group();g.add(B.mesh(mObj));if(L.p.length)g.add(L.mesh(gLit));return g};
const loco=mk((B,L)=>{const G=[.08,.36,.2],K=[.08,.08,.09];pbox(B,0,.4,0,12,.5,2.6,K);pbox(B,1,.9,0,7.6,2.1,2.1,G);pbox(B,1,2.8,0,7.2,.4,1.7,G);for(let i=0;i<5;i++)pbox(B,-2.6+i*1.6,.9,0,.12,2.12,2.14,[.75,.6,.2]);
 pbox(B,4.6,2.6,0,.9,1.6,.9,K);pbox(B,4.6,4.1,0,1.1,.3,1.1,K);pbox(B,2.3,3.2,0,.9,.6,.9,[.75,.6,.2]);pbox(B,-3.6,.9,0,3.2,3.2,2.7,G);pbox(B,-3.6,4.1,0,3.6,.3,2.9,K);pbox(L,-3.6,2.5,1.36,1.6,.9,.04,[1,1,1]);pbox(L,-3.6,2.5,-1.36,1.6,.9,.04,[1,1,1]);
 for(let i=0;i<3;i++)for(const sd of[1,-1])pbox(B,-.5+i*2.1,.05,sd*1.2,1.5,1.5,.2,[.7,.12,.1]);pbox(B,6.05,.6,0,.2,.6,2.4,[.8,.1,.1])});
const coach=(c)=>mk((B,L)=>{pbox(B,0,.45,0,15.6,.4,2.7,[.1,.1,.1]);pbox(B,0,.85,0,15.6,1.2,2.8,c);pbox(B,0,2.05,0,15.6,1.1,2.8,[.94,.9,.78]);pbox(B,0,3.15,0,15.4,.35,2.6,[.3,.3,.32]);
 for(let i=0;i<7;i++)for(const sd of[1,-1])pbox(L,-6.3+i*2.1,2.15,sd*1.41,1.5,.8,.04,[1,1,1]);for(const x of[-5.6,5.6])for(const sd of[1,-1])pbox(B,x,.05,sd*1.1,1.8,.6,.25,[.15,.15,.15])});
const train=new THREE.Group();train.add(loco);loco.position.x=24;[[.5,.12,.14],[.5,.12,.14],[.5,.12,.14]].forEach((c,i)=>{const k=coach(c);k.position.x=10-i*16.6;train.add(k)});
train.position.set(RAILX0-30,G0+.05,RAILZ);scene.add(train);
const TR={x:RAILX0-30,dir:1,v:0,wait:6,len:62,stopAt:null,puff:0};T.train=TR;
const STOPS=T.stations.map(s=>s.plat[0]).sort((a,b)=>a-b),ENDS=[RAILX0-40,RAILX1+40];
const smoke=[];{const g=new THREE.BoxGeometry(.8,.8,.8);for(let i=0;i<14;i++){const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:0xdddddd,transparent:true,opacity:0}));m.userData.t=9;scene.add(m);smoke.push(m)}}
let honkT=0;
function updTrain(dt){if(TR.wait>0){TR.wait-=dt;TR.v=0;if(TR.wait<=0&&TR.atEnd){TR.dir=-TR.dir;TR.atEnd=0}}
 else{const ahead=STOPS.filter(x=>(x-TR.x)*TR.dir>.3),next=ahead.length?(TR.dir>0?ahead[0]:ahead[ahead.length-1]):ENDS[TR.dir>0?1:0],d=Math.abs(next-TR.x),vt=Math.min(17,Math.sqrt(2*1.1*d)+.4);
  TR.v+=clamp(vt-TR.v,-2.2*dt,1.2*dt);TR.x+=TR.v*TR.dir*dt;if(d<.4){TR.x=next;TR.v=0;if(next===ENDS[0]||next===ENDS[1]){TR.wait=18;TR.atEnd=1}else{TR.wait=14;const st=T.stations.find(s=>s.plat[0]===next);if(st&&nearC(next,RAILZ,90)){beep(660,.25,'sine',.06);setTimeout(()=>beep(520,.35,'sine',.06),260)}}}}
 train.position.x=TR.x;train.rotation.y=TR.dir>0?0:Math.PI;train.visible=nearC(TR.x,RAILZ,scene.fog.far+80)&&TR.x>RAILX0-8&&TR.x<RAILX1+8;
 /* steam */
 if(train.visible&&TR.v>1){TR.puff-=dt;if(TR.puff<0){TR.puff=.18;const m=smoke.find(q=>q.userData.t>2.5);if(m){m.userData.t=0;m.position.set(TR.x+TR.dir*28.6,G0+4.6,RAILZ)}}}
 for(const m of smoke){const u=m.userData;if(u.t>2.5){m.visible=false;continue}u.t+=dt;m.visible=true;m.position.y+=dt*2.2;m.position.x-=TR.dir*TR.v*dt*.6;m.scale.setScalar(1+u.t*1.6);m.material.opacity=.55*(1-u.t/2.5)}
 /* bump anything on the line */
 const p=pos(),dx=p.x-TR.x;if(!GS.inside&&Math.abs(dx)<TR.len/2+2&&Math.abs(p.z-RAILZ)<2.3&&train.visible){const sd=p.z<RAILZ?-1:1;if(GS.onFoot){P.z=RAILZ+sd*2.4}else{GS.z=RAILZ+sd*2.5;GS.vz=sd*Math.max(4,Math.abs(GS.vz));GS.vx*=.5;beep(90,.25,'sawtooth',.12)}}
 /* toot at someone on the tracks ahead */
 honkT-=dt;const ah=(p.x-TR.x)*TR.dir;if(honkT<0&&TR.v>3&&ah>30&&ah<160&&Math.abs(p.z-RAILZ)<4){honkT=4;beep(440,.5,'sawtooth',.08);setTimeout(()=>beep(370,.6,'sawtooth',.08),200)}}
/* level crossings */
let dingT=0;
function updXings(dt){const now=performance.now();for(const X of T.xings){const d=(X.x-TR.x)*TR.dir,on=(d>-TR.len/2-10&&d<170&&(TR.v>.2||Math.abs(X.x-TR.x)<TR.len/2+8))&&!(TR.wait>0&&TR.atEnd);X.down=on;
  for(const a of X.arms){const tgt=on?0:-a.userData.sd*Math.PI/2*.96;a.rotation.z+=(tgt-a.rotation.z)*Math.min(1,dt*2.2)}
  const fl=on&&((now/450|0)%2);X.lights.forEach((l,i)=>l.material.color.setHex(on?((i%2)===fl?0xff2010:0x330000):0x330000));
  if(on&&nearC(X.x,RAILZ,70)){dingT-=dt;if(dingT<0){dingT=.5;beep(980,.1,'square',.03)}}
  /* barrier down: hold cars back */
  if(on&&!GS.onFoot&&!GS.inside&&Math.abs(GS.x-X.x)<RW+.5){const dz=GS.z-RAILZ;if(Math.abs(dz)<7&&Math.abs(dz)>3.2&&GS.vz*dz<0){GS.z=RAILZ+Math.sign(dz)*7;GS.vz=0;GS.vx*=.6}}}}

/* ---------------------------------------------------------------- train rides */
let tkt=null;
function ticket(S){if(tkt)return;busy=1;const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;background:#000a;display:flex;align-items:center;justify-content:center;z-index:60;font-family:ui-monospace,monospace';
 const b=document.createElement('div');b.style.cssText='background:#10244a;color:#fff;border:3px solid #ffd24a;border-radius:14px;padding:18px 20px;min-width:270px;text-align:center';
 b.innerHTML='<div style="font-size:12px;color:#ffd24a">🚆 '+S.n+'</div><div style="font-size:18px;margin:6px 0 12px">WHERE TO?</div>';
 const close=()=>{o.remove();tkt=null;busy=0};
 for(const D of T.stations){if(D===S)continue;const bt=document.createElement('button');bt.textContent=D.n+'  ·  £3';bt.style.cssText='display:block;width:100%;margin:6px 0;padding:11px;font:bold 14px ui-monospace,monospace;background:#ffd24a;color:#10244a;border:0;border-radius:9px';
  bt.onpointerdown=e=>{e.stopPropagation();if(cash<3){toast('YOU NEED £3 FOR A TICKET');return}cash-=3;close();ride(S,D)};b.appendChild(bt)}
 const x=document.createElement('button');x.textContent='NOT TODAY';x.style.cssText='margin-top:8px;padding:8px 14px;font:12px ui-monospace,monospace;background:#0000;color:#fff;border:1px solid #fff6;border-radius:8px';x.onpointerdown=e=>{e.stopPropagation();close()};b.appendChild(x);
 o.appendChild(b);document.body.appendChild(o);tkt=o;o.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close()}},true)}
function ride(S,D){toast('ALL ABOARD!');beep(520,.4,'sawtooth',.07);setTimeout(()=>fade(()=>{P.x=D.door[0]+(rnd()-.5)*2;P.z=D.door[1]+2.5;P.psi=0;GT+=.15;toast('ARRIVED AT '+D.n+(Math.hypot(GS.x-D.door[0],GS.z-D.door[1])>150?' · YOUR CAR IS STILL BACK AT '+S.n.split(' ')[0]:''))}),500)}
{const c0=ctx;ctx=function(){const b=c0();if(!GS.onFoot||GS.inside||busy||!inTown())return b;for(const S of T.stations){if(Math.hypot(P.x-S.door[0],P.z-S.door[1])<4.5||Math.hypot(P.x-S.plat[0],P.z-S.plat[1])<9)return{label:'🚆 CATCH A TRAIN',fn:()=>ticket(S)}}
 if(Math.hypot(P.x-T.hall[0],P.z-T.hall[1])<5)return{label:'🕰 READ THE TOWN NOTICEBOARD',fn:()=>toast(pk(['MARKET EVERY DAY · FRESH VEG, CHEESE AND CAKES','TRAINS: CENTRAL · WESTBROOK HALT · EASTFIELD','CANAL BOAT TRIPS FROM THE NARROWBOAT PUB','CRICKET ON THE GREEN THIS SUNDAY','LOST: ONE GINGER CAT ANSWERS TO "BISCUIT"']))};
 for(const s of T.stalls)if(Math.hypot(P.x-s[0],P.z-s[1])<3.4)return{label:'🍎 BUY FROM THE STALL £1',fn:()=>{if(cash<1){toast('NO CASH!');return}cash-=1;if(typeof HN!=='undefined'&&HN.food!=null)HN.food=Math.min(100,HN.food+10);toast(pk(['A BAG OF CHERRIES · TASTY','A PORK PIE · LOVELY','A SLICE OF VICTORIA SPONGE','A BAG OF APPLES','A WEDGE OF CHEDDAR']))}};
 return b}}
const pk=a=>a[Math.floor(Math.random()*a.length)];

/* ---------------------------------------------------------------- narrowboats */
const CL=[];{let acc=0;for(let i=0;i<CAN.length-1;i++){const a=CAN[i],b=CAN[i+1],l=Math.hypot(b[0]-a[0],b[1]-a[1]);CL.push({a,b,l,s0:acc});acc+=l}CL.tot=acc}
const canAt=s=>{s=clamp(s,0,CL.tot);for(const q of CL)if(s<=q.s0+q.l){const t=(s-q.s0)/q.l,dx=(q.b[0]-q.a[0])/q.l,dz=(q.b[1]-q.a[1])/q.l;return[q.a[0]+(q.b[0]-q.a[0])*t,q.a[1]+(q.b[1]-q.a[1])*t,dx,dz]}const q=CL[CL.length-1];return[q.b[0],q.b[1],1,0]};
const BCOL=[[.1,.35,.2],[.6,.1,.12],[.12,.2,.5],[.4,.15,.4],[.08,.3,.32]];
const boatMesh=(c)=>mk((B,L)=>{pbox(B,0,-.4,0,18,.95,2.1,[.08,.08,.09]);pbox(B,8.2,-.4,0,1.8,.95,1.6,[.08,.08,.09]);pbox(B,-.6,.55,0,14,1.2,1.9,c);pbox(B,-.6,.55,0,14.04,.16,1.94,[.95,.8,.2]);pbox(B,-.6,1.75,0,14.2,.12,2,[.2,.2,.22]);
 for(let i=0;i<6;i++)for(const sd of[1,-1])pbox(L,-6+i*2.2,1,sd*.97,.7,.5,.04,[1,1,1]);pbox(B,3,1.87,0,.25,.9,.25,[.1,.1,.1]);for(let k=0;k<4;k++)pbox(B,-4+k*1.6,1.87,0,.5,.35,.5,k%2?[.8,.3,.2]:[.2,.5,.2]);pbox(B,-8.6,.6,0,.1,1.1,.1,[.4,.25,.15])});
for(let i=0;i<3;i++){const g=boatMesh(BCOL[i]);scene.add(g);T.boats.push({g,s:200+i*430,dir:i%2?-1:1,v:1.3+i*.15})}
for(let i=0;i<4;i++){const g=boatMesh(BCOL[(i+3)%5]),q=canAt(780+i*21);g.position.set(q[0]-q[3]*2.6,G0-.1,q[1]+q[2]*2.6);g.rotation.y=Math.atan2(q[2],q[3])-Math.PI/2;scene.add(g);T.moored.push(g)}
function updBoats(dt){for(const b of T.boats){b.s+=b.dir*b.v*dt;if(b.s>CL.tot-20){b.s=CL.tot-20;b.dir=-1}else if(b.s<20){b.s=20;b.dir=1}
  /* slow through the locks */const q=canAt(b.s);b.v=Math.abs(q[0]-150)<25||Math.abs(q[0]-650)<25?.5:1.4;
  const lat=-1.3*b.dir;b.g.position.set(q[0]-q[3]*lat,G0-.1+Math.sin(performance.now()/900+b.s)*.03,q[1]+q[2]*lat);b.g.rotation.y=Math.atan2(q[2]*b.dir,q[3]*b.dir)-Math.PI/2;b.g.visible=nearC(q[0],q[1],scene.fog.far)}
 for(const g of T.moored)g.visible=nearC(g.position.x,g.position.z,scene.fog.far)}

/* ---------------------------------------------------------------- clock, windmill, ducks + swans, sheep */
function drawClock(){const c=T.clock,h=GT%24,m=Math.floor((GT%1)*60);const k=Math.floor(h)*60+m;if(k===c.last)return;c.last=k;const g=c.cv.getContext('2d');g.clearRect(0,0,128,128);
 g.fillStyle='#f6f0dc';g.beginPath();g.arc(64,64,60,0,TAU);g.fill();g.lineWidth=5;g.strokeStyle='#1a1a1a';g.stroke();g.fillStyle='#1a1a1a';for(let i=0;i<12;i++){const a=i/12*TAU;g.save();g.translate(64+Math.sin(a)*49,64-Math.cos(a)*49);g.rotate(a);g.fillRect(-2,-6,4,i%3?8:12);g.restore()}
 const hand=(a,l,w)=>{g.save();g.translate(64,64);g.rotate(a);g.fillRect(-w/2,-l,w,l+6);g.restore()};hand((h%12+m/60)/12*TAU,30,6);hand(m/60*TAU,46,4);g.beginPath();g.arc(64,64,5,0,TAU);g.fill();c.ct.needsUpdate=true}
const duckG=new THREE.BoxGeometry(1,1,1),dkM=new THREE.MeshBasicMaterial({color:0x6a5a3a}),swM=new THREE.MeshBasicMaterial({color:0xf4f4f0}),hdM=new THREE.MeshBasicMaterial({color:0x1a6a3a}),bkM=new THREE.MeshBasicMaterial({color:0xf08a20});
for(const d of T.ducks){const g=new THREE.Group(),s=d.swan?1.6:1,b=new THREE.Mesh(duckG,d.swan?swM:dkM);b.scale.set(.32*s,.22*s,.5*s);b.position.y=.1;const h=new THREE.Mesh(duckG,d.swan?swM:hdM);h.scale.set(.14*s,d.swan?.6:.18,.14*s);h.position.set(0,d.swan?.45:.28,.22*s);const k=new THREE.Mesh(duckG,bkM);k.scale.set(.06*s,.05,.12*s);k.position.set(0,d.swan?.72:.3,.33*s);g.add(b,h,k);scene.add(g);d.g=g}
function updDucks(dt){const t=performance.now()/1000;for(const d of T.ducks){const p=d.p,a=d.a+t*.09*(d.swan?.6:1)/d.r,x=p[0]+Math.cos(a)*p[2]*d.r*1.4,z=p[1]+Math.sin(a)*p[3]*d.r*1.4;d.g.position.set(x,G0+.02,z);d.g.rotation.y=Math.atan2(-Math.sin(a),Math.cos(a));d.g.visible=nearC(x,z,220)}}
let shIM=null;{const B=new Builder(3);pbox(B,0,.45,0,.75,.6,1.15,[.95,.94,.9]);pbox(B,0,.62,.68,.34,.36,.4,[.12,.12,.12]);for(const[a,b]of[[-.22,-.35],[.22,-.35],[-.22,.35],[.22,.35]])pbox(B,a,0,b,.12,.45,.12,[.12,.12,.12]);
 const m=B.mesh(mObj);shIM=new THREE.InstancedMesh(m.geometry,mObj,Math.max(1,T.sheep.length));shIM.frustumCulled=false;scene.add(shIM)}
const M4=new THREE.Matrix4(),Q=new THREE.Quaternion(),V=new THREE.Vector3(),S1=new THREE.Vector3(1,1,1),YA=new THREE.Vector3(0,1,0);
function updSheep(dt){const near=nearC(0,-900,900)&&cam.position.z<-450;shIM.visible=near&&!GS.inside;if(!shIM.visible)return;
 T.sheep.forEach((s,i)=>{if(!s.tx||Math.random()<dt*.05){s.tx=clamp(s.x+(Math.random()-.5)*14,s.x0,s.x1);s.tz=clamp(s.z+(Math.random()-.5)*14,s.z0,s.z1)}const dx=s.tx-s.x,dz=s.tz-s.z,d=Math.hypot(dx,dz);if(d>.3&&Math.random()<.7){s.x+=dx/d*.35*dt;s.z+=dz/d*.35*dt;s.a=Math.atan2(dx,dz)}
  Q.setFromAxisAngle(YA,s.a);V.set(s.x,G0,s.z);M4.compose(V,Q,S1);shIM.setMatrixAt(i,M4)});shIM.instanceMatrix.needsUpdate=true}
let baaT=6;

/* ---------------------------------------------------------------- more people + traffic, always recycled near you */
const WS=SEG.filter(q=>q.l>30&&ROADS[q.ri].nw&&!ROADS[q.ri].rural&&ROADS[q.ri].n!=='MARKET PLACE'),ESEG=[];
const nearSeg=(lo,hi)=>{const c=cam.position,L=WS.filter(s=>{const mx=(s.a[0]+s.b[0])/2,mz=(s.a[1]+s.b[1])/2,d=Math.hypot(mx-c.x,mz-c.z);return d>lo&&d<hi});return L.length?L[Math.floor(Math.random()*L.length)]:null};
const XN=[];{const sh=[[.8,.2,.2],[.2,.35,.7],[.9,.85,.3],[.25,.55,.35],[.85,.85,.88],[.5,.25,.5],[.9,.5,.2],[.3,.3,.35]],lg=[[.18,.2,.35],[.15,.15,.17],[.4,.35,.25],[.2,.3,.45]],sk=[[.9,.7,.55],[.75,.55,.4],[.55,.38,.28]],hr=[[.2,.12,.07],[.1,.08,.06],[.7,.5,.2],[.6,.6,.6]];
 for(let i=0;i<34;i++){const s=WS[(i*37)%WS.length],len=Math.min(s.l-12,40+Math.random()*60),t0=6+Math.random()*Math.max(1,s.l-len-12),g=mkPerson(pSpec(i+60),mObj,scene),cl=[0,0,.4];COL.push(cl);const n={g,s,sd:i%2?1:-1,t0,t1:t0+len,t:t0+Math.random()*len,dir:Math.random()<.5?1:-1,sp:1.1+Math.random()*.5,ph:Math.random()*6,cl};NPC.push(n);XN.push(n)}}
const XC=[];{const cols=[[.7,.1,.1],[.1,.2,.5],[.85,.85,.88],[.1,.1,.12],[.3,.5,.3],[.9,.75,.1],[.5,.5,.55],[.5,.2,.5],[.2,.45,.6],[.8,.4,.1]];
 for(let i=0;i<14;i++){const s=WS[(i*53+7)%WS.length],cl=[[0,0,.85],[0,0,.85],[0,0,.85]];cl.forEach(q=>COL.push(q));const a={cv:civAdd({m:[0,1,3,1,2,0,1,0,3,1][i%10],col:cols[i%10],x:0,z:0,rot:0}),s,dir:i%2?1:-1,t:8+Math.random()*(s.l-16),v:0,vmax:7+Math.random()*4,cl};AIC.push(a);XC.push(a)}}
let recT=0;
function recycle(){if(!inTown())return;const c=cam.position;for(const n of XN){const x=n.s.a[0]+n.s.dx*n.t,z=n.s.a[1]+n.s.dz*n.t;if(Math.hypot(x-c.x,z-c.z)<330)continue;const s=nearSeg(40,230);if(!s)break;const len=Math.min(s.l-12,40+Math.random()*60);n.s=s;n.t0=6+Math.random()*Math.max(1,s.l-len-12);n.t1=n.t0+len;n.t=n.t0+Math.random()*len}
 for(const a of XC){const x=a.s.a[0]+a.s.dx*a.t,z=a.s.a[1]+a.s.dz*a.t;if(Math.hypot(x-c.x,z-c.z)<380)continue;const s=nearSeg(90,300);if(!s)break;a.s=s;a.t=8+Math.random()*(s.l-16);a.v=0}}

/* ---------------------------------------------------------------- tick */
{const u0=updCozy;updCozy=function(dt){u0(dt);if(menuOpen)return;
 updTrain(dt);updXings(dt);updBoats(dt);if(T.sails&&nearC(ZONE.windmill[0],ZONE.windmill[1],scene.fog.far+40))T.sails.rotation.z-=dt*.55;
 if(nearC(T.hall[0],T.hall[1],420))drawClock();updDucks(dt);updSheep(dt);
 baaT-=dt;if(baaT<0){baaT=5+Math.random()*9;if(inTown()&&T.sheep.some(s=>Math.hypot(s.x-pos().x,s.z-pos().z)<40)){beep(300,.35,'sawtooth',.03);setTimeout(()=>beep(280,.4,'sawtooth',.025),180)}}
 recT-=dt;if(recT<0){recT=1.5;recycle()}}}
{const a0=applySeason;applySeason=function(i){a0(i);for(const me of T.grM||[]){me.geometry.attributes.color.array.set(i?me.userData.cw:me.userData.cs);me.geometry.attributes.color.needsUpdate=true}}}
window.TOWN2={ticket,ride,TR,recycle};
})();
