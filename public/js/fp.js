/* ---- first-person view: CAM button / C key cycles to it (4th camera) ---- */
(function(){
CAMS.push({d:0,h:1.2,f:76,fp:1});
const FPI=CAMS.length-1,HGT=[1.12,1.08,1.5,1.45,.92,1.2],SEAT=-.34;
const dash=document.createElement('div');
dash.style.cssText='position:fixed;left:0;right:0;bottom:0;height:28%;pointer-events:none;z-index:1;display:none;overflow:hidden';
dash.innerHTML='<div style="position:absolute;left:0;right:0;bottom:0;height:100%;background:linear-gradient(to top,#111 0,#1b1b1e 35%,rgba(27,27,30,0) 100%)"></div>'
 +'<div id="fpWheel" style="position:absolute;left:50%;bottom:-62%;width:46vmin;height:46vmin;margin-left:-23vmin;border-radius:50%;border:2.6vmin solid #202022;box-shadow:inset 0 0 0 .6vmin #333;transform-origin:50% 50%"><div style="position:absolute;left:8%;right:8%;top:47%;height:6%;background:#202022"></div><div style="position:absolute;top:8%;bottom:50%;left:47%;width:6%;background:#202022"></div></div>';
document.body.appendChild(dash);
const wheel=dash.querySelector('#fpWheel');
let carHid=0,manHid=0,fpSteer=0,fpOn=0;
const uc=updateCam;
updateCam=function(dt){
 const fp=camMode===FPI&&!GS.inside&&!menuOpen&&!GAL.on&&!(window.HAY&&HAY.on);
 const wantCar=fp&&!GS.onFoot,wantMan=fp&&GS.onFoot;
 if(wantCar!==!!carHid){car.visible=!wantCar;carHid=wantCar?1:0}
 if(wantMan!==!!manHid){man.visible=!wantMan&&GS.onFoot&&!GS.inside;manHid=wantMan?1:0}
 if(wantMan)man.visible=false;
 if(fpOn!==fp){fpOn=fp;dash.style.display=wantCar?'block':'none'}
 else if(fp)dash.style.display=wantCar?'block':'none';
 uc(dt);
 if(!fp)return;
 let x,y,z,psi,pitch=0;
 if(GS.onFoot){psi=P.psi;const bob=Math.sin(P.phase*1)*.03*Math.min(1,P.speed/3);x=P.x+Math.sin(psi)*.12;z=P.z+Math.cos(psi)*.12;y=P.y+1.62+bob}
 else{psi=GS.psi;pitch=(GS.pitch+GS.dp)*.6;const h=HGT[CARI]||1.15,c=Math.cos(psi),s=Math.sin(psi);
  // local +x is the car's left; SEAT<0 puts the driver on the right
  x=GS.x+c*SEAT+s*.1;z=GS.z-s*SEAT+c*.1;y=GS.y+h;
  fpSteer+=(GS.steer-fpSteer)*Math.min(1,dt*8);wheel.style.transform='rotate('+(-fpSteer*120)+'deg)'}
 const look=psi+(GS.onFoot?0:GS.steer*.12);
 cam.position.set(x,y,z);
 cam.lookAt(x+Math.sin(look)*10,y-Math.sin(pitch)*10-(GS.onFoot?.2:.35),z+Math.cos(look)*10);
 if(Math.abs(cam.fov-76)>.05){cam.fov=76;cam.updateProjectionMatrix()}fovNow=76;
 skyG.position.copy(cam.position)};
})();
