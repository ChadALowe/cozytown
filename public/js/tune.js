/* ---- TUNING GARAGE: car selector, paint (incl. custom colour), performance parts, nitrous, underglow ---- */
(function(){
const TN={brk:0,trb:0,nos:0,tank:0,neon:{},nown:{},cust:null,custOn:0,fin:{},fown:{},rim:{},rown:{},kit:{},kown:{},vin:{},vown:{}};window.TN=TN;
try{const s=JSON.parse(localStorage.getItem('tune1')||'null');if(s)Object.assign(TN,s)}catch(e){}
for(const k of['fin','fown','rim','rown','neon','nown','kit','kown','vin','vown'])if(!TN[k])TN[k]={};
const canon=a=>{const c=PCOL.find(c=>c[1].every((v,i)=>Math.abs(v-a[i])<1e-6));return c?c[1]:a.slice()};const save=()=>{try{localStorage.setItem('tune1',JSON.stringify(TN))}catch(e){}};
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
neonM.position.y=.14;neonM.material.polygonOffset=true;neonM.material.polygonOffsetFactor=-8;neonM.material.polygonOffsetUnits=-8;neonM.visible=false;neonM.renderOrder=3;car.add(neonM);
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
{let t=0;const w=setInterval(()=>{if(window.READY===true||++t>200){clearInterval(w);if(TN.pnt){paintC=canon(TN.pnt);applyPaint()}neonNow()}},100)}


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
const RSZ=[.66,.78,.9],RSZN=['SMALL','MEDIUM','LARGE'],RHT=[0,0,0,0],RHTN=['SLAMMED','LOW','STOCK','LIFTED'];
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


/* ======== body kits + vinyls: shrink-wrapped decals and low-poly parts built from the car's measured hull ======== */
const KSLOT=[
 ['sp','SPOILER',['NONE','LIP','DUCKTAIL','GT WING','BIG WING'],[0,40,60,110,150]],
 ['fr','FRONT SPLITTER',['STOCK','SPLITTER','SPLITTER + CANARDS'],[0,50,90]],
 ['sk','SIDE SKIRTS',['STOCK','SKIRTS','WIDE SKIRTS'],[0,40,70]],
 ['rr','REAR DIFFUSER',['STOCK','DIFFUSER','DIFFUSER + FINS'],[0,45,80]],
 ['rf','ROOF',['STOCK','SCOOP','SHARK FIN','LIGHT BAR'],[0,35,50,75]],
 ['bn','BONNET',['STOCK','SCOOP','TWIN VENTS'],[0,40,60]],
 ['ex','EXHAUST',['STOCK','SINGLE TIP','DUAL TIPS'],[0,25,45]]];
const KCOL=[['BODY',null],['BLACK','#16161a'],['CARBON','#2c3039'],['SILVER','#b8bcc6']];
const KDEF={sp:0,fr:0,sk:0,rr:0,rf:0,bn:0,ex:0,c:0};let kp=null;
const KIT=()=>kp||TN.kit[CARI]||KDEF;
const VDES=['NONE','RACING STRIPES','SIDE STRIPES','FLAMES','TRIBAL','RACE NUMBER','CHEQUER'];
const VCOL=RCOL.map((c,i)=>c).concat([['ORANGE','#f07818'],['PINK','#f02a9a']]);
const VDEF={d:0,c:2,n:7};let vp=null;
const VIN=()=>vp||TN.vin[CARI]||VDEF;
const VDP=[0,40,40,55,55,45,40];
const kitG=new THREE.Group();car.add(kitG);const kmats=[];
const RC=new THREE.Raycaster();RC.far=30;
const bodyDY=()=>RHT[RIM().h]||0;
const HULL={};
function hullOf(i){
 if(HULL[i]&&HULL[i].m.length)return HULL[i];
 const g=i===0?null:(i===1?fies:i===2?van:i===3?lrv:(window.NC&&NC.cars[i]&&NC.cars[i].grp));
 const roots=i===0?c1Kids.filter(k=>!wheels.includes(k)&&k!==kitG):(g?[g]:[]);const m=[];
 for(const r of roots)r.traverse(o=>{if(!o.isMesh||o===kitG||o.parent===kitG||Array.isArray(o.material))return;const t=o.geometry.type;if(t==='CylinderGeometry'||t==='CircleGeometry'||t==='PlaneGeometry')return;
  if(!o.geometry.attributes.position||o.geometry.attributes.position.count<150)return;if(o.material.blending===THREE.AdditiveBlending)return;m.push(o)});
 if(!m.length)return null;
 car.updateMatrixWorld(true);const dy=bodyDY(),bb=new THREE.Box3(),v=new THREE.Vector3();
 for(const o of m){o.geometry.computeBoundingBox();const b=o.geometry.boundingBox;for(const x of[b.min.x,b.max.x])for(const y of[b.min.y,b.max.y])for(const z of[b.min.z,b.max.z]){v.set(x,y,z).applyMatrix4(o.matrixWorld);car.worldToLocal(v);bb.expandByPoint(v)}}
 const H={m,x0:bb.min.x,x1:bb.max.x,y0:bb.min.y-dy,y1:bb.max.y-dy,z0:bb.min.z,z1:bb.max.z};H.hw=Math.min(H.x1,-H.x0)||H.x1;H.L=H.z1-H.z0;
 // refine with rays: the bounding box can include hidden geometry, the visible shell is what matters
 {const ym=H.y0+(H.y1-H.y0)*.38,zc=(H.z0+H.z1)/2;
  const f=cast(H,0,ym,H.z1+6,0,0,-1),r=cast(H,0,ym,H.z0-6,0,0,1),sd=cast(H,H.x1+4,ym,zc,-1,0,0);
  if(f)H.z1=f.p.z;if(r)H.z0=r.p.z;if(sd)H.hw=Math.abs(sd.p.x);H.L=H.z1-H.z0}
 HULL[i]=H;return H}
const _o=new THREE.Vector3(),_d=new THREE.Vector3(),_n=new THREE.Matrix3();
function cast(H,ox,oy,oz,dx,dy2,dz){const dy=bodyDY();_o.set(ox,oy+dy,oz);car.localToWorld(_o);_d.set(dx,dy2,dz).transformDirection(car.matrixWorld);RC.set(_o,_d);
 const hs=RC.intersectObjects(H.m,false);if(!hs.length)return null;const h=hs[0],p=car.worldToLocal(h.point.clone());p.y-=dy;
 const n=h.face.normal.clone().transformDirection(h.object.matrixWorld);n.transformDirection(new THREE.Matrix4().copy(car.matrixWorld).invert());return{p,n}}
const topY=(H,x,z)=>{const r=cast(H,x,H.y1+2,z,0,-1,0);return r?r.p.y:null};
function wrapGrid(H,mode,side,x0,x1,y0,y1,z0,z1,nu,nv,uflip,off){off=off==null?.014:off; // returns geometry conforming to the hull
 const P=[],U=[],ok=[];
 for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const fu=i/nu,fv=j/nv;let r=null;
  if(mode==='side'){const z=z1+(z0-z1)*fu,y=y1+(y0-y1)*fv;r=cast(H,side*(H.hw+2),y,z,-side,0,0);if(r&&Math.abs(r.n.x)<.4)r=null}
  else{const x=x0+(x1-x0)*fu,z=z1+(z0-z1)*fv;r=cast(H,x,H.y1+2,z,0,-1,0);if(r&&r.n.y<.5)r=null}
  if(r){r.p.addScaledVector(r.n,off);P.push(r.p.x,r.p.y,r.p.z)}else P.push(0,0,0);ok.push(!!r);
  U.push(uflip?1-fu:fu,1-fv)}
 const I=[],jump=(a,b)=>mode==='side'?Math.abs(P[a*3]-P[b*3])>.14:Math.abs(P[a*3+1]-P[b*3+1])>.2;
 for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;if(!(ok[a]&&ok[b]&&ok[c]&&ok[d]))continue;if(jump(a,b)||jump(a,c)||jump(b,d)||jump(c,d))continue;
  // flip winding for the side that faces the opposite way
  if(mode==='side'&&side>0)I.push(a,c,b,b,c,d);else I.push(a,b,c,b,d,c)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);return g}

// side skirt: a shell that hugs the sill between the wheel arches, with a bottom lip
function skirtGeo(H,side,za,zb,yb,yt,off,nu,nv){
 const P=[],Q=[],ok=[];
 for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const z=zb+(za-zb)*i/nu,y=yt+(yb-yt)*j/nv;let r=cast(H,side*(H.hw+2),y,z,-side,0,0);if(r&&Math.abs(r.n.x)<.35)r=null;
  if(r){const e=i/nu,tp=Math.min(1,Math.min(e,1-e)*7),t=j/nv,o=r.p.clone().addScaledVector(r.n,.006+off*Math.pow(t,.8)*(.15+.85*tp));P.push(o.x,o.y,o.z);Q.push(r.p.x,r.p.y,r.p.z)}else{P.push(0,0,0);Q.push(0,0,0)}ok.push(!!r)}
 const I=[],add=(a,b,c,d,flip)=>flip?I.push(a,c,b,b,c,d):I.push(a,b,c,b,d,c);
 for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;if(ok[a]&&ok[b]&&ok[c]&&ok[d])add(a,b,c,d,side>0)}
 const n=P.length/3;let pp=P.slice(),base=nv*(nu+1);
 for(let i=0;i<=nu;i++)pp.push(Q[(base+i)*3],Q[(base+i)*3+1],Q[(base+i)*3+2]);
 for(let i=0;i<nu;i++){const a=base+i,b=a+1,c=n+i,d=n+i+1;if(ok[a]&&ok[b])add(a,b,c,d,side<0)}
 const col=new Float32Array(pp.length);for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){const e=i/nu,sh=1-.38*Math.pow(j/nv,1.2)-.1*(1-Math.min(1,Math.min(e,1-e)*8));const k=(j*(nu+1)+i)*3;col[k]=col[k+1]=col[k+2]=sh}for(let i=0;i<=nu;i++){const k=(n+i)*3;col[k]=col[k+1]=col[k+2]=.35}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pp,3));g.setAttribute('color',new THREE.BufferAttribute(col,3));g.setIndex(I);return g}
const dtex={};
function drawDecal(kind,part,col,n){const k=kind+part+col+n;if(dtex[k])return dtex[k];
 const W=part==='top'?128:512,Hh=part==='top'?256:128,c=document.createElement('canvas');c.width=W;c.height=Hh;const x=c.getContext('2d');x.fillStyle=col;x.strokeStyle=col;
 if(part==='top'){
  if(kind===1){x.fillRect(W*.34,0,W*.12,Hh);x.fillRect(W*.54,0,W*.12,Hh)}
  else if(kind===6){const q=14;for(let j=0;j*q<Hh;j++)for(let i=0;i<4;i++)if((i+j)%2===0){x.fillRect(W*.38+i*q,j*q,q,q)}}
  else if(kind===4){x.beginPath();x.moveTo(W*.5,0);x.lineTo(W*.72,Hh*.35);x.lineTo(W*.56,Hh*.35);x.lineTo(W*.56,Hh);x.lineTo(W*.44,Hh);x.lineTo(W*.44,Hh*.35);x.lineTo(W*.28,Hh*.35);x.closePath();x.fill()}
  else if(kind===5){x.beginPath();x.arc(W*.5,Hh*.3,W*.3,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(W*.5,Hh*.3,W*.24,0,7);x.fill();x.fillStyle='#111';x.font='bold '+W*.3+'px monospace';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),W*.5,Hh*.31)}
  else if(kind===3){for(let i=0;i<5;i++){const cx=W*(.2+i*.15);x.beginPath();x.moveTo(cx,Hh);x.quadraticCurveTo(cx-W*.08,Hh*.6,cx+W*.02,Hh*.35);x.quadraticCurveTo(cx+W*.02,Hh*.55,cx+W*.1,Hh*.5);x.quadraticCurveTo(cx+W*.14,Hh*.75,cx+W*.1,Hh);x.fill()}}
 }else{
  if(kind===1){x.fillRect(0,Hh*.44,W,Hh*.1);x.fillRect(0,Hh*.6,W,Hh*.05)}
  else if(kind===2){x.fillRect(0,Hh*.28,W,Hh*.22);x.fillRect(0,Hh*.58,W,Hh*.08)}
  else if(kind===3){for(let i=0;i<9;i++){const bx=W*.04+i*W*.075,h=Hh*(.55+.4*Math.sin(i*1.3+1)*.5);x.beginPath();x.moveTo(bx,Hh);x.quadraticCurveTo(bx+W*.02,Hh-h*.5,bx+W*.07,Hh-h);x.quadraticCurveTo(bx+W*.075,Hh-h*.4,bx+W*.14,Hh*.6);x.quadraticCurveTo(bx+W*.13,Hh*.85,bx+W*.12,Hh);x.fill()}x.fillRect(0,Hh*.88,W,Hh*.12)}
  else if(kind===4){x.beginPath();x.moveTo(0,Hh*.9);x.lineTo(W*.25,Hh*.25);x.lineTo(W*.4,Hh*.55);x.lineTo(W*.65,Hh*.12);x.lineTo(W*.72,Hh*.5);x.lineTo(W,Hh*.3);x.lineTo(W*.78,Hh*.7);x.lineTo(W*.55,Hh*.9);x.lineTo(W*.4,Hh*.75);x.lineTo(W*.2,Hh);x.closePath();x.fill()}
  else if(kind===5){x.beginPath();x.arc(W*.5,Hh*.5,Hh*.46,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(W*.5,Hh*.5,Hh*.37,0,7);x.fill();x.fillStyle='#111';x.font='bold '+Hh*.5+'px monospace';x.textAlign='center';x.textBaseline='middle';x.fillText(String(n),W*.5,Hh*.54)}
  else if(kind===6){const q=Hh/6;for(let j=0;j<3;j++)for(let i=0;i*q<W;i++)if((i+j)%2===0)x.fillRect(i*q,Hh*.55+j*q,q,q)}}
 const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return dtex[k]=t}
const dmat=(t)=>{const m=new THREE.MeshBasicMaterial({map:t,transparent:true,alphaTest:.3,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4});m.userData={decal:1};kmats.push(m);return m};
// face-shaded box so parts read as solid shapes
const FS=[.82,.7,1,.45,.9,.74];
function pbx(w,h,d,x,y,z,mat,rx,ry,rz){const g=new THREE.BoxGeometry(w,h,d),c=new Float32Array(g.attributes.position.count*3);for(let f=0;f<6;f++)for(let v=0;v<4;v++){const i=(f*4+v)*3;c[i]=c[i+1]=c[i+2]=FS[f]}g.setAttribute('color',new THREE.BufferAttribute(c,3));const m=new THREE.Mesh(g,mat);m.position.set(x,y,z);m.rotation.set(rx||0,ry||0,rz||0);kitG.add(m);return m}
const pmats={},pm2={};function dmatS(ci){if(!pm2[ci]){const m=pmat(ci).clone();m.side=THREE.DoubleSide;m.userData={part:ci};pm2[ci]=m;kmats.push(m)}return pm2[ci]}
function pmat(ci){const k=ci;if(!pmats[k]){const m=new THREE.MeshBasicMaterial({vertexColors:true});m.userData={part:ci};pmats[k]=m;kmats.push(m)}return pmats[k]}
const lens=new THREE.MeshBasicMaterial({color:0xfff6d0}),vent=new THREE.MeshBasicMaterial({color:0x08080a}),chrome=new THREE.MeshBasicMaterial({color:0xd8dce4});
function buildParts(H,K){
 const hw=H.hw,L=H.L,z0=H.z0,z1=H.z1,M=pmat(K.c);
 let yRoof=0,zRf=z0+L*.55,zRr=z0+L*.3;const smp=[];
 for(let i=0;i<=28;i++){const z=z0+L*(.06+.88*i/28),y=topY(H,0,z);smp.push([z,y])}
 for(const[z,y]of smp)if(y!=null&&y>yRoof)yRoof=y;
 const zs=smp.filter(a=>a[1]!=null&&a[1]>yRoof-.06).map(a=>a[0]);if(zs.length){zRf=Math.max(...zs);zRr=Math.min(...zs)}
 const yDeck=(topY(H,0,z0+L*.1)??H.y1*.7),yBon=(topY(H,0,z1-L*.18)??H.y1*.6);
 const roofR=cast(H,hw+2,yRoof-.12,(zRf+zRr)/2,-1,0,0),rhw=roofR?Math.min(hw,Math.abs(roofR.p.x)):hw*.85;
 // bonnet extent: from the nose back to where the windscreen starts rising
 let zBn0=z1-L*.25;{let yp=topY(H,0,z1-.12);for(let i=1;i<=70;i++){const z=z1-.12-i*.03,y=topY(H,0,z);if(y!=null&&yp!=null&&(y-yp)/.03>.75&&i>4){zBn0=z+.03;break}if(y!=null)yp=y}}
 const zb=(z1-.12+zBn0)/2,yb=topY(H,0,zb)??yBon,lb=z1-.12-zBn0;
 const rl=cast(H,0,.3,z0-6,0,0,1),fl=cast(H,0,.24,z1+6,0,0,-1),zrL=rl?rl.p.z:z0,zfL=fl?fl.p.z:z1;
 const sx=(()=>{const r=cast(H,hw+2,H.y1*.2,(z0+z1)/2,-1,0,0);return r?r.p.x:hw})();
 // spoilers are mounted on the surface that is really there: first flat, high surface found scanning forward from the tail
 let zS=z0+L*.13,yM=topY(H,0,zS)??yDeck;
 for(let i=0;i<=80;i++){const z=z0+.03+i*.03,r=cast(H,0,H.y1+2,z,0,-1,0);if(r&&r.n.y>.8&&r.p.y>H.y1*.62){zS=z+.16;yM=topY(H,0,zS)??r.p.y;break}}
 const sxM=(()=>{const r=cast(H,hw+2,yM-.03,zS,-1,0,0);return r?Math.abs(r.p.x):hw*.8})(),sw=Math.min(hw*1.7,sxM*2+.04);
 const sy=x=>topY(H,x,zS)??yM,slope=(()=>{const a=topY(H,0,zS-.15),b=topY(H,0,zS+.15);return a!=null&&b!=null?Math.atan2(a-b,.3):0})();
 if(K.sp===1)pbx(sw,.05,.22,0,yM+.01,zS,M,-slope);
 if(K.sp===2){pbx(sw,.05,.34,0,yM+.05,zS-.03,M,-slope-.3);for(const s of[-1,1])pbx(.035,.13,.3,s*(sw/2-.02),yM+.05,zS-.02,M,-slope)}
 if(K.sp>=3){const big=K.sp===4,hgt=big?.42:.26,ch=big?.5:.38,ux=sw*.3,yTop=Math.max(sy(ux),sy(-ux),yM)+hgt;
  pbx(sw,.05,ch,0,yTop,zS-.02,M,-.08);if(big)pbx(sw,.07,.06,0,yTop+.07,zS-.22,M);
  for(const s of[-1,1]){const yb=sy(s*ux)-.04,hh=yTop-yb;pbx(.05,hh,.08,s*ux,yb+hh/2,zS,M);pbx(.025,.15,ch+.04,s*(sw/2-.01),yTop+.03,zS-.02,M)}}
 // front
 if(K.fr>=1){pbx(hw*1.8,.04,.3,0,.17,zfL-.02,M);if(K.fr===2){for(const s of[-1,1]){pbx(.03,.18,.22,s*hw*.9,.3,zfL-.1,M,0,s*.3);pbx(.03,.1,.2,s*hw*.7,.22,zfL-.04,M,0,s*-.25)}pbx(hw*1.6,.05,.1,0,.2,zfL+.1,M)}}
 // side skirts: hug the sill between the wheel arches
 if(K.sk>=1){const ws=rimTargets(CARI).w.map(w=>w.piv.position.z),zf=Math.max(...ws),zr=Math.min(...ws),R=(rimTargets(CARI).w[0]||{R:.3}).R,za=zf-R*1.3,zb=zr+R*1.3;
  let yb=.3;for(let y=.08;y<.7;y+=.02){const r=cast(H,hw+2,y,(za+zb)/2,-1,0,0);if(r&&Math.abs(r.n.x)>.3){yb=y;break}}
  const h=K.sk===2?.15:.11,off=K.sk===2?.11:.075;yb-=.015;
  for(const s of[-1,1]){const g=skirtGeo(H,s,za,zb,yb,yb+h,off,24,5);const m=new THREE.Mesh(g,dmatS(K.c));m.frustumCulled=false;kitG.add(m)}}
 // rear diffuser
 if(K.rr>=1){pbx(hw*1.2,.05,.34,0,.19,zrL+.2,M,.12);if(K.rr===2){for(let i=-2;i<=2;i++)pbx(.025,.1,.32,i*hw*.26,.15,zrL+.2,M,.12);pbx(hw*1.3,.04,.26,0,.11,zrL+.16,M)}}
 // roof
 if(K.rf===1){pbx(Math.min(.5,rhw*.9),.1,.4,0,yRoof+.05,zRf-.3,M,.15);pbx(Math.min(.4,rhw*.7),.07,.04,0,yRoof+.08,zRf-.12,vent)}
 if(K.rf===2){pbx(.03,.17,.5,0,yRoof+.08,zRr+.3,M,-.12);pbx(.05,.04,.14,0,yRoof+.01,zRr+.42,M)}
 if(K.rf===3){const bw=rhw*1.7;pbx(bw,.1,.14,0,yRoof+.08,zRf-.15,M);for(const i of[-3,-1,1,3])pbx(bw*.17,.07,.03,i*bw*.22,yRoof+.08,zRf-.075,lens)}
 // bonnet
 if(K.bn===1){const dl=Math.min(.5,lb*.6),bw=Math.min(.55,hw*.6);pbx(bw,.11,dl,0,yb+.05,zb,M,-.13);pbx(bw*.8,.07,.04,0,yb+.065,zb+dl/2,vent)}
 if(K.bn===2){const n=Math.max(2,Math.min(5,Math.floor(lb/.11)));for(const s of[-1,1])for(let i=0;i<n;i++){const zz=z1-.2-i*(lb-.2)/n,yy=topY(H,s*hw*.38,zz);if(yy!=null)pbx(Math.min(.36,hw*.4),.025,.04,s*hw*.38,yy+.012,zz,vent,0,0,s*.06)}}
 // exhaust
 if(K.ex>=1){const tip=x=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,.16,10).rotateX(Math.PI/2),chrome);m.position.set(x,.3,zrL+.0);kitG.add(m);const i=new THREE.Mesh(new THREE.CircleGeometry(.035,8).rotateY(Math.PI),vent);i.position.set(x,.3,zrL-.082);kitG.add(i)};
  if(K.ex===1)tip(hw*.5);else{tip(hw*.5);tip(-hw*.5)}}}
function buildDecals(H,V){
 if(!V.d)return;const col=VCOL[V.c][1],n=V.n;
 const sideKinds=[1,2,3,4,5,6],topKinds=[1,3,4,5,6];
 if(sideKinds.includes(V.d)){const read=V.d===5;
  for(const side of[1,-1]){const g=wrapGrid(H,'side',side,0,0,H.y1*.24,H.y1*.56,H.z0+H.L*.1,H.z1-H.L*.1,26,7,read&&side<0);const m=new THREE.Mesh(g,dmat(drawDecal(V.d,'side',col,n)));m.renderOrder=20;m.frustumCulled=false;kitG.add(m)}}
 if(topKinds.includes(V.d)&&V.d!==3&&V.d!==5||V.d===5){ // bonnet/roof/boot (number roundel only on bonnet)
  const zz=V.d===5?[H.z1-H.L*.45,H.z1-H.L*.05]:[H.z0+H.L*.02,H.z1-H.L*.02];
  const g=wrapGrid(H,'top',0,-H.hw*.96,H.hw*.96,0,0,zz[0],zz[1],14,V.d===5?10:46,false);const m=new THREE.Mesh(g,dmat(drawDecal(V.d,'top',col,n)));m.renderOrder=20;m.frustumCulled=false;kitG.add(m)}}
let kitTimer=0,kitRetry=0;
function kitApply(now){
 if(!now){clearTimeout(kitTimer);kitTimer=setTimeout(()=>kitApply(1),120);return}
 for(const c of[...kitG.children]){kitG.remove(c);if(c.geometry)c.geometry.dispose()}
 const V=VIN(),K=KIT(),any=V.d||K.sp||K.fr||K.sk||K.rr||K.rf||K.bn||K.ex;
 kitG.position.y=bodyDY();if(!any)return;
 const H=hullOf(CARI);if(!H){if(kitRetry++<8)setTimeout(()=>kitApply(1),1200);return}kitRetry=0;
 try{buildParts(H,K);buildDecals(H,V)}catch(e){console.warn('kit',e)}}
{const uc=updCozy;updCozy=function(dt){uc(dt);const l=U.uLight.value,b=finRGB(paintC,FIN());
  for(const m of kmats){if(m.userData.decal){m.color.setRGB(l.x,l.y,l.z)}else{const ci=m.userData.part,cc=KCOL[ci][1];if(!cc)m.color.setRGB(b[0]*l.x,b[1]*l.y,b[2]*l.z);else{const t=new THREE.Color(cc);m.color.setRGB(t.r*l.x,t.g*l.y,t.b*l.z)}}}}}
{const s0=setCar;setCar=function(i){s0(i);kitApply()}}
{const ra=rimsApply;rimsApply=function(){ra();kitG.position.y=bodyDY()}}
setTimeout(()=>kitApply(),1500);setTimeout(()=>kitApply(),7500);
window.TNT={kit:o=>{kp=o;kitApply(1)},vin:o=>{vp=o;kitApply(1)},hull:()=>hullOf(CARI)};

/* ======== tuning screen ======== */
/* ---- garage interior set for the tuning screen (round room so any orbit angle looks right) ---- */
let TG=null;
function buildSet(){const g=new THREE.Group();g.position.set(GX,GY,GZ);g.visible=false;scene.add(g);const ms=[];
 const mt=(c,keep)=>{const m=new THREE.MeshBasicMaterial({color:c});m.userData={b:new THREE.Color(c),keep:!!keep};ms.push(m);return m};
 const bx=(w,h,d,x,y,z,c,keep,ry)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mt(c,keep));m.position.set(x,y+h/2,z);if(ry)m.rotation.y=ry;g.add(m);return m};
 const cv=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t};
 const pl=(w,h,x,y,z,tex,ry,keep)=>{const m=new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.05});m.userData={b:new THREE.Color(1,1,1),keep:!!keep};ms.push(m);const p=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);p.position.set(x,y,z);p.rotation.y=ry||0;g.add(p);return p};
 const RAD=10.5,H=4.6;
 // floor + markings
 const fl=new THREE.Mesh(new THREE.CircleGeometry(RAD+1,28).rotateX(-Math.PI/2),mt(0x4b4d56));fl.position.y=-.02;g.add(fl);
 bx(5.6,.01,.14,0,0,2.9,0xe8c21a);bx(5.6,.01,.14,0,0,-2.9,0xe8c21a);bx(.14,.01,5.8,2.8,0,0,0xe8c21a);bx(.14,.01,5.8,-2.8,0,0,0xe8c21a);
 // walls: ring of panels
 const N=14,panelW=2*Math.PI*RAD/N+.05;
 const shut=cv(64,64,(x,w,h)=>{x.fillStyle='#d8801a';x.fillRect(0,0,w,h);for(let y=0;y<h;y+=4){x.fillStyle='#a85a10';x.fillRect(0,y,w,1)}});
 const peg=cv(128,96,(x,w,h)=>{x.fillStyle='#8a7a5a';x.fillRect(0,0,w,h);x.fillStyle='#5a4a30';for(let i=0;i<w;i+=8)for(let j=0;j<h;j+=8)x.fillRect(i,j,1,1);
  const tool=(px,py,tw,th,c)=>{x.fillStyle=c;x.fillRect(px,py,tw,th)};for(let i=0;i<7;i++){tool(8+i*17,10,4,40+i%3*8,'#c8c8d0');tool(5+i*17,10,10,8,i%2?'#d03030':'#3060d0')}for(let i=0;i<5;i++)tool(10+i*24,70,18,5,'#b0b0b8')});
 for(let i=0;i<N;i++){const a=i/N*Math.PI*2,x=Math.sin(a)*RAD,z=Math.cos(a)*RAD,ry=a+Math.PI;
  const grp=new THREE.Group();grp.position.set(x,0,z);grp.rotation.y=ry;g.add(grp);
  const add=(w,h,d,px,py,pz,c,keep)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mt(c,keep));m.position.set(px,py+h/2,pz);grp.add(m);return m};
  add(panelW,H,.5,0,0,0,i%2?0x8e939c:0x80858f);add(panelW,1.1,.55,0,0,0,0x3a3f4a);add(panelW,.18,.6,0,.55,0,i%2?0xe8c21a:0x1a1a1a);
  if(i%4===1){const m=new THREE.Mesh(new THREE.PlaneGeometry(panelW*.86,2.9),new THREE.MeshBasicMaterial({map:shut}));m.userData.b=1;ms.push(Object.assign(m.material,{userData:{b:new THREE.Color(1,1,1)}}));m.position.set(0,1.7,.27);grp.add(m);add(panelW*.9,.3,.3,0,3.15,.3,0xe8c21a,1)}
  else if(i%4===3){const m=new THREE.Mesh(new THREE.PlaneGeometry(panelW*.9,2.1),new THREE.MeshBasicMaterial({map:peg}));ms.push(Object.assign(m.material,{userData:{b:new THREE.Color(1,1,1)}}));m.position.set(0,2.4,.27);grp.add(m)}
  else{add(panelW*.9,.12,.3,0,1.1,.4,0x55575e);add(.2,1.1,.3,-panelW*.3,0,.4,0x55575e);add(.2,1.1,.3,panelW*.3,0,.4,0x55575e);add(.8,.5,.4,panelW*.1,1.22,.4,0xb82020)}}
 // ceiling + strip lights + beams
 const ce=new THREE.Mesh(new THREE.CircleGeometry(RAD+1,28).rotateX(Math.PI/2),mt(0x24262c));ce.position.y=H;g.add(ce);
 for(let i=-2;i<=2;i++){bx(.5,.12,13,i*3.6,H-.15,0,0x30323a);for(const z of[-3.8,-.2,3.4])bx(.34,.1,2.4,i*3.6,H-.24,z,0xfff8e0,1)}
 // wall sign
 pl(5.6,1.1,0,3.7,-RAD+.52,cv(512,100,(x,w,h)=>{x.fillStyle='#0a3ca0';x.fillRect(0,0,w,h);x.fillStyle='#f6d020';x.fillRect(0,0,w,9);x.fillRect(0,h-9,w,9);x.fillStyle='#fff';x.font='bold 34px monospace';x.textAlign='center';x.textBaseline='middle';x.fillText("JOE'S GARAGE · TUNING",w/2,h/2)}),0,1);
 // props round the room
 const tyres=(x,z,n)=>{for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.44,.44,.25,10),mt(0x16161a));m.position.set(x,.13+.26*i,z);g.add(m);const r=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.26,8),mt(0x6a6c74));r.position.set(x,.13+.26*i,z);g.add(r)}};
 const ring=(a,r)=>[Math.sin(a)*r,Math.cos(a)*r];
 {const[x,z]=ring(.55,RAD-1.6);tyres(x,z,6);tyres(x+.9,z-.3,4);tyres(x-.2,z-1,3)}
 {const[x,z]=ring(2.6,RAD-1.4);bx(2.4,.9,.8,x,0,z,0xb82020);bx(2.5,.12,.9,x,.9,z,0x9a9aa2);bx(.5,1.3,.5,x+2.1,0,z-.2,0x2a5ab0)}
 {const[x,z]=ring(-2.3,RAD-1.5);bx(3.4,.9,.9,x,0,z,0x7a5a30);bx(3.5,.1,1,x,.9,z,0xb8b8c0)}
 for(const[a,r]of[[-.7,RAD-1.2],[3.9,RAD-1.1],[4.3,RAD-1.3]]){const[x,z]=ring(a,r);const d=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.95,10),mt(a<0?0x1a5a2a:0xb82020));d.position.set(x,.48,z);g.add(d)}
 {const[x,z]=ring(5.4,RAD-1.6);bx(.3,1.2,.3,x,0,z,0xe8c21a);bx(1.8,.12,.3,x,1.2,z,0xe8c21a)}
 // wall lights glow (kept bright at night)
 g.userData.ms=ms;return g}
function setLit(){if(!TG)return;const k=GAL.lt==='NIGHT'?.4:GAL.lt==='STUDIO'?1:GAL.lt==='DUSK'?.72:.95;for(const m of TG.userData.ms){const b=m.userData.b;if(!b||b===1)continue;const f=m.userData.keep?1:k;m.color.setRGB(b.r*f,b.g*f,b.b*f)}}
{const g0=updGallery;updGallery=function(dt){g0(dt);if(!on)return;GAL.d=Math.min(GAL.d,9.2);GAL.h=Math.min(GAL.h,3.6);setLit()}}

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
const TABS=[['cars','CARS'],['paint','PAINT'],['perf','PERFORMANCE'],['neon','UNDERGLOW'],['wheels','WHEELS'],['body','BODY KITS'],['vinyl','VINYLS']];
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
  if(cc){if(ix>=0){OWN.paint[ix]=1;TN.custOn=0}else{TN.cust=paintC;TN.custOn=1}S.commit.paint=paintC;TN.pnt=paintC.slice();save()}
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
function rimCost(){const r=RIM(),c=TN.rim[CARI]||RDEF;let t=0;if(r.d>0){if(r.d!==c.d&&!TN.rown['d'+r.d])t+=70;if(r.c!==c.c&&!TN.rown['c'+r.c]&&r.c)t+=10}if(r.s!==c.s)t+=20;return t}
function rimChanged(){const r=RIM(),c=TN.rim[CARI]||RDEF;return r.d!==c.d||r.c!==c.c||r.s!==c.s}
function rimSet(k,v){const r=Object.assign({},RIM());r[k]=v;rp=r;rimsApply();tabWheels(1)}
function tabWheels(keep){const B=$q('#tnBody'),top=B.scrollTop,r=RIM(),c=TN.rim[CARI]||RDEF;
 B.innerHTML='<div class="tnH">RIM DESIGN · £70, FREE ONCE OWNED</div><div class="tnGrid" id="rd"></div><div class="tnH">RIM COLOUR · £10, SILVER FREE</div><div class="tnGrid" id="rc"></div><div class="tnH">RIM SIZE · £20 TO CHANGE</div><div id="rs"></div>';
 const gd=B.querySelector('#rd'),gc=B.querySelector('#rc');
 RDES.forEach((n,i)=>{const d=document.createElement('div');d.className='tnSw'+(r.d===i?' sel':'')+(c.d===i?' cur':'');d.style.background=i?'#0c1020 url('+thumb(i,r.c)+') center/78% no-repeat':'#101830';d.style.imageRendering='pixelated';d.innerHTML=(i&&!TN.rown['d'+i]?'<span class="p">£70</span>':'')+n.replace('SPLIT ','');d.onclick=()=>rimSet('d',i);gd.appendChild(d)});
 RCOL.forEach((n,i)=>{const d=document.createElement('div');d.className='tnSw'+(r.c===i?' sel':'')+(c.c===i?' cur':'');d.style.background=n[1];d.style.color=['#f2f2f2','#eaf6ff','#c9ccd2','#d9ab2b'].includes(n[1])?'#000':'#fff';d.style.textShadow='none';d.innerHTML=(i&&!TN.rown['c'+i]?'<span class="p" style="color:#a50">£10</span>':'')+n[0];d.onclick=()=>rimSet('c',i);gc.appendChild(d)});
 B.querySelector('#rs').innerHTML=`<div class="tnSl"><span style="width:62px">SIZE</span><input type="range" min="0" max="2" step="1" value="${r.s}" id="rsS"><b style="width:62px;color:#fff">${RSZN[r.s]}</b></div>`;
 B.querySelector('#rsS').onchange=e=>rimSet('s',+e.target.value);
 B.querySelector('#rsS').oninput=e=>{rp=Object.assign({},RIM(),{s:+e.target.value});rimsApply()};
 if(keep)B.scrollTop=top;wheelsBtn()}
function wheelsBtn(){const r=RIM(),cost=rimCost();head();
 if(!rimChanged()){setMsg((r.d?RDES[r.d]+' · '+RCOL[r.c][0]+' · ':'STOCK WHEELS · ')+RSZN[r.s]);buyBtn('FITTED',null,1);return}
 setMsg((r.d?RDES[r.d]+' · '+RCOL[r.c][0]:'STOCK WHEELS')+' · '+RSZN[r.s]+(cost?' · £'+cost:''));
 buyBtn(cost?'BUY £'+cost:'FIT IT',()=>{if(cost&&!pay(cost))return;if(r.d)TN.rown['d'+r.d]=1;if(r.d&&r.c)TN.rown['c'+r.c]=1;TN.rim[CARI]=Object.assign({},r);rp=null;save();setMsg('WHEELS FITTED!');flash(1);tabWheels(1);head()},cash<cost)}

/* ---- tab: body kits ---- */
function kitCost(){const k=KIT(),c=TN.kit[CARI]||KDEF;let t=0;for(const[id,,,pr]of KSLOT)if(k[id]!==c[id]&&k[id]>0&&!TN.kown[CARI+id+k[id]])t+=pr[k[id]];if(k.c!==c.c&&k.c&&!TN.kown[CARI+'c'+k.c])t+=10;return t}
function kitChanged(){const k=KIT(),c=TN.kit[CARI]||KDEF;return Object.keys(KDEF).some(x=>k[x]!==c[x])}
function kitSet(id,v){kp=Object.assign({},KIT());kp[id]=v;kitApply();tabBody(1)}
function tabBody(keep){const B=$q('#tnBody'),top=B.scrollTop,k=KIT(),c=TN.kit[CARI]||KDEF;B.innerHTML='';
 for(const[id,nm,names,pr]of KSLOT){const h=document.createElement('div');h.className='tnH';h.textContent=nm;B.appendChild(h);const g=document.createElement('div');g.className='tnGrid';g.style.gridTemplateColumns='repeat(3,1fr)';
  names.forEach((n,i)=>{const d=document.createElement('div');d.className='tnSw'+(k[id]===i?' sel':'')+(c[id]===i?' cur':'');d.style.background='#101830';d.style.aspectRatio='auto';d.style.minHeight='46px';d.style.alignItems='center';d.style.paddingBottom='0';d.style.textAlign='center';
   d.innerHTML=(i&&!TN.kown[CARI+id+i]?'<span class="p">£'+pr[i]+'</span>':'')+n;d.onclick=()=>kitSet(id,i);g.appendChild(d)});B.appendChild(g)}
 const h=document.createElement('div');h.className='tnH';h.textContent='PART COLOUR · £10 TO CHANGE';B.appendChild(h);const g=document.createElement('div');g.className='tnGrid';
 KCOL.forEach((n,i)=>{const d=document.createElement('div');d.className='tnSw'+(k.c===i?' sel':'')+(c.c===i?' cur':'');d.style.background=n[1]||'linear-gradient(135deg,#c8102e,#1c4fa0)';d.style.minHeight='46px';d.style.aspectRatio='auto';d.style.alignItems='center';d.style.paddingBottom='0';d.innerHTML=(i&&!TN.kown[CARI+'c'+i]?'<span class="p">£10</span>':'')+n[0];d.onclick=()=>kitSet('c',i);g.appendChild(d)});B.appendChild(g);
 if(keep)B.scrollTop=top;bodyBtn()}
function bodyBtn(){const k=KIT(),cost=kitCost();head();const desc=KSLOT.filter(s=>k[s[0]]).map(s=>s[2][k[s[0]]]).join(' · ')||'STOCK BODY';
 if(!kitChanged()){setMsg(desc);buyBtn('FITTED',null,1);return}
 setMsg(desc+(cost?' · £'+cost:''));
 buyBtn(cost?'BUY £'+cost:'FIT IT',()=>{if(cost&&!pay(cost))return;for(const[id]of KSLOT)if(k[id])TN.kown[CARI+id+k[id]]=1;if(k.c)TN.kown[CARI+'c'+k.c]=1;TN.kit[CARI]=Object.assign({},k);kp=null;save();setMsg('BODY KIT FITTED!');flash(1);tabBody(1);head()},cash<cost)}

/* ---- tab: vinyls ---- */
const vthumb={};const vt=(d,c)=>{const k=d+c;if(vthumb[k])return vthumb[k];if(!d)return'';const cv=document.createElement('canvas');cv.width=96;cv.height=48;const x=cv.getContext('2d');x.fillStyle='#1a2340';x.fillRect(0,0,96,48);const t=drawDecal(d,'side',VCOL[c][1],7).image;x.drawImage(t,0,6,96,36);return vthumb[k]=cv.toDataURL()};
function vinCost(){const v=VIN(),c=TN.vin[CARI]||VDEF;let t=0;if(v.d&&v.d!==c.d&&!TN.vown['d'+v.d])t+=VDP[v.d];if(v.d&&v.c!==c.c&&!TN.vown['c'+v.c]&&v.c!==4&&v.c!==2)t+=10;return t}
function vinChanged(){const v=VIN(),c=TN.vin[CARI]||VDEF;return v.d!==c.d||v.c!==c.c||(v.d===5&&v.n!==c.n)}
function vinSet(k,val){vp=Object.assign({},VIN());vp[k]=val;kitApply();tabVinyl(1)}
function tabVinyl(keep){const B=$q('#tnBody'),top=B.scrollTop,v=VIN(),c=TN.vin[CARI]||VDEF;
 B.innerHTML='<div class="tnH">DESIGN · £40-55, FREE ONCE OWNED</div><div class="tnGrid" id="vd" style="grid-template-columns:repeat(3,1fr)"></div><div class="tnH">COLOUR · £10, WHITE + BLACK FREE</div><div class="tnGrid" id="vc"></div><div class="tnH" id="vnh">RACE NUMBER</div><div class="tnSl" id="vn"></div>';
 const gd=B.querySelector('#vd'),gc=B.querySelector('#vc');
 VDES.forEach((n,i)=>{const d=document.createElement('div');d.className='tnSw'+(v.d===i?' sel':'')+(c.d===i?' cur':'');d.style.cssText+=';aspect-ratio:auto;min-height:62px;background:#101830 '+(i?'url('+vt(i,v.c)+') center 8px/80% auto no-repeat':'')+';image-rendering:pixelated';d.innerHTML=(i&&!TN.vown['d'+i]?'<span class="p">£'+VDP[i]+'</span>':'')+n.replace('RACING ','').replace('RACE ','#');d.onclick=()=>vinSet('d',i);gd.appendChild(d)});
 VCOL.forEach((n,i)=>{const d=document.createElement('div');d.className='tnSw'+(v.c===i?' sel':'')+(c.c===i?' cur':'');d.style.background=n[1];d.style.textShadow='none';d.style.color=['#f2f2f2','#eaf6ff','#c9ccd2','#d9ab2b'].includes(n[1])?'#000':'#fff';d.innerHTML=(i!==4&&i!==2&&!TN.vown['c'+i]?'<span class="p" style="color:#a50">£10</span>':'')+n[0];d.onclick=()=>vinSet('c',i);gc.appendChild(d)});
 const vn=B.querySelector('#vn');vn.innerHTML='<button class="tnPill pe" id="vm">−</button><b style="flex:1;text-align:center;font:900 22px monospace;color:#fff">'+v.n+'</b><button class="tnPill pe" id="vpl">+</button>';
 B.querySelector('#vm').onclick=()=>vinSet('n',(v.n+99)%100);B.querySelector('#vpl').onclick=()=>vinSet('n',(v.n+1)%100);
 if(v.d!==5){B.querySelector('#vnh').style.display='none';vn.style.display='none'}
 if(keep)B.scrollTop=top;vinBtn()}
function vinBtn(){const v=VIN(),cost=vinCost();head();const desc=v.d?VDES[v.d]+' · '+VCOL[v.c][0]+(v.d===5?' · #'+v.n:''):'NO VINYL';
 if(!vinChanged()){setMsg(desc);buyBtn('FITTED',null,1);return}
 setMsg(desc+(cost?' · £'+cost:''));
 buyBtn(cost?'BUY £'+cost:'FIT IT',()=>{if(cost&&!pay(cost))return;if(v.d)TN.vown['d'+v.d]=1;if(v.d&&v.c!==4&&v.c!==2)TN.vown['c'+v.c]=1;TN.vin[CARI]=Object.assign({},v);vp=null;save();setMsg('VINYL APPLIED!');flash(1);tabVinyl(1);head()},cash<cost)}

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
 if(S.tab==='body'&&k!=='body'){kp=null;kitApply()}
 if(S.tab==='vinyl'&&k!=='vinyl'){vp=null;kitApply()}
 if(S.tab==='neon'&&k!=='neon'){neonPrev=null;neonNow()}
 S.tab=k;S.msg='';tabs();$q('#tnBody').scrollTop=0;
 GAL.lt=k==='neon'?'NIGHT':'STUDIO';GAL.spin=k==='cars'?1:0;
 if(k==='cars')gv(...VIEWS['34']);else if(k==='paint')gv(.9,1.3,6.4,30);else if(k==='perf')gv(.2,.9,6.8,28);else if(k==='neon')gv(.5,.25,5.5,40);else if(k==='wheels')gv(1.25,.35,5.2,34);else if(k==='body')gv(2.55,1.5,6.8,32);else if(k==='vinyl')gv(1.5708,.9,7.6,30);
 ({cars:tabCars,paint:tabPaint,perf:()=>{S.sel=0;tabPerf()},neon:tabNeon,wheels:tabWheels,body:tabBody,vinyl:tabVinyl}[k]||(()=>tabSoon((TABS.find(t=>t[0]===k)||[])[1])))();
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
 if(!TG)TG=buildSet();TG.visible=true;galG.visible=false;
 go(tab||'cars')}
function closeTune(){
 if(!on)return;on=0;
 // undo anything previewed but not bought
 paintC=S.commit.paint;finPrev=null;rp=null;kp=null;vp=null;applyPaint();kitApply();
 neonPrev=null;GAL.sv.car=S.commit.car;GAL.sv.paint=S.commit.paint;
 if(window.JOEBAY){GAL.sv.x=JOEBAY.x;GAL.sv.z=JOEBAY.z;GAL.sv.psi=JOEBAY.psi;window.JOEBAY=null}
 root.style.display='none';galUI.classList.remove('tuning');if(TG)TG.visible=false;TN.pnt=S.commit.paint.slice();save();
 closeGallery();neonNow();
 if(TN.custOn&&TN.cust&&paintC===TN.cust)applyPaint()}
window.openTune=openTune;window.closeTune=closeTune;window.TNon=()=>on;
// car sits in the free part of the screen, the menu on the other
{const uc=updateCam;updateCam=function(dt){uc(dt);
  if(on&&GAL.on){const W=innerWidth,H=innerHeight,pn=$q('#tnPanel').getBoundingClientRect();
   if(W>H*1.0)cam.setViewOffset(W,H,pn.width/2+4,0,W,H);else cam.setViewOffset(W,H,0,pn.height/2+4,W,H)}
  else if(cam.view&&cam.view.enabled)cam.clearViewOffset()}}
// keep the first-person overlay etc. out of the way and make sure leaving by any route cleans up
{const c0=closeGallery;closeGallery=function(){if(on){on=0;root.style.display='none';galUI.classList.remove('tuning');if(TG)TG.visible=false}c0()}}
// Joe's garage + the old spray booth now open the tuning screen
{const o0=openShop;openShop=function(m){if(m==='garage2'){toast('DRIVE YOUR CAR INTO A BAY AT JOES GARAGE');return}o0.apply(this,arguments)}}
garagePaint=function(){toast('DRIVE YOUR CAR INTO A BAY AT JOES GARAGE')};
})();

{const lg=loadGame;loadGame=function(){const r=lg.apply(this,arguments);if(r&&TN.pnt){paintC=canon(TN.pnt);try{applyPaint()}catch(e){}}neonNow();return r}}
