/* ===== THE CASINO'S SECRET DOOR: a velvet-roped door guarded by a bouncer. A man in a top hat sells a £100 members' pass.
   Behind the door is "The Gilded Cage", a 1920s speakeasy members' lounge: pole dancers,
   a cocktail bar and a high-stakes card table. Loads after casinogames2.js so its hall hook runs last. ===== */
(function(){
const C=window.CG,PASS=100,X0=60,LX=7,LZ=6,LH=3.6;       // lounge half-width, half-depth, height; x offset inside SG
const CC={pass:0};window.CC3=CC;
const G3=new THREE.Group();G3.position.x=X0;G3.visible=false;
const PPL=[],POLE=[];let built=0,inLng=0,saved=null;
const mat=h=>fmc(h);
const bx=(x,y,z,w,h,d,hex,par)=>{const g=new THREE.BoxGeometry(w,h,d),col=new Float32Array(g.attributes.position.count*3),F=[.82,.7,1,.45,.9,.74];for(let f=0;f<6;f++)for(let v=0;v<4;v++){const i=(f*4+v)*3;col[i]=col[i+1]=col[i+2]=F[f]}g.setAttribute('color',new THREE.BufferAttribute(col,3));const m=new THREE.Mesh(g,mat(hex));m.position.set(x,y+h/2,z);(par||G3).add(m);return m};
const cy=(r,h,x,y,z,hex,par)=>{const g=new THREE.CylinderGeometry(r,r,h,14),n=g.attributes.position.count,col=new Float32Array(n*3).fill(1);g.setAttribute('color',new THREE.BufferAttribute(col,3));const m=new THREE.Mesh(g,mat(hex));m.position.set(x,y+h/2,z);(par||G3).add(m);return m};
const pl=(w,h,x,y,z,ry,m,par)=>{const o=new THREE.Mesh(new THREE.PlaneGeometry(w,h),m);o.position.set(x,y,z);o.rotation.y=ry;(par||G3).add(o);return o};
const bas=m=>new THREE.MeshBasicMaterial({map:m,fog:false});
const sp=(seed,o)=>pSpec(seed,Object.assign({ts:1,gl:false,scarf:null,bp:false,bag:0,old:false},o||{}));
// a rounded, fully clothed bust for the pole dancers: two soft spheres in the dress colour, parented to the torso mesh
const bust=(p,tc)=>{const hx=((tc[0]*255|0)<<16)|((tc[1]*255|0)<<8)|(tc[2]*255|0);
 for(const sx of[-1,1]){const g=new THREE.SphereGeometry(.062,10,8),n=g.attributes.position.count;g.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3).fill(1),3));
  const m=new THREE.Mesh(g,mat(hx));m.scale.set(1,1.05,.95);m.position.set(sx*.068,1.25,.1);p.up.add(m)}};
// showgirl costume for the pole dancers: sequinned cropped vest, long opera gloves and a feathered headband
const costume=(p,acc,bcol)=>{const sh=((bcol[0]*255|0)<<16)|((bcol[1]*255|0)<<8)|(bcol[2]*255|0);const gold=0xe8bf4a,hx=((acc[0]*255|0)<<16)|((acc[1]*255|0)<<8)|(acc[2]*255|0);
 const g=p.up.geometry,pos=g.attributes.position,col=g.attributes.color;g.computeBoundingBox();const top=g.boundingBox.max.y;
 // cropped vest: sleeveless, bare midriff and arms (skin tone sampled from the hand), sequinned top band
 const skinOf=m=>{const q=m.geometry.attributes.position;let bi=0,bd=9;for(let i=0;i<q.count;i++){const d=Math.abs(q.getY(i)+.64);if(d<bd){bd=d;bi=i}}const c=m.geometry.attributes.color;return[c.getX(bi),c.getY(bi),c.getZ(bi)]};
 const sk=skinOf(p.a1);
 for(let i=0;i<pos.count;i++){const y=pos.getY(i);if(y>1.1&&y<1.46){const k=.82+.3*(((i*2654435761)>>>0)%7/7);col.setXYZ(i,acc[0]*k,acc[1]*k,acc[2]*k)}else if(y>.8&&y<=1.1)col.setXYZ(i,sk[0],sk[1],sk[2])}col.needsUpdate=true;
 for(const a of[p.a1,p.a2]){const ac=a.geometry.attributes.color;for(let i=0;i<ac.count;i++)ac.setXYZ(i,sk[0],sk[1],sk[2]);ac.needsUpdate=true}
 const ring=(r,h,y,sz,hex,par,open)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,12,1,true),mat(hex));const n=m.geometry.attributes.position.count;m.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3).fill(1),3));m.material.side=THREE.DoubleSide;m.scale.z=sz;m.position.y=y;par.add(m);return m};
 // short shorts: bare the whole leg, then wrap a short band of shorts colour round the top of each thigh
 for(const l of[p.l1,p.l2]){const lg=l.geometry,lp=lg.attributes.position,lc=lg.attributes.color;lg.computeBoundingBox();let bi=0,bd=9;
  for(let i=0;i<lp.count;i++){const d=Math.abs(lp.getY(i)+.5);if(d<bd){bd=d;bi=i}}
  const r=lc.getX(bi),gg=lc.getY(bi),b=lc.getZ(bi);
  for(let i=0;i<lp.count;i++)if(lp.getY(i)>-.395)lc.setXYZ(i,r,gg,b);lc.needsUpdate=true;
  const rr=lg.boundingBox.max.x+.01,m=ring(rr,.17,-.055,.108/rr,sh,l)}
 for(const a of[p.a1,p.a2])ring(.054,.34,-.38,1,hx,a);
 ring(.118,.035,top-.075,1,gold,p.up);
 [[-.07,-.12],[0,-.2],[.07,-.12]].forEach(([x,t],i)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.03,.2,.015),mat(i===1?gold:hx));const n=m.geometry.attributes.position.count;m.geometry.setAttribute('color',new THREE.BufferAttribute(new Float32Array(n*3).fill(1),3));m.position.set(x,top+.02,-.06);m.rotation.z=t*1.4;p.up.add(m)})};
const addP=(spec,x,z,ry,par,seated)=>{const p=personIn(spec,x,z,ry,seated);SG.remove(p);(par||G3).add(p);PPL.push(p);return p};

/* ---------- the lounge room (built once) ---------- */
function buildLounge(){
 const floor=ptex(64,64,c=>{c.fillStyle='#14100c';c.fillRect(0,0,64,64);c.fillStyle='#e8dcc0';c.fillRect(0,0,32,32);c.fillRect(32,32,32,32);c.fillStyle='#1c1410';c.fillRect(32,0,32,32);c.fillRect(0,32,32,32)});
 const w=pl(2*LX,2*LZ,0,0,0,0,bas(floor));w.rotation.x=-Math.PI/2;floor.repeat.set(5,4);
 // wood boards under the checker
 const wood=ptex(32,32,c=>{c.fillStyle='#3a2212';c.fillRect(0,0,32,32);c.fillStyle='#2c190d';for(let x=0;x<32;x+=8)c.fillRect(x,0,1,32);c.fillStyle='#4a2c18';c.fillRect(3,6,10,1);c.fillRect(18,20,11,1)});
 const wallT=(len)=>{const t=ptex(32,32,c=>{c.fillStyle='#1b0f2a';c.fillRect(0,0,32,32);c.fillStyle='#2a1640';for(let x=0;x<32;x+=16)c.fillRect(x,0,8,32);c.fillStyle='#c99a2e';c.fillRect(0,0,1,32);c.fillStyle='#a07a20';c.beginPath();c.moveTo(8,8);c.lineTo(12,14);c.lineTo(8,20);c.lineTo(4,14);c.closePath();c.fill()});t.repeat.set(len/2,LH/2);return bas(t)};
 pl(2*LX,LH,0,LH/2,-LZ,0,wallT(2*LX));pl(2*LX,LH,0,LH/2,LZ,Math.PI,wallT(2*LX));pl(2*LZ,LH,LX,LH/2,0,-Math.PI/2,wallT(2*LZ));pl(2*LZ,LH,-LX,LH/2,0,Math.PI/2,wallT(2*LZ));
 const ce=pl(2*LX,2*LZ,0,LH,0,0,new THREE.MeshBasicMaterial({color:0x120a1c,fog:false}));ce.rotation.x=Math.PI/2;
 const vd=new THREE.Mesh(new THREE.BoxGeometry(60,40,60),new THREE.MeshBasicMaterial({color:0x07060c,side:THREE.BackSide,fog:false}));vd.position.y=LH/2;G3.add(vd);
 // rails, skirting, gold trim
 for(const sz of[-1,1])bx(0,0,sz*(LZ-.1),2*LX,.9,.2,0x2a1408);for(const sx of[-1,1])bx(sx*(LX-.1),0,0,.2,.9,2*LZ,0x2a1408);
 for(const sz of[-1,1])bx(0,.9,sz*(LZ-.07),2*LX,.08,.14,0xe8bf4a);for(const sx of[-1,1])bx(sx*(LX-.07),.9,0,.14,.08,2*LZ,0xe8bf4a);
 for(const sz of[-1,1])bx(0,LH-.3,sz*(LZ-.1),2*LX,.3,.2,0xc99a2e);for(const sx of[-1,1])bx(sx*(LX-.1),LH-.3,0,.2,.3,2*LZ,0xc99a2e);
 // title board over the stage
 pl(4.6,.8,0,2.7,-LZ+.05,0,bas(txtTex(512,90,'#12081c','#ffd24a','THE GILDED CAGE',58)));
 // stage (north wall) with curtain
 bx(0,0,-LZ+1.2,9,.35,2.2,0x4a2610);for(const sx of[-1,1]){bx(sx*4.3,.35,-LZ+.35,1.3,2.6,.3,0x7a0f26)}bx(0,2.95,-LZ+.35,9.4,.4,.3,0x7a0f26);
// pole stages: a pair of round gold-rimmed platforms flanking the stage, each with a floor-to-ceiling brass pole and a cabaret dancer
 [[-5.6,0],[5.6,1]].forEach(([x,i])=>{const z=-LZ+1.4;
  cy(.9,.3,x,0,z,0x2a1408);cy(.95,.06,x,.3,z,0xe8bf4a);cy(.04,LH-.3,x,.3,z,0xf0d060);cy(.16,.04,x,LH-.34,z,0xc99a2e);
  const d=addP(sp(8250+i,{f:true,hs:i?13:9,ts:2,sh:1,bc:i?[.06,.3,.26]:[.45,.08,.2],tc:i?[.1,.55,.45]:[.8,.15,.35],sk:PSK[i?2:0]}),x+.4,z,Math.PI,G3);d.position.y=.3;bust(d,i?[.1,.55,.45]:[.8,.15,.35]);costume(d,i?[.1,.55,.45]:[.8,.15,.35],i?[.06,.3,.26]:[.45,.08,.2]);POLE.push({p:d,cx:x,cz:z,ph:i*Math.PI})});
 // tables + candles + patrons
 const tbl=(x,z)=>{cy(.45,.05,x,.75,z,0x3a1a0a);cy(.05,.75,x,0,z,0xc99a2e);cy(.03,.12,x,.8,z,0xffe9a0)};
 [[-5.2,-1.2],[-5.2,1.6],[5.2,-1.2]].forEach(([x,z],i)=>{tbl(x,z);addP(sp(8300+i*3,{f:i===1,hs:i===0?19:i===1?9:18,ts:3,tc:[.1+.2*i,.1,.15],sk:PSK[i%3]}),x+.9,z,-Math.PI/2,G3);addP(sp(8301+i*3,{f:i!==1,hs:i===1?19:11,ts:4,tc:[.5,.1+.1*i,.3],sk:PSK[(i+1)%3]}),x-.9,z,Math.PI/2,G3)});
 // bar (east wall) + barman
 bx(LX-.9,0,3.3,1.0,1.1,3.6,0x3a1a0a);bx(LX-.9,1.1,3.3,1.2,.08,3.8,0xc99a2e);for(let i=0;i<4;i++){bx(LX-.2,1.2+(i%2)*.55,2.1+i*.7,.3,.4,.18,[0x2a9a4a,0x9a1a1a,0xe8a020,0x2a6ac0][i])}
 bx(LX-.12,1.1,3.3,.08,1.8,3.4,0x2a1408);
 PPL.bar=addP(sp(8400,{f:false,hs:14,ts:1,tc:[.9,.9,.92],beard:true,sk:PSK[2]}),LX-1.6,3.3,Math.PI/2,G3);
 // high stakes table (west) in green baize
 cy(1.1,.12,-LX+2.1,.78,3.4,0x0f5a2a);cy(.12,.78,-LX+2.1,0,3.4,0x3a2208);cy(1.18,.08,-LX+2.1,.72,3.4,0x5a1a10);
 for(const[cx_,cz,c]of[[0,0,0xe8bf4a],[.3,.2,0xc02a2a],[-.3,.15,0x141418],[.1,-.3,0xe8bf4a]])cy(.07,.1,-LX+2.1+cx_,.9,3.4+cz,c);
 addP(sp(8500,{f:true,hs:9,ts:4,tc:[.1,.1,.12],sk:PSK[1]}),-LX+2.1,2.0,0,G3);                                       // dealer
 pl(1.8,.45,-LX+.06,2.2,3.4,Math.PI/2,bas(txtTex(256,64,'#12081c','#ffd24a','HIGH STAKES',40)));
 // art-deco lamps
 for(const[x,z]of[[-LX+.5,-3.5],[LX-.5,-3.5],[-LX+.5,0],[LX-.5,0],[-LX+.5,-.5]]){bx(x,1.7,z,.18,.5,.18,0xffe9a0);bx(x,1.5,z,.3,.12,.3,0xe8bf4a)}
 for(const x of[-3.6,0,3.6]){cy(.05,.4,x,LH-.4,0,0xc99a2e);cy(.5,.1,x,LH-.55,0,0xffe0a0)}
 // exit door (south wall)
 bx(0,0,LZ-.12,2.2,2.6,.2,0x2a0a14);bx(0,2.6,LZ-.12,2.6,.2,.3,0xe8bf4a);pl(1.7,.4,0,2.95,LZ-.1,Math.PI,bas(txtTex(256,50,'#12081c','#ffd24a','EXIT',36)))
 built=1}
function inLounge(){return inLng}

/* ---------- entering and leaving ---------- */
function goLounge(){fade(()=>{saved={R:IROOM.slice(),A:IA.slice(),rx:RX,rz:RZ};if(!built)buildLounge();G3.visible=true;inLng=1;IX=3200+X0;RX=LX;RZ=LZ;
 IROOM.splice(0,IROOM.length,[-6.5,-4.7,-LZ+.5,-LZ+2.3],[4.7,6.5,-LZ+.5,-LZ+2.3],[-6.2,-4.2,-2.2,-.2],[-6.2,-4.2,.6,2.6],[4.2,6.2,-2.2,-.2],[LX-1.5,LX,1.5,5.1],[-LX,-LX+1.1,2.2,4.6],[-LX+1.0,-LX+3.2,2.5,4.3]);
 IA.splice(0,IA.length,{r:[-1.2,1.2,LZ-.5,LZ],label:'LEAVE THE LOUNGE',fn:leaveLounge},
  {r:[LX-3.2,LX-1.5,1.6,5.0],label:'ORDER A COCKTAIL (£10)',fn:()=>{if(cash>=10){cash-=10;cashUI();fed(14,24,'SIDECAR! FOOD +14 ENERGY +24 (£10)')}else toast('NOT ENOUGH CASH')}},
  {r:[-LX+.6,-LX+3.7,1.2,2.5],label:'HIGH STAKES TABLE',fn:()=>C.bjOpen(true)},
  ...[[-5.6],[5.6]].map(([x])=>({r:[x-1.3,x+1.3,-LZ+2.3,-LZ+3.6],label:'TIP THE DANCER (£5)',fn:()=>{if(cash>=5){cash-=5;cashUI();beep(660,.08,'square',.05);toast(['THE DANCER SPINS AND WINKS','A GRACEFUL TWIRL ROUND THE POLE. BRAVO!','SHE TIPS HER FEATHERED HEADBAND TO YOU'][Math.floor(Math.random()*3)])}else toast('NOT ENOUGH CASH')}})),
  {r:[-2.6,2.6,-2.5,-1.2],label:'WATCH THE SHOW',fn:()=>toast(['THE POLE DANCERS SPIN GRACEFULLY ON THEIR GOLD PLATFORMS','A DANCER SWINGS ROUND THE POLE. BRAVO!'][Math.floor(Math.random()*2)])},
  ...[[-5.2,-1.2],[-5.2,1.6],[5.2,-1.2]].map(([x,z])=>({r:[x-1.6,x+1.6,z-1.1,z+1.1],label:'TAKE A SEAT',fn:()=>{fed(0,6,'YOU RELAX WITH THE MUSIC. ENERGY +6')}})));
 P.x=IX;P.z=IZ+LZ-1.6;P.y=IY+.02;P.psi=Math.PI;P.speed=0;camAng=P.psi;toast('THE GILDED CAGE · MEMBERS ONLY');setLabels()})}
function leaveLounge(){fade(()=>{inLng=0;G3.visible=false;IX=3200;if(saved){RX=saved.rx;RZ=saved.rz;IROOM.splice(0,IROOM.length,...saved.R);IA.splice(0,IA.length,...saved.A)}
 P.x=IX+DR.x+.9;P.z=IZ+DR.z;P.y=IY+.02;P.psi=-Math.PI/2;P.speed=0;camAng=P.psi;setLabels()})}
{const ls=leaveShop;leaveShop=function(i){if(inLng){inLng=0;G3.visible=false}ls(i)}}

/* ---------- the hall hook: top-hat man, bouncer and velvet-roped door ---------- */
const DR={x:10.3,z:-1.6},HT={x:-3.6,z:1.2};
function dressHall(){
 if(!G3.parent||G3.parent!==SG)SG.add(G3);G3.visible=false;
 const hall=new THREE.Group();SG.add(hall);hall.userData.cc=1;
 const b=(x,y,z,w,h,d,hex)=>bx(x,y,z,w,h,d,hex,hall);
 // door in the east wall
 b(DR.x+.22,0,DR.z,.14,2.5,1.7,0x1a0a10);b(DR.x+.2,0,DR.z-.95,.26,2.7,.14,0xe8bf4a);b(DR.x+.2,0,DR.z+.95,.26,2.7,.14,0xe8bf4a);b(DR.x+.2,2.5,DR.z,.26,.16,2.0,0xe8bf4a);
 pl(1.5,.35,DR.x+.08,2.85,DR.z,-Math.PI/2,bas(txtTex(256,56,'#12081c','#ffd24a','MEMBERS ONLY',34)),hall);
 pl(1.4,.6,DR.x+.1,1.3,DR.z,-Math.PI/2,bas(txtTex(256,100,'#2a0a14','#e8bf4a','THE GILDED CAGE',30)),hall);
 // velvet rope: brass posts + red rope
 for(const sz of[-1,1]){cy(.04,1.0,DR.x-.75,0,DR.z+sz*1.05,0xe8bf4a,hall);cy(.12,.05,DR.x-.75,0,DR.z+sz*1.05,0xc99a2e,hall)}
 const rp=bx(DR.x-.75,.75,DR.z,.04,.06,2.1,0xa01028,hall);
 // bouncer (big, dark suit)
 const bn=sp(8600,{f:false,hs:8,ts:3,tc:[.06,.06,.08],sk:PSK[2],w:1.25,h:1.12});const pb_=personIn(bn,DR.x-1.35,DR.z,Math.PI/2);SG.remove(pb_);hall.add(pb_);
 // top-hat gentleman
 const th=sp(8700,{f:false,hs:19,ts:3,tc:[.1,.08,.12],sk:PSK[0],beard:true,gl:true});const pt=personIn(th,HT.x,HT.z,Math.PI);SG.remove(pt);hall.add(pt);
 hall.userData.pt=pt;
 IROOM.push([DR.x-1.7,DR.x-1.0,DR.z-.4,DR.z+.4],[HT.x-.3,HT.x+.3,HT.z-.3,HT.z+.3]);
 IA.push({r:[DR.x-1.6,DR.x+.5,DR.z-1.1,DR.z+1.1],label:()=>CC.pass?'ENTER THE GILDED CAGE':'GUARDED DOOR',fn:()=>{if(CC.pass)goLounge();else toast('BOUNCER: "MEMBERS ONLY. A £100 PASS FROM THE TOP-HAT GENTLEMAN."')}},
  {r:[HT.x-1.2,HT.x+1.2,HT.z-1.2,HT.z+1.2],label:()=>CC.pass?'THE TOP-HAT GENTLEMAN':'BUY MEMBERS\' PASS (£100)',fn:()=>{
   if(CC.pass){toast('"ENJOY THE MUSIC, OLD SPORT."');return}
   if(cash<PASS){toast('"A PASS IS £'+PASS+', SIR. COME BACK WHEN YOU ARE FLUSH."');return}
   cash-=PASS;cashUI();CC.pass=1;beep(880,.12,'square',.06);setTimeout(()=>beep(1175,.16,'square',.06),130);
   toast('MEMBERS\' PASS BOUGHT! SHOW IT TO THE BOUNCER');try{phText('THE TOP-HAT GENTLEMAN',"Welcome to the club. The door's on the east wall; the bouncer will let you through.")}catch(e){}}});
 SG.userData.cc=hall}
{const b0=buildShop;buildShop=function(o){b0(o);if(!o||!o.casino)return;if(SG.userData.cc){SG.remove(SG.userData.cc)}inLng=0;G3.visible=false;dressHall()}}

/* ---------- animation ---------- */
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!inLng||!built)return;const t=performance.now()/1000;
 for(const d of POLE){const p=d.p,a=t*1.3+d.ph,s=Math.sin(t*3+d.ph),hop=Math.max(0,Math.sin(t*.9+d.ph))**3;
  p.position.x=d.cx+Math.cos(a)*.4;p.position.z=d.cz+Math.sin(a)*.4;p.position.y=.3+hop*.35;p.rotation.y=Math.PI-a+Math.PI/2;
  p.a1.rotation.x=-2.9;p.a2.rotation.x=-1.6+s*.4;p.l1.rotation.x=s*.6-hop*.5;p.l2.rotation.x=-s*.6+hop*.4}
 if(PPL.bar){PPL.bar.a1.rotation.x=-.5+Math.sin(t*2.4)*.3}}}

/* ---------- save ---------- */
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.cc=CC;return o};cozyLoad=function(z){l0(z);if(z&&z.cc)CC.pass=z.cc.pass|0}}
window.CASINO3={goLounge,leaveLounge,CC,inLounge};
})();
