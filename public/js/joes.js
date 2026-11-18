/* ---- JOE'S GARAGE forecourt: set-back building, drive-in bays, signage. Driving into a bay opens the tuning screen. ---- */
(function(){
const F=frontage(-100,0,1,0,-1,12,11),CX=F.cx,Z0=F.cz+5.5,G=Y0;
const BAYS=[-7.5,-2.0].map(o=>CX+o);const BW=4.4;
const lit=[],grp=new THREE.Group();scene.add(grp);
const mc={};const mat=(c,l)=>{const k=c+':'+(l?1:0);if(!mc[k]){const m=new THREE.MeshBasicMaterial({color:c});m.userData.base=new THREE.Color(c);m.userData.lit=l!==false;mc[k]=m;if(m.userData.lit)lit.push(m)}return mc[k]};
const box=(w,h,d,x,y,z,c,l)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c,l));m.position.set(x,y+h/2,z);grp.add(m);return m};
const cvs=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x,w,h);const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return t};
const plane=(w,h,x,y,z,tex,ry,flat)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.05,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));if(flat){m.rotation.x=-Math.PI/2;m.position.set(x,y,z)}else{m.position.set(x,y,z);m.rotation.y=ry||0}grp.add(m);return m};
// forecourt pad
{const pz0=-4.9,pz1=Z0,w=25;const pad=new THREE.Mesh(new THREE.PlaneGeometry(w,pz0-pz1).rotateX(-Math.PI/2),mat(0x35363b));pad.position.set(CX,G+.075,(pz0+pz1)/2);pad.material.polygonOffset=true;pad.material.polygonOffsetFactor=-3;pad.material.polygonOffsetUnits=-3;grp.add(pad);
 for(const sx of[-1,1])box(.3,.16,pz0-pz1,sx*w/2+CX,G,(pz0+pz1)/2,0x9a9a94);
 // oil stains + painted bays
 for(const bx of BAYS){const bz=(Z0+6);
  for(const sx of[-1,1])box(.12,.02,8,bx+sx*(BW/2+.1),G+.075,Z0+4.6,0xe8c21a);
  box(BW+.5,.02,.12,bx,G+.075,Z0+8.6,0xe8c21a);
  plane(2,2.6,bx,G+.1,Z0+5.2,cvs(64,84,(x,w,h)=>{x.fillStyle='#f0d020';x.beginPath();x.moveTo(w/2,2);x.lineTo(w-4,h*.5);x.lineTo(w*.65,h*.5);x.lineTo(w*.65,h-4);x.lineTo(w*.35,h-4);x.lineTo(w*.35,h*.5);x.lineTo(4,h*.5);x.fill()}),0,1);
  plane(3.4,.9,bx,G+.1,Z0+7.4,cvs(128,32,(x,w,h)=>{x.fillStyle='#f0d020';x.font='bold 22px monospace';x.textAlign='center';x.textBaseline='middle';x.fillText('TUNING BAY',w/2,h/2)}),0,1)}}
// bay openings: textured interior picture, hazard frame, half-raised shutter
const bayTex=cvs(256,176,(x,w,h)=>{let g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#4a5260');g.addColorStop(.6,'#2d313a');g.addColorStop(1,'#16171b');x.fillStyle=g;x.fillRect(0,0,w,h);
 x.fillStyle='#1d2027';x.fillRect(0,h*.62,w,h*.38);x.fillStyle='#e8c21a';x.fillRect(0,h*.62,w,2);
 for(const lx of[.2,.5,.8]){x.fillStyle='#fffbe0';x.fillRect(w*lx-26,10,52,6);x.fillStyle='rgba(255,250,200,.18)';x.fillRect(w*lx-34,16,68,18)}
 // tyre racks right, toolbox left
 for(let i=0;i<4;i++){x.fillStyle='#0b0b0d';x.fillRect(w*.78+(i%2)*28,h*.3+Math.floor(i/2)*34,24,30);x.fillStyle='#4a4a50';x.fillRect(w*.78+(i%2)*28+8,h*.3+Math.floor(i/2)*34+10,8,10)}
 x.fillStyle='#b81818';x.fillRect(w*.06,h*.5,40,34);x.fillStyle='#e04040';x.fillRect(w*.06,h*.5,40,6);x.fillStyle='#601010';for(let i=0;i<3;i++)x.fillRect(w*.06+3,h*.5+10+i*8,34,1);
 // car lift: posts + arms + a car shape
 x.fillStyle='#e8c21a';x.fillRect(w*.3,h*.3,8,h*.34);x.fillRect(w*.64,h*.3,8,h*.34);x.fillStyle='#b8b8c0';x.fillRect(w*.3,h*.58,w*.34+8,5);
 x.fillStyle='#7a2a2a';x.beginPath();x.roundRect(w*.34,h*.38,w*.3,h*.18,8);x.fill();x.fillStyle='#10151c';x.fillRect(w*.4,h*.41,w*.18,h*.07)});
const shTex=cvs(64,32,(x,w,h)=>{x.fillStyle='#d8801a';x.fillRect(0,0,w,h);for(let y=0;y<h;y+=4){x.fillStyle='#a85a10';x.fillRect(0,y,w,1)}});
for(const bx of BAYS){
 plane(BW,2.85,bx,G+1.425,Z0+.2,bayTex,0);
 plane(BW,.95,bx,G+2.38,Z0+.24,shTex,0);
 box(BW+.7,.3,.3,bx,G+2.85,Z0+.22,0xe8c21a,false);box(.35,2.9,.3,bx-BW/2-.17,G,Z0+.22,0xe8c21a,false);box(.35,2.9,.3,bx+BW/2+.17,G,Z0+.22,0xe8c21a,false);
 for(let i=0;i<6;i++)box(.35,.3,.31,bx-BW/2-.17,G+.1+i*.5,Z0+.22,0x1a1a1a,false),box(.35,.3,.31,bx+BW/2+.17,G+.1+i*.5,Z0+.22,0x1a1a1a,false);
 box(BW,.1,.5,bx,G,Z0+.42,0x4a4a50)}
// full-width fascia banner (replaces the old red strip)
{const t=cvs(1024,96,(x,w,h)=>{x.fillStyle='#0a3ca0';x.fillRect(0,0,w,h);x.fillStyle='#f6d020';x.fillRect(0,0,w,9);x.fillRect(0,h-9,w,9);
 x.fillStyle='#fff';x.font='bold 54px monospace';x.textAlign='center';x.textBaseline='middle';x.fillText("JOE'S GARAGE",w*.27,h/2+1);
 x.fillStyle='#f6d020';x.font='bold 24px monospace';x.fillText('TUNING · TYRES · MOT · EXHAUSTS',w*.7,h/2-13);x.fillText('BRAKES · SERVICING · BODY KITS',w*.7,h/2+17);
 x.fillStyle='#f6d020';x.fillRect(w*.5-3,14,6,h-28)});
 plane(22.9,1.3,CX,G+3.62,Z0+3.98,t,0)}
// roadside pylon sign
{const px=CX-12.8,pz=-6.6;box(.35,6.5,.35,px,G,pz,0x55565c);
 const t=cvs(128,160,(x,w,h)=>{x.fillStyle='#0a3ca0';x.fillRect(0,0,w,h);x.fillStyle='#f6d020';x.fillRect(4,4,w-8,6);x.fillRect(4,h-10,w-8,6);x.fillStyle='#fff';x.font='bold 21px monospace';x.textAlign='center';x.fillText('JOE\'S',w/2,40);x.fillText('GARAGE',w/2,66);x.fillStyle='#f6d020';x.font='bold 15px monospace';for(const[i,l]of['MOT','TYRES','TUNING','EXHAUSTS'].entries())x.fillText(l,w/2,96+i*17)});
 box(2.4,3,.3,px,G+4,pz,0x0a2a70,false);plane(2.2,2.75,px,G+5.5,pz+.17,t,0);plane(2.2,2.75,px,G+5.5,pz-.17,t,Math.PI)}
// props: tyre stacks, cones, drums, sandwich board, air pump
const tyre=(x,z,n)=>{for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.24,10),mat(0x16161a));m.position.set(x,G+.12+.25*i,z);grp.add(m);const r=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.25,8),mat(0x55565c));r.position.set(x,G+.12+.25*i,z);grp.add(r)}};
tyre(CX-10.6,Z0+1.4,5);tyre(CX-10.6,Z0+2.5,4);tyre(CX-9.6,Z0+1.6,3);tyre(CX+10.4,Z0+9,3);
for(const[x,z]of[[CX-4.8,Z0+10.5],[CX+.8,Z0+10.5],[CX+4,Z0+8]]){const c=new THREE.Mesh(new THREE.ConeGeometry(.22,.7,8),mat(0xf07018));c.position.set(x,G+.42,z);grp.add(c);box(.5,.05,.5,x,G+.08,z,0xf07018)}
for(const[x,z]of[[CX+3,Z0+.9],[CX+3.8,Z0+.9]]){const d=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.9,10),mat(x>CX+3.5?0x2a5ab0:0xb82020));d.position.set(x,G+.5,z);grp.add(d)}
{const t=cvs(64,80,(x,w,h)=>{x.fillStyle='#f6d020';x.fillRect(0,0,w,h);x.fillStyle='#111';x.font='bold 13px monospace';x.textAlign='center';x.fillText('MOT',w/2,22);x.fillText('£35',w/2,42);x.fillText('WALK IN',w/2,64)});
 box(.7,.9,.06,CX+9.3,G,Z0+5,0x7a5a30);plane(.62,.78,CX+9.3,G+.5,Z0+5.04,t,0)}
box(.3,1.4,.3,CX+10.2,G,Z0+3.2,0xc82020);box(.5,.3,.4,CX+10.2,G+1.3,Z0+3.2,0x222222);
// a couple of lamps over the forecourt
// flat-roofed canopy front (single storey, Quik-Fit style)
box(22.8,.9,3.9,CX,G+3.3,Z0+1.95,0xd4d7dd);box(22.6,.06,3.8,CX,G+3.26,Z0+1.95,0x70747e);
for(const x of[-9,-4.5,0,4.5,9])box(.16,.06,2.6,CX+x,G+3.21,Z0+1.95,0xfff6d0,false);
for(const x of[-11.1,-4.75,3.6,11.1]){box(.34,3.3,.34,CX+x,G,Z0+3.7,0xe8c21a);for(let i=0;i<5;i++)box(.36,.3,.36,CX+x,G+.15+i*.6,Z0+3.7,0x1a1a1a)}

const hint=()=>toast('DRIVE INTO A BAY TO TUNE YOUR CAR');
let cd=0,near=0;
{const u0=updCozy;updCozy=function(dt){u0(dt);
  const l=U.uLight.value;for(const m of lit)m.color.setRGB(m.userData.base.r*l.x,m.userData.base.g*l.y,m.userData.base.b*l.z);
  if(cd>0)cd-=dt;
  if(GS.onFoot||GS.inside||GAL.on||busy||menuOpen||(window.TNon&&window.TNon()))return;
  const dx=GS.x-CX,dz=GS.z-Z0;
  if(Math.abs(dx)<22&&dz>-1&&dz<18){if(!near){near=1;hint()}}else if(Math.abs(dx)>40||dz>45)near=0;
  if(cd>0)return;
  for(const bx of BAYS)if(Math.abs(GS.x-bx)<BW/2-.2&&GS.z<Z0+4.6&&GS.z>Z0-1){cd=4;GS.vx=GS.vz=GS.speed=0;window.JOEBAY={x:bx,z:Z0+9,psi:0};fade(()=>{GS.x=bx;GS.z=Z0+3;GS.psi=0;busy=0;openTune('perf');setTimeout(()=>{busy=1},350)});return}}}
window.JOES={cx:CX,z0:Z0,bays:BAYS};
})();
