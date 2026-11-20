/* ---------- interior (separate room entered through the front door) ---------- */
var IX=3000,IZ=3000,IY=500,IH=2.7,RX=4.2,RZ=3.2,busy=0,tvOn=0,ST=100,exh=0,outfitI=0,manImg=null;
const inG=new THREE.Group();inG.position.set(IX,IY,IZ);inG.visible=false;scene.add(inG);
const IROOM=[],IA=[],MANMATS=[manMat,skinMat,hairMat,shoeMat,noseMat,jeanMat,creamMat,soleMat];
function ptex(w,h,fn,rep){return mkCol(w,h,fn,rep!==false)}
function imat(map,vc,side){return new THREE.MeshBasicMaterial({map:map||null,vertexColors:!!vc,fog:false,side:side||THREE.FrontSide})}
function fm(hex){return new THREE.MeshBasicMaterial({color:hex,vertexColors:true,fog:false})}
function ibox(x,y,z,w,h,d,mat,sh){const g=new THREE.BoxGeometry(w,h,d),col=new Float32Array(g.attributes.position.count*3),F=[.82,.7,1,.45,.9,.74];for(let f=0;f<6;f++)for(let v=0;v<4;v++){const i=(f*4+v)*3,c=F[f]*(sh||1);col[i]=col[i+1]=col[i+2]=c}g.setAttribute('color',new THREE.BufferAttribute(col,3));const m=new THREE.Mesh(g,mat);m.position.set(x,y+h/2,z);inG.add(m);return m}
function iplane(w,h,x,y,z,ry,mat){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),mat);m.position.set(x,y,z);m.rotation.y=ry;inG.add(m);return m}
const tWood=ptex(32,32,c=>{c.fillStyle='#8a5a2e';c.fillRect(0,0,32,32);c.fillStyle='#74481f';for(let y=3;y<32;y+=6)c.fillRect(0,y,32,1);c.fillStyle='#9c6a38';for(let k=0;k<8;k++)c.fillRect(k*5%32,(k*9)%32,6,1)});
const tFloor=()=>{const t=ptex(64,64,c=>{for(let y=0;y<4;y++){c.fillStyle=['#a8743f','#b07c46','#9c6b3a','#b4814a'][y];c.fillRect(0,y*16,64,16);c.fillStyle='#74492a';c.fillRect(0,y*16,64,1);c.fillRect((y*29+7)%64,y*16,1,16);for(let k=0;k<5;k++){c.fillStyle='rgba(90,55,25,.35)';c.fillRect((k*13+y*17)%64,y*16+3+(k*5)%10,6,1)}}});return t};
const tWall=(rx,ry)=>{const t=ptex(32,32,c=>{c.fillStyle='#e8d9ad';c.fillRect(0,0,32,32);c.fillStyle='#d9c791';for(let x=0;x<32;x+=8)c.fillRect(x,0,3,32);c.fillStyle='#cdb77f';for(let k=0;k<10;k++)c.fillRect((k*7)%32,(k*11)%32,2,2)});t.repeat.set(rx,ry);return t};
const tBlanket=ptex(32,32,c=>{for(let y=0;y<4;y++)for(let x=0;x<4;x++){c.fillStyle=(x+y)%2?'#3d66ba':'#5079cf';c.fillRect(x*8,y*8,8,8)}});
const tPillow=ptex(16,16,c=>{c.fillStyle='#f3f0e8';c.fillRect(0,0,16,16);c.fillStyle='#dedad0';c.fillRect(0,0,16,2);c.fillRect(0,14,16,2)});
const tWard=ptex(32,64,c=>{c.fillStyle='#6b4220';c.fillRect(0,0,32,64);c.fillStyle='#7d5129';c.fillRect(2,2,13,60);c.fillRect(17,2,13,60);c.fillStyle='#4e2e14';c.fillRect(15,0,2,64);c.fillStyle='#e0c060';c.fillRect(12,30,2,6);c.fillRect(18,30,2,6)});
const tFridge=ptex(32,64,c=>{c.fillStyle='#e8eef0';c.fillRect(0,0,32,64);c.fillStyle='#b8c2c6';c.fillRect(0,19,32,2);c.fillStyle='#8e979b';c.fillRect(26,6,2,10);c.fillRect(26,25,2,16);c.fillStyle='#fff';c.fillRect(2,2,2,60)});
const tCab=ptex(32,32,c=>{c.fillStyle='#c9b184';c.fillRect(0,0,32,32);c.fillStyle='#a8905f';c.fillRect(0,0,32,2);c.fillRect(15,0,2,32);c.fillRect(0,30,32,2);c.fillStyle='#5a4a2a';c.fillRect(12,12,2,5);c.fillRect(18,12,2,5)});
const tSofa=ptex(32,32,c=>{c.fillStyle='#b5503a';c.fillRect(0,0,32,32);c.fillStyle='#a2442f';for(let y=0;y<32;y+=4)c.fillRect(0,y,32,1);c.fillStyle='#c4604a';for(let k=0;k<12;k++)c.fillRect((k*9)%32,(k*5)%32,2,1)});
const tRug=ptex(32,32,c=>{c.fillStyle='#e6d9b0';c.fillRect(0,0,32,32);c.fillStyle='#b83a2a';c.fillRect(3,3,26,26);c.fillStyle='#8f2a1e';c.fillRect(8,8,16,16);c.fillStyle='#e6d9b0';c.fillRect(14,14,4,4)},false);
const tTV1=ptex(32,20,c=>{const cs=['#fff','#ee0','#0ee','#0e0','#e0e','#e00','#00e'];for(let i=0;i<7;i++){c.fillStyle=cs[i];c.fillRect(i*4.6,0,5,14)}c.fillStyle='#111';c.fillRect(0,14,32,6)},false),tTV2=ptex(32,20,c=>{const cs=['#00e','#e00','#e0e','#0e0','#0ee','#ee0','#fff'];for(let i=0;i<7;i++){c.fillStyle=cs[i];c.fillRect(i*4.6,0,5,14)}c.fillStyle='#222';c.fillRect(0,14,32,6)},false),tTVoff=ptex(16,10,c=>{c.fillStyle='#161b26';c.fillRect(0,0,16,10);c.fillStyle='#232b3c';c.fillRect(2,1,5,1);c.fillRect(1,2,3,1)},false);
const winTex=(a,b,night)=>ptex(32,32,c=>{const g=c.createLinearGradient(0,0,0,32);g.addColorStop(0,a);g.addColorStop(1,b);c.fillStyle=g;c.fillRect(0,0,32,32);if(night){c.fillStyle='#fff';for(let i=0;i<9;i++)c.fillRect((i*11+3)%30,(i*7)%14,1,1);c.fillStyle='#ffe9a0';c.fillRect(22,5,3,3);c.fillStyle='#0a1020'}else{c.fillStyle='rgba(255,255,255,.85)';c.fillRect(4,6,8,3);c.fillRect(18,10,9,3);c.fillStyle=night?'#0a1020':'#4f8a46'}c.fillRect(0,22,32,10);c.fillStyle='#f3efe6';c.fillRect(0,0,32,2);c.fillRect(0,30,32,2);c.fillRect(0,0,2,32);c.fillRect(30,0,2,32);c.fillRect(15,0,2,32);c.fillRect(0,15,32,2)},false);
const tWin=[winTex('#7fb8e8','#cfe6f5',0),winTex('#d9704a','#f3c27a',0),winTex('#0b1230','#1d2a55',1)];
const tPic=ptex(32,24,c=>{c.fillStyle='#8cc4ee';c.fillRect(0,0,32,24);c.fillStyle='#fff';c.fillRect(20,3,7,3);c.fillStyle='#6a9a4e';c.fillRect(0,14,32,10);c.fillStyle='#4a7a3a';c.fillRect(4,10,9,6);c.fillRect(14,12,12,4);c.fillStyle='#6a4a2a';c.fillRect(0,0,32,1);c.fillRect(0,23,32,1);c.fillRect(0,0,1,24);c.fillRect(31,0,1,24)},false);
const inWin=imat(tWin[0]),tvMat=imat(tTVoff);
function setInWin(i){inWin.map=tWin[i]||tWin[0];inWin.needsUpdate=true}
{const fl=tFloor();fl.repeat.set(5,4);const f=new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(fl));inG.add(f);
 iplane(2*RX,IH,0,IH/2,-RZ,0,imat(tWall(4,1.4)));iplane(2*RX,IH,0,IH/2,RZ,Math.PI,imat(tWall(4,1.4)));
 iplane(2*RZ,IH,RX,IH/2,0,-Math.PI/2,imat(tWall(3,1.4)));iplane(2*RZ,IH,-RX,IH/2,0,Math.PI/2,imat(tWall(3,1.4)));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0d0f18,side:THREE.BackSide,fog:false}));vd.position.y=IH/2;inG.add(vd);
 const wood=imat(tWood,1),wl=(w,h)=>{};
 // door (south wall) + frame
 iplane(1.1,2.2,1.6,1.1,RZ-.02,Math.PI,imat(T_FDOOR));
 // windows + pictures
 iplane(1.4,1.1,-2.0,1.5,RZ-.02,Math.PI,inWin);iplane(1.4,1.0,RX-.02,1.55,-.65,-Math.PI/2,inWin);iplane(1.2,1.0,-RX+.02,1.6,-1.9,Math.PI/2,inWin);iplane(1.4,1.1,2.4,1.6,-RZ+.02,0,inWin);
 iplane(.9,.68,.1,1.65,RZ-.02,Math.PI,imat(tPic));iplane(.7,.52,-RX+.02,1.65,2.4,Math.PI/2,imat(tPic));
 // bed
 ibox(-2.9,0,-2.1,2.0,.35,2.2,wood);ibox(-2.9,0,-3.13,2.0,.8,.1,wood);ibox(-2.9,.35,-1.9,1.9,.2,1.75,imat(tBlanket,1));ibox(-2.9,.55,-2.8,1.2,.13,.45,imat(tPillow,1));
 ibox(-1.45,0,-2.9,.5,.55,.5,wood);ibox(-1.45,.55,-2.9,.14,.3,.14,fm(0x333333));ibox(-1.45,.85,-2.9,.34,.26,.34,fm(0xffe9a0));IROOM.push([-3.9,-1.9,-3.2,-1.0],[-1.7,-1.2,-3.2,-2.65]);
 // wardrobe
 ibox(.4,0,-2.8,1.9,2.1,.7,imat(tWard,1));IROOM.push([-.55,1.35,-3.2,-2.45]);
 // fridge + kitchen
 ibox(3.5,0,-2.75,.85,1.85,.8,imat(tFridge,1));IROOM.push([3.07,3.93,-3.15,-2.35]);
 ibox(3.75,0,-.65,.9,.9,2.7,imat(tCab,1));ibox(3.74,.9,-.65,.96,.06,2.76,fm(0x4a4d55));IROOM.push([3.3,4.2,-2.0,.7]);
 ibox(3.7,.96,-1.4,.5,.03,.5,fm(0x111111));ibox(3.7,.96,.15,.26,.24,.26,fm(0xc23a2a));ibox(3.62,.96,-.55,.36,.14,.36,fm(0x9aa0a8));
 // tv corner
 ibox(-3.95,0,1.0,.5,.5,1.7,wood);ibox(-3.98,.5,1.0,.22,.75,1.35,fm(0x14151a));iplane(1.18,.6,-3.86,.88,1.0,Math.PI/2,tvMat);IROOM.push([-4.2,-3.7,.1,1.9]);
 // sofa, rug, table
 ibox(-2.5,0,1.0,2.4,.03,1.9,imat(tRug,1));ibox(-1.2,0,1.0,.9,.45,2.2,imat(tSofa,1));ibox(-.9,.45,1.0,.3,.6,2.2,imat(tSofa,1));ibox(-1.2,.45,-.05,.9,.28,.22,imat(tSofa,1));ibox(-1.2,.45,2.05,.9,.28,.22,imat(tSofa,1));IROOM.push([-1.65,-.75,-.15,2.15]);
 ibox(-2.4,0,1.0,.8,.38,1.0,wood);ibox(-2.4,.38,1.0,.3,.1,.3,fm(0xd8d0b8));IROOM.push([-2.8,-2.0,.5,1.5]);
 // lamp + plant
 ibox(-.35,0,2.6,.1,1.5,.1,fm(0x333333));ibox(-.35,1.4,2.6,.42,.32,.42,fm(0xffe9a0));IROOM.push([-.5,-.2,2.45,2.75]);
 ibox(3.7,0,2.5,.5,.45,.5,fm(0x9a4a2a));ibox(3.7,.45,2.5,.7,.9,.7,fm(0x2f8a3a));IROOM.push([3.35,4.05,2.15,2.85]);
 IA.push({r:[-3.95,-1.85,-3.25,-.95],label:'SAVE GAME',fn:saveGame},{r:[-.6,1.4,-3.25,-2.4],label:'WARDROBE',fn:()=>openShop('wardrobe')},{r:[3.0,4.0,-3.25,-2.3],label:'OPEN FRIDGE',fn:eat},{r:[-4.2,-3.65,.1,1.9],label:()=>tvOn?'TV OFF':'TV ON',fn:toggleTV},{r:[1.0,2.2,RZ-.3,RZ],label:'LEAVE HOUSE',fn:()=>leaveHouse()})}
function rdist(x,z,r){const dx=Math.max(r[0]-x,0,x-r[1]),dz=Math.max(r[2]-z,0,z-r[3]);return Math.hypot(dx,dz)}
function fade(fn){if(busy)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;const f=$('fade');f.style.opacity=1;setTimeout(()=>{fn();f.style.opacity=0;setTimeout(()=>{busy=0},220)},300)}
function lightMan(){for(const m of MANMATS)m.color.setRGB(...m.userData.base)}
function enterHouse(imm){const go=()=>{GS.inside=1;inG.visible=true;rain.visible=false;P.x=IX+1.6;P.z=IZ+2.3;P.y=IY+.02;P.psi=Math.PI;P.speed=0;P.dir=1;camAng=P.psi;snow.visible=false;lightMan();setLabels()};imm===true?go():fade(go)}
function leaveHouse(imm){const go=()=>{GS.inside=0;inG.visible=false;const w=LW(4.2,1.7);P.x=w[0];P.z=w[1];P.y=gH(P.x,P.z)+.02;P.psi=HM.th;P.speed=0;camAng=P.psi;snow.visible=!!seasonI;applyTOD(todI);setLabels()};imm===true?go():fade(go)}
function eat(){ST=100;exh=0;beep(520,.12,'square',.06);setTimeout(()=>beep(780,.14,'square',.06),110);toast('YUM! STAMINA FULL')}
function toggleTV(){tvOn=!tvOn;tvMat.map=tvOn?tTV1:tTVoff;tvMat.needsUpdate=true;beep(tvOn?600:300,.1,'square',.05);toast(tvOn?'TV ON':'TV OFF')}
function updIn(now){if(tvOn){tvMat.map=(Math.floor(now/170)%2)?tTV1:tTV2}}
function moveIn(dt){const wr=inp.hand||keys.space,run=wr&&!exh,fwd=((inp.gas||keys.up||wr)?1:0)-(((inp.brk||keys.down)&&!wr)?1:0),turn=clamp((keys.left?1:0)-(keys.right?1:0)+inp.pad,-1,1);
 if(run&&P.speed>1){ST=Math.max(0,ST-9*dt);if(ST<=0){exh=1;toast('OUT OF BREATH')}}else{ST=Math.min(100,ST+(P.speed<.6?8:3.5)*dt);if(exh&&ST>30)exh=0}
 return{run,fwd,turn}}
function stepIn(dt){const mv=moveIn(dt),run=mv.run,fwd=mv.fwd;P.psi+=mv.turn*2.4*dt;if(fwd)P.dir=fwd;
 const sp=fwd>0?(run?4.8:3):fwd<0?2:0;P.speed+=(sp-P.speed)*Math.min(1,dt*(run?5:10));
 let nx=P.x-IX+Math.sin(P.psi)*P.speed*P.dir*dt,nz=P.z-IZ+Math.cos(P.psi)*P.speed*P.dir*dt;
 for(let it=0;it<2;it++){nx=clamp(nx,-RX+.4,RX-.4);nz=clamp(nz,-RZ+.4,RZ-.35);
  for(const r of IROOM){const cx=clamp(nx,r[0],r[1]),cz=clamp(nz,r[2],r[3]),dx=nx-cx,dz=nz-cz,dd=Math.hypot(dx,dz);
   if(dd<.36){if(dd>1e-4){nx+=dx/dd*(.36-dd);nz+=dz/dd*(.36-dd)}else{const a=[nx-r[0],r[1]-nx,nz-r[2],r[3]-nz],m=Math.min(...a),i=a.indexOf(m);if(i===0)nx=r[0]-.36;else if(i===1)nx=r[1]+.36;else if(i===2)nz=r[2]-.36;else nz=r[3]+.36}}}}
 P.x=IX+nx;P.z=IZ+nz;P.y=IY+.02;P.phase+=P.speed*dt*(run?1.25:2.3)}
/* outdoor + indoor "use" button */
const PN=['WHITE','RED','BLUE','YELLOW','GREEN','ORANGE','GREY','BLACK'];
function nextPaint(){let i=Math.max(0,PCOL.findIndex(c=>c[1]===paintC));i=(i+1)%PCOL.length;paintC=PCOL[i][1];applyPaint();const b=$('sw').children;for(let k=0;k<b.length;k++)b[k].classList.toggle('on',k===i);toast('CAR PAINT: '+PN[i]);beep(440,.08,'square',.05)}
function ctx(){
 if(GS.inside){let b=null,bd=.8;for(const a of IA){const d=rdist(P.x-IX,P.z-IZ,a.r);if(d<bd){bd=d;b=a}}return b?{label:typeof b.label==='function'?b.label():b.label,fn:b.fn}:{label:'—',fn:null}}
 if(!GS.onFoot)return{label:'EXIT',fn:exitCar};
 if(JOB.on){if(carry){if(Math.hypot(P.x-carry.x,P.z-carry.z)<3.2)return{label:JOB.type==='food'?'DELIVER FOOD':'DELIVER PARCEL',fn:deliverParcel}}else if(inBoot()>0){const bp=bootPos();if(Math.hypot(P.x-bp[0],P.z-bp[1])<2.3)return{label:JOB.type==='food'?'TAKE FOOD':'TAKE PARCEL',fn:takeParcel}}}
 const dc=Math.hypot(P.x-GS.x,P.z-GS.z),wd=LW(4.2,.6),dd=Math.hypot(P.x-wd[0],P.z-wd[1]),wb=LW(-1.1,-5.0),db=Math.hypot(P.x-wb[0],P.z-wb[1]);
 let b={label:'ENTER CAR',fn:enterCar,far:1},bd=1e9;
 if(dc<=4.5){b={label:'ENTER CAR',fn:enterCar};bd=dc}
 if(dd<=2.4&&dd<bd){b={label:'ENTER HOUSE',fn:()=>enterHouse()};bd=dd}
 
 {const gp=gardenNear();if(gp&&gp.d<bd){b=gp.btn;bd=gp.d}}
 {const sn=shopNear();if(sn&&sn.d<=2.3&&sn.d<bd){b={label:shopLabel(sn.o),fn:()=>enterShop(sn.o)};bd=sn.d}}
 return b}
function updUse(){const c=ctx(),b=$('bUse');if(b._l!==c.label){b._l=c.label;b.textContent=c.label}b.style.opacity=c.fn&&!c.far?1:.45}
function useBtn(){if(busy||menuOpen)return;const c=ctx();if(c.fn)c.fn()}
/* outfits: hue-shift the jacket / jeans tiles of the character atlas */
const OUTF=[['ORIGINAL',0,1,1,0,1,1],['RED JACKET',220,1.05,1,0,1,1],['BLUE JACKET, BLACK JEANS',80,1,1,0,.15,.62],['YELLOW JACKET',-85,1.2,1,0,1,.75],['PURPLE JACKET, KHAKI JEANS',150,1,1,-150,.6,1.15],['ORANGE JACKET, GREY JEANS',-110,1.1,1,0,.12,.9]];
function hsl2(p,q,t){t=(t%1+1)%1;return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p}
function recol(x,rx,ry,rw,rh,h0,h1,dh,sm,lm){const d=x.getImageData(rx,ry,rw,rh),a=d.data;for(let i=0;i<a.length;i+=4){const r=a[i]/255,g=a[i+1]/255,b=a[i+2]/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),df=mx-mn;if(df<.05)continue;const l=(mx+mn)/2,s=l>.5?df/(2-mx-mn):df/(mx+mn);let h=(mx===r?((g-b)/df+(g<b?6:0)):mx===g?(b-r)/df+2:(r-g)/df+4)*60;if(h<h0||h>h1||s<.1)continue;h=(h+dh+360)%360;const S=Math.min(1,s*sm),L=Math.min(1,l*lm),q=L<.5?L*(1+S):L+S-L*S,p=2*L-q;a[i]=hsl2(p,q,h/360+1/3)*255;a[i+1]=hsl2(p,q,h/360)*255;a[i+2]=hsl2(p,q,h/360-1/3)*255}x.putImageData(d,rx,ry)}
function applyOutfit(){if(!manImg)return;const o=OUTF[outfitI],W=manImg.naturalWidth,H=manImg.naturalHeight,tw=W/4,th=H/3;
 const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.drawImage(manImg,0,0);
 if(outfitI){if(o[1]){recol(x,0,th,W,th,80,180,o[1],o[3],o[2]);recol(x,0,2*th,tw,th,80,180,o[1],o[3],o[2])}recol(x,tw,2*th,tw,th,165,265,o[4],o[5],o[6])}
 manTex.image=c;manTex.needsUpdate=true;
 const d=x.getImageData(tw,2*th,tw,th).data;let r=0,g=0,b=0,n=0;for(let i=0;i<d.length;i+=64){r+=d[i];g+=d[i+1];b+=d[i+2];n++}
 const k=.94/255/n,bs=[r*k,g*k,b*k];jeanMat.userData.base=bs;const T=GS.inside?[1,1,1]:TOD[todI].tint;jeanMat.color.setRGB(bs[0]*T[0],bs[1]*T[1],bs[2]*T[2])}
function nextOutfit(){outfitI=(outfitI+1)%OUTF.length;applyOutfit();toast(OUTF[outfitI][0]);beep(700,.08,'square',.05)}
/* save / load */
function saveGame(){try{const d={o:outfitI,p:Math.max(0,PCOL.findIndex(c=>c[1]===paintC)),t:todI,s:seasonI?1:0,g:[],c:cash,gf:1,dl:dels,cr:CARI,sk:streak,wx:rainI,ow:OWN,en:ENG,ty:TYR,x:+GS.x.toFixed(1),z:+GS.z.toFixed(1),psi:+GS.psi.toFixed(2),st:Math.round(ST),cz:cozySave()};localStorage.setItem('c1save',JSON.stringify(d));toast('GAME SAVED');beep(660,.1,'square',.06);setTimeout(()=>beep(990,.16,'square',.06),100)}catch(e){toast('CANNOT SAVE HERE')}}
function syncMenu(d){for(const b of document.querySelectorAll('[data-tod]'))b.classList.toggle('on',+b.dataset.tod===d.t);for(const b of document.querySelectorAll('[data-season]'))b.classList.toggle('on',+b.dataset.season===d.s);const s=$('sw').children;for(let k=0;k<s.length;k++)s[k].classList.toggle('on',k===d.p)}
function loadGame(){try{const d=JSON.parse(localStorage.getItem('c1save')||'null');if(!d)return false;cozyLoad(d.cz);outfitI=d.o|0;cash=(d.c|0)+(d.gf?0:1000);dels=d.dl|0;streak=d.sk|0;if(d.ow)OWN=d.ow;ENG=d.en|0;TYR=d.ty|0;OWN.car=OWN.car||[1,0];setCar(d.cr&&OWN.car[d.cr]?d.cr:0);applyUpg();applyOutfit();const c=PCOL[d.p];if(c){paintC=c[1];applyPaint()}applySeason(d.s);applyTOD(d.t);let n=0;GEMS.forEach((g,i)=>{if(d.g&&d.g[i]){g.userData.got=true;g.visible=false;n++}});GS.gems=n;GS.x=d.x;GS.z=d.z;GS.psi=d.psi;GS.y=gH(GS.x,GS.z)+.1;GS.prevGY=GS.y;GS.vx=GS.vz=GS.vy=GS.speed=0;GS.onFoot=0;man.visible=false;if(GS.inside)leaveHouse(true);ST=d.st==null?100:d.st;syncMenu(d);setLabels();camAng=GS.psi;return true}catch(e){return false}}

var FZ={"L": 3.95, "BW": 1.79, "pL": [317.0, 145.82278481012656, 316.0, 145.82278481012656], "pR": [938.5, 146.0759493670886, 316.0, 146.0759493670886], "pT": [608.0, 207.0886075949367, 1000.5, 207.0886075949367], "pF": [345.0, 238.54748603351956, 751.0, 224.1128864909732], "pB": [909.5, 235.75418994413408, 751.0, 229.49159576675655], "st": [[1.97, 0.462, 0.615, 0.536], [1.967, 0.426, 0.653, 0.536], [1.959, 0.384, 0.699, 0.536], [1.945, 0.35, 0.743, 0.537], [1.925, 0.331, 0.78, 0.54], [1.901, 0.324, 0.817, 0.549], [1.87, 0.321, 0.855, 0.568], [1.835, 0.317, 0.894, 0.6], [1.794, 0.308, 0.928, 0.641], [1.748, 0.291, 0.957, 0.687], [1.697, 0.27, 0.983, 0.73], [1.642, 0.25, 1.007, 0.767], [1.581, 0.235, 1.028, 0.798], [1.517, 0.219, 1.049, 0.825], [1.448, 0.202, 1.068, 0.848], [1.374, 0.187, 1.086, 0.866], [1.297, 0.177, 1.103, 0.878], [1.217, 0.172, 1.121, 0.883], [1.132, 0.172, 1.142, 0.885], [1.045, 0.175, 1.169, 0.886], [0.955, 0.182, 1.202, 0.886], [0.861, 0.196, 1.243, 0.886], [0.766, 0.211, 1.291, 0.886], [0.668, 0.223, 1.343, 0.886], [0.569, 0.23, 1.394, 0.886], [0.468, 0.233, 1.443, 0.886], [0.365, 0.234, 1.488, 0.886], [0.261, 0.237, 1.529, 0.886], [0.157, 0.24, 1.566, 0.886], [0.052, 0.243, 1.596, 0.885], [-0.052, 0.245, 1.621, 0.885], [-0.157, 0.247, 1.64, 0.884], [-0.261, 0.247, 1.653, 0.883], [-0.365, 0.247, 1.66, 0.881], [-0.468, 0.247, 1.664, 0.878], [-0.569, 0.247, 1.664, 0.875], [-0.668, 0.247, 1.662, 0.873], [-0.766, 0.246, 1.657, 0.871], [-0.861, 0.242, 1.651, 0.872], [-0.955, 0.232, 1.641, 0.874], [-1.045, 0.216, 1.63, 0.877], [-1.132, 0.197, 1.617, 0.88], [-1.217, 0.182, 1.602, 0.882], [-1.297, 0.174, 1.588, 0.881], [-1.374, 0.171, 1.574, 0.875], [-1.448, 0.173, 1.561, 0.864], [-1.517, 0.18, 1.545, 0.848], [-1.581, 0.201, 1.518, 0.83], [-1.642, 0.239, 1.474, 0.812], [-1.697, 0.292, 1.415, 0.793], [-1.748, 0.343, 1.35, 0.773], [-1.794, 0.38, 1.283, 0.749], [-1.835, 0.401, 1.207, 0.723], [-1.87, 0.411, 1.113, 0.702], [-1.901, 0.417, 1.008, 0.688], [-1.925, 0.424, 0.916, 0.681], [-1.945, 0.433, 0.853, 0.679], [-1.959, 0.444, 0.814, 0.678], [-1.967, 0.452, 0.79, 0.678], [-1.97, 0.457, 0.773, 0.678]], "wl": {"L": [147.78504672897196, 513.9522900763359, 268.0], "R": [1107.6365348399247, 739.8311195445921, 268.0], "rp": 48}, "wz": [1.16, -1.351], "hw": 0.8909229828850856};
var FZ_IMG="assets/fz-img.jpg";
var FZ_MASK="assets/fz-mask.png";
/* ---------- courier jobs ---------- */
var jbc=0,cash=800,dels=0,jobCool=0,carry=null,streak=0;
function repStars(){return Math.min(5,Math.floor(streak/2))}
const carryBox=new THREE.Mesh(new THREE.BoxGeometry(.42,.3,.34),wmat([.8,.62,.36],{vertexColors:false}));carryBox.position.set(.22,1.0,.3);carryBox.visible=false;carryBox.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(.1,.31,.35),wmat([.95,.9,.7],{vertexColors:false}))));man.add(carryBox);
const bootM=new THREE.Mesh(new THREE.OctahedronGeometry(.28,0),new THREE.MeshBasicMaterial({color:0xffe14a,fog:false}));bootM.visible=false;scene.add(bootM);
function bootPos(){return[GS.x-Math.sin(GS.psi)*2.4,GS.z-Math.cos(GS.psi)*2.4]}
function inBoot(){return JOB.on?JOB.stops.filter(s=>!s.done&&s!==carry).length:0}
const JOB={on:0,type:'',stops:[],t:0,tmax:0,from:'',base:0,done:0,len:0};
function mkBeam(col){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,70,10,1,true),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,depthWrite:false,fog:false,side:THREE.DoubleSide}));b.position.y=35;const r=new THREE.Mesh(new THREE.RingGeometry(4,5.2,28).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.8,fog:false,depthWrite:false,side:THREE.DoubleSide}));r.position.y=.2;g.add(b,r);g.visible=false;scene.add(g);return g}
const DBEAM=DEPOTS.map(d=>{const g=mkBeam(d.type==='food'?0xffd23a:0x4aa8ff);g.position.set(d.x,G0,d.z);g.visible=true;return g});
const TBEAM=[mkBeam(0xff5a3a),mkBeam(0xff5a3a),mkBeam(0xff5a3a)];
function pickTargets(dep,n){const pool=TG.filter(t=>{const d=Math.hypot(t.dx-dep.x,t.dz-dep.z);return d>80&&d<320});for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}const out=[];for(const t of pool){if(out.every(o=>Math.hypot(o.dx-t.dx,o.dz-t.dz)>40))out.push(t);if(out.length>=n)break}return out}
function fmtT(t){t=Math.max(0,Math.ceil(t));return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')}
function startJob(dep,opt){const n=opt&&opt.n||(dep.type==='food'?1:3),ts=pickTargets(dep,n);if(!ts.length)return;JOB.on=1;JOB.type=dep.type;JOB.from=dep.name;JOB.stops=ts.map(t=>Object.assign({},t,{done:0}));JOB.done=0;let len=0,p=[dep.x,dep.z];for(const t of ts){len+=Math.hypot(t.dx-p[0],t.dz-p[1]);p=[t.dx,t.dz]}JOB.len=len;carry=null;JOB.tmax=JOB.t=Math.round(35+len/(dep.type==='food'?8.5:7.5)+(dep.type==='food'?15:18*n));JOB.base=dep.type==='food'?Math.round(6+len/35):Math.round(4*n+len/45);JOB.kind='';JOB.dmg=0;JOB.ps=0;if(opt&&opt.kind!==undefined)JOB.kind=opt.kind;else{const r=Math.random();if(r<.28)JOB.kind='rush';else if(r<.5&&dep.type!=='food')JOB.kind='fragile'}if(JOB.kind==='rush'){JOB.tmax=JOB.t=Math.round(JOB.t*.62);JOB.base=Math.round(JOB.base*1.7)}if(JOB.kind==='fragile')JOB.base=Math.round(JOB.base*1.4);JOB.nm=todI===2?1.5:todI===1?1.25:1;JOB.base=Math.round(JOB.base*JOB.nm);
 toast((JOB.kind==='rush'?'RUSH ORDER! ':JOB.kind==='fragile'?'FRAGILE - DRIVE GENTLY! ':'')+(JOB.nm>1?'NIGHT BONUS! ':'')+(dep.type==='food'?'ORDER IN THE CAR! DELIVER IT HOT':'CAR LOADED: '+n+' PARCELS'));beep(660,.1,'square',.06);setTimeout(()=>beep(880,.14,'square',.06),110)}
function finishJob(){const late=JOB.t<=0;let pay=JOB.base,tip=0;if(JOB.type==='food')tip=late?0:Math.round(5*clamp(JOB.t/JOB.tmax*1.8,0,1));else tip=late?0:6;if(late)streak=0;else streak++;pay=Math.round((pay+tip)*(1+.1*repStars()));if(JOB.kind==='fragile')pay=Math.round(pay*Math.max(.3,1-.2*JOB.dmg));if(CARI===2&&JOB.type!=='food')pay=Math.round(pay*1.25);cash+=pay;dels+=JOB.stops.length;toast((JOB.kind==='fragile'&&JOB.dmg?'BUMPY! ':'')+'DELIVERED! +£'+pay+(tip?' (TIP £'+tip+')':late?' (LATE)':'')+(repStars()?' ★'+repStars():''));beep(784,.12,'square',.06);setTimeout(()=>beep(1046,.18,'square',.06),120);JOB.on=0;jobCool=6}
function takeParcel(){if(carry||!inBoot())return;const bp=bootPos();let b=null,bd=1e9;for(const s of JOB.stops){if(s.done||s===carry)continue;const d=Math.hypot(s.dx-GS.x,s.dz-GS.z);if(d<bd){bd=d;b=s}}carry=b;carryBox.material.userData.base=JOB.type==='food'?[.96,.92,.82]:[.8,.62,.36];carryBox.material.color.setRGB(...carryBox.material.userData.base);toast((JOB.type==='food'?'FOOD FOR ':'PARCEL FOR ')+b.addr);beep(520,.08,'square',.05)}
function deliverParcel(){if(!carry)return;const s=carry;if(Math.hypot(P.x-s.x,P.z-s.z)>3.2){toast('WRONG ADDRESS: '+s.addr);return}s.done=1;JOB.done++;carry=null;custSay(s);beep(880,.1,'square',.06);if(JOB.done<JOB.stops.length){cash+=2;toast('PARCEL DELIVERED +£2')}}
function updJob(dt){if(jobCool>0)jobCool-=dt;if(GS.inside)return;const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,sp=GS.onFoot?P.speed:Math.abs(GS.speed);
 if(!JOB.on){carry=null;if(jobCool<=0)for(const d of DEPOTS)if(d.type!=='parcel'&&Math.hypot(px-d.x,pz-d.z)<5.4&&sp<3.5&&!GS.onFoot){startJob(d);break}}
 else{JOB.t-=dt;if(JOB.kind==='fragile'&&!GS.onFoot){const ab=Math.abs(GS.speed);if(JOB.ps-ab>4.5&&dt<.2&&jbc<=0){JOB.dmg++;jbc=.8;toast('BUMP! PARCELS SHAKEN ('+JOB.dmg+')');beep(150,.15,'sawtooth',.08)}JOB.ps=ab}if(jbc>0)jbc-=dt;
    if(JOB.done>=JOB.stops.length)finishJob();else if(JOB.t<-50){JOB.on=0;carry=null;jobCool=8;toast('ORDER CANCELLED')}}
 carryBox.visible=!!carry&&GS.onFoot;
 const showBoot=JOB.on&&GS.onFoot&&!carry&&inBoot()>0;bootM.visible=showBoot;if(showBoot){const b=bootPos();bootM.position.set(b[0],G0+1.5+Math.sin(performance.now()*.005)*.15,b[1]);bootM.rotation.y+=dt*2}
 DBEAM.forEach(g=>g.visible=!JOB.on);TBEAM.forEach((g,i)=>{const s=JOB.on&&JOB.stops[i];let v=!!s&&!s.done;if(v&&carry&&s!==carry)v=false;g.visible=v;if(s){if(carry&&s===carry){g.position.set(s.x,G0,s.z);g.scale.set(.5,1,.5)}else{g.position.set(s.dx,G0,s.dz);g.scale.set(1,1,1)}}})}
function jobTarget(){const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z;let b=null,bd=1e9;
 if(JOB.on){if(carry){b=[carry.x,carry.z,carry];bd=Math.hypot(carry.x-px,carry.z-pz)}else if(GS.onFoot&&inBoot()>0){const bp=bootPos();b=[bp[0],bp[1],{addr:'THE BOOT',boot:1}];bd=Math.hypot(bp[0]-px,bp[1]-pz)}else for(const s of JOB.stops){if(s.done)continue;const d=Math.hypot(s.dx-px,s.dz-pz);if(d<bd){bd=d;b=[s.dx,s.dz,s]}}}
 else for(const d of DEPOTS){const q=Math.hypot(d.x-px,d.z-pz);if(q<bd){bd=q;b=[d.x,d.z,d]}}return b?{x:b[0],z:b[1],d:bd,o:b[2]}:null}
function updJobHUD(){const e=$('job'),ar=$('arrow');if(GS.inside||menuOpen){e.style.display='none';ar.style.display='none';return}const t=jobTarget();e.style.display='block';
 if(JOB.on){const nxt=t&&t.o,late=JOB.t<=0;$('jl1').textContent=carry?'DELIVER → '+custOf(carry.addr).n+', '+carry.addr:nxt&&nxt.boot?(JOB.type==='food'?'TAKE THE FOOD FROM THE CAR':'TAKE A PARCEL FROM THE BOOT'):(JOB.type==='food'?JOB.from+' → ':'PARCELS '+JOB.done+'/'+JOB.stops.length+' · '+inBoot()+' IN BOOT → ')+(nxt?nxt.addr:'');$('jl2').innerHTML=(JOB.kind==='rush'?'RUSH · ':JOB.kind==='fragile'?'FRAGILE'+(JOB.dmg?' x'+JOB.dmg:'')+' · ':'')+(JOB.nm>1?'NIGHT · ':'')+'£'+JOB.base+' · <span style="color:'+(late?'#ff5050':JOB.t<20?'#ffb040':'#fff')+'">'+(late?'LATE':fmtT(JOB.t))+'</span> · '+Math.round(t?t.d:0)+' m'}
 else{$('jl1').textContent='FIND A JOB: '+(t?t.o.name:'');$('jl2').textContent=(t?Math.round(t.d):0)+' m · STOP IN THE RING TO TAKE AN ORDER'}
 if(t){ar.style.display='block';const px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,rel=Math.atan2(t.x-px,t.z-pz)-camAng;ar.style.transform='rotate('+(-rel)+'rad)'}else ar.style.display='none'}
/* ---------- ambient traffic + pedestrians ---------- */
const AIC=[],NPC=[];
function aiCar(col,si){const B=new Builder(3),G=new Builder(3);carParts((k,lx,ly,lz,sx,sy,sz,cc)=>pbox(k==='g'?G:B,lx,ly,lz,sx,sy,sz,cc),si,col);const g=new THREE.Group();g.add(B.mesh(mObj),G.mesh(mGlass));g.position.y=G0;scene.add(g);return g}
{const cols=[[.7,.1,.1],[.1,.2,.5],[.85,.85,.88],[.1,.1,.12],[.3,.5,.3],[.9,.75,.1],[.5,.5,.55],[.5,.2,.5]];
 for(let i=0;i<8;i++){const ri=i%2,s=SEG.find(q=>q.ri===ri),dir=(i>>1)%2?1:-1,c=null;const cl=[[0,0,.85],[0,0,.85],[0,0,.85]];cl.forEach(q=>COL.push(q));AIC.push({cv:civAdd({m:[0,1,3,1,2,0,1,0][i],col:cols[i],x:0,z:0,rot:0}),s,dir,t:40+i*55%s.l,v:0,vmax:7+Math.random()*3,cl})}}
function aiEnt(){const o=[];if(!GS.inside){o.push([GS.x,GS.z]);if(GS.onFoot)o.push([P.x,P.z])}return o}
function updTraffic(dt){const ents=aiEnt(),R=scene.fog.far+30;
 for(const a of AIC){const s=a.s,d=[s.dx*a.dir,s.dz*a.dir],lf=[d[1],-d[0]];let tv=a.vmax;const px=s.a[0]+s.dx*a.t+lf[0]*1.0,pz=s.a[1]+s.dz*a.t+lf[1]*1.0;
  for(const e of ents){const rx=e[0]-px,rz=e[1]-pz,al=rx*d[0]+rz*d[1],lt=rx*lf[0]+rz*lf[1];if(al>0&&al<11&&Math.abs(lt)<1.5)tv=Math.min(tv,al<5?0:(al-5)*.8)}
  for(const o of AIC){if(o===a||o.s!==s||o.dir!==a.dir)continue;const al=(o.t-a.t)*a.dir;if(al>0&&al<10)tv=Math.min(tv,al<5?0:Math.min(a.vmax,o.v))}
  a.v+=clamp(tv-a.v,-14*dt,3*dt);a.t+=a.v*dt*a.dir;if(a.t>s.l-6||a.t<6){a.t=a.dir>0?8:s.l-8;a.v=0}
  const x=s.a[0]+s.dx*a.t+lf[0]*1.0,z=s.a[1]+s.dz*a.t+lf[1]*1.0;a.cv.x=x;a.cv.z=z;a.cv.rot=Math.atan2(d[0],d[1]);
  a.cl[0][0]=x+d[0]*1.2;a.cl[0][1]=z+d[1]*1.2;a.cl[1][0]=x;a.cl[1][1]=z;a.cl[2][0]=x-d[0]*1.2;a.cl[2][1]=z-d[1]*1.2;
  }updCiv();updCozy(dt)}
function npcMesh(shirt,legc,skin,hair){const U=new Builder(3),L=new Builder(3);pbox(U,0,.85,0,.42,.62,.24,shirt);pbox(U,-.3,.9,0,.12,.55,.14,shirt);pbox(U,.3,.9,0,.12,.55,.14,shirt);pbox(U,0,1.5,0,.24,.26,.24,skin);pbox(U,0,1.72,0,.27,.1,.27,hair);pbox(L,0,-.85,0,.17,.85,.2,legc);
 const g=new THREE.Group(),up=U.mesh(mObj),l1=L.mesh(mObj),l2=L.mesh(mObj);l1.position.set(-.11,.85,0);l2.position.set(.11,.85,0);g.add(up,l1,l2);g.l1=l1;g.l2=l2;scene.add(g);return g}
{const sh=[[.8,.2,.2],[.2,.35,.7],[.9,.85,.3],[.25,.55,.35],[.85,.85,.88],[.5,.25,.5],[.9,.5,.2]],lg=[[.18,.2,.35],[.15,.15,.17],[.4,.35,.25],[.2,.3,.45]],sk=[[.9,.7,.55],[.75,.55,.4],[.55,.38,.28]],hr=[[.2,.12,.07],[.1,.08,.06],[.7,.55,.25],[.55,.55,.55]];
 const walkSegs=SEG.filter(q=>q.l>25&&ROADS[q.ri].n!=='THE GREEN');
 for(let i=0;i<14;i++){const s=walkSegs[i%walkSegs.length],sd=i%2?1:-1,len=Math.min(s.l-12,40+Math.random()*50),t0=6+Math.random()*(s.l-len-12),g=npcMesh(sh[i%sh.length],lg[i%lg.length],sk[i%sk.length],hr[i%hr.length]),cl=[0,0,.4];COL.push(cl);NPC.push({g,s,sd,t0,t1:t0+len,t:t0+Math.random()*len,dir:Math.random()<.5?1:-1,sp:1.1+Math.random()*.5,ph:Math.random()*6,cl})}}
function updPeds(dt,now){const R=scene.fog.far+10;for(const n of NPC){const s=n.s,vis=Math.hypot(s.a[0]+s.dx*n.t-cam.position.x,s.a[1]+s.dz*n.t-cam.position.z)<R;n.g.visible=vis;n.t+=n.dir*n.sp*dt;if(n.t>n.t1){n.t=n.t1;n.dir=-1}else if(n.t<n.t0){n.t=n.t0;n.dir=1}
  const lat=(RW+PW*.55)*n.sd,x=s.a[0]+s.dx*n.t-s.dz*lat,z=s.a[1]+s.dz*n.t+s.dx*lat;n.cl[0]=x;n.cl[1]=z;if(!vis)continue;n.ph+=dt*n.sp*4.2;n.g.position.set(x,G0,z);n.g.rotation.y=Math.atan2(s.dx*n.dir,s.dz*n.dir);const sw=Math.sin(n.ph)*.55;n.g.l1.rotation.x=sw;n.g.l2.rotation.x=-sw}}
/* ---------- rain ---------- */
var rainI=0;
const RN=1100,rainArr=new Float32Array(RN*6),rainGeo=new THREE.BufferGeometry();
for(let i=0;i<RN;i++){const x=(Math.random()-.5)*60,y=Math.random()*30,z=(Math.random()-.5)*60;rainArr.set([x,y,z,x-.15,y+.9,z],i*6)}
rainGeo.setAttribute('position',new THREE.BufferAttribute(rainArr,3));
const rain=new THREE.LineSegments(rainGeo,new THREE.LineBasicMaterial({color:0xb8c8e0,transparent:true,opacity:.8,fog:false}));rain.frustumCulled=false;rain.visible=false;scene.add(rain);
function updRain(dt){if(!rain.visible)return;const a=rainArr;for(let i=0;i<RN;i++){const k=i*6,d=dt*24;a[k+1]-=d;a[k+4]-=d;if(a[k+1]<0){const x=(Math.random()-.5)*60,z=(Math.random()-.5)*60;a[k]=x;a[k+1]=30;a[k+2]=z;a[k+3]=x-.15;a[k+4]=30.9;a[k+5]=z}}rainGeo.attributes.position.needsUpdate=true;rain.position.set(cam.position.x,cam.position.y-12,cam.position.z)}
/* ---------- gentle retro tune ---------- */
var musOn=1,musT=0,musS=0;
const MEL=[[261.6,329.6,392,329.6,440,392,329.6,261.6],[220,261.6,329.6,261.6,392,329.6,261.6,220],[174.6,220,261.6,220,349.2,293.7,261.6,220],[196,246.9,293.7,246.9,392,349.2,293.7,246.9]],BASS=[130.8,110,87.3,98];
function updMusic(dt){if(!AC||!snd||!musOn||menuOpen)return;musT-=dt;if(musT>0)return;musT=.24;const bar=Math.floor(musS/8)%4,n=MEL[bar][musS%8];beep(n,.32,'triangle',.022);if(musS%4===0)beep(BASS[bar],.5,'sine',.04);musS++}
