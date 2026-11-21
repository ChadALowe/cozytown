/* ===== DRONES + RC CARS =====
   Two Marlowe shops (SKYLARK DRONES, TURBO TOYS RC) sell 5 drones and 5 RC cars.
   Four places to race them: COZY RC RACEWAY + COZY DRONE PARK in the village, and the
   MARLOWE PARK RC CIRCUIT + SKY TOWER DRONE DASH in Marlowe's west park.
   Walk onto a track's start pad to race 3 rivals: countdown lights, gates/laps, boost,
   chase or FPV camera, motor sound, sparks, results with prize money and best laps.
   Controls: arrows/WASD steer + throttle, SPACE boost, Q/E (or the on-screen ▲▼) climb/descend. */
(function(){
if(typeof THREE==='undefined'||typeof SHOPD==='undefined')return;
const TAU=Math.PI*2,clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t;

/* ------------------------------------------------------------------ catalogue */
const DRONES=[
 {k:'mini',n:'SKYLARK MINI',p:60,spd:13,acc:16,yaw:2.3,col:0xf2f2f4,acc2:0x2a8ad0,d:'TINY, GENTLE, PERFECT FIRST DRONE',sz:.8},
 {k:'cam',n:'AEROCAM 4K',p:150,spd:17,acc:19,yaw:2.5,col:0x3a3d42,acc2:0xe0a020,d:'STEADY CAMERA DRONE',sz:1.0},
 {k:'hawk',n:'NIGHTHAWK FPV',p:320,spd:23,acc:26,yaw:3.0,col:0x15161a,acc2:0x18d0ff,d:'PROPER FPV RACER',sz:.9},
 {k:'vortex',n:'VORTEX PRO RACER',p:650,spd:29,acc:32,yaw:3.4,col:0xd01818,acc2:0xffffff,d:'TOURNAMENT QUAD',sz:.9},
 {k:'bolt',n:'THUNDERBOLT X8',p:1250,spd:35,acc:38,yaw:3.8,col:0xf0c010,acc2:0x15161a,d:'EIGHT MOTORS. SILLY FAST.',sz:1.1,x8:1}];
const RCS=[
 {k:'buggy',n:'BUGGY BOLT',p:40,spd:11,acc:13,grip:6.5,col:0x2a8ad0,acc2:0xf0c010,d:'BOUNCY BEGINNER BUGGY',kind:'buggy'},
 {k:'monster',n:'MUDZILLA MONSTER',p:95,spd:12,acc:14,grip:5.0,col:0x28a040,acc2:0x111214,d:'HUGE WHEELS, FLIES OVER BUMPS',kind:'monster'},
 {k:'drift',n:'DRIFT KING',p:170,spd:15,acc:17,grip:3.6,col:0xe8e8ea,acc2:0xd01818,d:'SIDEWAYS EVERYWHERE',kind:'drift'},
 {k:'rally',n:'RALLY RACER',p:280,spd:17,acc:20,grip:6.0,col:0x1d4fb0,acc2:0xf0f0f0,d:'GRIPPY ALL-ROUNDER',kind:'rally'},
 {k:'f1',n:'F1 RAPIER',p:520,spd:22,acc:25,grip:8.0,col:0xd01818,acc2:0xf2f2f4,d:'GLUED TO THE TRACK',kind:'f1'}];
const RIVAL=[0xff7a10,0x9a30e0,0x10b0a0,0xe8e030,0xff3a8a];

/* ------------------------------------------------------------------ state (saved) */
const RS={own:{d:{},r:{}},sel:{d:null,r:null},best:{},wins:0};window.RCSTATE=RS;
if(typeof cozySave==='function'){const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.rcs=RS;return o};cozyLoad=function(z){l0(z);if(z&&z.rcs){Object.assign(RS,z.rcs);RS.own=RS.own||{d:{},r:{}};RS.own.d=RS.own.d||{};RS.own.r=RS.own.r||{};RS.sel=RS.sel||{};RS.best=RS.best||{}}}}

/* ------------------------------------------------------------------ tiny mesh builder (baked shading) */
const LD=(()=>{const v=[-.35,.78,.52],l=Math.hypot(...v);return v.map(x=>x/l)})();
function MB(){this.p=[];this.c=[]}
MB.prototype.tri=function(a,b,c,hex,ref){const u=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],v=[c[0]-a[0],c[1]-a[1],c[2]-a[2]];let n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const l=Math.hypot(...n);if(l<1e-12)return;n=n.map(x=>x/l);
 if(ref&&n[0]*ref[0]+n[1]*ref[1]+n[2]*ref[2]<0){const t=b;b=c;c=t;n=n.map(x=>-x)}const s=Math.min(1.1,Math.max(.35,.62+.34*Math.max(0,n[0]*LD[0]+n[1]*LD[1]+n[2]*LD[2])+.14*n[1])),k=[(hex>>16&255)/255*s,(hex>>8&255)/255*s,(hex&255)/255*s];
 this.p.push(...a,...b,...c);for(let i=0;i<3;i++)this.c.push(...k)};
/* box centred at c, size sz, rotated by ry (yaw) then rz (roll) */
MB.prototype.box=function(c,sz,hex,ry,rz){const[a,b,d]=sz.map(v=>v/2),cy=Math.cos(ry||0),sy=Math.sin(ry||0),cz=Math.cos(rz||0),sz_=Math.sin(rz||0);
 const R=(x,y,z)=>{const x1=x*cz-y*sz_,y1=x*sz_+y*cz;return[c[0]+x1*cy+z*sy,c[1]+y1,c[2]-x1*sy+z*cy]};
 const F=[[[1,0,0],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]]],[[-1,0,0],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1]]],[[0,1,0],[[-1,1,-1],[-1,1,1],[1,1,1],[1,1,-1]]],[[0,-1,0],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]]],[[0,0,1],[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]]],[[0,0,-1],[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]]]];
 for(const[n,q]of F){const v=q.map(k=>R(k[0]*a,k[1]*b,k[2]*d)),o=R(n[0],n[1],n[2]),r=[o[0]-c[0],o[1]-c[1],o[2]-c[2]];this.tri(v[0],v[1],v[2],hex,r);this.tri(v[0],v[2],v[3],hex,r)}};
/* cylinder along axis 'x' or 'y' */
MB.prototype.cyl=function(c,r,len,hex,ax,n){n=n||12;const P=(t,a)=>ax==='x'?[c[0]+t,c[1]+r*Math.sin(a),c[2]+r*Math.cos(a)]:[c[0]+r*Math.cos(a),c[1]+t,c[2]+r*Math.sin(a)],h=len/2;
 for(let i=0;i<n;i++){const a0=i/n*TAU,a1=(i+1)/n*TAU,am=(a0+a1)/2,o=ax==='x'?[0,Math.sin(am),Math.cos(am)]:[Math.cos(am),0,Math.sin(am)];this.tri(P(-h,a0),P(h,a0),P(h,a1),hex,o);this.tri(P(-h,a0),P(h,a1),P(-h,a1),hex,o);
  for(const e of[1,-1]){const ce=ax==='x'?[c[0]+e*h,c[1],c[2]]:[c[0],c[1]+e*h,c[2]];this.tri(ce,P(e*h,a0),P(e*h,a1),hex,ax==='x'?[e,0,0]:[0,e,0])}}};
MB.prototype.mesh=function(opt){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));g.computeBoundingSphere();
 return new THREE.Mesh(g,new THREE.MeshBasicMaterial(Object.assign({vertexColors:true},opt||{})))};

/* ------------------------------------------------------------------ models */
function droneModel(D,col){const g=new THREE.Group(),b=new MB(),s=D.sz||1,c=col||D.col,arms=D.x8?8:4,props=[];
 b.box([0,0,0],[.16*s,.06*s,.24*s],c);b.box([0,.045*s,-.02*s],[.12*s,.04*s,.14*s],D.acc2);b.box([0,-.01*s,.13*s],[.05*s,.05*s,.04*s],0x111214);
 b.box([-.03*s,.0,.152*s],[.018*s,.018*s,.004],0xffffff);b.box([.03*s,.0,.152*s],[.018*s,.018*s,.004],0xffffff);b.box([0,.0,-.122*s],[.06*s,.016*s,.004],0xff2020);
 for(let i=0;i<arms;i++){const a=(i+.5)/arms*TAU,R=.2*s,x=Math.cos(a)*R,z=Math.sin(a)*R;b.box([x/2,0,z/2],[.03*s,.022*s,R],c,Math.atan2(x,z));b.cyl([x,.02*s,z],.022*s,.04*s,0x2a2c30,'y',8);
  const pm=new THREE.Mesh(new THREE.CylinderGeometry(.085*s,.085*s,.004,16),new THREE.MeshBasicMaterial({color:D.acc2,transparent:true,opacity:.45,depthWrite:false}));pm.position.set(x,.045*s,z);g.add(pm);props.push(pm);
  b.box([x,.045*s,z],[.17*s,.004,.016*s],0x2a2c30,a)}
 const m=b.mesh();g.add(m);g.userData.props=props;return g}
function rcModel(C,col){const g=new THREE.Group(),b=new MB(),c=col||C.col,K=C.kind,big=K==='monster',f1=K==='f1',W=big?.15:.1,wr=big?.11:K==='f1'?.06:.07,L=f1?.56:.46,y0=wr+(big?.08:.01);
 b.box([0,y0,0],[.22,.03,L],0x2a2c30);
 if(f1){b.box([0,y0+.05,0],[.12,.06,.42],c);b.box([0,y0+.06,.27],[.06,.04,.12],c);b.box([0,y0+.02,.33],[.3,.012,.06],C.acc2);b.box([0,y0+.14,-.27],[.28,.012,.07],C.acc2);b.box([0,y0+.08,-.24],[.02,.1,.03],0x2a2c30);b.box([0,y0+.1,-.04],[.08,.05,.08],0x111214)}
 else{const hh=big?.12:.09;b.box([0,y0+.07,0],[.24,hh,L*.9],c);b.box([0,y0+.07+hh*.75,-.02],[.2,hh*.7,L*.45],C.acc2);b.box([0,y0+.07+hh*.6,.1],[.19,.06,.03],0x18222c,0,0);
  if(K!=='monster')b.box([0,y0+.2,-L*.47],[.24,.015,.06],C.acc2);b.box([.08,y0+.05,L*.455],[.04,.03,.01],0xffffff);b.box([-.08,y0+.05,L*.455],[.04,.03,.01],0xffffff);b.box([.08,y0+.05,-L*.455],[.04,.03,.01],0xff2020);b.box([-.08,y0+.05,-L*.455],[.04,.03,.01],0xff2020)}
 b.box([.09,y0+.2,-.16],[.004,.24,.004],0x111214);
 g.add(b.mesh());const wheels=[];
 for(const sx of[1,-1])for(const sz of[1,-1]){const p=new THREE.Group(),sp=new THREE.Group(),wb=new MB();wb.cyl([0,0,0],wr,W,0x161618,'x',12);wb.cyl([sx*W*.52,0,0],wr*.6,.004,big?0xc8ccd2:C.acc2,'x',10);
  sp.add(wb.mesh());p.add(sp);p.position.set(sx*(f1?.15:.14+(big?.04:0)),wr,sz*L*.36);g.add(p);wheels.push({p,sp,front:sz>0})}
 g.userData.wheels=wheels;g.userData.wr=wr;return g}

/* ------------------------------------------------------------------ track geometry */
function cr(pts,n,closed){const o=[],N=pts.length;for(let i=0;i<N;i++){const p0=pts[(i-1+N)%N],p1=pts[i],p2=pts[(i+1)%N],p3=pts[(i+2)%N];
 for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t,f=(a,b,c,d)=>.5*(2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3);o.push(p1.map((_,j)=>f(p0[j],p1[j],p2[j],p3[j])))}}return o}
const cvx=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t};
const banner=(txt,bg,fg)=>cvx(512,96,(g,w,h)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle=fg;g.font='bold 52px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,w/2,h/2+3)});
const TRACKS=[];
/* t: place in world: origin (x,z), rotation, ground y */
function W(T,u,v){const c=Math.cos(T.rot),s=Math.sin(T.rot);return[T.x+u*c+v*s,T.z-u*s+v*c]}
function buildRC(T){const G=new THREE.Group();scene.add(G);T.G=G;const Y=T.y;
 const S=cr(T.pts,14,1).map(q=>{const w=W(T,q[0],q[1]);return[w[0],w[1]]});T.S=S;const N=S.length,hw=T.w/2;
 const tan=i=>{const a=S[(i-1+N)%N],b=S[(i+1)%N],l=Math.hypot(b[0]-a[0],b[1]-a[1]);return[(b[0]-a[0])/l,(b[1]-a[1])/l]};T.tan=tan;
 const road=new MB(),kerb=new MB();
 for(let i=0;i<N;i++){const j=(i+1)%N,ti=tan(i),tj=tan(j),ni=[-ti[1],ti[0]],nj=[-tj[1],tj[0]];
  const L=(p,n,o,h)=>[p[0]+n[0]*o,Y+h,p[1]+n[1]*o];
  road.tri(L(S[i],ni,-hw,.04),L(S[i],ni,hw,.04),L(S[j],nj,hw,.04),0x3a3c42,[0,1,0]);road.tri(L(S[i],ni,-hw,.04),L(S[j],nj,hw,.04),L(S[j],nj,-hw,.04),0x3a3c42,[0,1,0]);
  const kc=(i>>1)%2?0xd8d8da:0xd01818;for(const e of[1,-1]){const a=hw*e,b2=(hw+.45)*e;kerb.tri(L(S[i],ni,a,.06),L(S[i],ni,b2,.06),L(S[j],nj,b2,.06),kc,[0,1,0]);kerb.tri(L(S[i],ni,a,.06),L(S[j],nj,b2,.06),L(S[j],nj,a,.06),kc,[0,1,0])}
  if(i%6===0){const o=L(S[i],ni,hw+1.1,.2);const t=new MB();for(const e of[1,-1]){const q=L(S[i],ni,(hw+1.0)*e,.2);t.box(q,[.5,.4,.5],i%12?0xf0f0f0:0xd01818,Math.atan2(ti[0],ti[1]))}G.add(t.mesh())}}
 G.add(road.mesh(),kerb.mesh());
 /* start line, gantry with lights */
 const t0=tan(0),n0=[-t0[1],t0[0]],ln=new MB();for(let k=-6;k<6;k++)for(let r=0;r<2;r++){const o=(k+.5)*hw/6,f=r*.35-.17;ln.box([S[0][0]+n0[0]*o+t0[0]*f,Y+.05,S[0][1]+n0[1]*o+t0[1]*f],[hw/6,.01,.17],(k+r)%2?0xffffff:0x111111,Math.atan2(t0[0],t0[1]))}G.add(ln.mesh());
 const gy=new MB(),ry=Math.atan2(t0[0],t0[1]);for(const e of[1,-1])gy.box([S[0][0]+n0[0]*(hw+.6)*e,Y+1.4,S[0][1]+n0[1]*(hw+.6)*e],[.2,2.8,.2],0x2a2c30);
 gy.box([S[0][0],Y+2.75,S[0][1]],[hw*2+1.4,.35,.25],0x15161a,ry);G.add(gy.mesh());
 T.lights=[];for(let k=0;k<5;k++){const m=new THREE.Mesh(new THREE.SphereGeometry(.13,10,8),new THREE.MeshBasicMaterial({color:0x330808}));const o=(k-2)*.45;m.position.set(S[0][0]+n0[0]*o-t0[0]*.14,Y+2.75,S[0][1]+n0[1]*o-t0[1]*.14);G.add(m);T.lights.push(m)}
 const bn=new THREE.Mesh(new THREE.PlaneGeometry(hw*2+1.2,.5),new THREE.MeshBasicMaterial({map:banner(T.n,T.bg,T.fg),side:THREE.DoubleSide}));bn.position.set(S[0][0],Y+3.2,S[0][1]);bn.rotation.y=ry;G.add(bn);
 /* driver's stand (where you stand to race) */
 const sp=W(T,T.pad[0],T.pad[1]);T.px=sp[0];T.pz=sp[1];const st=new MB();st.box([sp[0],Y+.15,sp[1]],[3,.3,2],0x6a6e74);st.box([sp[0],Y+1.1,sp[1]-0],[3,.08,2],0x2a2c30);for(const a of[[-1.4,-.9],[1.4,-.9],[-1.4,.9],[1.4,.9]])st.box([sp[0]+a[0],Y+.7,sp[1]+a[1]],[.08,1,.08],0x2a2c30);G.add(st.mesh());
 const ring=new THREE.Mesh(new THREE.RingGeometry(1.1,1.35,32).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:new THREE.Color(T.bg),transparent:true,opacity:.85}));ring.position.set(sp[0],Y+.32,sp[1]);G.add(ring);T.ring=ring;
 const sg=new THREE.Mesh(new THREE.PlaneGeometry(4.2,.8),new THREE.MeshBasicMaterial({map:banner(T.n,T.bg,T.fg),side:THREE.DoubleSide}));sg.position.set(sp[0],Y+2.4,sp[1]-1.2);G.add(sg);
 T.len=0;for(let i=0;i<N;i++){const j=(i+1)%N;T.len+=Math.hypot(S[j][0]-S[i][0],S[j][1]-S[i][1])}}
function buildDrone(T){const G=new THREE.Group();scene.add(G);T.G=G;const Y=T.y;
 T.gates=T.pts.map(q=>{const w=W(T,q[0],q[1]);return[w[0],Y+q[2],w[1]]});const N=T.gates.length;
 T.S=cr(T.gates,16,1);T.gm=[];
 for(let i=0;i<N;i++){const p=T.gates[i],a=T.gates[(i-1+N)%N],b=T.gates[(i+1)%N],d=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],l=Math.hypot(d[0],d[2]),yaw=Math.atan2(d[0],d[2]);
  const g=new THREE.Group();g.position.set(p[0],p[1],p[2]);g.rotation.y=yaw;const s=T.gs;
  const mk=c=>new THREE.MeshBasicMaterial({color:c});const fr=[];for(const[x,y,w,h]of[[0,s/2,s+.3,.3],[0,-s/2,s+.3,.3],[s/2,0,.3,s+.3],[-s/2,0,.3,s+.3]]){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,.3),mk(0x2050ff));m.position.set(x,y,0);g.add(m);fr.push(m)}
  if(p[1]-Y>s/2+.3){const post=new THREE.Mesh(new THREE.BoxGeometry(.18,p[1]-Y-s/2,.18),mk(0x3a3d42));post.position.set(s/2+.2,-(p[1]-Y)/2-s/4,0);g.add(post);const post2=post.clone();post2.position.x=-s/2-.2;g.add(post2)}
  const num=new THREE.Mesh(new THREE.PlaneGeometry(.9,.6),new THREE.MeshBasicMaterial({map:banner(String(i+1),'#10141c','#ffffff'),side:THREE.DoubleSide}));num.position.set(0,s/2+.6,0);g.add(num);
  G.add(g);T.gm.push({g,fr,n:[Math.sin(yaw),0,Math.cos(yaw)],p})}
 /* launch pad + pilot stand */
 const pd=W(T,T.lp[0],T.lp[1]);T.lpw=[pd[0],Y,pd[1]];const pb=new MB();pb.box([pd[0],Y+.06,pd[1]],[3.2,.12,3.2],0x2a2c30);pb.box([pd[0],Y+.13,pd[1]],[1.6,.01,.25],0xf0c010);pb.box([pd[0]-.55,Y+.13,pd[1]],[.25,.01,1.4],0xf0c010);pb.box([pd[0]+.55,Y+.13,pd[1]],[.25,.01,1.4],0xf0c010);G.add(pb.mesh());
 const sp=W(T,T.pad[0],T.pad[1]);T.px=sp[0];T.pz=sp[1];const st=new MB();st.box([sp[0],Y+.15,sp[1]],[3,.3,2],0x6a6e74);G.add(st.mesh());
 const ring=new THREE.Mesh(new THREE.RingGeometry(1.1,1.35,32).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:new THREE.Color(T.bg),transparent:true,opacity:.85}));ring.position.set(sp[0],Y+.32,sp[1]);G.add(ring);T.ring=ring;
 const sg=new THREE.Mesh(new THREE.PlaneGeometry(4.2,.8),new THREE.MeshBasicMaterial({map:banner(T.n,T.bg,T.fg),side:THREE.DoubleSide}));sg.position.set(sp[0],Y+2.4,sp[1]-1.2);G.add(sg);
 for(const e of[-1,1]){const b=new THREE.Mesh(new THREE.BoxGeometry(.12,2.2,.12),new THREE.MeshBasicMaterial({color:0x3a3d42}));b.position.set(sp[0]+e*2,Y+1.1,sp[1]-1.2);G.add(b)}}

/* ------------------------------------------------------------------ the four tracks */
const RCPTS=[[-19,-9],[-6,-11.5],[8,-11],[17,-8],[20,-1],[17,6],[9,8],[3,3],[-3,4],[-8,10],[-15,10],[-20,4]];
const DPTS=[[-24,-14,3],[-6,-20,6],[14,-18,9],[27,-6,12],[22,10,8],[6,16,4],[-10,8,7],[-26,6,10]];
const RCPTS2=[[-26,-20],[0,-24],[24,-20],[28,-6],[18,4],[24,16],[10,24],[-6,18],[-20,24],[-28,10],[-20,-2],[-28,-10]];
const DPTS2=[[0,-50,4],[20,-36,10],[26,-8,16],[12,20,22],[-14,40,14],[-26,12,9],[-22,-20,12],[-10,-40,7]];
function siteVillage(w,d){const ok=(cx,cz,rot)=>{const c=Math.cos(rot),s=Math.sin(rot),h0=hAt(cx,cz);for(let i=-w/2;i<=w/2;i+=3)for(let j=-d/2;j<=d/2;j+=3){const x=cx+i*c+j*s,z=cz-i*s+j*c,h=hAt(x,z);if(Math.abs(h-h0)>.35||h<-1||roadDist(x,z)<10||inAnyBld(x,z,2))return false;const q=colQ(x,z);if(q&&q.some&&q.some(k=>Math.hypot(k[0]-x,k[1]-z)<k[2]+1.2))return false}return true};
 for(let r=60;r<560;r+=12)for(let a=0;a<TAU;a+=.13){const x=Math.cos(a)*r,z=Math.sin(a)*r;if(TRACKS.some(t=>Math.hypot(t.x-x,t.z-z)<(t.R||40)+Math.max(w,d)/2+10))continue;for(const rot of[0,Math.PI/2])if(ok(x,z,rot))return{x,z,rot,y:hAt(x,z)}}return null}
const VR=siteVillage(48,32);if(VR){const T=Object.assign({key:'vrc',n:'COZY RC RACEWAY',type:'rc',bg:'#d01818',fg:'#ffffff',pts:RCPTS,w:4,laps:3,pad:[0,-15.5],prize:[60,35,15],R:28},VR);TRACKS.push(T);buildRC(T)}
const VD=siteVillage(62,46);if(VD){const T=Object.assign({key:'vdr',n:'COZY DRONE PARK',type:'drone',bg:'#1850d0',fg:'#ffffff',pts:DPTS,gs:3.4,laps:2,lp:[-30,-8],pad:[-30,-14],prize:[80,45,20],R:34},VD);TRACKS.push(T);buildDrone(T)}
if(window.MARLOWE){const MW=MARLOWE,pk=(MW.BLK||[]).find(b=>b.sp==='parkw');
 if(pk){const cx=MW.OX+(pk.u0+pk.u1)/2,cz0=MW.OZ+pk.v0,len=pk.v1-pk.v0,gy=(x,z)=>{const h=hAt(x,z);return isFinite(h)&&h>G0-.5?h:G0};
  const a={key:'mrc',n:'MARLOWE PARK RC CIRCUIT',type:'rc',bg:'#f0c010',fg:'#15161a',pts:RCPTS2,w:4.4,laps:3,pad:[0,-29],prize:[110,60,25],x:cx,z:cz0+36,rot:0,y:gy(cx,cz0+36)+.02,R:34,city:1};TRACKS.push(a);buildRC(a);
  /* the drone dash goes in the east park (the west one has the river through it) */
  const pe=MW.BLK.find(q=>q.sp==='parke')||pk,ex=MW.OX+(pe.u0+pe.u1)/2,ez=MW.OZ+(pe.v0+pe.v1)/2+4;
  const b={key:'mdr',n:'SKY TOWER DRONE DASH',type:'drone',bg:'#10b0a0',fg:'#ffffff',pts:DPTS2.map(q=>[q[0],q[1]*.88,q[2]]),gs:3.6,laps:2,lp:[10,-44],pad:[0,-46],prize:[150,80,30],x:ex,z:ez,rot:0,y:gy(ex,ez),R:50,city:1};TRACKS.push(b);buildDrone(b)}}
/* city tracks only show once Marlowe is built; map pins */
setInterval(()=>{for(const T of TRACKS)if(T.city)T.G.visible=!!(window.MARLOWE&&MARLOWE.M&&MARLOWE.M.built)},1000);
try{if(window.TOWN&&TOWN.pois)for(const T of TRACKS)if(!T.city)TOWN.pois.push({x:T.px,z:T.pz,n:T.n,c:'fun',ic:T.type==='drone'?'🛸':'🏎',d:1})}catch(e){}
try{const MW=window.MARLOWE;for(const T of TRACKS)if(T.city)MW.CITY.poi.push({n:T.n,u:T.px-MW.OX,v:T.pz-MW.OZ,ic:T.type==='drone'?'🛸':'🏎'})}catch(e){}
window.RCTRACKS=TRACKS;

/* ------------------------------------------------------------------ shops */
const SHOPS=[{t:'SKYLARK DRONES',bg:'#1850d0',fg:'#ffffff',ic:'🛸',wall:0xe8eef8,who:'PIXIE',line:'Start small, fly every day, then come back for something scary.',list:DRONES,kind:'d'},
 {t:'TURBO TOYS RC',bg:'#d01818',fg:'#ffe040',ic:'🏎',wall:0xf6ecd8,who:'BARRY',line:'Batteries included. Grown-ups welcome. Especially grown-ups.',list:RCS,kind:'r'}];
if(window.TRI&&TRI.cityShop)for(const S of SHOPS)S.o=TRI.cityShop(S,{rcshop:S,rx:9,rz:6,sz:5.2});
const SPIN=[];
function buildRCShop(o){const S=o.rcshop;while(SG.children.length)SG.remove(SG.children[0]);RX=o.rx;RZ=o.rz;SHK=null;const Hh=IH+.9;
 SG.add(new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR.tile())));const wm=tx=>{const m=imat(tx);m.color.setHex(S.wall);return m};
 splane(2*RX,Hh,0,Hh/2,-RZ,0,wm(sWl));splane(2*RX,Hh,0,Hh/2,RZ,Math.PI,wm(sWl));splane(2*RZ,Hh,RX,Hh/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,Hh,-RX,Hh/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0a0c12,side:THREE.BackSide,fog:false}));vd.position.y=Hh/2;SG.add(vd);splane(1.1,2.2,0,1.1,RZ-.02,Math.PI,imat(T_FDOOR));
 IROOM.splice(0,IROOM.length,[-RX-1,RX+1,-RZ-1,-RZ+.25],[-RX-1,-RX+.25,-RZ,RZ],[RX-.25,RX+1,-RZ,RZ]);IA.splice(0,IA.length);
 sPlane(6,.9,0,2.7,-RZ+.03,0,TRI&&TRI.signTex?TRI.signTex(S):banner(S.t,S.bg,S.fg));
 gbox(SG,0,0,-RZ+1.2,3.4,.95,.7,0x20242c);gbox(SG,0,.95,-RZ+1.2,3.5,.06,.8,0xc0c4cc);IROOM.push([-1.9,1.9,-RZ,-RZ+1.7]);
 let h=0;for(const ch of S.t)h=(h*31+ch.charCodeAt(0))>>>0;window.SHK=personIn(pSpec(2000+h%7000,{f:false,gl:false,scarf:null,bp:false,bag:0,old:false}),0,-RZ+.5,0);
 IA.push({r:[-1.8,1.8,-RZ+1.7,-RZ+2.5],label:'TALK TO '+S.who,fn:()=>say(S.who,S.line,3600)});
 /* display tables with every model, spinning */
 SPIN.length=0;S.list.forEach((it,j)=>{const x=-6+j*3,z=-.6;gbox(SG,x,0,z,1.6,.8,1.6,0x2a2c34);gbox(SG,x,.8,z,1.7,.04,1.7,new THREE.Color(S.bg).getHex());
  const m=S.kind==='d'?droneModel(it):rcModel(it);m.position.set(x,S.kind==='d'?1.25:.84,z);m.scale.setScalar(S.kind==='d'?2.2:1.8);SG.add(m);SPIN.push(m);
  sPlane(1.6,.5,x,1.0,z+.84,0,txtTex(320,100,'#10141c','#ffe890',it.n+'  £'+it.p,26));IROOM.push([x-.9,x+.9,z-.9,z+.9]);
  IA.push({r:[x-1.4,x+1.4,z+.9,z+2.6],label:()=>(own(S.kind,it.k)?'OWNED: ':'BUY ')+it.n+(own(S.kind,it.k)?'':' £'+it.p),fn:()=>{SHOPKIND=S;openShop('rcbuy')}})});
 IA.push({r:[-1.0,1.0,RZ-.35,RZ],label:'LEAVE',fn:()=>leaveShop()});SHOPCUR={o,k:[S.who,S.line]}}
{const b0=buildShop;buildShop=function(o){if(!o||!o.rcshop)return b0(o);buildRCShop(o)}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(GS.inside&&SHOPCUR&&SHOPCUR.o&&SHOPCUR.o.rcshop)SPIN.forEach((m,k)=>{m.rotation.y+=dt*.8;if(m.userData.props)for(const p of m.userData.props)p.rotation.y+=dt*40})}}
const own=(kind,k)=>!!RS.own[kind][k];
let SHOPKIND=null;
const bar=v=>'▮'.repeat(Math.round(v))+'▯'.repeat(Math.max(0,5-Math.round(v)));
CUSTOM_SHOP.rcbuy=function(msg){const S=SHOPKIND||SHOPS[0],K=S.kind;document.getElementById('shT').textContent=S.t;
 document.getElementById('shMsg').textContent=msg||(K==='d'?'RACE THEM AT COZY DRONE PARK AND THE SKY TOWER DRONE DASH':'RACE THEM AT COZY RC RACEWAY AND MARLOWE PARK RC CIRCUIT');
 for(const it of S.list){const o=own(K,it.k),sel=RS.sel[K]===it.k,sp=K==='d'?it.spd/7:it.spd/4.4,ag=K==='d'?it.yaw/.76:it.grip/1.6;
  dRow(it.n+'  ·  '+it.d+'  ·  SPEED '+bar(sp)+'  HANDLING '+bar(ag),[[o?(sel?'SELECTED':'USE'):'BUY £'+it.p,()=>{if(!o){if(cash<it.p)return renderShop('NOT ENOUGH CASH');cash-=it.p;RS.own[K][it.k]=1;beep(660,.1,'square',.06);setTimeout(()=>beep(990,.15,'square',.06),110)}
   RS.sel[K]=it.k;try{saveGame()}catch(e){}renderShop(o?'NOW USING THE '+it.n:'YOURS! '+it.n+' · HEAD TO A TRACK AND STEP ON THE PAD')},sel]])}
 dRow('',[['BACK',()=>closeShop()]])};

/* ------------------------------------------------------------------ the race */
const R={on:0};window.RCRACE=R;
const hud=document.createElement('div');hud.id='rcHud';document.body.appendChild(hud);
{const css=document.createElement('style');css.textContent=`#rcHud{display:none;position:fixed;inset:0;z-index:70;pointer-events:none;font-family:monospace;color:#fff;text-shadow:0 2px 3px #000}
#rcHud .tl{position:absolute;left:12px;top:10px;font-weight:700;font-size:15px;line-height:1.35;background:rgba(8,10,16,.55);padding:8px 12px;border-radius:10px;border:1px solid #445}
#rcHud .tl b{font-size:26px;color:#ffe040}#rcHud .cd{position:absolute;left:0;right:0;top:28%;text-align:center;font-size:96px;font-weight:900;letter-spacing:4px;transition:transform .15s}
#rcHud .msg{position:absolute;left:0;right:0;top:16%;text-align:center;font-size:22px;font-weight:800;color:#ffe890}
#rcHud .arr{position:absolute;left:50%;top:70px;width:0;height:0;margin-left:-14px;border-left:14px solid transparent;border-right:14px solid transparent;border-bottom:30px solid #3aff7a;filter:drop-shadow(0 2px 3px #000)}
#rcHud .spd{position:absolute;right:14px;bottom:150px;font-size:30px;font-weight:900}#rcHud .spd small{font-size:13px;color:#9ab}
#rcHud .boost{position:absolute;right:14px;bottom:128px;width:120px;height:10px;border:2px solid #fff;border-radius:6px;overflow:hidden}#rcHud .boost i{display:block;height:100%;background:linear-gradient(90deg,#18d0ff,#3aff7a)}
#rcHud button{pointer-events:auto;font:800 15px monospace;color:#fff;background:rgba(20,26,40,.72);border:2px solid #8af;border-radius:14px;touch-action:none;user-select:none}
#rcHud .pad{position:absolute;bottom:14px;display:flex;gap:10px}#rcHud .pad button{width:74px;height:74px;font-size:26px}
#rcHud .top{position:absolute;right:10px;top:10px;display:flex;gap:8px}#rcHud .top button{padding:8px 12px}
#rcHud .flash{position:absolute;inset:0;background:#fff;opacity:0;transition:opacity .25s}
#rcHud .lines{position:absolute;inset:0;opacity:0;background:repeating-radial-gradient(circle at 50% 50%,transparent 0 60%,rgba(255,255,255,.08) 60% 61%);transition:opacity .2s}
#rcHud .res{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);min-width:300px;background:rgba(8,10,16,.88);border:2px solid #ffe040;border-radius:16px;padding:16px 20px;text-align:center;pointer-events:auto}
body.rcOn #hud{display:none!important}
#rcHud .res h2{margin:0 0 8px;font-size:34px;color:#ffe040}#rcHud .res p{margin:4px 0;font-size:15px}#rcHud .res button{margin:10px 6px 0;padding:10px 16px}`;document.head.appendChild(css)}
hud.innerHTML='<div class="lines"></div><div class="flash"></div><div class="tl"></div><div class="arr"></div><div class="msg"></div><div class="cd"></div><div class="spd"></div><div class="boost"><i></i></div>'+
 '<div class="pad" style="left:14px"><button data-k="l">◀</button><button data-k="r">▶</button></div><div class="pad up" style="left:14px;bottom:100px;display:none"><button data-k="up">▲</button><button data-k="dn">▼</button></div>'+
 '<div class="pad" style="right:14px"><button data-k="b">⏪</button><button data-k="boost">⚡</button><button data-k="g">GO</button></div><div class="top"><button data-k="cam">CAM</button><button data-k="quit">✕ QUIT</button></div>';
const H=s=>hud.querySelector(s),TP={};
hud.querySelectorAll('button[data-k]').forEach(b=>{const k=b.dataset.k,on=e=>{e.preventDefault();e.stopPropagation();TP[k]=1;if(k==='cam')R.cam=(R.cam+1)%(R.T&&R.T.type==='drone'?3:2);if(k==='quit')finish(true)},off=e=>{e&&e.preventDefault();TP[k]=0};
 b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointerleave',off);b.addEventListener('pointercancel',off)});
const KB={};addEventListener('keydown',e=>{if(!R.on)return;KB[e.code]=1;if(['Space','KeyQ','KeyE'].includes(e.code))e.preventDefault();if(e.code==='KeyC')R.cam=(R.cam+1)%(R.T.type==='drone'?3:2);if(e.code==='Escape')finish(true)},true);
addEventListener('keyup',e=>{KB[e.code]=0},true);
const IN=()=>({g:!!(TP.g||KB.KeyW||keys.up),b:!!(TP.b||KB.KeyS||keys.down),st:clamp((TP.l||KB.KeyA||keys.left?1:0)-(TP.r||KB.KeyD||keys.right?1:0),-1,1),boost:!!(TP.boost||KB.Space||KB.ShiftLeft),up:!!(TP.up||KB.KeyE),dn:!!(TP.dn||KB.KeyQ)});

/* sound: a motor whine per race (yours) */
let snd=null;function sndOn(type){try{if(typeof initAudio==='function')initAudio();if(!AC)return;const o=AC.createOscillator(),o2=AC.createOscillator(),f=AC.createBiquadFilter(),g=AC.createGain();o.type='sawtooth';o2.type='square';f.type='lowpass';f.frequency.value=type==='drone'?2600:1800;g.gain.value=0;o.connect(f);o2.connect(f);f.connect(g);g.connect(AC.destination);o.start();o2.start();snd={o,o2,g,f}}catch(e){snd=null}}
function sndSet(fr,v){if(!snd)return;const t=AC.currentTime;snd.o.frequency.setTargetAtTime(fr,t,.05);snd.o2.frequency.setTargetAtTime(fr*1.503,t,.05);snd.g.gain.setTargetAtTime(v,t,.08)}
function sndOff(){if(!snd)return;try{snd.g.gain.setTargetAtTime(0,AC.currentTime,.05);const s=snd;setTimeout(()=>{try{s.o.stop();s.o2.stop()}catch(e){}},300)}catch(e){}snd=null}
const chime=(n)=>{const f=[784,988,1175,1568];for(let i=0;i<(n||2);i++)setTimeout(()=>beep(f[i%4],.12,'triangle',.06),i*70)};

/* sparks / dust */
const FX=[],fxG=new THREE.Group();scene.add(fxG);for(let i=0;i<60;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.05,.05,.05),new THREE.MeshBasicMaterial({color:0xffe080,transparent:true,depthWrite:false}));m.visible=false;fxG.add(m);FX.push({m,t:0,v:[0,0,0]})}
let fxI=0;function spark(p,col,n,sp){for(let k=0;k<n;k++){const f=FX[fxI++%FX.length];f.m.position.set(p[0],p[1],p[2]);f.m.material.color.setHex(col);f.m.visible=true;f.t=.5+Math.random()*.4;f.v=[(Math.random()-.5)*sp,Math.random()*sp*.7,(Math.random()-.5)*sp]}}
function fxTick(dt){for(const f of FX){if(!f.m.visible)continue;f.t-=dt;if(f.t<=0){f.m.visible=false;continue}f.v[1]-=6*dt;f.m.position.x+=f.v[0]*dt;f.m.position.y+=f.v[1]*dt;f.m.position.z+=f.v[2]*dt;f.m.material.opacity=Math.min(1,f.t*2)}}

/* racer objects: x,z,y, heading, speed, progress */
function nearest(T,x,z,hint){const S=T.S,N=S.length;let bi=0,bd=1e9;const lo=hint==null?0:hint-12,hi=hint==null?N:hint+12;for(let k=lo;k<hi;k++){const i=((k%N)+N)%N,d=(S[i][0]-x)**2+(S[i][T.type==='drone'?2:1]-z)**2;if(d<bd){bd=d;bi=i}}return bi}
function makeRacer(T,item,col,isMe,slot){const D=T.type==='drone',g=D?droneModel(item,col):rcModel(item,col);if(!D)g.scale.setScalar(1.25);scene.add(g);
 const r={g,item,me:isMe,col,lap:0,gate:0,prog:0,done:0,t:0,spd:0,vx:0,vz:0,vy:0,boost:1,bt:0,best:1e9,lapT:0,idx:0,lat:0,name:isMe?'YOU':['ZIPPY','KESTREL','RUSTY','NOVA','TURBO TED'][slot]};
 if(D){const p=T.lpw;r.x=p[0]+(slot-1.5)*.9;r.z=p[2]+(slot%2)*.6;r.y=p[1]+.2;r.h=Math.atan2(T.gates[0][0]-r.x,T.gates[0][2]-r.z)}
 else{const S=T.S,t=T.tan(0),n=[-t[1],t[0]],row=Math.floor(slot/2),lane=(slot%2?1:-1)*T.w*.22;const N=S.length,bi=(N-2-row*3+N)%N;r.x=S[bi][0]+n[0]*lane;r.z=S[bi][1]+n[1]*lane;r.y=T.y;r.h=Math.atan2(t[0],t[1]);r.idx=bi;r.lat=lane;r.prog=-(row*3+2)/N}
 if(D)g.scale.setScalar(1.6);
 if(!isMe){r.skill=(D?.74+slot*.04:.84+slot*.035)+Math.random()*.05;r.wob=Math.random()*10}
 return r}
function start(T){if(R.on||busy||GS.inside)return;const K=T.type==='drone'?'d':'r',L=K==='d'?DRONES:RCS,sel=RS.sel[K]&&L.find(i=>i.k===RS.sel[K])||L.find(i=>own(K,i.k));
 if(!sel){toast(K==='d'?'YOU NEED A DRONE: SKYLARK DRONES IN MARLOWE':'YOU NEED AN RC CAR: TURBO TOYS RC IN MARLOWE');return}
 busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;R.on=1;R.T=T;R.cam=0;R.t=-4.2;R.lightN=0;R.fin=0;R.res=null;R.shake=0;
 R.list=[makeRacer(T,sel,sel.col,1,0)];const pool=L.slice().sort((a,b)=>Math.abs(a.spd-sel.spd)-Math.abs(b.spd-sel.spd));
 for(let k=1;k<4;k++){const it=pool[Math.min(pool.length-1,k%3)];R.list.push(makeRacer(T,Object.assign({},it,{spd:sel.spd*(.94+k*.02)}),RIVAL[k],0,k))}
 R.me=R.list[0];hud.style.display='block';document.body.classList.add('rcOn');H('.res')&&H('.res').remove();H('.up').style.display=T.type==='drone'?'flex':'none';
 H('.msg').textContent=T.n+' · '+T.laps+' LAPS · '+(T.type==='drone'?'FLY THROUGH THE GREEN GATE':'STAY ON THE TARMAC');
 R.fov0=cam.fov;R.fovNow=0;sndOn(T.type);if(T.lights)T.lights.forEach(l=>l.material.color.setHex(0x330808));R.cpos=null}
function lapLen(T){return T.type==='drone'?T.gates.length:1}
function updRacer(r,dt,T,ip){const D=T.type==='drone',it=r.item;
 if(D){/* drone: momentum, yaw, auto/assisted altitude, banking */
  const tgt=T.gates[r.gate%T.gates.length];let g=0,b=0,st=0,bo=0,up=0;
  if(r.me){g=ip.g?1:0;b=ip.b?1:0;st=ip.st;bo=ip.boost;up=(ip.up?1:0)-(ip.dn?1:0)}
  else{const S=T.S,N=S.length;let bi=r.si||0,bd=1e9;for(let k=-6;k<18;k++){const i=((bi+k)%N+N)%N,d=(S[i][0]-r.x)**2+(S[i][2]-r.z)**2+(S[i][1]-r.y)**2;if(d<bd){bd=d;bi=i}}r.si=bi;
   const la=S[(bi+5)%N],a=Math.atan2(la[0]-r.x,la[2]-r.z),da=((a-r.h+Math.PI*3)%TAU)-Math.PI;st=clamp(da*2.6,-1,1);g=Math.abs(da)<.9?1:.25;r.ay=la[1];bo=Math.abs(da)<.25&&r.boost>.6&&Math.sin(R.t*1.3+r.wob)>.6;
   const gi=(r.gate%T.gates.length)*16,past=((bi-gi)%N+N)%N;if(past>4&&past<N/2&&R.t>1){r.gate++;if(r.gate%T.gates.length===0){r.lap++;lapDone(r)}}}
  if(R.t<0){g=0;b=0;st=0;bo=0}
  const boosting=bo&&r.boost>.05;r.boost=clamp(r.boost+(boosting?-.45:.18)*dt,0,1);
  const top=it.spd*(boosting?1.35:1)*(r.me?1:r.skill*(1+.06*Math.sin(R.t*.7+r.wob))),acc=it.acc*(boosting?1.3:1);
  r.h+=st*it.yaw*dt;const fx=Math.sin(r.h),fz=Math.cos(r.h);
  r.vx+=fx*g*acc*dt;r.vz+=fz*g*acc*dt;const sp=Math.hypot(r.vx,r.vz);if(sp>top){r.vx*=top/sp;r.vz*=top/sp}
  const drag=b?3.2:g?.9:1.6;r.vx*=Math.exp(-drag*dt);r.vz*=Math.exp(-drag*dt);
  /* altitude: drift toward the next gate unless you're steering it with ▲▼ */
  const want=up?r.y+up*6:(r.me?tgt[1]:(r.ay!=null?r.ay:tgt[1]));r.vy+=clamp((want-r.y)*(up?3:2.2)-r.vy*2.2,-20,20)*dt;
  const ox=r.x,oy=r.y,oz=r.z;r.x+=r.vx*dt;r.z+=r.vz*dt;r.y+=r.vy*dt;const gy=hAt(r.x,r.z)+.25;if(r.y<gy){r.y=gy;r.vy=Math.max(0,r.vy)}r.y=Math.min(r.y,T.y+40);
  r.spd=Math.hypot(r.vx,r.vz);
  /* gate crossing */
  const G_=T.gm[r.gate%T.gates.length],n=G_.n,p=G_.p,d0=(ox-p[0])*n[0]+(oz-p[2])*n[2],d1=(r.x-p[0])*n[0]+(r.z-p[2])*n[2];
  if(d0<0&&d1>=0){const t=d0/(d0-d1),cx=lerp(ox,r.x,t)-p[0],cy=lerp(oy,r.y,t)-p[1],cz=lerp(oz,r.z,t)-p[2],lat=Math.abs(cx*n[2]-cz*n[0]);
   if(lat<T.gs/2+.15&&Math.abs(cy)<T.gs/2+.15){r.gate++;if(r.me){chime(2);flash(.35);spark([r.x,r.y,r.z],0x3aff7a,14,4)}
    if(r.gate%T.gates.length===0&&r.gate>0){r.lap++;lapDone(r)}}}
  r.prog=r.gate+Math.max(0,1-Math.hypot(tgt[0]-r.x,tgt[2]-r.z)/30);
  /* looks */
  const fwd=(r.vx*fx+r.vz*fz),side=(r.vx*fz-r.vz*fx);r.g.position.set(r.x,r.y,r.z);r.g.rotation.set(0,r.h,0);r.g.rotateX(clamp(fwd/it.spd,-1,1)*.45);r.g.rotateZ(clamp(-side/8-st*.25,-.6,.6));
  if(r.g.userData.props)for(const p of r.g.userData.props)p.rotation.y+=dt*(30+g*40)}
 else{/* RC car: grip model on the ribbon, kerb bumps, off-track slow */
  const S=T.S,N=S.length;let g=0,b=0,st=0,bo=0;
  if(r.me){g=ip.g?1:0;b=ip.b?1:0;st=ip.st;bo=ip.boost}
  else{const la=(r.idx+7)%N,tx=S[la][0]+(-T.tan(la)[1])*r.lat*.4,tz=S[la][1]+T.tan(la)[0]*r.lat*.4,a=Math.atan2(tx-r.x,tz-r.z),da=((a-r.h+Math.PI*3)%TAU)-Math.PI;st=clamp(da*2.6,-1,1);g=1;b=Math.abs(da)>.7&&r.spd>it.spd*.6?1:0;bo=Math.abs(da)<.15&&r.boost>.6&&Math.sin(R.t*1.1+r.wob)>.5}
  if(R.t<0){g=0;b=0;st=0;bo=0}
  const boosting=bo&&r.boost>.05;r.boost=clamp(r.boost+(boosting?-.5:.16)*dt,0,1);
  const top=it.spd*(boosting?1.3:1)*(r.me?1:r.skill*(1+.05*Math.sin(R.t*.6+r.wob)));
  const fx=Math.sin(r.h),fz=Math.cos(r.h),lx=fz,lz=-fx;let vf=r.vx*fx+r.vz*fz,vl=r.vx*lx+r.vz*lz;
  vf+=(g*it.acc*(boosting?1.35:1)-b*(vf>0?it.acc*1.4:it.acc*.5)-(g||b?0:vf*.8))*dt;vf=clamp(vf,-it.spd*.4,top);
  vl*=Math.exp(-it.grip*dt);r.h+=st*clamp(vf/3,-1,1)*3.0*dt;
  r.vx=fx*vf+lx*vl;r.vz=fz*vf+lz*vl;
  /* the drift car slides out a little */
  if(it.kind==='drift'){const k=st*vf*.08*dt*60;r.vx+=lx*k*dt*-1;r.vz+=lz*k*dt*-1}
  let nx=r.x+r.vx*dt,nz=r.z+r.vz*dt;r.idx=nearest(T,nx,nz,r.idx);const t=T.tan(r.idx),nn=[-t[1],t[0]],off=(nx-S[r.idx][0])*nn[0]+(nz-S[r.idx][1])*nn[1],hw=T.w/2;
  if(Math.abs(off)>hw+.35){const back=(Math.abs(off)-hw-.35)*Math.sign(off);nx-=nn[0]*back;nz-=nn[1]*back;r.vx*=.55;r.vz*=.55;if(r.me){R.shake=.25;beep(110,.06,'square',.04);spark([nx,T.y+.2,nz],0xffd040,6,3)}}
  else if(Math.abs(off)>hw){r.vx*=Math.exp(-1.2*dt);r.vz*=Math.exp(-1.2*dt);if(r.me&&Math.random()<.3)spark([nx,T.y+.1,nz],0x8a6a3a,1,1.5)}
  r.x=nx;r.z=nz;r.spd=Math.hypot(r.vx,r.vz);r.lat=r.me?off:r.lat;
  const prev=r.prog;let p=r.lap+r.idx/N;if(p<prev-.5)p+=1;if(p>prev+.5)p-=1;
  if(Math.floor(p)>Math.floor(prev)&&r.half){r.lap++;r.half=0;lapDone(r)}if(r.idx>N*.45&&r.idx<N*.55)r.half=1;r.prog=r.lap+r.idx/N;
  /* looks: roll, pitch, wheels */
  r.g.position.set(r.x,T.y+.03,r.z);r.g.rotation.set(0,r.h,0);r.g.rotateZ(clamp(vl*.06,-.18,.18));r.g.rotateX(clamp(-g*.04+b*.05,-.1,.1));
  for(const w of r.g.userData.wheels){w.sp.rotation.x+=vf*dt/r.g.userData.wr;if(w.front)w.p.rotation.y=st*.45}
  if(r.me&&Math.abs(vl)>2.2&&Math.random()<.5)spark([r.x,T.y+.05,r.z],0xc8c0b0,1,1.2)}
 if(r.me&&R.t>0)sndSet(D?180+r.spd*14+(ip.g?60:0):110+r.spd*22,.05+(ip.g?.03:0))}
function lapDone(r){const T=R.T,lt=R.t-r.lapT;r.lapT=R.t;if(lt<r.best)r.best=lt;
 if(r.me){chime(4);if(r.lap<T.laps){H('.msg').textContent='LAP '+(r.lap+1)+' / '+T.laps+'  ·  '+lt.toFixed(2)+'s';setTimeout(()=>{if(R.on)H('.msg').textContent=''},1800)}
  const k=T.key;if(!RS.best[k]||lt<RS.best[k]){RS.best[k]=lt;if(r.lap<=T.laps)setTimeout(()=>{if(R.on)H('.msg').textContent='NEW BEST LAP! '+lt.toFixed(2)+'s'},400)}}
 if(r.lap>=T.laps&&!r.done){r.done=1;r.t=R.t;r.place=R.list.filter(q=>q.done).length;if(r.me)setTimeout(()=>finish(false),900)}}
const flash=v=>{const f=H('.flash');f.style.transition='none';f.style.opacity=v;requestAnimationFrame(()=>{f.style.transition='opacity .35s';f.style.opacity=0})};
function finish(quit){if(!R.on||R.fin)return;R.fin=1;const T=R.T,me=R.me;sndOff();
 if(quit){end();return}
 const place=me.place||R.list.filter(q=>q.done).length,pr=T.prize[place-1]||0;cash+=pr;if(place===1)RS.wins=(RS.wins|0)+1;try{saveGame()}catch(e){}
 const ord=['1ST','2ND','3RD','4TH'][place-1],bx=document.createElement('div');bx.className='res';
 bx.innerHTML=`<h2>${place===1?'🏆 ':''}${ord}!</h2><p>${T.n}</p><p>TIME ${me.t.toFixed(2)}s · BEST LAP ${me.best.toFixed(2)}s</p><p>TRACK RECORD ${(RS.best[T.key]||me.best).toFixed(2)}s</p><p style="color:#3aff7a;font-size:20px">${pr?'+£'+pr+' PRIZE':'NO PRIZE THIS TIME'}</p><button data-a="again">RACE AGAIN</button><button data-a="done">DONE</button>`;
 bx.querySelector('[data-a=again]').onclick=e=>{e.stopPropagation();end();setTimeout(()=>start(T),60)};bx.querySelector('[data-a=done]').onclick=e=>{e.stopPropagation();end()};hud.appendChild(bx);
 if(place===1){for(let k=0;k<4;k++)setTimeout(()=>spark([me.x,(me.y||T.y)+.5,me.z],[0xffe040,0x3aff7a,0x18d0ff,0xff3a8a][k],14,6),k*180);chime(4)}}
function end(){const T=R.T;for(const r of R.list||[])scene.remove(r.g);R.list=[];R.on=0;hud.style.display='none';document.body.classList.remove('rcOn');const res=H('.res');if(res)res.remove();sndOff();busy=0;cam.fov=R.fov0||cam.fov;cam.updateProjectionMatrix();if(T&&T.lights)T.lights.forEach(l=>l.material.color.setHex(0x330808))}

/* per frame */
let last=performance.now();
function tick(now){requestAnimationFrame(tick);const dt=Math.min(.05,(now-last)/1000);last=now;fxTick(dt);
 for(const T of TRACKS)if(T.ring){T.ring.rotation.y+=dt*.6;T.ring.material.opacity=.55+.35*Math.sin(now*.004)}
 if(!R.on)return;const T=R.T;if(!R.fin)R.t+=dt;const ip=IN();
 /* countdown: 4 lights then green */
 if(R.t<0){const n=Math.min(4,Math.floor(R.t+4.2));if(n>R.lightN){R.lightN=n;if(n>0){beep(440,.18,'square',.07);if(T.lights)T.lights[n-1].material.color.setHex(0xff2020)}}H('.cd').textContent=n>=1?['3','2','1','1'][n-1]:'READY'}
 else if(!R.go){R.go=1;beep(880,.35,'square',.08);if(T.lights)T.lights.forEach(l=>l.material.color.setHex(0x20ff40));H('.cd').textContent='GO!';H('.msg').textContent='';setTimeout(()=>{if(R.on)H('.cd').textContent=''},700)}
 if(R.t<0)R.go=0;
 for(const r of R.list)if(!r.done||!r.me)updRacer(r,dt,T,ip);
 /* standings */
 const ord=R.list.slice().sort((a,b)=>(b.done?1e6-b.t*10:b.prog)-(a.done?1e6-a.t*10:a.prog)),pos=ord.indexOf(R.me)+1,me=R.me;
 const lp=Math.min(T.laps,me.lap+1),gN=T.type==='drone'?T.gates.length:0;
 H('.tl').innerHTML=`<b>${['1ST','2ND','3RD','4TH'][pos-1]}</b> / 4<br>LAP ${lp}/${T.laps}${gN?' · GATE '+((me.gate%gN)+1)+'/'+gN:''}<br>TIME ${Math.max(0,R.t).toFixed(2)}<br>BEST ${(RS.best[T.key]||0)?RS.best[T.key].toFixed(2):'--'}`;
 H('.spd').innerHTML=Math.round(me.spd*3.6)+'<small> KM/H</small>';H('.boost i').style.width=(me.boost*100)+'%';H('.lines').style.opacity=ip.boost&&me.boost>.05&&R.t>0?.9:0;
 /* gate pointer */
 if(T.type==='drone'){const g=T.gates[me.gate%gN];for(let i=0;i<gN;i++){const on=i===me.gate%gN,nx=i===(me.gate+1)%gN;for(const m of T.gm[i].fr)m.material.color.setHex(on?(Math.sin(now*.012)>0?0x3aff7a:0x20c050):nx?0xffd040:0x2050ff)}
  const a=Math.atan2(g[0]-me.x,g[2]-me.z)-me.h;H('.arr').style.display='block';H('.arr').style.transform='rotate('+(-a)+'rad)'}else H('.arr').style.display='none';
 if(R.shake>0)R.shake-=dt}
requestAnimationFrame(tick);

/* camera: chase (smooth, FOV kicks with speed), FPV for drones, TV-style trackside */
{const uc=updateCam;updateCam=function(dt){uc(dt);if(!R.on||!R.me)return;const me=R.me,T=R.T,D=T.type==='drone',fx=Math.sin(me.h),fz=Math.cos(me.h),y=D?me.y:T.y;
 let px,py,pz,lx,ly,lz,fov=(D?62:58)+Math.min(22,me.spd*1.1)+(IN().boost&&me.boost>.05?8:0);
 if(R.cam===0){const back=D?2.2:1.9,up=D?.75:.85;px=me.x-fx*back;pz=me.z-fz*back;py=y+up;lx=me.x+fx*3;lz=me.z+fz*3;ly=y+(D?.1:.15)}
 else if(R.cam===1&&D){px=me.x+fx*.12;pz=me.z+fz*.12;py=y+.05;lx=me.x+fx*5;lz=me.z+fz*5;ly=y+.05-Math.min(.6,me.spd*.02);fov+=12}
 else{px=T.px;pz=T.pz;py=(D?T.y:T.y)+(D?2.2:3.2);lx=me.x;ly=y;lz=me.z;fov=Math.max(30,70-Math.hypot(me.x-px,me.z-pz)*.9)}
 if(!R.cpos||R.cam!==R.lastCam){R.cpos=[px,py,pz];R.lastCam=R.cam}const k=R.cam===0?Math.min(1,dt*(D?16:10)):1;R.cpos[0]+=(px-R.cpos[0])*k;R.cpos[1]+=(py-R.cpos[1])*k;R.cpos[2]+=(pz-R.cpos[2])*k;
 const sh=R.shake>0?R.shake*.15:0;cam.position.set(R.cpos[0]+(Math.random()-.5)*sh,R.cpos[1]+(Math.random()-.5)*sh,R.cpos[2]);cam.lookAt(lx,ly,lz);
 if(R.cam===1&&D)cam.rotateZ(clamp(IN().st*.25,-.3,.3));
 R.fovNow=(R.fovNow||fov)+(fov-(R.fovNow||fov))*Math.min(1,dt*4);cam.fov=R.fovNow;cam.updateProjectionMatrix();if(typeof skyG!=='undefined')skyG.position.copy(cam.position)}}

/* start pads: the usual action button */
{const c0=ctx;ctx=function(){const b=c0();if(R.on||!GS.onFoot||GS.inside||busy)return b;const p=P;
 for(const T of TRACKS){if(Math.hypot(p.x-T.px,p.z-T.pz)<2.2){const K=T.type==='drone'?'d':'r',L=K==='d'?DRONES:RCS,has=L.some(i=>own(K,i.k)),bst=RS.best[T.key];
  return{label:has?'RACE: '+T.n+' ('+T.laps+' LAPS'+(bst?' · BEST '+bst.toFixed(2)+'s':'')+')':(K==='d'?'BUY A DRONE AT SKYLARK DRONES (MARLOWE)':'BUY AN RC CAR AT TURBO TOYS RC (MARLOWE)'),fn:()=>has?start(T):toast(K==='d'?'SKYLARK DRONES IS IN MARLOWE':'TURBO TOYS RC IS IN MARLOWE')}}}
 return b}}
})();
