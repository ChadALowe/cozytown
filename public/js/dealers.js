/* Car and bike dealerships in Marlowe.
   Each dealership is a door on a city block (like the other Marlowe shops), a sign over it,
   a pin on the city map, and a showroom inside that pages through its own stock 8 pods at a
   time. VIEW opens the gallery where you can buy. Stock comes from tricars.js (by key).
   Village Motors (village) sells the original cars; Marlowe Motors sells vans, pickups and 4x4s. */
(function(){
if(!window.TRI||!window.MARLOWE)return;
const MW=window.MARLOWE,{OX,OZ,CITY}=MW,K=k=>TRI.byKey[k];
const ids=keys=>keys.map(K).filter(i=>i!=null);

const DEALERS=[
 {t:'BUDGET WHEELS',bg:'#f0c020',fg:'#1a1a1a',wall:0xf3ecd8,who:'SHAZ',line:'Cheap and cheerful. Every one of them starts first time. Mostly.',
  keys:['fiat500','panda','sandero','picanto','i10','aygox','up','swift','corsa','clio','p208','c3','fabia','mg3','micra','polo','yaris','jazz']},
 {t:'FAMILY MOTORS',bg:'#1d4f91',fg:'#ffffff',wall:0xe6ecf2,who:'GRAHAM',line:'Room for the kids, the dog and the big shop. Have a sit in the back.',
  keys:['focus','puma','kuga','astra','mokka','octavia','kodiaq','tiguan','passat','leon','p3008','captur','duster','xc40','xc90']},
 {t:'FAR EAST AUTOS',bg:'#b0182a',fg:'#ffffff',wall:0xf2e8e4,who:'KENJI',line:'Reliable as sunrise. And the GR Supra is very, very fast.',
  keys:['corolla','rav4','yariscross','civic','crv','juke','xtrail','sportage','ceed','tucson','kona','mazda3','cx5','gr86','supra','civicr']},
 {t:'PRESTIGE GERMANY',bg:'#101418',fg:'#c8ccd2',wall:0xdfe1e4,who:'KLAUS',line:'Precision. Comfort. Leather that smells like money.',
  keys:['aclass','cclass','eclass','sclass','gclass','glc','bmw1','bmw5','x5','m4','z4','a3','q5','rs6','tt','cayenne','taycan','macan','boxster','golfgti']},
 {t:'ELECTRIC AVENUE',bg:'#12b886',fg:'#ffffff',wall:0xe6f4ee,who:'ZOE',line:'Silent, quick and no petrol stations. Plug in at home overnight.',
  keys:['modely','models','polestar2','leaf','ev6','ioniq5','atto3','mg4','id3','zoe','i4']},
 {t:'SUPERCAR SALON',bg:'#0a0a0c',fg:'#e8c040',wall:0x2a2a30,floor:'tile2',who:'VALENTINA',line:'Look with your eyes, darling. Unless you have the money.',
  keys:['f296','sf90','roma','huracan','revuelto','urus','m750s','artura','db12','vantage','contgt','bentayga','phantom','cullinan','chiron']},
 {t:'BRITISH CLASSICS',bg:'#0f3a24',fg:'#f0e6c8',wall:0xefe6d0,floor:'wood',who:'NIGEL',line:'They don\'t make them like this any more. Mind the chrome.',
  keys:['mini59','etype','mgb','spitfire','minor','escort','db5','series3']},
 {t:'TWO WHEELS',bg:'#e85a10',fg:'#ffffff',wall:0xe8e4e0,who:'DANNI',line:'Helmet\'s included. Lean into the corners, not the kerbs.',bikes:1,
  keys:['cbr600','panigale','ninja650','r1','mt07','z900','streettriple','duke390','bonneville','enfield','streetglide','gs1300','africatwin','vespa','pcx']}];
for(const D of DEALERS)D.stock=ids(D.keys);
TRI.dealers=DEALERS;
TRI.villageStock=[0,1,2,3,4,5,...ids(['a6','golf','rr','m3','911','mini','3s','tc','qq','tx','prius'])];
TRI.motorsStock=ids(['sprinter','transporter','vivaro','hilux','ranger','dmax','wrangler','jimny','landcruiser']);

/* ---- doors: one free block face per dealership ---- */
const pw=r=>r.w>=20?6:4.5;
function doorAt(b,s,f){const iu0=b.u0+pw(b.sw),iu1=b.u1-pw(b.se),iv0=b.v0+pw(b.ss),iv1=b.v1-pw(b.sn);let fu,fv,ou,ov,road;
 if(s==='s'){fu=iu0+f*(iu1-iu0);fv=iv0;ou=0;ov=-1;road=b.ss}else if(s==='n'){fu=iu0+f*(iu1-iu0);fv=iv1;ou=0;ov=1;road=b.sn}else if(s==='w'){fu=iu0;fv=iv0+f*(iv1-iv0);ou=-1;ov=0;road=b.sw}else{fu=iu1;fv=iv0+f*(iv1-iv0);ou=1;ov=0;road=b.se}
 const u=fu+ou*1.4,v=fv+ov*1.4;return{u,v,x:OX+u,z:OZ+v,psi:Math.atan2(ou,ov),ou,ov,fu,fv,road}}
const BLK=(MW.BLK||[]).filter(b=>!b.sp&&b.ss&&b.sn&&b.sw&&b.se&&b.u1-b.u0>40&&b.v1-b.v0>40);
const tooClose=d=>SHOPD.some(o=>Math.hypot(o.x-d.x,o.z-d.z)<22);
/* spread round the middle of the city: nearest blocks first */
const cu=BLK.reduce((s,b)=>s+(b.u0+b.u1)/2,0)/Math.max(1,BLK.length),cv=BLK.reduce((s,b)=>s+(b.v0+b.v1)/2,0)/Math.max(1,BLK.length);
BLK.sort((a,b)=>Math.hypot((a.u0+a.u1)/2-cu,(a.v0+a.v1)/2-cv)-Math.hypot((b.u0+b.u1)/2-cu,(b.v0+b.v1)/2-cv));
const taken=new Set(),G=new THREE.Group();G.visible=false;scene.add(G);
const cvx=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t};
const signTex=D=>cvx(512,80,(g,w,h)=>{g.fillStyle=D.bg;g.fillRect(0,0,w,h);g.strokeStyle=D.fg;g.lineWidth=4;g.strokeRect(4,4,w-8,h-8);g.fillStyle=D.fg;g.font='bold 44px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillText(D.t,w/2,h/2+2)});
/* place any city shop: finds a free block face, adds the SHOPD door, map pin, sign and glass door */
function placeShop(D,extra){let d=null;
 for(const b of BLK){const bi=MW.BLK.indexOf(b);if(taken.has(bi))continue;
  for(const s of['s','e','n','w']){for(const f of[.5,.3,.7]){const q=doorAt(b,s,f);if(!tooClose(q)){d=q;break}}if(d)break}
  if(d){taken.add(bi);break}}
 if(!d){console.warn('city shop: no free block for',D.t);return null}
 const o=Object.assign({x:d.x,z:d.z,psi:d.psi,t:D.t,bg:D.bg,fg:D.fg,door:d,rx:12,rz:7,sz:6.2},extra||{});SHOPD.push(o);HRS[D.t]=D.h||[8,20];D.o=o;
 try{CITY.poi.push({n:D.t,u:d.u,v:d.v,ic:D.ic||'🚘'})}catch(e){czErr(e,"dealers.js")}
 const fx=OX+d.fu+d.ou*.06,fz=OZ+d.fv+d.ov*.06,Y=G0;
 const sg=new THREE.Mesh(new THREE.PlaneGeometry(7,1.1),new THREE.MeshBasicMaterial({map:signTex(D)}));sg.position.set(fx,Y+3.6,fz);sg.rotation.y=d.psi;G.add(sg);
 const dr=new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.4),new THREE.MeshBasicMaterial({color:0x1d2a36}));dr.position.set(fx+d.ou*.01,Y+1.2,fz+d.ov*.01);dr.rotation.y=d.psi;G.add(dr);
 const fr=new THREE.Mesh(new THREE.PlaneGeometry(2.7,2.6),new THREE.MeshBasicMaterial({color:new THREE.Color(D.bg)}));fr.position.set(fx,Y+1.3,fz);fr.rotation.y=d.psi;G.add(fr);
 return o}
for(const D of DEALERS){D.ic=D.bikes?'🏍':'🚘';placeShop(D,{dealer:D})}
TRI.cityShop=placeShop;TRI.signTex=signTex;
setInterval(()=>{G.visible=!!(MW.M&&MW.M.built)},1000);

/* ---- the showroom inside ---- */
const PODS=8,XS=[...Array(PODS)].map((_,j)=>-10.5+j*3),SPIN=[];
function buildDealer(o){const D=o.dealer;while(SG.children.length)SG.remove(SG.children[0]);RX=o.rx;RZ=o.rz;SHK=null;const Hh=IH+.9;
 SG.add(new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR[D.floor||'tile']())));
 const wm=tx=>{const m=imat(tx);m.color.setHex(D.wall);return m};
 splane(2*RX,Hh,0,Hh/2,-RZ,0,wm(sWl));splane(2*RX,Hh,0,Hh/2,RZ,Math.PI,wm(sWl));splane(2*RZ,Hh,RX,Hh/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,Hh,-RX,Hh/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0a0c12,side:THREE.BackSide,fog:false}));vd.position.y=Hh/2;SG.add(vd);
 splane(1.1,2.2,0,1.1,RZ-.02,Math.PI,imat(T_FDOOR));
 IROOM.splice(0,IROOM.length,[-RX-1,RX+1,-RZ-1,-RZ+.25],[-RX-1,-RX+.25,-RZ,RZ],[RX-.25,RX+1,-RZ,RZ]);IA.splice(0,IA.length);
 sPlane(7,1.0,0,2.6,-RZ+.03,0,signTex(D));
 /* desk + salesperson */
 gbox(SG,0,0,-RZ+1.3,3,.95,.7,0x20242c);gbox(SG,0,.95,-RZ+1.3,3.1,.06,.8,0xc0c4cc);IROOM.push([-1.7,1.7,-RZ,-RZ+1.8]);
 let h=0;for(const ch of D.t)h=(h*31+ch.charCodeAt(0))>>>0;window.SHK=personIn(pSpec(1000+h%9000,{f:false,gl:false,scarf:null,bp:false,bag:0,old:false}),0,-RZ+.55,0);
 IA.push({r:[-1.6,1.6,-RZ+1.8,-RZ+2.6],label:'TALK TO '+D.who,fn:()=>say(D.who,D.line,3600)});
 /* pods */
 const st=D.stock,NPG=Math.max(1,Math.ceil(st.length/PODS)),PG=(D.pg|0)%NPG;SPIN.length=0;TRI.curStock=st;
 XS.forEach((x,j)=>{const i=st[PG*PODS+j];if(i==null)return;
  const pod=new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.3,.14,20),new THREE.MeshBasicMaterial({color:0x303642}));pod.position.set(x,.07,-1);SG.add(pod);
  const rg=new THREE.Mesh(new THREE.RingGeometry(1.1,1.24,28).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:new THREE.Color(D.bg)}));rg.position.set(x,.145,-1);SG.add(rg);
  const car=realCar(i);car.position.set(x,.14,-1);car.scale.setScalar(D.bikes?1:.6);car.rotation.y=j*.8;SG.add(car);SPIN.push(car);
  gbox(SG,x,0,.55,.08,.55,.08,0x303030);sPlane(1.5,.75,x,.9,.57,0,boardTex(i));
  IROOM.push([x-1.25,x+1.25,-2.3,.25]);IA.push({r:[x-1.4,x+1.4,.4,2.4],label:()=>'VIEW '+CARN[i]+(OWN.car[i]?' (OWNED)':' £'+CPR(i)),fn:()=>showroomGo(i)})});
 if(NPG>1){const nx=-RX+2.2;sPlane(3.2,.55,nx,2.2,RZ-.03,Math.PI,txtTex(400,70,D.bg,D.fg,'MORE '+(D.bikes?'BIKES':'CARS')+' '+(PG+1)+'/'+NPG,34));
  IA.push({r:[nx-1.6,nx+1.6,RZ-1.4,RZ],label:()=>'MORE '+(D.bikes?'BIKES':'CARS')+' (PAGE '+((PG+1)%NPG+1)+' OF '+NPG+')',fn:()=>{D.pg=(PG+1)%NPG;buildShop(o)}})}
 IA.push({r:[-1.0,1.0,RZ-.35,RZ],label:'LEAVE',fn:()=>leaveShop()});
 SHOPCUR={o,k:[D.who,D.line]}}
{const b0=buildShop;buildShop=function(o){if(!o||!o.dealer)return b0(o);buildDealer(o)}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(GS.inside&&SHOPCUR&&SHOPCUR.o&&SHOPCUR.o.dealer)SPIN.forEach((c,k)=>{c.rotation.y+=dt*(.35+k*.03)})}}
})();
