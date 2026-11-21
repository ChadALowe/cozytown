/* COZYTOWN BOXING CLUB (Foundry Lane)
   Fights: read the opponent's TELL (his glove glows and pulls back), DODGE the right way or BLOCK,
   then COUNTER while he's open for double damage. Watch his GUARD: a HIGH guard stops jabs and hooks
   (go UPPERCUT), a LOW guard stops uppercuts (go JAB/HOOK). Punching costs stamina; gassed = weak.
   Knocked down? Mash punches to beat the count. Training (speed bag, skipping, heavy bag) raises
   SPEED, POWER and STAMINA. Six-fighter ladder to the Cozytown belt; bare-knuckle bouts for Big Terry. */
(function(){
const TAU=Math.PI*2,$i=id=>document.getElementById(id),pk=a=>a[Math.floor(Math.random()*a.length)];
const BX={xp:{spd:0,pow:0,sta:0},beat:0,belt:0,tDay:0,tN:0,bk:0};window.BOXING=BX;
{const s0=cozySave,l0=cozyLoad;cozySave=function(){const o=s0();o.bx=BX;return o};cozyLoad=function(z){l0(z);if(z&&z.bx){Object.assign(BX,z.bx);BX.xp=Object.assign({spd:0,pow:0,sta:0},z.bx.xp)}}}
const lv=k=>Math.min(5,Math.floor(BX.xp[k]/120));
const FIGHTERS=[
 {n:'DODGY DAVE',hp:70,purse:60,col:'#d8a070',hair:'#5a3a1a',shorts:'#3a6ad8',moves:['jab','hookL','hookR'],tell:1.0,gap:[1.6,2.6],gsw:3.5,dmg:.8,quote:'"I used to be a contender. In darts."'},
 {n:'BIG SANDRA',hp:95,purse:110,col:'#f0c8a8',hair:'#c83a2a',shorts:'#d83a8a',moves:['hookL','hookR','hookL','jab'],tell:.85,gap:[1.4,2.4],gsw:3,dmg:1.1,quote:'"Come here, sunshine."'},
 {n:'KID LIGHTNING',hp:85,purse:170,col:'#8a5a3a',hair:'#101010',shorts:'#f0d020',moves:['jab','jab','flurry','hookL','hookR'],tell:.6,gap:[.9,1.8],gsw:2.2,dmg:.9,quote:'"Blink and you\'ll miss me."'},
 {n:'THE BUTCHER',hp:120,purse:260,col:'#e8b898',hair:'#202020',shorts:'#8a1010',moves:['upper','hookL','upper','hookR','jab'],tell:.75,gap:[1.2,2.2],gsw:2,dmg:1.25,quote:'"I\'ve handled tougher cuts than you."'},
 {n:'IRON MIKE McCOZY',hp:140,purse:420,col:'#c89878',hair:'#3a2a1a',shorts:'#202020',moves:['jab','hookL','hookR','upper','flurry'],tell:.55,gap:[.9,1.7],gsw:1.6,dmg:1.3,quote:'"Everyone has a plan till they meet me."'},
 {n:'"GENTLEMAN" JIM',hp:170,purse:800,col:'#f0d0b0',hair:'#e8e0c8',shorts:'#d8b030',moves:['jab','flurry','hookL','hookR','upper','upper'],tell:.45,gap:[.7,1.4],gsw:1.3,dmg:1.45,quote:'"Shall we dance, old sport?"'}];
const BARE=[{n:'MAD DOG MURPHY',hp:110,purse:350,col:'#e0b090',hair:'#a03010',shorts:'#4a4a3a',moves:['hookL','hookR','upper','flurry'],tell:.6,gap:[.9,1.6],gsw:1.8,dmg:1.5,quote:'"No gloves. No rules."',bare:1},
 {n:'THE SCRAPMAN',hp:150,purse:500,col:'#b88868',hair:'#303030',shorts:'#2a3a2a',moves:['upper','hookL','hookR','jab','upper'],tell:.55,gap:[.8,1.5],gsw:1.5,dmg:1.6,quote:'"I\'ll crush you like a Fiesta."',bare:1}];
const MV={jab:{tell:.55,dmg:7,blk:.15,dodge:'any'},hookL:{tell:1,dmg:13,blk:.3,dodge:'R'},hookR:{tell:1,dmg:13,blk:.3,dodge:'L'},upper:{tell:1.25,dmg:20,blk:1,dodge:'any'},flurry:{tell:.8,dmg:5,blk:.2,dodge:'any',n:3}};
const PU={jab:{wind:.12,rec:.2,cost:6,dmg:4},hook:{wind:.24,rec:.36,cost:12,dmg:8},upper:{wind:.34,rec:.5,cost:18,dmg:12}};

/* ================================================================ the fight */
function fight(F,done){const spd=lv('spd'),pow=lv('pow'),sta=lv('sta');
 const me={hp:100,st:100,maxSt:85+sta*10,act:null,dod:0,dodDir:0,dodCd:0,blk:0,stun:0,kd:0,score:0},op={hp:F.hp,max:F.hp,s:'idle',t:rr(F.gap),mv:null,open:0,guard:'high',gT:F.gsw,kd:0,fl:0,score:0};
 const st={round:1,rt:50,msg:'',msgT:0,shake:0,flash:0,flashC:'#f00',count:0,ph:'intro',introT:2,mash:0,over:0,between:0};
 function rr(a){return a[0]+Math.random()*(a[1]-a[0])}
 const say=(t,c)=>{st.msg=t;st.msgT=1;st.msgC=c||'#fff'};
 const punch=k=>{if(st.ph==='down'&&me.down){st.mash=Math.min(1.2,st.mash+.11);beep(500+st.mash*400,.04,'square',.03);return}if(st.ph!=='fight'||me.act||me.stun>0||me.dod>0||me.blk)return;const p=PU[k];if(me.st<4)return say('GASSED!','#ff8');me.st-=p.cost;me.act={k,t:0,p,hit:0}};
 const dodge=d=>{if(st.ph!=='fight'||me.dod>0||me.dodCd>0||me.stun>0||me.act)return;me.dod=.42+spd*.04;me.dodDir=d;me.dodCd=.24;beep(300,.04,'triangle',.02)};
 function opHit(dmg,txt){op.hp-=dmg;op.score+=0;me.score+=dmg;st.shake=.18;st.flash=.12;st.flashC='#fff';say(txt||'',txt==='COUNTER!'?'#ffd24a':'#fff');beep(160+Math.random()*60,.08,'square',.07);if(op.s==='tell'&&dmg>=8){op.s='stun';op.t=.6;op.open=0;say('INTERRUPTED!','#7cf')}
  if(op.hp<=0){op.hp=0;op.kd++;st.ph='down';me.down=0;op.s='down';st.count=0;st.cT=0;say('DOWN!','#ff4040');beep(90,.5,'sawtooth',.08)}}
 function meHit(dmg){if(F.bare)dmg*=1.15;me.hp-=dmg;st.shake=.25;st.flash=.2;st.flashC='#c00';me.stun=.32;me.act=null;beep(110,.12,'sawtooth',.08);if(me.hp<=0){me.hp=0;me.kd++;st.ph='down';me.down=1;st.count=0;st.cT=0;st.mash=0;say('YOU\'RE DOWN! MASH PUNCH TO GET UP!','#ff4040')}}
 function step(S,dt){if(st.over)return;st.msgT-=dt;st.shake=Math.max(0,st.shake-dt);st.flash=Math.max(0,st.flash-dt);
  if(st.ph==='intro'){st.introT-=dt;if(st.introT<=0){st.ph='fight';say('FIGHT!','#ffd24a');beep(880,.3,'square',.07)}return}
  if(st.ph==='between'){st.between-=dt;if(st.between<=0){st.ph='fight';st.round++;st.rt=50;say('ROUND '+st.round,'#ffd24a');beep(1200,.4,'sine',.07)}return}
  if(st.ph==='down'){st.cT+=dt;if(st.cT>.8){st.cT=0;st.count++;beep(700,.06,'square',.04)}
   if(me.down){st.mash=Math.max(0,st.mash-dt*(.18+me.kd*.06));if(st.mash>=1){st.ph='fight';me.down=0;me.hp=Math.max(25,60-me.kd*15);me.st=me.maxSt*.6;say('BACK ON YOUR FEET!','#7f7')}else if(st.count>=10||me.kd>=3)return end(0,me.kd>=3?'THREE KNOCKDOWNS. TKO.':'KNOCKED OUT!')}
   else{const getup=op.kd===1?.95:op.kd===2?.6:0;if(st.count===(op.kd===1?4:7)&&!st.tried){st.tried=1;if(Math.random()<getup){st.ph='fight';op.hp=Math.round(op.max*(op.kd===1?.5:.3));op.s='idle';op.t=1.2;say('HE\'S UP!','#fbb')}}if(st.count>=10||op.kd>=3)return end(1,op.kd>=3?'TKO! THE REF STOPS IT!':'KNOCKOUT!')}
   if(st.ph==='fight')st.tried=0;return}
  /* fight */st.rt-=dt;if(st.rt<=0){if(st.round>=3){return end(me.score+me.hp*.3>op.score+op.hp*.3*(100/op.max)?1:0,'POINTS DECISION')}st.ph='between';st.between=3;me.st=me.maxSt;me.hp=Math.min(100,me.hp+15);op.hp=Math.min(op.max,op.hp+op.max*.1);say('END OF ROUND '+st.round,'#ffd24a');beep(1200,.4,'sine',.07);return}
  me.st=Math.min(me.maxSt,me.st+dt*(me.act?4:14+sta*2));me.stun=Math.max(0,me.stun-dt);me.dodCd=Math.max(0,me.dodCd-(me.dod>0?0:dt));if(me.dod>0)me.dod-=dt;
  if(me.act){const a=me.act;a.t+=dt;if(!a.hit&&a.t>=a.p.wind*(1-spd*.06)){a.hit=1;let d=a.p.dmg*(1+pow*.14)*(me.st<10?.45:1);const k=a.k;
    if(op.s==='stun'||op.s==='open'){opHit(d*2,'COUNTER!')}else if(op.s==='tell'){opHit(d*1.2,k==='jab'?'':'GOOD!')}else if(op.s==='strike'){opHit(d,'')}
    else{const blocked=(op.guard==='high'&&k!=='upper')||(op.guard==='low'&&k==='upper');if(blocked){say('BLOCKED','#aaa');beep(240,.05,'square',.03);op.score+=1}else opHit(d,k==='upper'?'UPPERCUT!':'')}}
   if(a.t>=a.p.wind+a.p.rec*(1-spd*.07))me.act=null}
  /* opponent */op.t-=dt;op.gT-=dt;if(op.gT<0&&op.s==='idle'){op.gT=F.gsw*(.7+Math.random()*.6);op.guard=op.guard==='high'?'low':'high'}
  if(op.s==='idle'&&op.t<=0){op.mv=pk(F.moves);op.s='tell';op.t=MV[op.mv].tell*F.tell*(1-Math.min(.3,(st.round-1)*.1));op.fl=MV[op.mv].n||1}
  else if(op.s==='tell'&&op.t<=0){op.s='strike';op.t=.14;const m=MV[op.mv];
   const dodged=me.dod>0&&(m.dodge==='any'||(m.dodge==='L'&&me.dodDir<0)||(m.dodge==='R'&&me.dodDir>0));
   if(dodged){say(op.fl>1?'':'DODGED! COUNTER!','#7f7');if(op.fl<=1){op.open=1}}else if(me.blk&&m.blk<1){meHit(m.dmg*m.blk*F.dmg);me.st=Math.max(0,me.st-6);say('BLOCKED','#ccc');me.stun=0}else if(me.blk){meHit(m.dmg*.9*F.dmg);say('CAN\'T BLOCK AN UPPERCUT!','#f88')}else meHit(m.dmg*F.dmg)}
  else if(op.s==='strike'&&op.t<=0){if(op.fl>1){op.fl--;op.s='tell';op.t=.28}else if(op.open){op.s='open';op.t=1.0;op.open=0}else{op.s='idle';op.t=rr(F.gap)*(op.hp<op.max*.3?.7:1)}}
  else if((op.s==='open'||op.s==='stun')&&op.t<=0){op.s='idle';op.t=rr(F.gap)}
 }
 function end(win,why){if(st.over)return;st.over=1;S_.end((win?'🏆 YOU WIN! ':'💫 YOU LOSE. ')+why+(win?' +£'+F.purse:''),()=>done&&done(win));if(win){cash+=F.purse;beep(660,.15,'square',.07);setTimeout(()=>beep(990,.3,'square',.07),150)}HN.en=Math.max(0,HN.en-20)}
 function draw(S,g){const sx=(me.dod>0?-me.dodDir*90:0)+(st.shake>0?(Math.random()-.5)*18:0),sy=st.shake>0?(Math.random()-.5)*12:0;
  /* arena */g.fillStyle=F.bare?'#1a1410':'#12121a';g.fillRect(0,0,480,640);if(!F.bare){for(let i=0;i<60;i++){g.fillStyle=['#2a2a36','#33333f','#24242e'][i%3];g.beginPath();g.arc((i*53)%480,40+((i*37)%120),10,0,TAU);g.fill()}g.fillStyle='#fff3';for(const x of[80,240,400]){g.beginPath();g.moveTo(x-30,0);g.lineTo(x+30,0);g.lineTo(x+120,400);g.lineTo(x-120,400);g.fill()}}
  else{g.fillStyle='#3a2a1a';for(let i=0;i<8;i++)g.fillRect(i*62,140+((i*29)%40),58,100);g.fillStyle='#ffb04066';g.beginPath();g.arc(240,120,160,0,TAU);g.fill()}
  g.fillStyle=F.bare?'#4a3a2a':'#2a4a8a';g.fillRect(0,470,480,170);if(!F.bare){g.strokeStyle='#d02020';g.lineWidth=6;for(const y of[250,320,390]){g.beginPath();g.moveTo(0,y+sx*.1);g.lineTo(480,y-sx*.1);g.stroke()}}
  g.save();g.translate(sx+240,sy);const o=op,tell=o.s==='tell',dz=o.s==='stun'||o.s==='open',down=o.s==='down';
  if(down){g.fillStyle=F.col;g.beginPath();g.ellipse(-40,440,130,40,0,0,TAU);g.fill();g.fillStyle=F.shorts;g.fillRect(40,420,80,40);g.fillStyle=F.col;g.beginPath();g.arc(-150,430,40,0,TAU);g.fill();g.fillStyle='#ffd24a';g.font='bold 80px monospace';g.textAlign='center';g.fillText(String(Math.min(10,st.count)),0,300)}
  else{const lean=tell?(o.mv==='hookL'?-30:o.mv==='hookR'?30:0):0,bob=Math.sin(S.t*4)*4,tilt=dz?Math.sin(S.t*8)*.15:0;g.save();g.translate(lean,bob);g.rotate(tilt);
   /* torso */g.fillStyle=F.col;g.beginPath();g.moveTo(-110,260);g.lineTo(110,260);g.lineTo(80,470);g.lineTo(-80,470);g.closePath();g.fill();g.fillStyle='#0002';g.fillRect(-6,300,12,120);g.fillStyle=F.shorts;g.fillRect(-85,440,170,40);
   /* head */g.fillStyle=F.col;g.beginPath();g.arc(0,200,48,0,TAU);g.fill();g.fillStyle=F.hair;g.beginPath();g.arc(0,180,50,Math.PI,TAU);g.fill();g.fillStyle='#111';const ey=dz?'x':'o';if(dz){g.font='bold 20px monospace';g.textAlign='center';g.fillText('x  x',0,208)}else{g.fillRect(-20,195,10,8);g.fillRect(10,195,10,8)}g.fillStyle='#7a2a2a';g.fillRect(-14,222,28,tell?10:5);
   if(dz){g.fillStyle='#ffd24a';for(let i=0;i<3;i++){const a=S.t*4+i*2.1;g.font='20px monospace';g.fillText('★',Math.cos(a)*50,140+Math.sin(a)*12)}}
   g.restore();
   /* gloves */const gl=(x,y,r,glow)=>{if(glow){g.fillStyle='#ffd24a88';g.beginPath();g.arc(x,y,r+12+Math.sin(S.t*30)*4,0,TAU);g.fill()}g.fillStyle=F.bare?F.col:'#c81e1e';g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.fillStyle='#fff3';g.beginPath();g.arc(x-r*.3,y-r*.3,r*.35,0,TAU);g.fill()};
   const hi=o.guard==='high';let L=[-60+lean,hi?240:360,36],R=[60+lean,hi?240:360,36];if(dz){L=[-90,420,34];R=[90,420,34]}
   if(tell){const m=o.mv;if(m==='hookL')L=[-170,230,30];else if(m==='hookR')R=[170,230,30];else if(m==='upper')R=[40,470,30];else L=[-80,300,30]}
   if(o.s==='strike'){const m=o.mv;if(m==='hookR'||m==='upper')R=[0,m==='upper'?380:330,100];else L=[0,330,100]}
   g.strokeStyle=F.col;g.lineCap='round';g.lineWidth=26;for(const[sx_,G_]of[[-95,L],[95,R]]){g.beginPath();g.moveTo(sx_,285);g.lineTo(G_[0],G_[1]);g.stroke()}
   gl(...L,tell&&(o.mv==='hookL'||o.mv==='jab'||o.mv==='flurry'));gl(...R,tell&&(o.mv==='hookR'||o.mv==='upper'));
   if(tell){g.fillStyle='#ffd24a';g.font='bold 22px monospace';g.textAlign='center';g.fillText(o.mv==='hookL'?'◀ HOOK — DODGE ▶':o.mv==='hookR'?'HOOK ▶ — ◀ DODGE':o.mv==='upper'?'UPPERCUT! DODGE!':o.mv==='flurry'?'FLURRY!':'JAB',0,120)}
   if(!dz&&!tell&&o.s==='idle'){g.fillStyle='#fff8';g.font='bold 13px monospace';g.textAlign='center';g.fillText(hi?'HIGH GUARD — GO UPPERCUT':'LOW GUARD — JAB / HOOK',0,140)}}
  g.restore();
  /* your gloves */const a=me.act,pr=a?Math.min(1,a.t/a.p.wind):0,bk=me.blk;const myG=(x,y,r)=>{g.fillStyle=F.bare?'#e0b090':'#2a8a3a';g.beginPath();g.arc(x,y,r,0,TAU);g.fill();g.fillStyle='#fff3';g.beginPath();g.arc(x-r*.3,y-r*.3,r*.35,0,TAU);g.fill()};
  let l=[150,560,52],r=[330,560,52];if(bk){l=[200,470,60];r=[280,470,60]}if(a){if(a.k==='jab')l=[150+(240-150)*pr,560-(560-260)*pr,52-22*pr];else if(a.k==='hook')r=[330+60*Math.sin(pr*3)-(330-240)*pr,560-(560-240)*pr,52-20*pr];else r=[330-90*pr,600-(600-300)*pr,52-18*pr]}
  myG(...l);myG(...r);
  /* HUD */const bar=(x,y,w,v,c,lab)=>{g.fillStyle='#0008';g.fillRect(x,y,w,16);g.fillStyle=c;g.fillRect(x+2,y+2,(w-4)*Math.max(0,v),12);g.fillStyle='#fff';g.font='bold 11px monospace';g.textAlign='left';g.fillText(lab,x+4,y+13)};
  bar(10,10,200,me.hp/100,'#40d060','YOU');bar(10,30,200,me.st/me.maxSt,me.st<15?'#f08030':'#40a0ff','STAMINA');bar(270,10,200,op.hp/op.max,'#e04040',F.n);g.fillStyle='#ffd24a';g.font='bold 16px monospace';g.textAlign='center';g.fillText(st.ph==='between'?'BREAK':'R'+st.round+' · '+Math.max(0,Math.ceil(st.rt)),240,66);
  if(st.ph==='intro'){g.fillStyle='#000a';g.fillRect(0,250,480,140);g.fillStyle='#ffd24a';g.font='bold 30px monospace';g.fillText(F.n,240,300);g.fillStyle='#fff';g.font='14px monospace';g.fillText(F.quote,240,335);g.fillText(F.bare?'BARE-KNUCKLE · NO ROUNDS':'3 ROUNDS',240,360)}
  if(st.ph==='down'&&me.down){g.fillStyle='#000a';g.fillRect(0,200,480,200);g.fillStyle='#fff';g.font='bold 70px monospace';g.fillText(String(Math.min(10,st.count)),240,290);g.fillStyle='#333';g.fillRect(90,330,300,24);g.fillStyle='#40d060';g.fillRect(90,330,300*Math.min(1,st.mash),24);g.fillStyle='#fff';g.font='bold 14px monospace';g.fillText('MASH ANY PUNCH!',240,380)}
  if(st.msgT>0&&st.msg){g.globalAlpha=Math.min(1,st.msgT*2);g.fillStyle=st.msgC;g.font='bold 30px monospace';g.textAlign='center';g.strokeStyle='#000';g.lineWidth=5;g.strokeText(st.msg,240,560-st.msgT*40);g.fillText(st.msg,240,560-st.msgT*40);g.globalAlpha=1}
  if(st.flash>0){g.fillStyle=st.flashC;g.globalAlpha=st.flash*2;g.fillRect(0,0,480,640);g.globalAlpha=1}}
 const S_=RESORT2.MG(F.bare?'🩸 BARE-KNUCKLE':'🥊 THE RING',{init(S){S.info('◀ ▶ DODGE · BLOCK · JAB / HOOK / UPPER   (KEYS: ← → ↓ · Z X C)');if(F.bare)S.rt=999;
   S.btns([['◀',()=>dodge(-1)],['🛡',()=>{if(st.ph==='fight'&&!me.act)me.blk=1},()=>me.blk=0],['▶',()=>dodge(1)],['JAB',()=>punch('jab')],['HOOK',()=>punch('hook')],['UPPER',()=>punch('upper')]])},
  key(S,k,d){if(k==='ArrowLeft'&&d)dodge(-1);else if(k==='ArrowRight'&&d)dodge(1);else if(k==='ArrowDown'||k==='s'||k==='S'){me.blk=d&&st.ph==='fight'&&!me.act?1:0}else if(d&&(k==='z'||k==='Z'||k===' '||k==='j'))punch('jab');else if(d&&(k==='x'||k==='X'||k==='k'))punch('hook');else if(d&&(k==='c'||k==='C'||k==='l'||k==='ArrowUp'))punch('upper')},
  step(S,dt){if(F.bare)st.rt=999;step(S,dt)},draw,close(){if(!st.over){HN.en=Math.max(0,HN.en-10)}}});
 if(!S_)return;}

/* ================================================================ training mini-games */
function train(kind){if(BX.tDay!==DAY){BX.tDay=DAY;BX.tN=0}if(BX.tN>=4)return toast('COACH: "ENOUGH FOR TODAY. REST UP, CHAMP."');if(HN.en<12)return toast('TOO TIRED TO TRAIN. GET SOME SLEEP.');BX.tN++;HN.en-=8;
 const st={score:0,n:0,t:0,res:''},gain=k=>{const before=lv(k);BX.xp[k]+=st.score;const msg='+'+st.score+' '+k.toUpperCase()+' XP'+(lv(k)>before?' · LEVEL UP! '+k.toUpperCase()+' '+lv(k):'');return msg};
 if(kind==='speed'){const beats=24,iv=.5-lv('spd')*.03;st.next=1;RESORT2.MG('🥊 SPEED BAG',{init(S){S.info('TAP AS THE RING HITS THE BAG. STAY ON THE BEAT!');S.btns([['HIT!',()=>hit(S)]])},key(S,k,d){if(d&&(k===' '||k==='z'))hit(S)},
   step(S,dt){st.t+=dt;if(st.t>st.next+.25){st.res='MISS';st.n++;st.next+=iv}if(st.n>=beats)S.end('SPEED BAG DONE · '+gain('spd'))},
   draw(S,g){g.fillStyle='#1a1a22';g.fillRect(0,0,480,640);g.fillStyle='#5a3a1a';g.fillRect(140,120,200,30);g.fillStyle='#c81e1e';const sw=Math.sin(st.t*TAU/iv)*20;g.beginPath();g.ellipse(240+sw,260,50,70,0,0,TAU);g.fill();const p=Math.max(0,(st.next-st.t)/iv);g.strokeStyle='#ffd24a';g.lineWidth=6;g.beginPath();g.arc(240,260,60+p*140,0,TAU);g.stroke();
    g.fillStyle='#fff';g.font='bold 22px monospace';g.textAlign='center';g.fillText(st.res,240,470);g.fillText('XP '+st.score+'  ·  '+st.n+'/'+beats,240,520)}});
  function hit(S){const e=Math.abs(st.t-st.next);if(e<.06){st.score+=5;st.res='PERFECT';beep(1200,.04,'square',.04)}else if(e<.14){st.score+=3;st.res='GOOD';beep(900,.04,'square',.03)}else{st.res='OFF BEAT';beep(200,.04,'square',.03)}if(e<.25){st.n++;st.next+=iv}}}
 else if(kind==='skip'){st.a=0;st.sp=3;st.jump=0;RESORT2.MG('🪢 SKIPPING',{init(S){S.info('JUMP WHEN THE ROPE SWINGS UNDER YOUR FEET. IT GETS FASTER!');S.btns([['JUMP!',()=>jmp()]])},key(S,k,d){if(d&&(k===' '||k==='ArrowUp'))jmp()},
   step(S,dt){st.a+=st.sp*dt;st.jump=Math.max(0,st.jump-dt);if(st.a>=TAU){st.a-=TAU;if(st.jump>0){st.n++;st.score+=3;st.sp=Math.min(9,st.sp+.18);beep(700,.03,'square',.03)}else{S.end('TRIPPED AFTER '+st.n+' SKIPS · '+gain('sta'));beep(150,.2,'sawtooth',.05)}}},
   draw(S,g){g.fillStyle='#1a1a22';g.fillRect(0,0,480,640);const y=st.jump>0?Math.sin(st.jump/.45*Math.PI)*70:0;g.fillStyle='#2a8a3a';g.fillRect(215,330-y,50,120);g.fillStyle='#e0b090';g.beginPath();g.arc(240,300-y,28,0,TAU);g.fill();g.fillStyle='#202060';g.fillRect(218,450-y,44,60);
    g.strokeStyle='#ffd24a';g.lineWidth=4;g.beginPath();const ry=380+Math.cos(st.a)*190;g.moveTo(200,380-y);g.quadraticCurveTo(240,ry,280,380-y);g.stroke();g.fillStyle=Math.cos(st.a)>.85?'#ff4040':'#fff';g.font='bold 22px monospace';g.textAlign='center';g.fillText('SKIPS '+st.n,240,600)}});
  function jmp(){if(st.jump<=0)st.jump=.45}}
 else{st.p=0;st.dir=1;RESORT2.MG('💥 HEAVY BAG',{init(S){S.info('HIT WHEN THE POWER BAR PEAKS. 10 PUNCHES.');S.btns([['PUNCH!',()=>pun(S)]])},key(S,k,d){if(d&&(k===' '||k==='z'))pun(S)},
   step(S,dt){st.p+=st.dir*dt*(1.6+st.n*.12);if(st.p>1){st.p=1;st.dir=-1}if(st.p<0){st.p=0;st.dir=1}st.t=Math.max(0,st.t-dt)},
   draw(S,g){g.fillStyle='#1a1a22';g.fillRect(0,0,480,640);g.fillStyle='#6a3a1a';const sw=st.t*30;g.save();g.translate(240,120);g.rotate(sw*.01);g.fillRect(-60,40,120,280);g.restore();g.fillStyle='#333';g.fillRect(60,500,360,30);const hue=st.p>.9?'#ff4040':st.p>.7?'#ffd24a':'#40d060';g.fillStyle=hue;g.fillRect(60,500,360*st.p,30);
    g.fillStyle='#fff';g.font='bold 22px monospace';g.textAlign='center';g.fillText('XP '+st.score+'  ·  '+st.n+'/10',240,580)}});
  function pun(S){if(st.n>=10)return;const v=st.p>.92?6:st.p>.75?3:1;st.score+=v;st.n++;st.t=.6;beep(120+v*30,.08,'square',.06);if(st.n>=10)setTimeout(()=>S.end('BAG WORK DONE · '+gain('pow')),300)}}}

/* ================================================================ the gym interior + coach */
const GYM='COZYTOWN BOXING CLUB';TH[GYM]={wall:0x6a6a70,fl:'wood',cnt:0x202020,top:0x303030,pal:[0xc81e1e],back:0,left:0,sh:0x101010};KEEP[GYM]=['COACH MICKEY','Hands up, chin down.'];HRS[GYM]=[7,23];
{const b0=buildShop;buildShop=function(o){if(!o||o.t!==GYM)return b0(o);while(SG.children.length)SG.remove(SG.children[0]);RX=7;RZ=5.5;o.sz=RZ-.9;SHK=null;const Hh=IH+1.6,B=(x,y,z,w,h,d,hex)=>sbox(x,y,z,w,h,d,fmc(hex));
 SG.add(new THREE.Mesh(new THREE.PlaneGeometry(2*RX,2*RZ).rotateX(-Math.PI/2),imat(FLR.wood())));const wm=tx=>{const m=imat(tx);m.color.setHex(0x8a8a90);return m};
 splane(2*RX,Hh,0,Hh/2,-RZ,0,wm(sWl));splane(2*RX,Hh,0,Hh/2,RZ,Math.PI,wm(sWl));splane(2*RZ,Hh,RX,Hh/2,0,-Math.PI/2,wm(sWl2));splane(2*RZ,Hh,-RX,Hh/2,0,Math.PI/2,wm(sWl2));
 const vd=new THREE.Mesh(new THREE.BoxGeometry(90,70,90),new THREE.MeshBasicMaterial({color:0x0a0a0c,side:THREE.BackSide,fog:false}));vd.position.y=Hh/2;SG.add(vd);splane(1.1,2.2,1.6,1.1,RZ-.02,Math.PI,imat(T_FDOOR));
 IROOM.splice(0,IROOM.length,[-RX-1,RX+1,-RZ-1,-RZ+.25],[-RX-1,-RX+.25,-RZ,RZ],[RX-.25,RX+1,-RZ,RZ]);IA.splice(0,IA.length);
 /* the ring */const cx=-2.6,cz=-1.4,h=.55,w=3;B(cx,0,cz,2*w,h,2*w,0x2a4a8a);B(cx,h,cz,2*w-.2,.02,2*w-.2,0x3a6ad8);for(const[a,b]of[[-1,-1],[1,-1],[1,1],[-1,1]])B(cx+a*(w-.1),0,cz+b*(w-.1),.16,1.9,.16,a*b>0?0xc81e1e:0x2a5ad8);
 for(const y of[1.0,1.35,1.7]){B(cx,y,cz-w+.1,2*w,.04,.04,0xf0f0f0);B(cx,y,cz+w-.1,2*w,.04,.04,0xf0f0f0);B(cx-w+.1,y,cz,.04,.04,2*w,0xf0f0f0);B(cx+w-.1,y,cz,.04,.04,2*w,0xf0f0f0)}IROOM.push([cx-w,cx+w,cz-w,cz+w]);
 personIn(pSpec(9101,{f:false,hs:2,ts:2,tc:[.1,.5,.2],gl:false,scarf:null,bp:false,bag:0}),cx-.7,cz,Math.PI/2).position.y=h;personIn(pSpec(9102,{f:true,hs:5,ts:2,tc:[.8,.1,.1],gl:false,scarf:null,bp:false,bag:0}),cx+.7,cz,-Math.PI/2).position.y=h;
 /* heavy bags, speed bag, skipping mat, weights, mirror */for(const z of[-3.8,-2.0]){B(5.6,1.5,z,.7,1.5,.7,0x6a3a1a);B(5.6,3,z,.06,1.2,.06,0x808080)}IROOM.push([5.1,6.1,-4.3,-1.5]);
 B(5.9,0,1.2,.6,1.4,1.4,0x3a3a3a);B(5.4,1.9,1.2,.5,.08,1,0x6a4a2a);B(5.3,1.6,1.2,.28,.36,.28,0xc81e1e);IROOM.push([5.2,RX,.4,2]);
 B(3.6,0,3.8,2,.03,1.4,0x2a8a3a);B(3.6,1.4,RZ-.04,2.4,2,.04,0xb8d4e4);for(let k=0;k<4;k++)B(-5.8+k*.5,0,4.4,.3,.3,.3,0x202020);B(-5.2,0,4.4,1.8,.5,.4,0x5a5a60);IROOM.push([-6.2,-4.2,4.1,4.8]);
 sPlane(2,1.3,-1,2.3,-RZ+.03,0,txtTex(512,330,'#101010','#ff3030','FIGHT NIGHT',64));sPlane(1.6,1.2,2.6,2.2,-RZ+.03,0,txtTex(512,380,'#d8c8a0','#202020',BX.belt?'CHAMPION: YOU!':'CHAMPION: JIM',40));
 if(BX.belt)B(-1,3.2,-RZ+.08,1.2,.35,.06,0xd8b030);
 /* Coach Mickey */personIn(pSpec(9100,{f:false,old:true,hs:1,ts:1,tc:[.2,.2,.24],gl:false,beard:true,scarf:null,bp:false,bag:0}),1.6,-3.9,0);
 SHOPCUR={o,k:['COACH MICKEY','Hands up, chin down.']};
 IA.push({r:[.6,2.6,-3.4,-2.2],label:'🥊 TALK TO COACH MICKEY',fn:()=>openShop('box')},{r:[4.3,5.6,-4.3,-1.5],label:'💥 HEAVY BAG (POWER)',fn:()=>train('bag')},{r:[4.3,5.4,.4,2],label:'🥊 SPEED BAG (SPEED)',fn:()=>train('speed')},{r:[2.6,4.6,3,4.6],label:'🪢 SKIPPING (STAMINA)',fn:()=>train('skip')},
  {r:[cx-w,cx+w,cz+w,cz+w+1.1],label:'🔔 STEP INTO THE RING',fn:()=>openShop('box')},{r:[1.0,2.2,RZ-.35,RZ],label:'LEAVE',fn:()=>leaveShop()})}}
CUSTOM_SHOP.box=function(msg){$i('shT').textContent='🥊 COZYTOWN BOXING CLUB';$i('shMsg').textContent=msg||'SPEED '+lv('spd')+'/5 · POWER '+lv('pow')+'/5 · STAMINA '+lv('sta')+'/5 · ENERGY '+Math.round(HN.en)+(BX.belt?' · 🏆 CHAMPION':'');
 FIGHTERS.forEach((F,i)=>{const beat=i<BX.beat,next=i===BX.beat,lock=i>BX.beat;dRow((beat?'✓ ':lock?'🔒 ':'▶ ')+F.n+(lock?'':'  ·  PURSE £'+(beat?Math.round(F.purse/2):F.purse))+(i===5?'  · THE BELT':''),[[lock?'LOCKED':'FIGHT',()=>{if(lock)return renderShop('"Beat '+FIGHTERS[BX.beat].n+' first."');if(HN.en<25)return renderShop('"You\'re knackered. Sleep first."');closeShop();const F2=Object.assign({},F,{purse:beat?Math.round(F.purse/2):F.purse});setTimeout(()=>fight(F2,win=>{if(win&&next){BX.beat++;if(i===5){BX.belt=1;try{TOWNSHOPS.col['THE COZYTOWN BELT']=1}catch(e){}CRIME.big('CHAMPION!','THE COZYTOWN BELT IS YOURS',3200)}}}),200)}]])});
 dRow('COACH\'S TIPS',[['READ',()=>renderShop(pk(['"Watch for the glow. Hook from his left? Slip RIGHT."','"High guard? Go under it with an uppercut."','"Low guard? Jab and hook to the head."','"Dodge, then hit him while he\'s open. Double damage."','"Don\'t throw everything. Gassed boxers get flattened."','"Uppercuts can\'t be blocked. DODGE them."']))]]);dRow('',[['DONE',()=>closeShop()]])};
/* Big Terry's bare-knuckle bouts at night */
{const t0=CUSTOM_SHOP.terry;if(t0)CUSTOM_SHOP.terry=function(msg){t0(msg);if(!(GT>=21||GT<4)||(window.CJ&&CJ.job))return;const list=document.getElementById('shList'),last=list.lastChild;BARE.forEach(F=>{dRow('🩸 BARE-KNUCKLE: '+F.n+'  ·  £'+F.purse,[['FIGHT',()=>{if(HN.en<25)return renderShop('"You\'re in no state, son."');closeShop();setTimeout(()=>fight(F,win=>{if(win&&window.CJ){CJ.rep++;BX.bk++}if(Math.random()<.2)CRIME.heat(1,'ILLEGAL FIGHTING',{always:1})}),200)}]])});if(last)list.appendChild(last)}}
window.BOXING2={fight,train,FIGHTERS,BARE,BX,lv};
})();
