/* ===== COZY HARBOUR: a ferry office in the village runs to a harbour on a separate sea map. Buy and upgrade boats, sail out
   to fish shoals and haul nets, salvage crates, discover islands and run cargo contracts. Fuel is the catch. ===== */
(function(){
const Y=G0,L=G0+.9,TAU=Math.PI*2;
const HX=-1500,HZ=-1500;
const HB={boat:0,fuel:40,eng:0,net:0,son:0,own:[1,0,0,0],cur:0,hold:{},dem:{},ct:[],cargo:null,log:{},isl:{},hauled:0,earned:0,tr:-99,mm:0,on:0,net_:0,np:0};
const CS={x:0,z:0,psi:0};/* the car's parking spot while we sail */
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();const q=Object.assign({},HB);delete q.on;delete q.net_;delete q.np;o.hb=q;return o};cozyLoad=function(z){l0(z);if(z&&z.hb)Object.assign(HB,z.hb,{on:0,net_:0,np:0});if(HB.cur==null)HB.cur=0}}
/* ---------------- data */
const SP=[['mackerel','MACKEREL',6,0,380,5],['herring','HERRING',5,0,380,5],['cod','COD',14,260,700,4],['bass','SEA BASS',18,260,700,3],['tuna','BLUEFIN TUNA',55,520,900,2],['sword','SWORDFISH',120,680,900,1]];
const spOf=id=>SP.find(s=>s[0]===id);
const BT=[{n:'DINGHY',vmax:9,acc:3.2,turn:1.7,hold:12,tank:40,cap:2,price:0,col:0xdcdcd2,burn:.12},{n:'FISHING BOAT',vmax:13,acc:3.8,turn:1.25,hold:40,tank:90,cap:4,price:900,col:0x2a5a98,burn:.16},{n:'RIB RUNNER',vmax:24,acc:7.5,turn:2.1,hold:16,tank:70,cap:2,price:2200,col:0xd03030,burn:.32},{n:'TRAWLER',vmax:11,acc:2.5,turn:.95,hold:120,tank:220,cap:7,price:3600,col:0x2a7a4a,burn:.2}];
const ENGP=[200,500,1100],NETP=[300,800],SONP=[250,700],FUELP=.8;
const ISL=[{n:'LIGHTHOUSE ISLE',u:-170,v:-300,r:32,k:'light',rw:150},{n:'SANDBAR',u:250,v:-220,r:28,rw:120},{n:'PALM COVE',u:-400,v:-470,r:38,rw:200},{n:'SKULL ROCK',u:420,v:-540,r:26,k:'tr',rw:250},{n:'THE WRECK',u:90,v:-690,r:20,k:'wreck',rw:300},{n:'FAR REEF',u:-300,v:-790,r:30,rw:400}];
const inHb=(x,z)=>{const u=x-HX,v=z-HZ;return u>-900&&u<900&&v>-900&&v<150};
const JT=[-50,0,50];
const landAt=(u,v)=>{if(u>-92&&u<92&&v>0&&v<86)return 1;for(const j of JT)if(Math.abs(u-j)<2.7&&v<=0&&v>-42)return 1;return 0};
{const h0=hAt;hAt=function(x,z){if(inHb(x,z)){return landAt(x-HX,z-HZ)?L:-3}return h0(x,z)}}
const W=(u,v)=>[HX+u,HZ+v];
const BERTH=[5.8,-21],ARR=[0,40];
/* ---------------- helpers */
const cvx=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;return t};
const rmc={};const rm=hex=>{if(rmc[hex])return rmc[hex];const c=new THREE.Color(hex),m=wmat([c.r,c.g,c.b],{vertexColors:false});m.color.copy(c);return rmc[hex]=m};
const near=(u,v,r)=>{const p=GS.onFoot?P:GS;return Math.hypot(p.x-HX-u,p.z-HZ-v)<r};
function mkBoat(t){const T=BT[t],g=new THREE.Group(),bx=(w,h,d,x,y,z,m,ry)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);q.position.set(x,y,z);if(ry)q.rotation.y=ry;g.add(q);return q};
 const hull=rm(T.col),wh=rm(0xf4f4f0),dk=rm(0x22262c),wd=rm(0x8a5a2a);
 if(t===0){bx(1.7,.6,4.2,0,.35,0,hull);bx(1.1,.5,1.2,0,.45,2.4,hull).rotation.x=.0;bx(1.5,.1,3.6,0,.68,-.2,wd);bx(.2,.5,.2,0,.9,-1.7,dk);bx(.5,.7,.5,0,.5,-2.3,dk)}
 else if(t===1){bx(2.6,.9,6.6,0,.5,0,hull);bx(1.7,.8,2.2,0,1.3,3.7,hull);bx(1.9,1.3,2.0,0,1.5,-.6,wh);bx(2.0,.15,2.2,0,2.2,-.6,dk);bx(.15,2.2,.15,0,2.6,-1.4,dk);bx(2.4,.1,2.6,0,.95,-3,wd);bx(.7,.6,.7,0,.6,-3.5,dk)}
 else if(t===2){bx(2.3,.55,6.2,0,.4,0,hull);bx(1.4,.45,2,0,.5,3.5,hull);bx(1.6,.5,1.5,0,.9,-.4,dk);bx(1.4,.08,1.3,0,1.2,-.4,wh);bx(1.9,.3,.5,0,.7,-2.9,dk);for(const s of[-1,1])bx(.35,.5,5.4,s*1.2,.55,.1,wh)}
 else{bx(3.6,1.2,9.4,0,.7,0,hull);bx(2.3,1.0,3,0,1.9,4,hull);bx(2.6,1.8,2.8,0,2.0,-1.2,wh);bx(2.8,.2,3,0,3.0,-1.2,dk);bx(.2,4.2,.2,0,4.6,0,dk);bx(.2,.2,3.4,0,5.8,-.6,dk).rotation.y=.0;bx(3.2,.18,3.6,0,1.3,-4,wd);bx(.2,3,.2,-1.4,3.2,-4.3,dk);bx(.2,3,.2,1.4,3.2,-4.3,dk);bx(3,.2,.2,0,4.7,-4.3,dk)}
 return g}
/* ---------------- build the harbour (lazily) */
let built=0,seaTex=null,boatM=null,shoals=[],crates=[],extra=[];
function buildHarbour(){if(built)return;built=1;const g=new THREE.Group();scene.add(g);const Bo=new Builder(3),pb=(u,y,v,sx,sy,sz,col,rot)=>{const p=W(u,v);pbox(Bo,p[0],y,p[1],sx,sy,sz,col,rot||0)},pc=(u,y,v,r,h,sg,col)=>{const p=W(u,v);pcyl(Bo,p[0],y,p[1],r,h,sg,col)};
 /* sea */
 seaTex=cvx(256,256,(c,w,h)=>{c.fillStyle='#fff';c.fillRect(0,0,w,h);let s=11;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<260;i++){const a=.1+r()*.22;c.fillStyle='rgba(120,170,200,'+a+')';c.fillRect(r()*w,r()*h,6+r()*22,2+r()*3)}});seaTex.wrapS=seaTex.wrapT=THREE.RepeatWrapping;seaTex.repeat.set(160,160);
 const seaM=wmat([.16,.42,.58],{vertexColors:false,transparent:true,opacity:.96,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4},seaTex);seaM.color.setRGB(.16,.42,.58);const sea=new THREE.Mesh(new THREE.PlaneGeometry(1800,1800).rotateX(-Math.PI/2),seaM);sea.position.set(HX,G0-.02,HZ-400);g.add(sea);
 /* quay + jetties */
 pb(0,G0-.2,43,184,1.1,86,[.62,.62,.6]);pb(0,L,0,184,.25,1.2,[.4,.4,.42]);
 for(const j of JT){pb(j,G0-.2,-21,5.4,1.1,42,[.5,.34,.18]);for(let k=0;k<8;k++)pb(j,L+.03,-k*5.2-2,5.4,.04,.15,[.3,.2,.1]);for(let k=0;k<8;k++){for(const s of[-1,1])pc(j+s*2.5,L,-k*5.4-1,.16,.8,6,[.25,.17,.1])}}
 /* hills + backdrop */
 for(let i=0;i<9;i++){const u=-150+i*37,h=14+((i*7)%5)*5;const p=W(u,150+((i*3)%4)*8);pcone(Bo,p[0],G0-.5,p[1],38,h,8,[.17+i%3*.03,.42,.18],0)}
 /* fish market (stalls + awning) */
 for(let k=0;k<3;k++){pb(-40+k*7,L,14,5.6,1.0,2.2,[.55,.38,.2]);for(const s of[-1,1])pb(-40+k*7+s*2.7,L,12.4,.2,3.2,.2,[.9,.9,.9]);pb(-40+k*7,L+3.2,13,6,.15,3.4,k%2?[.85,.12,.14]:[.95,.95,.95]);for(let q=0;q<3;q++)pb(-40+k*7-1.6+q*1.6,L+1.0,14,1.2,.25,.8,[.6,.7,.8])}
 /* chandlery shed */
 pb(40,L,16,10,4,7,[.18,.3,.5]);pb(40,L+4,16,11,.5,8,[.12,.12,.16]);pb(40,L,11.4,2,2.6,.3,[.1,.1,.12]);for(let k=0;k<4;k++)pc(30+k*1.5,L,8,.5,1.1,8,[.3,.3,.34]);
 /* harbour master hut + board */
 pb(0,L,27,12,3.6,7,[.95,.95,.9]);pb(0,L+3.6,27,13,.5,8,[.8,.12,.14]);pb(0,L+4.1,27,6,2.2,5,[.95,.95,.9]);pb(0,L+6.3,27,6.6,.3,5.6,[.12,.12,.16]);pb(0,L+2.2,23.4,3.2,.2,.3,[.1,.1,.12]);
 pb(0,L,19,3.4,2.4,.25,[.5,.34,.18]);
 /* crates, barrels, bollards, nets, crane */
 for(let i=0;i<14;i++){const u=-80+((i*53)%160),v=2.8+((i*17)%5);if(Math.abs(u)<9)continue;pb(u,L,v,1.2,1.1,1.2,i%2?[.62,.44,.22]:[.46,.5,.56],i*.4)}
 for(let i=0;i<9;i++){pc(-84+i*21,L,2.2,.5,.9,8,[.2,.5,.66])}
 for(let i=0;i<10;i++)pc(-90+i*20,L,.3,.22,.5,6,[.12,.12,.14]);
 pb(70,L,6,1,9,1,[.9,.7,.15]);pb(70,L+9,3,1,.7,8,[.9,.7,.15]);pb(70,L+8.6,-.5,.14,3.8,.14,[.1,.1,.1]);
 /* lighthouse + islands */
 for(const I of ISL){const p=W(I.u,I.v);pcyl(Bo,p[0],G0-.7,p[1],I.r,1.6,16,[.84,.78,.54]);pcyl(Bo,p[0],G0+.9,p[1],I.r*.8,.35,14,[.44,.58,.26]);
  let s=Math.abs(I.u*13+I.v)|0;const rr=()=>(s=(s*16807+1)%2147483647)/2147483647;
  for(let k=0;k<(I.k==='light'?3:7);k++){const a=rr()*TAU,d=rr()*I.r*.55,x=p[0]+Math.cos(a)*d,z=p[1]+Math.sin(a)*d;if(rr()<.6){pcyl(Bo,x,G0+1.1,z,.14,3.2,5,[.4,.28,.18]);pcone(Bo,x,G0+3.4,z,1.5,1.2,6,[.14,.5,.2],0)}else pbox(Bo,x,G0+1,z,1.4,1+rr(),1.2,[.5,.5,.54],rr()*3)}
  if(I.k==='light'){for(let k=0;k<4;k++)pcyl(Bo,p[0],G0+1+k*3.2,p[1],2.4-k*.2,3.2,10,k%2?[.8,.1,.12]:[.95,.95,.95]);pcyl(Bo,p[0],G0+13.8,p[1],1.9,.3,10,[.1,.1,.12]);const lamp=new THREE.Mesh(new THREE.SphereGeometry(1.2,10,8),new THREE.MeshBasicMaterial({color:0xfff2a0,fog:false}));lamp.position.set(p[0],G0+15.2,p[1]);g.add(lamp);pcone(Bo,p[0],G0+16.2,p[1],1.8,1.6,10,[.7,.1,.12],0)}
  if(I.k==='wreck'){pbox(Bo,p[0],G0+.9,p[1],3,2.4,12,[.3,.2,.12],.5);pbox(Bo,p[0]+3,G0+.9,p[1]-2,.4,7,.4,[.25,.17,.1],0)}
  if(I.k==='tr'){pbox(Bo,p[0]+4,G0+1,p[1],1.8,1,1.2,[.55,.38,.12],.3);pbox(Bo,p[0]+4,G0+2,p[1],1.9,.3,1.3,[.85,.7,.15],.3)}
  const sg=new THREE.Mesh(new THREE.PlaneGeometry(14,2.2),new THREE.MeshBasicMaterial({map:cvx(512,80,(c,w,h)=>{c.fillStyle='#10202c';c.fillRect(0,0,w,h);c.fillStyle='#e8d890';c.font='bold 34px monospace';c.textAlign='center';c.fillText(I.n,w/2,52)}),side:THREE.DoubleSide,fog:false}));sg.position.set(p[0],G0+(I.k==='light'?20:9),p[1]);sg.userData.bb=1;g.add(sg);extra.push(sg)}
 /* signs on the quay */
 const sgn=(t,bg,fg,u,y,v,wd,ht,sz)=>{const p=W(u,v),m=new THREE.Mesh(new THREE.PlaneGeometry(wd,ht),new THREE.MeshBasicMaterial({map:txtTex(512,Math.round(512*ht/wd),bg,fg,t,sz),side:THREE.DoubleSide}));m.position.set(p[0],y,p[1]);g.add(m);return m};
 sgn('FISH MARKET','#b01818','#ffffff',-33,L+4.4,15.7,12,1.6,48);sgn('CHANDLERY','#12284a','#ffd24a',40,L+4.9,11.6,9,1.4,44);sgn('HARBOUR MASTER','#14141a','#e8d890',0,L+3.0,23.2,10,1.3,40);sgn('COZY HARBOUR','#0d2a3c','#ffd24a',0,L+6.6,23.2,6.4,1,36);
 sgn('FERRY TO VILLAGE','#0d2a3c','#9fe',-75,L+3.2,26,6,.9,34);{const p=W(-75,26);pb(-75,L,26,.4,3,.4,[.3,.2,.1])}
 sgn('JOB BOARD','#5a3a1a','#fff',0,L+2.9,18.5,3.2,.7,32);
 /* collision: market stalls, shed, hut, crates */
 for(const[u,v,r]of[[-40,14,2.6],[-33,14,2.6],[-26,14,2.6],[40,16,5],[34,16,2.5],[46,16,2.5],[0,27,5.5],[-6,27,2],[6,27,2],[-75,26,.9],[70,6,.9],[0,19,1.6]]){const p=W(u,v);COL.push([p[0],p[1],r])}
 /* shoals visuals made on demand; moored boats */
 for(const[j,t]of[[-50,1],[50,3]]){const m=mkBoat(t),p=W(j+5.8,-24);m.position.set(p[0],G0+.05,p[1]);m.rotation.y=Math.PI;g.add(m);extra.push(m)}
 boatM=mkBoat(HB.cur);
 {const p=W(BERTH[0],BERTH[1]);boatM.position.set(p[0],G0+.05,p[1]);boatM.rotation.y=Math.PI}g.add(boatM);
 g.add(Bo.mesh(mObj));T_g=g;newShoals();newCrates()}
let T_g=null,boatTier=-1;
function setBoatModel(){if(!boatM)return;if(boatTier===HB.cur)return;boatTier=HB.cur;const p=boatM.position.clone(),r=boatM.rotation.y;T_g.remove(boatM);boatM=mkBoat(HB.cur);boatM.position.copy(p);boatM.rotation.y=r;T_g.add(boatM)}
/* ---------------- shoals + salvage crates */
const rnd2=(a,b)=>a+Math.random()*(b-a);
function pickSp(d){const c=SP.filter(s=>d>=s[3]&&d<=s[4]),tot=c.reduce((a,s)=>a+s[5],0);let r=Math.random()*tot;for(const s of c){r-=s[5];if(r<=0)return s}return c[0]}
function farFromIsl(u,v,m){for(const I of ISL)if(Math.hypot(u-I.u,v-I.v)<I.r+m)return false;return true}
function newShoals(){for(const s of shoals)s.g.parent&&s.g.parent.remove(s.g);shoals=[];
 for(let n=0,t=0;n<13&&t<300;t++){const d=rnd2(110,820),a=rnd2(-1.25,1.25),u=BERTH[0]+d*Math.sin(a),v=BERTH[1]-d*Math.cos(a);if(v<-860||Math.abs(u)>850||!farFromIsl(u,v,30))continue;const sp=pickSp(d),left=sp[0]==='sword'?2+(Math.random()*3|0):sp[0]==='tuna'?4+(Math.random()*5|0):6+(Math.random()*8|0),r=rnd2(15,22);
  const g=new THREE.Group(),ring=new THREE.Mesh(new THREE.RingGeometry(r*.8,r*.9,32).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0xd8f4ff,transparent:true,opacity:.5}));ring.position.y=.06;g.add(ring);
  const fs=[];for(let k=0;k<9;k++){const f=new THREE.Mesh(new THREE.BoxGeometry(.28,.2,.9),new THREE.MeshBasicMaterial({color:sp[0]==='tuna'?0x1a2a4a:sp[0]==='sword'?0x3a3a5a:0x3a5a6a}));g.add(f);fs.push(f)}
  const p=W(u,v);g.position.set(p[0],G0-.02,p[1]);T_g.add(g);shoals.push({u,v,x:p[0],z:p[1],sp,left,r,g,ring,fs,ph:Math.random()*6});n++}}
function newCrates(){for(const c of crates)c.m.parent&&c.m.parent.remove(c.m);crates=[];for(let n=0,t=0;n<9&&t<200;t++){const d=rnd2(90,760),a=rnd2(-1.3,1.3),u=BERTH[0]+d*Math.sin(a),v=BERTH[1]-d*Math.cos(a);if(v<-860||Math.abs(u)>850||!farFromIsl(u,v,12))continue;
  const m=new THREE.Group(),b=new THREE.Mesh(new THREE.BoxGeometry(1.1,.9,1.1),rm(0xd8781c)),s=new THREE.Mesh(new THREE.BoxGeometry(.3,.3,.3),new THREE.MeshBasicMaterial({color:0xfff0a0}));s.position.y=1.4;m.add(b,s);const p=W(u,v);m.position.set(p[0],G0,p[1]);T_g.add(m);crates.push({u,v,x:p[0],z:p[1],m,ph:Math.random()*6})}}
/* ---------------- market, contracts, day cycle */
function newDemand(){for(const s of SP)HB.dem[s[0]]=Math.round((.75+Math.random()*.7)*100)/100}
function newContracts(){HB.ct=[];const o=SP.slice(0,4),s1=o[Math.random()*o.length|0],n=3+(Math.random()*5|0);HB.ct.push({k:'fish',sp:s1[0],n,r:Math.round(s1[2]*n*1.8)});
 const I=ISL[1+(Math.random()*(ISL.length-1)|0)],d=Math.hypot(I.u-BERTH[0],I.v-BERTH[1]);HB.ct.push({k:'cargo',isl:ISL.indexOf(I),r:Math.round(60+d*.32),t:Math.round(d/9*1.5+50)});
 const s3=Math.random()<.6?SP[4]:SP[5];HB.ct.push({k:'fish',sp:s3[0],n:1+(s3[0]==='tuna'?Math.random()*2|0:0),r:Math.round(s3[2]*3.2*(s3[0]==='tuna'?1:1))});for(const c of HB.ct)if(c.k==='fish'&&c.sp===s3[0]&&c.r!==undefined)c.r=Math.round(c.r*c.n)}
newDemand();newContracts();
{const n0=newDay;newDay=function(){const r=n0.apply(this,arguments);newDemand();newContracts();if(built){newShoals();newCrates()}return r}}
const holdN=()=>Object.values(HB.hold).reduce((a,b)=>a+b,0),holdCap=()=>BT[HB.cur].hold,tankCap=()=>BT[HB.cur].tank,vmax=()=>BT[HB.cur].vmax*(1+.12*HB.eng)*(HB.cargo?.9:1),netCap=()=>BT[HB.cur].cap+2*HB.net;
const price=id=>Math.max(1,Math.round(spOf(id)[2]*(HB.dem[id]||1)*10)/10);
function addCatch(id,n){HB.hold[id]=(HB.hold[id]|0)+n;HB.hauled+=n;const first=!HB.log[id];HB.log[id]=(HB.log[id]|0)+n;if(first){const b=spOf(id)[2]*5;cash+=b;HB.earned+=b;setTimeout(()=>toast('FIRST '+spOf(id)[1]+'! LOG BONUS £'+b),900)}}
/* ---------------- hud */
const css='position:fixed;left:50%;transform:translateX(-50%);z-index:26;font:bold 13px monospace;color:#fff;text-align:center;pointer-events:none;display:none;';
const hud=document.createElement('div');hud.style.cssText=css+'top:84px;padding:5px 10px;background:rgba(0,10,30,.78);border:2px solid #7ad;white-space:nowrap';
const bar=document.createElement('div');bar.style.cssText=css+'top:70%;width:180px;height:14px;background:rgba(0,0,0,.6);border:2px solid #fff;padding:0';const barI=document.createElement('div');barI.style.cssText='height:100%;width:0;background:#4cf';bar.appendChild(barI);
const arr=document.createElement('div');arr.style.cssText='position:fixed;left:50%;top:128px;margin-left:-60px;z-index:26;font:bold 12px monospace;color:#9fe;text-align:center;width:120px;pointer-events:none;display:none';
[hud,bar,arr].forEach(e=>document.body.appendChild(e));
/* ---------------- boat physics */
function boardBoat(){if(HB.boat||busy)return;fade(()=>{CS.x=GS.x;CS.z=GS.z;CS.psi=GS.psi;CS.onFoot=GS.onFoot;buildHarbour();setBoatModel();HB.boat=1;GS.onFoot=0;man.visible=false;car.visible=false;const p=W(BERTH[0],BERTH[1]);GS.x=p[0];GS.z=p[1];GS.psi=Math.PI;GS.vx=GS.vz=GS.vy=0;GS.vf=0;GS.speed=0;GS.steer=0;GS.y=G0+.05;GS.prevGY=GS.y;GS.pitch=GS.roll=GS.dp=GS.dr=0;camAng=GS.psi;HB.fuel=Math.min(HB.fuel,tankCap());toast('CAST OFF!')})}
function moor(){fade(()=>{HB.boat=0;HB.net_=0;HB.np=0;setBoatModel();const p=W(BERTH[0],BERTH[1]);boatM.position.set(p[0],G0+.05,p[1]);boatM.rotation.set(0,Math.PI,0);car.visible=true;man.visible=true;GS.x=CS.x;GS.z=CS.z;GS.psi=CS.psi;GS.vx=GS.vz=GS.vy=0;GS.vf=0;GS.speed=0;GS.steer=0;GS.y=gH(GS.x,GS.z)+.1;GS.prevGY=GS.y;GS.pitch=GS.roll=GS.dp=GS.dr=0;GS.onFoot=1;const q=W(0,-16);P.x=q[0];P.z=q[1];P.y=gH(P.x,P.z)+.02;P.psi=-Math.PI/2*0+Math.PI;P.speed=0;camAng=P.psi;hud.style.display=bar.style.display=arr.style.display='none'})}
function boatStep(dt){const T=BT[HB.cur],fx=Math.sin(GS.psi),fz=Math.cos(GS.psi),lx=Math.cos(GS.psi),lz=-Math.sin(GS.psi);let vf=GS.vx*fx+GS.vz*fz,vl=GS.vx*lx+GS.vz*lz;
 const gas=(inp.gas||keys.up)&&HB.fuel>0,brk=inp.brk||keys.down,vm=vmax();let acc=0;
 if(gas)acc=T.acc*(1+.1*HB.eng)*Math.max(0,1-vf/vm)*1.5;if(brk)acc=vf>.5?-T.acc*2.2:-T.acc*.8;
 vf+=acc*dt;vf-=vf*.35*dt;if(!gas&&!brk)vf-=vf*.45*dt;vl*=Math.exp(-2.4*dt);
 const tgt=clamp((keys.left?1:0)-(keys.right?1:0)+inp.pad,-1,1);GS.steer+=(tgt-GS.steer)*Math.min(1,dt*6);
 GS.psi+=GS.steer*T.turn*clamp(vf/3,-1,1)*dt;
 if(gas)HB.fuel=Math.max(0,HB.fuel-T.burn*(.3+.7*vf/vm)*dt*(1+.1*HB.eng));
 GS.vx=fx*vf+lx*vl;GS.vz=fz*vf+lz*vl;let nx=GS.x+GS.vx*dt,nz=GS.z+GS.vz*dt;
 let u=nx-HX,v=nz-HZ;const bump=()=>{GS.vx*=-.3;GS.vz*=-.3;vf*=-.3;impact=Math.max(impact,5)};
 if(v>-1.6&&Math.abs(u)<95){v=-1.6;bump()}
 for(const j of JT)if(Math.abs(u-j)<4.6&&v>-43.5){u+=(u<j?-1:1)*(4.6-Math.abs(u-j))+0;bump()}
 for(const I of ISL){const dx=u-I.u,dz=v-I.v,dd=Math.hypot(dx,dz),rr=I.r+3.2;if(dd<rr){u=I.u+dx/dd*rr;v=I.v+dz/dd*rr;bump()}}
 if(u<-860||u>860||v<-860||v>40){u=clamp(u,-860,860);v=clamp(v,-860,40);bump()}
 GS.x=HX+u;GS.z=HZ+v;const t=performance.now()/1000,bob=Math.sin(t*1.7+GS.x*.05)*.08+Math.sin(t*2.6+GS.z*.07)*.05;
 GS.y=G0+.06+bob;GS.gy=GS.y;GS.vy=0;GS.pitch+=(-vf*.004+Math.sin(t*1.3)*.012-GS.pitch)*Math.min(1,dt*4);GS.roll+=(clamp(GS.steer*vf*.012,-.2,.2)+Math.sin(t*1.1)*.015-GS.roll)*Math.min(1,dt*4);
 GS.speed=Math.hypot(GS.vx,GS.vz);GS.vf=vf;GS.surf=0;GS.acc=acc;GS.slip=Math.abs(vl);
 if(GS.speed>3&&Math.random()<dt*40){for(const s of[-1,1])puff(GS.x-fx*2.4+lx*.8*s,GS.y+.1,GS.z-fz*2.4+lz*.8*s,-GS.vx*.2,-GS.vz*.2,[.92,.96,1])}}
{const step0=step;step=function(dt){if(HB.boat){boatStep(dt);return}step0(dt)}}
/* ---------------- per frame: boat model, shoals, nets, crates, islands, contracts, hud */
function unloadTo(){}
let tt=0,hudT=0;
{const u0=updCozy;updCozy=function(dt){u0(dt);const p=GS.onFoot?P:GS;if(!built||!inHb(p.x,p.z)){if(HB.boat&&!inHb(GS.x,GS.z))HB.boat=0;hud.style.display=bar.style.display=arr.style.display='none';return}
 tt+=dt;const t=performance.now()/1000;
 if(!HB.boat&&!GS.onFoot&&!GS.inside&&inHb(GS.x,GS.z)){HB.boat=1;car.visible=false;man.visible=false}/* resumed from a save while sailing */
 setBoatModel();
 if(HB.boat){boatM.position.set(GS.x,GS.y,GS.z);boatM.rotation.set(GS.pitch,GS.psi,GS.roll,'YXZ');boatM.visible=true;car.visible=false;man.visible=false}
 else{const q=W(BERTH[0],BERTH[1]);boatM.position.set(q[0],G0+.05+Math.sin(t*1.5)*.05,q[1]);boatM.rotation.set(0,Math.PI,Math.sin(t*1.2)*.02)}
 for(const s of extra)if(s.userData.bb)s.rotation.y=Math.atan2(cam.position.x-s.position.x,cam.position.z-s.position.z);
 seaTex.offset.set(t*.004,t*.003);
 const dp=HB.boat?GS:P,sonR=[160,420,900][HB.son];
 for(const s of shoals){const d=Math.hypot(dp.x-s.x,dp.z-s.z);const vis=d<sonR&&s.left>0;s.g.visible=vis;if(vis){s.ring.material.opacity=.3+.2*Math.sin(t*3+s.ph);s.ring.scale.setScalar(1+.04*Math.sin(t*2+s.ph));s.fs.forEach((f,i)=>{const a=t*(.6+i*.03)+i*.7+s.ph,rr=s.r*(.2+.55*((i*37)%10)/10);f.position.set(Math.cos(a)*rr,.1+Math.max(0,Math.sin(t*2.2+i))*.5*(i%3===0),Math.sin(a)*rr);f.rotation.y=-a+Math.PI/2})}}
 for(const c of crates){c.m.position.y=G0+.05+Math.sin(t*1.8+c.ph)*.12;c.m.rotation.y=t*.5+c.ph}
 if(!HB.boat){hud.style.display=bar.style.display=arr.style.display='none';return}
 /* nets */
 let inS=null;for(const s of shoals)if(s.left>0&&Math.hypot(GS.x-s.x,GS.z-s.z)<s.r){inS=s;break}
 if(HB.net_){if(inS&&GS.speed<7&&holdN()<holdCap()){HB.np+=dt/(4.4-.8*HB.net);if(HB.np>=1){HB.np=0;const n=Math.min(netCap()+(Math.random()<.5?1:0),inS.left,holdCap()-holdN());inS.left-=n;addCatch(inS.sp[0],n);toast('HAULED '+n+' '+inS.sp[1]+'  ('+holdN()+'/'+holdCap()+')');beep(740,.08,'square',.06);if(inS.left<=0)toast('SHOAL EMPTY');if(holdN()>=holdCap()){HB.net_=0;toast('HOLD FULL - HEAD BACK TO THE QUAY')}}}else HB.np=Math.max(0,HB.np-dt*.8);if(!inS&&HB.np<=0)HB.net_=0}else HB.np=0;
 /* crates */
 for(let i=crates.length-1;i>=0;i--){const c=crates[i];if(Math.hypot(GS.x-c.x,GS.z-c.z)<5){c.m.parent.remove(c.m);crates.splice(i,1);const r=Math.random();if(r<.5){const a=20+(Math.random()*100|0);cash+=a;HB.earned+=a;toast('SALVAGED CRATE: £'+a)}else if(r<.8){const f=Math.min(25,tankCap()-HB.fuel);HB.fuel+=f;toast('SALVAGED A FUEL CAN +'+Math.round(f)+' L')}else if(holdN()<holdCap()){addCatch('tuna',1);toast('A TUNA IN A CRATE OF ICE!')}else toast('CRATE WAS EMPTY');beep(900,.1,'square',.06)}}
 /* islands: discovery, cargo drop, treasure */
 ISL.forEach((I,i)=>{const d=Math.hypot(GS.x-HX-I.u,GS.z-HZ-I.v);if(d<I.r+45&&!HB.isl[i]){HB.isl[i]=1;cash+=I.rw;HB.earned+=I.rw;toast('DISCOVERED '+I.n+'!  +£'+I.rw);beep(660,.2,'square',.07);setTimeout(()=>beep(990,.25,'square',.07),180)}
  if(HB.cargo&&HB.cargo.isl===i&&d<I.r+16){cash+=HB.cargo.r;HB.earned+=HB.cargo.r;toast('CARGO DELIVERED TO '+I.n+'  +£'+HB.cargo.r);HB.cargo=null;beep(880,.2,'square',.07)}});
 if(HB.cargo){HB.cargo.t-=dt;if(HB.cargo.t<=0){toast('CARGO CONTRACT EXPIRED');HB.cargo=null}}
 /* hud */
 hudT-=dt;if(hudT<=0){hudT=.12;const kn=Math.round(GS.speed*1.94),T=BT[HB.cur];let tx=T.n+'  FUEL '+Math.round(HB.fuel)+'/'+tankCap()+' L  SPEED '+kn+' KN  HOLD '+holdN()+'/'+holdCap();if(HB.cargo){const I=ISL[HB.cargo.isl];tx+='\nCARGO > '+I.n+'  '+Math.round(Math.hypot(GS.x-HX-I.u,GS.z-HZ-I.v))+' M  '+Math.max(0,Math.round(HB.cargo.t))+' S'}hud.textContent=tx;hud.style.whiteSpace='pre';hud.style.display='block';
  let best=null,bd=1e9;for(const s of shoals)if(s.left>0&&HB.son>0){const d=Math.hypot(GS.x-s.x,GS.z-s.z);if(d<bd&&d<sonR+(HB.son>1?0:0)){bd=d;best=s}}
  if(best){const a=Math.atan2(best.x-GS.x,best.z-GS.z)-GS.psi;arr.innerHTML='SONAR: '+best.sp[1]+'<br><span style="font-size:22px;display:inline-block;transform:rotate('+(-a*180/Math.PI)+'deg)">&#9650;</span> '+Math.round(bd)+' M';arr.style.display='block'}else arr.style.display='none'}
 bar.style.display=HB.net_?'block':'none';barI.style.width=Math.round(HB.np*100)+'%'}}
/* ---------------- context button */
{const ctx0=ctx;ctx=function(){const p=GS.onFoot?P:GS;if(!built||!inHb(p.x,p.z)||GS.inside)return ctx0();
 if(HB.boat){const berth=Math.hypot(GS.x-HX-BERTH[0],GS.z-HZ-BERTH[1])<13;
  if(HB.fuel<=0&&GS.speed<1.5)return{label:'CALL COASTGUARD (-£60)',fn:()=>{if(cash<60){toast('NEED £60');return}cash-=60;fade(()=>{const q=W(BERTH[0]+6,BERTH[1]+4);GS.x=q[0];GS.z=q[1];GS.psi=Math.PI;GS.vx=GS.vz=0;HB.fuel=Math.min(10,tankCap());HB.net_=0;toast('TOWED HOME WITH 10 L')})}};
  let inS=null;for(const s of shoals)if(s.left>0&&Math.hypot(GS.x-s.x,GS.z-s.z)<s.r){inS=s;break}
  if(HB.net_)return{label:'RAISE NET',fn:()=>{HB.net_=0;HB.np=0}};
  if(inS)return holdN()>=holdCap()?{label:'HOLD FULL',fn:()=>toast('RETURN TO THE QUAY TO SELL')}:{label:'LOWER NET  ('+inS.sp[1]+' · '+inS.left+')',fn:()=>{if(GS.speed>7){toast('SLOW DOWN FIRST');return}HB.net_=1;HB.np=0;toast('NET DOWN - KEEP SLOW')}};
  if(berth&&GS.speed<4)return{label:'MOOR UP & GO ASHORE',fn:moor};return{label:'—',fn:null}}
 if(near(...BERTH,5))return{label:'BOARD YOUR '+BT[HB.cur].n,fn:boardBoat};
 if(near(-33,17,6))return{label:'FISH MARKET',fn:()=>open(0)};if(near(40,10,6))return{label:'CHANDLERY & FUEL',fn:()=>open(1)};if(near(0,18,3.5))return{label:'JOB BOARD',fn:()=>open(2)};
 if(near(-75,26,3.5))return{label:'FERRY BACK TO VILLAGE',fn:()=>ferry(0)};return ctx0()}}
function ferry(to){if(busy||HB.boat)return;fade(()=>{if(to){if(GS.inside)leaveShop(true);buildHarbour();setBoatModel();const q=W(ARR[0],ARR[1]);P.x=q[0];P.z=q[1];P.y=gH(P.x,P.z)+.02;P.psi=Math.PI;P.speed=0;camAng=P.psi;GS.onFoot=1;toast('WELCOME TO COZY HARBOUR')}else{GS.inside=0;P.x=DOORP[0];P.z=DOORP[1];P.y=gH(P.x,P.z)+.02;P.psi=ST_.rot;P.speed=0;camAng=P.psi;hud.style.display=bar.style.display=arr.style.display='none'}})}
/* ---------------- overlay */
let OV=null;
function open(tab){if(OV||busy)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:60;background:rgba(0,0,10,.7);font:bold 13px monospace;color:#fff;display:flex;align-items:center;justify-content:center';document.body.appendChild(ov);
 const pn=document.createElement('div');pn.style.cssText='width:min(94vw,580px);max-height:92vh;overflow:auto;background:#0a1620;border:3px solid #5ac;box-shadow:4px 4px 0 #000;padding:10px;box-sizing:border-box';ov.appendChild(pn);pn.onpointerdown=e=>e.stopPropagation();
 OV={ov,pn,tab:tab||0,msg:''};OV.kd=e=>{if(e.key==='Escape')close()};addEventListener('keydown',OV.kd);render()}
function close(){if(!OV)return;removeEventListener('keydown',OV.kd);OV.ov.remove();OV=null;busy=0}
function render(){const pn=OV.pn;pn.textContent='';const el=(t,css,txt,par)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;(par||pn).appendChild(e);return e};
 const bt=(par,txt,on,fn,dis)=>{const b=el('button','font:bold 12px monospace;border:2px solid '+(on?'#5ac':'#556')+';border-radius:6px;color:#fff;background:'+(on?'#1c3a5a':'#242838')+';padding:6px 9px;margin:2px;touch-action:manipulation;'+(dis?'opacity:.4;':''),txt,par);b.onclick=e=>{e.stopPropagation();fn()};return b};
 const hd=el('div','display:flex;justify-content:space-between;align-items:center;margin-bottom:6px');el('div','font-size:16px;color:#7cf','COZY HARBOUR',hd);bt(hd,'CLOSE',0,close);
 el('div','color:#9fe','CASH £'+Math.round(cash)+'  ·  '+BT[HB.cur].n+'  ·  FUEL '+Math.round(HB.fuel)+'/'+tankCap()+' L  ·  HOLD '+holdN()+'/'+holdCap());
 if(OV.msg)el('div','color:#ffd24a;margin:3px 0',OV.msg);
 const tb=el('div','margin:6px 0');['FISH MARKET','CHANDLERY','JOB BOARD','ANGLER LOG'].forEach((t,i)=>bt(tb,t,OV.tab===i,()=>{OV.tab=i;OV.msg='';render()}));
 const at=inHb((GS.onFoot?P:GS).x,(GS.onFoot?P:GS).z),msg=m=>{OV.msg=m;render()};
 if(OV.tab===0){if(!at)return el('div','color:#aab','VISIT THE HARBOUR TO TRADE.');el('div','color:#9ab;font-size:11px','TODAY\'S DEMAND CHANGES DAILY. EVERY FISH YOU SELL LOWERS ITS PRICE A LITTLE.');
  let tot=0;SP.forEach(s=>{const n=HB.hold[s[0]]|0,pr=price(s[0]);tot+=n*pr;const r=el('div','display:flex;justify-content:space-between;align-items:center;border-top:1px solid #234;padding:4px 2px'),L2=el('div','',null,r);el('div','color:#fff',s[1]+'  £'+pr.toFixed(1)+' EACH',L2);el('div','font-size:11px;color:'+(HB.dem[s[0]]>=1.1?'#40e060':HB.dem[s[0]]<.9?'#ff7070':'#9ab'),'DEMAND '+(HB.dem[s[0]]>=1.1?'HIGH':HB.dem[s[0]]<.9?'LOW':'NORMAL')+'  ·  IN HOLD '+n,L2);
   const R=el('div','',null,r);bt(R,'SELL 1',0,()=>{if(!n)return;cash+=pr;HB.earned+=pr;HB.hold[s[0]]--;HB.dem[s[0]]=Math.max(.5,HB.dem[s[0]]-.015);msg('SOLD 1 '+s[1])},!n);bt(R,'SELL ALL',1,()=>{if(!n)return;let g=0;for(let i=0;i<n;i++){g+=price(s[0]);HB.dem[s[0]]=Math.max(.5,HB.dem[s[0]]-.015)}g=Math.round(g);cash+=g;HB.earned+=g;HB.hold[s[0]]=0;msg('SOLD '+n+' '+s[1]+' FOR £'+g)},!n)});
  bt(el('div','margin-top:8px;text-align:center'),'SELL EVERYTHING  (~£'+Math.round(tot)+')',1,()=>{if(!holdN())return;let g=0;for(const s of SP){const n=HB.hold[s[0]]|0;for(let i=0;i<n;i++){g+=price(s[0]);HB.dem[s[0]]=Math.max(.5,HB.dem[s[0]]-.015)}HB.hold[s[0]]=0}g=Math.round(g);cash+=g;HB.earned+=g;beep(880,.1,'square',.06);msg('SOLD THE LOT FOR £'+g)},!holdN())}
 else if(OV.tab===1){if(!at)return el('div','color:#aab','VISIT THE HARBOUR TO SHOP.');
  const fl=Math.ceil(tankCap()-HB.fuel);const R0=el('div','border-top:1px solid #234;padding:4px 2px;display:flex;justify-content:space-between;align-items:center');el('div','','FUEL  £'+FUELP.toFixed(1)+' PER LITRE',R0);bt(R0,fl>0?'FILL UP £'+Math.round(fl*FUELP):'FULL',1,()=>{const c=Math.round(fl*FUELP);if(!fl)return;if(cash<c){const l=Math.floor(cash/FUELP);cash-=l*FUELP;HB.fuel+=l;return msg('PARTIAL FILL: '+l+' L')}cash-=c;HB.fuel=tankCap();beep(660,.1,'square',.06);msg('TANK FULL')},!fl);
  el('div','margin-top:6px;color:#7cf','BOATS');BT.forEach((b,i)=>{const r=el('div','display:flex;justify-content:space-between;align-items:center;border-top:1px solid #234;padding:4px 2px'),L2=el('div','',null,r);el('div','color:#fff',b.n+(HB.cur===i?'  (IN USE)':''),L2);el('div','font-size:11px;color:#9ab','TOP '+Math.round(b.vmax*1.94)+' KN · HOLD '+b.hold+' · TANK '+b.tank+' L · NET '+b.cap);
   if(HB.own[i])bt(r,HB.cur===i?'IN USE':'USE',HB.cur===i,()=>{HB.cur=i;HB.fuel=Math.min(HB.fuel,b.tank);setBoatModel();msg('NOW USING THE '+b.n)},HB.cur===i);else bt(r,'BUY £'+b.price,1,()=>{if(cash<b.price)return msg('NOT ENOUGH CASH');cash-=b.price;HB.own[i]=1;HB.cur=i;setBoatModel();beep(880,.1,'square',.06);msg('NEW BOAT: '+b.n+'!')},cash<b.price)});
  el('div','margin-top:6px;color:#7cf','UPGRADES');const up=(name,lv,costs,desc,fn)=>{const r=el('div','display:flex;justify-content:space-between;align-items:center;border-top:1px solid #234;padding:4px 2px'),L2=el('div','',null,r);el('div','color:#fff',name+'  LV '+lv+'/'+costs.length,L2);el('div','font-size:11px;color:#9ab',desc,L2);if(lv>=costs.length)bt(r,'MAX',0,()=>{},1);else bt(r,'BUY £'+costs[lv],1,()=>{if(cash<costs[lv])return msg('NOT ENOUGH CASH');cash-=costs[lv];fn();beep(880,.1,'square',.06);msg(name+' UPGRADED')},cash<costs[lv])};
  up('ENGINE',HB.eng,ENGP,'+12% TOP SPEED, QUICKER ACCELERATION',()=>HB.eng++);up('TRAWL NET',HB.net,NETP,'+2 FISH PER HAUL, FASTER HAUL',()=>HB.net++);up('SONAR',HB.son,SONP,'SHOWS SHOALS FROM FURTHER AWAY + A COMPASS ARROW',()=>HB.son++)}
 else if(OV.tab===2){el('div','color:#9ab;font-size:11px','NEW CONTRACTS EVERY MORNING.');
  HB.ct.forEach((c,i)=>{const r=el('div','display:flex;justify-content:space-between;align-items:center;border-top:1px solid #234;padding:5px 2px'),L2=el('div','',null,r);
   if(c.k==='fish'){const have=HB.hold[c.sp]|0;el('div','color:#fff','DELIVER '+c.n+' x '+spOf(c.sp)[1],L2);el('div','font-size:11px;color:#9ab','PAYS £'+c.r+'  ·  YOU HAVE '+have);bt(r,'DELIVER',1,()=>{if(have<c.n)return msg('NEED '+(c.n-have)+' MORE '+spOf(c.sp)[1]);HB.hold[c.sp]-=c.n;cash+=c.r;HB.earned+=c.r;HB.ct.splice(i,1);beep(880,.15,'square',.07);msg('CONTRACT DONE: +£'+c.r)},have<c.n)}
   else{const I=ISL[c.isl];el('div','color:#fff','CARGO RUN: '+I.n,L2);el('div','font-size:11px;color:#9ab','PAYS £'+c.r+'  ·  '+c.t+' SECONDS  ·  BOAT SLOWS 10% WITH CARGO');const act=HB.cargo&&HB.cargo.isl===c.isl;bt(r,act?'LOADED':'ACCEPT',1,()=>{if(HB.cargo)return msg('FINISH YOUR CURRENT CARGO RUN');HB.cargo={isl:c.isl,r:c.r,t:c.t};HB.ct.splice(i,1);msg('CRATES LOADED - SAIL TO '+I.n+'!')},act||!!HB.cargo)}});
  if(!HB.ct.length)el('div','color:#aab;margin:8px','ALL DONE - COME BACK TOMORROW.');if(HB.cargo)el('div','color:#ffd24a;margin-top:6px','ACTIVE CARGO: '+ISL[HB.cargo.isl].n+' · '+Math.round(HB.cargo.t)+' S LEFT')}
 else{el('div','margin-top:2px;color:#7cf','SEA LOG');SP.forEach(s=>el('div','padding:2px 0;color:'+(HB.log[s[0]]?'#fff':'#667'),s[1]+'  —  '+(HB.log[s[0]]?'CAUGHT '+HB.log[s[0]]:'NOT YET CAUGHT')));
  el('div','margin-top:6px;color:#7cf','ISLANDS');ISL.forEach((I,i)=>el('div','padding:2px 0;color:'+(HB.isl[i]?'#fff':'#667'),I.n+'  —  '+(HB.isl[i]?'DISCOVERED':'UNEXPLORED')));
  const ns=SP.filter(s=>HB.log[s[0]]).length,ni=Object.keys(HB.isl).length;el('div','margin-top:6px;color:#9fe','FISH HAULED '+HB.hauled+'  ·  EARNED AT SEA £'+Math.round(HB.earned));
  if(ns===SP.length&&ni===ISL.length&&!HB.mm){HB.mm=1;cash+=2000;HB.earned+=2000;el('div','margin-top:6px;color:#ffd24a','MASTER MARINER! £2000 AWARDED')}else if(HB.mm)el('div','margin-top:6px;color:#ffd24a','★ MASTER MARINER')}}
/* ---------------- ferry office in the village */
const ST_={cx:-108,cz:120,rot:Math.PI,w:16,d:11,h:4.8};
const W2=(lx,lz)=>{const c=Math.cos(ST_.rot),s=Math.sin(ST_.rot);return[ST_.cx+lx*c+lz*s,ST_.cz-lx*s+lz*c]};
const DOORP=W2(0,ST_.d/2+1.4);
{const Bo=new Builder(3),Br=new Builder(2),pb=(lx,y,lz,sx,sy,sz,col)=>{const p=W2(lx,lz);pbox(Bo,p[0],Y+y,p[1],sx,sy,sz,col,ST_.rot)},{w,d,h}=ST_,WH=[.95,.95,.97],BL=[.1,.28,.5],RD=[.85,.15,.15];
 pb(0,0,0,w,h,d,WH);pb(0,h*.55,0,w+.1,.5,d+.1,BL);pb(0,h,0,w+.8,.4,d+.8,BL);pb(0,h+.4,0,w+.8,.15,d+.8,RD);pb(0,0,d/2+.02,w+.2,.5,.3,BL);
 pb(0,h+.5,0,5,2.6,5,WH);pb(0,h+3.1,0,5.6,.35,5.6,BL);pb(0,h+3.45,0,.15,3,.15,[.3,.3,.3]);pb(.9,h+5.4,0,1.8,.9,.05,RD);
 for(let i=0;i<4;i++)pb(-w/2+2+i*(w-4)/3,.5,d/2+.2,.9,.9,.3,[.5,.34,.18]);
 pb(w/2-1,0,d/2+1.5,.2,3.6,.2,[.3,.3,.3]);pb(w/2-5,0,d/2+1.5,.2,3.6,.2,[.3,.3,.3]);pb(w/2-3,3.6,d/2+1.5,4.4,.15,1.2,RD);
 for(let k=0;k<3;k++){const p=W2(-w/2-1.2,d/2+2+k*1.6);pcyl(Bo,p[0],Y,p[1],.45,.8,8,[.25,.2,.16])}
 const q0=W2(0,d/2+4);quadXZ(Br,[q0[0]-9,q0[1]-5],[q0[0]+9,q0[1]-5],[q0[0]+9,q0[1]+5],[q0[0]-9,q0[1]+5],[.3,.3,.32],Y+.055);
 const gr=new THREE.Group();scene.add(gr);gr.add(Br.mesh(mRoad));gr.add(Bo.mesh(mObj));
 const sign=(t,bg,fg,wd,ht,lx,y,lz,pw,ph,sz)=>{const p=W2(lx,lz),m=new THREE.Mesh(new THREE.PlaneGeometry(wd,ht),new THREE.MeshBasicMaterial({map:txtTex(pw,ph,bg,fg,t,sz),side:THREE.DoubleSide}));m.position.set(p[0],Y+y,p[1]);m.rotation.y=ST_.rot;gr.add(m)};
 sign('COZY HARBOUR FERRY','#0e2a4a','#ffd24a',w-2,1.4,0,h*.55+1.3,d/2+.17,768,84,38);sign('FISHING TRIPS · CARGO · BOAT HIRE','#c82020','#fff',9,.6,0,h+.9,d/2+.5,512,34,22);
 const gl=new THREE.Mesh(new THREE.PlaneGeometry(w-3.4,2.1),mGlass);{const p=W2(-.6,d/2+.22);gl.position.set(p[0],Y+1.9,p[1]);gl.rotation.y=ST_.rot;gr.add(gl)}
 perimCol(ST_.cx,ST_.cz,ST_.rot,w/2,d/2,.5,1.2);OBS.push({x:ST_.cx,z:ST_.cz,c:1,s:0,hw:w/2,hd:d/2});BLD.push({x:ST_.cx,z:ST_.cz,rot:ST_.rot,w,d,k:'ferry',n:1});
 SHOPD.push({x:DOORP[0],z:DOORP[1],psi:ST_.rot,t:'COZY HARBOUR FERRY',bg:'#0e2a4a',fg:'#ffd24a',hbr:1,rx:6.5,rz:5.0,sz:3.0});Object.assign(HRS,{'COZY HARBOUR FERRY':[6,21]});
 const sl0=shopLabel;shopLabel=function(o){return o&&o.hbr?(shopOpen(o).open?'ENTER FERRY OFFICE':sl0(o)):sl0(o)};
 const cone=new THREE.ConeGeometry(.34,.7,4);cone.rotateX(Math.PI);cone.translate(0,-.35,0);const stem=new THREE.BoxGeometry(.16,.5,.16);stem.translate(0,.25,0);const am=new THREE.MeshBasicMaterial({color:0x40c8ff,fog:false}),ag=new THREE.Group();ag.add(new THREE.Mesh(cone,am),new THREE.Mesh(stem,am));ag.visible=false;scene.add(ag);
 const u0=updCozy;updCozy=function(dt){u0(dt);const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,dist=Math.hypot(DOORP[0]-px,DOORP[1]-pz),t=performance.now()/1000;ag.visible=!GS.inside&&dist<38&&!menuOpen&&!inHb(px,pz);if(ag.visible){ag.position.set(DOORP[0],G0+2.6+Math.sin(t*3.2)*.18,DOORP[1]);ag.rotation.y=t*1.2;ag.scale.setScalar(Math.max(.7,Math.min(1.3,dist/14)))}}}
{const b0=buildShop;buildShop=function(o){if(!o||!o.hbr)return b0(o);
 while(SG.children.length)SG.remove(SG.children[0]);RX=o.rx;RZ=o.rz;SHK=null;const B=(x,y,z,w2,h2,d2,hex)=>sbox(x,y,z,w2,h2,d2,fmc(hex)),Hh=IH+.9;
 SG.add(new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR.tile())));
 const wm=tx=>{const m=imat(tx);m.color.setHex(0x2a4a6a);return m};
 splane(2*RX,Hh,0,Hh/2,-RZ,0,wm(sWl));splane(2*RX,Hh,0,Hh/2,RZ,Math.PI,wm(sWl));splane(2*RZ,Hh,RX,Hh/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,Hh,-RX,Hh/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0c1420,side:THREE.BackSide,fog:false}));vd.position.y=Hh/2;SG.add(vd);
 splane(1.1,2.2,0,1.1,RZ-.02,Math.PI,imat(T_FDOOR));
 /* aquarium + sea chart */
 splane(5,1.8,-RX/2-.2,1.7,-RZ+.03,0,new THREE.MeshBasicMaterial({map:cvx(512,180,(c,w,h)=>{c.fillStyle='#0a3a5a';c.fillRect(0,0,w,h);for(let i=0;i<14;i++){c.fillStyle=['#ffa030','#e0e0e0','#60d0ff','#ff6080'][i%4];const x=30+i*33,y=20+(i*47)%130;c.beginPath();c.ellipse(x,y,16,7,0,0,6.3);c.fill();c.beginPath();c.moveTo(x+14,y);c.lineTo(x+26,y-8);c.lineTo(x+26,y+8);c.fill()}c.strokeStyle='#d8c890';c.lineWidth=6;c.strokeRect(3,3,w-6,h-6)}),side:THREE.DoubleSide}));
 splane(3.6,2.2,RX/2+.4,1.8,-RZ+.03,0,new THREE.MeshBasicMaterial({map:cvx(300,180,(c,w,h)=>{c.fillStyle='#e8d8a0';c.fillRect(0,0,w,h);c.fillStyle='#4a8ac0';c.fillRect(8,8,w-16,h-16);c.fillStyle='#d8c070';ISL.forEach(I=>{c.beginPath();c.arc(w/2+I.u*.28,20+(-I.v)*.19,4+I.r*.1,0,6.3);c.fill()});c.fillStyle='#4a9a3a';c.fillRect(8,h-34,w-16,26);c.fillStyle='#000';c.font='bold 13px monospace';c.fillText('COZY HARBOUR & ISLES',70,22)}),side:THREE.DoubleSide}));
 B(0,0,-RZ+2.3,5,1.0,.8,0x14304a);B(0,1.0,-RZ+2.3,5.1,.07,.9,0xd8c890);
 const cl=personIn(pSpec(6611,{f:false,hs:2,ts:1,gl:false,scarf:null,bp:false,bag:0,old:true,tc:[.1,.25,.5],sk:PSK[0]}),0,-RZ+1.5,0);SG.add(cl);
 B(-RX+.7,0,0,.8,.9,2.6,0x5a3a1a);B(RX-.7,0,0,.8,.9,2.6,0x5a3a1a);B(RX-.7,.9,0,.5,.12,.5,0xe8c050);
 IROOM.splice(0,IROOM.length,[-RX-1,RX+1,-RZ-1,-RZ+.9],[-2.8,2.8,-RZ+1.9,-RZ+2.8],[-RX,-RX+1.2,-1.4,1.4],[RX-1.2,RX,-1.4,1.4]);
 SHOPCUR={o:o,k:['HARBOUR MASTER',"Fish don't catch themselves. Mind the fuel gauge, and mind the weather."]};
 IA.splice(0,IA.length,{r:[-2.6,2.6,-RZ+2.8,-RZ+3.8],label:'FERRY TO COZY HARBOUR (FREE)',fn:()=>{leaveShopQ()}},{r:[RX-2.3,RX-1,-1.6,1.6],label:"ANGLER'S LOG",fn:()=>open(3)},{r:[-1.0,1.0,RZ-.3,RZ],label:'LEAVE',fn:()=>leaveShop()});
 try{addVisitors(o)}catch(e){}}}
function leaveShopQ(){if(busy)return;ferry(1)}
window.HARBOUR={HB,SP,BT,ISL,open,close,ferry,boardBoat,moor,newShoals,newCrates,get shoals(){return shoals},get crates(){return crates},W,BERTH,ARR,inHb,DOORP,ST:ST_};
})();
