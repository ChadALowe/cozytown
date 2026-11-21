/* ===== Door arrows =====
   A bobbing arrow floats above every door you can walk into (shops, the pub, your own house) when you're nearby.
   Yellow = open, red = closed.  The old yellow / blue depot light-beams are hidden (the job board and loading bay replace them). */
(function(){
const doors=[];
for(const s of SHOPD){doors.push({x:s.x,z:s.z,o:s})}
try{const hd=LW(4.2,.6);doors.push({x:hd[0],z:hd[1],home:1})}catch(e){czErr(e,"doors.js")}
const geo=new THREE.ConeGeometry(.34,.7,4);geo.rotateX(Math.PI);geo.translate(0,-.35,0);
const stem=new THREE.BoxGeometry(.16,.5,.16);stem.translate(0,.25,0);
const mOpen=new THREE.MeshBasicMaterial({color:0xffd23a,fog:false}),mShut=new THREE.MeshBasicMaterial({color:0xd04a3a,fog:false}),mHome=new THREE.MeshBasicMaterial({color:0x5ad0ff,fog:false});
for(const d of doors){const g=new THREE.Group(),tip=new THREE.Mesh(geo,d.home?mHome:mOpen),st=new THREE.Mesh(stem,d.home?mHome:mOpen);g.add(tip,st);g.position.set(d.x,G0+2.6,d.z);g.visible=false;scene.add(g);d.g=g;d.tip=tip;d.st=st;d.open=true;d.ck=0}
const u0=updJob;updJob=function(dt){u0(dt);
 DBEAM.forEach(g=>g.visible=false);
 const t=performance.now()/1000,px=GS.onFoot?P.x:GS.x,pz=GS.onFoot?P.z:GS.z,show=!GS.inside&&!menuOpen;
 for(const d of doors){const dist=Math.hypot(d.x-px,d.z-pz),vis=show&&dist<38;d.g.visible=vis;if(!vis)continue;
  d.ck-=dt;if(d.ck<=0){d.ck=.7;if(d.o){try{d.open=!!shopOpen(d.o).open}catch(e){d.open=true}}const m=d.home?mHome:d.open?mOpen:mShut;d.tip.material=m;d.st.material=m}
  d.g.position.y=G0+2.6+Math.sin(t*3.2+d.x)*.18;d.g.rotation.y=t*1.2;const s=Math.max(.7,Math.min(1.3,dist/14));d.g.scale.setScalar(s)}};
})();
