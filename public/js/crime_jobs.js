/* COZYTOWN CRIME: Big Terry and his jobs, fencing, burglary, poaching, street racing, the back-room card game,
   the cricket fix, the mail-train robbery, the bank job, Hollow Farm hideout, secret places, street events, taxis. */
(function(){
const C=window.CRIME,T=window.TOWN;if(!C||!T)return;const TAU=Math.PI*2,pos=C.pos;
const pk=a=>a[Math.floor(Math.random()*a.length)],rr=(a,b)=>a+Math.random()*(b-a),$i=id=>document.getElementById(id);
const night=()=>GT>=21||GT<5;
const CJ={rep:0,hot:[],stash:[],hide:{own:0,respray:0,safe:0,bed:0,cash:0},sec:{},done:{},fixDay:0,job:null,haul:0,bank:{cased:0,lance:0}};window.CJ=CJ;
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();const j=CJ.job;CJ.job=null;o.cj=JSON.parse(JSON.stringify(CJ));CJ.job=j;return o};cozyLoad=function(z){l0(z);if(z&&z.cj)Object.assign(CJ,z.cj,{job:null,haul:0})}}
const way=(x,z,n)=>{PH.way={x,z,n,keep:1,crime:1};phWay()},unway=()=>{if(PH.way&&PH.way.crime){PH.way=null;phWay()}};
const door=n=>SHOPD.find(s=>s.t===n);
const out=(d,a,b)=>[d.x+Math.sin(d.psi)*a+Math.cos(d.psi)*b,d.z+Math.cos(d.psi)*a-Math.sin(d.psi)*b];
const dist=(x,z)=>{const p=pos();return Math.hypot(p.x-x,p.z-z)};
const say_=(who,t)=>{try{say(who,t,4200)}catch(e){toast(who+': '+t)}};
const tier=()=>CJ.rep>=12?3:CJ.rep>=7?2:CJ.rep>=3?1:0,TN=['NOBODY','ERRAND RUNNER','ONE OF THE LADS','TRUSTED','TERRY\'S RIGHT HAND'];
const hotV=()=>CJ.hot.reduce((a,h)=>a+h.v,0);
function grp(build,x,z,ry){const B=new Builder(3);build(B);const g=new THREE.Group();g.add(B.mesh(mObj));g.position.set(x,G0,z);g.rotation.y=ry||0;scene.add(g);return g}
const VIS=[];function near(g,r){VIS.push([g,r||scene.fog.far])}
const person=(seed,o,x,z,ry)=>{const g=mkPerson(pSpec(seed,Object.assign({scarf:null,bp:false,bag:0,old:false},o||{})),mObj,scene);g.position.set(x,G0,z);g.rotation.y=ry||0;return g};

/* ================================================================ places: Hollow Farm, the quarry + chop shop, pillbox, cave, tunnel */
const FARM={x:-1008,z:-786},BARN=[-1024,-792],QUARRY={x:922,z:-800},CHOP=[888,-800],PILL=[-1095,222],CAVE=[938,232],TUN=[960,-641];
/* Hollow Farm */{const yard=grp(B=>{quadXZ(B,[-1054+1008,-810+786],[-982+1008,-810+786],[-982+1008,-752+786],[-1054+1008,-752+786],[.42,.34,.24],.03);
  /* barn: open west door */const bx=-1012+1008,bz=-792+786,bw=16,bd=20,H=7;pbox(B,bx,0,bz-bd/2,bw,H,.4,[.45,.22,.16]);pbox(B,bx,0,bz+bd/2,bw,H,.4,[.45,.22,.16]);pbox(B,bx+bw/2,0,bz,.4,H,bd,[.42,.2,.15]);pbox(B,bx-bw/2,0,bz-bd/2+3,.4,H,6,[.42,.2,.15]);pbox(B,bx-bw/2,0,bz+bd/2-3,.4,H,6,[.42,.2,.15]);pbox(B,bx-bw/2,4.6,bz,.4,2.4,bd,[.42,.2,.15]);
  for(const sd of[1,-1]){const a=[bx-bw/2-.5,H,bz+sd*(bd/2+.5)],b=[bx+bw/2+.5,H,bz+sd*(bd/2+.5)],c=[bx+bw/2+.5,H+3.2,bz],d=[bx-bw/2-.5,H+3.2,bz];B.tri(a,b,c,[.3,.3,.32],null,null,true);B.tri(a,c,d,[.3,.3,.32],null,null,true)}
  for(const sd of[1,-1])B.tri([bx+sd*bw/2,H,bz-bd/2],[bx+sd*bw/2,H,bz+bd/2],[bx+sd*bw/2,H+3.2,bz],[.42,.2,.15],null,null,false,[bx,H,bz]);pbox(B,bx+2,0,bz-6,3,1.2,1.2,[.86,.74,.36]);pbox(B,bx+4,0,bz-6,1.2,2.4,1.2,[.86,.74,.36]);
  /* ruined farmhouse */const hx=-992+1008,hz=-766+786;pbox(B,hx,0,hz-4,10,4.2,.5,[.62,.6,.55]);pbox(B,hx-5,0,hz,.5,3.2,8,[.62,.6,.55]);pbox(B,hx+5,0,hz+1,.5,4.8,6,[.62,.6,.55]);pbox(B,hx-2,0,hz+4,4,2.2,.5,[.62,.6,.55]);pbox(B,hx+1,4.2,hz-3,6,.25,3,[.3,.3,.32]);pbox(B,hx-2,0,hz,1.6,.6,1.2,[.55,.5,.45]);
  /* rusty tractor */pbox(B,-1040+1008,.6,-772+786,2.4,1.1,1.4,[.55,.3,.15]);pcyl(B,-1041+1008,0,-771.2+786,.7,.5,8,[.12,.12,.12]);pcyl(B,-1041+1008,0,-772.8+786,.7,.5,8,[.12,.12,.12]);pbox(B,-1039+1008,1.7,-772+786,1,1.1,1.2,[.5,.28,.15]);
  for(let x=-1050;x<-984;x+=3)if(Math.abs(x+1052)>8)pbox(B,x+1008,0,-810+786,.15,1.1,.15,[.4,.3,.2]);pbox(B,-1017+1008,0,-810+786,66,.1,.08,[.4,.3,.2]);pbox(B,-1017+1008,.7,-810+786,66,.08,.08,[.4,.3,.2])},FARM.x,FARM.z);near(yard);
 FARM.sign=grp(B=>{pbox(B,0,0,0,.15,1.6,.15,[.35,.25,.15]);pbox(B,0,1.2,0,.1,.7,1.6,[.85,.8,.7])},-1050,-772);near(FARM.sign);
 const bx=-1012,bz=-792;for(const[a,b,c,d]of[[bx-8,bx+8,bz-10.2,bz-9.8],[bx-8,bx+8,bz+9.8,bz+10.2],[bx+7.8,bx+8.2,bz-10,bz+10],[bx-8.2,bx-7.8,bz-10,bz-4],[bx-8.2,bx-7.8,bz+4,bz+10]]){for(let x=a;x<=b;x+=1.4)for(let z=c;z<=d;z+=1.4)COL.push([x,z,.6])}
 for(const[x,z]of[[-997,-770],[-987,-766],[-992,-762]])COL.push([x,z,2.4]);COL.push([-1040,-772,1.6])}
/* the old quarry + Dez's chop shop */{const g=grp(B=>{const q=(x0,z0,x1,z1,c,y)=>quadXZ(B,[x0-922,z0+800],[x1-922,z0+800],[x1-922,z1+800],[x0-922,z1+800],c,y);q(870,-814,905,-786,[.5,.48,.44],.035);q(900,-836,962,-764,[.6,.58,.54],.03);q(918,-826,952,-776,[.2,.38,.44],.05);
  for(let a=0;a<14;a++){const t=a/14*TAU;if(Math.abs(t-Math.PI)<.5)continue;pbox(B,Math.cos(t)*34,0,Math.sin(t)*38,7,rr(4,9),7,[.62,.6,.56].map(c=>c*rr(.85,1.05)),t)}
  /* chop shop shed */pbox(B,888-922,0,-786+800,12,4.6,8,[.4,.42,.45]);pbox(B,888-922,4.6,-786+800,12.6,.2,8.6,[.55,.3,.2]);pbox(B,888-922,0,-782+800,4,3.4,.1,[.1,.1,.1]);pbox(B,880-922,0,-807+800,2.2,1.6,4.2,[.55,.15,.12]);pbox(B,883-922,0,-808+800,.3,6,.3,[.9,.7,.1]);pbox(B,883-922,6,-806+800,.3,.3,5,[.9,.7,.1])},QUARRY.x,QUARRY.z);near(g);
 grp(B=>{pbox(B,0,0,0,.15,1.6,.15,[.3,.3,.3]);pbox(B,0,1.3,0,.08,.8,2.2,[.95,.85,.15])},866,-793);
 for(let a=0;a<14;a++){const t=a/14*TAU;if(Math.abs(t-Math.PI)<.5)continue;COL.push([922+Math.cos(t)*34,-800+Math.sin(t)*38,4.2])}for(let x=882;x<=894;x+=2)COL.push([x,-782,1]);COL.push([880,-807,1.6])}
/* pillbox, cave, tunnel door */
near(grp(B=>{for(let i=0;i<6;i++){const a=i/6*TAU;pbox(B,Math.cos(a)*2.6,0,Math.sin(a)*2.6,3,1.8,.6,[.62,.62,.6],-a+Math.PI/2)}pcyl(B,0,1.8,0,3.2,.4,6,[.58,.58,.56]);pbox(B,0,.9,-2.9,1.2,.3,.1,[.05,.05,.05])},PILL[0],PILL[1]),300);COL.push([PILL[0],PILL[1],3]);
near(grp(B=>{for(let k=0;k<16;k++){const a=k/16*TAU;poct(B,Math.cos(a)*rr(6,10),0,Math.sin(a)*rr(4,7),rr(3,5),rr(2.5,5),rr(3,5),[.5,.47,.42],.3)}poct(B,0,0,0,8,6,6,[.52,.48,.42],.2);pbox(B,-4.6,0,-1,.2,2.4,2.4,[.04,.04,.05])},CAVE[0],CAVE[1]),300);COL.push([CAVE[0],CAVE[1],7]);
near(grp(B=>{pbox(B,0,0,0,.15,2.2,1.2,[.25,.3,.25])},TUN[0],TUN[1]),300);
/* map + secrets */
T.pois.push({x:FARM.x,z:FARM.z,n:'HOLLOW FARM',c:'farm',ic:'🏚',r:60},{x:QUARRY.x,z:QUARRY.z,n:'THE OLD QUARRY',c:'car',ic:'⛏',r:70},{x:PILL[0],z:PILL[1],n:'WW2 PILLBOX',c:'fun',ic:'🪖',r:40},{x:CAVE[0],z:CAVE[1],n:"SMUGGLERS' CAVE",c:'fun',ic:'🏴‍☠️',r:40},{x:TUN[0],z:TUN[1],n:'THE OLD TUNNEL',c:'fun',ic:'🚇',r:40});
const SECRETS=[{k:'quarry',x:935,z:-780,lab:'FISH SOMETHING OUT OF THE QUARRY POND',go:()=>{cash+=200;toast('🔐 A RUSTY SAFE! INSIDE: £200 IN OLD NOTES.')}},{k:'pill',x:PILL[0],z:PILL[1]-3.6,lab:'SEARCH THE PILLBOX',go:()=>{keep('A WW2 MEDAL');toast('🎖 AN OLD AMMO TIN. INSIDE: A WW2 MEDAL!')}},
 {k:'cave',x:CAVE[0]-6,z:CAVE[1]-1,lab:'EXPLORE THE CAVE',go:()=>{cash+=300;keep('A PIRATE DOUBLOON');toast('🏴‍☠️ A SMUGGLER\'S CHEST! £300 AND A GOLD DOUBLOON.')}},{k:'tun',x:TUN[0]-1.6,z:TUN[1],lab:'TRY THE SERVICE DOOR',go:()=>{cash+=100;keep('A VINTAGE RAILWAY LAMP');toast('🚇 A FORGOTTEN STORE ROOM. £100 AND AN OLD RAILWAY LAMP.')}},
 {k:'farm',x:-995,z:-768,lab:'POKE AROUND THE RUINED FARMHOUSE',go:()=>{cash+=60;toast('🏚 UNDER A FLOORBOARD: £60. AND A NOTE: "THE BANK VAULT DOOR STICKS."');CJ.bank.tip=1}}];
function keep(n){try{TOWNSHOPS.col[n]=1}catch(e){czErr(e,"crime_jobs.js")}}

/* ================================================================ Big Terry (behind The Railway Tavern) */
const TP={};{const d=door('THE RAILWAY TAVERN');if(d){const p=out(d,2.2,-8.5);TP.x=p[0];TP.z=p[1];TP.g=person(4242,{beard:true,old:false,tc:[.12,.12,.14],hs:2},TP.x,TP.z,d.psi);near(TP.g,200);
 const c=out(d,6.5,-10);TP.car=aiCar([.06,.06,.08],1);TP.car.position.set(c[0],G0,c[1]);TP.car.rotation.y=d.psi+Math.PI/2;COL.push([c[0],c[1],2])}}
T.pois.push({x:TP.x||0,z:TP.z||0,n:'BIG TERRY',c:'cash',ic:'🎩',r:45});
const JOBS=[
 {k:'smug',t:0,n:'SMUGGLING RUN',d:'Collect a package and drop it off. Don\'t get pulled over.',pay:'£150-£300'},
 {k:'steal',t:0,n:'A CAR TO ORDER',d:'Find a particular car, hot-wire it, take it to Dez at the old quarry.',pay:'£250-£400'},
 {k:'burg',t:1,n:'A QUIET BURGLARY',d:'A house where the owners are away. Night only. Fence what you find.',pay:'LOOT'},
 {k:'poach',t:1,n:'PHEASANTS FOR THE PLOUGH',d:'Bag 4 pheasants in Coze Wood at night. Mind the gamekeeper.',pay:'£25 EACH'},
 {k:'race',t:1,n:'THE KING\'S WAY RUN',d:'Illegal street race round the bypass. £50 to enter. Night only.',pay:'£400 TO THE WINNER'},
 {k:'fix',t:2,n:'THE CRICKET FIX',d:'Slip the bowler an envelope at the pavilion. Daytime.',pay:'£350 TOMORROW'},
 {k:'train',t:2,n:'THE MAIL TRAIN',d:'Sneak into the mail van while it stands at a station.',pay:'WHATEVER YOU GRAB'},
 {k:'bank',t:3,n:'THE BANK JOB',d:'Case the bank, get a thermal lance, crack the vault at night, get back to the farm.',pay:'£2,000-£6,000'}];
CUSTOM_SHOP.terry=function(msg){$i('shT').textContent='🎩 BIG TERRY';$i('shMsg').textContent=msg||'REP '+CJ.rep+' · '+TN[tier()+(CJ.rep>=12?1:0)]+'  ·  "'+pk(['Keep your nose clean. Ish.','Got a little job, if you\'re interested.','Old Bill\'s been sniffing round. Be careful.','You didn\'t see me, I didn\'t see you.'])+'"';
 if(CJ.job){dRow('ON A JOB: '+CJ.job.n,[['CALL IT OFF',()=>{failJob('YOU CALLED IT OFF');renderShop('"Shame. Another time."')}]]);dRow('',[['DONE',()=>closeShop()]]);return}
 for(const j of JOBS){const ok=tier()>=j.t&&(j.k!=='bank'||CJ.hide.own);dRow((ok?'':'🔒 ')+j.n+'  ·  '+j.pay+(ok?'':j.k==='bank'&&tier()>=3?'  (NEEDS A HIDEOUT)':'  (REP '+[0,3,7,12][j.t]+')'),[[ok?'TAKE IT':'LOCKED',()=>{if(!ok)return renderShop('"Not yet, sunshine. Prove yourself first."');closeShop();startJob(j.k)}]])}
 if(CJ.hot.length)dRow('SELL TERRY YOUR HOT GOODS (50%) · £'+Math.round(hotV()*.5),[['SELL',()=>{const v=Math.round(hotV()*.5);cash+=v;CJ.hot=[];renderShop('"Pleasure doing business." +£'+v)}]]);
 if(night())dRow('THE BACK-ROOM CARD GAME (THREE CARD BRAG)',[['PLAY',()=>{closeShop();brag()}]]);dRow('',[['DONE',()=>closeShop()]])};
function rep(n){const t0=tier();CJ.rep+=n;if(tier()>t0){C.big('PROMOTED','BIG TERRY NOW SEES YOU AS '+TN[tier()],2600);phText('BIG TERRY','You\'re doing alright, you are. Come and see me, there\'s bigger work going.')}}

/* ================================================================ jobs */
function startJob(k){const p=pos();CJ.job={k,n:JOBS.find(j=>j.k===k).n,step:0,t:0};const J=CJ.job;beep(330,.12,'square',.05);
 if(k==='smug'){const PU=[['LOCK 15 NARROWBOAT',650,-486],['THE BEACH BY THE GROYNES',730,212],['WESTBROOK HALT',-720,-644],["SMUGGLERS' CAVE",CAVE[0]-8,CAVE[1]-4],['COZE WOOD CLEARING',-400,-900]],DR=[['HOLLOW FARM',-1040,-780],['THE PLOUGH CAR PARK',-735,-1118],['WINDMILL HILL',612,-1100],['DEZ AT THE QUARRY',CHOP[0],CHOP[1]],['THE OLD TUNNEL',TUN[0]-4,TUN[1]+4]];
  let a,b;for(let q=0;q<40;q++){a=pk(PU);b=pk(DR);if(Math.hypot(a[1]-b[1],a[2]-b[2])>600)break}J.a=a;J.b=b;J.pay=Math.round(150+Math.hypot(a[1]-b[1],a[2]-b[2])/12)*(night()?1.25:1)|0;way(a[1],a[2],a[0]);C.obj('📦 COLLECT THE PACKAGE · '+a[0])}
 else if(k==='steal'){const COLS=[['RED',[.8,.08,.1]],['YELLOW',[1,.8,.06]],['GREEN',[.1,.5,.2]],['PURPLE',[.45,.12,.6]],['ORANGE',[1,.45,.06]],['SKY BLUE',[.3,.6,.95]]],c=pk(COLS);let s=null;for(let q=0;q<200;q++){const t=SEG[Math.floor(Math.random()*SEG.length)],r=ROADS[t.ri];if(r.rural||!r.nw||t.l<40)continue;const mx=(t.a[0]+t.b[0])/2,mz=(t.a[1]+t.b[1])/2;if(Math.hypot(mx-p.x,mz-p.z)<400)continue;s=t;break}
  s=s||SEG[0];const tt=s.l/2,lat=RW-.75,x=s.a[0]+s.dx*tt-s.dz*lat,z=s.a[1]+s.dz*tt+s.dx*lat;J.car=aiCar(c[1],Math.floor(Math.random()*4));J.car.position.set(x,G0,z);J.car.rotation.y=Math.atan2(s.dx,s.dz);J.ry=Math.atan2(s.dx,s.dz);J.x=x;J.z=z;J.col=c;J.cl=[x,z,1.6];COL.push(J.cl);J.pay=250+Math.floor(Math.random()*6)*30;
  way(x,z,'THE '+c[0]+' CAR');C.obj('🚗 FIND THE '+c[0]+' CAR ON '+ROADS[s.ri].n+' AND HOT-WIRE IT');say_('BIG TERRY','Need a '+c[0].toLowerCase()+' motor. My lad spotted one on '+ROADS[s.ri].n.toLowerCase()+'. Take it to Dez.')}
 else if(k==='burg'){let t=null;for(let q=0;q<200;q++){const c=TG[Math.floor(Math.random()*TG.length)];if(Math.hypot(c.x-p.x,c.z-p.z)>350&&c.x>TB.x0&&c.z<200){t=c;break}}t=t||TG[0];J.h=t;way(t.x,t.z,t.addr);C.obj(night()?'🏠 BREAK INTO '+t.addr:'🏠 WAIT TILL DARK (9PM), THEN BREAK INTO '+t.addr)}
 else if(k==='poach'){J.got=0;way(-420,-900,'COZE WOOD');C.obj(night()?'🦃 BAG 4 PHEASANTS IN COZE WOOD (0/4)':'🦃 COME BACK TO COZE WOOD AFTER 8PM (0/4)')}
 else if(k==='race'){if(cash<50){CJ.job=null;return toast('YOU NEED £50 TO ENTER')}cash-=50;J.cp=0;way(RACE[0][0],RACE[0][1],'THE START LINE');C.obj(night()?'🏁 GET TO THE START LINE ON KING\'S WAY':'🏁 THE RACE STARTS AFTER 9PM. MEET ON KING\'S WAY.')}
 else if(k==='fix'){way(-185,-590,'THE CRICKET PAVILION');C.obj('🏏 SLIP GERALD THE ENVELOPE AT THE PAVILION (10AM-6PM)')}
 else if(k==='train'){C.obj('🚂 WAIT ON A PLATFORM FOR THE TRAIN, THEN SNEAK INTO THE MAIL VAN (THE LAST CARRIAGE)');const s=T.stations.reduce((a,b)=>Math.hypot(b.door[0]-p.x,b.door[1]-p.z)<Math.hypot(a.door[0]-p.x,a.door[1]-p.z)?b:a);way(s.plat[0],s.plat[1],s.n)}
 else if(k==='bank'){bankNext()}}
function failJob(why){const J=CJ.job;if(!J)return;if(J.car){scene.remove(J.car);const i=COL.indexOf(J.cl);if(i>=0)COL.splice(i,1)}if(J.stolen)restoreCar();for(const r of J.rivals||[])scene.remove(r.g);for(const r of J.rings||[])scene.remove(r);CJ.job=null;unway();C.obj('');if(why)toast('✖ JOB FAILED: '+why)}
function doneJob(pay,msg,rp){const J=CJ.job;if(pay)cash+=pay;CJ.done[J.k]=(CJ.done[J.k]||0)+1;CJ.job=null;unway();C.obj('');rep(rp==null?1:rp);C.big('JOB DONE',(pay?'+£'+pay+' · ':'')+(msg||''),2400);beep(660,.1,'square',.06);setTimeout(()=>beep(990,.18,'square',.06),120)}
C.BUSTH.push(()=>{const L=[];if(CJ.hot.length){L.push('HOT GOODS');CJ.hot=[]}if(CJ.haul){L.push('£'+CJ.haul+' OF BANK CASH');CJ.haul=0}const J=CJ.job;if(J&&(J.k==='smug'&&J.step===1)){L.push('THE PACKAGE');failJob('BUSTED')}else if(J&&J.stolen){L.push('THE STOLEN CAR');failJob('BUSTED')}else if(J&&J.k==='race'&&J.step>=2)failJob('BUSTED');return L.join(', ')});
/* stolen-car swap: your own car is kept safe while you drive the hot one */
function stealCar(){const J=CJ.job;C.hold('HOT-WIRING...',3.2,()=>{if(!CJ.job)return;
  fade(()=>{J.stolen={paint:paintC.slice(),x:GS.x,z:GS.z,psi:GS.psi};J.mine=aiCar(paintC.slice(),[0,1,3,1,2][CARI]||0);J.mine.position.set(GS.x,G0,GS.z);J.mine.rotation.y=GS.psi;scene.remove(J.car);const i=COL.indexOf(J.cl);if(i>=0)COL.splice(i,1);J.car=null;GS.x=J.x;GS.z=J.z;GS.psi=J.ry||0;GS.vx=GS.vz=0;GS.speed=0;GS.onFoot=0;man.visible=false;paintC=J.col[1].slice();applyPaint();setLabels();camAng=GS.psi;
   J.step=1;way(CHOP[0],CHOP[1],"DEZ'S CHOP SHOP");C.obj('🔧 DRIVE IT TO DEZ AT THE OLD QUARRY (OFF KING\'S WAY)');C.heat(1,'CAR THEFT',{chance:.3})})},{r:2.5})}
function restoreCar(){const J=CJ.job;if(!J||!J.stolen)return;paintC=J.stolen.paint;applyPaint();if(J.mine)scene.remove(J.mine);J.stolen=null}
/* poaching: pheasants + the gamekeeper */
const PHS=[];let keeper=null;
function poachTick(dt){const J=CJ.job;const inWood=(x,z)=>x>-560&&x<-250&&z>-1160&&z<-700,p=pos();if(!night()||!inWood(p.x,p.z)){for(const b of PHS)b.g.visible=false;if(keeper)keeper.g.visible=false;return}
 while(PHS.length<6){const g=grp(B=>{pbox(B,0,.2,0,.35,.3,.7,[.55,.3,.12]);pbox(B,0,.45,.35,.16,.25,.16,[.1,.4,.25]);pbox(B,0,.46,.42,.1,.08,.1,[.85,.1,.1]);pbox(B,0,.3,-.55,.08,.08,.6,[.45,.25,.1])},0,0);PHS.push({g,x:0,z:0,a:0,run:0,on:0})}
 for(const b of PHS){if(!b.on){let x,z;for(let q=0;q<10;q++){x=p.x+rr(-60,60);z=p.z+rr(-60,60);if(inWood(x,z)&&Math.hypot(x-p.x,z-p.z)>20&&hAt(x,z)>1)break}b.x=x;b.z=z;b.on=1}
  const d=Math.hypot(b.x-p.x,b.z-p.z);if(d>90){b.on=0;continue}const fast=GS.onFoot?P.speed>4:true;if(d<7&&fast&&!b.run){b.run=1.4;b.a=Math.atan2(b.x-p.x,b.z-p.z);beep(1400,.05,'square',.02)}
  if(b.run>0){b.run-=dt;b.x+=Math.sin(b.a)*6*dt;b.z+=Math.cos(b.a)*6*dt;if(b.run<=0)b.run=0}else if(Math.random()<dt*.3)b.a+=rr(-1,1);else{b.x+=Math.sin(b.a)*.4*dt;b.z+=Math.cos(b.a)*.4*dt}
  b.g.position.set(b.x,G0,b.z);b.g.rotation.y=b.a;b.g.visible=true}
 if(!keeper){keeper={g:person(777,{old:true,beard:true,tc:[.25,.35,.2]},-400,-900,0),a:0,x:-400,z:-900,cool:0};const cone=new THREE.Mesh(new THREE.ConeGeometry(4,16,10,1,true),new THREE.MeshBasicMaterial({color:0xfff2a0,transparent:true,opacity:.22,depthWrite:false,side:THREE.DoubleSide}));cone.rotation.x=-Math.PI/2;cone.position.set(0,1.2,8.6);keeper.g.add(cone)}
 const K=keeper;K.g.visible=true;K.cool-=dt;if(!K.tx||Math.hypot(K.tx-K.x,K.tz-K.z)<2){K.tx=rr(-540,-270);K.tz=rr(-1140,-720)}const ka=Math.atan2(K.tx-K.x,K.tz-K.z);let da=ka-K.a;while(da>Math.PI)da-=TAU;while(da<-Math.PI)da+=TAU;K.a+=Math.max(-dt,Math.min(dt,da));K.x+=Math.sin(K.a)*1.3*dt;K.z+=Math.cos(K.a)*1.3*dt;K.g.position.set(K.x,G0,K.z);K.g.rotation.y=K.a;
 const dk=Math.hypot(p.x-K.x,p.z-K.z),ang=Math.atan2(p.x-K.x,p.z-K.z)-K.a,ca=Math.cos(ang);if(dk<17&&ca>.82&&K.cool<0){K.cool=12;say_('GAMEKEEPER','OI! POACHER! I\'M CALLING THE POLICE!');C.heat(1,'POACHING',{always:1});K.tx=p.x;K.tz=p.z}}
/* street race: the King's Way loop */
const RACE=[[-1060,150],[-1060,-500],[-1060,-890],[-620,-962],[-20,-965],[200,-965],[850,-905],[860,-450],[860,180]];
function raceTick(dt){const J=CJ.job,p=pos();
 if(J.step===0){if(!night())return;if(dist(RACE[0][0],RACE[0][1])<14&&!GS.onFoot){J.step=1;J.t=3.5;J.rivals=[[.9,.1,.1],[.95,.85,.1]].map((c,i)=>({g:aiCar(c,i?4:1),s:-6-i*6,lat:i?2:-2,v:0,vmax:31+i*1.5}));J.rings=RACE.slice(1).map(q=>{const m=new THREE.Mesh(new THREE.TorusGeometry(7,.35,6,24),new THREE.MeshBasicMaterial({color:0xffd24a}));m.position.set(q[0],G0+6,q[1]);scene.add(m);return m});J.cp=1;way(RACE[1][0],RACE[1][1],'CHECKPOINT 1');C.obj('🏁 GET READY...')}return}
 const L=[0];for(let i=1;i<RACE.length;i++)L.push(L[i-1]+Math.hypot(RACE[i][0]-RACE[i-1][0],RACE[i][1]-RACE[i-1][1]));const at=s=>{s=Math.max(0,Math.min(L[L.length-1],s));let i=1;while(i<L.length-1&&L[i]<s)i++;const a=RACE[i-1],b=RACE[i],f=(s-L[i-1])/(L[i]-L[i-1]);return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,Math.atan2(b[0]-a[0],b[1]-a[1])]};
 /* my progress along the route */let ms=0,bd=1e9;for(let i=1;i<RACE.length;i++){const a=RACE[i-1],b=RACE[i],dx=b[0]-a[0],dz=b[1]-a[1],l2=dx*dx+dz*dz;let t=((p.x-a[0])*dx+(p.z-a[1])*dz)/l2;t=Math.max(0,Math.min(1,t));const d=Math.hypot(p.x-a[0]-dx*t,p.z-a[1]-dz*t);if(d<bd){bd=d;ms=L[i-1]+t*Math.sqrt(l2)}}
 if(J.step===1){J.t-=dt;GS.vx=GS.vz=0;GS.speed=0;const n=Math.ceil(J.t);if(n!==J.n){J.n=n;if(n>0){C.big(String(n),'',700);beep(440,.15,'square',.06)}else{C.big('GO!','',700);beep(880,.3,'square',.07)}}if(J.t<=0){J.step=2}}
 if(J.step>=2){for(const r of J.rivals){const gap=ms-r.s,vt=r.vmax+Math.max(-6,Math.min(7,gap*.05));r.v+=Math.max(-8*dt,Math.min(6*dt,vt-r.v));r.s+=r.v*dt}
  const q=RACE[J.cp];if(Math.hypot(p.x-q[0],p.z-q[1])<16){J.rings[J.cp-1].visible=false;beep(990,.08,'square',.05);J.cp++;if(J.cp>=RACE.length){const pl=1+J.rivals.filter(r=>r.s>=L[L.length-1]-1).length;for(const r of J.rivals)scene.remove(r.g);for(const m of J.rings)scene.remove(m);J.rivals=[];J.rings=[];if(pl===1)doneJob(400,'YOU WON THE KING\'S WAY RUN!',2);else{doneJob(pl===2?60:0,'YOU CAME '+(pl===2?'2ND':'3RD')+'. "Better luck next time."',1)}return}way(RACE[J.cp][0],RACE[J.cp][1],'CHECKPOINT '+J.cp)}
  const place=1+J.rivals.filter(r=>r.s>ms).length;C.obj('🏁 POSITION '+place+'/3 · CHECKPOINT '+J.cp+'/'+(RACE.length-1));
  if(Math.random()<dt*.06)C.heat(2,'STREET RACING',{r:110,chance:0})}
 for(const r of J.rivals||[]){const q=at(r.s),n=[Math.cos(q[2]),-Math.sin(q[2])];r.g.position.set(q[0]+n[0]*r.lat,G0,q[1]+n[1]*r.lat);r.g.rotation.y=q[2]}}
/* burglary: rummage mini-game */
function rummage(){const J=CJ.job,L=[['A TELLY',90],['GRAN\'S JEWELLERY',160],['A LAPTOP',120],['A GAMES CONSOLE',80],['A SILVER CANDLESTICK',70],['A JAR OF COINS',40],['A FANCY WATCH',140],['A PAINTING',110],['NOTHING BUT SOCKS',0],['A SLEEPING CAT',0]];
 const st={cells:[...Array(12)].map(()=>({o:0,it:pk(L)})),got:[],dog:0,dogT:rr(9,15)};
 RESORT2.MG('🏠 '+J.h.addr,{init(S){S.info('TAP CUPBOARDS AND DRAWERS. GET OUT BEFORE THE DOG WAKES UP!');S.btns([['LEAVE',()=>finish(S)]])},
  down(S,x,y){if(st.dog)return;const i=Math.floor((y-120)/120)*4+Math.floor(x/120);if(i<0||i>=12||st.cells[i].o)return;st.cells[i].o=1;const it=st.cells[i].it;if(it[1]){st.got.push({n:it[0],v:it[1]});beep(880,.06,'square',.04)}else beep(200,.08,'square',.04)},
  step(S,dt){if(S.t>st.dogT&&!st.dog){st.dog=1;beep(300,.2,'sawtooth',.08);setTimeout(()=>beep(260,.25,'sawtooth',.08),220);S.info('WOOF! THE DOG IS UP! GET OUT!');setTimeout(()=>finish(S,1),1300)}},
  draw(S,g){g.fillStyle=st.dog?'#3a1010':'#141820';g.fillRect(0,0,480,640);g.fillStyle='#ffd24a';g.font='bold 18px monospace';g.textAlign='center';g.fillText('LOOT: '+st.got.length+'  ·  £'+st.got.reduce((a,b)=>a+b.v,0),240,60);g.fillStyle='#fff6';g.fillText('🐕 '+(st.dog?'AWAKE!':'zzz... '+Math.max(0,st.dogT-S.t).toFixed(0)),240,95);
   st.cells.forEach((c,i)=>{const x=(i%4)*120,y=120+Math.floor(i/4)*120;g.fillStyle=c.o?'#2a2a30':'#6a4a2a';g.fillRect(x+8,y+8,104,104);g.fillStyle=c.o?'#fff':'#c8a070';g.font='bold 11px monospace';if(c.o){g.fillText(c.it[0].slice(0,14),x+60,y+58);g.fillText(c.it[1]?'£'+c.it[1]:'',x+60,y+76)}else{g.fillRect(x+52,y+56,16,6)}})},
  close(){finish(null)}});
 function finish(S,caught){if(st.f)return;st.f=1;if(S)S.close();CJ.hot.push(...st.got);const v=st.got.reduce((a,b)=>a+b.v,0);if(caught)C.heat(2,'BURGLARY',{always:1});else C.heat(1,'BURGLARY',{chance:.2});
  if(v){CJ.job=null;unway();rep(1);C.obj('');C.big('BURGLED',st.got.length+' ITEMS (WORTH ~£'+v+') · FENCE THEM WITH DEZ, MARJORIE\'S NEPHEW OR TERRY',3200)}else failJob('NOTHING WORTH NICKING')}}
/* three card brag */
function brag(){const pot0=20;if(cash<pot0)return toast('YOU NEED £20 TO SIT IN');const deck=()=>{const d=[];for(let s=0;s<4;s++)for(let r=2;r<=14;r++)d.push([r,s]);for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]]}return d};
 const score=h=>{const r=h.map(c=>c[0]).sort((a,b)=>b-a),fl=h[0][1]===h[1][1]&&h[1][1]===h[2][1],run=(r[0]-r[1]===1&&r[1]-r[2]===1)||(r[0]===14&&r[1]===3&&r[2]===2),pr=r[0]===r[1]||r[1]===r[2];const cat=r[0]===r[2]?5:run&&fl?4:run?3:fl?2:pr?1:0;const pv=pr?(r[0]===r[1]?r[0]:r[1]):0;return cat*1e6+pv*1e4+r[0]*400+r[1]*20+r[2]};
 const NAMES=['HAT TREVOR','ONE-EYED MAUREEN'],SU='♠♥♦♣',RK=r=>r>10?'JQKA'[r-11]:String(r),st={ph:'bet',pot:0,msg:''};let D,H;
 const deal=S=>{if(cash<pot0){S.end('YOU\'RE SKINT. "Come back when you\'ve got readies."');return}cash-=pot0;D=deck();H=[D.splice(0,3),D.splice(0,3),D.splice(0,3)];st.pot=pot0*3;st.ph='bet';st.fold=[0,0,0];S.info('ANTE £20 · FOLD, SEE (£0) OR RAISE (£40)');S.btns([['FOLD',()=>show(S,'fold')],['SEE',()=>show(S,'see')],['RAISE £40',()=>{if(cash<40)return S.info('NOT ENOUGH CASH');cash-=40;st.pot+=40;show(S,'raise')}]])};
 const show=(S,act)=>{if(st.ph!=='bet')return;st.ph='show';if(Math.random()<.07){st.msg='🚨 POLICE RAID! EVERYONE LEGS IT!';S.end(st.msg,()=>C.heat(1,'ILLEGAL GAMBLING',{always:1}));return}
  const sc=H.map(score);for(let i=1;i<3;i++){const strong=sc[i]>=1e6||sc[i]%1e6>=12*400;st.fold[i]=!strong&&Math.random()<(act==='raise'?.65:.35);if(!st.fold[i]&&act==='raise')st.pot+=40}
  if(act==='fold'){st.msg='YOU FOLDED.';}else{const live=[0,1,2].filter(i=>!st.fold[i]);let w=live.reduce((a,b)=>sc[b]>sc[a]?b:a,live[0]);if(w===0){cash+=st.pot;st.msg='YOU WIN THE POT: £'+st.pot+'!';beep(880,.2,'square',.06)}else st.msg=NAMES[w-1]+' WINS £'+st.pot+'.'}
  S.info(st.msg);S.btns([['DEAL AGAIN (£20)',()=>deal(S)],['LEAVE',()=>S.close()]])};
 RESORT2.MG('🃏 THE BACK ROOM',{init(S){deal(S)},draw(S,g){g.fillStyle='#0e3a1e';g.fillRect(0,0,480,640);g.fillStyle='#ffd24a';g.font='bold 18px monospace';g.textAlign='center';g.fillText('POT £'+st.pot,240,320);
  const card=(c,x,y,hid)=>{g.fillStyle=hid?'#7a1a1a':'#f8f4ea';g.fillRect(x,y,62,88);g.strokeStyle='#000';g.strokeRect(x,y,62,88);if(hid)return;g.fillStyle=c[1]%3?'#c01818':'#111';g.font='bold 22px monospace';g.fillText(RK(c[0]),x+31,y+40);g.fillText(SU[c[1]],x+31,y+70)};
  if(!H)return;for(let i=0;i<3;i++){const y=i===0?470:i===1?60:180,lab=i?NAMES[i-1]+(st.fold&&st.fold[i]?' (FOLDED)':''):'YOU';g.fillStyle='#fff';g.font='bold 14px monospace';g.fillText(lab,240,y-10);for(let k=0;k<3;k++)card(H[i][k],135+k*72,y,i>0&&st.ph==='bet')}}})}
/* mail-van robbery */
function mailVan(from){const st={sacks:[...Array(9)].map(()=>({o:0,v:Math.random()<.6?Math.floor(rr(20,120)):0,reg:Math.random()<.2})),cash:0,hot:[],guard:0,gT:rr(5,9),hid:0,caught:0,end:24};
 RESORT2.MG('🚂 THE MAIL VAN',{init(S){S.info('RIP OPEN THE SACKS! WHEN THE GUARD COMES, HIT HIDE!');S.btns([['HIDE',()=>{if(st.guard===1){st.hid=1;st.guard=2;beep(500,.1,'square',.04)}}]])},
  down(S,x,y){if(st.guard===1)return;const i=Math.floor((y-160)/140)*3+Math.floor(x/160);if(i<0||i>8||st.sacks[i].o)return;const s=st.sacks[i];s.o=1;if(s.reg){st.hot.push({n:'A REGISTERED PARCEL',v:Math.floor(rr(80,220))});beep(990,.08,'square',.05)}else if(s.v){st.cash+=s.v;beep(880,.06,'square',.04)}else beep(220,.06,'square',.03)},
  step(S,dt){if(S.t>st.end){fin(S);return}if(!st.guard&&S.t>st.gT){st.guard=1;st.gw=S.t;beep(300,.2,'sawtooth',.06);S.info('FOOTSTEPS! THE GUARD! HIDE!')}if(st.guard===1&&S.t-st.gw>1.8){st.caught=1;S.info('"OI! STOP THIEF!"');fin(S)}if(st.guard===2&&S.t-st.gw>4){st.guard=3;S.info('HE\'S GONE. KEEP GOING!')}},
  draw(S,g){g.fillStyle=st.guard===1?'#3a1414':'#2a2016';g.fillRect(0,0,480,640);g.fillStyle='#ffd24a';g.font='bold 18px monospace';g.textAlign='center';g.fillText('£'+st.cash+' + '+st.hot.length+' PARCELS · NEXT STATION '+Math.max(0,st.end-S.t).toFixed(0)+'s',240,60);
   if(st.guard===1){g.fillStyle='#fff';g.font='bold 60px monospace';g.fillText('👮',240,120)}st.sacks.forEach((s,i)=>{const x=(i%3)*160,y=160+Math.floor(i/3)*140;g.fillStyle=s.o?'#3a3020':'#a08858';g.beginPath();g.ellipse(x+80,y+70,58,52,0,0,TAU);g.fill();g.fillStyle=s.o?'#fff':'#5a4628';g.font='bold 13px monospace';g.fillText(s.o?(s.reg?'PARCEL!':s.v?'£'+s.v:'LETTERS'):'ROYAL MAIL',x+80,y+75)})},close(){fin(null)}});
 function fin(S){if(st.f)return;st.f=1;if(S)S.close();cash+=st.cash;CJ.hot.push(...st.hot);const others=T.stations.filter(s=>s!==from),to=others.reduce((a,b)=>Math.abs(b.plat[0]-from.plat[0])<Math.abs(a.plat[0]-from.plat[0])?b:a);
  fade(()=>{P.x=to.plat[0]+20;P.z=to.plat[1]+4;P.psi=0;toast('YOU HOP OFF AT '+to.n+(st.caught?' WITH THE GUARD SHOUTING':''))});setTimeout(()=>{C.heat(st.caught?3:2,'TRAIN ROBBERY',{always:1});if(st.cash||st.hot.length)doneJob(0,'£'+st.cash+' + '+st.hot.length+' PARCELS · NOW LOSE THE POLICE!',2);else failJob('EMPTY SACKS')},700)}}
/* the bank job */
function bankNext(){const J=CJ.job;if(!J)return;const b=door('COZYTOWN BANK');if(!CJ.bank.cased){way(b.x,b.z,'COZYTOWN BANK');C.obj('🏦 STEP 1: CASE THE BANK (GO INSIDE DURING OPENING HOURS AND LOOK AROUND)')}else if(!CJ.bank.lance){const d=door('DIY DEPOT');way(d.x,d.z,'DIY DEPOT');C.obj('🔥 STEP 2: BUY A THERMAL LANCE AT DIY DEPOT')}else{way(b.x,b.z,'COZYTOWN BANK');C.obj(night()&&(GT>=23||GT<4)?'🌙 STEP 3: BREAK INTO THE BANK!':'🌙 STEP 3: COME BACK BETWEEN 11PM AND 4AM AND BREAK IN')}}
function vault(){const st={p:0,heat:0,zone:.5,dir:1,hold:0,cash:0,alarm:0,needle:.5};
 RESORT2.MG('🔥 THE VAULT',{init(S){S.info('HOLD BURN TO MOVE THE FLAME. KEEP IT IN THE GREEN ZONE. TOO HOT = ALARM!');S.btns([['🔥 BURN',()=>st.hold=1,()=>st.hold=0]])},key(S,k,d){if(k===' '||k==='ArrowUp')st.hold=d},
  step(S,dt){st.zone+=st.dir*dt*(.18+st.p*.25);if(st.zone>.82||st.zone<.18)st.dir*=-1;st.needle+=(st.hold?.75:-.6)*dt;st.needle=Math.max(0,Math.min(1,st.needle));const inz=Math.abs(st.needle-st.zone)<.1;if(st.hold){if(inz)st.p+=dt*.12;else st.heat+=dt*.4}st.heat=Math.max(0,st.heat-dt*.05);
   if(st.heat>=1&&!st.alarm){st.alarm=1;beep(1200,.4,'square',.08);S.info('🚨 ALARM! THE DOOR\'S STILL SHUT... GRAB WHAT YOU CAN!')}if(st.p>=1){st.cash=Math.round(2000+4000*(1-Math.min(1,st.heat)));S.end('THE VAULT IS OPEN! YOU STUFF £'+st.cash+' IN A BAG. NOW GET TO HOLLOW FARM!',()=>after(st))}else if(st.alarm&&S.t>0&&!st.at){st.at=S.t}if(st.at&&S.t-st.at>6){st.cash=Math.round(600+st.p*1200);S.end('NO TIME! YOU GRAB £'+st.cash+' FROM THE TILLS AND RUN!',()=>after(st))}},
  draw(S,g){g.fillStyle='#14161c';g.fillRect(0,0,480,640);g.fillStyle='#6a7080';g.beginPath();g.arc(240,250,150,0,TAU);g.fill();g.fillStyle='#4a5060';g.beginPath();g.arc(240,250,120,0,TAU);g.fill();g.fillStyle='#ffd24a';g.fillRect(232,100,16,300*st.p>0?0:0);
   g.strokeStyle='#ff8020';g.lineWidth=10;g.beginPath();g.arc(240,250,135,-Math.PI/2,-Math.PI/2+TAU*st.p);g.stroke();g.fillStyle='#fff';g.font='bold 16px monospace';g.textAlign='center';g.fillText('DOOR '+Math.round(st.p*100)+'%',240,256);
   const bx=60,bw=360,by=470;g.fillStyle='#222';g.fillRect(bx,by,bw,30);g.fillStyle='#2a8a3a';g.fillRect(bx+(st.zone-.1)*bw,by,.2*bw,30);g.fillStyle=st.hold?'#ffb030':'#fff';g.fillRect(bx+st.needle*bw-4,by-8,8,46);
   g.fillStyle='#222';g.fillRect(bx,by+60,bw,14);g.fillStyle=st.heat>.7?'#ff3030':'#ff9030';g.fillRect(bx,by+60,bw*Math.min(1,st.heat),14);g.fillStyle='#fff';g.font='bold 12px monospace';g.fillText('HEAT',240,by+100)},close(){if(!st.cash)toast('YOU BACKED OFF. COME BACK WHEN YOU\'RE READY.')}});
 function after(st){CJ.haul=st.cash;CJ.bank.lance=0;C.heat(4,'BANK ROBBERY',{always:1});const J=CJ.job;if(J){J.step=9}way(-1040,-780,'HOLLOW FARM');C.obj('💰 GET £'+st.cash+' BACK TO HOLLOW FARM. LOSE THE POLICE!')}}
/* hand-held goods to fence */
function fence(who,rate){const v=Math.round(hotV()*rate);if(!v)return toast(who+': "Got nothing for me? Don\'t waste my time."');cash+=v;CJ.hot=[];say_(who,pk(['"Lovely. No questions asked."','"Where\'d you get this? Actually, don\'t tell me."','"Pleasure."'])+' +£'+v);beep(660,.1,'square',.05)}

/* ================================================================ street events */
const EVT={t:90,cur:null};
function evTick(dt){const p=pos();if(!C.inTown()||busy){return}EVT.t-=dt;const E=EVT.cur;
 if(!E&&EVT.t<0){EVT.t=rr(100,200);if(GS.onFoot&&!night()&&p.z>-700){/* bag snatch */const a=rr(0,TAU),x=p.x+Math.sin(a)*14,z=p.z+Math.cos(a)*14;if(hAt(x,z)<1)return;const v=person(Math.floor(rr(1,999)),{old:true},x,z,0),th=person(Math.floor(rr(1,999)),{tc:[.1,.1,.12],hs:3},x+1,z,0);EVT.cur={k:'snatch',v,th,x:x+1,z,a:a,t:25};say_('OLD LADY','HELP! STOP THIEF! HE\'S GOT MY HANDBAG!');beep(700,.2,'square',.05)}
  else if(!CJ.done.dog||Math.random()<.4){/* lost dog on the moors */const x=rr(-900,800),z=rr(-1120,-720);if(hAt(x,z)<1)return;const g=grp(B=>{pbox(B,0,.35,0,.4,.35,.85,[.75,.5,.25]);pbox(B,0,.6,.45,.3,.3,.35,[.75,.5,.25]);pbox(B,0,.75,.55,.08,.12,.08,[.2,.15,.1]);for(const[a,b]of[[-.14,-.3],[.14,-.3],[-.14,.3],[.14,.3]])pbox(B,a,0,b,.1,.35,.1,[.7,.45,.2])},x,z);const h=TG.filter(t=>t.x>240&&t.x<870&&t.z>-445&&t.z<-50);EVT.cur={k:'dog',g,x,z,home:pk(h.length?h:TG),fol:0};phText('COZY GAZETTE','LOST DOG: "BISCUIT", a ginger terrier, last seen on the moors north of the railway. Reward for his safe return!')}}
 if(!E)return;
 if(E.k==='snatch'){E.t-=dt;const dth=Math.hypot(p.x-E.x,p.z-E.z);const away=Math.atan2(E.x-p.x,E.z-p.z);E.a+=Math.max(-2*dt,Math.min(2*dt,((away-E.a+3*Math.PI)%TAU)-Math.PI));const nx=E.x+Math.sin(E.a)*5.2*dt,nz=E.z+Math.cos(E.a)*5.2*dt;if(hAt(nx,nz)>1){E.x=nx;E.z=nz}else E.a+=1;E.th.position.set(E.x,G0,E.z);E.th.rotation.y=E.a;const s=Math.sin(performance.now()/90)*.8;if(E.th.l1){E.th.l1.rotation.x=s;E.th.l2.rotation.x=-s}
  C.obj('👜 CATCH THE BAG SNATCHER! '+Math.round(dth)+' M');if(dth<2.2){E.caught=1;EVT.cur=null;scene.remove(E.th);C.obj('');openChoice('YOU TACKLE THE THIEF! THE HANDBAG IS YOURS TO...',[['RETURN IT (+£40, REP WITH THE TOWN)',()=>{cash+=40;scene.remove(E.v);toast('👵 "OH BLESS YOU, DEAR!" +£40')}],['KEEP IT (+£90 · THE POLICE MAY HEAR)',()=>{cash+=90;scene.remove(E.v);C.heat(1,'THEFT',{chance:.5})}]])}
  else if(E.t<0||dth>120){scene.remove(E.th);scene.remove(E.v);EVT.cur=null;C.obj('');toast('THE THIEF GOT AWAY.')}}
 else if(E.k==='dog'){const d=Math.hypot(p.x-E.x,p.z-E.z);if(!E.fol){if(d<3){E.fol=1;way(E.home.x,E.home.z,'BISCUIT\'S HOME');C.obj('🐕 TAKE BISCUIT HOME · '+E.home.addr);toast('🐕 BISCUIT WAGS HIS TAIL AND FOLLOWS YOU!');beep(900,.05,'square',.04)}}
  else{if(d>3.5){const a=Math.atan2(p.x-E.x,p.z-E.z),sp=Math.min(GS.onFoot?7:40,d*1.6);E.x+=Math.sin(a)*sp*dt;E.z+=Math.cos(a)*sp*dt;E.g.rotation.y=a}if(d>60){E.x=p.x-2;E.z=p.z-2}
   if(Math.hypot(E.home.x-E.x,E.home.z-E.z)<6){scene.remove(E.g);EVT.cur=null;unway();C.obj('');cash+=50;CJ.done.dog=(CJ.done.dog||0)+1;C.big('BISCUIT IS HOME','"OH THANK YOU!" +£50',2400)}}E.g.position.set(E.x,G0,E.z)}}
function openChoice(title,opts){CUSTOM_SHOP.choice=function(){$i('shT').textContent='⚡ DECISION';$i('shMsg').textContent=title;for(const[l,f]of opts)dRow(l,[['GO',()=>{closeShop();f()}]])};openShop('choice')}

/* ================================================================ hideout */
CUSTOM_SHOP.hide=function(msg){const H=CJ.hide;$i('shT').textContent='🏚 HOLLOW FARM';$i('shMsg').textContent=msg||'YOUR HIDEOUT · CASH £'+Math.round(cash);
 dRow('STASH (SAFE FROM THE POLICE): '+CJ.stash.length+' ITEMS · ON YOU: '+CJ.hot.length,[['STASH ALL',()=>{CJ.stash.push(...CJ.hot);CJ.hot=[];renderShop('STASHED')}],['TAKE ALL',()=>{CJ.hot.push(...CJ.stash);CJ.stash=[];renderShop('TAKEN')}]]);
 if(H.safe)dRow('SAFE: £'+H.cash,[['PUT £100',()=>{if(cash<100)return renderShop('NOT ENOUGH');cash-=100;H.cash+=100;renderShop()}],['TAKE ALL',()=>{cash+=H.cash;H.cash=0;renderShop()}]]);else dRow('BUY A SAFE (KEEP CASH OUT OF REACH)',[['£300',()=>{if(cash<300)return renderShop('NOT ENOUGH CASH');cash-=300;H.safe=1;renderShop('SAFE INSTALLED')}]]);
 dRow(H.respray?'RESPRAY BOOTH: DRIVE INTO THE BARN TO LOSE ANY WANTED LEVEL':'BUILD A RESPRAY BOOTH (CLEARS ALL STARS WHEN YOU DRIVE IN)',[[H.respray?'OWNED':'£400',()=>{if(H.respray)return;if(cash<400)return renderShop('NOT ENOUGH CASH');cash-=400;H.respray=1;renderShop('BOOTH BUILT')}]]);
 dRow(H.bed?'SLEEP TILL MORNING':'PUT IN A CAMP BED (SLEEP HERE)',[[H.bed?'SLEEP':'£150',()=>{if(!H.bed){if(cash<150)return renderShop('NOT ENOUGH CASH');cash-=150;H.bed=1;return renderShop('BED SET UP')}closeShop();fade(()=>{const w=GT;GT=8;if(w>=8)newDay();HN.en=100;todI=hband();applyTOD(todI);toast('☀ MORNING AT HOLLOW FARM. FULLY RESTED.')})}]]);
 const b=CJ.bank;dRow('PLANNING BOARD: BANK JOB · '+(b.cased?'✓ CASED':'✗ CASE IT')+' · '+(b.lance?'✓ LANCE':'✗ LANCE')+(b.tip?' · ✓ TIP':''),[['OK',()=>renderShop(tier()>=3?'"When you\'re ready, talk to Terry."':'"Terry doesn\'t trust you with that yet."')]]);dRow('',[['DONE',()=>closeShop()]])};

/* ================================================================ context buttons */
{const c0=ctx;ctx=function(){const b=c0();if(busy||!C.inTown())return b;const p=pos(),J=CJ.job;
 if(GS.onFoot){
  if(TP.x&&dist(TP.x,TP.z)<3.2)return{label:'🎩 TALK TO BIG TERRY',fn:()=>openShop('terry')};
  if(J&&J.k==='smug'&&J.step===0&&dist(J.a[1],J.a[2])<5)return{label:'📦 COLLECT THE PACKAGE',fn:()=>C.hold('COLLECTING...',1.6,()=>{J.step=1;way(J.b[1],J.b[2],J.b[0]);C.obj('📦 DELIVER THE PACKAGE · '+J.b[0]+' · DON\'T DRAW ATTENTION');toast('📦 GOT IT. NOW CAREFULLY TO '+J.b[0])},{r:3})};
  if(J&&J.k==='smug'&&J.step===1&&dist(J.b[1],J.b[2])<6)return{label:'📦 DROP THE PACKAGE',fn:()=>C.hold('DROPPING...',1.6,()=>doneJob(J.pay,'PACKAGE DELIVERED'),{r:3})};
  if(J&&J.k==='steal'&&J.car&&dist(J.x,J.z)<3.6)return{label:'🔧 HOT-WIRE THE '+J.col[0]+' CAR',fn:stealCar};
  if(J&&J.k==='burg'&&dist(J.h.x,J.h.z)<3)return night()?{label:'🏠 BREAK IN',fn:()=>C.hold('PICKING THE LOCK...',3.5,rummage,{r:2})}:{label:'🏠 TOO LIGHT. COME BACK AFTER 9PM',fn:()=>toast('NOT IN BROAD DAYLIGHT!')};
  if(J&&J.k==='poach'){const b2=PHS.find(q=>q.g.visible&&!q.run&&dist(q.x,q.z)<2.6);if(b2)return{label:'🦃 GRAB THE PHEASANT',fn:()=>{b2.on=0;b2.g.visible=false;J.got++;beep(700,.08,'square',.04);if(J.got>=4){const d=door('THE PLOUGH');way(d.x,d.z,'THE PLOUGH');C.obj('🦃 TAKE THE PHEASANTS TO THE PLOUGH\'S KITCHEN DOOR')}else C.obj('🦃 BAG 4 PHEASANTS IN COZE WOOD ('+J.got+'/4)')}};
   const d=door('THE PLOUGH');if(J.got>=4&&d&&dist(d.x,d.z)<5)return{label:'🦃 SELL THE PHEASANTS TO CHEF',fn:()=>doneJob(J.got*25,'"Lovely birds. Didn\'t get \'em from me."')}}
  if(J&&J.k==='fix'&&dist(-185,-594)<6)return(GT>=10&&GT<18)?{label:'🏏 SLIP GERALD THE ENVELOPE',fn:()=>C.hold('"ALRIGHT GERALD..."',2,()=>{C.heat(2,'MATCH FIXING',{chance:.25});CJ.fixDay=DAY+1;doneJob(0,'THE FIX IS IN. TERRY PAYS TOMORROW.',2)},{r:3})}:{label:'🏏 NOBODY\'S HERE. COME BACK 10AM-6PM',fn:()=>{}};
  if(J&&J.k==='train'){const st=T.stations.find(s=>Math.hypot(p.x-s.plat[0],p.z-s.plat[1])<45);const TR=T.train;if(st&&TR.wait>2&&!TR.atEnd&&Math.abs(TR.x-st.plat[0])<2){const vanX=TR.x-TR.dir*23;if(Math.hypot(p.x-vanX,p.z-(RAILZ+3.5))<9)return{label:'🚂 SNEAK INTO THE MAIL VAN',fn:()=>mailVan(st)}}}
  if(J&&J.k==='bank'&&CJ.bank.cased&&CJ.bank.lance){const bd=door('COZYTOWN BANK');if(bd&&dist(bd.x,bd.z)<3.5){if(GT>=23||GT<4)return{label:'🏦 BREAK INTO THE BANK',fn:()=>C.hold('CUTTING THE ALARM...',3.5,vault,{r:2})};}}
  for(const s of SECRETS)if(!CJ.sec[s.k]&&dist(s.x,s.z)<3.4)return{label:'🔍 '+s.lab,fn:()=>C.hold('SEARCHING...',2,()=>{CJ.sec[s.k]=1;s.go();beep(880,.1,'square',.05)},{r:2.5})};
  if(dist(CHOP[0],CHOP[1])<6)return{label:'🔧 TALK TO DEZ',fn:()=>CJ.hot.length?fence('DEZ',.6):say_('DEZ',pk(['"Bring me motors. Terry sends the orders."','"Got any hot gear? I pay sixty percent."']))};
  {const d=door('CHARITY SHOP');if(d){const a=out(d,1.2,-5);if(dist(a[0],a[1])<3)return{label:'🤫 "PSST... GOT ANYTHING?"',fn:()=>CJ.hot.length?fence('MARJORIE\'S NEPHEW',.55):say_('MARJORIE\'S NEPHEW','"Come back when you\'ve got something worth flogging."')}}}
  if(dist(-1050,-772)<3.2&&!CJ.hide.own)return{label:'🏚 FOR SALE: HOLLOW FARM (£1,500)',fn:()=>{if(cash<1500)return toast('YOU NEED £1,500');cash-=1500;CJ.hide.own=1;C.big('HOLLOW FARM IS YOURS','A HIDEOUT: STASH, SAFE, RESPRAY, BED',3000)}};
  if(CJ.hide.own&&dist(BARN[0],BARN[1])<6)return{label:'🏚 THE HIDEOUT',fn:()=>openShop('hide')}}
 return b}}
/* bank: casing inside + lance at DIY */
{const b0=buildShop;buildShop=function(o){b0(o);const J=CJ.job;if(!J||J.k!=='bank')return;if(o.t==='COZYTOWN BANK'&&!CJ.bank.cased)IA.push({r:[2.4,4.2,1,2.8],label:'👀 LOOK AROUND (CASE THE JOINT)',fn:()=>{C.hold('MEMORISING THE LAYOUT...',3,()=>{CJ.bank.cased=1;toast('✓ CASED: THE VAULT IS BEHIND THE COUNTER. THE ALARM IS ON A TIMER.');bankNext()},{r:1.5})}});
 if(o.t==='DIY DEPOT'&&!CJ.bank.lance)IA.push({r:[2.4,4.2,1,2.8],label:'🔥 BUY A THERMAL LANCE (£200)',fn:()=>{if(cash<200)return toast('£200, MATE');cash-=200;CJ.bank.lance=1;toast('✓ "WHAT\'S THAT FOR?" "...PLUMBING."');bankNext()}})}}
/* cricket fix pays the next day; Terry's morning tips */
{const n0=newDay;newDay=function(){n0();if(CJ.fixDay&&DAY>=CJ.fixDay){CJ.fixDay=0;cash+=350;phText('BIG TERRY','Rovers... I mean Cozytown lost by 40 runs. Funny that. £350 in your pocket.')}else if(CJ.rep>0&&Math.random()<.5)phText('BIG TERRY',pk(['Gamekeeper\'s got a bad knee. Coze Wood\'s wide open tonight.','Lads are racing on King\'s Way tonight. Bring £50.','Dez needs motors. Pop round.','Old Bill\'s doubled patrols round the market. Keep your head down.','The back room\'s open tonight if you fancy a hand.']))}}

/* ================================================================ job ticks, hideout lay-low, respray */
let lowT=0;
{const u0=updCozy;updCozy=function(dt){u0(dt);if(menuOpen)return;const p=pos(),J=CJ.job;
 for(const[g,r]of VIS)g.visible=!GS.inside&&Math.hypot(g.position.x-cam.position.x,g.position.z-cam.position.z)<r;
 if(J&&C.inTown()){J.t+=dt;
  if(J.k==='steal'&&J.stolen&&!GS.onFoot&&Math.hypot(GS.x-CHOP[0],GS.z-CHOP[1])<9&&Math.abs(GS.speed||0)<3){const pay=J.pay;fade(()=>{restoreCar();GS.x=CHOP[0]-14;GS.z=CHOP[1];GS.psi=-Math.PI/2;doneJob(pay,'"Tidy. Your own motor\'s round the front."')})}
  if(J.k==='steal'&&J.stolen&&GS.onFoot&&Math.hypot(P.x-GS.x,P.z-GS.z)>80)failJob('YOU ABANDONED THE CAR');
  if(J.k==='smug'&&J.step===1&&!GS.onFoot&&Math.abs(GS.speed||0)>30&&C.W.cops.some(c=>Math.hypot(c.x-GS.x,c.z-GS.z)<50))C.heat(2,'SPEEDING WITH CONTRABAND',{always:1});
  if(J.k==='poach'){poachTick(dt);if(night()&&J.got<4)C.obj('🦃 BAG 4 PHEASANTS IN COZE WOOD ('+J.got+'/4)')}
  if(J.k==='race')raceTick(dt);
  if(J.k==='bank'&&J.step!==9&&J.t%5<dt)bankNext()}
 else if(!J){for(const b of PHS)b.g.visible=false;if(keeper)keeper.g.visible=false}
 /* get the bank cash home */if(CJ.haul&&Math.hypot(p.x-FARM.x,p.z-FARM.z)<45&&C.W.st===0){const v=CJ.haul;CJ.haul=0;CJ.job=null;unway();C.obj('');rep(3);C.big('THE BANK JOB','+£'+v+' · LEGEND',3200);cash+=v}
 /* hideout: lay low / respray */if(CJ.hide.own&&C.W.st>0&&!GS.onFoot&&Math.hypot(GS.x-(-1012),GS.z-(-792))<9){const copsNear=C.W.cops.some(c=>!c.patrol&&Math.hypot(c.x-GS.x,c.z-GS.z)<55);if(CJ.hide.respray){if(!copsNear){paintC=[[.8,.08,.1],[.12,.28,.8],[.1,.1,.11],[1,1,1],[.1,.58,.27]][Math.floor(Math.random()*5)];applyPaint();C.clearWanted('🎨 FRESH RESPRAY IN THE BARN. NOBODY\'S LOOKING FOR THIS CAR.')}}else{lowT+=dt;if(!copsNear&&lowT>5&&C.W.st<=3){C.clearWanted('🤫 YOU LAID LOW IN THE BARN. THE HEAT IS OFF.');lowT=0}C.obj('🤫 LAYING LOW... '+Math.max(0,5-lowT).toFixed(0))}}else lowT=0;
 evTick(dt)}}

/* ================================================================ phone: crime app, taxi, jobs board */
PHX.push({k:'crime',ic:'🎩',n:'UNDERWORLD',bg:'#3a0a14',render({el,btn}){el('div','phH','THE UNDERWORLD');el('small',null,'REP '+CJ.rep+' · '+TN[tier()+(CJ.rep>=12?1:0)]);
 const r=el('div','phR');el('div',null,CJ.job?'ON A JOB: '+CJ.job.n:'NO JOB. SEE BIG TERRY BEHIND THE RAILWAY TAVERN.',r);if(!CJ.job&&TP.x)btn(el('div','bt',null,r),'WAYPOINT TO TERRY',()=>{way(TP.x,TP.z,'BIG TERRY');toast('WAYPOINT SET')});
 const r2=el('div','phR');el('div',null,'HOT GOODS ON YOU: '+CJ.hot.length+' (~£'+hotV()+')'+(CJ.stash.length?' · STASHED: '+CJ.stash.length:''),r2);el('small',null,'FENCE WITH DEZ (60%), MARJORIE\'S NEPHEW (55%) OR TERRY (50%). BUSTED = CONFISCATED.',r2);
 const r3=el('div','phR');el('div',null,'WANTED: '+'★'.repeat(C.W.st)+'☆'.repeat(5-C.W.st),r3);el('small',null,'LOSE THEM: GET OUT OF SIGHT · HIDE IN A SHOP (2★) · LAY LOW AT HOLLOW FARM (3★) · RESPRAY (ALL)',r3);
 const r4=el('div','phR');el('div',null,'SECRETS FOUND: '+Object.keys(CJ.sec).length+'/'+SECRETS.length,r4);el('small',null,'THERE ARE OLD PLACES OFF THE ROADS. EXPLORE.',r4)}});
PHX.push({k:'taxi',ic:'🚕',n:'TAXI',bg:'#a08010',render({el,btn}){el('div','phH','COZY CABS');el('small',null,'WE\'LL TAKE YOU ANYWHERE YOU\'VE BEEN. YOUR CAR STAYS PUT.');
 if(!C.inTown()){el('div','phR','ONLY IN COZYTOWN');return}if(C.W.st){el('div','phR','"NOT WITH THE OLD BILL ON YOUR TAIL, MATE."');return}
 const p=C.LAST,L=[{n:'HOME',x:HM.x,z:HM.z}];if(PH.way)L.push({n:'WAYPOINT: '+PH.way.n,x:PH.way.x,z:PH.way.z});for(const q of T.pois)if(q.d)L.push(q);
 for(const q of L){const d=Math.hypot(q.x-p.x,q.z-p.z);if(d<60)continue;const f=Math.round(4+d/90),r=el('div','phR');el('div',null,q.n,r);btn(el('div','bt',null,r),'£'+f+' · '+Math.round(d)+'M',()=>{if(cash<f)return toast('NOT ENOUGH CASH');cash-=f;try{phClose()}catch(e){czErr(e,"crime_jobs.js")}
  setTimeout(()=>fade(()=>{if(!GS.onFoot){GS.onFoot=1;man.visible=true;setLabels()}let x=q.x,z=q.z;const r2=roadNear(x,z);if(r2.s){x=r2.q.px;z=r2.q.pz;const nx=-r2.s.dz,nz=r2.s.dx;x+=nx*(RW+1);z+=nz*(RW+1)}P.x=x;P.z=z;GT+=d/2400;toast('🚕 HERE YOU ARE, '+q.n+'. CHEERS!')}),200)})}}});
{const j0=phJobs;phJobs=function(){const L=j0();if(TP.x)L.push({n:'BIG TERRY\'S JOBS',pay:'£££ · ILLEGAL',info:'Ask around the back of the Railway Tavern. Smuggling, cars to order and worse.',pos:{x:TP.x,z:TP.z},st:CJ.job?'ON A JOB: '+CJ.job.n:''});L.push({n:'TRAIN TRIPS',pay:'£3 A TICKET',info:'Three stations: Central, Westbrook Halt and Eastfield.',pos:{x:T.stations[0].door[0],z:T.stations[0].door[1]},st:''});return L}}
window.CRIME2={CJ,startJob,failJob,JOBS,TP,SECRETS,FARM,CHOP,brag,vault,mailVan,rummage,EVT};
})();
