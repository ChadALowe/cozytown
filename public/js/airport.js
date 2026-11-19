/* ===== COZY AIRWAYS: fly to another city. Check in at the village airport office, watch your character board the plane, take off,
   fly through the clouds and land at the other airport as a cut-scene sequence. The destination map is built in small slices while the
   sky scene plays, so the world loads without the player noticing. Maps register themselves (airfields.js); adding a destination later
   is one more registerMap() call + a route entry. Everything cinematic is a pure function of time, so it can be seeked and skipped. ===== */
(function(){
const Y=G0,TAU=Math.PI*2,PH=2.75;
const AP={trips:0,spent:0,goods:{},dem:{},day:-1,at:'home'};
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.ap=AP;return o};cozyLoad=function(z){l0(z);if(z&&z.ap)Object.assign(AP,z.ap)}}
const cvx=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t};
const wmt=(map,op,base)=>{const m=wmat(base||[1,1,1],Object.assign({vertexColors:false},op||{}),map);const t=TOD[todI].tint,b=base||[1,1,1];m.color.setRGB(b[0]*t[0],b[1]*t[1],b[2]*t[2]);return m};
/* ---------------------------------------------------------------- map registry (far-off regions) */
const MAPS={};
function registerMap(def){def.built=0;def.active=0;def.chunks=[];def.group=new THREE.Group();scene.add(def.group);MAPS[def.id]=def;return def}
const flat=(m,x,z)=>{const u=x-m.ox,v=z-m.oz;return u>m.reg[0]&&u<m.reg[1]&&v>m.reg[2]&&v<m.reg[3]};
{const h0=hAt;hAt=function(x,z){if(x>-1000&&x<1000&&z>-1000&&z<1000)return h0(x,z);for(const k in MAPS){const m=MAPS[k];if(m.built&&flat(m,x,z))return G0}return h0(x,z)}}
const mapAt=(x,z)=>{for(const k in MAPS){const m=MAPS[k];if(flat(m,x,z))return m}return null};
function chunk(m,obj){obj.traverse(o=>{if(o.isMesh||o.isPoints||o.isLine){o.frustumCulled=false;o.userData.warm=3;o.visible=true;m.chunks.push(o)}});m.group.add(obj)}
function setActive(m,on){m.active=on;for(const o of m.chunks)if(o.userData.warm<=0){o.visible=!!on;o.frustumCulled=true}}
function warmTick(){for(const k in MAPS){const m=MAPS[k];if(!m.chunks.length)continue;for(const o of m.chunks)if(o.userData.warm>0){o.userData.warm--;if(o.userData.warm<=0){o.frustumCulled=true;o.visible=!!m.active}}}}
/* sliced loader: m.gen is a generator that yields between pieces of work */
function pump(m,ms){if(m.built)return true;if(!m.it)m.it=m.gen(m);const t0=performance.now();for(;;){const r=m.it.next();if(r.done){m.built=1;m.it=null;return true}if(performance.now()-t0>ms)return false}}
/* ---------------------------------------------------------------- lights for the (Phong) aircraft */
const AL=new THREE.Group(),dl=new THREE.DirectionalLight(0xfff0d8,.78),hl=new THREE.HemisphereLight(0xcfe4ff,0x8a94a0,.62);AL.add(dl,dl.target,hl);AL.visible=false;scene.add(AL);
function lightTOD(){const T=TOD[todI];dl.color.setRGB(T.sun[0],T.sun[1],T.sun[2]);dl.intensity=todI===2?.3:todI===1?.7:.8;hl.color.setRGB(.8*T.tint[0]+.2,.88*T.tint[1]+.12,T.tint[2]*.95+.05);hl.intensity=todI===2?.4:.5;const d=new THREE.Vector3(...T.sd).normalize();dl.position.copy(d).multiplyScalar(300);dl.target.position.set(0,0,0)}
/* ---------------------------------------------------------------- the aircraft */
const LIV={body:'#f4f6f8',belly:'#9aa4b0',stripe:'#1d56b8',tail:'#c8202c',name:'COZY AIR'};
function mkPlane(){const L=36,R=1.95,g=new THREE.Group(),FU={};
 const pm=(c,o)=>new THREE.MeshPhongMaterial(Object.assign({color:c,shininess:50,specular:0x444444},o||{}));
 /* fuselage + livery */
 const tx=cvx(1024,1024,(c,W,H)=>{c.fillStyle=LIV.body;c.fillRect(0,0,W,H);c.fillStyle=LIV.belly;c.fillRect(0,0,W*.14,H);c.fillRect(W*.86,0,W*.14,H);
  c.fillStyle=LIV.stripe;c.fillRect(W*.255,H*.12,W*.012,H*.82);c.fillRect(W*.733,H*.12,W*.012,H*.82);c.fillRect(0,H*.9,W,H*.1);
  c.fillStyle=LIV.tail;c.fillRect(0,H*.9,W,H*.012);
  c.fillStyle=LIV.stripe;c.fillRect(0,0,W,H*.09);
  /* windows */
  c.fillStyle='#16202c';for(let k=0;k<30;k++){const v=.205+k*.0235,y=(1-v)*H;for(const x of[W*.31,W*.69])c.fillRect(x-16,y-7,32,14)}
  c.fillStyle='#2a3a4a';for(const x of[W*.31,W*.69]){c.fillRect(x-16,(1-.755)*H-20,32,40)}
  /* cockpit */
  c.fillStyle='#10202e';c.beginPath();c.moveTo(W*.44,H*.095);c.lineTo(W*.56,H*.095);c.lineTo(W*.575,H*.06);c.lineTo(W*.425,H*.06);c.fill();c.fillRect(W*.3,H*.05,W*.05,H*.03);c.fillRect(W*.65,H*.05,W*.05,H*.03);
  /* name on both sides */
  c.save();c.translate(W*.19,H*.5);c.rotate(Math.PI/2);c.fillStyle=LIV.stripe;c.font='bold 70px Georgia,serif';c.textAlign='center';c.textBaseline='middle';c.fillText(LIV.name,0,0);c.restore();
  c.save();c.translate(W*.81,H*.5);c.rotate(-Math.PI/2);c.fillStyle=LIV.stripe;c.font='bold 70px Georgia,serif';c.textAlign='center';c.textBaseline='middle';c.fillText(LIV.name,0,0);c.restore();
  c.fillStyle='#c0c8d0';for(const x of[W*.29,W*.71]){c.fillRect(x-1,H*.245,2,H*.0);}
  /* door outline (front left) */
  c.strokeStyle='#7a8490';c.lineWidth=2;c.strokeRect(W*.31-17,(1-.757)*H-26,34,52);c.strokeRect(W*.69-17,(1-.757)*H-26,34,52)});
 tx.anisotropy=8;
 const prof=[];const N=70;for(let i=0;i<=N;i++){const t=i/N;let r;if(t<.16){const s=t/.16;r=R*(.14+.86*Math.pow(Math.sin(s*Math.PI/2),.9))}else if(t>.82){const s=(t-.82)/.18;r=R*Math.sqrt(Math.max(.02,1-s*s*.985))}else r=R;prof.push(new THREE.Vector2(r,(t-.5)*L))}
 prof.push(new THREE.Vector2(.01,L/2+.25));
 const fg=new THREE.LatheGeometry(prof,48);fg.rotateX(Math.PI/2);const fus=new THREE.Mesh(fg,pm(0xffffff,{map:tx,shininess:70}));g.add(fus);
 /* wings, stabilisers */
 const wingGeo=(span,zl0,zl1,zt0,zt1,th)=>{const s=new THREE.Shape();s.moveTo(0,-zl0);s.lineTo(span,-zl1);s.lineTo(span,-zt1);s.lineTo(0,-zt0);s.closePath();const ge=new THREE.ExtrudeGeometry(s,{depth:th,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:1});ge.rotateX(-Math.PI/2);return ge};
 const wmat_=pm(0xd2d8e0,{shininess:30}),wg=wingGeo(17.5,2.6,-6.2,-6.4,-9.8,.34);
 for(const sd of[1,-1]){const w=new THREE.Mesh(wg,wmat_);w.position.set(sd*1.2,-.85,0);w.rotation.z=sd*.055;w.scale.x=sd;g.add(w);
  const tp=new THREE.Mesh(new THREE.BoxGeometry(.18,1.6,1.8),pm(LIV.stripe));tp.position.set(sd*18.5,.3,-9.2);tp.rotation.z=sd*-.25;tp.rotation.x=.1;g.add(tp);
  const st=new THREE.Mesh(wingGeo(6.4,-13.4,-17.4,-18.4,-19.2,.22),wmat_);st.position.set(sd*.6,.75,0);st.rotation.z=sd*.04;st.scale.x=sd;g.add(st);
  /* engine */
  const ex=sd*6.4,eng=new THREE.Group();eng.position.set(ex,-1.75,1.1);
  const nac=new THREE.Mesh(new THREE.CylinderGeometry(1.12,1.0,4.6,24,1,true).rotateX(Math.PI/2),pm(0xdfe4ea,{side:THREE.DoubleSide}));eng.add(nac);
  const lip=new THREE.Mesh(new THREE.TorusGeometry(1.1,.12,8,24),pm(0xc4cad2));lip.position.z=2.3;eng.add(lip);
  const fan=new THREE.Mesh(new THREE.CircleGeometry(1.0,20),new THREE.MeshPhongMaterial({color:0x2a2e34,shininess:80,side:THREE.DoubleSide}));fan.position.z=1.7;eng.add(fan);
  const hub=new THREE.Mesh(new THREE.ConeGeometry(.28,.8,12).rotateX(Math.PI/2),pm(0x888e96));hub.position.z=2.0;eng.add(hub);
  const nz=new THREE.Mesh(new THREE.ConeGeometry(.72,1.6,16).rotateX(-Math.PI/2),pm(0x6a7078));nz.position.z=-3.3;eng.add(nz);
  g.add(eng);const py=new THREE.Mesh(new THREE.BoxGeometry(.3,1.1,3.2),wmat_);py.position.set(ex,-1.0,.6);g.add(py)}
 /* tail fin */
 {const s=new THREE.Shape();s.moveTo(-11.8,1.2);s.lineTo(-16.6,8.9);s.lineTo(-18.9,8.9);s.lineTo(-18.6,1.2);s.closePath();const ge=new THREE.ExtrudeGeometry(s,{depth:.3,bevelEnabled:false});ge.translate(0,0,-.15);ge.rotateY(-Math.PI/2);const f=new THREE.Mesh(ge,pm(0xc8202c,{shininess:60}));g.add(f);
  const b=new THREE.Mesh(new THREE.BoxGeometry(.34,1.2,2.8),pm(0xffffff));b.position.set(0,5,-16);g.add(b)}
 /* landing gear */
 const gear=new THREE.Group();const dk=pm(0x23262b,{shininess:20}),st=pm(0xb9bec6);
 const strut=(x,z,h,n,w)=>{const s=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,h,8),st);s.position.set(x,-1.2-h/2+.05,z);gear.add(s);for(let k=0;k<n;k++){const o=(k-(n-1)/2)*(.62),wh=new THREE.Mesh(new THREE.CylinderGeometry(.46,.46,.36,16).rotateZ(Math.PI/2),dk);wh.position.set(x+(n>1?(k?1:-1)*.26:0),-PH+.46,z+(n>2?(k>1?-.55:.55):0));gear.add(wh)}};
 strut(0,12.6,1.3,2);strut(3.2,-1.4,1.4,4);strut(-3.2,-1.4,1.4,4);g.add(gear);FU.gear=gear;
 /* lights */
 const glow=(c,x,y,z,s)=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:c,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true}));sp.scale.setScalar(s);sp.position.set(x,y,z);g.add(sp);return sp};
 FU.nav=[glow(0xff2020,18.4,-.1,-9.3,1.3),glow(0x20ff40,-18.4,-.1,-9.3,1.3)];FU.strobe=[glow(0xffffff,18.4,-.1,-9.9,2),glow(0xffffff,-18.4,-.1,-9.9,2),glow(0xffffff,0,1.2,-19.3,2)];FU.beacon=[glow(0xff3030,0,R+.15,3,2.6),glow(0xff3030,0,-R-.1,3,2.6)];
 FU.land=glow(0xfff4d0,0,-1.5,13.4,0);
 /* door */
 const door=new THREE.Group();door.position.set(R+.02,.25,11.5);const slab=new THREE.Mesh(new THREE.BoxGeometry(.07,1.9,1.0),pm(0xf0f2f4));slab.position.z=-.5;door.add(slab);g.add(door);FU.door=door;
 const rec=new THREE.Mesh(new THREE.BoxGeometry(.05,1.9,1.0),new THREE.MeshBasicMaterial({color:0x14161c}));rec.position.set(R+.015,.25,11);g.add(rec);FU.rec=rec;
 g.userData=FU;return g}
let _glow=null;const glowTex=()=>_glow||(_glow=cvx(64,64,(c,w,h)=>{const q=c.createRadialGradient(32,32,0,32,32,32);q.addColorStop(0,'rgba(255,255,255,1)');q.addColorStop(.25,'rgba(255,255,255,.55)');q.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=q;c.fillRect(0,0,w,h)}));
function mkStairs(){const g=new THREE.Group(),m1=new THREE.MeshPhongMaterial({color:0x3a3e46}),m2=new THREE.MeshPhongMaterial({color:0xf0c020}),m3=new THREE.MeshPhongMaterial({color:0xe8eaee}),m4=new THREE.MeshPhongMaterial({color:0x22252b});
 const bx=(w,h,d,x,y,z,m)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);q.position.set(x,y,z);g.add(q);return q};
 const top=2.15,run=4.6,n=10;for(let i=0;i<n;i++){bx(.46,.07,1.3,-run+(i+.5)*run/n,(i+1)*top/n,0,m1)}
 const ang=Math.atan2(top,run),len=Math.hypot(run,top);for(const s of[-1,1]){const st=bx(len,.14,.08,-run/2,top/2-.12,s*.68,m2);st.rotation.z=ang;const rl=bx(len,.05,.05,-run/2,top/2+.95,s*.72,m2);rl.rotation.z=ang;for(let k=0;k<=5;k++){bx(.05,.95,.05,-run+k*run/5,(k/5)*top+.5,s*.72,m2)}}
 bx(1.3,.1,1.5,.65,top,0,m1);bx(1.3,.05,.05,.65,top+.95,.72,m2);bx(1.3,.05,.05,.65,top+.95,-.72,m2);bx(.05,.95,.05,1.3,top+.5,.72,m2);bx(.05,.95,.05,1.3,top+.5,-.72,m2);
 bx(1.4,.9,1.6,.65,top-.55,0,m3);bx(1.42,.12,1.62,.65,top-.9,0,m2);
 for(const[x,z]of[[.2,.7],[1.1,.7],[.2,-.7],[1.1,-.7]]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.2,12).rotateX(Math.PI/2),m4);w.position.set(x,.36,z*1.12);g.add(w)}
 bx(.8,.7,1.0,.65,.55,0,m3);return g}
/* ---------------------------------------------------------------- shared airfield layout (every airfield uses the same local frame) */
const LAY={stand:[-86,-200],door:[-87.95,-211],term:[-137,-206],lineup:[0,372],tdz:300,stairs:[-89.2,-211]};
const pathPts=[[0,330],[0,-70],[-5,-98],[-22,-128],[-52,-158],[-78,-182],[-86,-196],[-86,-260]];
const crp=(a,b,c,d,t)=>{const t2=t*t,t3=t2*t;return[0,1].map(k=>.5*(2*b[k]+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3))};
const PATH=(()=>{const P=pathPts,out=[];for(let i=0;i<P.length-1;i++)for(let k=0;k<30;k++)out.push(crp(P[Math.max(0,i-1)],P[i],P[i+1],P[Math.min(P.length-1,i+2)],k/30));out.push(P[P.length-1]);const cum=[0];for(let i=1;i<out.length;i++)cum.push(cum[i-1]+Math.hypot(out[i][0]-out[i-1][0],out[i][1]-out[i-1][1]));return{p:out,c:cum}})();
const pathAt=s=>{const{p,c}=PATH;s=Math.max(0,Math.min(c[c.length-1]-.01,s));let lo=0,hi=c.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(c[m]<=s)lo=m;else hi=m}const f=(s-c[lo])/(c[hi]-c[lo]||1),a=p[lo],b=p[hi];return{u:a[0]+(b[0]-a[0])*f,v:a[1]+(b[1]-a[1])*f,hdg:Math.atan2(b[0]-a[0],b[1]-a[1])}};
const sStop=(()=>{for(let i=0;i<PATH.p.length;i++)if(PATH.p[i][1]<=LAY.stand[1]&&PATH.p[i][0]<-85)return PATH.c[i];return PATH.c[PATH.c.length-1]})();
/* ---------------------------------------------------------------- sky scene objects */
const SKYO={x:6000,y:1500,z:6000};
let cloudG=null,skyBuilt=0,sunGlow=null;
function cloudTex(k){return cvx(128,128,(c,w,h)=>{c.clearRect(0,0,w,h);let s=k*977+13;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let i=0;i<9;i++){const x=w*(.25+.5*r()),y=h*(.35+.3*r()),rad=w*(.16+.14*r()),q=c.createRadialGradient(x,y,0,x,y,rad);q.addColorStop(0,'rgba(255,255,255,.95)');q.addColorStop(.6,'rgba(255,255,255,.5)');q.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=q;c.fillRect(0,0,w,h)}
  const sh=c.createLinearGradient(0,h*.4,0,h*.95);sh.addColorStop(0,'rgba(120,140,175,0)');sh.addColorStop(1,'rgba(120,140,175,.38)');c.globalCompositeOperation='source-atop';c.fillStyle=sh;c.fillRect(0,0,w,h)})}
function buildSky(){if(skyBuilt)return;skyBuilt=1;cloudG=new THREE.Group();cloudG.visible=false;scene.add(cloudG);
 const mats=[];for(let k=0;k<3;k++){const t=cloudTex(k);for(const sh of[1,.92,.82])mats.push(new THREE.SpriteMaterial({map:t,color:new THREE.Color(sh,sh,Math.min(1,sh+.04)),transparent:true,depthWrite:false,fog:false,opacity:.92}))}
 let s=4242;const rr=()=>(s=(s*16807)%2147483647)/2147483647;
 const spr=(x,y,z,sz,lo)=>{const sp=new THREE.Sprite(mats[(rr()*mats.length)|0]);sp.position.set(SKYO.x+x,SKYO.y+y,SKYO.z+z);sp.scale.set(sz,sz*(.55+.2*rr()),1);sp.material=mats[Math.min(mats.length-1,((lo?6:0)+(rr()*3|0)))];cloudG.add(sp);return sp};
 /* cloud sea far below */
 for(let i=0;i<340;i++)spr((rr()-.5)*2400,-170-rr()*50,-rr()*3200+400,260+rr()*320,1);
 /* cumulus towers either side of the flight corridor */
 for(let c=0;c<34;c++){const cx=(rr()<.5?-1:1)*(70+rr()*340),cz=400-rr()*2900,cy=-60+rr()*90,n=14+(rr()*14|0),sc=60+rr()*130;for(let k=0;k<n;k++){const a=rr()*TAU,d=rr()*sc*.7;spr(cx+Math.cos(a)*d,cy+(rr()-.25)*sc*.8,cz+Math.sin(a)*d,sc*(.5+rr()*.7),k<n*.35)}}
 /* wisps right around the flight line (these are the ones you fly through) */
 for(let i=0;i<70;i++){const sp=spr((rr()-.5)*70,(rr()-.5)*40,200-rr()*2400,28+rr()*60,0);sp.material=sp.material.clone();sp.material.opacity=.38+rr()*.25}
 /* the big cloud bank the camera punches through in shot B2 */
 for(let i=0;i<46;i++){const a=rr()*TAU,d=rr()*55;spr(Math.cos(a)*d*.9,(rr()-.5)*34+Math.sin(a)*d*.3,-1040+(rr()-.5)*90,70+rr()*60,0)}
 sunGlow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex(),color:0xffe9b0,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,transparent:true,opacity:.9}));sunGlow.scale.setScalar(700);cloudG.add(sunGlow)}
/* ---------------------------------------------------------------- cinematic engine */
const CIN={on:0,t:0,scene:'',m0:null,m1:null,plane:null,stairs:null,sv:null,saved:[],kp:new Set(),dur:77,shake:0,t0:0};
const TA=34,TB=48,TC=79,BOUND=[0,TA,TB,TC];
const ui={};
function mkUI(){if(ui.root)return;const css=document.createElement('style');css.textContent='body.cin #hud,body.cin #top,body.cin #topbtns,body.cin #mm,body.cin #bUse,body.cin #pad,body.cin #pedals,body.cin #hand,body.cin #brk,body.cin #gas,body.cin #speed,body.cin #arrow,body.cin #job,body.cin #gems,body.cin #toast,body.cin #sta{display:none!important}';document.head.appendChild(css);
 const r=document.createElement('div');r.style.cssText='position:fixed;inset:0;z-index:55;pointer-events:none;display:none';document.body.appendChild(r);ui.root=r;
 const bar=(top)=>{const b=document.createElement('div');b.style.cssText='position:absolute;left:0;right:0;'+(top?'top:0':'bottom:0')+';height:0;background:#000;transition:height 1.1s cubic-bezier(.2,.7,.2,1)';r.appendChild(b);return b};ui.bt=bar(1);ui.bb=bar(0);
 ui.fl=document.createElement('div');ui.fl.style.cssText='position:absolute;inset:0;background:#fff;opacity:0;transition:opacity .0s';r.appendChild(ui.fl);
 ui.cap=document.createElement('div');ui.cap.style.cssText='position:absolute;left:0;right:0;bottom:15%;text-align:center;color:#fff;font:300 20px/1.5 Georgia,serif;letter-spacing:.35em;text-shadow:0 2px 12px #000;opacity:0;transition:opacity .9s;white-space:pre';r.appendChild(ui.cap);
 ui.skip=document.createElement('button');ui.skip.textContent='SKIP  ▶';ui.skip.style.cssText='position:absolute;right:16px;bottom:calc(11% + 12px);pointer-events:auto;font:bold 12px monospace;letter-spacing:.2em;color:#fff;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.6);padding:8px 14px;border-radius:4px;opacity:.75;touch-action:manipulation';r.appendChild(ui.skip);ui.skip.onclick=e=>{e.stopPropagation();skip()};
 ui.black=document.createElement('div');ui.black.style.cssText='position:absolute;inset:0;background:#000;opacity:0;transition:opacity .5s';r.appendChild(ui.black);
 ui.load=document.createElement('div');ui.load.style.cssText='position:absolute;inset:0;background:#06101c;display:none;align-items:center;justify-content:center;flex-direction:column;color:#cfe6ff;font:13px monospace;letter-spacing:.3em';ui.load.innerHTML='<div style="font-size:22px;letter-spacing:.5em;margin-bottom:10px">COZY AIRWAYS</div><div id="apLd">CHECKING IN ...</div>';r.appendChild(ui.load)}
let capT=0;const caption=(txt,ms)=>{ui.cap.textContent=txt;ui.cap.style.opacity=1;clearTimeout(capT);capT=setTimeout(()=>ui.cap.style.opacity=0,ms||3200)};
const flash=(ms)=>{ui.fl.style.transition='none';ui.fl.style.opacity=.95;void ui.fl.offsetWidth;ui.fl.style.transition='opacity '+(ms||450)+'ms ease-out';ui.fl.style.opacity=0};
/* helpers: local -> world for a map */
const Wc=(m,u,v)=>[m.ox+u,m.oz+v];
function setCam(x,y,z,tx,ty,tz,fov,roll){cam.position.set(x,y,z);cam.up.set(0,1,0);cam.lookAt(tx,ty,tz);if(roll)cam.rotateZ(roll);if(Math.abs(cam.fov-fov)>.01){cam.fov=fov;cam.updateProjectionMatrix()}}
const cm=(m,u,y,v,tu,ty,tv,fov,roll)=>{const a=Wc(m,u,v),b=Wc(m,tu,tv);setCam(a[0],Y+y,a[1],b[0],Y+ty,b[1],fov,roll)};
const ease=t=>t<0?0:t>1?1:t*t*(3-2*t),lerpN=(a,b,t)=>a+(b-a)*t,clampN=(x,a,b)=>Math.max(a,Math.min(b,x));
function planeSet(m,u,v,h,hdg,pitchUp,roll){const p=CIN.plane,a=Wc(m,u,v);p.position.set(a[0],Y+PH+h,a[1]);p.rotation.set(-(pitchUp||0),hdg,roll||0,'YXZ')}
function planeSetSky(x,y,z,hdg,pitchUp,roll){const p=CIN.plane;p.position.set(SKYO.x+x,SKYO.y+y,SKYO.z+z);p.rotation.set(-(pitchUp||0),hdg,roll||0,'YXZ')}
const doorOpen=a=>{CIN.plane.userData.door.rotation.y=-1.55*a};
function gearSet(down){const g=CIN.plane.userData.gear;g.visible=down>.02;g.scale.setScalar(Math.max(.01,down));g.position.y=(1-down)*1.1}
function blink(t){const U=CIN.plane.userData;const b=(t*1.6)%1<.14,s=(t*2.1)%1<.07||((t*2.1)%1>.16&&(t*2.1)%1<.22);for(const q of U.beacon)q.visible=b;for(const q of U.strobe)q.visible=s}
/* --- the man: his normal on-foot model walks the scripted route */
function manAt(x,z,y,psi,spd,dt){P.x=x;P.z=z;P.y=y;P.psi=psi;P.speed=spd;P.dir=1;P.phase+=spd*dt*2.3;man.visible=true;man.position.set(x,y,z);updateMan()}
/* ---------------------------------------------------------------- scene A: departure */
const TO={t0:16,a:8,vr:78,tL:27};
function toPos(t){/* takeoff roll position: returns z (local), height, pitch */const dt=t-TO.t0;if(dt<=0)return{z:LAY.lineup[1],h:0,pit:0,v:0};
 const tr=TO.vr/TO.a;let s,v,h=0,pit=0;if(dt<=tr){s=.5*TO.a*dt*dt;v=TO.a*dt}else{const q=dt-tr;s=.5*TO.a*tr*tr+TO.vr*q+q*q;v=TO.vr+2*q;pit=Math.min(.22,q*.2);const ql=q-1.25;if(ql>0){const c=ql<3?.5*4.5*ql*ql:.5*4.5*9+13.5*(ql-3);h=c;pit=.25}}
 return{z:LAY.lineup[1]-s,h,pit,v}}
function shotsA(m,t){const stairs=CIN.stairs,st=LAY.stand;
 let door=1;if(t>=9.8)door=1-ease((t-10.2)/1.2);
 let sx=0;if(t>11.4)sx=-ease((t-11.4)/2.6)*9;
 stairs.position.set(Wc(m,LAY.stairs[0]+sx,0)[0],Y,Wc(m,0,LAY.stairs[1])[1]);
 /* the man walks from the terminal canopy to the stairs, climbs and steps into the door */
 const spd=4.0,x=-128+spd*t,foot=-93.8,topx=-89.2;let my=0;if(x>foot)my=clampN((x-foot)/(topx-foot),0,1)*2.15;
 if(x<-88.4){const a=Wc(m,x,LAY.door[1]);manAt(a[0],G0+my,a[1],Math.PI/2,x>foot?2.6:spd,.016)}else hideMan();
 /* aircraft */
 let pu=st[0],pv=st[1],ph=0,pit=0,gear=1;const rp=toPos(t);
 if(t>=14.5){pu=0;pv=rp.z;ph=rp.h;pit=rp.pit;gear=ph>1.5?1-ease((t-(TO.tL+1.6))/1.4):1;if(t>TO.tL+3.2)gear=0}
 planeSet(m,pu,pv,ph,Math.PI,pit,0);doorOpen(t<14.5?door:0);gearSet(gear);blink(t);CIN.shake=0;
 if(t<6.5){const k=t/6.5;cm(m,lerpN(-28,-52,k),lerpN(5.2,3.6,k),lerpN(-166,-180,k),-98,2.6,-206,lerpN(42,36,k))}
 else if(t<11){const a=Wc(m,Math.min(x,-88.4),LAY.door[1]),k=(t-6.5)/4.5;setCam(a[0]-6.2+k*1.2,G0+my+2.3+k*.6,a[1]+3.6-k*1.2,a[0]+2.2,G0+my+1.3,a[1],lerpN(46,40,k))}
 else if(t<14.5){const k=(t-11)/3.5;cm(m,lerpN(-72,-78,k),lerpN(1.9,2.3,k),lerpN(-246,-236,k),-86,3.4,-217,lerpN(38,30,k))}
 else if(t<21.5){const k=(t-14.5)/7;CIN.shake=t>16?Math.min(1,(t-16)/3)*.05:0;cm(m,lerpN(9,10,k),lerpN(2.2,2.5,k),412,0,PH+1.2,rp.z,lerpN(36,30,k))}
 else if(t<28.5){const a=Wc(m,30,-28),pw=Wc(m,0,rp.z);setCam(a[0],Y+1.5+(t>26?(t-26)*.1:0),a[1],pw[0],Y+PH+rp.h+.4,pw[1],lerpN(34,26,ease((t-21.5)/6)));CIN.shake=t>24.5&&t<27.5?.07:0}
 else{const k=(t-28.5)/5.5,pw=Wc(m,0,rp.z);setCam(pw[0]+12+k*10,Y+PH+rp.h+lerpN(6,12,k),pw[1]+lerpN(30,46,k),pw[0],Y+PH+rp.h-1,pw[1],lerpN(46,52,k))}}
function hideMan(){if(man.visible)man.visible=false}
/* ---------------------------------------------------------------- scene B: the sky */
const SKT={dur:TB-TA,v:125};
function planeSky(tt){const x=14*Math.sin(tt*.42),y=4*Math.sin(tt*.55)-Math.max(0,tt-9)*6,z=-SKT.v*tt,dx=14*.42*Math.cos(tt*.42);return{x,y,z,hdg:Math.atan2(dx,-SKT.v)+Math.PI,roll:-.16*Math.sin(tt*.42-.2),pit:tt>9?-.05:.03*Math.sin(tt*.55)}}
function shotsB(t){const tt=t-TA,p=planeSky(tt);planeSetSky(p.x,p.y,p.z,p.hdg,p.pit,p.roll);gearSet(0);blink(t);doorOpen(0);
 const O=SKYO;let cx,cy,cz,lx,ly,lz,fov,rl=0;
 if(tt<6.5){const k=tt/6.5,az=lerpN(1.35,2.3,k);cx=p.x+Math.sin(az)*24;cz=p.z+Math.cos(az)*24-lerpN(2,14,k);cy=p.y+lerpN(1.0,4.0,k);lx=p.x;ly=p.y+.4;lz=p.z-1;fov=lerpN(34,30,k)}
 else if(tt<11.5){const k=(tt-6.5)/5;cx=p.x*.6+lerpN(-4,6,k);cy=p.y+lerpN(5,3.2,k);cz=p.z+lerpN(32,26,k);lx=p.x;ly=p.y+1;lz=p.z-14;fov=50;rl=.03*Math.sin(tt)}
 else{const k=(tt-11.5)/(SKT.dur-11.5),p0=planeSky(11.5);cx=p0.x+10;cy=p0.y-2;cz=-SKT.v*11.5-300;lx=p.x;ly=p.y;lz=p.z;fov=lerpN(26,42,ease(k))}
 setCam(O.x+cx,O.y+cy,O.z+cz,O.x+lx,O.y+ly,O.z+lz,fov,rl);CIN.shake=.012}
/* ---------------------------------------------------------------- scene C: arrival */
const LD={td:55.6,v0:70,aDec:10.5};
function ldPos(t){const td=LD.td;if(t<td){const s=LD.v0*(td-t),fl=Math.max(0,1-(td-t)/1.4);return{u:0,z:LAY.tdz+s,h:s*.0524*(1-fl*.9),pit:.02+fl*.07,v:LD.v0}}
 const q=t-td,tq=(LD.v0-20)/LD.aDec,s=q<tq?LD.v0*q-.5*LD.aDec*q*q:(LD.v0*LD.v0-400)/(2*LD.aDec)+20*(q-tq);return{u:0,z:LAY.tdz-s,h:0,pit:Math.max(0,.07-q*.1),v:Math.max(20,LD.v0-LD.aDec*q)}}
const ST4={t0:61.4,v0:8,D:16};const ST4T=2*ST4.D/ST4.v0;
function manC(t){const tm0=ST4.t0+ST4T+2.6;if(t<tm0)return null;const q=t-tm0,dS=2.0;let x,y;if(q<dS){x=-88.6-q/dS*5.2;y=2.15*(1-q/dS)}else{x=-93.8-(q-dS)*5.5;y=0}return{x,y,sp:q<dS?2.6:5.5}}
function shotsC(m,t){const stairs=CIN.stairs;let u,v,h=0,hdg=Math.PI,pit=0,door=0,sx=-9;CIN.shake=0;
 if(t<ST4.t0){const r=ldPos(t);u=r.u;v=r.z;h=r.h;pit=r.pit}
 else{const q=t-ST4.t0,a=ST4.v0/ST4T,qq=Math.min(q,ST4T),d=ST4.v0*qq-.5*a*qq*qq,r=pathAt(sStop-ST4.D+d);u=r.u;v=r.v;hdg=r.hdg;if(q>=ST4T){u=LAY.stand[0];v=LAY.stand[1];hdg=Math.PI}
  const ts=ST4.t0+ST4T;if(t>ts+.2)sx=-9*(1-ease((t-ts-.2)/1.6));door=ease((t-ts-1.6)/1.0)}
 planeSet(m,u,v,h,hdg,pit,0);doorOpen(door);gearSet(1);blink(t);CIN.plane.userData.land.scale.setScalar(t<LD.td?3.5:0);
 stairs.position.set(Wc(m,LAY.stairs[0]+sx,0)[0],Y,Wc(m,0,LAY.stairs[1])[1]);stairs.visible=t>ST4.t0+ST4T-1.5;
 const mn=manC(t);if(mn){const xx=Math.max(mn.x,LAY.term[0]),a=Wc(m,xx,LAY.door[1]);if(xx<=LAY.term[0]+.3)hideMan();else manAt(a[0],G0+mn.y,a[1],-Math.PI/2,mn.sp,.016)}else hideMan();
 const pw=Wc(m,u,v);
 if(t<52.5){const k=(t-TB)/(52.5-TB),a=Wc(m,150,640),sk=Wc(m,-200,640);setCam(a[0],Y+6,a[1],lerpN(pw[0],sk[0],.3),Y+lerpN(pw[2]===undefined?20:20,12,k)+h*.5,lerpN(pw[1],sk[1],.3),lerpN(36,32,k))}
 else if(t<55.4){const k=(t-52.5)/2.9;setCam(pw[0]+lerpN(9,14,k),Y+h+lerpN(5.2,3.6,k)+PH,pw[1]+lerpN(36,26,k),pw[0],Y+h+PH-.2,pw[1]-6,lerpN(55,48,k));CIN.shake=.015}
 else if(t<ST4.t0){const a=Wc(m,30,LAY.tdz-4);setCam(a[0],Y+1.4,a[1],pw[0],Y+PH+h+.3,pw[1],lerpN(30,22,ease((t-55.4)/6)));CIN.shake=t>LD.td-.1&&t<LD.td+1.6?.06:0}
 else if(t<69.4){const k=(t-ST4.t0)/8;cm(m,lerpN(-134,-122,k),lerpN(3.4,3.8,k),lerpN(-128,-190,k),lerpN(-60,LAY.stand[0],k),PH+.5,lerpN(-170,-206,k),lerpN(40,34,k))}
 else{const mm=manC(t)||{x:-94},xx=Math.max(mm.x,LAY.term[0]),a=Wc(m,xx,LAY.door[1]);setCam(a[0]+6.5,G0+1.9,a[1]+3.4,a[0]-4,G0+1.3,a[1],40)}
 if(t>LD.td&&t<LD.td+1.4&&Math.random()<.9){const w=Wc(m,0,v);for(const s of[-3.2,3.2])puff(w[0]+s,G0+.3,w[1]+(Math.random()-.5)*2,0,25,[.92,.92,.95])}}
/* ---------------------------------------------------------------- engine core */
function sceneOf(t){return t<TA?'A':t<TB?'B':'C'}
function enter(sc){if(CIN.scene===sc)return;const prev=CIN.scene;CIN.scene=sc;
 const m0=CIN.m0,m1=CIN.m1;
 if(prev==='B'){for(const o of CIN.saved)o.visible=true;CIN.saved=[];cloudG.visible=false;cam.far=1700}
 if(sc==='A'){setActive(m0,1);setActive(m1,0);if(cloudG)cloudG.visible=false;fogFor(1);CIN.plane.visible=true;CIN.stairs.visible=true;AL.visible=true;lightTOD()}
 if(sc==='B'){setActive(m0,0);hideMan();CIN.stairs.visible=false;AL.visible=true;buildSky();cloudG.visible=true;CIN.saved=[];const keep=new Set([cloudG,skyG,AL,CIN.plane]);for(const k in MAPS)keep.add(MAPS[k].group);for(const c of scene.children){if(!keep.has(c)&&c.visible&&!c.isLight){c.visible=false;CIN.saved.push(c)}}cam.far=7000;fogFor(2);flash(600);skyDome(1)}
 if(sc==='C'){setActive(m1,1);setActive(m0,0);skyDome(0);fogFor(1);CIN.plane.visible=true;flash(700)}}
function skyDome(on){/* sun glow follows the sun direction; the game's own sky gradient dome follows the camera */if(sunGlow){const T=TOD[todI],d=new THREE.Vector3(...T.sd).normalize();sunGlow.visible=!!on;sunGlow.userData.d=d}}
function fogFor(k){const T=TOD[todI];scene.fog.near=k===2?3000:350;scene.fog.far=k===2?6500:1700}
function start(from,to){if(CIN.on)return false;mkUI();CIN.m0=MAPS[from];CIN.m1=MAPS[to];if(!CIN.m0||!CIN.m1)return false;
 if(!CIN.plane){CIN.plane=mkPlane();scene.add(CIN.plane);CIN.stairs=mkStairs();scene.add(CIN.stairs)}
 CIN.on=1;CIN.t=0;CIN.scene='';CIN.flight=[from,to];CIN.sv={x:P.x,z:P.z,psi:P.psi,gx:GS.x,gz:GS.z,onFoot:GS.onFoot,fov:cam.fov,far:cam.far,fn:scene.fog.near,ff:scene.fog.far,inside:GS.inside,mv:man.visible};
 document.body.classList.add('cin');ui.root.style.display='block';ui.black.style.opacity=1;ui.load.style.display='flex';GS.onFoot=1;
 /* load the departure airfield now (behind the "checking in" card), the destination during the flight */
 const ld=document.getElementById('apLd');const t0=performance.now();
 const step=()=>{const done=pump(CIN.m0,10);if(ld)ld.textContent='CHECKING IN ... '+Math.min(99,Math.round((performance.now()-t0)/22))+'%';if(!done){requestAnimationFrame(step);return}
  /* the first frames of A must already be on screen when the card lifts */
  ui.load.style.display='none';CIN.t=0;CIN.go=1;ui.bt.style.height='11%';ui.bb.style.height='11%';ui.skip.style.display=AP.trips>0?'block':'block';
  setTimeout(()=>{ui.black.style.transition='opacity .9s';ui.black.style.opacity=0;caption('COZY AIR  ·  FLIGHT CA101\n'+CIN.m0.city+'  →  '+CIN.m1.city,3800)},120)};
 requestAnimationFrame(step);return true}
function skip(){if(!CIN.on||!CIN.go)return;const nxt=BOUND.find(b=>b>CIN.t+.05);if(nxt==null||nxt>=TC){finish();return}flash(500);CIN.t=nxt}
function finish(){if(!CIN.on||CIN.ending)return;CIN.ending=1;ui.black.style.transition='opacity .6s';ui.black.style.opacity=1;setTimeout(()=>{
  for(const o of CIN.saved)o.visible=true;CIN.saved=[];if(cloudG)cloudG.visible=false;CIN.plane.visible=false;CIN.stairs.visible=false;AL.visible=false;hideMan();setActive(CIN.m0,0);
  const to=CIN.m1;CIN.on=0;CIN.ending=0;CIN.go=0;CIN.scene='';cam.far=CIN.sv.far;document.body.classList.remove('cin');ui.bt.style.height='0';ui.bb.style.height='0';
  AP.at=to.id;AP.trips++;if(to.arrive)to.arrive(CIN.sv);setActive(to,to.id!=='home'?1:0);applyTOD(todI);cam.fov=fovNow;cam.updateProjectionMatrix();
  ui.cap.style.opacity=0;setTimeout(()=>{ui.black.style.transition='opacity .9s';ui.black.style.opacity=0;setTimeout(()=>{ui.root.style.display='none'},950);if(to.welcome)toast(to.welcome)},150)},650)}
function seek(t){CIN.t=t;update(0)}
function update(dt){if(!CIN.on)return;if(CIN.go&&!CIN.ending){CIN.t+=dt}const t=CIN.t;const sc=sceneOf(t);enter(sc);
 /* progressive load of the destination, spread over the first two scenes */
 if(CIN.go&&!CIN.m1.built){pump(CIN.m1,3.2)}
 if(sc==='A')shotsA(CIN.m0,t);else if(sc==='B')shotsB(t);else shotsC(CIN.m1,t);
 if(CIN.shake>0){const s=CIN.shake,k=performance.now()*.05;cam.position.x+=Math.sin(k*1.3)*s;cam.position.y+=Math.cos(k*1.7)*s*.8;cam.position.z+=Math.sin(k*2.1)*s}
 if(sc==='B'&&sunGlow){const d=sunGlow.userData.d||new THREE.Vector3(0,.5,-1),p=cam.position;sunGlow.position.set(p.x+d.x*3000,p.y+d.y*3000,p.z+d.z*3000)}
 if(sc==='C'&&t>TB+.1&&!CIN.cap2){CIN.cap2=1;caption('WELCOME TO '+CIN.m1.city.toUpperCase(),3400)}
 if(sc!=='C')CIN.cap2=0;
 if(CIN.go&&t>=TC&&!CIN.ending)finish();
 warmTick();AL.position.set(cam.position.x,cam.position.y,cam.position.z)}
{const uc0=updateCam;updateCam=function(dt){if(CIN.on){update(dt);skyG.position.copy(cam.position);return}uc0(dt)}}
{const st0=step;step=function(dt){if(CIN.on)return;st0(dt)}}
{const c0=ctx;ctx=function(){if(CIN.on)return{label:'—',fn:null};return c0()}}
window.AIRPORT={AP,MAPS,CIN,registerMap,chunk,setActive,pump,mapAt,wmt,cvx,LAY,PATH,Wc,seek,start,skip,finish,mkPlane,mkStairs,flat,TA,TB,TC,warmTick,lightTOD,caption,flash};
})();
