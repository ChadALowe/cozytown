/* ---------- car extras ---------- */
const shC=document.createElement('canvas');shC.width=shC.height=128;{const x=shC.getContext('2d'),g=x.createRadialGradient(64,64,8,64,64,64);g.addColorStop(0,'rgba(0,0,0,.7)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,128,128)}
const shadow=new THREE.Mesh(new THREE.PlaneGeometry(2.4,4.6).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shC),transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3}));shadow.position.y=.05;car.add(shadow);
const bmC=document.createElement('canvas');bmC.width=64;bmC.height=128;{const x=bmC.getContext('2d'),g=x.createLinearGradient(0,128,0,0);g.addColorStop(0,'rgba(255,245,200,.9)');g.addColorStop(1,'rgba(255,245,200,0)');x.fillStyle=g;x.beginPath();x.moveTo(24,128);x.lineTo(40,128);x.lineTo(64,0);x.lineTo(0,0);x.fill()}
const beam=new THREE.Mesh(new THREE.PlaneGeometry(9,20).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(bmC),side:THREE.DoubleSide,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:.55}));beam.position.set(0,.12,12.5);beam.visible=false;car.add(beam);
const dsC=document.createElement('canvas');dsC.width=dsC.height=32;{const x=dsC.getContext('2d'),g=x.createRadialGradient(16,16,2,16,16,16);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,32,32)}
const dustTex=new THREE.CanvasTexture(dsC),dust=[];let dustI=0;
for(let i=0;i<40;i++){const m=new THREE.SpriteMaterial({map:dustTex,color:0xcbb98a,transparent:true,depthWrite:false,opacity:0}),s=new THREE.Sprite(m);s.visible=false;scene.add(s);dust.push({s,age:9,life:1,vx:0,vy:0,vz:0})}
function puff(x,y,z,vx,vz,col){const d=dust[dustI++%dust.length];d.s.position.set(x,y,z);d.s.material.color.setRGB(col[0],col[1],col[2]);d.age=0;d.life=.7+rnd()*.5;d.vx=vx*.3+(rnd()-.5)*1.5;d.vy=1+rnd();d.vz=vz*.3+(rnd()-.5)*1.5;d.s.visible=true}

/* ---------- human ---------- */
const man=new THREE.Group();
const ATL_W=1024,ATL_H=768;
function drawAtlas(x){
 const SK='#e2ac8a',HR='#4a2a18',JK='#17a06a',CR='#e2d8a2',JN='#2c6f8c';
 const P=(c,r)=>[c*256,r*256];
 for(let c=0;c<4;c++){const[ox,oy]=P(c,0);x.fillStyle=SK;x.fillRect(ox,oy,256,256)}
 // back of head
 x.fillStyle=HR;x.fillRect(0,0,256,256);x.fillStyle='#3a1f10';for(let i=0;i<14;i++)x.fillRect(i*18+4,0,3,256);
 // sides
 for(const c of[1,3]){const ox=c*256;x.fillStyle=HR;x.fillRect(ox,0,256,92);x.fillStyle=SK;x.fillRect(ox,92,256,164);x.fillStyle=HR;x.fillRect(ox+(c===1?0:196),60,60,60);x.fillStyle='#d49a78';x.fillRect(ox+96,120,70,70)}
 // face
 {const ox=512;x.fillStyle=HR;x.fillRect(ox,0,256,50);x.beginPath();x.moveTo(ox,50);for(let i=0;i<=8;i++){x.lineTo(ox+i*32,50+(i%2?24:6))}x.lineTo(ox+256,0);x.lineTo(ox,0);x.fill();
  x.fillStyle='#3a1f10';x.fillRect(ox+52,90,56,7);x.fillRect(ox+148,90,56,7);
  for(const ex of[80,176]){x.fillStyle='#fff';x.beginPath();x.ellipse(ox+ex,114,17,9,0,0,7);x.fill();x.fillStyle='#4a6a8a';x.beginPath();x.arc(ox+ex,114,7,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(ox+ex,114,3.4,0,7);x.fill();x.fillStyle='#c98f6e';x.fillRect(ox+ex-18,126,36,3)}
  x.fillStyle='#d49a78';x.fillRect(ox+122,118,12,40);x.fillStyle='#b97a5c';x.fillRect(ox+112,156,32,5);
  x.fillStyle='#b5503e';x.fillRect(ox+106,176,44,7);x.fillStyle='#8f3a2c';x.fillRect(ox+106,182,44,3);
  x.fillStyle='rgba(220,120,110,.28)';x.beginPath();x.arc(ox+52,150,22,0,7);x.arc(ox+204,150,22,0,7);x.fill();
  x.fillStyle='rgba(120,70,50,.2)';x.fillRect(ox,220,256,36)}
 // torso row1
 for(let c=0;c<4;c++){const ox=c*256,oy=256;x.fillStyle=JK;x.fillRect(ox,oy,256,256);x.fillStyle='#0f7a50';x.fillRect(ox,oy+222,256,34);x.fillStyle='#1fb77c';for(let i=0;i<6;i++)x.fillRect(ox+i*44+10,oy+30,3,180)}
 {const ox=0,oy=256;x.strokeStyle=CR;x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(ox+60,oy+85);x.lineTo(ox+90,oy+60);x.lineTo(ox+120,oy+90);x.lineTo(ox+150,oy+60);x.lineTo(ox+190,oy+85);x.stroke();x.beginPath();x.moveTo(ox+66,oy+130);x.bezierCurveTo(ox+100,oy+100,ox+130,oy+165,ox+170,oy+125);x.lineTo(ox+196,oy+142);x.stroke();x.beginPath();x.moveTo(ox+76,oy+175);x.lineTo(ox+182,oy+170);x.stroke()}
 {const ox=512,oy=256;x.fillStyle=CR;x.beginPath();x.moveTo(ox+80,oy);x.lineTo(ox+128,oy+70);x.lineTo(ox+176,oy);x.fill();x.fillStyle='#e8c39e';x.beginPath();x.moveTo(ox+100,oy);x.lineTo(ox+128,oy+44);x.lineTo(ox+156,oy);x.fill();x.fillStyle='#0b5e3c';x.fillRect(ox+126,oy+70,4,152);x.fillStyle='#0f7a50';x.fillRect(ox+30,oy+150,64,5);x.fillRect(ox+162,oy+150,64,5);x.fillStyle='#d9d9d2';x.fillRect(ox+122,oy+226,12,22)}
 for(const c of[0,1,2,3]){x.fillStyle=SK;x.fillRect(c*256,256,256,12)}
 // row2: sleeve, jeans, shoe, extra
 {const oy=512;x.fillStyle=CR;x.fillRect(0,oy,256,256);x.fillStyle='#c9bd85';for(let i=0;i<5;i++)x.fillRect(i*52+12,oy+20,3,180);x.fillStyle='#0f7a50';x.fillRect(0,oy+212,256,44);x.fillStyle='#0b5e3c';for(let i=0;i<16;i++)x.fillRect(i*16+4,oy+212,3,44)}
 {const ox=256,oy=512;x.fillStyle=JN;x.fillRect(ox,oy,256,256);x.fillStyle='#24607a';for(const sx of[8,126,248])x.fillRect(ox+sx,oy,4,256);x.fillStyle='#e6c25a';for(let i=0;i<20;i++){x.fillRect(ox+10,oy+i*12+4,3,6);x.fillRect(ox+243,oy+i*12+4,3,6)}x.fillStyle='#1d5470';x.fillRect(ox,oy+236,256,20)}
 {const ox=512,oy=512;x.fillStyle='#ececea';x.fillRect(ox,oy,256,256);x.fillStyle='#b9b9b6';for(let i=0;i<5;i++)x.fillRect(ox,oy+40+i*36,256,3);x.fillStyle='#888';x.fillRect(ox,oy+220,256,36)}
 {const ox=768,oy=512;x.fillStyle=SK;x.fillRect(ox,oy,256,256)}
 // painted grain
 const im=x.getImageData(0,0,ATL_W,ATL_H),d=im.data;for(let i=0;i<ATL_W*ATL_H;i++){const n=(hash2(i&1023,i>>10)-.5)*18;d[i*4]=clamp(d[i*4]+n,0,255);d[i*4+1]=clamp(d[i*4+1]+n,0,255);d[i*4+2]=clamp(d[i*4+2]+n,0,255)}x.putImageData(im,0,0)}
const atl=document.createElement('canvas');atl.width=ATL_W;atl.height=ATL_H;drawAtlas(atl.getContext('2d'));
const manTex=new THREE.CanvasTexture(atl);manTex.magFilter=THREE.NearestFilter;manTex.minFilter=THREE.LinearMipmapLinearFilter;manTex.anisotropy=4;
function setManAtlas(src){const i=new Image();i.onload=()=>{manImg=i;manTex.image=i;manTex.needsUpdate=true;if(outfitI)applyOutfit()};i.src=src}
setManAtlas('assets/man-atlas.jpg');
function mkMan(m,base){m.userData.base=base;worldMats.push(m);return m}
const manMat=mkMan(new THREE.MeshBasicMaterial({map:manTex,vertexColors:true,side:THREE.DoubleSide}),[1.08,1.08,1.08]);
const skinMat=mkMan(new THREE.MeshBasicMaterial({color:0xe2ac8a,vertexColors:true,side:THREE.DoubleSide}),[.89,.68,.54]);
const hairMat=mkMan(new THREE.MeshBasicMaterial({color:0x4a2a18,vertexColors:true,side:THREE.DoubleSide}),[.29,.17,.1]);
const shoeMat=mkMan(new THREE.MeshBasicMaterial({color:0xeeeeee,vertexColors:true,side:THREE.DoubleSide}),[.93,.93,.94]);
const noseMat=mkMan(new THREE.MeshBasicMaterial({color:0xe2ac8a,side:THREE.DoubleSide}),[.86,.64,.5]);
const jeanMat=mkMan(new THREE.MeshBasicMaterial({color:0x2f6e86,side:THREE.DoubleSide}),[.17,.4,.5]);
const creamMat=mkMan(new THREE.MeshBasicMaterial({color:0xe2d8a2,side:THREE.DoubleSide}),[.86,.82,.62]);
const soleMat=mkMan(new THREE.MeshBasicMaterial({color:0x555560,side:THREE.DoubleSide}),[.32,.32,.36]);
const row=(r)=>({u0:0,u1:1,v0:1-(r+1)/3,v1:1-r/3}),pan=(c,r)=>({u0:c/4,u1:(c+1)/4,v0:1-(r+1)/3,v1:1-r/3});
const LV=[.35,.75,.55];
function shade(nx,ny,nz){const l=Math.hypot(nx,ny,nz)||1;return .66+.34*clamp((nx*LV[0]+ny*LV[1]+nz*LV[2])/l*.9+.25,0,1)}
function tube(rg,N,t,mat,cap){
 const pos=[],uv=[],col=[],idx=[],y0=rg[0][0],y1=rg[rg.length-1][0];
 for(let i=0;i<rg.length;i++){const[y,rx,rz]=rg[i],tt=(y-y0)/(y1-y0),pr=rg[Math.max(i-1,0)],nx_=rg[Math.min(i+1,rg.length-1)],dr=((nx_[1]+nx_[2])-(pr[1]+pr[2]))/2/((nx_[0]-pr[0])||1);
  for(let k=0;k<=N;k++){const f=-Math.PI/4+2*Math.PI*k/N,sx=Math.sin(f),sz=-Math.cos(f);pos.push(sx*rx,y,sz*rz);uv.push(t.u0+(t.u1-t.u0)*k/N,t.v0+(t.v1-t.v0)*tt);const c=shade(sx,-dr,sz);col.push(c,c,c)}}
 for(let i=0;i<rg.length-1;i++)for(let k=0;k<N;k++){const a=i*(N+1)+k,b=a+1,c=a+N+1,d=c+1;idx.push(a,c,b,b,c,d)}
 if(cap){const top=rg.length-1,ci=pos.length/3;pos.push(0,y1,0);uv.push((t.u0+t.u1)/2,t.v1);col.push(1,1,1);for(let k=0;k<N;k++)idx.push(ci,top*(N+1)+k,top*(N+1)+k+1)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);return new THREE.Mesh(g,mat)}
function ell(mat,r,sx,sy,sz,px,py,pz,seg,seg2,half){const g=new THREE.SphereGeometry(r,seg||10,seg2||7,0,6.2832,0,half?Math.PI*half:Math.PI);const n=g.attributes.position.count,c=[];for(let i=0;i<n;i++){const v=shade(g.attributes.normal.getX(i),g.attributes.normal.getY(i),g.attributes.normal.getZ(i));c.push(v,v,v)}g.setAttribute('color',new THREE.Float32BufferAttribute(c,3));const m=new THREE.Mesh(g,mat);m.scale.set(sx,sy,sz);m.position.set(px,py,pz);return m}
// torso, neck, head
man.add(tube([[.84,.16,.105],[.92,.162,.104],[1.02,.152,.098],[1.14,.158,.104],[1.27,.19,.12],[1.37,.215,.125],[1.45,.215,.115],[1.5,.15,.09],[1.54,.06,.06]],16,row(1),manMat,true));
man.add(tube([[1.5,.046,.05],[1.6,.044,.048]],10,pan(3,2),skinMat,false));
man.add(tube([[1.565,.035,.05],[1.6,.074,.086],[1.65,.094,.104],[1.7,.099,.11],[1.75,.097,.107],[1.8,.076,.088],[1.84,.038,.045]],16,row(0),manMat,true));
{const nose=new THREE.Mesh(new THREE.ConeGeometry(.02,.045,4),noseMat);nose.rotation.x=Math.PI/2;nose.rotation.z=Math.PI/4;nose.position.set(0,1.69,.118);man.add(nose);
 for(const sx of[1,-1])man.add(ell(skinMat,1,.012,.03,.022,sx*.1,1.695,0,8,6));
 man.add(ell(hairMat,1,.11,.085,.122,0,1.775,-.004,12,6,.52));man.add(ell(hairMat,1,.1,.085,.075,0,1.72,-.055,10,6))}
// legs
const sub=(t,f0,f1)=>({u0:t.u0,u1:t.u1,v0:t.v0+(t.v1-t.v0)*f0,v1:t.v0+(t.v1-t.v0)*f1});
function mkLeg(sx){const g=new THREE.Group();g.position.set(sx*.095,.9,0);const J=pan(1,2);
 g.add(tube([[-.45,.078,.083],[-.3,.092,.098],[-.12,.107,.114],[0,.11,.116]],10,sub(J,.48,1),manMat,false));
 g.add(ell(jeanMat,1,.081,.06,.086,0,-.45,0,8,6));
 const sh=new THREE.Group();sh.position.y=-.45;g.add(sh);g.shin=sh;
 sh.add(tube([[-.41,.05,.056],[-.25,.06,.068],[-.05,.075,.08],[0,.078,.083]],10,sub(J,0,.48),manMat,false));
 sh.add(ell(shoeMat,1,.062,.048,.14,0,-.385,.045,10,7));sh.add(ell(soleMat,1,.067,.016,.15,0,-.435,.045,10,5));sh.add(ell(skinMat,1,.05,.04,.05,0,-.325,-.01,6,4));return g}
const legL=mkLeg(1),legR=mkLeg(-1);man.add(legL,legR);
// arms
function mkArm(sx){const g=new THREE.Group();g.position.set(sx*.285,1.42,0);const S=pan(0,2);
 g.add(tube([[-.3,.056,.059],[-.12,.066,.069],[0,.072,.072]],10,sub(S,.5,1),manMat,false));g.add(ell(creamMat,1,.076,.08,.076,0,0,0,8,6));g.add(ell(creamMat,1,.058,.055,.06,0,-.3,0,8,6));
 const f=new THREE.Group();f.position.y=-.3;g.add(f);g.fore=f;
 f.add(tube([[-.3,.037,.04],[-.2,.046,.049],[0,.058,.06]],10,sub(S,0,.5),manMat,false));f.add(ell(skinMat,1,.04,.065,.048,0,-.36,.005,8,6));return g}
const armL=mkArm(1),armR=mkArm(-1);man.add(armL,armR);
{const ms=new THREE.Mesh(new THREE.PlaneGeometry(1.3,1.3).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:shadow.material.map,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3}));ms.position.y=.0;man.add(ms)}
man.visible=false;scene.add(man);
const P={x:0,z:0,y:0,psi:0,speed:0,dir:1,phase:0};
/* ---------- wheels: spin + steer ---------- */
const WFS=FS.replace("void main(){","uniform float uSp,uWz;void main(){").replace("vec3 p=vP;","vec3 p=vP;{float cs_=cos(uSp),sn_=sin(uSp);vec2 q_=vec2(p.z-uWz,p.y-.275);p.z=q_.x*cs_-q_.y*sn_+uWz;p.y=q_.x*sn_+q_.y*cs_+.275;}");
const wheels=car.children.filter(c=>Array.isArray(c.material));
for(const w of wheels){const wu=Object.assign({},U,{uNT:{value:1},uSp:{value:0},uWz:{value:w.position.z}});const wm=new THREE.ShaderMaterial({uniforms:wu,vertexShader:VS,fragmentShader:WFS,side:THREE.DoubleSide});w.material=[dark,wm,wm];w.userData.wu=wu;w.userData.front=w.position.z>0}
var GS_SPIN=0;
/* ---------- time of day ---------- */
const TOD=[
 {top:[.5,.58,.7],hor:[.78,.82,.86],fn:30,ff:150,tint:[1,1,1],car:[1,1,1],sun:[1,.97,.8],sd:[.35,.55,.75],ss:26,cloud:[.9,.91,.93],st:0},
 {top:[.3,.28,.46],hor:[.96,.62,.42],fn:28,ff:140,tint:[1,.76,.62],car:[1,.76,.62],sun:[1,.8,.35],sd:[.1,.08,1],ss:52,cloud:[1,.66,.52],st:0},
 {top:[.01,.02,.07],hor:[.06,.08,.16],fn:18,ff:105,tint:[.34,.4,.65],car:[.5,.55,.85],sun:[.85,.9,1],sd:[-.4,.5,-.8],ss:14,cloud:[.2,.22,.38],st:1}];
let todI=0,paintC=[1,1,1];
scene.fog=new THREE.Fog(0xffffff,90,480);
function applyPaint(){if(window.lrPaint)lrPaint();if(window.NC)NC.paint();U.uTint.value.set(...paintC);if(FU){FU.uTint.value.set(...paintC);fiesRecolor()}const l=TOD[todI].car;mirMat.color.setRGB(paintC[0]*.93*l[0],paintC[1]*.93*l[1],paintC[2]*.93*l[2])}
let seasonI=0;
function applyTOD(i){todI=i;const T=TOD[i];let hor=T.hor,top=T.top,fn=T.fn,ff=T.ff;
 if(seasonI){hor=mix3(hor,[.78,.82,.88],i===2?.2:.55);top=mix3(top,[.42,.52,.68],i===2?.1:.35);fn*=.6;ff*=.68}
 if(rainI){hor=mix3(hor,[.46,.5,.56],.65);top=mix3(top,[.3,.34,.4],.6);fn*=.45;ff*=.72}
 scene.fog.color.setRGB(...hor);scene.fog.near=fn;scene.fog.far=ff;R.setClearColor(new THREE.Color(...hor));
 const pos=skyGeo.attributes.position,col=skyGeo.attributes.color;for(let v=0;v<pos.count;v++){const y=clamp(pos.getY(v),0,1),c=mix3(hor,top,Math.pow(y,.55));col.setXYZ(v,c[0],c[1],c[2])}col.needsUpdate=true;
 for(const m of worldMats)m.color.setRGB(m.userData.base[0]*T.tint[0],m.userData.base[1]*T.tint[1],m.userData.base[2]*T.tint[2]);
 const mh=mix3([1.05*T.tint[0],1.05*T.tint[1],1.05*T.tint[2]],hor,.45);mountMat.color.setRGB(...mh);
 cloudMat.color.setRGB(...mix3(T.cloud,[.72,.76,.82],seasonI?.5:0));U.uLight.value.set(...T.car);sunMat.color.setRGB(...T.sun);
 const d=new THREE.Vector3(...T.sd).normalize();sun.position.copy(d).multiplyScalar(700);sun.scale.setScalar(T.ss);sun.lookAt(0,0,0);stars.visible=!!T.st;clouds.visible=i!==2;beam.visible=i>0;beam.material.opacity=i===2?.6:.25;snow.visible=!!seasonI;homeTOD(i);rain.visible=!!rainI&&!GS.inside;mRoad.userData.base=rainI?[.8,.84,.95]:[1.16,1.16,1.16];mRoad.color.setRGB(...mRoad.userData.base.map((v,k)=>v*T.tint[k]));if(GS.inside)lightMan();setInWin(i);applyPaint()}
function applySeason(i){seasonI=i;outerMat.userData.base=i?[.85,.88,.92]:[.2,.37,.15];terrMesh.geometry.attributes.color.array.set(i?terrCW:terrCS);terrMesh.geometry.attributes.color.needsUpdate=true;applyTOD(todI)}

/* ---------- state & input ---------- */
const GS={x:0,z:0,y:0,vy:0,psi:0,vx:0,vz:0,pitch:0,roll:0,dp:0,dr:0,steer:0,prevGY:0,gems:0,speed:0};
const inp={gas:0,brk:0,hand:0,pad:0},keys={};
let menuOpen=true,camMode=0,camAng=0,fovNow=58,RES=360,toastT=0,mT=0;
function respawn(near){GS.x=58.2;GS.z=34;GS.psi=Math.PI;GS.vx=GS.vz=0;GS.y=gH(GS.x,GS.z)+.1;GS.vy=0;GS.prevGY=GS.y;GS.pitch=GS.roll=GS.dp=GS.dr=0}
respawn(false);
var MAXV=38,ACCM=1,GRIPM=1;
let impact=0;
function step(dt){
 const fx=Math.sin(GS.psi),fz=Math.cos(GS.psi),lx=Math.cos(GS.psi),lz=-Math.sin(GS.psi);
 let vf=GS.vx*fx+GS.vz*fz,vl=GS.vx*lx+GS.vz*lz;
 const h=gH(GS.x,GS.z),d=dAt(GS.x,GS.z),surf=h<1.9?2:d<4.7?0:1,air=GS.y>(GS.gy!==undefined?GS.gy:h)+.3?1:0,tr=air?.12:1;
 const on=!GS.onFoot,gas=on&&(inp.gas||keys.up),brk=on&&(inp.brk||keys.down),hand=on&&(inp.hand||keys.space);
 let acc=0;
 if(gas)acc+=vf>=0?9*ACCM*Math.max(0,1-vf/MAXV):16;
 if(brk)acc-=vf>.6?20:(vf>-9?6:0);
 if(hand&&vf>1)acc-=3;
 vf+=acc*dt*tr;
 const drag=[.1,.5,1.3][surf];vf-=vf*drag*dt*tr;if(!gas&&!brk&&Math.abs(vf)<.5)vf*=1-4*dt;
 const gx=(hAt(GS.x+1,GS.z)-hAt(GS.x-1,GS.z))/2,gz=(hAt(GS.x,GS.z+1)-hAt(GS.x,GS.z-1))/2;
 if(!air){vf+=(-gx*fx-gz*fz)*5.4*dt;vl+=(-gx*lx-gz*lz)*5.4*dt}
 if(GS.onFoot)vf*=Math.exp(-2.5*dt);
 vl*=Math.exp(-[8,5,3.2][surf]*(hand?.22:1)*GRIPM*tr*dt);
 const tgt=GS.onFoot?0:clamp((keys.left?1:0)-(keys.right?1:0)+inp.pad,-1,1);GS.steer+=(tgt-GS.steer)*Math.min(1,dt*10);
 const sf=clamp(vf/4,-1,1),mx=lerp(2.1,.8,clamp(Math.abs(vf)/32,0,1));
 let yaw=GS.steer*mx*sf*tr;if(hand)yaw*=1.45;
 GS.vx=fx*vf+lx*vl;GS.vz=fz*vf+lz*vl;GS.psi+=yaw*dt;
 let nx=GS.x+GS.vx*dt,nz=GS.z+GS.vz*dt;
 if(hAt(nx,nz)<.25){GS.vx*=-.3;GS.vz*=-.3;nx=GS.x;nz=GS.z;impact=Math.max(impact,6)}
 const cf=[Math.sin(GS.psi),Math.cos(GS.psi)];
 for(const off of[1.1,-1,0]){const px=nx+cf[0]*off,pz=nz+cf[1]*off;
  {const CL_=colQ(px,pz);for(let i=0;i<CL_.length;i++){const c=CL_[i];if(c.d&&dOpen>.7)continue;const dx=px-c[0],dz=pz-c[1];if(dx>c[2]+2||dx<-c[2]-2||dz>c[2]+2||dz<-c[2]-2)continue;const dd=Math.hypot(dx,dz),rr=c[2]+(CARI===6?1.16:CARI===5?1.12:CARI===4?.92:CARI===2?1.05:CARI===3?1.0:CARI?.95:.85);if(dd<rr&&dd>1e-3){const ux=dx/dd,uz=dz/dd;nx+=ux*(rr-dd);nz+=uz*(rr-dd);const vn=GS.vx*ux+GS.vz*uz;if(vn<0){GS.vx-=vn*ux*1.35;GS.vz-=vn*uz*1.35;GS.vx*=.94;GS.vz*=.94;impact=Math.max(impact,-vn)}}}}}
 GS.x=nx;GS.z=nz;
 const F=1.17,Sd=.72,hf=gH(nx+cf[0]*F,nz+cf[1]*F),hb=gH(nx-cf[0]*F,nz-cf[1]*F),hl=gH(nx+lx*Sd,nz+lz*Sd),hr=gH(nx-lx*Sd,nz-lz*Sd);
 const hc=gH(nx,nz),gy=Math.max((hf+hb+hl+hr)/4,hc)+.08+Math.abs(Math.sin(GS.roll))*.35+Math.abs(Math.sin(GS.pitch))*.5;GS.gy=gy;const gvy=(gy-GS.prevGY)/dt;GS.prevGY=gy;
 GS.vy-=20*dt;GS.y+=GS.vy*dt;if(GS.y<=gy){GS.y=gy;GS.vy=clamp(gvy,-8,13)*(Math.abs(gvy)>30?0:1)}
 const tp=Math.atan((hb-hf)/(2*F)),tr2=Math.atan((hl-hr)/(2*Sd));
 GS.pitch+=(tp-GS.pitch)*Math.min(1,dt*12);GS.roll+=(tr2-GS.roll)*Math.min(1,dt*12);
 GS.dp+=(-acc*.0045-GS.dp)*Math.min(1,dt*6);GS.dr+=(clamp(GS.steer*vf*.0028,-.13,.13)-GS.dr)*Math.min(1,dt*6);
 GS.speed=Math.hypot(GS.vx,GS.vz);GS.vf=vf;GS.surf=surf;GS.acc=acc;GS.slip=Math.abs(vl);
 // dust
 if(!air&&((surf>0&&GS.speed>4)||(GS.slip>3.5&&GS.speed>5))&&rnd()<dt*30){const c=surf===2?[.8,.72,.5]:surf===1?[.55,.5,.35]:[.75,.75,.75];for(const s of[-1,1])puff(GS.x-cf[0]*1.2+lx*.7*s,GS.y+.3,GS.z-cf[1]*1.2+lz*.7*s,-GS.vx,-GS.vz,c)}
 collectGems(GS.x,GS.z,GS.y);
 if(impact>3){beep(70,.25,'sawtooth',.14);}impact=0}
function collectGems(x,z,y){for(const g of GEMS){if(g.userData.got)continue;if(Math.hypot(g.userData.x-x,g.userData.z-z)<2.8&&Math.abs(g.position.y-y-1)<3){g.userData.got=true;g.visible=false;GS.gems++;beep(880,.09);setTimeout(()=>beep(1320,.14),70);toast(GS.gems>=GEMS.length?'ALL GEMS COLLECTED!':'GEM '+GS.gems+'/'+GEMS.length);if(GS.gems>=GEMS.length)setTimeout(()=>{for(const q of GEMS){q.userData.got=false;q.visible=true}GS.gems=0;toast('GEMS RESPAWNED')},4500)}}}
function setLabels(){$('gas').textContent=GS.onFoot?'WALK':'GAS';$('brk').textContent=GS.onFoot?'BACK':'BRAKE';$('hand').innerHTML=GS.onFoot?'RUN':'HAND<br>BRAKE';$('hand').classList.toggle('big',!!GS.onFoot);updUse()}
function exitCar(){if(GS.onFoot)return;if(GS.speed>3){toast('STOP FIRST');return}const lx=Math.cos(GS.psi),lz=-Math.sin(GS.psi);let ok=false;for(const sd of[1,-1]){const x=GS.x+lx*1.9*sd,z=GS.z+lz*1.9*sd;if(hAt(x,z)>.5){P.x=x;P.z=z;ok=true;break}}if(!ok){toast('NO ROOM TO EXIT');return}P.psi=GS.psi;P.y=gH(P.x,P.z);P.speed=0;GS.onFoot=1;man.visible=true;inp.gas=inp.brk=inp.hand=0;setLabels()}
function enterCar(){if(!GS.onFoot)return;if(carry){toast('DELIVER THE PARCEL FIRST');return}if(Math.hypot(P.x-GS.x,P.z-GS.z)>4.5){toast('GET CLOSER TO THE CAR');return}GS.onFoot=0;man.visible=false;setLabels();camAng=GS.psi}
function stepFoot(dt){
 const mv=moveIn(dt),run=mv.run,fwd=mv.fwd,turn=mv.turn;
 P.psi+=turn*2.4*dt;if(fwd)P.dir=fwd;
 const sp=fwd>0?(run?7.4:3.4):fwd<0?2:0;P.speed+=(sp-P.speed)*Math.min(1,dt*(run?5:10));
 let nx=P.x+Math.sin(P.psi)*P.speed*P.dir*dt,nz=P.z+Math.cos(P.psi)*P.speed*P.dir*dt;
 if(hAt(nx,nz)<.35){nx=P.x;nz=P.z;P.speed=0}
 {const CL_=colQ(nx,nz);for(let i=0;i<CL_.length;i++){const c=CL_[i];if(c.d&&dOpen>.7)continue;const dx=nx-c[0],dz=nz-c[1];if(dx>c[2]+1||dx<-c[2]-1||dz>c[2]+1||dz<-c[2]-1)continue;const dd=Math.hypot(dx,dz),rr=c[2]+.4;if(dd<rr&&dd>1e-3){nx+=dx/dd*(rr-dd);nz+=dz/dd*(rr-dd)}}}
 for(const off of[1.3,0,-1.3]){const cx=GS.x+Math.sin(GS.psi)*off,cz=GS.z+Math.cos(GS.psi)*off,dx=nx-cx,dz=nz-cz,dd=Math.hypot(dx,dz),rr=.95+.4;if(dd<rr&&dd>1e-3){nx+=dx/dd*(rr-dd);nz+=dz/dd*(rr-dd)}}
 P.x=nx;P.z=nz;{const sx_=Math.sin(P.psi),sz_=Math.cos(P.psi),gt=Math.max(gH(nx,nz),gH(nx+sx_*.24,nz+sz_*.24),gH(nx-sx_*.14,nz-sz_*.14))+.02;P.y+=(gt-P.y)*Math.min(1,dt*15)}P.phase+=P.speed*dt*(run?1.25:2.3);collectGems(P.x,P.z,P.y)}
man.rotation.order='YXZ';
function updateMan(){if(!man.visible)return;const k=Math.min(1,P.speed/3),r=clamp((P.speed-3.8)/2.2,0,1),A=(.46+.16*r)*k,ph=P.phase;
 const sL=Math.sin(ph)*A,sR=-sL,K=.3+.5*r;
 const fl=(p)=>k*(.08+K*clamp(.5*Math.max(0,Math.sin(p))+.8*Math.max(0,-Math.cos(p)),0,1.1));
 legL.rotation.x=sL;legR.rotation.x=sR;legL.shin.rotation.x=fl(ph);legR.shin.rotation.x=fl(ph+Math.PI);
 armL.rotation.x=-sL*1.05;armR.rotation.x=-sR*1.05;const E=.22+.5*r;
 armL.fore.rotation.x=-k*(.16+E*(.5+.5*Math.sin(ph)));armR.fore.rotation.x=-k*(.16+E*(.5-.5*Math.sin(ph)));
 const sp_=Math.max(Math.abs(sL),Math.abs(sR)),drop=.9*(1-Math.cos(Math.min(1,sp_*.95)));
 man.position.set(P.x,P.y-drop+Math.abs(Math.cos(ph))*.03*(1+r)*k,P.z);man.rotation.set(.07*r*k,P.psi,0)}
function toast(t){const e=$('toast');e.textContent=t;e.style.opacity=1;toastT=1.6}

