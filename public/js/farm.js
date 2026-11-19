/* ===== FARM SIMULATOR: Holt's farmland on its own map. Plough, sow and harvest four real fields with a tractor and a combine,
   unload at the silo, sell grain at the daily price, buy diesel. Crops grow overnight. ===== */
(function(){
const A=window.AIRPORT,cvx=A.cvx,wmt=A.wmt,Y=G0,FX0=-1500,FZ0=0,CELL=3,NX=32,NZ=20,NC=NX*NZ;
const Wd=(u,v)=>[FX0+u,FZ0+v];
const inFM=(x,z)=>Math.abs(x-FX0)<430&&Math.abs(z-FZ0)<430;
{const h0=hAt;hAt=function(x,z){return inFM(x,z)?G0:h0(x,z)}}
const CR=[{k:'wheat',n:'WHEAT',days:4,h:1.35,ripe:[.92,.76,.3],gr:[.46,.64,.2],seed:.12,price:24,y:.034},
 {k:'barley',n:'BARLEY',days:3,h:1.15,ripe:[.88,.72,.36],gr:[.44,.66,.24],seed:.09,price:20,y:.036},
 {k:'canola',n:'CANOLA',days:5,h:1.45,ripe:[.97,.84,.1],gr:[.3,.58,.18],seed:.2,price:48,y:.026}];
const FO=[[-100,-95],[4,-95],[-100,-25],[4,-25],[-100,45],[4,45]];
const FD={fuel:100,grain:[0,0,0],price:[1,1,1],made:0,first:0,up:{w:0,tk:0,sp:0,fu:0,gps:0,hp:0},st:{cells:0,tons:0,earned:0},order:null,land:[0,0]};
const RK=[['GREENHORN',0],['FARMHAND',60],['FARMER',200],['MASTER GROWER',500]],rank=()=>{let q=0;RK.forEach((a,i)=>{if(FD.st.tons>=a[1])q=i});return q};
const UP=[['w','WIDER IMPLEMENTS','PLOUGH, SEEDER AND HEADER: 6 → 9 → 12 M WIDE',[600,1500]],['tk','BIGGER GRAIN TANK','COMBINE TANK 8 → 14 → 22 TONNES',[500,1200]],['sp','ENGINE TUNE','+12% SPEED PER LEVEL',[350,800]],['fu','DIESEL SAVER','20% LESS FUEL USED',[300]],['gps','GPS GUIDANCE','LET GO OF THE WHEEL AND IT HOLDS A STRAIGHT LINE',[450]],['hp','FARMHAND','£60 A NIGHT: HE PLOUGHS A FIELD OF STUBBLE WHILE YOU SLEEP',[700]]];
const LAND=[800,1500],cap=()=>[8,14,22][FD.up.tk],width=()=>6+3*FD.up.w,speedK=()=>1+.12*FD.up.sp;
const FL=FO.map(([u0,v0],i)=>({i,u0,v0,st:new Uint8Array(NC),age:new Uint8Array(NC),cr:new Uint8Array(NC),im:null,dirty:0}));
FL[4].locked=FL[5].locked=1;FL[1].st.fill(1);FL[2].st.fill(2);FL[2].cr.fill(1);FL[2].age.fill(1);FL[3].st.fill(3);FL[3].age.fill(4);
const FM={on:0,job:'',kind:'',crop:0,low:0,lz:0,tank:[0,0,0],cap:8,unl:0,ut:0,rd:0,built:0,toastT:0,msg:'',hudT:0,mapT:0,hint:null};
const CS={x:0,z:0,psi:0,y:0};
const VT={tr:{vmax:11,vw:6.2,acc:3.2,dec:7,turn:1.15,r:2.2},cb:{vmax:7.6,vw:5,acc:2.2,dec:5,turn:.82,r:3.0}};
const JB={plough:{n:'PLOUGH',from:0,to:1,off:-3.7,done:'PLOUGHED',tg:0},sow:{n:'SEEDER',from:1,to:2,off:-4.0,done:'SOWN',tg:1},harvest:{n:'HEADER',from:3,to:0,off:6.7,done:'HARVESTED',tg:3}};
let rs=991;const rand=()=>(rs=(rs*16807)%2147483647)/2147483647;
/* ---------- save ---------- */
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.fm={f:FL.map(f=>[Array.from(f.st).join(''),Array.from(f.age).join(','),Array.from(f.cr).join('')]),d:FD.fuel,g:FD.grain,p:FD.price,m:FD.made,fi:FD.first,up:FD.up,sx:FD.st,or:FD.order,ld:FD.land,on:FM.on?[FM.job,FM.crop,CS.x,CS.z,CS.psi]:0};return o};
 cozyLoad=function(z){l0(z);const q=z&&z.fm;if(!q)return;try{q.f.forEach((a,i)=>{const f=FL[i];for(let k=0;k<NC;k++)f.st[k]=+a[0][k];a[1].split(',').forEach((v,k)=>f.age[k]=+v);for(let k=0;k<NC;k++)f.cr[k]=+a[2][k]});FD.fuel=q.d;FD.grain=q.g;FD.price=q.p;FD.made=q.m||0;FD.first=q.fi||0;if(q.up)Object.assign(FD.up,q.up);if(q.sx)Object.assign(FD.st,q.sx);FD.order=q.or||null;if(q.ld)FD.land=q.ld;FL[4].locked=!FD.land[0];FL[5].locked=!FD.land[1];FM.resume=q.on||0;FL.forEach(f=>f.dirty=1)}catch(e){}}}
/* ---------- materials + fields ---------- */
const mc={};const mat=hex=>mc[hex]||(mc[hex]=(()=>{const c=new THREE.Color(hex);return wmt(null,{side:THREE.DoubleSide},[c.r,c.g,c.b])})());
const stripeTex=cvx(64,64,(c,w,h)=>{c.fillStyle='#bdbdbd';c.fillRect(0,0,w,h);for(let i=0;i<8;i++){c.fillStyle=i%2?'#a2a2a2':'#e6e6e6';c.fillRect(i*8,0,4,h)}c.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<10;i++)c.fillRect(0,i*6.4,w,1)});
stripeTex.wrapS=stripeTex.wrapT=THREE.RepeatWrapping;
const dm=new THREE.Object3D(),tc=new THREE.Color();
function look(f,i){if(f.locked)return[.1,.36,.54,.24];const s=f.st[i],c=CR[f.cr[i]];if(s===0)return[.16,.66,.56,.32];if(s===1)return[.34,.33,.21,.12];if(s===3){const o=Math.max(0,f.age[i]-c.days),d=1-Math.min(.35,o*.09);return[c.h*(1-Math.min(.2,o*.05)),c.ripe[0]*d,c.ripe[1]*d,c.ripe[2]*d]}
 if(f.age[i]===0)return[.22,.42,.3,.18];const p=Math.min(1,f.age[i]/c.days),q=Math.max(0,(p-.55)/.45)*.75;return[.28+(c.h-.28)*p*.95,c.gr[0]+(c.ripe[0]-c.gr[0])*q,c.gr[1]+(c.ripe[1]-c.gr[1])*q,c.gr[2]+(c.ripe[2]-c.gr[2])*q]}
function setCell(f,i){if(!f.im)return;const l=look(f,i),ix=i%NX,iz=(i/NX)|0,v=.94+((i*2654435761>>>0)%100)/800;dm.position.set(FX0+f.u0+(ix+.5)*CELL,Y,FZ0+f.v0+(iz+.5)*CELL);dm.scale.set(1,l[0],1);dm.updateMatrix();f.im.setMatrixAt(i,dm.matrix);tc.setRGB(l[1]*v,l[2]*v,l[3]*v);f.im.setColorAt(i,tc);f.dirty=1}
function refresh(f){if(!f.im)return;for(let i=0;i<NC;i++)setCell(f,i);flushF(f)}
function flushF(f){if(!f.dirty||!f.im)return;f.im.instanceMatrix.needsUpdate=true;if(f.im.instanceColor)f.im.instanceColor.needsUpdate=true;f.dirty=0}
const cellAt=(x,z)=>{for(const f of FL){if(f.locked)continue;const u=x-FX0-f.u0,v=z-FZ0-f.v0;if(u>=0&&v>=0&&u<NX*CELL&&v<NZ*CELL)return[f,((v/CELL)|0)*NX+((u/CELL)|0)]}return null};
const later=(t,ms)=>setTimeout(()=>toast(t),ms||2200);
function newOrder(silent){const rk=rank(),pool=rk>=1?[0,1,2]:[0,1],c=pool[(rand()*pool.length)|0],q=[8,12,16,20][Math.min(3,rk)];FD.order={c,q,by:DAY+4,pay:Math.round(q*CR[c].price*(1.4+rand()*.3))};if(!silent)later('NEW MILL ORDER: '+q+' T '+CR[c].n+' FOR £'+FD.order.pay,3800)}
{const n0=newDay;newDay=function(){n0();let wet=typeof rainI!=='undefined'&&rainI>0,over=0;
 for(const f of FL){if(f.locked)continue;for(let i=0;i<NC;i++){if(f.st[i]===2){f.age[i]+=wet?2:1;if(f.age[i]>=CR[f.cr[i]].days){f.age[i]=CR[f.cr[i]].days;f.st[i]=3}}else if(f.st[i]===3){f.age[i]=Math.min(60,f.age[i]+1);if(f.age[i]>CR[f.cr[i]].days)over++}}}
 if(wet)later('RAIN OVERNIGHT: THE CROPS GREW EXTRA',2400);if(over>40)later('RIPE CROP IS GOING OVER: HARVEST SOON OR LOSE YIELD',3000);
 if(FD.up.hp&&cash>=60){const f=FL.find(f=>!f.locked&&count(f,0)>0);if(f){cash-=60;let n=0;for(let i=0;i<NC;i++)if(f.st[i]===0){f.st[i]=1;n++}FD.st.cells+=n;later('YOUR FARMHAND PLOUGHED FIELD '+(f.i+1)+' (-£60)',1500)}}
 for(const f of FL)refresh(f);
 for(let k=0;k<3;k++)FD.price[k]=Math.round(clamp(FD.price[k]+(rand()-.48)*.32,.7,1.45)*100)/100;
 if(FD.order&&DAY>FD.order.by){later('THE MILL ORDER EXPIRED',1200);FD.order=null}if(!FD.order)newOrder()}}
/* ---------- the map ---------- */
const FC=[];/* [x,z,r] obstacles for vehicles and on foot */
function colRect(cx,cz,w,d,rot){const c=Math.cos(rot||0),s=Math.sin(rot||0),r=1.8;for(let a=-w/2;a<=w/2+.1;a+=2.4)for(const b of[-d/2,d/2]){FC.push([cx+a*c+b*s,cz-a*s+b*c,r])}for(let b=-d/2+2.4;b<d/2-1;b+=2.4)for(const a of[-w/2,w/2]){FC.push([cx+a*c+b*s,cz-a*s+b*c,r])}}
function buildMap(){if(FM.built)return;FM.built=1;
 const B=new Builder(3),R=new Builder(2),W=Wd;
 const qd=(u0,v0,u1,v1,col,y)=>{quadXZ(R,W(u0,v0),W(u1,v0),W(u1,v1),W(u0,v1),col,Y+y)};
 const pb=(u,y,v,sx,sy,sz,col,rot)=>{const p=W(u,v);pbox(B,p[0],Y+y,p[1],sx,sy,sz,col,rot||0)},pc=(u,y,v,r,h,sg,col)=>{const p=W(u,v);pcyl(B,p[0],Y+y,p[1],r,h,sg,col)},pn=(u,y,v,r,h,sg,col)=>{const p=W(u,v);pcone(B,p[0],Y+y,p[1],r,h,sg,col,0)};
 qd(-118,-262,118,-102,[.56,.5,.4],.03);qd(-6,-112,6,108,[.5,.4,.27],.035);qd(-108,-32,108,-22,[.5,.4,.27],.035);qd(-6,-266,6,-250,[.4,.4,.42],.04);
 for(const f of FL){qd(f.u0-1,f.v0-1,f.u0+NX*CELL+1,f.v0+NZ*CELL+1,[.36,.27,.17],.045)}
 /* farmhouse */
 {const p=W(-86,-218);pbox(B,p[0],Y,p[1],8,3.4,10,[.86,.82,.7]);proof(B,p[0],Y+3.4,p[1],8,10,2.6,[.5,.24,.2],.4,0);pbox(B,p[0]+4.02,Y,p[1]-1,.1,2.2,1.2,[.3,.2,.12]);for(const dz of[-3.2,2.6])pbox(B,p[0]+4.02,Y+1.2,p[1]+dz,.1,1.1,1.1,[.55,.7,.82]);pbox(B,p[0]-1.5,Y+3.4,p[1]+1,1,3,1,[.55,.3,.22]);colRect(p[0],p[1],8,10,0)}
 /* machinery shed, open to the fields */
 {const p=W(-36,-226);pbox(B,p[0],Y,p[1]-6,44,6.4,.6,[.5,.52,.56]);pbox(B,p[0]-22,Y,p[1],.6,6.4,12.6,[.5,.52,.56]);pbox(B,p[0]+22,Y,p[1],.6,6.4,12.6,[.5,.52,.56]);pbox(B,p[0],Y+6.4,p[1],45,.5,13.4,[.3,.34,.4]);for(let i=-3;i<=3;i++)pbox(B,p[0]+i*7,Y,p[1]+6.4,.5,6.4,.5,[.4,.36,.3]);colRect(p[0],p[1]-6,44,1,0)}
 /* grain silos + intake hopper */
 for(const[u,v]of[[58,-228],[69,-228],[80,-228]]){pc(u,0,v,3.6,13,12,[.74,.76,.78]);pn(u,13,v,3.9,3,12,[.44,.46,.5]);for(let k=1;k<7;k++)pc(u,k*1.8,v,3.65,.14,12,[.5,.52,.56]);const p=W(u,v);FC.push([p[0],p[1],4.2])}
 pb(69,0,-205,12,.7,8,[.4,.4,.44]);pb(69,.7,-205,10,.15,6,[.15,.15,.17]);for(let k=0;k<5;k++)pb(69,.86,-207.4+k*1.2,9.4,.06,.3,[.5,.5,.54]);pb(69,0,-214,2.4,5.5,2.4,[.46,.48,.52]);
 /* diesel pump + office board + gate */
 pb(26,0,-170,1.1,1.9,.8,[.82,.16,.12]);pb(26,1.9,-170,1.4,.2,1.0,[.95,.95,.92]);pb(26,0,-169.6,1.2,.3,1.4,[.4,.4,.42]);{const p=W(26,-170);FC.push([p[0],p[1],1.3])}
 pb(-4,0,-176,.2,2.3,.2,[.45,.3,.18]);pb(4,0,-176,.2,2.3,.2,[.45,.3,.18]);{const p=W(-4,-176),q=W(4,-176);FC.push([p[0],p[1],.5],[q[0],q[1],.5])}
 for(const s of[-1,1]){pb(s*6,0,-255,.5,5.5,.5,[.5,.36,.2])}pb(0,5.2,-255,13,.6,.5,[.5,.36,.2]);
 for(let i=0;i<5;i++){const u=-100+i*14;pc(u,0,-110,.6,1.2,8,[.82,.7,.3]);pc(u+8,0,-110,.6,1.2,8,[.82,.7,.3])}
 for(let k=0;k<6;k++){const p=W(90+rand()*14,-130-k*4);pcyl(B,p[0],Y,p[1],.45,1.1,8,[.2,.35,.6])}
 /* hedges round the fields */
 const hedge=(u0,v0,u1,v1)=>{const l=Math.hypot(u1-u0,v1-v0),n=Math.ceil(l/4);for(let i=0;i<n;i++){const u=u0+(u1-u0)*(i+.5)/n,v=v0+(v1-v0)*(i+.5)/n,h=1.5+rand()*.8;pb(u,0,v,Math.abs(u1-u0)>Math.abs(v1-v0)?l/n+.3:1.7,h,Math.abs(u1-u0)>Math.abs(v1-v0)?1.7:l/n+.3,[.16+rand()*.06,.36+rand()*.1,.14])}};
 hedge(-112,110,-6,110);hedge(6,110,112,110);hedge(-112,-102,-112,110);hedge(112,-102,112,110);hedge(-112,-103,-6,-103);hedge(6,-103,112,-103);
 /* trees outside the working area */
 const tree=(u,v)=>{const h=4+rand()*5;pc(u,0,v,.35,h*.5,5,[.4,.28,.18]);pn(u,h*.35,v,1.9+rand()*1.6,h,7,[.12+rand()*.12,.34+rand()*.14,.14]);const p=W(u,v);FC.push([p[0],p[1],.9])};
 for(let i=0;i<230;i++){const u=-400+rand()*800,v=-400+rand()*700;if(Math.abs(u)<132&&v>-270&&v<122)continue;if(Math.abs(u)<20&&v<-240)continue;tree(u,v)}
 for(let i=0;i<14;i++)pn(-420+i*64,0,430,90+rand()*50,50+rand()*40,8,[.28,.46,.3]);
 for(let i=0;i<10;i++){pn(-430,0,-380+i*80,80+rand()*40,40+rand()*40,8,[.3,.46,.3]);pn(430,0,-380+i*80,80+rand()*40,40+rand()*40,8,[.3,.46,.3])}
 const g=new THREE.Group();g.add(R.mesh(mRoad),B.mesh(mObj));scene.add(g);FM.g=g;
 /* signs */
 const sg=(t,bg,fg,u,y,v,w,h,ry,pw,ph,sz)=>{const p=W(u,v),m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:txtTex(pw,ph,bg,fg,t,sz),side:THREE.DoubleSide}));m.position.set(p[0],Y+y,p[1]);m.rotation.y=ry;scene.add(m)};
 sg('HOLT FARMLAND  ·  FIELDS  ·  GRAIN  ·  JOBS','#4a2e16','#ffe6a8',0,1.5,-176,7.2,1.1,0,1024,84,38);sg('COZY VILLAGE  ➜','#1a3c78','#ffffff',0,5.2,-254.7,12,.9,0,1024,80,40);sg('GRAIN INTAKE','#14223a','#ffd24a',69,5.2,-214.4,5.6,.9,0,512,70,40);sg('DIESEL','#a8141c','#ffffff',26,2.7,-170,1.4,.5,0,256,64,34);sg('HOLT FARMLAND','#2a4a22','#ffe9a8',-36,6.8,-232.4,14,1.3,0,768,80,44);
 /* the fields */
 const geo=new THREE.BoxGeometry(CELL,1,CELL);geo.translate(0,.5,0);
 for(const f of FL){const m=wmt(stripeTex,{},[1,1,1]);f.im=new THREE.InstancedMesh(geo,m,NC);f.im.frustumCulled=false;scene.add(f.im);refresh(f);if(f.locked){const p=Wd(f.u0+48,f.v0+30),sm=new THREE.Mesh(new THREE.PlaneGeometry(14,3.4),new THREE.MeshBasicMaterial({map:txtTex(512,128,'#8a1c1c','#ffffff','FOR SALE  £'+LAND[f.i-4],54),side:THREE.DoubleSide}));sm.position.set(p[0],Y+4,p[1]);scene.add(sm);f.sign=sm}}
 for(const c of FC)COL.push(c);
 buildVehicles();
 /* beacon + hud */
 FM.bc=new THREE.Mesh(new THREE.CylinderGeometry(3,3,90,12,1,true),new THREE.MeshBasicMaterial({color:0xffe14a,transparent:true,opacity:.22,depthWrite:false,fog:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));FM.bc.visible=false;scene.add(FM.bc)}
/* ---------- vehicles ---------- */
let CBG,TWH={},PL,SD,hdr,reel,aug,augTube,hopRoll,seedRoll;
function buildVehicles(){
 const bx=(g,w,h,d,x,y,z,m,ry)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);q.position.set(x,y,z);if(ry)q.rotation.y=ry;g.add(q);return q};
 const cy=(g,r,h,x,y,z,m,rz,rx,sg)=>{const q=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,sg||14),m);q.position.set(x,y,z);if(rz)q.rotation.z=rz;if(rx)q.rotation.x=rx;g.add(q);return q};
 const G=mat(0x3f8a2a),G2=mat(0x2c6a1c),Yl=mat(0xf0c41a),K=mat(0x25272b),Gy=mat(0x9aa0a8),Rd=mat(0xb02a20),Or=mat(0xc8501a),Gl=new THREE.MeshBasicMaterial({color:0x7fa8b8,transparent:true,opacity:.45,depthWrite:false});
 /* plough */
 PL=new THREE.Group();{const fr=new THREE.Group();fr.rotation.y=.42;fr.position.set(-1.4,0,-3.2);PL.add(fr);bx(fr,.28,.3,6.2,0,.95,0,Or);for(let i=0;i<5;i++){const z=-2.4+i*1.2;bx(fr,.14,.8,.14,0,.55,z,Or);const mb=bx(fr,.1,.7,1.3,.2,.3,z,Gy,-.25);bx(fr,.5,.1,.5,-.05,.0,z+.2,Or);cy(fr,.32,.06,-.5,.55,z,Gy,0,Math.PI/2,16).rotation.x=0}
 bx(PL,.5,.5,1.4,0,.95,-1.4,Or);bx(PL,.2,.2,2.2,0,.95,-1.0,K);const w=cy(PL,.34,.22,-3.6,.4,-4.5,K,Math.PI/2);}
 PL.visible=false;TRG.add(PL);
 /* seeder */
 SD=new THREE.Group();{bx(SD,5.8,.22,.3,0,.95,-2.6,K);bx(SD,5.4,1.05,1.5,0,1.7,-3.4,Rd);bx(SD,5.5,.14,1.7,0,2.3,-3.4,K);for(let i=0;i<9;i++){const x=-2.6+i*.65;bx(SD,.06,.9,.06,x,.5,-2.9,K);bx(SD,.05,1.2,.05,x,1.2,-3.0,Gy)}bx(SD,.5,.4,1.6,0,.9,-1.8,K);bx(SD,.18,.18,2.3,0,.95,-1.5,K);
 seedRoll=cy(SD,.4,5.9,0,.4,-4.6,K,Math.PI/2);for(const s of[-1,1])bx(SD,.14,.5,.9,s*2.9,.7,-4.0,K)}
 SD.visible=false;TRG.add(SD);
 /* combine harvester */
 CBG=new THREE.Group();const g=CBG;
 bx(g,3.0,1.5,6.6,0,1.6,-.4,G2);bx(g,3.3,.35,7.0,0,.75,-.4,K);bx(g,3.4,1.5,4.4,0,3.1,-2.2,G);bx(g,3.2,.14,4.1,0,3.9,-2.2,Gy);for(const s of[-1,1])bx(g,.12,1.3,4.2,s*1.66,3.1,-2.2,G2);
 bx(g,2.6,2.0,2.5,0,3.3,2.2,G);bx(g,2.9,.15,2.9,0,4.4,2.3,Yl);bx(g,2.4,1.5,.05,0,3.4,3.46,Gl);for(const s of[-1,1])bx(g,.05,1.5,2.0,s*1.31,3.4,2.2,Gl);bx(g,2.4,.4,.8,0,2.5,3.2,K);bx(g,.5,.4,.5,0,2.6,2.0,K);
 bx(g,2.6,1.6,2.0,0,2.7,-4.5,G2);cy(g,.14,1.3,.9,4.0,-4.8,K);cy(g,.1,.3,.9,4.75,-4.8,K);cy(g,.12,.12,0,4.7,2.3,Yl).material=mat(0xffa010);
 for(const s of[-1,1]){bx(g,.5,.2,.3,s*1.2,3.35,3.5,mat(0xfff0b0))}
 bx(g,2.4,1.4,2.4,0,1.6,4.4,G2);
 hdr=new THREE.Group();hdr.position.set(0,0,6.1);g.add(hdr);bx(hdr,6.6,.12,2.2,0,.5,0,Yl);bx(hdr,6.6,1.1,.14,0,1.05,-1.0,Yl);for(const s of[-1,1]){bx(hdr,.14,1.1,2.2,s*3.3,1.05,0,Yl);const cn=new THREE.Mesh(new THREE.ConeGeometry(.28,1.4,6),Yl);cn.rotation.x=Math.PI/2;cn.position.set(s*3.3,.62,1.4);hdr.add(cn)}
 bx(hdr,6.6,.1,.2,0,.42,1.1,Gy);for(let i=0;i<22;i++)bx(hdr,.1,.06,.2,-3.1+i*.3,.38,1.2,Gy);cy(hdr,.28,6.3,0,.95,-.55,Gy,Math.PI/2,0,10);
 reel=new THREE.Group();reel.position.set(0,1.7,.7);hdr.add(reel);cy(reel,.14,6.5,0,0,0,K,Math.PI/2,0,8);for(let k=0;k<4;k++){const a=k*Math.PI/2,sl=bx(reel,6.3,.1,.22,0,Math.sin(a)*.82,Math.cos(a)*.82,Yl);sl.rotation.x=-a;const ar=bx(reel,.08,.82,.08,0,Math.sin(a)*.4,Math.cos(a)*.4,K);ar.rotation.x=-a+Math.PI/2*0;ar.visible=false}
 aug=new THREE.Group();aug.position.set(1.5,4.15,1.2);g.add(aug);bx(aug,.4,.4,5.8,0,0,-2.9,Yl);bx(aug,.5,.5,.7,0,-.1,-5.7,K);bx(aug,.5,.6,.5,0,-.1,-.2,K);
 TWH.fl=wheelMesh(1.2,.85,16);TWH.fr=wheelMesh(1.2,.85,16);TWH.rl=wheelMesh(.78,.55,12);TWH.rr=wheelMesh(.78,.55,12);TWH.fl.position.set(2.0,1.2,1.7);TWH.fr.position.set(-2.0,1.2,1.7);TWH.rl.position.set(1.35,.78,-3.7);TWH.rr.position.set(-1.35,.78,-3.7);for(const k in TWH)g.add(TWH[k]);
 CBG.visible=false;scene.add(CBG)}
/* ---------- driving ---------- */
const hopper=()=>Wd(69,-205),pump=()=>Wd(26,-170),gate=()=>Wd(0,-244),board=()=>Wd(0,-176);
function startJob(job,crop){if(FM.on||busy)return;fade(()=>{buildMap();CS.x=GS.x;CS.z=GS.z;CS.psi=GS.psi;CS.y=GS.y;FM.on=1;FM.job=job;FM.crop=crop||0;FM.kind=job==='harvest'?'cb':'tr';FM.low=0;FM.lz=0;FM.hint=null;const s=Wd(-36,-196);GS.x=s[0];GS.z=s[1];GS.psi=0;GS.vx=GS.vz=GS.vy=0;GS.vf=0;GS.speed=0;GS.steer=0;GS.y=Y;GS.prevGY=Y;GS.gy=Y;GS.pitch=GS.roll=GS.dp=GS.dr=0;GS.onFoot=0;man.visible=false;car.visible=false;camAng=0;toast(job==='harvest'?'COMBINE READY: LOWER THE HEADER AND DRIVE INTO RIPE CROP':job==='plough'?'LOWER THE PLOUGH AND DRIVE UP STUBBLE':'LOWER THE SEEDER AND DRIVE OVER PLOUGHED SOIL')})}
function exitJob(){if(!FM.on||busy)return;fade(()=>{FM.on=0;FM.unl=0;hideVeh();GS.x=CS.x;GS.z=CS.z;GS.psi=CS.psi;GS.y=CS.y;GS.vx=GS.vz=GS.vy=0;GS.vf=0;GS.speed=0;GS.steer=0;GS.prevGY=GS.y;GS.pitch=GS.roll=0;GS.onFoot=1;car.visible=true;man.visible=true;const p=Wd(-36,-190);P.x=p[0];P.z=p[1];P.y=Y+.02;P.psi=0;P.speed=0;camAng=0;hud.style.display=mm.style.display='none';FM.bc.visible=false;setLabels()})}
function hideVeh(){CBG.visible=false;PL.visible=false;SD.visible=false}
function vStep(dt){const T=VT[FM.kind],fx=Math.sin(GS.psi),fz=Math.cos(GS.psi);let vf=GS.vf||0;
 const gas=(inp.gas||keys.up)&&FD.fuel>0,brk=inp.brk||keys.down,vm=(FM.low?T.vw:T.vmax)*speedK();let tg=0;
 if(gas)tg=vm;else if(brk)tg=vf>.4?0:-3;if(FM.msg==='full'&&FM.job==='harvest'&&FM.low){}
 const d=tg-vf;vf+=clamp(d,-(tg<vf?T.dec:T.acc)*dt*(brk&&vf>0?1.6:1),T.acc*dt);if(!gas&&!brk)vf-=vf*.9*dt;
 const sTg=clamp((keys.left?1:0)-(keys.right?1:0)+inp.pad,-1,1);GS.steer+=(sTg-GS.steer)*Math.min(1,dt*5);
 GS.psi+=GS.steer*T.turn*clamp(vf/2.4,-1,1)*dt;
 if(FD.up.gps&&Math.abs(sTg)<.05&&Math.abs(vf)>1){const tgt=Math.round(GS.psi/(Math.PI/2))*Math.PI/2,da=tgt-GS.psi;if(Math.abs(da)<.32)GS.psi+=da*Math.min(1,dt*3)}
 let nx=GS.x+Math.sin(GS.psi)*vf*dt,nz=GS.z+Math.cos(GS.psi)*vf*dt;
 for(const c of FC){const dx=nx-c[0],dz=nz-c[1],rr=c[2]+T.r;if(Math.abs(dx)>rr||Math.abs(dz)>rr)continue;const dd=Math.hypot(dx,dz);if(dd<rr&&dd>.01){nx=c[0]+dx/dd*rr;nz=c[1]+dz/dd*rr;vf*=.6}}
 const u=nx-FX0,v=nz-FZ0;if(u<-114||u>114||v<-264||v>112){nx=FX0+clamp(u,-114,114);nz=FZ0+clamp(v,-264,112);vf*=.7}
 GS.x=nx;GS.z=nz;GS.y=Y;GS.gy=Y;GS.vy=0;GS.vf=vf;GS.vx=Math.sin(GS.psi)*vf;GS.vz=Math.cos(GS.psi)*vf;GS.speed=Math.abs(vf);GS.surf=1;
 const t=performance.now()/1000,rum=Math.min(1,Math.abs(vf)/5);GS.pitch+=(Math.sin(t*11)*.006*rum+(tg>vf?.018:tg<vf?-.02:0)-GS.pitch)*Math.min(1,dt*6);GS.roll+=(Math.sin(t*7.3)*.007*rum-GS.steer*vf*.004-GS.roll)*Math.min(1,dt*5);
 const working=FM.low&&vf>.35&&!(FM.job==='harvest'&&tankSum()>=FM.cap-.001);
 FD.fuel=Math.max(0,FD.fuel-dt*(.02+(Math.abs(vf)>.3?.07:0)+(working?.06:0))*(1-.2*FD.up.fu));if(FD.fuel<=0&&!FM.dry){FM.dry=1;toast('OUT OF DIESEL!')}if(FD.fuel>0)FM.dry=0;
 if(working)doWork(dt)}
{const s0=step;step=function(dt){if(FM.on){vStep(dt);return}s0(dt)}}
const tankSum=()=>FM.tank[0]+FM.tank[1]+FM.tank[2];
function say(t){if(performance.now()-FM.toastT>2600){FM.toastT=performance.now();toast(t)}}
function doWork(dt){const J=JB[FM.job],fx=Math.sin(GS.psi),fz=Math.cos(GS.psi),lx=Math.cos(GS.psi),lz=-Math.sin(GS.psi);let n=0,blocked=0,dsc=0;const touched=new Set();
 const wd=width(),nn=Math.max(2,Math.round(wd/1.35));for(let q=0;q<=nn;q++){const l=-wd/2+.3+q*(wd-.6)/nn,px=GS.x+fx*J.off+lx*l,pz=GS.z+fz*J.off+lz*l,hit=cellAt(px,pz);if(!hit)continue;const f=hit[0],i=hit[1],s=f.st[i];
  if(s!==J.from){if(s>J.from&&FM.job!=='harvest'&&s===3)blocked=1;if(FM.job==='harvest'&&s===2)blocked=2;continue}
  if(FM.job==='sow'){const cost=CR[FM.crop].seed;if(cash<cost){say('NO CASH FOR SEED');FM.low=0;break}cash-=cost;FD.seedSpent=(FD.seedSpent||0)+cost;f.cr[i]=FM.crop;f.age[i]=0}
  if(FM.job==='harvest'){const c=CR[f.cr[i]],y=c.y*(.92+rand()*.16)*Math.max(.5,1-.1*Math.max(0,f.age[i]-c.days));FM.tank[f.cr[i]]+=y;if(tankSum()>=FM.cap){FM.tank[f.cr[i]]-=tankSum()-FM.cap;say('GRAIN TANK FULL: UNLOAD AT THE SILO');FM.low=1}FD.made+=0}
  f.st[i]=J.to;setCell(f,i);touched.add(f);n++;FD.st.cells++;
  if(n<=2&&Math.random()<.6)puff(px,Y+.6,pz,-fx*2,-fz*2,FM.job==='harvest'?[.9,.8,.4]:[.45,.32,.2])}
 for(const f of touched)flushF(f);
 if(n&&FM.job==='sow'&&Math.random()<dt*3)beep(300,.03,'square',.015);
 if(blocked===1)say('THAT CROP IS READY: HARVEST IT, DON\'T PLOUGH IT');
 if(!n&&FM.job==='plough'&&blocked===0){}
 if(n){const left=remain(FM.job);if(left.field&&left.field.done&&!left.field.said){left.field.said=1;toast('FIELD '+(left.field.i+1)+' '+JB[FM.job].done+'!');beep(784,.12,'square',.05)}}}
function count(f,s){let n=0;for(let i=0;i<NC;i++)if(f.st[i]===s)n++;return n}
function remain(job){const J=JB[job];let best=null,bn=0,tot=0;for(const f of FL){if(f.locked)continue;const n=count(f,J.from);tot+=n;f.done=n===0;if(n>0){const d=Math.hypot(FX0+f.u0+48-GS.x,FZ0+f.v0+30-GS.z);if(!best||(n>bn*.2&&d<best.d)){best={f,d};bn=n}}}return{field:best?best.f:null,tot,n:best?count(best.f,J.from):0,all:FL.length*NC}}
/* ---------- per frame ---------- */
const hud=document.createElement('div');hud.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:rgba(18,28,14,.86);color:#ffe9a0;font:bold 13px monospace;padding:6px 12px;border-radius:8px;z-index:20;display:none;text-align:center;line-height:1.5;max-width:92vw';document.body.appendChild(hud);
const hL1=document.createElement('div'),hL2=document.createElement('div'),pk=document.createElement('button');hud.append(hL1,hL2,pk);pk.textContent='PARK UP';pk.style.cssText='font:bold 12px monospace;margin-top:4px;padding:5px 12px;border:2px solid #ffe9a0;border-radius:6px;background:#3a4a24;color:#fff;touch-action:manipulation';pk.onpointerdown=e=>{e.stopPropagation();exitJob()};
const mm=document.createElement('canvas');mm.width=96;mm.height=154;mm.style.cssText='position:fixed;left:8px;top:132px;width:72px;height:116px;z-index:19;border:2px solid #ffe9a0;border-radius:6px;background:#274a1e;display:none;pointer-events:none;opacity:.92';document.body.appendChild(mm);
function drawMap(){const c=mm.getContext('2d');c.fillStyle='#3a5a2a';c.fillRect(0,0,96,154);const sx=96/236,sz=154/382,X=u=>(u+118)*sx,Z=v=>(116-v)*sz;c.fillStyle='#8a7a5a';c.fillRect(X(-118),Z(-102),236*sx,160*sz);
 for(const f of FL){for(let iz=0;iz<NZ;iz+=2)for(let ix=0;ix<NX;ix+=2){const i=iz*NX+ix,s=f.st[i],col=f.locked?'#4a7a3a':s===0?'#b8a068':s===1?'#4a301c':s===2?(f.age[i]?'#5a9a2a':'#7a5a38'):'#e0c040';c.fillStyle=col;c.fillRect(X(f.u0+ix*CELL),Z(f.v0+(iz+2)*CELL),6*sx+.6,6*sz+.6)}}
 const px=X(GS.x-FX0),pz=Z(GS.z-FZ0),a=GS.psi;c.fillStyle='#ff3030';c.beginPath();c.moveTo(px+Math.sin(a)*6,pz-Math.cos(a)*6);c.lineTo(px+Math.sin(a+2.5)*4,pz-Math.cos(a+2.5)*4);c.lineTo(px+Math.sin(a-2.5)*4,pz-Math.cos(a-2.5)*4);c.fill();
 if(FM.hint){c.strokeStyle='#ffe14a';c.lineWidth=2;c.strokeRect(X(FM.hint.u0),Z(FM.hint.v0+NZ*CELL),NX*CELL*sx,NZ*CELL*sz)}}
{const u0=updCozy;updCozy=function(dt){u0(dt);const p=GS.onFoot?P:GS;if(!inFM(p.x,p.z)&&!FM.on){if(FM.g)FM.g.visible=false;for(const f of FL)if(f.im)f.im.visible=false;return}
 if(!FM.built)buildMap();if(FM.g)FM.g.visible=true;for(const f of FL)if(f.im)f.im.visible=true;
 if(FM.resume&&!GS.onFoot){const r=FM.resume;FM.resume=0;FM.on=1;FM.job=r[0];FM.crop=r[1];FM.kind=r[0]==='harvest'?'cb':'tr';CS.x=r[2];CS.z=r[3];CS.psi=r[4];CS.y=Y}else if(FM.resume)FM.resume=0;
 if(!FM.on){hud.style.display=mm.style.display='none';FM.bc.visible=false;return}
 const T=VT[FM.kind],tt=performance.now()/1000,sp=GS.vf||0;FM.cap=cap();const wsc=width()/6;PL.scale.x=SD.scale.x=hdr.scale.x=wsc;car.visible=false;man.visible=false;FM.lz+=((FM.low?1:0)-FM.lz)*Math.min(1,dt*3);
 if(FM.kind==='tr'){TRG.visible=true;TR.x=GS.x;TR.z=GS.z;TR.rot=GS.psi;TR.cl[0][0]=TR.cl[1][0]=-300;TR.cl[0][1]=TR.cl[1][1]=-300;TR.win=9;TRG.position.set(GS.x,Y,GS.z);TRG.rotation.set(GS.pitch,GS.psi,GS.roll,'YXZ');
  TR.spin+=sp*dt;TW.rl.rotation.x=TW.rr.rotation.x=TR.spin/.92;TW.fl.rotation.x=TW.fr.rotation.x=TR.spin/.55;TW.fl.rotation.y=TW.fr.rotation.y=GS.steer*.45;
  PL.visible=FM.job==='plough';SD.visible=FM.job==='sow';const im=FM.job==='plough'?PL:SD;im.position.y=(1-FM.lz)*.55;im.rotation.x=(1-FM.lz)*.28;if(FM.job==='sow'){seedRoll.rotation.x+=sp*dt/.4}}
 else{TRG.visible=false;CBG.visible=true;CBG.position.set(GS.x,Y,GS.z);CBG.rotation.set(GS.pitch,GS.psi,GS.roll,'YXZ');TR.spin+=sp*dt;TWH.fl.rotation.x=TWH.fr.rotation.x=TR.spin/1.2;TWH.rl.rotation.x=TWH.rr.rotation.x=TR.spin/.78;TWH.rl.rotation.y=TWH.rr.rotation.y=-GS.steer*.5;
  hdr.position.y=(1-FM.lz)*1.0;reel.rotation.x-=dt*(FM.low?(1.6+Math.abs(sp)*.5):.3);
  const hp=hopper(),dd=Math.hypot(hp[0]-GS.x,hp[1]-GS.z);if(FM.unl){FM.ut+=dt;const side=FM.side||1;const k=FM.ut<1.2?FM.ut/1.2:FM.ut>5.2?Math.max(0,1-(FM.ut-5.2)/1.2):1;aug.rotation.y=-Math.PI/2*k*side;
   if(FM.ut>1.2&&FM.ut<5.2){const q=Math.min(tankSum(),dt*(FM.tot0/4));let r=q;const rk0=rank();for(let c=0;c<3;c++){const m=Math.min(FM.tank[c],r);FM.tank[c]-=m;FD.grain[c]+=m;FD.st.tons+=m;r-=m}if(rank()>rk0)later('FARM RANK UP: '+RK[rank()][0]+'!'+(rank()===1?' CANOLA UNLOCKED':''),600);const ap=aug.localToWorld(new THREE.Vector3(0,-.3,-5.7));if(Math.random()<.7)puff(ap.x,ap.y-2,ap.z,0,0,[.9,.78,.3])}
   if(FM.ut>=6.4){FM.unl=0;FM.tank=[0,0,0];toast('TANK EMPTY: '+Object.keys(CR).map((_,i)=>CR[i].n+' '+FD.grain[i].toFixed(1)+'T').join('  '));beep(660,.1,'square',.05)}}else aug.rotation.y+= (0-aug.rotation.y)*Math.min(1,dt*4)}
 /* beacon, hud, map */
 const job=FM.job,r=remain(job);FM.hint=r.field;const bc=FM.bc;if(r.field){bc.visible=true;bc.position.set(FX0+r.field.u0+NX*CELL/2,Y+45,FZ0+r.field.v0+NZ*CELL/2);bc.material.opacity=.14+.08*Math.sin(tt*3)}else bc.visible=false;
 FM.hudT-=dt;if(FM.hudT<=0){FM.hudT=.2;hud.style.display='block';const nm=FM.kind==='tr'?'TRACTOR':'COMBINE';hL1.textContent=nm+' · '+JB[job].n+' '+(FM.low?'▼ DOWN':'▲ UP')+(job==='sow'?' · '+CR[FM.crop].n:'')+' · '+Math.round(Math.abs(sp)*3.6)+' KM/H · DIESEL '+Math.round(FD.fuel)+'%'+(FD.up.gps?' · GPS':'');
  hL2.textContent=(job==='harvest'?'TANK '+tankSum().toFixed(1)+'/'+FM.cap+' T · ':'')+(r.tot?r.tot+' CELLS LEFT'+(r.field?' · FIELD '+(r.field.i+1):''):'NOTHING TO '+({plough:'PLOUGH',sow:'SOW',harvest:'HARVEST'})[job]+' RIGHT NOW')+' · £'+Math.round(cash)+(FD.order?' · ORDER '+FD.order.q+'T '+CR[FD.order.c].n+' BY DAY '+FD.order.by:'');mm.style.display='block'}
 FM.mapT-=dt;if(FM.mapT<=0){FM.mapT=.4;drawMap()}}}
/* chase camera that sees over the implements */
{const u1=updateCam;updateCam=function(dt){u1(dt);if(!FM.on||GS.onFoot||GS.inside||menuOpen)return;const cb=FM.kind==='cb',d=(cb?16:12.5)+Math.abs(GS.vf||0)*.18,h=cb?7.2:6;let da=GS.psi-camAng;da=Math.atan2(Math.sin(da),Math.cos(da));
 const px=GS.x-Math.sin(camAng)*d,pz=GS.z-Math.cos(camAng)*d;cam.position.set(px,Y+h,pz);cam.lookAt(GS.x+Math.sin(camAng)*(cb?6:4),Y+(cb?2.2:1.2),GS.z+Math.cos(camAng)*(cb?6:4));if(Math.abs(cam.fov-58)>.1){cam.fov=58;fovNow=58;cam.updateProjectionMatrix()}skyG.position.copy(cam.position)}}
/* ---------- action button ---------- */
{const c0=ctx;ctx=function(){
 if(FM.on){const pp=pump(),dp=Math.hypot(pp[0]-GS.x,pp[1]-GS.z),hp=hopper(),dh=Math.hypot(hp[0]-GS.x,hp[1]-GS.z);
  if(FD.fuel<=0&&Math.abs(GS.vf||0)<.5)return{label:'CALL DIESEL TRUCK (£30)',fn:()=>{if(cash<30){toast('NEED £30');return}cash-=30;FD.fuel=35;toast('DIESEL DELIVERED')}};
  if(dp<9&&FD.fuel<98)return{label:'REFUEL (£'+Math.ceil((100-FD.fuel)*.5)+')',fn:()=>{const c=Math.ceil((100-FD.fuel)*.5);if(cash<c){toast('NEED £'+c);return}cash-=c;FD.fuel=100;beep(500,.12,'square',.05);toast('TANK FULL')}};
  if(FM.job==='harvest'&&dh<14&&tankSum()>.05&&!FM.unl)return{label:'UNLOAD GRAIN',fn:()=>{const cr=Math.hypot(hp[0]-GS.x,hp[1]-GS.z);FM.side=((hp[0]-GS.x)*Math.cos(GS.psi)-(hp[1]-GS.z)*Math.sin(GS.psi))>0?1:-1;FM.unl=1;FM.ut=0;FM.tot0=tankSum();FM.low=0;beep(420,.1,'sawtooth',.04)}};
  return{label:(FM.low?'RAISE ':'LOWER ')+JB[FM.job].n,fn:()=>{if(FM.unl)return;FM.low=FM.low?0:1;beep(FM.low?260:380,.08,'square',.05)}}}
 return c0()}}
/* ---------- on-foot spots: village signpost, farm office, silo, gate ---------- */
const VG=[-92,160.5];
{const pole=new THREE.Mesh(new THREE.BoxGeometry(.2,2.6,.2),new THREE.MeshBasicMaterial({color:0x6a4a28}));pole.position.set(VG[0],G0+1.3,VG[1]);scene.add(pole);
 const bd=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.8),new THREE.MeshBasicMaterial({map:txtTex(512,160,'#4a2e16','#ffe6a8','HOLT FARMLAND ➜',58),side:THREE.DoubleSide}));bd.position.set(VG[0],G0+2.3,VG[1]);bd.rotation.y=-Math.PI/2;scene.add(bd)}
function toFarm(){if(busy)return;fade(()=>{buildMap();const p=Wd(0,-238);P.x=p[0];P.z=p[1];P.y=Y+.02;P.psi=0;P.speed=0;camAng=0;GS.onFoot=GS.onFoot;toast(FD.first?'BACK AT THE FARMLAND':'HOLT FARMLAND: FIND THE FARM BOARD TO PICK A JOB');FD.first=1})}
function toVillage(){if(busy)return;fade(()=>{P.x=VG[0]+1.5;P.z=VG[1]+1.5;P.y=G0+.02;P.psi=Math.PI/2;P.speed=0;camAng=P.psi})}
{const g0=gardenNear;gardenNear=function(){const g=g0();if(!GS.onFoot||GS.inside||FM.on)return g;
 const spots=[[VG[0],VG[1],3.4,'DRIVE TO THE FARMLAND',toFarm]];if(inFM(P.x,P.z)){const b=board(),h=hopper(),gt=gate();spots.push([b[0],b[1],4,'FARM BOARD',()=>open(0)],[h[0],h[1]-4,6,'SELL GRAIN',()=>open(2)],[gt[0],gt[1],5,'RETURN TO THE VILLAGE',toVillage])}
 let best=g;for(const s of spots){const d=Math.hypot(P.x-s[0],P.z-s[1]);if(d<s[2]&&(!best||d*.5<best.d))best={d:d*.5,btn:{label:s[3],fn:s[4]}}}return best}}
/* ---------- the farm board overlay ---------- */
let OV=null;
function open(tab){if(OV||busy||FM.on)return;if(!FD.order)newOrder(1);busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:60;background:rgba(0,10,0,.74);font:bold 13px monospace;color:#fff;display:flex;align-items:center;justify-content:center';document.body.appendChild(ov);
 const pn=document.createElement('div');pn.style.cssText='width:min(94vw,600px);max-height:92vh;overflow:auto;background:#10180c;border:3px solid #c8a84a;box-shadow:4px 4px 0 #000;padding:10px;box-sizing:border-box';ov.appendChild(pn);pn.onpointerdown=e=>e.stopPropagation();
 OV={ov,pn,tab:tab||0,msg:''};OV.kd=e=>{if(e.key==='Escape')close()};addEventListener('keydown',OV.kd);draw()}
function close(){if(!OV)return;removeEventListener('keydown',OV.kd);OV.ov.remove();OV=null;busy=0}
const live=()=>FL.filter(f=>!f.locked);
function draw(){const pn=OV.pn;pn.textContent='';const el=(t,css,txt,par)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;(par||pn).appendChild(e);return e};
 const bt=(par,txt,on,fn,dis)=>{const b=el('button','font:bold 12px monospace;border:2px solid '+(on?'#c8a84a':'#556')+';border-radius:6px;color:#fff;background:'+(on?'#4a3a14':'#242820')+';padding:6px 9px;margin:2px;touch-action:manipulation;'+(dis?'opacity:.4;':''),txt,par);b.onclick=e=>{e.stopPropagation();if(!dis)fn()};return b};
 const card=()=>el('div','display:flex;justify-content:space-between;align-items:center;border:2px solid #2a3420;padding:7px;margin:4px 0;background:#161e10');
 const rk=rank(),nx=RK[rk+1];
 const hd=el('div','display:flex;justify-content:space-between;align-items:center;margin-bottom:6px');el('div','font-size:16px;color:#ffd878','HOLT FARMLAND  ·  DAY '+DAY,hd);bt(hd,'CLOSE',0,close);
 el('div','color:#bfe39a','CASH £'+Math.round(cash)+'  ·  DIESEL '+Math.round(FD.fuel)+'%  ·  '+RK[rk][0]+(nx?' ('+Math.round(FD.st.tons)+'/'+nx[1]+' T TO '+nx[0]+')':''));if(OV.msg)el('div','color:#ffd24a;margin:3px 0',OV.msg);
 const tb=el('div','margin:6px 0');['JOBS','FIELDS','GRAIN','SHOP','FARM'].forEach((t,i)=>bt(tb,t,OV.tab===i,()=>{OV.tab=i;OV.msg='';draw()}));
 const L=live(),pl=L.reduce((a,f)=>a+count(f,0),0),sw=L.reduce((a,f)=>a+count(f,1),0),hv=L.reduce((a,f)=>a+count(f,3),0),gr=L.reduce((a,f)=>a+count(f,2),0);
 if(OV.tab===0){
  const nxt=hv?'HARVEST THE RIPE CROP WITH THE COMBINE':sw?'SOW A CROP ON THE PLOUGHED GROUND':pl?'PLOUGH THE STUBBLE':gr?'CROPS ARE GROWING. SLEEP TO SKIP TO TOMORROW. IT RAINS SOMETIMES: RAIN SPEEDS THEM UP':'BUY SOME LAND IN THE SHOP';
  el('div','background:#2a3a14;border:2px solid #7a9a3a;padding:6px;margin-bottom:6px;color:#e8ffb0','NEXT: '+nxt);
  if(FD.order){const o=FD.order;el('div','background:#3a2a14;border:2px solid #c8a84a;padding:6px;margin-bottom:6px;color:#ffe0a0','MILL ORDER: '+o.q+' T '+CR[o.c].n+' BY DAY '+o.by+' → £'+o.pay+'  (DELIVER FROM THE GRAIN TAB)')}
  const row=(a,b,fn,dis)=>{const r=card(),Lf=el('div','',null,r);el('div','color:#fff;font-size:14px',a,Lf);el('div','font-size:11px;color:#a8b890',b,Lf);bt(r,'START',1,()=>{close();fn()},dis)};
  row('PLOUGH  (TRACTOR)',pl+' CELLS OF STUBBLE READY TO PLOUGH',()=>startJob('plough'),!pl);
  CR.forEach((c,i)=>row('SOW '+c.n+'  (TRACTOR)',(i===2&&rk<1?'NEEDS FARMHAND RANK (60 T HARVESTED)':sw+' PLOUGHED CELLS  ·  SEED £'+c.seed+'/CELL  ·  '+c.days+' DAYS TO GROW  ·  ≈£'+Math.round(c.y*c.price*NC)+' A FIELD'),()=>startJob('sow',i),!sw||(i===2&&rk<1)));
  row('HARVEST  (COMBINE)',hv+' RIPE CELLS  ·  TANK '+cap()+' T  ·  UNLOAD AT THE SILO'+(hv?'  ·  RIPE CROP LOSES YIELD IF LEFT':''),()=>startJob('harvest'),!hv);
  el('div','margin-top:8px;color:#a8b890;font-size:11px','STUBBLE → PLOUGH → SOW → GROW OVERNIGHT → COMBINE → SELL. DRIVE UP TO THE PUMP TO REFUEL. A GREY JOB HAS NOTHING TO DO YET.')}
 else if(OV.tab===1){FL.forEach(f=>{const r=el('div','border:2px solid #2a3420;padding:7px;margin:4px 0;background:#161e10');el('div','color:#fff;font-size:14px','FIELD '+(f.i+1)+(f.locked?'  ·  FOR SALE':''),r);if(f.locked){el('div','font-size:11px;color:#a8b890','BUY IT IN THE SHOP TAB',r);return}
   const n=[0,1,2,3].map(q=>count(f,q));let mx=0,od=0;for(let i=0;i<NC;i++){if(f.st[i]===2&&f.age[i]>0)mx=Math.max(mx,CR[f.cr[i]].days-f.age[i]);if(f.st[i]===3&&f.age[i]>CR[f.cr[i]].days)od++}
   el('div','font-size:11px;color:#a8b890','STUBBLE '+n[0]+'  ·  PLOUGHED '+n[1]+'  ·  GROWING '+n[2]+(mx?' (≈'+mx+' DAYS LEFT)':'')+'  ·  RIPE '+n[3]+(od?' ('+od+' OVERRIPE!)':''),r)})}
 else if(OV.tab===2){const o=FD.order;if(o){const have=FD.grain[o.c],r=card(),Lf=el('div','',null,r);el('div','color:#ffd878;font-size:14px','MILL ORDER: '+o.q+' T '+CR[o.c].n,Lf);el('div','font-size:11px;color:#c8b890','BY DAY '+o.by+'  ·  PAYS £'+o.pay+'  ·  YOU HAVE '+have.toFixed(1)+' T',Lf);
   bt(r,'DELIVER',1,()=>{FD.grain[o.c]-=o.q;cash+=o.pay;FD.st.earned+=o.pay;OV.msg='ORDER DELIVERED: +£'+o.pay;beep(988,.14,'square',.06);FD.order=null;newOrder();draw()},have<o.q)}
  CR.forEach((c,i)=>{const p=Math.round(c.price*FD.price[i]),r=card(),Lf=el('div','',null,r);el('div','color:#fff;font-size:14px',c.n+'  £'+p+'/T',Lf);el('div','font-size:11px;color:'+(FD.price[i]>1.1?'#40e060':FD.price[i]<.9?'#ff7070':'#a8b890'),'PRICE '+(FD.price[i]>1.1?'HIGH':FD.price[i]<.9?'LOW':'NORMAL')+'  ·  IN THE SILO '+FD.grain[i].toFixed(1)+' T',Lf);
   bt(r,'SELL £'+Math.round(FD.grain[i]*p),1,()=>{const t=Math.round(FD.grain[i]*p);cash+=t;FD.st.earned+=t;FD.grain[i]=0;OV.msg='SOLD '+c.n+' FOR £'+t;beep(880,.1,'square',.05);draw()},FD.grain[i]<.05)});
  el('div','margin-top:6px;color:#a8b890;font-size:11px','PRICES DRIFT EVERY DAY. MILL ORDERS PAY ABOUT 40% OVER MARKET. HOLD GRAIN UNTIL THE PRICE IS HIGH.')}
 else if(OV.tab===3){UP.forEach(u=>{const lv=FD.up[u[0]],mx=u[3].length,r=card(),Lf=el('div','',null,r);el('div','color:#fff;font-size:14px',u[1]+'  '+'■'.repeat(lv)+'□'.repeat(mx-lv),Lf);el('div','font-size:11px;color:#a8b890',u[2],Lf);
   if(lv>=mx)bt(r,'MAXED',0,()=>{},1);else{const p=u[3][lv];bt(r,'BUY £'+p,1,()=>{if(cash<p){OV.msg='NOT ENOUGH CASH';return draw()}cash-=p;FD.up[u[0]]++;OV.msg='BOUGHT '+u[1];beep(740,.12,'square',.05);draw()},cash<p)}});
  LAND.forEach((p,k)=>{const f=FL[4+k],r=card(),Lf=el('div','',null,r);el('div','color:#fff;font-size:14px','FIELD '+(5+k)+' (LAND)',Lf);el('div','font-size:11px;color:#a8b890','ANOTHER 96 × 60 M FIELD NORTH OF THE OTHERS',Lf);
   if(!f.locked)bt(r,'OWNED',0,()=>{},1);else bt(r,'BUY £'+p,1,()=>{if(cash<p){OV.msg='NOT ENOUGH CASH';return draw()}cash-=p;FD.land[k]=1;f.locked=0;if(f.sign){scene.remove(f.sign);f.sign=null}refresh(f);OV.msg='YOU BOUGHT FIELD '+(5+k)+'. IT IS STUBBLE, READY TO PLOUGH';beep(660,.12,'square',.05);draw()},cash<p)})}
 else{const ha=FD.st.cells*9/10000;[['HECTARES WORKED',ha.toFixed(2)+' HA'],['GRAIN HARVESTED',FD.st.tons.toFixed(1)+' T'],['FARM EARNINGS','£'+Math.round(FD.st.earned)],['WIDTH / TANK',width()+' M  ·  '+cap()+' T'],['RANK',RK[rk][0]]].forEach(a=>{const r=card();el('div','color:#a8b890',a[0],r);el('div','color:#fff',a[1],r)});
  el('div','margin-top:8px;color:#a8b890;font-size:11px','RANKS: GREENHORN → FARMHAND (60 T) → FARMER (200 T) → MASTER GROWER (500 T). FARMHAND UNLOCKS CANOLA AND BIGGER MILL ORDERS.')}}
window.FARM_SIM={FM,FD,FL,open,startJob,exitJob,toFarm,CR};
})();
