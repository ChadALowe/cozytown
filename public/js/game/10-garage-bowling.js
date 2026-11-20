/* ---- village showroom, Joe's garage (upgrades + spray booth), bowling alley building ---- */
Object.assign(HRS,{'VILLAGE MOTORS':[9,18],"JOE'S GARAGE":[8,17.5],'STRIKE BOWL':[9,23.5]});
TH['VILLAGE MOTORS']={wall:0xf4f4f8,fl:'tile',cnt:0x20242c,top:0x888890,sh:0x2a3a5a};
TH["JOE'S GARAGE"]={wall:0xc4c2ba,fl:'stone',cnt:0x6a2a1a,top:0x9a9a9a,sh:0x2a4a8a};
TH['STRIKE BOWL']={wall:0x5a4a7a,fl:'wood',cnt:0x2a1a4a,top:0xffd040,sh:0x8a2a8a};
const CARN=['CITROËN C1','FORD FIESTA','ROYAL MAIL VAN','LAND ROVER DEFENDER','MAZDA MX-5','VOLVO V60 ESTATE'],CARSD=['YOUR TRUSTY STANDARD','FASTER + GRIPPIER','+25% PARCEL PAY','TOUGH + GRIPPY','QUICK + SPORTY','ROOMY + STEADY'],SHOWC=[];
const CPR=i=>[0,CARP,VANP,DEFP,MXP,VOP][i];
const LEAVE_IA=()=>({r:[1.0,2.2,RZ-.3,RZ],label:'LEAVE',fn:()=>leaveShop()});
function gbox(g,x,y,z,w,h,d,hex){const m=sbox(x,y,z,w,h,d,fmc(hex));SG.remove(m);g.add(m);return m}
function realCar(i){let g=null;try{if(i===0)g=c1Inst([1,1,1]);else if(i===1)g=window.fiesInst(PCOL[2][1]);else if(i===2)g=window.vanInst();else if(i===3)g=window.lrInst(0);else if(window.NC)g=NC.inst(i)}catch(e){g=null}return g||dispCar(i)}
function dispCar(k){const g=new THREE.Group(),A=(x,y,z,w,h,d,c)=>gbox(g,x,y,z,w,h,d,c),wh=(L,W)=>{for(const sx of[-1,1])for(const sz of[-1,1])A(sx*L*.3,0,sz*(W/2-.02),.56,.56,.26,0x15151a)};
 if(k===0){A(0,.22,0,3.4,.5,1.5,0xf2f2f2);A(-.1,.72,0,1.9,.46,1.38,0xf2f2f2);A(-.1,.78,0,1.92,.3,1.4,0x7090a8);A(1.7,.3,0,.06,.2,1.2,0xffe080);wh(3.4,1.5)}
 else if(k===1){A(0,.22,0,4.0,.52,1.7,0x2a5aa0);A(-.2,.74,0,2.1,.5,1.56,0x2a5aa0);A(-.2,.8,0,2.12,.32,1.58,0x7090a8);A(2.0,.3,0,.06,.2,1.4,0xffe080);wh(4.0,1.7)}
 else if(k===2){A(-.2,.24,0,3.3,1.55,1.75,0xc82020);A(1.6,.24,0,1.1,.95,1.75,0xc82020);A(1.75,.7,0,.9,.5,1.7,0x7090a8);A(-.2,1.55,0,3.3,.06,1.76,0xe8e8e8);A(2.18,.3,0,.06,.2,1.4,0xffe080);A(-.2,.9,0,3.32,.22,1.77,0xf0f0f0);wh(4.5,1.75)}
 else if(k===3){A(0,.3,0,4.0,.85,1.75,0x2e5a34);A(-.3,1.14,0,2.3,.55,1.7,0x2e5a34);A(-.3,1.7,0,2.3,.08,1.72,0xf0f0f0);A(-.3,1.2,0,2.32,.36,1.72,0x8ab0b8);A(2.0,.5,0,.06,.25,1.5,0xffe080);wh(4.0,1.75)}
 else if(k===4){A(0,.22,0,3.9,.46,1.6,0xa4a9b4);A(-.25,.66,0,1.3,.34,1.45,0x1c1c20);A(.5,.62,0,.34,.28,1.45,0x7090a8);A(1.95,.3,0,.06,.15,1.3,0xffe080);wh(3.9,1.6)}
 else{A(0,.3,0,4.6,.7,1.8,0xa4a9b4);A(-.2,.95,0,3.0,.5,1.75,0xa4a9b4);A(-.2,1.0,0,3.02,.34,1.77,0x6a7480);A(-.2,1.25,0,3.0,.06,1.78,0x202024);A(2.3,.4,0,.06,.2,1.5,0xffe080);wh(4.6,1.8)}
 g.rotation.y=0;return g}
function boardTex(i){const f=cvT(256,128),g=f.cv.getContext('2d');g.fillStyle='#14181f';g.fillRect(0,0,256,128);g.strokeStyle='#e8c040';g.lineWidth=4;g.strokeRect(3,3,250,122);g.fillStyle='#f4f4f4';g.font='bold 20px monospace';g.textAlign='center';g.fillText(CARN[i],128,34);g.fillStyle='#9ab';g.font='bold 14px monospace';g.fillText(CARSD[i],128,60);g.fillStyle=OWN.car[i]?'#6fe06f':'#ffd840';g.font='bold 30px monospace';g.fillText(OWN.car[i]?'OWNED':(CPR(i)?'£'+CPR(i):'FREE'),128,102);f.tx.needsUpdate=true;return f.tx}
function sPlane(w,h,x,y,z,ry,tex){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,fog:false}));m.position.set(x,y,z);m.rotation.y=ry;SG.add(m);return m}
function txtTex(w,h,bg,fg,t,sz){const f=cvT(w,h),g=f.cv.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,w,h);g.fillStyle=fg;g.font='bold '+(sz||h*.55)+'px Georgia,serif';g.textAlign='center';g.textBaseline='middle';g.fillText(t,w/2,h/2+2);f.tx.needsUpdate=true;return f.tx}
function buildShowroom(o){IA.splice(0,IA.length,LEAVE_IA());IROOM.splice(0,IROOM.length,[-9.4,9.4,-4.2,-1.5]);SHOWC.length=0;
 gbox(SG,0,0,-2.1,2.6,.95,.7,0x20242c);gbox(SG,0,.95,-2.1,2.7,.06,.8,0xc0c4cc);gbox(SG,.5,1.01,-2.2,.5,.35,.05,0x181c24);
 const sp=pSpec(9301,{f:false,gl:false,scarf:null,bp:false,bag:0,old:false,tc:[.12,.16,.3]});window.SHK=personIn(sp,0,-2.85,0);
 const XS=[-8,-4.8,-1.6,1.6,4.8,8];
 XS.forEach((x,i)=>{const pod=new THREE.Mesh(new THREE.CylinderGeometry(1.35,1.4,.14,20),new THREE.MeshBasicMaterial({color:0x303642}));pod.position.set(x,.07,-.6);SG.add(pod);
  const rg=new THREE.Mesh(new THREE.RingGeometry(1.2,1.34,28).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0xe8c040}));rg.position.set(x,.145,-.6);SG.add(rg);
  const car=realCar(i);car.position.set(x,.14,-.6);car.scale.setScalar(.75);car.rotation.y=i*.7;SG.add(car);SHOWC.push(car);
  gbox(SG,x,0,.95,.08,.55,.08,0x303030);sPlane(1.5,.75,x,.9,.97,0,boardTex(i));
  IROOM.push([x-1.4,x+1.4,-1.5,.45]);IA.push({r:[x-1.4,x+1.4,.5,2.6],label:()=>'VIEW '+CARN[i]+(OWN.car[i]?' (OWNED)':CPR(i)?' £'+CPR(i):''),fn:()=>showroomGo(i)})});
 sPlane(5,.7,0,2.0,-RZ+.03,0,txtTex(512,72,'#10151c','#f0c840','VILLAGE MOTORS',46));
 for(const sx of[-9.2,9.2])for(const sy of[0])gbox(SG,sx,0,-2.8,.3,2.2,.3,0xc82020);
 IA.push({r:[-1.5,1.5,-1.5,-.9],label:'TALK TO DEREK',fn:()=>say('DEREK','Take your time. Every one of them has a story.',3600)})}
function showroomGo(i){leaveShop(true);openGallery('show',i)}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(GS.inside&&SHOPCUR&&SHOPCUR.o.t==='VILLAGE MOTORS')SHOWC.forEach((c,i)=>{c.rotation.y+=dt*(.35+i*.04);if(c.userData&&c.userData.upd)c.userData.upd()})}}
/* ---- Joe's garage ---- */
function buildGarage(o){IA.splice(0,IA.length,LEAVE_IA());IROOM.splice(0,IROOM.length,[-6.2,6.2,-4.2,-1.4],[-2.95,.15,-1.1,1.1],[2.3,4.6,-1.3,1.1]);
 const lc=new THREE.Group();gbox(lc,0,0,0,.14,.9,.14,0x707078);const car=dispCar(CARI);car.position.set(0,.95,0);car.scale.setScalar(.8);const lift=new THREE.Group();lift.add(car);lift.position.set(-1.4,0,0);SG.add(lift);
 for(const sx of[-1.7,1.7])for(const sz of[-.75,.75]){const m=sbox(-1.4+sx,0,sz,.16,1.1,.16,fmc(0xe0b020))}sbox(-1.4,.82,0,3.6,.08,1.7,fmc(0x505058));
 for(let i=0;i<4;i++)for(const[tx,tz]of[[-4.5,1.8],[-4.5,-.6]]){const t=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.22,12),new THREE.MeshBasicMaterial({color:i%2?0x202024:0x16161a}));t.position.set(tx,.11+i*.22,tz);SG.add(t)}IROOM.push([-5.0,-4.0,-.95,-.2],[-5.0,-4.0,1.4,2.2]);
 [[4.5,-2.4,0x2a4a9a],[4.0,-2.6,0xc02020],[4.6,-1.9,0xe0b020]].forEach(([dx,dz,c])=>{const d=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.85,10),new THREE.MeshBasicMaterial({color:c}));d.position.set(dx,.43,dz);SG.add(d)});
 const bf=cvT(256,160),g=bf.cv.getContext('2d');g.fillStyle='#4a4e58';g.fillRect(0,0,256,160);g.strokeStyle='#2a2d34';for(let x=0;x<256;x+=16)for(let y=0;y<160;y+=16){g.beginPath();g.arc(x+8,y+8,2,0,7);g.stroke()}
 [['#c02020',20,30,70,14],['#c8c8d0',100,24,12,70],['#e0b020',140,30,80,12],['#2a4a9a',30,80,60,16],['#c8c8d0',120,90,10,50],['#c02020',160,84,50,20]].forEach(([c,x,y,w,h])=>{g.fillStyle=c;g.fillRect(x,y,w,h)});bf.tx.needsUpdate=true;sPlane(3.8,1.3,-1.6,1.7,-RZ+.03,0,bf.tx);
 sbox(-3.6,0,-2.6,3,.9,.7,fmc(0x6a4a2a));sbox(-3.0,.9,-2.6,.6,.35,.4,fmc(0xc02020));
 // spray booth
 sbox(3.4,0,-.1,2.1,.15,2.2,fmc(0x404048));for(const sx of[-1,1])sbox(3.4+sx*1.0,0,-.1,.12,2.1,2.2,fmc(0x909098));sbox(3.4,2.0,-.1,2.3,.15,2.4,fmc(0x909098));
 for(let i=0;i<6;i++)sbox(2.4+(i%2?0:0),i*.35,-1.2,.02,.17,.02,fmc(0xffd020));
 sPlane(2.0,.45,3.4,2.35,1.1,0,txtTex(256,56,'#101010','#ffd020','SPRAY BOOTH',32));
 const nz=new THREE.Mesh(new THREE.BoxGeometry(.12,.12,.4),new THREE.MeshBasicMaterial({color:0x202020}));nz.position.set(3.4,1.3,-.3);SG.add(nz);
 sPlane(1.8,.5,0,2.3,-RZ+.04,0,txtTex(256,64,'#c82020','#fff',"JOE'S GARAGE",34));
 const sp=pSpec(9411,{f:false,gl:false,scarf:null,bp:false,bag:0,old:false,hr:PHR[2],tc:[.1,.25,.55]});window.SHK=personIn(sp,1.2,-2.7,0);gbox(SG,1.2,0,-2.0,2.2,.9,.6,0x6a2a1a);gbox(SG,1.2,.9,-2.0,2.3,.06,.7,0x9a9a9a);IROOM.push([.0,2.4,-2.4,-1.5]);
 IA.push({r:[-3.6,1.0,1.0,3.0],label:'ASK ABOUT TUNING',fn:()=>say('JOE','Drive her into a bay out front, mate. Tuning is done on the ramps.',3600)},{r:[2.0,4.8,1.0,3.0],label:'ASK ABOUT PAINT',fn:()=>say('JOE','Same again, drive her in. Spray, wheels, neon, the lot.',3600)},{r:[-.3,2.7,-1.4,-.9],label:'TALK TO JOE',fn:()=>say('JOE','Tune her up, spray her up. Cash talks, mate.',3600)})}
function garagePaint(){closeShop();leaveShop(true);openGallery('paint')}
CUSTOM_SHOP.garage2=function(msg){document.getElementById('shT').textContent="JOE'S GARAGE";document.getElementById('shMsg').textContent=msg||('YOUR '+CARN[CARI]+'  TOP SPEED '+Math.round(MAXV));
 dRow('SPRAY BOOTH: NEW COLOUR (£'+PAINTP+' EACH, FREE AFTER)',[['OPEN',()=>garagePaint()]]);
 dRow('ENGINE TUNE '+(ENG+1<4?'STAGE '+(ENG+1):'MAXED'),[[ENG>=3?'MAXED':'£'+ENGP[ENG],()=>{if(ENG>=3)return;if(cash<ENGP[ENG])return renderShop('NOT ENOUGH CASH');cash-=ENGP[ENG];ENG++;applyUpg();beep(500,.1,'square',.06);renderShop('ENGINE UPGRADED: FASTER!')},ENG<3&&cash>=ENGP[ENG]]]);
 dRow('GRIP TYRES '+(TYR+1<3?'STAGE '+(TYR+1):'MAXED'),[[TYR>=2?'MAXED':'£'+TYRP[TYR],()=>{if(TYR>=2)return;if(cash<TYRP[TYR])return renderShop('NOT ENOUGH CASH');cash-=TYRP[TYR];TYR++;applyUpg();beep(500,.1,'square',.06);renderShop('TYRES UPGRADED: MORE GRIP')},TYR<2&&cash>=TYRP[TYR]]]);
 dRow('',[['BACK',()=>closeShop()]])};
/* ---- gallery: showroom + paint modes ---- */
GAL.mode=null;GAL.spray=null;
{const gp=document.getElementById('galP'),gx=document.createElement('div');gx.className='r';gx.id='galX';gx.style.cssText='display:none;align-items:center';gx.innerHTML='<span style="flex:1;color:#ffe890;font-size:12px"></span><button style="flex:0 0 auto;background:#2a7a3a;color:#fff;font-weight:700;padding:10px 14px"></button>';gp.insertBefore(gx,gp.firstChild)}
function galXUpd(){const gx=document.getElementById('galX');if(!GAL.mode){gx.style.display='none';return}gx.style.display='flex';const T=gx.children[0],B=gx.children[1],car=galUI.querySelector('button[data-g="car"]').parentNode;
 if(GAL.mode==='show'){car.style.display='flex';const i=CARI,own=OWN.car[i];T.textContent=CARN[i]+' · '+CARSD[i]+' · CASH £'+Math.round(cash);B.textContent=i===GAL.sv.car?'DRIVING':own?'DRIVE THIS':'BUY £'+CPR(i);B.onclick=e=>{e.stopPropagation();if(i===GAL.sv.car)return;if(!own){if(cash<CPR(i)){toast('NOT ENOUGH CASH');return}cash-=CPR(i);OWN.car[i]=1;beep(660,.1,'square',.06);setTimeout(()=>beep(990,.15,'square',.06),120);toast('NEW CAR! '+CARN[i])}GAL.sv.car=i;GAL.sv.paint=paintC;toast('NOW DRIVING: '+CARN[i]);galXUpd()}}
 else{car.style.display='none';const ix=Math.max(0,PCOL.findIndex(c=>c[1]===paintC)),worn=GAL.sv.paint===paintC;T.textContent='SPRAY BOOTH · '+PN[ix]+(OWN.paint[ix]?' · FREE':' · £'+PAINTP)+' · CASH £'+Math.round(cash);B.textContent=GAL.spray?'SPRAYING...':worn?'WORN NOW':'SPRAY IT';B.onclick=e=>{e.stopPropagation();if(GAL.spray||worn)return;const cost=OWN.paint[ix]?0:PAINTP;if(cash<cost){toast('NOT ENOUGH CASH');return}cash-=cost;OWN.paint[ix]=1;GAL.spray={t:0,dur:2.8,ix,col:PCOL[ix][1],old:GAL.sv.paint,applied:0};paintC=GAL.sv.paint;applyPaint();galView(1.5708,.9,8,28);galXUpd()}}}
galUI.addEventListener('click',()=>setTimeout(()=>{if(GAL.mode)galXUpd()},0),true);
{const o0=openGallery;openGallery=function(mode,idx){if(GAL.on)return;GAL.mode=typeof mode==='string'?mode:null;o0();if(GAL.mode==='show'&&idx!=null){setCar(idx);galUI.querySelectorAll('button[data-g="car"]').forEach((b,k)=>b.classList.toggle('on',k===idx))}galXUpd()}}
{const c0=closeGallery;closeGallery=function(){if(!GAL.on)return;if(GAL.spray){sprEnd(1)}c0();GAL.mode=null;galXUpd()}}
{const s0=setCar;setCar=function(i){s0(i);if(GAL.on&&GAL.mode==='show'){galXUpd()}}}
let SPR=null;
function sprEnd(abort){const S=GAL.spray;if(!S)return;if(SPR){galG.remove(SPR.pts);galG.remove(SPR.gun);SPR=null}if(!S.applied){paintC=S.col;applyPaint()}GAL.sv.paint=paintC;GAL.spray=null;if(!abort){toast('RESPRAYED: '+PN[S.ix]);[0,1,2].forEach(k=>setTimeout(()=>beep(600+k*200,.12,'square',.05),k*110))}galXUpd()}
{const g0=updGallery;updGallery=function(dt){g0(dt);const S=GAL.spray;if(!S)return;S.t+=dt;if(!SPR){const geo=new THREE.BufferGeometry(),N=150,pos=new Float32Array(N*3);geo.setAttribute('position',new THREE.BufferAttribute(pos,3));const pts=new THREE.Points(geo,new THREE.PointsMaterial({color:new THREE.Color(PCOL[S.ix][0]),size:.42,transparent:true,opacity:.5,depthWrite:false}));pts.frustumCulled=false;galG.add(pts);const gun=new THREE.Mesh(new THREE.BoxGeometry(.14,.14,.4),new THREE.MeshBasicMaterial({color:0x202024}));galG.add(gun);SPR={pts,gun,N}}
 const p=Math.min(1,S.t/S.dur),side=p<.5?1:-1,q=(p*2)%1,nzp=GZ+(-2+4*q),nx=GX+side*1.8,ny=GY+.85+Math.sin(q*7)*.2;SPR.gun.position.set(nx,ny,nzp);const a=SPR.pts.geometry.attributes.position;for(let i=0;i<SPR.N;i++){const k=Math.random();a.setXYZ(i,nx-side*(k*1.0+.1),ny+(Math.random()-.5)*.35*k,nzp+(Math.random()-.5)*.5*k)}a.needsUpdate=true;
 if(Math.floor(S.t*18)!==Math.floor((S.t-dt)*18))beep(3200+Math.random()*1800,.025,'sawtooth',.012);
 if(!S.applied&&p>.5){S.applied=1;paintC=S.col;applyPaint()}if(S.t>=S.dur)sprEnd(0)}}
/* ---- wrapper ---- */
const CUSTB={'VILLAGE MOTORS':{rx:9.6,fn:buildShowroom},"JOE'S GARAGE":{rx:5.2,fn:buildGarage},'STRIKE BOWL':{rx:8,fn:o=>buildBowl(o)}};
{const b0=buildShop;buildShop=function(o){const c=CUSTB[o.t];if(c)o.rx=c.rx;b0(o);if(c){while(SG.children.length>9)SG.remove(SG.children[SG.children.length-1]);c.fn(o)}}}
/* ---- STRIKE BOWL: 3D bowling alley + game ---- */
var BOWLS={best:0,n:0,g:0},BW=null,BWM=null;
const BFX=-5.5,BLEN=9.0,BPR=.078,BBR=.115,BZC=[-1.35,0,1.35],BPS=(()=>{const a=[];for(let r=0;r<4;r++)for(let c=0;c<=r;c++)a.push([BLEN+r*.343,(c-r/2)*.396]);return a})();
function bowlPinGeo(){const s=1.3,P=[[0,0],[.038,0],[.0455,.012],[.052,.04],[.061,.1],[.056,.15],[.0285,.235],[.0295,.27],[.0375,.31],[.036,.345],[.02,.375],[0,.382]].map(p=>new THREE.Vector2(p[0]*s,p[1]*s)),g=new THREE.LatheGeometry(P,10),pos=g.attributes.position,col=new Float32Array(pos.count*3);
 for(let i=0;i<pos.count;i++){const y=pos.getY(i)/s,st=y>.238&&y<.28,sh=.78+.22*(y/.38);col[i*3]=(st?.85:.97)*sh;col[i*3+1]=(st?.1:.97)*sh;col[i*3+2]=(st?.1:.95)*sh}g.setAttribute('color',new THREE.BufferAttribute(col,3));return g}
function bowlLaneTex(){const cv=document.createElement('canvas');cv.width=1024;cv.height=64;const g=cv.getContext('2d');g.fillStyle='#e0b070';g.fillRect(0,0,1024,64);for(let i=0;i<39;i++){g.fillStyle=i%2?'rgba(140,90,30,.16)':'rgba(255,230,170,.18)';g.fillRect(0,i*64/39,1024,64/39)}
 g.fillStyle='#c8905a';g.fillRect(790,0,234,64);g.fillStyle='rgba(120,70,20,.55)';for(let i=0;i<7;i++){const x=300+i*60;g.beginPath();g.moveTo(x,32-(3-Math.abs(i-3))*4*1.0-(i<4?0:0));g.moveTo(x,10+Math.abs(i-3)*7);g.lineTo(x+18,20+Math.abs(i-3)*5);g.lineTo(x,30+Math.abs(i-3)*3);g.fill()}
 g.fillStyle='#d02020';g.fillRect(151,0,5,64);g.fillStyle='rgba(60,30,10,.6)';for(let i=0;i<7;i++)g.fillRect(122,6+i*8.5,3,3);const t=new THREE.CanvasTexture(cv);t.anisotropy=4;return t}
function bowlBallTex(){const cv=document.createElement('canvas');cv.width=128;cv.height=64;const g=cv.getContext('2d');g.fillStyle='#4a1a8a';g.fillRect(0,0,128,64);for(let i=0;i<30;i++){g.strokeStyle='hsla('+(260+Math.random()*80)+',80%,'+(40+Math.random()*30)+'%,.5)';g.lineWidth=2+Math.random()*3;g.beginPath();g.moveTo(Math.random()*128,Math.random()*64);g.bezierCurveTo(Math.random()*128,Math.random()*64,Math.random()*128,Math.random()*64,Math.random()*128,Math.random()*64);g.stroke()}const t=new THREE.CanvasTexture(cv);t.minFilter=t.magFilter=THREE.LinearFilter;t.generateMipmaps=false;return t}
function buildBowl(o){IA.splice(0,IA.length,LEAVE_IA());IROOM.splice(0,IROOM.length,[-9,9,-4.2,-2.3],[BFX,7.5,-2.1,2.05]);
 const lt=bowlLaneTex(),lm=new THREE.MeshBasicMaterial({map:lt}),gm=new THREE.MeshBasicMaterial({color:0x1c2028}),pm=new THREE.MeshBasicMaterial({color:0x050508});window.BPINS=[];
 const pgeo=bowlPinGeo(),pmat=new THREE.MeshBasicMaterial({vertexColors:true});
 BZC.forEach((zc,L)=>{const ln=new THREE.Mesh(new THREE.PlaneGeometry(12.9,.9).rotateX(-Math.PI/2),lm);ln.position.set(-.95,.012,zc);SG.add(ln);
  for(const sg of[-1,1]){const gu=new THREE.Mesh(new THREE.PlaneGeometry(12.9,.2).rotateX(-Math.PI/2),gm);gu.position.set(-.95,.004,zc+sg*.55);SG.add(gu);const kb=sbox(-.95,0,zc+sg*.66,12.9,.1,.06,fmc(0x2a2a34))}
  const pit=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.3).rotateX(-Math.PI/2),pm);pit.position.set(6.2,.006,zc);SG.add(pit);
  const pins=[];BPS.forEach(([u,v])=>{const m=new THREE.Mesh(pgeo,pmat);m.position.set(BFX+u,.012,zc+v);SG.add(m);pins.push(m)});BPINS.push(pins);
  const nn=new THREE.Mesh(new THREE.BoxGeometry(12.9,.04,.05),new THREE.MeshBasicMaterial({color:L%2?0xff40d0:0x40e8ff}));nn.position.set(-.95,2.5,zc);SG.add(nn)});
 sbox(7.2,0,0,.5,2.6,5,fmc(0x1c1034));for(let i=0;i<5;i++)sbox(6.93,.4+i*.45,0,.04,.12,4.6,fmc(i%2?0xff40d0:0x40e8ff));
 const mon=cvT(512,128);window.BMON=mon;sPlane(3.8,.95,6.9,2.15,0,-Math.PI/2,mon.tx);
 sbox(3.0,0,-2.85,5.2,1.0,.7,fmc(0x2a1a4a));sbox(3.0,1.0,-2.85,5.3,.06,.8,fmc(0xffd040));
 const sp=pSpec(9511,{f:true,gl:false,scarf:null,bp:false,bag:0,old:false,tc:[.55,.1,.6]});window.SHK=personIn(sp,2.0,-3.0,0);
 for(let i=0;i<8;i++){const bb=new THREE.Mesh(new THREE.SphereGeometry(.12,8,6),new THREE.MeshBasicMaterial({color:[0x7a2ac0,0xc02020,0x2060c0,0x20a050][i%4]}));bb.position.set(4.6+(i%4)*.3,1.15,-2.85+(i>>2)*.0);SG.add(bb)}
 sPlane(3.2,.9,-RX+.03,1.9,0,Math.PI/2,txtTex(384,108,'#2a0a4a','#ffe040','STRIKE!',70));
 for(const z of[-2.6,1.4])sbox(-7.5,0,z,.6,.45,1.0,fmc(0x7a2a8a));
 const gl=new THREE.Group();
 BZC.forEach((zc,L)=>{IA.push({r:[-7.9,BFX+.3,zc-.7,zc+.7],label:'BOWL LANE '+(L+1)+' (£3)',fn:()=>bowlOpen(L)})});
 IA.push({r:[1.0,5.2,-2.2,-1.6],label:'TALK TO SHEILA',fn:()=>say('SHEILA','Three quid a game. Hit a turkey and I will clap.',3800)});
 bowlScoreDraw(BMON.cv,null)}
/* ---- scoring ---- */
function bScore(r){const res=[];let i=0;for(let f=0;f<10;f++){const a=r[i],b=r[i+1],c=r[i+2];if(f<9){if(a===10){res.push({t:[10],s:(b!=null&&c!=null)?10+b+c:null});i+=1}else{const t=a!=null?[a]:[];if(b!=null)t.push(b);let s=null;if(b!=null){if(a+b===10)s=c!=null?10+c:null;else s=a+b}res.push({t,s});i+=2}}
  else{const t=r.slice(i,i+3);let s=null;const need=(a===10||(a!=null&&b!=null&&a+b===10))?3:2;if(t.length>=need)s=t.reduce((x,y)=>x+y,0);res.push({t,s})}}
 let run=0,stop=0;for(const fr of res){if(stop||fr.s==null){fr.c=null;stop=1;continue}run+=fr.s;fr.c=run}return res}
function bowlScoreDraw(cv,rolls){const g=cv.getContext('2d'),W=cv.width,H=cv.height,res=bScore(rolls||[]),cw=(W-0)/10.6;g.fillStyle='#10102a';g.fillRect(0,0,W,H);g.textAlign='center';g.textBaseline='middle';
 const sym=(t,k,f)=>{const v=t[k];if(v==null)return'';if(f<9){if(k===0)return v===10?'X':v===0?'-':''+v;return t[0]+v===10?'/':v===0?'-':''+v}if(k===0)return v===10?'X':v===0?'-':''+v;if(k===1){if(t[0]===10)return v===10?'X':v===0?'-':''+v;return t[0]+v===10?'/':v===0?'-':''+v}if(t[1]===10||t[0]===10&&t[1]!=null&&t[1]<10&&0)return v===10?'X':v===0?'-':''+v;return(t[0]===10&&t[1]+v===10)?'/':v===10?'X':v===0?'-':''+v};
 for(let f=0;f<10;f++){const x=f*cw+2,w=f<9?cw-3:cw*1.6-3;g.strokeStyle='#8a8ae0';g.lineWidth=2;g.strokeRect(x,2,w,H-4);g.fillStyle='#8890d0';g.font='bold '+Math.round(H*.17)+'px monospace';g.fillText(''+(f+1),x+10,H*.13);
  const fr=res[f],nb=f<9?2:3;for(let k=0;k<nb;k++){const bx=x+w-(nb-k)*(H*.3),by=H*.14,s=sym(fr.t,k,f);g.strokeStyle='#8a8ae0';g.lineWidth=1;g.strokeRect(bx,by-H*.11,H*.3-1,H*.3);g.fillStyle=s==='X'||s==='/'?'#ff6060':'#fff';g.font='bold '+Math.round(H*.26)+'px monospace';g.fillText(s,bx+H*.15,by+H*.04)}
  if(fr.c!=null){g.fillStyle='#ffe040';g.font='bold '+Math.round(H*.34)+'px monospace';g.fillText(''+fr.c,x+w/2,H*.72)}}
 const tot=res[9].c!=null?res[9].c:(res.filter(r=>r.c!=null).pop()||{c:0}).c;g.fillStyle='#40ff80';g.font='bold '+Math.round(H*.4)+'px monospace';g.fillText(''+tot,W-cw*.42,H*.55);if(window.BMON&&cv===BMON.cv)BMON.tx.needsUpdate=true}
/* ---- game ---- */
function bowlOpen(L){if(BW)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;document.body.classList.add('dz');man.visible=false;
 const stake=cash>=3?3:0;if(stake)cash-=3;BOWLS.n++;
 const ov=document.createElement('div');ov.id='bwov';ov.style.cssText='position:fixed;inset:0;z-index:60;font:bold 13px monospace;color:#fff;touch-action:none;user-select:none;-webkit-user-select:none';
 const sc=document.createElement('canvas');sc.width=530;sc.height=74;sc.style.cssText='position:absolute;left:50%;top:4px;transform:translateX(-50%);width:'+Math.min(innerWidth-12,530)+'px;pointer-events:none;border-radius:6px;opacity:.92';
 const msg=document.createElement('div');msg.id='bwM';msg.style.cssText='position:absolute;left:0;right:0;top:'+(Math.min(innerWidth-12,530)*74/530+10)+'px;text-align:center;font-size:20px;color:#ffd840;text-shadow:2px 2px 0 #000;pointer-events:none';
 const hint=document.createElement('div');hint.id='bwH';hint.style.cssText='position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:13px;color:#9fe;text-shadow:1px 1px 0 #000;pointer-events:none';hint.textContent='SWIPE UP TO THROW · CURVE THE SWIPE FOR HOOK';
 const bs='position:absolute;font:bold 16px monospace;border:3px solid #f5e6a0;border-radius:10px;color:#fff;touch-action:manipulation;pointer-events:auto;';
 const mk=(t,css,fn)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText=bs+css;b.onclick=fn;return b};
 const lv=mk('LEAVE','right:8px;bottom:12px;font-size:12px;padding:8px 10px;background:#333',()=>bowlClose(1));
 const mv=d=>{const b=mk(d<0?'◀':'▶',(d<0?'left:10px':'left:68px')+';bottom:12px;padding:12px 16px;font-size:20px;background:#335',()=>{});b.onpointerdown=e=>{e.stopPropagation();BW.mvd=d;try{b.setPointerCapture(e.pointerId)}catch(_){}};b.onpointerup=b.onpointercancel=()=>{BW.mvd=0};return b};
 ov.append(sc,msg,hint,lv,mv(-1),mv(1));document.body.append(ov);
 const B=BW={ov,sc,L,zc:BZC[L],f:0,b:0,rolls:[],i10:0,stand:10,ph:'zoom',t:0,stake,v:0,mvd:0,last:performance.now(),cp:[0,0,0],cl:[0,0,0],pins:[],ball:{on:0,u:0,v:0,vu:0,vv:0,hook:0,gut:0}};
 BW.pins=BPS.map((s,k)=>({k,x:s[0],y:s[1],vx:0,vy:0,up:1,gone:0,fa:0,m:BPINS[L][k],ax:[1,0]}));
 for(let l=0;l<3;l++)if(l!==L)BPINS[l].forEach(m=>m.visible=true);
 const bm=new THREE.Mesh(new THREE.SphereGeometry(BBR,14,10),new THREE.ShaderMaterial({uniforms:{map:{value:bowlBallTex()}},vertexShader:BALLVS,fragmentShader:BALLFS}));bm.visible=false;SG.add(bm);B.ball.m=bm;
 const cur={a:0,t:0,pts:[]};B.sw=cur;
 ov.onpointerdown=e=>{if(B.ph!=='aim'||e.target.tagName==='BUTTON')return;cur.on=1;cur.pts=[[e.clientX,e.clientY,performance.now()]];try{ov.setPointerCapture(e.pointerId)}catch(_){}};
 ov.onpointermove=e=>{if(cur.on)cur.pts.push([e.clientX,e.clientY,performance.now()])};
 ov.onpointerup=e=>{if(!cur.on)return;cur.on=0;cur.pts.push([e.clientX,e.clientY,performance.now()]);bowlSwipe(cur.pts)};
 B.kd=e=>{if(e.key===' '&&B.ph==='aim')bowlThrow(0,0,8,0);if(e.key==='ArrowLeft')B.mvd=-1;if(e.key==='ArrowRight')B.mvd=1};B.ku=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight')B.mvd=0};addEventListener('keydown',B.kd);addEventListener('keyup',B.ku);
 bowlResetPins(1);bowlScoreDraw(sc,[]);bowlCamSet();DZ.fn=bowlCam;DZ.fov=54;DZ.tp=bowlCam();DZ.look=new THREE.Vector3();DZ.on=1;bowlCam();
 B.raf=requestAnimationFrame(bowlLoop)}
function bowlMsg(t,ms){const e=document.getElementById('bwM');if(e){e.textContent=t;BW.mt=ms||2000}}
function bowlSwipe(p){const B=BW;if(B.ph!=='aim'||p.length<3)return;const a=p[0],z=p[p.length-1],dy=a[1]-z[1],dx=z[0]-a[0],dt=Math.max(30,z[2]-a[2]);if(dy<50)return;const sp=dy/dt,mid=p[Math.floor(p.length/2)],dev=mid[0]-(a[0]+z[0])/2,vel=Math.max(4.5,Math.min(10.5,4.2+sp*3.2)),ang=Math.max(-.07,Math.min(.07,Math.atan2(dx,dy)*.22)),hook=Math.max(-1,Math.min(1,dev/55));bowlThrow(ang,hook,vel,1)}
function bowlThrow(ang,hook,vel){const B=BW;if(B.ph!=='aim')return;const bl=B.ball;bl.on=1;bl.u=0;bl.v=B.v;bl.vu=vel*Math.cos(ang);bl.vv=vel*Math.sin(ang);bl.hook=hook;bl.gut=0;bl.m.visible=true;B.ph='roll';B.t=0;B.standBefore=B.pins.filter(p=>p.up&&!p.gone).length;document.getElementById('bwH').textContent='';beep(130,.35,'sawtooth',.05)}
function bowlResetPins(all){const B=BW;for(const p of B.pins){if(all||(p.up&&!p.gone)){if(all){p.x=BPS[p.k][0];p.y=BPS[p.k][1];p.up=1;p.gone=0}}else{p.gone=1;p.up=0}p.vx=p.vy=0;p.fa=0;if(p.up&&!p.gone){p.m.visible=true;p.m.quaternion.set(0,0,0,1);p.m.position.set(BFX+p.x,.012,B.zc+p.y)}else p.m.visible=false}}
function bowlCamSet(){const B=BW,t=bowlCamTgt();B.cp=t[0].slice();B.cl=t[1].slice()}
function bowlCamTgt(){const B=BW,bl=B.ball;let ep,lp;if(B.ph==='aim'||B.ph==='zoom'||B.ph==='sweep'||B.ph==='done'){ep=[BFX-2.0,1.15,B.zc+B.v*.7];lp=[BFX+8.5,.15,B.zc+B.v*.1]}
 else{const u=Math.min(bl.on?bl.u:BLEN,BLEN-3.2);ep=[BFX+Math.max(-2,u-2.0),1.0-Math.min(.2,u*.03),B.zc+(bl.on?bl.v*.6:0)];lp=[BFX+BLEN+.6,.22,B.zc]}return[ep,lp]}
function bowlCam(){const B=BW;if(!B)return new THREE.Vector3();DZ.look=SG.localToWorld(new THREE.Vector3(B.cl[0],B.cl[1],B.cl[2]));return SG.localToWorld(new THREE.Vector3(B.cp[0],B.cp[1],B.cp[2]))}
function bowlLoop(now){const B=BW;if(!B)return;const dt=Math.min(.05,(now-B.last)/1000);B.last=now;bowlStep(dt);const[ep,lp]=bowlCamTgt(),k=1-Math.exp(-dt*(B.ph==='roll'?3.5:5));for(let i=0;i<3;i++){B.cp[i]+=(ep[i]-B.cp[i])*k;B.cl[i]+=(lp[i]-B.cl[i])*k}B.raf=requestAnimationFrame(bowlLoop)}
function bowlStep(dt){const B=BW;if(B.mt>0){B.mt-=dt*1000;if(B.mt<=0){const e=document.getElementById('bwM');if(e)e.textContent=''}}
 if(B.ph==='zoom'){if(DZ.k>=.97){B.ph='aim';bowlMsg('FRAME 1 · SWIPE UP FROM THE BOTTOM TO ROLL',3500)}}
 if(B.ph==='aim'){if(B.mvd){B.v=Math.max(-.32,Math.min(.32,B.v+B.mvd*dt*.35))}const m=B.ball.m;m.visible=true;m.position.set(BFX-.2,BBR,B.zc+B.v);B.ball.u=0}
 if(B.ph==='roll'){B.t+=dt;bowlPhys(dt);const mv=B.pins.some(p=>(p.up||!p.gone)&&Math.hypot(p.vx,p.vy)>.04);if((!B.ball.on&&!mv&&B.t>.8)||B.t>9){B.ph='settle';B.t=0}}
 if(B.ph==='settle'){B.t+=dt;if(B.t>.7)bowlRollDone()}
 if(B.ph==='sweep'){B.t+=dt;if(B.t>1.1){B.ph=B.over?'done':'aim';if(B.over)bowlEnd();else{document.getElementById('bwH').textContent='SWIPE UP TO THROW'}B.ball.m.visible=B.ph==='aim'}}
 for(const p of B.pins){if(p.gone&&p.fa>=1){p.m.visible=false;continue}if(!p.up&&p.fa<1){p.fa=Math.min(1,p.fa+dt*3.2)}if(p.m.visible){const ang=p.fa*1.48;if(p.fa>0){const d=p.ax;const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(d[1],0,-d[0]).normalize(),ang);p.m.quaternion.copy(q);p.m.position.set(BFX+p.x,.012+Math.sin(ang)*.075,B.zc+p.y)}else p.m.position.set(BFX+p.x,.012,B.zc+p.y)}}
 const bl=B.ball;if(B.ph==='roll'&&bl.on)bl.m.position.set(BFX+bl.u,BBR,B.zc+bl.v)}
function bowlPhys(dt){const B=BW,bl=B.ball,P=B.pins;let clk=0;for(let s=0;s<6;s++){const h=dt/6;
 if(bl.on){if(!bl.gut&&bl.u>3)bl.vv+=bl.hook*.9*h;bl.u+=bl.vu*h;bl.v+=bl.vv*h;bl.m.rotation.z-=bl.vu*h/BBR;if(!bl.gut&&Math.abs(bl.v)>.47){bl.gut=1;bl.v=Math.sign(bl.v)*.56;bl.vv=0;bl.hook=0;bowlMsg('GUTTER BALL...',1500)}if(bl.u>BLEN+1.5){bl.on=0;bl.m.visible=false}}
 for(const p of P){if(p.gone)continue;const sp=Math.hypot(p.vx,p.vy);if(sp>0){const f=Math.exp(-1.7*h);p.vx*=f;p.vy*=f;if(sp<.03){p.vx=p.vy=0}p.x+=p.vx*h;p.y+=p.vy*h}
  if(p.x>BLEN+1.3||Math.abs(p.y)>.6){p.gone=1;if(p.up){p.up=0;p.ax=[p.vx||1,p.vy||0]}p.fa=Math.max(p.fa,.99);setTimeout(()=>{},0)}
  if(bl.on&&!bl.gut&&p.x<BLEN+1.3){const dx=p.x-bl.u,dy=p.y-bl.v,d2=dx*dx+dy*dy,m=BBR+BPR;if(d2<m*m&&d2>1e-9){const d=Math.sqrt(d2),nx=dx/d,ny=dy/d,rv=(p.vx-bl.vu)*nx+(p.vy-bl.vv)*ny;p.x+=nx*(m-d);p.y+=ny*(m-d);if(rv<0){const j=-(1.55)*rv/(1/6+1/1.5);bl.vu-=j/6*nx;bl.vv-=j/6*ny;p.vx+=j/1.5*nx;p.vy+=j/1.5*ny;if(p.up){p.up=0;p.ax=[nx,ny]}clk=Math.max(clk,Math.min(1,-rv/5))}}}}
 for(let i=0;i<10;i++){const A=P[i];if(A.gone)continue;for(let j=i+1;j<10;j++){const C=P[j];if(C.gone)continue;const dx=C.x-A.x,dy=C.y-A.y,d2=dx*dx+dy*dy,m=2*BPR;if(d2<m*m&&d2>1e-9){const d=Math.sqrt(d2),nx=dx/d,ny=dy/d,rv=(C.vx-A.vx)*nx+(C.vy-A.vy)*ny,ov=(m-d)/2;A.x-=nx*ov;A.y-=ny*ov;C.x+=nx*ov;C.y+=ny*ov;if(rv<0){const j2=-(1.5)*rv/2;A.vx-=j2*nx;A.vy-=j2*ny;C.vx+=j2*nx;C.vy+=j2*ny;if(-rv>.35){for(const q of[A,C])if(q.up){q.up=0;q.ax=[nx*(q===C?1:-1),ny*(q===C?1:-1)]}}clk=Math.max(clk,Math.min(1,-rv/3))}}}}}
 const now=performance.now();if(clk&&now-(B.ck||0)>50){B.ck=now;beep(500+Math.random()*700,.04,'square',Math.min(.06,.02+.04*clk))}
 if(bl.on&&Math.floor(B.t*14)!==Math.floor((B.t-dt)*14))beep(70+bl.vu*4,.05,'sawtooth',.012)}
function bowlRollDone(){const B=BW,stand=B.pins.filter(p=>p.up&&!p.gone).length,k=B.standBefore-stand;B.rolls.push(k);const f=B.f;let reset=0,over=0;
 if(f<9){if(B.b===0){if(k===10){B.f++;reset=1}else B.b=1}else{B.f++;B.b=0;reset=1}}
 else{const t=B.rolls.slice(B.i10);if(t.length===1){if(t[0]===10)reset=1}else if(t.length===2){if(t[0]===10){if(t[1]===10)reset=1}else if(t[0]+t[1]===10)reset=1;else over=1}else over=1;B.b=t.length}
 if(B.f===9&&B.i10===0&&f<9){B.i10=B.rolls.length}
 const strike=k===10&&(f<9?B.b===0||true:true)&&B.standBefore===10,spare=!strike&&stand===0;bowlMsg(strike?'STRIKE!':spare?'SPARE!':k===0?'MISS...':k+' DOWN',2200);
 if(strike){[0,1,2].forEach(i=>setTimeout(()=>beep(700+i*250,.12,'square',.06),i*110))}else if(spare)beep(900,.15,'square',.06);
 bowlScoreDraw(B.sc,B.rolls);if(window.BMON)bowlScoreDraw(BMON.cv,B.rolls);
 B.v=B.v*.5;B.over=over;B.ph='sweep';B.t=0;B.ball.m.visible=false;
 setTimeout(()=>{if(!BW)return;if(reset||over){bowlResetPins(1);B.standBefore=10}else{bowlResetPins(0);B.standBefore=B.pins.filter(p=>p.up&&!p.gone).length}
  if(f<9&&B.f===9&&B.i10===0)B.i10=B.rolls.length;if(!over){bowlMsg(B.f===9?'FRAME 10':'FRAME '+(B.f+1),1800)}},700)}
function bowlEnd(){const B=BW,sc=bScore(B.rolls),tot=sc[9].c||0;BOWLS.g++;let w=0;if(B.stake){w=tot>=300?50:tot>=250?20:tot>=200?12:tot>=150?7:tot>=100?3:0;cash+=w}let nb=tot>BOWLS.best;if(nb)BOWLS.best=tot;
 const d=document.createElement('div');d.style.cssText='position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);text-align:center;background:rgba(0,0,0,.78);border:3px solid #f5e6a0;border-radius:12px;padding:14px 20px;pointer-events:auto;font-size:15px';
 d.innerHTML='<div style="font-size:24px;color:#ffd840;margin-bottom:6px">SCORE '+tot+'</div><div style="color:#cde;margin-bottom:4px">'+(B.stake?(w?'PRIZE £'+w:'NO PRIZE (100+ PAYS)'):'PRACTICE GAME')+'</div><div style="font-size:12px;color:#9ab;margin-bottom:10px">'+(nb?'NEW PERSONAL BEST! ':'BEST '+BOWLS.best)+' · GAMES '+BOWLS.g+'</div>';
 const bt2=(x,fn,c)=>{const b=document.createElement('button');b.textContent=x;b.style.cssText='font:bold 14px monospace;padding:10px 14px;margin:4px;border:3px solid #f5e6a0;border-radius:10px;color:#fff;background:'+c;b.onclick=fn;return b};
 d.append(bt2('PLAY AGAIN (£3)',()=>{const L=B.L;bowlClose(0);bowlOpen(L)},'#2a7a3a'),bt2('LEAVE',()=>bowlClose(0),'#333'));B.ov.append(d);if(tot>=200)toast('WHAT A GAME! '+tot);if(tot>=300)toast('PERFECT GAME!!')}
function bowlClose(q){const B=BW;if(!B)return;cancelAnimationFrame(B.raf);removeEventListener('keydown',B.kd);removeEventListener('keyup',B.ku);B.ov.remove();if(q&&B.ph!=='done'&&B.stake)toast('YOU WALKED OFF. STAKE LOST');if(B.ball.m)SG.remove(B.ball.m);BW=null;
 BPINS.forEach(pp=>pp.forEach((m,k)=>{m.visible=true;m.quaternion.set(0,0,0,1)}));BPINS.forEach((pp,l)=>pp.forEach((m,k)=>m.position.set(BFX+BPS[k][0],.012,BZC[l]+BPS[k][1])));
 DZ.fn=null;DZ.fov=46;DZ.on=0;document.body.classList.remove('dz');man.visible=true;DZ.exit=1}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.bl=BOWLS;return o};cozyLoad=function(z){l0(z);if(z&&z.bl)BOWLS=z.bl}}
/* interior door trim */
{const b0=buildShop;buildShop=function(o){b0(o);try{const zd=RZ-.06,dx=1.6,B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex));
 for(const sg of[-1,1])B(dx+sg*.62,0,zd,.14,2.3,.1,0xf4f4ee);B(dx,2.2,zd,1.4,.14,.12,0xf4f4ee);B(dx,2.34,zd,1.55,.06,.16,0xf4f4ee);
 B(dx-.38,.95,zd-.04,.1,.1,.08,0xe6b83c);B(dx-.38,.88,zd-.02,.1,.24,.03,0xe6b83c);B(dx,0,zd-.35,1.0,.025,.65,0x5a1a1a);B(dx,0,zd-.35,.9,.03,.55,0x7a2a22);
 B(dx,2.48,zd-.02,.7,.16,.04,0x1a6a2a)}catch(e){}}}
