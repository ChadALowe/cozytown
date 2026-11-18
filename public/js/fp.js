/* ---- first-person view: CAM button / C key cycles to it (4th camera) ---- */
(function(){
CAMS.push({d:0,h:1.2,f:76,fp:1});
const FPI=CAMS.length-1,HGT=[1.12,1.08,1.5,1.45,.92,1.2],SEAT=-.34;
const dash=document.createElement('div');
dash.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:1;display:none;overflow:hidden';
document.body.appendChild(dash);
// per-car cockpit: pillars, roof header, door/mirrors, dash shape, wheel and instruments
const CK=[
 {n:'C1',roof:12,pT:9,pB:21,pw:6,dY:66,dash:'#2c2e33',dash2:'#3a3d44',belt:62,door:'#26282c',mir:{x:19,y:56,w:7,h:9,r:3,c:'#d8d8d8'},wheel:{s:44,t:2.4,sp:'three',c:'#1d1d20'},cl:[{x:0,y:0,d:11,c:'#e7e7e7'}],stack:{x:63,y:70,w:14,h:10,c:'#44474f'},roofc:'#c9c6bc'},
 {n:'FIESTA',roof:11,pT:7,pB:20,pw:6.5,dY:67,dash:'#23262b',dash2:'#343841',belt:63,door:'#1f2226',mir:{x:19,y:57,w:8,h:9,r:3,c:'#2a2a2c'},wheel:{s:46,t:2.6,sp:'three',c:'#18181a'},cl:[{x:-6.5,y:0,d:9,c:'#ddd'},{x:6.5,y:0,d:9,c:'#ddd'}],stack:{x:46,y:67,w:8,h:14,c:'#2f333b',scr:'#7fb4e8'},roofc:'#35373c'},
 {n:'VAN',roof:9,pT:5,pB:13,pw:5,dY:60,dash:'#4a4e55',dash2:'#5b6068',belt:56,door:'#6e6258',mir:{x:9,y:44,w:6,h:20,r:1,c:'#222'},wheel:{s:54,t:3,sp:'flat',c:'#1a1a1c',tilt:1},cl:[{x:0,y:0,d:11,c:'#e8e0b0'}],stack:{x:70,y:65,w:16,h:8,c:'#33363b'},roofc:'#8a8f98',tall:1},
 {n:'DEFENDER',roof:10,pT:3,pB:6,pw:4,dY:63,dash:'#4b5a3a',dash2:'#5a6b46',belt:59,door:'#3f4a30',mir:{x:6,y:48,w:5,h:16,r:1,c:'#161616'},wheel:{s:46,t:1.6,sp:'two',c:'#161616'},cl:[{x:-9,y:0,d:8,c:'#e6e2c8'},{x:9,y:0,d:8,c:'#e6e2c8'}],stack:{x:46,y:63,w:8,h:5,c:'#2b2f24'},roofc:'#4b5a3a',boxy:1},
 {n:'MX5',roof:0,pT:15,pB:20,pw:3.2,dY:76,dash:'#17181b',dash2:'#2a2b30',belt:70,door:'#8e9097',mir:{x:23,y:63,w:6,h:7,r:50,c:'#c8c8cc'},wheel:{s:38,t:2.2,sp:'three',c:'#141416'},cl:[{x:-6,y:0,d:8,c:'#f2f2f2'},{x:0,y:0,d:7,c:'#e6e6e6'},{x:6,y:0,d:8,c:'#f2f2f2'}],stack:{x:46,y:77,w:8,h:7,c:'#202126'},roofc:null,hdr:3},
 {n:'V60',roof:10,pT:8,pB:19,pw:5.5,dY:64,dash:'#202226',dash2:'#2f3238',belt:61,door:'#1d1f22',mir:{x:19,y:55,w:9,h:9,r:4,c:'#b9b9bc'},wheel:{s:45,t:2.4,sp:'three',c:'#18181a'},cl:[{x:-5.5,y:0,d:10,c:'#dfe4ea'},{x:5.5,y:0,d:10,c:'#dfe4ea'}],stack:{x:42,y:66,w:16,h:15,c:'#15171b',scr:'#4aa0e0'},roofc:'#2a2c30'}
];
let ckI=-1;
function buildCk(i){const c=CK[i]||CK[0];ckI=i;
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
 // centre stack + screen
 const st=c.stack;if(st){h+=`<div style="position:absolute;left:${st.x}%;top:${st.y}%;width:${st.w}%;height:${st.h}%;background:${st.c};border-radius:.6vmin;box-shadow:0 0 0 .3vmin #000">${st.scr?`<div style="margin:12%;height:${c.n==='V60'?'46':'34'}%;background:${st.scr};border-radius:.4vmin;opacity:.9"></div>`:''}</div>`}
 // gauges + wheel
 const w=c.wheel,wb=-(w.s*.4);
 let cl='';for(const g of c.cl)cl+=`<div style="position:absolute;left:calc(50% + ${g.x}vmin - ${g.d/2}vmin);bottom:${6+(c.n==='MX5'?3:0)}vmin;width:${g.d}vmin;height:${g.d}vmin;border-radius:50%;background:radial-gradient(circle at 50% 55%,#1b1b1f 0 55%,${g.c} 56% 62%,#111 63%);box-shadow:0 0 0 .4vmin #000"><div style="position:absolute;left:50%;top:50%;width:42%;height:.35vmin;background:#e24a2a;transform-origin:0 50%;transform:rotate(${150+g.x*6}deg)"></div></div>`;
 let sp='';if(w.sp==='three')sp=`<div style="position:absolute;left:6%;right:6%;top:66%;height:9%;background:${w.c}"></div><div style="position:absolute;left:46%;width:8%;top:66%;bottom:6%;background:${w.c}"></div>`;
 else if(w.sp==='two')sp=`<div style="position:absolute;left:4%;right:4%;top:66%;height:6%;background:${w.c}"></div><div style="position:absolute;left:46%;width:8%;top:4%;bottom:4%;background:${w.c};opacity:.0"></div>`;
 else sp=`<div style="position:absolute;left:8%;right:8%;top:30%;bottom:30%;border-radius:40%;background:${w.c}"></div>`;
 h+=`<div id="fpCl" style="position:absolute;left:0;right:0;bottom:0;height:0">${cl}</div>`;
 h+=`<div id="fpWheel" style="position:absolute;left:50%;bottom:${wb}vmin;width:${w.s}vmin;height:${w.s}vmin;margin-left:-${w.s/2}vmin;border-radius:50%;border:${w.t}vmin solid ${w.c};box-shadow:inset 0 0 0 .5vmin #3a3a3e,0 0 0 .4vmin #000${w.tilt?';transform-origin:50% 50%':''}">${sp}</div>`;
 dash.innerHTML=h;wheel=dash.querySelector('#fpWheel')}
let wheel=null;
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
  fpSteer+=(GS.steer-fpSteer)*Math.min(1,dt*8);if(wheel)wheel.style.transform='rotate('+(-fpSteer*120)+'deg)'}
 const look=psi+(GS.onFoot?0:GS.steer*.12);
 cam.position.set(x,y,z);
 cam.lookAt(x+Math.sin(look)*10,y-Math.sin(pitch)*10-(GS.onFoot?.2:.35),z+Math.cos(look)*10);
 if(Math.abs(cam.fov-76)>.05){cam.fov=76;cam.updateProjectionMatrix()}fovNow=76;
 skyG.position.copy(cam.position)};
})();
