/* ---- the farm + the one John Deere ---- */
const FX=-105,FGY=G0;
const JG=[.2,.52,.17],JGd=[.14,.38,.12],JY=[.96,.82,.1],JK=[.12,.12,.13],JKk=[.2,.2,.21];
function xf(rot,cx,cz,x,z){const c=Math.cos(rot),s=Math.sin(rot),dx=x-cx,dz=z-cz;return[cx+dx*c+dz*s,cz-dx*s+dz*c]}
function proof(B,cx,y,cz,w,d,h,col,ov,rot,col2){ // gable prism, ridge along z (local), w across x
 rot=rot||0;const P=(x,yy,z)=>{const q=xf(rot,cx,cz,cx+x,cz+z);return[q[0],y+yy,q[1]]},W=w/2+ov,D=d/2+ov,cen=[cx,y+h*.4,cz],c2=col2||col;
 const a=P(-W,0,-D),b=P(-W,0,D),c=P(0,h,D),dd=P(0,h,-D),e=P(W,0,-D),f=P(W,0,D);
 B.tri(a,b,c,col,col,col,false,cen);B.tri(a,c,dd,col,col,col,false,cen);B.tri(e,f,c,c2,c2,c2,false,cen);B.tri(e,c,dd,c2,c2,c2,false,cen);
 const g=P(-w/2,0,-d/2),i=P(-w/2,0,d/2),j=P(0,h*1.0,d/2),k=P(w/2,0,d/2),l=P(w/2,0,-d/2),m=P(0,h,-d/2);
 B.tri(g,m,l,[.8,.78,.7],[.8,.78,.7],[.8,.78,.7],false,cen);B.tri(i,k,j,[.8,.78,.7],[.8,.78,.7],[.8,.78,.7],false,cen)}
function boxR(B,cx,cz,x,y,z,sx,sy,sz,col,rot){const q=xf(rot||0,cx,cz,cx+x,cz+z);pbox(B,q[0],y,q[1],sx,sy,sz,col,rot||0)}
const FM=new Builder(3),FC=[];
function ccol(x,z,r){COL.push([x,z,r]);FC.push([x,z,r])}
{const B=FM;
 // dirt yard + track
 const dirt=[.46,.36,.24];for(const[x0,z0,x1,z1]of[[-135,150,-68,192],[FX-1.8,106,FX+1.8,152]])B.tri([x0,FGY+.05,z0],[x1,FGY+.05,z0],[x1,FGY+.05,z1],dirt,dirt,dirt,true),B.tri([x0,FGY+.05,z0],[x1,FGY+.05,z1],[x0,FGY+.05,z1],dirt,dirt,dirt,true);
 // farmhouse (ridge along z, door faces +x yard)
 const hx=-123,hz=160;pbox(B,hx,FGY,hz,7,3.2,9.5,[.88,.84,.72]);proof(B,hx,FGY+3.2,hz,7,9.5,2.3,[.32,.34,.4],.35,0);
 pbox(B,hx+3.52,FGY,hz-.5,.08,2.1,1.1,[.35,.2,.12]);for(const dz of[-3,2.4])for(const dy of[0,.0]){pbox(B,hx+3.52,FGY+1.2,hz+dz,.08,1.1,1.0,[.55,.7,.8])}
 pbox(B,hx-1.2,FGY+3.2,hz+1,.9,2.8,.9,[.55,.3,.22]);for(let i=-1;i<=1;i+=2)pbox(B,hx+i*2.2,FGY+1.2,hz-4.78,1,1.1,.08,[.55,.7,.8]);
 for(let i=0;i<4;i++)ccol(hx,hz-3.5+i*2.4,2.4);
 // barn
 const bx=-84,bz=174;pbox(B,bx,FGY,bz,11,4.6,17,[.55,.2,.16]);proof(B,bx,FGY+4.6,bz,11,17,3.4,[.27,.27,.3],.5,0);
 pbox(B,bx-5.52,FGY,bz,.1,3.6,4.4,[.2,.12,.08]);pbox(B,bx-5.55,FGY,bz-2.2,.06,3.6,.2,[.85,.8,.7]);pbox(B,bx-5.55,FGY,bz+2.2,.06,3.6,.2,[.85,.8,.7]);pbox(B,bx-5.55,FGY+3.4,bz,.06,.2,4.5,[.85,.8,.7]);
 pbox(B,bx-5.52,FGY+5,bz,.1,1.2,1.4,[.2,.12,.08]);
 for(let i=0;i<7;i++)ccol(bx,bz-7.2+i*2.4,3.6);
 // silo
 const sx=-72,sz=150;{const R=[],n=10;for(let k=0;k<=n;k++){const a=k/n*6.2832;R.push(a)}}
 pcyl(B,sx,FGY,sz,2.1,9.5,10,[.72,.74,.76]);pcone(B,sx,FGY+9.5,sz,2.3,2.2,10,[.4,.42,.48]);for(let i=1;i<6;i++)pcyl(B,sx,FGY+i*1.6,sz,2.14,.12,10,[.45,.47,.5]);ccol(sx,sz,2.3);
 // hay bales
 for(const[x,z,y]of[[-100,188,0],[-97,188,0],[-98.5,188,.95],[-93,189.5,0]]){pcyl(B,x,FGY+y,z,.6,1.2,8,[.82,.7,.3])}for(const[x,z]of[[-100,188],[-97,188],[-93,189.5]])ccol(x,z,.9);
 // water trough + wheelbarrow
 pbox(B,-112,FGY,182,2.2,.5,.7,[.45,.45,.48]);pbox(B,-109,FGY,174,.7,.35,1.1,[.7,.2,.15]);
 // honesty stall by the track
 const tx=-109.5,tz=128;pbox(B,tx,FGY,tz,2.0,.9,.9,[.6,.45,.28]);pbox(B,tx-.9,FGY+.9,tz,.08,1.7,.08,[.45,.3,.18]);pbox(B,tx+.9,FGY+.9,tz,.08,1.7,.08,[.45,.3,.18]);pbox(B,tx,FGY+2.5,tz,2.4,.1,1.3,[.85,.2,.2]);pbox(B,tx,FGY+2.5,tz,1.2,.1,1.3,[.9,.9,.85]);
 for(let i=0;i<3;i++)pbox(B,tx-.6+i*.6,FGY+.9,tz,.4,.3,.4,[.85,.85,.9]);ccol(tx,tz,1.2);
 // fences: paddock x -170..-138, z 145..205 (gap at yard side east)
 const post=(x,z)=>pbox(B,x,FGY,z,.13,1.15,.13,[.5,.36,.2]),rail=(x,z,l,ry)=>{boxR(B,x,z,0,FGY+.45,0,l,.08,.06,[.55,.42,.25],ry);boxR(B,x,z,0,FGY+.85,0,l,.08,.06,[.55,.42,.25],ry)};
 const fence=(x0,z0,x1,z1)=>{const L=Math.hypot(x1-x0,z1-z0),n=Math.ceil(L/3),ang=Math.atan2(x1-x0,z1-z0);for(let i=0;i<=n;i++)post(x0+(x1-x0)*i/n,z0+(z1-z0)*i/n);for(let i=0;i<n;i++){const mx=x0+(x1-x0)*(i+.5)/n,mz=z0+(z1-z0)*(i+.5)/n;const q=Math.hypot(x1-x0,z1-z0)/n;pbox(B,mx,FGY+.4,mz,Math.abs(Math.sin(ang))*q+.06,.08,Math.abs(Math.cos(ang))*q+.06,[.55,.42,.25]);pbox(B,mx,FGY+.8,mz,Math.abs(Math.sin(ang))*q+.06,.08,Math.abs(Math.cos(ang))*q+.06,[.55,.42,.25])}};
 fence(-170,145,-138,145);fence(-170,205,-138,205);fence(-170,145,-170,205);fence(-138,145,-138,160);fence(-138,172,-138,205);
 // crop field south of yard
 for(let i=0;i<14;i++){const z=198+i*2.4,c=i%2?[.3,.22,.14]:[.34,.55,.16];pbox(B,-102,FGY,z,64,.18,1.4,i%2?[.28,.2,.12]:[.3,.55,.2])}
 fence(-136,196,-68,196);fence(-136,196,-136,234);fence(-68,196,-68,234);
 // field gate-end sign + little flowerbed at farmhouse
 pbox(B,-119.4,FGY,166,.9,.4,2.6,[.4,.3,.2]);for(let i=0;i<5;i++)pbox(B,-119.6,FGY+.4,164.9+i*.5,.3,.25,.3,[[.9,.3,.4],[.95,.85,.2],[.9,.5,.8],[.95,.95,.95],[.9,.3,.4]][i]);
}
const farmMesh=FM.mesh(mObj);scene.add(farmMesh);
/* tractor */
const TRG=new THREE.Group();scene.add(TRG);
const TW={};
function wheelMesh(r,w,lugs,hub){const B=new Builder(3),t=JK;lft(B,[{y:-w/2,rx:r*.8,rz:r*.8,c:dk(t,.9)},{y:-w/2+.05,rx:r*.97,rz:r*.97,c:t},{y:w/2-.05,rx:r*.97,rz:r*.97,c:t},{y:w/2,rx:r*.8,rz:r*.8,c:dk(t,.9)}],12,false);
 for(const sgn of[-1,1]){lft(B,[{y:sgn*w*.43,rx:r*.62,rz:r*.62,c:JY},{y:sgn*w*.47,rx:r*.6,rz:r*.6,c:JY},{y:sgn*w*.52,rx:r*.18,rz:r*.18,top:0,c:dk(JY,.85)}],10,true)}
 for(let i=0;i<lugs;i++){const a=i/lugs*6.2832;pbox(B,Math.cos(a)*r*.99,-w*.46,Math.sin(a)*r*.99,.16,w*.92,.1,JKk,Math.PI/2-a)}
 const m=B.mesh(mObj);m.rotation.z=Math.PI/2;const p=new THREE.Group();p.add(m);return p}
{const B=new Builder(3),Gl=new Builder(3);
 // chassis + hood
 pbox(B,0,.45,.5,1.0,.7,3.4,JGd);pbox(B,0,.95,1.3,.95,.75,1.5,JG);pbox(B,0,1.7,1.3,.97,.1,1.52,dk(JG,1.12));
 pbox(B,0,.9,2.07,.9,.7,.06,JK);pbox(B,-.28,1.22,2.1,.22,.15,.05,[.95,.95,.9]);pbox(B,.28,1.22,2.1,.22,.15,.05,[.95,.95,.9]);for(let i=0;i<5;i++)pbox(B,-.32+i*.16,.95,2.11,.04,.5,.03,JKk);
 pbox(B,0,.5,2.2,1.6,.35,.35,JG);
 // cab
 for(const sx of[-1,1])for(const sz of[-1.55,.35]){pbox(B,sx*.74,1.3,sz,.09,1.55,.09,JK)}
 pbox(B,0,2.85,-.6,1.9,.13,2.3,JG);pbox(B,0,2.98,-.6,1.5,.04,1.9,dk(JG,1.1));pbox(B,0,1.2,-.6,1.6,.15,2.0,JGd);
 for(const sx of[-1,1]){pbox(B,sx*.74,1.28,-.6,.09,.09,1.95,JK);pbox(B,sx*.74,2.76,-.6,.09,.09,1.95,JK)}pbox(B,0,2.76,.35,1.5,.09,.09,JK);pbox(B,0,2.76,-1.55,1.5,.09,.09,JK);pbox(B,0,1.28,.35,1.5,.09,.09,JK);pbox(B,0,1.28,-1.55,1.5,.09,.09,JK);
 // fenders, lights, mirrors, hitch, ladder, exhaust, seat, wheel
 for(const sx of[-1,1]){pbox(B,sx*1.05,1.98,-.7,.7,.12,2.1,JG);pbox(B,sx*1.36,1.72,-.7,.1,.3,2.1,JG);pbox(B,sx*.72,1.3,-.7,.14,.7,1.8,JG);pbox(B,sx*1.05,1.78,-1.72,.4,.18,.06,[.95,.5,.1]);pbox(B,sx*.98,.75,2.0,.5,.3,.9,JG);pbox(B,sx*.74,2.2,.3,.34,.18,.05,JK);pbox(B,sx*.98,2.1,.3,.07,.5,.07,JK);pbox(B,sx*1.04,2.3,.33,.1,.42,.18,JK)}
 pbox(B,0,.55,-1.9,.5,.25,.5,JK);pbox(B,-.4,.45,-2.2,.08,.1,.7,JKk);pbox(B,.4,.45,-2.2,.08,.1,.7,JKk);pbox(B,0,.5,-2.35,.5,.12,.2,JKk);
 for(const i of[0,1,2])pbox(B,-.82,.55+i*.35,-.6,.04,.04,.5,JG);pbox(B,-.83,.4,-.58,.03,1.1,.04,JG);pbox(B,-.83,.4,-.1,.03,1.1,.04,JG);
 pcyl(B,-.32,1.7,1.0,.06,1.22,6,JK);pbox(B,-.34,2.9,.98,.16,.06,.14,JK);
 pbox(B,0,1.35,-.9,.5,.12,.5,JKk);pbox(B,0,1.45,-1.12,.5,.7,.1,JKk);pbox(B,0,1.7,.15,.4,.05,.3,JKk);
 // cab glass (single translucent mesh)
 pbox(Gl,0,1.3,.34,1.45,1.45,.03,[.65,.82,.78]);pbox(Gl,0,1.3,-1.54,1.45,1.45,.03,[.65,.82,.78]);for(const sx of[-1,1])pbox(Gl,sx*.74,1.3,-.6,.03,1.45,1.9,[.65,.82,.78]);
 TRG.add(B.mesh(mObj));const gm=Gl.mesh(new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.42,depthWrite:false}));TRG.add(gm);
 TW.rl=wheelMesh(.92,.52,14);TW.rr=wheelMesh(.92,.52,14);TW.fl=wheelMesh(.55,.34,11);TW.fr=wheelMesh(.55,.34,11);
 TW.rl.position.set(1.1,.92,-.85);TW.rr.position.set(-1.1,.92,-.85);TW.fl.position.set(.95,.55,1.55);TW.fr.position.set(-.95,.55,1.55);
 for(const k in TW)TRG.add(TW[k]);
 const dsp=pSpec(4242,{f:false,hs:4,ts:1,beard:true,gl:false,scarf:null,bag:0,bp:false,tc:[.3,.45,.3],sk:PSK[1],hr:PHR[4],w:1.05,h:1,old:true});const dr=mkPerson(dsp,mObj,TRG);dr.scale.setScalar(.82);dr.position.set(0,1.42-.92*.82,-.68);dr.l1.rotation.x=dr.l2.rotation.x=-1.45;dr.a1.rotation.x=dr.a2.rotation.x=-.95;TW.dr=dr}
const TR={x:FX+0,z:172,rot:Math.PI,st:'park',wi:0,pt:[],sp:0,win:-1,spin:0,cl:[[0,0,1.6],[0,0,1.6]]};COL.push(TR.cl[0],TR.cl[1]);
function offPath(pts,off){return pts.map((p,i)=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)];let dx=b[0]-a[0],dz=b[1]-a[1];const l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;return[p[0]+dz*off,p[1]-dx*off]})}
const TBASE=[];{TBASE.push([-97,170],[-105,154],[FX,140],[FX,112]);const R=GRR+RW+PW;for(let k=0;k<=8;k++){const a=Math.PI/2+k/8*Math.PI;TBASE.push([GRC[0]+Math.cos(a)*R,GRC[1]+Math.sin(a)*R])}TBASE.push([FX,30],[FX,6],[-98,0],[-80,0],[-55,0])}
const TOUT=offPath(TBASE.slice(2),1.9),TIN=offPath(TBASE.slice(2).reverse(),1.9);
TR.route=TOUT.concat([[-47,-1],[-45,1.2],[-48,2.5]]).concat(TIN);TR.route.push([-100,165],[-99,171],[-100,172.5]);
TRG.position.set(-100,FGY,172.5);TRG.rotation.y=Math.PI;TR.x=-100;TR.z=172.5;
function tractorGo(){if(TR.st!=='park')return;TR.st='go';TR.wi=0;TR.x=-100;TR.z=172.5}
function updTractor(dt){const n=TR.route,cx=cam.position.x,cz=cam.position.z;
 if(menuOpen||GAL.on)return;
 const win=(GT>=8&&GT<9.6)?1:(GT>=14&&GT<15.6)?2:0;
 if(win===0)TR.win=0;else if(TR.win!==win&&TR.st==='park'){TR.win=win;tractorGo()}
 if(TR.st==='go'){let t=n[TR.wi],dx=t[0]-TR.x,dz=t[1]-TR.z,d=Math.hypot(dx,dz);if(d<3&&TR.wi<n.length-1){TR.wi++;t=n[TR.wi];dx=t[0]-TR.x;dz=t[1]-TR.z;d=Math.hypot(dx,dz)}
  const want=Math.atan2(dx,dz);let da=want-TR.rot;da=Math.atan2(Math.sin(da),Math.cos(da));TR.rot+=Math.max(-1.1*dt,Math.min(1.1*dt,da));
  let sp=TR.wi>n.length-6?2.2:4.2;if(Math.abs(da)>.5)sp=2;
  // give way to the player's car/body ahead
  const px=P.x-TR.x,pz=P.z-TR.z,fx=Math.sin(TR.rot),fz=Math.cos(TR.rot),ah=px*fx+pz*fz,sd=Math.abs(px*fz-pz*fx);if(ah>0&&ah<7&&sd<2.6)sp=0;
  TR.sp+=(sp-TR.sp)*Math.min(1,dt*2);TR.x+=Math.sin(TR.rot)*TR.sp*dt;TR.z+=Math.cos(TR.rot)*TR.sp*dt;TR.spin+=TR.sp*dt;
  if(TR.wi>=n.length-1&&d<1.2){TR.st='park';TR.sp=0}}
 TRG.position.set(TR.x,FGY,TR.z);TRG.rotation.y=TR.rot;TRG.visible=Math.hypot(TR.x-cx,TR.z-cz)<scene.fog.far+40;
 TW.rl.rotation.x=TW.rr.rotation.x=TR.spin/.92;TW.fl.rotation.x=TW.fr.rotation.x=TR.spin/.55;
 const fx=Math.sin(TR.rot),fz=Math.cos(TR.rot);TR.cl[0][0]=TR.x+fx*1.2;TR.cl[0][1]=TR.z+fz*1.2;TR.cl[1][0]=TR.x-fx*1.0;TR.cl[1][1]=TR.z-fz*1.0}
/* farm animals */
const ANI=[];
function mkCow(i){const B=new Builder(3),sp=[[.95,.95,.95],[.14,.12,.12]],c=i%2?[.35,.22,.14]:sp[0],pt=i%2?[.9,.88,.8]:sp[1];pbox(B,0,.65,0,.7,.6,1.5,c);pbox(B,.2,.8,.2,.32,.3,.5,pt);pbox(B,-.22,.9,-.4,.3,.25,.4,pt);pbox(B,0,.9,.9,.36,.4,.5,c);pbox(B,0,.92,1.25,.28,.28,.2,[.9,.7,.65]);pbox(B,-.2,1.28,1.0,.08,.12,.08,[.9,.9,.85]);pbox(B,.2,1.28,1.0,.08,.12,.08,[.9,.9,.85]);for(const[x,z]of[[-.25,.6],[.25,.6],[-.25,-.6],[.25,-.6]])pbox(B,x,0,z,.14,.7,.14,dk(c,.8));pbox(B,0,.9,-.8,.08,.5,.08,dk(c,.7));return B.mesh(mObj)}
function mkSheep(){const B=new Builder(3);pbox(B,0,.45,0,.6,.5,.8,[.92,.9,.85]);pbox(B,0,.62,.52,.22,.26,.28,[.2,.18,.16]);for(const[x,z]of[[-.2,.28],[.2,.28],[-.2,-.28],[.2,-.28]])pbox(B,x,0,z,.08,.46,.08,[.2,.18,.16]);return B.mesh(mObj)}
for(let i=0;i<6;i++){const m=i<3?mkCow(i):mkSheep();scene.add(m);const a={m,x:-165+Math.random()*24,z:150+Math.random()*50,tx:0,tz:0,t:Math.random()*5,ry:Math.random()*6};a.tx=a.x;a.tz=a.z;ANI.push(a)}
function updAnimals(dt){const cx=cam.position.x,cz=cam.position.z;for(const a of ANI){const d=Math.hypot(a.x-cx,a.z-cz);a.m.visible=d<scene.fog.far+20;if(!a.m.visible)continue;a.t-=dt;if(a.t<=0){a.t=3+Math.random()*7;if(Math.random()<.6){a.tx=-166+Math.random()*26;a.tz=148+Math.random()*54}else{a.tx=a.x;a.tz=a.z}}
  const dx=a.tx-a.x,dz=a.tz-a.z,L=Math.hypot(dx,dz);if(L>.3){const w=Math.atan2(dx,dz);let da=w-a.ry;da=Math.atan2(Math.sin(da),Math.cos(da));a.ry+=da*Math.min(1,dt*2);a.x+=Math.sin(a.ry)*.55*dt;a.z+=Math.cos(a.ry)*.55*dt}
  a.m.position.set(a.x,FGY,a.z);a.m.rotation.y=a.ry}}
/* honesty stall */
function farmNear(){if(!GS.onFoot||GS.inside)return null;const d=Math.hypot(P.x+109.5,P.z-128);if(d>3.2)return null;return{d:d*.5,btn:{label:'FARM MILK £2',fn:()=>{if(cash<2){toast('LEAVE £2 IN THE BOX');return}cash-=2;ST=100;exh=0;beep(520,.12,'square',.06);toast('COLD MILK. STAMINA FULL (-£2)')}}}}
{const g0=gardenNear;gardenNear=function(){const g=g0();const c=farmNear();return c&&(!g||c.d<g.d)?c:g}}
{const u0=updCozy;updCozy=function(dt){u0(dt);updTractor(dt);updAnimals(dt)}}
/* ---- food + energy: eating and sleeping now matter ---- */
var HN={food:80,en:100,tip:0,rum:0,yawn:0,lastWarn:0};
const FOODT={'A CUPPA':[8,12],'A TEA':[10,15],'CHIPS':[45,6],'A BUN':[24,8],'LUCOZADE':[6,32],'A PASTY':[40,5],'CHEESE ROLL':[34,5],'SNACK':[16,3],'A DAISY':[0,0],'A COMIC':[0,0]};
const HUNGRY=25,TIRED=30;
function fed(h,e,msg){HN.food=Math.min(100,HN.food+h);HN.en=Math.min(100,HN.en+e);ST=Math.min(100,ST+25+h*.5);if(h>=10||e>=10)exh=0;beep(520,.12,'square',.06);setTimeout(()=>beep(780,.14,'square',.06),110);toast(msg||('YUM! FOOD +'+h+(e?' ENERGY +'+e:'')))}
eat=function(){fed(12,0,'STALE CRUST. BETTER THAN NOTHING')};
/* HUD */
function hnHud(){let e=document.getElementById('hnhud');if(!e){e=document.createElement('div');e.id='hnhud';e.style.cssText='position:fixed;left:12px;top:84px;z-index:20;font:bold 10px monospace;color:#fff;pointer-events:none;text-shadow:1px 1px 0 #000;width:132px';e.innerHTML='<div>FOOD <span id="hnF" style="float:right"></span><div style="height:7px;background:rgba(0,0,0,.55);border:1px solid #fff"><div id="hnFb" style="height:100%;background:#e8a030"></div></div></div><div style="margin-top:3px">ENERGY <span id="hnE" style="float:right"></span><div style="height:7px;background:rgba(0,0,0,.55);border:1px solid #fff"><div id="hnEb" style="height:100%;background:#5aa0e8"></div></div></div>';document.body.appendChild(e);const v=document.createElement('div');v.id='hnvig';v.style.cssText='position:fixed;inset:0;z-index:5;pointer-events:none;opacity:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 45%,rgba(10,10,40,.75) 100%)';document.body.appendChild(v)}
 const s=(i,v,low)=>{const b=document.getElementById(i+'b'),t=document.getElementById(i==='hnF'?'hnF':'hnE');b.style.width=Math.max(0,Math.min(100,v))+'%';b.style.background=low?'#d83030':(i==='hnF'?'#e8a030':'#5aa0e8');t.textContent=low?(i==='hnF'?'HUNGRY!':'TIRED!'):''};s('hnF',HN.food,HN.food<=HUNGRY);s('hnE',HN.en,HN.en<=TIRED);
 e.style.display=(menuOpen||GAL.on)?'none':'block';document.getElementById('hnvig').style.opacity=menuOpen?0:HN.en<TIRED?Math.min(.9,(TIRED-HN.en)/TIRED*1.1):0}
/* time passes */
function hnTick(dt){if(menuOpen||busy||GAL.on)return;const gh=dt/30,run=GS.onFoot&&P.speed>4&&!exh;
 HN.food=Math.max(0,HN.food-gh*(6+(run?1.5:0)));
 HN.en=Math.max(0,HN.en-gh*(4.2+(HN.food<=HUNGRY?1.2:0)+(run?1:0)));
 if(HN.food<=HUNGRY)ST=Math.min(ST,55+HN.food);
 HN.lastWarn-=dt;if(HN.lastWarn<=0){if(HN.food<=0){toast('STARVING! GET SOMETHING TO EAT');HN.lastWarn=40}else if(HN.food<=HUNGRY){toast('YOUR TUMMY RUMBLES... TIME TO EAT');HN.lastWarn=55}else if(HN.en<=TIRED&&HN.en>0){toast(HN.en<12?'YOU CAN BARELY KEEP YOUR EYES OPEN':'*YAWN* GETTING SLEEPY');HN.lastWarn=50}}
 if(HN.en<=0)passOut()}
function passOut(){HN.en=45;HN.food=Math.max(8,HN.food-10);P.speed=0;GS.speed=0;fade(()=>{GT+=3;if(GT>=24){GT-=24;newDay()}const b=hband();todI=b;applyTOD(b);toast('YOU NODDED OFF FOR A WHILE...')})}
/* slow when tired */
function tireF(){const e=HN.en,f=e>=TIRED?1:e>=12?.88:.74;return f*(HN.food<=0?.88:1)}
{const s0=stepFoot;stepFoot=function(dt){const f=tireF();if(f<1&&P.speed>0){if(HN.en<TIRED&&Math.random()<.002)toast('*YAWN*')}s0(dt*f)}}
{const s0=stepIn;stepIn=function(dt){s0(dt*tireF())}}
/* jobs need a full tummy */
{const s0=startJob;startJob=function(d,o){if(HN.food<=HUNGRY){jobCool=12;toast('TOO HUNGRY TO WORK. GRAB A BITE FIRST!');return}if(HN.en<=8){jobCool=12;toast('TOO SLEEPY TO WORK. GO HOME AND REST');return}s0(d,o)}}
/* food in shops */
{const b0=buildShop;buildShop=function(o){b0(o);for(const a of IA){if(typeof a.label==='string'&&a.label.indexOf('BUY ')===0){const m=a.label.match(/^BUY (.+?) £(\d+)/);if(m){const nm=m[1],pr=+m[2],ft=FOODT[nm]||[10,3];a.fn=()=>{if(cash<pr){toast('NOT ENOUGH CASH');return}if(HN.food>=96&&ft[0]>0&&ft[1]<20){toast('YOU ARE FULL UP');return}cash-=pr;if(nm==='A DAISY'){toast('LOVELY. THANK YOU');INV.flower=(INV.flower|0)+0;beep(700,.1,'sine',.05);return}if(nm==='A COMIC'){toast('GOOD READ. YOU FEEL CHEERY');beep(700,.1,'sine',.05);return}fed(ft[0],ft[1],'MMM. FOOD +'+ft[0]+(ft[1]?'  ENERGY +'+ft[1]:'')+' (-£'+pr+')')}}}
 if(typeof a.label==='string'&&a.label.indexOf('START SHIFT')===0){const f0=a.fn;a.fn=()=>{if(CF&&CF.on)return f0();if(HN.food<=HUNGRY){toast('YOU ARE TOO HUNGRY FOR A SHIFT');return}if(HN.en<=15){toast('YOU ARE TOO TIRED FOR A SHIFT');return}f0()}}}}}
/* farm milk */
{const g0=gardenNear;gardenNear=function(){const g=g0();if(g&&g.btn&&g.btn.label==='FARM MILK £2'){g.btn.fn=()=>{if(cash<2){toast('LEAVE £2 IN THE BOX');return}if(HN.food>=96){toast('YOU ARE FULL UP');return}cash-=2;fed(22,10,'COLD FRESH MILK. FOOD +22 (-£2)')}}return g}}
/* fridge + cooking */
const MEATS=['roach','perch','trout','pike'],VEG=['carrot','tomato'];
const haveK=k=>INV[k]|0,takeAny=(ks,n)=>{let c=0;for(const k of ks){while(haveK(k)>0&&c<n){INV[k]--;c++}}return c},cntN=ks=>ks.reduce((a,k)=>a+haveK(k),0);
const MEALS=[
 {n:'FISH & VEG STEW',need:'1 FISH + 1 VEG',ok:()=>cntN(MEATS)>=1&&cntN(VEG)>=1,go:()=>{takeAny(MEATS,1);takeAny(VEG,1);fed(55,8,'DELICIOUS STEW! FOOD +55 ENERGY +8')}},
 {n:'FRIED FISH',need:'1 FISH',ok:()=>cntN(MEATS)>=1,go:()=>{takeAny(MEATS,1);fed(35,3,'CRISPY FISH! FOOD +35')}},
 {n:'GARDEN SOUP',need:'2 CARROT/TOMATO',ok:()=>cntN(VEG)>=2,go:()=>{takeAny(VEG,2);fed(40,6,'WARM SOUP! FOOD +40')}},
 {n:'PUMPKIN PIE',need:'1 PUMPKIN',ok:()=>haveK('pumpkin')>=1,go:()=>{INV.pumpkin--;fed(65,10,'PUMPKIN PIE! FOOD +65 ENERGY +10')}},
 {n:'GOLDEN CARP FEAST',need:'1 GOLDEN CARP',ok:()=>haveK('carp')>=1,go:()=>{INV.carp--;fed(90,25,'A FEAST FIT FOR A KING!')}}];
CUSTOM_SHOP.fridge=function(msg){document.getElementById('shT').textContent='KITCHEN';document.getElementById('shMsg').textContent=msg||('FOOD '+Math.round(HN.food)+'/100');
 MEALS.forEach(m=>{const ok=m.ok();dRow(m.n+'  ('+m.need+')',[[ok?'COOK':'NEED MORE',()=>{if(!m.ok())return renderShop('YOU NEED '+m.need);if(HN.food>=96)return renderShop('YOU ARE FULL UP');closeShop();m.go()},ok]])});
 dRow('STALE CRUST FROM THE BREADBIN (FREE)',[['EAT',()=>{if(HN.food>=96)return renderShop('YOU ARE FULL UP');closeShop();eat()}]]);dRow('',[['BACK',()=>closeShop()]])};
/* bed: sleep, nap */
const sl0=sleepNow;
function sleepFull(){HN.en=100;HN.food=Math.max(25,HN.food-22);sl0()}
CUSTOM_SHOP.bed=function(msg){document.getElementById('shT').textContent='BED';document.getElementById('shMsg').textContent=msg||('ENERGY '+Math.round(HN.en)+'/100   FOOD '+Math.round(HN.food)+'/100');
 dRow('SLEEP UNTIL MORNING & SAVE',[['SLEEP',()=>{closeShop();sleepFull()}]]);
 dRow('QUICK NAP (1 HOUR, ENERGY +25)',[['NAP',()=>{closeShop();fade(()=>{GT+=1;if(GT>=24){GT-=24;newDay()}HN.en=Math.min(100,HN.en+25);HN.food=Math.max(0,HN.food-6);const b=hband();todI=b;applyTOD(b);toast('ZZZ... ENERGY +25')})}]]);
 dRow('SAVE GAME ONLY',[['SAVE',()=>{closeShop();saveGame()}]]);dRow('',[['BACK',()=>closeShop()]])};
for(const arr of[IA,HOUSE_A])for(const a of arr){if(a.label==='OPEN FRIDGE')a.fn=()=>openShop('fridge');if(a.label==='SLEEP & SAVE'||a.label==='SAVE GAME'){a.label='BED: SLEEP / NAP';a.fn=()=>openShop('bed')}}
/* loop + save */
{const u0=updCozy;updCozy=function(dt){u0(dt);hnTick(dt);hnHud()}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.hn={f:HN.food,e:HN.en,t:HN.tip};return o};cozyLoad=function(z){l0(z);if(z&&z.hn){HN.food=z.hn.f;HN.en=z.hn.e;HN.tip=z.hn.t|0}}}
setTimeout(()=>{if(!HN.tip){HN.tip=1;toast('TIP: KEEP AN EYE ON FOOD AND ENERGY')}},9000);
/* ---- pub darts: a regular by the board + the aim-and-stop mini-game ---- */
const DORD=[20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5],DARTNAME='OLD ARTHUR';
var DG=null,DSTAT={w:0,l:0,d:0,best:0};
function dartScore(x,y){const r=Math.hypot(x,y);if(r>1)return{v:0,t:'MISS'};if(r<=.037)return{v:50,t:'BULLSEYE!'};if(r<=.094)return{v:25,t:'OUTER BULL 25'};
 const th=(Math.atan2(x,-y)+Math.PI/20+6.2832)%6.2832,n=DORD[Math.floor(th/(Math.PI/10))%20];if(r>=.953)return{v:n*2,t:'DOUBLE '+n,n,m:2};if(r>=.582&&r<=.629)return{v:n*3,t:'TREBLE '+n,n,m:3};return{v:n,t:''+n,n,m:1}}
function dartBoardImg(S){const c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d'),C=S/2,R=S*.44;
 g.fillStyle='#1b1410';g.beginPath();g.arc(C,C,C-1,0,6.3);g.fill();g.fillStyle='#0b0b0b';g.beginPath();g.arc(C,C,R*1.15,0,6.3);g.fill();
 for(let i=0;i<20;i++){const a0=(i*18-9-90)*Math.PI/180,a1=a0+18*Math.PI/180,dark=i%2===0,s=dark?'#161616':'#eadcae',rc=dark?'#c42622':'#1f8c40';
  const ring=(r0,r1,col)=>{g.fillStyle=col;g.beginPath();g.arc(C,C,R*r1,a0,a1);g.arc(C,C,R*r0,a1,a0,true);g.closePath();g.fill()};
  ring(.094,.582,s);ring(.582,.629,rc);ring(.629,.953,s);ring(.953,1,rc)}
 // sisal grain
 g.globalAlpha=.07;for(let i=0;i<5000;i++){const a=Math.random()*6.283,r=Math.random()*R;g.fillStyle=Math.random()<.5?'#000':'#fff';g.fillRect(C+Math.cos(a)*r,C+Math.sin(a)*r,1.5,1.5)}g.globalAlpha=1;
 g.strokeStyle='#c8c8c8';g.lineWidth=S*.0022;for(const r of[.094,.582,.629,.953,1]){g.beginPath();g.arc(C,C,R*r,0,6.3);g.stroke()}
 for(let i=0;i<20;i++){const a=(i*18-9-90)*Math.PI/180;g.beginPath();g.moveTo(C+Math.cos(a)*R*.094,C+Math.sin(a)*R*.094);g.lineTo(C+Math.cos(a)*R,C+Math.sin(a)*R);g.stroke()}
 g.fillStyle='#1f8c40';g.beginPath();g.arc(C,C,R*.094,0,6.3);g.fill();g.fillStyle='#c42622';g.beginPath();g.arc(C,C,R*.037,0,6.3);g.fill();g.strokeStyle='#c8c8c8';g.beginPath();g.arc(C,C,R*.094,0,6.3);g.stroke();g.beginPath();g.arc(C,C,R*.037,0,6.3);g.stroke();
 g.fillStyle='#f4f4f4';g.font='bold '+Math.round(S*.058)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';for(let i=0;i<20;i++){const a=(i*18-90)*Math.PI/180;g.fillText(DORD[i],C+Math.cos(a)*R*1.075,C+Math.sin(a)*R*1.075)}
 return c}
/* ---- in-world zoom ---- */
const DZ={k:0,on:0,tp:null,look:null,fov:46,bc:null,mesh:null,darts:[],pend:null};
const DR=.34;
(function(){const st=document.createElement('style');st.textContent='body.dz #hud,body.dz #pedals,body.dz #pad,body.dz #top,body.dz #topbtns,body.dz #bUse,body.dz #speed,body.dz #mph,body.dz #sta,body.dz #hnhud,body.dz #cfhud,body.dz #arrow{display:none!important}';document.head.appendChild(st)})();
function dzTarget(){if(DZ.fn)return DZ.fn();const th=Math.tan(DZ.fov*Math.PI/360),a=Math.max(.3,cam.aspect||1.6),nw=DR*1.22*1.03,nh=((cam.aspect||1.6)>1.3?.78:.86*1.04),d=Math.max(1.0,nw/(th*a),nh/th);DZ.dist=Math.min(d,3.9);const p=SG.localToWorld(new THREE.Vector3(-4.12+PDX+DZ.dist,1.2,.6));if(DZ.bc){DZ.look=DZ.bc.clone();DZ.look.y=p.y}return p}
function mkDartMesh(col){const g=new THREE.Group(),m=c=>new THREE.MeshBasicMaterial({color:c}),bx=(x,y,z,c,px,py,pz)=>{const q=new THREE.Mesh(new THREE.BoxGeometry(x,y,z),m(c));q.position.set(px||0,py||0,pz||0);g.add(q)};
 bx(.012,.012,.07,0xb8b8c0,0,0,-.035);bx(.004,.004,.04,0xd8d8e0,0,0,.02);bx(.006,.006,.06,0x303030,0,0,-.09);bx(.04,.002,.04,col,0,0,-.13);bx(.002,.04,.04,col,0,0,-.13);return g}
function dartsOpen(){if(DG||!window.DBOARD)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;document.body.classList.add('dz');man.visible=false;if(window.DMAN)DMAN.visible=false;
 DZ.bc=DBOARD.getWorldPosition(new THREE.Vector3());DZ.tp=dzTarget();DZ.look=DZ.bc.clone();DZ.on=1;
 const ov=document.createElement('div');ov.id='dtov';ov.style.cssText='position:fixed;inset:0;z-index:60;font:bold 13px monospace;color:#fff;touch-action:none;user-select:none';
 const cv=document.createElement('canvas');cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none';cv.width=innerWidth;cv.height=innerHeight;
 const hud=document.createElement('div');hud.style.cssText='position:absolute;left:0;right:0;top:8px;text-align:center;pointer-events:none;text-shadow:2px 2px 0 #000';hud.innerHTML='<div id="dtT" style="color:#f5e6a0;font-size:15px">DARTS vs '+DARTNAME+'</div><div id="dtS" style="font-size:13px"></div><div id="dtM" style="min-height:20px;color:#9fe;font-size:13px"></div>';
 const stop=document.createElement('button'),lv=document.createElement('button');const bs='position:absolute;font:bold 20px monospace;border:3px solid #f5e6a0;border-radius:10px;color:#fff;touch-action:manipulation;pointer-events:auto;';
 stop.style.cssText=bs+'right:14px;bottom:14px;padding:18px 26px;background:#b02020';stop.textContent='STOP!';lv.style.cssText=bs+'right:14px;top:10px;font-size:12px;padding:8px 12px;background:#333';lv.textContent='LEAVE';ov.append(cv,hud,stop,lv);document.body.append(ov);
 const stake=cash>=2?2:0;if(stake)cash-=2;
 DG={ov,cv,g:cv.getContext('2d'),ph:'zoom',a:0,t:0,rd:1,dn:0,pd:[],od:[],ps:0,os:0,stake,msg:'',mt:0,fly:null,raf:0,last:performance.now(),ot:0,pop:null,spd:2.6,rdScore:0,rdDarts:[],stop,lv,rpos:0,lockA:0,rr:[[null,null,null],[null,null,null]],dl:[[],[]]};chalkDraw();
 ov.onpointerdown=e=>{if(e.target===ov||e.target===cv){e.preventDefault();dartsStop()}};stop.onpointerdown=e=>{e.preventDefault();e.stopPropagation();dartsStop()};lv.onclick=()=>dartsClose(1);
 DG.kd=e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();dartsStop()}else if(e.code==='Escape')dartsClose(1)};addEventListener('keydown',DG.kd);
 DG.raf=requestAnimationFrame(dartsLoop)}
function rndN(){return(Math.random()+Math.random()+Math.random()-1.5)*1.6}
function dartsMsg(t,ms){if(!DG)return;DG.msg=t;DG.mt=ms||2000;const e=document.getElementById('dtM');if(e)e.textContent=t}
function dartsStats(){const s=document.getElementById('dtS');if(!s||!DG)return;s.innerHTML='ROUND '+Math.min(3,DG.rd)+'/3 · DART '+Math.min(3,DG.dn+1)+(DG.stake?' &nbsp; <span style="color:#aaa">STAKE £'+DG.stake+'</span>':'')}
function dartsStop(){if(!DG)return;if(DG.ph==='angle'){DG.ph='radius';DG.lockA=DG.a;DG.t=0;beep(500,.05,'square',.05)}else if(DG.ph==='radius'){const r=DG.rpos;DG.ph='fly';beep(380,.05,'square',.05);const jit=.012+Math.random()*.012,ang=Math.random()*6.283,j=Math.random()*jit;const x=Math.sin(DG.lockA)*r+Math.cos(ang)*j,y=-Math.cos(DG.lockA)*r+Math.sin(ang)*j;dartsThrow(0,x,y)}}
function bw(u,v,off){return new THREE.Vector3(DZ.bc.x+(off||0),DZ.bc.y-v*DR,DZ.bc.z-u*DR)}
function dartsThrow(who,x,y){const c=cam.position.clone(),right=new THREE.Vector3(0,0,-1);const st=c.clone().add(right.clone().multiplyScalar(who?.7:.22)).add(new THREE.Vector3(-.25,-.22,0));const m=mkDartMesh(who?0x3a78d8:0xe8c030);scene.add(m);DG.fly={x,y,t:0,who,m,st,en:bw(x,y,.015)}}
function dartsLand(who,x,y){const s=dartScore(x,y);{const k=DG.rd-1,sh=s.v===50?'BULL':s.v===25?'25':s.m===3?'T'+s.n:s.m===2?'D'+s.n:''+s.v;DG.dl[who].push(sh);DG.rr[who][k]=(DG.rr[who][k]|0)+s.v;if(DG.dl[who].length>=3)setTimeout(()=>{if(DG)chalkDraw()},0)}(who?DG.od:DG.pd).push([x,y]);DG.pop={t:1.4,s:s.t,x,y,who};if(s.v>=40||s.m===3)beep(900,.1,'square',.06);else beep(240,.07,'square',.05);return s}
function stickDart(f){const tilt=.18;f.m.position.copy(f.en);f.m.rotation.set((Math.random()-.5)*tilt,Math.PI/2*-1+(Math.random()-.5)*tilt+Math.PI,0);f.m.lookAt(f.en.x-1,f.en.y+(Math.random()-.5)*.03,f.en.z+(Math.random()-.5)*.03);DZ.darts.push(f.m)}
function clearDarts(){for(const m of DZ.darts)scene.remove(m);DZ.darts=[]}
function proj(p){const v=p.clone().project(cam);return[(v.x*.5+.5)*DG.cv.width,(-v.y*.5+.5)*DG.cv.height]}
function dartsLoop(now){if(!DG)return;const dt=Math.min(.05,(now-DG.last)/1000);DG.last=now;
 if(DG.cv.width!==innerWidth){DG.cv.width=innerWidth;DG.cv.height=innerHeight}
 if(DG.mt>0){DG.mt-=dt*1000;if(DG.mt<=0){const e=document.getElementById('dtM');if(e)e.textContent=''}}
 if(DG.ph==='zoom'){if(DZ.k>=.98){DG.ph='angle';DG.a=Math.random()*6.28;dartsMsg('3 DARTS EACH, 3 ROUNDS. STOP THE SPINNING AIM, THEN THE SLIDING AIM!',4500)}}
 else if(DG.ph==='angle'){DG.a+=DG.spd*dt}else if(DG.ph==='radius'){DG.t+=dt;DG.rpos=Math.sin(DG.t*(DG.spd*.95))*1.08}
 else if(DG.ph==='fly'||DG.fly){const f=DG.fly;if(f){f.t+=dt/.3;const k=Math.min(1,f.t),e=1-(1-k)*(1-k);f.m.position.lerpVectors(f.st,f.en,e);f.m.position.y+=Math.sin(k*3.14)*.1;f.m.lookAt(f.en);if(k>=1){const s=dartsLand(f.who,f.x,f.y);stickDart(f);DG.fly=null;if(f.who===0){DG.rdScore+=s.v;DG.ps+=s.v;DG.rdDarts.push(s);DG.dn++;DG.ph='wait';DG.wt=1.1}else{DG.os+=s.v;DG.odn++;dartsMsg(DARTNAME.split(' ')[1]+': '+(s.t||s.v),900);DG.ot=.9;if(DG.odn>=3){DG.ph='endround';DG.wt=1.4}}}}}
 if(DG.ph==='wait'){DG.wt-=dt;if(DG.wt<=0){if(DG.dn>=3){if(DG.rdDarts.length===3&&DG.rdDarts.every(d=>d.n===20&&d.m===3)){cash+=10;toast('ONE HUNDRED AND EIGHTY!!! +£10');beep(1200,.3,'square',.07)}if(DG.rdDarts.length===3&&DG.rdDarts.every(d=>d.v===50)){cash+=15;toast('THREE BULLSEYES! +£15')}DG.ph='opp';DG.ot=.6;DG.odn=0;dartsMsg(DARTNAME+' STEPS UP...',1200)}else{DG.ph='angle';DG.a=Math.random()*6.28}}}
 else if(DG.ph==='opp'&&!DG.fly){DG.ot-=dt;if(DG.ot<=0){const sk=.2,tgt=Math.random()<.4?[0,-.605]:Math.random()<.5?[0,-.2]:[Math.random()*.9-.45,Math.random()*.9-.45];const ang=Math.random()*6.28,j=Math.abs(rndN())*sk;dartsThrow(1,tgt[0]+Math.cos(ang)*j,tgt[1]+Math.sin(ang)*j);DG.ot=9}}
 else if(DG.ph==='endround'){DG.wt-=dt;if(DG.wt<=0){DG.rd++;DG.dn=0;DG.rdScore=0;DG.rdDarts=[];DG.pd=[];DG.od=[];DG.dl=[[],[]];clearDarts();if(DG.rd>3)dartsEnd();else{DG.ph='angle';DG.a=Math.random()*6.28;DG.spd=2.6+DG.rd*.35;dartsMsg('ROUND '+DG.rd+'. THEY SPEED UP...',1500)}}}
 dartsStats();if(DG.chk!==DG.ps+'|'+DG.os+'|'+DG.rd+'|'+DG.dl[0].length+DG.dl[1].length){DG.chk=DG.ps+'|'+DG.os+'|'+DG.rd+'|'+DG.dl[0].length+DG.dl[1].length;chalkDraw()}dartsDraw(dt);DG.raf=requestAnimationFrame(dartsLoop)}
function dartsDraw(dt){const g=DG.g,W=DG.cv.width,H=DG.cv.height;g.clearRect(0,0,W,H);if(DG.ph==='zoom'||DG.ph==='done')return;
 const c0=proj(bw(0,0,.02)),c1=proj(bw(1,0,.02)),R=Math.hypot(c1[0]-c0[0],c1[1]-c0[1]),at=(u,v)=>proj(bw(u,v,.02));
 if(DG.ph==='angle'||DG.ph==='radius'){const a=DG.ph==='angle'?DG.a:DG.lockA,p0=at(-Math.sin(a)*1.1,Math.cos(a)*1.1),p1=at(Math.sin(a)*1.1,-Math.cos(a)*1.1);g.strokeStyle='rgba(255,255,255,'+(DG.ph==='radius'?.6:.35)+')';g.setLineDash([8,8]);g.lineWidth=2;g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.stroke();g.setLineDash([]);
  const rp=DG.ph==='angle'?[Math.sin(a)*1.1,-Math.cos(a)*1.1]:[Math.sin(a)*DG.rpos,-Math.cos(a)*DG.rpos],q=at(rp[0],rp[1]),r=R*(DG.ph==='angle'?.075:.06);g.strokeStyle='#ff3030';g.lineWidth=3;g.beginPath();g.arc(q[0],q[1],r,0,6.3);g.moveTo(q[0]-r*1.6,q[1]);g.lineTo(q[0]+r*1.6,q[1]);g.moveTo(q[0],q[1]-r*1.6);g.lineTo(q[0],q[1]+r*1.6);g.stroke();g.strokeStyle='#fff';g.lineWidth=1;g.stroke()}
 if(DG.pop&&DG.pop.t>0){DG.pop.t-=dt;const q=at(DG.pop.x,DG.pop.y);g.font='bold '+Math.round(Math.max(18,R*.2))+'px monospace';g.textAlign='center';const y=q[1]-R*.2-(1.4-DG.pop.t)*20;g.fillStyle='rgba(0,0,0,.7)';g.fillText(DG.pop.s,q[0]+2,y+2);g.fillStyle=DG.pop.who?'#7ac0ff':'#ffe27a';g.fillText(DG.pop.s,q[0],y)}}
function dartsEnd(){const p=DG.ps,o=DG.os;let m,pay=0;if(p>o){m='YOU WIN '+p+'-'+o+'!';pay=DG.stake?5:0;DSTAT.w++}else if(p<o){m='YOU LOSE '+p+'-'+o+'. GOOD GAME!';DSTAT.l++}else{m='A DRAW! '+p+'-'+o;pay=DG.stake;DSTAT.d++}
 if(p>DSTAT.best)DSTAT.best=p;cash+=pay;DG.ph='done';GT+=.4;if(GT>=24){GT-=24;newDay()}HN.en=Math.max(0,HN.en-3);
 const e=document.getElementById('dtT');e.textContent=m;dartsMsg((pay?'+£'+pay+'  ':'')+'W'+DSTAT.w+' L'+DSTAT.l+' D'+DSTAT.d+'  BEST '+DSTAT.best,60000);DG.stop.textContent='PLAY AGAIN (£2)';DG.stop.style.background='#2a7a3a';DG.stop.onpointerdown=ev=>{ev.preventDefault();ev.stopPropagation();dartsClose(0);setTimeout(dartsOpen,50)};DG.ov.onpointerdown=null}
function dartsClose(q){if(!DG)return;cancelAnimationFrame(DG.raf);removeEventListener('keydown',DG.kd);DG.ov.remove();if(DG.fly)scene.remove(DG.fly.m);clearDarts();if(q&&DG.ph!=='done'&&DG.stake)toast('YOU WALKED OFF. STAKE LOST');DG=null;chalkDraw();DZ.on=0;document.body.classList.remove('dz');man.visible=true;if(window.DMAN)DMAN.visible=true;DZ.exit=1}
/* camera follow (moved here: later code wraps it) */
function updateCam(dt){
 const T=GS.onFoot?P:GS,sp=GS.onFoot?0:GS.speed;
 const m=menuOpen?{d:8.5,h:2.4,f:50}:GS.inside?{d:4.4,h:3.9,f:60}:GS.onFoot?{d:4.4,h:1.9,f:62}:CAMS[camMode];
 if(menuOpen)camAng+=dt*.4;else if(CAMD.hold>0&&!GS.inside){CAMD.hold-=dt*(Math.abs(T.speed||0)>1.2?3:1)}else{let da=T.psi-camAng;da=Math.atan2(Math.sin(da),Math.cos(da));camAng+=da*Math.min(1,dt*(GS.onFoot?4:3.2));CAMD.el-=CAMD.el*Math.min(1,dt*2)}
 let d=m.d+sp*.06;if(!GS.inside&&!menuOpen&&!GAL.on)d=camClip(T,d,dt);let px=T.x-Math.sin(camAng)*d,pz=T.z-Math.cos(camAng)*d;if(GS.inside&&SG.visible&&SHOPCUR&&SHOPCUR.o&&(SHOPCUR.o.t==='NEON ARCADE'||SHOPCUR.o.t==='BULLSEYE RANGE'||SHOPCUR.o.casino)){px=clamp(px,IX-RX+.5,IX+RX-.5);pz=clamp(pz,IZ-RZ+.5,IZ+RZ-.5)}const py=GS.inside?T.y+m.h:Math.max(T.y+m.h+(window.CUP||0)+(GS.inside?0:CAMD.el),hAt(px,pz)+1.2);
 cam.position.set(px,py,pz);if(window.DBGC){const c=window.DBGC,a=T.psi+c[0];cam.position.set(T.x+Math.sin(a)*c[1],T.y+c[2],T.z+Math.cos(a)*c[1]);cam.lookAt(T.x+(c[5]||0)*Math.sin(a+1.5708),T.y+c[3],T.z+(c[5]||0)*Math.cos(a+1.5708));cam.fov=c[4]||30;cam.updateProjectionMatrix();skyG.position.copy(cam.position);return}cam.lookAt(T.x+Math.sin(camAng)*2.5,T.y+(GS.onFoot?1.2:1.1),T.z+Math.cos(camAng)*2.5);
 const tf=m.f+sp*.3;if(Math.abs(tf-fovNow)>.05){fovNow=lerp(fovNow,tf,Math.min(1,dt*4));cam.fov=fovNow;cam.updateProjectionMatrix()}
 skyG.position.copy(cam.position)}
{const u0=updateCam;updateCam=function(dt){u0(dt);if(DZ.on&&DZ.k<1)DZ.k=Math.min(1,DZ.k+dt*1.8);else if(!DZ.on&&DZ.k>0)DZ.k=Math.max(0,DZ.k-dt*2.2);
 if(DZ.k>.001&&DZ.tp){DZ.tp=dzTarget();const e=DZ.k*DZ.k*(3-2*DZ.k),dir=new THREE.Vector3();cam.getWorldDirection(dir);const l0=cam.position.clone().add(dir.multiplyScalar(5));cam.position.lerp(DZ.tp,e);l0.lerp(DZ.look,e);cam.lookAt(l0);cam.fov=lerp(cam.fov,DZ.fov,e);cam.updateProjectionMatrix();skyG.position.copy(cam.position)}
 else if(DZ.exit){DZ.exit=0;cam.fov=fovNow;cam.updateProjectionMatrix();busy=0}}}

/* ---- chalkboard scoreboard ---- */
function chalkDraw(){if(!window.CHALK)return;const c=CHALK.cv,g=c.getContext('2d'),W=c.width,H=c.height;g.fillStyle='#1f2a25';g.fillRect(0,0,W,H);
 for(let i=0;i<260;i++){g.fillStyle='rgba(255,255,255,'+(Math.random()*.035)+')';g.fillRect(Math.random()*W,Math.random()*H,Math.random()*70+10,Math.random()*3+1)}
 const F='"Segoe Print","Chalkboard SE","Comic Sans MS",cursive',ink='rgba(246,244,232,.93)';g.textBaseline='middle';
 const t=(txt,x,y,sz,al,col)=>{g.font='bold '+sz+'px '+F;g.textAlign=al||'left';g.fillStyle=col||ink;g.fillText(txt,x+(Math.random()-.5)*1.2,y+(Math.random()-.5)*1.2)};
 const line=(x0,y0,x1,y1)=>{g.strokeStyle=ink;g.lineWidth=3;g.lineCap='round';g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1+(Math.random()-.5)*2);g.stroke()};
 const D=window.DG;t('DARTS',W/2,34,46,'center');line(W*.3,58,W*.7,58);
 if(!D){t('OLD ARTHUR  vs  YOU',W/2,98,30,'center','#ffe9a0');t('WINS '+DSTAT.w+'   LOSSES '+DSTAT.l+'   DRAWS '+DSTAT.d,W/2,160,28,'center');t('BEST SCORE: '+DSTAT.best,W/2,205,30,'center','#ffe9a0');t('LOSER BUYS THE NEXT ROUND',W/2,262,22,'center','rgba(246,244,232,.6)');CHALK.tx.needsUpdate=true;return}
 const cx=[W*.2,W*.56,W*.86];t('YOU',cx[1],92,32,'center','#ffe9a0');t('ARTHUR',cx[2]-8,92,32,'center','#9fd0ff');line(W*.07,114,W*.95,114);line(W*.4,76,W*.4,H-70);
 for(let r=0;r<3;r++){const y=142+r*46,cur=D.rd===r+1&&D.ph!=='done';t('RD '+(r+1),W*.08,y,26,'left',cur?'#ffe9a0':ink);
  const my=D.rr[0][r],ar=D.rr[1][r];t(my==null?(cur?(D.dl[0].join(' ')||'-'):'-'):(cur&&D.dl[0].length?D.dl[0].join(' '):''+my),cx[1],y,my==null&&cur?22:30,'center');t(ar==null?'-':''+ar,cx[2]-8,y,30,'center');
  if(cur)g.strokeStyle='rgba(255,233,160,.7)',g.lineWidth=2,g.strokeRect(W*.05,y-20,W*.9,40)}
 line(W*.07,H-62,W*.95,H-62);t('TOTAL',W*.08,H-30,34,'left','#ffe9a0');t(''+D.ps,cx[1],H-30,40,'center','#ffe9a0');t(''+D.os,cx[2]-8,H-30,40,'center','#9fd0ff');CHALK.tx.needsUpdate=true}
/* the regular by the board */
{const b0=buildShop;buildShop=function(o){b0(o);if(!o.pub)return;const sp=pSpec(5150,{f:false,hs:4,ts:1,beard:true,gl:false,scarf:null,bp:false,bag:0,old:true,hr:PHR[4],tc:[.45,.3,.2],sk:PSK[0],w:1.08});
  window.DMAN=personIn(sp,-3.35,1.0,-Math.PI/2);{const S=1024,img=dartBoardImg(S),tx=new THREE.CanvasTexture(img);tx.anisotropy=4;const w=DR*2*1.136,bm=new THREE.Mesh(new THREE.PlaneGeometry(w,w),new THREE.MeshBasicMaterial({map:tx,transparent:true,fog:false}));bm.rotation.y=Math.PI/2;bm.position.set(-4.12,1.6,.6);SG.add(bm);window.DBOARD=bm;{const cv=document.createElement('canvas');cv.width=512;cv.height=300;const tx2=new THREE.CanvasTexture(cv);tx2.anisotropy=4;window.CHALK={cv,tx:tx2};const cb=new THREE.Mesh(new THREE.PlaneGeometry(.82,.48),new THREE.MeshBasicMaterial({map:tx2,fog:false}));cb.rotation.y=Math.PI/2;cb.position.set(-4.115,.78,.6);SG.add(cb);const fb=new THREE.Mesh(new THREE.PlaneGeometry(.92,.58),new THREE.MeshBasicMaterial({color:0x6a4524}));fb.rotation.y=Math.PI/2;fb.position.set(-4.125,.78,.6);SG.add(fb);const ld=new THREE.Mesh(new THREE.BoxGeometry(.06,.025,.84),new THREE.MeshBasicMaterial({color:0x6a4524}));ld.position.set(-4.08,.48,.6);SG.add(ld);const ck=new THREE.Mesh(new THREE.BoxGeometry(.02,.012,.06),new THREE.MeshBasicMaterial({color:0xf4f4f0}));ck.position.set(-4.07,.505,.25);SG.add(ck);const er=new THREE.Mesh(new THREE.BoxGeometry(.04,.03,.1),new THREE.MeshBasicMaterial({color:0x2a2a2e}));er.position.set(-4.07,.51,.95);SG.add(er);chalkDraw()}const fr=new THREE.Mesh(new THREE.PlaneGeometry(w*1.35,w*1.35),new THREE.MeshBasicMaterial({color:0x3a2412}));fr.rotation.y=Math.PI/2;fr.position.set(-4.13,1.6,.6);SG.add(fr)};IROOM.push([-3.65,-3.05,.7,1.3]);
  IA.push({r:[-3.95,-2.7,.0,2.0],label:'PLAY DARTS (£2)',fn:()=>{if(HN.food<=0&&0)return;dartsOpen()}})}}
/* ---- bottle caps on the green: flick, knock, collect ---- */
const BCN=['TEA LEAF','BIG BEAR','CHERRY POP','SILVER STAR','LUCKY SEVEN','GINGER SNAP','GOLDEN CROWN','OLD TOWN ALE'],BCC=['#4a9a4a','#8a5a2a','#d03a4a','#c0c8d0','#3a6ad0','#e08a2a','#f0c830','#7a3a8a'],KID=[-111,79];
var BCOL={},BCST={w:0,l:0,d:0},BG=null;
{const sp=pSpec(808,{f:false,hs:0,ts:2,h:.62,w:.95,gl:false,scarf:null,bag:0,bp:false,beard:false,old:false,tc:[.85,.4,.2]});const kid=mkPerson(sp,mObj,scene);kid.position.set(KID[0],G0,KID[1]);kid.rotation.y=Math.PI*.5;
 const B=new Builder(3);pbox(B,KID[0]+1.1,G0,KID[1],.8,.55,.8,[.6,.45,.28]);pbox(B,KID[0]+1.1,G0+.55,KID[1],.85,.06,.85,[.7,.55,.35]);for(let i=0;i<4;i++){pcyl(B,KID[0]+.95+(i%2)*.3,G0+.61,KID[1]-.2+(i>>1)*.4,.07,.03,6,[[.8,.2,.2],[.2,.5,.8],[.9,.8,.2],[.8,.8,.85]][i])}const cm=B.mesh(mObj);scene.add(cm);COL.push([KID[0]+1.1,KID[1],.8],[KID[0],KID[1],.5]);window.KIDG=[kid,cm]}
const kidAvail=()=>GT>=9&&GT<19&&!menuOpen;
function bcNear(){const on=kidAvail();KIDG.forEach(m=>m.visible=on);if(!on||!GS.onFoot||GS.inside)return null;const d=Math.hypot(P.x-KID[0],P.z-KID[1]);if(d>3.2)return null;return{d:d*.5,btn:{label:'FLICK CAPS WITH TINY TOM',fn:bcOpen}}}
{const g0=gardenNear;gardenNear=function(){const g=g0(),c=bcNear();return c&&(!g||c.d<g.d)?c:g}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.bc=BCOL;o.bs=BCST;return o};cozyLoad=function(z){l0(z);if(z&&z.bc){BCOL=z.bc;BCST=z.bs||BCST}}}
/* ---- game ---- */
const BZ=[[.04,5],[.085,3],[.14,2],[.205,1]];
function bcPts(c,W,tx,ty){const d=Math.hypot(c.x-tx,c.y-ty)/W;for(const[r,p]of BZ)if(d<=r)return p;return 0}
function bcOpen(){if(BG)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;
 const ov=document.createElement('div');ov.id='bcov';ov.style.cssText='position:fixed;inset:0;z-index:70;background:rgba(14,8,5,.97);display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;font:bold 13px monospace;color:#fff;touch-action:none;user-select:none';
 const W=Math.floor(Math.min(innerWidth*.72,(innerHeight-16)*1.5)),H=Math.floor(W*.62),cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.style.cssText='border:4px solid #5a3a1a;border-radius:8px;touch-action:none';
 const side=document.createElement('div');side.style.cssText='display:flex;flex-direction:column;gap:8px;min-width:120px;max-width:170px;text-align:center';side.innerHTML='<div id="bcT" style="color:#f5e6a0;font-size:14px">CAPS vs TINY TOM</div><div id="bcS" style="line-height:1.5"></div><div id="bcM" style="min-height:44px;color:#9fe"></div>';
 const lv=document.createElement('button');lv.textContent='LEAVE';lv.style.cssText='font:bold 12px monospace;padding:8px;border:3px solid #f5e6a0;border-radius:10px;color:#fff;background:#333';side.append(lv);ov.append(cv,side);document.body.append(ov);
 const r=W*.034,tx=W*.75,ty=H/2,mine=['#d03030','#e8c030'];
 BG={ov,cv,g:cv.getContext('2d'),W,H,r,tx,ty,caps:[],turn:0,n:[0,0],ph:'aim',drag:null,t:0,msg:'',last:performance.now(),raf:0,done:0,wt:0};
 lv.onclick=()=>bcClose();
 const pt=e=>{const b=cv.getBoundingClientRect();return[(e.clientX-b.left)*W/b.width,(e.clientY-b.top)*H/b.height]};
 cv.onpointerdown=e=>{e.preventDefault();if(BG.ph!=='aim'||BG.turn!==0)return;const[x,y]=pt(e),s=bcStart();if(Math.hypot(x-s[0],y-s[1])<r*3.2){BG.drag={x,y};try{cv.setPointerCapture(e.pointerId)}catch(_){}}};
 cv.onpointermove=e=>{if(BG.drag){const[x,y]=pt(e);BG.drag.x=x;BG.drag.y=y}};
 cv.onpointerup=e=>{if(!BG.drag)return;const s=bcStart(),dx=s[0]-BG.drag.x,dy=s[1]-BG.drag.y;BG.drag=null;let L=Math.hypot(dx,dy);if(L<r*.8){return}const m=Math.min(L,W*.3),k=m/L;bcFlick(0,dx*k*6.2,dy*k*6.2)};
 bcMsg('DRAG BACK FROM YOUR CAP AND LET GO TO FLICK. LAND CLOSE TO THE CENTRE, KNOCK THEIRS OFF!',4500);BG.raf=requestAnimationFrame(bcLoop)}
function bcStart(){return[BG.W*.09,BG.H/2]}
function bcMsg(t,ms){BG.msg=t;BG.mt=ms||2000;const e=document.getElementById('bcM');if(e)e.textContent=t}
function bcFlick(who,vx,vy){const s=bcStart(),c={x:s[0],y:s[1]+(who?(Math.random()-.5)*BG.H*.5:0),vx,vy,who,out:0,sc:1,d:Math.floor(Math.random()*3)};BG.caps.push(c);BG.cur=c;BG.n[who]++;BG.ph='roll';BG.t=0;beep(300,.05,'square',.05)}
function bcAI(){const W=BG.W,H=BG.H,tx=BG.tx,ty=BG.ty,s=[W*.09,ty+(Math.random()-.5)*H*.5],mine=BG.caps.filter(c=>c.who===0&&!c.out&&bcPts(c,W,tx,ty)>0);let ax,ay;
 if(mine.length&&Math.random()<.6){const t=mine.sort((a,b)=>bcPts(b,W,tx,ty)-bcPts(a,W,tx,ty))[0];ax=t.x;ay=t.y}else{ax=tx;ay=ty}
 const dx=ax-s[0],dy=ay-s[1],d=Math.hypot(dx,dy),ang=Math.atan2(dy,dx)+(Math.random()-.5)*.12,pw=d*1.7*(1+(Math.random()-.5)*.22);BG.aiS=s;
 const c={x:s[0],y:s[1],vx:Math.cos(ang)*pw,vy:Math.sin(ang)*pw,who:1,out:0,sc:1,d:Math.floor(Math.random()*3)};BG.caps.push(c);BG.cur=c;BG.n[1]++;BG.ph='roll';BG.t=0;beep(260,.05,'square',.05)}
function bcStep(dt){const{W,H,r}=BG,k=1.75;let moving=0;
 for(const c of BG.caps){if(c.out){c.sc-=dt*2;continue}const sp=Math.hypot(c.vx,c.vy);if(sp>W*.012){moving=1;const f=Math.exp(-k*dt);c.vx*=f;c.vy*=f;c.x+=c.vx*dt;c.y+=c.vy*dt}else{c.vx=c.vy=0}
  if(c.x<-r*.3||c.x>W+r*.3||c.y<-r*.3||c.y>H+r*.3){c.out=1;beep(150,.2,'sawtooth',.04)}}
 for(let i=0;i<BG.caps.length;i++)for(let j=i+1;j<BG.caps.length;j++){const a=BG.caps[i],b=BG.caps[j];if(a.out||b.out)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=r*2;if(d<m&&d>1e-3){const nx=dx/d,ny=dy/d,ov=m-d;a.x-=nx*ov/2;a.y-=ny*ov/2;b.x+=nx*ov/2;b.y+=ny*ov/2;const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){const j2=-(1.88)*rv/2;a.vx-=j2*nx;a.vy-=j2*ny;b.vx+=j2*nx;b.vy+=j2*ny;if(Math.abs(rv)>W*.05)beep(500+Math.random()*200,.04,'square',.05)}}}
 return moving}
function bcLoop(now){if(!BG)return;const dt=Math.min(.04,(now-BG.last)/1000);BG.last=now;
 if(BG.mt>0){BG.mt-=dt*1000;if(BG.mt<=0){const e=document.getElementById('bcM');if(e)e.textContent=''}}
 if(BG.ph==='roll'){for(let i=0;i<3;i++)var mv=bcStep(dt/3);BG.t+=dt;if(!mv&&BG.t>.3){BG.ph='settle';BG.wt=.5}}
 else if(BG.ph==='settle'){for(let i=0;i<3;i++)bcStep(dt/3);BG.wt-=dt;if(BG.wt<=0){if(BG.n[0]>=4&&BG.n[1]>=4)bcEnd();else{BG.turn=BG.turn?0:1;if(BG.n[BG.turn]>=4)BG.turn=BG.turn?0:1;if(BG.turn===1){BG.ph='ai';BG.wt=.9;bcMsg('TINY TOM TAKES AIM...',900)}else{BG.ph='aim';bcMsg('YOUR FLICK ('+(4-BG.n[0])+' LEFT)',1500)}}}}
 else if(BG.ph==='ai'){for(let i=0;i<3;i++)bcStep(dt/3);BG.wt-=dt;if(BG.wt<=0)bcAI()}
 else for(let i=0;i<3;i++)bcStep(dt/3);
 let sc=[0,0];for(const c of BG.caps)if(!c.out)sc[c.who]+=bcPts(c,BG.W,BG.tx,BG.ty);BG.sc=sc;
 const s=document.getElementById('bcS');if(s)s.innerHTML='YOU: <span style="color:#ffd75a">'+sc[0]+'</span> ('+(4-BG.n[0])+' caps left)<br>TOM: <span style="color:#7ac0ff">'+sc[1]+'</span> ('+(4-BG.n[1])+' left)'+(BG.collected?'<br><br>NEW CAP: '+BG.collected:'');
 bcDraw();BG.raf=requestAnimationFrame(bcLoop)}
function capDraw(g,x,y,r,col,d,sc){g.save();g.translate(x,y);g.scale(sc,sc);g.fillStyle='#000';g.globalAlpha=.25;g.beginPath();g.arc(2,3,r,0,6.3);g.fill();g.globalAlpha=1;
 g.fillStyle=col;g.beginPath();for(let i=0;i<14;i++){const a=i/14*6.2832,a2=(i+.5)/14*6.2832;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);g.lineTo(Math.cos(a2)*r*.9,Math.sin(a2)*r*.9)}g.closePath();g.fill();g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=1.5;g.stroke();
 g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.arc(0,0,r*.62,0,6.3);g.fill();g.fillStyle='rgba(0,0,0,.55)';if(d===0){g.beginPath();g.arc(0,0,r*.22,0,6.3);g.fill()}else if(d===1){g.fillRect(-r*.4,-r*.08,r*.8,r*.16)}else{g.beginPath();g.moveTo(0,-r*.38);g.lineTo(r*.33,r*.28);g.lineTo(-r*.33,r*.28);g.fill()}g.restore()}
function bcDraw(){const{g,W,H,r,tx,ty}=BG;g.fillStyle='#8a5a2a';g.fillRect(0,0,W,H);g.strokeStyle='rgba(60,30,10,.35)';g.lineWidth=1;for(let y=8;y<H;y+=14){g.beginPath();g.moveTo(0,y+Math.sin(y)*3);g.lineTo(W,y+Math.cos(y)*3);g.stroke()}
 const cols=['#e8d9a8','#c0392b','#e8d9a8','#2a7a3a','#ffd23a'];for(let i=BZ.length-1;i>=0;i--){g.fillStyle=cols[i+0===3?1:i];g.fillStyle=['#ffd23a','#c0392b','#e8d9a8','#2a7a3a'][i];g.beginPath();g.arc(tx,ty,BZ[i][0]*W,0,6.3);g.fill()}
 g.fillStyle='#222';g.font='bold '+Math.round(W*.028)+'px monospace';g.textAlign='center';g.textBaseline='middle';BZ.forEach(([rr,p])=>{g.fillText(p,tx,ty-rr*W+W*.02)});
 g.strokeStyle='rgba(255,255,255,.5)';g.setLineDash([8,8]);g.lineWidth=2;g.beginPath();g.moveTo(W*.14,0);g.lineTo(W*.14,H);g.stroke();g.setLineDash([]);
 for(const c of BG.caps)if(c.sc>0)capDraw(g,c.x,c.y,r,c.who?'#3a78d8':'#d83a3a',c.d,Math.max(0,c.sc));
 if(BG.ph==='aim'&&BG.turn===0&&!BG.n.every(n=>n>=4)){const s=bcStart();capDraw(g,s[0],s[1],r,'#d83a3a',0,1);if(BG.drag){const dx=s[0]-BG.drag.x,dy=s[1]-BG.drag.y,L=Math.min(Math.hypot(dx,dy),W*.3),a=Math.atan2(dy,dx);g.strokeStyle='#fff';g.lineWidth=3;g.setLineDash([]);g.beginPath();g.moveTo(s[0],s[1]);g.lineTo(s[0]-Math.cos(a)*L,s[1]-Math.sin(a)*L);g.stroke();g.strokeStyle='#ffe27a';g.lineWidth=4;g.beginPath();g.moveTo(s[0],s[1]);g.lineTo(s[0]+Math.cos(a)*L*1.6,s[1]+Math.sin(a)*L*1.6);g.stroke()}else{g.fillStyle='rgba(255,255,255,.8)';g.font='bold 14px monospace';g.fillText('DRAG BACK, THEN LET GO',W*.2,H*.9)}}
 if(BG.ph==='ai'){const s=[W*.09,ty];capDraw(g,s[0],s[1],r,'#3a78d8',1,.8)}}
function bcEnd(){BG.ph='done';const s=BG.sc;let m,pay=0,cap='';if(s[0]>s[1]){m='YOU WIN '+s[0]+'-'+s[1]+'!';pay=4;BCST.w++;const idx=Math.floor(Math.random()*8),k=BCN[idx];if(!BCOL[k]){BCOL[k]=1;cap=k;if(Object.keys(BCOL).length===8){cash+=50;addVP(3);toast('ALL 8 CAPS! BOTTLE CAP CHAMP! +£50')}}else BCOL[k]++}else if(s[0]<s[1]){m='TOM WINS '+s[1]+'-'+s[0]+'. REMATCH?';BCST.l++}else{m='A DRAW!';pay=2;BCST.d++}
 cash+=pay;GT+=.3;if(GT>=24){GT-=24;newDay()}HN.en=Math.max(0,HN.en-2);BG.collected=cap?cap+'  ('+Object.keys(BCOL).length+'/8)':'';
 const t=document.getElementById('bcT');t.textContent=m;bcMsg((pay?'+£'+pay+'  ':'')+'W'+BCST.w+' L'+BCST.l+' D'+BCST.d,8000);
 const side=t.parentNode,ag=document.createElement('button');ag.textContent='PLAY AGAIN';ag.style.cssText='font:bold 14px monospace;padding:12px;border:3px solid #f5e6a0;border-radius:10px;color:#fff;background:#2a7a3a';ag.onclick=()=>{bcClose();bcOpen()};side.insertBefore(ag,side.children[3]);
 const coll=document.createElement('div');coll.style.cssText='font-size:10px;line-height:1.5;color:#ccc';coll.innerHTML='COLLECTION<br>'+BCN.map((n,i)=>'<span style="color:'+(BCOL[n]?BCC[i]:'#555')+'">'+(BCOL[n]?n+' x'+BCOL[n]:'???')+'</span>').join('<br>');side.append(coll)}
function bcClose(){if(!BG)return;cancelAnimationFrame(BG.raf);BG.ov.remove();BG=null;busy=0}
/* ---- farm: Farmer Holt, his collie, and the sheep-herding game ---- */
const FARMER=[-112,168];var HERD={best:0,w:0,n:0},HG=null;
{const sp=pSpec(6001,{f:false,hs:4,ts:2,beard:true,gl:false,scarf:null,bag:0,bp:false,old:true,hr:PHR[4],tc:[.25,.45,.3],bc:PBC[5],sk:PSK[1],w:1.1});const fm=mkPerson(sp,mObj,scene);fm.position.set(FARMER[0],G0,FARMER[1]);fm.rotation.y=Math.PI*.5;
 const B=new Builder(3),bk=[.1,.1,.11],wh=[.95,.95,.95],br=[.45,.28,.15];pbox(B,0,.3,0,.28,.28,.7,bk);pbox(B,0,.42,0,.18,.16,.5,wh);pbox(B,0,.52,.42,.2,.2,.22,bk);pbox(B,0,.5,.55,.08,.08,.1,br);pbox(B,-.07,.7,.4,.05,.12,.05,bk);pbox(B,.07,.7,.4,.05,.12,.05,bk);for(const[x,z]of[[-.09,.25],[.09,.25],[-.09,-.25],[.09,-.25]])pbox(B,x,0,z,.07,.3,.07,wh);const tail=new THREE.Group();pbox(B,0,.5,-.45,.06,.06,.3,wh);
 const dog=B.mesh(mObj);scene.add(dog);dog.position.set(FARMER[0]+.9,G0,FARMER[1]+.7);dog.rotation.y=.8;window.COLLIE=dog;COL.push([FARMER[0],FARMER[1],.5])}
const herdOK=()=>GT>=7&&GT<19&&!menuOpen;
function herdNear(){const on=herdOK();if(window.COLLIE)COLLIE.visible=on;if(!on||!GS.onFoot||GS.inside)return null;const d=Math.hypot(P.x-FARMER[0],P.z-FARMER[1]);if(d>3.2)return null;return{d:d*.5,btn:{label:'TALK TO FARMER HOLT '+hearts('FARMER HOLT'),fn:()=>openShop('farmer')}}}
{const g0=gardenNear;gardenNear=function(){const g=g0(),c=herdNear();return c&&(!g||c.d<g.d)?c:g}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.hd=HERD;return o};cozyLoad=function(z){l0(z);if(z&&z.hd)HERD=z.hd}}
{const u0=updCozy;updCozy=function(dt){u0(dt);if(window.COLLIE&&COLLIE.visible){const t=performance.now()*.003;COLLIE.position.y=G0+Math.abs(Math.sin(t*3))*.02;COLLIE.rotation.y=.8+Math.sin(t)*.5}}}
/* ---- game ---- */
function herdOpen(){if(HG)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:70;background:rgba(10,14,8,.97);display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;font:bold 13px monospace;color:#fff;touch-action:none;user-select:none';
 const W=Math.floor(Math.min(innerWidth*.74,(innerHeight-16)*1.5)),H=Math.floor(W*.62),cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.style.cssText='border:4px solid #4a3a1a;border-radius:8px;touch-action:none';
 const side=document.createElement('div');side.style.cssText='display:flex;flex-direction:column;gap:8px;min-width:110px;max-width:160px;text-align:center';side.innerHTML='<div id="hdT" style="color:#f5e6a0;font-size:14px">HERD THE SHEEP</div><div id="hdS" style="line-height:1.5"></div><div id="hdM" style="min-height:44px;color:#9fe"></div>';
 const bark=document.createElement('button'),lv=document.createElement('button');bark.textContent='WOOF!';bark.style.cssText='font:bold 18px monospace;padding:14px 8px;border:3px solid #f5e6a0;border-radius:10px;color:#fff;background:#8a5a2a;touch-action:manipulation';lv.textContent='LEAVE';lv.style.cssText='font:bold 12px monospace;padding:8px;border:3px solid #f5e6a0;border-radius:10px;color:#fff;background:#333';side.append(bark,lv);ov.append(cv,side);document.body.append(ov);
 const sh=[];for(let i=0;i<6;i++)sh.push({x:W*(.18+Math.random()*.4),y:H*(.14+Math.random()*.72),vx:0,vy:0,in:0,blk:i===5,ph:Math.random()*6});
 HG={ov,cv,g:cv.getContext('2d'),W,H,sh,dog:{x:W*.08,y:H*.5,tx:W*.08,ty:H*.5,a:0},t:70,ph:'play',barkT:0,barkC:0,last:performance.now(),raf:0,msg:'',mt:0,pen:[W*.8,H*.3,W,H*.7],pond:[W*.36,H*.5,W*.075]};
 const pt=e=>{const b=cv.getBoundingClientRect();return[(e.clientX-b.left)*W/b.width,(e.clientY-b.top)*H/b.height]};
 cv.onpointerdown=e=>{e.preventDefault();const[x,y]=pt(e);HG.dog.tx=x;HG.dog.ty=y;HG.hold=1;try{cv.setPointerCapture(e.pointerId)}catch(_){}};cv.onpointermove=e=>{if(HG.hold){const[x,y]=pt(e);HG.dog.tx=x;HG.dog.ty=y}};cv.onpointerup=()=>{HG.hold=0};
 bark.onpointerdown=e=>{e.preventDefault();herdBark()};lv.onclick=()=>herdClose();
 HG.kd=e=>{if(e.code==='Space'){e.preventDefault();herdBark()}else if(e.code==='Escape')herdClose()};addEventListener('keydown',HG.kd);
 herdMsg('DRAG TO SEND THE COLLIE. SHEEP RUN FROM HIM. GET ALL 6 IN THE PEN! WOOF SCARES THEM FURTHER.',5000);HG.raf=requestAnimationFrame(herdLoop)}
function herdMsg(t,ms){HG.msg=t;HG.mt=ms||2000;const e=document.getElementById('hdM');if(e)e.textContent=t}
function herdBark(){if(!HG||HG.ph!=='play'||HG.barkC>0)return;HG.barkT=.5;HG.barkC=2.5;beep(330,.09,'square',.06);setTimeout(()=>beep(260,.1,'square',.06),90)}
function herdLoop(now){if(!HG)return;const dt=Math.min(.04,(now-HG.last)/1000);HG.last=now;const{W,H,sh,dog,pen,pond,g}=HG;
 if(HG.mt>0){HG.mt-=dt*1000;if(HG.mt<=0){const e=document.getElementById('hdM');if(e)e.textContent=''}}
 if(HG.ph==='play'){HG.t-=dt;HG.barkT-=dt;HG.barkC-=dt;
  const dx=dog.tx-dog.x,dy=dog.ty-dog.y,dl=Math.hypot(dx,dy);if(dl>4){const sp=Math.min(dl*5,W*.55);dog.x+=dx/dl*sp*dt;dog.y+=dy/dl*sp*dt;dog.a=Math.atan2(dy,dx)}
  const R0=W*.16*(HG.barkT>0?1.9:1);
  for(const s of sh){let ax=0,ay=0;const ddx=s.x-dog.x,ddy=s.y-dog.y,dd=Math.hypot(ddx,ddy)||1;
   if(!s.in){const rr=R0*(s.blk?1.25:1);if(dd<rr){const k=(1-dd/rr)*W*1.4*(s.blk?1.3:1);ax+=ddx/dd*k;ay+=ddy/dd*k}
    let cx=0,cy=0,n=0;for(const o of sh){if(o===s||o.in)continue;const ox=o.x-s.x,oy=o.y-s.y,od=Math.hypot(ox,oy);if(od<W*.2){cx+=ox;cy+=oy;n++}if(od<W*.05&&od>0){ax-=ox/od*W*.5;ay-=oy/od*W*.5}}if(n){ax+=cx/n*.6;ay+=cy/n*.6}
    s.ph+=dt;ax+=Math.cos(s.ph*1.3+s.x)*W*.03;ay+=Math.sin(s.ph*1.7+s.y)*W*.03;
    const px=s.x-pond[0],py=s.y-pond[1],pd=Math.hypot(px,py);if(pd<pond[2]+W*.03){ax+=px/pd*W*2;ay+=py/pd*W*2}
    s.vx=(s.vx+ax*dt)*.9;s.vy=(s.vy+ay*dt)*.9;const ms=W*(s.blk?.34:.26),sp=Math.hypot(s.vx,s.vy);if(sp>ms){s.vx*=ms/sp;s.vy*=ms/sp}}
   else{s.vx*=.8;s.vy*=.8;s.vx+=Math.cos(s.ph+=dt)*W*.01*dt;}
   s.x+=s.vx*dt;s.y+=s.vy*dt;
   const m=W*.03;if(s.x<m){s.x=m;s.vx=Math.abs(s.vx)}if(s.y<m){s.y=m;s.vy=Math.abs(s.vy)}if(s.y>H-m){s.y=H-m;s.vy=-Math.abs(s.vy)}if(s.x>W-m){s.x=W-m;s.vx=-Math.abs(s.vx)}
   // pen fence: walls top and bottom of pen from x=pen[0]
   if(s.x>pen[0]-m*.5){if(!s.in){if(s.y>pen[1]+m*.5&&s.y<pen[3]-m*.5&&s.x>pen[0]+m){s.in=1;beep(700,.08,'sine',.05);const c=sh.filter(q=>q.in).length;herdMsg(s.blk?'THE BLACK SHEEP IS IN!':c+' IN THE PEN!',1200)}}
    if(s.in){if(s.y<pen[1]+m){s.y=pen[1]+m;s.vy=Math.abs(s.vy)*.5}if(s.y>pen[3]-m){s.y=pen[3]-m;s.vy=-Math.abs(s.vy)*.5}if(s.x<pen[0]+m*.6){s.x=pen[0]+m*.6;s.vx=Math.abs(s.vx)*.5}}
    else{ // outside pen: block the walls
     if(s.y<=pen[1]+m*.4){s.y=pen[1]-m*.4;s.vy=-Math.abs(s.vy)}else if(s.y>=pen[3]-m*.4){s.y=pen[3]+m*.4;s.vy=Math.abs(s.vy)}}}}
  const n=sh.filter(s=>s.in).length;if(n===6)herdEnd(1);else if(HG.t<=0)herdEnd(0)}
 const sS=document.getElementById('hdS');if(sS)sS.innerHTML='TIME <span style="color:#ffd75a">'+Math.max(0,Math.ceil(HG.t))+'</span><br>PENNED '+sh.filter(s=>s.in).length+'/6<br>BARK '+(HG.barkC>0?Math.ceil(HG.barkC)+'s':'READY');
 herdDraw();HG.raf=requestAnimationFrame(herdLoop)}
function herdDraw(){const{g,W,H,sh,dog,pen,pond}=HG;g.fillStyle='#5a9a3a';g.fillRect(0,0,W,H);for(let i=0;i<10;i++){g.fillStyle=i%2?'rgba(0,0,0,.05)':'rgba(255,255,255,.04)';g.fillRect(i*W/10,0,W/10,H)}
 g.fillStyle='#3a7a8a';g.beginPath();g.arc(pond[0],pond[1],pond[2],0,6.3);g.fill();g.strokeStyle='#8ac0cf';g.lineWidth=3;g.stroke();
 g.fillStyle='#b89a60';g.fillRect(pen[0],pen[1],pen[2]-pen[0],pen[3]-pen[1]);g.strokeStyle='#5a3a1a';g.lineWidth=6;g.beginPath();g.moveTo(pen[0],pen[1]);g.lineTo(pen[2],pen[1]);g.lineTo(pen[2],pen[3]);g.lineTo(pen[0],pen[3]);g.stroke();g.fillStyle='rgba(255,255,255,.85)';g.font='bold 12px monospace';g.textAlign='center';g.fillText('PEN',(pen[0]+pen[2])/2,H*.5);
 g.strokeStyle='#2a5a1a';g.lineWidth=8;g.strokeRect(0,0,W,H);
 for(const s of sh){const r=W*.032;g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(s.x+2,s.y+4,r,r*.8,0,0,6.3);g.fill();g.fillStyle=s.blk?'#2a2a2e':'#f3f0e6';for(const[ox,oy,rr]of[[0,0,1],[-.6,-.2,.7],[.6,-.2,.7],[0,.5,.7],[-.3,-.6,.6],[.3,-.6,.6]]){g.beginPath();g.arc(s.x+ox*r*.6,s.y+oy*r*.6,r*rr,0,6.3);g.fill()}g.fillStyle=s.blk?'#444':'#3a3030';const a=Math.atan2(s.vy,s.vx||.01);g.beginPath();g.arc(s.x+Math.cos(a)*r*.95,s.y+Math.sin(a)*r*.95,r*.42,0,6.3);g.fill()}
 // dog
 if(HG.barkT>0){g.strokeStyle='rgba(255,255,255,'+Math.min(1,HG.barkT*2)+')';g.lineWidth=3;g.beginPath();g.arc(dog.x,dog.y,W*.16*(1.9-HG.barkT*1.4),0,6.3);g.stroke()}
 g.save();g.translate(dog.x,dog.y);g.rotate(dog.a);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(2,4,W*.04,W*.022,0,0,6.3);g.fill();g.fillStyle='#1c1c20';g.beginPath();g.ellipse(0,0,W*.04,W*.022,0,0,6.3);g.fill();g.fillStyle='#f0f0f0';g.beginPath();g.ellipse(-W*.005,0,W*.02,W*.012,0,0,6.3);g.fill();g.fillStyle='#1c1c20';g.beginPath();g.arc(W*.042,0,W*.018,0,6.3);g.fill();g.fillStyle='#f0f0f0';g.fillRect(W*.047,-W*.004,W*.012,W*.008);g.fillStyle='#1c1c20';g.fillRect(-W*.07,-W*.004,W*.035,W*.008);g.restore()}
function herdEnd(win){HG.ph='done';const n=HG.sh.filter(s=>s.in).length,left=Math.max(0,Math.ceil(HG.t)),tm=70-left;let pay=n;if(win){friendGain('FARMER HOLT',1);pay=4+Math.floor(left/6)+(HG.sh[5].in?2:0);HERD.w++;addVP(1);if(!HERD.best||tm<HERD.best)HERD.best=tm}HERD.n++;cash+=pay;GT+=.3;if(GT>=24){GT-=24;newDay()}HN.en=Math.max(0,HN.en-4);
 const t=document.getElementById('hdT');t.textContent=win?'ALL SIX IN! WELL DONE!':'TIME UP: '+n+'/6 PENNED';herdMsg('+£'+pay+(win?'  TIME '+tm+'s  BEST '+HERD.best+'s':'  TRY AGAIN?'),9000);
 const side=t.parentNode;const ag=document.createElement('button');ag.textContent='AGAIN';ag.style.cssText='font:bold 14px monospace;padding:12px;border:3px solid #f5e6a0;border-radius:10px;color:#fff;background:#2a7a3a';ag.onclick=()=>{herdClose();herdOpen()};side.insertBefore(ag,side.children[3]);if(win)toast('FARMER HOLT: "THAT\'S A GOOD DOG!"')}
function herdClose(){if(!HG)return;cancelAnimationFrame(HG.raf);removeEventListener('keydown',HG.kd);HG.ov.remove();HG=null;busy=0}

/* ---- Farmer Holt: friendship, perks, milking, hens ---- */
PRODN.milk='fresh milk';PRODN.egg='fresh eggs';
var FARM={cowD:[-1,-1,-1],eggD:-1,giftD:-1,chatD:-1};
const COWN=['DAISY','BUTTERCUP','MOO-REEN'],HOLTL=[["Morning. Mind the mud.","Sheep won't herd themselves."],["Good to see a face. Quiet here.","The dog likes you, that says plenty."],["You've got the knack for farm work.","Best milker I've had help from."],["Come in anytime, you're family now.","Wouldn't swap this place for the world."]];
function farmerChat(){const l=lvl('FARMER HOLT');if(FARM.chatD===DAY){say('FARMER HOLT','Already had a good natter today. Tomorrow?',2500);return}FARM.chatD=DAY;let g=1,t;const it=giftItem();if(it){INV[it]--;g=3;t='Ha! A '+PRODN[it]+'. Cheers, that is kind of you.'}else t=HOLTL[Math.min(3,l)][hash('FH'+DAY)%2];friendGain('FARMER HOLT',g);say('FARMER HOLT',t,3800)}
CUSTOM_SHOP.farmer=function(msg){const l=lvl('FARMER HOLT');document.getElementById('shT').textContent='FARMER HOLT '+hearts('FARMER HOLT');document.getElementById('shMsg').textContent=msg||'WHAT NEEDS DOING?';
 dRow('HAVE A CHAT (GIVE A FISH OR VEG FOR MORE)',[['CHAT',()=>{closeShop();farmerChat()}]]);
 dRow('HERD THE SHEEP WITH THE COLLIE',[['GO',()=>{closeShop();herdOpen()}]]);
 const ready=COWN.map((n,i)=>FARM.cowD[i]!==DAY);dRow('MILK THE COWS ('+ready.filter(Boolean).length+'/3 READY TODAY)',[['MILK',()=>{const i=ready.indexOf(true);if(i<0)return renderShop('ALL THREE COWS ARE DONE FOR TODAY');closeShop();milkOpen(i)}]]);
 dRow(l>=2?'DAILY GIFT FROM THE FARM'+(FARM.giftD===DAY?' (TAKEN)':''):'DAILY GIFT (NEEDS ♥♥)',[[l>=2&&FARM.giftD!==DAY?'TAKE':'LOCKED',()=>{if(l<2||FARM.giftD===DAY)return renderShop(l<2?'BEFRIEND HOLT FIRST':'COME BACK TOMORROW');FARM.giftD=DAY;INV.milk=(INV.milk|0)+1;INV.egg=(INV.egg|0)+2;renderShop('HOLT GIVES YOU 1 MILK AND 2 EGGS'),beep(660,.1,'square',.05)},l>=2&&FARM.giftD!==DAY]]);
 dRow(l>=3?'TRACTOR LIFT TO THE VILLAGE GREEN':'TRACTOR LIFT (NEEDS ♥♥♥)',[[l>=3?'RIDE':'LOCKED',()=>{if(l<3)return renderShop('BEFRIEND HOLT FIRST');closeShop();fade(()=>{P.x=GRC[0]-GRR-RW-PW-3;P.z=GRC[1]+30;P.y=G0+.02;GT+=.2;toast('HOLT DROPS YOU ON THE GREEN. "MIND HOW YOU GO!"')})},l>=3]]);
 dRow('',[['BACK',()=>closeShop()]])};
/* hens + coop */
const COOP=[-119,184],HENS=[];
{const B=new Builder(3);pbox(B,COOP[0],G0,COOP[1],2.2,1.1,1.6,[.7,.25,.2]);proof(B,COOP[0],G0+1.1,COOP[1],2.2,1.6,.7,[.3,.3,.34],.15,Math.PI/2);pbox(B,COOP[0]-.9,G0,COOP[1]+.82,.5,.6,.04,[.15,.1,.08]);for(const[x,z]of[[-1.6,1.2],[1.6,1.2],[-1.6,3.2],[1.6,3.2]])pbox(B,COOP[0]+x,G0,COOP[1]+z,.1,.9,.1,[.5,.36,.2]);for(const z of[1.2,3.2])pbox(B,COOP[0],G0+.5,COOP[1]+z,3.3,.06,.06,[.55,.42,.25]);pbox(B,COOP[0]-1.6,G0+.5,COOP[1]+2.2,.06,.06,2,[.55,.42,.25]);pbox(B,COOP[0]+1.6,G0+.5,COOP[1]+2.2,.06,.06,2,[.55,.42,.25]);scene.add(B.mesh(mObj));COL.push([COOP[0],COOP[1],1.5]);
 for(let i=0;i<4;i++){const H=new Builder(3),c=i%2?[.7,.4,.2]:[.95,.93,.88];pbox(H,0,.15,0,.16,.16,.26,c);pbox(H,0,.25,.14,.07,.12,.08,c);pbox(H,0,.34,.16,.05,.05,.05,[.8,.15,.15]);pbox(H,0,.3,.2,.03,.03,.05,[.9,.7,.2]);pbox(H,-.03,0,0,.02,.16,.02,[.9,.7,.2]);pbox(H,.03,0,0,.02,.16,.02,[.9,.7,.2]);pbox(H,0,.28,-.14,.06,.1,.06,dk(c,.8));const m=H.mesh(mObj);m.position.set(COOP[0]-1.3+Math.random()*2.6,G0,COOP[1]+1.4+Math.random()*1.6);m.userData={tx:m.position.x,tz:m.position.z,t:Math.random()*4};scene.add(m);HENS.push(m)}}
function updHens(dt){const cx=cam.position.x,cz=cam.position.z;for(const m of HENS){m.visible=Math.hypot(m.position.x-cx,m.position.z-cz)<scene.fog.far;if(!m.visible)continue;const u=m.userData;u.t-=dt;if(u.t<=0){u.t=1+Math.random()*3;u.tx=COOP[0]-1.3+Math.random()*2.6;u.tz=COOP[1]+1.4+Math.random()*1.6}const dx=u.tx-m.position.x,dz=u.tz-m.position.z,L=Math.hypot(dx,dz);if(L>.08){m.rotation.y=Math.atan2(dx,dz);m.position.x+=dx/L*.5*dt;m.position.z+=dz/L*.5*dt;m.position.y=G0+Math.abs(Math.sin(performance.now()*.012))*.03}else m.position.y=G0+(Math.sin(performance.now()*.008+u.tx)>.7?-.03:0)}}
function coopNear(){if(!GS.onFoot||GS.inside)return null;const d=Math.hypot(P.x-COOP[0],P.z-(COOP[1]+2.2));if(d>3.4)return null;const got=FARM.eggD===DAY;return{d:d*.6,btn:{label:got?'HENS: NO EGGS TODAY':'COLLECT EGGS',fn:()=>{if(FARM.eggD===DAY){toast('THE HENS ARE SULKING. TRY TOMORROW');return}FARM.eggD=DAY;const n=2+Math.floor(Math.random()*3);INV.egg=(INV.egg|0)+n;beep(800,.1,'sine',.06);toast('COLLECTED '+n+' FRESH EGGS!')}}}}
{const g0=gardenNear;gardenNear=function(){const g=g0(),c=coopNear();return c&&(!g||c.d<g.d)?c:g}}
{const u0=updCozy;updCozy=function(dt){u0(dt);updHens(dt)}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.fa=FARM;return o};cozyLoad=function(z){l0(z);if(z&&z.fa)FARM=Object.assign(FARM,z.fa)}}
/* meals + selling */
MEALS.push({n:'FARM OMELETTE',need:'2 EGGS',ok:()=>haveK('egg')>=2,go:()=>{INV.egg-=2;fed(32,5,'FLUFFY OMELETTE! FOOD +32')}},{n:'GLASS OF MILK',need:'1 MILK',ok:()=>haveK('milk')>=1,go:()=>{INV.milk--;fed(16,12,'COLD GLASS OF MILK. FOOD +16 ENERGY +12')}},{n:'FULL FARM BREAKFAST',need:'2 EGGS + 1 MILK',ok:()=>haveK('egg')>=2&&haveK('milk')>=1,go:()=>{INV.egg-=2;INV.milk--;fed(58,18,'WHAT A BREAKFAST! FOOD +58 ENERGY +18')}});
{const b0=CUSTOM_SHOP.board;CUSTOM_SHOP.board=function(msg){b0(msg);for(const[k,nm,pr]of[['milk','MILK',3],['egg','EGGS',2]]){const n=INV[k]|0;if(n>0)dRow(nm+' x'+n+'  £'+pr+' EACH',[['SELL 1',()=>{INV[k]--;cash+=pr;renderShop('SOLD '+nm+' +£'+pr)}],['ALL',()=>{cash+=pr*n;INV[k]=0;renderShop('SOLD '+n+' '+nm+' +£'+pr*n)}]])}}}
/* ---- milking mini-game: tap left/right on the beat ---- */
var MG=null;
function milkOpen(ci){if(MG)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;FARM.cowD[ci]=DAY;
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:70;background:rgba(18,12,8,.97);display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;font:bold 13px monospace;color:#fff;touch-action:none;user-select:none';
 const W=Math.floor(Math.min(innerWidth*.72,(innerHeight-16)*1.5)),H=Math.floor(W*.62),cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.style.cssText='border:4px solid #4a3a1a;border-radius:8px;touch-action:none';
 const side=document.createElement('div');side.style.cssText='display:flex;flex-direction:column;gap:8px;min-width:120px;max-width:170px;text-align:center';side.innerHTML='<div id="mkT" style="color:#f5e6a0;font-size:14px">MILKING '+COWN[ci]+'</div><div id="mkS" style="line-height:1.5"></div><div id="mkM" style="min-height:44px;color:#9fe"></div>';
 const mk=(t,c)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText='font:bold 20px monospace;padding:18px 8px;border:3px solid #f5e6a0;border-radius:10px;color:#fff;touch-action:manipulation;background:'+c;return b};
 const bl=mk('LEFT','#2a6ab0'),br=mk('RIGHT','#b05a2a'),lv=mk('LEAVE','#333');lv.style.font='bold 12px monospace';lv.style.padding='8px';side.append(bl,br,lv);ov.append(cv,side);document.body.append(ov);
 const per=[.62,.55,.5][ci];MG={ov,cv,g:cv.getContext('2d'),W,H,ci,t:30,per,beat:0,nb:1.2,side:0,fill:0,rest:0,flows:[],ph:'play',last:performance.now(),raf:0,msg:'',mt:0,tapsOK:0,perfect:0,pulse:0,kick:0};
 const tap=s=>e=>{if(e)e.preventDefault();milkTap(s)};bl.onpointerdown=tap(0);br.onpointerdown=tap(1);lv.onclick=()=>milkClose();
 MG.kd=e=>{if(e.code==='KeyA'||e.code==='ArrowLeft')milkTap(0);else if(e.code==='KeyD'||e.code==='ArrowRight')milkTap(1);else if(e.code==='Escape')milkClose()};addEventListener('keydown',MG.kd);
 cv.onpointerdown=e=>{e.preventDefault();const b=cv.getBoundingClientRect();milkTap((e.clientX-b.left)<b.width/2?0:1)};
 milkMsg('TAP LEFT, RIGHT, LEFT, RIGHT ON THE BEAT. OFF-BEAT OR THE SAME SIDE TWICE MAKES '+COWN[ci]+' RESTLESS!',5000);MG.raf=requestAnimationFrame(milkLoop)}
function milkMsg(t,ms){MG.msg=t;MG.mt=ms||1500;const e=document.getElementById('mkM');if(e)e.textContent=t}
function milkTap(s){if(!MG||MG.ph!=='play')return;const dt=Math.abs(MG.beat-MG.nb+0*MG.per);const near=Math.min(Math.abs(MG.beat-MG.nbPrev),Math.abs(MG.nb-MG.beat));let q;
 if(s!==MG.side){MG.rest+=24;milkMsg('WRONG SIDE!',600);beep(150,.1,'sawtooth',.05);MG.last=MG.last;return}
 if(near<.13){q=3;MG.perfect++;milkMsg('PERFECT!',400)}else if(near<.26){q=2;milkMsg('GOOD',400)}else{q=1;MG.rest+=14;milkMsg('OFF BEAT',400)}
 MG.fill=Math.min(100,MG.fill+q*1.55);MG.tapsOK++;MG.side=1-MG.side;MG.flows.push({s,t:.18});beep(q===3?620:480,.04,'sine',.05)}
function milkLoop(now){if(!MG)return;const dt=Math.min(.04,(now-MG.last)/1000);MG.last=now;
 if(MG.mt>0){MG.mt-=dt*1000;if(MG.mt<=0){const e=document.getElementById('mkM');if(e)e.textContent=''}}
 if(MG.ph==='play'){MG.t-=dt;MG.beat+=dt;MG.nbPrev=MG.nb-MG.per;if(MG.beat>=MG.nb){MG.nbPrev=MG.nb;MG.nb+=MG.per}
  MG.rest=Math.max(0,MG.rest-9*dt);if(MG.rest>=100){MG.ph='kick';MG.kick=1}if(MG.t<=0)milkEnd(0)}
 else if(MG.ph==='kick'){MG.kick-=dt;if(MG.kick<=0)milkEnd(1)}
 MG.flows=MG.flows.filter(f=>(f.t-=dt)>0);
 const sS=document.getElementById('mkS');if(sS)sS.innerHTML='TIME '+Math.max(0,Math.ceil(MG.t))+'<br>MILK '+Math.round(MG.fill)+'%<br><span style="color:'+(MG.rest>60?'#f55':'#9f9')+'">RESTLESS '+Math.round(MG.rest)+'%</span><br>NEXT: <b>'+(MG.side?'RIGHT':'LEFT')+'</b>';
 milkDraw();MG.raf=requestAnimationFrame(milkLoop)}
function milkDraw(){const{g,W,H}=MG;g.fillStyle='#6a5a3a';g.fillRect(0,0,W,H);g.fillStyle='#8a7a52';g.fillRect(0,H*.82,W,H*.18);
 g.fillStyle='#d8d4c8';g.beginPath();g.ellipse(W*.5,H*.34,W*.34,H*.3,0,0,6.3);g.fill();g.fillStyle='#1c1c20';for(const[x,y,r]of[[.38,.26,.09],[.58,.22,.07],[.5,.42,.08],[.66,.4,.06]]){g.beginPath();g.ellipse(W*x,H*y,W*r,H*r*1.2,0,0,6.3);g.fill()}
 const sh=MG.ph==='kick'?Math.sin(MG.kick*30)*8:0;g.fillStyle='#d8d4c8';for(const x of[.28,.72])g.fillRect(W*x-W*.04+sh,H*.5,W*.08,H*.34);g.fillStyle='#2a2a2e';for(const x of[.28,.72])g.fillRect(W*x-W*.045,H*.8,W*.09,H*.04);
 g.fillStyle='#e8a0a8';g.beginPath();g.ellipse(W*.5,H*.58,W*.14,H*.09,0,0,6.3);g.fill();
 const tx=[W*.44,W*.56],ty=H*.64;for(let i=0;i<2;i++){g.fillStyle=MG.side===i&&MG.ph==='play'?'#ffe27a':'#d88a98';g.beginPath();g.ellipse(tx[i],ty,W*.018,H*.05,0,0,6.3);g.fill()}
 const bx=W*.5,by=H*.9,bw=W*.2,bh=H*.2;g.fillStyle='#b8bcc4';g.beginPath();g.moveTo(bx-bw/2,by-bh);g.lineTo(bx+bw/2,by-bh);g.lineTo(bx+bw*.4,by);g.lineTo(bx-bw*.4,by);g.closePath();g.fill();g.fillStyle='#f4f4ee';const fh=bh*MG.fill/100;g.beginPath();g.moveTo(bx-bw/2+bw*.1*(1-MG.fill/100)*.5,by-fh);g.lineTo(bx+bw/2-bw*.1*(1-MG.fill/100)*.5,by-fh);g.lineTo(bx+bw*.4,by-2);g.lineTo(bx-bw*.4,by-2);g.closePath();g.fill();g.strokeStyle='#666';g.lineWidth=2;g.stroke();
 g.strokeStyle='#fff';g.lineWidth=4;for(const f of MG.flows){g.beginPath();g.moveTo(tx[f.s],ty+H*.04);g.lineTo(bx+(f.s?1:-1)*bw*.12,by-bh*.85);g.stroke()}
 // beat ring
 const k=Math.max(0,Math.min(1,(MG.nb-MG.beat)/MG.per)),cx=tx[MG.side],cy=ty;g.strokeStyle='rgba(255,255,255,.9)';g.lineWidth=3;g.beginPath();g.arc(cx,cy,W*.018+k*W*.07,0,6.3);g.stroke();g.strokeStyle='rgba(255,226,122,.9)';g.beginPath();g.arc(cx,cy,W*.02,0,6.3);g.stroke();
 g.fillStyle='#fff';g.font='bold '+Math.round(W*.03)+'px monospace';g.textAlign='center';g.fillText(MG.ph==='kick'?'*KICK!*':'',W*.5,H*.12);
 // restless bar
 g.fillStyle='rgba(0,0,0,.5)';g.fillRect(W*.05,H*.06,W*.2,10);g.fillStyle=MG.rest>60?'#d83030':'#6ac05a';g.fillRect(W*.05,H*.06,W*.2*Math.min(1,MG.rest/100),10)}
function milkEnd(kicked){MG.ph='done';let n=MG.fill>=10?1+Math.floor(MG.fill/30):0;if(kicked)n=Math.max(0,Math.floor(n/2));n=Math.min(4,n);INV.milk=(INV.milk|0)+n;friendGain('FARMER HOLT',1);GT+=.3;if(GT>=24){GT-=24;newDay()}HN.en=Math.max(0,HN.en-3);
 const t=document.getElementById('mkT');t.textContent=kicked?COWN[MG.ci]+' KICKED THE BUCKET!':n>=4?'PERFECT PAIL!':'ALL DONE';milkMsg((n?'+'+n+' MILK':'NO MILK')+' · PERFECT TAPS '+MG.perfect,8000);if(n)toast('GOT '+n+' BOTTLES OF FRESH MILK');
 const side=t.parentNode;[...side.querySelectorAll('button')].forEach(b=>{if(b.textContent==='LEFT'||b.textContent==='RIGHT')b.style.display='none'})}
function milkClose(){if(!MG)return;cancelAnimationFrame(MG.raf);removeEventListener('keydown',MG.kd);MG.ov.remove();MG=null;busy=0}
