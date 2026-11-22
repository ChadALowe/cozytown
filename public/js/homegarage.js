/* Your home garage: drive (or walk) in through the roller door and it opens the same menu as
   Joe's Garage, on the CARS tab, listing only the vehicles you own. Close it and you're parked
   on your driveway in whichever one you picked. */
(function(){
if(typeof HM==='undefined'||typeof openTune!=='function')return;
const local=(x,z)=>{const dx=x-HM.x,dz=z-HM.z;return[dx*HM.c-dz*HM.s,dx*HM.s+dz*HM.c]};
const inside=(x,z)=>{const q=local(x,z);return Math.abs(q[0])<1.9&&q[1]<-1.0&&q[1]>-6.0};
let armed=0,cd=0,opened=0;// armed once you have been outside the garage (the game can start with you parked in it)
function check(dt){
 /* menu closed: leave home mode; if you walked in, step back out onto the driveway */
 if(window.TUNEHOME&&window.TNon&&TNon())opened=1;
 if(window.TUNEHOME&&opened&&!TNon()&&!(typeof GAL!=='undefined'&&GAL.on)){window.TUNEHOME=0;opened=0;if(GS.onFoot&&inside(P.x,P.z)){P.x=HM.x+3.2*HM.s;P.z=HM.z+3.2*HM.c;P.psi=Math.atan2(HM.s,HM.c)}}
 if(cd>0){cd-=dt;return}
 if(GS.inside||busy||(window.TNon&&TNon())||(typeof GAL!=='undefined'&&GAL.on))return;
 const p=GS.onFoot?P:GS,inG=inside(p.x,p.z);
 if(!inG){armed=1;return}
 if(!armed)return;armed=0;cd=3;
 GS.vx=GS.vz=0;GS.speed=0;inp.gas=inp.brk=0;
 const out=[HM.x+4.6*HM.s,HM.z+4.6*HM.c];
 window.JOEBAY={x:out[0],z:out[1],psi:Math.atan2(HM.s,HM.c)};
 window.TUNEHOME=1;
 fade(()=>{busy=0;openTune('cars');setTimeout(()=>{busy=1},350)})}
{const u0=updHome;updHome=function(dt){u0(dt);try{check(dt)}catch(e){czErr(e,"homegarage.js")}}}
})();
