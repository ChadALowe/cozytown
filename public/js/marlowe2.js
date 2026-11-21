/* ===== MARLOWE CITY, live parts: collisions, traffic (cars, black cabs, double-deckers) obeying the lights, pedestrians,
   night lighting, the big screens + the Marlowe Eye, your car waiting at the airport, and a Marlowe minimap. ===== */
(function(){
const MW=window.MARLOWE,{M,OX,OZ,NS,EW,NODE,nsEdge,ewEdge,lanes,inReg,cResolve,CITY,W,KH}=MW,Y=G0,TAU=Math.PI*2;
const here=()=>{const p=GS.onFoot?P:GS;return M.built&&!GS.inside&&inReg(p.x,p.z)};
/* ------------------------------------------------------------------ collisions */
const TCOL=[];/* live traffic circles [x,z,r] */
function hitTraffic(x,z,rad){let hx=0,hz=0,hit=0;for(const c of TCOL){const dx=x-c[0],dz=z-c[1],d=Math.hypot(dx,dz),r=c[2]+rad;if(d<r&&d>1e-4){x+=dx/d*(r-d);z+=dz/d*(r-d);hx+=dx/d;hz+=dz/d;hit=1}}const l=Math.hypot(hx,hz)||1;return[x,z,hx/l,hz/l,hit]}
{const s0=step;step=function(dt){s0(dt);if(GS.onFoot||!M.built||!inReg(GS.x,GS.z))return;const fx=Math.sin(GS.psi),fz=Math.cos(GS.psi);let bang=0;
 for(const off of[1.25,0,-1.25]){for(const f of[cResolve,hitTraffic]){const px=GS.x+fx*off,pz=GS.z+fz*off,r=f(px,pz,.95);if(!r[4])continue;GS.x+=r[0]-px;GS.z+=r[1]-pz;const vn=GS.vx*r[2]+GS.vz*r[3];if(vn<0){GS.vx-=vn*r[2]*1.3;GS.vz-=vn*r[3]*1.3;GS.vx*=.92;GS.vz*=.92;bang=Math.max(bang,-vn)}}}
 if(bang>3)beep(70,.22,'sawtooth',.13)}}
{const f0=stepFoot;stepFoot=function(dt){f0(dt);if(!M.built||!inReg(P.x,P.z))return;let r=cResolve(P.x,P.z,.36);P.x=r[0];P.z=r[1];r=hitTraffic(P.x,P.z,.4);P.x=r[0];P.z=r[1]}}
/* ------------------------------------------------------------------ the lights (one city-wide cycle) */
const CYC=26;let LT=0;
const sig=ax=>{const t=LT%CYC;if(ax===0)return t<10?'g':t<12.5?'a':'r';return t>=13&&t<23?'g':t>=23&&t<25.5?'a':'r'};
/* ------------------------------------------------------------------ vehicles: instanced models */
const BODY=[1,1,1];
function model(fill,len){const b=new Builder(3),d=new Builder(3);fill((k,lx,ly,lz,sx,sy,sz,cc)=>pbox(cc===BODY?b:d,lx,ly,lz,sx,sy,sz,cc,0));return{b,d,len}}
const MODELS=[];
for(let si=0;si<5;si++)MODELS.push(model(E=>carParts(E,si,BODY),CST[si].L));
MODELS.push(model(E=>{/* black cab */const dk=[.06,.06,.07],gl=[.2,.24,.3],ch=[.75,.76,.8];E('o',0,.22,0,1.78,.72,4.55,BODY);E('o',0,.94,-.15,1.7,.86,2.7,BODY);E('o',0,1.0,-.15,1.74,.55,2.5,gl);E('o',0,1.0,-.15,1.66,.55,2.76,gl);
 E('o',0,1.8,-.15,1.62,.06,2.6,BODY);E('o',0,1.86,.35,.58,.18,.24,[1,.82,.15]);E('o',0,.3,2.28,1.2,.32,.06,ch);for(const sx of[-1,1]){E('l',sx*.62,.62,2.28,.26,.22,.05,[1,1,.85]);E('l',sx*.66,.6,-2.28,.22,.2,.05,[.9,.08,.08]);for(const z of[1.45,-1.45])E('o',sx*.82,0,z,.26,.64,.64,dk)}},4.6));
MODELS.push(model(E=>{/* red double-decker */const dk=[.05,.05,.06],gl=[.16,.2,.26],wt=[.92,.92,.9];E('o',0,.3,0,2.5,2.0,10.4,BODY);E('o',0,2.3,0,2.5,1.85,10.4,BODY);E('o',0,4.15,0,2.4,.12,10.2,wt);
 for(const sx of[-1,1]){E('o',sx*1.252,1.25,.2,.02,.85,9.2,gl);E('o',sx*1.252,2.75,0,.02,.95,9.8,gl);for(const z of[3.6,-3.4])E('o',sx*1.12,0,z,.3,1.0,1.0,dk)}E('o',0,1.0,5.205,2.2,1.3,.02,gl);E('o',0,2.75,5.205,2.3,.95,.02,gl);E('o',0,3.85,5.21,1.8,.3,.02,[.05,.05,.05]);E('o',0,3.88,5.22,1.2,.18,.02,[1,.75,.1]);
 E('o',0,1.25,-5.205,2.2,.8,.02,gl);for(const sx of[-1,1]){E('l',sx*.95,.55,5.21,.3,.2,.04,[1,1,.85]);E('l',sx*1.0,.55,-5.21,.25,.25,.04,[.9,.08,.08])}},10.4));
const MAXN=[16,10,10,6,8,16,5];
let IM=null;
function buildIM(){IM=MODELS.map((m,i)=>{const mb=wmat(null,{side:THREE.DoubleSide}),md=wmat(null,{side:THREE.DoubleSide}),gb=m.b.mesh(mb).geometry,gd=m.d.mesh(md).geometry,n=MAXN[i];
 const ib=new THREE.InstancedMesh(gb,mb,n),id=new THREE.InstancedMesh(gd,md,n);ib.instanceMatrix.setUsage(THREE.DynamicDrawUsage);id.instanceMatrix.setUsage(THREE.DynamicDrawUsage);ib.count=id.count=0;ib.frustumCulled=id.frustumCulled=false;
 for(let k=0;k<n;k++)ib.setColorAt(k,new THREE.Color(1,1,1));TG.add(ib,id);return{ib,id,n}})}
const TG=new THREE.Group();scene.add(TG);TG.visible=false;
const CARC=[[.72,.08,.08],[.12,.22,.52],[.88,.88,.9],[.1,.1,.12],[.52,.54,.58],[.2,.42,.28],[.86,.72,.2],[.38,.2,.12],[.92,.92,.92],[.62,.64,.68],[.08,.3,.5]];
const CABC=[[.06,.06,.07],[.06,.06,.07],[.06,.06,.07],[.06,.06,.07],[.4,.06,.1],[.9,.9,.9],[.12,.2,.42]];
/* ------------------------------------------------------------------ traffic agents */
const CARS=[],NCAR=44;
const road=(ax,k)=>ax?EW[k]:NS[k];
const nodeC=(ax,idx)=>ax?NS[idx].u:EW[idx].v;                                   /* coordinate along the road of its idx-th junction */
function nextIdx(ax,s,d){if(ax===0){if(d>0){for(let j=0;j<16;j++)if(EW[j].v>s+.01)return j;return -1}for(let j=15;j>=0;j--)if(EW[j].v<s-.01)return j;return -1}
 if(d>0){for(let i=11;i>=0;i--)if(NS[i].u>s+.01)return i;return -1}for(let i=0;i<12;i++)if(NS[i].u<s-.01)return i;return -1}
const nd=(ax,k,idx)=>ax?NODE[idx][k]:NODE[k][idx];
/* does the road continue from junction idx in direction d? */
function goes(ax,k,idx,d){if(ax===0)return d>0?nsEdge(k,idx):nsEdge(k,idx-1);return d>0?ewEdge(k,idx-1):ewEdge(k,idx)}
function lanePos(ax,k,d,ln,s){const r=road(ax,k),L=lanes(r),off=L[Math.min(ln,L.length-1)];return ax===0?[r.u+d*off,s]:[s,r.v-d*off]}
const psiOf=(ax,d)=>ax===0?(d>0?0:Math.PI):(d>0?Math.PI/2:-Math.PI/2);
function plan(c){const idx=nextIdx(c.ax,c.s,c.d);c.ni=idx;c.pl=null;if(idx<0)return;const opts=[];const ax2=1-c.ax;
 if(goes(c.ax,c.k,idx,c.d))opts.push({w:.56,t:'s'});
 /* left is e=d on NS (heading +v, left is +u), e=-d on EW */
 const eL=c.ax===0?c.d:-c.d;for(const[e,w,t]of[[eL,.26,'l'],[-eL,.18,'r']])if(goes(ax2,idx,c.k,e))opts.push({w,t,e});
 if(c.bus){const st=opts.find(o=>o.t==='s');if(st&&Math.random()<.7){c.pl=st;return}}
 if(!opts.length){c.pl={t:'u'};return}let r=Math.random()*opts.reduce((a,o)=>a+o.w,0);for(const o of opts){r-=o.w;if(r<=0){c.pl=o;return}}c.pl=opts[opts.length-1]}
function spawn(c,px,pz,rmin,rmax){for(let tries=0;tries<40;tries++){const ax=Math.random()<.5?0:1,k=ax?(Math.random()*16)|0:(Math.random()*12)|0,r=road(ax,k);
  const s=ax===0?-640+Math.random()*1670:-1230+Math.random()*1010;const [u,v]=ax===0?[r.u,s]:[s,r.v];const wx=OX+u,wz=OZ+v,dist=Math.hypot(wx-px,wz-pz);if(dist<rmin||dist>rmax)continue;
  const d=Math.random()<.5?1:-1,L0=lanes(r),ln0=(Math.random()*L0.length)|0,lp=lanePos(ax,k,d,ln0,s);if(MW.mh(lp[0],lp[1])!==Y)continue;/* on tarmac */const idx=nextIdx(ax,s,d);if(idx<0)continue;const prev=nextIdx(ax,s,-d);if(prev<0)continue;
  if(!goes(ax,k,prev,d))continue;const nc=nodeC(ax,idx),pc=nodeC(ax,prev),cr=road(1-ax,idx),cp=road(1-ax,prev);if(Math.abs(s-nc)<cr.h+10||Math.abs(s-pc)<cp.h+10)continue;
  const ln=ln0;if(CARS.some(o=>o!==c&&o.on&&!o.tn&&o.ax===ax&&o.k===k&&o.d===d&&Math.abs(o.s-s)<14))continue;
  Object.assign(c,{on:1,ax,k,d,s,ln,sp:6+Math.random()*4,tn:null});plan(c);return true}c.on=0;return false}
function newCar(i){const kind=i%11===0?6:i%3===0?5:(i%5);const c={kind,bus:kind===6,cab:kind===5,col:kind===6?[.78,.06,.08]:kind===5?CABC[(Math.random()*CABC.length)|0]:CARC[(Math.random()*CARC.length)|0],vmax:kind===6?8.5:10.5+Math.random()*3,len:MODELS[kind].len,on:0,x:0,z:0,psi:0};return c}
function carXZ(c){if(!c.on||c.ax==null)return;if(c.tn){const t=c.tn.t,q=1-t,P0=c.tn.P0,P1=c.tn.P1,P2=c.tn.P2;const u=q*q*P0[0]+2*q*t*P1[0]+t*t*P2[0],v=q*q*P0[1]+2*q*t*P1[1]+t*t*P2[1],du=2*q*(P1[0]-P0[0])+2*t*(P2[0]-P1[0]),dv=2*q*(P1[1]-P0[1])+2*t*(P2[1]-P1[1]);c.x=OX+u;c.z=OZ+v;c.psi=Math.atan2(du,dv);return}
 const p=lanePos(c.ax,c.k,c.d,c.ln,c.s);c.x=OX+p[0];c.z=OZ+p[1];c.psi=psiOf(c.ax,c.d)}
function stepCar(c,dt,px,pz,pOnFoot){
 if(c.tn){c.tn.t+=c.sp*dt/c.tn.len;let vt=c.tn.u?3.5:6.5;
  /* don't run into anyone while turning */const g=gapAhead(c,px,pz,pOnFoot);if(g<9)vt=0;c.sp+=Math.max(-10*dt,Math.min(3*dt,vt-c.sp));
  if(c.tn.t>=1){const T_=c.tn;c.ax=T_.ax;c.k=T_.k;c.d=T_.d;c.s=T_.s;c.ln=T_.ln;c.tn=null;plan(c)}return}
 const r=road(c.ax,c.k);if(c.ni<0){c.on=0;return}const nc=nodeC(c.ax,c.ni),cr=road(1-c.ax,c.ni),node=nd(c.ax,c.k,c.ni),toNode=(nc-c.s)*c.d;
 const stopAt=cr.h+4.4+c.len/2,turnAt=cr.h+1.2;let vt=c.vmax;
 if(node.lights){const st=sig(c.ax);if(st!=='g'&&toNode>stopAt-.5){const dist=toNode-stopAt;if(!(st==='a'&&dist<6&&c.sp>5)){vt=Math.min(vt,Math.sqrt(Math.max(0,2*4.5*Math.max(0,dist-.3))))}}}
 if(c.pl&&c.pl.t!=='s'){const dist=toNode-turnAt;vt=Math.min(vt,6+Math.max(0,dist)*.35)}else if(node.deg<3)vt=Math.min(vt,6+Math.max(0,toNode-turnAt)*.35);
 if(c.bus&&c.stop>0){c.stop-=dt;vt=0}
 const g=gapAhead(c,px,pz,pOnFoot);vt=Math.min(vt,Math.max(0,(g-6.5-c.len*.15)*1.1));
 c.sp+=Math.max(-11*dt,Math.min(2.8*dt,vt-c.sp));if(c.sp<0)c.sp=0;c.s+=c.d*c.sp*dt;
 /* bus stops: pause near a stop on this road */
 if(c.bus&&!(c.stop>0)&&c.lastStop!==c.ni){for(const s of CITY.stops){if(s.road!==(c.ax?'e'+c.k:'n'+c.k))continue;const along=c.ax?s.u:s.v;if(Math.abs(along-c.s)<1.5&&((c.ax===0&&Math.sign(s.u-r.u)===c.d)||(c.ax===1&&Math.sign(r.v-s.v)===c.d))){c.stop=6;c.lastStop=c.ni;break}}}
 /* reaching the junction mouth: start the turn (or carry straight on) */
 if(toNode<=turnAt){const pl=c.pl||{t:'s'};
  if(pl.t==='s'){c.s+=0;plan2(c);return}
  const ax2=1-c.ax,k2=c.ni,e=pl.t==='u'?-c.d:pl.e,r2=road(ax2,k2);
  if(pl.t==='u'){const P0=lanePos(c.ax,c.k,c.d,c.ln,c.s),P2=lanePos(c.ax,c.k,-c.d,0,c.s),P1=[(P0[0]+P2[0])/2+(c.ax===0?0:c.d*8),(P0[1]+P2[1])/2+(c.ax===0?c.d*8:0)];c.tn={P0,P1,P2,t:0,len:14,ax:c.ax,k:c.k,d:-c.d,s:c.s,ln:0,u:1};return}
  const L2=lanes(r2),ln2=(Math.random()*L2.length)|0,s2=nodeC(ax2,c.k)+e*(r.h+1.2);const P0=lanePos(c.ax,c.k,c.d,c.ln,c.s),P2=lanePos(ax2,k2,e,ln2,s2),P1=c.ax===0?[P0[0],P2[1]]:[P2[0],P0[1]];
  c.tn={P0,P1,P2,t:0,len:Math.max(4,(Math.hypot(P1[0]-P0[0],P1[1]-P0[1])+Math.hypot(P2[0]-P1[0],P2[1]-P1[1]))*.9),ax:ax2,k:k2,d:e,s:s2,ln:ln2}}}
/* straight on through a junction: keep going and plan the next one once past it */
function plan2(c){const nc=nodeC(c.ax,c.ni),cr=road(1-c.ax,c.ni);c.s=nc+c.d*0-c.d*(cr.h+1.2-0.01);c.through=c.ni;c.ni=-2;c.tn=null;c.str={to:nc+c.d*(cr.h+1.3)}}
function gapAhead(c,px,pz,pOnFoot){const fx=Math.sin(c.psi),fz=Math.cos(c.psi);let g=60;const inJ=c.tn||c.ni===-2;
 for(const o of CARS){if(o===c||!o.on)continue;if(inJ&&(o.tn||o.ni===-2))continue;const dx=o.x-c.x,dz=o.z-c.z,al=dx*fx+dz*fz;if(al<=0||al>g)continue;const lat=Math.abs(dx*fz-dz*fx);if(lat<1.7){const gg=al-(o.len-4.4)/2;if(gg<g)g=gg}}
 {const dx=px-c.x,dz=pz-c.z,al=dx*fx+dz*fz;if(al>0&&al<g){const lat=Math.abs(dx*fz-dz*fx);if(lat<(pOnFoot?1.5:2.0))g=al}}return g}
let initDone=0;
function trafficTick(dt){if(!IM)buildIM();const p=GS.onFoot?P:GS,px=p.x,pz=p.z;
 if(!initDone){initDone=1;for(let i=0;i<NCAR;i++){const c=newCar(i);CARS.push(c);spawn(c,px,pz,25,330);carXZ(c)}}
 TCOL.length=0;
 for(const c of CARS){if(!c.on){if(Math.random()<.05&&spawn(c,px,pz,160,340))carXZ(c);continue}
  if(c.ni===-2){/* crossing a junction straight */const nc=c.str.to;c.sp+=Math.max(-10*dt,Math.min(2.8*dt,c.vmax-c.sp));const g=gapAhead(c,px,pz,!!GS.onFoot);if(g<7)c.sp=Math.max(0,c.sp-12*dt);c.s+=c.d*c.sp*dt;if((nc-c.s)*c.d<=0){c.str=null;plan(c)}}
  else stepCar(c,dt,px,pz,!!GS.onFoot);
  if(!c.on)continue;carXZ(c);const dP=Math.hypot(c.x-px,c.z-pz);if(dP>380){c.on=0;continue}
  c.idle=c.sp<.2?(c.idle||0)+dt:0;if(c.idle>25&&dP>60){c.on=0;c.idle=0;continue}
  const fx=Math.sin(c.psi),fz=Math.cos(c.psi),h=c.len/2-.9;if(c.bus){for(const o of[-3.6,-1.2,1.2,3.6])TCOL.push([c.x+fx*o,c.z+fz*o,1.25])}else for(const o of[-h,h])TCOL.push([c.x+fx*o,c.z+fz*o,.92])}
 for(const p of PED)if(p.on&&p.g.visible)TCOL.push([p.g.position.x,p.g.position.z,.38]);
 /* write instances */
 const cnt=IM.map(()=>0),m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),one=new THREE.Vector3(1,1,1),pos=new THREE.Vector3(),col=new THREE.Color();
 for(const c of CARS){if(!c.on)continue;const I=IM[c.kind];const n=cnt[c.kind];if(n>=I.n)continue;e.set(0,c.psi,0);q.setFromEuler(e);pos.set(c.x,Y+.02,c.z);m4.compose(pos,q,one);I.ib.setMatrixAt(n,m4);I.id.setMatrixAt(n,m4);col.setRGB(c.col[0],c.col[1],c.col[2]);I.ib.setColorAt(n,col);cnt[c.kind]=n+1}
 IM.forEach((I,k)=>{I.ib.count=I.id.count=cnt[k];I.ib.instanceMatrix.needsUpdate=I.id.instanceMatrix.needsUpdate=true;if(I.ib.instanceColor)I.ib.instanceColor.needsUpdate=true})}
/* ------------------------------------------------------------------ pedestrians */
const PED=[],NPED=26,PG=new THREE.Group();scene.add(PG);PG.visible=false;
const walkBlocks=()=>MW.BLK.filter(b=>!b.sp||b.sp==='station'||b.sp==='townhall'||b.sp==='skytower');
let WB=null;
function loopOf(b){const pw=r=>r.w>=20?6:4.5,o=r=>pw(r)-1.05;return{u0:b.u0+o(b.sw),u1:b.u1-o(b.se),v0:b.v0+o(b.ss),v1:b.v1-o(b.sn)}}
function pedAt(p){const L=p.L,w=L.u1-L.u0,h=L.v1-L.v0,per=2*(w+h);let s=((p.s%per)+per)%per;let u,v,a;
 if(s<w){u=L.u0+s;v=L.v0;a=Math.PI/2}else if(s<w+h){u=L.u1;v=L.v0+(s-w);a=0}else if(s<2*w+h){u=L.u1-(s-w-h);v=L.v1;a=-Math.PI/2}else{u=L.u0;v=L.v1-(s-2*w-h);a=Math.PI}
 if(p.d<0)a+=Math.PI;return[u,v,a,per]}
function placePed(p,px,pz,near){if(!WB)WB=walkBlocks();for(let t=0;t<30;t++){const b=WB[(Math.random()*WB.length)|0],cu=OX+(b.u0+b.u1)/2,cz=OZ+(b.v0+b.v1)/2,d=Math.hypot(cu-px,cz-pz);if(d>(near?110:140)||d<(near?0:40))continue;p.L=loopOf(b);p.s=Math.random()*999;p.on=1;return}p.on=0}
function pedTick(dt){const p0=GS.onFoot?P:GS;if(!PED.length){for(let i=0;i<NPED;i++){const sp=pSpec(7000+i*37);const g=mkPerson(sp,mObj,PG);g.scale.setScalar(sp.h*.96);PED.push({g,sp:1.1+Math.random()*.6,d:Math.random()<.5?1:-1,ph:Math.random()*6,on:0});placePed(PED[i],p0.x,p0.z,true)}}
 for(const p of PED){if(!p.on){p.g.visible=false;if(Math.random()<.04)placePed(p,p0.x,p0.z,false);continue}
  const [u,v,a]=pedAt(p);const wx=OX+u,wz=OZ+v;if(Math.hypot(wx-p0.x,wz-p0.z)>160){p.on=0;continue}
  /* give way to the player */const dx=p0.x-wx,dz=p0.z-wz,fx=Math.sin(a),fz=Math.cos(a),al=dx*fx+dz*fz,lat=Math.abs(dx*fz-dz*fx);const blocked=al>0&&al<1.6&&lat<.7;
  if(!blocked){p.s+=p.d*p.sp*dt;p.ph+=p.sp*dt*2.6}const g=p.g;g.visible=true;g.position.set(wx,Y+KH,wz);g.rotation.y=a;const sw=blocked?0:Math.sin(p.ph)*.5;if(g.l1){g.l1.rotation.x=sw;g.l2.rotation.x=-sw;g.a1.rotation.x=-sw*.8;g.a2.rotation.x=sw*.8}}}
/* ------------------------------------------------------------------ night: facades, lamp pools, glows, aviation lights, traffic-light lamps */
let pools=null,avi=null,lampMs=null,lampG=null;
function nightBits(){/* light pools */const n=MW.LPOOL.length,pos=new Float32Array(n*12),idx=[];const T=MW.T2(64,64,(g)=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,220,150,1)');gr.addColorStop(.5,'rgba(255,200,120,.35)');gr.addColorStop(1,'rgba(255,190,110,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)},{lin:true});
 const uv=new Float32Array(n*8);MW.LPOOL.forEach(([x,z],i)=>{const r=5.5,y=Y+KH+.03;pos.set([x-r,y,z-r,x+r,y,z-r,x+r,y,z+r,x-r,y,z+r],i*12);uv.set([0,0,1,0,1,1,0,1],i*8);idx.push(i*4,i*4+1,i*4+2,i*4,i*4+2,i*4+3)});
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setIndex(idx);g.computeBoundingSphere();
 pools=new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:T,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.55,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-6,polygonOffsetUnits:-12}));pools.frustumCulled=false;pools.renderOrder=3;scene.add(pools);
 /* aviation lights */{const a=new Float32Array(MW.RLIGHT.length*3);MW.RLIGHT.forEach((p,i)=>a.set(p,i*3));const gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.BufferAttribute(a,3));avi=new THREE.Points(gg,new THREE.PointsMaterial({color:0xff2a2a,size:5,sizeAttenuation:false,fog:false}));avi.frustumCulled=false;scene.add(avi)}
 /* traffic-light lamps: 2 axes x (red, amber, green) */
 lampMs=[];lampG=new THREE.Group();scene.add(lampG);const LC=[[1,.1,.08],[1,.62,.05],[.1,1,.35]];for(let ax=0;ax<2;ax++){lampMs[ax]=[];for(let k=0;k<3;k++){const P_=MW.TLAMP[ax][k],gg=new THREE.BufferGeometry(),pa=new Float32Array(P_.length*3),ix=[];P_.forEach((p,i)=>pa.set(p,i*3));for(let i=0;i<P_.length;i+=4)ix.push(i,i+1,i+2,i,i+2,i+3);gg.setAttribute('position',new THREE.BufferAttribute(pa,3));gg.setIndex(ix);gg.computeBoundingSphere();
   const m=new THREE.MeshBasicMaterial({color:new THREE.Color(...LC[k]),side:THREE.DoubleSide});m.userData.c=LC[k];const me=new THREE.Mesh(gg,m);me.frustumCulled=false;lampG.add(me);lampMs[ax][k]=m}}}
function setNight(){if(!MW.FM)return;const T=TOD[todI].tint,n=todI===2,dusk=todI===1;for(const m of[...MW.FM,MW.SM]){const want=n?m.userData.n:m.userData.d;if(m.map!==want){m.map=want;m.needsUpdate=true}if(n)m.color.setRGB(.95,.95,1);else m.color.setRGB(T[0]*1.05,T[1]*1.05,T[2]*1.05)}
 if(pools){pools.visible=(n||dusk)&&here();pools.material.opacity=n?.6:.25}if(CITY.glow)CITY.glow.visible=n||dusk}
{const a0=applyTOD;applyTOD=function(i){a0(i);setNight()}}
/* ------------------------------------------------------------------ big screens */
const ADS=[['COZY COLA','THE TASTE OF THE VILLAGE','#c8102e','#ffffff'],['FLY COZY AIRWAYS','MARLOWE ⇄ COZY VILLAGE · £150','#1d56b8','#ffd24a'],["LUIGI'S PIZZA",'NOW DELIVERING IN MARLOWE','#2a7a3a','#ffffff'],['THE MARLOWE EYE','SEE THE CITY FROM 70 METRES','#0c2a4a','#9ad0ff'],['VILLAGE ROVERS FC','SEASON TICKETS ON SALE','#e8b020','#14223a'],['MARLOWE ARENA','LIVE TONIGHT','#5a1a7a','#ffd0ff']];
let adT=null,adI=0,adClock=0;
function adTex(){adT=ADS.map(([a,b,bg,fg])=>MW.T2(512,292,(g,w,h)=>{const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,bg);gr.addColorStop(1,'#000');g.fillStyle=gr;g.fillRect(0,0,w,h);g.fillStyle=fg;g.font='bold 64px Impact,Arial Black,Arial';g.textAlign='center';g.textBaseline='middle';g.fillText(a,w/2,h*.42);g.font='bold 26px Arial';g.fillText(b,w/2,h*.72);g.fillStyle='rgba(255,255,255,.06)';for(let y=0;y<h;y+=3)g.fillRect(0,y,w,1)},{lin:true}))}
/* ------------------------------------------------------------------ the minimap */
let CMC=null;const MMK=2;/* m per px */
function cityMap(){const reg=M.reg,w=Math.ceil((reg[1]-reg[0])/MMK),h=Math.ceil((reg[3]-reg[2])/MMK),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 const X=u=>(u-reg[0])/MMK,Z=v=>(reg[3]-v)/MMK,rect=(u0,v0,u1,v1,col)=>{g.fillStyle=col;g.fillRect(X(Math.min(u0,u1)),Z(Math.max(v0,v1)),Math.abs(u1-u0)/MMK,Math.abs(v1-v0)/MMK)};
 g.fillStyle='#3e74a8';g.fillRect(0,0,w,h);rect(MW.LAND.u0,MW.LAND.v0,MW.LAND.u1,MW.LAND.v1,'#e2e0da');rect(-217,MW.LAND.v0,MW.LAND.u1,MW.LAND.v1,'#6f9e58');rect(-30,-575,30,575,'#8a8a8e');rect(-95,-300,-77,430,'#9a9aa0');rect(-217,-420,-150,-296,'#c8c8c4');
 rect(-768,MW.LAND.v0,-692,MW.LAND.v1,'#3e74a8');for(const j of MW.BRIDGE){const e=EW[j];rect(-775,e.v-e.h-4,-685,e.v+e.h+4,'#e2e0da')}
 for(const o of MW.RAISE){const col=o.sp==='parkw'||o.sp==='parke'?'#7ab860':o.k==='plaza'||o.sp==='square'||o.sp==='cathedral'?'#d8ccb0':o.k==='med'?'#a8c890':o.d==='down'?'#a9aab4':o.d==='old'?'#c4a898':o.d==='west'?'#cbb8a8':'#b8b4ac';if(o.k&&o.k!=='plaza'&&o.k!=='med'&&o.k!=='coast'&&o.k!=='prom'&&o.k!=='bridge'&&!o.d)continue;if(o.k==='coast'||o.k==='prom'||o.k==='bridge')rect(o.u0,o.v0,o.u1,o.v1,'#cfcdc6');else rect(o.u0,o.v0,o.u1,o.v1,col)}
 rect(MW.PLAZA.u0,MW.PLAZA.v0,MW.PLAZA.u1,MW.PLAZA.v1,'#d8ccb0');rect(-1112,425,-1078,495,'#3e74a8');rect(-162,-265,-138,-135,'#e8d26a');
 /* landmarks */g.font='bold 9px Arial';g.textAlign='center';for(const p of CITY.poi){if(p.metro){g.fillStyle='#1d3e8a';g.fillRect(X(p.u)-3,Z(p.v)-3,6,6);g.fillStyle='#fff';g.fillText('M',X(p.u),Z(p.v)+3);continue}}
 CMC=c}
function drawCity(T){const reg=M.reg,u=T.x-OX,v=T.z-OZ,cx=(u-reg[0])/MMK,cz=(reg[3]-v)/MMK,S=170;mc.fillStyle='#3e74a8';mc.fillRect(0,0,MMS,MMS);mc.drawImage(CMC,cx-S/2,cz-S/2,S,S,0,0,MMS,MMS);
 const k=MMS/S/MMK;if(GS.onFoot){const gx=(GS.x-T.x)*k+MMS/2,gz=-(GS.z-T.z)*k+MMS/2;mc.fillStyle='#4af';mc.fillRect(gx-2,gz-2,5,5)}
 if(window.MARLOWE3&&MARLOWE3.mm)MARLOWE3.mm(mc,T,k);
 mc.save();mc.translate(MMS/2,MMS/2);mc.rotate(Math.atan2(-Math.cos(T.psi),Math.sin(T.psi)));mc.fillStyle='#fff';mc.strokeStyle='#d00';mc.lineWidth=1.5;mc.beginPath();mc.moveTo(6,0);mc.lineTo(-4,-3.5);mc.lineTo(-4,3.5);mc.closePath();mc.fill();mc.stroke();mc.restore();
 mc.fillStyle='rgba(0,0,0,.55)';mc.fillRect(0,MMS-13,MMS,13);mc.fillStyle='#fff';mc.font='bold 9px monospace';mc.textAlign='center';mc.fillText(streetAt(u,v),MMS/2,MMS-3.5)}
function streetAt(u,v){let best='MARLOWE',bd=9;for(const r of NS){const d=Math.abs(u-r.u)-r.h;if(d<bd&&v>-640&&v<1040){bd=d;best=r.n}}for(const r of EW){const d=Math.abs(v-r.v)-r.h;if(d<bd){bd=d;best=r.n}}if(u>-217)best='MARLOWE AIRPORT';else if(u<-692&&u>-768&&bd>4)best='THE RIVER MARLE';return best}
{const d0=drawMap;drawMap=function(){const T=GS.onFoot?P:GS;if(M.built&&!GS.inside&&inReg(T.x,T.z)){if(!CMC)cityMap();drawCity(T)}else d0()}}

/* ------------------------------------------------------------------ full-screen Marlowe map (tap the minimap or press M while in the city) */
const PICON={'MARLOWE CENTRAL STATION':'🚉','MARLOWE SKY TOWER':'🗼',"ST MARLOWE'S CATHEDRAL":'⛪','MARKET SQUARE':'🛒','MARLOWE TOWN HALL':'🏛','MARLOWE ARENA':'🏟','WESTBANK PARK':'🌳','RIVERSIDE GARDENS':'🌷','THE MARLOWE EYE':'🎡','MARLOWE CIRCUS':'📺','MARLOWE AIRPORT':'✈','HIGH STREET':'🛍',"KING'S AVENUE":'🛣','THE DOCKS':'⚓','NORTH QUAY':'⛵'};
let HMAP=null,FOV=null;
function cityMapHi(){const reg=M.reg,K=1,w=Math.ceil((reg[1]-reg[0])/K),h=Math.ceil((reg[3]-reg[2])/K),c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
 const X=u=>(u-reg[0])/K,Z=v=>(reg[3]-v)/K,rect=(u0,v0,u1,v1,col,st)=>{const x=X(Math.min(u0,u1)),y=Z(Math.max(v0,v1)),ww=Math.abs(u1-u0)/K,hh=Math.abs(v1-v0)/K;g.fillStyle=col;g.fillRect(x,y,ww,hh);if(st){g.strokeStyle=st;g.lineWidth=1;g.strokeRect(x+.5,y+.5,ww-1,hh-1)}};
 g.fillStyle='#3a6e9e';g.fillRect(0,0,w,h);rect(MW.LAND.u0,MW.LAND.v0,MW.LAND.u1,MW.LAND.v1,'#f0eee8');rect(-217,MW.LAND.v0,MW.LAND.u1,MW.LAND.v1,'#79a862');rect(-30,-575,30,575,'#8a8a8e');rect(-95,-300,-77,430,'#9a9aa0');rect(-217,-420,-150,-296,'#d0d0cc','#999');
 rect(-768,MW.LAND.v0,-692,MW.LAND.v1,'#3a6e9e');for(const j of MW.BRIDGE){const e=EW[j];rect(-775,e.v-e.h-4,-685,e.v+e.h+4,'#f0eee8');rect(-768,e.v-e.h-4,-692,e.v-e.h,'#c8c6be');rect(-768,e.v+e.h,-692,e.v+e.h+4,'#c8c6be')}
 for(const o of MW.RAISE){if(o.k==='coast'||o.k==='prom'||o.k==='bridge'){rect(o.u0,o.v0,o.u1,o.v1,'#d4d2ca');continue}if(o.k==='med'){rect(o.u0,o.v0,o.u1,o.v1,'#9cc488');continue}if(o.k==='plaza'){rect(o.u0,o.v0,o.u1,o.v1,'#ddd0b4');continue}
  const park=o.sp==='parkw'||o.sp==='parke',col=park?'#7cbc62':o.sp==='square'||o.sp==='cathedral'?'#ddd0b4':o.d==='down'?'#a4a8b8':o.d==='old'?'#c9a690':o.d==='west'?'#d2bca8':o.d==='docks'?'#b4a090':'#bcb6aa';
  rect(o.u0,o.v0,o.u1,o.v1,'#d4d2ca');const pw=r=>r.w>=20?6:4.5;rect(o.u0+pw(o.sw),o.v0+pw(o.ss),o.u1-pw(o.se),o.v1-pw(o.sn),col,park?null:'#0003')}
 rect(-1112,425,-1078,495,'#3a6e9e');rect(-162,-265,-138,-135,'#e8d26a','#0005');
 /* lane lines */g.strokeStyle='#fff';g.lineWidth=1;g.setLineDash([4,5]);for(const r of NS){g.beginPath();g.moveTo(X(r.u),Z(-628));g.lineTo(X(r.u),Z(1028));g.stroke()}for(const r of EW){for(const[a,b]of MW.BRIDGE.has(r.j)?[[NS[11].u,NS[0].u]]:[[NS[11].u,NS[6].u],[NS[5].u,NS[0].u]]){g.beginPath();g.moveTo(X(a),Z(r.v));g.lineTo(X(b),Z(r.v));g.stroke()}}g.setLineDash([]);
 g.fillStyle='#9ad0ff';g.font='bold 22px Georgia,serif';g.textAlign='center';g.save();g.translate(X(-730),Z(560));g.rotate(-Math.PI/2);g.fillText('THE RIVER MARLE',0,8);g.restore();
 HMAP=c}
function openCityMap(){if(FOV||busy||menuOpen||(window.AIRPORT&&AIRPORT.CIN&&AIRPORT.CIN.on))return;if(!HMAP)cityMapHi();busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;const reg=M.reg;
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:80;background:#1d3e60;touch-action:none;user-select:none;font:bold 12px ui-monospace,monospace;color:#fff';
 const cv=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;cursor:grab';ov.appendChild(cv);
 const bar=document.createElement('div');bar.style.cssText='position:absolute;left:0;right:0;top:0;display:flex;align-items:center;gap:8px;padding:8px 10px;background:linear-gradient(#000c,#0000);pointer-events:none';
 const ttl=document.createElement('div');ttl.textContent='MARLOWE CITY MAP';ttl.style.cssText='font-size:15px;letter-spacing:.12em;color:#ffd24a;flex:1;text-shadow:0 2px 0 #000';bar.appendChild(ttl);
 const bt=(t,f,w)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='pointer-events:auto;font:bold 18px ui-monospace,monospace;min-width:'+(w||42)+'px;height:42px;border:3px solid #f5e6a0;border-radius:10px;background:#1b2a3acc;color:#fff;cursor:pointer;padding:0 8px';b.onclick=f;bar.appendChild(b);return b};
 const info=document.createElement('div');info.style.cssText='position:absolute;right:10px;bottom:10px;background:#0b1420ee;border:3px solid #f5e6a0;border-radius:10px;padding:8px 12px;font-size:13px;display:none;max-width:60vw';
 const leg=document.createElement('div');leg.style.cssText='position:absolute;left:10px;bottom:10px;background:#0b1420ee;border:3px solid #f5e6a0;border-radius:10px;padding:8px 10px;font-size:11px;line-height:1.7;max-width:min(240px,62vw)';
 leg.innerHTML='<div style="color:#ffd24a;letter-spacing:.1em">LEGEND</div>'+[['#a4a8b8','DOWNTOWN'],['#bcb6aa','MIDTOWN'],['#b4a090','DOCKS'],['#c9a690','OLD TOWN'],['#d2bca8','WESTBANK'],['#7cbc62','PARKS'],['#3a6e9e','RIVER / SEA']].map(([c,t])=>'<div><span style="display:inline-block;width:18px;height:8px;background:'+c+';margin-right:6px;border-radius:2px"></span>'+t+'</div>').join('')+'<div>Ⓜ METRO · 🚕 TAXI RANK</div><div><span style="color:#ffd24a">●</span> PICK UP · <span style="color:#3ad07a">●</span> DROP OFF</div>';
 if(innerWidth<700)leg.style.display='none';ov.append(bar,leg,info);
 const play=()=>GS.onFoot?P:GS,t0=play();
 const S={s:1,cu:t0.x-OX,cv:t0.z-OZ,ptr:new Map(),drag:0,pd:0,sel:null};
 const fit=()=>{const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);cv.width=r.width*d;cv.height=r.height*d;S.d=d};
 const clamp=()=>{S.cu=Math.max(reg[0],Math.min(reg[1],S.cu));S.cv=Math.max(reg[2],Math.min(reg[3],S.cv))};
 const zoom=(f,px,py)=>{const r=cv.getBoundingClientRect(),w2=r.width/2,h2=r.height/2,qx=px==null?w2:px,qy=py==null?h2:py,ns=Math.max(.25,Math.min(8,S.s*f));const u=S.cu+(qx-w2)/S.s,v=S.cv-(qy-h2)/S.s;S.s=ns;S.cu=u-(qx-w2)/S.s;S.cv=v+(qy-h2)/S.s;clamp()};
 const toS=(u,v)=>{const r=cv.getBoundingClientRect();return[(u-S.cu)*S.s+r.width/2,-(v-S.cv)*S.s+r.height/2]};
 const pois=()=>{const L=CITY.poi.map(p=>({u:p.u,v:p.v,n:p.metro?'MARLOWE METRO':p.n,ic:p.metro?'Ⓜ':p.ic||PICON[p.n]||'📍',c:p.metro?'#1d3e8a':p.taxi?'#ffd24a':'#ffffff'}));return L};
 const close=()=>{cancelAnimationFrame(S.raf);removeEventListener('keydown',S.kd,true);removeEventListener('resize',fit);ov.remove();FOV=null;busy=0};
 bt('+',()=>zoom(1.5));bt('−',()=>zoom(1/1.5));bt('⌖',()=>{const t=play();S.cu=t.x-OX;S.cv=t.z-OZ;S.s=Math.max(S.s,1.4)});bt('▣',()=>{const r=cv.getBoundingClientRect();S.s=Math.min(r.width/(reg[1]-reg[0]),r.height/(reg[3]-reg[2]))*1.05;S.cu=(reg[0]+reg[1])/2;S.cv=(reg[2]+reg[3])/2});bt('✕',close);
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);S.ptr.set(e.pointerId,{x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY});S.drag=0;if(S.ptr.size===2){const a=[...S.ptr.values()];S.pd=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)}cv.style.cursor='grabbing'});
 cv.addEventListener('pointermove',e=>{const p=S.ptr.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(S.ptr.size===1){if(Math.hypot(e.clientX-p.sx,e.clientY-p.sy)>6)S.drag=1;S.cu-=dx/S.s;S.cv+=dy/S.s;clamp()}
  else if(S.ptr.size===2){S.drag=1;const a=[...S.ptr.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),r=cv.getBoundingClientRect();if(S.pd>0)zoom(d/S.pd,(a[0].x+a[1].x)/2-r.left,(a[0].y+a[1].y)/2-r.top);S.pd=d}});
 const up=e=>{const p=S.ptr.get(e.pointerId);if(p&&!S.drag&&S.ptr.size===1){const r=cv.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;let b=null,bd=24;for(const q of pois()){const s=toS(q.u,q.v),d=Math.hypot(s[0]-px,s[1]-py);if(d<bd){bd=d;b=q}}S.sel=b;
   if(b){const t=play(),dd=Math.round(Math.hypot(OX+b.u-t.x,OZ+b.v-t.z));info.style.display='block';info.innerHTML='';const a=document.createElement('div');a.textContent=b.ic+' '+b.n;const c=document.createElement('div');c.style.cssText='font-size:11px;color:#9ab;margin-top:3px';c.textContent=streetAt(b.u,b.v)+'  ·  '+(dd>1000?(dd/1000).toFixed(1)+' KM':dd+' M')+' AWAY';info.append(a,c)}else info.style.display='none'}
  S.ptr.delete(e.pointerId);S.pd=0;if(!S.ptr.size)cv.style.cursor='grab'};
 cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect();zoom(e.deltaY<0?1.2:1/1.2,e.clientX-r.left,e.clientY-r.top)},{passive:false});
 S.kd=e=>{if(e.key==='Escape'||e.key==='m'||e.key==='M'){e.preventDefault();e.stopPropagation();close()}else if(e.key==='+'||e.key==='=')zoom(1.3);else if(e.key==='-')zoom(1/1.3)};addEventListener('keydown',S.kd,true);addEventListener('resize',fit);
 document.body.appendChild(ov);fit();FOV=S;
 const draw=()=>{S.raf=requestAnimationFrame(draw);const g=cv.getContext('2d'),r=cv.getBoundingClientRect(),Wd=r.width,Ht=r.height,s=S.s;g.setTransform(S.d,0,0,S.d,0,0);g.fillStyle='#3a6e9e';g.fillRect(0,0,Wd,Ht);
  g.imageSmoothingEnabled=s<2;const o=toS(reg[0],reg[3]);g.drawImage(HMAP,o[0],o[1],HMAP.width*s,HMAP.height*s);
  /* street names */
  if(s>.55){g.font='bold '+Math.round(Math.min(14,7+s*2.4))+'px ui-monospace,monospace';g.textAlign='center';g.textBaseline='middle';g.lineWidth=3;g.strokeStyle='#fff';g.fillStyle='#2a3040';
   const step=Math.max(170,330/s);for(const rd of NS)for(let v=-560;v<1000;v+=step){const q=toS(rd.u,v+(rd.i%2)*60);if(q[0]<-40||q[0]>Wd+40||q[1]<-60||q[1]>Ht+60)continue;g.save();g.translate(q[0],q[1]);g.rotate(-Math.PI/2);g.strokeText(rd.n,0,0);g.fillText(rd.n,0,0);g.restore()}
   for(const rd of EW)for(let u=-1180;u<-240;u+=step){if(u>-772&&u<-690&&!MW.BRIDGE.has(rd.j))continue;const q=toS(u+(rd.j%2)*55,rd.v);if(q[0]<-60||q[0]>Wd+60||q[1]<-20||q[1]>Ht+20)continue;g.strokeText(rd.n,q[0],q[1]);g.fillText(rd.n,q[0],q[1])}}
  if(window.SATNAV)SATNAV.drawFull(g,(u,v)=>toS(u,v));
  /* places */
  const R=Math.max(9,Math.min(16,6+s*4));for(const p of pois()){const q=toS(p.u,p.v);if(q[0]<-30||q[1]<-30||q[0]>Wd+30||q[1]>Ht+30)continue;g.fillStyle=p.c;g.strokeStyle=p===S.sel?'#ff0':'#000c';g.lineWidth=p===S.sel?4:2.5;g.beginPath();g.arc(q[0],q[1],R,0,6.3);g.fill();g.stroke();
   g.font=Math.round(R*1.05)+'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle=p.ic==='Ⓜ'?'#fff':'#000';g.fillText(p.ic,q[0],q[1]+1);
   if((s>1.6&&p.ic!=='Ⓜ')||p===S.sel){g.font='bold 11px ui-monospace,monospace';g.fillStyle='#fff';g.strokeStyle='#000';g.lineWidth=3;g.strokeText(p.n,q[0],q[1]+R+9);g.fillText(p.n,q[0],q[1]+R+9)}}
  /* cab fare */
  const F=window.MARLOWE3&&MARLOWE3.F;if(F&&SH&&SH.k==='mcab'){const tg=F.st==='ride'?F.b:F.a;if(tg){const q=toS(tg.x-OX,tg.z-OZ);g.fillStyle=F.st==='ride'?'#3ad07a':'#ffd24a';g.strokeStyle='#000';g.lineWidth=3;g.beginPath();g.arc(q[0],q[1],9,0,6.3);g.fill();g.stroke();g.font='bold 11px ui-monospace,monospace';g.fillStyle='#fff';g.strokeText((F.st==='ride'?'DROP: ':'PICK UP: ')+tg.name,q[0],q[1]-16);g.fillText((F.st==='ride'?'DROP: ':'PICK UP: ')+tg.name,q[0],q[1]-16)}}
  /* you */
  const t=play();if(GS.onFoot){const q=toS(GS.x-OX,GS.z-OZ);g.fillStyle='#4af';g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(q[0],q[1],6,0,6.3);g.fill();g.stroke()}
  {const q=toS(t.x-OX,t.z-OZ),ps=GS.onFoot?P.psi:GS.psi;g.save();g.translate(q[0],q[1]);g.rotate(Math.atan2(-Math.cos(ps),Math.sin(ps)));const z=13;g.fillStyle='#fff';g.strokeStyle='#d00';g.lineWidth=2.5;g.beginPath();g.moveTo(z,0);g.lineTo(-z*.7,-z*.6);g.lineTo(-z*.45,0);g.lineTo(-z*.7,z*.6);g.closePath();g.fill();g.stroke();g.restore()}
  /* scale */const sb=100*s;g.fillStyle='#000a';g.fillRect(Wd-sb-20,Ht-54,sb+8,22);g.fillStyle='#fff';g.fillRect(Wd-sb-16,Ht-38,sb,3);g.font='bold 11px ui-monospace,monospace';g.textAlign='left';g.fillText('100 m',Wd-sb-16,Ht-46);g.fillText('N ↑',Wd-44,70)};
 draw()}
/* the minimap tap and the M key open the map of the place you're in */
addEventListener('click',e=>{if(e.target&&e.target.closest&&e.target.closest('#mm')&&here()){e.stopPropagation();e.preventDefault();openCityMap()}},true);
addEventListener('keydown',e=>{if((e.key==='m'||e.key==='M')&&here()&&!FOV&&!e.repeat&&!e.ctrlKey&&!e.metaKey){const t=e.target;if(t&&/INPUT|TEXTAREA/.test(t.tagName))return;e.stopPropagation();openCityMap()}},true);
/* ------------------------------------------------------------------ your car: waiting in the airport car park */
const VAL={has:0,x:0,z:0,psi:0};
function parkAtAirport(){const p=W(-205,-310.5);GS.x=p[0];GS.z=p[1];GS.psi=-Math.PI/2;GS.vx=GS.vz=0;GS.y=Y+.1;GS.vy=0;GS.prevGY=GS.y;GS.pitch=GS.roll=0}
{const a0=M.arrive;M.arrive=function(sv){a0(sv);if(!inReg(GS.x,GS.z)&&!(window.RESORT&&RESORT.inReg(GS.x,GS.z))&&!(window.MOON&&MOON.MN.on)){VAL.has=1;VAL.x=GS.x;VAL.z=GS.z;VAL.psi=GS.psi}parkAtAirport();setTimeout(()=>{try{phText('COZY VALET',"Your car is waiting for you in the Marlowe Airport car park, just south of the terminal. Enjoy the city!")}catch(e){}},2500)}}
{const H=window.AIRFIELDS.HOME,a0=H.arrive;H.arrive=function(sv){a0(sv);if(inReg(GS.x,GS.z)){if(VAL.has){GS.x=VAL.x;GS.z=VAL.z;GS.psi=VAL.psi}else respawn(false);GS.vx=GS.vz=0;GS.y=gH(GS.x,GS.z)+.1;GS.prevGY=GS.y;VAL.has=0}}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.mval=VAL;return o};cozyLoad=function(z){l0(z);if(z&&z.mval)Object.assign(VAL,z.mval)}}
/* ------------------------------------------------------------------ per-frame */
let blink=0;
let OUTER=null;
{const u0=updCozy;updCozy=function(dt){u0(dt);const on=here();if(!OUTER)OUTER=scene.children.find(o=>o.material===outerMat)||1;if(OUTER!==1){const hide=!!(M.built&&M.active);if(OUTER.visible===hide)OUTER.visible=!hide}TG.visible=PG.visible=on;if(lampG)lampG.visible=on;if(avi)avi.visible=on;if(pools&&!on)pools.visible=false;
 if(!M.built||!M.active)return;if(!pools){nightBits();adTex();setNight()}
 LT+=dt;const cx=cam.position.x,cz=cam.position.z,far=(scene.fog?scene.fog.far:600)+90;
 for(const g of MW.CHUNKS){const dx=Math.max(0,Math.abs(cx-g.userData.cx)-175),dz=Math.max(0,Math.abs(cz-g.userData.cz)-175);g.visible=Math.hypot(dx,dz)<far}
 if(!on)return;
 if(pools){pools.visible=todI>0;}
 /* lamps of the signals */if(lampMs)for(let ax=0;ax<2;ax++){const s=sig(ax);[s==='r',s==='a',s==='g'].forEach((lit,k)=>{const c=lampMs[ax][k].userData.c,f=lit?1:.12;lampMs[ax][k].color.setRGB(c[0]*f,c[1]*f,c[2]*f)})}
 blink+=dt;if(avi){avi.visible=todI>0;avi.material.size=(blink%1.6)<.8?4:1.5}
 if(CITY.water&&CITY.water.material.map)CITY.water.material.map.offset.x=(CITY.water.material.map.offset.x+dt*.008)%1;
 if(CITY.wheel){const w=CITY.wheel;w.g.rotation.x+=dt*.035;for(const p of w.pods)p.rotation.x=-w.g.rotation.x}
 if(CITY.screens&&adT){adClock+=dt;if(adClock>5||!CITY.screens[0].material.map){adClock=0;adI++;CITY.screens.forEach((s,i)=>{s.material.map=adT[(adI+i*2)%adT.length];s.material.needsUpdate=true})}}
 trafficTick(dt);pedTick(dt)}}
MW.onBuilt=function(){};window.MARLOWE2={openCityMap,onBuilt(){},CARS,PED,sig,VAL,streetAt,parkAtAirport,get IM(){return IM}};
})();
