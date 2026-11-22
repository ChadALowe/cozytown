/* ===== MARLOWE ACTIVITIES (city only):
   · THE MARLOWE EYE: ride a pod right round the wheel, look about, snap photos.
   · SKY TOWER "SPOT IT!": lift to the deck, coin binoculars, find the landmarks you're asked for (real 3D view of the city).
   · BUSKING at Marlowe Circus: a 4-lane rhythm game; play well and a crowd gathers and tips you.
   · MARLE SPEEDBOATS: time trial up the river through buoy gates and under the three bridges.
   · MARLOWE METRO: ride the underground between the 7 Metro stations.
   Do each once for a MARLOWE PASSPORT stamp; all five pays a bonus. ===== */
(function(){
const MW=window.MARLOWE,M=MW.M,{OX,OZ,CITY,KH}=MW,A=window.AIRPORT,Y=G0,TAU=Math.PI*2;
const W=(u,v)=>[OX+u,OZ+v];
const inCity=()=>M.built&&!GS.inside&&MW.inReg(P.x,P.z);
/* ------------------------------------------------------------------ passport */
const PASS={st:{},best:0,paid:0};const STAMPS={eye:'THE MARLOWE EYE',sky:'SKY TOWER SPOT IT!',busk:'BUSKING AT THE CIRCUS',boat:'MARLE SPEEDBOATS',metro:'MARLOWE METRO'};
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.m5=PASS;return o};cozyLoad=function(z){l0(z);if(z&&z.m5)Object.assign(PASS,z.m5)}}
function stamp(k){if(PASS.st[k])return;PASS.st[k]=1;if(window.REP)REP.add('tourist',6);const n=Object.keys(PASS.st).length;setTimeout(()=>{toast('MARLOWE PASSPORT STAMP: '+STAMPS[k]+' ('+n+'/5)');beep(784,.1,'square',.05);setTimeout(()=>beep(1046,.14,'square',.05),110)},1800);
 if(n>=5&&!PASS.paid){PASS.paid=1;setTimeout(()=>{cash+=300;toast('PASSPORT COMPLETE! THE TOURIST BOARD SENDS YOU £300');try{phText('MARLOWE TOURIST BOARD','Congratulations! You\'ve done everything Marlowe has to offer. Here\'s £300 to spend in the city.')}catch(e){czErr(e,"marlowe5.js")}},4200)}}
/* ------------------------------------------------------------------ activity framework: freeze the player, take the camera, show a HUD */
const ACT={on:0};
const hud=document.createElement('div');hud.style.cssText='position:fixed;inset:0;z-index:70;display:none;pointer-events:none;font:bold 13px ui-monospace,monospace;color:#fff;user-select:none;touch-action:none';document.body.appendChild(hud);
const top=document.createElement('div');top.style.cssText='position:absolute;left:50%;top:12px;transform:translateX(-50%);background:rgba(10,16,30,.85);border:3px solid #f5e6a0;border-radius:12px;padding:6px 14px;text-align:center;line-height:1.4;max-width:92vw;white-space:pre-line';hud.appendChild(top);
const bar=document.createElement('div');bar.style.cssText='position:absolute;left:0;right:0;bottom:14px;display:flex;justify-content:center;gap:10px;flex-wrap:wrap;pointer-events:none';hud.appendChild(bar);
const drag=document.createElement('div');drag.style.cssText='position:absolute;inset:0;pointer-events:none';hud.insertBefore(drag,top);
function btns(list){bar.innerHTML='';for(const[t,down,up]of list){const b=document.createElement('button');b.textContent=t;b.style.cssText='pointer-events:auto;font:bold 18px ui-monospace,monospace;min-width:64px;height:56px;border:3px solid #f5e6a0;border-radius:12px;background:#1b2a3add;color:#fff;padding:0 12px;touch-action:none';
  b.onpointerdown=e=>{e.preventDefault();e.stopPropagation();down&&down()};b.onpointerup=b.onpointercancel=b.onpointerleave=e=>{up&&up()};bar.appendChild(b)}}
let fog0=null;
function actStart(k,o,force){if(ACT.on||(!force&&(busy||menuOpen)))return false;Object.assign(ACT,{on:1,k,t:0,yaw:0,pitch:0,fov:55,cam:null,tick:null,end:null,fog:0,look:{l:0,r:0,u:0,d:0}},o);busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;hud.style.display='block';drag.style.pointerEvents=ACT.dragLook?'auto':'none';if(ACT.fog&&scene.fog){fog0=[scene.fog.near,scene.fog.far]}return true}
function actEnd(){if(!ACT.on)return;const e=ACT.end;ACT.on=0;hud.style.display='none';bar.innerHTML='';busy=0;if(fog0&&scene.fog){scene.fog.near=fog0[0];scene.fog.far=fog0[1];fog0=null}cam.fov=fovNow;cam.updateProjectionMatrix();e&&e();setLabels&&setLabels()}
/* drag to look */{let pd=null;drag.addEventListener('pointerdown',e=>{pd={x:e.clientX,y:e.clientY};drag.setPointerCapture(e.pointerId)});drag.addEventListener('pointermove',e=>{if(!pd||!ACT.on)return;const k=.0045*(ACT.fov/55);ACT.yaw-=(e.clientX-pd.x)*k;ACT.pitch=Math.max(-1.1,Math.min(.6,ACT.pitch-(e.clientY-pd.y)*k));pd={x:e.clientX,y:e.clientY}});drag.addEventListener('pointerup',()=>pd=null);drag.addEventListener('pointercancel',()=>pd=null)}
addEventListener('keydown',e=>{if(!ACT.on)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();ACT.quit?ACT.quit():actEnd();return}ACT.key&&ACT.key(e,1)},true);
addEventListener('keyup',e=>{if(ACT.on&&ACT.key)ACT.key(e,0)},true);
{const u0=updateCam;updateCam=function(dt){u0(dt);if(!ACT.on||!ACT.cam)return;ACT.cam(dt);if(Math.abs(cam.fov-ACT.fov)>.01){cam.fov+=(ACT.fov-cam.fov)*Math.min(1,dt*6);cam.updateProjectionMatrix()}skyG.position.copy(cam.position)}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!ACT.on)return;ACT.t+=dt;if(ACT.fog&&scene.fog){scene.fog.far=ACT.fog;scene.fog.near=ACT.fog*.45}ACT.tick&&ACT.tick(dt)}}
const lookDir=()=>[Math.sin(ACT.yaw)*Math.cos(ACT.pitch),Math.sin(ACT.pitch),Math.cos(ACT.yaw)*Math.cos(ACT.pitch)];
function arrowLook(dt){const L=ACT.look,k=dt*1.2*(ACT.fov/55);if(L.l||keys.left)ACT.yaw+=k;if(L.r||keys.right)ACT.yaw-=k;if(L.u||keys.up)ACT.pitch=Math.min(.6,ACT.pitch+k*.7);if(L.d||keys.down)ACT.pitch=Math.max(-1.1,ACT.pitch-k*.7)}
const lookBtns=()=>[['◀',()=>ACT.look.l=1,()=>ACT.look.l=0],['▲',()=>ACT.look.u=1,()=>ACT.look.u=0],['▼',()=>ACT.look.d=1,()=>ACT.look.d=0],['▶',()=>ACT.look.r=1,()=>ACT.look.r=0]];
function flash(){const f=document.createElement('div');f.style.cssText='position:fixed;inset:0;background:#fff;z-index:90;pointer-events:none;transition:opacity .5s';document.body.appendChild(f);requestAnimationFrame(()=>{f.style.opacity=0});setTimeout(()=>f.remove(),600);beep(1400,.05,'square',.05)}
/* ------------------------------------------------------------------ places */
const EYE={u:-686.5,v:377.5};
const skyB=MW.BLK.find(b=>b.sp==='skytower'),SKY={cu:(skyB.u0+4.5+skyB.u1-6)/2,cv:(skyB.v0+skyB.v1)/2};SKY.u=SKY.cu;SKY.v=SKY.cv-14;
const BUSK={u:-403.2,v:-236,face:-Math.PI/2};
const PIER={u:-771.5,v:-262};
const METN=['MARLOWE CIRCUS','SKY TOWER','GEORGE STREET','HIGH STREET','OLD TOWN','NORTH ROAD','THE DOCKS'];
const metros=()=>CITY.poi.filter(p=>p.metro).map((p,i)=>({u:p.u,v:p.v,n:METN[i]||('STATION '+(i+1))}));
CITY.poi.push({n:'THE MARLOWE EYE · TICKETS',u:EYE.u,v:EYE.v,ic:'🎡'},{n:'BUSKING PITCH',u:BUSK.u,v:BUSK.v,ic:'🎸'},{n:'MARLE SPEEDBOATS',u:PIER.u,v:PIER.v,ic:'🚤'});
/* the use button */
{const c0=ctx;ctx=function(){const b=c0();if(!inCity()||!GS.onFoot||ACT.on)return b;const d=(u,v)=>Math.hypot(P.x-OX-u,P.z-OZ-v);let best=null,bd=2.6;
 const cand=[[EYE,'RIDE THE MARLOWE EYE £8',eyeRide],[{u:SKY.u,v:SKY.v},'SKY TOWER: OBSERVATION DECK £12',skyGo],[BUSK,'BUSK HERE (EARN TIPS)',buskGo],[PIER,'MARLE SPEEDBOAT TIME TRIAL £15',boatGo]];
 for(const[p,l,f]of cand){const dd=d(p.u,p.v);if(dd<bd){bd=dd;best={label:l,fn:f}}}
 for(const m of metros()){const dd=d(m.u,m.v);if(dd<3.6&&(!best||dd<bd+1)){bd=dd;best={label:'MARLOWE METRO: '+m.n+' (£2)',fn:()=>metroMenu(m)}}}
 return best||b}}
/* markers + props in the street (built once the city exists) */
let props=null;const MK=[];
function dressProps(){props=new THREE.Group();const add=(m,x,y,z)=>{m.position.set(x,y,z);props.add(m);return m},bm=(w,h,d,c)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:c})),y0=Y+KH;
 /* eye ticket booth */{const p=W(EYE.u,EYE.v-1.6);add(bm(2.2,2.4,1.4,0x0c2a4a),p[0],y0+1.2,p[1]);add(bm(2.4,.2,1.6,0xffffff),p[0],y0+2.5,p[1]);const s=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.5),new THREE.MeshBasicMaterial({map:txtTex(256,60,'#0c2a4a','#9ad0ff','TICKETS £8',36)}));s.position.set(p[0],y0+2.1,p[1]+.72);props.add(s)}
 /* busking pitch: chalk ring + open guitar case */{const p=W(BUSK.u,BUSK.v);const r=new THREE.Mesh(new THREE.RingGeometry(2.6,2.8,40).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0xf4f0e8,transparent:true,opacity:.7,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4}));add(r,p[0]-1.2,y0+.02,p[1]);const c=add(bm(1.1,.12,.42,0x2a1a10),p[0]-1.1,y0+.06,p[1]+.9);add(bm(.9,.04,.32,0x8a1a2a),p[0]-1.1,y0+.13,p[1]+.9)}
 /* speedboat pier: pontoon, moored boat, sign */{const p=W(PIER.u+5,PIER.v);add(bm(10,.3,3,0x8a6a4a),p[0],Y-3.15,p[1]);for(let k=0;k<6;k++){const q=W(-767.4+k*.0,PIER.v+1.6+k*.0);add(bm(1.2,.12,.5,0x8a6a4a),OX-766.8+k*.45,Y+.05-k*.55,OZ+PIER.v-1.0)}add(bm(.06,1,.06,0xdddddd),OX-764,Y-2.6,OZ+PIER.v-1.4);const bt=boatMesh();bt.position.set(OX-758,Y-3.25,OZ+PIER.v+3.2);bt.rotation.y=0;props.add(bt);const ps=W(PIER.u,PIER.v-1.8);const s=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.6),new THREE.MeshBasicMaterial({map:txtTex(320,74,'#0e3a6a','#ffffff','MARLE SPEEDBOATS',30),side:THREE.DoubleSide}));s.position.set(ps[0],y0+2.3,ps[1]);s.rotation.y=Math.PI/2;props.add(s);add(bm(.1,2.4,.1,0xdddddd),ps[0],y0+1.2,ps[1])}
 A.chunk(M,props);
 /* bobbing cyan arrows over the four activities */const cone=new THREE.ConeGeometry(.34,.7,4);cone.rotateX(Math.PI);cone.translate(0,-.35,0);const am=new THREE.MeshBasicMaterial({color:0x40e0ff,fog:false});
 for(const p of[EYE,{u:SKY.u,v:SKY.v},BUSK,PIER]){const g=new THREE.Mesh(cone,am);g.visible=false;scene.add(g);const w=W(p.u,p.v);MK.push({g,x:w[0],z:w[1]})}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!props&&MW.CITY.built)dressProps();const t=performance.now()/1000,px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,show=!GS.inside&&!menuOpen&&!ACT.on&&M.active;
 for(const m of MK){const d=Math.hypot(m.x-px,m.z-pz),v=show&&d<40;m.g.visible=v;if(v){m.g.position.set(m.x,Y+KH+2.8+Math.sin(t*3.2+m.x)*.18,m.z);m.g.rotation.y=t*1.2;m.g.scale.setScalar(Math.max(.7,Math.min(1.3,d/14)))}}}}
const pay=p=>{if(cash<p){toast('NOT ENOUGH CASH (£'+p+')');return false}cash-=p;return true};
/* ------------------------------------------------------------------ 1. THE MARLOWE EYE */
function eyeRide(){const w=CITY.wheel;if(!w||!pay(8))return;const T=60;let snaps=0,atTop=0;
 if(!actStart('eye',{fog:1500,dragLook:1,yaw:-Math.PI/2,pitch:-.12,fov:62}))return;man.visible=false;w.pods[0].visible=false;toast('ALL ABOARD! DRAG OR USE THE ARROWS TO LOOK AROUND');
 btns([...lookBtns(),['📷',()=>{flash();snaps++;toast('PHOTO SAVED! ('+snaps+')')}],['✕',()=>actEnd()]]);
 ACT.tick=dt=>{arrowLook(dt);const f=Math.min(1,ACT.t/T),th=Math.PI/2+TAU*(f*f*(3-2*f));w.g.rotation.x=th;for(const p of w.pods)p.rotation.x=-th;const h=Math.round(36-31*Math.sin(th));
  topTxt('🎡 THE MARLOWE EYE · '+Math.max(0,h)+' M UP\n'+(h>60?'THE VERY TOP! THE WHOLE CITY BELOW':'DRAG TO LOOK · 📷 TAKE A PHOTO'));if(h>62&&!atTop){atTop=1;toast('THE TOP! 67 METRES ABOVE THE MARLE')}if(ACT.t>=T)actEnd()};
 ACT.cam=()=>{const p=w.pods[0];w.g.updateMatrixWorld(true);const v=new THREE.Vector3();p.getWorldPosition(v);cam.position.set(v.x+.7,v.y-1.0,v.z);const d=lookDir();cam.lookAt(v.x+.7+d[0]*10,v.y-1.0+d[1]*10,v.z+d[2]*10)};
 ACT.end=()=>{man.visible=true;w.pods[0].visible=true;stamp('eye');toast('WHAT A VIEW! '+(snaps?snaps+' PHOTO'+(snaps>1?'S':'')+' TAKEN':''))}}
const topTxt=s=>{if(top._s!==s){top._s=s;top.textContent=s}};
/* ------------------------------------------------------------------ 2. SKY TOWER: SPOT IT! */
function skyGo(){if(!pay(12))return;const LM={'MARLOWE CENTRAL STATION':14,"ST MARLOWE'S CATHEDRAL":30,'MARLOWE TOWN HALL':22,'MARLOWE ARENA':14,'WESTBANK PARK':4,'THE MARLOWE EYE':36,'MARLOWE CIRCUS':12,'MARKET SQUARE':4,'RIVERSIDE GARDENS':4,'THE GRAND MARLOWE':20,'MARLOWE AIRPORT':10,'NORTH QUAY':3,'THE DOCKS':10};const marks=CITY.poi.filter(p=>LM[p.n]!=null&&!/TICKETS/.test(p.n)).filter((p,i,a)=>a.findIndex(q=>q.n===p.n)===i);
 const pool=marks.sort(()=>Math.random()-.5).slice(0,6);let i=0,found=0,zoom=0,lift=4.5,msg='';const LIM=90,y1=Y+KH+168.5,R=19;
 if(!actStart('sky',{fog:1800,dragLook:1,yaw:Math.PI,pitch:-.1,fov:55}))return;man.visible=false;
 const vig=document.createElement('div');vig.style.cssText='position:absolute;inset:0;pointer-events:none;display:none;background:radial-gradient(circle at 50% 50%,transparent 0,transparent 30vmin,#000 31vmin)';hud.insertBefore(vig,top);
 const cross=document.createElement('div');cross.style.cssText='position:absolute;left:50%;top:50%;width:34px;height:34px;margin:-17px 0 0 -17px;border:3px solid #ff3a3a;border-radius:50%;pointer-events:none;display:none;box-shadow:0 0 0 2px #000a';hud.insertBefore(cross,top);
 const spot=()=>{if(lift>0||i>=pool.length)return;const t=pool[i],d=lookDir(),tx=OX+t.u-cam.position.x,ty=Y+LM[t.n]-cam.position.y,tz=OZ+t.v-cam.position.z,l=Math.hypot(tx,ty,tz),dot=(d[0]*tx+d[1]*ty+d[2]*tz)/l,ang=Math.acos(Math.min(1,dot))*180/Math.PI;
  if(ang<(zoom?3.2:6)){found++;cash+=8;beep(988,.08,'square',.05);setTimeout(()=>beep(1318,.12,'square',.05),90);msg='FOUND IT! +£8';i++;if(i>=pool.length)ACT.t=LIM+1}else{beep(180,.12,'sawtooth',.05);msg=ang<20?'SO CLOSE! A LITTLE MORE…':'NOT THERE, KEEP LOOKING'}};
 btns([...lookBtns(),['🔭 ZOOM',()=>{zoom=!zoom;ACT.fov=zoom?16:55;vig.style.display=zoom?'block':'none'}],['SPOT!',spot],['✕',()=>actEnd()]]);
 ACT.key=(e,dn)=>{if(dn&&(e.key===' '||e.key==='Enter')){e.preventDefault();spot()}if(dn&&(e.key==='z'||e.key==='Z')){zoom=!zoom;ACT.fov=zoom?16:55;vig.style.display=zoom?'block':'none'}};
 ACT.tick=dt=>{if(lift>0){lift-=dt;topTxt('🗼 THE LIFT IS RISING… '+Math.round(168*(1-Math.max(0,lift)/4.5))+' M');if(lift<=0){cross.style.display='block';toast('COIN BINOCULARS: FIND EACH LANDMARK, THEN PRESS SPOT!')}return}
  arrowLook(dt);const left=Math.max(0,LIM-(ACT.t-4.5)),t=pool[i];if(!t||left<=0){actEnd();return}const dx=OX+t.u-cam.position.x,dz=OZ+t.v-cam.position.z,b=Math.atan2(dx,dz),dirs=['NORTH','NORTH-EAST','EAST','SOUTH-EAST','SOUTH','SOUTH-WEST','WEST','NORTH-WEST'];
  const comp=dirs[((Math.round(b/(Math.PI/4))%8)+8)%8];topTxt('🔭 FIND: '+t.n+'  ('+(i+1)+'/'+pool.length+')\nIT\'S TO THE '+comp+' · '+Math.round(Math.hypot(dx,dz))+' M AWAY · '+Math.ceil(left)+'s'+(msg?'\n'+msg:''))};
 ACT.cam=()=>{if(lift>0){const f=1-lift/4.5,e=f*f*(3-2*f),p=W(SKY.cu,SKY.cv-26);cam.position.set(p[0],Y+4+e*(y1-Y-4),p[1]);cam.lookAt(OX+SKY.cu,cam.position.y+2,OZ+SKY.cv);return}
  const d=lookDir(),yaw=Math.atan2(d[0],d[2]);cam.position.set(OX+SKY.cu+Math.sin(yaw)*R,y1,OZ+SKY.cv+Math.cos(yaw)*R);cam.lookAt(cam.position.x+d[0]*10,cam.position.y+d[1]*10,cam.position.z+d[2]*10)};
 ACT.end=()=>{vig.remove();cross.remove();man.visible=true;toast('SPOT IT! YOU FOUND '+found+' OF '+pool.length+' · £'+found*8);if(found>=3)stamp('sky')}}
/* ------------------------------------------------------------------ 3. BUSKING */
const INST=[['GUITAR','triangle',1],['SAXOPHONE','square',.5],['VIOLIN','sawtooth',1]];
function buskGo(){const g=new THREE.Group(),crowd=[];let inst=0,score=0,combo=0,best=0,hits=0,tips=0,started=0;const LANES=4,FALL=1.6,LEN=42,BPM=112,BEAT=60/BPM;
 const scale=[262,294,330,392,440,523,587,659];const notes=[];{let tt=2,k=0,s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;while(tt<LEN){const ln=Math.floor(r()*4);notes.push({t:tt,l:ln,p:scale[(ln*2+Math.floor(r()*2))%8],hit:0});tt+=BEAT*(r()<.25?.5:r()<.85?1:2);k++}}
 const p=W(BUSK.u,BUSK.v);P.x=p[0];P.z=p[1];P.psi=BUSK.face;P.y=Y+KH;
 if(!actStart('busk',{yaw:0,fov:58}))return;man.visible=true;
 const cv=document.createElement('canvas');cv.width=360;cv.height=430;cv.style.cssText='position:absolute;left:50%;bottom:84px;transform:translateX(-50%);width:min(88vw,360px);pointer-events:none';hud.insertBefore(cv,bar);const cg=cv.getContext('2d');
 const press=l=>{if(!started)return;const t=ACT.t-1;let bn=null,bd=.17;for(const n of notes){if(n.hit||n.l!==l)continue;const d=Math.abs(n.t-t);if(d<bd){bd=d;bn=n}}
  if(bn){bn.hit=bd<.07?2:1;score+=bn.hit===2?100:50;combo++;hits++;best=Math.max(best,combo);beep(bn.p*INST[inst][2],.16,INST[inst][1],.06);if(crowd.length&&Math.random()<.18*crowd.length/3){const c=1+(Math.random()<.3?1:0);cash+=c;tips+=c;beep(1760,.05,'square',.03)}}else{combo=0;beep(110,.08,'sawtooth',.04)}};
 btns([['←',()=>press(0)],['↓',()=>press(1)],['↑',()=>press(2)],['→',()=>press(3)],['✕',()=>{actEnd()}]]);
 ACT.key=(e,dn)=>{if(!dn||e.repeat)return;const m={ArrowLeft:0,a:0,A:0,ArrowDown:1,s:1,S:1,ArrowUp:2,w:2,W:2,ArrowRight:3,d:3,D:3}[e.key];if(m!=null){e.preventDefault();e.stopPropagation();press(m)}if(!started&&(e.key==='1'||e.key==='2'||e.key==='3'))inst=+e.key-1};
 /* pick an instrument first */
 bar.innerHTML='';INST.forEach(([n],k)=>{const b=document.createElement('button');b.textContent=['🎸','🎷','🎻'][k]+' '+n;b.style.cssText='pointer-events:auto;font:bold 16px ui-monospace,monospace;height:56px;border:3px solid #f5e6a0;border-radius:12px;background:#1b2a3add;color:#fff;padding:0 12px';b.onclick=e=>{e.stopPropagation();inst=k;started=1;ACT.t=0;btns([['←',()=>press(0)],['↓',()=>press(1)],['↑',()=>press(2)],['→',()=>press(3)],['✕',()=>actEnd()]])};bar.appendChild(b)});
 const pv=W(BUSK.u-1.1,BUSK.v+.9);const prop=new THREE.Mesh(new THREE.BoxGeometry(.25,.9,.08),new THREE.MeshBasicMaterial({color:0x8a4a1a}));scene.add(prop);
 const addFan=()=>{const n=crowd.length,a=(-.9+(n%7)*.3)+(n>=7?.15:0),r=n>=7?3.6:2.6,g2=mkPerson(pSpec(5200+n*13),mObj,scene),wx=OX+BUSK.u-Math.cos(a)*r*.85-.4,wz=OZ+BUSK.v+Math.sin(a)*r*1.6;g2.position.set(wx,Y+KH,wz);g2.rotation.y=Math.atan2(P.x-wx,P.z-wz);g2.scale.setScalar(.95);crowd.push(g2);toast(pk(['A CROWD IS GATHERING!','SOMEONE STOPS TO LISTEN','"BRAVO!"','A TOURIST FILMS YOU ON THEIR PHONE','*CLAP CLAP*']))};
 ACT.tick=dt=>{const t=ACT.t-1;prop.position.set(P.x+Math.sin(P.psi+1.2)*.35,Y+KH+1.15,P.z+Math.cos(P.psi+1.2)*.35);prop.rotation.set(0,P.psi,.6);if(man.a1){man.a1.rotation.x=-1.1+Math.sin(ACT.t*9)*.15*(started?1:0);man.a2.rotation.x=-.9}
  for(const c of crowd){if(c.a1)c.a1.rotation.x=Math.sin(ACT.t*6+c.position.x)*.2-.3}
  const want=Math.min(10,Math.floor(combo/5)+Math.floor(hits/12));if(started&&crowd.length<want)addFan();
  cg.clearRect(0,0,360,430);cg.fillStyle='rgba(10,14,28,.78)';cg.fillRect(0,0,360,430);const lw=360/LANES,hy=370;
  for(let l=0;l<LANES;l++){cg.fillStyle=['#ff5a6a','#5ac8ff','#7aff7a','#ffd24a'][l];cg.globalAlpha=.18;cg.fillRect(l*lw+4,0,lw-8,430);cg.globalAlpha=1;cg.font='bold 26px monospace';cg.textAlign='center';cg.fillText('←↓↑→'[l],l*lw+lw/2,hy+44)}
  cg.fillStyle='#fff';cg.fillRect(0,hy-2,360,4);
  if(!started){cg.fillStyle='#ffd24a';cg.font='bold 18px monospace';cg.textAlign='center';cg.fillText('PICK YOUR INSTRUMENT',180,170);cg.fillStyle='#fff';cg.font='bold 13px monospace';cg.fillText('HIT THE NOTES AS THEY CROSS THE LINE',180,200);cg.fillText('ARROW KEYS OR THE BUTTONS',180,222);topTxt('🎸 BUSKING AT MARLOWE CIRCUS');return}
  for(const n of notes){if(n.hit)continue;if(t>n.t+.17&&!n.miss){n.miss=1;combo=0}if(n.miss)continue;const y=hy-(n.t-t)/FALL*hy;if(y<-30||y>430)continue;cg.fillStyle=['#ff5a6a','#5ac8ff','#7aff7a','#ffd24a'][n.l];cg.beginPath();cg.arc(n.l*lw+lw/2,y,20,0,TAU);cg.fill();cg.strokeStyle='#fff';cg.lineWidth=3;cg.stroke()}
  topTxt(['🎸','🎷','🎻'][inst]+' BUSKING · SCORE '+score+' · COMBO '+combo+'\nCROWD '+crowd.length+' · TIPS £'+tips+' · '+Math.max(0,Math.ceil(LEN+1-ACT.t))+'s');if(t>LEN+.5)actEnd()};
 ACT.cam=()=>{const a=P.psi+Math.sin(ACT.t*.15)*.7,r=7.5;cam.position.set(P.x+Math.sin(a)*r,P.y+3.2,P.z+Math.cos(a)*r);cam.lookAt(P.x,P.y+1.3,P.z)};
 ACT.end=()=>{const bonus=Math.round(score/350)+crowd.length*2;if(started){cash+=bonus;tips+=bonus;if(window.REP&&score>=1000)REP.add('tourist',2);toast('SET OVER! SCORE '+score+' · BEST COMBO '+best+' · TOTAL TIPS £'+tips);if(score>=1500)stamp('busk')}cv.remove();scene.remove(prop);if(man.a1){man.a1.rotation.x=0;man.a2.rotation.x=0}setTimeout(()=>{for(const c of crowd){scene.remove(c);c.traverse(o=>{if(o.geometry)o.geometry.dispose()})}},2500)}}
const pk=a=>a[(Math.random()*a.length)|0];
/* ------------------------------------------------------------------ 4. MARLE SPEEDBOATS */
function boatMesh(){const b=new Builder(3);pbox(b,0,0,0,2.2,.7,6,[.95,.95,.97]);pbox(b,0,.05,3.1,1.3,.6,.9,[.95,.95,.97]);pbox(b,0,.68,-.6,2.0,.08,4.2,[.55,.38,.24]);pbox(b,0,.1,0,2.24,.18,6.02,[.08,.3,.6]);pbox(b,0,.75,.9,1.8,.55,.08,[.6,.8,.95]);pbox(b,0,.75,-2.2,1.6,.4,1.0,[.12,.12,.14]);pbox(b,0,.7,-3.0,.5,.6,.5,[.15,.15,.16]);
 const g=new THREE.Group();g.add(b.mesh(mObj));return g}
function boatGo(){if(!pay(15))return;const bt=boatMesh();scene.add(bt);let u=-730,v=-300,psi=0,sp=0,th=0,st=0,gi=0,pen=0,missed=0,done=0,countdown=3.2;
 const GATES=[-255,-140,-40,60,160,300,400,520,630,730,860,930].map((gv,k)=>({v:gv,u:gv===300||gv===860?(k%2?-730:-754):(k%2?-718:-745)+(k*7%9-4),ok:0,pass:0}));
 const bu=[];const bg=new THREE.Group();scene.add(bg);for(const g of GATES)for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.CylinderGeometry(.45,.55,1.4,10),new THREE.MeshBasicMaterial({color:s<0?0xe83030:0x30c050}));const p=W(g.u+s*5.5,g.v);m.position.set(p[0],Y-3.0,p[1]);bg.add(m);bu.push(m);const f=new THREE.Mesh(new THREE.ConeGeometry(.35,.6,8),new THREE.MeshBasicMaterial({color:0xffffff}));f.position.set(p[0],Y-2.05,p[1]);bg.add(f)}
 {const fin=new THREE.Mesh(new THREE.PlaneGeometry(22,2.4),new THREE.MeshBasicMaterial({map:txtTex(512,110,'#101010','#ffffff','FINISH',70),side:THREE.DoubleSide}));const p=W(-730,965);fin.position.set(p[0],Y+6,p[1]);bg.add(fin);for(const s of[-1,1]){const m=new THREE.Mesh(new THREE.BoxGeometry(.4,8,.4),new THREE.MeshBasicMaterial({color:0xeeeeee}));m.position.set(p[0]+s*11,Y+2,p[1]);bg.add(m)}}
 /* bridge piers to dodge */const PIERS=[];for(const j of MW.BRIDGE){const e=MW.EW[j];if(j===4){for(const pu of[-704,-756])for(const s of[-1,1])PIERS.push({c:1,u:pu,v:e.v+s*(e.h+5.2),r:1.8})}else for(const pu of[-718,-742])PIERS.push({c:0,u0:pu-2.2,u1:pu+2.2,v0:e.v-e.h-4.3,v1:e.v+e.h+4.3})}
 if(!actStart('boat',{fov:64}))return;man.visible=false;toast('THROTTLE ▲, STEER ◀ ▶. PASS BETWEEN THE RED AND GREEN BUOYS!');
 const ctl={g:0,b:0,l:0,r:0};btns([['◀',()=>ctl.l=1,()=>ctl.l=0],['▶',()=>ctl.r=1,()=>ctl.r=0],['BRAKE',()=>ctl.b=1,()=>ctl.b=0],['GAS',()=>ctl.g=1,()=>ctl.g=0],['✕',()=>actEnd()]]);
 const engine=()=>{};
 ACT.tick=dt=>{if(countdown>0){const c0=Math.ceil(countdown);countdown-=dt;const c1=Math.ceil(countdown);if(c1!==c0)beep(c1>0?440:880,.15,'square',.05);topTxt('🚤 MARLE SPEEDBOATS · '+(countdown>0?Math.ceil(countdown):'GO!'))}
  else if(!done){st+=dt;const g=(ctl.g||keys.up)?1:0,br=(ctl.b||keys.down)?1:0,s=((ctl.l||keys.left)?1:0)-((ctl.r||keys.right)?1:0);sp+=(g*15-br*20)*dt;sp-=sp*.35*dt;sp=Math.max(-4,Math.min(26,sp));psi+=s*dt*(.6+Math.min(1,Math.abs(sp)/10)*.9)*(sp<0?-1:1);
   let nu=u+Math.sin(psi)*sp*dt,nv=v+Math.cos(psi)*sp*dt;
   /* embankment walls */if(nu<-766.5||nu>-693.5){nu=Math.max(-766.5,Math.min(-693.5,nu));sp*=.55;psi=Math.atan2(-Math.sin(psi),Math.cos(psi));beep(90,.15,'sawtooth',.08);toast(pk(['BUMP! WATCH THE WALL','OOF! THE EMBANKMENT','CAREFUL, CAPTAIN!']))}
   for(const p of PIERS){if(p.c){const dx=nu-p.u,dv=nv-p.v,d=Math.hypot(dx,dv);if(d<p.r+1.1){nu=p.u+dx/d*(p.r+1.1);nv=p.v+dv/d*(p.r+1.1);sp*=.4;beep(90,.15,'sawtooth',.08)}}else if(nu>p.u0-1.1&&nu<p.u1+1.1&&nv>p.v0&&nv<p.v1){nu=u;nv=v;sp*=-.3;beep(90,.15,'sawtooth',.08);toast('YOU HIT A BRIDGE PIER!')}}
   for(const gt of GATES){if(gt.pass)continue;if((v-gt.v)*(nv-gt.v)<=0){gt.pass=1;if(Math.abs(nu-gt.u)<5.5){gt.ok=1;beep(1046,.08,'square',.05)}else{missed++;pen+=3;beep(200,.2,'sawtooth',.06);toast('MISSED A GATE! +3s')}}}
   u=nu;v=nv;th+=dt;if(v>=965){done=1;const total=st+pen;const reward=20+(total<70?30:total<85?15:0);cash+=reward;const pb=!PASS.best||total<PASS.best;if(pb)PASS.best=+total.toFixed(1);toast('FINISHED! '+total.toFixed(1)+'s'+(missed?' (INCL. '+pen+'s PENALTY)':'')+(pb?' · NEW BEST!':'')+' · +£'+reward);stamp('boat');setTimeout(()=>actEnd(),3500)}
   topTxt('🚤 '+(st+pen).toFixed(1)+'s · '+Math.round(Math.abs(sp)*2.24)+' MPH · GATES '+GATES.filter(g=>g.ok).length+'/'+GATES.length+(PASS.best?' · BEST '+PASS.best+'s':''))}
  const p=W(u,v);bt.position.set(p[0],Y-3.25+Math.sin(ACT.t*3)*.05,p[1]);bt.rotation.set(-Math.min(.12,Math.abs(sp)*.006),psi,((ctl.l||keys.left)?1:0)*-.06+((ctl.r||keys.right)?1:0)*.06);
  for(const m of bu)m.position.y=Y-3.0+Math.sin(ACT.t*2+m.position.x)*.08};
 ACT.cam=dt=>{const b=bt.position,d=8.5+Math.abs(sp)*.12;camAng+=Math.atan2(Math.sin(psi-camAng),Math.cos(psi-camAng))*Math.min(1,dt*3);cam.position.set(b.x-Math.sin(camAng)*d,b.y+1.95,b.z-Math.cos(camAng)*d);cam.lookAt(b.x+Math.sin(camAng)*4,b.y+.9,b.z+Math.cos(camAng)*4)};
 ACT.end=()=>{scene.remove(bt);scene.remove(bg);man.visible=true;const pp=W(PIER.u,PIER.v);if(v>=900){const q=W(-772,945);P.x=q[0];P.z=q[1]}else{P.x=pp[0];P.z=pp[1]}P.y=gH(P.x,P.z);P.psi=0;camAng=0}}
/* ------------------------------------------------------------------ 5. MARLOWE METRO */
let train=null;
function buildTrain(){train=new THREE.Group();const at=W(-1000,-500);train.position.set(at[0],Y-60,at[1]);const B=(x,y,z,w,h,d,c)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));m.position.set(x,y,z);train.add(m);return m};
 B(0,-.05,0,2.8,.1,16,0x3a3a42);B(0,2.4,0,2.8,.1,16,0xe8e8e8);for(const s of[-1,1]){B(s*1.4,1.2,0,.05,2.4,16,0xd8dce0);for(let z=-6;z<=6;z+=3)B(s*1.37,1.45,z,.03,.75,2.2,0x05070a);for(let z=-7;z<=7;z+=1.1)B(s*1.05,.45,z,.6,.12,.5,[0x1d3e8a,0xc8102e][Math.abs(Math.round(z))%2]);B(s*.55,1.2,0,.05,2.4,.05,0xd8c040)}
 for(let z=-7;z<=7;z+=3.5)B(0,1.2,z,.05,2.4,.05,0xd8c040);B(0,2.0,7.9,1.6,.3,.05,0x101010);
 const sg=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.26),new THREE.MeshBasicMaterial({map:txtTex(512,90,'#101010','#ffb020','MARLOWE METRO',40)}));sg.position.set(0,2.0,7.86);sg.rotation.y=Math.PI;train.add(sg);train.userData.sign=sg;
 const lights=[];for(let k=0;k<14;k++)for(const s of[-1,1]){const l=new THREE.Mesh(new THREE.BoxGeometry(.1,.25,.8),new THREE.MeshBasicMaterial({color:0xffe9a0}));l.position.set(s*1.9,1.6,-20+k*3);train.add(l);lights.push(l)}train.userData.lights=lights;
 for(let k=0;k<3;k++){const p=mkPerson(pSpec(6100+k*7),mObj,train);p.position.set(k%2?1.05:-1.05,.0,-4+k*3.5);p.rotation.y=k%2?-Math.PI/2:Math.PI/2;p.scale.setScalar(.95);if(p.l1){p.l1.rotation.x=p.l2.rotation.x=-1.4}p.position.y=-.05}
 train.visible=false;scene.add(train)}
function metroMenu(from){CUSTOM_SHOP.metro=function(msg){document.getElementById('shT').textContent='Ⓜ MARLOWE METRO';document.getElementById('shMsg').textContent=msg||'YOU ARE AT: '+from.n+'  ·  ANY JOURNEY £2';
  for(const m of metros()){if(m.n===from.n)continue;const d=Math.round(Math.hypot(m.u-from.u,m.v-from.v));dRow(m.n+'  ·  '+(d>1000?(d/1000).toFixed(1)+' KM':d+' M'),[['GO £2',()=>{if(cash<2)return renderShop('NOT ENOUGH CASH');closeShop();ride(from,m)}]])}dRow('',[['BACK',()=>closeShop()]])};openShop('metro')}
function ride(from,to){cash-=2;if(!train)buildTrain();fade(()=>{train.visible=true;man.visible=false;
 if(!actStart('metro',{fov:66},1)){train.visible=false;man.visible=true;return}btns([]);const T=6+Math.min(6,Math.hypot(to.u-from.u,to.v-from.v)/250);toast('MIND THE GAP! NEXT STATION: '+to.n);beep(660,.3,'sine',.05);setTimeout(()=>beep(523,.4,'sine',.05),320);
  ACT.tick=dt=>{const L=train.userData.lights,v=ACT.t<1?ACT.t*18:ACT.t>T-1.5?Math.max(2,(T-ACT.t)*14):24;for(const l of L){l.position.z-=v*dt;if(l.position.z<-22)l.position.z+=42}train.position.x=W(-1000,-500)[0]+Math.sin(ACT.t*9)*.012;topTxt('Ⓜ MARLOWE METRO · '+from.n+' → '+to.n+'\n'+(ACT.t>T-2?'THIS STATION IS '+to.n+'. PLEASE MIND THE GAP.':'NEXT STATION: '+to.n));
   if(ACT.t>=T){ACT.tick=null;fade(()=>actEnd())}};
  ACT.cam=()=>{const p=train.position;cam.position.set(p.x+.2,p.y+1.65,p.z-6.5);cam.lookAt(p.x-.1,p.y+1.4,p.z+6)};
  ACT.end=()=>{train.visible=false;man.visible=true;const p=W(to.u+(to.v>0?0:0),to.v);/* step out beside the entrance, on the pavement */let x=p[0],z=p[1];for(const[du,dv]of[[3.4,0],[-3.4,0],[0,3.4],[0,-3.4]]){if(MW.mh(to.u+du,to.v+dv)>Y){x=OX+to.u+du;z=OZ+to.v+dv;break}}P.x=x;P.z=z;P.y=gH(x,z);GT+=.15;toast('WELCOME TO '+to.n);stamp('metro')}})}
window.MARLOWE5={actStart,btns,topTxt,boatMesh,stamp,ACT,PASS,eyeRide,skyGo,buskGo,boatGo,ride,metros,actEnd};
})();
