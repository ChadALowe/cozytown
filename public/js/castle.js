/* ---- DUDLEY CASTLE ----
   A ruined castle on the hill west of the town hall: curtain walls with broken gaps, towers, a gatehouse, chapel ruins,
   and the keep on its motte. Inside: the great hall (the steward, the armoury, the knighting) and the dungeons
   (the lost key, the secret passage).
   Every day: exploring, archery at the butts, the armourer, and the ghost tour after dark.
   Reenactment weekends (Sat and Sun, 10am to 5pm): jousting in the tiltyard, sword duels in the bailey, the trebuchet
   siege demo, and the medieval fayre with falconry, the mead stall and costume hire.
   Win the joust, the sword and the archery titles and the Lord of Dudley knights you in the great hall. ---- */
(function(){
if(typeof buildShop!=='function'||!window.MARLOWE5)return;
const A=window.MARLOWE5,TAU=Math.PI*2,rr=(a,b)=>a+Math.random()*(b-a),ri=n=>Math.floor(Math.random()*n),pk=a=>a[ri(a.length)],cl=(v,a,b)=>v<a?a:v>b?b:v;
const bp=(f,d,t,v)=>{try{beep(f,d,t||'square',v||.05)}catch(e){}};
const money=()=>{try{cashUI()}catch(e){}};
const pay=p=>{if(cash<p){toast('NOT ENOUGH CASH (£'+p+')');return false}cash-=p;money();return true};
const feed=(f,e,msg)=>{if(typeof fed==='function')fed(f,e,msg);else{try{HN.food=Math.min(100,HN.food+f);HN.en=Math.min(100,HN.en+e)}catch(_){}toast(msg)}};
const keep_=n=>{try{TOWNSHOPS.col[n]=1}catch(e){}};

/* ------------------------------------------------------------------ state */
const DC={joust:0,sword:0,arch:0,archBest:0,treb:0,hawk:0,armour:0,lance:0,key:0,secret:0,knight:0,ghost:0,costume:0};window.DUDLEY=DC;
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.dudley=DC;return o};cozyLoad=function(z){l0(z);if(z&&z.dudley)Object.assign(DC,z.dudley)}}
const weekend=()=>{try{return dow()>=5}catch(e){return false}},reen=()=>weekend()&&GT>=10&&GT<17,night=()=>GT>=20||GT<1;
const RANKS=['SQUIRE','MAN-AT-ARMS','KNIGHT ERRANT','CHAMPION'];
const ARM=[['NO ARMOUR',0,0],['PADDED GAMBESON',60,1],['CHAINMAIL HAUBERK',220,2],['FULL PLATE HARNESS',600,3]];
const LANCES=[['ASH TRAINING LANCE',0],['BALANCED OAK LANCE',90],['TOURNAMENT LANCE',260]];

/* ------------------------------------------------------------------ where it is */
const CX=window.MESH_CULL?MESH_CULL[0].x:-150,CZ=window.MESH_CULL?MESH_CULL[0].z:-810,BR=36;                 /* bailey centre and radius */
const MX=CX,MZ=CZ-16,MR0=17,MR1=8,MH=6.5;   /* the motte: base radius, top radius, height */
const GATE=[CX,CZ+BR],TILT=[CX+78,CZ-6],BUTTS=[CX-44,CZ+8],TREB=[CX+40,CZ-70],FAYRE=[CX+10,CZ+12],RING=[CX-12,CZ+10];
/* the motte raises the ground (so you can walk up it, and cars drive over it) */
{const h0=hAt;hAt=function(x,z){const v=h0(x,z);if(x>MX-MR0&&x<MX+MR0&&z>MZ-MR0&&z<MZ+MR0){const d=Math.hypot(x-MX,z-MZ);if(d<MR0){const t=d<MR1?1:(MR0-d)/(MR0-MR1);return v+MH*t*t*(3-2*t)}}return v}}
const top=()=>G0+MH;

/* ------------------------------------------------------------------ build the castle (one merged mesh + a few extras) */
const STONE=[.62,.6,.55],STONE2=[.52,.5,.46],DARK=[.32,.3,.28],GRASS=[.36,.56,.26],WOOD=[.45,.3,.16];
const W=new Builder(4),COLS=[];
const wallSeg=(x0,z0,x1,z1,h,t,col,colly)=>{const l=Math.hypot(x1-x0,z1-z0),a=Math.atan2(x1-x0,z1-z0),mx=(x0+x1)/2,mz=(z0+z1)/2;pbox(W,mx,G0,mz,t,h,l,col,a);
 /* crenellations */for(let k=0;k<l;k+=1.6){const f=k/l;pbox(W,x0+(x1-x0)*f,G0+h,z0+(z1-z0)*f,t,.8,.8,col,a)}
 if(colly!==false)for(let k=0;k<=l;k+=1.4){const f=k/l;COLS.push([x0+(x1-x0)*f,z0+(z1-z0)*f,t/2+.25])}};
const tower=(x,z,r,h,col,ruin)=>{pcyl(W,x,G0,z,r,h,12,col);for(let i=0;i<12;i++){if(ruin&&i%3===0)continue;const a=i/12*TAU;pbox(W,x+Math.cos(a)*r*.9,G0+h,z+Math.sin(a)*r*.9,1,1,1,col)}COLS.push([x,z,r+.2])};
/* curtain wall: a ring with the gate gap to the south, two ruined gaps, and the motte breaking it to the north */
{const N=24,gaps=new Set([0,7,16]);for(let i=0;i<N;i++){if(gaps.has(i))continue;const a0=Math.PI/2+i/N*TAU+.06,a1=Math.PI/2+(i+1)/N*TAU-.06;const h=i%5===3?4.2:7;wallSeg(CX+Math.cos(a0)*BR,CZ+Math.sin(a0)*BR,CX+Math.cos(a1)*BR,CZ+Math.sin(a1)*BR,h,2.2,i%2?STONE:STONE2)}
 for(const i of[3,6,10,13,19,22]){const a=Math.PI/2+i/N*TAU;tower(CX+Math.cos(a)*BR,CZ+Math.sin(a)*BR,3.2,9.5,STONE2,i===10||i===19)}}
/* gatehouse: two towers and an arch over the south gap */
for(const s of[-1,1]){pcyl(W,GATE[0]+s*5.2,G0,GATE[1],3.4,11,12,STONE2);COLS.push([GATE[0]+s*5.2,GATE[1],3.6])}
pbox(W,GATE[0],G0+5.2,GATE[1],7,3.4,3.6,STONE);pbox(W,GATE[0],G0,GATE[1]-1.8,7,.12,.12,DARK);for(let k=-3;k<=3;k+=1.5)pbox(W,GATE[0]+k,G0+8.6,GATE[1],.9,1,3.6,STONE);
for(let k=-2.6;k<=2.6;k+=.65)pbox(W,GATE[0]+k,G0+3.6,GATE[1]+1.2,.12,1.6,.12,DARK);/* the raised portcullis */
/* the motte: a grassy mound with the keep on top */
{const seg=28,R=[MR0,MR0*.8,MR0*.62,MR1+1.2,MR1],H=[0,MH*.3,MH*.62,MH*.94,MH];for(let r=0;r<R.length-1;r++)for(let i=0;i<seg;i++){const a0=i/seg*TAU,a1=(i+1)/seg*TAU,p=(rad,aa,y)=>[MX+Math.cos(aa)*rad,G0+y,MZ+Math.sin(aa)*rad];W.tri(p(R[r],a0,H[r]),p(R[r+1],a0,H[r+1]),p(R[r],a1,H[r]),GRASS,null,null,true);W.tri(p(R[r],a1,H[r]),p(R[r+1],a0,H[r+1]),p(R[r+1],a1,H[r+1]),GRASS,null,null,true)}
 for(let i=0;i<seg;i++){const a0=i/seg*TAU,a1=(i+1)/seg*TAU;W.tri([MX,top(),MZ],[MX+Math.cos(a0)*MR1,top(),MZ+Math.sin(a0)*MR1],[MX+Math.cos(a1)*MR1,top(),MZ+Math.sin(a1)*MR1],GRASS,null,null,true)}}
/* the keep: a ruined square tower with four corner turrets */
{const ky=top(),k=5.5;for(const[x0,z0,x1,z1,h]of[[-k,-k,k,-k,10],[k,-k,k,k,8],[-k,k,-1.4,k,9],[1.4,k,k,k,9],[-k,-k,-k,k,10.5]]){const l=Math.hypot(x1-x0,z1-z0),a=Math.atan2(x1-x0,z1-z0);pbox(W,MX+(x0+x1)/2,ky,MZ+(z0+z1)/2,1.4,h,l,STONE2,a)}
 pbox(W,MX,ky+3.2,MZ+k,2.8,6,1.4,STONE2);/* above the door */for(const[dx,dz]of[[-k,-k],[k,-k],[-k,k],[k,k]]){pcyl(W,MX+dx,ky,MZ+dz,1.5,12,10,STONE)}
 for(const[dx,dz]of[[-k,-k],[k,-k],[-k,k],[k,k]])COLS.push([MX+dx,MZ+dz,1.7]);for(let t=-k;t<=k;t+=1.3){COLS.push([MX+t,MZ-k,.9],[MX+k,MZ+t,.9],[MX-k,MZ+t,.9]);if(Math.abs(t)>1.6)COLS.push([MX+t,MZ+k,.9])}}
/* chapel ruins: a roofless nave with a pointed east window */
{const x=CX+18,z=CZ-8;for(const s of[-1,1])pbox(W,x+s*3,G0,z,.8,5.5,11,STONE);pbox(W,x,G0,z-5.5,6.8,7,.8,STONE);pbox(W,x,G0+3,z-5.5,1.6,3,.9,DARK);pbox(W,x-2,G0,z+5.5,2.6,3,.8,STONE);for(let i=0;i<3;i++)pbox(W,x,G0,z-1+i*2.6,1.6,.5,.7,WOOD);
 for(let t=-5;t<=5;t+=1.2)COLS.push([x-3,z+t,.6],[x+3,z+t,.6]);COLS.push([x,z-5.5,.6],[x-2,z+5.5,1.3])}
/* the tiltyard: the tilt barrier, a viewing stand and pavilions */
{const[x,z]=TILT;pbox(W,x,G0,z,.25,1.3,70,WOOD);for(let k=-35;k<=35;k+=3.5)pbox(W,x,G0,z+k,.3,1.4,.3,[.7,.12,.12]);for(const s of[-1,1])pbox(W,x+s*8,G0,z,.15,.9,72,WOOD);
 pbox(W,x+15,G0,z,4,2.2,16,WOOD);pbox(W,x+16.5,G0+2.2,z,1,1.5,16,[.15,.25,.55]);for(const[dz,c]of[[-38,[.7,.12,.12]],[38,[.12,.25,.6]]]){pcyl(W,x-6,G0,z+dz,2.6,3.2,10,c);pbox(W,x-6,G0+3.2,z+dz,1.2,1.8,1.2,[.95,.9,.4])}
 for(let k=-35;k<=35;k+=1.6)COLS.push([x,z+k,.35])}
/* archery butts: straw bosses at 20, 40 and 60 metres */
const BOSS=[20,40,60].map((d,i)=>({d,x:BUTTS[0]-d,z:BUTTS[1]+(i-1)*6}));
for(const b of BOSS){pbox(W,b.x,G0,b.z,.8,1.6,2,[.82,.68,.32]);pbox(W,BUTTS[0]+.5,G0,BUTTS[1]+(b.z-BUTTS[1]),.2,1,.2,WOOD)}pbox(W,BUTTS[0]+1,G0,BUTTS[1],.4,.05,16,[.9,.9,.9]);
/* the trebuchet field and its mock wall */
const MOCK=[0,1,2].map(i=>({x:TREB[0]-8+i*8,z:TREB[1]-55,up:1}));
{const[x,z]=TREB;for(const s of[-1,1]){pbox(W,x+s*1.2,G0,z,.4,5.5,.4,WOOD);pbox(W,x+s*1.2,G0,z+1.6,.3,.3,3.6,WOOD,0)}pbox(W,x,G0+5.4,z,2.8,.35,.35,WOOD);pbox(W,x,G0,z,3.4,.3,5,WOOD)}
/* a gravel track from the gate to the nearest road */
{let best=null;for(let a=0;a<TAU;a+=TAU/72){for(let d=10;d<260;d+=5){const x=GATE[0]+Math.sin(a)*d,z=GATE[1]+Math.cos(a)*d;if(roadDist(x,z)<4){if(!best||d<best.d)best={a,d};break}}}
 if(best){for(let k=0;k<best.d;k+=3){const x=GATE[0]+Math.sin(best.a)*k,z=GATE[1]+Math.cos(best.a)*k;pbox(W,x,G0-.02,z,4,.06,3.2,[.66,.6,.5],best.a)}DC.track=best}}
/* clear the old field colliders (hedges, trees, hay) inside the castle grounds, and move the sheep out */
{const Z=(window.MESH_CULL||[])[0];if(Z){for(const[k,q]of CGRID){const f=q.filter(c=>!(c[2]<1.6&&Math.hypot(c[0]-Z.x,c[1]-Z.z)<Z.r));if(f.length!==q.length){if(f.length)CGRID.set(k,f);else CGRID.delete(k)}}
 for(let i=COL.length-1;i>=0;i--){const c=COL[i];if(c[2]<1.6&&Math.hypot(c[0]-Z.x,c[1]-Z.z)<Z.r)COL.splice(i,1)}
 try{for(const sh of TOWN.sheep){if(Math.hypot(sh.x-Z.x,sh.z-Z.z)<Z.r+5){const a=Math.atan2(sh.z-Z.z,sh.x-Z.x),R=Z.r+20;sh.x=Z.x+Math.cos(a)*R;sh.z=Z.z+Math.sin(a)*R;sh.x0=sh.x-4;sh.x1=sh.x+4;sh.z0=sh.z-4;sh.z1=sh.z+4}}}catch(e){czErr(e,'castle.js')}}}
const CMESH=W.mesh(mObj);scene.add(CMESH);colGrid(COLS);
/* banners and the reenactment crowd (weekends), animated */
const EV=new THREE.Group();scene.add(EV);const FLAGS=[];
const flag=(x,y,z,c)=>{const pole=new THREE.Mesh(new THREE.BoxGeometry(.1,3,.1),new THREE.MeshBasicMaterial({color:0x3a2a1a}));pole.position.set(x,y+1.5,z);EV.add(pole);const f=new THREE.Mesh(new THREE.PlaneGeometry(1.4,.9),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));f.position.set(x+.72,y+2.5,z);EV.add(f);FLAGS.push(f)};
for(let i=0;i<8;i++){const a=Math.PI/2+i/8*TAU+.2;flag(CX+Math.cos(a)*(BR+1.5),G0+7,CZ+Math.sin(a)*(BR+1.5),pk([0xc81e1e,0x1e3a8a,0xd8b030,0x1a6a2a]))}
const crowd=[];for(let i=0;i<14;i++){const g=mkPerson(pSpec(5300+i,{scarf:null,bp:false,bag:0}),mObj,EV);const s=i<7?1:-1;g.position.set(TILT[0]+s*10.5+rr(-.6,.6),G0,TILT[1]-20+i%7*6);g.rotation.y=s>0?-Math.PI/2:Math.PI/2;crowd.push(g)}
/* fayre stalls in the bailey */const STALLS=[['MEAD STALL',[.75,.45,.1]],['FALCONRY',[.25,.4,.2]],['COSTUME HIRE',[.55,.15,.45]],['THE ARMOURER',[.35,.35,.4]]];
{const S=new Builder(3);STALLS.forEach(([n,c],i)=>{const x=FAYRE[0]+i*5,z=FAYRE[1];pbox(S,x,G0,z,3.4,1,1.4,WOOD);for(const dx of[-1.6,1.6])pbox(S,x+dx,G0,z-.6,.12,2.6,.12,WOOD);for(let k=0;k<4;k++)pbox(S,x-1.3+k*.85,G0+2.6,z-.2,.85,.1,1.8,k%2?[.95,.92,.85]:c)});const m=S.mesh(mObj);scene.add(m)}
/* the knights and reenactors (weekends) */const KN=[];for(let i=0;i<4;i++){const g=mkPerson(pSpec(5600+i,{tc:[[.6,.1,.1],[.1,.2,.55],[.15,.15,.15],[.85,.7,.2]][i],scarf:null,bp:false,bag:0}),mObj,EV);const hm=new THREE.Mesh(new THREE.CylinderGeometry(.14,.15,.26,10),new THREE.MeshBasicMaterial({color:0x9aa0a8}));hm.position.y=1.82;g.add(hm);g.position.set(RING[0]+Math.cos(i*1.6)*6,G0,RING[1]+Math.sin(i*1.6)*6);KN.push(g)}
const ringPost=new THREE.Group();EV.add(ringPost);{const m=new THREE.MeshBasicMaterial({color:0x6a4a2a});for(let i=0;i<16;i++){const p=new THREE.Mesh(new THREE.BoxGeometry(.15,.9,.15),m);const a=i/16*TAU;p.position.set(RING[0]+Math.cos(a)*5,G0+.45,RING[1]+Math.sin(a)*5);ringPost.add(p)}}
/* the steward, the ghost-tour guide, the armourer */
const NPCS=[];const person=(seed,o,x,z,ry,par)=>{const g=mkPerson(pSpec(seed,Object.assign({scarf:null,bp:false,bag:0},o)),mObj,par||scene);g.position.set(x,hAt(x,z),z);g.rotation.y=ry||0;NPCS.push(g);return g};
const GUIDE=person(5701,{old:true,tc:[.08,.08,.1],hs:5},GATE[0]-3,GATE[1]+3,Math.PI);
/* the Grey Lady (only appears at the end of the ghost tour) */
const LADY=mkPerson(pSpec(5777,{f:true,tc:[.85,.85,.9],hs:3}),new THREE.MeshBasicMaterial({color:0xdde4ee,transparent:true,opacity:.42,vertexColors:true}),scene);LADY.visible=false;
let evT=0;{const u0=updCozy;updCozy=function(dt){u0(dt);evT+=dt;const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,near=!GS.inside&&Math.hypot(px-CX,pz-CZ)<260;
 EV.visible=near&&reen()&&!(A.ACT.on&&/^dc_/.test(A.ACT.k));if(EV.visible){for(const f of FLAGS)f.rotation.y=Math.sin(evT*2+f.position.x)*.35;KN.forEach((g,i)=>{const a=evT*.4+i*1.6;g.position.set(RING[0]+Math.cos(a)*3.2,G0,RING[1]+Math.sin(a)*3.2);g.rotation.y=-a;if(g.a2)g.a2.rotation.x=-1.2+Math.sin(evT*6+i)*.8});crowd.forEach((g,i)=>{if(g.a1)g.a1.rotation.x=-2.6+Math.abs(Math.sin(evT*5+i))*.6})}
 GUIDE.visible=near&&night();if(LADY.visible){LADY.position.y=top()+.2+Math.sin(evT*2)*.15;LADY.rotation.y+=dt*.3}}}
/* map pins (discovered when you get close) */
try{for(const[n,x,z,r,ic]of[['DUDLEY CASTLE',CX,CZ,90,'🏰'],['THE KEEP',MX,MZ,20,'🏯'],['THE GATEHOUSE',GATE[0],GATE[1],18,'🚪'],['THE TILTYARD',TILT[0],TILT[1],30,'🐎'],['CHAPEL RUINS',CX+18,CZ-8,14,'⛪'],['ARCHERY BUTTS',BUTTS[0]-20,BUTTS[1],24,'🏹'],['TREBUCHET FIELD',TREB[0],TREB[1],22,'🪨']])TOWN.pois.push({x,z,n,c:'fun',ic,d:0,r})}catch(e){czErr(e,'castle.js')}

/* ------------------------------------------------------------------ the two interiors */
const KEEPD={x:MX,z:MZ+5.5+1.4,psi:0,t:'DUDLEY CASTLE · THE KEEP',bg:'#3a3228',fg:'#e8d8a8',castle:'keep',rx:6,rz:5,sz:3.6};
const DUNGD={x:MX+MR0*.62,z:MZ+MR0*.62+1.2,psi:Math.PI/4,t:'DUDLEY CASTLE · THE DUNGEONS',bg:'#1a1814',fg:'#c8b880',castle:'dung',rx:5,rz:6,sz:4.6};
SHOPD.push(KEEPD,DUNGD);Object.assign(HRS,{[KEEPD.t]:[9,23],[DUNGD.t]:[9,23]});
{/* a doorway in the motte for the dungeon steps */const d=new Builder(3);pbox(d,DUNGD.x,hAt(DUNGD.x,DUNGD.z)-.2,DUNGD.z,2.4,3,1,STONE2,DUNGD.psi);pbox(d,DUNGD.x+Math.sin(DUNGD.psi)*.3,hAt(DUNGD.x,DUNGD.z)-.2,DUNGD.z+Math.cos(DUNGD.psi)*.3,1.4,2.2,.8,[.08,.07,.06],DUNGD.psi);scene.add(d.mesh(mObj))}
const ia=(x0,x1,z0,z1,label,fn)=>IA.push({r:[x0,x1,z0,z1],label,fn});
const B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex));
const torch=(x,z,ry)=>{B(x,1.6,z,.12,.4,.12,0x3a2a1a);const f=new THREE.Mesh(new THREE.BoxGeometry(.16,.22,.16),new THREE.MeshBasicMaterial({color:0xffa030}));f.position.set(x,2.1,z);SG.add(f);TORCH.push(f)};let TORCH=[];
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!TORCH.length)return;if(!GS.inside){TORCH=[];return}for(const f of TORCH){const s=.8+Math.random()*.5;f.scale.set(s,s*1.2,s)}}}
function room(o,wall,floor){while(SG.children.length)SG.remove(SG.children[0]);
 const fl=new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR[floor]()));SG.add(fl);const wm=()=>{const m=imat(sWl2);m.color.setHex(wall);return m};
 splane(2*RX,IH+1,0,(IH+1)/2,-RZ,0,wm());splane(2*RX,IH+1,0,(IH+1)/2,RZ,Math.PI,wm());splane(2*RZ,IH+1,RX,(IH+1)/2,0,-Math.PI/2,wm());splane(2*RZ,IH+1,-RX,(IH+1)/2,0,Math.PI/2,wm());
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x08080a,side:THREE.BackSide,fog:false}));vd.position.y=IH/2;SG.add(vd);
 splane(1.2,2.3,1.6,1.15,RZ-.03,Math.PI,imat(T_FDOOR));IROOM.splice(0,IROOM.length);IA.splice(0,IA.length);ia(.9,2.3,RZ-.6,RZ,'LEAVE',()=>leaveShop())}
function buildKeep(o){room(o,0x8a8478,'stone');SHOPCUR={o,k:['STEWARD','Welcome to the great hall of Dudley. Mind the draughts.']};
 /* long table, tapestries, a throne dais, the armoury rack, banners */
 B(0,0,0,1.2,.75,5,0x4a2a14);B(0,.75,0,1.4,.08,5.4,0x6a4a24);for(const z of[-2,0,2]){B(-1.1,0,z,.6,.45,.6,0x3a2010);B(1.1,0,z,.6,.45,.6,0x3a2010)}IROOM.push([-.9,.9,-2.9,2.9]);
 B(0,0,-RZ+1.1,3.2,.35,1.6,0x6a5a4a);B(0,.35,-RZ+.6,1.1,1.6,.8,0x7a1a1a);B(0,1.95,-RZ+.6,1.3,.3,.9,0xd8b030);IROOM.push([-1.6,1.6,-RZ,-RZ+1.9]);
 const tap=(c1,c2)=>{const f=cvT(128,192),g=f.cv.getContext('2d');g.fillStyle=c1;g.fillRect(0,0,128,192);g.fillStyle=c2;g.fillRect(10,10,108,172);g.fillStyle=c1;g.beginPath();g.moveTo(64,40);g.lineTo(100,96);g.lineTo(64,152);g.lineTo(28,96);g.fill();f.tx.needsUpdate=true;return f.tx};
 for(const[z,c1,c2]of[[-2.6,'#7a1a1a','#d8b030'],[1.4,'#1a2a6a','#c8c8d0']]){sPlane(1.2,1.8,-RX+.04,1.9,z,Math.PI/2,tap(c1,c2));sPlane(1.2,1.8,RX-.04,1.9,z,-Math.PI/2,tap(c2,c1))}
 torch(-RX+.15,-.6);torch(RX-.15,-.6);torch(-RX+.15,3);torch(RX-.15,3);
 /* the steward */const st=personIn(pSpec(5800,{old:true,tc:[.2,.15,.1],hs:5,gl:false,scarf:null,bp:false,bag:0}),-3.4,-2.6,Math.PI*.25);if(st)SG.add(st);
 ia(-4.6,-2.4,-2.0,-.6,()=>DC.key===0?'TALK TO THE STEWARD':DC.key===1?'THE STEWARD: "ANY SIGN OF MY KEY?"':DC.key===2?'GIVE THE STEWARD HIS KEY':'TALK TO THE STEWARD',steward);
 /* the armoury rack */B(RX-.4,0,-3.4,.6,2.2,1.8,0x3a2a1a);for(let i=0;i<4;i++)B(RX-.5,.4+i*.45,-3.4,.2,.3,1.4,[0x9aa0a8,0x7a7a80,0xb8b8c0,0x8a6a3a][i]);IROOM.push([RX-.8,RX,-4.4,-2.4]);
 ia(RX-2.2,RX-.8,-4.2,-2.6,'THE ARMOURY (BUY ARMOUR & LANCES)',armourer);
 /* the knighting */ia(-1.6,1.6,-RZ+1.9,-RZ+2.8,()=>DC.knight?'THE LORD OF DUDLEY NODS TO YOU, '+(DC.knight===2?'DAME':'SIR')+' KNIGHT':'KNEEL BEFORE THE LORD OF DUDLEY',knighting);
 const lord=personIn(pSpec(5850,{old:true,tc:[.45,.08,.12],hs:5,beard:true,gl:false,scarf:null,bp:false,bag:0}),0,-RZ+.95,0);if(lord)SG.add(lord);
 ia(-4.6,-2.4,2.4,4.2,'LOOK OUT OF THE ARROW SLIT',()=>toast(pk(['YOU CAN SEE THE TILTYARD, THE TOWN HALL CLOCK AND, ON A CLEAR DAY, THE SEA','A PIGEON GIVES YOU A FUNNY LOOK','THE WIND WHISTLES THROUGH. IT WAS COLD BEING A KNIGHT'])))}
function buildDung(o){room(o,0x4a463e,'stone');SHOPCUR={o,k:['GUIDE','Watch your head. And your step. And the rats.']};
 /* cells with bars along both sides, chains, barrels, a well, and the loose stone */
 for(const s of[-1,1])for(const z of[-3.5,-.5]){const x=s*(RX-1.2);B(x,0,z,2.4,.04,2.4,0x3a3630);for(let k=-1;k<=1;k+=.25)B(x-s*1.2,0,z+k,.06,2.6,.06,0x2a2a2a);B(x+s*.9,1.6,z,.06,.6,.06,0x555);IROOM.push([x-1.2,x+1.2,z-1.2,z+1.2])}
 for(const[x,z]of[[-1.6,3.6],[-2.2,3.2],[2.4,3.8]])B(x,0,z,.6,.8,.6,0x5a3a1a),IROOM.push([x-.35,x+.35,z-.35,z+.35]);
 B(0,0,-1.6,1.2,.7,1.2,0x5a5650);B(0,.7,-1.6,.9,.04,.9,0x0a0a0a);IROOM.push([-.7,.7,-2.3,-.9]);
 for(const z of[-4.6,-1.8,1.6])torch(-RX+.15,z),torch(RX-.15,z);
 /* the key glints in a corner while you're looking for it */
 if(DC.key===1){const spots=[[-RX+.6,-RZ+.6],[RX-.6,-RZ+.6],[-RX+.6,1.4],[RX-.6,4.6],[0,-RZ+.5]],s=spots[(DAY||1)%spots.length];const k=new THREE.Mesh(new THREE.BoxGeometry(.18,.04,.08),new THREE.MeshBasicMaterial({color:0xffd040}));k.position.set(s[0],.03,s[1]);SG.add(k);TORCH.push(k);
  ia(s[0]-.8,s[0]+.8,s[1]-.8,s[1]+.8,'PICK UP THE GLINTING THING',()=>{DC.key=2;k.visible=false;bp(988,.1);toast('🗝 THE STEWARD\'S IRON KEY! TAKE IT BACK TO THE GREAT HALL')})}
 else ia(-1,1,-RZ+.3,-RZ+1.3,'SEARCH THE DARK CORNER',()=>toast(pk(['A RAT. A BIG ONE.','COBWEBS. LOTS OF COBWEBS.','OLD CHAINS, RUSTED SOLID','SOMEONE CARVED "W. 1643" INTO THE STONE'])));
 /* the loose stone and the secret passage (after the key is returned) */
 B(0,1.2,-RZ+.06,.8,.5,.08,DC.secret?0x1a1814:0x6a665e);
 ia(-.8,.8,-RZ+.3,-RZ+1.3,()=>DC.key>=3?(DC.secret?'GO THROUGH THE SECRET PASSAGE':'PUSH THE LOOSE STONE'):'A STONE THAT LOOKS SLIGHTLY DIFFERENT',()=>{if(DC.key<3){toast('IT WON\'T BUDGE. MAYBE THE STEWARD KNOWS SOMETHING.');return}secret()})}
{const b0=buildShop;buildShop=function(o){if(o&&o.castle){TORCH=[];RX=o.rx;RZ=o.rz;(o.castle==='keep'?buildKeep:buildDung)(o);try{TOWN.pois.forEach(q=>{if(q.n==='THE DUNGEONS'&&o.castle==='dung')q.d=1})}catch(e){}return}return b0(o)}}
try{TOWN.pois.push({x:DUNGD.x,z:DUNGD.z,n:'THE DUNGEONS',c:'fun',ic:'⛓',d:0,r:6})}catch(e){}

/* ------------------------------------------------------------------ quests */
function steward(){if(DC.key===0){DC.key=1;try{say('STEWARD','"Oh, thank goodness. I\'ve lost the great iron key somewhere in the dungeons. Would you have a look? Mind the rats."',5200)}catch(e){}toast('🗝 QUEST: FIND THE STEWARD\'S KEY IN THE DUNGEONS')}
 else if(DC.key===1)try{say('STEWARD','"It\'ll be down in the dungeons somewhere. It glints in the torchlight."',3600)}catch(e){}
 else if(DC.key===2){DC.key=3;cash+=150;money();try{say('STEWARD','"My key! Splendid. Now, a secret: there\'s a loose stone at the far end of the dungeon. Give it a push."',5200)}catch(e){}toast('🗝 KEY RETURNED · +£150 · THE STEWARD TELLS YOU ABOUT A LOOSE STONE...')}
 else try{say('STEWARD',pk(['"The castle was built in 1070. The keep came later, about 1300."','"Cromwell\'s lot knocked the walls about in 1647. Rude, really."','"On reenactment weekends the whole place comes alive."','"Win the joust, the swords and the archery, and His Lordship will knight you."']),4200)}catch(e){}}
function secret(){if(!DC.secret){DC.secret=1;bp(220,.4,'sawtooth');setTimeout(()=>bp(330,.3,'triangle'),300);try{TOWN.pois.push({x:MX-3,z:MZ-3,n:'THE SECRET PASSAGE',c:'fun',ic:'🕳',d:1})}catch(e){}}
 const O=window.PUBG&&PUBG.gameOv&&PUBG.gameOv('THE SECRET PASSAGE',{w:520,h:300,bg:'rgba(6,5,4,.98)'});if(!O)return toast('A NARROW PASSAGE LEADS INTO THE DARK...');const g=O.g;let t=0,found=DC.secret>1;
 O.msg(found?'The little chamber where you found the chest. Empty now, but it still smells of old candles.':'The stone grinds aside. A narrow passage leads into the dark... and a small chamber with an old chest!');O.clear();
 if(!found)O.btn('OPEN THE CHEST',()=>{DC.secret=2;cash+=300;money();keep_('THE LOST DUDLEY SEAL');bp(988,.12);setTimeout(()=>bp(1319,.2),130);toast('💰 AN OLD CHEST: £300 AND THE LOST DUDLEY SEAL');O.msg('Inside: a bag of old coins (£300) and a wax seal ring with the Dudley lion. A museum piece!');O.clear()},'#8a6a1a');
 O.loop(dt=>{t+=dt;g.fillStyle='#0a0806';g.fillRect(0,0,520,300);const fl=.85+Math.sin(t*9)*.08+Math.random()*.05;const gr=g.createRadialGradient(260,170,10,260,170,220*fl);gr.addColorStop(0,'rgba(255,170,60,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(0,0,520,300);
  g.fillStyle='#3a3228';for(let i=0;i<9;i++)g.fillRect(40+i*50,30+((i*37)%40),46,24);g.fillStyle='#5a3a1a';g.fillRect(200,190,120,70);g.fillStyle='#8a6a1a';g.fillRect(200,190,120,12);if(DC.secret>1){g.fillStyle='#ffd040';g.fillRect(240,180,40,10)}})}
let GT_=null;/* the ghost tour: four stops, then the Grey Lady on the motte */
function ghostTour(){if(GT_)return toast('THE TOUR IS UNDER WAY · FOLLOW THE LANTERN');if(!night())return toast('GHOST TOURS START AT 8PM');if(!pay(8))return;
 const stops=[[GATE[0],GATE[1]-6,'"This gatehouse saw a siege in 1644. On still nights, you can hear the drums."'],[CX+18,CZ-2,'"The chapel. A monk was walled up here, they say. Don\'t lean on that wall."'],[CX-24,CZ-8,'"The old well. Coins thrown in vanish without a splash. Nobody knows why."'],[DUNGD.x+2,DUNGD.z+2,'"Below us, the dungeons. Prisoners carved their names... and some never left."'],[MX,MZ+2,'"And here, the keep. Where Dorothy Beaumont, the Grey Lady, still walks..."']];
 GT_={i:0,stops};toast('🕯 THE GHOST TOUR BEGINS · FOLLOW THE LANTERN TO EACH STOP');try{PH.way={x:stops[0][0],z:stops[0][1],n:'GHOST TOUR',keep:1};phWay()}catch(e){}}
{let t=0;const u0=updCozy;updCozy=function(dt){u0(dt);if(!GT_||GS.inside)return;t-=dt;if(t>0)return;t=.4;const s=GT_.stops[GT_.i],px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z;if(Math.hypot(px-s[0],pz-s[1])<5){bp(180+GT_.i*30,.5,'sine',.04);try{say('GUIDE',s[2],4600)}catch(e){toast(s[2])}GT_.i++;
 if(GT_.i>=GT_.stops.length){LADY.position.set(MX-2,top(),MZ-2);LADY.visible=true;setTimeout(()=>{bp(110,1.2,'sine',.05);toast('👻 A PALE FIGURE DRIFTS ACROSS THE KEEP... THE GREY LADY!');DC.ghost++;if(DC.ghost===1)keep_('GREY LADY SIGHTING (GHOST TOUR)')},2600);setTimeout(()=>{LADY.visible=false;toast('SHE\'S GONE. THE GUIDE IS VERY QUIET.')},9000);GT_=null;try{PH.way=null;phWay()}catch(e){}}
 else{try{const n=GT_.stops[GT_.i];PH.way={x:n[0],z:n[1],n:'GHOST TOUR',keep:1};phWay()}catch(e){}}}}}
function knighting(){if(DC.knight){toast('🛡 YOU ARE ALREADY A KNIGHT OF DUDLEY. ARISE, '+(DC.knight===2?'DAME':'SIR')+'!');return}
 const need=[[DC.joust>=3,'JOUSTING CHAMPION (beat all three knights)'],[DC.sword>=3,'MASTER OF THE SWORD (win all three duels)'],[DC.arch>=1,'ARCHER\'S TITLE (score 45 or more at the butts)']],miss=need.filter(n=>!n[0]);
 if(miss.length){toast('THE LORD OF DUDLEY: "Prove yourself first."');setTimeout(()=>toast('STILL TO WIN: '+miss.map(m=>m[1]).join(' · ')),2400);return}
 const O=PUBG.gameOv('THE KNIGHTING',{w:520,h:300,bg:'rgba(20,8,6,.98)'}),g=O.g;O.msg('Kneel, and choose your title.');O.clear();
 const dub=k=>{DC.knight=k;cash+=500;money();keep_('THE ACCOLADE OF DUDLEY (YOU WERE KNIGHTED)');for(let i=0;i<5;i++)setTimeout(()=>bp(523+i*130,.18,'square',.05),i*160);toast('⚔ ARISE, '+(k===2?'DAME':'SIR')+' KNIGHT OF DUDLEY! +£500');O.msg('The sword touches each shoulder. "Arise, '+(k===2?'Dame':'Sir')+' Knight of Dudley." The hall erupts.');O.clear()};
 O.btn('ARISE, SIR KNIGHT',()=>dub(1),'#7a1a1a');O.btn('ARISE, DAME KNIGHT',()=>dub(2),'#1a2a6a');
 let t=0;O.loop(dt=>{t+=dt;g.fillStyle='#1a0a06';g.fillRect(0,0,520,300);g.fillStyle='#7a1a1a';g.fillRect(200,40,120,220);g.fillStyle='#d8b030';g.fillRect(230,60,60,8);g.save();g.translate(260,150);g.rotate(Math.sin(t*1.5)*.6);g.fillStyle='#c8ccd4';g.fillRect(-4,-110,8,110);g.fillStyle='#d8b030';g.fillRect(-18,-4,36,8);g.restore()})}

/* ------------------------------------------------------------------ shops and stalls */
function armourer(){const O=PUBG.gameOv('THE ARMOURY',{w:520,h:150,bg:'rgba(14,14,18,.98)'}),g=O.g;const show=()=>{O.clear();O.msg('Better armour lets you take more hits in sword duels and in the joust. Worn: '+ARM[DC.armour][0]+' · Lance: '+LANCES[DC.lance][0]);
 ARM.forEach((a,i)=>{if(i===0)return;O.btn((DC.armour>=i?'✓ ':'')+a[0]+(DC.armour>=i?'':' · £'+a[1]),()=>{if(DC.armour>=i)return;if(!pay(a[1]))return;DC.armour=i;bp(660,.08);toast('🛡 YOU BUY THE '+a[0]);show()},DC.armour>=i?'#333':'#4a4a5a')});
 LANCES.forEach((l,i)=>{if(i===0)return;O.btn((DC.lance>=i?'✓ ':'')+l[0]+(DC.lance>=i?'':' · £'+l[1]),()=>{if(DC.lance>=i)return;if(!pay(l[1]))return;DC.lance=i;bp(660,.08);toast('🐎 YOU BUY A '+l[0]);show()},DC.lance>=i?'#333':'#5a3a1a')})};show();
 g.fillStyle='#1a1a20';g.fillRect(0,0,520,150);g.fillStyle='#c8ccd4';for(let i=0;i<4;i++){g.fillRect(60+i*120,30,50,70);g.fillStyle=['#c8ccd4','#9aa0a8','#e0e4ea','#8a6a3a'][i]}}
function mead(){const O=PUBG.gameOv('THE MEAD STALL',{w:420,h:110,bg:'rgba(30,18,6,.98)'});O.msg('"Honey mead, brewed at Hollow Farm. Pottage for the hungry."');O.clear();
 for(const[n,p,f,e,m]of[['HONEY MEAD',4,4,18,'Sweet and strong. You feel like a lord.'],['SPICED CIDER',3,4,16,'Warming and cloudy.'],['POTTAGE & BREAD',5,38,8,'Medieval stew. Surprisingly good.'],['ROAST PIG ROLL',6,45,6,'With crackling and apple sauce.']])O.btn(n+' · £'+p,()=>{if(!pay(p))return;feed(f,e,m);O.msg(m)},'#6a4a1a');
 O.g.fillStyle='#3a2410';O.g.fillRect(0,0,420,110);O.g.fillStyle='#ffd870';O.g.font='bold 22px Georgia';O.g.textAlign='center';O.g.fillText('YE OLDE MEAD',210,62)}
let COST=null;function costume(){if(DC.costume===DAY){toast('YOU\'RE ALREADY IN COSTUME. VERY DASHING.');return}if(!pay(10))return;DC.costume=DAY;wearCostume();toast('🎭 YOU HIRE A KNIGHT\'S TABARD AND HELM FOR THE DAY')}
function wearCostume(){if(COST)return;const g=new THREE.Group();const t=new THREE.Mesh(new THREE.BoxGeometry(.48,.62,.32),new THREE.MeshBasicMaterial({color:0x8a1a1a}));t.position.y=1.16;g.add(t);const c=new THREE.Mesh(new THREE.BoxGeometry(.1,.3,.34),new THREE.MeshBasicMaterial({color:0xd8b030}));c.position.y=1.22;g.add(c);
 const h=new THREE.Mesh(new THREE.CylinderGeometry(.15,.16,.3,10),new THREE.MeshBasicMaterial({color:0xa0a6b0}));h.position.y=1.78;g.add(h);man.add(g);COST=g}
{const n0=newDay;newDay=function(){n0();if(COST){COST.parent&&COST.parent.remove(COST);COST=null;toast('YOU HAND THE COSTUME BACK TO THE FAYRE')}}}
setTimeout(()=>{if(DC.costume===DAY)wearCostume()},4000);

/* ------------------------------------------------------------------ the 3D activities */
const mat=c=>new THREE.MeshBasicMaterial({color:c}),BOX=(w,h,d,c)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)),SPH=(r,c)=>new THREE.Mesh(new THREE.SphereGeometry(r,10,8),mat(c));
const HUD=document.createElement('div');HUD.style.cssText='position:fixed;left:50%;top:64px;transform:translateX(-50%);z-index:60;display:none;font:bold 13px ui-monospace,monospace;color:#fff;text-align:center;pointer-events:none;text-shadow:1px 1px 0 #000';document.body.appendChild(HUD);
const BIG=document.createElement('div');BIG.style.cssText='position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:61;font:bold 40px ui-monospace,monospace;color:#ffd24a;text-shadow:3px 3px 0 #000;pointer-events:none;display:none;text-align:center';document.body.appendChild(BIG);
let bigT=0;const big=(t,s,c)=>{BIG.innerHTML=t;BIG.style.color=c||'#ffd24a';BIG.style.display='block';bigT=s||.9};
{const u0=updCozy;updCozy=function(dt){u0(dt);if(bigT>0){bigT-=dt;if(bigT<=0)BIG.style.display='none'}}}
const bar=(lab,v,c,w)=>`<div style="width:${w||220}px;margin:3px auto;background:#000a;border:1px solid #fff8;border-radius:6px;height:14px;position:relative;overflow:hidden"><div style="width:${cl(v,0,1)*100}%;height:100%;background:${c}"></div><span style="position:absolute;left:6px;top:0;font-size:10px">${lab}</span></div>`;
function begin(k,o){if(!A.actStart('dc_'+k,Object.assign({fov:60},o||{})))return null;const st={objs:[],t:0,done:0};st.add=(m,par)=>{(par||scene).add(m);st.objs.push(m);return m};
 st.finish=(msg,ms)=>{if(st.done)return;st.done=1;A.topTxt(msg);toast(msg);setTimeout(()=>{if(A.ACT.on&&A.ACT.k==='dc_'+k)A.actEnd()},ms||3400)};
 A.ACT.end=()=>{for(const m of st.objs)m.parent&&m.parent.remove(m);man.visible=true;for(const a of[armL,armR]){a.rotation.set(0,0,0);a.fore.rotation.set(0,0,0)}HUD.style.display='none';BIG.style.display='none';P.speed=0;const bu=document.getElementById('bUse');if(bu)bu.style.visibility='visible';if(st.onEnd)st.onEnd()};
 HUD.style.display='block';HUD.innerHTML='';const bu=document.getElementById('bUse');if(bu)bu.style.visibility='hidden';return st}
function horseMesh(c){const Bd=new Builder(3),d=[c[0]*.6,c[1]*.6,c[2]*.6];pbox(Bd,0,1.0,0,.6,.7,1.7,c);pbox(Bd,0,1.45,.95,.32,.7,.36,c,0);pbox(Bd,0,1.85,1.2,.26,.3,.6,c);pbox(Bd,0,1.95,1.2,.08,.25,.5,d);for(const[x,z]of[[-.2,-.65],[.2,-.65],[-.2,.65],[.2,.65]])pbox(Bd,x,0,z,.14,1.02,.14,d);pbox(Bd,0,1.25,-.95,.1,.6,.1,d);
 pbox(Bd,0,1.05,0,.66,.6,1.2,[.7,.1,.1]);return Bd.mesh(mObj)}

/* =========== JOUSTING: three passes, aim the lance at the shield, brace at the moment of impact */
const FOES=[{n:'SIR ROGER OF SEDGLEY',skill:.25,c:[.6,.1,.1]},{n:'SIR HUGH THE BOLD',skill:.5,c:[.1,.2,.55]},{n:'THE BLACK KNIGHT',skill:.8,c:[.08,.08,.08]}];
function joust(){if(!reen()){toast('JOUSTING IS ON REENACTMENT WEEKENDS (SAT & SUN, 10AM-5PM)');return}const lvl=Math.min(2,DC.joust),F=FOES[lvl];
 const st=begin('joust',{fov:62,dragLook:1,yaw:.3,pitch:-.05});if(!st)return;man.visible=false;
 const L0=TILT[1]-34,L1=TILT[1]+34,xa=TILT[0]-1.5,xb=TILT[0]+1.5;
 const myH=st.add(horseMesh([.45,.3,.18])),foeH=st.add(horseMesh([.85,.85,.82])),foe=st.add(mkPerson(pSpec(5900+lvl,{tc:F.c,scarf:null,bp:false,bag:0}),mObj,scene));
 const shield=st.add(BOX(.5,.6,.06,0xd8b030));const lance=st.add(BOX(.08,.08,3.6,0xc8a060));const flance=st.add(BOX(.08,.08,3.6,0x3a2a1a));
 const S={pass:0,z:L0,fz:L1,sp:0,pts:0,fpts:0,brace:0,braceT:-9,aimX:0,aimY:0,state:'ready',cool:0,hp:3+DC.armour};
 const tgt=()=>({x:xb-.45,y:G0+2.35+Math.sin(st.t*3)*.12*(1-F.skill*.5)});
 A.btns([['🛡 BRACE!',()=>{S.braceT=st.t;bp(500,.04)}],['▶ CHARGE',()=>{if(S.state==='ready'){S.state='charge';S.sp=0;bp(220,.2,'sawtooth')}}],['✕',()=>st.finish('YOU WITHDRAW FROM THE LISTS.',800)]]);
 A.ACT.key=(e,d)=>{if(!d)return;if(e.key===' '){S.braceT=st.t}if(e.key==='Enter'&&S.state==='ready'){S.state='charge';S.sp=0}};
 A.topTxt('🐎 JOUST vs '+F.n+'\nTAP CHARGE · DRAG TO AIM THE LANCE AT HIS SHIELD · BRACE AS YOU MEET');
 A.ACT.tick=dt=>{st.t+=dt;if(st.done)return;
  if(S.state==='charge'){S.sp=Math.min(9+DC.lance,S.sp+dt*7);S.z+=S.sp*dt;S.fz-=S.sp*dt*(.95+F.skill*.15);
   if(S.fz-S.z<1.2&&!S.hit){S.hit=1;const t=tgt(),aim=A.ACT.yaw,pit=A.ACT.pitch;/* where my lance tip is when we meet */const lx=xa+.3+Math.tan(aim)*3,ly=G0+2.3+Math.tan(pit)*3,miss=Math.hypot(lx-t.x,ly-t.y),timing=Math.abs(st.t-S.braceT);
    const myHit=miss<.38+.06*DC.lance,braced=timing<.35,mine=myHit?(braced?(miss<.16?3:2):1):0;
    const foeHit=Math.random()<.35+F.skill*.45,blocked=foeHit&&braced&&Math.random()<.4+DC.armour*.15;const theirs=foeHit&&!blocked?(Math.random()<F.skill*.5?2:1):0;
    S.pts+=mine;S.fpts+=theirs;
    if(mine===3){big('LANCE SHATTERED! +3',1.3,'#ffd24a');bp(1040,.15)}else if(mine===2){big('CLEAN HIT +2',1.1,'#80ff80');bp(880,.1)}else if(mine===1){big('GLANCING BLOW +1',1,'#c0ffc0');bp(660,.08)}else{big('MISSED!',1,'#ff8080');bp(160,.25,'sawtooth')}
    if(theirs){setTimeout(()=>{big(blocked?'BLOCKED!':'HE HITS YOU!',1,blocked?'#80c0ff':'#ff6060');try{flashRed&&flashRed()}catch(e){}},500)}else if(foeHit&&blocked)setTimeout(()=>big('YOU TURN HIS LANCE!',1,'#80c0ff'),500)}
   if(S.z>L1-2){S.pass++;S.state=S.pass>=3?'end':'turn';S.cool=1.6;S.hit=0}}
  if(S.state==='turn'){S.cool-=dt;if(S.cool<=0){S.z=L0;S.fz=L1;S.state='ready';A.topTxt('PASS '+(S.pass+1)+'/3 · YOU '+S.pts+' · '+F.n.split(' ').slice(-1)[0]+' '+S.fpts+'\nTAP CHARGE WHEN READY')}}
  if(S.state==='end'){S.state='over';const win=S.pts>S.fpts;if(win){if(DC.joust===lvl)DC.joust=lvl+1;cash+=40+lvl*40;money();st.finish('🏆 YOU WIN THE JOUST '+S.pts+'-'+S.fpts+' vs '+F.n+'! +£'+(40+lvl*40)+(DC.joust>=3?' · JOUSTING CHAMPION!':' · NEW RANK: '+RANKS[DC.joust]),4200)}else st.finish('YOU LOSE THE JOUST '+S.pts+'-'+S.fpts+'. '+F.n+' SALUTES YOU.',3800)}
  /* place everything */myH.position.set(xa,G0,S.z);myH.rotation.y=0;foeH.position.set(xb,G0,S.fz);foeH.rotation.y=Math.PI;foe.position.set(xb,G0+.9,S.fz);foe.rotation.y=Math.PI;if(foe.l1){foe.l1.rotation.x=-1.4;foe.l2.rotation.x=-1.4}
  const t=tgt();shield.position.set(t.x,t.y,S.fz-.25);flance.position.set(xb-.6,G0+2.4,S.fz-1.6);flance.rotation.y=.18;
  const bob=Math.sin(st.t*11)*.06*(S.sp/10);lance.position.set(xa+.45+Math.sin(A.ACT.yaw)*2.2,G0+2.05+Math.sin(A.ACT.pitch)*2.2+bob,S.z+2.2);lance.rotation.set(-A.ACT.pitch,A.ACT.yaw,0);
  HUD.innerHTML=bar('YOU '+S.pts,S.pts/9,'#40c060')+bar(F.n+' '+S.fpts,S.fpts/9,'#d04040')+'<div style="font-size:22px;margin-top:6px">+</div>'};
 A.ACT.cam=()=>{const bob=Math.sin(st.t*11)*.08*(S.sp/10);cam.position.set(xa,G0+2.55+bob,S.z-.2);cam.lookAt(xa+Math.sin(A.ACT.yaw)*10,G0+2.4+Math.sin(A.ACT.pitch)*10,S.z+10)};}

/* =========== SWORD DUEL: read his telegraph, block high or low, parry at the last moment, then strike */
const DUEL=[{n:'WAT THE SMITH',sp:1.0,hp:6},{n:'SIR GILES',sp:.8,hp:8},{n:'THE CAPTAIN OF THE GUARD',sp:.62,hp:10}];
function sword(){if(!reen()){toast('SWORD DUELS ARE ON REENACTMENT WEEKENDS (SAT & SUN, 10AM-5PM)');return}const lvl=Math.min(2,DC.sword),F=DUEL[lvl];
 const st=begin('sword',{fov:55});if(!st)return;const C=[RING[0],RING[1]];P.x=C[0];P.z=C[1]+2;P.y=G0;P.psi=Math.PI;
 const foe=st.add(mkPerson(pSpec(6000+lvl,{tc:[[.4,.3,.2],[.1,.2,.55],[.6,.1,.1]][lvl],beard:lvl===2,scarf:null,bp:false,bag:0}),mObj,scene));foe.position.set(C[0],G0,C[1]-.6);const fs=st.add(BOX(.05,.9,.05,0xc8ccd4),foe.a2);fs.position.set(0,-.95,.25);
 const ms=st.add(BOX(.05,.9,.05,0xd8dce4),armR.fore);ms.position.set(0,-.6,.2);
 const S={hp:5+DC.armour*2,mhp:5+DC.armour*2,fhp:F.hp,atk:null,cd:1.5,guard:'',gT:0,open:0,msg:''};
 const atk=()=>{const k=pk(['HIGH','LOW','THRUST']);S.atk={k,t:0,dur:F.sp*rr(.9,1.3)}};
 const guard=g=>{S.guard=g;S.gT=st.t;bp(300,.03)};
 const strike=()=>{if(S.atk&&S.atk.t>.15&&!S.open){big('TOO SLOW: HE\'S ATTACKING!',.6,'#ff8080');return}const blocked=!S.open&&Math.random()<.35+lvl*.15;if(blocked){big('HE BLOCKS',.6,'#c0c0ff');bp(250,.05);S.cd=Math.min(S.cd,.5)}else{const d=S.open?2:1;S.fhp-=d;S.open=0;big(d>1?'COUNTER-STRIKE! -2':'HIT! -1',.7,'#80ff80');bp(880,.06)}armR.rotation.x=-2;setTimeout(()=>{armR.rotation.x=-.8},180)};
 A.btns([['⬆ BLOCK HIGH',()=>guard('HIGH')],['⬇ BLOCK LOW',()=>guard('LOW')],['↔ SIDESTEP',()=>guard('THRUST')],['⚔ STRIKE',strike],['✕',()=>st.finish('YOU YIELD THE DUEL.',800)]]);
 A.ACT.key=(e,d)=>{if(!d)return;const k=e.key;if(k==='ArrowUp'||k==='w')guard('HIGH');if(k==='ArrowDown'||k==='s')guard('LOW');if(k==='ArrowLeft'||k==='ArrowRight'||k==='a'||k==='d')guard('THRUST');if(k===' ')strike()};
 A.topTxt('⚔ DUEL vs '+F.n+'\nWATCH HIS SWORD: HIGH SWING, LOW SWEEP OR THRUST · BLOCK JUST BEFORE IT LANDS TO PARRY, THEN STRIKE');
 A.ACT.tick=dt=>{st.t+=dt;if(st.done)return;S.cd-=dt;if(!S.atk&&S.cd<=0)atk();
  if(S.atk){const a=S.atk;a.t+=dt;const f=a.t/a.dur;/* telegraph */if(foe.a2){foe.a2.rotation.x=a.k==='HIGH'?-2.8*Math.min(1,f*1.3):a.k==='LOW'?-.6+.9*Math.min(1,f):-1.5;foe.a2.rotation.z=a.k==='LOW'?-.9:0}foe.position.z=C[1]-.6+(a.k==='THRUST'?Math.min(1,f)*.35:0);
   if(f>=1){const ok=S.guard===a.k&&st.t-S.gT<.7,parry=ok&&st.t-S.gT<.25;if(parry){S.open=1;big('PARRY! STRIKE NOW!',.9,'#ffd24a');bp(1040,.08)}else if(ok){big('BLOCKED',.6,'#80c0ff');bp(400,.05)}else{const dmg=lvl===2&&a.k==='THRUST'?2:1;S.hp-=dmg;big('OUCH! -'+dmg,.7,'#ff6060');bp(150,.2,'sawtooth');try{flashRed&&flashRed()}catch(e){}}S.atk=null;S.cd=F.sp*rr(.6,1.4);if(foe.a2)foe.a2.rotation.set(-.4,0,0);foe.position.z=C[1]-.6;setTimeout(()=>{S.open=0},900)}}
  if(S.fhp<=0){if(DC.sword===lvl)DC.sword=lvl+1;cash+=30+lvl*30;money();st.finish('🏆 YOU DEFEAT '+F.n+'! +£'+(30+lvl*30)+(DC.sword>=3?' · MASTER OF THE SWORD!':''),4000)}else if(S.hp<=0)st.finish(F.n+' DISARMS YOU. "Again tomorrow?"',3600);
  HUD.innerHTML=bar('YOU',S.hp/S.mhp,'#40c060')+bar(F.n,S.fhp/F.hp,'#d04040')+(S.atk?'<div style="font-size:15px;color:#ffd24a;margin-top:4px">'+({HIGH:'⬆ HIGH SWING!',LOW:'⬇ LOW SWEEP!',THRUST:'↔ THRUST!'}[S.atk.k])+'</div>':'')};
 A.ACT.cam=()=>{man.position.set(P.x,G0,P.z);man.rotation.set(0,Math.PI,0);armR.rotation.set(-.8,0,.1);armL.rotation.set(-.3,0,-.2);cam.position.set(C[0]+1.1,G0+2.1,C[1]+4.2);cam.lookAt(C[0],G0+1.3,C[1]-.4)}}

/* =========== ARCHERY: drag to aim, hold DRAW and let go, allow for the wind */
function archery(){if(GT<9||GT>=18){toast('THE ARCHERY BUTTS ARE OPEN 9AM-6PM');return}if(!pay(3))return;
 const st=begin('arch',{fov:48,dragLook:1,yaw:-Math.PI/2,pitch:.02});if(!st)return;man.visible=false;
 const O=[BUTTS[0]+1.5,BUTTS[1]];const faces=BOSS.map(b=>{const f=new THREE.Group();const ring=[0xf4f4f0,0x111111,0x2a6ad0,0xd02020,0xffd020];for(let i=0;i<5;i++){const m=new THREE.Mesh(new THREE.CircleGeometry(.6-i*.12,20),mat(ring[i]));m.position.x=.01*i;m.rotation.y=Math.PI/2;f.add(m)}f.position.set(b.x+.42,G0+1.0,b.z);st.add(f);return f});
 const S={left:6,score:0,draw:0,drawing:0,arrows:[],wind:rr(-2.2,2.2),msg:''};const bow=st.add(BOX(.04,1.1,.04,0x6a4a2a));
 const loose=()=>{if(!S.drawing||S.left<=0)return;S.drawing=0;const p=Math.max(.25,S.draw),v=30+p*34,yw=A.ACT.yaw,pt=A.ACT.pitch;S.left--;const m=st.add(BOX(.03,.03,.7,0x8a6a3a));S.arrows.push({x:O[0],y:G0+1.55,z:O[1],vx:Math.sin(yw)*Math.cos(pt)*v,vy:Math.sin(pt)*v,vz:Math.cos(yw)*Math.cos(pt)*v,m,live:1});S.draw=0;bp(300,.06,'triangle')};
 A.btns([['🏹 HOLD TO DRAW',()=>{if(S.left>0)S.drawing=1},loose],['✕',()=>st.finish('YOU PUT THE BOW DOWN.',800)]]);
 A.ACT.key=(e,d)=>{if(e.key===' '){if(d&&!S.drawing&&S.left>0)S.drawing=1;else if(!d)loose()}};
 A.topTxt('🏹 ARCHERY BUTTS · 6 ARROWS · 20, 40 AND 60 METRES\nDRAG TO AIM · HOLD DRAW, LET GO TO LOOSE · THE FAR BOSS SCORES DOUBLE');
 A.ACT.tick=dt=>{st.t+=dt;if(st.done)return;if(S.drawing)S.draw=Math.min(1,S.draw+dt*.8);
  for(const a of S.arrows){if(!a.live)continue;a.vy-=9.8*dt;a.vz+=S.wind*dt*.6;a.x+=a.vx*dt;a.y+=a.vy*dt;a.z+=a.vz*dt;a.m.position.set(a.x,a.y,a.z);a.m.lookAt(a.x+a.vx,a.y+a.vy,a.z+a.vz);
   for(let i=0;i<BOSS.length;i++){const b=BOSS[i];if(a.x<=b.x+.42&&a.x>b.x-.5&&Math.abs(a.z-b.z)<1.4){a.live=0;const r=Math.hypot(a.y-(G0+1.0),a.z-b.z);if(r<.6){const ring=Math.min(4,Math.floor(r/.12)),pts=(10-ring*2)*(i===2?2:1);S.score+=pts;big(pts+(i===2?' (×2)':''),.9,['#ffd020','#ff5050','#5a9aff','#ffffff','#dddddd'][ring]);bp(600+pts*20,.08)}else{big('MISS',.6,'#bbb')}break}}
   if(a.y<G0||a.x<BUTTS[0]-75){a.live=0}}
  if(S.left<=0&&!S.arrows.some(a=>a.live)){if(S.score>DC.archBest)DC.archBest=S.score;const title=S.score>=45;if(title&&!DC.arch){DC.arch=1}const prize=S.score>=60?25:S.score>=45?12:S.score>=30?4:0;if(prize){cash+=prize;money()}st.finish('🏹 '+S.score+' POINTS'+(title?' · ARCHER\'S TITLE!':'')+(prize?' · +£'+prize:'')+' · BEST '+DC.archBest,4000)}
  HUD.innerHTML=bar('DRAW',S.draw,'#ffd24a')+'<div>ARROWS '+S.left+' · SCORE '+S.score+' · WIND '+(S.wind>0?'→':'←')+' '+Math.abs(S.wind).toFixed(1)+'</div><div style="font-size:22px">+</div>'};
 A.ACT.cam=()=>{cam.position.set(O[0],G0+1.6,O[1]);cam.lookAt(O[0]+Math.sin(A.ACT.yaw)*10,G0+1.6+Math.sin(A.ACT.pitch)*10,O[1]+Math.cos(A.ACT.yaw)*10);bow.position.set(O[0]+Math.sin(A.ACT.yaw)*1.1-Math.cos(A.ACT.yaw)*.32,G0+1.25,O[1]+Math.cos(A.ACT.yaw)*1.1+Math.sin(A.ACT.yaw)*.32);bow.rotation.set(0,A.ACT.yaw,.25)}}

/* =========== TREBUCHET: set the angle and the counterweight, knock down the mock wall */
function trebuchet(){if(!reen()){toast('THE SIEGE DEMO IS ON REENACTMENT WEEKENDS (SAT & SUN, 10AM-5PM)');return}
 const st=begin('treb',{fov:55});if(!st)return;const S={ang:45,cw:60,shots:6,rocks:[],walls:MOCK.map(m=>{const g=st.add(BOX(6,5,1.2,0x9a9488));g.position.set(m.x,G0+2.5,m.z);return{m,g,up:1,fall:0}})};
 const arm=st.add(BOX(.3,.3,7,0x6a4a2a));arm.position.set(TREB[0],G0+5.5,TREB[1]);
 const fire=()=>{if(S.shots<=0||S.rocks.some(r=>r.live))return;S.shots--;const a=S.ang*Math.PI/180,v=14+S.cw*.28,m=st.add(SPH(.45,0x6a6a6a));S.rocks.push({x:TREB[0]+rr(-.3,.3),y:G0+7,z:TREB[1]-2,vy:Math.sin(a)*v,vz:-Math.cos(a)*v,m,live:1});S.swing=1;bp(120,.4,'sawtooth');setTimeout(()=>bp(90,.3,'triangle'),200)};
 A.btns([['ANGLE −',()=>S.ang=cl(S.ang-3,20,70)],['ANGLE +',()=>S.ang=cl(S.ang+3,20,70)],['WEIGHT −',()=>S.cw=cl(S.cw-5,20,100)],['WEIGHT +',()=>S.cw=cl(S.cw+5,20,100)],['🪨 LOOSE!',fire],['✕',()=>st.finish('THE SIEGE ENGINEERS THANK YOU.',800)]]);
 A.topTxt('🪨 TREBUCHET SIEGE DEMO · KNOCK DOWN ALL THREE WALL SECTIONS · 6 SHOTS\nSET THE RELEASE ANGLE AND THE COUNTERWEIGHT, THEN LOOSE!');
 A.ACT.tick=dt=>{st.t+=dt;if(st.done)return;if(S.swing){S.swing+=dt*4;arm.rotation.x=Math.min(Math.PI*.8,S.swing);if(S.swing>4)S.swing=0}else arm.rotation.x+=(0-arm.rotation.x)*dt*2;
  for(const r of S.rocks){if(!r.live)continue;r.vy-=9.8*dt;r.y+=r.vy*dt;r.z+=r.vz*dt;r.m.position.set(r.x,r.y,r.z);for(const w of S.walls){if(w.up&&Math.abs(r.z-w.m.z)<1.2&&Math.abs(r.x-w.m.x)<3.4&&r.y<G0+5.2){w.up=0;w.fall=.01;r.live=0;big('DIRECT HIT!',1,'#ffd24a');bp(80,.6,'sawtooth')}}if(r.y<G0){r.live=0;big(Math.abs(r.z-MOCK[0].z)<6?'JUST SHORT!':r.z<MOCK[0].z?'OVER THE WALL!':'SHORT!',.8,'#ddd');bp(100,.2)}}
  for(const w of S.walls){if(w.fall&&w.fall<1){w.fall+=dt;w.g.rotation.x=-w.fall*1.5;w.g.position.y=G0+2.5-w.fall*2}}
  const down=S.walls.filter(w=>!w.up).length;if(down===3){DC.treb++;cash+=50;money();st.finish('🏰 THE WALL FALLS! ALL THREE SECTIONS DOWN · +£50',4000)}else if(S.shots<=0&&!S.rocks.some(r=>r.live))st.finish(down+'/3 SECTIONS DOWN. THE DEFENDERS JEER.',3600);
  HUD.innerHTML='<div style="font-size:15px">ANGLE '+S.ang+'° · COUNTERWEIGHT '+S.cw+' · SHOTS '+S.shots+' · DOWN '+down+'/3</div>'};
 A.ACT.cam=()=>{cam.position.set(TREB[0]+14,G0+9,TREB[1]+6);cam.lookAt(TREB[0],G0+3,TREB[1]-40)}}

/* =========== FALCONRY: raise your glove as the hawk swoops in */
function falconry(){if(!reen()){toast('THE FALCONRY DISPLAY IS ON REENACTMENT WEEKENDS (SAT & SUN, 10AM-5PM)');return}
 const st=begin('hawk',{fov:62,dragLook:0});if(!st)return;const C=[FAYRE[0]+5,FAYRE[1]+6];P.x=C[0];P.z=C[1];P.y=G0;P.psi=Math.PI;
 const hawk=st.add(new THREE.Group());const body=BOX(.18,.16,.42,0x6a4a2a);hawk.add(body);const wl=BOX(.9,.03,.24,0x5a3a1a);hawk.add(wl);const glove=st.add(BOX(.12,.14,.24,0x8a5a2a),armL.fore);glove.position.set(0,-.55,.1);
 const S={t:0,phase:'circle',dive:0,caught:0,tries:5,window:0};A.btns([['🧤 RAISE GLOVE',()=>{if(S.phase==='dive'&&S.dive>.78&&S.dive<.98){S.caught++;S.phase='land';S.land=1.2;big('SHE LANDS ON YOUR GLOVE!',1,'#80ff80');bp(988,.1)}else if(S.phase==='dive'){S.phase='circle';S.tries--;big(S.dive<.78?'TOO EARLY! SHE PULLS UP':'TOO LATE!',.9,'#ff9090');S.t=0}}],['✕',()=>st.finish('THE FALCONER TAKES HER BACK.',800)]]);
 A.topTxt('🦅 FALCONRY · MERLIN THE HARRIS HAWK\nWHEN SHE SWOOPS STRAIGHT AT YOU, RAISE YOUR GLOVE AT THE LAST MOMENT');
 A.ACT.tick=dt=>{st.t+=dt;if(st.done)return;S.t+=dt;
  if(S.phase==='circle'){const a=S.t*1.1;hawk.position.set(C[0]+Math.cos(a)*14,G0+12+Math.sin(a*2)*2,C[1]-14+Math.sin(a)*10);hawk.rotation.y=-a;wl.rotation.z=Math.sin(st.t*10)*.5;if(S.t>rr(3.5,6)){S.phase='dive';S.dive=0;S.from=hawk.position.clone()}}
  else if(S.phase==='dive'){S.dive+=dt*.55;const to=new THREE.Vector3(C[0]-.25,G0+1.3,C[1]-.4);hawk.position.lerpVectors(S.from,to,Math.min(1,S.dive));hawk.lookAt(to);wl.rotation.z=.1;if(S.dive>1.08){S.phase='circle';S.tries--;big('SHE OVERSHOOTS!',.9,'#ff9090');S.t=0}}
  else if(S.phase==='land'){S.land-=dt;hawk.position.set(C[0]-.25,G0+1.42,C[1]-.4);if(S.land<=0){S.phase='circle';S.tries--;S.t=0}}
  if(S.tries<=0){DC.hawk=Math.max(DC.hawk,S.caught);const prize=S.caught*4;if(prize){cash+=prize;money()}st.finish('🦅 SHE CAME TO YOUR GLOVE '+S.caught+'/5 TIMES'+(prize?' · +£'+prize+' FROM THE FALCONER':''),3800)}
  HUD.innerHTML='<div style="font-size:15px">CATCHES '+S.caught+' · TRIES LEFT '+S.tries+'</div>'};
 A.ACT.cam=()=>{man.position.set(C[0],G0,C[1]);man.rotation.set(0,Math.PI,0);armL.rotation.set(-1.6,0,-.3);cam.position.set(C[0]+.6,G0+1.7,C[1]+2.4);cam.lookAt(hawk.position.x*.4+C[0]*.6,G0+3,hawk.position.z*.4+(C[1]-6)*.6)}}

/* ------------------------------------------------------------------ outdoor prompts */
const NEAR=[[GATE[0]-3,GATE[1]+3,4,()=>night()?'GHOST TOUR WITH THE GUIDE (£8)':null,ghostTour],
 [TILT[0]-1.5,TILT[1]-36,5,()=>'JOUST · '+(reen()?(DC.joust>=3?'JOUSTING CHAMPION · RIDE AGAIN':'RANK: '+RANKS[DC.joust]+' · vs '+FOES[Math.min(2,DC.joust)].n):'WEEKENDS 10AM-5PM'),()=>{if(DC.joust>=3){DC.joust=2;joust();DC.joust=3}else joust()}],
 [RING[0],RING[1]+5,4,()=>'SWORD DUEL · '+(reen()?(DC.sword>=3?'MASTER OF THE SWORD':'vs '+DUEL[Math.min(2,DC.sword)].n):'WEEKENDS 10AM-5PM'),()=>{if(DC.sword>=3){DC.sword=2;sword();DC.sword=3}else sword()}],
 [BUTTS[0]+2,BUTTS[1],4,()=>'ARCHERY BUTTS (£3)'+(DC.archBest?' · BEST '+DC.archBest:''),archery],
 [TREB[0]+3,TREB[1]+3,5,()=>'TREBUCHET SIEGE DEMO'+(reen()?'':' · WEEKENDS'),trebuchet],
 [FAYRE[0],FAYRE[1]+1.6,2.2,()=>'MEAD STALL',mead],[FAYRE[0]+5,FAYRE[1]+1.6,2.2,()=>'FALCONRY DISPLAY'+(reen()?'':' · WEEKENDS'),falconry],
 [FAYRE[0]+10,FAYRE[1]+1.6,2.2,()=>'COSTUME HIRE (£10 FOR THE DAY)',costume],[FAYRE[0]+15,FAYRE[1]+1.6,2.2,()=>'THE ARMOURER',armourer],
 [CX+18,CZ+2,4,()=>'LOOK AROUND THE CHAPEL RUINS',()=>toast(pk(['A CARVED STONE: "PRAY FOR THE SOUL OF JOHN DE SOMERY, 1321"','THE EAST WINDOW FRAMES THE KEEP PERFECTLY','A ROBIN HAS NESTED IN THE OLD FONT']))]];
{const c0=ctx;ctx=function(){const r=c0();if(GS.inside||!GS.onFoot)return r;if(Math.abs(P.x-CX)>140||Math.abs(P.z-CZ)>140)return r;if(r&&r.label&&r.label!=='ENTER CAR'&&!r.far)return r;
 for(const[x,z,rad,lab,fn]of NEAR){if(Math.hypot(P.x-x,P.z-z)<rad){const l=lab();if(l)return{label:l,fn}}}return r}}
window.DUDLEY_API={joust,sword,archery,trebuchet,falconry,mead,costume,armourer,ghostTour,CX,CZ,TILT,BUTTS,TREB,RING,FAYRE,GATE,KEEPD,DUNGD,MX,MZ};
})();
