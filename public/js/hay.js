/* ---- Farmer job: bale the hay (drive the tractor + baler over the windrows) ---- */
(function(){
const HAY={on:0,t:0,hay:0,bales:0,sp:0,rot:0,x:0,z:0,spin:0,total:0,drum:0};
window.HAY=HAY;
const X0=-128,X1=-76,ROWS=[203,211,219,227],BOUND={x0:-134,x1:-70,z0:198,z1:232},TMAX=170,PERBALE=3,PAY=7;
const grp=new THREE.Group();scene.add(grp);
const mHay=new THREE.MeshBasicMaterial({color:0xd9b84a}),mHay2=new THREE.MeshBasicMaterial({color:0xb8942c});
const gMound=new THREE.BoxGeometry(3,.55,1.3);
const gBale=new THREE.CylinderGeometry(.72,.72,1.25,14);
const mBale=new THREE.MeshBasicMaterial({color:0xd2ad42}),mBaleEnd=new THREE.MeshBasicMaterial({color:0xa98524});
let mounds=[],bales=[];
// baler towed behind the tractor
const baler=new THREE.Group();baler.visible=false;
{const red=new THREE.MeshBasicMaterial({color:0xb02a20}),dk=new THREE.MeshBasicMaterial({color:0x2a2a2d}),yl=new THREE.MeshBasicMaterial({color:0xf0d020});
 const body=new THREE.Mesh(new THREE.BoxGeometry(1.7,1.2,1.9),red);body.position.set(0,1.0,-4.3);baler.add(body);
 const bar=new THREE.Mesh(new THREE.BoxGeometry(.18,.18,2.2),dk);bar.position.set(0,.55,-2.3);baler.add(bar);
 const cover=new THREE.Mesh(new THREE.BoxGeometry(1.8,.18,2.0),dk);cover.position.set(0,1.65,-4.3);baler.add(cover);
 const drum=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,1.9,10),yl);drum.rotation.z=Math.PI/2;drum.position.set(0,.4,-3.0);baler.add(drum);baler.userData.drum=drum;
 for(const sx of[-1,1]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.3,10),dk);w.rotation.z=Math.PI/2;w.position.set(sx*1.0,.5,-4.6);baler.add(w)}}
TRG.add(baler);
// hint marker over the parked tractor
const mark=new THREE.Mesh(new THREE.OctahedronGeometry(.4,0),new THREE.MeshBasicMaterial({color:0xffe14a,fog:false}));scene.add(mark);
// HUD
const hud=document.createElement('div');hud.style.cssText='position:fixed;top:64px;left:50%;transform:translateX(-50%);background:rgba(20,30,15,.82);color:#ffe9a0;font:bold 14px monospace;padding:6px 14px;border-radius:8px;z-index:20;display:none;pointer-events:none;text-align:center;letter-spacing:1px';document.body.appendChild(hud);

function clearField(){for(const m of mounds)grp.remove(m);for(const b of bales)grp.remove(b);mounds=[];bales=[]}
function mkField(){clearField();
 for(const z of ROWS)for(let x=X0;x<=X1;x+=3.4){const m=new THREE.Mesh(gMound,(Math.round(x+z)&1)?mHay:mHay2);m.position.set(x,FGY+.45,z+(Math.random()-.5)*.3);m.rotation.y=(Math.random()-.5)*.2;m.userData.got=0;grp.add(m);mounds.push(m)}
 HAY.total=mounds.length}
function startHay(){
 if(HAY.on||GS.inside||!GS.onFoot)return;
 HAY.on=1;TR.st='park';TR.sp=0;HAY.t=TMAX;HAY.hay=0;HAY.bales=0;HAY.sp=0;HAY.drum=0;HAY.x=X1+3;HAY.z=199.5;HAY.rot=-Math.PI/2;
 mkField();baler.visible=true;man.visible=false;P.speed=0;P.x=HAY.x;P.z=HAY.z;P.psi=HAY.rot;
 toast('BALE ALL THE HAY! DRIVE ALONG THE ROWS');beep(520,.1,'square',.06);setTimeout(()=>beep(700,.12,'square',.06),110);setLabels();hud.style.display='block'}
function endHay(timeUp){
 if(!HAY.on)return;
 const all=HAY.hay>=HAY.total,bonus=all?Math.round(HAY.t*.25):0,pay=HAY.bales*PAY+bonus;
 cash+=pay;HAY.on=0;clearField();baler.visible=false;hud.style.display='none';
 TR.x=-100;TR.z=172.5;TR.rot=Math.PI;TR.st='park';TR.sp=0;TR.wi=0;TRG.position.set(TR.x,FGY,TR.z);TRG.rotation.y=TR.rot;
 P.x=-97.2;P.z=172.5;P.y=gH(P.x,P.z);P.speed=0;man.visible=true;inp.gas=inp.brk=inp.hand=0;setLabels();
 toast((all?'ALL BALED! ':timeUp?'TIME UP! ':'')+HAY.bales+' BALES = £'+pay+(bonus?' (INCL. £'+bonus+' BONUS)':''));
 beep(784,.12,'square',.06);setTimeout(()=>beep(1046,.18,'square',.06),120)}
HAY.start=startHay;HAY.end=endHay;

// drive the tractor instead of walking
const sf=stepFoot;
stepFoot=function(dt){
 if(!HAY.on){sf(dt);return}
 const mv=moveIn(dt),fwd=mv.fwd,turn=mv.turn;
 const want=fwd>0?(mv.run?9:7):fwd<0?-3.2:0;
 HAY.sp+=(want-HAY.sp)*Math.min(1,dt*(want?1.6:2.6));
 HAY.rot+=turn*1.15*dt*clamp(Math.abs(HAY.sp)/2.5,0,1)*(HAY.sp<0?-1:1);
 let nx=HAY.x+Math.sin(HAY.rot)*HAY.sp*dt,nz=HAY.z+Math.cos(HAY.rot)*HAY.sp*dt;
 if(nx<BOUND.x0||nx>BOUND.x1){nx=clamp(nx,BOUND.x0,BOUND.x1);HAY.sp*=.5}
 if(nz<BOUND.z0||nz>BOUND.z1){nz=clamp(nz,BOUND.z0,BOUND.z1);HAY.sp*=.5}
 HAY.x=nx;HAY.z=nz;HAY.spin+=HAY.sp*dt;
 TR.x=nx;TR.z=nz;TR.rot=HAY.rot;TR.spin=HAY.spin;
 P.x=nx-Math.sin(HAY.rot)*3.8;P.z=nz-Math.cos(HAY.rot)*3.8;P.psi=HAY.rot;P.y=FGY+2.6;P.speed=Math.abs(HAY.sp);
 // pick up windrows behind the tractor
 const fx=Math.sin(HAY.rot),fz=Math.cos(HAY.rot),px=nx-fx*3.1,pz=nz-fz*3.1;let picked=0;
 for(const m of mounds){if(m.userData.got)continue;if(Math.abs(m.position.x-px)<2.2&&Math.abs(m.position.z-pz)<1.5){m.userData.got=1;grp.remove(m);HAY.hay++;picked++;
   if(HAY.hay%PERBALE===0){const b=new THREE.Mesh(gBale,mBale);b.rotation.z=Math.PI/2;b.rotation.order='YXZ';b.rotation.y=HAY.rot+(Math.random()-.5)*.3;
     const bx=nx-fx*6,bz=nz-fz*6;b.position.set(bx,FGY+.78,bz);b.scale.setScalar(.2);b.userData.g=0;grp.add(b);bales.push(b);HAY.bales++;beep(420,.08,'square',.05);setTimeout(()=>beep(640,.1,'square',.05),70)}}}
 if(picked)beep(300+HAY.hay%3*40,.04,'sawtooth',.03);
 for(const b of bales)if(b.userData.g<1){b.userData.g=Math.min(1,b.userData.g+dt*3);b.scale.setScalar(.2+.8*b.userData.g)}
 HAY.drum+=(Math.abs(HAY.sp)+(picked?6:0))*dt*2;baler.userData.drum.rotation.x=HAY.drum;
 HAY.t-=dt;
 if(HAY.hay>=HAY.total)endHay(false);else if(HAY.t<=0)endHay(true);
}
// hold the tractor model / visibility while driving
const ut=updTractor;
updTractor=function(dt){
 if(!HAY.on){ut(dt);return}
 TRG.position.set(TR.x,FGY,TR.z);TRG.rotation.y=TR.rot;TRG.visible=true;
 TW.rl.rotation.x=TW.rr.rotation.x=TR.spin/.92;TW.fl.rotation.x=TW.fr.rotation.x=TR.spin/.55;
 TW.fl.rotation.y=TW.fr.rotation.y=0;
 TR.cl[0][0]=TR.cl[1][0]=-300;TR.cl[0][1]=TR.cl[1][1]=-300;TR.win=9;
 const m=Math.max(0,Math.ceil(HAY.t));
 hud.textContent='HAY '+HAY.hay+'/'+HAY.total+'  ·  BALES '+HAY.bales+'  ·  '+Math.floor(m/60)+':'+String(m%60).padStart(2,'0');
};
// keep the walking man hidden while on the tractor
const um=updateMan;updateMan=function(){um();if(HAY.on)man.visible=false};
// marker + buttons
const uc=updCozy;updCozy=function(dt){uc(dt);
 const show=!HAY.on&&GS.onFoot&&!GS.inside&&Math.hypot(P.x-TR.x,P.z-TR.z)<90;mark.visible=show;if(show){mark.position.set(TR.x,FGY+4.6+Math.sin(performance.now()*.004)*.2,TR.z);mark.rotation.y+=dt*2}};
const g0=gardenNear;
gardenNear=function(){const g=g0();
 if(!HAY.on&&GS.onFoot&&!GS.inside&&!(typeof carry!=='undefined'&&carry)){const d=Math.hypot(P.x-TR.x,P.z-TR.z);
  if(d<5&&(!g||d*.5<g.d))return{d:d*.5,btn:{label:'BALE HAY (TRACTOR)',fn:startHay}}}
 return g};
const c0=ctx;
ctx=function(){if(HAY.on)return{label:'STOP BALING',fn:()=>endHay(false)};return c0()};
})();
