/* ===== CASINO EXTRAS: cage + loyalty comps, craps, big wheel, hold'em poker, 3D reel slots + progressive jackpot,
   gold-card VIP room, bar, lounge singer and wandering gamblers. Builds on casinogames.js (window.CG). =====
   Table games use casino CHIPS (buy / cash out at the cage). Play earns loyalty points -> comps. Win £300 in total for the Gold card. */
(function(){
const C=window.CG,S=C.S,TAU=C.TAU,{mk,BTN,bmat,cvx,bxg,flat,wall,sign,money,chipRow,TY,ease,lerpf,clampf}=C;
const G2=new THREE.Group(),PPL=[],WALK=[];let built=false;
const B2=(x,y,z,w,h,d,hex)=>bxg(x,y,z,w,h,d,hex,G2);
const cyl=(r,h,x,y,z,hex,seg)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,seg||20),bmat({color:hex,side:THREE.FrontSide}));m.position.set(x,y+h/2,z);G2.add(m);return m};
const VIPW=300,vipOK=()=>S.win>=VIPW;
const mkCam=c=>()=>{DZ.look.copy(C.wv(c.look));return C.wv(c.pos)};
const wv=C.wv;
function ovBase(title,onLeave){const ov=mk('div','position:fixed;inset:0;z-index:60;font:bold 13px monospace;color:#fff;pointer-events:none;user-select:none;-webkit-user-select:none;touch-action:none');document.body.appendChild(ov);
 const top=mk('div','position:absolute;left:0;right:0;top:6px;display:flex;justify-content:space-between;align-items:flex-start;padding:0 8px;text-shadow:2px 2px 0 #000',null,ov);
 const bal=mk('div','font-size:16px;color:#ffe890;min-width:110px',null,top),mid=mk('div','text-align:center;flex:1',null,top);mk('div','color:#f5e6a0;font-size:15px',title,mid);const msg=mk('div','min-height:18px;color:#9fe;margin-top:2px;font-size:14px',null,mid);
 const lv=mk('button',BTN+'font-size:12px;min-width:60px','LEAVE',top);lv.onclick=onLeave;
 const pn=mk('div','position:absolute;left:0;right:0;bottom:0;padding:8px 6px 10px;background:linear-gradient(0deg,rgba(0,0,0,.85),rgba(0,0,0,.4));display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap;pointer-events:auto',null,ov);pn.onpointerdown=e=>e.stopPropagation();
 return{ov,bal,msg,lv,pn,mid}}
const btn=(par,txt,bg,fn,extra)=>{const b=mk('button',BTN+'background:'+bg+';'+(extra||''),txt,par);b.onclick=e=>{e.stopPropagation();fn()};return b};
const people=(seed,f,hs,tc,sk,beard)=>pSpec(seed,{f:f,hs:hs,ts:1,beard:!!beard,gl:false,scarf:null,bp:false,bag:0,old:false,tc:tc,sk:PSK[sk]});
const addP=(sp,x,z,ry,seated)=>{const p=personIn(sp,x,z,ry,seated);PPL.push(p);return p};
const rv=c=>c.r==='A'?14:c.r==='K'?13:c.r==='Q'?12:c.r==='J'?11:+c.r;
const newDeck=()=>{const d=[];for(const s of C.SUITS)for(const r of C.RANKS)d.push({r,s});for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}return d};
const CATN=['HIGH CARD','A PAIR','TWO PAIR','THREE OF A KIND','A STRAIGHT','A FLUSH','A FULL HOUSE','FOUR OF A KIND','A STRAIGHT FLUSH'];
function eval5(cs){const v=cs.map(rv).sort((a,b)=>b-a),fl=cs.every(c=>c.s===cs[0].s);let st=0;if(new Set(v).size===5){if(v[0]-v[4]===4)st=v[0];else if(v[0]===14&&v[1]===5)st=5}
 const cnt={};v.forEach(x=>cnt[x]=(cnt[x]||0)+1);const grp=Object.entries(cnt).map(([k,n])=>[+k,n]).sort((a,b)=>b[1]-a[1]||b[0]-a[0]),sig=grp.map(g=>g[1]).join(''),gv=grp.map(g=>g[0]);let cat,tb;
 if(st&&fl){cat=8;tb=[st]}else if(sig==='41'){cat=7;tb=gv}else if(sig==='32'){cat=6;tb=gv}else if(fl){cat=5;tb=v}else if(st){cat=4;tb=[st]}else if(sig==='311'){cat=3;tb=gv}else if(sig==='221'){cat=2;tb=gv}else if(sig==='2111'){cat=1;tb=gv}else{cat=0;tb=v}
 let sc=cat;for(let i=0;i<5;i++)sc=sc*15+(tb[i]||0);return sc}
function best(cs){let b=-1;const n=cs.length;(function rec(s,k,arr){if(k===5){const sc=eval5(arr);if(sc>b)b=sc;return}for(let i=s;i<=n-(5-k);i++){arr.push(cs[i]);rec(i+1,k+1,arr);arr.pop()}})(0,0,[]);return b}
const catOf=sc=>Math.floor(sc/759375);
const tweenList=(list,dt)=>{for(const m of list){const u=m.userData;if(!u.from)continue;if(u.t<1){u.t+=dt/.35;if(u.t>=0){const e=ease(clampf(u.t,0,1)),f=u.from,t=u.to;m.position.set(lerpf(f[0],t[0],e),lerpf(f[1],t[1],e)+Math.sin(e*Math.PI)*.1,lerpf(f[2],t[2],e))}}}};
const mkCard=(c,hidden,from,to,delay,parent)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(.1,.14).rotateX(-Math.PI/2),bmat({map:C.cardTex(hidden?null:c)}));m.userData={c,from,to,t:-(delay||0)};m.position.set(from[0],from[1],from[2]);(parent||G2).add(m);return m};
/* ---------------- 3D reel strip shared by all slot machines ---------------- */
let STRIP=null;const strip=()=>STRIP||(STRIP=cvx(2048,188,(g,W,H)=>{g.fillStyle='#f6f0dc';g.fillRect(0,0,W,H);for(let k=0;k<10;k++){g.save();g.translate((k+.5)*W/10,H/2);g.rotate(Math.PI/2);drawSym(g,k,0,0,58);g.restore();g.strokeStyle='#b8a878';g.lineWidth=3;g.beginPath();g.moveTo(k*W/10,0);g.lineTo(k*W/10,H);g.stroke()}}));
function mkReel(r,w){const g=new THREE.CylinderGeometry(r,r,w,40,1,true).rotateZ(Math.PI/2),pos=g.attributes.position,col=new Float32Array(pos.count*3);for(let i=0;i<pos.count;i++){const a=Math.atan2(pos.getY(i),pos.getZ(i)),f=.4+.6*Math.max(0,Math.cos(a));col[i*3]=col[i*3+1]=col[i*3+2]=f}g.setAttribute('color',new THREE.BufferAttribute(col,3));return new THREE.Mesh(g,bmat({map:strip(),vertexColors:true,side:THREE.FrontSide}))}
const symAng=k=>TAU*(k+.5)/10;
const MACH=[];
function addMachine(o){const g=new THREE.Group();g.position.set(o.x,o.y,o.z);g.rotation.y=o.ry;G2.add(g);o.reels=[0,1,2].map(i=>{const r=mkReel(o.r,o.w);r.position.set((i-1)*o.sp,0,o.zc);r.rotation.x=symAng(Math.floor(Math.random()*10));g.add(r);return r});MACH.push(o);return o}
/* progressive jackpot readout */
const JPC=document.createElement('canvas');JPC.width=512;JPC.height=96;const JPT=new THREE.CanvasTexture(JPC);JPT.minFilter=JPT.magFilter=THREE.LinearFilter;JPT.generateMipmaps=false;let jpShown=-1;
function jpDraw(){const v=Math.round(S.jp);if(v===jpShown)return;jpShown=v;const g=JPC.getContext('2d');g.fillStyle='#120204';g.fillRect(0,0,512,96);g.strokeStyle='#f0c030';g.lineWidth=6;g.strokeRect(5,5,502,86);g.fillStyle='#ff3030';g.font='bold 62px monospace';g.textAlign='center';g.textBaseline='middle';g.fillText('£'+v,256,52);JPT.needsUpdate=true}
/* ---------------- big wheel textures ---------------- */
const BWV=(()=>{const list=[];[[1,24],[2,15],[5,7],[10,4],[20,2],[40,2]].forEach(([v,n])=>{for(let i=0;i<n;i++)list.push(v)});const seq=new Array(54);list.forEach((v,j)=>{seq[(j*17)%54]=v});return seq})();
const BWC={1:'#2a6ac0',2:'#e8a020',5:'#c02a2a',10:'#2a9a4a',20:'#8a2ab0',40:'#141418'};
function bwTex(){return cvx(1024,1024,g=>{g.translate(512,512);g.fillStyle='#2a1608';g.beginPath();g.arc(0,0,512,0,TAU);g.fill();const D=TAU/54;
 for(let i=0;i<54;i++){const a0=i*D,a1=(i+1)*D,v=BWV[i];g.fillStyle=BWC[v];g.beginPath();g.moveTo(0,0);g.arc(0,0,490,a0,a1);g.closePath();g.fill();g.strokeStyle='#f0d070';g.lineWidth=3;g.beginPath();g.moveTo(Math.cos(a0)*120,Math.sin(a0)*120);g.lineTo(Math.cos(a0)*490,Math.sin(a0)*490);g.stroke();
  const am=(i+.5)*D;g.save();g.translate(Math.cos(am)*400,Math.sin(am)*400);g.rotate(am+Math.PI/2);g.fillStyle=v===40?'#ffd24a':'#fff';g.font='bold '+(v===40?46:50)+'px Impact,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(String(v),0,0);g.restore()}
 g.fillStyle='#e8bf4a';g.beginPath();g.arc(0,0,130,0,TAU);g.fill();g.fillStyle='#8a1428';g.beginPath();g.arc(0,0,100,0,TAU);g.fill();g.fillStyle='#ffd24a';g.font='bold 62px Impact,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('BIG',0,-24);g.fillText('WHEEL',0,34);
 g.strokeStyle='#e8bf4a';g.lineWidth=14;g.beginPath();g.arc(0,0,500,0,TAU);g.stroke()})}
/* ---------------- craps felt + dice textures ---------------- */
const CTX=-6.2,CTZ=4.0,CW=3.3,CD=1.2;
const crW=(cx,cy)=>[CTX+(cx/1024-.5)*CW,TY+.012,CTZ+(cy/384-.5)*CD];
const PTX=[4,5,6,8,9,10],ptCX=i=>135+i*150.7;
function crapsFelt(){return cvx(1024,384,(g,W,H)=>{g.fillStyle='#146a34';g.fillRect(0,0,W,H);g.strokeStyle='#e8d8a0';g.fillStyle='#e8d8a0';g.lineWidth=3;g.textAlign='center';g.textBaseline='middle';
 const box=(x,y,w,h,t,sz,col)=>{g.strokeRect(x,y,w,h);if(t){g.fillStyle=col||'#e8d8a0';g.font='bold '+(sz||26)+'px Georgia,serif';g.fillText(t,x+w/2,y+h/2+2)}};
 box(60,10,420,66,'ANY CRAPS  7 TO 1',26);box(544,10,420,66,'ANY SEVEN  4 TO 1',26);
 box(150,88,724,92,'',0);g.fillStyle='#e8d8a0';g.font='bold 30px Georgia,serif';g.fillText('FIELD',512,112);g.font='bold 28px Georgia,serif';g.fillText('2   3   4   9   10   11   12',512,152);
 for(let i=0;i<6;i++){const x=ptCX(i)-70;g.strokeStyle='#e8d8a0';g.strokeRect(x,190,140,78);g.fillStyle=PTX[i]===6||PTX[i]===9?'#f0c0c0':'#e8d8a0';g.font='bold '+(PTX[i]===6||PTX[i]===9?30:44)+'px Georgia,serif';g.fillText(PTX[i]===6?'SIX':PTX[i]===9?'NINE':String(PTX[i]),ptCX(i),229)}
 g.strokeStyle='#e8d8a0';g.fillStyle='#e8d8a0';g.strokeRect(60,284,904,40);g.font='bold 24px Georgia,serif';g.fillText("DON'T PASS BAR",512,305);
 g.strokeStyle='#f0c030';g.lineWidth=5;g.strokeRect(40,332,944,44);g.fillStyle='#f0c030';g.font='bold 32px Georgia,serif';g.fillText('PASS LINE',512,355)})}
const PIPS={1:[[.5,.5]],2:[[.25,.25],[.75,.75]],3:[[.25,.25],[.5,.5],[.75,.75]],4:[[.25,.25],[.75,.25],[.25,.75],[.75,.75]],5:[[.25,.25],[.75,.25],[.5,.5],[.25,.75],[.75,.75]],6:[[.25,.22],[.75,.22],[.25,.5],[.75,.5],[.25,.78],[.75,.78]]};
const DFACE=[3,4,1,6,2,5];let DMAT=null;
const diceMats=()=>DMAT||(DMAT=DFACE.map(v=>bmat({map:cvx(64,64,(g,W)=>{g.fillStyle='#f6f2e6';g.fillRect(0,0,W,W);g.strokeStyle='#bbb';g.lineWidth=4;g.strokeRect(2,2,W-4,W-4);g.fillStyle=v===1?'#d01020':'#15151a';for(const[x,y]of PIPS[v]){g.beginPath();g.arc(x*W,y*W,v===1?9:6,0,TAU);g.fill()}}),side:THREE.FrontSide})));
const FACEN=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
const dieQuat=(v,yaw)=>{const n=FACEN[DFACE.indexOf(v)],q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(...n),new THREE.Vector3(0,1,0));return new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),yaw).multiply(q)};
/* ====================================================== BUILD ====================================================== */
function build2(){built=true;
 /* ---- cashier cage (south wall, west of the door) ---- */
 B2(-7.2,0,6.95,4.4,1.05,.7,0x3a2410);B2(-7.2,1.05,6.9,4.6,.08,.8,0xe8bf4a);B2(-7.2,0,7.9,4.4,2.6,.2,0x2a160a);
 for(let i=0;i<18;i++)B2(-9.1+i*.25,1.13,6.65,.04,1.1,.04,0xe8bf4a);B2(-7.2,2.23,6.62,4.6,.1,.16,0xe8bf4a);
 wall(2.6,.62,-7.2,3.0,7.84,Math.PI,sign('CASHIER',2,'#2a1006','#ffd24a'));
 addP(people(5521,true,2,[.1,.1,.2],1),-7.2,7.5,Math.PI);
 /* ---- bar + bartender (south wall, east of the door) ---- */
 B2(5.5,0,6.9,3.8,1.08,.6,0x4a2812);B2(5.5,1.08,6.85,4.0,.07,.7,0x8a5a2a);B2(5.5,0,7.9,3.8,2.1,.2,0x2a160a);B2(5.5,1.4,7.75,3.8,.06,.3,0x5a3418);B2(5.5,1.85,7.75,3.8,.06,.3,0x5a3418);
 const bc=[0x2a8a3a,0xc02a2a,0xe8a020,0x2a6ac0,0x8a2ab0,0xd8d8d8];for(let i=0;i<14;i++){B2(3.8+i*.26,1.46,7.72,.1,.34,.1,bc[i%6]);B2(3.8+i*.26,1.91,7.72,.1,.3,.1,bc[(i+3)%6])}
 wall(1.5,.55,5.5,2.9,7.9,Math.PI,sign('BAR',2,'#2a1006','#ffd24a'));for(let i=0;i<3;i++){cyl(.2,.05,4.3+i*1.3,.46,6.2,0x8a1428,16);cyl(.03,.46,4.3+i*1.3,0,6.2,0x888888,8)}
 PPL.bar=addP(people(7134,false,1,[.9,.9,.92],2,true),5.5,7.4,Math.PI);
 /* ---- stage + singer ---- */
 B2(9.3,0,6.7,2.8,.3,2.4,0x2a160a);B2(9.3,.3,6.7,2.8,.04,2.4,0x6a1a2a);B2(10.35,.3,6.0,.5,1.2,.5,0x15151a);B2(8.25,.3,7.55,.5,1.2,.4,0x15151a);cyl(.02,1.3,9.1,.34,6.6,0x888888,8);B2(9.1,1.62,6.6,.12,.1,.1,0x222222);
 PPL.singer=addP(people(9001,true,3,[.7,.1,.3],0),9.3,7.1,Math.PI+.52);PPL.singer.position.y=.3;
 /* ---- craps table ---- */
 B2(CTX,0,CTZ,3.5,.82,1.4,0x2a160a);B2(CTX,.82,CTZ,3.6,.08,1.5,0x4a2812);flat(CW,CD,CTX,TY+.006,CTZ,crapsFelt(),G2);
 for(const[x,z,w,d]of[[CTX,CTZ-.72,3.6,.1],[CTX,CTZ+.72,3.6,.1],[CTX-1.77,CTZ,.1,1.5],[CTX+1.77,CTZ,.1,1.5]])B2(x,TY,z,w,.1,d,0x6a3a18);
 const puck=new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.012,20),bmat({color:0x111111,side:THREE.FrontSide}));puck.position.set(...crW(60,300));G2.add(puck);CRP.puck=puck;
 CRP.dice=[0,1].map(()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.085,.085,.085),diceMats());m.position.set(CTX+1.2,TY+.04,CTZ-.2);m.visible=false;G2.add(m);return m});
 CRP.chips=new THREE.Group();G2.add(CRP.chips);
 /* ---- poker table ---- */
 cyl(1.3,.82,5.5,0,3.4,0x2a160a,32);cyl(1.38,.08,5.5,.82,3.4,0x4a2812,32);const pf=new THREE.Mesh(new THREE.CircleGeometry(1.24,32).rotateX(-Math.PI/2),bmat({map:cvx(256,256,(g)=>{g.fillStyle='#1a5a8a';g.fillRect(0,0,256,256);g.strokeStyle='#e8d8a0';g.lineWidth=4;g.beginPath();g.arc(128,128,112,0,TAU);g.stroke();g.fillStyle='#e8d8a0';g.font='bold 20px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillText("TEXAS HOLD'EM",128,200)})}));pf.position.set(5.5,TY+.004,3.4);G2.add(pf);
 [[5.5,5.0],[3.75,3.4],[5.5,1.78],[7.25,3.4]].forEach(([x,z],i)=>{cyl(.22,.5,x,0,z+(i===2?-.05:i===0?.05:0),0x3a1a1a,14)});
 PPL.pk=[addP(people(1111,true,1,[.9,.5,.2],1),3.75,3.4,Math.PI/2,true),addP(people(2222,false,0,[.2,.3,.6],2,true),5.5,1.72,0,true),addP(people(3333,false,3,[.4,.1,.1],0,true),7.25,3.4,-Math.PI/2,true)];
 /* ---- big wheel (west wall) ---- */
 B2(-10.95,0,-1.6,.2,.9,1.5,0x3a1c0c);B2(-10.9,.9,-1.6,.14,2.1,2.3,0x2a160a);
 const bwg=new THREE.Group();bwg.position.set(-10.78,2.0,-1.6);bwg.rotation.y=Math.PI/2;G2.add(bwg);
 const disc=new THREE.Mesh(new THREE.CircleGeometry(.98,64),bmat({map:bwTex(),side:THREE.FrontSide}));disc.position.z=.02;bwg.add(disc);BWG.disc=disc;
 const rim=new THREE.Mesh(new THREE.RingGeometry(.98,1.06,64),bmat({color:0xe8bf4a}));rim.position.z=.03;bwg.add(rim);
 const ptr=new THREE.Mesh(new THREE.ConeGeometry(.07,.22,10),bmat({color:0xff3030}));ptr.rotation.z=Math.PI;ptr.position.set(0,1.1,.06);bwg.add(ptr);
 wall(1.6,.45,-10.84,3.45,-1.6,Math.PI/2,sign('BIG WHEEL',2,'#3a0610','#ffd24a'));
 /* ---- wall fruit machines: real 3D reels ---- */
 for(const sd of[-1,1])C.SLOTZ.forEach(z=>addMachine({id:'w'+sd+z,jp:false,stakes:[1,5,25],x:sd*10.08,y:1.056,z,ry:-sd*Math.PI/2,r:.35,w:.2,sp:.237,zc:-.28,cam:[sd*8.5,1.3,z],look:[sd*10.1,1.06,z],fov:40,name:'FRUITY FORTUNE'}));
 /* ---- VIP room: rope, table, jackpot machines ---- */
 const post=(x,z)=>{cyl(.05,1.0,x,0,z,0xf0c030,10);cyl(.09,.04,x,0,z,0xf0c030,12);const b=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),bmat({color:0xf0c030}));b.position.set(x,1.06,z);G2.add(b)};
 const rope=(x0,z0,x1,z1)=>{const L=Math.hypot(x1-x0,z1-z0),m=new THREE.Mesh(new THREE.BoxGeometry(.04,.04,L),bmat({color:0xb01028}));m.position.set((x0+x1)/2,.92,(z0+z1)/2);m.rotation.y=Math.atan2(x1-x0,z1-z0);G2.add(m)};
 for(const x of[-3.2,3.2]){for(let z=-7.4;z<=-3.5;z+=1.3)post(x,z);rope(x,-7.4,x,-3.5)}
 post(-3.2,-3.5);post(3.2,-3.5);post(-.65,-3.5);post(.65,-3.5);rope(-3.2,-3.5,-.65,-3.5);rope(.65,-3.5,3.2,-3.5);
 GATE.m=new THREE.Group();const gr=new THREE.Mesh(new THREE.BoxGeometry(1.3,.05,.05),bmat({color:0xb01028}));gr.position.set(0,.92,-3.5);GATE.m.add(gr);G2.add(GATE.m);
 B2(0,0,-5.75,6.2,.03,4.3,0x5a0c1c).position.y=.03;
 wall(2.4,.6,0,3.0,-7.86,0,sign('HIGH ROLLERS',2,'#1a0a30','#ff5ae8'));
 C.bjTable(0,-6.3,'#5a0c1c');addP(people(6677,false,2,[.1,.1,.1],1),0,-6.75,0);
 for(const sx of[-1,1]){const x=sx*2.4;B2(x,0,-7.65,1.2,2.3,.7,0x8a1020);B2(x,2.3,-7.7,1.3,.35,.8,0xe8bf4a);B2(x,0,-7.27,1.1,.5,.06,0x2a2a30);
  const jp=new THREE.Mesh(new THREE.PlaneGeometry(.9,.17),bmat({map:JPT}));jp.position.set(x,2.02,-7.285);G2.add(jp);
  const hd=new THREE.Mesh(new THREE.PlaneGeometry(1.0,.2),bmat({map:sign('MEGA JACKPOT',2,'#3a0610','#ffd24a')}));hd.position.set(x,2.3,-7.285);G2.add(hd);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(1.08,.6),bmat({color:0x0c0404}));win.position.set(x,1.35,-7.29);G2.add(win);
  addMachine({id:'jp'+sx,jp:true,stakes:[5,25,100],x:x,y:1.35,z:-7.29,ry:0,r:.4,w:.28,sp:.32,zc:-.32,cam:[x,1.7,-5.1],look:[x,1.5,-7.3],fov:42,name:'MEGA JACKPOT'})}
 jpDraw();
 /* ---- gamblers wandering the hall ---- */
 [[3301,true,1,[.2,.5,.3],1,[[-3.0,-2.6],[-3.0,6.1]]],[4402,false,4,[.5,.4,.1],2,[[3.0,-2.6],[3.0,5.9]]],[5503,true,0,[.3,.2,.5],0,[[-8.5,-2.0],[8.5,-2.0]]]].forEach(([sd,f,hs,tc,sk,path],i)=>{const sp=people(sd,f,hs,tc,sk,!f&&i===1),p=addP(sp,path[0][0],path[0][1],0);WALK.push({p,path,k:1,wait:1+i,ph:Math.random()*6,sp:.75+i*.1})})}
const BWG={},CRP={},GATE={};
/* ====================================================== CAGE ====================================================== */
let CG_=null;const freePaint=()=>{for(let i=0;i<PN.length;i++)if(!OWN.paint[i])return i;return -1};
function cageOpen(){if(CG_||busy)return;const R=CG_={cam:{pos:[-7.2,1.75,5.0],look:[-7.2,1.3,7.3]}};C.gOpen(mkCam(R.cam),48);const u=R.u=ovBase('CASHIER',()=>cageClose());R.ov=u.ov;R.kd=e=>{if(e.key==='Escape')cageClose()};addEventListener('keydown',R.kd);cageUI()}
function cageUI(){const R=CG_,u=R.u;u.bal.textContent='CASH '+money(cash);u.pn.textContent='';u.pn.style.flexDirection='column';
 const info=mk('div','text-align:center;color:#ffe890;font-size:14px',null,u.pn);info.textContent='CHIPS '+money(S.chips)+'   |   POINTS '+Math.floor(S.pts)+'   |   WINNINGS '+money(S.win)+(vipOK()?'   |   GOLD CARD HOLDER':' / '+money(VIPW)+' FOR GOLD');
 const row=(label,vals,bg,fn)=>{const r=mk('div','display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center',null,u.pn);mk('span','min-width:76px;text-align:right',label,r);vals.forEach(v=>{const b=btn(r,v[0],bg,()=>fn(v[1]),'padding:5px 8px');if(v[2]){b.style.opacity=.4}});return r};
 const buy=n=>{n=Math.min(n,Math.floor(cash));if(n<1){toast('NO CASH');return}cash-=n;S.chips+=n;beep(700,.06,'square',.05);cageUI()};
 const out=n=>{n=Math.min(n,Math.floor(S.chips));if(n<1){toast('NO CHIPS');return}S.chips-=n;cash+=n;beep(560,.06,'square',.05);cageUI()};
 row('BUY CHIPS',[['£50',50],['£100',100],['£250',250],['ALL',1e9]],'#2a7a3a',buy);row('CASH OUT',[['£50',50],['£100',100],['£250',250],['ALL',1e9]],'#7a4a1a',out);
 const comp=(txt,cost,fn,dis)=>{const b=btn(r2,txt+' ('+cost+' PTS)','#6a2a8a',()=>{if(dis&&dis()){toast('NOT AVAILABLE');return}if(S.pts<cost){toast('NOT ENOUGH POINTS');return}S.pts-=cost;fn();beep(880,.08,'square',.05);cageUI()},'padding:5px 8px');b.style.opacity=S.pts>=cost&&!(dis&&dis())?1:.4};
 const r2=mk('div','display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center',null,u.pn);mk('span','min-width:76px;text-align:right','COMPS',r2);
 comp('FREE DRINK',30,()=>{S.comp=(S.comp|0)+1;toast('FREE DRINK TOKEN! USE IT AT THE BAR')});
 comp('£50 CHIPS',100,()=>{S.chips+=50;toast('£50 BONUS CHIPS')});
 comp('FREE CAR SPRAY',250,()=>{const ix=freePaint();OWN.paint[ix]=1;toast('FREE SPRAY UNLOCKED: '+PN[ix])},()=>freePaint()<0);
 u.msg.textContent='1 POINT PER £10 YOU WAGER'}
function cageClose(){const R=CG_;if(!R)return;removeEventListener('keydown',R.kd);R.ov.remove();CG_=null;C.gClose()}
/* ====================================================== SLOTS ====================================================== */
let SLG=null;
function slOpen(m){if(SLG||busy)return;if(m.jp&&!vipOK()){toast('GOLD CARD ONLY - WIN '+money(VIPW)+' AT THE TABLES');return}if(C.needChips())return;
 const R=SLG={m,ph:'idle',bet:m.stakes[0],last:performance.now(),cam:{pos:m.cam.slice(),look:m.look.slice()}};C.gOpen(mkCam(R.cam),m.fov);
 const u=R.u=ovBase(m.name,()=>slClose());R.ov=u.ov;R.kd=e=>{if(e.key==='Escape')slClose()};addEventListener('keydown',R.kd);
 R.chips=chipRow(u.pn,m.stakes,R.bet,v=>{if(R.ph==='idle')R.bet=v});R.sp=btn(u.pn,'SPIN','#2a8a3a',()=>slSpin(),'font-size:16px;padding:8px 22px');
 if(m.jp){R.jpl=mk('div','position:absolute;left:0;right:0;top:44px;text-align:center;font-size:18px;color:#ff6060;text-shadow:2px 2px 0 #000',null,u.ov)}
 slUI();R.raf=requestAnimationFrame(slLoop)}
function slUI(){const R=SLG;if(!R)return;R.u.bal.textContent='CHIPS '+money(S.chips);R.u.lv.style.opacity=R.ph==='idle'?1:.35;R.sp.style.opacity=R.ph==='idle'?1:.4;if(R.jpl)R.jpl.textContent='JACKPOT '+money(S.jp)}
function slSpin(){const R=SLG;if(!R||R.ph!=='idle')return;if(S.chips<R.bet){toast('NOT ENOUGH CHIPS');return}S.chips-=R.bet;C.wager(R.bet);if(R.m.jp)S.jp+=R.bet*.12;
 const res=[0,1,2].map(()=>Math.floor(Math.random()*10));R.res=res;R.ph='spin';R.t=0;R.u.msg.textContent='';
 R.rl=R.m.reels.map((r,i)=>{const t=symAng(res[i]),d=((t-r.rotation.x)%TAU+TAU)%TAU;return{p0:r.rotation.x,D:TAU*(4+i*2)+d,T:1.3+i*.6,lk:0}});beep(300,.15,'sawtooth',.04);slUI()}
const SLMUL=[15,20,25,30,40,50,60,75,100];
function slPay(R){const[a,b,c]=R.res,bet=R.bet;let ret=0,txt='NO WIN',big=false;
 if(a===b&&b===c){if(a===9){if(R.m.jp){ret=Math.round(S.jp);S.jp=1000;txt='JACKPOT!!! '+money(ret);big=true}else{ret=bet*150;txt='THREE HEARTS! x150';big=true}}else{ret=bet*SLMUL[a];txt='THREE OF A KIND! x'+SLMUL[a]}}
 else if(a===b||b===c||a===c){ret=Math.floor(bet*1.5);txt=ret>bet?'PAIR!':'PAIR - STAKE BACK'}
 S.chips+=ret;if(ret>bet)C.won(ret-bet);R.u.msg.textContent=ret>bet?txt+' (+'+money(ret-bet)+')':txt;if(ret>bet)[0,1,2].forEach(i=>setTimeout(()=>beep(660+i*220,.12,'square',.06),i*110));
 if(big){R.flash=4;for(let i=0;i<16;i++)setTimeout(()=>beep(i%2?880:660,.12,'sawtooth',.05),i*220)}R.ph='idle';slUI()}
function slLoop(now){const R=SLG;if(!R)return;const dt=Math.min(.05,(now-R.last)/1000);R.last=now;
 if(R.ph==='spin'){R.t+=dt;let done=true;R.rl.forEach((s,i)=>{const u=Math.min(1,R.t/s.T),e=1-Math.pow(1-u,3),a=s.p0+s.D*e;R.m.reels[i].rotation.x=a;const k=Math.floor(a/(TAU/10));if(k!==s.lk){s.lk=k;if(u<1)beep(1200+i*100,.012,'square',.02)}if(u<1)done=false});if(done&&R.t>R.rl[2].T+.35)slPay(R)}
 if(R.flash>0){R.flash-=dt;R.u.ov.style.background=(Math.floor(R.flash*8)%2)?'rgba(255,40,40,.25)':'rgba(255,220,60,.2)';if(R.flash<=0)R.u.ov.style.background=''}
 if(R.jpl)R.jpl.textContent='JACKPOT '+money(S.jp);R.raf=requestAnimationFrame(slLoop)}
function slClose(){const R=SLG;if(!R||R.ph!=='idle')return;cancelAnimationFrame(R.raf);removeEventListener('keydown',R.kd);R.ov.remove();SLG=null;C.gClose()}
/* ====================================================== BIG WHEEL ====================================================== */
let BW=null;
function bwOpen(){if(BW||busy||C.needChips())return;const R=BW={ph:'bet',bets:{},stack:[],chip:5,last:performance.now(),a:BWG.disc.rotation.z,cam:{pos:[-7.9,2.0,-1.6],look:[-10.8,1.9,-1.6]},cells:{}};C.gOpen(mkCam(R.cam),46);
 const u=R.u=ovBase('BIG WHEEL',()=>bwClose());R.ov=u.ov;R.kd=e=>{if(e.key==='Escape')bwClose()};addEventListener('keydown',R.kd);
 const bd=mk('div','display:flex;gap:5px;flex-wrap:wrap;justify-content:center;width:100%',null,u.pn);
 [1,2,5,10,20,40].forEach(v=>{const b=btn(bd,v+' : 1','#'+({1:'2a6ac0',2:'a8700a',5:'c02a2a',10:'2a9a4a',20:'8a2ab0',40:'333'})[v],()=>bwBet(v),'position:relative;min-width:64px');const bg=mk('i','position:absolute;right:-3px;top:-6px;min-width:16px;height:16px;line-height:16px;border-radius:8px;background:#ffd040;color:#111;font:bold 10px/16px monospace;font-style:normal;padding:0 3px;display:none',null,b);R.cells[v]=bg});
 chipRow(u.pn,[1,5,25,100],5,v=>{R.chip=v});R.bc=btn(u.pn,'CLEAR','#7a2a2a',()=>bwClear());R.bs=btn(u.pn,'SPIN','#2a8a3a',()=>bwSpin(),'font-size:15px;padding:7px 18px');
 bwUI();R.raf=requestAnimationFrame(bwLoop)}
const bwTot=()=>Object.values(BW.bets).reduce((a,b)=>a+b,0);
function bwUI(){const R=BW;if(!R)return;R.u.bal.textContent='CHIPS '+money(S.chips);for(const v in R.cells){const n=R.bets[v]||0;R.cells[v].style.display=n?'block':'none';R.cells[v].textContent=n}R.bs.style.opacity=R.ph==='bet'&&bwTot()?1:.4;R.u.lv.style.opacity=R.ph==='bet'?1:.35}
function bwBet(v){const R=BW;if(!R||R.ph!=='bet')return;if(S.chips<R.chip){toast('NOT ENOUGH CHIPS');return}S.chips-=R.chip;R.bets[v]=(R.bets[v]||0)+R.chip;beep(760,.05,'square',.04);bwUI()}
function bwClear(){const R=BW;if(!R||R.ph!=='bet')return;S.chips+=bwTot();R.bets={};bwUI()}
function bwSpin(){const R=BW;if(!R||R.ph!=='bet'||!bwTot())return;C.wager(bwTot());R.idx=Math.floor(Math.random()*54);R.val=BWV[R.idx];const D=TAU/54,tgt=Math.PI/2+(R.idx+.5)*D;R.p0=R.a;R.D=TAU*(5+Math.random()*2)+(((tgt-R.a)%TAU)+TAU)%TAU;R.T=6.5;R.t=0;R.lk=-1;R.ph='spin';R.u.msg.textContent='ROUND AND ROUND...';bwUI()}
function bwLoop(now){const R=BW;if(!R)return;const dt=Math.min(.05,(now-R.last)/1000);R.last=now;
 if(R.ph==='spin'){R.t+=dt;const u=Math.min(1,R.t/R.T),e=1-Math.pow(1-u,4);R.a=R.p0+R.D*e;BWG.disc.rotation.z=R.a;const k=Math.floor(R.a/(TAU/54));if(k!==R.lk){R.lk=k;if(u<.97)beep(1400,.012,'square',.03)}if(u>=1){R.ph='pay';R.tp=0}}
 else if(R.ph==='pay'){R.tp+=dt;if(R.tp>.7){let ret=0;for(const v in R.bets)if(+v===R.val)ret+=R.bets[v]*(+v+1);const st=bwTot();S.chips+=ret;if(ret>st)C.won(ret-st);R.u.msg.textContent=R.val+' : 1 - '+(ret>st?'YOU WIN '+money(ret-st)+'!':ret===st?'STAKE BACK':ret?'PAID '+money(ret)+' ON '+money(st)+' STAKED':'HOUSE WINS');if(ret>st)[0,1,2].forEach(i=>setTimeout(()=>beep(660+i*220,.12,'square',.06),i*110));R.bets={};R.ph='bet';bwUI()}}
 R.raf=requestAnimationFrame(bwLoop)}
function bwClose(){const R=BW;if(!R||R.ph!=='bet')return;bwClear();cancelAnimationFrame(R.raf);removeEventListener('keydown',R.kd);R.ov.remove();BW=null;C.gClose()}
/* ====================================================== CRAPS ====================================================== */
let CR=null;
const CRZ={pass:[512,355],dont:[512,304],field:[512,134],any7:[754,43],anyc:[270,43]};
function crOpen(){if(CR||busy||C.needChips())return;const R=CR={ph:'bet',bets:{},lock:{},hist:[],point:0,chip:5,last:performance.now(),cam:{pos:[CTX,2.05,5.5],look:[CTX,.8,3.75]},tm:null};C.gOpen(mkCam(R.cam),50);
 const u=R.u=ovBase('CRAPS',()=>crClose());R.ov=u.ov;R.kd=e=>{if(e.key==='Escape')crClose()};addEventListener('keydown',R.kd);R.cells={};
 u.pn.style.cssText+=';flex-direction:column;gap:5px';const r1=mk('div','display:flex;gap:6px;flex-wrap:wrap;justify-content:center',null,u.pn),r2=mk('div','display:flex;gap:6px;flex-wrap:wrap;justify-content:center;align-items:center',null,u.pn);
 [['pass','PASS LINE','#a07a10'],['dont',"DON'T PASS",'#6a2a6a'],['field','FIELD','#2a6a8a'],['any7','ANY 7 (4:1)','#8a2a2a'],['anyc','ANY CRAPS (7:1)','#444']].forEach(([k,t,bg])=>{const b=btn(r1,t,bg,()=>crBet(k),'position:relative');const bg2=mk('i','position:absolute;right:-3px;top:-6px;min-width:16px;height:16px;line-height:16px;border-radius:8px;background:#ffd040;color:#111;font:bold 10px/16px monospace;font-style:normal;padding:0 3px;display:none',null,b);R.cells[k]=bg2});
 chipRow(r2,[1,5,25,100],5,v=>{R.chip=v});R.bc=btn(r2,'CLEAR','#7a2a2a',()=>crClear());R.br=btn(r2,'ROLL','#2a8a3a',()=>crRoll(),'font-size:15px;padding:7px 18px');
 R.st=mk('div','position:absolute;left:8px;top:48px;font-size:14px;text-shadow:2px 2px 0 #000;line-height:1.5;white-space:pre',null,u.ov);
 crSync();R.raf=requestAnimationFrame(crLoop)}
const crTot=()=>Object.values(CR.bets).reduce((a,b)=>a+b,0);
function crSync(){const R=CR;if(!R)return;R.u.bal.textContent='CHIPS '+money(S.chips);for(const k in R.cells){const n=R.bets[k]||0;R.cells[k].style.display=n?'block':'none';R.cells[k].textContent=n}
 R.br.style.opacity=R.ph==='bet'&&crTot()?1:.4;R.bc.style.opacity=R.ph==='bet'?1:.4;R.u.lv.style.opacity=R.ph==='bet'?1:.35;
 R.st.textContent=(R.point?'POINT IS '+R.point+'  (PASS WINS ON '+R.point+', 7 LOSES)':'COME-OUT ROLL  (7 / 11 WIN, 2 / 3 / 12 LOSE)')+(R.hist.length?'\nLAST: '+R.hist.slice(-6).join(' '):'');
 const p=CRP.puck;if(R.point){const i=PTX.indexOf(R.point);p.position.set(...crW(ptCX(i),229));p.position.y=TY+.02;p.material.color.setHex(0xf4f4f4)}else{p.position.set(...crW(60,300));p.material.color.setHex(0x111111)}
 CRP.chips.children.slice().forEach(c=>CRP.chips.remove(c));for(const k in R.bets){const n=R.bets[k],[cx,cy]=CRZ[k],q=crW(cx,cy);const cols=[[100,0x222222],[25,0x20a040],[5,0xd02020],[1,0xf0f0f0]];let rem=n,y=0;for(const[v,c]of cols){let m=Math.min(6,Math.floor(rem/v));rem-=Math.floor(rem/v)*v;for(let i=0;i<m;i++){const ch=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.008,14),bmat({color:c}));ch.position.set(q[0],TY+.014+y*.0085,q[2]);CRP.chips.add(ch);y++}}}}
function crBet(k){const R=CR;if(!R||R.ph!=='bet')return;if((k==='pass'||k==='dont')&&R.point){toast('LINE BETS ARE CLOSED ON A POINT');return}if((k==='pass'&&R.bets.dont)||(k==='dont'&&R.bets.pass)){toast("CAN'T BET BOTH SIDES OF THE LINE");return}if(S.chips<R.chip){toast('NOT ENOUGH CHIPS');return}S.chips-=R.chip;R.bets[k]=(R.bets[k]||0)+R.chip;C.wager(R.chip);beep(760,.05,'square',.04);crSync()}
function crClear(){const R=CR;if(!R||R.ph!=='bet')return;for(const k in R.bets){if(R.lock[k])continue;S.chips+=R.bets[k];delete R.bets[k]}crSync()}
function crRoll(){const R=CR;if(!R||R.ph!=='bet'||!crTot())return;R.d=[1+Math.floor(Math.random()*6),1+Math.floor(Math.random()*6)];R.ph='roll';R.t=0;R.u.msg.textContent='';
 R.fl=CRP.dice.map((m,i)=>{m.visible=true;const s=[CTX-.9+i*.1,TY+.35,CTZ+.9],e=[CTX+.1+Math.random()*.9+i*.25,TY+.043,CTZ-.2+Math.random()*.35];return{s,e,yaw:Math.random()*TAU,ax:new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize(),sp:TAU*(2.5+Math.random()*1.5),q:dieQuat(R.d[i],Math.random()*TAU)}});beep(260,.2,'sawtooth',.04);crSync()}
function crLoop(now){const R=CR;if(!R)return;const dt=Math.min(.05,(now-R.last)/1000);R.last=now;
 if(R.ph==='roll'){R.t+=dt;const T=1.5,u=clampf(R.t/T,0,1);CRP.dice.forEach((m,i)=>{const f=R.fl[i],e=ease(u);let y;if(u<.62){const a=u/.62;y=f.s[1]+(f.e[1]-f.s[1])*a-4*a*(1-a)*-.35+0}else{const b=(u-.62)/.38;y=f.e[1]+Math.sin(b*Math.PI)*.07*(1-b)}if(u<.62){const a=u/.62;y=lerpf(f.s[1],f.e[1],a*a)+Math.sin(a*Math.PI)*.28}
  m.position.set(lerpf(f.s[0],f.e[0],e),Math.max(f.e[1],y),lerpf(f.s[2],f.e[2],e));const qa=new THREE.Quaternion().setFromAxisAngle(f.ax,(1-u)*(1-u)*f.sp);m.quaternion.copy(qa.multiply(f.q));if(u>.6&&u<.63&&!f['b'+i]){f['b'+i]=1;beep(180,.05,'square',.05)}});
  if(u>=1){R.ph='land';R.t=0}}
 else if(R.ph==='land'){R.t+=dt;if(R.t>.8)crResolve()}
 R.raf=requestAnimationFrame(crLoop)}
function crResolve(){const R=CR,sum=R.d[0]+R.d[1];R.hist.push(sum);const win=(k,mult)=>{const b=R.bets[k];if(!b)return 0;const ret=Math.round(b*mult);S.chips+=ret;if(ret>b)C.won(ret-b);delete R.bets[k];delete R.lock[k];return ret-b};
 const out=[];let net=0;
 if(R.bets.field){const b=R.bets.field,m=[3,4,9,10,11].includes(sum)?2:(sum===2||sum===12)?3:0;const n=win('field',m);net+=n;out.push(m?'FIELD WINS':'FIELD LOSES')}
 if(R.bets.any7){const w=sum===7;net+=win('any7',w?5:0);out.push(w?'ANY 7 WINS':'ANY 7 LOSES')}
 if(R.bets.anyc){const w=[2,3,12].includes(sum);net+=win('anyc',w?8:0);out.push(w?'ANY CRAPS WINS':'ANY CRAPS LOSES')}
 const lineDone=(passM,dontM,txt)=>{if(R.bets.pass)net+=win('pass',passM);if(R.bets.dont)net+=win('dont',dontM);out.push(txt)};
 if(!R.point){if(sum===7||sum===11)lineDone(2,0,sum+'! PASS LINE WINS');else if(sum===2||sum===3)lineDone(0,2,'CRAPS '+sum+'! DON\'T PASS WINS');else if(sum===12)lineDone(0,1,'BOX-CARS - DON\'T PASS PUSHES');else{R.point=sum;R.lock.pass=R.lock.dont=1;out.push('THE POINT IS '+sum)}}
 else if(sum===R.point){lineDone(2,0,'POINT MADE! PASS LINE WINS');R.point=0;R.lock={}}
 else if(sum===7){lineDone(0,2,'SEVEN OUT! DON\'T PASS WINS');R.point=0;R.lock={}}
 else out.push('ROLLED '+sum);
 R.u.msg.textContent=sum+' - '+out.join(' - ');if(net>0)[0,1,2].forEach(i=>setTimeout(()=>beep(660+i*220,.12,'square',.06),i*110));R.ph='bet';crSync()}
function crClose(){const R=CR;if(!R||R.ph!=='bet')return;for(const k in R.bets)S.chips+=R.bets[k];R.bets={};R.point=0;crSync();cancelAnimationFrame(R.raf);removeEventListener('keydown',R.kd);R.ov.remove();CRP.dice.forEach(m=>m.visible=false);CRP.chips.children.slice().forEach(c=>CRP.chips.remove(c));CR=null;C.gClose()}
/* ====================================================== POKER (fixed-limit Texas hold'em) ====================================================== */
let PK=null;const PKT=[5.5,3.4];
const SEAT=[[5.5,.92,4.45],[4.7,.92,3.4],[5.5,.92,2.5],[6.3,.92,3.4]];
function pkOpen(){if(PK||busy||C.needChips())return;if(S.chips<60){toast('YOU NEED £60 IN CHIPS TO SIT DOWN');return}
 const R=PK={ph:'idle',dealer:3,meshes:[],tm:[],log:[],last:performance.now(),cam:{pos:[5.5,2.3,5.9],look:[5.5,.9,3.1]},pl:[{n:'YOU'},{n:'MARGOT',st:300,ag:1},{n:'DESMOND',st:300,ag:1.25},{n:'IVY',st:300,ag:.8}]};C.gOpen(mkCam(R.cam),55);
 const u=R.u=ovBase("TEXAS HOLD'EM (LIMIT)",()=>pkClose());R.ov=u.ov;R.kd=e=>{if(e.key==='Escape')pkClose()};addEventListener('keydown',R.kd);
 R.info=mk('div','position:absolute;left:8px;top:46px;font-size:13px;text-shadow:2px 2px 0 #000;line-height:1.45;white-space:pre',null,u.ov);
 R.lg=mk('div','position:absolute;right:8px;top:46px;font-size:12px;text-shadow:2px 2px 0 #000;line-height:1.4;white-space:pre;text-align:right;color:#cfe',null,u.ov);
 R.pot=new THREE.Group();G2.add(R.pot);pkUI();R.raf=requestAnimationFrame(pkLoop)}
const later=(ms,fn)=>{const R=PK;R.tm.push(setTimeout(()=>{if(PK===R)fn()},ms))};
const pkLog=t=>{const R=PK;R.log.push(t);if(R.log.length>6)R.log.shift()};
function pkUI(){const R=PK;if(!R)return;const u=R.u,Z=R.z;u.bal.textContent='CHIPS '+money(S.chips);u.pn.textContent='';u.lv.style.opacity=R.ph==='idle'?1:.35;
 R.lg.textContent=R.log.join('\n');
 let t='';if(Z){t='POT '+money(Z.pot)+'   '+['PRE-FLOP','FLOP','TURN','RIVER'][Math.min(3,Z.street)]+'\n';R.pl.forEach((p,i)=>{t+=(i===R.dealer?'(D) ':'    ')+p.n+(i?' £'+p.st:'')+(Z.fold[i]?' - FOLDED':'')+'\n'});if(Z.hole&&Z.hole[0]&&!Z.fold[0]&&Z.board.length>=3)t+='YOU HAVE '+CATN[catOf(best(Z.hole[0].concat(Z.board)))]}R.info.textContent=t;
 if(R.ph==='idle'){btn(u.pn,R.hands?'DEAL NEXT HAND':'DEAL','#2a8a3a',()=>pkHand(),'font-size:15px;padding:8px 18px')}
 else if(R.ph==='you'){const toCall=Z.hi-Z.bets[0],unit=Z.street<2?10:20;btn(u.pn,'FOLD','#7a2a2a',()=>pkAct(0,'fold'),'font-size:15px;padding:8px 16px');const c=btn(u.pn,toCall?'CALL '+money(toCall):'CHECK','#2a6aa0',()=>pkAct(0,'call'),'font-size:15px;padding:8px 16px');if(S.chips<toCall)c.style.opacity=.4;
  if(Z.rc<4){const r=btn(u.pn,(Z.hi?'RAISE':'BET')+' +'+money(unit),'#a06a1a',()=>pkAct(0,'raise'),'font-size:15px;padding:8px 16px');if(S.chips<toCall+unit)r.style.opacity=.4}}}
function pkPay(i,n){const Z=PK.z;if(i===0){S.chips-=n;C.wager(n)}else PK.pl[i].st-=n;Z.bets[i]+=n;Z.put[i]+=n;Z.pot+=n;beep(900,.03,'square',.03);pkPot()}
function pkPot(){const R=PK;R.pot.children.slice().forEach(c=>R.pot.remove(c));let n=Math.min(14,Math.ceil(R.z.pot/10));for(let i=0;i<n;i++){const ch=new THREE.Mesh(new THREE.CylinderGeometry(.03,.03,.008,14),bmat({color:[0xd02020,0x20a040,0x2050c0,0x222222][i%4]}));ch.position.set(5.5+(i%3-1)*.07,TY+.014+Math.floor(i/3)*.009,3.18+(i%2)*.04);R.pot.add(ch)}}
function pkHand(){const R=PK;if(R.ph!=='idle')return;if(S.chips<60){toast('YOU NEED £60 IN CHIPS TO PLAY ON');return}R.hands=(R.hands||0)+1;for(const m of R.meshes)G2.remove(m);R.meshes=[];R.pl.forEach(p=>{if(p.st<250)p.st=300});R.dealer=(R.dealer+1)%4;
 const Z=R.z={deck:newDeck(),board:[],hole:[],pot:0,street:0,bets:[0,0,0,0],put:[0,0,0,0],fold:[0,0,0,0],hi:10,rc:1,need:new Set([0,1,2,3]),cur:0};
 R.log=[];pkLog('HAND '+R.hands+' - DEALER: '+R.pl[R.dealer].n);const sb=(R.dealer+1)%4,bb=(R.dealer+2)%4;pkPay(sb,5);pkPay(bb,10);pkLog(R.pl[sb].n+' POSTS £5, '+R.pl[bb].n+' POSTS £10');
 for(let i=0;i<4;i++){Z.hole[i]=[Z.deck.pop(),Z.deck.pop()];Z.hole[i].forEach((c,k)=>{const to=[SEAT[i][0]+(k-.5)*.12,SEAT[i][1],SEAT[i][2]],m=mkCard(c,i!==0,[5.5,TY+.2,3.4],to,.1*(i*2+k));m.userData.who=i;R.meshes.push(m)})}
 R.ph='npc';Z.cur=(R.dealer+2)%4;pkUI();later(900,pkNext)}
const alive=Z=>[0,1,2,3].filter(i=>!Z.fold[i]);
function pkNext(){const R=PK,Z=R.z;if(alive(Z).length===1)return pkAward();if(!Z.need.size)return pkStreet();
 let i=Z.cur,n=-1;for(let k=0;k<4;k++){i=(i+1)%4;if(Z.need.has(i)&&!Z.fold[i]){n=i;break}}if(n<0)return pkStreet();Z.cur=n;
 if(n===0){R.ph='you';const toCall=Z.hi-Z.bets[0];if(S.chips<toCall){/* can't afford it - fold */}pkUI()}else{R.ph='npc';pkUI();later(900,()=>pkAct(n,pkAI(n)))}}
function pkAI(i){const R=PK,Z=R.z,p=R.pl[i],toCall=Z.hi-Z.bets[i],h=Z.hole[i];let s;
 if(Z.street===0){const a=rv(h[0]),b=rv(h[1]),hi=Math.max(a,b),lo=Math.min(a,b);s=a===b?.55+(a-2)/12*.4:(hi+lo)/28*.5+(h[0].s===h[1].s?.07:0)+(hi-lo<=2?.05:0)+(hi>=13?.06:0)}
 else{const sc=best(h.concat(Z.board)),cat=catOf(sc);s=[.18,.4,.62,.75,.82,.86,.93,.97,1][cat];if(cat===1)s=.3+(Math.floor(sc/50625)%15)/14*.22;if(cat===0)s=.1+(Math.max(rv(h[0]),rv(h[1]))/14)*.1}
 s=s*p.ag+(Math.random()-.5)*.2;
 if(toCall>0){if(s<.26+toCall/(Z.pot+toCall)*.25&&Math.random()>.08)return'fold';if(s>.72&&Z.rc<4&&Math.random()<.55)return'raise';return'call'}
 return(s>.6&&Z.rc<4&&Math.random()<.5)?'raise':'call'}
function pkAct(i,a){const R=PK,Z=R.z;if(i===0){if(R.ph!=='you')return;const toCall=Z.hi-Z.bets[0],unit=Z.street<2?10:20;if(a==='call'&&S.chips<toCall){toast('NOT ENOUGH CHIPS - FOLD');return}if(a==='raise'&&S.chips<toCall+unit){toast('NOT ENOUGH CHIPS TO RAISE');return}}
 const toCall=Z.hi-Z.bets[i],unit=Z.street<2?10:20,nm=R.pl[i].n;R.ph='npc';
 if(a==='fold'){Z.fold[i]=1;Z.need.delete(i);pkLog(nm+' FOLDS');if(R.meshes)R.meshes.filter(m=>m.userData.who===i).forEach(m=>{m.userData.to=[m.position.x,TY+.002,m.position.z];m.visible=false})}
 else if(a==='call'){pkPay(i,toCall);Z.need.delete(i);pkLog(nm+(toCall?' CALLS £'+toCall:' CHECKS'))}
 else{pkPay(i,toCall+unit);Z.hi+=unit;Z.rc++;Z.need=new Set(alive(Z).filter(x=>x!==i));pkLog(nm+(toCall?' RAISES TO £':' BETS £')+Z.hi)}
 Z.cur=i;pkUI();later(500,pkNext)}
function pkStreet(){const R=PK,Z=R.z;Z.street++;Z.bets=[0,0,0,0];Z.hi=0;Z.rc=0;
 if(Z.street>3)return pkShow();
 const n=Z.street===1?3:1;for(let k=0;k<n;k++){const c=Z.deck.pop();Z.board.push(c);const idx=Z.board.length-1,m=mkCard(c,false,[5.5,TY+.2,3.4],[5.5+(idx-2)*.12,TY+.014,3.4],.12*k);R.meshes.push(m)}
 pkLog(['','--- FLOP ---','--- TURN ---','--- RIVER ---'][Z.street]);Z.need=new Set(alive(Z));Z.cur=R.dealer;R.ph='npc';pkUI();later(900,pkNext)}
function pkShow(){const R=PK,Z=R.z,al=alive(Z);al.forEach(i=>{R.meshes.filter(m=>m.userData.who===i).forEach(m=>{m.material.map=C.cardTex(m.userData.c);m.material.needsUpdate=true})});
 const sc={};al.forEach(i=>sc[i]=best(Z.hole[i].concat(Z.board)));const top=Math.max(...al.map(i=>sc[i])),win=al.filter(i=>sc[i]===top);pkLog('SHOWDOWN: '+al.map(i=>R.pl[i].n+' '+CATN[catOf(sc[i])]).join(', '));pkEnd(win,CATN[catOf(top)])}
function pkAward(){const R=PK,Z=R.z,w=alive(Z);pkEnd(w,null)}
function pkEnd(win,hand){const R=PK,Z=R.z,share=Math.floor(Z.pot/win.length);win.forEach(i=>{if(i===0){S.chips+=share;if(share>Z.put[0])C.won(share-Z.put[0])}else R.pl[i].st+=share});
 const names=win.map(i=>R.pl[i].n).join(' & ');pkLog(names+' WIN'+(win.length>1||win[0]===0?'':'S')+' £'+Z.pot+(hand?' WITH '+hand:''));
 R.u.msg.textContent=win.includes(0)?'YOU WIN £'+(share-Z.put[0])+'!':names+' TAKES THE POT';if(win.includes(0)&&share>Z.put[0])[0,1,2].forEach(i=>setTimeout(()=>beep(660+i*220,.12,'square',.06),i*110));
 Z.pot=0;R.ph='idle';pkPot();pkUI()}
function pkLoop(now){const R=PK;if(!R)return;const dt=Math.min(.05,(now-R.last)/1000);R.last=now;tweenList(R.meshes,dt);R.raf=requestAnimationFrame(pkLoop)}
function pkClose(){const R=PK;if(!R||R.ph!=='idle')return;cancelAnimationFrame(R.raf);R.tm.forEach(clearTimeout);removeEventListener('keydown',R.kd);for(const m of R.meshes)G2.remove(m);G2.remove(R.pot);R.ov.remove();PK=null;C.gClose()}
/* ====================================================== hall hook ====================================================== */
const slotIA=(m)=>({r:[Math.min(Math.sign(m.x)*10.1,Math.sign(m.x)*10.73),Math.max(Math.sign(m.x)*10.1,Math.sign(m.x)*10.73),m.z-.46,m.z+.46],label:'SPIN FRUIT MACHINE',fn:()=>slOpen(m)});
{const b0=buildShop;buildShop=function(o){b0(o);if(!o||!o.casino)return;if(!built)build2();SG.add(G2);for(const p of PPL)SG.add(p);
 const R=(a)=>IROOM.push(a);
 R([-9.4,-5.0,6.85,8]);R([-8.0,-4.4,3.3,4.75]);R([3.5,7.5,1.3,4.8]);R([-11,-10.3,-2.9,-0.3]);R([3.4,7.6,6.8,8]);R([7.7,10.8,5.4,8]);
 R([-1.8,1.8,-6.95,-4.5]);R([1.8,3.0,-8,-7.2]);R([-3.0,-1.8,-8,-7.2]);R([-3.3,-3.1,-8,-3.4]);R([3.1,3.3,-8,-3.4]);R([-3.2,-.65,-3.6,-3.4]);R([.65,3.2,-3.6,-3.4]);
 GATE.r=[-.65,.65,-3.6,-3.4];if(!vipOK())R(GATE.r);GATE.m.visible=!vipOK();
 IA.push({r:[-8.8,-5.6,6.0,6.7],label:'CASHIER (CHIPS & COMPS)',fn:cageOpen},{r:[-7.7,-4.9,4.75,5.5],label:'PLAY CRAPS',fn:crOpen},{r:[4.8,6.2,4.8,5.6],label:"PLAY POKER",fn:pkOpen},{r:[-9.8,-8.6,-2.4,-0.8],label:'SPIN THE BIG WHEEL',fn:bwOpen},
  {r:[4.0,7.0,6.05,6.7],label:'ORDER A DRINK',fn:()=>{if(S.comp>0){S.comp--;fed(8,14,'FREE COMP DRINK! ENERGY UP')}else if(cash>=6){cash-=6;cashUI();fed(8,14,'COCKTAIL! FOOD +8 ENERGY +14 (£6)')}else toast('NOT ENOUGH CASH')}},
  {r:[-.6,.6,-3.5,-3.15],label:'VIP ROOM',fn:()=>toast(vipOK()?'WELCOME, GOLD CARD MEMBER':'GOLD CARD ONLY - WIN '+money(VIPW)+' AT THE TABLES (NOW '+money(S.win)+')')},
  {r:[-1.4,1.4,-4.5,-3.9],label:'HIGH ROLLER BLACKJACK',fn:()=>{if(!vipOK())toast('GOLD CARD ONLY - WIN '+money(VIPW)+' AT THE TABLES');else C.bjOpen(true)}});
 MACH.forEach(m=>{if(m.jp)IA.push({r:[m.x-.5,m.x+.5,-7.05,-6.35],label:'MEGA JACKPOT MACHINE',fn:()=>slOpen(m)});else IA.push(slotIA(m))})}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!built||!GS.inside||!SHOPCUR||!SHOPCUR.o||!SHOPCUR.o.casino)return;jpDraw();
 if(vipOK()&&GATE.m.visible){GATE.m.visible=false;const k=IROOM.indexOf(GATE.r);if(k>=0)IROOM.splice(k,1);toast('GOLD CARD UNLOCKED! VIP ROOM OPEN')}
 const t=performance.now()/1000;
 if(PPL.singer){const s=PPL.singer;s.a1.rotation.x=-1.3+Math.sin(t*3)*.15;s.a2.rotation.x=-.4+Math.sin(t*2.2)*.12;s.rotation.y=Math.PI+.52+Math.sin(t*1.3)*.1}
 if(PPL.bar){PPL.bar.a1.rotation.x=-.5+Math.sin(t*2.4)*.3}
 for(const w of WALK){const p=w.p;if(w.wait>0){w.wait-=dt;p.l1.rotation.x*=.85;p.l2.rotation.x*=.85;p.a1.rotation.x*=.85;p.a2.rotation.x*=.85;continue}
  const T=w.path[w.k],dx=T[0]-p.position.x,dz=T[1]-p.position.z,d=Math.hypot(dx,dz);if(d<.1){w.k=(w.k+1)%w.path.length;w.wait=2+Math.random()*4;continue}
  p.position.x+=dx/d*w.sp*dt;p.position.z+=dz/d*w.sp*dt;p.rotation.y=Math.atan2(dx,dz);w.ph+=dt*w.sp*5;const a=.7;p.l1.rotation.x=Math.sin(w.ph)*a;p.l2.rotation.x=-Math.sin(w.ph)*a;p.a1.rotation.x=-Math.sin(w.ph)*a*.7;p.a2.rotation.x=Math.sin(w.ph)*a*.7}}}
window.CG2={slOpen,bwOpen,crOpen,pkOpen,cageOpen,MACH,vipOK,get PK(){return PK},get CR(){return CR},get BW(){return BW},get SL(){return SLG}};
})();
