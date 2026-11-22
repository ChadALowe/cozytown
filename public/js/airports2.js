/* ---- THREE DIFFERENT AIRPORTS ----
   COZY AIRWAYS (the village airfield): a country flying club. Wooden clubhouse, a tea hatch, propellers and maps,
      a flight-sim lesson and a plane-spotting window with a logbook.
   MARLOWE AIRPORT: big and modern. Pale glass hall, a baggage carousel, and a security scanner you can work a shift on.
   SUNHAVEN AIRPORT: open-air and tropical. Palms, a thatched canopy, a tiki bar, surfboard hire and a beach-cart reclaim. ---- */
(function(){
if(typeof buildShop!=='function'||!window.PUBG)return;
const G=window.PUBG,gameOv=G.gameOv,B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex)),rnd=(a,b)=>a+Math.random()*(b-a),ri=n=>Math.floor(Math.random()*n),pk=a=>a[ri(a.length)];
const bp=(f,d,t,v)=>{try{beep(f,d,t||'square',v||.05)}catch(e){}};
const AP2={log:{},lessons:0,best:0,shifts:0,surf:0};window.AIRPORTS2=AP2;
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.ap2=AP2;return o};cozyLoad=function(z){l0(z);if(z&&z.ap2)Object.assign(AP2,z.ap2,{log:Object.assign({},z.ap2.log||{})})}}
const ia=(x0,x1,z0,z1,label,fn)=>IA.push({r:[x0,x1,z0,z1],label,fn});const blk=(x0,x1,z0,z1)=>IROOM.push([x0,x1,z0,z1]);
const tex=(w,h,fn)=>{const f=cvT(w,h),g=f.cv.getContext('2d');fn(g,w,h);f.tx.needsUpdate=true;return f.tx};
const feed=(f,e,msg)=>{if(typeof fed==='function')fed(f,e,msg);else{try{HN.food=Math.min(100,HN.food+f);HN.en=Math.min(100,HN.en+e)}catch(_){}toast(msg)}};
function restyle(wall,floor,floorCol){for(const o of SG.children){if(!o.geometry||o.geometry.type!=='PlaneGeometry')continue;const p=o.geometry.parameters;
 if(p.width>=20&&p.height>=10&&o.position.y<.05){if(floor)o.material=imat(FLR[floor]());if(floorCol!=null){o.material=o.material.clone();o.material.color.setHex(floorCol)}}
 else if(wall!=null&&p.height>3&&p.height<4&&p.width>=10&&o.material&&o.material.color)o.material.color.setHex(wall)}}
const wallPic=(x,y,z,w,h,t)=>sPlane(w,h,x+(x<0?.03:-.03),y,z,x<0?Math.PI/2:-Math.PI/2,t);
const menuOv=(title,bg,line,items)=>{const O=gameOv(title,{w:420,h:120,bg});O.msg(line);const g=O.g;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(0,0,420,120);g.fillStyle='#ffd870';g.font='bold 22px Georgia';g.textAlign='center';g.fillText(title,210,68);O.clear();
 for(const[n,p,f,e,msg]of items)O.btn(n+' · £'+p,()=>{if(cash<p)return O.msg('NOT ENOUGH CASH (£'+p+')');cash-=p;try{cashUI()}catch(_){}feed(f,e,msg+' (-£'+p+')');O.msg(msg)},'#2a5a6a');return O};

/* ================================================================== FLYING LESSON (side view: get the Cessna down on the runway) */
function lesson(){const W=600,H=360,O=gameOv('FLYING LESSON · COZY AIRFIELD',{w:W,h:H,bg:'rgba(10,20,34,.97)'}),g=O.g;let st=null;const K={up:0,dn:0,thr:0};
 function start(){if(cash<15)return O.msg('A lesson is £15.');cash-=15;try{cashUI()}catch(e){}st={x:0,alt:180,vs:0,spd:42,pitch:0,flare:0,done:0,wind:rnd(-1.5,1.5),t:0};O.clear();
  const up=O.btn('NOSE UP ▲',()=>{},'#2a5a8a'),dn=O.btn('NOSE DOWN ▼',()=>{},'#2a5a8a'),th=O.btn('POWER +',()=>{},'#6a4a1a'),tl=O.btn('POWER −',()=>{},'#6a4a1a');
  up.onpointerdown=()=>K.up=1;dn.onpointerdown=()=>K.dn=1;th.onpointerdown=()=>K.thr=1;tl.onpointerdown=()=>K.thr=-1;for(const b of[up,dn,th,tl])b.onpointerup=b.onpointerleave=()=>{K.up=K.dn=0;K.thr=0};
  O.msg('"Right, you have control. Keep your speed between 40 and 55 knots, and touch down gently on the runway." (arrow keys work too)')}
 const kd=e=>{if(e.key==='ArrowUp')K.up=1;if(e.key==='ArrowDown')K.dn=1;if(e.key==='ArrowRight')K.thr=1;if(e.key==='ArrowLeft')K.thr=-1},ku=e=>{if(e.key==='ArrowUp')K.up=0;if(e.key==='ArrowDown')K.dn=0;if(e.key==='ArrowRight'||e.key==='ArrowLeft')K.thr=0};
 addEventListener('keydown',kd);addEventListener('keyup',ku);O.onclose=()=>{removeEventListener('keydown',kd);removeEventListener('keyup',ku)};
 const RW0=1600,RW1=2300;
 O.loop(dt=>{if(st&&!st.done){st.t+=dt;st.pitch+=((K.up?1:0)-(K.dn?1:0))*dt*.9;st.pitch*=Math.pow(.6,dt);st.pitch=Math.max(-.35,Math.min(.35,st.pitch));
   st.spd+=(K.thr*9-st.pitch*28-(st.spd-45)*.15)*dt;st.vs=st.pitch*st.spd*2.1-(st.spd<38?(38-st.spd)*3:0)+Math.sin(st.t*1.3)*st.wind*4;st.alt+=st.vs*dt;st.x+=st.spd*dt*2.2;
   if(st.alt<=0){st.alt=0;st.done=1;const onRw=st.x>RW0&&st.x<RW1,soft=st.vs>-28,ok=onRw&&soft&&st.spd<60;const grade=ok?(st.vs>-12?'A SILKY LANDING':'A FIRM BUT FAIR LANDING'):!onRw?(st.x<RW0?'IN THE FIELD SHORT OF THE RUNWAY':'OFF THE END OF THE RUNWAY'):st.spd>=60?'TOO FAST: A BIG BOUNCE':'A HEAVY LANDING (THE INSTRUCTOR WINCES)';
    if(ok){AP2.lessons++;const sc=Math.round(100+st.vs*3-Math.abs(st.x-(RW0+250))/8);if(sc>AP2.best)AP2.best=sc;cash+=10;try{cashUI()}catch(e){}toast('✈ LESSON PASSED: '+grade+' · £10 BACK FOR A GOOD LANDING')}
    O.msg(grade+'. Touchdown '+Math.round(-st.vs)+' ft/min, '+Math.round(st.spd)+' knots. Lessons passed: '+AP2.lessons);O.clear();O.btn('ANOTHER LESSON (£15)',start,'#2a6a3a')}
   if(st.x>RW1+400&&st.alt>0){st.done=1;O.msg('You flew over the airfield! "Go round and try again."');O.clear();O.btn('ANOTHER LESSON (£15)',start,'#2a6a3a')}}
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#5a9ae0');gr.addColorStop(1,'#cfe6f8');g.fillStyle=gr;g.fillRect(0,0,W,H);
  const cam=st?st.x-140:0,gy=H-50;g.fillStyle='#4a8a3a';g.fillRect(0,gy,W,50);g.fillStyle='#555';g.fillRect(RW0-cam,gy,RW1-RW0,10);g.fillStyle='#fff';for(let x=RW0;x<RW1;x+=60)g.fillRect(x-cam,gy+4,30,2);
  for(let i=0;i<12;i++){const tx=((i*317)%2600)-cam*.6;g.fillStyle='#2f6a2a';g.beginPath();g.arc(((tx%W)+W)%W,gy,14,Math.PI,0);g.fill()}
  if(st){const y=gy-8-st.alt*1.1;g.save();g.translate(140,y);g.rotate(-st.pitch);g.fillStyle='#f4f4f0';g.fillRect(-24,-5,48,10);g.fillStyle='#d02a2a';g.fillRect(-26,-12,8,8);g.fillStyle='#e8e8e8';g.fillRect(-6,-9,22,4);g.fillStyle='#333';g.fillRect(22,-6,4,12);g.restore();
   g.fillStyle='rgba(0,0,0,.45)';g.fillRect(8,8,250,58);g.fillStyle='#fff';g.font='bold 13px monospace';g.textAlign='left';g.fillText('ALT '+Math.round(st.alt)+' FT   SPD '+Math.round(st.spd)+' KT',16,28);g.fillText('V/S '+Math.round(st.vs)+' FT/MIN',16,46);g.fillStyle=st.x<RW0?'#ffd040':'#40ff60';g.fillText(st.x<RW0?'RUNWAY IN '+Math.round((RW0-st.x)/2.2)+' M':'OVER THE RUNWAY',16,62)}
  else{g.fillStyle='#14223a';g.font='bold 22px Georgia';g.textAlign='center';g.fillText('COZY FLYING CLUB',W/2,140)}});
 O.msg('Your instructor, Wing Commander Pip, takes you up in the club Cessna. You fly the approach and landing. £15, with £10 back for a good landing.');O.clear();O.btn('START THE LESSON (£15)',start,'#2a6a3a')}

/* ================================================================== PLANE SPOTTING */
const TYPES=[['CESSNA 172','prop'],['PIPER CUB','prop'],['SPITFIRE','war'],['BOEING 737','jet'],['AIRBUS A320','jet'],['JUMBO 747','jumbo'],['AIR AMBULANCE','heli'],['HOT AIR BALLOON','balloon'],['RED ARROWS','arrows'],['CONCORDE (MUSEUM FLIGHT)','concorde']];
function spotting(){const W=600,H=300,O=gameOv('PLANE SPOTTING',{w:W,h:H,bg:'rgba(10,16,24,.97)'}),g=O.g;let cur=null,t=0,snapped=0;
 const next=()=>{const r=Math.random(),i=r<.25?0:r<.4?1:r<.55?3:r<.68?4:r<.78?6:r<.86?7:r<.92?5:r<.96?2:r<.985?8:9;cur={i,x:-80,y:rnd(50,170),sp:rnd(70,140)*(TYPES[i][1]==='jet'||TYPES[i][1]==='jumbo'||TYPES[i][1]==='concorde'?1.6:1),guess:0}};
 const show=()=>{O.clear();if(!cur)return;const opts=[cur.i];while(opts.length<3){const j=ri(TYPES.length);if(!opts.includes(j))opts.push(j)}opts.sort(()=>Math.random()-.5);for(const j of opts)O.btn(TYPES[j][0],()=>guess(j),'#2a4a6a')};
 function guess(j){if(!cur||cur.guess)return;cur.guess=1;if(j===cur.i){const nw=!AP2.log[TYPES[j][0]];AP2.log[TYPES[j][0]]=(AP2.log[TYPES[j][0]]|0)+1;bp(880,.08);O.msg('✅ Logged: '+TYPES[j][0]+(nw?' · NEW IN YOUR LOGBOOK!':'')+'  ('+Object.keys(AP2.log).length+'/'+TYPES.length+' types)');if(nw&&Object.keys(AP2.log).length===TYPES.length){cash+=100;try{cashUI();TOWNSHOPS.col['A FULL SPOTTER\'S LOGBOOK']=1}catch(e){}toast('📒 LOGBOOK COMPLETE! THE CLUB GIVES YOU £100')}}else{bp(200,.2,'sawtooth');O.msg('❌ Not quite. That was a '+TYPES[cur.i][0]+'.')}O.clear()}
 O.loop(dt=>{t+=dt;if(!cur||cur.x>W+100){next();show()}cur.x+=cur.sp*dt;
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#6aa8e8');gr.addColorStop(1,'#d8ecf8');g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle='#4a8a3a';g.fillRect(0,H-40,W,40);g.fillStyle='#777';g.fillRect(0,H-46,W,8);
  for(let i=0;i<4;i++){g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.ellipse(((i*190+t*8)%(W+120))-60,40+i*18,40,12,0,0,7);g.fill()}
  drawCraft(g,cur.x,cur.y,TYPES[cur.i][1]);
  /* window frame */g.strokeStyle='#3a2414';g.lineWidth=14;g.strokeRect(7,7,W-14,H-14);g.beginPath();g.moveTo(W/2,0);g.lineTo(W/2,H);g.stroke();g.lineWidth=1;
  g.fillStyle='rgba(0,0,0,.5)';g.fillRect(16,16,210,22);g.fillStyle='#fff';g.font='bold 12px monospace';g.textAlign='left';g.fillText('LOGBOOK '+Object.keys(AP2.log).length+'/'+TYPES.length+' TYPES',22,31)});
 O.msg('Planes fly past the clubhouse window. Name each one to log it. Some are rare!')}
function drawCraft(g,x,y,k){g.save();g.translate(x,y);g.fillStyle='#f4f4f4';
 if(k==='prop'){g.fillRect(-22,-4,44,8);g.fillRect(-6,-14,14,4);g.fillStyle='#d02a2a';g.fillRect(-24,-10,6,6)}
 else if(k==='war'){g.fillStyle='#5a6a3a';g.fillRect(-24,-4,48,8);g.beginPath();g.ellipse(0,0,8,22,Math.PI/2,0,7);g.fill();g.fillStyle='#d02a2a';g.beginPath();g.arc(0,0,4,0,7);g.fill()}
 else if(k==='jet'||k==='jumbo'){const s=k==='jumbo'?1.5:1;g.scale(s,s);g.fillRect(-40,-6,80,12);g.beginPath();g.moveTo(-8,0);g.lineTo(-24,18);g.lineTo(6,0);g.fill();g.fillRect(-42,-18,10,14);g.fillStyle='#2a4a8a';g.fillRect(-36,-2,70,3);if(k==='jumbo'){g.fillStyle='#f4f4f4';g.fillRect(14,-12,22,8)}}
 else if(k==='concorde'){g.beginPath();g.moveTo(50,0);g.lineTo(-40,-4);g.lineTo(-40,4);g.fill();g.beginPath();g.moveTo(10,0);g.lineTo(-36,14);g.lineTo(-36,-2);g.fill()}
 else if(k==='heli'){g.fillStyle='#ffd020';g.beginPath();g.ellipse(0,0,18,10,0,0,7);g.fill();g.fillRect(-36,-3,22,5);g.fillStyle='#222';g.fillRect(-26,-14,52,2);g.fillStyle='#2a8a3a';g.fillRect(-10,-2,20,3)}
 else if(k==='balloon'){const c=['#d02a2a','#ffd020','#2a6ad0'];for(let i=0;i<3;i++){g.fillStyle=c[i];g.beginPath();g.ellipse(-8+i*8,-20,8,26,0,0,7);g.fill()}g.fillStyle='#6a4a2a';g.fillRect(-6,10,12,8)}
 else if(k==='arrows'){for(const[dx,dy]of[[0,0],[-22,-10],[-22,10],[-44,-20],[-44,20]]){g.fillStyle='#d02a2a';g.beginPath();g.moveTo(dx+14,dy);g.lineTo(dx-10,dy-7);g.lineTo(dx-10,dy+7);g.fill();g.fillStyle='rgba(255,255,255,.6)';g.fillRect(dx-60,dy-1,48,2)}}
 g.restore()}

/* ================================================================== SECURITY SCANNER SHIFT */
const OK_ITEMS=['👕','👟','📚','🧸','🎧','🧴','🪥','📷','🧦','🍫','🕶','💻'],BAD=['🔪','🔫','💣','🧨','🪓','🗡'];
function scanner(){const W=600,H=320,O=gameOv('SECURITY SCANNER · MARLOWE AIRPORT',{w:W,h:H,bg:'rgba(8,10,16,.97)'}),g=O.g;let st=null;
 function start(){st={bags:[],t:0,spawn:0,ok:0,bad:0,miss:0,wrong:0,speed:70,len:60};O.clear();const r=O.btn('🛑 SEARCH THIS BAG',flag,'#8a2a1a');r.style.minWidth='200px';O.msg('Bags slide through the X-ray. Tap SEARCH (or the bag, or SPACE) when one under the scanner has something dangerous in it. Let the rest through.')}
 const under=()=>st&&st.bags.find(b=>!b.done&&b.x>220&&b.x<380);
 function flag(){const b=under();if(!b){O.msg('Nothing under the scanner.');return}b.done=1;b.flag=1;if(b.bad){st.ok++;bp(880,.06);O.msg('Good catch! '+b.items.join(' '))}else{st.wrong++;bp(200,.2,'sawtooth');O.msg('Nothing dangerous in that one. The passenger is not amused.')}}
 O.on('pointerdown',()=>flag());const kd=e=>{if(e.key===' '&&st){e.preventDefault();flag()}};addEventListener('keydown',kd);O.onclose=()=>removeEventListener('keydown',kd);
 O.loop(dt=>{g.fillStyle='#0a0e18';g.fillRect(0,0,W,H);g.fillStyle='#2a2e38';g.fillRect(0,200,W,24);for(let x=0;x<W;x+=20){g.fillStyle='#3a3e48';g.fillRect((x+(st?st.t*st.speed:0))%W,204,10,16)}
  g.fillStyle='rgba(60,200,255,.18)';g.fillRect(220,60,160,170);g.strokeStyle='#40c0ff';g.lineWidth=3;g.strokeRect(220,60,160,170);g.lineWidth=1;g.fillStyle='#40c0ff';g.font='bold 12px monospace';g.textAlign='center';g.fillText('X-RAY',300,54);
  if(st){st.t+=dt;st.spawn-=dt;st.speed=70+st.t*1.4;if(st.spawn<=0&&st.t<st.len){st.spawn=rnd(1.1,2)*80/st.speed;const bad=Math.random()<.28,n=2+ri(3),items=[];for(let i=0;i<n;i++)items.push(pk(OK_ITEMS));if(bad)items[ri(n)]=pk(BAD);st.bags.push({x:-90,items,bad,c:pk(['#6a3a2a','#2a3a6a','#3a6a3a','#6a2a5a','#555'])})}
   for(const b of st.bags){b.x+=st.speed*dt;const inX=b.x>220&&b.x<380;g.fillStyle=inX?'rgba(60,200,255,.35)':b.c;g.fillRect(b.x-50,140,100,60);g.strokeStyle='#111';g.strokeRect(b.x-50,140,100,60);if(inX){g.font='22px serif';b.items.forEach((it,i)=>g.fillText(it,b.x-30+i*22,178))}if(b.flag){g.fillStyle='#ff4040';g.font='bold 12px monospace';g.fillText('SEARCHED',b.x,134)}
    if(!b.done&&b.x>420){b.done=1;if(b.bad){st.miss++;bp(150,.3,'sawtooth');O.msg('⚠ A '+b.items.find(i=>BAD.includes(i))+' got through!')}}}
   st.bags=st.bags.filter(b=>b.x<W+80);
   g.fillStyle='#fff';g.font='bold 13px monospace';g.textAlign='left';g.fillText('CAUGHT '+st.ok+'   MISSED '+st.miss+'   WRONG '+st.wrong,12,24);g.textAlign='right';g.fillText('SHIFT '+Math.max(0,Math.ceil(st.len-st.t))+'s',W-12,24);
   if(st.t>st.len&&!st.bags.some(b=>!b.done)){const pay=Math.max(0,st.ok*6-st.miss*8-st.wrong*3+10);cash+=pay;AP2.shifts++;try{cashUI()}catch(e){}toast('🛂 SECURITY SHIFT DONE · £'+pay);O.msg('Shift over. Caught '+st.ok+', missed '+st.miss+', wrong searches '+st.wrong+'. You earn £'+pay+'.');st=null;O.clear();O.btn('ANOTHER SHIFT',start,'#2a5a8a')}}});
 O.msg('Do a one-minute shift on the X-ray. £6 a catch, minus £8 for each one you miss.');O.clear();O.btn('START A SHIFT',start,'#2a5a8a')}

/* ================================================================== SURFING (Sunhaven surfboard hire) */
function surf(){const W=600,H=320,O=gameOv('SURF LESSON · SUNHAVEN BAY',{w:W,h:H,bg:'rgba(6,24,34,.97)'}),g=O.g;let st=null,hold=0;
 function start(){if(cash<10)return O.msg('Board hire is £10.');cash-=10;try{cashUI()}catch(e){}st={t:0,x:0,y:0,vy:0,on:1,bal:.5,dist:0,tricks:0,air:0};O.clear();const b=O.btn('HOLD TO PUMP / RELEASE TO JUMP',()=>{},'#1a6a8a');b.style.minWidth='260px';b.onpointerdown=()=>hold=1;b.onpointerup=b.onpointerleave=()=>{if(hold)jump();hold=0};O.msg('Hold to pump along the wave face, let go at the lip to launch a trick. Land flat or you wipe out.')}
 function jump(){if(!st||!st.on||st.air)return;st.air=1;st.vy=-160-st.bal*120;bp(600,.06)}
 O.on('pointerdown',()=>hold=1);O.on('pointerup',()=>{if(hold)jump();hold=0});
 const kd=e=>{if(e.key===' '){e.preventDefault();if(!hold)hold=1}},ku=e=>{if(e.key===' '){if(hold)jump();hold=0}};addEventListener('keydown',kd);addEventListener('keyup',ku);O.onclose=()=>{removeEventListener('keydown',kd);removeEventListener('keyup',ku)};
 O.loop(dt=>{const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#7ac8f0');gr.addColorStop(1,'#e8f6fa');g.fillStyle=gr;g.fillRect(0,0,W,H);
  const t=st?st.t:performance.now()/1000,wave=x=>200-70*Math.exp(-Math.pow((x-300)/120,2))+6*Math.sin(x*.05+t*3);
  g.fillStyle='#1a7aa8';g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=8)g.lineTo(x,wave(x));g.lineTo(W,H);g.fill();g.fillStyle='#fff';for(let x=200;x<400;x+=6)g.fillRect(x,wave(x)-2,4,2);
  if(st){st.t+=dt;if(st.on){if(!st.air){st.bal=Math.max(0,Math.min(1,st.bal+(hold?dt*.7:-dt*.5)));st.dist+=(30+st.bal*60)*dt;st.y=wave(300)-10;if(st.bal<=0&&st.t>3){st.on=0;O.msg('You lost the wave.')}}
    else{st.vy+=420*dt;st.y+=st.vy*dt;st.rot=(st.rot||0)+dt*6;if(st.y>=wave(300)-10){st.air=0;const r=((st.rot%(Math.PI*2))+Math.PI*2)%(Math.PI*2),flat=r<.7||r>5.6;if(flat){st.tricks++;const spins=Math.round((st.rot||0)/(Math.PI*2));O.msg('TRICK LANDED'+(spins?' · '+spins+' SPIN'+(spins>1?'S':''):'')+'!');bp(880,.08)}else{st.on=0;O.msg('WIPEOUT! You eat a mouthful of the Atlantic.');bp(150,.3,'sawtooth')}st.rot=0}}}
   if(st.t>40&&st.on){st.on=0;O.msg('The wave peters out on the sand. Lovely run!')}
   if(!st.on&&!st.end){st.end=1;const sc=Math.round(st.dist+st.tricks*80);if(sc>AP2.surf)AP2.surf=sc;const prize=sc>1600?15:sc>900?6:0;if(prize){cash+=prize;try{cashUI()}catch(e){}}O.msg(O.info.innerHTML+' Score '+sc+' (best '+AP2.surf+')'+(prize?' · the surf school gives you £'+prize:''));O.clear();O.btn('ANOTHER WAVE (£10)',start,'#1a6a8a')}
   g.save();g.translate(300,st.y);g.rotate(st.rot||0);g.fillStyle='#ffd040';g.fillRect(-26,6,52,6);g.fillStyle='#e0b090';g.fillRect(-4,-22,8,26);g.beginPath();g.arc(0,-28,7,0,7);g.fill();g.restore();
   g.fillStyle='rgba(0,0,0,.45)';g.fillRect(8,8,230,40);g.fillStyle='#fff';g.font='bold 13px monospace';g.textAlign='left';g.fillText('DISTANCE '+Math.round(st.dist)+'  TRICKS '+st.tricks,14,26);g.fillStyle='#333';g.fillRect(14,34,200,8);g.fillStyle='#40d070';g.fillRect(14,34,200*st.bal,8)}});
 O.msg('Hire a board for £10 and ride the Sunhaven break. A good run earns a prize from the surf school.');O.clear();O.btn('HIRE A BOARD (£10)',start,'#1a6a8a')}

/* ================================================================== the three rooms */
const LOOK={
'COZY AIRWAYS':{wall:0x8a6a44,floor:'wood',build(){
  /* clubhouse: propellers, maps, a windsock picture, the tea hatch, the simulator and the spotting window */
  const prop=tex(256,64,(g,W,H)=>{g.fillStyle='#5a3a1a';g.fillRect(0,H/2-8,W,16);g.fillStyle='#3a2410';g.beginPath();g.arc(W/2,H/2,14,0,7);g.fill();g.fillStyle='#c8a040';g.fillRect(0,H/2-8,14,16);g.fillRect(W-14,H/2-8,14,16)});
  for(const z of[-3,3])wallPic(-RX,2.6,z,2.4,.6,prop);
  const map=tex(256,180,(g,W,H)=>{g.fillStyle='#e8dcb8';g.fillRect(0,0,W,H);g.strokeStyle='#8a6a3a';g.lineWidth=6;g.strokeRect(0,0,W,H);g.fillStyle='#7aa868';g.beginPath();g.ellipse(90,90,60,40,.3,0,7);g.fill();g.beginPath();g.ellipse(190,110,40,30,-.2,0,7);g.fill();g.strokeStyle='#c82020';g.lineWidth=2;g.setLineDash([6,4]);g.beginPath();g.moveTo(80,80);g.lineTo(190,110);g.stroke();g.setLineDash([]);g.fillStyle='#2a2a2a';g.font='bold 14px Georgia';g.fillText('COZY · MARLOWE · SUNHAVEN',30,165)});
  wallPic(-RX,1.6,0,1.4,1.0,map);
  /* tea hatch on the left wall */B(-RX+.5,0,-.4,.9,1.05,1.8,0x6a4a2a);B(-RX+.5,1.05,-.4,1.0,.06,1.9,0xd8c8a0);B(-RX+.4,1.11,-.8,.2,.25,.2,0xf4f4f0);B(-RX+.5,1.11,0,.3,.12,.3,0xd89050);blk(-RX,-RX+1.0,-1.4,.6);
  ia(-RX+1.0,-RX+2.2,-1.4,.6,'TEA HATCH',()=>menuOv('THE TEA HATCH','rgba(30,20,10,.97)','"Kettle\'s always on for members." Pilots run on tea and cake.',[['A MUG OF TEA',1,4,20,'A proper builder\'s brew.'],['VICTORIA SPONGE',2,18,6,'Jam and cream. Lovely.'],['BACON BUTTY',3,30,6,'Brown sauce, obviously.'],['FLAPJACK',1,12,8,'Chewy and good for flying.']]));
  /* the simulator */B(-8.6,0,0,1.6,.8,1.0,0x2a2a30);B(-8.6,.8,-.3,1.4,.6,.08,0x101418);B(-8.6,.86,-.27,1.2,.45,.02,0x5aa0e8);B(-8.6,.8,.25,.2,.25,.2,0x333);blk(-9.4,-7.8,-.5,.5);
  ia(-9.6,-7.6,.5,1.6,'FLYING LESSON (£15)',lesson);
  /* the spotting window, on the door wall */const sky=tex(256,128,(g,W,H)=>{const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#6aa8e8');gr.addColorStop(1,'#d8ecf8');g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle='#4a8a3a';g.fillRect(0,H-26,W,26);drawCraft(g,140,50,'prop')});
  sPlane(3.2,1.6,-7.5,1.8,RZ-.04,Math.PI,sky);B(-7.5,.85,RZ-.25,3.4,.08,.4,0x6a4a2a);ia(-9.2,-5.8,RZ-1.6,RZ-.4,()=>'PLANE SPOTTING · LOGBOOK '+Object.keys(AP2.log).length+'/'+TYPES.length,spotting);
  /* windsock picture */const ws=tex(128,128,(g,W,H)=>{g.fillStyle='#cfe6f8';g.fillRect(0,0,W,H);g.fillStyle='#444';g.fillRect(20,20,4,100);for(let i=0;i<5;i++){g.fillStyle=i%2?'#fff':'#ff6a1a';g.fillRect(24+i*18,24+i*2,18,22-i*3)}});wallPic(-RX,1.6,3.6,.7,.7,ws)}},
'MARLOWE AIRPORT':{wall:0xdfe6ec,floor:'tile2',build(){
  /* a tall glass hall: window panels along the back, gate signs, the baggage carousel and the security scanner */
  for(let x=-RX+1;x<2.4;x+=1.6){B(x,0,-RZ+.06,.06,3.5,.06,0x2a2e38)}const glass=tex(256,128,(g,W,H)=>{const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#5a8ac8');gr.addColorStop(1,'#cfe0f0');g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle='#8a94a8';for(let i=0;i<9;i++)g.fillRect(i*30,H-20-((i*37)%40),24,60);g.fillStyle='#fff';g.fillRect(150,30,60,8);g.fillRect(170,22,8,24)});
  for(const x of[-10,-6.5])sPlane(3.2,1.8,x,2.2,-RZ+.05,0,glass);
  for(const[x,t]of[[-11,'GATES 1-6 ↑'],[-4.5,'BAGGAGE RECLAIM ↓']])sPlane(2.2,.4,x,3.1,-RZ+.08,0,txtTex(512,92,'#1a1a1a','#ffd24a',t,44));
  /* baggage carousel between the benches */const car=new THREE.Group();SG.add(car);B(-7.2,0,0,4.4,.5,1.6,0x6a7078);B(-7.2,.5,0,4.6,.04,1.8,0x2a2a2a);blk(-9.5,-4.9,-.9,.9);
  const bags=[];for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.5,.35,.3),new THREE.MeshBasicMaterial({color:pk([0x6a3a2a,0x2a3a6a,0x3a6a3a,0x8a1a2a,0x555555,0xd8b040])}));car.add(m);bags.push(m)}MA.bags=bags;MA.t=0;
  ia(-9.6,-4.8,.9,1.7,'BAGGAGE CAROUSEL',()=>toast(pk(['SOMEBODY\'S TARTAN SUITCASE GOES ROUND FOR THE FOURTH TIME','A SURFBOARD COMES OUT. NOBODY CLAIMS IT','A PUSHCHAIR, A GOLF BAG, A BOX OF KIPPERS','"IS THAT MINE? NO. IS THAT? NO."'])));
  /* security: arch + belt on the left wall */B(-RX+1.6,0,-1.0,2.6,.75,.8,0x3a3e48);B(-RX+1.6,.75,-1.0,2.6,.05,.6,0x1a1a1a);B(-RX+1.6,.8,-1.0,.9,.7,.85,0x9aa0a8);B(-RX+3.4,0,-1.7,.12,2.2,.12,0x9aa0a8);B(-RX+3.4,0,-.3,.12,2.2,.12,0x9aa0a8);B(-RX+3.4,2.2,-1.0,.14,.14,1.5,0x9aa0a8);blk(-RX+.2,-RX+3.0,-1.5,-.5);
  sPlane(1.6,.36,-RX+1.6,2.2,-1.45,0,txtTex(512,116,'#14223a','#ffffff','SECURITY',52));ia(-RX+.2,-RX+3.0,-.5,.4,()=>'SECURITY SCANNER: WORK A SHIFT'+(AP2.shifts?' ('+AP2.shifts+' DONE)':''),scanner)}},
'SUNHAVEN AIRPORT':{wall:0x6ac8c0,floor:'wood',floorCol:0xe8d4a0,build(){
  /* open-air terminal: palms, a thatched canopy over the desk, the tiki bar, surf hire and a beach-cart reclaim */
  const palm=(x,z)=>{B(x,0,z,.22,2.6,.22,0x8a6a3a);for(let i=0;i<6;i++){const a=i/6*6.283;B(x+Math.cos(a)*.6,2.55,z+Math.sin(a)*.6,1.3*Math.abs(Math.cos(a))+.25,.06,1.3*Math.abs(Math.sin(a))+.25,0x2a8a3a)}blk(x-.25,x+.25,z-.25,z+.25)};
  for(const[x,z]of[[-RX+.8,-RZ+.8],[-RX+.8,RZ-.8],[-3,RZ-.8],[1.6,-RZ+1.0]])palm(x,z);
  B(0,2.4,-RZ+2.4,6.2,.12,2.2,0xc8a060);for(let i=0;i<8;i++)B(-2.9+i*.83,2.28,-RZ+1.3,.1,.14,.1,0xa08040);for(const x of[-2.9,2.9])B(x,0,-RZ+3.4,.14,2.4,.14,0x8a6a3a);
  const sun=tex(256,128,(g,W,H)=>{const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#ff9a5a');gr.addColorStop(.6,'#ffd8a0');gr.addColorStop(.61,'#2a8ab0');gr.addColorStop(1,'#1a5a8a');g.fillStyle=gr;g.fillRect(0,0,W,H);g.fillStyle='#fff4b0';g.beginPath();g.arc(W/2,H*.6,22,Math.PI,0);g.fill()});
  for(const x of[-10,-6.5])sPlane(3.2,1.8,x,2.0,-RZ+.05,0,sun);
  /* tiki bar */B(-RX+1.4,0,-1.0,2.4,1.05,.8,0x8a5a2a);B(-RX+1.4,1.05,-1.0,2.6,.08,1.0,0xd8b070);B(-RX+1.4,2.3,-1.0,2.8,.14,1.4,0xc8a060);for(const x of[-RX+.3,-RX+2.5])B(x,0,-1.0,.12,2.3,.12,0x6a4a2a);for(let i=0;i<4;i++)B(-RX+.6+i*.5,1.13,-1.1,.12,.22,.12,[0xff6a8a,0xffd040,0x40c0a0,0xff8a3a][i]);
  blk(-RX+.1,-RX+2.7,-1.45,-.55);sPlane(1.8,.34,-RX+1.4,2.55,-.29,0,txtTex(512,96,'#3a1a08','#ffe08a','TIKI BAR',56));
  ia(-RX+.1,-RX+2.7,-.55,.5,'TIKI BAR',()=>menuOv('THE TIKI BAR','rgba(40,20,8,.97)','"Aloha! Welcome to Sunhaven." Everything comes with a little umbrella.',[['PINEAPPLE PUNCH',4,6,22,'Fruity, with an umbrella in it.'],['COCONUT COOLER',4,8,20,'Served in an actual coconut.'],['SUNHAVEN SUNRISE',5,6,26,'Orange, grenadine and a sparkler.'],['FISH TACOS',7,40,8,'Fresh off the boats this morning.']]));
  /* surfboard rack */for(let i=0;i<5;i++)B(-8.4+i*.42,0,1.4,.14,2.0,.55,[0xff6a1a,0x2ab0d0,0xffd040,0xe04a8a,0x40c060][i]);B(-7.6,0,1.1,2.4,.12,.2,0x6a4a2a);blk(-8.8,-6.4,1.0,1.8);
  sPlane(1.8,.34,-7.6,2.4,1.02,Math.PI,txtTex(512,96,'#0a4a6a','#ffffff','SURF HIRE',56));ia(-8.8,-6.4,.1,1.0,()=>'SURFBOARD HIRE (£10)'+(AP2.surf?' · BEST '+AP2.surf:''),surf);
  /* the beach-cart reclaim */B(-4.6,0,3.6,1.8,.5,1.0,0xd8a050);for(const[x,z]of[[-5.2,3.2],[-4.0,3.2],[-5.2,4.0],[-4.0,4.0]])B(x,0,z,.08,.5,.08,0x444);for(let i=0;i<3;i++)B(-5.1+i*.55,.5,3.6,.45,.35+i*.05,.3,[0x2a3a6a,0xd02a2a,0x3a6a3a][i]);blk(-5.6,-3.6,3.0,4.2);
  sPlane(1.8,.3,-4.6,1.6,3.0,Math.PI,txtTex(512,86,'#f0e0a0','#3a2a10','BAGGAGE RECLAIM',44))}}};
const MA={bags:null,t:0};
{const u0=updCozy;updCozy=function(dt){u0(dt);if(!MA.bags)return;if(!GS.inside||!MA.bags[0].parent||!MA.bags[0].parent.parent){MA.bags=null;return}MA.t+=dt*.25;const n=MA.bags.length;MA.bags.forEach((m,i)=>{const u=(MA.t+i/n)%1,per=2*(4.2+1.4),d=u*per;let x,z;if(d<4.2){x=-9.3+d;z=-.7}else if(d<5.6){x=-5.1;z=-.7+(d-4.2)}else if(d<9.8){x=-5.1-(d-5.6);z=.7}else{x=-9.3;z=.7-(d-9.8)}m.position.set(x,.72,z);m.rotation.y=i})}}
{const b0=buildShop;buildShop=function(o){b0(o);if(!o||!o.apt)return;MA.bags=null;const L=LOOK[o.t];if(!L)return;try{restyle(L.wall,L.floor,L.floorCol);L.build()}catch(e){czErr(e,'airports2.js')}}}
{const l0=leaveShop;leaveShop=function(imm){MA.bags=null;return l0(imm)}}
})();
