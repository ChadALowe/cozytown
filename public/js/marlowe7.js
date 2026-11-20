/* ===== MARLOWE NIGHTLIFE & LIFE: street racing, city radio + soundscape, buyable Marlowe businesses, events, bus passengers.
   All cheap on the frame rate: racers, crowds and stalls only exist near you and only while they're on. ===== */
(function(){
const MW=window.MARLOWE,M=MW.M,{OX,OZ,NS,EW,CITY,KH}=MW,Y=G0,W=(u,v)=>[OX+u,OZ+v],TAU=Math.PI*2;
const inM=()=>{const p=GS.onFoot?P:GS;return M.built&&!GS.inside&&MW.inReg(p.x,p.z)};
const pk=a=>a[(Math.random()*a.length)|0];
const night=()=>GT>=20||GT<4;
const people=[];function person(seed,u,v,face,o){const g=mkPerson(pSpec(seed,Object.assign({scarf:null,bp:false,bag:0,old:false},o||{})),mObj,scene),p=W(u,v);g.position.set(p[0],MW.mh(u,v)>Y?Y+KH:Y,p[1]);g.rotation.y=face||0;g.scale.setScalar(.95);people.push(g);return g}
function drop(g){if(!g)return;scene.remove(g);g.traverse(o=>{if(o.geometry)o.geometry.dispose()});const i=people.indexOf(g);if(i>=0)people.splice(i,1)}
/* ================================================================== STREET RACING (20:00 - 04:00, under the Airport Way bridge) */
const MEET={u:-787.6,v:-240},GRID=[[-779,-262],[-785,-262],[-779,-272],[-785,-272]];
const ROUTES=[{n:'RIVER LOOP',d:'BOTH BRIDGES, ALONG THE EMBANKMENTS',cp:[[-782,-90],[-782,240],[-678,240],[-678,-200],[-782,-200],[-782,-150]]},
 {n:'OLD TOWN SPRINT',d:'TIGHT CORNERS ROUND THE OLD TOWN',cp:[[-782,-90],[-870,-90],[-870,350],[-1050,350],[-1050,-300],[-870,-300],[-782,-300]]},
 {n:'GRAND TOUR',d:'THE LONG ONE: DOWNTOWN AND WESTBANK',cp:[[-782,240],[-520,240],[-520,790],[-782,790],[-1140,790],[-1140,-90],[-782,-90],[-782,-200]]}];
const RACER=[['"TURBO" TERRY',[.9,.2,.9],27],['NIKKI NEON',[.2,.9,.9],28],['BIG SAL',[.95,.7,.1],26]];
const RC={on:0,best:{}};{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.rc=RC.best;return o};cozyLoad=function(z){l0(z);if(z&&z.rc)RC.best=z.rc}}
let meet=null;
function meetBuild(){meet={g:[],cars:[]};RACER.forEach(([n,c],i)=>{const m=MCARMESH(c,[1,1,1]);const p=W(-787.2,-252-i*8);m.position.set(p[0],Y+.02,p[1]);scene.add(m);meet.cars.push(m);meet.g.push(person(5900+i*3,-789.8,-250-i*8,Math.PI/2))});
 const s=new THREE.Mesh(new THREE.PlaneGeometry(.8,.35),new THREE.MeshBasicMaterial({color:0xff40ff}));meet.glow=s}
function meetClear(){if(!meet)return;for(const m of meet.cars)scene.remove(m);for(const g of meet.g)drop(g);meet=null}
function buildPath(cps){const pts=[[GRID[0][0]+3,GRID[0][1]]];let cur=[-782,-262];for(const c of cps){const r=SATNAV.route(cur[0],cur[1],c[0],c[1])||[cur,c];for(let i=1;i<r.length;i++){const q=r[i],l=pts[pts.length-1];if(Math.hypot(q[0]-l[0],q[1]-l[1])>1)pts.push(q)}cur=c}
 const S=[0];for(let i=1;i<pts.length;i++)S.push(S[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
 const vc=pts.map((p,i)=>{if(i===0||i===pts.length-1)return 30;const a=Math.atan2(p[0]-pts[i-1][0],p[1]-pts[i-1][1]),b=Math.atan2(pts[i+1][0]-p[0],pts[i+1][1]-p[1]),d=Math.abs(Math.atan2(Math.sin(b-a),Math.cos(b-a)));return d>1?11:d>.4?18:30});return{pts,S,vc,L:S[S.length-1]}}
function at(P_,s){const{pts,S}=P_;let i=1;while(i<S.length-1&&S[i]<s)i++;const t=Math.max(0,Math.min(1,(s-S[i-1])/((S[i]-S[i-1])||1))),a=pts[i-1],b=pts[i];return{u:a[0]+(b[0]-a[0])*t,v:a[1]+(b[1]-a[1])*t,psi:Math.atan2(b[0]-a[0],b[1]-a[1]),i}}
function vlim(P_,s,vmax){let v=vmax;for(let i=1;i<P_.S.length;i++){const d=P_.S[i]-s;if(d<0)continue;if(d>160)break;v=Math.min(v,Math.sqrt(P_.vc[i]*P_.vc[i]+2*9*d))}return v}
let race=null,cpMark=null;
function raceMenu(){CUSTOM_SHOP.race=function(msg){$('shT').textContent='🏁 STREET RACE';$('shMsg').textContent=msg||'"Fancy your chances? Pick a route and put your money down. Winner takes three times the bet." · CASH £'+Math.round(cash);
  ROUTES.forEach((r,ri)=>{const b=RC.best[r.n];dRow(r.n+' · '+r.d+(b?' · BEST '+b.toFixed(1)+'s':''),[50,100,250].map(bet=>['£'+bet,()=>{if(cash<bet)return renderShop('NOT ENOUGH CASH FOR THAT BET');cash-=bet;closeShop();raceSetup(ri,bet)}]))});dRow('',[['BACK',()=>closeShop()]])};openShop('race')}
function raceSetup(ri,bet){const R=ROUTES[ri];race={ri,bet,R,st:'wait',path:buildPath(R.cp),cpI:0,t:0,cd:3.2,fin:[],rivals:[]};toast('GET IN YOUR CAR AND LINE UP ON THE GRID!');beep(660,.15,'square',.05)}
function raceStart(){const r=race;r.st='count';const g=W(GRID[0][0],GRID[0][1]);GS.x=g[0];GS.z=g[1];GS.psi=0;GS.vx=GS.vz=0;GS.speed=0;camAng=0;
 RACER.forEach(([n,c,vm],i)=>{const m=meet&&meet.cars[i]?meet.cars[i]:MCARMESH(c,[1,1,1]);if(!m.parent)scene.add(m);const gp=GRID[i+1];r.rivals.push({n,m,s:0,v:0,vm:vm*.92+Math.random()*1.5,lat:[2.6,-2.8,0][i],off:Math.hypot(gp[0]-GRID[0][0],gp[1]-GRID[0][1])*-1,gu:gp[0],gv:gp[1],done:0})});if(meet)meet.cars=[];
 if(!cpMark){cpMark=new THREE.Group();for(const s of[-1,1]){const p=new THREE.Mesh(new THREE.BoxGeometry(.3,5,.3),new THREE.MeshBasicMaterial({color:0xff40ff,fog:false}));p.position.set(s*6,2.5,0);cpMark.add(p)}const b=new THREE.Mesh(new THREE.PlaneGeometry(12,1.2),new THREE.MeshBasicMaterial({color:0xff40ff,transparent:true,opacity:.75,side:THREE.DoubleSide,fog:false}));b.position.y=5;cpMark.add(b);scene.add(cpMark)}cpMark.visible=true;placeCp()}
function placeCp(){const r=race,c=r.R.cp[r.cpI],p=W(c[0],c[1]);cpMark.position.set(p[0],Y,p[1]);const prev=r.cpI?r.R.cp[r.cpI-1]:[-782,-262];cpMark.rotation.y=Math.atan2(c[0]-prev[0],c[1]-prev[1]);PH.way={x:p[0],z:p[1],n:r.cpI===r.R.cp.length-1?'FINISH':'CHECKPOINT '+(r.cpI+1)+'/'+r.R.cp.length,keep:1};phWay()}
function raceEnd(dnf){const r=race;if(!r)return;for(const q of r.rivals)scene.remove(q.m);if(cpMark)cpMark.visible=false;if(PH.way&&PH.way.keep){PH.way=null;phWay()}race=null;
 if(dnf){toast('🏁 RACE ABANDONED. YOU LOST YOUR £'+r.bet+' BET');return}
 const pos=r.fin.indexOf('YOU')+1,won=pos===1?r.bet*3:pos===2?r.bet:0;cash+=won;
 const tm=r.t,b=RC.best[r.R.n];if(pos===1&&(!b||tm<b))RC.best[r.R.n]=+tm.toFixed(1);if(window.REP)REP.add('police',-1);
 toast('🏁 YOU FINISHED '+['1ST! 🏆','2ND','3RD','4TH'][pos-1]+' · '+tm.toFixed(1)+'s'+(won?' · WON £'+won:' · BET LOST'));if(pos===1){for(let i=0;i<5;i++)setTimeout(()=>beep(523+i*131,.12,'square',.05),i*110)}
 try{if(pos===1)phText(pk(RACER)[0],pk(['"Beginner\'s luck. Rematch tomorrow night."','"Respect. You can drive."','"Where did you learn to corner like that?!"']))}catch(e){}}
function raceTick(dt){const r=race;if(!r)return'';const p=GS;
 if(r.st==='wait'){if(!GS.onFoot&&Math.hypot(GS.x-OX-MEET.u,GS.z-OZ-MEET.v)<45&&!GS.inside){raceStart()}return '🏁 GET IN YOUR CAR AT THE MEET UNDER THE BRIDGE'}
 if(r.st==='count'){r.cd-=dt;GS.vx=GS.vz=0;GS.speed=0;const c=Math.ceil(r.cd);if(c!==r._c){r._c=c;beep(c>0?440:880,.18,'square',.06)}for(const q of r.rivals){const pp=W(q.gu,q.gv);q.m.position.set(pp[0],Y+.02,pp[1]);q.m.rotation.y=0}if(r.cd<=0){r.st='go';toast('GO GO GO!')}return '🏁 '+r.R.n+' · '+(c>0?c:'GO!')}
 r.t+=dt;const cp=r.R.cp[r.cpI],cw=W(cp[0],cp[1]);if(Math.hypot(GS.x-cw[0],GS.z-cw[1])<14){r.cpI++;beep(988,.08,'square',.05);if(r.cpI>=r.R.cp.length){r.fin.push('YOU');for(const q of r.rivals)if(!q.done){q.done=1}raceEnd();return ''}placeCp()}
 /* player progress along the path (for rubber banding + positions) */let pp=0,bd=1e9;for(let s=0;s<r.path.L;s+=8){const a=at(r.path,s),w=W(a.u,a.v),d=Math.hypot(w[0]-GS.x,w[1]-GS.z);if(d<bd){bd=d;pp=s}}
 for(const q of r.rivals){if(q.done)continue;const lead=pp-q.s,band=lead>60?3.5:lead<-120?-3:0;const vt=Math.min(vlim(r.path,q.s,q.vm),q.vm)+band;q.v+=Math.max(-12*dt,Math.min(6*dt,vt-q.v));q.s+=q.v*dt;
  if(q.s>=r.path.L){q.done=1;r.fin.push(q.n);toast(q.n+' CROSSED THE LINE!')}const a=at(r.path,Math.min(q.s,r.path.L-.1)),cx=Math.cos(a.psi),sx=-Math.sin(a.psi);let u=a.u+cx*q.lat,v=a.v+sx*q.lat;
  if(q.s<12){const f=q.s/12;u=q.gu+(u-q.gu)*f;v=q.gv+(v-q.gv)*f}const w=W(u,v);q.m.position.set(w[0],Y+.02,w[1]);let da=a.psi-q.m.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));q.m.rotation.y+=da*Math.min(1,dt*6);q.x=w[0];q.z=w[1];RUNBUMP(q)}
 const ahead=r.rivals.filter(q=>q.s>pp||q.done).length;if(GS.onFoot||bd>420){r.away=(r.away||0)+dt;if(r.away>15)raceEnd(true)}else r.away=0;
 return '🏁 '+r.R.n+' · '+['1ST','2ND','3RD','4TH'][ahead]+' · CHECKPOINT '+(r.cpI+1)+'/'+r.R.cp.length+' · '+r.t.toFixed(1)+'s'}
const raceHud=(()=>{const e=document.createElement('div');e.style.cssText='position:fixed;left:50%;top:74px;transform:translateX(-50%);z-index:25;background:rgba(40,4,40,.88);border:2px solid #ff40ff;border-radius:12px;color:#fff;font:bold 13px ui-monospace,monospace;padding:5px 12px;display:none;pointer-events:none';document.body.appendChild(e);return e})();
/* ================================================================== CITY RADIO + SOUNDSCAPE */
const ST_=[['📻 OFF'],['MARLOWE FM 101.4','pop'],['SMOOTH JAZZ 88.4','jazz'],['CLASSIC MARLOWE 96','classic'],['TALK MARLOWE 1152','talk']];
const RADIO={i:1,step:0,t:0,dj:25,sub:null,subT:0};
const radBtn=(()=>{const b=document.createElement('button');b.style.cssText='position:fixed;left:12px;top:160px;z-index:26;font:bold 12px ui-monospace,monospace;border:2px solid #f5e6a0;border-radius:10px;background:#1b2a3add;color:#fff;padding:6px 10px;display:none;touch-action:manipulation';b.onclick=e=>{e.stopPropagation();RADIO.i=(RADIO.i+1)%ST_.length;RADIO.step=0;RADIO.dj=4;b.textContent='📻 '+ST_[RADIO.i][0];toast(RADIO.i?'📻 '+ST_[RADIO.i][0]:'RADIO OFF')};document.body.appendChild(b);b.textContent='📻 '+ST_[1][0];return b})();
const subEl=(()=>{const e=document.createElement('div');e.style.cssText='position:fixed;left:50%;bottom:120px;transform:translateX(-50%);z-index:26;background:rgba(0,0,0,.7);color:#ffe9a8;font:bold 13px ui-monospace,monospace;padding:6px 12px;border-radius:10px;max-width:86vw;text-align:center;display:none;pointer-events:none';document.body.appendChild(e);return e})();
const radioOn=()=>RADIO.i>0&&!GS.onFoot&&inM()&&snd;
const N=n=>440*Math.pow(2,(n-69)/12);
function djLine(){const L=[],P5=window.MARLOWE5&&MARLOWE5.PASS,F=window.MARLOWE6&&MARLOWE6.MAF,Rp=window.REP,star=(CR.mstar||[]).slice(-20);const avg=star.length?star.reduce((a,b)=>a+b,0)/star.length:0;
 if(avg)L.push(avg>=4.5?'Shout out to the cabbie with a '+avg.toFixed(1)+' star rating. Smoothest rides in Marlowe!':'Cab passengers say the city\'s newest driver is a bit... bumpy. '+avg.toFixed(1)+' stars, ouch.');
 if(P5&&Object.keys(P5.st).length)L.push(Object.keys(P5.st).length>=5?'Our listener has done EVERYTHING in Marlowe. The Tourist Board is in love.':'Tourists are ticking off the Marlowe Passport. Have you ridden the Eye yet?');
 if(P5&&P5.best)L.push('Word on the river is someone did the Marle speedboat run in '+P5.best+' seconds!');
 if(F&&F.busts)L.push('Police report another arrest on South Quay. Something about... olive oil?');
 if(F&&F.ch>=3)L.push('Rumours of a turf war down at the docks. Stay safe out there, Marlowe.');
 if(F&&F.end==='don')L.push('They say Marlowe has a new Don. We\'re not saying anything. Lovely weather though.');
 if(window.MPOLICE&&MPOLICE.POL.arrests)L.push('Marlowe Police have made '+MPOLICE.POL.arrests+' arrests thanks to their newest officer. Drive safe!');
 if(Object.keys(RC.best).length)L.push('Street racers were spotted under the Airport Way bridge again last night. The police are NOT amused.');
 if(Rp&&Rp.get('serpents')<20)L.push('The Serpents gang has gone very quiet lately. Somebody upset them.');
 L.push(GT>=20||GT<5?'It\'s late in Marlowe. Keep those headlights on and the volume up.':'Traffic is moving nicely on King\'s Avenue this '+(GT<12?'morning':'afternoon')+'.','Don\'t forget: Saturday market in Market Square, eight till four!','Concert at the Marlowe Arena this Friday and Saturday night. Tickets at the door!','Next up, more music. You\'re listening to '+ST_[RADIO.i][0]+'.');
 return pk(L)}
function sub(txt,secs){subEl.textContent=txt;subEl.style.display='block';RADIO.subT=secs||6}
const PROG={pop:[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],jazz:[[62,65,69,72],[55,59,62,65],[60,64,67,71],[57,60,64,67]],classic:[[60,64,67],[57,60,64],[53,57,60],[55,59,62]]};
function radioTick(dt){const s=ST_[RADIO.i][1];RADIO.dj-=dt;if(RADIO.dj<=0){RADIO.dj=s==='talk'?12:45+Math.random()*20;sub('📻 '+ST_[RADIO.i][0]+': "'+djLine()+'"',s==='talk'?9:7);RADIO.talk=s==='talk'?8:2.5}
 if(RADIO.talk>0){RADIO.talk-=dt;RADIO.t-=dt;if(RADIO.t<=0){RADIO.t=.09+Math.random()*.08;beep(180+Math.random()*160,.07,'square',.012)}if(s==='talk'||RADIO.talk>0&&s!=='talk')return}
 if(s==='talk')return;const bpm=s==='pop'?118:s==='jazz'?96:70,stp=60/bpm/2;RADIO.t-=dt;if(RADIO.t>0)return;const st=RADIO.step++,swing=s==='jazz'&&st%2?stp*.35:0;RADIO.t=stp+(s==='jazz'?(st%2?-stp*.35:stp*.35):0);
 const bar=Math.floor(st/8)%4,ch=PROG[s][bar],b8=st%8;
 if(s==='pop'){if(b8%2===0)beep(N(ch[0]-24),.22,'triangle',.03);beep(N(ch[b8%3]+12),.12,'square',.012);if(b8%4===2)beep(3200,.03,'square',.006);if(b8===0||b8===4)beep(70,.12,'sine',.05)}
 else if(s==='jazz'){if(b8%2===0)beep(N(ch[(b8/2)%4]-24),.3,'triangle',.032);if(b8===0)for(const n of ch)beep(N(n),.5,'triangle',.008);if(Math.random()<.3)beep(N(ch[(Math.random()*4)|0]+12+(Math.random()<.5?2:0)),.25,'sawtooth',.008);if(b8%2===1)beep(5000,.02,'square',.004)}
 else{if(b8===0)for(const n of ch)beep(N(n),1.6,'triangle',.012);if(b8%2===0)beep(N(ch[(b8/2)%3]+12),.6,'sine',.014)}}
{const m0=updMusic;updMusic=function(dt){if(radioOn())return;m0(dt)}}
let amb=4;function ambient(dt){amb-=dt;if(amb>0)return;amb=2.5+Math.random()*5;if(!inM()||!snd||!AC)return;const r=Math.random(),p=GS.onFoot?P:GS;
 if(r<.18){for(let i=0;i<6;i++)setTimeout(()=>beep(i%2?950:700,.3,'triangle',.008),i*320)}
 else if(r<.42){beep(420,.12,'square',.012);setTimeout(()=>beep(420,.2,'square',.012),160)}
 else if(r<.62&&GS.onFoot){for(let i=0;i<3;i++)setTimeout(()=>beep(500+i*25,.12,'sine',.01),i*180)}
 else if(r<.74)beep(1900,.35,'sawtooth',.004);
 else if(r<.9&&GS.onFoot){for(let i=0;i<4;i++)setTimeout(()=>beep(140+Math.random()*90,.4,'triangle',.006),i*120)}}
let lastBell=-1;function bells(){const h=Math.floor(GT);if(h===lastBell||GT-h>.05)return;lastBell=h;if(!inM())return;const c=CITY.poi.find(p=>/CATHEDRAL/.test(p.n)),p=GS.onFoot?P:GS;if(!c||Math.hypot(p.x-OX-c.u,p.z-OZ-c.v)>450)return;const n=h%12||12;for(let i=0;i<n;i++)setTimeout(()=>beep(196,1.2,'sine',.04),i*1300)}
/* ================================================================== MARLOWE BUSINESSES (joins the BUSINESSES phone app) */
Object.assign(BZD,{'THE COFFEE HOUSE':{p:12000,c:140,s:5,cost:.35,ic:'☕'},'MARLOWE FISH BAR':{p:10000,c:110,s:7,cost:.4,ic:'🐟'},'SUSHI BAR':{p:16000,c:80,s:14,cost:.45,ic:'🍣'},'BURGER BAR':{p:14000,c:130,s:8,cost:.42,ic:'🍔'},
 'THE TEA ROOM':{p:8000,c:70,s:6,cost:.35,ic:'🫖'},'THE CROWN':{p:22000,c:150,s:9,cost:.4,ic:'🍺'},'NOODLE HOUSE':{p:12000,c:100,s:9,cost:.4,ic:'🍜'},
 'BUDGET BEDS':{p:30000,c:30,s:25,cost:.45,ic:'🛏'},'RIVERSIDE INN':{p:60000,c:26,s:55,cost:.45,ic:'🏨'},'THE GRAND MARLOWE':{p:180000,c:20,s:120,cost:.5,ic:'🏰'}});
/* ================================================================== EVENTS: SATURDAY MARKET + ARENA CONCERTS */
const sq=MW.BLK.find(b=>b.sp==='square'),SQ={u:(sq.u0+sq.u1)/2,v:(sq.v0+sq.v1)/2},ar=MW.BLK.find(b=>b.sp==='arena'),AR={u:(ar.u0+4.5+ar.u1-6)/2,v:914};
const marketOn=()=>dow()===5&&GT>=8&&GT<16,concertOn=()=>(dow()===4||dow()===5)&&GT>=19&&GT<23.5;
let mk=null,cc=null,told={};
function marketTick(){const p=GS.onFoot?P:GS,near=inM()&&Math.hypot(p.x-OX-SQ.u,p.z-OZ-SQ.v)<170;if(marketOn()&&near){if(!mk){mk=[];for(let i=0;i<8;i++){const a=i/8*TAU,g=person(6400+i*9,SQ.u+Math.cos(a)*14,SQ.v+Math.sin(a)*22,a+Math.PI,{bag:i%2});g.userData.a=a;mk.push(g)}}const t=performance.now()/1000;mk.forEach((g,i)=>{const a=g.userData.a+t*.05*(i%2?1:-1),w=W(SQ.u+Math.cos(a)*14,SQ.v+Math.sin(a)*22);g.position.x=w[0];g.position.z=w[1];g.rotation.y=a+(i%2?Math.PI:0);const s=Math.sin(t*6+i)*.4;if(g.l1){g.l1.rotation.x=s;g.l2.rotation.x=-s}})}
 else if(mk){mk.forEach(drop);mk=null}
 if(marketOn()&&!told.m&&inM()){told.m=DAY;try{phText('MARLOWE EVENTS','Saturday Market is on in Market Square (by the cathedral) until 4pm. Fresh fruit, cheese, flowers!',true)}catch(e){}}if(!marketOn()&&told.m&&told.m!==DAY)told.m=0}
const BANDS=['THE MARLE TIDES','NEON PIGEONS','DJ CIRCUS','THE VELVET OLIVES','SKY TOWER SOUND SYSTEM'];
function concertTick(dt){const p=GS.onFoot?P:GS,d=Math.hypot(p.x-OX-AR.u,p.z-OZ-AR.v),near=inM()&&d<260;
 if(concertOn()&&near){if(!cc){cc={q:[],beams:[],t:0};for(let i=0;i<10;i++)cc.q.push(person(6600+i*7,AR.u-12+i*2.6,AR.v-2.6-(i%2)*1.2,0,{bag:0}));for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.ConeGeometry(5,60,12,1,true),new THREE.MeshBasicMaterial({color:[0xff40ff,0x40e0ff,0xffe040][i],transparent:true,opacity:.12,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide,fog:false}));const w=W(AR.u-30+i*30,AR.v+46);m.position.set(w[0],Y+50,w[1]);scene.add(m);cc.beams.push(m)}}
  cc.t+=dt;cc.beams.forEach((m,i)=>{m.rotation.z=Math.sin(cc.t*.7+i*2)*.5;m.rotation.x=Math.cos(cc.t*.5+i)*.35});cc.q.forEach((g,i)=>{g.position.y=Y+KH+Math.abs(Math.sin(cc.t*5+i))*.08});if(snd&&d<220&&!radioOn()){cc.th=(cc.th||0)-dt;if(cc.th<=0){cc.th=.5;beep(55,.18,'sine',.06*(1-d/220))}}}
 else if(cc){cc.q.forEach(drop);cc.beams.forEach(m=>scene.remove(m));cc=null}
 if(concertOn()&&!told.c&&inM()){told.c=DAY;try{phText('MARLOWE ARENA','Tonight at the Arena: '+BANDS[DAY%BANDS.length]+'! Doors 7pm. Tickets £35 at the south entrance.',true)}catch(e){}}if(!concertOn()&&told.c&&told.c!==DAY)told.c=0}
function concertShow(){if(cash<35){toast('TICKETS ARE £35');return}cash-=35;if(window.M8)M8.hook('gig');busy=1;const band=BANDS[DAY%BANDS.length];const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:85;display:flex;flex-direction:column;align-items:center;justify-content:center;font:bold 22px ui-monospace,monospace;color:#fff;text-align:center;transition:background .2s';document.body.appendChild(ov);
 const h=document.createElement('div');h.style.cssText='font-size:40px;letter-spacing:.1em;text-shadow:0 0 20px #fff';h.textContent=band;const s2=document.createElement('div');s2.style.marginTop='14px';ov.append(h,s2);
 const lines=['THE LIGHTS GO DOWN…','THE CROWD ROARS!','♪ ♫ ♪ ♫','EVERYONE IS SINGING ALONG!','ENCORE! ENCORE!','WHAT A NIGHT!'],cols=['#2a0a3a','#ff40ff','#40e0ff','#ffe040','#ff4040','#40ff80'];let k=0;const prog=PROG.pop;
 const iv=setInterval(()=>{k++;ov.style.background=cols[k%cols.length]+'dd';s2.textContent=lines[Math.min(lines.length-1,Math.floor(k/6))];const ch=prog[Math.floor(k/4)%4];if(snd)for(const n of ch)beep(N(n+(k%2?12:0)),.3,'square',.02);beep(60,.15,'sine',.08);
  if(k>36){clearInterval(iv);ov.remove();busy=0;GT+=2.5;if(GT>=24){GT-=24;newDay()}const b=hband();todI=b;applyTOD(b);HN.en=Math.max(5,HN.en-12);if(window.REP)REP.add('tourist',3);toast('WHAT A SHOW! '+band+' WAS AMAZING')}},260)}
const STALL=[['A BAG OF APPLES',2,14,4],['FRESH STRAWBERRIES',3,12,6],['CHEESE WEDGE',4,26,2],['WARM PASTY',4,40,4],['HOT DONUTS',3,24,8],['FLOWERS FOR HOME',5,0,0]];
CUSTOM_SHOP.market=function(msg){$('shT').textContent='🧺 SATURDAY MARKET';$('shMsg').textContent=msg||'STALLS UNTIL 4PM · CASH £'+Math.round(cash);for(const[n,pr,h,e]of STALL)dRow(n+(h?'  FOOD +'+h:'')+(e?'  ENERGY +'+e:''),[['£'+pr,()=>{if(cash<pr)return renderShop('NOT ENOUGH CASH');cash-=pr;if(h||e)fed(h,e,n+'! (-£'+pr+')');else toast('LOVELY FLOWERS (-£'+pr+')');renderShop('THANK YOU, LOVE!')}]]);dRow('',[['BACK',()=>closeShop()]])};
/* ================================================================== BUS PASSENGERS */
const waiting=new Map();let busSeen=new Set();
function pave(s){for(const[du,dv]of[[0,4.4],[0,-4.4],[4.4,0],[-4.4,0]])if(MW.mh(s.u+du,s.v+dv)>Y)return[s.u+du,s.v+dv,Math.atan2(-du,-dv)];return null}
function busTick(dt){const p=GS.onFoot?P:GS;if(!inM()){for(const[s,a]of waiting){a.forEach(drop)}waiting.clear();return}
 const near=CITY.stops.map(s=>({s,d:Math.hypot(p.x-OX-s.u,p.z-OZ-s.v)})).filter(o=>o.d<110).sort((a,b)=>a.d-b.d).slice(0,3).map(o=>o.s);
 for(const[s,a]of waiting)if(!near.includes(s)){a.forEach(drop);waiting.delete(s)}
 for(const s of near)if(!waiting.has(s)){const pv=pave(s);if(!pv){waiting.set(s,[]);continue}const n=1+(Math.random()<.5?1:0),a=[];for(let i=0;i<n;i++)a.push(person(7300+((s.u*7+s.v)|0)%500+i,pv[0]+(i?1.1:-.6),pv[1]+(i?.4:-.3),pv[2]));waiting.set(s,a)}
 const C=window.MARLOWE2&&MARLOWE2.CARS;if(!C)return;for(const c of C){if(!c.on||!c.bus)continue;if(!(c.stop>0)){busSeen.delete(c);continue}if(busSeen.has(c))continue;busSeen.add(c);
  for(const s of near){if(Math.hypot(c.x-OX-s.u,c.z-OZ-s.v)>9)continue;const a=waiting.get(s)||[];for(const g of a){const sx=g.position.x,sz=g.position.z,tx=c.x+Math.cos(c.psi)*1.4,tz=c.z-Math.sin(c.psi)*1.4;walkers.push({g,sx,sz,tx,tz,t:0,T:1.8,rm:1})}waiting.set(s,[]);
   if(Math.random()<.6){const pv=pave(s);if(pv){const g=person(7900+((Math.random()*400)|0),c.x-OX+Math.cos(c.psi)*1.4,c.z-OZ-Math.sin(c.psi)*1.4,0);const w=W(pv[0],pv[1]);walkers.push({g,sx:g.position.x,sz:g.position.z,tx:w[0]+Math.random()*4-2,tz:w[1]+Math.random()*4-2,t:0,T:2.4,rm:1,late:3})}}}}}
const walkers=[];function walkTick(dt){for(let i=walkers.length-1;i>=0;i--){const w=walkers[i];w.t+=dt;const f=Math.min(1,w.t/w.T),g=w.g;g.position.x=w.sx+(w.tx-w.sx)*f;g.position.z=w.sz+(w.tz-w.sz)*f;g.rotation.y=Math.atan2(w.tx-w.sx,w.tz-w.sz);const s=Math.sin(w.t*8)*.5;if(g.l1){g.l1.rotation.x=s;g.l2.rotation.x=-s}if(w.t>=w.T+(w.late||0)){walkers.splice(i,1);drop(g)}}}
/* ================================================================== the use button + tick */
{const c0=ctx;ctx=function(){const b=c0();if(!inM()||!GS.onFoot)return b;const d=(u,v)=>Math.hypot(P.x-OX-u,P.z-OZ-v);
 if(d(MEET.u,MEET.v)<3.2)return night()?{label:race?'STREET RACE: GET IN YOUR CAR':'STREET RACE (BET £50+)',fn:()=>{if(race){toast('GET IN YOUR CAR AND LINE UP');return}if(SH){toast('FINISH YOUR '+CDEF[SH.k].n+' SHIFT FIRST');return}raceMenu()}}:{label:'THE RACERS MEET HERE AFTER 8PM',fn:()=>toast('COME BACK AFTER DARK (8PM - 4AM)')};
 if(marketOn()&&d(SQ.u,SQ.v)<26)return{label:'BROWSE THE SATURDAY MARKET',fn:()=>openShop('market')};
 if(concertOn()&&d(AR.u,AR.v)<6)return{label:'BUY A CONCERT TICKET £35',fn:concertShow};return b}}
CITY.poi.push({n:'STREET RACING (AFTER 8PM)',u:MEET.u,v:MEET.v,ic:'🏁'});
{const u0=updCozy;updCozy=function(dt){u0(dt);
 const show=!GS.onFoot&&inM()&&!menuOpen;radBtn.style.display=show?'block':'none';if(radioOn())radioTick(dt);if(RADIO.subT>0){RADIO.subT-=dt;if(RADIO.subT<=0||!show)subEl.style.display='none'}
 ambient(dt);bells();walkTick(dt);busTick(dt);marketTick();concertTick(dt);
 if(night()&&inM()&&Math.hypot((GS.onFoot?P:GS).x-OX-MEET.u,(GS.onFoot?P:GS).z-OZ-MEET.v)<200&&!race){if(!meet)meetBuild()}else if(meet&&!race)meetClear();
 if(race){const l=raceTick(dt);raceHud.style.display=l&&!menuOpen?'block':'none';raceHud.textContent=l}else raceHud.style.display='none'}}
window.MARLOWE7={RC,ROUTES,RADIO,get race(){return race},raceSetup,raceEnd,concertShow,marketOn,concertOn,SQ,AR,MEET,djLine,waiting};
})();
