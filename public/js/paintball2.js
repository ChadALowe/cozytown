/* ---- COZE WOOD PAINTBALL CENTRE: proper first-person team paintball.
   Modes:  ELIMINATION (4 v 4, last team standing) · CAPTURE THE FLAG (first to 2) · DEFEND THE FORT (hold out against 3 waves)
   Maps:   THE WOODS · THE SCRAPYARD · RUINED VILLAGE (each built when the match starts, out past the edge of the world)
   Gear:   markers (standard, pump, rapid), hoppers, masks. Upgrades are kept in your save.
   League: weekend league with five rival teams; top the table by Sunday night for the trophy.
   Controls: drag to aim · ◀▲▼▶ (or WASD) to move · FIRE (hold for the rapid marker) · CROUCH for cover and steadier aim.
   A hit shows a red X on the crosshair. ---- */
(function(){
if(!window.MARLOWE5||!window.PUBG)return;
const A=window.MARLOWE5,TAU=Math.PI*2,rr=(a,b)=>a+Math.random()*(b-a),ri=n=>Math.floor(Math.random()*n),pk=a=>a[ri(a.length)],cl=(v,a,b)=>v<a?a:v>b?b:v;
const bp=(f,d,t,v)=>{try{beep(f,d,t||'square',v||.05)}catch(e){}};const money=()=>{try{cashUI()}catch(e){}};
const PB={gear:{m:0,h:0,k:0},own:{m:[1,0,0],h:[1,0,0],k:[1,0,0]},wins:0,played:0,lg:{s:-1,pts:0,cups:0}};window.PAINTBALL2=PB;
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.pb2=PB;return o};cozyLoad=function(z){l0(z);if(z&&z.pb2){Object.assign(PB,z.pb2);PB.gear=Object.assign({m:0,h:0,k:0},z.pb2.gear);PB.own=Object.assign({m:[1,0,0],h:[1,0,0],k:[1,0,0]},z.pb2.own);PB.lg=Object.assign({s:-1,pts:0,cups:0},z.pb2.lg)}}}
const MARK=[{n:'STANDARD MARKER',p:0,rate:.28,spread:.045,auto:0,d:'Reliable. Semi-automatic.'},{n:'PUMP MARKER',p:90,rate:.65,spread:.008,auto:0,d:'Slow to fire, dead accurate.'},{n:'RAPID MARKER',p:180,rate:.11,spread:.085,auto:1,d:'Hold FIRE to spray. Uses paint fast.'}];
const HOP=[{n:'40-BALL HOPPER',p:0,cap:40},{n:'100-BALL HOPPER',p:60,cap:100},{n:'200-BALL LOADER',p:140,cap:200}];
const MASK=[{n:'RENTAL MASK',p:0,hp:1},{n:'PADDED VEST + MASK',p:110,hp:2},{n:'PRO ARMOUR KIT',p:260,hp:3}];
const MODES=[{k:'elim',n:'ELIMINATION',d:'4 v 4. Tag every enemy. One hit and you\'re out (unless you\'re wearing armour).',fee:8,prize:35},{k:'ctf',n:'CAPTURE THE FLAG',d:'Grab their flag, bring it home. First to 2 captures. You respawn at base.',fee:10,prize:50},{k:'fort',n:'DEFEND THE FORT',d:'Hold the fort against 3 waves. Three lives.',fee:10,prize:45}];
const MAPS=[{k:'woods',n:'THE WOODS',d:'Trees, log piles and a stream bank.',ground:0x3a6a2a,fog:0xa8c8b0},{k:'scrap',n:'THE SCRAPYARD',d:'Wrecks, containers and tyre stacks.',ground:0x6a6050,fog:0xc8c0b0},{k:'ruin',n:'RUINED VILLAGE',d:'Broken cottages, low walls and a well.',ground:0x5a7a3a,fog:0xb8c8d0}];
const RIVALS=['COZE WOOD COMMANDOS','THE SPLAT PACK','MARLOWE MAULERS','SUNHAVEN SNIPERS','HOLLOW FARM HOTSHOTS'];
const season=()=>Math.floor(((typeof DAY==='number'?DAY:1)-1)/7),wknd=()=>{try{return dow()>=5}catch(e){return false}};
const rivalPts=i=>{const d=((typeof DAY==='number'?DAY:1)-1)%7;const wk=Math.max(0,d-4);return Math.round(wk*(3+i%3)*1.2+((season()*5+i*7)%4))};
const table=()=>{if(PB.lg.s!==season()){PB.lg.s=season();PB.lg.pts=0}const t=RIVALS.map((n,i)=>[n,rivalPts(i)]);t.push(['YOUR TEAM',PB.lg.pts]);return t.sort((a,b)=>b[1]-a[1])};
{const n0=newDay;newDay=function(){const before=season(),tb=table(),me=tb.findIndex(r=>r[0]==='YOUR TEAM');n0();if(season()!==before){if(me===0&&PB.lg.pts>0){PB.lg.cups++;cash+=300;money();try{TOWNSHOPS.col['PAINTBALL LEAGUE TROPHY · WEEK '+(before+1)]=1}catch(e){}setTimeout(()=>toast('🏆 YOUR TEAM WON THE WEEKEND PAINTBALL LEAGUE! +£300'),3400)}PB.lg.pts=0;PB.lg.s=season()}}}

/* ------------------------------------------------------------------ the hub */
let SEL={mode:0,map:0};
function hub(){const O=PUBG.gameOv('COZE WOOD PAINTBALL CENTRE',{w:520,h:160,bg:'rgba(10,22,12,.98)'}),g=O.g;
 const draw=()=>{g.fillStyle='#14281a';g.fillRect(0,0,520,160);g.fillStyle='#ff40c0';for(let i=0;i<14;i++){g.beginPath();g.arc(30+i*37,30+((i*53)%90),6+(i%3)*3,0,7);g.fill()}g.fillStyle='#ffd870';g.font='bold 18px monospace';g.textAlign='center';g.fillText(MODES[SEL.mode].n+' · '+MAPS[SEL.map].n,260,92);g.font='12px monospace';g.fillStyle='#cfe';g.fillText('WINS '+PB.wins+' / '+PB.played+' · LEAGUE CUPS '+PB.lg.cups,260,118)};
 const main=()=>{O.clear();const m=MODES[SEL.mode],mp=MAPS[SEL.map];O.msg(m.d+'<br>'+mp.d+' · Entry £'+m.fee+', win £'+m.prize+(wknd()?' · <b style="color:#ffd870">WEEKEND LEAGUE MATCH</b>':''));
  O.btn('MODE: '+m.n,()=>{SEL.mode=(SEL.mode+1)%MODES.length;main()},'#2a5a3a');O.btn('MAP: '+mp.n,()=>{SEL.map=(SEL.map+1)%MAPS.length;main()},'#2a4a6a');
  O.btn('▶ PLAY (£'+m.fee+')',()=>{if(cash<m.fee)return O.msg('NOT ENOUGH CASH (£'+m.fee+')');cash-=m.fee;money();O.close();setTimeout(()=>match(SEL.mode,SEL.map),50)},'#8a2a6a');
  O.btn('GEAR SHOP',gear,'#6a4a1a');O.btn('WEEKEND LEAGUE',league,'#4a3a7a');O.btn('QUICK GAME IN THE WOODS (£8)',()=>{O.close();try{G3D.paintball()}catch(e){czErr(e,'paintball2.js')}},'#333');draw()};
 const gear=()=>{O.clear();O.msg('Your kit: '+MARK[PB.gear.m].n+' · '+HOP[PB.gear.h].n+' · '+MASK[PB.gear.k].n);
  const row=(L,key)=>L.forEach((it,i)=>{const own=PB.own[key][i],eq=PB.gear[key]===i;O.btn((eq?'✓ ':own?'':'£'+it.p+' ')+it.n,()=>{if(!own){if(cash<it.p)return O.msg('NOT ENOUGH CASH');cash-=it.p;money();PB.own[key][i]=1;bp(660,.08)}PB.gear[key]=i;gear()},eq?'#2a6a3a':own?'#2a4a6a':'#5a3a1a')});
  row(MARK,'m');row(HOP,'h');row(MASK,'k');O.btn('◀ BACK',main,'#444');draw()};
 const league=()=>{O.clear();const t=table();O.msg('WEEKEND LEAGUE · WEEK '+(season()+1)+' (matches count on Saturdays and Sundays: win 3 points, draw 1)<br>'+t.map((r,i)=>(i+1)+'. '+(r[0]==='YOUR TEAM'?'<b style="color:#ffd870">YOUR TEAM</b>':r[0])+' · '+r[1]).join('<br>'));O.btn('◀ BACK',main,'#444');draw()};
 main()}
{const c0=ctx;ctx=function(){const r=c0();if(r&&r.label==='🔫 PAINTBALL (£8)')return{label:'🔫 COZE WOOD PAINTBALL CENTRE',fn:hub};return r}}

/* ------------------------------------------------------------------ arenas (built per match, far outside the world) */
const AR=42,ORG={woods:[6000,-400],scrap:[6000,0],ruin:[6000,400]};
const matl=c=>new THREE.MeshBasicMaterial({color:c}),BOX=(w,h,d,c)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),matl(c)),SPH=(r,c)=>new THREE.Mesh(new THREE.SphereGeometry(r,8,6),matl(c)),CYL=(r,h,c)=>new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,10),matl(c));
function buildArena(mk,add){const[ox,oz]=ORG[mk],M=MAPS.find(m=>m.k===mk),cov=[];/* cover: boxes {x,z,w,d,h} and circles {x,z,r,h} */
 const gr=new THREE.Mesh(new THREE.PlaneGeometry(240,240).rotateX(-Math.PI/2),matl(M.ground));gr.position.set(ox,G0-.01,oz);add(gr);
 const ring=new THREE.Mesh(new THREE.RingGeometry(AR,AR+.4,64).rotateX(-Math.PI/2),matl(0xff40c0));ring.position.set(ox,G0+.02,oz);add(ring);
 for(let i=0;i<40;i++){const a=i/40*TAU,p=BOX(.12,1.3,.12,0xff40c0);p.position.set(ox+Math.cos(a)*AR,G0+.65,oz+Math.sin(a)*AR);add(p)}
 const box=(x,z,w,d,h,c,ry)=>{const m=BOX(w,h,d,c);m.position.set(ox+x,G0+h/2,oz+z);if(ry)m.rotation.y=ry;add(m);const sw=ry?Math.abs(Math.cos(ry))*w+Math.abs(Math.sin(ry))*d:w,sd=ry?Math.abs(Math.sin(ry))*w+Math.abs(Math.cos(ry))*d:d;cov.push({x:ox+x,z:oz+z,w:sw,d:sd,h});return m};
 const cyl=(x,z,r,h,c)=>{const m=CYL(r,h,c);m.position.set(ox+x,G0+h/2,oz+z);add(m);cov.push({x:ox+x,z:oz+z,r,h});return m};
 const sym=f=>{f(1);f(-1)};/* maps are mirrored so neither side has the better half */
 if(mk==='woods'){for(let i=0;i<26;i++){const x=rr(-34,34),z=rr(-30,30);if(Math.abs(z)<4&&Math.abs(x)<8)continue;cyl(x,z,.45,6,0x5a3a1a);const c=new THREE.Mesh(new THREE.ConeGeometry(2.2,4.5,8),matl(pk([0x2a5a2a,0x3a6a2a,0x1f4a22])));c.position.set(ox+x,G0+5.6,oz+z);add(c)}
  sym(s=>{box(-10,s*12,5,1.2,1.1,0x6a4a2a,.3);box(12,s*14,4,1.2,1.1,0x6a4a2a,-.4);box(0,s*22,8,1.2,1.0,0x6a4a2a);box(-22,s*6,1.4,4,1.2,0x5a5a50)});box(0,0,3,3,1.6,0x5a5a50)}
 else if(mk==='scrap'){const car=(x,z,ry,c)=>{box(x,z,2,4.2,1.3,c,ry);const t=BOX(1.7,.6,2,0x222);t.position.set(ox+x,G0+1.6,oz+z);t.rotation.y=ry||0;add(t)};
  sym(s=>{car(-14,s*10,.4,0x8a2a1a);car(15,s*12,-.2,0x2a4a8a);car(-4,s*20,1.4,0x8a7a2a);box(24,s*4,2.5,8,2.6,0x2a6a5a);box(-26,s*16,8,2.5,2.6,0x8a3a2a);for(const[x,z]of[[6,8],[-20,4],[20,22]])cyl(x,s*z,.7,1.6,0x1a1a1a)});
  box(0,0,8,2.5,2.6,0x5a5a6a,Math.PI/2);car(10,0,1.57,0x5a5a5a);car(-10,0,1.57,0x6a3a5a)}
 else{const ruin=(x,z,s)=>{box(x-2.6,z,.6,5.6,2.2+rr(0,1),0x9a9488);box(x+2.6,z,.6,5.6,1.4+rr(0,1.2),0x9a9488);box(x,z-2.8*s,5.8,.6,2.4,0x9a9488)};
  sym(s=>{ruin(-16,s*14,s);ruin(16,s*16,s);box(0,s*24,10,.6,1.1,0xa8a090);box(-28,s*4,.6,8,1.1,0xa8a090);box(28,s*6,.6,8,1.1,0xa8a090);box(-6,s*8,3,.6,1.0,0x8a8478)});cyl(0,0,1.3,1.1,0x8a8478);box(9,0,.6,6,1.2,0x9a9488);box(-9,0,.6,6,1.2,0x9a9488)}
 return{ox,oz,cov,M}}
function blocked(cov,ax,az,bx,bz,y){/* is the line of sight between two points (at height y) blocked by cover taller than y? */const n=Math.ceil(Math.hypot(bx-ax,bz-az)/.8);for(let i=1;i<n;i++){const t=i/n,x=ax+(bx-ax)*t,z=az+(bz-az)*t;for(const c of cov){if(c.h<y)continue;if(c.r!=null){if(Math.hypot(x-c.x,z-c.z)<c.r)return true}else if(Math.abs(x-c.x)<c.w/2&&Math.abs(z-c.z)<c.d/2)return true}}return false}
function push(cov,o,rad){for(const c of cov){if(c.r!=null){const dx=o.x-c.x,dz=o.z-c.z,d=Math.hypot(dx,dz),R=c.r+rad;if(d<R&&d>1e-4){o.x=c.x+dx/d*R;o.z=c.z+dz/d*R}}else{const hx=c.w/2+rad,hz=c.d/2+rad,dx=o.x-c.x,dz=o.z-c.z;if(Math.abs(dx)<hx&&Math.abs(dz)<hz){const px=hx-Math.abs(dx),pz=hz-Math.abs(dz);if(px<pz)o.x+=Math.sign(dx||1)*px;else o.z+=Math.sign(dz||1)*pz}}}}
const hitCover=(cov,x,y,z)=>{for(const c of cov){if(y>c.h+G0)continue;if(c.r!=null){if(Math.hypot(x-c.x,z-c.z)<c.r)return true}else if(Math.abs(x-c.x)<c.w/2&&Math.abs(z-c.z)<c.d/2)return true}return false};

/* ------------------------------------------------------------------ a match */
const HUD=document.createElement('div');HUD.style.cssText='position:fixed;left:50%;top:118px;transform:translateX(-50%);z-index:60;display:none;font:bold 13px ui-monospace,monospace;color:#fff;text-align:center;pointer-events:none;text-shadow:1px 1px 0 #000';document.body.appendChild(HUD);
const XH=document.createElement('div');XH.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:61;pointer-events:none;display:none;font:bold 28px ui-monospace,monospace;color:#fff;text-shadow:1px 1px 0 #000';XH.textContent='+';document.body.appendChild(XH);
const HM=document.createElement('div');HM.style.cssText='position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg);z-index:62;pointer-events:none;display:none;font:bold 34px ui-monospace,monospace;color:#ff3050';HM.textContent='+';document.body.appendChild(HM);
const BIG=document.createElement('div');BIG.style.cssText='position:fixed;left:50%;top:36%;transform:translate(-50%,-50%);z-index:61;font:bold 38px ui-monospace,monospace;color:#ffd24a;text-shadow:3px 3px 0 #000;pointer-events:none;display:none;text-align:center';document.body.appendChild(BIG);
let bigT=0,hmT=0;const big=(t,s,c)=>{BIG.innerHTML=t;BIG.style.color=c||'#ffd24a';BIG.style.display='block';bigT=s||1};
{const u0=updCozy;updCozy=function(dt){u0(dt);if(bigT>0){bigT-=dt;if(bigT<=0)BIG.style.display='none'}if(hmT>0){hmT-=dt;if(hmT<=0)HM.style.display='none'}}}
const TEAMC=[[.85,.2,.6],[.2,.7,.25]],PAINT=[0xff40c0,0x40ff60];
function match(mi,mapi){const MO=MODES[mi],MP=MAPS[mapi];
 if(!A.actStart('pb2',{fov:66,dragLook:1,yaw:Math.PI,pitch:-.06,fog:70}))return;
 const objs=[],add=m=>{scene.add(m);objs.push(m);return m};const AN=buildArena(MP.k,add),ox=AN.ox,oz=AN.oz,cov=AN.cov;
 const gun=add(BOX(.05,.06,.42,0x222833));const hop=add(BOX(.08,.09,.11,PB.gear.m===2?0xff8a1a:0x2a8ad0));
 const mk=MARK[PB.gear.m],hpMax=MASK[PB.gear.k].hp,cap=HOP[PB.gear.h].cap;
 /* teams: 0 = you (pink), 1 = them (green). In DEFEND THE FORT you hold the centre. */
 const me={x:ox,z:oz+AR-6,hp:hpMax,ammo:cap,cd:0,crouch:0,lives:MO.k==='fort'?3:1,dead:0,resp:0,team:0,flag:0};
 const S={t:0,mv:[0,0],fire:0,shots:[],splats:0,score:[0,0],caps:[0,0],wave:0,waveT:0,over:0,spec:0,time:MO.k==='ctf'?240:MO.k==='fort'?200:300};
 const base=t=>MO.k==='fort'?(t===0?[ox,oz]:[ox,oz-AR+5]):[ox,t===0?oz+AR-6:oz-AR+6];
 const FL=[null,null];if(MO.k==='ctf')for(let t=0;t<2;t++){const g=new THREE.Group();const pole=BOX(.08,2.4,.08,0xdddddd);pole.position.y=1.2;g.add(pole);const f=BOX(.9,.55,.04,PAINT[t]);f.position.set(.45,2.1,0);g.add(f);add(g);FL[t]={g,home:base(t),x:base(t)[0],z:base(t)[1],by:null}}
 if(MO.k==='fort'){/* the fort: a ring of low walls with gaps */for(let i=0;i<8;i++){if(i%2)continue;const a=i/8*TAU,m=BOX(6,1.25,.8,0x8a6a3a);m.position.set(ox+Math.cos(a)*9,G0+.62,oz+Math.sin(a)*9);m.rotation.y=-a+Math.PI/2;add(m);cov.push({x:ox+Math.cos(a)*9,z:oz+Math.sin(a)*9,r:2.2,h:1.25})}me.x=ox;me.z=oz+3}
 const bots=[];const bot=(team,i)=>{const g=mkPerson(pSpec(7400+team*10+i+mi*3,{tc:TEAMC[team],scarf:null,bp:false,bag:0,gl:false}),mObj,scene);objs.push(g);const mask=BOX(.3,.22,.12,0x111);mask.position.set(0,1.62,.14);g.add(mask);
  const b=base(team);const o={g,team,x:b[0]+rr(-6,6),z:b[1]+rr(-2,2),hp:1,cd:rr(1,2.5),tx:0,tz:0,mt:0,dead:0,resp:0,flag:0,crouch:0,acc:team===0?.44:.5+mi*.03};bots.push(o);return o};
 for(let i=0;i<3;i++)bot(0,i);const nE=MO.k==='fort'?0:4;for(let i=0;i<nE;i++)bot(1,i);
 const alive=t=>(t===0?(me.dead?0:1):0)+bots.filter(b=>b.team===t&&!b.dead).length;
 const splat=(x,y,z,c)=>{if(S.splats>90)return;S.splats++;const m=new THREE.Mesh(new THREE.CircleGeometry(.2,8),new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide}));m.position.set(x,Math.max(G0+.02,y),z);m.rotation.x=-Math.PI/2;add(m)};
 const fire=(o,dx,dy,dz,team,mine)=>{const l=Math.hypot(dx,dy,dz);const m=add(SPH(.06,PAINT[team]));S.shots.push({x:o[0],y:o[1],z:o[2],vx:dx/l*42,vy:dy/l*42,vz:dz/l*42,team,mine,l:1.3,m});if(mine)bp(640,.03,'square',.03)};
 const shoot=()=>{if(me.dead||me.cd>0||S.over)return;if(me.ammo<=0){if(!S.reload){S.reload=1.6;big('RELOADING...',.8,'#fff');bp(200,.08)}return}me.cd=mk.rate;me.ammo--;const sp=mk.spread*(me.crouch?.5:1)*(Math.hypot(S.mv[0],S.mv[1])?1.5:1),yw=A.ACT.yaw+rr(-sp,sp),pt=A.ACT.pitch+rr(-sp,sp)*.6;fire([me.x,G0+(me.crouch?1.0:1.45),me.z],Math.sin(yw)*Math.cos(pt),Math.sin(pt),Math.cos(yw)*Math.cos(pt),0,1)};
 A.btns([['◀',()=>S.mv[0]=1,()=>S.mv[0]=0],['▲',()=>S.mv[1]=1,()=>S.mv[1]=0],['▼',()=>S.mv[1]=-1,()=>S.mv[1]=0],['▶',()=>S.mv[0]=-1,()=>S.mv[0]=0],['⬇ CROUCH',()=>{me.crouch=1-me.crouch}],['🔫 FIRE',()=>{S.fire=1;shoot()},()=>{S.fire=0}],['✕',()=>end(-1,'YOU LEFT THE FIELD.')]]);
 A.ACT.key=(e,d)=>{const k=e.key;if(k==='w'||k==='ArrowUp')S.mv[1]=d?1:0;if(k==='s'||k==='ArrowDown')S.mv[1]=d?-1:0;if(k==='a'||k==='ArrowLeft')S.mv[0]=d?1:0;if(k==='d'||k==='ArrowRight')S.mv[0]=d?-1:0;if(k===' '){S.fire=d?1:0;if(d)shoot()}if((k==='c'||k==='Control')&&d)me.crouch=1-me.crouch};
 A.topTxt('🔫 '+MO.n+' · '+MP.n+'\n'+MO.d);XH.style.display='block';HUD.style.display='block';const bu=document.getElementById('bUse');if(bu)bu.style.visibility='hidden';man.visible=false;
 const spawnWave=()=>{S.wave++;const n=[4,6,8][S.wave-1];for(let i=0;i<n;i++){const b=bot(1,i+S.wave*10);const a=rr(-1.2,1.2)-Math.PI/2;b.x=ox+Math.cos(a)*(AR-4);b.z=oz+Math.sin(a)*(AR-4)}big('WAVE '+S.wave+'/3 INCOMING!',1.4,'#ff8a4a');bp(150,.4,'sawtooth')};
 if(MO.k==='fort')spawnWave();
 function tagged(o,isMe){if(isMe){me.hp--;try{flashRed()}catch(e){const f=document.createElement('div');f.style.cssText='position:fixed;inset:0;background:#c0f;opacity:.3;z-index:59;pointer-events:none';document.body.appendChild(f);setTimeout(()=>f.remove(),250)}bp(150,.15,'sawtooth',.06);
   if(me.hp<=0){if(me.flag){me.flag=0;FL[1].by=null;FL[1].x=me.x;FL[1].z=me.z}me.lives--;if(MO.k==='elim'||(MO.k==='fort'&&me.lives<=0)){me.dead=1;S.spec=1;big('SPLAT! YOU\'RE OUT',1.6,'#ff60d0')}else{me.dead=1;me.resp=MO.k==='fort'?6:5;big('SPLAT! RESPAWN IN '+me.resp+'s',1.4,'#ff60d0')}}else big('HIT! ARMOUR HOLDS',.8,'#ffa0e0');return}
  o.hp--;if(o.hp>0)return;o.dead=1;if(o.flag){o.flag=0;const f=FL[1-o.team];f.by=null;f.x=o.x;f.z=o.z}S.score[1-o.team]++;o.g.rotation.x=-1.45;o.g.position.y=G0+.25;if(MO.k==='ctf'||(MO.k==='fort'&&o.team===0))o.resp=6}
 function end(res,msg){if(S.over)return;S.over=1;PB.played++;const lg=wknd()&&res>=0;if(res>0){PB.wins++;cash+=MO.prize;money()}if(lg){table();PB.lg.pts+=res>0?3:res===0?1:0}
  const txt=(res>0?'🏆 VICTORY! +£'+MO.prize:res===0?'🤝 A DRAW':'💥 '+msg)+(lg&&res>=0?' · LEAGUE +'+(res>0?3:1):'')+' · TAGS '+S.score[0];A.topTxt(txt);toast(txt);setTimeout(()=>{if(A.ACT.on&&A.ACT.k==='pb2')A.actEnd()},3800)}
 A.ACT.end=()=>{for(const m of objs)m.parent&&m.parent.remove(m);man.visible=true;XH.style.display='none';HM.style.display='none';HUD.style.display='none';BIG.style.display='none';const bu=document.getElementById('bUse');if(bu)bu.style.visibility='visible';if(!S.over){PB.played++}P.speed=0;
  /* back to the paintball centre gate */try{P.x=AN.back[0];P.z=AN.back[1];P.y=gH(P.x,P.z)}catch(e){}};
 AN.back=[P.x,P.z];
 A.ACT.tick=dt=>{S.t+=dt;if(S.over)return;const sd=S.spec?dt*1.6:dt;S.time-=dt;me.cd-=dt;if(S.reload){S.reload-=dt;if(S.reload<=0){S.reload=0;me.ammo=cap;big('LOADED',.5,'#8f8')}}if(S.fire&&mk.auto)shoot();
  /* me */if(me.dead&&me.resp>0){me.resp-=dt;if(me.resp<=0){me.dead=0;me.hp=hpMax;me.ammo=cap;const b=base(0);me.x=b[0];me.z=b[1]+(MO.k==='fort'?3:0)}}
  if(!me.dead){const yw=A.ACT.yaw,fx=Math.sin(yw),fz=Math.cos(yw),mx=fx*S.mv[1]+fz*S.mv[0],mz=fz*S.mv[1]-fx*S.mv[0];if(mx||mz){const l=Math.hypot(mx,mz),sp=(me.crouch?2.2:4.6)*(me.flag?.85:1);me.x+=mx/l*sp*dt;me.z+=mz/l*sp*dt}push(cov,me,.4);const d=Math.hypot(me.x-ox,me.z-oz);if(d>AR-1){me.x=ox+(me.x-ox)/d*(AR-1);me.z=oz+(me.z-oz)/d*(AR-1)}}
  /* bots */const targets=[];if(!me.dead)targets.push({x:me.x,z:me.z,team:0,me:1,crouch:me.crouch});for(const b of bots)if(!b.dead)targets.push({x:b.x,z:b.z,team:b.team,b,crouch:b.crouch});
  for(const b of bots){if(b.dead){if(b.resp>0){b.resp-=sd;if(b.resp<=0){b.dead=0;b.hp=1;const p=base(b.team);b.x=p[0]+rr(-4,4);b.z=p[1]+rr(-2,2);b.g.rotation.x=0;b.g.position.y=G0}}continue}
   b.mt-=sd;/* where to go: objective-led, with cover stops */let gx=b.tx,gz=b.tz;
   if(MO.k==='ctf'){const ef=FL[1-b.team],mf=FL[b.team];if(b.flag){gx=base(b.team)[0];gz=base(b.team)[1]}else if(mf.by&&mf.by!==b&&Math.random()<.5){const c=mf.by===me?me:mf.by;gx=c.x;gz=c.z}else{gx=ef.x;gz=ef.z}}
   else if(MO.k==='fort'&&b.team===1){gx=ox;gz=oz}else if(MO.k==='fort'&&b.team===0){if(b.mt<=0){b.mt=rr(3,6);const a=rr(0,TAU);b.tx=ox+Math.cos(a)*6;b.tz=oz+Math.sin(a)*6}gx=b.tx;gz=b.tz}
   else{if(b.mt<=0){b.mt=rr(2,4);/* advance from cover to cover towards the enemy side */const fwd=b.team===0?-1:1,cands=cov.filter(c=>(c.z-b.z)*fwd>-2&&(c.z-b.z)*fwd<16&&Math.abs(c.x-b.x)<18);const c=cands.length?pk(cands):{x:b.x+rr(-6,6),z:b.z+fwd*6};b.tx=c.x+rr(-1.5,1.5);b.tz=c.z-fwd*(1.6+(c.d||c.r*2||1)/2)}gx=b.tx;gz=b.tz}
   const dx=gx-b.x,dz=gz-b.z,dd=Math.hypot(dx,dz),spd=(b.flag?3:3.4)*(b.crouch?.6:1);if(dd>.6){b.x+=dx/dd*spd*sd;b.z+=dz/dd*spd*sd;b.crouch=0}else b.crouch=1;push(cov,b,.4);const da=Math.hypot(b.x-ox,b.z-oz);if(da>AR-1){b.x=ox+(b.x-ox)/da*(AR-1);b.z=oz+(b.z-oz)/da*(AR-1)}
   /* the flag */if(MO.k==='ctf'){const ef=FL[1-b.team],mf=FL[b.team];if(!ef.by&&Math.hypot(ef.x-b.x,ef.z-b.z)<1.4){ef.by=b;b.flag=1;big((b.team?'THEY HAVE':'YOUR TEAM HAS')+' THE FLAG!',1.2,b.team?'#80ff80':'#ff80d0')}
    if(!mf.by&&(mf.x!==mf.home[0]||mf.z!==mf.home[1])&&Math.hypot(mf.x-b.x,mf.z-b.z)<1.4){mf.x=mf.home[0];mf.z=mf.home[1];big('FLAG RETURNED',.9,'#fff')}
    if(b.flag&&Math.hypot(b.x-base(b.team)[0],b.z-base(b.team)[1])<2.2){b.flag=0;ef.by=null;ef.x=ef.home[0];ef.z=ef.home[1];S.caps[b.team]++;big((b.team?'THEY':'YOUR TEAM')+' CAPTURED THE FLAG!',1.5,b.team?'#80ff80':'#ff80d0');bp(b.team?200:880,.3)}}
   /* shooting */b.cd-=sd;if(b.cd<=0){let best=null,bd=1e9;for(const t of targets){if(t.team===b.team)continue;const d=Math.hypot(t.x-b.x,t.z-b.z);if(d<34&&d<bd&&!blocked(cov,b.x,b.z,t.x,t.z,G0+(t.crouch?.9:1.3)-G0)){bd=d;best=t}}
    if(best){b.cd=rr(.7,1.6);const er=(1-b.acc)*2.2*(best.crouch?1.6:1),tx=best.x+rr(-er,er),tz=best.z+rr(-er,er);fire([b.x,G0+1.4,b.z],tx-b.x,rr(-.04,.12)*bd/10,tz-b.z,b.team,0)}else b.cd=.4}
   b.g.position.set(b.x,b.dead?G0+.25:G0-(b.crouch?.35:0),b.z);const fa=Math.atan2(gx-b.x,gz-b.z);b.g.rotation.y=dd>.6?fa:b.team?0:Math.PI;const sw=Math.sin(S.t*9+b.x)*(dd>.6?.6:0);if(b.g.l1){b.g.l1.rotation.x=sw;b.g.l2.rotation.x=-sw;b.g.a2.rotation.x=-1.4}}
  /* my flag pickups and captures */if(MO.k==='ctf'&&!me.dead){const ef=FL[1],mf=FL[0];if(!ef.by&&Math.hypot(ef.x-me.x,ef.z-me.z)<1.4){ef.by=me;me.flag=1;big('YOU HAVE THEIR FLAG! RUN HOME!',1.3,'#ff80d0');bp(880,.15)}
   if(!mf.by&&(mf.x!==mf.home[0]||mf.z!==mf.home[1])&&Math.hypot(mf.x-me.x,mf.z-me.z)<1.4){mf.x=mf.home[0];mf.z=mf.home[1];big('YOU RETURNED YOUR FLAG',1,'#fff')}
   if(me.flag&&Math.hypot(me.x-base(0)[0],me.z-base(0)[1])<2.2){me.flag=0;ef.by=null;ef.x=ef.home[0];ef.z=ef.home[1];S.caps[0]++;big('🚩 YOU CAPTURED THE FLAG!',1.6,'#ffd24a');bp(1046,.3)}}
  if(MO.k==='ctf')for(const f of FL){if(f.by){f.x=f.by.x;f.z=f.by.z}f.g.position.set(f.x+(f.by?.3:0),G0+(f.by?.4:0),f.z)}
  /* paint in the air */for(let i=S.shots.length-1;i>=0;i--){const s=S.shots[i];s.vy-=5*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;s.z+=s.vz*dt;s.l-=dt;s.m.position.set(s.x,s.y,s.z);let gone=s.l<=0||s.y<G0;
   if(!gone&&hitCover(cov,s.x,s.y,s.z)){gone=1;splat(s.x,s.y,s.z,PAINT[s.team])}
   if(!gone){for(const t of targets){if(t.team===s.team)continue;const tx=t.me?me.x:t.b.x,tz=t.me?me.z:t.b.z;if(Math.hypot(s.x-tx,s.z-tz)<.5&&s.y<G0+(t.crouch?1.25:1.85)){gone=1;if(t.me)tagged(null,1);else{tagged(t.b,0);if(s.mine){HM.style.display='block';hmT=.25;bp(1100,.06,'square',.05);if(t.b.dead)big('TAGGED!',.6,'#ff60d0')}}break}}}
   if(gone){if(s.y<=G0+.05)splat(s.x,G0+.02,s.z,PAINT[s.team]);s.m.parent&&s.m.parent.remove(s.m);S.shots.splice(i,1)}}
  /* rules */if(MO.k==='elim'){if(alive(1)===0)end(1);else if(alive(0)===0)end(-1,'YOUR TEAM WAS WIPED OUT');else if(S.time<=0)end(alive(0)>alive(1)?1:alive(0)<alive(1)?-1:0,'TIME UP: THEY HAD MORE LEFT')}
  else if(MO.k==='ctf'){if(S.caps[0]>=2)end(1);else if(S.caps[1]>=2)end(-1,'THEY CAPTURED YOUR FLAG TWICE');else if(S.time<=0)end(S.caps[0]>S.caps[1]?1:S.caps[0]<S.caps[1]?-1:0,'TIME UP')}
  else{if(me.dead&&me.lives<=0&&!me.resp)end(-1,'THE FORT HAS FALLEN');else if(bots.filter(b=>b.team===1&&!b.dead).length===0){if(S.wave>=3)end(1);else{S.waveT+=dt;if(S.waveT>3){S.waveT=0;spawnWave()}}}else if(S.time<=0)end(1)}
  const mm=Math.max(0,Math.ceil(S.time)),tm=Math.floor(mm/60)+':'+String(mm%60).padStart(2,'0');
  HUD.innerHTML='<div style="font-size:15px">'+(MO.k==='ctf'?'🚩 '+S.caps[0]+' - '+S.caps[1]:MO.k==='fort'?'WAVE '+S.wave+'/3 · LIVES '+Math.max(0,me.lives):'YOU '+alive(0)+' v '+alive(1)+' THEM')+' · '+tm+'</div><div>'+'❤'.repeat(Math.max(0,me.hp))+' · PAINT '+me.ammo+'/'+cap+(S.reload?' (RELOADING)':'')+(me.crouch?' · CROUCHED':'')+(me.flag?' · 🚩 YOU HAVE THE FLAG':'')+(S.spec?' · SPECTATING':'')+'</div>'};
 A.ACT.cam=()=>{const yw=A.ACT.yaw,pt=A.ACT.pitch;let cx=me.x,cz=me.z,cy=G0+(me.crouch?1.05:1.6);if(S.spec){const b=bots.find(b=>b.team===0&&!b.dead)||bots[0];cx=b.x-Math.sin(yw)*4;cz=b.z-Math.cos(yw)*4;cy=G0+3.2}
  P.x=me.x;P.z=me.z;P.y=G0;P.psi=yw;cam.position.set(cx,cy,cz);cam.lookAt(cx+Math.sin(yw)*Math.cos(pt)*10,cy+Math.sin(pt)*10,cz+Math.cos(yw)*Math.cos(pt)*10);
  const rx=Math.cos(yw)*-.3,rz=-Math.sin(yw)*-.3;gun.position.set(cx+Math.sin(yw)*.75+rx,cy-.34+Math.sin(pt)*.7,cz+Math.cos(yw)*.75+rz);gun.rotation.set(-pt,yw,0);hop.position.set(gun.position.x,gun.position.y+.08,gun.position.z);hop.rotation.copy(gun.rotation);gun.visible=hop.visible=!S.spec}}
window.PAINTBALL2.hub=hub;window.PAINTBALL2.match=match;
})();
