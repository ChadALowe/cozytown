/* ===== SUNHAVEN BAY: life + a proper map.
   People walk the pavements, the promenade, the pier and the harbour; sunbathers and swimmers on the beach; cars drive the
   town grid (keeping left); gulls wheel overhead; sailing boats cross the bay; waves and gulls on the soundtrack.
   Everything only exists near you. The full map pans, zooms, names the streets and lets you set a waypoint. ===== */
(function(){
const RS=window.RESORT,{OX,OZ,W,H,SL,Y,NS,EW,SWIM}=RS,TAU=Math.PI*2,rr=(a,b)=>a+Math.random()*(b-a),pk=a=>a[(Math.random()*a.length)|0];
const pos=()=>GS.onFoot?P:GS;
function person(seed,o){const g=mkPerson(pSpec(seed,Object.assign({scarf:null,bp:Math.random()<.2,bag:Math.random()<.3?1:0,old:Math.random()<.15},o||{})),mObj,scene);g.scale.setScalar(.95);return g}
const drop=g=>{if(g&&g.parent)g.parent.remove(g)};
/* ================================================================== WALKERS */
const PATHS=[];
for(const r of NS){for(const s of r.i===3?[1]:[-1,1])PATHS.push({a:[r.u+s*(r.h+1.5),-388],b:[r.u+s*(r.h+1.5),388],y:Y})}
for(const r of EW)for(const s of[-1,1])PATHS.push({a:[-606,r.v+s*(r.h+1.5)],b:[-232,r.v+s*(r.h+1.5)],y:Y});
PATHS.push({a:[-610.5,-585],b:[-610.5,585],y:Y,w:3},{a:[-611,-3],b:[-955,-3],y:Y},{a:[-611,3],b:[-955,3],y:Y},{a:[RS.HARB.u0-8,RS.HARB.v1+7],b:[RS.HARB.u1+8,RS.HARB.v1+7],y:Y},{a:[-206,-255],b:[-206,-145],y:Y});
for(let v=-540;v<540;v+=90)PATHS.push({beach:1,a:[RS.shoreU(v)+12,v],b:[RS.shoreU(v+90)+12,v+90]});
const WK=[];let wkT=0;
function nearPt(p){const L=[];for(const q of PATHS){const ax=OX+q.a[0],az=OZ+q.a[1],bx=OX+q.b[0],bz=OZ+q.b[1],dx=bx-ax,dz=bz-az,l2=dx*dx+dz*dz,t=Math.max(0,Math.min(1,((p.x-ax)*dx+(p.z-az)*dz)/l2)),d=Math.hypot(ax+dx*t-p.x,az+dz*t-p.z);if(d<110)L.push([q,t,Math.sqrt(l2)])}if(!L.length)return null;const[q,t,len]=pk(L);const span=Math.min(1,90/len),t2=Math.max(0,Math.min(1,t+rr(-span,span)));return{q,t:t2,len}}
function walkTick(dt){const p=pos(),night=GT>=21||GT<7,want=GS.inside?0:night?5:12;wkT-=dt;
 for(let i=WK.length-1;i>=0;i--){const w=WK[i],d=Math.hypot(w.g.position.x-p.x,w.g.position.z-p.z);if(d>150||WK.length>want){drop(w.g);WK.splice(i,1)}}
 if(wkT<=0&&WK.length<want){wkT=.25;const n=nearPt(p);if(n){const g=person(4000+((Math.random()*900)|0),n.q.beach?{bp:false,ts:Math.random()<.5?2:3,tc:pk([[.95,.4,.4],[.3,.6,.9],[.95,.85,.3],[.4,.8,.5]])}:{});WK.push({g,q:n.q,t:n.t,len:n.len,dir:Math.random()<.5?1:-1,sp:rr(1.1,1.6),ph:Math.random()*6,stop:0,side:rr(-1.2,1.2)})}}
 for(const w of WK){if(w.stop>0){w.stop-=dt;continue}w.t+=w.dir*w.sp*dt/w.len;if(w.t>1||w.t<0){w.t=Math.max(0,Math.min(1,w.t));w.dir*=-1;if(Math.random()<.4)w.stop=rr(2,6)}if(Math.random()<dt*.04)w.stop=rr(1.5,4);
  const q=w.q,u=q.a[0]+(q.b[0]-q.a[0])*w.t,v=q.a[1]+(q.b[1]-q.a[1])*w.t,l=w.len,nx=-(q.b[1]-q.a[1])/l,nz=(q.b[0]-q.a[0])/l,uu=u+nx*w.side,vv=v+nz*w.side,x=OX+uu,z=OZ+vv,g=w.g;
  g.position.set(x,q.beach?Math.max(H(uu,vv),SWIM):(q.y||Y),z);g.rotation.y=Math.atan2((q.b[0]-q.a[0])*w.dir,(q.b[1]-q.a[1])*w.dir);w.ph+=dt*w.sp*5;const s=w.stop>0?0:Math.sin(w.ph)*.5;if(g.l1){g.l1.rotation.x=s;g.l2.rotation.x=-s;g.a1.rotation.x=-s*.8;g.a2.rotation.x=s*.8}}}
/* ================================================================== BEACH: sunbathers + swimmers */
const BCH=[];let bchFor=null;
function beachTick(dt){const p=pos(),u=p.x-OX,v=p.z-OZ,near=!GS.inside&&u<-560&&u>-760&&Math.abs(v)<600&&GT>=8&&GT<20;
 if(!near){if(BCH.length){BCH.forEach(b=>drop(b.g));BCH.length=0;bchFor=null}return}
 const key=Math.round(v/60);if(bchFor!==key){BCH.forEach(b=>drop(b.g));BCH.length=0;bchFor=key;for(let i=0;i<16;i++){const bv=key*60+rr(-60,60);if(Math.abs(bv)>560||Math.abs(bv)<10)continue;const sw=i%3===0,stand=i%3===1,su=RS.shoreU(bv),bu=sw?su-rr(6,22):rr(su+8,-630),h=H(bu,bv);if(!sw&&h<SL+.3)continue;const g=person(4900+i+key*17,{ts:2,tc:pk([[.95,.3,.4],[.2,.5,.9],[.98,.85,.2],[.3,.8,.6]]),bc:[.9,.75,.6]});const w=W(bu,bv);
  if(sw){g.position.set(w[0],SWIM,w[1]);g.rotation.y=rr(0,TAU)}else if(stand){g.position.set(w[0],h,w[1]);g.rotation.y=rr(0,TAU)}else{g.position.set(w[0],h+.18,w[1]);g.rotation.set(-Math.PI/2,rr(0,TAU),0,'YXZ');g.rotation.order='YXZ'}BCH.push({g,sw,stand,ph:Math.random()*6})}}
 const t=performance.now()/1000;for(const b of BCH)if(b.stand){b.g.rotation.y+=Math.sin(t*.5+b.ph)*.004;if(b.g.a1)b.g.a1.rotation.x=Math.sin(t*1.5+b.ph)*.4}else if(b.sw){b.g.position.y=SWIM+Math.sin(t*2+b.ph)*.12;if(b.g.a1){b.g.a1.rotation.x=-2+Math.sin(t*3+b.ph)*1.2;b.g.a2.rotation.x=-2-Math.sin(t*3+b.ph)*1.2}}}
/* ================================================================== TRAFFIC on the town grid (keep left) */
const NODE=(i,j)=>[NS[i].u,EW[j].v];const CARS=[];const CC=[[.85,.2,.2],[.2,.45,.85],[.95,.95,.92],[.2,.6,.35],[.95,.75,.2],[.15,.15,.18],[.6,.3,.7],[.4,.8,.85]];
function nextNode(i,j,pi,pj){const L=[];for(const[di,dj]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=i+di,b=j+dj;if(a<0||a>=NS.length||b<0||b>=EW.length)continue;if(a===pi&&b===pj)continue;L.push([a,b])}return L.length?pk(L):[pi,pj]}
function carTick(dt){const p=pos(),u=p.x-OX,v=p.z-OZ,town=!GS.inside&&u>-700&&u<-130&&Math.abs(v)<480,want=town?(GT>=0&&GT<6?4:10):0;
 while(CARS.length>want){drop(CARS.pop().m)}
 while(CARS.length<want){const i=(Math.random()*NS.length)|0,j=(Math.random()*EW.length)|0,n=nextNode(i,j,-1,-1),m=MCARMESH(pk(CC),null);scene.add(m);CARS.push({m,a:[i,j],b:n,t:Math.random(),sp:rr(8,11)})}
 for(const c of CARS){const A=NODE(...c.a),B=NODE(...c.b),L=Math.hypot(B[0]-A[0],B[1]-A[1]),du=(B[0]-A[0])/L,dv=(B[1]-A[1])/L;
  /* keep left: offset to the left of the direction of travel */const x=OX+A[0]+(B[0]-A[0])*c.t-dv*2.3,z=OZ+A[1]+(B[1]-A[1])*c.t+du*2.3;
  let slow=1;if(!GS.onFoot||true){const tx=GS.onFoot?P.x:GS.x,tz=GS.onFoot?P.z:GS.z,fx=x+du*4,fz=z+dv*4;if(Math.hypot(tx-fx,tz-fz)<3.2)slow=0}for(const o of CARS){if(o===c)continue;const d=Math.hypot(o.m.position.x-(x+du*5),o.m.position.z-(z+dv*5));if(d<3)slow=0}
  c.t+=c.sp*slow*dt/L;if(c.t>=1){const n=nextNode(...c.b,...c.a);c.a=c.b;c.b=n;c.t=0}
  c.m.position.set(x,Y+.02,z);let da=Math.atan2(du,dv)-c.m.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));c.m.rotation.y+=da*Math.min(1,dt*8)}}
/* ================================================================== GULLS + SAILING BOATS */
const GULL=[],BOAT=[];
function gullMesh(){const g=new THREE.Group(),m=new THREE.MeshBasicMaterial({color:0xf4f4f0,side:THREE.DoubleSide}),b=new THREE.Mesh(new THREE.BoxGeometry(.18,.16,.6),m);g.add(b);const wl=new THREE.Mesh(new THREE.PlaneGeometry(.9,.26),m),wr=wl.clone();wl.position.x=-.45;wr.position.x=.45;const pl=new THREE.Group(),pr=new THREE.Group();pl.add(wl);pr.add(wr);g.add(pl,pr);g.userData={pl,pr};scene.add(g);return g}
function boatMesh(c){const g=new THREE.Group(),B=new Builder(3);pbox(B,0,0,0,2.2,.9,6.5,c);pbox(B,0,.85,0,2.3,.15,6.6,[.95,.95,.95]);pcyl(B,0,.9,.6,.07,7,4,[.85,.85,.85]);g.add(B.mesh(mObj));const s=new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,1.4,.65),new THREE.Vector3(0,7.6,.65),new THREE.Vector3(0,1.4,-2.6)]),new THREE.MeshBasicMaterial({color:0xfaf8f0,side:THREE.DoubleSide}));s.geometry.setIndex([0,1,2]);g.add(s);scene.add(g);return g}
const GC=[[-660,0,40],[-470,-480,30],[-920,0,30],[-700,400,45]],BC=[[-880,150,260,.016],[-900,-300,200,-.02],[-1000,500,170,.025]];
function skyTick(dt){const on=RS.inRes();if(!GULL.length){for(let i=0;i<8;i++)GULL.push({g:gullMesh(),c:GC[i%4],r:rr(14,40),h:rr(12,26),a:rr(0,TAU),s:rr(.15,.35)*(i%2?1:-1)});BC.forEach((b,i)=>BOAT.push({g:boatMesh([[.2,.4,.8],[.9,.3,.2],[.95,.95,.9]][i]),b,a:rr(0,TAU)}))}
 const t=performance.now()/1000;for(const q of GULL){q.g.visible=on;if(!on)continue;q.a+=q.s*dt;const p=W(q.c[0]+Math.cos(q.a)*q.r,q.c[1]+Math.sin(q.a)*q.r);q.g.position.set(p[0],Y+q.h+Math.sin(t+q.a)*1.5,p[1]);q.g.rotation.y=-q.a+(q.s>0?0:Math.PI);q.g.rotation.z=q.s>0?-.3:.3;const f=Math.sin(t*6+q.r)*.5;q.g.userData.pl.rotation.z=f;q.g.userData.pr.rotation.z=-f}
 for(const q of BOAT){q.g.visible=on;if(!on)continue;q.a+=q.b[3]*dt;const p=W(q.b[0]+Math.cos(q.a)*q.b[2],q.b[1]+Math.sin(q.a)*q.b[2]*.6);q.g.position.set(p[0],SL-.25+Math.sin(t*1.3+q.b[2])*.12,p[1]);q.g.rotation.y=Math.atan2(-Math.sin(q.a)*q.b[3],Math.cos(q.a)*.6*q.b[3]);q.g.rotation.z=Math.sin(t*.9+q.b[2])*.06}}
/* ================================================================== SOUNDS: waves + gulls */
let wvT=2,glT=5;function soundTick(dt){if(!snd||!RS.inRes()||GS.inside)return;const p=pos(),u=p.x-OX,v=p.z-OZ,dB=Math.max(0,1-Math.abs(u-RS.shoreU(v))/160)*(Math.abs(v)<650?1:.3);wvT-=dt;glT-=dt;
 if(wvT<=0&&dB>.05){wvT=rr(3.5,6);for(let i=0;i<10;i++)setTimeout(()=>beep(70+Math.random()*60,.35,'sine',.012*dB),i*90)}
 if(glT<=0){glT=rr(5,14);const f=rr(1300,1700);for(let i=0;i<3;i++)setTimeout(()=>{beep(f-i*120,.12,'sawtooth',.006);beep(f-i*120+40,.12,'triangle',.008)},i*160)}}
/* ================================================================== THE FULL MAP (pan, zoom, tap a place, set a waypoint) */
let HI=null;const HK=2;
function hiBuild(){const reg=RS.M.reg,w=Math.ceil((reg[1]-reg[0])/HK),h=Math.ceil((reg[3]-reg[2])/HK),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),img=g.createImageData(w,h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const u=reg[0]+x*HK,v=reg[3]-y*HK,i=(y*w+x)*4;let col;const pier=RS.onPier(u,v);const hh=pier?Y:H(u,v);
  if(pier)col=[176,134,92];else if(hh<SL)col=hh<SL-5?[44,112,164]:hh<SL-2?[62,150,192]:[96,190,210];else if(hh<SL+.7||(u<-604&&hh<Y-.4&&Math.abs(v)<600))col=[240,222,164];else{const k=Math.min(1,(hh-Y)/30),sh=(H(u+HK,v)-hh)*-2.5;col=[112-k*30+sh,174-k*36+sh,90-k*14+sh]}
  if(RS.onRoad(u,v))col=[96,96,104];if(u>-30&&u<30&&v>-575&&v<575)col=[128,128,134];img.data.set([col[0],col[1],col[2],255],i)}
 g.putImageData(img,0,0);g.fillStyle='#e8dcc8';g.strokeStyle='#8a7a6a';g.lineWidth=1;for(const[u0,u1,v0,v1]of RS.BOXES){if(u1-u0>60||v1-v0>60||u1-u0<1.5||v1-v0<1.5)continue;const x=(u0-reg[0])/HK,y=(reg[3]-v1)/HK;g.fillRect(x,y,(u1-u0)/HK,(v1-v0)/HK);g.strokeRect(x,y,(u1-u0)/HK,(v1-v0)/HK)}HI=c}
function openMap(){if(busy||menuOpen||(window.AIRPORT&&AIRPORT.CIN&&AIRPORT.CIN.on))return;if(!HI)hiBuild();busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;const reg=RS.M.reg;
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:80;background:#2c70a4;touch-action:none;user-select:none;font:bold 12px ui-monospace,monospace;color:#fff';
 const cv=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;cursor:grab';ov.appendChild(cv);
 const bar=document.createElement('div');bar.style.cssText='position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:8px;padding:8px 10px;background:linear-gradient(#000c,#0000);pointer-events:none';const ttl=document.createElement('div');ttl.textContent='☀ SUNHAVEN BAY MAP';ttl.style.cssText='font-size:15px;letter-spacing:.12em;color:#ffd24a;flex:1;text-shadow:0 2px 0 #000';bar.appendChild(ttl);
 const bt=(t,f)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='pointer-events:auto;font:bold 18px ui-monospace,monospace;min-width:42px;height:42px;border:3px solid #f5e6a0;border-radius:10px;background:#1b2a3acc;color:#fff;cursor:pointer;padding:0 8px';b.onclick=f;bar.appendChild(b);return b};
 const info=document.createElement('div');info.style.cssText='position:absolute;right:10px;bottom:10px;background:#0b1420ee;border:3px solid #f5e6a0;border-radius:10px;padding:8px 12px;font-size:13px;display:none;max-width:62vw';
 const leg=document.createElement('div');leg.style.cssText='position:absolute;left:10px;bottom:10px;background:#0b1420ee;border:3px solid #f5e6a0;border-radius:10px;padding:8px 10px;font-size:11px;line-height:1.7;max-width:min(240px,62vw)';
 leg.innerHTML='<div style="color:#ffd24a;letter-spacing:.1em">LEGEND</div>'+[['#e8dcc8','BUILDINGS'],['#f0dea4','BEACH'],['#70ae5a','GRASS'],['#5a7a40','HILLS'],['#60bed2','SHALLOWS'],['#2c70a4','SEA'],['#b0865c','PIER']].map(([c,t])=>'<div><span style="display:inline-block;width:18px;height:8px;background:'+c+';margin-right:6px;border-radius:2px"></span>'+t+'</div>').join('')+'<div>TAP A PLACE FOR DETAILS</div>';if(innerWidth<700)leg.style.display='none';ov.append(bar,leg,info);
 const t0=pos(),S={s:1.2,cu:t0.x-OX,cv:t0.z-OZ,ptr:new Map(),drag:0,pd:0,sel:null};
 const fit=()=>{const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);cv.width=r.width*d;cv.height=r.height*d;S.d=d};
 const clamp=()=>{S.cu=Math.max(reg[0],Math.min(reg[1],S.cu));S.cv=Math.max(reg[2],Math.min(reg[3],S.cv))};
 const zoom=(f,px,py)=>{const r=cv.getBoundingClientRect(),w2=r.width/2,h2=r.height/2,qx=px==null?w2:px,qy=py==null?h2:py,ns=Math.max(.25,Math.min(8,S.s*f));const u=S.cu+(qx-w2)/S.s,v=S.cv-(qy-h2)/S.s;S.s=ns;S.cu=u-(qx-w2)/S.s;S.cv=v+(qy-h2)/S.s;clamp()};
 const toS=(u,v)=>{const r=cv.getBoundingClientRect();return[(u-S.cu)*S.s+r.width/2,-(v-S.cv)*S.s+r.height/2]};
 const pois=()=>RS.POI;const close=()=>{cancelAnimationFrame(S.raf);removeEventListener('keydown',S.kd,true);removeEventListener('resize',fit);ov.remove();busy=0};
 bt('+',()=>zoom(1.5));bt('−',()=>zoom(1/1.5));bt('⌖',()=>{const t=pos();S.cu=t.x-OX;S.cv=t.z-OZ;S.s=Math.max(S.s,1.4)});bt('▣',()=>{const r=cv.getBoundingClientRect();S.s=Math.min(r.width/(reg[1]-reg[0]),r.height/(reg[3]-reg[2]))*1.05;S.cu=(reg[0]+reg[1])/2;S.cv=(reg[2]+reg[3])/2});bt('✕',close);
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);S.ptr.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY});S.drag=0;if(S.ptr.size===2){const a=[...S.ptr.values()];S.pd=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}cv.style.cursor='grabbing'});
 cv.addEventListener('pointermove',e=>{const p=S.ptr.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;if(S.ptr.size===1){if(Math.hypot(e.clientX-p.sx,e.clientY-p.sy)>6)S.drag=1;S.cu-=dx/S.s;S.cv+=dy/S.s;clamp()}else if(S.ptr.size===2){S.drag=1;const a=[...S.ptr.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),r=cv.getBoundingClientRect();if(S.pd>0)zoom(d/S.pd,(a[0].x+a[1].x)/2-r.left,(a[0].y+a[1].y)/2-r.top);S.pd=d}});
 const up=e=>{const p=S.ptr.get(e.pointerId);if(p&&!S.drag&&S.ptr.size===1){const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;let b=null,bd=26;for(const q of pois()){const s=toS(q.u,q.v),d=Math.hypot(s[0]-px,s[1]-py);if(d<bd){bd=d;b=q}}S.sel=b;
   if(b){const t=pos(),dd=Math.round(Math.hypot(OX+b.u-t.x,OZ+b.v-t.z));info.style.display='block';info.innerHTML='';const a=document.createElement('div');a.textContent=(b.ic||'📍')+' '+b.n;const c=document.createElement('div');c.style.cssText='font-size:11px;color:#9ab;margin-top:3px';c.textContent=RS.where(b.u,b.v)+'  ·  '+(dd>1000?(dd/1000).toFixed(1)+' KM':dd+' M')+' AWAY';
    const w=document.createElement('button');w.textContent='📍 SET WAYPOINT';w.style.cssText='margin-top:6px;font:bold 13px ui-monospace,monospace;border:2px solid #f5e6a0;border-radius:8px;background:#2a6a3a;color:#fff;padding:5px 10px';w.onclick=ev=>{ev.stopPropagation();const p=W(b.u,b.v);PH.way={x:p[0],z:p[1],n:b.n};phWay();toast('📍 WAYPOINT SET: '+b.n);close()};info.append(a,c,w)}else info.style.display='none'}
  S.ptr.delete(e.pointerId);S.pd=0;if(!S.ptr.size)cv.style.cursor='grab'};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect();zoom(e.deltaY<0?1.2:1/1.2,e.clientX-r.left,e.clientY-r.top)},{passive:false});
 S.kd=e=>{if(e.key==='Escape'||e.key==='m'||e.key==='M'){e.preventDefault();e.stopPropagation();close()}else if(e.key==='+'||e.key==='=')zoom(1.3);else if(e.key==='-')zoom(1/1.3)};addEventListener('keydown',S.kd,true);addEventListener('resize',fit);document.body.appendChild(ov);fit();
 const draw=()=>{S.raf=requestAnimationFrame(draw);const g=cv.getContext('2d'),r=cv.getBoundingClientRect(),Wd=r.width,Ht=r.height,s=S.s;g.setTransform(S.d,0,0,S.d,0,0);g.fillStyle='#2c70a4';g.fillRect(0,0,Wd,Ht);g.imageSmoothingEnabled=s<1.5;const o=toS(reg[0],reg[3]);g.drawImage(HI,o[0],o[1],HI.width*HK*s,HI.height*HK*s);
  if(s>.6){g.font='bold '+Math.round(Math.min(14,7+s*2.4))+'px ui-monospace,monospace';g.textAlign='center';g.textBaseline='middle';g.lineWidth=3;g.strokeStyle='#fff';g.fillStyle='#2a3040';for(const rd of NS){const q=toS(rd.u,(rd.i%2?120:-120));g.save();g.translate(q[0],q[1]);g.rotate(-Math.PI/2);g.strokeText(rd.n,0,0);g.fillText(rd.n,0,0);g.restore()}for(const rd of EW){const q=toS(-420+(rd.j%2)*80,rd.v);g.strokeText(rd.n,q[0],q[1]);g.fillText(rd.n,q[0],q[1])}}
  if(window.RESORT2&&RESORT2.fullmap)RESORT2.fullmap(g,u=>toS(u,0)[0],v=>toS(0,v)[1]);
  g.textAlign='center';g.textBaseline='alphabetic';for(const q of pois()){const p=toS(q.u,q.v);if(p[0]<-30||p[0]>Wd+30||p[1]<-30||p[1]>Ht+30)continue;const sel=S.sel===q;g.font=(sel?30:Math.round(Math.min(26,14+s*4)))+'px serif';g.fillText(q.ic||'📍',p[0],p[1]+7);if(s>.9||sel){g.font='bold 11px ui-monospace,monospace';g.lineWidth=3;g.strokeStyle='#000';g.strokeText(q.n,p[0],p[1]+22);g.fillStyle='#fff';g.fillText(q.n,p[0],p[1]+22)}}
  if(PH.way){const p=toS(PH.way.x-OX,PH.way.z-OZ);g.fillStyle='#ffd24a';g.strokeStyle='#000';g.lineWidth=2;g.beginPath();g.arc(p[0],p[1],8,0,TAU);g.fill();g.stroke()}
  const t=pos(),me=toS(t.x-OX,t.z-OZ);g.save();g.translate(me[0],me[1]);g.rotate(Math.atan2(-Math.cos(t.psi),Math.sin(t.psi)));g.fillStyle='#ff3030';g.strokeStyle='#fff';g.lineWidth=2.5;g.beginPath();g.moveTo(11,0);g.lineTo(-7,-7);g.lineTo(-7,7);g.closePath();g.fill();g.stroke();g.restore()};draw()}
RS.openMap=openMap;
/* ================================================================== tick */
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!RS.built)return;const on=RS.inRes()||(RS.M.active&&GS.inside&&false);
 if(!on){if(WK.length){WK.forEach(w=>drop(w.g));WK.length=0}if(CARS.length){CARS.forEach(c=>drop(c.m));CARS.length=0}if(BCH.length){BCH.forEach(b=>drop(b.g));BCH.length=0;bchFor=null}skyTick(dt);return}
 walkTick(dt);beachTick(dt);carTick(dt);skyTick(dt);soundTick(dt)}}
window.RESORT4={WK,CARS,BCH,GULL,BOAT,openMap,hiBuild};
})();
