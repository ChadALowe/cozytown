/* ===== SUNHAVEN SPORTS PARK in 3D: you play every sport yourself, on the real courts.
   TENNIS (rally a CPU across the net) · BASKETBALL (shoot at the real hoop) · ARCHERY (aim down the range, mind the wind)
   100M SPRINT (race three runners down the track) · CRICKET (a bowler runs in, you swing the bat) · CLIMBING WALL (climb it!). ===== */
(function(){
const RS=window.RESORT,SPT=window.SPORTS,M5=()=>window.MARLOWE5,TAU=Math.PI*2,Y=G0,{OX,OZ}=RS,W=RS.W;
const GR=9.8;
function mk(seed,o){return mkPerson(pSpec(seed,Object.assign({scarf:null,bp:false,bag:0,old:false},o||{})),mObj,scene)}
function prop(f){const B=new Builder(3);f(B);return B.mesh(mObj)}
const BALL=(r,c)=>new THREE.Mesh(new THREE.SphereGeometry(r,12,10),new THREE.MeshBasicMaterial({color:c}));
const resetArms=()=>{for(const a of[armL,armR]){a.rotation.set(0,0,0);a.fore.rotation.set(0,0,0)}for(const l of[legL,legR]){l.rotation.set(0,0,0);l.shin.rotation.set(0,0,0)}};
function placeP(u,v,psi,y){P.x=OX+u;P.z=OZ+v;P.y=y==null?Y:y;P.psi=psi;man.visible=true}
/* common start/end */
function begin(k,o){const A=M5();if(!A.actStart('sp_'+k,Object.assign({fov:60},o||{})))return null;const st={k,objs:[],held:null,t:0};
 st.add=m=>{scene.add(m);st.objs.push(m);return m};st.hold=(m,arm,pos,rot)=>{(arm||armR).fore.add(m);m.position.set(...(pos||[0,-.42,.05]));if(rot)m.rotation.set(...rot);st.held=st.held||[];st.held.push(m);return m};
 st.finish=(score,msg)=>{if(st.done)return;st.done=1;const m=SPT.award(k,score);A.topTxt('🏅 '+msg+'\n'+m);toast('🏅 '+msg+' · '+m);setTimeout(()=>A.actEnd(),3600)};
 A.ACT.end=()=>{for(const m of st.objs)scene.remove(m);for(const m of st.held||[])m.parent&&m.parent.remove(m);resetArms();P.speed=0;const s=SPT.STN.find(s=>s.k===k);placeP(s.u,s.v,P.psi);if(st.onEnd)st.onEnd()};return st}
/* ================================================================== TENNIS */
function tennis(){const st=begin('tennis',{fov:58});if(!st)return;const A=M5(),C={u0:60,u1:100,v0:-590,v1:-566,net:80},vc=(C.v0+C.v1)/2;
 const opp=st.add(mk(9101,{ts:3,tc:[.95,.95,.95]}));const rk=()=>prop(B=>{pbox(B,0,0,0,.05,.4,.05,[.2,.2,.22]);pbox(B,0,-.42,0,.32,.42,.04,[.95,.4,.2])});st.hold(rk());const ork=rk();opp.add(ork);ork.position.set(.35,1,.2);
 const ball=st.add(BALL(.11,0xe8ff40));let pv=vc,ov=vc,b=null,me=0,cpu=0,serve=1,wait=1.2,sw=0,osw=0,lastHit=0,bounces=0,rally=0,dir=0,msg='';
 const newPt=s=>{serve=s;wait=1.1;b=null;bounces=0;rally=0};
 const hitTo=(from,u,v,y,toFar)=>{const tu=toFar?C.u1-4-Math.random()*8:C.u0+4+Math.random()*8,tv=C.v0+3+Math.random()*(C.v1-C.v0-6),T=Math.max(.75,1.15-rally*.02),vy=(Y+.1-y+.5*GR*T*T)/T;return{u,v,y,vu:(tu-u)/T,vv:(tv-v)/T+(from===0?dir*1.2:0),vy:Math.max(2,vy*.62+2.4),side:toFar?1:0}};
 A.btns([['◀',()=>dir=-1,()=>dir=0],['▶',()=>dir=1,()=>dir=0],['✕',()=>A.actEnd()]]);
 A.ACT.key=(e,d)=>{if(e.key==='ArrowLeft')dir=-1;if(e.key==='ArrowRight')dir=1};addEventListener('keyup',st.ku=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight')dir=0});st.onEnd=()=>removeEventListener('keyup',st.ku);
 A.ACT.tick=dt=>{st.t+=dt;if(st.done)return;const mv=(keys.left?-1:keys.right?1:dir);pv=Math.max(C.v0-1,Math.min(C.v1+1,pv+mv*6.5*dt));placeP(C.u0+2.5,pv,Math.PI/2);P.speed=Math.abs(mv)*5;P.phase+=P.speed*dt*2.3;sw=Math.max(0,sw-dt);osw=Math.max(0,osw-dt);
  if(!b){wait-=dt;if(wait<=0){if(serve===1){b=hitTo(0,C.u0+2.5,pv,Y+2.4,1);sw=.35;lastHit=0}else{b=hitTo(1,C.u1-2.5,ov,Y+2.4,0);osw=.35;lastHit=1}beep(500,.05,'square',.04)}else{ball.position.set(OX+(serve?C.u0+2.9:C.u1-2.9),Y+1.6+Math.abs(Math.sin(st.t*3))*.8,OZ+(serve?pv:ov))}}
  else{b.vy-=GR*dt;b.u+=b.vu*dt;b.v+=b.vv*dt;b.y+=b.vy*dt;if(b.y<Y+.11){b.y=Y+.11;b.vy=Math.abs(b.vy)*.72;bounces++;beep(260,.03,'square',.02);const inC=b.u>C.u0&&b.u<C.u1&&b.v>C.v0&&b.v<C.v1;if(bounces===1&&!inC){if(lastHit===0){cpu++;msg='OUT!'}else{me++;msg='OUT! YOUR POINT'}newPt(lastHit);return}if(bounces>=2){if(b.u<C.net){cpu++;msg='CPU POINT'}else{me++;msg='YOUR POINT!'}newPt(b.u<C.net?1:0);return}}
   if(Math.abs(b.u-C.net)<.3&&b.y<Y+1.0){if(b.vu>0){cpu++;msg='INTO THE NET'}else{me++;msg='CPU HIT THE NET!'}newPt(b.vu>0?1:0);return}
   const ou=C.u1-2.5;ov+=Math.max(-5.5*dt,Math.min(5.5*dt,(b.vu>0?b.v:vc)-ov));
   if(b.vu<0&&lastHit===1&&Math.abs(b.u-(C.u0+2.5))<1.6&&Math.abs(b.v-pv)<1.7&&b.y<Y+2.6){rally++;sw=.35;lastHit=0;b=hitTo(0,b.u,b.v,b.y,1);b.vv+=(b.v-pv)*-1.5;beep(600,.05,'square',.05)}
   if(b.vu>0&&lastHit===0&&Math.abs(b.u-ou)<1.6&&Math.abs(b.v-ov)<1.7&&b.y<Y+2.6){if(Math.random()<.88-rally*.025){osw=.35;lastHit=1;rally++;b=hitTo(1,b.u,b.v,b.y,0);beep(480,.05,'square',.05)}}
   if(b.u<C.u0-6){cpu++;msg='CPU POINT';newPt(1);return}if(b.u>C.u1+6){me++;msg='YOUR POINT!';newPt(0);return}ball.position.set(OX+b.u,b.y,OZ+b.v)}
  const op=W(C.u1-2.5,ov);opp.position.set(op[0],Y,op[1]);opp.rotation.y=-Math.PI/2;const s=Math.sin(st.t*12)*.5;if(opp.l1){opp.l1.rotation.x=s;opp.l2.rotation.x=-s}ork.rotation.x=osw>0?-1.5+osw*4:0;
  A.topTxt('🎾 TENNIS · YOU '+me+' – '+cpu+' CPU · FIRST TO 5'+(msg?' · '+msg:'')+'\n◀ ▶ TO MOVE · YOU SWING AUTOMATICALLY WHEN THE BALL IS NEAR');if(me>=5||cpu>=5)st.finish(me,(me>=5?'YOU WIN ':'YOU LOSE ')+me+'-'+cpu)};
 A.ACT.cam=()=>{armR.rotation.x=sw>0?-.4-Math.sin((.35-sw)/.35*Math.PI)*1.6:-.3;armR.rotation.z=sw>0?-.6:0;const p=W(C.u0-6.5,pv);cam.position.set(p[0],Y+4.8,p[1]);cam.lookAt(OX+C.net+4,Y+.6,OZ+pv*.5+vc*.5)}}
/* ================================================================== BASKETBALL */
let rim=null;function hoop(){if(rim)return;const p=W(112.6,-578);rim=new THREE.Mesh(new THREE.TorusGeometry(.24,.025,6,16).rotateX(Math.PI/2),new THREE.MeshBasicMaterial({color:0xe83a2a}));rim.position.set(p[0],Y+3.05,p[1]);scene.add(rim);const net=new THREE.Mesh(new THREE.CylinderGeometry(.24,.16,.4,10,1,true),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true}));net.position.set(p[0],Y+2.83,p[1]);scene.add(net)}
function bball(){hoop();const st=begin('bball',{fov:56});if(!st)return;const A=M5(),H={u:112.6,v:-578,y:Y+3.05},SP=[[118,-578,2],[117,-574,2],[121.5,-576,3],[117,-582,2],[122,-580,3]];
 const ball=st.add(BALL(.12,0xe8741a));let shot=0,pts=0,ph='aim',m=0,b=null,i=0,msg='';
 A.btns([['🏀 SHOOT!',()=>shoot()],['✕',()=>A.actEnd()]]);A.ACT.key=(e,d)=>{if(d&&e.key===' ')shoot()};
 function shoot(){if(ph!=='aim'||st.done)return;const s=SP[i%5],ideal=.6+(s[2]===3?.1:0),err=m-ideal,dist=Math.hypot(H.u-s[0],H.v-s[1]),T=.95+dist*.03,y0=Y+2.3;b={u:s[0],v:s[1],y:y0,vu:(H.u-s[0])/T*(1+err*.55),vv:(H.v-s[1])/T*(1+(Math.random()-.5)*Math.abs(err)*.8),vy:(H.y-y0+.5*GR*T*T)/T*(1+err*.35),ok:Math.abs(err)<.06,done:0};ph='fly';beep(300,.05,'square',.04)}
 A.ACT.tick=dt=>{st.t+=dt;if(st.done)return;const s=SP[i%5];placeP(s[0],s[1],Math.atan2(H.u-s[0],H.v-s[1]));P.speed=0;
  if(ph==='aim'){m=Math.sin(st.t*2.4)*.5+.5;ball.position.set(OX+s[0]-Math.sin(P.psi)*-.25,Y+2.25,OZ+s[1]);const id=.6+(s[2]===3?.1:0),n=20,k=Math.round(m*n),g=Math.round(id*n);A.topTxt('🏀 SHOT '+(shot+1)+'/10 · '+pts+' POINTS'+(s[2]===3?' · 3-POINT SPOT':'')+(msg?' · '+msg:'')+'\nPOWER ['+[...Array(n+1)].map((_,j)=>j===k?'█':Math.abs(j-g)<=1?'▒':'·').join('')+']  TAP SHOOT IN THE ▒ ZONE')}
  else{b.vy-=GR*dt;b.u+=b.vu*dt;b.v+=b.vv*dt;b.y+=b.vy*dt;if(!b.done&&b.vy<0&&Math.abs(b.y-H.y)<.15&&Math.hypot(b.u-H.u,b.v-H.v)<.5){b.done=1;if(b.ok||Math.random()<.3){pts+=s[2];msg=s[2]===3?'SWISH! THREE!':'SCORE!';b.vu*=.05;b.vv*=.05;b.vy=-1;beep(988,.1,'square',.05)}else{msg='RIM OUT!';b.vu*=-.5;b.vy=2;beep(200,.08,'square',.04)}}
   if(b.u<111.7&&b.y>Y+2.9&&b.y<Y+4.3&&Math.abs(b.v-H.v)<.9){b.vu=Math.abs(b.vu)*.5;beep(150,.05,'square',.04)}if(b.y<Y+.12){b.y=Y+.12;b.vy=Math.abs(b.vy)*.6;b.vu*=.7;b.vv*=.7}
   ball.position.set(OX+b.u,b.y,OZ+b.v);A.topTxt('🏀 '+(msg||'…'));if(st.t>0&&(b.t=(b.t||0)+dt)>2.4){if(!b.done)msg='AIRBALL!';shot++;i++;ph='aim';if(shot>=10)st.finish(pts,'YOU SCORED '+pts+' POINTS')}}};
 A.ACT.cam=()=>{const up=ph==='aim';armL.rotation.x=armR.rotation.x=up?-2.7:-3.0;armL.fore.rotation.x=armR.fore.rotation.x=up?-.8:0;const s=SP[i%5],dx=s[0]-H.u,dv=s[1]-H.v,l=Math.hypot(dx,dv);const p=W(s[0]+dx/l*5,s[1]+dv/l*5+1.2);cam.position.set(p[0],Y+3.4,p[1]);cam.lookAt(OX+H.u,Y+2.6,OZ+H.v)}}
/* ================================================================== ARCHERY */
function archery(){const st=begin('archery',{fov:34});if(!st)return;const A=M5(),T={u:104,v:-526.5,y:Y+1.8},me={u:104,v:-546};let n=6,pts=0,wind=(Math.random()-.5)*2.2,ax=0,ay=0,fly=null,msg='';
 st.hold(prop(B=>{pcyl(B,0,-.6,0,.02,1.3,4,[.45,.28,.15]);pbox(B,0,-.6,.08,.01,1.25,.01,[.9,.9,.9])}),armL,[0,-.2,.25],[0,0,0]);
 const cross=document.createElement('div');cross.style.cssText='position:fixed;left:50%;top:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border:3px solid #ff2a2a;border-radius:50%;z-index:40;pointer-events:none;box-shadow:0 0 0 2px #fff inset';document.body.appendChild(cross);const ce=st.onEnd;st.onEnd=()=>{cross.remove()};
 A.btns([['🏹 LOOSE!',()=>loose()],['✕',()=>A.actEnd()]]);A.ACT.key=(e,d)=>{if(d&&e.key===' ')loose()};
 function loose(){if(fly||!n||st.done)return;n--;const arrow=st.add(prop(B=>{pbox(B,0,0,0,.025,.025,.8,[.6,.45,.25]);pbox(B,0,0,-.38,.08,.08,.08,[.9,.2,.2])}));fly={m:arrow,t:0,tu:T.u+ax+wind*.25,ty:T.y+ay};beep(700,.04,'square',.04)}
 A.ACT.tick=dt=>{st.t+=dt;if(st.done)return;placeP(me.u,me.v,0);const t=st.t;ax=Math.sin(t*1.25)*.55+Math.sin(t*3.2)*.16+wind*.2;ay=Math.cos(t*1.6)*.42+Math.sin(t*2.5)*.12;
  if(fly){fly.t+=dt;const f=Math.min(1,fly.t/.55),p=W(me.u+(fly.tu-me.u)*f,me.v+(T.v-me.v)*f);fly.m.position.set(p[0],Y+1.55+(fly.ty-Y-1.55)*f+Math.sin(f*Math.PI)*.3,p[1]);fly.m.rotation.set(0,0,0);fly.m.lookAt(OX+fly.tu,fly.ty,OZ+T.v+1);if(f>=1){const d=Math.hypot(fly.tu-T.u,fly.ty-T.y),sc=Math.max(0,10-Math.floor(d/.12));pts+=sc;msg=sc===10?'BULLSEYE! 10':sc?sc+' POINTS':'MISSED THE TARGET';beep(sc>=9?1200:sc?600:150,.08,'square',.05);fly=null;if(!n)st.finish(pts,'YOU SCORED '+pts+'/60')}}
  const px=innerWidth/2+ax*170,py=innerHeight/2-ay*170;cross.style.left=px+'px';cross.style.top=py+'px';cross.style.display=st.done?'none':'block';
  A.topTxt('🏹 ARCHERY · ARROWS '+n+' · '+pts+' POINTS'+(msg?' · '+msg:'')+'\nWIND '+(wind>0?'→':'←')+' '+Math.abs(wind*10).toFixed(0)+' MPH · TAP LOOSE WHEN THE SIGHT IS ON THE GOLD')};
 A.ACT.cam=()=>{armL.rotation.x=-1.55;armL.rotation.z=.15;armR.rotation.x=-1.5;armR.rotation.z=-.5;armR.fore.rotation.x=-1.2;const p=W(me.u+.9,me.v-2.6);cam.position.set(p[0],Y+2.05,p[1]);cam.lookAt(OX+T.u,T.y,OZ+T.v)}}
/* ================================================================== 100M SPRINT */
function sprint(){const st=begin('sprint',{fov:58});if(!st)return;const A=M5(),L=[-503.25,-499.75,-496.25,-492.75],U0=57,U1=151;let go=-3.5,x=U0,v=0,last=0,t=0,fin=0,c0;
 const ai=[1,2,3].map(i=>({g:st.add(mk(9200+i,{ts:3,tc:[[.2,.4,.9],[.95,.8,.2],[.6,.2,.8]][i-1]})),x:U0,top:9.3+Math.random()*.8+(i===3?.4:0),ph:i}));
 const tap=s=>{if(go<0||fin)return;if(s!==last){v=Math.min(10.9,v+.85);last=s}else v*=.85};
 A.btns([['◀ LEFT',()=>tap(-1)],['RIGHT ▶',()=>tap(1)],['✕',()=>A.actEnd()]]);A.ACT.key=(e,d)=>{if(!d)return;if(e.key==='ArrowLeft')tap(-1);if(e.key==='ArrowRight')tap(1)};
 A.ACT.tick=dt=>{st.t+=dt;const c=Math.ceil(-go);go+=dt;if(go<0){if(c!==c0){c0=c;beep(440,.15,'square',.05)}A.topTxt('🏃 100M SPRINT · ON YOUR MARKS… '+c+'\nTAP ◀ ▶ ◀ ▶ ALTERNATELY AS FAST AS YOU CAN');placeP(x,L[0],Math.PI/2);P.speed=0;posAI(0);return}if(c0!==0){c0=0;beep(880,.3,'square',.06)}
  if(!fin)t+=dt;v*=Math.exp(-.9*dt);x+=v*dt;placeP(Math.min(U1+3,x),L[0],Math.PI/2);P.speed=v;P.phase+=v*dt*1.25;posAI(dt);
  if(x>=U1&&!fin){fin=1;const pl=1+ai.filter(a=>a.x>=U1).length,tm=+t.toFixed(2);st.finish(tm,'YOU FINISHED '+['1ST','2ND','3RD','4TH'][pl-1]+' IN '+tm+'s')}
  if(!fin)A.topTxt('🏃 '+t.toFixed(2)+'s · '+Math.round(Math.min(100,(x-U0)/(U1-U0)*100))+'M\nSPEED '+'█'.repeat(Math.round(v))+'░'.repeat(Math.max(0,11-Math.round(v))));if(t>30&&!fin){fin=1;st.finish(99,'TOO SLOW!')}};
 function posAI(dt){ai.forEach((a,i)=>{if(go>0)a.x=Math.min(U1+4,a.x+Math.min(a.top,go*4.2)*dt);const sp=go>0?Math.min(a.top,go*4.2):0,p=W(a.x,L[i+1]);a.g.position.set(p[0],Y,p[1]);a.g.rotation.y=Math.PI/2;a.ph+=sp*dt*1.3;const s=Math.sin(a.ph)*.9*Math.min(1,sp/3);if(a.g.l1){a.g.l1.rotation.x=s;a.g.l2.rotation.x=-s;a.g.a1.rotation.x=-s;a.g.a2.rotation.x=s}})}
 A.ACT.cam=()=>{const cu=Math.min(U1+2,x);const p=W(cu-3,-511.5);cam.position.set(p[0],Y+3.2,p[1]);cam.lookAt(OX+cu+5,Y+1.1,OZ+L[1])}}
/* ================================================================== CRICKET */
function cricket(){const st=begin('cricket',{fov:56});if(!st)return;const A=M5(),BU=63,BV=-442.4,ST={u:63,v:-441};let balls=12,wk=3,runs=0,b=null,wait=1.6,sw=0,msg='',bwl=st.add(mk(9300,{ts:3,tc:[.95,.95,.95]})),bt=0,stumps=null;
 st.hold(prop(B=>{pbox(B,0,0,0,.05,.35,.05,[.3,.2,.15]);pbox(B,0,-.55,0,.11,.62,.04,[.9,.8,.55])}),armR,[0,-.4,.08],[0,0,0]);
 stumps=st.add(prop(B=>{for(const x of[-.11,0,.11])pbox(B,x,0,0,.04,.72,.04,[.95,.9,.7])}));const sp=W(ST.u,ST.v);stumps.position.set(sp[0],Y,sp[1]);
 const ball=st.add(BALL(.09,0xc01a1a));ball.visible=false;
 A.btns([['🏏 SWING!',()=>swing()],['✕',()=>A.actEnd()]]);A.ACT.key=(e,d)=>{if(d&&e.key===' ')swing()};
 function swing(){if(sw>0||st.done)return;sw=.35;beep(260,.04,'square',.03);if(!b||b.hit||b.st!=='fly')return;const d=b.v-BV;if(Math.abs(d)<2.2&&b.y<Y+1.5){const q=Math.abs(d+.6),r=q<.35?6:q<.7?4:q<1.1?2:q<1.6?1:0;b.hit=1;b.vv=-(14+r*3);b.vy=3+r*1.6;b.vu=(Math.random()-.5)*14;runs+=r;msg=r===6?'SIX!! 🎉':r===4?'FOUR!':r?r+' RUN'+(r>1?'S':''):'DOT BALL';beep(r>=4?1100:600,.1,'square',.05);if(r===6)window.RESORT2.cheer()}}
 function next(){b=null;ball.visible=false;balls--;wait=1.4;stumps.rotation.x=0;if(balls<=0||wk<=0)st.finish(runs,runs+' RUNS ('+(3-wk)+' OUT)')}
 A.ACT.tick=dt=>{st.t+=dt;if(st.done)return;placeP(BU+.45,BV,Math.PI);P.speed=0;sw=Math.max(0,sw-dt);
  if(!b){wait-=dt;const p=W(63,-476);bwl.position.set(p[0],Y,p[1]);bwl.rotation.y=0;if(wait<=0&&balls>0&&wk>0)b={st:'run',t:0}}
  else if(b.st==='run'){b.t+=dt;const v=-476+b.t*6,p=W(63.3,v);bwl.position.set(p[0],Y,p[1]);const s=Math.sin(b.t*14)*.8;if(bwl.l1){bwl.l1.rotation.x=s;bwl.l2.rotation.x=-s;bwl.a2.rotation.x=-s}if(v>=-466){bwl.a2.rotation.x=-3;const pace=17+Math.random()*7;b={st:'fly',u:63.1,v:-466,y:Y+2.2,vu:(Math.random()-.5)*.4,vv:pace,vy:-1.5-Math.random(),hit:0};ball.visible=true}}
  else if(b.st==='done'){}else{if(!b.hit){b.vy-=GR*dt*.8;b.u+=b.vu*dt;b.v+=b.vv*dt;b.y+=b.vy*dt;if(b.y<Y+.09){b.y=Y+.09;b.vy=Math.abs(b.vy)*.55+1.2;b.vu+=(Math.random()-.5)*1.5}if(b.v>ST.v-.05){if(Math.abs(b.u-ST.u)<.22&&b.y<Y+.8){wk--;msg='BOWLED! 💥';stumps.rotation.x=-.8;beep(100,.3,'sawtooth',.05)}else msg='MISSED IT';b.st='done';setTimeout(next,1200)}}
   else{b.vy-=GR*dt;b.u+=b.vu*dt;b.v+=b.vv*dt;b.y=Math.max(Y+.09,b.y+b.vy*dt);if(b.v<-500){b.st='done';setTimeout(next,300)}}ball.position.set(OX+b.u,b.y,OZ+b.v)}
  A.topTxt('🏏 RUNS '+runs+' · WICKETS '+wk+' · BALLS '+balls+(msg?' · '+msg:'')+'\nTAP SWING JUST AS THE BALL REACHES YOU. PERFECT TIMING = SIX!')};
 A.ACT.cam=()=>{armR.rotation.x=sw>0?-1.9+(.35-sw)/.35*2.6:-1.0;armR.rotation.z=sw>0?-.5:-.2;armL.rotation.x=armR.rotation.x*.9;const p=W(64.2,-437.2);cam.position.set(p[0],Y+2.8,p[1]);cam.lookAt(OX+63,Y+1,OZ-452)}}
/* ================================================================== CLIMBING WALL */
function climb(){const st=begin('climb',{fov:60});if(!st)return;const A=M5(),WU=120,WV=-461.55,N=40,seq=[...Array(N)].map(()=>Math.random()<.5?-1:1);let h=0,y=0,ty=0,tm=2,T=2,fall=0,reach=0,side=1,msg='';
 const glow=st.add(new THREE.Mesh(new THREE.SphereGeometry(.22,10,8),new THREE.MeshBasicMaterial({color:0xffe040,fog:false})));const holds=[];for(let i=0;i<N;i++){const m=st.add(new THREE.Mesh(new THREE.SphereGeometry(.14,8,6),new THREE.MeshBasicMaterial({color:[0xe83a5a,0x3a8ad8,0x3ad870,0xd83ad8][i%4]})));const p=W(WU+seq[i]*.55,WV+.12);m.position.set(p[0],Y+1.9+i*.4,p[1]);holds.push(m)}
 const rope=st.add(new THREE.Mesh(new THREE.CylinderGeometry(.02,.02,1,4),new THREE.MeshBasicMaterial({color:0xff6040})));
 const grab=s=>{if(fall||st.done)return;if(s===seq[h]){h++;ty=h*.4;side=s;reach=.3;T=Math.max(.5,2-h*.045);tm=T;beep(500+h*20,.05,'square',.04);if(h>=N){msg='YOU RANG THE BELL!';beep(1500,.5,'triangle',.06);st.finish(N,'YOU REACHED THE TOP! '+N+'M')}}else drop()};
 const drop=()=>{fall=1;msg='SLIPPED!';beep(200,.5,'sawtooth',.05);setTimeout(()=>st.finish(h,'YOU SLIPPED AT '+h+'M · THE ROPE CAUGHT YOU'),1600)};
 A.btns([['◀ LEFT',()=>grab(-1)],['RIGHT ▶',()=>grab(1)],['✕',()=>A.actEnd()]]);A.ACT.key=(e,d)=>{if(!d)return;if(e.key==='ArrowLeft')grab(-1);if(e.key==='ArrowRight')grab(1)};
 A.ACT.tick=dt=>{st.t+=dt;if(!fall&&!st.done){tm-=dt;if(tm<=0)drop()}if(fall)ty=Math.max(0,ty-dt*3);y+=(ty-y)*Math.min(1,dt*8);reach=Math.max(0,reach-dt);placeP(WU+(h?seq[h-1]*.25:0),WV-.38,0,Y+y);P.speed=0;
  const nx=h<N?seq[h]:0,gp=W(WU+nx*.55,WV+.1);glow.position.set(gp[0],Y+1.9+h*.4,gp[1]);glow.visible=!fall&&h<N;const rp=W(WU,WV-.3);rope.position.set(rp[0],Y+8+y/2,rp[1]);rope.scale.y=16-y;
  const n=10,k=Math.round(Math.max(0,tm/T)*n);A.topTxt('🧗 '+h+'M / '+N+'M'+(msg?' · '+msg:'')+'\nGRIP ['+'█'.repeat(k)+'·'.repeat(n-k)+']  TAP THE SIDE OF THE GLOWING HOLD: '+(nx<0?'◀ LEFT':'RIGHT ▶'))};
 A.ACT.cam=()=>{const up=reach>0;armL.rotation.x=side<0&&up?-3:-2.2;armR.rotation.x=side>0&&up?-3:-2.2;legL.rotation.x=side<0?-.6:-.1;legR.rotation.x=side>0?-.6:-.1;const p=W(WU+2.2,WV-6.5);cam.position.set(p[0],Y+y+2.2,p[1]);cam.lookAt(OX+WU,Y+y+1.6,OZ+WV)}}
Object.assign(SPT.GAMES,{tennis,bball,archery,sprint,cricket,climb});
})();
