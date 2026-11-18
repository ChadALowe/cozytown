/* ---- first-person view: CAM button / C key cycles to it (4th camera) ---- */
(function(){
CAMS.push({d:0,h:1.2,f:76,fp:1});
const FPI=CAMS.length-1,HGT=[1.12,1.08,1.5,1.45,.92,1.2],SEAT=-.34;
const dash=document.createElement('div');
dash.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:0;display:none;overflow:hidden';
{const h=document.getElementById('hud');h?h.parentNode.insertBefore(dash,h):document.body.appendChild(dash)}
// helpers for drawing dash detail in screen-% coordinates
const R=(x,y,w,h,bg,rad,ex)=>`<div style="position:absolute;left:${x}%;top:${y}%;width:${w}%;height:${h}%;background:${bg};border-radius:${rad||0};${ex||''}"></div>`;
const DL=(x,y,d,k,face,tick,red)=>`<div class="fd" data-k="${k}" style="position:absolute;left:${x}%;top:${y}%;width:${d}vmin;height:${d}vmin;margin:-${d/2}vmin 0 0 -${d/2}vmin;border-radius:50%;background:radial-gradient(circle,${face} 0 66%,transparent 67%),repeating-conic-gradient(from -2deg,${tick} 0 1.4deg,transparent 1.4deg 13deg),${face};box-shadow:0 0 0 .5vmin #050505,inset 0 0 1.2vmin #000">${red?`<div style="position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 130deg,transparent 0 215deg,#c8281c 215deg 255deg,transparent 255deg);-webkit-mask:radial-gradient(circle,transparent 0 76%,#000 77% 86%,transparent 87%);mask:radial-gradient(circle,transparent 0 76%,#000 77% 86%,transparent 87%)"></div>`:''}<i style="position:absolute;left:50%;top:50%;width:44%;height:.45vmin;margin-top:-.22vmin;background:#e8431f;transform-origin:0 50%;transform:rotate(130deg);box-shadow:0 0 .5vmin #000"></i><b style="position:absolute;left:50%;top:50%;width:18%;height:18%;margin:-9% 0 0 -9%;border-radius:50%;background:#222"></b></div>`;
const VT=(x,y,d,ring,face)=>`<div style="position:absolute;left:${x}%;top:${y}%;width:${d}vmin;height:${d}vmin;margin:-${d/2}vmin 0 0 -${d/2}vmin;border-radius:50%;background:radial-gradient(circle,#050505 0 28%,${face||'#1b1c1f'} 30% 70%,${ring} 72%);box-shadow:0 0 0 .3vmin #000"></div>`;
const SCR=(x,y,w,h,glow,rad)=>R(x,y,w,h,'#07090c',rad||'.6vmin','box-shadow:0 0 0 .5vmin #0b0b0c')+R(x+w*.06,y+h*.08,w*.88,h*.84,glow,'.4vmin','opacity:.85');
const KN=(x,y,d,c)=>`<div style="position:absolute;left:${x}%;top:${y}%;width:${d}vmin;height:${d}vmin;margin:-${d/2}vmin 0 0 -${d/2}vmin;border-radius:50%;background:radial-gradient(circle at 40% 35%,${c||'#777'},#222);box-shadow:0 0 0 .35vmin #111"></div>`;
const BTN=(x,y,w,h,c)=>R(x,y,w,h,c||'#3a3c42','.3vmin','box-shadow:0 0 0 .2vmin #000');
const DET={
 // Citroën C1 (2014 Mk2): single big round speedo in a binnacle on the column, floating centre screen, ball vents
 C1:()=>R(0,63,100,3,'#9aa0a8',0,'opacity:.55')+R(41,70,18,22,'#26282c','45% 45% 0 0')+DL(50,82,14,'spd','#e9e9e4','#444')+DL(59,86,6.5,'rpm','#d8d8d2','#555')
  +R(24,56,18,10,'#141518','1.4vmin','box-shadow:0 0 0 .5vmin #5c5f66')+R(25.4,57.4,15.2,7.2,'#1b3b5a','.9vmin','opacity:.9')+VT(30,76,7.5,'#c9ccd1')+VT(14,70,7,'#c9ccd1')+R(22,70,10,13,'#17181b','1.4vmin')+KN(24.5,76,3.4)+KN(30,76,3.4)+KN(35.5,76,3.4),
 // Ford Fiesta Mk7 facelift: twin dials with LCD between, vertical centre stack with buttons + display
 FIESTA:()=>R(38,69,24,18,'#17181b','4vmin 4vmin 0 0')+DL(45,82,13,'rpm','#15161a','#ddd',1)+DL(55,82,13,'spd','#15161a','#ddd')+R(48.2,77,3.6,5,'#243b2a','.3vmin')
  +R(19,60,20,40,'#25282d','1.4vmin 1.4vmin 0 0','transform:skewX(-3deg)')+R(22,62,14,8,'#0b0e10','.5vmin')+R(23,63,12,6,'#2a4a6a','.3vmin')+BTN(22,72,4,3)+BTN(27,72,4,3)+BTN(32,72,4,3)+BTN(22,76,4,3)+BTN(27,76,4,3)+BTN(32,76,4,3)+KN(23,87,4.4)+KN(29,87,4.4)+KN(35,87,4.4)+VT(15,70,7,'#8d9096')+VT(24,57,4.6,'#8d9096')+VT(31,57,4.6,'#8d9096'),
 // Peugeot Partner / Berlingo-style van: i-Cockpit (instrument panel seen over a small wheel), 8" touchscreen, wide dash
 VAN:()=>R(34,73,32,10,'#0c0d10','1.4vmin','box-shadow:0 0 0 .5vmin #26282c')+DL(42,78,7.5,'spd','#0c0d10','#aab')+R(48,75,10,6,'#1d3a52','.4vmin')+DL(61,78,5.5,'rpm','#0c0d10','#aab')
  +R(22,60,20,13,'#09090b','1vmin','box-shadow:0 0 0 .5vmin #4a4d54')+R(23,61.4,18,10.2,'#1e4668','.7vmin','opacity:.9')+R(18,74,28,5,'#2c2e33','.8vmin')+BTN(21,75,3,3)+BTN(25,75,3,3)+BTN(29,75,3,3)+BTN(33,75,3,3)+BTN(37,75,3,3)+R(10,64,10,4,'#202226','.5vmin')+R(70,66,24,8,'#363940','.8vmin'),
 // Land Rover Defender (Puma-era 90): flat shelf dash, two big dials in a square binnacle, switch panel + heater knobs
 DEFENDER:()=>R(0,62,100,2.4,'#3a4630',0,'')+R(32,66,36,24,'#1d1f1a','.6vmin')+DL(44,80,16,'spd','#14150f','#dcd7b8')+DL(58,80,10,'rpm','#14150f','#dcd7b8')+R(11,72,18,13,'#2a2e25','.6vmin')+KN(14.5,79,3.2)+KN(20,79,3.2)+KN(25.5,79,3.2)+BTN(13,73,3,2.2)+BTN(17,73,3,2.2)+BTN(21,73,3,2.2)+BTN(25,73,3,2.2)
  +VT(7,66,6.5,'#2a2a2a')+VT(32,64,5.5,'#2a2a2a')+R(70,70,26,6,'#242720','.5vmin'),
 // Mazda MX-5 (ND): hooded 3-dial binnacle (big rev counter centre, speedo right, info display left), round vents, floating screen, three rotary climate dials
 MX5:()=>R(33,78,32,16,'#0d0d0e','6vmin 6vmin 0 0')+DL(49,89,11.5,'rpm','#101113','#e6e6e6',1)+DL(60,90,9,'spd','#101113','#e6e6e6')+R(35,84,8.5,8,'#0a1620','1vmin','box-shadow:0 0 0 .3vmin #444')+R(36.2,85.4,6,4,'#2b6a50','.3vmin')
  +SCR(28,62,16,10,'#274a6c')+VT(11,76,8,'#d78a2c')+VT(48,76,6,'#d78a2c')+R(43,81,2,7,'#15161a','.4vmin')+KN(27,86,3.8,'#aaa')+KN(33,86,3.8,'#aaa')+KN(39,86,3.8,'#aaa')+BTN(21,81,3.2,2.4,'#b02a20')+BTN(24.6,81,3.2,2.4),
 // Volvo V60 (2018+): 12.3" digital driver display, light-wood ribbon, portrait touchscreen between vertical vents
 V60:()=>R(0,63.2,100,1.6,'#b89a72',0,'opacity:.85')+R(33,72,34,17,'#05080c','1.4vmin','box-shadow:0 0 0 .4vmin #1d2024')+DL(43,80.5,9,'spd','#0b1118','#7fb0d8')+DL(57,80.5,9,'rpm','#0b1118','#7fb0d8')+R(47.8,74,4.4,12,'#16384f','.3vmin')
  +R(19,64,3,26,'#1a1c20','.4vmin','box-shadow:0 0 0 .3vmin #888')+R(33.5,64,3,26,'#1a1c20','.4vmin','box-shadow:0 0 0 .3vmin #888')+SCR(23,60,10,30,'#2a6a9a')+BTN(24,92,2.6,2.4)+BTN(27,92,2.6,2.4)+BTN(30,92,2.6,2.4)+R(5,66,10,5,'#23262b','.5vmin')
};
// per-car cockpit: pillars, roof header, door/mirrors, dash shape, wheel and instruments
const CK=[
 {n:'C1',roof:12,pT:9,pB:21,pw:6,dY:66,dash:'#2c2e33',dash2:'#3a3d44',belt:62,door:'#26282c',mir:{x:19,y:56,w:7,h:9,r:3,c:'#d8d8d8'},wheel:{s:44,t:2.4,sp:'three',c:'#1d1d20'},cl:[{x:0,y:0,d:11,c:'#e7e7e7'}],stack:{x:63,y:70,w:14,h:10,c:'#44474f'},roofc:'#c9c6bc'},
 {n:'FIESTA',roof:11,pT:7,pB:20,pw:6.5,dY:67,dash:'#23262b',dash2:'#343841',belt:63,door:'#1f2226',mir:{x:19,y:57,w:8,h:9,r:3,c:'#2a2a2c'},wheel:{s:46,t:2.6,sp:'three',c:'#18181a'},cl:[{x:-6.5,y:0,d:9,c:'#ddd'},{x:6.5,y:0,d:9,c:'#ddd'}],stack:{x:46,y:67,w:8,h:14,c:'#2f333b',scr:'#7fb4e8'},roofc:'#35373c'},
 {n:'VAN',roof:9,pT:5,pB:13,pw:5,dY:60,dash:'#4a4e55',dash2:'#5b6068',belt:56,door:'#6e6258',mir:{x:9,y:44,w:6,h:20,r:1,c:'#222'},wheel:{s:31,t:2.2,sp:'three',c:'#1a1a1c'},cl:[{x:0,y:0,d:11,c:'#e8e0b0'}],stack:{x:70,y:65,w:16,h:8,c:'#33363b'},roofc:'#8a8f98',tall:1},
 {n:'DEFENDER',roof:10,pT:3,pB:6,pw:4,dY:63,dash:'#4b5a3a',dash2:'#5a6b46',belt:59,door:'#3f4a30',mir:{x:6,y:48,w:5,h:16,r:1,c:'#161616'},wheel:{s:44,t:2,sp:'three',c:'#161616'},cl:[{x:-9,y:0,d:8,c:'#e6e2c8'},{x:9,y:0,d:8,c:'#e6e2c8'}],stack:{x:46,y:63,w:8,h:5,c:'#2b2f24'},roofc:'#4b5a3a',boxy:1},
 {n:'MX5',roof:0,pT:15,pB:20,pw:3.2,dY:76,dash:'#17181b',dash2:'#2a2b30',belt:70,door:'#8e9097',mir:{x:23,y:63,w:6,h:7,r:50,c:'#c8c8cc'},wheel:{s:38,t:2.2,sp:'three',c:'#141416'},cl:[{x:-6,y:0,d:8,c:'#f2f2f2'},{x:0,y:0,d:7,c:'#e6e6e6'},{x:6,y:0,d:8,c:'#f2f2f2'}],stack:{x:46,y:77,w:8,h:7,c:'#202126'},roofc:null,hdr:3},
 {n:'V60',roof:10,pT:8,pB:19,pw:5.5,dY:64,dash:'#202226',dash2:'#2f3238',belt:61,door:'#1d1f22',mir:{x:19,y:55,w:9,h:9,r:4,c:'#b9b9bc'},wheel:{s:45,t:2.4,sp:'three',c:'#18181a'},cl:[{x:-5.5,y:0,d:10,c:'#dfe4ea'},{x:5.5,y:0,d:10,c:'#dfe4ea'}],stack:{x:42,y:66,w:16,h:15,c:'#15171b',scr:'#4aa0e0'},roofc:'#2a2c30'}
];

// image-based cockpit (made from supplied artwork) for cars that have it
const IMG={0:{dash:'assets/c1-dash.webp',wheel:'assets/c1-wheel.webp',W:1376,H:768,wc:[880,585],wd:350,ly:545,
 dials:[{k:'spd',c:[865,368],len:52,th:3.6,a0:154,sw:229,mx:150},{k:'rpm',c:[1065,384],len:21,th:2.6,a0:158,sw:210}]}};
let imgBox=null,imgNeedles=null;
function buildImg(i){const c=IMG[i];ckI=i;
 let h=`<div id="fpBox" style="position:absolute;left:0;top:0;width:${c.W}px;height:${c.H}px;transform-origin:0 0"><img src="${c.dash}" style="position:absolute;left:0;top:0;width:100%;height:100%">`;
 for(const d of c.dials)h+=`<div class="fn" data-k="${d.k}" style="position:absolute;left:${d.c[0]}px;top:${d.c[1]-d.th/2}px;width:${d.len}px;height:${d.th}px;background:linear-gradient(90deg,#c8281c,#ff4a2a);border-radius:${d.th}px;transform-origin:0 50%;transform:rotate(${d.a0}deg);box-shadow:0 0 2px #000"></div>`;
 h+=`<img id="fpWheel" src="${c.wheel}" style="position:absolute;left:${c.wc[0]-c.wd/2}px;top:${c.wc[1]-c.wd/2}px;width:${c.wd}px;height:${c.wd}px">`;
 dash.innerHTML=h+'</div>';wheel=dash.querySelector('#fpWheel');imgBox=dash.querySelector('#fpBox');needles=null;
 imgNeedles=[...dash.querySelectorAll('.fn')].map((e,n)=>[c.dials[n],e])}
function fitImg(){if(!imgBox)return;const c=IMG[ckI];if(!c)return;const W=innerWidth,H=innerHeight,s=.37*H/(c.ly-265),tx=(W-c.W*s)/2,ty=.95*H-c.ly*s;
 imgBox.style.transform=`translate(${tx}px,${ty}px) scale(${s})`;
 let L=dash.querySelector('#fpL'),R=dash.querySelector('#fpR');
 if(!L){dash.insertAdjacentHTML('afterbegin','<div id="fpL" style="position:absolute;left:0;background:#131313"></div><div id="fpR" style="position:absolute;right:0;background:#171717"></div>');L=dash.querySelector('#fpL');R=dash.querySelector('#fpR')}
 const t=ty+410*s,w=Math.max(0,tx)+1;for(const e of[L,R]){e.style.top=t+'px';e.style.bottom='0';e.style.width=w+'px';e.style.display=tx>0?'block':'none'}}
addEventListener('resize',fitImg);
function updImg(v){if(!imgNeedles)return;const mph=v*2.237,f=Math.min(1,v/42);for(const[d,e]of imgNeedles){const p=d.k==='spd'?Math.min(1,mph/d.mx):(.12+.5*f+.15*((v*.35)%1));e.style.transform='rotate('+(d.a0+p*d.sw)+'deg)'}}
let ckI=-1;
function buildCk(i){if(IMG[i]){buildImg(i);fitImg();return}const c=CK[i]||CK[0];ckI=i;
 const P=(...a)=>a.join(' '),sv=[];
 // roof header (angled lower edge) + A-pillars + door tops
 if(c.roof)sv.push(`<polygon points="0,0 100,0 100,${c.roof-(c.tall?0:3)} 50,${c.roof+1.5} 0,${c.roof-(c.tall?0:3)}" fill="${c.roofc}"/>`);
 else if(c.hdr)sv.push(`<rect x="${c.pB-2}" y="0" width="${100-2*(c.pB-2)}" height="${c.hdr}" fill="#111"/>`);
 const pw=c.pw;
 sv.push(`<polygon points="0,0 2.2,0 2.2,${c.belt} 0,${c.belt}" fill="#121214"/>`);sv.push(`<polygon points="100,0 97.8,0 97.8,${c.belt} 100,${c.belt}" fill="#121214"/>`);
 sv.push(`<polygon points="${c.pT},0 ${c.pT+pw},0 ${c.pB+pw},${c.belt} ${c.pB},${c.belt}" fill="#141416"/>`);
 sv.push(`<polygon points="${100-c.pT},0 ${100-c.pT-pw},0 ${100-c.pB-pw},${c.belt} ${100-c.pB},${c.belt}" fill="#141416"/>`);
 // door panels below the side window line
 sv.push(`<polygon points="0,${c.belt} ${c.pB},${c.belt} ${c.pB-3},100 0,100" fill="${c.door}"/>`);
 sv.push(`<polygon points="100,${c.belt} ${100-c.pB},${c.belt} ${100-c.pB+3},100 100,100" fill="${c.door}"/>`);
 // mirrors
 const m=c.mir;for(const side of[0,1]){const x=side?100-m.x-m.w:m.x;sv.push(`<rect x="${x}" y="${m.y}" width="${m.w}" height="${m.h}" rx="${m.r}" fill="${m.c}" stroke="#111" stroke-width=".5"/>`);sv.push(`<rect x="${x+m.w*.12}" y="${m.y+m.h*.12}" width="${m.w*.76}" height="${m.h*.76}" rx="${m.r*.7}" fill="#7d93a3" opacity=".6"/>`)}
 // dash top
 const d=c.dY;sv.push(`<polygon points="0,100 0,${d+(c.boxy?0:7)} ${c.boxy?0:22},${d+(c.boxy?0:2)} ${c.boxy?100:78},${d+(c.boxy?0:2)} 100,${d+(c.boxy?0:7)} 100,100" fill="${c.dash}"/>`);
 sv.push(`<rect x="0" y="${d+3}" width="100" height="${c.boxy?2:3}" fill="${c.dash2}" opacity=".7"/>`);
 if(c.n==='MX5')sv.push(`<polygon points="20,${d+10} 80,${d+10} 100,${d+3} 100,100 0,100 0,${d+3}" fill="#101113"/>`);
 let h=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${sv.join('')}</svg>`;
 h+=`<div style="position:absolute;inset:0;transform:translateY(-5vh)">${(DET[c.n]||DET.C1)()}</div>`;
 const w=c.wheel,wb=-(w.s*.68);
 let sp='';if(w.sp==='three')sp=`<div style="position:absolute;left:6%;right:6%;top:66%;height:9%;background:${w.c}"></div><div style="position:absolute;left:46%;width:8%;top:66%;bottom:6%;background:${w.c}"></div>`;
 else if(w.sp==='flat')sp=`<div style="position:absolute;left:8%;right:8%;top:30%;bottom:30%;border-radius:40%;background:${w.c}"></div>`;
 else sp=`<div style="position:absolute;left:4%;right:4%;top:66%;height:6%;background:${w.c}"></div>`;
 h+=`<div id="fpWheel" style="position:absolute;left:50%;bottom:${wb}vmin;width:${w.s}vmin;height:${w.s}vmin;margin-left:-${w.s/2}vmin;border-radius:50%;border:${w.t}vmin solid ${w.c};box-shadow:inset 0 0 0 .5vmin #3a3a3e,0 0 0 .4vmin #000${w.cut?';clip-path:inset(0 0 '+w.cut+'% 0)':''}">${sp}</div>`;
 dash.innerHTML=h;wheel=dash.querySelector('#fpWheel');needles=[...dash.querySelectorAll('.fd')].map(e=>[e.dataset.k,e.querySelector('i')])}
let wheel=null,needles=null;
let carHid=0,manHid=0,fpSteer=0,fpOn=0;
const uc=updateCam;
updateCam=function(dt){
 const fp=camMode===FPI&&!GS.inside&&!menuOpen&&!GAL.on&&!(window.HAY&&HAY.on);
 const wantCar=fp&&!GS.onFoot,wantMan=fp&&GS.onFoot;
 if(wantCar!==!!carHid){car.visible=!wantCar;carHid=wantCar?1:0}
 if(wantMan!==!!manHid){man.visible=!wantMan&&GS.onFoot&&!GS.inside;manHid=wantMan?1:0}
 if(wantMan)man.visible=false;
 if(wantCar&&ckI!==CARI)buildCk(CARI);
 dash.style.display=wantCar?'block':'none';fpOn=fp;
 uc(dt);
 if(!fp)return;
 let x,y,z,psi,pitch=0;
 if(GS.onFoot){psi=P.psi;const bob=Math.sin(P.phase*1)*.03*Math.min(1,P.speed/3);x=P.x+Math.sin(psi)*.12;z=P.z+Math.cos(psi)*.12;y=P.y+1.62+bob}
 else{psi=GS.psi;pitch=(GS.pitch+GS.dp)*.6;const h=HGT[CARI]||1.15,c=Math.cos(psi),s=Math.sin(psi);
  // local +x is the car's left; SEAT<0 puts the driver on the right
  x=GS.x+c*SEAT+s*.1;z=GS.z-s*SEAT+c*.1;y=GS.y+h;
  fpSteer+=(GS.steer-fpSteer)*Math.min(1,dt*8);{const v=Math.hypot(GS.vx||0,GS.vz||0),f=Math.min(1,v/42);updImg(v);if(needles)for(const[k,el]of needles)el.style.transform='rotate('+(k==='spd'?125+f*270:125+(.12+.5*f+.15*((v*.35)%1))*270)+'deg)'}if(wheel)wheel.style.transform='rotate('+(-fpSteer*120)+'deg)'}
 const look=psi+(GS.onFoot?0:GS.steer*.12);
 cam.position.set(x,y,z);
 cam.lookAt(x+Math.sin(look)*10,y-Math.sin(pitch)*10-(GS.onFoot?.2:.35),z+Math.cos(look)*10);
 if(Math.abs(cam.fov-76)>.05){cam.fov=76;cam.updateProjectionMatrix()}fovNow=76;
 skyG.position.copy(cam.position)};
})();
