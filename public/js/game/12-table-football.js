/* ---- TABLE FOOTBALL in the pub (pub is deepened towards the door to make room) ---- */
var FBS={w:0,l:0,n:0,g:0},FB=null,FBT=null,FG=null,FBBALL=null,FBSH=null;
const FTX=-3.0,FTZ=4.4,FTY=.82,FFX=.6,FFZ=.34,FGZ=.11,FBR=.024;
const FRODS=[{t:0,k:'GK',x:-.525,off:[0],T:.25},{t:0,k:'DEF',x:-.375,off:[-.12,.12],T:.19},{t:1,k:'ATT',x:-.225,off:[-.2,0,.2],T:.118},{t:0,k:'MID',x:-.075,off:[-.26,-.13,0,.13,.26],T:.055},{t:1,k:'MID',x:.075,off:[-.26,-.13,0,.13,.26],T:.055},{t:0,k:'ATT',x:.225,off:[-.2,0,.2],T:.118},{t:1,k:'DEF',x:.375,off:[-.12,.12],T:.19},{t:1,k:'GK',x:.525,off:[0],T:.25}];
function pubDeepen(){const ch=SG.children,D=2.4,f=(6.4+D)/6.4;RZ=5.6;
 const fl=ch[0];fl.scale.z=f;fl.position.z=D/2;if(fl.material.map)fl.material.map.repeat.y*=f;
 for(const i of[3,4]){const m=ch[i];m.material=m.material.clone();if(m.material.map){m.material.map=m.material.map.clone();m.material.map.repeat.x*=f;m.material.map.needsUpdate=true}m.scale.x=f;m.position.z=D/2}
 ch[2].position.z+=D;for(let i=6;i<ch.length;i++){const m=ch[i];if(m.position.z>3.0)m.position.z+=D}
 IA.forEach(a=>{if(a.label==='LEAVE'){a.r[2]+=D;a.r[3]+=D}});
 fbBuild()}
function fbFelt(){const f=cvT(600,340),g=f.cv.getContext('2d'),gr=g.createLinearGradient(0,0,600,0);gr.addColorStop(0,'#1d6a2a');gr.addColorStop(.5,'#26803a');gr.addColorStop(1,'#1d6a2a');g.fillStyle=gr;g.fillRect(0,0,600,340);
 for(let i=0;i<12;i++){g.fillStyle=i%2?'rgba(0,0,0,.05)':'rgba(255,255,255,.04)';g.fillRect(i*50,0,50,340)}
 g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=3;g.strokeRect(4,4,592,332);g.beginPath();g.moveTo(300,4);g.lineTo(300,336);g.stroke();g.beginPath();g.arc(300,170,44,0,7);g.stroke();
 g.strokeRect(4,170-70,70,140);g.strokeRect(526,170-70,70,140);g.strokeRect(4,170-42,30,84);g.strokeRect(566,170-42,30,84);g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.arc(300,170,4,0,7);g.fill();f.tx.needsUpdate=true;return f.tx}
function fbBuild(){const g=new THREE.Group();g.position.set(FTX,FTY,FTZ);SG.add(g);FB=g;const W=(x,y,z,w,h,d,hex)=>gbox(g,x,y,z,w,h,d,hex);
 for(const sx of[-1,1])for(const sz of[-1,1])W(sx*.6,-FTY,sz*.35,.07,FTY-.1,.07,0x3a2410);
 W(0,-.1,0,1.2,.098,.7,0x4a3018);
 for(const sz of[-1,1])W(0,-.1,sz*.37,1.32,.15,.06,0x5a3416);
 for(const sx of[-1,1])for(const sz of[-1,1])W(sx*.63,-.1,sz*.255,.06,.15,.29,0x5a3416);
 for(const sx of[-1,1]){W(sx*.66,-.1,0,.1,.04,.22,0x15151a);W(sx*.63,-.1,0,.06,.07,.23,0x101014)}
 const fp=new THREE.Mesh(new THREE.PlaneGeometry(1.2,.68).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({map:fbFelt()}));fp.position.y=.002;g.add(fp);
 const mat=c=>new THREE.MeshBasicMaterial({color:c});
 FBT=FRODS.map((r,i)=>{const dir=r.t===0?1:-1,rg=new THREE.Group();rg.position.set(r.x,.065,0);g.add(rg);const sl=new THREE.Group();rg.add(sl);const men=new THREE.Group();sl.add(men);
  const rod=new THREE.Mesh(new THREE.CylinderGeometry(.007,.007,1.1,8).rotateX(Math.PI/2),mat(0xb8b8c0));sl.add(rod);
  const gm=mat(0x181818),grip=new THREE.Mesh(new THREE.CylinderGeometry(.017,.017,.12,10).rotateX(Math.PI/2),gm);grip.position.z=dir*.52;sl.add(grip);
  const col=r.t===0?0xd03030:0x2f5fd0;r.off.forEach(o=>{gbox(men,0,-.045,o,.026,.075,.044,col);gbox(men,0,.03,o,.022,.022,.022,0xe8c8a0);gbox(men,dir*.006,-.075,o,.034,.03,.04,0x202028)});
  return Object.assign({},r,{i,dir,rg,sl,men,gm,s:0,st:0,vz:0,th:0,thd:0,kt:-1,cd:0,pw:.8,aimZ:0,aiT:0,err:0})});
 FBBALL=new THREE.Mesh(new THREE.SphereGeometry(FBR,12,8),new THREE.MeshBasicMaterial({color:0xf6f6f0}));FBBALL.position.set(0,FBR,0);g.add(FBBALL);
 FBSH=new THREE.Mesh(new THREE.CircleGeometry(FBR*1.1,12).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.35}));FBSH.position.y=.004;g.add(FBSH);
 window.FDAVE=personIn(pSpec(9701,{f:false,gl:false,scarf:null,bp:false,bag:0,old:false,tc:[.25,.4,.7],bc:[.14,.18,.3],hs:3,beard:true}),FTX,3.45,0);FDAVE.a1.rotation.x=FDAVE.a2.rotation.x=-1.15;
 IROOM.push([FTX-.85,FTX+.85,3.88,4.93],[FTX-.3,FTX+.3,3.2,3.7]);IA.push({r:[FTX-.9,FTX+.9,4.9,5.6],label:'TABLE FOOTBALL vs DAVE (£2)',fn:fbOpen});
 sPlane(1.6,.6,FTX,1.85,RZ-.03,Math.PI,txtTex(512,128,'#1a2a1a','#f0e0a0','TABLE FOOTBALL',46));
 for(const r of FBT)fbPose(r)}
function fbPose(r){r.sl.position.z=r.s;r.men.rotation.z=r.dir*r.th}
{const b0=buildShop;buildShop=function(o){RZ=3.2;FB=null;b0(o);if(o.pub)pubDeepen()}}
{const u0=updCozy;updCozy=function(dt){u0(dt);const z=GS.inside&&SHOPCUR&&SHOPCUR.o.pub?5.6:3.2;if(RZ!==z&&!(GS.inside&&SHOPCUR&&SHOPCUR.o.rz))RZ=z}}
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.fb=FBS;return o};cozyLoad=function(z){l0(z);if(z&&z.fb)FBS=Object.assign({w:0,l:0,n:0,g:0},z.fb)}}
/* ---- game ---- */
function fbCam(){const asp=cam.aspect||1.6,pt=asp<1.1,p=pt?[-1.3,1.78,0]:[-1.05,1.5,0],l=pt?[.1,0,0]:[.05,0,0];DZ.look=FB.localToWorld(new THREE.Vector3(l[0],l[1],l[2]));return FB.localToWorld(new THREE.Vector3(p[0],p[1],p[2]))}
function fbMsg(t,ms){const e=document.getElementById('fbM');if(e)e.textContent=t;if(FG)FG.mt=ms||2000}
function fbOpen(){if(FG||!FB)return;busy=1;inp.gas=inp.brk=inp.hand=inp.pad=0;document.body.classList.add('dz');man.visible=false;
 const stake=cash>=2?2:0;if(stake)cash-=2;FBS.n++;for(const r of FBT){r.s=r.st=r.vz=r.th=r.thd=0;r.kt=-1;r.cd=0;fbPose(r)}
 const ov=document.createElement('div');ov.id='fbov';ov.style.cssText='position:fixed;inset:0;z-index:60;font:bold 13px monospace;color:#fff;touch-action:none;user-select:none;-webkit-user-select:none';
 ov.innerHTML='<div style="position:absolute;left:0;right:0;top:6px;text-align:center;pointer-events:none;text-shadow:2px 2px 0 #000"><div style="color:#f5e6a0;font-size:14px">TABLE FOOTBALL vs DAVE'+(stake?' · STAKE £'+stake:' · PRACTICE')+'</div><div id="fbS" style="font-size:22px;margin-top:2px">YOU 0 - 0 DAVE</div><div id="fbM" style="min-height:20px;color:#9fe;font-size:13px"></div></div><div id="fbG" style="position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);font-size:44px;color:#ffd840;text-shadow:3px 3px 0 #000;pointer-events:none;text-align:center"></div><div style="position:absolute;left:0;right:0;bottom:6px;text-align:center;font-size:11px;color:#cde;text-shadow:1px 1px 0 #000;pointer-events:none">TOUCH A ROD · DRAG SIDEWAYS TO SLIDE · FLICK UP OR KICK TO SHOOT</div>';
 const bs='position:absolute;font:bold 16px monospace;border:3px solid #f5e6a0;border-radius:10px;color:#fff;touch-action:manipulation;pointer-events:auto;';
 const mkb=(t,css,fn)=>{const b=document.createElement('button');b.textContent=t;b.style.cssText=bs+css;b.onclick=fn;return b};
 const kick=mkb('KICK','right:12px;bottom:28px;padding:20px 24px;font-size:20px;background:#b02020',()=>{});kick.onpointerdown=e=>{e.stopPropagation();fbKick(FG.sel,.9)};kick.onclick=null;
 const lv=mkb('LEAVE','right:8px;top:6px;font-size:12px;padding:7px 10px;background:#333',()=>fbClose(1));
 const ch=document.createElement('div');ch.style.cssText='position:absolute;left:8px;bottom:28px;display:flex;flex-direction:column;gap:5px';
 const names=['ATT','MID','DEF','GK'],idx=[5,3,1,0];names.forEach((n,k)=>{const b=document.createElement('button');b.textContent=n;b.dataset.i=idx[k];b.style.cssText='font:bold 14px monospace;border:3px solid #f5e6a0;border-radius:8px;color:#fff;padding:8px 12px;background:#335;pointer-events:auto;touch-action:manipulation';b.onpointerdown=e=>{e.stopPropagation();FG.sel=idx[k]};ch.append(b)});
 ov.append(lv,kick,ch);document.body.append(ov);
 const G=FG={ov,chips:ch,stake,sc:[0,0],ph:'serve',t:2.2,bx:0,bz:0,vx:0,vz:0,sel:5,drag:null,idle:9,keys:{},still:0,mt:0,last:performance.now(),over:0};
 FBBALL.visible=FBSH.visible=true;fbBallPos();if(window.FDAVE)FDAVE.visible=false;
 ov.onpointerdown=e=>{if(G.over)return;const r=fbPick(e.clientY);G.sel=r.i;const p=fbPx(r);G.drag={x0:e.clientX,y0:e.clientY,t0:performance.now(),s0:r.st,ppm:p,id:e.pointerId};G.idle=0;try{ov.setPointerCapture(e.pointerId)}catch(_){czErr(_,"12-table-football.js")}};
 ov.onpointermove=e=>{const d=G.drag;if(!d)return;const r=FBT[G.sel];r.st=clamp(d.s0+(e.clientX-d.x0)/d.ppm,-r.T,r.T);G.idle=0};
 ov.onpointerup=e=>{const d=G.drag;if(!d)return;G.drag=null;const dy=e.clientY-d.y0,dx=e.clientX-d.x0,dt=performance.now()-d.t0;if(dy<-55&&dt<320&&Math.abs(dy)>Math.abs(dx)*.8)fbKick(G.sel,clamp(.55+Math.abs(dy)/300,.55,1))};ov.onpointercancel=()=>{G.drag=null};
 G.kd=e=>{G.keys[e.key]=1;if(e.key===' ')fbKick(G.sel,.9);if(e.key>='1'&&e.key<='4')G.sel=[0,1,3,5][+e.key-1]};G.ku=e=>{G.keys[e.key]=0};addEventListener('keydown',G.kd);addEventListener('keyup',G.ku);
 DZ.fn=fbCam;DZ.fov=46;DZ.tp=fbCam();DZ.look=new THREE.Vector3();DZ.on=1;fbCam();fbMsg('GET READY',1800);fbScore();
 G.raf=requestAnimationFrame(fbLoop)}
function fbPick(cy){let best=FBT[5],bd=1e9;for(const r of FBT){if(r.t!==0)continue;const v=FB.localToWorld(new THREE.Vector3(r.x,.065,0)).project(cam),sy=(1-v.y)/2*innerHeight,d=Math.abs(sy-cy);if(d<bd){bd=d;best=r}}return best}
function fbPx(r){const a=FB.localToWorld(new THREE.Vector3(r.x,.065,-.3)).project(cam),b=FB.localToWorld(new THREE.Vector3(r.x,.065,.3)).project(cam);const ppm=((b.x-a.x)/2*innerWidth)/.6;return Math.abs(ppm)<30?200:ppm}
function fbKick(i,pw){const G=FG;if(!G||G.over||G.ph==='goal')return;const r=FBT[i];if(!r||r.kt>=0||r.cd>0)return;r.kt=0;r.pw=pw;r.aimZ=0;beep(160,.05,'square',.04)}
function fbBallPos(){FBBALL.position.set(FG.bx,FBR,FG.bz);FBSH.position.set(FG.bx,.004,FG.bz)}
function fbScore(){const e=document.getElementById('fbS');if(e)e.textContent='YOU '+FG.sc[0]+' - '+FG.sc[1]+' DAVE'}
function fbServe(toward){const G=FG;G.bx=0;G.bz=(Math.random()-.5)*.1;G.vx=toward*.55;G.vz=(Math.random()-.5)*.25;G.ph='play';G.still=0;FBBALL.visible=FBSH.visible=true;fbBallPos();fbMsg('PLAY!',900)}
function fbGoal(team){const G=FG;G.sc[team]++;G.ph='goal';G.t=1.6;G.vx=G.vz=0;FBBALL.visible=FBSH.visible=false;fbScore();const e=document.getElementById('fbG');if(e)e.textContent=team===0?'GOAL!':'DAVE SCORES!';
 beep(team===0?660:200,.15,team===0?'square':'sawtooth',.07);if(team===0)setTimeout(()=>beep(990,.2,'square',.07),130);G.last_scorer=team}
function fbLoop(now){const G=FG;if(!G)return;const dt=Math.min(.05,(now-G.last)/1000);G.last=now;fbStep(dt);G.raf=requestAnimationFrame(fbLoop)}
function fbStep(dt){const G=FG;if(G.mt>0){G.mt-=dt*1000;if(G.mt<=0)fbMsg('',0)}
 G.idle+=dt;for(const b of G.chips.children)b.style.background=+b.dataset.i===G.sel?'#d9a21a':'#335';
 // keyboard slide
 {const r=FBT[G.sel],k=G.keys;const m=(k.ArrowRight||k.d?1:0)-(k.ArrowLeft||k.a?1:0);if(m){r.st=clamp(r.st+m*dt*1.3,-r.T,r.T);G.idle=0}}
 // auto select rod nearest the ball when not touching
 if(!G.drag&&G.idle>.7&&G.ph==='play'){let best=G.sel,bd=9;for(const r of FBT){if(r.t!==0)continue;const d=Math.abs(G.bx-r.x)+(r.x<G.bx-.02?0:.05);if(d<bd){bd=d;best=r.i}}G.sel=best}
 if(G.ph==='serve'){G.t-=dt;const e=document.getElementById('fbG');if(e)e.textContent=G.t>.9?'READY':G.t>0?'GO!':'';if(G.t<=0){if(e)e.textContent='';fbServe(G.serveTo||-1);G.serveTo=0}}
 else if(G.ph==='goal'){G.t-=dt;if(G.t<=0){const e=document.getElementById('fbG');if(e)e.textContent='';if(G.sc[0]>=5||G.sc[1]>=5)fbEnd(G.sc[0]>=5?0:1);else{G.ph='serve';G.t=1.3;G.bx=0;G.bz=0;FBBALL.visible=FBSH.visible=true;fbBallPos();G.serveTo=G.last_scorer===0?1:-1}}
  if(G.ph==='serve'&&G.serveTo){}}
 if(G.ph==='serve'&&G.serveTo&&G.t<=0){}
 fbAI(dt);
 const n=Math.max(1,Math.ceil(dt*6/.01)),h=dt/n;for(let s=0;s<n;s++){fbSub(h);if(G.ph==='goal'||G.over)break}
 for(const r of FBT)fbPose(r);
 for(const r of FBT)if(r.t===0)r.gm.color.setHex(r.i===G.sel?0xffd840:0x181818);
 fbBallPos()}
function fbSub(h){const G=FG;
 for(const r of FBT){const ms=r.t===0?2.6:r.ai||1.25,old=r.s,d=r.st-r.s,mv=Math.max(-ms*h,Math.min(ms*h,d));r.s+=mv;r.vz=mv/h;
  if(r.kt>=0){r.kt+=h;if(r.kt>=.3){r.kt=-1;r.cd=.1;r.th=0;r.thd=0}else{r.th=r.kt<.075?1.2*(r.kt/.075):1.2*(1-(r.kt-.075)/.225);r.thd=r.kt<.075?16:-5.3}}else{if(r.cd>0)r.cd-=h;r.th=0;r.thd=0}}
 if(G.ph!=='play')return;
 G.bx+=G.vx*h;G.bz+=G.vz*h;
 const sp0=Math.hypot(G.vx,G.vz);if(sp0>0){const dec=(.12+.05*sp0)*h,ns=Math.max(0,sp0-dec);G.vx*=ns/sp0;G.vz*=ns/sp0}
 for(const r of FBT){const swing=r.kt>=0&&r.kt<.09,mx=r.x+r.dir*(.006+.075*Math.sin(r.th)),hx=.019,hz=.022;
  if(Math.abs(G.bx-mx)>hx+FBR+.02)continue;
  for(const off of r.off){const mz=r.s+off,cx=clamp(G.bx,mx-hx,mx+hx),cz=clamp(G.bz,mz-hz,mz+hz),dx=G.bx-cx,dz=G.bz-cz,d2=dx*dx+dz*dz;
   if(d2<FBR*FBR){let d=Math.sqrt(d2),nx,nz;if(d>1e-6){nx=dx/d;nz=dz/d}else{const ax=G.bx-mx,az=G.bz-mz;if(Math.abs(ax)/hx>Math.abs(az)/hz){nx=Math.sign(ax)||1;nz=0}else{nx=0;nz=Math.sign(az)||1}d=0}
    G.bx+=nx*(FBR-d);G.bz+=nz*(FBR-d);const ux=r.dir*.075*Math.cos(r.th)*r.thd,uz=r.vz;let rx=G.vx-ux,rz=G.vz-uz;const vn=rx*nx+rz*nz;
    if(vn<0){rx-=1.5*vn*nx;rz-=1.5*vn*nz;G.vx=rx+ux;G.vz=rz+uz}
    if(swing&&nx*r.dir>.25){const kv=2.4+3.1*r.pw;G.vx=r.dir*kv*(.93+Math.random()*.14);if(r.aimV!==undefined){G.vz=r.aimV;r.aimV=undefined}else G.vz+=(G.bz-mz)*6+r.vz*.5;beep(300,.04,'square',.04)}}}}
 const spd=Math.hypot(G.vx,G.vz);if(spd>6){G.vx*=6/spd;G.vz*=6/spd}
 if(G.bz>FFZ-FBR){G.bz=FFZ-FBR;if(G.vz>0)G.vz*=-.8}else if(G.bz<-FFZ+FBR){G.bz=-FFZ+FBR;if(G.vz<0)G.vz*=-.8}
 const ax=Math.abs(G.bx);if(ax>FFX-FBR){if(Math.abs(G.bz)<FGZ-.004){if(ax>FFX+FBR*.7){fbGoal(G.bx>0?0:1);return}}else{const sg=Math.sign(G.bx);G.bx=sg*(FFX-FBR);if(G.vx*sg>0)G.vx*=-.8}}
 if(spd<.03){G.still+=h;if(G.still>1.4){G.still=0;G.vx=(Math.random()-.5)*1.2;G.vz=(Math.random()-.5)*1.2;fbMsg('NUDGED',900)}}else G.still=0}
function fbAI(dt){const G=FG;if(G.ph!=='play')return;
 for(const r of FBT){if(r.t!==1)continue;r.ai=.95;r.aiT-=dt;if(r.aiT<=0){r.aiT=.25+Math.random()*.25;r.err=(Math.random()-.5)*.09}
  r.bzF=(r.bzF===undefined?G.bz:r.bzF)+(G.bz-(r.bzF===undefined?G.bz:r.bzF))*Math.min(1,dt*3.8);const bz=r.bzF+r.err;let need=0,bd=9;for(const off of r.off){const nd=clamp(bz-off,-r.T,r.T),dd=Math.abs(nd-r.st);if(dd<bd){bd=dd;need=nd}}r.st=need;
  const ahead=r.dir*(G.bx-r.x);let near=9;for(const off of r.off)near=Math.min(near,Math.abs(G.bz-(r.s+off)));
  if(ahead>-.004&&ahead<.072&&near<.036&&r.kt<0&&r.cd<=0&&Math.random()<dt*6){r.kt=0;r.pw=.45+Math.random()*.4;r.aimV=fbAim(r,r.k==='ATT'?.08:r.k==='MID'?.12:.25)}}}
function fbAim(r,sp){const G=FG,gx=-r.dir*FFX,dx=Math.max(.12,Math.abs(gx-G.bx)),zt=(Math.random()-.5)*2*sp,kv=2.4+3.1*r.pw;return clamp((zt-G.bz)*kv/dx*.95,-2.2,2.2)}
function fbEnd(won){const G=FG;G.over=1;G.ph='done';FBS[won===0?'w':'l']++;FBS.g+=G.sc[0];let t;
 if(won===0){const w=G.stake?5:0;cash+=w;t='YOU WIN '+G.sc[0]+'-'+G.sc[1]+'!'+(w?' +£'+w:'');beep(660,.12,'square',.06);setTimeout(()=>beep(880,.12,'square',.06),130);setTimeout(()=>beep(1180,.2,'square',.06),260)}else{t='DAVE WINS '+G.sc[1]+'-'+G.sc[0]+(G.stake?'. STAKE LOST':'.');beep(200,.4,'sawtooth',.06)}
 const d=document.createElement('div');d.style.cssText='position:absolute;left:50%;top:38%;transform:translate(-50%,-50%);text-align:center;background:rgba(0,0,0,.78);border:3px solid #f5e6a0;border-radius:12px;padding:14px 20px;pointer-events:auto;font-size:16px';
 d.innerHTML='<div style="font-size:22px;color:#ffd840;margin-bottom:6px">'+t+'</div><div style="font-size:12px;color:#ccc;margin-bottom:10px">WON '+FBS.w+' · LOST '+FBS.l+' · GOALS '+FBS.g+'</div>';
 const bt2=(x,fn,c)=>{const b=document.createElement('button');b.textContent=x;b.style.cssText='font:bold 14px monospace;padding:10px 14px;margin:4px;border:3px solid #f5e6a0;border-radius:10px;color:#fff;background:'+c;b.onclick=fn;return b};
 d.append(bt2('REMATCH (£2)',()=>{fbClose(0);fbOpen()},'#2a7a3a'),bt2('LEAVE',()=>fbClose(0),'#333'));G.ov.append(d)}
function fbClose(q){const G=FG;if(!G)return;cancelAnimationFrame(G.raf);removeEventListener('keydown',G.kd);removeEventListener('keyup',G.ku);G.ov.remove();if(q&&!G.over&&G.stake)toast('YOU WALKED OFF. STAKE LOST');FG=null;
 for(const r of FBT){r.s=r.st=0;r.th=0;r.kt=-1;fbPose(r)}FBBALL.position.set(0,FBR,0);FBSH.position.set(0,.004,0);FBBALL.visible=FBSH.visible=true;if(window.FDAVE)FDAVE.visible=true;
 DZ.fn=null;DZ.fov=46;DZ.on=0;document.body.classList.remove('dz');man.visible=true;DZ.exit=1}
