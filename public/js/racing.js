/* ===== COZY MOTORSPORT CLUB: book a race at the clubhouse, get whisked off to the circuit complex (a separate map
   far off the edge of the village) and race your own car against five rivals. Two circuits, three classes, laps,
   records, prize money and a four-round championship season with a trophy at the end.
   Self-contained: relies on globals from app.js (scene, GS, P, car, man, step, ctx, fade, toast, beep, cash, JOB, carry, wmat,
   mRoad, mObj, mGlass, Builder, pbox, pcyl, pcone, quadXZ, txtTex, COL, OBS, BLD, perimCol, SHOPD, HRS, SG, IROOM, IA, RX, RZ,
   buildShop, shopLabel, leaveShop, enterShop, personIn, pSpec, PSK, imat, FLR, sbox, splane, fmc, hAt, dAt, G0, CARI, CARN ...) =====*/
(function(){
const TAU=Math.PI*2,Y=G0;
/* ---------------------------------------------------------------- the clubhouse (exterior) */
const CLUB={cx:190,cz:86,rot:-Math.PI/2,w:18,d:11,h:5.2};
const W2=(lx,lz)=>{const c=Math.cos(CLUB.rot),s=Math.sin(CLUB.rot);return[CLUB.cx+lx*c+lz*s,CLUB.cz-lx*s+lz*c]};
const DOORP=W2(0,CLUB.d/2+1.4);
/* ---------------------------------------------------------------- save data */
const RS={rec:{},races:0,wins:0,tro:[0,0,0],ch:null};
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.rc=RS;return o};cozyLoad=function(z){l0(z);if(z&&z.rc)Object.assign(RS,z.rc)}}
/* ---------------------------------------------------------------- circuits */
const CPA=[[-100,-140],[0,-140],[120,-140],[220,-110],[265,-40],[270,40],[240,110],[170,150],[90,160],[40,135],[0,110],[-45,100],[-95,110],[-145,115],[-200,80],[-235,20],[-235,-50],[-200,-110],[-150,-135]];
const CPB=[[0,0],[150,0],[300,-10],[400,-60],[430,-150],[380,-230],[290,-250],[220,-200],[200,-130],[140,-100],[90,-140],[70,-220],[0,-270],[-90,-250],[-150,-190],[-160,-110],[-120,-50],[-60,-30]].map(p=>[p[0]-135,p[1]+135]);
const TRACKS=[{id:'speedway',name:'COZY SPEEDWAY',ox:1100,oz:1100,hw:8,CP:CPA,note:'FAST + FLOWING'},{id:'gp',name:'HIGHLAND GRAND PRIX',ox:1100,oz:1800,hw:8,CP:CPB,note:'LONG + TECHNICAL'}];
const inReg=(x,z)=>{for(const T of TRACKS)if(Math.abs(x-T.ox)<380&&Math.abs(z-T.oz)<330)return T;return null};
{const h0=hAt;hAt=function(x,z){return inReg(x,z)?G0:h0(x,z)}}
const cr=(a,b,c,d,t)=>{const t2=t*t,t3=t2*t;return[0,1].map(k=>.5*(2*b[k]+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3))};
function prep(T){if(T.S)return;const CP=T.CP.map(p=>[T.ox+p[0],T.oz+p[1]]),n=CP.length;let dense=[];for(let i=0;i<n;i++)for(let k=0;k<40;k++)dense.push(cr(CP[(i+n-1)%n],CP[i],CP[(i+1)%n],CP[(i+2)%n],k/40));
 {let bi=0,bd=1e9;dense.forEach((p,i)=>{const d=Math.hypot(p[0]-CP[0][0],p[1]-CP[0][1]);if(d<bd){bd=d;bi=i}});dense=dense.slice(bi).concat(dense.slice(0,bi))}
 const cum=[0];for(let i=1;i<=dense.length;i++){const a=dense[i-1],b=dense[i%dense.length];cum.push(cum[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1]))}
 const LEN=cum[dense.length],N=Math.round(LEN/1.5),SP=LEN/N,S=[];let j=0;
 for(let i=0;i<N;i++){const t=i*SP;while(cum[j+1]<t)j++;const a=dense[j],b=dense[(j+1)%dense.length],f=(t-cum[j])/(cum[j+1]-cum[j]||1);S.push({x:a[0]+(b[0]-a[0])*f,z:a[1]+(b[1]-a[1])*f})}
 for(let i=0;i<N;i++){const a=S[(i+N-1)%N],b=S[(i+1)%N],l=Math.hypot(b.x-a.x,b.z-a.z)||1,s=S[i];s.tx=(b.x-a.x)/l;s.tz=(b.z-a.z)/l;s.nx=-s.tz;s.nz=s.tx;s.a=Math.atan2(s.tx,s.tz)}
 {const raw=S.map((s,i)=>{let d=S[(i+1)%N].a-s.a;d=Math.atan2(Math.sin(d),Math.cos(d));return Math.abs(d)/SP});for(let i=0;i<N;i++){let m=0;for(let k=-5;k<=5;k++)m=Math.max(m,raw[(i+k+N)%N]);S[i].k=m}}
 T.S=S;T.N=N;T.SP=SP;T.LEN=LEN}
const posAt=(T,s,lat)=>{const{S,N,SP,LEN}=T;s=((s%LEN)+LEN)%LEN;const f0=s/SP,i=Math.floor(f0)%N,f=f0-Math.floor(f0),a=S[i],b=S[(i+1)%N],x=a.x+(b.x-a.x)*f,z=a.z+(b.z-a.z)*f;let nx=a.nx+(b.nx-a.nx)*f,nz=a.nz+(b.nz-a.nz)*f;const l=Math.hypot(nx,nz)||1;nx/=l;nz/=l;return{x:x+nx*lat,z:z+nz*lat,psi:Math.atan2(nz,-nx)}};
function trackDist(T,x,z){const S=T.S;let b=1e9;for(let i=0;i<T.N;i+=2){const s=S[i],d=(x-s.x)*(x-s.x)+(z-s.z)*(z-s.z);if(d<b)b=d}return Math.sqrt(b)}
/* ---------------------------------------------------------------- race state */
const CLASSES=[{id:'rookie',name:'ROOKIE CUP',fee:25,prize:[150,80,40,20,10,0],vtop:31,skill:[.84,.82,.8,.77,.74],bonus:[500,250,120]},
 {id:'pro',name:'PRO SERIES',fee:75,prize:[450,225,110,55,25,0],vtop:38,skill:[.95,.93,.9,.87,.84],bonus:[1500,750,350]},
 {id:'elite',name:'ELITE GRAND PRIX',fee:200,prize:[1500,700,350,150,60,0],vtop:46,skill:[1.02,1,.97,.94,.9],bonus:[4000,2000,1000]}];
const ROUNDS=[{t:0,laps:3},{t:1,laps:3},{t:0,laps:4},{t:1,laps:4}],PTS=[10,8,6,4,3,2];
const RIV=[['BLUEBELL',0x2860d8,23],['MOSS',0x28a848,5],['PLUM',0x9030c8,88],['EMBER',0xe86a18,7],['SNOWDROP',0xe8eaee,12]];
const RC={on:0,state:'idle',cd:0,t:0,tot:0,idx:0,lapsDone:0,lapT:0,laps:[],ai:[],back:0,rank:1,hudT:0,saved:null,bigT:0,T:null,cls:null,laps_n:3,round:-1,lastN:3};
{const d0=dAt;dAt=function(x,z){const T=RC.T;if(T&&T.S&&inReg(x,z)===T){return trackDist(T,x,z)<T.hw+.6?3.5:9}return d0(x,z)}}
/* ---------------------------------------------------------------- build a circuit (lazily, first time it is raced) */
const ASP=[.27,.27,.3],RED=[.85,.12,.1],WHT=[.92,.92,.88],BLK=[.1,.1,.12];
function buildTrack(T){if(T.built)return;prep(T);T.built=1;const{S,N,hw}=T,g=T.g=new THREE.Group();scene.add(g);
 const Br=new Builder(2),Bo=new Builder(3),BAR=hw+4.4;
 for(let i=0;i<N;i++){const a=S[i],b=S[(i+1)%N],L=(o,s)=>[s.x+s.nx*o,s.z+s.nz*o];
  quadXZ(Br,L(-hw,a),L(hw,a),L(hw,b),L(-hw,b),ASP,Y+.06);const kc=(i>>1)%2?RED:WHT;
  for(const sd of[-1,1]){quadXZ(Br,L(sd*hw,a),L(sd*(hw+.7),a),L(sd*(hw+.7),b),L(sd*hw,b),kc,Y+.065);quadXZ(Br,L(sd*(hw-.45),a),L(sd*(hw-.25),a),L(sd*(hw-.25),b),L(sd*(hw-.45),b),WHT,Y+.07)}
  if(i%14<7)quadXZ(Br,L(-.12,a),L(.12,a),L(.12,b),L(-.12,b),[.9,.9,.85],Y+.068)}
 /* chequered start line + grid boxes */
 {const s0=S[0],P2=(u,v)=>[s0.x+s0.tx*u+s0.nx*v,s0.z+s0.tz*u+s0.nz*v];for(let r=0;r<2;r++)for(let c=0;c<16;c++)quadXZ(Br,P2(r*.9,-hw+c),P2(r*.9,-hw+c+1),P2(r*.9+.9,-hw+c+1),P2(r*.9+.9,-hw+c),(r+c)%2?BLK:WHT,Y+.08);
  for(let row=0;row<3;row++)for(const lat of[-3.4,3.4]){const u=-6-row*9;quadXZ(Br,P2(u,lat-1.1),P2(u,lat+1.1),P2(u-.16,lat+1.1),P2(u-.16,lat-1.1),WHT,Y+.075);quadXZ(Br,P2(u,lat-1.1),P2(u,lat-.94),P2(u-3.6,lat-.94),P2(u-3.6,lat-1.1),WHT,Y+.075);quadXZ(Br,P2(u,lat+1.1),P2(u,lat+.94),P2(u-3.6,lat+.94),P2(u-3.6,lat+1.1),WHT,Y+.075)}}
 /* tyre walls (visual + colliders) */
 for(let i=0;i<N;i+=3){const s=S[i];for(const sd of[-1,1]){const x=s.x+s.nx*sd*BAR,z=s.z+s.nz*sd*BAR;pcyl(Bo,x,Y,z,.8,.55,6,BLK);pcyl(Bo,x,Y+.55,z,.8,.55,6,(i/3|0)%2?RED:WHT);COL.push([x,z,.8])}}
 /* start gantry + banner, pit lane building, grandstand, billboards, floodlights, trees */
 const s0=S[0],e=hw+2.6,rot0=Math.atan2(s0.nx,s0.nz);
 for(const sd of[-1,1])pbox(Bo,s0.x+s0.nx*e*sd,Y,s0.z+s0.nz*e*sd,.6,7,.6,[.78,.78,.82],0);
 pbox(Bo,s0.x,Y+6.6,s0.z,.9,.9,2*e+.8,[.18,.18,.22],rot0);
 const bn=new THREE.Mesh(new THREE.PlaneGeometry(14,2),new THREE.MeshBasicMaterial({map:txtTex(512,74,'#14141a','#ffd23a',T.name,34),side:THREE.DoubleSide}));bn.position.set(s0.x,Y+8.1,s0.z);bn.rotation.y=Math.atan2(s0.tx,s0.tz);g.add(bn);
 for(let k=0;k<5;k++){const lx=s0.x+s0.nx*(k-2)*3.2,lz=s0.z+s0.nz*(k-2)*3.2;const m=new THREE.Mesh(new THREE.SphereGeometry(.45,10,8),new THREE.MeshBasicMaterial({color:0x330000}));m.position.set(lx-s0.tx*.6,Y+6.6,lz-s0.tz*.6);g.add(m);(T.lights=T.lights||[]).push(m)}
 const side=1,base=(u,v)=>[s0.x+s0.tx*u+s0.nx*v,s0.z+s0.tz*u+s0.nz*v];
 {const q=base(-30,-(hw+22));pbox(Bo,q[0],Y,q[1],70,3.4,4,[.88,.88,.9],rot0);pbox(Bo,q[0],Y+3.4,q[1],72,.4,5,[.8,.12,.14],rot0);for(let k=0;k<7;k++){const d=base(-30+(k-3)*9.4,-(hw+19.8));pbox(Bo,d[0],Y,d[1],6.4,2.7,.3,[.2,.2,.24],rot0)}}
 {for(let r=0;r<6;r++){const q=base(40,hw+12+r*2.4);pbox(Bo,q[0],Y+r*.9,q[1],80,.9,2.4,r%2?[.5,.52,.6]:[.44,.46,.56],rot0);}
  const roof=base(40,hw+19);pbox(Bo,roof[0],Y+8.2,roof[1],84,.4,16,[.9,.9,.92],rot0);for(const u of[-38,0,38]){const q=base(40+u,hw+24);pbox(Bo,q[0],Y,q[1],.7,8.2,.7,[.7,.7,.74],rot0)}
  const crowd=cvx2(512,64,(c,W,H)=>{c.fillStyle='#46485a';c.fillRect(0,0,W,H);for(let i=0;i<260;i++){c.fillStyle=['#e03030','#3070e0','#f0d030','#40b050','#f0f0f0','#e07020'][i%6];c.fillRect((i*37)%W,8+(i*13)%48,5,6)}});
  const cp=new THREE.Mesh(new THREE.PlaneGeometry(80,5),new THREE.MeshBasicMaterial({map:crowd,side:THREE.DoubleSide}));const cq=base(40,hw+11.7);cp.position.set(cq[0],Y+2.7,cq[1]);cp.rotation.y=rot0+Math.PI/2*0+Math.atan2(s0.tx,s0.tz)-rot0+Math.PI/2;g.add(cp)}
 const SPON=['COZY COLA','VILLAGE MOTORS',"JOE'S GARAGE",'ROYAL OAK ALE','RUTH & CO','FRANKIE\'S CHIPS','COZY MOTORSPORT'],SC=[['#c01020','#fff'],['#101820','#f0c840'],['#c82020','#fff'],['#1c3a24','#f0d070'],['#222a3a','#fff'],['#f2c814','#a01010'],['#14141a','#ffd23a']];
 for(let k=0;k<S.length;k+=Math.floor(N/16)){const s=S[k],sd=(k/Math.floor(N/16))%2?1:-1,p=[s.x+s.nx*sd*(BAR+1.6),s.z+s.nz*sd*(BAR+1.6)],i=(k/Math.floor(N/16))|0;pbox(Bo,p[0],Y,p[1],.3,2.6,.3,[.3,.3,.34],0);const m=new THREE.Mesh(new THREE.PlaneGeometry(8,2.2),new THREE.MeshBasicMaterial({map:txtTex(256,70,SC[i%7][0],SC[i%7][1],SPON[i%7],26),side:THREE.DoubleSide}));m.position.set(p[0],Y+2.6,p[1]);m.rotation.y=Math.atan2(s.tx,s.tz)+Math.PI/2;g.add(m)}
 for(let k=0;k<N;k+=Math.floor(N/10)){const s=S[k],p=[s.x+s.nx*(BAR+6),s.z+s.nz*(BAR+6)];pcyl(Bo,p[0],Y,p[1],.25,14,6,[.7,.7,.74]);pbox(Bo,p[0],Y+14,p[1],2.4,.5,.9,[1,1,.9],0)}
 {const R0=T.id==='speedway'?7:3;let seed=R0*7919;const rr=()=>(seed=(seed*16807)%2147483647)/2147483647;for(let k=0;k<120;k++){const a=rr()*TAU,rad=250+rr()*130,x=T.ox+Math.cos(a)*rad*1.1,z=T.oz+Math.sin(a)*rad*.85;if(!inReg(x,z)||trackDist(T,x,z)<BAR+12)continue;const h=3+rr()*3;pcyl(Bo,x,Y,z,.35,h*.5,5,[.4,.28,.18]);pcone(Bo,x,Y+h*.4,z,1.7+rr()*.8,h,6,[.12+rr()*.1,.36+rr()*.14,.14],0)}}
 g.add(Br.mesh(mRoad));g.add(Bo.mesh(mObj))}
const cvx2=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;t.generateMipmaps=false;return t};
/* ---------------------------------------------------------------- rival cars */
const rmc={};const rm=hex=>{if(rmc[hex])return rmc[hex];const c=new THREE.Color(hex),m=wmat([c.r,c.g,c.b],{vertexColors:false});m.color.copy(c);return rmc[hex]=m};
function mkRival(col,num){const g=new THREE.Group(),bx=(w,h,d,x,y,z,m)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);q.position.set(x,y,z);g.add(q);return q};
 const body=rm(col),dark=rm(0x16161a),glass=rm(0x1a2a3a),white=rm(0xf2f2f2),tn=new THREE.MeshBasicMaterial({map:txtTex(64,64,'#f4f4f4','#111',String(num),44),side:THREE.DoubleSide});
 bx(1.85,.5,4.4,0,.52,0,body);bx(1.7,.3,1.5,0,.74,1.35,body);bx(1.45,.5,1.8,0,.95,-.25,glass);bx(1.5,.1,1.9,0,1.22,-.25,body);bx(1.9,.12,.5,0,.98,-2.1,dark);bx(.12,.34,.12,.7,.8,-2.0,dark);bx(.12,.34,.12,-.7,.8,-2.0,dark);bx(1.9,.14,.4,0,.4,2.2,dark);bx(.3,.05,2.6,0,.8,.2,white);
 for(const sx of[-1,1]){const p=new THREE.Mesh(new THREE.PlaneGeometry(.5,.5),tn);p.position.set(sx*.93,.62,.1);p.rotation.y=sx*Math.PI/2;g.add(p)}
 const wh=[],fw=[];for(const[x,z,f]of[[.92,1.4,1],[-.92,1.4,1],[.92,-1.4,0],[-.92,-1.4,0]]){const pv=new THREE.Group();pv.position.set(x,.36,z);const w=new THREE.Mesh(new THREE.CylinderGeometry(.36,.36,.3,12).rotateZ(Math.PI/2),dark);pv.add(w);g.add(pv);wh.push(w);if(f)fw.push(pv)}
 g.userData={wh,fw};g.visible=false;scene.add(g);return g}
/* ---------------------------------------------------------------- HUD */
const css='position:fixed;left:50%;transform:translateX(-50%);z-index:26;font:bold 13px monospace;color:#fff;text-align:center;pointer-events:none;display:none;';
const hud=document.createElement('div');hud.style.cssText=css+'top:84px;padding:5px 10px;background:rgba(0,0,20,.78);border:2px solid #f5e6a0;white-space:nowrap';
const big=document.createElement('div');big.style.cssText=css+'top:26%;font-size:64px;color:#ffe040;text-shadow:3px 3px 0 #000,-2px -2px 0 #000;letter-spacing:2px';
const res=document.createElement('div');res.style.cssText=css+'top:12%;padding:14px 20px;background:rgba(0,0,20,.92);border:3px solid #f5e6a0;pointer-events:auto;min-width:260px;line-height:1.55;max-height:76vh;overflow:auto';
const board=document.createElement('div');board.style.cssText='position:fixed;right:8px;top:150px;z-index:26;font:bold 12px monospace;color:#fff;background:rgba(0,0,20,.7);padding:4px 7px;line-height:1.35;pointer-events:none;display:none;white-space:pre';
[hud,big,res,board].forEach(e=>document.body.appendChild(e));
const fmt=t=>{if(!(t>0))return '--:--.-';const m=Math.floor(t/60),s=t-m*60;return m+':'+(s<10?'0':'')+s.toFixed(1)};
const ord=n=>['1ST','2ND','3RD','4TH','5TH','6TH'][n-1]||n+'TH';
function showBig(t,ms){big.textContent=t;big.style.display='block';RC.bigT=ms||0}
const rec=T=>RS.rec[T.id]||(RS.rec[T.id]={lap:0,race:0});
function updHud(){const T=RC.T,lap=Math.min(RC.laps_n,Math.max(1,Math.floor(RC.tot/T.N)+1)),cur=RC.t-RC.lapT;hud.innerHTML=T.name+' &nbsp; LAP '+lap+'/'+RC.laps_n+' &nbsp; POS '+RC.rank+'/6 &nbsp; '+fmt(RC.t)+' &nbsp; LAP '+fmt(cur)+' &nbsp; BEST '+fmt(rec(T).lap);hud.style.display='block'}
/* ---------------------------------------------------------------- race flow */
function raceStart(T,cls,laps,roundIdx){
 if(RC.on||busy||menuOpen)return false;if(JOB.on||carry){toast('FINISH YOUR JOB FIRST');return false}
 const home=SHOPCUR&&SHOPCUR.o&&SHOPCUR.o.race;
 fade(()=>{if(GS.inside&&SHOPCUR)leaveShop(true);
  RC.saved={x:GS.x,z:GS.z,psi:GS.psi,foot:GS.onFoot,px:P.x,pz:P.z,ppsi:P.psi};
  buildTrack(T);RC.T=T;RC.cls=cls;RC.laps_n=laps;RC.round=roundIdx;
  RC.on=1;RC.state='cd';RC.cd=3.4;RC.t=0;RC.lapT=0;RC.laps=[];RC.lapsDone=0;RC.back=0;RC.rank=6;RC.lastN=4;
  GS.onFoot=0;man.visible=false;car.visible=true;inp.gas=inp.brk=inp.hand=inp.pad=0;
  const slots=[[-6,-3.4],[-6,3.4],[-15,-3.4],[-15,3.4],[-24,-3.4],[-24,3.4]],ps=cls.id==='rookie'?1:cls.id==='pro'?3:5,sl=slots[ps],p=posAt(T,sl[0],sl[1]);
  GS.x=p.x;GS.z=p.z;GS.psi=p.psi;GS.vx=GS.vz=GS.vy=0;GS.vf=0;GS.speed=0;GS.steer=0;GS.y=G0+.1;GS.prevGY=GS.y;GS.pitch=GS.roll=GS.dp=GS.dr=0;
  RC.idx=((Math.round(sl[0]/T.SP)%T.N)+T.N)%T.N;RC.tot=Math.round(sl[0]/T.SP);camAng=GS.psi;
  RC.ai=[];let a=0;slots.forEach((s,i)=>{if(i===ps)return;const r=RIV[a],m=mkRival(r[1],r[2]);m.visible=true;RC.ai.push({m,s:s[0],lat:s[1],v:0,skill:cls.skill[a],name:r[0],spin:0});a++});
  setLabels();toast('GET READY!');showBig('3',900);beep(440,.15,'square',.08);T.lights&&T.lights.forEach(m=>m.material.color.setHex(0x330000))});
 return true}
function raceEnd(){if(!RC.on)return;RC.on=0;RC.state='idle';for(const a of RC.ai)scene.remove(a.m);RC.ai=[];const T=RC.T;RC.T=null;
 const s=RC.saved;if(s){GS.x=s.x;GS.z=s.z;GS.psi=s.psi;GS.vx=GS.vz=GS.vy=0;GS.vf=0;GS.speed=0;GS.steer=0;GS.y=gH(GS.x,GS.z)+.1;GS.prevGY=GS.y;GS.pitch=GS.roll=GS.dp=GS.dr=0;
  if(s.foot){GS.onFoot=1;man.visible=true;P.x=s.px;P.z=s.pz;P.psi=s.ppsi;P.speed=0;P.y=gH(P.x,P.z)+.02}else GS.onFoot=0;camAng=GS.onFoot?P.psi:GS.psi}
 hud.style.display=big.style.display=res.style.display=board.style.display='none';setLabels()}
function raceQuit(){if(busy)return;if(RC.state==='race'&&!confirmQuit()){return}fade(raceEnd)}
let qArm=0;function confirmQuit(){const n=performance.now();if(n-qArm<2500)return true;qArm=n;toast('PRESS AGAIN TO QUIT (ENTRY FEE LOST)');return false}
function standings(){const T=RC.T,pd=RC.tot*T.SP,all=[{n:'YOU',s:pd,me:1}].concat(RC.ai.map(a=>({n:a.name,s:a.s})));all.sort((a,b)=>b.s-a.s);return all}
function finish(){const T=RC.T,cls=RC.cls;RC.state='fin';const t=RC.t,all=standings(),rank=all.findIndex(a=>a.me)+1;RC.rank=rank;
 const mult=RC.laps_n/3,prize=Math.round(cls.prize[rank-1]*mult)||0;cash+=prize;RS.races++;if(rank===1)RS.wins++;
 const r=rec(T),nb=!r.race||t<r.race;if(nb)r.race=t;
 let champ='';if(RC.round>=0&&RS.ch&&RS.ch.active){const ch=RS.ch;all.forEach((a,i)=>{const k=a.me?0:RIV.findIndex(q=>q[0]===a.n)+1;ch.pts[k]+=PTS[i]||0});ch.round++;champ='<br><b style="color:#9fe">CHAMPIONSHIP: +'+PTS[rank-1]+' POINTS</b>';
  if(ch.round>=ROUNDS.length){const order=ch.pts.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0]),fp=order.findIndex(o=>o[1]===0);const bonus=fp<3?cls.bonus[fp]:0;cash+=bonus;if(fp<3)RS.tro[fp]++;ch.active=false;champ+='<br><b style="color:#ffd24a">SEASON OVER: '+ord(fp+1)+' OVERALL'+(bonus?'  +£'+bonus+(fp===0?' & THE GOLD TROPHY!':fp===1?' & SILVER TROPHY':' & BRONZE TROPHY'):'')+'</b>'}}
 showBig(rank===1?'WINNER!':ord(rank)+' PLACE',2600);beep(rank===1?880:520,.4,'square',.09);if(rank===1)setTimeout(()=>beep(1320,.3,'square',.08),200);
 res.innerHTML='<div style="font-size:18px;color:#f5e6a0">'+ord(rank)+' PLACE · '+T.name+'</div>'+all.map((a,i)=>(i+1)+'. '+a.n+(a.me?' ◄':'')).join(' &nbsp;')+'<br>TIME '+fmt(t)+(nb?' ★ NEW RECORD':'')+'<br>'+RC.laps.map((l,i)=>'LAP '+(i+1)+' '+fmt(l)).join(' · ')+'<br>BEST LAP '+fmt(r.lap)+'<br>PRIZE '+(prize?'£'+prize:'—')+champ+'<br><button style="margin-top:8px;font:bold 13px monospace;padding:6px 16px;background:#c0262c;color:#fff;border:2px solid #fff;cursor:pointer">BACK TO TOWN</button>';
 res.style.display='block';res.querySelector('button').onclick=()=>{if(!busy)fade(raceEnd)}}
function tickPlayer(dt){const T=RC.T,S=T.S,N=T.N;let bi=RC.idx,bd=1e9;for(let k=-14;k<=14;k++){const i=(RC.idx+k+N)%N,s=S[i],d=(GS.x-s.x)*(GS.x-s.x)+(GS.z-s.z)*(GS.z-s.z);if(d<bd){bd=d;bi=i}}
 let d=bi-RC.idx;if(d>N/2)d-=N;else if(d<-N/2)d+=N;RC.idx=bi;RC.tot+=d;RC.back=clamp(RC.back+(d<0&&GS.vf>2?dt:-dt),0,3);
 const done=Math.floor(RC.tot/N);
 if(done>RC.lapsDone&&done<=RC.laps_n){const lt=RC.t-RC.lapT;RC.lapT=RC.t;RC.lapsDone=done;RC.laps.push(lt);const r=rec(T);if(!r.lap||lt<r.lap){r.lap=lt;toast('LAP '+done+'  '+fmt(lt)+'  NEW LAP RECORD!')}else toast('LAP '+done+'  '+fmt(lt));beep(660,.12,'square',.07)}
 if(done>=RC.laps_n&&RC.state==='race')finish()}
const ALAT=21;
function tickAI(dt){const T=RC.T,S=T.S,N=T.N,SP=T.SP,pd=RC.tot*SP,vt=RC.cls.vtop;
 for(const a of RC.ai){if(RC.state==='cd'){a.v=0}else{
  const i0=Math.floor(((a.s%T.LEN)+T.LEN)%T.LEN/SP);let tv=1e9;for(let k=0;k<14;k++){const s=S[(i0+k)%N];tv=Math.min(tv,Math.min(vt,Math.sqrt(ALAT/Math.max(s.k,1e-4))))}
  tv*=a.skill;const gap=a.s-pd;if(gap>90)tv*=.93;else if(gap<-40)tv*=1.07;else if(gap<0)tv*=1.03;
  if(tv>a.v)a.v=Math.min(tv,a.v+8*dt);else a.v=Math.max(tv,a.v-22*dt);a.s+=a.v*dt}
  const p=posAt(T,a.s,a.lat);a.m.position.set(p.x,G0+.02,p.z);a.m.rotation.y=p.psi;
  a.spin+=a.v*dt/.36;let da=posAt(T,a.s+5,a.lat).psi-p.psi;da=Math.atan2(Math.sin(da),Math.cos(da));const st=clamp(da*1.3,-.5,.5);for(const w of a.m.userData.fw)w.rotation.y=st;for(const w of a.m.userData.wh)w.rotation.x=a.spin;
  const dx=GS.x-p.x,dz=GS.z-p.z,dd=Math.hypot(dx,dz);if(dd<2.3&&dd>1e-3){const ux=dx/dd,uz=dz/dd,o=2.3-dd;GS.x+=ux*o*.6;GS.z+=uz*o*.6;const vn=GS.vx*ux+GS.vz*uz;if(vn<0){GS.vx-=vn*ux*1.1;GS.vz-=vn*uz*1.1}a.v*=.97}}
 const all=standings();if(RC.state!=='fin')RC.rank=all.findIndex(a=>a.me)+1;
 RC.bt=(RC.bt||0)-dt;if(RC.bt<=0){RC.bt=.4;board.textContent=all.map((a,i)=>(i+1)+' '+a.n+(a.me?' <':'')).join('\n');board.style.display=(RC.state==='race')?'block':'none'}}
function raceTick(dt){
 if(RC.bigT>0){RC.bigT-=dt*1000;if(RC.bigT<=0&&RC.state!=='cd')big.style.display='none'}
 if(RC.state==='cd'){RC.cd-=dt;const n=Math.ceil(RC.cd);if(n!==RC.lastN&&n>0&&n<4){RC.lastN=n;showBig(String(n),900);beep(440,.15,'square',.08);const T=RC.T;if(T.lights)T.lights.forEach((m,i)=>m.material.color.setHex(i<4-n+1&&i<3?0xff1010:0x330000))}
  if(RC.cd<=0){RC.state='race';RC.t=0;showBig('GO!',900);beep(880,.45,'square',.1);RC.T.lights&&RC.T.lights.forEach(m=>m.material.color.setHex(0x20ff40))}}
 else if(RC.state==='race'||RC.state==='fin'){if(RC.state==='race')RC.t+=dt;tickPlayer(dt);if(RC.back>.9&&RC.state==='race'){big.textContent='WRONG WAY';big.style.display='block';RC.bigT=0}else if(big.textContent==='WRONG WAY')big.style.display='none'}
 tickAI(dt);RC.hudT-=dt;if(RC.hudT<=0){RC.hudT=.1;if(RC.state==='cd'){hud.innerHTML=RC.T.name+' · '+RC.cls.name+' · '+RC.laps_n+' LAPS';hud.style.display='block'}else if(RC.state==='race')updHud()}}
{const step0=step;step=function(dt){if(!RC.on)return step0(dt);if(RC.state==='cd'){GS.vx=GS.vz=GS.vf=GS.speed=0}else step0(dt);try{raceTick(dt)}catch(e){if(!RC.err){RC.err=1;console.error('race',e)}}}}
{const ctx0=ctx;ctx=function(){if(RC.on)return{label:RC.state==='fin'?'LEAVE CIRCUIT':'QUIT RACE',fn:raceQuit};return ctx0()}}
/* ---------------------------------------------------------------- the clubhouse building */
{const Bo=new Builder(3),Br=new Builder(2),pb=(lx,y,lz,sx,sy,sz,col)=>{const p=W2(lx,lz);pbox(Bo,p[0],Y+y,p[1],sx,sy,sz,col,CLUB.rot)},{w,d,h}=CLUB,WH=[.95,.95,.97],DK=[.12,.12,.16],RD=[.82,.1,.14];
 pb(0,0,0,w,h,d,WH);pb(0,h,0,w+.8,.5,d+.8,DK);pb(0,h+.5,0,w+.8,.18,d+.8,RD);pb(0,0,d/2+.02,w+.2,.5,.3,DK);
 for(let i=0;i<=6;i++)pb(-w/2+i*w/6,0,d/2+.1,.28,h,.3,DK);pb(0,h-.9,d/2+.2,w,.9,.5,DK);
 pb(w/2-3,0,d/2+1.2,.12,2.5,.12,DK);pb(w/2-1.4,0,d/2+1.2,.12,2.5,.12,DK);pb(w/2-2.2,2.5,d/2+1.2,2.2,.12,1.2,DK);
 for(let i=0;i<22;i++)for(let j=0;j<2;j++)pb(-w/2-.4+(i+.5)*(w+.8)/22,h+.68+j*.3,d/2+.35,(w+.8)/22,.3,.2,(i+j)%2?BLK:WHT);
 pb(0,h+.7,0,3,2.2,3,DK);pb(-6,h+.7,-2,1.6,1.4,1.6,[.7,.7,.74]);
 for(const sx of[-1,1]){const p=W2(sx*(w/2-.5),d/2+3);pbox(Bo,p[0],Y,p[1],.2,9,.2,[.8,.8,.84],0);}
 {const a=W2(-w/2-4,d/2+5);pbox(Bo,a[0],Y,a[1],.5,7,2.2,DK,CLUB.rot);const b=W2(-w/2-4,d/2+5);}
 for(let k=0;k<4;k++){const p=W2(-w/2+2+k*4.4,d/2+7.4);pbox(Bo,p[0],Y+.1,p[1],2.4,.05,4.6,[.14,.14,.16],CLUB.rot)}
 const q0=W2(0,d/2+3.5);quadXZ(Br,[q0[0]+7.5,q0[1]-12],[q0[0]-9,q0[1]-12],[q0[0]-9,q0[1]+12],[q0[0]+7.5,q0[1]+12],[.28,.28,.3],Y+.055);
 quadXZ(Br,[175,CLUB.cz-4],[q0[0]+7.5,CLUB.cz-4],[q0[0]+7.5,CLUB.cz+4],[175,CLUB.cz+4],[.28,.28,.3],Y+.055);
 const gr=new THREE.Group();scene.add(gr);gr.add(Br.mesh(mRoad));gr.add(Bo.mesh(mObj));
 const sign=(t,bg,fg,wd,ht,lx,y,lz,pw,ph,sz)=>{const p=W2(lx,lz),m=new THREE.Mesh(new THREE.PlaneGeometry(wd,ht),new THREE.MeshBasicMaterial({map:txtTex(pw,ph,bg,fg,t,sz),side:THREE.DoubleSide}));m.position.set(p[0],Y+y,p[1]);m.rotation.y=CLUB.rot;gr.add(m);return m};
 sign('COZY MOTORSPORT CLUB','#14141a','#ffd23a',w-2,1.5,0,h-.45,d/2+.47,768,84,40);sign('BOOK YOUR RACE HERE','#c01020','#ffffff',8,.7,0,h+1.1,d/2+.5,384,44,26);
 {const p=W2(-w/2-4,d/2+5),m=new THREE.Mesh(new THREE.PlaneGeometry(2.1,6.4),new THREE.MeshBasicMaterial({map:txtTex(120,360,'#14141a','#ffd23a','RACE',54),side:THREE.DoubleSide}));m.position.set(p[0]-.3,Y+3.6,p[1]);m.rotation.y=CLUB.rot;gr.add(m)}
 const gl=new THREE.Mesh(new THREE.PlaneGeometry(w-3.4,2.9),mGlass);{const p=W2(-.6,d/2+.22);gl.position.set(p[0],Y+1.9,p[1]);gl.rotation.y=CLUB.rot;gr.add(gl)}
 perimCol(CLUB.cx,CLUB.cz,CLUB.rot,w/2,d/2,.5,1.2);OBS.push({x:CLUB.cx,z:CLUB.cz,c:1,s:0,hw:w/2,hd:d/2});BLD.push({x:CLUB.cx,z:CLUB.cz,rot:CLUB.rot,w,d,k:'club',n:1});
 const DOOR={x:DOORP[0],z:DOORP[1],psi:-Math.PI/2,t:'COZY MOTORSPORT CLUB',bg:'#14141a',fg:'#ffd24a',race:1,rx:6.8,rz:5.2,sz:3.0};SHOPD.push(DOOR);Object.assign(HRS,{'COZY MOTORSPORT CLUB':[6,23]});
 const sl0=shopLabel;shopLabel=function(o){return o&&o.race?(shopOpen(o).open?'ENTER MOTORSPORT CLUB':sl0(o)):sl0(o)};
 /* door arrow (yellow bobbing arrow like the shops) */
 const cone=new THREE.ConeGeometry(.34,.7,4);cone.rotateX(Math.PI);cone.translate(0,-.35,0);const stem=new THREE.BoxGeometry(.16,.5,.16);stem.translate(0,.25,0);const am=new THREE.MeshBasicMaterial({color:0xffd23a,fog:false}),ag=new THREE.Group();ag.add(new THREE.Mesh(cone,am),new THREE.Mesh(stem,am));ag.visible=false;scene.add(ag);
 const u0=updCozy;updCozy=function(dt){u0(dt);const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,dist=Math.hypot(DOORP[0]-px,DOORP[1]-pz),t=performance.now()/1000;ag.visible=!GS.inside&&!RC.on&&!menuOpen&&dist<38;if(ag.visible){ag.position.set(DOORP[0],G0+2.6+Math.sin(t*3.2)*.18,DOORP[1]);ag.rotation.y=t*1.2;ag.scale.setScalar(Math.max(.7,Math.min(1.3,dist/14)))}}}
/* ---------------------------------------------------------------- interior */
let showCar=null,clerk=null;
{const b0=buildShop;buildShop=function(o){if(!o||!o.race)return b0(o);
 while(SG.children.length)SG.remove(SG.children[0]);RX=o.rx;RZ=o.rz;SHK=null;const B=(x,y,z,w2,h2,d2,hex)=>sbox(x,y,z,w2,h2,d2,fmc(hex)),Hh=IH+.9;
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR.tile()));SG.add(fl);
 const wm=tx=>{const m=imat(tx);m.color.setHex(0x20242e);return m};
 splane(2*RX,Hh,0,Hh/2,-RZ,0,wm(sWl));splane(2*RX,Hh,0,Hh/2,RZ,Math.PI,wm(sWl));splane(2*RZ,Hh,RX,Hh/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,Hh,-RX,Hh/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0d0f18,side:THREE.BackSide,fog:false}));vd.position.y=Hh/2;SG.add(vd);
 splane(1.1,2.2,0,1.1,RZ-.02,Math.PI,imat(T_FDOOR));
 const tx=(w2,h2,fn)=>cvx2(w2,h2,fn);
 /* big timing screen on the north wall */
 {const sc=tx(512,200,(g,W,H)=>{g.fillStyle='#05080f';g.fillRect(0,0,W,H);g.strokeStyle='#ffd23a';g.lineWidth=4;g.strokeRect(4,4,W-8,H-8);g.fillStyle='#ffd23a';g.font='bold 22px monospace';g.textAlign='center';g.fillText('COZY MOTORSPORT CLUB - RECORDS',W/2,34);g.font='bold 18px monospace';g.textAlign='left';g.fillStyle='#9fe';
   TRACKS.forEach((T,i)=>{const r=rec(T);g.fillText(T.name,24,76+i*52);g.fillStyle='#fff';g.fillText('BEST LAP '+fmt(r.lap)+'   BEST RACE '+fmt(r.race),24,98+i*52);g.fillStyle='#9fe'});
   g.fillStyle='#ffd24a';g.textAlign='right';g.fillText('WINS '+RS.wins+'/'+RS.races,W-20,180)});splane(5.6,2.2,0,2.0,-RZ+.03,0,new THREE.MeshBasicMaterial({map:sc,side:THREE.DoubleSide}))}
 /* track posters on the side walls */
 TRACKS.forEach((T,i)=>{const pt=tx(256,320,(g,W,H)=>{g.fillStyle='#14141a';g.fillRect(0,0,W,H);g.fillStyle='#ffd24a';g.font='bold 20px monospace';g.textAlign='center';g.fillText(T.name,W/2,30);
   const xs=T.CP.map(p=>p[0]),zs=T.CP.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs),sc=Math.min((W-40)/(x1-x0),(H-110)/(z1-z0)),ox=(W-(x1-x0)*sc)/2,oy=60+((H-110)-(z1-z0)*sc)/2;
   g.strokeStyle='#fff';g.lineWidth=7;g.lineJoin='round';g.beginPath();const n=T.CP.length;for(let k=0;k<=40*n;k++){const ii=Math.floor(k/40)%n,f=(k%40)/40,pp=cr(T.CP[(ii+n-1)%n],T.CP[ii],T.CP[(ii+1)%n],T.CP[(ii+2)%n],f),X=ox+(pp[0]-x0)*sc,Z=oy+(pp[1]-z0)*sc;k?g.lineTo(X,Z):g.moveTo(X,Z)}g.stroke();
   g.fillStyle='#f03030';g.fillRect(ox+(T.CP[0][0]-x0)*sc-5,oy+(T.CP[0][1]-z0)*sc-5,10,10);g.fillStyle='#9fe';g.font='bold 16px monospace';g.fillText(T.note,W/2,H-30)});
   splane(1.5,1.9,-RX+.03,1.9,-2+i*2.3,Math.PI/2,new THREE.MeshBasicMaterial({map:pt,side:THREE.DoubleSide}))});
 /* booking desk + clerk */
 B(-2.6,0,-RZ+2.3,4.6,1.0,.8,0xc01020);B(-2.6,1.0,-RZ+2.3,4.7,.07,.9,0x14141a);B(-3.6,1.07,-RZ+2.3,.6,.4,.05,0x202228);B(-1.6,1.07,-RZ+2.3,.6,.4,.05,0x202228);
 clerk=personIn(pSpec(4455,{f:true,hs:2,ts:1,gl:false,scarf:null,bp:false,bag:0,old:false,tc:[.8,.1,.15],sk:PSK[1]}),-2.6,-RZ+1.5,0);SG.add(clerk);
 /* showpiece rival car on a turntable */
 showCar=mkRival(0xd02030,1);showCar.visible=true;SG.add(showCar);showCar.position.set(3.0,.35,-RZ+3.2);showCar.scale.setScalar(.8);B(3.0,0,-RZ+3.2,3.6,.35,5.4,0x14141a);
 /* trophy cabinet along the east wall */
 B(RX-.5,0,0,.8,.3,3.8,0x2a160a);B(RX-.5,.3,0,.8,1.6,3.8,0x14141a);splane(3.6,1.5,RX-.88,1.05,0,-Math.PI/2,new THREE.MeshBasicMaterial({color:0x1a2a3a,transparent:true,opacity:.45,side:THREE.DoubleSide}));
 const cup=(z,y,col)=>{const m=new THREE.MeshBasicMaterial({color:col}),c1=new THREE.Mesh(new THREE.CylinderGeometry(.14,.07,.22,10),m);c1.position.set(RX-.55,y+.15,z);SG.add(c1);const c2=new THREE.Mesh(new THREE.CylinderGeometry(.05,.1,.12,10),m);c2.position.set(RX-.55,y+.02,z);SG.add(c2)};
 const cols=[0xffd24a,0xd0d4dc,0xcd7f32];let k=0;RS.tro.forEach((n,ti)=>{for(let q=0;q<Math.min(n,4);q++){cup(-1.4+(k%4)*.9,.45+Math.floor(k/4)*.7,cols[ti]);k++}});if(!k){const m=new THREE.Mesh(new THREE.BoxGeometry(.02,.02,.02),new THREE.MeshBasicMaterial({color:0}));SG.add(m)}
 /* lounge: sofa + table */
 B(-RX+1.0,0,2.4,1.0,.45,2.6,0x8a1020);B(-RX+.55,.45,2.4,.3,.5,2.6,0x8a1020);B(-RX+2.3,0,2.4,.9,.35,1.2,0x2a160a);
 /* spawn clear zone + doorway; collision */
 IROOM.splice(0,IROOM.length,[-RX-1,RX+1,-RZ-1,-RZ+.9],[-5.0,-.2,-RZ+1.9,-RZ+2.7],[1.2,4.8,-RZ+.5,-RZ+5.9],[RX-1,RX+1,-2,2],[-RX,-RX+1.5,1.1,3.7]);
 SHOPCUR={o:o,k:['CLERK',"Welcome to the Cozy Motorsport Club. Book a race and we'll fly you to the circuit."]};
 IA.splice(0,IA.length,{r:[-4.6,-.6,-RZ+2.7,-RZ+3.6],label:'BOOK A RACE',fn:()=>bookOpen(0)},{r:[RX-2.4,RX-1,-2.2,2.2],label:'TROPHIES & RECORDS',fn:()=>bookOpen(2)},{r:[-1.0,1.0,RZ-.3,RZ],label:'LEAVE',fn:()=>leaveShop()});
 try{addVisitors(o)}catch(e){czErr(e,"racing.js")}}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(showCar&&GS.inside&&SHOPCUR&&SHOPCUR.o&&SHOPCUR.o.race)showCar.rotation.y+=dt*.5}}
/* ---------------------------------------------------------------- booking overlay */
let BK=null;
function bookOpen(tab){if(BK||busy||RC.on)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:60;background:rgba(0,0,10,.7);font:bold 13px monospace;color:#fff;display:flex;align-items:center;justify-content:center;user-select:none;-webkit-user-select:none';document.body.appendChild(ov);
 const pn=document.createElement('div');pn.style.cssText='width:min(94vw,560px);max-height:90vh;overflow:auto;background:#10131e;border:3px solid #ffd23a;box-shadow:4px 4px 0 #000;padding:10px;box-sizing:border-box';ov.appendChild(pn);pn.onpointerdown=e=>e.stopPropagation();
 BK={ov,pn,tab:tab||0,track:0,cls:1,laps:3,ch:1};BK.kd=e=>{if(e.key==='Escape')bookClose()};addEventListener('keydown',BK.kd);bookRender()}
function bookClose(){if(!BK)return;removeEventListener('keydown',BK.kd);BK.ov.remove();BK=null;busy=0}
function bookRender(){const K=BK,pn=K.pn;pn.textContent='';const el=(t,css,txt,par)=>{const e=document.createElement(t);if(css)e.style.cssText=css;if(txt!=null)e.textContent=txt;(par||pn).appendChild(e);return e};
 const bt=(par,txt,on,fn,dis)=>{const b=el('button','font:bold 13px monospace;border:2px solid '+(on?'#ffd23a':'#556')+';border-radius:6px;color:#fff;background:'+(on?'#7a1a24':'#242838')+';padding:7px 10px;margin:3px;touch-action:manipulation;'+(dis?'opacity:.4;':''),txt,par);b.onclick=e=>{e.stopPropagation();fn()};return b};
 const hd=el('div','display:flex;justify-content:space-between;align-items:center;margin-bottom:6px');el('div','font-size:16px;color:#ffd23a','COZY MOTORSPORT CLUB',hd);bt(hd,'CLOSE',0,bookClose);
 const tabs=el('div','margin-bottom:6px');['QUICK RACE','CHAMPIONSHIP','RECORDS'].forEach((t,i)=>bt(tabs,t,K.tab===i,()=>{K.tab=i;bookRender()}));
 const car=()=>CARN[CARI]+' · TOP SPEED '+Math.round(MAXV);
 el('div','color:#9fe;margin:4px 0','YOUR CAR: '+car()+'   ·   CASH £'+Math.round(cash));
 if(K.tab===0){el('div','margin-top:6px;color:#f5e6a0','CIRCUIT');const r1=el('div');TRACKS.forEach((T,i)=>{prep(T);bt(r1,T.name+' · '+(T.LEN/1000).toFixed(2)+' KM · '+T.note,K.track===i,()=>{K.track=i;bookRender()})});
  el('div','margin-top:6px;color:#f5e6a0','CLASS (RIVALS GET FASTER)');const r2=el('div');CLASSES.forEach((c,i)=>bt(r2,c.name+' · ENTRY £'+c.fee+' · WIN £'+Math.round(c.prize[0]*K.laps/3),K.cls===i,()=>{K.cls=i;bookRender()}));
  el('div','margin-top:6px;color:#f5e6a0','LAPS (PRIZES SCALE WITH LAPS)');const r3=el('div');[3,5,8].forEach(n=>bt(r3,n+' LAPS',K.laps===n,()=>{K.laps=n;bookRender()}));
  const c=CLASSES[K.cls],pz=c.prize.slice(0,4).map((p,i)=>ord(i+1)+' £'+Math.round(p*K.laps/3)).join('  ');el('div','margin-top:6px;color:#9fe',pz);
  bt(el('div','margin-top:8px;text-align:center'),'BOOK & GO TO THE CIRCUIT  (-£'+c.fee+')',1,()=>{if(cash<c.fee){toast('NOT ENOUGH CASH');return}const T=TRACKS[K.track],laps=K.laps;bookClose();cash-=c.fee;if(!raceStart(T,c,laps,-1))cash+=c.fee},cash<c.fee)}
 else if(K.tab===1){const ch=RS.ch;
  if(!ch||!ch.active){el('div','margin-top:6px;color:#f5e6a0','COZY GRAND SEASON: 4 ROUNDS ACROSS BOTH CIRCUITS. POINTS 10-8-6-4-3-2. TOP 3 WIN A TROPHY + BONUS PRIZE.');
   el('div','margin-top:6px;color:#f5e6a0','CLASS');const r2=el('div');CLASSES.forEach((c,i)=>bt(r2,c.name+' · SEASON ENTRY £'+c.fee*2+' · TITLE BONUS £'+c.bonus[0],K.cls===i,()=>{K.cls=i;bookRender()}));
   const c=CLASSES[K.cls];bt(el('div','margin-top:8px;text-align:center'),'ENTER THE SEASON  (-£'+c.fee*2+')',1,()=>{if(cash<c.fee*2){toast('NOT ENOUGH CASH');return}cash-=c.fee*2;RS.ch={active:true,cls:K.cls,round:0,pts:[0,0,0,0,0,0]};bookRender()},cash<c.fee*2)}
  else{const c=CLASSES[ch.cls],rd=ROUNDS[ch.round],T=TRACKS[rd.t];el('div','margin-top:6px;color:#f5e6a0',c.name+' · ROUND '+(ch.round+1)+' OF '+ROUNDS.length);
   const names=['YOU'].concat(RIV.map(r=>r[0])),ord2=ch.pts.map((p,i)=>[p,i]).sort((a,b)=>b[0]-a[0]);ord2.forEach((o,i)=>el('div','padding:2px 6px;'+(o[1]===0?'color:#ffd24a':''),(i+1)+'. '+names[o[1]]+'  —  '+o[0]+' PTS'));
   el('div','margin-top:6px;color:#9fe','NEXT: '+T.name+' · '+rd.laps+' LAPS');
   const r=el('div','margin-top:8px;text-align:center');bt(r,'START ROUND '+(ch.round+1),1,()=>{const T2=T;bookClose();raceStart(T2,c,rd.laps,ch.round)});bt(r,'WITHDRAW',0,()=>{RS.ch=null;bookRender()})}}
 else{el('div','margin-top:6px;color:#f5e6a0','TROPHY CABINET');el('div','','GOLD '+RS.tro[0]+'   SILVER '+RS.tro[1]+'   BRONZE '+RS.tro[2]);el('div','','RACES '+RS.races+'   WINS '+RS.wins);
  TRACKS.forEach(T=>{const r=rec(T);prep(T);el('div','margin-top:6px;color:#9fe',T.name+'  ('+(T.LEN/1000).toFixed(2)+' KM)');el('div','','BEST LAP '+fmt(r.lap)+'   BEST RACE '+fmt(r.race))})}}
window.RACING={RC,RS,TRACKS,CLASSES,prep,posAt,raceStart,raceEnd,raceQuit,bookOpen,bookClose,CLUB,get BK(){return BK}};
})();
