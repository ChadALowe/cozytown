/* ===== THE CASINO: a showpiece building out past the end of Back Lane (south-east corner of the map) =====
   Exterior: floodlit palace with gold domes, colonnaded portico, a chasing-bulb marquee, a giant spinning roulette
   wheel on the tower, neon trim, a dancing fountain, a palm avenue to the red carpet, lamp posts, a roadside pylon
   sign and (sunset / night) sweeping searchlights you can see from across the village.
   Interior: a big, empty, dressed-but-bare hall (red carpet, damask walls, gold trim, coffered ceiling) ready for games.
   Self-contained: relies on globals from app.js (scene, cam, Builder, pbox, pcyl, pcone, wmat, ptex, COL, OBS, BLD, SHOPD,
   HRS, CUSTB, SG, IROOM, IA, RX, RZ, GS, todI, updCozy, buildShop, shopLabel, shopOpen, leaveShop, toast, Y0 ...).
   The grounds (x 96..232, z 116..234) are kept clear of random trees by kartZone() in app.js. */
(function(){
const CX=170,ZF=186,Y=Y0,TAU=Math.PI*2;
const IRX=11,IRZ=8,IHT=5.6;                       // interior half-width, half-depth, wall height
const grp=new THREE.Group(),beams=new THREE.Group();scene.add(grp);scene.add(beams);

/* ---------- small helpers ---------- */
const mkCv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const ctex=(c,lin,rep)=>{const t=new THREE.CanvasTexture(c);t.magFilter=lin?THREE.LinearFilter:THREE.NearestFilter;t.minFilter=lin?THREE.LinearFilter:THREE.NearestMipmapNearestFilter;if(lin)t.generateMipmaps=false;if(rep)t.wrapS=t.wrapT=THREE.RepeatWrapping;return t};
const mkB=()=>new Builder(8);
const S=mkB(),GO=mkB(),GR=mkB(),NA=mkB(),NB=mkB(),LG=mkB(),STN=mkB();
const bx=(B,x,y,z,w,h,d,c)=>pbox(B,x,Y+y,z,w,h,d,c);
const cy=(B,x,y,z,r,h,n,c)=>pcyl(B,x,Y+y,z,r,h,n,c);
const co=(B,x,y,z,r,h,n,c)=>pcone(B,x,Y+y,z,r,h,n,c,0);
const C={cream:[.97,.93,.83],cream2:[.9,.84,.72],bur:[.56,.06,.13],dk:[.15,.13,.2],gold:[1,.78,.22],gold2:[.86,.62,.12],roof:[.32,.24,.28],marb:[.98,.96,.92],
 g1:[.1,.42,.15],g2:[.16,.52,.2],g3:[.07,.32,.12],trunk:[.5,.36,.22],trunk2:[.42,.3,.18],flower:[[.95,.2,.3],[1,.8,.2],[.95,.95,.95],[.9,.3,.7]],stone:[.7,.68,.64]};
function pdome(B,x,y,z,r,col,n,m){y+=Y;n=n||14;m=m||5;const R=[];for(let j=0;j<=m;j++){const ph=j/m*Math.PI/2,rr=Math.cos(ph)*r,yy=Math.sin(ph)*r*.95,ring=[];for(let i=0;i<n;i++){const a=i/n*TAU;ring.push([x+Math.cos(a)*rr,y+yy,z+Math.sin(a)*rr])}R.push(ring)}
 const cen=[x,y,z];for(let j=0;j<m;j++)for(let i=0;i<n;i++){const a=R[j][i],b=R[j][(i+1)%n],c=R[j+1][(i+1)%n],d=R[j+1][i];B.tri(a,b,c,col,null,null,false,cen);B.tri(a,c,d,col,null,null,false,cen)}}
const ringCol=(x,z,r,n,cr)=>{for(let i=0;i<n;i++){const a=i/n*TAU;COL.push([x+Math.cos(a)*r,z+Math.sin(a)*r,cr])}};
const rowCol=(x0,z0,x1,z1,gap,r)=>{const n=Math.max(1,Math.round(Math.hypot(x1-x0,z1-z0)/gap));for(let i=0;i<=n;i++)COL.push([x0+(x1-x0)*i/n,z0+(z1-z0)*i/n,r])};

/* ---------- materials ---------- */
const mS=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide}),mG=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});
const mLG=new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide});
const mGR=wmat([1,1,1]),mST=wmat([1,1,1]);                                                // foliage / stone: tinted with the village light
const mNA=new THREE.MeshBasicMaterial({color:0xff2d95,side:THREE.DoubleSide}),mNB=new THREE.MeshBasicMaterial({color:0x22d8ff,side:THREE.DoubleSide});
const mWin=new THREE.MeshBasicMaterial({side:THREE.DoubleSide,transparent:false}),mDoor=new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
const GP={vertexColors:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3,side:THREE.FrontSide};

/* ---------- ground: driveway, plaza, red carpet ---------- */
function gplane(w,d,x,z,dy,tex,po){const m=wmat(null,Object.assign({},GP,{polygonOffsetFactor:po||-3,polygonOffsetUnits:po||-3}),tex),p=new THREE.Mesh(new THREE.PlaneGeometry(w,d).rotateX(-Math.PI/2),m);p.position.set(x,Y+dy,z);grp.add(p);return p}
{ // driveway (continues Back Lane): pavement | asphalt with gold centre dashes | pavement
 const c=mkCv(106,340),g=c.getContext('2d');g.fillStyle='#b9b4a8';g.fillRect(0,0,106,340);g.fillStyle='#46464d';g.fillRect(18,0,70,340);g.fillStyle='#d9d5c8';g.fillRect(16,0,3,340);g.fillRect(87,0,3,340);
 g.fillStyle='#f0c038';for(let y=4;y<340;y+=26)g.fillRect(51,y,4,14);g.fillStyle='rgba(0,0,0,.08)';for(let i=0;i<260;i++)g.fillRect((i*37)%70+18,(i*53)%340,2,1);
 gplane(10.6,34,CX,133,.07,ctex(c,0,0),-3)}
{ // marble plaza
 const c=mkCv(64,64),g=c.getContext('2d');g.fillStyle='#efe3c8';g.fillRect(0,0,64,64);g.fillStyle='#d9b9a2';g.fillRect(0,0,32,32);g.fillRect(32,32,32,32);g.strokeStyle='#c9a98c';g.lineWidth=1;g.strokeRect(.5,.5,63,63);g.beginPath();g.moveTo(32,0);g.lineTo(32,64);g.moveTo(0,32);g.lineTo(64,32);g.stroke();
 g.fillStyle='#d6a932';g.fillRect(30,30,4,4);g.fillRect(0,0,2,2);g.fillRect(62,0,2,2);g.fillRect(0,62,2,2);g.fillRect(62,62,2,2);
 const t=ctex(c,0,1);t.repeat.set(72/4,36/4);gplane(72,36,CX,168,.08,t,-3)}
{ // red carpet to the door
 const c=mkCv(60,160),g=c.getContext('2d');g.fillStyle='#9c0f24';g.fillRect(0,0,60,160);g.fillStyle='#e8bf4a';g.fillRect(0,0,4,160);g.fillRect(56,0,4,160);g.fillStyle='#7a0a1a';g.fillRect(4,0,3,160);g.fillRect(53,0,3,160);
 g.fillStyle='#c8203a';for(let y=10;y<160;y+=30){g.beginPath();g.moveTo(30,y);g.lineTo(38,y+8);g.lineTo(30,y+16);g.lineTo(22,y+8);g.closePath();g.fill()}
 g.fillStyle='#f3d070';for(let y=10;y<160;y+=30)g.fillRect(29,y+7,2,2);
 gplane(6,16,CX,178,.1,ctex(c,0,0),-5)}
// brass studs along the carpet edges (tiny gold posts + red rope)
for(const sx of[-1,1])for(let z=172;z<=180;z+=4){bx(GO,CX+sx*3.55,0,z,.14,.9,.14,C.gold);bx(GO,CX+sx*3.55,.9,z,.3,.12,.3,C.gold);bx(S,CX+sx*3.55,.55,z+2,.06,.06,4,C.bur);COL.push([CX+sx*3.55,z,.2])}

/* ---------- main building ---------- */
// central block, wings, plinths, cornices
bx(S,CX,0,201,30,16,30,C.cream);bx(S,CX,0,201,30.6,1.2,30.6,C.bur);bx(S,CX,15.1,201,31.6,.9,31.6,C.cream2);bx(GO,CX,15.95,201,31.8,.18,31.8,C.gold);bx(S,CX,16,201,28,.5,28,C.roof);
for(const sx of[-1,1]){const wx=CX+sx*23;
 bx(S,wx,0,197,16,10,22,C.cream);bx(S,wx,0,197,16.6,1.2,22.6,C.bur);bx(S,wx,9.2,197,17.4,.8,23.4,C.cream2);bx(GO,wx,9.95,197,17.6,.16,23.6,C.gold);bx(S,wx,10,197,15,.5,21,C.roof);
 for(let i=0;i<=13;i++){const px=wx-7.2+i*(14.4/13);bx(S,px,10.5,186.7,.3,.9,.3,C.cream2)}for(let k=0;k<=15;k++){const pz=187+k*1.3,ox=wx+sx*7.4;bx(S,ox,10.5,pz,.3,.9,.3,C.cream2)}
 bx(GO,wx,11.35,186.7,15,.14,.22,C.gold);bx(GO,wx+sx*7.4,11.35,197,.22,.14,21,C.gold);
 // corner towers with gold domes (front and rear)
 for(const tz of[189.2,205.4]){const tx=CX+sx*28.8;cy(S,tx,0,tz,3.5,13,14,C.cream);cy(S,tx,0,tz,3.8,1.2,14,C.bur);cy(GO,tx,12.6,tz,3.9,.5,14,C.gold);cy(S,tx,13.1,tz,3.5,.8,14,C.cream2);pdome(GO,tx,13.9,tz,3.7,C.gold,14,5);cy(GO,tx,17.3,tz,.18,2.6,6,C.gold2);pdome(GO,tx,19.5,tz,.5,C.gold,8,3);
  ringCol(tx,tz,3.6,12,.9)}}
// central block corner turrets
for(const sx of[-1,1])for(const tz of[187,215]){const tx=CX+sx*14.4;cy(S,tx,0,tz,1.5,21,10,C.cream);cy(GO,tx,20.6,tz,1.8,.5,10,C.gold);co(GO,tx,21.1,tz,1.8,5.6,10,C.gold);cy(GO,tx,26.5,tz,.12,2,5,C.gold2);bx(NA,tx,6,tz-1.55,.12,12,.12,[1,1,1])}
// tower with the wheel + dome
bx(S,CX,16,198,12,16,12,C.cream);bx(S,CX,16,198,12.8,1,12.8,C.bur);bx(GO,CX,31.2,198,13.2,.7,13.2,C.gold);bx(S,CX,31.9,198,12,.5,12,C.cream2);
for(const sx of[-1,1])for(const sz of[-1,1])bx(GO,CX+sx*6.05,17,198+sz*6.05,.8,14,.8,C.gold2);
pdome(GO,CX,32.4,198,6.2,C.gold,18,6);cy(GO,CX,38.2,198,.9,1.2,8,C.gold2);co(GO,CX,39.4,198,.7,9,8,C.gold);pdome(GO,CX,48,198,.8,C.gold,8,3);
// portico: columns, entablature, gold trim, hanging globes
const COLX=[-14,-10,-6.4,6.4,10,14];
for(const o of COLX){const x=CX+o;cy(S,x,0,183.4,.8,10,12,C.marb);bx(S,x,0,183.4,2.1,.5,2.1,C.cream2);bx(GO,x,9.9,183.4,2.2,.6,2.2,C.gold);for(const yy of[1.4,8.6])cy(GO,x,yy,183.4,.88,.18,12,C.gold2);COL.push([x,183.4,.95])}
bx(S,CX,10.5,183.4,34,1.5,3.8,C.cream2);bx(GO,CX,12,183.4,34.2,.3,4,C.gold);bx(GO,CX,10.4,183.4,34.2,.18,4,C.gold);bx(NA,CX,10.3,181.45,33.6,.18,.18,[1,1,1]);
for(const o of[-12,-8,-3.2,0,3.2,8,12]){cy(LG,CX+o,8.6,182.4,.28,.9,8,[1,.92,.6]);bx(GO,CX+o,9.55,182.4,.12,.9,.12,C.gold2)}
// marquee board (animated texture) + frame + backing
bx(S,CX,12.3,183.75,24.8,7.4,.3,C.dk);bx(GO,CX,12.1,183.4,25.4,.5,.8,C.gold);bx(GO,CX,19.55,183.4,25.4,.5,.8,C.gold);for(const sx of[-1,1])bx(GO,CX+sx*12.5,12.1,183.4,.5,7.95,.8,C.gold);
for(const sx of[-1,1]){co(GO,CX+sx*12.5,20.05,183.4,.6,2.6,6,C.gold);bx(GO,CX+sx*8,19.95,183.4,.12,1.2,.12,C.gold2)}
// door: gold frame, lit glass doors, ornament
bx(GO,CX-3.15,0,185.7,.7,7.2,.8,C.gold);bx(GO,CX+3.15,0,185.7,.7,7.2,.8,C.gold);bx(GO,CX,6.9,185.7,7,.8,.9,C.gold);bx(GO,CX,7.7,185.6,2.6,1.4,.6,C.gold2);bx(NA,CX,7.2,185.1,5.6,.16,.16,[1,1,1]);
bx(GO,CX,0,184.6,7.4,.1,3,C.gold);
// wing + central front: burgundy awnings above ground-floor windows? (kept simple: banners)
for(const sx of[-1,1])for(const o of[-1,1]){const bxx=CX+sx*23+o*2.65;bx(S,bxx,2.8,185.9,.5,6,.12,C.bur);bx(GO,bxx,2.6,185.85,.7,.2,.14,C.gold);bx(GO,bxx,8.8,185.85,.7,.2,.14,C.gold)}
// neon trim: cornice lines + tower edges + wheel-tower pilasters
for(const sx of[-1,1]){bx(NB,CX+sx*23,9.05,185.85,16.4,.18,.18,[1,1,1]);bx(NB,CX+sx*23+sx*8.65,1.5,197,.18,.18,22,[1,1,1]);bx(NB,CX+sx*23+sx*8.6,9.05,197,.18,.18,22,[1,1,1])}
bx(NB,CX,15.9,185.85,30,.18,.18,[1,1,1]);
for(const sx of[-1,1])for(const sz of[-1,1])bx(NB,CX+sx*6.5,16,198+sz*6.5,.2,15,.2,[1,1,1]);
for(const yy of[19.5,27.5])bx(NA,CX,yy,191.85,13,.2,.2,[1,1,1]);

/* ---------- windows (one merged mesh) ---------- */
const WQ={p:[],u:[]};
function wquad(a,b,c,d){const P=[a,b,c,a,c,d],U=[[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]];for(let i=0;i<6;i++){WQ.p.push(P[i][0],P[i][1],P[i][2]);WQ.u.push(U[i][0],U[i][1])}}
function winZ(xc,yb,z,w,h,f){f=f||1;wquad([xc-w/2,Y+yb,z],[xc+w/2,Y+yb,z],[xc+w/2,Y+yb+h,z],[xc-w/2,Y+yb+h,z]);bx(GO,xc,yb-.25,z-.08*f,w+.6,.25,.4,C.gold);bx(GO,xc,yb+h,z-.08*f,w+.6,.3,.4,C.gold);for(const s of[-1,1])bx(S,xc+s*(w/2+.15),yb,z-.05*f,.3,h,.3,C.bur)}
function winX(x,zc,yb,w,h,dir){wquad([x,Y+yb,zc-w/2],[x,Y+yb,zc+w/2],[x,Y+yb+h,zc+w/2],[x,Y+yb+h,zc-w/2]);bx(GO,x+dir*.08,yb-.25,zc,.4,.25,w+.6,C.gold);bx(GO,x+dir*.08,yb+h,zc,.4,.3,w+.6,C.gold)}
for(const sx of[-1,1]){const wx=CX+sx*23;for(const o of[-5.3,0,5.3]){winZ(wx+o,1.4,ZF-.03,2.4,3.6);winZ(wx+o,5.8,ZF-.03,2.4,3)}}
for(const o of[-12.2,-8.2,8.2,12.2]){winZ(CX+o,1.4,ZF-.03,2.6,4.4);winZ(CX+o,6.6,ZF-.03,2.6,3.3)}
for(const o of[-12,-8,-4,0,4,8,12]){winZ(CX+o,1.4,216.03,2.4,4.4,-1);winZ(CX+o,6.6,216.03,2.4,3.3,-1)}
for(const sx of[-1,1])for(const o of[17.5,21.5])winZ(CX+sx*o,1.4,208.03,2.4,3.6,-1),winZ(CX+sx*o,5.8,208.03,2.4,3,-1);
for(const sx of[-1,1]){const ox=CX+sx*31;for(const z of[191,195.5,200,204.5]){winX(ox+sx*.03,z,1.4,2.4,3.6,sx);winX(ox+sx*.03,z,5.8,2.4,3,sx)}
 const cx2=CX+sx*15;for(const z of[190,195,200,205,210.5,214])winX(cx2+sx*.03,z,11,2.2,3.4,sx);for(const z of[211,214.5])for(const yy of[1.4,6.4])winX(cx2+sx*.03,z,yy,2.2,3.6,sx)}
{const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(WQ.p,3));wg.setAttribute('uv',new THREE.Float32BufferAttribute(WQ.u,2));
 const c=mkCv(32,64),g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,32,64);g.fillStyle='#7a7a86';g.fillRect(0,0,32,2);g.fillRect(0,62,32,2);g.fillRect(0,0,2,64);g.fillRect(30,0,2,64);g.fillRect(15,0,2,64);g.fillRect(0,30,32,2);g.fillStyle='rgba(0,0,0,.18)';g.fillRect(2,2,13,12);g.fillRect(17,34,13,12);
 mWin.map=ctex(c,0,0);grp.add(new THREE.Mesh(wg,mWin))}
{const c=mkCv(64,128),g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,64,128);g.fillStyle='#8a7330';g.fillRect(0,0,64,4);g.fillRect(0,0,4,128);g.fillRect(60,0,4,128);g.fillRect(30,0,4,128);g.fillRect(0,124,64,4);g.fillRect(0,50,64,3);
 g.fillStyle='#f6d36a';g.fillRect(24,66,3,18);g.fillRect(37,66,3,18);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(4,4,26,44);g.fillRect(34,4,26,44);
 mDoor.map=ctex(c,0,0);const d=new THREE.Mesh(new THREE.PlaneGeometry(5.6,6.7),mDoor);d.position.set(CX,Y+3.45,ZF-.05);d.rotation.y=Math.PI;grp.add(d)}

/* ---------- animated marquee + roadside pylon sign ---------- */
function bulbPath(W,H,ins,gap){const P=[];const x0=ins,y0=ins,x1=W-ins,y1=H-ins;for(let x=x0;x<=x1;x+=gap)P.push([x,y0]);for(let y=y0+gap;y<=y1;y+=gap)P.push([x1,y]);for(let x=x1-gap;x>=x0;x-=gap)P.push([x,y1]);for(let y=y1-gap;y>y0;y-=gap)P.push([x0,y]);return P}
const MW=1024,MH=300,MP=bulbPath(MW,MH,16,32),mc=mkCv(MW,MH),mg=mc.getContext('2d'),mTex=ctex(mc,1,0);
const NEON=['#ff3fa4','#ffd24a','#35e0ff'];
function drawMarq(step){const g=mg,W=MW,H=MH;let gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#33060f');gr.addColorStop(.5,'#1a0309');gr.addColorStop(1,'#33060f');g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.strokeStyle='#e8bf4a';g.lineWidth=5;g.strokeRect(34,34,W-68,H-68);g.strokeStyle='#8a6a1e';g.lineWidth=2;g.strokeRect(42,42,W-84,H-84);
 for(let i=0;i<MP.length;i++){const on=((i+step)%3)===0,p=MP[i];if(on){g.fillStyle='rgba(255,230,140,.35)';g.beginPath();g.arc(p[0],p[1],11,0,TAU);g.fill()}g.fillStyle=on?'#fff6c0':'#a7782a';g.beginPath();g.arc(p[0],p[1],on?6:5,0,TAU);g.fill()}
 const word='CASINO';g.font='900 168px Impact,"Arial Black",Arial,sans-serif';g.textAlign='left';g.textBaseline='middle';let ws=word.split('').map(ch=>g.measureText(ch).width),tot=ws.reduce((a,b)=>a+b,0)+14*(word.length-1),x=(W-tot)/2;
 for(let i=0;i<word.length;i++){const col=NEON[(i+(step>>1))%3];g.shadowColor=col;g.shadowBlur=26;g.fillStyle=col;g.fillText(word[i],x,146);g.shadowBlur=0;g.fillStyle='rgba(255,255,255,.75)';g.fillText(word[i],x+1,143);x+=ws[i]+14}
 g.shadowBlur=0;g.font='bold 30px Georgia,serif';g.textAlign='center';g.fillStyle='#ffe9a8';g.fillText('★  GOLDEN CLOVER  ★  OPEN 24 HOURS  ★',W/2,245);
 g.font='bold 76px "DejaVu Sans",Arial,sans-serif';g.textAlign='center';const sy=[['♠','#111'],['♥','#e02030'],['♦','#e02030'],['♣','#111']];
 g.fillStyle='#f6ecd0';for(const[sx,k]of[[100,0],[W-100,1]]){g.beginPath();g.arc(sx,150,44,0,TAU);g.fill();g.fillStyle=sy[k][1];g.fillText(sy[k][0],sx,154);g.fillStyle='#f6ecd0'}
 mTex.needsUpdate=true}
const PW_=256,PH_=192,pc=mkCv(PW_,PH_),pg=pc.getContext('2d'),pTex=ctex(pc,1,0),PP=bulbPath(PW_,PH_,10,20);
function drawPylon(step){const g=pg;g.fillStyle='#220610';g.fillRect(0,0,PW_,PH_);g.strokeStyle='#e8bf4a';g.lineWidth=4;g.strokeRect(22,22,PW_-44,PH_-44);
 for(let i=0;i<PP.length;i++){const on=((i+step)%3)===0;g.fillStyle=on?'#fff6c0':'#a7782a';g.beginPath();g.arc(PP[i][0],PP[i][1],on?4.5:3.5,0,TAU);g.fill()}
 g.font='900 54px Impact,"Arial Black",Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';const col=NEON[(step>>1)%3];g.shadowColor=col;g.shadowBlur=14;g.fillStyle=col;g.fillText('CASINO',PW_/2,78);g.shadowBlur=0;
 g.font='bold 15px Georgia,serif';g.fillStyle='#ffe9a8';g.fillText('OPEN 24 HOURS',PW_/2,118);g.fillStyle=step%4<2?'#ffd24a':'#7a5a18';g.font='bold 30px "DejaVu Sans",Arial,sans-serif';g.fillText('▼  ▼  ▼',PW_/2,150);pTex.needsUpdate=true}
drawMarq(0);drawPylon(0);
{const m=new THREE.Mesh(new THREE.PlaneGeometry(24.2,7.06),new THREE.MeshBasicMaterial({map:mTex,side:THREE.DoubleSide}));m.position.set(CX,Y+15.9,183.56);m.rotation.y=Math.PI;grp.add(m)}
{const px=CX-12,pz=127; // pylon: two posts, board facing north, bulbs
 bx(S,px-3.2,0,pz,.5,16,.5,C.dk);bx(S,px+3.2,0,pz,.5,16,.5,C.dk);bx(S,px,9.2,pz,8.6,6.4,.5,C.dk);bx(GO,px,8.9,pz-.15,9,.4,.7,C.gold);bx(GO,px,15.3,pz-.15,9,.4,.7,C.gold);for(const s of[-1,1])bx(GO,px+s*4.4,8.9,pz-.15,.4,6.8,.7,C.gold);
 const m=new THREE.Mesh(new THREE.PlaneGeometry(8,6),new THREE.MeshBasicMaterial({map:pTex,side:THREE.DoubleSide}));m.position.set(px,Y+12.2,pz-.3);m.rotation.y=Math.PI;grp.add(m);COL.push([px-3.2,pz,.6],[px+3.2,pz,.6]);
 for(const s of[-1,1]){cy(LG,px+s*3.2,16,pz,.35,.5,8,[1,.9,.5])}}
// driveway gateposts
for(const sx of[-1,1]){const gx=CX+sx*6.4;bx(S,gx,0,134,1.1,4.2,1.1,C.cream);bx(GO,gx,4.2,134,1.4,.4,1.4,C.gold);pdome(GO,gx,4.6,134,.7,C.gold,8,3);bx(S,gx,0,134,1.4,.7,1.4,C.bur);COL.push([gx,134,.9])}

/* ---------- fountain ---------- */
const FX=CX,FZ=160;
cy(STN,FX,0,FZ,8.1,.6,32,C.marb);cy(GO,FX,.6,FZ,8.15,.1,32,C.gold);cy(STN,FX,0,FZ,2.6,1.1,16,C.marb);cy(GO,FX,1.1,FZ,2.65,.12,16,C.gold);cy(STN,FX,0,FZ,.7,3.4,10,C.marb);cy(STN,FX,3.4,FZ,1.8,.5,14,C.marb);cy(GO,FX,3.9,FZ,1.85,.1,14,C.gold);cy(STN,FX,0,FZ,.4,5.2,8,C.marb);pdome(GO,FX,5.1,FZ,.7,C.gold,8,3);
COL.push([FX,FZ,8.4]);
{const wm=wmat([.34,.64,.86],{vertexColors:false,transparent:true,opacity:.92,side:THREE.FrontSide});const w=new THREE.Mesh(new THREE.CircleGeometry(7.6,32).rotateX(-Math.PI/2),wm);w.position.set(FX,Y+.52,FZ);grp.add(w)}
const SPN=184,spPos=new Float32Array(SPN*3),spGeo=new THREE.BufferGeometry();spGeo.setAttribute('position',new THREE.BufferAttribute(spPos,3));
const spray=new THREE.Points(spGeo,new THREE.PointsMaterial({size:3,sizeAttenuation:false,color:0xcdeaff,transparent:true,opacity:.9}));spray.frustumCulled=false;grp.add(spray);
const SPJ=[];for(let i=0;i<20;i++)SPJ.push({t:0,a:0,r0:.25,y0:5.4,vr:.25,vy:9.5,T:2.34,o:i/20});
for(let j=0;j<10;j++)for(let i=0;i<10;i++)SPJ.push({t:1,a:j/10*TAU+.15,r0:3,y0:1.2,vr:3.05,vy:5.5,T:1.2,o:i/10});
for(let j=0;j<8;j++)for(let i=0;i<8;i++)SPJ.push({t:2,a:j/8*TAU,r0:1.2,y0:3.9,vr:1.6,vy:3,T:1.1,o:i/8});
function updSpray(tm){for(let i=0;i<SPN;i++){const j=SPJ[i],tau=((tm/j.T*.9+j.o)%1)*j.T,r=j.r0+j.vr*tau,y=j.y0+j.vy*tau-4.9*tau*tau;spPos[i*3]=FX+Math.cos(j.a)*r;spPos[i*3+1]=Y+Math.max(.6,y);spPos[i*3+2]=FZ+Math.sin(j.a)*r}spGeo.attributes.position.needsUpdate=true}
updSpray(0);

/* ---------- palms, hedges, topiary, flowers, lamps ---------- */
let pseed=7;const prnd=()=>{pseed=(pseed*16807)%2147483647;return(pseed-1)/2147483646};
const BP=[],BC=[],BK=[],BD=[];
function strand(x0,y0,z0,x1,y1,z1,gap,col,dir){const L=Math.hypot(x1-x0,y1-y0,z1-z0),n=Math.max(2,Math.round(L/gap));for(let i=0;i<=n;i++){const t=i/n;BP.push(x0+(x1-x0)*t,Y+y0+(y1-y0)*t,z0+(z1-z0)*t);BC.push(col[0],col[1],col[2]);BK.push(i);BD.push(dir)}}
function palm(x,z,s,lean){let px=x,py=0;const segs=6;for(let i=0;i<segs;i++){const r0=.38*s*(1-i*.07),h=1.15*s;cy(GR,px,py,z,r0,h,7,i%2?C.trunk:C.trunk2);py+=h;px+=lean*.18}
 const top=py;for(let k=0;k<9;k++){const a=k/9*TAU+prnd()*.4,dx=Math.cos(a),dz=Math.sin(a),L=(3.3+prnd()*.9)*s,w=.75*s,base=[px,Y+top,z],mid=[px+dx*L*.5,Y+top+.9*s,z+dz*L*.5],tip=[px+dx*L,Y+top-.9*s,z+dz*L],sd=[-dz*w,0,dx*w],col=prnd()<.5?C.g1:C.g2;
  GR.tri(base,[mid[0]+sd[0],mid[1],mid[2]+sd[2]],tip,col,null,null,true);GR.tri(base,[mid[0]-sd[0],mid[1],mid[2]-sd[2]],tip,col,null,null,true)}
 for(let k=0;k<3;k++)pbox(GR,px+(k-1)*.3*s,Y+top-.5,z+(k%2)*.3,.3*s,.3*s,.3*s,[.4,.25,.1],0);
 COL.push([x,z,.5]);for(let k=0;k<7;k++){const a=k*1.1+x,r=.5*s;BP.push(x+Math.cos(a)*r+lean*.18*k*.15,Y+.9+k*.85*s*.9,z+Math.sin(a)*r);BC.push(1,.82,.4);BK.push(k);BD.push(1)}}
for(const sx of[-1,1])for(let i=0;i<3;i++)palm(CX+sx*6.8,172+i*4,1.05+(i%3)*.08,sx*(i%2?.6:-.3));
for(const[x,z]of[[CX-32,178],[CX+32,178],[CX-30,158],[CX+30,158],[CX-27,152],[CX+27,152],[CX-17,172],[CX+17,172],[CX-14,134],[CX+14,134],[CX-14,146],[CX+14,146]])palm(x,z,1.15,x<CX?.5:-.5);
// hedges + topiary + flower beds either side of the portico, and along the plaza edge
function hedge(x,z,w,d,fl){bx(GR,x,0,z,w,.9,d,C.g3);bx(GR,x,.9,z,w-.2,.12,d-.2,C.g1);if(!fl)return;const n=Math.max(2,Math.round(w/1.4));for(let i=0;i<n;i++){const fx=x-w/2+.6+i*(w-1.2)/(n-1);bx(GR,fx,1,z-d/2+.1,.28,.28,.28,C.flower[(i+Math.floor(x))%4])}}
hedge(CX-23,184.2,16,1.4,1);hedge(CX+23,184.2,16,1.4,1);
for(let i=0;i<=5;i++)COL.push([CX-30.5+i*3,184.2,.9],[CX+15.5+i*3,184.2,.9]);
for(const sx of[-1,1])for(const o of[19,23.5,28]){const tx=CX+sx*o;cy(GR,tx,0,182.2,.35,.7,8,C.trunk);cy(GR,tx,.7,182.2,.85,1.1,10,C.g2);pdome(GR,tx,1.8,182.2,.85,C.g1,10,4);COL.push([tx,182.2,.9])}
for(const sx of[-1,1]){hedge(CX+sx*35,168,1.4,30,0);for(let z=153;z<=183;z+=3)COL.push([CX+sx*35,z,.9])}
// lamp posts
function lamp(x,z,h){cy(S,x,0,z,.14,h,6,C.dk);bx(S,x,0,z,.6,.4,.6,C.dk);bx(S,x,h-.1,z,1.4,.12,.12,C.dk);for(const s of[-1,1]){cy(LG,x+s*.7,h-.5,z,.3,.5,8,[1,.9,.55]);LG.tri([x+s*.7-.35,Y+h,z],[x+s*.7+.35,Y+h,z],[x+s*.7,Y+h+.4,z],[1,.9,.55],null,null,true)}COL.push([x,z,.3])}
for(const sx of[-1,1]){for(const z of[121,129,141,148])lamp(CX+sx*5.8,z,6);for(const z of[156,168,180])lamp(CX+sx*38,z,7)}
for(const sx of[-1,1])lamp(CX+sx*13.5,151,7);
// bulb strands: portico top, wing cornices, tower edges, turrets, fountain rim, gateposts
strand(CX-16.5,12.4,181.5,CX+16.5,12.4,181.5,.9,[1,.9,.5],1);strand(CX-16.5,10.8,181.4,CX+16.5,10.8,181.4,1.1,[1,.45,.7],-1);
for(const sx of[-1,1]){strand(CX+sx*23-8,9.5,185.6,CX+sx*23+8,9.5,185.6,1,[1,.9,.5],sx);strand(CX+sx*31.1,9.5,186,CX+sx*31.1,9.5,208,1.2,[1,.9,.5],-sx)}
for(const sx of[-1,1])for(const sz of[-1,1])strand(CX+sx*6.1,16,198+sz*6.1,CX+sx*6.1,31,198+sz*6.1,1.1,[1,.9,.5],1);
for(const sx of[-1,1])for(const tz of[187,215])strand(CX+sx*14.4,3,tz,CX+sx*14.4,21,tz,1.6,[.5,.9,1],-1);
for(let i=0;i<30;i++){const a=i/30*TAU;BP.push(FX+Math.cos(a)*8.2,Y+.75,FZ+Math.sin(a)*8.2);BC.push(.4,.9,1);BK.push(i);BD.push(1)}
strand(CX-5.5,6.5,185.2,CX+5.5,6.5,185.2,.8,[1,.9,.5],1);strand(CX-3.1,.3,185.2,CX-3.1,6.5,185.2,.8,[1,.9,.5],-1);strand(CX+3.1,.3,185.2,CX+3.1,6.5,185.2,.8,[1,.9,.5],1);
const bGeo=new THREE.BufferGeometry(),bCol=new Float32Array(BC.length);bGeo.setAttribute('position',new THREE.Float32BufferAttribute(BP,3));bGeo.setAttribute('color',new THREE.BufferAttribute(bCol,3));
const bulbs=new THREE.Points(bGeo,new THREE.PointsMaterial({size:4,sizeAttenuation:false,vertexColors:true}));bulbs.frustumCulled=false;grp.add(bulbs);
function updBulbs(step){for(let i=0;i<BK.length;i++){const on=(((BK[i]+step*BD[i])%4)+4)%4<2,f=on?1:.2;bCol[i*3]=BC[i*3]*f;bCol[i*3+1]=BC[i*3+1]*f;bCol[i*3+2]=BC[i*3+2]*f}bGeo.attributes.color.needsUpdate=true}
updBulbs(0);

/* ---------- the roulette wheel on the tower ---------- */
const WR=5,WZ=191.55,WY=Y+24;
const wheelTex=(()=>{const c=mkCv(512,512),g=c.getContext('2d');g.translate(256,256);g.fillStyle='#2a1a0a';g.beginPath();g.arc(0,0,256,0,TAU);g.fill();
 const N=37;for(let i=0;i<N;i++){const a0=i/N*TAU-Math.PI/2,a1=(i+1)/N*TAU-Math.PI/2;g.fillStyle=i===0?'#0e8a3a':i%2?'#c01428':'#14141a';g.beginPath();g.moveTo(0,0);g.arc(0,0,236,a0,a1);g.closePath();g.fill();g.strokeStyle='#e8c050';g.lineWidth=2;g.beginPath();g.moveTo(Math.cos(a0)*172,Math.sin(a0)*172);g.lineTo(Math.cos(a0)*236,Math.sin(a0)*236);g.stroke()}
 g.fillStyle='#3a2410';g.beginPath();g.arc(0,0,172,0,TAU);g.fill();g.fillStyle='#4a2e16';g.beginPath();g.arc(0,0,150,0,TAU);g.fill();
 g.fillStyle='#fff';g.font='bold 15px monospace';g.textAlign='center';g.textBaseline='middle';const NUM=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];
 for(let i=0;i<N;i++){const a=(i+.5)/N*TAU-Math.PI/2;g.save();g.translate(Math.cos(a)*205,Math.sin(a)*205);g.rotate(a+Math.PI/2);g.fillText(String(NUM[i]),0,0);g.restore()}
 for(let r=140;r>30;r-=22){g.fillStyle=r%44?'#e8c050':'#b8892a';g.beginPath();g.arc(0,0,r,0,TAU);g.fill()}
 g.fillStyle='#8a5a14';g.beginPath();g.arc(0,0,34,0,TAU);g.fill();g.strokeStyle='#f6d878';g.lineWidth=7;for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*148,Math.sin(a)*148);g.stroke()}
 g.fillStyle='#f6d878';g.beginPath();g.arc(0,0,22,0,TAU);g.fill();g.strokeStyle='#e8c050';g.lineWidth=14;g.beginPath();g.arc(0,0,248,0,TAU);g.stroke();return ctex(c,1,0)})();
const wheel=new THREE.Mesh(new THREE.CircleGeometry(WR,48),new THREE.MeshBasicMaterial({map:wheelTex,side:THREE.DoubleSide}));wheel.position.set(CX,WY,WZ);wheel.rotation.y=Math.PI;grp.add(wheel);
const wback=new THREE.Mesh(new THREE.CircleGeometry(WR+.7,40),new THREE.MeshBasicMaterial({color:0x1a0a10,side:THREE.DoubleSide}));wback.position.set(CX,WY,WZ+.15);grp.add(wback);
const wrim=new THREE.Mesh(new THREE.TorusGeometry(WR+.55,.32,6,48),new THREE.MeshBasicMaterial({color:0xf0c030}));wrim.position.set(CX,WY,WZ-.1);grp.add(wrim);
const ball=new THREE.Mesh(new THREE.SphereGeometry(.28,8,6),new THREE.MeshBasicMaterial({color:0xffffff}));ball.position.set(CX,WY,WZ-.25);grp.add(ball);

/* ---------- assemble static meshes ---------- */
for(const[B,m]of[[S,mS],[GO,mG],[GR,mGR],[NA,mNA],[NB,mNB],[LG,mLG],[STN,mST]])if(B.p.length)grp.add(B.mesh(m));

/* ---------- searchlights (sunset + night) ---------- */
const bGeoC=new THREE.CylinderGeometry(3.4,.2,130,12,1,true);bGeoC.translate(0,65,0);
const BM=[];for(const[x,z,ph,sp,tilt]of[[CX-22,189,0,.5,.5],[CX+22,189,2,-.42,.55],[CX-22,205,4,.38,.48],[CX+22,205,1,-.55,.52],[CX,198,3,.3,.34]]){const piv=new THREE.Group();piv.position.set(x,Y+(z===198?32:10.4),z);const m=new THREE.Mesh(bGeoC,new THREE.MeshBasicMaterial({color:z===198?0xffe9b0:0xbfe0ff,transparent:true,opacity:.2,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,side:THREE.DoubleSide}));m.rotation.z=tilt;piv.add(m);piv.userData={ph,sp};beams.add(piv);BM.push(piv)}
beams.visible=false;

/* ---------- colliders, minimap, door ---------- */
perimCol(CX,201,0,15,15,.5,1.2);for(const sx of[-1,1])perimCol(CX+sx*23,197,0,8,11,.5,1.2);
OBS.push({x:CX,z:201,c:1,s:0,hw:15,hd:15},{x:CX-23,z:197,c:1,s:0,hw:8,hd:11},{x:CX+23,z:197,c:1,s:0,hw:8,hd:11});
BLD.push({x:CX,z:201,rot:0,w:30,d:30,k:'casino',n:1},{x:CX-23,z:197,rot:0,w:16,d:22,k:'casino',n:1},{x:CX+23,z:197,rot:0,w:16,d:22,k:'casino',n:1});
const DOOR={x:CX,z:184.4,psi:Math.PI,t:'CASINO',bg:'#3a0610',fg:'#ffd24a',casino:1,rx:IRX,rz:IRZ,sz:IRZ-2.2};
SHOPD.push(DOOR);Object.assign(HRS,{CASINO:[0,24]});
{const sl0=shopLabel;shopLabel=function(o){return o&&o.casino&&shopOpen(o).open?'ENTER CASINO':sl0(o)}}

/* ---------- time-of-day, animation ---------- */
const TC=[{s:[1,1,1],g:[1,1,1],win:[.5,.68,.92],door:[.4,.5,.65],lg:[1,1,1]},{s:[1,.84,.72],g:[1.05,.92,.72],win:[1,.78,.45],door:[1,.8,.5],lg:[1,1,1]},{s:[.78,.74,.95],g:[1.08,.96,.72],win:[1,.86,.48],door:[1,.88,.52],lg:[1,1,1]}];
let curT=-1,tick=0,step=0,tm=0,vis=true;
function setTod(i){curT=i;const t=TC[i]||TC[0];mS.color.setRGB(...t.s);mG.color.setRGB(...t.g);mLG.color.setRGB(...t.lg);mWin.color.setRGB(...t.win);mDoor.color.setRGB(...t.door)}
setTod(0);
{const u0=updCozy;updCozy=function(dt){u0(dt);
 const d=Math.hypot(cam.position.x-CX,cam.position.z-200),inside=!!GS.inside;
 if(todI!==curT)setTod(todI);
 const night=todI>0&&!inside;if(beams.visible!==night)beams.visible=night;
 const show=!inside&&d<scene.fog.far+140;if(grp.visible!==show)grp.visible=show;
 if(night)for(const p of BM){const u=p.userData;p.rotation.y=u.ph+performance.now()*.001*u.sp}
 if(!show||d>200)return;
 tm+=dt;wheel.rotation.z+=dt*.28;const ba=-tm*1.7;ball.position.set(CX+Math.cos(ba)*(WR-.45),WY+Math.sin(ba)*(WR-.45),WZ-.28);updSpray(tm);
 tick+=dt;if(tick>.15){tick=0;step++;updBulbs(step);if(d<150){drawMarq(step);if(!(step&1))drawPylon(step>>1)}}}}
/* ---------- interior (lazy: built the first time you walk in) ---------- */
let intG=null;
function buildInterior(){const G=new THREE.Group(),H=IHT,RX_=IRX,RZ_=IRZ;
 const bxI=(x,y,z,w,h,d,hex)=>{const g=new THREE.BoxGeometry(w,h,d),col=new Float32Array(g.attributes.position.count*3),F=[.82,.7,1,.45,.9,.74];for(let f=0;f<6;f++)for(let v=0;v<4;v++){const i=(f*4+v)*3;col[i]=col[i+1]=col[i+2]=F[f]}g.setAttribute('color',new THREE.BufferAttribute(col,3));const m=new THREE.Mesh(g,fmc(hex));m.position.set(x,y+h/2,z);G.add(m);return m};
 const plI=(w,h,x,y,z,ry,mat)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.y=ry;G.add(m);return m};
 const rep=(t,rx,ry)=>{t.repeat.set(rx,ry);return t};
 const carpet=ptex(64,64,c=>{c.fillStyle='#6e0d1a';c.fillRect(0,0,64,64);c.strokeStyle='#c99a2e';c.lineWidth=2;c.beginPath();c.moveTo(32,3);c.lineTo(61,32);c.lineTo(32,61);c.lineTo(3,32);c.closePath();c.stroke();c.fillStyle='#e8c25a';c.fillRect(30,30,4,4);c.fillStyle='#8c1626';for(const[x,y]of[[0,0],[64,0],[0,64],[64,64]]){c.beginPath();c.moveTo(x,y-10);c.lineTo(x+10,y);c.lineTo(x,y+10);c.lineTo(x-10,y);c.closePath();c.fill()}c.fillStyle='#4e0812';for(let k=0;k<24;k++)c.fillRect((k*13)%64,(k*29)%64,2,1)});
 plI(2*RX_,2*RZ_,0,0,0,0,new THREE.MeshBasicMaterial({map:rep(carpet,RX_,RZ_),fog:false})).rotation.set(-Math.PI/2,0,0);
 const wallT=()=>ptex(32,32,c=>{c.fillStyle='#4a0a16';c.fillRect(0,0,32,32);c.fillStyle='#5c1220';for(let x=0;x<32;x+=16)c.fillRect(x,0,8,32);c.fillStyle='#b8892a';c.fillRect(0,0,1,32);c.fillStyle='#8a5a18';c.beginPath();c.moveTo(8,10);c.lineTo(12,16);c.lineTo(8,22);c.lineTo(4,16);c.closePath();c.fill();c.beginPath();c.moveTo(24,0);c.lineTo(28,6);c.lineTo(24,12);c.lineTo(20,6);c.closePath();c.fill();c.beginPath();c.moveTo(24,20);c.lineTo(28,26);c.lineTo(24,32);c.lineTo(20,26);c.closePath();c.fill()});
 const wm=(len)=>new THREE.MeshBasicMaterial({map:rep(wallT(),len/2,H/2),fog:false});
 plI(2*RX_,H,0,H/2,-RZ_,0,wm(2*RX_));plI(2*RX_,H,0,H/2,RZ_,Math.PI,wm(2*RX_));plI(2*RZ_,H,RX_,H/2,0,-Math.PI/2,wm(2*RZ_));plI(2*RZ_,H,-RX_,H/2,0,Math.PI/2,wm(2*RZ_));
 const ceil=ptex(64,64,c=>{c.fillStyle='#1a0f24';c.fillRect(0,0,64,64);c.strokeStyle='#c99a2e';c.lineWidth=2;c.strokeRect(2,2,60,60);c.strokeStyle='#8a5a18';c.strokeRect(7,7,50,50);c.fillStyle='#ffe9b0';c.fillRect(20,20,24,24);c.fillStyle='#fff6d8';c.fillRect(24,24,16,16);c.fillStyle='#b8892a';c.fillRect(31,0,2,6);c.fillRect(31,58,2,6);c.fillRect(0,31,6,2);c.fillRect(58,31,6,2)});
 plI(2*RX_,2*RZ_,0,H,0,0,new THREE.MeshBasicMaterial({map:rep(ceil,RX_,RZ_),fog:false})).rotation.set(Math.PI/2,0,0);
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0d0f18,side:THREE.BackSide,fog:false}));vd.position.y=H/2;G.add(vd);
 // wall dressing: dark marble dado, gold rails, crown + skirting, pilasters, sconces
 const rail=(y,h,t,hex)=>{for(const sz of[-1,1])bxI(0,y,sz*(RZ_-t/2),2*RX_,h,t,hex);for(const sx of[-1,1])bxI(sx*(RX_-t/2),y,0,t,h,2*RZ_,hex)};
 rail(0,1.25,.14,0x1a0a10);rail(0,.25,.2,0x0a0406);rail(1.25,.14,.22,0xe8bf4a);rail(H-.35,.35,.26,0xe8bf4a);rail(H-.55,.2,.18,0xb8892a);
 for(const x of[-8,-4,0,4,8])bxI(x,0,-RZ_+.2,.7,H-.35,.3,0xb8892a);for(const x of[-8,-4.5,4.5,8])bxI(x,0,RZ_-.2,.7,H-.35,.3,0xb8892a);
 for(let z=-RZ_+4;z<RZ_-1;z+=4){for(const sx of[-1,1])bxI(sx*(RX_-.2),0,z,.3,H-.35,.7,0xb8892a)}
 const spots=[];for(let x=-8;x<=8;x+=5.5)spots.push([x,-RZ_+.45,0]);for(const z of[-5.5,-3.4,2.5,5.5])spots.push([-RX_+.45,z,1],[RX_-.45,z,1]);for(const x of[-8,8])spots.push([x,RZ_-.45,0]);
 for(const[x,z]of spots){bxI(x,2.2,z,.3,.5,.3,0xe8bf4a);bxI(x,2.7,z,.22,.5,.22,0xfff0b0);bxI(x,3.2,z,.36,.12,.36,0xe8bf4a)}
 // grand double doors (the exit) on the south wall
 const doorT=ptex(32,64,c=>{c.fillStyle='#3a0a14';c.fillRect(0,0,32,64);c.fillStyle='#e8bf4a';c.fillRect(0,0,32,2);c.fillRect(0,0,2,64);c.fillRect(30,0,2,64);c.fillRect(15,0,2,64);c.fillStyle='#ffe9b0';c.fillRect(3,3,11,26);c.fillRect(18,3,11,26);c.fillStyle='#c8a050';c.fillRect(3,15,11,1);c.fillRect(18,15,11,1);c.fillStyle='#6a1420';c.fillRect(3,34,11,26);c.fillRect(18,34,11,26);c.fillStyle='#e8bf4a';c.fillRect(12,36,2,10);c.fillRect(18,36,2,10)},false);
 plI(3.4,3.2,0,1.6,RZ_-.04,Math.PI,new THREE.MeshBasicMaterial({map:doorT,fog:false}));bxI(-1.8,0,RZ_-.12,.3,3.5,.3,0xe8bf4a);bxI(1.8,0,RZ_-.12,.3,3.5,.3,0xe8bf4a);bxI(0,3.2,RZ_-.12,3.9,.3,.3,0xe8bf4a);
 // floor emblem + runner from the door
 const emb=mkCv(256,256),g=emb.getContext('2d');g.translate(128,128);g.fillStyle='#2a0610';g.beginPath();g.arc(0,0,126,0,TAU);g.fill();g.strokeStyle='#e8bf4a';g.lineWidth=8;g.beginPath();g.arc(0,0,120,0,TAU);g.stroke();g.lineWidth=3;g.beginPath();g.arc(0,0,100,0,TAU);g.stroke();
 g.font='bold 56px "DejaVu Sans",Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#e8bf4a';g.fillText('♠',0,-68);g.fillText('♥',68,0);g.fillText('♦',0,68);g.fillText('♣',-68,0);g.font='900 40px Impact,"Arial Black",Arial,sans-serif';g.fillText('777',0,2);
 const eg=plI(6.4,6.4,0,.03,0,0,new THREE.MeshBasicMaterial({map:ctex(emb,1,0),transparent:true,fog:false}));eg.rotation.set(-Math.PI/2,0,0);
 const rn=mkCv(48,200),rg=rn.getContext('2d');rg.fillStyle='#9c0f24';rg.fillRect(0,0,48,200);rg.fillStyle='#e8bf4a';rg.fillRect(0,0,4,200);rg.fillRect(44,0,4,200);rg.fillStyle='#c8203a';for(let y=8;y<200;y+=24){rg.beginPath();rg.moveTo(24,y);rg.lineTo(31,y+7);rg.lineTo(24,y+14);rg.lineTo(17,y+7);rg.closePath();rg.fill()}
 const rr=plI(2.4,RZ_-3.2,0,.025,(RZ_+3.2)/2,0,new THREE.MeshBasicMaterial({map:ctex(rn,1,0),fog:false}));rr.rotation.set(-Math.PI/2,0,0);rr.scale.set(1,1,1);
 return G}
/* ---------- hook into the shop system: bypass the regular shop furnishing, build the empty hall ---------- */
{const b0=buildShop;buildShop=function(o){if(!o||!o.casino)return b0(o);
 while(SG.children.length)SG.remove(SG.children[0]);RX=o.rx;RZ=o.rz;SHK=null;
 if(!intG)intG=buildInterior();SG.add(intG);
 SHOPCUR={o:o,k:['THE CROUPIER','Place your bets. (The tables are being polished.)']};
 IROOM.splice(0,IROOM.length);IA.splice(0,IA.length,{r:[-1.9,1.9,IRZ-.3,IRZ],label:'LEAVE',fn:()=>leaveShop()})}}
/* minimap: the base map was painted when app.js loaded, so add the casino + its drive to it */
try{const x=mb.getContext('2d');x.strokeStyle='#d8d8d0';x.lineCap='round';x.lineWidth=2.6;x.beginPath();x.moveTo(mx(CX),mz(115));x.lineTo(mx(CX),mz(152));x.stroke();
 x.fillStyle='#d9c9a8';x.fillRect(mx(CX-36),mz(186),72*MBS/SIZE,36*MBS/SIZE);x.fillStyle='#4a82b4';x.beginPath();x.arc(mx(FX),mz(FZ),2.2,0,6.3);x.fill();
 x.fillStyle='#e8bf4a';for(const b of BLD)if(b.k==='casino'){x.save();x.translate(mx(b.x),mz(b.z));x.fillRect(-b.w/2*MBS/SIZE,-b.d/2*MBS/SIZE,b.w*MBS/SIZE,b.d*MBS/SIZE);x.restore()}}catch(e){czErr(e,"casino.js")}
window.CASINO={cx:CX,door:DOOR};
})();
